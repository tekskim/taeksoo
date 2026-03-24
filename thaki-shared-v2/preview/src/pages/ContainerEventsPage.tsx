import { useState, useMemo, useCallback } from 'react';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { IconDotsCircleHorizontal, IconDownload, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface EventRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  lastSeen: string;
  type: string;
  reason: string;
  object: string;
  subobject: string;
  source: string;
  message: string;
  firstSeen: string;
  count: number;
  [key: string]: unknown;
}

const eventsData: EventRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'frontend-web-server-pod-started-successfully-event',
    namespace: 'default',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'Started',
    object: 'Pod-web-server-1',
    subobject: '-',
    source: 'kubelet, worker-node-1',
    message: 'the web-server-1 was successfully started on node worker-node-1.',
    firstSeen: 'Oct 21, 2025',
    count: 2,
  },
  {
    id: '2',
    status: 'OK',
    name: 'frontend-web-server-pod-scheduled-to-worker-node-event',
    namespace: 'default',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'Scheduled',
    object: 'Pod-web-server-1',
    subobject: '-',
    source: 'default-scheduler',
    message: 'Successfully assigned default/web-server-1 to worker-node-1',
    firstSeen: 'Oct 21, 2025',
    count: 1,
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'nginx-deployment-pod-failed-scheduling-no-nodes-event',
    namespace: 'kube-system',
    lastSeen: 'Oct 21, 2025',
    type: 'Warning',
    reason: 'FailedScheduling',
    object: 'Pod-nginx-deployment',
    subobject: '-',
    source: 'default-scheduler',
    message: 'no nodes available to schedule pods',
    firstSeen: 'Oct 21, 2025',
    count: 5,
  },
  {
    id: '4',
    status: 'InvalidImageName',
    name: 'api-server-deployment-scaled-replicaset-event',
    namespace: 'production',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'ScalingReplicaSet',
    object: 'Deployment-api-server',
    subobject: '-',
    source: 'deployment-controller',
    message: 'Scaled up replica set api-server-abc123 to 3',
    firstSeen: 'Oct 21, 2025',
    count: 1,
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'backend-service-pod-crash-loop-backoff-event',
    namespace: 'staging',
    lastSeen: 'Oct 21, 2025',
    type: 'Warning',
    reason: 'BackOff',
    object: 'Pod-backend-service',
    subobject: 'container-main',
    source: 'kubelet, worker-node-2',
    message: 'Back-off restarting failed container',
    firstSeen: 'Oct 21, 2025',
    count: 12,
  },
  {
    id: '6',
    status: 'True',
    name: 'web-frontend-service-created-clusterip-event',
    namespace: 'default',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'Created',
    object: 'Service-web-frontend',
    subobject: '-',
    source: 'service-controller',
    message: 'Created service web-frontend with ClusterIP',
    firstSeen: 'Oct 21, 2025',
    count: 1,
  },
  {
    id: '7',
    status: 'Raw',
    name: 'worker-node-3-status-now-ready-event',
    namespace: 'default',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'NodeReady',
    object: 'Node-worker-node-3',
    subobject: '-',
    source: 'kubelet, worker-node-3',
    message: 'Node worker-node-3 status is now: NodeReady',
    firstSeen: 'Oct 21, 2025',
    count: 1,
  },
  {
    id: '8',
    status: 'None',
    name: 'database-replica-pod-image-pull-failed-event',
    namespace: 'production',
    lastSeen: 'Oct 21, 2025',
    type: 'Warning',
    reason: 'ErrImagePull',
    object: 'Pod-database-replica',
    subobject: 'container-db',
    source: 'kubelet, worker-node-1',
    message: 'Failed to pull image "postgres:16": rpc error',
    firstSeen: 'Oct 21, 2025',
    count: 8,
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
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'namespace', label: 'Namespace', type: 'input', placeholder: 'Enter namespace...' },
  { key: 'lastSeen', label: 'Last seen', type: 'input', placeholder: 'Enter last seen...' },
  { key: 'type', label: 'Type', type: 'input', placeholder: 'Enter type...' },
  { key: 'reason', label: 'Reason', type: 'input', placeholder: 'Enter reason...' },
  { key: 'object', label: 'Object', type: 'input', placeholder: 'Enter object...' },
  { key: 'subobject', label: 'Subobject', type: 'input', placeholder: 'Enter subobject...' },
  { key: 'source', label: 'Source', type: 'input', placeholder: 'Enter source...' },
  { key: 'message', label: 'Message', type: 'input', placeholder: 'Enter message...' },
  { key: 'firstSeen', label: 'First seen', type: 'input', placeholder: 'Enter first seen...' },
  { key: 'count', label: 'Count', type: 'number', placeholder: 'Enter count...' },
];

