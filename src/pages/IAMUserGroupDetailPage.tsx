import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  HStack,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  StatusIndicator,
  ContextMenu,
  TabBar,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';
import { IconAction } from '@/design-system';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface UserGroupDetail {
  name: string;
  description: string;
  type: 'Built-in' | 'Custom';
  createdAt: string;
}

interface GroupUser {
  id: string;
  username: string;
  status: 'active' | 'error' | 'shutoff';
  userGroups: string;
  lastSignIn: string;
  createdAt: string;
}

interface GroupRole {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  policies: string;
  userGroupCount: number;
  userCount: number;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockUserGroupsMap: Record<string, UserGroupDetail> = {
  'dev-admin-group': {
    name: 'dev-admin-group',
    description: 'Development team administrators',
    type: 'Custom',
    createdAt: 'Sep 12, 2025',
  },
  'ops-team': {
    name: 'ops-team',
    description: 'Operations team',
    type: 'Custom',
    createdAt: 'Sep 10, 2025',
  },
  'qa-team': {
    name: 'qa-team',
    description: 'Quality assurance team',
    type: 'Custom',
    createdAt: 'Sep 8, 2025',
  },
  viewers: {
    name: 'viewers',
    description: '-',
    type: 'Built-in',
    createdAt: 'Sep 12, 2025',
  },
  administrators: {
    name: 'administrators',
    description: 'System administrators',
    type: 'Built-in',
    createdAt: 'Aug 1, 2025',
  },
  developers: {
    name: 'developers',
    description: 'Development team',
    type: 'Custom',
    createdAt: 'Aug 15, 2025',
  },
  'security-team': {
    name: 'security-team',
    description: 'Security operations',
    type: 'Custom',
    createdAt: 'Jul 20, 2025',
  },
  'support-team': {
    name: 'support-team',
    description: 'Customer support team',
    type: 'Custom',
    createdAt: 'Jul 10, 2025',
  },
  'data-analysts': {
    name: 'data-analysts',
    description: 'Data analysis team',
    type: 'Custom',
    createdAt: 'Jun 25, 2025',
  },
  'external-users': {
    name: 'external-users',
    description: 'External partners',
    type: 'Custom',
    createdAt: 'Jun 1, 2025',
  },
  MemberGroup: {
    name: 'MemberGroup',
    description: 'member group',
    type: 'Custom',
    createdAt: 'Jul 25, 2025',
  },
  'viewer-group': {
    name: 'viewer-group',
    description: 'Read-only access group',
    type: 'Custom',
    createdAt: 'Aug 10, 2025',
  },
  'network-admin-group': {
    name: 'network-admin-group',
    description: 'Network administrators group',
    type: 'Built-in',
    createdAt: 'Jun 15, 2025',
  },
};

const mockGroupUsers: GroupUser[] = [
  {
    id: 'u-001',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'u-002',
    username: 'alex.johnson',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 10, 2025',
    createdAt: 'Aug 15, 2025',
  },
  {
    id: 'u-003',
    username: 'sara.connor',
    status: 'active',
    userGroups: 'dev-admin-group (+1)',
    lastSignIn: 'Sep 11, 2025',
    createdAt: 'Aug 20, 2025',
  },
  {
    id: 'u-004',
    username: 'john.smith',
    status: 'shutoff',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 5, 2025',
    createdAt: 'Jul 1, 2025',
  },
  {
    id: 'u-005',
    username: 'emily.davis',
    status: 'active',
    userGroups: 'dev-admin-group (+3)',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Sep 1, 2025',
  },
  {
    id: 'u-006',
    username: 'michael.brown',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 8, 2025',
    createdAt: 'Aug 5, 2025',
  },
  {
    id: 'u-007',
    username: 'jessica.wilson',
    status: 'error',
    userGroups: 'dev-admin-group (+1)',
    lastSignIn: 'Aug 30, 2025',
    createdAt: 'Jul 15, 2025',
  },
  {
    id: 'u-008',
    username: 'david.lee',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 11, 2025',
    createdAt: 'Aug 25, 2025',
  },
  {
    id: 'u-009',
    username: 'amanda.taylor',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    lastSignIn: 'Sep 9, 2025',
    createdAt: 'Aug 10, 2025',
  },
  {
    id: 'u-010',
    username: 'chris.anderson',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 7, 2025',
    createdAt: 'Jul 20, 2025',
  },
  {
    id: 'u-011',
    username: 'laura.martinez',
    status: 'shutoff',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Aug 28, 2025',
    createdAt: 'Jun 30, 2025',
  },
  {
    id: 'u-012',
    username: 'ryan.thomas',
    status: 'active',
    userGroups: 'dev-admin-group (+1)',
    lastSignIn: 'Sep 10, 2025',
    createdAt: 'Aug 18, 2025',
  },
  {
    id: 'u-013',
    username: 'megan.jackson',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 6, 2025',
    createdAt: 'Jul 25, 2025',
  },
  {
    id: 'u-014',
    username: 'kevin.white',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    lastSignIn: 'Sep 11, 2025',
    createdAt: 'Aug 22, 2025',
  },
  {
    id: 'u-015',
    username: 'nicole.harris',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 8, 2025',
    createdAt: 'Aug 1, 2025',
  },
  {
    id: 'u-016',
    username: 'daniel.clark',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Sep 5, 2025',
  },
];

const mockGroupRoles: GroupRole[] = [
  {
    id: 'r-001',
    name: 'viewer',
    type: 'Built-in',
    policies: 'ReadCompute (+2)',
    userGroupCount: 13,
    userCount: 25,
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'r-002',
    name: 'compute-admin',
    type: 'Built-in',
    policies: 'ComputeFullAccess (+2)',
    userGroupCount: 8,
    userCount: 15,
    createdAt: 'Jan 15, 2025',
  },
  {
    id: 'r-003',
    name: 'storage-viewer',
    type: 'Built-in',
    policies: 'StorageReadOnly',
    userGroupCount: 5,
    userCount: 12,
    createdAt: 'Jan 20, 2025',
  },
  {
    id: 'r-004',
    name: 'network-admin',
    type: 'Built-in',
    policies: 'NetworkFullAccess (+1)',
    userGroupCount: 3,
    userCount: 8,
    createdAt: 'Feb 1, 2025',
  },
  {
    id: 'r-005',
    name: 'custom-dev-role',
    type: 'Custom',
    policies: 'DevPolicy',
    userGroupCount: 2,
    userCount: 10,
    createdAt: 'Jun 10, 2025',
  },
  {
    id: 'r-006',
    name: 'iam-readonly',
    type: 'Built-in',
    policies: 'IAMReadOnly',
    userGroupCount: 4,
    userCount: 7,
    createdAt: 'Mar 15, 2025',
  },
];

/* ----------------------------------------
   Info Card Component
   ---------------------------------------- */

interface InfoCardProps {
  label: string;
  value: string;
  rightElement?: React.ReactNode;
}

function InfoCard({ label, value, rightElement }: InfoCardProps) {
  return (
    <div className="basis-0 grow bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 flex items-center justify-between min-w-0">
      <div className="flex flex-col gap-1.5">
        <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md leading-4 text-[var(--color-text-default)]">{value}</span>
      </div>
      {rightElement}
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function IAMUserGroupDetailPage() {
  const { groupName } = useParams<{ groupName: string }>();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [rolesSearchQuery, setRolesSearchQuery] = useState('');
  const [rolesCurrentPage, setRolesCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Get user group details
  const userGroup = groupName ? mockUserGroupsMap[groupName] : null;

  // Update browser tab when group is loaded
  useEffect(() => {
    if (userGroup?.name) {
      updateActiveTabLabel(userGroup.name);
    }
  }, [userGroup?.name, updateActiveTabLabel]);

  // Filter users by search query
  const filteredUsers = mockGroupUsers.filter((user) =>
    user.username.toLowerCase().includes(usersSearchQuery.toLowerCase())
  );

  // Users pagination
  const usersTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (usersCurrentPage - 1) * itemsPerPage,
    usersCurrentPage * itemsPerPage
  );

  // Filter roles by search query
  const filteredRoles = mockGroupRoles.filter((role) =>
    role.name.toLowerCase().includes(rolesSearchQuery.toLowerCase())
  );

  // Roles pagination
  const rolesTotalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (rolesCurrentPage - 1) * itemsPerPage,
    rolesCurrentPage * itemsPerPage
  );

  // Context menu items factory
  const getUserContextMenuItems = (rowId: string, isInactive: boolean): ContextMenuItem[] => [
    {
      id: 'remove',
      label: 'Remove',
      status: isInactive ? undefined : 'danger',
      disabled: isInactive,
      onClick: () => console.log('Remove', rowId),
    },
  ];

  const getRoleContextMenuItems = (rowId: string, isBuiltIn: boolean): ContextMenuItem[] => [
    {
      id: 'detach',
      label: 'Detach',
      status: isBuiltIn ? undefined : 'danger',
      disabled: isBuiltIn,
      onClick: () => console.log('Detach', rowId),
    },
  ];

  // Table columns for users
  const userColumns: TableColumn<GroupUser>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value) => <StatusIndicator status={value as 'active' | 'error' | 'shutoff'} />,
    },
    {
      key: 'username',
      label: 'Username',
      flex: 1,
      minWidth: columnMinWidths.username,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/users/${value}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'userGroups',
      label: 'User groups',
      flex: 1,
      minWidth: columnMinWidths.userGroups,
    },
    {
      key: 'lastSignIn',
      label: 'Last sign-in',
      flex: 1,
      minWidth: columnMinWidths.lastSignIn,
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
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu
          items={getUserContextMenuItems(row.id, row.status !== 'active')}
          trigger="click"
        >
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
  const roleColumns: TableColumn<GroupRole>[] = [
    {
      key: 'name',
      label: 'Name',
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
      key: 'userGroupCount',
      label: 'User group count',
      flex: 1,
      minWidth: columnMinWidths.userCount,
      sortable: true,
    },
    {
      key: 'policies',
      label: 'Policies',
      flex: 1,
      minWidth: columnMinWidths.policies,
      render: (row) => row.policies,
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
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu
          items={getRoleContextMenuItems(row.id, row.type === 'Built-in')}
          trigger="click"
        >
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

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'IAM', href: '/iam' },
    { label: 'User groups', href: '/iam/user-groups' },
    { label: userGroup?.name || groupName || '' },
  ];

  if (!userGroup) {
    return (
      <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
        <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main
          className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
          style={{ left: `${sidebarWidth}px` }}
        >
          <TabBar
            tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
          />
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            showNavigation
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
          />
          <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
            <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
              <VStack gap={3}>
                <h1 className="text-heading-h3 text-[var(--color-text-default)]">
                  User group not found
                </h1>
                <p className="text-[var(--color-text-muted)]">
                  The user group "{groupName}" does not exist.
                </p>
                <Button variant="secondary" onClick={() => navigate('/iam/user-groups')}>
                  Back to User groups
                </Button>
              </VStack>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={8}>
              {/* Header Card */}
              <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
                <VStack gap={3}>
                  {/* Title */}
                  <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    {userGroup.name}
                  </h1>

                  {/* Action Buttons */}
                  <HStack gap={1}>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} stroke={1.5} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconTrash size={12} stroke={1.5} />}
                    >
                      Delete
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
                    <InfoCard label="Description" value={userGroup.description} />
                    <InfoCard label="Type" value={userGroup.type} />
                    <InfoCard label="Created at" value={userGroup.createdAt} />
                  </HStack>
                </VStack>
              </div>

              {/* Tabs Section */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="users">Users</Tab>
                    <Tab value="roles">Roles</Tab>
                  </TabList>

                  {/* Users Tab */}
                  <TabPanel value="users" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Section Header */}
                      <HStack justify="between" align="center" className="w-full">
                        <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                          Users
                        </h2>
                        <Button variant="secondary" size="sm">
                          Manage users
                        </Button>
                      </HStack>

                      {/* Search */}
                      <SearchInput
                        placeholder="Search users by attributes"
                        value={usersSearchQuery}
                        onChange={setUsersSearchQuery}
                        className="w-[var(--search-input-width)]"
                      />

                      {/* Pagination */}
                      <Pagination
                        currentPage={usersCurrentPage}
                        totalPages={usersTotalPages}
                        totalItems={filteredUsers.length}
                        onPageChange={setUsersCurrentPage}
                      />

                      {/* Table */}
                      <Table<GroupUser> columns={userColumns} data={paginatedUsers} rowKey="id" />
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
                        <Button variant="secondary" size="sm">
                          Manage roles
                        </Button>
                      </HStack>

                      {/* Action Bar */}
                      <HStack gap={2} align="center">
                        {/* Search */}
                        <HStack gap={1} align="center">
                          <SearchInput
                            placeholder="Search roles by attributes"
                            value={rolesSearchQuery}
                            onChange={(e) => setRolesSearchQuery(e.target.value)}
                            className="w-[var(--search-input-width)]"
                          />
                        </HStack>

                        {/* Divider */}
                        <HStack align="center">
                          <div className="w-px h-4 bg-[var(--color-border-subtle)]" />
                        </HStack>

                        {/* Actions */}
                        <Button variant="secondary" size="sm" disabled>
                          Detach
                        </Button>
                      </HStack>

                      {/* Pagination */}
                      <Pagination
                        currentPage={rolesCurrentPage}
                        totalPages={rolesTotalPages}
                        totalItems={filteredRoles.length}
                        onPageChange={setRolesCurrentPage}
                      />

                      {/* Table */}
                      <Table<GroupRole> columns={roleColumns} data={paginatedRoles} rowKey="id" />
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
