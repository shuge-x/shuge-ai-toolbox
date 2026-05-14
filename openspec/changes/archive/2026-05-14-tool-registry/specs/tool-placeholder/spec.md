## ADDED Requirements

### Requirement: 占位页渲染

当用户访问 `stage` 为 `"planned"` 的工具路径时，系统渲染 `PlaceholderPage` 组件。

#### Scenario: 占位页接收工具数据
- **WHEN** 用户访问 `/tools/<planned-tool-id>`
- **THEN** `PlaceholderPage` 通过路由参数或 context 获取对应 `ToolManifest`
- **AND** 显示工具的 `name` 作为页面标题（h1）
- **AND** 显示工具的 `description` 作为说明文字

#### Scenario: 占位页显示规划中提示
- **WHEN** `PlaceholderPage` 渲染
- **THEN** 显示一个明确的视觉提示，说明"该工具正在规划中"
- **AND** 该提示使用与 active/beta 页面不同的视觉样式（例如：灰色调、图标提示）

#### Scenario: 返回首页链接
- **WHEN** `PlaceholderPage` 渲染
- **THEN** 提供一个"← 返回首页"的链接或按钮
- **AND** 点击该链接导航到 `/`

#### Scenario: 占位页保持 URL 不变
- **WHEN** 用户在占位页
- **THEN** 浏览器 URL 仍然显示 `/tools/<planned-tool-id>`
- **AND** 不是重定向到其他路径

---

### Requirement: 视觉区分度

planned 工具的卡片和页面在视觉上与 active/beta 工具有明确区分。

#### Scenario: 首页卡片 planned 状态样式
- **WHEN** 首页渲染一个 `stage === "planned"` 的工具卡片
- **THEN** 该卡片使用较淡的背景色或边框样式，表示"未激活"状态
- **AND** 显示 "Planned" 标签，区别于 "Beta" 标签

#### Scenario: Beta 标签样式
- **WHEN** 首页渲染一个 `stage === "beta"` 的工具卡片
- **THEN** 显示 "Beta" 标签，使用与 "Planned" 不同的颜色（例如：黄色/橙色 vs 灰色）

#### Scenario: 点击 planned 工具卡片后
- **WHEN** 用户点击一个 `stage === "planned"` 的工具卡片
- **THEN** 导航到占位页
- **AND** 不尝试加载不存在的组件文件

---

### Requirement: 占位页内容完整性

占位页必须提供足够的上下文，让用户理解工具的状态。

#### Scenario: 占位页最小内容
- **WHEN** `PlaceholderPage` 渲染
- **THEN** 必须显示以下信息：
  1. 工具名称（页面标题）
  2. 工具描述
  3. "该工具正在规划中" 的明确说明
  4. 返回首页的导航方式

#### Scenario: 占位页异常数据处理
- **WHEN** `PlaceholderPage` 接收到的 `ToolManifest` 数据不完整（缺少 name 或 description）
- **THEN** 显示合理的降级内容，例如显示 "未命名工具" 或使用 id 作为后备名称
- **AND** 不抛出错误

---

### Requirement: PlaceholderPage 组件导出

`PlaceholderPage` 必须作为可复用的导出组件。

#### Scenario: 组件导出
- **WHEN** 其他模块导入 `PlaceholderPage`
- **THEN** 可以通过 `import PlaceholderPage from '@/app/views/PlaceholderPage'` 或类似路径获取
- **AND** 支持作为路由组件直接使用