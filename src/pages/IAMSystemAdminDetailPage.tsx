import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
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
  StatusIndicator,
  ContextMenu,
  SectionCard,
  SearchInput,
  Pagination,
  PageShell,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconTrash, IconChevronDown, IconRefresh } from '@tabler/icons-react';
import { IconAction } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface SystemAdminDetail {
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
    username: 'thaki-kim',
    displayName: 'thaki.kim',
    email: 'thaki.kim@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'Jul 25, 2025',
    locked: false,
  },
  'alex-jones': {
    username: 'alex-jones',
    displayName: 'alex.jones',
    email: 'alex.jones@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'Aug 15, 2025',
    locked: false,
  },
  'sarah-lee': {
    username: 'sarah-lee',
    displayName: 'sarah.lee',
    email: 'sarah.lee@example.com',
    status: 'online',
    defaultDomain: 'domain B',
    createdAt: 'Jul 20, 2025',
    locked: false,
  },
  'john-doe': {
    username: 'john-doe',
    displayName: 'john.doe',
    email: 'john.doe@example.com',
    status: 'offline',
    defaultDomain: 'domain A',
    createdAt: 'Jun 10, 2025',
    locked: true,
  },
  'jane-smith': {
    username: 'jane-smith',
    displayName: 'jane.smith',
    email: 'jane.smith@example.com',
    status: 'online',
    defaultDomain: 'domain C',
    createdAt: 'Sep 1, 2025',
    locked: false,
  },
  'mike-wilson': {
    username: 'mike-wilson',
    displayName: 'mike.wilson',
    email: 'mike.wilson@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'Aug 25, 2025',
    locked: false,
  },
  'emily-davis': {
    username: 'emily-davis',
    displayName: 'emily.davis',
    email: 'emily.davis@example.com',
    status: 'offline',
    defaultDomain: 'domain B',
    createdAt: 'Sep 10, 2025',
    locked: false,
  },
  'chris-martin': {
    username: 'chris-martin',
    displayName: 'chris.martin',
    email: 'chris.martin@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'Jul 5, 2025',
    locked: true,
  },
  'lisa-anderson': {
    username: 'lisa-anderson',
    displayName: 'lisa.anderson',
    email: 'lisa.anderson@example.com',
    status: 'online',
    defaultDomain: 'domain C',
    createdAt: 'Jun 1, 2025',
    locked: false,
  },
  'david-brown': {
    username: 'david-brown',
    displayName: 'david.brown',
    email: 'david.brown@example.com',
    status: 'online',
    defaultDomain: 'domain A',
    createdAt: 'May 15, 2025',
    locked: false,
  },
};

const defaultAdminDetail: SystemAdminDetail = {
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
    lastUsed: 'Sep 12, 2025',
    createdAt: 'Sep 12, 2025',
  },
];

const mockSessions: Session[] = [
  {
    id: 'sess-001',
    started: 'Sep 12, 2025',
    lastAccess: 'Sep 12, 2025',
    ipAddress: '192.168.1.100',
    device: 'Chrome / Windows',
  },
  {
    id: 'sess-002',
    started: 'Sep 11, 2025',
    lastAccess: 'Sep 11, 2025',
    ipAddress: '192.168.1.101',
    device: 'Firefox / macOS',
  },
  {
    id: 'sess-003',
    started: 'Sep 10, 2025',
    lastAccess: 'Sep 10, 2025',
    ipAddress: '192.168.1.102',
    device: 'Safari / iOS',
  },
];

/* ----------------------------------------
   Info Card Component
   ---------------------------------------- */

interface InfoCardProps {
  label: string;
  value: React.ReactNode;
  statusIndicator?: React.ReactNode;
}

function InfoCard({ label, value, statusIndicator }: InfoCardProps) {
  return (
    <div className="basis-0 grow bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 flex items-center justify-between min-w-0">
      <div className="flex flex-col gap-1.5">
        <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md leading-4 text-[var(--color-text-default)]">{value}</span>
      </div>
      {statusIndicator}
    </div>
  );
}

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
    { label: 'IAM', href: '/iam' },
    { label: 'System administrators', href: '/iam/system-administrators' },
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
    { id: 'remove', label: 'Remove MFA', danger: true },
  ];

  // Context menu items for sessions
  const sessionContextMenuItems: ContextMenuItem[] = [
    { id: 'terminate', label: 'Terminate session', danger: true },
  ];

  // More Actions menu items
  const moreActionsItems: ContextMenuItem[] = [
    { id: 'reset-password', label: 'Reset password' },
    { id: 'reset-mfa', label: 'Reset MFA' },
    { type: 'divider' },
    { id: 'view-activity', label: 'View activity logs' },
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
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu items={mfaContextMenuItems} onSelect={(itemId) => console.log(itemId, row.id)}>
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
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
      render: (_value, row) => (
        <ContextMenu
          items={sessionContextMenuItems}
          onSelect={(itemId) => console.log(itemId, row.id)}
        >
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
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
        {/* Header Card */}
        <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 pt-3 pb-4">
          <VStack gap={3}>
            {/* Title */}
            <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
              {admin.username}
            </h1>

            {/* Action Buttons */}
            <HStack gap={1}>
              <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                Delete
              </Button>
              <Button variant="secondary" size="sm">
                Lock setting
              </Button>
              <ContextMenu items={moreActionsItems} onSelect={(itemId) => console.log(itemId)}>
                <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                  More Actions
                </Button>
              </ContextMenu>
            </HStack>

            {/* Info Cards */}
            <HStack gap={2} className="w-full">
              <InfoCard
                label="Status"
                value={admin.status === 'online' ? 'Online' : 'Offline'}
                statusIndicator={
                  <StatusIndicator status={admin.status === 'online' ? 'active' : 'shutoff'} />
                }
              />
              <InfoCard label="Display name" value={admin.displayName} />
              <InfoCard label="Email address" value={admin.email} />
              <InfoCard label="Default domain" value={admin.defaultDomain} />
              <InfoCard label="Created at" value={admin.createdAt} />
            </HStack>
          </VStack>
        </div>

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
                    <Button variant="secondary" size="sm">
                      Reset password
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Last updated at"
                    value="2025.11.11 14:22:43 (Updated by user)"
                  />
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
                <HStack gap={1} align="center">
                  <SearchInput
                    placeholder="Search session by attributes"
                    value={sessionsSearchQuery}
                    onChange={(e) => setSessionsSearchQuery(e.target.value)}
                    className="w-[var(--search-input-width)]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconRefresh size={12} stroke={1.5} />}
                    aria-label="Refresh"
                  />
                </HStack>
                <div className="w-px h-4 bg-[var(--color-border-default)]" />
                <Button variant="secondary" size="sm">
                  Terminate all sessions
                </Button>
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
