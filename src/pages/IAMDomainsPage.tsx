import { useState, useEffect } from 'react';
import { IconDownload } from '@tabler/icons-react';
import { ArrowRightLeft } from 'lucide-react';
import {
  Button,
  Pagination,
  Table,
  SearchInput,
  TopBar,
  Breadcrumb,
  VStack,
  HStack,
  ContextMenu,
  TabBar,
  StatusIndicator,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IconAction } from '@/design-system/components/Icons';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Type Definitions
   ---------------------------------------- */
interface Domain {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */
const mockDomains: Domain[] = [
  { id: 'domain-001', name: 'domain', description: '-', status: 'active', createdAt: '2025-09-12' },
  {
    id: 'domain-002',
    name: 'production',
    description: 'Production environment',
    status: 'active',
    createdAt: '2025-08-15',
  },
  {
    id: 'domain-003',
    name: 'staging',
    description: 'Staging environment',
    status: 'active',
    createdAt: '2025-07-20',
  },
  {
    id: 'domain-004',
    name: 'development',
    description: 'Development environment',
    status: 'active',
    createdAt: '2025-06-10',
  },
  {
    id: 'domain-005',
    name: 'testing',
    description: 'Testing domain',
    status: 'inactive',
    createdAt: '2025-09-01',
  },
  {
    id: 'domain-006',
    name: 'qa-domain',
    description: 'QA testing',
    status: 'active',
    createdAt: '2025-08-25',
  },
  {
    id: 'domain-007',
    name: 'sandbox',
    description: 'Sandbox environment',
    status: 'pending',
    createdAt: '2025-09-10',
  },
  {
    id: 'domain-008',
    name: 'demo',
    description: 'Demo environment',
    status: 'active',
    createdAt: '2025-07-05',
  },
  {
    id: 'domain-009',
    name: 'internal',
    description: 'Internal domain',
    status: 'active',
    createdAt: '2025-06-01',
  },
  {
    id: 'domain-010',
    name: 'external',
    description: 'External access domain',
    status: 'active',
    createdAt: '2025-05-15',
  },
];

/* ----------------------------------------
   IAM Domains Page
   ---------------------------------------- */
export default function IAMDomainsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const itemsPerPage = 10;

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Domains');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter domains by search query
  const filteredDomains = mockDomains.filter(
    (domain) =>
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);
  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Context menu items factory
  const isLastDomain = mockDomains.length === 1;
  const getContextMenuItems = (row: Domain): ContextMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      onClick: () => console.log('Edit domain', row.id),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: isLastDomain ? undefined : 'danger',
      disabled: isLastDomain,
      onClick: () => console.log('Delete domain', row.id),
    },
  ];

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Domain>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value) => (
        <StatusIndicator
          status={value === 'active' ? 'active' : value === 'inactive' ? 'shutoff' : 'building'}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <span className="font-medium text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_value, row) => (
        <HStack gap={1} align="center" justify="center">
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
            title="Open console"
          >
            <ArrowRightLeft
              size={16}
              strokeWidth={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
            </button>
          </ContextMenu>
        </HStack>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'Domains' }]} />}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full">
                <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Domains
                </h1>
                <Button variant="primary" size="md">
                  Create domain
                </Button>
              </HStack>

              {/* Table Content */}
              <VStack gap={3} className="w-full">
                {/* Action Bar */}
                <HStack gap={2} align="center">
                  {/* Search */}
                  <HStack gap={1} align="center">
                    <SearchInput
                      placeholder="Search domains by attributes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[var(--search-input-width)]"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconDownload size={12} />}
                      aria-label="Download"
                    />
                  </HStack>
                </HStack>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  totalItems={filteredDomains.length}
                  selectedCount={selectedRows.length}
                />

                {/* Table */}
                <Table<Domain> columns={columns} data={paginatedDomains} rowKey="id" />
              </VStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
