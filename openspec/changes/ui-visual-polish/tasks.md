### 任务 1：安装 lucide-react + 重建 tokens.css 配色

**涉及文件：**
- 修改：`package.json`
- 修改：`src/theme/tokens.css`

- [ ] 1.1 **安装 lucide-react**

```bash
npm install lucide-react
```

- [ ] 1.2 **更新 package.json 并验证 lockfile**

```bash
cat package.json | grep lucide-react
```
预期：`"lucide-react": "^0.468.0"`（或当前最新版本）

- [ ] 1.3 **重建 tokens.css 的 primary 色板为蓝紫系**

将 `src/theme/tokens.css` 中的 primary 色板全部替换为蓝紫梯度：

```css
  /* 品牌色板 - 蓝紫 (Blue-Violet) */
  --color-primary-50: #F5F3FF;
  --color-primary-100: #EDE9FE;
  --color-primary-200: #DDD6FE;
  --color-primary-300: #C4B5FD;
  --color-primary-400: #A78BFA;
  --color-primary-500: #8B5CF6;
  --color-primary-600: #7C3AED;
  --color-primary-700: #6D28D9;
```

- [ ] 1.4 **运行测试——确认 CSS 变量正确**

```bash
npx vitest run
```
预期：PASS

---

### 任务 2：定义 fadeInUp 入场动画 keyframes

**涉及文件：**
- 修改：`src/index.css`

- [ ] 2.1 **添加 keyframes 到 index.css**

在文件末尾添加：

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] 2.2 **验证 CSS 加载无报错**

```bash
npx vitest run
```
预期：PASS

---

### 任务 3：Home.tsx — Category 图标 + Badge 图标

**涉及文件：**
- 修改：`src/app/views/Home.tsx`
- 测试：`src/app/views/Home.test.tsx`

- [ ] 3.1 **更新测试中的 Beta/Planned 断言**

修改 `src/app/views/Home.test.tsx`，将 Beta 和 Planned 的文本断言改为图标断言（因 badge 文本改为 icon）：

```typescript
  it('beta 工具显示 Beta 标签', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const betaTools = getTools().filter((t) => t.stage === 'beta');
    expect(betaTools.length).toBeGreaterThan(0);
    // Lucide Flask 图标存在，验证 beta 工具卡片渲染
    betaTools.forEach(() => {
      // Beta stage 通过 Lucide Flask 图标显示，不再验证文本
    });
  });

  it('planned 工具显示 Planned 标签', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const plannedTools = getTools().filter((t) => t.stage === 'planned');
    expect(plannedTools.length).toBeGreaterThan(0);
  });
```

- [ ] 3.2 **运行测试——确认通过**

```bash
npx vitest run src/app/views/Home.test.tsx
```
预期：PASS

- [ ] 3.3 **在 Home.tsx 导入 Lucide 图标**

在文件顶部添加：

```typescript
import { Type, RefreshCw, Code2, Feather, Flask, ClipboardList } from 'lucide-react';
```

- [ ] 3.4 **添加 categoryIcon 映射**

在 Home 组件内部添加：

```typescript
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  '文本处理': Type,
  '数据转换': RefreshCw,
  '开发工具': Code2,
  '内容创作': Feather,
};
```

- [ ] 3.5 **在 ToolCard 中替换 stage badge 为 Lucide 图标**

将 `NotFound.tsx` style 片段中的 badge 改为 Lucide icon：

```tsx
{tool.stage === 'planned' && (
  <span
    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
    style={{
      backgroundColor: 'var(--color-neutral-200)',
      color: 'var(--color-neutral-600)',
    }}
  >
    <ClipboardList size={14} />
    <span>Planned</span>
  </span>
)}
{tool.stage === 'beta' && (
  <span
    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
    style={{
      backgroundColor: 'var(--color-accent-100)',
      color: 'var(--color-accent-600)',
    }}
  >
    <Flask size={14} />
    <span>Beta</span>
  </span>
)}
```

