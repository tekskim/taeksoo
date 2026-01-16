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
  IconTrash,
  IconDotsCircleHorizontal,
  IconPlayerPlay,
  IconPlayerPause,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface CronJobRow {
  id: string;
  status: 'Active' | 'Suspended' | 'Running';
  name: string;
  namespace: string;
  image: string;
  schedule: string;
  lastSchedule: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const cronJobsData: CronJobRow[] = [
  {
    id: '1',
    status: 'Active',
    name: 'jobName1',
    namespace: 'namespaceName',
    image: 'imageName',
    schedule: '@daily',
    lastSchedule: '36 days',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '2',
    status: 'Active',
    name: 'backup-cronjob',
    namespace: 'database',
    image: 'backup-tool:v2.1',
    schedule: '0 2 * * *',
    lastSchedule: '12h',
    createdAt: '2025-11-09 14:30',
  },
  {
    id: '3',
    status: 'Running',
    name: 'cleanup-cronjob',
    namespace: 'maintenance',
    image: 'cleanup-tool:v1.5',
    schedule: '*/30 * * * *',
    lastSchedule: '15m',
    createdAt: '2025-11-10 08:00',
  },
  {
    id: '4',
    status: 'Suspended',
    name: 'report-generator',
    namespace: 'analytics',
    image: 'report-gen:v3.2',
    schedule: '0 9 * * 1',
    lastSchedule: '7 days',
    createdAt: '2025-11-08 09:15',
  },
  {
    id: '5',
    status: 'Active',
    name: 'sync-cronjob',
    namespace: 'data-sync',
    image: 'sync-worker:v2.0',
    schedule: '*/5 * * * *',
    lastSchedule: '3m',
    createdAt: '2025-11-10 12:00',
  },
  {
    id: '6',
    status: 'Active',
    name: 'index-rebuild',
    namespace: 'search',
    image: 'indexer:v4.1',
    schedule: '0 3 * * 0',
    lastSchedule: '5 days',
    createdAt: '2025-11-07 16:45',
  },
  {
    id: '7',
    status: 'Suspended',
    name: 'cache-warmup',
    namespace: 'cache',
    image: 'cache-warmer:v1.2',
    schedule: '0 6 * * *',
    lastSchedule: '2 days',
    createdAt: '2025-11-06 10:30',
  },
  {
    id: '8',
    status: 'Active',
    name: 'metrics-collector',
    namespace: 'monitoring',
    image: 'metrics:v1.0',
    schedule: '*/10 * * * *',
    lastSchedule: '8m',
    createdAt: '2025-11-05 11:20',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function CronJobsPage() {
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
      label: 'Edit Config',
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
      width: '59px',
      sortable: true,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={
            value === 'Active' ? 'active' :
            value === 'Running' ? 'building' : 
            value === 'Suspended' ? 'suspended' : 
            'suspended'
          }
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          title={value}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/cronjobs/${row.id}`);
          }}
        >
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
      key: 'image',
      label: 'Image',
      flex: 1.5,
    },
    {
      key: 'schedule',
      label: 'Schedule',
      width: '100px',
    },
    {
      key: 'lastSchedule',
      label: 'Last Schedule',
      width: '120px',
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '150px',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={createMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
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
                { label: 'CronJobs' },
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
                    shellPanel.openConsole('kubectl-cronjobs', 'Kubectl: ClusterName');
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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                    CronJobs
                  </h1>
                </HStack>
                
                {/* Create CronJob Button with Dropdown */}
                <div className="relative">
                  <ContextMenu items={createDropdownItems} trigger="click">
                    <Button variant="primary" size="md">
                      Create CronJob
                    </Button>
                  </ContextMenu>
                </div>
              </HStack>

              {/* Action Bar */}
              <HStack gap={2} align="center" className="w-full min-h-7">
                {/* Search */}
                <HStack gap={1} align="center">
                  <SearchInput
                    placeholder="Search CronJobs by attributes"
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
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<IconPlayerPlay size={12} stroke={1.5} />} 
                    disabled={selectedRows.length === 0}
                  >
                    Run Now
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<IconPlayerPlay size={12} stroke={1.5} />} 
                    disabled={selectedRows.length === 0}
                  >
                    Resume
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<IconPlayerPause size={12} stroke={1.5} />} 
                    disabled={selectedRows.length === 0}
                  >
                    Suspend
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<IconDownload size={12} stroke={1.5} />} 
                    disabled={selectedRows.length === 0}
                  >
                    Download YAML
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<IconTrash size={12} stroke={1.5} />} 
                    disabled={selectedRows.length === 0}
                  >
                    Delete
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

export default CronJobsPage;
