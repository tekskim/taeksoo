import { useState, useEffect, useMemo } from 'react';
import {
  Button,
  FilterSearchInput,
  Table,
  StatusIndicator,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  ContextMenu,
  PageShell,
  PageHeader,
  ListToolbar,
  ConfirmModal,
  BadgeList,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type StatusType,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { UserGroupsDrawer } from '@/components/UserGroupsDrawer';
import { GroupRolesDrawer } from '@/components/GroupRolesDrawer';
import { UserEditDrawer } from '@/components/UserEditDrawer';
import { IconDownload, IconTrash, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type UserStatus = 'active' | 'deactivated';

interface User {
  id: string;
  username: string;
  status: UserStatus;
  userGroups: string[];
  roles: string[];
  lastSignIn: string;
  mfa: string[];
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
    userGroups: ['Compute:tenantA', 'Network:tenantB', 'Storage:tenantA'],
    roles: ['compute-admin', 'network-viewer', 'storage-admin', 'iam-reader'],
    lastSignIn: 'Sep 12, 2026',
    mfa: ['OTP', 'Email'],
    createdAt: 'Sep 12, 2026 09:23:41',
  },
  {
    id: 'user-002',
    username: 'alex.johnson',
    status: 'active',
    userGroups: ['dev-team'],
    roles: ['viewer'],
    lastSignIn: 'Sep 11, 2026',
    mfa: ['OTP'],
    createdAt: 'Aug 15, 2026 14:07:22',
  },
  {
    id: 'user-003',
    username: 'sara.connor',
    status: 'active',
    userGroups: ['ops-team', 'infra-team'],
    roles: ['network-admin', 'compute-viewer'],
    lastSignIn: 'Sep 10, 2026',
    mfa: ['Email'],
    createdAt: 'Jul 20, 2026 11:45:33',
  },
  {
    id: 'user-004',
    username: 'john.doe',
    status: 'deactivated',
    userGroups: ['guest'],
    roles: ['viewer'],
    lastSignIn: 'Aug 1, 2026',
    mfa: [],
    createdAt: 'Jun 10, 2026 16:52:08',
  },
  {
    id: 'user-005',
    username: 'jane.smith',
    status: 'active',
    userGroups: ['admin-group'],
    roles: ['super-admin'],
    lastSignIn: 'Sep 12, 2026',
    mfa: ['OTP', 'Email'],
    createdAt: 'Jan 5, 2026 08:30:15',
  },
  {
    id: 'user-006',
    username: 'mike.wilson',
    status: 'deactivated',
    userGroups: ['dev-team'],
    roles: ['developer'],
    lastSignIn: 'Sep 5, 2026',
    mfa: ['OTP'],
    createdAt: 'Apr 18, 2026 13:19:44',
  },
  {
    id: 'user-007',
    username: 'emily.chen',
    status: 'active',
    userGroups: ['qa-team', 'dev-team', 'release-team'],
    roles: ['qa-lead', 'dev-viewer', 'release-manager'],
    lastSignIn: 'Sep 11, 2026',
    mfa: ['Email'],
    createdAt: 'Mar 22, 2026 10:41:27',
  },
  {
    id: 'user-008',
    username: 'david.lee',
    status: 'active',
    userGroups: ['ops-team'],
    roles: ['storage-admin'],
    lastSignIn: 'Sep 12, 2026',
    mfa: ['OTP', 'Email'],
    createdAt: 'Feb 14, 2026 17:03:56',
  },
  {
    id: 'user-009',
    username: 'lisa.park',
    status: 'deactivated',
    userGroups: ['external'],
    roles: ['viewer'],
    lastSignIn: 'Jul 15, 2026',
    mfa: [],
    createdAt: 'May 30, 2026 12:28:19',
  },
  {
    id: 'user-010',
    username: 'chris.taylor',
    status: 'active',
    userGroups: ['dev-admin-group'],
    roles: ['iam-admin', 'compute-viewer'],
    lastSignIn: 'Sep 12, 2026',
    mfa: ['OTP'],
    createdAt: 'Jan 28, 2026 15:55:02',
  },
];

/* ----------------------------------------
   Status Config - Map to StatusIndicator types
   ---------------------------------------- */

const statusMap: Record<UserStatus, StatusType> = {
  active: 'active',
  deactivated: 'deactivated',
};

const filterFields: FilterField[] = [
  { id: 'username', label: 'Username', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'deactivated', label: 'Deactivated' },
    ],
  },
  { id: 'userGroups', label: 'User groups', type: 'text' },
  { id: 'roles', label: 'Roles', type: 'text' },
  { id: 'lastSignIn', label: 'Last sign-in', type: 'text' },
  { id: 'mfa', label: 'MFA', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   IAM Users Page
   ---------------------------------------- */

export function IAMUsersPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [users, setUsers] = useState(mockUsers);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Users');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return appliedFilters.every((filter) => {
        const value = String(user[filter.fieldId as keyof User] ?? '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [users, appliedFilters]);

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

  const handleBulkDelete = () => {
    setUsers((prev) => prev.filter((u) => !selectedRows.includes(u.id)));
    setIsBulkDeleteOpen(false);
    setSelectedRows([]);
  };

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<User>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_value, row) => (
        <StatusIndicator layout="icon-only" status={statusMap[row.status]} />
      ),
    },
    {
      key: 'username',
      label: 'Username',
      flex: 1,
      minWidth: columnMinWidths.username,
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/iam/users/${value}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline"
          >
            {value}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)]">
            <span className="truncate">ID: {row.id}</span>
            <InlineCopyId value={row.id} />
          </span>
        </div>
      ),
    },
    {
      key: 'userGroups',
      label: 'User groups',
      flex: 1,
      minWidth: columnMinWidths.userGroups,
      render: (value: string[]) => (
        <BadgeList
          items={value}
          maxVisible={1}
          maxBadgeWidth="140px"
          popoverTitle={`All User Groups (${value.length})`}
          overflowAlign="right"
          popoverMaxWidth="160px"
        />
      ),
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
      render: (value: string[]) =>
        value.length > 0 ? (
          <BadgeList
            items={value}
            maxVisible={2}
            theme="white"
            popoverTitle={`MFA Methods (${value.length})`}
          />
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
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
      render: (_value, row) => {
        const isDeactivated = row.status === 'deactivated';
        const menuItems: ContextMenuItem[] = [
          {
            id: 'manage-user-groups',
            label: 'Manage user groups',
            disabled: isDeactivated,
            onClick: () => handleManageUserGroups(row),
          },
          {
            id: 'reset-password',
            label: 'Reset password',
            disabled: isDeactivated,
            onClick: () => console.log('Reset password', row.id),
          },
          {
            id: 'edit',
            label: 'Edit',
            disabled: isDeactivated,
            onClick: () => handleEditUser(row),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: isDeactivated ? undefined : 'danger',
            disabled: isDeactivated,
            onClick: () => console.log('Delete', row.id),
          },
        ];
        return (
          <ContextMenu items={menuItems} trigger="click" align="right">
            <button
              aria-label="Row actions"
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        );
      },
    },
  ];

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Users' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader
          title="Users"
          actions={
            <Button variant="primary" size="md" onClick={() => navigate('/iam/users/create')}>
              Create user
            </Button>
          }
        />

        {/* Search and Actions */}
        <VStack gap={3} className="w-full">
          {/* Action Bar */}
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <FilterSearchInput
                  filters={filterFields}
                  appliedFilters={appliedFilters}
                  onFiltersChange={setAppliedFilters}
                  placeholder="Search users by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                  hideAppliedFilters
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<IconDownload size={12} />}
                  aria-label="Download"
                  onClick={() => console.log('Download')}
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
                  onClick={() => setIsBulkDeleteOpen(true)}
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
            emptyMessage="No users found"
            loading={loading}
          />
        </VStack>
      </VStack>

      {/* User Drawers */}
      <UserGroupsDrawer
        isOpen={manageUserGroupsOpen}
        onClose={() => setManageUserGroupsOpen(false)}
        userName={selectedUserForDrawer?.username}
      />

      <GroupRolesDrawer
        isOpen={manageRolesOpen}
        onClose={() => setManageRolesOpen(false)}
        userName={selectedUserForDrawer?.username}
      />

      <UserEditDrawer
        isOpen={editUserOpen}
        onClose={() => setEditUserOpen(false)}
        userName={selectedUserForDrawer?.username}
      />

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete selected users"
        description="Removing the selected users is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} user(s)`}
      />
    </PageShell>
  );
}

export default IAMUsersPage;
