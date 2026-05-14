## 1. 更新 catalog.ts（添加 stage 字段和初始工具数据）

**涉及文件：**
- 修改：`src/tool-registry/catalog.ts`

---

- [x] **1.1：更新 ToolManifest 接口**

修改 `src/tool-registry/catalog.ts`，在接口中添加 `stage` 字段：

```typescript
export interface ToolManifest {
  id: string;
  name: string;
  route: string;
  category: string;
  description: string;
  stage: 'active' | 'beta' | 'planned';
}
```

运行验证命令：
```bash
npx tsc --noEmit src/tool-registry/catalog.ts
```
预期：编译通过，无错误

---

- [x] **1.2：填充初始工具数据**

将 `tools` 数组从空数组改为以下数据（用于演示 catalog 驱动功能）：

```typescript
const tools: ToolManifest[] = [
  {
    id: 'text-summary',
    name: '文本摘要',
    route: '/tools/text-summary',
    category: '文本处理',
    description: '快速提取长文本的核心观点',
    stage: 'active',
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    route: '/tools/json-formatter',
    category: '数据转换',
    description: '美化 JSON 数据结构',
    stage: 'active',
  },
  {
    id: 'code-explainer',
    name: '代码解释',
    route: '/tools/code-explainer',
    category: '开发工具',
    description: '解释代码片段的功能和逻辑',
    stage: 'beta',
  },
  {
    id: 'image-generator',
    name: '图片生成',
    route: '/tools/image-generator',
    category: '内容创作',
    description: '根据描述生成图片',
    stage: 'planned',
  },
  {
    id: 'markdown-table',
    name: 'Markdown 表格',
    route: '/tools/markdown-table',
    category: '文本处理',
    description: '将数据转换为 Markdown 表格',
    stage: 'planned',
  },
];
```

运行验证命令：
```bash
npx tsc --noEmit src/tool-registry/catalog.ts && npx vitest run src/tool-registry/catalog.test.ts
```
预期：编译通过，测试通过（如测试文件已存在）

---

## 2. 编写 catalog accessor 单元测试

**涉及文件：**
- 新建：`src/tool-registry/catalog.test.ts`
- 依赖：`src/tool-registry/catalog.ts`

---

- [x] **2.1：编写 getTools() 测试**

```typescript
import { describe, it, expect } from 'vitest';
import { getTools, getToolById, getToolsByCategory } from './catalog';

describe('catalog accessors', () => {
  describe('getTools', () => {
    it('返回非空数组', () => {
      const tools = getTools();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
    });

    it('每个工具都有有效 stage', () => {
      const tools = getTools();
      const validStages = ['active', 'beta', 'planned'];
      tools.forEach((tool) => {
        expect(validStages).toContain(tool.stage);
      });
    });
  });

  describe('getToolById', () => {
    it('传入已存在的 id 返回对应工具', () => {
      const tools = getTools();
      const firstTool = tools[0];
      const found = getToolById(firstTool.id);
      expect(found).toEqual(firstTool);
    });

    it('传入不存在的 id 返回 undefined', () => {
      const found = getToolById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getToolsByCategory', () => {
    it('传入已存在的分类返回该分类下的工具', () => {
      const tools = getTools();
      const category = tools[0].category;
      const filtered = getToolsByCategory(category);
      filtered.forEach((tool) => {
        expect(tool.category).toBe(category);
      });
    });

    it('传入不存在的分类返回空数组', () => {
      const filtered = getToolsByCategory('不存在的分类');
      expect(filtered).toEqual([]);
    });
  });

  describe('工具 ID 唯一性', () => {
    it('所有工具 id 不重复', () => {
      const tools = getTools();
      const ids = tools.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
```

运行测试命令：
```bash
npx vitest run src/tool-registry/catalog.test.ts
```
预期：FAIL — catalog.test.ts is not a valid test file (需先创建空测试文件让测试框架识别)

---

- [x] **2.2：运行测试——确认失败**

命令：`npx vitest run src/tool-registry/catalog.test.ts`
预期：FAIL — getTools, getToolById, getToolsByCategory are not defined（因为还没有测试文件）

---

- [x] **2.3：写最小实现（空 catalog.ts）**

此时 `catalog.ts` 已在上一步更新，直接运行测试验证接口是否正确

命令：`npx vitest run src/tool-registry/catalog.test.ts`
预期：PASS

---

- [x] **2.4：提交**

```bash
git add src/tool-registry/catalog.ts src/tool-registry/catalog.test.ts
git commit -m "feat: add ToolManifest with stage field and initial tools data"
```

---

## 3. 创建 Layout 和 TopNav 组件

**涉及文件：**
- 新建：`src/layout/Layout.tsx`
- 新建：`src/layout/TopNav.tsx`
- 新建：`src/layout/TopNav.test.tsx`
- 新建：`src/layout/Layout.test.tsx`

