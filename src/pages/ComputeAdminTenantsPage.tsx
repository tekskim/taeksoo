import { useState, useMemo } from 'react';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
  ContextMenu,
  fixedColumns,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell, IconDownload, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tenants state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const tenantsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/compute-admin' },
    { label: 'Tenants' },
  ];

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
        <StatusIndicator status={tenantStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/tenants/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.id}</span>
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
          <ContextMenu items={getTenantMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
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
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
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

          {/* Top Bar */}
          <TopBar
            sidebarOpen={sidebarOpen}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          >
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} onClick={() => {}} />
          </TopBar>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Tenants
                </h1>
                <Button variant="primary" size="md">
                  Create Tenant
                </Button>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search tenants by attributes"
                    />
                  </div>
                  <button
                    type="button"
                    className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
                    aria-label="Download"
                  >
                    <IconDownload size={14} stroke={1.5} />
                  </button>
                </div>
                <div className="h-4 w-px bg-[var(--color-border-default)]" />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconTrash size={12} />}
                  disabled={selectedTenants.length === 0}
                >
                  Delete
                </Button>
              </div>

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
              />
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
