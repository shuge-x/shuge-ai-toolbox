export interface ToolManifest {
  id: string;
  name: string;
  route: string;
  category: string;
  description: string;
}

const tools: ToolManifest[] = [];

export function getTools(): ToolManifest[] {
  return tools;
}

export function getToolById(id: string): ToolManifest | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: string): ToolManifest[] {
  return tools.filter((tool) => tool.category === category);
}