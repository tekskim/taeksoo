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
import { IconRefresh, IconBell, IconDownload, IconTrash, IconCheck } from '@tabler/icons-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const rowsPerPage = 10;

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const filteredFileSystems = useMemo(
    () => mockFileSystems.filter((fs) => fs.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'Home', href: '/storage' }, { label: 'File Systems' }]} />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
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
              <div className="w-[var(--search-input-width)]">
                <SearchInput
                  placeholder="Search file systems"
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
          data={paginatedFileSystems}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </VStack>
    </PageShell>
  );
}

export default FileSystemsPage;
