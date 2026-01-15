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
  Tooltip,
  DetailHeader,
  Chip,
  type TableColumn,
  type ContextMenuItem,
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
  IconInfoCircle,
  IconCheck,
  IconChevronDown,
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
  message: string;
  lastTransition: string;
  lastHeartbeat: string;
}

interface EventRow {
  id: string;
  type: string;
  reason: string;
  message: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
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
    createdAt: '2025-07-25 09:12:20',
    cpu: { used: 0.24, total: 4 },
    memory: { used: 5.45, total: 14, unit: 'GB' },
    pods: { used: 17, total: 110 },
    conditions: {
      pidPressure: false,
      diskPressure: false,
      memoryPressure: false,
      kubeletReady: true,
    },
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
    createdAt: '2025-11-03 12:57',
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
    createdAt: '2025-11-03 12:58',
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
    createdAt: '2025-11-03 12:59',
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
    message: 'kubelet has sufficient memory available',
    lastTransition: '2025-10-14 06:59:07',
    lastHeartbeat: '2025-01-15 10:00:00',
  },
  {
    id: '2',
    type: 'DiskPressure',
    status: 'False',
    reason: 'KubeletHasNoDiskPressure',
    message: 'kubelet has no disk pressure',
    lastTransition: '2025-10-14 06:59:07',
    lastHeartbeat: '2025-01-15 10:00:00',
  },
  {
    id: '3',
    type: 'PIDPressure',
    status: 'False',
    reason: 'KubeletHasSufficientPID',
    message: 'kubelet has sufficient PID available',
    lastTransition: '2025-10-14 06:59:07',
    lastHeartbeat: '2025-01-15 10:00:00',
  },
  {
    id: '4',
    type: 'Ready',
    status: 'True',
    reason: 'KubeletReady',
    message: 'kubelet is posting ready status',
    lastTransition: '2025-10-14 06:59:07',
    lastHeartbeat: '2025-01-15 10:00:00',
  },
];

