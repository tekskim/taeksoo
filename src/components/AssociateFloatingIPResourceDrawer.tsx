import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  StatusIndicator,
  Radio,
  Tabs,
  TabList,
  Tab,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconLock, IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ResourceItem {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'error' | 'inactive';
  isLocked: boolean;
  fixedIp: string;
  network: string;
}

export interface LoadBalancerItem {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'error' | 'inactive';
  vipAddress: string;
  hasAlert?: boolean;
}

export interface VirtualAdapterItem {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'error' | 'inactive';
  fixedIp: string;
  description: string;
}

export interface FixedIPItem {
  id: string;
  fixedIp: string;
  macAddress: string;
  network: string;
  hasError?: boolean;
}

export interface FixedIPSubnetItem {
  id: string;
  fixedIp: string;
  ownedSubnet: string;
}

export interface AssociateFloatingIPResourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  floatingIp: string;
  resources?: ResourceItem[];
  loadBalancers?: LoadBalancerItem[];
  virtualAdapters?: VirtualAdapterItem[];
  fixedIps?: FixedIPItem[];
  fixedIpSubnets?: FixedIPSubnetItem[];
  defaultTab?: 'instance' | 'load-balancer' | 'virtual-adapter';
  onAssociate?: (resourceId: string, fixedIpId?: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockResources: ResourceItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  name: `server-${(i % 5) + 1}`,
  status: i % 5 === 0 ? 'warning' : i % 7 === 0 ? 'error' : 'active',
  isLocked: true,
  fixedIp: '10.62.0.30',
  network: 'net-01',
}));

const mockLoadBalancers: LoadBalancerItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  name: `port-${(i % 5) + 1}`,
  status: i === 0 ? 'error' : 'active',
  vipAddress: '10.7.60.91',
  hasAlert: i === 0,
}));

const mockVirtualAdapters: VirtualAdapterItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `45ghj${567 + i}`,
  name: `port-${(i % 5) + 2}`,
  status: 'active',
  fixedIp: '10.62.0.30',
  description: '-',
}));

const mockFixedIps: FixedIPItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `fixed-${i + 1}`,
  fixedIp: '10.0.0.5',
  macAddress: '10.0.0.1',
  network: 'private',
  hasError: i === 4,
}));

