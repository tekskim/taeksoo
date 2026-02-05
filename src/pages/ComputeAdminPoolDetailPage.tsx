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
  fixedColumns,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell, IconDownload } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PoolStatus = 'active' | 'down' | 'error';
type MemberStatus = 'active' | 'down' | 'error';

interface PoolDetail {
  id: string;
  name: string;
  status: PoolStatus;
  adminState: 'Up' | 'Down';
  createdAt: string;
  // Basic information
  description: string;
  algorithm: string;
  protocol: string;
  sessionPersistence: string;
  // Association
  listener: { name: string; id: string } | null;
}

interface Member {
  id: string;
  status: MemberStatus;
  source: {
    name: string;
    id: string;
  };
  ipAddress: string;
  port: number;
  weight: number;
  backup: boolean;
  adminState: 'Up' | 'Down';
}

interface HealthMonitor {
  id: string;
  name: string;
  state: string;
  type: string;
  interval: number;
  timeout: number;
  maxRetries: number;
  adminState: 'Up' | 'Down';
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Mock data - synchronized with ListenerDetailPage pools (id format: 29fg234XX)
const mockPoolsMap: Record<string, PoolDetail> = {
  '29fg23400': {
    id: '29fg23400',
    name: 'pool-http',
    status: 'active',
    adminState: 'Up',
    createdAt: '2025-07-25 09:12:20',
    description: '-',
    algorithm: 'Round Robin',
    protocol: 'HTTP',
    sessionPersistence: 'None',
    listener: { name: 'listener-http-80', id: '29tgj234' },
  },
  '29fg23401': {
    id: '29fg23401',
    name: 'pool-http',
    status: 'active',
    adminState: 'Up',
    createdAt: '2025-07-24 10:30:00',
    description: 'HTTP connection pool',
    algorithm: 'Round Robin',
    protocol: 'HTTP',
    sessionPersistence: 'None',
    listener: { name: 'listener-http-80', id: '29tgj234' },
  },
  '29fg23402': {
    id: '29fg23402',
    name: 'pool-http',
    status: 'active',
    adminState: 'Up',
    createdAt: '2025-07-23 14:00:00',
    description: 'HTTP connection pool',
    algorithm: 'Round Robin',
    protocol: 'HTTP',
    sessionPersistence: 'None',
    listener: { name: 'listener-http-80', id: '29tgj234' },
  },
};

const defaultPoolDetail: PoolDetail = {
  id: 'pool-default',
  name: 'Unknown Pool',
  status: 'active',
  adminState: 'Up',
  createdAt: '-',
  description: '-',
  algorithm: '-',
  protocol: '-',
  sessionPersistence: '-',
  listener: { name: '-', id: '' },
};

/* ----------------------------------------
   Mock Members Data
   ---------------------------------------- */

const mockMembers: Member[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29fg234`,
  status: ['active', 'active', 'active', 'down', 'error'][i % 5] as MemberStatus,
  source: {
    name: 'instance-usw-lo',
    id: `29fg234`,
  },
  ipAddress: '10.63.0.46',
  port: 80,
  weight: 1,
  backup: false,
  adminState: 'Up' as const,
}));

/* ----------------------------------------
   Mock Health Monitor Data
   ---------------------------------------- */

const mockHealthMonitor: HealthMonitor = {
  id: 'hm-001',
  name: 'hm-pool-http',
  state: 'Online',
  type: 'HTTP',
  interval: 5,
  timeout: 3,
  maxRetries: 3,
  adminState: 'Up',
};

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const poolStatusMap: Record<PoolStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const memberStatusMap: Record<MemberStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

/* ----------------------------------------
   PoolDetailPage Component
   ---------------------------------------- */

export default function PoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedId, setCopiedId] = useState(false);

  // Get pool based on URL id
  const pool = id ? mockPoolsMap[id] || defaultPoolDetail : defaultPoolDetail;

  // Update tab label when pool name changes
  useEffect(() => {
    if (pool.name) {
      updateActiveTabLabel(pool.name);
    }
  }, [pool.name, updateActiveTabLabel]);

  // Members state
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberCurrentPage, setMemberCurrentPage] = useState(1);
  const membersPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const healthMonitor = mockHealthMonitor;

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/' },
    { label: 'Load balancers', href: '/compute-admin/load-balancers' },
    { label: 'web-lb-01', href: '/compute-admin/load-balancers/lb-001' },
    { label: 'listener-http-80', href: '/listeners/listener-001' },
    { label: pool.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleCopyId = () => {
    navigator.clipboard.writeText(pool.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered members based on search
  const filteredMembers = useMemo(() => {
    if (!memberSearchTerm) return mockMembers;
    const query = memberSearchTerm.toLowerCase();
    return mockMembers.filter(
      (member) =>
        member.id.toLowerCase().includes(query) ||
        member.source.name.toLowerCase().includes(query) ||
        member.ipAddress.toLowerCase().includes(query)
    );
  }, [memberSearchTerm]);

  // Paginated members
  const totalMemberPages = Math.ceil(filteredMembers.length / membersPerPage);
  const paginatedMembers = useMemo(() => {
    const start = (memberCurrentPage - 1) * membersPerPage;
    return filteredMembers.slice(start, start + membersPerPage);
  }, [filteredMembers, memberCurrentPage, membersPerPage]);

  // Member columns
  const memberColumns: TableColumn<Member>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={memberStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      flex: 1,
    },
    {
      key: 'port',
      label: 'Port',
      flex: 1,
      sortable: true,
    },
    {
      key: 'weight',
      label: 'Weight',
      flex: 1,
      sortable: true,
    },
    {
      key: 'backup',
      label: 'Backup',
      flex: 1,
      render: (_, row) => (row.backup ? 'Yes' : 'No'),
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: Member) => {
        const memberMenuItems: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', onClick: () => console.log('Edit member', row.id) },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete member', row.id),
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={memberMenuItems} trigger="click" align="right">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconTrash size={16} stroke={1.5} className="text-[var(--color-state-danger)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Health Monitor columns
  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
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

          {/* Top Bar */}
          <TopBar
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                onClick={() => {}}
                hasNotification
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={8} className="min-w-[1176px]">
              {/* Detail header */}
              <DetailHeader>
                <DetailHeader.Title>{pool.name}</DetailHeader.Title>

                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </DetailHeader.Actions>

                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={pool.status === 'active' ? 'Online' : pool.status}
                    status={poolStatusMap[pool.status]}
                  />
                  <DetailHeader.InfoCard
                    label="ID"
                    value={pool.id}
                    copyable
                    onCopy={handleCopyId}
                    className="flex-1"
                  />
                  <DetailHeader.InfoCard label="Admin state" value={pool.adminState} />
                  <DetailHeader.InfoCard label="Created at" value={pool.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="members">Members</Tab>
                    <Tab value="health-monitor">Health monitor</Tab>
                  </TabList>

                  {/* Details Tab */}
                  <TabPanel value="details" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Basic information */}
                      <SectionCard>
                        <SectionCard.Header title="Basic information" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Name" value={pool.name} />
                          <SectionCard.DataRow label="Description" value={pool.description} />
                          <SectionCard.DataRow label="Admin state" value={pool.adminState} />
                          <SectionCard.DataRow label="Algorithm" value={pool.algorithm} />
                          <SectionCard.DataRow label="Protocol" value={pool.protocol} />
                          <SectionCard.DataRow
                            label="Session persistence"
                            value={pool.sessionPersistence}
                          />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Association */}
                      <SectionCard>
                        <SectionCard.Header title="Association" />
                        <SectionCard.Content>
                          <div className="flex flex-col gap-3 w-full">
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                            <div className="flex flex-col gap-1.5">
                              <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">
                                Listener
                              </span>
                              {pool.listener && pool.listener.id ? (
                                <Link
                                  to={`/compute-admin/listeners/${pool.listener.id}`}
                                  className="flex items-center gap-1.5 text-label-md leading-4 text-[var(--color-action-primary)] hover:underline"
                                >
                                  {pool.listener.name}
                                </Link>
                              ) : (
                                <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                  -
                                </span>
                              )}
                            </div>
                          </div>
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Members Tab */}
                  <TabPanel value="members" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                          Members
                        </h3>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              value={memberSearchTerm}
                              onChange={(e) => {
                                setMemberSearchTerm(e.target.value);
                                setMemberCurrentPage(1);
                              }}
                              placeholder="Search member by attributes"
                            />
                          </div>
                          <button
                            type="button"
                            className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
                            aria-label="Download"
                          >
                            <IconDownload size={14} stroke={1.5} />
                          </button>
                        </div>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={memberCurrentPage}
                        totalPages={totalMemberPages}
                        onPageChange={setMemberCurrentPage}
                        totalItems={filteredMembers.length}
                      />

                      {/* Table */}
                      <Table columns={memberColumns} data={paginatedMembers} rowKey="id" />
                    </VStack>
                  </TabPanel>

                  {/* Health Monitor Tab */}
                  <TabPanel value="health-monitor" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      <SectionCard>
                        <SectionCard.Header title="Health Monitor" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Health Monitor Name"
                            value={healthMonitor.name}
                          />
                          <SectionCard.DataRow label="State" value={healthMonitor.state} />
                          <SectionCard.DataRow
                            label="Admin state"
                            value={healthMonitor.adminState}
                          />
                          <SectionCard.DataRow label="Type" value={healthMonitor.type} />
                          <SectionCard.DataRow
                            label="Interval"
                            value={`${healthMonitor.interval} sec`}
                          />
                          <SectionCard.DataRow
                            label="Timeout"
                            value={`${healthMonitor.timeout} sec`}
                          />
                          <SectionCard.DataRow
                            label="Max retries"
                            value={String(healthMonitor.maxRetries)}
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
