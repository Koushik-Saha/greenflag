import { getSession } from '@/lib/auth/session';
import { createResume } from '@/lib/db/queries';
import { uploadToS3 } from '@/lib/s3';
import { parsePDF } from '@/lib/parsers/pdf-parser';
import { parseDOCX } from '@/lib/parsers/docx-parser';
import { parseMD } from '@/lib/parsers/md-parser';

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
  'text/plain',
];

function fileType(name: string, mime: string): 'pdf' | 'docx' | 'md' | null {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf' || mime === 'application/pdf') return 'pdf';
  if (ext === 'docx' || mime.includes('wordprocessingml')) return 'docx';
  if (ext === 'md' || mime === 'text/markdown' || mime === 'text/plain') return 'md';
  return null;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });
  if (file.size > MAX_SIZE) return Response.json({ error: 'File too large (max 4 MB)' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type) && !['pdf', 'docx', 'md'].includes(file.name.split('.').pop()?.toLowerCase() ?? '')) {
    return Response.json({ error: 'Unsupported file type. Upload PDF, DOCX, or MD.' }, { status: 400 });
  }

  const type = fileType(file.name, file.type);
  if (!type) return Response.json({ error: 'Unsupported file type' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `resumes/${session.user.id}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const contentType = file.type || 'application/octet-stream';

  const fileUrl = await uploadToS3(buffer, key, contentType);

  let text = '';
  let pageCount = 1;
  let wordCount = 0;

  if (type === 'pdf') {
    const parsed = await parsePDF(buffer);
    text = parsed.text;
    pageCount = parsed.pageCount;
    wordCount = parsed.wordCount;
  } else if (type === 'docx') {
    const parsed = await parseDOCX(buffer);
    text = parsed.text;
    pageCount = parsed.pageCount;
    wordCount = parsed.wordCount;
  } else {
    const parsed = parseMD(buffer.toString('utf-8'));
    text = parsed.text;
    wordCount = parsed.wordCount;
  }

  if (!text.trim()) {
    return Response.json({ error: 'Could not extract text from file' }, { status: 422 });
  }

  const resume = await createResume({
    userId: session.user.id,
    fileName: file.name,
    fileUrl,
    fileType: type,
    rawText: text,
    wordCount,
    pageCount,
  });

  return Response.json({ resumeId: resume.id, fileName: file.name });
}