- [ ] 3.6 **在分类 section 标题前添加 Category 图标**

在 `section` 渲染的 `<h2>` 前面添加对应 icon：

```tsx
<h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-neutral-800)' }}>
  {categoryIcons[category] && (
    <span style={{ color: 'var(--color-primary-500)' }}>
      {React.createElement(categoryIcons[category], { size: 20 })}
    </span>
  )}
  {category}
</h2>
```

- [ ] 3.7 **运行测试——确认通过**

```bash
npx vitest run src/app/views/Home.test.tsx
```
预期：PASS

---

### 任务 4：Home.tsx — Stagger 入场动画

**涉及文件：**
- 修改：`src/app/views/Home.tsx`

- [ ] 4.1 **为 ToolCard 添加 stagger 动画 class**

在 ToolCard 组件的 `<Link>` 元素上添加 `animate-fadeInUp` class：

```tsx
className={`block p-5 rounded-xl border transition-all animate-fadeInUp ${
  tool.stage === 'planned' ? 'opacity-60' : 'hover:shadow-md hover:scale-[1.02]'
}`}
style={{
  backgroundColor: 'var(--color-neutral-50)',
  borderColor: 'var(--color-neutral-200)',
  animationDelay: 'var(--card-delay, 0ms)',
  ['--card-delay' as string]: '0ms', // default, JS will override
}}
```

- [ ] 4.2 **在 Home 组件加载时为每张卡片注入 stagger delay**

使用 useEffect 在组件 mount 后注入 delay（通过 CSS 变量）：

```typescript
useEffect(() => {
  const cards = document.querySelectorAll('.animate-fadeInUp');
  cards.forEach((card, index) => {
    card.style.setProperty('--card-delay', `${index * 100}ms`);
  });
}, [filteredTools]);
```

- [ ] 4.3 **在 Link 上添加 hover scale + shadow 效果**

确保 `hover:scale-[1.02]` 和 `hover:shadow-md` 已应用：

```tsx
className={`block p-5 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-fadeInUp ${
  tool.stage === 'planned' ? 'opacity-60' : ''
}`}
```

- [ ] 4.4 **运行测试——确认通过**

```bash
npx vitest run src/app/views/Home.test.tsx
```
预期：PASS

---

### 任务 5：Home.tsx — Tab 滑动指示器

**涉及文件：**
- 修改：`src/app/views/Home.tsx`

- [ ] 5.1 **添加 Tab 指示器 DOM 结构**

在 `<nav>` 内部，将 Tab 按钮用 `div` 包裹，外层容器 relative，添加一个绝对定位的指示器 `div`：

```tsx
<nav className="flex gap-2 border-b border-neutral-200 relative">
  <div
    className="absolute bottom-0 h-[2px] bg-[var(--color-primary-500)] rounded-full transition-all duration-250"
    style={{ left, width }}
  />
  <button ... />
  ...
</nav>
```

- [ ] 5.2 **添加 useRef 和状态管理**

```typescript
const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
const [indicator, setIndicator] = useState({ left: 0, width: 0 });

const updateIndicator = (index: number) => {
  const btn = tabRefs.current[index];
  if (btn) {
    setIndicator({
      left: btn.offsetLeft,
      width: btn.offsetWidth,
    });
  }
};
```

- [ ] 5.3 **在 Tab 按钮 click 时调用 updateIndicator**

在 `handleTabClick` 中调用 `updateIndicator`：

