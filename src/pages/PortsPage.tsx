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
  Tooltip,
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
import { AttachPortToInstanceDrawer } from '@/components/AttachPortToInstanceDrawer';
import { AssociateFloatingIPToPortDrawer } from '@/components/AssociateFloatingIPToPortDrawer';
import { EditPortSecurityGroupsDrawer } from '@/components/EditPortSecurityGroupsDrawer';
import { EditPortDrawer } from '@/components/EditPortDrawer';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
  IconCube,
  IconRouter,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
  {
    id: 'port-001',
    name: 'port-01',
    attachedTo: 'web-01',
    attachedToId: 'inst-001',
    attachedType: 'instance',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroups: 'default-sg (+4)',
    fixedIp: '10.7.60.91',
    floatingIp: '10.7.65.39',
    macAddress: 'fa:16:3e:34:85:32',
    status: 'active',
  },
  {
    id: 'port-002',
    name: 'port-02',
    attachedTo: 'app-server',
    attachedToId: 'inst-002',
    attachedType: 'instance',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    securityGroups: 'app-sg (+2)',
    fixedIp: '10.7.60.92',
    floatingIp: '10.7.65.40',
    macAddress: 'fa:16:3e:34:85:33',
    status: 'active',
  },
  {
    id: 'port-003',
    name: 'port-03',
    attachedTo: null,
    attachedToId: null,
    attachedType: null,
    ownedNetwork: 'net-03',
    ownedNetworkId: 'net-003',
    securityGroups: 'default-sg',
    fixedIp: '10.7.60.93',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:34',
    status: 'down',
  },
  {
    id: 'port-004',
    name: 'db-port',
    attachedTo: 'db-server',
    attachedToId: 'inst-003',
    attachedType: 'instance',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroups: 'db-sg',
    fixedIp: '10.7.60.94',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:35',
    status: 'active',
  },
  {
    id: 'port-005',
    name: 'router-port-1',
    attachedTo: 'main-router',
    attachedToId: 'router-001',
    attachedType: 'router',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroups: '-',
    fixedIp: '10.7.60.1',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:36',
    status: 'active',
  },
  {
    id: 'port-006',
    name: 'lb-port',
    attachedTo: 'load-balancer-01',
    attachedToId: 'lb-001',
    attachedType: 'instance',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    securityGroups: 'lb-sg (+1)',
    fixedIp: '10.7.60.95',
    floatingIp: '10.7.65.41',
    macAddress: 'fa:16:3e:34:85:37',
    status: 'active',
  },
  {
    id: 'port-007',
    name: 'cache-port',
    attachedTo: 'redis-01',
    attachedToId: 'inst-004',
    attachedType: 'instance',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroups: 'cache-sg',
    fixedIp: '10.7.60.96',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:38',
    status: 'active',
  },
  {
    id: 'port-008',
    name: 'monitor-port',
    attachedTo: 'prometheus',
    attachedToId: 'inst-005',
    attachedType: 'instance',
    ownedNetwork: 'net-03',
    ownedNetworkId: 'net-003',
    securityGroups: 'monitor-sg',
    fixedIp: '10.7.60.97',
    floatingIp: '10.7.65.42',
    macAddress: 'fa:16:3e:34:85:39',
    status: 'building',
  },
  {
    id: 'port-009',
    name: 'test-port',
    attachedTo: null,
    attachedToId: null,
    attachedType: null,
    ownedNetwork: 'net-04',
    ownedNetworkId: 'net-004',
    securityGroups: 'default-sg',
    fixedIp: '10.7.60.98',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:40',
    status: 'error',
  },
  {
    id: 'port-010',
    name: 'vpn-port',
    attachedTo: 'vpn-gateway',
    attachedToId: 'vpn-001',
    attachedType: 'instance',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroups: 'vpn-sg',
    fixedIp: '10.7.60.99',
    floatingIp: '10.7.65.43',
    macAddress: 'fa:16:3e:34:85:41',
    status: 'active',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const portStatusMap: Record<PortStatus, 'active' | 'error' | 'building' | 'down'> = {
  active: 'active',
  error: 'error',
  building: 'building',
  down: 'down',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'attachedTo', label: 'Attached To', type: 'text' },
  { key: 'ownedNetwork', label: 'Network', type: 'text' },
  { key: 'fixedIp', label: 'Fixed IP', type: 'text' },
  { key: 'floatingIp', label: 'Floating IP', type: 'text' },
  { key: 'macAddress', label: 'MAC Address', type: 'text' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'building', label: 'Building' },
      { value: 'down', label: 'Down' },
    ],
  },
];

