import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getResumeById, createScan, updateScanScores, incrementScansUsed, logUserEvent } from '@/lib/db/queries';
import { runFullScan } from '@/lib/ai/scorer';

const ScanRequestSchema = z.object({
  resumeId: z.string().uuid(),
  jobDescription: z.string().optional(),
  targetRole: z.string().optional(),
  targetCompany: z.string().optional(),
  targetIndustry: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { user } = session;

  const body = await req.json();
  const parsed = ScanRequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });

  const { resumeId, jobDescription, targetRole, targetCompany, targetIndustry } = parsed.data;

  if (user.plan === 'free' && (user.scansUsed ?? 0) >= (user.scansLimit ?? 3)) {
    return Response.json({ error: 'Scan limit reached', code: 'LIMIT_REACHED', message: 'Upgrade to Pro for unlimited scans' }, { status: 403 });
  }

  const resume = await getResumeById(resumeId, user.id);
  if (!resume) return Response.json({ error: 'Resume not found' }, { status: 404 });

  const scan = await createScan({ userId: user.id, resumeId, jobDescription, targetRole, targetCompany, targetIndustry });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        await updateScanScores(scan.id, { status: 'processing' });
        send({ type: 'started', scanId: scan.id });

        const startTime = Date.now();
        const results = await runFullScan({
          resumeText: resume.rawText,
          jobDescription,
          targetRole: targetRole ?? user.targetRole ?? undefined,
          targetIndustry: targetIndustry ?? user.targetIndustry ?? undefined,
          workAuthorization: user.workAuthorization ?? undefined,
          onProgress: (scoreName, status, value, analysis) => {
            send({ type: status === 'analyzing' ? 'progress' : 'score', score: scoreName, status, value, analysis });
          },
        });

        const processingTime = Date.now() - startTime;

        await updateScanScores(scan.id, {
          status: 'complete',
          processingTime,
          overallScore: results.overallScore,
          atsScore: results.atsScore,
          keywordScore: results.keywordScore,
          redFlagScore: results.redFlagScore,
          impactScore: results.impactScore,
          readabilityScore: results.readabilityScore,
          biasRiskScore: results.biasRiskScore,
          aiDetectionScore: results.aiDetectionScore,
          optVisaScore: results.optVisaScore,
          salaryPositionScore: results.salaryPositionScore,
          trajectoryScore: results.trajectoryScore,
          atsAnalysis: results.atsAnalysis,
          keywordAnalysis: results.keywordAnalysis,
          redFlagAnalysis: results.redFlagAnalysis,
          impactAnalysis: results.impactAnalysis,
          readabilityAnalysis: results.readabilityAnalysis,
          biasAnalysis: results.biasAnalysis,
          aiDetectionAnalysis: results.aiDetectionAnalysis,
          optVisaAnalysis: results.optVisaAnalysis,
          salaryAnalysis: results.salaryAnalysis,
          trajectoryAnalysis: results.trajectoryAnalysis,
        });

        await incrementScansUsed(user.id);
        await logUserEvent(user.id, 'scan_completed', { scanId: scan.id, overallScore: results.overallScore });

        send({ type: 'complete', scanId: scan.id, overallScore: results.overallScore });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        await updateScanScores(scan.id, { status: 'error' });
        send({ type: 'error', message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
