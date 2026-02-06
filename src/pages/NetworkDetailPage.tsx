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
  Tooltip,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconTrash,
  IconBell,
  IconExternalLink,
  IconDotsCircleHorizontal,
  IconCube,
  IconRouter,
  IconEdit,
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
  access: string;
  external: boolean;
  createdAt: string;
  // Basic information
  networkName: string;
  availabilityZone: string;
  availabilityZoneHint: string;
  description: string;
  // Specification
  mtu: number;
  portSecurity: boolean;
  routerExternal: boolean;
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
  ownedNetwork: {
    name: string;
    id: string;
  };
  securityGroups: string[];
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Network data map by ID
// Mock data - synchronized with NetworksPage
const mockNetworksMap: Record<string, NetworkDetail> = {
  'net-001': {
    id: 'net-001',
    name: 'net-01',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: true,
    createdAt: '2025-09-15',
    networkName: 'net-01',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Public external network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: true,
    providerNetworkType: 'flat',
    providerPhysicalNetwork: 'external',
    segmentationId: '-',
  },
  'net-002': {
    id: 'net-002',
    name: 'internal-net',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: false,
    createdAt: '2025-09-10',
    networkName: 'internal-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Private network for project',
    mtu: 1450,
    portSecurity: true,
    routerExternal: false,
    providerNetworkType: 'vxlan',
    providerPhysicalNetwork: '-',
    segmentationId: '100',
  },
  'net-003': {
    id: 'net-003',
    name: 'dev-network',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: false,
    createdAt: '2025-09-05',
    networkName: 'dev-network',
    availabilityZone: 'keystone',
    availabilityZoneHint: '-',
    description: 'Development network',
    mtu: 1500,
    portSecurity: false,
    routerExternal: false,
    providerNetworkType: 'vlan',
    providerPhysicalNetwork: 'mgmt',
    segmentationId: '200',
  },
  'net-004': {
    id: 'net-004',
    name: 'prod-net',
    status: 'building',
    adminState: 'Up',
    access: 'Project',
    external: true,
    createdAt: '2025-09-01',
    networkName: 'prod-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Production network',
    mtu: 9000,
    portSecurity: false,
    routerExternal: false,
    providerNetworkType: 'vlan',
    providerPhysicalNetwork: 'storage',
    segmentationId: '300',
  },
  'net-005': {
    id: 'net-005',
    name: 'test-network',
    status: 'active',
    adminState: 'Down',
    access: 'Project',
    external: false,
    createdAt: '2025-08-25',
    networkName: 'test-network',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Test network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: false,
    providerNetworkType: 'vxlan',
    providerPhysicalNetwork: '-',
    segmentationId: '400',
  },
  'net-006': {
    id: 'net-006',
    name: 'dmz-net',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: true,
    createdAt: '2025-08-20',
    networkName: 'dmz-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'DMZ network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: true,
    providerNetworkType: 'flat',
    providerPhysicalNetwork: 'dmz',
    segmentationId: '-',
  },
  'net-007': {
    id: 'net-007',
    name: 'management-net',
    status: 'error',
    adminState: 'Down',
    access: 'Project',
    external: false,
    createdAt: '2025-08-15',
    networkName: 'management-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Management network',
    mtu: 1500,
    portSecurity: false,
    routerExternal: false,
    providerNetworkType: 'vlan',
    providerPhysicalNetwork: 'mgmt',
    segmentationId: '500',
  },
  'net-008': {
    id: 'net-008',
    name: 'backup-network',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: false,
    createdAt: '2025-08-10',
    networkName: 'backup-network',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Backup network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: false,
    providerNetworkType: 'vxlan',
    providerPhysicalNetwork: '-',
    segmentationId: '600',
  },
  'net-009': {
    id: 'net-009',
    name: 'external-gateway',
    status: 'active',
    adminState: 'Up',
    access: 'Shared',
    external: true,
    createdAt: '2025-08-05',
    networkName: 'external-gateway',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'External gateway network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: true,
    providerNetworkType: 'flat',
    providerPhysicalNetwork: 'external',
    segmentationId: '-',
  },
  'net-010': {
    id: 'net-010',
    name: 'provider-net',
    status: 'active',
    adminState: 'Up',
    access: 'External',
    external: true,
    createdAt: '2025-08-01',
    networkName: 'provider-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Provider network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: true,
    providerNetworkType: 'flat',
    providerPhysicalNetwork: 'provider',
    segmentationId: '-',
  },
};

const defaultNetworkDetail: NetworkDetail = {
  id: 'unknown',
  name: 'Unknown Network',
  status: 'active',
  adminState: 'Up',
  access: 'Project',
  external: false,
  createdAt: '-',
  networkName: '-',
  availabilityZone: '-',
  availabilityZoneHint: '-',
  description: '-',
  mtu: 1500,
  portSecurity: true,
  routerExternal: false,
  providerNetworkType: '-',
  providerPhysicalNetwork: '-',
  segmentationId: '-',
};

