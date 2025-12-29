import { useState, useMemo } from 'react';
import {
  Drawer,
  Button,
  Radio,
  SearchInput,
  Pagination,
  Table,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeSnapshotItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  type: string;
  size: string;
  createdAt: string;
}

export interface RestoreFromSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName: string;
  volumeSnapshots?: VolumeSnapshotItem[];
  onRestore?: (snapshotId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumeSnapshots: VolumeSnapshotItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: `snap-0${(i % 9) + 1}`,
  status: 'active',
  type: '_DEFAULT_',
  size: '1500GiB',
  createdAt: '2025-08-23',
}));

/* ----------------------------------------
   RestoreFromSnapshotDrawer Component
   ---------------------------------------- */

export function RestoreFromSnapshotDrawer({
  isOpen,
  onClose,
  volumeName,
  volumeSnapshots = mockVolumeSnapshots,
  onRestore,
}: RestoreFromSnapshotDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  // Filter snapshots based on search
  const filteredSnapshots = useMemo(
    () =>
      volumeSnapshots.filter(
        (snapshot) =>
          snapshot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snapshot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snapshot.type.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [volumeSnapshots, searchTerm]
  );

  // Paginate
  const paginatedSnapshots = filteredSnapshots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const snapshotColumns: TableColumn<VolumeSnapshotItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="snapshot-restore-select"
          value={row.id}
          checked={selectedSnapshotId === row.id}
          onChange={() => setSelectedSnapshotId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => <StatusIndicator status={item.status} layout="icon-only" size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/volume-snapshots/${item.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{item.name}</span>
            <IconExternalLink size={12} className="flex-shrink-0" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'size',
      label: 'Size',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
    },
  ];

  const handleRestore = async () => {
    if (!selectedSnapshotId) return;
    setIsSubmitting(true);
    try {
      await onRestore?.(selectedSnapshotId);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedSnapshotId(null);
    setSearchTerm('');
    setCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Restore From Snapshot"
      description="Create a new image using this volume as the source. The image will contain all data currently stored on the volume and can be used to launch new instances."
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRestore}
            disabled={isSubmitting || !selectedSnapshotId}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Restoring...' : 'Restore'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Volume Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Volume
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {volumeName}
          </p>
        </div>

        {/* Volume Snapshots Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Volume snapshots
          </h6>

          {/* Search Input */}
          <SearchInput
            placeholder="Find snapshot with filters"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-[280px]"
          />

          {/* Pagination */}
          <HStack gap={2} alignItems="center">
            <Pagination
              totalItems={filteredSnapshots.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredSnapshots.length} items
            </span>
          </HStack>

          {/* Snapshot Table */}
          <div className="flex-1 overflow-auto">
            <Table<VolumeSnapshotItem>
              columns={snapshotColumns}
              data={paginatedSnapshots}
              rowKey="id"
              selectedKeys={selectedSnapshotId ? [selectedSnapshotId] : []}
              onRowClick={(row) => setSelectedSnapshotId(row.id)}
              emptyMessage="No volume snapshots available"
            />
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default RestoreFromSnapshotDrawer;

