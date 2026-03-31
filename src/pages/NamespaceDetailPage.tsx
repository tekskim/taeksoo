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
  Badge,
  Pagination,
  DetailHeader,
  Button,
  ContextMenu,
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Tooltip,
  Popover,
  CopyButton,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconSearch,
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconPencilCog,
  IconKey,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ResourceRow {
  id: string;
  type: string;
  active: number;
  processing: number;
  error: number;
  total: number;
}

interface NamespaceData {
  name: string;
  status: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  resources: {
    active: number;
    processing: number;
    error: number;
    total: number;
  };
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNamespaceData: Record<string, NamespaceData> = {
  'production-microservices-platform-namespace': {
    name: 'production-microservices-platform-namespace',
    status: 'Active',
    createdAt: 'Nov 10, 2025 08:12:33',
    labels: { 'kubernetes.io/metadata.name': 'production-microservices-platform-namespace' },
    annotations: {},
    resources: { active: 122, processing: 0, error: 0, total: 138 },
  },
  'monitoring-observability-stack-namespace': {
    name: 'monitoring-observability-stack-namespace',
    status: 'Processing',
    createdAt: 'Nov 10, 2025 15:31:14',
    labels: { 'kubernetes.io/metadata.name': 'monitoring-observability-stack-namespace' },
    annotations: {},
    resources: { active: 80, processing: 12, error: 0, total: 92 },
  },
  'kube-public-cluster-info-public-namespace': {
    name: 'kube-public-cluster-info-public-namespace',
    status: 'Terminating',
    createdAt: 'Nov 10, 2025 17:57:02',
    labels: { 'kubernetes.io/metadata.name': 'kube-public-cluster-info-public-namespace' },
    annotations: {},
    resources: { active: 0, processing: 0, error: 0, total: 5 },
  },
  'kube-system-cluster-components-namespace': {
    name: 'kube-system-cluster-components-namespace',
    status: 'CreateContainerConfigError',
    createdAt: 'Nov 10, 2025 18:09:45',
    labels: { 'kubernetes.io/metadata.name': 'kube-system-cluster-components-namespace' },
    annotations: {},
    resources: { active: 95, processing: 0, error: 3, total: 98 },
  },
  'cattle-clusters-system': {
    name: 'cattle-clusters-system',
    status: 'Active',
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: { 'kubernetes.io/metadata.name': 'cattle-clusters-system' },
    annotations: {},
    resources: { active: 122, processing: 0, error: 0, total: 138 },
  },
  'kube-system': {
    name: 'kube-system',
    status: 'Active',
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: { 'kubernetes.io/metadata.name': 'kube-system' },
    annotations: {},
    resources: { active: 122, processing: 0, error: 0, total: 138 },
  },
  default: {
    name: 'default',
    status: 'Active',
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: { 'kubernetes.io/metadata.name': 'default' },
    annotations: {},
    resources: { active: 10, processing: 0, error: 0, total: 10 },
  },
};

const mockResourcesData: ResourceRow[] = [
  { id: '1', type: 'Nodes', active: 4, processing: 0, error: 0, total: 4 },
  { id: '2', type: 'Pods', active: 45, processing: 0, error: 0, total: 45 },
  { id: '3', type: 'Services', active: 12, processing: 0, error: 0, total: 12 },
  { id: '4', type: 'ConfigMaps', active: 8, processing: 0, error: 0, total: 8 },
  { id: '5', type: 'Secrets', active: 15, processing: 0, error: 0, total: 15 },
];

interface WorkloadRow {
  id: string;
  name: string;
  namespace: string;
  type: string;
  image: string;
  restarts: number;
  createdAt: string;
  health: string;
  status: string;
}

const mockWorkloadsData: WorkloadRow[] = [
  {
    id: '1',
    name: 'frontend-app',
    namespace: 'production',
    type: 'Deployment',
    image: 'thakicloud/frontend:v2.1.0',
    restarts: 0,
    createdAt: 'Jul 25, 2025 10:32:16',
    health: '3 Running',
    status: 'Active',
  },
  {
    id: '2',
    name: 'api-server',
    namespace: 'production',
    type: 'Deployment',
    image: 'thakicloud/api:v1.2.0',
    restarts: 2,
    createdAt: 'Jul 24, 2025 03:19:59',
    health: '5 Running',
    status: 'Active',
  },
  {
    id: '3',
    name: 'fluentd-logger',
    namespace: 'logging',
    type: 'DaemonSet',
    image: 'fluent/fluentd:v1.16',
    restarts: 0,
    createdAt: 'Jul 20, 2025 23:27:51',
    health: '4 Running',
    status: 'Active',
  },
  {
    id: '4',
    name: 'node-exporter',
    namespace: 'monitoring',
    type: 'DaemonSet',
    image: 'prom/node-exporter:v1.6.0',
    restarts: 1,
    createdAt: 'Jul 18, 2025 09:01:17',
    health: '4 Running',
    status: 'Active',
  },
  {
    id: '5',
    name: 'postgres-db',
    namespace: 'database',
    type: 'StatefulSet',
    image: 'postgres:15-alpine',
    restarts: 0,
    createdAt: 'Jul 15, 2025 12:22:26',
    health: '3 Running',
    status: 'Active',
  },
  {
    id: '6',
    name: 'redis-cluster',
    namespace: 'cache',
    type: 'StatefulSet',
    image: 'redis:7.0-alpine',
    restarts: 0,
    createdAt: 'Jul 14, 2025 05:09:09',
    health: '3 Running',
    status: 'Processing',
  },
  {
    id: '7',
    name: 'backup-scheduler',
    namespace: 'system',
    type: 'CronJob',
    image: 'thakicloud/backup:v1.0.0',
    restarts: 0,
    createdAt: 'Jul 10, 2025 01:17:01',
    health: '0 Running',
    status: 'Terminating',
  },
  {
    id: '8',
    name: 'report-generator',
    namespace: 'analytics',
    type: 'CronJob',
    image: 'thakicloud/reports:v2.3.1',
    restarts: 0,
    createdAt: 'Jul 12, 2025 15:43:35',
    health: '0 Running',
    status: 'Active',
  },
  {
    id: '9',
    name: 'data-migration',
    namespace: 'database',
    type: 'Job',
    image: 'thakicloud/migrate:v1.5.0',
    restarts: 0,
    createdAt: 'Jul 25, 2025 10:32:16',
    health: '1 Running',
    status: 'Stopped',
  },
  {
    id: '10',
    name: 'index-rebuild',
    namespace: 'search',
    type: 'Job',
    image: 'elasticsearch:8.9.0',
    restarts: 1,
    createdAt: 'Jul 24, 2025 03:19:59',
    health: '0 Completed',
    status: 'CreateContainerConfigError',
  },
  {
    id: '11',
    name: 'api-server-7d8f9c6b5-x2k4m',
    namespace: 'production',
    type: 'Pod',
    image: 'thakicloud/api:v1.2.0',
    restarts: 0,
    createdAt: 'Jul 25, 2025 10:32:16',
    health: '1 Running',
    status: 'InvalidImageName',
  },
  {
    id: '12',
    name: 'worker-batch-9f7d8e6c4-p3n2q',
    namespace: 'workers',
    type: 'Pod',
    image: 'thakicloud/worker:v3.0.2',
    restarts: 3,
    createdAt: 'Jul 25, 2025 10:32:16',
    health: '1 Running',
    status: 'ImagePullBackOff',
  },
];

interface ConditionRow {
  id: string;
  condition: string;
  status: string;
  message: string;
  updated: string;
}

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    condition: 'NamespaceDeletionDiscoveryFailure',
    status: 'True',
    message: '',
    updated: 'Nov 10, 2025',
  },
  {
    id: '2',
    condition: 'NamespaceDeletionGroupVersionParsingFailure',
    status: 'True',
    message: '',
    updated: 'Nov 10, 2025',
  },
  {
    id: '3',
    condition: 'NamespaceDeletionContentFailure',
    status: 'False',
    message: '',
    updated: 'Nov 10, 2025',
  },
  {
    id: '4',
    condition: 'NamespaceContentRemaining',
    status: 'False',
    message: '',
    updated: 'Nov 10, 2025',
  },
  {
    id: '5',
    condition: 'NamespaceFinalizersRemaining',
    status: 'False',
    message: '',
    updated: 'Nov 10, 2025',
  },
];

