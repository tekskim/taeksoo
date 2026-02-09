import { useState, useEffect } from 'react';
import {
  VStack,
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
  PageShell,
  PageHeader,
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
  IconTrash,
  IconDotsCircleHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types ---------------------------------------- */

interface PodRow {
  id: string;
  status: 'Running' | 'Pending' | 'Failed' | 'Succeeded' | 'Unknown';
  name: string;
  namespace: string;
  image: string;
  ready: string;
  restarts: number;
  ip: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data ---------------------------------------- */

const podsData: PodRow[] = [
  {
    id: '1',
    status: 'Running',
    name: 'podName1',
    namespace: 'namespaceName',
    image: 'imageName',
    ready: '1/1',
    restarts: 1,
    ip: '10.76.0.1',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '2',
    status: 'Running',
    name: 'nginx-deployment-7fb96c846b-x2vnl',
    namespace: 'default',
    image: 'nginx:1.27',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.0.12',
    createdAt: 'Nov 9, 2025',
  },
  {
    id: '3',
    status: 'Pending',
    name: 'backend-api-5d8f7b9c4d-kj2nl',
    namespace: 'production',
    image: 'backend-api:v2.1.0',
    ready: '0/1',
    restarts: 0,
    ip: '-',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '4',
    status: 'Failed',
    name: 'data-processor-6f8a9b2c1d-lm3op',
    namespace: 'analytics',
    image: 'data-processor:v1.5',
    ready: '0/1',
    restarts: 5,
    ip: '10.76.0.45',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '5',
    status: 'Running',
    name: 'redis-master-0',
    namespace: 'cache',
    image: 'redis:7.2',
    ready: '1/1',
    restarts: 0,
    ip: '10.76.0.23',
    createdAt: 'Nov 8, 2025',
  },
  {
    id: '6',
    status: 'Running',
    name: 'postgres-0',
    namespace: 'database',
    image: 'postgres:15',
    ready: '1/1',
    restarts: 1,
    ip: '10.76.0.34',
    createdAt: 'Nov 7, 2025',
  },
  {
    id: '7',
    status: 'Succeeded',
    name: 'migration-job-abc123',
    namespace: 'database',
    image: 'migration:v1.0',
    ready: '0/1',
    restarts: 0,
    ip: '10.76.0.56',
    createdAt: 'Nov 6, 2025',
  },
  {
    id: '8',
    status: 'Running',
    name: 'monitoring-agent-ds-node1',
    namespace: 'monitoring',
    image: 'prometheus-agent:v2.45',
    ready: '1/1',
    restarts: 2,
    ip: '10.76.0.67',
    createdAt: 'Nov 5, 2025',
  },
];

/* ----------------------------------------
   Component ---------------------------------------- */

export function PodsPage() {
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
    updateActiveTabLabel('Pods');
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

  // Handle Execute Shell
  const handleExecuteShell = (podName: string) => {
    shellPanel.openConsole(podName, `Shell: ${podName}`);
  };

  // Handle View Logs
  const handleViewLogs = (podName: string) => {
    shellPanel.openConsole(podName, `Logs: ${podName}`);
  };

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(podsData.length / rowsPerPage);
  const paginatedData = podsData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Create menu items for each row
  const createMenuItems = (row: PodRow): ContextMenuItem[] => [
    {
      id: 'execute-shell',
      label: 'Execute shell',
      onClick: () => handleExecuteShell(row.name),
    },
    {
      id: 'view-logs',
      label: 'View logs',
      onClick: () => handleViewLogs(row.name),
    },
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => navigate(`/container/pods/${row.id}/edit`),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/pods/${row.id}/edit-yaml`),
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
  const columns: TableColumn<PodRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      sortable: false,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={
            value === 'Running'
              ? 'active'
              : value === 'Succeeded'
                ? 'active'
                : value === 'Failed'
                  ? 'error'
                  : 'building'
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
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
          title={value}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/pods/${row.id}`);
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
      key: 'ready',
      label: 'Ready',
      flex: 1,
      minWidth: columnMinWidths.ready,
    },
    {
      key: 'restarts',
      label: 'Restarts',
      flex: 1,
      minWidth: columnMinWidths.restarts,
    },
    {
      key: 'ip',
      label: 'IP',
      flex: 1,
      minWidth: columnMinWidths.ip,
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
      onClick: () => navigate('/container/pods/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/pods/create-yaml'),
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
            <Breadcrumb items={[{ label: 'clusterName', href: '/container' }, { label: 'Pods' }]} />
          }
          actions={
            <>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => {
                  if (shellPanel.isExpanded) {
                    shellPanel.setIsExpanded(false);
                  } else {
                    shellPanel.openConsole('kubectl-pods', 'Kubectl: ClusterName');
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
          title="Pods"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create Pod
              </Button>
            </ContextMenu>
          }
        />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search pods by attributes"
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
          totalItems={podsData.length}
          selectedCount={selectedRows.length}
          showSettings
          onSettingsClick={() => {}}
        />

        {/* Table */}
        <Table<PodRow>
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

export default PodsPage;
