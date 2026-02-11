import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditVolumeDrawer Component
   ---------------------------------------- */

export function EditVolumeDrawer({ isOpen, onClose, volume, onSubmit }: EditVolumeDrawerProps) {
  const [volumeName, setVolumeName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volume) {
      setVolumeName(volume.name);
      setDescription(volume.description ?? '');
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, volume]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!volumeName.trim()) {
      setNameError('Volume name is required');
      return;
    }
    if (volumeName.trim().length > 128) {
      setNameError('Volume name must be 128 characters or fewer');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(volumeName, description);
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
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">Edit volume</h2>

        {/* Volume Name Input */}
        <FormField error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Volume name</FormField.Label>
          <FormField.Control>
            <Input
              value={volumeName}
              onChange={(e) => {
                setVolumeName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter volume name"
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
        <VStack gap={2} className="w-full">
          <HStack gap={1} className="items-center">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              Description
            </label>
            <span className="text-body-md text-[var(--color-text-subtle)]">(optional)</span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., for database storage"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditVolumeDrawer;
