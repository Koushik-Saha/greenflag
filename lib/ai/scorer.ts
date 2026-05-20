import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ATS_PARSE_PROMPT,
  KEYWORD_MATCH_PROMPT,
  RED_FLAG_PROMPT,
  IMPACT_PROMPT,
  READABILITY_PROMPT,
  BIAS_RISK_PROMPT,
  AI_DETECTION_PROMPT,
  OPT_VISA_PROMPT,
  SALARY_POSITION_PROMPT,
  TRAJECTORY_PROMPT,
} from './prompts';
import type { ScoreAnalysis, ImpactAnalysis, BiasAnalysis, SalaryAnalysis } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SCORE_WEIGHTS = {
  atsScore: 0.15,
  keywordScore: 0.15,
  impactScore: 0.15,
  redFlagScore: 0.10,
  readabilityScore: 0.10,
  biasRiskScore: 0.10,
  aiDetectionScore: 0.10,
  trajectoryScore: 0.08,
  salaryPositionScore: 0.07,
  optVisaScore: 0.00,
};

async function callGemini(systemPrompt: string, userMessage: string): Promise<unknown> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: { maxOutputTokens: 2000, temperature: 0.3 },
  });

  const result = await model.generateContent(userMessage);
  const text = result.response.text();
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned);
}

export interface ScorerContext {
  resumeText: string;
  jobDescription?: string;
  targetRole?: string;
  targetIndustry?: string;
  workAuthorization?: string;
  onProgress?: (scoreName: string, status: 'analyzing' | 'complete', value?: number, analysis?: unknown) => void;
}

export async function runFullScan(ctx: ScorerContext) {
  const { resumeText, jobDescription, targetRole, targetIndustry, workAuthorization, onProgress } = ctx;

  const emit = (name: string, status: 'analyzing' | 'complete', value?: number, analysis?: unknown) => {
    onProgress?.(name, status, value, analysis);
  };

  const runScore = async <T>(name: string, prompt: string, userMsg: string): Promise<T> => {
    emit(name, 'analyzing');
    const result = await callGemini(prompt, userMsg) as T;
    const score = (result as { score?: number }).score;
    emit(name, 'complete', score, result);
    return result;
  };

  const resumeMsg = `Resume text:\n\n${resumeText}`;
  const jdContext = jobDescription ? `\n\nJob Description:\n${jobDescription}` : '';
  const roleContext = targetRole ? `\n\nTarget Role: ${targetRole}` : '';
  const industryContext = targetIndustry ? `\n\nTarget Industry: ${targetIndustry}` : '';

  const [atsAnalysis, redFlagAnalysis, impactAnalysis, readabilityAnalysis, biasAnalysis, aiDetectionAnalysis, trajectoryAnalysis] = await Promise.all([
    runScore<ScoreAnalysis>('ats', ATS_PARSE_PROMPT, resumeMsg),
    runScore<ScoreAnalysis>('redFlag', RED_FLAG_PROMPT, resumeMsg),
    runScore<ImpactAnalysis>('impact', IMPACT_PROMPT, resumeMsg),
    runScore<ScoreAnalysis>('readability', READABILITY_PROMPT, resumeMsg),
    runScore<BiasAnalysis>('bias', BIAS_RISK_PROMPT, resumeMsg),
    runScore<ScoreAnalysis>('aiDetection', AI_DETECTION_PROMPT, resumeMsg),
    runScore<ScoreAnalysis>('trajectory', TRAJECTORY_PROMPT, resumeMsg),
  ]);

  const [keywordAnalysis, optVisaAnalysis, salaryAnalysis] = await Promise.all([
    runScore<ScoreAnalysis>('keyword', KEYWORD_MATCH_PROMPT, resumeMsg + jdContext),
    runScore<ScoreAnalysis>('optVisa', OPT_VISA_PROMPT, resumeMsg + roleContext + industryContext),
    runScore<SalaryAnalysis>('salary', SALARY_POSITION_PROMPT, resumeMsg + roleContext + industryContext),
  ]);

  const isVisaUser = workAuthorization === 'opt' || workAuthorization === 'h1b';
  const weights = { ...SCORE_WEIGHTS };
  if (isVisaUser) {
    weights.optVisaScore = 0.10;
    weights.atsScore = 0.10;
    weights.keywordScore = 0.10;
  }

  const overallScore = Math.round(
    atsAnalysis.score * weights.atsScore +
    (keywordAnalysis.score || 50) * weights.keywordScore +
    impactAnalysis.score * weights.impactScore +
    redFlagAnalysis.score * weights.redFlagScore +
    readabilityAnalysis.score * weights.readabilityScore +
    biasAnalysis.score * weights.biasRiskScore +
    aiDetectionAnalysis.score * weights.aiDetectionScore +
    trajectoryAnalysis.score * weights.trajectoryScore +
    salaryAnalysis.score * weights.salaryPositionScore +
    (isVisaUser ? optVisaAnalysis.score * weights.optVisaScore : 0),
  );

  emit('overall', 'complete', overallScore);

  return {
    overallScore,
    atsScore: atsAnalysis.score,
    keywordScore: keywordAnalysis.score,
    redFlagScore: redFlagAnalysis.score,
    impactScore: impactAnalysis.score,
    readabilityScore: readabilityAnalysis.score,
    biasRiskScore: biasAnalysis.score,
    aiDetectionScore: aiDetectionAnalysis.score,
    optVisaScore: optVisaAnalysis.score,
    salaryPositionScore: salaryAnalysis.score,
    trajectoryScore: trajectoryAnalysis.score,
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
  };
}
