import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as SectionCard } from '@shared/components/SectionCard/SectionCard';
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
  IconLock,
  IconReload,
  IconSettings,
  IconRefresh,
  IconCircleX,
  IconCircleMinus,
} from '@tabler/icons-react';
import { EditUserDrawer } from '../drawers/EditUserDrawer';
import { ManageUserGroupsDrawer } from '../drawers/ManageUserGroupsDrawer';
import { ManageRolesDrawer } from '../drawers/ManageRolesDrawer';

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
  [key: string]: unknown;
}
interface Role {
  id: string;
  name: string;
  source: 'Direct' | 'Group';
  type: 'Built-in' | 'Custom';
  policies: string;
  createdAt: string;
  [key: string]: unknown;
}
interface AccessKey {
  id: string;
  keyId: string;
  description: string;
  lastUsed: string;
  createdAt: string;
  status: 'active' | 'inactive';
  [key: string]: unknown;
}
interface Session {
  id: string;
  started: string;
  lastAccess: string;
  ipAddress: string;
  device: string;
  [key: string]: unknown;
}

const mockUsersMap: Record<string, UserDetail> = {
  'thaki-kim': {
    username: 'thaki-kim',
    displayName: 'thaki.kim',
    email: 'thaki.kim@example.com',
    status: 'online',
    locked: false,
    createdAt: 'Jul 25, 2025 09:14:33',
  },
  'alex.johnson': {
    username: 'alex.johnson',
    displayName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    status: 'online',
    locked: true,
    createdAt: 'Aug 15, 2025 11:42:18',
  },
  'sara.connor': {
    username: 'sara.connor',
    displayName: 'Sara Connor',
    email: 'sara.connor@example.com',
    status: 'offline',
    createdAt: 'Jul 20, 2025 14:28:45',
  },
  'john.doe': {
    username: 'john.doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    status: 'offline',
    createdAt: 'Jun 10, 2025 08:35:22',
  },
  'jane.smith': {
    username: 'jane.smith',
    displayName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'online',
    createdAt: 'Jan 5, 2025 10:18:51',
  },
  'mike.wilson': {
    username: 'mike.wilson',
    displayName: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    status: 'offline',
    createdAt: 'Apr 18, 2025 16:52:07',
  },
  'emily.chen': {
    username: 'emily.chen',
    displayName: 'Emily Chen',
    email: 'emily.chen@example.com',
    status: 'online',
    createdAt: 'Mar 22, 2025 13:25:38',
  },
  'david.lee': {
    username: 'david.lee',
    displayName: 'David Lee',
    email: 'david.lee@example.com',
    status: 'online',
    createdAt: 'Feb 14, 2025 09:42:14',
  },
  'lisa.park': {
    username: 'lisa.park',
    displayName: 'Lisa Park',
    email: 'lisa.park@example.com',
    status: 'offline',
    createdAt: 'May 30, 2025 11:18:52',
  },
  'chris.taylor': {
    username: 'chris.taylor',
    displayName: 'Chris Taylor',
    email: 'chris.taylor@example.com',
    status: 'online',
    createdAt: 'Jan 28, 2025 15:33:27',
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
    createdAt: 'Sep 12, 2025 08:22:15',
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
];

const mockRoles: Role[] = [
  {
    id: 'r-001',
    name: 'viewer',
    source: 'Direct',
    type: 'Built-in',
    policies: 'ReadCompute (+2)',
    createdAt: 'Sep 12, 2025 09:22:18',
  },
  {
    id: 'r-002',
    name: 'compute-admin',
    source: 'Group',
    type: 'Built-in',
    policies: 'ComputeFullAccess (+5)',
    createdAt: 'Aug 20, 2025 11:35:42',
  },
  {
    id: 'r-003',
    name: 'storage-viewer',
    source: 'Direct',
    type: 'Custom',
    policies: 'StorageReadOnly',
    createdAt: 'Jul 15, 2025 14:48:27',
  },
  {
    id: 'r-004',
    name: 'network-admin',
    source: 'Group',
    type: 'Built-in',
    policies: 'NetworkFullAccess (+3)',
    createdAt: 'Jun 10, 2025 08:52:15',
  },
  {
    id: 'r-005',
    name: 'iam-reader',
    source: 'Direct',
    type: 'Built-in',
    policies: 'IAMReadOnly (+1)',
    createdAt: 'May 5, 2025 16:18:33',
  },
];

const groupFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter group name...' },
];
const roleFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter role name...' },
  {
    key: 'source',
    label: 'Source',
    type: 'select',
    options: [
      { value: 'Direct', label: 'Direct' },
      { value: 'Group', label: 'Group' },
    ],
  },
];
const sessionFilterKeys: FilterKey[] = [
  { key: 'ipAddress', label: 'IP Address', type: 'input', placeholder: 'Enter IP...' },
  { key: 'device', label: 'Device', type: 'input', placeholder: 'Enter device...' },
];

const ActionTrigger = ({ toggle }: { toggle: () => void }) => (
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
);

