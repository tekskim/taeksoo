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
  TabBar,
  Chip,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IconAction } from '@/design-system/components/Icons';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
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
  type: 'Built-in' | 'Custom';
  userGroupCount: number;
  policies: string;
  createdAt: string;
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
    editedAt: '2025-07-25 09:12:20',
    createdAt: '2025-07-25 09:12:20',
  },
  'p-002': {
    id: 'p-002',
    name: 'policy',
    description: 'Full access policy for compute resources',
    type: 'Built-in',
    condition: 'MFA Required',
    editedAt: '2025-08-15 14:30:00',
    createdAt: '2025-06-01 09:00:00',
  },
  'p-003': {
    id: 'p-003',
    name: 'ComputeFullAccess',
    description: 'Full access to compute resources',
    type: 'Built-in',
    condition: '-',
    editedAt: '2025-08-15 10:00:00',
    createdAt: '2025-06-01 09:00:00',
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
    type: 'Built-in',
    userGroupCount: 5,
    policies: 'FullAccess (+2)',
    createdAt: '2025-06-01',
  },
  {
    id: 'role-002',
    name: 'compute-admin',
    type: 'Built-in',
    userGroupCount: 3,
    policies: 'ComputeAccess',
    createdAt: '2025-06-15',
  },
  {
    id: 'role-003',
    name: 'viewer',
    type: 'Built-in',
    userGroupCount: 8,
    policies: 'ReadOnly (+1)',
    createdAt: '2025-07-01',
  },
  {
    id: 'role-004',
    name: 'network-admin',
    type: 'Custom',
    userGroupCount: 4,
    policies: 'NetworkAccess (+1)',
    createdAt: '2025-08-10',
  },
];

const mockVersionHistory: PolicyVersion[] = [
  {
    id: 'v-005',
    version: 5,
    isActive: true,
    conditions: 'MFA',
    editedBy: 'thaki-kim',
    editedAt: '2025-09-12',
    statements: [
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
    ],
  },
  {
    id: 'v-004',
    version: 4,
    isActive: false,
    conditions: '-',
    editedBy: 'alex-jones',
    editedAt: '2025-09-11',
    statements: [
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
    ],
  },
  {
    id: 'v-003',
    version: 3,
    isActive: false,
    conditions: 'IP Range',
    editedBy: 'sarah-lee',
    editedAt: '2025-09-05',
    statements: [
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
    ],
  },
  {
    id: 'v-002',
    version: 2,
    isActive: false,
    conditions: '-',
    editedBy: 'thaki-kim',
    editedAt: '2025-08-20',
    statements: [
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
    ],
  },
  {
    id: 'v-001',
    version: 1,
    isActive: false,
    conditions: '-',
    editedBy: 'thaki-kim',
    editedAt: '2025-07-25',
    statements: [
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
      '{app}:{partition}:{resource}:{resourceId}:{actionclass}:{action}',
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
    <div className="basis-0 grow bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
        {label}
      </span>
      <span className="text-[12px] text-[var(--color-text-default)]">
        {value}
      </span>
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
  statements: string[];
}

function VersionDetails({ statements }: VersionDetailsProps) {
  return (
    <div className="border-t border-[var(--color-border-subtle)] p-4 bg-[var(--color-surface-default)]">
      <div className="flex flex-col gap-[var(--table-row-gap)]">
        {/* Table Header */}
        <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
          <div className="w-10 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center">
            #
          </div>
          <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center border-l border-[var(--color-border-default)]">
            Statement
          </div>
        </div>

        {/* Table Rows */}
        {statements.map((statement, index) => (
          <div
            key={index}
            className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] hover:bg-[var(--table-row-hover-bg)] transition-colors"
          >
            <div className="w-10 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-muted)] flex items-center">
              {index + 1}
            </div>
            <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] flex items-center">
              {statement}
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('permissions');
  
  // Permissions tab state
  const [permSearchQuery, setPermSearchQuery] = useState('');
  const [permCurrentPage, setPermCurrentPage] = useState(1);
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(new Set(['perm-002']));
  
  // Roles tab state
  const [rolesSearchQuery, setRolesSearchQuery] = useState('');
  const [rolesCurrentPage, setRolesCurrentPage] = useState(1);

  // Version history tab state
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['v-004']));

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
  const filteredPermissions = mockPermissions.filter(perm =>
    perm.app.toLowerCase().includes(permSearchQuery.toLowerCase()) ||
    perm.partition.toLowerCase().includes(permSearchQuery.toLowerCase()) ||
    perm.resource.toLowerCase().includes(permSearchQuery.toLowerCase())
  );

  const permTotalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice(
    (permCurrentPage - 1) * itemsPerPage,
    permCurrentPage * itemsPerPage
  );

  // Filter attached roles
  const filteredRoles = mockAttachedRoles.filter(role =>
    role.name.toLowerCase().includes(rolesSearchQuery.toLowerCase())
  );

  const rolesTotalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (rolesCurrentPage - 1) * itemsPerPage,
    rolesCurrentPage * itemsPerPage
  );

  // Toggle permission expansion
  const togglePermissionExpansion = (permId: string) => {
    setExpandedPermissions(prev => {
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
    setExpandedVersions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  // More Actions menu items
  const moreActionsItems: ContextMenuItem[] = [
    { id: 'manage-roles', label: 'Manage roles', onClick: () => console.log('Manage roles') },
    { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate') },
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'IAM', href: '/iam' },
    { label: 'Policies', href: '/iam/policies' },
    { label: policy?.name || policyId || '' },
  ];

  // Roles table columns
  const rolesColumns: TableColumn<AttachedRole>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/roles/${value}`}
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
    },
    {
      key: 'policies',
      label: 'Policies',
      flex: 1,
    },
    {
      key: 'userGroupCount',
      label: 'User group count',
      flex: 1,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: 80,
      align: 'center',
      render: (_, row) => {
        const isBuiltIn = row.type === 'Built-in';
        const menuItems: ContextMenuItem[] = [
          {
            id: 'detach',
            label: 'Detach',
            status: isBuiltIn ? undefined : 'danger',
            disabled: isBuiltIn,
            onClick: () => console.log('Detach role', row.id),
          },
        ];
        return (
          <ContextMenu items={menuItems} trigger="click">
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
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
      <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
        <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main
          className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
          style={{ left: `${sidebarWidth}px` }}
        >
          <TabBar
            tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
          />
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            showNavigation
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={<Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'Policies', href: '/iam/policies' }]} />}
          />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--color-text-muted)]">Policy not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        <TabBar
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={8}>
              {/* Header Card */}
              <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
                <VStack gap={3}>
                  {/* Title */}
                  <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                    {policy.name}
                  </h1>

                  {/* Action Buttons */}
                  <HStack gap={1}>
                    <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                      Delete
                    </Button>
                    <ContextMenu items={moreActionsItems} trigger="click">
                      <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                        More Actions
                      </Button>
                    </ContextMenu>
                  </HStack>

                  {/* Info Cards */}
                  <HStack gap={2} className="w-full">
                    <InfoCard label="Description" value={policy.description} />
                    <InfoCard label="Type" value={policy.type} />
                    <InfoCard label="Condition" value={policy.condition} />
                    <InfoCard label="Edited at" value={policy.editedAt} />
                    <InfoCard label="Created at" value={policy.createdAt} />
                  </HStack>
                </VStack>
              </div>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="permissions">Permissions</Tab>
                    <Tab value="roles">Roles</Tab>
                    <Tab value="version-history">Version history</Tab>
                  </TabList>

                  {/* Permissions Tab */}
                  <TabPanel value="permissions">
                    <VStack gap={3} className="pt-6">
                      {/* Section Header */}
                      <HStack justify="between" align="center" className="w-full">
                        <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                          Permissions
                        </h2>
                        <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                          Edit
                        </Button>
                      </HStack>

                      {/* Search */}
                      <SearchInput
                        placeholder="Search permissions by attributes"
                        value={permSearchQuery}
                        onChange={(e) => setPermSearchQuery(e.target.value)}
                        className="w-[280px]"
                      />

                      {/* Pagination */}
                      <Pagination
                        currentPage={permCurrentPage}
                        totalPages={permTotalPages}
                        totalItems={filteredPermissions.length}
                        onPageChange={setPermCurrentPage}
                      />

                      {/* Permissions Table */}
                      <div className="w-full flex flex-col gap-1">
                        {/* Table Header */}
                        <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                          <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                            App
                            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                          </div>
                          <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                            Partition
                            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                          </div>
                          <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                            Resource
                            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                          </div>
                          <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                            Action class
                            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                          </div>
                        </div>

                        {/* Table Rows */}
                        {paginatedPermissions.map((perm) => (
                          <div
                            key={perm.id}
                            className={`
                              rounded-[var(--table-row-radius)]
                              border border-[var(--color-border-default)] bg-[var(--color-surface-default)]
                              transition-colors overflow-hidden
                            `}
                          >
                            {/* Main Row */}
                            <div
                              className={`
                                flex items-stretch min-h-[var(--table-row-height)]
                                ${expandedPermissions.has(perm.id) ? 'rounded-t-md' : 'rounded-md'}
                                hover:bg-[var(--table-row-hover-bg)] transition-colors
                              `}
                            >
                              {/* App */}
                              <div className="flex-1 flex items-center gap-2 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                                <button
                                  onClick={() => togglePermissionExpansion(perm.id)}
                                  className="p-0.5 hover:bg-[var(--color-surface-subtle)] rounded"
                                >
                                  {expandedPermissions.has(perm.id) ? (
                                    <IconChevronDown size={12} stroke={1.5} />
                                  ) : (
                                    <IconChevronRight size={12} stroke={1.5} />
                                  )}
                                </button>
                                {perm.app}
                              </div>
                              {/* Partition */}
                              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                                {perm.partition}
                              </div>
                              {/* Resource */}
                              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                                {perm.resource}
                              </div>
                              {/* Action Class */}
                              <div className="flex-1 flex items-center gap-1 flex-wrap px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                                {perm.actionClass.map((action, i) => (
                                  <Chip key={i} value={action} />
                                ))}
                              </div>
                            </div>

                            {/* Expanded Permission Details */}
                            {expandedPermissions.has(perm.id) && (
                              <PermissionDetails actions={perm.actions || []} />
                            )}
                          </div>
                        ))}
                      </div>
                    </VStack>
                  </TabPanel>

                  {/* Roles Tab */}
                  <TabPanel value="roles">
                    <VStack gap={3} className="pt-6">
                      {/* Section Header */}
                      <HStack justify="between" align="center" className="w-full">
                        <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                          Roles
                        </h2>
                        <Button variant="secondary" size="sm">
                          Manage roles
                        </Button>
                      </HStack>

                      {/* Search */}
                      <SearchInput
                        placeholder="Search roles by attributes"
                        value={rolesSearchQuery}
                        onChange={(e) => setRolesSearchQuery(e.target.value)}
                        className="w-[280px]"
                      />

                      {/* Pagination */}
                      <Pagination
                        currentPage={rolesCurrentPage}
                        totalPages={rolesTotalPages}
                        totalItems={filteredRoles.length}
                        onPageChange={setRolesCurrentPage}
                      />

                      {/* Roles Table */}
                      <Table<AttachedRole>
                        columns={rolesColumns}
                        data={paginatedRoles}
                        rowKey="id"
                      />
                    </VStack>
                  </TabPanel>

                  {/* Version History Tab */}
                  <TabPanel value="version-history">
                    <VStack gap={3} className="pt-6">
                      {/* Section Header */}
                      <div className="h-7 flex items-center">
                        <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                          Version history
                        </h2>
                      </div>

                      {/* Version History Table */}
                      <div className="w-full flex flex-col gap-1">
                        {/* Table Header */}
                        <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
                          <div className="w-[70px] flex items-center justify-center px-3 py-0 text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]">
                            Active
                          </div>
                          <div className="flex-1 flex items-center gap-1.5 px-3 py-0 text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors">
                            Version
                            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                          </div>
                          <div className="flex-1 flex items-center gap-1.5 px-3 py-0 text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors">
                            Conditions
                            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                          </div>
                          <div className="flex-1 flex items-center gap-1.5 px-3 py-0 text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors">
                            Edited by
                            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                          </div>
                          <div className="flex-1 flex items-center gap-1.5 px-3 py-0 text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors">
                            Edited at
                            <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                          </div>
                          <div className="w-[72px] flex items-center justify-center px-3 py-0 text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                            Action
                          </div>
                        </div>

                        {/* Table Rows */}
                        {mockVersionHistory.map((version) => (
                          <div
                            key={version.id}
                            className={`
                              rounded-[var(--table-row-radius)]
                              border border-[var(--color-border-default)] bg-[var(--color-surface-default)]
                              transition-colors overflow-hidden
                            `}
                          >
                            {/* Main Row */}
                            <div
                              className={`
                                flex items-stretch min-h-[var(--table-row-height)]
                                ${expandedVersions.has(version.id) ? 'rounded-t-md' : 'rounded-md'}
                                hover:bg-[var(--table-row-hover-bg)] transition-colors
                              `}
                            >
                              {/* Active Badge */}
                              <div className="w-[70px] flex items-center justify-center px-3 py-2">
                                {version.isActive && (
                                  <span className="px-1.5 py-0.5 bg-[var(--color-action-primary)] text-white text-[11px] font-medium rounded-md">
                                    Active
                                  </span>
                                )}
                              </div>
                              {/* Version */}
                              <div className="flex-1 flex items-center gap-2 px-3 py-2 text-[12px] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                                <button
                                  onClick={() => toggleVersionExpansion(version.id)}
                                  className="p-0.5 hover:bg-[var(--color-surface-subtle)] rounded"
                                >
                                  {expandedVersions.has(version.id) ? (
                                    <IconChevronDown size={12} stroke={1.5} />
                                  ) : (
                                    <IconChevronRight size={12} stroke={1.5} />
                                  )}
                                </button>
                                <span className="font-medium">Version {version.version}</span>
                              </div>
                              {/* Conditions */}
                              <div className="flex-1 flex items-center px-3 py-2 text-[12px] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                                {version.conditions}
                              </div>
                              {/* Edited by */}
                              <div className="flex-1 flex items-center px-3 py-2 text-[12px] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                                {version.editedBy}
                              </div>
                              {/* Edited at */}
                              <div className="flex-1 flex items-center px-3 py-2 text-[12px] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                                {version.editedAt}
                              </div>
                              {/* Action */}
                              <div className="w-[72px] flex items-center justify-center px-1.5 py-1.5">
                                <ContextMenu
                                  items={getVersionContextMenuItems(version)}
                                  trigger="click"
                                >
                                  <button
                                    type="button"
                                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
                                  >
                                    <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
                                  </button>
                                </ContextMenu>
                              </div>
                            </div>

                            {/* Expanded Version Details */}
                            {expandedVersions.has(version.id) && (
                              <VersionDetails statements={version.statements} />
                            )}
                          </div>
                        ))}
                      </div>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

