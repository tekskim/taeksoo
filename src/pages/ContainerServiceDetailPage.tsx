import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  DetailHeader,
  Badge,
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Tooltip,
  Popover,
  SearchInput,
  CopyButton,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconSearch,
  IconDotsCircleHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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
}

interface PortRow {
  id: string;
  name: string;
  port: number;
  protocol: string;
  target: string;
  nodePort?: number;
  publicPorts?: string;
}

interface SelectorRow {
  id: string;
  key: string;
  value: string;
}

interface ConditionRow {
  id: string;
  type: string;
  status: string;
  reason: string;
  message: string;
  lastTransition: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

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
  {
    id: '1',
    key: 'app.kubernetes.io/instance',
    value: 'traefik-kube-system',
  },
  {
    id: '2',
    key: 'app.kubernetes.io/name',
    value: 'traefik',
  },
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

/* ----------------------------------------
   Pods Tab Content
   ---------------------------------------- */

interface PodsTabProps {
  pods: PodRow[];
  onViewLogs: (podName: string) => void;
  onExecuteShell: (podName: string) => void;
}

function PodsTab({ pods, onViewLogs, onExecuteShell }: PodsTabProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [podSearch, setPodSearch] = useState('');

  const filteredPods = pods.filter(
    (pod) =>
      pod.name.toLowerCase().includes(podSearch.toLowerCase()) ||
      pod.image.toLowerCase().includes(podSearch.toLowerCase()) ||
      pod.node.toLowerCase().includes(podSearch.toLowerCase())
  );

  const createPodMenuItems = (row: PodRow): ContextMenuItem[] => {
    return [
      {
        id: 'execute-shell',
        label: 'Execute shell',
        onClick: () => onExecuteShell(row.name),
      },
      {
        id: 'view-logs',
        label: 'View logs',
        onClick: () => onViewLogs(row.name),
      },
      {
        id: 'edit-config',
        label: 'Edit config',
        onClick: () => navigate(`/container/pods/${row.id}/edit`),
      },
      {
        id: 'edit-yaml',
        label: 'Edit YAML',
        onClick: () => navigate(`/container/pods/${row.name}/edit-yaml`),
      },
      {
        id: 'download-yaml',
        label: 'Download YAML',
        onClick: () => console.log('Download YAML:', row.id),
      },
      {
        id: 'delete',
        label: 'Delete',
        status: 'danger',
        onClick: () => console.log('Delete:', row.id),
      },
    ];
  };

  const columns: TableColumn<PodRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (value: string) => (
        <Tooltip content={value}>
          <Badge theme="white" size="sm" className="max-w-[80px]">
            <span className="truncate">{value}</span>
          </Badge>
        </Tooltip>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row: PodRow) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate min-w-0"
          title={value}
          onClick={() => navigate(`/container/pods/${row.id}`)}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
    },
    {
      key: 'ready',
      label: 'Ready',
      flex: 1,
      minWidth: columnMinWidths.ready,
      sortable: true,
    },
    {
      key: 'restarts',
      label: 'Restarts',
      flex: 1,
      minWidth: columnMinWidths.restarts,
      sortable: true,
    },
    {
      key: 'ip',
      label: 'IP',
      flex: 1,
      sortable: true,
    },
    {
      key: 'node',
      label: 'Node',
      flex: 1,
      minWidth: columnMinWidths.node,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate min-w-0"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => {
        const display = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
        return (
          <span className="truncate min-w-0" title={display}>
            {display}
          </span>
        );
      },
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: PodRow) => (
        <ContextMenu items={createPodMenuItems(row)} trigger="click" align="right">
          <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
            <IconDotsCircleHorizontal
              size={16}
              className="text-[var(--color-text-subtle)]"
              stroke={1.5}
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Pods</h3>
      <SearchInput
        value={podSearch}
        onChange={(e) => setPodSearch(e.target.value)}
        onClear={() => setPodSearch('')}
        placeholder="Search pods by attributes"
        size="sm"
        className="w-[var(--search-input-width)]"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(filteredPods.length / 10))}
        onPageChange={setCurrentPage}
        totalItems={filteredPods.length}
        selectedCount={selectedKeys.length}
        showSettings
        onSettingsClick={() => {}}
      />
      <Table
        columns={columns}
        data={filteredPods}
        rowKey="id"
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </VStack>
  );
}

/* ----------------------------------------
   Ports Tab Content
   ---------------------------------------- */

interface PortsTabProps {
  ports: PortRow[];
}

