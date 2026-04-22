import { useState, useEffect, useMemo } from 'react';
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
  SearchInput,
  DetailHeader,
  Badge,
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Tooltip,
  Popover,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { getContainerStatusTheme } from './containerStatusUtils';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import {
  IconDownload,
  IconDotsCircleHorizontal,
  IconChevronDown,
  IconTrash,
  IconCheck,
} from '@tabler/icons-react';

const PAGE_SIZE = 10;

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PodData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  podIP: string;
  createdAt: string;
  workload: string;
  workloadType: string;
  node: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  containers: string[];
}

interface ContainerRow {
  id: string;
  status: string;
  ready: boolean;
  name: string;
  image: string;
  initContainer: boolean;
  restarts: number;
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

const mockPodData: Record<string, PodData> = {
  '1': {
    id: '1',
    name: 'podName',
    status: 'Running',
    namespace: 'default',
    podIP: '10.11.0.11',
    createdAt: 'Jul 25, 2026 10:32:16',
    workload: 'deploymentName',
    workloadType: 'Deployment',
    node: 'nodeName',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'app.kubernetes.io/name': 'pod',
      'app.kubernetes.io/version': '1.0.0',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'pod',
      'meta.helm.sh/release-namespace': 'default',
    },
    containers: [
      'container-0',
      'container-1',
      'container-2',
      'container-3',
      'container-4',
      'container-5',
    ],
  },
  '2': {
    id: '2',
    name: 'nginx-deployment-7fb96c846b-x2vnl',
    status: 'Running',
    namespace: 'default',
    podIP: '10.76.0.12',
    createdAt: 'Nov 9, 2026 18:04:44',
    workload: 'nginx-deployment',
    workloadType: 'Deployment',
    node: 'worker-node-1',
    labels: {
      app: 'nginx',
    },
    annotations: {},
    containers: ['nginx'],
  },
};

function getMockPodByRouteParam(podIdOrName: string | undefined): PodData {
  if (!podIdOrName) return mockPodData['1'];
  const byKey = mockPodData[podIdOrName];
  if (byKey) return byKey;
  const byName = Object.values(mockPodData).find((p) => p.name === podIdOrName);
  if (byName) return byName;
  return mockPodData['1'];
}

const mockContainersData: ContainerRow[] = [
  {
    id: '1',
    status: 'Running',
    ready: true,
    name: 'manager',
    image: 'imageName',
    initContainer: true,
    restarts: 1,
    createdAt: 'Jul 25, 2026 10:32:16',
  },
  {
    id: '2',
    status: 'Succeeded',
    ready: true,
    name: 'nginx',
    image: 'nginx:1.27',
    initContainer: false,
    restarts: 0,
    createdAt: 'Jul 25, 2026 10:32:16',
  },
  {
    id: '3',
    status: 'Failed',
    ready: false,
    name: 'sidecar',
    image: 'sidecar:latest',
    initContainer: false,
    restarts: 2,
    createdAt: 'Jul 25, 2026 10:32:16',
  },
];

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'Ready',
    status: 'True',
    reason: 'PodReady',
    message: 'Pod is ready.',
    lastTransition: 'Jul 25, 2026',
    lastUpdate: 'Jul 25, 2026',
  },
  {
    id: '2',
    type: 'ContainersReady',
    status: 'True',
    reason: 'ContainersReady',
    message: 'All containers are ready.',
    lastTransition: 'Jul 25, 2026',
    lastUpdate: 'Jul 25, 2026',
  },
];

const mockEventsData: EventRow[] = [
  {
    id: '1',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'Scheduled',
    subobject: '-',
    source: 'default-scheduler',
    message: 'Successfully assigned default/podName to nodeName',
    firstSeen: '30m',
    count: 1,
    name: 'podName.17e83a1b2c3d4e5f',
  },
  {
    id: '2',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'Pulled',
    subobject: 'spec.containers{manager}',
    source: 'kubelet',
    message: 'Container image "imageName" already present on machine',
    firstSeen: '30m',
    count: 1,
    name: 'podName.17e83a1b2c3d4e6f',
  },
];

/* ----------------------------------------
   Containers Tab Content
   ---------------------------------------- */

