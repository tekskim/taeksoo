import { ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CronJobInfo {
  id: string;
  name: string;
}

export interface DeleteCronJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  cronJob: CronJobInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   DeleteCronJobModal Component
   ---------------------------------------- */

export function DeleteCronJobModal({
  isOpen,
  onClose,
  cronJob,
  onConfirm,
  isLoading = false,
}: DeleteCronJobModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete cronjob"
      description="Removing the selected instances is permanent and cannot be undone."
      infoLabel="CronJob name"
      infoValue={cronJob?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteCronJobModal;
