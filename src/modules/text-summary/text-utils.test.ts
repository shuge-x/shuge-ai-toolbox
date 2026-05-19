import { describe, it, expect } from 'vitest';
import { splitSentences } from './text-utils';

describe('splitSentences', () => {
  it('将文本拆分为句子', () => {
    const text = '这是第一句。这是第二句！这是第三句？';
    const sentences = splitSentences(text);
    expect(sentences).toHaveLength(3);
    expect(sentences[0]).toBe('这是第一句。');
  });

  it('处理空字符串', () => {
    const result = splitSentences('');
    expect(result).toEqual([]);
  });

  it('处理只有标点的文本', () => {
    const result = splitSentences('。！？');
    expect(result).toEqual([]);
  });

  it('保留换行符分隔的段落', () => {
    const text = '第一段第一句。第一段第二句。\n第二段第一句。';
    const sentences = splitSentences(text);
    expect(sentences).toHaveLength(3);
  });
});