import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ScanLine, History, Settings, LogOut } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import { signOut } from '@/lib/auth/actions';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const { user } = session;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <aside className="w-56 border-r border-white/10 flex flex-col py-6 px-3">
        <div className="px-3 mb-8">
          <Link href="/" className="text-lg font-bold font-mono gradient-text">ResumeScore</Link>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/scan', icon: ScanLine, label: 'New Scan' },
            { href: '/history', icon: History, label: 'History' },
            { href: '/settings', icon: Settings, label: 'Settings' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pt-4 border-t border-white/10 space-y-3">
          <div className="text-xs text-slate-500 truncate">{user.email}</div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors w-full"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
