import { useState, useEffect, useMemo } from 'react';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  ContextMenu,
  PageShell,
  PageHeader,
  ListToolbar,
  StatusIndicator,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { CreateServiceAccountDrawer } from '@/components/CreateServiceAccountDrawer';
import { RolePoliciesDrawer } from '@/components/RolePoliciesDrawer';
import { EditServiceAccountDrawer } from '@/components/EditServiceAccountDrawer';
import { useTabs } from '@/contexts/TabContext';
import { IconDownload, IconTrash, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type AccountStatus = 'active' | 'inactive';

interface ServiceAccount {
  id: string;
  name: string;
  status: AccountStatus;
  apiKeysUsed: number;
  apiKeysMax: number;
  description: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockServiceAccounts: ServiceAccount[] = [
  {
    id: 'sa-001',
    name: 'ci-pipeline-bot',
    status: 'active',
    apiKeysUsed: 2,
    apiKeysMax: 10,
    description: 'CI/CD pipeline automation',
    createdAt: 'Jan 10, 2026',
  },
  {
    id: 'sa-002',
    name: 'monitoring-agent',
    status: 'active',
    apiKeysUsed: 1,
    apiKeysMax: 10,
    description: 'Monitoring and alerting service',
    createdAt: 'Feb 5, 2026',
  },
  {
    id: 'sa-003',
    name: 'backup-service',
    status: 'active',
    apiKeysUsed: 0,
    apiKeysMax: 10,
    description: '-',
    createdAt: 'Dec 20, 2026',
  },
  {
    id: 'sa-004',
    name: 'terraform-deployer',
    status: 'inactive',
    apiKeysUsed: 3,
    apiKeysMax: 10,
    description: 'Infrastructure provisioning',
    createdAt: 'Nov 15, 2026',
  },
  {
    id: 'sa-005',
    name: 'log-collector',
    status: 'active',
    apiKeysUsed: 0,
    apiKeysMax: 10,
    description: 'Centralized log collection',
    createdAt: 'Mar 8, 2026',
  },
  {
    id: 'sa-006',
    name: 'image-scanner',
    status: 'active',
    apiKeysUsed: 1,
    apiKeysMax: 10,
    description: '-',
    createdAt: 'Jan 22, 2026',
  },
  {
    id: 'sa-007',
    name: 'dns-updater',
    status: 'inactive',
    apiKeysUsed: 0,
    apiKeysMax: 10,
    description: 'DNS record management',
    createdAt: 'Oct 5, 2026',
  },
  {
    id: 'sa-008',
    name: 'cost-reporter',
    status: 'active',
    apiKeysUsed: 0,
    apiKeysMax: 10,
    description: 'Cloud cost reporting and analysis',
    createdAt: 'Feb 18, 2026',
  },
  {
    id: 'sa-009',
    name: 'secret-rotator',
    status: 'active',
    apiKeysUsed: 4,
    apiKeysMax: 10,
    description: '-',
    createdAt: 'Mar 25, 2026',
  },
  {
    id: 'sa-010',
    name: 'audit-exporter',
    status: 'inactive',
    apiKeysUsed: 0,
    apiKeysMax: 10,
    description: 'Audit log export to external SIEM',
    createdAt: 'Sep 30, 2026',
  },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'id', label: 'ID', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  { id: 'description', label: 'Description', type: 'text' },
  { id: 'apiKeysUsed', label: 'API keys used', type: 'text' },
  { id: 'apiKeysMax', label: 'API keys max', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   IAM Service Accounts Page
   ---------------------------------------- */

export function IAMServiceAccountsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [managePoliciesAccount, setManagePoliciesAccount] = useState<ServiceAccount | null>(null);
  const [editingAccount, setEditingAccount] = useState<ServiceAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Service accounts');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filteredAccounts = useMemo(() => {
    return mockServiceAccounts.filter((account) => {
      return appliedFilters.every((filter) => {
        const raw = account[filter.fieldId as keyof ServiceAccount];
        const value = String(typeof raw === 'number' ? raw : (raw ?? '')).toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasSelection = selectedRows.length > 0;

  const getContextMenuItems = (row: ServiceAccount): ContextMenuItem[] => [
    {
      id: 'manage-policies',
      label: 'Manage policies',
      onClick: () => setManagePoliciesAccount(row),
    },
    { id: 'edit', label: 'Edit', onClick: () => setEditingAccount(row) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger' as const,
      divider: true,
      onClick: () => console.log('Delete', row.id),
    },
  ];

  const columns: TableColumn<ServiceAccount>[] = [
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
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/iam/service-accounts/${row.name}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline"
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)]">
            <span className="truncate">ID: {row.id}</span>
            <InlineCopyId value={row.id} />
          </span>
        </div>
      ),
    },
    {
      key: 'apiKeysUsed',
      label: 'API keys',
      flex: 1,
      render: (_value, row) => `${row.apiKeysUsed} / ${row.apiKeysMax}`,
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
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
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
            <Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'Service accounts' }]} />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader
          title="Service accounts"
          actions={
            <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
              Create service account
            </Button>
          }
        />

        <VStack gap={3} className="w-full">
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <FilterSearchInput
                  filters={filterFields}
                  appliedFilters={appliedFilters}
                  onFiltersChange={setAppliedFilters}
                  placeholder="Search service accounts by attributes"
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
                  disabled={!hasSelection}
                  leftIcon={<IconTrash size={12} />}
                >
                  Delete
                </Button>
              </ListToolbar.Actions>
            }
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAccounts.length}
            selectedCount={selectedRows.length}
            showSettings
            onPageChange={setCurrentPage}
          />

          <Table<ServiceAccount>
            columns={columns}
            data={paginatedAccounts}
            rowKey="id"
            selectable
            selectedKeys={selectedRows}
            onSelectionChange={setSelectedRows}
            loading={loading}
          />
        </VStack>
      </VStack>

      <CreateServiceAccountDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <RolePoliciesDrawer
        isOpen={!!managePoliciesAccount}
        onClose={() => setManagePoliciesAccount(null)}
        title="Manage linked policies"
        infoLabel="Service account"
        roleName={managePoliciesAccount?.name ?? ''}
      />

      <EditServiceAccountDrawer
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        initialName={editingAccount?.name ?? ''}
        initialDescription={editingAccount?.description ?? ''}
        initialActive={editingAccount?.status === 'active'}
      />
    </PageShell>
  );
}

export default IAMServiceAccountsPage;
