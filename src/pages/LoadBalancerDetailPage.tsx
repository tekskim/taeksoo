import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  SectionCard,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
  ContextMenu,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconUnlink,
  IconTrash,
  IconBell,
  IconChevronDown,
  IconEdit,
  IconCirclePlus,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

// Types
type LoadBalancerStatus = 'active' | 'pending' | 'error';
type ListenerStatus = 'active' | 'down' | 'error';
type PoolStatus = 'online' | 'offline' | 'error';

interface LoadBalancerDetail {
  id: string;
  name: string;
  status: LoadBalancerStatus;
  adminState: 'Up' | 'Down';
  vipAddress: string;
  createdAt: string;
  // Basic information
  description: string;
  provider: string;
  // Network
  ownedNetwork: { name: string; id: string } | null;
  subnet: { name: string; id: string } | null;
  floatingIp: { name: string; id: string } | null;
}

interface Listener {
  id: string;
  name: string;
  status: ListenerStatus;
  protocol: string;
  port: number;
  connectionLimit: number;
  adminState: 'Up' | 'Down';
}

interface Pool {
  id: string;
  name: string;
  status: PoolStatus;
  protocol: string;
  algorithm: string;
  listener: { name: string; id: string };
  members: number;
  adminState: 'Up' | 'Down';
}

// Status mapping for StatusIndicator
const statusMap: Record<LoadBalancerStatus, 'active' | 'building' | 'error'> = {
  active: 'active',
  pending: 'building',
  error: 'error',
};

// Mock data - synchronized with LoadBalancersPage
const mockLoadBalancersMap: Record<string, LoadBalancerDetail> = {
  'lb-001': {
    id: 'lb-001',
    name: 'web-lb-01',
    status: 'active',
    adminState: 'Up',
    vipAddress: '192.168.10.13',
    createdAt: '2025-10-03 09:12:20',
    description: '-',
    provider: 'ovn',
    ownedNetwork: { name: 'net-02', id: 'net-002' },
    subnet: { name: 'subnet-02', id: 'subnet-002' },
    floatingIp: { name: '192.168.10.13', id: 'fip-001' },
  },
  'lb-002': {
    id: 'lb-002',
    name: 'api-lb',
    status: 'active',
    adminState: 'Up',
    vipAddress: '192.168.10.14',
    createdAt: '2025-10-02 09:00:00',
    description: 'API Load balancer',
    provider: 'ovn',
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    floatingIp: { name: '192.168.10.14', id: 'fip-002' },
  },
  'lb-003': {
    id: 'lb-003',
    name: 'app-lb',
    status: 'building',
    adminState: 'Up',
    vipAddress: '192.168.10.15',
    createdAt: '2025-10-01 10:30:00',
    description: 'Application Load balancer',
    provider: 'ovn',
    ownedNetwork: { name: 'net-03', id: 'net-003' },
    subnet: { name: 'subnet-03', id: 'subnet-003' },
    floatingIp: { name: '192.168.10.15', id: 'fip-003' },
  },
};

const defaultLoadBalancer: LoadBalancerDetail = {
  id: 'lb-default',
  name: 'Unknown',
  status: 'active',
  adminState: 'Up',
  vipAddress: '-',
  createdAt: '-',
  description: '-',
  provider: 'ovn',
  ownedNetwork: { name: '-', id: '' },
  subnet: { name: '-', id: '' },
  floatingIp: { name: '-', id: '' },
};

// Mock listeners data
const mockListeners: Listener[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29fg234${String(i).padStart(2, '0')}`,
  name: `listener-http-80`,
  status: ['active', 'active', 'active', 'down', 'error'][i % 5] as ListenerStatus,
  protocol: 'HTTP',
  port: 80,
  connectionLimit: 2,
  adminState: i % 10 === 0 ? 'Down' : 'Up',
}));

// Listener status mapping
const listenerStatusMap: Record<ListenerStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

// Mock pools data
const mockPools: Pool[] = Array.from({ length: 13 }, (_, i) => ({
  id: `29tgj234${String(i).padStart(2, '0')}`,
  name: `pool-http`,
  status: ['online', 'online', 'online', 'offline', 'error'][i % 5] as PoolStatus,
  protocol: ['HTTP', 'HTTPS', 'TCP', 'UDP'][i % 4],
  algorithm: ['Round Robin', 'Least Connections', 'Source IP'][i % 3],
  listener: { name: 'listener', id: `29tgj234${String(i).padStart(2, '0')}` },
  members: (i % 5) + 1,
  adminState: i % 7 === 0 ? 'Down' : 'Up',
}));

// Pool status mapping
const poolStatusMap: Record<PoolStatus, 'active' | 'down' | 'error'> = {
  online: 'active',
  offline: 'down',
  error: 'error',
};

export function LoadBalancerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();
  const [activeTab, setActiveTab] = useState('details');
  const [isCopied, setIsCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Listeners state
  const [listenerSearchTerm, setListenerSearchTerm] = useState('');
  const [listenerCurrentPage, setListenerCurrentPage] = useState(1);
  const [selectedListeners, setSelectedListeners] = useState<string[]>([]);
  const listenersPerPage = 10;

  // Pools state
  const [poolSearchTerm, setPoolSearchTerm] = useState('');
  const [poolCurrentPage, setPoolCurrentPage] = useState(1);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const poolsPerPage = 10;
  
  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Get load balancer based on URL id
  const loadBalancer = id ? (mockLoadBalancersMap[id] || defaultLoadBalancer) : defaultLoadBalancer;

  // Update tab label when load balancer name changes
  useEffect(() => {
    if (loadBalancer.name) {
      updateActiveTabLabel(loadBalancer.name);
    }
  }, [loadBalancer.name, updateActiveTabLabel]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(loadBalancer.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filtered listeners based on search
  const filteredListeners = useMemo(() => {
    if (!listenerSearchTerm) return mockListeners;
    const query = listenerSearchTerm.toLowerCase();
    return mockListeners.filter(listener =>
      listener.name.toLowerCase().includes(query) ||
      listener.protocol.toLowerCase().includes(query)
    );
  }, [listenerSearchTerm]);

  // Paginated listeners
  const totalListenerPages = Math.ceil(filteredListeners.length / listenersPerPage);
  const paginatedListeners = useMemo(() => {
    const start = (listenerCurrentPage - 1) * listenersPerPage;
    return filteredListeners.slice(start, start + listenersPerPage);
  }, [filteredListeners, listenerCurrentPage, listenersPerPage]);

  // Filtered pools based on search
  const filteredPools = useMemo(() => {
    if (!poolSearchTerm) return mockPools;
    const query = poolSearchTerm.toLowerCase();
    return mockPools.filter(pool =>
      pool.name.toLowerCase().includes(query) ||
      pool.protocol.toLowerCase().includes(query) ||
      pool.algorithm.toLowerCase().includes(query)
    );
  }, [poolSearchTerm]);

  // Paginated pools
  const totalPoolPages = Math.ceil(filteredPools.length / poolsPerPage);
  const paginatedPools = useMemo(() => {
    const start = (poolCurrentPage - 1) * poolsPerPage;
    return filteredPools.slice(start, start + poolsPerPage);
  }, [filteredPools, poolCurrentPage, poolsPerPage]);

  // Listener columns
  const listenerColumns: TableColumn<Listener>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '64px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={listenerStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/listeners/${row.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'protocol',
      label: 'Protocol',
      flex: 1,
      sortable: true,
    },
    {
      key: 'port',
      label: 'Port',
      flex: 1,
      sortable: true,
    },
    {
      key: 'connectionLimit',
      label: 'Connection limit',
      flex: 1,
      sortable: true,
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '64px',
      align: 'center',
      render: (_: unknown, row: Listener) => {
        const listenerMenuItems: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', icon: <IconEdit size={14} stroke={1.5} />, onClick: () => console.log('Edit listener', row.id) },
          { id: 'delete', label: 'Delete', status: 'danger', onClick: () => console.log('Delete listener', row.id) },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={listenerMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Pool columns
  const poolColumns: TableColumn<Pool>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '64px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={poolStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/pools/${row.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'protocol',
      label: 'Protocol',
      width: '100px',
      sortable: true,
    },
    {
      key: 'algorithm',
      label: 'Algorithm',
      width: '123px',
      sortable: true,
    },
    {
      key: 'listener',
      label: 'Listener',
      width: '123px',
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/listeners/${row.listener.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.listener.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.listener.id}
          </span>
        </div>
      ),
    },
    {
      key: 'members',
      label: 'Members',
      width: '120px',
      sortable: true,
      align: 'center',
    },
    {
      key: 'adminState',
      label: 'Admin state',
      width: '103px',
      align: 'center',
    },
    {
      key: 'actions',
      label: 'Action',
      width: '64px',
      align: 'center',
      render: (_: unknown, row: Pool) => {
        const poolMenuItems: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', icon: <IconEdit size={14} stroke={1.5} />, onClick: () => console.log('Edit pool', row.id) },
          { id: 'delete', label: 'Delete', status: 'danger', onClick: () => console.log('Delete pool', row.id) },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={poolMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <main className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'}`}>
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar with Breadcrumb */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Proj-1', href: '/' },
                  { label: 'Load balancers', href: '/compute/load-balancers' },
                  { label: loadBalancer.name },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Main Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={8} className="min-w-[1176px]">
              {/* Detail header */}
              <DetailHeader>
                <DetailHeader.Title>{loadBalancer.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconUnlink size={12} />}>
                    Disassociate
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                  <ContextMenu
                    trigger="click"
                    items={[
                      {
                        id: 'edit',
                        label: 'Edit',
                        icon: <IconEdit size={14} stroke={1.5} />,
                        onClick: () => console.log('Edit clicked'),
                      },
                      {
                        id: 'create-listener',
                        label: 'Create listener',
                        icon: <IconCirclePlus size={14} stroke={1.5} />,
                        onClick: () => console.log('Create listener clicked'),
                      },
                    ]}
                  >
                  <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                    More Actions
                  </Button>
                  </ContextMenu>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={loadBalancer.status === 'active' ? 'Available' : loadBalancer.status}
                    status={statusMap[loadBalancer.status]}
                  />
                  <DetailHeader.InfoCard
                    label="ID"
                    value={loadBalancer.id}
                    truncate
                    copyable
                    onCopy={handleCopyId}
                  />
                  <DetailHeader.InfoCard label="Admin state" value={loadBalancer.adminState} />
                  <DetailHeader.InfoCard label="VIP Address" value={loadBalancer.vipAddress} />
                  <DetailHeader.InfoCard label="Created at" value={loadBalancer.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs Section */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} size="sm">
                  <div className="flex flex-col">
                    <TabList>
                      <Tab value="details">Details</Tab>
                      <Tab value="listeners">Listeners</Tab>
                      <Tab value="pools">Pools</Tab>
                    </TabList>

                    {/* Details Tab Panel */}
                    <TabPanel value="details" className="pt-0">
                      <VStack gap={4} className="pt-4">
                        {/* Basic information */}
                        <SectionCard>
                          <SectionCard.Header
                            title="Basic information"
                            actions={
                              <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                                Edit
                              </Button>
                            }
                          />
                          <SectionCard.Content>
                            <SectionCard.DataRow label="Name" value={loadBalancer.name} />
                            <SectionCard.DataRow label="Description" value={loadBalancer.description} />
                            <SectionCard.DataRow label="Admin state" value={loadBalancer.adminState} />
                            <SectionCard.DataRow label="Provider" value={loadBalancer.provider} />
                          </SectionCard.Content>
                        </SectionCard>

                        {/* Network */}
                        <SectionCard>
                          <SectionCard.Header title="Network" />
                          <SectionCard.Content>
                            <SectionCard.DataRow label="VIP Address" value={loadBalancer.vipAddress} />
                            <div className="flex flex-col gap-3 w-full">
                              <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                                  Owned network
                                </span>
                                {loadBalancer.ownedNetwork ? (
                                  <Link
                                    to={`/compute/networks/${loadBalancer.ownedNetwork.id}`}
                                    className="flex items-center gap-1.5 text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
                                  >
                                    {loadBalancer.ownedNetwork.name}
                                  </Link>
                                ) : (
                                  <span className="text-[12px] leading-4 text-[var(--color-text-default)]">-</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-3 w-full">
                              <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                                  Subnet
                                </span>
                                {loadBalancer.subnet ? (
                                  <Link
                                    to={`/compute/subnets/${loadBalancer.subnet.id}`}
                                    className="flex items-center gap-1.5 text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
                                  >
                                    {loadBalancer.subnet.name}
                                  </Link>
                                ) : (
                                  <span className="text-[12px] leading-4 text-[var(--color-text-default)]">-</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-3 w-full">
                              <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                                  Floating IP
                                </span>
                                {loadBalancer.floatingIp ? (
                                  <Link
                                    to={`/compute/floating-ips/${loadBalancer.floatingIp.id}`}
                                    className="flex items-center gap-1.5 text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
                                  >
                                    {loadBalancer.floatingIp.name}
                                  </Link>
                                ) : (
                                  <span className="text-[12px] leading-4 text-[var(--color-text-default)]">-</span>
                                )}
                              </div>
                            </div>
                          </SectionCard.Content>
                        </SectionCard>
                      </VStack>
                    </TabPanel>

                    {/* Listeners Tab Panel */}
                    <TabPanel value="listeners" className="pt-0">
                      <VStack gap={4} className="pt-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                            Listener
                          </h3>
                          <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                            Create listener
                          </Button>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center gap-2">
                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              value={listenerSearchTerm}
                              onChange={(e) => {
                                setListenerSearchTerm(e.target.value);
                                setListenerCurrentPage(1);
                              }}
                              placeholder="Search listener by attributes"
                            />
                          </div>
                          <div className="h-4 w-px bg-[var(--color-border-default)]" />
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconTrash size={12} />}
                            disabled={selectedListeners.length === 0}
                          >
                            Delete
                          </Button>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                          <Pagination
                            currentPage={listenerCurrentPage}
                            totalPages={totalListenerPages}
                            onPageChange={setListenerCurrentPage}
                            totalItems={filteredListeners.length}
                            selectedCount={selectedListeners.length}
                            showSettings
                            onSettingsClick={() => setIsPreferencesOpen(true)}
                          />
                        </div>

                        {/* Table */}
                        <Table
                          columns={listenerColumns}
                          data={paginatedListeners}
                          rowKey="id"
                          selectable
                          selectedKeys={selectedListeners}
                          onSelectionChange={setSelectedListeners}
                        />
                      </VStack>
                    </TabPanel>

                    {/* Pools Tab Panel */}
                    <TabPanel value="pools" className="pt-0">
                      <VStack gap={4} className="pt-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                            Pools
                          </h3>
                          <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                            Create Pool
                          </Button>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center gap-2">
                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              value={poolSearchTerm}
                              onChange={(e) => {
                                setPoolSearchTerm(e.target.value);
                                setPoolCurrentPage(1);
                              }}
                              placeholder="Search pool by attributes"
                            />
                          </div>
                          <div className="h-4 w-px bg-[var(--color-border-default)]" />
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconTrash size={12} />}
                            disabled={selectedPools.length === 0}
                          >
                            Delete
                          </Button>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                          <Pagination
                            currentPage={poolCurrentPage}
                            totalPages={totalPoolPages}
                            onPageChange={setPoolCurrentPage}
                            totalItems={filteredPools.length}
                            selectedCount={selectedPools.length}
                            showSettings
                            onSettingsClick={() => setIsPreferencesOpen(true)}
                          />
                        </div>

                        {/* Table */}
                        <Table
                          columns={poolColumns}
                          data={paginatedPools}
                          rowKey="id"
                          selectable
                          selectedKeys={selectedPools}
                          onSelectionChange={setSelectedPools}
                        />
                      </VStack>
                    </TabPanel>
                  </div>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoadBalancerDetailPage;

