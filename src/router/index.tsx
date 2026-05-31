import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getTools } from '../tool-registry/catalog';
import Layout from '../layout/Layout';
import Home from '../app/views/Home';
import NotFound from '../app/views/NotFound';
import PlaceholderPage from '../app/views/PlaceholderPage';

const tools = getTools();

// Tool module loaders - using useEffect + import() because lazy() has issues
// with Vite's dynamic import resolution for variable paths
const toolModules: Record<string, () => Promise<{ default: React.ComponentType<unknown> }>> = {
  'text-summary': () => import('/src/modules/text-summary/index.tsx'),
  'json-formatter': () => import('/src/modules/json-formatter/index.tsx'),
};

function ToolPage({ toolId }: { toolId: string }) {
  const [Component, setComponent] = useState<React.ComponentType<unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = toolModules[toolId];
    if (!loader) {
      setError(`Tool not found: ${toolId}`);
      return;
    }
    loader()
      .then(mod => setComponent(() => mod.default))
      .catch(e => setError(e.message));
  }, [toolId]);

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  if (!Component) {
    return <div className="p-4">加载中...</div>;
  }

  return <Component />;
}

function LazyTool({ tool }: { tool: ReturnType<typeof getTools>[number] }) {
  if (tool.stage === 'planned') {
    return <PlaceholderPage tool={tool} />;
  }

  return (
    <Suspense fallback={<div className="p-4">加载中...</div>}>
      <ToolPage toolId={tool.id} />
    </Suspense>
  );
}

const toolRoutes = tools.map((tool) => ({
  path: `/tools/${tool.id}`,
  element: (
    <Layout>
      <LazyTool tool={tool} />
    </Layout>
  ),
}));

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