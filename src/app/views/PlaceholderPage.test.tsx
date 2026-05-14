import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PlaceholderPage from './PlaceholderPage';
import type { ToolManifest } from '../../tool-registry/catalog';

const mockTool: ToolManifest = {
  id: 'test-tool',
  name: '测试工具',
  route: '/tools/test-tool',
  category: '测试分类',
  description: '这是一个测试工具的描述',
  stage: 'planned',
};

describe('PlaceholderPage', () => {
  it('显示工具名称', () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/tools/test-tool']}>
        <Routes>
          <Route path="/tools/:id" element={<PlaceholderPage tool={mockTool} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByRole('heading', { level: 1 }).textContent).toBe('测试工具');
  });

  it('显示工具描述', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/tools/test-tool']}>
        <Routes>
          <Route path="/tools/:id" element={<PlaceholderPage tool={mockTool} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByText('这是一个测试工具的描述')).toBeTruthy();
  });

  it('显示"正在规划中"提示', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/tools/test-tool']}>
        <Routes>
          <Route path="/tools/:id" element={<PlaceholderPage tool={mockTool} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByText(/规划中/)).toBeTruthy();
  });

  it('显示返回首页链接', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/tools/test-tool']}>
        <Routes>
          <Route path="/tools/:id" element={<PlaceholderPage tool={mockTool} />} />
        </Routes>
      </MemoryRouter>
    );
    const link = getByText('← 返回首页');
    expect(link.getAttribute('href')).toBe('/');
  });

  it('接收不完整数据时显示降级内容', () => {
    const incompleteTool = { id: 'x', name: '', route: '', category: '', description: '', stage: 'planned' as const };
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/tools/x']}>
        <Routes>
          <Route path="/tools/:id" element={<PlaceholderPage tool={incompleteTool} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByRole('heading', { level: 1 }).textContent).toBe('未命名工具');
  });
});