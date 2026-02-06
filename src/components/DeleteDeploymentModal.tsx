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
      title="Delete deployment"
      description="Removing the selected instances is permanent and cannot be undone."
      infoLabel="Deployment name"
      infoValue={deployment?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteDeploymentModal;
