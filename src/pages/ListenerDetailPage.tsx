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
  IconChevronDown,
  IconExternalLink,
  IconCirclePlus,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ListenerStatus = 'active' | 'down' | 'error';
type PoolStatus = 'active' | 'down' | 'error';

interface ListenerDetail {
  id: string;
  name: string;
  status: ListenerStatus;
  adminState: 'Up' | 'Down';
  createdAt: string;
  // Basic Information
  description: string;
  protocol: string;
  port: number;
  connectionLimit: string;
  customHeaders: string;
  clientDataTimeout: string;
  memberConnectTimeout: string;
  memberDataTimeout: string;
  tcpInspectTimeout: string;
  allowedCidrs: string;
  // Association
  loadBalancer: { name: string; id: string } | null;
}

interface Pool {
  id: string;
  name: string;
  status: PoolStatus;
  protocol: string;
  algorithm: string;
  members: number;
  adminState: 'Up' | 'Down';
}

type L7PolicyStatus = 'active' | 'down' | 'error';

interface L7Policy {
  id: string;
  name: string;
  status: L7PolicyStatus;
  behavior: 'Reject' | 'Redirect to Pool' | 'Redirect to URL';
  position: number | null;
  adminState: 'Up' | 'Down';
}

type CertificateStatus = 'active' | 'error' | 'pending';
type CertificateType = 'Server' | 'CA';

interface Certificate {
  id: string;
  name: string;
  status: CertificateStatus;
  type: CertificateType;
  domain: string;
  expiresAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockListenerDetail: ListenerDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'listener-http-80',
  status: 'active',
  adminState: 'Up',
  createdAt: '2025-07-25 09:12:20',
  // Basic Information
  description: '-',
  protocol: 'HTTP',
  port: 80,
  connectionLimit: '-',
  customHeaders: 'X-Forwarded-For : Disabled / X-Forwarded-Port : Disabled',
  clientDataTimeout: '50000 ms',
  memberConnectTimeout: '5000 ms',
  memberDataTimeout: '50000 ms',
  tcpInspectTimeout: '0 ms',
  allowedCidrs: '10.62.0.32/24(+3)',
  // Association
  loadBalancer: { name: 'web-server-10', id: 'lb-001' },
};

/* ----------------------------------------
   Mock Pools Data
   ---------------------------------------- */

const mockPools: Pool[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29fg234${String(i).padStart(2, '0')}`,
  name: `pool-http`,
  status: ['active', 'active', 'active', 'down', 'error'][i % 5] as PoolStatus,
  protocol: 'HTTP',
  algorithm: 'Round Robin',
  members: 1,
  adminState: i % 10 === 0 ? 'Down' : 'Up',
}));

/* ----------------------------------------
   Mock L7 Policies Data
   ---------------------------------------- */

const mockL7Policies: L7Policy[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29fg234${String(i).padStart(2, '0')}`,
  name: `policy1`,
  status: 'active' as L7PolicyStatus,
  behavior: 'Reject' as const,
  position: null,
  adminState: 'Up' as const,
}));

/* ----------------------------------------
   Mock Certificates Data
   ---------------------------------------- */

