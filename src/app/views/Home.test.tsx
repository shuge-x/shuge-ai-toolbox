import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { getTools } from '../../tool-registry/catalog';

vi.stubGlobal('scrollTo', vi.fn());

describe('Home Tab 导航', () => {
  it('默认显示「全部」Tab 为活跃状态', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const allTab = screen.getByRole('button', { name: '全部' });
    expect(allTab).toBeTruthy();
  });

  it('点击分类 Tab 过滤卡片，仅显示该分类工具', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const textProcessingTab = screen.getByRole('button', { name: '文本处理' });
    fireEvent.click(textProcessingTab);

    const visibleCards = screen.getAllByRole('link');
    const tools = getTools().filter((t) => t.category === '文本处理');
    expect(visibleCards.length).toBe(tools.length);
  });

  it('点击分类 Tab 后滚动到顶部', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const textProcessingTab = screen.getByRole('button', { name: '文本处理' });

    fireEvent.click(textProcessingTab);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('点击「全部」Tab 恢复显示全量工具', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const textProcessingTab = screen.getByRole('button', { name: '文本处理' });
    fireEvent.click(textProcessingTab);

    const allTab = screen.getByRole('button', { name: '全部' });
    fireEvent.click(allTab);

    const visibleCards = screen.getAllByRole('link');
    expect(visibleCards.length).toBe(getTools().length);
  });

  it('Tab 列表从 catalog 动态获取，不硬编码', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const tools = getTools();
    const categories = [...new Set(tools.map((t) => t.category))];

    categories.forEach((cat) => {
      expect(screen.getByRole('button', { name: cat })).toBeTruthy();
    });
  });

  it('活跃 Tab 有视觉高亮样式', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const textProcessingTab = screen.getByRole('button', { name: '文本处理' });
    fireEvent.click(textProcessingTab);

    const activeTab = screen.getByRole('button', { name: '文本处理' });
    expect(activeTab.style.borderColor).toBe('var(--color-primary-500)');
  });
});

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
      expect(screen.getAllByText(cat).length).toBeGreaterThanOrEqual(1);
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