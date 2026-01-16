import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  StatusIndicator,
  SearchInput,
  Pagination,
  Chip,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconDownload,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface EventRow {
  id: string;
  status: 'Normal' | 'Warning' | 'Error';
  name: string;
  namespace: string;
  lastSeen: string;
  type: string;
  reason: string;
  object: string;
  subobject: string;
  source: string;
  message: string;
  firstSeen: string;
  count: number;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const eventsData: EventRow[] = [
  {
    id: '1',
    status: 'Normal',
    name: 'pod-started-successfully',
    namespace: 'default',
    lastSeen: '2025-10-21 08:32',
    type: 'Normal',
    reason: 'Started',
    object: 'Pod-web-server-1',
    subobject: '-',
    source: 'kubelet, worker-node-1',
    message: 'the web-server-1 was successfully started on node worker-node-1.',
    firstSeen: '2025-10-21 08:30',
    count: 2,
  },
  {
    id: '2',
    status: 'Normal',
    name: 'pod-scheduled',
    namespace: 'default',
    lastSeen: '2025-10-21 08:31',
    type: 'Normal',
    reason: 'Scheduled',
    object: 'Pod-web-server-1',
    subobject: '-',
    source: 'default-scheduler',
    message: 'Successfully assigned default/web-server-1 to worker-node-1',
    firstSeen: '2025-10-21 08:29',
    count: 1,
  },
  {
    id: '3',
    status: 'Warning',
    name: 'pod-failed-scheduling',
    namespace: 'kube-system',
    lastSeen: '2025-10-21 08:30',
    type: 'Warning',
    reason: 'FailedScheduling',
    object: 'Pod-nginx-deployment',
    subobject: '-',
    source: 'default-scheduler',
    message: 'no nodes available to schedule pods',
    firstSeen: '2025-10-21 08:25',
    count: 5,
  },
  {
    id: '4',
    status: 'Normal',
    name: 'deployment-scaled',
    namespace: 'production',
    lastSeen: '2025-10-21 08:28',
    type: 'Normal',
    reason: 'ScalingReplicaSet',
    object: 'Deployment-api-server',
    subobject: '-',
    source: 'deployment-controller',
    message: 'Scaled up replica set api-server-abc123 to 3',
    firstSeen: '2025-10-21 08:28',
    count: 1,
  },
  {
    id: '5',
    status: 'Error',
    name: 'pod-crash-loop',
    namespace: 'staging',
    lastSeen: '2025-10-21 08:27',
    type: 'Warning',
    reason: 'BackOff',
    object: 'Pod-backend-service',
    subobject: 'container-main',
    source: 'kubelet, worker-node-2',
    message: 'Back-off restarting failed container',
    firstSeen: '2025-10-21 08:15',
    count: 12,
  },
  {
    id: '6',
    status: 'Normal',
    name: 'service-created',
    namespace: 'default',
    lastSeen: '2025-10-21 08:25',
    type: 'Normal',
    reason: 'Created',
    object: 'Service-web-frontend',
    subobject: '-',
    source: 'service-controller',
    message: 'Created service web-frontend with ClusterIP',
    firstSeen: '2025-10-21 08:25',
    count: 1,
  },
  {
    id: '7',
    status: 'Normal',
    name: 'node-ready',
    namespace: 'default',
    lastSeen: '2025-10-21 08:20',
    type: 'Normal',
    reason: 'NodeReady',
    object: 'Node-worker-node-3',
    subobject: '-',
    source: 'kubelet, worker-node-3',
    message: 'Node worker-node-3 status is now: NodeReady',
    firstSeen: '2025-10-21 08:20',
    count: 1,
  },
  {
    id: '8',
    status: 'Warning',
    name: 'image-pull-failed',
    namespace: 'production',
    lastSeen: '2025-10-21 08:18',
    type: 'Warning',
    reason: 'ErrImagePull',
    object: 'Pod-database-replica',
    subobject: 'container-db',
    source: 'kubelet, worker-node-1',
    message: 'Failed to pull image "postgres:16": rpc error',
    firstSeen: '2025-10-21 08:10',
    count: 8,
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, addTab, updateActiveTabLabel } = useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' }
  ]);
  const navigate = useNavigate();

  // Update tab label to match the page title (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel('Events');
  }, [updateActiveTabLabel]);

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

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(eventsData.length / rowsPerPage);
  const paginatedData = eventsData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Table columns configuration
  const columns: TableColumn<EventRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '70px',
      sortable: false,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={value === 'Normal' ? 'active' : value === 'Warning' ? 'paused' : 'error'}
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      width: '240px',
      sortable: true,
      render: (value: string) => (
        <span className="text-[12px] text-[var(--color-text-default)] truncate block" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      sortable: true,
    },
    {
      key: 'lastSeen',
      label: 'Last Seen',
      flex: 1,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      width: '80px',
    },
    {
      key: 'reason',
      label: 'Reason',
      width: '80px',
    },
    {
      key: 'object',
      label: 'Object',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span 
          className="text-[var(--color-action-primary)] cursor-pointer hover:underline line-clamp-2"
          title={value}
        >
          {value}
        </span>
      )
    },
    {
      key: 'subobject',
      label: 'Subobject',
      width: '100px',
      sortable: true,
    },
    {
      key: 'source',
      label: 'Source',
      flex: 1,
      sortable: true,
    },
    {
      key: 'message',
      label: 'Message',
      width: '240px',
      sortable: true,
      render: (value: string) => (
        <span className="text-[12px] text-[var(--color-text-default)] truncate block" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'firstSeen',
      label: 'First Seen',
      flex: 1,
      sortable: true,
    },
    {
      key: 'count',
      label: 'Count',
      width: '60px',
      align: 'center',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'view-details',
            label: 'View Details',
            onClick: () => console.log('View Details:', row.id),
          },
          {
            id: 'download-yaml',
            label: 'Download YAML',
            onClick: () => console.log('Download YAML:', row.id),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

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
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Events' },
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
                    // Open console with a default kubectl session
                    shellPanel.openConsole('kubectl-events', 'Kubectl: ClusterName');
                  }
                }}
              >
                <IconTerminal2 size={16} className={shellPanel.isExpanded ? "text-[var(--color-action-primary)]" : "text-[var(--color-text-muted)]"} stroke={1.5} />
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
        <div 
          className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll"
          style={{ paddingBottom: shellPanel.isExpanded ? '350px' : '0' }}
        >
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                    Events
                  </h1>
                </HStack>
              </HStack>

              {/* Action Bar */}
              <HStack gap={2} align="center" className="w-full min-h-7">
                {/* Search */}
                <HStack gap={1} align="center">
                  <SearchInput
                    placeholder="Search Events by attributes"
                    size="sm"
                    className="w-[280px]"
                  />
                  <Button variant="secondary" size="sm" aria-label="Download" className="!p-0 !w-7 !h-7 !min-w-7">
                    <IconDownload size={14} stroke={1.5} />
                  </Button>
                </HStack>

                {/* Divider */}
                <div className="w-px h-4 bg-[var(--color-border-default)]" />

                {/* Actions */}
                <HStack gap={1} align="center">
                  <Button variant="secondary" size="sm" leftIcon={<IconDownload size={12} stroke={1.5} />} disabled={selectedRows.length === 0}>
                    Download YAML
                  </Button>
                </HStack>
              </HStack>

              {/* Filter Bar */}
              {filters.length > 0 && (
                <HStack justify="between" align="center" className="w-full pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                  <HStack gap={1} align="center">
                    {filters.map((filter, index) => (
                      <Chip
                        key={index}
                        label={filter.key}
                        value={filter.value}
                        onRemove={() => handleRemoveFilter(index)}
                      />
                    ))}
                  </HStack>
                  <button
                    onClick={handleClearFilters}
                    className="text-[11px] font-medium text-[var(--color-action-primary)] hover:underline"
                  >
                    Clear Filters
                  </button>
                </HStack>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={eventsData.length}
                selectedCount={selectedRows.length}
                showSettings
                onSettingsClick={() => {}}
              />

              {/* Table */}
              <Table<EventRow>
                columns={columns}
                data={paginatedData}
                rowKey="id"
                selectable
                selectedKeys={selectedRows}
                onSelectionChange={setSelectedRows}
              />
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
        minHeight={300}
        sidebarOpen={sidebarOpen}
        sidebarWidth={sidebarWidth}
      />
    </div>
  );
}

export default ContainerEventsPage;
