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

export function LockSettingDrawer({
  isOpen,
  onClose,
  instance,
  onSubmit,
}: LockSettingDrawerProps) {
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
          <Button
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
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
        {/* Header + Instance Info Group */}
        <VStack gap={3}>
          {/* Header */}
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Lock Setting
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Locking an instance prevents it from being deleted or modified. You can unlock it anytime to allow changes again.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <p className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-1.5">
              Instance
            </p>
            <p className="text-[12px] text-[var(--color-text-default)]">
              {instance?.name || '-'}
            </p>
          </div>
        </VStack>

        {/* Lock Status */}
        <VStack gap={3}>
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Lock Status
          </label>
          <HStack gap={2} className="items-center">
            <Toggle
              checked={isLocked}
              onChange={setIsLocked}
            />
            <span className="text-[12px] text-[var(--color-text-default)]">
              {isLocked ? 'Locked' : 'Unlocked'}
            </span>
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