function PortsTab({ ports }: PortsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [portSearch, setPortSearch] = useState('');

  const filteredPorts = ports.filter(
    (port) =>
      port.name.toLowerCase().includes(portSearch.toLowerCase()) ||
      port.protocol.toLowerCase().includes(portSearch.toLowerCase()) ||
      String(port.port).includes(portSearch)
  );

  const columns: TableColumn<PortRow>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
    },
    {
      key: 'port',
      label: 'Port',
      flex: 1,
      minWidth: columnMinWidths.port,
      sortable: true,
    },
    {
      key: 'protocol',
      label: 'Protocol',
      flex: 1,
      minWidth: columnMinWidths.protocol,
      sortable: true,
    },
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      minWidth: columnMinWidths.target,
      sortable: true,
    },
    {
      key: 'nodePort',
      label: 'Node port',
      flex: 1,
      sortable: true,
      render: (value: number | undefined) => value ?? '-',
    },
    {
      key: 'publicPorts',
      label: 'Public ports',
      flex: 1,
      sortable: true,
      render: (value: string | undefined) =>
        value ? (
          <span className="text-[var(--color-action-primary)] cursor-pointer hover:underline">
            {value}
          </span>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Ports</h3>
      <SearchInput
        value={portSearch}
        onChange={(e) => setPortSearch(e.target.value)}
        onClear={() => setPortSearch('')}
        placeholder="Search ports by attributes"
        size="sm"
        className="w-[var(--search-input-width)]"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(filteredPorts.length / 10))}
        onPageChange={setCurrentPage}
        totalItems={filteredPorts.length}
        showSettings
        onSettingsClick={() => {}}
      />
      <Table columns={columns} data={filteredPorts} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Selectors Tab Content
   ---------------------------------------- */

interface SelectorsTabProps {
  selectors: SelectorRow[];
}

