import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-4">页面未找到</p>
      <Link to="/" className="text-blue-500 hover:underline">
        返回首页
      </Link>
    </main>
  );
}