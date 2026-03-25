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

interface PodRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  image: string;
  ready: string;
  restarts: number;
  ip: string;
  createdAt: string;
  [key: string]: unknown;
}

const podsData: PodRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'frontend-web-application-deployment-7fb96c846b-x2vnl',
    namespace: 'namespaceName',
    image: 'imageName',
    ready: '1/1',
    restarts: 1,
    ip: '10.76.0.1',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '2',
    status: 'OK',
    name: 'backend-api-gateway-service-5d4f8b7c9a-k8m2n',
    namespace: 'default',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.0.12',
    createdAt: 'Nov 9, 2025 18:04:44',
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'monitoring-prometheus-alertmanager-statefulset-0',
    namespace: 'production',
    image: 'backend-api:v2.1.0',
    ready: '0/1',
    restarts: 0,
    ip: '-',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '4',
    status: 'InvalidImageName',
    name: 'ingress-nginx-controller-admission-create-28t5q',
    namespace: 'analytics',
    image: 'data-processor:v1.5',
    ready: '0/1',
    restarts: 5,
    ip: '10.76.0.45',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'kube-system-coredns-autoscaler-7f89d5c6b4-2pv8r',
    namespace: 'cache',
    image: 'redis:7.2',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.0.23',
    createdAt: 'Nov 8, 2025 11:51:27',
  },
  {
    id: '6',
    status: 'True',
    name: 'postgresql-primary-replication-statefulset-0',
    namespace: 'database',
    image: 'postgres:15',
    ready: '1/1',
    restarts: 1,
    ip: '10.76.0.34',
    createdAt: 'Nov 7, 2025 04:38:10',
  },
  {
    id: '7',
    status: 'Raw',
    name: 'database-migration-schema-update-v2-job-20240115',
    namespace: 'database',
    image: 'migration:v1.0',
    ready: '0/1',
    restarts: 0,
    ip: '10.76.0.56',
    createdAt: 'Nov 6, 2025 21:25:53',
  },
  {
    id: '8',
    status: 'None',
    name: 'monitoring-node-exporter-prometheus-daemonset-node1',
    namespace: 'monitoring',
    image: 'prometheus-agent:v2.45',
    ready: '1/1',
    restarts: 2,
    ip: '10.76.0.67',
    createdAt: 'Nov 5, 2025 14:12:36',
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
  { key: 'image', label: 'Image', type: 'input', placeholder: 'Enter image...' },
  { key: 'ready', label: 'Ready', type: 'input', placeholder: 'Enter ready...' },
  { key: 'ip', label: 'IP', type: 'input', placeholder: 'Enter IP...' },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function rowMatches(row: PodRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  if (filter.key === 'restarts') {
    return String(row.restarts).toLowerCase().includes(fv);
  }
  const key = filter.key as keyof PodRow;
  return String(row[key] ?? '')
    .toLowerCase()
    .includes(fv);
}

export function ContainerPodsPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(
    () => podsData.filter((r) => appliedFilters.every((f) => rowMatches(r, f))),
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

  const logAction = useCallback((label: string, row: PodRow) => {
    console.log(`[Pods] ${label}`, row.id, row.name);
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'ready', header: 'Ready', sortable: true },
    { key: 'restarts', header: 'Restarts', sortable: true },
    { key: 'ip', header: 'IP', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Pods" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create pod
              <IconChevronDown size={14} stroke={1.5} className="ml-1" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/pods/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/pods/create-yaml')}>
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
            placeholder="Search pods by attributes"
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
            onClick={() => console.log('[Pods] Bulk Download YAML', selectedRows)}
          >
            <IconDownload size={12} /> Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Pods] Bulk Delete', selectedRows)}
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

      <SelectableTable<PodRow>
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
                to={`/container/pods/${row.id}`}
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
            <Table.Td rowData={row} column={c('image')}>
              <span className="truncate block min-w-0" title={row.image}>
                {row.image}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('ready')}>
              {row.ready}
            </Table.Td>
            <Table.Td rowData={row} column={c('restarts')}>
              {row.restarts}
            </Table.Td>
            <Table.Td rowData={row} column={c('ip')}>
              <span className="truncate block min-w-0" title={row.ip}>
                {row.ip}
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
                  <ContextMenu.Item action={() => logAction(`Execute shell: ${row.name}`, row)}>
                    Execute shell
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction(`View logs: ${row.name}`, row)}>
                    View logs
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => navigate(`/container/pods/${row.id}/edit`)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => navigate(`/container/pods/${row.id}/edit-yaml`)}>
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
