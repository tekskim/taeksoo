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
  DetailHeader,
  Chip,
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
  IconDownload,
  IconDotsCircleHorizontal,
  IconChevronDown,
  IconTrash,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface StatefulSetData {
  id: string;
  name: string;
  status: 'Running' | 'Pending' | 'Failed' | 'Paused';
  namespace: string;
  image: string;
  createdAt: string;
  podRestarts: number;
  ready: { current: number; desired: number };
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
  containers: string[];
}

interface ServiceRow {
  id: string;
  name: string;
  status: 'Running' | 'Pending' | 'Failed' | 'Paused';
  target: string;
  selector: string;
  type: string;
  createdAt: string;
}

interface ConditionRow {
  id: string;
  type: string;
  status: string;
  reason: string;
  message: string;
  lastTransition: string;
  lastUpdate: string;
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

const mockStatefulSetData: Record<string, StatefulSetData> = {
  '1': {
    id: '1',
    name: 'statefulsetName',
    status: 'Running',
    namespace: 'default:1.27',
    image: 'nginx:1.27',
    createdAt: '2025-07-25 09:12:20',
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
    status: 'Running',
    namespace: 'database',
    image: 'mysql:8.0',
    createdAt: '2025-11-09 14:30:00',
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
    status: 'Running',
    name: 'podName-77',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 1,
    ip: '10.11.0.11',
    node: 'nodeName',
    createdAt: '2025-07-25 09:12:20',
    containers: [
      'container-0',
      'container-1',
      'container-2',
      'container-3',
      'container-4',
      'container-5',
    ],
  },
];

const mockServicesData: ServiceRow[] = [
  {
    id: '1',
    name: 'statefulset-headless',
    status: 'Running',
    target: '10.0.0.100:80',
    selector: 'app=statefulset',
    type: 'ClusterIP',
    createdAt: '2025-07-25 09:12:20',
  },
];

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'Available',
    status: 'True',
    reason: 'MinimumReplicasAvailable',
    message: 'StatefulSet has minimum availability.',
    lastTransition: '2025-07-25 09:12:30',
    lastUpdate: '2025-07-25 09:12:30',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const createPodMenuItems = (row: PodRow): ContextMenuItem[] => {
    return [
      {
        id: 'execute-shell',
        label: 'Execute Shell',
        onClick: () => onExecuteShell(row.name),
      },
      {
        id: 'view-logs',
        label: 'View Logs',
        onClick: () => onViewLogs(row.name),
      },
      {
        id: 'edit-config',
        label: 'Edit Config',
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
      width: fixedColumns.status,
      align: 'center',
      sortable: true,
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
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
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
      minWidth: columnMinWidths.ip,
      sortable: true,
    },
    {
      key: 'node',
      label: 'Node',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate">
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      flex: 1,
      minWidth: columnMinWidths.action,
      align: 'center',
      render: (_: unknown, row: PodRow) => (
        <ContextMenu items={createPodMenuItems(row)} trigger="click" align="left">
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
      <h3 className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-default)]">
        Pods
      </h3>
      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Search Pods by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          size="sm"
          className="w-[var(--search-input-width)]"
        />
        <HStack gap={1}>
          <Button variant="secondary" size="sm" disabled={selectedKeys.length === 0}>
            <IconDownload size={14} stroke={1.5} />
            Download YAML
          </Button>
          <Button variant="secondary" size="sm" disabled={selectedKeys.length === 0}>
            <IconTrash size={14} stroke={1.5} />
            Delete
          </Button>
        </HStack>
      </HStack>
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
   Services Tab Content
   ---------------------------------------- */

interface ServicesTabProps {
  services: ServiceRow[];
}

function ServicesTab({ services }: ServicesTabProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const createServiceMenuItems = (row: ServiceRow): ContextMenuItem[] => {
    return [
      {
        id: 'edit-config',
        label: 'Edit Config',
        onClick: () => navigate(`/container/services/${row.id}/edit`),
      },
      {
        id: 'edit-yaml',
        label: 'Edit YAML',
        onClick: () => navigate(`/container/services/${row.name}/edit-yaml`),
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

  const columns: TableColumn<ServiceRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: true,
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
      render: (value: string, row: ServiceRow) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          title={value}
          onClick={() => navigate(`/container/services/${row.id}`)}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      sortable: true,
    },
    {
      key: 'selector',
      label: 'Selector',
      flex: 1,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: ServiceRow) => (
        <ContextMenu items={createServiceMenuItems(row)} trigger="click" align="left">
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
      <h3 className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-default)]">
        Services
      </h3>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={services.length}
        selectedCount={selectedKeys.length}
      />
      <Table
        columns={columns}
        data={services}
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
      key: 'type',
      label: 'Condition',
      flex: 1,
      sortable: true,
    },
    {
      key: 'status',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      sortable: true,
      render: (value: string, row: ConditionRow) => (
        <span className="line-clamp-2" title={`[${row.reason}] ${value}`}>
          [{row.reason}] {value}
        </span>
      ),
    },
    {
      key: 'lastUpdate',
      label: 'Updated',
      flex: 1,
      sortable: true,
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-default)]">
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

  const createEventMenuItems = (row: EventRow): ContextMenuItem[] => {
    return [
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

  const columns: TableColumn<EventRow>[] = [
    {
      key: 'lastSeen',
      label: 'Last Seen',
      flex: 1,
      minWidth: columnMinWidths.lastSeen,
      sortable: true,
    },
    { key: 'type', label: 'Type', flex: 1, minWidth: columnMinWidths.type, sortable: true },
    { key: 'reason', label: 'Reason', flex: 1, sortable: true },
    { key: 'subobject', label: 'Subobject', flex: 1, sortable: true },
    { key: 'source', label: 'Source', flex: 1, sortable: true },
    { key: 'message', label: 'Message', flex: 1.5, sortable: true },
    {
      key: 'firstSeen',
      label: 'First Seen',
      flex: 1,
      minWidth: columnMinWidths.firstSeen,
      sortable: true,
    },
    { key: 'count', label: 'Count', flex: 1, minWidth: columnMinWidths.count, sortable: true },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      flex: 1,
      minWidth: columnMinWidths.action,
      align: 'center',
      render: (_: unknown, row: EventRow) => (
        <ContextMenu items={createEventMenuItems(row)} trigger="click" align="left">
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
      <h3 className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-default)]">
        Recent Events
      </h3>
      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Search Events by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          size="sm"
          className="w-[var(--search-input-width)]"
        />
        <HStack gap={1}>
          <Button variant="secondary" size="sm" disabled={selectedKeys.length === 0}>
            <IconDownload size={14} stroke={1.5} />
            Download YAML
          </Button>
          <Button variant="secondary" size="sm" disabled={selectedKeys.length === 0}>
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
   Main Component
   ---------------------------------------- */

export function StatefulSetDetailPage() {
  const { statefulsetId } = useParams<{ statefulsetId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('pods');

  // Get statefulset data
  const statefulset = mockStatefulSetData[statefulsetId || '1'] || mockStatefulSetData['1'];

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`StatefulSet: ${statefulset.name}`);
  }, [updateActiveTabLabel, statefulset.name]);

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

  // Container submenu for Execute Shell
  const containerSubmenu: ContextMenuItem[] = [
    { id: 'container-0', label: 'container-0', onClick: () => handleExecuteShell('container-0') },
    { id: 'container-1', label: 'container-1', onClick: () => handleExecuteShell('container-1') },
    { id: 'container-2', label: 'container-2', onClick: () => handleExecuteShell('container-2') },
    { id: 'container-3', label: 'container-3', onClick: () => handleExecuteShell('container-3') },
    { id: 'container-4', label: 'container-4', onClick: () => handleExecuteShell('container-4') },
    { id: 'container-5', label: 'container-5', onClick: () => handleExecuteShell('container-5') },
  ];

  // Context menu items for More Actions
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'execute-shell',
      label: 'Execute Shell',
      submenu: containerSubmenu,
      onClick: () => console.log('Execute Shell'),
    },
    {
      id: 'redeploy',
      label: 'Redeploy',
      onClick: () => console.log('Redeploy'),
    },
    {
      id: 'edit-config',
      label: 'Edit Config',
      onClick: () => navigate(`/container/statefulsets/${statefulset.id}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/statefulsets/${statefulset.name}/edit-yaml`),
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
          onTabAdd={addNewTab}
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
                { label: 'StatefulSets', href: '/container/statefulsets' },
                { label: statefulset.name },
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
                <DetailHeader.Title>StatefulSet: {statefulset.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <ContextMenu items={moreActionsItems} trigger="click" align="left">
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
                    value={statefulset.status === 'Running' ? 'Active' : statefulset.status}
                    status={
                      statefulset.status === 'Running'
                        ? 'active'
                        : statefulset.status === 'Pending'
                          ? 'building'
                          : statefulset.status === 'Failed'
                            ? 'error'
                            : 'muted'
                    }
                  />
                  <DetailHeader.InfoCard label="Namespace" value={statefulset.namespace} copyable />
                  <DetailHeader.InfoCard label="Image" value={statefulset.image} copyable />
                  <DetailHeader.InfoCard label="Created At" value={statefulset.createdAt} />
                </DetailHeader.InfoGrid>

                {/* Second row: Pod Restarts, Ready, Labels, Annotations */}
                <HStack gap={3} className="w-full mt-3">
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <VStack gap={1}>
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                        Pod Restarts
                      </span>
                      <span className="text-[12px] text-[var(--color-text-default)] font-medium">
                        {statefulset.podRestarts}
                      </span>
                    </VStack>
                  </div>
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <VStack gap={1}>
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                        Ready
                      </span>
                      <span className="text-[12px] text-[var(--color-text-default)] font-medium">
                        {statefulset.ready.current}/{statefulset.ready.desired}
                      </span>
                    </VStack>
                  </div>
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <VStack gap={2}>
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                        Labels ({Object.keys(statefulset.labels).length})
                      </span>
                      <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                        {Object.entries(statefulset.labels)
                          .slice(0, 1)
                          .map(([key, val]) => (
                            <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                          ))}
                        {Object.keys(statefulset.labels).length > 1 && (
                          <span className="text-[11px] text-[var(--color-text-default)] cursor-pointer hover:underline">
                            (+{Object.keys(statefulset.labels).length - 1})
                          </span>
                        )}
                      </div>
                    </VStack>
                  </div>
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <VStack gap={2}>
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                        Annotations ({Object.keys(statefulset.annotations).length})
                      </span>
                      <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                        {Object.entries(statefulset.annotations)
                          .slice(0, 1)
                          .map(([key, val]) => (
                            <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                          ))}
                        {Object.keys(statefulset.annotations).length > 1 && (
                          <span className="text-[11px] text-[var(--color-text-default)] cursor-pointer hover:underline">
                            (+{Object.keys(statefulset.annotations).length - 1})
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
                  <Tab value="services">Services</Tab>
                  <Tab value="conditions">Conditions</Tab>
                  <Tab value="events">Recent Events</Tab>
                </TabList>

                <TabPanel value="pods">
                  <PodsTab
                    pods={mockPodsData}
                    onViewLogs={handleViewLogs}
                    onExecuteShell={handleExecuteShell}
                  />
                </TabPanel>
                <TabPanel value="services">
                  <ServicesTab services={mockServicesData} />
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

      {/* Shell Panel */}
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
    </div>
  );
}

export default StatefulSetDetailPage;
