import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
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
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTransferId('');
      setAuthKey('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
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
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Accept Volume Transfer"
      description="Accept a volume transfer using the provided transfer ID and authorization key. Once accepted, the volume will be moved to your project and ownership cannot be reverted."
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
            {isSubmitting ? 'Accepting...' : 'Accept'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}

        {/* Transfer ID Input */}
        <FormField required error={hasAttemptedSubmit && !transferId.trim()}>
          <FormField.Label>Transfer ID</FormField.Label>
          <FormField.Control>
            <Input
              value={transferId}
              onChange={(e) => setTransferId(e.target.value)}
              placeholder="e.g., 4f2a7c9d-xxxx-xxxx-xxxx-9e3d7e0d5a12"
              fullWidth
              error={hasAttemptedSubmit && !transferId.trim()}
            />
          </FormField.Control>
          {hasAttemptedSubmit && !transferId.trim() && (
            <FormField.ErrorMessage>Transfer ID is required</FormField.ErrorMessage>
          )}
        </FormField>

        {/* Auth Key Input */}
        <FormField required error={hasAttemptedSubmit && !authKey.trim()}>
          <FormField.Label>Auth key</FormField.Label>
          <FormField.Control>
            <Input
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              placeholder="Enter authorization key"
              fullWidth
              error={hasAttemptedSubmit && !authKey.trim()}
            />
          </FormField.Control>
          {hasAttemptedSubmit && !authKey.trim() && (
            <FormField.ErrorMessage>Auth key is required</FormField.ErrorMessage>
          )}
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default AcceptVolumeTransferDrawer;
