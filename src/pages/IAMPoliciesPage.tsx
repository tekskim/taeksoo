import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  FilterSearchInput,
  Pagination,
  VStack,
  TopBar,
  Breadcrumb,
  ContextMenu,
  TabBar,
  Badge,
  ListToolbar,
  PageShell,
  PageHeader,
  Table,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  type TableColumn,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconDownload,
  IconChevronDown,
  IconChevronRight,
  IconTrash,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PolicyPermission {
  application: string;
  partition: string;
  resource: string;
  actions: string[];
}

interface Policy {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  apps: string;
  roles: string;
  description: string;
  editedAt: string;
  permissions?: PolicyPermission[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPolicies: Policy[] = [
  {
    id: 'p-001',
    name: 'policy',
    type: 'Built-in',
    apps: 'compute (+3)',
    roles: 'member (+2)',
    description: '-',
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
    ],
  },
  {
    id: 'p-002',
    name: 'policy',
    type: 'Built-in',
    apps: 'compute (+3)',
    roles: 'member (+2)',
    description: '-',
    editedAt: 'Sep 12, 2026',
    permissions: [
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'AI_server',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Container',
        partition: '*all',
        resource: '*all',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'IAM',
        partition: '-',
        resource: '*all',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      { application: 'Storage', partition: '-', resource: 'block_01', actions: ['Read'] },
    ],
  },
  {
    id: 'p-003',
    name: 'ComputeFullAccess',
    type: 'Built-in',
    apps: 'compute',
    roles: 'admin',
    description: 'Full access to compute resources',
    editedAt: 'Aug 15, 2026',
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
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Compute',
        partition: '*all',
        resource: 'Image',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
    ],
  },
  {
    id: 'p-004',
    name: 'StorageReadOnly',
    type: 'Built-in',
    apps: 'storage',
    roles: 'viewer',
    description: 'Read-only access to storage',
    editedAt: 'Aug 10, 2026',
    permissions: [
      { application: 'Storage', partition: '*all', resource: 'Bucket', actions: ['Read', 'List'] },
      { application: 'Storage', partition: '*all', resource: 'Object', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'p-005',
    name: 'NetworkAdmin',
    type: 'Custom',
    apps: 'network',
    roles: 'network-admin',
    description: 'Network administration policy',
    editedAt: 'Jul 20, 2026',
    permissions: [
      {
        application: 'Network',
        partition: '*all',
        resource: 'VPC',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Network',
        partition: '*all',
        resource: 'Subnet',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
      {
        application: 'Network',
        partition: '*all',
        resource: 'Router',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
    ],
  },
  {
    id: 'p-006',
    name: 'ContainerDeploy',
    type: 'Custom',
    apps: 'container (+2)',
    roles: 'developer (+1)',
    description: 'Container deployment permissions',
    editedAt: 'Jul 15, 2026',
    permissions: [
      {
        application: 'Container',
        partition: 'tenantA',
        resource: 'Deployment',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'Container',
        partition: 'tenantA',
        resource: 'Service',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'Container',
        partition: 'tenantA',
        resource: 'Pod',
        actions: ['Read', 'List'],
      },
    ],
  },
  {
    id: 'p-007',
    name: 'IAMViewOnly',
    type: 'Built-in',
    apps: 'iam',
    roles: 'viewer',
    description: 'View-only IAM permissions',
    editedAt: 'Jun 30, 2026',
    permissions: [
      { application: 'IAM', partition: '-', resource: 'User', actions: ['Read', 'List'] },
      { application: 'IAM', partition: '-', resource: 'Role', actions: ['Read', 'List'] },
      { application: 'IAM', partition: '-', resource: 'Policy', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'p-008',
    name: 'SecurityAudit',
    type: 'Built-in',
    apps: 'security (+3)',
    roles: 'auditor',
    description: 'Security audit permissions',
    editedAt: 'Jun 25, 2026',
    permissions: [
      {
        application: 'Security',
        partition: '*all',
        resource: 'AuditLog',
        actions: ['Read', 'List'],
      },
      {
        application: 'Security',
        partition: '*all',
        resource: 'Compliance',
        actions: ['Read', 'List'],
      },
      { application: 'IAM', partition: '-', resource: 'Session', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'p-009',
    name: 'DatabaseAdmin',
    type: 'Custom',
    apps: 'database',
    roles: 'db-admin',
    description: 'Database administration policy',
    editedAt: 'Jun 20, 2026',
    permissions: [
      {
        application: 'Database',
        partition: '*all',
        resource: 'Instance',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Database',
        partition: '*all',
        resource: 'Backup',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
    ],
  },
  {
    id: 'p-010',
    name: 'LoggingAccess',
    type: 'Built-in',
    apps: 'logging',
    roles: 'support',
    description: 'Access to logging services',
    editedAt: 'Jun 15, 2026',
    permissions: [
      { application: 'Logging', partition: '*all', resource: 'Log', actions: ['Read', 'List'] },
      { application: 'Logging', partition: '*all', resource: 'Metric', actions: ['Read', 'List'] },
    ],
  },
];

const policyFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'Built-in', label: 'Built-in' },
      { value: 'Custom', label: 'Custom' },
    ],
  },
  { id: 'apps', label: 'Apps', type: 'text' },
  { id: 'roles', label: 'Roles', type: 'text' },
  { id: 'description', label: 'Description', type: 'text' },
];

/* ----------------------------------------
   Policy Details Component
   ---------------------------------------- */

interface PolicyDetailsProps {
  permissions: PolicyPermission[];
}

function PolicyDetails({ permissions }: PolicyDetailsProps) {
  return (
    <div className="p-4">
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

export default function IAMPoliciesPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    updateActiveTabLabel('Policies');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter policies
  const filteredPolicies = useMemo(() => {
    if (appliedFilters.length === 0) return mockPolicies;
    return mockPolicies.filter((policy) =>
      appliedFilters.every((f) => {
        if (f.fieldId === 'type') return policy.type === f.value;
        const val = policy[f.fieldId as keyof Policy];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(f.value.toLowerCase());
        }
        return true;
      })
    );
  }, [appliedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
  const getContextMenuItems = (rowId: string, isBuiltIn: boolean): ContextMenuItem[] => {
    if (isBuiltIn) {
      // Built-in policies: Edit and Delete disabled
      return [
        {
          id: 'manage-roles',
          label: 'Manage roles',
          onClick: () => console.log('Manage roles', rowId),
        },
        { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate', rowId) },
        { id: 'edit', label: 'Edit', disabled: true, onClick: () => console.log('Edit', rowId) },
        {
          id: 'delete',
          label: 'Delete',
          disabled: true,
          onClick: () => console.log('Delete', rowId),
        },
      ];
    }
    // Custom policies: all items enabled
    return [
      {
        id: 'manage-roles',
        label: 'Manage roles',
        onClick: () => console.log('Manage roles', rowId),
      },
      { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate', rowId) },
      { id: 'edit', label: 'Edit', onClick: () => console.log('Edit', rowId) },
      {
        id: 'delete',
        label: 'Delete',
        status: 'danger',
        onClick: () => console.log('Delete', rowId),
      },
    ];
  };

  const columns: TableColumn<Policy>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (_value: string, row: Policy) => (
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (row.permissions) togglePolicyExpansion(row.id);
            }}
            className={`shrink-0 flex items-center justify-center w-4 h-4 hover:bg-[var(--color-surface-subtle)] rounded ${!row.permissions ? 'invisible' : ''}`}
            aria-label={
              expandedPolicies.has(row.id) ? `Collapse ${row.name}` : `Expand ${row.name}`
            }
            aria-expanded={expandedPolicies.has(row.id)}
          >
            {expandedPolicies.has(row.id) ? (
              <IconChevronDown size={12} strokeWidth={2} />
            ) : (
              <IconChevronRight size={12} strokeWidth={2} />
            )}
          </button>
          <Link
            to={`/iam/policies/${row.id}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline truncate"
          >
            {row.name}
          </Link>
        </div>
      ),
    },
    { key: 'type', label: 'Type' },
    { key: 'apps', label: 'Apps' },
    { key: 'roles', label: 'Roles' },
    { key: 'description', label: 'Description' },
    { key: 'editedAt', label: 'Edited at' },
    {
      key: 'actions',
      label: 'Action',
      width: '64px',
      align: 'center',
      render: (_value: unknown, row: Policy) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu
            items={getContextMenuItems(row.id, row.type === 'Built-in')}
            trigger="click"
            align="right"
          >
            <button
              aria-label="Row actions"
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  // Breadcrumb items
  const breadcrumbItems = [{ label: 'Policies' }];

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
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader
          title="Policies"
          actions={
            <Button variant="primary" size="md" onClick={() => navigate('/iam/policies/create')}>
              Create policy
            </Button>
          }
        />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={policyFilterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search policies by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} />}
                aria-label="Download"
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} />}
                disabled={selectedRows.length === 0}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPolicies.length}
          selectedCount={selectedRows.length}
          showSettings
          onPageChange={setCurrentPage}
        />

        <Table<Policy>
          className="w-full"
          columns={columns}
          data={paginatedPolicies}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No policies found"
          loading={loading}
          expandedContent={(row) => {
            if (!expandedPolicies.has(row.id) || !row.permissions) return null;
            return <PolicyDetails permissions={row.permissions} />;
          }}
        />
      </VStack>
    </PageShell>
  );
}
