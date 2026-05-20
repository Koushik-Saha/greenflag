'use client';

import { useState, useCallback } from 'react';
import type { SSEEvent } from '@/types';

export interface ScoreState {
  name: string;
  label: string;
  status: 'waiting' | 'analyzing' | 'complete';
  value?: number;
}

const SCORE_LABELS: Record<string, string> = {
  ats: 'ATS Parse Score',
  keyword: 'Keyword Match',
  redFlag: 'Recruiter Red Flags',
  impact: 'Impact & Quantification',
  readability: 'Readability & First Impression',
  bias: 'Bias Risk Score',
  aiDetection: 'AI Detection Risk',
  optVisa: 'OPT / Visa Friendliness',
  salary: 'Salary Positioning',
  trajectory: 'Career Trajectory',
  overall: 'Overall Score',
};

export function useScanProgress() {
  const [scores, setScores] = useState<ScoreState[]>(
    Object.entries(SCORE_LABELS).map(([name, label]) => ({ name, label, status: 'waiting' }))
  );
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = useCallback(async (params: {
    resumeId: string;
    jobDescription?: string;
    targetRole?: string;
    targetCompany?: string;
    targetIndustry?: string;
  }) => {
    setIsComplete(false);
    setError(null);

    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message ?? data.error ?? 'Scan failed');
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n').filter(l => l.startsWith('data: '));

      for (const line of lines) {
        try {
          const event: SSEEvent = JSON.parse(line.slice(6));

          if (event.type === 'progress' && event.score) {
            setScores(prev => prev.map(s => s.name === event.score ? { ...s, status: 'analyzing' } : s));
          }
          if (event.type === 'score' && event.score) {
            setScores(prev => prev.map(s => s.name === event.score ? { ...s, status: 'complete', value: event.value } : s));
          }
          if (event.type === 'complete') {
            setOverallScore(event.overallScore ?? null);
            setScanId(event.scanId ?? null);
            setIsComplete(true);
          }
          if (event.type === 'error') {
            setError(event.message ?? 'Scan error');
          }
        } catch {
          // ignore parse errors
        }
      }
    }
  }, []);

  const completedCount = scores.filter(s => s.status === 'complete').length;
  const progress = Math.round((completedCount / scores.length) * 100);

  return { scores, overallScore, scanId, isComplete, error, progress, startScan };
}
