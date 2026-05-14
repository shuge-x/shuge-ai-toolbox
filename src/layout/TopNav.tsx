import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
      <Link to="/" className="text-lg font-bold text-gray-900">
        shuge AI Toolbox
      </Link>
      <div className="flex gap-4">
        <Link
          to="/"
          className={`px-3 py-1 rounded ${
            isHome ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          首页
        </Link>
      </div>
    </nav>
  );
}