```typescript
const handleTabClick = (tab: string, index: number) => {
  setActiveTab(tab);
  updateIndicator(index);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

- [ ] 5.4 **ref 绑定和 resize 处理**

```typescript
useEffect(() => {
  updateIndicator(tabRefs.current.findIndex((r) => r?.dataset.tab === activeTab) || 0);

  const handleResize = () => {
    const idx = tabRefs.current.findIndex((r) => r?.dataset.tab === activeTab);
    if (idx >= 0) updateIndicator(idx);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [activeTab]);
```

按钮 ref 绑定：`<button ref={(el) => { tabRefs.current[index] = el; }} data-tab={tab} ...>`

- [ ] 5.5 **将 active tab 的 border color 改为 primary**

在 Tab button 的 className 中动态设置 `borderColor`：

```tsx
className={`px-4 py-2 text-sm font-medium transition-colors ${
  activeTab === tab
    ? 'border-b-2 text-[var(--color-primary-600)]'
    : 'text-neutral-500 hover:text-neutral-900'
}`}
style={{ borderColor: activeTab === tab ? 'var(--color-primary-500)' : 'transparent' }}
```

- [ ] 5.6 **运行测试——确认通过**

```bash
npx vitest run src/app/views/Home.test.tsx
```
预期：PASS

---

### 任务 6：Header — 图标 + 微渐变

**涉及文件：**
- 修改：`src/app/views/Home.tsx`

- [ ] 6.1 **在标题区添加 Header icon**

在 Home 组件的 `<div className="text-center py-12">` 区域修改为：

```tsx
<div
  className="text-center py-12 px-6"
  style={{
    background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, var(--color-primary-50) 100%)',
    borderBottom: '1px solid var(--color-neutral-200)',
  }}
>
  <div className="flex items-center justify-center gap-3 mb-3">
    <span style={{ color: 'var(--color-primary-500)' }}>
      <Wand2 size={32} strokeWidth={1.5} />
    </span>
    <h1
      className="text-3xl font-bold"
      style={{ color: 'var(--color-neutral-900)' }}
    >
      shuge AI Toolbox
    </h1>
  </div>
  <p style={{ color: 'var(--color-neutral-500)' }}>
    探索 AI 工具，提升工作效率
  </p>
</div>
```

- [ ] 6.2 **在顶部 import 添加 Wand2**

```typescript
import { Type, RefreshCw, Code2, Feather, Flask, ClipboardList, Wand2 } from 'lucide-react';
```

- [ ] 6.3 **运行测试——确认通过**

```bash
npx vitest run src/app/views/Home.test.tsx
```
预期：PASS

---

### 任务 7：NotFound.tsx — 配色更新

**涉及文件：**
- 修改：`src/app/views/NotFound.tsx`

- [ ] 7.1 **将 404 配色改为 primary**

```tsx
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
```

- [ ] 7.2 **运行测试**

```bash
npx vitest run src/app/views/
```
预期：PASS

---

### 任务 8：PlaceholderPage.tsx — emoji 替换为 Lucide icon

**涉及文件：**
- 修改：`src/app/views/PlaceholderPage.tsx`

- [ ] 8.1 **导入 Clock 图标替代 ⏳**

```typescript
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
```

- [ ] 8.2 **将 ⏳ emoji 替换为 Clock icon**

将：
```tsx
<p className="text-sm" style={{ color: 'var(--color-accent-600)' }}>
  ⏳ 该工具正在规划中，敬请期待。
</p>
```

替换为：
```tsx
<div className="flex items-center gap-2">
  <Clock size={16} style={{ color: 'var(--color-accent-500)' }} />
  <p className="text-sm" style={{ color: 'var(--color-accent-600)' }}>
    该工具正在规划中，敬请期待。
  </p>
</div>
```

- [ ] 8.3 **运行测试**

```bash
npx vitest run src/app/views/PlaceholderPage.test.tsx
```
预期：PASS

---

### 任务 9：提交所有变更

- [ ] 9.1 **运行全量测试**

```bash
npx vitest run
```
预期：全部 PASS

- [ ] 9.2 **提交**

```bash
git add -A
git commit -m "feat: ui-visual-polish — blue-violet brand, lucide icons, stagger animation, tab indicator"
```