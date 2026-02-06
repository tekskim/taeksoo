import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Slider, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeSnapshotInfo {
  id: string;
  name: string;
  size: number; // in GiB
}

interface QuotaInfo {
  used: number;
  total: number | 'infinity';
}

export interface CreateVolumeFromVolumeSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeSnapshot: VolumeSnapshotInfo | null;
  volumeTypes?: { value: string; label: string }[];
  volumeQuota?: QuotaInfo;
  volumeCapacityQuota?: QuotaInfo;
  defaultTypeQuota?: QuotaInfo;
  defaultTypeCapacityQuota?: QuotaInfo;
  minCapacity?: number;
  maxCapacity?: number;
  onSubmit?: (
    volumeName: string,
    description: string,
    capacity: number,
    volumeType: string
  ) => void;
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
   QuotaProgressBar Component
   ---------------------------------------- */

interface QuotaProgressBarProps {
  label: string;
  used: number;
  total: number | 'infinity';
  adding?: number;
}

function QuotaProgressBar({ label, used, total, adding = 1 }: QuotaProgressBarProps) {
  const isInfinity = total === 'infinity';
  const percentage = isInfinity ? 5 : (used / total) * 100;
  const addingPercentage = isInfinity ? 5 : (adding / total) * 100;

  return (
    <VStack gap={2} className="w-full">
      <HStack className="justify-between w-full">
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">{label}</span>
        <HStack gap={0} className="items-center">
          <span className="text-body-md text-[var(--color-text-default)] leading-4">{used}/</span>
          {isInfinity ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" stroke={1} />
          ) : (
            <span className="text-body-md text-[var(--color-text-default)] leading-4">{total}</span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 flex items-start pr-1">
        <div
          className="h-1 rounded-lg bg-[var(--color-status-success)] -mr-1 z-[3]"
          style={{ width: `${Math.min(percentage, 100)}%`, minWidth: percentage > 0 ? '4px' : '0' }}
        />
        <div
          className="h-1 rounded-lg bg-[var(--primitive-color-green200)] -mr-1 z-[2]"
          style={{
            width: `${Math.min(addingPercentage, 100 - percentage)}%`,
            minWidth: addingPercentage > 0 ? '4px' : '0',
          }}
        />
        <div className="flex-1 h-1 rounded-lg bg-[var(--color-border-subtle)] -mr-1 z-[1]" />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateVolumeFromVolumeSnapshotDrawer Component
   ---------------------------------------- */

export function CreateVolumeFromVolumeSnapshotDrawer({
  isOpen,
  onClose,
  volumeSnapshot,
  volumeTypes = [
    { value: '_DEFAULT_', label: '_DEFAULT_' },
    { value: 'ssd', label: 'SSD' },
    { value: 'hdd', label: 'HDD' },
  ],
  volumeQuota = { used: 2, total: 10 },
  volumeCapacityQuota = { used: 20, total: 1000 },
  defaultTypeQuota = { used: 2, total: 'infinity' },
  defaultTypeCapacityQuota = { used: 100, total: 'infinity' },
  minCapacity = 201,
  maxCapacity = 2000,
  onSubmit,
}: CreateVolumeFromVolumeSnapshotDrawerProps) {
  const [volumeName, setVolumeName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(minCapacity);
  const [volumeType, setVolumeType] = useState('_DEFAULT_');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setVolumeName('');
      setDescription('');
      setCapacity(minCapacity);
      setVolumeType('_DEFAULT_');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, minCapacity]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!volumeName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(volumeName, description, capacity, volumeType);
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
              adding={capacity}
            />
            <QuotaProgressBar
              label="_DEFAULT_type Quota"
              used={defaultTypeQuota.used}
              total={defaultTypeQuota.total}
            />
            <QuotaProgressBar
              label="_DEFAULT_type capacity Quota"
              used={defaultTypeCapacityQuota.used}
              total={defaultTypeCapacityQuota.total}
              adding={capacity}
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
        {/* Header */}
        <VStack gap={3}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Create Volume from Snapshot
          </h2>

          {/* Volume Snapshot Info */}
          <InfoBox
            label="Volume snapshot"
            value={volumeSnapshot ? `${volumeSnapshot.name} (${volumeSnapshot.size}GiB)` : '-'}
          />
        </VStack>

        {/* Volume Name Input */}
        <FormField required error={hasAttemptedSubmit && !volumeName.trim()}>
          <FormField.Label>Volume name</FormField.Label>
          <FormField.Control>
            <Input
              value={volumeName}
              onChange={(e) => setVolumeName(e.target.value)}
              placeholder="e.g. volume snapshot-copy"
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

        {/* Description Input */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-md text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Recovery test volume from snapshot"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Capacity Slider */}
        <VStack gap={5} className="w-full">
          <HStack className="justify-between w-full">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              Capacity (GiB)
            </label>
            <span className="text-body-md text-[var(--color-text-subtle)] leading-4">
              {minCapacity} - {maxCapacity} GiB
            </span>
          </HStack>
          <VStack gap={5} className="w-full">
            <Slider value={capacity} onChange={setCapacity} min={minCapacity} max={maxCapacity} />
            <Input
              type="number"
              value={capacity.toString()}
              onChange={(e) => {
                const val = parseInt(e.target.value) || minCapacity;
                setCapacity(Math.min(Math.max(val, minCapacity), maxCapacity));
              }}
              min={minCapacity}
              max={maxCapacity}
              fullWidth
            />
          </VStack>
        </VStack>

        {/* Volume Type Select */}
        <FormField>
          <FormField.Label>
            Volume type{' '}
            <span className="text-body-md text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Select
              value={volumeType}
              onChange={(value) => setVolumeType(value)}
              options={volumeTypes}
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeFromVolumeSnapshotDrawer;
