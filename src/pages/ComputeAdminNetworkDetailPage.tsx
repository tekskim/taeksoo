import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Tooltip,
  Badge,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconTrash,
  IconBell,
  IconDotsCircleHorizontal,
  IconEdit,
  IconDownload,
  IconCube,
  IconRouter,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type NetworkStatus = 'active' | 'building' | 'error' | 'down';
type SubnetStatus = 'active' | 'building' | 'error';

interface NetworkDetail {
  id: string;
  name: string;
  status: NetworkStatus;
  adminState: 'Up' | 'Down';
  tenant: string;
  shared: boolean;
  external: boolean;
  createdAt: string;
  // Basic information
  networkName: string;
  description: string;
  portSecurity: boolean;
  routerExternal: boolean;
  // Specification
  mtu: number;
  providerNetworkType: string;
  providerPhysicalNetwork: string;
  segmentationId: string;
}

interface Subnet {
  id: string;
  name: string;
  status: SubnetStatus;
  cidr: string;
  gatewayIp: string;
  dhcpEnabled: boolean;
  portCount: number;
  usedIps: number;
  freeIps: number;
  createdAt: string;
}

interface Port {
  id: string;
  name: string;
  status: 'active' | 'down' | 'build';
  attachedTo: {
    name: string;
    id: string;
    type: 'instance' | 'router' | 'none';
  } | null;
  securityGroups: string[];
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
  adminState: 'Up' | 'Down';
  createdAt: string;
}

interface DhcpAgent {
  id: string;
  host: string;
  status: 'active' | 'down';
  adminState: 'Up' | 'Down';
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Network data map by ID
// Mock data - synchronized with NetworksPage
const mockNetworksMap: Record<string, NetworkDetail> = {
  'net-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'network',
    status: 'active',
    adminState: 'Up',
    tenant: 'tenantA',
    shared: true,
    external: true,
    createdAt: 'Dec 28 2025 23:19:49',
    networkName: 'network',
    description: '-',
    portSecurity: true,
    routerExternal: true,
    mtu: 1500,
    providerNetworkType: 'VLAN',
    providerPhysicalNetwork: 'network',
    segmentationId: '100',
  },
  'net-002': {
    id: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    name: 'internal-net',
    status: 'active',
    adminState: 'Up',
    tenant: 'tenantB',
    shared: false,
    external: false,
    createdAt: 'Dec 20 2025 14:30:00',
    networkName: 'internal-net',
    description: 'Private network for project',
    portSecurity: true,
    routerExternal: false,
    mtu: 1450,
    providerNetworkType: 'VXLAN',
    providerPhysicalNetwork: '-',
    segmentationId: '200',
  },
  'net-003': {
    id: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7',
    name: 'dev-network',
    status: 'active',
    adminState: 'Up',
    tenant: 'tenantA',
    shared: false,
    external: false,
    createdAt: 'Dec 15 2025 09:45:00',
    networkName: 'dev-network',
    description: 'Development network',
    portSecurity: false,
    routerExternal: false,
    mtu: 1500,
    providerNetworkType: 'VLAN',
    providerPhysicalNetwork: 'mgmt',
    segmentationId: '300',
  },
  'net-004': {
    id: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8',
    name: 'prod-net',
    status: 'building',
    adminState: 'Up',
    tenant: 'tenantC',
    shared: true,
    external: true,
    createdAt: 'Dec 10 2025 16:20:00',
    networkName: 'prod-net',
    description: 'Production network',
    portSecurity: false,
    routerExternal: false,
    mtu: 9000,
    providerNetworkType: 'VLAN',
    providerPhysicalNetwork: 'storage',
    segmentationId: '400',
  },
  'net-005': {
    id: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9',
    name: 'test-network',
    status: 'active',
    adminState: 'Down',
    tenant: 'tenantB',
    shared: false,
    external: false,
    createdAt: 'Dec 5 2025 11:00:00',
    networkName: 'test-network',
    description: 'Test network',
    portSecurity: true,
    routerExternal: false,
    mtu: 1500,
    providerNetworkType: 'VXLAN',
    providerPhysicalNetwork: '-',
    segmentationId: '500',
  },
};

