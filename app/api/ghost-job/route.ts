import { z } from 'zod';
import { analyzeGhostJob } from '@/lib/ai/ghost-job-scorer';
import { getSession } from '@/lib/auth/session';
import { logUserEvent } from '@/lib/db/queries';

const Schema = z.object({ jobDescription: z.string().min(50) });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Job description too short (min 50 chars)' }, { status: 400 });

  const analysis = await analyzeGhostJob(parsed.data.jobDescription);

  await logUserEvent(session.user.id, 'ghost_job_checked', { ghostProbability: analysis.ghostProbability });

  return Response.json(analysis);
}
