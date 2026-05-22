'use client';

import { motion } from 'framer-motion';
import { Shield, Info } from 'lucide-react';
import type { BiasAnalysis } from '@/types';

interface BiasRiskPanelProps {
  analysis: BiasAnalysis;
}

export function BiasRiskPanel({ analysis }: BiasRiskPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        padding: '12px 14px',
        borderRadius: 10,
        background: 'rgba(167,139,250,0.06)',
        border: '1px solid rgba(167,139,250,0.2)',
        display: 'flex', gap: 12,
      }}>
        <Info size={17} color="#A78BFA" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 13, color: 'var(--gf-text-secondary)', lineHeight: 1.6 }}>
          These suggestions help you navigate imperfect hiring systems. Your identity is not the problem — the system is. All fixes are optional and yours to choose.
        </p>
      </div>

      <div>
        <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--gf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
          Potential Screening Friction Points
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {analysis.risks.length === 0 ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(0,232,135,0.06)',
              border: '1px solid rgba(0,232,135,0.2)',
            }}>
              <Shield size={18} color="var(--gf-score-high)" />
              <p style={{ fontSize: 13, color: 'var(--gf-text-secondary)' }}>
                No significant bias risk signals detected. Your resume is well-positioned.
              </p>
            </div>
          ) : (
            analysis.risks.map((risk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--gf-border)',
                  background: 'var(--gf-card)',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gf-text-primary)' }}>{risk.signal}</p>
                <p style={{ fontSize: 12, color: 'var(--gf-text-tertiary)', lineHeight: 1.5 }}>{risk.reason}</p>
                <div style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'rgba(167,139,250,0.06)',
                  border: '1px solid rgba(167,139,250,0.2)',
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                    Optional neutralization
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--gf-text-secondary)', lineHeight: 1.5 }}>{risk.neutralization}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
