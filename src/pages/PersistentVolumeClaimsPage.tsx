import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  FilterSearchInput,
  Pagination,
  ListToolbar,
  ContextMenu,
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

interface PersistentVolumeClaimRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  volume: string;
  capacity: string;
  accessModes: string;
  storageClass: string;
  volumeAttributesClass: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const persistentVolumeClaimsData: PersistentVolumeClaimRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'cert-manager-tls-wildcard-production-domain-claim',
    namespace: 'default',
    volume: 'pvc-143076e7-d0b2-4d76-92fc-cea5cbe8b3a2',
    capacity: '10Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '1',
    createdAt: 'Nov 10, 2026 09:23:41',
  },
  {
    id: '2',
    status: 'True',
    name: 'data-postgresql-primary-statefulset-0-volume-claim',
    namespace: 'database',
    volume: 'pvc-abc12345-1234-5678-abcd-1234567890ab',
    capacity: '50Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '1',
    createdAt: 'Nov 9, 2026 14:07:22',
  },
  {
    id: '3',
    status: 'None',
    name: 'redis-cluster-sentinel-persistent-data-01',
    namespace: 'cache',
    volume: 'pvc-redis-data-001',
    capacity: '5Gi',
    accessModes: 'RWO',
    storageClass: 'local',
    volumeAttributesClass: '1',
    createdAt: 'Nov 8, 2026 11:45:33',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'pending-analytics-logs-storage-volume-claim',
    namespace: 'default',
    volume: '',
    capacity: '20Gi',
    accessModes: 'RWX',
    storageClass: 'nfs',
    volumeAttributesClass: '',
    createdAt: 'Nov 10, 2026 14:37:52',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'elasticsearch-cluster-data-node-statefulset-0',
    namespace: 'logging',
    volume: 'pvc-elastic-001',
    capacity: '100Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '2',
    createdAt: 'Nov 7, 2026 16:52:08',
  },
];

const filterFields: FilterField[] = [
  { id: 'status', label: 'Status', type: 'text' },
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'namespace', label: 'Namespace', type: 'text' },
  { id: 'volume', label: 'Volume', type: 'text' },
  { id: 'capacity', label: 'Capacity', type: 'text' },
  { id: 'accessModes', label: 'Access modes', type: 'text' },
  { id: 'storageClass', label: 'Storage class', type: 'text' },
  { id: 'volumeAttributesClass', label: 'VolumeAttributesClass', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function PersistentVolumeClaimsPage() {
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
  const [data, setData] = useState(persistentVolumeClaimsData);
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
    updateActiveTabLabel('Persistent volume claims');
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
          result = result.filter((item) => item.status.toLowerCase().includes(val));
          break;
        case 'name':
          result = result.filter((item) => item.name.toLowerCase().includes(val));
          break;
        case 'namespace':
          result = result.filter((item) => item.namespace.toLowerCase().includes(val));
          break;
        case 'volume':
          result = result.filter((item) => item.volume.toLowerCase().includes(val));
          break;
        case 'capacity':
          result = result.filter((item) => item.capacity.toLowerCase().includes(val));
          break;
        case 'accessModes':
          result = result.filter((item) => item.accessModes.toLowerCase().includes(val));
          break;
        case 'storageClass':
          result = result.filter((item) => item.storageClass.toLowerCase().includes(val));
          break;
        case 'volumeAttributesClass':
          result = result.filter((item) => item.volumeAttributesClass.toLowerCase().includes(val));
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
  const createMenuItems = (row: PersistentVolumeClaimRow): ContextMenuItem[] => [
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => navigate(`/container/pvc/${row.id}/edit-yaml`),
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
  const columns: TableColumn<PersistentVolumeClaimRow>[] = [
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
            navigate(`/container/pvc/${row.id}`);
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
        <span className="min-w-0 truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'volume',
      label: 'Volume',
      flex: 1,
      minWidth: columnMinWidths.volume,
      sortable: true,
      render: (value: string) =>
        value ? (
          <span className="truncate block w-full" title={value}>
            {value}
          </span>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      flex: 1,
      minWidth: columnMinWidths.capacity,
    },
    {
      key: 'accessModes',
      label: 'Access modes',
      flex: 1,
      minWidth: columnMinWidths.accessModes,
    },
    {
      key: 'storageClass',
      label: 'Storage class',
      flex: 1,
      minWidth: columnMinWidths.storageClass,
    },
    {
      key: 'volumeAttributesClass',
      label: 'VolumeAttributesClass',
      flex: 1,
      minWidth: columnMinWidths.volumeAttributesClass,
      sortable: true,
      render: (value: string) =>
        value ? value : <span className="text-[var(--color-text-subtle)]">-</span>,
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
      onClick: () => navigate('/container/pvc/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create as YAML',
      onClick: () => navigate('/container/pvc/create-yaml'),
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
          breadcrumb={<Breadcrumb items={[{ label: 'Persistent Volume Claims' }]} />}
          actions={
            <ContainerTopBarActions
              onTerminalClick={() => {
                if (shellPanel.isExpanded) {
                  shellPanel.setIsExpanded(false);
                } else {
                  shellPanel.openConsole('kubectl-pvc', 'Kubectl: ClusterName');
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
          title="Persistent Volume Claims"
          actions={
            <ContextMenu items={createDropdownItems} trigger="click" align="right">
              <Button
                variant="primary"
                size="md"
                rightIcon={<IconChevronDown size={14} stroke={1.5} />}
              >
                Create persistent volume claim
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
                placeholder="Search PVCs by attributes"
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
        <Table<PersistentVolumeClaimRow>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          loading={loading}
          emptyMessage="No persistent volume claims found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete selected persistent volume claims"
        description="This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} persistent volume claim(s)`}
      />
    </PageShell>
  );
}

export default PersistentVolumeClaimsPage;