const mockCertificates: Certificate[] = Array.from({ length: 115 }, (_, i) => ({
  id: `cert-${String(i + 1).padStart(3, '0')}`,
  name: i % 2 === 0 ? `server-cert-${String(i + 1).padStart(2, '0')}` : `ca-cert-${String(i + 1).padStart(2, '0')}`,
  status: ['active', 'active', 'active', 'error', 'pending'][i % 5] as CertificateStatus,
  type: i % 2 === 0 ? 'Server' : 'CA',
  domain: i % 2 === 0 ? `*.domain${i}.com` : 'N/A',
  expiresAt: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const listenerStatusMap: Record<ListenerStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const poolStatusMap: Record<PoolStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const l7PolicyStatusMap: Record<L7PolicyStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const certificateStatusMap: Record<CertificateStatus, 'active' | 'error' | 'pending'> = {
  active: 'active',
  error: 'error',
  pending: 'pending',
};

/* ----------------------------------------
   ListenerDetailPage Component
   ---------------------------------------- */

export default function ListenerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedId, setCopiedId] = useState(false);

  // Pools state
  const [poolSearchTerm, setPoolSearchTerm] = useState('');
  const [poolCurrentPage, setPoolCurrentPage] = useState(1);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const poolsPerPage = 10;

  // L7 Policies state
  const [l7PolicySearchTerm, setL7PolicySearchTerm] = useState('');
  const [l7PolicyCurrentPage, setL7PolicyCurrentPage] = useState(1);
  const [selectedL7Policies, setSelectedL7Policies] = useState<string[]>([]);
  const l7PoliciesPerPage = 10;

  // Certificates state
  const [certificateSearchTerm, setCertificateSearchTerm] = useState('');
  const [certificateCurrentPage, setCertificateCurrentPage] = useState(1);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const certificatesPerPage = 10;

  // In a real app, fetch based on id
  const listener = mockListenerDetail;

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Load Balancers', href: '/load-balancers' },
    { label: listener.loadBalancer?.name || 'Unknown', href: `/load-balancers/${listener.loadBalancer?.id}` },
    { label: listener.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleCopyId = () => {
    navigator.clipboard.writeText(listener.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered pools based on search
  const filteredPools = useMemo(() => {
    if (!poolSearchTerm) return mockPools;
    const query = poolSearchTerm.toLowerCase();
    return mockPools.filter(pool =>
      pool.name.toLowerCase().includes(query) ||
      pool.protocol.toLowerCase().includes(query) ||
      pool.algorithm.toLowerCase().includes(query)
    );
  }, [poolSearchTerm]);

  // Paginated pools
  const totalPoolPages = Math.ceil(filteredPools.length / poolsPerPage);
  const paginatedPools = useMemo(() => {
    const start = (poolCurrentPage - 1) * poolsPerPage;
    return filteredPools.slice(start, start + poolsPerPage);
  }, [filteredPools, poolCurrentPage, poolsPerPage]);

  // Filtered L7 policies based on search
  const filteredL7Policies = useMemo(() => {
    if (!l7PolicySearchTerm) return mockL7Policies;
    const query = l7PolicySearchTerm.toLowerCase();
    return mockL7Policies.filter(policy =>
      policy.name.toLowerCase().includes(query) ||
      policy.behavior.toLowerCase().includes(query)
    );
  }, [l7PolicySearchTerm]);

  // Paginated L7 policies
  const totalL7PolicyPages = Math.ceil(filteredL7Policies.length / l7PoliciesPerPage);
  const paginatedL7Policies = useMemo(() => {
    const start = (l7PolicyCurrentPage - 1) * l7PoliciesPerPage;
    return filteredL7Policies.slice(start, start + l7PoliciesPerPage);
  }, [filteredL7Policies, l7PolicyCurrentPage, l7PoliciesPerPage]);

  // Filtered certificates based on search
  const filteredCertificates = useMemo(() => {
    if (!certificateSearchTerm) return mockCertificates;
    const query = certificateSearchTerm.toLowerCase();
    return mockCertificates.filter(cert =>
      cert.name.toLowerCase().includes(query) ||
      cert.type.toLowerCase().includes(query) ||
      cert.domain.toLowerCase().includes(query)
    );
  }, [certificateSearchTerm]);

  // Paginated certificates
  const totalCertificatePages = Math.ceil(filteredCertificates.length / certificatesPerPage);
  const paginatedCertificates = useMemo(() => {
    const start = (certificateCurrentPage - 1) * certificatesPerPage;
    return filteredCertificates.slice(start, start + certificatesPerPage);
  }, [filteredCertificates, certificateCurrentPage, certificatesPerPage]);

  // Pool columns
  const poolColumns: TableColumn<Pool>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={poolStatusMap[row.status]} layout="icon-only" />
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
            to={`/pools/${row.id}`}
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
      key: 'protocol',
      label: 'Protocol',
      flex: 1,
      sortable: true,
    },
    {
      key: 'algorithm',
      label: 'Algorithm',
      flex: 1,
      sortable: true,
    },
    {
      key: 'members',
      label: 'Members',
      flex: 1,
      sortable: true,
    },
    {
      key: 'adminState',
      label: 'Admin State',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: () => (
        <Button variant="tertiary" size="sm" iconOnly icon={<IconDotsCircleHorizontal size={16} stroke={1} />} />
      ),
    },
  ];

  // L7 Policy columns
  const l7PolicyColumns: TableColumn<L7Policy>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={l7PolicyStatusMap[row.status]} layout="icon-only" />
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
            to={`/l7-policies/${row.id}`}
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
      key: 'behavior',
      label: 'Behavior',
      flex: 1,
      sortable: true,
    },
    {
      key: 'position',
      label: 'Position',
      flex: 1,
      sortable: true,
      render: (_, row) => row.position !== null ? row.position : '-',
    },
    {
      key: 'adminState',
      label: 'Admin State',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: () => (
        <Button variant="tertiary" size="sm" iconOnly icon={<IconDotsCircleHorizontal size={16} stroke={1} />} />
      ),
    },
  ];

  // Certificate columns
  const certificateColumns: TableColumn<Certificate>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={certificateStatusMap[row.status]} layout="icon-only" />
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
            to={`/certificates/${row.id}`}
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
      key: 'type',
      label: 'Type',
      flex: 1,
      sortable: true,
    },
    {
      key: 'domain',
      label: 'Domain',
      flex: 1,
      sortable: true,
    },
    {
      key: 'expiresAt',
      label: 'Expires At',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: () => (
        <Button variant="tertiary" size="sm" iconOnly icon={<IconDotsCircleHorizontal size={16} stroke={1} />} />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 overflow-x-auto ${
          sidebarOpen ? 'ml-[200px]' : 'ml-0'
        }`}
      >
        <div className="min-w-[var(--layout-content-min-width)]">
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

          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px] max-w-[1320px]">
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>{listener.name}</DetailHeader.Title>

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
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<IconChevronDown size={12} />}
                  >
                    More Actions
                  </Button>
                </DetailHeader.Actions>

                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={listener.status === 'active' ? 'Available' : listener.status}
                    status={listenerStatusMap[listener.status]}
                  />
                  <DetailHeader.InfoCard
                    label="ID"
                    value={listener.id}
                    copyable
                    onCopy={handleCopyId}
                    className="flex-1"
                  />
                  <DetailHeader.InfoCard
                    label="Admin State"
                    value={listener.adminState}
                  />
                  <DetailHeader.InfoCard
                    label="Created At"
                    value={listener.createdAt}
                  />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="pools">Pools</Tab>
                    <Tab value="l7-policies">L7 Policies</Tab>
                    <Tab value="certificates">Certificates</Tab>
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
                          <SectionCard.DataRow label="Name" value={listener.name} />
                          <SectionCard.DataRow label="Description" value={listener.description} />
                          <SectionCard.DataRow label="Protocol" value={listener.protocol} />
                          <SectionCard.DataRow label="Port" value={String(listener.port)} />
                          <SectionCard.DataRow label="Connection Limit" value={listener.connectionLimit} />
                          <SectionCard.DataRow label="Custom Headers" value={listener.customHeaders} />
                          <SectionCard.DataRow label="Client Data Timeout" value={listener.clientDataTimeout} />
                          <SectionCard.DataRow label="Member Connect Timeout" value={listener.memberConnectTimeout} />
                          <SectionCard.DataRow label="Member Data Timeout" value={listener.memberDataTimeout} />
                          <SectionCard.DataRow label="TCP Inspect Timeout" value={listener.tcpInspectTimeout} />
                          <SectionCard.DataRow label="Allowed CIDRs" value={listener.allowedCidrs} />
                          <SectionCard.DataRow label="Admin State" value={listener.adminState} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Association */}
                      <SectionCard>
                        <SectionCard.Header title="Association" />
                        <SectionCard.Content>
                          <div className="flex flex-col gap-3 w-full">
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                                Load Balancer
                              </span>
                              {listener.loadBalancer ? (
                                <Link
                                  to={`/load-balancers/${listener.loadBalancer.id}`}
                                  className="flex items-center gap-1.5 text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
                                >
                                  {listener.loadBalancer.name}
                                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                                </Link>
                              ) : (
                                <span className="text-[12px] leading-4 text-[var(--color-text-default)]">-</span>
                              )}
                            </div>
                          </div>
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Pools Tab */}
                  <TabPanel value="pools">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Pools
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Create Pool
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            value={poolSearchTerm}
                            onChange={(e) => {
                              setPoolSearchTerm(e.target.value);
                              setPoolCurrentPage(1);
                            }}
                            placeholder="Find pool with filters"
                          />
                        </div>
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedPools.length === 0}
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2">
                        <Pagination
                          currentPage={poolCurrentPage}
                          totalPages={totalPoolPages}
                          onPageChange={setPoolCurrentPage}
                        />
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                          {filteredPools.length} items
                        </span>
                      </div>

                      {/* Table */}
                      <Table
                        columns={poolColumns}
                        data={paginatedPools}
                        rowKey="id"
                        selectable
                        selectedRows={selectedPools}
                        onSelectionChange={setSelectedPools}
                      />
                    </VStack>
                  </TabPanel>

                  {/* L7 Policies Tab */}
                  <TabPanel value="l7-policies">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          L7 Policies
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Add L7 Policy
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            value={l7PolicySearchTerm}
                            onChange={(e) => {
                              setL7PolicySearchTerm(e.target.value);
                              setL7PolicyCurrentPage(1);
                            }}
                            placeholder="Find policies with filters"
                          />
                        </div>
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedL7Policies.length === 0}
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2">
                        <Pagination
                          currentPage={l7PolicyCurrentPage}
                          totalPages={totalL7PolicyPages}
                          onPageChange={setL7PolicyCurrentPage}
                        />
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                          {filteredL7Policies.length} items
                        </span>
                      </div>

                      {/* Table */}
                      <Table
                        columns={l7PolicyColumns}
                        data={paginatedL7Policies}
                        rowKey="id"
                        selectable
                        selectedRows={selectedL7Policies}
                        onSelectionChange={setSelectedL7Policies}
                      />
                    </VStack>
                  </TabPanel>

                  {/* Certificates Tab */}
                  <TabPanel value="certificates">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Certificates
                        </h3>
                        <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                          Add Certificate
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[280px]">
                          <SearchInput
                            value={certificateSearchTerm}
                            onChange={(e) => {
                              setCertificateSearchTerm(e.target.value);
                              setCertificateCurrentPage(1);
                            }}
                            placeholder="Find certificates with filters"
                          />
                        </div>
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled={selectedCertificates.length === 0}
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center gap-2">
                        <Pagination
                          currentPage={certificateCurrentPage}
                          totalPages={totalCertificatePages}
                          onPageChange={setCertificateCurrentPage}
                        />
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                          {filteredCertificates.length} items
                        </span>
                      </div>

                      {/* Table */}
                      <Table
                        columns={certificateColumns}
                        data={paginatedCertificates}
                        rowKey="id"
                        selectable
                        selectedRows={selectedCertificates}
                        onSelectionChange={setSelectedCertificates}
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

