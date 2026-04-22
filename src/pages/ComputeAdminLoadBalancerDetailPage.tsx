import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Button,
  VStack,
  PageShell,
  TabBar,
  TopBar,
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
  Badge,
  fixedColumns,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconDotsCircleHorizontal, IconDownload } from '@tabler/icons-react';
import { InlineCopyId } from '@/components/InlineCopyId';

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
    createdAt: 'Oct 3, 2026 00:46:02',
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
    createdAt: 'Oct 2, 2026 17:33:45',
    description: 'API Load balancer',
    provider: 'ovn',
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    floatingIp: { name: '192.168.10.14', id: 'fip-002' },
  },
  'lb-003': {
    id: 'lb-003',
    name: 'app-lb',
    status: 'pending',
    adminState: 'Up',
    vipAddress: '192.168.10.15',
    createdAt: 'Oct 1, 2026 10:20:28',
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

export function ComputeAdminLoadBalancerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [isCopied, setIsCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Listeners state
  const [listenerSearchTerm, setListenerSearchTerm] = useState('');
  const [listenerCurrentPage, setListenerCurrentPage] = useState(1);
  const [selectedListeners, setSelectedListeners] = useState<string[]>([]);
  const listenersPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Get load balancer based on URL id
  const loadBalancer = id ? mockLoadBalancersMap[id] || defaultLoadBalancer : defaultLoadBalancer;

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
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filtered listeners based on search
  const filteredListeners = useMemo(() => {
    if (!listenerSearchTerm) return mockListeners;
    const query = listenerSearchTerm.toLowerCase();
    return mockListeners.filter(
      (listener) =>
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
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator layout="icon-only" status={listenerStatusMap[row.status]} />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/listeners/${row.id}`}
            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.id}>
              ID : {row.id.slice(0, 8)}
            </span>
            <InlineCopyId value={row.id} />
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
      render: (_, row) => (
        <Badge variant={row.adminState === 'Up' ? 'success' : 'default'} size="sm">
          {row.adminState}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_: unknown, row: Listener) => {
        const listenerMenuItems: ContextMenuItem[] = [
          {
            id: 'delete-default-pool',
            label: 'Delete default pool',
            status: 'danger',
            onClick: () => console.log('Delete default pool', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete listener', row.id),
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={listenerMenuItems} trigger="click" align="right">
              <button
                aria-label="Row actions"
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
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
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Load Balancers', href: '/compute-admin/load-balancers' },
                { label: loadBalancer.name },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Detail header */}
        <DetailHeader>
          <DetailHeader.Title>{loadBalancer.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
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
            <DetailHeader.InfoCard label="Tenant" value="tenantA" />
            <DetailHeader.InfoCard label="VIP Address" value={loadBalancer.vipAddress} />
            <DetailHeader.InfoCard label="Admin State" value={loadBalancer.adminState} />
            <DetailHeader.InfoCard
              label="Origin"
              value={
                <span className="text-body-md text-[var(--color-text-default)]">
                  Container(
                  <Link
                    to="/container"
                    className="text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                  >
                    cluster-01
                  </Link>
                  )
                </span>
              }
            />
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
              <TabPanel value="details" className="pt-0">
                <VStack gap={4} className="pt-4">
                  {/* Basic information */}
                  <SectionCard>
                    <SectionCard.Header title="Basic information" />
                    <SectionCard.Content>
                      <SectionCard.DataRow label="Load balancer name" value={loadBalancer.name} />
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
                      <SectionCard.DataRow
                        label="Owned network"
                        value={loadBalancer.ownedNetwork?.name ?? '-'}
                        isLink={!!loadBalancer.ownedNetwork}
                        linkHref={
                          loadBalancer.ownedNetwork
                            ? `/compute-admin/networks/${loadBalancer.ownedNetwork.id}`
                            : undefined
                        }
                      />
                      <SectionCard.DataRow
                        label="Subnet"
                        value={loadBalancer.subnet?.name ?? '-'}
                        isLink={!!loadBalancer.subnet}
                        linkHref={
                          loadBalancer.subnet
                            ? `/compute-admin/subnets/${loadBalancer.subnet.id}`
                            : undefined
                        }
                      />
                      <SectionCard.DataRow
                        label="Floating IP"
                        value={loadBalancer.floatingIp?.name ?? '-'}
                        isLink={!!loadBalancer.floatingIp}
                        linkHref={
                          loadBalancer.floatingIp
                            ? `/compute-admin/floating-ips/${loadBalancer.floatingIp.id}`
                            : undefined
                        }
                      />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>
              </TabPanel>

              {/* Listeners Tab Panel */}
              <TabPanel value="listeners" className="pt-0">
                <VStack gap={4} className="pt-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-heading-h5 text-[var(--color-text-default)]">Listener</h3>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
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
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<IconDownload size={12} />}
                        aria-label="Download"
                      />
                    </div>
                    <div className="h-4 w-px bg-[var(--color-border-default)]" />
                    <Button
                      variant="muted"
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
            </div>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default ComputeAdminLoadBalancerDetailPage;
