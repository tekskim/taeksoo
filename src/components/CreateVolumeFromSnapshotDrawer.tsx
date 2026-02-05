import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Slider, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceSnapshotInfo {
  id: string;
  name: string;
  size: number; // in GiB
}

export interface QuotaInfo {
  used: number;
  total: number | null; // null means unlimited (∞)
}

export interface CreateVolumeFromSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: InstanceSnapshotInfo | null;
  minCapacity?: number;
  maxCapacity?: number;
  volumeTypes?: { value: string; label: string }[];
  volumeQuota?: QuotaInfo;
  volumeCapacityQuota?: QuotaInfo;
  typeQuota?: QuotaInfo;
  typeCapacityQuota?: QuotaInfo;
  onSubmit?: (volumeName: string, capacity: number, volumeType: string) => void;
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
   CreateVolumeFromSnapshotDrawer Component
   ---------------------------------------- */

export function CreateVolumeFromSnapshotDrawer({
  isOpen,
  onClose,
  snapshot,
  minCapacity = 201,
  maxCapacity = 2000,
  volumeTypes = [
    { value: '_DEFAULT_', label: '_DEFAULT_' },
    { value: 'ssd', label: 'SSD' },
    { value: 'hdd', label: 'HDD' },
  ],
  volumeQuota = { used: 2, total: 10 },
  volumeCapacityQuota = { used: 20, total: 1000 },
  typeQuota = { used: 2, total: null },
  typeCapacityQuota = { used: 2, total: null },
  onSubmit,
}: CreateVolumeFromSnapshotDrawerProps) {
  const [volumeName, setVolumeName] = useState('');
  const [capacity, setCapacity] = useState(minCapacity);
  const [volumeType, setVolumeType] = useState('_DEFAULT_');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && snapshot) {
      setVolumeName('');
      setCapacity(Math.max(snapshot.size, minCapacity));
      setVolumeType('_DEFAULT_');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, snapshot, minCapacity]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!volumeName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(volumeName, capacity, volumeType);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setVolumeName('');
    setCapacity(minCapacity);
    setVolumeType('_DEFAULT_');
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleCapacityChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, minCapacity), maxCapacity);
    setCapacity(clampedValue);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <VStack gap={6} className="w-full">
          {/* Quota Section */}
          <VStack gap={6} className="w-full border-t border-[var(--color-border-subtle)] pt-4">
            <QuotaProgressBar
              label="Volume Quota"
              used={volumeQuota.used}
              total={volumeQuota.total}
            />
            <QuotaProgressBar
              label="Volume Capacity Quota (GiB)"
              used={volumeCapacityQuota.used}
              total={volumeCapacityQuota.total}
            />
            <QuotaProgressBar
              label="_DEFAULT_type Quota"
              used={typeQuota.used}
              total={typeQuota.total}
            />
            <QuotaProgressBar
              label="_DEFAULT_type capacity Quota"
              used={typeCapacityQuota.used}
              total={typeCapacityQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <HStack gap={2} className="w-full border-t border-[var(--color-border-default)] pt-4">
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
        </VStack>
      }
    >
      <VStack gap={6}>
        {/* Header + Snapshot Info */}
        <VStack gap={3}>
          {/* Header */}
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Create Volume from Instance Snapshot
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              The new volume will contain the same data as the snapshot's system disk and can be
              attached to another instance.
            </p>
          </VStack>

          {/* Instance Snapshot Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <p className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">
              Instance snapshot
            </p>
            <p className="text-body-md text-[var(--color-text-default)]">
              {snapshot ? `${snapshot.name} (${snapshot.size}GiB)` : '-'}
            </p>
          </div>
        </VStack>

        {/* Volume Name Input */}
        <FormField required error={hasAttemptedSubmit && !volumeName.trim()}>
          <FormField.Label>Volume name</FormField.Label>
          <FormField.Control>
            <Input
              value={volumeName}
              onChange={(e) => setVolumeName(e.target.value)}
              placeholder="e.g. data-snap-volume"
              fullWidth
              error={hasAttemptedSubmit && !volumeName.trim()}
            />
          </FormField.Control>
          {hasAttemptedSubmit && !volumeName.trim() ? (
            <FormField.ErrorMessage>Volume name is required</FormField.ErrorMessage>
          ) : (
            <FormField.HelperText>
              Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
            </FormField.HelperText>
          )}
        </FormField>

        {/* Capacity Slider */}
        <VStack gap={3} className="w-full">
          <HStack className="w-full justify-between items-center">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              Capacity (GiB)
            </label>
            <span className="text-body-md text-[var(--color-text-subtle)] leading-4">
              {minCapacity} - {maxCapacity} GiB
            </span>
          </HStack>

          {/* Slider */}
          <VStack gap={3} className="w-full">
            <Slider
              min={minCapacity}
              max={maxCapacity}
              value={capacity}
              onChange={handleCapacityChange}
            />

            {/* Capacity Input */}
            <Input
              type="number"
              value={capacity.toString()}
              onChange={(e) => handleCapacityChange(Number(e.target.value))}
              min={minCapacity}
              max={maxCapacity}
              fullWidth
            />
          </VStack>
        </VStack>

        {/* Volume Type Select */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Volume type (optional)
          </label>
          <Select options={volumeTypes} value={volumeType} onChange={setVolumeType} fullWidth />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeFromSnapshotDrawer;
