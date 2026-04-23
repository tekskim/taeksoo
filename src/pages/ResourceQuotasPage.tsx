import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  Table,
  Button,
  FilterSearchInput,
  Pagination,
  ContextMenu,
  ListToolbar,
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
import { useNavigate } from 'react-router-dom';
import {
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ResourceQuotaRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  request: string;
  limit: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const resourceQuotasData: ResourceQuotaRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'resourcequotaName',
    namespace: 'namespaceName',
    request: '-',
    limit: '-',
    createdAt: 'Nov 10, 2026 01:17:01',
  },
  {
    id: '2',
    status: 'True',
    name: 'compute-quota',
    namespace: 'default',
    request: 'cpu: 4, memory: 8Gi',
    limit: 'cpu: 8, memory: 16Gi',
    createdAt: 'Nov 9, 2026 18:04:44',
  },
  {
    id: '3',
    status: 'None',
    name: 'storage-quota',
    namespace: 'kube-system',
    request: 'storage: 100Gi',
    limit: 'storage: 500Gi',
    createdAt: 'Nov 8, 2026 11:51:27',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'object-quota',
    namespace: 'production',
    request: 'pods: 10, services: 5',
    limit: 'pods: 50, services: 20',
    createdAt: 'Nov 7, 2026 04:38:10',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'combined-quota',
    namespace: 'monitoring',
    request: 'cpu: 2, memory: 4Gi',
    limit: 'cpu: 4, memory: 8Gi',
    createdAt: 'Nov 6, 2026 21:25:53',
  },
];

const filterFields: FilterField[] = [
  { id: 'status', label: 'Status', type: 'text' },
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'namespace', label: 'Namespace', type: 'text' },
  { id: 'request', label: 'Request', type: 'text' },
  { id: 'limit', label: 'Limit', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ResourceQuotasPage() {
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
  const [data, setData] = useState(resourceQuotasData);
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

  // Update tab label to match the page title (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel('Resource quotas');
  }, [updateActiveTabLabel]);

  const handleFiltersChange = (filters: AppliedFilter[]) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const removeFilter = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
    setCurrentPage(1);
  };

  const toolbarFilters: FilterItem[] = appliedFilters.map((f) => ({
    id: f.id,
    field: filterFields.find((ff) => ff.id === f.fieldId)?.label ?? f.fieldLabel,
    value: f.valueLabel || f.value,
  }));

  const filteredData = useMemo(() => {
    let result = data;
    appliedFilters.forEach((filter) => {
      const val = filter.value.toLowerCase();
      switch (filter.fieldId) {
        case 'status':
          result = result.filter((row) => row.status.toLowerCase().includes(val));
          break;
        case 'name':
          result = result.filter((row) => row.name.toLowerCase().includes(val));
          break;
        case 'namespace':
          result = result.filter((row) => row.namespace.toLowerCase().includes(val));
          break;
        case 'request':
          result = result.filter((row) => row.request.toLowerCase().includes(val));
          break;
        case 'limit':
          result = result.filter((row) => row.limit.toLowerCase().includes(val));
          break;
        case 'createdAt':
          result = result.filter((row) => row.createdAt.toLowerCase().includes(val));
          break;
        default:
          break;
      }
    });
    return result;
  }, [data, appliedFilters]);

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

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Create menu items for each row
  const createMenuItems = (row: ResourceQuotaRow): ContextMenuItem[] => {
    return [
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
  };

  // Table columns configuration
  const columns: TableColumn<ResourceQuotaRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
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
      render: (value: string) => (
        <span className="text-body-md text-[var(--color-text-default)] truncate" title={value}>
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
        <span className="text-body-md text-[var(--color-text-default)] truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'request',
      label: 'Request',
      flex: 1,
      minWidth: columnMinWidths.request,
      sortable: true,
      render: (value: string) => (
        <span className="text-body-md text-[var(--color-text-default)] truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'limit',
      label: 'Limit',
      flex: 1,
      minWidth: columnMinWidths.limit,
      sortable: true,
      render: (value: string) => (
        <span className="text-body-md text-[var(--color-text-default)] truncate" title={value}>
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
        const display = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
        return (
          <span className="text-body-md text-[var(--color-text-default)] truncate" title={display}>
            {display}
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
      onClick: () => navigate('/container/resource-quotas/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/resource-quotas/create-yaml'),
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
          breadcrumb={<Breadcrumb items={[{ label: 'Resource Quotas' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-rq', 'Kubectl: ClusterName');
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
          title="Resource quotas"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create resource quota
              </Button>
            </ContextMenu>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                placeholder="Search resource quota by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
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
        <Table<ResourceQuotaRow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          loading={loading}
          emptyMessage="No resource quotas found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete selected resource quotas"
        description="This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} resource quota(s)`}
      />
    </PageShell>
  );
}

export default ResourceQuotasPage;
