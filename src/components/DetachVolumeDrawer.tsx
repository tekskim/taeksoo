import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  Radio,
  SelectionIndicator,
  Table,
  InlineMessage,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeItem {
  id: string;
  name: string;
  status: 'available' | 'in-use' | 'error';
  type: string;
  size: string;
  diskTag: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface DetachVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  volumes?: VolumeItem[];
  onDetach?: (volumeId: string) => void;
  onCreateNewNetwork?: () => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumes: VolumeItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `vol-${i + 1}`,
  name: 'vol34',
  status: 'in-use',
  type: '_DEFAULT_',
  size: '1500GiB',
  diskTag: 'Data Disk',
}));

/* ----------------------------------------
   DetachVolumeDrawer Component
   ---------------------------------------- */

export function DetachVolumeDrawer({
  isOpen,
  onClose,
  instance,
  volumes = mockVolumes,
  onDetach,
  onCreateNewNetwork,
}: DetachVolumeDrawerProps) {
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleDetach = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedVolumeId) return;

    setIsSubmitting(true);
    try {
      await onDetach?.(selectedVolumeId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedVolumeId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const filteredVolumes = volumes.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedVolumes = filteredVolumes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      render: () => <StatusIndicator status="active" layout="icon-only" size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <span className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-[var(--color-action-primary)] truncate">
              {row.name}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </span>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : 30ujh345
          </span>
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'diskTag',
      label: 'Disk Tag',
      flex: 1,
      sortable: true,
    },
  ];

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
            onClick={handleDetach}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Detaching...' : 'Detach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Detach Volume
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Detach the selected volume from this instance. Once detached, it will no longer be
              accessible.
            </p>
          </VStack>

          {/* Warning Message */}
          <InlineMessage variant="error">
            For data consistency, stop all write operations on the instance before detaching a
            volume.
          </InlineMessage>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-body-sm text-[var(--color-text-subtle)] mb-1.5">Instance Name</div>
            <div className="text-body-md text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Volume Section */}
        <VStack gap={3} className="flex-1 min-h-0 pb-5">
          {/* Volume Header */}
          <HStack justify="between" align="center" className="w-full">
            <h3 className="text-label-lg text-[var(--color-text-default)]">Volumes</h3>
            <Button
              variant="muted"
              size="sm"
              onClick={onCreateNewNetwork}
              rightIcon={<IconExternalLink size={12} />}
            >
              Create a new network
            </Button>
          </HStack>

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
          <HStack gap={2} align="center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-body-sm text-[var(--color-text-subtle)]">{totalItems} items</span>
          </HStack>

          {/* Volume Table */}
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
                selectedVolumeId
                  ? [
                      {
                        id: selectedVolumeId,
                        label: volumes.find((v) => v.id === selectedVolumeId)?.name || '',
                      },
                    ]
                  : []
              }
              onRemove={() => setSelectedVolumeId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedVolumeId}
              errorMessage="Please select a volume."
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default DetachVolumeDrawer;
