import { useMemo, useState, useCallback, type ReactNode } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Tooltip } from '@shared/components/Tooltip';
import { Badge } from '@shared/components/Badge';
import { Popover } from '@shared/components/Popover';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import {
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface JobData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  image: string;
  createdAt: string;
  duration: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface PodRow {
  id: string;
  status: string;
  name: string;
  image: string;
  ready: string;
  restarts: number;
  ip: string;
  node: string;
  createdAt: string;
  containers: string[];
  [key: string]: unknown;
}

interface ConditionRow {
  id: string;
  type: string;
  status: string;
  reason: string;
  message: string;
  lastTransition: string;
  lastUpdate: string;
  [key: string]: unknown;
}

interface EventRow {
  id: string;
  lastSeen: string;
  type: string;
  reason: string;
  subobject: string;
  source: string;
  message: string;
  firstSeen: string;
  count: number;
  name: string;
  [key: string]: unknown;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockJobData: Record<string, JobData> = {
  '1': {
    id: '1',
    name: 'jobName',
    status: 'OK',
    namespace: 'default',
    image: 'nginx:1.27',
    createdAt: 'Jul 25, 2025 16:45:11',
    duration: '36 days',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'app.kubernetes.io/name': 'job',
      'app.kubernetes.io/version': '1.0.0',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'job',
      'meta.helm.sh/release-namespace': 'default',
    },
  },
  '2': {
    id: '2',
    name: 'data-migration-job',
    status: 'True',
    namespace: 'database',
    image: 'migration-tool:v2.1',
    createdAt: 'Nov 9, 2025 09:12:33',
    duration: '2h 15m',
    labels: {
      'app.kubernetes.io/name': 'migration',
      'app.kubernetes.io/component': 'database',
    },
    annotations: {
      'job.kubernetes.io/revision': '1',
    },
  },
};

const mockPodsData: PodRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'podName-77',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 1,
    ip: '10.11.0.11',
    node: 'nodeName',
    createdAt: 'Jul 25, 2025 16:45:11',
    containers: [
      'container-0',
      'container-1',
      'container-2',
      'container-3',
      'container-4',
      'container-5',
    ],
  },
  {
    id: '2',
    status: 'True',
    name: 'podName-78',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 0,
    ip: '10.11.0.12',
    node: 'nodeName',
    createdAt: 'Jul 25, 2025 16:49:33',
    containers: ['container-0'],
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'podName-79',
    image: 'nginx:1.27',
    ready: '0/1',
    restarts: 2,
    ip: '10.11.0.13',
    node: 'nodeName',
    createdAt: 'Jul 25, 2025 16:45:11',
    containers: ['container-0'],
  },
];

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'Complete',
    status: 'True',
    reason: 'JobCompleted',
    message: 'Job completed successfully.',
    lastTransition: 'Jul 25, 2025',
    lastUpdate: 'Jul 25, 2025',
  },
];

const mockEventsData: EventRow[] = [
  {
    id: '1',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'SuccessfulCreate',
    subobject: '-',
    source: 'job-controller',
    message: 'Created pod: podName-77',
    firstSeen: '30m',
    count: 1,
    name: 'jobName.17e83a1b2c3d4e5f',
  },
];

const STATUS_COL_WIDTH = 120;
const ACTION_COL_WIDTH = 72;
const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTableDate(value: string): string {
  return value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
}

/* ----------------------------------------
   Pods Tab
   ---------------------------------------- */

