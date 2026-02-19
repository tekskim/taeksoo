import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField, InlineMessage } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceInfo {
  id: string;
  name: string;
  status?: string;
  image?: string;
  flavor?: string;
}

export interface CreateInstanceSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo | null;
  onSubmit?: (snapshotName: string, description: string) => void;
}

/* ----------------------------------------
   CreateInstanceSnapshotDrawer Component
   ---------------------------------------- */

export function CreateInstanceSnapshotDrawer({
  isOpen,
  onClose,
  instance,
  onSubmit,
}: CreateInstanceSnapshotDrawerProps) {
  const [snapshotName, setSnapshotName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && instance) {
      // Generate default snapshot name with date
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      setSnapshotName(`${instance.name}-snap-${dateStr}`);
      setDescription('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, instance]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!snapshotName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(snapshotName, description);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSnapshotName('');
    setDescription('');
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
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
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header + Instance Info + Warning Group */}
        <VStack gap={3}>
          {/* Header */}
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Create instance snapshot
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Create a snapshot of this instance to capture its current system state as an image.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <p className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">Instance</p>
            <p className="text-body-md text-[var(--color-text-default)]">{instance?.name || '-'}</p>
          </div>

          {/* Warning Message */}
          <InlineMessage variant="error">
            For data consistency, stop all write operations on the instance before creating a
            snapshot.
          </InlineMessage>
        </VStack>

        {/* Snapshot Name Input */}
        <FormField required error={hasAttemptedSubmit && !snapshotName.trim()}>
          <FormField.Label>Snapshot name</FormField.Label>
          <FormField.Control>
            <Input
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="Enter snapshot name"
              fullWidth
              error={hasAttemptedSubmit && !snapshotName.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Snapshot name is required</FormField.ErrorMessage>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-sm text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateInstanceSnapshotDrawer;
