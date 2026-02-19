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
  StatusIndicator,
  SearchInput,
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
  IconDownload,
  IconDotsCircleHorizontal,
  IconChevronDown,
  IconTrash,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface JobData {
  id: string;
  name: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Pending';
  namespace: string;
  image: string;
  createdAt: string;
  duration: string;
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

const mockJobData: Record<string, JobData> = {
  '1': {
    id: '1',
    name: 'jobName',
    status: 'Completed',
    namespace: 'default',
    image: 'nginx:1.27',
    createdAt: 'Jul 25, 2025',
    duration: '36 days',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'app.kubernetes.io/name': 'job',
      'app.kubernetes.io/version': '1.0.0',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'job',
      'meta.helm.sh/release-namespace': 'default',
    },
  },
  '2': {
    id: '2',
    name: 'data-migration-job',
    status: 'Completed',
    namespace: 'database',
    image: 'migration-tool:v2.1',
    createdAt: 'Nov 9, 2025',
    duration: '2h 15m',
    labels: {
      'app.kubernetes.io/name': 'migration',
      'app.kubernetes.io/component': 'database',
    },
    annotations: {
      'job.kubernetes.io/revision': '1',
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
    createdAt: 'Jul 25, 2025',
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

const mockConditionsData: ConditionRow[] = [
  {
    id: '1',
    type: 'Complete',
    status: 'True',
    reason: 'JobCompleted',
    message: 'Job completed successfully.',
    lastTransition: 'Jul 25, 2025',
    lastUpdate: 'Jul 25, 2025',
  },
];

const mockEventsData: EventRow[] = [
  {
    id: '1',
    lastSeen: '30m',
    type: 'Normal',
    reason: 'SuccessfulCreate',
    subobject: '-',
    source: 'job-controller',
    message: 'Created pod: podName-77',
    firstSeen: '30m',
    count: 1,
    name: 'jobName.17e83a1b2c3d4e5f',
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
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (value: string) => (
        <StatusIndicator
          status={
            value === 'Running'
              ? 'active'
              : value === 'Succeeded'
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
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
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
    { key: 'reason', label: 'Reason', flex: 1, sortable: true },
    { key: 'subobject', label: 'Subobject', flex: 1, sortable: true },
    { key: 'source', label: 'Source', flex: 1, sortable: true },
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
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: EventRow) => (
        <ContextMenu items={createEventMenuItems(row)} trigger="click" align="right">
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

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pods';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Get job data
  const job = mockJobData[jobId || '1'] || mockJobData['1'];

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Job: ${job.name}`);
  }, [updateActiveTabLabel, job.name]);

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
      onClick: () => navigate(`/container/jobs/${job.id}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/jobs/${job.name}/edit-yaml`),
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
                { label: 'Jobs', href: '/container/jobs' },
                { label: job.name },
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
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>Job: {job.name}</DetailHeader.Title>
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
              value={job.status === 'Completed' ? 'Active' : job.status}
              status={
                job.status === 'Completed'
                  ? 'active'
                  : job.status === 'Running'
                    ? 'building'
                    : job.status === 'Pending'
                      ? 'building'
                      : job.status === 'Failed'
                        ? 'error'
                        : 'muted'
              }
            />
            <DetailHeader.InfoCard label="Namespace" value={job.namespace} copyable />
            <DetailHeader.InfoCard label="Image" value={job.image} copyable />
            <DetailHeader.InfoCard label="Created at" value={job.createdAt} />
          </DetailHeader.InfoGrid>

          {/* Second row: Duration, Labels, Annotations */}
          <HStack gap={3} className="w-full mt-3">
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={1}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Duration
                </span>
                <span className="text-label-md text-[var(--color-text-default)]">
                  {job.duration}
                </span>
              </VStack>
            </div>
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Labels ({Object.keys(job.labels).length})
                </span>
                <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                  {Object.entries(job.labels)
                    .slice(0, 1)
                    .map(([key, val]) => (
                      <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                    ))}
                  {Object.keys(job.labels).length > 1 && (
                    <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                      (+{Object.keys(job.labels).length - 1})
                    </span>
                  )}
                </div>
              </VStack>
            </div>
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Annotations ({Object.keys(job.annotations).length})
                </span>
                <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                  {Object.entries(job.annotations)
                    .slice(0, 1)
                    .map(([key, val]) => (
                      <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                    ))}
                  {Object.keys(job.annotations).length > 1 && (
                    <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                      (+{Object.keys(job.annotations).length - 1})
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

export default JobDetailPage;
