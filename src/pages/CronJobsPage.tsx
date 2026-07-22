import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  FilterSearchInput,
  Pagination,
  ListToolbar,
  ContextMenu,
  PageShell,
  PageHeader,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  type FilterItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
  ConfirmModal,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
  IconPlayerPlay,
  IconCircleDashed,
  IconPlayerPause,
  IconChevronDown,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { managedByColumn, type WorkloadManagedBy } from './containerManagedBy';
import { useContainerMode } from '@/contexts/ContainerModeContext';
import { getActiveCpCluster } from './containerActiveCluster';

/* ----------------------------------------
   Types ---------------------------------------- */

interface CronJobRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  managedBy?: WorkloadManagedBy;
  image: string;
  schedule: string;
  lastSchedule: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data ---------------------------------------- */

// 전용(등록형) 클러스터의 CronJob(D-26) — 상위 제품이 만들어 관리한다.
const dedicatedCronJobs: CronJobRow[] = [
  {
    id: 'cp-1',
    status: 'Active',
    name: 'checkpoint-retention-cleanup-cronjob',
    namespace: 'ml-training',
    managedBy: 'Maxis',
    image: 'maxis/checkpoint-gc:24.06',
    schedule: '0 3 * * *',
    lastSchedule: 'Nov 10, 2026 03:00:00',
    createdAt: 'Nov 1, 2026 09:00:00',
  },
  {
    id: 'cp-2',
    status: 'Active',
    name: 'model-registry-sync-cronjob',
    namespace: 'ml-serving',
    managedBy: 'Metis',
    image: 'metis/registry-sync:1.2.0',
    schedule: '*/30 * * * *',
    lastSchedule: 'Nov 10, 2026 10:30:00',
    createdAt: 'Nov 2, 2026 14:00:00',
  },
];

