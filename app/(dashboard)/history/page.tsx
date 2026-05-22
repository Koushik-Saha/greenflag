import { getCurrentUser } from '@/lib/actions/user';
import { getUserScans } from '@/lib/db/queries';
import Link from 'next/link';
import { ScanLine } from 'lucide-react';

function scoreColor(score?: number | null): string {
  if (!score) return 'var(--gf-text-muted)';
  if (score >= 80) return 'var(--gf-score-high)';
  if (score >= 60) return 'var(--gf-score-mid)';
  return 'var(--gf-score-low)';
}

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const scans = await getUserScans(user.id, 50);

  return (
    <div style={{ padding: '32px', maxWidth: 960 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gf-text-primary)', letterSpacing: '-0.4px' }}>
          Scan History
        </h1>
        <p style={{ color: 'var(--gf-text-tertiary)', marginTop: 4, fontSize: 14 }}>
          {scans.length} scan{scans.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {scans.length === 0 ? (
        <div style={{
          background: 'var(--gf-card)',
          border: '1px dashed var(--gf-border)',
          borderRadius: 16,
          padding: '64px 20px',
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
            Your scan history will appear here after your first analysis.
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
            Scan Your First Resume
          </Link>
        </div>
      ) : (
        <div style={{
          background: 'var(--gf-card)',
          border: '1px solid var(--gf-border)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--gf-border)' }}>
                {['Target Role', 'Date', 'Overall', 'ATS', 'Keywords', 'Impact', 'Status', ''].map(h => (
                  <th key={h} style={{
                    padding: '11px 16px',
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
                  transition: 'background 0.15s',
                }}>
                  <td style={{ padding: '13px 16px', fontWeight: 600, color: 'var(--gf-text-primary)' }}>
                    {scan.targetRole ?? 'General Scan'}
                  </td>
                  <td style={{ padding: '13px 16px', color: 'var(--gf-text-tertiary)', fontSize: 12 }}>
                    {scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: 20,
                      fontSize: 11, fontWeight: 700,
                      fontFamily: 'var(--font-mono, monospace)',
                      color: scoreColor(scan.overallScore),
                      background: scan.overallScore
                        ? `rgba(${scan.overallScore >= 80 ? '0,232,135' : scan.overallScore >= 60 ? '245,158,11' : '239,68,68'}, 0.1)`
                        : 'rgba(42,74,54,0.3)',
                      border: `1px solid rgba(${scan.overallScore && scan.overallScore >= 80 ? '0,232,135' : scan.overallScore && scan.overallScore >= 60 ? '245,158,11' : '239,68,68'}, 0.2)`,
                    }}>
                      {scan.overallScore ?? '—'}
                    </span>
                  </td>
                  {(['atsScore', 'keywordScore', 'impactScore'] as const).map(key => (
                    <td key={key} style={{
                      padding: '13px 16px',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 12, fontWeight: 600,
                      color: scoreColor(scan[key]),
                    }}>
                      {scan[key] ?? '—'}
                    </td>
                  ))}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 500,
                      color: scan.status === 'complete'
                        ? 'var(--gf-score-high)'
                        : scan.status === 'error'
                        ? 'var(--gf-score-low)'
                        : 'var(--gf-text-muted)',
                    }}>
                      {scan.status}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {scan.status === 'complete' && (
                      <Link href={`/results/${scan.id}`} style={{
                        fontSize: 12, fontWeight: 600,
                        color: 'var(--gf-signal)',
                        textDecoration: 'none',
                      }}>
                        View →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
