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

export default TextSummaryPage;