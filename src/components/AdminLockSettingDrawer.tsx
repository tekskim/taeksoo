import { useState, useEffect } from 'react';
import { Drawer, Button, Toggle } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface AdminLockSettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  adminUsername?: string;
  initialLocked?: boolean;
  onSubmit?: (locked: boolean) => void;
}

/* ----------------------------------------
   AdminLockSettingDrawer Component
   ---------------------------------------- */

export function AdminLockSettingDrawer({
  isOpen,
  onClose,
  adminUsername = 'thaki.kim',
  initialLocked = true,
  onSubmit,
}: AdminLockSettingDrawerProps) {
  const [locked, setLocked] = useState(initialLocked);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocked(initialLocked);
    }
  }, [isOpen, initialLocked]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(locked);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setLocked(initialLocked);
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
        <HStack gap={2} justify="center" className="w-full">
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
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Lock setting
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              When a system administrator is locked, sign-in is disabled and modifications or
              deletion of the account are restricted.
            </p>
          </VStack>

          {/* Admin Info Card */}
          <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                System administrator
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {adminUsername}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Lock Status */}
        <VStack gap={3}>
          <span className="text-label-lg text-[var(--color-text-default)] leading-5">
            Lock status
          </span>
          <HStack gap={2} align="center">
            <Toggle checked={locked} onChange={setLocked} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {locked ? 'Locked' : 'Unlocked'}
            </span>
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AdminLockSettingDrawer;
