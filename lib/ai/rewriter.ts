import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const REWRITE_SYSTEM = `You are a master resume writer. Rewrite bullet points to be STRONG. Rules:
- Include a specific quantified achievement (use realistic range like "~40%" if no number exists)
- Start with a powerful action verb showing ownership
- Include scope context (team size, time frame, budget, users affected)
- End with business outcome (revenue, cost, time, retention, growth)
- Keep the same core fact — do NOT fabricate specific company data
- Keep under 2 lines (one complete sentence max)
- Return ONLY the rewritten bullet, nothing else`;

export async function rewriteBullet(params: {
  originalBullet: string;
  targetRole?: string;
  targetIndustry?: string;
}): Promise<ReadableStream<Uint8Array>> {
  const { originalBullet, targetRole, targetIndustry } = params;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: REWRITE_SYSTEM,
    generationConfig: { maxOutputTokens: 300, temperature: 0.4 },
  });

  const result = await model.generateContentStream(
    `Rewrite this bullet for a ${targetRole ?? 'professional'} in ${targetIndustry ?? 'tech'}:\n\n${originalBullet}`,
  );

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });
}

export async function analyzeBulletStrength(bullet: string): Promise<{
  grade: 'STRONG' | 'MEDIUM' | 'WEAK';
  reason: string;
  missingElements: string[];
}> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: 'Analyze resume bullet strength. Return ONLY valid JSON.',
    generationConfig: { maxOutputTokens: 300, temperature: 0.1 },
  });

  const result = await model.generateContent(
    `Analyze this resume bullet:\n"${bullet}"\n\nReturn JSON: { "grade": "STRONG"|"MEDIUM"|"WEAK", "reason": "<one sentence>", "missingElements": ["<element>"] }`,
  );

  const text = result.response.text();
  return JSON.parse(text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim());
}
