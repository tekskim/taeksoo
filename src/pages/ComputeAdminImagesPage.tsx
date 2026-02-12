import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  PageShell,
  PageHeader,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type AccessType = 'Private' | 'Shared' | 'Public';
type ImageStatus = 'active' | 'error' | 'pending' | 'deactivated';

interface Image {
  id: string;
  name: string;
  os: string;
  size: string;
  diskFormat: string;
  protected: boolean;
  access: AccessType;
  description: string;
  createdAt: string;
  status: ImageStatus;
  tenant: string;
  tenantId: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockImages: Image[] = [
  {
    id: '29tgj234',
    name: 'Ubuntu-22.04-base',
    os: 'Ubuntu24.04',
    size: '16GiB',
    diskFormat: 'RAW',
    protected: true,
    access: 'Private',
    description: 'Base Ubuntu 22.04 image',
    createdAt: 'Sep 12, 2025',
    status: 'active',
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
  },
  {
    id: 'img-002',
    name: 'CentOS-8-minimal',
    os: 'CentOS8',
    size: '8GiB',
    diskFormat: 'QCOW2',
    protected: false,
    access: 'Private',
    description: 'Minimal CentOS 8 installation',
    createdAt: 'Sep 10, 2025',
    status: 'active',
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
  },
  {
    id: 'img-003',
    name: 'Rocky-Linux-9',
    os: 'Rocky Linux 9',
    size: '12GiB',
    diskFormat: 'RAW',
    protected: true,
    access: 'Shared',
    description: 'Rocky Linux 9 server image',
    createdAt: 'Sep 8, 2025',
    status: 'active',
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
  },
  {
    id: 'img-004',
    name: 'Debian-12-standard',
    os: 'Debian 12',
    size: '10GiB',
    diskFormat: 'QCOW2',
    protected: false,
    access: 'Public',
    description: 'Standard Debian 12 image',
    createdAt: 'Sep 5, 2025',
    status: 'active',
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
  },
  {
    id: 'img-005',
    name: 'Ubuntu-20.04-LTS',
    os: 'Ubuntu20.04',
    size: '14GiB',
    diskFormat: 'RAW',
    protected: true,
    access: 'Private',
    description: 'Ubuntu 20.04 LTS server',
    createdAt: 'Aug 28, 2025',
    status: 'active',
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
  },
  {
    id: 'img-006',
    name: 'Windows-Server-2022',
    os: 'Windows Server 2022',
    size: '32GiB',
    diskFormat: 'QCOW2',
    protected: false,
    access: 'Shared',
    description: 'Windows Server 2022 Datacenter',
    createdAt: 'Aug 25, 2025',
    status: 'pending',
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
  },
  {
    id: 'img-007',
    name: 'Alpine-3.18-minimal',
    os: 'Alpine 3.18',
    size: '256MiB',
    diskFormat: 'RAW',
    protected: false,
    access: 'Public',
    description: 'Lightweight Alpine Linux',
    createdAt: 'Aug 20, 2025',
    status: 'active',
    tenant: 'Tenant D',
    tenantId: 'tenant-004',
  },
  {
    id: 'img-008',
    name: 'Fedora-39-workstation',
    os: 'Fedora 39',
    size: '20GiB',
    diskFormat: 'RAW',
    protected: true,
    access: 'Private',
    description: 'Fedora 39 workstation image',
    createdAt: 'Aug 15, 2025',
    status: 'active',
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
  },
  {
    id: 'img-009',
    name: 'Oracle-Linux-8',
    os: 'Oracle Linux 8',
    size: '18GiB',
    diskFormat: 'QCOW2',
    protected: false,
    access: 'Shared',
    description: 'Oracle Linux 8 for databases',
    createdAt: 'Aug 10, 2025',
    status: 'deactivated',
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
  },
  {
    id: 'img-010',
    name: 'Ubuntu-22.04-GPU',
    os: 'Ubuntu22.04',
    size: '24GiB',
    diskFormat: 'RAW',
    protected: true,
    access: 'Private',
    description: 'Ubuntu with GPU drivers',
    createdAt: 'Aug 5, 2025',
    status: 'active',
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'os', label: 'OS', type: 'text' },
  {
    key: 'diskFormat',
    label: 'Disk Format',
    type: 'select',
    options: [
      { value: 'RAW', label: 'RAW' },
      { value: 'QCOW2', label: 'QCOW2' },
    ],
  },
  {
    key: 'access',
    label: 'Access',
    type: 'select',
    options: [
      { value: 'Private', label: 'Private' },
      { value: 'Shared', label: 'Shared' },
      { value: 'Public', label: 'Public' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'error', label: 'Error' },
      { value: 'deactivated', label: 'Deactivated' },
    ],
  },
];

export function ComputeAdminImagesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState(mockImages);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<Image | null>(null);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'tenant', label: 'Tenant', visible: true },
    { id: 'os', label: 'OS', visible: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'diskFormat', label: 'Disk format', visible: true },
    { id: 'protected', label: 'Visibility', visible: true },
    { id: 'createdAt', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Handle window close - navigate to root
  const handleWindowClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle delete image
  const handleDeleteClick = (image: Image) => {
    setImageToDelete(image);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (imageToDelete) {
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
      setDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setImageToDelete(null);
  };

  // Filter images by search
  const filteredImages = useMemo(() => {
    let filtered = images;

    // Filter by applied filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((img) => {
        return appliedFilters.every((filter) => {
          const value = String(img[filter.field as keyof Image] || '').toLowerCase();
          return value.includes(filter.value.toLowerCase());
        });
      });
    }

    return filtered;
  }, [images, appliedFilters]);

  const totalPages = Math.ceil(filteredImages.length / rowsPerPage);

  // Paginated images for display
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle bulk delete
  const handleBulkDelete = () => {
    setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  // Table columns
  const columns: TableColumn<Image>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/images/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'tenant',
      label: 'Tenant',
      flex: 1,
      minWidth: columnMinWidths.user,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/tenants/${row.tenantId}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.tenant}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.tenantId}</span>
        </div>
      ),
    },
    {
      key: 'os',
      label: 'OS',
      flex: 1,
      minWidth: columnMinWidths.os,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
    },
    {
      key: 'diskFormat',
      label: 'Disk format',
      flex: 1,
      minWidth: columnMinWidths.diskFormat,
      sortable: true,
    },
    {
      key: 'protected',
      label: 'Visibility',
      flex: 1,
      minWidth: columnMinWidths.visibility,
      render: (_, row) => (row.protected ? 'Private' : 'Public'),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => console.log('Edit image:', row.id),
          },
          {
            id: 'manage-metadata',
            label: 'Manage metadata',
            onClick: () => console.log('Manage metadata:', row.id),
          },
          {
            id: 'manage-access',
            label: 'Manage access',
            onClick: () => console.log('Manage access:', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            divider: true,
            onClick: () => handleDeleteClick(row),
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

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<Image> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={handleWindowClose}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Compute Admin', href: '/compute-admin' }, { label: 'Images' }]}
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
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader
          title="Images"
          actions={
            <Button size="md" onClick={() => navigate('/compute-admin/images/create')}>
              Create image
            </Button>
          }
        />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search image by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
              <Button
                variant="secondary"
                size="sm"
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
                disabled={selectedImages.length === 0}
                onClick={handleBulkDelete}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        {/* Pagination */}
        {filteredImages.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            onSettingsClick={() => setIsPreferencesOpen(true)}
            totalItems={filteredImages.length}
            selectedCount={selectedImages.length}
          />
        )}

        {/* Image Table */}
        <Table<Image>
          columns={visibleColumns}
          data={paginatedImages}
          rowKey="id"
          emptyMessage="No images found"
          selectable
          selectedKeys={selectedImages}
          onSelectionChange={setSelectedImages}
        />
      </VStack>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete image"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Image name"
        infoValue={imageToDelete?.name}
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
    </PageShell>
  );
}

export default ComputeAdminImagesPage;
