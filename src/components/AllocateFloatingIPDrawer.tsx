import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  StatusIndicator,
  Radio,
  Input,
  SelectBox,
  NumberInput,
  Disclosure,
  ProgressBar,
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
  external: string;
  shared: string;
  subnetCidr: string;
}

export interface AllocateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  networks?: NetworkItem[];
  quotaUsed?: number;
  quotaTotal?: number;
  onAllocate?: (data: {
    description: string;
    networkId: string;
    allocationMethod: string;
    manualIp?: string;
    count?: number;
    dnsDomain?: string;
    dnsName?: string;
  }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: NetworkItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  name: `net-0${(i % 5) + 1}`,
  status: 'active',
  external: 'Yes',
  shared: 'Public',
  subnetCidr: '192.168.10.0/22',
}));

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function AllocateFloatingIPDrawer({
  isOpen,
  onClose,
  networks = mockNetworks,
  quotaUsed = 2,
  quotaTotal = 10,
  onAllocate,
}: AllocateFloatingIPDrawerProps) {
  // Form state
  const [description, setDescription] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [allocationMethod, setAllocationMethod] = useState<'automatic-single' | 'manual-single' | 'automatic-batch'>('automatic-single');
  const [manualIp, setManualIp] = useState('');
  const [count, setCount] = useState(1);
  const [dnsDomain, setDnsDomain] = useState('');
  const [dnsName, setDnsName] = useState('');

  // Search & pagination state
  const [networkSearchTerm, setNetworkSearchTerm] = useState('');
  const [networkPage, setNetworkPage] = useState(1);

  // Disclosure state
  const [showAllocationOptions, setShowAllocationOptions] = useState(true);
  const [showDnsOptions, setShowDnsOptions] = useState(false);

  const networkItemsPerPage = 5;

  // Filtering
  const filteredNetworks = networks.filter(
    (n) =>
      n.name.toLowerCase().includes(networkSearchTerm.toLowerCase()) ||
      n.id.toLowerCase().includes(networkSearchTerm.toLowerCase()) ||
      n.subnetCidr.includes(networkSearchTerm)
  );

  // Pagination
  const paginatedNetworks = filteredNetworks.slice(
    (networkPage - 1) * networkItemsPerPage,
    networkPage * networkItemsPerPage
  );

  // Network columns
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
      key: 'external',
      label: 'External',
    },
    {
      key: 'shared',
      label: 'Shared',
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
    },
  ];

  // DNS Domain options
  const dnsDomainOptions = [
    { label: 'No domain selected', value: '' },
    { label: 'thakicloud.com', value: 'thakicloud.com' },
    { label: 'example.com', value: 'example.com' },
  ];

  // FQDN calculation
  const fqdn = dnsName && dnsDomain ? `${dnsName}.${dnsDomain}` : '';

  // Quota percentage
  const quotaPercentage = quotaTotal > 0 ? (quotaUsed / quotaTotal) * 100 : 0;
  const newQuotaPercentage = quotaTotal > 0 
    ? ((quotaUsed + (allocationMethod === 'automatic-batch' ? count : 1)) / quotaTotal) * 100 
    : 0;

  const handleAllocate = () => {
    if (selectedNetworkId) {
      onAllocate?.({
        description,
        networkId: selectedNetworkId,
        allocationMethod,
        manualIp: allocationMethod === 'manual-single' ? manualIp : undefined,
        count: allocationMethod === 'automatic-batch' ? count : undefined,
        dnsDomain: dnsDomain || undefined,
        dnsName: dnsName || undefined,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setDescription('');
    setSelectedNetworkId(null);
    setAllocationMethod('automatic-single');
    setManualIp('');
    setCount(1);
    setDnsDomain('');
    setDnsName('');
    setNetworkSearchTerm('');
    setNetworkPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Allocate Floating IP"
      width={696}
      footer={
        <VStack gap={4} className="w-full">
          {/* Quota Section */}
          <div className="w-full px-0">
            <HStack justifyContent="between" className="mb-2">
              <span className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
                Floating IP Quota
              </span>
              <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                {quotaUsed}/{quotaTotal}
              </span>
            </HStack>
            <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-[var(--color-state-success)] rounded-lg z-[2]"
                style={{ width: `${quotaPercentage}%` }}
              />
              <div 
                className="absolute left-0 top-0 h-full bg-green-200 rounded-lg z-[1]"
                style={{ width: `${newQuotaPercentage}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <HStack gap={2} justifyContent="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAllocate}
              disabled={!selectedNetworkId}
              size="md"
              className="w-[152px]"
            >
              Allocate
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Description Section */}
        <VStack gap={2} className="w-full">
          <HStack gap={1.5} alignItems="center">
            <span className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
              Description
            </span>
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
              (Optional)
            </span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. my-prod-web-server-ip"
            className="w-full"
          />
        </VStack>

        {/* External Network Section */}
        <VStack gap={3} className="w-full">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            External Network
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
              itemsPerPage={networkItemsPerPage}
              currentPage={networkPage}
              onPageChange={setNetworkPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredNetworks.length} items
            </span>
          </HStack>

          {/* Network Table */}
          <div className="overflow-auto w-full">
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
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

        {/* Allocation Options Disclosure */}
        <Disclosure
          title="Allocation Options"
          expanded={showAllocationOptions}
          onToggle={() => setShowAllocationOptions(!showAllocationOptions)}
        >
          <VStack gap={4} className="w-full max-w-[328px]">
            {/* Allocation Method */}
            <VStack gap={3}>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Radio
                    name="allocation-method"
                    value="automatic-single"
                    checked={allocationMethod === 'automatic-single'}
                    onChange={() => setAllocationMethod('automatic-single')}
                  />
                  <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                    Automatic (Single)
                  </span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Radio
                    name="allocation-method"
                    value="manual-single"
                    checked={allocationMethod === 'manual-single'}
                    onChange={() => setAllocationMethod('manual-single')}
                  />
                  <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                    Manual (Single)
                  </span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Radio
                    name="allocation-method"
                    value="automatic-batch"
                    checked={allocationMethod === 'automatic-batch'}
                    onChange={() => setAllocationMethod('automatic-batch')}
                  />
                  <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                    Automatic (Batch)
                  </span>
                </label>
              </div>
            </VStack>

            {/* Manual IP Address Input (shown when manual-single is selected) */}
            {allocationMethod === 'manual-single' && (
              <VStack gap={2} className="w-full">
                <span className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
                  Manual floating IP address
                </span>
                <Input
                  value={manualIp}
                  onChange={(e) => setManualIp(e.target.value)}
                  placeholder="Input floating IP address"
                  className="w-full"
                />
              </VStack>
            )}

            {/* Count Input (shown when automatic-batch is selected) */}
            {allocationMethod === 'automatic-batch' && (
              <VStack gap={2} className="w-full">
                <span className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
                  Count
                </span>
                <NumberInput
                  value={count}
                  onChange={setCount}
                  min={1}
                  max={quotaTotal - quotaUsed}
                  className="w-full"
                />
              </VStack>
            )}
          </VStack>
        </Disclosure>

        {/* DNS Options Disclosure */}
        <Disclosure
          title="DNS Options"
          expanded={showDnsOptions}
          onToggle={() => setShowDnsOptions(!showDnsOptions)}
        >
          <VStack gap={4} className="w-full max-w-[328px]">
            {/* DNS Domain */}
            <VStack gap={2} className="w-full">
              <span className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
                DNS Domain
              </span>
              <SelectBox
                value={dnsDomain}
                onChange={setDnsDomain}
                options={dnsDomainOptions}
                className="w-full"
              />
            </VStack>

            {/* DNS Name */}
            <VStack gap={2} className="w-full">
              <span className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
                DNS Name
              </span>
              <Input
                value={dnsName}
                onChange={(e) => setDnsName(e.target.value)}
                placeholder="e.g. my-web"
                disabled={!dnsDomain}
                className="w-full"
              />
              {fqdn && (
                <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                  FQDN : {fqdn}
                </span>
              )}
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                Allowed: 1–63 characters; lowercase letters, numbers, "-"; no leading/trailing hyphens.
              </span>
            </VStack>
          </VStack>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}

export default AllocateFloatingIPDrawer;

