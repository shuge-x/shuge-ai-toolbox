import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { getTools } from '../../tool-registry/catalog';

describe('Home', () => {
  it('渲染所有分类的 section', () => {
    const tools = getTools();
    const categories = [...new Set(tools.map((t) => t.category))];

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    categories.forEach((cat) => {
      expect(screen.getByText(cat)).toBeTruthy();
    });
  });

  it('每个 active 工具卡片可点击跳转', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const activeTools = getTools().filter((t) => t.stage === 'active');
    activeTools.forEach((tool) => {
      const card = getByText(tool.name).closest('a');
      expect(card?.getAttribute('href')).toBe(`/tools/${tool.id}`);
    });
  });

  it('planned 工具显示 Planned 标签', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const plannedTools = getTools().filter((t) => t.stage === 'planned');
    expect(screen.getAllByText('Planned').length).toBe(plannedTools.length);
  });

  it('beta 工具显示 Beta 标签', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const betaTools = getTools().filter((t) => t.stage === 'beta');
    expect(screen.getAllByText('Beta').length).toBe(betaTools.length);
  });
});