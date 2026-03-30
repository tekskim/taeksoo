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
  PageShell,
  PageHeader,
  columnMinWidths,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconBell, IconDownload, IconTrash } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface NFSExport {
  id: string;
  path: string;
  pseudo: string;
  cluster: string;
  storageBackend: string;
  accessType: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNFSExports: NFSExport[] = [
  {
    id: 'nfs-1',
    path: '/volumes/_nogroup/data/16372efe-f02b-4c3b-b6a7-35daa2e66951',
    pseudo: '/perf-test-hdd/data',
    cluster: 'nfs-cephfs',
    storageBackend: 'CephFS',
    accessType: 'RW',
  },
  {
    id: 'nfs-2',
    path: '/volumes/_nogroup/data/b7193136-465f-411a-99dc-e796a9a45871',
    pseudo: '/perf-test/data',
    cluster: 'nfs-cephfs',
    storageBackend: 'CephFS',
    accessType: 'RW',
  },
  {
    id: 'nfs-3',
    path: '/volumes/_nogroup/data/f3870068-7314-400c-ac04-c810c343eeba',
    pseudo: '/ai-platform/data',
    cluster: 'nfs-cephfs',
    storageBackend: 'CephFS',
    accessType: 'RW',
  },
];

/* ----------------------------------------
   NFS Page
   ---------------------------------------- */

export function NFSPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const rowsPerPage = 10;

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const filteredExports = useMemo(
    () =>
      mockNFSExports.filter(
        (nfs) =>
          nfs.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nfs.pseudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nfs.cluster.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalItems = filteredExports.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const paginatedExports = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredExports.slice(start, start + rowsPerPage);
  }, [filteredExports, currentPage, rowsPerPage]);

  const columns: TableColumn<NFSExport>[] = [
    {
      key: 'path',
      label: 'Path',
      flex: 2,
      minWidth: columnMinWidths.nameWide,
      sortable: true,
      render: (value, row) => (
        <Link
          to={`/storage/nfs/${row.id}`}
          className="text-[var(--color-action-primary)] hover:underline truncate block font-medium"
          title={value as string}
        >
          {value as string}
        </Link>
      ),
    },
    {
      key: 'pseudo',
      label: 'Pseudo',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
    },
    {
      key: 'cluster',
      label: 'Cluster',
      flex: 1,
      minWidth: columnMinWidths.owner,
      sortable: true,
    },
    {
      key: 'storageBackend',
      label: 'Storage Backend',
      flex: 1,
      minWidth: columnMinWidths.status,
      sortable: true,
    },
    {
      key: 'accessType',
      label: 'Access Type',
      flex: 1,
      minWidth: columnMinWidths.status,
      sortable: true,
    },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <PageShell
      sidebar={
        <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
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
            <Breadcrumb items={[{ label: 'Home', href: '/storage' }, { label: 'NFS' }]} />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="NFS"
          actions={
            <Button variant="primary" size="md" onClick={() => navigate('/storage/nfs/create')}>
              Create NFS Export
            </Button>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <div className="w-[var(--search-input-width)]">
                <SearchInput
                  placeholder="Search NFS exports"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  size="sm"
                  fullWidth
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} stroke={1.5} />}
                aria-label="Download"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconRefresh size={12} stroke={1.5} />}
                aria-label="Refresh"
                onClick={() => console.log('Refresh clicked')}
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={!hasSelection}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => console.log('Settings clicked')}
          totalItems={totalItems}
          selectedCount={selectedRows.length}
        />

        <Table
          columns={columns}
          data={paginatedExports}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </VStack>
    </PageShell>
  );
}

export default NFSPage;
