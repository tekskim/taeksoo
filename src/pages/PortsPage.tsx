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
  Tooltip,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPlus,
  IconDotsVertical,
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
  IconServer2,
  IconRouter,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PortStatus = 'active' | 'error' | 'building' | 'down';

interface Port {
  id: string;
  name: string;
  attachedTo: string | null;
  attachedToId: string | null;
  attachedType: 'instance' | 'router' | null;
  ownedNetwork: string;
  ownedNetworkId: string;
  securityGroups: string;
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
  status: PortStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPorts: Port[] = [
  { id: 'port-001', name: 'port-01', attachedTo: 'web-01', attachedToId: 'inst-001', attachedType: 'instance', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', securityGroups: 'default-sg (+4)', fixedIp: '10.7.60.91', floatingIp: '10.7.65.39', macAddress: 'fa:16:3e:34:85:32', status: 'active' },
  { id: 'port-002', name: 'port-02', attachedTo: 'app-server', attachedToId: 'inst-002', attachedType: 'instance', ownedNetwork: 'net-02', ownedNetworkId: 'net-002', securityGroups: 'app-sg (+2)', fixedIp: '10.7.60.92', floatingIp: '10.7.65.40', macAddress: 'fa:16:3e:34:85:33', status: 'active' },
  { id: 'port-003', name: 'port-03', attachedTo: null, attachedToId: null, attachedType: null, ownedNetwork: 'net-03', ownedNetworkId: 'net-003', securityGroups: 'default-sg', fixedIp: '10.7.60.93', floatingIp: '-', macAddress: 'fa:16:3e:34:85:34', status: 'down' },
  { id: 'port-004', name: 'db-port', attachedTo: 'db-server', attachedToId: 'inst-003', attachedType: 'instance', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', securityGroups: 'db-sg', fixedIp: '10.7.60.94', floatingIp: '-', macAddress: 'fa:16:3e:34:85:35', status: 'active' },
  { id: 'port-005', name: 'router-port-1', attachedTo: 'main-router', attachedToId: 'router-001', attachedType: 'router', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', securityGroups: '-', fixedIp: '10.7.60.1', floatingIp: '-', macAddress: 'fa:16:3e:34:85:36', status: 'active' },
  { id: 'port-006', name: 'lb-port', attachedTo: 'load-balancer-01', attachedToId: 'lb-001', attachedType: 'instance', ownedNetwork: 'net-02', ownedNetworkId: 'net-002', securityGroups: 'lb-sg (+1)', fixedIp: '10.7.60.95', floatingIp: '10.7.65.41', macAddress: 'fa:16:3e:34:85:37', status: 'active' },
  { id: 'port-007', name: 'cache-port', attachedTo: 'redis-01', attachedToId: 'inst-004', attachedType: 'instance', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', securityGroups: 'cache-sg', fixedIp: '10.7.60.96', floatingIp: '-', macAddress: 'fa:16:3e:34:85:38', status: 'active' },
  { id: 'port-008', name: 'monitor-port', attachedTo: 'prometheus', attachedToId: 'inst-005', attachedType: 'instance', ownedNetwork: 'net-03', ownedNetworkId: 'net-003', securityGroups: 'monitor-sg', fixedIp: '10.7.60.97', floatingIp: '10.7.65.42', macAddress: 'fa:16:3e:34:85:39', status: 'building' },
  { id: 'port-009', name: 'test-port', attachedTo: null, attachedToId: null, attachedType: null, ownedNetwork: 'net-04', ownedNetworkId: 'net-004', securityGroups: 'default-sg', fixedIp: '10.7.60.98', floatingIp: '-', macAddress: 'fa:16:3e:34:85:40', status: 'error' },
  { id: 'port-010', name: 'vpn-port', attachedTo: 'vpn-gateway', attachedToId: 'vpn-001', attachedType: 'instance', ownedNetwork: 'net-01', ownedNetworkId: 'net-001', securityGroups: 'vpn-sg', fixedIp: '10.7.60.99', floatingIp: '10.7.65.43', macAddress: 'fa:16:3e:34:85:41', status: 'active' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const portStatusMap: Record<PortStatus, 'active' | 'error' | 'building' | 'down'> = {
  'active': 'active',
  'error': 'error',
  'building': 'building',
  'down': 'down',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function PortsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ports] = useState(mockPorts);
  const [activeTab, setActiveTab] = useState('all');
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [portToDelete, setPortToDelete] = useState<Port | null>(null);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Context menu items
  const getContextMenuItems = (port: Port): ContextMenuItem[] => [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Port' },
    { id: 'delete', label: 'Delete', status: 'danger' },
  ];

  // Filter ports based on search and tab
  const filteredPorts = useMemo(() => {
    let filtered = ports;
    
    // Filter by tab
    if (activeTab === 'instance') {
      filtered = filtered.filter(p => p.attachedType === 'instance');
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.ownedNetwork.toLowerCase().includes(query) ||
        p.macAddress.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [ports, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredPorts.length / 10);

  // Table columns
  const columns: TableColumn<Port>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={portStatusMap[row.status]} layout="icon-only" />
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
      key: 'attachedTo',
      label: 'Attached To',
      width: '160px',
      render: (_, row) => (
        row.attachedTo ? (
          <div className="flex items-center gap-2">
            <Tooltip content={row.attachedType === 'router' ? 'Router' : 'Instance'} position="top">
              <div className="flex-shrink-0 bg-white border border-[var(--color-border-default)] rounded-[4px] p-1 cursor-default">
                {row.attachedType === 'router' ? (
                  <IconRouter size={12} className="text-[var(--color-text-subtle)]" />
                ) : (
                  <IconServer2 size={12} className="text-[var(--color-text-subtle)]" />
                )}
              </div>
            </Tooltip>
            <div className="flex flex-col gap-0.5 min-w-0">
              <Tooltip content={row.attachedTo} position="top">
                <a
                  href={row.attachedType === 'router' ? `/routers/${row.attachedToId}` : `/instances/${row.attachedToId}`}
                  className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="truncate">{row.attachedTo}</span>
                  <IconExternalLink size={12} className="flex-shrink-0 text-[var(--color-action-primary)]" />
                </a>
              </Tooltip>
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate">
                ID : {row.attachedToId?.substring(0, 8)}
              </span>
            </div>
          </div>
        ) : '-'
      ),
    },
    {
      key: 'ownedNetwork',
      label: 'Owned Network',
      width: '140px',
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Tooltip content={row.ownedNetwork} position="top">
            <a
              href={`/networks/${row.ownedNetworkId}`}
              className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{row.ownedNetwork}</span>
              <IconExternalLink size={12} className="flex-shrink-0 text-[var(--color-action-primary)]" />
            </a>
          </Tooltip>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate">
            ID : {row.ownedNetworkId.substring(0, 8)}
          </span>
        </div>
      ),
    },
    {
      key: 'securityGroups',
      label: 'SG',
      flex: 1,
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
      flex: 1,
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
                setPortToDelete(row);
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
    if (itemId === 'delete' && portToDelete) {
      // Handle delete
      setDeleteModalOpen(false);
      setPortToDelete(null);
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
                { label: 'Ports' },
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
                Ports
              </h1>
              <Button variant="primary" size="md" leftIcon={<IconPlus size={14} />}>
                Create Virtual Adapter
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab} size="sm">
              <TabList>
                <Tab value="all">All</Tab>
                <Tab value="instance">Instance Ports</Tab>
              </TabList>
            </Tabs>

            {/* Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find Port with filters"
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
                    disabled={selectedPorts.length === 0}
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
              totalItems={filteredPorts.length}
              onPageChange={setCurrentPage}
              selectedCount={selectedPorts.length}
            />

            {/* Table */}
            <Table
              columns={columns}
              data={filteredPorts}
              rowKey="id"
              selectable
              selectedKeys={selectedPorts}
              onSelectionChange={setSelectedPorts}
            />
          </VStack>
        </div>
      </main>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPortToDelete(null);
        }}
        title="Delete Port"
        message={`Are you sure you want to delete "${portToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={() => handleContextMenuSelect('delete')}
      />
    </div>
  );
}
