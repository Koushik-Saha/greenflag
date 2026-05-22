import { GoogleGenerativeAI } from '@google/generative-ai';
import { GHOST_JOB_PROMPT } from './prompts';
import type { GhostJobAnalysis } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeGhostJob(jobDescription: string): Promise<GhostJobAnalysis> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: GHOST_JOB_PROMPT,
    generationConfig: { maxOutputTokens: 1500, temperature: 0.2 },
  });

  const result = await model.generateContent(`Job Description:\n\n${jobDescription}`);
  const text = result.response.text();
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned) as GhostJobAnalysis;
}
