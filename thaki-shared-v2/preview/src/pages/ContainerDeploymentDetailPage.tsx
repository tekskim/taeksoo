import { useState, type ReactNode } from 'react';
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
import { Input } from '@shared/components/Input';
import type { TableColumn } from '@shared/components/Table/Table.types';
import {
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
} from '@tabler/icons-react';

interface DeploymentData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  image: string;
  createdAt: string;
  podRestarts: number;
  ready: { current: number; desired: number };
  upToDate: number;
  available: number;
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

const mockDeploymentData: Record<string, DeploymentData> = {
  '1': {
    id: '1',
    name: 'cart-manager',
    status: 'OK',
    namespace: 'default:1.27',
    image: 'nginx:1.27',
    createdAt: 'Jul 25, 2025 10:32:16',
    podRestarts: 3,
    ready: { current: 1, desired: 1 },
    upToDate: 1,
    available: 1,
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'app.kubernetes.io/name': 'cart-manager',
      'app.kubernetes.io/version': '1.0.0',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'cart-manager',
      'meta.helm.sh/release-namespace': 'default',
    },
  },
  '2': {
    id: '2',
    name: 'nginx-ingress-controller',
    status: 'True',
    namespace: 'ingress-nginx',
    image: 'nginx-ingress-controller:v1.9.4',
    createdAt: 'Nov 8, 2025 11:51:27',
    podRestarts: 0,
    ready: { current: 3, desired: 3 },
    upToDate: 3,
    available: 3,
    labels: {
      'app.kubernetes.io/name': 'nginx-ingress',
      'app.kubernetes.io/component': 'controller',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '2',
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
    createdAt: 'Jul 25, 2025 10:32:16',
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
    createdAt: 'Jul 25, 2025 10:32:16',
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
    createdAt: 'Jul 25, 2025 10:32:16',
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
    createdAt: 'Jul 25, 2025 10:32:16',
    containers: ['container-0'],
  },
];

const mockServicesData: ServiceRow[] = [
  {
    id: '1',
    name: 'capi-webhook-service',
    status: 'OK',
    target: '10.43.136.100:443 → webhook-server/TCP',
    selector: 'cluster.x-k8s.io/provider=cluster-api',
    type: 'Cluster IP',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  {
    id: '2',
    name: 'cart-manager-svc',
    status: 'True',
    target: '10.43.136.101:80 → http/TCP',
    selector: 'app=cart-manager',
    type: 'Cluster IP',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
];

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'Available',
    status: 'True',
    reason: 'MinimumReplicasAvailable',
    message: 'Deployment has minimum availability.',
    lastTransition: 'Jul 25, 2025',
    lastUpdate: 'Jul 25, 2025',
  },
  {
    id: '2',
    type: 'Progressing',
    status: 'None',
    reason: 'NewReplicaSetAvailable',
    message: 'ReplicaSet "cart-manager-77" has successfully progressed.',
    lastTransition: 'Jul 25, 2025',
    lastUpdate: 'Jul 25, 2025',
  },
];

const mockEventsData: EventRow[] = [
  {
    id: '1',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'ScalingReplicaSet',
    subobject: '-',
    source: 'deployment-controller',
    message: 'Scaled up replica set cart-manager-77 to 1',
    firstSeen: '30m',
    count: 1,
    name: 'cart-manager.17e83a1b2c3d4e5f',
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

export function ContainerDeploymentDetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId ? decodeURIComponent(rawId) : '';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pods';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const deployment = mockDeploymentData[id] ?? mockDeploymentData['1'];

  const logShell = (pod: string, kind: string) => console.log(`${kind}: ${pod}`);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: (
        <Tooltip
          content={deployment.status === 'Running' ? 'Active' : deployment.status}
          direction="top"
        >
          <span className="max-w-[80px] truncate inline-block">
            <Badge theme="white" size="sm">
              {deployment.status === 'Running' ? 'Active' : deployment.status}
            </Badge>
          </span>
        </Tooltip>
      ),
    },
    {
      label: 'Namespace',
      value: deployment.namespace,
      showCopyButton: true,
      copyText: deployment.namespace,
    },
    {
      label: 'Image',
      value: deployment.image,
      showCopyButton: true,
      copyText: deployment.image,
    },
    { label: 'Created at', value: deployment.createdAt },
    { label: 'Pod restarts', value: String(deployment.podRestarts) },
    { label: 'Ready', value: `${deployment.ready.current}/${deployment.ready.desired}` },
    { label: 'Up-to-date', value: String(deployment.upToDate) },
    { label: 'Available', value: String(deployment.available) },
    makeLabelAnnotationInfoField('Labels', Object.entries(deployment.labels)),
    makeLabelAnnotationInfoField('Annotations', Object.entries(deployment.annotations)),
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader
        title={`Deployment: ${deployment.name}`}
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
            <ContextMenu.Item action={() => console.log('Pause Orchestration')}>
              Pause orchestration
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Redeploy')}>Redeploy</ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Rollback')}>Rollback</ContextMenu.Item>
            <ContextMenu.Item
              action={() => navigate(`/container/deployments/${deployment.id}/edit`)}
            >
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() => navigate(`/container/deployments/${deployment.name}/edit-yaml`)}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'ready', header: 'Ready', sortable: true },
    { key: 'restarts', header: 'Restarts', align: 'right', sortable: true },
    { key: 'ip', header: 'IP', sortable: true },
    { key: 'node', header: 'Node', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'action', header: 'Action', width: 60, align: 'center' },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const filtered = pods.filter((p) =>
    [p.name, p.image, p.status].some((x) =>
      String(x).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Pods</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Search pods by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          className="w-full max-w-[280px]"
        />
        <div className="w-px h-5 bg-[var(--color-border-default)]" />
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
                className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block min-w-0"
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
                className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block min-w-0"
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
                    className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors border-none bg-transparent cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
                    aria-label="Row actions"
                  >
                    <IconDotsCircleHorizontal
                      size={16}
                      className="text-[var(--color-text-subtle)]"
                      stroke={1.5}
                    />
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
                className="text-left w-full text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block min-w-0 border-none bg-transparent p-0"
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
                    className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors border-none bg-transparent cursor-pointer"
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
    { key: 'status', header: 'Size', align: 'right', sortable: true },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'lastSeen', header: 'Last seen', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'reason', header: 'Reason', sortable: true },
    { key: 'subobject', header: 'Subobject', sortable: true },
    { key: 'source', header: 'Source', sortable: true },
    { key: 'message', header: 'Message', sortable: true },
    { key: 'firstSeen', header: 'First seen', sortable: true },
    { key: 'count', header: 'Count', align: 'right', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'action', header: 'Action', width: 60, align: 'center' },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const filtered = events.filter(
    (e) =>
      e.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Recent events</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Search events by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          className="w-full max-w-[280px]"
        />
        <div className="w-px h-5 bg-[var(--color-border-default)]" />
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
                className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block min-w-0"
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
                    className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors border-none bg-transparent cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
                    aria-label="Row actions"
                  >
                    <IconDotsCircleHorizontal
                      size={16}
                      className="text-[var(--color-text-subtle)]"
                      stroke={1.5}
                    />
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

export default ContainerDeploymentDetailPage;
