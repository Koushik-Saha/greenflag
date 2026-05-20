'use client';

import { motion } from 'framer-motion';
import { InlineRewriter } from './InlineRewriter';
import type { ImpactAnalysis } from '@/types';

const STRENGTH_STYLE: Record<string, string> = {
  STRONG: 'bg-green-500/20 border-green-500/30 text-green-400',
  MEDIUM: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
  WEAK: 'bg-red-500/20 border-red-500/30 text-red-400',
};

interface BulletAnalyzerProps {
  scanId: string;
  analysis: ImpactAnalysis;
  targetRole?: string;
  targetIndustry?: string;
}

export function BulletAnalyzer({ scanId, analysis, targetRole, targetIndustry }: BulletAnalyzerProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {[
          { label: 'Strong', count: analysis.strongCount, color: 'text-green-400' },
          { label: 'Medium', count: analysis.mediumCount, color: 'text-amber-400' },
          { label: 'Weak', count: analysis.weakCount, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <span className={`text-2xl font-mono font-bold ${s.color}`}>{s.count}</span>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {analysis.bullets.map((bullet, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="flex items-start gap-2 mb-2">
              <span className={`text-xs font-mono font-bold border rounded px-1.5 py-0.5 ${STRENGTH_STYLE[bullet.strength]}`}>
                {bullet.strength}
              </span>
              <p className="text-sm text-slate-300">{bullet.text}</p>
            </div>
            {(bullet.strength === 'WEAK' || bullet.strength === 'MEDIUM') && (
              <div className="ml-16">
                <InlineRewriter
                  scanId={scanId}
                  originalBullet={bullet.text}
                  targetRole={targetRole}
                  targetIndustry={targetIndustry}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
