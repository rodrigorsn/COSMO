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
import { UnknownRouteFallback } from './components/common/UnknownRouteFallback';

// Root Route: Renders the Outlet for child routes
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 1. Dashboard (Visão Geral)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RadarAppContent,
});

// 2. Verticais
const verticaisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verticais',
  component: RadarAppContent,
});

// 3. Organizações
const organizacoesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/organizacoes',
  component: RadarAppContent,
});

// 4. Entrevistas
const entrevistasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entrevistas',
  component: RadarAppContent,
});

// 5. Dores Consolidadas
const doresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dores',
  component: RadarAppContent,
});

// 6. Oportunidades
const oportunidadesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/oportunidades',
  component: RadarAppContent,
});

// 7. Ranking
const rankingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ranking',
  component: RadarAppContent,
});

// 8. Question Engine / Biblioteca de Perguntas
const perguntasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perguntas',
  component: RadarAppContent,
});

// 9. Fontes & Mercado
const fontesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fontes',
  component: RadarAppContent,
});

// 10. Matriz Cross-Vertical
const crossVerticalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cross-vertical',
  component: RadarAppContent,
});

// Fallback explícito para rota não reconhecida (Seção 8 do PRD de Migração)
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: UnknownRouteFallback,
});

// Registro da árvore de rotas principais
const routeTree = rootRoute.addChildren([
  indexRoute,
  verticaisRoute,
  organizacoesRoute,
  entrevistasRoute,
  doresRoute,
  oportunidadesRoute,
  rankingRoute,
  perguntasRoute,
  fontesRoute,
  crossVerticalRoute,
  catchAllRoute,
]);

// Instanciação do TanStack Router
export const router = createRouter({
  routeTree,
});

// Registro de tipos para o TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Componente raiz do roteador com RadarProvider global
export const AppRouter: React.FC = () => {
  return (
    <RadarProvider>
      <RouterProvider router={router} />
    </RadarProvider>
  );
};
