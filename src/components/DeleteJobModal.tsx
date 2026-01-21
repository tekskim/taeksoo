import { ConfirmModal } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface JobInfo {
  id: string;
  name: string;
}

export interface DeleteJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   DeleteJobModal Component
   ---------------------------------------- */

export function DeleteJobModal({
  isOpen,
  onClose,
  job,
  onConfirm,
  isLoading = false,
}: DeleteJobModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Job"
      description="Are you sure you want to delete this job?"
      infoLabel="Job name"
      infoValue={job?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="primary"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteJobModal;
