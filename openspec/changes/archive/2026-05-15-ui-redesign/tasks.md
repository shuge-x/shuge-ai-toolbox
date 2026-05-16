## 1. 设计系统基础

- [x] 1.1 创建 design-tokens.css 文件

**涉及文件：**
- 新建：`src/theme/tokens.css`

- [x] **第 1 步：创建 tokens.css 文件**

```css
:root {
  /* 品牌色板 - 冷色系 */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-300: #93C5FD;
  --color-primary-400: #60A5FA;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;

  /* 强调色 - 琥珀色 */
  --color-accent-50: #FFFBEB;
  --color-accent-100: #FEF3C7;
  --color-accent-200: #FDE68A;
  --color-accent-300: #FCD34D;
  --color-accent-400: #FBBF24;
  --color-accent-500: #F59E0B;
  --color-accent-600: #D97706;

  /* 中性色 - 冷灰 */
  --color-neutral-50: #F8FAFC;
  --color-neutral-100: #F1F5F9;
  --color-neutral-200: #E2E8F0;
  --color-neutral-300: #CBD5E1;
  --color-neutral-400: #94A3B8;
  --color-neutral-500: #64748B;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1E293B;
  --color-neutral-900: #0F172A;

  /* 语义色 */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* 字体 */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, monospace;

  /* 字号 */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* 行高 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* 字重 */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* 圆角 */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}
```

- [x] **第 2 步：在 index.css 中引入 tokens.css**

打开 `src/index.css`，在文件顶部添加：
```css
@import './theme/tokens.css';
```

命令：`cat src/index.css`
预期：文件顶部包含 `@import './theme/tokens.css';`

- [x] **第 3 步：提交**
```bash
git add src/theme/tokens.css src/index.css
git commit -m "feat: add design tokens CSS variables"
```

## 2. 修复 router bug

- [x] 2.1 修复 toolRoutes 未包裹 Layout

**涉及文件：**
- 修改：`src/router/index.tsx`

- [x] **第 1 步：读取当前 router/index.tsx**
```bash
cat src/router/index.tsx
```

- [x] **第 2 步：修改 router/index.tsx，使 toolRoutes 的每个路由包裹 Layout**

将 `const toolRoutes = tools.map(...)` 的结果改为每个路由包含 Layout 包裹：

```typescript
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getTools } from '../tool-registry/catalog';
import Layout from '../layout/Layout';
import Home from '../app/views/Home';
import NotFound from '../app/views/NotFound';
import PlaceholderPage from '../app/views/PlaceholderPage';

const tools = getTools();

function LazyTool({ tool }: { tool: (typeof tools)[number] }) {
  const ToolComponent = lazy(() => import(`../modules/${tool.id}/index.tsx`));
  return <ToolComponent />;
}

const toolRoutes = tools.map((tool) => ({
  path: `/tools/${tool.id}`,
  element: (
    <Layout>
      {tool.stage === 'planned' ? (
        <PlaceholderPage tool={tool} />
      ) : (
        <Suspense fallback={<div className="p-4">加载中...</div>}>
          <LazyTool tool={tool} />
        </Suspense>
      )}
    </Layout>
  ),
}));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  ...toolRoutes,
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
```

- [x] **第 3 步：运行测试验证**
```bash
npx vitest run src/router/index.test.tsx
```
预期：PASS

- [x] **第 4 步：提交**
```bash
git add src/router/index.tsx
git commit -m "fix: wrap toolRoutes with Layout for TopNav visibility"
```

## 3. 修复 index.html

- [x] 3.1 修正 index.html 的 lang 和 title

**涉及文件：**
- 修改：`index.html`

- [x] **第 1 步：读取当前 index.html**
```bash
cat index.html
```

- [x] **第 2 步：修改 index.html**
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>shuge AI Toolbox</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [x] **第 3 步：验证修改**
```bash
grep -E 'lang="zh-CN"|title>shuge AI Toolbox' index.html
```
预期：两行都匹配

- [x] **第 4 步：提交**
```bash
git add index.html
git commit -m "fix: correct lang and title in index.html"
```

## 4. 重设计 TopNav

