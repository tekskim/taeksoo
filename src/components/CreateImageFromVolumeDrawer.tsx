import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeInfo {
  id: string;
  name: string;
  size: number; // in GiB
}

export interface CreateImageFromVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo | null;
  diskFormats?: { value: string; label: string }[];
  onSubmit?: (imageName: string, diskFormat: string) => void;
}

/* ----------------------------------------
   CreateImageFromVolumeDrawer Component
   ---------------------------------------- */

export function CreateImageFromVolumeDrawer({
  isOpen,
  onClose,
  volume,
  diskFormats = [
    { value: 'raw', label: 'Raw' },
    { value: 'qcow2', label: 'QCOW2' },
    { value: 'vmdk', label: 'VMDK' },
    { value: 'vdi', label: 'VDI' },
    { value: 'iso', label: 'ISO' },
    { value: 'vhd', label: 'VHD' },
  ],
  onSubmit,
}: CreateImageFromVolumeDrawerProps) {
  const [imageName, setImageName] = useState('');
  const [diskFormat, setDiskFormat] = useState('raw');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setImageName('');
      setDiskFormat('raw');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!imageName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(imageName, diskFormat);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setImageName('');
    setDiskFormat('raw');
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
            disabled={!imageName.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header + Volume Info */}
        <VStack gap={3}>
          {/* Header */}
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Create Image from Volume
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Create a new image using this volume as the source. The image will contain all data currently stored on the volume and can be used to launch new instances.
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

        {/* Image Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Image name
          </label>
          <Input
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="e.g. db-date-image"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Disk Format Select */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Disk Format
          </label>
          <Select
            options={diskFormats}
            value={diskFormat}
            onChange={setDiskFormat}
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateImageFromVolumeDrawer;

