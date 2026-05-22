import { getCurrentUser } from '@/lib/actions/user';
import { getUserScans } from '@/lib/db/queries';
import Link from 'next/link';
import { ScanLine, Ghost, TrendingUp, Award, BarChart2, Infinity } from 'lucide-react';

function scoreColor(score?: number | null): string {
  if (!score) return 'var(--gf-text-muted)';
  if (score >= 80) return 'var(--gf-score-high)';
  if (score >= 60) return 'var(--gf-score-mid)';
  return 'var(--gf-score-low)';
}

function scoreBadgeBg(score?: number | null): string {
  if (!score) return 'rgba(42,74,54,0.3)';
  if (score >= 80) return 'rgba(0,232,135,0.12)';
  if (score >= 60) return 'rgba(245,158,11,0.12)';
  return 'rgba(239,68,68,0.12)';
}

function scoreBadgeBorder(score?: number | null): string {
  if (!score) return 'rgba(42,74,54,0.4)';
  if (score >= 80) return 'rgba(0,232,135,0.25)';
  if (score >= 60) return 'rgba(245,158,11,0.25)';
  return 'rgba(239,68,68,0.25)';
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const scans = await getUserScans(user.id, 5);

  const completedScans = scans.filter(s => s.overallScore);
  const bestScore = completedScans.reduce((max, s) => Math.max(max, s.overallScore ?? 0), 0) || null;
  const avgScore = completedScans.length
    ? Math.round(completedScans.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / completedScans.length)
    : null;
  const scansLeft = user.plan === 'free' ? (user.scansLimit ?? 3) - (user.scansUsed ?? 0) : null;

  const STATS = [
    { label: 'Total Scans', value: user.scansUsed ?? 0, icon: BarChart2, accent: 'var(--gf-signal)' },
    { label: 'Best Score', value: bestScore ?? '—', icon: Award, accent: 'var(--gf-score-high)' },
    { label: 'Avg Score', value: avgScore ?? '—', icon: TrendingUp, accent: 'var(--gf-score-mid)' },
    { label: 'Scans Left', value: scansLeft === null ? '∞' : scansLeft, icon: Infinity, accent: '#A78BFA' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gf-text-primary)', letterSpacing: '-0.4px' }}>
          Welcome back, {user.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p style={{ color: 'var(--gf-text-tertiary)', marginTop: 4, fontSize: 14 }}>
          Here&apos;s your resume intelligence overview.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {STATS.map(stat => (
          <div key={stat.label} style={{
            background: 'var(--gf-card)',
            border: '1px solid var(--gf-border)',
            borderRadius: 14,
            padding: '18px 16px',
          }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: `rgba(${stat.accent === 'var(--gf-signal)' ? '0,232,135' : stat.accent === 'var(--gf-score-mid)' ? '245,158,11' : stat.accent === '#A78BFA' ? '167,139,250' : '0,232,135'}, 0.1)`,
              border: `1px solid rgba(${stat.accent === 'var(--gf-signal)' ? '0,232,135' : stat.accent === 'var(--gf-score-mid)' ? '245,158,11' : stat.accent === '#A78BFA' ? '167,139,250' : '0,232,135'}, 0.2)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <stat.icon size={17} color={stat.accent} />
            </div>
            <p style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: 'var(--font-mono, monospace)',
              color: stat.accent,
              lineHeight: 1,
              letterSpacing: '-1px',
            }}>
              {String(stat.value)}
            </p>
            <p style={{ fontSize: 11, color: 'var(--gf-text-tertiary)', marginTop: 4 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        <Link href="/scan" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px',
          background: 'var(--gf-signal)',
          color: '#060A07',
          fontSize: 14, fontWeight: 700,
          borderRadius: 10,
          textDecoration: 'none',
          transition: 'opacity 0.15s',
          boxShadow: '0 0 20px rgba(0,232,135,0.3)',
        }}>
          <ScanLine size={16} />
          Scan New Resume
        </Link>
        <Link href="/scan?ghost=1" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px',
          background: 'var(--gf-card)',
          color: 'var(--gf-text-secondary)',
          fontSize: 14, fontWeight: 600,
          borderRadius: 10,
          border: '1px solid var(--gf-border)',
          textDecoration: 'none',
          transition: 'all 0.15s',
        }}>
          <Ghost size={16} />
          Check Ghost Job
        </Link>
      </div>

      {/* Recent Scans */}
      {scans.length > 0 ? (
        <div style={{
          background: 'var(--gf-card)',
          border: '1px solid var(--gf-border)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--gf-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--gf-text-secondary)' }}>Recent Scans</h2>
            <Link href="/history" style={{ fontSize: 12, color: 'var(--gf-signal)', textDecoration: 'none', fontWeight: 500 }}>
              View all →
            </Link>
          </div>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--gf-border)' }}>
                {['Resume / Role', 'Date', 'Score', 'Action'].map(h => (
                  <th key={h} style={{
                    padding: '10px 20px',
                    textAlign: 'left',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--gf-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scans.map((scan, i) => (
                <tr key={scan.id} style={{
                  borderBottom: i < scans.length - 1 ? '1px solid rgba(30,56,40,0.5)' : 'none',
                }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--gf-text-primary)' }}>
                    {scan.targetRole ?? 'Untitled Scan'}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--gf-text-tertiary)', fontSize: 12 }}>
                    {scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {scan.overallScore ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '2px 10px',
                        borderRadius: 20,
                        fontSize: 12, fontWeight: 700,
                        fontFamily: 'var(--font-mono, monospace)',
                        color: scoreColor(scan.overallScore),
                        background: scoreBadgeBg(scan.overallScore),
                        border: `1px solid ${scoreBadgeBorder(scan.overallScore)}`,
                      }}>
                        {scan.overallScore}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--gf-text-muted)', fontSize: 12 }}>{scan.status}</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/results/${scan.id}`} style={{ fontSize: 12, fontWeight: 600, color: 'var(--gf-signal)', textDecoration: 'none' }}>
                      View results →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          background: 'var(--gf-card)',
          border: '1px dashed var(--gf-border)',
          borderRadius: 16,
          padding: '60px 20px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: 14,
            background: 'rgba(0,232,135,0.08)',
            border: '1px solid rgba(0,232,135,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <ScanLine size={24} color="var(--gf-signal)" />
          </div>
          <h3 style={{ fontWeight: 600, color: 'var(--gf-text-primary)', marginBottom: 6 }}>No scans yet</h3>
          <p style={{ fontSize: 13, color: 'var(--gf-text-tertiary)', marginBottom: 20 }}>
            Upload your resume to get your first 11-lens analysis.
          </p>
          <Link href="/scan" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: 'var(--gf-signal)',
            color: '#060A07',
            fontSize: 13, fontWeight: 700,
            borderRadius: 10,
            textDecoration: 'none',
          }}>
            <ScanLine size={15} />
            Start your first scan
          </Link>
        </div>
      )}
    </div>
  );
}
