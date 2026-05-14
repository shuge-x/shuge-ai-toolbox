import { describe, it, expect } from 'vitest';
import { getTools, getToolById, getToolsByCategory } from './catalog';

describe('catalog accessors', () => {
  describe('getTools', () => {
    it('返回非空数组', () => {
      const tools = getTools();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
    });

    it('每个工具都有有效 stage', () => {
      const tools = getTools();
      const validStages = ['active', 'beta', 'planned'];
      tools.forEach((tool) => {
        expect(validStages).toContain(tool.stage);
      });
    });
  });

  describe('getToolById', () => {
    it('传入已存在的 id 返回对应工具', () => {
      const tools = getTools();
      const firstTool = tools[0];
      const found = getToolById(firstTool.id);
      expect(found).toEqual(firstTool);
    });

    it('传入不存在的 id 返回 undefined', () => {
      const found = getToolById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getToolsByCategory', () => {
    it('传入已存在的分类返回该分类下的工具', () => {
      const tools = getTools();
      const category = tools[0].category;
      const filtered = getToolsByCategory(category);
      filtered.forEach((tool) => {
        expect(tool.category).toBe(category);
      });
    });

    it('传入不存在的分类返回空数组', () => {
      const filtered = getToolsByCategory('不存在的分类');
      expect(filtered).toEqual([]);
    });
  });

  describe('工具 ID 唯一性', () => {
    it('所有工具 id 不重复', () => {
      const tools = getTools();
      const ids = tools.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});