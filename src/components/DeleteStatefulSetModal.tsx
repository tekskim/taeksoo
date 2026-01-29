import { ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface StatefulSetInfo {
  id: string;
  name: string;
}

export interface DeleteStatefulSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  statefulSet: StatefulSetInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   DeleteStatefulSetModal Component
   ---------------------------------------- */

export function DeleteStatefulSetModal({
  isOpen,
  onClose,
  statefulSet,
  onConfirm,
  isLoading = false,
}: DeleteStatefulSetModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete StatefulSet"
      description="Removing the selected instances is permanent and cannot be undone."
      infoLabel="StatefulSet name"
      infoValue={statefulSet?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteStatefulSetModal;
