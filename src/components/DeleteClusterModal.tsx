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
      description="Are you sure you want to delete this cluster?"
      infoLabel="Cluster name"
      infoValue={cluster?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="primary"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteClusterModal;
