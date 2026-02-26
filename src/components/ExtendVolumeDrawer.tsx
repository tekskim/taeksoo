import { useState, useEffect } from 'react';
import { Drawer, Button, Slider, NumberInput, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeInfo {
  id: string;
  name: string;
  size: number; // in GiB
}

export interface QuotaInfo {
  used: number;
  total: number | null; // null means unlimited (∞)
}

export interface ExtendVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo | null;
  minCapacity?: number;
  maxCapacity?: number;
  volumeCapacityQuota?: QuotaInfo;
  typeCapacityQuota?: QuotaInfo;
  onSubmit?: (newCapacity: number) => void;
}

/* ----------------------------------------
   QuotaProgressBar Component
   ---------------------------------------- */

interface QuotaProgressBarProps {
  label: string;
  used: number;
  total: number | null;
}

function QuotaProgressBar({ label, used, total }: QuotaProgressBarProps) {
  const isUnlimited = total === null;
  const percentage = isUnlimited ? 20 : total > 0 ? (used / total) * 100 : 0;
  const nextPercentage = isUnlimited ? 20 : total > 0 ? ((used + 1) / total) * 100 : 0;

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between items-center">
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">{label}</span>
        <HStack gap={0} className="items-center">
          <span className="text-body-md text-[var(--color-text-default)] leading-4">{used}/</span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" stroke={1} />
          ) : (
            <span className="text-body-md text-[var(--color-text-default)] leading-4">{total}</span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
        {/* Current usage (darker green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#4ade80] rounded-lg z-[2]"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Next usage preview (lighter green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#bbf7d0] rounded-lg z-[1]"
          style={{ width: `${Math.min(nextPercentage, 100)}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   ExtendVolumeDrawer Component
   ---------------------------------------- */

export function ExtendVolumeDrawer({
  isOpen,
  onClose,
  volume,
  minCapacity = 201,
  maxCapacity = 2000,
  volumeCapacityQuota = { used: 20, total: 1000 },
  typeCapacityQuota = { used: 2, total: null },
  onSubmit,
}: ExtendVolumeDrawerProps) {
  const [capacity, setCapacity] = useState(minCapacity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [capacityError, setCapacityError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volume) {
      // Set initial capacity to current volume size + 1 or minCapacity
      const initialCapacity = Math.max(volume.size + 1, minCapacity);
      setCapacity(initialCapacity);
      setHasAttemptedSubmit(false);
      setCapacityError(null);
    }
  }, [isOpen, volume, minCapacity]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (capacity <= (volume?.size ?? 0)) {
      setCapacityError('New capacity must be greater than the current volume size.');
      return;
    }
    setCapacityError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(capacity);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCapacity(minCapacity);
    onClose();
  };

  const handleCapacityChange = (value: number) => {
    if (capacityError) setCapacityError(null);
    const clampedValue = Math.min(Math.max(value, minCapacity), maxCapacity);
    setCapacity(clampedValue);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={360}
      footer={
        <VStack gap={6} className="w-full">
          {/* Quota Section */}
          <VStack gap={6} className="w-full">
            <QuotaProgressBar
              label="Volume capacity quota (GiB)"
              used={volumeCapacityQuota.used}
              total={volumeCapacityQuota.total}
            />
            <QuotaProgressBar
              label="_DEFAULT_type capacity Quota"
              used={typeCapacityQuota.used}
              total={typeCapacityQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <div className="w-[calc(100%+48px)] -ml-6 h-px bg-[var(--color-border-default)]" />
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
              {isSubmitting ? 'Extending...' : 'Extend'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6}>
        {/* Header + Volume Info */}
        <VStack gap={3}>
          {/* Header */}
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Extend Volume
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Increase the size of this volume to expand its storage capacity. The volume size can
              only be increased and cannot be reduced once extended.
            </p>
          </VStack>

          {/* Volume Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <p className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">Volume</p>
            <p className="text-body-md text-[var(--color-text-default)]">
              {volume ? `${volume.name} (${volume.size}GiB)` : '-'}
            </p>
          </div>
        </VStack>

        {/* Capacity Slider */}
        <FormField error={!!capacityError}>
          <FormField.Label>Capacity (GiB)</FormField.Label>
          <FormField.Control>
            <HStack gap={3} align="center" className="w-full">
              <Slider
                min={minCapacity}
                max={maxCapacity}
                value={capacity}
                onChange={handleCapacityChange}
                step={50}
                fullWidth
              />
              <NumberInput
                value={capacity}
                onChange={handleCapacityChange}
                min={minCapacity}
                max={maxCapacity}
                step={1}
                width="xs"
                suffix="GiB"
              />
            </HStack>
          </FormField.Control>
          {capacityError && <FormField.ErrorMessage>{capacityError}</FormField.ErrorMessage>}
          <FormField.HelperText>
            {minCapacity} - {maxCapacity} GiB
          </FormField.HelperText>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default ExtendVolumeDrawer;