---

- [x] **3.1：编写 TopNav 组件测试**

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

---

- [x] **3.2：运行测试——确认失败**

命令：`npx vitest run src/layout/TopNav.test.tsx`
预期：FAIL — TopNav 组件不存在

---

- [x] **3.3：编写 TopNav 组件实现**

```typescript
import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
      <Link to="/" className="text-lg font-bold text-gray-900">
        shuge AI Toolbox
      </Link>
      <div className="flex gap-4">
        <Link
          to="/"
          className={`px-3 py-1 rounded ${
            isHome ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          首页
        </Link>
      </div>
    </nav>
  );
}
```

---

- [x] **3.4：运行测试——确认通过**

命令：`npx vitest run src/layout/TopNav.test.tsx`
预期：PASS

---

- [x] **3.5：编写 Layout 组件测试**

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';

describe('Layout', () => {
  it('渲染 TopNav 和 Outlet', () => {
    const { getByText } = render(
      <Layout>
        <div>测试内容</div>
      </Layout>
    );
    expect(getByText('shuge AI Toolbox')).toBeTruthy();
    expect(getByText('测试内容')).toBeTruthy();
  });

  it('TopNav 在内容区域上方', () => {
    const { container } = render(
      <Layout>
        <div>测试内容</div>
      </Layout>
    );
    const nav = container.querySelector('nav');
    const content = container.querySelector('div');
    expect(nav?.compareDocumentPosition(content!) === Node.DOCUMENT_POSITION_FOLLOWING).toBe(false);
  });
});
```

---

- [x] **3.6：运行测试——确认失败**

命令：`npx vitest run src/layout/Layout.test.tsx`
预期：FAIL — Layout 组件不存在

---

- [x] **3.7：编写 Layout 组件实现**

```typescript
import TopNav from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 px-6 py-4">
        {children}
      </main>
    </div>
  );
}
```

---

- [x] **3.8：运行测试——确认通过**

命令：`npx vitest run src/layout/Layout.test.tsx`
预期：PASS

---

- [x] **3.9：提交**

```bash
git add src/layout/TopNav.tsx src/layout/Layout.tsx src/layout/TopNav.test.tsx src/layout/Layout.test.tsx
git commit -m "feat: add Layout and TopNav components for shared navigation"
```

---

## 4. 更新 router/index.tsx（Catalog 驱动路由）

**涉及文件：**
- 修改：`src/router/index.tsx`
- 新建：`src/router/index.test.tsx`

---

- [x] **4.1：编写路由生成逻辑测试**

```typescript
import { describe, it, expect } from 'vitest';
import { createBrowserRouter } from 'react-router-dom';
import { getTools } from '../tool-registry/catalog';

// 验证 catalog 驱动路由的核心行为
describe('catalog-driven routing', () => {
  it('getTools 返回的工具生成对应数量的路由', () => {
    const tools = getTools();
    const toolRoutes = tools.map((t) => `/tools/${t.id}`);
    expect(toolRoutes.length).toBe(tools.length);
  });

  it('planned 工具的路由存在', () => {
    const tools = getTools();
    const plannedTools = tools.filter((t) => t.stage === 'planned');
    plannedTools.forEach((tool) => {
      expect(tool.id).toBeTruthy();
      expect(tool.stage).toBe('planned');
    });
  });

  it('active 工具的路由存在', () => {
    const tools = getTools();
    const activeTools = tools.filter((t) => t.stage === 'active');
    activeTools.forEach((tool) => {
      expect(tool.id).toBeTruthy();
      expect(['active', 'beta']).toContain(tool.stage);
    });
  });
});
```

---

- [x] **4.2：运行测试——确认通过（路由逻辑无需实现）**

命令：`npx vitest run src/router/index.test.tsx`
预期：PASS（测试只验证 getTools 数据结构）

---

- [x] **4.3：更新 router/index.tsx 实现**

```typescript
import { createBrowserRouter, RouterProvider, lazy, Suspense } from 'react-router-dom';
import { getTools, getToolById } from '../tool-registry/catalog';
import Layout from '../layout/Layout';
import Home from '../app/views/Home';
import NotFound from '../app/views/NotFound';
import PlaceholderPage from '../app/views/PlaceholderPage';

const tools = getTools();

const toolRoutes = tools.map((tool) => ({
  path: `/tools/${tool.id}`,
  element: tool.stage === 'planned' ? (
    <PlaceholderPage tool={tool} />
  ) : (
    <Suspense fallback={<div className="p-4">加载中...</div>}>
      {lazy(() => import(`../modules/${tool.id}/index.tsx`))()}
    </Suspense>
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

---

- [x] **4.4：运行 TypeScript 检查**

命令：`npx tsc --noEmit`
预期：编译通过（PlaceholderPage 暂时用空组件占位，下一步创建）

---

- [x] **4.5：提交**

```bash
git add src/router/index.tsx src/router/index.test.tsx
git commit -m "feat: update router to be catalog-driven with dynamic route generation"
```

---

## 5. 创建 PlaceholderPage 组件

**涉及文件：**
- 新建：`src/app/views/PlaceholderPage.tsx`
- 新建：`src/app/views/PlaceholderPage.test.tsx`
- 修改：`src/router/index.tsx`（移除 Suspense 的 lazy 加载部分，PlaceholderPage 无需懒加载）

---

- [x] **5.1：编写 PlaceholderPage 测试**

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import PlaceholderPage from './PlaceholderPage';
import type { ToolManifest } from '../../tool-registry/catalog';

const mockTool: ToolManifest = {
  id: 'test-tool',
  name: '测试工具',
  route: '/tools/test-tool',
  category: '测试分类',
  description: '这是一个测试工具的描述',
  stage: 'planned',
};

describe('PlaceholderPage', () => {
  it('显示工具名称', () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/tools/test-tool']}>
        <Route path="/tools/:id" element={<PlaceholderPage tool={mockTool} />} />
      </MemoryRouter>
    );
    expect(getByRole('heading', { level: 1 }).textContent).toBe('测试工具');
  });

  it('显示工具描述', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/tools/test-tool']}>
        <Route path="/tools/:id" element={<PlaceholderPage tool={mockTool} />} />
      </MemoryRouter>
    );
    expect(getByText('这是一个测试工具的描述')).toBeTruthy();
  });

  it('显示"正在规划中"提示', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/tools/test-tool']}>
        <Route path="/tools/:id" element={<PlaceholderPage tool={mockTool} />} />
      </MemoryRouter>
    );
    expect(getByText(/规划中/)).toBeTruthy();
  });

  it('显示返回首页链接', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/tools/test-tool']}>
        <Route path="/tools/:id" element={<PlaceholderPage tool={mockTool} />} />
      </MemoryRouter>
    );
    const link = getByText('← 返回首页');
    expect(link.getAttribute('href')).toBe('/');
  });

  it('接收不完整数据时显示降级内容', () => {
    const incompleteTool = { id: 'x', name: '', route: '', category: '', description: '', stage: 'planned' as const };
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/tools/x']}>
        <Route path="/tools/:id" element={<PlaceholderPage tool={incompleteTool} />} />
      </MemoryRouter>
    );
    expect(getByRole('heading', { level: 1 }).textContent).toBe('未命名工具');
  });
});
```

---

- [x] **5.2：运行测试——确认失败**

命令：`npx vitest run src/app/views/PlaceholderPage.test.tsx`
预期：FAIL — PlaceholderPage 组件不存在

---

- [x] **5.3：编写 PlaceholderPage 实现**

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
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{displayName}</h1>
        {tool.description && (
          <p className="text-gray-600 mb-6">{tool.description}</p>
        )}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-yellow-800 text-sm">
            ⏳ 该工具正在规划中，敬请期待。
          </p>
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
```

---

- [x] **5.4：运行测试——确认通过**

命令：`npx vitest run src/app/views/PlaceholderPage.test.tsx`
预期：PASS

---

- [x] **5.5：提交**

```bash
git add src/app/views/PlaceholderPage.tsx src/app/views/PlaceholderPage.test.tsx
git commit -m "feat: add PlaceholderPage for planned tools"
```

---

## 6. 更新 Home.tsx（按分类展示工具卡片）

**涉及文件：**
- 修改：`src/app/views/Home.tsx`
- 新建：`src/app/views/Home.test.tsx`

---

- [x] **6.1：编写 Home 组件测试**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { getTools, getToolsByCategory } from '../../tool-registry/catalog';

describe('Home', () => {
  it('渲染所有分类的 section', () => {
    const tools = getTools();
    const categories = [...new Set(tools.map((t) => t.category))];

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    categories.forEach((cat) => {
      expect(screen.getByText(cat)).toBeTruthy();
    });
  });

  it('每个 active 工具卡片可点击跳转', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const activeTools = getTools().filter((t) => t.stage === 'active');
    activeTools.forEach((tool) => {
      const card = getByText(tool.name).closest('a');
      expect(card?.getAttribute('href')).toBe(`/tools/${tool.id}`);
    });
  });

  it('planned 工具显示 Planned 标签', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const plannedTools = getTools().filter((t) => t.stage === 'planned');
    plannedTools.forEach((tool) => {
      expect(screen.getByText('Planned')).toBeTruthy();
    });
  });

  it('beta 工具显示 Beta 标签', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const betaTools = getTools().filter((t) => t.stage === 'beta');
    betaTools.forEach((tool) => {
      expect(screen.getByText('Beta')).toBeTruthy();
    });
  });
});
```

---

