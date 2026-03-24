import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { EditUserDrawer } from '../drawers/EditUserDrawer';
import { ManageUserGroupsDrawer } from '../drawers/ManageUserGroupsDrawer';
import { ManageRolesDrawer } from '../drawers/ManageRolesDrawer';
import { ResetPasswordDrawer } from '../drawers/iam/ResetPasswordDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

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
  [key: string]: unknown;
}

const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Sep 12, 2025 09:23:41',
  },
  {
    id: 'user-002',
    username: 'alex.johnson',
    status: 'active',
    userGroups: 'dev-team',
    roles: 'viewer',
    lastSignIn: 'Sep 11, 2025',
    mfa: 'OTP',
    createdAt: 'Aug 15, 2025 14:07:22',
  },
  {
    id: 'user-003',
    username: 'sara.connor',
    status: 'active',
    userGroups: 'ops-team (+1)',
    roles: 'network-admin (+1)',
    lastSignIn: 'Sep 10, 2025',
    mfa: 'Email',
    createdAt: 'Jul 20, 2025 11:45:33',
  },
  {
    id: 'user-004',
    username: 'john.doe',
    status: 'disabled',
    userGroups: 'guest',
    roles: 'viewer',
    lastSignIn: 'Aug 1, 2025',
    mfa: '-',
    createdAt: 'Jun 10, 2025 16:52:08',
  },
  {
    id: 'user-005',
    username: 'jane.smith',
    status: 'active',
    userGroups: 'admin-group',
    roles: 'super-admin',
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Jan 5, 2025 08:30:15',
  },
  {
    id: 'user-006',
    username: 'mike.wilson',
    status: 'locked',
    userGroups: 'dev-team',
    roles: 'developer',
    lastSignIn: 'Sep 5, 2025',
    mfa: 'OTP',
    createdAt: 'Apr 18, 2025 13:19:44',
  },
  {
    id: 'user-007',
    username: 'emily.chen',
    status: 'active',
    userGroups: 'qa-team (+2)',
    roles: 'qa-lead (+2)',
    lastSignIn: 'Sep 11, 2025',
    mfa: 'Email',
    createdAt: 'Mar 22, 2025 10:41:27',
  },
  {
    id: 'user-008',
    username: 'david.lee',
    status: 'active',
    userGroups: 'ops-team',
    roles: 'storage-admin',
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Feb 14, 2025 17:03:56',
  },
  {
    id: 'user-009',
    username: 'lisa.park',
    status: 'disabled',
    userGroups: 'external',
    roles: 'viewer',
    lastSignIn: 'Jul 15, 2025',
    mfa: '-',
    createdAt: 'May 30, 2025 12:28:19',
  },
  {
    id: 'user-010',
    username: 'chris.taylor',
    status: 'active',
    userGroups: 'dev-admin-group',
    roles: 'iam-admin (+1)',
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP',
    createdAt: 'Jan 28, 2025 15:55:02',
  },
];

const statusMap: Record<UserStatus, StatusVariant> = {
  active: 'active',
  disabled: 'shutoff',
  locked: 'error',
};

