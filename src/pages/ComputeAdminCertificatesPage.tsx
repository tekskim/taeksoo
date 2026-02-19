import { useState, useMemo } from 'react';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  StatusIndicator,
  Tabs,
  TabList,
  Tab,
  PageShell,
  PageHeader,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { RegisterCertificateDrawer } from '@/components/RegisterCertificateDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link, useSearchParams } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type CertificateStatus = 'active' | 'error' | 'pending';
type CertificateType = 'server' | 'ca';

interface Certificate {
  id: string;
  name: string;
  domain: string;
  listener: string;
  listenerId: string;
  listenerCount: number;
  expiresAt: string;
  createdAt: string;
  type: CertificateType;
  status: CertificateStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockCertificates: Certificate[] = [
  {
    id: 'cert-001',
    name: 'server-cert-1',
    domain: 'www.domain.com (+3)',
    listener: 'listener-1',
    listenerId: '294u92s2',
    listenerCount: 10,
    expiresAt: 'Oct 5, 2025',
    createdAt: 'Oct 3, 2025',
    type: 'server',
    status: 'active',
  },
  {
    id: 'cert-002',
    name: 'api-cert',
    domain: 'api.example.com (+2)',
    listener: 'listener-api',
    listenerId: '38fj29dk',
    listenerCount: 2,
    expiresAt: 'Jan 15, 2026',
    createdAt: 'Sep 28, 2025',
    type: 'server',
    status: 'active',
  },
  {
    id: 'cert-003',
    name: 'wildcard-cert',
    domain: 'www.example.org (+5)',
    listener: 'listener-web',
    listenerId: '9dk38fj2',
    listenerCount: 0,
    expiresAt: 'Dec 1, 2025',
    createdAt: 'Sep 20, 2025',
    type: 'server',
    status: 'active',
  },
  {
    id: 'cert-004',
    name: 'staging-cert',
    domain: 'staging.domain.com (+1)',
    listener: 'listener-staging',
    listenerId: 'k29dk38f',
    listenerCount: 0,
    expiresAt: 'Nov 15, 2025',
    createdAt: 'Sep 15, 2025',
    type: 'server',
    status: 'pending',
  },
  {
    id: 'cert-005',
    name: 'internal-cert',
    domain: 'internal.company.com (+4)',
    listener: 'listener-internal',
    listenerId: 'fj29dk38',
    listenerCount: 5,
    expiresAt: 'Mar 20, 2026',
    createdAt: 'Sep 10, 2025',
    type: 'server',
    status: 'active',
  },
  {
    id: 'cert-006',
    name: 'root-ca',
    domain: 'N/A',
    listener: '-',
    listenerId: '',
    listenerCount: 0,
    expiresAt: 'Jan 1, 2030',
    createdAt: 'Jan 1, 2025',
    type: 'ca',
    status: 'active',
  },
  {
    id: 'cert-007',
    name: 'intermediate-ca',
    domain: 'N/A',
    listener: '-',
    listenerId: '',
    listenerCount: 0,
    expiresAt: 'Jun 15, 2028',
    createdAt: 'Jun 15, 2025',
    type: 'ca',
    status: 'active',
  },
  {
    id: 'cert-008',
    name: 'expired-cert',
    domain: 'old.domain.com (+2)',
    listener: '-',
    listenerId: '',
    listenerCount: 0,
    expiresAt: 'Aug 1, 2025',
    createdAt: 'Aug 1, 2024',
    type: 'server',
    status: 'error',
  },
  {
    id: 'cert-009',
    name: 'dev-ca',
    domain: 'N/A',
    listener: '-',
    listenerId: '',
    listenerCount: 0,
    expiresAt: 'Dec 31, 2027',
    createdAt: 'Jan 15, 2025',
    type: 'ca',
    status: 'active',
  },
  {
    id: 'cert-010',
    name: 'client-auth-cert',
    domain: 'auth.domain.com (+1)',
    listener: 'listener-auth',
    listenerId: '29dk38fj',
    listenerCount: 0,
    expiresAt: 'Jun 1, 2026',
    createdAt: 'Jun 1, 2025',
    type: 'server',
    status: 'active',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const certStatusMap: Record<CertificateStatus, 'active' | 'error' | 'pending'> = {
  active: 'active',
  error: 'error',
  pending: 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'domain', label: 'Domain', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

export function ComputeAdminCertificatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [certificates] = useState(mockCertificates);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'server';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);

  // Register certificate drawer state
  const [isRegisterDrawerOpen, setIsRegisterDrawerOpen] = useState(false);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'domain', label: 'SAN', visible: true },
    { id: 'listener', label: 'Listener', visible: true },
    { id: 'expiresAt', label: 'Expires at', visible: true },
    { id: 'createdAt', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];

  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Context menu items
  const getContextMenuItems = (cert: Certificate): ContextMenuItem[] => [
    {
      id: 'download',
      label: 'Download',
      onClick: () => console.log('Download:', cert.id),
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => {
        setCertToDelete(cert);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Filter certificates based on search and tab
  const filteredCerts = useMemo(() => {
    let filtered = certificates;
    filtered = filtered.filter((c) => c.type === activeTab);
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((cert) => {
        return appliedFilters.every((filter) => {
          const value = cert[filter.fieldId as keyof Certificate];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filter.value.toLowerCase());
          }
          return true;
        });
      });
    }
    return filtered;
  }, [certificates, appliedFilters, activeTab]);

  const totalPages = Math.ceil(filteredCerts.length / rowsPerPage);

  // Paginated data
  const paginatedCerts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCerts.slice(start, start + rowsPerPage);
  }, [filteredCerts, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<Certificate>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={certStatusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/certificates/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    { key: 'domain', label: 'SAN', flex: 1 },
    {
      key: 'listener',
      label: 'Listener',
      flex: 1,
      sortable: true,
      render: (_, row) =>
        row.listener === '-' ? (
          '-'
        ) : (
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-body-md text-[var(--color-text-default)]">{row.listener}</span>
              {row.listenerCount > 0 && (
                <span className="text-body-md text-[var(--color-text-subtle)]">
                  (+{row.listenerCount})
                </span>
              )}
            </div>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID : {row.listenerId}
            </span>
          </div>
        ),
    },
    {
      key: 'expiresAt',
      label: 'Expires at',
      flex: 1,
      sortable: true,
      render: (value: string) => {
        const isExpired = new Date(value) < new Date();
        return <span className={isExpired ? 'text-[var(--color-text-danger)]' : ''}>{value}</span>;
      },
    },
    { key: 'createdAt', label: 'Created at', flex: 1, sortable: true },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
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

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<Certificate> => col !== undefined);
  }, [columns, columnConfig]);

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    setCertToDelete(null);
  };

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Certificates' },
              ]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Certificates"
          actions={
            <Button variant="primary" size="md" onClick={() => setIsRegisterDrawerOpen(true)}>
              Register certificate
            </Button>
          }
        />
        <Tabs value={activeTab} onChange={setActiveTab} size="sm">
          <TabList>
            <Tab value="server">Server</Tab>
            <Tab value="ca">CA</Tab>
          </TabList>
        </Tabs>
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search certificate by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
              <Button
                variant="secondary"
                size="sm"
                iconOnly
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
                disabled={selectedCerts.length === 0}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCerts.length}
          selectedCount={selectedCerts.length}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => setIsPreferencesOpen(true)}
        />
        <Table
          columns={visibleColumns}
          data={paginatedCerts}
          rowKey="id"
          selectable
          selectedKeys={selectedCerts}
          onSelectionChange={setSelectedCerts}
        />
      </VStack>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCertToDelete(null);
        }}
        title="Delete certificate"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
      />
      <ViewPreferencesDrawer
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columnConfig}
        defaultColumns={defaultColumnConfig}
        onColumnsChange={setColumnConfig}
      />

      {/* Register Certificate Drawer */}
      <RegisterCertificateDrawer
        isOpen={isRegisterDrawerOpen}
        onClose={() => setIsRegisterDrawerOpen(false)}
      />
    </PageShell>
  );
}
