import { getSession } from '@/lib/auth/session';
import { getProductStats } from '@/lib/analytics/tracker';
import { z } from 'zod';

const Schema = z.object({ period: z.enum(['7', '30', '90']).default('30') });

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!session.user.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const parsed = Schema.safeParse({ period: searchParams.get('period') });
  const period = parsed.success ? Number(parsed.data.period) : 30;

  const stats = await getProductStats(period);
  return Response.json(stats);
}
