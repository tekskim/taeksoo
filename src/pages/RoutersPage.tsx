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
  ConfirmModal,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
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
  status: RouterStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockRouters: Router[] = [
  { id: '29tgj234', name: 'router-01', portsCount: 5, externalGateway: true, externalFixedIp: '10.7.60.91', externalNetwork: 'net-01', externalNetworkId: '29tgj234', status: 'active' },
  { id: 'router-002', name: 'main-router', portsCount: 3, externalGateway: true, externalFixedIp: '10.7.60.92', externalNetwork: 'external-net', externalNetworkId: 'net-002', status: 'active' },
  { id: 'router-003', name: 'dev-router', portsCount: 2, externalGateway: false, externalFixedIp: '-', externalNetwork: '-', externalNetworkId: '', status: 'active' },
  { id: 'router-004', name: 'prod-router', portsCount: 8, externalGateway: true, externalFixedIp: '10.7.60.93', externalNetwork: 'prod-net', externalNetworkId: 'net-003', status: 'building' },
  { id: 'router-005', name: 'test-router', portsCount: 1, externalGateway: false, externalFixedIp: '-', externalNetwork: '-', externalNetworkId: '', status: 'active' },
  { id: 'router-006', name: 'backup-router', portsCount: 4, externalGateway: true, externalFixedIp: '10.7.60.94', externalNetwork: 'backup-net', externalNetworkId: 'net-004', status: 'active' },
  { id: 'router-007', name: 'dmz-router', portsCount: 6, externalGateway: true, externalFixedIp: '10.7.60.95', externalNetwork: 'dmz-net', externalNetworkId: 'net-005', status: 'error' },
  { id: 'router-008', name: 'internal-router', portsCount: 2, externalGateway: false, externalFixedIp: '-', externalNetwork: '-', externalNetworkId: '', status: 'active' },
  { id: 'router-009', name: 'edge-router', portsCount: 7, externalGateway: true, externalFixedIp: '10.7.60.96', externalNetwork: 'edge-net', externalNetworkId: 'net-006', status: 'active' },
  { id: 'router-010', name: 'vpn-router', portsCount: 3, externalGateway: true, externalFixedIp: '10.7.60.97', externalNetwork: 'vpn-net', externalNetworkId: 'net-007', status: 'active' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const routerStatusMap: Record<RouterStatus, 'active' | 'error' | 'building'> = {
  'active': 'active',
  'error': 'error',
  'building': 'building',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function RoutersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [routers] = useState(mockRouters);
  const [selectedRouters, setSelectedRouters] = useState<string[]>([]);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routerToDelete, setRouterToDelete] = useState<Router | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'portsCount', label: 'Ports Count', visible: true },
    { id: 'externalGateway', label: 'External Gateway', visible: true },
    { id: 'externalFixedIp', label: 'External Fixed IP', visible: true },
    { id: 'externalNetwork', label: 'External Network', visible: true },
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

  // Filter routers based on search
  const filteredRouters = useMemo(() => {
    if (!searchQuery) return routers;
    const query = searchQuery.toLowerCase();
    return routers.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.externalNetwork.toLowerCase().includes(query)
    );
  }, [routers, searchQuery]);

  const totalPages = Math.ceil(filteredRouters.length / rowsPerPage);

  // Paginated data
  const paginatedRouters = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRouters.slice(start, start + rowsPerPage);
  }, [filteredRouters, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<Router>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={routerStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/routers/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'portsCount',
      label: 'Ports Count',
      flex: 1,
      sortable: true,
    },
    {
      key: 'externalGateway',
      label: 'External Gateway',
      flex: 1,
      render: (value: boolean) => value ? 'Yes' : 'No',
    },
    {
      key: 'externalFixedIp',
      label: 'External Fixed IP',
      flex: 1,
    },
    {
      key: 'externalNetwork',
      label: 'External Network',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        row.externalNetworkId ? (
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/networks/${row.externalNetworkId}`}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.externalNetwork}
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            </Link>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              ID : {row.externalNetworkId}
            </span>
          </div>
        ) : '-'
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
      .filter((col): col is TableColumn<Router> => col !== undefined);
  }, [columns, columnConfig]);

  const handleDelete = () => {
    // Handle delete
    setDeleteModalOpen(false);
    setRouterToDelete(null);
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
                { label: 'Routers' },
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
                Routers
              </h1>
            </div>

            {/* Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find Router with filters"
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
              selectedRows={selectedRouters}
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
        description={`Are you sure you want to delete "${routerToDelete?.name}"? This action cannot be undone.`}
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
    </div>
  );
}
