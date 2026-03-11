import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  ContextMenu,
  PageShell,
  DetailHeader,
  Badge,
  Tooltip,
  Select,
  Input,
  NumberInput,
  SearchInput,
  Pagination,
  Table,
  type ContextMenuItem,
  type TableColumn,
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
  IconChevronDown,
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface MatchingPod {
  name: string;
  createdAt: string;
}

interface Condition {
  condition: string;
  size: string;
  message: string;
  updated: string;
}

interface RecentEvent {
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

interface PodDisruptionBudgetData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  minAvailable: string;
  maxUnavailable: string;
  selector: Record<string, string>;
  matchingPods: MatchingPod[];
  conditions: Condition[];
  recentEvents: RecentEvent[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPdbData: Record<string, PodDisruptionBudgetData> = {
  '1': {
    id: '1',
    name: 'poddisruptionbudgetName',
    status: 'OK',
    namespace: 'default',
    createdAt: 'Jul 25, 2025',
    labels: { app: 'web' },
    annotations: { description: 'PDB for web application' },
    minAvailable: '2',
    maxUnavailable: '',
    selector: { app: 'web', tier: 'frontend' },
    matchingPods: [
      { name: 'web-deployment-77f6bb9c69-4aw7f', createdAt: 'Jul 25, 2025' },
      { name: 'web-deployment-77f6bb9c69-8xk2p', createdAt: 'Jul 25, 2025' },
      { name: 'web-deployment-77f6bb9c69-9m3qt', createdAt: 'Jul 25, 2025' },
    ],
    conditions: [
      {
        condition: 'ConditionName',
        size: 'True',
        message: '[MessageHeader] Message text',
        updated: 'Nov 10, 2025',
      },
    ],
    recentEvents: [
      {
        id: 'event1',
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
        id: 'event2',
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
    ],
  },
  '2': {
    id: '2',
    name: 'web-pdb',
    status: 'True',
    namespace: 'production',
    createdAt: 'Nov 9, 2025',
    labels: { env: 'production' },
    annotations: {},
    minAvailable: '',
    maxUnavailable: '1',
    selector: { app: 'api' },
    matchingPods: [],
    conditions: [],
    recentEvents: [],
  },
};

const operatorOptions = [
  { value: 'In List', label: 'In List' },
  { value: 'Not In', label: 'Not In' },
  { value: 'Exists', label: 'Exists' },
  { value: 'Does Not Exist', label: 'Does Not Exist' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function PodDisruptionBudgetDetailPage() {
  const { pdbId } = useParams<{ pdbId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    tabs,
    activeTabId,
    selectTab,
    closeTab,
    addNewTab,
    moveTab,
    addTab,
    updateActiveTabLabel,
  } = useTabs();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'budget';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [matchingPodsPage, setMatchingPodsPage] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [eventsPage, setEventsPage] = useState(1);

  // Get PDB data first (moved up for tab label)
  const pdbData = mockPdbData[pdbId || '1'] || mockPdbData['1'];

  // Update tab label to match the PDB name (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel(pdbData.name);
  }, [updateActiveTabLabel, pdbData.name]);

  // Shell Panel state
  const shellPanel = useShellPanel();

  // Handle opening shell tab in new browser tab
  const handleOpenInNewTab = (tab: ShellTab) => {
    const tabId = `console-${tab.instanceId}-${Date.now()}`;
    addTab({
      id: tabId,
      label: tab.title,
      path: `/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    navigate(`/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Labels and annotations counts
  const labelsCount = Object.keys(pdbData.labels).length;
  const annotationsCount = Object.keys(pdbData.annotations).length;

  // Matching pods pagination
  const matchingPodsPerPage = 10;
  const totalMatchingPodsPages = Math.ceil(pdbData.matchingPods.length / matchingPodsPerPage);
  const paginatedMatchingPods = pdbData.matchingPods.slice(
    (matchingPodsPage - 1) * matchingPodsPerPage,
    matchingPodsPage * matchingPodsPerPage
  );

  // Table columns for matching pods
  const matchingPodsColumns: TableColumn<MatchingPod>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
          onClick={() => navigate(`/container/pods/${value}`)}
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
    },
  ];

  // Conditions table columns
  const conditionsColumns: TableColumn<Condition>[] = [
    {
      key: 'condition',
      label: 'Condition',
      flex: 1,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      sortable: true,
    },
    {
      key: 'updated',
      label: 'Updated',
      flex: 1,
      sortable: true,
    },
  ];

  // Recent Events table columns
  const recentEventsColumns: TableColumn<RecentEvent>[] = [
    {
      key: 'lastSeen',
      label: 'Last seen',
      flex: 1,
      minWidth: columnMinWidths.lastSeen,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
    },
    {
      key: 'reason',
      label: 'Reason',
      flex: 1,
      sortable: true,
    },
    {
      key: 'subobject',
      label: 'Subobject',
      flex: 1,
      sortable: true,
    },
    {
      key: 'source',
      label: 'Source',
      flex: 1,
      minWidth: columnMinWidths.source,
      sortable: true,
    },
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
    {
      key: 'count',
      label: 'Count',
      flex: 1,
      minWidth: columnMinWidths.count,
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
          onClick={() => navigate(`/container/events/${value}`)}
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu
            items={[
              { id: 'view', label: 'View details', onClick: () => console.log('View:', row.id) },
              {
                id: 'delete',
                label: 'Delete',
                status: 'danger',
                onClick: () => console.log('Delete:', row.id),
              },
            ]}
            trigger="click"
          >
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-muted)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  // Create menu items for More Actions dropdown
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => console.log('Edit Config'),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => console.log('Edit YAML'),
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
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Pod disruption budgets', href: '/container/pdb' },
                { label: pdbData.name },
              ]}
            />
          }
          actions={
            <>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => {
                  if (shellPanel.isExpanded) {
                    shellPanel.setIsExpanded(false);
                  } else {
                    shellPanel.openConsole('kubectl-pdb', 'Kubectl: ClusterName');
                  }
                }}
              >
                <IconTerminal2
                  size={16}
                  className={
                    shellPanel.isExpanded
                      ? 'text-[var(--color-action-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }
                  stroke={1.5}
                />
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
          minHeight={300}
          sidebarOpen={sidebarOpen}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6}>
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>Pod Disruption Budget: {pdbData.name}</DetailHeader.Title>
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
                <Tooltip content={pdbData.status}>
                  <span className="max-w-[80px] truncate">
                    <Badge theme="white" size="sm">
                      {pdbData.status}
                    </Badge>
                  </span>
                </Tooltip>
              }
            />
            <DetailHeader.InfoCard
              label="Namespace"
              value={
                <span
                  className="text-[var(--color-action-primary)] cursor-pointer hover:underline"
                  onClick={() => navigate(`/container/namespaces/${pdbData.namespace}`)}
                >
                  {pdbData.namespace}
                </span>
              }
            />
            <DetailHeader.InfoCard label="Created at" value={pdbData.createdAt} />
            <DetailHeader.InfoCard
              label={`Labels (${labelsCount})`}
              value={
                labelsCount > 0
                  ? Object.entries(pdbData.labels)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')
                  : 'labels'
              }
            />
            <DetailHeader.InfoCard
              label={`Annotations (${annotationsCount})`}
              value={
                annotationsCount > 0
                  ? Object.entries(pdbData.annotations)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')
                  : 'annotations'
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <VStack className="flex flex-col h-fit w-full">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab value="budget">Budget</Tab>
              <Tab value="selector">Selector</Tab>
              <Tab value="conditions">Conditions</Tab>
              <Tab value="labels-annotations">Labels & annotations</Tab>
              <Tab value="recent-events">Recent events</Tab>
            </TabList>

            {/* Budget Tab */}
            <TabPanel value="budget">
              <div className="w-full border border-[var(--color-border-default)] rounded-[8px] p-4">
                <VStack gap={6}>
                  <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                    Budget
                  </h3>

                  <VStack gap={4} className="w-full">
                    {/* Min. available Pods */}
                    <VStack gap={2}>
                      <span className="text-label-lg text-[var(--color-text-default)]">
                        Min. available pods
                      </span>
                      <HStack gap={3} align="center">
                        <NumberInput
                          value={Number(pdbData.minAvailable) || 0}
                          onChange={() => {}}
                          min={0}
                          width="sm"
                          disabled
                        />
                        <span className="text-body-md text-[var(--color-text-default)]">Pods</span>
                      </HStack>
                    </VStack>

                    {/* Max. unavailable Pods */}
                    <VStack gap={2}>
                      <span className="text-label-lg text-[var(--color-text-default)]">
                        Max. unavailable pods
                      </span>
                      <HStack gap={3} align="center">
                        <NumberInput
                          value={Number(pdbData.maxUnavailable) || 0}
                          onChange={() => {}}
                          min={0}
                          width="sm"
                          disabled
                        />
                        <span className="text-body-md text-[var(--color-text-default)]">Pods</span>
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </div>
            </TabPanel>

            {/* Selector Tab */}
            <TabPanel value="selector">
              <div className="w-full border border-[var(--color-border-default)] rounded-[6px] p-4">
                <VStack gap={6}>
                  {/* Selectors Section */}
                  <VStack gap={2} className="w-full">
                    <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                      Selectors
                    </h3>

                    {/* Bordered Container for Selectors */}
                    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                      <VStack gap={2}>
                        {/* Column Headers */}
                        <HStack gap={2} className="w-full">
                          <div className="flex-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Key
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Operator
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Value
                            </span>
                          </div>
                        </HStack>

                        {/* Selector Rows */}
                        {Object.entries(pdbData.selector).length > 0 ? (
                          Object.entries(pdbData.selector).map(([key, value]) => (
                            <HStack key={key} gap={2} className="w-full">
                              <div className="flex-1">
                                <Input
                                  value={key}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                  disabled
                                  className="bg-[var(--color-surface-muted)]"
                                />
                              </div>
                              <div className="flex-1">
                                <Select
                                  options={operatorOptions}
                                  value="In List"
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                  disabled
                                />
                              </div>
                              <div className="flex-1">
                                <Input
                                  value={value}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                  disabled
                                  className="bg-[var(--color-surface-muted)]"
                                />
                              </div>
                            </HStack>
                          ))
                        ) : (
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            No selectors configured.
                          </p>
                        )}
                      </VStack>
                    </div>
                  </VStack>

                  {/* Matching Pods Section */}
                  <VStack gap={3}>
                    <span className="text-label-lg text-[var(--color-text-default)]">
                      Matching pods ({pdbData.matchingPods.length}/10)
                    </span>

                    <Pagination
                      currentPage={matchingPodsPage}
                      totalPages={Math.max(totalMatchingPodsPages, 5)}
                      onPageChange={setMatchingPodsPage}
                      totalItems={pdbData.matchingPods.length}
                    />

                    <Table<MatchingPod>
                      columns={matchingPodsColumns}
                      data={paginatedMatchingPods}
                      rowKey="name"
                    />
                  </VStack>
                </VStack>
              </div>
            </TabPanel>

            {/* Conditions Tab */}
            <TabPanel value="conditions">
              <VStack gap={3}>
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Conditions
                </h3>

                {/* Simple Pagination */}
                <Pagination
                  currentPage={1}
                  totalPages={1}
                  onPageChange={() => {}}
                  totalItems={pdbData.conditions.length}
                />

                {pdbData.conditions.length > 0 ? (
                  <Table<Condition>
                    columns={conditionsColumns}
                    data={pdbData.conditions}
                    rowKey="condition"
                  />
                ) : (
                  <p className="text-body-md text-[var(--color-text-subtle)]">
                    No conditions available.
                  </p>
                )}
              </VStack>
            </TabPanel>

            {/* Labels & Annotations Tab */}
            <TabPanel value="labels-annotations">
              <div className="w-full border border-[var(--color-border-default)] rounded-[8px] p-4">
                <VStack gap={6}>
                  {/* Section Title */}
                  <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                    Labels & annotations
                  </h3>

                  {/* Labels */}
                  <VStack gap={2} className="w-full">
                    <h4 className="text-label-lg text-[var(--color-text-default)]">Labels</h4>
                    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                      <VStack gap={2}>
                        {/* Column Headers */}
                        <HStack gap={2} className="w-full">
                          <div className="flex-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Key
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Value
                            </span>
                          </div>
                        </HStack>
                        {/* Label Rows */}
                        {labelsCount > 0 ? (
                          Object.entries(pdbData.labels).map(([key, value]) => (
                            <HStack key={key} gap={2} className="w-full">
                              <div className="flex-1">
                                <Input
                                  value={key}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                  disabled
                                />
                              </div>
                              <div className="flex-1">
                                <Input
                                  value={value}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                  disabled
                                />
                              </div>
                            </HStack>
                          ))
                        ) : (
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            No labels configured.
                          </p>
                        )}
                      </VStack>
                    </div>
                  </VStack>

                  {/* Annotations */}
                  <VStack gap={2} className="w-full">
                    <h4 className="text-label-lg text-[var(--color-text-default)]">Annotations</h4>
                    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                      <VStack gap={2}>
                        {/* Column Headers */}
                        <HStack gap={2} className="w-full">
                          <div className="flex-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Key
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Value
                            </span>
                          </div>
                        </HStack>
                        {/* Annotation Rows */}
                        {annotationsCount > 0 ? (
                          Object.entries(pdbData.annotations).map(([key, value]) => (
                            <HStack key={key} gap={2} className="w-full">
                              <div className="flex-1">
                                <Input
                                  value={key}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                  disabled
                                />
                              </div>
                              <div className="flex-1">
                                <Input
                                  value={value}
                                  onChange={() => {}}
                                  size="md"
                                  fullWidth
                                  disabled
                                />
                              </div>
                            </HStack>
                          ))
                        ) : (
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            No annotations configured.
                          </p>
                        )}
                      </VStack>
                    </div>
                  </VStack>
                </VStack>
              </div>
            </TabPanel>

            {/* Recent Events Tab */}
            <TabPanel value="recent-events">
              <VStack gap={3}>
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Recent events
                </h3>

                {/* Search and Actions */}
                <HStack gap={2} align="center" className="w-full">
                  <SearchInput
                    placeholder="Search events by attributes"
                    size="sm"
                    className="w-[280px]"
                  />
                  <div className="w-px h-5 bg-[var(--color-border-default)]" />
                  <HStack gap={1}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<IconDownload size={12} stroke={1.5} />}
                      disabled={selectedEvents.length === 0}
                    >
                      Download YAML
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<IconTrash size={12} stroke={1.5} />}
                      disabled={selectedEvents.length === 0}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>

                {/* Pagination */}
                <Pagination
                  currentPage={eventsPage}
                  totalPages={Math.max(Math.ceil(pdbData.recentEvents.length / 10), 1)}
                  onPageChange={setEventsPage}
                  totalItems={pdbData.recentEvents.length}
                  selectedCount={selectedEvents.length}
                />

                {/* Events Table */}
                {pdbData.recentEvents.length > 0 ? (
                  <Table<RecentEvent>
                    columns={recentEventsColumns}
                    data={pdbData.recentEvents}
                    rowKey="id"
                    selectable
                    selectedKeys={selectedEvents}
                    onSelectionChange={setSelectedEvents}
                  />
                ) : (
                  <p className="text-body-md text-[var(--color-text-subtle)]">No recent events.</p>
                )}
              </VStack>
            </TabPanel>
          </Tabs>
        </VStack>
      </VStack>
    </PageShell>
  );
}

export default PodDisruptionBudgetDetailPage;
