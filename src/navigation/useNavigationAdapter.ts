import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useRadar } from '../context/RadarContext';
import { 
  ROUTES, 
  VIEW_TO_PATH_MAP, 
  PATH_TO_VIEW_MAP, 
  getOrganizacaoDetailRoute, 
  isOrganizacaoDetailRoute,
  getVerticalDetailRoute,
  isVerticalDetailRoute,
  getPainDetailRoute,
  isPainDetailRoute
} from './routeMap';

/**
 * useNavigationAdapter
 * 
 * Camada de compatibilidade bidirecional entre o estado legado (activeView)
 * e o TanStack Router (Etapa 1C + Etapa 2A + Etapa 2B + Etapa 2C).
 * 
 * Garante:
 * 1. activeView -> URL: quando a UI legada chama setActiveView(), a URL correspondente é atualizada.
 *    Para 'organizacao-detail', direciona para /organizacoes/:orgId.
 *    Para 'vertical-detail', direciona para /verticais/:verticalId.
 *    Para 'dor-detail', direciona para /dores/:painId.
 * 2. URL -> activeView: quando uma rota canônica ou dinâmica (/organizacoes/:orgId, /verticais/:verticalId, /dores/:painId) é acessada diretamente
 *    ou via histórico (Back/Forward), o activeView e os IDs selecionados são sincronizados.
 * 3. Prevenção estrita de loops de navegação via verificação de estado e flag de rastreio de origem.
 */
