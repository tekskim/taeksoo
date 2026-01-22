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
      title="Delete CronJob"
      description="Are you sure you want to delete this cron job? This action cannot be undone."
      infoLabel="CronJob name"
      infoValue={cronJob?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="primary"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteCronJobModal;
