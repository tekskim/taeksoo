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
  ProgressBar,
  Badge,
  STATUS_THRESHOLDS,
  PageShell,
  PageHeader,
  columnMinWidths,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconBell, IconDownload } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Image {
  id: string;
  name: string;
  pool: string;
  namespace: string;
  size: string;
  usage: number; // percentage
  usageStatus: string; // e.g., "chunking"
  objects: number;
  objectSize: string;
  totalProvisioned: string;
  parent: string;
  mirroring: 'Enabled' | 'Disabled';
  nextScheduledSnapshot: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockImages: Image[] = [
  {
    id: 'img-1',
    name: 'volume-1d325cdb-2b44-4596-9c32-e280184ad2e6.deleted',
    pool: 'volumes',
    namespace: '-',
    size: '1 GiB',
    usage: 88.17,
    usageStatus: 'chunking',
    objects: 256,
    objectSize: '4 MiB',
    totalProvisioned: '67.1 GiB',
    parent: '-',
    mirroring: 'Disabled',
    nextScheduledSnapshot: '-',
  },
  {
    id: 'img-2',
    name: 'volume-2a456cdb-3c55-4687-0d43-f391295be7f7',
    pool: 'volumes',
    namespace: '-',
    size: '2 GiB',
    usage: 45.32,
    usageStatus: 'active',
    objects: 512,
    objectSize: '4 MiB',
    totalProvisioned: '120 GiB',
    parent: '-',
    mirroring: 'Disabled',
    nextScheduledSnapshot: '-',
  },
  {
    id: 'img-3',
    name: 'volume-3b567edc-4d66-5798-1e54-g4a2306cf8g8.deleted',
    pool: 'images',
    namespace: '-',
    size: '5 GiB',
    usage: 72.5,
    usageStatus: 'chunking',
    objects: 1024,
    objectSize: '4 MiB',
    totalProvisioned: '200 GiB',
    parent: 'base-image-01',
    mirroring: 'Enabled',
    nextScheduledSnapshot: '2026-03-20 03:00',
  },
  {
    id: 'img-4',
    name: 'volume-4c678fde-5e77-6809-2f65-h5b3417dg9h9',
    pool: 'volumes',
    namespace: '-',
    size: '10 GiB',
    usage: 23.8,
    usageStatus: 'active',
    objects: 2048,
    objectSize: '4 MiB',
    totalProvisioned: '350 GiB',
    parent: '-',
    mirroring: 'Disabled',
    nextScheduledSnapshot: '-',
  },
  {
    id: 'img-5',
    name: 'volume-5d789gef-6f88-7910-3g76-i6c4528ei0i0',
    pool: 'images',
    namespace: '-',
    size: '20 GiB',
    usage: 95.2,
    usageStatus: 'full',
    objects: 4096,
    objectSize: '4 MiB',
    totalProvisioned: '500 GiB',
    parent: 'base-image-02',
    mirroring: 'Enabled',
    nextScheduledSnapshot: '2026-03-18 00:00',
  },
  {
    id: 'img-6',
    name: 'volume-6e890hfg-7g99-8021-4h87-j7d5639fj1j1.deleted',
    pool: 'volumes',
    namespace: '-',
    size: '1 GiB',
    usage: 12.4,
    usageStatus: 'idle',
    objects: 128,
    objectSize: '4 MiB',
    totalProvisioned: '45 GiB',
    parent: '-',
    mirroring: 'Disabled',
    nextScheduledSnapshot: '-',
  },
  {
    id: 'img-7',
    name: 'volume-7f901igh-8h00-9132-5i98-k8e6740gk2k2',
    pool: 'volumes',
    namespace: '-',
    size: '3 GiB',
    usage: 56.7,
    usageStatus: 'active',
    objects: 768,
    objectSize: '4 MiB',
    totalProvisioned: '180 GiB',
    parent: '-',
    mirroring: 'Disabled',
    nextScheduledSnapshot: '-',
  },
  {
    id: 'img-8',
    name: 'volume-8g012jhi-9i11-0243-6j09-l9f7851hl3l3',
    pool: 'images',
    namespace: '-',
    size: '15 GiB',
    usage: 81.3,
    usageStatus: 'chunking',
    objects: 3072,
    objectSize: '4 MiB',
    totalProvisioned: '420 GiB',
    parent: 'base-image-03',
    mirroring: 'Disabled',
    nextScheduledSnapshot: '-',
  },
  {
    id: 'img-9',
    name: 'volume-9h123kij-0j22-1354-7k10-m0g8962im4m4',
    pool: 'volumes',
    namespace: '-',
    size: '8 GiB',
    usage: 34.9,
    usageStatus: 'active',
    objects: 1536,
    objectSize: '4 MiB',
    totalProvisioned: '280 GiB',
    parent: '-',
    mirroring: 'Disabled',
    nextScheduledSnapshot: '-',
  },
  {
    id: 'img-10',
    name: 'volume-0i234ljk-1k33-2465-8l21-n1h9073jn5n5.deleted',
    pool: 'images',
    namespace: '-',
    size: '25 GiB',
    usage: 67.8,
    usageStatus: 'chunking',
    objects: 5120,
    objectSize: '4 MiB',
    totalProvisioned: '650 GiB',
    parent: 'base-image-01',
    mirroring: 'Enabled',
    nextScheduledSnapshot: '2026-03-19 06:00',
  },
];

/* ----------------------------------------
   Usage Cell Component
   ---------------------------------------- */

interface UsageCellProps {
  usage: number;
}

function UsageCell({ usage }: UsageCellProps) {
  return (
    <ProgressBar
      variant="quota"
      value={usage}
      max={100}
      showValue
      size="sm"
      thresholds={STATUS_THRESHOLDS.storage}
    />
  );
}

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
      to={`/storage/images/${id}`}
      className="text-label-md text-[var(--color-action-primary)] hover:underline truncate block max-w-[220px]"
      title={name}
    >
      {name}
    </Link>
  );
}

