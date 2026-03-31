import { useCallback, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tag } from '@shared/components/Tag';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconChevronDown, IconEdit, IconUserPlus, IconX } from '@tabler/icons-react';

interface TenantDetail {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  domain: string;
  createdAt: string;
}

interface TenantUserRow extends Record<string, unknown> {
  id: string;
  username: string;
  email: string;
  role: string;
  lastLogin: string;
}

interface QuotaRow extends Record<string, unknown> {
  resource: string;
  limit: string;
  inUse: string;
  unit: string;
}

const mockTenants: Record<string, TenantDetail> = {
  'tenant-eng-01': {
    id: 'tenant-eng-01',
    name: 'engineering',
    description: 'Primary engineering project for shared services.',
    enabled: true,
    domain: 'default',
    createdAt: 'Nov 2, 2025 12:00:00',
  },
  'tenant-demo-01': {
    id: 'tenant-demo-01',
    name: 'demo-project',
    description: 'Sandbox tenant for sales demos.',
    enabled: true,
    domain: 'default',
    createdAt: 'Dec 10, 2025 09:30:15',
  },
  'tenant-admin': {
    id: 'tenant-admin',
    name: 'admin',
    description: 'Platform administration tenant.',
    enabled: true,
    domain: 'default',
    createdAt: 'Oct 1, 2025 08:00:00',
  },
};

const defaultTenant: TenantDetail = {
  id: 'unknown',
  name: 'unknown-tenant',
  description: '-',
  enabled: false,
  domain: '-',
  createdAt: '-',
};

const usersByTenant: Record<string, TenantUserRow[]> = {
  'tenant-eng-01': [
    {
      id: 'u-1',
      username: 'jdoe',
      email: 'jdoe@example.com',
      role: 'member',
      lastLogin: 'Mar 24, 2026 07:12:00',
    },
    {
      id: 'u-2',
      username: 'asmith',
      email: 'asmith@example.com',
      role: 'admin',
      lastLogin: 'Mar 23, 2026 22:01:44',
    },
  ],
  'tenant-demo-01': [
    {
      id: 'u-3',
      username: 'demo-user',
      email: 'demo@example.com',
      role: 'member',
      lastLogin: 'Mar 20, 2026 11:45:00',
    },
  ],
  'tenant-admin': [
    {
      id: 'u-4',
      username: 'root-admin',
      email: 'ops@example.com',
      role: 'admin',
      lastLogin: 'Mar 25, 2026 06:00:12',
    },
  ],
};

const quotasByTenant: Record<string, QuotaRow[]> = {
  'tenant-eng-01': [
    { resource: 'Instances', limit: '64', inUse: '38', unit: 'count' },
    { resource: 'vCPU', limit: '512', inUse: '296', unit: 'cores' },
    { resource: 'RAM', limit: '2048', inUse: '1184', unit: 'GiB' },
    { resource: 'Volumes', limit: '200', inUse: '87', unit: 'count' },
    { resource: 'Volume storage', limit: '50000', inUse: '22100', unit: 'GiB' },
  ],
  'tenant-demo-01': [
    { resource: 'Instances', limit: '8', inUse: '3', unit: 'count' },
    { resource: 'vCPU', limit: '32', inUse: '12', unit: 'cores' },
    { resource: 'Floating IPs', limit: '10', inUse: '4', unit: 'count' },
  ],
  'tenant-admin': [
    { resource: 'Instances', limit: 'Unlimited', inUse: '12', unit: 'count' },
    { resource: 'vCPU', limit: 'Unlimited', inUse: '96', unit: 'cores' },
  ],
};

const userFilterKeys: FilterKey[] = [
  { key: 'username', label: 'Username', type: 'input' },
  { key: 'email', label: 'Email', type: 'input' },
  { key: 'role', label: 'Role', type: 'input' },
];

const quotaFilterKeys: FilterKey[] = [{ key: 'resource', label: 'Resource', type: 'input' }];

function matchesUser(row: TenantUserRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof TenantUserRow;
  return String(row[key] ?? '')
    .toLowerCase()
    .includes(fv);
}

