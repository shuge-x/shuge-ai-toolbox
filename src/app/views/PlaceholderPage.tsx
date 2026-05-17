import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function PlaceholderPage({ tool }: { tool: { name: string; description?: string } }) {
  const displayName = tool.name || '未命名工具';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="border rounded-xl p-8 max-w-md w-full"
        style={{
          backgroundColor: 'var(--color-neutral-50)',
          borderColor: 'var(--color-neutral-200)',
        }}
      >
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: 'var(--color-neutral-800)' }}
        >
          {displayName}
        </h1>
        {tool.description && (
          <p
            className="mb-6"
            style={{ color: 'var(--color-neutral-600)' }}
          >
            {tool.description}
          </p>
        )}
        <div
          className="rounded-lg px-4 py-3 mb-6"
          style={{
            backgroundColor: 'var(--color-accent-50)',
            border: '1px solid var(--color-accent-200)',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock size={16} style={{ color: 'var(--color-accent-500)' }} />
            <p
              className="text-sm"
              style={{ color: 'var(--color-accent-600)' }}
            >
              该工具正在规划中，敬请期待。
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="hover:underline transition-colors"
          style={{ color: 'var(--color-primary-500)' }}
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}