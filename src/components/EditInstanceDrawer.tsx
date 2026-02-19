import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface InstanceInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

export function EditInstanceDrawer({
  isOpen,
  onClose,
  instance,
  onSubmit,
}: EditInstanceDrawerProps) {
  const [instanceName, setInstanceName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && instance) {
      setInstanceName(instance.name);
      setDescription(instance.description ?? '');
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, instance]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!instanceName.trim()) {
      setNameError('Please enter an instance name.');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(instanceName, description);
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
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
          Edit instance
        </h2>

        {/* Instance Name Input */}
        <FormField required error={!!nameError}>
          <FormField.Label>Instance name</FormField.Label>
          <FormField.Control>
            <Input
              value={instanceName}
              onChange={(e) => {
                setInstanceName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter instance name"
              fullWidth
              error={!!nameError}
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
