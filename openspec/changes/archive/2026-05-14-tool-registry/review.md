# 质量审查

## 1. 边界条件

**状态**：✅ 通过

**发现**：
- `tool-registry/spec.md` 覆盖了 null、空值、越界场景：
  - `getToolById` 不存在的 id 返回 `undefined`
  - `getToolsByCategory` 不存在的分类返回空数组 `[]`
  - 工具 ID 唯一性校验
  - stage 字段有效性校验（必须是三者之一）
  - PlaceholderPage 接收不完整数据时的降级处理（"未命名工具"后备）
- `shared-layout/spec.md` 覆盖了移动端响应式边界条件（< 768px）

**建议**：
- 无

## 2. 回滚方案

**状态**：✅ 通过

**发现**：
- design.md 明确说明"此变更纯增补，不删除或迁移现有数据"
- Migration Plan 列出 6 个步骤，注明"如果出问题，还原变更即可恢复之前的两静态路由状态"
- 无数据库变更，因此不存在数据回滚问题

**建议**：
- 无

## 3. 测试覆盖

**状态**：✅ 通过

**发现**：
- design.md 中明确提到需要测试的场景：
  - Catalog accessor 测试（`getTools()`, `getToolById()`, `getToolsByCategory()`）
  - 工具 ID 唯一性单元测试
  - 路由生成逻辑测试
  - stage 分组和排序测试
  - 构建时校验（active/beta 工具对应的组件文件存在）
- `tool-placeholder/spec.md` 明确提到组件导出可测试性
- `shared-layout/spec.md` 明确提到 TopNav 导航链接可测试

**建议**：
- 无

## 4. 向后兼容

**状态**：✅ 通过

**发现**：
- 当前只有两条静态路由（`/` 和 `*`），此变更会修改 `router/index.tsx`，但由于 `/` 路由保留，首页路径不变
- `catalog.ts` 中 `ToolManifest` 接口新增 `stage` 字段，但现有调用都是空数组，不存在现有数据兼容问题
- 无外部 API 变更

**建议**：
- 无

## 5. 任务粒度

**状态**：⚠️ 警告

**发现**：
- tasks.md 尚未生成（这是本次 review 的目的）
- 当前 proposal + design + specs 的内容覆盖了所有实现细节，为 tasks.md 提供了充分上下文
- specs 中每个 Requirement 的 Scenario 都是潜在的测试用例，与 TDD 节奏对应良好

**建议**：
- tasks.md 每个 step 应控制在 2-5 分钟粒度
- 每个 step 需要包含：完整代码块 + 运行命令 + 预期输出
- 避免占位符（TBD/TODO），如果某步依赖外部条件（如"等待设计确认"），应该作为独立 step 明确标注
- 建议 tasks.md 的 step 顺序：
  1. 更新 `catalog.ts` — 添加 stage 字段 + 初始工具数据（~2min）
  2. 编写 catalog accessor 单元测试（~3min）
  3. 创建 `Layout.tsx` + `TopNav.tsx`（~3min）
  4. 更新 `router/index.tsx` — catalog 驱动路由（~3min）
  5. 创建 `PlaceholderPage.tsx`（~2min）
  6. 更新 `Home.tsx` — 分类分组工具卡片（~3min）
  7. 添加构建时校验脚本（~2min）
  8. 运行 `npx vitest run` 验证所有测试通过（~1min）

---

## 整体评估

**所有工件质量：合格**

proposal、design、specs 三个工件已完整创建，覆盖了：
- Why（proposal）：解决了什么问题，为什么现在做
- How（design）：6 个关键决策，每个决策都有 alternatives considered 和 rationale
- What（specs）：3 个 capability 各有多个 Requirements，每个 Requirement 有多个 Scenario，格式正确（`#### Scenario` 使用 4 个井号，WHEN/THEN 格式）

**对 tasks.md 的关键建议**：

tasks.md 生成时需确保：
1. 每个 step 是 2-5 分钟粒度（不是"上午做完"这种大粒度）
2. 每个 step 包含完整代码片段（不是伪代码或省略）
3. 每个 step 有明确的验证命令 + 预期输出
4. 遵循 TDD 节奏：先写测试（step 2），再写实现（step 1 之后）
5. 构建时校验脚本（step 7）需要在开发流程早期就就位，确保 catalog 和文件系统同步

**整体评估：通过，可生成 tasks.md**