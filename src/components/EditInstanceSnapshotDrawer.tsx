import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceSnapshotInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditInstanceSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: InstanceSnapshotInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditInstanceSnapshotDrawer Component
   ---------------------------------------- */

export function EditInstanceSnapshotDrawer({
  isOpen,
  onClose,
  snapshot,
  onSubmit,
}: EditInstanceSnapshotDrawerProps) {
  const [snapshotName, setSnapshotName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && snapshot) {
      setSnapshotName(snapshot.name);
      setDescription(snapshot.description ?? '');
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, snapshot]);

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
      title="Edit instance snapshot"
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
        {/* Header */}
        {/* Snapshot Name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Instance snapshot name</FormField.Label>
          <FormField.Control>
            <Input
              value={snapshotName}
              onChange={(e) => {
                setSnapshotName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter snapshot name"
              fullWidth
              error={hasAttemptedSubmit && !!nameError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          <FormField.HelperText>
            {
              'You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters.'
            }
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </FormField.HelperText>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditInstanceSnapshotDrawer;
