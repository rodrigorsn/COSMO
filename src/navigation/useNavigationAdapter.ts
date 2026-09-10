import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useRadar } from '../context/RadarContext';
import { VIEW_TO_PATH_MAP, PATH_TO_VIEW_MAP, getOrganizacaoDetailRoute, isOrganizacaoDetailRoute } from './routeMap';

/**
 * useNavigationAdapter
 * 
 * Camada de compatibilidade bidirecional entre o estado legado (activeView)
 * e o TanStack Router (Etapa 1C + Etapa 2A).
 * 
 * Garante:
 * 1. activeView -> URL: quando a UI legada chama setActiveView(), a URL correspondente é atualizada.
 *    Para 'organizacao-detail', direciona para /organizacoes/:orgId (usando selectedOrgId transitório).
 * 2. URL -> activeView: quando uma rota canônica ou dinâmica (/organizacoes/:orgId) é acessada diretamente
 *    ou via histórico (Back/Forward), o activeView e o selectedOrgId são sincronizados.
 * 3. Prevenção estrita de loops de navegação via verificação de estado e flag de rastreio de origem.
 */
export function useNavigationAdapter() {
  const { activeView, setActiveView, selectedOrgId, setSelectedOrgId } = useRadar();
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

    const targetView = PATH_TO_VIEW_MAP[currentPath];

    if (targetView) {
      // Se a view atual já mapeia para o mesmo caminho (ex.: 'dor-detail' mapeia para '/dores'),
      // preservamos a sub-view do usuário
      const currentViewMappedPath = VIEW_TO_PATH_MAP[activeView];
      if (currentViewMappedPath !== currentPath) {
        setActiveView(targetView);
      }
    }
  }, [location.pathname, activeView, setActiveView, selectedOrgId, setSelectedOrgId]);

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

    const targetPath = VIEW_TO_PATH_MAP[activeView];

    if (targetPath && targetPath !== currentPath) {
      lastPathnameRef.current = targetPath;
      isNavigatingFromActiveViewRef.current = true;
      navigate({ to: targetPath as any });
    }
  }, [activeView, selectedOrgId, location.pathname, navigate]);
}
