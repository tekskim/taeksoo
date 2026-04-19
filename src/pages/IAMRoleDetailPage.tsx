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
  BadgeList,
  Tooltip,
  ListToolbar,
  PageShell,
  DetailHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { GrantAccessDrawer } from '@/components/GrantAccessDrawer';
import { RolePoliciesDrawer } from '@/components/RolePoliciesDrawer';
import { InlineCopyId } from '@/components/InlineCopyId';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconSelector,
  IconSettings,
  IconLockCheck,
  IconDotsCircleHorizontal,
  IconAlertCircle,
  IconArrowBackUp,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface RoleDetail {
  id: string;
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

interface ActiveGrant {
  id: string;
  principalName: string;
  principalId: string;
  starts: string;
  ends: string;
  expiringSoon?: boolean;
  reason: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockRolesMap: Record<string, RoleDetail> = {
  admin: {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'admin',
    description: 'Full administrative access',
    type: 'Built-in',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
  Member: {
    id: 'a3b1c9d8e7f64520b1a2d3e4f5061728',
    name: 'Member',
    description: 'member role',
    type: 'Custom',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  viewer: {
    id: 'b4c2d0e9f8a75631c2b3e4f5a6172839',
    name: 'viewer',
    description: 'Read-only access',
    type: 'Built-in',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
  'compute-admin': {
    id: 'c5d3e1f0a9b86742d3c4f5a6b728394a',
    name: 'compute-admin',
    description: 'Compute administration access',
    type: 'Built-in',
    createdAt: 'Jun 15, 2025 12:22:26',
  },
  'storage-admin': {
    id: 'd6e4f2a1b0c97853e4d5a6b7c8394a5b',
    name: 'storage-admin',
    description: 'Storage administration access',
    type: 'Built-in',
    createdAt: 'Jun 20, 2025 23:27:51',
  },
  'network-admin': {
    id: 'e7f5a3b2c1d08964f5e6b7c8d9405a6c',
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

const mockActiveGrants: ActiveGrant[] = [
  {
    id: 'grant-001',
    principalName: 'account id',
    principalId: '12345678',
    starts: 'Mar 15, 2026 09:00:00 (UTC+N)',
    ends: 'Apr 20, 2026 09:00:00 (UTC+N)',
    expiringSoon: true,
    reason: 'Incident response',
  },
  {
    id: 'grant-002',
    principalName: 'account id',
    principalId: '23456789',
    starts: 'Feb 01, 2026 10:30:00 (UTC+N)',
    ends: 'May 01, 2026 10:30:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-003',
    principalName: 'account id',
    principalId: '34567890',
    starts: 'Jan 10, 2026 14:00:00 (UTC+N)',
    ends: 'Jul 10, 2026 14:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-004',
    principalName: 'account id',
    principalId: '45678901',
    starts: 'Mar 01, 2026 08:00:00 (UTC+N)',
    ends: 'Jun 01, 2026 08:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-005',
    principalName: 'account id',
    principalId: '56789012',
    starts: 'Feb 20, 2026 12:00:00 (UTC+N)',
    ends: 'Aug 20, 2026 12:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-006',
    principalName: 'account id',
    principalId: '67890123',
    starts: 'Mar 05, 2026 16:00:00 (UTC+N)',
    ends: 'Sep 05, 2026 16:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-007',
    principalName: 'account id',
    principalId: '78901234',
    starts: 'Jan 15, 2026 11:00:00 (UTC+N)',
    ends: 'Apr 15, 2026 11:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-008',
    principalName: 'account id',
    principalId: '89012345',
    starts: 'Feb 10, 2026 09:30:00 (UTC+N)',
    ends: 'May 10, 2026 09:30:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-009',
    principalName: 'account id',
    principalId: '90123456',
    starts: 'Mar 20, 2026 14:00:00 (UTC+N)',
    ends: 'Jun 20, 2026 14:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-010',
    principalName: 'account id',
    principalId: '01234567',
    starts: 'Jan 01, 2026 08:00:00 (UTC+N)',
    ends: 'Apr 01, 2026 08:00:00 (UTC+N)',
    reason: 'Incident response',
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
  const [grantsSearchQuery, setGrantsSearchQuery] = useState('');
  const [policiesCurrentPage, setPoliciesCurrentPage] = useState(1);
  const [grantsCurrentPage, setGrantsCurrentPage] = useState(1);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set(['p-002']));
  const [selectedGrants, setSelectedGrants] = useState<string[]>([]);
  const [isGrantDrawerOpen, setIsGrantDrawerOpen] = useState(false);
  const [isManageLinkedPoliciesOpen, setIsManageLinkedPoliciesOpen] = useState(false);
  const [policySortKey, setPolicySortKey] = useState<keyof RolePolicy | null>(null);
  const [policySortDir, setPolicySortDir] = useState<'asc' | 'desc' | null>(null);
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

  // Filter active grants by search query
  const filteredGrants = mockActiveGrants.filter(
    (grant) =>
      grant.principalName.toLowerCase().includes(grantsSearchQuery.toLowerCase()) ||
      grant.reason.toLowerCase().includes(grantsSearchQuery.toLowerCase())
  );

  const handlePolicySort = (key: keyof RolePolicy) => {
    if (policySortKey === key) {
      if (policySortDir === 'asc') setPolicySortDir('desc');
      else {
        setPolicySortKey(null);
        setPolicySortDir(null);
      }
    } else {
      setPolicySortKey(key);
      setPolicySortDir('asc');
    }
  };

  const sortedPolicies = (() => {
    if (!policySortKey || !policySortDir) return filteredPolicies;
    return [...filteredPolicies].sort((a, b) => {
      const aVal = a[policySortKey];
      const bVal = b[policySortKey];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : 1;
      return policySortDir === 'asc' ? cmp : -cmp;
    });
  })();

  // Pagination
  const policiesTotalPages = Math.ceil(sortedPolicies.length / itemsPerPage);
  const paginatedPolicies = sortedPolicies.slice(
    (policiesCurrentPage - 1) * itemsPerPage,
    policiesCurrentPage * itemsPerPage
  );

  const grantsTotalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const paginatedGrants = filteredGrants.slice(
    (grantsCurrentPage - 1) * itemsPerPage,
    grantsCurrentPage * itemsPerPage
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
            to={`/iam/policies/${row.id}`}
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
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu
          items={getPolicyContextMenuItems(row.id, row.type === 'Built-in')}
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
  ];

  // Table columns for active grants
  const grantColumns: TableColumn<ActiveGrant>[] = [
    {
      key: 'principalName',
      label: 'Principal',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_value, row) => (
        <VStack gap={0.5} align="start">
          <span className="text-[var(--color-action-primary)] font-medium">
            {row.principalName}
          </span>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.principalId}>
              ID:{row.principalId}
            </span>
            <InlineCopyId value={row.principalId} />
          </span>
        </VStack>
      ),
    },
    {
      key: 'starts',
      label: 'Starts',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'ends',
      label: 'Ends',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (_value, row) => (
        <HStack gap={1.5} align="center" className="flex-nowrap">
          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
            {row.ends}
          </span>
          {row.expiringSoon && (
            <Tooltip content="Expiring soon">
              <IconAlertCircle size={14} className="shrink-0 text-[var(--color-state-warning)]" />
            </Tooltip>
          )}
        </HStack>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center' as const,
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu
          items={[
            { id: 'extend', label: 'Extend', onClick: () => console.log('Extend', row.id) },
            {
              id: 'revoke',
              label: 'Revoke',
              status: 'danger',
              onClick: () => console.log('Revoke', row.id),
            },
          ]}
          trigger="click"
          align="right"
        >
          <button
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
    <>
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
          <DetailHeader>
            <DetailHeader.Title>{role.name}</DetailHeader.Title>
            <DetailHeader.Actions>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconLockCheck size={12} stroke={1.5} />}
                onClick={() => setIsGrantDrawerOpen(true)}
              >
                Grant access
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconSettings size={12} stroke={1.5} />}
                onClick={() => setIsManageLinkedPoliciesOpen(true)}
              >
                Manage linked policies
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} stroke={1.5} />}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
                Delete
              </Button>
            </DetailHeader.Actions>
            <DetailHeader.InfoGrid>
              <DetailHeader.InfoCard label="ID" value={role.id} copyable />
              <DetailHeader.InfoCard label="Description" value={role.description} />
              <DetailHeader.InfoCard label="Created at" value={role.createdAt} />
            </DetailHeader.InfoGrid>
          </DetailHeader>

          {/* Tabs */}
          <div className="w-full">
            <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
              <TabList>
                <Tab value="policies">Attached policies</Tab>
                <Tab value="entities">Active grants</Tab>
              </TabList>

              {/* Policies Tab */}
              <TabPanel value="policies" className="pt-0">
                <VStack gap={4} className="pt-4">
                  {/* Section Header */}
                  <HStack justify="between" align="center" className="w-full">
                    <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                      Attached policies
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
                      <div
                        className="flex-1 flex items-center gap-1 px-3 py-2 text-label-sm text-[var(--color-text-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors"
                        onClick={() => handlePolicySort('name')}
                      >
                        <span>Name</span>
                        {policySortKey === 'name' ? (
                          policySortDir === 'asc' ? (
                            <IconChevronUp
                              size={14}
                              stroke={1}
                              className="text-[var(--color-action-primary)]"
                            />
                          ) : (
                            <IconChevronDown
                              size={14}
                              stroke={1}
                              className="text-[var(--color-action-primary)]"
                            />
                          )
                        ) : (
                          <IconSelector
                            size={14}
                            stroke={1}
                            className="text-[var(--color-text-subtle)]"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex items-center px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                        Type
                      </div>
                      <div className="flex-1 flex items-center px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                        Apps
                      </div>
                      <div
                        className="flex-1 flex items-center gap-1 px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors"
                        onClick={() => handlePolicySort('description')}
                      >
                        <span>Description</span>
                        {policySortKey === 'description' ? (
                          policySortDir === 'asc' ? (
                            <IconChevronUp
                              size={14}
                              stroke={1}
                              className="text-[var(--color-action-primary)]"
                            />
                          ) : (
                            <IconChevronDown
                              size={14}
                              stroke={1}
                              className="text-[var(--color-action-primary)]"
                            />
                          )
                        ) : (
                          <IconSelector
                            size={14}
                            stroke={1}
                            className="text-[var(--color-text-subtle)]"
                          />
                        )}
                      </div>
                      <div
                        className="flex-1 flex items-center gap-1 px-3 py-2 text-label-sm text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors"
                        onClick={() => handlePolicySort('editedAt')}
                      >
                        <span>Edited at</span>
                        {policySortKey === 'editedAt' ? (
                          policySortDir === 'asc' ? (
                            <IconChevronUp
                              size={14}
                              stroke={1}
                              className="text-[var(--color-action-primary)]"
                            />
                          ) : (
                            <IconChevronDown
                              size={14}
                              stroke={1}
                              className="text-[var(--color-action-primary)]"
                            />
                          )
                        ) : (
                          <IconSelector
                            size={14}
                            stroke={1}
                            className="text-[var(--color-text-subtle)]"
                          />
                        )}
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
                              to={`/iam/policies/${policy.id}`}
                              className="text-[var(--color-action-primary)] font-medium hover:underline"
                            >
                              {policy.name}
                            </Link>
                          </div>
                          <div className="flex-1 flex items-center px-3 py-2 text-body-md text-[var(--color-text-default)] border-l border-transparent">
                            <Badge theme="white" size="sm">
                              {policy.type}
                            </Badge>
                          </div>
                          <div className="flex-1 flex items-center px-3 py-2 text-body-md text-[var(--color-text-default)] border-l border-transparent">
                            <BadgeList
                              items={
                                policy.permissions
                                  ? [
                                      ...new Set(
                                        policy.permissions.map((p) =>
                                          p.partition !== '-'
                                            ? `${p.application}:${p.partition}`
                                            : p.application
                                        )
                                      ),
                                    ]
                                  : [policy.apps]
                              }
                              maxVisible={1}
                              maxBadgeWidth="140px"
                              popoverTitle={`All Apps (${policy.permissions ? new Set(policy.permissions.map((p) => (p.partition !== '-' ? `${p.application}:${p.partition}` : p.application))).size : 1})`}
                              overflowAlign="right"
                            />
                          </div>
                          <div className="flex-1 flex items-center px-3 py-2 text-body-md text-[var(--color-text-default)] border-l border-transparent">
                            {policy.description}
                          </div>
                          <div className="flex-1 flex items-center px-3 py-2 text-body-md text-[var(--color-text-default)] border-l border-transparent">
                            {policy.editedAt}
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

              {/* Active Grants Tab */}
              <TabPanel value="entities" className="pt-0">
                <VStack gap={3} className="w-full pt-3">
                  <HStack justify="between" align="center" className="w-full">
                    <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                      Active grants
                    </h2>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconLockCheck size={12} />}
                      onClick={() => setIsGrantDrawerOpen(true)}
                    >
                      Grant access
                    </Button>
                  </HStack>

                  <ListToolbar
                    primaryActions={
                      <ListToolbar.Actions>
                        <SearchInput
                          placeholder="Search roles by attributes"
                          value={grantsSearchQuery}
                          onChange={(e) => setGrantsSearchQuery(e.target.value)}
                          className="w-[var(--search-input-width)]"
                        />
                      </ListToolbar.Actions>
                    }
                    bulkActions={
                      <ListToolbar.Actions>
                        <Button
                          variant="muted"
                          size="sm"
                          leftIcon={<IconArrowBackUp size={12} />}
                          disabled={selectedGrants.length === 0}
                        >
                          Revoke
                        </Button>
                      </ListToolbar.Actions>
                    }
                  />

                  <Pagination
                    currentPage={grantsCurrentPage}
                    totalPages={grantsTotalPages}
                    totalItems={filteredGrants.length}
                    onPageChange={setGrantsCurrentPage}
                    selectedCount={selectedGrants.length}
                  />

                  <Table<ActiveGrant>
                    columns={grantColumns}
                    data={paginatedGrants}
                    rowKey="id"
                    selectable
                    selectedKeys={selectedGrants}
                    onSelectionChange={setSelectedGrants}
                  />
                </VStack>
              </TabPanel>
            </Tabs>
          </div>
        </VStack>
      </PageShell>

      <GrantAccessDrawer
        isOpen={isGrantDrawerOpen}
        onClose={() => setIsGrantDrawerOpen(false)}
        roleName={role.name}
      />

      <RolePoliciesDrawer
        isOpen={isManageLinkedPoliciesOpen}
        onClose={() => setIsManageLinkedPoliciesOpen(false)}
        roleName={role.name}
        title="Manage linked policies"
        description="Add or remove policies linked to this role."
        onSubmit={(data) => {
          console.log('Manage linked policies:', data);
        }}
      />
    </>
  );
}
