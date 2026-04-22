import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface AppCatalogModeContextValue {
  isStandalone: boolean;
}

const AppCatalogModeContext = createContext<AppCatalogModeContextValue>({ isStandalone: false });

export function AppCatalogModeProvider({ children }: { children: ReactNode }) {
  return (
    <AppCatalogModeContext.Provider value={{ isStandalone: true }}>
      {children}
    </AppCatalogModeContext.Provider>
  );
}

export function useAppCatalogMode() {
  return useContext(AppCatalogModeContext);
}
