import { useState, useEffect } from 'react';
import { Drawer, Button, Select, FormField, InlineMessage } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeInfo {
  id: string;
  name: string;
  currentType: string;
}

export interface VolumeTypeOption {
  value: string;
  label: string;
}

export interface ChangeVolumeTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo | null;
  volumeTypes?: VolumeTypeOption[];
  onSubmit?: (newVolumeType: string) => void;
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
   ChangeVolumeTypeDrawer Component
   ---------------------------------------- */

export function ChangeVolumeTypeDrawer({
  isOpen,
  onClose,
  volume,
  volumeTypes = [
    { value: 'ssd', label: 'SSD' },
    { value: 'hdd', label: 'HDD' },
    { value: 'nvme', label: 'NVMe' },
  ],
  onSubmit,
}: ChangeVolumeTypeDrawerProps) {
  const [selectedType, setSelectedType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedType('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedType) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedType);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    onClose();
  };

  // Filter out current type from available options
  const availableTypes = volumeTypes.filter((type) => type.value !== volume?.currentType);

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
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Change Type
            </h2>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Change the storage type of this volume to another available volume type. The operation
              may take some time.
            </p>
          </VStack>

          {/* Warning Box */}
          <InlineMessage variant="error">
            For data consistency, stop all write operations on the instance before retyping.
          </InlineMessage>

          {/* Volume Info */}
          <InfoBox label="Volume" value={volume?.name ?? '-'} />

          {/* Current Volume Type Info */}
          <InfoBox label="Current volume type" value={volume?.currentType ?? '-'} />
        </VStack>

        {/* New Volume Type Select */}
        <FormField required error={hasAttemptedSubmit && !selectedType}>
          <FormField.Label>New volume type</FormField.Label>
          <FormField.Control>
            <Select
              value={selectedType}
              onChange={(value) => setSelectedType(value)}
              options={availableTypes}
              placeholder="Please select a volume type"
              fullWidth
              error={hasAttemptedSubmit && !selectedType}
            />
          </FormField.Control>
          {hasAttemptedSubmit && !selectedType && (
            <FormField.ErrorMessage>Please select a volume type</FormField.ErrorMessage>
          )}
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default ChangeVolumeTypeDrawer;
