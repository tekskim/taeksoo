import { useState, useMemo } from 'react';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  StatusIndicator,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  Checkbox,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SnapshotStatus = 'active' | 'creating' | 'error' | 'deleting';
type AccessType = 'Private' | 'Public';

interface InstanceSnapshot {
  id: string;
  name: string;
  status: SnapshotStatus;
  size: string;
  diskFormat: string;
  sourceInstance: string;
  sourceInstanceId: string;
  description: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSnapshots: InstanceSnapshot[] = [
  { id: 'snap-001', name: 'Ubuntu-22.04-base', status: 'active', size: '16GiB', diskFormat: 'RAW', sourceInstance: 'web-server-01', sourceInstanceId: 'vm-001', description: 'Base web server snapshot', createdAt: '2025-09-12' },
  { id: 'snap-002', name: 'CentOS-8-web', status: 'active', size: '32GiB', diskFormat: 'QCOW2', sourceInstance: 'db-server-01', sourceInstanceId: 'vm-002', description: 'Database server backup', createdAt: '2025-09-10' },
  { id: 'snap-003', name: 'Debian-12-db', status: 'active', size: '64GiB', diskFormat: 'RAW', sourceInstance: 'app-server-01', sourceInstanceId: 'vm-003', description: 'Application server snapshot', createdAt: '2025-09-08' },
  { id: 'snap-004', name: 'Rocky-9-ml', status: 'creating', size: '128GiB', diskFormat: 'QCOW2', sourceInstance: 'ml-worker-01', sourceInstanceId: 'vm-004', description: 'ML worker with GPU config', createdAt: '2025-09-07' },
  { id: 'snap-005', name: 'Ubuntu-22.04-k8s', status: 'active', size: '24GiB', diskFormat: 'RAW', sourceInstance: 'k8s-node-01', sourceInstanceId: 'vm-005', description: 'Kubernetes node snapshot', createdAt: '2025-09-05' },
  { id: 'snap-006', name: 'Alpine-3.18-minimal', status: 'active', size: '8GiB', diskFormat: 'QCOW2', sourceInstance: 'gateway-01', sourceInstanceId: 'vm-006', description: 'Gateway server backup', createdAt: '2025-09-03' },
  { id: 'snap-007', name: 'Windows-Server-2022', status: 'active', size: '80GiB', diskFormat: 'RAW', sourceInstance: 'win-server-01', sourceInstanceId: 'vm-007', description: 'Windows server snapshot', createdAt: '2025-09-01' },
  { id: 'snap-008', name: 'RHEL-8-enterprise', status: 'error', size: '48GiB', diskFormat: 'QCOW2', sourceInstance: 'enterprise-01', sourceInstanceId: 'vm-008', description: 'Enterprise app backup', createdAt: '2025-08-28' },
  { id: 'snap-009', name: 'Fedora-39-dev', status: 'active', size: '20GiB', diskFormat: 'RAW', sourceInstance: 'dev-server-01', sourceInstanceId: 'vm-009', description: 'Development environment', createdAt: '2025-08-25' },
  { id: 'snap-010', name: 'Ubuntu-20.04-legacy', status: 'active', size: '40GiB', diskFormat: 'QCOW2', sourceInstance: 'legacy-app-01', sourceInstanceId: 'vm-010', description: 'Legacy application backup', createdAt: '2025-08-20' },
  { id: 'snap-011', name: 'Arch-Linux-custom', status: 'active', size: '12GiB', diskFormat: 'RAW', sourceInstance: 'custom-build-01', sourceInstanceId: 'vm-011', description: 'Custom build environment', createdAt: '2025-08-18' },
  { id: 'snap-012', name: 'openSUSE-15-prod', status: 'active', size: '36GiB', diskFormat: 'QCOW2', sourceInstance: 'prod-server-01', sourceInstanceId: 'vm-012', description: 'Production server snapshot', createdAt: '2025-08-15' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function InstanceSnapshotsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [snapshots, setSnapshots] = useState(mockSnapshots);
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>([]);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [snapshotToDelete, setSnapshotToDelete] = useState<InstanceSnapshot | null>(null);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'diskFormat', label: 'Disk Format', visible: true },
    { id: 'sourceInstance', label: 'Source Instance', visible: true },
    { id: 'description', label: 'Description', visible: true },
    { id: 'createdAt', label: 'Created At', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter snapshots by search
  const filteredSnapshots = useMemo(() => {
    if (!searchQuery) return snapshots;
    const query = searchQuery.toLowerCase();
    return snapshots.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.os.toLowerCase().includes(query)
    );
  }, [snapshots, searchQuery]);

  const totalPages = Math.ceil(filteredSnapshots.length / rowsPerPage);

  // Handle delete
  const handleDeleteClick = (snapshot: InstanceSnapshot) => {
    setSnapshotToDelete(snapshot);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (snapshotToDelete) {
      setSnapshots((prev) => prev.filter((s) => s.id !== snapshotToDelete.id));
      setDeleteModalOpen(false);
      setSnapshotToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSnapshotToDelete(null);
  };

  // Selection handlers
  const toggleSelection = (id: string) => {
    setSelectedSnapshots((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    const currentPageIds = filteredSnapshots
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      .map((s) => s.id);

    const allSelected = currentPageIds.every((id) => selectedSnapshots.includes(id));

    if (allSelected) {
      setSelectedSnapshots((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedSnapshots((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  // Bulk delete handler
  const handleBulkDelete = () => {
    setSnapshots((prev) => prev.filter((s) => !selectedSnapshots.includes(s.id)));
    setSelectedSnapshots([]);
  };

  // Get current page IDs for "select all" checkbox state
  const currentPageIds = filteredSnapshots
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((s) => s.id);
  const allCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedSnapshots.includes(id));
  const someCurrentPageSelected = currentPageIds.some((id) => selectedSnapshots.includes(id));

  // Status mapping
  const statusMap: Record<SnapshotStatus, 'active' | 'building' | 'error' | 'shutoff'> = {
    active: 'active',
    creating: 'building',
    error: 'error',
    deleting: 'shutoff',
  };

  // Table columns
  const columns: TableColumn<InstanceSnapshot>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator status={statusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
        <Link
          to={`/compute/instance-snapshots/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'diskFormat',
      label: 'Disk Format',
      flex: 1,
      sortable: true,
    },
    {
      key: 'sourceInstance',
      label: 'Source Instance',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/instances/${row.sourceInstanceId}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.sourceInstance}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.sourceInstanceId}
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'create-instance',
            label: 'Create Instance',
            onClick: () => console.log('Create instance from snapshot:', row.id),
          },
          {
            id: 'create-volume',
            label: 'Create Volume',
            onClick: () => console.log('Create volume from snapshot:', row.id),
          },
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => console.log('Edit snapshot:', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => handleDeleteClick(row),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig
      .filter((col) => col.visible)
      .map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<InstanceSnapshot> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          showAddButton={true}
          showWindowControls={true}
        />

        {/* Top Bar with Breadcrumb Navigation */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Instance Snapshots' },
              ]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
        {/* Page Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Instance Snapshots
              </h1>
              <Button>
                Create Snapshot
              </Button>
            </div>

            {/* Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find Snapshot with filters"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
                </ListToolbar.Actions>
              }
              bulkActions={
                <ListToolbar.Actions>
                  <Button
                    variant="muted"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                    disabled={selectedSnapshots.length === 0}
                    onClick={handleBulkDelete}
                  >
                    Delete
                  </Button>
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            {filteredSnapshots.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
                totalItems={filteredSnapshots.length}
                selectedCount={selectedSnapshots.length}
              />
            )}

            {/* Table */}
            <Table<InstanceSnapshot>
              columns={visibleColumns}
              data={filteredSnapshots.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
              rowKey="id"
              emptyMessage="No snapshots found"
              selectable
              selectedKeys={selectedSnapshots}
              onSelectionChange={setSelectedSnapshots}
            />
          </VStack>
        </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Snapshot"
        description="Are you sure you want to delete this snapshot? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Snapshot name"
        infoValue={snapshotToDelete?.name}
      />

      {/* View Preferences Drawer */}
      <ViewPreferencesDrawer
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columnConfig}
        defaultColumns={defaultColumnConfig}
        onColumnsChange={setColumnConfig}
      />
    </div>
  );
}

export default InstanceSnapshotsPage;

