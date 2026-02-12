import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ImageInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditImageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditImageDrawer Component
   ---------------------------------------- */

export function EditImageDrawer({ isOpen, onClose, image, onSubmit }: EditImageDrawerProps) {
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && image) {
      setImageName(image.name);
      setDescription(image.description ?? '');
    }
  }, [isOpen, image]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!imageName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(imageName, description);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
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
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">Edit image</h2>

        {/* Image Name Input */}
        <FormField required error={hasAttemptedSubmit && !imageName.trim()}>
          <FormField.Label>Image name</FormField.Label>
          <FormField.Control>
            <Input
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter image name"
              fullWidth
              error={hasAttemptedSubmit && !imageName.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Image name is required</FormField.ErrorMessage>
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
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instance for running internal API service"
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditImageDrawer;
