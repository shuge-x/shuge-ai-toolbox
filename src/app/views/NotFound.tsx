import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <h1
        className="text-6xl font-bold mb-4"
        style={{ color: 'var(--color-primary-500)' }}
      >
        404
      </h1>
      <p
        className="text-xl mb-6"
        style={{ color: 'var(--color-neutral-600)' }}
      >
        页面未找到
      </p>
      <Link
        to="/"
        className="hover:underline transition-colors"
        style={{ color: 'var(--color-primary-500)' }}
      >
        返回首页
      </Link>
    </main>
  );
}