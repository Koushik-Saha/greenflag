'use client';

import { motion } from 'framer-motion';
import { ScoreRing } from '@/components/ui/score-ring';
import { CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import type { ScoreAnalysis } from '@/types';

interface ScoreCardProps {
  name: string;
  analysis: ScoreAnalysis;
}

const SEVERITY_COLOR: Record<string, string> = {
  high: 'text-red-400 border-red-400/20 bg-red-400/10',
  medium: 'text-amber-400 border-amber-400/20 bg-amber-400/10',
  low: 'text-blue-400 border-blue-400/20 bg-blue-400/10',
};

export function ScoreCard({ name, analysis }: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <ScoreRing score={analysis.score} size={80} animated />
        <div>
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="text-sm text-slate-400 mt-1">{analysis.summary}</p>
        </div>
      </div>

      {analysis.highlights.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">What's Working</h3>
          <div className="space-y-2">
            {analysis.highlights.map((h, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-300">{h}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.issues.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Issues Found</h3>
          <div className="space-y-2">
            {analysis.issues.map((issue, i) => (
              <div key={i} className={`flex gap-3 p-3 rounded-lg border ${SEVERITY_COLOR[issue.severity]}`}>
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm">{issue.text}</p>
                  {issue.location && <p className="text-xs opacity-70 mt-0.5">{issue.location}</p>}
                </div>
                <span className="ml-auto text-xs uppercase font-mono opacity-60">{issue.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.suggestions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">How to Fix</h3>
          <div className="space-y-2">
            {analysis.suggestions.map((s, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-300">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
