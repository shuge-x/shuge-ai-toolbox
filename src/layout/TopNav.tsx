import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav
      className="flex items-center justify-between px-6 py-4"
      style={{ backgroundColor: 'var(--color-neutral-50)', borderBottom: '1px solid var(--color-neutral-200)' }}
    >
      <Link
        to="/"
        className="text-lg font-semibold"
        style={{ color: 'var(--color-neutral-900)' }}
      >
        shuge AI Toolbox
      </Link>
      <div className="flex gap-4">
        <Link
          to="/"
          className={`px-3 py-1 rounded-md transition-colors ${
            isHome ? 'font-bold' : 'hover:opacity-80'
          }`}
          style={{
            color: isHome ? 'var(--color-primary-500)' : 'var(--color-neutral-600)',
          }}
        >
          首页
        </Link>
      </div>
    </nav>
  );
}