## Why

首页当前为分类平铺的长列表，用户需要手动滚动查找目标分类，效率低。引入 Tab 导航实现分类过滤，让用户点击即达目标分类，改善定位效率。

## What Changes

- 新增首页分类 Tab 导航栏（位于内容区顶部）
- 支持按分类过滤显示工具卡片
- 「全部」Tab 显示全量工具，其他 Tab 显示对应分类工具
- Tab 切换时滚动到顶部

## Capabilities

### New Capabilities
- `category-navigation`: 首页分类 Tab 导航，支持按分类过滤工具卡片列表

### Modified Capabilities
<!-- 现有能力的需求未发生变化 -->

## Impact

- 受影响页面：`src/pages/home-page/`（首页）
- 状态管理：Zustand store 新增分类过滤状态（如使用）
- 测试覆盖：首页组件测试需覆盖 Tab 切换行为