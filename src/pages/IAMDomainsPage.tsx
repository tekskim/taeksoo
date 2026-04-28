import { useState, useEffect, useMemo } from 'react';
import { IconDownload, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { ArrowRightLeft } from 'lucide-react';
import {
  Button,
  Pagination,
  Table,
  FilterSearchInput,
  TopBar,
  Breadcrumb,
  VStack,
  HStack,
  ContextMenu,
  TabBar,
  Badge,
  PageShell,
  PageHeader,
  ListToolbar,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { DomainCreateDrawer } from '@/components/DomainCreateDrawer';
import { InlineCopyId } from '@/components/InlineCopyId';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Type Definitions
   ---------------------------------------- */
interface Domain {
  id: string;
  name: string;
  description: string;
  storageType: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */
const mockDomains: Domain[] = [
  {
    id: 'domain-001',
    name: 'domain_name',
    description: '-',
    storageType: 'Thaki storage',
    createdAt: 'Sep 12, 2026 08:22:15',
  },
  {
    id: 'domain-002',
    name: 'production_domain',
    description: 'Production environment',
    storageType: 'Thaki storage',
    createdAt: 'Aug 15, 2026 10:45:33',
  },
  {
    id: 'domain-003',
    name: 'staging_domain',
    description: 'Staging environment',
    storageType: 'Thaki storage',
    createdAt: 'Jul 20, 2026 14:18:42',
  },
  {
    id: 'domain-004',
    name: 'development_domain',
    description: 'Development environment',
    storageType: 'Thaki storage',
    createdAt: 'Jun 10, 2026 09:32:28',
  },
  {
    id: 'domain-005',
    name: 'testing_domain',
    description: 'Testing domain',
    storageType: 'Thaki storage',
    createdAt: 'Sep 1, 2026 16:52:07',
  },
  {
    id: 'domain-006',
    name: 'qa_domain',
    description: 'QA testing',
    storageType: 'Thaki storage',
    createdAt: 'Aug 25, 2026 11:15:44',
  },
  {
    id: 'domain-007',
    name: 'sandbox_domain',
    description: 'Sandbox environment',
    storageType: 'Thaki storage',
    createdAt: 'Sep 10, 2026 13:38:21',
  },
  {
    id: 'domain-008',
    name: 'demo_domain',
    description: 'Demo environment',
    storageType: 'Thaki storage',
    createdAt: 'Jul 5, 2026 10:22:55',
  },
  {
    id: 'domain-009',
    name: 'internal_domain',
    description: 'Internal domain',
    storageType: 'Thaki storage',
    createdAt: 'Jun 1, 2026 15:48:12',
  },
  {
    id: 'domain-010',
    name: 'external_domain',
    description: 'External access domain',
    storageType: 'Thaki storage',
    createdAt: 'May 15, 2026 08:35:39',
  },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'description', label: 'Description', type: 'text' },
  { id: 'createdAt', label: 'Created at', type: 'text' },
];

/* ----------------------------------------
   IAM Domains Page
   ---------------------------------------- */
export default function IAMDomainsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const itemsPerPage = 10;

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Domains');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filteredDomains = useMemo(() => {
    return mockDomains.filter((domain) => {
      return appliedFilters.every((filter) => {
        const value = String(domain[filter.fieldId as keyof Domain] ?? '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [appliedFilters]);

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
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <VStack gap={0.5} align="start">
          <span className="text-body-md text-[var(--color-text-default)]">{row.name}</span>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.id}>
              ID : {row.id}
            </span>
            <InlineCopyId value={row.id} />
          </span>
        </VStack>
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
      key: 'storageType',
      label: 'Storage type',
      flex: 1,
      minWidth: 140,
      sortable: true,
      render: (value: string) => (
        <Badge theme="white" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <HStack gap={1} align="center" justify="center">
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
            title="Open console"
            aria-label="Open console"
            onClick={() => console.log('Open console')}
          >
            <ArrowRightLeft
              size={14}
              strokeWidth={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        </HStack>
      ),
    },
  ];

  return (
    <>
      <PageShell
        sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
        sidebarWidth={sidebarWidth}
        tabBar={
          <TabBar
            tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
          />
        }
        topBar={
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            showNavigation
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={<Breadcrumb items={[{ label: 'Domains' }]} />}
          />
        }
        contentClassName="pt-4 px-8 pb-6"
      >
        <VStack gap={3}>
          <PageHeader
            title="Domains"
            actions={
              <Button variant="primary" size="md" onClick={() => setIsCreateDrawerOpen(true)}>
                Create domain
              </Button>
            }
          />

          {/* Table Content */}
          <VStack gap={3} className="w-full">
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <FilterSearchInput
                    filters={filterFields}
                    appliedFilters={appliedFilters}
                    onFiltersChange={setAppliedFilters}
                    placeholder="Search domains by attributes"
                    size="sm"
                    className="w-[var(--search-input-width)]"
                    hideAppliedFilters
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconDownload size={12} />}
                    aria-label="Download"
                    onClick={() => console.log('Download')}
                  />
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showSettings
              totalItems={filteredDomains.length}
            />

            {/* Table */}
            <Table<Domain>
              columns={columns}
              data={paginatedDomains}
              rowKey="id"
              emptyMessage="No domains found"
              loading={loading}
            />
          </VStack>
        </VStack>
      </PageShell>

      {/* Create Domain Drawer */}
      <DomainCreateDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
    </>
  );
}
