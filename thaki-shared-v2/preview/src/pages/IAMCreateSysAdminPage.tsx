import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { RadioButton } from '@shared/components/RadioButton';
import { Toggle } from '@shared/components/Toggle';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Tag } from '@shared/components/Tag';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

interface Domain {
  id: string;
  name: string;
  status: 'active';
  userCount: number;
  createdAt: string;
  [key: string]: unknown;
}

const mockDomains: Domain[] = [
  {
    id: 'dom-001',
    name: 'thaki-prod',
    status: 'active',
    userCount: 245,
    createdAt: 'Jan 10, 2025',
  },
  {
    id: 'dom-002',
    name: 'thaki-stage',
    status: 'active',
    userCount: 52,
    createdAt: 'Feb 15, 2025',
  },
  { id: 'dom-003', name: 'thaki-dev', status: 'active', userCount: 38, createdAt: 'Mar 1, 2025' },
  { id: 'dom-004', name: 'thaki-lab', status: 'active', userCount: 15, createdAt: 'Apr 20, 2025' },
  {
    id: 'dom-005',
    name: 'partner-corp',
    status: 'active',
    userCount: 20,
    createdAt: 'May 5, 2025',
  },
  { id: 'dom-006', name: 'testing-env', status: 'active', userCount: 8, createdAt: 'Jun 12, 2025' },
  { id: 'dom-007', name: 'sandbox', status: 'active', userCount: 3, createdAt: 'Jul 1, 2025' },
  { id: 'dom-008', name: 'demo', status: 'active', userCount: 10, createdAt: 'Aug 10, 2025' },
  {
    id: 'dom-009',
    name: 'backup-domain',
    status: 'active',
    userCount: 5,
    createdAt: 'Sep 1, 2025',
  },
  { id: 'dom-010', name: 'dr-site', status: 'active', userCount: 12, createdAt: 'Sep 5, 2025' },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter domain name...' },
];

const STEP_IDS = ['basic', 'domain'] as const;

