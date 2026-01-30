import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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

  useEffect(() => {
    if (isOpen && instance) {
      setInstanceName(instance.name);
      setDescription(instance.description ?? '');
    }
  }, [isOpen, instance]);

  const handleSubmit = async () => {
    if (!instanceName.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit?.(instanceName, description);
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
          Edit Instance
        </h2>

        {/* Instance Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Instance name
          </label>
          <Input
            value={instanceName}
            onChange={(e) => setInstanceName(e.target.value)}
            placeholder="Enter instance name"
            fullWidth
          />
          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <div className="flex items-center gap-1">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              Description
            </label>
            <span className="text-body-md text-[var(--color-text-subtle)]">(optional)</span>
          </div>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Instance for running internal API service"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}
