import { useMemo, useState, type ReactNode } from 'react';
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

interface CronJobData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  image: string;
  createdAt: string;
  schedule: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface JobRow {
  id: string;
  status: string;
  name: string;
  image: string;
  completions: string;
  duration: string;
  restarts: number;
  health: string;
  createdAt: string;
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

const mockCronJobData: Record<string, CronJobData> = {
  '1': {
    id: '1',
    name: 'cronjobName',
    status: 'OK',
    namespace: 'default:1.27',
    image: 'nginx:1.27',
    createdAt: 'Jul 25, 2025 09:14:33',
    schedule: '@daily',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'app.kubernetes.io/name': 'cronjob',
      'app.kubernetes.io/version': '1.0.0',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'cronjob',
      'meta.helm.sh/release-namespace': 'default',
    },
  },
  '2': {
    id: '2',
    name: 'backup-cronjob',
    status: 'True',
    namespace: 'database',
    image: 'backup-tool:v2.1',
    createdAt: 'Nov 9, 2025 02:18:47',
    schedule: '0 2 * * *',
    labels: {
      'app.kubernetes.io/name': 'backup',
      'app.kubernetes.io/component': 'database',
    },
    annotations: {
      'cronjob.kubernetes.io/revision': '1',
    },
  },
};

const mockJobsData: JobRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'jobName-77',
    image: 'nginx:1.27',
    completions: '1/1',
    duration: '10s',
    restarts: 0,
    health: 'succeeded = 1',
    createdAt: 'Jul 25, 2025 09:22:15',
  },
];

const mockEventsData: EventRow[] = [
  {
    id: '1',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'SuccessfulCreate',
    subobject: '-',
    source: 'cronjob-controller',
    message: 'Created job jobName-77',
    firstSeen: '30m',
    count: 1,
    name: 'cronjobName.17e83a1b2c3d4e5f',
  },
];

const STATUS_COL_WIDTH = 120;
const ACTION_COL_WIDTH = 72;
const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTableDate(value: string): string {
  return value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
}

function JobsTab({ jobs }: { jobs: JobRow[] }) {
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
    { key: 'completions', header: 'Completions', sortable: true },
    { key: 'duration', header: 'Duration', sortable: true },
    { key: 'restarts', header: 'Restarts', sortable: true },
    { key: 'health', header: 'Health', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: ACTION_COL_WIDTH, align: 'center' },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text m-0">Jobs</h3>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Search jobs by attributes"
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
        totalCount={jobs.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />
      <SelectableTable<JobRow>
        columns={columns}
        rows={jobs}
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
        {jobs.map((row) => (
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
              <button
                type="button"
                className={`${linkClass} truncate block min-w-0 text-left bg-transparent border-none p-0 cursor-pointer font-inherit`}
                title={row.name}
                onClick={() => navigate(`/container/jobs/${row.id}`)}
              >
                {row.name}
              </button>
            </Table.Td>
            <Table.Td rowData={row} column={c('image')}>
              {row.image}
            </Table.Td>
            <Table.Td rowData={row} column={c('completions')}>
              {row.completions}
            </Table.Td>
            <Table.Td rowData={row} column={c('duration')}>
              {row.duration}
            </Table.Td>
            <Table.Td rowData={row} column={c('restarts')}>
              {row.restarts}
            </Table.Td>
            <Table.Td rowData={row} column={c('health')}>
              {row.health}
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
                  <ContextMenu.Item action={() => navigate(`/container/jobs/${row.id}/edit`)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => navigate(`/container/jobs/${row.name}/edit-yaml`)}
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

export function ContainerCronJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'jobs';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const cronjob = useMemo(() => mockCronJobData[id || '1'] || mockCronJobData['1'], [id]);

  const infoFields: DetailPageHeaderInfoField[] = useMemo(
    () => [
      {
        label: 'Status',
        value: (
          <Tooltip content={cronjob.status} direction="top">
            <Badge
              theme="white"
              size="sm"
              className="max-w-[80px] inline-flex overflow-hidden min-w-0 !justify-start !text-left"
            >
              <span className="truncate">{cronjob.status}</span>
            </Badge>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: cronjob.namespace,
        showCopyButton: true,
        copyText: cronjob.namespace,
      },
      {
        label: 'Image',
        value: cronjob.image,
        showCopyButton: true,
        copyText: cronjob.image,
      },
      { label: 'Created at', value: cronjob.createdAt },
      makeLabelAnnotationInfoField('Labels', Object.entries(cronjob.labels)),
      makeLabelAnnotationInfoField('Annotations', Object.entries(cronjob.annotations)),
    ],
    [cronjob]
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
      <ContextMenu.Item action={() => console.log('Run Now')}>Run now</ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Suspend/Resume')}>
        {cronjob.status === 'Suspended' ? 'Resume' : 'Suspend'}
      </ContextMenu.Item>
      <ContextMenu.Item action={() => navigate(`/container/cronjobs/${cronjob.id}/edit`)}>
        Edit config
      </ContextMenu.Item>
      <ContextMenu.Item action={() => navigate(`/container/cronjobs/${cronjob.name}/edit-yaml`)}>
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
      <DetailPageHeader
        title={`CronJob: ${cronjob.name}`}
        actions={moreActions}
        infoFields={infoFields}
      />

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="jobs" label="Jobs">
          <JobsTab jobs={mockJobsData} />
        </Tab>
        <Tab id="events" label="Recent events">
          <RecentEventsTab events={mockEventsData} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default ContainerCronJobDetailPage;
