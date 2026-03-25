import { useState, useMemo } from 'react';
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
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface DeploymentRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  image: string;
  ready: string;
  upToDate: number;
  available: number;
  createdAt: string;
  [key: string]: unknown;
}

const deploymentsData: DeploymentRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'frontend-web-application-nginx-deployment',
    namespace: 'cart5-production-dev-api-system',
    image: 'mirrored-cluster-api-controller:v1.6.2',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: 'Nov 10, 2025 08:35:22',
  },
  {
    id: '2',
    status: 'OK',
    name: 'ingress-nginx-controller-admission-webhook-deployment',
    namespace: 'ingress-nginx',
    image: 'nginx-ingress-controller:v1.9.4',
    ready: '3/3',
    upToDate: 3,
    available: 3,
    createdAt: 'Nov 8, 2025 11:42:18',
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'monitoring-prometheus-alertmanager-server-deployment',
    namespace: 'monitoring',
    image: 'prometheus/prometheus:v2.47.0',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: 'Nov 7, 2025 14:28:45',
  },
  {
    id: '4',
    status: 'InvalidImageName',
    name: 'monitoring-grafana-dashboard-visualization-deployment',
    namespace: 'monitoring',
    image: 'grafana/grafana:10.2.0',
    ready: '0/1',
    upToDate: 1,
    available: 0,
    createdAt: 'Nov 9, 2025 09:15:33',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'cache-redis-master-replication-deployment',
    namespace: 'cache',
    image: 'redis:7.2-alpine',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: 'Nov 6, 2025 16:52:07',
  },
  {
    id: '6',
    status: 'True',
    name: 'payment-service-gateway-microservice-deployment',
    namespace: 'payment-system',
    image: 'payment-service:v2.1.0',
    ready: '0/2',
    upToDate: 0,
    available: 0,
    createdAt: 'Nov 10, 2025 10:18:41',
  },
  {
    id: '7',
    status: 'Raw',
    name: 'backend-api-gateway-microservice-deployment',
    namespace: 'gateway',
    image: 'api-gateway:v3.0.1',
    ready: '2/2',
    upToDate: 2,
    available: 2,
    createdAt: 'Nov 5, 2025 13:45:29',
  },
  {
    id: '8',
    status: 'None',
    name: 'user-management-service-authentication-deployment',
    namespace: 'user-management',
    image: 'user-service:v1.5.3',
    ready: '3/3',
    upToDate: 3,
    available: 3,
    createdAt: 'Nov 4, 2025 11:22:14',
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
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
  { key: 'upToDate', label: 'Up to date', type: 'input', placeholder: 'Enter count...' },
  { key: 'available', label: 'Available', type: 'input', placeholder: 'Enter count...' },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function rowMatches(row: DeploymentRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  if (filter.key === 'upToDate' || filter.key === 'available') {
    return String(row[filter.key]).toLowerCase().includes(fv);
  }
  const key = filter.key as keyof DeploymentRow;
  return String(row[key] ?? '')
    .toLowerCase()
    .includes(fv);
}

export function ContainerDeploymentsPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(
    () => deploymentsData.filter((r) => appliedFilters.every((f) => rowMatches(r, f))),
    [appliedFilters]
  );

  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage, itemsPerPage]
  );

  const hasSelection = selectedRows.length > 0;

  const handleSortChange = (nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  };

  const handleFilterAdd = (filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  };

  const handleFilterRemove = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  };

  const logAction = (label: string, row: DeploymentRow) => {
    console.log(`[Deployments] ${label}`, row.id, row.name);
  };

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'ready', header: 'Ready', sortable: true },
    { key: 'upToDate', header: 'Up to date', sortable: true },
    { key: 'available', header: 'Available', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Deployments" size="large" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create deployment
              <IconChevronDown size={14} stroke={1.5} className="ml-1" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/deployments/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/deployments/create-yaml')}>
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
            placeholder="Search deployments by attributes"
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
            onClick={() => console.log('[Deployments] Bulk Redeploy', selectedRows)}
          >
            <IconRefresh size={12} /> Redeploy
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Deployments] Bulk Download YAML', selectedRows)}
          >
            <IconDownload size={12} /> Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Deployments] Bulk Delete', selectedRows)}
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

      <SelectableTable<DeploymentRow>
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
                to={`/container/deployments/${row.id}`}
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
            <Table.Td rowData={row} column={c('upToDate')}>
              {row.upToDate}
            </Table.Td>
            <Table.Td rowData={row} column={c('available')}>
              {row.available}
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
                  <ContextMenu.Item action={() => logAction('Execute shell', row)}>
                    Execute shell
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Pause orchestration', row)}>
                    Pause orchestration
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Redeploy', row)}>
                    Redeploy
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Rollback', row)}>
                    Rollback
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => navigate(`/container/deployments/${row.id}/edit`)}
                  >
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => navigate(`/container/deployments/${row.id}/edit-yaml`)}
                  >
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
