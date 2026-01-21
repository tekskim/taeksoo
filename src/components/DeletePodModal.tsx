import { ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface PodInfo {
  id: string;
  name: string;
}

export interface DeletePodModalProps {
  isOpen: boolean;
  onClose: () => void;
  pod: PodInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   DeletePodModal Component
   ---------------------------------------- */

export function DeletePodModal({
  isOpen,
  onClose,
  pod,
  onConfirm,
  isLoading = false,
}: DeletePodModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Pod"
      description="Are you sure you want to delete this pod?"
      infoLabel="Pod name"
      infoValue={pod?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="primary"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeletePodModal;
