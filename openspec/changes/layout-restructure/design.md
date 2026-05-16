## Context

首页 `home-page/` 当前以分类平铺展示所有工具卡片，无筛选机制。`catalog.ts` 定义了 4 个分类（文本处理、数据转换、开发工具、内容创作）和 5 个工具，属于静态数据。

## Goals / Non-Goals

**Goals:**
- 在首页内容区顶部新增分类 Tab 导航栏
- 点击 Tab 过滤显示对应分类的工具卡片，切换时滚动到顶部
- 「全部」Tab 显示全量，其他 Tab 显示单分类

**Non-Goals:**
- 不修改 TopNav（保持全局导航职责不变）
- 不引入独立 URL（分类筛选是临时状态）
- 不支持多级分类筛选（单级筛选足够近期使用）
- 不吸顶（内容一屏可看完，无需 sticky）

## Decisions

### 1. Tab 栏实现方式

**方案**：使用 `useState` 管理 `activeTab` 状态，Tab 切换时更新状态并过滤 `getTools()` 返回的数组。

```tsx
// 状态
const [activeTab, setActiveTab] = useState<'all' | string>('all');

// 过滤逻辑
const displayedTools = activeTab === 'all'
  ? tools
  : tools.filter(t => t.category === activeTab);
```

**为什么不用**：
- URL 参数：切换 Tab 无需刷新，URL 作为临时状态冗余
- Zustand：状态简单，useState 足够，无需引入全局 store
- 滚动定位方案 B：内容少，无需滚动定位

### 2. 滚动重置

Tab 切换后调用 `window.scrollTo({ top: 0, behavior: 'smooth' })`（smooth 带来更好体验）。

### 3. Tab 栏样式

- 横向滚动 Flexbox 布局，支持分类数量扩展
- 活跃 Tab：Tailwind 下划线或背景色高亮
- 非活跃 Tab：纯文字，点击切换

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 分类数量从 4 扩展到 10+ 时 Tab 栏溢出 | 设计已考虑扩展，Flexbox 横向滚动处理边界情况 |
| 未来需要多级筛选 | 预留 `subcategory` 字段扩展，UI 可叠加二级 Tab |