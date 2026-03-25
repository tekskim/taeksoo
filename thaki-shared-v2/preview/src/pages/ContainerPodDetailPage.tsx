import { useMemo, useState, useCallback, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  IconCheck,
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
} from '@tabler/icons-react';

interface PodData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  podIP: string;
  createdAt: string;
  workload: string;
  workloadType: string;
  node: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  containers: string[];
}

interface ContainerRow {
  id: string;
  status: string;
  ready: boolean;
  name: string;
  image: string;
  initContainer: boolean;
  restarts: number;
  createdAt: string;
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

const mockPodData: Record<string, PodData> = {
  '1': {
    id: '1',
    name: 'podName',
    status: 'OK',
    namespace: 'default',
    podIP: '10.11.0.11',
    createdAt: 'Jul 25, 2025 10:32:16',
    workload: 'deploymentName',
    workloadType: 'Deployment',
    node: 'nodeName',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'app.kubernetes.io/name': 'pod',
      'app.kubernetes.io/version': '1.0.0',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'pod',
      'meta.helm.sh/release-namespace': 'default',
    },
    containers: [
      'container-0',
      'container-1',
      'container-2',
      'container-3',
      'container-4',
      'container-5',
    ],
  },
  '2': {
    id: '2',
    name: 'nginx-deployment-7fb96c846b-x2vnl',
    status: 'True',
    namespace: 'default',
    podIP: '10.76.0.12',
    createdAt: 'Nov 9, 2025 18:04:44',
    workload: 'nginx-deployment',
    workloadType: 'Deployment',
    node: 'worker-node-1',
    labels: {
      app: 'nginx',
    },
    annotations: {},
    containers: ['nginx'],
  },
};

const mockContainersData: ContainerRow[] = [
  {
    id: '1',
    status: 'OK',
    ready: true,
    name: 'manager',
    image: 'imageName',
    initContainer: true,
    restarts: 1,
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  {
    id: '2',
    status: 'True',
    ready: true,
    name: 'nginx',
    image: 'nginx:1.27',
    initContainer: false,
    restarts: 0,
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    ready: false,
    name: 'sidecar',
    image: 'sidecar:latest',
    initContainer: false,
    restarts: 2,
    createdAt: 'Jul 25, 2025 10:32:16',
  },
];

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'Ready',
    status: 'True',
    reason: 'PodReady',
    message: 'Pod is ready.',
    lastTransition: 'Jul 25, 2025',
    lastUpdate: 'Jul 25, 2025',
  },
  {
    id: '2',
    type: 'ContainersReady',
    status: 'None',
    reason: 'ContainersReady',
    message: 'All containers are ready.',
    lastTransition: 'Jul 25, 2025',
    lastUpdate: 'Jul 25, 2025',
  },
];

const mockEventsData: EventRow[] = [
  {
    id: '1',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'Scheduled',
    subobject: '-',
    source: 'default-scheduler',
    message: 'Successfully assigned default/podName to nodeName',
    firstSeen: '30m',
    count: 1,
    name: 'podName.17e83a1b2c3d4e5f',
  },
  {
    id: '2',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'Pulled',
    subobject: 'spec.containers{manager}',
    source: 'kubelet',
    message: 'Container image "imageName" already present on machine',
    firstSeen: '30m',
    count: 1,
    name: 'podName.17e83a1b2c3d4e6f',
  },
];

const STATUS_COL_WIDTH = 88;
const ACTION_COL_WIDTH = 72;
const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTableDate(value: string): string {
  return value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
}

function TabSectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-default)]">
        <h6 className="text-heading-h6 m-0">{title}</h6>
      </div>
      <div className="p-4 flex flex-col gap-3 min-w-0">{children}</div>
    </div>
  );
}

