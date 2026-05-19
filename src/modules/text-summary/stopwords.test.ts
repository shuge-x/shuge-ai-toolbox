import { describe, it, expect } from 'vitest';
import { STOPWORDS, isStopword } from './stopwords';

describe('STOPWORDS', () => {
  it('包含常见中文停用词', () => {
    expect(STOPWORDS).toContain('的');
    expect(STOPWORDS).toContain('了');
    expect(STOPWORDS).toContain('在');
  });

  it('包含至少 20 个停用词', () => {
    expect(STOPWORDS.size).toBeGreaterThanOrEqual(20);
  });
});

describe('isStopword', () => {
  it('返回 true 当词语是停用词', () => {
    expect(isStopword('的')).toBe(true);
    expect(isStopword('了')).toBe(true);
  });

  it('返回 false 当词语不是停用词', () => {
    expect(isStopword('苹果')).toBe(false);
    expect(isStopword('学习')).toBe(false);
  });
});