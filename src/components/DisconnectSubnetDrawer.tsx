import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  InlineMessage,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

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

  const itemsPerPage = 10;

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
          />

          {/* Subnet Table */}
          <div className="w-full flex flex-col gap-1">
            {/* Header */}
            <div className="flex items-center bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div className="w-[40px] p-3" />
              <div
                className="flex-1 px-3 py-2 h-[40px] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                onClick={() => handleSort('name')}
              >
                <span className="text-label-sm text-[var(--color-text-default)]">Name</span>
                <IconChevronDown
                  size={16}
                  className={`transition-transform ${sortField === 'name' && sortDirection === 'desc' ? 'rotate-180' : ''}`}
                />
              </div>
              <div className="flex-1 px-3 py-2 h-[40px] flex items-center border-l border-[var(--color-border-default)]">
                <span className="text-label-sm text-[var(--color-text-default)]">Subnet CIDR</span>
              </div>
              <div className="flex-1 px-3 py-2 h-[40px] flex items-center border-l border-[var(--color-border-default)]">
                <span className="text-label-sm text-[var(--color-text-default)]">
                  Allocation Pools
                </span>
              </div>
              <div
                className="flex-1 px-3 py-2 h-[40px] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                onClick={() => handleSort('networkName')}
              >
                <span className="text-label-sm text-[var(--color-text-default)]">Network</span>
                <IconChevronDown
                  size={16}
                  className={`transition-transform ${sortField === 'networkName' && sortDirection === 'desc' ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Rows */}
            {paginatedSubnets.map((item) => (
              <div
                key={item.id}
                className={`flex items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md cursor-pointer hover:bg-[var(--color-surface-subtle)] ${
                  selectedSubnetId === item.id ? 'border-[var(--color-action-primary)]' : ''
                }`}
                onClick={() => setSelectedSubnetId(item.id)}
              >
                <div className="w-[40px] p-3 flex items-center justify-center">
                  <Radio
                    checked={selectedSubnetId === item.id}
                    onChange={() => setSelectedSubnetId(item.id)}
                  />
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center gap-0.5">
                  <HStack gap={1.5} align="center">
                    <span className="text-label-md text-[var(--color-action-primary)] leading-4">
                      {item.name}
                    </span>
                    <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                  </HStack>
                  <span className="text-body-sm text-[var(--color-text-subtle)] leading-4">
                    ID : {item.id}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center">
                  <span className="text-body-md text-[var(--color-text-default)] leading-4">
                    {item.subnetCidr}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center">
                  <span className="text-body-md text-[var(--color-text-default)] leading-4 whitespace-pre-line">
                    {item.allocationPools.replace(' - ', ' -\n')}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 min-h-[40px] flex flex-col justify-center gap-0.5">
                  <HStack gap={1.5} align="center">
                    <span className="text-label-md text-[var(--color-action-primary)] leading-4">
                      {item.networkName}
                    </span>
                    <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                  </HStack>
                  <span className="text-body-sm text-[var(--color-text-subtle)] leading-4">
                    ID : {item.networkId}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator */}
          <SelectionIndicator
            selectedItems={
              selectedSubnet ? [{ id: selectedSubnet.id, label: selectedSubnet.name }] : []
            }
            onRemove={() => setSelectedSubnetId(null)}
            emptyText="No item Selected"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}
