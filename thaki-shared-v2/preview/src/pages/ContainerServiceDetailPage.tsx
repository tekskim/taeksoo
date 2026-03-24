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
import { IconChevronDown, IconDotsCircleHorizontal } from '@tabler/icons-react';

interface ServiceData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  type: 'ClusterIP' | 'ClusterIP (Headless)' | 'ExternalName' | 'LoadBalancer' | 'NodePort';
  clusterIP: string;
  loadBalancerIP: string;
  externalIP: string;
  sessionAffinity: string;
  createdAt: string;
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
  [key: string]: unknown;
}

interface PortRow {
  id: string;
  name: string;
  port: number;
  protocol: string;
  target: string;
  nodePort?: number;
  publicPorts?: string;
  [key: string]: unknown;
}

interface SelectorRow {
  id: string;
  key: string;
  value: string;
  [key: string]: unknown;
}

interface ConditionRow {
  id: string;
  type: string;
  status: string;
  reason: string;
  message: string;
  lastTransition: string;
  [key: string]: unknown;
}

const mockServiceData: Record<string, ServiceData> = {
  '1': {
    id: '1',
    name: 'capi-webhook-service',
    status: 'OK',
    namespace: 'default',
    type: 'LoadBalancer',
    clusterIP: '10.11.111.10',
    loadBalancerIP: '203.0.113.10',
    externalIP: '198.51.100.5',
    sessionAffinity: 'None',
    createdAt: 'Jul 25, 2025 10:32:16',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'cluster.x-k8s.io/provider': 'cluster-api',
      'control-plane': 'controller-manager',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'thakicloud-provisioning-capi',
      'meta.helm.sh/release-namespace': 'cattle-provisioning-capi-system',
    },
  },
  '2': {
    id: '2',
    name: 'nginx-service',
    status: 'True',
    namespace: 'ingress-nginx',
    type: 'LoadBalancer',
    clusterIP: '10.43.136.100',
    loadBalancerIP: '203.0.113.50',
    externalIP: '198.51.100.10',
    sessionAffinity: 'ClientIP',
    createdAt: 'Nov 8, 2025 11:51:27',
    labels: {
      'app.kubernetes.io/name': 'nginx',
      'app.kubernetes.io/component': 'controller',
    },
    annotations: {
      'service.beta.kubernetes.io/aws-load-balancer-type': 'nlb',
    },
  },
};

