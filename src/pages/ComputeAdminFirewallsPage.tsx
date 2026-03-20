import { useState, useMemo } from 'react';
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
  StatusIndicator,
  ContextMenu,
  Badge,
  PageShell,
  PageHeader,
  fixedColumns,
  Popover,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell, IconDownload, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type FirewallStatus = 'active' | 'down' | 'error';
type AdminState = 'Up' | 'Down';

interface Firewall {
  id: string;
  name: string;
  status: FirewallStatus;
  tenant: string;
  tenantId: string;
  ingressPolicy: string | null;
  ingressPolicyId: string | null;
  egressPolicy: string | null;
  egressPolicyId: string | null;
  associatedPorts: { name: string; id: string }[];
  adminState: AdminState;
  createdAt: string;
}

interface FirewallPolicy {
  id: string;
  name: string;
  status: FirewallStatus;
  tenant: string;
  tenantId: string;
  rulesCount: number;
  firstRule: string;
  firstRuleId: string;
  firewallsCount: number;
  firstFirewall: string;
  firstFirewallId: string;
  audited: boolean;
  shared: boolean;
  adminState: AdminState;
  createdAt: string;
}

interface FirewallRule {
  id: string;
  name: string;
  status: FirewallStatus;
  tenant: string;
  tenantId: string;
  protocol: string;
  sourceIp: string;
  sourcePort: string;
  destinationIp: string;
  destinationPort: string;
  action: 'allow' | 'deny' | 'reject';
  enabled: boolean;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFirewalls: Firewall[] = Array.from({ length: 25 }, (_, i) => ({
  id: `fw-${String(i + 1).padStart(3, '0')}`,
  name: `firewall-${i + 1}`,
  status: i % 10 === 0 ? 'down' : 'active',
  tenant: `tenant-${(i % 3) + 1}`,
  tenantId: `tenant-${String((i % 3) + 1).padStart(3, '0')}`,
  ingressPolicy: i % 4 === 0 ? null : `ingress-policy-${(i % 5) + 1}`,
  ingressPolicyId: i % 4 === 0 ? null : `policy-ing-${String((i % 5) + 1).padStart(3, '0')}`,
  egressPolicy: i % 3 === 0 ? null : `egress-policy-${(i % 4) + 1}`,
  egressPolicyId: i % 3 === 0 ? null : `policy-egr-${String((i % 4) + 1).padStart(3, '0')}`,
  associatedPorts:
    i % 2 === 0
      ? [
          { name: `port-${i + 1}`, id: `port-${String(i + 1).padStart(3, '0')}` },
          { name: `port-${i + 2}`, id: `port-${String(i + 2).padStart(3, '0')}` },
          { name: `port-${i + 3}`, id: `port-${String(i + 3).padStart(3, '0')}` },
        ]
      : [],
  adminState: i % 5 === 0 ? 'Down' : 'Up',
  createdAt: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]} ${(i % 28) + 1}, 2025 ${String(8 + (i % 16)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}`,
}));

const mockFirewallPolicies: FirewallPolicy[] = Array.from({ length: 20 }, (_, i) => ({
  id: `fwp-${String(i + 1).padStart(3, '0')}`,
  name: `policy-${i + 1}`,
  status: i % 8 === 0 ? 'down' : 'active',
  tenant: `tenant-${(i % 3) + 1}`,
  tenantId: `tenant-${String((i % 3) + 1).padStart(3, '0')}`,
  rulesCount: (i % 10) + 1,
  firstRule: `rule-${i + 1}`,
  firstRuleId: `294u92s${i}`,
  firewallsCount: (i % 5) + 1,
  firstFirewall: `firewall-${i + 1}`,
  firstFirewallId: `294u92s${i}`,
  audited: i % 2 === 0,
  shared: i % 3 === 0,
  adminState: i % 4 === 0 ? 'Down' : 'Up',
  createdAt: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]} ${(i % 28) + 1}, 2025`,
}));