function PodsTab({ pods, onViewLogs }: { pods: PodRow[]; onViewLogs: (podName: string) => void }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: STATUS_COL_WIDTH },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'ready', header: 'Ready', sortable: true },
    { key: 'restarts', header: 'Restarts', sortable: true },
    { key: 'ip', header: 'IP', sortable: true },
    { key: 'node', header: 'Node', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: ACTION_COL_WIDTH, align: 'center' },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text m-0">Pods</h3>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Search pods by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
        />
        <div className="h-4 w-px bg-border shrink-0" />
        <div className="flex items-center gap-1">
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            <IconDownload size={12} stroke={1.5} />
            Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            <IconTrash size={12} stroke={1.5} />
            Delete
          </Button>
        </div>
      </div>
      <Pagination
        totalCount={pods.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />
      <SelectableTable<PodRow>
        columns={columns}
        rows={pods}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {pods.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('status')}>
              <Tooltip content={row.status} direction="top">
                <Badge
                  theme="white"
                  size="sm"
                  className="max-w-[80px] inline-flex overflow-hidden min-w-0 !justify-start !text-left"
                >
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <span className={`${linkClass} truncate block min-w-0`} title={row.name}>
                {row.name}
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
              {row.ip}
            </Table.Td>
            <Table.Td rowData={row} column={c('node')}>
              <span className={`${linkClass} truncate block min-w-0`} title={row.node}>
                {row.node}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              <span className="truncate block min-w-0" title={row.createdAt}>
                {stripTableDate(row.createdAt)}
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
                      <IconDotsCircleHorizontal size={16} stroke={1.5} />
                    </button>
                  )}
                >
                  <ContextMenu.Item action={() => onViewLogs(row.name)}>View logs</ContextMenu.Item>
                  <ContextMenu.Item action={() => navigate(`/container/pods/${row.id}/edit`)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => navigate(`/container/pods/${row.name}/edit-yaml`)}
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

/* ----------------------------------------
   Conditions Tab
   ---------------------------------------- */

