import { eq, desc, and, gt } from 'drizzle-orm';
import { db } from './index';
import { users, sessions, resumes, scans, bulletRewrites, userEvents } from './schema';
import type { EventName } from '@/types';

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] ?? null;
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createUser(data: { email: string; passwordHash: string; name?: string }) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function updateUser(userId: string, data: Partial<typeof users.$inferInsert>) {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return result[0];
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export async function createSessionRecord(userId: string, token: string, expiresAt: Date) {
  const result = await db.insert(sessions).values({ userId, token, expiresAt }).returning();
  return result[0];
}

export async function getSessionWithUser(token: string) {
  const result = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return result[0] ?? null;
}

export async function deleteSessionRecord(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}

// ─── Resumes ─────────────────────────────────────────────────────────────────

export async function createResume(data: {
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  rawText: string;
  parsedSections?: object;
  wordCount?: number;
  pageCount?: number;
}) {
  const result = await db.insert(resumes).values(data).returning();
  return result[0];
}

export async function getResumeById(resumeId: string, userId: string) {
  const result = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .limit(1);
  return result[0] ?? null;
}

// ─── Scans ───────────────────────────────────────────────────────────────────

export async function createScan(data: {
  userId: string;
  resumeId: string;
  jobDescription?: string;
  targetRole?: string;
  targetCompany?: string;
  targetIndustry?: string;
}) {
  const result = await db.insert(scans).values({ ...data, status: 'pending' }).returning();
  return result[0];
}

export async function updateScanScores(scanId: string, scores: Partial<typeof scans.$inferInsert>) {
  const result = await db.update(scans).set(scores).where(eq(scans.id, scanId)).returning();
  return result[0];
}

export async function getUserScans(userId: string, limit = 20) {
  return db.select().from(scans).where(eq(scans.userId, userId)).orderBy(desc(scans.createdAt)).limit(limit);
}

export async function getScanById(scanId: string) {
  const result = await db.select().from(scans).where(eq(scans.id, scanId)).limit(1);
  return result[0] ?? null;
}

// ─── Bullet Rewrites ─────────────────────────────────────────────────────────

export async function saveBulletRewrite(data: {
  scanId: string;
  userId: string;
  originalBullet: string;
  rewrittenBullet: string;
  scoreGain?: number;
}) {
  const result = await db.insert(bulletRewrites).values(data).returning();
  return result[0];
}

export async function markRewriteAccepted(rewriteId: string) {
  return db.update(bulletRewrites).set({ wasAccepted: true }).where(eq(bulletRewrites.id, rewriteId));
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function logUserEvent(userId: string, event: EventName, properties?: object) {
  return db.insert(userEvents).values({ userId, event, properties });
}

export async function incrementScansUsed(userId: string) {
  const user = await db.select({ scansUsed: users.scansUsed }).from(users).where(eq(users.id, userId)).limit(1);
  const current = user[0]?.scansUsed ?? 0;
  return db.update(users).set({ scansUsed: current + 1, updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function getUserEventStats(userId: string) {
  return db.select().from(userEvents).where(eq(userEvents.userId, userId)).orderBy(desc(userEvents.createdAt)).limit(100);
}
