## ADDED Requirements

### Requirement: brand-color-system
应用使用蓝紫（Blue-Violet）作为主品牌色，与业界常见的 Tailwind 默认蓝形成差异化。品牌色在所有交互元素上使用。

#### Scenario: primary-color-usage
- **WHEN** 用户与按钮、链接等可交互元素交互时
- **THEN** 使用 primary-500（#8B5CF6）作为默认色，primary-600（#7C3AED）作为 hover/active 色

#### Scenario: accent-color-usage
- **WHEN** 需要功能性区分时（如 Beta badge）
- **THEN** 使用 accent-500（#F59E0B）琥珀色

#### Scenario: semantic-colors
- **WHEN** 展示成功、警告、错误状态时
- **THEN** 分别使用 semantic 变量：success/warning/error

---

### Requirement: icon-system
应用使用 lucide-react 图标库，每个内容分类配有专属图标，Badge 使用小图标替代 emoji。

#### Scenario: category-icons
- **WHEN** 在 Home 页面展示分类导航或分类标题时
- **THEN** 每个分类显示对应图标：
  - 文本处理 → Type
  - 数据转换 → RefreshCw
  - 开发工具 → Code2
  - 内容创作 → Feather

#### Scenario: badge-icons
- **WHEN** 工具卡片需要展示 stage badge 时
- **THEN** 使用 Lucide 小图标：
  - Beta 工具 → Flask 图标 + accent 配色
  - Planned 工具 → ClipboardList 图标 + neutral 配色

---

### Requirement: motion-system
应用使用统一的微动效体系，提升产品感和反馈度。

#### Scenario: card-hover
- **WHEN** 用户鼠标悬停在工具卡片上时
- **THEN** 卡片执行抬升动画：scale(1.02) + box-shadow(0 4px 12px rgba(139, 92, 246, 0.15))，transition 为 200ms ease-out

#### Scenario: stagger-entrance
- **WHEN** Home 页面首次加载时
- **THEN** 卡片组以 stagger 形式逐个入场：每张卡片延迟 100ms 执行 fadeInUp 动画（opacity 0→1, translateY 16px→0，duration 400ms，easing cubic-bezier(0.22, 1, 0.36, 1)）

#### Scenario: tab-indicator
- **WHEN** 用户切换 Tab 时
- **THEN** 底部指示器以滑动动画切换位置和宽度，transition 为 250ms cubic-bezier(0.4, 0, 0.2, 1)

---

### Requirement: header-branding
Header 区域通过图标和背景渐变提升品牌感知。

#### Scenario: header-icon
- **WHEN** 用户访问 Home 页面时
- **THEN** 标题左侧显示一个与 AI Toolbox 主题相关的 Lucide Icon（推荐 Wand2 或 Toolbox）

#### Scenario: header-gradient
- **WHEN** Header 渲染时
- **THEN** 背景使用从 neutral-50 到 primary-50 的微渐变（135deg 方向），底部有 1px neutral-200 分割线