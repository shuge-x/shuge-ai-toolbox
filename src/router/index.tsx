import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../app/views/Home';
import NotFound from '../app/views/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}