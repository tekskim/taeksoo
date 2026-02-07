import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
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
  tenantId: string;
  tenantName: string;
  subnetCidr: string;
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
    tenantId: 'tenant-001',
    tenantName: 'tenant',
    subnetCidr: '10.62.0.0/24',
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'net-002',
    name: 'internal-net',
    tenantId: 'tenant-002',
    tenantName: 'dev-team',
    subnetCidr: '192.168.1.0/24',
    external: false,
    shared: false,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: 'Dec 24, 2025',
  },
  {
    id: 'net-003',
    name: 'dev-network',
    tenantId: 'tenant-003',
    tenantName: 'qa-team',
    subnetCidr: '10.10.0.0/16',
    external: false,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: 'Dec 23, 2025',
  },
  {
    id: 'net-004',
    name: 'prod-net',
    tenantId: 'tenant-004',
    tenantName: 'prod-team',
    subnetCidr: '172.16.0.0/12',
    external: true,
    shared: false,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'building',
    createdAt: 'Dec 22, 2025',
  },
  {
    id: 'net-005',
    name: 'test-network',
    tenantId: 'tenant-005',
    tenantName: 'test-team',
    subnetCidr: '10.20.0.0/24',
    external: false,
    shared: false,
    adminState: 'Down',
    diskTag: 'Project',
    status: 'active',
    createdAt: 'Dec 21, 2025',
  },
  {
    id: 'net-006',
    name: 'dmz-net',
    tenantId: 'tenant-006',
    tenantName: 'security',
    subnetCidr: '10.30.0.0/24',
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: 'Dec 20, 2025',
  },
  {
    id: 'net-007',
    name: 'management-net',
    tenantId: 'tenant-007',
    tenantName: 'ops-team',
    subnetCidr: '10.0.0.0/8',
    external: false,
    shared: false,
    adminState: 'Down',
    diskTag: 'Project',
    status: 'error',
    createdAt: 'Dec 19, 2025',
  },
  {
    id: 'net-008',
    name: 'backup-network',
    tenantId: 'tenant-008',
    tenantName: 'backup-team',
    subnetCidr: '192.168.100.0/24',
    external: false,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: 'Dec 18, 2025',
  },
  {
    id: 'net-009',
    name: 'external-gateway',
    tenantId: 'tenant-009',
    tenantName: 'infra-team',
    subnetCidr: '203.0.113.0/24',
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Shared',
    status: 'active',
    createdAt: 'Dec 17, 2025',
  },
  {
    id: 'net-010',
    name: 'provider-net',
    tenantId: 'tenant-010',
    tenantName: 'provider',
    subnetCidr: '198.51.100.0/24',
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'External',
    status: 'active',
    createdAt: 'Dec 16, 2025',
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
    label: 'Admin state',
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

export function ComputeAdminNetworksPage() {
  const navigate = useNavigate();
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [networks] = useState(mockNetworks);

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
    { id: 'tenant', label: 'Tenant', visible: true },
    { id: 'subnetCidr', label: 'Subnet CIDR', visible: true },
    { id: 'external', label: 'External', visible: true },
    { id: 'shared', label: 'Shared', visible: true },
    { id: 'adminState', label: 'Admin state', visible: true },
    { id: 'createdAt', label: 'Created at', visible: true },
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

  // Filter networks based on search
  const filteredNetworks = useMemo(() => {
    let filtered = networks;

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
  }, [networks, appliedFilters]);

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
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
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
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/networks/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 text-label-md leading-4"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm leading-4 text-[var(--color-text-muted)]">
            ID: {row.id}
          </span>
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
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/tenants/${row.tenantId}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 text-label-md leading-4"
            onClick={(e) => e.stopPropagation()}
          >
            {row.tenantName}
          </Link>
          <span className="text-body-sm leading-4 text-[var(--color-text-muted)]">
            ID: {row.tenantId}
          </span>
        </div>
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
      sortable: true,
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'shared',
      label: 'Shared',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
      render: (_, row) => (row.shared ? 'Yes' : 'No'),
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
      minWidth: columnMinWidths.adminState,
      sortable: false,
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
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
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
              items={[{ label: 'Compute Admin', href: '/compute-admin' }, { label: 'Networks' }]}
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
    >
      <VStack gap={3}>
        <PageHeader
          title="Networks"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/compute-admin/networks/create')}
            >
              Create network
            </Button>
          }
        />

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

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setNetworkToDelete(null);
        }}
        title="Delete network"
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
    </PageShell>
  );
}
