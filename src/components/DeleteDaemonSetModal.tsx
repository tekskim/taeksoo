import { ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DaemonSetInfo {
  id: string;
  name: string;
}

export interface DeleteDaemonSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  daemonSet: DaemonSetInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   DeleteDaemonSetModal Component
   ---------------------------------------- */

export function DeleteDaemonSetModal({
  isOpen,
  onClose,
  daemonSet,
  onConfirm,
  isLoading = false,
}: DeleteDaemonSetModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete DaemonSet"
      description="Removing the selected instances is permanent and cannot be undone."
      infoLabel="DaemonSet name"
      infoValue={daemonSet?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteDaemonSetModal;
