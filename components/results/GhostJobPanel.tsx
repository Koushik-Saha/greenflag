'use client';

import { motion } from 'framer-motion';
import type { GhostJobAnalysis } from '@/types';

interface GhostJobPanelProps {
  analysis: GhostJobAnalysis;
}

function probabilityColor(p: number): string {
  if (p >= 70) return 'var(--gf-score-low)';
  if (p >= 40) return 'var(--gf-score-mid)';
  return 'var(--gf-score-high)';
}

function probabilityBarColor(p: number): string {
  if (p >= 70) return '#EF4444';
  if (p >= 40) return '#F59E0B';
  return '#00E887';
}

export function GhostJobPanel({ analysis }: GhostJobPanelProps) {
  const color = probabilityColor(analysis.ghostProbability);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '20px 24px',
        borderRadius: 16,
        border: '1px solid var(--gf-border)',
        background: 'var(--gf-card)',
      }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <span style={{
            display: 'block',
            fontSize: 44, fontWeight: 700,
            fontFamily: 'var(--font-mono, monospace)',
            color,
            lineHeight: 1,
          }}>
            {analysis.ghostProbability}%
          </span>
          <p style={{ fontSize: 11, color: 'var(--gf-text-tertiary)', marginTop: 4 }}>Ghost Probability</p>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, background: 'var(--gf-elevated)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.ghostProbability}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: 4,
                background: probabilityBarColor(analysis.ghostProbability),
                boxShadow: `0 0 8px ${probabilityBarColor(analysis.ghostProbability)}80`,
              }}
            />
          </div>
          <p style={{ fontSize: 13, color: 'var(--gf-text-secondary)', lineHeight: 1.5 }}>{analysis.recommendation}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--gf-score-low)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Red Flags
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analysis.signals.filter(s => s.type === 'negative').map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gf-text-secondary)' }}>
                <span style={{ color: 'var(--gf-score-low)', flexShrink: 0 }}>✗</span>
                {s.text}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--gf-score-high)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Good Signals
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analysis.signals.filter(s => s.type === 'positive').map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gf-text-secondary)' }}>
                <span style={{ color: 'var(--gf-score-high)', flexShrink: 0 }}>✓</span>
                {s.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
