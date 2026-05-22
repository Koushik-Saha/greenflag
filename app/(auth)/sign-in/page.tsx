'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ScanLine } from 'lucide-react';
import { signIn } from '@/lib/auth/actions';

const STATS = [
  ['12,847+', 'Resumes Scanned'],
  ['89%', 'Found Bias Risks'],
  ['4.2x', 'More Interviews'],
];

export default function SignInPage() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gf-void)' }}>
      {/* Left panel — branding */}
      <div style={{
        width: '42%', flexShrink: 0,
        background: 'linear-gradient(160deg, #0A1F12 0%, #060D08 100%)',
        borderRight: '1px solid var(--gf-border)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '40px 44px',
      }} className="hidden lg:flex">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #00E887, #007A3D)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(0,232,135,0.3)',
          }}>
            <ScanLine size={18} color="#060A07" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--gf-text-primary)', letterSpacing: '-0.3px' }}>
            Green<span style={{ color: 'var(--gf-signal)' }}>Flag</span>
          </span>
        </Link>

        <div>
          <blockquote style={{
            fontSize: 22, fontWeight: 500, lineHeight: 1.6,
            color: 'var(--gf-text-secondary)',
            marginBottom: 16,
          }}>
            &ldquo;Found 3 bias risks in my resume I never would have caught.&rdquo;
          </blockquote>
          <p style={{ fontSize: 13, color: 'var(--gf-text-tertiary)' }}>— Software Engineer, landed role at Meta</p>
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {STATS.map(([val, label]) => (
              <div key={label}>
                <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--gf-signal)', fontFamily: 'var(--font-mono, monospace)' }}>{val}</p>
                <p style={{ fontSize: 11, color: 'var(--gf-text-tertiary)', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Mobile logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 28 }} className="lg:hidden">
            <div style={{
              width: 28, height: 28,
              background: 'linear-gradient(135deg, #00E887, #007A3D)',
              borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ScanLine size={14} color="#060A07" />
            </div>
            <span style={{ fontWeight: 700, color: 'var(--gf-text-primary)', fontSize: 15 }}>
              Green<span style={{ color: 'var(--gf-signal)' }}>Flag</span>
            </span>
          </Link>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gf-text-primary)', letterSpacing: '-0.4px' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--gf-text-tertiary)', fontSize: 14, marginTop: 4 }}>
              Sign in to your account to continue
            </p>
          </div>

          <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--gf-text-tertiary)', marginBottom: 6 }}>
                Email address
              </label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                className="gf-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--gf-text-tertiary)', marginBottom: 6 }}>
                Password
              </label>
              <input
                id="password" name="password" type="password" required autoComplete="current-password"
                className="gf-input"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <p style={{ fontSize: 13, color: 'var(--gf-score-low)' }}>{state.error}</p>
              </div>
            )}

            <button
              type="submit" disabled={pending}
              style={{
                width: '100%',
                background: 'var(--gf-signal)',
                color: '#060A07',
                fontSize: 14, fontWeight: 700,
                padding: '11px 0',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                transition: 'opacity 0.15s',
                opacity: pending ? 0.6 : 1,
                marginTop: 4,
                boxShadow: '0 0 20px rgba(0,232,135,0.25)',
              }}
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--gf-text-tertiary)', marginTop: 24 }}>
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" style={{ color: 'var(--gf-signal)', fontWeight: 600, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
