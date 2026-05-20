'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleBg } from '@/components/ui/particle-bg';
import { ScoreRing } from '@/components/ui/score-ring';

const WORDS = ['Your', 'Resume', 'Has', '11', 'Ways', 'to', 'Fail.', 'We', 'Find', 'All', 'of', 'Them.'];

const FLOATING_BADGES = [
  { label: 'Bias Risk ↑', color: 'text-violet-400 border-violet-400/30 bg-violet-400/10' },
  { label: 'AI Detection ↑', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  { label: 'Ghost Job ↓', color: 'text-red-400 border-red-400/30 bg-red-400/10' },
  { label: 'OPT Score ↑', color: 'text-green-400 border-green-400/30 bg-green-400/10' },
  { label: 'Salary Gap ↑', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <ParticleBg count={80} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f] pointer-events-none" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-mono tracking-widest text-blue-400 uppercase border border-blue-400/30 rounded-full px-4 py-1.5">
            11-Lens AI Resume Intelligence
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {WORDS.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          The only resume intelligence platform with Bias Risk, AI Detection, Ghost Job Detector, OPT/Visa scoring, and 7 more analyses nobody else runs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link
            href="/sign-up"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
          >
            Scan Your Resume Free
          </Link>
          <Link
            href="#demo"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-200"
          >
            See Live Demo
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex items-center justify-center gap-8"
        >
          <ScoreRing score={92} size={140} label="Overall Score" />
          <div className="flex flex-col gap-2">
            {FLOATING_BADGES.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + i * 0.15 }}
                className={`text-xs font-mono border rounded-full px-3 py-1 ${badge.color}`}
              >
                {badge.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
