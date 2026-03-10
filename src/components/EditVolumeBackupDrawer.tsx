import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeBackupInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditVolumeBackupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeBackup: VolumeBackupInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditVolumeBackupDrawer Component
   ---------------------------------------- */

export function EditVolumeBackupDrawer({
  isOpen,
  onClose,
  volumeBackup,
  onSubmit,
}: EditVolumeBackupDrawerProps) {
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volumeBackup) {
      setBackupName(volumeBackup.name);
      setDescription(volumeBackup.description ?? '');
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, volumeBackup]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!backupName.trim()) {
      setNameError('Backup name is required');
      return;
    }
    if (backupName.trim().length > 128) {
      setNameError('Backup name must be 128 characters or fewer');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(backupName, description);
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
      title="Edit volume backup"
      description="Edit the backup's name and description. These changes update basic information only."
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
        {/* Volume Snapshot Name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Volume backup name</FormField.Label>
          <FormField.Control>
            <Input
              value={backupName}
              onChange={(e) => {
                setBackupName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter volume backup name"
              fullWidth
              error={hasAttemptedSubmit && !!nameError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. taken before applying DB patch"
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

export default EditVolumeBackupDrawer;
