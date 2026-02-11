import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface KeyPairInfo {
  id: string;
  name: string;
}

export interface EditKeyPairDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keyPair: KeyPairInfo | null;
  onSubmit?: (name: string) => void;
}

/* ----------------------------------------
   EditKeyPairDrawer Component
   ---------------------------------------- */

export function EditKeyPairDrawer({ isOpen, onClose, keyPair, onSubmit }: EditKeyPairDrawerProps) {
  const [keyPairName, setKeyPairName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && keyPair) {
      setKeyPairName(keyPair.name);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, keyPair]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    const trimmed = keyPairName.trim();
    if (!trimmed) {
      setNameError('Key pair name is required');
      return;
    }
    if (trimmed.length > 128) {
      setNameError('Key pair name must be at most 128 characters');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(keyPairName);
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
          Edit key pair
        </h2>

        {/* Key Pair Name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Key pair name</FormField.Label>
          <FormField.Control>
            <Input
              value={keyPairName}
              onChange={(e) => {
                setKeyPairName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter key pair name"
              fullWidth
              error={hasAttemptedSubmit && !!nameError}
            />
          </FormField.Control>
          {hasAttemptedSubmit && nameError && (
            <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          )}
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditKeyPairDrawer;
