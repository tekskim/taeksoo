import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { Badge } from '@shared/components/Badge';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconSettings,
} from '@tabler/icons-react';

interface PolicyDetail {
  id: string;
  name: string;
  description: string;
  type: 'Built-in' | 'Custom';
  condition: string;
  editedAt: string;
  createdAt: string;
}

interface Permission {
  id: string;
  app: string;
  partition: string;
  resource: string;
  actionClass: string[];
  actions?: string[];
}

interface AttachedRole {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  userGroupCount: number;
  policies: string;
  createdAt: string;
  [key: string]: unknown;
}

interface PolicyVersion {
  id: string;
  version: number;
  isActive: boolean;
  conditions: string;
  editedBy: string;
  editedAt: string;
  statements: string[];
}

const mockPoliciesMap: Record<string, PolicyDetail> = {
  FullAccess: {
    id: 'p-001',
    name: 'FullAccess',
    description: 'Full access to all resources',
    type: 'Built-in',
    condition: 'None',
    editedAt: 'Sep 12, 2025',
    createdAt: 'Jan 1, 2025 10:00:00',
  },
  ReadCompute: {
    id: 'p-002',
    name: 'ReadCompute',
    description: 'Read-only compute access',
    type: 'Built-in',
    condition: 'IP restriction',
    editedAt: 'Sep 12, 2025',
    createdAt: 'Feb 15, 2025 14:30:00',
  },
  ManageStorage: {
    id: 'p-004',
    name: 'ManageStorage',
    description: 'Storage management policy',
    type: 'Custom',
    condition: 'None',
    editedAt: 'Aug 15, 2025',
    createdAt: 'Mar 20, 2025 09:15:00',
  },
};

const mockPermissions: Permission[] = [
  {
    id: 'perm-001',
    app: 'Compute',
    partition: 'tenantA',
    resource: 'Instance',
    actionClass: ['Read', 'List'],
    actions: ['compute:DescribeInstances', 'compute:ListInstances'],
  },
  {
    id: 'perm-002',
    app: 'Compute',
    partition: 'tenantA',
    resource: 'Volume',
    actionClass: ['Read', 'List', 'Write'],
    actions: ['compute:DescribeVolumes', 'compute:ListVolumes', 'compute:CreateVolume'],
  },
  {
    id: 'perm-003',
    app: 'Storage',
    partition: '-',
    resource: 'Bucket',
    actionClass: ['Read'],
    actions: ['storage:GetBucket'],
  },
  {
    id: 'perm-004',
    app: 'IAM',
    partition: '-',
    resource: 'User',
    actionClass: ['Read', 'List'],
    actions: ['iam:GetUser', 'iam:ListUsers'],
  },
];

const mockAttachedRoles: AttachedRole[] = [
  {
    id: 'role-001',
    name: 'admin',
    type: 'Built-in',
    userGroupCount: 5,
    policies: 'FullAccess (+2)',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
  {
    id: 'role-002',
    name: 'compute-admin',
    type: 'Built-in',
    userGroupCount: 3,
    policies: 'ReadCompute (+3)',
    createdAt: 'Jun 15, 2025 12:22:26',
  },
  {
    id: 'role-003',
    name: 'developer',
    type: 'Custom',
    userGroupCount: 12,
    policies: 'DeveloperAccess',
    createdAt: 'Sep 1, 2025 10:20:28',
  },
  {
    id: 'role-004',
    name: 'viewer',
    type: 'Built-in',
    userGroupCount: 8,
    policies: 'ReadAll',
    createdAt: 'Jun 20, 2025 23:27:51',
  },
];

const mockVersionHistory: PolicyVersion[] = [
  {
    id: 'v-001',
    version: 5,
    isActive: true,
    conditions: 'IP restriction + MFA',
    editedBy: 'admin',
    editedAt: 'Sep 12, 2025',
    statements: ['Allow compute:* on resource:instance/*', 'Deny iam:DeleteUser'],
  },
  {
    id: 'v-002',
    version: 4,
    isActive: false,
    conditions: 'IP restriction',
    editedBy: 'admin',
    editedAt: 'Sep 10, 2025',
    statements: ['Allow compute:Read* on resource:instance/*'],
  },
  {
    id: 'v-003',
    version: 3,
    isActive: false,
    conditions: 'None',
    editedBy: 'thaki-kim',
    editedAt: 'Sep 5, 2025',
    statements: ['Allow compute:Read* on resource:*'],
  },
  {
    id: 'v-004',
    version: 2,
    isActive: false,
    conditions: 'None',
    editedBy: 'thaki-kim',
    editedAt: 'Aug 20, 2025',
    statements: ['Allow *:Read* on resource:*', 'Deny iam:*'],
  },
  {
    id: 'v-005',
    version: 1,
    isActive: false,
    conditions: 'None',
    editedBy: 'system',
    editedAt: 'Jan 1, 2025',
    statements: ['Allow *:* on resource:*'],
  },
];

const ActionTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={toggle}
    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
    aria-label="Actions"
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
);

