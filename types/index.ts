export type Plan = 'free' | 'pro' | 'enterprise';
export type ScanStatus = 'pending' | 'processing' | 'complete' | 'error';
export type ScoreGrade = 'excellent' | 'good' | 'needs-work' | 'poor';
export type BulletStrength = 'STRONG' | 'MEDIUM' | 'WEAK';
export type WorkAuthorization = 'citizen' | 'gc' | 'h1b' | 'opt' | 'tn' | 'other';
export type IssueSeverity = 'high' | 'medium' | 'low';

export interface ScoreAnalysis {
  score: number;
  grade: ScoreGrade;
  summary: string;
  issues: Array<{ severity: IssueSeverity; text: string; location?: string }>;
  suggestions: string[];
  highlights: string[];
}

export interface BulletAnalysis {
  text: string;
  strength: BulletStrength;
  reason: string;
  suggestion?: string;
}

export interface ImpactAnalysis extends ScoreAnalysis {
  bullets: BulletAnalysis[];
  strongCount: number;
  mediumCount: number;
  weakCount: number;
}

export interface BiasAnalysis extends ScoreAnalysis {
  risks: Array<{
    signal: string;
    reason: string;
    neutralization: string;
  }>;
}

export interface GhostJobAnalysis {
  ghostProbability: number;
  signals: Array<{ type: 'positive' | 'negative'; text: string }>;
  recommendation: string;
  grade: ScoreGrade;
}

export interface SalaryAnalysis extends ScoreAnalysis {
  currentBand: string;
  targetBand?: string;
  gap?: string;
  topChanges: string[];
}

export interface ScanResult {
  scanId: string;
  overallScore: number;
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
  ghostJobScore?: number;
  atsAnalysis: ScoreAnalysis;
  keywordAnalysis: ScoreAnalysis;
  redFlagAnalysis: ScoreAnalysis;
  impactAnalysis: ImpactAnalysis;
  readabilityAnalysis: ScoreAnalysis;
  biasAnalysis: BiasAnalysis;
  aiDetectionAnalysis: ScoreAnalysis;
  optVisaAnalysis: ScoreAnalysis;
  salaryAnalysis: SalaryAnalysis;
  trajectoryAnalysis: ScoreAnalysis;
  ghostJobAnalysis?: GhostJobAnalysis;
}

export interface SSEEvent {
  type: 'progress' | 'score' | 'complete' | 'error';
  score?: string;
  status?: string;
  value?: number;
  analysis?: ScoreAnalysis | ImpactAnalysis | BiasAnalysis | SalaryAnalysis;
  overallScore?: number;
  scanId?: string;
  message?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  plan: Plan;
  scansUsed: number;
  scansLimit: number;
  isOPT: boolean;
  targetRole?: string;
  targetIndustry?: string;
  targetSalary?: number;
  workAuthorization?: WorkAuthorization;
}

export interface ResumeRecord {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  rawText: string;
  parsedSections?: {
    summary?: string;
    experience?: string;
    skills?: string;
    education?: string;
    projects?: string;
  };
  wordCount?: number;
  pageCount?: number;
}

export interface ScanRecord {
  id: string;
  userId: string;
  resumeId: string;
  jobDescription?: string;
  targetRole?: string;
  targetCompany?: string;
  targetIndustry?: string;
  overallScore?: number;
  atsScore?: number;
  keywordScore?: number;
  redFlagScore?: number;
  impactScore?: number;
  readabilityScore?: number;
  biasRiskScore?: number;
  aiDetectionScore?: number;
  optVisaScore?: number;
  salaryPositionScore?: number;
  trajectoryScore?: number;
  ghostJobScore?: number;
  status: ScanStatus;
  createdAt: Date;
}

export type EventName =
  | 'page_viewed'
  | 'resume_uploaded'
  | 'scan_started'
  | 'scan_completed'
  | 'score_viewed'
  | 'rewrite_requested'
  | 'rewrite_accepted'
  | 'rewrite_rejected'
  | 'ghost_job_checked'
  | 'export_downloaded'
  | 'upgrade_clicked'
  | 'upgrade_completed'
  | 'bias_fix_applied'
  | 'settings_updated'
  | 'history_viewed';