- [x] 4.1 更新 TopNav.tsx 使用设计令牌

**涉及文件：**
- 修改：`src/layout/TopNav.tsx`
- 测试：`src/layout/TopNav.test.tsx`

- [ ] **第 1 步：写失败测试——验证新的视觉类名**
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopNav from './TopNav';

describe('TopNav', () => {
  it('显示 Logo 和首页链接', () => {
    const { getByText } = render(
      <MemoryRouter>
        <TopNav />
      </MemoryRouter>
    );
    expect(getByText('shuge AI Toolbox')).toBeTruthy();
    expect(getByText('首页')).toBeTruthy();
  });

  it('Logo 点击跳转首页', () => {
    const { getByText } = render(
      <MemoryRouter>
        <TopNav />
      </MemoryRouter>
    );
    const logoLink = getByText('shuge AI Toolbox').closest('a');
    expect(logoLink?.getAttribute('href')).toBe('/');
  });

  it('首页链接高亮当前路径', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <TopNav />
      </MemoryRouter>
    );
    const homeLink = getByText('首页');
    expect(homeLink.closest('a')?.className).toContain('font-bold');
  });
});
```

- [x] **第 2 步：运行测试——确认通过**
```bash
npx vitest run src/layout/TopNav.test.tsx
```
预期：PASS（测试保持不变，功能不变）

- [x] **第 3 步：更新 TopNav.tsx 使用设计令牌**
```typescript
import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav
      className="flex items-center justify-between px-6 py-4"
      style={{ backgroundColor: 'var(--color-neutral-50)', borderBottom: '1px solid var(--color-neutral-200)' }}
    >
      <Link
        to="/"
        className="text-lg font-semibold"
        style={{ color: 'var(--color-neutral-900)' }}
      >
        shuge AI Toolbox
      </Link>
      <div className="flex gap-4">
        <Link
          to="/"
          className={`px-3 py-1 rounded-md transition-colors ${
            isHome ? 'font-bold' : 'hover:opacity-80'
          }`}
          style={{
            color: isHome ? 'var(--color-primary-500)' : 'var(--color-neutral-600)',
          }}
        >
          首页
        </Link>
      </div>
    </nav>
  );
}
```

- [x] **第 4 步：运行测试——确认通过**
```bash
npx vitest run src/layout/TopNav.test.tsx
```
预期：PASS

- [x] **第 5 步：提交**
```bash
git add src/layout/TopNav.tsx
git commit -m "refactor: apply design tokens to TopNav"
```

## 5. 重设计 Home

- [x] 5.1 更新 Home.tsx 使用设计令牌

**涉及文件：**
- 修改：`src/app/views/Home.tsx`
- 测试：`src/app/views/Home.test.tsx`

- [x] **第 1 步：更新 Home.tsx 使用设计令牌**
```typescript
import { Link } from 'react-router-dom';
import { getTools } from '../../tool-registry/catalog';

const stagePriority = { active: 0, beta: 1, planned: 2 };