/* ----------------------------------------
   Images Page
   ---------------------------------------- */

export function ImagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter images based on search
  const filteredImages = useMemo(
    () =>
      mockImages.filter(
        (image) =>
          image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.pool.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.parent.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  // Calculate pagination
  const totalItems = filteredImages.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  // Get current page data
  const paginatedImages = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredImages.slice(start, start + rowsPerPage);
  }, [filteredImages, currentPage, rowsPerPage]);

  // Table columns definition
  const columns: TableColumn<Image>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.nameXxl,
      sortable: true,
      render: (_, row) => <NameCell id={row.id} name={row.name} />,
    },
    {
      key: 'pool',
      label: 'Pool',
      flex: 1,
      minWidth: columnMinWidths.source,
      sortable: true,
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
    },
    {
      key: 'usage',
      label: 'Usage',
      flex: 1,
      minWidth: columnMinWidths.usage,
      sortable: true,
      render: (_, row) => <UsageCell usage={row.usage} />,
    },
    {
      key: 'objects',
      label: 'Objects',
      flex: 1,
      minWidth: columnMinWidths.objects,
      sortable: true,
    },
    {
      key: 'objectSize',
      label: 'Object size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
    },
    {
      key: 'totalProvisioned',
      label: 'Total provisioned',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
    },
    {
      key: 'parent',
      label: 'Parent',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
    },
    {
      key: 'mirroring',
      label: 'Mirroring',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
      render: (_, row) => (
        <Badge theme="white" size="sm">
          {row.mirroring}
        </Badge>
      ),
    },
    {
      key: 'nextScheduledSnapshot',
      label: 'Next scheduled snapshot',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
  ];

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
            <Breadcrumb items={[{ label: 'Home', href: '/storage' }, { label: 'Images' }]} />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader title="Images" />

        {/* Search and Actions */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-1">
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
            </div>
          </div>
        </div>

        {/* Pagination */}
        {filteredImages.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            onSettingsClick={() => console.log('Settings clicked')}
            totalItems={totalItems}
          />
        )}

        {/* Table */}
        <Table columns={columns} data={paginatedImages} getRowId={(row) => row.id} />
      </VStack>
    </PageShell>
  );
}

export default ImagesPage;
