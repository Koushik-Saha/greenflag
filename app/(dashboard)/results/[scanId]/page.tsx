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
  { key: 'ats',         label: 'ATS Parse Score',         analysisKey: 'atsAnalysis',         scoreKey: 'atsScore' },
  { key: 'keyword',     label: 'Keyword Match',            analysisKey: 'keywordAnalysis',     scoreKey: 'keywordScore' },
  { key: 'redFlag',     label: 'Recruiter Red Flags',      analysisKey: 'redFlagAnalysis',     scoreKey: 'redFlagScore' },
  { key: 'impact',      label: 'Impact & Quantification',  analysisKey: 'impactAnalysis',      scoreKey: 'impactScore' },
  { key: 'readability', label: 'Readability',              analysisKey: 'readabilityAnalysis', scoreKey: 'readabilityScore' },
  { key: 'bias',        label: 'Bias Risk Score',          analysisKey: 'biasAnalysis',        scoreKey: 'biasRiskScore' },
  { key: 'aiDetection', label: 'AI Detection Risk',        analysisKey: 'aiDetectionAnalysis', scoreKey: 'aiDetectionScore' },
  { key: 'optVisa',     label: 'OPT / Visa Score',         analysisKey: 'optVisaAnalysis',     scoreKey: 'optVisaScore' },
  { key: 'salary',      label: 'Salary Positioning',       analysisKey: 'salaryAnalysis',      scoreKey: 'salaryPositionScore' },
  { key: 'trajectory',  label: 'Career Trajectory',        analysisKey: 'trajectoryAnalysis',  scoreKey: 'trajectoryScore' },
] as const;

function scoreColor(score?: number | null): string {
  if (!score) return 'var(--gf-text-muted)';
  if (score >= 80) return 'var(--gf-score-high)';
  if (score >= 60) return 'var(--gf-score-mid)';
  return 'var(--gf-score-low)';
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <OverallScoreRing
        score={scan.overallScore ?? 0}
        resumeName={resume?.fileName ?? 'Resume'}
        scanDate={scan.createdAt?.toISOString() ?? new Date().toISOString()}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Score nav sidebar */}
        <aside style={{
          width: 200, flexShrink: 0,
          borderRight: '1px solid var(--gf-border)',
          padding: '14px 8px',
          background: '#080D0A',
          overflowY: 'auto',
        }}>
          {SCORE_KEYS.map(({ key, label, scoreKey }) => {
            const score = scan[scoreKey as keyof typeof scan] as number | null;
            return (
              <a
                key={key}
                href={`#${key}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--gf-text-tertiary)',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  marginBottom: 2,
                }}
                className="gf-nav-item"
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                  {label}
                </span>
                {score !== null && score !== undefined && (
                  <span style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: 11, fontWeight: 700,
                    color: scoreColor(score),
                    flexShrink: 0, marginLeft: 6,
                  }}>
                    {score}
                  </span>
                )}
              </a>
            );
          })}
        </aside>

        <div style={{ flex: 1, padding: '36px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
          {SCORE_KEYS.map(({ key, label, analysisKey }) => {
            const analysis = scan[analysisKey as keyof typeof scan];
            if (!analysis) return null;

            return (
              <section key={key} id={key}>
                <p style={{
                  fontSize: 10, fontWeight: 600,
                  color: 'var(--gf-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: 20,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--gf-border)',
                }}>
                  {label}
                </p>

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
              <p style={{
                fontSize: 10, fontWeight: 600,
                color: 'var(--gf-text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: '1px solid var(--gf-border)',
              }}>
                Ghost Job Risk
              </p>
              <GhostJobPanel analysis={scan.ghostJobAnalysis as GhostJobAnalysis} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
