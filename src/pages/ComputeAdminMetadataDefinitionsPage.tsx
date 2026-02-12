import { useState, useMemo } from 'react';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Table,
  SearchInput,
  Pagination,
  ContextMenu,
  PageShell,
  PageHeader,
  fixedColumns,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconBell, IconDownload, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface MetadataDefinition {
  id: string;
  name: string;
  description: string;
  resourceTypes: string[];
  isPublic: boolean;
  isProtected: boolean;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockMetadataDefinitions: MetadataDefinition[] = Array.from({ length: 115 }, (_, i) => ({
  id: `metadata-${String(i + 1).padStart(4, '0')}`,
  name: `metadata${i > 0 ? i : ''}`,
  description:
    i % 3 === 0
      ? 'These properties allow modifying the shutdown behavior of the compute service.'
      : i % 5 === 0
        ? 'Resource metadata for image properties'
        : 'Custom metadata definition for resources',
  resourceTypes:
    i % 2 === 0
      ? ['OS::Glance::Image', 'OS::Nova::Instance', 'OS::Cinder::Volume']
      : ['OS::Glance::Image'],
  isPublic: i % 3 !== 1,
  isProtected: i % 4 === 0,
}));

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function ComputeAdminMetadataDefinitionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Metadata state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMetadata, setSelectedMetadata] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/compute-admin' },
    { label: 'Metadata Definitions' },
  ];

  // Filtered metadata
  const filteredMetadata = useMemo(() => {
    if (!searchTerm) return mockMetadataDefinitions;
    const query = searchTerm.toLowerCase();
    return mockMetadataDefinitions.filter(
      (metadata) =>
        metadata.name.toLowerCase().includes(query) ||
        metadata.description.toLowerCase().includes(query) ||
        metadata.resourceTypes.some((type) => type.toLowerCase().includes(query))
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredMetadata.length / itemsPerPage);
  const paginatedMetadata = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMetadata.slice(start, start + itemsPerPage);
  }, [filteredMetadata, currentPage]);

  // Context menu items
  const getMetadataMenuItems = (metadata: MetadataDefinition): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit metadata', metadata.id) },
    {
      id: 'manage-contents',
      label: 'Manage contents',
      onClick: () => console.log('Manage contents', metadata.id),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete metadata', metadata.id),
    },
  ];

  // Table columns
  const metadataColumns: TableColumn<MetadataDefinition>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/compute-admin/metadata-definition/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 2,
      sortable: true,
      render: (_, row) => (
        <span className="text-[var(--color-text-default)] truncate block" title={row.description}>
          {row.description}
        </span>
      ),
    },
    {
      key: 'resourceTypes',
      label: 'Resource Types',
      flex: 1.5,
      render: (_, row) => {
        const types = row.resourceTypes;
        if (types.length === 0) return '-';
        if (types.length === 1) return types[0];
        return `${types[0]} (+${types.length - 1})`;
      },
    },
    {
      key: 'isPublic',
      label: 'Public',
      width: '100px',
      render: (_, row) => (row.isPublic ? 'On' : 'Off'),
    },
    {
      key: 'isProtected',
      label: 'Protected',
      width: '100px',
      render: (_, row) => (row.isProtected ? 'Yes' : 'No'),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.action,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getMetadataMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-muted)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
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
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Metadata Definitions"
          actions={
            <Button variant="primary" size="md">
              Import Metadata
            </Button>
          }
        />

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-[var(--search-input-width)]">
              <SearchInput
                placeholder="Search metadata by attributes"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
              aria-label="Download"
            >
              <IconDownload size={12} stroke={1.5} />
            </button>
          </div>
          <div className="h-4 w-px bg-[var(--color-border-default)]" />
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<IconTrash size={12} />}
            disabled={selectedMetadata.length === 0}
          >
            Delete
          </Button>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredMetadata.length}
          selectedCount={selectedMetadata.length}
        />

        {/* Table */}
        <Table
          columns={metadataColumns}
          data={paginatedMetadata}
          rowKey="id"
          selectable
          selectedKeys={selectedMetadata}
          onSelectionChange={setSelectedMetadata}
          onRowClick={(row) =>
            (window.location.href = `/compute-admin/metadata-definition/${row.id}`)
          }
          stickyHeader
        />
      </VStack>
    </PageShell>
  );
}
