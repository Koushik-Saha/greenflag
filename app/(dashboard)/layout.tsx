import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ScanLine, History, Settings, LogOut, Zap, BarChart2 } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import { signOut } from '@/lib/auth/actions';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/scan', icon: ScanLine, label: 'Scan Resume' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  const { user } = session;
  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <div className="gf-ambient" style={{ minHeight: '100vh', display: 'flex', background: 'var(--gf-void)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: '#080D0A',
        borderRight: '1px solid var(--gf-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--gf-border)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #00E887, #007A3D)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0,232,135,0.3)',
            }}>
              <ScanLine size={18} color="#060A07" />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--gf-text-primary)', letterSpacing: '-0.3px' }}>
                Green<span style={{ color: 'var(--gf-signal)' }}>Flag</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className="gf-nav-item">
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Upgrade banner */}
        {user.plan === 'free' && (
          <div style={{
            margin: '0 10px 10px',
            padding: '14px',
            background: 'rgba(0, 232, 135, 0.06)',
            border: '1px solid rgba(0, 232, 135, 0.18)',
            borderRadius: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Zap size={13} color="var(--gf-signal)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gf-signal)' }}>Upgrade to Pro</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--gf-text-tertiary)', lineHeight: 1.5, marginBottom: 10 }}>
              Unlimited scans + all 11 score lenses
            </p>
            <Link href="/pricing" style={{
              display: 'block',
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 700,
              background: 'var(--gf-signal)',
              color: '#060A07',
              padding: '7px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}>
              Get Pro — $19/mo
            </Link>
          </div>
        )}

        {/* User */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--gf-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10 }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: '50%',
              background: 'rgba(0, 232, 135, 0.15)',
              border: '1px solid rgba(0, 232, 135, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'var(--gf-signal)',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gf-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name ?? 'User'}
              </p>
              <p style={{ fontSize: 11, color: 'var(--gf-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.plan === 'pro' ? '✦ Pro' : 'Free plan'}
              </p>
            </div>
            <form action={signOut}>
              <button type="submit" title="Sign out" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--gf-text-muted)', padding: 4, borderRadius: 6,
                display: 'flex', alignItems: 'center',
                transition: 'color 0.15s',
              }}>
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
