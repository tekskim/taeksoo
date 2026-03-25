import { useCallback, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Tabs, Tab } from '@shared/components/Tabs';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type L7PolicyStatus = 'active' | 'down' | 'error';

interface L7PolicyDetail {
  id: string;
  name: string;
  status: L7PolicyStatus;
  adminState: 'Up' | 'Down';
  createdAt: string;
  description: string;
  action: 'REJECT' | 'REDIRECT_TO_POOL' | 'REDIRECT_TO_URL';
  position: number;
  redirectUrl: string | null;
  redirectPool: { name: string; id: string } | null;
  listener: { name: string; id: string; loadBalancer: { name: string; id: string } };
  tenant: { name: string; id: string };
}

const mockPolicy: L7PolicyDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'policy1',
  status: 'active',
  adminState: 'Up',
  createdAt: 'Jul 25, 2025 09:12:43',
  description: 'Route API traffic to the primary web pool.',
  action: 'REDIRECT_TO_POOL',
  position: 50,
  redirectUrl: null,
  redirectPool: { name: 'web-server-10', id: 'pool-001' },
  listener: {
    name: 'listener-http-80',
    id: 'listener-001',
    loadBalancer: { name: 'web-lb-01', id: 'lb-001' },
  },
  tenant: { name: 'demo-project', id: '00000002' },
};

interface L7Rule extends Record<string, unknown> {
  id: string;
  name: string;
  type: 'HOST_NAME' | 'PATH' | 'FILE_TYPE' | 'HEADER' | 'COOKIE';
  compareType: 'STARTS_WITH' | 'ENDS_WITH' | 'CONTAINS' | 'EQUAL_TO' | 'REGEX';
  key: string | null;
  value: string;
}

const mockL7Rules: L7Rule[] = Array.from({ length: 18 }, (_, i) => ({
  id: `rule-${String(i + 1).padStart(3, '0')}`,
  name: `rule-${String(i + 1).padStart(2, '0')}`,
  type: (['HOST_NAME', 'PATH', 'FILE_TYPE', 'HEADER', 'COOKIE'] as const)[i % 5],
  compareType: (['STARTS_WITH', 'ENDS_WITH', 'CONTAINS', 'EQUAL_TO', 'REGEX'] as const)[i % 5],
  key: i % 3 === 0 ? 'X-Route' : null,
  value: i % 2 === 0 ? '/api/*' : 'www.example.com',
}));

const policyStatusMap: Record<L7PolicyStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1.5 min-w-0';

const ruleFilterKeys: FilterKey[] = [
  { key: 'type', label: 'Rule type', type: 'input', placeholder: 'Rule type...' },
  { key: 'compareType', label: 'Compare type', type: 'input', placeholder: 'Compare type...' },
  { key: 'key', label: 'Key', type: 'input', placeholder: 'Key...' },
  { key: 'value', label: 'Value', type: 'input', placeholder: 'Value...' },
];

function ruleMatchesFilter(rule: L7Rule, filter: FilterKeyWithValue): boolean {
  const q = String(filter.value ?? '').toLowerCase();
  if (!q) return true;
  switch (filter.key) {
    case 'type':
      return rule.type.toLowerCase().includes(q);
    case 'compareType':
      return rule.compareType.toLowerCase().includes(q);
    case 'key':
      return (rule.key ?? '').toLowerCase().includes(q);
    case 'value':
      return rule.value.toLowerCase().includes(q);
    default:
      return true;
  }
}

