'use client';

import { motion } from 'framer-motion';
import type { GhostJobAnalysis } from '@/types';

interface GhostJobPanelProps {
  analysis: GhostJobAnalysis;
}

function probabilityColor(p: number): string {
  if (p >= 70) return 'text-red-400';
  if (p >= 40) return 'text-amber-400';
  return 'text-green-400';
}

export function GhostJobPanel({ analysis }: GhostJobPanelProps) {
  const color = probabilityColor(analysis.ghostProbability);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 p-6 rounded-2xl border border-white/10 bg-white/5">
        <div className="text-center">
          <span className={`text-5xl font-mono font-bold ${color}`}>{analysis.ghostProbability}%</span>
          <p className="text-xs text-slate-500 mt-1">Ghost Probability</p>
        </div>
        <div className="flex-1">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.ghostProbability}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${analysis.ghostProbability >= 70 ? 'bg-red-500' : analysis.ghostProbability >= 40 ? 'bg-amber-500' : 'bg-green-500'}`}
            />
          </div>
          <p className="text-sm text-slate-300">{analysis.recommendation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Red Flags</h3>
          <div className="space-y-2">
            {analysis.signals.filter(s => s.type === 'negative').map((s, i) => (
              <div key={i} className="flex gap-2 text-sm text-slate-400">
                <span className="text-red-400">✗</span>
                {s.text}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">Good Signals</h3>
          <div className="space-y-2">
            {analysis.signals.filter(s => s.type === 'positive').map((s, i) => (
              <div key={i} className="flex gap-2 text-sm text-slate-400">
                <span className="text-green-400">✓</span>
                {s.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