/* ----------------------------------------
   Stat Card Component
   ---------------------------------------- */

interface StatCardProps {
  label: string;
  value: number;
  color: 'green' | 'blue' | 'red' | 'black';
}

function StatCard({ label, value, color }: StatCardProps) {
  const colorStyles = {
    green: {
      text: 'text-[var(--color-state-success)]',
    },
    blue: {
      text: 'text-[var(--color-state-info)]',
    },
    red: {
      text: 'text-[var(--color-state-danger)]',
    },
    black: {
      text: 'text-[var(--color-text-default)]',
    },
  };

  return (
    <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
      <VStack gap={1.5}>
        <span className={`text-label-sm ${colorStyles[color].text}`}>{label}</span>
        <span className={`text-heading-h3 ${colorStyles[color].text}`}>{value}</span>
      </VStack>
    </div>
  );
}

/* ----------------------------------------
   Resources Tab Content
   ---------------------------------------- */

interface ResourcesTabProps {
  resources: ResourceRow[];
}

function ResourcesTab({ resources }: ResourcesTabProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const columns: TableColumn<ResourceRow>[] = [
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
      render: (value: string) => (
        <span
          className="block min-w-0 truncate text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'active',
      label: 'Active',
      flex: 1,
      minWidth: columnMinWidths.count,
      sortable: true,
    },
    {
      key: 'processing',
      label: 'Processing',
      flex: 1,
      minWidth: columnMinWidths.count,
      sortable: true,
    },
    {
      key: 'error',
      label: 'Error',
      flex: 1,
      minWidth: columnMinWidths.count,
      sortable: true,
    },
    {
      key: 'total',
      label: 'Total',
      flex: 1,
      minWidth: columnMinWidths.count,
      sortable: true,
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">Resources</h3>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={resources.length}
      />
      <Table columns={columns} data={resources} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Workloads Tab Content
   ---------------------------------------- */

interface WorkloadsTabProps {
  workloads: WorkloadRow[];
}

// Helper function to get context menu items based on workload type
function getWorkloadMenuItems(
  type: string,
  workload: WorkloadRow,
  onAction: (action: string, workload: WorkloadRow) => void
): ContextMenuItem[] {
  const commonItems: ContextMenuItem[] = [
    { id: 'edit-config', label: 'Edit config', onClick: () => onAction('edit-config', workload) },
    { id: 'edit-yaml', label: 'Edit YAML', onClick: () => onAction('edit-yaml', workload) },
    {
      id: 'download-yaml',
      label: 'Download YAML',
      onClick: () => onAction('download-yaml', workload),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => onAction('delete', workload),
    },
  ];

  switch (type) {
    case 'Deployment':
      return [
        {
          id: 'execute-shell',
          label: 'Execute shell',
          onClick: () => onAction('execute-shell', workload),
        },
        {
          id: 'pause-orchestration',
          label: 'Pause orchestration',
          onClick: () => onAction('pause-orchestration', workload),
        },
        { id: 'redeploy', label: 'Redeploy', onClick: () => onAction('redeploy', workload) },
        { id: 'rollback', label: 'Rollback', onClick: () => onAction('rollback', workload) },
        ...commonItems,
      ];
    case 'DaemonSet':
    case 'StatefulSet':
      return [
        {
          id: 'execute-shell',
          label: 'Execute shell',
          onClick: () => onAction('execute-shell', workload),
        },
        { id: 'redeploy', label: 'Redeploy', onClick: () => onAction('redeploy', workload) },
        ...commonItems,
      ];
    case 'CronJob':
      return [
        {
          id: 'execute-shell',
          label: 'Execute shell',
          onClick: () => onAction('execute-shell', workload),
        },
        { id: 'run-now', label: 'Run now', onClick: () => onAction('run-now', workload) },
        { id: 'suspend', label: 'Suspend', onClick: () => onAction('suspend', workload) },
        ...commonItems,
      ];
    case 'Job':
      return [
        {
          id: 'execute-shell',
          label: 'Execute shell',
          onClick: () => onAction('execute-shell', workload),
        },
        ...commonItems,
      ];
    case 'Pod':
      return [
        {
          id: 'execute-shell',
          label: 'Execute shell',
          onClick: () => onAction('execute-shell', workload),
        },
        { id: 'view-logs', label: 'View logs', onClick: () => onAction('view-logs', workload) },
        ...commonItems,
      ];
    default:
      return [
        {
          id: 'execute-shell',
          label: 'Execute shell',
          onClick: () => onAction('execute-shell', workload),
        },
        ...commonItems,
      ];
  }
}

function WorkloadsTab({ workloads }: WorkloadsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(workloads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWorkloads = workloads.slice(startIndex, endIndex);

  const handleMenuAction = (action: string, workload: WorkloadRow) => {
    console.log(`Action "${action}" clicked for workload:`, workload.name);
    // Handle different actions here
  };

  const columns: TableColumn<WorkloadRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (value: string) => (
        <Tooltip content={value}>
          <Badge
            theme={getContainerStatusTheme(value)}
            type="subtle"
            size="sm"
            className="max-w-[80px]"
          >
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
      render: (value: string) => (
        <span
          className="block min-w-0 truncate text-[var(--color-action-primary)] cursor-pointer hover:underline font-medium"
          title={value}
        >
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
      render: (value: string) => (
        <span className="block min-w-0 truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
      render: (value: string) => (
        <span className="block min-w-0 truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.containerImage,
      sortable: true,
      render: (value: string) => (
        <span className="block min-w-0 truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'restarts',
      label: 'Restarts',
      flex: 1,
      minWidth: columnMinWidths.restarts,
      sortable: true,
    },
    {
      key: 'health',
      label: 'Health',
      flex: 1,
      minWidth: columnMinWidths.health,
      sortable: true,
      render: (value: string) => (
        <span className="block min-w-0 truncate" title={value}>
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
        const formatted = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
        return (
          <span className="block min-w-0 truncate" title={formatted}>
            {formatted}
          </span>
        );
      },
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: WorkloadRow) => (
        <ContextMenu
          items={getWorkloadMenuItems(row.type, row, handleMenuAction)}
          trigger="click"
          align="right"
        >
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            onClick={(e) => e.stopPropagation()}
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--action-icon-color)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">Workloads</h3>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={workloads.length}
        selectedCount={selectedKeys.length}
      />
      <Table
        columns={columns}
        data={paginatedWorkloads}
        rowKey="id"
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
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
      key: 'condition',
      label: 'Condition',
      flex: 1,
      minWidth: columnMinWidths.condition,
      sortable: true,
      render: (value: string) => (
        <span className="block min-w-0 truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (value: string) => (
        <Tooltip content={value}>
          <Badge
            theme={getContainerStatusTheme(value)}
            type="subtle"
            size="sm"
            className="max-w-[80px]"
          >
            <span className="truncate">{value}</span>
          </Badge>
        </Tooltip>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      minWidth: columnMinWidths.message,
      sortable: true,
      render: (value: string) => {
        const display = value || '-';
        return (
          <span className="block min-w-0 truncate" title={display}>
            {display}
          </span>
        );
      },
    },
    {
      key: 'updated',
      label: 'Updated',
      flex: 1,
      minWidth: columnMinWidths.updatedAt,
      sortable: true,
      render: (value: string) => (
        <span className="block min-w-0 truncate" title={value}>
          {value}
        </span>
      ),
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
   Main Page Component
   ---------------------------------------- */

export function NamespaceDetailPage() {
  const { namespaceName } = useParams<{ namespaceName: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'resources';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Get namespace data
  const namespace = mockNamespaceData[namespaceName || ''] || {
    name: namespaceName || 'unknown',
    status: 'Active' as const,
    createdAt: 'Nov 6, 2025 21:25:53',
    labels: { 'kubernetes.io/metadata.name': namespaceName || '' },
    annotations: {},
    resources: { active: 0, processing: 0, error: 0, total: 0 },
  };

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Namespace: ${namespace.name}`);
  }, [updateActiveTabLabel, namespace.name]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Context menu items for more actions
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => console.log('Edit Config'),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/namespaces/${namespaceName}/edit-yaml`),
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
                { label: 'Namespaces', href: '/container/namespaces' },
                { label: namespace.name },
              ]}
            />
          }
          actions={
            <>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
                aria-label="Customize cluster appearance"
              >
                <IconPencilCog size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => window.dispatchEvent(new CustomEvent('open-access-token'))}
                aria-label="Access Token"
              >
                <IconKey size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <CopyButton value={namespace.name} size="sm" iconOnly />
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
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>Namespace: {namespace.name}</DetailHeader.Title>
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
                <Tooltip content={namespace.status}>
                  <span className="max-w-full truncate">
                    <Badge
                      theme={getContainerStatusTheme(namespace.status)}
                      type="subtle"
                      size="sm"
                    >
                      {namespace.status}
                    </Badge>
                  </span>
                </Tooltip>
              }
            />
            <DetailHeader.InfoCard label="Created at" value={namespace.createdAt} />
            <DetailHeader.InfoCard
              label={`Labels (${Object.keys(namespace.labels).length})`}
              value={(() => {
                const entries = Object.entries(namespace.labels);
                if (entries.length === 0) return '-';
                const [firstKey, firstVal] = entries[0];
                const text = `${firstKey}: ${firstVal}`;
                return (
                  <div className="flex items-center gap-1 min-w-0 w-full">
                    <Tooltip content={text} position="top">
                      <Badge theme="white" size="sm" className="max-w-full">
                        <span className="truncate">{text}</span>
                      </Badge>
                    </Tooltip>
                    {entries.length > 1 && (
                      <Popover
                        trigger="hover"
                        position="bottom"
                        delay={100}
                        hideDelay={100}
                        content={
                          <div className="p-3 min-w-[120px] max-w-[320px]">
                            <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                              All Labels ({entries.length})
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {entries.map(([k, v], i) => (
                                <Badge key={i} theme="white" size="sm">
                                  {k}: {v}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        }
                      >
                        <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                          +{entries.length - 1}
                        </span>
                      </Popover>
                    )}
                  </div>
                );
              })()}
            />
            <DetailHeader.InfoCard
              label={`Annotations (${Object.keys(namespace.annotations).length})`}
              value={
                Object.keys(namespace.annotations).length > 0
                  ? Object.keys(namespace.annotations).length.toString()
                  : '-'
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Resources Section */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 pt-3 pb-4 w-full">
          <VStack gap={3}>
            <h2 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
              Workload
            </h2>

            {/* Stat Cards */}
            <HStack gap={3} className="w-full">
              <StatCard label="Active" value={namespace.resources.active} color="green" />
              <StatCard label="Processing" value={namespace.resources.processing} color="blue" />
              <StatCard label="Error" value={namespace.resources.error} color="red" />
              <StatCard label="Total" value={namespace.resources.total} color="black" />
            </HStack>
          </VStack>
        </div>

        {/* Tabs Section */}
        <Tabs
          variant="underline"
          size="sm"
          value={activeTab}
          onChange={setActiveTab}
          className="w-full"
        >
          <TabList>
            <Tab value="resources">Resources</Tab>
            <Tab value="workloads">Workloads</Tab>
            <Tab value="conditions">Conditions</Tab>
          </TabList>

          <TabPanel value="resources">
            <ResourcesTab resources={mockResourcesData} />
          </TabPanel>
          <TabPanel value="workloads">
            <WorkloadsTab workloads={mockWorkloadsData} />
          </TabPanel>
          <TabPanel value="conditions">
            <ConditionsTab conditions={mockConditionsData} />
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default NamespaceDetailPage;
