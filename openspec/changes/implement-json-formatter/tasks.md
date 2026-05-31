### 任务 1：JsonFormatterPage 组件

**涉及文件：**
- 新建/修改：`src/modules/json-formatter/index.tsx`
- 测试：`src/modules/json-formatter/index.test.tsx`

- [x] 1.1 **写失败测试**
```typescript
// src/modules/json-formatter/index.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JsonFormatterPage } from './index';

describe('JsonFormatterPage', () => {
  it('渲染页面标题', () => {
    render(<JsonFormatterPage />);
    expect(screen.getByText('JSON 格式化')).toBeInTheDocument();
  });

  it('渲染输入区域', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...');
    expect(textarea).toBeInTheDocument();
  });

  it('渲染三个操作按钮', () => {
    render(<JsonFormatterPage />);
    expect(screen.getByRole('button', { name: '格式化' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '压缩' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '校验' })).toBeInTheDocument();
  });

  it('点击格式化按钮显示格式化结果', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{"a":1,"b":2}' } });

    const button = screen.getByRole('button', { name: '格式化' });
    fireEvent.click(button);

    expect(screen.getByText('{\n  "a": 1,\n  "b": 2\n}')).toBeInTheDocument();
  });

  it('点击压缩按钮显示压缩结果', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{\n  "a": 1,\n  "b": 2\n}' } });

    const button = screen.getByRole('button', { name: '压缩' });
    fireEvent.click(button);

    expect(screen.getByText('{"a":1,"b":2}')).toBeInTheDocument();
  });

  it('无效 JSON 显示错误提示', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{invalid json}' } });

    const button = screen.getByRole('button', { name: '校验' });
    fireEvent.click(button);

    expect(screen.getByText(/JSON 语法错误/)).toBeInTheDocument();
  });

  it('空输入显示提示', () => {
    render(<JsonFormatterPage />);
    const button = screen.getByRole('button', { name: '格式化' });
    fireEvent.click(button);

    expect(screen.getByText('请输入 JSON 数据')).toBeInTheDocument();
  });

  it('仅空白字符输入显示提示', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '   \n\t  ' } });

    const button = screen.getByRole('button', { name: '格式化' });
    fireEvent.click(button);

    expect(screen.getByText('请输入 JSON 数据')).toBeInTheDocument();
  });
});
```

- [x] 1.2 **运行测试——确认失败**
命令：`npx vitest run src/modules/json-formatter/index.test.tsx`
预期：FAIL — Module not found

- [x] 1.3 **写最小实现**
```tsx
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
```

- [x] 1.4 **运行测试——确认通过**
命令：`npx vitest run src/modules/json-formatter/index.test.tsx`
预期：PASS

- [x] 1.5 **提交**
```bash
git add src/modules/json-formatter/index.tsx src/modules/json-formatter/index.test.tsx
git commit -m "feat(json-formatter): implement JsonFormatterPage component"
```

---

### 任务 2：Router 映射配置

**涉及文件：**
- 新建/修改：`src/router/index.tsx`

- [x] 2.1 **添加 json-formatter 映射**
编辑 `src/router/index.tsx`，在 `toolModules` 对象中添加：
```typescript
'json-formatter': () => import('/src/modules/json-formatter/index.tsx'),
```

原始代码：
```typescript
const toolModules: Record<string, () => Promise<{ default: React.ComponentType<unknown> }>> = {
  'text-summary': () => import('/src/modules/text-summary/index.tsx'),
};
```

修改后：
```typescript
const toolModules: Record<string, () => Promise<{ default: React.ComponentType<unknown> }>> = {
  'text-summary': () => import('/src/modules/text-summary/index.tsx'),
  'json-formatter': () => import('/src/modules/json-formatter/index.tsx'),
};
```

- [x] 2.2 **验证 router 测试**
命令：`npx vitest run src/router/`
预期：PASS

- [x] 2.3 **提交**
```bash
git add src/router/index.tsx
git commit -m "feat(router): add json-formatter tool module mapping"
```

---

### 任务 3：验证完整功能

**涉及文件：**
- 测试：`src/modules/json-formatter/` 全部测试

- [ ] 3.1 **运行所有测试**
命令：`npx vitest run src/modules/json-formatter/`
预期：所有测试 PASS

- [ ] 3.2 **验证路由可达**
命令：访问 `/tools/json-formatter` 确认页面渲染正常

- [ ] 3.3 **最终提交**
```bash
git add -A
git commit -m "feat: implement json-formatter tool page"
```