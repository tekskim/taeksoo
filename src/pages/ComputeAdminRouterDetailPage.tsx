import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Button,
  VStack,
  PageShell,
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
  Badge,
  type TableColumn,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell, IconEdit, IconDownload } from '@tabler/icons-react';

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
  // Basic information
  routerName: string;
  availabilityZone: string;
  availabilityZoneHint: string;
  description: string;
  // External network
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
  adminState: 'Up' | 'Down';
  createdAt: string;
}

interface StaticRoute {
  id: string;
  destination: string;
  nextHop: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Router data map by ID - synced with RoutersPage mock data
const mockRoutersMap: Record<string, RouterDetail> = {
  '29tgj234': {
    id: '29tgj234',
    name: 'router-01',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Sep 15, 2025',
    routerName: 'router-01',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01 (+3)',
    description: '-',
    network: { name: 'net-01', id: '29tgj234' },
    snat: true,
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    gatewayIp: '10.7.60.91',
  },
  'router-002': {
    id: 'router-002',
    name: 'main-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Sep 10, 2025',
    routerName: 'main-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'Main router',
    network: { name: 'external-net', id: 'net-002' },
    snat: true,
    subnet: { name: 'subnet-02', id: 'subnet-002' },
    gatewayIp: '10.7.60.92',
  },
  'router-003': {
    id: 'router-003',
    name: 'dev-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: false,
    createdAt: 'Sep 8, 2025',
    routerName: 'dev-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-02',
    description: 'Development router',
    network: { name: '-', id: '' },
    snat: false,
    subnet: { name: '-', id: '' },
    gatewayIp: '-',
  },
  'router-004': {
    id: 'router-004',
    name: 'prod-router',
    status: 'building',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Sep 5, 2025',
    routerName: 'prod-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'Production router',
    network: { name: 'prod-net', id: 'net-003' },
    snat: true,
    subnet: { name: 'subnet-03', id: 'subnet-003' },
    gatewayIp: '10.7.60.93',
  },
  'router-005': {
    id: 'router-005',
    name: 'test-router',
    status: 'active',
    adminState: 'Down',
    access: 'Project',
    externalGateway: false,
    createdAt: 'Sep 1, 2025',
    routerName: 'test-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-03',
    description: 'Test router',
    network: { name: '-', id: '' },
    snat: false,
    subnet: { name: '-', id: '' },
    gatewayIp: '-',
  },
  'router-006': {
    id: 'router-006',
    name: 'backup-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Aug 28, 2025',
    routerName: 'backup-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'Backup router',
    network: { name: 'backup-net', id: 'net-004' },
    snat: true,
    subnet: { name: 'subnet-04', id: 'subnet-004' },
    gatewayIp: '10.7.60.94',
  },
  'router-007': {
    id: 'router-007',
    name: 'dmz-router',
    status: 'error',
    adminState: 'Down',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Aug 25, 2025',
    routerName: 'dmz-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'DMZ router',
    network: { name: 'dmz-net', id: 'net-005' },
    snat: true,
    subnet: { name: 'subnet-05', id: 'subnet-005' },
    gatewayIp: '10.7.60.95',
  },
  'router-008': {
    id: 'router-008',
    name: 'internal-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: false,
    createdAt: 'Aug 20, 2025',
    routerName: 'internal-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-02',
    description: 'Internal router',
    network: { name: '-', id: '' },
    snat: false,
    subnet: { name: '-', id: '' },
    gatewayIp: '-',
  },
  'router-009': {
    id: 'router-009',
    name: 'edge-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Aug 15, 2025',
    routerName: 'edge-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'Edge router',
    network: { name: 'edge-net', id: 'net-006' },
    snat: true,
    subnet: { name: 'subnet-06', id: 'subnet-006' },
    gatewayIp: '10.7.60.96',
  },
  'router-010': {
    id: 'router-010',
    name: 'vpn-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Aug 10, 2025',
    routerName: 'vpn-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'VPN router',
    network: { name: 'vpn-net', id: 'net-007' },
    snat: true,
    subnet: { name: 'subnet-07', id: 'subnet-007' },
    gatewayIp: '10.7.60.97',
  },
};

const defaultRouterDetail: RouterDetail = {
  id: 'unknown',
  name: 'Unknown Router',
  status: 'active',
  adminState: 'Up',
  access: 'Project',
  externalGateway: false,
  createdAt: '-',
  routerName: '-',
  availabilityZone: '-',
  availabilityZoneHint: '-',
  description: '-',
  network: { name: '-', id: '' },
  snat: false,
  subnet: { name: '-', id: '' },
  gatewayIp: '-',
};

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `port-${String(i + 1).padStart(2, '0')}`,
  status: 'active' as const,
  fixedIp: `10.62.0.${i + 1}`,
  macAddress: `fa:16:3e:${String(i + 1).padStart(2, '0')}:ab:cd`,
  type: i % 2 === 0 ? 'Internal Interface' : 'External Interface',
  adminState: i % 5 === 0 ? ('Down' as const) : ('Up' as const),
  createdAt: `Dec ${15 - (i % 15)}, 2025`,
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
  active: 'active',
  building: 'building',
  error: 'error',
};

