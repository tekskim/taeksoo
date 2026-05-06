import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  HStack,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabBar,
  Badge,
  ContextMenu,
  DetailHeader,
  PageShell,
  ErrorState,
  ConfirmModal,
  StatusIndicator,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { InlineCopyId } from '@/components/InlineCopyId';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconDotsCircleHorizontal,
  IconCopyCheck,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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
  roleId: string;
  type: 'Built-in' | 'Custom';
  members: number;
  userGroupCount: number;
  policies: string;
  createdAt: string;
}

interface VersionPermission {
  application: string;
  partition: string;
  resource: string;
  actions: string[];
}

interface PolicyVersion {
  id: string;
  version: number;
  isActive: boolean;
  conditions: string;
  editedBy: string;
  editedAt: string;
  permissions: VersionPermission[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPoliciesMap: Record<string, PolicyDetail> = {
  'p-001': {
    id: 'p-001',
    name: 'policy',
    description: 'Provide read only access to all apps',
    type: 'Custom',
    condition: '-',
    editedAt: 'Jul 25, 2026 14:20:05 (UTC+9)',
    createdAt: 'Jul 25, 2026 10:32:16 (UTC+9)',
  },
  'p-002': {
    id: 'p-002',
    name: 'policy',
    description: 'Full access policy for compute resources',
    type: 'Built-in',
    condition: 'MFA Required',
    editedAt: 'Aug 15, 2026 09:15:30 (UTC+9)',
    createdAt: 'Jun 1, 2026 10:20:28 (UTC+9)',
  },
  'p-003': {
    id: 'p-003',
    name: 'ComputeFullAccess',
    description: 'Full access to compute resources',
    type: 'Built-in',
    condition: '-',
    editedAt: 'Aug 15, 2026 11:42:18 (UTC+9)',
    createdAt: 'Jun 1, 2026 10:20:28 (UTC+9)',
  },
};

const mockPermissions: Permission[] = [
  {
    id: 'perm-001',
    app: 'Compute',
    partition: '*all',
    resource: '*all',
    actionClass: ['List', 'Read'],
    actions: [
      'compute:list:instances',
      'compute:read:instances',
      'compute:list:volumes',
      'compute:read:volumes',
    ],
  },
  {
    id: 'perm-002',
    app: 'Compute',
    partition: '*all',
    resource: '*all',
    actionClass: ['List', 'Delete'],
    actions: [
      '{actionclass}:{action}',
      '{actionclass}:{action}',
      '{actionclass}:{action}',
      '{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
    ],
  },
  {
    id: 'perm-003',
    app: 'Storage',
    partition: 'tenantA',
    resource: 'Bucket',
    actionClass: ['Read', 'List', 'Write'],
    actions: [
      'storage:read:bucket',
      'storage:list:bucket',
      'storage:write:bucket',
      'storage:read:object',
      'storage:list:object',
      'storage:write:object',
    ],
  },
  {
    id: 'perm-004',
    app: 'Container',
    partition: '*all',
    resource: 'Deployment',
    actionClass: ['Read', 'List'],
    actions: [
      'container:read:deployment',
      'container:list:deployment',
      'container:read:pod',
      'container:list:pod',
    ],
  },
];

const mockAttachedRoles: AttachedRole[] = [
  {
    id: 'role-001',
    name: 'admin',
    roleId: '12345678',
    type: 'Built-in',
    members: 120,
    userGroupCount: 5,
    policies: 'FullAccess (+2)',
    createdAt: 'Jun 1, 2026',
  },
  {
    id: 'role-002',
    name: 'compute-admin',
    roleId: '23456789',
    type: 'Built-in',
    members: 45,
    userGroupCount: 3,
    policies: 'ComputeAccess',
    createdAt: 'Jun 15, 2026',
  },
  {
    id: 'role-003',
    name: 'viewer',
    roleId: '34567890',
    type: 'Built-in',
    members: 200,
    userGroupCount: 8,
    policies: 'ReadOnly (+1)',
    createdAt: 'Jul 1, 2026',
  },
  {
    id: 'role-004',
    name: 'network-admin',
    roleId: '45678901',
    type: 'Custom',
    members: 30,
    userGroupCount: 4,
    policies: 'NetworkAccess (+1)',
    createdAt: 'Aug 10, 2026',
  },
];

interface AttachedUser {
  id: string;
  username: string;
  userId: string;
  status: 'active' | 'error' | 'muted';
  attachment: string;
  createdAt: string;
}

const mockAttachedUsers: AttachedUser[] = [
  {
    id: 'u-001',
    username: 'john.doe',
    userId: '10293847',
    status: 'active',
    attachment: 'Group{engineering}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-002',
    username: 'jane.smith',
    userId: '20384756',
    status: 'active',
    attachment: 'Group{engineering}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-003',
    username: 'alex.kim',
    userId: '30495867',
    status: 'active',
    attachment: 'Group{devops}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-004',
    username: 'maria.garcia',
    userId: '40506978',
    status: 'active',
    attachment: 'Group{devops}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-005',
    username: 'david.lee',
    userId: '50617089',
    status: 'active',
    attachment: 'Group{platform}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-006',
    username: 'sarah.chen',
    userId: '60728190',
    status: 'active',
    attachment: 'Group{platform}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-007',
    username: 'michael.park',
    userId: '70839201',
    status: 'active',
    attachment: 'Group{engineering}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-008',
    username: 'emma.wilson',
    userId: '80940312',
    status: 'active',
    attachment: 'Group{engineering}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-009',
    username: 'chris.zhang',
    userId: '91051423',
    status: 'active',
    attachment: 'Group{devops}',
    createdAt: 'May 4, 2026',
  },
  {
    id: 'u-010',
    username: 'olivia.brown',
    userId: '10162534',
    status: 'active',
    attachment: 'Direct',
    createdAt: 'May 4, 2026',
  },
];

interface AttachedUserGroup {
  id: string;
  name: string;
  groupId: string;
  members: number;
  createdAt: string;
}

const mockAttachedUserGroups: AttachedUserGroup[] = [
  {
    id: 'ug-001',
    name: 'engineering',
    groupId: '10293847',
    members: 100,
    createdAt: 'May 4, 2026',
  },
  { id: 'ug-002', name: 'devops', groupId: '20384756', members: 42, createdAt: 'May 4, 2026' },
  { id: 'ug-003', name: 'platform', groupId: '30495867', members: 28, createdAt: 'May 4, 2026' },
  { id: 'ug-004', name: 'security', groupId: '40506978', members: 15, createdAt: 'May 4, 2026' },
  {
    id: 'ug-005',
    name: 'data-science',
    groupId: '50617089',
    members: 35,
    createdAt: 'May 4, 2026',
  },
];

interface AttachedServiceAccount {
  id: string;
  name: string;
  accountId: string;
  members: number;
  createdAt: string;
}

const mockAttachedServiceAccounts: AttachedServiceAccount[] = [
  {
    id: 'sa-001',
    name: 'ci-pipeline',
    accountId: '11223344',
    members: 3,
    createdAt: 'May 4, 2026',
  },
  {
    id: 'sa-002',
    name: 'monitoring-agent',
    accountId: '22334455',
    members: 1,
    createdAt: 'May 4, 2026',
  },
  {
    id: 'sa-003',
    name: 'backup-service',
    accountId: '33445566',
    members: 2,
    createdAt: 'May 4, 2026',
  },
  { id: 'sa-004', name: 'deploy-bot', accountId: '44556677', members: 5, createdAt: 'May 4, 2026' },
];

const mockVersionHistory: PolicyVersion[] = [
  {
    id: 'v-005',
    version: 5,
    isActive: true,
    conditions: 'MFA',
    editedBy: 'thaki-kim',
    editedAt: 'Sep 12, 2026',
    permissions: [
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Instance',
        actions: ['Read', 'List'],
      },
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Volume',
        actions: ['Read', 'List', 'Write'],
      },
      { application: 'IAM', partition: '-', resource: '*all', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'v-004',
    version: 4,
    isActive: false,
    conditions: '-',
    editedBy: 'alex-jones',
    editedAt: 'Sep 11, 2026',
    permissions: [
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Instance',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Volume',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
      { application: 'Container', partition: '*all', resource: 'Pod', actions: ['Read', 'List'] },
      { application: 'IAM', partition: '-', resource: '*all', actions: ['Read'] },
    ],
  },
  {
    id: 'v-003',
    version: 3,
    isActive: false,
    conditions: 'IP Range',
    editedBy: 'sarah-lee',
    editedAt: 'Sep 5, 2026',
    permissions: [
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Instance',
        actions: ['Read', 'List'],
      },
      { application: 'Storage', partition: '*all', resource: 'Bucket', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'v-002',
    version: 2,
    isActive: false,
    conditions: '-',
    editedBy: 'thaki-kim',
    editedAt: 'Aug 20, 2026',
    permissions: [
      { application: 'Compute', partition: 'tenantA', resource: 'Instance', actions: ['Read'] },
    ],
  },
  {
    id: 'v-001',
    version: 1,
    isActive: false,
    conditions: '-',
    editedBy: 'thaki-kim',
    editedAt: 'Jul 25, 2026',
    permissions: [
      {
        application: 'Compute',
        partition: '*all',
        resource: 'Instance',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Compute',
        partition: '*all',
        resource: 'Volume',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
      { application: 'Container', partition: '*all', resource: '*all', actions: ['Read', 'List'] },
      { application: 'IAM', partition: '-', resource: 'User', actions: ['Read', 'List'] },
      { application: 'Storage', partition: '*all', resource: 'Object', actions: ['Read', 'List'] },
    ],
  },
];

/* ----------------------------------------
   InfoCard Component
   ---------------------------------------- */

interface InfoCardProps {
  label: string;
  value: string;
}

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="basis-0 grow bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3 flex flex-col gap-1.5">
      <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
      <span className="text-body-md text-[var(--color-text-default)]">{value}</span>
    </div>
  );
}

/* ----------------------------------------
   Permission Details Component
   ---------------------------------------- */

interface PermissionDetailsProps {
  actions: string[];
}

function PermissionDetails({ actions }: PermissionDetailsProps) {
  return (
    <div className="border-t border-[var(--color-border-subtle)] p-4 bg-[var(--color-surface-default)]">
      <div className="flex flex-col gap-[var(--table-row-gap)]">
        {/* Table Header */}
        <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
          <div className="w-10 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center">
            #
          </div>
          <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Action
          </div>
        </div>

        {/* Table Rows */}
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] hover:bg-[var(--table-row-hover-bg)] transition-colors"
          >
            <div className="w-10 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-muted)] flex items-center">
              {index + 1}
            </div>
            <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
              {action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Version Details Component
   ---------------------------------------- */

interface VersionDetailsProps {
  permissions: VersionPermission[];
}

function VersionDetails({ permissions }: VersionDetailsProps) {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-[var(--table-row-gap)]">
        <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
          <div className="w-10 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center">
            #
          </div>
          <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Application
          </div>
          <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Partition
          </div>
          <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Resource
          </div>
          <div className="flex-[2] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Action
          </div>
        </div>

        {permissions.map((perm, index) => (
          <div
            key={index}
            className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] hover:bg-[var(--table-row-hover-bg)] transition-colors"
          >
            <div className="w-10 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-muted)] flex items-center">
              {index + 1}
            </div>
            <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
              {perm.application}
            </div>
            <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
              {perm.partition}
            </div>
            <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
              {perm.resource}
            </div>
            <div className="flex-[2] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center gap-1 flex-wrap">
              {perm.actions.map((action, i) => (
                <Badge key={i} theme="white" size="sm">
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
   Main Component
   ---------------------------------------- */

export default function IAMPolicyDetailPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'permissions';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Permissions tab state
  const [permSearchQuery, setPermSearchQuery] = useState('');
  const [permCurrentPage, setPermCurrentPage] = useState(1);
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(
    new Set(['perm-002'])
  );

  // Roles tab state
  const [rolesSearchQuery, setRolesSearchQuery] = useState('');
  const [rolesCurrentPage, setRolesCurrentPage] = useState(1);
  const [entitiesTab, setEntitiesTab] = useState('users');
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [userGroupsSearchQuery, setUserGroupsSearchQuery] = useState('');
  const [userGroupsCurrentPage, setUserGroupsCurrentPage] = useState(1);
  const [serviceAccountsSearchQuery, setServiceAccountsSearchQuery] = useState('');
  const [serviceAccountsCurrentPage, setServiceAccountsCurrentPage] = useState(1);

  // Version history tab state
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const itemsPerPage = 10;
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Get policy details
  const policy = policyId ? mockPoliciesMap[policyId] : null;

  useEffect(() => {
    if (policy) {
      updateActiveTabLabel(policy.name);
    }
  }, [policy, updateActiveTabLabel]);

  // Filter permissions
  const filteredPermissions = mockPermissions.filter(
    (perm) =>
      perm.app.toLowerCase().includes(permSearchQuery.toLowerCase()) ||
      perm.partition.toLowerCase().includes(permSearchQuery.toLowerCase()) ||
      perm.resource.toLowerCase().includes(permSearchQuery.toLowerCase())
  );

  const permTotalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice(
    (permCurrentPage - 1) * itemsPerPage,
    permCurrentPage * itemsPerPage
  );

  // Filter attached user groups
  const filteredUserGroups = mockAttachedUserGroups.filter((group) =>
    group.name.toLowerCase().includes(userGroupsSearchQuery.toLowerCase())
  );

  const userGroupsTotalPages = Math.ceil(filteredUserGroups.length / itemsPerPage);
  const paginatedUserGroups = filteredUserGroups.slice(
    (userGroupsCurrentPage - 1) * itemsPerPage,
    userGroupsCurrentPage * itemsPerPage
  );

  // Filter attached service accounts
  const filteredServiceAccounts = mockAttachedServiceAccounts.filter((sa) =>
    sa.name.toLowerCase().includes(serviceAccountsSearchQuery.toLowerCase())
  );

  const serviceAccountsTotalPages = Math.ceil(filteredServiceAccounts.length / itemsPerPage);
  const paginatedServiceAccounts = filteredServiceAccounts.slice(
    (serviceAccountsCurrentPage - 1) * itemsPerPage,
    serviceAccountsCurrentPage * itemsPerPage
  );

  // Filter attached roles
  const filteredRoles = mockAttachedRoles.filter((role) =>
    role.name.toLowerCase().includes(rolesSearchQuery.toLowerCase())
  );

  const rolesTotalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (rolesCurrentPage - 1) * itemsPerPage,
    rolesCurrentPage * itemsPerPage
  );

  // Filter attached users
  const filteredUsers = mockAttachedUsers.filter((user) =>
    user.username.toLowerCase().includes(usersSearchQuery.toLowerCase())
  );

  const usersTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (usersCurrentPage - 1) * itemsPerPage,
    usersCurrentPage * itemsPerPage
  );

  // Toggle permission expansion
  const togglePermissionExpansion = (permId: string) => {
    setExpandedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permId)) {
        newSet.delete(permId);
      } else {
        newSet.add(permId);
      }
      return newSet;
    });
  };

  // Toggle version expansion
  const toggleVersionExpansion = (versionId: string) => {
    setExpandedVersions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Policies', href: '/iam/policies' },
    { label: policy?.name || policyId || '' },
  ];

  // Users table columns
  const usersColumns: TableColumn<AttachedUser>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value: string) => <StatusIndicator status={value as 'active'} layout="icon-only" />,
    },
    {
      key: 'username',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_value: string, row: AttachedUser) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/iam/users/${row.id}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline truncate"
          >
            {row.username}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.userId}>
              ID:{row.userId}
            </span>
            <InlineCopyId value={row.userId} />
          </span>
        </div>
      ),
    },
    {
      key: 'attachment',
      label: 'Attachment',
      flex: 1,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row: AttachedUser) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'detach',
            label: 'Detach',
            status: 'danger',
            onClick: () => console.log('Detach user', row.id),
          },
        ];
        return (
          <ContextMenu items={menuItems} trigger="click" align="right">
            <button
              aria-label="Row actions"
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        );
      },
    },
  ];

  // User groups table columns
  const userGroupsColumns: TableColumn<AttachedUserGroup>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_value: string, row: AttachedUserGroup) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/iam/user-groups/${row.id}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline truncate"
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.groupId}>
              ID:{row.groupId}
            </span>
            <InlineCopyId value={row.groupId} />
          </span>
        </div>
      ),
    },
    {
      key: 'members',
      label: 'Members',
      flex: 1,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row: AttachedUserGroup) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'detach',
            label: 'Detach',
            status: 'danger',
            onClick: () => console.log('Detach user group', row.id),
          },
        ];
        return (
          <ContextMenu items={menuItems} trigger="click" align="right">
            <button
              aria-label="Row actions"
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        );
      },
    },
  ];

  // Service accounts table columns
  const serviceAccountsColumns: TableColumn<AttachedServiceAccount>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_value: string, row: AttachedServiceAccount) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/iam/service-accounts/${row.id}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline truncate"
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.accountId}>
              ID:{row.accountId}
            </span>
            <InlineCopyId value={row.accountId} />
          </span>
        </div>
      ),
    },
    {
      key: 'members',
      label: 'Members',
      flex: 1,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row: AttachedServiceAccount) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'detach',
            label: 'Detach',
            status: 'danger',
            onClick: () => console.log('Detach service account', row.id),
          },
        ];
        return (
          <ContextMenu items={menuItems} trigger="click" align="right">
            <button
              aria-label="Row actions"
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        );
      },
    },
  ];

  // Roles table columns
  const rolesColumns: TableColumn<AttachedRole>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_value: string, row: AttachedRole) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/iam/roles/${row.id}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline truncate"
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.roleId}>
              ID:{row.roleId}
            </span>
            <InlineCopyId value={row.roleId} />
          </span>
        </div>
      ),
    },
    {
      key: 'members',
      label: 'Members',
      flex: 1,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row: AttachedRole) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'detach',
            label: 'Detach',
            status: 'danger',
            onClick: () => console.log('Detach role', row.id),
          },
        ];
        return (
          <ContextMenu items={menuItems} trigger="click" align="right">
            <button
              aria-label="Row actions"
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        );
      },
    },
  ];

  // Version context menu items factory based on active status
  const getVersionContextMenuItems = (version: PolicyVersion): ContextMenuItem[] => {
    const isActive = version.isActive;
    return [
      {
        id: 'revert',
        label: 'Revert',
        disabled: isActive,
        onClick: () => console.log('Revert version', version.id),
      },
      {
        id: 'delete',
        label: 'Delete',
        status: isActive ? undefined : 'danger',
        disabled: isActive,
        onClick: () => console.log('Delete version', version.id),
      },
    ];
  };

  if (!policy) {
    return (
      <PageShell
        sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
        sidebarWidth={sidebarWidth}
        tabBar={
          <TabBar
            tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
          />
        }
        topBar={
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            showNavigation
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={<Breadcrumb items={[{ label: 'Policies', href: '/iam/policies' }]} />}
          />
        }
        contentClassName="pt-4 px-8 pb-6"
      >
        <ErrorState
          title="Policy not found"
          description="The requested policy could not be found."
          action={
            <Button variant="secondary" size="md" onClick={() => navigate('/iam/policies')}>
              Back to policies
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Header */}
        <DetailHeader>
          <DetailHeader.Title>{policy.name}</DetailHeader.Title>

          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconCopyCheck size={12} />}
              onClick={() => console.log('Duplicate policy', policy.id)}
            >
              Duplicate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} />}
              onClick={() => console.log('Edit policy', policy.id)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconTrash size={12} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="ID" value={policy.id} copyable />
            <DetailHeader.InfoCard label="Description" value={policy.description} />
            <DetailHeader.InfoCard label="Type" value={policy.type} />
            <DetailHeader.InfoCard label="Edited at" value={policy.editedAt} />
            <DetailHeader.InfoCard label="Created at" value={policy.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="permissions">Permissions</Tab>
              <Tab value="roles">Attached entities</Tab>
              <Tab value="version-history">Version history</Tab>
            </TabList>

            {/* Permissions Tab */}
            <TabPanel value="permissions" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <HStack justify="between" align="center" className="w-full">
                  <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Permissions
                  </h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconEdit size={12} />}
                    onClick={() => console.log('Edit permissions', policy.id)}
                  >
                    Edit
                  </Button>
                </HStack>

                {/* Search */}
                <SearchInput
                  placeholder="Search permissions by attributes"
                  value={permSearchQuery}
                  onChange={(e) => setPermSearchQuery(e.target.value)}
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={permCurrentPage}
                  totalPages={permTotalPages}
                  totalItems={filteredPermissions.length}
                  onPageChange={setPermCurrentPage}
                />

                {/* Permissions Table */}
                <Table<Permission>
                  columns={[
                    {
                      key: 'app',
                      label: 'App',
                      flex: 1,
                      sortable: true,
                      render: (_value: string, perm: Permission) => (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePermissionExpansion(perm.id);
                            }}
                            className="p-0.5 hover:bg-[var(--color-surface-subtle)] rounded"
                          >
                            {expandedPermissions.has(perm.id) ? (
                              <IconChevronDown size={12} strokeWidth={2} />
                            ) : (
                              <IconChevronRight size={12} strokeWidth={2} />
                            )}
                          </button>
                          {perm.app}
                        </div>
                      ),
                    },
                    { key: 'partition', label: 'Partition', flex: 1, sortable: true },
                    { key: 'resource', label: 'Resource', flex: 1, sortable: true },
                    {
                      key: 'actionClass',
                      label: 'Action class',
                      flex: 1,
                      sortable: true,
                      render: (_value: string[], perm: Permission) => (
                        <div className="flex items-center gap-1 flex-wrap">
                          {perm.actionClass.map((action, i) => (
                            <Badge key={i} theme="white" size="sm">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                  data={paginatedPermissions}
                  rowKey="id"
                  onRowClick={(perm) => togglePermissionExpansion(perm.id)}
                  expandedContent={(perm) =>
                    expandedPermissions.has(perm.id) ? (
                      <PermissionDetails actions={perm.actions || []} />
                    ) : null
                  }
                />
              </VStack>
            </TabPanel>

            {/* Attached Entities Tab */}
            <TabPanel value="roles" className="pt-0">
              <VStack gap={4} className="pt-4">
                <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Attached entities
                </h2>

                <Tabs value={entitiesTab} onChange={setEntitiesTab} variant="boxed" size="sm">
                  <TabList>
                    <Tab value="users">Users</Tab>
                    <Tab value="user-groups">User groups</Tab>
                    <Tab value="roles">Roles</Tab>
                    <Tab value="service-accounts">Service accounts</Tab>
                  </TabList>

                  <TabPanel value="users" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      <SearchInput
                        placeholder="Search users by attributes"
                        value={usersSearchQuery}
                        onChange={(e) => setUsersSearchQuery(e.target.value)}
                        className="w-[var(--search-input-width)]"
                      />
                      <Pagination
                        currentPage={usersCurrentPage}
                        totalPages={usersTotalPages}
                        totalItems={filteredUsers.length}
                        onPageChange={setUsersCurrentPage}
                      />
                      <Table<AttachedUser>
                        columns={usersColumns}
                        data={paginatedUsers}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>

                  <TabPanel value="user-groups" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      <SearchInput
                        placeholder="Search user groups by attributes"
                        value={userGroupsSearchQuery}
                        onChange={(e) => setUserGroupsSearchQuery(e.target.value)}
                        className="w-[var(--search-input-width)]"
                      />
                      <Pagination
                        currentPage={userGroupsCurrentPage}
                        totalPages={userGroupsTotalPages}
                        totalItems={filteredUserGroups.length}
                        onPageChange={setUserGroupsCurrentPage}
                      />
                      <Table<AttachedUserGroup>
                        columns={userGroupsColumns}
                        data={paginatedUserGroups}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>

                  <TabPanel value="roles" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      <SearchInput
                        placeholder="Search roles by attributes"
                        value={rolesSearchQuery}
                        onChange={(e) => setRolesSearchQuery(e.target.value)}
                        className="w-[var(--search-input-width)]"
                      />
                      <Pagination
                        currentPage={rolesCurrentPage}
                        totalPages={rolesTotalPages}
                        totalItems={filteredRoles.length}
                        onPageChange={setRolesCurrentPage}
                      />
                      <Table<AttachedRole>
                        columns={rolesColumns}
                        data={paginatedRoles}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>

                  <TabPanel value="service-accounts" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      <SearchInput
                        placeholder="Search service accounts by attributes"
                        value={serviceAccountsSearchQuery}
                        onChange={(e) => setServiceAccountsSearchQuery(e.target.value)}
                        className="w-[var(--search-input-width)]"
                      />
                      <Pagination
                        currentPage={serviceAccountsCurrentPage}
                        totalPages={serviceAccountsTotalPages}
                        totalItems={filteredServiceAccounts.length}
                        onPageChange={setServiceAccountsCurrentPage}
                      />
                      <Table<AttachedServiceAccount>
                        columns={serviceAccountsColumns}
                        data={paginatedServiceAccounts}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>
                </Tabs>
              </VStack>
            </TabPanel>

            {/* Version History Tab */}
            <TabPanel value="version-history" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <div className="h-7 flex items-center">
                  <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Version history
                  </h2>
                </div>

                {/* Version History Table */}
                <Table<PolicyVersion>
                  columns={[
                    {
                      key: 'isActive',
                      label: 'Active',
                      width: '70px',
                      align: 'center',
                      render: (_value: boolean, version: PolicyVersion) =>
                        version.isActive ? (
                          <Badge variant="success" size="sm">
                            Active
                          </Badge>
                        ) : null,
                    },
                    {
                      key: 'version',
                      label: 'Version',
                      flex: 1,
                      sortable: true,
                      render: (_value: number, version: PolicyVersion) => (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVersionExpansion(version.id);
                            }}
                            className="p-0.5 hover:bg-[var(--color-surface-subtle)] rounded"
                          >
                            {expandedVersions.has(version.id) ? (
                              <IconChevronDown size={12} strokeWidth={2} />
                            ) : (
                              <IconChevronRight size={12} strokeWidth={2} />
                            )}
                          </button>
                          <span className="font-medium">Version {version.version}</span>
                        </div>
                      ),
                    },
                    { key: 'conditions', label: 'Conditions', flex: 1, sortable: true },
                    { key: 'editedBy', label: 'Edited by', flex: 1, sortable: true },
                    { key: 'editedAt', label: 'Edited at', flex: 1, sortable: true },
                    {
                      key: 'action',
                      label: 'Action',
                      width: fixedColumns.actions,
                      align: 'center',
                      render: (_value: unknown, version: PolicyVersion) => (
                        <ContextMenu
                          items={getVersionContextMenuItems(version)}
                          trigger="click"
                          align="right"
                        >
                          <button
                            aria-label="Row actions"
                            type="button"
                            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
                          >
                            <IconDotsCircleHorizontal
                              size={16}
                              stroke={1.5}
                              className="text-[var(--color-text-default)]"
                            />
                          </button>
                        </ContextMenu>
                      ),
                    },
                  ]}
                  data={mockVersionHistory}
                  rowKey="id"
                  onRowClick={(version) => toggleVersionExpansion(version.id)}
                  expandedContent={(version) =>
                    expandedVersions.has(version.id) ? (
                      <VersionDetails permissions={version.permissions} />
                    ) : null
                  }
                />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete policy"
        description="Removing this policy is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          setIsDeleteOpen(false);
          navigate('/iam/policies');
        }}
      />
    </PageShell>
  );
}
