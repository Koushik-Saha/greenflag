'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Try the basics',
    features: ['3 resume scans', '5 core scores (ATS, Keyword, Red Flags, Impact, Readability)', 'Basic improvement suggestions', 'PDF & DOCX support'],
    cta: 'Start Free',
    href: '/sign-up',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'Everything you need to land the role',
    features: ['Unlimited scans', 'All 11 intelligence scores', 'Inline AI bullet rewrites', 'Ghost Job Detector', 'Bias Risk analysis', 'OPT / Visa scoring', 'Salary positioning gap analysis', 'Full PDF report export', 'Scan history & progress tracking'],
    cta: 'Get Pro',
    href: '/sign-up?plan=pro',
    popular: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#0a0a0f] px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-slate-400">Start free. Upgrade when you need the full picture.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 ${plan.popular ? 'border-blue-500/50 bg-blue-950/20' : 'border-white/10 bg-white/5'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-mono font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border border-white/20 text-white hover:bg-white/5'}`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
