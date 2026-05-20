'use client';

import { useState, useTransition } from 'react';
import { updateUserProfile } from '@/lib/actions/user';

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [workAuth, setWorkAuth] = useState('');

  const handleSave = () => {
    startTransition(async () => {
      await updateUserProfile({
        targetRole: targetRole || undefined,
        targetIndustry: targetIndustry || undefined,
        workAuthorization: workAuth as 'citizen' | 'gc' | 'h1b' | 'opt' | 'tn' | 'other' || undefined,
        isOPT: workAuth === 'opt',
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-slate-500 mb-8">Personalize your scoring preferences.</p>

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
          <h2 className="font-semibold text-white">Profile</h2>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Target Role</label>
            <input
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Work Authorization</label>
            <select
              value={workAuth}
              onChange={e => setWorkAuth(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
            >
              <option value="">Select...</option>
              <option value="citizen">US Citizen</option>
              <option value="gc">Green Card</option>
              <option value="h1b">H1B</option>
              <option value="opt">OPT / F-1</option>
              <option value="tn">TN Visa</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Industry</label>
            <select
              value={targetIndustry}
              onChange={e => setTargetIndustry(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
            >
              <option value="">Select...</option>
              <option value="bigtech">Big Tech</option>
              <option value="fintech">Fintech</option>
              <option value="consulting">Consulting</option>
              <option value="startup">Startup</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
          >
            {isPending ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
