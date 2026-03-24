import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconSettings,
  IconUnlink,
} from '@tabler/icons-react';
import { EditUserGroupDrawer } from '../drawers/EditUserGroupDrawer';
import { ManageUsersDrawer } from '../drawers/ManageUsersDrawer';
import { ManageRolesDrawer } from '../drawers/ManageRolesDrawer';

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
  [key: string]: unknown;
}

interface GroupRole {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  policies: string;
  userGroupCount: number;
  userCount: number;
  createdAt: string;
  [key: string]: unknown;
}

/* ----------------------------------------
   Mock Data (identical to TDS)
   ---------------------------------------- */

const mockUserGroupsMap: Record<string, UserGroupDetail> = {
  'dev-admin-group': {
    name: 'dev-admin-group',
    description: 'Development team administrators',
    type: 'Custom',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  'ops-team': {
    name: 'ops-team',
    description: 'Operations team',
    type: 'Custom',
    createdAt: 'Sep 10, 2025 01:17:01',
  },
  'qa-team': {
    name: 'qa-team',
    description: 'Quality assurance team',
    type: 'Custom',
    createdAt: 'Sep 8, 2025 11:51:27',
  },
  viewers: {
    name: 'viewers',
    description: '-',
    type: 'Built-in',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  administrators: {
    name: 'administrators',
    description: 'System administrators',
    type: 'Built-in',
    createdAt: 'Aug 1, 2025 10:20:28',
  },
  developers: {
    name: 'developers',
    description: 'Development team',
    type: 'Custom',
    createdAt: 'Aug 15, 2025 12:22:26',
  },
  'security-team': {
    name: 'security-team',
    description: 'Security operations',
    type: 'Custom',
    createdAt: 'Jul 20, 2025 23:27:51',
  },
  'support-team': {
    name: 'support-team',
    description: 'Customer support team',
    type: 'Custom',
    createdAt: 'Jul 10, 2025 01:17:01',
  },
  'data-analysts': {
    name: 'data-analysts',
    description: 'Data analysis team',
    type: 'Custom',
    createdAt: 'Jun 25, 2025 10:32:16',
  },
  'external-users': {
    name: 'external-users',
    description: 'External partners',
    type: 'Custom',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
  MemberGroup: {
    name: 'MemberGroup',
    description: 'member group',
    type: 'Custom',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  'viewer-group': {
    name: 'viewer-group',
    description: 'Read-only access group',
    type: 'Custom',
    createdAt: 'Aug 10, 2025 01:17:01',
  },
  'network-admin-group': {
    name: 'network-admin-group',
    description: 'Network administrators group',
    type: 'Built-in',
    createdAt: 'Jun 15, 2025 12:22:26',
  },
};

const mockGroupUsers: GroupUser[] = [
  {
    id: 'u-001',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'u-002',
    username: 'alex.johnson',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 10, 2025',
    createdAt: 'Aug 15, 2025 12:22:26',
  },
  {
    id: 'u-003',
    username: 'sara.connor',
    status: 'active',
    userGroups: 'dev-admin-group (+1)',
    lastSignIn: 'Sep 11, 2025',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
  {
    id: 'u-004',
    username: 'john.smith',
    status: 'shutoff',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 5, 2025',
    createdAt: 'Jul 1, 2025 10:20:28',
  },
  {
    id: 'u-005',
    username: 'emily.davis',
    status: 'active',
    userGroups: 'dev-admin-group (+3)',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Sep 1, 2025 10:20:28',
  },
  {
    id: 'u-006',
    username: 'michael.brown',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 8, 2025',
    createdAt: 'Aug 5, 2025 14:12:36',
  },
  {
    id: 'u-007',
    username: 'jessica.wilson',
    status: 'error',
    userGroups: 'dev-admin-group (+1)',
    lastSignIn: 'Aug 30, 2025',
    createdAt: 'Jul 15, 2025 12:22:26',
  },
  {
    id: 'u-008',
    username: 'david.lee',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 11, 2025',
    createdAt: 'Aug 25, 2025 10:32:16',
  },
  {
    id: 'u-009',
    username: 'amanda.taylor',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    lastSignIn: 'Sep 9, 2025',
    createdAt: 'Aug 10, 2025 01:17:01',
  },
  {
    id: 'u-010',
    username: 'chris.anderson',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 7, 2025',
    createdAt: 'Jul 20, 2025 23:27:51',
  },
  {
    id: 'u-011',
    username: 'laura.martinez',
    status: 'shutoff',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Aug 28, 2025',
    createdAt: 'Jun 30, 2025 21:37:41',
  },
  {
    id: 'u-012',
    username: 'ryan.thomas',
    status: 'active',
    userGroups: 'dev-admin-group (+1)',
    lastSignIn: 'Sep 10, 2025',
    createdAt: 'Aug 18, 2025 09:01:17',
  },
  {
    id: 'u-013',
    username: 'megan.jackson',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 6, 2025',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  {
    id: 'u-014',
    username: 'kevin.white',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    lastSignIn: 'Sep 11, 2025',
    createdAt: 'Aug 22, 2025 13:53:25',
  },
  {
    id: 'u-015',
    username: 'nicole.harris',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 8, 2025',
    createdAt: 'Aug 1, 2025 10:20:28',
  },
  {
    id: 'u-016',
    username: 'daniel.clark',
    status: 'active',
    userGroups: 'dev-admin-group',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Sep 5, 2025 14:12:36',
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
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'r-002',
    name: 'compute-admin',
    type: 'Built-in',
    policies: 'ComputeFullAccess (+2)',
    userGroupCount: 8,
    userCount: 15,
    createdAt: 'Jan 15, 2025 12:22:26',
  },
  {
    id: 'r-003',
    name: 'storage-viewer',
    type: 'Built-in',
    policies: 'StorageReadOnly',
    userGroupCount: 5,
    userCount: 12,
    createdAt: 'Jan 20, 2025 23:27:51',
  },
  {
    id: 'r-004',
    name: 'network-admin',
    type: 'Built-in',
    policies: 'NetworkFullAccess (+1)',
    userGroupCount: 3,
    userCount: 8,
    createdAt: 'Feb 1, 2025 10:20:28',
  },
  {
    id: 'r-005',
    name: 'custom-dev-role',
    type: 'Custom',
    policies: 'DevPolicy',
    userGroupCount: 2,
    userCount: 10,
    createdAt: 'Jun 10, 2025 01:17:01',
  },
  {
    id: 'r-006',
    name: 'iam-readonly',
    type: 'Built-in',
    policies: 'IAMReadOnly',
    userGroupCount: 4,
    userCount: 7,
    createdAt: 'Mar 15, 2025 12:22:26',
  },
];

/* ----------------------------------------
   IAM User Group Detail Page
   ---------------------------------------- */

const statusMap: Record<string, StatusVariant> = {
  active: 'active',
  error: 'error',
  shutoff: 'shutoff',
};

export function IAMUserGroupDetailPage() {
  const { groupName } = useParams<{ groupName: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'users';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [usersFilters, setUsersFilters] = useState<FilterKeyWithValue[]>([]);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [rolesFilters, setRolesFilters] = useState<FilterKeyWithValue[]>([]);
  const [rolesCurrentPage, setRolesCurrentPage] = useState(1);

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [manageRolesOpen, setManageRolesOpen] = useState(false);

  const itemsPerPage = 10;
  const userGroup = groupName ? mockUserGroupsMap[groupName] : null;

  const applyFilter = <T extends Record<string, unknown>>(
    data: T[],
    filters: FilterKeyWithValue[]
  ): T[] => {
    if (filters.length === 0) return data;
    return data.filter((item) =>
      filters.every((f) =>
        String(item[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  };

  const filteredUsers = applyFilter(
    mockGroupUsers as unknown as Record<string, unknown>[],
    usersFilters
  ) as unknown as typeof mockGroupUsers;
  const paginatedUsers = filteredUsers.slice(
    (usersCurrentPage - 1) * itemsPerPage,
    usersCurrentPage * itemsPerPage
  );

  const filteredRoles = applyFilter(
    mockGroupRoles as unknown as Record<string, unknown>[],
    rolesFilters
  ) as unknown as typeof mockGroupRoles;
  const paginatedRoles = filteredRoles.slice(
    (rolesCurrentPage - 1) * itemsPerPage,
    rolesCurrentPage * itemsPerPage
  );

  const usersFilterKeys: FilterKey[] = [
    { key: 'username', label: 'Username', type: 'input', placeholder: 'Enter username...' },
  ];
  const rolesFilterKeys: FilterKey[] = [
    { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter role name...' },
  ];

  const userColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'username', header: 'Username' },
    { key: 'userGroups', header: 'User groups' },
    { key: 'lastSignIn', header: 'Last sign-in' },
    { key: 'createdAt', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const roleColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'policies', header: 'Policies' },
    { key: 'userGroupCount', header: 'User group count' },
    { key: 'createdAt', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  if (!userGroup) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-heading-h3 text-text">User group not found</h1>
        <p className="text-text-muted">The user group &quot;{groupName}&quot; does not exist.</p>
        <Button
          variant="secondary"
          appearance="outline"
          onClick={() => navigate('/iam/user-groups')}
        >
          Back to User groups
        </Button>
      </div>
    );
  }

  const infoFields = [
    { label: 'Description', value: userGroup.description },
    { label: 'Type', value: userGroup.type },
    { label: 'Created at', value: userGroup.createdAt },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        appearance="outline"
        size="sm"
        onClick={() => setEditDrawerOpen(true)}
      >
        <IconEdit size={12} stroke={1.5} /> Edit
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTrash size={12} stroke={1.5} /> Delete
      </Button>
      <ContextMenu.Root
        direction="bottom-end"
        gap={4}
        trigger={({ toggle }) => (
          <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
            More actions <IconChevronDown size={12} stroke={1.5} />
          </Button>
        )}
      >
        <ContextMenu.Item action={() => setManageRolesOpen(true)}>Manage roles</ContextMenu.Item>
        <ContextMenu.Item action={() => setManageUsersOpen(true)}>Manage users</ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={userGroup.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
          <Tab id="users" label="Users">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-16 font-semibold leading-24 text-text">Users</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setManageUsersOpen(true)}
                >
                  <IconSettings size={12} /> Manage users
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={usersFilterKeys}
                onFilterAdd={(f) => {
                  setUsersFilters((p) => [...p, f]);
                  setUsersCurrentPage(1);
                }}
                selectedFilters={usersFilters}
                placeholder="Search users by attributes"
                defaultFilterKey="username"
              />
              <Pagination
                totalCount={filteredUsers.length}
                size={itemsPerPage}
                currentAt={usersCurrentPage}
                onPageChange={setUsersCurrentPage}
                totalCountLabel="items"
              />
              <Table columns={userColumns} rows={paginatedUsers}>
                {paginatedUsers.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={userColumns[0]}>
                      <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
                    </Table.Td>
                    <Table.Td rowData={row} column={userColumns[1]}>
                      <Link
                        to={`/iam/users/${row.username}`}
                        className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
                      >
                        {row.username}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={userColumns[2]}>
                      {row.userGroups}
                    </Table.Td>
                    <Table.Td rowData={row} column={userColumns[3]}>
                      {row.lastSignIn}
                    </Table.Td>
                    <Table.Td rowData={row} column={userColumns[4]}>
                      {row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                    <Table.Td rowData={row} column={userColumns[5]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => (
                          <button
                            type="button"
                            onClick={toggle}
                            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                            aria-label="Actions"
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
                          action={() => console.log('Remove', row.id)}
                          danger={row.status === 'active'}
                          disabled={row.status !== 'active'}
                        >
                          Remove
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="roles" label="Roles">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-16 font-semibold leading-24 text-text">Roles</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setManageRolesOpen(true)}
                >
                  <IconSettings size={12} /> Manage roles
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <FilterSearchInput
                  filterKeys={rolesFilterKeys}
                  onFilterAdd={(f) => {
                    setRolesFilters((p) => [...p, f]);
                    setRolesCurrentPage(1);
                  }}
                  selectedFilters={rolesFilters}
                  placeholder="Search roles by attributes"
                  defaultFilterKey="name"
                />
                <div className="w-px h-4 bg-border" />
                <Button variant="muted" appearance="ghost" size="sm" disabled>
                  <IconUnlink size={12} /> Detach
                </Button>
              </div>
              <Pagination
                totalCount={filteredRoles.length}
                size={itemsPerPage}
                currentAt={rolesCurrentPage}
                onPageChange={setRolesCurrentPage}
                totalCountLabel="items"
              />
              <Table columns={roleColumns} rows={paginatedRoles}>
                {paginatedRoles.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={roleColumns[0]}>
                      <Link
                        to={`/iam/roles/${row.name}`}
                        className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
                      >
                        {row.name}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[1]}>
                      {row.type}
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[2]}>
                      {row.policies}
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[3]}>
                      {row.userGroupCount}
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[4]}>
                      {row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[5]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => (
                          <button
                            type="button"
                            onClick={toggle}
                            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                            aria-label="Actions"
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
                          action={() => console.log('Detach', row.id)}
                          danger={row.type !== 'Built-in'}
                          disabled={row.type === 'Built-in'}
                        >
                          Detach
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditUserGroupDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        initialData={{ name: userGroup.name, description: userGroup.description }}
      />
      <ManageUsersDrawer
        isOpen={manageUsersOpen}
        onClose={() => setManageUsersOpen(false)}
        userGroupName={userGroup.name}
      />
      <ManageRolesDrawer
        isOpen={manageRolesOpen}
        onClose={() => setManageRolesOpen(false)}
        userName={userGroup.name}
      />
    </div>
  );
}

export default IAMUserGroupDetailPage;
