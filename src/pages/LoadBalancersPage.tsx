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
  PageShell,
  PageHeader,
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
import { AssociateFloatingIPToLBDrawer } from '@/components/AssociateFloatingIPToLBDrawer';
import { EditLoadBalancerDrawer } from '@/components/EditLoadBalancerDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type LoadBalancerStatus = 'active' | 'error' | 'building' | 'pending';

interface LoadBalancer {
  id: string;
  name: string;
  vipAddress: string;
  ownedNetwork: string;
  ownedNetworkId: string;
  floatingIp: string;
  floatingIpId: string;
  listeners: string;
  listenerId: string;
  listenerCount: number;
  createdAt: string;
  status: LoadBalancerStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockLoadBalancers: LoadBalancer[] = [
  {
    id: 'lb-001',
    name: 'web-lb-01',
    vipAddress: '192.168.10.13',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    floatingIp: '192.168.10.13',
    floatingIpId: 'fip-001',
    listeners: 'listener-http-80',
    listenerId: '29tgj234',
    listenerCount: 2,
    createdAt: 'Oct 3, 2025',
    status: 'active',
  },
  {
    id: 'lb-002',
    name: 'api-lb',
    vipAddress: '192.168.10.14',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    floatingIp: '192.168.10.14',
    floatingIpId: 'fip-002',
    listeners: 'listener-https-443',
    listenerId: '38fk29dk',
    listenerCount: 0,
    createdAt: 'Oct 2, 2025',
    status: 'active',
  },
  {
    id: 'lb-003',
    name: 'app-lb',
    vipAddress: '192.168.10.15',
    ownedNetwork: 'net-03',
    ownedNetworkId: 'net-003',
    floatingIp: '192.168.10.15',
    floatingIpId: 'fip-003',
    listeners: 'listener-tcp-8080',
    listenerId: '9dk38fj2',
    listenerCount: 1,
    createdAt: 'Oct 1, 2025',
    status: 'building',
  },
  {
    id: 'lb-004',
    name: 'db-lb',
    vipAddress: '192.168.10.16',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    floatingIp: '-',
    floatingIpId: '',
    listeners: 'listener-mysql-3306',
    listenerId: 'k29dk38f',
    listenerCount: 0,
    createdAt: 'Sep 28, 2025',
    status: 'active',
  },
  {
    id: 'lb-005',
    name: 'cache-lb',
    vipAddress: '192.168.10.17',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    floatingIp: '-',
    floatingIpId: '',
    listeners: 'listener-redis-6379',
    listenerId: 'fj29dk38',
    listenerCount: 0,
    createdAt: 'Sep 25, 2025',
    status: 'active',
  },
  {
    id: 'lb-006',
    name: 'internal-lb',
    vipAddress: '192.168.10.18',
    ownedNetwork: 'net-04',
    ownedNetworkId: 'net-004',
    floatingIp: '-',
    floatingIpId: '',
    listeners: 'listener-grpc-9090',
    listenerId: '8fj29dk3',
    listenerCount: 3,
    createdAt: 'Sep 20, 2025',
    status: 'error',
  },
  {
    id: 'lb-007',
    name: 'streaming-lb',
    vipAddress: '192.168.10.19',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    floatingIp: '192.168.10.19',
    floatingIpId: 'fip-007',
    listeners: 'listener-rtmp-1935',
    listenerId: 'dk38fj29',
    listenerCount: 0,
    createdAt: 'Sep 15, 2025',
    status: 'active',
  },
  {
    id: 'lb-008',
    name: 'mail-lb',
    vipAddress: '192.168.10.20',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    floatingIp: '192.168.10.20',
    floatingIpId: 'fip-008',
    listeners: 'listener-smtp-25',
    listenerId: '29dk38fj',
    listenerCount: 0,
    createdAt: 'Sep 10, 2025',
    status: 'pending',
  },
  {
    id: 'lb-009',
    name: 'vpn-lb',
    vipAddress: '192.168.10.21',
    ownedNetwork: 'net-03',
    ownedNetworkId: 'net-003',
    floatingIp: '192.168.10.21',
    floatingIpId: 'fip-009',
    listeners: 'listener-openvpn-1194',
    listenerId: '3fj29dk8',
    listenerCount: 0,
    createdAt: 'Sep 5, 2025',
    status: 'active',
  },
  {
    id: 'lb-010',
    name: 'monitoring-lb',
    vipAddress: '192.168.10.22',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    floatingIp: '-',
    floatingIpId: '',
    listeners: 'listener-http-3000',
    listenerId: 'j29dk38f',
    listenerCount: 4,
    createdAt: 'Sep 1, 2025',
    status: 'active',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const lbStatusMap: Record<LoadBalancerStatus, 'active' | 'error' | 'building' | 'pending'> = {
  active: 'active',
  error: 'error',
  building: 'building',
  pending: 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'vipAddress', label: 'VIP Address', type: 'text' },
  { id: 'ownedNetwork', label: 'Network', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'building', label: 'Building' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

export function LoadBalancersPage() {
  const navigate = useNavigate();
  const [selectedLBs, setSelectedLBs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadBalancers] = useState(mockLoadBalancers);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lbToDelete, setLbToDelete] = useState<LoadBalancer | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [associateFIPOpen, setAssociateFIPOpen] = useState(false);
  const [editLBOpen, setEditLBOpen] = useState(false);
  const [selectedLBForDrawer, setSelectedLBForDrawer] = useState<LoadBalancer | null>(null);

  // Drawer handlers
  const handleAssociateFloatingIP = (lb: LoadBalancer) => {
    setSelectedLBForDrawer(lb);
    setAssociateFIPOpen(true);
  };

  const handleEditLB = (lb: LoadBalancer) => {
    setSelectedLBForDrawer(lb);
    setEditLBOpen(true);
  };

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'vipAddress', label: 'VIP Address', visible: true },
    { id: 'ownedNetwork', label: 'Owned network', visible: true },
    { id: 'floatingIp', label: 'Floating IP', visible: true },
    { id: 'listeners', label: 'Listeners', visible: true },
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

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Context menu items
  const getContextMenuItems = (lb: LoadBalancer): ContextMenuItem[] => [
    {
      id: 'associate-floating-ip',
      label: 'Associate floating IP',
      onClick: () => handleAssociateFloatingIP(lb),
      disabled: !!lb.floatingIp,
    },
    {
      id: 'disassociate-floating-ip',
      label: 'Disassociate floating IP',
      onClick: () => console.log('Disassociate floating IP:', lb.id),
      disabled: !lb.floatingIp,
    },
    {
      id: 'create-listener',
      label: 'Create listener',
      onClick: () => console.log('Create listener:', lb.id),
    },
    { id: 'edit', label: 'Edit', onClick: () => handleEditLB(lb) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => {
        setLbToDelete(lb);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Filter load balancers based on search
  const filteredLBs = useMemo(() => {
    if (appliedFilters.length === 0) return loadBalancers;

    return loadBalancers.filter((lb) => {
      return appliedFilters.every((filter) => {
        const value = lb[filter.fieldId as keyof LoadBalancer];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });
  }, [loadBalancers, appliedFilters]);

  const totalPages = Math.ceil(filteredLBs.length / rowsPerPage);

  // Paginated data
  const paginatedLBs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLBs.slice(start, start + rowsPerPage);
  }, [filteredLBs, currentPage, rowsPerPage]);

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<LoadBalancer>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator layout="icon-only" status={lbStatusMap[row.status]} />,
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
            to={`/compute/load-balancers/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'vipAddress',
      label: 'VIP Address',
      flex: 1,
      minWidth: columnMinWidths.vipAddress,
    },
    {
      key: 'ownedNetwork',
      label: 'Owned network',
      flex: 1,
      minWidth: columnMinWidths.ownedNetwork,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/networks/${row.ownedNetworkId}`}
            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.ownedNetwork}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            ID : {row.ownedNetworkId.substring(0, 8)}
          </span>
        </div>
      ),
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      minWidth: columnMinWidths.floatingIp,
      render: (_, row) =>
        row.floatingIpId ? (
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute/floating-ips/${row.floatingIpId}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.floatingIp}
            </Link>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID : {row.floatingIpId}
            </span>
          </div>
        ) : (
          '-'
        ),
    },
    {
      key: 'listeners',
      label: 'Listeners',
      flex: 1,
      minWidth: columnMinWidths.listeners,
      render: (_, row) => (
        <div className="flex items-center gap-[5px]">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-body-md text-[var(--color-text-default)]">
              {row.listeners} {row.listenerCount > 0 && `(+${row.listenerCount})`}
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID : {row.listenerId}
            </span>
          </div>
        </div>
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
      width: fixedColumns.actions,
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
      .filter((col): col is TableColumn<LoadBalancer> => col !== undefined);
  }, [columns, columnConfig]);

  const handleContextMenuSelect = (itemId: string) => {
    if (itemId === 'delete' && lbToDelete) {
      // Handle delete
      setDeleteModalOpen(false);
      setLbToDelete(null);
    }
  };

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />}
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
              items={[{ label: 'Proj-1', href: '/project' }, { label: 'Load balancers' }]}
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
        {/* Page Header */}
        <PageHeader
          title="Load balancers"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/compute/load-balancers/create')}
            >
              Create Load Balancer
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
                placeholder="Search load balancer by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
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
                disabled={selectedLBs.length === 0}
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
          totalItems={filteredLBs.length}
          selectedCount={selectedLBs.length}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => setIsPreferencesOpen(true)}
        />

        {/* Table */}
        <Table
          columns={visibleColumns}
          data={paginatedLBs}
          rowKey="id"
          selectable
          selectedKeys={selectedLBs}
          onSelectionChange={setSelectedLBs}
        />
      </VStack>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setLbToDelete(null);
        }}
        title="Delete load balancer"
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

      {/* Load Balancer Drawers */}
      <AssociateFloatingIPToLBDrawer
        isOpen={associateFIPOpen}
        onClose={() => setAssociateFIPOpen(false)}
        loadBalancer={{
          id: selectedLBForDrawer?.id || '',
          name: selectedLBForDrawer?.name || '',
          networkId: selectedLBForDrawer?.ownedNetworkId || '',
          networkName: selectedLBForDrawer?.ownedNetwork || '',
        }}
      />

      <EditLoadBalancerDrawer
        isOpen={editLBOpen}
        onClose={() => setEditLBOpen(false)}
        loadBalancer={{
          id: selectedLBForDrawer?.id || '',
          name: selectedLBForDrawer?.name || '',
        }}
      />
    </PageShell>
  );
}
