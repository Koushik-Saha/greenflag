import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getProductStats } from '@/lib/analytics/tracker';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  if (!session.user.isAdmin) redirect('/dashboard');

  const stats = await getProductStats(30);

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers },
          { label: 'Total Scans', value: stats.totalScans },
          { label: 'Scans (30d)', value: stats.recentScans },
          { label: 'Avg Score (30d)', value: stats.avgScore ?? '—' },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border border-white/10 bg-white/5">
            <p className="text-3xl font-mono font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
