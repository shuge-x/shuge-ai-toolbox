## ADDED Requirements

### Requirement: ToolManifest 结构

catalog.ts 必须导出一个 `ToolManifest` 接口，包含以下字段：

- `id: string` — 工具唯一标识符，用于路由和模块目录名
- `name: string` — 工具显示名称
- `route: string` — 工具的基础路径（当前实现中与 id 相同，但作为独立字段保留）
- `category: string` — 工具所属分类，用于首页分组
- `description: string` — 工具的简短描述
- `stage: "active" | "beta" | "planned"` — 工具生命周期阶段

#### Scenario: 获取全部工具列表
- **WHEN** 调用 `getTools()`
- **THEN** 返回 `ToolManifest[]`，包含所有注册的工具，按 category 分组前的原始顺序

#### Scenario: 按 ID 查询工具
- **WHEN** 调用 `getToolById(id)` 并传入已注册的 tool.id
- **THEN** 返回对应的 `ToolManifest` 对象
- **WHEN** 传入不存在的 id
- **THEN** 返回 `undefined`

#### Scenario: 按分类筛选工具
- **WHEN** 调用 `getToolsByCategory(category)` 并传入已存在的 category
- **THEN** 返回该分类下的所有 `ToolManifest[]`，按 stage 排序（active > beta > planned）

#### Scenario: 工具 ID 唯一性
- **WHEN** 遍历 `getTools()` 中的所有工具
- **THEN** 不存在两个工具拥有相同的 `id` 值

#### Scenario: stage 字段有效性
- **WHEN** 遍历 `getTools()` 中的所有工具
- **THEN** 每个工具的 `stage` 字段必须是 `"active"` | `"beta"` | `"planned"` 之一

#### Scenario: 异常分类查询
- **WHEN** 调用 `getToolsByCategory("不存在的分类")`
- **THEN** 返回空数组 `[]`

---

### Requirement: 路由驱动

router/index.tsx 必须从 `catalog.ts` 导入 `getTools()` 并在模块初始化时生成路由表。

#### Scenario: 动态路由生成
- **WHEN** `getTools()` 返回包含 N 个工具的数组
- **THEN** 路由表包含 N 条 `/tools/:id` 路由
- **AND** 每条路由映射到正确的组件（active/beta → 工具组件，planned → PlaceholderPage）

#### Scenario: planned 工具路由到占位页
- **WHEN** 用户访问 `/tools/某个-planned-tool-id`
- **THEN** 渲染 `<PlaceholderPage tool={toolManifest} />`
- **AND** URL 保持为 `/tools/某个-planned-tool-id`（不是重定向）

#### Scenario: active 工具路由到实际组件
- **WHEN** 用户访问 `/tools/某个-active-tool-id`
- **THEN** 使用 `React.lazy()` 动态加载 `../modules/某个-active-tool-id/index.tsx`
- **AND** 渲染加载的组件

#### Scenario: 路由优先级
- **WHEN** 用户访问 `/`
- **THEN** 渲染 `<Home />`（保留为首页）
- **AND** 不匹配任何 `/tools/:id` 的路径渲染 `<NotFound />`

#### Scenario: 缺失组件文件处理
- **WHEN** catalog 中注册了一个 `stage` 为 `"active"` 的工具，但 `modules/<id>/index.tsx` 文件不存在
- **THEN** 构建时抛出有意义的错误，指明缺少哪个工具的组件文件

---

### Requirement: 首页分类展示

Home 组件读取 `getTools()` 并按 category 分组展示工具卡片。

#### Scenario: 工具按 category 分组
- **WHEN** Home 组件挂载
- **THEN** 从 `getTools()` 获取所有工具
- **AND** 按 `category` 字段分组
- **AND** 每个分组渲染一个 section，标题为 category 名称

#### Scenario: 卡片内展示工具信息
- **WHEN** 渲染一个工具卡片
- **THEN** 显示 `name`、`description`
- **AND** 显示 `stage` 对应的视觉标识（active 无标记，beta 显示 "Beta" 标签，planned 显示 "Planned" 标签）

#### Scenario: 排序规则
- **WHEN** 渲染某分类下的工具列表
- **THEN** stage 优先级为 active > beta > planned
- **AND** 同 stage 内按 `name` 字母序排列

#### Scenario: 点击工具卡片
- **WHEN** 用户点击某工具卡片
- **THEN** 导航到 `/tools/<tool.id>`

---

### Requirement: 目录结构约定

每个工具组件必须遵循以下目录和文件约定。

#### Scenario: 工具模块目录
- **WHEN** 创建一个 id 为 `some-tool` 的工具
- **THEN** 在 `src/modules/some-tool/` 目录下创建 `index.tsx` 作为入口组件
- **AND** 该组件必须使用默认导出

#### Scenario: planned 工具不需要组件文件
- **WHEN** 一个工具的 `stage` 为 `"planned"`
- **THEN** 不需要在 `modules/` 下创建对应目录
- **AND** 路由系统直接使用 PlaceholderPage 处理该路径

#### Scenario: 组件懒加载
- **WHEN** 路由系统加载一个 `stage` 为 `"active"` 或 `"beta"` 的工具页面
- **THEN** 使用 `React.lazy()` + `Suspense` 进行代码分割
- **AND** 加载期间显示 loading 状态

---

### Requirement: 构建时校验

catalog 和文件系统之间的同步在构建时验证。

#### Scenario: 所有 active/beta 工具都有组件文件
- **WHEN** 执行构建命令（`npm run build`）
- **THEN** 对每个 `stage !== "planned"` 的工具，验证 `src/modules/<tool.id>/index.tsx` 存在
- **AND** 若文件缺失，构建失败并输出具体缺失的工具 id 列表

#### Scenario: catalog 非空
- **WHEN** 工具注册中心正常工作
- **THEN** `getTools()` 至少返回一个工具（即使是 planned）