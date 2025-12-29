import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
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

export interface SubnetItem {
  id: string;
  name: string;
  subnetCidr: string;
  allocationPools: string;
  networkName: string;
  networkId: string;
}

export interface DisconnectSubnetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routerName: string;
  subnets?: SubnetItem[];
  onDisconnect?: (subnetId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSubnets: SubnetItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  name: 'subnet-01',
  subnetCidr: '10.0.0.0/24',
  allocationPools: '10.7.21.0/200 - 10.7.21.0/299',
  networkName: 'net-01',
  networkId: `45ghj${567 + i}`,
}));

/* ----------------------------------------
   DisconnectSubnetDrawer Component
   ---------------------------------------- */

export function DisconnectSubnetDrawer({
  isOpen,
  onClose,
  routerName,
  subnets = mockSubnets,
  onDisconnect,
}: DisconnectSubnetDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubnetId, setSelectedSubnetId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  // Filtering and pagination
  const filteredSubnets = subnets.filter(
    (subnet) =>
      subnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subnet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subnet.subnetCidr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subnet.networkName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSubnets = filteredSubnets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<SubnetItem>[] = [
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
            href={`/subnets/${item.id}`}
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
      key: 'subnetCidr',
      label: 'Subnet CIDR',
    },
    {
      key: 'allocationPools',
      label: 'Allocation Pools',
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {item.allocationPools.split(' - ')[0]} -
          </span>
          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {item.allocationPools.split(' - ')[1]}
          </span>
        </VStack>
      ),
    },
    {
      key: 'network',
      label: 'Network',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/networks/${item.networkId}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{item.networkName}</span>
            <IconExternalLink size={12} className="flex-shrink-0" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.networkId}
          </span>
        </VStack>
      ),
    },
  ];

  const handleDisconnect = async () => {
    if (!selectedSubnetId) return;
    setIsSubmitting(true);
    try {
      await onDisconnect?.(selectedSubnetId);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedSubnetId(null);
    setCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Disconnect Subnet"
      description="Disconnect a subnet from this router to remove its routing path."
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="error"
            onClick={handleDisconnect}
            disabled={isSubmitting || !selectedSubnetId}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Warning Message */}
        <InlineMessage variant="error">
          Disconnecting this subnet will immediately stop routing traffic through this router. 
          Instances in the subnet may lose network connectivity.
        </InlineMessage>

        {/* Router Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Router
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {routerName}
          </p>
        </div>

        {/* Subnet Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Subnet
          </h6>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Find subnet with filters"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredSubnets.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredSubnets.length} items
            </span>
          </HStack>

          {/* Subnet Table */}
          <div className="flex-1 overflow-auto">
            <Table<SubnetItem>
              columns={columns}
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

export default DisconnectSubnetDrawer;

