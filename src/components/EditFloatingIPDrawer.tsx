import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FloatingIPInfo {
  id: string;
  ipAddress: string;
  description?: string;
}

export interface EditFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  floatingIP: FloatingIPInfo;
  onSubmit?: (description: string) => void;
}

/* ----------------------------------------
   EditFloatingIPDrawer Component
   ---------------------------------------- */

export function EditFloatingIPDrawer({
  isOpen,
  onClose,
  floatingIP,
  onSubmit,
}: EditFloatingIPDrawerProps) {
  const [description, setDescription] = useState(floatingIP.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens or floatingIP changes
  useEffect(() => {
    if (isOpen) {
      setDescription(floatingIP.description || '');
    }
  }, [isOpen, floatingIP]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(description);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Edit floating IP
          </h2>
        </VStack>

        {/* Floating IP (Read-only) */}
        <InfoBox label="Floating IP" value={floatingIP.ipAddress} />

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
              placeholder="e.g. my-prod-web-server-ip"
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditFloatingIPDrawer;
