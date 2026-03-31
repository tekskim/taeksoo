import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type TenantStatus = 'active' | 'deactivated' | 'building' | 'error';

interface Tenant extends Record<string, unknown> {
  id: string;
  name: string;
  status: TenantStatus;
  description: string;
}

const mockTenants: Tenant[] = [
  {
    id: '00000001',
    name: 'admin',
    status: 'active',
    description: 'System administration tenant',
  },
  {
    id: '00000002',
    name: 'demo-project',
    status: 'active',
    description: 'Demo workloads',
  },
  {
    id: '00000003',
    name: 'engineering',
    status: 'active',
    description: 'Engineering team resources',
  },
  {
    id: '00000004',
    name: 'production',
    status: 'active',
    description: 'Production workloads',
  },
  {
    id: '00000005',
    name: 'suspended-vendor',
    status: 'deactivated',
    description: 'Deactivated vendor sandbox',
  },
  {
    id: '00000006',
    name: 'qa-lab',
    status: 'building',
    description: 'QA automation environment',
  },
];

const tenantStatusMap: Record<TenantStatus, StatusVariant> = {
  active: 'active',
  deactivated: 'shutoff',
  building: 'building',
  error: 'error',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Filter by name...' },
  { key: 'id', label: 'ID', type: 'input', placeholder: 'Filter by ID...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'deactivated', label: 'Deactivated' },
      { value: 'building', label: 'Building' },
      { value: 'error', label: 'Error' },
    ],
  },
];

function rowMatchesFilter(row: Tenant, filter: FilterKeyWithValue): boolean {
  const raw = filter.value;
  if (raw === undefined || raw === null || raw === '') return true;
  const q = String(raw).toLowerCase();
  switch (filter.key) {
    case 'name':
      return row.name.toLowerCase().includes(q);
    case 'id':
      return row.id.toLowerCase().includes(q);
    case 'status':
      return row.status === filter.value;
    default:
      return true;
  }
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeAdminTenantsPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return mockTenants;
    return mockTenants.filter((row) => appliedFilters.every((f) => rowMatchesFilter(row, f)));
  }, [appliedFilters]);

  const pageRows = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasSelection = selectedRows.length > 0;

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: 72, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'description', header: 'Description', sortable: true },
      { key: 'actions', header: 'Action', width: 60, align: 'center', clickable: false },
    ],
    []
  );

  const c = (key: string) => columns.find((col) => col.key === key)!;

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Tenants" />
        <Button variant="primary" size="md">
          Create tenant
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search tenants by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
          <IconTrash size={12} /> Delete
        </Button>
      </div>

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
                  aria-label={`Remove ${filter.label}`}
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

      <Pagination
        totalCount={filtered.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<Tenant>
        columns={columns}
        rows={pageRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('status')}>
              <StatusIndicator variant={tenantStatusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/tenants/${row.id}`}
                  className={`${linkClass} truncate`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.name}
                </Link>
                <span className="text-11 text-text-muted">ID: {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={c('description')}>
              <span
                className="text-12 text-text truncate block max-w-[280px]"
                title={row.description}
              >
                {row.description}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    aria-label="Row actions"
                  >
                    <IconDotsCircleHorizontal size={16} stroke={1.5} />
                  </button>
                )}
              >
                <ContextMenu.Item action={() => console.log('edit', row.id)}>Edit</ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('manage quotas', row.id)}>
                  Manage quotas
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('manage members', row.id)}>
                  Manage members
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('delete', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
