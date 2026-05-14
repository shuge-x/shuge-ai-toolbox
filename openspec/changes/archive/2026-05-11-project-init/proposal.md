## Why

建立 shuge AI Toolbox 项目骨架，用于托管 AI 工具集合平台。参考 Creator-Toolbox 的模块化架构，为未来多工具扩展奠定基础。MVP 聚焦于脚手架和目录结构，具体工具功能在后续迭代中实现。

## What Changes

- 初始化 React 19 + TypeScript + Vite + Tailwind CSS 项目脚手架
- 建立标准目录结构：app/layouts, app/views, modules, router, lib, tool-registry
- 创建 `tool-registry/catalog.ts`，定义 `ToolManifest` 接口和查询函数（数据层抽象）
- 实现首页占位页面（项目名 + 工具列表占位区）
- 配置 React Router 路由（/ 首页 + 404 fallback）
- 配置 OpenSpec 工作流（config.yaml + schema fork + review 模板）
- Git 初始化并推送到 GitHub 公开仓库 shuge-ai-toolbox

## Capabilities

### New Capabilities

- `project-scaffold`: 项目骨架搭建，包含目录结构、路由配置、OpenSpec 工作流配置

### Modified Capabilities

<!-- 现有 spec 无，本期为全新项目 -->

## Impact

- 新建 src/ 目录结构
- 新增 openspec/ 工作流配置
- 初始化 Git 仓库，推送至 GitHub