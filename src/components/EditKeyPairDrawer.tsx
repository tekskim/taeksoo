import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && keyPair) {
      setKeyPairName(keyPair.name);
    }
  }, [isOpen, keyPair]);

  const handleSubmit = async () => {
    if (!keyPairName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(keyPairName);
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
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
          Edit Key Pair
        </h2>

        {/* Key Pair Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Key pair name
          </label>
          <Input
            value={keyPairName}
            onChange={(e) => setKeyPairName(e.target.value)}
            placeholder="Enter key pair name"
            fullWidth
          />
          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditKeyPairDrawer;
