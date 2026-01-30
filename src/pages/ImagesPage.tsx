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
  size: string;
  usage: number; // percentage
  usageStatus: string; // e.g., "chunking"
  objects: number;
  objectSize: string;
  totalProvisioned: string;
  parent: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockImages: Image[] = [
  {
    id: 'img-1',
    name: 'volume-1d325cdb-2b44-4596-9c32-e280184ad2e6.deleted',
    pool: 'volumes',
    size: '1 GiB',
    usage: 88.17,
    usageStatus: 'chunking',
    objects: 256,
    objectSize: '18.4 GiB',
    totalProvisioned: '67.1 GiB',
    parent: '-',
  },
  {
    id: 'img-2',
    name: 'volume-2a456cdb-3c55-4687-0d43-f391295be7f7',
    pool: 'volumes',
    size: '2 GiB',
    usage: 45.32,
    usageStatus: 'active',
    objects: 512,
    objectSize: '24.8 GiB',
    totalProvisioned: '120 GiB',
    parent: '-',
  },
  {
    id: 'img-3',
    name: 'volume-3b567edc-4d66-5798-1e54-g4a2306cf8g8.deleted',
    pool: 'images',
    size: '5 GiB',
    usage: 72.5,
    usageStatus: 'chunking',
    objects: 1024,
    objectSize: '32.1 GiB',
    totalProvisioned: '200 GiB',
    parent: 'base-image-01',
  },
  {
    id: 'img-4',
    name: 'volume-4c678fde-5e77-6809-2f65-h5b3417dg9h9',
    pool: 'volumes',
    size: '10 GiB',
    usage: 23.8,
    usageStatus: 'active',
    objects: 2048,
    objectSize: '45.2 GiB',
    totalProvisioned: '350 GiB',
    parent: '-',
  },
  {
    id: 'img-5',
    name: 'volume-5d789gef-6f88-7910-3g76-i6c4528ei0i0',
    pool: 'images',
    size: '20 GiB',
    usage: 95.2,
    usageStatus: 'full',
    objects: 4096,
    objectSize: '78.5 GiB',
    totalProvisioned: '500 GiB',
    parent: 'base-image-02',
  },
  {
    id: 'img-6',
    name: 'volume-6e890hfg-7g99-8021-4h87-j7d5639fj1j1.deleted',
    pool: 'volumes',
    size: '1 GiB',
    usage: 12.4,
    usageStatus: 'idle',
    objects: 128,
    objectSize: '8.2 GiB',
    totalProvisioned: '45 GiB',
    parent: '-',
  },
  {
    id: 'img-7',
    name: 'volume-7f901igh-8h00-9132-5i98-k8e6740gk2k2',
    pool: 'volumes',
    size: '3 GiB',
    usage: 56.7,
    usageStatus: 'active',
    objects: 768,
    objectSize: '28.9 GiB',
    totalProvisioned: '180 GiB',
    parent: '-',
  },
  {
    id: 'img-8',
    name: 'volume-8g012jhi-9i11-0243-6j09-l9f7851hl3l3',
    pool: 'images',
    size: '15 GiB',
    usage: 81.3,
    usageStatus: 'chunking',
    objects: 3072,
    objectSize: '62.4 GiB',
    totalProvisioned: '420 GiB',
    parent: 'base-image-03',
  },
  {
    id: 'img-9',
    name: 'volume-9h123kij-0j22-1354-7k10-m0g8962im4m4',
    pool: 'volumes',
    size: '8 GiB',
    usage: 34.9,
    usageStatus: 'active',
    objects: 1536,
    objectSize: '38.7 GiB',
    totalProvisioned: '280 GiB',
    parent: '-',
  },
  {
    id: 'img-10',
    name: 'volume-0i234ljk-1k33-2465-8l21-n1h9073jn5n5.deleted',
    pool: 'images',
    size: '25 GiB',
    usage: 67.8,
    usageStatus: 'chunking',
    objects: 5120,
    objectSize: '98.3 GiB',
    totalProvisioned: '650 GiB',
    parent: 'base-image-01',
  },
];

/* ----------------------------------------
   Usage Cell Component
   ---------------------------------------- */

interface UsageCellProps {
  usage: number;
}

function UsageCell({ usage }: UsageCellProps) {
  // Determine status based on usage percentage
  const getStatus = (): 'success' | 'warning' | 'danger' => {
    if (usage >= 90) return 'danger';
    if (usage >= 70) return 'warning';
    return 'success';
  };

  return (
    <div className="flex flex-col gap-1 w-[110px]">
      <span className="text-body-md text-[var(--color-text-default)]">{usage.toFixed(2)}%</span>
      <ProgressBar value={usage} max={100} size="sm" status={getStatus()} />
    </div>
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
      className="font-medium text-[var(--color-action-primary)] hover:underline truncate block max-w-[220px]"
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
      minWidth: columnMinWidths.pool || '100px',
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
      minWidth: columnMinWidths.usage || '100px',
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
      minWidth: columnMinWidths.size || '100px',
      sortable: true,
    },
    {
      key: 'totalProvisioned',
      label: 'Total provisioned',
      flex: 1,
      minWidth: '100px',
      sortable: true,
    },
    {
      key: 'parent',
      label: 'Parent',
      flex: 1,
      minWidth: columnMinWidths.name || '100px',
      sortable: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'}`}
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
              <Breadcrumb items={[{ label: 'Home', href: '/storage' }, { label: 'Images' }]} />
            }
            actions={
              <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">Images</h1>
              </div>

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
          </div>
        </div>
      </main>
    </div>
  );
}

export default ImagesPage;