const RULE_VIEW_PREFS: ColumnPreference[] = [
  { key: 'type', label: 'Rule type', visible: true },
  { key: 'compareType', label: 'Compare type', visible: true },
  { key: 'key', label: 'Key', visible: true },
  { key: 'value', label: 'Value', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

function actionLabel(action: L7PolicyDetail['action']): string {
  switch (action) {
    case 'REJECT':
      return 'Reject';
    case 'REDIRECT_TO_POOL':
      return 'Redirect to pool';
    case 'REDIRECT_TO_URL':
      return 'Redirect to URL';
    default:
      return action;
  }
}

export function ComputeAdminL7PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const policy = mockPolicy;

  const [ruleFilters, setRuleFilters] = useState<FilterKeyWithValue[]>([]);
  const [rulePage, setRulePage] = useState(1);
  const [selectedRules, setSelectedRules] = useState<(string | number)[]>([]);
  const [ruleSort, setRuleSort] = useState('');
  const [ruleOrder, setRuleOrder] = useState<SortOrder>('asc');
  const [rulePrefsOpen, setRulePrefsOpen] = useState(false);

  const rulesPerPage = 10;

  const filteredRules = useMemo(() => {
    if (ruleFilters.length === 0) return mockL7Rules;
    return mockL7Rules.filter((r) => ruleFilters.every((f) => ruleMatchesFilter(r, f)));
  }, [ruleFilters]);

  const paginatedRules = filteredRules.slice(
    (rulePage - 1) * rulesPerPage,
    rulePage * rulesPerPage
  );

  const ruleColumns: TableColumn[] = useMemo(
    () => [
      { key: 'type', header: 'Rule type', sortable: true },
      { key: 'compareType', header: 'Compare type', sortable: true },
      { key: 'key', header: 'Key', sortable: true },
      { key: 'value', header: 'Value', sortable: true },
      { key: 'actions', header: 'Action', width: 60, align: 'center', clickable: false },
    ],
    []
  );

  const rc = (key: string) => ruleColumns.find((col) => col.key === key)!;

  const handleRuleSort = useCallback((k: string | null, o: SortOrder) => {
    setRuleSort(k ?? '');
    setRuleOrder(o);
  }, []);

  const addRuleFilter = useCallback((filter: FilterKeyWithValue) => {
    setRuleFilters((prev) => [...prev, filter]);
    setRulePage(1);
  }, []);

  const removeRuleFilter = useCallback((filterId: string) => {
    setRuleFilters((prev) => prev.filter((f) => f.id !== filterId));
    setRulePage(1);
  }, []);

  const redirectDisplay = (
    <>
      {policy.redirectPool && (
        <Link to={`/compute-admin/pools/${policy.redirectPool.id}`} className={linkClass}>
          {policy.redirectPool.name}
        </Link>
      )}
      {policy.redirectUrl && (
        <span className="text-12 text-text truncate max-w-[240px]" title={policy.redirectUrl}>
          {policy.redirectUrl}
        </span>
      )}
      {!policy.redirectPool && !policy.redirectUrl && (
        <span className="text-12 text-text-muted">—</span>
      )}
    </>
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: policy.status === 'active' ? 'Available' : policy.status,
      accessory: <StatusIndicator variant={policyStatusMap[policy.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: id ?? policy.id, showCopyButton: true, copyText: id ?? policy.id },
    {
      label: 'Listener',
      value: (
        <Link to={`/compute-admin/listeners/${policy.listener.id}`} className={linkClass}>
          {policy.listener.name}
        </Link>
      ),
    },
    { label: 'Action', value: actionLabel(policy.action) },
    { label: 'Position', value: String(policy.position) },
    {
      label: 'Redirect URL / pool',
      value: redirectDisplay,
    },
    {
      label: 'Tenant',
      value: (
        <Link to={`/compute-admin/tenants/${policy.tenant.id}`} className={linkClass}>
          {policy.tenant.name}
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={policy.name}
        actions={
          <Button variant="secondary" appearance="outline" size="sm">
            <IconTrash size={12} stroke={1.5} /> Delete
          </Button>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name" value={policy.name} />
                  <SectionCard.DataRow label="Description" value={policy.description} />
                  <SectionCard.DataRow label="Admin state" value={policy.adminState} />
                  <SectionCard.DataRow label="Created at" value={policy.createdAt} />
                  <SectionCard.DataRow label="Position" value={String(policy.position)} />
                  <SectionCard.DataRow label="Action" value={actionLabel(policy.action)} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Association" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Load balancer">
                    <Link
                      to={`/compute-admin/load-balancers/${policy.listener.loadBalancer.id}`}
                      className={linkClass}
                    >
                      {policy.listener.loadBalancer.name}
                    </Link>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Listener">
                    <Link
                      to={`/compute-admin/listeners/${policy.listener.id}`}
                      className={linkClass}
                    >
                      {policy.listener.name}
                    </Link>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Tenant">
                    <Link to={`/compute-admin/tenants/${policy.tenant.id}`} className={linkClass}>
                      {policy.tenant.name}
                    </Link>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="l7-rules" label="L7 rules">
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <FilterSearchInput
                    filterKeys={ruleFilterKeys}
                    onFilterAdd={addRuleFilter}
                    selectedFilters={ruleFilters}
                    placeholder="Search L7 rules by attributes"
                    defaultFilterKey="type"
                  />
                  <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
                    <IconDownload size={12} stroke={1.5} />
                  </Button>
                </div>
                <div className="h-4 w-px bg-border" />
                <Button
                  variant="muted"
                  appearance="ghost"
                  size="sm"
                  disabled={selectedRules.length === 0}
                >
                  <IconTrash size={12} stroke={1.5} /> Delete
                </Button>
              </div>

              {ruleFilters.length > 0 && (
                <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
                  <div className="flex items-center gap-1 flex-wrap">
                    {ruleFilters.map((filter) => (
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
                          onClick={() => removeRuleFilter(filter.id!)}
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
                    onClick={() => {
                      setRuleFilters([]);
                      setRulePage(1);
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              <Pagination
                totalCount={filteredRules.length}
                size={rulesPerPage}
                currentAt={rulePage}
                onPageChange={setRulePage}
                onSettingClick={() => setRulePrefsOpen(true)}
                totalCountLabel="rules"
                selectedCount={selectedRules.length}
              />

              <SelectableTable<L7Rule>
                columns={ruleColumns}
                rows={paginatedRules}
                selectionType="checkbox"
                selectedRows={selectedRules}
                onRowSelectionChange={setSelectedRules}
                getRowId={(row) => row.id}
                sort={ruleSort}
                order={ruleOrder}
                onSortChange={handleRuleSort}
                stickyLastColumn
              >
                {paginatedRules.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={rc('type')}>
                      <span className="text-12 text-text">{row.type}</span>
                    </Table.Td>
                    <Table.Td rowData={row} column={rc('compareType')}>
                      <span className="text-12 text-text">{row.compareType}</span>
                    </Table.Td>
                    <Table.Td rowData={row} column={rc('key')}>
                      <span className="text-12 text-text">{row.key ?? '—'}</span>
                    </Table.Td>
                    <Table.Td rowData={row} column={rc('value')}>
                      <span
                        className="text-12 text-text truncate block max-w-[200px]"
                        title={row.value}
                      >
                        {row.value}
                      </span>
                    </Table.Td>
                    <Table.Td rowData={row} column={rc('actions')} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => (
                          <button
                            type="button"
                            onClick={toggle}
                            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                            aria-label="Row actions"
                          >
                            <IconDotsCircleHorizontal size={16} stroke={1.5} />
                          </button>
                        )}
                      >
                        <ContextMenu.Item action={() => console.log('edit rule', row.id)}>
                          Edit
                        </ContextMenu.Item>
                        <ContextMenu.Item action={() => console.log('delete rule', row.id)} danger>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>

              <ViewPreferencesDrawer
                isOpen={rulePrefsOpen}
                onClose={() => setRulePrefsOpen(false)}
                columns={RULE_VIEW_PREFS}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
