import { useState, useMemo, useEffect } from 'react';
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
  Modal,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconBell,
  IconExternalLink,
  IconAlertCircle,
  IconDownload,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PortStatus = 'active' | 'down' | 'build';

interface PortDetail {
  id: string;
  name: string;
  status: PortStatus;
  createdAt: string;
  description: string;
  portSecurity: boolean;
  // Network
  ownedNetwork: { name: string; id: string };
  subnet: { name: string; id: string };
  macAddress: string;
  // Attachments
  attachedTo: { name: string; id: string; type: 'instance' | 'router' } | null;
}

interface FixedIP {
  id: string;
  fixedIp: string;
  floatingIp: { address: string; id: string } | null;
  ownedSubnet: { name: string; id: string };
  createdAt: string;
}

interface AllowedAddressPair {
  id: string;
  ipAddress: string;
  macAddress: string;
}

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Port data map by ID - synced with PortsPage mock data
const mockPortsMap: Record<string, PortDetail> = {
  'port-001': {
    id: 'port-001',
    name: 'port-01',
    status: 'active',
    createdAt: '2025-09-15',
    description: '-',
    portSecurity: true,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:32',
    attachedTo: { name: 'web-01', id: 'inst-001', type: 'instance' },
  },
  'port-002': {
    id: 'port-002',
    name: 'port-02',
    status: 'active',
    createdAt: '2025-09-10',
    description: '-',
    portSecurity: true,
    ownedNetwork: { name: 'net-02', id: 'net-002' },
    subnet: { name: 'subnet-02', id: 'subnet-002' },
    macAddress: 'fa:16:3e:34:85:33',
    attachedTo: { name: 'app-server', id: 'inst-002', type: 'instance' },
  },
  'port-003': {
    id: 'port-003',
    name: 'port-03',
    status: 'down',
    createdAt: '2025-09-08',
    description: '-',
    portSecurity: true,
    ownedNetwork: { name: 'net-03', id: 'net-003' },
    subnet: { name: 'subnet-03', id: 'subnet-003' },
    macAddress: 'fa:16:3e:34:85:34',
    attachedTo: null,
  },
  'port-004': {
    id: 'port-004',
    name: 'db-port',
    status: 'active',
    createdAt: '2025-09-05',
    description: 'Database port',
    portSecurity: true,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:35',
    attachedTo: { name: 'db-server', id: 'inst-003', type: 'instance' },
  },
  'port-005': {
    id: 'port-005',
    name: 'router-port-1',
    status: 'active',
    createdAt: '2025-09-01',
    description: 'Router port',
    portSecurity: false,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:36',
    attachedTo: { name: 'main-router', id: 'router-001', type: 'router' },
  },
  'port-006': {
    id: 'port-006',
    name: 'lb-port',
    status: 'active',
    createdAt: '2025-08-28',
    description: 'Load balancer port',
    portSecurity: true,
    ownedNetwork: { name: 'net-02', id: 'net-002' },
    subnet: { name: 'subnet-02', id: 'subnet-002' },
    macAddress: 'fa:16:3e:34:85:37',
    attachedTo: { name: 'load-balancer-01', id: 'lb-001', type: 'instance' },
  },
  'port-007': {
    id: 'port-007',
    name: 'cache-port',
    status: 'active',
    createdAt: '2025-08-25',
    description: 'Cache port',
    portSecurity: true,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:38',
    attachedTo: { name: 'redis-01', id: 'inst-004', type: 'instance' },
  },
  'port-008': {
    id: 'port-008',
    name: 'monitor-port',
    status: 'build',
    createdAt: '2025-08-20',
    description: 'Monitoring port',
    portSecurity: true,
    ownedNetwork: { name: 'net-03', id: 'net-003' },
    subnet: { name: 'subnet-03', id: 'subnet-003' },
    macAddress: 'fa:16:3e:34:85:39',
    attachedTo: { name: 'prometheus', id: 'inst-005', type: 'instance' },
  },
  'port-009': {
    id: 'port-009',
    name: 'test-port',
    status: 'down',
    createdAt: '2025-08-15',
    description: 'Test port',
    portSecurity: true,
    ownedNetwork: { name: 'net-04', id: 'net-004' },
    subnet: { name: 'subnet-04', id: 'subnet-004' },
    macAddress: 'fa:16:3e:34:85:40',
    attachedTo: null,
  },
  'port-010': {
    id: 'port-010',
    name: 'vpn-port',
    status: 'active',
    createdAt: '2025-08-10',
    description: 'VPN port',
    portSecurity: true,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:41',
    attachedTo: { name: 'vpn-gateway', id: 'vpn-001', type: 'instance' },
  },
};

