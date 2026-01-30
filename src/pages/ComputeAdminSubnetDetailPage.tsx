import { useState, useEffect } from 'react';
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
  Badge,
  Tooltip,
  fixedColumns,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconTrash, IconBell, IconCube, IconRouter } from '@tabler/icons-react';

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
  // Basic information
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
  securityGroups: string[];
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
  adminState: 'Up' | 'Down';
  createdAt: string;
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
  // Basic information
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
  'subnet-002': {
    ...mockSubnetDetail,
    id: 'subnet-002',
    name: 'subnet-2',
    cidr: '192.168.3.0/24',
    gatewayIp: '192.168.3.1',
  },
  'subnet-003': {
    ...mockSubnetDetail,
    id: 'subnet-003',
    name: 'subnet-3',
    cidr: '192.168.4.0/24',
    gatewayIp: '192.168.4.1',
  },
};

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: 'port',
  status: ['active', 'down', 'build'][i % 3] as PortStatus,
  attachedTo: {
    name: 'my-server',
    id: '12345678',
    type: i % 5 === 0 ? 'router' : 'instance',
  },
  securityGroups: ['default', 'web-sg', 'db-sg', 'app-sg'].slice(0, (i % 4) + 1),
  fixedIp: '10.70.0.48',
  floatingIp: i % 3 === 0 ? '' : '-',
  macAddress: 'fa:16:3e:77:62:19',
  adminState: i % 7 === 0 ? 'Down' : 'Up',
  createdAt: 'Dec 15, 2025',
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const portStatusMap: Record<PortStatus, 'active' | 'error' | 'shutoff' | 'building'> = {
  active: 'active',
  down: 'shutoff',
  build: 'building',
};

/* ----------------------------------------
   SubnetDetailPage Component
   ---------------------------------------- */

export default function SubnetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

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

  // Update tab label to match the subnet name (most recent breadcrumb)
  useEffect(() => {
    if (subnet?.name) {
      updateActiveTabLabel(subnet.name);
    }
  }, [subnet?.name, updateActiveTabLabel]);

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/' },
    { label: 'Networks', href: '/compute-admin/networks' },
    { label: subnet.network.name, href: `/networks/${subnet.network.id}` },
    { label: subnet.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
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
    (port) =>
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
      label: 'Attached To',
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
                ID: {row.attachedTo.id}
              </span>
            </div>
            <Tooltip
              content={row.attachedTo.type === 'router' ? 'Router' : 'Instance'}
              position="top"
              delay={0}
            >
              <div className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-1">
                {row.attachedTo.type === 'router' ? (
                  <IconRouter size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                ) : (
                  <IconCube size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
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
      render: (_, row) => (
        <span className="text-[var(--color-text-default)]">
          {row.securityGroups[0]}
          {row.securityGroups.length > 1 && ` (+${row.securityGroups.length - 1})`}
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
      render: (_, row) => (
        <span className="text-[var(--color-text-default)]">{row.floatingIp || '-'}</span>
      ),
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
      flex: 1,
    },
    {
      key: 'adminState',
      label: 'Admin State',
      flex: 1,
      render: (_, row) => (
        <Badge variant={row.adminState === 'Up' ? 'success' : 'error'} size="sm">
          {row.adminState}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_: unknown, row: Port) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            onClick={() => console.log('Delete port', row.id)}
          >
            <IconTrash size={16} stroke={1.5} className="text-[var(--color-state-danger)]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
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
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={8} className="min-w-[1176px]">
              {/* Detail header */}
              <DetailHeader>
                <DetailHeader.Title>{subnet.name}</DetailHeader.Title>

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
                    label="ID"
                    value={subnet.id}
                    copyable
                    onCopy={handleCopyId}
                    className="flex-1"
                  />
                  <DetailHeader.InfoCard label="CIDR" value={subnet.cidr} className="flex-1" />
                  <DetailHeader.InfoCard
                    label="Gateway IP"
                    value={subnet.gatewayIp}
                    className="flex-1"
                  />
                  <DetailHeader.InfoCard
                    label="Created at"
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
                          <SectionCard.DataRow label="Subnet name" value={subnet.name} />
                          <SectionCard.DataRow label="CIDR" value={subnet.cidr} />
                          <SectionCard.DataRow label="Gateway IP" value={subnet.gatewayIp} />
                          <SectionCard.DataRow label="DHCP" value={subnet.dhcp ? 'On' : 'Off'} />
                          <SectionCard.DataRow
                            label="Allocation pools"
                            value={subnet.allocationPools}
                          />
                          <SectionCard.DataRow label="Host routes" value={subnet.hostRoutes} />
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
                                to={`/compute-admin/networks/${subnet.network.id}`}
                                className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                              >
                                {subnet.network.name}
                              </Link>
                            }
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Ports Tab */}
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
                        selectable
                        selectedKeys={selectedPorts}
                        onSelectionChange={setSelectedPorts}
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
