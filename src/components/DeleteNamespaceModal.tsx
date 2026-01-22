import { ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NamespaceInfo {
  id: string;
  name: string;
}

export interface DeleteNamespaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  namespace: NamespaceInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   DeleteNamespaceModal Component
   ---------------------------------------- */

export function DeleteNamespaceModal({
  isOpen,
  onClose,
  namespace,
  onConfirm,
  isLoading = false,
}: DeleteNamespaceModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Namespace"
      description="Are you sure you want to delete this namespace? This action cannot be undone."
      infoLabel="Namespace name"
      infoValue={namespace?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="primary"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteNamespaceModal;
