import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Pagination,
  Button,
  ContextMenu,
  StatusIndicator,
  SearchInput,
  ProgressBar,
  STATUS_THRESHOLDS,
  Tooltip,
  DetailHeader,
  Chip,
  SectionCard,
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconDownload,
  IconDotsCircleHorizontal,
  IconCheck,
  IconChevronDown,
  IconInfoCircle,
  IconTrash,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface NodeData {
  name: string;
  status: 'Ready' | 'NotReady' | 'Unknown';
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
  // Basic Information fields
  architecture: string;
  bootId: string;
  kernelVersion: string;
  kubeProxyVersion: string;
  kubeletVersion: string;
  machineId: string;
  operatingSystem: string;
  systemUuid: string;
}

interface PodRow {
  id: string;
  status: 'Running' | 'Pending' | 'Failed' | 'Succeeded';
  name: string;
  namespace: string;
  image: string;
  ready: string;
  restarts: number;
  ip: string;
  node: string;
  createdAt: string;
}

interface ImageRow {
  id: string;
  name: string;
  size: string;
}

interface TaintRow {
  id: string;
  key: string;
  value: string;
  effect: string;
}

interface ConditionRow {
  id: string;
  type: string;
  status: string;
  reason: string;
  size: string;
  message: string;
  lastTransition: string;
  lastHeartbeat: string;
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
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNodeData: Record<string, NodeData> = {
  'node-control-plane-01': {
    name: 'node-control-plane-01',
    status: 'Ready',
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
    createdAt: 'Jul 25, 2025',
    cpu: { used: 0.24, total: 4 },
    memory: { used: 5.45, total: 14, unit: 'GB' },
    pods: { used: 17, total: 110 },
    conditions: {
      pidPressure: false,
      diskPressure: false,
      memoryPressure: false,
      kubeletReady: true,
    },
    // Basic Information fields
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
    status: 'Running',
    name: 'helm-install-thakicloud-webhook',
    namespace: 'cattle-system',
    image: 'thakicloud/Shell:v0.21',
    ready: '0/1',
    restarts: 0,
    ip: '10.42.0.29',
    node: 'thakicloud',
    createdAt: 'Nov 3, 2025',
  },
  {
    id: '2',
    status: 'Running',
    name: 'coredns-7b98449c4-x2k4m',
    namespace: 'kube-system',
    image: 'rancher/mirrored-coredns-coredns:1.10.1',
    ready: '1/1',
    restarts: 0,
    ip: '10.42.0.30',
    node: 'thakicloud',
    createdAt: 'Nov 3, 2025',
  },
  {
    id: '3',
    status: 'Running',
    name: 'local-path-provisioner-6795b5f9d8-p3n2q',
    namespace: 'kube-system',
    image: 'rancher/local-path-provisioner:v0.0.24',
    ready: '1/1',
    restarts: 0,
    ip: '10.42.0.31',
    node: 'thakicloud',
    createdAt: 'Nov 3, 2025',
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
    status: 'False',
    reason: 'KubeletHasSufficientMemory',
    size: '14 GB',
    message: 'kubelet has sufficient memory available',
    lastTransition: 'Oct 14, 2025',
    lastHeartbeat: 'Jan 15, 2025',
  },
  {
    id: '2',
    type: 'DiskPressure',
    status: 'False',
    reason: 'KubeletHasNoDiskPressure',
    size: '256 GB',
    message: 'kubelet has no disk pressure',
    lastTransition: 'Oct 14, 2025',
    lastHeartbeat: 'Jan 15, 2025',
  },
  {
    id: '3',
    type: 'PIDPressure',
    status: 'False',
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

/* ----------------------------------------
   Condition Card Component
   ---------------------------------------- */

interface ConditionCardProps {
  title: string;
  status: 'Ready' | 'NotReady';
  tooltip: string;
}

function ConditionCard({ title, status, tooltip }: ConditionCardProps) {
  return (
    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 min-w-0">
      <HStack justify="between" align="center">
        <HStack gap={2} align="center">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              status === 'Ready'
                ? 'bg-[var(--color-state-success)]'
                : 'bg-[var(--color-state-danger)]'
            }`}
          >
            <IconCheck size={12} className="text-white" stroke={2} />
          </div>
          <VStack gap={0.5}>
            <span className="text-label-sm text-[var(--color-text-default)] leading-[16px]">
              {title}
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)] leading-[16px]">
              {status}
            </span>
          </VStack>
        </HStack>
        <Tooltip content={tooltip}>
          <button className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
            <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" stroke={1.5} />
          </button>
        </Tooltip>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Resource Usage Bar Component
   ---------------------------------------- */

interface ResourceUsageProps {
  label: string;
  used: number;
  total: number;
  unit?: string;
}

function ResourceUsage({ label, used, total, unit = '' }: ResourceUsageProps) {
  const percentage = Math.round((used / total) * 100);

  return (
    <div className="flex-1 border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <HStack justify="between" align="center" className="mb-1">
        <span className="text-label-sm text-[var(--color-text-default)]">{label}</span>
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {used} of {total} {unit} / {percentage}% Used
        </span>
      </HStack>
      <ProgressBar
        value={percentage}
        max={100}
        showValue={false}
        size="sm"
        thresholds={STATUS_THRESHOLDS.container}
      />
    </div>
  );
}

/* ----------------------------------------
   Pods Tab Content
   ---------------------------------------- */

interface PodsTabProps {
  pods: PodRow[];
}

function PodsTab({ pods }: PodsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const columns: TableColumn<PodRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={value === 'Running' ? 'active' : value === 'Pending' ? 'muted' : 'error'}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
    },
    { key: 'image', label: 'Image', flex: 1, minWidth: columnMinWidths.image },
    { key: 'ready', label: 'Ready', flex: 1, minWidth: columnMinWidths.ready },
    {
      key: 'restarts',
      label: 'Restarts',
      flex: 1,
      minWidth: columnMinWidths.restarts,
    },
    { key: 'ip', label: 'IP', flex: 1, minWidth: columnMinWidths.ip },
    { key: 'node', label: 'Node', flex: 1, minWidth: columnMinWidths.node },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">Pods</h3>
      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Search pods by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          size="sm"
          className="w-[var(--search-input-width)]"
        />
      </HStack>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={pods.length}
      />
      <Table columns={columns} data={pods} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Details Tab Content
   ---------------------------------------- */

interface LabelWithTooltipProps {
  label: string;
  tooltip: string;
}

function LabelWithTooltip({ label, tooltip }: LabelWithTooltipProps) {
  return (
    <span className="flex items-center gap-[2px]">
      {label}
      <Tooltip content={tooltip}>
        <button className="p-0 bg-transparent border-none cursor-pointer">
          <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" stroke={1.5} />
        </button>
      </Tooltip>
    </span>
  );
}

interface DetailsTabProps {
  node: NodeData;
}

function DetailsTab({ node }: DetailsTabProps) {
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
    <SectionCard>
      <SectionCard.Header title="Basic information" />
      <SectionCard.Content gap={3}>
        {basicInfoFields.map((field, index) => (
          <SectionCard.DataRow
            key={field.label}
            label={<LabelWithTooltip label={field.label} tooltip={field.tooltip} />}
            value={field.value}
            showDivider={index > 0}
          />
        ))}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Images Tab Content
   ---------------------------------------- */

interface ImagesTabProps {
  images: ImageRow[];
}

function ImagesTab({ images }: ImagesTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const columns: TableColumn<ImageRow>[] = [
    {
      key: 'name',
      label: 'Image name',
      flex: 1,
      minWidth: columnMinWidths.containerImage,
      sortable: true,
    },
    { key: 'size', label: 'Size', flex: 1, minWidth: columnMinWidths.size, sortable: true },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">Images</h3>
      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Search images by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          size="sm"
          className="w-[var(--search-input-width)]"
        />
      </HStack>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={images.length}
      />
      <Table columns={columns} data={images} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Taints Tab Content
   ---------------------------------------- */

interface TaintsTabProps {
  taints: TaintRow[];
}

function TaintsTab({ taints }: TaintsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const columns: TableColumn<TaintRow>[] = [
    { key: 'key', label: 'Key', flex: 1, sortable: true },
    { key: 'value', label: 'Value', flex: 1, render: (v: string) => v || '-' },
    { key: 'effect', label: 'Effect', flex: 1, sortable: true },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">Taints</h3>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={taints.length}
      />
      <Table columns={columns} data={taints} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Conditions Tab Content
   ---------------------------------------- */

interface ConditionsTabProps {
  conditions: ConditionRow[];
}

function ConditionsTab({ conditions }: ConditionsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const columns: TableColumn<ConditionRow>[] = [
    {
      key: 'type',
      label: 'Condition',
      flex: 1,
      minWidth: columnMinWidths.condition,
      sortable: true,
    },
    { key: 'size', label: 'Size', flex: 1, minWidth: columnMinWidths.size, sortable: true },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      minWidth: columnMinWidths.message,
      sortable: true,
    },
    {
      key: 'lastHeartbeat',
      label: 'Updated',
      flex: 1,
      minWidth: columnMinWidths.updatedAt,
      sortable: true,
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
        Conditions
      </h3>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={conditions.length}
      />
      <Table columns={columns} data={conditions} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Recent Events Tab Content
   ---------------------------------------- */

interface RecentEventsTabProps {
  events: EventRow[];
}

function RecentEventsTab({ events }: RecentEventsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const columns: TableColumn<EventRow>[] = [
    {
      key: 'lastSeen',
      label: 'Last seen',
      flex: 1,
      minWidth: columnMinWidths.lastSeen,
      sortable: true,
    },
    { key: 'type', label: 'Type', flex: 1, minWidth: columnMinWidths.type, sortable: true },
    { key: 'reason', label: 'Reason', flex: 1, minWidth: columnMinWidths.reason, sortable: true },
    {
      key: 'subobject',
      label: 'Subobject',
      flex: 1,
      minWidth: columnMinWidths.subobject,
      sortable: true,
    },
    { key: 'source', label: 'Source', flex: 1, minWidth: columnMinWidths.source, sortable: true },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      minWidth: columnMinWidths.message,
      sortable: true,
    },
    {
      key: 'firstSeen',
      label: 'First seen',
      flex: 1,
      minWidth: columnMinWidths.firstSeen,
      sortable: true,
    },
    { key: 'count', label: 'Count', flex: 1, minWidth: columnMinWidths.count, sortable: true },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)]">{value}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: () => (
        <button className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
          <IconDotsCircleHorizontal
            size={16}
            className="text-[var(--color-text-subtle)]"
            stroke={1.5}
          />
        </button>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
        Recent Events
      </h3>
      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Search events by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          size="sm"
          className="w-[var(--search-input-width)]"
        />
        <HStack gap={1}>
          <Button variant="muted" size="sm" disabled={selectedKeys.length === 0}>
            <IconDownload size={14} stroke={1.5} />
            Download YAML
          </Button>
          <Button variant="muted" size="sm" disabled={selectedKeys.length === 0}>
            <IconTrash size={14} stroke={1.5} />
            Delete
          </Button>
        </HStack>
      </HStack>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={events.length}
        selectedCount={selectedKeys.length}
      />
      <Table
        columns={columns}
        data={events}
        rowKey="id"
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </VStack>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function NodeDetailPage() {
  const { nodeName } = useParams<{ nodeName: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('pods');

  // Get node data
  const node = mockNodeData[nodeName || ''] || mockNodeData['node-control-plane-01'];

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Node: ${node.name}`);
  }, [updateActiveTabLabel, node.name]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Context menu items
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/nodes/${node.name}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/nodes/${node.name}/edit-yaml`),
    },
    {
      id: 'download-yaml',
      label: 'Download YAML',
      onClick: () => console.log('Download YAML'),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete'),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Nodes', href: '/container/nodes' },
                { label: node.name },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>Node: {node.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <ContextMenu items={moreActionsItems} trigger="click" align="right">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={12} stroke={1.5} />}
              >
                More Actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={node.status === 'Ready' ? 'Active' : 'Not Ready'}
              status={node.status === 'Ready' ? 'active' : 'error'}
            />
            <DetailHeader.InfoCard label="Internal IP" value={node.internalIp} copyable />
            <DetailHeader.InfoCard label="Kubernetes version" value={node.kubernetesVersion} />
            <DetailHeader.InfoCard label="OS" value={node.os} />
            <DetailHeader.InfoCard label="Container runtime" value={node.containerRuntime} />
            <DetailHeader.InfoCard
              label={`Labels (${Object.keys(node.labels).length})`}
              value={
                Object.keys(node.labels).length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                    {Object.entries(node.labels)
                      .slice(0, 1)
                      .map(([key, val]) => (
                        <Chip key={key} value={val ? `${key}: ${val}` : key} maxWidth="100%" />
                      ))}
                    {Object.keys(node.labels).length > 1 && (
                      <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                        (+{Object.keys(node.labels).length - 1})
                      </span>
                    )}
                  </div>
                ) : (
                  '-'
                )
              }
            />
            <DetailHeader.InfoCard
              label={`Annotations (${Object.keys(node.annotations).length})`}
              value={
                Object.keys(node.annotations).length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                    {Object.entries(node.annotations)
                      .slice(0, 1)
                      .map(([key, val]) => (
                        <Chip key={key} value={val ? `${key}: ${val}` : key} maxWidth="100%" />
                      ))}
                    {Object.keys(node.annotations).length > 1 && (
                      <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                        (+{Object.keys(node.annotations).length - 1})
                      </span>
                    )}
                  </div>
                ) : (
                  '-'
                )
              }
            />
            <DetailHeader.InfoCard label="Created at" value={node.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Condition Cards */}
        <HStack gap={3} className="w-full">
          <ConditionCard
            title="PID Pressure"
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
        </HStack>

        {/* Resource Usage */}
        <HStack gap={3} className="w-full">
          <ResourceUsage label="CPU" used={node.cpu.used} total={node.cpu.total} />
          <ResourceUsage
            label="Memory"
            used={node.memory.used}
            total={node.memory.total}
            unit={node.memory.unit}
          />
          <ResourceUsage label="Pods" used={node.pods.used} total={node.pods.total} />
        </HStack>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="pods">Pods</Tab>
            <Tab value="details">Details</Tab>
            <Tab value="images">Images</Tab>
            <Tab value="taints">Taints</Tab>
            <Tab value="conditions">Conditions</Tab>
            <Tab value="events">Recent Events</Tab>
          </TabList>

          <TabPanel value="pods">
            <PodsTab pods={mockPodsData} />
          </TabPanel>
          <TabPanel value="details">
            <DetailsTab node={node} />
          </TabPanel>
          <TabPanel value="images">
            <ImagesTab images={mockImagesData} />
          </TabPanel>
          <TabPanel value="taints">
            <TaintsTab taints={mockTaintsData} />
          </TabPanel>
          <TabPanel value="conditions">
            <ConditionsTab conditions={mockConditionsData} />
          </TabPanel>
          <TabPanel value="events">
            <RecentEventsTab events={mockEventsData} />
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default NodeDetailPage;
