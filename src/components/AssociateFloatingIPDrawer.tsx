import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
  Tabs,
  TabList,
  Tab,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown, IconLock, IconAlertCircle } from '@tabler/icons-react';

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

  // Sorting states
  const [instanceSort, setInstanceSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'name',
    direction: 'asc',
  });
  const [loadBalancerSort, setLoadBalancerSort] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({ column: 'name', direction: 'asc' });
  const [virtualAdapterSort, setVirtualAdapterSort] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({ column: 'name', direction: 'asc' });
  const [fixedIPSort, setFixedIPSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'fixedIp',
    direction: 'asc',
  });

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

  // Sort helpers
  const handleInstanceSort = (column: string) => {
    setInstanceSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleLoadBalancerSort = (column: string) => {
    setLoadBalancerSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleVirtualAdapterSort = (column: string) => {
    setVirtualAdapterSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFixedIPSort = (column: string) => {
    setFixedIPSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Filter and sort instances
  const filteredInstances = instances
    .filter(
      (instance) =>
        instance.name.toLowerCase().includes(instanceSearch.toLowerCase()) ||
        instance.id.toLowerCase().includes(instanceSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[instanceSort.column as keyof InstanceItem];
      const bValue = b[instanceSort.column as keyof InstanceItem];
      const direction = instanceSort.direction === 'asc' ? 1 : -1;
      return String(aValue).localeCompare(String(bValue)) * direction;
    });

  // Filter and sort load balancers
  const filteredLoadBalancers = loadBalancers
    .filter(
      (lb) =>
        lb.name.toLowerCase().includes(loadBalancerSearch.toLowerCase()) ||
        lb.id.toLowerCase().includes(loadBalancerSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[loadBalancerSort.column as keyof LoadBalancerItem];
      const bValue = b[loadBalancerSort.column as keyof LoadBalancerItem];
      const direction = loadBalancerSort.direction === 'asc' ? 1 : -1;
      return String(aValue).localeCompare(String(bValue)) * direction;
    });

  // Filter and sort virtual adapters
  const filteredVirtualAdapters = virtualAdapters
    .filter(
      (va) =>
        va.name.toLowerCase().includes(virtualAdapterSearch.toLowerCase()) ||
        va.id.toLowerCase().includes(virtualAdapterSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[virtualAdapterSort.column as keyof VirtualAdapterItem];
      const bValue = b[virtualAdapterSort.column as keyof VirtualAdapterItem];
      const direction = virtualAdapterSort.direction === 'asc' ? 1 : -1;
      return String(aValue).localeCompare(String(bValue)) * direction;
    });

  // Filter and sort fixed IPs
  const filteredFixedIPs = fixedIPs
    .filter(
      (fip) =>
        fip.fixedIp.toLowerCase().includes(fixedIPSearch.toLowerCase()) ||
        fip.macAddress.toLowerCase().includes(fixedIPSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[fixedIPSort.column as keyof FixedIPItem];
      const bValue = b[fixedIPSort.column as keyof FixedIPItem];
      const direction = fixedIPSort.direction === 'asc' ? 1 : -1;
      return String(aValue).localeCompare(String(bValue)) * direction;
    });

  // Get selected resource based on active tab
  const getSelectedResourceId = () => {
    if (activeTab === 'instance') return selectedInstanceId;
    if (activeTab === 'loadBalancer') return selectedLoadBalancerId;
    if (activeTab === 'virtualAdapter') return selectedVirtualAdapterId;
    return null;
  };

  // Handle submit
  const handleSubmit = () => {
    const resourceId = getSelectedResourceId();
    if (resourceId) {
      onSubmit?.({
        resourceType: activeTab,
        resourceId,
        fixedIpId: selectedFixedIPId || '',
      });
      handleClose();
    }
  };

  // Render sort icon
  const renderSortIcon = (
    column: string,
    sortState: { column: string; direction: 'asc' | 'desc' }
  ) => (
    <IconChevronDown
      size={16}
      className={`transition-transform ${sortState.column === column && sortState.direction === 'desc' ? 'rotate-180' : ''}`}
    />
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate Floating IP"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!getSelectedResourceId()}
            className="w-[152px] h-8"
          >
            Associate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Floating IP Info */}
        <VStack gap={3}>
          <div className="bg-[var(--color-surface-subtle)] px-4 py-3 rounded-lg w-full">
            <p className="text-body-sm text-[var(--color-text-subtle)] leading-4 mb-1.5">
              Floating IP
            </p>
            <p className="text-body-md text-[var(--color-text-default)] leading-4">
              {floatingIP.address}
            </p>
          </div>
        </VStack>

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
            }}
          >
            <TabList>
              <Tab value="instance">Instance</Tab>
              <Tab value="loadBalancer">Load Balancer</Tab>
              <Tab value="virtualAdapter">Virtual Adapter</Tab>
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

              {/* Pagination */}
              <Pagination currentPage={1} totalPages={5} totalItems={115} onPageChange={() => {}} />

              {/* Table */}
              <div className="flex flex-col gap-[var(--table-row-gap)] w-full">
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
                    onClick={() => handleInstanceSort('name')}
                  >
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      Name
                    </span>
                    {renderSortIcon('name', instanceSort)}
                  </div>
                  <div className="w-[62px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      Locked
                    </span>
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      Fixed IP
                    </span>
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      Network
                    </span>
                  </div>
                </div>

                {/* Rows */}
                {filteredInstances.map((instance) => (
                  <div
                    key={instance.id}
                    className={`flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] cursor-pointer hover:bg-[var(--table-row-hover-bg)] transition-all ${selectedInstanceId === instance.id ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]' : ''}`}
                    onClick={() => setSelectedInstanceId(instance.id)}
                  >
                    <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                      <Radio
                        checked={selectedInstanceId === instance.id}
                        onChange={() => setSelectedInstanceId(instance.id)}
                      />
                    </div>
                    <div className="w-[59px] flex items-center justify-center">
                      <StatusIndicator status={instance.status} />
                    </div>
                    <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex flex-col justify-center gap-0.5">
                      <HStack gap={1.5} align="center">
                        <a
                          href="#"
                          className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {instance.name}
                        </a>
                        <IconExternalLink
                          size={16}
                          className="text-[var(--color-action-primary)]"
                        />
                        {instance.hasAlert && (
                          <IconAlertCircle size={16} className="text-[var(--color-state-danger)]" />
                        )}
                      </HStack>
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        ID : {instance.id}
                      </span>
                    </div>
                    <div className="w-[62px] flex items-center justify-center">
                      {instance.locked && (
                        <IconLock
                          size={16}
                          stroke={1.5}
                          className="text-[var(--color-text-default)]"
                        />
                      )}
                    </div>
                    <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                        {instance.fixedIp}
                      </span>
                    </div>
                    <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                        {instance.network}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              <SelectionIndicator
                selectedItems={
                  selectedInstance
                    ? [{ id: selectedInstance.id, label: selectedInstance.name }]
                    : []
                }
                onRemove={() => setSelectedInstanceId(null)}
                emptyText="No item Selected"
              />
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

              {/* Pagination */}
              <Pagination currentPage={1} totalPages={5} totalItems={115} onPageChange={() => {}} />

              {/* Table */}
              <div className="flex flex-col gap-[var(--table-row-gap)] w-full">
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
                    onClick={() => handleLoadBalancerSort('name')}
                  >
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      Name
                    </span>
                    {renderSortIcon('name', loadBalancerSort)}
                  </div>
                  <div
                    className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                    onClick={() => handleLoadBalancerSort('vipAddress')}
                  >
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      VIP Address
                    </span>
                    {renderSortIcon('vipAddress', loadBalancerSort)}
                  </div>
                </div>

                {/* Rows */}
                {filteredLoadBalancers.map((lb) => (
                  <div
                    key={lb.id}
                    className={`flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] cursor-pointer hover:bg-[var(--table-row-hover-bg)] transition-all ${selectedLoadBalancerId === lb.id ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]' : ''}`}
                    onClick={() => setSelectedLoadBalancerId(lb.id)}
                  >
                    <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                      <Radio
                        checked={selectedLoadBalancerId === lb.id}
                        onChange={() => setSelectedLoadBalancerId(lb.id)}
                      />
                    </div>
                    <div className="w-[59px] flex items-center justify-center">
                      <StatusIndicator status={lb.status} />
                    </div>
                    <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex flex-col justify-center gap-0.5">
                      <HStack gap={1.5} align="center">
                        <a
                          href="#"
                          className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {lb.name}
                        </a>
                        <IconExternalLink
                          size={16}
                          className="text-[var(--color-action-primary)]"
                        />
                        {lb.status === 'error' && (
                          <IconAlertCircle size={16} className="text-[var(--color-state-danger)]" />
                        )}
                      </HStack>
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        ID : {lb.id}
                      </span>
                    </div>
                    <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                        {lb.vipAddress}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              <SelectionIndicator
                selectedItems={
                  selectedLoadBalancer
                    ? [{ id: selectedLoadBalancer.id, label: selectedLoadBalancer.name }]
                    : []
                }
                onRemove={() => setSelectedLoadBalancerId(null)}
                emptyText="No item Selected"
              />
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

              {/* Pagination */}
              <Pagination currentPage={1} totalPages={5} totalItems={115} onPageChange={() => {}} />

              {/* Table */}
              <div className="flex flex-col gap-[var(--table-row-gap)] w-full">
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
                    onClick={() => handleVirtualAdapterSort('name')}
                  >
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      Name
                    </span>
                    {renderSortIcon('name', virtualAdapterSort)}
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center border-l border-[var(--color-border-default)]">
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      Fixed IP
                    </span>
                  </div>
                  <div
                    className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                    onClick={() => handleVirtualAdapterSort('description')}
                  >
                    <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                      Description
                    </span>
                    {renderSortIcon('description', virtualAdapterSort)}
                  </div>
                </div>

                {/* Rows */}
                {filteredVirtualAdapters.map((va) => (
                  <div
                    key={va.id}
                    className={`flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] cursor-pointer hover:bg-[var(--table-row-hover-bg)] transition-all ${selectedVirtualAdapterId === va.id ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]' : ''}`}
                    onClick={() => setSelectedVirtualAdapterId(va.id)}
                  >
                    <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                      <Radio
                        checked={selectedVirtualAdapterId === va.id}
                        onChange={() => setSelectedVirtualAdapterId(va.id)}
                      />
                    </div>
                    <div className="w-[59px] flex items-center justify-center">
                      <StatusIndicator status={va.status} />
                    </div>
                    <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex flex-col justify-center gap-0.5">
                      <HStack gap={1.5} align="center">
                        <a
                          href="#"
                          className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {va.name}
                        </a>
                        <IconExternalLink
                          size={16}
                          className="text-[var(--color-action-primary)]"
                        />
                      </HStack>
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        ID : {va.id}
                      </span>
                    </div>
                    <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                        {va.fixedIp}
                      </span>
                    </div>
                    <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                        {va.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              <SelectionIndicator
                selectedItems={
                  selectedVirtualAdapter
                    ? [{ id: selectedVirtualAdapter.id, label: selectedVirtualAdapter.name }]
                    : []
                }
                onRemove={() => setSelectedVirtualAdapterId(null)}
                emptyText="No item Selected"
              />
            </VStack>
          )}
        </VStack>

        {/* Divider - show when Instance or Virtual Adapter tab is active */}
        {(activeTab === 'instance' || activeTab === 'virtualAdapter') && (
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
        )}

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

            {/* Pagination */}
            <Pagination currentPage={1} totalPages={5} totalItems={115} onPageChange={() => {}} />

            {/* Table */}
            <div className="flex flex-col gap-[var(--table-row-gap)] w-full">
              {/* Header */}
              <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
                <div
                  className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                  onClick={() => handleFixedIPSort('fixedIp')}
                >
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Fixed IP
                  </span>
                  {renderSortIcon('fixedIp', fixedIPSort)}
                </div>
                <div
                  className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                  onClick={() => handleFixedIPSort('macAddress')}
                >
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Mac Address
                  </span>
                  {renderSortIcon('macAddress', fixedIPSort)}
                </div>
                <div
                  className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                  onClick={() => handleFixedIPSort('network')}
                >
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Network
                  </span>
                  {renderSortIcon('network', fixedIPSort)}
                </div>
              </div>

              {/* Rows */}
              {filteredFixedIPs.map((fip) => (
                <div
                  key={fip.id}
                  className={`flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] cursor-pointer hover:bg-[var(--table-row-hover-bg)] transition-all ${selectedFixedIPId === fip.id ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]' : ''}`}
                  onClick={() => setSelectedFixedIPId(fip.id)}
                >
                  <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                    <Radio
                      checked={selectedFixedIPId === fip.id}
                      onChange={() => setSelectedFixedIPId(fip.id)}
                    />
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                    <HStack gap={1.5} align="center">
                      <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                        {fip.fixedIp}
                      </span>
                      {fip.hasAlert && (
                        <IconAlertCircle size={16} className="text-[var(--color-state-danger)]" />
                      )}
                    </HStack>
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                      {fip.macAddress}
                    </span>
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                      {fip.network}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Indicator */}
            <SelectionIndicator
              selectedItems={
                selectedFixedIP ? [{ id: selectedFixedIP.id, label: selectedFixedIP.fixedIp }] : []
              }
              onRemove={() => setSelectedFixedIPId(null)}
              emptyText="No item Selected"
            />
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

            {/* Pagination */}
            <Pagination currentPage={1} totalPages={5} totalItems={115} onPageChange={() => {}} />

            {/* Table */}
            <div className="flex flex-col gap-[var(--table-row-gap)] w-full">
              {/* Header */}
              <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
                <div
                  className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                  onClick={() => handleFixedIPSort('fixedIp')}
                >
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Fixed IP
                  </span>
                  {renderSortIcon('fixedIp', fixedIPSort)}
                </div>
                <div
                  className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] flex items-center gap-1.5 border-l border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-muted)]"
                  onClick={() => handleFixedIPSort('ownedSubnet')}
                >
                  <span className="text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                    Owned Subnet
                  </span>
                  {renderSortIcon('ownedSubnet', fixedIPSort)}
                </div>
              </div>

              {/* Rows */}
              {mockVirtualAdapterFixedIPs.map((fip) => (
                <div
                  key={fip.id}
                  className={`flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] cursor-pointer hover:bg-[var(--table-row-hover-bg)] transition-all ${selectedFixedIPId === fip.id ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]' : ''}`}
                  onClick={() => setSelectedFixedIPId(fip.id)}
                >
                  <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                    <Radio
                      checked={selectedFixedIPId === fip.id}
                      onChange={() => setSelectedFixedIPId(fip.id)}
                    />
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                      {fip.fixedIp}
                    </span>
                  </div>
                  <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                      {fip.ownedSubnet || '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Indicator */}
            <SelectionIndicator
              selectedItems={
                selectedFixedIP ? [{ id: selectedFixedIP.id, label: selectedFixedIP.fixedIp }] : []
              }
              onRemove={() => setSelectedFixedIPId(null)}
              emptyText="No item Selected"
            />
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}
