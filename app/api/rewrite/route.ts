import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { rewriteBullet } from '@/lib/ai/rewriter';
import { saveBulletRewrite, logUserEvent } from '@/lib/db/queries';

const Schema = z.object({
  scanId: z.string().uuid(),
  originalBullet: z.string().min(5),
  targetRole: z.string().optional(),
  targetIndustry: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { user } = session;

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid request' }, { status: 400 });

  const { scanId, originalBullet, targetRole, targetIndustry } = parsed.data;

  const rewriteStream = await rewriteBullet({ originalBullet, targetRole, targetIndustry });

  let fullRewrite = '';
  const encoder = new TextEncoder();
  const transformedStream = new ReadableStream({
    async start(controller) {
      const reader = rewriteStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          fullRewrite += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        await saveBulletRewrite({ scanId, userId: user.id, originalBullet, rewrittenBullet: fullRewrite });
        await logUserEvent(user.id, 'rewrite_requested', { scanId });
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(transformedStream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
