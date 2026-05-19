export function splitSentences(text: string): string[] {
  if (!text) return [];

  const sentences: string[] = [];
  let current = '';

  for (const char of text) {
    current += char;
    if ('。！？'.includes(char)) {
      sentences.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) {
    sentences.push(current.trim());
  }

  return sentences.filter(s => s.length > 0 && !/^[。！？]+$/.test(s));
}