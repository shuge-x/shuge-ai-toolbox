## ADDED Requirements

### Requirement: Layout 组件结构

`Layout` 组件提供共享的导航结构，包含 TopNav 和内容渲染区。

#### Scenario: Layout 提供 TopNav
- **WHEN** `Layout` 组件渲染
- **THEN** 顶部显示 `TopNav` 组件，包含：
  1. 应用 Logo/名称（左侧）
  2. 导航链接（右侧）：至少包含"首页"链接
  3. 固定在页面顶部

#### Scenario: Layout 提供内容插槽
- **WHEN** `Layout` 组件渲染
- **THEN** 使用 React Router 的 `<Outlet />` 渲染子路由内容
- **AND** 内容区域位于 TopNav 下方

#### Scenario: Layout 样式
- **WHEN** `Layout` 组件渲染
- **THEN** TopNav 使用固定高度，背景色与页面形成区分
- **AND** 内容区域占据剩余视口高度
- **AND** 响应式设计：移动端 TopNav 折叠或简化

---

### Requirement: TopNav 导航项

TopNav 必须提供核心导航功能。

#### Scenario: 首页链接
- **WHEN** TopNav 渲染
- **THEN** 显示"首页"链接，点击后导航到 `/`

#### Scenario: Logo/品牌标识
- **WHEN** TopNav 渲染
- **THEN** 左侧显示应用名称或 Logo
- **AND** 点击 Logo 导航到 `/`

#### Scenario: 活跃链接高亮
- **WHEN** 用户当前在 `/` 路径
- **THEN** TopNav 的"首页"链接使用高亮样式（例如：加粗、下划线、不同的颜色）

#### Scenario: TopNav 在所有页面可见
- **WHEN** 用户导航到任何工具页面（`/tools/:id`）
- **THEN** TopNav 始终可见，不随页面内容滚动消失
- **AND** 用户可以从任何工具页面通过 TopNav 返回首页

---

### Requirement: Layout 作为路由 wrapper

`Layout` 通过 React Router 的 layout route 模式应用到所有路由。

#### Scenario: Layout 包裹所有路由
- **WHEN** `router/index.tsx` 定义路由
- **THEN** Layout 作为父路由的 element，所有子路由通过 `<Outlet />` 渲染
- **AND** `/` 路径和 `/tools/:id` 路径都在 Layout 内部

#### Scenario: Layout 路由结构
```
/         → Layout → Home
/tools/:id → Layout → ToolComponent | PlaceholderPage
*         → Layout → NotFound（可选：考虑 404 是否需要 nav）
```

#### Scenario: NotFound 页面与 Layout
- **WHEN** 用户访问不存在的路径
- **THEN** 渲染 `<NotFound />`
- **AND** `<NotFound />` 也包裹在 Layout 中（用户可以从 404 页面导航回首页）

---

### Requirement: TopNav 组件可测试性

TopNav 作为独立组件必须易于单元测试。

#### Scenario: 导航链接可测试
- **WHEN** 对 TopNav 进行单元测试
- **THEN** 可以断言特定链接的文本和 href 值
- **AND** 可以模拟点击并验证导航行为

#### Scenario: Logo 可测试
- **WHEN** 对 TopNav 进行单元测试
- **THEN** 可以断言 Logo 的文本或图片元素存在
- **AND** 可以验证点击 Logo 后的导航目标

---

### Requirement: 响应式布局

Layout 和 TopNav 必须支持不同屏幕尺寸。

#### Scenario: 桌面端 TopNav
- **WHEN** 视口宽度 >= 768px
- **THEN** TopNav 显示完整导航项（Logo 左，链接右，水平排列）

#### Scenario: 移动端 TopNav
- **WHEN** 视口宽度 < 768px
- **THEN** TopNav 可以简化为：Logo 左侧，汉堡菜单右侧
- **AND** 导航链接收纳在菜单中（可选：一期可以简化为直接显示）

#### Scenario: 内容区域响应式
- **WHEN** 视口宽度变化
- **THEN** 内容区域保持可读的内边距
- **AND** 工具组件的布局适应可用宽度

---

### Requirement: Layout 组件导出

`Layout` 和 `TopNav` 必须作为可复用的导出组件。

#### Scenario: 组件导出
- **WHEN** 其他模块导入 Layout 或 TopNav
- **THEN** 可以通过 `import Layout from '@/layout/Layout'` 获取
- **AND** 可以通过 `import TopNav from '@/layout/TopNav'` 获取
- **AND** 两个组件都支持独立测试