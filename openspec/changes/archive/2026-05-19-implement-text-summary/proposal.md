## Why

用户提供长文本时需要快速提取核心观点，现有的人工复制粘贴方式效率低下。文本摘要是工具箱中最基础、使用频率最高的文本处理能力，是工具页面的第一个实现示例。

## What Changes

- **新增能力**：文本摘要工具（text-summary）
  - 纯前端实现，不依赖外部 API
  - 基于规则提取文本关键句（首句、段落首句、高频词句子）
- **新增路由**：`/tools/text-summary` 映射到 `src/modules/text-summary/index.tsx`
- **新增模块**：`src/modules/text-summary/` 包含组件和测试

## Capabilities

### New Capabilities

- `text-summary`: 文本摘要工具
  - 文本输入区（textarea，最小 5 行）
  - 摘要长度控制（短/中/长三档）
  - 一键摘要按钮
  - 摘要结果展示区（只读 textarea）
  - 支持输入为空、结果为空的友好提示

## Impact

- 新增 `src/modules/text-summary/` 目录
- 路由已通过 catalog.ts 动态注册，无需修改 router/index.tsx
- 无 breaking change，纯新增功能