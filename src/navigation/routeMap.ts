import { ActiveView } from '../context/RadarContext';

/**
 * Rotas canônicas principais do COSMO (Fonte única de verdade).
 */
export const ROUTES = {
  DASHBOARD: '/',
  VERTICAIS: '/verticais',
  ORGANIZACOES: '/organizacoes',
  ENTREVISTAS: '/entrevistas',
  DORES: '/dores',
  OPORTUNIDADES: '/oportunidades',
  RANKING: '/ranking',
  PERGUNTAS: '/perguntas',
  FONTES: '/fontes',
  CROSS_VERTICAL: '/cross-vertical',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

/**
 * Mapeamento central único entre os valores de ActiveView e as rotas principais do COSMO.
 * Fonte única de verdade para a sincronização bidirecional.
 */
export const VIEW_TO_PATH_MAP: Record<ActiveView, string> = {
  'dashboard': ROUTES.DASHBOARD,
  'verticais': ROUTES.VERTICAIS,
  'vertical-detail': ROUTES.VERTICAIS,
  'organizacoes': ROUTES.ORGANIZACOES,
  'organizacao-detail': ROUTES.ORGANIZACOES,
  'entrevistas': ROUTES.ENTREVISTAS,
  'dores': ROUTES.DORES,
  'dor-detail': ROUTES.DORES,
  'oportunidades': ROUTES.OPORTUNIDADES,
  'oportunidade-detail': ROUTES.OPORTUNIDADES,
  'ranking': ROUTES.RANKING,
  'perguntas': ROUTES.PERGUNTAS,
  'fontes': ROUTES.FONTES,
  'concorrentes': ROUTES.FONTES,
  'fontes-concorrentes': ROUTES.FONTES,
  'cross-vertical': ROUTES.CROSS_VERTICAL,
};

/**
 * Mapeamento das 10 rotas principais canônicas para a ActiveView inicial correspondente.
 */
export const PATH_TO_VIEW_MAP: Record<string, ActiveView> = {
  [ROUTES.DASHBOARD]: 'dashboard',
  [ROUTES.VERTICAIS]: 'verticais',
  [ROUTES.ORGANIZACOES]: 'organizacoes',
  [ROUTES.ENTREVISTAS]: 'entrevistas',
  [ROUTES.DORES]: 'dores',
  [ROUTES.OPORTUNIDADES]: 'oportunidades',
  [ROUTES.RANKING]: 'ranking',
  [ROUTES.PERGUNTAS]: 'perguntas',
  [ROUTES.FONTES]: 'fontes',
  [ROUTES.CROSS_VERTICAL]: 'cross-vertical',
};

export const MAIN_ROUTES = Object.keys(PATH_TO_VIEW_MAP);

export function isMainRoute(pathname: string): boolean {
  return Object.prototype.hasOwnProperty.call(PATH_TO_VIEW_MAP, pathname);
}
