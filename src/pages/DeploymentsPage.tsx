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
  IconRefresh,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types ---------------------------------------- */

interface DeploymentRow {
  id: string;
  status: 'Running' | 'Pending' | 'Failed' | 'Paused';
  name: string;
  namespace: string;
  image: string;
  ready: string;
  upToDate: number;
  available: number;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data ---------------------------------------- */

const deploymentsData: DeploymentRow[] = [
  {
    id: '1',
    status: 'Running',
    name: 'cart-manager',
    namespace: 'cart5-production-dev-api-system',
    image: 'mirrored-cluster-api-controller:v1.6.2',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '2',
    status: 'Running',
    name: 'nginx-ingress-controller',
    namespace: 'ingress-nginx',
    image: 'nginx-ingress-controller:v1.9.4',
    ready: '3/3',
    upToDate: 3,
    available: 3,
    createdAt: '2025-11-08 09:30',
  },
  {
    id: '3',
    status: 'Running',
    name: 'prometheus-server',
    namespace: 'monitoring',
    image: 'prometheus/prometheus:v2.47.0',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: '2025-11-07 14:22',
  },
  {
    id: '4',
    status: 'Pending',
    name: 'grafana',
    namespace: 'monitoring',
    image: 'grafana/grafana:10.2.0',
    ready: '0/1',
    upToDate: 1,
    available: 0,
    createdAt: '2025-11-09 16:45',
  },
  {
    id: '5',
    status: 'Running',
    name: 'redis-master',
    namespace: 'cache',
    image: 'redis:7.2-alpine',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: '2025-11-06 11:15',
  },
  {
    id: '6',
    status: 'Failed',
    name: 'payment-service',
    namespace: 'payment-system',
    image: 'payment-service:v2.1.0',
    ready: '0/2',
    upToDate: 0,
    available: 0,
    createdAt: '2025-11-10 08:20',
  },
  {
    id: '7',
    status: 'Running',
    name: 'api-gateway',
    namespace: 'gateway',
    image: 'api-gateway:v3.0.1',
    ready: '2/2',
    upToDate: 2,
    available: 2,
    createdAt: '2025-11-05 10:00',
  },
  {
    id: '8',
    status: 'Running',
    name: 'user-service',
    namespace: 'user-management',
    image: 'user-service:v1.5.3',
    ready: '3/3',
    upToDate: 3,
    available: 3,
    createdAt: '2025-11-04 15:30',
  },
];

/* ----------------------------------------
   Component ---------------------------------------- */

export function DeploymentsPage() {
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
    updateActiveTabLabel('Deployments');
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
  const totalPages = Math.ceil(deploymentsData.length / rowsPerPage);
  const paginatedData = deploymentsData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Table columns configuration
  const columns: TableColumn<DeploymentRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      sortable: true,
      align: 'center',
      render: (value: string) => (
        <StatusIndicator
          status={
            value === 'Running'
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
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline line-clamp-2"
          title={value}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/container/deployments/${row.id}`);
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
      key: 'upToDate',
      label: 'Up-To-Date',
      flex: 1,
      minWidth: columnMinWidths.upToDate,
    },
    {
      key: 'available',
      label: 'Available',
      flex: 1,
      minWidth: columnMinWidths.available,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
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
            id: 'execute-shell',
            label: 'Execute Shell',
            onClick: () => shellPanel.openConsole(row.id, `Shell: ${row.name}`),
          },
          {
            id: 'pause-orchestration',
            label: 'Pause Orchestration',
            onClick: () => console.log('Pause Orchestration:', row.id),
          },
          {
            id: 'redeploy',
            label: 'Redeploy',
            onClick: () => console.log('Redeploy:', row.id),
          },
          {
            id: 'rollback',
            label: 'Rollback',
            onClick: () => console.log('Rollback:', row.id),
          },
          {
            id: 'edit-config',
            label: 'Edit Config',
            onClick: () => navigate(`/container/deployments/${row.id}/edit`),
          },
          {
            id: 'edit-yaml',
            label: 'Edit YAML',
            onClick: () => navigate(`/container/deployments/${row.id}/edit-yaml`),
          },
          {
            id: 'download-yaml',
            label: 'Download YAML',
            onClick: () => console.log('Download YAML:', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            onClick: () => console.log('Delete:', row.id),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click">
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

  // Create menu items
  const createMenuItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as Form',
      onClick: () => navigate('/container/deployments/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/deployments/create-yaml'),
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
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'clusterName', href: '/container' }, { label: 'Deployments' }]}
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
                    shellPanel.openConsole('kubectl-deployments', 'Kubectl: ClusterName');
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

        {/* Content Area */}
        <div
          className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll"
          style={{ paddingBottom: shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0' }}
        >
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-8">
                <HStack gap={2} align="center">
                  <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Deployments{' '}
                  </h1>
                </HStack>

                {/* Create Deployment Button with Dropdown */}
                <ContextMenu items={createMenuItems} trigger="click" align="right">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<IconChevronDown size={14} stroke={1.5} />}
                  >
                    Create Deployment{' '}
                  </Button>
                </ContextMenu>
              </HStack>

              {/* Action Bar */}
              <HStack gap={2} align="center" className="w-full min-h-7">
                {/* Search */}
                <HStack gap={1} align="center">
                  <SearchInput
                    placeholder="Search Deployments by attributes"
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label="Download"
                    className="!p-0 !w-7 !h-7 !min-w-7"
                  >
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
                    leftIcon={<IconRefresh size={12} stroke={1.5} />}
                    disabled={selectedRows.length === 0}
                  >
                    Redeploy{' '}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconDownload size={12} stroke={1.5} />}
                    disabled={selectedRows.length === 0}
                  >
                    Download YAML{' '}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} stroke={1.5} />}
                    disabled={selectedRows.length === 0}
                  >
                    Delete{' '}
                  </Button>
                </HStack>
              </HStack>

              {/* Filter Bar */}
              {filters.length > 0 && (
                <HStack
                  justify="between"
                  align="center"
                  className="w-full pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]"
                >
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
                    className="text-label-sm text-[var(--color-action-primary)] hover:underline"
                  >
                    Clear Filters{' '}
                  </button>
                </HStack>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={deploymentsData.length}
                selectedCount={selectedRows.length}
                showSettings
                onSettingsClick={() => {}}
              />

              {/* Table */}
              <Table<DeploymentRow>
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

export default DeploymentsPage;
