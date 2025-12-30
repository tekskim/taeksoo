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
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconBell,
  IconChevronDown,
  IconExternalLink,
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
  name: string;
  status: MemberStatus;
  address: string;
  port: number;
  weight: number;
  adminState: 'Up' | 'Down';
}

interface HealthMonitor {
  id: string;
  name: string;
  type: string;
  delay: number;
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
  listener: { name: 'web-server-10', id: 'listener-001' },
};

/* ----------------------------------------
   Mock Members Data
   ---------------------------------------- */

const mockMembers: Member[] = Array.from({ length: 115 }, (_, i) => ({
  id: `member-${String(i + 1).padStart(3, '0')}`,
  name: `member-${String(i + 1).padStart(2, '0')}`,
  status: ['active', 'active', 'active', 'down', 'error'][i % 5] as MemberStatus,
  address: `192.168.1.${(i % 254) + 1}`,
  port: [80, 443, 8080, 3000][i % 4],
  weight: i % 10 + 1,
  adminState: i % 10 === 0 ? 'Down' : 'Up',
}));

/* ----------------------------------------
   Mock Health Monitor Data
   ---------------------------------------- */

const mockHealthMonitors: HealthMonitor[] = Array.from({ length: 10 }, (_, i) => ({
  id: `hm-${String(i + 1).padStart(3, '0')}`,
  name: `health-monitor-${String(i + 1).padStart(2, '0')}`,
  type: ['HTTP', 'HTTPS', 'TCP', 'PING'][i % 4],
  delay: [5, 10, 15, 30][i % 4],
  timeout: [5, 10, 15, 20][i % 4],
  maxRetries: [3, 5, 10][i % 3],
  adminState: i % 5 === 0 ? 'Down' : 'Up',
}));

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
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const membersPerPage = 10;

  // Health Monitor state
  const [healthMonitorSearchTerm, setHealthMonitorSearchTerm] = useState('');
  const [healthMonitorCurrentPage, setHealthMonitorCurrentPage] = useState(1);
  const [selectedHealthMonitors, setSelectedHealthMonitors] = useState<string[]>([]);
  const healthMonitorsPerPage = 10;

  // In a real app, fetch based on id
  const pool = mockPoolDetail;

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Load Balancers', href: '/load-balancers' },
    { label: 'web-lb-01', href: '/load-balancers/lb-001' },
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
      member.name.toLowerCase().includes(query) ||
      member.address.toLowerCase().includes(query)
    );
  }, [memberSearchTerm]);

  // Paginated members
  const totalMemberPages = Math.ceil(filteredMembers.length / membersPerPage);
  const paginatedMembers = useMemo(() => {
    const start = (memberCurrentPage - 1) * membersPerPage;
    return filteredMembers.slice(start, start + membersPerPage);
  }, [filteredMembers, memberCurrentPage, membersPerPage]);

  // Filtered health monitors based on search
  const filteredHealthMonitors = useMemo(() => {
    if (!healthMonitorSearchTerm) return mockHealthMonitors;
    const query = healthMonitorSearchTerm.toLowerCase();
    return mockHealthMonitors.filter(hm =>
      hm.name.toLowerCase().includes(query) ||
      hm.type.toLowerCase().includes(query)
    );
  }, [healthMonitorSearchTerm]);

  // Paginated health monitors
  const totalHealthMonitorPages = Math.ceil(filteredHealthMonitors.length / healthMonitorsPerPage);
  const paginatedHealthMonitors = useMemo(() => {
    const start = (healthMonitorCurrentPage - 1) * healthMonitorsPerPage;
    return filteredHealthMonitors.slice(start, start + healthMonitorsPerPage);
  }, [filteredHealthMonitors, healthMonitorCurrentPage, healthMonitorsPerPage]);

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
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/members/${row.id}`}
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
      key: 'address',
      label: 'Address',
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
      key: 'weight',
      label: 'Weight',
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
      render: () => (
        <Button variant="tertiary" size="sm" iconOnly icon={<IconDotsCircleHorizontal size={16} stroke={1} />} />
      ),
    },
  ];

  // Health Monitor columns
  const healthMonitorColumns: TableColumn<HealthMonitor>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/health-monitors/${row.id}`}
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
      key: 'type',
      label: 'Type',
      flex: 1,
      sortable: true,
    },
    {
      key: 'delay',
      label: 'Delay',
      flex: 1,
      sortable: true,
      render: (_, row) => `${row.delay}s`,
    },
    {
      key: 'timeout',
      label: 'Timeout',
      flex: 1,
      sortable: true,
      render: (_, row) => `${row.timeout}s`,
    },
    {
      key: 'maxRetries',
      label: 'Max Retries',
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
      render: () => (
        <Button variant="tertiary" size="sm" iconOnly icon={<IconDotsCircleHorizontal size={16} stroke={1} />} />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 overflow-x-auto ${
          sidebarOpen ? 'ml-[200px]' : 'ml-0'
        }`}
      >
        <div className="min-w-[var(--layout-content-min-width)]">
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
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<IconChevronDown size={12} />}
                  >
                    More Actions
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

                  {/* Members Tab */}
                  <TabPanel value="members">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Members
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Add Member
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
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedMembers.length === 0}
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2">
                        <Pagination
                          currentPage={memberCurrentPage}
                          totalPages={totalMemberPages}
                          onPageChange={setMemberCurrentPage}
                        />
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                          {filteredMembers.length} items
                        </span>
                      </div>

                      {/* Table */}
                      <Table
                        columns={memberColumns}
                        data={paginatedMembers}
                        rowKey="id"
                        selectable
                        selectedRows={selectedMembers}
                        onSelectionChange={setSelectedMembers}
                      />
                    </VStack>
                  </TabPanel>

                  {/* Health Monitor Tab */}
                  <TabPanel value="health-monitor">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Health Monitor
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Create Health Monitor
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            value={healthMonitorSearchTerm}
                            onChange={(e) => {
                              setHealthMonitorSearchTerm(e.target.value);
                              setHealthMonitorCurrentPage(1);
                            }}
                            placeholder="Find health monitor with filters"
                          />
                        </div>
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedHealthMonitors.length === 0}
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2">
                        <Pagination
                          currentPage={healthMonitorCurrentPage}
                          totalPages={totalHealthMonitorPages}
                          onPageChange={setHealthMonitorCurrentPage}
                        />
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                          {filteredHealthMonitors.length} items
                        </span>
                      </div>

                      {/* Table */}
                      <Table
                        columns={healthMonitorColumns}
                        data={paginatedHealthMonitors}
                        rowKey="id"
                        selectable
                        selectedRows={selectedHealthMonitors}
                        onSelectionChange={setSelectedHealthMonitors}
                      />
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

