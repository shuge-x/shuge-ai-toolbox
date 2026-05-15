## Context

当前 UI 使用 Tailwind 默认样式，缺乏统一的品牌视觉。组件间样式不一致，颜色、字体、间距无设计基准。同时存在两个 bug 需要修复：toolRoutes 路由未包裹 Layout、index.html 语言和标题错误。

技术约束：React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7。

## Goals / Non-Goals

**Goals:**
- 建立 CSS 变量基础的设计系统，覆盖颜色、字体、spacing
- 基于设计系统重设计 4 个页面组件（TopNav、Home、PlaceholderPage、NotFound）
- 修复 router bug（toolRoutes 包裹 Layout）
- 修复 index.html（lang 和 title）

**Non-Goals:**
- 暗色模式
- 图标系统
- 移动端响应式
- 修改 catalog.ts

## Decisions

### 1. 设计令牌使用 CSS 变量而非 Tailwind 扩展

**选择**：在 `src/theme/tokens.css` 中定义 CSS 变量，组件通过 Tailwind 的 arbitrary value 或 CSS 类使用。

**理由**：CSS 变量更直观、易于调试、便于后续扩展暗色模式。Tailwind 4 对自定义变量的支持良好。

### 2. 颜色方案：蓝色主色 + 琥珀色强调

**选择**：主色 `--color-primary-500: #3B82F6`（蓝色），强调色 `--color-accent-500: #F59E0B`（琥珀色），背景使用冷灰 `--color-neutral-50: #F8FAFC`。

**理由**：蓝色传达专业、科技感；琥珀色作为强调色有足够辨识度，与蓝色形成暖冷对比。

### 3. 字体使用系统字体栈

**选择**：font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif。

**理由**：无需额外字体加载，性能最优。本期不需要品牌定制字体。

### 4. 修复 router bug：toolRoutes 每个路由包裹 Layout

**选择**：修改 `createBrowserRouter` 的路由结构，为 toolRoutes 中的每个路由添加 Layout 包裹。

**理由**：当前 toolRoutes 直接返回 JSX 未包裹 Layout，导致工具页缺少 TopNav。最简修复是在路由定义时包裹 Layout。

### 5. 修复 index.html

**选择**：`lang="zh-CN"`, `title="shuge AI Toolbox"`。

**理由**：内容是中文，lang 应反映语言；title 应是有意义的品牌名而非项目目录名。

## Risks / Trade-offs

- **风险**：设计系统初期可能需要迭代 → **缓解**：本期仅覆盖基础变量，后续按需扩展
- **风险**：修改路由结构可能引入回归 → **缓解**：已有测试覆盖，修复后运行测试验证
- **权衡**：使用 CSS 变量意味着组件样式更依赖约定而非 Tailwind 原子类 → 可接受，因为设计系统本身即约定