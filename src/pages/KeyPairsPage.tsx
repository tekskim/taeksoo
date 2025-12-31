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
  Checkbox,
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
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface KeyPair {
  id: string;
  name: string;
  fingerprint: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockKeyPairs: KeyPair[] = [
  { id: 'kp-001', name: 'tk-keypair', fingerprint: '02:c1:ff:54:df:d9:69:0e:bb:46:a9:c8:0c:dc:2f:bb', createdAt: '2025-09-10' },
  { id: 'kp-002', name: 'dev-keypair', fingerprint: 'a3:b2:c1:d4:e5:f6:07:18:29:3a:4b:5c:6d:7e:8f:90', createdAt: '2025-09-08' },
  { id: 'kp-003', name: 'prod-keypair', fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00', createdAt: '2025-09-05' },
  { id: 'kp-004', name: 'staging-keypair', fingerprint: 'ff:ee:dd:cc:bb:aa:99:88:77:66:55:44:33:22:11:00', createdAt: '2025-08-30' },
  { id: 'kp-005', name: 'test-keypair', fingerprint: '12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0', createdAt: '2025-08-25' },
  { id: 'kp-006', name: 'backup-keypair', fingerprint: 'ab:cd:ef:01:23:45:67:89:ab:cd:ef:01:23:45:67:89', createdAt: '2025-08-20' },
  { id: 'kp-007', name: 'jenkins-keypair', fingerprint: '98:76:54:32:10:fe:dc:ba:98:76:54:32:10:fe:dc:ba', createdAt: '2025-08-15' },
  { id: 'kp-008', name: 'ansible-keypair', fingerprint: '01:02:03:04:05:06:07:08:09:0a:0b:0c:0d:0e:0f:10', createdAt: '2025-08-10' },
  { id: 'kp-009', name: 'terraform-keypair', fingerprint: 'f0:e1:d2:c3:b4:a5:96:87:78:69:5a:4b:3c:2d:1e:0f', createdAt: '2025-08-05' },
  { id: 'kp-010', name: 'github-deploy-key', fingerprint: 'aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99', createdAt: '2025-08-01' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function KeyPairsPage() {
  const [selectedKeyPairs, setSelectedKeyPairs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [keyPairs, setKeyPairs] = useState(mockKeyPairs);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [keyPairToDelete, setKeyPairToDelete] = useState<KeyPair | null>(null);
  
  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config (matching Figma: Selection, Name, Fingerprint, Created At, Action)
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'fingerprint', label: 'Fingerprint', visible: true },
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

  // Handle delete key pair
  const handleDeleteClick = (keyPair: KeyPair) => {
    setKeyPairToDelete(keyPair);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (keyPairToDelete) {
      setKeyPairs((prev) => prev.filter((kp) => kp.id !== keyPairToDelete.id));
      setDeleteModalOpen(false);
      setKeyPairToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setKeyPairToDelete(null);
  };

  // Copy fingerprint to clipboard
  const handleCopyFingerprint = async (id: string, fingerprint: string) => {
    try {
      await navigator.clipboard.writeText(fingerprint);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Filter key pairs by search
  const filteredKeyPairs = useMemo(() => {
    if (!searchQuery) return keyPairs;
    
    return keyPairs.filter(
      (kp) =>
        kp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kp.fingerprint.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [keyPairs, searchQuery]);

  const totalPages = Math.ceil(filteredKeyPairs.length / rowsPerPage);

  // Paginated key pairs for display
  const paginatedKeyPairs = filteredKeyPairs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Selection toggle functions
  const toggleSelection = (id: string) => {
    setSelectedKeyPairs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedKeyPairs.length === paginatedKeyPairs.length) {
      setSelectedKeyPairs([]);
    } else {
      setSelectedKeyPairs(paginatedKeyPairs.map((kp) => kp.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setKeyPairs((prev) => prev.filter((kp) => !selectedKeyPairs.includes(kp.id)));
    setSelectedKeyPairs([]);
  };

  // Table columns (matching Figma design: Selection, Name, Fingerprint, Created At, Action)
  const columns: TableColumn<KeyPair>[] = [
    {
      key: 'name',
      label: 'Name',
      width: '200px',
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/key-pairs/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'fingerprint',
      label: 'Fingerprint',
      flex: 1,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[length:var(--font-size-11)] text-[var(--color-text-default)]">{row.fingerprint}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyFingerprint(row.id, row.fingerprint);
            }}
            className="p-1.5 -m-1 rounded-md hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-subtle)] transition-colors"
            title={copiedId === row.id ? 'Copied!' : 'Copy fingerprint'}
          >
            {copiedId === row.id ? (
              <IconCheck size={12} className="text-[var(--color-state-success)]" />
            ) : (
              <IconCopy size={12} className="text-[var(--color-action-primary)]" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '150px',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => handleDeleteClick(row),
          },
        ];
        
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
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
      .filter((col): col is TableColumn<KeyPair> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
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
          showAddButton={true}
          showWindowControls={true}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Key Pairs' },
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
        {/* Page Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Key Pairs
              </h1>
              <Button>
                Create Key Pair
              </Button>
            </div>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find key pair with filters"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
                </ListToolbar.Actions>
              }
              bulkActions={
                <ListToolbar.Actions>
                  <Button
                    variant="muted"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                    disabled={selectedKeyPairs.length === 0}
                    onClick={handleBulkDelete}
                  >
                    Delete
                  </Button>
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            {filteredKeyPairs.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
                totalItems={filteredKeyPairs.length}
                selectedCount={selectedKeyPairs.length}
              />
            )}

            {/* Key Pairs Table */}
            <Table<KeyPair>
              columns={visibleColumns}
              data={paginatedKeyPairs}
              rowKey="id"
              emptyMessage="No key pairs found"
              selectable
              selectedKeys={selectedKeyPairs}
              onSelectionChange={setSelectedKeyPairs}
            />
          </VStack>
        </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Key Pair"
        description="Are you sure you want to delete this key pair? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Key pair name"
        infoValue={keyPairToDelete?.name}
      />

      {/* View Preferences Drawer */}
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

export default KeyPairsPage;

