// src/modules/json-formatter/index.tsx
import { useState } from 'react';

export function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const isEmptyInput = !input.trim();

  const handleFormat = () => {
    if (isEmptyInput) {
      setError('请输入 JSON 数据');
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError(`JSON 语法错误：${e instanceof Error ? e.message : '未知错误'}`);
      setOutput('');
    }
  };

  const handleMinify = () => {
    if (isEmptyInput) {
      setError('请输入 JSON 数据');
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError(`JSON 语法错误：${e instanceof Error ? e.message : '未知错误'}`);
      setOutput('');
    }
  };

  const handleValidate = () => {
    if (isEmptyInput) {
      setError('请输入 JSON 数据');
      setOutput('');
      return;
    }
    try {
      JSON.parse(input);
      setError('JSON 语法正确');
      setOutput(input);
    } catch (e) {
      setError(`JSON 语法错误：${e instanceof Error ? e.message : '未知错误'}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-6 px-6 py-4 max-w-3xl">
      <h1
        className="text-2xl font-bold"
        style={{ color: 'var(--color-neutral-800)' }}
      >
        JSON 格式化
      </h1>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入 JSON 数据..."
          className="w-full min-h-[120px] p-3 rounded-xl border resize-y"
          style={{
            backgroundColor: 'var(--color-neutral-50)',
            borderColor: 'var(--color-neutral-200)',
          }}
        />

        <div className="flex gap-3">
          <button
            onClick={handleFormat}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-primary-500)',
              color: 'white',
            }}
          >
            格式化
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-primary-500)',
              color: 'white',
            }}
          >
            压缩
          </button>
          <button
            onClick={handleValidate}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-primary-500)',
              color: 'white',
            }}
          >
            校验
          </button>
        </div>

        {error && (
          <div
            className="p-3 rounded-xl text-sm"
            style={{
              backgroundColor: error.includes('正确') ? 'var(--color-success-50, #f0fdf4)' : 'var(--color-error-50, #fef2f2)',
              color: error.includes('正确') ? 'var(--color-success-700, #15803d)' : 'var(--color-error-700, #b91c1c)',
              borderWidth: '1px',
              borderColor: error.includes('正确') ? 'var(--color-success-200, #bbf7d0)' : 'var(--color-error-200, #fecaca)',
            }}
          >
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-2">
            <h2
              className="text-sm font-medium"
              style={{ color: 'var(--color-neutral-600)' }}
            >
              结果
            </h2>
            <textarea
              value={output}
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

export default JsonFormatterPage;