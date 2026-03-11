import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  HStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  StatusIndicator,
  ContextMenu,
  SectionCard,
  PageShell,
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
  IconChevronDown,
  IconBell,
  IconRefresh,
  IconSettings,
  IconReload,
  IconLock,
  IconCircleX,
  IconCircleMinus,
} from '@tabler/icons-react';
import { IconAction } from '@/design-system';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface UserDetail {
  username: string;
  displayName: string;
  email: string;
  status: 'online' | 'offline';
  locked?: boolean;
  createdAt: string;
}

interface UserGroup {
  id: string;
  name: string;
  users: number;
  attachedRoles: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  source: 'Direct' | 'Group';
  type: 'Built-in' | 'Custom';
  policies: string;
  createdAt: string;
}

interface AccessKey {
  id: string;
  keyId: string;
  description: string;
  lastUsed: string;
  createdAt: string;
  status: 'active' | 'inactive';
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

const mockUsersMap: Record<string, UserDetail> = {
  'thaki-kim': {
    username: 'thaki-kim',
    displayName: 'thaki.kim',
    email: 'thaki.kim@example.com',
    status: 'online',
    locked: false,
    createdAt: 'Jul 25, 2025',
  },
  'alex.johnson': {
    username: 'alex.johnson',
    displayName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    status: 'online',
    locked: true, // This user is locked
    createdAt: 'Aug 15, 2025',
  },
  'sara.connor': {
    username: 'sara.connor',
    displayName: 'Sara Connor',
    email: 'sara.connor@example.com',
    status: 'offline',
    createdAt: 'Jul 20, 2025',
  },
  'john.doe': {
    username: 'john.doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    status: 'offline',
    createdAt: 'Jun 10, 2025',
  },
  'jane.smith': {
    username: 'jane.smith',
    displayName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'online',
    createdAt: 'Jan 5, 2025',
  },
  'mike.wilson': {
    username: 'mike.wilson',
    displayName: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    status: 'offline',
    createdAt: 'Apr 18, 2025',
  },
  'emily.chen': {
    username: 'emily.chen',
    displayName: 'Emily Chen',
    email: 'emily.chen@example.com',
    status: 'online',
    createdAt: 'Mar 22, 2025',
  },
  'david.lee': {
    username: 'david.lee',
    displayName: 'David Lee',
    email: 'david.lee@example.com',
    status: 'online',
    createdAt: 'Feb 14, 2025',
  },
  'lisa.park': {
    username: 'lisa.park',
    displayName: 'Lisa Park',
    email: 'lisa.park@example.com',
    status: 'offline',
    createdAt: 'May 30, 2025',
  },
  'chris.taylor': {
    username: 'chris.taylor',
    displayName: 'Chris Taylor',
    email: 'chris.taylor@example.com',
    status: 'online',
    createdAt: 'Jan 28, 2025',
  },
};

const defaultUserDetail: UserDetail = {
  username: 'Unknown User',
  displayName: '-',
  email: '-',
  status: 'offline',
  createdAt: '-',
};

const mockUserGroups: UserGroup[] = [
  {
    id: 'ug-001',
    name: 'dev-admin-group',
    users: 100,
    attachedRoles: 'admin (+3)',
    description: 'the development team',
  },
  {
    id: 'ug-002',
    name: 'ops-team',
    users: 25,
    attachedRoles: 'network-admin (+1)',
    description: 'Operations team',
  },
  {
    id: 'ug-003',
    name: 'qa-team',
    users: 15,
    attachedRoles: 'qa-lead (+2)',
    description: 'Quality assurance team',
  },
];

const mockAccessKeys: AccessKey[] = [
  {
    id: 'ak-001',
    keyId: 'AKIA112AK3IALQI2',
    description: '-',
    lastUsed: 'Sep 12, 2025',
    createdAt: 'Sep 12, 2025',
    status: 'active',
  },
];

const mockSessions: Session[] = [
  {
    id: 's-001',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '10.2.40.25',
    device: 'Chrome/Mac OS',
  },
  {
    id: 's-002',
    started: 'Nov 3, 2025',
    lastAccess: 'Nov 3, 2025',
    ipAddress: '192.168.1.100',
    device: 'Firefox/Windows',
  },
  {
    id: 's-003',
    started: 'Nov 2, 2025',
    lastAccess: 'Nov 2, 2025',
    ipAddress: '10.2.40.30',
    device: 'Safari/iOS',
  },
  {
    id: 's-004',
    started: 'Nov 1, 2025',
    lastAccess: 'Nov 1, 2025',
    ipAddress: '172.16.0.50',
    device: 'Edge/Windows',
  },
  {
    id: 's-005',
    started: 'Oct 31, 2025',
    lastAccess: 'Oct 31, 2025',
    ipAddress: '10.2.40.45',
    device: 'Chrome/Linux',
  },
  {
    id: 's-006',
    started: 'Oct 30, 2025',
    lastAccess: 'Oct 30, 2025',
    ipAddress: '192.168.2.75',
    device: 'Firefox/Mac OS',
  },
  {
    id: 's-007',
    started: 'Oct 29, 2025',
    lastAccess: 'Oct 29, 2025',
    ipAddress: '10.2.40.60',
    device: 'Safari/Mac OS',
  },
  {
    id: 's-008',
    started: 'Oct 28, 2025',
    lastAccess: 'Oct 28, 2025',
    ipAddress: '172.16.0.80',
    device: 'Chrome/Android',
  },
  {
    id: 's-009',
    started: 'Oct 27, 2025',
    lastAccess: 'Oct 27, 2025',
    ipAddress: '10.2.40.70',
    device: 'Firefox/Linux',
  },
  {
    id: 's-010',
    started: 'Oct 26, 2025',
    lastAccess: 'Oct 26, 2025',
    ipAddress: '192.168.3.90',
    device: 'Edge/Mac OS',
  },
  {
    id: 's-011',
    started: 'Oct 25, 2025',
    lastAccess: 'Oct 25, 2025',
    ipAddress: '10.2.40.85',
    device: 'Chrome/Windows',
  },
  {
    id: 's-012',
    started: 'Oct 24, 2025',
    lastAccess: 'Oct 24, 2025',
    ipAddress: '172.16.0.100',
    device: 'Safari/iOS',
  },
  {
    id: 's-013',
    started: 'Oct 23, 2025',
    lastAccess: 'Oct 23, 2025',
    ipAddress: '10.2.40.95',
    device: 'Firefox/Windows',
  },
  {
    id: 's-014',
    started: 'Oct 22, 2025',
    lastAccess: 'Oct 22, 2025',
    ipAddress: '192.168.4.110',
    device: 'Chrome/Linux',
  },
  {
    id: 's-015',
    started: 'Oct 21, 2025',
    lastAccess: 'Oct 21, 2025',
    ipAddress: '10.2.40.105',
    device: 'Edge/Windows',
  },
  {
    id: 's-016',
    started: 'Oct 20, 2025',
    lastAccess: 'Oct 20, 2025',
    ipAddress: '172.16.0.120',
    device: 'Safari/Mac OS',
  },
];

const mockRoles: Role[] = [
  {
    id: 'r-001',
    name: 'viewer',
    source: 'Direct',
    type: 'Built-in',
    policies: 'ReadCompute (+2)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'r-002',
    name: 'compute-admin',
    source: 'Group',
    type: 'Built-in',
    policies: 'ComputeFullAccess (+5)',
    createdAt: 'Aug 20, 2025',
  },
  {
    id: 'r-003',
    name: 'storage-viewer',
    source: 'Direct',
    type: 'Custom',
    policies: 'StorageReadOnly',
    createdAt: 'Jul 15, 2025',
  },
  {
    id: 'r-004',
    name: 'network-admin',
    source: 'Group',
    type: 'Built-in',
    policies: 'NetworkFullAccess (+3)',
    createdAt: 'Jun 10, 2025',
  },
  {
    id: 'r-005',
    name: 'iam-reader',
    source: 'Direct',
    type: 'Built-in',
    policies: 'IAMReadOnly (+1)',
    createdAt: 'May 5, 2025',
  },
  {
    id: 'r-006',
    name: 'security-auditor',
    source: 'Direct',
    type: 'Custom',
    policies: 'SecurityAudit (+2)',
    createdAt: 'Apr 1, 2025',
  },
  {
    id: 'r-007',
    name: 'billing-viewer',
    source: 'Group',
    type: 'Built-in',
    policies: 'BillingReadOnly',
    createdAt: 'Mar 15, 2025',
  },
  {
    id: 'r-008',
    name: 'developer',
    source: 'Direct',
    type: 'Custom',
    policies: 'DevAccess (+4)',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'r-009',
    name: 'operator',
    source: 'Group',
    type: 'Built-in',
    policies: 'OperatorAccess (+2)',
    createdAt: 'Jan 10, 2025',
  },
  {
    id: 'r-010',
    name: 'support',
    source: 'Direct',
    type: 'Custom',
    policies: 'SupportAccess (+1)',
    createdAt: 'Dec 5, 2024',
  },
  {
    id: 'r-011',
    name: 'data-analyst',
    source: 'Direct',
    type: 'Built-in',
    policies: 'DataReadOnly (+3)',
    createdAt: 'Nov 20, 2024',
  },
  {
    id: 'r-012',
    name: 'db-admin',
    source: 'Group',
    type: 'Custom',
    policies: 'DatabaseAdmin (+4)',
    createdAt: 'Oct 15, 2024',
  },
  {
    id: 'r-013',
    name: 'container-admin',
    source: 'Direct',
    type: 'Built-in',
    policies: 'ContainerFullAccess',
    createdAt: 'Sep 10, 2024',
  },
  {
    id: 'r-014',
    name: 'monitoring-viewer',
    source: 'Group',
    type: 'Built-in',
    policies: 'MonitoringRead (+2)',
    createdAt: 'Aug 5, 2024',
  },
  {
    id: 'r-015',
    name: 'log-analyst',
    source: 'Direct',
    type: 'Custom',
    policies: 'LogReadOnly (+1)',
    createdAt: 'Jul 1, 2024',
  },
  {
    id: 'r-016',
    name: 'backup-operator',
    source: 'Group',
    type: 'Built-in',
    policies: 'BackupAccess (+2)',
    createdAt: 'Jun 15, 2024',
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
   IAM User Detail Page
   ---------------------------------------- */

export function IAMUserDetailPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'user-groups';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesSearchQuery, setRolesSearchQuery] = useState('');
  const [rolesCurrentPage, setRolesCurrentPage] = useState(1);
  const [sessionsSearchQuery, setSessionsSearchQuery] = useState('');
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);

