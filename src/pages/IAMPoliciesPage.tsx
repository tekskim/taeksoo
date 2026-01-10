import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Pagination,
  VStack,
  HStack,
  TopBar,
  Breadcrumb,
  ContextMenu,
  TabBar,
  Chip,
  Checkbox,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconDownload,
  IconChevronDown,
  IconChevronRight,
  IconTrash,
} from '@tabler/icons-react';
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
    editedAt: '2025-09-12',
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
    roles: 'member (+2)',
    description: '-',
    editedAt: '2025-09-12',
    permissions: [
      { application: 'Compute', partition: 'tenantA', resource: 'AI_server', actions: ['Read', 'List', 'Write', 'Delete', 'Admin'] },
      { application: 'Container', partition: '*all', resource: '*all', actions: ['Read', 'List', 'Write'] },
      { application: 'IAM', partition: '-', resource: '*all', actions: ['Read', 'List', 'Write', 'Delete', 'Admin'] },
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
    editedAt: '2025-08-15',
    permissions: [
      { application: 'Compute', partition: '*all', resource: 'Instance', actions: ['Read', 'List', 'Write', 'Delete', 'Admin'] },
      { application: 'Compute', partition: '*all', resource: 'Volume', actions: ['Read', 'List', 'Write', 'Delete', 'Admin'] },
      { application: 'Compute', partition: '*all', resource: 'Image', actions: ['Read', 'List', 'Write', 'Delete'] },
    ],
  },
  {
    id: 'p-004',
    name: 'StorageReadOnly',
    type: 'Built-in',
    apps: 'storage',
    roles: 'viewer',
    description: 'Read-only access to storage',
    editedAt: '2025-08-10',
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
    editedAt: '2025-07-20',
    permissions: [
      { application: 'Network', partition: '*all', resource: 'VPC', actions: ['Read', 'List', 'Write', 'Delete', 'Admin'] },
      { application: 'Network', partition: '*all', resource: 'Subnet', actions: ['Read', 'List', 'Write', 'Delete'] },
      { application: 'Network', partition: '*all', resource: 'Router', actions: ['Read', 'List', 'Write', 'Delete'] },
    ],
  },
  {
    id: 'p-006',
    name: 'ContainerDeploy',
    type: 'Custom',
    apps: 'container (+2)',
    roles: 'developer (+1)',
    description: 'Container deployment permissions',
    editedAt: '2025-07-15',
    permissions: [
      { application: 'Container', partition: 'tenantA', resource: 'Deployment', actions: ['Read', 'List', 'Write'] },
      { application: 'Container', partition: 'tenantA', resource: 'Service', actions: ['Read', 'List', 'Write'] },
      { application: 'Container', partition: 'tenantA', resource: 'Pod', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'p-007',
    name: 'IAMViewOnly',
    type: 'Built-in',
    apps: 'iam',
    roles: 'viewer',
    description: 'View-only IAM permissions',
    editedAt: '2025-06-30',
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
    editedAt: '2025-06-25',
    permissions: [
      { application: 'Security', partition: '*all', resource: 'AuditLog', actions: ['Read', 'List'] },
      { application: 'Security', partition: '*all', resource: 'Compliance', actions: ['Read', 'List'] },
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
    editedAt: '2025-06-20',
    permissions: [
      { application: 'Database', partition: '*all', resource: 'Instance', actions: ['Read', 'List', 'Write', 'Delete', 'Admin'] },
      { application: 'Database', partition: '*all', resource: 'Backup', actions: ['Read', 'List', 'Write', 'Delete'] },
    ],
  },
  {
    id: 'p-010',
    name: 'LoggingAccess',
    type: 'Built-in',
    apps: 'logging',
    roles: 'support',
    description: 'Access to logging services',
    editedAt: '2025-06-15',
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

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
  const filteredPolicies = mockPolicies.filter(policy =>
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
    setExpandedPolicies(prev => {
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
    setSelectedRows(prev => {
      if (prev.includes(policyId)) {
        return prev.filter(id => id !== policyId);
      }
      return [...prev, policyId];
    });
  };

  // Context menu items
  const contextMenuItems: ContextMenuItem[] = [
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'delete', label: 'Delete', danger: true },
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'IAM', href: '/iam' },
    { label: 'Policies' },
  ];

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
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full">
                <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                  Policies
                </h1>
                <Button variant="primary" size="sm">
                  Create policy
                </Button>
              </HStack>

              {/* Action Bar */}
              <VStack gap={3} className="w-full">
                <HStack gap={2} className="items-center">
                  {/* Search */}
                  <HStack gap={1} align="center">
                    <SearchInput
                      placeholder="Search policies by attributes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[280px]"
                    />

                    {/* Download Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconDownload size={12} />}
                      aria-label="Download"
                    />
                  </HStack>

                  {/* Divider */}
                  <div className="flex items-center">
                    <div className="w-px h-4 bg-[var(--color-border-default)]" />
                  </div>

                  {/* Actions */}
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />} disabled>
                    Delete
                  </Button>
                </HStack>

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
                        checked={selectedRows.length > 0 && selectedRows.length === paginatedPolicies.length}
                        indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedPolicies.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(paginatedPolicies.map(p => p.id));
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
                    <div className="w-[72px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
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
                      <div className={`flex items-stretch min-h-[var(--table-row-height)] hover:bg-[var(--table-row-hover-bg)] transition-colors`}>
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
                              <IconChevronDown size={12} stroke={1.5} />
                            ) : (
                              <IconChevronRight size={12} stroke={1.5} />
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
                        <div className="w-[72px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]">
                          <ContextMenu items={contextMenuItems} onSelect={(itemId) => console.log(itemId, policy.id)}>
                            <button
                              type="button"
                              className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
                            >
                              <IconAction size={16} stroke={1} />
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
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

