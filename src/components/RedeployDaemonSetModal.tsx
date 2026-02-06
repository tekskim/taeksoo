import { Modal, Button } from '@/design-system';
import { IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DaemonSetInfo {
  id: string;
  name: string;
}

export interface RedeployDaemonSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  daemonSet: DaemonSetInfo | null;
  onConfirm?: () => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   RedeployDaemonSetModal Component
   ---------------------------------------- */

export function RedeployDaemonSetModal({
  isOpen,
  onClose,
  daemonSet,
  onConfirm,
  isLoading = false,
}: RedeployDaemonSetModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Redeploy daemonSet"
      description="This action redeploys the daemon set."
      size="sm"
    >
      {/* Info Box */}
      <div className="flex flex-col gap-2">
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
          <span className="text-label-sm text-[var(--color-text-subtle)]">DaemonSet name</span>
          <span className="text-body-md text-[var(--color-text-default)]">
            {daemonSet?.name ?? ''}
          </span>
        </div>

        {/* Warning Alert */}
        <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
          <IconAlertCircle
            size={16}
            className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
            stroke={1.5}
          />
          <p className="text-body-sm text-[var(--color-text-default)] leading-4">
            Redeploying will restart the selected workloads and may cause temporary downtime.
          </p>
        </div>
      </div>

      {/* Button Group */}
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          size="md"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleConfirm}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Processing...' : 'Redeploy'}
        </Button>
      </div>
    </Modal>
  );
}

export default RedeployDaemonSetModal;
