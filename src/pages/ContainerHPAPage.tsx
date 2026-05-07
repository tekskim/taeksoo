import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  TableLink,
  Button,
  SearchInput,
  Pagination,
  ContextMenu,
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
import { useNavigate } from 'react-router-dom';
import {
  IconDownload,
  IconDotsCircleHorizontal,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface HPARow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  workload: string;
  minReplicas: number;
  maxReplicas: number;
  currentReplicas: number;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const hpaData: HPARow[] = [
  {
    id: '1',
    status: 'Active',
    name: 'frontend-web-application-horizontal-autoscaler',
    namespace: 'namespaceName',
    workload: 'workloadName',
    minReplicas: 1,
    maxReplicas: 10,
    currentReplicas: 5,
    createdAt: 'Nov 10, 2026 10:15:33',
  },
  {
    id: '2',
    status: 'Processing',
    name: 'backend-api-gateway-cpu-memory-autoscaler',
    namespace: 'default',
    workload: 'api-deployment',
    minReplicas: 2,
    maxReplicas: 20,
    currentReplicas: 8,
    createdAt: 'Nov 9, 2026 15:28:47',
  },
  {
    id: '3',
    status: 'Error',
    name: 'frontend-web-production-pending-workload-autoscaler',
    namespace: 'production',
    workload: 'web-deployment',
    minReplicas: 3,
    maxReplicas: 15,
    currentReplicas: 3,
    createdAt: 'Nov 8, 2026 08:52:19',
  },
  {
    id: '4',
    status: 'Active',
    name: 'staging-environment-workload-autoscaler',
    namespace: 'staging',
    workload: 'staging-deployment',
    minReplicas: 1,
    maxReplicas: 5,
    currentReplicas: 1,
    createdAt: 'Nov 7, 2026 13:44:26',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerHPAPage() {
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
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    updateActiveTabLabel('Horizontal pod autoscalers');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const navigate = useNavigate();

  // Create menu items
  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/hpa/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/hpa/create-yaml'),
    },
  ];

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

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 248 : 48;

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return hpaData;
    return hpaData.filter((row) => {
      const haystack = [
        row.name,
        row.namespace,
        row.workload,
        row.status,
        row.createdAt,
        String(row.minReplicas),
        String(row.maxReplicas),
        String(row.currentReplicas),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [searchTerm]);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getStatusType = (status: string): 'active' | 'building' | 'error' => {
    switch (status) {
      case 'Running':
        return 'active';
      case 'Pending':
        return 'building';
      case 'Error':
        return 'error';
      default:
        return 'active';
    }
  };

  const columns: TableColumn<HPARow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (value) => (
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
      render: (value, row) => (
        <div className="min-w-0">
          <TableLink onClick={() => navigate(`/container/hpa/${row.id}`)} title={value}>
            {value}
          </TableLink>
        </div>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
      render: (value) => (
        <span className="truncate block" title={value ?? ''}>
          {value}
        </span>
      ),
    },
    {
      key: 'workload',
      label: 'Workload',
      flex: 1,
      minWidth: columnMinWidths.workload,
      sortable: true,
      render: (value) => (
        <span className="truncate block" title={value ?? ''}>
          {value}
        </span>
      ),
    },
    {
      key: 'minReplicas',
      label: 'Minimum replicas',
      flex: 1,
      minWidth: columnMinWidths.minReplicas,
      sortable: true,
    },
    {
      key: 'maxReplicas',
      label: 'Maximum replicas',
      flex: 1,
      minWidth: columnMinWidths.maxReplicas,
      sortable: true,
    },
    {
      key: 'currentReplicas',
      label: 'Current replicas',
      flex: 1,
      minWidth: columnMinWidths.currentReplicas,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => {
        const display = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
        return (
          <span className="truncate block" title={display}>
            {display}
          </span>
        );
      },
    },
    {
      key: 'action',
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
            onClick: () => navigate(`/container/hpa/${row.id}/edit-yaml`),
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

  const handleCreateForm = () => {
    console.log('Create as form');
  };

  const handleCreateYaml = () => {
    navigate('/container/hpa/create-yaml');
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
          breadcrumb={<Breadcrumb items={[{ label: 'Horizontal pod autoscalers' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-hpa', 'Kubectl: ClusterName');
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
          title="Horizontal pod autoscalers"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button variant="primary" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
                Create horizontal pod autoscaler
              </Button>
            </ContextMenu>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search horizontal pod autoscaler by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm('')}
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
          totalItems={filteredData.length}
          selectedCount={selectedRows.length}
        />

        {/* Table */}
        <Table<HPARow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowClick={(row) => navigate(`/container/hpa/${row.id}`)}
          loading={loading}
          emptyMessage="No autoscalers found"
        />
      </VStack>
    </PageShell>
  );
}
