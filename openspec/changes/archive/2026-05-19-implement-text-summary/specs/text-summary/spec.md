## ADDED Requirements

### Requirement: text-summary-ui-layout
文本摘要工具页面包含输入区、控制区和结果展示区三个部分。

#### Scenario: layout-structure
- **WHEN** 用户访问 `/tools/text-summary` 时
- **THEN** 页面从上到下显示：页面标题 → 输入区 → 控制区 → 结果展示区

#### Scenario: input-area
- **WHEN** 渲染输入区时
- **THEN** 显示一个 textarea，最小高度为 5 行，占满内容区宽度，placeholder 为「请输入需要摘要的文本...」

#### Scenario: control-area
- **WHEN** 渲染控制区时
- **THEN** 显示摘要长度选择器（短/中/长三个 radio 选项，默认选中「中」）和一键摘要按钮（文字为「生成摘要」）

#### Scenario: result-area
- **WHEN** 用户点击「生成摘要」后
- **THEN** 在控制区下方显示结果展示区，包含只读的 textarea 显示摘要结果

---

### Requirement: text-summary-summary-algorithm
摘要算法基于规则提取关键句，不依赖外部 API。

#### Scenario: algorithm-strategy
- **WHEN** 用户提交文本进行摘要时
- **THEN** 使用基于位置和词频的混合策略：
  - 文章首句（第一段第一句）权重最高
  - 段落首句（Topic Sentence）权重次之
  - 包含高频词（停用词除外出现 2 次以上）的句子权重较高

#### Scenario: length-short
- **WHEN** 用户选择「短」时
- **THEN** 提取最多 3 句关键句

#### Scenario: length-medium
- **WHEN** 用户选择「中」时
- **THEN** 提取最多 5 句关键句

#### Scenario: length-long
- **WHEN** 用户选择「长」时
- **THEN** 提取最多 8 句关键句

---

### Requirement: text-summary-empty-input-handling
对空输入和无结果场景的处理。

#### Scenario: empty-text-input
- **WHEN** 用户点击「生成摘要」但输入为空时
- **THEN** 不调用摘要函数，结果区显示提示文字「请输入需要摘要的文本」

#### Scenario: null-input
- **WHEN** 文本输入为 null 时
- **THEN** 结果区显示提示文字「请输入需要摘要的文本」

#### Scenario: empty-result
- **WHEN** 文本有效但无法提取摘要时
- **THEN** 结果区显示提示文字「无法提取有效摘要，请尝试更长的文本」

---

### Requirement: text-summary-stopwords
停用词列表用于过滤无意义的高频词。

#### Scenario: stopword-filtering
- **WHEN** 统计词频时
- **THEN** 忽略以下停用词：的、了、在、是、我、有、和、就、不、也、很、都、可以、要、会、对、于、而

#### Scenario: case-insensitive
- **WHEN** 统计词频时
- **THEN** 不区分大小写（将所有文本转为小写后统计）

---

### Requirement: text-summary-lazy-loading
工具组件通过 React.lazy 实现懒加载。

#### Scenario: lazy-load-component
- **WHEN** 用户首次访问 `/tools/text-summary` 时
- **THEN** 组件通过 router/index.tsx 中的 `lazy(() => import('../modules/text-summary/index.tsx'))` 懒加载

#### Scenario: loading-state
- **WHEN** 懒加载组件尚未加载完成时
- **THEN** router/index.tsx 渲染 `<div className="p-4">加载中...</div>` 作为 fallback