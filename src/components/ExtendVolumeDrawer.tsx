import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volume) {
      // Set initial capacity to current volume size + 1 or minCapacity
      const initialCapacity = Math.max(volume.size + 1, minCapacity);
      setCapacity(initialCapacity);
    }
  }, [isOpen, volume, minCapacity]);

  const handleSubmit = async () => {
    if (capacity <= (volume?.size ?? 0)) return;
    
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
              label="Volume Capacity Quota (GiB)"
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
          <HStack gap={2} className="w-full border-t border-[var(--color-border-default)] pt-4">
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
              disabled={capacity <= (volume?.size ?? 0) || isSubmitting}
              className="flex-1"
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
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Extend Volume
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Increase the size of this volume to expand its storage capacity. The volume size can only be increased and cannot be reduced once extended.
            </p>
          </VStack>

          {/* Volume Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <p className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-1.5">
              Volume
            </p>
            <p className="text-[12px] text-[var(--color-text-default)]">
              {volume ? `${volume.name} (${volume.size}GiB)` : '-'}
            </p>
          </div>
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
      </VStack>
    </Drawer>
  );
}

export default ExtendVolumeDrawer;

