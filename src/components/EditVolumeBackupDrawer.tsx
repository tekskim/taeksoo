import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeBackupInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditVolumeBackupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeBackup: VolumeBackupInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditVolumeBackupDrawer Component
   ---------------------------------------- */

export function EditVolumeBackupDrawer({
  isOpen,
  onClose,
  volumeBackup,
  onSubmit,
}: EditVolumeBackupDrawerProps) {
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volumeBackup) {
      setBackupName(volumeBackup.name);
      setDescription(volumeBackup.description ?? '');
    }
  }, [isOpen, volumeBackup]);

  const handleSubmit = async () => {
    if (!backupName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(backupName, description);
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
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
          Edit Volume Backup
        </h2>

        {/* Volume Snapshot Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Volume Snapshot Name
          </label>
          <Input
            value={backupName}
            onChange={(e) => setBackupName(e.target.value)}
            placeholder="Enter volume backup name"
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
            <span className="text-[12px] text-[var(--color-text-subtle)]">(optional)</span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. taken before applying DB patch"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditVolumeBackupDrawer;