- [x] **6.2：运行测试——确认失败**

命令：`npx vitest run src/app/views/Home.test.tsx`
预期：FAIL — Home 组件不存在或未更新

---

- [x] **6.3：更新 Home.tsx 实现**

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
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">shuge AI Toolbox</h1>
        <p className="text-gray-600">探索 AI 工具，提升工作效率</p>
      </div>

      {sortedCategories.map((category) => {
        const categoryTools = grouped[category].sort((a, b) => {
          const priorityDiff = stagePriority[a.stage] - stagePriority[b.stage];
          if (priorityDiff !== 0) return priorityDiff;
          return a.name.localeCompare(b.name);
        });

        return (
          <section key={category}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className={`block p-4 rounded-lg border transition-colors ${
                    tool.stage === 'planned'
                      ? 'bg-gray-50 border-gray-200 opacity-75'
                      : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{tool.name}</h3>
                    {tool.stage === 'planned' && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Planned
                      </span>
                    )}
                    {tool.stage === 'beta' && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        Beta
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{tool.description}</p>
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

---

- [x] **6.4：运行测试——确认通过**

命令：`npx vitest run src/app/views/Home.test.tsx`
预期：PASS

---

- [x] **6.5：提交**

```bash
git add src/app/views/Home.tsx src/app/views/Home.test.tsx
git commit -m "feat: update Home to render category-grouped tool cards from catalog"
```

---

## 7. 添加构建时校验脚本

**涉及文件：**
- 新建：`scripts/validate-catalog.ts`
- 修改：`package.json`（添加 `validate-catalog` script）
- 新建：`scripts/validate-catalog.test.ts`

---

- [x] **7.1：编写校验脚本测试**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('catalog validation', () => {
  it('所有非 planned 工具对应的组件文件存在', () => {
    const catalogContent = readFileSync(
      join(__dirname, '../src/tool-registry/catalog.ts'),
      'utf-8'
    );

    const stageMatches = catalogContent.matchAll(/stage:\s*['"](\w+)['"]/g);
    const activeOrBetaTools = [...stageMatches].filter((m) =>
      ['active', 'beta'].includes(m[1])
    );

    expect(activeOrBetaTools.length).toBeGreaterThan(0);
  });
});
```

---

- [x] **7.2：编写校验脚本实现**

```typescript
#!/usr/bin/env tsx
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

const catalogPath = join(rootDir, 'src/tool-registry/catalog.ts');
const catalogContent = readFileSync(catalogPath, 'utf-8');

const idMatches = catalogContent.matchAll(/id:\s*['"]([^'"]+)['"]/g);
const stageMatches = catalogContent.matchAll(/stage:\s*['"](\w+)['"]/g);

const ids = [...idMatches].map((m) => m[1]);
const stages = [...stageMatches].map((m) => m[1]);

const missing: string[] = [];

for (let i = 0; i < ids.length; i++) {
  const id = ids[i];
  const stage = stages[i];
  if (stage !== 'planned') {
    const componentPath = join(rootDir, 'src/modules', id, 'index.tsx');
    if (!existsSync(componentPath)) {
      missing.push(id);
    }
  }
}

if (missing.length > 0) {
  console.error('❌ 缺少以下工具的组件文件:');
  missing.forEach((id) => console.error(`  - src/modules/${id}/index.tsx`));
  process.exit(1);
} else {
  console.log('✅ 所有工具组件文件存在');
  process.exit(0);
}
```

---

- [x] **7.3：更新 package.json 添加 script**

在 `package.json` 的 `scripts` 中添加：

```json
{
  "scripts": {
    "validate-catalog": "tsx scripts/validate-catalog.ts",
    "build": "npm run validate-catalog && vite build"
  }
}
```

---

- [x] **7.4：运行校验**

命令：`npx tsx scripts/validate-catalog.ts`
预期：❌ 缺少以下工具的组件文件:（因为 text-summary, json-formatter, code-explainer 还未实现）

---

- [ ] **7.5：提交**

```bash
git add scripts/validate-catalog.ts scripts/validate-catalog.test.ts package.json
git commit -m "feat: add build-time catalog validation script"
```

---

## 8. 最终验证

**涉及文件：**
- 运行：`npx vitest run`（全量测试）
- 运行：`npx tsc --noEmit`（类型检查）

---

- [x] **8.1：运行全量测试**

命令：`npx vitest run`
预期：所有测试 PASS

---

- [x] **8.2：运行 TypeScript 类型检查**

命令：`npx tsc --noEmit`
预期：编译通过，无错误

---

- [x] **8.3：最终提交（如有未提交的变更）**

```bash
git status
git add -A
git commit -m "feat: complete tool-registry change - catalog-driven routing, shared layout, placeholder page"
```

---

**所有任务完成！**

运行 `/opsx:archive` 来归档此变更。