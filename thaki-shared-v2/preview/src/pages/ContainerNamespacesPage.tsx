import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface NamespaceRow {
  id: string;
  status: string;
  name: string;
  description: string;
  createdAt: string;
  [key: string]: unknown;
}

const namespacesData: NamespaceRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'production-microservices-platform-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 08:12:33',
  },
  {
    id: '2',
    status: 'OK',
    name: 'staging-integration-testing-environment',
    description: 'description text',
    createdAt: 'Nov 10, 2025 09:25:17',
  },
  {
    id: '3',
    status: 'OK',
    name: 'development-sandbox-experimental-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 10:38:42',
  },
  {
    id: '4',
    status: 'True',
    name: 'shared-global-data-persistence-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 11:52:08',
  },
  {
    id: '5',
    status: 'True',
    name: 'cattle-impersonation-system-rbac-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 13:05:25',
  },
  {
    id: '6',
    status: 'Raw',
    name: 'cattle-provisioning-capi-cluster-api-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 14:18:51',
  },
  {
    id: '7',
    status: 'Raw',
    name: 'monitoring-observability-stack-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 15:31:14',
  },
  {
    id: '8',
    status: 'None',
    name: 'default-system-resources-default-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 16:44:38',
  },
  {
    id: '9',
    status: 'None',
    name: 'kube-public-cluster-info-public-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 17:57:02',
  },
  {
    id: '10',
    status: 'CreateContainerConfigError',
    name: 'kube-system-cluster-components-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 18:09:45',
  },
  {
    id: '11',
    status: 'InvalidImageName',
    name: 'local-development-single-node-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 19:22:18',
  },
  {
    id: '12',
    status: 'ImagePullBackOff',
    name: 'kube-node-lease-heartbeat-lease-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2025 20:35:52',
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
  { key: 'description', label: 'Description', type: 'input', placeholder: 'Enter description...' },
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
  { key: 'createdAt', label: 'Created at', type: 'input', placeholder: 'Enter created at...' },
];

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function rowMatches(row: NamespaceRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof NamespaceRow;
  if (key === 'createdAt') {
    return stripTime(String(row.createdAt)).toLowerCase().includes(fv);
  }
  return String(row[key] ?? '')
    .toLowerCase()
    .includes(fv);
}

export function ContainerNamespacesPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(
    () => namespacesData.filter((r) => appliedFilters.every((f) => rowMatches(r, f))),
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

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Namespaces" size="large" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create namespace
              <IconChevronDown size={14} stroke={1.5} className="ml-1" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/namespaces/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/namespaces/create-yaml')}>
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
            placeholder="Search namespaces by attributes"
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
            onClick={() => console.log('[Namespaces] Bulk Download YAML', selectedRows)}
          >
            <IconDownload size={12} /> Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Namespaces] Bulk Delete', selectedRows)}
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
        onSettingClick={() => {}}
        settingAriaLabel="Pagination settings"
      />

      <SelectableTable<NamespaceRow>
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
              <span
                className="text-12 leading-18 font-medium text-primary cursor-pointer hover:underline truncate block min-w-0"
                title={row.name}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/container/namespaces/${encodeURIComponent(row.name)}`);
                }}
              >
                {row.name}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('description')}>
              <span className="truncate block min-w-0" title={row.description}>
                {row.description}
              </span>
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
                  <ContextMenu.Item action={() => console.log('Edit Config:', row.id)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() =>
                      navigate(`/container/namespaces/${encodeURIComponent(row.name)}/edit-yaml`)
                    }
                  >
                    Edit YAML
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => console.log('Download YAML:', row.id)}>
                    Download YAML
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => console.log('Delete:', row.id)} danger>
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
