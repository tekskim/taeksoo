import { useState, useEffect, useCallback } from 'react';
import {
  Badge,
  BadgeList,
  Button,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  DetailHeader,
  SectionCard,
  SearchInput,
  Pagination,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  InlineMessage,
  ContextMenu,
  StatusIndicator,
  fixedColumns,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { CreateAPIKeyDrawer } from '@/components/CreateAPIKeyDrawer';
import { EditAPIKeyDrawer } from '@/components/EditAPIKeyDrawer';
import { RolePoliciesDrawer } from '@/components/RolePoliciesDrawer';
import { InlineCopyId } from '@/components/InlineCopyId';
import { useTabs } from '@/contexts/TabContext';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconEdit,
  IconTrash,
  IconRefresh,
  IconCirclePlus,
  IconDotsCircleHorizontal,
  IconSettings,
  IconChevronRight,
  IconChevronDown,
  IconExternalLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface APIKey {
  id: string;
  keyId: string;
  status: 'active' | 'expired' | 'revoked';
  description: string;
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockServiceAccount = {
  name: 'ci-pipeline-bot',
  status: 'active' as const,
  clientId: '1231451566662335',
  description: '-',
  createdAt: 'Jan 10, 2026 10:00:00 (UTC+9)',
  clientSecretLastIssued: 'Jan 8, 2025 10:00:00 (UTC+9)',
};

const mockAPIKeys: APIKey[] = [
  {
    id: 'key-001',
    keyId: '1234567812345678',
    status: 'active',
    description: '-',
    createdAt: '2025-09-12 12:33:15',
    expiresAt: '2025-09-12 12:33:15',
    lastUsed: '2025-09-12 12:33:15',
  },
  {
    id: 'key-002',
    keyId: '9876543298765432',
    status: 'active',
    description: '-',
    createdAt: '2025-09-12 12:33:15',
    expiresAt: '2025-09-12 12:33:15',
    lastUsed: '2025-09-12 12:33:15',
  },
];

/* ----------------------------------------
   Attached Policies Types & Data
   ---------------------------------------- */

interface PolicyPermission {
  application: string;
  partition: string;
  resource: string;
  actions: string[];
}

interface PolicyItem {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  apps: string;
  description: string;
  editedAt: string;
  permissions?: PolicyPermission[];
}

const defaultPermissions: PolicyPermission[] = [
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
];

const mockPolicies: PolicyItem[] = Array.from({ length: 16 }, (_, i) => ({
  id: `policy-${i + 1}`,
  name: 'policy',
  type: 'Built-in',
  apps: 'Compute:tenantA',
  description: '-',
  editedAt: 'Sep 12, 2025',
  permissions: defaultPermissions,
}));

const POLICIES_PER_PAGE = 10;

function buildPolicyColumns(
  expandedIds: Set<string>,
  onToggleExpand: (id: string) => void
): TableColumn<PolicyItem>[] {
  return [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: 140,
      sortable: true,
      render: (_, row) => (
        <span className="flex items-center gap-1">
          <button
            type="button"
            className="shrink-0 p-0 border-0 bg-transparent cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(row.id);
            }}
            aria-label={expandedIds.has(row.id) ? 'Collapse' : 'Expand'}
          >
            {expandedIds.has(row.id) ? (
              <IconChevronDown size={14} stroke={2} />
            ) : (
              <IconChevronRight size={14} stroke={2} />
            )}
          </button>
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.name}
          </span>
          <IconExternalLink
            size={12}
            stroke={1.5}
            className="shrink-0 text-[var(--color-action-primary)]"
          />
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      width: 100,
      render: (_, row) => (
        <Badge theme="white" size="sm">
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'apps',
      label: 'Apps',
      flex: 1,
      minWidth: 160,
      render: (_, row) => {
        const items = row.permissions
          ? [
              ...new Set(
                row.permissions.map((p) =>
                  p.partition !== '-' ? `${p.application}:${p.partition}` : p.application
                )
              ),
            ]
          : [row.apps];
        return (
          <BadgeList
            items={items}
            maxVisible={1}
            popoverTitle={`All Apps (${items.length})`}
            overflowAlign="right"
          />
        );
      },
    },
    { key: 'description', label: 'Description', flex: 1, minWidth: 120, sortable: true },
    { key: 'editedAt', label: 'Edited at', flex: 1, minWidth: 120, sortable: true },
  ];
}

interface PermissionRow extends PolicyPermission {
  _index: number;
}

const permissionColumns: TableColumn<PermissionRow>[] = [
  { key: '_index' as keyof PermissionRow, label: '#', width: 40 },
  { key: 'application', label: 'Application', flex: 1 },
  { key: 'partition', label: 'Partition', flex: 1 },
  { key: 'resource', label: 'Resource', flex: 1 },
  {
    key: 'actions' as keyof PermissionRow,
    label: 'Action',
    flex: 1.5,
    render: (_, row) => (
      <BadgeList
        items={row.actions}
        maxVisible={1}
        popoverTitle={`All Actions (${row.actions.length})`}
        overflowAlign="right"
      />
    ),
  },
];

function PermissionSubTable({ permissions }: { permissions: PolicyPermission[] }) {
  const data: PermissionRow[] = permissions.map((p, i) => ({ ...p, _index: i + 1 }));
  return (
    <div className="w-full px-4 py-3">
      <Table<PermissionRow> columns={permissionColumns} data={data} rowKey="_index" />
    </div>
  );
}

/* ----------------------------------------
   IAM Service Account Detail Page
   ---------------------------------------- */