const defaultNetworkDetail: NetworkDetail = {
  id: 'unknown',
  name: 'Unknown Network',
  status: 'active',
  adminState: 'Up',
  tenant: '-',
  shared: false,
  external: false,
  createdAt: '-',
  networkName: '-',
  description: '-',
  portSecurity: true,
  routerExternal: false,
  mtu: 1500,
  providerNetworkType: '-',
  providerPhysicalNetwork: '-',
  segmentationId: '-',
};

const mockSubnets: Subnet[] = Array.from({ length: 115 }, (_, i) => ({
  id: `${String(i + 1).padStart(8, '0')}`,
  name: `subnet`,
  status: 'active' as SubnetStatus,
  cidr: '10.7.50.0/24',
  gatewayIp: '10.7.50.0.1',
  dhcpEnabled: true,
  portCount: 100,
  usedIps: 13,
  freeIps: 240,
  createdAt: 'Dec 25, 2025',
}));

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `${String(i + 1).padStart(8, '0')}`,
  name: `port`,
  status: 'active' as const,
  attachedTo: {
    name: 'my-server',
    id: '12345678',
    type: i % 3 === 0 ? ('router' as const) : ('instance' as const),
  },
  securityGroups: ['default', 'web-sg', 'db-sg', 'app-sg'],
  fixedIp: '10.70.0.48',
  floatingIp: '10.70.0.1',
  macAddress: 'fa:16:3e:77:62:19',
  adminState: 'Up' as const,
  createdAt: 'Dec 25, 2025',
}));

