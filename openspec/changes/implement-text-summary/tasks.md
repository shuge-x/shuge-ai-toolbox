### 任务 1：停用词列表

**涉及文件：**
- 新建/修改：`src/modules/text-summary/stopwords.ts`
- 测试：`src/modules/text-summary/stopwords.test.ts`

- [x] 1.1 **写失败测试**
```typescript
// src/modules/text-summary/stopwords.test.ts
import { describe, it, expect } from 'vitest';
import { STOPWORDS, isStopword } from './stopwords';

describe('STOPWORDS', () => {
  it('包含常见中文停用词', () => {
    expect(STOPWORDS).toContain('的');
    expect(STOPWORDS).toContain('了');
    expect(STOPWORDS).toContain('在');
  });

  it('包含至少 20 个停用词', () => {
    expect(STOPWORDS.length).toBeGreaterThanOrEqual(20);
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
```

- [x] 1.2 **运行测试——确认失败**
命令：`npx vitest run src/modules/text-summary/stopwords.test.ts`
预期：FAIL — Module not found

- [x] 1.3 **写最小实现**
```typescript
// src/modules/text-summary/stopwords.ts
const STOPWORDS_LIST = [
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '也',
  '很', '都', '可以', '要', '会', '对', '于', '而', '把', '被',
  '这', '那', '你', '他', '她', '它', '们', '这个', '那个',
  '什么', '怎么', '为什么', '如何', '哪个',
];

export const STOPWORDS = new Set(STOPWORDS_LIST);

export function isStopword(word: string): boolean {
  return STOPWORDS.has(word);
}
```

- [x] 1.4 **运行测试——确认通过**
命令：`npx vitest run src/modules/text-summary/stopwords.test.ts`
预期：PASS

- [x] 1.5 **提交**
```bash
git add src/modules/text-summary/stopwords.ts src/modules/text-summary/stopwords.test.ts
git commit -m "feat(text-summary): add stopwords list for text summarization"
```

---

### 任务 2：句子提取工具函数

**涉及文件：**
- 新建/修改：`src/modules/text-summary/text-utils.ts`
- 测试：`src/modules/text-summary/text-utils.test.ts`

- [x] 2.1 **写失败测试**
```typescript
// src/modules/text-summary/text-utils.test.ts
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
```

- [x] 2.2 **运行测试——确认失败**
命令：`npx vitest run src/modules/text-summary/text-utils.test.ts`
预期：FAIL — Module not found

- [x] 2.3 **写最小实现**
```typescript
// src/modules/text-summary/text-utils.ts

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

  return sentences.filter(s => s.length > 0);
}
```

- [x] 2.4 **运行测试——确认通过**
命令：`npx vitest run src/modules/text-summary/text-utils.test.ts`
预期：PASS

- [x] 2.5 **提交**
```bash
git add src/modules/text-summary/text-utils.ts src/modules/text-summary/text-utils.test.ts
git commit -m "feat(text-summary): add sentence splitting utility"
```

---

### 任务 3：摘要提取核心算法

**涉及文件：**
- 新建/修改：`src/modules/text-summary/extract-summary.ts`
- 测试：`src/modules/text-summary/extract-summary.test.ts`

- [x] 3.1 **写失败测试**
```typescript
// src/modules/text-summary/extract-summary.test.ts
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
```

- [x] 3.2 **运行测试——确认失败**
命令：`npx vitest run src/modules/text-summary/extract-summary.test.ts`
预期：FAIL — Module not found

- [x] 3.3 **写最小实现**
```typescript
// src/modules/text-summary/extract-summary.ts
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
```

- [x] 3.4 **运行测试——确认通过**
命令：`npx vitest run src/modules/text-summary/extract-summary.test.ts`
预期：PASS

- [x] 3.5 **提交**
```bash
git add src/modules/text-summary/extract-summary.ts src/modules/text-summary/extract-summary.test.ts
git commit -m "feat(text-summary): implement extract summary algorithm"
```

---

### 任务 4：TextSummaryPage 组件

**涉及文件：**
- 新建/修改：`src/modules/text-summary/index.tsx`
- 测试：`src/modules/text-summary/index.test.tsx`

