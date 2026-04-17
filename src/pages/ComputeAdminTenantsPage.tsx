import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
  ContextMenu,
  PageShell,
  PageHeader,
  ListToolbar,
  fixedColumns,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconDownload, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type TenantStatus = 'active' | 'deactivated' | 'building' | 'error';

interface Tenant {
  id: string;
  name: string;
  status: TenantStatus;
  description: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTenants: Tenant[] = Array.from({ length: 115 }, (_, i) => ({
  id: `${String(i + 1).padStart(8, '0')}`,
  name: `tenant ${String.fromCharCode(65 + (i % 26))}${i > 25 ? Math.floor(i / 26) : ''}`,
  status: i === 4 ? 'deactivated' : i % 20 === 0 ? 'building' : 'active',
  description: i % 3 === 0 ? 'Production tenant' : i % 5 === 0 ? 'Development tenant' : '-',
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const tenantStatusMap: Record<TenantStatus, 'active' | 'deactivated' | 'building' | 'error'> = {
  active: 'active',
  deactivated: 'deactivated',
  building: 'building',
  error: 'error',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function ComputeAdminTenantsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Tenants state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tenantsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [{ label: 'Tenants' }];

  // Filtered tenants
  const filteredTenants = useMemo(() => {
    if (!searchTerm) return mockTenants;
    const query = searchTerm.toLowerCase();
    return mockTenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(query) ||
        tenant.id.toLowerCase().includes(query) ||
        tenant.description.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredTenants.length / tenantsPerPage);
  const paginatedTenants = useMemo(() => {
    const start = (currentPage - 1) * tenantsPerPage;
    return filteredTenants.slice(start, start + tenantsPerPage);
  }, [filteredTenants, currentPage]);

  // Context menu items
  const getTenantMenuItems = (tenant: Tenant): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit tenant', tenant.id) },
    {
      id: 'manage-quotas',
      label: 'Manage quotas',
      onClick: () => console.log('Manage quotas', tenant.id),
    },
    {
      id: 'manage-members',
      label: 'Manage members',
      onClick: () => console.log('Manage members', tenant.id),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete tenant', tenant.id),
    },
  ];

  // Table columns
  const tenantColumns: TableColumn<Tenant>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator layout="icon-only" status={tenantStatusMap[row.status]} />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/tenants/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.id}>
              ID : {row.id.slice(0, 8)}
            </span>
            <InlineCopyId value={row.id} />
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <span className="text-[var(--color-text-default)]">{row.description}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getTenantMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Tenants"
          actions={
            <Button variant="primary" size="md">
              Create Tenant
            </Button>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search tenants by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <button
                type="button"
                className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
                aria-label="Download"
              >
                <IconDownload size={12} stroke={1.5} />
              </button>
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} />}
                disabled={selectedTenants.length === 0}
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
          totalItems={filteredTenants.length}
          selectedCount={selectedTenants.length}
        />

        {/* Table */}
        <Table
          columns={tenantColumns}
          data={paginatedTenants}
          rowKey="id"
          selectable
          selectedKeys={selectedTenants}
          onSelectionChange={setSelectedTenants}
          loading={loading}
        />
      </VStack>
    </PageShell>
  );
}
