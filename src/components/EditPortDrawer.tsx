import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface PortInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditPortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  port: PortInfo;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditPortDrawer Component
   ---------------------------------------- */

export function EditPortDrawer({ isOpen, onClose, port, onSubmit }: EditPortDrawerProps) {
  const [portName, setPortName] = useState(port.name);
  const [description, setDescription] = useState(port.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens or port changes
  useEffect(() => {
    if (isOpen) {
      setPortName(port.name);
      setDescription(port.description || '');
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, port]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!portName.trim()) {
      setNameError('Port name is required');
      return;
    }
    if (portName.trim().length > 128) {
      setNameError('Port name must be 128 characters or fewer');
      return;
    }

    setNameError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.(portName, description);
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
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">Edit port</h2>
        </VStack>

        {/* Port Name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Port name</FormField.Label>
          <FormField.Control>
            <Input
              value={portName}
              onChange={(e) => {
                setPortName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. my-port"
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
            <span className="text-body-sm text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. NIC for frontend instance"
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditPortDrawer;
