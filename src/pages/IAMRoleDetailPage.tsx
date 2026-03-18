import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ContextMenu,
  TabBar,
  Badge,
  PageShell,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconSettings,
} from '@tabler/icons-react';
import { IconAction } from '@/design-system';
import { Link } from 'react-router-dom';

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
}

interface AttachedUser {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  lastSignIn: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
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
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'AI_server',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Container',
        partition: 'clusterA',
        resource: 'All(*)',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'IAM',
        partition: '-',
        resource: 'All(*)',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
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
      {
        application: 'Network',
        partition: 'vpcA',
        resource: 'Subnet',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'Network',
        partition: 'vpcA',
        resource: 'SecurityGroup',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
      {
        application: 'Network',
        partition: '-',
        resource: 'LoadBalancer',
        actions: ['Read', 'List'],
      },
    ],
  },
];

const mockAttachedUserGroups: AttachedUserGroup[] = [
  {
    id: 'ug-001',
    name: 'dev-admin-group',
    type: 'Built-in',
    userCount: 130,
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'ug-002',
    name: 'ops-team',
    type: 'Custom',
    userCount: 45,
    createdAt: 'Aug 15, 2025 12:22:26',
  },
  {
    id: 'ug-003',
    name: 'security-group',
    type: 'Built-in',
    userCount: 22,
    createdAt: 'Jul 20, 2025 23:27:51',
  },
  {
    id: 'ug-004',
    name: 'data-analysts',
    type: 'Custom',
    userCount: 67,
    createdAt: 'Jun 10, 2025 01:17:01',
  },
];

const mockAttachedUsers: AttachedUser[] = [
  {
    id: 'u-001',
    name: 'thaki-kim',
    type: 'Built-in',
    lastSignIn: 'Dec 10, 2025',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'u-002',
    name: 'alex.johnson',
    type: 'Custom',
    lastSignIn: 'Dec 9, 2025',
    createdAt: 'Aug 15, 2025 12:22:26',
  },
  {
    id: 'u-003',
    name: 'maria.garcia',
    type: 'Built-in',
    lastSignIn: 'Dec 8, 2025',
    createdAt: 'Jul 20, 2025 23:27:51',
  },
  {
    id: 'u-004',
    name: 'john.doe',
    type: 'Custom',
    lastSignIn: 'Dec 7, 2025',
    createdAt: 'Jun 10, 2025 01:17:01',
  },
  {
    id: 'u-005',
    name: 'emma.wilson',
    type: 'Built-in',
    lastSignIn: 'Dec 5, 2025',
    createdAt: 'May 5, 2025 14:12:36',
  },
];

/* ----------------------------------------
   Info Card Component
   ---------------------------------------- */

interface InfoCardProps {
  label: string;
  value: string;
}

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="basis-0 grow bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 flex items-center justify-between min-w-0">
      <div className="flex flex-col gap-1.5">
        <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md leading-4 text-[var(--color-text-default)]">{value}</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Policy Details Component
   ---------------------------------------- */

interface PolicyDetailsProps {
  permissions: PolicyPermission[];
}

function PolicyDetails({ permissions }: PolicyDetailsProps) {
  return (
    <div className="border-t border-[var(--color-border-subtle)] p-4 bg-[var(--color-surface-default)]">
      <div className="flex flex-col gap-[var(--table-row-gap)]">
        {/* Table Header */}
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

        {/* Table Rows */}
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

export default function IAMRoleDetailPage() {
  const { roleName } = useParams<{ roleName: string }>();
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('policies');
  const [policiesSearchQuery, setPoliciesSearchQuery] = useState('');
  const [entitiesSearchQuery, setEntitiesSearchQuery] = useState('');
  const [policiesCurrentPage, setPoliciesCurrentPage] = useState(1);
  const [entitiesCurrentPage, setEntitiesCurrentPage] = useState(1);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set(['p-002']));
  const [entitiesSubTab, setEntitiesSubTab] = useState<'user-groups' | 'users'>('user-groups');
  const itemsPerPage = 10;

  // Get role data
  const role = roleName ? mockRolesMap[roleName] : null;

  useEffect(() => {
    updateActiveTabLabel(role?.name || 'Role details');
  }, [role?.name, updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter policies by search query
  const filteredPolicies = mockRolePolicies.filter((policy) =>
    policy.name.toLowerCase().includes(policiesSearchQuery.toLowerCase())
  );

  // Filter user groups by search query
  const filteredUserGroups = mockAttachedUserGroups.filter((group) =>
    group.name.toLowerCase().includes(entitiesSearchQuery.toLowerCase())
  );

  // Filter users by search query
  const filteredUsers = mockAttachedUsers.filter((user) =>
    user.name.toLowerCase().includes(entitiesSearchQuery.toLowerCase())
  );

  // Pagination
  const policiesTotalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (policiesCurrentPage - 1) * itemsPerPage,
    policiesCurrentPage * itemsPerPage
  );

  const userGroupsTotalPages = Math.ceil(filteredUserGroups.length / itemsPerPage);
  const paginatedUserGroups = filteredUserGroups.slice(
    (entitiesCurrentPage - 1) * itemsPerPage,
    entitiesCurrentPage * itemsPerPage
  );

  const usersTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (entitiesCurrentPage - 1) * itemsPerPage,
    entitiesCurrentPage * itemsPerPage
  );

  // Toggle policy expansion
  const togglePolicyExpansion = (policyId: string) => {
    setExpandedPolicies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(policyId)) {
        newSet.delete(policyId);
      } else {
        newSet.add(policyId);
      }
      return newSet;
    });
  };

  // Context menu items factory
  const getPolicyContextMenuItems = (rowId: string, isBuiltIn: boolean): ContextMenuItem[] => [
    {
      id: 'detach',
      label: 'Detach',
      status: isBuiltIn ? undefined : 'danger',
      disabled: isBuiltIn,
      onClick: () => console.log('Detach policy', rowId),
    },
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'IAM', href: '/iam' },
    { label: 'Roles', href: '/iam/roles' },
    { label: role?.name || 'Role details' },
  ];

  // Table columns for policies
  const policyColumns: TableColumn<RolePolicy>[] = [
    {
      key: 'name',
      label: 'Status',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePolicyExpansion(row.id);
            }}
            className="p-0.5 hover:bg-[var(--color-surface-subtle)] rounded"
          >
            {expandedPolicies.has(row.id) ? (
              <IconChevronDown size={16} stroke={1.5} />
            ) : (
              <IconChevronRight size={16} stroke={1.5} />
            )}
          </button>
          <Link
            to={`/iam/policies/${value}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline"
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.typeLg,
    },
    {
      key: 'apps',
      label: 'Apps',
      flex: 1,
      minWidth: columnMinWidths.apps,
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    {
      key: 'editedAt',
      label: 'Edited at',
      flex: 1,
      minWidth: columnMinWidths.editedAt,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu
          items={getPolicyContextMenuItems(row.id, row.type === 'Built-in')}
          trigger="click"
        >
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Table columns for user groups
  const userGroupColumns: TableColumn<AttachedUserGroup>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/user-groups/${value}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.typeLg,
    },
    {
      key: 'userCount',
      label: 'User count',
      flex: 1,
      minWidth: columnMinWidths.userCount,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
  ];

  // Table columns for users
  const userColumns: TableColumn<AttachedUser>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/users/${value}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'type',
      label: 'User groups',
      flex: 1,
      minWidth: columnMinWidths.userGroups,
    },
    {
      key: 'lastSignIn',
      label: 'Last sign-in',
      flex: 1,
      minWidth: columnMinWidths.lastSignIn,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
  ];

  if (!role) {
    return (
      <PageShell
        sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
        sidebarWidth={sidebarWidth}
        tabBar={null}
        topBar={null}
        contentClassName="flex items-center justify-center"
      >
        <p className="text-[var(--color-text-muted)]">Role not found</p>
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
        {/* Header Card */}
        <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Title */}
            <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
              {role.name}
            </h1>

            {/* Action Buttons */}
            <HStack gap={1}>
              <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} stroke={1.5} />}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
                Delete
              </Button>
              <ContextMenu
                items={[
                  {
                    id: 'manage-policies',
                    label: 'Manage policies',
                    onClick: () => console.log('Manage policies'),
                  },
                  { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate') },
                ]}
                trigger="click"
                align="right"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<IconChevronDown size={12} stroke={1.5} />}
                >
                  More actions
                </Button>
              </ContextMenu>
            </HStack>

            {/* Info Cards */}
            <HStack gap={2} className="w-full">
              <InfoCard label="Description" value={role.description} />
              <InfoCard label="Type" value={role.type} />
              <InfoCard label="Created at" value={role.createdAt} />
            </HStack>
          </VStack>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="policies">Policies</Tab>
              <Tab value="entities">Entities attached</Tab>
            </TabList>

            {/* Policies Tab */}
            <TabPanel value="policies" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <HStack justify="between" align="center" className="w-full">
                  <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Policies
                  </h2>
                  <Button variant="secondary" size="sm" leftIcon={<IconSettings size={12} />}>
                    Manage policies
                  </Button>
                </HStack>

                {/* Search */}
                <SearchInput
                  placeholder="Search policies by attributes"
                  value={policiesSearchQuery}
                  onChange={(e) => setPoliciesSearchQuery(e.target.value)}
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={policiesCurrentPage}
                  totalPages={policiesTotalPages}
                  totalItems={filteredPolicies.length}
                  onPageChange={setPoliciesCurrentPage}
                />

                {/* Policies Table with Expandable Rows */}
                <div className="w-full flex flex-col gap-1">
                  {/* Table Header */}
                  <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                    <div className="flex-1 flex items-center px-3 py-2 text-label-sm text-[var(--color-text-default)]">
                      Status
                    </div>
                    <div className="flex-1 flex items-center px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Type
                    </div>
                    <div className="flex-1 flex items-center px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Apps
                    </div>
                    <div className="flex-1 flex items-center px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Description
                    </div>
                    <div className="flex-1 flex items-center px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Edited at
                    </div>
                    <div className="w-[72px] flex items-center justify-center px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Action
                    </div>
                  </div>

                  {/* Table Rows */}
                  {paginatedPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="rounded-[var(--table-row-radius)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] transition-colors overflow-hidden"
                    >
                      {/* Main Row */}
                      <div className="flex items-center min-h-[var(--table-row-height)] hover:bg-[var(--table-row-hover-bg)] transition-colors">
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 text-body-md text-[var(--color-text-default)]">
                          <button
                            onClick={() => policy.permissions && togglePolicyExpansion(policy.id)}
                            className={`p-0.5 hover:bg-[var(--color-surface-subtle)] rounded ${!policy.permissions ? 'invisible' : ''}`}
                          >
                            {expandedPolicies.has(policy.id) ? (
                              <IconChevronDown size={16} stroke={1.5} />
                            ) : (
                              <IconChevronRight size={16} stroke={1.5} />
                            )}
                          </button>
                          <Link
                            to={`/iam/policies/${policy.name}`}
                            className="text-[var(--color-action-primary)] font-medium hover:underline"
                          >
                            {policy.name}
                          </Link>
                        </div>
                        <div className="flex-1 flex items-center px-3 py-2 text-body-md text-[var(--color-text-default)] border-l border-transparent">
                          {policy.type}
                        </div>
                        <div className="flex-1 flex items-center px-3 py-2 text-body-md text-[var(--color-text-default)] border-l border-transparent">
                          {policy.apps}
                        </div>
                        <div className="flex-1 flex items-center px-3 py-2 text-body-md text-[var(--color-text-default)] border-l border-transparent">
                          {policy.description}
                        </div>
                        <div className="flex-1 flex items-center px-3 py-2 text-body-md text-[var(--color-text-default)] border-l border-transparent">
                          {policy.editedAt}
                        </div>
                        <div className="w-[72px] flex items-center justify-center px-3 py-2 border-l border-transparent">
                          <ContextMenu
                            items={getPolicyContextMenuItems(policy.id, policy.type === 'Built-in')}
                            trigger="click"
                          >
                            <button
                              type="button"
                              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
                            >
                              <IconAction
                                size={16}
                                stroke={1}
                                className="text-[var(--color-text-default)]"
                              />
                            </button>
                          </ContextMenu>
                        </div>
                      </div>

                      {/* Expanded Policy Details */}
                      {expandedPolicies.has(policy.id) && policy.permissions && (
                        <PolicyDetails permissions={policy.permissions} />
                      )}
                    </div>
                  ))}
                </div>
              </VStack>
            </TabPanel>

            {/* Entities Attached Tab */}
            <TabPanel value="entities" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Entities attached
                </h2>

                {/* Sub Tab Container */}
                <Tabs
                  value={entitiesSubTab}
                  onChange={(val) => {
                    setEntitiesSubTab(val as 'user-groups' | 'users');
                    setEntitiesCurrentPage(1);
                    setEntitiesSearchQuery('');
                  }}
                  variant="boxed"
                  size="sm"
                >
                  <TabList>
                    <Tab value="user-groups">User groups</Tab>
                    <Tab value="users">Users</Tab>
                  </TabList>
                </Tabs>

                {/* Search */}
                <SearchInput
                  placeholder={
                    entitiesSubTab === 'user-groups'
                      ? 'Search user groups by attributes'
                      : 'Search users by attributes'
                  }
                  value={entitiesSearchQuery}
                  onChange={(e) => setEntitiesSearchQuery(e.target.value)}
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={entitiesCurrentPage}
                  totalPages={
                    entitiesSubTab === 'user-groups' ? userGroupsTotalPages : usersTotalPages
                  }
                  totalItems={
                    entitiesSubTab === 'user-groups'
                      ? filteredUserGroups.length
                      : filteredUsers.length
                  }
                  onPageChange={setEntitiesCurrentPage}
                />

                {/* Table */}
                {entitiesSubTab === 'user-groups' ? (
                  <Table<AttachedUserGroup>
                    columns={userGroupColumns}
                    data={paginatedUserGroups}
                    rowKey="id"
                  />
                ) : (
                  <Table<AttachedUser> columns={userColumns} data={paginatedUsers} rowKey="id" />
                )}
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}
