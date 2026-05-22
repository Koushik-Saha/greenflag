'use client';

import { useScoreAnimation } from '@/hooks/useScoreAnimation';

function scoreColor(score: number): string {
  if (score >= 80) return '#00E887';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
}

function scoreGrade(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
}

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animated?: boolean;
  className?: string;
}

export function ScoreRing({ score, size = 120, strokeWidth = 8, label, animated = true, className }: ScoreRingProps) {
  const animatedScore = useScoreAnimation(animated ? score : 0, 1400);
  const displayScore = animated ? animatedScore : score;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  const color = scoreColor(score);
  const glowFilter = score >= 80 ? 'glow-high' : score >= 60 ? 'glow-mid' : 'glow-low';

  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ''}`} style={{ width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <filter id={`${glowFilter}-${size}`}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1E3828" strokeWidth={strokeWidth} />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter={`url(#${glowFilter}-${size})`}
          style={{ transition: 'stroke-dashoffset 0.08s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: size * 0.26,
          fontWeight: 700,
          color,
          lineHeight: 1,
          letterSpacing: '-1px',
        }}>
          {displayScore}
        </span>
        <span style={{ fontSize: Math.max(9, size * 0.1), color: '#3D6B50', marginTop: 3, fontWeight: 500 }}>
          {label ?? scoreGrade(score)}
        </span>
      </div>
    </div>
  );
}
