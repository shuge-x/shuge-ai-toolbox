import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextSummaryPage } from './index';

vi.mock('./extract-summary', () => ({
  extractSummary: vi.fn((text) => {
    if (!text) return '';
    if (text === '短') return '无法提取有效摘要，请尝试更长的文本';
    return '这是摘要结果。';
  }),
}));

describe('TextSummaryPage', () => {
  it('渲染页面标题', () => {
    render(<TextSummaryPage />);
    expect(screen.getByText('文本摘要')).toBeInTheDocument();
  });

  it('渲染输入区域', () => {
    render(<TextSummaryPage />);
    const textarea = screen.getByPlaceholderText('请输入需要摘要的文本...');
    expect(textarea).toBeInTheDocument();
  });

  it('渲染摘要长度选择器', () => {
    render(<TextSummaryPage />);
    expect(screen.getByLabelText('短')).toBeInTheDocument();
    expect(screen.getByLabelText('中')).toBeInTheDocument();
    expect(screen.getByLabelText('长')).toBeInTheDocument();
  });

  it('渲染生成摘要按钮', () => {
    render(<TextSummaryPage />);
    expect(screen.getByRole('button', { name: '生成摘要' })).toBeInTheDocument();
  });

  it('点击按钮显示摘要结果', () => {
    render(<TextSummaryPage />);
    const textarea = screen.getByPlaceholderText('请输入需要摘要的文本...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '这是一段测试文本。用于测试摘要功能。' } });

    const button = screen.getByRole('button', { name: '生成摘要' });
    fireEvent.click(button);

    expect(screen.getByText('这是摘要结果。')).toBeInTheDocument();
  });

  it('空输入时显示提示', () => {
    render(<TextSummaryPage />);
    const button = screen.getByRole('button', { name: '生成摘要' });
    fireEvent.click(button);

    expect(screen.getByText('请输入需要摘要的文本')).toBeInTheDocument();
  });
});