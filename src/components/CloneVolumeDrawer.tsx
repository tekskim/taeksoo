import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconAlertCircle, IconInfinity } from '@tabler/icons-react';

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

export interface CloneVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo | null;
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
  const percentage = isUnlimited ? 20 : (total > 0 ? (used / total) * 100 : 0);
  const nextPercentage = isUnlimited ? 20 : (total > 0 ? ((used + 1) / total) * 100 : 0);

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between items-center">
        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
          {label}
        </span>
        <HStack gap={0} className="items-center">
          <span className="text-[12px] text-[var(--color-text-default)] leading-4">
            {used}/
          </span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" stroke={1} />
          ) : (
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              {total}
            </span>
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
   CloneVolumeDrawer Component
   ---------------------------------------- */

export function CloneVolumeDrawer({
  isOpen,
  onClose,
  volume,
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
}: CloneVolumeDrawerProps) {
  const [volumeName, setVolumeName] = useState('');
  const [capacity, setCapacity] = useState(minCapacity);
  const [volumeType, setVolumeType] = useState('_DEFAULT_');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volume) {
      // Generate default volume name with date
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      setVolumeName(`vol-clone-${dateStr}`);
      setCapacity(Math.max(volume.size, minCapacity));
      setVolumeType('_DEFAULT_');
    }
  }, [isOpen, volume, minCapacity]);

  const handleSubmit = async () => {
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
    onClose();
  };

  const handleCapacityChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, minCapacity), maxCapacity);
    setCapacity(clampedValue);
  };

  const sliderPercentage = ((capacity - minCapacity) / (maxCapacity - minCapacity)) * 100;

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
              {isSubmitting ? 'Cloning...' : 'Clone'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6}>
        {/* Header + Volume Info + Warning Group */}
        <VStack gap={3}>
          {/* Header */}
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Clone Volume
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Create a new volume that is an exact copy of this volume's current data. The cloned volume can be used independently for testing, backup, or new instance creation.
            </p>
          </VStack>

          {/* Source Volume Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <p className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-1.5">
              Source Volume
            </p>
            <p className="text-[12px] text-[var(--color-text-default)]">
              {volume ? `${volume.name} (${volume.size}GiB)` : '-'}
            </p>
          </div>

          {/* Warning Message */}
          <div className="w-full flex gap-2 p-3 bg-[var(--color-state-danger-bg)] rounded-lg">
            <IconAlertCircle 
              size={16} 
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5" 
              stroke={1}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              For data consistency, stop all write operations on the instance before creating a backup.
            </p>
          </div>
        </VStack>

        {/* New Volume Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            New Volume name
          </label>
          <Input
            value={volumeName}
            onChange={(e) => setVolumeName(e.target.value)}
            placeholder="Enter volume name"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Capacity Slider */}
        <VStack gap={5} className="w-full">
          <HStack className="w-full justify-between items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Capacity (GiB)
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              {minCapacity} - {maxCapacity} GiB
            </span>
          </HStack>
          
          {/* Slider */}
          <VStack gap={2} className="w-full">
            <div className="relative w-full h-1.5">
              <div className="absolute inset-0 bg-[var(--color-border-subtle)] rounded-lg" />
              <div 
                className="absolute left-0 top-0 h-full bg-[#2563eb] rounded-lg"
                style={{ width: `${sliderPercentage}%` }}
              />
              <input
                type="range"
                min={minCapacity}
                max={maxCapacity}
                value={capacity}
                onChange={(e) => handleCapacityChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-full pointer-events-none"
                style={{ left: `calc(${sliderPercentage}% - 8px)` }}
              />
            </div>
            
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
          <HStack gap={1} className="items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Volume type
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)]">
              (optional)
            </span>
          </HStack>
          <Select
            options={volumeTypes}
            value={volumeType}
            onChange={setVolumeType}
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CloneVolumeDrawer;

