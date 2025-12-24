import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  SearchInput,
  Pagination,
  StatusIndicator,
} from '@/design-system';
import { Link } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTerminal2,
  IconPlayerPlay,
  IconPlayerStop,
  IconRefresh,
  IconTrash,
  IconChevronDown,
  IconEdit,
  IconBell,
  IconCirclePlus,
  IconDotsVertical,
  IconExternalLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface AttachedVolume {
  id: string;
  name: string;
  status: 'active' | 'in-use' | 'available' | 'error';
  size: string;
  type: string;
  diskTag: string;
  bootable: boolean;
  access: string;
}

interface AttachedInterface {
  id: string;
  network: string;
  port: string;
  portStatus: 'Active' | 'Inactive' | 'Down' | 'Build';
  fixedIp: string;
  macAddress: string;
}

interface FloatingIP {
  id: string;
  name: string;
  status: 'active' | 'shutoff' | 'error';
  floatingIp: string;
  fixedIp: string;
  createdAt: string;
}

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
}

interface NetworkInterface {
  id: string;
  name: string;
  ip: string;
}

interface InstanceDetail {
  id: string;
  name: string;
  status: 'active' | 'shutoff' | 'building' | 'error' | 'paused';
  host: string;
  createdAt: string;
  availabilityZone: string;
  description: string;
  flavor: {
    name: string;
    vcpu: number;
    ram: string;
    disk: string;
    gpu: number;
  };
  image: string;
  interfaces: number;
  keyPair: string;
  serverGroup: string;
  userData: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInstanceDetail: InstanceDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'tk-test',
  status: 'active',
  host: 'compute-03',
  createdAt: '2025-07-25 09:12:20',
  availabilityZone: 'nova',
  description: '-',
  flavor: {
    name: 'web-server-10',
    vcpu: 1,
    ram: '4 GiB',
    disk: '40 GiB',
    gpu: 1,
  },
  image: 'web-server-10',
  interfaces: 5,
  keyPair: 'web-server-10',
  serverGroup: 'web-server-10',
  userData: 'web-server-10',
};

const mockAttachedVolumes: AttachedVolume[] = [
  {
    id: 'vol-001',
    name: 'vol34',
    status: 'active',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'OS Disk',
    bootable: false,
    access: 'Public',
  },
  {
    id: 'vol-002',
    name: 'data-volume-01',
    status: 'active',
    size: '500GiB',
    type: 'SSD',
    diskTag: 'Data Disk',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-003',
    name: 'backup-vol',
    status: 'active',
    size: '2000GiB',
    type: '_DEFAULT_',
    diskTag: 'Backup',
    bootable: false,
    access: 'Public',
  },
  {
    id: 'vol-004',
    name: 'app-storage',
    status: 'active',
    size: '750GiB',
    type: 'SSD',
    diskTag: 'App Data',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-005',
    name: 'database-vol',
    status: 'active',
    size: '1000GiB',
    type: 'SSD',
    diskTag: 'Database',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-006',
    name: 'logs-archive',
    status: 'active',
    size: '250GiB',
    type: '_DEFAULT_',
    diskTag: 'Logs',
    bootable: false,
    access: 'Public',
  },
  {
    id: 'vol-007',
    name: 'media-storage',
    status: 'active',
    size: '3000GiB',
    type: '_DEFAULT_',
    diskTag: 'Media',
    bootable: false,
    access: 'Public',
  },
  {
    id: 'vol-008',
    name: 'cache-vol',
    status: 'active',
    size: '128GiB',
    type: 'SSD',
    diskTag: 'Cache',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-009',
    name: 'temp-storage',
    status: 'active',
    size: '64GiB',
    type: 'SSD',
    diskTag: 'Temp',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-010',
    name: 'shared-data',
    status: 'active',
    size: '500GiB',
    type: '_DEFAULT_',
    diskTag: 'Shared',
    bootable: false,
    access: 'Public',
  },
];

const mockAttachedInterfaces: AttachedInterface[] = [
  {
    id: 'iface-001',
    network: 'ens-server-03',
    port: '123984734',
    portStatus: 'Inactive',
    fixedIp: '10.0.0.6',
    macAddress: '10.0.0.2',
  },
  {
    id: 'iface-002',
    network: 'ens-server-02',
    port: '987654321',
    portStatus: 'Active',
    fixedIp: '10.0.0.5',
    macAddress: 'fa:16:3e:12:34:56',
  },
  {
    id: 'iface-003',
    network: 'private-network',
    port: '456789123',
    portStatus: 'Active',
    fixedIp: '192.168.1.10',
    macAddress: 'fa:16:3e:ab:cd:ef',
  },
];

