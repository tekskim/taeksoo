import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  SectionCard,
  PageShell,
  ErrorState,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconLinkOff, IconUnlink } from '@tabler/icons-react';

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
    createdAt: 'Oct 1, 2026 10:20:28',
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
    createdAt: 'Oct 2, 2026 17:33:45',
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
    createdAt: 'Oct 3, 2026 00:46:02',
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
    createdAt: 'Sep 28, 2026 07:11:07',
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
    createdAt: 'Sep 25, 2026 10:32:16',
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
    createdAt: 'Sep 20, 2026 23:27:51',
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
    createdAt: 'Sep 15, 2026 12:22:26',
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
    createdAt: 'Sep 10, 2026 01:17:01',
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
    createdAt: 'Sep 5, 2026 14:12:36',
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
    createdAt: 'Sep 1, 2026 10:20:28',
    description: '-',
    resourceType: 'Instance',
    resource: { name: 'backup-server', id: 'inst-005' },
    fixedIp: '10.7.65.45',
    router: { name: 'backup-router', id: 'router-003' },
    fqdn: 'backup.thakicloud.com',
  },
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [copiedFqdn, setCopiedFqdn] = useState(false);

  // Get floating IP data based on URL ID
  const floatingIP = id ? mockFloatingIPsMap[id] : undefined;

  // Update tab label to floating IP address
  useEffect(() => {
    if (floatingIP?.floatingIp) {
      updateActiveTabLabel(floatingIP.floatingIp);
    }
  }, [floatingIP, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  if (!floatingIP) {
    return (
      <PageShell
        sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
            onSidebarToggle={openSidebar}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Floating IPs', href: '/compute/floating-ips' },
                  { label: id ?? '—' },
                ]}
              />
            }
          />
        }
        contentClassName="pt-4 px-8 pb-20"
      >
        <ErrorState
          title="Floating IP not found"
          description={`The floating IP "${id ?? ''}" does not exist or has been deleted.`}
          action={
            <Button variant="secondary" size="md" onClick={() => navigate('/compute/floating-ips')}>
              Back to Floating IPs
            </Button>
          }
        />
      </PageShell>
    );
  }

  const breadcrumbItems = [
    { label: 'Floating IPs', href: '/compute/floating-ips' },
    { label: floatingIP.floatingIp },
  ];

  const handleCopyFqdn = () => {
    if (floatingIP.fqdn) {
      navigator.clipboard.writeText(floatingIP.fqdn);
      setCopiedFqdn(true);
      setTimeout(() => setCopiedFqdn(false), 2000);
    }
  };

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
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
            <Button variant="secondary" size="sm" leftIcon={<IconUnlink size={12} />}>
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
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
            </TabList>

            {/* Details Tab Panel */}
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic information */}
                <SectionCard>
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Floating IP" value={floatingIP.floatingIp} />
                    <SectionCard.DataRow label="Description" value={floatingIP.description} />
                    <SectionCard.DataRow
                      label="External network"
                      value={
                        floatingIP.network ? (
                          <Link
                            to={`/compute/networks/${floatingIP.network.id}`}
                            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
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
                            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
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
                            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
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
    </PageShell>
  );
}
