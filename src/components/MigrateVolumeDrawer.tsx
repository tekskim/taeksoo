import { useState } from 'react';
import {
  Drawer,
  Button,
  Radio,
  SearchInput,
  Pagination,
  ProgressBar,
  SelectionIndicator,
  InfoBox,
  Table,
  STATUS_THRESHOLDS,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface MigrateVolumeInfo {
  id: string;
  name: string;
  currentBackend: string;
}

export interface MigrateVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: MigrateVolumeInfo;
  onMigrate?: (backendId: string) => void;
}

/* ----------------------------------------
   Mock Data for Storage Backends
   ---------------------------------------- */

interface StorageBackendItem {
  id: string;
  name: string;
  protocol: string;
  backendName: string;
  capacityUsed: number;
  capacityTotal: number;
}

const mockBackends: StorageBackendItem[] = [
  ...Array.from({ length: 114 }, (_, i) => ({
    id: `backend-${i + 1}`,
    name: 'backend',
    protocol: 'ceph',
    backendName: 'ceph-cinder-ssd',
    capacityUsed: 6.0,
    capacityTotal: 10.0,
  })),
  {
    id: 'backend-115',
    name: 'backend',
    protocol: 'ceph',
    backendName: 'ceph-cinder-ssd',
    capacityUsed: 10.0,
    capacityTotal: 10.0,
  },
];

/* ----------------------------------------
   MigrateVolumeDrawer Component
   ---------------------------------------- */

export function MigrateVolumeDrawer({
  isOpen,
  onClose,
  volume,
  onMigrate,
}: MigrateVolumeDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Backend selection state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBackendId, setSelectedBackendId] = useState<string | null>(null);

  // Validation state
  const [backendError, setBackendError] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Filter backends based on search
  const filteredBackends = mockBackends.filter(
    (backend) =>
      backend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      backend.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      backend.backendName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBackends.length / ITEMS_PER_PAGE);
  const paginatedBackends = filteredBackends.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectBackend = (backendId: string) => {
    setSelectedBackendId(backendId);
    if (backendError) setBackendError(false);
  };

  const backendColumns: TableColumn<StorageBackendItem>[] = [
    {
      key: 'id' as keyof StorageBackendItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="backend-select"
            value={row.id}
            checked={selectedBackendId === row.id}
            onChange={() => handleSelectBackend(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      minWidth: '80px',
      sortable: true,
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.name}</span>
      ),
    },
    {
      key: 'protocol',
      label: 'Protocol',
      minWidth: '70px',
      sortable: true,
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.protocol}</span>
      ),
    },
    {
      key: 'backendName',
      label: 'Backend Name',
      flex: 1,
      minWidth: '120px',
      sortable: true,
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.backendName}</span>
      ),
    },
    {
      key: 'capacityUsed',
      label: 'Storage Capacity',
      flex: 1.2,
      minWidth: '170px',
      render: (_value, row) => {
        const percent = Math.round((row.capacityUsed / row.capacityTotal) * 100);
        return (
          <VStack gap={1} className="w-full">
            <span className="text-body-sm text-[var(--color-text-default)]">
              {row.capacityUsed.toFixed(2)}/{row.capacityTotal.toFixed(2)}GiB ({percent}%)
            </span>
            <ProgressBar
              value={row.capacityUsed}
              max={row.capacityTotal}
              showValue={false}
              size="sm"
              thresholds={STATUS_THRESHOLDS.computeAdmin}
            />
          </VStack>
        );
      },
    },
  ];

  const handleMigrate = () => {
    if (!selectedBackendId) {
      setBackendError(true);
      return;
    }
    setIsSubmitting(true);
    onMigrate?.(selectedBackendId);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedBackendId(null);
    setBackendError(false);
    onClose();
  };

  const selectedBackend = selectedBackendId
    ? mockBackends.find((b) => b.id === selectedBackendId)
    : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleMigrate} className="w-[152px]">
            Migrate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Title */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Migrate volume</h2>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            Migrates the volume to a different storage backend. The volume may be limited in
            availability during the migration process.
          </p>
        </VStack>

        {/* Volume Info */}
        <InfoBox.Group>
          <InfoBox label="Volume" value={volume.name} />
          <InfoBox label="Current storage backend" value={volume.currentBackend} />
        </InfoBox.Group>

        {/* Target Storage Backend Section */}
        <VStack gap={3} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            Target storage backend <span className="text-[var(--color-state-danger)]">*</span>
          </h3>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            Select the destination storage backend or volume type for the migration.
          </p>

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search storage backends by attributes"
            size="sm"
            className="w-[var(--search-input-width)]"
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredBackends.length}
            selectedCount={selectedBackendId ? 1 : 0}
          />

          {/* Table + Selection Indicator */}
          <VStack gap={2}>
            <Table
              columns={backendColumns}
              data={paginatedBackends}
              rowKey="id"
              onRowClick={(row) => handleSelectBackend(row.id)}
              emptyMessage="No storage backends found"
            />

            <SelectionIndicator
              selectedItems={
                selectedBackend ? [{ id: selectedBackend.id, label: selectedBackend.name }] : []
              }
              onRemove={() => setSelectedBackendId(null)}
              emptyText="No item selected"
              error={backendError}
              errorMessage="Please select a target storage backend."
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default MigrateVolumeDrawer;
