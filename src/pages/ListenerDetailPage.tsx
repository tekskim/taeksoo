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
  StatusIndicator,
  ContextMenu,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconBell,
  IconCirclePlus,
  IconDotsCircleHorizontal,
  IconCertificate,
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
  // Basic information
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
type CertificateType = 'Server' | 'CA' | 'SNI';

interface Certificate {
  id: string;
  name: string;
  status: CertificateStatus;
  type: CertificateType;
  domain: string;
  issuer: string;
  expiresAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Mock data - synchronized with LoadBalancerDetailPage listeners
const mockListenersMap: Record<string, ListenerDetail> = {
  '29tgj234': {
    id: '29tgj234',
    name: 'listener-http-80',
    status: 'active',
    adminState: 'Up',
    createdAt: '2025-07-25 09:12:20',
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
    loadBalancer: { name: 'web-lb-01', id: 'lb-001' },
  },
  '38fk29dk': {
    id: '38fk29dk',
    name: 'listener-https-443',
    status: 'active',
    adminState: 'Up',
    createdAt: '2025-07-24 10:30:00',
    description: 'HTTPS listener for API',
    protocol: 'HTTPS',
    port: 443,
    connectionLimit: '1000',
    customHeaders: 'X-Forwarded-For : Enabled / X-Forwarded-Port : Enabled',
    clientDataTimeout: '50000 ms',
    memberConnectTimeout: '5000 ms',
    memberDataTimeout: '50000 ms',
    tcpInspectTimeout: '0 ms',
    allowedCidrs: '0.0.0.0/0',
    loadBalancer: { name: 'api-lb', id: 'lb-002' },
  },
  '9dk38fj2': {
    id: '9dk38fj2',
    name: 'listener-tcp-8080',
    status: 'active',
    adminState: 'Up',
    createdAt: '2025-07-23 14:00:00',
    description: 'TCP listener for app',
    protocol: 'TCP',
    port: 8080,
    connectionLimit: '500',
    customHeaders: '-',
    clientDataTimeout: '60000 ms',
    memberConnectTimeout: '10000 ms',
    memberDataTimeout: '60000 ms',
    tcpInspectTimeout: '5000 ms',
    allowedCidrs: '10.0.0.0/8',
    loadBalancer: { name: 'app-lb', id: 'lb-003' },
  },
};

const defaultListenerDetail: ListenerDetail = {
  id: 'listener-default',
  name: 'Unknown',
  status: 'active',
  adminState: 'Up',
  createdAt: '-',
  description: '-',
  protocol: 'HTTP',
  port: 80,
  connectionLimit: '-',
  customHeaders: '-',
  clientDataTimeout: '-',
  memberConnectTimeout: '-',
  memberDataTimeout: '-',
  tcpInspectTimeout: '-',
  allowedCidrs: '-',
  loadBalancer: { name: '-', id: '' },
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

const mockCertificates: Certificate[] = Array.from({ length: 115 }, (_, i) => {
  const types: CertificateType[] = ['Server', 'CA', 'SNI'];
  const type = types[i % 3];
  const namePrefix = type === 'Server' ? 'server-cert' : type === 'CA' ? 'ca-cert' : 'sni-cert';
  return {
    id: `cert-${String(i + 1).padStart(3, '0')}`,
    name: `${namePrefix}-${String(i + 1).padStart(2, '0')}`,
    status: ['active', 'active', 'active', 'error', 'pending'][i % 5] as CertificateStatus,
    type,
    domain: type === 'CA' ? 'N/A' : `*.domain${i}.com`,
    issuer: ['DigiCert', "Let's Encrypt", 'Comodo', 'GlobalSign', 'Sectigo'][i % 5],
    expiresAt: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  };
});

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
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedId, setCopiedId] = useState(false);

  // Get listener based on URL id
  const listener = id ? mockListenersMap[id] || defaultListenerDetail : defaultListenerDetail;

