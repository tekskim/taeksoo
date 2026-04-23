import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  ListToolbar,
  PageShell,
  PageHeader,
  columnMinWidths,
  ConfirmModal,
  type TableColumn,
  type FilterField,
  type AppliedFilter,
  type FilterItem,
} from '@/design-system';
import { StorageSidebarResolver as StorageSidebar } from '@/components/StorageSidebarResolver';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconDownload, IconTrash } from '@tabler/icons-react';
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

const nfsFilterFields: FilterField[] = [
  { id: 'id', label: 'ID', type: 'text' },
  { id: 'path', label: 'Path', type: 'text' },
  { id: 'pseudo', label: 'Pseudo', type: 'text' },
  { id: 'cluster', label: 'Cluster', type: 'text' },
  { id: 'storageBackend', label: 'Storage backend', type: 'text' },
  { id: 'accessType', label: 'Access type', type: 'text' },
];

/* ----------------------------------------
   NFS Page
   ---------------------------------------- */

export function NFSPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [nfsExports, setNfsExports] = useState<NFSExport[]>(mockNFSExports);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const rowsPerPage = 10;

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('NFS');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const toolbarFilters: FilterItem[] = appliedFilters.map((f) => ({
    id: f.id,
    field: f.fieldLabel,
    value: f.valueLabel || f.value,
  }));

  const removeFilter = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const filteredExports = useMemo(() => {
    if (appliedFilters.length === 0) return nfsExports;
    return nfsExports.filter((nfs) => {
      return appliedFilters.every((filter) => {
        const value = String(nfs[filter.fieldId as keyof NFSExport] ?? '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [nfsExports, appliedFilters]);

  const handleBulkDelete = () => {
    setNfsExports((prev) => prev.filter((nfs) => !selectedRows.includes(nfs.id)));
    setIsBulkDeleteOpen(false);
    setSelectedRows([]);
  };

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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'NFS' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
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
              <FilterSearchInput
                filters={nfsFilterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={(f) => {
                  setAppliedFilters(f);
                  setCurrentPage(1);
                }}
                placeholder="Search by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} stroke={1.5} />}
                aria-label="Download"
                onClick={() => console.log('Download')}
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
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
          filters={toolbarFilters}
          onFilterRemove={removeFilter}
          onFiltersClear={() => setAppliedFilters([])}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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
          emptyMessage="No NFS exports found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete selected NFS exports"
        description="Deleting the selected NFS exports is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} NFS export(s)`}
      />
    </PageShell>
  );
}

export default NFSPage;
