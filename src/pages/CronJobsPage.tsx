import { useState, useEffect } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  SearchInput,
  Pagination,
  ListToolbar,
  ContextMenu,
  PageShell,
  PageHeader,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
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
  IconTrash,
  IconDotsCircleHorizontal,
  IconPlayerPlay,
  IconPlayerPause,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types ---------------------------------------- */

interface CronJobRow {
  id: string;
  status: 'Active' | 'Suspended' | 'Running' | 'Failed';
  name: string;
  namespace: string;
  image: string;
  schedule: string;
  lastSchedule: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data ---------------------------------------- */

const cronJobsData: CronJobRow[] = [
  {
    id: '1',
    status: 'Active',
    name: 'automated-database-backup-daily-schedule-cronjob',
    namespace: 'namespaceName',
    image: 'imageName',
    schedule: '@daily',
    lastSchedule: '36 days',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '2',
    status: 'Active',
    name: 'database-backup-nightly-incremental-schedule-cronjob',
    namespace: 'database',
    image: 'backup-tool:v2.1',
    schedule: '0 2 * * *',
    lastSchedule: '12h',
    createdAt: 'Nov 9, 2025',
  },
  {
    id: '3',
    status: 'Running',
    name: 'log-rotation-cleanup-weekly-maintenance-cronjob',
    namespace: 'maintenance',
    image: 'cleanup-tool:v1.5',
    schedule: '*/30 * * * *',
    lastSchedule: '15m',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '4',
    status: 'Suspended',
    name: 'analytics-weekly-report-generator-schedule-cronjob',
    namespace: 'analytics',
    image: 'report-gen:v3.2',
    schedule: '0 9 * * 1',
    lastSchedule: '7 days',
    createdAt: 'Nov 8, 2025',
  },
  {
    id: '5',
    status: 'Active',
    name: 'data-sync-incremental-replication-schedule-cronjob',
    namespace: 'data-sync',
    image: 'sync-worker:v2.0',
    schedule: '*/5 * * * *',
    lastSchedule: '3m',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '6',
    status: 'Active',
    name: 'search-index-rebuild-weekly-full-sync-cronjob',
    namespace: 'search',
    image: 'indexer:v4.1',
    schedule: '0 3 * * 0',
    lastSchedule: '5 days',
    createdAt: 'Nov 7, 2025',
  },
  {
    id: '7',
    status: 'Suspended',
    name: 'cache-warmup-daily-preload-schedule-cronjob',
    namespace: 'cache',
    image: 'cache-warmer:v1.2',
    schedule: '0 6 * * *',
    lastSchedule: '2 days',
    createdAt: 'Nov 6, 2025',
  },
  {
    id: '8',
    status: 'Active',
    name: 'monitoring-metrics-collector-aggregation-cronjob',
    namespace: 'monitoring',
    image: 'metrics:v1.0',
    schedule: '*/10 * * * *',
    lastSchedule: '8m',
    createdAt: 'Nov 5, 2025',
  },
];

/* ----------------------------------------
   Component ---------------------------------------- */

export function CronJobsPage() {
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
    updateActiveTabLabel('CronJobs');
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
  const totalPages = Math.ceil(cronJobsData.length / rowsPerPage);
  const paginatedData = cronJobsData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Create menu items for each row
  const createMenuItems = (row: CronJobRow): ContextMenuItem[] => [
    {
      id: 'run-now',
      label: 'Run Now',
      onClick: () => console.log('Run Now:', row.id),
    },
    {
      id: 'suspend',
      label: row.status === 'Suspended' ? 'Resume' : 'Suspend',
      onClick: () => console.log('Suspend/Resume:', row.id),
    },
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/cronjobs/${row.id}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/cronjobs/${row.id}/edit-yaml`),
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

  // Table columns configuration
  const columns: TableColumn<CronJobRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      align: 'center',
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
      flex: 2,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
          title={value}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/cronjobs/${row.id}`);
          }}
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
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.image,
    },
    {
      key: 'schedule',
      label: 'Schedule',
      flex: 1,
      minWidth: columnMinWidths.schedule,
    },
    {
      key: 'lastSchedule',
      label: 'Last Schedule',
      flex: 1,
      minWidth: columnMinWidths.lastSchedule,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={createMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

  // Create menu items
  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as Form',
      onClick: () => navigate('/container/cronjobs/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/cronjobs/create-yaml'),
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'clusterName', href: '/container' }, { label: 'CronJobs' }]}
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
                    shellPanel.openConsole('kubectl-cronjobs', 'Kubectl: ClusterName');
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
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader
          title="CronJobs"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create CronJob{' '}
              </Button>
            </ContextMenu>
          }
        />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search cron jobs by attributes"
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
                leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Run Now
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Resume
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconPlayerPause size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Suspend
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Download YAML
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Delete
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
          totalItems={cronJobsData.length}
          selectedCount={selectedRows.length}
          showSettings
          onSettingsClick={() => {}}
        />

        {/* Table */}
        <Table<CronJobRow>
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

export default CronJobsPage;
