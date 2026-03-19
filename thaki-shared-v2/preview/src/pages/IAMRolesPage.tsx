import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface Role {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  policies: string;
  description: string;
  scope: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockRoles: Role[] = [
  { id: 'role-001', name: 'admin', type: 'Built-in', policies: 'FullAccess', description: 'Full administrative access', scope: 'Global', createdAt: 'Jun 1, 2025 10:20:28' },
  { id: 'role-002', name: 'compute-admin', type: 'Built-in', policies: 'ReadCompute (+3)', description: '-', scope: '-', createdAt: 'Sep 12, 2025 15:43:35' },
  { id: 'role-003', name: 'network-viewer', type: 'Built-in', policies: 'ViewNetwork (+1)', description: 'Read-only network access', scope: 'Project', createdAt: 'Jul 15, 2025 12:22:26' },
  { id: 'role-004', name: 'storage-manager', type: 'Custom', policies: 'ManageStorage (+2)', description: 'Storage management role', scope: 'Project', createdAt: 'Aug 20, 2025 23:27:51' },
  { id: 'role-005', name: 'developer', type: 'Custom', policies: 'DeveloperAccess', description: 'Developer access role', scope: 'Project', createdAt: 'Sep 1, 2025 10:20:28' },
  { id: 'role-006', name: 'qa-tester', type: 'Custom', policies: 'QAAccess (+1)', description: 'QA tester access', scope: 'Project', createdAt: 'Sep 5, 2025 14:12:36' },
  { id: 'role-007', name: 'security-admin', type: 'Built-in', policies: 'SecurityFullAccess', description: 'Security administration', scope: 'Global', createdAt: 'Jun 15, 2025 12:22:26' },
  { id: 'role-008', name: 'billing-viewer', type: 'Built-in', policies: 'ViewBilling', description: 'View billing information', scope: 'Organization', createdAt: 'Jul 1, 2025 10:20:28' },
  { id: 'role-009', name: 'support-agent', type: 'Custom', policies: 'SupportAccess (+2)', description: 'Customer support access', scope: 'Global', createdAt: 'Aug 10, 2025 01:17:01' },
  { id: 'role-010', name: 'read-only', type: 'Built-in', policies: 'ReadAll', description: 'Read-only access to all', scope: 'Project', createdAt: 'Jun 20, 2025 23:27:51' },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter role name...' },
  { key: 'type', label: 'Type', type: 'select', options: [
    { value: 'Built-in', label: 'Built-in' },
    { value: 'Custom', label: 'Custom' },
  ]},
  { key: 'policies', label: 'Policies', type: 'input', placeholder: 'Enter policy name...' },
  { key: 'scope', label: 'Scope', type: 'select', options: [
    { value: 'Global', label: 'Global' },
    { value: 'Project', label: 'Project' },
    { value: 'Organization', label: 'Organization' },
  ]},
];

export function IAMRolesPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  const filteredRoles = useMemo(() => {
    if (appliedFilters.length === 0) return mockRoles;
    return mockRoles.filter((role) =>
      appliedFilters.every((filter) => {
        const val = String(role[filter.key] ?? '').toLowerCase();
        return val.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'type', header: 'Type' },
    { key: 'policies', header: 'Policies' },
    { key: 'createdAt', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Page Header */}
      <div className="flex items-center justify-between h-8">
        <Title title="Roles" />
        <Button variant="primary" size="md">
          Create role
        </Button>
      </div>

      {/* Toolbar: FilterSearchInput + Download | Delete */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search roles by attributes"
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
              <span key={filter.id} className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border">
                <span className="flex items-center gap-1">
                  <span className="text-text">{filter.label}</span>
                  <span className="text-border">|</span>
                  <span className="text-text">{filter.displayValue ?? filter.value}</span>
                </span>
                <button type="button" className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none" onClick={() => handleFilterRemove(filter.id!)} aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}>
                  <IconX size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
          <button type="button" className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4" onClick={() => { setAppliedFilters([]); setCurrentPage(1); }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        totalCount={filteredRoles.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      {/* Table */}
      <SelectableTable<Role>
        columns={columns}
        rows={paginatedRoles}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
      >
        {paginatedRoles.map((role) => (
          <Table.Tr key={role.id} rowData={role}>
            <Table.Td rowData={role} column={columns[0]}>
              <Link to={`/iam/roles/${role.name}`} className="text-primary font-medium hover:underline">
                {role.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={role} column={columns[1]}>{role.description}</Table.Td>
            <Table.Td rowData={role} column={columns[2]}>{role.type}</Table.Td>
            <Table.Td rowData={role} column={columns[3]}>{role.policies}</Table.Td>
            <Table.Td rowData={role} column={columns[4]}>
              {role.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={role} column={columns[5]} preventClickPropagation>
              <ContextMenu.Root direction="bottom-end" gap={4}
                trigger={({ toggle }) => (
                  <button type="button" onClick={toggle} className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              >
                <ContextMenu.Item action={() => console.log('Manage policies', role.id)} disabled={role.type === 'Built-in'}>Manage policies</ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Duplicate', role.id)}>Duplicate</ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Edit', role.id)} disabled={role.type === 'Built-in'}>Edit</ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete', role.id)} danger={role.type !== 'Built-in'} disabled={role.type === 'Built-in'}>Delete</ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}
