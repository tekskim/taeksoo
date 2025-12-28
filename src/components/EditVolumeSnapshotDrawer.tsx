import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeSnapshotInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditVolumeSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeSnapshot: VolumeSnapshotInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditVolumeSnapshotDrawer Component
   ---------------------------------------- */

export function EditVolumeSnapshotDrawer({
  isOpen,
  onClose,
  volumeSnapshot,
  onSubmit,
}: EditVolumeSnapshotDrawerProps) {
  const [snapshotName, setSnapshotName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volumeSnapshot) {
      setSnapshotName(volumeSnapshot.name);
      setDescription(volumeSnapshot.description ?? '');
    }
  }, [isOpen, volumeSnapshot]);

  const handleSubmit = async () => {
    if (!snapshotName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(snapshotName, description);
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
            disabled={!snapshotName.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
          Edit Volume Snapshots
        </h2>

        {/* Volume Snapshot Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Volume Snapshot Name
          </label>
          <Input
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            placeholder="Enter volume snapshot name"
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
            placeholder="e.g. taken before applying DB patch"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditVolumeSnapshotDrawer;

