import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput, 
  Pagination, 
  StatusIndicator,
  Table,
  Radio,
  Select,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'down' | 'error';
  subnetCidr: string;
  external: string;
  shared: string;
  inThisProject: string;
}

export interface AttachInterfaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  networks?: NetworkItem[];
  onAttach?: (networkId: string, fixedIp: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: NetworkItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `net-${i + 1}`,
  name: 'net-02',
  status: 'active',
  subnetCidr: '192.168.20.0/24',
  external: 'No',
  shared: 'On',
  inThisProject: 'Yes',
}));

/* ----------------------------------------
   AttachInterfaceDrawer Component
   ---------------------------------------- */

export function AttachInterfaceDrawer({
  isOpen,
  onClose,
  instanceName,
  networks = mockNetworks,
  onAttach,
}: AttachInterfaceDrawerProps) {
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubnet, setSelectedSubnet] = useState<string>('');
  const [selectedFixedIp, setSelectedFixedIp] = useState<string>('auto-assign');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAttach = async () => {
    if (!selectedNetworkId) return;
    
    setIsSubmitting(true);
    try {
      await onAttach?.(selectedNetworkId, selectedFixedIp);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedNetworkId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedSubnet('');
    setSelectedFixedIp('auto-assign');
    onClose();
  };

  const filteredNetworks = networks.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Table columns definition
  const columns: TableColumn<NetworkItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="network-select"
          value={row.id}
          checked={selectedNetworkId === row.id}
          onChange={() => setSelectedNetworkId(row.id)}
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
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: 17kfj123</span>
        </VStack>
      ),
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'external',
      label: 'External',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'shared',
      label: 'Shared',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'inThisProject',
      label: 'In This Project',
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
            disabled={!selectedNetworkId || isSubmitting}
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
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Attach Interface
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              Attach a new network interface to this instance. You can connect it to another network or subnet for additional access.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-muted)] mb-1">Instance Name</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instanceName}</div>
          </div>
        </VStack>

        {/* Networks Section */}
        <VStack gap={3} className="flex-1 min-h-0">
          {/* Networks Header */}
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Networks</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Find network with filters"
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
            <span className="text-[11px] text-[var(--color-text-muted)]">{totalItems} items</span>
          </HStack>

          {/* Network Table */}
          <div className="flex-1 overflow-auto">
            <Table<NetworkItem>
              columns={columns}
              data={filteredNetworks}
              rowKey="id"
              selectedKeys={selectedNetworkId ? [selectedNetworkId] : []}
              onRowClick={(row) => setSelectedNetworkId(row.id)}
              emptyMessage="No networks available"
            />
          </div>
        </VStack>

        {/* Fixed IP Section */}
        <VStack gap={2}>
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Fixed IP</h3>
          
          {/* Subnet Select (disabled until network selected) */}
          <Select
            value={selectedSubnet}
            onChange={setSelectedSubnet}
            disabled={!selectedNetworkId}
            placeholder="Select subnet"
            options={[
              { value: 'subnet-1', label: 'Subnet 1' },
              { value: 'subnet-2', label: 'Subnet 2' },
            ]}
            fullWidth
          />

          {/* Fixed IP Select */}
          <Select
            value={selectedFixedIp}
            onChange={setSelectedFixedIp}
            options={[
              { value: 'auto-assign', label: 'Auto-assign' },
              { value: 'manual', label: 'Manual' },
            ]}
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AttachInterfaceDrawer;


