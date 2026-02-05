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
  ConfirmModal,
  StatusIndicator,
  ContextMenu,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { CreateRouterDrawer } from '@/components/CreateRouterDrawer';
import {
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type RouterStatus = 'active' | 'error' | 'building';

interface Router {
  id: string;
  name: string;
  portsCount: number;
  externalGateway: boolean;
  externalFixedIp: string;
  externalNetwork: string;
  externalNetworkId: string;
  adminState: boolean;
  status: RouterStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockRouters: Router[] = [
  {
    id: '29tgj234',
    name: 'router-01',
    portsCount: 5,
    externalGateway: true,
    externalFixedIp: '10.7.60.91',
    externalNetwork: 'net-01',
    externalNetworkId: '29tgj234',
    adminState: true,
    status: 'active',
  },
  {
    id: 'router-002',
    name: 'main-router',
    portsCount: 3,
    externalGateway: true,
    externalFixedIp: '10.7.60.92',
    externalNetwork: 'external-net',
    externalNetworkId: 'net-002',
    adminState: true,
    status: 'active',
  },
  {
    id: 'router-003',
    name: 'dev-router',
    portsCount: 2,
    externalGateway: false,
    externalFixedIp: '-',
    externalNetwork: '-',
    externalNetworkId: '',
    adminState: true,
    status: 'active',
  },
  {
    id: 'router-004',
    name: 'prod-router',
    portsCount: 8,
    externalGateway: true,
    externalFixedIp: '10.7.60.93',
    externalNetwork: 'prod-net',
    externalNetworkId: 'net-003',
    adminState: true,
    status: 'building',
  },
  {
    id: 'router-005',
    name: 'test-router',
    portsCount: 1,
    externalGateway: false,
    externalFixedIp: '-',
    externalNetwork: '-',
    externalNetworkId: '',
    adminState: false,
    status: 'active',
  },
  {
    id: 'router-006',
    name: 'backup-router',
    portsCount: 4,
    externalGateway: true,
    externalFixedIp: '10.7.60.94',
    externalNetwork: 'backup-net',
    externalNetworkId: 'net-004',
    adminState: true,
    status: 'active',
  },
  {
    id: 'router-007',
    name: 'dmz-router',
    portsCount: 6,
    externalGateway: true,
    externalFixedIp: '10.7.60.95',
    externalNetwork: 'dmz-net',
    externalNetworkId: 'net-005',
    adminState: false,
    status: 'error',
  },
  {
    id: 'router-008',
    name: 'internal-router',
    portsCount: 2,
    externalGateway: false,
    externalFixedIp: '-',
    externalNetwork: '-',
    externalNetworkId: '',
    adminState: true,
    status: 'active',
  },
  {
    id: 'router-009',
    name: 'edge-router',
    portsCount: 7,
    externalGateway: true,
    externalFixedIp: '10.7.60.96',
    externalNetwork: 'edge-net',
    externalNetworkId: 'net-006',
    adminState: true,
    status: 'active',
  },
  {
    id: 'router-010',
    name: 'vpn-router',
    portsCount: 3,
    externalGateway: true,
    externalFixedIp: '10.7.60.97',
    externalNetwork: 'vpn-net',
    externalNetworkId: 'net-007',
    adminState: true,
    status: 'active',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const routerStatusMap: Record<RouterStatus, 'active' | 'error' | 'building'> = {
  active: 'active',
  error: 'error',
  building: 'building',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  {
    key: 'externalGateway',
    label: 'External Gateway',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  { key: 'externalFixedIp', label: 'External Fixed IP', type: 'text' },
  { key: 'externalNetwork', label: 'External Network', type: 'text' },
  {
    key: 'adminState',
    label: 'Admin State',
    type: 'select',
    options: [
      { value: 'true', label: 'Up' },
      { value: 'false', label: 'Down' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'building', label: 'Building' },
    ],
  },
];

export function RoutersPage() {
  const [selectedRouters, setSelectedRouters] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [routers] = useState(mockRouters);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routerToDelete, setRouterToDelete] = useState<Router | null>(null);

  // Create router drawer state
  const [isCreateRouterDrawerOpen, setIsCreateRouterDrawerOpen] = useState(false);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'externalGateway', label: 'External gateway', visible: true },
    { id: 'externalFixedIp', label: 'External fixed IP', visible: true },
    { id: 'externalNetwork', label: 'External network', visible: true },
    { id: 'adminState', label: 'Admin state', visible: true },
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

  // Filter routers based on search
  const filteredRouters = useMemo(() => {
    if (appliedFilters.length === 0) return routers;

    return routers.filter((r) => {
      return appliedFilters.every((filter) => {
        const value = String(r[filter.field as keyof Router] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [routers, appliedFilters]);

  const totalPages = Math.ceil(filteredRouters.length / rowsPerPage);

  // Paginated data
  const paginatedRouters = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRouters.slice(start, start + rowsPerPage);
  }, [filteredRouters, currentPage, rowsPerPage]);

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Router>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={routerStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/compute/routers/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'externalGateway',
      label: 'External gateway',
      flex: 1,
      minWidth: columnMinWidths.externalGateway,
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'externalFixedIp',
      label: 'External fixed IP',
      flex: 1,
      minWidth: columnMinWidths.externalFixedIp,
      sortable: true,
    },
    {
      key: 'externalNetwork',
      label: 'External network',
      flex: 1,
      minWidth: columnMinWidths.externalNetwork,
      sortable: true,
      render: (_, row) =>
        row.externalNetworkId ? (
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/compute/networks/${row.externalNetworkId}`}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.externalNetwork}
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            </Link>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID : {row.externalNetworkId}
            </span>
          </div>
        ) : (
          '-'
        ),
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
      minWidth: columnMinWidths.adminState,
      render: (value: boolean) => (value ? 'Up' : 'Down'),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu
            items={[
              { label: 'Connect subnet', onClick: () => {} },
              { label: 'Disconnect subnet', onClick: () => {} },
              { label: 'External gateway Setting', onClick: () => {} },
              { label: 'Enable SNAT', onClick: () => {} },
              { label: 'Disable SNAT', onClick: () => {} },
              { label: 'Edit', onClick: () => {} },
              { label: 'Delete', onClick: () => {}, variant: 'danger' },
            ]}
            trigger="click"
          >
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
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

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<Router> => col !== undefined);
  }, [columns, columnConfig]);

  const handleDelete = () => {
    // Handle delete
    setDeleteModalOpen(false);
    setRouterToDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

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
              <Breadcrumb items={[{ label: 'Proj-1', href: '/project' }, { label: 'Routers' }]} />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={12} stroke={1} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Main Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex justify-between items-center h-8 w-full">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">Routers</h1>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsCreateRouterDrawerOpen(true)}
                >
                  Create Router
                </Button>
              </div>

              {/* Toolbar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={filterFields}
                      appliedFilters={appliedFilters}
                      onFiltersChange={setAppliedFilters}
                      placeholder="Search router by attributes"
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
                      disabled={selectedRouters.length === 0}
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
                totalItems={filteredRouters.length}
                selectedCount={selectedRouters.length}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
              />

              {/* Table */}
              <Table
                columns={visibleColumns}
                data={paginatedRouters}
                rowKey="id"
                selectable
                selectedKeys={selectedRouters}
                onSelectionChange={setSelectedRouters}
              />
            </VStack>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRouterToDelete(null);
        }}
        title="Delete Router"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
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

      {/* Create Router Drawer */}
      <CreateRouterDrawer
        isOpen={isCreateRouterDrawerOpen}
        onClose={() => setIsCreateRouterDrawerOpen(false)}
      />
    </div>
  );
}
