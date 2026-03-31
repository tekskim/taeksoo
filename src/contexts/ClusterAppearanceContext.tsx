import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface ClusterAppearance {
  iconText: string;
}

interface ClusterAppearanceContextType {
  getAppearance: (clusterId: string) => ClusterAppearance;
  saveAppearance: (clusterId: string, appearance: ClusterAppearance) => void;
}

const STORAGE_KEY = 'cluster-appearance';

function readStorage(): Record<string, ClusterAppearance> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const ClusterAppearanceContext = createContext<ClusterAppearanceContextType | null>(null);

export function ClusterAppearanceProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Record<string, ClusterAppearance>>(readStorage);

  const getAppearance = useCallback(
    (clusterId: string): ClusterAppearance => {
      return store[clusterId] ?? { iconText: '' };
    },
    [store]
  );

  const saveAppearance = useCallback((clusterId: string, appearance: ClusterAppearance) => {
    setStore((prev) => {
      const next = { ...prev, [clusterId]: appearance };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  return (
    <ClusterAppearanceContext.Provider value={{ getAppearance, saveAppearance }}>
      {children}
    </ClusterAppearanceContext.Provider>
  );
}

export function useClusterAppearanceContext(): ClusterAppearanceContextType {
  const ctx = useContext(ClusterAppearanceContext);
  if (!ctx) {
    throw new Error('useClusterAppearanceContext must be used within ClusterAppearanceProvider');
  }
  return ctx;
}
