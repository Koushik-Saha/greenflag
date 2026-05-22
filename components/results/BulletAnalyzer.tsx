'use client';

import { motion } from 'framer-motion';
import { InlineRewriter } from './InlineRewriter';
import type { ImpactAnalysis } from '@/types';

const STRENGTH: Record<string, { text: string; border: string; bg: string }> = {
  STRONG: { text: 'var(--gf-score-high)', border: 'rgba(0,232,135,0.3)',   bg: 'rgba(0,232,135,0.08)' },
  MEDIUM: { text: 'var(--gf-score-mid)',  border: 'rgba(245,158,11,0.3)',  bg: 'rgba(245,158,11,0.08)' },
  WEAK:   { text: 'var(--gf-score-low)',  border: 'rgba(239,68,68,0.3)',   bg: 'rgba(239,68,68,0.08)' },
};

interface BulletAnalyzerProps {
  scanId: string;
  analysis: ImpactAnalysis;
  targetRole?: string;
  targetIndustry?: string;
}

export function BulletAnalyzer({ scanId, analysis, targetRole, targetIndustry }: BulletAnalyzerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {[
          { label: 'Strong', count: analysis.strongCount, color: 'var(--gf-score-high)' },
          { label: 'Medium', count: analysis.mediumCount, color: 'var(--gf-score-mid)' },
          { label: 'Weak',   count: analysis.weakCount,   color: 'var(--gf-score-low)' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <span style={{
              display: 'block',
              fontSize: 28, fontWeight: 700,
              fontFamily: 'var(--font-mono, monospace)',
              color: s.color,
              lineHeight: 1,
            }}>{s.count}</span>
            <p style={{ fontSize: 11, color: 'var(--gf-text-tertiary)', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {analysis.bullets.map((bullet, i) => {
          const s = STRENGTH[bullet.strength] ?? STRENGTH.MEDIUM;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 700,
                  border: `1px solid ${s.border}`,
                  borderRadius: 4,
                  padding: '2px 7px',
                  color: s.text,
                  background: s.bg,
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  {bullet.strength}
                </span>
                <p style={{ fontSize: 13, color: 'var(--gf-text-primary)', lineHeight: 1.6 }}>{bullet.text}</p>
              </div>
              {(bullet.strength === 'WEAK' || bullet.strength === 'MEDIUM') && (
                <div style={{ marginLeft: 56 }}>
                  <InlineRewriter
                    scanId={scanId}
                    originalBullet={bullet.text}
                    targetRole={targetRole}
                    targetIndustry={targetIndustry}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