const mockFloatingIPs: FloatingIP[] = [
  {
    id: 'fip-001',
    name: 'ens-server-04',
    status: 'active',
    floatingIp: '10.0.0.11',
    fixedIp: '10.0.0.11',
    createdAt: '2025-09-01',
  },
  {
    id: 'fip-002',
    name: 'public-ip-01',
    status: 'active',
    floatingIp: '192.168.1.100',
    fixedIp: '10.0.0.5',
    createdAt: '2025-08-15',
  },
  {
    id: 'fip-003',
    name: 'lb-frontend',
    status: 'shutoff',
    floatingIp: '172.16.0.50',
    fixedIp: '10.0.0.20',
    createdAt: '2025-07-20',
  },
];

const mockNetworkInterfaces: NetworkInterface[] = [
  { id: 'net-001', name: 'private-net', ip: '10.0.0.5' },
  { id: 'net-002', name: 'public-net', ip: '72.116.0.10' },
  { id: 'net-003', name: 'public-net', ip: '72.116.0.10' },
];

const mockSecurityGroups: SecurityGroup[] = [
  { id: 'sg-001', name: '00cc559f', description: '10.0.0.11' },
  { id: 'sg-002', name: 'default', description: 'Default security group' },
  { id: 'sg-003', name: 'web-servers', description: 'Web server security group' },
];


/* ----------------------------------------
   Instance Detail Page
   ---------------------------------------- */

