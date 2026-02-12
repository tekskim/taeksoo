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
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  size: string;
  access: string;
  subnetCidr: string;
}

export interface SubnetItem {
  id: string;
  name: string;
  allocationPools: string;
}

export interface RouterInfo {
  name: string;
}

export interface ConnectSubnetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  router: RouterInfo;
  networks?: NetworkItem[];
  subnets?: SubnetItem[];
  onSubmit?: (data: { networkId: string; subnetId: string }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const MOCK_NETWORKS: NetworkItem[] = [
  {
    id: '45ghj567',
    name: 'net-01',
    status: 'active',
    size: 'Yes',
    access: 'Private',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '45ghj568',
    name: 'net-02',
    status: 'active',
    size: 'Yes',
    access: 'Private',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '45ghj569',
    name: 'net-03',
    status: 'active',
    size: 'Yes',
    access: 'Private',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '45ghj570',
    name: 'net-04',
    status: 'active',
    size: 'Yes',
    access: 'Private',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '45ghj571',
    name: 'net-05',
    status: 'active',
    size: 'Yes',
    access: 'Private',
    subnetCidr: '10.0.0.0/24',
  },
  {
    id: '45ghj572',
    name: 'net-06',
    status: 'active',
    size: 'Yes',
    access: 'Private',
    subnetCidr: '10.0.0.0/24',
  },
];

const MOCK_SUBNETS: SubnetItem[] = [
  { id: '31jkl890', name: 'subnet-01', allocationPools: '10.7.21.0/200 - 10.7.21.0/299' },
  { id: '31jkl891', name: 'subnet-02', allocationPools: '10.7.21.0/200 - 10.7.21.0/299' },
  { id: '31jkl892', name: 'subnet-03', allocationPools: '10.7.21.0/200 - 10.7.21.0/299' },
  { id: '31jkl893', name: 'subnet-04', allocationPools: '10.7.21.0/200 - 10.7.21.0/299' },
  { id: '31jkl894', name: 'subnet-05', allocationPools: '10.7.21.0/200 - 10.7.21.0/299' },
  { id: '31jkl895', name: 'subnet-06', allocationPools: '10.7.21.0/200 - 10.7.21.0/299' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ConnectSubnetDrawer({
  isOpen,
  onClose,
  router,
  networks = MOCK_NETWORKS,
  subnets = MOCK_SUBNETS,
  onSubmit,
}: ConnectSubnetDrawerProps) {
  // Network selection state
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);
  const [networkSortKey, setNetworkSortKey] = useState<'name' | 'size' | 'access'>('name');
  const [networkSortDir, setNetworkSortDir] = useState<'asc' | 'desc'>('asc');

  // Subnet selection state
  const [selectedSubnetId, setSelectedSubnetId] = useState<string | null>(null);
  const [subnetSearch, setSubnetSearch] = useState('');
  const [subnetPage, setSubnetPage] = useState(1);
  const [subnetSortKey, setSubnetSortKey] = useState<'name'>('name');
  const [subnetSortDir, setSubnetSortDir] = useState<'asc' | 'desc'>('asc');

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    if (!isOpen) {
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  // Reset state function
  const resetState = () => {
    setSelectedNetworkId(null);
    setSelectedSubnetId(null);
    setNetworkSearch('');
    setSubnetSearch('');
    setNetworkPage(1);
    setSubnetPage(1);
  };

  // Handle close with reset
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Network filtering and sorting
  const filteredNetworks = networks
    .filter(
      (n) =>
        n.name.toLowerCase().includes(networkSearch.toLowerCase()) ||
        n.id.toLowerCase().includes(networkSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[networkSortKey];
      const bVal = b[networkSortKey];
      const cmp = aVal.localeCompare(bVal);
      return networkSortDir === 'asc' ? cmp : -cmp;
    });

  const networkTotalPages = Math.ceil(filteredNetworks.length / itemsPerPage);
  const paginatedNetworks = filteredNetworks.slice(
    (networkPage - 1) * itemsPerPage,
    networkPage * itemsPerPage
  );

  // Subnet filtering and sorting
  const filteredSubnets = subnets
    .filter(
      (s) =>
        s.name.toLowerCase().includes(subnetSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(subnetSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[subnetSortKey];
      const bVal = b[subnetSortKey];
      const cmp = aVal.localeCompare(bVal);
      return subnetSortDir === 'asc' ? cmp : -cmp;
    });

  const subnetTotalPages = Math.ceil(filteredSubnets.length / itemsPerPage);
  const paginatedSubnets = filteredSubnets.slice(
    (subnetPage - 1) * itemsPerPage,
    subnetPage * itemsPerPage
  );

  // Find selected items
  const selectedNetwork = networks.find((n) => n.id === selectedNetworkId);
  const selectedSubnet = subnets.find((s) => s.id === selectedSubnetId);

  const networkColumns: TableColumn<NetworkItem>[] = [
    {
      key: 'id' as keyof NetworkItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="network-select"
            value={row.id}
            checked={selectedNetworkId === row.id}
            onChange={() => {
              setSelectedNetworkId(row.id);
            }}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_value, row) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)]">{row.name}</span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    { key: 'size', label: 'Size', flex: 1 },
    { key: 'access', label: 'Access', flex: 1 },
    { key: 'subnetCidr', label: 'Subnet CIDR', flex: 1 },
  ];

  const subnetColumns: TableColumn<SubnetItem>[] = [
    {
      key: 'id' as keyof SubnetItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="subnet-select"
            value={row.id}
            checked={selectedSubnetId === row.id}
            onChange={() => {
              setSelectedSubnetId(row.id);
            }}
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)]">{row.name}</span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    { key: 'allocationPools', label: 'Allocation pools', flex: 1 },
  ];

  // Handle submit
  const handleSubmit = () => {
    setHasAttemptedSubmit(true);

    if (!selectedNetworkId || !selectedSubnetId) {
      return;
    }

    onSubmit?.({ networkId: selectedNetworkId, subnetId: selectedSubnetId });
    handleClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Connect subnet"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="w-[152px] h-8">
            Connect
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Description */}
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          Connect an existing subnet to this router to enable routing between networks. Once
          connected, instances within the subnet can communicate with other subnets or access
          external networks (if an external gateway is configured).
        </p>

        {/* Router Info Box */}
        <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <VStack gap={1.5}>
            <span className="text-label-sm text-[var(--color-text-subtle)]">Router</span>
            <span className="text-body-md text-[var(--color-text-default)]">{router.name}</span>
          </VStack>
        </div>

        {/* Network Section */}
        <VStack gap={3} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">Network</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Search network by attributes"
              value={networkSearch}
              onChange={(e) => {
                setNetworkSearch(e.target.value);
                setNetworkPage(1);
              }}
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={networkPage}
            totalPages={networkTotalPages}
            onPageChange={setNetworkPage}
            totalItems={filteredNetworks.length}
            showItemCount
          />

          <VStack gap={2}>
            <Table<NetworkItem>
              columns={networkColumns}
              data={paginatedNetworks}
              rowKey="id"
              onRowClick={(row) => {
                setSelectedNetworkId(row.id);
              }}
              emptyMessage="No networks found"
            />
            <SelectionIndicator
              selectedItems={
                selectedNetwork ? [{ id: selectedNetwork.id, label: selectedNetwork.name }] : []
              }
              onRemove={() => setSelectedNetworkId(null)}
              emptyText="No item selected"
            />
          </VStack>
        </VStack>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

        {/* Subnet Section */}
        <VStack gap={3} className="w-full pb-6">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">Subnet</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Search subnet by attributes"
              value={subnetSearch}
              onChange={(e) => {
                setSubnetSearch(e.target.value);
                setSubnetPage(1);
              }}
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={subnetPage}
            totalPages={subnetTotalPages}
            onPageChange={setSubnetPage}
            totalItems={filteredSubnets.length}
            showItemCount
          />

          <VStack gap={2}>
            <Table<SubnetItem>
              columns={subnetColumns}
              data={paginatedSubnets}
              rowKey="id"
              onRowClick={(row) => {
                setSelectedSubnetId(row.id);
              }}
              emptyMessage="No subnets found"
            />
            <SelectionIndicator
              selectedItems={
                selectedSubnet ? [{ id: selectedSubnet.id, label: selectedSubnet.name }] : []
              }
              onRemove={() => setSelectedSubnetId(null)}
              emptyText="No item selected"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ConnectSubnetDrawer;
