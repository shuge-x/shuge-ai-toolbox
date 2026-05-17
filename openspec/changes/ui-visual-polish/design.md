## Context

**现状**：CSS 变量体系（tokens.css）已定义完整色板但未充分使用；配色是 Tailwind 默认蓝；无图标系统；卡片和 Tab 样式单调，缺乏品牌感和产品感。

**约束**：
- 技术栈：React 19 + TypeScript + Vite + Tailwind CSS 4
- light theme 基调不变
- 动效不引入过度复杂性，不做 page transition
- 测试命令：`npx vitest run`

## Goals / Non-Goals

**Goals:**
- 建立有辨识度的蓝紫品牌色体系
- 引入 lucide-react 统一图标语言
- 卡片 hover 反馈清晰，入场动画有产品感
- Tab 指示器滑动流畅
- Header 有品牌感但不喧宾夺主

**Non-Goals:**
- 不改变整体布局结构
- 不引入深色主题
- 不做 page transition / loading skeleton
- 不建立自定义图标库（直接使用 Lucide 组件）

## Decisions

### 1. 品牌色值 — 为什么选蓝紫而非纯蓝/纯紫

| 方案 | 优点 | 缺点 |
|------|------|------|
| 纯蓝 (Tailwind default) | 无学习成本 | 无辨识度 |
| 蓝紫 (Blue-Violet) | AI 领域常用色，有科技感但不过于猎奇 | 需要重建完整梯度 |
| 纯紫 | 更有品牌感 | 偏"女性化/时尚"感，与工具属性偏差 |

**决定**：蓝紫。以 #8B5CF6 为 center 建立 50→700 梯度，完全替代现有 primary 色板。理由：AI Toolbox 面向 productivity 用户，蓝紫比纯紫更沉稳，比纯蓝更有记忆点。

### 2. Lucide vs Heroicons

| 方案 | 优点 | 缺点 |
|------|------|------|
| Heroicons | Tailwind 官方配套 | 图标数量少，定制粒度粗 |
| Lucide | 图标丰富（2000+），风格统一，可按需 tree-shake | 需要额外安装依赖 |

**决定**：Lucide。Category 图标分配（Type/RefreshCw/Code2/Feather）在提案阶段已获确认。

### 3. Stagger 动画实现方式

| 方案 | 优点 | 缺点 |
|------|------|------|
| CSS animation-delay 线性 | 简单，逐卡设置 delay | 每张卡片的 delay 值需硬编码 |
| CSS animation + nth-child | 通过 calc() 自动计算 | 写法略复杂 |
| JS 控制 (IntersectionObserver) | 可做滚动入场 | 过度工程化 |

**决定**：CSS animation + nth-child，delay = `(index - 1) * 100ms`。通过 CSS 变量注入 index，animate-delay 由 CSS 自动计算。

### 4. Tab 滑动指示器实现

| 方案 | 优点 | 缺点 |
|------|------|------|
| 纯 CSS (::after + flex) | 无 JS 依赖 | 动态 left/width 需 JS 计算 |
| CSS scroll-snap | 移动端友好 | 桌面端精确控制较弱 |
| JS 控制 absolute + transform | 精确控制 | 需要 onResize 监听 |

**决定**：JS 控制 left/width + CSS transition。使用 ref 获取每个 tab 的 offsetLeft/offsetWidth，更新时通过 CSS transition 过渡。resize 时重新计算。

### 5. 背景渐变参数

```
background: linear-gradient(135deg, var(--color-neutral-50) 0%, var(--color-primary-50) 100%)
```

135deg = 左上到右下的对角线方向，与 Vercel 的 hero gradient 相似但更 subtle。neutral-50 (#F8FAFC) 作为底色起点，primary-50 (#F5F3FF) 提供品牌色 tint。

## Risks / Trade-offs

- **[风险]** lucide-react 版本升级可能带来图标组件 API 变化 → **缓解**：锁定 minor 版本，每次依赖更新检查图标可用性
- **[权衡]** 蓝紫色对红绿色盲用户辨识度差于蓝橙 → **决策**：可接受，目标是品牌差异化而非色盲友好最优
- **[风险]** CSS animation stagger 在卡片数量多时可能影响 TBT → **缓解**：动画使用 `will-change: transform, opacity`，确保 GPU 加速
- **[权衡]** Tab 指示器 JS 控制在 SSR 场景需要注意 hydration → **缓解**：本项目是纯 CSR，无此问题

## 待定问题

- Badge icon 的 size 还没有精确数值（18px 还是 16px？）
  → 实现时根据视觉比例决定，建议 14-16px
- Wand2 vs Toolbox 作为 header icon 哪个更贴 AI Toolbox？
  → 用户确认时可选一个，实现阶段可灵活选择