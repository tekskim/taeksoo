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
  Tabs,
  TabList,
  Tab,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconLock, IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InstanceItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  locked: boolean;
  fixedIp: string;
  network: string;
  hasAlert?: boolean;
}

export interface LoadBalancerItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  vipAddress: string;
}

export interface VirtualAdapterItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  fixedIp: string;
  description: string;
}

export interface FixedIPItem {
  id: string;
  fixedIp: string;
  macAddress: string;
  network: string;
  ownedSubnet?: string;
  hasAlert?: boolean;
}

export interface FloatingIPInfo {
  address: string;
}

export interface AssociateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  floatingIP: FloatingIPInfo;
  instances?: InstanceItem[];
  loadBalancers?: LoadBalancerItem[];
  virtualAdapters?: VirtualAdapterItem[];
  fixedIPs?: FixedIPItem[];
  onSubmit?: (data: { resourceType: string; resourceId: string; fixedIpId: string }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInstances: InstanceItem[] = [
  {
    id: '45ghj567',
    name: 'server-2',
    status: 'error',
    locked: true,
    fixedIp: '10.62.0.30',
    network: 'net-01',
    hasAlert: true,
  },
  {
    id: '45ghj568',
    name: 'server-2',
    status: 'active',
    locked: true,
    fixedIp: '10.62.0.30',
    network: 'net-01',
  },
  {
    id: '45ghj569',
    name: 'server-2',
    status: 'active',
    locked: true,
    fixedIp: '10.62.0.30',
    network: 'net-01',
  },
  {
    id: '45ghj570',
    name: 'server-2',
    status: 'active',
    locked: true,
    fixedIp: '10.62.0.30',
    network: 'net-01',
  },
  {
    id: '45ghj571',
    name: 'server-2',
    status: 'active',
    locked: true,
    fixedIp: '10.62.0.30',
    network: 'net-01',
  },
];

const mockFixedIPs: FixedIPItem[] = [
  { id: 'fip-1', fixedIp: '10.0.0.5', macAddress: '10.0.0.1', network: 'private' },
  { id: 'fip-2', fixedIp: '10.0.0.5', macAddress: '10.0.0.1', network: 'private' },
  { id: 'fip-3', fixedIp: '10.0.0.5', macAddress: '10.0.0.1', network: 'private' },
  { id: 'fip-4', fixedIp: '10.0.0.5', macAddress: '10.0.0.1', network: 'private' },
  { id: 'fip-5', fixedIp: '10.0.0.5', macAddress: '10.0.0.1', network: 'private', hasAlert: true },
];

const mockLoadBalancers: LoadBalancerItem[] = [
  { id: '45ghj567', name: 'port-1', status: 'error', vipAddress: '10.7.60.91' },
  { id: '45ghj568', name: 'port-1', status: 'active', vipAddress: '10.7.60.91' },
  { id: '45ghj569', name: 'port-1', status: 'active', vipAddress: '10.7.60.91' },
  { id: '45ghj570', name: 'port-1', status: 'active', vipAddress: '10.7.60.91' },
  { id: '45ghj571', name: 'port-1', status: 'active', vipAddress: '10.7.60.91' },
];

const mockVirtualAdapters: VirtualAdapterItem[] = [
  { id: '45ghj567', name: 'port-2', status: 'active', fixedIp: '10.62.0.30', description: '-' },
  { id: '45ghj568', name: 'port-2', status: 'active', fixedIp: '10.62.0.30', description: '-' },
  { id: '45ghj569', name: 'port-2', status: 'active', fixedIp: '10.62.0.30', description: '-' },
  { id: '45ghj570', name: 'port-2', status: 'active', fixedIp: '10.62.0.30', description: '-' },
  { id: '45ghj571', name: 'port-2', status: 'active', fixedIp: '10.62.0.30', description: '-' },
];

const mockVirtualAdapterFixedIPs: FixedIPItem[] = [
  { id: 'vfip-1', fixedIp: '10.0.0.5', macAddress: '', network: '', ownedSubnet: 'subnet-01' },
  { id: 'vfip-2', fixedIp: '10.0.0.5', macAddress: '', network: '', ownedSubnet: 'subnet-01' },
  { id: 'vfip-3', fixedIp: '10.0.0.5', macAddress: '', network: '', ownedSubnet: 'subnet-01' },
  { id: 'vfip-4', fixedIp: '10.0.0.5', macAddress: '', network: '', ownedSubnet: 'subnet-01' },
  { id: 'vfip-5', fixedIp: '10.0.0.5', macAddress: '', network: '', ownedSubnet: 'subnet-01' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function AssociateFloatingIPDrawer({
  isOpen,
  onClose,
  floatingIP,
  instances = mockInstances,
  loadBalancers = mockLoadBalancers,
  virtualAdapters = mockVirtualAdapters,
  fixedIPs = mockFixedIPs,
  onSubmit,
}: AssociateFloatingIPDrawerProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState<'instance' | 'loadBalancer' | 'virtualAdapter'>(
    'instance'
  );

  // Selection states
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [selectedLoadBalancerId, setSelectedLoadBalancerId] = useState<string | null>(null);
  const [selectedVirtualAdapterId, setSelectedVirtualAdapterId] = useState<string | null>(null);
  const [selectedFixedIPId, setSelectedFixedIPId] = useState<string | null>(null);

  // Search states
  const [instanceSearch, setInstanceSearch] = useState('');
  const [loadBalancerSearch, setLoadBalancerSearch] = useState('');
  const [virtualAdapterSearch, setVirtualAdapterSearch] = useState('');
  const [fixedIPSearch, setFixedIPSearch] = useState('');

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  const itemsPerPage = 5;

  // Pagination state
  const [instancePage, setInstancePage] = useState(1);
  const [loadBalancerPage, setLoadBalancerPage] = useState(1);
  const [virtualAdapterPage, setVirtualAdapterPage] = useState(1);
  const [fixedIPPage, setFixedIPPage] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setHasAttemptedSubmit(false);
      setSelectionError(null);
    }
  }, [isOpen]);

  // Reset state function
  const resetState = () => {
    setSelectedInstanceId(null);
    setSelectedLoadBalancerId(null);
    setSelectedVirtualAdapterId(null);
    setSelectedFixedIPId(null);
    setInstanceSearch('');
    setLoadBalancerSearch('');
    setVirtualAdapterSearch('');
    setFixedIPSearch('');
    setInstancePage(1);
    setLoadBalancerPage(1);
    setVirtualAdapterPage(1);
    setFixedIPPage(1);
    setActiveTab('instance');
  };

  // Handle close with reset
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Get selected items
  const selectedInstance = instances.find((i) => i.id === selectedInstanceId);
  const selectedLoadBalancer = loadBalancers.find((lb) => lb.id === selectedLoadBalancerId);
  const selectedVirtualAdapter = virtualAdapters.find((va) => va.id === selectedVirtualAdapterId);
  const selectedFixedIP =
    activeTab === 'virtualAdapter'
      ? mockVirtualAdapterFixedIPs.find((f) => f.id === selectedFixedIPId)
      : fixedIPs.find((f) => f.id === selectedFixedIPId);

  // Filter instances
  const filteredInstances = instances.filter(
    (instance) =>
      instance.name.toLowerCase().includes(instanceSearch.toLowerCase()) ||
      instance.id.toLowerCase().includes(instanceSearch.toLowerCase())
  );

  // Filter load balancers
  const filteredLoadBalancers = loadBalancers.filter(
    (lb) =>
      lb.name.toLowerCase().includes(loadBalancerSearch.toLowerCase()) ||
      lb.id.toLowerCase().includes(loadBalancerSearch.toLowerCase())
  );

  // Filter virtual adapters
  const filteredVirtualAdapters = virtualAdapters.filter(
    (va) =>
      va.name.toLowerCase().includes(virtualAdapterSearch.toLowerCase()) ||
      va.id.toLowerCase().includes(virtualAdapterSearch.toLowerCase())
  );

  // Filter fixed IPs
  const filteredFixedIPs = fixedIPs.filter(
    (fip) =>
      fip.fixedIp.toLowerCase().includes(fixedIPSearch.toLowerCase()) ||
      fip.macAddress.toLowerCase().includes(fixedIPSearch.toLowerCase())
  );

  // Filter virtual adapter fixed IPs
  const filteredVAFixedIPs = mockVirtualAdapterFixedIPs.filter((fip) =>
    fip.fixedIp.toLowerCase().includes(fixedIPSearch.toLowerCase())
  );

  // Paginated data
  const instanceTotalPages = Math.ceil(filteredInstances.length / itemsPerPage);
  const paginatedInstances = filteredInstances.slice(
    (instancePage - 1) * itemsPerPage,
    instancePage * itemsPerPage
  );

  const loadBalancerTotalPages = Math.ceil(filteredLoadBalancers.length / itemsPerPage);
  const paginatedLoadBalancers = filteredLoadBalancers.slice(
    (loadBalancerPage - 1) * itemsPerPage,
    loadBalancerPage * itemsPerPage
  );

  const virtualAdapterTotalPages = Math.ceil(filteredVirtualAdapters.length / itemsPerPage);
  const paginatedVirtualAdapters = filteredVirtualAdapters.slice(
    (virtualAdapterPage - 1) * itemsPerPage,
    virtualAdapterPage * itemsPerPage
  );

  const fixedIPTotalPages = Math.ceil(filteredFixedIPs.length / itemsPerPage);
  const paginatedFixedIPs = filteredFixedIPs.slice(
    (fixedIPPage - 1) * itemsPerPage,
    fixedIPPage * itemsPerPage
  );

  const vaFixedIPTotalPages = Math.ceil(filteredVAFixedIPs.length / itemsPerPage);
  const paginatedVAFixedIPs = filteredVAFixedIPs.slice(
    (fixedIPPage - 1) * itemsPerPage,
    fixedIPPage * itemsPerPage
  );

  // Get selected resource based on active tab
  const getSelectedResourceId = () => {
    if (activeTab === 'instance') return selectedInstanceId;
    if (activeTab === 'loadBalancer') return selectedLoadBalancerId;
    if (activeTab === 'virtualAdapter') return selectedVirtualAdapterId;
    return null;
  };

  // Handle submit
  const handleSubmit = () => {
    setHasAttemptedSubmit(true);

    const resourceId = getSelectedResourceId();
    if (!resourceId) {
      setSelectionError('Please select a resource to associate.');
      return;
    }
    setSelectionError(null);

    onSubmit?.({
      resourceType: activeTab,
      resourceId,
      fixedIpId: selectedFixedIPId || '',
    });
    handleClose();
  };

  const instanceColumns: TableColumn<InstanceItem>[] = [
    {
      key: 'id' as keyof InstanceItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="instance-select"
            value={row.id}
            checked={selectedInstanceId === row.id}
            onChange={() => {
              setSelectedInstanceId(row.id);
              setSelectionError(null);
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
      render: (_value, row) => <StatusIndicator layout="icon-only" status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <a
              href="#"
              className="text-label-md text-[var(--color-action-primary)] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </a>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
            {row.hasAlert && (
              <IconAlertCircle size={14} className="text-[var(--color-state-danger)]" />
            )}
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'locked' as keyof InstanceItem,
      label: 'Locked',
      width: '62px',
      align: 'center',
      render: (_value, row) =>
        row.locked ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        ) : null,
    },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1 },
    { key: 'network', label: 'Network', flex: 1 },
  ];

  const loadBalancerColumns: TableColumn<LoadBalancerItem>[] = [
    {
      key: 'id' as keyof LoadBalancerItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="lb-select"
            value={row.id}
            checked={selectedLoadBalancerId === row.id}
            onChange={() => {
              setSelectedLoadBalancerId(row.id);
              setSelectionError(null);
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
      render: (_value, row) => <StatusIndicator layout="icon-only" status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <a
              href="#"
              className="text-label-md text-[var(--color-action-primary)] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </a>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
            {row.status === 'error' && (
              <IconAlertCircle size={14} className="text-[var(--color-state-danger)]" />
            )}
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    { key: 'vipAddress', label: 'VIP address', flex: 1, sortable: true },
  ];

  const virtualAdapterColumns: TableColumn<VirtualAdapterItem>[] = [
    {
      key: 'id' as keyof VirtualAdapterItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="va-select"
            value={row.id}
            checked={selectedVirtualAdapterId === row.id}
            onChange={() => {
              setSelectedVirtualAdapterId(row.id);
              setSelectionError(null);
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
      render: (_value, row) => <StatusIndicator layout="icon-only" status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <a
              href="#"
              className="text-label-md text-[var(--color-action-primary)] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </a>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1 },
    { key: 'description', label: 'Description', flex: 1, sortable: true },
  ];

  const fixedIPColumns: TableColumn<FixedIPItem>[] = [
    {
      key: 'id' as keyof FixedIPItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="fixedip-select"
            value={row.id}
            checked={selectedFixedIPId === row.id}
            onChange={() => setSelectedFixedIPId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <HStack gap={1.5} align="center">
          <span className="text-body-md text-[var(--color-text-default)]">{row.fixedIp}</span>
          {row.hasAlert && (
            <IconAlertCircle size={14} className="text-[var(--color-state-danger)]" />
          )}
        </HStack>
      ),
    },
    { key: 'macAddress', label: 'MAC address', flex: 1, sortable: true },
    { key: 'network', label: 'Network', flex: 1, sortable: true },
  ];

  const vaFixedIPColumns: TableColumn<FixedIPItem>[] = [
    {
      key: 'id' as keyof FixedIPItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="vafixedip-select"
            value={row.id}
            checked={selectedFixedIPId === row.id}
            onChange={() => setSelectedFixedIPId(row.id)}
          />
        </div>
      ),
    },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1, sortable: true },
    {
      key: 'ownedSubnet' as keyof FixedIPItem,
      label: 'Owned subnet',
      flex: 1,
      sortable: true,
      render: (_value, row) => row.ownedSubnet || '-',
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate floating IP"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="w-[152px] h-8">
            Associate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Floating IP Info */}
        <InfoBox label="Floating IP" value={floatingIP.address} />

        {/* Resource Type Section */}
        <VStack gap={3} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            Resource type
          </h3>

          {/* Tabs */}
          <Tabs
            variant="underline"
            value={activeTab}
            onChange={(id) => {
              setActiveTab(id as 'instance' | 'loadBalancer' | 'virtualAdapter');
              setSelectedInstanceId(null);
              setSelectedLoadBalancerId(null);
              setSelectedVirtualAdapterId(null);
              setSelectedFixedIPId(null);
              setInstancePage(1);
              setLoadBalancerPage(1);
              setVirtualAdapterPage(1);
              setFixedIPPage(1);
              setSelectionError(null);
            }}
          >
            <TabList>
              <Tab value="instance">Instance</Tab>
              <Tab value="loadBalancer">Load balancer</Tab>
              <Tab value="virtualAdapter">Virtual adapter</Tab>
            </TabList>
          </Tabs>

          {/* Instance Table (when Instance tab is active) */}
          {activeTab === 'instance' && (
            <VStack gap={3} className="w-full">
              {/* Search */}
              <div className="w-[280px]">
                <SearchInput
                  placeholder="Search instance by attributes"
                  value={instanceSearch}
                  onChange={(e) => setInstanceSearch(e.target.value)}
                  fullWidth
                />
              </div>

              <Pagination
                currentPage={instancePage}
                totalPages={instanceTotalPages}
                totalItems={filteredInstances.length}
                onPageChange={setInstancePage}
                selectedCount={selectedInstanceId ? 1 : 0}
              />

              <VStack gap={2}>
                <Table<InstanceItem>
                  columns={instanceColumns}
                  data={paginatedInstances}
                  rowKey="id"
                  onRowClick={(row) => {
                    setSelectedInstanceId(row.id);
                    setSelectionError(null);
                  }}
                  emptyMessage="No instances found"
                />
                <SelectionIndicator
                  selectedItems={
                    selectedInstance
                      ? [{ id: selectedInstance.id, label: selectedInstance.name }]
                      : []
                  }
                  onRemove={() => setSelectedInstanceId(null)}
                  emptyText="No item selected"
                />
              </VStack>
            </VStack>
          )}

          {/* Load Balancer Table (when Load Balancer tab is active) */}
          {activeTab === 'loadBalancer' && (
            <VStack gap={3} className="w-full">
              {/* Search */}
              <div className="w-[280px]">
                <SearchInput
                  placeholder="Search load balancer by attributes"
                  value={loadBalancerSearch}
                  onChange={(e) => setLoadBalancerSearch(e.target.value)}
                  fullWidth
                />
              </div>

              <Pagination
                currentPage={loadBalancerPage}
                totalPages={loadBalancerTotalPages}
                totalItems={filteredLoadBalancers.length}
                onPageChange={setLoadBalancerPage}
                selectedCount={selectedLoadBalancerId ? 1 : 0}
              />

              <VStack gap={2}>
                <Table<LoadBalancerItem>
                  columns={loadBalancerColumns}
                  data={paginatedLoadBalancers}
                  rowKey="id"
                  onRowClick={(row) => {
                    setSelectedLoadBalancerId(row.id);
                    setSelectionError(null);
                  }}
                  emptyMessage="No load balancers found"
                />
                <SelectionIndicator
                  selectedItems={
                    selectedLoadBalancer
                      ? [{ id: selectedLoadBalancer.id, label: selectedLoadBalancer.name }]
                      : []
                  }
                  onRemove={() => setSelectedLoadBalancerId(null)}
                  emptyText="No item selected"
                />
              </VStack>
            </VStack>
          )}

          {/* Virtual Adapter Table (when Virtual Adapter tab is active) */}
          {activeTab === 'virtualAdapter' && (
            <VStack gap={3} className="w-full">
              {/* Search */}
              <div className="w-[280px]">
                <SearchInput
                  placeholder="Search virtual adapter by attributes"
                  value={virtualAdapterSearch}
                  onChange={(e) => setVirtualAdapterSearch(e.target.value)}
                  fullWidth
                />
              </div>

              <Pagination
                currentPage={virtualAdapterPage}
                totalPages={virtualAdapterTotalPages}
                totalItems={filteredVirtualAdapters.length}
                onPageChange={setVirtualAdapterPage}
                selectedCount={selectedVirtualAdapterId ? 1 : 0}
              />

              <VStack gap={2}>
                <Table<VirtualAdapterItem>
                  columns={virtualAdapterColumns}
                  data={paginatedVirtualAdapters}
                  rowKey="id"
                  onRowClick={(row) => {
                    setSelectedVirtualAdapterId(row.id);
                    setSelectionError(null);
                  }}
                  emptyMessage="No virtual adapters found"
                />
                <SelectionIndicator
                  selectedItems={
                    selectedVirtualAdapter
                      ? [{ id: selectedVirtualAdapter.id, label: selectedVirtualAdapter.name }]
                      : []
                  }
                  onRemove={() => setSelectedVirtualAdapterId(null)}
                  emptyText="No item selected"
                />
              </VStack>
            </VStack>
          )}
        </VStack>

        {/* Fixed IP Section - only show when Instance tab is active */}
        {activeTab === 'instance' && (
          <VStack gap={3} className="w-full pb-5">
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">Fixed IP</h3>

            {/* Search */}
            <div className="w-[280px]">
              <SearchInput
                placeholder="Search fixed IP by attributes"
                value={fixedIPSearch}
                onChange={(e) => setFixedIPSearch(e.target.value)}
                fullWidth
              />
            </div>

            <Pagination
              currentPage={fixedIPPage}
              totalPages={fixedIPTotalPages}
              totalItems={filteredFixedIPs.length}
              onPageChange={setFixedIPPage}
              selectedCount={selectedFixedIPId ? 1 : 0}
            />

            <VStack gap={2}>
              <Table<FixedIPItem>
                columns={fixedIPColumns}
                data={paginatedFixedIPs}
                rowKey="id"
                onRowClick={(row) => setSelectedFixedIPId(row.id)}
                emptyMessage="No fixed IPs found"
              />
              <SelectionIndicator
                selectedItems={
                  selectedFixedIP
                    ? [{ id: selectedFixedIP.id, label: selectedFixedIP.fixedIp }]
                    : []
                }
                onRemove={() => setSelectedFixedIPId(null)}
                emptyText="No item selected"
              />
            </VStack>
          </VStack>
        )}

        {/* Fixed IP Section - show when Virtual Adapter tab is active (different columns) */}
        {activeTab === 'virtualAdapter' && (
          <VStack gap={3} className="w-full pb-5">
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">Fixed IP</h3>

            {/* Search */}
            <div className="w-[280px]">
              <SearchInput
                placeholder="Search fixed IP by attributes"
                value={fixedIPSearch}
                onChange={(e) => setFixedIPSearch(e.target.value)}
                fullWidth
              />
            </div>

            <Pagination
              currentPage={fixedIPPage}
              totalPages={vaFixedIPTotalPages}
              totalItems={filteredVAFixedIPs.length}
              onPageChange={setFixedIPPage}
              selectedCount={selectedFixedIPId ? 1 : 0}
            />

            <VStack gap={2}>
              <Table<FixedIPItem>
                columns={vaFixedIPColumns}
                data={paginatedVAFixedIPs}
                rowKey="id"
                onRowClick={(row) => setSelectedFixedIPId(row.id)}
                emptyMessage="No fixed IPs found"
              />
              <SelectionIndicator
                selectedItems={
                  selectedFixedIP
                    ? [{ id: selectedFixedIP.id, label: selectedFixedIP.fixedIp }]
                    : []
                }
                onRemove={() => setSelectedFixedIPId(null)}
                emptyText="No item selected"
              />
            </VStack>
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}
