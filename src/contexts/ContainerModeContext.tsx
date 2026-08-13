import { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type ContainerMode =
  | 'default'
  | 'aegis-container'
  | 'metis-container'
  | 'container-platform';

interface ContainerModeContextValue {
  mode: ContainerMode;
  isMetis: boolean;
  /** Merged Container Platform (D-26): Aegis UI + registered clusters + managed-by, no App Catalog. */
  isPlatform: boolean;
}

const ContainerModeContext = createContext<ContainerModeContextValue>({
  mode: 'default',
  isMetis: false,
  isPlatform: false,
});

export function useContainerMode(): ContainerModeContextValue {
  return useContext(ContainerModeContext);
}

const MODE_STORAGE_KEY = 'thaki:container-mode';

function isSelectableMode(value: string | null): value is ContainerMode {
  return (
    value === 'metis-container' || value === 'aegis-container' || value === 'container-platform'
  );
}

function readRememberedMode(): ContainerMode | null {
  try {
    const stored = sessionStorage.getItem(MODE_STORAGE_KEY);
    return isSelectableMode(stored) ? stored : null;
  } catch {
    return null;
  }
}

function rememberMode(mode: ContainerMode) {
  try {
    sessionStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // 시크릿 창 등에서 저장이 막히면 이번 화면에서만 모드가 유지된다.
  }
}

/**
 * Standalone(데스크톱 창 외부) 접근 시 URL 쿼리로 컨테이너 모드를 지정한다.
 * 예: /container/dashboard?mode=metis-container
 * DesktopPage는 자체 Provider로 감싸므로(앱 실행 흐름) 그 안에서는 이 값이 무시된다.
 *
 * 앱 안에서 화면을 옮기는 navigate 호출은 대부분 주소만 넘기고 쿼리를 떼어낸다.
 * 그래서 처음 들어온 모드를 탭 단위로 기억해 두고, 주소에 모드가 없으면 그것을 쓴다.
 * 진입 화면의 앱 카드는 셋 다 모드를 붙여 들어오므로 다른 앱으로 옮기면 값이 덮인다.
 */
export function ContainerModeFromUrlProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get('mode');
  const modeFromUrl = isSelectableMode(raw) ? raw : null;
  if (modeFromUrl) {
    rememberMode(modeFromUrl);
  }
  const mode: ContainerMode = modeFromUrl ?? readRememberedMode() ?? 'default';
  const value = useMemo(
    () => ({
      mode,
      isMetis: mode === 'metis-container',
      isPlatform: mode === 'container-platform',
    }),
    [mode]
  );
  return <ContainerModeContext.Provider value={value}>{children}</ContainerModeContext.Provider>;
}

export { ContainerModeContext };
export default ContainerModeContext;
