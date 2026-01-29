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
      description="Removing the selected instances is permanent and cannot be undone."
      infoLabel="Job name"
      infoValue={job?.name ?? ''}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}

export default DeleteJobModal;
