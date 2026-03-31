import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Tag } from '@shared/components/Tag';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { useDrawerAnimation } from '../hooks/useDrawerAnimation';

interface UserItem {
  id: string;
  username: string;
  status: 'active' | 'error' | 'muted';
  userGroups: string;
  roles: string;
  createdAt: string;
  hasWarning?: boolean;
  [key: string]: unknown;
}

export interface ManageUsersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userGroupName?: string;
  initialSelectedIds?: string[];
}

const statusMap: Record<string, StatusVariant> = {
  active: 'active',
  error: 'error',
  muted: 'shutoff',
};

const defaultUsers: UserItem[] = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `user-${i + 1}`,
    username: 'thaki-kim',
    status: 'active' as const,
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025 15:43:35',
  })),
  {
    id: 'user-9',
    username: 'thaki-kim',
    status: 'active' as const,
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025 15:43:35',
    hasWarning: true,
  },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `user-${i + 10}`,
    username: 'thaki-kim',
    status: 'active' as const,
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025 15:43:35',
  })),
];

const ITEMS_PER_PAGE = 5;

export function ManageUsersDrawer({
  isOpen,
  onClose,
  userGroupName = 'MemberGroup',
  initialSelectedIds = [],
}: ManageUsersDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([...initialSelectedIds]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRows([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const filteredUsers = useMemo(
    () =>
      defaultUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.userGroups.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.roles.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (selectedRows.length === 0) return;
    onClose();
  };

  const handleRemove = (id: string | number) => {
    setSelectedRows((prev) => prev.filter((r) => r !== id));
  };

  const selectedItems = defaultUsers.filter((u) => selectedRows.includes(u.id));

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 60, align: 'center' },
    { key: 'username', header: 'Username', sortable: true },
    { key: 'userGroups', header: 'User groups' },
    { key: 'roles', header: 'Roles' },
    { key: 'createdAt', header: 'Created at', sortable: true },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Manage users"
      description="Add or remove members of this user group. Users included in the group automatically receive the permissions assigned to the group."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="User group" values={[userGroupName]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Users</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">
              Select users to include in this group. All selected users will receive the group's
              assigned roles and policies.
            </p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by attributes"
              size="sm"
            />
          </div>

          <Pagination
            totalCount={filteredUsers.length}
            size={ITEMS_PER_PAGE}
            currentAt={currentPage}
            onPageChange={setCurrentPage}
            totalCountLabel="items"
          />

          <div className="flex flex-col gap-2 w-full">
            <SelectableTable<UserItem>
              columns={columns}
              rows={paginatedUsers}
              selectionType="checkbox"
              selectedRows={selectedRows}
              onRowSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              sort={sort}
              order={order}
              onSortChange={handleSortChange}
            >
              {paginatedUsers.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={columns[0]}>
                    <StatusIndicator
                      variant={statusMap[row.status] ?? 'active'}
                      layout="iconOnly"
                    />
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    <span className="text-primary font-medium">{row.username}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.userGroups}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.roles}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[4]}>
                    {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                  </Table.Td>
                </Table.Tr>
              ))}
            </SelectableTable>

            <div
              className={`flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border ${
                hasAttemptedSubmit && selectedRows.length === 0
                  ? 'border-danger bg-danger-light'
                  : 'border-border bg-surface-muted'
              }`}
            >
              {selectedItems.length === 0 ? (
                <span className="text-11 text-text-muted">No items selected</span>
              ) : (
                selectedItems.map((item) => (
                  <Tag
                    key={item.id}
                    label={item.username}
                    variant="multiSelect"
                    onClose={() => handleRemove(item.id)}
                  />
                ))
              )}
            </div>
            {hasAttemptedSubmit && selectedRows.length === 0 && (
              <p className="text-11 text-danger" role="alert">
                Please select at least one user.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
