'use client';

import { motion } from 'framer-motion';
import { Upload, Cpu, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload your resume',
    desc: 'Drop your PDF, DOCX, or Markdown file. We parse it instantly — no account needed to start.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'Watch 11 AI scores generate live',
    desc: 'Each score fires in real time. Watch the bars fill as our AI works through every lens.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'Fix inline, export upgraded',
    desc: 'Click any weak bullet to get an AI rewrite. Accept it, copy it, export your improved resume.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#0d0d14] px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-slate-400 text-lg">From upload to improved resume in under 60 seconds.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-green-500/30" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`relative w-20 h-20 rounded-2xl border flex items-center justify-center mb-6 ${step.bg}`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0d0d14] border border-white/10 flex items-center justify-center text-xs font-mono text-slate-500">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
