## Context

shuge AI Toolbox 是一个 AI 工具集合平台，前端单页应用。项目从零开始搭建，需要建立标准目录结构和开发工作流。

技术栈已确定：React 19 + TypeScript + Vite + Tailwind CSS。参考 Creator-Toolbox 的模块化架构，每个工具在 `modules/` 下独立子目录，通过 `tool-registry/catalog.ts` 统一注册。

当前状态：空仓库，无任何代码。

## Goals / Non-Goals

**Goals:**
- 搭建可运行的项目骨架，浏览器能渲染首页
- 建立标准的目录结构，为后续扩展提供一致的开发体验
- 配置 OpenSpec 工作流，确保变更可追溯
- 初始化 Git 仓库并推送到 GitHub

**Non-Goals:**
- 实现具体工具功能（Phase 3）
- 实现工具注册逻辑和动态路由加载（Phase 3）
- 设计完整的 UI 组件库（按需添加）
- 接真实 API 数据源（数据层接口已抽象，数据暂时 hardcoded）

## Decisions

### 1. 目录结构：`app/` vs `src/` 根目录

**Decision:** 使用 `src/` 作为源码根目录

**Rationale:** 主流 React + Vite 项目的社区约定，工具链默认查找 `src/`。Vite 文档、Vitest、ESLint 插件等均假设 `src/` 为源码根目录，减少配置成本。

**Alternative:** 使用 `app/` 作为根目录（如某些框架约定）。缺点：需额外配置路径别名和工具链，增加心智负担。

---

### 2. 布局与页面分离：`app/layouts/` + `app/views/`

**Decision:** 布局放 `app/layouts/`，页面放 `app/views/`

**Rationale:**
- 布局（导航栏、侧边栏、页脚）与页面内容职责分离
- 同一布局可复用给多个页面
- 符合 React 项目常见模式（layouts/pages、components/pages）

**Alternative:** 所有组件堆在 `components/`。缺点：布局与业务组件混杂，难以区分。

---

### 3. 路由架构：集中配置 + 动态加载

**Decision:** 路由在 `router/index.ts` 集中配置，根据 catalog 动态加载

**Rationale:**
- 参考 Creator-Toolbox 架构，工具通过注册中心声明自己的路由
- 集中路由配置便于管理全局路由（首页、404）
- 动态加载支持未来插件式扩展工具模块

**Implementation:** Phase 1 只实现静态路由（首页 + 404），动态加载逻辑在 Phase 3 实现。

---

### 4. 工具注册接口：ToolManifest + 查询函数

**Decision:** `tool-registry/catalog.ts` 定义 `ToolManifest` 接口和 `getTools()`, `getToolById()`, `getToolsByCategory()` 查询函数

**Rationale:**
- 接口先行，数据层抽象稳定后，再实现具体工具
- Phase 3 接 API 时只需改数据源，调用方代码不变
- TypeScript 静态类型检查保证数据一致性

**Alternative:** 直接 hardcode 在各组件里。缺点：数据分散，难以统一管理，Phase 3 接 API 成本高。

---

### 5. OpenSpec 工作流

**Decision:** 使用 OpenSpec 管理变更流程

**Rationale:**
- proposal → design → tasks 三阶段规范变更
- review 工件确保代码质量
- 与 Git 工作流结合，变更可追溯

## Risks / Trade-offs

- [Risk] 目录结构在 Phase 3 可能需要调整（modules/ 具体结构未知）
  → **Mitigation:** Phase 1 用 `.gitkeep` 占位，modules/ 的具体结构在 Phase 3 设计时再确定，避免过早设计

- [Risk] OpenSpec 配置（config.yaml、schema fork、review 模板）配置成本
  → **Mitigation:** OpenSpec 提供 CLI 工具，配置成本可控。review 模板先使用默认模板，后续按需调整

- [Risk] Tailwind CSS 4 与某些旧插件兼容性问题
  → **Mitigation:** React 19 + Vite + Tailwind CSS 4 是 2024-2025 年的主流组合，社区成熟，文档完善，遇到问题容易搜索解决