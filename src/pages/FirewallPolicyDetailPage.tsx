import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
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
  Table,
  SearchInput,
  Pagination,
  DetailHeader,
  PageShell,
  type TableColumn,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell, IconDownload } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface FirewallPolicyDetail {
  id: string;
  name: string;
  tenant: string;
  tenantId: string;
  description: string;
  shared: boolean;
  audited: boolean;
}

interface FirewallRule {
  id: string;
  name: string;
  tenant: string;
  tenantId: string;
  protocol: string;
  action: 'ALLOW' | 'DENY' | 'REJECT';
  sourceIp: string;
  sourcePort: string;
  destinationIp: string;
  destinationPort: string;
  enabled: boolean;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPoliciesMap: Record<string, FirewallPolicyDetail> = {
  'fwp-001': {
    id: '7284d9174e81431e93060a9b',
    name: 'policy',
    tenant: 'tenantA',
    tenantId: 'tenant-001',
    description: '-',
    shared: false,
    audited: false,
  },
  'fwp-002': {
    id: '8394e0285f92542f04171b0c',
    name: 'egress-policy-1',
    tenant: 'tenantA',
    tenantId: 'tenant-001',
    description: 'Egress policy for web traffic',
    shared: true,
    audited: true,
  },
  'fwp-003': {
    id: '9405f1396g03653g15282c1d',
    name: 'db-ingress-policy',
    tenant: 'tenantB',
    tenantId: 'tenant-002',
    description: 'Database ingress policy',
    shared: false,
    audited: true,
  },
};

const defaultPolicyDetail: FirewallPolicyDetail = {
  id: 'unknown',
  name: 'Unknown Policy',
  tenant: '-',
  tenantId: '',
  description: '-',
  shared: false,
  audited: false,
};

const mockRules: FirewallRule[] = Array.from({ length: 115 }, (_, i) => ({
  id: `rule-${String(i + 1).padStart(3, '0')}`,
  name: `rule`,
  tenant: `tenant`,
  tenantId: `tenant-${String((i % 3) + 1).padStart(3, '0')}`,
  protocol: ['TCP', 'UDP', 'ICMP', 'ANY'][i % 4],
  action: ['ALLOW', 'DENY', 'REJECT'][i % 3] as 'ALLOW' | 'DENY' | 'REJECT',
  sourceIp: `203.0.113.${50 + (i % 50)}`,
  sourcePort: i % 3 === 0 ? '-' : String(1000 + i * 10),
  destinationIp: `10.0.0.${5 + (i % 50)}/32`,
  destinationPort: ['22', '80', '443', '3306', '5432'][i % 5],
  enabled: i % 4 !== 0,
}));

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function FirewallPolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rules';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Rules state
  const [ruleSearchTerm, setRuleSearchTerm] = useState('');
  const [ruleCurrentPage, setRuleCurrentPage] = useState(1);
  const rulesPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Get policy data based on URL ID
  const policy = id ? mockPoliciesMap[id] || defaultPolicyDetail : defaultPolicyDetail;

  // Update tab label to policy name
  useEffect(() => {
    if (policy.name) {
      updateActiveTabLabel(policy.name);
    }
  }, [policy.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter rules based on search
  const filteredRules = useMemo(() => {
    if (!ruleSearchTerm) return mockRules;
    const query = ruleSearchTerm.toLowerCase();
    return mockRules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(query) ||
        rule.protocol.toLowerCase().includes(query) ||
        rule.sourceIp.toLowerCase().includes(query) ||
        rule.destinationIp.toLowerCase().includes(query)
    );
  }, [ruleSearchTerm]);

  // Paginated rules
  const paginatedRules = useMemo(() => {
    const start = (ruleCurrentPage - 1) * rulesPerPage;
    return filteredRules.slice(start, start + rulesPerPage);
  }, [filteredRules, ruleCurrentPage, rulesPerPage]);

  // Rule columns
  const ruleColumns: TableColumn<FirewallRule>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/firewall-rules/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.id}</span>
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
      key: 'action',
      label: 'Action',
      flex: 1,
      sortable: true,
    },
    {
      key: 'sourceIp',
      label: 'Source IP',
      flex: 1,
    },
    {
      key: 'sourcePort',
      label: 'Source Port',
      flex: 1,
    },
    {
      key: 'destinationIp',
      label: 'Destination IP',
      flex: 1,
    },
    {
      key: 'destinationPort',
      label: 'Destination Port',
      flex: 1,
    },
    {
      key: 'enabled',
      label: 'Enabled',
      flex: 1,
      render: (_, row) => (row.enabled ? 'On' : 'Off'),
    },
  ];

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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/compute' },
                { label: 'NACLs', href: '/compute/firewall' },
                { label: policy.name },
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
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={8} className="min-w-[1176px]">
        {/* Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{policy.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="ID" value={policy.id} copyable />
            <DetailHeader.InfoCard label="Description" value={policy.description || '-'} />
            <DetailHeader.InfoCard label="Tenant" value={policy.tenant} />
            <DetailHeader.InfoCard label="Shared" value={policy.shared ? 'Yes' : 'No'} />
            <DetailHeader.InfoCard label="Audited" value={policy.audited ? 'Yes' : 'No'} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs Section */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab value="rules">Rules</Tab>
            </TabList>

            {/* Rules Tab */}
            <TabPanel value="rules" className="pt-6">
              <VStack gap={3}>
                {/* Sub Header */}
                <h3 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Rules
                </h3>
                {/* Action Bar */}
                <div className="flex items-center gap-1">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      value={ruleSearchTerm}
                      onChange={(e) => {
                        setRuleSearchTerm(e.target.value);
                        setRuleCurrentPage(1);
                      }}
                      placeholder="Search rules by attributes"
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

                {/* Pagination */}
                <Pagination
                  currentPage={ruleCurrentPage}
                  totalPages={Math.ceil(filteredRules.length / rulesPerPage)}
                  onPageChange={setRuleCurrentPage}
                  totalItems={filteredRules.length}
                />

                {/* Table */}
                <Table columns={ruleColumns} data={paginatedRules} rowKey="id" />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}
