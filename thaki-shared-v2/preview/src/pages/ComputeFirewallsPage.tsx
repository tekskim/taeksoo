import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { ActionModal } from '@shared/components/ActionModal';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

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

type FirewallPageDeleteTarget =
  | { kind: 'firewall'; item: Firewall }
  | { kind: 'policy'; item: FirewallPolicy }
  | { kind: 'rule'; item: FirewallRule };

const { mockFirewalls, mockFirewallPolicies, mockFirewallRules } = (() => {
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
    firstFirewall: `nacl-${i + 1}`,
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

  return { mockFirewalls, mockFirewallPolicies, mockFirewallRules };
})();

const firewallStatusMap: Record<FirewallStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

const firewallFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Search NACLs by attributes' },
];

const policyFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Search policies by attributes' },
];

const ruleFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Search rules by attributes' },
];

function firewallMatches(fw: Firewall, f: FilterKeyWithValue): boolean {
  const v = String(f.value ?? '').toLowerCase();
  if (!v) return true;
  return fw.name.toLowerCase().includes(v) || fw.id.toLowerCase().includes(v);
}

function policyMatches(p: FirewallPolicy, f: FilterKeyWithValue): boolean {
  const v = String(f.value ?? '').toLowerCase();
  if (!v) return true;
  return p.name.toLowerCase().includes(v) || p.id.toLowerCase().includes(v);
}

function ruleMatches(r: FirewallRule, f: FilterKeyWithValue): boolean {
  const v = String(f.value ?? '').toLowerCase();
  if (!v) return true;
  return (
    r.name.toLowerCase().includes(v) ||
    r.id.toLowerCase().includes(v) ||
    r.protocol.toLowerCase().includes(v)
  );
}

