// src/modules/json-formatter/index.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JsonFormatterPage } from './index';

describe('JsonFormatterPage', () => {
  it('渲染页面标题', () => {
    render(<JsonFormatterPage />);
    expect(screen.getByText('JSON 格式化')).toBeInTheDocument();
  });

  it('渲染输入区域', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...');
    expect(textarea).toBeInTheDocument();
  });

  it('渲染三个操作按钮', () => {
    render(<JsonFormatterPage />);
    expect(screen.getByRole('button', { name: '格式化' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '压缩' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '校验' })).toBeInTheDocument();
  });

  it('点击格式化按钮显示格式化结果', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{"a":1,"b":2}' } });

    const button = screen.getByRole('button', { name: '格式化' });
    fireEvent.click(button);

    const outputTextarea = screen.getAllByRole('textbox')[1] as HTMLTextAreaElement;
    expect(outputTextarea.value).toContain('"a": 1');
    expect(outputTextarea.value).toContain('"b": 2');
  });

  it('点击压缩按钮显示压缩结果', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{\n  "a": 1,\n  "b": 2\n}' } });

    const button = screen.getByRole('button', { name: '压缩' });
    fireEvent.click(button);

    const outputTextarea = screen.getAllByRole('textbox')[1] as HTMLTextAreaElement;
    expect(outputTextarea.value).toBe('{"a":1,"b":2}');
  });

  it('无效 JSON 显示错误提示', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{invalid json}' } });

    const button = screen.getByRole('button', { name: '校验' });
    fireEvent.click(button);

    expect(screen.getByText(/JSON 语法错误/)).toBeInTheDocument();
  });

  it('空输入显示提示', () => {
    render(<JsonFormatterPage />);
    const button = screen.getByRole('button', { name: '格式化' });
    fireEvent.click(button);

    expect(screen.getByText('请输入 JSON 数据')).toBeInTheDocument();
  });

  it('仅空白字符输入显示提示', () => {
    render(<JsonFormatterPage />);
    const textarea = screen.getByPlaceholderText('请输入 JSON 数据...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '   \n\t  ' } });

    const button = screen.getByRole('button', { name: '格式化' });
    fireEvent.click(button);

    expect(screen.getByText('请输入 JSON 数据')).toBeInTheDocument();
  });
});