import { useCallback, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { Tabs, Tab } from '@shared/components/Tabs';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { ContextMenu } from '@shared/components/ContextMenu';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconChevronDown, IconEdit, IconExternalLink, IconTrash, IconX } from '@tabler/icons-react';

interface FirewallPolicyDetail {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  tenant: string;
  tenantId: string;
  shared: boolean;
  audited: boolean;
  description: string;
  createdAt: string;
}

interface RuleRow extends Record<string, unknown> {
  id: string;
  name: string;
  action: 'allow' | 'deny' | 'reject';
  protocol: string;
  position: number;
}

const mockPolicies: Record<string, FirewallPolicyDetail> = {
  'fpol-001': {
    id: '7284d917-4e81-431e-9306-0a9bbcf2cdfd',
    name: 'ingress-web-tier',
    status: 'active',
    tenant: 'engineering',
    tenantId: 'tenant-eng-01',
    shared: false,
    audited: true,
    description: 'Ingress policy for public web subnets.',
    createdAt: 'Feb 12, 2026 10:15:00',
  },
  'fpol-002': {
    id: '8395e028-5f92-542f-0417-1b0ccd3deff1',
    name: 'shared-default-deny',
    status: 'active',
    tenant: 'admin',
    tenantId: 'tenant-admin',
    shared: true,
    audited: false,
    description: 'Platform-wide baseline deny rules.',
    createdAt: 'Jan 20, 2026 08:40:12',
  },
};

const defaultPolicy: FirewallPolicyDetail = {
  id: 'unknown',
  name: 'Unknown policy',
  status: 'inactive',
  tenant: '-',
  tenantId: '',
  shared: false,
  audited: false,
  description: '-',
  createdAt: '-',
};

const rulesByPolicy: Record<string, RuleRow[]> = {
  'fpol-001': [
    { id: 'fwr-101', name: 'allow-https', action: 'allow', protocol: 'tcp', position: 1 },
    { id: 'fwr-102', name: 'allow-ssh-jump', action: 'allow', protocol: 'tcp', position: 2 },
    { id: 'fwr-103', name: 'deny-all-other', action: 'deny', protocol: 'any', position: 3 },
  ],
  'fpol-002': [
    { id: 'fwr-201', name: 'reject-rdp-wan', action: 'reject', protocol: 'tcp', position: 1 },
    { id: 'fwr-202', name: 'deny-metadata', action: 'deny', protocol: 'udp', position: 2 },
  ],
};

const policyStatusVariant: Record<FirewallPolicyDetail['status'], StatusVariant> = {
  active: 'active',
  inactive: 'shutoff',
  error: 'error',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input' },
  { key: 'protocol', label: 'Protocol', type: 'input' },
  { key: 'action', label: 'Action', type: 'input' },
];

function ruleMatches(row: RuleRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof RuleRow;
  const value = String(row[key] ?? '').toLowerCase();
  return value.includes(fv);
}

const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1';

export function ComputeAdminFirewallPolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const policy = useMemo(() => (id && mockPolicies[id] ? mockPolicies[id] : defaultPolicy), [id]);
  const dataKey = id && mockPolicies[id] ? id : 'fpol-001';
  const allRules = rulesByPolicy[dataKey] ?? [];

  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setPage(1);
  }, []);

  const filteredRules = useMemo(() => {
    if (appliedFilters.length === 0) return allRules;
    return allRules.filter((row) => appliedFilters.every((f) => ruleMatches(row, f)));
  }, [allRules, appliedFilters]);

  const paginated = filteredRules.slice((page - 1) * pageSize, page * pageSize);

  const ruleColumns: TableColumn[] = [
    { key: 'position', header: '#', width: 48, align: 'right' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'protocol', header: 'Protocol', sortable: true },
    { key: 'action', header: 'Action', sortable: true },
  ];

  const statusLabel = policy.status.charAt(0).toUpperCase() + policy.status.slice(1);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: statusLabel,
      accessory: <StatusIndicator variant={policyStatusVariant[policy.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: policy.id, showCopyButton: true, copyText: policy.id },
    { label: 'Name', value: policy.name },
    {
      label: 'Tenant',
      value:
        policy.tenant === '-' ? (
          '-'
        ) : (
          <Link to={`/compute-admin/tenants/${policy.tenantId}`} className={linkClass}>
            {policy.tenant}
          </Link>
        ),
    },
    { label: 'Shared', value: policy.shared ? 'Yes' : 'No' },
    { label: 'Audited', value: policy.audited ? 'Yes' : 'No' },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={policy.name}
        actions={
          <div className="flex flex-wrap gap-1 items-center">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
            <ContextMenu.Root
              direction="bottom-end"
              gap={4}
              trigger={({ toggle }) => (
                <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                  More actions <IconChevronDown size={12} stroke={1.5} />
                </Button>
              )}
            >
              <ContextMenu.Item action={() => {}}>Insert rule</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Clone policy</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Export as JSON</ContextMenu.Item>
            </ContextMenu.Root>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name" value={policy.name} />
                  <SectionCard.DataRow label="ID" value={policy.id} />
                  <SectionCard.DataRow label="Description" value={policy.description} />
                  <SectionCard.DataRow label="Shared" value={policy.shared ? 'Yes' : 'No'} />
                  <SectionCard.DataRow label="Audited" value={policy.audited ? 'Yes' : 'No'} />
                  <SectionCard.DataRow label="Created at" value={policy.createdAt} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
          <Tab id="rules" label="Rules">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <FilterSearchInput
                  filterKeys={filterKeys}
                  onFilterAdd={handleFilterAdd}
                  selectedFilters={appliedFilters}
                  placeholder="Search rules by attributes"
                  defaultFilterKey="name"
                  className="w-full max-w-[320px]"
                />
                {appliedFilters.length > 0 && (
                  <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
                    <div className="flex items-center gap-1 flex-wrap">
                      {appliedFilters.map((filter) => (
                        <span
                          key={filter.id}
                          className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
                        >
                          <span className="flex items-center gap-1">
                            <span>{filter.label}</span>
                            <span className="text-border">|</span>
                            <span>{filter.displayValue ?? filter.value}</span>
                          </span>
                          <button
                            type="button"
                            className="shrink-0 p-0.5 text-text hover:text-text-muted rounded-sm cursor-pointer bg-transparent border-none"
                            onClick={() => handleFilterRemove(filter.id!)}
                            aria-label={`Remove ${filter.label}`}
                          >
                            <IconX size={12} strokeWidth={2} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="text-11 font-medium text-primary cursor-pointer bg-transparent border-none ml-4"
                      onClick={() => {
                        setAppliedFilters([]);
                        setPage(1);
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
              <Pagination
                totalCount={filteredRules.length}
                size={pageSize}
                currentAt={page}
                onPageChange={setPage}
                totalCountLabel="rules"
              />
              <Table<RuleRow>
                columns={ruleColumns}
                rows={paginated}
                sort={sort}
                order={order}
                onSortChange={(k, o) => {
                  setSort(k ?? '');
                  setOrder(o);
                }}
              >
                {paginated.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={ruleColumns[0]}>
                      {row.position}
                    </Table.Td>
                    <Table.Td rowData={row} column={ruleColumns[1]}>
                      <Link to={`/compute-admin/firewall-rules/${row.id}`} className={linkClass}>
                        {row.name}
                        <IconExternalLink size={12} className="text-primary shrink-0" />
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={ruleColumns[2]}>
                      {row.protocol}
                    </Table.Td>
                    <Table.Td rowData={row} column={ruleColumns[3]}>
                      {row.action}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
