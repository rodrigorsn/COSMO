import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useRadar } from '../context/RadarContext';
import { VIEW_TO_PATH_MAP, PATH_TO_VIEW_MAP } from './routeMap';

/**
 * useNavigationAdapter
 * 
 * Camada de compatibilidade bidirecional da Etapa 1C entre o estado legado (activeView)
 * e as rotas principais do TanStack Router.
 * 
 * Garante:
 * 1. activeView -> URL: quando a UI legada chama setActiveView(), a URL correspondente é atualizada.
 * 2. URL -> activeView: quando uma rota principal é acessada diretamente ou via histórico (Back/Forward),
 *    o activeView é sincronizado com a tela correspondente.
 * 3. Prevenção estrita de loops de navegação via verificação de estado e flag de rastreio de origem.
 */
export function useNavigationAdapter() {
  const { activeView, setActiveView } = useRadar();
  const location = useLocation();
  const navigate = useNavigate();

  // Rastreia o último pathname processado
  const lastPathnameRef = useRef<string>(location.pathname);
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
    const targetView = PATH_TO_VIEW_MAP[currentPath];

    if (targetView) {
      // Se a view atual já mapeia para o mesmo caminho (ex.: 'dor-detail' mapeia para '/dores'),
      // preservamos a sub-view do usuário
      const currentViewMappedPath = VIEW_TO_PATH_MAP[activeView];
      if (currentViewMappedPath !== currentPath) {
        setActiveView(targetView);
      }
    }
  }, [location.pathname, activeView, setActiveView]);

  // 2. Sincronização activeView -> URL (quando a UI legada invoca setActiveView)
  useEffect(() => {
    const targetPath = VIEW_TO_PATH_MAP[activeView];
    const currentPath = location.pathname;

    if (targetPath && targetPath !== currentPath) {
      lastPathnameRef.current = targetPath;
      isNavigatingFromActiveViewRef.current = true;
      navigate({ to: targetPath as any });
    }
  }, [activeView, location.pathname, navigate]);
}
