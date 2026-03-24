import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { RadioButton } from '@shared/components/RadioButton';
import { Toggle } from '@shared/components/Toggle';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Tag } from '@shared/components/Tag';
import { IconEye, IconEyeOff, IconExternalLink } from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

interface UserGroup {
  id: string;
  name: string;
  type: string;
  userCount: number;
  roles: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockUserGroups: UserGroup[] = [
  {
    id: 'ug-001',
    name: 'Users',
    type: 'Built-in',
    userCount: 130,
    roles: 'ReadCompute (+3)',
    createdAt: 'Sep 12, 2025 08:15:22',
  },
  {
    id: 'ug-002',
    name: 'Admins',
    type: 'Built-in',
    userCount: 130,
    roles: 'ReadCompute (+3)',
    createdAt: 'Sep 12, 2025 09:32:44',
  },
  {
    id: 'ug-003',
    name: 'Members',
    type: 'Built-in',
    userCount: 45,
    roles: 'ReadCompute (+2)',
    createdAt: 'Sep 10, 2025 14:20:00',
  },
  {
    id: 'ug-004',
    name: 'Operators',
    type: 'Built-in',
    userCount: 25,
    roles: 'NetworkAdmin (+1)',
    createdAt: 'Aug 1, 2025 10:00:00',
  },
  {
    id: 'ug-005',
    name: 'dev-admin-group',
    type: 'Custom',
    userCount: 100,
    roles: 'admin (+3)',
    createdAt: 'Jul 15, 2025 08:30:00',
  },
  {
    id: 'ug-006',
    name: 'ops-team',
    type: 'Custom',
    userCount: 8,
    roles: 'network-admin (+1)',
    createdAt: 'Jun 20, 2025 11:45:00',
  },
  {
    id: 'ug-007',
    name: 'security-team',
    type: 'Custom',
    userCount: 5,
    roles: 'security-admin',
    createdAt: 'May 10, 2025 09:15:00',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter group name...' },
];

const STEP_IDS = ['basic', 'group'] as const;

export function IAMCreateUserPage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

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

  // Stepper -> FloatingCard sync
  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    group: 'default',
  });

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

  const validateBasicInfo = useCallback((): boolean => {
    setSubmitted(true);
    return canSubmit;
  }, [canSubmit]);

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
    { key: 'name', header: 'User group name' },
    { key: 'type', header: 'Type', width: 100 },
    { key: 'roles', header: 'Roles' },
    { key: 'userCount', header: 'User count', width: 100 },
    { key: 'createdAt', header: 'Created at', width: 180 },
  ];

  return (
    <CreateLayout
      title="Create user"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Add user to group', status: stepStatuses.group },
              ],
            },
          ]}
          onCancel={() => navigate('/iam/users')}
          onAction={() => {
            setSubmitted(true);
            if (!canSubmit) return;
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
                {/* Username */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Username <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        This is the user's unique identifier for signing in. It cannot be changed
                        once created.
                      </span>
                    </div>
                    <Input
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      error={!!usernameError}
                    />
                    {usernameError && <span className="text-11 text-error">{usernameError}</span>}
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (-_.), and the length
                      must be between 3-64 characters.
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Password */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Password <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Choose how to set the initial password for the user account.
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <RadioButton
                          name="passwordOption"
                          value="auto"
                          label="Issue a temporary password (email sent automatically)"
                          checked={passwordOption === 'auto'}
                          onChange={() => setPasswordOption('auto')}
                        />
                        <RadioButton
                          name="passwordOption"
                          value="manual"
                          label="Set password manually (no email sent)"
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
                            {passwordError && (
                              <span className="text-11 text-error">{passwordError}</span>
                            )}
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
                            {confirmError && (
                              <span className="text-11 text-error">{confirmError}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Email */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Email address <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        The email address used for user invitations and notifications.
                      </span>
                    </div>
                    <Input
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!emailError}
                    />
                    {emailError && <span className="text-11 text-error">{emailError}</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Display name */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Display name</span>
                      <span className="text-12 text-text-muted">
                        This is the user's display name. If left blank, the username will be shown
                        instead.
                      </span>
                    </div>
                    <Input
                      placeholder="Enter display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Status */}
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Status</span>
                      <span className="text-12 text-text-muted">
                        Select the user's status. If 'Disabled', the user will be prevented from
                        signing in.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle checked={status} onChange={() => setStatus(!status)} />
                      <span className="text-12 text-text">{status ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Username</span>
                  <span className="text-12 text-text">{username || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Password</span>
                  <span className="text-12 text-text">
                    {passwordOption === 'auto' ? 'Auto-generated' : 'Manually set'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Email</span>
                  <span className="text-12 text-text">{email}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Display name</span>
                  <span className="text-12 text-text">{displayName || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Status</span>
                  <span className="text-12 text-text">{status ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'group' as const,
            label: 'Add user to group',
            skippable: true,
            editUI: (
              <div className="py-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-13 font-medium text-text">User groups</span>
                    <span className="text-12 text-text-muted">
                      Select the user groups this user will belong to. Users will automatically
                      inherit the permissions assigned to their groups.
                    </span>
                  </div>

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
                          <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                            {group.name}
                            <IconExternalLink size={12} />
                          </span>
                        </Table.Td>
                        <Table.Td rowData={group} column={columns[1]}>
                          {group.type}
                        </Table.Td>
                        <Table.Td rowData={group} column={columns[2]}>
                          {group.roles}
                        </Table.Td>
                        <Table.Td rowData={group} column={columns[3]}>
                          {group.userCount}
                        </Table.Td>
                        <Table.Td rowData={group} column={columns[4]}>
                          {group.createdAt}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </SelectableTable>

                  <div
                    className={`flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border ${
                      selectedGroups.length === 0
                        ? 'border-border bg-surface-muted'
                        : 'border-border bg-surface-muted'
                    }`}
                  >
                    {selectedGroups.length === 0 ? (
                      <span className="text-11 text-text-muted">No groups selected</span>
                    ) : (
                      selectedGroups.map((groupId) => {
                        const group = mockUserGroups.find((g) => g.id === String(groupId));
                        return (
                          <Tag
                            key={String(groupId)}
                            label={group?.name || String(groupId)}
                            variant="multiSelect"
                            onClose={() =>
                              setSelectedGroups(selectedGroups.filter((id) => id !== groupId))
                            }
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Selected groups</span>
                  <span className="text-12 text-text">
                    {selectedGroups.length > 0
                      ? `${selectedGroups.length} group(s) selected`
                      : 'Skipped — no groups selected'}
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
    </CreateLayout>
  );
}

export default IAMCreateUserPage;
