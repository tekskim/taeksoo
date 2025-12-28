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
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  StatusIndicator,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  IconPlus,
  IconDotsVertical,
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SnapshotStatus = 'active' | 'creating' | 'error' | 'deleting';

interface VolumeSnapshot {
  id: string;
  name: string;
  size: string;
  sourceVolume: string;
  sourceVolumeId: string;
  createdAt: string;
  status: SnapshotStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumeSnapshots: VolumeSnapshot[] = [
  { id: 'vsnap-001', name: 'db-data-snap', size: '1500GiB', sourceVolume: 'vol-1', sourceVolumeId: 'vol-001', createdAt: '2025-09-12', status: 'active' },
  { id: 'vsnap-002', name: 'app-storage-snap', size: '500GiB', sourceVolume: 'vol-2', sourceVolumeId: 'vol-002', createdAt: '2025-09-10', status: 'active' },
  { id: 'vsnap-003', name: 'backup-vol-snap', size: '2000GiB', sourceVolume: 'vol-3', sourceVolumeId: 'vol-003', createdAt: '2025-09-08', status: 'active' },
  { id: 'vsnap-004', name: 'log-storage-snap', size: '100GiB', sourceVolume: 'vol-4', sourceVolumeId: 'vol-004', createdAt: '2025-09-05', status: 'creating' },
  { id: 'vsnap-005', name: 'cache-vol-snap', size: '256GiB', sourceVolume: 'vol-5', sourceVolumeId: 'vol-005', createdAt: '2025-08-30', status: 'active' },
  { id: 'vsnap-006', name: 'media-storage-snap', size: '5000GiB', sourceVolume: 'vol-6', sourceVolumeId: 'vol-006', createdAt: '2025-08-25', status: 'active' },
  { id: 'vsnap-007', name: 'temp-vol-snap', size: '50GiB', sourceVolume: 'vol-7', sourceVolumeId: 'vol-007', createdAt: '2025-08-20', status: 'error' },
  { id: 'vsnap-008', name: 'ml-data-snap', size: '1000GiB', sourceVolume: 'vol-8', sourceVolumeId: 'vol-008', createdAt: '2025-08-15', status: 'active' },
  { id: 'vsnap-009', name: 'archive-vol-snap', size: '10000GiB', sourceVolume: 'vol-9', sourceVolumeId: 'vol-009', createdAt: '2025-08-10', status: 'active' },
  { id: 'vsnap-010', name: 'boot-vol-snap', size: '100GiB', sourceVolume: 'vol-10', sourceVolumeId: 'vol-010', createdAt: '2025-08-05', status: 'deleting' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const volumeSnapshotStatusMap: Record<SnapshotStatus, 'active' | 'building' | 'error' | 'pending'> = {
  'active': 'active',
  'creating': 'building',
  'error': 'error',
  'deleting': 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function VolumeSnapshotsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [snapshots, setSnapshots] = useState(mockVolumeSnapshots);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [snapshotToDelete, setSnapshotToDelete] = useState<VolumeSnapshot | null>(null);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'sourceVolume', label: 'Source Volume', visible: true },
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


  // Handle delete snapshot
  const handleDeleteClick = (snapshot: VolumeSnapshot) => {
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

  // Filter snapshots by search
  const filteredSnapshots = useMemo(() => {
    if (!searchQuery) return snapshots;
    
    return snapshots.filter(
      (snapshot) =>
        snapshot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snapshot.sourceVolume.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [snapshots, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredSnapshots.length / rowsPerPage);
  const paginatedSnapshots = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredSnapshots.slice(start, end);
  }, [filteredSnapshots, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<VolumeSnapshot>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator status={volumeSnapshotStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-[var(--color-action-primary)]">{value}</span>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'sourceVolume',
      label: 'Source Volume',
      flex: 1,
      sortable: false,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <a
            href={`/volumes/${row.sourceVolumeId}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.sourceVolume}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.sourceVolumeId}
          </span>
        </div>
      ),
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
            id: 'create-volume',
            label: 'Create Volume',
            onClick: () => console.log('Create volume from', row.name),
          },
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => console.log('Edit', row.name),
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
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
                <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-subtle)]" />
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
      .filter((col): col is TableColumn<VolumeSnapshot> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main
        className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 overflow-x-auto ${
          sidebarOpen ? 'ml-[200px]' : 'ml-0'
        }`}
      >
        <div className="min-w-[var(--layout-content-min-width)]">
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

        {/* Top Bar */}
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
                { label: 'Volume Snapshots' },
              ]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />

        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Volume Snapshots
              </h1>
              <Button leftIcon={<IconPlus size={16} />}>
                Create Snapshot
              </Button>
            </div>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find snapshot with filters"
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
                  >
                    Delete
                  </Button>
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSnapshots.length}
              selectedCount={selectedSnapshots.length}
              onPageChange={setCurrentPage}
              showSettings
              onSettingsClick={() => setIsPreferencesOpen(true)}
            />

            {/* Table */}
            <Table
              columns={visibleColumns}
              data={paginatedSnapshots}
              rowKey="id"
              selectable={true}
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
        title="Delete Volume Snapshot"
        description={`Are you sure you want to delete "${snapshotToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
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

export default VolumeSnapshotsPage;

