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
import {
  IconDotsVertical,
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
} from '@tabler/icons-react';

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
  { id: 'router-001', name: 'router-01', portsCount: 5, externalGateway: true, externalFixedIp: '10.7.60.91', externalNetwork: 'net-01', externalNetworkId: 'net-001', status: 'active' },
  { id: 'router-002', name: 'main-router', portsCount: 12, externalGateway: true, externalFixedIp: '10.7.60.92', externalNetwork: 'external-net', externalNetworkId: 'net-002', status: 'active' },
  { id: 'router-003', name: 'dev-router', portsCount: 3, externalGateway: false, externalFixedIp: '-', externalNetwork: '-', externalNetworkId: '', status: 'active' },
  { id: 'router-004', name: 'prod-router', portsCount: 8, externalGateway: true, externalFixedIp: '10.7.60.93', externalNetwork: 'prod-net', externalNetworkId: 'net-003', status: 'building' },
  { id: 'router-005', name: 'test-router', portsCount: 2, externalGateway: false, externalFixedIp: '-', externalNetwork: '-', externalNetworkId: '', status: 'active' },
  { id: 'router-006', name: 'backup-router', portsCount: 4, externalGateway: true, externalFixedIp: '10.7.60.94', externalNetwork: 'backup-net', externalNetworkId: 'net-004', status: 'active' },
  { id: 'router-007', name: 'dmz-router', portsCount: 6, externalGateway: true, externalFixedIp: '10.7.60.95', externalNetwork: 'dmz-net', externalNetworkId: 'net-005', status: 'error' },
  { id: 'router-008', name: 'internal-router', portsCount: 15, externalGateway: false, externalFixedIp: '-', externalNetwork: '-', externalNetworkId: '', status: 'active' },
  { id: 'router-009', name: 'edge-router', portsCount: 7, externalGateway: true, externalFixedIp: '10.7.60.96', externalNetwork: 'edge-net', externalNetworkId: 'net-006', status: 'active' },
  { id: 'router-010', name: 'vpn-router', portsCount: 10, externalGateway: true, externalFixedIp: '10.7.60.97', externalNetwork: 'vpn-net', externalNetworkId: 'net-007', status: 'active' },
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
  const [selectedRouters, setSelectedRouters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [routers] = useState(mockRouters);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routerToDelete, setRouterToDelete] = useState<Router | null>(null);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Context menu items
  const getContextMenuItems = (router: Router): ContextMenuItem[] => [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Router' },
    { id: 'delete', label: 'Delete', status: 'danger' },
  ];

  // Filter routers based on search
  const filteredRouters = useMemo(() => {
    if (!searchQuery) return routers;
    const query = searchQuery.toLowerCase();
    return routers.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.externalNetwork.toLowerCase().includes(query)
    );
  }, [routers, searchQuery]);

  const totalPages = Math.ceil(filteredRouters.length / 10);

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
      render: (value: string) => (
        <span className="font-medium text-[var(--color-action-primary)]">{value}</span>
      ),
    },
    {
      key: 'portsCount',
      label: 'Ports Count',
      flex: 1,
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
      render: (_, row) => (
        row.externalNetworkId ? (
          <div className="flex flex-col gap-0.5">
            <a
              href={`/networks/${row.externalNetworkId}`}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.externalNetwork}
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            </a>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              ID : {row.externalNetworkId.substring(0, 8)}
            </span>
          </div>
        ) : '-'
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu
            items={getContextMenuItems(row)}
            onSelect={(itemId) => {
              if (itemId === 'delete') {
                setRouterToDelete(row);
                setDeleteModalOpen(true);
              }
            }}
          >
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-default)]" />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  const handleContextMenuSelect = (itemId: string) => {
    if (itemId === 'delete' && routerToDelete) {
      // Handle delete
      setDeleteModalOpen(false);
      setRouterToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main
        className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 ${
          sidebarOpen ? 'ml-[200px]' : 'ml-0'
        }`}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          showAddButton={false}
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
                  <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
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
              selectedCount={selectedRouters.length}
            />

            {/* Table */}
            <Table
              columns={columns}
              data={filteredRouters}
              rowKey="id"
              selectable
              selectedKeys={selectedRouters}
              onSelectionChange={setSelectedRouters}
            />
          </VStack>
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
        message={`Are you sure you want to delete "${routerToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={() => handleContextMenuSelect('delete')}
      />
    </div>
  );
}
