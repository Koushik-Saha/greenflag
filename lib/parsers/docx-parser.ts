import mammoth from 'mammoth';

export async function parseDOCX(buffer: Buffer): Promise<{ text: string; pageCount: number; wordCount: number }> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value.replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const estimatedPageCount = Math.ceil(wordCount / 300);
  return { text, pageCount: estimatedPageCount, wordCount };
}
