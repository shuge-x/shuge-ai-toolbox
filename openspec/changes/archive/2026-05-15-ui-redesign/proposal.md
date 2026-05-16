## Why

当前 UI 缺乏统一的设计系统，样式分散、缺少品牌辨识度。同时存在两个遗留 bug：工具页路由未包裹 Layout 导致缺少导航栏、index.html 语言和标题不正确。本期建立设计系统基础，为后续迭代铺路。

## What Changes

- **新增 `@theme` 设计系统**：定义品牌色板、字体、spacing 变量，统一样式基准
- **重设计四个页面组件**：TopNav、Home、PlaceholderPage、NotFound，基于新设计系统
- **修复 router/index.tsx bug**：`toolRoutes` 未包裹 Layout，导致 `/tools/*` 路径无 TopNav
- **修复 index.html**：`lang` 改为 `zh-CN`，`title` 改为有意义的值

不本期范围：暗色模式、图标系统、移动端响应式、catalog.ts 修改。

## Capabilities

### New Capabilities

- `design-tokens`：设计令牌，包含颜色、字体、spacing 的 CSS 变量定义
- `page-home`：首页布局与视觉重设计
- `page-placeholder`：占位页视觉重设计
- `page-not-found`：404 页面视觉重设计
- `component-top-nav`：顶部导航栏视觉重设计

### Modified Capabilities

<!-- 现有能力的需求变更：无 -->

## Impact

- **新增**：`src/theme/` 目录（设计令牌）
- **修改**：`src/layout/TopNav.tsx`、`src/app/views/Home.tsx`、`src/app/views/PlaceholderPage.tsx`、`src/app/views/NotFound.tsx`、`src/router/index.tsx`、`index.html`
- **依赖**：Tailwind CSS 4（已有）、React 19（已有）