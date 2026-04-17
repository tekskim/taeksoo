import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
  IconAlertCircle,
  IconArrowBackUp,
} from '@tabler/icons-react';
import {
  Button,
  Pagination,
  Table,
  SearchInput,
  TopBar,
  Breadcrumb,
  VStack,
  BadgeList,
  HStack,
  Tooltip,
  ContextMenu,
  TabBar,
  ListToolbar,
  PageShell,
  PageHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Modal,
  InlineMessage,
  InfoBox,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { GrantAccessDrawer } from '@/components/GrantAccessDrawer';
import { RolePoliciesDrawer } from '@/components/RolePoliciesDrawer';
import { EditRoleDrawer } from '@/components/EditRoleDrawer';
import { InlineCopyId } from '@/components/InlineCopyId';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Type Definitions
   ---------------------------------------- */
interface Role {
  id: string;
  name: string;
  roleType: 'Built-in' | 'Custom';
  linkedPolicies: string[];
  policies: string;
  description: string;
  scope: string;
  createdAt: string;
}

interface ActiveGrant {
  id: string;
  roleName: string;
  roleId: string;
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
const mockRoles: Role[] = [
  {
    id: 'role-001',
    name: 'admin',
    roleType: 'Built-in',
    linkedPolicies: ['FullAccess', 'ReadCompute', 'WriteCompute'],
    policies: 'FullAccess',
    description: 'Full administrative access',
    scope: 'Global',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
  {
    id: 'role-002',
    name: 'compute-admin',
    roleType: 'Built-in',
    linkedPolicies: ['ReadCompute', 'WriteCompute', 'ManageCompute', 'ViewNetwork'],
    policies: 'ReadCompute (+3)',
    description: '-',
    scope: '-',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'role-003',
    name: 'network-viewer',
    roleType: 'Built-in',
    linkedPolicies: ['ViewNetwork', 'ReadCompute'],
    policies: 'ViewNetwork (+1)',
    description: 'Read-only network access',
    scope: 'Project',
    createdAt: 'Jul 15, 2025 12:22:26',
  },
  {
    id: 'role-004',
    name: 'storage-manager',
    roleType: 'Custom',
    linkedPolicies: ['ManageStorage', 'ReadStorage', 'ViewBilling'],
    policies: 'ManageStorage (+2)',
    description: 'Storage management role',
    scope: 'Project',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
  {
    id: 'role-005',
    name: 'developer',
    roleType: 'Custom',
    linkedPolicies: ['DeveloperAccess'],
    policies: 'DeveloperAccess',
    description: 'Developer access role',
    scope: 'Project',
    createdAt: 'Sep 1, 2025 10:20:28',
  },
  {
    id: 'role-006',
    name: 'qa-tester',
    roleType: 'Custom',
    linkedPolicies: ['QAAccess', 'ReadCompute'],
    policies: 'QAAccess (+1)',
    description: 'QA tester access',
    scope: 'Project',
    createdAt: 'Sep 5, 2025 14:12:36',
  },
  {
    id: 'role-007',
    name: 'security-admin',
    roleType: 'Built-in',
    linkedPolicies: ['SecurityFullAccess'],
    policies: 'SecurityFullAccess',
    description: 'Security administration',
    scope: 'Global',
    createdAt: 'Jun 15, 2025 12:22:26',
  },
  {
    id: 'role-008',
    name: 'billing-viewer',
    roleType: 'Built-in',
    linkedPolicies: ['ViewBilling'],
    policies: 'ViewBilling',
    description: 'View billing information',
    scope: 'Organization',
    createdAt: 'Jul 1, 2025 10:20:28',
  },
  {
    id: 'role-009',
    name: 'support-agent',
    roleType: 'Custom',
    linkedPolicies: ['SupportAccess', 'ReadCompute', 'ViewNetwork'],
    policies: 'SupportAccess (+2)',
    description: 'Customer support access',
    scope: 'Global',
    createdAt: 'Aug 10, 2025 01:17:01',
  },
  {
    id: 'role-010',
    name: 'read-only',
    roleType: 'Built-in',
    linkedPolicies: ['ReadAll'],
    policies: 'ReadAll',
    description: 'Read-only access to all',
    scope: 'Project',
    createdAt: 'Jun 20, 2025 23:27:51',
  },
];

const mockActiveGrants: ActiveGrant[] = [
  {
    id: 'grant-001',
    roleName: 'admin',
    roleId: '12345678',
    principalName: 'account id',
    principalId: '12345678',
    starts: 'Mar 15, 2026 09:00:00 (UTC+N)',
    ends: 'Apr 20, 2026 09:00:00 (UTC+N)',
    expiringSoon: true,
    reason: 'Incident response',
  },
  {
    id: 'grant-002',
    roleName: 'compute-admin',
    roleId: '23456789',
    principalName: 'account id',
    principalId: '23456789',
    starts: 'Feb 01, 2026 10:30:00 (UTC+N)',
    ends: 'May 01, 2026 10:30:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-003',
    roleName: 'network-viewer',
    roleId: '34567890',
    principalName: 'account id',
    principalId: '34567890',
    starts: 'Jan 10, 2026 14:00:00 (UTC+N)',
    ends: 'Jul 10, 2026 14:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-004',
    roleName: 'storage-manager',
    roleId: '45678901',
    principalName: 'account id',
    principalId: '45678901',
    starts: 'Mar 01, 2026 08:00:00 (UTC+N)',
    ends: 'Jun 01, 2026 08:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-005',
    roleName: 'developer',
    roleId: '56789012',
    principalName: 'account id',
    principalId: '56789012',
    starts: 'Feb 20, 2026 12:00:00 (UTC+N)',
    ends: 'Aug 20, 2026 12:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-006',
    roleName: 'qa-tester',
    roleId: '67890123',
    principalName: 'account id',
    principalId: '67890123',
    starts: 'Mar 05, 2026 16:00:00 (UTC+N)',
    ends: 'Sep 05, 2026 16:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-007',
    roleName: 'security-admin',
    roleId: '78901234',
    principalName: 'account id',
    principalId: '78901234',
    starts: 'Jan 15, 2026 11:00:00 (UTC+N)',
    ends: 'Apr 15, 2026 11:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-008',
    roleName: 'billing-viewer',
    roleId: '89012345',
    principalName: 'account id',
    principalId: '89012345',
    starts: 'Feb 10, 2026 09:30:00 (UTC+N)',
    ends: 'May 10, 2026 09:30:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-009',
    roleName: 'support-agent',
    roleId: '90123456',
    principalName: 'account id',
    principalId: '90123456',
    starts: 'Mar 20, 2026 14:00:00 (UTC+N)',
    ends: 'Jun 20, 2026 14:00:00 (UTC+N)',
    reason: 'Incident response',
  },
  {
    id: 'grant-010',
    roleName: 'read-only',
    roleId: '01234567',
    principalName: 'account id',
    principalId: '01234567',
    starts: 'Jan 01, 2026 08:00:00 (UTC+N)',
    ends: 'Apr 01, 2026 08:00:00 (UTC+N)',
    reason: 'Incident response',
  },
];

/* ----------------------------------------
   IAM Roles Page
   ---------------------------------------- */
export default function IAMRolesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedGrants, setSelectedGrants] = useState<string[]>([]);
  const [grantSearch, setGrantSearch] = useState('');
  const [grantPage, setGrantPage] = useState(1);
  const [revokeTarget, setRevokeTarget] = useState<ActiveGrant | null>(null);
  const [bulkRevokeOpen, setBulkRevokeOpen] = useState(false);
  const [isGrantDrawerOpen, setIsGrantDrawerOpen] = useState(false);
  const [grantTargetRole, setGrantTargetRole] = useState<string | null>(null);
  const [isManageLinkedPoliciesOpen, setIsManageLinkedPoliciesOpen] = useState(false);
  const [manageLinkedPoliciesRole, setManageLinkedPoliciesRole] = useState<string | null>(null);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [editRoleData, setEditRoleData] = useState<{ name: string; description: string } | null>(
    null
  );
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const itemsPerPage = 10;

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Roles');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter roles by search query
  const filteredRoles = mockRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.policies.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Context menu items factory
  const getContextMenuItems = (rowId: string): ContextMenuItem[] => [
    {
      id: 'grant-access',
      label: 'Grant access',
      onClick: () => {
        const role = mockRoles.find((r) => r.id === rowId);
        if (role) {
          setGrantTargetRole(role.name);
          setIsGrantDrawerOpen(true);
        }
      },
    },
    {
      id: 'manage-linked-policies',
      label: 'Manage linked policies',
      onClick: () => {
        const role = mockRoles.find((r) => r.id === rowId);
        if (role) {
          setManageLinkedPoliciesRole(role.name);
          setIsManageLinkedPoliciesOpen(true);
        }
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      onClick: () => {
        const role = mockRoles.find((r) => r.id === rowId);
        if (role) {
          setEditRoleData({ name: role.name, description: role.description });
          setIsEditRoleOpen(true);
        }
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete', rowId),
    },
  ];

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Role>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value, row) => (
        <VStack gap={0.5} align="start">
          <Link
            to={`/iam/roles/${value}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline"
          >
            {value}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.id}>
              ID : {row.id.slice(0, 8)}
            </span>
            <InlineCopyId value={row.id} />
          </span>
        </VStack>
      ),
    },
    {
      key: 'linkedPolicies',
      label: 'Linked policies',
      flex: 1,
      minWidth: columnMinWidths.typeLg,
      render: (_value: unknown, row: Role) => (
        <BadgeList
          items={row.linkedPolicies}
          maxVisible={1}
          popoverTitle={`All Linked Policies (${row.linkedPolicies.length})`}
          overflowAlign="right"
        />
      ),
    },
    {
      key: 'policies',
      label: 'Active grants',
      flex: 1,
      minWidth: columnMinWidths.policies,
      sortable: true,
      render: () => '-',
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu items={getContextMenuItems(row.id)} trigger="click" align="right">
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

  // Active grants columns
  const grantColumns: TableColumn<ActiveGrant>[] = useMemo(
    () => [
      {
        key: 'roleName',
        label: 'Role',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <Link
              to={`/iam/roles/${row.roleName}`}
              className="text-[var(--color-action-primary)] font-medium hover:underline"
            >
              {row.roleName}
            </Link>
            <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
              <span className="truncate" title={row.roleId}>
                ID:{row.roleId}
              </span>
              <InlineCopyId value={row.roleId} />
            </span>
          </VStack>
        ),
      },
      {
        key: 'principalName',
        label: 'Principal',
        flex: 1,
        minWidth: 140,
        sortable: true,
        render: (_value, row) => (
          <VStack gap={0.5} align="start">
            <Link to="#" className="text-[var(--color-action-primary)] font-medium hover:underline">
              {row.principalName}
            </Link>
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
        flex: 1.5,
        minWidth: 280,
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
        minWidth: 120,
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
              {
                id: 'extend',
                label: 'Extend',
                onClick: () => console.log('Extend', row.id),
              },
              {
                id: 'revoke',
                label: 'Revoke',
                status: 'danger',
                onClick: () => setRevokeTarget(row),
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
    ],
    []
  );

  // Filtered active grants
  const filteredGrants = mockActiveGrants.filter(
    (grant) =>
      grant.roleName.toLowerCase().includes(grantSearch.toLowerCase()) ||
      grant.principalName.toLowerCase().includes(grantSearch.toLowerCase()) ||
      grant.reason.toLowerCase().includes(grantSearch.toLowerCase())
  );
  const grantTotalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const paginatedGrants = filteredGrants.slice(
    (grantPage - 1) * itemsPerPage,
    grantPage * itemsPerPage
  );

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
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={<Breadcrumb items={[{ label: 'Roles' }]} />}
          />
        }
        contentClassName="pt-4 px-8 pb-6"
      >
        <VStack gap={3}>
          {/* Header */}
          <PageHeader
            title="Roles"
            actions={
              <Button variant="primary" size="md" onClick={() => navigate('/iam/roles/create')}>
                {activeTab === 'active-grants' ? 'Create role template' : 'Create role'}
              </Button>
            }
          />

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="roles">Roles</Tab>
              <Tab value="active-grants">Active grants</Tab>
            </TabList>

            <TabPanel value="roles" className="pt-0">
              <VStack gap={3} className="w-full pt-3">
                {/* Action Bar */}
                <ListToolbar
                  primaryActions={
                    <ListToolbar.Actions>
                      <SearchInput
                        placeholder="Search roles by attributes"
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
                  onPageChange={setCurrentPage}
                  showSettings
                  totalItems={filteredRoles.length}
                  selectedCount={selectedRows.length}
                />

                {/* Table */}
                <Table<Role>
                  columns={columns}
                  data={paginatedRoles}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedRows}
                  onSelectionChange={setSelectedRows}
                  emptyMessage="No roles found"
                />
              </VStack>
            </TabPanel>

            <TabPanel value="active-grants" className="pt-0">
              <VStack gap={3} className="w-full pt-3">
                <ListToolbar
                  primaryActions={
                    <ListToolbar.Actions>
                      <SearchInput
                        placeholder="Search active grants by attributes"
                        value={grantSearch}
                        onChange={(e) => setGrantSearch(e.target.value)}
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
                      <Button
                        variant="muted"
                        size="sm"
                        leftIcon={<IconArrowBackUp size={12} />}
                        disabled={selectedGrants.length === 0}
                        onClick={() => setBulkRevokeOpen(true)}
                      >
                        Revoke
                      </Button>
                    </ListToolbar.Actions>
                  }
                />
                <Pagination
                  currentPage={grantPage}
                  totalPages={grantTotalPages}
                  onPageChange={setGrantPage}
                  showSettings
                  totalItems={filteredGrants.length}
                  selectedCount={selectedGrants.length}
                />
                <Table<ActiveGrant>
                  columns={grantColumns}
                  data={paginatedGrants}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedGrants}
                  onSelectionChange={setSelectedGrants}
                  emptyMessage="No active grants found"
                />
              </VStack>
            </TabPanel>
          </Tabs>
        </VStack>
      </PageShell>

      {/* Revoke Access Modal */}
      <Modal
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        title="Revoke access"
        size="sm"
      >
        <VStack gap={2} className="w-full">
          <InfoBox label="Principal" value={revokeTarget?.principalName ?? ''} />
          <InfoBox label="Role" value={revokeTarget?.roleName ?? ''} />
          <InfoBox label="Scheduled end" value={revokeTarget?.ends ?? ''} />
        </VStack>

        <InlineMessage variant="error">
          Temporary access is revoked immediately, regardless of the scheduled end time.
        </InlineMessage>

        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setRevokeTarget(null)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log('Revoked', revokeTarget?.id);
              setRevokeTarget(null);
            }}
            className="flex-1"
          >
            Revoke
          </Button>
        </div>
      </Modal>

      {/* Bulk Revoke Access Modal */}
      <GrantAccessDrawer
        isOpen={isGrantDrawerOpen}
        onClose={() => {
          setIsGrantDrawerOpen(false);
          setGrantTargetRole(null);
        }}
        roleName={grantTargetRole ?? ''}
      />

      <RolePoliciesDrawer
        isOpen={isManageLinkedPoliciesOpen}
        onClose={() => {
          setIsManageLinkedPoliciesOpen(false);
          setManageLinkedPoliciesRole(null);
        }}
        roleName={manageLinkedPoliciesRole ?? ''}
        title="Manage linked policies"
        description="Add or remove policies linked to this role."
        onSubmit={(data) => {
          console.log('Manage linked policies:', data);
        }}
      />

      <EditRoleDrawer
        isOpen={isEditRoleOpen}
        onClose={() => {
          setIsEditRoleOpen(false);
          setEditRoleData(null);
        }}
        initialData={editRoleData ?? { name: '', description: '' }}
        onSubmit={(data) => {
          console.log('Edit role:', data);
        }}
      />

      <Modal
        isOpen={bulkRevokeOpen}
        onClose={() => setBulkRevokeOpen(false)}
        title="Revoke access"
        size="sm"
      >
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3 w-full flex flex-col gap-1.5 max-h-24 overflow-y-auto">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Grants</span>
          <ul className="list-disc pl-[18px] text-body-md text-[var(--color-text-default)]">
            {mockActiveGrants
              .filter((g) => selectedGrants.includes(g.id))
              .map((g) => (
                <li key={g.id}>
                  {g.principalName} / {g.roleName} / {g.ends}
                </li>
              ))}
          </ul>
        </div>

        <InlineMessage variant="error">
          Temporary access is revoked immediately, regardless of the scheduled end time.
        </InlineMessage>

        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setBulkRevokeOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log('Bulk revoked', selectedGrants);
              setSelectedGrants([]);
              setBulkRevokeOpen(false);
            }}
            className="flex-1"
          >
            Revoke
          </Button>
        </div>
      </Modal>
    </>
  );
}
