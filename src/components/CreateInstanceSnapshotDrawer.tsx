import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceInfo {
  id: string;
  name: string;
  status?: string;
  image?: string;
  flavor?: string;
}

export interface CreateInstanceSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo | null;
  onSubmit?: (snapshotName: string, description: string) => void;
}

/* ----------------------------------------
   CreateInstanceSnapshotDrawer Component
   ---------------------------------------- */

export function CreateInstanceSnapshotDrawer({
  isOpen,
  onClose,
  instance,
  onSubmit,
}: CreateInstanceSnapshotDrawerProps) {
  const [snapshotName, setSnapshotName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && instance) {
      // Generate default snapshot name with date
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      setSnapshotName(`${instance.name}-snap-${dateStr}`);
      setDescription('');
    }
  }, [isOpen, instance]);

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
    setSnapshotName('');
    setDescription('');
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
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header + Instance Info + Warning Group */}
        <VStack gap={3}>
          {/* Header */}
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Create Instance Snapshot
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Create a snapshot of this instance to capture its current system state as an image.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <p className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-1.5">
              Instance
            </p>
            <p className="text-[12px] text-[var(--color-text-default)]">
              {instance?.name || '-'}
            </p>
          </div>

          {/* Warning Message */}
          <div className="w-full flex gap-2 p-3 bg-[#fef2f2] rounded-lg">
            <IconAlertCircle 
              size={16} 
              className="text-[#f87171] shrink-0 mt-0.5" 
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              For data consistency, stop all write operations on the instance before creating a snapshot.
            </p>
          </div>
        </VStack>

        {/* Snapshot Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Snapshot name
          </label>
          <Input
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            placeholder="Enter snapshot name"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <div className="flex items-center gap-1">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Description
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)]">
              (optional)
            </span>
          </div>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateInstanceSnapshotDrawer;
