'use client';

import { ScoreRing } from '@/components/ui/score-ring';
import { motion } from 'framer-motion';

interface OverallScoreRingProps {
  score: number;
  resumeName: string;
  scanDate: string;
}

export function OverallScoreRing({ score, resumeName, scanDate }: OverallScoreRingProps) {
  const grade = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Needs Work' : 'Poor';
  const gradeColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6 p-6 border-b border-white/10"
    >
      <ScoreRing score={score} size={100} animated />
      <div>
        <h1 className="text-xl font-bold text-white">{resumeName}</h1>
        <p className={`text-sm font-semibold ${gradeColor}`}>{grade}</p>
        <p className="text-xs text-slate-500 mt-1">Scanned {new Date(scanDate).toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
}
