import { useState } from 'react';
import { Modal, Button, Select } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DeploymentInfo {
  id: string;
  name: string;
}

export interface RevisionOption {
  value: string;
  label: string;
}

export interface RollBackDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  deployment: DeploymentInfo | null;
  revisions?: RevisionOption[];
  onConfirm?: (revisionId: string) => void;
  isLoading?: boolean;
}

/* ----------------------------------------
   Default Revisions
   ---------------------------------------- */

const defaultRevisions: RevisionOption[] = [
  { value: 'rev-2', label: 'Revision2, created at 2025. 11. 12 5:27:00 pm (current)' },
  { value: 'rev-1', label: 'Revision1, created at 2025. 11. 11 4:16:59 pm' },
];

/* ----------------------------------------
   RollBackDeploymentModal Component
   ---------------------------------------- */

export function RollBackDeploymentModal({
  isOpen,
  onClose,
  deployment,
  revisions = defaultRevisions,
  onConfirm,
  isLoading = false,
}: RollBackDeploymentModalProps) {
  const [selectedRevision, setSelectedRevision] = useState<string>('');

  const handleConfirm = () => {
    if (selectedRevision) {
      onConfirm?.(selectedRevision);
    }
  };

  const handleClose = () => {
    setSelectedRevision('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Roll Back Deployment"
      description="Are you sure you want to roll back this deployment? This action rolls back the deployment to a previous version."
      size="sm"
    >
      {/* Info Box and Select */}
      <div className="flex flex-col gap-2">
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] font-medium leading-4">
            Deployment name
          </span>
          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] leading-4">
            {deployment?.name ?? ''}
          </span>
        </div>

        {/* Revision Select */}
        <Select
          options={revisions}
          value={selectedRevision}
          onChange={setSelectedRevision}
          placeholder="Choose a Revision"
          fullWidth
        />
      </div>

      {/* Button Group */}
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          size="md"
          onClick={handleClose}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleConfirm}
          disabled={isLoading || !selectedRevision}
          className="flex-1"
        >
          {isLoading ? 'Processing...' : 'Roll Back'}
        </Button>
      </div>
    </Modal>
  );
}

export default RollBackDeploymentModal;
