import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Popover } from '@shared/components/Popover';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { TableColumn } from '@shared/components/Table/Table.types';
import {
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconX,
} from '@tabler/icons-react';

interface StatefulSetData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  image: string;
  createdAt: string;
  podRestarts: number;
  ready: { current: number; desired: number };
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface PodRow extends Record<string, unknown> {
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
}

interface ServiceRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: string;
  target: string;
  selector: string;
  type: string;
  createdAt: string;
}

interface ConditionRow extends Record<string, unknown> {
  id: string;
  type: string;
  status: string;
  reason: string;
  message: string;
  lastTransition: string;
  lastUpdate: string;
}

interface EventRow extends Record<string, unknown> {
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
}

const mockStatefulSetData: Record<string, StatefulSetData> = {
  '1': {
    id: '1',
    name: 'statefulsetName',
    status: 'OK',
    namespace: 'default:1.27',
    image: 'nginx:1.27',
    createdAt: 'Jul 25, 2025 16:45:11',
    podRestarts: 1,
    ready: { current: 1, desired: 1 },
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'app.kubernetes.io/name': 'statefulset',
      'app.kubernetes.io/version': '1.0.0',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'statefulset',
      'meta.helm.sh/release-namespace': 'default',
    },
  },
  '2': {
    id: '2',
    name: 'mysql-primary',
    status: 'True',
    namespace: 'database',
    image: 'mysql:8.0',
    createdAt: 'Nov 9, 2025 09:12:33',
    podRestarts: 0,
    ready: { current: 1, desired: 1 },
    labels: {
      'app.kubernetes.io/name': 'mysql',
      'app.kubernetes.io/component': 'primary',
    },
    annotations: {
      'statefulset.kubernetes.io/revision': '1',
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
    createdAt: 'Jul 25, 2025 16:47:22',
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
    createdAt: 'Jul 25, 2025 16:51:44',
    containers: ['container-0'],
  },
  {
    id: '4',
    status: 'ImagePullBackOff',
    name: 'podName-80',
    image: 'nginx:1.27',
    ready: '0/1',
    restarts: 3,
    ip: '10.11.0.14',
    node: 'nodeName',
    createdAt: 'Jul 25, 2025 16:53:55',
    containers: ['container-0'],
  },
];

const mockServicesData: ServiceRow[] = [
  {
    id: '1',
    name: 'statefulset-headless',
    status: 'OK',
    target: '10.0.0.100:80',
    selector: 'app=statefulset',
    type: 'ClusterIP',
    createdAt: 'Jul 25, 2025 16:55:06',
  },
];

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'Available',
    status: 'True',
    reason: 'MinimumReplicasAvailable',
    message: 'StatefulSet has minimum availability.',
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
    source: 'statefulset-controller',
    message: 'create Pod podName-77 in StatefulSet statefulsetName successful',
    firstSeen: '30m',
    count: 1,
    name: 'statefulsetName.17e83a1b2c3d4e5f',
  },
];

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
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

export function ContainerStatefulSetDetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId ? decodeURIComponent(rawId) : '';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pods';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const statefulset = mockStatefulSetData[id] ?? mockStatefulSetData['1'];

  const logShell = (pod: string, kind: string) => console.log(`${kind}: ${pod}`);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: (
        <Tooltip
          content={statefulset.status === 'Running' ? 'Active' : statefulset.status}
          direction="top"
        >
          <span className="max-w-[80px] truncate inline-block">
            <Badge theme="white" size="sm">
              {statefulset.status === 'Running' ? 'Active' : statefulset.status}
            </Badge>
          </span>
        </Tooltip>
      ),
    },
    {
      label: 'Namespace',
      value: statefulset.namespace,
      showCopyButton: true,
      copyText: statefulset.namespace,
    },
    {
      label: 'Image',
      value: statefulset.image,
      showCopyButton: true,
      copyText: statefulset.image,
    },
    { label: 'Created at', value: statefulset.createdAt },
    { label: 'Pod restarts', value: String(statefulset.podRestarts) },
    { label: 'Ready', value: `${statefulset.ready.current}/${statefulset.ready.desired}` },
    makeLabelAnnotationInfoField('Labels', Object.entries(statefulset.labels)),
    makeLabelAnnotationInfoField('Annotations', Object.entries(statefulset.annotations)),
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader
        title={`StatefulSet: ${statefulset.name}`}
        infoFields={infoFields}
        actions={
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            subContextMenuDirection="right-top"
            trigger={({ toggle }) => (
              <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                More actions
                <IconChevronDown size={12} stroke={1.5} className="ml-1" />
              </Button>
            )}
          >
            <ContextMenu.SubItems label="Execute shell" subContextMenuDirection="right-top">
              {[
                'container-0',
                'container-1',
                'container-2',
                'container-3',
                'container-4',
                'container-5',
              ].map((c) => (
                <ContextMenu.Item key={c} action={() => logShell(c, 'Shell')}>
                  {c}
                </ContextMenu.Item>
              ))}
            </ContextMenu.SubItems>
            <ContextMenu.Item action={() => console.log('Redeploy')}>Redeploy</ContextMenu.Item>
            <ContextMenu.Item
              action={() => navigate(`/container/statefulsets/${statefulset.id}/edit`)}
            >
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() => navigate(`/container/statefulsets/${statefulset.name}/edit-yaml`)}
            >
              Edit YAML
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Download YAML')}>
              Download YAML
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Delete')} danger>
              Delete
            </ContextMenu.Item>
          </ContextMenu.Root>
        }
      />

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="pods" label="Pods">
          <PodsTab
            pods={mockPodsData}
            onViewLogs={(n) => logShell(n, 'Logs')}
            onExecuteShell={(n) => logShell(n, 'Shell')}
          />
        </Tab>
        <Tab id="services" label="Services">
          <ServicesTab services={mockServicesData} />
        </Tab>
        <Tab id="conditions" label="Conditions">
          <ConditionsTab conditions={mockConditionsData} />
        </Tab>
        <Tab id="events" label="Recent events">
          <EventsTab events={mockEventsData} />
        </Tab>
      </Tabs>
    </div>
  );
}

