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
import {
  IconPlus,
  IconDotsVertical,
  IconTrash,
  IconDownload,
  IconBell,
} from '@tabler/icons-react';

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
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [certificates] = useState(mockCertificates);
  const [activeTab, setActiveTab] = useState('server');
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

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

  const totalPages = Math.ceil(filteredCerts.length / 10);

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
      render: (value: string) => (
        <span className="font-medium text-[var(--color-action-primary)]">{value}</span>
      ),
    },
    { key: 'domain', label: 'Domain', flex: 1 },
    { key: 'listener', label: 'Listener', flex: 1 },
    { key: 'expiresAt', label: 'Expires At', flex: 1 },
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
              <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-subtle)]" />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    setCertToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <main className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 ${sidebarOpen ? 'ml-[200px]' : 'ml-0'}`}>
        <TabBar tabs={tabBarTabs} activeTab={activeTabId} onTabChange={selectTab} onTabClose={closeTab} showAddButton={false} showWindowControls={true} />
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
              <Button variant="primary" size="md" leftIcon={<IconPlus size={14} />}>Register Certificate</Button>
            </div>
            <Tabs value={activeTab} onChange={setActiveTab} size="sm">
              <TabList><Tab value="server">Server</Tab><Tab value="ca">CA</Tab></TabList>
            </Tabs>
            <ListToolbar
              primaryActions={<ListToolbar.Actions><div className="w-[280px]"><SearchInput placeholder="Find certificate with filters" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onClear={() => setSearchQuery('')} size="sm" fullWidth /></div><Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" /></ListToolbar.Actions>}
              bulkActions={<ListToolbar.Actions><Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled={selectedCerts.length === 0}>Delete</Button></ListToolbar.Actions>}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredCerts.length} onPageChange={setCurrentPage} selectedCount={selectedCerts.length} />
            <Table columns={columns} data={filteredCerts} rowKey="id" selectable selectedKeys={selectedCerts} onSelectionChange={setSelectedCerts} />
          </VStack>
        </div>
      </main>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setCertToDelete(null); }}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${certToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
