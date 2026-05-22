// Use lib/pdf-parse.js directly to skip the test-file loading that pdf-parse's
// index.js does on startup — this avoids 500s in Next.js server environments.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse') as (buf: Buffer) => Promise<{ text: string; numpages: number }>;

export async function parsePDF(buffer: Buffer): Promise<{ text: string; pageCount: number; wordCount: number }> {
  const data = await pdfParse(buffer);
  const text = data.text.replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return { text, pageCount: data.numpages, wordCount };
}