const cronJobsData: CronJobRow[] = [
  {
    id: '1',
    status: 'Active',
    name: 'automated-database-backup-daily-schedule-cronjob',
    namespace: 'namespaceName',
    image: 'imageName',
    schedule: '@daily',
    lastSchedule: '36 days',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '2',
    status: 'Suspended',
    name: 'database-backup-nightly-incremental-schedule-cronjob',
    namespace: 'database',
    image: 'backup-tool:v2.1',
    schedule: '0 2 * * *',
    lastSchedule: '12h',
    createdAt: 'Nov 9, 2026 18:04:44',
  },
  {
    id: '3',
    status: 'Processing',
    name: 'log-rotation-cleanup-weekly-maintenance-cronjob',
    namespace: 'maintenance',
    image: 'cleanup-tool:v1.5',
    schedule: '*/30 * * * *',
    lastSchedule: '15m',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '4',
    status: 'Error',
    name: 'analytics-weekly-report-generator-schedule-cronjob',
    namespace: 'analytics',
    image: 'report-gen:v3.2',
    schedule: '0 9 * * 1',
    lastSchedule: '7 days',
    createdAt: 'Nov 8, 2026 11:51:27',
  },
  {
    id: '5',
    status: 'Active',
    name: 'data-sync-incremental-replication-schedule-cronjob',
    namespace: 'data-sync',
    image: 'sync-worker:v2.0',
    schedule: '*/5 * * * *',
    lastSchedule: '3m',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '6',
    status: 'Suspended',
    name: 'search-index-rebuild-weekly-full-sync-cronjob',
    namespace: 'search',
    image: 'indexer:v4.1',
    schedule: '0 3 * * 0',
    lastSchedule: '5 days',
    createdAt: 'Nov 7, 2026 04:38:10',
  },
  {
    id: '7',
    status: 'Processing',
    name: 'cache-warmup-daily-preload-schedule-cronjob',
    namespace: 'cache',
    image: 'cache-warmer:v1.2',
    schedule: '0 6 * * *',
    lastSchedule: '2 days',
    createdAt: 'Nov 6, 2026 21:25:53',
  },
  {
    id: '8',
    status: 'Error',
    name: 'monitoring-metrics-collector-aggregation-cronjob',
    namespace: 'monitoring',
    image: 'metrics:v1.0',
    schedule: '*/10 * * * *',
    lastSchedule: '8m',
    createdAt: 'Nov 5, 2026 14:12:36',
  },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'namespace', label: 'Namespace', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Suspended', label: 'Suspended' },
      { value: 'Processing', label: 'Processing' },
      { value: 'Error', label: 'Error' },
    ],
  },
  { id: 'image', label: 'Image', type: 'text' },
  { id: 'schedule', label: 'Schedule', type: 'text' },
  { id: 'lastSchedule', label: 'Last schedule', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
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
  const { isPlatform } = useContainerMode();
  // 전용(등록형) 클러스터: 생성 차단, 조회+운영 조치만 (D-28)
  const dedicated = isPlatform && getActiveCpCluster().dedicated;
  const initialRows = dedicated ? dedicatedCronJobs : cronJobsData;
  const [data, setData] = useState(initialRows);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();

  const removeFilter = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
  };

  const toolbarFilters: FilterItem[] = appliedFilters.map((f) => ({
    id: f.id,
    field: f.fieldLabel,
    value: f.valueLabel || f.value,
  }));

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return appliedFilters.every((filter) => {
        const raw = item[filter.fieldId as keyof CronJobRow];
        const value = String(typeof raw === 'number' ? raw : (raw ?? '')).toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [data, appliedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

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
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Create menu items for each row
  const createMenuItems = (row: CronJobRow): ContextMenuItem[] => [
    {
      id: 'run-now',
      label: 'Run now',
      onClick: () => console.log('Run now:', row.id),
    },
    {
      id: 'suspend',
      label: row.status === 'Suspended' ? 'Resume' : 'Suspend',
      onClick: () => console.log('Suspend/Resume:', row.id),
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
      render: (value: string, row) => (
        <div className="min-w-0">
          <Link
            to={`/container/cronjobs/${row.id}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline truncate block"
            title={value}
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    // Container Platform 전용(D-26): 담당 제품 표시
    ...(isPlatform ? [managedByColumn<CronJobRow>()] : []),
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.containerImage,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'schedule',
      label: 'Schedule',
      flex: 1,
      minWidth: columnMinWidths.schedule,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'lastSchedule',
      label: 'Last Schedule',
      flex: 1,
      minWidth: columnMinWidths.lastSchedule,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block" title={value}>
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
          <span className="truncate block whitespace-nowrap" title={formatted}>
            {formatted}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={createMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            >
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

  const handleBulkDeleteConfirm = () => {
    setData((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    setIsBulkDeleteOpen(false);
  };

  // Create menu items
  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'CronJobs' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-cronjobs', 'Kubectl: ClusterName');
                }
              }}
              isTerminalActive={shellPanel.isExpanded}
            />
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
        <PageHeader
          title="CronJobs"
          actions={
            dedicated ? undefined : (
              <ContextMenu items={createDropdownItems} trigger="click" align="right">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<IconChevronDown size={14} stroke={1.5} />}
                >
                  Create CronJob
                </Button>
              </ContextMenu>
            )
          }
        />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search cron jobs by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
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
                leftIcon={<IconCircleDashed size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => console.log('Run now:', selectedRows)}
              >
                Run now
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => console.log('Resume:', selectedRows)}
              >
                Resume
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconPlayerPause size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => console.log('Suspend:', selectedRows)}
              >
                Suspend
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => console.log('Download YAML:', selectedRows)}
              >
                Download YAML
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
          filters={toolbarFilters}
          onFilterRemove={removeFilter}
          onFiltersClear={clearAllFilters}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          selectedCount={selectedRows.length}
        />

        {/* Table */}
        <Table<CronJobRow>
          columns={columns}
          loading={loading}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No cron jobs found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete selected CronJobs"
        description="This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} CronJob(s)`}
      />
    </PageShell>
  );
}

export default CronJobsPage;
