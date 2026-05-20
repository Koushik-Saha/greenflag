'use client';

import { motion } from 'framer-motion';
import { Shield, Info } from 'lucide-react';
import type { BiasAnalysis } from '@/types';

interface BiasRiskPanelProps {
  analysis: BiasAnalysis;
}

export function BiasRiskPanel({ analysis }: BiasRiskPanelProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            These suggestions help you navigate imperfect hiring systems. Your identity is not the problem — the system is. All fixes are optional and yours to choose.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Potential Screening Friction Points</h3>
        <div className="space-y-4">
          {analysis.risks.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <Shield className="w-5 h-5 text-green-400" />
              <p className="text-sm text-slate-300">No significant bias risk signals detected. Your resume is well-positioned.</p>
            </div>
          ) : (
            analysis.risks.map((risk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3"
              >
                <p className="text-sm font-medium text-white">{risk.signal}</p>
                <p className="text-xs text-slate-500">{risk.reason}</p>
                <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Optional neutralization</p>
                  <p className="text-sm text-slate-300">{risk.neutralization}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
