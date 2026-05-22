'use client';

import { motion } from 'framer-motion';
import { ScoreRing } from '@/components/ui/score-ring';
import { CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import type { ScoreAnalysis } from '@/types';

interface ScoreCardProps {
  name: string;
  analysis: ScoreAnalysis;
}

const SEVERITY_COLOR: Record<string, { text: string; border: string; bg: string }> = {
  high:   { text: 'var(--gf-score-low)',  border: 'rgba(239,68,68,0.25)',   bg: 'rgba(239,68,68,0.06)' },
  medium: { text: 'var(--gf-score-mid)',  border: 'rgba(245,158,11,0.25)',  bg: 'rgba(245,158,11,0.06)' },
  low:    { text: '#A78BFA',              border: 'rgba(167,139,250,0.25)', bg: 'rgba(167,139,250,0.06)' },
};

export function ScoreCard({ name, analysis }: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <ScoreRing score={analysis.score} size={76} animated />
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gf-text-primary)', letterSpacing: '-0.3px' }}>{name}</h2>
          <p style={{ fontSize: 13, color: 'var(--gf-text-tertiary)', marginTop: 4, lineHeight: 1.5 }}>{analysis.summary}</p>
        </div>
      </div>

      {analysis.highlights.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--gf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            What&apos;s Working
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {analysis.highlights.map((h, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(0,232,135,0.06)',
                border: '1px solid rgba(0,232,135,0.2)',
              }}>
                <CheckCircle size={15} color="var(--gf-score-high)" style={{ marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--gf-text-secondary)', lineHeight: 1.5 }}>{h}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.issues.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--gf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Issues Found
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {analysis.issues.map((issue, i) => {
              const s = SEVERITY_COLOR[issue.severity] ?? SEVERITY_COLOR.medium;
              return (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '10px 12px',
                  borderRadius: 10,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                }}>
                  <AlertTriangle size={15} color={s.text} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'var(--gf-text-primary)', lineHeight: 1.5 }}>{issue.text}</p>
                    {issue.location && (
                      <p style={{ fontSize: 11, color: 'var(--gf-text-tertiary)', marginTop: 2 }}>{issue.location}</p>
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono, monospace)', color: s.text, opacity: 0.8, textTransform: 'uppercase', flexShrink: 0 }}>
                    {issue.severity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analysis.suggestions.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--gf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            How to Fix
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {analysis.suggestions.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(167,139,250,0.06)',
                border: '1px solid rgba(167,139,250,0.2)',
              }}>
                <Lightbulb size={15} color="#A78BFA" style={{ marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--gf-text-secondary)', lineHeight: 1.5 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