function FilterChips({
  filters,
  onRemove,
  onClear,
}: {
  filters: FilterKeyWithValue[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (filters.length === 0) return null;
  return (
    <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
      <div className="flex items-center gap-1 flex-wrap">
        {filters.map((filter) => (
          <span
            key={filter.id}
            className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
          >
            <span className="flex items-center gap-1">
              <span className="text-text">{filter.label}</span>
              <span className="text-border">|</span>
              <span className="text-text">{filter.displayValue ?? filter.value}</span>
            </span>
            <button
              type="button"
              className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
              onClick={() => onRemove(filter.id!)}
              aria-label={`Remove ${filter.label}`}
            >
              <IconX size={12} strokeWidth={2} />
            </button>
          </span>
        ))}
      </div>
      <button
        type="button"
        className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
        onClick={onClear}
      >
        Clear Filters
      </button>
    </div>
  );
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'policy', label: 'Policy', visible: true },
  { key: 'rules', label: 'Rules', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeFirewallsPage() {
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FirewallPageDeleteTarget | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'firewalls';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [firewallFilters, setFirewallFilters] = useState<FilterKeyWithValue[]>([]);
  const [policyFilters, setPolicyFilters] = useState<FilterKeyWithValue[]>([]);
  const [ruleFilters, setRuleFilters] = useState<FilterKeyWithValue[]>([]);

  const [firewallPage, setFirewallPage] = useState(1);
  const [policyPage, setPolicyPage] = useState(1);
  const [rulePage, setRulePage] = useState(1);

  const [selectedFirewalls, setSelectedFirewalls] = useState<(string | number)[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<(string | number)[]>([]);
  const [selectedRules, setSelectedRules] = useState<(string | number)[]>([]);

  const [fwSort, setFwSort] = useState('');
  const [fwOrder, setFwOrder] = useState<SortOrder>('asc');
  const [polSort, setPolSort] = useState('');
  const [polOrder, setPolOrder] = useState<SortOrder>('asc');
  const [ruleSort, setRuleSort] = useState('');
  const [ruleOrder, setRuleOrder] = useState<SortOrder>('asc');

  const perPage = 10;

  const filteredFirewalls = useMemo(() => {
    if (firewallFilters.length === 0) return mockFirewalls;
    return mockFirewalls.filter((fw) => firewallFilters.every((f) => firewallMatches(fw, f)));
  }, [firewallFilters]);

  const filteredPolicies = useMemo(() => {
    if (policyFilters.length === 0) return mockFirewallPolicies;
    return mockFirewallPolicies.filter((p) => policyFilters.every((f) => policyMatches(p, f)));
  }, [policyFilters]);

  const filteredRules = useMemo(() => {
    if (ruleFilters.length === 0) return mockFirewallRules;
    return mockFirewallRules.filter((r) => ruleFilters.every((f) => ruleMatches(r, f)));
  }, [ruleFilters]);

  const pageFirewalls = useMemo(
    () => filteredFirewalls.slice((firewallPage - 1) * perPage, firewallPage * perPage),
    [filteredFirewalls, firewallPage]
  );
  const pagePolicies = useMemo(
    () => filteredPolicies.slice((policyPage - 1) * perPage, policyPage * perPage),
    [filteredPolicies, policyPage]
  );
  const pageRules = useMemo(
    () => filteredRules.slice((rulePage - 1) * perPage, rulePage * perPage),
    [filteredRules, rulePage]
  );

  const createLabel =
    activeTab === 'firewalls'
      ? 'Create NACL'
      : activeTab === 'policies'
        ? 'Create NACL policy'
        : 'Create NACL rule';

  const onCreate = () => {
    if (activeTab === 'firewalls') navigate('/compute/firewall/create');
    else if (activeTab === 'policies') navigate('/compute/firewall/create-policy');
    else navigate('/compute/firewall/create-rule');
  };

  const fwColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 64, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'ingressPolicy', header: 'Ingress Policy', sortable: true },
    { key: 'egressPolicy', header: 'Egress Policy', sortable: true },
    { key: 'associatedPorts', header: 'Associated Ports', sortable: true },
    { key: 'adminState', header: 'Admin state', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const polColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'rules', header: 'Rules', sortable: true },
    { key: 'firewalls', header: 'NACLs', sortable: true },
    { key: 'shared', header: 'Shared' },
    { key: 'audited', header: 'Audited' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const ruleColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'protocol', header: 'Protocol', sortable: true },
    { key: 'action', header: 'Rule Action', sortable: true },
    { key: 'sourceIp', header: 'Source IP' },
    { key: 'sourcePort', header: 'Source Port' },
    { key: 'destinationIp', header: 'Destination IP' },
    { key: 'destinationPort', header: 'Destination Port' },
    { key: 'enabled', header: 'Enabled' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const addFw = useCallback((f: FilterKeyWithValue) => {
    setFirewallFilters((p) => [...p, f]);
    setFirewallPage(1);
  }, []);
  const addPol = useCallback((f: FilterKeyWithValue) => {
    setPolicyFilters((p) => [...p, f]);
    setPolicyPage(1);
  }, []);
  const addRule = useCallback((f: FilterKeyWithValue) => {
    setRuleFilters((p) => [...p, f]);
    setRulePage(1);
  }, []);

  const bulkSelectedCount =
    activeTab === 'firewalls'
      ? selectedFirewalls.length
      : activeTab === 'policies'
        ? selectedPolicies.length
        : selectedRules.length;

  const deleteTitle =
    deleteTarget?.kind === 'firewall'
      ? 'Delete firewall'
      : deleteTarget?.kind === 'policy'
        ? 'Delete NACL policy'
        : deleteTarget?.kind === 'rule'
          ? 'Delete NACL rule'
          : 'Delete';

  const bulkDeleteTitle =
    activeTab === 'firewalls'
      ? 'Delete firewalls'
      : activeTab === 'policies'
        ? 'Delete NACL policies'
        : 'Delete NACL rules';

  const bulkDeleteResourcePhrase =
    activeTab === 'firewalls'
      ? 'firewalls'
      : activeTab === 'policies'
        ? 'NACL policies'
        : 'NACL rules';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="NACLs" />
        <Button variant="primary" size="md" onClick={onCreate}>
          {createLabel}
        </Button>
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={setActiveTab}
        variant="line"
        size="sm"
        contentClassName="pt-3"
      >
        <Tab id="firewalls" label="NACLs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <FilterSearchInput
                  filterKeys={firewallFilterKeys}
                  onFilterAdd={addFw}
                  selectedFilters={firewallFilters}
                  placeholder="Search NACLs by attributes"
                  defaultFilterKey="name"
                />
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded-md border border-border-strong bg-surface text-text hover:bg-surface-muted"
                  aria-label="Download"
                >
                  <IconDownload size={12} stroke={1.5} />
                </button>
              </div>
              <div className="h-4 w-px bg-border" />
              <Button
                appearance="outline"
                variant="muted"
                size="sm"
                disabled={selectedFirewalls.length === 0}
                onClick={() => setBulkDeleteOpen(true)}
              >
                <IconTrash size={12} stroke={1.5} /> Delete
              </Button>
            </div>
            <FilterChips
              filters={firewallFilters}
              onRemove={(id) => {
                setFirewallFilters((p) => p.filter((x) => x.id !== id));
                setFirewallPage(1);
              }}
              onClear={() => {
                setFirewallFilters([]);
                setFirewallPage(1);
              }}
            />
            <Pagination
              totalCount={filteredFirewalls.length}
              size={perPage}
              currentAt={firewallPage}
              onPageChange={setFirewallPage}
              onSettingClick={() => setPrefsOpen(true)}
              totalCountLabel="items"
              selectedCount={selectedFirewalls.length}
            />
            <SelectableTable<Firewall>
              columns={fwColumns}
              rows={pageFirewalls}
              selectionType="checkbox"
              selectedRows={selectedFirewalls}
              onRowSelectionChange={setSelectedFirewalls}
              getRowId={(row) => row.id}
              sort={fwSort}
              order={fwOrder}
              onSortChange={(s, o) => {
                setFwSort(s ?? '');
                setFwOrder(o);
              }}
              stickyLastColumn
            >
              {pageFirewalls.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={fwColumns[0]}>
                    <StatusIndicator variant={firewallStatusMap[row.status]} layout="iconOnly" />
                  </Table.Td>
                  <Table.Td rowData={row} column={fwColumns[1]}>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <Link
                        to={`/compute/firewalls/${row.id}`}
                        className={`${linkClass} truncate`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row.name}
                      </Link>
                      <span className="text-body-sm text-[var(--color-text-muted)]">
                        ID: {row.id}
                      </span>
                    </div>
                  </Table.Td>
                  <Table.Td rowData={row} column={fwColumns[2]}>
                    {row.ingressPolicy ? (
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/firewall-policies/${row.ingressPolicyId}`}
                          className={`${linkClass} truncate`}
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
                    )}
                  </Table.Td>
                  <Table.Td rowData={row} column={fwColumns[3]}>
                    {row.egressPolicy ? (
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/firewall-policies/${row.egressPolicyId}`}
                          className={`${linkClass} truncate`}
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
                    )}
                  </Table.Td>
                  <Table.Td rowData={row} column={fwColumns[4]}>
                    {row.associatedPorts.length > 0 ? (
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
                          <span className="ml-auto">
                            <Tooltip
                              direction="bottom"
                              content={
                                <div className="p-3 min-w-[120px] max-w-[320px]">
                                  <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                                    All Ports ({row.associatedPorts.length})
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {row.associatedPorts.map((p, i) => (
                                      <Badge key={i} theme="gry" size="sm" type="subtle">
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
                            </Tooltip>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </Table.Td>
                  <Table.Td rowData={row} column={fwColumns[5]}>
                    <Badge theme={row.adminState === 'Up' ? 'gre' : 'gry'} size="sm" type="subtle">
                      {row.adminState}
                    </Badge>
                  </Table.Td>
                  <Table.Td rowData={row} column={fwColumns[6]}>
                    {stripTime(row.createdAt)}
                  </Table.Td>
                  <Table.Td rowData={row} column={fwColumns[7]} preventClickPropagation>
                    <ContextMenu.Root
                      direction="bottom-end"
                      gap={4}
                      trigger={({ toggle }) => (
                        <button
                          type="button"
                          onClick={toggle}
                          className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    >
                      <ContextMenu.Item action={() => console.log('Edit firewall', row.id)}>
                        Edit
                      </ContextMenu.Item>
                      <ContextMenu.Item action={() => console.log('Manage ports', row.id)}>
                        Manage ports
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        action={() => setDeleteTarget({ kind: 'firewall', item: row })}
                        danger
                      >
                        Delete
                      </ContextMenu.Item>
                    </ContextMenu.Root>
                  </Table.Td>
                </Table.Tr>
              ))}
            </SelectableTable>
          </div>
        </Tab>
        <Tab id="policies" label="NACL policies">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <FilterSearchInput
                  filterKeys={policyFilterKeys}
                  onFilterAdd={addPol}
                  selectedFilters={policyFilters}
                  placeholder="Search policies by attributes"
                  defaultFilterKey="name"
                />
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded-md border border-border-strong bg-surface text-text hover:bg-surface-muted"
                  aria-label="Download"
                >
                  <IconDownload size={12} stroke={1.5} />
                </button>
              </div>
              <div className="h-4 w-px bg-border" />
              <Button
                appearance="outline"
                variant="muted"
                size="sm"
                disabled={selectedPolicies.length === 0}
                onClick={() => setBulkDeleteOpen(true)}
              >
                <IconTrash size={12} stroke={1.5} /> Delete
              </Button>
            </div>
            <FilterChips
              filters={policyFilters}
              onRemove={(id) => {
                setPolicyFilters((p) => p.filter((x) => x.id !== id));
                setPolicyPage(1);
              }}
              onClear={() => {
                setPolicyFilters([]);
                setPolicyPage(1);
              }}
            />
            <Pagination
              totalCount={filteredPolicies.length}
              size={perPage}
              currentAt={policyPage}
              onPageChange={setPolicyPage}
              onSettingClick={() => setPrefsOpen(true)}
              totalCountLabel="items"
              selectedCount={selectedPolicies.length}
            />
            <SelectableTable<FirewallPolicy>
              columns={polColumns}
              rows={pagePolicies}
              selectionType="checkbox"
              selectedRows={selectedPolicies}
              onRowSelectionChange={setSelectedPolicies}
              getRowId={(row) => row.id}
              sort={polSort}
              order={polOrder}
              onSortChange={(s, o) => {
                setPolSort(s ?? '');
                setPolOrder(o);
              }}
              stickyLastColumn
            >
              {pagePolicies.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={polColumns[0]}>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <Link
                        to={`/compute/firewall-policies/${row.id}`}
                        className={`${linkClass} truncate`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row.name}
                      </Link>
                      <span className="text-body-sm text-[var(--color-text-muted)]">
                        ID: {row.id}
                      </span>
                    </div>
                  </Table.Td>
                  <Table.Td rowData={row} column={polColumns[1]}>
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
                  </Table.Td>
                  <Table.Td rowData={row} column={polColumns[2]}>
                    <div className="flex items-center gap-1 min-w-0">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[var(--color-text-default)]">
                          {row.firstFirewall}
                        </span>
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
                  </Table.Td>
                  <Table.Td rowData={row} column={polColumns[3]}>
                    {row.shared ? 'Yes' : 'No'}
                  </Table.Td>
                  <Table.Td rowData={row} column={polColumns[4]}>
                    {row.audited ? 'Yes' : 'No'}
                  </Table.Td>
                  <Table.Td rowData={row} column={polColumns[5]} preventClickPropagation>
                    <ContextMenu.Root
                      direction="bottom-end"
                      gap={4}
                      trigger={({ toggle }) => (
                        <button
                          type="button"
                          onClick={toggle}
                          className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    >
                      <ContextMenu.Item action={() => console.log('Edit policy', row.id)}>
                        Edit
                      </ContextMenu.Item>
                      <ContextMenu.Item action={() => console.log('Manage rules', row.id)}>
                        Manage rules
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        action={() => setDeleteTarget({ kind: 'policy', item: row })}
                        danger
                      >
                        Delete
                      </ContextMenu.Item>
                    </ContextMenu.Root>
                  </Table.Td>
                </Table.Tr>
              ))}
            </SelectableTable>
          </div>
        </Tab>
        <Tab id="rules" label="NACL rules">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <FilterSearchInput
                  filterKeys={ruleFilterKeys}
                  onFilterAdd={addRule}
                  selectedFilters={ruleFilters}
                  placeholder="Search rules by attributes"
                  defaultFilterKey="name"
                />
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded-md border border-border-strong bg-surface text-text hover:bg-surface-muted"
                  aria-label="Download"
                >
                  <IconDownload size={12} stroke={1.5} />
                </button>
              </div>
              <div className="h-4 w-px bg-border" />
              <Button
                appearance="outline"
                variant="muted"
                size="sm"
                disabled={selectedRules.length === 0}
                onClick={() => setBulkDeleteOpen(true)}
              >
                <IconTrash size={12} stroke={1.5} /> Delete
              </Button>
            </div>
            <FilterChips
              filters={ruleFilters}
              onRemove={(id) => {
                setRuleFilters((p) => p.filter((x) => x.id !== id));
                setRulePage(1);
              }}
              onClear={() => {
                setRuleFilters([]);
                setRulePage(1);
              }}
            />
            <Pagination
              totalCount={filteredRules.length}
              size={perPage}
              currentAt={rulePage}
              onPageChange={setRulePage}
              onSettingClick={() => setPrefsOpen(true)}
              totalCountLabel="items"
              selectedCount={selectedRules.length}
            />
            <SelectableTable<FirewallRule>
              columns={ruleColumns}
              rows={pageRules}
              selectionType="checkbox"
              selectedRows={selectedRules}
              onRowSelectionChange={setSelectedRules}
              getRowId={(row) => row.id}
              sort={ruleSort}
              order={ruleOrder}
              onSortChange={(s, o) => {
                setRuleSort(s ?? '');
                setRuleOrder(o);
              }}
              stickyLastColumn
            >
              {pageRules.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={ruleColumns[0]}>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <Link
                        to={`/compute/firewall-rules/${row.id}`}
                        className={`${linkClass} truncate`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row.name}
                      </Link>
                      <span className="text-body-sm text-[var(--color-text-muted)]">
                        ID: {row.id}
                      </span>
                    </div>
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[1]}>
                    {row.protocol.toUpperCase()}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[2]}>
                    {row.action.toUpperCase()}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[3]}>
                    {row.sourceIp}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[4]}>
                    {row.sourcePort || '-'}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[5]}>
                    {row.destinationIp}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[6]}>
                    {row.destinationPort}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[7]}>
                    {row.enabled ? 'On' : 'Off'}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[8]} preventClickPropagation>
                    <ContextMenu.Root
                      direction="bottom-end"
                      gap={4}
                      trigger={({ toggle }) => (
                        <button
                          type="button"
                          onClick={toggle}
                          className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    >
                      <ContextMenu.Item action={() => console.log('Edit rule', row.id)}>
                        Edit
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        action={() => setDeleteTarget({ kind: 'rule', item: row })}
                        danger
                      >
                        Delete
                      </ContextMenu.Item>
                    </ContextMenu.Root>
                  </Table.Td>
                </Table.Tr>
              ))}
            </SelectableTable>
          </div>
        </Tab>
      </Tabs>
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
      <ActionModal
        appeared={!!deleteTarget}
        actionConfig={{
          title: deleteTitle,
          subtitle: deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.item.name}"? This action cannot be undone.`
            : '',
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
        }}
        onConfirm={() => {
          if (deleteTarget?.kind === 'firewall') {
            console.log('[Firewall] Delete confirmed', deleteTarget.item.id);
          } else if (deleteTarget?.kind === 'policy') {
            console.log('[NACL policy] Delete confirmed', deleteTarget.item.id);
          } else if (deleteTarget?.kind === 'rule') {
            console.log('[NACL rule] Delete confirmed', deleteTarget.item.id);
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <ActionModal
        appeared={bulkDeleteOpen}
        actionConfig={{
          title: bulkDeleteTitle,
          subtitle: `Are you sure you want to delete ${bulkSelectedCount} ${bulkDeleteResourcePhrase}? This action cannot be undone.`,
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
        }}
        onConfirm={() => {
          if (activeTab === 'firewalls') {
            console.log('[Firewall] Bulk delete confirmed', selectedFirewalls);
            setSelectedFirewalls([]);
          } else if (activeTab === 'policies') {
            console.log('[NACL policy] Bulk delete confirmed', selectedPolicies);
            setSelectedPolicies([]);
          } else {
            console.log('[NACL rule] Bulk delete confirmed', selectedRules);
            setSelectedRules([]);
          }
          setBulkDeleteOpen(false);
        }}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </div>
  );
}