function rowMatches(row: EventRow, filter: FilterKeyWithValue): boolean {
  const raw = filter.value ?? '';
  const fv = String(raw).toLowerCase();
  if (!fv) return true;
  if (filter.key === 'count') {
    return String(row.count).toLowerCase().includes(fv);
  }
  const key = filter.key as keyof EventRow;
  return String(row[key] ?? '')
    .toLowerCase()
    .includes(fv);
}

export function ContainerEventsPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(
    () => eventsData.filter((r) => appliedFilters.every((f) => rowMatches(r, f))),
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
    { key: 'status', header: 'Status', width: 88, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'lastSeen', header: 'Last seen', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'reason', header: 'Reason', sortable: true },
    { key: 'object', header: 'Object', sortable: true },
    { key: 'subobject', header: 'Subobject', sortable: true },
    { key: 'source', header: 'Source', sortable: true },
    { key: 'message', header: 'Message', sortable: true },
    { key: 'firstSeen', header: 'First seen', sortable: true },
    { key: 'count', header: 'Count', sortable: true, align: 'right' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Events" size="large" />
      </div>

      <div className="flex items-center gap-2 min-h-[28px]">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search events by attributes"
            defaultFilterKey="name"
          />
          <Button
            appearance="outline"
            variant="secondary"
            size="sm"
            aria-label="Download"
            className="!p-0 !w-7 !h-7 !min-w-7"
          >
            <IconDownload size={12} stroke={1.5} />
          </Button>
        </div>
        <div className="w-px h-4 bg-[var(--color-border-default)]" />
        <div className="flex items-center gap-1">
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Events] Bulk Download YAML', selectedRows)}
          >
            <IconDownload size={12} stroke={1.5} /> Download YAML
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

      <SelectableTable<EventRow>
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
                <Badge theme="white" size="sm" className="max-w-[80px] inline-flex">
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <span className="truncate block min-w-0 text-body-md" title={row.name}>
                {row.name}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('namespace')}>
              <span className="truncate block min-w-0" title={row.namespace}>
                {row.namespace}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('lastSeen')}>
              <span className="truncate block min-w-0" title={row.lastSeen}>
                {row.lastSeen}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('type')}>
              <span className="truncate block min-w-0" title={row.type}>
                {row.type}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('reason')}>
              <span className="truncate block min-w-0" title={row.reason}>
                {row.reason}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('object')}>
              <span className="truncate block min-w-0" title={row.object}>
                {row.object}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('subobject')}>
              <span className="truncate block min-w-0" title={row.subobject}>
                {row.subobject}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('source')}>
              <span className="truncate block min-w-0" title={row.source}>
                {row.source}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('message')}>
              <span
                className="text-body-md text-[var(--color-text-default)] truncate block min-w-0"
                title={row.message}
              >
                {row.message}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('firstSeen')}>
              <span className="truncate block min-w-0" title={row.firstSeen}>
                {row.firstSeen}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('count')}>
              {row.count}
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
                  <ContextMenu.Item action={() => console.log('View Details:', row.id)}>
                    View details
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => console.log('Download YAML:', row.id)}>
                    Download YAML
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
