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
  ContextMenu,
  ListToolbar,
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
  IconRefresh,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types ---------------------------------------- */

interface DeploymentRow {
  id: string;
  status: string;
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
    status: 'OK',
    name: 'frontend-web-application-nginx-deployment',
    namespace: 'cart5-production-dev-api-system',
    image: 'mirrored-cluster-api-controller:v1.6.2',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: 'Nov 10, 2025 08:35:22',
  },
  {
    id: '2',
    status: 'OK',
    name: 'ingress-nginx-controller-admission-webhook-deployment',
    namespace: 'ingress-nginx',
    image: 'nginx-ingress-controller:v1.9.4',
    ready: '3/3',
    upToDate: 3,
    available: 3,
    createdAt: 'Nov 8, 2025 11:42:18',
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'monitoring-prometheus-alertmanager-server-deployment',
    namespace: 'monitoring',
    image: 'prometheus/prometheus:v2.47.0',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: 'Nov 7, 2025 14:28:45',
  },
  {
    id: '4',
    status: 'InvalidImageName',
    name: 'monitoring-grafana-dashboard-visualization-deployment',
    namespace: 'monitoring',
    image: 'grafana/grafana:10.2.0',
    ready: '0/1',
    upToDate: 1,
    available: 0,
    createdAt: 'Nov 9, 2025 09:15:33',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'cache-redis-master-replication-deployment',
    namespace: 'cache',
    image: 'redis:7.2-alpine',
    ready: '1/1',
    upToDate: 1,
    available: 1,
    createdAt: 'Nov 6, 2025 16:52:07',
  },
  {
    id: '6',
    status: 'True',
    name: 'payment-service-gateway-microservice-deployment',
    namespace: 'payment-system',
    image: 'payment-service:v2.1.0',
    ready: '0/2',
    upToDate: 0,
    available: 0,
    createdAt: 'Nov 10, 2025 10:18:41',
  },
  {
    id: '7',
    status: 'Raw',
    name: 'backend-api-gateway-microservice-deployment',
    namespace: 'gateway',
    image: 'api-gateway:v3.0.1',
    ready: '2/2',
    upToDate: 2,
    available: 2,
    createdAt: 'Nov 5, 2025 13:45:29',
  },
  {
    id: '8',
    status: 'None',
    name: 'user-management-service-authentication-deployment',
    namespace: 'user-management',
    image: 'user-service:v1.5.3',
    ready: '3/3',
    upToDate: 3,
    available: 3,
    createdAt: 'Nov 4, 2025 11:22:14',
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
      width: fixedColumns.statusLabel,
      sortable: false,
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
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate"
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
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'ready',
      label: 'Ready',
      flex: 1,
      minWidth: columnMinWidths.ready,
      sortable: true,
    },
    {
      key: 'upToDate',
      label: 'Up to date',
      flex: 1,
      minWidth: columnMinWidths.upToDate,
      sortable: true,
    },
    {
      key: 'available',
      label: 'Available',
      flex: 1,
      minWidth: columnMinWidths.available,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
        </span>
      ),
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
            label: 'Execute shell',
            onClick: () => shellPanel.openConsole(row.id, `Shell: ${row.name}`),
          },
          {
            id: 'pause-orchestration',
            label: 'Pause orchestration',
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
            label: 'Edit config',
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
            status: 'danger',
            onClick: () => console.log('Delete:', row.id),
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

  // Create menu items
  const createMenuItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/deployments/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/deployments/create-yaml'),
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
          title="Deployments"
          actions={
            <ContextMenu items={createMenuItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create deployment
              </Button>
            </ContextMenu>
          }
        />

        {/* Action Bar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search deployments by attributes"
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
                leftIcon={<IconRefresh size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Redeploy
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
    </PageShell>
  );
}

export default DeploymentsPage;
