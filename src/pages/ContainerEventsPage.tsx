import { useState, useEffect } from 'react';
import {
  VStack,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  StatusIndicator,
  SearchInput,
  Pagination,
  ListToolbar,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
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
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'Started',
    object: 'Pod-web-server-1',
    subobject: '-',
    source: 'kubelet, worker-node-1',
    message: 'the web-server-1 was successfully started on node worker-node-1.',
    firstSeen: 'Oct 21, 2025',
    count: 2,
  },
  {
    id: '2',
    status: 'Normal',
    name: 'pod-scheduled',
    namespace: 'default',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'Scheduled',
    object: 'Pod-web-server-1',
    subobject: '-',
    source: 'default-scheduler',
    message: 'Successfully assigned default/web-server-1 to worker-node-1',
    firstSeen: 'Oct 21, 2025',
    count: 1,
  },
  {
    id: '3',
    status: 'Warning',
    name: 'pod-failed-scheduling',
    namespace: 'kube-system',
    lastSeen: 'Oct 21, 2025',
    type: 'Warning',
    reason: 'FailedScheduling',
    object: 'Pod-nginx-deployment',
    subobject: '-',
    source: 'default-scheduler',
    message: 'no nodes available to schedule pods',
    firstSeen: 'Oct 21, 2025',
    count: 5,
  },
  {
    id: '4',
    status: 'Normal',
    name: 'deployment-scaled',
    namespace: 'production',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'ScalingReplicaSet',
    object: 'Deployment-api-server',
    subobject: '-',
    source: 'deployment-controller',
    message: 'Scaled up replica set api-server-abc123 to 3',
    firstSeen: 'Oct 21, 2025',
    count: 1,
  },
  {
    id: '5',
    status: 'Error',
    name: 'pod-crash-loop',
    namespace: 'staging',
    lastSeen: 'Oct 21, 2025',
    type: 'Warning',
    reason: 'BackOff',
    object: 'Pod-backend-service',
    subobject: 'container-main',
    source: 'kubelet, worker-node-2',
    message: 'Back-off restarting failed container',
    firstSeen: 'Oct 21, 2025',
    count: 12,
  },
  {
    id: '6',
    status: 'Normal',
    name: 'service-created',
    namespace: 'default',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'Created',
    object: 'Service-web-frontend',
    subobject: '-',
    source: 'service-controller',
    message: 'Created service web-frontend with ClusterIP',
    firstSeen: 'Oct 21, 2025',
    count: 1,
  },
  {
    id: '7',
    status: 'Normal',
    name: 'node-ready',
    namespace: 'default',
    lastSeen: 'Oct 21, 2025',
    type: 'Normal',
    reason: 'NodeReady',
    object: 'Node-worker-node-3',
    subobject: '-',
    source: 'kubelet, worker-node-3',
    message: 'Node worker-node-3 status is now: NodeReady',
    firstSeen: 'Oct 21, 2025',
    count: 1,
  },
  {
    id: '8',
    status: 'Warning',
    name: 'image-pull-failed',
    namespace: 'production',
    lastSeen: 'Oct 21, 2025',
    type: 'Warning',
    reason: 'ErrImagePull',
    object: 'Pod-database-replica',
    subobject: 'container-db',
    source: 'kubelet, worker-node-1',
    message: 'Failed to pull image "postgres:16": rpc error',
    firstSeen: 'Oct 21, 2025',
    count: 8,
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerEventsPage() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' },
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
      width: fixedColumns.status,
      sortable: false,
      align: 'center',
      render: () => <StatusIndicator status="active" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-body-md text-[var(--color-text-default)] truncate block"
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
    },
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
    },
    {
      key: 'reason',
      label: 'Reason',
      flex: 1,
      minWidth: columnMinWidths.reason,
    },
    {
      key: 'object',
      label: 'Object',
      flex: 1,
      minWidth: columnMinWidths.object,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] cursor-pointer hover:underline line-clamp-2"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'subobject',
      label: 'Subobject',
      flex: 1,
      minWidth: columnMinWidths.subobject,
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
      render: (value: string) => (
        <span
          className="text-body-md text-[var(--color-text-default)] truncate block"
          title={value}
        >
          {value}
        </span>
      ),
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
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
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
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'clusterName', href: '/container' }, { label: 'Events' }]}
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
                    shellPanel.openConsole('kubectl-events', 'Kubectl: ClusterName');
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
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader title="Events" />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search events by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} stroke={1.5} />}
                aria-label="Download"
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Download YAML
              </Button>
            </ListToolbar.Actions>
          }
          filters={filters.map((filter, index) => ({
            id: String(index),
            field: filter.key,
            value: filter.value,
          }))}
          onFilterRemove={(id) => handleRemoveFilter(Number(id))}
          onFiltersClear={handleClearFilters}
        />

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
    </PageShell>
  );
}

export default ContainerEventsPage;
