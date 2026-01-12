import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput, 
  Tabs, 
  TabList, 
  Tab, 
  Pagination, 
  StatusIndicator,
  Table,
  Radio,
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

export interface AttachVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  volumes?: VolumeItem[];
  onAttach?: (volumeId: string) => void;
  onCreateNewVolume?: () => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumes: VolumeItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `vol-${i + 1}`,
  name: 'vol34',
  status: 'available',
  type: '_DEFAULT_',
  size: '1500GiB',
  diskTag: 'Data Disk',
}));

/* ----------------------------------------
   AttachVolumeDrawer Component
   ---------------------------------------- */

export function AttachVolumeDrawer({
  isOpen,
  onClose,
  instanceName,
  volumes = mockVolumes,
  onAttach,
  onCreateNewVolume,
}: AttachVolumeDrawerProps) {
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAttach = async () => {
    if (!selectedVolumeId) return;
    
    setIsSubmitting(true);
    try {
      await onAttach?.(selectedVolumeId);
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
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'diskTag',
      label: 'Disk Tag',
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
            onClick={handleAttach}
            disabled={!selectedVolumeId || isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={4}>
          <VStack gap={1}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Attach Volume
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Attach an existing volume to this instance. Once attached, it will appear as a new block device inside your instance.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-muted)] mb-1">Instance</div>
            <div className="text-[14px] font-medium text-[var(--color-text-default)]">{instanceName}</div>
          </div>
        </VStack>

        {/* Volume Section */}
        <VStack gap={4} className="flex-1 min-h-0">
          {/* Volume Header */}
          <HStack justify="between" align="center" className="w-full">
            <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">Volume</h3>
            <Button 
              variant="muted" 
              size="sm"
              onClick={onCreateNewVolume}
              rightIcon={<IconExternalLink size={14} />}
            >
              Create a new volume
            </Button>
          </HStack>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="underline"
            size="sm"
          >
            <TabList>
              <Tab value="available">Available</Tab>
              <Tab value="shared">Shared</Tab>
            </TabList>
          </Tabs>

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

export default AttachVolumeDrawer;
