import { ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ClusterInfo {
  id: string;
  name: string;
}

export interface DeleteClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cluster: ClusterInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   DeleteClusterModal Component
   ---------------------------------------- */

export function DeleteClusterModal({
  isOpen,
  onClose,
  cluster,
  onConfirm,
  isLoading = false,
}: DeleteClusterModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Cluster"
      description="Removing the selected instances is permanent and cannot be undone."
      infoLabel="Cluster name"
      infoValue={cluster?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteClusterModal;
