import { lazy, Suspense, useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getTools } from '../tool-registry/catalog';
import Layout from '../layout/Layout';
import Home from '../app/views/Home';
import NotFound from '../app/views/NotFound';
import PlaceholderPage from '../app/views/PlaceholderPage';

const tools = getTools();

const toolRoutes = tools.map((tool) => ({
  path: `/tools/${tool.id}`,
  element: (
    <Layout>
      {tool.stage === 'planned' ? (
        <PlaceholderPage tool={tool} />
      ) : (
        <Suspense fallback={<div className="p-4">加载中...</div>}>
          <LazyTool tool={tool} />
        </Suspense>
      )}
    </Layout>
  ),
}));

function LazyTool({ tool }: { tool: (typeof tools)[number] }) {
  const Component = useMemo(
    () => lazy(() => import(`../modules/${tool.id}/index.tsx`)),
    [tool.id]
  );
  return <Component />;
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