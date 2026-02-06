import { useState, useEffect } from 'react';
import {
  Button,
  SearchInput,
  Table,
  StatusIndicator,
  Pagination,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  ContextMenu,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type StatusType,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ManageUserGroupsDrawer } from '@/components/ManageUserGroupsDrawer';
import { ManageRolesDrawer } from '@/components/ManageRolesDrawer';
import { EditUserDrawer } from '@/components/EditUserDrawer';
import { IconDownload, IconTrash } from '@tabler/icons-react';
import { IconAction } from '@/design-system';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type UserStatus = 'active' | 'disabled' | 'locked';

interface User {
  id: string;
  username: string;
  status: UserStatus;
  userGroups: string;
  roles: string;
  lastSignIn: string;
  mfa: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-002',
    username: 'alex.johnson',
    status: 'active',
    userGroups: 'dev-team',
    roles: 'viewer',
    lastSignIn: 'Sep 11, 2025',
    mfa: 'OTP',
    createdAt: 'Aug 15, 2025',
  },
  {
    id: 'user-003',
    username: 'sara.connor',
    status: 'active',
    userGroups: 'ops-team (+1)',
    roles: 'network-admin (+1)',
    lastSignIn: 'Sep 10, 2025',
    mfa: 'Email',
    createdAt: 'Jul 20, 2025',
  },
  {
    id: 'user-004',
    username: 'john.doe',
    status: 'disabled',
    userGroups: 'guest',
    roles: 'viewer',
    lastSignIn: 'Aug 1, 2025',
    mfa: '-',
    createdAt: 'Jun 10, 2025',
  },
  {
    id: 'user-005',
    username: 'jane.smith',
    status: 'active',
    userGroups: 'admin-group',
    roles: 'super-admin',
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Jan 5, 2025',
  },
  {
    id: 'user-006',
    username: 'mike.wilson',
    status: 'locked',
    userGroups: 'dev-team',
    roles: 'developer',
    lastSignIn: 'Sep 5, 2025',
    mfa: 'OTP',
    createdAt: 'Apr 18, 2025',
  },
  {
    id: 'user-007',
    username: 'emily.chen',
    status: 'active',
    userGroups: 'qa-team (+2)',
    roles: 'qa-lead (+2)',
    lastSignIn: 'Sep 11, 2025',
    mfa: 'Email',
    createdAt: 'Mar 22, 2025',
  },
  {
    id: 'user-008',
    username: 'david.lee',
    status: 'active',
    userGroups: 'ops-team',
    roles: 'storage-admin',
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Feb 14, 2025',
  },
  {
    id: 'user-009',
    username: 'lisa.park',
    status: 'disabled',
    userGroups: 'external',
    roles: 'viewer',
    lastSignIn: 'Jul 15, 2025',
    mfa: '-',
    createdAt: 'May 30, 2025',
  },
  {
    id: 'user-010',
    username: 'chris.taylor',
    status: 'active',
    userGroups: 'dev-admin-group',
    roles: 'iam-admin (+1)',
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP',
    createdAt: 'Jan 28, 2025',
  },
];

/* ----------------------------------------
   Status Config - Map to StatusIndicator types
   ---------------------------------------- */

const statusMap: Record<UserStatus, StatusType> = {
  active: 'active',
  disabled: 'shutoff',
  locked: 'error',
};

/* ----------------------------------------
   IAM Users Page
   ---------------------------------------- */

export function IAMUsersPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Users');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter users by search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userGroups.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selection state
  const hasSelection = selectedRows.length > 0;

  // Drawer states
  const [manageUserGroupsOpen, setManageUserGroupsOpen] = useState(false);
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<User | null>(null);

  // Drawer handlers
  const handleManageUserGroups = (user: User) => {
    setSelectedUserForDrawer(user);
    setManageUserGroupsOpen(true);
  };

  const handleManageRoles = (user: User) => {
    setSelectedUserForDrawer(user);
    setManageRolesOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUserForDrawer(user);
    setEditUserOpen(true);
  };

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<User>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_value, row) => <StatusIndicator status={statusMap[row.status]} />,
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
      key: 'roles',
      label: 'Roles',
      flex: 1,
      minWidth: columnMinWidths.roles,
    },
    {
      key: 'lastSignIn',
      label: 'Last sign-in',
      flex: 1,
      minWidth: columnMinWidths.lastSignIn,
      sortable: true,
    },
    {
      key: 'mfa',
      label: 'MFA',
      flex: 1,
      minWidth: columnMinWidths.mfa,
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
      render: (_value, row) => {
        const isDisabled = row.status === 'disabled';
        const menuItems: ContextMenuItem[] = [
          {
            id: 'manage-user-groups',
            label: 'Manage user groups',
            disabled: isDisabled,
            onClick: () => handleManageUserGroups(row),
          },
          {
            id: 'manage-roles',
            label: 'Manage roles',
            disabled: isDisabled,
            onClick: () => handleManageRoles(row),
          },
          {
            id: 'reset-password',
            label: 'Reset password',
            disabled: isDisabled,
            onClick: () => console.log('Reset password', row.id),
          },
          {
            id: 'lock-setting',
            label: 'Lock setting',
            onClick: () => console.log('Lock setting', row.id),
          },
          { id: 'edit', label: 'Edit', disabled: isDisabled, onClick: () => handleEditUser(row) },
          {
            id: 'delete',
            label: 'Delete',
            status: isDisabled ? undefined : 'danger',
            disabled: isDisabled,
            onClick: () => console.log('Delete', row.id),
          },
        ];
        return (
          <ContextMenu items={menuItems} trigger="click" align="right">
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
            </button>
          </ContextMenu>
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'Users' }]} />}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full">
                <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Users
                </h1>
                <Button variant="primary" size="md" onClick={() => navigate('/iam/users/create')}>
                  Create user
                </Button>
              </HStack>

              {/* Search and Actions */}
              <VStack gap={3} className="w-full">
                {/* Action Bar */}
                <ListToolbar
                  primaryActions={
                    <ListToolbar.Actions>
                      <SearchInput
                        placeholder="Search users by attributes"
                        value={searchQuery}
                        onChange={setSearchQuery}
                        className="w-[var(--search-input-width)]"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<IconDownload size={12} />}
                        aria-label="Download"
                      />
                    </ListToolbar.Actions>
                  }
                  bulkActions={
                    <ListToolbar.Actions>
                      <Button
                        variant="muted"
                        size="sm"
                        disabled={!hasSelection}
                        leftIcon={<IconTrash size={12} />}
                      >
                        Delete
                      </Button>
                    </ListToolbar.Actions>
                  }
                />

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredUsers.length}
                  selectedCount={selectedRows.length}
                  showSettings
                  onPageChange={setCurrentPage}
                />

                {/* Table */}
                <Table<User>
                  columns={columns}
                  data={paginatedUsers}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedRows}
                  onSelectionChange={setSelectedRows}
                />
              </VStack>
            </VStack>
          </div>
        </div>
      </main>

      {/* User Drawers */}
      <ManageUserGroupsDrawer
        isOpen={manageUserGroupsOpen}
        onClose={() => setManageUserGroupsOpen(false)}
        userName={selectedUserForDrawer?.username}
      />

      <ManageRolesDrawer
        isOpen={manageRolesOpen}
        onClose={() => setManageRolesOpen(false)}
        userName={selectedUserForDrawer?.username}
      />

      <EditUserDrawer
        isOpen={editUserOpen}
        onClose={() => setEditUserOpen(false)}
        userName={selectedUserForDrawer?.username}
      />
    </div>
  );
}

export default IAMUsersPage;
