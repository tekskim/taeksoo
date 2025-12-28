import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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
    <div className="w-full bg-[var(--color-surface-muted)] rounded-lg px-4 py-3">
      <VStack gap={1.5}>
        <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
          {label}
        </span>
        <span className="text-[12px] text-[var(--color-text-default)] leading-4">
          {value}
        </span>
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

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTransferName('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
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
            disabled={!transferName.trim() || isSubmitting}
            className="flex-1"
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
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Create Transfer
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Create a transfer request to share this volume with another project. The recipient will need the generated Transfer ID and Auth Key to accept it.
            </p>
          </VStack>

          {/* Volume Info */}
          <InfoBox 
            label="Volume" 
            value={volume ? `${volume.name} (${volume.size}GiB)` : '-'} 
          />
        </VStack>

        {/* Transfer Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Transfer name
          </label>
          <Input
            value={transferName}
            onChange={(e) => setTransferName(e.target.value)}
            placeholder="e.g., db-volume-transfer"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateTransferDrawer;