const mockPodsData: PodRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'deploymentName-77f6bb9c69-4ww7f',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 1,
    ip: '10.11.0.11',
    node: 'nodeName',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  {
    id: '2',
    status: 'True',
    name: 'deploymentName-77f6bb9c69-5xx8g',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 0,
    ip: '10.11.0.12',
    node: 'nodeName-2',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'deploymentName-77f6bb9c69-6yy9h',
    image: 'nginx:1.27',
    ready: '0/1',
    restarts: 2,
    ip: '10.11.0.13',
    node: 'nodeName',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  {
    id: '4',
    status: 'ImagePullBackOff',
    name: 'deploymentName-77f6bb9c69-7zz0i',
    image: 'nginx:1.27',
    ready: '0/1',
    restarts: 3,
    ip: '10.11.0.14',
    node: 'nodeName-2',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
];

const mockPortsData: PortRow[] = [
  {
    id: '1',
    name: 'websecure',
    port: 443,
    protocol: 'TCP',
    target: 'websecure',
    nodePort: 31914,
    publicPorts: '443/TCP',
  },
  {
    id: '2',
    name: 'web',
    port: 80,
    protocol: 'TCP',
    target: 'web',
    nodePort: 32167,
    publicPorts: '80/TCP',
  },
];

const mockSelectorsData: SelectorRow[] = [
  { id: '1', key: 'app.kubernetes.io/instance', value: 'traefik-kube-system' },
  { id: '2', key: 'app.kubernetes.io/name', value: 'traefik' },
];

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'Available',
    status: 'True',
    reason: 'MinimumReplicasAvailable',
    message: 'Service has minimum availability.',
    lastTransition: 'Jul 25, 2025',
  },
  {
    id: '2',
    type: 'Progressing',
    status: 'None',
    reason: 'NewReplicaSetAvailable',
    message: 'ReplicaSet has successfully progressed.',
    lastTransition: 'Jul 25, 2025',
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
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [podSearch, setPodSearch] = useState('');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const filteredPods = pods.filter(
    (p) =>
      p.name.toLowerCase().includes(podSearch.toLowerCase()) ||
      p.image.toLowerCase().includes(podSearch.toLowerCase()) ||
      p.node.toLowerCase().includes(podSearch.toLowerCase())
  );
  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'ready', header: 'Ready', sortable: true },
    { key: 'restarts', header: 'Restarts', sortable: true },
    { key: 'ip', header: 'IP', sortable: true },
    { key: 'node', header: 'Node', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: ACTION_COL_WIDTH, align: 'center' },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  return (
    <TabSectionCard title="Pods">
      <input
        type="search"
        value={podSearch}
        onChange={(e) => setPodSearch(e.target.value)}
        placeholder="Search pods by attributes"
        className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
      />
      <Pagination
        totalCount={filteredPods.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
        onSettingClick={() => {}}
        settingAriaLabel="Pagination settings"
      />
      <SelectableTable<PodRow>
        columns={columns}
        rows={filteredPods}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(r) => r.id}
        sort={sort}
        order={order}
        onSortChange={(k, o) => {
          setSort(k ?? '');
          setOrder(o);
        }}
        stickyLastColumn
      >
        {filteredPods.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('status')}>
              <Tooltip content={row.status} direction="top">
                <Badge theme="white" size="sm" className="max-w-[80px] inline-flex min-w-0">
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <Link
                to={`/container/pods/${row.id}`}
                className={`${linkClass} truncate min-w-0 block`}
                title={row.name}
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={c('image')}>
              {row.image}
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
              <span className={`${linkClass} truncate min-w-0 block`} title={row.node}>
                {row.node}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              <span className="truncate min-w-0" title={row.createdAt}>
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
    </TabSectionCard>
  );
}

