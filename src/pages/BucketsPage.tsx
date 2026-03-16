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
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
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
  domain: string;
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
    domain: 'thaki',
    owner: 'ai_platform$ai.platform',
    usedCapacity: '10 MiB',
    capacityLimit: 'No Limit',
    objects: '1',
    objectLimit: 'No Limit',
    creationDate: 'Sep 19, 2025',
  },
  {
    id: 'bucket-2',
    name: 'ai_platform/ai-platform-hot',
    domain: 'Hostway',
    owner: 'cloud_tech$harbor',
    usedCapacity: '11.1 GiB',
    capacityLimit: 'No Limit',
    objects: '2.7 k',
    objectLimit: 'No Limit',
    creationDate: 'Sep 19, 2025',
  },
  {
    id: 'bucket-3',
    name: 'ai_platform/model-storage',
    domain: 'BespinGlobal',
    owner: 'cloud_tech$harbor',
    usedCapacity: '24.5 GiB',
    capacityLimit: 'No Limit',
    objects: '5.2 k',
    objectLimit: 'No Limit',
    creationDate: 'Sep 18, 2025',
  },
  {
    id: 'bucket-4',
    name: 'data_lake/raw-data',
    domain: 'thaki',
    owner: 'data_engineering$admin',
    usedCapacity: '156.8 GiB',
    capacityLimit: '500 GiB',
    objects: '12.4 k',
    objectLimit: '100 k',
    creationDate: 'Sep 17, 2025',
  },
  {
    id: 'bucket-5',
    name: 'data_lake/processed-data',
    domain: 'Hostway',
    owner: 'data_engineering$admin',
    usedCapacity: '89.2 GiB',
    capacityLimit: '200 GiB',
    objects: '8.9 k',
    objectLimit: '50 k',
    creationDate: 'Sep 17, 2025',
  },
  {
    id: 'bucket-6',
    name: 'backup/daily-snapshots',
    domain: 'BespinGlobal',
    owner: 'system$backup',
    usedCapacity: '512.3 GiB',
    capacityLimit: '1 TiB',
    objects: '45.6 k',
    objectLimit: 'No Limit',
    creationDate: 'Sep 15, 2025',
  },
  {
    id: 'bucket-7',
    name: 'logs/application-logs',
    domain: 'thaki',
    owner: 'devops$monitoring',
    usedCapacity: '78.4 GiB',
    capacityLimit: '100 GiB',
    objects: '234.5 k',
    objectLimit: '500 k',
    creationDate: 'Sep 14, 2025',
  },
  {
    id: 'bucket-8',
    name: 'media/user-uploads',
    domain: 'Hostway',
    owner: 'app_service$media',
    usedCapacity: '2.3 TiB',
    capacityLimit: '5 TiB',
    objects: '1.2 M',
    objectLimit: '10 M',
    creationDate: 'Sep 10, 2025',
  },
  {
    id: 'bucket-9',
    name: 'archive/2024-data',
    domain: 'BespinGlobal',
    owner: 'system$archive',
    usedCapacity: '4.8 TiB',
    capacityLimit: 'No Limit',
    objects: '2.1 M',
    objectLimit: 'No Limit',
    creationDate: 'Jan 1, 2025',
  },
  {
    id: 'bucket-10',
    name: 'temp/scratch-space',
    domain: 'thaki',
    owner: 'dev_team$shared',
    usedCapacity: '45.6 GiB',
    capacityLimit: '100 GiB',
    objects: '3.4 k',
    objectLimit: '10 k',
    creationDate: 'Sep 20, 2025',
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
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'owner', label: 'Owner', type: 'text' },
];

export function BucketsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const rowsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter buckets based on search
  const filteredBuckets = useMemo(
    () =>
      mockBuckets.filter(
        (bucket) =>
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
      flex: 1,
      minWidth: columnMinWidths.nameWide,
      sortable: true,
      render: (_, row) => <NameCell id={row.id} name={row.name} />,
    },
    {
      key: 'domain',
      label: 'Domain',
      flex: 1,
      minWidth: columnMinWidths.domain,
      sortable: true,
    },
    {
      key: 'owner',
      label: 'Owner',
      flex: 1,
      minWidth: columnMinWidths.owner,
      sortable: true,
    },
    {
      key: 'usedCapacity',
      label: 'Used capacity',
      flex: 1,
      minWidth: columnMinWidths.usedCapacity,
      sortable: true,
    },
    {
      key: 'capacityLimit',
      label: 'Capacity limit %',
      flex: 1,
      minWidth: columnMinWidths.capacityLimit,
      sortable: true,
    },
    {
      key: 'objects',
      label: 'Objects',
      flex: 1,
      minWidth: columnMinWidths.objects,
      sortable: true,
    },
    {
      key: 'objectLimit',
      label: 'Object limit %',
      flex: 1,
      minWidth: columnMinWidths.objectLimit,
      sortable: true,
    },
    {
      key: 'creationDate',
      label: 'CreationDate',
      flex: 1,
      minWidth: columnMinWidths.creationDate,
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actionWide,
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
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
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
            <Breadcrumb items={[{ label: 'Home', href: '/storage' }, { label: 'Buckets' }]} />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader
          title="Buckets"
          actions={
            <Button variant="primary" size="md" onClick={() => navigate('/storage/buckets/create')}>
              Create Bucket
            </Button>
          }
        />

        {/* Search and Actions */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <div className="w-[var(--search-input-width)]">
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
    </PageShell>
  );
}

export default BucketsPage;
