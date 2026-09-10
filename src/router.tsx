import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet
} from '@tanstack/react-router';
import { RadarAppContent } from './App';
import { RadarProvider } from './context/RadarContext';

// Root Route: Renders the Outlet for child routes
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Primary route for '/': renders the current COSMO application
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RadarAppContent,
});

// Fallback catch-all route to preserve compatibility during this initial phase
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: RadarAppContent,
});

// Register route tree
const routeTree = rootRoute.addChildren([indexRoute, catchAllRoute]);

// Instantiate TanStack Router
export const router = createRouter({
  routeTree,
});

// Type registration for TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Router root component
export const AppRouter: React.FC = () => {
  return (
    <RadarProvider>
      <RouterProvider router={router} />
    </RadarProvider>
  );
};
