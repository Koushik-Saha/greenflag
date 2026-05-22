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
  const gradeColor = score >= 80 ? 'var(--gf-score-high)' : score >= 60 ? 'var(--gf-score-mid)' : 'var(--gf-score-low)';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '20px 24px',
        borderBottom: '1px solid var(--gf-border)',
        background: 'var(--gf-card)',
      }}
    >
      <ScoreRing score={score} size={96} animated />
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gf-text-primary)', letterSpacing: '-0.3px' }}>
          {resumeName}
        </h1>
        <p style={{ fontSize: 13, fontWeight: 600, color: gradeColor, marginTop: 2 }}>{grade}</p>
        <p style={{ fontSize: 11, color: 'var(--gf-text-tertiary)', marginTop: 4 }}>
          Scanned {new Date(scanDate).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}
