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
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconBell,
  IconChevronDown,
  IconCopy,
  IconTransfer,
  IconDownload,
  IconExternalLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type CertificateStatus = 'valid' | 'expired' | 'revoked' | 'pending';
type CertificateType = 'server' | 'ca';

interface ServerCertificateDetail {
  id: string;
  name: string;
  status: CertificateStatus;
  certificateType: 'server';
  type: string;
  domain: string;
  expiresAt: string;
  createdAt: string;
  description: string;
  // Certificate Metadata
  classification: string;
  issuer: string;
  san: string;
  signatureType: string;
  validFrom: string;
  validTo: string;
}

interface CACertificateDetail {
  id: string;
  name: string;
  status: CertificateStatus;
  certificateType: 'ca';
  expiresAt: string;
  createdAt: string;
  description: string;
  // Certificate Metadata
  classification: string;
  authority: string;
  issuer: string;
  signatureType: string;
  validFrom: string;
  validTo: string;
}

type CertificateDetail = ServerCertificateDetail | CACertificateDetail;

type ListenerStatus = 'active' | 'down' | 'error';

interface Listener {
  id: string;
  name: string;
  status: ListenerStatus;
  protocol: string;
  port: number;
  loadBalancer: {
    name: string;
    id: string;
  };
  adminState: 'Up' | 'Down';
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockServerCertificate: ServerCertificateDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'server-cert-1',
  status: 'valid',
  certificateType: 'server',
  type: 'Wildcard',
  domain: '.domain.com',
  expiresAt: '2025-09-25 09:12:20',
  createdAt: '2025-07-25 09:12:20',
  description: '-',
  // Certificate Metadata
  classification: 'Server Certificate',
  issuer: "Let's Encrypt Authority X3",
  san: 'www.domain.com, api.domain.com',
  signatureType: 'SHA256withRSA',
  validFrom: '2025-02-10',
  validTo: '2026-02-10',
};

const mockCACertificate: CACertificateDetail = {
  id: '8395e0285f92542f04171b0cde3deef0',
  name: 'root-ca',
  status: 'valid',
  certificateType: 'ca',
  expiresAt: '2025-09-25 09:12:20',
  createdAt: '2025-07-25 09:12:20',
  description: '-',
  // Certificate Metadata
  classification: 'CA Certificate',
  authority: 'Sectigo Root CA',
  issuer: 'Sectigo Root CA',
  signatureType: 'SHA256withRSA',
  validFrom: '2025-02-10',
  validTo: '2026-02-10',
};

// Mock certificate database
const mockCertificates: Record<string, CertificateDetail> = {
  'cert-001': mockServerCertificate,
  'cert-002': { ...mockServerCertificate, id: 'cert-002', name: 'api-cert' },
  'cert-003': { ...mockServerCertificate, id: 'cert-003', name: 'web-cert' },
  'cert-004': { ...mockCACertificate, id: 'cert-004', name: 'intermediate-ca' },
  'cert-005': { ...mockCACertificate, id: 'cert-005', name: 'private-ca' },
  'cert-006': { ...mockCACertificate, id: 'cert-006', name: 'root-ca' },
};

