import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Pagination,
  VStack,
  TopBar,
  Breadcrumb,
  ContextMenu,
  TabBar,
  Chip,
  Checkbox,
  ListToolbar,
  PageShell,
  PageHeader,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconDownload, IconChevronDown, IconChevronRight, IconTrash } from '@tabler/icons-react';
import { IconAction } from '@/design-system';
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
    roles: 'member (+2)',
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
    editedAt: 'Aug 15, 2025',
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
    editedAt: 'Aug 10, 2025',
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
    editedAt: 'Jul 20, 2025',
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
    editedAt: 'Jul 15, 2025',
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
    editedAt: 'Jun 30, 2025',
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
    editedAt: 'Jun 25, 2025',
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
    editedAt: 'Jun 20, 2025',
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
    editedAt: 'Jun 15, 2025',
    permissions: [
      { application: 'Logging', partition: '*all', resource: 'Log', actions: ['Read', 'List'] },
      { application: 'Logging', partition: '*all', resource: 'Metric', actions: ['Read', 'List'] },
    ],
  },
];

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
                <Chip key={i} value={action} />
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set(['p-002']));
  const itemsPerPage = 10;

  useEffect(() => {
    updateActiveTabLabel('Policies');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter policies by search query
  const filteredPolicies = mockPolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.apps.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.roles.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Toggle row selection
  const toggleRowSelection = (policyId: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(policyId)) {
        return prev.filter((id) => id !== policyId);
      }
      return [...prev, policyId];
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

  // Breadcrumb items
  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Policies' }];

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
              <SearchInput
                placeholder="Search policies by attributes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[var(--search-input-width)]"
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
              <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled>
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

        {/* Table */}
        <div className="w-full flex flex-col gap-1">
          {/* Table Header */}
          <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
            {/* Checkbox column */}
            <div className="w-[40px] flex items-center justify-center px-3 py-2">
              <Checkbox
                checked={
                  selectedRows.length > 0 && selectedRows.length === paginatedPolicies.length
                }
                indeterminate={
                  selectedRows.length > 0 && selectedRows.length < paginatedPolicies.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(paginatedPolicies.map((p) => p.id));
                  } else {
                    setSelectedRows([]);
                  }
                }}
              />
            </div>
            <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
              Name
            </div>
            <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
              Type
            </div>
            <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
              Apps
            </div>
            <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
              Roles
            </div>
            <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
              Description
            </div>
            <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
              Edited at
            </div>
            <div className="w-[64px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
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
              <div
                className={`flex items-stretch min-h-[var(--table-row-height)] hover:bg-[var(--table-row-hover-bg)] transition-colors`}
              >
                {/* Checkbox */}
                <div className="w-[40px] flex items-center justify-center px-3 py-2">
                  <Checkbox
                    checked={selectedRows.includes(policy.id)}
                    onChange={() => toggleRowSelection(policy.id)}
                  />
                </div>
                {/* Name with expand icon */}
                <div className="flex-1 flex items-center gap-2 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
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
                    to={`/iam/policies/${policy.id}`}
                    className="text-[var(--color-action-primary)] font-medium hover:underline"
                  >
                    {policy.name}
                  </Link>
                </div>
                {/* Type */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                  {policy.type}
                </div>
                {/* Apps */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                  {policy.apps}
                </div>
                {/* Roles */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                  {policy.roles}
                </div>
                {/* Description */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                  {policy.description}
                </div>
                {/* Edited at */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                  {policy.editedAt}
                </div>
                {/* Action */}
                <div className="w-[64px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]">
                  <ContextMenu
                    items={getContextMenuItems(policy.id, policy.type === 'Built-in')}
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
    </PageShell>
  );
}
