export interface ToolManifest {
  id: string;
  name: string;
  route: string;
  category: string;
  description: string;
  stage: 'active' | 'beta' | 'planned';
}

const tools: ToolManifest[] = [
  {
    id: 'text-summary',
    name: '文本摘要',
    route: '/tools/text-summary',
    category: '文本处理',
    description: '快速提取长文本的核心观点',
    stage: 'active',
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    route: '/tools/json-formatter',
    category: '数据转换',
    description: '美化 JSON 数据结构',
    stage: 'active',
  },
  {
    id: 'code-explainer',
    name: '代码解释',
    route: '/tools/code-explainer',
    category: '开发工具',
    description: '解释代码片段的功能和逻辑',
    stage: 'beta',
  },
  {
    id: 'image-generator',
    name: '图片生成',
    route: '/tools/image-generator',
    category: '内容创作',
    description: '根据描述生成图片',
    stage: 'planned',
  },
  {
    id: 'markdown-table',
    name: 'Markdown 表格',
    route: '/tools/markdown-table',
    category: '文本处理',
    description: '将数据转换为 Markdown 表格',
    stage: 'planned',
  },
];

export function getTools(): ToolManifest[] {
  return tools;
}

export function getToolById(id: string): ToolManifest | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: string): ToolManifest[] {
  return tools.filter((tool) => tool.category === category);
}