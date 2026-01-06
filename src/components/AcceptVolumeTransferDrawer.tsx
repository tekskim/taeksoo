import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface AcceptVolumeTransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (transferId: string, authKey: string) => void;
}

/* ----------------------------------------
   AcceptVolumeTransferDrawer Component
   ---------------------------------------- */

export function AcceptVolumeTransferDrawer({
  isOpen,
  onClose,
  onSubmit,
}: AcceptVolumeTransferDrawerProps) {
  const [transferId, setTransferId] = useState('');
  const [authKey, setAuthKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTransferId('');
      setAuthKey('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!transferId.trim() || !authKey.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(transferId, authKey);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isValid = transferId.trim().length > 0 && authKey.trim().length > 0;

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
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Accepting...' : 'Accept'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Accept Volume Transfer
          </h2>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Accept a volume transfer using the provided transfer ID and authorization key. Once accepted, the volume will be moved to your project and ownership cannot be reverted.
          </p>
        </VStack>

        {/* Transfer ID Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Transfer ID
          </label>
          <Input
            value={transferId}
            onChange={(e) => setTransferId(e.target.value)}
            placeholder="e.g., 4f2a7c9d-xxxx-xxxx-xxxx-9e3d7e0d5a12"
            fullWidth
          />
        </VStack>

        {/* Auth Key Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Auth Key
          </label>
          <Input
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
            placeholder="Enter authorization key"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AcceptVolumeTransferDrawer;


