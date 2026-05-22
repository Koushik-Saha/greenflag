import {
  scoreATS,
  scoreKeywords,
  scoreRedFlags,
  scoreImpact,
  scoreReadability,
  scoreBiasRisk,
  scoreAIDetection,
  scoreOptVisa,
  scoreSalaryPosition,
  scoreTrajectory,
} from './rule-based-scorer';

export interface ScorerContext {
  resumeText: string;
  jobDescription?: string;
  targetRole?: string;
  targetCompany?: string;
  targetIndustry?: string;
  workAuthorization?: string;
  targetSalary?: number;
  onProgress?: (scoreName: string, status: 'analyzing' | 'complete', value?: number, analysis?: unknown) => void;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export async function runFullScan(ctx: ScorerContext) {
  const { resumeText, jobDescription, targetRole, workAuthorization, onProgress } = ctx;

  const emit = (name: string, status: 'analyzing' | 'complete', value?: number, analysis?: unknown) => {
    onProgress?.(name, status, value, analysis);
  };

  const run = async <T>(name: string, fn: () => T): Promise<T> => {
    emit(name, 'analyzing');
    await sleep(300);
    const result = fn();
    const score = (result as { score?: number }).score;
    emit(name, 'complete', score, result);
    return result;
  };

  const atsAnalysis         = await run('ats',          () => scoreATS(resumeText));
  const keywordAnalysis     = await run('keyword',      () => scoreKeywords(resumeText, jobDescription));
  const redFlagAnalysis     = await run('redFlag',      () => scoreRedFlags(resumeText));
  const impactAnalysis      = await run('impact',       () => scoreImpact(resumeText));
  const readabilityAnalysis = await run('readability',  () => scoreReadability(resumeText));
  const biasAnalysis        = await run('bias',         () => scoreBiasRisk(resumeText));
  const aiDetectionAnalysis = await run('aiDetection',  () => scoreAIDetection(resumeText));
  const optVisaAnalysis     = await run('optVisa',      () => scoreOptVisa(resumeText, workAuthorization, targetRole));
  const salaryAnalysis      = await run('salary',       () => scoreSalaryPosition(resumeText, targetRole));
  const trajectoryAnalysis  = await run('trajectory',   () => scoreTrajectory(resumeText));

  const isVisaUser = workAuthorization === 'opt' || workAuthorization === 'h1b';
  const overallScore = calculateOverallScore(
    {
      atsScore:            atsAnalysis.score,
      keywordScore:        keywordAnalysis.score,
      redFlagScore:        redFlagAnalysis.score,
      impactScore:         impactAnalysis.score,
      readabilityScore:    readabilityAnalysis.score,
      biasRiskScore:       biasAnalysis.score,
      aiDetectionScore:    aiDetectionAnalysis.score,
      optVisaScore:        optVisaAnalysis.score,
      salaryPositionScore: salaryAnalysis.score,
      trajectoryScore:     trajectoryAnalysis.score,
    },
    !!jobDescription,
    isVisaUser,
  );

  emit('overall', 'complete', overallScore);

  return {
    overallScore,
    atsScore:            atsAnalysis.score,
    keywordScore:        keywordAnalysis.score,
    redFlagScore:        redFlagAnalysis.score,
    impactScore:         impactAnalysis.score,
    readabilityScore:    readabilityAnalysis.score,
    biasRiskScore:       biasAnalysis.score,
    aiDetectionScore:    aiDetectionAnalysis.score,
    optVisaScore:        optVisaAnalysis.score,
    salaryPositionScore: salaryAnalysis.score,
    trajectoryScore:     trajectoryAnalysis.score,
    atsAnalysis,
    keywordAnalysis,
    redFlagAnalysis,
    impactAnalysis,
    readabilityAnalysis,
    biasAnalysis,
    aiDetectionAnalysis,
    optVisaAnalysis,
    salaryAnalysis,
    trajectoryAnalysis,
    ghostJobAnalysis: undefined,
  };
}

function calculateOverallScore(
  scores: {
    atsScore: number;
    keywordScore: number;
    redFlagScore: number;
    impactScore: number;
    readabilityScore: number;
    biasRiskScore: number;
    aiDetectionScore: number;
    optVisaScore: number;
    salaryPositionScore: number;
    trajectoryScore: number;
  },
  hasJD: boolean,
  isVisaUser: boolean,
): number {
  let total = 0;

  // Base weights
  total += scores.atsScore        * (hasJD ? 0.15 : 0.20);
  total += scores.keywordScore    * (hasJD ? 0.15 : 0);
  total += scores.redFlagScore    * 0.10;
  total += scores.impactScore     * (hasJD ? 0.15 : 0.20);
  total += scores.readabilityScore * 0.10;
  total += scores.biasRiskScore   * 0.05;
  total += scores.aiDetectionScore * 0.10;
  total += scores.trajectoryScore * 0.10;

  // Conditional: OPT/Visa (10%) — redistribute to ATS+Impact for non-visa
  if (isVisaUser) {
    total += scores.optVisaScore * 0.10;
  } else {
    total += scores.atsScore    * 0.05;
    total += scores.impactScore * 0.05;
  }

  // Conditional: Salary (10%) — always included
  total += scores.salaryPositionScore * 0.10;

  // If no JD, keyword weight (15%) was zeroed — redistribute to ATS+Impact
  if (!hasJD) {
    total += scores.atsScore    * 0.075;
    total += scores.impactScore * 0.075;
  }

  return Math.round(Math.min(100, Math.max(0, total)));
}
