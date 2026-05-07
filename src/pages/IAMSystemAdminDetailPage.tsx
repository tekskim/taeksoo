import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Badge,
  Button,
  Table,
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  ContextMenu,
  SectionCard,
  SearchInput,
  Pagination,
  PageShell,
  DetailHeader,
  StatusIndicator,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconRefresh,
  IconCircleX,
  IconReload,
  IconDotsCircleHorizontal,
  IconCirclePlus,
  IconCircleMinus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface SystemAdminDetail {
  id: string;
  username: string;
  displayName: string;
  email: string;
  status: 'online' | 'offline';
  defaultDomain: string;
  createdAt: string;
  locked: boolean;
}

interface MFAMethod {
  id: string;
  method: string;
  lastUsed: string;
  createdAt: string;
}

interface AccessKey {
  id: string;
  keyId: string;
  description: string;
  status: 'active' | 'inactive';
  lastUsed: string;
  createdAt: string;
}

interface Session {
  id: string;
  started: string;
  lastAccess: string;
  ipAddress: string;
  device: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockAdminsMap: Record<string, SystemAdminDetail> = {
  'thaki-kim': {
    id: '1231515672',
    username: 'thaki-kim',
    displayName: 'thaki.kim',
    email: 'thaki.kim@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'Jul 25, 2026 10:32:16',
    locked: false,
  },
  'alex-jones': {
    id: '1231515673',
    username: 'alex-jones',
    displayName: 'alex.jones',
    email: 'alex.jones@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'Aug 15, 2026 12:22:26',
    locked: false,
  },
  'sarah-lee': {
    id: '1231515674',
    username: 'sarah-lee',
    displayName: 'sarah.lee',
    email: 'sarah.lee@example.com',
    status: 'online',
    defaultDomain: 'domain B',
    createdAt: 'Jul 20, 2026 23:27:51',
    locked: false,
  },
  'john-doe': {
    id: '1231515675',
    username: 'john-doe',
    displayName: 'john.doe',
    email: 'john.doe@example.com',
    status: 'offline',
    defaultDomain: 'domain A',
    createdAt: 'Jun 10, 2026 01:17:01',
    locked: true,
  },
  'jane-smith': {
    id: '1231515676',
    username: 'jane-smith',
    displayName: 'jane.smith',
    email: 'jane.smith@example.com',
    status: 'online',
    defaultDomain: 'domain C',
    createdAt: 'Sep 1, 2026 10:20:28',
    locked: false,
  },
  'mike-wilson': {
    id: '1231515677',
    username: 'mike-wilson',
    displayName: 'mike.wilson',
    email: 'mike.wilson@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'Aug 25, 2026 10:32:16',
    locked: false,
  },
  'emily-davis': {
    id: '1231515678',
    username: 'emily-davis',
    displayName: 'emily.davis',
    email: 'emily.davis@example.com',
    status: 'offline',
    defaultDomain: 'domain B',
    createdAt: 'Sep 10, 2026 01:17:01',
    locked: false,
  },
  'chris-martin': {
    id: '1231515679',
    username: 'chris-martin',
    displayName: 'chris.martin',
    email: 'chris.martin@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'Jul 5, 2026 14:12:36',
    locked: true,
  },
  'lisa-anderson': {
    id: '1231515680',
    username: 'lisa-anderson',
    displayName: 'lisa.anderson',
    email: 'lisa.anderson@example.com',
    status: 'online',
    defaultDomain: 'domain C',
    createdAt: 'Jun 1, 2026 10:20:28',
    locked: false,
  },
  'david-brown': {
    id: '1231515681',
    username: 'david-brown',
    displayName: 'david.brown',
    email: 'david.brown@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'May 15, 2026 12:22:26',
    locked: false,
  },
};

const defaultAdminDetail: SystemAdminDetail = {
  id: '0000000000',
  username: 'unknown',
  displayName: 'Unknown',
  email: 'unknown@example.com',
  status: 'offline',
  defaultDomain: '-',
  createdAt: '-',
  locked: false,
};

const mockMFAMethods: MFAMethod[] = [
  {
    id: 'mfa-001',
    method: 'OTP',
    lastUsed: 'Sep 12, 2026',
    createdAt: 'Sep 12, 2026 15:43:35',
  },
];

const mockAccessKeys: AccessKey[] = [
  {
    id: 'ak-001',
    keyId: 'AKIA112AK3IALQI2',
    description: '-',
    status: 'active',
    lastUsed: 'Sep 12, 2026 15:43:35 (UTC+9)',
    createdAt: 'Sep 12, 2026 15:43:35 (UTC+9)',
  },
];

const mockSessions: Session[] = [
  {
    id: 'sess-001',
    started: 'Sep 12, 2026 14:31:34',
    lastAccess: 'Sep 12, 2026 15:22:10',
    ipAddress: '192.168.1.100',
    device: 'Chrome / Windows',
  },
  {
    id: 'sess-002',
    started: 'Sep 11, 2026 09:15:42',
    lastAccess: 'Sep 11, 2026 11:48:03',
    ipAddress: '192.168.1.101',
    device: 'Firefox / macOS',
  },
  {
    id: 'sess-003',
    started: 'Sep 10, 2026 18:05:17',
    lastAccess: 'Sep 10, 2026 20:33:51',
    ipAddress: '192.168.1.102',
    device: 'Safari / iOS',
  },
];

/* ----------------------------------------
   IAM System Admin Detail Page
   ---------------------------------------- */

export default function IAMSystemAdminDetailPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'security-credentials';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [sessionsSearchQuery, setSessionsSearchQuery] = useState('');
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);

  // Get admin data based on URL username
  const admin = username ? mockAdminsMap[username] || defaultAdminDetail : defaultAdminDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to username
  useEffect(() => {
    if (admin.username && admin.username !== 'unknown') {
      updateActiveTabLabel(admin.username);
    }
  }, [admin.username, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'System Administrators', href: '/iam/system-administrators' },
    { label: admin.username },
  ];

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter sessions by search query
  const filteredSessions = mockSessions.filter(
    (session) =>
      session.ipAddress.toLowerCase().includes(sessionsSearchQuery.toLowerCase()) ||
      session.device.toLowerCase().includes(sessionsSearchQuery.toLowerCase())
  );

  // Sessions pagination
  const itemsPerPage = 10;
  const sessionsTotalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (sessionsCurrentPage - 1) * itemsPerPage,
    sessionsCurrentPage * itemsPerPage
  );

  // Context menu items for MFA
  const mfaContextMenuItems: ContextMenuItem[] = [
    { id: 'edit', label: 'Edit' },
    { id: 'reset', label: 'Reset' },
    { id: 'delete', label: 'Delete', status: 'danger', divider: true },
  ];

  // Context menu items for access keys
  const accessKeyContextMenuItems: ContextMenuItem[] = [
    { id: 'deactivate', label: 'Deactivate' },
    { id: 'delete', label: 'Delete', status: 'danger', divider: true },
  ];

  // Table columns for access keys
  const accessKeyColumns: TableColumn<AccessKey>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value) => (
        <StatusIndicator
          layout="icon-only"
          status={value === 'active' ? 'active' : 'deactivated'}
        />
      ),
    },
    {
      key: 'keyId',
      label: 'Key ID',
      flex: 1,
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      sortable: true,
    },
    {
      key: 'lastUsed',
      label: 'Last used',
      flex: 1,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu
          items={accessKeyContextMenuItems}
          trigger="click"
          align="right"
          onSelect={(itemId) => console.log(itemId, row.id)}
        >
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Context menu items for sessions
  const sessionContextMenuItems: ContextMenuItem[] = [
    { id: 'terminate', label: 'Terminate', status: 'danger' },
  ];

  // Table columns for MFA
  const mfaColumns: TableColumn<MFAMethod>[] = [
    {
      key: 'method',
      label: 'MFA method',
      flex: 1,
      minWidth: columnMinWidths.mfa,
      sortable: true,
    },
    {
      key: 'lastUsed',
      label: 'Last used',
      flex: 1,
      minWidth: columnMinWidths.lastUsed,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu
          items={mfaContextMenuItems}
          trigger="click"
          align="right"
          onSelect={(itemId) => console.log(itemId, row.id)}
        >
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Table columns for sessions
  const sessionColumns: TableColumn<Session>[] = [
    {
      key: 'started',
      label: 'Started',
      flex: 1,
      minWidth: columnMinWidths.started,
      sortable: true,
    },
    {
      key: 'lastAccess',
      label: 'Last access',
      flex: 1,
      minWidth: columnMinWidths.lastAccess,
      sortable: true,
    },
    {
      key: 'ipAddress',
      label: 'IP address',
      flex: 1,
      minWidth: columnMinWidths.ipAddress,
      sortable: true,
    },
    {
      key: 'device',
      label: 'Device',
      flex: 1,
      minWidth: columnMinWidths.device,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu
          items={sessionContextMenuItems}
          trigger="click"
          align="right"
          onSelect={(itemId) => console.log(itemId, row.id)}
        >
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={() => addNewTab('/iam/home', 'Home')}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>{admin.username}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconReload size={12} />}>
              Reset password
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              status={admin.status === 'online' ? 'active' : 'shutoff'}
              value={admin.status === 'online' ? 'Online' : 'Offline'}
            />
            <DetailHeader.InfoCard label="ID" value={admin.id} copyable />
            <DetailHeader.InfoCard label="Display name" value={admin.displayName} />
            <DetailHeader.InfoCard label="Email address" value={admin.email} />
            <DetailHeader.InfoCard label="Created at" value={admin.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <Tabs
          value={activeDetailTab}
          onChange={setActiveDetailTab}
          variant="underline"
          size="sm"
          className="w-full"
        >
          <TabList>
            <Tab value="security-credentials">Security credentials</Tab>
            <Tab value="sessions">Sessions</Tab>
          </TabList>

          {/* Security Credentials Tab */}
          <TabPanel value="security-credentials" className="pt-0">
            <VStack gap={4} className="pt-4">
              {/* Password Section */}
              <SectionCard>
                <SectionCard.Header
                  title="Password"
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<IconReload size={12} />}>
                      Reset password
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Last updated at">
                    <span className="flex items-center gap-2">
                      Nov 11, 2026 14:22:43 (UTC+9)
                      <Badge theme="white" size="sm">
                        Updated by user
                      </Badge>
                    </span>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              {/* OTP MFA Section */}
              <SectionCard>
                <SectionCard.Header
                  title="OTP MFA"
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<IconCircleMinus size={12} />}>
                      Remove
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Last used" value="Sep 12, 2026 15:43:35 (UTC+9)" />
                  <SectionCard.DataRow label="Created at" value="Sep 12, 2026 15:43:35 (UTC+9)" />
                </SectionCard.Content>
              </SectionCard>

              {/* Access keys Section */}
              <SectionCard>
                <SectionCard.Header
                  title={`Access keys (${mockAccessKeys.length}/2)`}
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                      Create access key
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <Table columns={accessKeyColumns} data={mockAccessKeys} rowKey="id" />
                </SectionCard.Content>
              </SectionCard>

              {/* MFA Section */}
              <SectionCard>
                <SectionCard.Header title={`MFA (${mockMFAMethods.length})`} />
                <SectionCard.Content>
                  <Table columns={mfaColumns} data={mockMFAMethods} rowKey="id" />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          {/* Sessions Tab */}
          <TabPanel value="sessions" className="pt-0">
            <VStack gap={4} className="pt-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Sessions
                </h3>
              </div>
              {/* Action Bar */}
              <HStack gap={2} align="center">
                <SearchInput
                  placeholder="Search session by attributes"
                  value={sessionsSearchQuery}
                  onChange={(e) => setSessionsSearchQuery(e.target.value)}
                  className="w-[var(--search-input-width)]"
                />
                <div className="w-px h-4 bg-[var(--color-border-default)]" />
                <HStack gap={1} align="center">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconRefresh size={12} stroke={1.5} />}
                  >
                    Refresh
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconCircleX size={12} />}>
                    Terminate all sessions
                  </Button>
                </HStack>
              </HStack>

              {/* Pagination */}
              <Pagination
                currentPage={sessionsCurrentPage}
                totalPages={sessionsTotalPages || 1}
                onPageChange={setSessionsCurrentPage}
                totalItems={filteredSessions.length}
              />

              {/* Sessions Table */}
              <Table columns={sessionColumns} data={paginatedSessions} rowKey="id" />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}
