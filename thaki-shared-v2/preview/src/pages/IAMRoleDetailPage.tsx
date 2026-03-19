import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { Badge } from '@shared/components/Badge';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Tabs, Tab } from '@shared/components/Tabs';
import { TabSelector } from '@shared/components/TabSelector';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconSettings,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface RoleDetail {
  name: string;
  description: string;
  type: 'Built-in' | 'Custom';
  createdAt: string;
}

interface PolicyPermission {
  application: string;
  partition: string;
  resource: string;
  actions: string[];
}

interface RolePolicy {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  apps: string;
  description: string;
  editedAt: string;
  permissions?: PolicyPermission[];
}

interface AttachedUserGroup {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  userCount: number;
  createdAt: string;
  [key: string]: unknown;
}

interface AttachedUser {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  lastSignIn: string;
  createdAt: string;
  [key: string]: unknown;
}

/* ----------------------------------------
   Mock Data (identical to TDS)
   ---------------------------------------- */

const mockRolesMap: Record<string, RoleDetail> = {
  admin: {
    name: 'admin',
    description: 'Full administrative access',
    type: 'Built-in',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
  Member: {
    name: 'Member',
    description: 'member role',
    type: 'Custom',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  viewer: {
    name: 'viewer',
    description: 'Read-only access',
    type: 'Built-in',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
  'compute-admin': {
    name: 'compute-admin',
    description: 'Compute administration access',
    type: 'Built-in',
    createdAt: 'Jun 15, 2025 12:22:26',
  },
  'storage-admin': {
    name: 'storage-admin',
    description: 'Storage administration access',
    type: 'Built-in',
    createdAt: 'Jun 20, 2025 23:27:51',
  },
  'network-admin': {
    name: 'network-admin',
    description: 'Network administration access',
    type: 'Built-in',
    createdAt: 'Jun 25, 2025 10:32:16',
  },
};

const mockRolePolicies: RolePolicy[] = [
  {
    id: 'p-001',
    name: 'policy',
    type: 'Built-in',
    apps: 'compute:tenantA (+3)',
    description: '-',
    editedAt: 'Sep 12, 2025',
    permissions: [
      { application: 'Compute', partition: 'tenantA', resource: 'Instance', actions: ['Read', 'List'] },
      { application: 'Compute', partition: 'tenantA', resource: 'Volume', actions: ['Read', 'List', 'Write'] },
    ],
  },
  {
    id: 'p-002',
    name: 'policy',
    type: 'Built-in',
    apps: 'compute (+3)',
    description: '-',
    editedAt: 'Sep 12, 2025',
    permissions: [
      { application: 'Compute', partition: 'tenantA', resource: 'AI_server', actions: ['Read', 'List', 'Write', 'Delete', 'Admin'] },
      { application: 'Container', partition: 'clusterA', resource: 'All(*)', actions: ['Read', 'List', 'Write'] },
      { application: 'IAM', partition: '-', resource: 'All(*)', actions: ['Read', 'List', 'Write', 'Delete', 'Admin'] },
      { application: 'Storage', partition: '-', resource: 'Host', actions: ['Read'] },
    ],
  },
  {
    id: 'p-003',
    name: 'network-policy',
    type: 'Custom',
    apps: 'network (+2)',
    description: 'Network management policy',
    editedAt: 'Sep 15, 2025',
    permissions: [
      { application: 'Network', partition: 'vpcA', resource: 'Subnet', actions: ['Read', 'List', 'Write'] },
      { application: 'Network', partition: 'vpcA', resource: 'SecurityGroup', actions: ['Read', 'List', 'Write', 'Delete'] },
      { application: 'Network', partition: '-', resource: 'LoadBalancer', actions: ['Read', 'List'] },
    ],
  },
];

const mockAttachedUserGroups: AttachedUserGroup[] = [
  { id: 'ug-001', name: 'dev-admin-group', type: 'Built-in', userCount: 130, createdAt: 'Sep 12, 2025 15:43:35' },
  { id: 'ug-002', name: 'ops-team', type: 'Custom', userCount: 45, createdAt: 'Aug 15, 2025 12:22:26' },
  { id: 'ug-003', name: 'security-group', type: 'Built-in', userCount: 22, createdAt: 'Jul 20, 2025 23:27:51' },
  { id: 'ug-004', name: 'data-analysts', type: 'Custom', userCount: 67, createdAt: 'Jun 10, 2025 01:17:01' },
];

const mockAttachedUsers: AttachedUser[] = [
  { id: 'u-001', name: 'thaki-kim', type: 'Built-in', lastSignIn: 'Dec 10, 2025', createdAt: 'Sep 12, 2025 15:43:35' },
  { id: 'u-002', name: 'alex.johnson', type: 'Custom', lastSignIn: 'Dec 9, 2025', createdAt: 'Aug 15, 2025 12:22:26' },
  { id: 'u-003', name: 'maria.garcia', type: 'Built-in', lastSignIn: 'Dec 8, 2025', createdAt: 'Jul 20, 2025 23:27:51' },
  { id: 'u-004', name: 'john.doe', type: 'Custom', lastSignIn: 'Dec 7, 2025', createdAt: 'Jun 10, 2025 01:17:01' },
  { id: 'u-005', name: 'emma.wilson', type: 'Built-in', lastSignIn: 'Dec 5, 2025', createdAt: 'May 5, 2025 14:12:36' },
];

/* ----------------------------------------
   Policy Details Component
   ---------------------------------------- */

function PolicyDetails({ permissions }: { permissions: PolicyPermission[] }) {
  return (
    <div className="border-t border-border p-4 bg-surface">
      <div className="flex flex-col gap-1">
        <div className="flex items-stretch min-h-9 bg-surface-muted border border-border rounded-md">
          <div className="w-10 px-3 py-2 text-11 font-medium leading-16 text-text flex items-center">#</div>
          <div className="flex-1 px-3 py-2 text-11 font-medium leading-16 text-text flex items-center border-l border-border">Application</div>
          <div className="flex-1 px-3 py-2 text-11 font-medium leading-16 text-text flex items-center border-l border-border">Partition</div>
          <div className="flex-1 px-3 py-2 text-11 font-medium leading-16 text-text flex items-center border-l border-border">Resource</div>
          <div className="flex-[2] px-3 py-2 text-11 font-medium leading-16 text-text flex items-center border-l border-border">Action</div>
        </div>
        {permissions.map((perm, index) => (
          <div key={index} className="flex items-stretch min-h-9 bg-surface border border-border rounded-md">
            <div className="w-10 px-3 py-1.5 text-12 leading-16 text-text-muted flex items-center">{index + 1}</div>
            <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center truncate">{perm.application}</div>
            <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center truncate">{perm.partition}</div>
            <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center truncate">{perm.resource}</div>
            <div className="flex-[2] min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center gap-1 flex-wrap">
              {perm.actions.map((action, i) => (
                <Badge key={i} theme="gry" size="sm">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   IAM Role Detail Page
   ---------------------------------------- */

export function IAMRoleDetailPage() {
  const { roleName } = useParams<{ roleName: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('policies');
  const [policiesFilters, setPoliciesFilters] = useState<FilterKeyWithValue[]>([]);
  const [entitiesFilters, setEntitiesFilters] = useState<FilterKeyWithValue[]>([]);
  const [policiesCurrentPage, setPoliciesCurrentPage] = useState(1);
  const [entitiesCurrentPage, setEntitiesCurrentPage] = useState(1);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set(['p-002']));
  const [entitiesSubTab, setEntitiesSubTab] = useState<'user-groups' | 'users'>('user-groups');
  const itemsPerPage = 10;

  const role = roleName ? mockRolesMap[roleName] : null;

  const applyFilter = <T extends Record<string, unknown>>(data: T[], filters: FilterKeyWithValue[]): T[] => {
    if (filters.length === 0) return data;
    return data.filter((item) =>
      filters.every((f) => String(item[f.key] ?? '').toLowerCase().includes(String(f.value ?? '').toLowerCase()))
    );
  };

  const policyFilterKeys: FilterKey[] = [{ key: 'name', label: 'Name', type: 'input', placeholder: 'Enter policy name...' }];
  const entitiesFilterKeys: FilterKey[] = [{ key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' }];

  const filteredPolicies = applyFilter(mockRolePolicies as unknown as Record<string, unknown>[], policiesFilters) as unknown as typeof mockRolePolicies;
  const paginatedPolicies = filteredPolicies.slice(
    (policiesCurrentPage - 1) * itemsPerPage,
    policiesCurrentPage * itemsPerPage
  );

  const filteredUserGroups = applyFilter(mockAttachedUserGroups as unknown as Record<string, unknown>[], entitiesFilters) as unknown as typeof mockAttachedUserGroups;
  const filteredUsers = applyFilter(mockAttachedUsers as unknown as Record<string, unknown>[], entitiesFilters) as unknown as typeof mockAttachedUsers;
  const userGroupsTotalPages = Math.ceil(filteredUserGroups.length / itemsPerPage);
  const usersTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUserGroups = filteredUserGroups.slice(
    (entitiesCurrentPage - 1) * itemsPerPage,
    entitiesCurrentPage * itemsPerPage
  );
  const paginatedUsers = filteredUsers.slice(
    (entitiesCurrentPage - 1) * itemsPerPage,
    entitiesCurrentPage * itemsPerPage
  );

  const togglePolicyExpansion = (policyId: string) => {
    setExpandedPolicies((prev) => {
      const next = new Set(prev);
      if (next.has(policyId)) next.delete(policyId);
      else next.add(policyId);
      return next;
    });
  };

  const userGroupColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'userCount', header: 'User count' },
    { key: 'createdAt', header: 'Created at' },
  ];

  const userColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'lastSignIn', header: 'Last sign-in' },
    { key: 'createdAt', header: 'Created at' },
  ];

  if (!role) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-text-muted">Role not found</p>
      </div>
    );
  }

  const infoFields = [
    { label: 'Description', value: role.description },
    { label: 'Type', value: role.type },
    { label: 'Created at', value: role.createdAt },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconEdit size={12} stroke={1.5} /> Edit
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTrash size={12} stroke={1.5} /> Delete
      </Button>
      <ContextMenu.Root direction="bottom-end" gap={4}
        trigger={({ toggle }) => (
          <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
            More actions <IconChevronDown size={12} stroke={1.5} />
          </Button>
        )}
      >
        <ContextMenu.Item action={() => console.log('Manage policies')}>Manage policies</ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Duplicate')}>Duplicate</ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={role.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
          <Tab id="policies" label="Policies">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-16 font-semibold leading-24 text-text">Policies</h2>
                <Button variant="secondary" appearance="outline" size="sm">
                  <IconSettings size={12} /> Manage policies
                </Button>
              </div>
              <FilterSearchInput filterKeys={policyFilterKeys} onFilterAdd={(f) => { setPoliciesFilters((p) => [...p, f]); setPoliciesCurrentPage(1); }} selectedFilters={policiesFilters} placeholder="Search policies by attributes" defaultFilterKey="name" />
              <Pagination
                totalCount={filteredPolicies.length}
                size={itemsPerPage}
                currentAt={policiesCurrentPage}
                onPageChange={setPoliciesCurrentPage}
                totalCountLabel="items"
              />
              <div className="flex flex-col gap-1">
                {/* Table Header */}
                <div className="flex items-stretch min-h-9 bg-surface-muted border border-border rounded-md">
                  <div className="flex-1 flex items-center px-3 py-1.5 text-11 font-medium leading-16 text-text">Status</div>
                  <div className="flex-1 flex items-center px-3 py-1.5 text-11 font-medium leading-16 text-text border-l border-border">Type</div>
                  <div className="flex-1 flex items-center px-3 py-1.5 text-11 font-medium leading-16 text-text border-l border-border">Apps</div>
                  <div className="flex-1 flex items-center px-3 py-1.5 text-11 font-medium leading-16 text-text border-l border-border">Description</div>
                  <div className="flex-1 flex items-center px-3 py-1.5 text-11 font-medium leading-16 text-text border-l border-border">Edited at</div>
                  <div className="w-[72px] flex items-center justify-center px-3 py-1.5 text-11 font-medium leading-16 text-text border-l border-border">Action</div>
                </div>
                {paginatedPolicies.map((policy) => (
                  <div key={policy.id} className="rounded-md border border-border bg-surface overflow-hidden">
                    <div className="flex items-center min-h-9 hover:bg-surface-muted transition-colors">
                      <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-12 leading-16 text-text">
                        <button
                          type="button"
                          onClick={() => policy.permissions && togglePolicyExpansion(policy.id)}
                          className={`p-0.5 hover:bg-surface-muted rounded flex-shrink-0 ${!policy.permissions ? 'invisible' : ''}`}
                        >
                          {expandedPolicies.has(policy.id) ? <IconChevronDown size={16} stroke={1.5} /> : <IconChevronRight size={16} stroke={1.5} />}
                        </button>
                        <Link to={`/iam/policies/${policy.name}`} className="text-primary font-medium hover:underline truncate">
                          {policy.name}
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0 flex items-center px-3 py-1.5 text-12 leading-16 text-text truncate">{policy.type}</div>
                      <div className="flex-1 min-w-0 flex items-center px-3 py-1.5 text-12 leading-16 text-text truncate">{policy.apps}</div>
                      <div className="flex-1 min-w-0 flex items-center px-3 py-1.5 text-12 leading-16 text-text truncate">{policy.description}</div>
                      <div className="flex-1 min-w-0 flex items-center px-3 py-1.5 text-12 leading-16 text-text whitespace-nowrap">{policy.editedAt}</div>
                      <div className="w-[72px] flex items-center justify-center px-3 py-2 border-l border-transparent">
                        <ContextMenu.Root direction="bottom-end" gap={4} trigger={({ toggle }) => <button type="button" onClick={toggle} className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none" aria-label="Actions"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}>
                          <ContextMenu.Item action={() => console.log('Detach policy', policy.id)} danger={policy.type !== 'Built-in'} disabled={policy.type === 'Built-in'}>Detach</ContextMenu.Item>
                        </ContextMenu.Root>
                      </div>
                    </div>
                    {expandedPolicies.has(policy.id) && policy.permissions && <PolicyDetails permissions={policy.permissions} />}
                  </div>
                ))}
              </div>
            </div>
          </Tab>

          <Tab id="entities" label="Entities attached">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-16 font-semibold leading-24 text-text">Entities attached</h2>
              <TabSelector
                options={[
                  { id: 'user-groups', label: 'User groups' },
                  { id: 'users', label: 'Users' },
                ]}
                value={entitiesSubTab}
                onChange={(id) => {
                  setEntitiesSubTab(id as 'user-groups' | 'users');
                  setEntitiesCurrentPage(1);
                  setEntitiesFilters([]);
                }}
                variant="small"
              />
              <FilterSearchInput
                filterKeys={entitiesFilterKeys}
                onFilterAdd={(f) => { setEntitiesFilters((p) => [...p, f]); setEntitiesCurrentPage(1); }}
                selectedFilters={entitiesFilters}
                placeholder={entitiesSubTab === 'user-groups' ? 'Search user groups by attributes' : 'Search users by attributes'}
                defaultFilterKey="name"
              />
              {entitiesSubTab === 'user-groups' ? (
                <>
                  <Pagination
                    totalCount={filteredUserGroups.length}
                    size={itemsPerPage}
                    currentAt={entitiesCurrentPage}
                    onPageChange={setEntitiesCurrentPage}
                    totalCountLabel="items"
                  />
                  <Table columns={userGroupColumns} rows={paginatedUserGroups}>
                    {paginatedUserGroups.map((row) => (
                      <Table.Tr key={row.id} rowData={row}>
                        <Table.Td rowData={row} column={userGroupColumns[0]}>
                          <Link to={`/iam/user-groups/${row.name}`} className="text-primary font-medium hover:underline">
                            {row.name}
                          </Link>
                        </Table.Td>
                        <Table.Td rowData={row} column={userGroupColumns[1]}>{row.type}</Table.Td>
                        <Table.Td rowData={row} column={userGroupColumns[2]}>{row.userCount}</Table.Td>
                        <Table.Td rowData={row} column={userGroupColumns[3]}>{row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table>
                </>
              ) : (
                <>
                  <Pagination
                    totalCount={filteredUsers.length}
                    size={itemsPerPage}
                    currentAt={entitiesCurrentPage}
                    onPageChange={setEntitiesCurrentPage}
                    totalCountLabel="items"
                  />
                  <Table columns={userColumns} rows={paginatedUsers}>
                    {paginatedUsers.map((row) => (
                      <Table.Tr key={row.id} rowData={row}>
                        <Table.Td rowData={row} column={userColumns[0]}>
                          <Link to={`/iam/users/${row.name}`} className="text-primary font-medium hover:underline">
                            {row.name}
                          </Link>
                        </Table.Td>
                        <Table.Td rowData={row} column={userColumns[1]}>{row.type}</Table.Td>
                        <Table.Td rowData={row} column={userColumns[2]}>{row.lastSignIn}</Table.Td>
                        <Table.Td rowData={row} column={userColumns[3]}>{row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table>
                </>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default IAMRoleDetailPage;