function ContainersTab({
  containers,
  onExecuteShell,
  onViewLogs,
}: {
  containers: ContainerRow[];
  onExecuteShell: (containerName: string) => void;
  onViewLogs: (containerName: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
    { key: 'ready', header: 'Ready', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'initContainer', header: 'Init container', sortable: true },
    { key: 'restarts', header: 'Restarts', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: ACTION_COL_WIDTH, align: 'center' },
  ];
  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <TabSectionCard title="Containers">
      <Pagination
        totalCount={containers.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />
      <SelectableTable<ContainerRow>
        columns={columns}
        rows={containers}
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
        {containers.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('status')}>
              <Tooltip content={row.status} direction="top">
                <Badge theme="white" size="sm" className="max-w-[80px] inline-flex min-w-0">
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={c('ready')}>
              {row.ready ? (
                <IconCheck size={16} className="text-[var(--color-state-success)]" stroke={2} />
              ) : (
                <span className="text-[var(--color-text-subtle)]">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              {row.name}
            </Table.Td>
            <Table.Td rowData={row} column={c('image')}>
              {row.image}
            </Table.Td>
            <Table.Td rowData={row} column={c('initContainer')}>
              {row.initContainer ? (
                <span className="text-[var(--color-text-default)]">Completed</span>
              ) : (
                <span className="text-[var(--color-text-subtle)]">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={c('restarts')}>
              {row.restarts}
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              <span className="truncate min-w-0" title={stripTableDate(row.createdAt)}>
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
                  <ContextMenu.Item action={() => onExecuteShell(row.name)}>
                    Execute shell
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => onViewLogs(row.name)}>View logs</ContextMenu.Item>
                </ContextMenu.Root>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </TabSectionCard>
  );
}

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
    <TabSectionCard title="Conditions">
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
              <span className="truncate min-w-0" title={`[${row.reason}] ${row.message}`}>
                [{row.reason}] {row.message}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('lastUpdate')}>
              {row.lastUpdate}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
    </TabSectionCard>
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
    <TabSectionCard title="Recent events">
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
              <span className={`${linkClass} truncate min-w-0`} title={row.name}>
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
    </TabSectionCard>
  );
}

export function ContainerPodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'containers';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const pod = useMemo(() => mockPodData[id || '1'] || mockPodData['1'], [id]);

  const handleExecuteShell = useCallback((containerName: string) => {
    console.log('Execute shell:', containerName);
  }, []);

  const handleViewLogs = useCallback((containerName: string) => {
    console.log('View logs:', containerName);
  }, []);

  const infoFields: DetailPageHeaderInfoField[] = useMemo(
    () => [
      {
        label: 'Status',
        value: (
          <Tooltip content={pod.status === 'Running' ? 'Active' : pod.status} direction="top">
            <Badge theme="white" size="sm" className="max-w-[80px] inline-flex min-w-0">
              <span className="truncate">{pod.status === 'Running' ? 'Active' : pod.status}</span>
            </Badge>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: (
          <Link to={`/container/namespaces/${pod.namespace}`} className={linkClass}>
            {pod.namespace}
          </Link>
        ),
        showCopyButton: true,
        copyText: pod.namespace,
      },
      {
        label: 'Pod IP',
        value: pod.podIP,
        showCopyButton: true,
        copyText: pod.podIP,
      },
      { label: 'Created at', value: pod.createdAt },
    ],
    [pod]
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
      <ContextMenu.SubItems label="Execute shell" subContextMenuDirection="right-top">
        {pod.containers.map((container) => (
          <ContextMenu.Item key={container} action={() => handleExecuteShell(container)}>
            {container}
          </ContextMenu.Item>
        ))}
      </ContextMenu.SubItems>
      <ContextMenu.Item action={() => handleViewLogs(pod.name)}>View logs</ContextMenu.Item>
      <ContextMenu.Item action={() => navigate(`/container/pods/${pod.id}/edit`)}>
        Edit config
      </ContextMenu.Item>
      <ContextMenu.Item action={() => navigate(`/container/pods/${pod.name}/edit-yaml`)}>
        Edit YAML
      </ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Download YAML')}>Download YAML</ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Delete')} danger>
        Delete
      </ContextMenu.Item>
    </ContextMenu.Root>
  );

  const labelKeys = Object.keys(pod.labels);
  const annKeys = Object.keys(pod.annotations);

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={`Pod: ${pod.name}`} actions={moreActions} infoFields={infoFields} />

      <div className="flex flex-wrap gap-3 w-full">
        <div className="flex-1 min-w-[180px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]">Workload</span>
            <Link
              to={`/container/deployments/${pod.workload}`}
              className={`text-body-md font-medium ${linkClass}`}
            >
              {pod.workload}
            </Link>
          </div>
        </div>
        <div className="flex-1 min-w-[180px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]">Node</span>
            <Link
              to={`/container/nodes/${pod.node}`}
              className={`text-body-md font-medium ${linkClass}`}
            >
              {pod.node}
            </Link>
          </div>
        </div>
        <div className="flex-1 min-w-[180px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <div className="flex flex-col gap-2">
            <span className="text-label-sm text-[var(--color-text-subtle)]">
              Labels ({labelKeys.length})
            </span>
            <div className="flex items-center gap-1 min-w-0 w-full">
              {Object.entries(pod.labels)
                .slice(0, 1)
                .map(([key, val]) => (
                  <Badge
                    key={key}
                    theme="white"
                    size="sm"
                    className="min-w-0 truncate justify-start text-left"
                  >
                    {`${key}: ${val}`}
                  </Badge>
                ))}
              {labelKeys.length > 1 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[320px]">
                      <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                        All labels ({labelKeys.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {Object.entries(pod.labels).map(([k, v]) => (
                          <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                            <span className="break-all">{`${k}: ${v}`}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                    +{labelKeys.length - 1}
                  </span>
                </Popover>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[180px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <div className="flex flex-col gap-2">
            <span className="text-label-sm text-[var(--color-text-subtle)]">
              Annotations ({annKeys.length})
            </span>
            <div className="flex items-center gap-1 min-w-0 w-full">
              {Object.entries(pod.annotations)
                .slice(0, 1)
                .map(([key, val]) => (
                  <Badge
                    key={key}
                    theme="white"
                    size="sm"
                    className="min-w-0 truncate justify-start text-left"
                  >
                    {`${key}: ${val}`}
                  </Badge>
                ))}
              {annKeys.length > 1 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[320px]">
                      <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                        All annotations ({annKeys.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {Object.entries(pod.annotations).map(([k, v]) => (
                          <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                            <span className="break-all">{`${k}: ${v}`}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                    +{annKeys.length - 1}
                  </span>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="containers" label="Containers">
          <div className="pt-6">
            <ContainersTab
              containers={mockContainersData}
              onExecuteShell={handleExecuteShell}
              onViewLogs={handleViewLogs}
            />
          </div>
        </Tab>
        <Tab id="conditions" label="Conditions">
          <div className="pt-6">
            <ConditionsTab conditions={mockConditionsData} />
          </div>
        </Tab>
        <Tab id="events" label="Recent events">
          <div className="pt-6">
            <RecentEventsTab events={mockEventsData} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default ContainerPodDetailPage;
