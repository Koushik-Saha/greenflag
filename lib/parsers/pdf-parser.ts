// pdf-parse is CJS-only; require avoids ESM default-export mismatch
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string; numpages: number }>;

export async function parsePDF(buffer: Buffer): Promise<{ text: string; pageCount: number; wordCount: number }> {
  const data = await pdfParse(buffer);
  const text = data.text.replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return { text, pageCount: data.numpages, wordCount };
}