export default function Home() {
  const tools = getTools();

  const grouped = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <div className="space-y-12 px-6 py-8">
      <div className="text-center py-12">
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: 'var(--color-neutral-900)' }}
        >
          shuge AI Toolbox
        </h1>
        <p style={{ color: 'var(--color-neutral-500)' }}>
          探索 AI 工具，提升工作效率
        </p>
      </div>

      {sortedCategories.map((category) => {
        const categoryTools = grouped[category].sort((a, b) => {
          const priorityDiff = stagePriority[a.stage] - stagePriority[b.stage];
          if (priorityDiff !== 0) return priorityDiff;
          return a.name.localeCompare(b.name);
        });

        return (
          <section key={category}>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--color-neutral-800)' }}
            >
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className={`block p-5 rounded-xl border transition-all ${
                    tool.stage === 'planned' ? 'opacity-60' : 'hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: 'var(--color-neutral-50)',
                    borderColor: tool.stage === 'planned'
                      ? 'var(--color-neutral-200)'
                      : 'var(--color-neutral-200)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="font-medium"
                      style={{ color: 'var(--color-neutral-900)' }}
                    >
                      {tool.name}
                    </h3>
                    {tool.stage === 'planned' && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: 'var(--color-neutral-200)',
                          color: 'var(--color-neutral-600)',
                        }}
                      >
                        Planned
                      </span>
                    )}
                    {tool.stage === 'beta' && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: 'var(--color-accent-100)',
                          color: 'var(--color-accent-600)',
                        }}
                      >
                        Beta
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-neutral-500)' }}
                  >
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
```

- [x] **第 2 步：运行测试——确认通过**
```bash
npx vitest run src/app/views/Home.test.tsx
```
预期：PASS

- [x] **第 3 步：提交**
```bash
git add src/app/views/Home.tsx
git commit -m "refactor: apply design tokens to Home"
```

## 6. 重设计 PlaceholderPage

- [x] 6.1 更新 PlaceholderPage.tsx 使用设计令牌

**涉及文件：**
- 修改：`src/app/views/PlaceholderPage.tsx`
- 测试：`src/app/views/PlaceholderPage.test.tsx`

- [x] **第 1 步：读取现有测试**
```bash
cat src/app/views/PlaceholderPage.test.tsx
```

- [x] **第 2 步：更新 PlaceholderPage.tsx 使用设计令牌**
```typescript
import { Link } from 'react-router-dom';
import type { ToolManifest } from '../../tool-registry/catalog';

interface PlaceholderPageProps {
  tool: ToolManifest;
}

export default function PlaceholderPage({ tool }: PlaceholderPageProps) {
  const displayName = tool.name || '未命名工具';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="border rounded-xl p-8 max-w-md w-full"
        style={{
          backgroundColor: 'var(--color-neutral-50)',
          borderColor: 'var(--color-neutral-200)',
        }}
      >
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: 'var(--color-neutral-800)' }}
        >
          {displayName}
        </h1>
        {tool.description && (
          <p
            className="mb-6"
            style={{ color: 'var(--color-neutral-600)' }}
          >
            {tool.description}
          </p>
        )}
        <div
          className="rounded-lg px-4 py-3 mb-6"
          style={{
            backgroundColor: 'var(--color-accent-50)',
            border: '1px solid var(--color-accent-200)',
          }}
        >
          <p
            className="text-sm"
            style={{ color: 'var(--color-accent-600)' }}
          >
            ⏳ 该工具正在规划中，敬请期待。
          </p>
        </div>
        <Link
          to="/"
          className="hover:underline transition-colors"
          style={{ color: 'var(--color-primary-500)' }}
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
```

- [x] **第 3 步：运行测试——确认通过**
```bash
npx vitest run src/app/views/PlaceholderPage.test.tsx
```
预期：PASS

- [x] **第 4 步：提交**
```bash
git add src/app/views/PlaceholderPage.tsx
git commit -m "refactor: apply design tokens to PlaceholderPage"
```

## 7. 重设计 NotFound

- [x] 7.1 更新 NotFound.tsx 使用设计令牌

**涉及文件：**
- 修改：`src/app/views/NotFound.tsx`
- 测试：`src/app/views/NotFound.tsx`（无独立测试文件）

- [x] **第 1 步：更新 NotFound.tsx 使用设计令牌**
```typescript
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <h1
        className="text-6xl font-bold mb-4"
        style={{ color: 'var(--color-primary-500)' }}
      >
        404
      </h1>
      <p
        className="text-xl mb-6"
        style={{ color: 'var(--color-neutral-600)' }}
      >
        页面未找到
      </p>
      <Link
        to="/"
        className="hover:underline transition-colors"
        style={{ color: 'var(--color-primary-500)' }}
      >
        返回首页
      </Link>
    </main>
  );
}
```

- [x] **第 2 步：提交**
```bash
git add src/app/views/NotFound.tsx
git commit -m "refactor: apply design tokens to NotFound"
```

## 8. 验证

- [x] 8.1 运行全部测试确保无回归

命令：`npx vitest run`
预期：ALL PASS

- [x] 8.2 最终提交
```bash
git add -A
git commit -m "feat: complete ui-redesign with design system"
```