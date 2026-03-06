import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeInfo {
  id: string;
  name: string;
  size: number; // in GiB
}

export interface CreateTransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo | null;
  onSubmit?: (transferName: string) => void;
}

/* ----------------------------------------
   CreateTransferDrawer Component
   ---------------------------------------- */

export function CreateTransferDrawer({
  isOpen,
  onClose,
  volume,
  onSubmit,
}: CreateTransferDrawerProps) {
  const [transferName, setTransferName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTransferName('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!transferName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(transferName);
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
      title="Create Transfer"
      description="Create a transfer request to share this volume with another project. The recipient will need the generated Transfer ID and auth key to accept it."
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
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={3}>
          {/* Volume Info */}
          <InfoBox label="Volume" value={volume ? `${volume.name} (${volume.size}GiB)` : '-'} />
        </VStack>

        {/* Transfer Name Input */}
        <FormField required error={hasAttemptedSubmit && !transferName.trim()}>
          <FormField.Label>Transfer name</FormField.Label>
          <FormField.Control>
            <Input
              value={transferName}
              onChange={(e) => setTransferName(e.target.value)}
              placeholder="e.g., db-volume-transfer"
              fullWidth
              error={hasAttemptedSubmit && !transferName.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Transfer name is required</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateTransferDrawer;
