import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  GuardEntry,
  NavigationGuardFn,
  ShowConfirmModalFn,
} from './types';
import { NavigationGuardContext } from './NavigationGuardContext';

/**
 * 페이지/탭 전환 시점에 네비게이션을 차단하는 Provider
 *
 * 사이드바 클릭, 브레드크럼 이동, 탭 전환 등 페이지 이탈이 발생하는
 * 모든 경로에서 등록된 가드를 확인하고, 차단 조건이 충족되면
 * 확인 모달을 표시하여 사용자에게 이탈 여부를 확인합니다.
 *
 * - 탭 단위로 가드를 격리하여, 다른 탭의 가드가 간섭하지 않음
 * - 중복 모달 방지를 위한 잠금 메커니즘 내장
 */
export const NavigationGuardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const guardsRef = useRef<Map<string, GuardEntry>>(new Map());
  const activeTabIdRef = useRef('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setActiveTabId = useCallback((tabId: string) => {
    activeTabIdRef.current = tabId;
  }, []);

  const registerGuard = useCallback(
    (
      id: string,
      guard: NavigationGuardFn,
      showConfirmModal: ShowConfirmModalFn,
      tabId?: string
    ) => {
      guardsRef.current.set(id, { guard, showConfirmModal, tabId });
    },
    []
  );

  const unregisterGuard = useCallback((id: string) => {
    guardsRef.current.delete(id);
  }, []);

  const checkGuards = useCallback((): boolean => {
    const activeTabId = activeTabIdRef.current;
    for (const entry of guardsRef.current.values()) {
      if (entry.tabId && entry.tabId !== activeTabId) continue;
      if (!entry.guard()) return false;
    }
    return true;
  }, []);

  const confirmNavigation = useCallback(async (): Promise<boolean> => {
    if (isModalOpen) return false;

    const activeTabId = activeTabIdRef.current;
    for (const entry of guardsRef.current.values()) {
      if (entry.tabId && entry.tabId !== activeTabId) continue;
      if (!entry.guard()) {
        setIsModalOpen(true);
        try {
          return await entry.showConfirmModal();
        } finally {
          setIsModalOpen(false);
        }
      }
    }
    return true;
  }, [isModalOpen]);

  const value = useMemo(
    () => ({
      registerGuard,
      unregisterGuard,
      checkGuards,
      confirmNavigation,
      setActiveTabId,
      isModalOpen,
    }),
    [
      registerGuard,
      unregisterGuard,
      checkGuards,
      confirmNavigation,
      setActiveTabId,
      isModalOpen,
    ]
  );

  return (
    <NavigationGuardContext.Provider value={value}>
      {children}
    </NavigationGuardContext.Provider>
  );
};
