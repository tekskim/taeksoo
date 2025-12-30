import { useState, useMemo } from 'react';
import {
  Button,
  SearchInput,
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
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
  expiresAt: string;
  createdAt: string;
  type: CertificateType;
  status: CertificateStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockCertificates: Certificate[] = [
  { id: 'cert-001', name: 'server-cert-1', domain: '*.domain.com', listener: 'listener-1 (+10)', expiresAt: '2025-10-05', createdAt: '2025-10-03', type: 'server', status: 'active' },
  { id: 'cert-002', name: 'api-cert', domain: 'api.example.com', listener: 'listener-api (+2)', expiresAt: '2026-01-15', createdAt: '2025-09-28', type: 'server', status: 'active' },
  { id: 'cert-003', name: 'wildcard-cert', domain: '*.example.org', listener: 'listener-web', expiresAt: '2025-12-01', createdAt: '2025-09-20', type: 'server', status: 'active' },
  { id: 'cert-004', name: 'staging-cert', domain: 'staging.domain.com', listener: 'listener-staging', expiresAt: '2025-11-15', createdAt: '2025-09-15', type: 'server', status: 'pending' },
  { id: 'cert-005', name: 'internal-cert', domain: 'internal.company.com', listener: 'listener-internal (+5)', expiresAt: '2026-03-20', createdAt: '2025-09-10', type: 'server', status: 'active' },
  { id: 'cert-006', name: 'root-ca', domain: 'N/A', listener: '-', expiresAt: '2030-01-01', createdAt: '2025-01-01', type: 'ca', status: 'active' },
  { id: 'cert-007', name: 'intermediate-ca', domain: 'N/A', listener: '-', expiresAt: '2028-06-15', createdAt: '2025-06-15', type: 'ca', status: 'active' },
  { id: 'cert-008', name: 'expired-cert', domain: 'old.domain.com', listener: '-', expiresAt: '2025-08-01', createdAt: '2024-08-01', type: 'server', status: 'error' },
  { id: 'cert-009', name: 'dev-ca', domain: 'N/A', listener: '-', expiresAt: '2027-12-31', createdAt: '2025-01-15', type: 'ca', status: 'active' },
  { id: 'cert-010', name: 'client-auth-cert', domain: 'auth.domain.com', listener: 'listener-auth', expiresAt: '2026-06-01', createdAt: '2025-06-01', type: 'server', status: 'active' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const certStatusMap: Record<CertificateStatus, 'active' | 'error' | 'pending'> = {
  'active': 'active',
  'error': 'error',
  'pending': 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function CertificatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [certificates] = useState(mockCertificates);
  const [activeTab, setActiveTab] = useState('server');
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'domain', label: 'Domain', visible: true },
    { id: 'listener', label: 'Listener', visible: true },
    { id: 'expiresAt', label: 'Expires At', visible: true },
    { id: 'createdAt', label: 'Created At', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];

  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Context menu items
  const getContextMenuItems = (cert: Certificate): ContextMenuItem[] => [
    { id: 'download', label: 'Download', onClick: () => console.log('Download:', cert.id), divider: true },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => { setCertToDelete(cert); setDeleteModalOpen(true); } },
  ];

  // Filter certificates based on search and tab
  const filteredCerts = useMemo(() => {
    let filtered = certificates;
    filtered = filtered.filter(c => c.type === activeTab);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.domain.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [certificates, searchQuery, activeTab]);

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
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={certStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
          to={`/certificates/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    { key: 'domain', label: 'Domain', flex: 1 },
    { key: 'listener', label: 'Listener', flex: 1 },
    {
      key: 'expiresAt',
      label: 'Expires At',
      flex: 1,
      render: (value: string) => {
        const isExpired = new Date(value) < new Date();
        return (
          <span className={isExpired ? 'text-[var(--color-text-danger)]' : ''}>
            {value}
          </span>
        );
      },
    },
    { key: 'createdAt', label: 'Created At', flex: 1 },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsCircleHorizontal size={16} stroke={1} className="text-[var(--color-text-subtle)]" />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig
      .filter((col) => col.visible)
      .map((col) => col.id);

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
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <main className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 overflow-x-auto ${sidebarOpen ? 'ml-[200px]' : 'ml-0'}`}>
        <div className="min-w-[var(--layout-content-min-width)]">
        <TabBar tabs={tabBarTabs} activeTab={activeTabId} onTabChange={selectTab} onTabClose={closeTab} onTabAdd={addNewTab} showAddButton={true} showWindowControls={true} />
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={[{ label: 'Proj-1', href: '/project' }, { label: 'Certificates' }]} />}
          actions={<TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" badge={true} />}
        />
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            <div className="flex justify-between items-center h-8 w-full">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">Certificates</h1>
              <Button variant="primary" size="md">Register Certificate</Button>
            </div>
            <Tabs value={activeTab} onChange={setActiveTab} size="sm">
              <TabList><Tab value="server">Server</Tab><Tab value="ca">CA</Tab></TabList>
            </Tabs>
            <ListToolbar
              primaryActions={<ListToolbar.Actions><div className="w-[280px]"><SearchInput placeholder="Find certificate with filters" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onClear={() => setSearchQuery('')} size="sm" fullWidth /></div><Button variant="secondary" size="sm" iconOnly icon={<IconDownload size={12} />} aria-label="Download" /></ListToolbar.Actions>}
              bulkActions={<ListToolbar.Actions><Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled={selectedCerts.length === 0}>Delete</Button></ListToolbar.Actions>}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredCerts.length} onPageChange={setCurrentPage} showSettings onSettingsClick={() => setIsPreferencesOpen(true)} />
            <Table columns={visibleColumns} data={paginatedCerts} rowKey="id" selectable selectedRows={selectedCerts} onSelectionChange={setSelectedCerts} />
          </VStack>
        </div>
        </div>
      </main>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setCertToDelete(null); }}
        title="Delete Certificate"
        description={`Are you sure you want to delete "${certToDelete?.name}"? This action cannot be undone.`}
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
    </div>
  );
}
