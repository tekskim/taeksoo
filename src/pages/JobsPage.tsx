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
  IconChevronDown,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface JobRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  image: string;
  completions: string;
  duration: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const jobsData: JobRow[] = [
  {
    id: '1',
    status: 'Succeeded',
    name: 'database-migration-schema-update-v2-job-20260115',
    namespace: 'namespaceName',
    image: 'imageName',
    completions: '1/1',
    duration: '36 days',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '2',
    status: 'Succeeded',
    name: 'data-warehouse-etl-pipeline-extraction-transform-job',
    namespace: 'database',
    image: 'migration-tool:v2.1',
    completions: '1/1',
    duration: '2h 15m',
    createdAt: 'Nov 9, 2026 18:04:44',
  },
  {
    id: '3',
    status: 'Failed',
    name: 'backup-automated-daily-snapshot-creation-job',
    namespace: 'backup',
    image: 'backup-agent:v1.5',
    completions: '0/1',
    duration: '45m',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '4',
    status: 'Processing',
    name: 'maintenance-cleanup-temp-files-retention-job',
    namespace: 'maintenance',
    image: 'cleanup-tool:v1.0',
    completions: '0/3',
    duration: '5m',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '5',
    status: 'Succeeded',
    name: 'analytics-report-generator-weekly-summary-job',
    namespace: 'analytics',
    image: 'report-gen:v3.2',
    completions: '5/5',
    duration: '1h 30m',
    createdAt: 'Nov 8, 2026 11:51:27',
  },
  {
    id: '6',
    status: 'Failed',
    name: 'data-sync-incremental-replication-worker-job',
    namespace: 'data-sync',
    image: 'sync-worker:v2.0',
    completions: '0/1',
    duration: '-',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '7',
    status: 'Processing',
    name: 'search-index-rebuild-full-sync-job',
    namespace: 'search',
    image: 'indexer:v4.1',
    completions: '1/1',
    duration: '3h 45m',
    createdAt: 'Nov 7, 2026 04:38:10',
  },
  {
    id: '8',
    status: 'Succeeded',
    name: 'cache-warmup-preload-frequently-accessed-job',
    namespace: 'cache',
    image: 'cache-warmer:v1.2',
    completions: '10/10',
    duration: '20m',
    createdAt: 'Nov 6, 2026 21:25:53',
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
      { value: 'Succeeded', label: 'Succeeded' },
      { value: 'Failed', label: 'Failed' },
      { value: 'Processing', label: 'Processing' },
    ],
  },
  { id: 'image', label: 'Image', type: 'text' },
  { id: 'completions', label: 'Completions', type: 'text' },
  { id: 'duration', label: 'Duration', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function JobsPage() {
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
  const [data, setData] = useState(jobsData);
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
        const raw = item[filter.fieldId as keyof JobRow];
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
    updateActiveTabLabel('Jobs');
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

  // Table columns configuration
  const columns: TableColumn<JobRow>[] = [
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
            to={`/container/jobs/${row.id}`}
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
      key: 'completions',
      label: 'Completions',
      flex: 1,
      minWidth: columnMinWidths.completions,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      flex: 1,
      minWidth: columnMinWidths.duration,
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
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit-yaml',
            label: 'Edit YAML',
            onClick: () => navigate(`/container/jobs/${row.id}/edit-yaml`),
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

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
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
        );
      },
    },
  ];

  const handleBulkDeleteConfirm = () => {
    setData((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    setIsBulkDeleteOpen(false);
  };

  // Create menu items
  const createMenuItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/jobs/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/jobs/create-yaml'),
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
          breadcrumb={<Breadcrumb items={[{ label: 'Jobs' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-jobs', 'Kubectl: ClusterName');
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
          title="Jobs"
          actions={
            <ContextMenu items={createMenuItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create job
              </Button>
            </ContextMenu>
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
                placeholder="Search jobs by attributes"
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
        <Table<JobRow>
          columns={columns}
          loading={loading}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No jobs found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete selected jobs"
        description="This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} job(s)`}
      />
    </PageShell>
  );
}

export default JobsPage;
