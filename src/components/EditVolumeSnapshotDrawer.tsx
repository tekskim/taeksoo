import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeSnapshotInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditVolumeSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeSnapshot: VolumeSnapshotInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditVolumeSnapshotDrawer Component
   ---------------------------------------- */

export function EditVolumeSnapshotDrawer({
  isOpen,
  onClose,
  volumeSnapshot,
  onSubmit,
}: EditVolumeSnapshotDrawerProps) {
  const [snapshotName, setSnapshotName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volumeSnapshot) {
      setSnapshotName(volumeSnapshot.name);
      setDescription(volumeSnapshot.description ?? '');
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, volumeSnapshot]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!snapshotName.trim()) {
      setNameError('Snapshot name is required');
      return;
    }
    if (snapshotName.trim().length > 128) {
      setNameError('Snapshot name must be 128 characters or fewer');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(snapshotName, description);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setNameError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
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
        {/* Header */}
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
          Edit volume snapshots
        </h2>

        {/* Volume Snapshot Name Input */}
        <FormField error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Volume snapshot name</FormField.Label>
          <FormField.Control>
            <Input
              value={snapshotName}
              onChange={(e) => {
                setSnapshotName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter volume snapshot name"
              fullWidth
              error={hasAttemptedSubmit && !!nameError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-md text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. taken before applying DB patch"
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditVolumeSnapshotDrawer;
