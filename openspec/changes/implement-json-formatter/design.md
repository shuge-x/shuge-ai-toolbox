## Context

json-formatter 是工具箱的第二个 active 工具，catalog.ts 已注册为 active，路由已存在。实现目标是复用 text-summary 的组件模式，保持工具页面之间的一致性。

技术约束：纯前端实现，不依赖外部 API，数据全在客户端处理。

## Goals / Non-Goals

**Goals:**
- 提供 JSON 格式化、压缩、语法校验三大功能
- 复用 text-summary 的组件结构和代码模式
- 组件结构清晰，可作为后续工具页面的参考模板
- 遵循项目已有的 UI 模式和组件风格

**Non-Goals:**
- 不使用外部 API 进行 JSON 解析
- 不做流式输出或流式渲染
- 不涉及 Zustand 等全局状态管理
- 不支持 JSON 路径查询或 JSON Path 操作

## Decisions

### 1. 组件结构：复用 text-summary 的单文件模式

**考虑过：**
- 拆分多个子组件（输入区、结果区、操作按钮）（过度设计）
- 使用独立的工具函数文件（JSON 操作简单，不值得）

**选择：单文件组件 + Tailwind classes**
- 与 text-summary 保持一致，便于维护和参考
- 样式直接用 Tailwind，与项目风格一致
- JSON 操作直接内联在组件中，无额外模块

**为什么：** 工具页面简单，拆分反而增加维护成本，与 text-summary 模式对齐。

### 2. JSON 操作：使用原生 JSON.parse + JSON.stringify

**考虑过：**
- 引入 json-parse 或类似库（增加依赖，无必要）
- 实现自定义 JSON Parser（过度设计）

**选择：原生 JSON.parse / JSON.stringify**
- 格式化：JSON.stringify(JSON.parse(input), null, 2)
- 压缩：JSON.stringify(JSON.parse(input))
- 校验：JSON.parse(input) + try-catch

**为什么：** 原生 API 足够，零依赖，简单可靠。

### 3. 路由集成：在 toolModules 中添加映射

**考虑过：**
- 使用 React.lazy（text-summary 原生方案，但有 Vite 动态导入问题）
- 使用 useEffect + import()（text-summary 当前的解决方案）

**选择：使用 useEffect + import() 模式**
- 与 text-summary 完全一致
- 避免 React.lazy 与 Vite 动态导入的兼容性问题

**为什么：** 保持与 text-summary 完全一致的加载模式，减少维护歧义。

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 大 JSON 文件导致性能问题 | 输入超大 JSON 时可能卡顿 | 使用 try-catch 捕获 JSON.parse 异常，UI 提示输入大小限制 |
| JSON 语法错误提示不够精确 | 用户不知道具体错误位置 | 错误信息包含 Error.message 内容（浏览器已提供行号） |
| 组件样式与 text-summary 不一致 | 工具页面视觉体验割裂 | 复用 text-summary 的 UI 模式和 Tailwind classes |
| 路由懒加载失败导致白屏 | 工具页面无法访问 | router/index.tsx 有 Suspense fallback 展示加载中 |