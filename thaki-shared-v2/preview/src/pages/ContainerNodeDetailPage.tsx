import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
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
import { ProgressBar } from '@shared/components/ProgressBar';
import { Input } from '@shared/components/Input';
import type { TableColumn } from '@shared/components/Table/Table.types';
import {
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconHelpCircle,
} from '@tabler/icons-react';

interface NodeData {
  name: string;
  status: string;
  internalIp: string;
  kubernetesVersion: string;
  os: string;
  containerRuntime: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  createdAt: string;
  cpu: { used: number; total: number };
  memory: { used: number; total: number; unit: string };
  pods: { used: number; total: number };
  conditions: {
    pidPressure: boolean;
    diskPressure: boolean;
    memoryPressure: boolean;
    kubeletReady: boolean;
  };
  architecture: string;
  bootId: string;
  kernelVersion: string;
  kubeProxyVersion: string;
  kubeletVersion: string;
  machineId: string;
  operatingSystem: string;
  systemUuid: string;
}

interface PodRow extends Record<string, unknown> {
  id: string;
  status: string;
  name: string;
  namespace: string;
  image: string;
  ready: string;
  restarts: number;
  ip: string;
  node: string;
  createdAt: string;
}

interface ImageRow extends Record<string, unknown> {
  id: string;
  name: string;
  size: string;
}

interface TaintRow extends Record<string, unknown> {
  id: string;
  key: string;
  value: string;
  effect: string;
}

interface ConditionRow extends Record<string, unknown> {
  id: string;
  type: string;
  status: string;
  reason: string;
  size: string;
  message: string;
  lastTransition: string;
  lastHeartbeat: string;
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

const mockNodeData: Record<string, NodeData> = {
  'node-control-plane-01': {
    name: 'node-control-plane-01',
    status: 'OK',
    internalIp: '172.16.0.237',
    kubernetesVersion: 'v1.34',
    os: 'Ubuntu 24.04.3 LTS',
    containerRuntime: 'containerd://2.14-k3s1',
    labels: {
      'beta.kubernetes.io/arch': 'amd64',
      'beta.kubernetes.io/instance-type': 'k3s',
      'beta.kubernetes.io/os': 'linux',
      'kubernetes.io/arch': 'amd64',
      'kubernetes.io/hostname': 'thakicloud',
      'kubernetes.io/os': 'linux',
      'node-role.kubernetes.io/control-plane': 'true',
      'node-role.kubernetes.io/master': 'true',
      'node.kubernetes.io/instance-type': 'k3s',
    },
    annotations: {
      'thakicloud.io/imported-...': '...',
      'alpha.kubernetes.io/provided-node-ip': '172.16.0.237',
      'csi.volume.kubernetes.io/nodeid': '{"driver.csi.io":"thakicloud"}',
    },
    createdAt: 'Jul 25, 2025 16:45:11',
    cpu: { used: 0.24, total: 4 },
    memory: { used: 5.45, total: 14, unit: 'GB' },
    pods: { used: 17, total: 110 },
    conditions: {
      pidPressure: false,
      diskPressure: false,
      memoryPressure: false,
      kubeletReady: true,
    },
    architecture: 'amd64',
    bootId: 'd85b0797-ae7b-40a3-b0ff-4fd479a14d1d',
    kernelVersion: '6.8.0-85-generic',
    kubeProxyVersion: '—',
    kubeletVersion: 'v1.33.5+k3s1',
    machineId: 'b319e1d4e1c84ddbbcba47baf5d9a583',
    operatingSystem: 'linux',
    systemUuid: 'b319e1d4-e1c84ddb-bcba-47baf5d9a583',
  },
};

const mockPodsData: PodRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'helm-install-thakicloud-webhook',
    namespace: 'cattle-system',
    image: 'thakicloud/Shell:v0.21',
    ready: '0/1',
    restarts: 0,
    ip: '10.42.0.29',
    node: 'thakicloud',
    createdAt: 'Nov 3, 2025 09:12:33',
  },
  {
    id: '2',
    status: 'True',
    name: 'coredns-7b98449c4-x2k4m',
    namespace: 'kube-system',
    image: 'rancher/mirrored-coredns-coredns:1.10.1',
    ready: '1/1',
    restarts: 0,
    ip: '10.42.0.30',
    node: 'thakicloud',
    createdAt: 'Nov 3, 2025 10:24:15',
  },
  {
    id: '3',
    status: 'ImagePullBackOff',
    name: 'local-path-provisioner-6795b5f9d8-p3n2q',
    namespace: 'kube-system',
    image: 'rancher/local-path-provisioner:v0.0.24',
    ready: '1/1',
    restarts: 0,
    ip: '10.42.0.31',
    node: 'thakicloud',
    createdAt: 'Nov 3, 2025 11:36:47',
  },
];

