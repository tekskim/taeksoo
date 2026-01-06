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
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
  IconTransfer,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type VolumeStatus = 'active' | 'in-use' | 'error' | 'pending';

interface Volume {
  id: string;
  name: string;
  size: string;
  type: string;
  diskTag: string;
  attachedTo: string | null;
  attachedToId: string | null;
  createdAt: string;
  status: VolumeStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumes: Volume[] = [
  { id: 'vol-001', name: 'db-data', size: '1500GiB', type: '_DEFAULT_', diskTag: 'Data Disk', attachedTo: 'web-server-1', attachedToId: 'inst-001', createdAt: '2025-09-12', status: 'in-use' },
  { id: 'vol-002', name: 'app-storage', size: '500GiB', type: '_DEFAULT_', diskTag: 'Data Disk', attachedTo: 'app-server-1', attachedToId: 'inst-002', createdAt: '2025-09-10', status: 'in-use' },
  { id: 'vol-003', name: 'backup-vol', size: '2000GiB', type: 'SSD', diskTag: 'Backup', attachedTo: null, attachedToId: null, createdAt: '2025-09-08', status: 'active' },
  { id: 'vol-004', name: 'log-storage', size: '100GiB', type: '_DEFAULT_', diskTag: 'Logs', attachedTo: 'log-server', attachedToId: 'inst-003', createdAt: '2025-09-05', status: 'in-use' },
  { id: 'vol-005', name: 'cache-vol', size: '256GiB', type: 'NVMe', diskTag: 'Cache', attachedTo: 'cache-01', attachedToId: 'inst-004', createdAt: '2025-08-30', status: 'in-use' },
  { id: 'vol-006', name: 'media-storage', size: '5000GiB', type: 'HDD', diskTag: 'Media', attachedTo: null, attachedToId: null, createdAt: '2025-08-25', status: 'active' },
  { id: 'vol-007', name: 'temp-vol', size: '50GiB', type: '_DEFAULT_', diskTag: 'Temporary', attachedTo: null, attachedToId: null, createdAt: '2025-08-20', status: 'pending' },
  { id: 'vol-008', name: 'ml-data', size: '1000GiB', type: 'NVMe', diskTag: 'ML Dataset', attachedTo: 'gpu-server-1', attachedToId: 'inst-005', createdAt: '2025-08-15', status: 'in-use' },
  { id: 'vol-009', name: 'archive-vol', size: '10000GiB', type: 'HDD', diskTag: 'Archive', attachedTo: null, attachedToId: null, createdAt: '2025-08-10', status: 'active' },
  { id: 'vol-010', name: 'boot-vol-01', size: '100GiB', type: 'SSD', diskTag: 'Boot', attachedTo: 'web-server-2', attachedToId: 'inst-006', createdAt: '2025-08-05', status: 'in-use' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const volumeStatusMap: Record<VolumeStatus, 'active' | 'in-use' | 'error' | 'pending'> = {
  'active': 'active',
  'in-use': 'in-use',
  'error': 'error',
  'pending': 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function VolumesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [volumes, setVolumes] = useState(mockVolumes);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [volumeToDelete, setVolumeToDelete] = useState<Volume | null>(null);

  // Selection state
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'type', label: 'Type', visible: true },
    { id: 'diskTag', label: 'Disk Tag', visible: true },
    { id: 'attachedTo', label: 'Attached To', visible: true },
    { id: 'createdAt', label: 'Created At', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, openInNewTab, addNewTab } = useTabs();

  // Handle opening instance in new tab
  const handleOpenInNewTab = (instanceId: string, instanceName: string) => {
    openInNewTab(instanceId, instanceName, `/instances/${instanceId}`);
  };

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle delete volume
  const handleDeleteClick = (volume: Volume) => {
    setVolumeToDelete(volume);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (volumeToDelete) {
      setVolumes((prev) => prev.filter((v) => v.id !== volumeToDelete.id));
      setDeleteModalOpen(false);
      setVolumeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setVolumeToDelete(null);
  };

  // Filter volumes by search
  const filteredVolumes = useMemo(() => {
    if (!searchQuery) return volumes;
    
    return volumes.filter(
      (v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.diskTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.attachedTo && v.attachedTo.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [volumes, searchQuery]);

  const totalPages = Math.ceil(filteredVolumes.length / rowsPerPage);

  // Table columns
  const columns: TableColumn<Volume>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={volumeStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/compute/volumes/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
    },
    {
      key: 'diskTag',
      label: 'Disk Tag',
      flex: 1,
    },
    {
      key: 'attachedTo',
      label: 'Attached To',
      flex: 1,
      render: (_, row) => (
        row.attachedTo && row.attachedToId ? (
          <div className="flex flex-col gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenInNewTab(row.attachedToId!, row.attachedTo!);
              }}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            >
              {row.attachedTo}
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            </button>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              ID : {row.attachedToId}
            </span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        )
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
            id: 'data-protection',
            label: 'Data Protection',
            submenu: [
              { id: 'create-snapshot', label: 'Create Volume Snapshot', onClick: () => console.log('Create snapshot:', row.id) },
              { id: 'create-backup', label: 'Create Volume Backup', onClick: () => console.log('Create backup:', row.id) },
              { id: 'clone-volume', label: 'Clone Volume', onClick: () => console.log('Clone volume:', row.id) },
              { id: 'restore-snapshot', label: 'Restore from Snapshot', onClick: () => console.log('Restore from snapshot:', row.id) },
            ],
          },
          {
            id: 'operate',
            label: 'Operate',
            submenu: [
              { id: 'create-instance', label: 'Create Instance', onClick: () => console.log('Create instance:', row.id) },
              { id: 'create-image', label: 'Create Image', onClick: () => console.log('Create image:', row.id) },
              { id: 'attach-instance', label: 'Attach Instance', onClick: () => console.log('Attach instance:', row.id) },
              { id: 'detach-instance', label: 'Detach Instance', onClick: () => console.log('Detach instance:', row.id) },
              { id: 'boot-setting', label: 'Boot Setting', onClick: () => console.log('Boot setting:', row.id) },
            ],
          },
          {
            id: 'configuration',
            label: 'Configuration',
            submenu: [
              { id: 'edit', label: 'Edit', onClick: () => console.log('Edit:', row.id) },
              { id: 'extend-volume', label: 'Extend Volume', onClick: () => console.log('Extend volume:', row.id) },
              { id: 'change-volume-type', label: 'Change Volume Type', onClick: () => console.log('Change volume type:', row.id) },
            ],
          },
          {
            id: 'create-transfer',
            label: 'Create Transfer',
            onClick: () => console.log('Create transfer:', row.id),
          },
          {
            id: 'cancel-transfer',
            label: 'Cancel Transfer',
            onClick: () => console.log('Cancel transfer:', row.id),
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
      .filter((col): col is TableColumn<Volume> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

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
                  { label: 'Volumes' },
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Volumes
              </h1>
              <Button>
                Create Volume
              </Button>
            </div>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find volume with filters"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button variant="secondary" size="sm" iconOnly icon={<IconDownload size={12} />} aria-label="Download" />
                </ListToolbar.Actions>
              }
              bulkActions={
                <ListToolbar.Actions>
                  <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled>
                    Delete
                  </Button>
                  <Button variant="muted" size="sm" leftIcon={<IconTransfer size={12} />} disabled>
                    Accept Volume Transfer
                  </Button>
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            {filteredVolumes.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
                totalItems={filteredVolumes.length}
                selectedCount={selectedVolumes.length}
              />
            )}

            {/* Volumes Table */}
            <Table<Volume>
              columns={visibleColumns}
              data={filteredVolumes.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
              rowKey="id"
              emptyMessage="No volumes found"
              selectable
              selectedKeys={selectedVolumes}
              onSelectionChange={setSelectedVolumes}
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
        title="Delete Volume"
        description="Are you sure you want to delete this volume? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Volume name"
        infoValue={volumeToDelete?.name}
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

export default VolumesPage;

