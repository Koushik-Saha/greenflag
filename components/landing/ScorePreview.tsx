'use client';

import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/glow-card';
import { Shield, Zap, Eye, TrendingUp, Brain, Bot, Globe, DollarSign, BarChart3, Search, AlertTriangle } from 'lucide-react';

const SCORES = [
  { icon: Brain, name: 'ATS Parse Score', desc: 'File format, section detection, parse-ability', unique: false },
  { icon: Search, name: 'Keyword Match', desc: 'Semantic matching against job description', unique: false },
  { icon: AlertTriangle, name: 'Recruiter Red Flags', desc: 'Buzzwords, vague bullets, job hop patterns', unique: false },
  { icon: Zap, name: 'Impact & Quantification', desc: 'Per-bullet STRONG / MEDIUM / WEAK grading', unique: false },
  { icon: Eye, name: 'Readability & First Impression', desc: '6-second scan simulation', unique: false },
  { icon: Shield, name: 'Bias Risk Score', desc: 'Defensive screen friction analysis', unique: true },
  { icon: Bot, name: 'AI Detection Risk', desc: 'How AI-written does your resume sound?', unique: true },
  { icon: Globe, name: 'OPT / Visa Friendliness', desc: 'STEM signals, sponsor-friendly targeting', unique: true },
  { icon: DollarSign, name: 'Salary Positioning', desc: 'Under/over-titling detection & fix', unique: true },
  { icon: TrendingUp, name: 'Career Trajectory', desc: 'Progression logic, promotion visibility', unique: true },
  { icon: BarChart3, name: 'Ghost Job Risk', desc: 'Detect if the JD is a ghost posting', unique: true },
];

export function ScorePreview() {
  return (
    <section className="py-24 bg-[#0a0a0f] px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">11 Intelligence Lenses</h2>
          <p className="text-slate-400 text-lg">Most tools run 2-3 checks. We run 11.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCORES.map((score, i) => (
            <motion.div
              key={score.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlowCard className="h-full">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${score.unique ? 'bg-violet-500/20' : 'bg-blue-500/20'}`}>
                    <score.icon className={`w-5 h-5 ${score.unique ? 'text-violet-400' : 'text-blue-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{score.name}</h3>
                      {score.unique && (
                        <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-400/30 rounded-full px-2 py-0.5 whitespace-nowrap">
                          Only us
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{score.desc}</p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