function ConditionsTab({ conditions }: { conditions: ConditionRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const columns: TableColumn[] = [
    { key: 'type', header: 'Condition', sortable: true },
    { key: 'status', header: 'Size', sortable: true },
    { key: 'message', header: 'Message', sortable: true },
    { key: 'lastUpdate', header: 'Updated', sortable: true },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text m-0">Conditions</h3>
      <Pagination
        totalCount={conditions.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />
      <Table<ConditionRow>
        columns={columns}
        rows={conditions}
        sort={sort}
        order={order}
        onSortChange={(k, o) => {
          setSort(k ?? '');
          setOrder(o);
        }}
      >
        {conditions.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('type')}>
              {row.type}
            </Table.Td>
            <Table.Td rowData={row} column={c('status')}>
              {row.status}
            </Table.Td>
            <Table.Td rowData={row} column={c('message')}>
              <span className="truncate block min-w-0" title={`[${row.reason}] ${row.message}`}>
                [{row.reason}] {row.message}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('lastUpdate')}>
              {row.lastUpdate}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

/* ----------------------------------------
   Recent Events Tab
   ---------------------------------------- */

function RecentEventsTab({ events }: { events: EventRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const columns: TableColumn[] = [
    { key: 'lastSeen', header: 'Last seen', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'reason', header: 'Reason', sortable: true },
    { key: 'subobject', header: 'Subobject', sortable: true },
    { key: 'source', header: 'Source', sortable: true },
    { key: 'message', header: 'Message', sortable: true },
    { key: 'firstSeen', header: 'First seen', sortable: true },
    { key: 'count', header: 'Count', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'actions', header: 'Action', width: ACTION_COL_WIDTH, align: 'center' },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text m-0">Recent events</h3>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Search events by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
        />
        <div className="h-4 w-px bg-border shrink-0" />
        <div className="flex items-center gap-1">
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            <IconDownload size={12} stroke={1.5} />
            Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            <IconTrash size={12} stroke={1.5} />
            Delete
          </Button>
        </div>
      </div>
      <Pagination
        totalCount={events.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />
      <SelectableTable<EventRow>
        columns={columns}
        rows={events}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={(k, o) => {
          setSort(k ?? '');
          setOrder(o);
        }}
        stickyLastColumn
      >
        {events.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('lastSeen')}>
              {row.lastSeen}
            </Table.Td>
            <Table.Td rowData={row} column={c('type')}>
              {row.type}
            </Table.Td>
            <Table.Td rowData={row} column={c('reason')}>
              {row.reason}
            </Table.Td>
            <Table.Td rowData={row} column={c('subobject')}>
              {row.subobject}
            </Table.Td>
            <Table.Td rowData={row} column={c('source')}>
              {row.source}
            </Table.Td>
            <Table.Td rowData={row} column={c('message')}>
              {row.message}
            </Table.Td>
            <Table.Td rowData={row} column={c('firstSeen')}>
              {row.firstSeen}
            </Table.Td>
            <Table.Td rowData={row} column={c('count')}>
              {row.count}
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <span className={`${linkClass} truncate block min-w-0`} title={row.name}>
                {row.name}
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
                      <IconDotsCircleHorizontal size={16} stroke={1.5} />
                    </button>
                  )}
                >
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

/* ----------------------------------------
   Main
   ---------------------------------------- */

function makeLabelAnnotationInfoField(
  title: string,
  entries: [string, string][]
): DetailPageHeaderInfoField {
  return {
    label: `${title} (${entries.length})`,
    value:
      entries.length === 0 ? (
        '-'
      ) : (
        <div className="flex items-center gap-1 min-w-0 w-full">
          {entries.slice(0, 1).map(([key, val]) => (
            <Badge
              key={key}
              theme="white"
              size="sm"
              className="min-w-0 truncate justify-start text-left"
            >
              {`${key}: ${val}`}
            </Badge>
          ))}
          {entries.length > 1 && (
            <Popover
              trigger="hover"
              position="bottom"
              delay={100}
              hideDelay={100}
              content={
                <div className="p-3 min-w-[120px] max-w-[320px]">
                  <div className="text-[10px] leading-[14px] font-medium text-text-muted mb-2">
                    All {title.toLowerCase()} ({entries.length})
                  </div>
                  <div className="flex flex-col gap-1">
                    {entries.map(([k, v]) => (
                      <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                        <span className="break-all">{`${k}: ${v}`}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              }
            >
              <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-[10px] leading-[14px] font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors h-5 cursor-pointer">
                +{entries.length - 1}
              </span>
            </Popover>
          )}
        </div>
      ),
  };
}

export function ContainerJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pods';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const job = useMemo(() => mockJobData[id || '1'] || mockJobData['1'], [id]);

  const handleViewLogs = useCallback((podName: string) => {
    console.log('View logs:', podName);
  }, []);

  const infoFields: DetailPageHeaderInfoField[] = useMemo(
    () => [
      {
        label: 'Status',
        value: (
          <Tooltip content={job.status === 'Completed' ? 'Active' : job.status} direction="top">
            <Badge
              theme="white"
              size="sm"
              className="max-w-[80px] inline-flex overflow-hidden min-w-0 !justify-start !text-left"
            >
              <span className="truncate">{job.status === 'Completed' ? 'Active' : job.status}</span>
            </Badge>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: job.namespace,
        showCopyButton: true,
        copyText: job.namespace,
      },
      {
        label: 'Image',
        value: job.image,
        showCopyButton: true,
        copyText: job.image,
      },
      { label: 'Created at', value: job.createdAt },
      { label: 'Duration', value: job.duration },
      makeLabelAnnotationInfoField('Labels', Object.entries(job.labels)),
      makeLabelAnnotationInfoField('Annotations', Object.entries(job.annotations)),
    ],
    [job]
  );

  const moreActions = (
    <ContextMenu.Root
      direction="bottom-end"
      gap={4}
      trigger={({ toggle }) => (
        <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
          More actions
          <IconChevronDown size={14} stroke={1.5} className="ml-1" />
        </Button>
      )}
    >
      <ContextMenu.Item action={() => navigate(`/container/jobs/${job.id}/edit`)}>
        Edit config
      </ContextMenu.Item>
      <ContextMenu.Item action={() => navigate(`/container/jobs/${job.name}/edit-yaml`)}>
        Edit YAML
      </ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Download YAML')}>Download YAML</ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Delete')} danger>
        Delete
      </ContextMenu.Item>
    </ContextMenu.Root>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={`Job: ${job.name}`} actions={moreActions} infoFields={infoFields} />

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="pods" label="Pods">
          <PodsTab pods={mockPodsData} onViewLogs={handleViewLogs} />
        </Tab>
        <Tab id="conditions" label="Conditions">
          <ConditionsTab conditions={mockConditionsData} />
        </Tab>
        <Tab id="events" label="Recent events">
          <RecentEventsTab events={mockEventsData} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default ContainerJobDetailPage;
