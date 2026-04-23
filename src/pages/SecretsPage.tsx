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

/* ----------------------------------------
   Types ---------------------------------------- */

interface SecretRow {
  id: string;
  name: string;
  namespace: string;
  type: string;
  data: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data ---------------------------------------- */

const secretsData: SecretRow[] = [
  {
    id: '1',
    name: 'database-postgresql-connection-credentials-secret',
    namespace: 'namespaceName',
    type: 'Opaque',
    data: 'keyName01 (+3)',
    createdAt: 'Nov 10, 2026 09:23:41',
  },
  {
    id: '2',
    name: 'database-mysql-replication-user-credentials-secret',
    namespace: 'default',
    type: 'Opaque',
    data: 'username, password (+1)',
    createdAt: 'Nov 9, 2026 14:07:22',
  },
  {
    id: '3',
    name: 'tls-certificate-wildcard-production-domain',
    namespace: 'nginx-ingress',
    type: 'kubernetes.io/tls',
    data: 'tls.crt, tls.key',
    createdAt: 'Nov 8, 2026 11:45:33',
  },
  {
    id: '4',
    name: 'docker-registry-pull-image-credentials-secret',
    namespace: 'default',
    type: 'kubernetes.io/dockerconfigjson',
    data: '.dockerconfigjson',
    createdAt: 'Nov 7, 2026 16:52:08',
  },
  {
    id: '5',
    name: 'service-account-token-default-namespace-secret',
    namespace: 'kube-system',
    type: 'kubernetes.io/service-account-token',
    data: 'ca.crt, namespace, token',
    createdAt: 'Nov 6, 2026 08:30:15',
  },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'namespace', label: 'Namespace', type: 'text' },
  { id: 'type', label: 'Type', type: 'text' },
  { id: 'data', label: 'Data', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   Component ---------------------------------------- */

export function SecretsPage() {
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
  const [data, setData] = useState(secretsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();

  // Update tab label to match the page title (most recent breadcrumb)
  useEffect(() => {
    updateActiveTabLabel('Secrets');
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
        case 'name':
          result = result.filter((item) => item.name.toLowerCase().includes(val));
          break;
        case 'namespace':
          result = result.filter((item) => item.namespace.toLowerCase().includes(val));
          break;
        case 'type':
          result = result.filter((item) => item.type.toLowerCase().includes(val));
          break;
        case 'data':
          result = result.filter((item) => item.data.toLowerCase().includes(val));
          break;
        case 'createdAt':
          result = result.filter((item) => item.createdAt.toLowerCase().includes(val));
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
  const createMenuItems = (row: SecretRow): ContextMenuItem[] => {
    return [
      {
        id: 'edit-yaml',
        label: 'Edit YAML',
        onClick: () => navigate(`/container/secrets/${row.id}/edit-yaml`),
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
  };

  // Table columns configuration
  const columns: TableColumn<SecretRow>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <div className="min-w-0">
          <Link
            to={`/container/secrets/${row.id}`}
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
        <div className="min-w-0">
          <span
            className="text-body-md text-[var(--color-text-default)] truncate block"
            title={value}
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
      render: (value: string) => (
        <div className="min-w-0">
          <span className="text-[var(--color-text-default)] truncate block" title={value}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'data',
      label: 'Data',
      flex: 1,
      minWidth: columnMinWidths.data,
      sortable: true,
      render: (value: string) => (
        <div className="min-w-0">
          <span className="text-[var(--color-text-default)] truncate block" title={value}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => {
        const displayed = value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
        return (
          <span className="whitespace-nowrap" title={value}>
            {displayed}
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
      onClick: () => navigate('/container/secrets/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/secrets/create-yaml'),
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
          breadcrumb={<Breadcrumb items={[{ label: 'Secrets' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-secrets', 'Kubectl: ClusterName');
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
          title="Secrets"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create secret
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
                onFiltersChange={handleFiltersChange}
                placeholder="Search secrets by attributes"
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
        <Table<SecretRow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          loading={loading}
          emptyMessage="No secrets found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete selected secrets"
        description="This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} secret(s)`}
      />
    </PageShell>
  );
}

export default SecretsPage;
