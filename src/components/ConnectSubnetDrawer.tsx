import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Radio,
  StatusIndicator,
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
  status: 'active' | 'inactive' | 'error';
  size: 'Yes' | 'No';
  access: 'Private' | 'Public';
  subnetCidr: string;
}

export interface SubnetItem {
  id: string;
  name: string;
  allocationPools: string;
}

export interface ConnectSubnetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routerName: string;
  networks?: NetworkItem[];
  subnets?: SubnetItem[];
  onConnect?: (networkId: string, subnetId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: NetworkItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  name: 'net-01',
  status: 'active',
  size: 'Yes',
  access: 'Private',
  subnetCidr: '10.0.0.0/24',
}));

const mockSubnets: SubnetItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `31jkl${890 + i}`,
  name: 'subnet-01',
  allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
}));

/* ----------------------------------------
   ConnectSubnetDrawer Component
   ---------------------------------------- */

export function ConnectSubnetDrawer({
  isOpen,
  onClose,
  routerName,
  networks = mockNetworks,
  subnets = mockSubnets,
  onConnect,
}: ConnectSubnetDrawerProps) {
  // Network state
  const [networkSearchTerm, setNetworkSearchTerm] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [networkCurrentPage, setNetworkCurrentPage] = useState(1);

  // Subnet state
  const [subnetSearchTerm, setSubnetSearchTerm] = useState('');
  const [selectedSubnetId, setSelectedSubnetId] = useState<string | null>(null);
  const [subnetCurrentPage, setSubnetCurrentPage] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 5;

  // Network filtering and pagination
  const filteredNetworks = networks.filter(
    (network) =>
      network.name.toLowerCase().includes(networkSearchTerm.toLowerCase()) ||
      network.id.toLowerCase().includes(networkSearchTerm.toLowerCase()) ||
      network.subnetCidr.toLowerCase().includes(networkSearchTerm.toLowerCase())
  );

  const paginatedNetworks = filteredNetworks.slice(
    (networkCurrentPage - 1) * itemsPerPage,
    networkCurrentPage * itemsPerPage
  );

  // Subnet filtering and pagination
  const filteredSubnets = subnets.filter(
    (subnet) =>
      subnet.name.toLowerCase().includes(subnetSearchTerm.toLowerCase()) ||
      subnet.id.toLowerCase().includes(subnetSearchTerm.toLowerCase()) ||
      subnet.allocationPools.toLowerCase().includes(subnetSearchTerm.toLowerCase())
  );

  const paginatedSubnets = filteredSubnets.slice(
    (subnetCurrentPage - 1) * itemsPerPage,
    subnetCurrentPage * itemsPerPage
  );

  const networkColumns: TableColumn<NetworkItem>[] = [
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
      render: (_, item) => (
        <StatusIndicator status={item.status} layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/networks/${item.id}`}
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
      key: 'size',
      label: 'Size',
    },
    {
      key: 'access',
      label: 'Access',
      sortable: true,
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
    },
  ];

  const subnetColumns: TableColumn<SubnetItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="subnet-select"
          value={row.id}
          checked={selectedSubnetId === row.id}
          onChange={() => setSelectedSubnetId(row.id)}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/networks/${item.id}`}
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
      key: 'allocationPools',
      label: 'Allocation Pools',
    },
  ];

  const handleConnect = async () => {
    if (!selectedNetworkId || !selectedSubnetId) return;
    setIsSubmitting(true);
    try {
      await onConnect?.(selectedNetworkId, selectedSubnetId);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNetworkSearchTerm('');
    setSubnetSearchTerm('');
    setSelectedNetworkId(null);
    setSelectedSubnetId(null);
    setNetworkCurrentPage(1);
    setSubnetCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Connect Subnet"
      description="Connect an existing subnet to this router to enable routing between networks. Once connected, instances within the subnet can communicate with other subnets or access external networks (if an external gateway is configured)."
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConnect}
            disabled={isSubmitting || !selectedNetworkId || !selectedSubnetId}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Connecting...' : 'Connect'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Router Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Router
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {routerName}
          </p>
        </div>

        {/* Network Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Network
          </h6>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Find network with filters"
              value={networkSearchTerm}
              onChange={(e) => setNetworkSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredNetworks.length}
              itemsPerPage={itemsPerPage}
              currentPage={networkCurrentPage}
              onPageChange={setNetworkCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredNetworks.length} items
            </span>
          </HStack>

          {/* Network Table */}
          <div className="overflow-auto">
            <Table<NetworkItem>
              columns={networkColumns}
              data={paginatedNetworks}
              rowKey="id"
              selectedKeys={selectedNetworkId ? [selectedNetworkId] : []}
              onRowClick={(row) => setSelectedNetworkId(row.id)}
              emptyMessage="No networks available"
            />
          </div>
        </VStack>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-default)]" />

        {/* Subnet Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Subnet
          </h6>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Find subnet with filters"
              value={subnetSearchTerm}
              onChange={(e) => setSubnetSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredSubnets.length}
              itemsPerPage={itemsPerPage}
              currentPage={subnetCurrentPage}
              onPageChange={setSubnetCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredSubnets.length} items
            </span>
          </HStack>

          {/* Subnet Table */}
          <div className="overflow-auto">
            <Table<SubnetItem>
              columns={subnetColumns}
              data={paginatedSubnets}
              rowKey="id"
              selectedKeys={selectedSubnetId ? [selectedSubnetId] : []}
              onRowClick={(row) => setSelectedSubnetId(row.id)}
              emptyMessage="No subnets available"
            />
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ConnectSubnetDrawer;

