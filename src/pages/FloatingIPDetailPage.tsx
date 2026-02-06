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
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell, IconEdit, IconLinkOff } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type FloatingIPStatus = 'active' | 'down' | 'error';

interface FloatingIPDetail {
  id: string;
  floatingIp: string;
  status: FloatingIPStatus;
  createdAt: string;
  description: string;
  network: { name: string; id: string } | null;
  // Association
  resourceType: string | null;
  resource: { name: string; id: string } | null;
  fixedIp: string | null;
  router: { name: string; id: string } | null;
  // DNS
  fqdn: string | null;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Floating IP data map by ID - synced with FloatingIPsPage mock data
const mockFloatingIPsMap: Record<string, FloatingIPDetail> = {
  'fip-001': {
    id: 'fip-001',
    floatingIp: '172.24.4.228',
    status: 'active',
    createdAt: '2025-10-01',
    description: '-',
    resourceType: 'Instance',
    resource: { name: 'web-01', id: 'inst-001' },
    fixedIp: '10.7.65.39',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'web-01.thakicloud.com',
  },
  'fip-002': {
    id: 'fip-002',
    floatingIp: '172.24.4.229',
    status: 'active',
    createdAt: '2025-10-02',
    description: '-',
    resourceType: 'Instance',
    resource: { name: 'app-server', id: 'inst-002' },
    fixedIp: '10.7.65.40',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'app-server.thakicloud.com',
  },
  'fip-003': {
    id: 'fip-003',
    floatingIp: '172.24.4.230',
    status: 'down',
    createdAt: '2025-10-03',
    description: 'Unassociated',
    resourceType: null,
    resource: null,
    fixedIp: '-',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: '-',
  },
  'fip-004': {
    id: 'fip-004',
    floatingIp: '172.24.4.231',
    status: 'active',
    createdAt: '2025-09-28',
    description: '-',
    resourceType: 'Instance',
    resource: { name: 'db-server', id: 'inst-003' },
    fixedIp: '10.7.65.41',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'db-server.thakicloud.com',
  },
  'fip-005': {
    id: 'fip-005',
    floatingIp: '172.24.4.232',
    status: 'active',
    createdAt: '2025-09-25',
    description: '-',
    resourceType: 'Load balancer',
    resource: { name: 'load-balancer', id: 'lb-001' },
    fixedIp: '10.7.65.42',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'lb.thakicloud.com',
  },
  'fip-006': {
    id: 'fip-006',
    floatingIp: '172.24.4.233',
    status: 'error',
    createdAt: '2025-09-20',
    description: 'Error state',
    resourceType: null,
    resource: null,
    fixedIp: '-',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: '-',
  },
  'fip-007': {
    id: 'fip-007',
    floatingIp: '172.24.4.234',
    status: 'active',
    createdAt: '2025-09-15',
    description: '-',
    resourceType: 'Instance',
    resource: { name: 'monitoring', id: 'inst-004' },
    fixedIp: '10.7.65.43',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'monitoring.thakicloud.com',
  },
  'fip-008': {
    id: 'fip-008',
    floatingIp: '172.24.4.235',
    status: 'active',
    createdAt: '2025-09-10',
    description: '-',
    resourceType: 'VPN Gateway',
    resource: { name: 'vpn-gateway', id: 'vpn-001' },
    fixedIp: '10.7.65.44',
    router: { name: 'vpn-router', id: 'router-002' },
    fqdn: 'vpn.thakicloud.com',
  },
  'fip-009': {
    id: 'fip-009',
    floatingIp: '172.24.4.236',
    status: 'down',
    createdAt: '2025-09-05',
    description: 'Unassociated',
    resourceType: null,
    resource: null,
    fixedIp: '-',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: '-',
  },
  'fip-010': {
    id: 'fip-010',
    floatingIp: '172.24.4.237',
    status: 'active',
    createdAt: '2025-09-01',
    description: '-',
    resourceType: 'Instance',
    resource: { name: 'backup-server', id: 'inst-005' },
    fixedIp: '10.7.65.45',
    router: { name: 'backup-router', id: 'router-003' },
    fqdn: 'backup.thakicloud.com',
  },
};

const defaultFloatingIPDetail: FloatingIPDetail = {
  id: 'unknown',
  floatingIp: 'Unknown',
  status: 'active',
  createdAt: '-',
  description: '-',
  resourceType: null,
  resource: null,
  fixedIp: '-',
  router: { name: '-', id: '' },
  fqdn: '-',
};

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const floatingIPStatusMap: Record<FloatingIPStatus, 'active' | 'shutoff' | 'error'> = {
  active: 'active',
  down: 'shutoff',
  error: 'error',
};

/* ----------------------------------------
   FloatingIPDetailPage Component
   ---------------------------------------- */

export default function FloatingIPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedFqdn, setCopiedFqdn] = useState(false);

  // Get floating IP data based on URL ID
  const floatingIP = id
    ? mockFloatingIPsMap[id] || defaultFloatingIPDetail
    : defaultFloatingIPDetail;

  // Update tab label to floating IP address
  useEffect(() => {
    if (floatingIP.floatingIp) {
      updateActiveTabLabel(floatingIP.floatingIp);
    }
  }, [floatingIP.floatingIp, updateActiveTabLabel]);

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Floating IPs', href: '/compute/floating-ips' },
    { label: floatingIP.floatingIp },
  ];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleCopyFqdn = () => {
    if (floatingIP.fqdn) {
      navigator.clipboard.writeText(floatingIP.fqdn);
      setCopiedFqdn(true);
      setTimeout(() => setCopiedFqdn(false), 2000);
    }
  };

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
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Main Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={8} className="min-w-[1176px]">
              {/* Floating IP Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{floatingIP.floatingIp}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconLinkOff size={12} />}>
                    Disassociate
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Release
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value="Available"
                    status={floatingIPStatusMap[floatingIP.status]}
                  />
                  <DetailHeader.InfoCard label="ID" value={floatingIP.id} copyable />
                  <DetailHeader.InfoCard label="Created at" value={floatingIP.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Floating IP Tabs */}
              <div className="w-full">
                <Tabs
                  value={activeDetailTab}
                  onChange={setActiveDetailTab}
                  variant="underline"
                  size="sm"
                >
                  <TabList>
                    <Tab value="details">Details</Tab>
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
                          <SectionCard.DataRow label="Floating IP" value={floatingIP.floatingIp} />
                          <SectionCard.DataRow label="Description" value={floatingIP.description} />
                          <SectionCard.DataRow
                            label="External network"
                            value={
                              floatingIP.network ? (
                                <Link
                                  to={`/compute/networks/${floatingIP.network.id}`}
                                  className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {floatingIP.network.name}
                                </Link>
                              ) : (
                                '-'
                              )
                            }
                          />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Association */}
                      <SectionCard>
                        <SectionCard.Header title="Association" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Resource"
                            value={
                              floatingIP.resource ? (
                                <Link
                                  to={`/compute/instances/${floatingIP.resource.id}`}
                                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {floatingIP.resource.name}
                                </Link>
                              ) : (
                                '-'
                              )
                            }
                          />
                          <SectionCard.DataRow label="Fixed IP" value={floatingIP.fixedIp || '-'} />
                          <SectionCard.DataRow
                            label="Router"
                            value={
                              floatingIP.router ? (
                                <Link
                                  to={`/compute/routers/${floatingIP.router.id}`}
                                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {floatingIP.router.name}
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
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
