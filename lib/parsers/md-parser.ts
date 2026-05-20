export function parseMD(content: string): { text: string; wordCount: number } {
  const text = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return { text, wordCount };
}
