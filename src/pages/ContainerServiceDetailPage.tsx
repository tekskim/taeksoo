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
  DetailHeader,
  Chip,
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
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
  status: 'Running' | 'Pending' | 'Error';
  namespace: string;
  type: 'ClusterIP' | 'ClusterIP (Headless)' | 'ExternalName' | 'LoadBalancer' | 'NodePort';
  clusterIP: string;
  sessionAffinity: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface PodRow {
  id: string;
  status: 'Running' | 'Pending' | 'Failed' | 'Succeeded';
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
    status: 'Running',
    namespace: 'default',
    type: 'ClusterIP',
    clusterIP: '10.11.111.10',
    sessionAffinity: 'None',
    createdAt: 'Jul 25, 2025',
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
    status: 'Running',
    namespace: 'ingress-nginx',
    type: 'LoadBalancer',
    clusterIP: '10.43.136.100',
    sessionAffinity: 'ClientIP',
    createdAt: 'Nov 8, 2025',
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
    status: 'Running',
    name: 'deploymentName-77f6bb9c69-4ww7f',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 1,
    ip: '10.11.0.11',
    node: 'nodeName',
    createdAt: 'Jul 25, 2025',
  },
  {
    id: '2',
    status: 'Running',
    name: 'deploymentName-77f6bb9c69-5xx8g',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 0,
    ip: '10.11.0.12',
    node: 'nodeName-2',
    createdAt: 'Jul 25, 2025',
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
    status: 'True',
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
        onClick: () => console.log('Delete:', row.id),
      },
    ];
  };

  const columns: TableColumn<PodRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (value: string) => (
        <StatusIndicator
          status={
            value === 'Running'
              ? 'active'
              : value === 'Pending'
                ? 'building'
                : value === 'Failed'
                  ? 'error'
                  : 'muted'
          }
        />
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
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline line-clamp-2"
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
      sortable: true,
    },
    {
      key: 'restarts',
      label: 'Restarts',
      flex: 1,
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
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      flex: 1,
      minWidth: columnMinWidths.action,
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
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={pods.length}
        selectedCount={selectedKeys.length}
      />
      <Table
        columns={columns}
        data={pods}
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
      sortable: true,
    },
    {
      key: 'target',
      label: 'Target',
      flex: 1,
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
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={ports.length}
      />
      <Table columns={columns} data={ports} rowKey="id" />
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
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={selectors.length}
      />
      <Table columns={columns} data={selectors} rowKey="id" />
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
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      flex: 1,
      sortable: false,
    },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      sortable: true,
      render: (value: string, row: ConditionRow) => (
        <span className="truncate" title={`[${row.reason}] ${value}`}>
          [{row.reason}] {value}
        </span>
      ),
    },
    {
      key: 'lastTransition',
      label: 'Updated',
      flex: 1,
      sortable: true,
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Conditions</h3>
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
   Main Page Component
   ---------------------------------------- */

export function ContainerServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('pods');

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

  // Context menu items for More Actions
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
                More Actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={service.status === 'Running' ? 'Active' : service.status}
              status={
                service.status === 'Running'
                  ? 'active'
                  : service.status === 'Pending'
                    ? 'building'
                    : service.status === 'Error'
                      ? 'error'
                      : 'muted'
              }
            />
            <DetailHeader.InfoCard label="Namespace" value={service.namespace} copyable />
            <DetailHeader.InfoCard
              label="Type"
              value={`${service.type} - Cluster IP: ${service.clusterIP}`}
              copyable
            />
            <DetailHeader.InfoCard label="Session affinity" value={service.sessionAffinity} />
            <DetailHeader.InfoCard label="Created at" value={service.createdAt} />
          </DetailHeader.InfoGrid>

          {/* Second row: Labels, Annotations */}
          <HStack gap={3} className="w-full mt-3">
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Labels ({Object.keys(service.labels).length})
                </span>
                <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                  {Object.entries(service.labels)
                    .slice(0, 1)
                    .map(([key, val]) => (
                      <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                    ))}
                  {Object.keys(service.labels).length > 1 && (
                    <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                      (+{Object.keys(service.labels).length - 1})
                    </span>
                  )}
                </div>
              </VStack>
            </div>
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Annotations ({Object.keys(service.annotations).length})
                </span>
                <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                  {Object.entries(service.annotations)
                    .slice(0, 1)
                    .map(([key, val]) => (
                      <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                    ))}
                  {Object.keys(service.annotations).length > 1 && (
                    <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                      (+{Object.keys(service.annotations).length - 1})
                    </span>
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
