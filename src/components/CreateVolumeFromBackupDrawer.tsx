import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  Select,
  Slider,
  FormField,
  NumberInput,
  InfoBox,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeBackupInfo {
  id: string;
  name: string;
  size: number; // in GiB
}

interface QuotaInfo {
  used: number;
  total: number | 'infinity';
}

export interface CreateVolumeFromBackupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeBackup: VolumeBackupInfo | null;
  volumeTypes?: { value: string; label: string }[];
  availabilityZones?: { value: string; label: string }[];
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
    volumeType: string,
    az: string
  ) => void;
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
   CreateVolumeFromBackupDrawer Component
   ---------------------------------------- */

export function CreateVolumeFromBackupDrawer({
  isOpen,
  onClose,
  volumeBackup,
  volumeTypes = [
    { value: '_DEFAULT_', label: '_DEFAULT_' },
    { value: 'ssd', label: 'SSD' },
    { value: 'hdd', label: 'HDD' },
  ],
  availabilityZones = [
    { value: 'nova', label: 'nova' },
    { value: 'az-1', label: 'az-1' },
    { value: 'az-2', label: 'az-2' },
  ],
  volumeQuota = { used: 2, total: 10 },
  volumeCapacityQuota = { used: 20, total: 1000 },
  defaultTypeQuota = { used: 2, total: 'infinity' },
  defaultTypeCapacityQuota = { used: 100, total: 'infinity' },
  minCapacity = 201,
  maxCapacity = 2000,
  onSubmit,
}: CreateVolumeFromBackupDrawerProps) {
  const [volumeName, setVolumeName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(minCapacity);
  const [volumeType, setVolumeType] = useState('_DEFAULT_');
  const [az, setAz] = useState('nova');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setVolumeName('');
      setDescription('');
      setCapacity(minCapacity);
      setVolumeType('_DEFAULT_');
      setAz('nova');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, minCapacity]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!volumeName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(volumeName, description, capacity, volumeType, az);
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
      width={360}
      footer={
        <VStack gap={6} className="w-full">
          {/* Quota Section */}
          <VStack gap={6} className="w-full">
            <QuotaProgressBar
              label="Volume quota"
              used={volumeQuota.used}
              total={volumeQuota.total}
            />
            <QuotaProgressBar
              label="Volume capacity quota (GiB)"
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
          <div className="w-[calc(100%+48px)] -ml-6 h-px bg-[var(--color-border-default)]" />
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
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
            Create Volume from Backup
          </h2>

          {/* Volume Backup Info */}
          <InfoBox
            label="Volume backup"
            value={volumeBackup ? `${volumeBackup.name} (${volumeBackup.size}GiB)` : '-'}
          />
        </VStack>

        {/* Volume Name Input */}
        <FormField required error={hasAttemptedSubmit && !volumeName.trim()}>
          <FormField.Label>Volume name</FormField.Label>
          <FormField.Control>
            <Input
              value={volumeName}
              onChange={(e) => setVolumeName(e.target.value)}
              placeholder="e.g. volume backup-copy"
              fullWidth
              error={hasAttemptedSubmit && !volumeName.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Volume name is required</FormField.ErrorMessage>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-sm text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Recovery test volume from backup"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Capacity Slider */}
        <FormField>
          <FormField.Label>Capacity (GiB)</FormField.Label>
          <FormField.Control>
            <HStack gap={3} align="center" className="w-full">
              <Slider
                value={capacity}
                onChange={setCapacity}
                min={minCapacity}
                max={maxCapacity}
                step={50}
                fullWidth
              />
              <NumberInput
                value={capacity}
                onChange={(val) => setCapacity(Math.min(Math.max(val, minCapacity), maxCapacity))}
                min={minCapacity}
                max={maxCapacity}
                step={1}
                width="xs"
                suffix="GiB"
              />
            </HStack>
          </FormField.Control>
          <FormField.HelperText>
            {minCapacity} - {maxCapacity} GiB
          </FormField.HelperText>
        </FormField>

        {/* Volume Type Select */}
        <FormField>
          <FormField.Label>
            Volume type{' '}
            <span className="text-body-sm text-[var(--color-text-subtle)]">(optional)</span>
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

        {/* AZ Select */}
        <FormField>
          <FormField.Label>AZ</FormField.Label>
          <FormField.Control>
            <Select
              value={az}
              onChange={(value) => setAz(value)}
              options={availabilityZones}
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeFromBackupDrawer;