const filterKeys: FilterKey[] = [
  { key: 'username', label: 'Username', type: 'input', placeholder: 'Enter username...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'disabled', label: 'Disabled' },
      { value: 'locked', label: 'Locked' },
    ],
  },
  { key: 'userGroups', label: 'User groups', type: 'input', placeholder: 'Enter group name...' },
  { key: 'roles', label: 'Roles', type: 'input', placeholder: 'Enter role name...' },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'username', label: 'Username', visible: true, locked: true },
  { key: 'userGroups', label: 'User groups', visible: true },
  { key: 'roles', label: 'Roles', visible: true },
  { key: 'lastSignIn', label: 'Last sign-in', visible: true },
  { key: 'mfa', label: 'MFA', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function IAMUsersPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editDrawerUser, setEditDrawerUser] = useState('');
  const [manageGroupsOpen, setManageGroupsOpen] = useState(false);
  const [manageGroupsUser, setManageGroupsUser] = useState('');
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [manageRolesUser, setManageRolesUser] = useState('');
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState('');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    if (appliedFilters.length === 0) return mockUsers;
    return mockUsers.filter((user) =>
      appliedFilters.every((filter) => {
        const val = String(user[filter.key] ?? '').toLowerCase();
        return val.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasSelection = selectedRows.length > 0;

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'username', header: 'Username', sortable: true },
    { key: 'userGroups', header: 'User groups' },
    { key: 'roles', header: 'Roles' },
    { key: 'lastSignIn', header: 'Last sign-in', sortable: true },
    { key: 'mfa', header: 'MFA' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Page Header */}
      <div className="flex items-center justify-between h-8">
        <Title title="Users" />
        <Button variant="primary" size="md" onClick={() => navigate('/iam/users/create')}>
          Create user
        </Button>
      </div>

      {/* Toolbar: FilterSearchInput + Download | Delete */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search users by attributes"
            defaultFilterKey="username"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
            <IconTrash size={12} /> Delete
          </Button>
        </div>
      </div>

      {/* Applied filter chips */}
      {appliedFilters.length > 0 && (
        <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
          <div className="flex items-center gap-1 flex-wrap">
            {appliedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
              >
                <span className="flex items-center gap-1">
                  <span className="text-text">{filter.label}</span>
                  <span className="text-border">|</span>
                  <span className="text-text">{filter.displayValue ?? filter.value}</span>
                </span>
                <button
                  type="button"
                  className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                  onClick={() => handleFilterRemove(filter.id!)}
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
                >
                  <IconX size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
            onClick={() => {
              setAppliedFilters([]);
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        totalCount={filteredUsers.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      {/* Table */}
      <SelectableTable<User>
        columns={columns}
        rows={paginatedUsers}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedUsers.map((user) => (
          <Table.Tr key={user.id} rowData={user}>
            <Table.Td rowData={user} column={columns[0]}>
              <StatusIndicator variant={statusMap[user.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={user} column={columns[1]}>
              <Link
                to={`/iam/users/${user.username}`}
                className="text-primary font-medium hover:underline"
              >
                {user.username}
              </Link>
            </Table.Td>
            <Table.Td rowData={user} column={columns[2]}>
              {user.userGroups}
            </Table.Td>
            <Table.Td rowData={user} column={columns[3]}>
              {user.roles}
            </Table.Td>
            <Table.Td rowData={user} column={columns[4]}>
              {user.lastSignIn}
            </Table.Td>
            <Table.Td rowData={user} column={columns[5]}>
              {user.mfa}
            </Table.Td>
            <Table.Td rowData={user} column={columns[6]}>
              {user.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={user} column={columns[7]} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              >
                <ContextMenu.Item
                  action={() => {
                    setManageGroupsUser(user.username);
                    setManageGroupsOpen(true);
                  }}
                  disabled={user.status === 'disabled'}
                >
                  Manage user groups
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setManageRolesUser(user.username);
                    setManageRolesOpen(true);
                  }}
                  disabled={user.status === 'disabled'}
                >
                  Manage roles
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setResetPasswordUser(user.username);
                    setResetPasswordOpen(true);
                  }}
                  disabled={user.status === 'disabled'}
                >
                  Reset password
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setEditDrawerUser(user.username);
                    setEditDrawerOpen(true);
                  }}
                  disabled={user.status === 'disabled'}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => console.log('Delete', user.id)}
                  danger={user.status !== 'disabled'}
                  disabled={user.status === 'disabled'}
                >
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <EditUserDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        userName={editDrawerUser}
      />
      <ManageUserGroupsDrawer
        isOpen={manageGroupsOpen}
        onClose={() => setManageGroupsOpen(false)}
        userName={manageGroupsUser}
      />
      <ManageRolesDrawer
        isOpen={manageRolesOpen}
        onClose={() => setManageRolesOpen(false)}
        userName={manageRolesUser}
      />
      <ResetPasswordDrawer
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        userName={resetPasswordUser}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
