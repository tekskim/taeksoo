import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import {
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

export interface PodDisruptionBudgetRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  minAvailable: string;
  maxUnavailable: string;
  allowedDisruption: string;
  createdAt: string;
  [key: string]: unknown;
}

const pdbData: PodDisruptionBudgetRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'frontend-web-deployment-disruption-budget-policy',
    namespace: 'default',
    minAvailable: '1',
    maxUnavailable: 'N/A',
    allowedDisruption: '0',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '2',
    status: 'True',
    name: 'frontend-web-production-minimum-availability-pdb',
    namespace: 'production',
    minAvailable: '2',
    maxUnavailable: 'N/A',
    allowedDisruption: '1',
    createdAt: 'Nov 9, 2025 18:04:44',
  },
  {
    id: '3',
    status: 'None',
    name: 'backend-api-minimum-availability-disruption-budget',
    namespace: 'kube-system',
    minAvailable: 'N/A',
    maxUnavailable: '1',
    allowedDisruption: '2',
    createdAt: 'Nov 8, 2025 11:51:27',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'database-primary-replication-disruption-budget',
    namespace: 'staging',
    minAvailable: '50%',
    maxUnavailable: 'N/A',
    allowedDisruption: '0',
    createdAt: 'Nov 7, 2025 04:38:10',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'cache-redis-cluster-disruption-budget-policy',
    namespace: 'monitoring',
    minAvailable: 'N/A',
    maxUnavailable: '25%',
    allowedDisruption: '1',
    createdAt: 'Nov 6, 2025 21:25:53',
  },
];

const INITIAL_FILTERS: FilterKeyWithValue[] = [
  {
    id: 'initial-name',
    key: 'name',
    label: 'Name',
    type: 'input',
    value: 'a',
    displayValue: 'a',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'namespace', label: 'Namespace', type: 'input', placeholder: 'Enter namespace...' },
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
  {
    key: 'minAvailable',
    label: 'Min available',
    type: 'input',
    placeholder: 'Enter min available...',
  },
  {
    key: 'maxUnavailable',
    label: 'Max unavailable',
    type: 'input',
    placeholder: 'Enter max unavailable...',
  },
  {
    key: 'allowedDisruption',
    label: 'Allowed disruption',
    type: 'input',
    placeholder: 'Enter allowed disruption...',
  },
  { key: 'createdAt', label: 'Created at', type: 'input', placeholder: 'Enter created at...' },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

const ROW_FILTER_FIELD_KEYS: (keyof PodDisruptionBudgetRow)[] = [
  'id',
  'status',
  'name',
  'namespace',
  'minAvailable',
  'maxUnavailable',
  'allowedDisruption',
  'createdAt',
];

function rowMatches(row: PodDisruptionBudgetRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const k = filter.key as keyof PodDisruptionBudgetRow;
  if (ROW_FILTER_FIELD_KEYS.includes(k)) {
    return String(row[k] ?? '')
      .toLowerCase()
      .includes(fv);
  }
  const haystack = ROW_FILTER_FIELD_KEYS.map((key) => String(row[key] ?? '')).join(' ');
  return haystack.toLowerCase().includes(fv);
}

export function ContainerPDBPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(
    () => pdbData.filter((r) => appliedFilters.every((f) => rowMatches(r, f))),
    [appliedFilters]
  );

  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage, itemsPerPage]
  );

  const hasSelection = selectedRows.length > 0;

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

  const logAction = useCallback((label: string, row: PodDisruptionBudgetRow) => {
    console.log(`[PDB] ${label}`, row.id, row.name);
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'minAvailable', header: 'Min available', sortable: true },
    { key: 'maxUnavailable', header: 'Max unavailable', sortable: true },
    { key: 'allowedDisruption', header: 'Allowed disruption', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Pod disruption budgets" size="large" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create pod disruption budget
              <IconChevronDown size={14} stroke={1.5} className="ml-1" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/pdb/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/pdb/create-yaml')}>
            Create as YAML
          </ContextMenu.Item>
        </ContextMenu.Root>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search pod disruption budgets by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[PDB] Bulk Download YAML', selectedRows)}
          >
            <IconDownload size={12} /> Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[PDB] Bulk Delete', selectedRows)}
          >
            <IconTrash size={12} /> Delete
          </Button>
        </div>
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
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
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
        totalCount={filteredRows.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<PodDisruptionBudgetRow>
        columns={columns}
        rows={paginatedRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('status')}>
              <Tooltip content={row.status} direction="top">
                <Badge
                  theme="white"
                  size="sm"
                  className="max-w-[80px] inline-flex overflow-hidden !justify-start !text-left"
                >
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <Link
                to={`/container/pdb/${row.id}`}
                className={`${linkClass} truncate block min-w-0`}
                title={row.name}
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={c('namespace')}>
              <span className="truncate block min-w-0" title={row.namespace}>
                {row.namespace}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('minAvailable')}>
              <span className="truncate block min-w-0" title={row.minAvailable}>
                {row.minAvailable}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('maxUnavailable')}>
              <span className="truncate block min-w-0" title={row.maxUnavailable}>
                {row.maxUnavailable}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('allowedDisruption')}>
              {row.allowedDisruption}
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              <span className="truncate block min-w-0" title={row.createdAt}>
                {stripTime(row.createdAt)}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <div className="min-w-0 flex items-center justify-center w-full">
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
                      <IconDotsCircleHorizontal
                        size={16}
                        stroke={1.5}
                        className="text-text-subtle"
                      />
                    </button>
                  )}
                >
                  <ContextMenu.Item action={() => navigate(`/container/pdb/${row.id}/edit`)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => navigate(`/container/pdb/${row.id}/edit-yaml`)}>
                    Edit YAML
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Download YAML', row)}>
                    Download YAML
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Delete', row)} danger>
                    Delete
                  </ContextMenu.Item>
                </ContextMenu.Root>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}
