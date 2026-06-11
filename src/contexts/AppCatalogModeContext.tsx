import { createContext, useContext } from 'react';

interface AppCatalogModeContextValue {
  /** true: standalone 데스크탑 앱 모드, false: Container 내 서브메뉴 모드 */
  isStandalone: boolean;
}

const AppCatalogModeContext = createContext<AppCatalogModeContextValue>({
  isStandalone: true,
});

export function useAppCatalogMode(): AppCatalogModeContextValue {
  return useContext(AppCatalogModeContext);
}

export { AppCatalogModeContext };
export default AppCatalogModeContext;