interface ContainersTabProps {
  containers: ContainerRow[];
  onExecuteShell: (containerName: string) => void;
  onViewLogs: (containerName: string) => void;
}

function ContainersTab({ containers, onExecuteShell, onViewLogs }: ContainersTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const totalPages = Math.max(1, Math.ceil(containers.length / PAGE_SIZE));
  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const effectivePage = Math.min(currentPage, totalPages);
  const start = (effectivePage - 1) * PAGE_SIZE;
  const paginatedContainers = containers.slice(start, start + PAGE_SIZE);

  const createContainerMenuItems = (row: ContainerRow): ContextMenuItem[] => {
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
    ];
  };

  const columns: TableColumn<ContainerRow>[] = [
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
      key: 'ready',
      label: 'Ready',
      flex: 1,
      minWidth: columnMinWidths.ready,
      sortable: true,
      render: (value: boolean) =>
        value ? (
          <IconCheck size={16} className="text-[var(--color-state-success)]" stroke={2} />
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.containerImage,
      sortable: true,
    },
    {
      key: 'initContainer',
      label: 'Init container',
      flex: 1,
      minWidth: columnMinWidths.initContainer,
      sortable: true,
      render: (value: boolean) =>
        value ? (
          <span className="text-[var(--color-text-default)]">Completed</span>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
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
      sticky: 'right',
      render: (_: unknown, row: ContainerRow) => (
        <ContextMenu items={createContainerMenuItems(row)} trigger="click" align="right">
          <button
            aria-label="Row actions"
            className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
          >
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
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Containers</h3>
      <Pagination
        currentPage={effectivePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={containers.length}
        selectedCount={selectedKeys.length}
      />
      <Table
        columns={columns}
        data={paginatedContainers}
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

  const totalPages = Math.max(1, Math.ceil(conditions.length / PAGE_SIZE));
  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const effectivePage = Math.min(currentPage, totalPages);
  const start = (effectivePage - 1) * PAGE_SIZE;
  const paginatedConditions = conditions.slice(start, start + PAGE_SIZE);

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
      key: 'lastUpdate',
      label: 'Updated',
      flex: 1,
      minWidth: columnMinWidths.updatedAt,
      sortable: true,
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Conditions</h3>
      <Pagination
        currentPage={effectivePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={conditions.length}
      />
      <Table columns={columns} data={paginatedConditions} rowKey="id" />
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

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return events;
    return events.filter((row) => {
      const haystack = [row.name, row.type, row.reason, row.message, row.source]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [events, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const effectivePage = Math.min(currentPage, totalPages);
  const start = (effectivePage - 1) * PAGE_SIZE;
  const paginatedEvents = filteredEvents.slice(start, start + PAGE_SIZE);

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
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate min-w-0"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_: unknown, row: EventRow) => (
        <ContextMenu items={createEventMenuItems(row)} trigger="click" align="right">
          <button
            aria-label="Row actions"
            className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
          >
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
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Recent events</h3>
      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Search events by attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          size="sm"
          className="w-[var(--search-input-width)]"
        />
        <div className="w-px h-5 bg-[var(--color-border-default)]" />
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
        currentPage={effectivePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredEvents.length}
        selectedCount={selectedKeys.length}
      />
      <Table
        columns={columns}
        data={paginatedEvents}
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

export function PodDetailPage() {
  const { podId } = useParams<{ podId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'containers';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Get pod data (route param may be id or pod name — other pages link by name)
  const pod = getMockPodByRouteParam(podId);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Pod: ${pod.name}`);
  }, [updateActiveTabLabel, pod.name]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Handle opening shell tab in new browser tab
  const handleOpenInNewTab = (tab: ShellTab) => {
    console.log('Open in new tab:', tab);
  };

  // Handle Execute Shell
  const handleExecuteShell = (containerName: string) => {
    shellPanel.openConsole(containerName, `Shell: ${containerName}`);
  };

  // Handle View Logs
  const handleViewLogs = (containerName: string) => {
    shellPanel.openConsole(containerName, `Logs: ${containerName}`);
  };

  // Container submenu for Execute Shell
  const containerSubmenu: ContextMenuItem[] = pod.containers.map((container) => ({
    id: container,
    label: container,
    onClick: () => handleExecuteShell(container),
  }));

  // Context menu items for More actions
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'execute-shell',
      label: 'Execute shell',
      submenu: containerSubmenu,
    },
    {
      id: 'view-logs',
      label: 'View logs',
      onClick: () => handleViewLogs(pod.name),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/pods/${pod.name}/edit-yaml`),
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb items={[{ label: 'Pods', href: '/container/pods' }, { label: pod.name }]} />
          }
          actions={<ContainerTopBarActions />}
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
          minHeight={300}
          sidebarOpen={sidebarOpen}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>Pod: {pod.name}</DetailHeader.Title>
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
                <Tooltip content={pod.status === 'Running' ? 'Active' : pod.status}>
                  <span className="max-w-full truncate">
                    <Badge
                      theme={getContainerStatusTheme(
                        pod.status === 'Running' ? 'Active' : pod.status
                      )}
                      type="subtle"
                      size="sm"
                    >
                      {pod.status === 'Running' ? 'Active' : pod.status}
                    </Badge>
                  </span>
                </Tooltip>
              }
            />
            <DetailHeader.InfoCard
              label="Namespace"
              value={pod.namespace}
              link={`/container/namespaces/${pod.namespace}`}
              copyable
            />
            <DetailHeader.InfoCard label="Pod IP" value={pod.podIP} copyable />
            <DetailHeader.InfoCard label="Created at" value={pod.createdAt} />
          </DetailHeader.InfoGrid>

          {/* Second row: Workload, Node, Labels, Annotations */}
          <HStack gap={3} className="w-full mt-3">
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3">
              <VStack gap={1.5}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Workload</span>
                <span
                  className="text-body-md font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline"
                  onClick={() => navigate(`/container/deployments/${pod.workload}`)}
                >
                  {pod.workload}
                </span>
              </VStack>
            </div>
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3">
              <VStack gap={1.5}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">Node</span>
                <span
                  className="text-body-md font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline"
                  onClick={() => navigate(`/container/nodes/${pod.node}`)}
                >
                  {pod.node}
                </span>
              </VStack>
            </div>
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Labels ({Object.keys(pod.labels).length})
                </span>
                <div className="flex items-center gap-1 min-w-0 w-full">
                  {Object.entries(pod.labels)
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
                  {Object.keys(pod.labels).length > 1 && (
                    <Popover
                      trigger="hover"
                      position="bottom"
                      delay={100}
                      hideDelay={100}
                      content={
                        <div className="p-3 min-w-[160px] max-w-[320px]">
                          <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                            All labels ({Object.keys(pod.labels).length})
                          </div>
                          <div className="flex flex-wrap gap-1 items-start min-w-[136px]">
                            {Object.entries(pod.labels).map(([k, v]) => (
                              <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                                {`${k}: ${v}`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                        +{Object.keys(pod.labels).length - 1}
                      </span>
                    </Popover>
                  )}
                </div>
              </VStack>
            </div>
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Annotations ({Object.keys(pod.annotations).length})
                </span>
                <div className="flex items-center gap-1 min-w-0 w-full">
                  {Object.entries(pod.annotations)
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
                  {Object.keys(pod.annotations).length > 1 && (
                    <Popover
                      trigger="hover"
                      position="bottom"
                      delay={100}
                      hideDelay={100}
                      content={
                        <div className="p-3 min-w-[160px] max-w-[320px]">
                          <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                            All annotations ({Object.keys(pod.annotations).length})
                          </div>
                          <div className="flex flex-wrap gap-1 items-start min-w-[136px]">
                            {Object.entries(pod.annotations).map(([k, v]) => (
                              <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                                {`${k}: ${v}`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                        +{Object.keys(pod.annotations).length - 1}
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
            <Tab value="containers">Containers</Tab>
            <Tab value="conditions">Conditions</Tab>
            <Tab value="events">Recent events</Tab>
          </TabList>

          <TabPanel value="containers">
            <ContainersTab
              containers={mockContainersData}
              onExecuteShell={handleExecuteShell}
              onViewLogs={handleViewLogs}
            />
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

export default PodDetailPage;
