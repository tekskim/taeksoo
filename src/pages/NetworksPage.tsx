import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  StatusIndicator,
  Badge,
  Tabs,
  TabList,
  Tab,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  Popover,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { SubnetDrawer } from '@/components/SubnetDrawer';
import { EditNetworkDrawer } from '@/components/EditNetworkDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type NetworkStatus = 'active' | 'error' | 'building';

interface Network {
  id: string;
  name: string;
  subnetCidr: string[];
  external: boolean;
  shared: boolean;
  adminState: 'Up' | 'Down';
  diskTag: string;
  status: NetworkStatus;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: Network[] = [
  {
    id: 'net-001',
    name: 'net-01',
    subnetCidr: ['10.62.0.0/24', '10.62.1.0/24', '10.62.2.0/24'],
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-01-15 09:30:00',
  },
  {
    id: 'net-002',
    name: 'internal-net',
    subnetCidr: ['192.168.1.0/24', '192.168.2.0/24'],
    external: false,
    shared: false,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-01-20 14:15:00',
  },
  {
    id: 'net-003',
    name: 'dev-network',
    subnetCidr: ['10.10.0.0/16'],
    external: false,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-02-01 11:00:00',
  },
  {
    id: 'net-004',
    name: 'prod-net',
    subnetCidr: ['172.16.0.0/12', '172.17.0.0/16'],
    external: true,
    shared: false,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'building',
    createdAt: '2026-02-10 08:45:00',
  },
  {
    id: 'net-005',
    name: 'test-network',
    subnetCidr: ['10.20.0.0/24'],
    external: false,
    shared: false,
    adminState: 'Down',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-02-15 16:30:00',
  },
  {
    id: 'net-006',
    name: 'dmz-net',
    subnetCidr: ['10.30.0.0/24'],
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-02-20 10:00:00',
  },
  {
    id: 'net-007',
    name: 'management-net',
    subnetCidr: ['10.0.0.0/8'],
    external: false,
    shared: false,
    adminState: 'Down',
    diskTag: 'Project',
    status: 'error',
    createdAt: '2026-03-01 13:20:00',
  },
  {
    id: 'net-008',
    name: 'backup-network',
    subnetCidr: ['192.168.100.0/24'],
    external: false,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-03-05 07:50:00',
  },
  {
    id: 'net-009',
    name: 'external-gateway',
    subnetCidr: ['203.0.113.0/24'],
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Shared',
    status: 'active',
    createdAt: '2026-03-10 15:10:00',
  },
  {
    id: 'net-010',
    name: 'provider-net',
    subnetCidr: ['198.51.100.0/24'],
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'External',
    status: 'active',
    createdAt: '2026-03-15 12:00:00',
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
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'subnetCidr', label: 'Subnet CIDR', type: 'text' },
  {
    id: 'external',
    label: 'External',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    id: 'shared',
    label: 'Shared',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    id: 'adminState',
    label: 'Admin state',
    type: 'select',
    options: [
      { value: 'Up', label: 'Up' },
      { value: 'Down', label: 'Down' },
    ],
  },
  {
    id: 'status',
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
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [networks, setNetworks] = useState(mockNetworks);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'current';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [networkToDelete, setNetworkToDelete] = useState<Network | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [createSubnetOpen, setCreateSubnetOpen] = useState(false);
  const [editNetworkOpen, setEditNetworkOpen] = useState(false);
  const [selectedNetworkForDrawer, setSelectedNetworkForDrawer] = useState<Network | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
    { id: 'createdAt', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];

  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

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
          const value = String(n[filter.fieldId as keyof Network] || '').toLowerCase();
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
        <StatusIndicator layout="icon-only" status={networkStatusMap[row.status]} />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <VStack gap={0} align="start">
          <Link
            to={`/compute/networks/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.id}>
              ID : {row.id.slice(0, 8)}
            </span>
            <InlineCopyId value={row.id} />
          </span>
        </VStack>
      ),
    },
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
      flex: 1,
      minWidth: columnMinWidths.subnetCidr,
      sortable: true,
      render: (_, row) => (
        <span className="flex items-center gap-1">
          {row.subnetCidr[0]}
          {row.subnetCidr.length > 1 && (
            <span className="ml-auto">
              <Popover
                trigger="hover"
                position="bottom"
                delay={100}
                hideDelay={100}
                content={
                  <div className="p-3 min-w-[160px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All Subnet CIDRs ({row.subnetCidr.length})
                    </div>
                    <div className="flex flex-wrap gap-1 items-start min-w-[136px]">
                      {row.subnetCidr.map((cidr, i) => (
                        <Badge key={i} theme="white" size="sm">
                          {cidr}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                  +{row.subnetCidr.length - 1}
                </span>
              </Popover>
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'external',
      label: 'External',
      flex: 1,
      minWidth: columnMinWidths.external,
      sortable: true,
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'diskTag',
      label: activeTab === 'current' ? 'Shared' : 'Is Current Tenant',
      flex: 1,
      minWidth: columnMinWidths.diskTag,
      sortable: true,
      render: (_, row) => (row.shared ? 'On' : 'Off'),
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
      minWidth: columnMinWidths.adminState,
      render: (_, row) => (
        <Badge variant={row.adminState === 'Up' ? 'success' : 'default'} size="sm">
          {row.adminState}
        </Badge>
      ),
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
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
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

  const handleBulkDelete = () => {
    setNetworks((prev) => prev.filter((n) => !selectedNetworks.includes(n.id)));
    setIsBulkDeleteOpen(false);
    setSelectedNetworks([]);
  };

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Networks' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader
          title="Networks"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/compute/networks/create')}
            >
              Create network
            </Button>
          }
        />

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
                onClick={() => setIsBulkDeleteOpen(true)}
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
          loading={loading}
          emptyMessage="No networks found"
        />
      </VStack>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setNetworkToDelete(null);
        }}
        title="Delete network"
        description="Removing the selected networks is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => handleContextMenuSelect('delete')}
      />

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete selected networks"
        description="Removing the selected networks is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedNetworks.length} network(s)`}
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
      <SubnetDrawer
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
    </PageShell>
  );
}
