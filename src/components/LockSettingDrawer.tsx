import { useState, useEffect } from 'react';
import { Drawer, Button, Toggle } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface InstanceInfo {
  id: string;
  name: string;
  isLocked?: boolean;
}

export interface LockSettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo | null;
  onSubmit?: (isLocked: boolean) => void;
}

export function LockSettingDrawer({ isOpen, onClose, instance, onSubmit }: LockSettingDrawerProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && instance) {
      setIsLocked(instance.isLocked ?? false);
    }
  }, [isOpen, instance]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(isLocked);
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
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
          Lock Setting
        </h2>

        {/* Instance Info */}
        {instance && (
          <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                Instance
              </span>
              <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                {instance.name}
              </span>
            </VStack>
          </div>
        )}

        {/* Lock Status */}
        <VStack gap={2}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Lock Status
          </span>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            When locked, the instance cannot be modified or deleted.
          </p>
          <HStack gap={2} align="center">
            <Toggle checked={isLocked} onChange={setIsLocked} />
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              {isLocked ? 'Locked' : 'Unlocked'}
            </span>
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default LockSettingDrawer;
