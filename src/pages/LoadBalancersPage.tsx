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
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
  { id: 'lb-001', name: 'web-lb-01', vipAddress: '192.168.10.13', ownedNetwork: 'net-02', ownedNetworkId: 'net-002', floatingIp: '192.168.10.13', floatingIpId: 'fip-001', listeners: 'listener-http-80', listenerId: '29tgj234', listenerCount: 2, createdAt: '2025-10-03', status: 'active' },
  { id: 'lb-002', name: 'api-lb', vipAddress: '192.168.10.14', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', floatingIp: '192.168.10.14', floatingIpId: 'fip-002', listeners: 'listener-https-443', listenerId: '38fk29dk', listenerCount: 0, createdAt: '2025-10-02', status: 'active' },
  { id: 'lb-003', name: 'app-lb', vipAddress: '192.168.10.15', ownedNetwork: 'net-03', ownedNetworkId: 'net-003', floatingIp: '192.168.10.15', floatingIpId: 'fip-003', listeners: 'listener-tcp-8080', listenerId: '9dk38fj2', listenerCount: 1, createdAt: '2025-10-01', status: 'building' },
  { id: 'lb-004', name: 'db-lb', vipAddress: '192.168.10.16', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', floatingIp: '-', floatingIpId: '', listeners: 'listener-mysql-3306', listenerId: 'k29dk38f', listenerCount: 0, createdAt: '2025-09-28', status: 'active' },
  { id: 'lb-005', name: 'cache-lb', vipAddress: '192.168.10.17', ownedNetwork: 'net-02', ownedNetworkId: 'net-002', floatingIp: '-', floatingIpId: '', listeners: 'listener-redis-6379', listenerId: 'fj29dk38', listenerCount: 0, createdAt: '2025-09-25', status: 'active' },
  { id: 'lb-006', name: 'internal-lb', vipAddress: '192.168.10.18', ownedNetwork: 'net-04', ownedNetworkId: 'net-004', floatingIp: '-', floatingIpId: '', listeners: 'listener-grpc-9090', listenerId: '8fj29dk3', listenerCount: 3, createdAt: '2025-09-20', status: 'error' },
  { id: 'lb-007', name: 'streaming-lb', vipAddress: '192.168.10.19', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', floatingIp: '192.168.10.19', floatingIpId: 'fip-007', listeners: 'listener-rtmp-1935', listenerId: 'dk38fj29', listenerCount: 0, createdAt: '2025-09-15', status: 'active' },
  { id: 'lb-008', name: 'mail-lb', vipAddress: '192.168.10.20', ownedNetwork: 'net-02', ownedNetworkId: 'net-002', floatingIp: '192.168.10.20', floatingIpId: 'fip-008', listeners: 'listener-smtp-25', listenerId: '29dk38fj', listenerCount: 0, createdAt: '2025-09-10', status: 'pending' },
  { id: 'lb-009', name: 'vpn-lb', vipAddress: '192.168.10.21', ownedNetwork: 'net-03', ownedNetworkId: 'net-003', floatingIp: '192.168.10.21', floatingIpId: 'fip-009', listeners: 'listener-openvpn-1194', listenerId: '3fj29dk8', listenerCount: 0, createdAt: '2025-09-05', status: 'active' },
  { id: 'lb-010', name: 'monitoring-lb', vipAddress: '192.168.10.22', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', floatingIp: '-', floatingIpId: '', listeners: 'listener-http-3000', listenerId: 'j29dk38f', listenerCount: 4, createdAt: '2025-09-01', status: 'active' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const lbStatusMap: Record<LoadBalancerStatus, 'active' | 'error' | 'building' | 'pending'> = {
  'active': 'active',
  'error': 'error',
  'building': 'building',
  'pending': 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function LoadBalancersPage() {
  const [selectedLBs, setSelectedLBs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadBalancers] = useState(mockLoadBalancers);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lbToDelete, setLbToDelete] = useState<LoadBalancer | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'vipAddress', label: 'VIP Address', visible: true },
    { id: 'ownedNetwork', label: 'Owned Network', visible: true },
    { id: 'floatingIp', label: 'Floating IP', visible: true },
    { id: 'listeners', label: 'Listeners', visible: true },
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

  // Context menu items
  const getContextMenuItems = (lb: LoadBalancer): ContextMenuItem[] => [
    { id: 'associate-floating-ip', label: 'Associate Floating IP', onClick: () => console.log('Associate floating IP:', lb.id) },
    { id: 'disassociate-floating-ip', label: 'Disassociate Floating IP', onClick: () => console.log('Disassociate floating IP:', lb.id) },
    { id: 'create-listener', label: 'Create listener', onClick: () => console.log('Create listener:', lb.id) },
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit:', lb.id) },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => { setLbToDelete(lb); setDeleteModalOpen(true); } },
  ];

  // Filter load balancers based on search
  const filteredLBs = useMemo(() => {
    if (!searchQuery) return loadBalancers;
    const query = searchQuery.toLowerCase();
    return loadBalancers.filter(lb =>
      lb.name.toLowerCase().includes(query) ||
      lb.vipAddress.toLowerCase().includes(query) ||
      lb.ownedNetwork.toLowerCase().includes(query)
    );
  }, [loadBalancers, searchQuery]);

  const totalPages = Math.ceil(filteredLBs.length / rowsPerPage);

  // Paginated data
  const paginatedLBs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLBs.slice(start, start + rowsPerPage);
  }, [filteredLBs, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<LoadBalancer>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={lbStatusMap[row.status]} layout="icon-only" />
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
          to={`/compute/load-balancers/${row.id}`}
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
      key: 'vipAddress',
      label: 'VIP Address',
      flex: 1,
    },
    {
      key: 'ownedNetwork',
      label: 'Owned Network',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
          to={`/compute/networks/${row.ownedNetworkId}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.ownedNetwork}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.ownedNetworkId.substring(0, 8)}
          </span>
        </div>
      ),
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      render: (_, row) => (
        row.floatingIpId ? (
          <div className="flex flex-col gap-0.5">
            <Link
          to={`/compute/floating-ips/${row.floatingIpId}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.floatingIp}
            </Link>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              ID : {row.floatingIpId}
            </span>
          </div>
        ) : '-'
      ),
    },
    {
      key: 'listeners',
      label: 'Listeners',
      flex: 1,
      render: (_, row) => (
        <div className="flex items-center gap-[5px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
              {row.listeners} {row.listenerCount > 0 && `(+${row.listenerCount})`}
            </span>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              ID : {row.listenerId}
            </span>
          </div>
        </div>
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
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
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
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Load balancers' },
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
        {/* Main Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex justify-between items-center h-8 w-full">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Load balancers
              </h1>
              <Button variant="primary" size="md">
                Create Load Balancer
              </Button>
            </div>

            {/* Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find load balancer with filters"
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
        </div>
        </div>
      </main>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setLbToDelete(null);
        }}
        title="Delete Load Balancer"
        description={`Are you sure you want to delete "${lbToDelete?.name}"? This action cannot be undone.`}
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
