import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

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
  createdAt: 'Aug 23, 2025',
}));

const ITEMS_PER_PAGE = 5;

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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRestore}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Restoring...' : 'Restore'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={2}>
          <VStack gap={0}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Restore From Snapshot
            </h2>
          </VStack>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Create a new image using this volume as the source. The image will contain all data
            currently stored on the volume and can be used to launch new instances.
          </p>
        </VStack>

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
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            Volume snapshots
          </h3>

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
          />

          {/* Snapshots Table */}
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
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Name
                <IconChevronDown size={16} />
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Type
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Size
                <IconChevronDown size={16} />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Created At
                <IconChevronDown size={16} />
              </div>
            </div>

            {/* Rows */}
            {paginatedSnapshots.map((snap) => (
              <div
                key={snap.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedSnapshotId === snap.id
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => setSelectedSnapshotId(snap.id)}
              >
                {/* Radio */}
                <div
                  className="w-[var(--table-checkbox-width)] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Radio
                    name="snapshot-select"
                    value={snap.id}
                    checked={selectedSnapshotId === snap.id}
                    onChange={() => setSelectedSnapshotId(snap.id)}
                  />
                </div>
                {/* Status */}
                <div className="w-[59px] flex items-center justify-center">
                  <StatusIndicator status={snap.status} layout="icon-only" size="sm" />
                </div>
                {/* Name with ID */}
                <div className="flex-1 flex flex-col justify-center gap-0.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <HStack gap={1.5} align="center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                      {snap.name}
                    </span>
                    <IconExternalLink
                      size={16}
                      className="shrink-0 text-[var(--color-action-primary)]"
                    />
                  </HStack>
                  <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                    ID : {snap.id}
                  </span>
                </div>
                {/* Type */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {snap.type}
                  </span>
                </div>
                {/* Size */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {snap.size}GiB
                  </span>
                </div>
                {/* Created At */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {snap.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator */}
          <SelectionIndicator
            selectedItems={
              selectedSnapshot ? [{ id: selectedSnapshot.id, label: selectedSnapshot.name }] : []
            }
            onRemove={() => setSelectedSnapshotId(null)}
            emptyText="No item Selected"
            error={hasAttemptedSubmit && !selectedSnapshotId}
            errorMessage="Please select a snapshot."
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default RestoreFromSnapshotDrawer;
