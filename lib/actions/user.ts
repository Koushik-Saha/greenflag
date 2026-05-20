'use server';

import { getSession } from '@/lib/auth/session';
import { updateUser } from '@/lib/db/queries';
import type { WorkAuthorization } from '@/types';

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function updateUserProfile(data: {
  name?: string;
  targetRole?: string;
  targetIndustry?: string;
  targetSalary?: number;
  workAuthorization?: WorkAuthorization;
  isOPT?: boolean;
}) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return updateUser(session.user.id, data);
}

export async function checkScanLimit() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  const { user } = session;
  if (user.plan !== 'free') return { canScan: true, remaining: Infinity };
  const remaining = (user.scansLimit ?? 3) - (user.scansUsed ?? 0);
  return { canScan: remaining > 0, remaining };
}