const mockEventsData: EventRow[] = [
  {
    id: '1',
    type: 'Normal',
    reason: 'NodeReady',
    message: 'Node thakicloud status is now: NodeReady',
    count: 1,
    firstSeen: '2025-10-14 06:59:07',
    lastSeen: '2025-10-14 06:59:07',
  },
  {
    id: '2',
    type: 'Normal',
    reason: 'Starting',
    message: 'Starting kubelet.',
    count: 1,
    firstSeen: '2025-10-14 06:59:05',
    lastSeen: '2025-10-14 06:59:05',
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
    <div className="flex-1 border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <HStack justify="between" align="center">
        <HStack gap={2} align="center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            status === 'Ready' 
              ? 'bg-[var(--color-state-success)]' 
              : 'bg-[var(--color-state-danger)]'
          }`}>
            <IconCheck size={12} className="text-white" stroke={2} />
          </div>
          <VStack gap={0.5}>
            <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
              {title}
            </span>
            <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
              {status}
            </span>
          </VStack>
        </HStack>
        <Tooltip content={tooltip}>
          <button className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
            <IconInfoCircle size={16} className="text-[var(--color-text-subtle)]" stroke={1.5} />
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
    <div className="flex-1">
      <HStack justify="between" align="center" className="mb-1">
        <span className="text-[11px] font-medium text-[var(--color-text-default)]">{label}</span>
        <span className="text-[11px] text-[var(--color-text-subtle)]">
          {used} of {total} {unit} / {percentage}% Used
        </span>
      </HStack>
      <ProgressBar value={percentage} size="sm" />
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
      width: '70px',
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
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
    { key: 'namespace', label: 'Namespace', flex: 1, sortable: true },
    { key: 'image', label: 'Image', flex: 1 },
    { key: 'ready', label: 'Ready', width: '80px', align: 'center' },
    { key: 'restarts', label: 'Restarts', width: '80px', align: 'center' },
    { key: 'ip', label: 'IP', flex: 1 },
    { key: 'node', label: 'Node', flex: 1 },
    { key: 'createdAt', label: 'Created At', flex: 1, sortable: true },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-default)]">
        Pods
      </h3>
      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Find Pods with filters"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          size="sm"
          className="w-[280px]"
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

interface DetailsTabProps {
  node: NodeData;
}

function DetailsTab({ node }: DetailsTabProps) {
  return (
    <VStack gap={4}>
      <h3 className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-default)]">
        Node Details
      </h3>
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
        <VStack gap={3}>
          <HStack className="border-b border-[var(--color-border-subtle)] pb-2">
            <span className="w-[200px] text-[12px] font-medium text-[var(--color-text-muted)]">Name</span>
            <span className="text-[12px] text-[var(--color-text-default)]">{node.name}</span>
          </HStack>
          <HStack className="border-b border-[var(--color-border-subtle)] pb-2">
            <span className="w-[200px] text-[12px] font-medium text-[var(--color-text-muted)]">Internal IP</span>
            <span className="text-[12px] text-[var(--color-text-default)]">{node.internalIp}</span>
          </HStack>
          <HStack className="border-b border-[var(--color-border-subtle)] pb-2">
            <span className="w-[200px] text-[12px] font-medium text-[var(--color-text-muted)]">Kubernetes Version</span>
            <span className="text-[12px] text-[var(--color-text-default)]">{node.kubernetesVersion}</span>
          </HStack>
          <HStack className="border-b border-[var(--color-border-subtle)] pb-2">
            <span className="w-[200px] text-[12px] font-medium text-[var(--color-text-muted)]">OS</span>
            <span className="text-[12px] text-[var(--color-text-default)]">{node.os}</span>
          </HStack>
          <HStack className="border-b border-[var(--color-border-subtle)] pb-2">
            <span className="w-[200px] text-[12px] font-medium text-[var(--color-text-muted)]">Container Runtime</span>
            <span className="text-[12px] text-[var(--color-text-default)]">{node.containerRuntime}</span>
          </HStack>
          <HStack>
            <span className="w-[200px] text-[12px] font-medium text-[var(--color-text-muted)]">Created At</span>
            <span className="text-[12px] text-[var(--color-text-default)]">{node.createdAt}</span>
          </HStack>
        </VStack>
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   Images Tab Content
   ---------------------------------------- */

interface ImagesTabProps {
  images: ImageRow[];
}

function ImagesTab({ images }: ImagesTabProps) {
  const columns: TableColumn<ImageRow>[] = [
    { key: 'name', label: 'Image Name', flex: 2, sortable: true },
    { key: 'size', label: 'Size', flex: 1, sortable: true },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-default)]">
        Images
      </h3>
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
  const columns: TableColumn<TaintRow>[] = [
    { key: 'key', label: 'Key', flex: 1, sortable: true },
    { key: 'value', label: 'Value', flex: 1, render: (v: string) => v || '-' },
    { key: 'effect', label: 'Effect', flex: 1, sortable: true },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-default)]">
        Taints
      </h3>
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
  const columns: TableColumn<ConditionRow>[] = [
    { key: 'type', label: 'Type', flex: 1, sortable: true },
    { key: 'status', label: 'Status', width: '80px', align: 'center' },
    { key: 'reason', label: 'Reason', flex: 1 },
    { key: 'message', label: 'Message', flex: 2 },
    { key: 'lastTransition', label: 'Last Transition', flex: 1, sortable: true },
    { key: 'lastHeartbeat', label: 'Last Heartbeat', flex: 1, sortable: true },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-default)]">
        Conditions
      </h3>
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
  const columns: TableColumn<EventRow>[] = [
    { key: 'type', label: 'Type', width: '80px' },
    { key: 'reason', label: 'Reason', flex: 1, sortable: true },
    { key: 'message', label: 'Message', flex: 2 },
    { key: 'count', label: 'Count', width: '80px', align: 'center' },
    { key: 'firstSeen', label: 'First Seen', flex: 1, sortable: true },
    { key: 'lastSeen', label: 'Last Seen', flex: 1, sortable: true },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-default)]">
        Recent Events
      </h3>
      <Table columns={columns} data={events} rowKey="id" />
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
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

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
      label: 'Edit Config',
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
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
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

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>Node: {node.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <ContextMenu items={moreActionsItems} trigger="click" align="right">
                    <Button
                      variant="secondary"
                      size="md"
                      rightIcon={<IconChevronDown size={16} stroke={1.5} />}
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
                  <DetailHeader.InfoCard
                    label="Internal IP"
                    value={node.internalIp}
                    copyable
                  />
                  <DetailHeader.InfoCard
                    label="Kubernetes Version"
                    value={node.kubernetesVersion}
                  />
                  <DetailHeader.InfoCard
                    label="OS"
                    value={node.os}
                  />
                  <DetailHeader.InfoCard
                    label="Container Runtime"
                    value={node.containerRuntime}
                  />
                  <DetailHeader.InfoCard
                    label={`Labels (${Object.keys(node.labels).length})`}
                    value={
                      Object.keys(node.labels).length > 0 ? (
                        <div className="flex flex-wrap gap-1 min-w-0 w-full">
                          {Object.entries(node.labels).slice(0, 1).map(([key, val]) => (
                            <Chip key={key} value={val ? `${key}: ${val}` : key} maxWidth="100%" />
                          ))}
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
                        <div className="flex flex-wrap gap-1 min-w-0 w-full">
                          {Object.entries(node.annotations).slice(0, 1).map(([key, val]) => (
                            <Chip key={key} value={val ? `${key}: ${val}` : key} maxWidth="100%" />
                          ))}
                        </div>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <DetailHeader.InfoCard
                    label="Created At"
                    value={node.createdAt}
                  />
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
                  title="Disk Pressure"
                  status={node.conditions.diskPressure ? 'NotReady' : 'Ready'}
                  tooltip="Disk pressure reports whether the node is experiencing insufficient disk space."
                />
                <ConditionCard
                  title="Memory Pressure"
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
              <HStack gap={6} className="w-full">
                <ResourceUsage label="CPU" used={node.cpu.used} total={node.cpu.total} />
                <ResourceUsage label="Memory" used={node.memory.used} total={node.memory.total} unit={node.memory.unit} />
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default NodeDetailPage;
