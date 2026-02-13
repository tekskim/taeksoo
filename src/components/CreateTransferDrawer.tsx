import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
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
   InfoBox Component
   ---------------------------------------- */

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
      <VStack gap={2}>
        <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)] leading-4">{value}</span>
      </VStack>
    </div>
  );
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
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Create Transfer
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Create a transfer request to share this volume with another project. The recipient
              will need the generated Transfer ID and auth key to accept it.
            </p>
          </VStack>

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
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateTransferDrawer;
