## ADDED Requirements

### Requirement: 占位页内容

占位页显示工具名称和描述，说明工具正在规划中。使用醒目的视觉容器包裹内容，确保用户一眼看出状态。

#### Scenario: 显示工具名称和描述
- **WHEN** 访问 planned 工具页面
- **THEN** 显示工具名称和描述文本

#### Scenario: 明确标注规划中状态
- **WHEN** 页面渲染
- **THEN** 显示规划中提示信息，使用强调色背景

#### Scenario: 提供返回首页入口
- **WHEN** 用户看到占位页
- **THEN** 存在返回首页的链接