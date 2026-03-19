import { useEffect, useId, useRef } from 'react';
import { useNavigationGuardContextOptional } from '../providers/NavigationGuardProvider';

interface UseUnsavedChangesGuardOptions {
  isDirty: boolean;
  completedCardsCount: number;
  onLeave: () => void;
  activeTabId?: string;
  showConfirmModal: () => Promise<boolean>;
}

interface UseUnsavedChangesGuardReturn {
  hasUnsavedChanges: boolean;
  handleCancelWithGuard: () => Promise<void>;
}

/**
 * 화면 이탈 시 미저장 변경사항 확인 모달을 표시하는 훅
 *
 * Cancel 버튼, 사이드바/브레드크럼 이동, 탭 닫기, 브라우저 닫기 시 동작
 */
export function useUnsavedChangesGuard({
  isDirty,
  completedCardsCount,
  onLeave,
  activeTabId,
  showConfirmModal,
}: UseUnsavedChangesGuardOptions): UseUnsavedChangesGuardReturn {
  const guardId = useId();
  const guardContext = useNavigationGuardContextOptional();

  const hasUnsavedChanges = isDirty || completedCardsCount > 0;

  const stateRef = useRef({ hasUnsavedChanges, onLeave, showConfirmModal });
  stateRef.current = { hasUnsavedChanges, onLeave, showConfirmModal };

  const guardFn = (): boolean => !stateRef.current.hasUnsavedChanges;
  const guardModal = async (): Promise<boolean> =>
    stateRef.current.showConfirmModal();

  useEffect(() => {
    if (!guardContext) return;
    guardContext.registerGuard(guardId, guardFn, guardModal, activeTabId);
    return () => guardContext.unregisterGuard(guardId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardContext, guardId, activeTabId]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent): void => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const handleCancelWithGuard = async (): Promise<void> => {
    if (stateRef.current.hasUnsavedChanges) {
      const shouldLeave = await stateRef.current.showConfirmModal();
      if (!shouldLeave) return;
    }
    stateRef.current.onLeave();
  };

  return { hasUnsavedChanges, handleCancelWithGuard };
}

export type { UseUnsavedChangesGuardOptions, UseUnsavedChangesGuardReturn };
