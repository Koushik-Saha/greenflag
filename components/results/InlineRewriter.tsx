'use client';

import { Wand2 } from 'lucide-react';

interface InlineRewriterProps {
  scanId: string;
  originalBullet: string;
  targetRole?: string;
  targetIndustry?: string;
  onAccept?: (rewritten: string) => void;
}

export function InlineRewriter({ originalBullet }: InlineRewriterProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        padding: '10px 12px',
        borderRadius: 8,
        background: 'var(--gf-elevated)',
        border: '1px solid var(--gf-border)',
      }}>
        <p style={{ fontSize: 10, color: 'var(--gf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
          Original
        </p>
        <p style={{ fontSize: 12, color: 'var(--gf-text-tertiary)', lineHeight: 1.5 }}>{originalBullet}</p>
      </div>

      <div style={{
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(245,158,11,0.06)',
        border: '1px solid rgba(245,158,11,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Wand2 size={13} color="var(--gf-score-mid)" />
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--gf-score-mid)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Tip to strengthen this bullet
          </p>
        </div>
        <p style={{ fontSize: 12, color: 'var(--gf-text-secondary)', lineHeight: 1.6 }}>
          Add a metric:{' '}
          <span style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--gf-signal)' }}>
            [Action Verb] + [What you did] + [Result with %/$/ or scale]
          </span>
        </p>
        <p style={{ fontSize: 11, color: 'var(--gf-text-tertiary)', marginTop: 6 }}>
          Example: &ldquo;Reduced page load time by 40%, improving user retention by 15%&rdquo;
        </p>
      </div>
    </div>
  );
}
