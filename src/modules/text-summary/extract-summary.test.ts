import { describe, it, expect } from 'vitest';
import { extractSummary } from './extract-summary';

describe('extractSummary', () => {
  it('返回空字符串当输入为空', () => {
    expect(extractSummary('', 'medium')).toBe('');
    expect(extractSummary(null as unknown as string, 'medium')).toBe('');
    expect(extractSummary(undefined as unknown as string, 'medium')).toBe('');
  });

  it('返回提示当文本太短无法摘要', () => {
    const result = extractSummary('短文本', 'medium');
    expect(result).toContain('无法提取有效摘要');
  });

  it('按位置权重提取关键句', () => {
    const text = '这是第一句，包含核心观点。第二句不太重要。第三句也不太重要。';
    const result = extractSummary(text, 'medium');
    expect(result).toContain('这是第一句，包含核心观点。');
  });

  it('支持短摘要模式（最多 3 句）', () => {
    const text = '句一。句二。句三。句四。句五。';
    const result = extractSummary(text, 'short');
    const count = (result.match(/句/g) || []).length;
    expect(count).toBeLessThanOrEqual(3);
  });

  it('支持中摘要模式（最多 5 句）', () => {
    const text = '句一。句二。句三。句四。句五。句六。句七。';
    const result = extractSummary(text, 'medium');
    const count = (result.match(/句/g) || []).length;
    expect(count).toBeLessThanOrEqual(5);
  });

  it('支持长摘要模式（最多 8 句）', () => {
    const text = '句一。句二。句三。句四。句五。句六。句七。句八。句九。句十。';
    const result = extractSummary(text, 'long');
    const count = (result.match(/句/g) || []).length;
    expect(count).toBeLessThanOrEqual(8);
  });

  it('忽略停用词进行词频统计', () => {
    const text = '学习很重要。不断学习很重要。学习是进步的。';
    const result = extractSummary(text, 'medium');
    expect(result).toContain('学习');
  });

  it('不区分大小写', () => {
    const text = 'Apple 是水果。apple 很甜。APPLE 很常见。';
    const result = extractSummary(text, 'medium');
    expect(result).toContain('Apple');
    expect(result).toContain('apple');
  });
});