import { getCurrentUser } from '@/lib/actions/user';
import { getUserScans } from '@/lib/db/queries';
import Link from 'next/link';

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const scans = await getUserScans(user.id, 50);

  const scoreColor = (score?: number | null) => {
    if (!score) return 'text-slate-500';
    if (score >= 80) return 'bg-green-500/20 text-green-400';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Scan History</h1>
      <p className="text-slate-500 mb-8">{scans.length} scan{scans.length !== 1 ? 's' : ''} total</p>

      {scans.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 mb-4">No scans yet.</p>
          <Link href="/scan" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">
            Scan Your First Resume
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Target Role</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Overall</th>
                <th className="px-4 py-3 text-left">ATS</th>
                <th className="px-4 py-3 text-left">Keywords</th>
                <th className="px-4 py-3 text-left">Impact</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {scans.map(scan => (
                <tr key={scan.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-white">{scan.targetRole ?? 'General Scan'}</td>
                  <td className="px-4 py-3 text-slate-500">{scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${scoreColor(scan.overallScore)}`}>
                      {scan.overallScore ?? '—'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-mono text-xs ${scan.atsScore && scan.atsScore >= 80 ? 'text-green-400' : scan.atsScore && scan.atsScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{scan.atsScore ?? '—'}</td>
                  <td className={`px-4 py-3 font-mono text-xs ${scan.keywordScore && scan.keywordScore >= 80 ? 'text-green-400' : 'text-slate-500'}`}>{scan.keywordScore ?? '—'}</td>
                  <td className={`px-4 py-3 font-mono text-xs ${scan.impactScore && scan.impactScore >= 80 ? 'text-green-400' : 'text-slate-500'}`}>{scan.impactScore ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${scan.status === 'complete' ? 'text-green-400' : scan.status === 'error' ? 'text-red-400' : 'text-slate-500'}`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {scan.status === 'complete' && (
                      <Link href={`/results/${scan.id}`} className="text-xs text-blue-400 hover:text-blue-300">
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
