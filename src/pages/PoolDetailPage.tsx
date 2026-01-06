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
  IconEdit,
  IconTrash,
  IconBell,
  IconChevronDown,
  IconCirclePlus,
  IconDotsCircleHorizontal,
  IconUsers,
} from '@tabler/icons-react';

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
  // Basic Information
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

const mockPoolDetail: PoolDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'pool-http',
  status: 'active',
  adminState: 'Up',
  createdAt: '2025-07-25 09:12:20',
  // Basic Information
  description: '-',
  algorithm: 'Round Robin',
  protocol: 'HTTP',
  sessionPersistence: 'None',
  // Association
  listener: { name: 'listener-http-80', id: 'listener-001' },
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
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedId, setCopiedId] = useState(false);

  // Members state
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberCurrentPage, setMemberCurrentPage] = useState(1);
  const membersPerPage = 10;
  
  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // In a real app, fetch based on id
  const pool = mockPoolDetail;
  const healthMonitor = mockHealthMonitor;

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Load Balancers', href: '/compute/load-balancers' },
    { label: 'web-lb-01', href: '/compute/load-balancers/lb-001' },
    { label: 'listener-http-80', href: '/listeners/listener-001' },
    { label: pool.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map(tab => ({
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
    return mockMembers.filter(member =>
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
      width: '59px',
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
      render: (_, row) => row.backup ? 'Yes' : 'No',
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
      render: (_: unknown, row: Member) => {
        const memberMenuItems: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', onClick: () => console.log('Edit member', row.id) },
          { id: 'delete', label: 'Delete', status: 'danger', onClick: () => console.log('Delete member', row.id) },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={memberMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
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
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
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
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px] max-w-[1320px]">
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>{pool.name}</DetailHeader.Title>

                <DetailHeader.Actions>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconEdit size={12} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconUsers size={12} />}
                  >
                    Manage Members
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                  >
                    Delete
                  </Button>
                  <ContextMenu
                    items={[
                      { id: 'create-health-monitor', label: 'Create health monitor', onClick: () => console.log('Create health monitor') },
                      { id: 'edit-health-monitor', label: 'Edit health monitor', onClick: () => console.log('Edit health monitor') },
                      { id: 'delete-health-monitor', label: 'Delete health monitor', status: 'danger', onClick: () => console.log('Delete health monitor') },
                    ]}
                    trigger="click"
                  >
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<IconChevronDown size={12} />}
                  >
                    More Actions
                  </Button>
                  </ContextMenu>
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
                  <DetailHeader.InfoCard
                    label="Admin State"
                    value={pool.adminState}
                  />
                  <DetailHeader.InfoCard
                    label="Created At"
                    value={pool.createdAt}
                  />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="members">Members</Tab>
                    <Tab value="health-monitor">Health Monitor</Tab>
                  </TabList>

                  {/* Details Tab */}
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
                          <SectionCard.DataRow label="Name" value={pool.name} />
                          <SectionCard.DataRow label="Description" value={pool.description} />
                          <SectionCard.DataRow label="Algorithm" value={pool.algorithm} />
                          <SectionCard.DataRow label="Protocol" value={pool.protocol} />
                          <SectionCard.DataRow label="Session Persistence" value={pool.sessionPersistence} />
                          <SectionCard.DataRow label="Admin State" value={pool.adminState} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Association */}
                      <SectionCard>
                        <SectionCard.Header title="Association" />
                        <SectionCard.Content>
                          <div className="flex flex-col gap-3 w-full">
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                                Listener
                              </span>
                              {pool.listener ? (
                                <Link
                                  to={`/listeners/${pool.listener.id}`}
                                  className="flex items-center gap-1.5 text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
                                >
                                  {pool.listener.name}
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

                  {/* Members Tab */}
                  <TabPanel value="members">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Members
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconUsers size={12} />}>
                          Manage Members
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            value={memberSearchTerm}
                            onChange={(e) => {
                              setMemberSearchTerm(e.target.value);
                              setMemberCurrentPage(1);
                            }}
                            placeholder="Find member with filters"
                          />
                        </div>
                      </div>

                      {/* Pagination */}
                        <Pagination
                          currentPage={memberCurrentPage}
                          totalPages={totalMemberPages}
                          onPageChange={setMemberCurrentPage}
                        totalItems={filteredMembers.length}
                        showSettings
                        onSettingsClick={() => setIsPreferencesOpen(true)}
                        />

                      {/* Table */}
                      <Table
                        columns={memberColumns}
                        data={paginatedMembers}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>

                  {/* Health Monitor Tab */}
                  <TabPanel value="health-monitor">
                    <VStack gap={6} className="pt-6">
                      <SectionCard>
                        <SectionCard.Header
                          title="Health Monitor"
                          actions={
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                                Edit
                              </Button>
                              <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                                Delete
                              </Button>
                            </div>
                          }
                        />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Name" value={healthMonitor.name} />
                          <SectionCard.DataRow label="State" value={healthMonitor.state} />
                          <SectionCard.DataRow label="Type" value={healthMonitor.type} />
                          <SectionCard.DataRow label="Interval" value={`${healthMonitor.interval} sec`} />
                          <SectionCard.DataRow label="Timeout" value={`${healthMonitor.timeout} sec`} />
                          <SectionCard.DataRow label="Max Retries" value={String(healthMonitor.maxRetries)} />
                          <SectionCard.DataRow label="Admin State" value={healthMonitor.adminState} />
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

