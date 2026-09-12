/**
 * Rotas canônicas principais do COSMO (Fonte única de verdade).
 */
export const ROUTES = {
  DASHBOARD: '/',
  VERTICAIS: '/verticais',
  VERTICAL_DETAIL: '/verticais/$verticalId',
  ORGANIZACOES: '/organizacoes',
  ORGANIZACAO_DETAIL: '/organizacoes/$orgId',
  ENTREVISTAS: '/entrevistas',
  INTERVIEW_DETAIL: '/entrevistas/$interviewId',
  DORES: '/dores',
  PAIN_DETAIL: '/dores/$painId',
  OPORTUNIDADES: '/oportunidades',
  OPORTUNITY_DETAIL: '/oportunidades/$opportunityId',
  RANKING: '/ranking',
  PERGUNTAS: '/perguntas',
  FONTES: '/fontes',
  CROSS_VERTICAL: '/cross-vertical',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

/**
 * Constrói o caminho canônico para o detalhe de uma oportunidade.
 */
export function getOpportunityDetailRoute(opportunityId: string): string {
  return `/oportunidades/${encodeURIComponent(opportunityId)}`;
}

/**
 * Verifica se um caminho corresponde ao detalhe de oportunidade (/oportunidades/:opportunityId).
 */
export function isOpportunityDetailRoute(pathname: string): boolean {
  return /^\/oportunidades\/[^/]+$/.test(pathname);
}

/**
 * Constrói o caminho canônico para a condução de uma entrevista.
 */
export function getInterviewDetailRoute(interviewId: string): string {
  return `/entrevistas/${encodeURIComponent(interviewId)}`;
}

/**
 * Verifica se um caminho corresponde ao detalhe/condução de entrevista (/entrevistas/:interviewId).
 */
export function isInterviewDetailRoute(pathname: string): boolean {
  return /^\/entrevistas\/[^/]+$/.test(pathname);
}

/**
 * Constrói o caminho canônico para o detalhe de uma vertical.
 */
export function getVerticalDetailRoute(verticalId: string): string {
  return `/verticais/${encodeURIComponent(verticalId)}`;
}

/**
 * Verifica se um caminho corresponde ao detalhe de vertical (/verticais/:verticalId).
 */
export function isVerticalDetailRoute(pathname: string): boolean {
  return /^\/verticais\/[^/]+$/.test(pathname);
}

/**
 * Constrói o caminho canônico para o detalhe de uma organização.
 */
export function getOrganizacaoDetailRoute(orgId: string): string {
  return `/organizacoes/${encodeURIComponent(orgId)}`;
}

/**
 * Verifica se um caminho corresponde ao detalhe de organização (/organizacoes/:orgId).
 */
export function isOrganizacaoDetailRoute(pathname: string): boolean {
  return /^\/organizacoes\/[^/]+$/.test(pathname);
}

/**
 * Constrói o caminho canônico para o detalhe de uma dor consolidada.
 */
export function getPainDetailRoute(painId: string): string {
  return `/dores/${encodeURIComponent(painId)}`;
}

/**
 * Verifica se um caminho corresponde ao detalhe de dor consolidada (/dores/:painId).
 */
export function isPainDetailRoute(pathname: string): boolean {
  return /^\/dores\/[^/]+$/.test(pathname);
}


