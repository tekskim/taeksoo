import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  InlineMessage,
  SelectionIndicator,
  Table,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SubnetItem {
  id: string;
  name: string;
  subnetCidr: string;
  allocationPools: string;
  networkName: string;
  networkId: string;
}

export interface RouterInfo {
  name: string;
}

export interface DisconnectSubnetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  router: RouterInfo;
  subnets?: SubnetItem[];
  onSubmit?: (subnetId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSubnets: SubnetItem[] = [
  {
    id: 'sub-1',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-2',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-3',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-4',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-5',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-6',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-7',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-8',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-9',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
  {
    id: 'sub-10',
    name: 'subnet-01',
    subnetCidr: '10.0.0.0/24',
    allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
    networkName: 'net-01',
    networkId: '45ghj567',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function DisconnectSubnetDrawer({
  isOpen,
  onClose,
  router,
  subnets = mockSubnets,
  onSubmit,
}: DisconnectSubnetDrawerProps) {
  const [selectedSubnetId, setSelectedSubnetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'networkName' | null>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSubnetId(null);
      setSearchQuery('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  // Filtering and sorting
  const filteredSubnets = subnets
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subnetCidr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.networkName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      const comparison = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const paginatedSubnets = filteredSubnets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSubnets.length / itemsPerPage);

  const selectedSubnet = subnets.find((item) => item.id === selectedSubnetId);

  const handleSort = (field: 'name' | 'networkName') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSubmit = () => {
    if (selectedSubnetId && onSubmit) {
      onSubmit(selectedSubnetId);
    }
    onClose();
  };

  const subnetColumns: TableColumn<SubnetItem>[] = [
    {
      key: 'id' as keyof SubnetItem,
      label: '',
      width: 40,
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="subnet-select"
            value={row.id}
            checked={selectedSubnetId === row.id}
            onChange={() => setSelectedSubnetId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.name}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
    },
    {
      key: 'allocationPools',
      label: 'Allocation pools',
      render: (_value, row) => (
        <span className="whitespace-pre-line">{row.allocationPools.replace(' - ', '\n')}</span>
      ),
    },
    {
      key: 'networkName',
      label: 'Network',
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.networkName}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.networkId}
          </span>
        </div>
      ),
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Disconnect subnet"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={onClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={false}
            className="w-[152px] h-8"
          >
            Disconnect
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Description */}
        <VStack gap={3} className="w-full">
          <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
            Disconnect a subnet from this router to remove its routing path.
          </p>

          {/* Warning Message */}
          <InlineMessage variant="error">
            Disconnecting this subnet will immediately stop routing traffic through this router.
            Instances in the subnet may lose network connectivity.
          </InlineMessage>

          {/* Router Info */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <p className="text-label-sm text-[var(--color-text-subtle)] leading-4 mb-1.5">Router</p>
            <p className="text-body-md text-[var(--color-text-default)] leading-4">{router.name}</p>
          </div>
        </VStack>

        {/* Subnet Section */}
        <VStack gap={3} className="w-full pb-5">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">Subnet</h3>

          <div className="w-[280px]">
            <SearchInput
              placeholder="Search subnet by attributes"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSubnets.length}
            onPageChange={setCurrentPage}
            selectedCount={selectedSubnetId ? 1 : 0}
          />

          <VStack gap={2}>
            <Table<SubnetItem>
              columns={subnetColumns}
              data={paginatedSubnets}
              rowKey="id"
              onRowClick={(row) => setSelectedSubnetId(row.id)}
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