const mockSubnets: Subnet[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tg234${String(i).padStart(3, '0')}`,
  name: `subnet-1`,
  status: 'active' as SubnetStatus,
  cidr: '192.168.16/24',
  gatewayIp: '192.168.11',
  dhcpEnabled: true,
  portCount: 2,
  createdAt: '2025-01-15 10:30:00',
}));

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `port-01`,
  status: 'active' as const,
  attachedTo: {
    name: 'web-01',
    id: '29tgj234',
    type: i % 3 === 0 ? ('router' as const) : ('instance' as const),
  },
  ownedNetwork: {
    name: 'net-01',
    id: '29tgj234',
  },
  securityGroups: ['default-sg', 'web-sg', 'db-sg', 'app-sg', 'monitor-sg'],
  fixedIp: '10760.91',
  floatingIp: '10765.39',
  macAddress: 'fa:16:3e:34:85:32',
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

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Get network data based on the ID from URL
  const network = id ? mockNetworksMap[id] || defaultNetworkDetail : defaultNetworkDetail;
  const subnets = mockSubnets;
  const ports = mockPorts;

  // Update tab label to network name
  useEffect(() => {
    if (network.name) {
      updateActiveTabLabel(network.name);
    }
  }, [network.name, updateActiveTabLabel]);

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Networks', href: '/compute/networks' },
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

  // Subnet columns
  const subnetColumns: TableColumn<Subnet>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/subnets/${row.id}`}
            className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'cidr',
      label: 'CIDR',
      flex: 1,
      minWidth: columnMinWidths.cidr,
    },
    {
      key: 'gatewayIp',
      label: 'Gateway IP',
      flex: 1,
      minWidth: columnMinWidths.gatewayIp,
      sortable: true,
    },
    {
      key: 'portCount',
      label: 'Port count',
      flex: 1,
      minWidth: columnMinWidths.portCount,
      sortable: true,
      align: 'left',
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
            to={`/compute/ports/${row.id}`}
            className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'attachedTo',
      label: 'Attached to',
      flex: 1,
      render: (_, row) =>
        row.attachedTo ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-0.5">
              <Link
                to={
                  row.attachedTo.type === 'router'
                    ? `/routers/${row.attachedTo.id}`
                    : `/instances/${row.attachedTo.id}`
                }
                className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                {row.attachedTo.name}
                <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
              </Link>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                ID : {row.attachedTo.id}
              </span>
            </div>
            <Tooltip
              content={row.attachedTo.type === 'router' ? 'Router' : 'Instance'}
              position="top"
              delay={0}
            >
              <div className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-1 cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors">
                {row.attachedTo.type === 'router' ? (
                  <IconRouter size={16} className="text-[var(--color-text-subtle)]" />
                ) : (
                  <IconCube size={16} className="text-[var(--color-text-subtle)]" />
                )}
              </div>
            </Tooltip>
          </div>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'ownedNetwork',
      label: 'Owned network',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/networks/${row.ownedNetwork.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.ownedNetwork.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            ID : {row.ownedNetwork.id}
          </span>
        </div>
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
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
      flex: 1,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

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
                    Create subnet
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard label="Status" value="Available" status="active" />
                  <DetailHeader.InfoCard label="ID" value={network.id} copyable />
                  <DetailHeader.InfoCard label="Admin state" value={network.adminState} />
                  <DetailHeader.InfoCard label="Access" value={network.access} />
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
                          <SectionCard.DataRow label="Network name" value={network.networkName} />
                          <SectionCard.DataRow
                            label="AZ(Availability zone)"
                            value={network.availabilityZone}
                          />
                          <SectionCard.DataRow
                            label="AZ(Availability zone) Hint"
                            value={network.availabilityZoneHint}
                          />
                          <SectionCard.DataRow label="Description" value={network.description} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Specification */}
                      <SectionCard>
                        <SectionCard.Header title="Specification" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="MTU" value={String(network.mtu)} />
                          <SectionCard.DataRow
                            label="Port security"
                            value={network.portSecurity ? 'Yes' : 'No'}
                          />
                          <SectionCard.DataRow
                            label="Router external"
                            value={network.routerExternal ? 'Yes' : 'No'}
                          />
                          <SectionCard.DataRow
                            label="Provider network Type"
                            value={network.providerNetworkType}
                          />
                          <SectionCard.DataRow
                            label="Provider physical Network"
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
                    <VStack gap={4} className="pt-4">
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
                          Create subnet
                        </Button>
                      </div>

                      {/* Search */}
                      <div className="w-[var(--search-input-width)]">
                        <SearchInput
                          value={subnetSearchTerm}
                          onChange={(e) => {
                            setSubnetSearchTerm(e.target.value);
                            setSubnetCurrentPage(1);
                          }}
                          placeholder="Search subnet by attributes"
                        />
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2">
                        <Pagination
                          currentPage={subnetCurrentPage}
                          totalPages={totalSubnetPages}
                          onPageChange={setSubnetCurrentPage}
                          totalItems={filteredSubnets.length}
                          selectedCount={selectedSubnets.length}
                        />
                      </div>

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
                    <VStack gap={4} className="pt-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-heading-h5 text-[var(--color-text-default)]">Ports</h3>
                      </div>

                      {/* Search */}
                      <div className="w-[var(--search-input-width)]">
                        <SearchInput
                          value={portSearchTerm}
                          onChange={(e) => {
                            setPortSearchTerm(e.target.value);
                            setPortCurrentPage(1);
                          }}
                          placeholder="Search port by attributes"
                        />
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2">
                        <Pagination
                          currentPage={portCurrentPage}
                          totalPages={totalPortPages}
                          onPageChange={setPortCurrentPage}
                          totalItems={filteredPorts.length}
                          selectedCount={selectedPorts.length}
                        />
                      </div>

                      {/* Table */}
                      <Table
                        columns={portColumns}
                        data={paginatedPorts}
                        rowKey="id"
                        sortBy={portSortBy}
                        sortDirection={portSortDirection}
                        onSort={handlePortSort}
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
