## ADDED Requirements

### Requirement: 首页分类 Tab 导航栏

首页内容区顶部 SHALL 显示分类 Tab 导航栏，包含「全部」Tab 及各分类 Tab。

#### Scenario: 初始显示「全部」Tab
- **WHEN** 用户打开首页
- **THEN** Tab 导航栏显示「全部」「文本处理」「数据转换」「开发工具」「内容创作」五个 Tab，「全部」Tab 为活跃状态

#### Scenario: 点击分类 Tab 过滤卡片
- **WHEN** 用户点击「文本处理」Tab
- **THEN** 页面仅显示分类为「文本处理」的工具卡片，其他分类卡片不渲染
- **AND** 「文本处理」Tab 为活跃状态，「全部」Tab 取消活跃

#### Scenario: 点击「全部」Tab 显示全量
- **WHEN** 用户在分类 Tab 活跃状态下点击「全部」Tab
- **THEN** 页面显示所有工具卡片，所有分类 Tab 取消活跃，「全部」Tab 为活跃状态

#### Scenario: Tab 切换后滚动到顶部
- **WHEN** 用户点击任意 Tab（无论是「全部」还是分类 Tab）
- **THEN** 页面滚动位置重置到顶部

### Requirement: 分类 Tab 动态生成

Tab 导航栏的分类 Tab SHALL 从 `catalog.ts` 中动态读取，不硬编码分类名称。

#### Scenario: 从 catalog 动态获取分类列表
- **WHEN** 首页组件加载
- **THEN** 从 `getTools()` 获取所有工具，使用 `Set` 去重得到分类列表
- **AND** 分类列表顺序与工具在 catalog 中的首次出现顺序一致

### Requirement: 活跃 Tab 视觉区分

活跃 Tab SHALL 与非活跃 Tab 有视觉差异，用户可明确识别当前选中的分类。

#### Scenario: 活跃 Tab 有视觉高亮
- **WHEN** 任意 Tab 处于活跃状态
- **THEN** 该 Tab 显示下划线或背景色高亮，与非活跃 Tab 明确区分

#### Scenario: 非活跃 Tab 无高亮
- **WHEN** Tab 未被选中
- **THEN** 该 Tab 仅显示文字，无下划线或背景色