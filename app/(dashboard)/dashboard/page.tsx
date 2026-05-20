import { getCurrentUser } from '@/lib/actions/user';
import { getUserScans } from '@/lib/db/queries';
import Link from 'next/link';
import { ScanLine, Ghost } from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const scans = await getUserScans(user.id, 5);

  const avgScore = scans.length
    ? Math.round(scans.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / scans.filter(s => s.overallScore).length)
    : null;

  const scoreColor = (score?: number | null) => {
    if (!score) return 'text-slate-500';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user.name?.split(' ')[0] ?? 'there'}</h1>
      <p className="text-slate-500 mb-8">Here&apos;s your resume intelligence overview.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Scans', value: user.scansUsed ?? 0 },
          { label: 'Best Score', value: scans.reduce((max, s) => Math.max(max, s.overallScore ?? 0), 0) || '—' },
          { label: 'Avg Score', value: avgScore ?? '—' },
          { label: 'Scans Left', value: user.plan === 'free' ? `${(user.scansLimit ?? 3) - (user.scansUsed ?? 0)}` : '∞' },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border border-white/10 bg-white/5">
            <p className="text-2xl font-mono font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        <Link href="/scan" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">
          <ScanLine className="w-4 h-4" />
          Scan New Resume
        </Link>
        <Link href="/scan?ghost=1" className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/5 transition-all">
          <Ghost className="w-4 h-4" />
          Check Ghost Job (Free)
        </Link>
      </div>

      {scans.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Scans</h2>
            <Link href="/history" className="text-xs text-blue-400 hover:text-blue-300">View all</Link>
          </div>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Resume</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {scans.map(scan => (
                  <tr key={scan.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{scan.targetRole ?? 'Resume'}</td>
                    <td className="px-4 py-3 text-slate-500">{scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : '—'}</td>
                    <td className={`px-4 py-3 font-mono font-bold ${scoreColor(scan.overallScore)}`}>{scan.overallScore ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Link href={`/results/${scan.id}`} className="text-xs text-blue-400 hover:text-blue-300">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {user.plan === 'free' && (
        <div className="mt-8 p-6 rounded-xl border border-blue-500/30 bg-blue-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Upgrade to Pro</p>
              <p className="text-sm text-slate-400 mt-0.5">Unlock all 11 scores, unlimited scans, and inline AI rewrites.</p>
            </div>
            <Link href="/pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap">
              Get Pro — $19/mo
            </Link>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Free scans used</span>
              <span>{user.scansUsed ?? 0} / {user.scansLimit ?? 3}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${((user.scansUsed ?? 0) / (user.scansLimit ?? 3)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
