import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Tag } from '@shared/components/Tag';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'disabled' | 'locked';
  lastSignIn: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'thaki-kim',
    email: 'thaki-kim@thaki.io',
    status: 'active',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-002',
    username: 'alex.johnson',
    email: 'alex.j@thaki.io',
    status: 'active',
    lastSignIn: 'Sep 11, 2025',
    createdAt: 'Aug 15, 2025',
  },
  {
    id: 'user-003',
    username: 'sara.connor',
    email: 'sara.c@thaki.io',
    status: 'active',
    lastSignIn: 'Sep 10, 2025',
    createdAt: 'Jul 20, 2025',
  },
  {
    id: 'user-004',
    username: 'john.doe',
    email: 'john.d@thaki.io',
    status: 'disabled',
    lastSignIn: 'Aug 1, 2025',
    createdAt: 'Jun 10, 2025',
  },
  {
    id: 'user-005',
    username: 'jane.smith',
    email: 'jane.s@thaki.io',
    status: 'active',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Jan 5, 2025',
  },
  {
    id: 'user-006',
    username: 'mike.wilson',
    email: 'mike.w@thaki.io',
    status: 'locked',
    lastSignIn: 'Sep 5, 2025',
    createdAt: 'Apr 18, 2025',
  },
  {
    id: 'user-007',
    username: 'emily.chen',
    email: 'emily.c@thaki.io',
    status: 'active',
    lastSignIn: 'Sep 11, 2025',
    createdAt: 'Mar 22, 2025',
  },
  {
    id: 'user-008',
    username: 'david.lee',
    email: 'david.l@thaki.io',
    status: 'active',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Feb 14, 2025',
  },
  {
    id: 'user-009',
    username: 'lisa.park',
    email: 'lisa.p@thaki.io',
    status: 'disabled',
    lastSignIn: 'Jul 15, 2025',
    createdAt: 'May 30, 2025',
  },
  {
    id: 'user-010',
    username: 'chris.taylor',
    email: 'chris.t@thaki.io',
    status: 'active',
    lastSignIn: 'Sep 12, 2025',
    createdAt: 'Jan 28, 2025',
  },
];

const statusMap: Record<User['status'], StatusVariant> = {
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
];

const STEP_IDS = ['basic', 'users'] as const;

export function IAMCreateUserGroupPage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    users: 'default',
  });

  const nameError = submitted && !groupName.trim() ? 'Group name is required.' : null;

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

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const validateBasicInfo = useCallback((): boolean => {
    setSubmitted(true);
    return !!groupName.trim();
  }, [groupName]);

  const handleStepChange = useCallback(
    ({ current }: { prev: string | number; current: string | number }) => {
      setStepStatuses((prev) => {
        const next = { ...prev };
        for (const id of STEP_IDS) {
          if (id === current) {
            next[id] = 'processing';
          } else if (prev[id] === 'processing') {
            next[id] = 'writing';
          }
        }
        return next;
      });
    },
    []
  );

  const handleAllComplete = useCallback(() => {
    setAllComplete(true);
    setStepStatuses((prev) => {
      const next = { ...prev };
      for (const id of STEP_IDS) next[id] = 'success';
      return next;
    });
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    { key: 'lastSignIn', header: 'Last sign-in' },
    { key: 'createdAt', header: 'Created at' },
  ];

  return (
    <CreateLayout
      title="Create user group"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Add users to the group', status: stepStatuses.users },
              ],
            },
          ]}
          onCancel={() => navigate('/iam/user-groups')}
          onAction={() => {
            setSubmitted(true);
            if (!groupName.trim()) return;
            setConfirmOpen(true);
          }}
          actionEnabled={allComplete}
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      <Stepper
        stepIds={STEP_IDS}
        defaultOpenedId="basic"
        onAllStepsCompleted={handleAllComplete}
        onStepChange={handleStepChange}
      >
        {[
          {
            id: 'basic' as const,
            label: 'Basic information',
            onComplete: validateBasicInfo,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Group name <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Enter a unique name for the user group. This will be used to identify the
                        group across the system.
                      </span>
                    </div>
                    <Input
                      placeholder="e.g. dev-admin-group"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      error={!!nameError}
                    />
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (-_.), and the length
                      must be between 3-64 characters.
                    </span>
                    {nameError && <span className="text-11 text-error">{nameError}</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Description</span>
                      <span className="text-12 text-text-muted">Optional group description</span>
                    </div>
                    <Input
                      placeholder="e.g. Development team administrators"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (+=,.@-_()[]), and
                      maximum 255 characters.
                    </span>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Group name</span>
                  <span className="text-12 text-text">{groupName}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Description</span>
                  <span className="text-12 text-text">{description || '-'}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'users' as const,
            label: 'Add users to the group',
            skippable: true,
            editUI: (
              <div className="flex flex-col gap-3">
                <span className="text-12 text-text-muted">
                  Select users to include in this group. All selected users will receive the
                  group&apos;s assigned roles and policies.
                </span>

                <FilterSearchInput
                  filterKeys={filterKeys}
                  onFilterAdd={handleFilterAdd}
                  selectedFilters={appliedFilters}
                  placeholder="Search users by attributes"
                  defaultFilterKey="username"
                />

                <Pagination
                  totalCount={filteredUsers.length}
                  size={itemsPerPage}
                  currentAt={currentPage}
                  onPageChange={setCurrentPage}
                  totalCountLabel="users"
                  selectedCount={selectedUsers.length}
                />

                <SelectableTable<User>
                  columns={columns}
                  rows={paginatedUsers}
                  selectionType="checkbox"
                  selectedRows={selectedUsers}
                  onRowSelectionChange={setSelectedUsers}
                  getRowId={(row) => row.id}
                >
                  {paginatedUsers.map((user) => (
                    <Table.Tr key={user.id} rowData={user}>
                      <Table.Td rowData={user} column={columns[0]}>
                        <StatusIndicator variant={statusMap[user.status]} layout="iconOnly" />
                      </Table.Td>
                      <Table.Td rowData={user} column={columns[1]}>
                        <span className="text-text font-medium">{user.username}</span>
                      </Table.Td>
                      <Table.Td rowData={user} column={columns[2]}>
                        {user.email}
                      </Table.Td>
                      <Table.Td rowData={user} column={columns[3]}>
                        {user.lastSignIn}
                      </Table.Td>
                      <Table.Td rowData={user} column={columns[4]}>
                        {user.createdAt}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </SelectableTable>

                <div className="flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border border-border bg-surface-muted">
                  {selectedUsers.length === 0 ? (
                    <span className="text-11 text-text-muted">No users selected</span>
                  ) : (
                    selectedUsers.map((userId) => {
                      const user = mockUsers.find((u) => u.id === String(userId));
                      return (
                        <Tag
                          key={String(userId)}
                          label={user?.username || String(userId)}
                          variant="multiSelect"
                          onClose={() =>
                            setSelectedUsers(selectedUsers.filter((id) => id !== userId))
                          }
                        />
                      );
                    })
                  )}
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Selected users</span>
                  <span className="text-12 text-text">
                    {selectedUsers.length > 0
                      ? `${selectedUsers.length} user(s) selected`
                      : 'Skipped — no users selected'}
                  </span>
                </div>
              </div>
            ),
          },
        ]}
      </Stepper>

      {confirmOpen && (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate('/iam/user-groups');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create user group',
            subtitle: 'This is UI-only. No actual group will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}

export default IAMCreateUserGroupPage;
