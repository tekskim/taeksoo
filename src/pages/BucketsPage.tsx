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
  type TableColumn,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconRefresh,
  IconBell,
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Bucket {
  id: string;
  name: string;
  owner: string;
  usedCapacity: string;
  capacityLimit: string;
  objects: string;
  objectLimit: string;
  creationDate: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockBuckets: Bucket[] = [
  {
    id: 'bucket-1',
    name: 'cloud_tech/harbor',
    owner: 'ai_platform$ai.platform',
    usedCapacity: '10 MiB',
    capacityLimit: 'No Limit',
    objects: '1',
    objectLimit: 'No Limit',
    creationDate: '2025-09-19 04:06',
  },
  {
    id: 'bucket-2',
    name: 'ai_platform/ai-platform-hot',
    owner: 'cloud_tech$harbor',
    usedCapacity: '11.1 GiB',
    capacityLimit: 'No Limit',
    objects: '2.7 k',
    objectLimit: 'No Limit',
    creationDate: '2025-09-19 04:06',
  },
  {
    id: 'bucket-3',
    name: 'ai_platform/model-storage',
    owner: 'cloud_tech$harbor',
    usedCapacity: '24.5 GiB',
    capacityLimit: 'No Limit',
    objects: '5.2 k',
    objectLimit: 'No Limit',
    creationDate: '2025-09-18 12:30',
  },
  {
    id: 'bucket-4',
    name: 'data_lake/raw-data',
    owner: 'data_engineering$admin',
    usedCapacity: '156.8 GiB',
    capacityLimit: '500 GiB',
    objects: '12.4 k',
    objectLimit: '100 k',
    creationDate: '2025-09-17 08:15',
  },
  {
    id: 'bucket-5',
    name: 'data_lake/processed-data',
    owner: 'data_engineering$admin',
    usedCapacity: '89.2 GiB',
    capacityLimit: '200 GiB',
    objects: '8.9 k',
    objectLimit: '50 k',
    creationDate: '2025-09-17 08:20',
  },
  {
    id: 'bucket-6',
    name: 'backup/daily-snapshots',
    owner: 'system$backup',
    usedCapacity: '512.3 GiB',
    capacityLimit: '1 TiB',
    objects: '45.6 k',
    objectLimit: 'No Limit',
    creationDate: '2025-09-15 00:00',
  },
  {
    id: 'bucket-7',
    name: 'logs/application-logs',
    owner: 'devops$monitoring',
    usedCapacity: '78.4 GiB',
    capacityLimit: '100 GiB',
    objects: '234.5 k',
    objectLimit: '500 k',
    creationDate: '2025-09-14 10:00',
  },
  {
    id: 'bucket-8',
    name: 'media/user-uploads',
    owner: 'app_service$media',
    usedCapacity: '2.3 TiB',
    capacityLimit: '5 TiB',
    objects: '1.2 M',
    objectLimit: '10 M',
    creationDate: '2025-09-10 14:30',
  },
  {
    id: 'bucket-9',
    name: 'archive/2024-data',
    owner: 'system$archive',
    usedCapacity: '4.8 TiB',
    capacityLimit: 'No Limit',
    objects: '2.1 M',
    objectLimit: 'No Limit',
    creationDate: '2025-01-01 00:00',
  },
  {
    id: 'bucket-10',
    name: 'temp/scratch-space',
    owner: 'dev_team$shared',
    usedCapacity: '45.6 GiB',
    capacityLimit: '100 GiB',
    objects: '3.4 k',
    objectLimit: '10 k',
    creationDate: '2025-09-20 09:00',
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
      to={`/storage/buckets/${id}`}
      className="text-[var(--color-action-primary)] hover:underline truncate block max-w-[220px] font-medium"
      title={name}
    >
      {name}
    </Link>
  );
}

/* ----------------------------------------
   Buckets Page
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'owner', label: 'Owner', type: 'text' },
];

export function BucketsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const rowsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter buckets based on search
  const filteredBuckets = useMemo(() =>
    mockBuckets.filter((bucket) =>
      bucket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bucket.owner.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  // Calculate pagination
  const totalItems = filteredBuckets.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  // Get current page data
  const paginatedBuckets = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredBuckets.slice(start, start + rowsPerPage);
  }, [filteredBuckets, currentPage, rowsPerPage]);

  // Table columns definition
  const columns: TableColumn<Bucket>[] = [
    {
      key: 'name',
      label: 'Name',
      width: 220,
      sortable: true,
      render: (_, row) => <NameCell id={row.id} name={row.name} />,
    },
    {
      key: 'owner',
      label: 'Owner',
      width: 160,
      sortable: true,
    },
    {
      key: 'usedCapacity',
      label: 'Used capacity',
      flex: 1,
      sortable: true,
    },
    {
      key: 'capacityLimit',
      label: 'Capacity limit %',
      flex: 1,
      sortable: true,
    },
    {
      key: 'objects',
      label: 'Objects',
      flex: 1,
      sortable: true,
    },
    {
      key: 'objectLimit',
      label: 'Object limit %',
      flex: 1,
      sortable: true,
    },
    {
      key: 'creationDate',
      label: 'CreationDate',
      flex: 1,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: 72,
      align: 'center',
      render: (_, row) => (
        <ContextMenu
          trigger="click"
          items={[
            {
              id: 'delete',
              label: 'Delete',
              status: 'danger',
              onClick: () => console.log('Delete:', row.name),
            },
            {
              id: 'edit',
              label: 'Edit',
              onClick: () => console.log('Edit:', row.name),
            },
          ]}
        >
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            aria-label="More actions"
          >
            <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
          </button>
        </ContextMenu>
      ),
    },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}
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

          {/* Top Bar with Breadcrumb Navigation */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/storage' },
                  { label: 'Buckets' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Buckets
                </h1>
                <Button variant="primary" size="sm" onClick={() => navigate('/storage/buckets/create')}>
                  Create Bucket
                </Button>
              </div>

              {/* Search and Actions */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <div className="w-[280px]">
                      <SearchInput
                        placeholder="Search users by attributes"
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
                      icon={<IconDownload size={14} stroke={1.5} />}
                      aria-label="Download"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconRefresh size={14} stroke={1.5} />}
                      aria-label="Refresh"
                      onClick={() => console.log('Refresh clicked')}
                    />
                  </ListToolbar.Actions>
                }
                bulkActions={
                  <ListToolbar.Actions>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconTrash size={14} stroke={1.5} />}
                      disabled={!hasSelection}
                    >
                      Delete
                    </Button>
                  </ListToolbar.Actions>
                }
              />

              {/* Pagination */}
              {filteredBuckets.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  onSettingsClick={() => console.log('Settings clicked')}
                  totalItems={totalItems}
                  selectedCount={selectedRows.length}
                />
              )}

              {/* Table */}
              <Table
                columns={columns}
                data={paginatedBuckets}
                rowKey="id"
                selectable
                selectedKeys={selectedRows}
                onSelectionChange={setSelectedRows}
              />
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BucketsPage;

