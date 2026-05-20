'use client';

import { useState, useCallback } from 'react';

export function useRealtimeScore(initialScore = 0) {
  const [score, setScore] = useState(initialScore);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateScore = useCallback((newScore: number) => {
    setIsAnimating(true);
    setScore(newScore);
    setTimeout(() => setIsAnimating(false), 1500);
  }, []);

  return { score, isAnimating, updateScore };
}
