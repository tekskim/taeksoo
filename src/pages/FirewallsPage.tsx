import { useState, useMemo, useEffect } from 'react';
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
  FilterSearchInput,
  Pagination,
  ListToolbar,
  StatusIndicator,
  ContextMenu,
  ConfirmModal,
  Badge,
  PageShell,
  PageHeader,
  fixedColumns,
  Popover,
} from '@/design-system';
import type {
  TableColumn,
  ContextMenuItem,
  FilterField,
  AppliedFilter,
  FilterItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconDownload, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

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

type DeleteTarget =
  | { kind: 'firewall'; item: Firewall }
  | { kind: 'policy'; item: FirewallPolicy }
  | { kind: 'rule'; item: FirewallRule };

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
  name: `nacl-${i + 1}`,
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
  createdAt: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]} ${(i % 28) + 1}, 2026 ${String(8 + (i % 16)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}`,
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
  firstFirewall: `nacl-${i + 1}`,
  firstFirewallId: `294u92s${i}`,
  audited: i % 2 === 0,
  shared: i % 3 === 0,
  adminState: i % 4 === 0 ? 'Down' : 'Up',
  createdAt: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]} ${(i % 28) + 1}, 2026`,
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
  createdAt: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]} ${(i % 28) + 1}, 2026`,
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const firewallStatusMap: Record<FirewallStatus, 'active' | 'down' | 'error'> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const firewallFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'id', label: 'ID', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'down', label: 'Down' },
      { value: 'error', label: 'Error' },
    ],
  },
  { id: 'tenant', label: 'Tenant', type: 'text' },
  { id: 'ingressPolicy', label: 'Ingress policy', type: 'text' },
  { id: 'egressPolicy', label: 'Egress policy', type: 'text' },
  { id: 'associatedPorts', label: 'Associated ports', type: 'text' },
  {
    id: 'adminState',
    label: 'Admin state',
    type: 'select',
    options: [
      { value: 'Up', label: 'Up' },
      { value: 'Down', label: 'Down' },
    ],
  },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

const policyFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'id', label: 'ID', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'down', label: 'Down' },
      { value: 'error', label: 'Error' },
    ],
  },
  { id: 'tenant', label: 'Tenant', type: 'text' },
  { id: 'firstRule', label: 'First rule', type: 'text' },
  { id: 'firstFirewall', label: 'First NACL', type: 'text' },
  {
    id: 'shared',
    label: 'Shared',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    id: 'audited',
    label: 'Audited',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

const ruleFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'id', label: 'ID', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'down', label: 'Down' },
      { value: 'error', label: 'Error' },
    ],
  },
  { id: 'tenant', label: 'Tenant', type: 'text' },
  {
    id: 'protocol',
    label: 'Protocol',
    type: 'select',
    options: [
      { value: 'tcp', label: 'TCP' },
      { value: 'udp', label: 'UDP' },
      { value: 'icmp', label: 'ICMP' },
      { value: 'any', label: 'Any' },
    ],
  },
  {
    id: 'action',
    label: 'Rule action',
    type: 'select',
    options: [
      { value: 'allow', label: 'Allow' },
      { value: 'deny', label: 'Deny' },
      { value: 'reject', label: 'Reject' },
    ],
  },
  { id: 'sourceIp', label: 'Source IP', type: 'text' },
  { id: 'sourcePort', label: 'Source port', type: 'text' },
  { id: 'destinationIp', label: 'Destination IP', type: 'text' },
  { id: 'destinationPort', label: 'Destination port', type: 'text' },
  {
    id: 'enabled',
    label: 'Enabled',
    type: 'select',
    options: [
      { value: 'true', label: 'On' },
      { value: 'false', label: 'Off' },
    ],
  },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function FirewallsPage() {
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'firewalls';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Firewalls state
  const [firewallRows, setFirewallRows] = useState(mockFirewalls);
  const [firewallAppliedFilters, setFirewallAppliedFilters] = useState<AppliedFilter[]>([]);
  const [firewallCurrentPage, setFirewallCurrentPage] = useState(1);
  const [selectedFirewalls, setSelectedFirewalls] = useState<string[]>([]);
  const firewallsPerPage = 10;

  // Policies state
  const [policyRows, setPolicyRows] = useState(mockFirewallPolicies);
  const [policyAppliedFilters, setPolicyAppliedFilters] = useState<AppliedFilter[]>([]);
  const [policyCurrentPage, setPolicyCurrentPage] = useState(1);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const policiesPerPage = 10;

  // Rules state
  const [ruleRows, setRuleRows] = useState(mockFirewallRules);
  const [ruleAppliedFilters, setRuleAppliedFilters] = useState<AppliedFilter[]>([]);
  const [ruleCurrentPage, setRuleCurrentPage] = useState(1);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const rulesPerPage = 10;

  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteTarget | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [bulkDeleteKind, setBulkDeleteKind] = useState<'firewall' | 'policy' | 'rule' | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Firewalls');
  }, [updateActiveTabLabel]);

  const navigate = useNavigate();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [{ label: 'NACLs' }];

  const firewallToolbarFilters: FilterItem[] = firewallAppliedFilters.map((f) => ({
    id: f.id,
    field: f.fieldLabel,
    value: f.valueLabel || f.value,
  }));

  const policyToolbarFilters: FilterItem[] = policyAppliedFilters.map((f) => ({
    id: f.id,
    field: f.fieldLabel,
    value: f.valueLabel || f.value,
  }));

  const ruleToolbarFilters: FilterItem[] = ruleAppliedFilters.map((f) => ({
    id: f.id,
    field: f.fieldLabel,
    value: f.valueLabel || f.value,
  }));

  const removeFirewallFilter = (filterId: string) => {
    setFirewallAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const removePolicyFilter = (filterId: string) => {
    setPolicyAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const removeRuleFilter = (filterId: string) => {
    setRuleAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  // Filtered firewalls
  const filteredFirewalls = useMemo(() => {
    if (firewallAppliedFilters.length === 0) return firewallRows;
    return firewallRows.filter((fw) => {
      return firewallAppliedFilters.every((filter) => {
        if (filter.fieldId === 'associatedPorts') {
          const ports = fw.associatedPorts.map((p) => p.name).join(' ');
          return ports.toLowerCase().includes(filter.value.toLowerCase());
        }
        const value = String(fw[filter.fieldId as keyof Firewall] ?? '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [firewallRows, firewallAppliedFilters]);

  const totalFirewallPages = Math.ceil(filteredFirewalls.length / firewallsPerPage);
  const paginatedFirewalls = useMemo(() => {
    const start = (firewallCurrentPage - 1) * firewallsPerPage;
    return filteredFirewalls.slice(start, start + firewallsPerPage);
  }, [filteredFirewalls, firewallCurrentPage]);

  // Filtered policies
  const filteredPolicies = useMemo(() => {
    if (policyAppliedFilters.length === 0) return policyRows;
    return policyRows.filter((p) => {
      return policyAppliedFilters.every((filter) => {
        if (filter.fieldId === 'shared') {
          return String(p.shared) === filter.value;
        }
        if (filter.fieldId === 'audited') {
          return String(p.audited) === filter.value;
        }
        const value = String(p[filter.fieldId as keyof FirewallPolicy] ?? '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [policyRows, policyAppliedFilters]);

  const totalPolicyPages = Math.ceil(filteredPolicies.length / policiesPerPage);
  const paginatedPolicies = useMemo(() => {
    const start = (policyCurrentPage - 1) * policiesPerPage;
    return filteredPolicies.slice(start, start + policiesPerPage);
  }, [filteredPolicies, policyCurrentPage]);

  // Filtered rules
  const filteredRules = useMemo(() => {
    if (ruleAppliedFilters.length === 0) return ruleRows;
    return ruleRows.filter((r) => {
      return ruleAppliedFilters.every((filter) => {
        if (filter.fieldId === 'enabled') {
          return String(r.enabled) === filter.value;
        }
        const value = String(r[filter.fieldId as keyof FirewallRule] ?? '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [ruleRows, ruleAppliedFilters]);

  const totalRulePages = Math.ceil(filteredRules.length / rulesPerPage);
  const paginatedRules = useMemo(() => {
    const start = (ruleCurrentPage - 1) * rulesPerPage;
    return filteredRules.slice(start, start + rulesPerPage);
  }, [filteredRules, ruleCurrentPage]);

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      const id = itemToDelete.item.id;
      switch (itemToDelete.kind) {
        case 'firewall':
          setFirewallRows((prev) => prev.filter((fw) => fw.id !== id));
          setSelectedFirewalls((s) => s.filter((x) => x !== id));
          break;
        case 'policy':
          setPolicyRows((prev) => prev.filter((p) => p.id !== id));
          setSelectedPolicies((s) => s.filter((x) => x !== id));
          break;
        case 'rule':
          setRuleRows((prev) => prev.filter((r) => r.id !== id));
          setSelectedRules((s) => s.filter((x) => x !== id));
          break;
      }
    }
    handleDeleteCancel();
  };

  const handleBulkDeleteCancel = () => {
    setIsBulkDeleteOpen(false);
    setBulkDeleteKind(null);
  };

  const handleBulkDeleteConfirm = () => {
    if (bulkDeleteKind === 'firewall') {
      setFirewallRows((prev) => prev.filter((fw) => !selectedFirewalls.includes(fw.id)));
      setSelectedFirewalls([]);
    } else if (bulkDeleteKind === 'policy') {
      setPolicyRows((prev) => prev.filter((p) => !selectedPolicies.includes(p.id)));
      setSelectedPolicies([]);
    } else if (bulkDeleteKind === 'rule') {
      setRuleRows((prev) => prev.filter((r) => !selectedRules.includes(r.id)));
      setSelectedRules([]);
    }
    handleBulkDeleteCancel();
  };

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
      onClick: () => {
        setItemToDelete({ kind: 'firewall', item: fw });
        setDeleteModalOpen(true);
      },
    },
  ];

  const getPolicyMenuItems = (p: FirewallPolicy): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit policy', p.id) },
    { id: 'manage-rules', label: 'Manage rules', onClick: () => console.log('Manage rules', p.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => {
        setItemToDelete({ kind: 'policy', item: p });
        setDeleteModalOpen(true);
      },
    },
  ];

  const getRuleMenuItems = (r: FirewallRule): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit rule', r.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => {
        setItemToDelete({ kind: 'rule', item: r });
        setDeleteModalOpen(true);
      },
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
            to={`/compute/firewalls/${row.id}`}
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
      key: 'ingressPolicy',
      label: 'Ingress Policy',
      flex: 1,
      sortable: true,
      render: (_, row) =>
        row.ingressPolicy ? (
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute/firewall-policies/${row.ingressPolicyId}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.ingressPolicy}
            </Link>
            <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
              <span className="truncate" title={row.ingressPolicyId}>
                ID : {row.ingressPolicyId.slice(0, 8)}
              </span>
              <InlineCopyId value={row.ingressPolicyId} />
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
              to={`/compute/firewall-policies/${row.egressPolicyId}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.egressPolicy}
            </Link>
            <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
              <span className="truncate" title={row.egressPolicyId}>
                ID : {row.egressPolicyId.slice(0, 8)}
              </span>
              <InlineCopyId value={row.egressPolicyId} />
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
              <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
                <span className="truncate" title={row.associatedPorts[0].id}>
                  ID : {row.associatedPorts[0].id.slice(0, 8)}
                </span>
                <InlineCopyId value={row.associatedPorts[0].id} />
              </span>
            </div>
            {row.associatedPorts.length > 1 && (
              <span className="ml-auto">
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[160px] max-w-[320px]">
                      <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                        All Ports ({row.associatedPorts.length})
                      </div>
                      <div className="flex flex-wrap gap-1 items-start min-w-[136px]">
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
              </span>
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
      sticky: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getFirewallMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
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
            to={`/compute/firewall-policies/${row.id}`}
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
      key: 'rules',
      label: 'Rules',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[var(--color-text-default)]">{row.firstRule}</span>
            <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
              <span className="truncate" title={row.firstRuleId}>
                ID : {row.firstRuleId.slice(0, 8)}
              </span>
              <InlineCopyId value={row.firstRuleId} />
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
      label: 'NACLs',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[var(--color-text-default)]">{row.firstFirewall}</span>
            <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
              <span className="truncate" title={row.firstFirewallId}>
                ID : {row.firstFirewallId.slice(0, 8)}
              </span>
              <InlineCopyId value={row.firstFirewallId} />
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
      sticky: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getPolicyMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
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
            to={`/compute/firewall-rules/${row.id}`}
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
      sticky: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getRuleMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
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
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader
          title="NACLs"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (activeTab === 'firewalls') {
                  navigate('/compute/firewall/create');
                } else if (activeTab === 'policies') {
                  navigate('/compute/firewall/create-policy');
                } else {
                  navigate('/compute/firewall/create-rule');
                }
              }}
            >
              {activeTab === 'firewalls'
                ? 'Create NACL'
                : activeTab === 'policies'
                  ? 'Create NACL policy'
                  : 'Create NACL rule'}
            </Button>
          }
        />

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="firewalls">NACLs</Tab>
            <Tab value="policies">NACL policies</Tab>
            <Tab value="rules">NACL rules</Tab>
          </TabList>

          {/* NACLs Tab */}
          <TabPanel value="firewalls" className="pt-3">
            <VStack gap={3}>
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={firewallFilterFields}
                      appliedFilters={firewallAppliedFilters}
                      onFiltersChange={(f) => {
                        setFirewallAppliedFilters(f);
                        setFirewallCurrentPage(1);
                      }}
                      placeholder="Search by attributes"
                      size="sm"
                      className="w-[var(--search-input-width)]"
                      hideAppliedFilters
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
                      aria-label="Download"
                      onClick={() => console.log('Download')}
                    >
                      <IconDownload size={12} stroke={1.5} />
                    </button>
                  </ListToolbar.Actions>
                }
                bulkActions={
                  <ListToolbar.Actions>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconTrash size={12} />}
                      disabled={selectedFirewalls.length === 0}
                      onClick={() => {
                        setBulkDeleteKind('firewall');
                        setIsBulkDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </ListToolbar.Actions>
                }
                filters={firewallToolbarFilters}
                onFilterRemove={removeFirewallFilter}
                onFiltersClear={() => setFirewallAppliedFilters([])}
              />

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
                emptyMessage="No firewalls found"
                selectable
                selectedKeys={selectedFirewalls}
                onSelectionChange={setSelectedFirewalls}
                loading={loading}
              />
            </VStack>
          </TabPanel>

          {/* Policies Tab */}
          <TabPanel value="policies" className="pt-3">
            <VStack gap={3}>
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={policyFilterFields}
                      appliedFilters={policyAppliedFilters}
                      onFiltersChange={(f) => {
                        setPolicyAppliedFilters(f);
                        setPolicyCurrentPage(1);
                      }}
                      placeholder="Search by attributes"
                      size="sm"
                      className="w-[var(--search-input-width)]"
                      hideAppliedFilters
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
                      aria-label="Download"
                      onClick={() => console.log('Download')}
                    >
                      <IconDownload size={12} stroke={1.5} />
                    </button>
                  </ListToolbar.Actions>
                }
                bulkActions={
                  <ListToolbar.Actions>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconTrash size={12} />}
                      disabled={selectedPolicies.length === 0}
                      onClick={() => {
                        setBulkDeleteKind('policy');
                        setIsBulkDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </ListToolbar.Actions>
                }
                filters={policyToolbarFilters}
                onFilterRemove={removePolicyFilter}
                onFiltersClear={() => setPolicyAppliedFilters([])}
              />

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
                emptyMessage="No policies found"
                selectable
                selectedKeys={selectedPolicies}
                onSelectionChange={setSelectedPolicies}
                loading={loading}
              />
            </VStack>
          </TabPanel>

          {/* Rules Tab */}
          <TabPanel value="rules" className="pt-3">
            <VStack gap={3}>
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={ruleFilterFields}
                      appliedFilters={ruleAppliedFilters}
                      onFiltersChange={(f) => {
                        setRuleAppliedFilters(f);
                        setRuleCurrentPage(1);
                      }}
                      placeholder="Search by attributes"
                      size="sm"
                      className="w-[var(--search-input-width)]"
                      hideAppliedFilters
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
                      aria-label="Download"
                      onClick={() => console.log('Download')}
                    >
                      <IconDownload size={12} stroke={1.5} />
                    </button>
                  </ListToolbar.Actions>
                }
                bulkActions={
                  <ListToolbar.Actions>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconTrash size={12} />}
                      disabled={selectedRules.length === 0}
                      onClick={() => {
                        setBulkDeleteKind('rule');
                        setIsBulkDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </ListToolbar.Actions>
                }
                filters={ruleToolbarFilters}
                onFilterRemove={removeRuleFilter}
                onFiltersClear={() => setRuleAppliedFilters([])}
              />

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
                emptyMessage="No rules found"
                selectable
                selectedKeys={selectedRules}
                onSelectionChange={setSelectedRules}
                loading={loading}
              />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={
          itemToDelete?.kind === 'firewall'
            ? 'Delete NACL'
            : itemToDelete?.kind === 'policy'
              ? 'Delete NACL policy'
              : 'Delete NACL rule'
        }
        description="This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel={
          itemToDelete?.kind === 'firewall'
            ? 'NACL name'
            : itemToDelete?.kind === 'policy'
              ? 'Policy name'
              : 'Rule name'
        }
        infoValue={itemToDelete?.item.name}
      />

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={handleBulkDeleteCancel}
        onConfirm={handleBulkDeleteConfirm}
        title={
          bulkDeleteKind === 'firewall'
            ? 'Delete selected NACLs'
            : bulkDeleteKind === 'policy'
              ? 'Delete selected NACL policies'
              : 'Delete selected NACL rules'
        }
        description="This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={
          bulkDeleteKind === 'firewall'
            ? `${selectedFirewalls.length} NACL(s)`
            : bulkDeleteKind === 'policy'
              ? `${selectedPolicies.length} policy(ies)`
              : bulkDeleteKind === 'rule'
                ? `${selectedRules.length} rule(s)`
                : '0'
        }
      />
    </PageShell>
  );
}
