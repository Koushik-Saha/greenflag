'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const STATS = [
  { value: 12847, label: 'Resumes Scanned', suffix: '+' },
  { value: 89, label: 'Found Bias Risks', suffix: '%' },
  { value: 4.2, label: 'More Interviews', suffix: 'x', decimals: 1 },
];

export function SocialProof() {
  return (
    <section className="py-16 border-y border-white/5 bg-[#0d0d14]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 mb-10 text-sm font-mono"
        >
          Join 2,400+ job seekers who found blind spots in their resumes
        </motion.p>
        <div className="grid grid-cols-3 gap-8 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl font-mono font-bold text-white mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  duration={2000}
                />
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