function SelectorsTab({ selectors }: SelectorsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectorSearch, setSelectorSearch] = useState('');

  const filteredSelectors = selectors.filter(
    (sel) =>
      sel.key.toLowerCase().includes(selectorSearch.toLowerCase()) ||
      sel.value.toLowerCase().includes(selectorSearch.toLowerCase())
  );

  const columns: TableColumn<SelectorRow>[] = [
    {
      key: 'key',
      label: 'Key',
      flex: 1,
      minWidth: columnMinWidths.key,
      sortable: true,
    },
    {
      key: 'value',
      label: 'Value',
      flex: 1,
      minWidth: columnMinWidths.value,
      sortable: true,
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Selectors</h3>
      <SearchInput
        value={selectorSearch}
        onChange={(e) => setSelectorSearch(e.target.value)}
        onClear={() => setSelectorSearch('')}
        placeholder="Search selectors by attributes"
        size="sm"
        className="w-[var(--search-input-width)]"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(filteredSelectors.length / 10))}
        onPageChange={setCurrentPage}
        totalItems={filteredSelectors.length}
        showSettings
        onSettingsClick={() => {}}
      />
      <Table columns={columns} data={filteredSelectors} rowKey="id" />
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
  const [conditionSearch, setConditionSearch] = useState('');

  const filteredConditions = conditions.filter(
    (cond) =>
      cond.type.toLowerCase().includes(conditionSearch.toLowerCase()) ||
      cond.status.toLowerCase().includes(conditionSearch.toLowerCase()) ||
      cond.message.toLowerCase().includes(conditionSearch.toLowerCase()) ||
      cond.reason.toLowerCase().includes(conditionSearch.toLowerCase())
  );

  const columns: TableColumn<ConditionRow>[] = [
    {
      key: 'type',
      label: 'Condition',
      flex: 1,
      minWidth: columnMinWidths.condition,
      sortable: true,
    },
    {
      key: 'status',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
    },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      minWidth: columnMinWidths.message,
      sortable: true,
      render: (value: string, row: ConditionRow) => (
        <span className="truncate min-w-0" title={`[${row.reason}] ${value}`}>
          [{row.reason}] {value}
        </span>
      ),
    },
    {
      key: 'lastTransition',
      label: 'Updated',
      flex: 1,
      minWidth: columnMinWidths.lastUpdate,
      sortable: true,
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Conditions</h3>
      <SearchInput
        value={conditionSearch}
        onChange={(e) => setConditionSearch(e.target.value)}
        onClear={() => setConditionSearch('')}
        placeholder="Search conditions by attributes"
        size="sm"
        className="w-[var(--search-input-width)]"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(filteredConditions.length / 10))}
        onPageChange={setCurrentPage}
        totalItems={filteredConditions.length}
        showSettings
        onSettingsClick={() => {}}
      />
      <Table columns={columns} data={filteredConditions} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function ContainerServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pods';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Get service data
  const service = mockServiceData[serviceId || ''] || mockServiceData['1'];

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Service: ${service.name}`);
  }, [updateActiveTabLabel, service.name]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Handle opening shell tab in new browser tab
  const handleOpenInNewTab = (tab: ShellTab) => {
    console.log('Open in new tab:', tab);
  };

  // Handle View Logs
  const handleViewLogs = (podName: string) => {
    shellPanel.openConsole(podName, `Logs: ${podName}`);
  };

  // Handle Execute Shell
  const handleExecuteShell = (podName: string) => {
    shellPanel.openConsole(podName, `Shell: ${podName}`);
  };

  // Context menu items for More actions
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/services/${service.id}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/services/${service.name}/edit-yaml`),
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
                { label: 'Services', href: '/container/services' },
                { label: service.name },
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
              <CopyButton value={service.name} size="sm" iconOnly />
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
      bottomPanel={
        <ShellPanel
          isExpanded={shellPanel.isExpanded}
          onExpandedChange={shellPanel.setIsExpanded}
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          onActiveTabChange={shellPanel.setActiveTabId}
          onCloseTab={shellPanel.closeTab}
          onContentChange={shellPanel.updateContent}
          onClear={shellPanel.clearContent}
          onOpenInNewTab={handleOpenInNewTab}
          initialHeight={350}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6}>
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>Service: {service.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <ContextMenu items={moreActionsItems} trigger="click" align="right">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={12} stroke={1.5} />}
              >
                More actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Tooltip content={service.status === 'Running' ? 'Active' : service.status}>
                  <span className="max-w-[80px] truncate">
                    <Badge theme="white" size="sm">
                      {service.status === 'Running' ? 'Active' : service.status}
                    </Badge>
                  </span>
                </Tooltip>
              }
            />
            <DetailHeader.InfoCard label="Namespace" value={service.namespace} copyable />
            <DetailHeader.InfoCard label="Type" value={service.type} />
            <DetailHeader.InfoCard label="Created at" value={service.createdAt} />
            <DetailHeader.InfoCard label="Session affinity" value={service.sessionAffinity} />
            <DetailHeader.InfoCard label="Cluster IP" value={service.clusterIP} copyable />
            <DetailHeader.InfoCard
              label="Load balancer IP"
              value={service.loadBalancerIP}
              copyable
            />
            <DetailHeader.InfoCard label="External IP" value={service.externalIP} copyable />
          </DetailHeader.InfoGrid>

          {/* Second row: Labels, Annotations */}
          <HStack gap={3} className="w-full mt-3">
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Labels ({Object.keys(service.labels).length})
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
                      >
                        {`${key}: ${val}`}
                      </Badge>
                    ))}
                  {Object.keys(service.labels).length > 1 && (
                    <Popover
                      trigger="hover"
                      position="bottom"
                      delay={100}
                      hideDelay={100}
                      content={
                        <div className="p-3 min-w-[120px] max-w-[480px]">
                          <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                            All labels ({Object.keys(service.labels).length})
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
                        +{Object.keys(service.labels).length - 1}
                      </span>
                    </Popover>
                  )}
                </div>
              </VStack>
            </div>
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Annotations ({Object.keys(service.annotations).length})
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
                      >
                        {`${key}: ${val}`}
                      </Badge>
                    ))}
                  {Object.keys(service.annotations).length > 1 && (
                    <Popover
                      trigger="hover"
                      position="bottom"
                      delay={100}
                      hideDelay={100}
                      content={
                        <div className="p-3 min-w-[120px] max-w-[480px]">
                          <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                            All annotations ({Object.keys(service.annotations).length})
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
                        +{Object.keys(service.annotations).length - 1}
                      </span>
                    </Popover>
                  )}
                </div>
              </VStack>
            </div>
          </HStack>
        </DetailHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="pods">Pods</Tab>
            <Tab value="ports">Ports</Tab>
            <Tab value="selectors">Selectors</Tab>
            <Tab value="conditions">Conditions</Tab>
          </TabList>

          <TabPanel value="pods">
            <PodsTab
              pods={mockPodsData}
              onViewLogs={handleViewLogs}
              onExecuteShell={handleExecuteShell}
            />
          </TabPanel>
          <TabPanel value="ports">
            <PortsTab ports={mockPortsData} />
          </TabPanel>
          <TabPanel value="selectors">
            <SelectorsTab selectors={mockSelectorsData} />
          </TabPanel>
          <TabPanel value="conditions">
            <ConditionsTab conditions={mockConditionsData} />
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default ContainerServiceDetailPage;
