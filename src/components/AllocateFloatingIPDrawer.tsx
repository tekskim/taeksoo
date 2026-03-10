import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
  Disclosure,
  Input,
  NumberInput,
  Table,
  FormField,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

// Types
interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  external: boolean;
  shared: string;
  subnetCidr: string;
}

type AllocationMode = 'automatic-single' | 'manual-single' | 'automatic-batch';

interface AllocateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  networks?: NetworkItem[];
  floatingIPQuota?: { used: number; total: number };
  onSubmit?: (data: {
    description?: string;
    networkId: string;
    allocationMode: AllocationMode;
    manualIPAddress?: string;
    count?: number;
  }) => void;
}

// Mock data
const mockNetworks: NetworkItem[] = [
  {
    id: 'net-1',
    name: 'net-03',
    status: 'active',
    external: true,
    shared: 'Public',
    subnetCidr: '192.168.10.0/22',
  },
  {
    id: 'net-2',
    name: 'net-03',
    status: 'active',
    external: true,
    shared: 'Public',
    subnetCidr: '192.168.10.0/22',
  },
  {
    id: 'net-3',
    name: 'net-03',
    status: 'active',
    external: true,
    shared: 'Public',
    subnetCidr: '192.168.10.0/22',
  },
  {
    id: 'net-4',
    name: 'net-03',
    status: 'active',
    external: true,
    shared: 'Public',
    subnetCidr: '192.168.10.0/22',
  },
  {
    id: 'net-5',
    name: 'net-03',
    status: 'active',
    external: true,
    shared: 'Public',
    subnetCidr: '192.168.10.0/22',
  },
];

const ITEMS_PER_PAGE = 5;