export function IAMServiceAccountDetailPage() {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('credentials');
  const [policySearch, setPolicySearch] = useState('');
  const [policyPage, setPolicyPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isCreateAPIKeyOpen, setIsCreateAPIKeyOpen] = useState(false);
  const [editingAPIKey, setEditingAPIKey] = useState<APIKey | null>(null);
  const [isManagePoliciesOpen, setIsManagePoliciesOpen] = useState(false);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const policyColumns = buildPolicyColumns(expandedIds, handleToggleExpand);

  const filteredPolicies = mockPolicies.filter(
    (p) =>
      p.name.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.type.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.apps.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.description.toLowerCase().includes(policySearch.toLowerCase())
  );
  const policyTotalPages = Math.ceil(filteredPolicies.length / POLICIES_PER_PAGE);
  const paginatedPolicies = filteredPolicies.slice(
    (policyPage - 1) * POLICIES_PER_PAGE,
    policyPage * POLICIES_PER_PAGE
  );

  useEffect(() => {
    updateActiveTabLabel(name || 'Service account');
  }, [name, updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const getApiKeyMenuItems = (row: APIKey): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => setEditingAPIKey(row) },
    { id: 'reset', label: 'Reset', onClick: () => console.log('Reset', row.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger' as const,
      divider: true,
      onClick: () => console.log('Delete', row.id),
    },
  ];

  const apiKeyColumns: TableColumn<APIKey>[] = [
    {
      key: 'status',
      label: 'Status',
      width: 64,
      align: 'center',
      render: (_value, row) => (
        <StatusIndicator layout="icon-only" status={row.status === 'active' ? 'active' : 'muted'} />
      ),
    },
    {
      key: 'keyId',
      label: 'Key ID',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span className="flex items-center gap-1.5">
          <span>{value}</span>
          <InlineCopyId value={value} />
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
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
      key: 'expiresAt',
      label: 'Expires at',
      flex: 1,
      sortable: true,
    },
    {
      key: 'lastUsed',
      label: 'Last used',
      flex: 1,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu items={getApiKeyMenuItems(row)} trigger="click" align="right">
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
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'IAM', href: '/iam' },
                { label: 'Service accounts', href: '/iam/service-accounts' },
                { label: name || '' },
              ]}
            />
          }
        />
      }
    >
      <VStack gap={4}>
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>{name}</DetailHeader.Title>

          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconSettings size={12} />}
              onClick={() => setIsManagePoliciesOpen(true)}
            >
              Manage policies
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Status" value="Active" status="active" />
            <DetailHeader.InfoCard label="Client ID" value={mockServiceAccount.clientId} copyable />
            <DetailHeader.InfoCard label="Description" value={mockServiceAccount.description} />
            <DetailHeader.InfoCard label="Created at" value={mockServiceAccount.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="credentials">Credentials</Tab>
            <Tab value="attached-policies">Attached policies</Tab>
          </TabList>

          <TabPanel value="credentials" className="pt-0">
            <VStack gap={4} className="pt-4">
              {/* Client Secret Section */}
              <SectionCard>
                <SectionCard.Header
                  title="Client secret"
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
                      Regenerate secret
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Last issued at"
                    value={mockServiceAccount.clientSecretLastIssued}
                  />
                  <InlineMessage variant="info">
                    The client secret is not stored or shown here. If you no longer have it,
                    regenerate to issue a new secret.
                  </InlineMessage>
                </SectionCard.Content>
              </SectionCard>

              {/* API Keys Section */}
              <SectionCard>
                <SectionCard.Header
                  title={`API keys (${mockAPIKeys.length}/10)`}
                  actions={
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconCirclePlus size={12} />}
                      onClick={() => setIsCreateAPIKeyOpen(true)}
                    >
                      Create API key
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <Table<APIKey> columns={apiKeyColumns} data={mockAPIKeys} rowKey="id" />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          <TabPanel value="attached-policies" className="pt-0">
            <VStack gap={3} className="pt-4">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                  Attached policies
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconSettings size={12} />}
                  onClick={() => setIsManagePoliciesOpen(true)}
                >
                  Manage policies
                </Button>
              </div>
              <div className="w-[280px]">
                <SearchInput
                  value={policySearch}
                  onChange={(e) => {
                    setPolicySearch(e.target.value);
                    setPolicyPage(1);
                  }}
                  onClear={() => {
                    setPolicySearch('');
                    setPolicyPage(1);
                  }}
                  placeholder="Search policies by attributes"
                  size="sm"
                  fullWidth
                />
              </div>
              <Pagination
                currentPage={policyPage}
                totalPages={policyTotalPages}
                totalItems={filteredPolicies.length}
                onPageChange={setPolicyPage}
              />
              <Table<PolicyItem>
                columns={policyColumns}
                data={paginatedPolicies}
                rowKey="id"
                emptyMessage="No policies found"
                expandedContent={(row) =>
                  expandedIds.has(row.id) && row.permissions?.length ? (
                    <PermissionSubTable permissions={row.permissions} />
                  ) : null
                }
              />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      <CreateAPIKeyDrawer
        isOpen={isCreateAPIKeyOpen}
        onClose={() => setIsCreateAPIKeyOpen(false)}
      />

      <EditAPIKeyDrawer
        isOpen={!!editingAPIKey}
        onClose={() => setEditingAPIKey(null)}
        keyId={editingAPIKey?.keyId ?? ''}
        initialDescription={editingAPIKey?.description ?? ''}
        initialActive={editingAPIKey?.status === 'active'}
      />

      <RolePoliciesDrawer
        isOpen={isManagePoliciesOpen}
        onClose={() => setIsManagePoliciesOpen(false)}
        title="Manage linked policies"
        infoLabel="Service account"
        roleName={name ?? ''}
      />
    </PageShell>
  );
}

export default IAMServiceAccountDetailPage;
