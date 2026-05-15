## ADDED Requirements

### Requirement: 页面标题区域

首页顶部包含醒目的标题区域，展示产品名称和 tagline。标题区域使用垂直 padding 居中，内容左对齐或居中（根据布局决定）。

#### Scenario: 显示产品名和 tagline
- **WHEN** 用户访问首页
- **THEN** 看到产品名称和描述文字

#### Scenario: 标题层级清晰
- **WHEN** 页面渲染标题
- **THEN** h1 使用品牌主色或深色，字号大于其他文本

### Requirement: 工具分类展示

工具按分类分组展示，每个分类有独立区域。分类标题使用统一的视觉样式。工具卡片网格排列，响应式列数。

#### Scenario: 按字母顺序展示分类
- **WHEN** 首页加载
- **THEN** 分类按字母顺序排列

#### Scenario: 工具卡片展示名称和描述
- **WHEN** 渲染工具卡片
- **THEN** 显示工具名称、描述、stage 标签

#### Scenario: planned 工具特殊样式
- **WHEN** 工具 stage 为 planned
- **THEN** 卡片使用降低的不透明度，标注 Planned 标签

#### Scenario: beta 工具特殊样式
- **WHEN** 工具 stage 为 beta
- **THEN** 显示 Beta 标签于名称旁