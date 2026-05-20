import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getScanById, getResumeById } from '@/lib/db/queries';
import { OverallScoreRing } from '@/components/results/OverallScoreRing';
import { ScoreCard } from '@/components/results/ScoreCard';
import { BulletAnalyzer } from '@/components/results/BulletAnalyzer';
import { BiasRiskPanel } from '@/components/results/BiasRiskPanel';
import { GhostJobPanel } from '@/components/results/GhostJobPanel';
import { SalaryPositionPanel } from '@/components/results/SalaryPositionPanel';
import type { ScoreAnalysis, ImpactAnalysis, BiasAnalysis, SalaryAnalysis, GhostJobAnalysis } from '@/types';

const SCORE_KEYS = [
  { key: 'ats', label: 'ATS Parse Score', analysisKey: 'atsAnalysis', scoreKey: 'atsScore' },
  { key: 'keyword', label: 'Keyword Match', analysisKey: 'keywordAnalysis', scoreKey: 'keywordScore' },
  { key: 'redFlag', label: 'Recruiter Red Flags', analysisKey: 'redFlagAnalysis', scoreKey: 'redFlagScore' },
  { key: 'impact', label: 'Impact & Quantification', analysisKey: 'impactAnalysis', scoreKey: 'impactScore' },
  { key: 'readability', label: 'Readability', analysisKey: 'readabilityAnalysis', scoreKey: 'readabilityScore' },
  { key: 'bias', label: 'Bias Risk Score', analysisKey: 'biasAnalysis', scoreKey: 'biasRiskScore' },
  { key: 'aiDetection', label: 'AI Detection Risk', analysisKey: 'aiDetectionAnalysis', scoreKey: 'aiDetectionScore' },
  { key: 'optVisa', label: 'OPT / Visa Score', analysisKey: 'optVisaAnalysis', scoreKey: 'optVisaScore' },
  { key: 'salary', label: 'Salary Positioning', analysisKey: 'salaryAnalysis', scoreKey: 'salaryPositionScore' },
  { key: 'trajectory', label: 'Career Trajectory', analysisKey: 'trajectoryAnalysis', scoreKey: 'trajectoryScore' },
] as const;

function scoreColor(score?: number | null) {
  if (!score) return 'text-slate-500';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

export default async function ResultsPage({ params }: { params: Promise<{ scanId: string }> }) {
  const session = await getSession();
  if (!session) notFound();
  const { user } = session;

  const { scanId } = await params;
  const scan = await getScanById(scanId);
  if (!scan) notFound();

  const resume = await getResumeById(scan.resumeId, user.id);

  return (
    <div className="flex flex-col min-h-screen">
      <OverallScoreRing
        score={scan.overallScore ?? 0}
        resumeName={resume?.fileName ?? 'Resume'}
        scanDate={scan.createdAt?.toISOString() ?? new Date().toISOString()}
      />

      <div className="flex flex-1">
        <aside className="w-52 border-r border-white/10 py-4 px-2 space-y-1 shrink-0">
          {SCORE_KEYS.map(({ key, label, scoreKey }) => {
            const score = scan[scoreKey as keyof typeof scan] as number | null;
            return (
              <a
                key={key}
                href={`#${key}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="truncate">{label}</span>
                {score !== null && score !== undefined && (
                  <span className={`font-mono text-xs font-bold ${scoreColor(score)}`}>{score}</span>
                )}
              </a>
            );
          })}
        </aside>

        <div className="flex-1 p-8 space-y-12 overflow-auto">
          {SCORE_KEYS.map(({ key, label, analysisKey }) => {
            const analysis = scan[analysisKey as keyof typeof scan];
            if (!analysis) return null;

            return (
              <section key={key} id={key}>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">{label}</h2>

                {key === 'impact' ? (
                  <BulletAnalyzer
                    scanId={scan.id}
                    analysis={analysis as ImpactAnalysis}
                    targetRole={scan.targetRole ?? undefined}
                    targetIndustry={scan.targetIndustry ?? undefined}
                  />
                ) : key === 'bias' ? (
                  <BiasRiskPanel analysis={analysis as BiasAnalysis} />
                ) : key === 'salary' ? (
                  <SalaryPositionPanel analysis={analysis as SalaryAnalysis} />
                ) : (
                  <ScoreCard name={label} analysis={analysis as ScoreAnalysis} />
                )}
              </section>
            );
          })}

          {!!scan.ghostJobAnalysis && (
            <section id="ghost">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">Ghost Job Risk</h2>
              <GhostJobPanel analysis={scan.ghostJobAnalysis as GhostJobAnalysis} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
