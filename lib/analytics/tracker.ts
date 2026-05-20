import { db } from '@/lib/db';
import { userEvents, scans, users } from '@/lib/db/schema';
import { eq, gte, count, avg, desc } from 'drizzle-orm';
import type { EventName } from '@/types';

export async function trackEvent(userId: string, event: EventName, properties?: object) {
  return db.insert(userEvents).values({ userId, event, properties });
}

export async function getEventStats(userId: string) {
  const events = await db.select().from(userEvents)
    .where(eq(userEvents.userId, userId))
    .orderBy(desc(userEvents.createdAt))
    .limit(200);

  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.event] = (counts[e.event] ?? 0) + 1;
  }
  return { events, counts };
}

export async function getProductStats(periodDays = 30) {
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

  const [totalUsers] = await db.select({ count: count() }).from(users);
  const [totalScans] = await db.select({ count: count() }).from(scans);
  const [recentScans] = await db.select({ count: count() }).from(scans).where(gte(scans.createdAt, since));
  const [avgScore] = await db.select({ avg: avg(scans.overallScore) }).from(scans).where(gte(scans.createdAt, since));

  return {
    totalUsers: totalUsers.count,
    totalScans: totalScans.count,
    recentScans: recentScans.count,
    avgScore: avgScore.avg ? Math.round(Number(avgScore.avg)) : null,
    period: periodDays,
  };
}
