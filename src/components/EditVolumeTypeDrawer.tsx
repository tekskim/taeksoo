import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeTypeInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditVolumeTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeType: VolumeTypeInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditVolumeTypeDrawer Component
   ---------------------------------------- */

export function EditVolumeTypeDrawer({
  isOpen,
  onClose,
  volumeType,
  onSubmit,
}: EditVolumeTypeDrawerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && volumeType) {
      setName(volumeType.name);
      setDescription(volumeType.description ?? '');
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, volumeType]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!name.trim()) {
      setNameError('Please enter a name.');
      return;
    }
    if (name.trim().length < 2 || name.trim().length > 128) {
      setNameError('Name must be between 2-128 characters.');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(name.trim(), description.trim());
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
      title="Edit volume type"
      description="Edit the volume type's name and description. These changes update basic information only."
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
          error={hasAttemptedSubmit && !!nameError}
          errorMessage={hasAttemptedSubmit && nameError ? nameError : undefined}
        >
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter name"
            fullWidth
          />
        </FormField>

        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditVolumeTypeDrawer;