const mockImagesData: ImageRow[] = [
  { id: '1', name: 'rancher/mirrored-coredns-coredns:1.10.1', size: '52.5 MB' },
  { id: '2', name: 'rancher/local-path-provisioner:v0.0.24', size: '38.2 MB' },
  { id: '3', name: 'rancher/mirrored-pause:3.6', size: '683 KB' },
  { id: '4', name: 'thakicloud/Shell:v0.21', size: '125.8 MB' },
];

const mockTaintsData: TaintRow[] = [
  { id: '1', key: 'node-role.kubernetes.io/control-plane', value: '', effect: 'NoSchedule' },
];

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'MemoryPressure',
    status: 'None',
    reason: 'KubeletHasSufficientMemory',
    size: '14 GB',
    message: 'kubelet has sufficient memory available',
    lastTransition: 'Oct 14, 2025',
    lastHeartbeat: 'Jan 15, 2025',
  },
  {
    id: '2',
    type: 'DiskPressure',
    status: 'None',
    reason: 'KubeletHasNoDiskPressure',
    size: '256 GB',
    message: 'kubelet has no disk pressure',
    lastTransition: 'Oct 14, 2025',
    lastHeartbeat: 'Jan 15, 2025',
  },
  {
    id: '3',
    type: 'PIDPressure',
    status: 'None',
    reason: 'KubeletHasSufficientPID',
    size: '32768',
    message: 'kubelet has sufficient PID available',
    lastTransition: 'Oct 14, 2025',
    lastHeartbeat: 'Jan 15, 2025',
  },
  {
    id: '4',
    type: 'Ready',
    status: 'True',
    reason: 'KubeletReady',
    size: '—',
    message: 'kubelet is posting ready status',
    lastTransition: 'Oct 14, 2025',
    lastHeartbeat: 'Jan 15, 2025',
  },
];

const mockEventsData: EventRow[] = [
  {
    id: '1',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'reasonText',
    subobject: 'subobjectText',
    source: 'source',
    message: 'Message text',
    firstSeen: '30m',
    count: 1,
    name: 'eventName',
  },
  {
    id: '2',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'reasonText',
    subobject: 'subobjectText',
    source: 'source',
    message: 'Message text',
    firstSeen: '30m',
    count: 1,
    name: 'eventName',
  },
];

function ConditionCard({
  title,
  status,
  tooltip,
}: {
  title: string;
  status: string;
  tooltip: string;
}) {
  return (
    <div className="flex-1 bg-surface-subtle rounded-lg px-4 py-3 min-w-0">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-11 font-medium leading-16 text-text">{title}</span>
          <Badge theme="white" size="sm" className="w-fit">
            {status}
          </Badge>
        </div>
        <Tooltip content={tooltip} direction="top">
          <button
            type="button"
            className="p-1 hover:bg-surface-muted rounded transition-colors border-none bg-transparent cursor-pointer"
          >
            <IconHelpCircle size={14} className="text-text-subtle" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

function ResourceUsage({
  label,
  used,
  total,
  unit = '',
}: {
  label: string;
  used: number;
  total: number;
  unit?: string;
}) {
  const suffix = unit ? ` ${unit}` : '';
  return (
    <div className="flex-1 border border-border rounded-lg px-4 py-3 min-w-0">
      <ProgressBar
        label={`${label}${suffix}`}
        value={used}
        max={total}
        showValue="absolute"
        variant="success"
        className="w-full"
      />
    </div>
  );
}

function LabelWithTooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <span className="flex items-center gap-0.5">
      {label}
      <Tooltip content={tooltip} direction="top">
        <button type="button" className="p-0 bg-transparent border-none cursor-pointer">
          <IconHelpCircle size={14} className="text-text-subtle" />
        </button>
      </Tooltip>
    </span>
  );
}

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

