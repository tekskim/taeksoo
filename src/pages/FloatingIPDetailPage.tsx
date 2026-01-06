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
  StatusIndicator,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconLink,
  IconLinkOff,
  IconTrash,
  IconBell,
  IconExternalLink,
  IconCopy,
  IconEdit,
} from '@tabler/icons-react';

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

const mockFloatingIPDetail: FloatingIPDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  floatingIp: '172.24.4.228',
  status: 'active',
  createdAt: '2025-07-25 09:12:20',
  description: '-',
  // Association
  resourceType: 'Instance',
  resource: { name: 'web-server-10', id: 'inst-001' },
  fixedIp: '10.0.0.1',
  router: { name: 'web-server-10', id: 'router-001' },
  // DNS
  fqdn: 'my-web.thakicloud.com',
};

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const floatingIPStatusMap: Record<FloatingIPStatus, 'active' | 'shutoff' | 'error'> = {
  'active': 'active',
  'down': 'shutoff',
  'error': 'error',
};

/* ----------------------------------------
   FloatingIPDetailPage Component
   ---------------------------------------- */

export default function FloatingIPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [copiedFqdn, setCopiedFqdn] = useState(false);

  // In a real app, fetch based on id
  const floatingIP = mockFloatingIPDetail;

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
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Main Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px] max-w-[1320px]">
              {/* Floating IP Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{floatingIP.floatingIp}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconLink size={12} />}>
                    Associate
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconLinkOff size={12} />}>
                    Disassociate
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
                  <DetailHeader.InfoCard label="Created At" value={floatingIP.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Floating IP Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                  </TabList>

                  {/* Details Tab Panel */}
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
                          <SectionCard.DataRow label="Floating IP" value={floatingIP.floatingIp} />
                          <SectionCard.DataRow label="Description" value={floatingIP.description} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Association */}
                      <SectionCard>
                        <SectionCard.Header title="Association" />
                        <SectionCard.Content>
                          <SectionCard.DataRow 
                            label="Resource Type" 
                            value={floatingIP.resourceType || '-'} 
                          />
                          <SectionCard.DataRow 
                            label="Resource" 
                            value={
                              floatingIP.resource ? (
                                <Link
                                  to={`/compute/instances/${floatingIP.resource.id}`}
                                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {floatingIP.resource.name}
                                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                                </Link>
                              ) : '-'
                            } 
                          />
                          <SectionCard.DataRow 
                            label="Fixed IP" 
                            value={floatingIP.fixedIp || '-'} 
                          />
                          <SectionCard.DataRow 
                            label="Router" 
                            value={
                              floatingIP.router ? (
                                <Link
                                  to={`/compute/routers/${floatingIP.router.id}`}
                                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                                >
                                  {floatingIP.router.name}
                                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                                </Link>
                              ) : '-'
                            } 
                          />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* DNS */}
                      <SectionCard>
                        <SectionCard.Header title="DNS" />
                        <SectionCard.Content>
                          <SectionCard.DataRow 
                            label="FQDN" 
                            value={
                              floatingIP.fqdn ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[var(--color-text-default)]">{floatingIP.fqdn}</span>
                                  <button
                                    onClick={handleCopyFqdn}
                                    className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
                                    title={copiedFqdn ? 'Copied!' : 'Copy FQDN'}
                                  >
                                    <IconCopy size={12} className="text-[var(--color-text-subtle)]" />
                                  </button>
                                </div>
                              ) : '-'
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

