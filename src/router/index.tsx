import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getTools } from '../tool-registry/catalog';
import Layout from '../layout/Layout';
import Home from '../app/views/Home';
import NotFound from '../app/views/NotFound';
import PlaceholderPage from '../app/views/PlaceholderPage';

const tools = getTools();

const toolRoutes = tools.map((tool) => ({
  path: `/tools/${tool.id}`,
  element: tool.stage === 'planned' ? (
    <PlaceholderPage tool={tool} />
  ) : (
    <Suspense fallback={<div className="p-4">加载中...</div>}>
      <LazyTool tool={tool} />
    </Suspense>
  ),
}));

function LazyTool({ tool }: { tool: (typeof tools)[number] }) {
  const ToolComponent = lazy(() => import(`../modules/${tool.id}/index.tsx`));
  return <ToolComponent />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  ...toolRoutes,
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}