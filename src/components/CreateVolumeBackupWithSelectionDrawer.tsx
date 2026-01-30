import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown, IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeItem {
  id: string;
  name: string;
  size: number; // in GiB
  status: 'active' | 'error' | 'building';
  attachedTo?: string;
  diskTag?: string;
}

export interface QuotaInfo {
  used: number;
  total: number | null; // null means unlimited
}

export type BackupMode = 'full' | 'incremental';

export interface CreateVolumeBackupWithSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumes?: VolumeItem[];
  volumeBackupQuota?: QuotaInfo;
  typeBackupQuota?: QuotaInfo;
  onSubmit?: (volumeId: string, backupName: string, description: string, mode: BackupMode) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultVolumes: VolumeItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `vol-${i + 1}`,
  name: 'vol-01',
  size: 10,
  status: 'active',
  attachedTo: 'web-server-1',
  diskTag: 'Data Disk',
}));

const ITEMS_PER_PAGE = 5;

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
  const percentage = !isUnlimited && total > 0 ? (used / total) * 100 : 0;
  const nextPercentage = !isUnlimited && total > 0 ? ((used + 1) / total) * 100 : 0;

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between items-center">
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">{label}</span>
        <HStack gap={0} align="center">
          <span className="text-body-md text-[var(--color-text-default)] leading-4">{used}/</span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" />
          ) : (
            <span className="text-body-md text-[var(--color-text-default)] leading-4">{total}</span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
        {/* Current usage (darker green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#4ade80] rounded-lg z-[2]"
          style={{ width: isUnlimited ? '5%' : `${Math.min(percentage, 100)}%` }}
        />
        {/* Next usage preview (lighter green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#bbf7d0] rounded-lg z-[1]"
          style={{ width: isUnlimited ? '10%' : `${Math.min(nextPercentage, 100)}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateVolumeBackupWithSelectionDrawer Component
   ---------------------------------------- */

export function CreateVolumeBackupWithSelectionDrawer({
  isOpen,
  onClose,
  volumes = defaultVolumes,
  volumeBackupQuota = { used: 2, total: 10 },
  typeBackupQuota = { used: 2, total: null },
  onSubmit,
}: CreateVolumeBackupWithSelectionDrawerProps) {
  // Volume selection state
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [backupMode, setBackupMode] = useState<BackupMode>('full');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter volumes
  const filteredVolumes = volumes.filter(
    (vol) =>
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.attachedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.diskTag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVolumes.length / ITEMS_PER_PAGE);
  const paginatedVolumes = filteredVolumes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedVolumeId(null);
      setSearchQuery('');
      setCurrentPage(1);
      setBackupName('');
      setDescription('');
      setBackupMode('full');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedVolumeId || !backupName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedVolumeId, backupName, description, backupMode);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedVolumeId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setBackupName('');
    setDescription('');
    setBackupMode('full');
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedVolume = volumes.find((v) => v.id === selectedVolumeId);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <VStack gap={4} className="w-full">
          {/* Quota Section */}
          <VStack gap={4} className="w-full">
            <QuotaProgressBar
              label="Volume Backup Quota"
              used={volumeBackupQuota.used}
              total={volumeBackupQuota.total}
            />
            <QuotaProgressBar
              label="_DEFAULT_type Backup Quota"
              used={typeBackupQuota.used}
              total={typeBackupQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <HStack gap={2} justify="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[152px] h-8"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header */}
        <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
          Create Volume Backup
        </h2>

        {/* Volumes Section */}
        <VStack gap={3}>
          <h3 className="text-label-lg text-[var(--color-text-default)]">Volumes</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search volume by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredVolumes.length}
            onPageChange={setCurrentPage}
          />

          {/* Volumes Table */}
          <div
            className="flex flex-col gap-[var(--table-row-gap)]"
            style={{ width: '648px', maxWidth: '648px' }}
          >
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
              <div className="w-[59px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Status
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Name
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Size
                <IconChevronDown size={12} />
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Attach To
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Disk Tag
                <IconChevronDown size={12} />
              </div>
            </div>

            {/* Rows */}
            {paginatedVolumes.map((vol) => (
              <div
                key={vol.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedVolumeId === vol.id
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => setSelectedVolumeId(vol.id)}
              >
                {/* Radio */}
                <div
                  className="w-[var(--table-checkbox-width)] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Radio
                    name="volume-select"
                    value={vol.id}
                    checked={selectedVolumeId === vol.id}
                    onChange={() => setSelectedVolumeId(vol.id)}
                  />
                </div>
                {/* Status */}
                <div className="w-[59px] flex items-center justify-center">
                  <StatusIndicator status={vol.status} layout="icon-only" size="sm" />
                </div>
                {/* Name */}
                <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                    {vol.name}
                  </span>
                  <IconExternalLink
                    size={12}
                    className="shrink-0 text-[var(--color-action-primary)]"
                  />
                </div>
                {/* Size */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {vol.size} GiB
                  </span>
                </div>
                {/* Attach To */}
                <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  {vol.attachedTo ? (
                    <>
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                        {vol.attachedTo}
                      </span>
                      <IconExternalLink
                        size={12}
                        className="shrink-0 text-[var(--color-action-primary)]"
                      />
                    </>
                  ) : (
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-subtle)]">
                      -
                    </span>
                  )}
                </div>
                {/* Disk Tag */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {vol.diskTag || '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator */}
          <SelectionIndicator
            selectedItems={
              selectedVolume ? [{ id: selectedVolume.id, label: selectedVolume.name }] : []
            }
            onRemove={() => setSelectedVolumeId(null)}
            emptyText="No item Selected"
            error={!selectedVolumeId && hasAttemptedSubmit}
            errorMessage="Please select a volume"
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

        {/* Backup Mode */}
        <VStack gap={3}>
          <span className="text-label-lg text-[var(--color-text-default)]">Backup mode</span>
          <VStack gap={3}>
            <Radio
              name="backup-mode"
              value="full"
              checked={backupMode === 'full'}
              onChange={() => setBackupMode('full')}
              label="Full Backup"
            />
            <Radio
              name="backup-mode"
              value="incremental"
              checked={backupMode === 'incremental'}
              onChange={() => setBackupMode('incremental')}
              label="Increment Backup"
            />
          </VStack>
        </VStack>

        {/* Volume Backup Name */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">Volume Backup name</span>
          <Input
            value={backupName}
            onChange={(e) => setBackupName(e.target.value)}
            placeholder="e.g. data-backup"
            fullWidth
          />
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </span>
        </VStack>

        {/* Description */}
        <VStack gap={2} className="pb-5">
          <span className="text-label-lg text-[var(--color-text-default)]">
            Description (optional)
          </span>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. data-snap"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeBackupWithSelectionDrawer;
