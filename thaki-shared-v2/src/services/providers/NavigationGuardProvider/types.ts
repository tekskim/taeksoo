export type NavigationGuardFn = () => boolean;
export type ShowConfirmModalFn = () => Promise<boolean>;

export interface NavigationGuardContextType {
  registerGuard: (
    id: string,
    guard: NavigationGuardFn,
    showConfirmModal: ShowConfirmModalFn,
    tabId?: string
  ) => void;
  unregisterGuard: (id: string) => void;
  checkGuards: () => boolean;
  confirmNavigation: () => Promise<boolean>;
  setActiveTabId: (tabId: string) => void;
  isModalOpen: boolean;
}

export interface GuardEntry {
  guard: NavigationGuardFn;
  showConfirmModal: ShowConfirmModalFn;
  tabId?: string;
}
