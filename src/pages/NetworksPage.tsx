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
  Tabs,
  TabList,
  Tab,
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
  { id: 'net-001', name: 'net-01', subnetCidr: '10.62.0.0/24', external: true, shared: true, adminState: 'Up', diskTag: 'Project', status: 'active' },
  { id: 'net-002', name: 'internal-net', subnetCidr: '192.168.1.0/24', external: false, shared: false, adminState: 'Up', diskTag: 'Project', status: 'active' },
  { id: 'net-003', name: 'dev-network', subnetCidr: '10.10.0.0/16', external: false, shared: true, adminState: 'Up', diskTag: 'Project', status: 'active' },
  { id: 'net-004', name: 'prod-net', subnetCidr: '172.16.0.0/12', external: true, shared: false, adminState: 'Up', diskTag: 'Project', status: 'building' },
  { id: 'net-005', name: 'test-network', subnetCidr: '10.20.0.0/24', external: false, shared: false, adminState: 'Down', diskTag: 'Project', status: 'active' },
  { id: 'net-006', name: 'dmz-net', subnetCidr: '10.30.0.0/24', external: true, shared: true, adminState: 'Up', diskTag: 'Project', status: 'active' },
  { id: 'net-007', name: 'management-net', subnetCidr: '10.0.0.0/8', external: false, shared: false, adminState: 'Down', diskTag: 'Project', status: 'error' },
  { id: 'net-008', name: 'backup-network', subnetCidr: '192.168.100.0/24', external: false, shared: true, adminState: 'Up', diskTag: 'Project', status: 'active' },
  { id: 'net-009', name: 'external-gateway', subnetCidr: '203.0.113.0/24', external: true, shared: true, adminState: 'Up', diskTag: 'Shared', status: 'active' },
  { id: 'net-010', name: 'provider-net', subnetCidr: '198.51.100.0/24', external: true, shared: true, adminState: 'Up', diskTag: 'External', status: 'active' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const networkStatusMap: Record<NetworkStatus, 'active' | 'error' | 'building'> = {
  'active': 'active',
  'error': 'error',
  'building': 'building',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function NetworksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [networks] = useState(mockNetworks);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [networkToDelete, setNetworkToDelete] = useState<Network | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'subnetCidr', label: 'Subnet CIDR', visible: true },
    { id: 'external', label: 'External', visible: true },
    { id: 'diskTag', label: 'Disk Tag', visible: true },
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

  // Context menu items
  const getContextMenuItems = (network: Network): ContextMenuItem[] => [
    { id: 'create-subnet', label: 'Create Subnet', onClick: () => console.log('Create subnet:', network.id) },
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit:', network.id) },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => { setNetworkToDelete(network); setDeleteModalOpen(true); } },
  ];

  // Filter networks based on search and tab
  const filteredNetworks = useMemo(() => {
    let filtered = networks;
    
    // Filter by tab
    if (activeTab === 'current') {
      filtered = filtered.filter(n => n.diskTag === 'Project');
    } else if (activeTab === 'shared') {
      filtered = filtered.filter(n => n.diskTag === 'Shared');
    } else if (activeTab === 'external') {
      filtered = filtered.filter(n => n.diskTag === 'External');
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.name.toLowerCase().includes(query) ||
        n.subnetCidr.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [networks, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredNetworks.length / rowsPerPage);

  // Paginated data
  const paginatedNetworks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredNetworks.slice(start, start + rowsPerPage);
  }, [filteredNetworks, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<Network>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '80px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={networkStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/networks/${row.id}`}
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
      sortable: true,
    },
    {
      key: 'external',
      label: 'External',
      flex: 1,
      render: (value: boolean) => value ? 'Yes' : 'No',
    },
    {
      key: 'diskTag',
      label: 'Disk Tag',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsCircleHorizontal size={16} stroke={1} className="text-[var(--color-text-subtle)]" />
            </button>
          </ContextMenu>
        </div>
      ),
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
      .filter((col): col is TableColumn<Network> => col !== undefined);
  }, [columns, columnConfig]);

  const handleContextMenuSelect = (itemId: string) => {
    if (itemId === 'delete' && networkToDelete) {
      // Handle delete
      setDeleteModalOpen(false);
      setNetworkToDelete(null);
    }
  };

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
                { label: 'Networks' },
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

        {/* Main Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex justify-between items-center h-8 w-full">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Networks
              </h1>
              <Button variant="primary" size="md">
                Create Network
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab} size="sm">
              <TabList>
                <Tab value="current">Current Project</Tab>
                <Tab value="shared">Shared</Tab>
                <Tab value="external">External</Tab>
              </TabList>
            </Tabs>

            {/* Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find network with filters"
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
              selectedRows={selectedNetworks}
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
        description={`Are you sure you want to delete "${networkToDelete?.name}"? This action cannot be undone.`}
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
    </div>
  );
}