  // Get user data based on URL username
  const user = username ? mockUsersMap[username] || defaultUserDetail : defaultUserDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to username
  useEffect(() => {
    if (user.username) {
      updateActiveTabLabel(user.username);
    }
  }, [user.username, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'IAM', href: '/iam' },
    { label: 'Users', href: '/iam/users' },
    { label: user.username },
  ];

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter user groups by search query
  const filteredGroups = mockUserGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // User groups pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter roles by search query
  const filteredRoles = mockRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(rolesSearchQuery.toLowerCase()) ||
      role.source.toLowerCase().includes(rolesSearchQuery.toLowerCase()) ||
      role.policies.toLowerCase().includes(rolesSearchQuery.toLowerCase())
  );

  // Roles pagination
  const rolesTotalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (rolesCurrentPage - 1) * itemsPerPage,
    rolesCurrentPage * itemsPerPage
  );

  // Filter sessions by search query
  const filteredSessions = mockSessions.filter(
    (session) =>
      session.ipAddress.toLowerCase().includes(sessionsSearchQuery.toLowerCase()) ||
      session.device.toLowerCase().includes(sessionsSearchQuery.toLowerCase())
  );

  // Sessions pagination
  const sessionsTotalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (sessionsCurrentPage - 1) * itemsPerPage,
    sessionsCurrentPage * itemsPerPage
  );

  // Check if user account is locked
  const isUserLocked = user.locked === true;

  // Context menu items factory functions (to include row-specific onClick handlers)
  const getGroupContextMenuItems = (rowId: string): ContextMenuItem[] => [
    {
      id: 'detach',
      label: 'Detach',
      status: isUserLocked ? undefined : 'danger',
      disabled: isUserLocked,
      onClick: () => console.log('Detach group', rowId),
    },
  ];

  const getRoleContextMenuItems = (rowId: string): ContextMenuItem[] => [
    {
      id: 'detach',
      label: 'Detach',
      status: isUserLocked ? undefined : 'danger',
      disabled: isUserLocked,
      onClick: () => console.log('Detach role', rowId),
    },
  ];

  const getAccessKeyContextMenuItems = (rowId: string): ContextMenuItem[] => [
    { id: 'deactivate', label: 'Deactivate', onClick: () => console.log('Deactivate', rowId) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
      onClick: () => console.log('Delete', rowId),
    },
  ];

  const getSessionContextMenuItems = (rowId: string): ContextMenuItem[] => [
    {
      id: 'terminate',
      label: 'Terminate',
      status: 'danger',
      onClick: () => console.log('Terminate', rowId),
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
      label: 'IP Address',
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
        <ContextMenu items={getSessionContextMenuItems(row.id)} trigger="click" align="right">
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Table columns for access keys
  const accessKeyColumns: TableColumn<AccessKey>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value) => (
        <StatusIndicator layout="icon-only" status={value === 'active' ? 'active' : 'shutoff'} />
      ),
    },
    {
      key: 'keyId',
      label: 'Key ID',
      flex: 1,
      minWidth: columnMinWidths.keyId,
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
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
        <ContextMenu items={getAccessKeyContextMenuItems(row.id)} trigger="click" align="right">
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Table columns for roles
  const roleColumns: TableColumn<Role>[] = [
    {
      key: 'name',
      label: 'Role name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/roles/${value}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      flex: 1,
      minWidth: columnMinWidths.source,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.typeLg,
    },
    {
      key: 'policies',
      label: 'Policies',
      flex: 1,
      minWidth: columnMinWidths.policies,
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
        <ContextMenu items={getRoleContextMenuItems(row.id)} trigger="click" align="right">
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Table columns for user groups
  const groupColumns: TableColumn<UserGroup>[] = [
    {
      key: 'name',
      label: 'User group name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/user-groups/${value}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'users',
      label: 'User',
      flex: 1,
      minWidth: columnMinWidths.user,
      sortable: true,
    },
    {
      key: 'attachedRoles',
      label: 'Attached roles',
      flex: 1,
      minWidth: columnMinWidths.roles,
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu items={getGroupContextMenuItems(row.id)} trigger="click" align="right">
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
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
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* User Header Card */}
        <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 pt-3 pb-4">
          {/* Username */}
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)] mb-3">
            {user.username}
          </h1>

          {/* Action Buttons */}
          <HStack gap={1} className="mb-3">
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} stroke={1.5} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
              Delete
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconLock size={12} />}>
              Lock setting
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconReload size={12} />}>
              Reset password
            </Button>
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<IconChevronDown size={12} stroke={1.5} />}
            >
              More Actions
            </Button>
          </HStack>

          {/* Info Cards */}
          <HStack gap={2} className="w-full">
            <InfoCard
              label="Status"
              value={user.status === 'online' ? 'Online' : 'Offline'}
              statusIndicator={
                <StatusIndicator
                  layout="icon-only"
                  status={user.status === 'online' ? 'active' : 'shutoff'}
                />
              }
            />
            <InfoCard label="Display name" value={user.displayName} />
            <InfoCard label="Email address" value={user.email} />
            <InfoCard label="Created at" value={user.createdAt} />
          </HStack>
        </div>

        {/* Tabs Section */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="user-groups">User groups</Tab>
              <Tab value="roles">Roles</Tab>
              <Tab value="security-credentials">Security credentials</Tab>
              <Tab value="sessions">Sessions</Tab>
            </TabList>

            {/* User groups Tab */}
            <TabPanel value="user-groups" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <HStack justify="between" align="center" className="w-full">
                  <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    User groups
                  </h2>
                  <Button variant="secondary" size="sm" leftIcon={<IconSettings size={12} />}>
                    Manage user groups
                  </Button>
                </HStack>

                {/* Search */}
                <SearchInput
                  placeholder="Search groups by attributes"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredGroups.length}
                  onPageChange={setCurrentPage}
                />

                {/* Table */}
                <Table<UserGroup> columns={groupColumns} data={paginatedGroups} rowKey="id" />
              </VStack>
            </TabPanel>

            {/* Roles Tab */}
            <TabPanel value="roles" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <HStack justify="between" align="center" className="w-full">
                  <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Roles
                  </h2>
                  <Button variant="secondary" size="sm" leftIcon={<IconSettings size={12} />}>
                    Manage roles
                  </Button>
                </HStack>

                {/* Search */}
                <SearchInput
                  placeholder="Search roles by attributes"
                  value={rolesSearchQuery}
                  onChange={setRolesSearchQuery}
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={rolesCurrentPage}
                  totalPages={rolesTotalPages}
                  totalItems={filteredRoles.length}
                  onPageChange={setRolesCurrentPage}
                />

                {/* Table */}
                <Table<Role> columns={roleColumns} data={paginatedRoles} rowKey="id" />
              </VStack>
            </TabPanel>

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
                    <SectionCard.DataRow
                      label="Last updated at"
                      value="2025.11.11 14:22:43 (Updated by user)"
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* OTP MFA Section */}
                <SectionCard>
                  <SectionCard.Header
                    title="OTP MFA"
                    actions={
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconCircleMinus size={12} />}
                      >
                        Remove
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Last used" value="2025.11.11 14:22:43" />
                    <SectionCard.DataRow label="Created at" value="2025.11.11 14:22:43" />
                  </SectionCard.Content>
                </SectionCard>

                {/* Access Keys Section - Disabled */}
                <SectionCard className="opacity-50 pointer-events-none">
                  <SectionCard.Header
                    title={`Access keys (${mockAccessKeys.length})`}
                    actions={
                      <Button variant="secondary" size="sm" disabled>
                        Create access key
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <Table<AccessKey>
                      columns={accessKeyColumns}
                      data={mockAccessKeys}
                      rowKey="id"
                    />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Sessions Tab */}
            <TabPanel value="sessions" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Sessions
                </h2>

                {/* Action Bar */}
                <HStack gap={2} align="center">
                  <SearchInput
                    placeholder="Search session by attributes"
                    value={sessionsSearchQuery}
                    onChange={setSessionsSearchQuery}
                    className="w-[var(--search-input-width)]"
                  />
                  <div className="w-px h-4 bg-[var(--color-border-default)]" />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconRefresh size={12} stroke={1.5} />}
                    aria-label="Refresh"
                  />
                  <Button variant="secondary" size="sm" leftIcon={<IconCircleX size={12} />}>
                    Terminate all sessions
                  </Button>
                </HStack>

                {/* Pagination */}
                <Pagination
                  currentPage={sessionsCurrentPage}
                  totalPages={sessionsTotalPages}
                  totalItems={filteredSessions.length}
                  onPageChange={setSessionsCurrentPage}
                />

                {/* Table */}
                <Table<Session> columns={sessionColumns} data={paginatedSessions} rowKey="id" />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default IAMUserDetailPage;