const mockFirewallRules: FirewallRule[] = Array.from({ length: 30 }, (_, i) => ({
  id: `fwr-${String(i + 1).padStart(3, '0')}`,
  name: `rule-${i + 1}`,
  status: i % 12 === 0 ? 'down' : 'active',
  tenant: `tenant-${(i % 3) + 1}`,
  tenantId: `tenant-${String((i % 3) + 1).padStart(3, '0')}`,
  protocol: ['tcp', 'udp', 'icmp', 'any'][i % 4],
  sourceIp: i % 2 === 0 ? '0.0.0.0/0' : `192.168.${i}.0/24`,
  sourcePort: i % 3 === 0 ? 'any' : String(1000 + i * 10),
  destinationIp: i % 2 === 0 ? `10.0.${i}.0/24` : '0.0.0.0/0',
  destinationPort: ['80', '443', '22', '3306', 'any'][i % 5],
  action: ['allow', 'deny', 'reject'][i % 3] as 'allow' | 'deny' | 'reject',
  enabled: i % 4 !== 0,
  createdAt: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]} ${(i % 28) + 1}, 2025`,
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const firewallStatusMap: Record<FirewallStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function ComputeAdminFirewallsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'firewalls';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Firewalls state
  const [firewallSearchTerm, setFirewallSearchTerm] = useState('');
  const [firewallCurrentPage, setFirewallCurrentPage] = useState(1);
  const [selectedFirewalls, setSelectedFirewalls] = useState<string[]>([]);
  const firewallsPerPage = 10;

  // Policies state
  const [policySearchTerm, setPolicySearchTerm] = useState('');
  const [policyCurrentPage, setPolicyCurrentPage] = useState(1);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const policiesPerPage = 10;

  // Rules state
  const [ruleSearchTerm, setRuleSearchTerm] = useState('');
  const [ruleCurrentPage, setRuleCurrentPage] = useState(1);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const rulesPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();
  const navigate = useNavigate();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/compute-admin' },
    { label: 'Firewalls' },
  ];

  // Filtered firewalls
  const filteredFirewalls = useMemo(() => {
    if (!firewallSearchTerm) return mockFirewalls;
    const query = firewallSearchTerm.toLowerCase();
    return mockFirewalls.filter(
      (fw) =>
        fw.name.toLowerCase().includes(query) ||
        fw.id.toLowerCase().includes(query) ||
        fw.tenant.toLowerCase().includes(query)
    );
  }, [firewallSearchTerm]);

  const totalFirewallPages = Math.ceil(filteredFirewalls.length / firewallsPerPage);
  const paginatedFirewalls = useMemo(() => {
    const start = (firewallCurrentPage - 1) * firewallsPerPage;
    return filteredFirewalls.slice(start, start + firewallsPerPage);
  }, [filteredFirewalls, firewallCurrentPage]);

  // Filtered policies
  const filteredPolicies = useMemo(() => {
    if (!policySearchTerm) return mockFirewallPolicies;
    const query = policySearchTerm.toLowerCase();
    return mockFirewallPolicies.filter(
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

  // Filtered rules
  const filteredRules = useMemo(() => {
    if (!ruleSearchTerm) return mockFirewallRules;
    const query = ruleSearchTerm.toLowerCase();
    return mockFirewallRules.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query) ||
        r.protocol.toLowerCase().includes(query)
    );
  }, [ruleSearchTerm]);

  const totalRulePages = Math.ceil(filteredRules.length / rulesPerPage);
  const paginatedRules = useMemo(() => {
    const start = (ruleCurrentPage - 1) * rulesPerPage;
    return filteredRules.slice(start, start + rulesPerPage);
  }, [filteredRules, ruleCurrentPage]);

  // Context menu items
  const getFirewallMenuItems = (fw: Firewall): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit firewall', fw.id) },
    {
      id: 'manage-ports',
      label: 'Manage ports',
      onClick: () => console.log('Manage ports', fw.id),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete firewall', fw.id),
    },
  ];

  const getPolicyMenuItems = (p: FirewallPolicy): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit policy', p.id) },
    { id: 'manage-rules', label: 'Manage rules', onClick: () => console.log('Manage rules', p.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete policy', p.id),
    },
  ];

  const getRuleMenuItems = (r: FirewallRule): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit rule', r.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete rule', r.id),
    },
  ];

  // Firewall columns
  const firewallColumns: TableColumn<Firewall>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator layout="icon-only" status={firewallStatusMap[row.status]} />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/firewalls/${row.id}`}
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
      key: 'tenant',
      label: 'Tenant',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/tenants/${row.tenantId}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.tenant}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.tenantId}</span>
        </div>
      ),
    },
    {
      key: 'ingressPolicy',
      label: 'Ingress Policy',
      flex: 1,
      sortable: true,
      render: (_, row) =>
        row.ingressPolicy ? (
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute-admin/firewall-policies/${row.ingressPolicyId}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.ingressPolicy}
            </Link>
            <span className="text-body-sm text-[var(--color-text-muted)]">
              ID: {row.ingressPolicyId}
            </span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
    {
      key: 'egressPolicy',
      label: 'Egress Policy',
      flex: 1,
      sortable: true,
      render: (_, row) =>
        row.egressPolicy ? (
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute-admin/firewall-policies/${row.egressPolicyId}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.egressPolicy}
            </Link>
            <span className="text-body-sm text-[var(--color-text-muted)]">
              ID: {row.egressPolicyId}
            </span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
    {
      key: 'associatedPorts',
      label: 'Associated Ports',
      flex: 1,
      sortable: true,
      render: (_, row) =>
        row.associatedPorts.length > 0 ? (
          <div className="flex items-center gap-1 min-w-0">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[var(--color-text-default)]">
                {row.associatedPorts[0].name}
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                ID: {row.associatedPorts[0].id}
              </span>
            </div>
            {row.associatedPorts.length > 1 && (
              <Popover
                trigger="hover"
                position="bottom"
                delay={100}
                hideDelay={100}
                content={
                  <div className="p-3 min-w-[120px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All Ports ({row.associatedPorts.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {row.associatedPorts.map((p, i) => (
                        <Badge key={i} theme="white" size="sm">
                          {p.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                  +{row.associatedPorts.length - 1}
                </span>
              </Popover>
            )}
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
    {
      key: 'adminState',
      label: 'Admin state',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <Badge variant={row.adminState === 'Up' ? 'success' : 'default'} size="sm">
          {row.adminState}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getFirewallMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  // Policy columns
  const policyColumns: TableColumn<FirewallPolicy>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/firewall-policies/${row.id}`}
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
      key: 'tenant',
      label: 'Tenant',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/tenants/${row.tenantId}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.tenant}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.tenantId}</span>
        </div>
      ),
    },
    {
      key: 'rules',
      label: 'Rules',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[var(--color-text-default)]">{row.firstRule}</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID:{row.firstRuleId}
            </span>
          </div>
          {row.rulesCount > 1 && (
            <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] h-5 ml-auto">
              +{row.rulesCount - 1}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'firewalls',
      label: 'Firewalls',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[var(--color-text-default)]">{row.firstFirewall}</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID:{row.firstFirewallId}
            </span>
          </div>
          {row.firewallsCount > 1 && (
            <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] h-5 ml-auto">
              +{row.firewallsCount - 1}
            </span>
          )}
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
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getPolicyMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

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
            to={`/compute-admin/firewall-rules/${row.id}`}
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
      key: 'tenant',
      label: 'Tenant',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/tenants/${row.tenantId}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.tenant}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.tenantId}</span>
        </div>
      ),
    },
    {
      key: 'protocol',
      label: 'Protocol',
      flex: 1,
      sortable: true,
      render: (_, row) => row.protocol.toUpperCase(),
    },
    {
      key: 'action',
      label: 'Rule Action',
      flex: 1,
      sortable: true,
      render: (_, row) => row.action.toUpperCase(),
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
      render: (_, row) => row.sourcePort || '-',
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
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getRuleMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Firewalls"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (activeTab === 'firewalls') {
                  navigate('/compute-admin/firewall/create');
                } else if (activeTab === 'policies') {
                  navigate('/compute-admin/firewall/create-policy');
                } else {
                  navigate('/compute-admin/firewall/create-rule');
                }
              }}
            >
              {activeTab === 'firewalls'
                ? 'Create firewall'
                : activeTab === 'policies'
                  ? 'Create policy'
                  : 'Create rule'}
            </Button>
          }
        />

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="firewalls">Firewalls</Tab>
            <Tab value="policies">Firewall policies</Tab>
            <Tab value="rules">Firewall rules</Tab>
          </TabList>

          {/* Firewalls Tab */}
          <TabPanel value="firewalls" className="pt-3">
            <VStack gap={3}>
              {/* Action Bar */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      value={firewallSearchTerm}
                      onChange={(e) => {
                        setFirewallSearchTerm(e.target.value);
                        setFirewallCurrentPage(1);
                      }}
                      placeholder="Search firewalls by attributes"
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
                <div className="h-4 w-px bg-[var(--color-border-default)]" />
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconTrash size={12} />}
                  disabled={selectedFirewalls.length === 0}
                >
                  Delete
                </Button>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={firewallCurrentPage}
                totalPages={totalFirewallPages}
                onPageChange={setFirewallCurrentPage}
                totalItems={filteredFirewalls.length}
                selectedCount={selectedFirewalls.length}
              />

              {/* Table */}
              <Table
                columns={firewallColumns}
                data={paginatedFirewalls}
                rowKey="id"
                selectable
                selectedKeys={selectedFirewalls}
                onSelectionChange={setSelectedFirewalls}
              />
            </VStack>
          </TabPanel>

          {/* Policies Tab */}
          <TabPanel value="policies" className="pt-3">
            <VStack gap={3}>
              {/* Action Bar */}
              <div className="flex items-center gap-2">
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
                <div className="h-4 w-px bg-[var(--color-border-default)]" />
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconTrash size={12} />}
                  disabled={selectedPolicies.length === 0}
                >
                  Delete
                </Button>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={policyCurrentPage}
                totalPages={totalPolicyPages}
                onPageChange={setPolicyCurrentPage}
                totalItems={filteredPolicies.length}
                selectedCount={selectedPolicies.length}
              />

              {/* Table */}
              <Table
                columns={policyColumns}
                data={paginatedPolicies}
                rowKey="id"
                selectable
                selectedKeys={selectedPolicies}
                onSelectionChange={setSelectedPolicies}
              />
            </VStack>
          </TabPanel>

          {/* Rules Tab */}
          <TabPanel value="rules" className="pt-3">
            <VStack gap={3}>
              {/* Action Bar */}
              <div className="flex items-center gap-2">
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
                <div className="h-4 w-px bg-[var(--color-border-default)]" />
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconTrash size={12} />}
                  disabled={selectedRules.length === 0}
                >
                  Delete
                </Button>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={ruleCurrentPage}
                totalPages={totalRulePages}
                onPageChange={setRuleCurrentPage}
                totalItems={filteredRules.length}
                selectedCount={selectedRules.length}
              />

              {/* Table */}
              <Table
                columns={ruleColumns}
                data={paginatedRules}
                rowKey="id"
                selectable
                selectedKeys={selectedRules}
                onSelectionChange={setSelectedRules}
              />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}
