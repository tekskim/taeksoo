import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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
        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
          {label}
        </span>
        <span className="text-[12px] text-[var(--color-text-default)] leading-4">
          {used}/{total}
        </span>
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
   RadioButton Component
   ---------------------------------------- */

interface RadioButtonProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  helpText?: string;
}

function RadioButton({ label, checked, onChange, helpText }: RadioButtonProps) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <div 
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
          checked 
            ? 'border-[#2563eb] bg-white' 
            : 'border-[#e2e8f0] bg-white'
        }`}
        onClick={onChange}
      >
        {checked && (
          <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
        )}
      </div>
      <span className="text-[12px] text-[var(--color-text-default)] leading-4">
        {label}
      </span>
      {helpText && (
        <Tooltip content={helpText}>
          <IconHelp 
            size={16} 
            className="text-[var(--color-text-default)] cursor-help" 
            stroke={1.5}
          />
        </Tooltip>
      )}
    </label>
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

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && volume) {
      // Generate default backup name with date
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      setBackupName(`vol-backup-${dateStr}`);
      setBackupMode('full');
    }
  }, [isOpen, volume]);

  const handleSubmit = async () => {
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
              label="Volume Backup Quota"
              used={volumeBackupQuota.used}
              total={volumeBackupQuota.total}
            />
            <QuotaProgressBar
              label="Volume Backup Capacity Quota(GiB)"
              used={volumeBackupCapacityQuota.used}
              total={volumeBackupCapacityQuota.total}
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
              disabled={!backupName.trim() || isSubmitting}
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
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Create Volume Backup
            </h2>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Create a full backup of this volume and store it in the backup service. The backup can be used to restore the volume or create new volumes in the future.
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

          {/* Warning Message */}
          <div className="w-full flex gap-2 p-3 bg-[var(--color-state-danger-bg)] rounded-lg">
            <IconAlertCircle 
              size={16} 
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5" 
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              For data consistency, stop all write operations on the instance before creating a backup.
            </p>
          </div>
        </VStack>

        {/* Backup Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Volume backup name
          </label>
          <Input
            value={backupName}
            onChange={(e) => setBackupName(e.target.value)}
            placeholder="Enter backup name"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Backup Mode */}
        <VStack gap={3} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Backup mode
          </label>
          <VStack gap={3}>
            <RadioButton
              label="Full Backup"
              checked={backupMode === 'full'}
              onChange={() => setBackupMode('full')}
            />
            <RadioButton
              label="Increment Backup"
              checked={backupMode === 'incremental'}
              onChange={() => setBackupMode('incremental')}
              helpText="Incremental backup only backs up the data that has changed since the last backup, saving storage space."
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeBackupDrawer;