export function InstanceDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [selectedNetworkInterface, setSelectedNetworkInterface] = useState(mockNetworkInterfaces[0]?.id || '');
  
  // In a real app, you would fetch the instance data based on the ID
  const instance = mockInstanceDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 ${sidebarOpen ? 'ml-[200px]' : 'ml-0'}`}>
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          showWindowControls={true}
        />

        {/* Top Bar with Breadcrumb Navigation */}
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
                { label: 'Instances List', href: '/instances' },
                { label: instance.name },
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

        {/* Page Content */}
        <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
          <VStack gap={6} className="min-w-[1176px]">
            {/* Instance Header Card */}
            <DetailHeader>
              <DetailHeader.Title>{instance.name}</DetailHeader.Title>
              
              <DetailHeader.Actions>
                <Button variant="secondary" size="sm" leftIcon={<IconTerminal2 size={12} />}>
                  Console
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
                  Start
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconPlayerStop size={12} />}>
                  Stop
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
                  Reboot
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                  Delete
                </Button>
                <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                  More Actions
                </Button>
              </DetailHeader.Actions>

              <DetailHeader.InfoGrid>
                <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                <DetailHeader.InfoCard label="ID" value={instance.id} copyable />
                <DetailHeader.InfoCard label="Host" value={instance.host} />
                <DetailHeader.InfoCard label="Created At" value={instance.createdAt} />
              </DetailHeader.InfoGrid>
            </DetailHeader>

            {/* Instance Tabs */}
            <div className="w-full">
              <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="md">
                <TabList className="gap-6">
                  <Tab value="details">Details</Tab>
                  <Tab value="volumes">Volumes</Tab>
                  <Tab value="interfaces">Interfaces</Tab>
                  <Tab value="floating-ips">Floating IPs</Tab>
                  <Tab value="security">Security</Tab>
                  <Tab value="snapshots">Instance Snapshots</Tab>
                  <Tab value="monitoring">Monitoring</Tab>
                  <Tab value="resource-map">Resource Map</Tab>
                  <Tab value="logs">Logs</Tab>
                  <Tab value="action-logs">Action Logs</Tab>
                </TabList>

                {/* Details Tab Panel */}
                <TabPanel value="details">
                  <VStack gap={4} className="pt-6">
                    {/* Basic Information */}
                    <SectionCard>
                      <SectionCard.Header 
                        title="Basic Information" 
                        actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={16} />}>Edit</Button>}
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Instance Name" value={instance.name} />
                        <SectionCard.DataRow label="Availability Zone" value={instance.availabilityZone} />
                        <SectionCard.DataRow label="Description" value={instance.description} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Flavor */}
                    <SectionCard>
                      <SectionCard.Header title="Flavor" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Flavor Name" 
                          value={instance.flavor.name} 
                          isLink 
                          linkHref="/flavors" 
                        />
                        <SectionCard.DataRow 
                          label="Spec" 
                          value={`vCPU : ${instance.flavor.vcpu} / RAM : ${instance.flavor.ram} / Disk : ${instance.flavor.disk} / GPU : ${instance.flavor.gpu}`} 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Image */}
                    <SectionCard>
                      <SectionCard.Header title="Image" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Image" 
                          value={instance.image} 
                          isLink 
                          linkHref="/images" 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Network */}
                    <SectionCard>
                      <SectionCard.Header title="Network" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Interfaces" 
                          value={`${instance.interfaces} connected`} 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Authentication */}
                    <SectionCard>
                      <SectionCard.Header title="Authentication" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Key Pair" 
                          value={instance.keyPair} 
                          isLink 
                          linkHref="/key-pairs" 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Advanced */}
                    <SectionCard>
                      <SectionCard.Header title="Advanced" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Server Group" 
                          value={instance.serverGroup} 
                          isLink 
                          linkHref="/server-groups" 
                        />
                        <SectionCard.DataRow 
                          label="User Data" 
                          value={instance.userData} 
                          isLink 
                          linkHref="#" 
                        />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>
                </TabPanel>

                {/* Volumes Tab Panel */}
                <TabPanel value="volumes" className="pt-0">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Volumes
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Attach Volume
                      </Button>
                    </div>

                    {/* Search */}
                    <SearchInput
                      placeholder="Find volume with filters"
                      size="sm"
                      className="w-[280px]"
                    />

                    {/* Pagination */}
                    <Pagination
                      currentPage={1}
                      totalPages={1}
                      totalItems={10}
                      onPageChange={() => {}}
                    />

                    {/* Table */}
                    <Table
                      columns={[
                        {
                          key: 'status',
                          label: 'Status',
                          width: '60px',
                          align: 'center',
                          render: (_, row: AttachedVolume) => (
                            <StatusIndicator status={row.status as any} layout="icon-only" />
                          ),
                        },
                        {
                          key: 'name',
                          label: 'Name',
                          sortable: true,
                          render: (value: string, row: AttachedVolume) => (
                            <Link
                              to={`/volumes/${row.id}`}
                              className="flex items-center gap-1.5 text-[var(--color-action-primary)] hover:underline"
                            >
                              {value}
                              <IconExternalLink size={12} />
                            </Link>
                          ),
                        },
                        {
                          key: 'size',
                          label: 'Size',
                          sortable: true,
                        },
                        {
                          key: 'type',
                          label: 'Type',
                          sortable: true,
                        },
                        {
                          key: 'diskTag',
                          label: 'Disk Tag',
                          sortable: true,
                        },
                        {
                          key: 'bootable',
                          label: 'Bootable',
                          render: (value: boolean) => (value ? 'Yes' : 'No'),
                        },
                        {
                          key: 'access',
                          label: 'Access',
                          sortable: true,
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center',
                          render: () => (
                            <button className="p-1.5 rounded hover:bg-[var(--color-surface-subtle)] transition-colors">
                              <IconDotsVertical size={16} className="text-[var(--color-text-default)]" />
                            </button>
                          ),
                        },
                      ]}
                      data={mockAttachedVolumes}
                      rowKey="id"
                    />
                  </VStack>
                </TabPanel>

                {/* Interfaces Tab Panel */}
                <TabPanel value="interfaces" className="pt-0">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Interfaces
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Attach Interface
                      </Button>
                    </div>

                    {/* Search */}
                    <SearchInput placeholder="Find Interface with filters" size="sm" className="w-[280px]" />

                    {/* Pagination */}
                    <Pagination currentPage={1} totalPages={5} totalItems={115} />

                    {/* Table */}
                    <Table
                      columns={[
                        {
                          key: 'network',
                          label: 'Network',
                          sortable: true,
                          render: (_value: string, iface: AttachedInterface) => (
                            <Link 
                              to={`/networks/${iface.id}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {iface.network}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'port',
                          label: 'Port',
                          sortable: true,
                          render: (_value: string, iface: AttachedInterface) => (
                            <Link 
                              to={`/ports/${iface.port}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {iface.port}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'portStatus',
                          label: 'Port Status',
                          render: (_value: string, iface: AttachedInterface) => (
                            <span className="text-[var(--color-text-default)]">{iface.portStatus}</span>
                          ),
                        },
                        {
                          key: 'fixedIp',
                          label: 'Fixed IP',
                          render: (_value: string, iface: AttachedInterface) => (
                            <span className="text-[var(--color-text-default)]">{iface.fixedIp}</span>
                          ),
                        },
                        {
                          key: 'macAddress',
                          label: 'Mac Address',
                          render: (_value: string, iface: AttachedInterface) => (
                            <span className="text-[var(--color-text-default)]">{iface.macAddress}</span>
                          ),
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center' as const,
                          render: () => (
                            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors">
                              <IconDotsVertical size={16} className="text-[var(--color-text-default)]" />
                            </button>
                          ),
                        },
                      ]}
                      data={mockAttachedInterfaces}
                      rowKey="id"
                    />
                  </VStack>
                </TabPanel>

                {/* Floating IPs Tab Panel */}
                <TabPanel value="floating-ips" className="pt-0">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Floating IPs
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Associate Floating IP
                      </Button>
                    </div>

                    {/* Search */}
                    <SearchInput placeholder="Find Floating IP with filters" size="sm" className="w-[280px]" />

                    {/* Pagination */}
                    <Pagination totalItems={115} itemsPerPage={10} currentPage={1} onPageChange={() => {}} />

                    {/* Table */}
                    <Table
                      columns={[
                        {
                          key: 'status',
                          label: 'Status',
                          width: '59px',
                          render: (_value: string, row: FloatingIP) => (
                            <StatusIndicator status={row.status} layout="icon-only" size="md" />
                          ),
                        },
                        {
                          key: 'name',
                          label: 'ID',
                          sortable: true,
                          render: (_value: string, row: FloatingIP) => (
                            <Link 
                              to={`/floating-ips/${row.id}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {row.name}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'floatingIp',
                          label: 'Floating IP',
                          sortable: true,
                        },
                        {
                          key: 'fixedIp',
                          label: 'Fixed IP',
                          sortable: true,
                        },
                        {
                          key: 'createdAt',
                          label: 'Created At',
                          sortable: true,
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center',
                          render: () => (
                            <Button variant="tertiary" size="sm" iconOnly>
                              <IconDotsVertical size={16} />
                            </Button>
                          ),
                        },
                      ]}
                      data={mockFloatingIPs}
                      rowKey="id"
                    />
                  </VStack>
                </TabPanel>

                {/* Security Tab Panel */}
                <TabPanel value="security" className="pt-0">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Security Groups
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Attach Security Group
                      </Button>
                    </div>

                    {/* Network Interface Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] rounded-lg">
                      {mockNetworkInterfaces.map((net) => (
                        <button
                          key={net.id}
                          onClick={() => setSelectedNetworkInterface(net.id)}
                          className={`
                            flex items-center justify-center min-w-[80px] px-3 py-2 rounded-md
                            text-[12px] font-medium leading-4 text-[var(--color-text-default)]
                            transition-colors
                            ${selectedNetworkInterface === net.id 
                              ? 'bg-[var(--color-surface-default)] border border-[var(--color-action-primary)]' 
                              : 'hover:bg-[var(--color-surface-default)]'
                            }
                          `}
                        >
                          {net.name}({net.ip})
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    <SearchInput placeholder="Find Security Group with filters" size="sm" className="w-[280px]" />

                    {/* Pagination */}
                    <Pagination currentPage={1} totalPages={5} totalItems={115} />

                    {/* Table */}
                    <Table
                      columns={[
                        {
                          key: 'name',
                          label: 'Security Group',
                          sortable: true,
                          render: (_value: string, row: SecurityGroup) => (
                            <Link 
                              to={`/security-groups/${row.id}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {row.name}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'description',
                          label: 'Description',
                          sortable: true,
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center' as const,
                          render: () => (
                            <Button variant="tertiary" size="sm" iconOnly>
                              <IconDotsVertical size={16} />
                            </Button>
                          ),
                        },
                      ]}
                      data={mockSecurityGroups}
                      rowKey="id"
                    />
                  </VStack>
                </TabPanel>

                {/* Instance Snapshots Tab Panel */}
                <TabPanel value="snapshots">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Instance Snapshots content will be displayed here.</p>
                  </div>
                </TabPanel>

                {/* Monitoring Tab Panel */}
                <TabPanel value="monitoring">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Monitoring content will be displayed here.</p>
                  </div>
                </TabPanel>

                {/* Resource Map Tab Panel */}
                <TabPanel value="resource-map">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Resource Map content will be displayed here.</p>
                  </div>
                </TabPanel>

                {/* Logs Tab Panel */}
                <TabPanel value="logs">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Logs content will be displayed here.</p>
                  </div>
                </TabPanel>

                {/* Action Logs Tab Panel */}
                <TabPanel value="action-logs">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Action Logs content will be displayed here.</p>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </VStack>
        </div>
      </main>
    </div>
  );
}

export default InstanceDetailPage;