export function AllocateFloatingIPDrawer({
  isOpen,
  onClose,
  networks = mockNetworks,
  floatingIPQuota = { used: 2, total: 10 },
  onSubmit,
}: AllocateFloatingIPDrawerProps) {
  // Form state
  const [description, setDescription] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [allocationMode, setAllocationMode] = useState<AllocationMode>('automatic-single');
  const [manualIPAddress, setManualIPAddress] = useState('');
  const [count, setCount] = useState(1);

  // Search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Disclosure states
  const [isAllocationExpanded, setIsAllocationExpanded] = useState(true);

  // Sort state
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset state function
  const resetState = () => {
    setDescription('');
    setSelectedNetworkId(null);
    setAllocationMode('automatic-single');
    setManualIPAddress('');
    setCount(1);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
  };

  // Handle close with reset
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Filter networks
  const filteredNetworks = networks.filter(
    (net) =>
      net.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      net.subnetCidr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort networks
  const sortedNetworks = [...filteredNetworks].sort((a, b) => {
    const aValue = a[sortColumn as keyof NetworkItem];
    const bValue = b[sortColumn as keyof NetworkItem];
    const direction = sortDirection === 'asc' ? 1 : -1;
    return String(aValue).localeCompare(String(bValue)) * direction;
  });

  // Pagination
  const totalPages = Math.ceil(sortedNetworks.length / ITEMS_PER_PAGE);
  const paginatedNetworks = sortedNetworks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectedNetwork = networks.find((n) => n.id === selectedNetworkId);

  const networkColumns: TableColumn<NetworkItem>[] = [
    {
      key: 'id' as keyof NetworkItem,
      label: '',
      width: 40,
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="network-select"
            value={row.id}
            checked={selectedNetworkId === row.id}
            onChange={() => setSelectedNetworkId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 60,
      align: 'center',
      render: (_value, row) => <StatusIndicator layout="icon-only" status={row.status} size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <span
              className="text-label-md text-[var(--color-action-primary)] hover:underline truncate cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'external',
      label: 'External',
      render: (value) => (value ? 'Yes' : 'No'),
    },
    { key: 'shared', label: 'Shared' },
    { key: 'subnetCidr', label: 'Subnet CIDR' },
  ];

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);

    if (!selectedNetworkId) return;

    onSubmit?.({
      description: description || undefined,
      networkId: selectedNetworkId,
      allocationMode,
      manualIPAddress: allocationMode === 'manual-single' ? manualIPAddress : undefined,
      count: allocationMode === 'automatic-batch' ? count : undefined,
    });
    handleClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Allocate floating IP"
      width={696}
      footer={
        <VStack gap={4} className="w-full">
          {/* Quota Section */}
          <VStack gap={4} className="w-full">
            <VStack gap={2} className="w-full">
              <HStack justify="space-between" className="w-full">
                <span className="text-label-lg text-[var(--color-text-default)]">
                  Floating IP quota
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">
                  {floatingIPQuota.used}/{floatingIPQuota.total}
                </span>
              </HStack>
              <div className="w-full h-1 flex pr-1">
                <div
                  className="h-1 rounded-lg bg-[var(--color-state-success)] z-[3] -mr-1"
                  style={{ width: `${(floatingIPQuota.used / floatingIPQuota.total) * 100}%` }}
                />
                <div className="flex-1 h-1 rounded-lg bg-[var(--color-border-subtle)] z-[1]" />
              </div>
            </VStack>
          </VStack>

          {/* Buttons */}
          <HStack gap={2} justify="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} className="w-[152px]">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={false} className="w-[152px]">
              Allocate
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Description Field */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. my-prod-web-server-ip"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </FormField.HelperText>
        </FormField>

        {/* External Network Section */}
        <VStack gap={3} className="w-full">
          <VStack gap={1}>
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              External Network<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </h3>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select the network to allocate the floating IP.
            </span>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search network by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNetworks.length}
            onPageChange={setCurrentPage}
            selectedCount={selectedNetworkId ? 1 : 0}
          />

          <VStack gap={2}>
            <Table<NetworkItem>
              columns={networkColumns}
              data={paginatedNetworks}
              rowKey="id"
              onRowClick={(row) => setSelectedNetworkId(row.id)}
              emptyMessage="No networks found"
            />
            <SelectionIndicator
              selectedItems={
                selectedNetwork ? [{ id: selectedNetwork.id, label: selectedNetwork.name }] : []
              }
              onRemove={() => setSelectedNetworkId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedNetworkId}
              errorMessage="Please select a network."
              className="shrink-0 w-[648px]"
            />
          </VStack>
        </VStack>

        {/* Allocation Mode Section */}
        <Disclosure open={isAllocationExpanded} onChange={setIsAllocationExpanded}>
          <Disclosure.Trigger>Allocation</Disclosure.Trigger>
          <Disclosure.Panel>
            <VStack gap={3} className="pt-3">
              <FormField spacing="loose">
                <FormField.Label>Allocation mode</FormField.Label>
                <FormField.Description>
                  Choose the allocation mode for the floating IP.
                </FormField.Description>
                <FormField.Control>
                  <VStack gap={2}>
                    <Radio
                      checked={allocationMode === 'automatic-single'}
                      onChange={() => setAllocationMode('automatic-single')}
                      label="Automatic (single)"
                    />
                    <Radio
                      checked={allocationMode === 'manual-single'}
                      onChange={() => setAllocationMode('manual-single')}
                      label="Manual (single)"
                    />
                    <Radio
                      checked={allocationMode === 'automatic-batch'}
                      onChange={() => setAllocationMode('automatic-batch')}
                      label="Automatic (batch)"
                    />
                  </VStack>
                </FormField.Control>
              </FormField>

              {/* Manual IP Address Input */}
              {allocationMode === 'manual-single' && (
                <div className="w-[328px]">
                  <FormField>
                    <FormField.Label>Manual floating IP address</FormField.Label>
                    <FormField.Control>
                      <Input
                        value={manualIPAddress}
                        onChange={(e) => setManualIPAddress(e.target.value)}
                        placeholder="Input floating IP address"
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>
                </div>
              )}

              {/* Count Input for Batch */}
              {allocationMode === 'automatic-batch' && (
                <div className="w-[328px]">
                  <FormField>
                    <FormField.Label>Count</FormField.Label>
                    <FormField.Control>
                      <NumberInput
                        value={count}
                        onChange={(value) => setCount(value ?? 1)}
                        min={1}
                        max={floatingIPQuota.total - floatingIPQuota.used}
                        width="xs"
                      />
                    </FormField.Control>
                  </FormField>
                </div>
              )}
            </VStack>
          </Disclosure.Panel>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}
