import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, FormField } from '@/design-system';
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
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setImageName('');
      setDiskFormat('raw');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
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
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Create Image from Volume
            </h2>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Create a new image using this volume as the source. The image will contain all data
              currently stored on the volume and can be used to launch new instances.
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

        {/* Image Name Input */}
        <FormField required error={hasAttemptedSubmit && !imageName.trim()}>
          <FormField.Label>Image name</FormField.Label>
          <FormField.Control>
            <Input
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="e.g. db-date-image"
              fullWidth
              error={hasAttemptedSubmit && !imageName.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Image name is required</FormField.ErrorMessage>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Disk Format Select */}
        <FormField>
          <FormField.Label>Disk format</FormField.Label>
          <FormField.Control>
            <Select options={diskFormats} value={diskFormat} onChange={setDiskFormat} fullWidth />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateImageFromVolumeDrawer;
