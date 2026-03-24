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
import { Fieldset } from '@shared/components/Fieldset';
import Layout from '@shared/components/Layout';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

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

export function IAMCreateUserGroupPage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const nameError = submitted && !groupName.trim() ? 'Group name is required.' : null;
  const basicInfoFilled = !!groupName.trim();

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
                { label: 'Basic information', status: basicInfoFilled ? 'success' : undefined },
                {
                  label: 'Add users to the group',
                  status: selectedUsers.length > 0 ? 'success' : undefined,
                },
              ],
            },
          ]}
          onCancel={() => navigate('/iam/user-groups')}
          onAction={() => {
            setSubmitted(true);
            if (!groupName.trim()) return;
            setConfirmOpen(true);
          }}
          actionEnabled
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      <Layout.VStack gap="md">
        <Fieldset legend="Basic information" variant="bordered" active>
          <div className="grid grid-cols-12 gap-y-5 gap-x-6">
            <div className="col-span-4">
              <div className="text-12 font-medium text-text">
                Group name <span className="text-error">*</span>
              </div>
              <div className="mt-1 text-11 text-text-muted">2-64 characters</div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. dev-admin-group"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                error={!!nameError}
              />
              {nameError && <span className="text-11 text-error mt-1 block">{nameError}</span>}
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Description</div>
              <div className="mt-1 text-11 text-text-muted">Optional group description</div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. Development team administrators"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset
          legend="Add users to the group"
          description="Select users to add to this group. You can skip this step."
          variant="bordered"
          active
        >
          <div className="flex flex-col gap-3">
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
          </div>
        </Fieldset>
      </Layout.VStack>

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
