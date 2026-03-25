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
  IconCircleDashed,
  IconDotsCircleHorizontal,
  IconDownload,
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface CronJobRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  image: string;
  schedule: string;
  lastSchedule: string;
  createdAt: string;
  [key: string]: unknown;
}

const cronJobsData: CronJobRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'automated-database-backup-daily-schedule-cronjob',
    namespace: 'namespaceName',
    image: 'imageName',
    schedule: '@daily',
    lastSchedule: '36 days',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '2',
    status: 'OK',
    name: 'database-backup-nightly-incremental-schedule-cronjob',
    namespace: 'database',
    image: 'backup-tool:v2.1',
    schedule: '0 2 * * *',
    lastSchedule: '12h',
    createdAt: 'Nov 9, 2025 18:04:44',
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'log-rotation-cleanup-weekly-maintenance-cronjob',
    namespace: 'maintenance',
    image: 'cleanup-tool:v1.5',
    schedule: '*/30 * * * *',
    lastSchedule: '15m',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '4',
    status: 'InvalidImageName',
    name: 'analytics-weekly-report-generator-schedule-cronjob',
    namespace: 'analytics',
    image: 'report-gen:v3.2',
    schedule: '0 9 * * 1',
    lastSchedule: '7 days',
    createdAt: 'Nov 8, 2025 11:51:27',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'data-sync-incremental-replication-schedule-cronjob',
    namespace: 'data-sync',
    image: 'sync-worker:v2.0',
    schedule: '*/5 * * * *',
    lastSchedule: '3m',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '6',
    status: 'True',
    name: 'search-index-rebuild-weekly-full-sync-cronjob',
    namespace: 'search',
    image: 'indexer:v4.1',
    schedule: '0 3 * * 0',
    lastSchedule: '5 days',
    createdAt: 'Nov 7, 2025 04:38:10',
  },
  {
    id: '7',
    status: 'Raw',
    name: 'cache-warmup-daily-preload-schedule-cronjob',
    namespace: 'cache',
    image: 'cache-warmer:v1.2',
    schedule: '0 6 * * *',
    lastSchedule: '2 days',
    createdAt: 'Nov 6, 2025 21:25:53',
  },
  {
    id: '8',
    status: 'None',
    name: 'monitoring-metrics-collector-aggregation-cronjob',
    namespace: 'monitoring',
    image: 'metrics:v1.0',
    schedule: '*/10 * * * *',
    lastSchedule: '8m',
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
  { key: 'schedule', label: 'Schedule', type: 'input', placeholder: 'Enter schedule...' },
  {
    key: 'lastSchedule',
    label: 'Last Schedule',
    type: 'input',
    placeholder: 'Enter last schedule...',
  },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function rowMatches(row: CronJobRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof CronJobRow;
  return String(row[key] ?? '')
    .toLowerCase()
    .includes(fv);
}

export function ContainerCronJobsPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(
    () => cronJobsData.filter((r) => appliedFilters.every((f) => rowMatches(r, f))),
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

  const logAction = useCallback((label: string, row: CronJobRow) => {
    console.log(`[CronJobs] ${label}`, row.id, row.name);
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'schedule', header: 'Schedule', sortable: true },
    { key: 'lastSchedule', header: 'Last Schedule', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="CronJobs" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create CronJob
              <IconChevronDown size={14} stroke={1.5} className="ml-1" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/cronjobs/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/cronjobs/create-yaml')}>
            Create as YAML
          </ContextMenu.Item>
        </ContextMenu.Root>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search cron jobs by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[CronJobs] Bulk Run now', selectedRows)}
          >
            <IconCircleDashed size={12} /> Run now
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[CronJobs] Bulk Resume', selectedRows)}
          >
            <IconPlayerPlay size={12} /> Resume
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[CronJobs] Bulk Suspend', selectedRows)}
          >
            <IconPlayerPause size={12} /> Suspend
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[CronJobs] Bulk Download YAML', selectedRows)}
          >
            <IconDownload size={12} /> Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[CronJobs] Bulk Delete', selectedRows)}
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

      <SelectableTable<CronJobRow>
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
              <div className="min-w-0">
                <Link
                  to={`/container/cronjobs/${row.id}`}
                  className={`${linkClass} truncate block`}
                  title={row.name}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.name}
                </Link>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={c('namespace')}>
              <span className="truncate block" title={row.namespace}>
                {row.namespace}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('image')}>
              <span className="truncate block" title={row.image}>
                {row.image}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('schedule')}>
              <span className="truncate block" title={row.schedule}>
                {row.schedule}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('lastSchedule')}>
              <span className="truncate block" title={row.lastSchedule}>
                {row.lastSchedule}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              <span className="truncate block whitespace-nowrap" title={stripTime(row.createdAt)}>
                {stripTime(row.createdAt)}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <div className="flex items-center justify-center w-full">
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
                  <ContextMenu.Item action={() => logAction('Run now', row)}>
                    Run now
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Suspend/Resume', row)}>
                    {row.status === 'Suspended' ? 'Resume' : 'Suspend'}
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => navigate(`/container/cronjobs/${row.id}/edit`)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => navigate(`/container/cronjobs/${row.id}/edit-yaml`)}
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
