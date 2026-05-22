'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ScoreRing } from '@/components/ui/score-ring';
import type { ScoreState } from '@/hooks/useScanProgress';
import { Loader2, CheckCircle, Clock } from 'lucide-react';

interface ScanProgressProps {
  scores: ScoreState[];
  overallScore: number | null;
  progress: number;
}

function scoreColor(value: number): string {
  if (value >= 80) return 'var(--gf-score-high)';
  if (value >= 60) return 'var(--gf-score-mid)';
  return 'var(--gf-score-low)';
}

const COPY: Record<string, string> = {
  ats: 'Checking ATS compatibility and section detection...',
  keyword: 'Matching keywords against job description...',
  redFlag: 'Scanning for recruiter red flags...',
  impact: 'Grading each bullet for quantification and impact...',
  readability: 'Simulating a 6-second recruiter scan...',
  bias: 'Running bias risk analysis...',
  aiDetection: 'Checking for AI detection risk...',
  optVisa: 'Analyzing OPT/visa friendliness signals...',
  salary: 'Evaluating salary positioning...',
  trajectory: 'Mapping career trajectory...',
};

export function ScanProgress({ scores, overallScore, progress }: ScanProgressProps) {
  const currentScore = scores.find(s => s.status === 'analyzing');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gf-text-primary)', marginBottom: 8, letterSpacing: '-0.3px' }}>
            Analyzing Your Resume
          </h2>
          <AnimatePresence mode="wait">
            {currentScore && (
              <motion.p
                key={currentScore.name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                style={{ fontSize: 13, color: 'var(--gf-text-tertiary)', fontFamily: 'var(--font-mono, monospace)' }}
              >
                {COPY[currentScore.name] ?? `Analyzing ${currentScore.label}...`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--gf-elevated)', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--gf-signal), var(--gf-forest))',
              borderRadius: 2,
              boxShadow: '0 0 8px rgba(0,232,135,0.5)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          {scores.filter(s => s.name !== 'overall').map((score, i) => {
            const isComplete = score.status === 'complete';
            const isAnalyzing = score.status === 'analyzing';

            return (
              <motion.div
                key={score.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: isAnalyzing
                    ? '1px solid rgba(0,232,135,0.25)'
                    : isComplete
                    ? '1px solid var(--gf-border)'
                    : '1px solid transparent',
                  background: isAnalyzing
                    ? 'rgba(0,232,135,0.06)'
                    : isComplete
                    ? 'var(--gf-card)'
                    : 'transparent',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ width: 18, height: 18, flexShrink: 0 }}>
                  {isComplete ? (
                    <CheckCircle size={18} color="var(--gf-signal)" />
                  ) : isAnalyzing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'flex' }}
                    >
                      <Loader2 size={18} color="var(--gf-signal)" />
                    </motion.div>
                  ) : (
                    <Clock size={18} color="var(--gf-text-muted)" />
                  )}
                </div>
                <span style={{
                  fontSize: 13, flex: 1,
                  color: isAnalyzing
                    ? 'var(--gf-text-primary)'
                    : isComplete
                    ? 'var(--gf-text-secondary)'
                    : 'var(--gf-text-muted)',
                  fontWeight: isAnalyzing ? 600 : 400,
                }}>
                  {score.label}
                </span>
                {isComplete && score.value !== undefined && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 700, fontSize: 13,
                      color: scoreColor(score.value),
                    }}
                  >
                    {score.value}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {overallScore !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              padding: 28,
              borderRadius: 16,
              border: '1px solid rgba(0,232,135,0.25)',
              background: 'rgba(0,232,135,0.04)',
              boxShadow: '0 0 40px rgba(0,232,135,0.1)',
            }}
          >
            <ScoreRing score={overallScore} size={140} label="Overall Score" />
            <p style={{ fontSize: 13, color: 'var(--gf-text-tertiary)' }}>
              Analysis complete — redirecting to results...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
