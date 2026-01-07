import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  SectionCard,
  Table,
  StatusIndicator,
  SearchInput,
  Pagination,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconLink,
  IconTrash,
  IconBell,
  IconExternalLink,
  IconDotsCircleHorizontal,
  IconChevronDown,
  IconCirclePlus,
  IconEdit,
  IconSettings,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type RouterStatus = 'active' | 'building' | 'error';
type PortStatus = 'active' | 'down' | 'build';

interface RouterDetail {
  id: string;
  name: string;
  status: RouterStatus;
  adminState: 'Up' | 'Down';
  access: string;
  externalGateway: boolean;
  createdAt: string;
  // Basic Information
  routerName: string;
  availabilityZone: string;
  availabilityZoneHint: string;
  description: string;
  // External Network
  network: { name: string; id: string } | null;
  snat: boolean;
  subnet: { name: string; id: string } | null;
  gatewayIp: string;
}

interface Port {
  id: string;
  name: string;
  status: PortStatus;
  fixedIp: string;
  macAddress: string;
  type: string;
}

interface StaticRoute {
  id: string;
  destination: string;
  nextHop: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockRouterDetail: RouterDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'router-01',
  status: 'active',
  adminState: 'Up',
  access: 'Project',
  externalGateway: true,
  createdAt: '2025-07-25 09:12:20',
  // Basic Information
  routerName: 'router-01',
  availabilityZone: 'nova',
  availabilityZoneHint: 'zone-01 (+3)',
  description: '-',
  // External Network
  network: { name: 'web-server-10', id: 'net-001' },
  snat: true,
  subnet: { name: 'web-server-10', id: 'subnet-001' },
  gatewayIp: '10.0.0.1',
};

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `port-${String(i + 1).padStart(2, '0')}`,
  status: 'active' as const,
  fixedIp: `10.62.0.${i + 1}`,
  macAddress: `fa:16:3e:${String(i + 1).padStart(2, '0')}:ab:cd`,
  type: i % 2 === 0 ? 'Internal Interface' : 'External Interface',
}));

