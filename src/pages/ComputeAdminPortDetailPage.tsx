import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Button,
  VStack,
  PageShell,
  TabBar,
  TopBar,
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
  fixedColumns,
  InlineMessage,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTrash,
  IconExternalLink,
  IconDownload,
  IconCirclePlus,
  IconSettings,
} from '@tabler/icons-react';
import { InlineCopyId } from '@/components/InlineCopyId';

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
    createdAt: 'Sep 15, 2026 09:18:42',
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
    createdAt: 'Sep 10, 2026 14:35:27',
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
    createdAt: 'Sep 8, 2026 11:51:27',
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
    createdAt: 'Sep 5, 2026 14:12:36',
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
    createdAt: 'Sep 1, 2026 10:20:28',
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
    createdAt: 'Aug 28, 2026 07:11:07',
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
    createdAt: 'Aug 25, 2026 10:32:16',
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
    createdAt: 'Aug 20, 2026 23:27:51',
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
    createdAt: 'Aug 15, 2026 12:22:26',
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
    createdAt: 'Aug 10, 2026 01:17:01',
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

const mockAllowedAddressPairs: AllowedAddressPair[] = Array.from({ length: 115 }, (_, i) => ({
  id: `aap-${String(i + 1).padStart(3, '0')}`,
  ipAddress: `10.0.0.${5 + (i % 250)}`,
  macAddress: `fa:12:34:56:78:${String(90 + (i % 10)).padStart(2, '0')}`,
}));

const mockSecurityGroups: SecurityGroup[] = Array.from({ length: 115 }, (_, i) => ({
  id: '29tgj234',
  name: `10.0.0.${5 + (i % 250)}`,
  description: '-',
  createdAt: 'Sep 3, 2026 14:38:29',
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
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [copiedMac, setCopiedMac] = useState(false);

  // Allowed Address Pairs tab state
  const [aapSearchTerm, setAapSearchTerm] = useState('');
  const [aapCurrentPage, setAapCurrentPage] = useState(1);
  const aapPerPage = 10;

  // Security tab state
  const [sgSearchTerm, setSgSearchTerm] = useState('');
  const [sgCurrentPage, setSgCurrentPage] = useState(1);
  const sgPerPage = 10;

  // Selection state
  const [selectedAaps, setSelectedAaps] = useState<string[]>([]);
  const [selectedSgs, setSelectedSgs] = useState<string[]>([]);

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Detach security group modal state
  const [detachModalOpen, setDetachModalOpen] = useState(false);
  const [securityGroupToDetach, setSecurityGroupToDetach] = useState<SecurityGroup | null>(null);

  // Get port data based on URL ID
  const port = id ? mockPortsMap[id] || defaultPortDetail : defaultPortDetail;
  const allowedAddressPairs = mockAllowedAddressPairs;
  const securityGroups = mockSecurityGroups;

  // Update tab label to port name
  useEffect(() => {
    if (port.name) {
      updateActiveTabLabel(port.name);
    }
  }, [port.name, updateActiveTabLabel]);

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
      sticky: 'right',
      render: (_: unknown, row: AllowedAddressPair) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
              onClick={() => console.log('Delete address pair', row.id)}
            >
              <IconTrash size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
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
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/security-groups/${row.id}`}
            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.id}>
              ID : {row.id.slice(0, 8)}
            </span>
            <InlineCopyId value={row.id} />
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
      label: 'Created at',
      flex: 1,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
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

  const breadcrumbItems = [{ label: 'Ports', href: '/compute-admin/ports' }, { label: port.name }];

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
    <>
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
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          />
        }
        contentClassName="pt-4 px-8 pb-20"
      >
        <VStack gap={6} className="min-w-[1176px]">
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
              <DetailHeader.InfoCard label="ID" value={port.id} copyable onCopy={handleCopyId} />
              <DetailHeader.InfoCard label="Admin state" value="Up" />
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
                {port.status === 'active' && (
                  <Tab value="allowed-address-pairs">Allowed Address Pairs</Tab>
                )}
                {port.status === 'active' && <Tab value="security">Security groups</Tab>}
              </TabList>

              {/* Details Tab */}
              <TabPanel value="details" className="pt-0">
                <VStack gap={4} className="pt-4">
                  {/* Basic information */}
                  <SectionCard>
                    <SectionCard.Header title="Basic information" />
                    <SectionCard.Content>
                      <SectionCard.DataRow label="Port name" value={port.name} />
                      <SectionCard.DataRow label="Description" value={port.description} />
                      <SectionCard.DataRow label="Admin state" value="Up" />
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Owned Network */}
                  <SectionCard>
                    <SectionCard.Header title="Owned network" />
                    <SectionCard.Content>
                      <SectionCard.DataRow
                        label="Network"
                        value={port.ownedNetwork.name}
                        isLink={!!port.ownedNetwork.id}
                        linkHref={`/compute-admin/networks/${port.ownedNetwork.id}`}
                      />
                      <SectionCard.DataRow
                        label="MAC Address"
                        value={
                          <span className="flex items-center gap-1">
                            {port.macAddress}
                            {port.macAddress !== '-' && <InlineCopyId value={port.macAddress} />}
                          </span>
                        }
                      />
                      <SectionCard.DataRow
                        label="Fixed IP Address"
                        value={
                          <span className="flex items-center gap-1">
                            {port.fixedIp || '-'}
                            {port.fixedIp && port.fixedIp !== '-' && (
                              <InlineCopyId value={port.fixedIp} />
                            )}
                          </span>
                        }
                      />
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Attachments */}
                  <SectionCard>
                    <SectionCard.Header title="Attachments" />
                    <SectionCard.Content>
                      <SectionCard.DataRow
                        label="Bind device type"
                        value={
                          port.attachedTo
                            ? port.attachedTo.type === 'instance'
                              ? 'Instance'
                              : 'Router'
                            : '-'
                        }
                      />
                      <SectionCard.DataRow
                        label="Bind device"
                        value={port.attachedTo ? port.attachedTo.name : '-'}
                        isLink={!!port.attachedTo}
                        linkHref={
                          port.attachedTo
                            ? port.attachedTo.type === 'instance'
                              ? `/compute-admin/instances/${port.attachedTo.id}`
                              : `/compute-admin/routers/${port.attachedTo.id}`
                            : undefined
                        }
                      />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>
              </TabPanel>

              {/* Fixed IPs Tab */}
              {/* Allowed Address Pairs Tab */}
              {port.status === 'active' && (
                <TabPanel value="allowed-address-pairs" className="pt-0">
                  <VStack gap={4} className="pt-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                        Allowed Address Pairs
                      </h3>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Create allowed address pair
                      </Button>
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
                      <Button variant="secondary" size="sm" leftIcon={<IconSettings size={12} />}>
                        Manage security groups
                      </Button>
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
      </PageShell>

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
          <InlineMessage variant="error">
            Detaching this security group may affect network access for the port.
          </InlineMessage>
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
    </>
  );
}
