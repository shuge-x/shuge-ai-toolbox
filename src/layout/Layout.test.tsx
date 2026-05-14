import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout', () => {
  it('渲染 TopNav 和 children', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Layout>
          <div>测试内容</div>
        </Layout>
      </MemoryRouter>
    );
    expect(getByText('shuge AI Toolbox')).toBeTruthy();
    expect(getByText('测试内容')).toBeTruthy();
  });

  it('TopNav 在内容区域上方', () => {
    const { container } = render(
      <MemoryRouter>
        <Layout>
          <div>测试内容</div>
        </Layout>
      </MemoryRouter>
    );
    const nav = container.querySelector('nav');
    const content = container.querySelector('div');
    expect(nav?.compareDocumentPosition(content!) === Node.DOCUMENT_POSITION_FOLLOWING).toBe(false);
  });
});