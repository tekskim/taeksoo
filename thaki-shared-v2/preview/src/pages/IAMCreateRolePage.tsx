import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Badge } from '@shared/components/Badge';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Tag } from '@shared/components/Tag';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

interface Policy {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  description: string;
  apps: string;
  editedAt: string;
  [key: string]: unknown;
}

const mockPolicies: Policy[] = [
  {
    id: 'pol-001',
    name: 'AdminFullAccess',
    type: 'Built-in',
    description: 'Full access to all resources',
    apps: 'All',
    editedAt: 'Sep 12, 2025',
  },
  {
    id: 'pol-002',
    name: 'ComputeAdmin',
    type: 'Built-in',
    description: 'Full access to compute resources',
    apps: 'Compute',
    editedAt: 'Sep 10, 2025',
  },
  {
    id: 'pol-003',
    name: 'NetworkReadOnly',
    type: 'Custom',
    description: 'Read-only access to network',
    apps: 'Network',
    editedAt: 'Sep 8, 2025',
  },
  {
    id: 'pol-004',
    name: 'StorageAdmin',
    type: 'Built-in',
    description: 'Full access to storage resources',
    apps: 'Storage',
    editedAt: 'Aug 20, 2025',
  },
  {
    id: 'pol-005',
    name: 'IAMAdmin',
    type: 'Built-in',
    description: 'Full access to IAM resources',
    apps: 'IAM',
    editedAt: 'Aug 15, 2025',
  },
  {
    id: 'pol-006',
    name: 'ViewerAccess',
    type: 'Built-in',
    description: 'Read-only access to all resources',
    apps: 'All',
    editedAt: 'Jul 30, 2025',
  },
  {
    id: 'pol-007',
    name: 'ContainerDeveloper',
    type: 'Custom',
    description: 'Developer access to container',
    apps: 'Container',
    editedAt: 'Jul 20, 2025',
  },
  {
    id: 'pol-008',
    name: 'SecurityAuditor',
    type: 'Custom',
    description: 'Audit access to security logs',
    apps: 'IAM, Compute',
    editedAt: 'Jul 10, 2025',
  },
  {
    id: 'pol-009',
    name: 'BillingViewer',
    type: 'Custom',
    description: 'Read-only access to billing',
    apps: 'Billing',
    editedAt: 'Jun 25, 2025',
  },
  {
    id: 'pol-010',
    name: 'DatabaseAdmin',
    type: 'Custom',
    description: 'Full access to database resources',
    apps: 'Database',
    editedAt: 'Jun 15, 2025',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter policy name...' },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'Built-in', label: 'Built-in' },
      { value: 'Custom', label: 'Custom' },
    ],
  },
];

const STEP_IDS = ['basic', 'policies'] as const;

export function IAMCreateRolePage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const [selectedPolicies, setSelectedPolicies] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    policies: 'default',
  });

  const nameError = submitted && !roleName.trim() ? 'Role name is required.' : null;

  const filteredPolicies = useMemo(() => {
    if (appliedFilters.length === 0) return mockPolicies;
    return mockPolicies.filter((policy) =>
      appliedFilters.every((filter) => {
        const val = String(policy[filter.key] ?? '').toLowerCase();
        return val.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const validateBasicInfo = useCallback((): boolean => {
    setSubmitted(true);
    return !!roleName.trim();
  }, [roleName]);

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
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type', width: 100 },
    { key: 'apps', header: 'Apps', width: 120 },
    { key: 'description', header: 'Description' },
    { key: 'editedAt', header: 'Edited at', width: 140 },
  ];

  return (
    <CreateLayout
      title="Create role"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Attach policies', status: stepStatuses.policies },
              ],
            },
          ]}
          onCancel={() => navigate('/iam/roles')}
          onAction={() => {
            setSubmitted(true);
            if (!roleName.trim()) return;
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
                        Role name <span className="text-error">*</span>
                      </span>
                      <span className="text-11 text-text-subtle">
                        You can use letters, numbers, and special characters (+=,.@-_), and the
                        length must be between 2-128 characters.
                      </span>
                    </div>
                    <Input
                      placeholder="e.g. compute-admin"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      error={!!nameError}
                    />
                    {nameError && <span className="text-11 text-error">{nameError}</span>}
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Description</span>
                      <span className="text-12 text-text-muted">Optional role description</span>
                    </div>
                    <Input
                      placeholder="e.g. Admin access to compute resources"
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
                  <span className="text-11 font-medium text-text-muted">Role name</span>
                  <span className="text-12 text-text">{roleName}</span>
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
            id: 'policies' as const,
            label: 'Attach policies',
            skippable: true,
            editUI: (
              <div className="flex flex-col gap-3">
                <span className="text-12 text-text-muted">
                  Select policies to apply to this role. If policies include conditions, all
                  conditions must be satisfied for the permission to be granted.
                </span>

                <FilterSearchInput
                  filterKeys={filterKeys}
                  onFilterAdd={handleFilterAdd}
                  selectedFilters={appliedFilters}
                  placeholder="Search policies by attributes"
                  defaultFilterKey="name"
                />

                <Pagination
                  totalCount={filteredPolicies.length}
                  size={itemsPerPage}
                  currentAt={currentPage}
                  onPageChange={setCurrentPage}
                  totalCountLabel="policies"
                  selectedCount={selectedPolicies.length}
                />

                <SelectableTable<Policy>
                  columns={columns}
                  rows={paginatedPolicies}
                  selectionType="checkbox"
                  selectedRows={selectedPolicies}
                  onRowSelectionChange={setSelectedPolicies}
                  getRowId={(row) => row.id}
                >
                  {paginatedPolicies.map((policy) => (
                    <Table.Tr key={policy.id} rowData={policy}>
                      <Table.Td rowData={policy} column={columns[0]}>
                        <span className="text-text font-medium">{policy.name}</span>
                      </Table.Td>
                      <Table.Td rowData={policy} column={columns[1]}>
                        <Badge
                          theme={policy.type === 'Built-in' ? 'blu' : 'gry'}
                          type="subtle"
                          size="sm"
                        >
                          {policy.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td rowData={policy} column={columns[2]}>
                        {policy.apps}
                      </Table.Td>
                      <Table.Td rowData={policy} column={columns[3]}>
                        {policy.description}
                      </Table.Td>
                      <Table.Td rowData={policy} column={columns[4]}>
                        {policy.editedAt}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </SelectableTable>

                <div className="flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border border-border bg-surface-muted">
                  {selectedPolicies.length === 0 ? (
                    <span className="text-11 text-text-muted">No policies selected</span>
                  ) : (
                    selectedPolicies.map((policyId) => {
                      const policy = mockPolicies.find((p) => p.id === String(policyId));
                      return (
                        <Tag
                          key={String(policyId)}
                          label={policy?.name || String(policyId)}
                          variant="multiSelect"
                          onClose={() =>
                            setSelectedPolicies(selectedPolicies.filter((id) => id !== policyId))
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
                  <span className="text-11 font-medium text-text-muted">Selected policies</span>
                  <span className="text-12 text-text">
                    {selectedPolicies.length > 0
                      ? `${selectedPolicies.length} polic${selectedPolicies.length === 1 ? 'y' : 'ies'} selected`
                      : 'Skipped'}
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
            navigate('/iam/roles');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create role',
            subtitle: 'This is UI-only. No actual role will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}

export default IAMCreateRolePage;