function PermissionDetails({ actions }: { actions: string[] }) {
  return (
    <div className="border-t border-border p-4 bg-surface">
      <div className="flex flex-col gap-1">
        <div className="flex items-stretch min-h-9 bg-surface-muted border border-border rounded-md">
          <div className="w-10 px-3 py-2 text-11 font-medium leading-16 text-text flex items-center">
            #
          </div>
          <div className="flex-1 px-3 py-2 text-11 font-medium leading-16 text-text flex items-center border-l border-border">
            Action
          </div>
        </div>
        {actions.map((action, i) => (
          <div
            key={i}
            className="flex items-stretch min-h-9 bg-surface border border-border rounded-md"
          >
            <div className="w-10 px-3 py-1.5 text-12 leading-16 text-text-muted flex items-center">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center truncate">
              {action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VersionDetails({ statements }: { statements: string[] }) {
  return (
    <div className="border-t border-border p-4 bg-surface">
      <div className="flex flex-col gap-1">
        <div className="flex items-stretch min-h-9 bg-surface-muted border border-border rounded-md">
          <div className="w-10 px-3 py-2 text-11 font-medium leading-16 text-text flex items-center">
            #
          </div>
          <div className="flex-1 px-3 py-2 text-11 font-medium leading-16 text-text flex items-center border-l border-border">
            Statement
          </div>
        </div>
        {statements.map((stmt, i) => (
          <div
            key={i}
            className="flex items-stretch min-h-9 bg-surface border border-border rounded-md"
          >
            <div className="w-10 px-3 py-1.5 text-12 leading-16 text-text-muted flex items-center">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center truncate">
              {stmt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IAMPolicyDetailPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const [activeTab, setActiveTab] = useState('permissions');
  const [permFilters, setPermFilters] = useState<FilterKeyWithValue[]>([]);
  const [permPage, setPermPage] = useState(1);
  const [rolesFilters, setRolesFilters] = useState<FilterKeyWithValue[]>([]);
  const [rolesPage, setRolesPage] = useState(1);
  const [expandedPerms, setExpandedPerms] = useState<Set<string>>(new Set(['perm-002']));
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['v-004']));

  const policy = policyId ? mockPoliciesMap[policyId] : null;
  const itemsPerPage = 10;

  const applyFilter = <T extends Record<string, unknown>>(
    data: T[],
    filters: FilterKeyWithValue[]
  ): T[] => {
    if (filters.length === 0) return data;
    return data.filter((item) =>
      filters.every((f) =>
        String(item[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  };

  const filteredRoles = applyFilter(mockAttachedRoles, rolesFilters);
  const paginatedRoles = filteredRoles.slice(
    (rolesPage - 1) * itemsPerPage,
    rolesPage * itemsPerPage
  );

  const permFilterKeys: FilterKey[] = [
    { key: 'app', label: 'App', type: 'input', placeholder: 'Enter app...' },
  ];
  const rolesFilterKeys: FilterKey[] = [
    { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter role name...' },
  ];

  const roleColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'policies', header: 'Policies' },
    { key: 'userGroupCount', header: 'User group count' },
    { key: 'createdAt', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  if (!policy) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-text-muted">Policy not found</p>
      </div>
    );
  }

  const infoFields = [
    { label: 'Description', value: policy.description },
    { label: 'Type', value: policy.type },
    { label: 'Condition', value: policy.condition },
    { label: 'Edited at', value: policy.editedAt },
    { label: 'Created at', value: policy.createdAt },
  ];

  const actions = (
    <div className="flex items-center gap-1">
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
        <ContextMenu.Item action={() => {}}>Manage roles</ContextMenu.Item>
        <ContextMenu.Item action={() => {}}>Duplicate</ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={policy.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
          <Tab id="permissions" label="Permissions">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-16 font-semibold leading-24 text-text m-0">Permissions</h2>
                <Button variant="secondary" appearance="outline" size="sm">
                  <IconEdit size={12} /> Edit
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={permFilterKeys}
                onFilterAdd={(f) => {
                  setPermFilters((p) => [...p, f]);
                  setPermPage(1);
                }}
                selectedFilters={permFilters}
                placeholder="Search permissions by attributes"
                defaultFilterKey="app"
              />
              <Pagination
                totalCount={mockPermissions.length}
                size={itemsPerPage}
                currentAt={permPage}
                onPageChange={setPermPage}
                totalCountLabel="items"
              />
              <div className="flex flex-col gap-1">
                {mockPermissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="rounded-md border border-border bg-surface overflow-hidden"
                  >
                    <div className="flex items-center min-h-9 hover:bg-surface-muted transition-colors">
                      <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-12 leading-16 text-text">
                        <button
                          type="button"
                          onClick={() =>
                            perm.actions &&
                            setExpandedPerms((prev) => {
                              const n = new Set(prev);
                              n.has(perm.id) ? n.delete(perm.id) : n.add(perm.id);
                              return n;
                            })
                          }
                          className={`p-0.5 hover:bg-surface-muted rounded bg-transparent border-none cursor-pointer flex-shrink-0 ${!perm.actions ? 'invisible' : ''}`}
                        >
                          {expandedPerms.has(perm.id) ? (
                            <IconChevronDown size={16} stroke={1.5} />
                          ) : (
                            <IconChevronRight size={16} stroke={1.5} />
                          )}
                        </button>
                        <span className="truncate">{perm.app}</span>
                      </div>
                      <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text truncate">
                        {perm.partition}
                      </div>
                      <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text truncate">
                        {perm.resource}
                      </div>
                      <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text flex items-center gap-1 flex-wrap">
                        {perm.actionClass.map((ac, i) => (
                          <Badge key={i} theme="gry" size="sm">
                            {ac}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {expandedPerms.has(perm.id) && perm.actions && (
                      <PermissionDetails actions={perm.actions} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Tab>

          <Tab id="roles" label="Roles">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-16 font-semibold leading-24 text-text m-0">Roles</h2>
                <Button variant="secondary" appearance="outline" size="sm">
                  <IconSettings size={12} /> Manage roles
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={rolesFilterKeys}
                onFilterAdd={(f) => {
                  setRolesFilters((p) => [...p, f]);
                  setRolesPage(1);
                }}
                selectedFilters={rolesFilters}
                placeholder="Search roles by attributes"
                defaultFilterKey="name"
              />
              <Pagination
                totalCount={filteredRoles.length}
                size={itemsPerPage}
                currentAt={rolesPage}
                onPageChange={setRolesPage}
                totalCountLabel="items"
              />
              <Table columns={roleColumns} rows={paginatedRoles}>
                {paginatedRoles.map((role) => (
                  <Table.Tr key={role.id} rowData={role}>
                    <Table.Td rowData={role} column={roleColumns[0]}>
                      <Link
                        to={`/iam/roles/${role.name}`}
                        className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
                      >
                        {role.name}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={role} column={roleColumns[1]}>
                      {role.type}
                    </Table.Td>
                    <Table.Td rowData={role} column={roleColumns[2]}>
                      {role.policies}
                    </Table.Td>
                    <Table.Td rowData={role} column={roleColumns[3]}>
                      {role.userGroupCount}
                    </Table.Td>
                    <Table.Td rowData={role} column={roleColumns[4]}>
                      {role.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                    <Table.Td rowData={role} column={roleColumns[5]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => {}} danger>
                          Detach
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="version-history" label="Version history">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-16 font-semibold leading-24 text-text m-0">Version history</h2>
              <div className="flex flex-col gap-1">
                {mockVersionHistory.map((ver) => (
                  <div
                    key={ver.id}
                    className="rounded-md border border-border bg-surface overflow-hidden"
                  >
                    <div className="flex items-center min-h-9 hover:bg-surface-muted transition-colors">
                      <div className="w-[70px] flex items-center justify-center px-3 py-1.5">
                        {ver.isActive && (
                          <Badge theme="gre" size="sm">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-12 leading-16 text-text">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedVersions((prev) => {
                              const n = new Set(prev);
                              n.has(ver.id) ? n.delete(ver.id) : n.add(ver.id);
                              return n;
                            })
                          }
                          className="p-0.5 hover:bg-surface-muted rounded bg-transparent border-none cursor-pointer flex-shrink-0"
                        >
                          {expandedVersions.has(ver.id) ? (
                            <IconChevronDown size={16} stroke={1.5} />
                          ) : (
                            <IconChevronRight size={16} stroke={1.5} />
                          )}
                        </button>
                        <span className="truncate">Version {ver.version}</span>
                      </div>
                      <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text truncate">
                        {ver.conditions}
                      </div>
                      <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text truncate">
                        {ver.editedBy}
                      </div>
                      <div className="flex-1 min-w-0 px-3 py-1.5 text-12 leading-16 text-text whitespace-nowrap">
                        {ver.editedAt}
                      </div>
                      <div className="w-[72px] flex items-center justify-center px-3 py-2">
                        <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                          <ContextMenu.Item action={() => {}} disabled={ver.isActive}>
                            Revert
                          </ContextMenu.Item>
                          <ContextMenu.Item action={() => {}} danger disabled={ver.isActive}>
                            Delete
                          </ContextMenu.Item>
                        </ContextMenu.Root>
                      </div>
                    </div>
                    {expandedVersions.has(ver.id) && <VersionDetails statements={ver.statements} />}
                  </div>
                ))}
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
