'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserByEmail, createUser } from '@/lib/db/queries';
import { hashPassword, verifyPassword } from './password';
import { createSession, deleteSession } from './session';

const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function signUp(_prevState: { error?: string } | null, formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await getUserByEmail(email);
  if (existing) return { error: 'An account with this email already exists.' };

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, name, passwordHash });

  await createSession(user.id);
  redirect('/dashboard');
}

export async function signIn(_prevState: { error?: string } | null, formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = SignInSchema.safeParse(raw);
  if (!parsed.success) return { error: 'Invalid email or password.' };

  const { email, password } = parsed.data;

  const user = await getUserByEmail(email);
  if (!user) return { error: 'Invalid email or password.' };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { error: 'Invalid email or password.' };

  await createSession(user.id);
  redirect('/dashboard');
}

export async function signOut() {
  await deleteSession();
  redirect('/sign-in');
}
