import { useState, useMemo } from 'react';
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
  Tabs,
  TabList,
  Tab,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { CreateSubnetDrawer } from '@/components/CreateSubnetDrawer';
import { EditNetworkDrawer } from '@/components/EditNetworkDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type NetworkStatus = 'active' | 'error' | 'building';

interface Network {
  id: string;
  name: string;
  subnetCidr: string;
  external: boolean;
  shared: boolean;
  adminState: 'Up' | 'Down';
  diskTag: string;
  status: NetworkStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: Network[] = [
  {
    id: 'net-001',
    name: 'net-01',
    subnetCidr: '10.62.0.0/24',
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
  },
  {
    id: 'net-002',
    name: 'internal-net',
    subnetCidr: '192.168.1.0/24',
    external: false,
    shared: false,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
  },
  {
    id: 'net-003',
    name: 'dev-network',
    subnetCidr: '10.10.0.0/16',
    external: false,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
  },
  {
    id: 'net-004',
    name: 'prod-net',
    subnetCidr: '172.16.0.0/12',
    external: true,
    shared: false,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'building',
  },
  {
    id: 'net-005',
    name: 'test-network',
    subnetCidr: '10.20.0.0/24',
    external: false,
    shared: false,
    adminState: 'Down',
    diskTag: 'Project',
    status: 'active',
  },
  {
    id: 'net-006',
    name: 'dmz-net',
    subnetCidr: '10.30.0.0/24',
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
  },
  {
    id: 'net-007',
    name: 'management-net',
    subnetCidr: '10.0.0.0/8',
    external: false,
    shared: false,
    adminState: 'Down',
    diskTag: 'Project',
    status: 'error',
  },
  {
    id: 'net-008',
    name: 'backup-network',
    subnetCidr: '192.168.100.0/24',
    external: false,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
  },
  {
    id: 'net-009',
    name: 'external-gateway',
    subnetCidr: '203.0.113.0/24',
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Shared',
    status: 'active',
  },
  {
    id: 'net-010',
    name: 'provider-net',
    subnetCidr: '198.51.100.0/24',
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'External',
    status: 'active',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const networkStatusMap: Record<NetworkStatus, 'active' | 'error' | 'building'> = {
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
  { key: 'subnetCidr', label: 'Subnet CIDR', type: 'text' },
  {
    key: 'external',
    label: 'External',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'shared',
    label: 'Shared',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'adminState',
    label: 'Admin State',
    type: 'select',
    options: [
      { value: 'Up', label: 'Up' },
      { value: 'Down', label: 'Down' },
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

export function NetworksPage() {
  const navigate = useNavigate();
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [networks] = useState(mockNetworks);
  const [activeTab, setActiveTab] = useState('current');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [networkToDelete, setNetworkToDelete] = useState<Network | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [createSubnetOpen, setCreateSubnetOpen] = useState(false);
  const [editNetworkOpen, setEditNetworkOpen] = useState(false);
  const [selectedNetworkForDrawer, setSelectedNetworkForDrawer] = useState<Network | null>(null);

  // Drawer handlers
  const handleCreateSubnet = (network: Network) => {
    setSelectedNetworkForDrawer(network);
    setCreateSubnetOpen(true);
  };

  const handleEditNetwork = (network: Network) => {
    setSelectedNetworkForDrawer(network);
    setEditNetworkOpen(true);
  };

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'subnetCidr', label: 'Subnet CIDR', visible: true },
    { id: 'external', label: 'External', visible: true },
    { id: 'diskTag', label: 'Shared / Is Current Tenant', visible: true },
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

  // Context menu items
  const getContextMenuItems = (network: Network): ContextMenuItem[] => [
    { id: 'create-subnet', label: 'Create subnet', onClick: () => handleCreateSubnet(network) },
    { id: 'edit', label: 'Edit', onClick: () => handleEditNetwork(network) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => {
        setNetworkToDelete(network);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Filter networks based on search and tab
  const filteredNetworks = useMemo(() => {
    let filtered = networks;

    // Filter by tab
    if (activeTab === 'current') {
      filtered = filtered.filter((n) => n.diskTag === 'Project');
    } else if (activeTab === 'shared') {
      filtered = filtered.filter((n) => n.diskTag === 'Shared');
    } else if (activeTab === 'external') {
      filtered = filtered.filter((n) => n.diskTag === 'External');
    }

    // Filter by applied filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((n) => {
        return appliedFilters.every((filter) => {
          const value = String(n[filter.field as keyof Network] || '').toLowerCase();
          return value.includes(filter.value.toLowerCase());
        });
      });
    }

    return filtered;
  }, [networks, appliedFilters, activeTab]);

  const totalPages = Math.ceil(filteredNetworks.length / rowsPerPage);

  // Paginated data
  const paginatedNetworks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredNetworks.slice(start, start + rowsPerPage);
  }, [filteredNetworks, currentPage, rowsPerPage]);

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Network>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={networkStatusMap[row.status]} layout="icon-only" />
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
          to={`/compute/networks/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
      flex: 1,
      minWidth: columnMinWidths.subnetCidr,
      sortable: true,
    },
    {
      key: 'external',
      label: 'External',
      flex: 1,
      minWidth: columnMinWidths.external,
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'diskTag',
      label: activeTab === 'current' ? 'Shared' : 'Is Current Tenant',
      flex: 1,
      minWidth: columnMinWidths.diskTag,
      render: (_, row) => (row.shared ? 'On' : 'Off'),
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
      minWidth: columnMinWidths.adminState,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click">
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

    return (
      visibleColumnIds
        .map((id) => columnMap.get(id))
        .filter((col): col is TableColumn<Network> => col !== undefined)
        // Hide 'external' column when on External tab
        .filter((col) => !(activeTab === 'external' && col.key === 'external'))
    );
  }, [columns, columnConfig, activeTab]);

  const handleContextMenuSelect = (itemId: string) => {
    if (itemId === 'delete' && networkToDelete) {
      // Handle delete
      setDeleteModalOpen(false);
      setNetworkToDelete(null);
    }
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
              <Breadcrumb items={[{ label: 'Proj-1', href: '/project' }, { label: 'Networks' }]} />
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
          {/* Main Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex justify-between items-center h-8 w-full">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Networks
                </h1>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/compute/networks/create')}
                >
                  Create network
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onChange={setActiveTab} size="sm">
                <TabList>
                  <Tab value="current">Current tenant</Tab>
                  <Tab value="shared">Shared</Tab>
                  <Tab value="external">External</Tab>
                </TabList>
              </Tabs>

              {/* Toolbar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={filterFields}
                      appliedFilters={appliedFilters}
                      onFiltersChange={setAppliedFilters}
                      placeholder="Search network by attributes"
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
                      disabled={selectedNetworks.length === 0}
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
                totalItems={filteredNetworks.length}
                selectedCount={selectedNetworks.length}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
              />

              {/* Table */}
              <Table
                columns={visibleColumns}
                data={paginatedNetworks}
                rowKey="id"
                selectable
                selectedKeys={selectedNetworks}
                onSelectionChange={setSelectedNetworks}
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
          setNetworkToDelete(null);
        }}
        title="Delete Network"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => handleContextMenuSelect('delete')}
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

      {/* Network Drawers */}
      <CreateSubnetDrawer
        isOpen={createSubnetOpen}
        onClose={() => setCreateSubnetOpen(false)}
        networkId={selectedNetworkForDrawer?.id}
        networkName={selectedNetworkForDrawer?.name}
      />

      <EditNetworkDrawer
        isOpen={editNetworkOpen}
        onClose={() => setEditNetworkOpen(false)}
        network={
          selectedNetworkForDrawer
            ? {
                id: selectedNetworkForDrawer.id,
                name: selectedNetworkForDrawer.name,
                adminStateUp: selectedNetworkForDrawer.adminState === 'Up',
              }
            : { id: '', name: '' }
        }
      />
    </div>
  );
}
