import { useState } from 'react';
import {
  Drawer,
  Button,
  Input,
  Toggle,
  Disclosure,
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
  subnetCidr: string;
  size: 'On' | 'Off';
}

export interface CreateRouterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  networks?: NetworkItem[];
  routerQuota?: { used: number; total: number };
  onCreate?: (data: {
    routerName: string;
    description?: string;
    adminState: boolean;
    externalGateway: boolean;
    selectedNetworkId?: string;
  }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: NetworkItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `net-${i + 1}`,
  name: `net-0${(i % 9) + 1}`,
  status: 'active' as const,
  subnetCidr: '10.0.0.0/24',
  size: 'On' as const,
}));

/* ----------------------------------------
   Quota Bar Component
   ---------------------------------------- */

function QuotaBar({ label, used, total }: { label: string; used: number; total: number }) {
  const percentage = Math.min((used / total) * 100, 100);

  return (
    <VStack gap={2} className="w-full">
      <HStack justifyContent="between" className="w-full">
        <span className="text-[14px] font-medium text-[var(--color-text-default)]">{label}</span>
        <span className="text-[12px] text-[var(--color-text-default)]">
          {used}/{total}
        </span>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-surface-muted)] rounded-full overflow-hidden flex">
        <div
          className="h-full rounded-full bg-[var(--color-state-success)]"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="h-full rounded-full bg-[#bbf7d0] -ml-1"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateRouterDrawer Component
   ---------------------------------------- */

export function CreateRouterDrawer({
  isOpen,
  onClose,
  networks = mockNetworks,
  routerQuota = { used: 5, total: 10 },
  onCreate,
}: CreateRouterDrawerProps) {
  const [routerName, setRouterName] = useState('');
  const [description, setDescription] = useState('');
  const [adminState, setAdminState] = useState(true);
  const [externalGateway, setExternalGateway] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 5;

  const filteredNetworks = networks.filter(
    (network) =>
      network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      network.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      network.subnetCidr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedNetworks = filteredNetworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      render: (_, item) => <StatusIndicator status={item.status} layout="icon-only" size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
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
      key: 'subnetCidr',
      label: 'Subnet CIDR',
    },
    {
      key: 'size',
      label: 'Size',
    },
  ];

  const handleCreate = async () => {
    if (!routerName.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate?.({
        routerName: routerName.trim(),
        description: description.trim() || undefined,
        adminState,
        externalGateway,
        selectedNetworkId: externalGateway ? selectedNetworkId || undefined : undefined,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRouterName('');
    setDescription('');
    setAdminState(true);
    setExternalGateway(true);
    setSearchTerm('');
    setSelectedNetworkId(null);
    setCurrentPage(1);
    setIsAdvancedOpen(true);
    onClose();
  };

  const isFormValid = routerName.trim().length > 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Router"
      description="Create a virtual router to route traffic between different networks or subnets. You can optionally connect the router to an external network to enable internet access or floating IP usage."
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={isSubmitting || !isFormValid}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Router Name */}
        <VStack gap={2} className="w-full">
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">
            Router name
          </span>
          <Input
            placeholder="e.g. web-router-01"
            value={routerName}
            onChange={(e) => setRouterName(e.target.value)}
            className="w-full"
          />
          <p className="text-[11px] text-[var(--color-text-subtle)]">
            Allowed: 1-128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description (Optional) */}
        <VStack gap={2} className="w-full">
          <HStack gap={1.5} alignItems="center">
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              Description
            </span>
            <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
          </HStack>
          <Input
            placeholder="e.g. Router for production web servers"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </VStack>

        {/* Disclosure for Advanced Options */}
        <Disclosure
          title="Label"
          isOpen={isAdvancedOpen}
          onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          <VStack gap={6} className="w-full pt-2">
            {/* Admin State */}
            <VStack gap={3} className="w-full">
              <VStack gap={2} className="w-full">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                  Admin State
                </span>
                <p className="text-[12px] text-[var(--color-text-subtle)]">
                  Setting it to "Down" disables all related network or control operations,
                  regardless of runtime status.
                </p>
              </VStack>
              <HStack gap={2} alignItems="center">
                <Toggle checked={adminState} onChange={setAdminState} />
                <span className="text-[12px] text-[var(--color-text-default)]">
                  {adminState ? 'Up' : 'Down'}
                </span>
              </HStack>
            </VStack>

            {/* External Gateway */}
            <VStack gap={3} className="w-full">
              <VStack gap={2} className="w-full">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                  External Gateway
                </span>
                <p className="text-[12px] text-[var(--color-text-subtle)]">
                  The external gateway connects your router to an external (public) network.
                  <br />
                  When enabled, instances in the connected subnets can access the internet using
                  floating IPs.
                </p>
              </VStack>
              <HStack gap={2} alignItems="center">
                <Toggle checked={externalGateway} onChange={setExternalGateway} />
                <span className="text-[12px] text-[var(--color-text-default)]">
                  {externalGateway ? 'Open' : 'Closed'}
                </span>
              </HStack>
            </VStack>
          </VStack>
        </Disclosure>

        {/* Network Selection (shown when External Gateway is enabled) */}
        {externalGateway && (
          <VStack gap={3} className="w-full">
            {/* Search */}
            <HStack justifyContent="start" className="w-[280px]">
              <SearchInput
                placeholder="Find network with filters"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </HStack>

            {/* Pagination */}
            <HStack gap={2} alignItems="center" className="w-full">
              <Pagination
                totalItems={filteredNetworks.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
              <div className="w-px h-4 bg-[var(--color-border-default)]" />
              <span className="text-[11px] text-[var(--color-text-subtle)]">
                {filteredNetworks.length} items
              </span>
            </HStack>

            {/* Network Table */}
            <div className="w-full overflow-auto">
              <Table<NetworkItem>
                columns={columns}
                data={paginatedNetworks}
                rowKey="id"
                selectedKeys={selectedNetworkId ? [selectedNetworkId] : []}
                onRowClick={(row) => setSelectedNetworkId(row.id)}
                emptyMessage="No networks available"
              />
            </div>
          </VStack>
        )}

        {/* Router Quota */}
        <VStack gap={6} className="w-full pt-4 border-t border-[var(--color-border-subtle)]">
          <QuotaBar label="Router Quota" used={routerQuota.used} total={routerQuota.total} />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateRouterDrawer;

