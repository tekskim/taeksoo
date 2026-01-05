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
  StatusIndicator,
  Table,
  SearchInput,
  Pagination,
  ContextMenu,
  Modal,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconBell,
  IconChevronDown,
  IconExternalLink,
  IconCopy,
  IconPlug,
  IconLink,
  IconDotsCircleHorizontal,
  IconCirclePlus,
  IconSettings,
  IconAlertCircle,
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

const mockPortDetail: PortDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'port-01',
  status: 'active',
  createdAt: '2025-07-25 09:12:20',
  description: '-',
  portSecurity: true,
  // Network
  ownedNetwork: { name: 'web-server-10', id: 'network-001' },
  subnet: { name: 'subnet-01 (+3)', id: 'subnet-001' },
  macAddress: 'fa:16:3e:60:f8:46',
  // Attachments
  attachedTo: { name: 'web-server-10', id: 'inst-001', type: 'instance' },
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
  'active': 'active',
  'down': 'shutoff',
  'build': 'building',
};

/* ----------------------------------------
   PortDetailPage Component
   ---------------------------------------- */

export default function PortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  
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

  // In a real app, fetch based on id
  const port = mockPortDetail;
  const fixedIPs = mockFixedIPs;
  const allowedAddressPairs = mockAllowedAddressPairs;
  const securityGroups = mockSecurityGroups;

  // Filter and paginate Fixed IPs
  const filteredFixedIPs = useMemo(() => {
    return fixedIPs.filter((ip) =>
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
    return allowedAddressPairs.filter((aap) =>
      aap.ipAddress.toLowerCase().includes(aapSearchTerm.toLowerCase()) ||
      aap.macAddress.toLowerCase().includes(aapSearchTerm.toLowerCase())
    );
  }, [allowedAddressPairs, aapSearchTerm]);

  const totalAapPages = Math.ceil(filteredAaps.length / aapPerPage);

  const paginatedAaps = useMemo(() => {
    const start = (aapCurrentPage - 1) * aapPerPage;
    return filteredAaps.slice(start, start + aapPerPage);
  }, [filteredAaps, aapCurrentPage, aapPerPage]);

  // Filter and paginate Security Groups
  const filteredSgs = useMemo(() => {
    return securityGroups.filter((sg) =>
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
      render: (_, row) => row.floatingIp ? (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/floating-ips/${row.floatingIp.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.floatingIp.address}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.floatingIp.id}
          </span>
        </div>
      ) : (
        <span className="text-[var(--color-text-subtle)]">-</span>
      ),
    },
    {
      key: 'ownedSubnet',
      label: 'Owned Subnet',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/subnets/${row.ownedSubnet.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.ownedSubnet.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.ownedSubnet.id}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_: unknown, row: FixedIP) => {
        const fixedIpMenuItems: ContextMenuItem[] = [
          { id: 'disassociate-floating-ip', label: 'Disassociate floating IP', status: 'danger', onClick: () => console.log('Disassociate floating IP', row.id) },
          { id: 'release-fixed-ip', label: 'Release fixed IP', status: 'danger', onClick: () => console.log('Release fixed IP', row.id) },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={fixedIpMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
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
      width: '72px',
      align: 'center',
      render: (_: unknown, row: AllowedAddressPair) => {
        const pairMenuItems: ContextMenuItem[] = [
          { id: 'delete', label: 'Delete', status: 'danger', onClick: () => console.log('Delete address pair', row.id) },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={pairMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Security Groups columns
  const sgColumns: TableColumn<SecurityGroup>[] = [
    {
      key: 'name',
      label: 'Security Group',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/security-groups/${row.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
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
      key: 'description',
      label: 'Description',
      flex: 1,
      sortable: true,
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
      width: '72px',
      align: 'center',
      render: (_: unknown, row: SecurityGroup) => {
        const sgMenuItems: ContextMenuItem[] = [
          { 
            id: 'detach', 
            label: 'Detach', 
            status: 'danger', 
            onClick: () => {
              setSecurityGroupToDetach(row);
              setDetachModalOpen(true);
            }
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={sgMenuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
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
    { label: 'Proj-1', href: '/' },
    { label: 'Ports', href: '/ports' },
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
              {/* Header Card */}
              <DetailHeader>
                {/* Title */}
                <h1 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6 mb-3">
                  {port.name}
                </h1>

                {/* Actions */}
                <div className="flex items-center gap-1 mb-3">
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                  <ContextMenu
                    items={[
                      { label: 'Attach instance', onClick: () => {} },
                      { label: 'Detach instance', onClick: () => {} },
                      { label: 'Associate floating IP', onClick: () => {} },
                      { label: 'Disassociate floating IP', onClick: () => {} },
                      { label: 'Allocate IP', onClick: () => {} },
                      { label: 'Manage security groups', onClick: () => {} },
                      { label: 'Create allowed address pair', onClick: () => {} },
                    ]}
                    trigger="click"
                  >
                    <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                      More Actions
                    </Button>
                  </ContextMenu>
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
                  <DetailHeader.InfoCard
                    label="Port Security"
                    value={port.portSecurity ? 'On' : 'Off'}
                  />
                  <DetailHeader.InfoCard
                    label="Created At"
                    value={port.createdAt}
                  />
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
                    {port.status === 'active' && (
                      <Tab value="security">Security</Tab>
                    )}
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
                          <SectionCard.DataRow label="Port Name" value={port.name} />
                          <SectionCard.DataRow label="Description" value={port.description} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Network */}
                      <SectionCard>
                        <SectionCard.Header title="Network" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Owned Network"
                            value={
                              <Link
                                to={`/networks/${port.ownedNetwork.id}`}
                                className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                              >
                                {port.ownedNetwork.name}
                                <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                              </Link>
                            }
                          />
                          <SectionCard.DataRow
                            label="Subnet"
                            value={port.subnet.name}
                          />
                          <SectionCard.DataRow
                            label="MAC Address"
                            value={
                              <div className="flex items-center gap-2">
                                <span>{port.macAddress}</span>
                                <button
                                  onClick={handleCopyMac}
                                  className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  title={copiedMac ? 'Copied!' : 'Copy MAC Address'}
                                >
                                  <IconCopy size={12} stroke={1.5} className="text-[var(--color-action-primary)]" />
                                </button>
                              </div>
                            }
                          />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Attachments */}
                      <SectionCard>
                        <SectionCard.Header title="Attachments" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Attached To"
                            value={
                              port.attachedTo ? (
                                <Link
                                  to={port.attachedTo.type === 'instance' 
                                    ? `/instances/${port.attachedTo.id}` 
                                    : `/routers/${port.attachedTo.id}`
                                  }
                                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {port.attachedTo.name}
                                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
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
                  <TabPanel value="fixed-ips">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Fixed IPs
                        </h3>
                        <div className="flex items-center gap-1">
                          <Button variant="secondary" size="sm">
                            Allocate IP
                          </Button>
                          <Button variant="secondary" size="sm">
                            Associate Floating IP
                          </Button>
                        </div>
                      </div>

                      {/* Search */}
                      <div className="w-[280px]">
                        <SearchInput
                          value={fixedIpSearchTerm}
                          onChange={(e) => {
                            setFixedIpSearchTerm(e.target.value);
                            setFixedIpCurrentPage(1);
                          }}
                          placeholder="Find fixed IP with filters"
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
                          showSettings
                          onSettingsClick={() => setIsPreferencesOpen(true)}
                        />
                      </div>

                      {/* Table */}
                      <Table
                        columns={fixedIpColumns}
                        data={paginatedFixedIPs}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>

                  {/* Allowed Address Pairs Tab */}
                  {port.status === 'active' && (
                  <TabPanel value="allowed-address-pairs">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Allowed Address Pairs
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Create Allowed Address Pair
                        </Button>
                      </div>

                      {/* Search */}
                      <div className="w-[280px]">
                        <SearchInput
                          value={aapSearchTerm}
                          onChange={(e) => {
                            setAapSearchTerm(e.target.value);
                            setAapCurrentPage(1);
                          }}
                          placeholder="Find address pair with filters"
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
                          showSettings
                          onSettingsClick={() => setIsPreferencesOpen(true)}
                        />
                      </div>

                      {/* Table */}
                      <Table
                        columns={aapColumns}
                        data={paginatedAaps}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>
                  )}

                  {/* Security Tab */}
                  {port.status === 'active' && (
                  <TabPanel value="security">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Security Groups
                        </h3>
                        <Button variant="secondary" size="sm">
                          Manage Security Group
                        </Button>
                      </div>

                      {/* Search */}
                      <div className="w-[280px]">
                        <SearchInput
                          value={sgSearchTerm}
                          onChange={(e) => {
                            setSgSearchTerm(e.target.value);
                            setSgCurrentPage(1);
                          }}
                          placeholder="Find security group with filters"
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
                          showSettings
                          onSettingsClick={() => setIsPreferencesOpen(true)}
                        />
                      </div>

                      {/* Table */}
                      <Table
                        columns={sgColumns}
                        data={paginatedSgs}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>
                  )}
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>

      {/* Detach Security Group Modal */}
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
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] font-medium leading-4">
              Port
            </span>
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] leading-4">
              {port.name}
            </span>
          </div>
          
          {/* Security Group Info */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] font-medium leading-4">
              Security group
            </span>
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] leading-4">
              {securityGroupToDetach?.name || '-'}
            </span>
          </div>
          
          {/* Warning Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] leading-4">
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

