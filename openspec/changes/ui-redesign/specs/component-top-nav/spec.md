## ADDED Requirements

### Requirement: 导航栏布局

顶部导航栏固定在页面顶部，左侧显示产品 logo 或名称，右侧显示导航链接。水平方向 flex 布局，两端对齐。

#### Scenario: 显示产品名称
- **WHEN** 导航栏渲染
- **THEN** 显示 "shuge AI Toolbox" 作为品牌标识

#### Scenario: 显示首页链接
- **WHEN** 导航栏渲染
- **THEN** 显示指向首页的链接，当前页高亮

### Requirement: 导航栏视觉样式

导航栏使用冷色系背景色，与页面整体风格一致。链接使用主色，当前页使用加粗和强调色。

#### Scenario: 导航链接高亮
- **WHEN** 用户在首页
- **THEN** 首页链接使用主色和粗体

#### Scenario: 导航链接悬停状态
- **WHEN** 用户悬停在导航链接
- **THEN** 显示悬停样式（如颜色变化或下划线）