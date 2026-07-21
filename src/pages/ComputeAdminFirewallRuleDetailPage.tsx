import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
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
  Table,
  SearchInput,
  Pagination,
  DetailHeader,
  SectionCard,
  PageShell,
  type TableColumn,
} from '@/design-system';
import { SecuritySidebar } from '@/components/SecuritySidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconEdit, IconDownload } from '@tabler/icons-react';
import { InlineCopyId } from '@/components/InlineCopyId';

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

interface Policy {
  id: string;
  name: string;
  tenant: string;
  tenantId: string;
  shared: boolean;
  audited: boolean;
}

const mockPolicies: Policy[] = Array.from({ length: 115 }, (_, i) => ({
  id: `policy-${String(i + 1).padStart(3, '0')}`,
  name: 'policy',
  tenant: 'tenant',
  tenantId: `tenant-${String((i % 3) + 1).padStart(3, '0')}`,
  shared: i % 3 === 0,
  audited: i % 2 === 0,
}));

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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Policies state
  const [policySearchTerm, setPolicySearchTerm] = useState('');
  const [policyCurrentPage, setPolicyCurrentPage] = useState(1);
  const policiesPerPage = 10;

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

  // Filtered policies
  const filteredPolicies = useMemo(() => {
    if (!policySearchTerm) return mockPolicies;
    const query = policySearchTerm.toLowerCase();
    return mockPolicies.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.tenant.toLowerCase().includes(query)
    );
  }, [policySearchTerm]);

  const totalPolicyPages = Math.ceil(filteredPolicies.length / policiesPerPage);
  const paginatedPolicies = useMemo(() => {
    const start = (policyCurrentPage - 1) * policiesPerPage;
    return filteredPolicies.slice(start, start + policiesPerPage);
  }, [filteredPolicies, policyCurrentPage]);

  // Policy columns
  const policyColumns: TableColumn<Policy>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/security/firewall-policies/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
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
      key: 'tenant',
      label: 'Tenant',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[var(--color-text-default)]">{row.tenant}</span>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.tenantId}>
              ID : {row.tenantId.slice(0, 8)}
            </span>
            <InlineCopyId value={row.tenantId} />
          </span>
        </div>
      ),
    },
    {
      key: 'shared',
      label: 'Shared',
      flex: 1,
      render: (_, row) => (row.shared ? 'Yes' : 'No'),
    },
    {
      key: 'audited',
      label: 'Audited',
      flex: 1,
      render: (_, row) => (row.audited ? 'Yes' : 'No'),
    },
  ];

  return (
    <PageShell
      sidebar={<SecuritySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
              items={[{ label: 'Firewalls', href: '/security/firewalls' }, { label: rule.name }]}
            />
          }
        />
      }
    >
      <VStack gap={6}>
        {/* Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{rule.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
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
              <Tab value="policies">Policies</Tab>
            </TabList>

            {/* Details Tab */}
            <TabPanel value="details" className="pt-6">
              <VStack gap={6}>
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
              </VStack>
            </TabPanel>

            {/* Policies Tab */}
            <TabPanel value="policies" className="pt-6">
              <VStack gap={3}>
                <div className="flex items-center gap-1">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      value={policySearchTerm}
                      onChange={(e) => {
                        setPolicySearchTerm(e.target.value);
                        setPolicyCurrentPage(1);
                      }}
                      placeholder="Search policies by attributes"
                    />
                  </div>
                  <button
                    type="button"
                    className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
                    aria-label="Download"
                  >
                    <IconDownload size={12} stroke={1.5} />
                  </button>
                </div>

                <Pagination
                  currentPage={policyCurrentPage}
                  totalPages={totalPolicyPages}
                  onPageChange={setPolicyCurrentPage}
                  totalItems={filteredPolicies.length}
                />

                <Table columns={policyColumns} data={paginatedPolicies} rowKey="id" />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}
