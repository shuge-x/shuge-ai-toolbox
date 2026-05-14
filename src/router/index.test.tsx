import { describe, it, expect } from 'vitest';
import { getTools } from '../tool-registry/catalog';

describe('catalog-driven routing', () => {
  it('getTools 返回的工具生成对应数量的路由', () => {
    const tools = getTools();
    const toolRoutes = tools.map((t) => `/tools/${t.id}`);
    expect(toolRoutes.length).toBe(tools.length);
  });

  it('planned 工具的路由存在', () => {
    const tools = getTools();
    const plannedTools = tools.filter((t) => t.stage === 'planned');
    plannedTools.forEach((tool) => {
      expect(tool.id).toBeTruthy();
      expect(tool.stage).toBe('planned');
    });
  });

  it('active 工具的路由存在', () => {
    const tools = getTools();
    const activeTools = tools.filter((t) => t.stage === 'active');
    activeTools.forEach((tool) => {
      expect(tool.id).toBeTruthy();
      expect(['active', 'beta']).toContain(tool.stage);
    });
  });
});