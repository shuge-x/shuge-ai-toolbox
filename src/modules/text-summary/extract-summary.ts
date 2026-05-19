import { splitSentences } from './text-utils';
import { isStopword } from './stopwords';

type SummaryLength = 'short' | 'medium' | 'long';

const LENGTH_LIMITS: Record<SummaryLength, number> = {
  short: 3,
  medium: 5,
  long: 8,
};

function getWordFrequency(sentences: string[]): Map<string, number> {
  const freq = new Map<string, number>();

  for (const sentence of sentences) {
    const words = sentence.toLowerCase().split(/[，。！？、\s]/);
    for (const word of words) {
      if (word.length >= 2 && !isStopword(word)) {
        freq.set(word, (freq.get(word) || 0) + 1);
      }
    }
  }

  return freq;
}

function scoreSentence(sentence: string, position: number, total: number, wordFreq: Map<string, number>): number {
  let score = 0;

  // 位置权重：首句最高
  if (position === 0) {
    score += 10;
  } else if (position < total * 0.3) {
    score += 5;
  }

  // 词频权重
  const words = sentence.toLowerCase().split(/[，。！？、\s]/);
  for (const word of words) {
    const count = wordFreq.get(word) || 0;
    if (count >= 2) {
      score += count;
    }
  }

  return score;
}

export function extractSummary(text: string, length: SummaryLength = 'medium'): string {
  if (!text) return '';

  const sentences = splitSentences(text);
  if (sentences.length < 2) {
    return '无法提取有效摘要，请尝试更长的文本';
  }

  const limit = LENGTH_LIMITS[length];
  const wordFreq = getWordFrequency(sentences);

  // 计算每句得分并排序
  const scored = sentences.map((sentence, index) => ({
    sentence,
    score: scoreSentence(sentence, index, sentences.length, wordFreq),
    originalIndex: index,
  }));

  scored.sort((a, b) => b.score - a.score);

  // 取前 N 句，保持原始顺序
  const selected = scored.slice(0, limit);
  selected.sort((a, b) => a.originalIndex - b.originalIndex);

  return selected.map(s => s.sentence).join('');
}