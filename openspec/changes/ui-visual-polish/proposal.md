## Why

当前页面处于"脚手架"状态——CSS 变量体系已搭好但未充分使用，配色是 Tailwind 默认蓝，缺乏辨识度和品牌感，没有图标系统，卡片和导航样式单调。从脚手架到产品需要全面升级视觉层。

## What Changes

- **配色升级**：以蓝紫（Blue-Violet）替换默认蓝，建立完整 50→700 梯度；琥珀色保持用于功能区分（Beta badge）
- **图标系统**：引入 `lucide-react`，为 4 个 category 各配专属图标；Badge 级别改用 Lucide 小图标替代 emoji
- **动效增强**：卡片 hover 抬升效果（scale + shadow）；Stagger 入场动画（100ms/张卡片）；Tab 切换滑动指示器
- **Header 升级**：左侧添加 icon/logo mark，背景加微渐变提升层次

## Capabilities

### New Capabilities

- `visual-identity`: 建立品牌色、图标、动效的整体视觉体系定义

### Modified Capabilities

- （无 spec 层面变更，纯视觉实现）

## Impact

- `src/theme/tokens.css` — 重建 primary 色板为蓝紫系
- `src/index.css` — 新增 keyframes
- `src/app/views/Home.tsx` — Lucide icons + badge + stagger
- `src/app/views/NotFound.tsx` — 配色调整
- `src/app/views/PlaceholderPage.tsx` — emoji→Lucide icon
- `package.json` — 新增 lucide-react 依赖