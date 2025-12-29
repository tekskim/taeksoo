import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput, 
  Pagination, 
  StatusIndicator,
  Table,
  Radio,
  InlineMessage,
  type TableColumn,
} from '@/design-system';
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

export interface DetachVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
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
  instanceName,
  volumes = mockVolumes,
  onDetach,
  onCreateNewNetwork,
}: DetachVolumeDrawerProps) {
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleDetach = async () => {
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
    onClose();
  };

  const filteredVolumes = volumes.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Table columns definition
  const columns: TableColumn<VolumeItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
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
      width: '59px',
      align: 'center',
      render: () => (
        <StatusIndicator status="active" layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.name}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: 30ujh345</span>
        </VStack>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'diskTag',
      label: 'Disk Tag',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
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
          <Button 
            variant="secondary" 
            onClick={handleClose}
            size="md"
            className="w-[152px]"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDetach}
            disabled={!selectedVolumeId || isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Detaching...' : 'Detach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={4}>
          <VStack gap={1}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Detach Volume
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Detach the selected volume from this instance. Once detached, it will no longer be accessible.
            </p>
          </VStack>

          {/* Warning Alert */}
          <InlineMessage variant="warning">
            For data consistency, stop all write operations on the instance before detaching a volume.
          </InlineMessage>

          {/* Instance Info Box */}
          <div className="w-full p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-muted)] mb-1">Instance Name</div>
            <div className="text-[14px] font-medium text-[var(--color-text-default)]">{instanceName}</div>
          </div>
        </VStack>

        {/* Volumes Section */}
        <VStack gap={4} className="flex-1 min-h-0">
          {/* Volumes Header */}
          <HStack justify="between" align="center" className="w-full">
            <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">Volumes</h3>
            <Button 
              variant="muted" 
              size="sm"
              onClick={onCreateNewNetwork}
              rightIcon={<IconExternalLink size={14} />}
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
              placeholder="Find volume with filters"
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
              size="sm"
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-[12px] text-[var(--color-text-muted)]">{totalItems} items</span>
          </HStack>

          {/* Volume Table */}
          <div className="flex-1 overflow-auto">
            <Table<VolumeItem>
              columns={columns}
              data={filteredVolumes}
              rowKey="id"
              selectedKeys={selectedVolumeId ? [selectedVolumeId] : []}
              onRowClick={(row) => setSelectedVolumeId(row.id)}
              emptyMessage="No volumes available"
            />
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default DetachVolumeDrawer;