const mockFixedIpSubnets: FixedIPSubnetItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `fixed-subnet-${i + 1}`,
  fixedIp: '10.0.0.5',
  ownedSubnet: 'subnet-01',
}));

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function AssociateFloatingIPResourceDrawer({
  isOpen,
  onClose,
  floatingIp,
  resources = mockResources,
  loadBalancers = mockLoadBalancers,
  virtualAdapters = mockVirtualAdapters,
  fixedIps = mockFixedIps,
  fixedIpSubnets = mockFixedIpSubnets,
  defaultTab = 'instance',
  onAssociate,
}: AssociateFloatingIPResourceDrawerProps) {
  const [resourceType, setResourceType] = useState<'instance' | 'load-balancer' | 'virtual-adapter'>(defaultTab);
  const [resourceSearchTerm, setResourceSearchTerm] = useState('');
  const [fixedIpSearchTerm, setFixedIpSearchTerm] = useState('');
  const [resourcePage, setResourcePage] = useState(1);
  const [fixedIpPage, setFixedIpPage] = useState(1);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [selectedFixedIpId, setSelectedFixedIpId] = useState<string | null>(null);

  const resourceItemsPerPage = 5;
  const fixedIpItemsPerPage = 5;

  // Check if we need the Fixed IP section (for Instance and Virtual Adapter tabs)
  const showFixedIpSection = resourceType === 'instance' || resourceType === 'virtual-adapter';

  // Get search placeholder based on tab
  const getSearchPlaceholder = () => {
    switch (resourceType) {
      case 'load-balancer':
        return 'Find load balancer with filters';
      case 'virtual-adapter':
        return 'Find virtual adapter with filters';
      default:
        return 'Find Instance with filters';
    }
  };

  // Filtering for Instance
  const filteredResources = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
      r.fixedIp.includes(resourceSearchTerm)
  );

  // Filtering for Load Balancer
  const filteredLoadBalancers = loadBalancers.filter(
    (lb) =>
      lb.name.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
      lb.id.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
      lb.vipAddress.includes(resourceSearchTerm)
  );

  // Filtering for Virtual Adapter
  const filteredVirtualAdapters = virtualAdapters.filter(
    (va) =>
      va.name.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
      va.id.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
      va.fixedIp.includes(resourceSearchTerm)
  );

  // Filtering for Fixed IP (Instance)
  const filteredFixedIps = fixedIps.filter(
    (ip) =>
      ip.fixedIp.includes(fixedIpSearchTerm) ||
      ip.macAddress.includes(fixedIpSearchTerm) ||
      ip.network.toLowerCase().includes(fixedIpSearchTerm.toLowerCase())
  );

  // Filtering for Fixed IP with Subnet (Virtual Adapter)
  const filteredFixedIpSubnets = fixedIpSubnets.filter(
    (ip) =>
      ip.fixedIp.includes(fixedIpSearchTerm) ||
      ip.ownedSubnet.toLowerCase().includes(fixedIpSearchTerm.toLowerCase())
  );

  // Pagination
  const paginatedResources = filteredResources.slice(
    (resourcePage - 1) * resourceItemsPerPage,
    resourcePage * resourceItemsPerPage
  );

  const paginatedLoadBalancers = filteredLoadBalancers.slice(
    (resourcePage - 1) * resourceItemsPerPage,
    resourcePage * resourceItemsPerPage
  );

  const paginatedVirtualAdapters = filteredVirtualAdapters.slice(
    (resourcePage - 1) * resourceItemsPerPage,
    resourcePage * resourceItemsPerPage
  );

  const paginatedFixedIps = filteredFixedIps.slice(
    (fixedIpPage - 1) * fixedIpItemsPerPage,
    fixedIpPage * fixedIpItemsPerPage
  );

  const paginatedFixedIpSubnets = filteredFixedIpSubnets.slice(
    (fixedIpPage - 1) * fixedIpItemsPerPage,
    fixedIpPage * fixedIpItemsPerPage
  );

  // Resource columns (for Instance tab)
  const resourceColumns: TableColumn<ResourceItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="resource-select"
          value={row.id}
          checked={selectedResourceId === row.id}
          onChange={() => setSelectedResourceId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator
          status={item.status === 'warning' ? 'degraded' : item.status === 'error' ? 'error' : 'active'}
          layout="icon-only"
          size="sm"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <div className="inline-flex items-center gap-1.5">
            <a
              href={`/instances/${item.id}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {item.name}
            </a>
            <IconExternalLink size={12} className="flex-shrink-0 text-[var(--color-action-primary)]" />
            {item.status === 'warning' && (
              <IconAlertCircle size={12} className="text-[var(--color-state-warning)]" />
            )}
          </div>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'isLocked',
      label: 'Locked',
      width: '62px',
      align: 'center',
      render: (_, item) =>
        item.isLocked ? (
          <IconLock size={14} className="text-[var(--color-text-subtle)]" />
        ) : null,
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
    },
    {
      key: 'network',
      label: 'Network',
    },
  ];

  // Load Balancer columns
  const loadBalancerColumns: TableColumn<LoadBalancerItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="lb-select"
          value={row.id}
          checked={selectedResourceId === row.id}
          onChange={() => setSelectedResourceId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator
          status={item.status === 'error' ? 'error' : 'active'}
          layout="icon-only"
          size="sm"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <div className="inline-flex items-center gap-1.5">
            <a
              href={`/load-balancers/${item.id}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {item.name}
            </a>
            <IconExternalLink size={12} className="flex-shrink-0 text-[var(--color-action-primary)]" />
            {item.hasAlert && (
              <IconAlertCircle size={16} className="text-[var(--color-state-danger)]" />
            )}
          </div>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'vipAddress',
      label: 'VIP Address',
      sortable: true,
    },
  ];

  // Virtual Adapter columns
  const virtualAdapterColumns: TableColumn<VirtualAdapterItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="va-select"
          value={row.id}
          checked={selectedResourceId === row.id}
          onChange={() => setSelectedResourceId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator
          status={item.status === 'error' ? 'error' : 'active'}
          layout="icon-only"
          size="sm"
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
            href={`/virtual-adapters/${item.id}`}
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
      key: 'fixedIp',
      label: 'Fixed IP',
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
    },
  ];

  // Fixed IP columns (for Instance tab)
  const fixedIpColumns: TableColumn<FixedIPItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="fixed-ip-select"
          value={row.id}
          checked={selectedFixedIpId === row.id}
          onChange={() => setSelectedFixedIpId(row.id)}
        />
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      sortable: true,
      render: (_, item) => (
        <HStack gap={1.5} alignItems="center">
          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {item.fixedIp}
          </span>
          {item.hasError && (
            <IconAlertCircle size={12} className="text-[var(--color-state-danger)]" />
          )}
        </HStack>
      ),
    },
    {
      key: 'macAddress',
      label: 'Mac Address',
      sortable: true,
    },
    {
      key: 'network',
      label: 'Network',
      sortable: true,
    },
  ];

  // Fixed IP columns with Owned Subnet (for Virtual Adapter tab)
  const fixedIpSubnetColumns: TableColumn<FixedIPSubnetItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="fixed-ip-subnet-select"
          value={row.id}
          checked={selectedFixedIpId === row.id}
          onChange={() => setSelectedFixedIpId(row.id)}
        />
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      sortable: true,
    },
    {
      key: 'ownedSubnet',
      label: 'Owned Subnet',
      sortable: true,
    },
  ];

  const handleAssociate = () => {
    if (selectedResourceId) {
      if (showFixedIpSection && selectedFixedIpId) {
        onAssociate?.(selectedResourceId, selectedFixedIpId);
      } else if (!showFixedIpSection) {
        onAssociate?.(selectedResourceId);
      }
      handleClose();
    }
  };

  const handleTabChange = (tab: string) => {
    setResourceType(tab as 'instance' | 'load-balancer' | 'virtual-adapter');
    setSelectedResourceId(null);
    setSelectedFixedIpId(null);
    setResourceSearchTerm('');
    setFixedIpSearchTerm('');
    setResourcePage(1);
    setFixedIpPage(1);
  };

  const handleClose = () => {
    setResourceSearchTerm('');
    setFixedIpSearchTerm('');
    setResourcePage(1);
    setFixedIpPage(1);
    setSelectedResourceId(null);
    setSelectedFixedIpId(null);
    setResourceType(defaultTab);
    onClose();
  };

  // Determine if Associate button should be enabled
  const isAssociateEnabled = showFixedIpSection
    ? selectedResourceId && selectedFixedIpId
    : selectedResourceId;

  // Get current data based on tab
  const getCurrentFilteredCount = () => {
    switch (resourceType) {
      case 'load-balancer':
        return filteredLoadBalancers.length;
      case 'virtual-adapter':
        return filteredVirtualAdapters.length;
      default:
        return filteredResources.length;
    }
  };

  const getCurrentFixedIpCount = () => {
    if (resourceType === 'virtual-adapter') {
      return filteredFixedIpSubnets.length;
    }
    return filteredFixedIps.length;
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate Floating IP"
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssociate}
            disabled={!isAssociateEnabled}
            size="md"
            className="w-[152px]"
          >
            Associate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Floating IP Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Floating IP
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {floatingIp}
          </p>
        </div>

        {/* Resource Type Section */}
        <VStack gap={3} className="w-full">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Resource type
          </h6>

          {/* Tabs */}
          <Tabs value={resourceType} onChange={handleTabChange} variant="underline" size="sm">
            <TabList>
              <Tab value="instance">Instance</Tab>
              <Tab value="load-balancer">Load Balancer</Tab>
              <Tab value="virtual-adapter">Virtual Adapter</Tab>
            </TabList>
          </Tabs>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder={getSearchPlaceholder()}
              value={resourceSearchTerm}
              onChange={(e) => setResourceSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={getCurrentFilteredCount()}
              itemsPerPage={resourceItemsPerPage}
              currentPage={resourcePage}
              onPageChange={setResourcePage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {getCurrentFilteredCount()} items
            </span>
          </HStack>

          {/* Resource Table - Instance */}
          {resourceType === 'instance' && (
            <div className="overflow-auto w-full">
              <Table<ResourceItem>
                columns={resourceColumns}
                data={paginatedResources}
                rowKey="id"
                selectedKeys={selectedResourceId ? [selectedResourceId] : []}
                onRowClick={(row) => setSelectedResourceId(row.id)}
                emptyMessage="No instances available"
              />
            </div>
          )}

          {/* Resource Table - Load Balancer */}
          {resourceType === 'load-balancer' && (
            <div className="overflow-auto w-full">
              <Table<LoadBalancerItem>
                columns={loadBalancerColumns}
                data={paginatedLoadBalancers}
                rowKey="id"
                selectedKeys={selectedResourceId ? [selectedResourceId] : []}
                onRowClick={(row) => setSelectedResourceId(row.id)}
                emptyMessage="No load balancers available"
              />
            </div>
          )}

          {/* Resource Table - Virtual Adapter */}
          {resourceType === 'virtual-adapter' && (
            <div className="overflow-auto w-full">
              <Table<VirtualAdapterItem>
                columns={virtualAdapterColumns}
                data={paginatedVirtualAdapters}
                rowKey="id"
                selectedKeys={selectedResourceId ? [selectedResourceId] : []}
                onRowClick={(row) => setSelectedResourceId(row.id)}
                emptyMessage="No virtual adapters available"
              />
            </div>
          )}
        </VStack>

        {/* Fixed IP Section - Show for Instance and Virtual Adapter tabs */}
        {showFixedIpSection && (
          <>
            {/* Divider */}
            <div className="w-full h-px bg-[var(--color-border-default)]" />

            <VStack gap={3} className="w-full">
              <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
                Fixed IP
              </h6>

              {/* Search */}
              <div className="w-[280px]">
                <SearchInput
                  placeholder="Find Fixed IP with filters"
                  value={fixedIpSearchTerm}
                  onChange={(e) => setFixedIpSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Pagination */}
              <HStack gap={2} alignItems="center" className="w-full">
                <Pagination
                  totalItems={getCurrentFixedIpCount()}
                  itemsPerPage={fixedIpItemsPerPage}
                  currentPage={fixedIpPage}
                  onPageChange={setFixedIpPage}
                />
                <div className="w-px h-4 bg-[var(--color-border-default)]" />
                <span className="text-[11px] text-[var(--color-text-subtle)]">
                  {getCurrentFixedIpCount()} items
                </span>
              </HStack>

              {/* Fixed IP Table - Instance (with Mac Address & Network) */}
              {resourceType === 'instance' && (
                <div className="overflow-auto w-full">
                  <Table<FixedIPItem>
                    columns={fixedIpColumns}
                    data={paginatedFixedIps}
                    rowKey="id"
                    selectedKeys={selectedFixedIpId ? [selectedFixedIpId] : []}
                    onRowClick={(row) => setSelectedFixedIpId(row.id)}
                    emptyMessage="No fixed IPs available"
                  />
                </div>
              )}

              {/* Fixed IP Table - Virtual Adapter (with Owned Subnet) */}
              {resourceType === 'virtual-adapter' && (
                <div className="overflow-auto w-full">
                  <Table<FixedIPSubnetItem>
                    columns={fixedIpSubnetColumns}
                    data={paginatedFixedIpSubnets}
                    rowKey="id"
                    selectedKeys={selectedFixedIpId ? [selectedFixedIpId] : []}
                    onRowClick={(row) => setSelectedFixedIpId(row.id)}
                    emptyMessage="No fixed IPs available"
                  />
                </div>
              )}
            </VStack>
          </>
        )}
      </VStack>
    </Drawer>
  );
}

export default AssociateFloatingIPResourceDrawer;