const mockStaticRoutes: StaticRoute[] = Array.from({ length: 115 }, (_, i) => ({
  id: `route-${String(i + 1).padStart(3, '0')}`,
  destination: '10.7.61.0/24',
  nextHop: '192.168.10.50',
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const routerStatusMap: Record<RouterStatus, 'active' | 'building' | 'error'> = {
  'active': 'active',
  'building': 'building',
  'error': 'error',
};

const portStatusMap: Record<PortStatus, 'active' | 'building' | 'shutoff'> = {
  'active': 'active',
  'build': 'building',
  'down': 'shutoff',
};

/* ----------------------------------------
   RouterDetailPage Component
   ---------------------------------------- */

export default function RouterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  
  // Port state
  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const [portSortBy, setPortSortBy] = useState<string>('name');
  const [portSortDirection, setPortSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const portsPerPage = 10;
  
  // Static route state
  const [routeSearchTerm, setRouteSearchTerm] = useState('');
  const [routeCurrentPage, setRouteCurrentPage] = useState(1);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const routesPerPage = 10;
  
  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // In a real app, fetch based on id
  const router = mockRouterDetail;
  const ports = mockPorts;
  const staticRoutes = mockStaticRoutes;

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Routers', href: '/compute/routers' },
    { label: router.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter and paginate ports
  const filteredPorts = useMemo(() => {
    return ports.filter(port =>
      port.name.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
      port.id.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
      port.macAddress.toLowerCase().includes(portSearchTerm.toLowerCase())
    );
  }, [ports, portSearchTerm]);

  const sortedPorts = useMemo(() => {
    const sorted = [...filteredPorts];
    sorted.sort((a, b) => {
      const aValue = a[portSortBy as keyof Port];
      const bValue = b[portSortBy as keyof Port];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return portSortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
    return sorted;
  }, [filteredPorts, portSortBy, portSortDirection]);

  const paginatedPorts = useMemo(() => {
    const startIndex = (portCurrentPage - 1) * portsPerPage;
    return sortedPorts.slice(startIndex, startIndex + portsPerPage);
  }, [sortedPorts, portCurrentPage, portsPerPage]);

  const totalPortPages = Math.ceil(filteredPorts.length / portsPerPage);

  const handlePortSort = (key: string) => {
    if (portSortBy === key) {
      setPortSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setPortSortBy(key);
      setPortSortDirection('asc');
    }
  };

  // Filter and paginate static routes
  const filteredRoutes = useMemo(() => {
    return staticRoutes.filter(route =>
      route.destination.toLowerCase().includes(routeSearchTerm.toLowerCase()) ||
      route.nextHop.toLowerCase().includes(routeSearchTerm.toLowerCase())
    );
  }, [staticRoutes, routeSearchTerm]);

  const paginatedRoutes = useMemo(() => {
    const startIndex = (routeCurrentPage - 1) * routesPerPage;
    return filteredRoutes.slice(startIndex, startIndex + routesPerPage);
  }, [filteredRoutes, routeCurrentPage, routesPerPage]);

  const totalRoutePages = Math.ceil(filteredRoutes.length / routesPerPage);

  // Port columns - matches Figma design
  const portColumns: TableColumn<Port>[] = [
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
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 whitespace-nowrap">
        <Link
          to={`/compute/ports/${row.id}`}
            className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
        </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
      flex: 1,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_: unknown, row: Port) => {
        const portMenuItems: ContextMenuItem[] = [
          { id: 'disconnect', label: 'Disconnect', status: 'danger', onClick: () => console.log('Disconnect port', row.id) },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={portMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Static route columns
  const staticRouteColumns: TableColumn<StaticRoute>[] = [
    {
      key: 'destination',
      label: 'Destination CIDR',
      flex: 1,
    },
    {
      key: 'nextHop',
      label: 'Next Hop',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_: unknown, row: StaticRoute) => {
        const routeMenuItems: ContextMenuItem[] = [
          { id: 'delete', label: 'Delete', status: 'danger', onClick: () => console.log('Delete route', row.id) },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={routeMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
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
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar with Breadcrumb */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Main Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px] max-w-[1320px]">
              {/* Router Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{router.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconLink size={12} />}>
                    Connect Subnet
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                  <ContextMenu
                    items={[
                      { label: 'Disconnect Subnet', onClick: () => {}, variant: 'danger' },
                      { label: 'External Gateway Setting', onClick: () => {} },
                      { label: 'Enable SNAT', onClick: () => {} },
                      { label: 'Disable SNAT', onClick: () => {} },
                      { label: 'Create Static Route', onClick: () => {} },
                      { label: 'Edit', onClick: () => {} },
                    ]}
                    trigger="click"
                  >
                  <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                    More Actions
                  </Button>
                  </ContextMenu>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value="Available"
                    status={routerStatusMap[router.status]}
                  />
                  <DetailHeader.InfoCard label="ID" value={router.id} copyable />
                  <DetailHeader.InfoCard label="Admin State" value={router.adminState} />
                  <DetailHeader.InfoCard label="Access" value={router.access} />
                  <DetailHeader.InfoCard label="External Gateway" value={router.externalGateway ? 'Yes' : 'No'} />
                  <DetailHeader.InfoCard label="Created At" value={router.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Router Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="ports">Ports</Tab>
                    <Tab value="static-routes">Static Routes</Tab>
                  </TabList>

                  {/* Details Tab Panel */}
                  <TabPanel value="details">
                    <VStack gap={4} className="pt-6">
                      {/* Basic Information */}
                      <SectionCard>
                        <SectionCard.Header 
                          title="Basic Information" 
                          actions={
                            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                              Edit
                            </Button>
                          }
                        />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Router Name" value={router.routerName} />
                          <SectionCard.DataRow label="AZ(Availability Zone)" value={router.availabilityZone} />
                          <SectionCard.DataRow label="AZ(Availability Zone) Hint" value={router.availabilityZoneHint} />
                          <SectionCard.DataRow label="Description" value={router.description} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* External Network */}
                      <SectionCard>
                        <SectionCard.Header 
                          title="External Network" 
                          actions={
                            <Button variant="secondary" size="sm" leftIcon={<IconSettings size={12} />}>
                              Setting
                            </Button>
                          }
                        />
                        <SectionCard.Content>
                          <SectionCard.DataRow 
                            label="Network" 
                            value={
                              router.network ? (
                                <Link
                                  to={`/compute/networks/${router.network.id}`}
                                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {router.network.name}
                                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                                </Link>
                              ) : '-'
                            } 
                          />
                          <SectionCard.DataRow label="SNAT" value={router.snat ? 'Yes' : 'No'} />
                          <SectionCard.DataRow 
                            label="Subnet" 
                            value={
                              router.subnet ? (
                                <Link
                                  to={`/compute/subnets/${router.subnet.id}`}
                                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {router.subnet.name}
                                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                                </Link>
                              ) : '-'
                            } 
                          />
                          <SectionCard.DataRow label="Gateway IP" value={router.gatewayIp} />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Ports Tab Panel */}
                  <TabPanel value="ports">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Ports
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Connect Subnet
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            value={portSearchTerm}
                            onChange={(e) => {
                              setPortSearchTerm(e.target.value);
                              setPortCurrentPage(1);
                            }}
                            placeholder="Find interface with filters"
                          />
                        </div>
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          leftIcon={<IconLink size={12} />}
                          disabled={selectedPorts.length === 0}
                        >
                          Disconnect
                        </Button>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={portCurrentPage}
                        totalPages={totalPortPages}
                        onPageChange={setPortCurrentPage}
                        totalItems={filteredPorts.length}
                        selectedCount={selectedPorts.length}
                        showSettings
                        onSettingsClick={() => setIsPreferencesOpen(true)}
                      />

                      {/* Table */}
                      <Table
                        columns={portColumns}
                        data={paginatedPorts}
                        rowKey="id"
                        sortBy={portSortBy}
                        sortDirection={portSortDirection}
                        onSort={handlePortSort}
                        selectable
                        selectedKeys={selectedPorts}
                        onSelectionChange={setSelectedPorts}
                      />
                    </VStack>
                  </TabPanel>

                  {/* Static Routes Tab Panel */}
                  <TabPanel value="static-routes">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Static Route
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Create Static Route
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            value={routeSearchTerm}
                            onChange={(e) => {
                              setRouteSearchTerm(e.target.value);
                              setRouteCurrentPage(1);
                            }}
                            placeholder="Find static route with filters"
                          />
                        </div>
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          leftIcon={<IconTrash size={12} />}
                          disabled
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={routeCurrentPage}
                        totalPages={totalRoutePages}
                        onPageChange={setRouteCurrentPage}
                        totalItems={filteredRoutes.length}
                        selectedCount={selectedRoutes.length}
                        showSettings
                        onSettingsClick={() => setIsPreferencesOpen(true)}
                      />

                      {/* Table */}
                      <Table
                        columns={staticRouteColumns}
                        data={paginatedRoutes}
                        rowKey="id"
                        selectable
                        selectedKeys={selectedRoutes}
                        onSelectionChange={setSelectedRoutes}
                      />
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