export function PortsPage() {
  const navigate = useNavigate();
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ports] = useState(mockPorts);
  const [activeTab, setActiveTab] = useState('all');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [portToDelete, setPortToDelete] = useState<Port | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [attachInstanceOpen, setAttachInstanceOpen] = useState(false);
  const [associateFIPOpen, setAssociateFIPOpen] = useState(false);
  const [manageSecurityGroupsOpen, setManageSecurityGroupsOpen] = useState(false);
  const [editPortOpen, setEditPortOpen] = useState(false);
  const [selectedPortForDrawer, setSelectedPortForDrawer] = useState<Port | null>(null);

  // Drawer handlers
  const handleAttachInstance = (port: Port) => {
    setSelectedPortForDrawer(port);
    setAttachInstanceOpen(true);
  };

  const handleAssociateFloatingIP = (port: Port) => {
    setSelectedPortForDrawer(port);
    setAssociateFIPOpen(true);
  };

  const handleManageSecurityGroups = (port: Port) => {
    setSelectedPortForDrawer(port);
    setManageSecurityGroupsOpen(true);
  };

  const handleEditPort = (port: Port) => {
    setSelectedPortForDrawer(port);
    setEditPortOpen(true);
  };

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'attachedTo', label: 'Attached to', visible: true },
    { id: 'ownedNetwork', label: 'Owned network', visible: true },
    { id: 'securityGroups', label: 'SG', visible: true },
    { id: 'fixedIp', label: 'Fixed IP', visible: true },
    { id: 'floatingIp', label: 'Floating IP', visible: true },
    { id: 'macAddress', label: 'Mac address', visible: true },
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
  const getContextMenuItems = (port: Port): ContextMenuItem[] => [
    {
      id: 'attach-instance',
      label: 'Attach instance',
      onClick: () => handleAttachInstance(port),
      disabled: !!port.attachedTo,
    },
    {
      id: 'detach-instance',
      label: 'Detach instance',
      onClick: () => console.log('Detach instance:', port.id),
      disabled: !port.attachedTo,
    },
    {
      id: 'associate-floating-ip',
      label: 'Associate floating IP',
      onClick: () => handleAssociateFloatingIP(port),
      disabled: !!port.floatingIp,
    },
    {
      id: 'disassociate-floating-ip',
      label: 'Disassociate floating IP',
      onClick: () => console.log('Disassociate floating IP:', port.id),
      disabled: !port.floatingIp,
    },
    {
      id: 'allocate-ip',
      label: 'Allocate IP',
      onClick: () => console.log('Allocate IP:', port.id),
    },
    {
      id: 'manage-security-groups',
      label: 'Manage security groups',
      onClick: () => handleManageSecurityGroups(port),
    },
    { id: 'edit', label: 'Edit', onClick: () => handleEditPort(port) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => {
        setPortToDelete(port);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Filter ports based on search and tab
  const filteredPorts = useMemo(() => {
    let filtered = ports;

    // Filter by tab
    if (activeTab === 'instance') {
      filtered = filtered.filter((p) => p.attachedType === 'instance');
    }

    // Filter by applied filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((p) => {
        return appliedFilters.every((filter) => {
          const value = String(p[filter.field as keyof Port] || '').toLowerCase();
          return value.includes(filter.value.toLowerCase());
        });
      });
    }

    return filtered;
  }, [ports, appliedFilters, activeTab]);

  const totalPages = Math.ceil(filteredPorts.length / rowsPerPage);

  // Paginated data
  const paginatedPorts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPorts.slice(start, start + rowsPerPage);
  }, [filteredPorts, currentPage, rowsPerPage]);

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Port>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={portStatusMap[row.status]} layout="icon-only" />,
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
            to={`/compute/ports/${row.id}`}
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
      key: 'attachedTo',
      label: 'Attached to',
      flex: 1,
      minWidth: columnMinWidths.attachedTo,
      align: 'right',
      render: (_, row) =>
        row.attachedTo ? (
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex flex-col gap-0.5 min-w-0 text-left">
              <Tooltip content={row.attachedTo} position="top">
                <Link
                  to={
                    row.attachedType === 'router'
                      ? `/routers/${row.attachedToId}`
                      : `/instances/${row.attachedToId}`
                  }
                  className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="truncate">{row.attachedTo}</span>
                </Link>
              </Tooltip>
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate">
                ID : {row.attachedToId?.substring(0, 8)}
              </span>
            </div>
            <Tooltip content={row.attachedType === 'router' ? 'Router' : 'Instance'} position="top">
              <div className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-[3px] cursor-default">
                {row.attachedType === 'router' ? (
                  <IconRouter size={12} className="text-[var(--color-text-subtle)]" />
                ) : (
                  <IconCube size={12} className="text-[var(--color-text-subtle)]" />
                )}
              </div>
            </Tooltip>
          </div>
        ) : (
          <span className="block text-left w-full">-</span>
        ),
    },
    {
      key: 'ownedNetwork',
      label: 'Owned network',
      flex: 1,
      minWidth: columnMinWidths.ownedNetwork,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Tooltip content={row.ownedNetwork} position="top">
            <Link
              to={`/compute/networks/${row.ownedNetworkId}`}
              className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{row.ownedNetwork}</span>
            </Link>
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
      minWidth: columnMinWidths.securityGroups,
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
      minWidth: columnMinWidths.fixedIp,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      minWidth: columnMinWidths.floatingIp,
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
      flex: 1,
      minWidth: columnMinWidths.macAddress,
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

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<Port> => col !== undefined);
  }, [columns, columnConfig]);

  const handleContextMenuSelect = (itemId: string) => {
    if (itemId === 'delete' && portToDelete) {
      // Handle delete
      setDeleteModalOpen(false);
      setPortToDelete(null);
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
              <Breadcrumb items={[{ label: 'Proj-1', href: '/project' }, { label: 'Ports' }]} />
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
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Ports
                </h1>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/compute/ports/create')}
                >
                  Create virtual adapter
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onChange={setActiveTab} size="sm">
                <TabList>
                  <Tab value="all">All</Tab>
                  <Tab value="instance">Instance ports</Tab>
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
                      placeholder="Search port by attributes"
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
                selectedCount={selectedPorts.length}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
              />

              {/* Table */}
              <Table
                columns={visibleColumns}
                data={paginatedPorts}
                rowKey="id"
                selectable
                selectedKeys={selectedPorts}
                onSelectionChange={setSelectedPorts}
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
          setPortToDelete(null);
        }}
        title="Delete Port"
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

      {/* Port Drawers */}
      <AttachPortToInstanceDrawer
        isOpen={attachInstanceOpen}
        onClose={() => setAttachInstanceOpen(false)}
        portId={selectedPortForDrawer?.id || ''}
        portName={selectedPortForDrawer?.name || ''}
      />

      <AssociateFloatingIPToPortDrawer
        isOpen={associateFIPOpen}
        onClose={() => setAssociateFIPOpen(false)}
        port={{ name: selectedPortForDrawer?.name || '' }}
      />

      <EditPortSecurityGroupsDrawer
        isOpen={manageSecurityGroupsOpen}
        onClose={() => setManageSecurityGroupsOpen(false)}
        port={{
          id: selectedPortForDrawer?.id || '',
          name: selectedPortForDrawer?.name || '',
        }}
      />

      <EditPortDrawer
        isOpen={editPortOpen}
        onClose={() => setEditPortOpen(false)}
        port={{
          id: selectedPortForDrawer?.id || '',
          name: selectedPortForDrawer?.name || '',
        }}
      />
    </div>
  );
}
