import { useState, useEffect } from 'react';
import { Drawer, Button, Toggle, FormField, InfoBox } from '@/design-system';
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
      title="Lock setting"
      description="When a system administrator is locked, sign-in is disabled and modifications or deletion of the account are restricted."
      width={360}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
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
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={3}>
          {/* Admin Info Card */}
          <InfoBox label="System administrator" value={adminUsername} />
        </VStack>

        {/* Lock Status */}
        <FormField label="Lock status" spacing="loose">
          <HStack gap={2} align="center">
            <Toggle checked={locked} onChange={setLocked} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {locked ? 'Locked' : 'Unlocked'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default AdminLockSettingDrawer;
