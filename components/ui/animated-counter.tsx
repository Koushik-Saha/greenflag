'use client';

import { useScoreAnimation } from '@/hooks/useScoreAnimation';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1500, delay = 0, prefix = '', suffix = '', decimals = 0, className }: AnimatedCounterProps) {
  const animated = useScoreAnimation(value, duration, delay);
  return (
    <span className={className}>
      {prefix}{decimals > 0 ? animated.toFixed(decimals) : animated}{suffix}
    </span>
  );
}
