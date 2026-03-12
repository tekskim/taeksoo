import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
  Table,
  fixedColumns,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeSnapshotItem {
  id: string;
  name: string;
  type: string;
  size: number; // in GiB
  status: 'active' | 'error' | 'building';
  createdAt: string;
}

export interface VolumeInfo {
  id: string;
  name: string;
}

export interface RestoreFromSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo;
  snapshots?: VolumeSnapshotItem[];
  onRestore?: (snapshotId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultSnapshots: VolumeSnapshotItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'snap-01',
  type: '_DEFAULT_',
  size: 1500,
  status: 'active',
  createdAt: 'Aug 23, 2025 20:06:42',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   Column definitions
   ---------------------------------------- */

const getSnapshotColumns = (
  selectedSnapshotId: string | null,
  onSelect: (id: string) => void
): TableColumn<VolumeSnapshotItem>[] => [
  {
    key: 'radio' as keyof VolumeSnapshotItem,
    label: '',
    width: '40px',
    render: (_, row) => (
      <Radio
        name="snapshot-select"
        value={row.id}
        checked={selectedSnapshotId === row.id}
        onChange={() => onSelect(row.id)}
      />
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.status,
    align: 'center',
    render: (_, row) => <StatusIndicator layout="icon-only" status={row.status} size="sm" />,
  },
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.name}
          </span>
          <IconExternalLink size={12} className="shrink-0 text-[var(--color-action-primary)]" />
        </span>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID : {row.id}</span>
      </div>
    ),
  },
  { key: 'type', label: 'Type', flex: 1 },
  {
    key: 'size',
    label: 'Size',
    flex: 1,
    sortable: true,
    render: (_, row) => <>{row.size}GiB</>,
  },
  { key: 'createdAt', label: 'Created at', flex: 1, sortable: true },
];

/* ----------------------------------------
   RestoreFromSnapshotDrawer Component
   ---------------------------------------- */

export function RestoreFromSnapshotDrawer({
  isOpen,
  onClose,
  volume,
  snapshots = defaultSnapshots,
  onRestore,
}: RestoreFromSnapshotDrawerProps) {
  // Snapshot selection state
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter snapshots
  const filteredSnapshots = snapshots.filter(
    (snap) =>
      snap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snap.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snap.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSnapshots.length / ITEMS_PER_PAGE);
  const paginatedSnapshots = filteredSnapshots.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSnapshotId(null);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleRestore = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedSnapshotId) return;

    setIsSubmitting(true);
    try {
      await onRestore?.(selectedSnapshotId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedSnapshotId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedSnapshot = snapshots.find((s) => s.id === selectedSnapshotId);
  const snapshotColumns = getSnapshotColumns(selectedSnapshotId, setSelectedSnapshotId);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Restore From Snapshot"
      description="Restore this volume to a previous state using the selected snapshot. All existing data on the volume will be replaced with the snapshot data."
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRestore}
            disabled={isSubmitting}
            className="w-[152px]"
          >
            {isSubmitting ? 'Restoring...' : 'Restore'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Volume Info Box */}
        <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <VStack gap={1.5}>
            <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">Volume</span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {volume.name}
            </span>
          </VStack>
        </div>

        {/* Volume Snapshots Section */}
        <VStack gap={3}>
          <VStack gap={1}>
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              Volume snapshots<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </h3>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select a snapshot from the list to use for the restore operation.
            </span>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search snapshot by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSnapshots.length}
            onPageChange={setCurrentPage}
            selectedCount={selectedSnapshotId ? 1 : 0}
          />

          {/* Snapshots Table + Selection Indicator */}
          <VStack gap={2} className="w-full">
            <Table<VolumeSnapshotItem>
              columns={snapshotColumns}
              data={paginatedSnapshots}
              rowKey="id"
              onRowClick={(row) => setSelectedSnapshotId(row.id)}
              emptyMessage="No snapshots found"
            />

            <SelectionIndicator
              selectedItems={
                selectedSnapshot ? [{ id: selectedSnapshot.id, label: selectedSnapshot.name }] : []
              }
              onRemove={() => setSelectedSnapshotId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedSnapshotId}
              errorMessage="Please select a snapshot."
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default RestoreFromSnapshotDrawer;
