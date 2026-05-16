## 1. Tab 导航组件测试

- [ ] 1.1 编写 Tab 导航组件测试
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../views/Home';
import { getTools } from '../../tool-registry/catalog';

describe('Home Tab 导航', () => {
  it('默认显示「全部」Tab 为活跃状态', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const allTab = screen.getByRole('button', { name: '全部' });
    expect(allTab).toBeTruthy();
  });

  it('点击分类 Tab 过滤卡片，仅显示该分类工具', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const textProcessingTab = screen.getByRole('button', { name: '文本处理' });
    fireEvent.click(textProcessingTab);

    const visibleCards = screen.getAllByRole('link');
    const tools = getTools().filter(t => t.category === '文本处理');
    expect(visibleCards.length).toBe(tools.length);
  });

  it('点击分类 Tab 后滚动到顶部', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const textProcessingTab = screen.getByRole('button', { name: '文本处理' });

    fireEvent.click(textProcessingTab);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('点击「全部」Tab 恢复显示全量工具', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const textProcessingTab = screen.getByRole('button', { name: '文本处理' });
    fireEvent.click(textProcessingTab);

    const allTab = screen.getByRole('button', { name: '全部' });
    fireEvent.click(allTab);

    const visibleCards = screen.getAllByRole('link');
    expect(visibleCards.length).toBe(getTools().length);
  });

  it('Tab 列表从 catalog 动态获取，不硬编码', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const tools = getTools();
    const categories = [...new Set(tools.map(t => t.category))];

    categories.forEach(cat => {
      expect(screen.getByRole('button', { name: cat })).toBeTruthy();
    });
  });

  it('活跃 Tab 有视觉高亮样式', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const textProcessingTab = screen.getByRole('button', { name: '文本处理' });
    fireEvent.click(textProcessingTab);

    const activeTab = screen.getByRole('button', { name: '文本处理' });
    expect(activeTab.className).toContain('border-b-2');
  });
});
```

- [ ] 1.2 运行测试——确认失败
命令：`npx vitest run src/app/views/Home.test.tsx`
预期：FAIL — '全部' button not found

- [ ] 1.3 提交测试
```bash
git add src/app/views/Home.test.tsx
git commit -m "test: add Tab navigation tests to Home"
```

## 2. 实现 Tab 导航 UI

- [ ] 2.1 实现 Tab 导航栏组件
在 `Home.tsx` 中新增 Tab 栏和状态逻辑：

```tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTools } from '../../tool-registry/catalog';

const stagePriority = { active: 0, beta: 1, planned: 2 };

export default function Home() {
  const tools = getTools();
  const categories = [...new Set(tools.map(t => t.category))];
  const [activeTab, setActiveTab] = useState<string>('全部');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTools = activeTab === '全部'
    ? tools
    : tools.filter(t => t.category === activeTab);

  return (
    <div className="space-y-12 px-6 py-8">
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-neutral-900)' }}>
          shuge AI Toolbox
        </h1>
        <p style={{ color: 'var(--color-neutral-500)' }}>
          探索 AI 工具，提升工作效率
        </p>
      </div>

      {/* Tab 导航栏 */}
      <nav className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => handleTabClick('全部')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === '全部'
              ? 'border-b-2 border-accent-500 text-accent-600'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          全部
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleTabClick(cat)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === cat
                ? 'border-b-2 border-accent-500 text-accent-600'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* 过滤后的卡片列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => (
          <Link
            key={tool.id}
            to={`/tools/${tool.id}`}
            className={`block p-5 rounded-xl border transition-all ${
              tool.stage === 'planned' ? 'opacity-60' : 'hover:shadow-md'
            }`}
            style={{
              backgroundColor: 'var(--color-neutral-50)',
              borderColor: 'var(--color-neutral-200)',
            }}
          >
            {/* 卡片内容保持不变 */}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] 2.2 运行测试——确认通过
命令：`npx vitest run src/app/views/Home.test.tsx`
预期：PASS

- [ ] 2.3 提交实现
```bash
git add src/app/views/Home.tsx
git commit -m "feat: add Tab navigation to Home page"
```

## 3. 优化卡片列表渲染

- [ ] 3.1 将过滤后的工具按分类分组显示

当前实现只显示过滤后的扁平列表，但原始设计是按分类分组显示。需要调整：

```tsx
{/* 全部 Tab 时分组显示，分类 Tab 时只显示该分类卡片 */}
{activeTab === '全部' ? (
  sortedCategories.map(category => {
    const categoryTools = filteredTools.filter(t => t.category === category);
    return (
      <section key={category}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-neutral-800)' }}>
          {category}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    );
  })
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {filteredTools.map(tool => (
      <ToolCard key={tool.id} tool={tool} />
    ))}
  </div>
)}
```

- [ ] 3.2 提取 ToolCard 组件以复用

```tsx
function ToolCard({ tool }: { tool: ToolManifest }) {
  return (
    <Link
      to={`/tools/${tool.id}`}
      className={`block p-5 rounded-xl border transition-all ${
        tool.stage === 'planned' ? 'opacity-60' : 'hover:shadow-md'
      }`}
      style={{
        backgroundColor: 'var(--color-neutral-50)',
        borderColor: 'var(--color-neutral-200)',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium" style={{ color: 'var(--color-neutral-900)' }}>
          {tool.name}
        </h3>
        {tool.stage === 'planned' && <span className="text-xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-600">Planned</span>}
        {tool.stage === 'beta' && <span className="text-xs px-2 py-0.5 rounded bg-accent-100 text-accent-600">Beta</span>}
      </div>
      <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>
        {tool.description}
      </p>
    </Link>
  );
}
```

- [ ] 3.3 运行测试——确认通过
命令：`npx vitest run src/app/views/Home.test.tsx`
预期：PASS

- [ ] 3.4 提交
```bash
git add src/app/views/Home.tsx
git commit -m "refactor: extract ToolCard component and group by category"
```

## 4. 验收测试

- [ ] 4.1 运行完整测试套件
命令：`npx vitest run`
预期：所有测试通过

- [ ] 4.2 提交最终版本
```bash
git add -A
git commit -m "feat: complete Tab navigation for Home page"
```