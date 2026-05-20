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
  if (value >= 80) return 'text-green-400';
  if (value >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function scoreBg(value: number): string {
  if (value >= 80) return 'bg-green-500/20 border-green-500/30';
  if (value >= 60) return 'bg-amber-500/20 border-amber-500/30';
  return 'bg-red-500/20 border-red-500/30';
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
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Resume</h2>
          <AnimatePresence mode="wait">
            {currentScore && (
              <motion.p
                key={currentScore.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm text-slate-500 font-mono"
              >
                {COPY[currentScore.name] ?? `Analyzing ${currentScore.label}...`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        <div className="space-y-2 mb-8">
          {scores.filter(s => s.name !== 'overall').map((score, i) => (
            <motion.div
              key={score.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                score.status === 'complete' && score.value !== undefined
                  ? scoreBg(score.value)
                  : score.status === 'analyzing'
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="w-5 h-5 flex-shrink-0">
                {score.status === 'complete' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : score.status === 'analyzing' ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <span className={`text-sm flex-1 ${score.status === 'waiting' ? 'text-slate-600' : 'text-white'}`}>
                {score.label}
              </span>
              {score.status === 'complete' && score.value !== undefined && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`font-mono font-bold text-sm ${scoreColor(score.value)}`}
                >
                  {score.value}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {overallScore !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5"
          >
            <ScoreRing score={overallScore} size={140} label="Overall Score" />
            <p className="text-slate-400 text-sm">Analysis complete — redirecting to results...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
