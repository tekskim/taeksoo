import { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type ContainerMode = 'default' | 'aegis-container' | 'metis-container';

interface ContainerModeContextValue {
  mode: ContainerMode;
  isMetis: boolean;
}

const ContainerModeContext = createContext<ContainerModeContextValue>({
  mode: 'default',
  isMetis: false,
});

export function useContainerMode(): ContainerModeContextValue {
  return useContext(ContainerModeContext);
}

/**
 * Standalone(데스크톱 창 외부) 접근 시 URL 쿼리로 컨테이너 모드를 지정한다.
 * 예: /container/dashboard?mode=metis-container
 * DesktopPage는 자체 Provider로 감싸므로(앱 실행 흐름) 그 안에서는 이 값이 무시된다.
 */
export function ContainerModeFromUrlProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get('mode');
  const mode: ContainerMode =
    raw === 'metis-container' || raw === 'aegis-container' ? raw : 'default';
  const value = useMemo(() => ({ mode, isMetis: mode === 'metis-container' }), [mode]);
  return <ContainerModeContext.Provider value={value}>{children}</ContainerModeContext.Provider>;
}

export { ContainerModeContext };
export default ContainerModeContext;
