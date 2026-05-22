'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ScanLine, CheckCircle } from 'lucide-react';
import { signUp } from '@/lib/auth/actions';

const FEATURES = [
  'ATS Parse Score + Keyword Match',
  'Bias Risk & AI Detection scores',
  'Ghost Job Detector (free forever)',
  'OPT / Visa Friendliness score',
  'Bullet strength analyzer',
];

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUp, null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gf-void)' }}>
      {/* Left panel */}
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
          <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--gf-text-primary)', lineHeight: 1.35, marginBottom: 10, letterSpacing: '-0.4px' }}>
            11 ways to find what&apos;s holding your resume back.
          </h2>
          <p style={{ fontSize: 13, color: 'var(--gf-text-tertiary)', marginBottom: 28 }}>
            Free to start. No credit card needed.
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--gf-text-secondary)' }}>
                <CheckCircle size={15} color="var(--gf-signal)" style={{ flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel */}
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
              Create your account
            </h1>
            <p style={{ color: 'var(--gf-text-tertiary)', fontSize: 14, marginTop: 4 }}>
              Free — 3 full scans included, no card needed
            </p>
          </div>

          <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--gf-text-tertiary)', marginBottom: 6 }}>
                Full name
              </label>
              <input
                id="name" name="name" type="text" required autoComplete="name"
                className="gf-input"
                placeholder="Jane Smith"
              />
            </div>

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
                Password{' '}
                <span style={{ color: 'var(--gf-text-muted)', fontWeight: 400 }}>(min. 8 characters)</span>
              </label>
              <input
                id="password" name="password" type="password" required minLength={8} autoComplete="new-password"
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
              {pending ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--gf-text-tertiary)', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href="/sign-in" style={{ color: 'var(--gf-signal)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
