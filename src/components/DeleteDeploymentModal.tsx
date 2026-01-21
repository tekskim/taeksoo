import { ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DeploymentInfo {
  id: string;
  name: string;
}

export interface DeleteDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  deployment: DeploymentInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   DeleteDeploymentModal Component
   ---------------------------------------- */

export function DeleteDeploymentModal({
  isOpen,
  onClose,
  deployment,
  onConfirm,
  isLoading = false,
}: DeleteDeploymentModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Deployment"
      description="Are you sure you want to delete this deployment?"
      infoLabel="Deployment name"
      infoValue={deployment?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="primary"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteDeploymentModal;
