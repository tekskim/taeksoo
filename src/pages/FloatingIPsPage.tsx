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
  Tooltip,
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
  IconExternalLink,
  IconCube,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type FloatingIPStatus = 'active' | 'error' | 'down';

interface FloatingIP {
  id: string;
  floatingIp: string;
  associatedTo: string | null;
  associatedToId: string | null;
  fixedIp: string;
  network: string;
  networkId: string;
  createdAt: string;
  status: FloatingIPStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFloatingIPs: FloatingIP[] = [
  { id: 'fip-001', floatingIp: '172.24.4.228', associatedTo: 'web-01', associatedToId: 'inst-001', fixedIp: '10.7.65.39', network: 'net-01', networkId: 'net-001', createdAt: '2025-10-01', status: 'active' },
  { id: 'fip-002', floatingIp: '172.24.4.229', associatedTo: 'app-server', associatedToId: 'inst-002', fixedIp: '10.7.65.40', network: 'net-02', networkId: 'net-002', createdAt: '2025-10-02', status: 'active' },
  { id: 'fip-003', floatingIp: '172.24.4.230', associatedTo: null, associatedToId: null, fixedIp: '-', network: 'net-01', networkId: 'net-001', createdAt: '2025-10-03', status: 'down' },
  { id: 'fip-004', floatingIp: '172.24.4.231', associatedTo: 'db-server', associatedToId: 'inst-003', fixedIp: '10.7.65.41', network: 'net-03', networkId: 'net-003', createdAt: '2025-09-28', status: 'active' },
  { id: 'fip-005', floatingIp: '172.24.4.232', associatedTo: 'load-balancer', associatedToId: 'lb-001', fixedIp: '10.7.65.42', network: 'net-01', networkId: 'net-001', createdAt: '2025-09-25', status: 'active' },
  { id: 'fip-006', floatingIp: '172.24.4.233', associatedTo: null, associatedToId: null, fixedIp: '-', network: 'net-02', networkId: 'net-002', createdAt: '2025-09-20', status: 'error' },
  { id: 'fip-007', floatingIp: '172.24.4.234', associatedTo: 'monitoring', associatedToId: 'inst-004', fixedIp: '10.7.65.43', network: 'net-01', networkId: 'net-001', createdAt: '2025-09-15', status: 'active' },
  { id: 'fip-008', floatingIp: '172.24.4.235', associatedTo: 'vpn-gateway', associatedToId: 'vpn-001', fixedIp: '10.7.65.44', network: 'net-04', networkId: 'net-004', createdAt: '2025-09-10', status: 'active' },
  { id: 'fip-009', floatingIp: '172.24.4.236', associatedTo: null, associatedToId: null, fixedIp: '-', network: 'net-03', networkId: 'net-003', createdAt: '2025-09-05', status: 'down' },
  { id: 'fip-010', floatingIp: '172.24.4.237', associatedTo: 'backup-server', associatedToId: 'inst-005', fixedIp: '10.7.65.45', network: 'net-01', networkId: 'net-001', createdAt: '2025-09-01', status: 'active' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const floatingIPStatusMap: Record<FloatingIPStatus, 'active' | 'error' | 'down'> = {
  'active': 'active',
  'error': 'error',
  'down': 'down',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function FloatingIPsPage() {
  const [selectedFloatingIPs, setSelectedFloatingIPs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [floatingIPs] = useState(mockFloatingIPs);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [floatingIPToDelete, setFloatingIPToDelete] = useState<FloatingIP | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'floatingIp', label: 'Floating IP', visible: true, locked: true },
    { id: 'associatedTo', label: 'Associated To', visible: true },
    { id: 'fixedIp', label: 'Fixed IP', visible: true },
    { id: 'network', label: 'Network', visible: true },
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

  // Context menu items
  const getContextMenuItems = (fip: FloatingIP): ContextMenuItem[] => [
    { id: 'associate', label: 'Associate', onClick: () => console.log('Associate:', fip.id) },
    { id: 'disassociate', label: 'Disassociate', onClick: () => console.log('Disassociate:', fip.id) },
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit:', fip.id) },
    { id: 'release', label: 'Release', status: 'danger', onClick: () => { setFloatingIPToDelete(fip); setDeleteModalOpen(true); } },
  ];

  // Filter floating IPs based on search
  const filteredFloatingIPs = useMemo(() => {
    if (!searchQuery) return floatingIPs;
    const query = searchQuery.toLowerCase();
    return floatingIPs.filter(fip =>
      fip.floatingIp.toLowerCase().includes(query) ||
      fip.network.toLowerCase().includes(query) ||
      (fip.associatedTo?.toLowerCase().includes(query) ?? false)
    );
  }, [floatingIPs, searchQuery]);

  const totalPages = Math.ceil(filteredFloatingIPs.length / rowsPerPage);

  // Paginated data
  const paginatedFloatingIPs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredFloatingIPs.slice(start, start + rowsPerPage);
  }, [filteredFloatingIPs, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<FloatingIP>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={floatingIPStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
          to={`/floating-ips/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.floatingIp}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'associatedTo',
      label: 'Associated To',
      width: '160px',
      align: 'right',
      render: (_, row) => (
        row.associatedTo ? (
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex flex-col gap-0.5 min-w-0 text-left">
              <Tooltip content={row.associatedTo} position="top">
                <Link
                  to={`/instances/${row.associatedToId}`}
                  className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="truncate">{row.associatedTo}</span>
                  <IconExternalLink size={12} className="flex-shrink-0 text-[var(--color-action-primary)]" />
                </Link>
              </Tooltip>
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate">
                ID : {row.associatedToId?.substring(0, 8)}
              </span>
            </div>
            <Tooltip content="Instance" position="top">
              <div className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-[3px] cursor-default">
                <IconCube size={12} className="text-[var(--color-text-subtle)]" />
              </div>
            </Tooltip>
          </div>
        ) : <span className="block text-left w-full">-</span>
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
    },
    {
      key: 'network',
      label: 'Network',
      width: '140px',
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Tooltip content={row.network} position="top">
            <Link
          to={`/networks/${row.networkId}`}
              className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{row.network}</span>
              <IconExternalLink size={12} className="flex-shrink-0 text-[var(--color-action-primary)]" />
            </Link>
          </Tooltip>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate">
            ID : {row.networkId.substring(0, 8)}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
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
      .filter((col): col is TableColumn<FloatingIP> => col !== undefined);
  }, [columns, columnConfig]);

  const handleContextMenuSelect = (itemId: string) => {
    if (itemId === 'release' && floatingIPToDelete) {
      // Handle release
      setDeleteModalOpen(false);
      setFloatingIPToDelete(null);
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
                { label: 'Floating IPs' },
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
                Floating IPs
              </h1>
              <Button variant="primary" size="md">
                Allocate Floating IP
              </Button>
            </div>

            {/* Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find floating IP with filters"
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
                    disabled={selectedFloatingIPs.length === 0}
                  >
                    Release
                  </Button>
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredFloatingIPs.length}
              selectedCount={selectedFloatingIPs.length}
              onPageChange={setCurrentPage}
              showSettings
              onSettingsClick={() => setIsPreferencesOpen(true)}
            />

            {/* Table */}
            <Table
              columns={visibleColumns}
              data={paginatedFloatingIPs}
              rowKey="id"
              selectable
              selectedKeys={selectedFloatingIPs}
              onSelectionChange={setSelectedFloatingIPs}
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
          setFloatingIPToDelete(null);
        }}
        title="Release Floating IP"
        description={`Are you sure you want to release "${floatingIPToDelete?.floatingIp}"? This action cannot be undone.`}
        confirmText="Release"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => handleContextMenuSelect('release')}
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
