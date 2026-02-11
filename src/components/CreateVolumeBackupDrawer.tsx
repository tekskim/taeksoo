import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Radio, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconAlertCircle, IconHelp } from '@tabler/icons-react';
import { Tooltip } from '@/design-system';

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
  total: number;
}

export type BackupMode = 'full' | 'incremental';

export interface CreateVolumeBackupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo | null;
  volumeBackupQuota?: QuotaInfo;
  volumeBackupCapacityQuota?: QuotaInfo;
  onSubmit?: (backupName: string, mode: BackupMode) => void;
}

/* ----------------------------------------
   QuotaProgressBar Component
   ---------------------------------------- */

interface QuotaProgressBarProps {
  label: string;
  used: number;
  total: number;
}

function QuotaProgressBar({ label, used, total }: QuotaProgressBarProps) {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const nextPercentage = total > 0 ? ((used + 1) / total) * 100 : 0;

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between items-center">
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)] leading-4">
          {used}/{total}
        </span>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
        {/* Current usage (darker green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[var(--component-status-indicator-active-bg)] rounded-lg z-[2]"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Next usage preview (lighter green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[var(--primitive-color-green200)] rounded-lg z-[1]"
          style={{ width: `${Math.min(nextPercentage, 100)}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateVolumeBackupDrawer Component
   ---------------------------------------- */

export function CreateVolumeBackupDrawer({
  isOpen,
  onClose,
  volume,
  volumeBackupQuota = { used: 1, total: 10 },
  volumeBackupCapacityQuota = { used: 20, total: 1000 },
  onSubmit,
}: CreateVolumeBackupDrawerProps) {
  const [backupName, setBackupName] = useState('');
  const [backupMode, setBackupMode] = useState<BackupMode>('full');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volume) {
      // Generate default backup name with date
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      setBackupName(`vol-backup-${dateStr}`);
      setBackupMode('full');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, volume]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!backupName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(backupName, backupMode);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setBackupName('');
    setBackupMode('full');
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
              label="Volume backup quota"
              used={volumeBackupQuota.used}
              total={volumeBackupQuota.total}
            />
            <QuotaProgressBar
              label="Volume backup capacity quota (GiB)"
              used={volumeBackupCapacityQuota.used}
              total={volumeBackupCapacityQuota.total}
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
        {/* Header + Volume Info + Warning Group */}
        <VStack gap={3}>
          {/* Header */}
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Create volume backup
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Create a full backup of this volume and store it in the backup service. The backup can
              be used to restore the volume or create new volumes in the future.
            </p>
          </VStack>

          {/* Volume Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <p className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">Volume</p>
            <p className="text-body-md text-[var(--color-text-default)]">
              {volume ? `${volume.name} (${volume.size}GiB)` : '-'}
            </p>
          </div>

          {/* Warning Message */}
          <div className="w-full flex gap-2 p-3 bg-[var(--color-state-danger-bg)] rounded-lg">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              For data consistency, stop all write operations on the instance before creating a
              backup.
            </p>
          </div>
        </VStack>

        {/* Backup Name Input */}
        <FormField required error={hasAttemptedSubmit && !backupName.trim()}>
          <FormField.Label>Volume backup name</FormField.Label>
          <FormField.Control>
            <Input
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="Enter backup name"
              fullWidth
              error={hasAttemptedSubmit && !backupName.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Backup name is required</FormField.ErrorMessage>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Backup Mode */}
        <FormField>
          <FormField.Label>Backup mode</FormField.Label>
          <FormField.Control>
            <VStack gap={2}>
              <Radio
                name="backup-mode"
                value="full"
                label="Full backup"
                checked={backupMode === 'full'}
                onChange={() => setBackupMode('full')}
              />
              <HStack gap={1.5} align="center">
                <Radio
                  name="backup-mode"
                  value="incremental"
                  label="Increment backup"
                  checked={backupMode === 'incremental'}
                  onChange={() => setBackupMode('incremental')}
                />
                <Tooltip content="Incremental backup only backs up the data that has changed since the last backup, saving storage space.">
                  <IconHelp
                    size={12}
                    className="text-[var(--color-text-subtle)] cursor-help"
                    stroke={1.5}
                  />
                </Tooltip>
              </HStack>
            </VStack>
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeBackupDrawer;
