import { useState, useMemo } from 'react';
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
  IconLink,
  IconUnlink,
  IconTrash,
  IconBell,
  IconChevronDown,
  IconExternalLink,
  IconEdit,
  IconCirclePlus,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

// Types
type LoadBalancerStatus = 'active' | 'pending' | 'error';
type ListenerStatus = 'active' | 'down' | 'error';

interface LoadBalancerDetail {
  id: string;
  name: string;
  status: LoadBalancerStatus;
  adminState: 'Up' | 'Down';
  vipAddress: string;
  createdAt: string;
  // Basic Information
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

// Status mapping for StatusIndicator
const statusMap: Record<LoadBalancerStatus, 'active' | 'building' | 'error'> = {
  active: 'active',
  pending: 'building',
  error: 'error',
};

// Mock data
const mockLoadBalancer: LoadBalancerDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'web-lb-01',
  status: 'active',
  adminState: 'Up',
  vipAddress: '192.168.10.13',
  createdAt: '2025-07-25 09:12:20',
  // Basic Information
  description: '-',
  provider: 'ovn',
  // Network
  ownedNetwork: { name: 'web-server-10', id: 'net-001' },
  subnet: { name: 'web-server-10', id: 'subnet-001' },
  floatingIp: { name: 'web-server-10', id: 'fip-001' },
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

export function LoadBalancerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  const [activeTab, setActiveTab] = useState('details');
  const [isCopied, setIsCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Listeners state
  const [listenerSearchTerm, setListenerSearchTerm] = useState('');
  const [listenerCurrentPage, setListenerCurrentPage] = useState(1);
  const [selectedListeners, setSelectedListeners] = useState<string[]>([]);
  const listenersPerPage = 10;
  
  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // In a real app, you would fetch the load balancer details based on the id
  const loadBalancer = mockLoadBalancer;

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

  // Listener columns
  const listenerColumns: TableColumn<Listener>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
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
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
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
      label: 'Connection Limit',
      flex: 1,
      sortable: true,
    },
    {
      key: 'adminState',
      label: 'Admin State',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
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

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <main className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}>
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
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
                  { label: 'Load Balancers', href: '/compute/load-balancers' },
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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px] max-w-[1320px]">
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>{loadBalancer.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconLink size={12} />}>
                    Associate
                  </Button>
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
                        label: 'Create Listener',
                        icon: <IconCirclePlus size={14} stroke={1.5} />,
                        onClick: () => console.log('Create Listener clicked'),
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
                  <DetailHeader.InfoCard label="Admin State" value={loadBalancer.adminState} />
                  <DetailHeader.InfoCard label="VIP Address" value={loadBalancer.vipAddress} />
                  <DetailHeader.InfoCard label="Created At" value={loadBalancer.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs Section */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} size="sm">
                  <div className="flex flex-col">
                    <TabList>
                      <Tab value="details">Details</Tab>
                      <Tab value="listeners">Listeners</Tab>
                    </TabList>

                    {/* Details Tab Panel */}
                    <TabPanel value="details">
                      <VStack gap={4} className="pt-6">
                        {/* Basic Information */}
                        <SectionCard>
                          <SectionCard.Header
                            title="Basic Information"
                            actions={
                              <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                                Edit
                              </Button>
                            }
                          />
                          <SectionCard.Content>
                            <SectionCard.DataRow label="Name" value={loadBalancer.name} />
                            <SectionCard.DataRow label="Description" value={loadBalancer.description} />
                            <SectionCard.DataRow label="Admin State" value={loadBalancer.adminState} />
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
                                  Owned Network
                                </span>
                                {loadBalancer.ownedNetwork ? (
                                  <Link
                                    to={`/compute/networks/${loadBalancer.ownedNetwork.id}`}
                                    className="flex items-center gap-1.5 text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
                                  >
                                    {loadBalancer.ownedNetwork.name}
                                    <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
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
                                    <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
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
                                    <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
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
                    <TabPanel value="listeners">
                      <VStack gap={3} className="pt-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                            Listener
                          </h3>
                          <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                            Create Listener
                          </Button>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center gap-2">
                          <div className="w-[280px]">
                            <SearchInput
                              value={listenerSearchTerm}
                              onChange={(e) => {
                                setListenerSearchTerm(e.target.value);
                                setListenerCurrentPage(1);
                              }}
                              placeholder="Find Listener with filters"
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
                          selectedRows={selectedListeners}
                          onSelectionChange={setSelectedListeners}
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