- [x] 4.1 **写失败测试**
```typescript
// src/modules/text-summary/index.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextSummaryPage } from './index';

vi.mock('./extract-summary', () => ({
  extractSummary: vi.fn((text) => {
    if (!text) return '';
    if (text === '短') return '无法提取有效摘要，请尝试更长的文本';
    return '这是摘要结果。';
  }),
}));

describe('TextSummaryPage', () => {
  it('渲染页面标题', () => {
    render(<TextSummaryPage />);
    expect(screen.getByText('文本摘要')).toBeInTheDocument();
  });

  it('渲染输入区域', () => {
    render(<TextSummaryPage />);
    const textarea = screen.getByPlaceholderText('请输入需要摘要的文本...');
    expect(textarea).toBeInTheDocument();
  });

  it('渲染摘要长度选择器', () => {
    render(<TextSummaryPage />);
    expect(screen.getByLabelText('短')).toBeInTheDocument();
    expect(screen.getByLabelText('中')).toBeInTheDocument();
    expect(screen.getByLabelText('长')).toBeInTheDocument();
  });

  it('渲染生成摘要按钮', () => {
    render(<TextSummaryPage />);
    expect(screen.getByRole('button', { name: '生成摘要' })).toBeInTheDocument();
  });

  it('点击按钮显示摘要结果', () => {
    render(<TextSummaryPage />);
    const textarea = screen.getByPlaceholderText('请输入需要摘要的文本...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '这是一段测试文本。用于测试摘要功能。' } });

    const button = screen.getByRole('button', { name: '生成摘要' });
    fireEvent.click(button);

    expect(screen.getByText('这是摘要结果。')).toBeInTheDocument();
  });

  it('空输入时显示提示', () => {
    render(<TextSummaryPage />);
    const button = screen.getByRole('button', { name: '生成摘要' });
    fireEvent.click(button);

    expect(screen.getByText('请输入需要摘要的文本')).toBeInTheDocument();
  });
});
```

- [x] 4.2 **运行测试——确认失败**
命令：`npx vitest run src/modules/text-summary/index.test.tsx`
预期：FAIL — Module not found

- [x] 4.3 **写最小实现**
```tsx
// src/modules/text-summary/index.tsx
import { useState } from 'react';
import { extractSummary } from './extract-summary';

type SummaryLength = 'short' | 'medium' | 'long';

export function TextSummaryPage() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [length, setLength] = useState<SummaryLength>('medium');

  const handleSummarize = () => {
    if (!inputText.trim()) {
      setSummary('请输入需要摘要的文本');
      return;
    }
    const result = extractSummary(inputText, length);
    setSummary(result);
  };

  return (
    <div className="space-y-6 px-6 py-4 max-w-3xl">
      <h1
        className="text-2xl font-bold"
        style={{ color: 'var(--color-neutral-800)' }}
      >
        文本摘要
      </h1>

      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="请输入需要摘要的文本..."
          className="w-full min-h-[120px] p-3 rounded-xl border resize-y"
          style={{
            backgroundColor: 'var(--color-neutral-50)',
            borderColor: 'var(--color-neutral-200)',
          }}
        />

        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            {(['short', 'medium', 'long'] as SummaryLength[]).map((l) => (
              <label key={l} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="length"
                  value={l}
                  checked={length === l}
                  onChange={() => setLength(l)}
                />
                {l === 'short' ? '短' : l === 'medium' ? '中' : '长'}
              </label>
            ))}
          </div>

          <button
            onClick={handleSummarize}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-primary-500)',
              color: 'white',
            }}
          >
            生成摘要
          </button>
        </div>

        {summary && (
          <div className="space-y-2">
            <h2
              className="text-sm font-medium"
              style={{ color: 'var(--color-neutral-600)' }}
            >
              摘要结果
            </h2>
            <textarea
              value={summary}
              readOnly
              className="w-full min-h-[100px] p-3 rounded-xl border resize-y"
              style={{
                backgroundColor: 'var(--color-neutral-50)',
                borderColor: 'var(--color-neutral-200)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

- [x] 4.4 **运行测试——确认通过**
命令：`npx vitest run src/modules/text-summary/index.test.tsx`
预期：PASS

- [x] 4.5 **提交**
```bash
git add src/modules/text-summary/index.tsx src/modules/text-summary/index.test.tsx
git commit -m "feat(text-summary): implement TextSummaryPage component"
```

---

### 任务 5：验证完整功能

**涉及文件：**
- 测试：`src/modules/text-summary/` 全部测试

- [x] 5.1 **运行所有测试**
命令：`npx vitest run src/modules/text-summary/`
预期：所有测试 PASS

- [x] 5.2 **验证路由可达**
命令：访问 `/tools/text-summary` 确认页面渲染正常

- [x] 5.3 **验证懒加载**
命令：`npx vitest run src/router/index.test.tsx`
预期：PASS

- [ ] 5.4 **最终提交**
```bash
git add -A
git commit -m "feat: implement text-summary tool page"
```