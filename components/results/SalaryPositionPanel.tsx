'use client';

import { motion } from 'framer-motion';
import { ArrowUp, DollarSign } from 'lucide-react';
import type { SalaryAnalysis } from '@/types';

interface SalaryPositionPanelProps {
  analysis: SalaryAnalysis;
}

export function SalaryPositionPanel({ analysis }: SalaryPositionPanelProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-slate-500" />
            <p className="text-xs text-slate-500 uppercase tracking-wider">Current Positioning</p>
          </div>
          <p className="text-xl font-mono font-bold text-white">{analysis.currentBand}</p>
        </div>
        {analysis.targetBand && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="w-4 h-4 text-green-400" />
              <p className="text-xs text-green-400 uppercase tracking-wider">Target Band</p>
            </div>
            <p className="text-xl font-mono font-bold text-green-400">{analysis.targetBand}</p>
          </div>
        )}
      </div>

      {analysis.gap && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-400 font-semibold mb-1">Gap Analysis</p>
          <p className="text-sm text-slate-300">{analysis.gap}</p>
        </div>
      )}

      {analysis.topChanges.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Top Changes to Close the Gap</h3>
          <div className="space-y-2">
            {analysis.topChanges.map((change, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
              >
                <span className="text-blue-400 font-mono text-sm font-bold">{i + 1}.</span>
                <p className="text-sm text-slate-300">{change}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
