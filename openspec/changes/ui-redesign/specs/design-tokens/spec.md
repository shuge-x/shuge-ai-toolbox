## ADDED Requirements

### Requirement: design-tokens

设计系统使用 CSS 变量定义设计令牌，涵盖颜色、字体、spacing。变量命名遵循 `--{category}-{variant}` 模式，如 `--color-primary-500`。所有变量在 `:root` 下声明，确保全局可用。

#### Scenario: 颜色令牌定义完整
- **WHEN** 组件使用 `--color-*` 变量
- **THEN** 解析为正确的色值，且符合品牌视觉

#### Scenario: 字体令牌定义完整
- **WHEN** 组件使用 `--font-*` 变量
- **THEN** 解析为正确的字体栈

#### Scenario: Spacing 令牌定义完整
- **WHEN** 组件使用 `--spacing-*` 变量
- **THEN** 解析为正确的间距值

### Requirement: 冷色系品牌色板

品牌色板使用冷色系为主调，主色为蓝色系（#3B82F6 蓝色），强调色为琥珀色（#F59E0B），背景以冷灰为主。确保有足够的对比度满足 WCAG AA 标准。

#### Scenario: 主色用于主要交互元素
- **WHEN** 按钮、链接使用主色
- **THEN** 视觉上一致且有辨识度

#### Scenario: 强调色用于重要提示
- **WHEN** Beta 标签、警告提示使用强调色
- **THEN** 与主色形成对比，引导用户注意

### Requirement: 字体系统

字体栈优先使用系统字体栈（-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif），回退到无衬线字体族。标题使用粗体，正文使用常规字重。

#### Scenario: 标题字体粗体
- **WHEN** h1, h2 等标题元素渲染
- **THEN** 使用 font-bold，字号逐级递减

#### Scenario: 正文字体常规
- **WHEN** p, span 等正文元素渲染
- **THEN** 使用 font-normal，行高约 1.5

### Requirement: spacing 系统

间距使用 4px 基准网格，从 4px（0.25rem）到 64px（4rem）的完整序列。常用值：4, 8, 12, 16, 24, 32, 48, 64。

#### Scenario: 组件内间距一致
- **WHEN** 使用 `--spacing-*` 变量
- **THEN** 元素间保持视觉节奏感