function PortsTab({ ports }: { ports: PortRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [portSearch, setPortSearch] = useState('');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const filteredPorts = ports.filter(
    (port) =>
      port.name.toLowerCase().includes(portSearch.toLowerCase()) ||
      port.protocol.toLowerCase().includes(portSearch.toLowerCase()) ||
      String(port.port).includes(portSearch)
  );
  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'port', header: 'Port', sortable: true },
    { key: 'protocol', header: 'Protocol', sortable: true },
    { key: 'target', header: 'Target', sortable: true },
    { key: 'nodePort', header: 'Node port', sortable: true },
    { key: 'publicPorts', header: 'Public ports', sortable: true },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  return (
    <TabSectionCard title="Ports">
      <input
        type="search"
        value={portSearch}
        onChange={(e) => setPortSearch(e.target.value)}
        placeholder="Search ports by attributes"
        className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
      />
      <Pagination
        totalCount={filteredPorts.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        onSettingClick={() => {}}
        settingAriaLabel="Pagination settings"
      />
      <Table<PortRow>
        columns={columns}
        rows={filteredPorts}
        sort={sort}
        order={order}
        onSortChange={(k, o) => {
          setSort(k ?? '');
          setOrder(o);
        }}
      >
        {filteredPorts.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('name')}>
              {row.name}
            </Table.Td>
            <Table.Td rowData={row} column={c('port')}>
              {row.port}
            </Table.Td>
            <Table.Td rowData={row} column={c('protocol')}>
              {row.protocol}
            </Table.Td>
            <Table.Td rowData={row} column={c('target')}>
              {row.target}
            </Table.Td>
            <Table.Td rowData={row} column={c('nodePort')}>
              {row.nodePort ?? '-'}
            </Table.Td>
            <Table.Td rowData={row} column={c('publicPorts')}>
              {row.publicPorts ? (
                <span className="text-primary cursor-pointer hover:underline">
                  {row.publicPorts}
                </span>
              ) : (
                '-'
              )}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
    </TabSectionCard>
  );
}

function SelectorsTab({ selectors }: { selectors: SelectorRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectorSearch, setSelectorSearch] = useState('');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const filteredSelectors = selectors.filter(
    (sel) =>
      sel.key.toLowerCase().includes(selectorSearch.toLowerCase()) ||
      sel.value.toLowerCase().includes(selectorSearch.toLowerCase())
  );
  const columns: TableColumn[] = [
    { key: 'key', header: 'Key', sortable: true },
    { key: 'value', header: 'Value', sortable: true },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  return (
    <TabSectionCard title="Selectors">
      <input
        type="search"
        value={selectorSearch}
        onChange={(e) => setSelectorSearch(e.target.value)}
        placeholder="Search selectors by attributes"
        className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
      />
      <Pagination
        totalCount={filteredSelectors.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        onSettingClick={() => {}}
        settingAriaLabel="Pagination settings"
      />
      <Table<SelectorRow>
        columns={columns}
        rows={filteredSelectors}
        sort={sort}
        order={order}
        onSortChange={(k, o) => {
          setSort(k ?? '');
          setOrder(o);
        }}
      >
        {filteredSelectors.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('key')}>
              {row.key}
            </Table.Td>
            <Table.Td rowData={row} column={c('value')}>
              {row.value}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
    </TabSectionCard>
  );
}

function ConditionsTab({ conditions }: { conditions: ConditionRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [conditionSearch, setConditionSearch] = useState('');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const filteredConditions = conditions.filter(
    (cond) =>
      cond.type.toLowerCase().includes(conditionSearch.toLowerCase()) ||
      cond.status.toLowerCase().includes(conditionSearch.toLowerCase()) ||
      cond.message.toLowerCase().includes(conditionSearch.toLowerCase()) ||
      cond.reason.toLowerCase().includes(conditionSearch.toLowerCase())
  );
  const columns: TableColumn[] = [
    { key: 'type', header: 'Condition', sortable: true },
    { key: 'status', header: 'Size', sortable: true },
    { key: 'message', header: 'Message', sortable: true },
    { key: 'lastTransition', header: 'Updated', sortable: true },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  return (
    <TabSectionCard title="Conditions">
      <input
        type="search"
        value={conditionSearch}
        onChange={(e) => setConditionSearch(e.target.value)}
        placeholder="Search conditions by attributes"
        className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
      />
      <Pagination
        totalCount={filteredConditions.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        onSettingClick={() => {}}
        settingAriaLabel="Pagination settings"
      />
      <Table<ConditionRow>
        columns={columns}
        rows={filteredConditions}
        sort={sort}
        order={order}
        onSortChange={(k, o) => {
          setSort(k ?? '');
          setOrder(o);
        }}
      >
        {filteredConditions.map((row) => (
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
            <Table.Td rowData={row} column={c('lastTransition')}>
              {row.lastTransition}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
    </TabSectionCard>
  );
}

export function ContainerServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pods';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const service = useMemo(() => mockServiceData[id || ''] || mockServiceData['1'], [id]);
  const handleViewLogs = useCallback((podName: string) => {
    console.log('View logs:', podName);
  }, []);
  const handleExecuteShell = useCallback((podName: string) => {
    console.log('Execute shell:', podName);
  }, []);

  const infoFields: DetailPageHeaderInfoField[] = useMemo(
    () => [
      {
        label: 'Status',
        value: (
          <Tooltip
            content={service.status === 'Running' ? 'Active' : service.status}
            direction="top"
          >
            <Badge theme="white" size="sm" className="max-w-[80px] inline-flex min-w-0">
              <span className="truncate">
                {service.status === 'Running' ? 'Active' : service.status}
              </span>
            </Badge>
          </Tooltip>
        ),
      },
      {
        label: 'Namespace',
        value: service.namespace,
        showCopyButton: true,
        copyText: service.namespace,
      },
      { label: 'Type', value: service.type },
      { label: 'Created at', value: service.createdAt },
      { label: 'Session affinity', value: service.sessionAffinity },
      {
        label: 'Cluster IP',
        value: service.clusterIP,
        showCopyButton: true,
        copyText: service.clusterIP,
      },
      {
        label: 'Load balancer IP',
        value: service.loadBalancerIP,
        showCopyButton: true,
        copyText: service.loadBalancerIP,
      },
      {
        label: 'External IP',
        value: service.externalIP,
        showCopyButton: true,
        copyText: service.externalIP,
      },
    ],
    [service]
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
      <ContextMenu.Item action={() => navigate(`/container/services/${service.id}/edit`)}>
        Edit config
      </ContextMenu.Item>
      <ContextMenu.Item action={() => navigate(`/container/services/${service.name}/edit-yaml`)}>
        Edit YAML
      </ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Download YAML')}>Download YAML</ContextMenu.Item>
      <ContextMenu.Item action={() => console.log('Delete')} danger>
        Delete
      </ContextMenu.Item>
    </ContextMenu.Root>
  );

  const labelKeys = Object.keys(service.labels);
  const annKeys = Object.keys(service.annotations);

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={`Service: ${service.name}`}
        actions={moreActions}
        infoFields={infoFields}
      />
      <div className="flex flex-wrap gap-3 w-full">
        <div className="flex-1 min-w-[200px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <div className="flex flex-col gap-2">
            <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
              Labels ({labelKeys.length})
            </span>
            <div className="flex items-center gap-1 min-w-0 w-full">
              {Object.entries(service.labels)
                .slice(0, 1)
                .map(([key, val]) => (
                  <Badge
                    key={key}
                    theme="white"
                    size="sm"
                    className="min-w-0 truncate justify-start text-left"
                  >{`${key}: ${val}`}</Badge>
                ))}
              {labelKeys.length > 1 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[480px]">
                      <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                        All labels ({labelKeys.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {Object.entries(service.labels).map(([k, v]) => (
                          <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                            <span className="whitespace-nowrap">{`${k}: ${v}`}</span>
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
        <div className="flex-1 min-w-[200px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <div className="flex flex-col gap-2">
            <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
              Annotations ({annKeys.length})
            </span>
            <div className="flex items-center gap-1 min-w-0 w-full">
              {Object.entries(service.annotations)
                .slice(0, 1)
                .map(([key, val]) => (
                  <Badge
                    key={key}
                    theme="white"
                    size="sm"
                    className="min-w-0 truncate justify-start text-left"
                  >{`${key}: ${val}`}</Badge>
                ))}
              {annKeys.length > 1 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[480px]">
                      <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                        All annotations ({annKeys.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {Object.entries(service.annotations).map(([k, v]) => (
                          <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                            <span className="whitespace-nowrap">{`${k}: ${v}`}</span>
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
        <Tab id="pods" label="Pods">
          <div className="pt-6">
            <PodsTab
              pods={mockPodsData}
              onViewLogs={handleViewLogs}
              onExecuteShell={handleExecuteShell}
            />
          </div>
        </Tab>
        <Tab id="ports" label="Ports">
          <div className="pt-6">
            <PortsTab ports={mockPortsData} />
          </div>
        </Tab>
        <Tab id="selectors" label="Selectors">
          <div className="pt-6">
            <SelectorsTab selectors={mockSelectorsData} />
          </div>
        </Tab>
        <Tab id="conditions" label="Conditions">
          <div className="pt-6">
            <ConditionsTab conditions={mockConditionsData} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default ContainerServiceDetailPage;