const defaultPortDetail: PortDetail = {
  id: 'unknown',
  name: 'Unknown Port',
  status: 'active',
  createdAt: '-',
  description: '-',
  portSecurity: false,
  ownedNetwork: { name: '-', id: '' },
  subnet: { name: '-', id: '' },
  macAddress: '-',
  attachedTo: null,
};

const mockFixedIPs: FixedIP[] = Array.from({ length: 115 }, (_, i) => ({
  id: `fixed-ip-${String(i + 1).padStart(3, '0')}`,
  fixedIp: `10.0.0.${5 + i}`,
  floatingIp: i % 3 === 0 ? { address: `10.0.0.${5 + i}`, id: '29tgj234' } : null,
  ownedSubnet: { name: 'subnet-01', id: '29tgj234' },
  createdAt: '2025-09-01',
}));

const mockAllowedAddressPairs: AllowedAddressPair[] = Array.from({ length: 115 }, (_, i) => ({
  id: `aap-${String(i + 1).padStart(3, '0')}`,
  ipAddress: `10.0.0.${5 + (i % 250)}`,
  macAddress: `fa:12:34:56:78:${String(90 + (i % 10)).padStart(2, '0')}`,
}));

const mockSecurityGroups: SecurityGroup[] = Array.from({ length: 115 }, (_, i) => ({
  id: '29tgj234',
  name: `10.0.0.${5 + (i % 250)}`,
  description: '-',
  createdAt: '2025-09-03',
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const portStatusMap: Record<PortStatus, 'active' | 'shutoff' | 'building'> = {
  active: 'active',
  down: 'shutoff',
  build: 'building',
};

/* ----------------------------------------
   PortDetailPage Component
   ---------------------------------------- */

export default function PortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedMac, setCopiedMac] = useState(false);

  // Fixed IPs tab state
  const [fixedIpSearchTerm, setFixedIpSearchTerm] = useState('');
  const [fixedIpCurrentPage, setFixedIpCurrentPage] = useState(1);
  const fixedIpsPerPage = 10;

  // Allowed Address Pairs tab state
  const [aapSearchTerm, setAapSearchTerm] = useState('');
  const [aapCurrentPage, setAapCurrentPage] = useState(1);
  const aapPerPage = 10;

  // Security tab state
  const [sgSearchTerm, setSgSearchTerm] = useState('');
  const [sgCurrentPage, setSgCurrentPage] = useState(1);
  const sgPerPage = 10;

  // Selection state
  const [selectedFixedIPs, setSelectedFixedIPs] = useState<string[]>([]);
  const [selectedAaps, setSelectedAaps] = useState<string[]>([]);
  const [selectedSgs, setSelectedSgs] = useState<string[]>([]);

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Detach security group modal state
  const [detachModalOpen, setDetachModalOpen] = useState(false);
  const [securityGroupToDetach, setSecurityGroupToDetach] = useState<SecurityGroup | null>(null);

  // Get port data based on URL ID
  const port = id ? mockPortsMap[id] || defaultPortDetail : defaultPortDetail;
  const fixedIPs = mockFixedIPs;
  const allowedAddressPairs = mockAllowedAddressPairs;
  const securityGroups = mockSecurityGroups;

  // Update tab label to port name
  useEffect(() => {
    if (port.name) {
      updateActiveTabLabel(port.name);
    }
  }, [port.name, updateActiveTabLabel]);

  // Filter and paginate Fixed IPs
  const filteredFixedIPs = useMemo(() => {
    return fixedIPs.filter(
      (ip) =>
        ip.fixedIp.toLowerCase().includes(fixedIpSearchTerm.toLowerCase()) ||
        ip.ownedSubnet.name.toLowerCase().includes(fixedIpSearchTerm.toLowerCase()) ||
        (ip.floatingIp?.address.toLowerCase().includes(fixedIpSearchTerm.toLowerCase()) ?? false)
    );
  }, [fixedIPs, fixedIpSearchTerm]);

  const totalFixedIpPages = Math.ceil(filteredFixedIPs.length / fixedIpsPerPage);

  const paginatedFixedIPs = useMemo(() => {
    const start = (fixedIpCurrentPage - 1) * fixedIpsPerPage;
    return filteredFixedIPs.slice(start, start + fixedIpsPerPage);
  }, [filteredFixedIPs, fixedIpCurrentPage, fixedIpsPerPage]);

  // Filter and paginate Allowed Address Pairs
  const filteredAaps = useMemo(() => {
    return allowedAddressPairs.filter(
      (aap) =>
        aap.ipAddress.toLowerCase().includes(aapSearchTerm.toLowerCase()) ||
        aap.macAddress.toLowerCase().includes(aapSearchTerm.toLowerCase())
    );
  }, [allowedAddressPairs, aapSearchTerm]);

  const totalAapPages = Math.ceil(filteredAaps.length / aapPerPage);

  const paginatedAaps = useMemo(() => {
    const start = (aapCurrentPage - 1) * aapPerPage;
    return filteredAaps.slice(start, start + aapPerPage);
  }, [filteredAaps, aapCurrentPage, aapPerPage]);

  // Filter and paginate Security groups
  const filteredSgs = useMemo(() => {
    return securityGroups.filter(
      (sg) =>
        sg.name.toLowerCase().includes(sgSearchTerm.toLowerCase()) ||
        sg.description.toLowerCase().includes(sgSearchTerm.toLowerCase())
    );
  }, [securityGroups, sgSearchTerm]);

  const totalSgPages = Math.ceil(filteredSgs.length / sgPerPage);

  const paginatedSgs = useMemo(() => {
    const start = (sgCurrentPage - 1) * sgPerPage;
    return filteredSgs.slice(start, start + sgPerPage);
  }, [filteredSgs, sgCurrentPage, sgPerPage]);

  // Fixed IP columns
  const fixedIpColumns: TableColumn<FixedIP>[] = [
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      render: (_, row) =>
        row.floatingIp ? (
          <Link
            to={`/compute-admin/floating-ips/${row.floatingIp.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.floatingIp.address}
          </Link>
        ) : (
          <span className="text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'ownedSubnet',
      label: 'Owned subnet',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/subnets/${row.ownedSubnet.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.ownedSubnet.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            ID : {row.ownedSubnet.id}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: FixedIP) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
              onClick={() => console.log('Delete fixed IP', row.id)}
            >
              <IconTrash size={16} stroke={1.5} className="text-[var(--color-state-danger)]" />
            </button>
          </div>
        );
      },
    },
  ];

  // Allowed Address Pairs columns
  const aapColumns: TableColumn<AllowedAddressPair>[] = [
    {
      key: 'ipAddress',
      label: 'IP Address',
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
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: AllowedAddressPair) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
              onClick={() => console.log('Delete address pair', row.id)}
            >
              <IconTrash size={16} stroke={1.5} className="text-[var(--color-state-danger)]" />
            </button>
          </div>
        );
      },
    },
  ];

  // Security groups columns
  const sgColumns: TableColumn<SecurityGroup>[] = [
    {
      key: 'name',
      label: 'Security group',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/security-groups/${row.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
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
      key: 'description',
      label: 'Description',
      flex: 1,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
    },
  ];

  const handleDetachSecurityGroup = () => {
    if (securityGroupToDetach) {
      console.log('Detaching security group', securityGroupToDetach.id, 'from port', port.id);
      // API call would go here
      setDetachModalOpen(false);
      setSecurityGroupToDetach(null);
    }
  };

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/' },
    { label: 'Ports', href: '/compute-admin/ports' },
    { label: port.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleCopyMac = () => {
    navigator.clipboard.writeText(port.macAddress);
    setCopiedMac(true);
    setTimeout(() => setCopiedMac(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(port.id);
  };

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
            tabs={tabBarTabs}
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
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Main Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={8} className="min-w-[1176px]">
              {/* Header Card */}
              <DetailHeader>
                {/* Title */}
                <h1 className="text-heading-h5 text-[var(--color-text-default)] leading-6 mb-3">
                  {port.name}
                </h1>

                {/* Actions */}
                <div className="flex items-center gap-1 mb-3">
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </div>

                {/* Info Cards */}
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={port.status.charAt(0).toUpperCase() + port.status.slice(1)}
                    status={portStatusMap[port.status]}
                  />
                  <DetailHeader.InfoCard
                    label="ID"
                    value={port.id}
                    copyable
                    onCopy={handleCopyId}
                  />
                  <DetailHeader.InfoCard label="Tenant" value="tenantA" />
                  <DetailHeader.InfoCard label="Admin State" value="Up" />
                  <DetailHeader.InfoCard
                    label="Port security"
                    value={port.portSecurity ? 'On' : 'Off'}
                  />
                  <DetailHeader.InfoCard label="Created at" value={port.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="fixed-ips">Fixed IPs</Tab>
                    {port.status === 'active' && (
                      <Tab value="allowed-address-pairs">Allowed Address Pairs</Tab>
                    )}
                    {port.status === 'active' && <Tab value="security">Security Groups</Tab>}
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
                          <SectionCard.DataRow label="Port name" value={port.name} />
                          <SectionCard.DataRow label="Description" value={port.description} />
                          <SectionCard.DataRow label="Admin State" value="Up" />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Owned Network */}
                      <SectionCard>
                        <SectionCard.Header title="Owned Network" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Network"
                            value={
                              <Link
                                to={`/compute-admin/networks/${port.ownedNetwork.id}`}
                                className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                              >
                                {port.ownedNetwork.name}
                              </Link>
                            }
                          />
                          <SectionCard.DataRow label="MAC Address" value={port.macAddress} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Attachments */}
                      <SectionCard>
                        <SectionCard.Header title="Attachments" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Bind Device Type"
                            value={
                              port.attachedTo
                                ? port.attachedTo.type === 'instance'
                                  ? 'Instance'
                                  : 'Router'
                                : '-'
                            }
                          />
                          <SectionCard.DataRow
                            label="Bind Device"
                            value={
                              port.attachedTo ? (
                                <Link
                                  to={
                                    port.attachedTo.type === 'instance'
                                      ? `/instances/${port.attachedTo.id}`
                                      : `/routers/${port.attachedTo.id}`
                                  }
                                  className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {port.attachedTo.name}
                                </Link>
                              ) : (
                                '-'
                              )
                            }
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Fixed IPs Tab */}
                  <TabPanel value="fixed-ips" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                          Fixed IPs
                        </h3>
                      </div>

                      {/* Search */}
                      <div className="flex items-center gap-1">
                        <div className="w-[var(--search-input-width)]">
                          <SearchInput
                            value={fixedIpSearchTerm}
                            onChange={(e) => {
                              setFixedIpSearchTerm(e.target.value);
                              setFixedIpCurrentPage(1);
                            }}
                            placeholder="Search fixed IP by attributes"
                          />
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          iconOnly
                          icon={<IconDownload size={12} />}
                          aria-label="Download"
                        />
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2">
                        <Pagination
                          currentPage={fixedIpCurrentPage}
                          totalPages={totalFixedIpPages}
                          onPageChange={setFixedIpCurrentPage}
                          totalItems={filteredFixedIPs.length}
                          selectedCount={selectedFixedIPs.length}
                        />
                      </div>

                      {/* Table */}
                      <Table columns={fixedIpColumns} data={paginatedFixedIPs} rowKey="id" />
                    </VStack>
                  </TabPanel>

                  {/* Allowed Address Pairs Tab */}
                  {port.status === 'active' && (
                    <TabPanel value="allowed-address-pairs" className="pt-0">
                      <VStack gap={4} className="pt-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                            Allowed Address Pairs
                          </h3>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-1">
                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              value={aapSearchTerm}
                              onChange={(e) => {
                                setAapSearchTerm(e.target.value);
                                setAapCurrentPage(1);
                              }}
                              placeholder="Search address pair by attributes"
                            />
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            iconOnly
                            icon={<IconDownload size={12} />}
                            aria-label="Download"
                          />
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                          <Pagination
                            currentPage={aapCurrentPage}
                            totalPages={totalAapPages}
                            onPageChange={setAapCurrentPage}
                            totalItems={filteredAaps.length}
                            selectedCount={selectedAaps.length}
                          />
                        </div>

                        {/* Table */}
                        <Table columns={aapColumns} data={paginatedAaps} rowKey="id" />
                      </VStack>
                    </TabPanel>
                  )}

                  {/* Security Tab */}
                  {port.status === 'active' && (
                    <TabPanel value="security" className="pt-0">
                      <VStack gap={4} className="pt-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                            Security groups
                          </h3>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-1">
                          <div className="w-[var(--search-input-width)]">
                            <SearchInput
                              value={sgSearchTerm}
                              onChange={(e) => {
                                setSgSearchTerm(e.target.value);
                                setSgCurrentPage(1);
                              }}
                              placeholder="Search security group by attributes"
                            />
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            iconOnly
                            icon={<IconDownload size={12} />}
                            aria-label="Download"
                          />
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                          <Pagination
                            currentPage={sgCurrentPage}
                            totalPages={totalSgPages}
                            onPageChange={setSgCurrentPage}
                            totalItems={filteredSgs.length}
                            selectedCount={selectedSgs.length}
                          />
                        </div>

                        {/* Table */}
                        <Table columns={sgColumns} data={paginatedSgs} rowKey="id" />
                      </VStack>
                    </TabPanel>
                  )}
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>

      {/* Detach Security group Modal */}
      <Modal
        isOpen={detachModalOpen}
        onClose={() => {
          setDetachModalOpen(false);
          setSecurityGroupToDetach(null);
        }}
        title="Detach security group"
        description="This action detaches the security group from the port."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Port Info */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">Port</span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {port.name}
            </span>
          </div>

          {/* Security group Info */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
              Security group
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {securityGroupToDetach?.name || '-'}
            </span>
          </div>

          {/* Warning Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-body-sm text-[var(--color-text-default)] leading-4">
              Detaching this security group may affect network access for the port.
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setDetachModalOpen(false);
              setSecurityGroupToDetach(null);
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleDetachSecurityGroup}
            className="flex-1"
          >
            Detach
          </Button>
        </div>
      </Modal>
    </div>
  );
}