function PodsTab({
  pods,
  onViewLogs,
  onExecuteShell,
}: {
  pods: PodRow[];
  onViewLogs: (n: string) => void;
  onExecuteShell: (n: string) => void;
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const pageSize = 10;

  const podFilterKeys: FilterKey[] = [
    { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
    { key: 'image', label: 'Image', type: 'input', placeholder: 'Enter image...' },
    { key: 'ip', label: 'IP', type: 'input', placeholder: 'Enter IP...' },
    { key: 'node', label: 'Node', type: 'input', placeholder: 'Enter node...' },
    { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
  ];

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
    { key: 'image', header: 'Image', sortable: true },
    { key: 'ready', header: 'Ready', sortable: true },
    { key: 'restarts', header: 'Restarts', sortable: true },
    { key: 'ip', header: 'IP', sortable: true },
    { key: 'node', header: 'Node', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'action', header: 'Action', width: 60, align: 'center' },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const filtered = useMemo(
    () =>
      pods.filter((p) =>
        appliedFilters.every((f) => {
          const fv = String(f.value ?? '').toLowerCase();
          if (!fv) return true;
          const key = f.key as keyof PodRow;
          return String(p[key] ?? '')
            .toLowerCase()
            .includes(fv);
        })
      ),
    [pods, appliedFilters]
  );
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Pods</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <FilterSearchInput
          filterKeys={podFilterKeys}
          onFilterAdd={handleFilterAdd}
          selectedFilters={appliedFilters}
          placeholder="Search pods by attributes"
          defaultFilterKey="name"
        />
        <div className="w-px h-5 bg-border" />
        <div className="flex items-center gap-1">
          <Button
            variant="muted"
            appearance="outline"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            <IconDownload size={14} stroke={1.5} />
            Download YAML
          </Button>
          <Button
            variant="muted"
            appearance="outline"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            <IconTrash size={14} stroke={1.5} />
            Delete
          </Button>
        </div>
      </div>
      {appliedFilters.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {appliedFilters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
            >
              {filter.label}: {filter.displayValue ?? filter.value}
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
      )}
      <Pagination
        totalCount={filtered.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />
      <SelectableTable<PodRow>
        columns={columns}
        rows={pageRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
      >
        {pageRows.map((row) => (
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
                className="text-primary font-medium cursor-pointer hover:underline truncate block min-w-0"
                title={row.name}
              >
                {row.name}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('image')} />
            <Table.Td rowData={row} column={c('ready')} />
            <Table.Td rowData={row} column={c('restarts')} />
            <Table.Td rowData={row} column={c('ip')} />
            <Table.Td rowData={row} column={c('node')}>
              <span
                className="text-primary font-medium cursor-pointer hover:underline truncate block min-w-0"
                title={row.node}
              >
                {row.node}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              {stripTime(row.createdAt)}
            </Table.Td>
            <Table.Td rowData={row} column={c('action')} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
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
                <ContextMenu.Item action={() => navigate(`/container/pods/${row.id}/edit`)}>
                  Edit config
                </ContextMenu.Item>
                <ContextMenu.Item action={() => navigate(`/container/pods/${row.name}/edit-yaml`)}>
                  Edit YAML
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Download YAML:', row.id)}>
                  Download YAML
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete:', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}

function ServicesTab({ services }: { services: ServiceRow[] }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'target', header: 'Target', sortable: true },
    { key: 'selector', header: 'Selector', width: 160, sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const pageRows = services.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Services</h3>
      <Pagination
        totalCount={services.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />
      <SelectableTable<ServiceRow>
        columns={columns}
        rows={pageRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
      >
        {pageRows.map((row) => (
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
              <button
                type="button"
                className="text-left w-full text-primary font-medium cursor-pointer hover:underline truncate block min-w-0 border-none bg-transparent p-0"
                title={row.name}
                onClick={() => navigate(`/container/services/${row.id}`)}
              >
                {row.name}
              </button>
            </Table.Td>
            <Table.Td rowData={row} column={c('target')} />
            <Table.Td rowData={row} column={c('selector')} />
            <Table.Td rowData={row} column={c('type')} />
            <Table.Td rowData={row} column={c('createdAt')}>
              {stripTime(row.createdAt)}
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
                    aria-label="Row actions"
                  >
                    <IconDotsCircleHorizontal
                      size={16}
                      className="text-[var(--color-text-muted)]"
                      stroke={1.5}
                    />
                  </button>
                )}
              >
                <ContextMenu.Item action={() => navigate(`/container/services/${row.id}/edit`)}>
                  Edit config
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => navigate(`/container/services/${row.name}/edit-yaml`)}
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
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}

function ConditionsTab({ conditions }: { conditions: ConditionRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'type', header: 'Condition', sortable: true },
    { key: 'status', header: 'Size', sortable: true },
    { key: 'message', header: 'Message', sortable: true },
    { key: 'lastUpdate', header: 'Updated', sortable: true },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const pageRows = conditions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Conditions</h3>
      <Pagination
        totalCount={conditions.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />
      <Table columns={columns} rows={pageRows}>
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('type')} />
            <Table.Td rowData={row} column={c('status')} />
            <Table.Td rowData={row} column={c('message')}>
              <span className="truncate block min-w-0" title={`[${row.reason}] ${row.message}`}>
                [{row.reason}] {row.message}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('lastUpdate')} />
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

function EventsTab({ events }: { events: EventRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const pageSize = 10;

  const eventFilterKeys: FilterKey[] = [
    { key: 'reason', label: 'Reason', type: 'input', placeholder: 'Enter reason...' },
    { key: 'message', label: 'Message', type: 'input', placeholder: 'Enter message...' },
    { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
    { key: 'source', label: 'Source', type: 'input', placeholder: 'Enter source...' },
  ];

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

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
    { key: 'action', header: 'Action', width: 60, align: 'center' },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const filtered = useMemo(
    () =>
      events.filter((e) =>
        appliedFilters.every((f) => {
          const fv = String(f.value ?? '').toLowerCase();
          if (!fv) return true;
          const key = f.key as keyof EventRow;
          return String(e[key] ?? '')
            .toLowerCase()
            .includes(fv);
        })
      ),
    [events, appliedFilters]
  );
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Recent events</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <FilterSearchInput
          filterKeys={eventFilterKeys}
          onFilterAdd={handleFilterAdd}
          selectedFilters={appliedFilters}
          placeholder="Search events by attributes"
          defaultFilterKey="reason"
        />
        <div className="w-px h-5 bg-border" />
        <div className="flex items-center gap-1">
          <Button
            variant="muted"
            appearance="outline"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            <IconDownload size={14} stroke={1.5} />
            Download YAML
          </Button>
          <Button
            variant="muted"
            appearance="outline"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            <IconTrash size={14} stroke={1.5} />
            Delete
          </Button>
        </div>
      </div>
      {appliedFilters.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {appliedFilters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
            >
              {filter.label}: {filter.displayValue ?? filter.value}
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
      )}
      <Pagination
        totalCount={filtered.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />
      <SelectableTable<EventRow>
        columns={columns}
        rows={pageRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
      >
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('lastSeen')} />
            <Table.Td rowData={row} column={c('type')} />
            <Table.Td rowData={row} column={c('reason')} />
            <Table.Td rowData={row} column={c('subobject')} />
            <Table.Td rowData={row} column={c('source')} />
            <Table.Td rowData={row} column={c('message')} />
            <Table.Td rowData={row} column={c('firstSeen')} />
            <Table.Td rowData={row} column={c('count')} />
            <Table.Td rowData={row} column={c('name')}>
              <span
                className="text-primary font-medium cursor-pointer hover:underline truncate block min-w-0"
                title={row.name}
              >
                {row.name}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('action')} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
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
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}

export default ContainerStatefulSetDetailPage;
