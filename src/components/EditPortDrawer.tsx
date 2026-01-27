import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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

  // Reset form when drawer opens or port changes
  useEffect(() => {
    if (isOpen) {
      setPortName(port.name);
      setDescription(port.description || '');
    }
  }, [isOpen, port]);

  const handleSubmit = async () => {
    if (!portName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(portName, description);
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
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Edit Port
          </h2>
        </VStack>

        {/* Port Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Port name
          </label>
          <Input
            value={portName}
            onChange={(e) => setPortName(e.target.value)}
            placeholder="e.g. my-port"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <HStack gap={1} className="items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Description
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              (optional)
            </span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. NIC for frontend instance"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditPortDrawer;
