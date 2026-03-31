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
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { EditUserGroupDrawer } from '../drawers/EditUserGroupDrawer';
import { ManageUsersDrawer } from '../drawers/ManageUsersDrawer';
import { ManageRolesDrawer } from '../drawers/ManageRolesDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

type GroupType = 'Built-in' | 'Custom';
type GroupStatus = 'active' | 'inactive';

interface UserGroup {
  id: string;
  name: string;
  type: GroupType;
  status: GroupStatus;
  roles: string;
  userCount: number;
  description: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockUserGroups: UserGroup[] = [
  {
    id: 'ug-001',
    name: 'dev-admin-group',
    type: 'Custom',
    status: 'active',
    roles: 'admin (+3)',
    userCount: 100,
    description: 'Development team administrators',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'ug-002',
    name: 'ops-team',
    type: 'Custom',
    status: 'inactive',
    roles: 'network-admin (+1)',
    userCount: 25,
    description: 'Operations team',
    createdAt: 'Sep 10, 2025 01:17:01',
  },
  {
    id: 'ug-003',
    name: 'qa-team',
    type: 'Custom',
    status: 'active',
    roles: 'qa-lead (+2)',
    userCount: 15,
    description: 'Quality assurance team',
    createdAt: 'Sep 8, 2025 11:51:27',
  },
  {
    id: 'ug-004',
    name: 'viewers',
    type: 'Built-in',
    status: 'active',
    roles: 'Viewer (+3)',
    userCount: 130,
    description: '-',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'ug-005',
    name: 'administrators',
    type: 'Built-in',
    status: 'active',
    roles: 'super-admin',
    userCount: 5,
    description: 'System administrators',
    createdAt: 'Aug 1, 2025 10:20:28',
  },
  {
    id: 'ug-006',
    name: 'developers',
    type: 'Custom',
    status: 'active',
    roles: 'developer (+2)',
    userCount: 45,
    description: 'Development team',
    createdAt: 'Aug 15, 2025 12:22:26',
  },
  {
    id: 'ug-007',
    name: 'security-team',
    type: 'Custom',
    status: 'inactive',
    roles: 'security-admin',
    userCount: 8,
    description: 'Security operations',
    createdAt: 'Jul 20, 2025 23:27:51',
  },
  {
    id: 'ug-008',
    name: 'support-team',
    type: 'Custom',
    status: 'active',
    roles: 'support (+1)',
    userCount: 20,
    description: 'Customer support team',
    createdAt: 'Jul 10, 2025 01:17:01',
  },
  {
    id: 'ug-009',
    name: 'data-analysts',
    type: 'Custom',
    status: 'active',
    roles: 'analyst',
    userCount: 12,
    description: 'Data analysis team',
    createdAt: 'Jun 25, 2025 10:32:16',
  },
  {
    id: 'ug-010',
    name: 'external-users',
    type: 'Custom',
    status: 'inactive',
    roles: 'viewer',
    userCount: 50,
    description: 'External partners',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
];

const statusMap: Record<GroupStatus, StatusVariant> = {
  active: 'active',
  inactive: 'shutoff',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter group name...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'Built-in', label: 'Built-in' },
      { value: 'Custom', label: 'Custom' },
    ],
  },
  { key: 'roles', label: 'Roles', type: 'input', placeholder: 'Enter role name...' },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'userCount', label: 'Users', visible: true },
  { key: 'roles', label: 'Roles', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function IAMUserGroupsPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editDrawerData, setEditDrawerData] = useState({ name: '', description: '' });
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [manageUsersGroup, setManageUsersGroup] = useState('');
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [manageRolesGroup, setManageRolesGroup] = useState('');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filteredGroups = useMemo(() => {
    if (appliedFilters.length === 0) return mockUserGroups;
    return mockUserGroups.filter((group) =>
      appliedFilters.every((filter) => {
        const val = String(group[filter.key] ?? '').toLowerCase();
        return val.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasSelection = selectedRows.length > 0;

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
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'type', header: 'Type' },
    { key: 'userCount', header: 'Users' },
    { key: 'roles', header: 'Roles' },
    { key: 'createdAt', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Page Header */}
      <div className="flex items-center justify-between h-8">
        <Title title="User groups" />
        <Button variant="primary" size="md" onClick={() => navigate('/iam/user-groups/create')}>
          Create user group
        </Button>
      </div>

      {/* Toolbar: FilterSearchInput + Download | Delete */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search user groups by attributes"
            defaultFilterKey="name"
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
        totalCount={filteredGroups.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      {/* Table */}
      <SelectableTable<UserGroup>
        columns={columns}
        rows={paginatedGroups}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
      >
        {paginatedGroups.map((group) => (
          <Table.Tr key={group.id} rowData={group}>
            <Table.Td rowData={group} column={columns[0]}>
              <StatusIndicator variant={statusMap[group.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={group} column={columns[1]}>
              <Link
                to={`/iam/user-groups/${group.name}`}
                className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
              >
                {group.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={group} column={columns[2]}>
              {group.description}
            </Table.Td>
            <Table.Td rowData={group} column={columns[3]}>
              {group.type}
            </Table.Td>
            <Table.Td rowData={group} column={columns[4]}>
              {group.userCount}
            </Table.Td>
            <Table.Td rowData={group} column={columns[5]}>
              {group.roles}
            </Table.Td>
            <Table.Td rowData={group} column={columns[6]}>
              {group.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={group} column={columns[7]} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
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
                    setManageRolesGroup(group.name);
                    setManageRolesOpen(true);
                  }}
                  disabled={group.status === 'inactive'}
                >
                  Manage roles
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setManageUsersGroup(group.name);
                    setManageUsersOpen(true);
                  }}
                >
                  Manage users
                </ContextMenu.Item>
                {group.status === 'active' && (
                  <ContextMenu.Item action={() => console.log('Duplicate', group.id)}>
                    Duplicate
                  </ContextMenu.Item>
                )}
                <ContextMenu.Item
                  action={() => {
                    setEditDrawerData({ name: group.name, description: group.description });
                    setEditDrawerOpen(true);
                  }}
                  disabled={group.status === 'inactive'}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => console.log('Delete', group.id)}
                  danger={group.status === 'active'}
                  disabled={group.status === 'inactive'}
                >
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <EditUserGroupDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        initialData={editDrawerData}
      />
      <ManageUsersDrawer
        isOpen={manageUsersOpen}
        onClose={() => setManageUsersOpen(false)}
        userGroupName={manageUsersGroup}
      />
      <ManageRolesDrawer
        isOpen={manageRolesOpen}
        onClose={() => setManageRolesOpen(false)}
        userName={manageRolesGroup}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
