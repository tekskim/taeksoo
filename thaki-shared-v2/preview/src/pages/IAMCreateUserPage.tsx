import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { RadioButton } from '@shared/components/RadioButton';
import { Toggle } from '@shared/components/Toggle';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { Title } from '@shared/components/Title';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface UserGroup {
  id: string;
  name: string;
  description: string;
  userCount: number;
  roles: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockUserGroups: UserGroup[] = [
  {
    id: 'ug-001',
    name: 'dev-admin-group',
    description: 'Development team administrators',
    userCount: 100,
    roles: 'admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'ug-002',
    name: 'ops-team',
    description: 'Operations team',
    userCount: 25,
    roles: 'network-admin (+1)',
    createdAt: 'Sep 10, 2025',
  },
  {
    id: 'ug-003',
    name: 'qa-team',
    description: 'Quality assurance team',
    userCount: 15,
    roles: 'qa-lead (+2)',
    createdAt: 'Sep 8, 2025',
  },
  {
    id: 'ug-004',
    name: 'viewers',
    description: 'Read-only viewers',
    userCount: 130,
    roles: 'Viewer (+3)',
    createdAt: 'Aug 1, 2025',
  },
  {
    id: 'ug-005',
    name: 'administrators',
    description: 'System administrators',
    userCount: 5,
    roles: 'super-admin',
    createdAt: 'Jul 15, 2025',
  },
  {
    id: 'ug-006',
    name: 'developers',
    description: 'Development team',
    userCount: 45,
    roles: 'developer (+2)',
    createdAt: 'Jun 20, 2025',
  },
  {
    id: 'ug-007',
    name: 'security-team',
    description: 'Security operations',
    userCount: 8,
    roles: 'security-admin',
    createdAt: 'May 10, 2025',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter group name...' },
];

export function IAMCreateUserPage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Basic info
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState(true);

  // Password
  const [passwordOption, setPasswordOption] = useState<'auto' | 'manual'>('auto');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // User groups
  const [selectedGroups, setSelectedGroups] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const usernameError = submitted && !username.trim() ? 'Username is required.' : null;
  const emailError = submitted && !email.trim() ? 'Email address is required.' : null;
  const passwordError =
    submitted && passwordOption === 'manual' && !password.trim() ? 'Password is required.' : null;
  const confirmError =
    submitted && passwordOption === 'manual' && password !== confirmPassword
      ? 'Passwords do not match.'
      : null;

  const canSubmit =
    !!username.trim() &&
    !!email.trim() &&
    (passwordOption === 'auto' || (!!password.trim() && password === confirmPassword));

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

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'userCount', header: 'Users', width: 80 },
    { key: 'roles', header: 'Roles' },
    { key: 'createdAt', header: 'Created at', width: 140 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between h-8">
        <Title title="Create user" />
        <Button
          appearance="ghost"
          variant="secondary"
          size="sm"
          onClick={() => navigate('/iam/users')}
        >
          Back
        </Button>
      </div>

      {/* Basic Information */}
      <div className="bg-surface border border-border rounded-base8">
        <div className="px-6 py-5">
          <div className="text-14 font-semibold text-text">Basic information</div>
          <div className="mt-4 grid grid-cols-12 gap-y-5 gap-x-6">
            <div className="col-span-4">
              <div className="text-12 font-medium text-text">
                Username <span className="text-error">*</span>
              </div>
              <div className="mt-1 text-11 text-text-muted">
                2-64 characters, alphanumeric and hyphens
              </div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. thaki-kim"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!usernameError}
              />
              {usernameError && (
                <span className="text-11 text-error mt-1 block">{usernameError}</span>
              )}
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">
                Password <span className="text-error">*</span>
              </div>
              <div className="mt-1 text-11 text-text-muted">
                Choose how to set the initial password
              </div>
            </div>
            <div className="col-span-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <RadioButton
                    name="passwordOption"
                    value="auto"
                    label="Auto-generated temporary password"
                    checked={passwordOption === 'auto'}
                    onChange={() => setPasswordOption('auto')}
                  />
                  <RadioButton
                    name="passwordOption"
                    value="manual"
                    label="Set password manually"
                    checked={passwordOption === 'manual'}
                    onChange={() => setPasswordOption('manual')}
                  />
                </div>
                {passwordOption === 'manual' && (
                  <div className="flex flex-col gap-3 p-4 border border-border-subtle rounded-md bg-surface-subtle">
                    <div className="flex flex-col gap-1">
                      <div className="text-11 font-medium text-text">Password</div>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          error={!!passwordError}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none cursor-pointer text-text-muted hover:text-text"
                        >
                          {showPassword ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                        </button>
                      </div>
                      {passwordError && <span className="text-11 text-error">{passwordError}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-11 font-medium text-text">Confirm password</div>
                      <div className="relative">
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          error={!!confirmError}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none cursor-pointer text-text-muted hover:text-text"
                        >
                          {showConfirm ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                        </button>
                      </div>
                      {confirmError && <span className="text-11 text-error">{confirmError}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">
                Email address <span className="text-error">*</span>
              </div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. user@thaki.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
              />
              {emailError && <span className="text-11 text-error mt-1 block">{emailError}</span>}
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Display name</div>
              <div className="mt-1 text-11 text-text-muted">Optional display name</div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. Thaki Kim"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Status</div>
            </div>
            <div className="col-span-8">
              <div className="flex items-center gap-2">
                <Toggle checked={status} onChange={() => setStatus(!status)} />
                <span className="text-12 text-text">{status ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add user to group */}
      <div className="bg-surface border border-border rounded-base8">
        <div className="px-6 py-5">
          <div className="text-14 font-semibold text-text">Add user to group</div>
          <div className="mt-1 text-12 text-text-muted">
            Select groups to add this user to. You can skip this step.
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <FilterSearchInput
              filterKeys={filterKeys}
              onFilterAdd={handleFilterAdd}
              selectedFilters={appliedFilters}
              placeholder="Search groups by name"
              defaultFilterKey="name"
            />

            <Pagination
              totalCount={filteredGroups.length}
              size={itemsPerPage}
              currentAt={currentPage}
              onPageChange={setCurrentPage}
              totalCountLabel="groups"
              selectedCount={selectedGroups.length}
            />

            <SelectableTable<UserGroup>
              columns={columns}
              rows={paginatedGroups}
              selectionType="checkbox"
              selectedRows={selectedGroups}
              onRowSelectionChange={setSelectedGroups}
              getRowId={(row) => row.id}
            >
              {paginatedGroups.map((group) => (
                <Table.Tr key={group.id} rowData={group}>
                  <Table.Td rowData={group} column={columns[0]}>
                    <span className="text-text font-medium">{group.name}</span>
                  </Table.Td>
                  <Table.Td rowData={group} column={columns[1]}>
                    {group.description}
                  </Table.Td>
                  <Table.Td rowData={group} column={columns[2]}>
                    {group.userCount}
                  </Table.Td>
                  <Table.Td rowData={group} column={columns[3]}>
                    {group.roles}
                  </Table.Td>
                  <Table.Td rowData={group} column={columns[4]}>
                    {group.createdAt}
                  </Table.Td>
                </Table.Tr>
              ))}
            </SelectableTable>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button
          appearance="outline"
          variant="secondary"
          size="md"
          onClick={() => navigate('/iam/users')}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setSubmitted(true);
            if (!canSubmit) return;
            setConfirmOpen(true);
          }}
        >
          Create
        </Button>
      </div>

      {confirmOpen && (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate('/iam/users');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create user',
            subtitle: 'This is UI-only. No actual user will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </div>
  );
}

export default IAMCreateUserPage;
