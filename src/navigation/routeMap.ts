import { ActiveView } from '../context/RadarContext';

/**
 * Mapeamento central único entre os valores de ActiveView e as rotas principais do COSMO.
 * Fonte única de verdade para a sincronização bidirecional da Etapa 1C.
 */
export const VIEW_TO_PATH_MAP: Record<ActiveView, string> = {
  'dashboard': '/',
  'verticais': '/verticais',
  'vertical-detail': '/verticais',
  'organizacoes': '/organizacoes',
  'organizacao-detail': '/organizacoes',
  'entrevistas': '/entrevistas',
  'dores': '/dores',
  'dor-detail': '/dores',
  'oportunidades': '/oportunidades',
  'oportunidade-detail': '/oportunidades',
  'ranking': '/ranking',
  'perguntas': '/perguntas',
  'fontes': '/fontes',
  'concorrentes': '/fontes',
  'fontes-concorrentes': '/fontes',
  'cross-vertical': '/cross-vertical',
};

/**
 * Mapeamento das 10 rotas principais canônicas para a ActiveView inicial correspondente.
 */
export const PATH_TO_VIEW_MAP: Record<string, ActiveView> = {
  '/': 'dashboard',
  '/verticais': 'verticais',
  '/organizacoes': 'organizacoes',
  '/entrevistas': 'entrevistas',
  '/dores': 'dores',
  '/oportunidades': 'oportunidades',
  '/ranking': 'ranking',
  '/perguntas': 'perguntas',
  '/fontes': 'fontes',
  '/cross-vertical': 'cross-vertical',
};

export const MAIN_ROUTES = Object.keys(PATH_TO_VIEW_MAP);

export function isMainRoute(pathname: string): boolean {
  return Object.prototype.hasOwnProperty.call(PATH_TO_VIEW_MAP, pathname);
}
