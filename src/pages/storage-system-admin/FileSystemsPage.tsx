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
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconDownload, IconTrash, IconCheck } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface FileSystem {
  id: string;
  name: string;
  enabled: boolean;
  created: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFileSystems: FileSystem[] = [
  {
    id: 'fs-1',
    name: 'ai-platform',
    enabled: true,
    created: '5 months ago',
  },
  {
    id: 'fs-2',
    name: 'perf-test',
    enabled: true,
    created: 'A month ago',
  },
  {
    id: 'fs-3',
    name: 'perf-test-hdd',
    enabled: true,
    created: 'A month ago',
  },
];

const fileSystemFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'enabled',
    label: 'Enabled',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  { id: 'created', label: 'Created', type: 'text' },
];

/* ----------------------------------------
   Name Cell Component
   ---------------------------------------- */

interface NameCellProps {
  id: string;
  name: string;
}

function NameCell({ id, name }: NameCellProps) {
  return (
    <Link
      to={`/storage/file-systems/${id}`}
      className="text-[var(--color-action-primary)] hover:underline truncate block max-w-[220px] font-medium"
      title={name}
    >
      {name}
    </Link>
  );
}

/* ----------------------------------------
   File Systems Page
   ---------------------------------------- */

export function FileSystemsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [fileSystems, setFileSystems] = useState<FileSystem[]>(mockFileSystems);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const rowsPerPage = 10;

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('File Systems');
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

  const filteredFileSystems = useMemo(() => {
    if (appliedFilters.length === 0) return fileSystems;
    return fileSystems.filter((fs) => {
      return appliedFilters.every((filter) => {
        if (filter.fieldId === 'enabled') {
          return String(fs.enabled) === filter.value;
        }
        const value = String(fs[filter.fieldId as keyof FileSystem] ?? '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [fileSystems, appliedFilters]);

  const handleBulkDelete = () => {
    setFileSystems((prev) => prev.filter((fs) => !selectedRows.includes(fs.id)));
    setIsBulkDeleteOpen(false);
    setSelectedRows([]);
  };

  const totalItems = filteredFileSystems.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const paginatedFileSystems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredFileSystems.slice(start, start + rowsPerPage);
  }, [filteredFileSystems, currentPage, rowsPerPage]);

  const columns: TableColumn<FileSystem>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 2,
      minWidth: columnMinWidths.nameWide,
      sortable: true,
      render: (_, row) => <NameCell id={row.id} name={row.name} />,
    },
    {
      key: 'enabled',
      label: 'Enabled',
      flex: 1,
      minWidth: columnMinWidths.status,
      sortable: true,
      render: (value) =>
        value ? (
          <IconCheck size={16} stroke={2} className="text-[var(--color-text-default)]" />
        ) : null,
    },
    {
      key: 'created',
      label: 'Created',
      flex: 1,
      minWidth: columnMinWidths.creationDate,
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
          breadcrumb={<Breadcrumb items={[{ label: 'File Systems' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader
          title="File Systems"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/storage/file-systems/create')}
            >
              Create File System
            </Button>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={fileSystemFilterFields}
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
          data={paginatedFileSystems}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No file systems found"
        />
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete selected file systems"
        description="Deleting the selected file systems is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} file system(s)`}
      />
    </PageShell>
  );
}

export default FileSystemsPage;