const portStatusMap: Record<PortStatus, 'active' | 'building' | 'shutoff'> = {
  active: 'active',
  build: 'building',
  down: 'shutoff',
};

/* ----------------------------------------
   RouterDetailPage Component
   ---------------------------------------- */

export default function RouterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

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

  // Get router data based on URL ID
  const router = id ? mockRoutersMap[id] || defaultRouterDetail : defaultRouterDetail;
  const ports = mockPorts;
  const staticRoutes = mockStaticRoutes;

  // Update tab label to router name
  useEffect(() => {
    if (router.name) {
      updateActiveTabLabel(router.name);
    }
  }, [router.name, updateActiveTabLabel]);

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/' },
    { label: 'Routers', href: '/compute-admin/routers' },
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
    return ports.filter(
      (port) =>
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
      setPortSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setPortSortBy(key);
      setPortSortDirection('asc');
    }
  };

  // Filter and paginate static routes
  const filteredRoutes = useMemo(() => {
    return staticRoutes.filter(
      (route) =>
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
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={portStatusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/ports/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID: {row.id}
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
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
      render: (value: 'Up' | 'Down') => (
        <Badge variant={value === 'Up' ? 'success' : 'default'} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: Port) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            onClick={() => console.log('Delete port', row.id)}
          >
            <IconTrash size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
          </button>
        </div>
      ),
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
      label: 'Next hop',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: StaticRoute) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            onClick={() => console.log('Delete route', row.id)}
          >
            <IconTrash size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={8} className="min-w-[1176px]">
        {/* Router Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{router.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value="Available"
              status={routerStatusMap[router.status]}
            />
            <DetailHeader.InfoCard label="ID" value={router.id} copyable />
            <DetailHeader.InfoCard label="Tenant" value="tenantA" />
            <DetailHeader.InfoCard label="Admin state" value={router.adminState} />
            <DetailHeader.InfoCard
              label="External gateway"
              value={router.externalGateway ? 'Yes' : 'No'}
            />
            <DetailHeader.InfoCard label="Created at" value={router.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Router Tabs */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="ports">Ports</Tab>
              <Tab value="static-routes">Static routes</Tab>
            </TabList>

            {/* Details Tab Panel */}
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic information */}
                <SectionCard>
                  <SectionCard.Header
                    title="Basic information"
                    actions={
                      <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                        Edit
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Router name" value={router.routerName} />
                    <SectionCard.DataRow label="Description" value={router.description} />
                    <SectionCard.DataRow label="Admin state" value={router.adminState} />
                  </SectionCard.Content>
                </SectionCard>

                {/* External network */}
                <SectionCard>
                  <SectionCard.Header title="External network" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Network"
                      value={
                        router.network ? (
                          <Link
                            to={`/compute-admin/networks/${router.network.id}`}
                            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                          >
                            {router.network.name}
                          </Link>
                        ) : (
                          '-'
                        )
                      }
                    />
                    <SectionCard.DataRow
                      label="SNAT"
                      value={router.snat ? 'Enabled' : 'Disabled'}
                    />
                    <SectionCard.DataRow
                      label="Subnet"
                      value={
                        router.subnet ? (
                          <Link
                            to={`/compute-admin/subnets/${router.subnet.id}`}
                            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                          >
                            {router.subnet.name}
                          </Link>
                        ) : (
                          '-'
                        )
                      }
                    />
                    <SectionCard.DataRow label="Gateway IP" value={router.gatewayIp} />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Ports Tab Panel */}
            <TabPanel value="ports" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-h5 text-[var(--color-text-default)]">Ports</h3>
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-2">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      value={portSearchTerm}
                      onChange={(e) => {
                        setPortSearchTerm(e.target.value);
                        setPortCurrentPage(1);
                      }}
                      placeholder="Search interface by attributes"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconOnly
                    icon={<IconDownload size={12} />}
                    aria-label="Download"
                  />
                  <div className="h-4 w-px bg-[var(--color-border-default)]" />
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                    disabled={selectedPorts.length === 0}
                  >
                    Delete
                  </Button>
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={portCurrentPage}
                  totalPages={totalPortPages}
                  onPageChange={setPortCurrentPage}
                  totalItems={filteredPorts.length}
                  selectedCount={selectedPorts.length}
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
            <TabPanel value="static-routes" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-h5 text-[var(--color-text-default)]">Static Route</h3>
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-2">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      value={routeSearchTerm}
                      onChange={(e) => {
                        setRouteSearchTerm(e.target.value);
                        setRouteCurrentPage(1);
                      }}
                      placeholder="Search static route by attributes"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconOnly
                    icon={<IconDownload size={12} />}
                    aria-label="Download"
                  />
                  <div className="h-4 w-px bg-[var(--color-border-default)]" />
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                    disabled={selectedRoutes.length === 0}
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
    </PageShell>
  );
}
