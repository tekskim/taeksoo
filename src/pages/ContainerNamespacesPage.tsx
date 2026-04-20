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
  PageShell,
  PageHeader,
  ListToolbar,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { getContainerStatusTheme } from './containerStatusUtils';
import { useNavigate, Link } from 'react-router-dom';
import {
  IconDownload,
  IconTrash,
  IconChevronDown,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface NamespaceRow {
  id: string;
  status: string;
  name: string;
  description: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const namespacesData: NamespaceRow[] = [
  {
    id: '1',
    status: 'Active',
    name: 'production-microservices-platform-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 08:12:33',
  },
  {
    id: '2',
    status: 'Active',
    name: 'staging-integration-testing-environment',
    description: 'description text',
    createdAt: 'Nov 10, 2026 09:25:17',
  },
  {
    id: '3',
    status: 'Active',
    name: 'development-sandbox-experimental-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 10:38:42',
  },
  {
    id: '4',
    status: 'Active',
    name: 'shared-global-data-persistence-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 11:52:08',
  },
  {
    id: '5',
    status: 'Active',
    name: 'cattle-impersonation-system-rbac-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 13:05:25',
  },
  {
    id: '6',
    status: 'Active',
    name: 'cattle-provisioning-capi-cluster-api-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 14:18:51',
  },
  {
    id: '7',
    status: 'Processing',
    name: 'monitoring-observability-stack-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 15:31:14',
  },
  {
    id: '8',
    status: 'Active',
    name: 'default-system-resources-default-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 16:44:38',
  },
  {
    id: '9',
    status: 'Terminating',
    name: 'kube-public-cluster-info-public-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 17:57:02',
  },
  {
    id: '10',
    status: 'CreateContainerConfigError',
    name: 'kube-system-cluster-components-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 18:09:45',
  },
  {
    id: '11',
    status: 'InvalidImageName',
    name: 'local-development-single-node-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 19:22:18',
  },
  {
    id: '12',
    status: 'ImagePullBackOff',
    name: 'kube-node-lease-heartbeat-lease-namespace',
    description: 'description text',
    createdAt: 'Nov 10, 2026 20:35:52',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerNamespacesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, addTab } = useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();

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
  const totalPages = Math.ceil(namespacesData.length / rowsPerPage);
  const paginatedData = namespacesData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Table columns configuration
  const columns: TableColumn<NamespaceRow>[] = [
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
      render: (value: string) => (
        <Link
          to={`/container/namespaces/${value}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline truncate block min-w-0"
          title={value}
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
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
            id: 'edit-config',
            label: 'Edit config',
            onClick: () => console.log('Edit Config:', row.id),
          },
          {
            id: 'edit-yaml',
            label: 'Edit YAML',
            onClick: () => navigate(`/container/namespaces/${row.name}/edit-yaml`),
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Namespaces' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-namespaces', 'Kubectl: ClusterName');
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
          title="Namespaces"
          actions={
            <ContextMenu
              items={[
                {
                  id: 'create-form',
                  label: 'Create as form',
                  onClick: () => navigate('/container/namespaces/create'),
                },
                {
                  id: 'create-yaml',
                  label: 'Create as YAML',
                  onClick: () => navigate('/container/namespaces/create-yaml'),
                },
              ]}
              trigger="click"
              align="right"
            >
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={16} stroke={1.5} />}
              >
                Create namespace
              </Button>
            </ContextMenu>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search namespaces by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                aria-label="Download"
                className="!p-0 !w-7 !h-7 !min-w-7"
              >
                <IconDownload size={12} stroke={1.5} />
              </Button>
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
          filters={filters.map((f, i) => ({
            id: String(i),
            field: f.key,
            value: f.value,
          }))}
          onFilterRemove={(id) => handleRemoveFilter(Number(id))}
          onFiltersClear={handleClearFilters}
          clearFiltersLabel="Clear filters"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={namespacesData.length}
          selectedCount={selectedRows.length}
        />

        {/* Table */}
        <Table<NamespaceRow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          loading={loading}
          emptyMessage="No namespaces found"
        />
      </VStack>
    </PageShell>
  );
}

export default ContainerNamespacesPage;