// Mock listeners data
const mockListeners: Listener[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29fg234${String(i).padStart(2, '0')}`,
  name: `listener-http-80`,
  status: ['active', 'active', 'active', 'down', 'error'][i % 5] as ListenerStatus,
  protocol: ['HTTP', 'HTTPS', 'TCP', 'UDP'][i % 4],
  port: [80, 443, 8080, 3000][i % 4],
  loadBalancer: {
    name: 'web-lb-01',
    id: `29fg234${String(i).padStart(2, '0')}`,
  },
  adminState: i % 10 === 0 ? 'Down' : 'Up',
}));

// Listener status mapping
const listenerStatusMap: Record<ListenerStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const certificateStatusMap: Record<CertificateStatus, 'active' | 'error' | 'shutoff' | 'building'> = {
  'valid': 'active',
  'expired': 'error',
  'revoked': 'shutoff',
  'pending': 'building',
};

/* ----------------------------------------
   Type Guards
   ---------------------------------------- */

function isServerCertificate(cert: CertificateDetail): cert is ServerCertificateDetail {
  return cert.certificateType === 'server';
}

function isCACertificate(cert: CertificateDetail): cert is CACertificateDetail {
  return cert.certificateType === 'ca';
}

/* ----------------------------------------
   CertificateDetailPage Component
   ---------------------------------------- */

export default function CertificateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedId, setCopiedId] = useState(false);
  
  // Listeners state
  const [listenerSearchTerm, setListenerSearchTerm] = useState('');
  const [listenerCurrentPage, setListenerCurrentPage] = useState(1);
  const listenersPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // In a real app, fetch based on id
  const certificate = id && mockCertificates[id] ? mockCertificates[id] : mockServerCertificate;

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Certificates', href: '/compute/certificates' },
    { label: certificate.name },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered listeners based on search
  const filteredListeners = useMemo(() => {
    if (!listenerSearchTerm) return mockListeners;
    const query = listenerSearchTerm.toLowerCase();
    return mockListeners.filter(listener =>
      listener.name.toLowerCase().includes(query) ||
      listener.protocol.toLowerCase().includes(query) ||
      listener.loadBalancer.name.toLowerCase().includes(query)
    );
  }, [listenerSearchTerm]);

  // Paginated listeners
  const totalListenerPages = Math.ceil(filteredListeners.length / listenersPerPage);
  const paginatedListeners = useMemo(() => {
    const start = (listenerCurrentPage - 1) * listenersPerPage;
    return filteredListeners.slice(start, start + listenersPerPage);
  }, [filteredListeners, listenerCurrentPage, listenersPerPage]);

  // Listener columns
  const listenerColumns: TableColumn<Listener>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={listenerStatusMap[row.status]} layout="icon-only" />
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
            to={`/compute/listeners/${row.id}`}
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
      key: 'port',
      label: 'Port',
      flex: 1,
      sortable: true,
    },
    {
      key: 'loadBalancer',
      label: 'Load Balancer',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/load-balancers/${row.loadBalancer.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.loadBalancer.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.loadBalancer.id}
          </span>
        </div>
      ),
    },
    {
      key: 'adminState',
      label: 'Admin State',
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
                aria-label="Notifications"
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
                <DetailHeader.Title>{certificate.name}</DetailHeader.Title>

                <DetailHeader.Actions>
                  {isServerCertificate(certificate) ? (
                    // Server Certificate actions
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconTransfer size={12} />}
                      >
                        Replace
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
                    </>
                  ) : (
                    // CA Certificate actions
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
                        leftIcon={<IconDownload size={12} />}
                      >
                        Download
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconTrash size={12} />}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </DetailHeader.Actions>

                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                    status={certificateStatusMap[certificate.status]}
                  />
                  <DetailHeader.InfoCard
                    label="ID"
                    value={certificate.id}
                    copyable
                    onCopy={handleCopyId}
                    className="flex-1"
                  />
                  {isServerCertificate(certificate) && (
                    <>
                      <DetailHeader.InfoCard
                        label="Type"
                        value={certificate.type}
                        className="w-[148px] flex-none"
                      />
                      <DetailHeader.InfoCard
                        label="Domain"
                        value={certificate.domain}
                        className="w-[148px] flex-none"
                      />
                    </>
                  )}
                  <DetailHeader.InfoCard
                    label="Expires At"
                    value={certificate.expiresAt}
                    className="flex-1"
                  />
                  <DetailHeader.InfoCard
                    label="Created At"
                    value={certificate.createdAt}
                    className="flex-1"
                  />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="listeners">Listeners</Tab>
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
                          <SectionCard.DataRow label="Certificate Name" value={certificate.name} />
                          <SectionCard.DataRow label="Description" value={certificate.description} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Certificate Metadata */}
                      <SectionCard>
                        {isServerCertificate(certificate) ? (
                          // Server Certificate Metadata with Edit button
                          <>
                            <SectionCard.Header
                              title="Certificate Metadata"
                              actions={
                                <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                                  Edit
                                </Button>
                              }
                            />
                            <SectionCard.Content>
                              <SectionCard.DataRow label="Classification" value={certificate.classification} />
                              <SectionCard.DataRow label="Issuer" value={certificate.issuer} />
                              <SectionCard.DataRow label="Type" value={certificate.type} />
                              <SectionCard.DataRow label="Domain" value={certificate.domain} />
                              <SectionCard.DataRow label="SAN" value={certificate.san} />
                              <SectionCard.DataRow label="Signature Type" value={certificate.signatureType} />
                              <SectionCard.DataRow label="Valid From / To" value={`${certificate.validFrom} ~ ${certificate.validTo}`} />
                            </SectionCard.Content>
                          </>
                        ) : (
                          // CA Certificate Metadata without Edit button
                          <>
                            <SectionCard.Header title="Certificate Metadata" />
                            <SectionCard.Content>
                              <SectionCard.DataRow label="Classification" value={certificate.classification} />
                              <SectionCard.DataRow label="Authority" value={certificate.authority} />
                              <SectionCard.DataRow label="Issuer" value={certificate.issuer} />
                              <SectionCard.DataRow label="Signature Type" value={certificate.signatureType} />
                              <SectionCard.DataRow label="Valid From / To" value={`${certificate.validFrom} ~ ${certificate.validTo}`} />
                            </SectionCard.Content>
                          </>
                        )}
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Listeners Tab */}
                  <TabPanel value="listeners">
                    <VStack gap={3} className="pt-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          Listener
                        </h3>
                      </div>

                      {/* Search */}
                      <div className="w-[280px]">
                        <SearchInput
                          value={listenerSearchTerm}
                          onChange={(e) => {
                            setListenerSearchTerm(e.target.value);
                            setListenerCurrentPage(1);
                          }}
                          placeholder="Find Listener with filters"
                        />
                      </div>

                      {/* Pagination */}
                        <Pagination
                          currentPage={listenerCurrentPage}
                          totalPages={totalListenerPages}
                          onPageChange={setListenerCurrentPage}
                        totalItems={filteredListeners.length}
                        showSettings
                        onSettingsClick={() => setIsPreferencesOpen(true)}
                        />

                      {/* Table */}
                      <Table
                        columns={listenerColumns}
                        data={paginatedListeners}
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
