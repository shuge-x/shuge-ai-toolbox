import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopNav from './TopNav';

describe('TopNav', () => {
  it('显示 Logo 和首页链接', () => {
    const { getByText } = render(
      <MemoryRouter>
        <TopNav />
      </MemoryRouter>
    );
    expect(getByText('shuge AI Toolbox')).toBeTruthy();
    expect(getByText('首页')).toBeTruthy();
  });

  it('Logo 点击跳转首页', () => {
    const { getByText } = render(
      <MemoryRouter>
        <TopNav />
      </MemoryRouter>
    );
    const logoLink = getByText('shuge AI Toolbox').closest('a');
    expect(logoLink?.getAttribute('href')).toBe('/');
  });

  it('首页链接高亮当前路径', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <TopNav />
      </MemoryRouter>
    );
    const homeLink = getByText('首页');
    expect(homeLink.closest('a')?.className).toContain('font-bold');
  });
});