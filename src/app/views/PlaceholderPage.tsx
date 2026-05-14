import { Link } from 'react-router-dom';
import type { ToolManifest } from '../../tool-registry/catalog';

interface PlaceholderPageProps {
  tool: ToolManifest;
}

export default function PlaceholderPage({ tool }: PlaceholderPageProps) {
  const displayName = tool.name || '未命名工具';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{displayName}</h1>
        {tool.description && (
          <p className="text-gray-600 mb-6">{tool.description}</p>
        )}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-yellow-800 text-sm">
            ⏳ 该工具正在规划中，敬请期待。
          </p>
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}