export function useNavigationAdapter() {
  const { 
    activeView, 
    setActiveView, 
    selectedOrgId, 
    setSelectedOrgId,
    selectedVerticalId,
    setSelectedVerticalId,
    selectedPainId,
    setSelectedPainId
  } = useRadar();
  const location = useLocation();
  const navigate = useNavigate();

  // Rastreia o último pathname processado (inicia vazio para processar a rota inicial no mount)
  const lastPathnameRef = useRef<string>('');
  // Rastreia se a navegação foi disparada pelo setActiveView para evitar re-gatilho
  const isNavigatingFromActiveViewRef = useRef<boolean>(false);

  // 1. Sincronização URL -> activeView (navegação externa, Back/Forward do browser, etc.)
  useEffect(() => {
    const currentPath = location.pathname;

    // Se esta alteração de URL foi originada por setActiveView, absorvemos e não re-sincronizamos
    if (isNavigatingFromActiveViewRef.current) {
      isNavigatingFromActiveViewRef.current = false;
      lastPathnameRef.current = currentPath;
      return;
    }

    // Se o pathname não mudou, nada a fazer
    if (currentPath === lastPathnameRef.current) {
      return;
    }

    lastPathnameRef.current = currentPath;

    // Caso especial da Etapa 2A: Rota dinâmica /organizacoes/:orgId
    const orgDetailMatch = currentPath.match(/^\/organizacoes\/([^/]+)$/);
    if (orgDetailMatch) {
      const routeOrgId = decodeURIComponent(orgDetailMatch[1]);
      // Sincronização temporária de selectedOrgId para compatibilidade transitória com fluxos legados
      if (selectedOrgId !== routeOrgId) {
        setSelectedOrgId(routeOrgId);
      }
      if (activeView !== 'organizacao-detail') {
        setActiveView('organizacao-detail');
      }
      return;
    }

    // Caso especial da Etapa 2B: Rota dinâmica /verticais/:verticalId
    const verticalDetailMatch = currentPath.match(/^\/verticais\/([^/]+)$/);
    if (verticalDetailMatch) {
      const routeVerticalId = decodeURIComponent(verticalDetailMatch[1]);
      // Sincronização temporária de selectedVerticalId para compatibilidade transitória com fluxos legados
      if (selectedVerticalId !== routeVerticalId) {
        setSelectedVerticalId(routeVerticalId);
      }
      if (activeView !== 'vertical-detail') {
        setActiveView('vertical-detail');
      }
      return;
    }

    // Caso especial da Etapa 2C: Rota dinâmica /dores/:painId
    const painDetailMatch = currentPath.match(/^\/dores\/([^/]+)$/);
    if (painDetailMatch) {
      const routePainId = decodeURIComponent(painDetailMatch[1]);
      // Sincronização temporária de selectedPainId para compatibilidade transitória com fluxos legados
      if (selectedPainId !== routePainId) {
        setSelectedPainId(routePainId);
      }
      if (activeView !== 'dor-detail') {
        setActiveView('dor-detail');
      }
      return;
    }

    const targetView = PATH_TO_VIEW_MAP[currentPath];

    if (targetView) {
      // Regra da Etapa 2A: Para Organização, a URL distingue /organizacoes (lista) de /organizacoes/:orgId (detalhe).
      // Se a URL for /organizacoes, a view deve ser inequivocamente 'organizacoes', sem preservar 'organizacao-detail'.
      if (currentPath === ROUTES.ORGANIZACOES) {
        if (activeView !== 'organizacoes') {
          setActiveView('organizacoes');
        }
        return;
      }

      // Regra da Etapa 2B: Para Vertical, a URL distingue /verticais (lista) de /verticais/:verticalId (detalhe).
      // Se a URL for /verticais, a view deve ser inequivocamente 'verticais', sem preservar 'vertical-detail'.
      if (currentPath === ROUTES.VERTICAIS) {
        if (activeView !== 'verticais') {
          setActiveView('verticais');
        }
        return;
      }

      // Regra da Etapa 2C: Para Dor, a URL distingue /dores (lista) de /dores/:painId (detalhe).
      // Se a URL for /dores, a view deve ser inequivocamente 'dores', sem preservar 'dor-detail'.
      if (currentPath === ROUTES.DORES) {
        if (activeView !== 'dores') {
          setActiveView('dores');
        }
        return;
      }

      // Se a view atual já mapeia para o mesmo caminho (ex.: 'oportunidade-detail' mapeia para '/oportunidades'),
      // preservamos a sub-view do usuário para entidades ainda não migradas
      const currentViewMappedPath = VIEW_TO_PATH_MAP[activeView];
      if (currentViewMappedPath !== currentPath) {
        setActiveView(targetView);
      }
    }
  }, [location.pathname, activeView, setActiveView, selectedOrgId, setSelectedOrgId, selectedVerticalId, setSelectedVerticalId, selectedPainId, setSelectedPainId]);

  // 2. Sincronização activeView -> URL (quando a UI legada invoca setActiveView)
  useEffect(() => {
    const currentPath = location.pathname;

    // Caso especial da Etapa 2A: quando o activeView for 'organizacao-detail'
    if (activeView === 'organizacao-detail') {
      // Se a URL já for uma rota de detalhe de organização, não reduza para /organizacoes
      if (isOrganizacaoDetailRoute(currentPath)) {
        return;
      }
      // Se acionado por fluxo legado (ex: Guided Journey), navega para a URL com selectedOrgId
      const targetPath = getOrganizacaoDetailRoute(selectedOrgId);
      if (targetPath !== currentPath) {
        lastPathnameRef.current = targetPath;
        isNavigatingFromActiveViewRef.current = true;
        navigate({ to: targetPath as any });
      }
      return;
    }

    // Caso especial da Etapa 2B: quando o activeView for 'vertical-detail'
    if (activeView === 'vertical-detail') {
      // Se a URL já for uma rota de detalhe de vertical, não reduza para /verticais
      if (isVerticalDetailRoute(currentPath)) {
        return;
      }
      // Se acionado por fluxo legado (ex: Guided Journey), navega para a URL com selectedVerticalId
      const targetPath = getVerticalDetailRoute(selectedVerticalId);
      if (targetPath !== currentPath) {
        lastPathnameRef.current = targetPath;
        isNavigatingFromActiveViewRef.current = true;
        navigate({ to: targetPath as any });
      }
      return;
    }

    // Caso especial da Etapa 2C: quando o activeView for 'dor-detail'
    if (activeView === 'dor-detail') {
      // Se a URL já for uma rota de detalhe de dor, não reduza para /dores
      if (isPainDetailRoute(currentPath)) {
        return;
      }
      // Se acionado por fluxo legado (ex: Guided Journey), navega para a URL com selectedPainId
      const targetPath = getPainDetailRoute(selectedPainId);
      if (targetPath !== currentPath) {
        lastPathnameRef.current = targetPath;
        isNavigatingFromActiveViewRef.current = true;
        navigate({ to: targetPath as any });
      }
      return;
    }

    const targetPath = VIEW_TO_PATH_MAP[activeView];

    if (targetPath && targetPath !== currentPath) {
      lastPathnameRef.current = targetPath;
      isNavigatingFromActiveViewRef.current = true;
      navigate({ to: targetPath as any });
    }
  }, [activeView, selectedOrgId, selectedVerticalId, selectedPainId, location.pathname, navigate]);
}
