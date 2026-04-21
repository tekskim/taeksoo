import { useState, useEffect } from 'react';
import { Drawer, Button, Radio, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface UpdateSnapshotStatusInfo {
  id: string;
  name: string;
  currentStatus: string;
}

export interface UpdateSnapshotStatusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: UpdateSnapshotStatusInfo | null;
  onSubmit?: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'error', label: 'Error' },
];

/* ----------------------------------------
   UpdateSnapshotStatusDrawer Component
   ---------------------------------------- */

export function UpdateSnapshotStatusDrawer({
  isOpen,
  onClose,
  snapshot,
  onSubmit,
}: UpdateSnapshotStatusDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus('');
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setStatusError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedStatus) {
      setStatusError('Please select a status.');
      return;
    }
    setStatusError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedStatus);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setStatusError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Update status"
      description="The status of a volume snapshot is normally managed automatically, but an administrator may need to update the status value manually."
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <InfoBox.Group>
          <InfoBox label="Volume snapshot" value={snapshot?.name ?? '-'} />
          <InfoBox label="Current status" value={snapshot?.currentStatus ?? '-'} />
        </InfoBox.Group>

        <FormField
          label="Status"
          description="Select the administrative status to apply to the volume snapshot."
          required
          error={hasAttemptedSubmit && !!statusError}
          errorMessage={hasAttemptedSubmit && statusError ? statusError : undefined}
          spacing="loose"
        >
          <VStack gap={2}>
            {STATUS_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                name="snapshot-status"
                value={option.value}
                label={option.label}
                checked={selectedStatus === option.value}
                onChange={() => {
                  setSelectedStatus(option.value);
                  if (statusError) setStatusError(null);
                }}
              />
            ))}
          </VStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default UpdateSnapshotStatusDrawer;
