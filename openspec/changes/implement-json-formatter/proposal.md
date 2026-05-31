## Why

工具箱需要 JSON 处理能力：格式化、压缩、语法校验是开发日常高频需求。与 text-summary 类似，这是纯前端的本地工具，不依赖外部 API，数据全在客户端处理。

## What Changes

- **新增模块**：`src/modules/json-formatter/` 实现 JSON 格式化工具
  - 复用 text-summary 已建立的组件模式
  - 包含格式化、压缩、语法校验三大功能
- **新增路由映射**：在 `router/index.tsx` 的 `toolModules` 中添加 `json-formatter` 条目
- **catalog.ts 已注册**：`json-formatter` 在 catalog.ts 中已标记为 `active`，路由已存在

## Capabilities

### New Capabilities

- `json-formatter`: JSON 格式化工具
  - **格式化**：将压缩的 JSON 格式化为带缩进的可读形式
  - **压缩**：将格式化的 JSON 压缩为单行
  - **语法校验**：检测 JSON 语法错误并提示位置
  - 输入区（textarea）
  - 操作按钮（格式化/压缩/校验）
  - 结果展示区
  - 错误提示区

## Impact

- 新增 `src/modules/json-formatter/` 目录
- 修改 `src/router/index.tsx` 的 `toolModules` 添加 json-formatter 映射
- 无 breaking change，纯新增功能