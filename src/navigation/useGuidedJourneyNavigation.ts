import { useNavigate } from '@tanstack/react-router';
import { useRadar } from '../context/RadarContext';
import { 
  ROUTES, 
  getVerticalDetailRoute, 
  getOrganizacaoDetailRoute, 
  getInterviewDetailRoute, 
  getOpportunityDetailRoute 
} from './routeMap';

/**
 * Retorna o caminho canônico da URL para cada um dos 18 passos da Guided Journey (PRD Seção 81).
 */
export function getJourneyStepRoute(step: number): string {
  switch (step) {
    case 1:
      return ROUTES.DASHBOARD;
    case 2:
    case 13:
    case 14:
      return getVerticalDetailRoute('VERT-CONT');
    case 3:
      return ROUTES.ORGANIZACOES;
    case 4:
    case 5:
    case 6:
    case 12:
      return getOrganizacaoDetailRoute('ORG-CONT-001');
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      return getInterviewDetailRoute('INT-002');
    case 15:
    case 16:
    case 17:
      return getOpportunityDetailRoute('OP-CONT-001');
    case 18:
      return ROUTES.RANKING;
    default:
      return ROUTES.DASHBOARD;
  }
}

/**
 * Hook de UI/Navegação para a Guided Journey.
 * Atualiza o número do passo no RadarContext e navega fisicamente para a URL canônica correspondente.
 */
export function useGuidedJourneyNavigation() {
  const { currentJourneyStep, jumpToJourneyStep: setStepContext } = useRadar();
  const navigate = useNavigate();

  const jumpToJourneyStep = (step: number) => {
    // 1. Atualiza a progressão pedagógica da Journey no contexto de domínio
    setStepContext(step);

    // 2. Navega fisicamente para a URL canônica do TanStack Router
    const targetRoute = getJourneyStepRoute(step);
    navigate({ to: targetRoute as any });
  };

  return {
    currentJourneyStep,
    jumpToJourneyStep
  };
}
