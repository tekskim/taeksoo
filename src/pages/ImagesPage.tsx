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
  Tabs,
  TabList,
  Tab,
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
  IconBrandUbuntu,
  IconBrandDebian,
  IconBrandWindows,
  IconBrandRedhat,
} from '@tabler/icons-react';
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
  createdAt: string;
  status: ImageStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockImages: Image[] = [
  { id: '29tgj234', name: 'image', os: 'Ubuntu24.04', size: '16GiB', diskFormat: 'RAW', protected: true, access: 'Private', createdAt: '2025-09-12', status: 'active' },
  { id: 'img-002', name: 'CentOS-8-minimal', os: 'CentOS8', size: '8GiB', diskFormat: 'QCOW2', protected: false, access: 'Private', createdAt: '2025-09-10', status: 'active' },
  { id: 'img-003', name: 'Rocky-Linux-9', os: 'Rocky Linux 9', size: '12GiB', diskFormat: 'RAW', protected: true, access: 'Shared', createdAt: '2025-09-08', status: 'active' },
  { id: 'img-004', name: 'Debian-12-standard', os: 'Debian 12', size: '10GiB', diskFormat: 'QCOW2', protected: false, access: 'Public', createdAt: '2025-09-05', status: 'active' },
  { id: 'img-005', name: 'Ubuntu-20.04-LTS', os: 'Ubuntu20.04', size: '14GiB', diskFormat: 'RAW', protected: true, access: 'Private', createdAt: '2025-08-28', status: 'active' },
  { id: 'img-006', name: 'Windows-Server-2022', os: 'Windows Server 2022', size: '32GiB', diskFormat: 'QCOW2', protected: false, access: 'Shared', createdAt: '2025-08-25', status: 'pending' },
  { id: 'img-007', name: 'Alpine-3.18-minimal', os: 'Alpine 3.18', size: '256MiB', diskFormat: 'RAW', protected: false, access: 'Public', createdAt: '2025-08-20', status: 'active' },
  { id: 'img-008', name: 'Fedora-39-workstation', os: 'Fedora 39', size: '20GiB', diskFormat: 'RAW', protected: true, access: 'Private', createdAt: '2025-08-15', status: 'active' },
  { id: 'img-009', name: 'Oracle-Linux-8', os: 'Oracle Linux 8', size: '18GiB', diskFormat: 'QCOW2', protected: false, access: 'Shared', createdAt: '2025-08-10', status: 'deactivated' },
  { id: 'img-010', name: 'Ubuntu-22.04-GPU', os: 'Ubuntu22.04', size: '24GiB', diskFormat: 'RAW', protected: true, access: 'Private', createdAt: '2025-08-05', status: 'active' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ImagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('current');
  const [images, setImages] = useState(mockImages);
  
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
    { id: 'os', label: 'OS', visible: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'diskFormat', label: 'Disk Format', visible: true },
    { id: 'protected', label: 'Protected', visible: true },
    { id: 'access', label: 'Access', visible: true },
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

  // Filter images by tab and search
  const filteredImages = useMemo(() => {
    let filtered = images;

    // Filter by tab
    switch (activeTab) {
      case 'current':
        filtered = filtered.filter((img) => img.access === 'Private');
        break;
      case 'shared':
        filtered = filtered.filter((img) => img.access === 'Shared');
        break;
      case 'public':
        filtered = filtered.filter((img) => img.access === 'Public');
        break;
      // 'all' shows everything
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (img) =>
          img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.os.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [images, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredImages.length / rowsPerPage);

  // Get OS icon based on OS name
  const getOsIcon = (os: string) => {
    const osLower = os.toLowerCase();
    if (osLower.includes('ubuntu')) {
      return <IconBrandUbuntu size={16} stroke={1} className="text-[#E95420]" />;
    } else if (osLower.includes('debian')) {
      return <IconBrandDebian size={16} stroke={1} className="text-[#A81D33]" />;
    } else if (osLower.includes('windows')) {
      return <IconBrandWindows size={16} stroke={1} className="text-[#0078D6]" />;
    } else if (osLower.includes('centos') || osLower.includes('rocky') || osLower.includes('fedora') || osLower.includes('oracle')) {
      return <IconBrandRedhat size={16} stroke={1} className="text-[#EE0000]" />;
    }
    return <div className="w-4 h-4 rounded-full bg-[var(--color-text-subtle)]" />;
  };

  // Table columns
  const columns: TableColumn<Image>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={row.status} layout="icon-only" />
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
            to={`/images/${row.id}`}
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
      key: 'os',
      label: 'OS',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {getOsIcon(row.os)}
          <span>{row.os}</span>
        </div>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      width: '100px',
      sortable: true,
    },
    {
      key: 'diskFormat',
      label: 'Disk format',
      width: '120px',
      sortable: true,
    },
    {
      key: 'protected',
      label: 'protected',
      width: '100px',
      render: (_, row) => (
        <span>{row.protected ? 'On' : 'Off'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '120px',
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
            onClick: () => console.log('Create instance from image:', row.id),
          },
          {
            id: 'create-instance-template',
            label: 'Create Instance Template',
            onClick: () => console.log('Create instance template from image:', row.id),
          },
          {
            id: 'create-volume',
            label: 'Create Volume',
            onClick: () => console.log('Create volume from image:', row.id),
          },
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => console.log('Edit image:', row.id),
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
                <IconDotsCircleHorizontal size={16} stroke={1} className="text-[var(--color-text-subtle)]" />
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
      .filter((col): col is TableColumn<Image> => col !== undefined);
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
                { label: 'Images' },
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

        {/* Page Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Images
              </h1>
              <Button leftIcon={<IconPlus size={16} />}>
                Create Image
              </Button>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
              <TabList>
                <Tab value="current">Current Tenant</Tab>
                <Tab value="shared">Shared</Tab>
                <Tab value="public">Public</Tab>
                <Tab value="all">All</Tab>
              </TabList>
            </Tabs>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find Image with filters"
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
                  <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled>
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
              />
            )}

            {/* Image Table */}
            <Table<Image>
              columns={visibleColumns}
              data={filteredImages.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
              rowKey="id"
              emptyMessage="No images found"
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
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
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
    </div>
  );
}

export default ImagesPage;

