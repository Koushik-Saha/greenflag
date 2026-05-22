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
  try {
    // Step 1: auth
    console.log('[upload] step 1: checking session');
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    console.log('[upload] step 1: session ok, userId:', session.user.id);

    // Step 2: parse form
    console.log('[upload] step 2: parsing formData');
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });
    console.log('[upload] step 2: file name:', file.name, 'size:', file.size, 'type:', file.type);

    if (file.size > MAX_SIZE) return Response.json({ error: 'File too large (max 4 MB)' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type) && !['pdf', 'docx', 'md'].includes(file.name.split('.').pop()?.toLowerCase() ?? '')) {
      return Response.json({ error: 'Unsupported file type. Upload PDF, DOCX, or MD.' }, { status: 400 });
    }

    const type = fileType(file.name, file.type);
    if (!type) return Response.json({ error: 'Unsupported file type' }, { status: 400 });
    console.log('[upload] step 2: file type:', type);

    const buffer = Buffer.from(await file.arrayBuffer());

    // Step 3: S3 upload
    console.log('[upload] step 3: uploading to S3');
    const key = `resumes/${session.user.id}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const contentType = file.type || 'application/octet-stream';
    let fileUrl: string;
    try {
      fileUrl = await uploadToS3(buffer, key, contentType);
      console.log('[upload] step 3: S3 ok, url:', fileUrl);
    } catch (err) {
      console.error('[upload] step 3: S3 FAILED:', err);
      return Response.json({ error: 'Failed to upload file to storage. Please try again.' }, { status: 500 });
    }

    // Step 4: parse text
    console.log('[upload] step 4: parsing text, type:', type);
    let text = '';
    let pageCount = 1;
    let wordCount = 0;
    try {
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
      console.log('[upload] step 4: parsed ok, words:', wordCount);
    } catch (err) {
      console.error('[upload] step 4: parse FAILED:', err);
      return Response.json({ error: 'Could not read the file. Make sure it is a valid PDF, DOCX, or MD.' }, { status: 422 });
    }

    if (!text.trim()) {
      return Response.json({ error: 'No text found. Make sure the resume is not an image-only PDF.' }, { status: 422 });
    }

    // Step 5: save to DB
    console.log('[upload] step 5: saving to DB');
    const resume = await createResume({
      userId: session.user.id,
      fileName: file.name,
      fileUrl,
      fileType: type,
      rawText: text,
      wordCount,
      pageCount,
    });
    console.log('[upload] step 5: DB ok, resumeId:', resume.id);

    return Response.json({ resumeId: resume.id, fileName: file.name });
  } catch (err) {
    console.error('[upload] UNEXPECTED error:', err);
    return Response.json({ error: 'Unexpected server error. Please try again.' }, { status: 500 });
  }
}
