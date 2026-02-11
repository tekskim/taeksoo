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
  Select,
  NumberInput,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

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
  dnsOptions?: { value: string; label: string }[];
  onSubmit?: (data: {
    description?: string;
    networkId: string;
    allocationMode: AllocationMode;
    manualIPAddress?: string;
    count?: number;
    dnsDomain?: string;
    dnsName?: string;
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

const mockDnsOptions = [
  { value: '', label: 'No domain selected' },
  { value: 'thakicloud.com', label: 'thakicloud.com' },
  { value: 'example.com', label: 'example.com' },
];

const ITEMS_PER_PAGE = 5;

export function AllocateFloatingIPDrawer({
  isOpen,
  onClose,
  networks = mockNetworks,
  floatingIPQuota = { used: 2, total: 10 },
  dnsOptions = mockDnsOptions,
  onSubmit,
}: AllocateFloatingIPDrawerProps) {
  // Form state
  const [description, setDescription] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [allocationMode, setAllocationMode] = useState<AllocationMode>('automatic-single');
  const [manualIPAddress, setManualIPAddress] = useState('');
  const [count, setCount] = useState(1);
  const [dnsDomain, setDnsDomain] = useState('');
  const [dnsName, setDnsName] = useState('');

  // Search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Disclosure states
  const [isAllocationExpanded, setIsAllocationExpanded] = useState(true);
  const [isDnsExpanded, setIsDnsExpanded] = useState(false);

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
    setDnsDomain('');
    setDnsName('');
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const selectedNetwork = networks.find((n) => n.id === selectedNetworkId);

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);

    if (!selectedNetworkId) return;

    onSubmit?.({
      description: description || undefined,
      networkId: selectedNetworkId,
      allocationMode,
      manualIPAddress: allocationMode === 'manual-single' ? manualIPAddress : undefined,
      count: allocationMode === 'automatic-batch' ? count : undefined,
      dnsDomain: dnsDomain || undefined,
      dnsName: dnsName || undefined,
    });
    handleClose();
  };

  const fqdn = dnsName && dnsDomain ? `${dnsName}.${dnsDomain}` : '';

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
                  Floating IP Quota
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
            <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={false}
              className="w-[152px] h-8"
            >
              Allocate
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Description Field */}
        <VStack gap={2} className="w-full">
          <HStack gap={1.5} align="center">
            <span className="text-label-lg text-[var(--color-text-default)]">Description</span>
            <span className="text-body-md text-[var(--color-text-subtle)]">(Optional)</span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. my-prod-web-server-ip"
            fullWidth
          />
        </VStack>

        {/* External Network Section */}
        <VStack gap={3} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            External Network
          </h3>

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
          />

          <VStack gap={2}>
            {/* Network Table */}
            <div
              className="flex flex-col gap-[var(--table-row-gap)] w-full"
              style={{ maxWidth: '648px' }}
            >
              {/* Header */}
              <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
                <div className="w-[59px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center justify-center border-l border-[var(--color-border-default)]">
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Status
                  </span>
                </div>
                <div
                  className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                  onClick={() => handleSort('name')}
                >
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Name
                  </span>
                  <IconChevronDown
                    size={16}
                    className={`transition-transform ${sortColumn === 'name' && sortDirection === 'desc' ? 'rotate-180' : ''}`}
                  />
                </div>
                <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    External
                  </span>
                </div>
                <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Shared
                  </span>
                </div>
                <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Subnet CIDR
                  </span>
                </div>
              </div>

              {/* Rows */}
              {paginatedNetworks.map((network) => (
                <div
                  key={network.id}
                  className={`flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] cursor-pointer hover:bg-[var(--table-row-hover-bg)] transition-all ${
                    selectedNetworkId === network.id
                      ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]'
                      : ''
                  }`}
                  onClick={() => setSelectedNetworkId(network.id)}
                >
                  <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                    <Radio
                      checked={selectedNetworkId === network.id}
                      onChange={() => setSelectedNetworkId(network.id)}
                    />
                  </div>
                  <div className="w-[59px] flex items-center justify-center">
                    <StatusIndicator status={network.status} layout="icon-only" size="sm" />
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex flex-col justify-center gap-0.5 min-w-0 overflow-hidden">
                    <HStack gap={1.5} align="center">
                      <a
                        href="#"
                        className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {network.name}
                      </a>
                      <IconExternalLink
                        size={12}
                        stroke={1.5}
                        className="shrink-0 text-[var(--color-action-primary)]"
                      />
                    </HStack>
                    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                      ID : {network.id}
                    </span>
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center min-w-0 overflow-hidden">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                      {network.external ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center min-w-0 overflow-hidden">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                      {network.shared}
                    </span>
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center min-w-0 overflow-hidden">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                      {network.subnetCidr}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Indicator */}
            <SelectionIndicator
              selectedItems={
                selectedNetwork ? [{ id: selectedNetwork.id, label: selectedNetwork.name }] : []
              }
              onRemove={() => setSelectedNetworkId(null)}
              emptyText="No item Selected"
              error={hasAttemptedSubmit && !selectedNetworkId}
              errorMessage="Please select a network."
              className="shrink-0"
              style={{ width: '648px' }}
            />
          </VStack>
        </VStack>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

        {/* Allocation Mode Section */}
        <Disclosure open={isAllocationExpanded} onChange={setIsAllocationExpanded}>
          <Disclosure.Trigger>Allocation</Disclosure.Trigger>
          <Disclosure.Panel>
            <VStack gap={3} className="pt-3">
              <VStack gap={3}>
                <Radio
                  checked={allocationMode === 'automatic-single'}
                  onChange={() => setAllocationMode('automatic-single')}
                  label="Automatic (Single)"
                />
                <Radio
                  checked={allocationMode === 'manual-single'}
                  onChange={() => setAllocationMode('manual-single')}
                  label="Manual (Single)"
                />
                <Radio
                  checked={allocationMode === 'automatic-batch'}
                  onChange={() => setAllocationMode('automatic-batch')}
                  label="Automatic (Batch)"
                />
              </VStack>

              {/* Manual IP Address Input */}
              {allocationMode === 'manual-single' && (
                <VStack gap={2} className="w-[328px]">
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    Manual floating IP address
                  </span>
                  <Input
                    value={manualIPAddress}
                    onChange={(e) => setManualIPAddress(e.target.value)}
                    placeholder="Input floating IP address"
                    fullWidth
                  />
                </VStack>
              )}

              {/* Count Input for Batch */}
              {allocationMode === 'automatic-batch' && (
                <VStack gap={2} className="w-[328px]">
                  <span className="text-label-lg text-[var(--color-text-default)]">Count</span>
                  <NumberInput
                    value={count}
                    onChange={(value) => setCount(value ?? 1)}
                    min={1}
                    max={floatingIPQuota.total - floatingIPQuota.used}
                    fullWidth
                  />
                </VStack>
              )}
            </VStack>
          </Disclosure.Panel>
        </Disclosure>

        {/* DNS Settings Section */}
        <Disclosure open={isDnsExpanded} onChange={setIsDnsExpanded}>
          <Disclosure.Trigger>DNS</Disclosure.Trigger>
          <Disclosure.Panel>
            <VStack gap={4} className="pt-3 w-[328px]">
              {/* DNS Domain */}
              <VStack gap={2}>
                <span className="text-label-lg text-[var(--color-text-default)]">DNS Domain</span>
                <Select
                  value={dnsDomain}
                  onChange={setDnsDomain}
                  options={dnsOptions}
                  placeholder="No domain selected"
                  fullWidth
                />
              </VStack>

              {/* DNS Name */}
              <VStack gap={2}>
                <span className="text-label-lg text-[var(--color-text-default)]">DNS Name</span>
                <Input
                  value={dnsName}
                  onChange={(e) => setDnsName(e.target.value)}
                  placeholder="e.g. my-web"
                  disabled={!dnsDomain}
                  fullWidth
                />
                {fqdn && (
                  <span className="text-body-md text-[var(--color-text-default)]">
                    FQDN : {fqdn}
                  </span>
                )}
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  Allowed: 1–63 characters; lowercase letters, numbers, "-"; no leading/trailing
                  hyphens.
                </span>
              </VStack>
            </VStack>
          </Disclosure.Panel>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}