export function IAMUserDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'user-groups';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [groupFilters, setGroupFilters] = useState<FilterKeyWithValue[]>([]);
  const [groupPage, setGroupPage] = useState(1);
  const [roleFilters, setRoleFilters] = useState<FilterKeyWithValue[]>([]);
  const [rolePage, setRolePage] = useState(1);
  const [sessionFilters, setSessionFilters] = useState<FilterKeyWithValue[]>([]);
  const [sessionPage, setSessionPage] = useState(1);

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [manageGroupsOpen, setManageGroupsOpen] = useState(false);
  const [manageRolesOpen, setManageRolesOpen] = useState(false);

  const user = username ? mockUsersMap[username] || defaultUserDetail : defaultUserDetail;
  const isUserLocked = user.locked === true;
  const statusVariant: StatusVariant = user.status === 'online' ? 'active' : 'shutoff';

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

  const itemsPerPage = 10;
  const filteredGroups = applyFilter(mockUserGroups, groupFilters);
  const paginatedGroups = filteredGroups.slice(
    (groupPage - 1) * itemsPerPage,
    groupPage * itemsPerPage
  );
  const filteredRoles = applyFilter(mockRoles, roleFilters);
  const paginatedRoles = filteredRoles.slice(
    (rolePage - 1) * itemsPerPage,
    rolePage * itemsPerPage
  );
  const filteredSessions = applyFilter(mockSessions, sessionFilters);
  const paginatedSessions = filteredSessions.slice(
    (sessionPage - 1) * itemsPerPage,
    sessionPage * itemsPerPage
  );

  const infoFields = [
    {
      label: 'Status',
      value: user.status === 'online' ? 'Online' : 'Offline',
      accessory: <StatusIndicator variant={statusVariant} layout="iconOnly" />,
    },
    { label: 'Display name', value: user.displayName },
    { label: 'Email address', value: user.email },
    { label: 'Created at', value: user.createdAt },
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
      <Button variant="secondary" appearance="outline" size="sm">
        <IconLock size={12} /> Lock setting
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconReload size={12} /> Reset password
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
        <ContextMenu.Item action={() => setManageGroupsOpen(true)}>
          Manage user groups
        </ContextMenu.Item>
        <ContextMenu.Item action={() => setManageRolesOpen(true)}>Manage roles</ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Reset password')}>
          Reset password
        </ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  const groupColumns: TableColumn[] = [
    { key: 'name', header: 'User group name' },
    { key: 'users', header: 'User' },
    { key: 'attachedRoles', header: 'Attached roles' },
    { key: 'description', header: 'Description' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const roleColumns: TableColumn[] = [
    { key: 'name', header: 'Role name' },
    { key: 'source', header: 'Source' },
    { key: 'type', header: 'Type' },
    { key: 'policies', header: 'Policies' },
    { key: 'createdAt', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const sessionColumns: TableColumn[] = [
    { key: 'started', header: 'Started' },
    { key: 'lastAccess', header: 'Last access' },
    { key: 'ipAddress', header: 'IP Address' },
    { key: 'device', header: 'Device' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const accessKeyColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'keyId', header: 'Key ID' },
    { key: 'description', header: 'Description' },
    { key: 'lastUsed', header: 'Last used' },
    { key: 'createdAt', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={user.username} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="user-groups" label="User groups">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-14 font-semibold leading-5 text-text m-0">User groups</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setManageGroupsOpen(true)}
                >
                  <IconSettings size={12} /> Manage user groups
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={groupFilterKeys}
                onFilterAdd={(f) => {
                  setGroupFilters((p) => [...p, f]);
                  setGroupPage(1);
                }}
                selectedFilters={groupFilters}
                placeholder="Search groups by attributes"
                defaultFilterKey="name"
              />
              <Pagination
                totalCount={filteredGroups.length}
                size={itemsPerPage}
                currentAt={groupPage}
                onPageChange={setGroupPage}
                totalCountLabel="items"
              />
              <Table columns={groupColumns} rows={paginatedGroups}>
                {paginatedGroups.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={groupColumns[0]}>
                      <Link
                        to={`/iam/user-groups/${row.name}`}
                        className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
                      >
                        {row.name}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={groupColumns[1]}>
                      {row.users}
                    </Table.Td>
                    <Table.Td rowData={row} column={groupColumns[2]}>
                      {row.attachedRoles}
                    </Table.Td>
                    <Table.Td rowData={row} column={groupColumns[3]}>
                      {row.description}
                    </Table.Td>
                    <Table.Td rowData={row} column={groupColumns[4]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item
                          action={() => console.log('Detach group', row.id)}
                          danger={!isUserLocked}
                          disabled={isUserLocked}
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

          <Tab id="roles" label="Roles">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-14 font-semibold leading-5 text-text m-0">Roles</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setManageRolesOpen(true)}
                >
                  <IconSettings size={12} /> Manage roles
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={roleFilterKeys}
                onFilterAdd={(f) => {
                  setRoleFilters((p) => [...p, f]);
                  setRolePage(1);
                }}
                selectedFilters={roleFilters}
                placeholder="Search roles by attributes"
                defaultFilterKey="name"
              />
              <Pagination
                totalCount={filteredRoles.length}
                size={itemsPerPage}
                currentAt={rolePage}
                onPageChange={setRolePage}
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
                      {row.source}
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[2]}>
                      {row.type}
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[3]}>
                      {row.policies}
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[4]}>
                      {row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                    <Table.Td rowData={row} column={roleColumns[5]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item
                          action={() => console.log('Detach role', row.id)}
                          danger={!isUserLocked}
                          disabled={isUserLocked}
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

          <Tab id="security-credentials" label="Security credentials">
            <div className="flex flex-col gap-4 pt-4">
              {/* Password section */}
              <SectionCard
                title="Password"
                actions={
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconReload size={12} /> Reset password
                  </Button>
                }
                fields={[
                  { label: 'Last updated at', value: '2025.11.11 14:22:43 (Updated by user)' },
                ]}
              />

              {/* OTP MFA section */}
              <SectionCard
                title="OTP MFA"
                actions={
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconCircleMinus size={12} /> Remove
                  </Button>
                }
                fields={[
                  { label: 'Last used', value: '2025.11.11 14:22:43' },
                  { label: 'Created at', value: '2025.11.11 14:22:43' },
                ]}
              />

              {/* Access keys section (disabled) */}
              <div className="opacity-50 pointer-events-none">
                <SectionCard
                  title={`Access keys (${mockAccessKeys.length})`}
                  actions={
                    <Button variant="secondary" appearance="outline" size="sm" disabled>
                      Create access key
                    </Button>
                  }
                  fields={[]}
                />
                <div className="mt-3">
                  <Table columns={accessKeyColumns} rows={mockAccessKeys}>
                    {mockAccessKeys.map((row) => (
                      <Table.Tr key={row.id} rowData={row}>
                        <Table.Td rowData={row} column={accessKeyColumns[0]}>
                          <StatusIndicator
                            variant={row.status === 'active' ? 'active' : 'shutoff'}
                            layout="iconOnly"
                          />
                        </Table.Td>
                        <Table.Td rowData={row} column={accessKeyColumns[1]}>
                          {row.keyId}
                        </Table.Td>
                        <Table.Td rowData={row} column={accessKeyColumns[2]}>
                          {row.description}
                        </Table.Td>
                        <Table.Td rowData={row} column={accessKeyColumns[3]}>
                          {row.lastUsed}
                        </Table.Td>
                        <Table.Td rowData={row} column={accessKeyColumns[4]}>
                          {row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                        </Table.Td>
                        <Table.Td
                          rowData={row}
                          column={accessKeyColumns[5]}
                          preventClickPropagation
                        >
                          <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                            <ContextMenu.Item action={() => console.log('Deactivate', row.id)}>
                              Deactivate
                            </ContextMenu.Item>
                            <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
                              Delete
                            </ContextMenu.Item>
                          </ContextMenu.Root>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table>
                </div>
              </div>
            </div>
          </Tab>

          <Tab id="sessions" label="Sessions">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-14 font-semibold leading-5 text-text m-0">Sessions</h2>
              <div className="flex items-center gap-2">
                <FilterSearchInput
                  filterKeys={sessionFilterKeys}
                  onFilterAdd={(f) => {
                    setSessionFilters((p) => [...p, f]);
                    setSessionPage(1);
                  }}
                  selectedFilters={sessionFilters}
                  placeholder="Search sessions by attributes"
                  defaultFilterKey="ipAddress"
                />
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1">
                  <Button variant="secondary" appearance="outline" size="sm" aria-label="Refresh">
                    <IconRefresh size={12} stroke={1.5} />
                  </Button>
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconCircleX size={12} /> Terminate all sessions
                  </Button>
                </div>
              </div>
              <Pagination
                totalCount={filteredSessions.length}
                size={itemsPerPage}
                currentAt={sessionPage}
                onPageChange={setSessionPage}
                totalCountLabel="items"
              />
              <Table columns={sessionColumns} rows={paginatedSessions}>
                {paginatedSessions.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={sessionColumns[0]}>
                      {row.started}
                    </Table.Td>
                    <Table.Td rowData={row} column={sessionColumns[1]}>
                      {row.lastAccess}
                    </Table.Td>
                    <Table.Td rowData={row} column={sessionColumns[2]}>
                      {row.ipAddress}
                    </Table.Td>
                    <Table.Td rowData={row} column={sessionColumns[3]}>
                      {row.device}
                    </Table.Td>
                    <Table.Td rowData={row} column={sessionColumns[4]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => console.log('Terminate', row.id)} danger>
                          Terminate
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

      <EditUserDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        userName={user.username}
        initialData={{
          email: user.email,
          displayName: user.displayName,
          enabled: user.status === 'online',
        }}
      />
      <ManageUserGroupsDrawer
        isOpen={manageGroupsOpen}
        onClose={() => setManageGroupsOpen(false)}
        userName={user.username}
      />
      <ManageRolesDrawer
        isOpen={manageRolesOpen}
        onClose={() => setManageRolesOpen(false)}
        userName={user.username}
      />
    </div>
  );
}

export default IAMUserDetailPage;
