import { useState, useMemo } from 'react';
import {
  Button,
  FilterSearchInput,
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
  type FilterField,
  type AppliedFilter,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { EditVolumeDrawer } from '@/components/EditVolumeDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type VolumeStatus = 'active' | 'in-use' | 'error' | 'pending';

interface Volume {
  id: string;
  name: string;
  tenant: string | null;
  tenantId: string | null;
  host: string | null;
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
  {
    id: '12345678',
    name: 'volume',
    tenant: 'tenant',
    tenantId: '12345678',
    host: 'host',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data Disk',
    attachedTo: 'instance',
    attachedToId: '12345678',
    createdAt: 'Dec 25, 2025',
    status: 'active',
  },
  {
    id: '12345679',
    name: 'volume',
    tenant: 'tenant',
    tenantId: '12345679',
    host: 'host',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data Disk',
    attachedTo: 'instance',
    attachedToId: '12345679',
    createdAt: 'Dec 25, 2025',
    status: 'active',
  },
  {
    id: '12345680',
    name: 'volume',
    tenant: 'tenant',
    tenantId: '12345680',
    host: 'host',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data Disk',
    attachedTo: 'instance',
    attachedToId: '12345680',
    createdAt: 'Dec 25, 2025',
    status: 'active',
  },
  {
    id: '12345681',
    name: 'volume',
    tenant: 'tenant',
    tenantId: '12345681',
    host: 'host',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data Disk',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Dec 25, 2025',
    status: 'active',
  },
  {
    id: '12345682',
    name: 'volume',
    tenant: null,
    tenantId: null,
    host: 'host',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data Disk',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Dec 25, 2025',
    status: 'pending',
  },
  {
    id: '12345683',
    name: 'volume',
    tenant: null,
    tenantId: null,
    host: null,
    size: '1500GiB',
    type: 'SSD',
    diskTag: 'Backup',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Dec 25, 2025',
    status: 'active',
  },
  {
    id: '12345684',
    name: 'volume',
    tenant: 'tenant',
    tenantId: '12345684',
    host: 'host',
    size: '500GiB',
    type: 'NVMe',
    diskTag: 'Cache',
    attachedTo: 'instance',
    attachedToId: '12345684',
    createdAt: 'Dec 25, 2025',
    status: 'in-use',
  },
  {
    id: '12345685',
    name: 'volume',
    tenant: 'tenant',
    tenantId: '12345685',
    host: 'host',
    size: '2000GiB',
    type: 'HDD',
    diskTag: 'Archive',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Dec 25, 2025',
    status: 'active',
  },
  {
    id: '12345686',
    name: 'volume',
    tenant: null,
    tenantId: null,
    host: null,
    size: '100GiB',
    type: '_DEFAULT_',
    diskTag: 'Boot',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Dec 25, 2025',
    status: 'error',
  },
  {
    id: '12345687',
    name: 'volume',
    tenant: 'tenant',
    tenantId: '12345687',
    host: 'host',
    size: '1000GiB',
    type: 'NVMe',
    diskTag: 'ML Dataset',
    attachedTo: 'instance',
    attachedToId: '12345687',
    createdAt: 'Dec 25, 2025',
    status: 'in-use',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const volumeStatusMap: Record<VolumeStatus, 'active' | 'in-use' | 'error' | 'pending'> = {
  active: 'active',
  'in-use': 'in-use',
  error: 'error',
  pending: 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: '_DEFAULT_', label: '_DEFAULT_' },
      { value: 'SSD', label: 'SSD' },
      { value: 'NVMe', label: 'NVMe' },
      { value: 'HDD', label: 'HDD' },
    ],
  },
  { key: 'diskTag', label: 'Disk Tag', type: 'text' },
  { key: 'attachedTo', label: 'Attached To', type: 'text' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'in-use', label: 'In Use' },
      { value: 'error', label: 'Error' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

export function ComputeAdminVolumesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
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

  // Drawer states
  const [editVolumeOpen, setEditVolumeOpen] = useState(false);
  const [selectedVolumeForDrawer, setSelectedVolumeForDrawer] = useState<Volume | null>(null);

  // Drawer handlers
  const handleEditVolume = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setEditVolumeOpen(true);
  };

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'tenant', label: 'Tenant', visible: true },
    { id: 'host', label: 'Host', visible: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'type', label: 'Type', visible: true },
    { id: 'diskTag', label: 'Disk Tag', visible: true },
    { id: 'attachedTo', label: 'Attached To', visible: true },
    { id: 'createdAt', label: 'Created At', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

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

  // Filter volumes by applied filters
  const filteredVolumes = useMemo(() => {
    if (appliedFilters.length === 0) return volumes;

    return volumes.filter((v) => {
      return appliedFilters.every((filter) => {
        const value = String(v[filter.field as keyof Volume] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [volumes, appliedFilters]);

  const totalPages = Math.ceil(filteredVolumes.length / rowsPerPage);

  // Table columns
  const columns: TableColumn<Volume>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
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
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/volumes/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'tenant',
      label: 'Tenant',
      flex: 1,
      sortable: true,
      render: (_, row) =>
        row.tenant && row.tenantId ? (
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/compute-admin/tenants/${row.tenantId}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.tenant}
            </Link>
            <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.tenantId}</span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
    {
      key: 'host',
      label: 'Host',
      flex: 1,
      sortable: true,
      render: (value) => value || <span className="text-[var(--color-text-muted)]">-</span>,
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
      render: (_, row) =>
        row.attachedTo && row.attachedToId ? (
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/compute-admin/instances/${row.attachedToId}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.attachedTo}
            </Link>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              ID: {row.attachedToId}
            </span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
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
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', onClick: () => handleEditVolume(row) },
          {
            id: 'update-status',
            label: 'Update status',
            onClick: () => console.log('Update status:', row.id),
          },
          {
            id: 'migrate-volume',
            label: 'Migrate volume',
            onClick: () => console.log('Migrate volume:', row.id),
          },
          {
            id: 'manage-metadata',
            label: 'Manage metadata',
            onClick: () => console.log('Manage metadata:', row.id),
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

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<Volume> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
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
            onTabReorder={moveTab}
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
                items={[{ label: 'Compute Admin', href: '/compute-admin' }, { label: 'Volumes' }]}
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
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Volumes
                </h1>
              </div>

              {/* List Toolbar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={filterFields}
                      appliedFilters={appliedFilters}
                      onFiltersChange={setAppliedFilters}
                      placeholder="Search volume by attributes"
                      className="w-[var(--search-input-width)]"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      iconOnly
                      icon={<IconDownload size={12} />}
                      aria-label="Download"
                    />
                  </ListToolbar.Actions>
                }
                bulkActions={
                  <ListToolbar.Actions>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconTrash size={12} />}
                      disabled={selectedVolumes.length === 0}
                    >
                      Delete
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
                data={filteredVolumes.slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                )}
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

      {/* Edit Volume Drawer */}
      <EditVolumeDrawer
        isOpen={editVolumeOpen}
        onClose={() => setEditVolumeOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
              }
            : null
        }
      />
    </div>
  );
}

export default ComputeAdminVolumesPage;
