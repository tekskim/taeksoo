import { useState } from 'react';
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
  SearchInput,
  Pagination,
  StatusIndicator,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconBell,
  IconCopy,
  IconExternalLink,
  IconDotsCircleHorizontal,
  IconServer,
  IconRouter,
} from '@tabler/icons-react';
import { Tooltip } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PortStatus = 'active' | 'down' | 'build';

interface SubnetDetail {
  id: string;
  name: string;
  cidr: string;
  gatewayIp: string;
  createdAt: string;
  // Basic Information
  allocationPools: string;
  dhcp: boolean;
  dns: string;
  hostRoutes: string;
  // Network
  network: {
    name: string;
    id: string;
  };
}

interface Port {
  id: string;
  name: string;
  status: PortStatus;
  attachedTo: {
    name: string;
    id: string;
    type: 'instance' | 'router';
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

const mockSubnetDetail: SubnetDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'subnet-1',
  cidr: '192.168.2.0/24',
  gatewayIp: '192.168.2.1',
  createdAt: '2025-07-25 09:12:20',
  // Basic Information
  allocationPools: '192.168.2.2 - 192.168.2.254',
  dhcp: true,
  dns: '-',
  hostRoutes: '-',
  // Network
  network: {
    name: 'web-server-10',
    id: 'net-001',
  },
};

// Mock subnet database for different subnet IDs
const mockSubnets: Record<string, SubnetDetail> = {
  '29tg234000': mockSubnetDetail,
  'subnet-001': mockSubnetDetail,
  'subnet-002': { ...mockSubnetDetail, id: 'subnet-002', name: 'subnet-2', cidr: '192.168.3.0/24', gatewayIp: '192.168.3.1' },
  'subnet-003': { ...mockSubnetDetail, id: 'subnet-003', name: 'subnet-3', cidr: '192.168.4.0/24', gatewayIp: '192.168.4.1' },
};

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `port-${String(i + 1).padStart(2, '0')}`,
  status: ['active', 'down', 'build'][i % 3] as PortStatus,
  attachedTo: {
    name: `web-${String(i + 1).padStart(2, '0')}`,
    id: `29tgj${String(i).padStart(3, '0')}`,
    type: i % 5 === 0 ? 'router' : 'instance',
  },
  ownedNetwork: {
    name: 'net-01',
    id: '29ttgj234',
  },
  securityGroups: ['default-sg', 'web-sg', 'db-sg', 'app-sg', 'monitor-sg'].slice(0, (i % 5) + 1),
  fixedIp: `10760.${91 + (i % 10)}`,
  floatingIp: `10765.${39 + (i % 10)}`,
  macAddress: `fa:16:3e:34:85:${String(32 + (i % 50)).padStart(2, '0')}`,
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const portStatusMap: Record<PortStatus, 'active' | 'error' | 'shutoff' | 'building'> = {
  'active': 'active',
  'down': 'shutoff',
  'build': 'building',
};

/* ----------------------------------------
   SubnetDetailPage Component
   ---------------------------------------- */

export default function SubnetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedId, setCopiedId] = useState(false);

  // Ports tab state
  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const portsPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // In a real app, fetch based on id
  const subnet = id && mockSubnets[id] ? mockSubnets[id] : mockSubnetDetail;

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Networks', href: '/compute/networks' },
    { label: subnet.network.name, href: `/networks/${subnet.network.id}` },
    { label: subnet.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleCopyId = () => {
    navigator.clipboard.writeText(subnet.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Ports filtering and pagination
  const filteredPorts = mockPorts.filter(
    port =>
      port.name.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
      port.macAddress.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
      port.fixedIp.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
      (port.attachedTo?.name.toLowerCase().includes(portSearchTerm.toLowerCase()) ?? false)
  );

  const totalPortPages = Math.ceil(filteredPorts.length / portsPerPage);
  const paginatedPorts = filteredPorts.slice(
    (portCurrentPage - 1) * portsPerPage,
    portCurrentPage * portsPerPage
  );

  // Port columns
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
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/ports/${row.id}`}
            className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            Action
          </span>
        </div>
      ),
    },
    {
      key: 'attachedTo',
      label: 'Attached To',
      flex: 1,
      render: (_, row) => row.attachedTo ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <Link
              to={row.attachedTo.type === 'router' ? `/routers/${row.attachedTo.id}` : `/instances/${row.attachedTo.id}`}
              className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.attachedTo.name}
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            </Link>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              ID : {row.attachedTo.id}
            </span>
          </div>
          <Tooltip content={row.attachedTo.type === 'router' ? 'Router' : 'Instance'} position="top" delay={0}>
            <div className="flex items-center justify-center p-1 border border-[var(--color-border-default)] rounded bg-[var(--color-surface-default)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors">
              {row.attachedTo.type === 'router' ? (
                <IconRouter size={12} className="text-[var(--color-text-subtle)]" />
              ) : (
                <IconServer size={12} className="text-[var(--color-text-subtle)]" />
              )}
            </div>
          </Tooltip>
        </div>
      ) : (
        <span className="text-[var(--color-text-muted)]">-</span>
      ),
    },
    {
      key: 'ownedNetwork',
      label: 'Owned Network',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/networks/${row.ownedNetwork.id}`}
            className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.ownedNetwork.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.ownedNetwork.id}
          </span>
        </div>
      ),
    },
    {
      key: 'securityGroups',
      label: 'SG',
      flex: 1,
      render: (_, row) => (
        <span className="text-[var(--color-text-default)]">
          {row.securityGroups[0]}
          {row.securityGroups.length > 1 && (
            <span className="text-[var(--color-text-subtle)]"> (+{row.securityGroups.length - 1})</span>
          )}
        </span>
      ),
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
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
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

          {/* Top Bar */}
          <TopBar
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                onClick={() => {}}
                hasNotification
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px] max-w-[1320px]">
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>{subnet.name}</DetailHeader.Title>

                <DetailHeader.Actions>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconEdit size={12} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                  >
                    Delete
                  </Button>
                </DetailHeader.Actions>

                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="ID"
                    value={subnet.id}
                    copyable
                    onCopy={handleCopyId}
                    className="flex-1"
                  />
                  <DetailHeader.InfoCard
                    label="CIDR"
                    value={subnet.cidr}
                    className="flex-1"
                  />
                  <DetailHeader.InfoCard
                    label="Gateway IP"
                    value={subnet.gatewayIp}
                    className="flex-1"
                  />
                  <DetailHeader.InfoCard
                    label="Created At"
                    value={subnet.createdAt}
                    className="flex-1"
                  />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="ports">Ports</Tab>
                  </TabList>

                  {/* Details Tab */}
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
                          <SectionCard.DataRow label="Subnet Name" value={subnet.name} />
                          <SectionCard.DataRow label="CIDR" value={subnet.cidr} />
                          <SectionCard.DataRow label="Gateway IP" value={subnet.gatewayIp} />
                          <SectionCard.DataRow label="Allocation Pools" value={subnet.allocationPools} />
                          <SectionCard.DataRow label="DHCP" value={subnet.dhcp ? 'On' : 'Off'} />
                          <SectionCard.DataRow label="DNS" value={subnet.dns} />
                          <SectionCard.DataRow label="Host Routes" value={subnet.hostRoutes} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Network */}
                      <SectionCard>
                        <SectionCard.Header title="Network" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Network"
                            value={
                              <Link
                                to={`/networks/${subnet.network.id}`}
                                className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                              >
                                {subnet.network.name}
                                <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                              </Link>
                            }
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Ports Tab */}
                  <TabPanel value="ports">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Ports
                        </h3>
                      </div>

                      {/* Search */}
                      <div className="w-[280px]">
                        <SearchInput
                          value={portSearchTerm}
                          onChange={(e) => {
                            setPortSearchTerm(e.target.value);
                            setPortCurrentPage(1);
                          }}
                          placeholder="Find port with filters"
                        />
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