function matchesQuota(row: QuotaRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  return row.resource.toLowerCase().includes(fv);
}

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeAdminTenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const tenant = useMemo(() => {
    if (!id) return defaultTenant;
    if (mockTenants[id]) return mockTenants[id];
    const byName = Object.values(mockTenants).find((t) => t.name === id);
    return byName ?? defaultTenant;
  }, [id]);

  const dataKey = tenant.id !== 'unknown' ? tenant.id : 'tenant-eng-01';
  const users = usersByTenant[dataKey] ?? [];
  const quotas = quotasByTenant[dataKey] ?? [];

  const [userFilters, setUserFilters] = useState<FilterKeyWithValue[]>([]);
  const [quotaFilters, setQuotaFilters] = useState<FilterKeyWithValue[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [quotaPage, setQuotaPage] = useState(1);
  const pageSize = 10;
  const [userSort, setUserSort] = useState('');
  const [userOrder, setUserOrder] = useState<SortOrder>('asc');
  const [quotaSort, setQuotaSort] = useState('');
  const [quotaOrder, setQuotaOrder] = useState<SortOrder>('asc');

  const onUserFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setUserFilters((prev) => [...prev, filter]);
    setUserPage(1);
  }, []);

  const onUserFilterRemove = useCallback((filterId: string) => {
    setUserFilters((prev) => prev.filter((f) => f.id !== filterId));
    setUserPage(1);
  }, []);

  const onQuotaFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setQuotaFilters((prev) => [...prev, filter]);
    setQuotaPage(1);
  }, []);

  const onQuotaFilterRemove = useCallback((filterId: string) => {
    setQuotaFilters((prev) => prev.filter((f) => f.id !== filterId));
    setQuotaPage(1);
  }, []);

  const filteredUsers = useMemo(() => {
    if (userFilters.length === 0) return users;
    return users.filter((row) => userFilters.every((f) => matchesUser(row, f)));
  }, [users, userFilters]);

  const filteredQuotas = useMemo(() => {
    if (quotaFilters.length === 0) return quotas;
    return quotas.filter((row) => quotaFilters.every((f) => matchesQuota(row, f)));
  }, [quotas, quotaFilters]);

  const paginatedUsers = filteredUsers.slice((userPage - 1) * pageSize, userPage * pageSize);
  const paginatedQuotas = filteredQuotas.slice((quotaPage - 1) * pageSize, quotaPage * pageSize);

  const userColumns: TableColumn[] = [
    { key: 'username', header: 'Username', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'lastLogin', header: 'Last login', sortable: true },
  ];

  const quotaColumns: TableColumn[] = [
    { key: 'resource', header: 'Resource', sortable: true },
    { key: 'limit', header: 'Limit', align: 'right' },
    { key: 'inUse', header: 'In use', align: 'right' },
    { key: 'unit', header: 'Unit' },
  ];

  const enabledBadge = tenant.enabled ? (
    <Badge theme="gre" size="sm" type="subtle">
      Enabled
    </Badge>
  ) : (
    <Badge theme="gry" size="sm" type="subtle">
      Disabled
    </Badge>
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: tenant.name },
    { label: 'ID', value: tenant.id, showCopyButton: true, copyText: tenant.id },
    { label: 'Description', value: tenant.description },
    { label: 'Status', value: enabledBadge },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={tenant.name}
        actions={
          <div className="flex flex-wrap gap-1 items-center">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconUserPlus size={12} stroke={1.5} /> Add user
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
              <ContextMenu.Item action={() => {}}>Manage quotas</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Disable tenant</ContextMenu.Item>
              <ContextMenu.Item action={() => {}} danger>
                Delete tenant
              </ContextMenu.Item>
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
                  <SectionCard.DataRow label="Name" value={tenant.name} />
                  <SectionCard.DataRow label="ID" value={tenant.id} />
                  <SectionCard.DataRow label="Description" value={tenant.description} />
                  <SectionCard.DataRow label="Domain" value={tenant.domain} />
                  <SectionCard.DataRow label="Enabled" value={tenant.enabled ? 'Yes' : 'No'} />
                  <SectionCard.DataRow label="Created at" value={tenant.createdAt} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
          <Tab id="users" label="Users">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <FilterSearchInput
                  filterKeys={userFilterKeys}
                  onFilterAdd={onUserFilterAdd}
                  selectedFilters={userFilters}
                  placeholder="Search users by attributes"
                  defaultFilterKey="username"
                  className="w-full max-w-[320px]"
                />
                {userFilters.length > 0 && (
                  <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
                    <div className="flex items-center gap-1 flex-wrap">
                      {userFilters.map((filter) => (
                        <span
                          key={filter.id}
                          className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 font-medium shadow-[inset_0_0_0_1px] shadow-border"
                        >
                          <span className="flex items-center gap-1">
                            <span>{filter.label}</span>
                            <span className="text-border">|</span>
                            <span>{filter.displayValue ?? filter.value}</span>
                          </span>
                          <button
                            type="button"
                            className="shrink-0 p-0.5 cursor-pointer bg-transparent border-none"
                            onClick={() => onUserFilterRemove(filter.id!)}
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
                        setUserFilters([]);
                        setUserPage(1);
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
              <Pagination
                totalCount={filteredUsers.length}
                size={pageSize}
                currentAt={userPage}
                onPageChange={setUserPage}
                totalCountLabel="users"
              />
              <Table<TenantUserRow>
                columns={userColumns}
                rows={paginatedUsers}
                sort={userSort}
                order={userOrder}
                onSortChange={(k, o) => {
                  setUserSort(k ?? '');
                  setUserOrder(o);
                }}
              >
                {paginatedUsers.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={userColumns[0]}>
                      <Link to={`/iam/users/${row.username}`} className={linkClass}>
                        {row.username}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={userColumns[1]}>
                      {row.email}
                    </Table.Td>
                    <Table.Td rowData={row} column={userColumns[2]}>
                      <Tag label={row.role} />
                    </Table.Td>
                    <Table.Td rowData={row} column={userColumns[3]}>
                      {row.lastLogin}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
          <Tab id="quotas" label="Quotas">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <FilterSearchInput
                  filterKeys={quotaFilterKeys}
                  onFilterAdd={onQuotaFilterAdd}
                  selectedFilters={quotaFilters}
                  placeholder="Search quotas by resource"
                  defaultFilterKey="resource"
                  className="w-full max-w-[320px]"
                />
                {quotaFilters.length > 0 && (
                  <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
                    <div className="flex items-center gap-1 flex-wrap">
                      {quotaFilters.map((filter) => (
                        <span
                          key={filter.id}
                          className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 font-medium shadow-[inset_0_0_0_1px] shadow-border"
                        >
                          <span className="flex items-center gap-1">
                            <span>{filter.label}</span>
                            <span className="text-border">|</span>
                            <span>{filter.displayValue ?? filter.value}</span>
                          </span>
                          <button
                            type="button"
                            className="shrink-0 p-0.5 cursor-pointer bg-transparent border-none"
                            onClick={() => onQuotaFilterRemove(filter.id!)}
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
                        setQuotaFilters([]);
                        setQuotaPage(1);
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
              <Pagination
                totalCount={filteredQuotas.length}
                size={pageSize}
                currentAt={quotaPage}
                onPageChange={setQuotaPage}
                totalCountLabel="quotas"
              />
              <Table<QuotaRow>
                columns={quotaColumns}
                rows={paginatedQuotas}
                sort={quotaSort}
                order={quotaOrder}
                onSortChange={(k, o) => {
                  setQuotaSort(k ?? '');
                  setQuotaOrder(o);
                }}
              >
                {paginatedQuotas.map((row, i) => (
                  <Table.Tr key={`${row.resource}-${i}`} rowData={row}>
                    <Table.Td rowData={row} column={quotaColumns[0]}>
                      {row.resource}
                    </Table.Td>
                    <Table.Td rowData={row} column={quotaColumns[1]}>
                      {row.limit}
                    </Table.Td>
                    <Table.Td rowData={row} column={quotaColumns[2]}>
                      {row.inUse}
                    </Table.Td>
                    <Table.Td rowData={row} column={quotaColumns[3]}>
                      {row.unit}
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
