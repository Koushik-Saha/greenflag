'use client';

import { motion } from 'framer-motion';
import { ArrowUp, DollarSign } from 'lucide-react';
import type { SalaryAnalysis } from '@/types';

interface SalaryPositionPanelProps {
  analysis: SalaryAnalysis;
}

export function SalaryPositionPanel({ analysis }: SalaryPositionPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{
          padding: '14px 16px',
          borderRadius: 12,
          border: '1px solid var(--gf-border)',
          background: 'var(--gf-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <DollarSign size={15} color="var(--gf-text-tertiary)" />
            <p style={{ fontSize: 10, color: 'var(--gf-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Current Positioning
            </p>
          </div>
          <p style={{
            fontSize: 18, fontWeight: 700,
            fontFamily: 'var(--font-mono, monospace)',
            color: 'var(--gf-text-primary)',
          }}>
            {analysis.currentBand}
          </p>
        </div>
        {analysis.targetBand && (
          <div style={{
            padding: '14px 16px',
            borderRadius: 12,
            border: '1px solid rgba(0,232,135,0.25)',
            background: 'rgba(0,232,135,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ArrowUp size={15} color="var(--gf-score-high)" />
              <p style={{ fontSize: 10, color: 'var(--gf-score-high)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Target Band
              </p>
            </div>
            <p style={{
              fontSize: 18, fontWeight: 700,
              fontFamily: 'var(--font-mono, monospace)',
              color: 'var(--gf-score-high)',
            }}>
              {analysis.targetBand}
            </p>
          </div>
        )}
      </div>

      {analysis.gap && (
        <div style={{
          padding: '12px 14px',
          borderRadius: 10,
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gf-score-mid)', marginBottom: 4 }}>Gap Analysis</p>
          <p style={{ fontSize: 13, color: 'var(--gf-text-secondary)', lineHeight: 1.5 }}>{analysis.gap}</p>
        </div>
      )}

      {analysis.topChanges.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--gf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Top Changes to Close the Gap
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {analysis.topChanges.map((change, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: 'flex', gap: 12, padding: '10px 12px',
                  borderRadius: 10,
                  background: 'rgba(167,139,250,0.06)',
                  border: '1px solid rgba(167,139,250,0.2)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 13, fontWeight: 700,
                  color: '#A78BFA', flexShrink: 0,
                }}>
                  {i + 1}.
                </span>
                <p style={{ fontSize: 13, color: 'var(--gf-text-secondary)', lineHeight: 1.5 }}>{change}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
