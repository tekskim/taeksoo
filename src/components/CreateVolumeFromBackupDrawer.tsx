import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Slider } from '@/design-system';
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
  onSubmit?: (volumeName: string, description: string, capacity: number, volumeType: string, az: string) => void;
}

/* ----------------------------------------
   InfoBox Component
   ---------------------------------------- */

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
      <VStack gap={2}>
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
        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
          {label}
        </span>
        <HStack gap={0} className="items-center">
          <span className="text-[12px] text-[var(--color-text-default)] leading-4">
            {used}/
          </span>
          {isInfinity ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" stroke={1} />
          ) : (
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              {total}
            </span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 flex items-start pr-1">
        <div
          className="h-1 rounded-lg bg-[var(--color-status-success)] -mr-1 z-[3]"
          style={{ width: `${Math.min(percentage, 100)}%`, minWidth: percentage > 0 ? '4px' : '0' }}
        />
        <div
          className="h-1 rounded-lg bg-green-200 -mr-1 z-[2]"
          style={{ width: `${Math.min(addingPercentage, 100 - percentage)}%`, minWidth: addingPercentage > 0 ? '4px' : '0' }}
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

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setVolumeName('');
      setDescription('');
      setCapacity(minCapacity);
      setVolumeType('_DEFAULT_');
      setAz('nova');
    }
  }, [isOpen, minCapacity]);

  const handleSubmit = async () => {
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
            <Button 
              variant="secondary" 
              onClick={handleClose}
              className="flex-1 h-8"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!volumeName.trim() || isSubmitting}
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
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Create Volume from Backup
          </h2>

          {/* Volume Backup Info */}
          <InfoBox 
            label="Volume Backup" 
            value={volumeBackup ? `${volumeBackup.name} (${volumeBackup.size}GiB)` : '-'} 
          />
        </VStack>

        {/* Volume Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Volume name
          </label>
          <Input
            value={volumeName}
            onChange={(e) => setVolumeName(e.target.value)}
            placeholder="e.g. volume backup-copy"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <HStack gap={1} className="items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Description
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)]">
              (optional)
            </span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Recovery test volume from backup"
            fullWidth
          />
        </VStack>

        {/* Capacity Slider */}
        <VStack gap={5} className="w-full">
          <HStack className="justify-between w-full">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Capacity (GiB)
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              {minCapacity} - {maxCapacity} GiB
            </span>
          </HStack>
          <VStack gap={5} className="w-full">
            <Slider
              value={capacity}
              onChange={setCapacity}
              min={minCapacity}
              max={maxCapacity}
            />
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
        <VStack gap={2} className="w-full">
          <HStack gap={1} className="items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Volume type
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)]">
              (optional)
            </span>
          </HStack>
          <Select
            value={volumeType}
            onChange={(value) => setVolumeType(value)}
            options={volumeTypes}
            fullWidth
          />
        </VStack>

        {/* AZ Select */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            AZ
          </label>
          <Select
            value={az}
            onChange={(value) => setAz(value)}
            options={availabilityZones}
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeFromBackupDrawer;