  // Update tab label when listener name changes
  useEffect(() => {
    if (listener.name) {
      updateActiveTabLabel(listener.name);
    }
  }, [listener.name, updateActiveTabLabel]);

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
  const certificatesPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Load balancers', href: '/compute/load-balancers' },
    {
      label: listener.loadBalancer?.name || 'Unknown',
      href: `/load-balancers/${listener.loadBalancer?.id}`,
    },
    { label: listener.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
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
    return mockPools.filter(
      (pool) =>
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
    return mockL7Policies.filter(
      (policy) =>
        policy.name.toLowerCase().includes(query) || policy.behavior.toLowerCase().includes(query)
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
    return mockCertificates.filter(
      (cert) =>
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
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={poolStatusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/pools/${row.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'protocol',
      label: 'Protocol',
      flex: 1,
      minWidth: columnMinWidths.protocol,
      sortable: true,
    },
    {
      key: 'algorithm',
      label: 'Algorithm',
      flex: 1,
      minWidth: columnMinWidths.algorithm,
      sortable: true,
    },
    {
      key: 'members',
      label: 'Members',
      flex: 1,
      minWidth: columnMinWidths.members,
      sortable: true,
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
      minWidth: columnMinWidths.adminState,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: Pool) => {
        const poolMenuItems: ContextMenuItem[] = [
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete pool', row.id),
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={poolMenuItems} trigger="click" align="right">
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

  // L7 Policy columns
  const l7PolicyColumns: TableColumn<L7Policy>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={l7PolicyStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/l7-policies/${row.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'behavior',
      label: 'Behavior',
      flex: 1,
      minWidth: columnMinWidths.behavior,
    },
    {
      key: 'position',
      label: 'Position',
      flex: 1,
      minWidth: columnMinWidths.position,
      sortable: true,
      render: (_, row) => (row.position !== null ? row.position : '-'),
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
      minWidth: columnMinWidths.adminState,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: L7Policy) => {
        const policyMenuItems: ContextMenuItem[] = [
          {
            id: 'edit',
            label: 'Edit',
            icon: <IconEdit size={14} stroke={1.5} />,
            onClick: () => console.log('Edit policy', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => console.log('Delete policy', row.id),
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={policyMenuItems} trigger="click" align="right">
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

  // Certificate columns
  const certificateColumns: TableColumn<Certificate>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={certificateStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/certificates/${row.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
    },
    {
      key: 'domain',
      label: 'SAN',
      flex: 1,
      minWidth: columnMinWidths.domain,
    },
    {
      key: 'issuer',
      label: 'Issuer',
      flex: 1,
      minWidth: columnMinWidths.issuer,
      sortable: true,
    },
    {
      key: 'expiresAt',
      label: 'Expires at',
      flex: 1,
      minWidth: columnMinWidths.expiresAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_: unknown, row: Certificate) => {
        const getCertMenuItems = (): ContextMenuItem[] => {
          switch (row.type) {
            case 'Server':
              return [
                {
                  id: 'change-server-cert',
                  label: 'Change server Certificate',
                  icon: <IconCertificate size={14} stroke={1.5} />,
                  onClick: () => console.log('Change server certificate', row.id),
                },
              ];
            case 'CA':
              return [
                {
                  id: 'change-ca-cert',
                  label: 'Change CA Certificate',
                  icon: <IconCertificate size={14} stroke={1.5} />,
                  onClick: () => console.log('Change CA certificate', row.id),
                },
              ];
            case 'SNI':
              return [
                {
                  id: 'remove-sni-cert',
                  label: 'Remove',
                  status: 'danger',
                  onClick: () => console.log('Remove SNI certificate', row.id),
                },
              ];
            default:
              return [];
          }
        };
        const certMenuItems = getCertMenuItems();
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={certMenuItems} trigger="click" align="right">
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

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

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
                <DetailHeader.Title>{listener.name}</DetailHeader.Title>

                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete Default Pool
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
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
                  <DetailHeader.InfoCard label="Admin state" value={listener.adminState} />
                  <DetailHeader.InfoCard label="Created at" value={listener.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="pools">Default pool</Tab>
                    <Tab value="l7-policies">L7 Policies</Tab>
                    <Tab value="certificates">Certificates</Tab>
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
                          <SectionCard.DataRow label="Name" value={listener.name} />
                          <SectionCard.DataRow label="Description" value={listener.description} />
                          <SectionCard.DataRow label="Protocol" value={listener.protocol} />
                          <SectionCard.DataRow label="Port" value={String(listener.port)} />
                          <SectionCard.DataRow
                            label="Connection limit"
                            value={listener.connectionLimit}
                          />
                          <SectionCard.DataRow
                            label="Custom headers"
                            value={listener.customHeaders}
                          />
                          <SectionCard.DataRow
                            label="Client data Timeout"
                            value={listener.clientDataTimeout}
                          />
                          <SectionCard.DataRow
                            label="Member connect Timeout"
                            value={listener.memberConnectTimeout}
                          />
                          <SectionCard.DataRow
                            label="Member data Timeout"
                            value={listener.memberDataTimeout}
                          />
                          <SectionCard.DataRow
                            label="TCP Inspect Timeout"
                            value={listener.tcpInspectTimeout}
                          />
                          <SectionCard.DataRow
                            label="Allowed CIDRs"
                            value={listener.allowedCidrs}
                          />
                          <SectionCard.DataRow label="Admin state" value={listener.adminState} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Association */}
                      <SectionCard>
                        <SectionCard.Header title="Association" />
                        <SectionCard.Content>
                          <div className="flex flex-col gap-3 w-full">
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                            <div className="flex flex-col gap-1.5">
                              <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">
                                Load balancer
                              </span>
                              {listener.loadBalancer ? (
                                <Link
                                  to={`/compute/load-balancers/${listener.loadBalancer.id}`}
                                  className="flex items-center gap-1.5 text-label-md leading-4 text-[var(--color-action-primary)] hover:underline"
                                >
                                  {listener.loadBalancer.name}
                                </Link>
                              ) : (
                                <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                  -
                                </span>
                              )}
                            </div>
                          </div>
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Default Pool Tab */}
                  <TabPanel value="pools" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Default Pool */}
                      <SectionCard>
                        <SectionCard.Header
                          title="Default Pool"
                          actions={
                            <>
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
                            </>
                          }
                        />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Name" value={mockPools[0]?.name || '-'} />
                          <SectionCard.DataRow
                            label="Status"
                            value={
                              <StatusIndicator
                                status={poolStatusMap[mockPools[0]?.status] || 'down'}
                              />
                            }
                          />
                          <SectionCard.DataRow label="Description" value="-" />
                          <SectionCard.DataRow
                            label="Algorithm"
                            value={mockPools[0]?.algorithm || '-'}
                          />
                          <SectionCard.DataRow
                            label="Protocol"
                            value={mockPools[0]?.protocol || '-'}
                          />
                          <SectionCard.DataRow label="Session persistence" value="-" />
                          <SectionCard.DataRow
                            label="Admin state"
                            value={mockPools[0]?.adminState || '-'}
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* L7 Policies Tab */}
                  <TabPanel value="l7-policies" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                          L7 Policies
                        </h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} />}
                        >
                          Add L7 Policy
                        </Button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[var(--search-input-width)]">
                          <SearchInput
                            value={l7PolicySearchTerm}
                            onChange={(e) => {
                              setL7PolicySearchTerm(e.target.value);
                              setL7PolicyCurrentPage(1);
                            }}
                            placeholder="Search policies by attributes"
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
                      <Pagination
                        currentPage={l7PolicyCurrentPage}
                        totalPages={totalL7PolicyPages}
                        onPageChange={setL7PolicyCurrentPage}
                        totalItems={filteredL7Policies.length}
                        selectedCount={selectedL7Policies.length}
                      />

                      {/* Table */}
                      <Table
                        columns={l7PolicyColumns}
                        data={paginatedL7Policies}
                        rowKey="id"
                        selectable
                        selectedKeys={selectedL7Policies}
                        onSelectionChange={setSelectedL7Policies}
                      />
                    </VStack>
                  </TabPanel>

                  {/* Certificates Tab */}
                  <TabPanel value="certificates" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                          Certificates
                        </h3>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="sm">
                            Change server Certificate
                          </Button>
                          <Button variant="secondary" size="sm">
                            Change CA Certificate
                          </Button>
                          <Button variant="secondary" size="sm">
                            Manage SNI Certificates
                          </Button>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-[var(--search-input-width)]">
                          <SearchInput
                            value={certificateSearchTerm}
                            onChange={(e) => {
                              setCertificateSearchTerm(e.target.value);
                              setCertificateCurrentPage(1);
                            }}
                            placeholder="Search certificates by attributes"
                          />
                        </div>
                        <div className="h-4 w-px bg-[var(--color-border-default)]" />
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconTrash size={12} />}
                          disabled
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={certificateCurrentPage}
                        totalPages={totalCertificatePages}
                        onPageChange={setCertificateCurrentPage}
                        totalItems={filteredCertificates.length}
                      />

                      {/* Table */}
                      <Table
                        columns={certificateColumns}
                        data={paginatedCertificates}
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
