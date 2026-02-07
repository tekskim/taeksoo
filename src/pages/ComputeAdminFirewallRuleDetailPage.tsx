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
  PageShell,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface FirewallRuleDetail {
  id: string;
  name: string;
  description: string;
  tenant: string;
  tenantId: string;
  protocol: string;
  action: string;
  sourceIp: string;
  sourcePort: string;
  destinationIp: string;
  destinationPort: string;
  enabled: boolean;
  shared: boolean;
  firewallPolicy: string;
  firewallPolicyId: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockRulesMap: Record<string, FirewallRuleDetail> = {
  'fwr-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'rule',
    description: '-',
    tenant: 'tenantA',
    tenantId: 'tenant-001',
    protocol: 'Any',
    action: 'DENY',
    sourceIp: '-',
    sourcePort: '-',
    destinationIp: '-',
    destinationPort: '-',
    enabled: true,
    shared: false,
    firewallPolicy: 'policy',
    firewallPolicyId: 'fwp-001',
  },
  'fwr-002': {
    id: '8394e0285f92542f04171b0ccd3deff0',
    name: 'allow-http',
    description: 'Allow HTTP traffic',
    tenant: 'tenantA',
    tenantId: 'tenant-001',
    protocol: 'TCP',
    action: 'ALLOW',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'Any',
    destinationIp: '10.0.0.0/24',
    destinationPort: '80',
    enabled: true,
    shared: true,
    firewallPolicy: 'web-policy',
    firewallPolicyId: 'fwp-002',
  },
  'fwr-003': {
    id: '9405f1396g03653g15282c1de4f2feeg',
    name: 'allow-ssh',
    description: 'Allow SSH access',
    tenant: 'tenantB',
    tenantId: 'tenant-002',
    protocol: 'TCP',
    action: 'ALLOW',
    sourceIp: '192.168.1.0/24',
    sourcePort: 'Any',
    destinationIp: '10.0.0.0/24',
    destinationPort: '22',
    enabled: true,
    shared: false,
    firewallPolicy: 'admin-policy',
    firewallPolicyId: 'fwp-003',
  },
};

const defaultRuleDetail: FirewallRuleDetail = {
  id: 'unknown',
  name: 'Unknown Rule',
  description: '-',
  tenant: '-',
  tenantId: '',
  protocol: '-',
  action: '-',
  sourceIp: '-',
  sourcePort: '-',
  destinationIp: '-',
  destinationPort: '-',
  enabled: false,
  shared: false,
  firewallPolicy: '-',
  firewallPolicyId: '',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function ComputeAdminFirewallRuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [activeTab, setActiveTab] = useState('details');

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Get rule data based on URL ID
  const rule = id ? mockRulesMap[id] || defaultRuleDetail : defaultRuleDetail;

  // Update tab label to rule name
  useEffect(() => {
    if (rule.name) {
      updateActiveTabLabel(rule.name);
    }
  }, [rule.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Firewalls', href: '/compute-admin/firewall' },
                { label: rule.name },
              ]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={8} className="min-w-[1176px]">
        {/* Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{rule.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="ID" value={rule.id} copyable />
            <DetailHeader.InfoCard label="Tenant" value={rule.tenant} />
            <DetailHeader.InfoCard label="Enabled" value={rule.enabled ? 'On' : 'Off'} />
            <DetailHeader.InfoCard label="Shared" value={rule.shared ? 'Yes' : 'No'} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs Section */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab value="details">Details</Tab>
            </TabList>

            {/* Details Tab */}
            <TabPanel value="details" className="pt-6">
              <VStack gap={6}>
                {/* Basic Information */}
                <SectionCard>
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Rule name" value={rule.name} />
                    <SectionCard.DataRow label="Description" value={rule.description || '-'} />
                    <SectionCard.DataRow label="Protocol" value={rule.protocol} />
                    <SectionCard.DataRow label="Action" value={rule.action} />
                    <SectionCard.DataRow label="Source IP" value={rule.sourceIp || '-'} />
                    <SectionCard.DataRow label="Source port" value={rule.sourcePort || '-'} />
                    <SectionCard.DataRow label="Destination IP" value={rule.destinationIp || '-'} />
                    <SectionCard.DataRow
                      label="Destination port"
                      value={rule.destinationPort || '-'}
                    />
                    <SectionCard.DataRow label="Enabled" value={rule.enabled ? 'On' : 'Off'} />
                    <SectionCard.DataRow label="Shared" value={rule.shared ? 'Yes' : 'No'} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Firewall Policy */}
                <SectionCard>
                  <SectionCard.Header title="Firewall policy" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Firewall policy"
                      value={
                        rule.firewallPolicyId ? (
                          <Link
                            to={`/compute-admin/firewall-policies/${rule.firewallPolicyId}`}
                            className="font-medium text-[var(--color-action-primary)] hover:underline"
                          >
                            {rule.firewallPolicy}
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
