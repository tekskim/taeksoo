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
import { Fieldset } from '@shared/components/Fieldset';
import Layout from '@shared/components/Layout';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

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

export function IAMCreateRolePage() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const [selectedPolicies, setSelectedPolicies] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const nameError = submitted && !roleName.trim() ? 'Role name is required.' : null;
  const basicInfoFilled = !!roleName.trim();

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
                { label: 'Basic information', status: basicInfoFilled ? 'success' : undefined },
                {
                  label: 'Attach policies',
                  status: selectedPolicies.length > 0 ? 'success' : undefined,
                },
              ],
            },
          ]}
          onCancel={() => navigate('/iam/roles')}
          onAction={() => {
            setSubmitted(true);
            if (!roleName.trim()) return;
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
                Role name <span className="text-error">*</span>
              </div>
              <div className="mt-1 text-11 text-text-muted">2-64 characters</div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. compute-admin"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                error={!!nameError}
              />
              {nameError && <span className="text-11 text-error mt-1 block">{nameError}</span>}
            </div>

            <div className="col-span-4">
              <div className="text-12 font-medium text-text">Description</div>
              <div className="mt-1 text-11 text-text-muted">Optional role description</div>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. Admin access to compute resources"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset
          legend="Attach policies"
          description="Select policies to attach to this role. You can skip this step."
          variant="bordered"
          active
        >
          <div className="flex flex-col gap-3">
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
          </div>
        </Fieldset>
      </Layout.VStack>

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