export function ContainerNodeDetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pods';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const id = rawId ? decodeURIComponent(rawId) : '';
  const node = mockNodeData[id] ?? mockNodeData['node-control-plane-01'];

  const labelKeys = Object.keys(node.labels);
  const annKeys = Object.keys(node.annotations);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: (
        <Tooltip content={node.status === 'Ready' ? 'Active' : 'Not Ready'} direction="top">
          <span className="max-w-[80px] truncate inline-block">
            <Badge theme="white" size="sm">
              {node.status === 'Ready' ? 'Active' : 'Not Ready'}
            </Badge>
          </span>
        </Tooltip>
      ),
    },
    {
      label: 'Internal IP',
      value: node.internalIp,
      showCopyButton: true,
      copyText: node.internalIp,
    },
    { label: 'Kubernetes version', value: node.kubernetesVersion },
    { label: 'OS', value: node.os },
    { label: 'Container runtime', value: node.containerRuntime },
    {
      label: `Labels (${labelKeys.length})`,
      value:
        labelKeys.length > 0 ? (
          <div className="flex items-center gap-1 min-w-0 w-full">
            {Object.entries(node.labels)
              .slice(0, 1)
              .map(([key, val]) => (
                <Badge
                  key={key}
                  theme="white"
                  size="sm"
                  className="min-w-0 truncate justify-start text-left"
                >
                  {val ? `${key}: ${val}` : key}
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
                    <div className="text-[10px] leading-[14px] font-medium text-text-muted mb-2">
                      All Labels ({labelKeys.length})
                    </div>
                    <div className="flex flex-col gap-1">
                      {Object.entries(node.labels).map(([k, v]) => (
                        <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                          <span className="break-all">{v ? `${k}: ${v}` : k}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-[10px] leading-[14px] font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors h-5 cursor-pointer">
                  +{labelKeys.length - 1}
                </span>
              </Popover>
            )}
          </div>
        ) : (
          '-'
        ),
    },
    {
      label: `Annotations (${annKeys.length})`,
      value:
        annKeys.length > 0 ? (
          <div className="flex items-center gap-1 min-w-0 w-full">
            {Object.entries(node.annotations)
              .slice(0, 1)
              .map(([key, val]) => (
                <Badge
                  key={key}
                  theme="white"
                  size="sm"
                  className="min-w-0 truncate justify-start text-left"
                >
                  {val ? `${key}: ${val}` : key}
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
                    <div className="text-[10px] leading-[14px] font-medium text-text-muted mb-2">
                      All annotations ({annKeys.length})
                    </div>
                    <div className="flex flex-col gap-1">
                      {Object.entries(node.annotations).map(([k, v]) => (
                        <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                          <span className="break-all">{v ? `${k}: ${v}` : k}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-[10px] leading-[14px] font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors h-5 cursor-pointer">
                  +{annKeys.length - 1}
                </span>
              </Popover>
            )}
          </div>
        ) : (
          '-'
        ),
    },
    { label: 'Created at', value: node.createdAt },
  ];

  const basicInfoFields = [
    {
      label: 'Architecture',
      value: node.architecture,
      tooltip: 'Indicates the CPU architecture used by the node.',
    },
    {
      label: 'Boot ID',
      value: node.bootId,
      tooltip: 'A unique identifier generated when the node last booted.',
    },
    {
      label: 'Container runtime version',
      value: node.containerRuntime,
      tooltip: 'The container runtime and version used to run containers on the node.',
    },
    {
      label: 'Image',
      value: node.os,
      tooltip: 'Operating system image and version running on the node.',
    },
    {
      label: 'Kernel version',
      value: node.kernelVersion,
      tooltip: 'The version of the Linux kernel running on the node.',
    },
    {
      label: 'Kube proxy version',
      value: node.kubeProxyVersion,
      tooltip: 'The version of kube-proxy handling service networking on the node.',
    },
    {
      label: 'Kubelet version',
      value: node.kubeletVersion,
      tooltip: 'The version of the kubelet agent running on the node.',
    },
    {
      label: 'Machine ID',
      value: node.machineId,
      tooltip: "A system-level identifier that uniquely represents the node's machine.",
    },
    {
      label: 'Operating system',
      value: node.operatingSystem,
      tooltip: 'The type of operating system the node is running (linux or windows).',
    },
    {
      label: 'System UUID',
      value: node.systemUuid,
      tooltip: 'A hardware-based UUID that uniquely identifies the node.',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader
        title={`Node: ${node.name}`}
        infoFields={infoFields}
        actions={
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            trigger={({ toggle }) => (
              <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                More actions
                <IconChevronDown size={12} stroke={1.5} className="ml-1" />
              </Button>
            )}
          >
            <ContextMenu.Item
              action={() => navigate(`/container/nodes/${encodeURIComponent(node.name)}/edit`)}
            >
              Edit config
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() => navigate(`/container/nodes/${encodeURIComponent(node.name)}/edit-yaml`)}
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

      <div className="flex gap-3 w-full">
        <ConditionCard
          title="PID pressure"
          status={node.conditions.pidPressure ? 'NotReady' : 'Ready'}
          tooltip="PID pressure indicates whether the node is running low on available process IDs."
        />
        <ConditionCard
          title="Disk pressure"
          status={node.conditions.diskPressure ? 'NotReady' : 'Ready'}
          tooltip="Disk pressure reports whether the node is experiencing insufficient disk space."
        />
        <ConditionCard
          title="Memory pressure"
          status={node.conditions.memoryPressure ? 'NotReady' : 'Ready'}
          tooltip="Memory pressure indicates that the node is running low on available memory resources."
        />
        <ConditionCard
          title="kubelet"
          status={node.conditions.kubeletReady ? 'Ready' : 'NotReady'}
          tooltip="Kubelet readiness reflects whether the node is healthy and ready to run workloads."
        />
      </div>

      <div className="flex gap-3 w-full">
        <ResourceUsage label="CPU" used={node.cpu.used} total={node.cpu.total} />
        <ResourceUsage
          label="Memory"
          used={node.memory.used}
          total={node.memory.total}
          unit={node.memory.unit}
        />
        <ResourceUsage label="Pods" used={node.pods.used} total={node.pods.total} />
      </div>

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="pods" label="Pods">
          <PodsTabContent pods={mockPodsData} />
        </Tab>
        <Tab id="details" label="Details">
          <SectionCard>
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content>
              {basicInfoFields.map((field) => (
                <SectionCard.DataRow
                  key={field.label}
                  label={<LabelWithTooltip label={field.label} tooltip={field.tooltip} />}
                  value={field.value}
                />
              ))}
            </SectionCard.Content>
          </SectionCard>
        </Tab>
        <Tab id="images" label="Images">
          <ImagesTabContent images={mockImagesData} />
        </Tab>
        <Tab id="taints" label="Taints">
          <TaintsTabContent taints={mockTaintsData} />
        </Tab>
        <Tab id="conditions" label="Conditions">
          <NodeConditionsTabContent conditions={mockConditionsData} />
        </Tab>
        <Tab id="events" label="Recent events">
          <RecentEventsTabContent events={mockEventsData} />
        </Tab>
      </Tabs>
    </div>
  );
}

function PodsTabContent({ pods }: { pods: PodRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'image', header: 'Image', sortable: true },
    { key: 'ready', header: 'Ready', sortable: true },
    { key: 'restarts', header: 'Restarts', align: 'right', sortable: true },
    { key: 'ip', header: 'IP', sortable: true },
    { key: 'node', header: 'Node', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const filtered = pods.filter((p) =>
    [p.name, p.namespace, p.image, p.status].some((x) =>
      x.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Pods</h3>
      <Input
        placeholder="Search pods by attributes"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="sm"
        className="w-full max-w-[280px]"
      />
      <Pagination
        totalCount={filtered.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />
      <Table columns={columns} rows={pageRows}>
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
            <Table.Td rowData={row} column={c('namespace')} />
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
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

function ImagesTabContent({ images }: { images: ImageRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'name', header: 'Image name', sortable: true },
    { key: 'size', header: 'Size', align: 'right', sortable: true },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const filtered = images.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Images</h3>
      <Input
        placeholder="Search images by attributes"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="sm"
        className="w-full max-w-[280px]"
      />
      <Pagination
        totalCount={filtered.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />
      <Table columns={columns} rows={pageRows}>
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('name')} />
            <Table.Td rowData={row} column={c('size')} />
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

function TaintsTabContent({ taints }: { taints: TaintRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'key', header: 'Key', sortable: true },
    { key: 'value', header: 'Value', sortable: true },
    { key: 'effect', header: 'Effect', sortable: true },
  ];
  const c = (k: string) => columns.find((col) => col.key === k)!;
  const pageRows = taints.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-16 font-semibold leading-6 text-text">Taints</h3>
      <Pagination
        totalCount={taints.length}
        size={pageSize}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />
      <Table columns={columns} rows={pageRows}>
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('key')} />
            <Table.Td rowData={row} column={c('value')}>
              {row.value || '-'}
            </Table.Td>
            <Table.Td rowData={row} column={c('effect')} />
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

function NodeConditionsTabContent({ conditions }: { conditions: ConditionRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const columns: TableColumn[] = [
    { key: 'type', header: 'Condition', sortable: true },
    { key: 'size', header: 'Size', align: 'right', sortable: true },
    { key: 'message', header: 'Message', sortable: true },
    { key: 'lastHeartbeat', header: 'Updated', sortable: true },
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
            <Table.Td rowData={row} column={c('size')} />
            <Table.Td rowData={row} column={c('message')} />
            <Table.Td rowData={row} column={c('lastHeartbeat')} />
          </Table.Tr>
        ))}
      </Table>
    </div>
  );
}

function RecentEventsTabContent({ events }: { events: EventRow[] }) {
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
              <span className="text-primary">{row.name}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('action')} preventClickPropagation>
              <button
                type="button"
                className="p-1 hover:bg-surface-muted rounded transition-colors border-none bg-transparent cursor-pointer"
              >
                <IconDotsCircleHorizontal size={16} className="text-text-subtle" stroke={1.5} />
              </button>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}

export default ContainerNodeDetailPage;