const mockDhcpAgents: DhcpAgent[] = Array.from({ length: 115 }, (_, i) => ({
  id: `dhcp-agent-${String(i + 1).padStart(3, '0')}`,
  host: `compute-node-${String(i + 1).padStart(2, '0')}`,
  status: i % 5 === 0 ? ('down' as const) : ('active' as const),
  adminState: i % 7 === 0 ? ('Down' as const) : ('Up' as const),
  createdAt: 'Dec 15, 2025',
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const subnetStatusMap: Record<SubnetStatus, 'active' | 'building' | 'error'> = {
  active: 'active',
  building: 'building',
  error: 'error',
};

const portStatusMap: Record<Port['status'], 'active' | 'building' | 'shutoff'> = {
  active: 'active',
  build: 'building',
  down: 'shutoff',
};

const dhcpAgentStatusMap: Record<DhcpAgent['status'], 'active' | 'error'> = {
  active: 'active',
  down: 'error',
};

/* ----------------------------------------
   NetworkDetailPage Component
   ---------------------------------------- */

export default function NetworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tabs,
    activeTabId,
    addTab,
    closeTab,
    selectTab,
    addNewTab,
    updateActiveTabLabel,
    moveTab,
  } = useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');

  // Subnet state
  const [subnetSearchTerm, setSubnetSearchTerm] = useState('');
  const [subnetCurrentPage, setSubnetCurrentPage] = useState(1);
  const [subnetSortBy, setSubnetSortBy] = useState<string>('name');
  const [subnetSortDirection, setSubnetSortDirection] = useState<'asc' | 'desc'>('asc');
  const subnetsPerPage = 10;

  // Port state
  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const [portSortBy, setPortSortBy] = useState<string>('name');
  const [portSortDirection, setPortSortDirection] = useState<'asc' | 'desc'>('asc');
  const portsPerPage = 10;

  // Selection state
  const [selectedSubnets, setSelectedSubnets] = useState<string[]>([]);
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [selectedDhcpAgents, setSelectedDhcpAgents] = useState<string[]>([]);

  // DHCP Agent state
  const [dhcpAgentSearchTerm, setDhcpAgentSearchTerm] = useState('');
  const [dhcpAgentCurrentPage, setDhcpAgentCurrentPage] = useState(1);
  const [dhcpAgentSortBy, setDhcpAgentSortBy] = useState<string>('host');
  const [dhcpAgentSortDirection, setDhcpAgentSortDirection] = useState<'asc' | 'desc'>('asc');
  const dhcpAgentsPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Get network data based on the ID from URL
  const network = id ? mockNetworksMap[id] || defaultNetworkDetail : defaultNetworkDetail;
  const subnets = mockSubnets;
  const ports = mockPorts;
  const dhcpAgents = mockDhcpAgents;

  // Update tab label to network name
  useEffect(() => {
    if (network.name) {
      updateActiveTabLabel(network.name);
    }
  }, [network.name, updateActiveTabLabel]);

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/' },
    { label: 'Networks', href: '/compute-admin/networks' },
    { label: network.name },
  ];

  // Filter and paginate subnets
  const filteredSubnets = useMemo(() => {
    return subnets.filter(
      (subnet) =>
        subnet.name.toLowerCase().includes(subnetSearchTerm.toLowerCase()) ||
        subnet.id.toLowerCase().includes(subnetSearchTerm.toLowerCase()) ||
        subnet.cidr.toLowerCase().includes(subnetSearchTerm.toLowerCase())
    );
  }, [subnets, subnetSearchTerm]);

  const sortedSubnets = useMemo(() => {
    const sorted = [...filteredSubnets];
    sorted.sort((a, b) => {
      const aValue = a[subnetSortBy as keyof Subnet];
      const bValue = b[subnetSortBy as keyof Subnet];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return subnetSortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return subnetSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    return sorted;
  }, [filteredSubnets, subnetSortBy, subnetSortDirection]);

  const paginatedSubnets = useMemo(() => {
    const startIndex = (subnetCurrentPage - 1) * subnetsPerPage;
    return sortedSubnets.slice(startIndex, startIndex + subnetsPerPage);
  }, [sortedSubnets, subnetCurrentPage, subnetsPerPage]);

  const totalSubnetPages = Math.ceil(filteredSubnets.length / subnetsPerPage);

  const handleSubnetSort = (key: string) => {
    if (subnetSortBy === key) {
      setSubnetSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSubnetSortBy(key);
      setSubnetSortDirection('asc');
    }
  };

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

  // Filter and paginate DHCP agents
  const filteredDhcpAgents = useMemo(() => {
    return dhcpAgents.filter(
      (agent) =>
        agent.host.toLowerCase().includes(dhcpAgentSearchTerm.toLowerCase()) ||
        agent.id.toLowerCase().includes(dhcpAgentSearchTerm.toLowerCase())
    );
  }, [dhcpAgents, dhcpAgentSearchTerm]);

  const sortedDhcpAgents = useMemo(() => {
    const sorted = [...filteredDhcpAgents];
    sorted.sort((a, b) => {
      const aValue = a[dhcpAgentSortBy as keyof DhcpAgent];
      const bValue = b[dhcpAgentSortBy as keyof DhcpAgent];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return dhcpAgentSortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
    return sorted;
  }, [filteredDhcpAgents, dhcpAgentSortBy, dhcpAgentSortDirection]);

  const paginatedDhcpAgents = useMemo(() => {
    const startIndex = (dhcpAgentCurrentPage - 1) * dhcpAgentsPerPage;
    return sortedDhcpAgents.slice(startIndex, startIndex + dhcpAgentsPerPage);
  }, [sortedDhcpAgents, dhcpAgentCurrentPage, dhcpAgentsPerPage]);

  const totalDhcpAgentPages = Math.ceil(filteredDhcpAgents.length / dhcpAgentsPerPage);

  const handleDhcpAgentSort = (key: string) => {
    if (dhcpAgentSortBy === key) {
      setDhcpAgentSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setDhcpAgentSortBy(key);
      setDhcpAgentSortDirection('asc');
    }
  };

  // Subnet columns
  const subnetColumns: TableColumn<Subnet>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/subnets/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID:{row.id}</span>
        </div>
      ),
    },
    {
      key: 'cidr',
      label: 'CIDR',
      flex: 1,
    },
    {
      key: 'gatewayIp',
      label: 'Gateway IP',
      flex: 1,
    },
    {
      key: 'portCount',
      label: 'Port Count',
      flex: 1,
      sortable: true,
      align: 'left',
    },
    {
      key: 'usedIps',
      label: 'Used IPs',
      flex: 1,
      sortable: true,
      align: 'left',
    },
    {
      key: 'freeIps',
      label: 'Free IPs',
      flex: 1,
      sortable: true,
      align: 'left',
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
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_: unknown, row: Subnet) => {
        const subnetMenuItems: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', onClick: () => console.log('Edit subnet', row.id) },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete subnet', row.id),
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={subnetMenuItems} trigger="click" align="right">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Port columns
  const portColumns: TableColumn<Port>[] = [
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
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/ports/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'attachedTo',
      label: 'Attached to',
      flex: 1,
      render: (_, row) =>
        row.attachedTo ? (
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex flex-col gap-0.5 min-w-0">
              <Link
                to={
                  row.attachedTo.type === 'router'
                    ? `/compute-admin/routers/${row.attachedTo.id}`
                    : `/compute-admin/instances/${row.attachedTo.id}`
                }
                className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {row.attachedTo.name}
              </Link>
              <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                ID : {row.attachedTo.id}
              </span>
            </div>
            <Tooltip
              content={row.attachedTo.type === 'router' ? 'Router' : 'Instance'}
              position="top"
              delay={0}
            >
              <div className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-1">
                {row.attachedTo.type === 'router' ? (
                  <IconRouter size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                ) : (
                  <IconCube size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                )}
              </div>
            </Tooltip>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
    {
      key: 'securityGroups',
      label: 'SG',
      flex: 1,
      render: (_, row) => {
        const sgCount = row.securityGroups.length;
        const displaySg = row.securityGroups[0];
        const additionalCount = sgCount - 1;
        return (
          <span className="text-[var(--color-text-default)]">
            {displaySg}
            {additionalCount > 0 && ` (+${additionalCount})`}
          </span>
        );
      },
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
      render: (_, row) => (
        <Link
          to={`/compute-admin/floating-ips/${row.floatingIp}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.floatingIp}
        </Link>
      ),
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
      flex: 1,
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
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
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_: unknown, row: Port) => {
        const portMenuItems: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', onClick: () => console.log('Edit port', row.id) },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete port', row.id),
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={portMenuItems} trigger="click" align="right">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // DHCP Agent columns
  const dhcpAgentColumns: TableColumn<DhcpAgent>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={dhcpAgentStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'host',
      label: 'Host',
      flex: 1,
      sortable: true,
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
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
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_: unknown, row: DhcpAgent) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            onClick={() => console.log('Remove DHCP agent', row.id)}
          >
            <IconTrash size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar with Breadcrumb */}
          <TopBar
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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={8} className="min-w-[1176px]">
              {/* Network Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{network.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Create Subnet
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard label="Status" value="Active" status={network.status} />
                  <DetailHeader.InfoCard label="ID" value={network.id} copyable />
                  <DetailHeader.InfoCard label="Tenant" value={network.tenant} />
                  <DetailHeader.InfoCard label="Admin state" value={network.adminState} />
                  <DetailHeader.InfoCard label="Shared" value={network.shared ? 'Yes' : 'No'} />
                  <DetailHeader.InfoCard label="External" value={network.external ? 'Yes' : 'No'} />
                  <DetailHeader.InfoCard label="Created at" value={network.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Network Tabs */}
              <div className="w-full">
                <Tabs
                  value={activeDetailTab}
                  onChange={setActiveDetailTab}
                  variant="underline"
                  size="sm"
                >
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="subnets">Subnets</Tab>
                    <Tab value="ports">Ports</Tab>
                    <Tab value="dhcp-agents">DHCP Agents</Tab>
                  </TabList>

                  {/* Details Tab Panel */}
                  <TabPanel value="details" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Basic Information */}
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
                          <SectionCard.DataRow label="Network name" value={network.networkName} />
                          <SectionCard.DataRow label="Description" value={network.description} />
                          <SectionCard.DataRow label="Admin state" value={network.adminState} />
                          <SectionCard.DataRow
                            label="Port security"
                            value={network.portSecurity ? 'On' : 'Off'}
                          />
                          <SectionCard.DataRow
                            label="Shared"
                            value={network.shared ? 'Yes' : 'No'}
                          />
                          <SectionCard.DataRow
                            label="Router External"
                            value={network.routerExternal ? 'Yes' : 'No'}
                          />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Specifications */}
                      <SectionCard>
                        <SectionCard.Header title="Specifications" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="MTU" value={String(network.mtu)} />
                          <SectionCard.DataRow
                            label="Provider Network Type"
                            value={network.providerNetworkType}
                          />
                          <SectionCard.DataRow
                            label="Physical Network"
                            value={network.providerPhysicalNetwork}
                          />
                          <SectionCard.DataRow
                            label="Segmentation ID"
                            value={network.segmentationId}
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Subnets Tab Panel */}
                  <TabPanel value="subnets" className="pt-0">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                          Subnets
                        </h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} />}
                        >
                          Create Subnet
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-1">
                        {/* Search */}
                        <div className="flex items-center gap-1">
                          <div>
                            <SearchInput
                              value={subnetSearchTerm}
                              onChange={(e) => {
                                setSubnetSearchTerm(e.target.value);
                                setSubnetCurrentPage(1);
                              }}
                              placeholder="Search subnets by attributes"
                            />
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<IconDownload size={12} />}
                            aria-label="Download"
                          />
                        </div>
                        {/* Divider */}
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                        {/* Delete Button */}
                        <Button
                          variant="muted"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedSubnets.length === 0}
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={subnetCurrentPage}
                        totalPages={totalSubnetPages}
                        onPageChange={setSubnetCurrentPage}
                        totalItems={filteredSubnets.length}
                        selectedCount={selectedSubnets.length}
                      />

                      {/* Table */}
                      <Table
                        columns={subnetColumns}
                        data={paginatedSubnets}
                        rowKey="id"
                        sortBy={subnetSortBy}
                        sortDirection={subnetSortDirection}
                        onSort={handleSubnetSort}
                        selectable
                        selectedKeys={selectedSubnets}
                        onSelectionChange={setSelectedSubnets}
                      />
                    </VStack>
                  </TabPanel>

                  {/* Ports Tab Panel */}
                  <TabPanel value="ports" className="pt-0">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-heading-h5 text-[var(--color-text-default)]">Ports</h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} />}
                        >
                          Create Port
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-1">
                        {/* Search */}
                        <div className="flex items-center gap-1">
                          <div>
                            <SearchInput
                              value={portSearchTerm}
                              onChange={(e) => {
                                setPortSearchTerm(e.target.value);
                                setPortCurrentPage(1);
                              }}
                              placeholder="Search ports by attributes"
                            />
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<IconDownload size={12} />}
                            aria-label="Download"
                          />
                        </div>
                        {/* Divider */}
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                        {/* Delete Button */}
                        <Button
                          variant="muted"
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

                  {/* DHCP Agents Tab Panel */}
                  <TabPanel value="dhcp-agents" className="pt-0">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                          DHCP Agents
                        </h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} />}
                        >
                          Add DHCP Agent
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-1">
                        {/* Search */}
                        <div className="flex items-center gap-1">
                          <div>
                            <SearchInput
                              value={dhcpAgentSearchTerm}
                              onChange={(e) => {
                                setDhcpAgentSearchTerm(e.target.value);
                                setDhcpAgentCurrentPage(1);
                              }}
                              placeholder="Search DHCP agents by attributes"
                            />
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<IconDownload size={12} />}
                            aria-label="Download"
                          />
                        </div>
                        {/* Divider */}
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                        {/* Remove Button */}
                        <Button
                          variant="muted"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedDhcpAgents.length === 0}
                        >
                          Remove
                        </Button>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={dhcpAgentCurrentPage}
                        totalPages={totalDhcpAgentPages}
                        onPageChange={setDhcpAgentCurrentPage}
                        totalItems={filteredDhcpAgents.length}
                        selectedCount={selectedDhcpAgents.length}
                      />

                      {/* Table */}
                      <Table
                        columns={dhcpAgentColumns}
                        data={paginatedDhcpAgents}
                        rowKey="id"
                        sortBy={dhcpAgentSortBy}
                        sortDirection={dhcpAgentSortDirection}
                        onSort={handleDhcpAgentSort}
                        selectable
                        selectedKeys={selectedDhcpAgents}
                        onSelectionChange={setSelectedDhcpAgents}
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