export function IAMCreateSysAdminPage() {
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

  // Domain (single selection)
  const [selectedDomain, setSelectedDomain] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Stepper -> FloatingCard sync
  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    domain: 'default',
  });

  const usernameError = submitted && !username.trim() ? 'Username is required.' : null;
  const emailError = submitted && !email.trim() ? 'Email address is required.' : null;
  const domainError =
    submitted && selectedDomain.length === 0 ? 'Please select a default domain.' : null;
  const passwordError =
    submitted && passwordOption === 'manual' && !password.trim() ? 'Password is required.' : null;
  const confirmError =
    submitted && passwordOption === 'manual' && password !== confirmPassword
      ? 'Passwords do not match.'
      : null;

  const canBasicSubmit =
    !!username.trim() &&
    !!email.trim() &&
    (passwordOption === 'auto' || (!!password.trim() && password === confirmPassword));

  const canSubmit =
    !!username.trim() &&
    !!email.trim() &&
    selectedDomain.length > 0 &&
    (passwordOption === 'auto' || (!!password.trim() && password === confirmPassword));

  const filteredDomains = useMemo(() => {
    if (appliedFilters.length === 0) return mockDomains;
    return mockDomains.filter((domain) =>
      appliedFilters.every((filter) => {
        const val = String(domain[filter.key] ?? '').toLowerCase();
        return val.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const validateBasicInfo = useCallback((): boolean => {
    setSubmitted(true);
    return canBasicSubmit;
  }, [canBasicSubmit]);

  const validateDomain = useCallback((): boolean => {
    setSubmitted(true);
    return selectedDomain.length > 0;
  }, [selectedDomain]);

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
    { key: 'name', header: 'Name' },
    { key: 'userCount', header: 'Users', width: 80 },
    { key: 'createdAt', header: 'Created at', width: 140 },
  ];

  const selectedDomainRow = useMemo(() => {
    if (selectedDomain.length === 0) return undefined;
    return mockDomains.find((d) => d.id === String(selectedDomain[0]));
  }, [selectedDomain]);

  return (
    <CreateLayout
      title="Create account"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Default domain', status: stepStatuses.domain },
              ],
            },
          ]}
          onCancel={() => navigate('/iam/system-administrators')}
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
                        This is the account&apos;s unique identifier for signing in. It cannot be
                        changed once created.
                      </span>
                    </div>
                    <Input
                      placeholder="e.g. admin-user"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      error={!!usernameError}
                    />
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (-_.), and the length
                      must be between 3-64 characters.
                    </span>
                    {usernameError && <span className="text-11 text-error">{usernameError}</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Temporary password */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Temporary password <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        The temporary password will be valid for 7 days. The account holder must
                        sign in and change the password within this period.
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <RadioButton
                          name="passwordOption"
                          value="auto"
                          label="Auto-generated password"
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
                      placeholder="e.g. admin@thaki.io"
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
                        This is the user&apos;s display name. If left blank, the username will be
                        shown instead.
                      </span>
                    </div>
                    <Input
                      placeholder="e.g. Admin User"
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
                        Select the user&apos;s status. If &apos;Disabled&apos;, the user will be
                        prevented from signing in.
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
            id: 'domain' as const,
            label: 'Default domain',
            onComplete: validateDomain,
            editUI: (
              <div className="flex flex-col gap-3">
                <span className="text-12 text-text-muted">
                  Defines which domain is opened first when the administrator signs in. The selected
                  domain is used as the initial workspace.
                </span>

                <FilterSearchInput
                  filterKeys={filterKeys}
                  onFilterAdd={handleFilterAdd}
                  selectedFilters={appliedFilters}
                  placeholder="Search domains by name"
                  defaultFilterKey="name"
                />

                <Pagination
                  totalCount={filteredDomains.length}
                  size={itemsPerPage}
                  currentAt={currentPage}
                  onPageChange={setCurrentPage}
                  totalCountLabel="domains"
                  selectedCount={selectedDomain.length}
                />

                <SelectableTable<Domain>
                  columns={columns}
                  rows={paginatedDomains}
                  selectionType="radio"
                  selectedRows={selectedDomain}
                  onRowSelectionChange={setSelectedDomain}
                  getRowId={(row) => row.id}
                  selectOnRowClick
                >
                  {paginatedDomains.map((domain) => (
                    <Table.Tr key={domain.id} rowData={domain}>
                      <Table.Td rowData={domain} column={columns[0]}>
                        <StatusIndicator variant="active" layout="iconOnly" />
                      </Table.Td>
                      <Table.Td rowData={domain} column={columns[1]}>
                        <span className="text-text font-medium">{domain.name}</span>
                      </Table.Td>
                      <Table.Td rowData={domain} column={columns[2]}>
                        {domain.userCount}
                      </Table.Td>
                      <Table.Td rowData={domain} column={columns[3]}>
                        {domain.createdAt}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </SelectableTable>

                <div
                  className={`flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border ${
                    domainError ? 'border-danger bg-danger-light' : 'border-border bg-surface-muted'
                  }`}
                >
                  {selectedDomain.length === 0 ? (
                    <span className="text-11 text-text-muted">
                      {domainError || 'No domain selected'}
                    </span>
                  ) : (
                    (() => {
                      const domain = mockDomains.find((d) => d.id === String(selectedDomain[0]));
                      return (
                        <Tag
                          label={domain?.name || String(selectedDomain[0])}
                          variant="multiSelect"
                          onClose={() => setSelectedDomain([])}
                        />
                      );
                    })()
                  )}
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Default domain</span>
                  <span className="text-12 text-text">
                    {selectedDomainRow ? selectedDomainRow.name : 'No domain selected'}
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
            navigate('/iam/system-administrators');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create account',
            subtitle: 'This is UI-only. No actual account will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}

export default IAMCreateSysAdminPage;
