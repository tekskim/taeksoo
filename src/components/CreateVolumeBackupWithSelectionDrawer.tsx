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
  Table,
  FormField,
  Tooltip,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconInfinity, IconHelpCircle } from '@tabler/icons-react';

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
        <span className="text-label-md text-[var(--color-text-default)]">{label}</span>
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

  const volumeColumns: TableColumn<VolumeItem>[] = [
    {
      key: 'radio',
      label: '',
      width: '40px',
      render: (_, row) => (
        <Radio
          name="volume-select"
          value={row.id}
          checked={selectedVolumeId === row.id}
          onChange={() => setSelectedVolumeId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_, row) => <StatusIndicator layout="icon-only" status={row.status} size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.name}
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">{row.id}</span>
        </div>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
      render: (_, row) => `${row.size} GiB`,
    },
    {
      key: 'attachedTo',
      label: 'Attach to',
      flex: 1,
      render: (_, row) =>
        row.attachedTo ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.attachedTo}
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">{row.id}</span>
          </div>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'diskTag',
      label: 'Disk tag',
      flex: 1,
      render: (value) => value || '-',
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create volume backup"
      width={696}
      footer={
        <VStack gap={0} className="w-full">
          {/* Quota Section */}
          <VStack gap={4} className="w-full pb-[24px]">
            <QuotaProgressBar
              label="Volume backup quota"
              used={volumeBackupQuota.used}
              total={volumeBackupQuota.total}
            />
            <QuotaProgressBar
              label="_DEFAULT_type backup quota"
              used={typeBackupQuota.used}
              total={typeBackupQuota.total}
            />
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Buttons */}
          <HStack gap={2} justify="center" className="w-full pt-[24px]">
            <Button variant="secondary" onClick={handleClose} className="w-[152px]">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[152px]"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header */}
        {/* Volumes Section */}
        <VStack gap={3}>
          <h3 className="text-label-lg text-[var(--color-text-default)]">
            Volumes <span className="text-[var(--color-state-danger)]">*</span>
          </h3>

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
            selectedCount={selectedVolumeId ? 1 : 0}
          />

          {/* Volumes Table */}
          <VStack gap={2}>
            <Table<VolumeItem>
              columns={volumeColumns}
              data={paginatedVolumes}
              rowKey="id"
              onRowClick={(row) => setSelectedVolumeId(row.id)}
              emptyMessage="No volumes found"
            />
            <SelectionIndicator
              selectedItems={
                selectedVolume ? [{ id: selectedVolume.id, label: selectedVolume.name }] : []
              }
              onRemove={() => setSelectedVolumeId(null)}
              emptyText="No item selected"
              error={!selectedVolumeId && hasAttemptedSubmit}
              errorMessage="Please select a volume"
            />
          </VStack>
        </VStack>

        {/* Form Fields Section */}
        <VStack gap={6}>
          {/* Backup Mode */}
          <FormField label="Backup mode" spacing="loose" required>
            <VStack gap={2}>
              <Radio
                name="backup-mode"
                value="full"
                checked={backupMode === 'full'}
                onChange={() => setBackupMode('full')}
                label="Full backup"
              />
              <HStack gap={1.5} align="center">
                <Radio
                  name="backup-mode"
                  value="incremental"
                  checked={backupMode === 'incremental'}
                  onChange={() => setBackupMode('incremental')}
                  label="Increment backup"
                />
                <Tooltip
                  content="Backup only changes since the last backup. Actual quota usage cannot be precisely estimated."
                  position="right"
                >
                  <IconHelpCircle size={14} className="text-[var(--color-text-subtle)]" />
                </Tooltip>
              </HStack>
            </VStack>
          </FormField>

          {/* Volume Backup Name */}
          <FormField required>
            <FormField.Label>Volume backup name</FormField.Label>
            <FormField.Control>
              <Input
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="e.g. data-backup"
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              You can use letters, numbers, and special characters (+=,.@-_), and the length must be
              between 2-128 characters.
            </FormField.HelperText>
          </FormField>

          {/* Description */}
          <FormField className="pb-[24px]">
            <FormField.Label>Description</FormField.Label>
            <FormField.Control>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. data-snap"
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>
              You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
              characters.
            </FormField.HelperText>
          </FormField>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeBackupWithSelectionDrawer;
