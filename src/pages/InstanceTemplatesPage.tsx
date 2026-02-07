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
  Tabs,
  TabList,
  Tab,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type AccessType = 'Personal' | 'Project' | 'Public';

interface InstanceTemplate {
  id: string;
  name: string;
  image: string;
  flavor: string;
  vcpu: number;
  ram: string;
  disk: string;
  network: string;
  floatingIp: string;
  access: AccessType;
  favorite: boolean;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTemplates: InstanceTemplate[] = [
  {
    id: 'tpl-001',
    name: 'hj-small',
    image: '-',
    flavor: 'Jan 3, 2025',
    vcpu: 8,
    ram: '16GiB',
    disk: '10GiB',
    network: 'in-net',
    floatingIp: 'None',
    access: 'Personal',
    favorite: true,
  },
  {
    id: 'tpl-002',
    name: 'web-server-template',
    image: '-',
    flavor: 'Jan 2, 2025',
    vcpu: 16,
    ram: '32GiB',
    disk: '50GiB',
    network: 'public-net',
    floatingIp: 'Auto',
    access: 'Project',
    favorite: true,
  },
  {
    id: 'tpl-003',
    name: 'db-template',
    image: '-',
    flavor: 'Dec 28, 2024',
    vcpu: 32,
    ram: '64GiB',
    disk: '200GiB',
    network: 'db-net',
    floatingIp: 'None',
    access: 'Personal',
    favorite: false,
  },
  {
    id: 'tpl-004',
    name: 'gpu-ml-template',
    image: '-',
    flavor: 'Dec 25, 2024',
    vcpu: 16,
    ram: '128GiB',
    disk: '500GiB',
    network: 'ml-net',
    floatingIp: 'Auto',
    access: 'Public',
    favorite: true,
  },
  {
    id: 'tpl-005',
    name: 'minimal-template',
    image: '-',
    flavor: 'Dec 20, 2024',
    vcpu: 2,
    ram: '4GiB',
    disk: '10GiB',
    network: 'in-net',
    floatingIp: 'None',
    access: 'Personal',
    favorite: false,
  },
  {
    id: 'tpl-006',
    name: 'k8s-worker',
    image: '-',
    flavor: 'Dec 18, 2024',
    vcpu: 8,
    ram: '16GiB',
    disk: '100GiB',
    network: 'k8s-net',
    floatingIp: 'None',
    access: 'Project',
    favorite: true,
  },
  {
    id: 'tpl-007',
    name: 'k8s-master',
    image: '-',
    flavor: 'Dec 18, 2024',
    vcpu: 4,
    ram: '8GiB',
    disk: '50GiB',
    network: 'k8s-net',
    floatingIp: 'Auto',
    access: 'Project',
    favorite: true,
  },
  {
    id: 'tpl-008',
    name: 'dev-environment',
    image: '-',
    flavor: 'Dec 15, 2024',
    vcpu: 4,
    ram: '8GiB',
    disk: '30GiB',
    network: 'dev-net',
    floatingIp: 'Auto',
    access: 'Personal',
    favorite: false,
  },
  {
    id: 'tpl-009',
    name: 'monitoring-stack',
    image: '-',
    flavor: 'Dec 10, 2024',
    vcpu: 8,
    ram: '16GiB',
    disk: '100GiB',
    network: 'monitor-net',
    floatingIp: 'Auto',
    access: 'Public',
    favorite: true,
  },
  {
    id: 'tpl-010',
    name: 'cache-server',
    image: '-',
    flavor: 'Dec 5, 2024',
    vcpu: 4,
    ram: '32GiB',
    disk: '20GiB',
    network: 'cache-net',
    floatingIp: 'None',
    access: 'Project',
    favorite: false,
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'network', label: 'Network', type: 'text' },
  {
    key: 'access',
    label: 'Access',
    type: 'select',
    options: [
      { value: 'Personal', label: 'Personal' },
      { value: 'Project', label: 'Project' },
      { value: 'Public', label: 'Public' },
    ],
  },
];

export function InstanceTemplatesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('favorites');
  const [templates, setTemplates] = useState(mockTemplates);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<InstanceTemplate | null>(null);

  // Selection state
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'favorite', label: '', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'image', label: 'Description', visible: true },
    { id: 'flavor', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Handle delete template
  const handleDeleteClick = (template: InstanceTemplate) => {
    setTemplateToDelete(template);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setTemplateToDelete(null);
  };

  // Filter templates by tab and search
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Filter by tab
    switch (activeTab) {
      case 'favorites':
        filtered = filtered.filter((t) => t.favorite);
        break;
      case 'personal':
        filtered = filtered.filter((t) => t.access === 'Personal');
        break;
      case 'project':
        filtered = filtered.filter((t) => t.access === 'Project');
        break;
      case 'public':
        filtered = filtered.filter((t) => t.access === 'Public');
        break;
      // 'all' shows everything
    }

    // Filter by applied filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((t) => {
        return appliedFilters.every((filter) => {
          const value = String(t[filter.field as keyof InstanceTemplate] || '').toLowerCase();
          return value.includes(filter.value.toLowerCase());
        });
      });
    }

    return filtered;
  }, [templates, activeTab, appliedFilters]);

  const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t)));
  };

  // Selection handlers
  const toggleSelection = (id: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    const currentPageIds = filteredTemplates
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      .map((t) => t.id);

    const allSelected = currentPageIds.every((id) => selectedTemplates.includes(id));

    if (allSelected) {
      setSelectedTemplates((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedTemplates((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  // Bulk delete handler
  const handleBulkDelete = () => {
    setTemplates((prev) => prev.filter((t) => !selectedTemplates.includes(t.id)));
    setSelectedTemplates([]);
  };

  // Tab counts
  const tabCounts = useMemo(
    () => ({
      favorites: templates.filter((t) => t.favorite).length,
      personal: templates.filter((t) => t.access === 'Personal').length,
      project: templates.filter((t) => t.access === 'Project').length,
      public: templates.filter((t) => t.access === 'Public').length,
      all: templates.length,
    }),
    [templates]
  );

  // Get current page IDs for "select all" checkbox state
  const currentPageIds = filteredTemplates
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((t) => t.id);
  const allCurrentPageSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedTemplates.includes(id));
  const someCurrentPageSelected = currentPageIds.some((id) => selectedTemplates.includes(id));

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<InstanceTemplate>[] = [
    {
      key: 'favorite',
      label: '',
      width: fixedColumns.favorite,
      align: 'center',
      headerRender: () => (
        <div className="flex items-center justify-center w-full">
          <IconStar size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </div>
      ),
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(row.id);
          }}
          className="p-1 rounded hover:bg-[var(--color-surface-subtle)] transition-colors"
        >
          {row.favorite ? (
            <IconStarFilled size={16} className="text-[var(--primitive-color-yellow400)]" />
          ) : (
            <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
          )}
        </button>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/compute/instance-templates/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'image',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    {
      key: 'flavor',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'create-instance',
            label: 'Create instance',
            onClick: () => console.log('Create instance from template:', row.id),
          },
          {
            id: 'duplicate',
            label: 'Duplicate',
            onClick: () => console.log('Duplicate template:', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => handleDeleteClick(row),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<InstanceTemplate> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />}
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
            <Breadcrumb
              items={[{ label: 'Proj-1', href: '/project' }, { label: 'Instance templates' }]}
            />
          }
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
        {/* Page Header */}
        <PageHeader
          title="Instance templates"
          actions={
            <Button size="md" onClick={() => navigate('/compute/instance-templates/create')}>
              Create template
            </Button>
          }
        />

        {/* Category Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="favorites">Current tenant</Tab>
            <Tab value="personal">Public</Tab>
          </TabList>
        </Tabs>

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search template by attributes"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} />}
                aria-label="Download"
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} />}
                disabled={selectedTemplates.length === 0}
                onClick={handleBulkDelete}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        {/* Pagination */}
        {filteredTemplates.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            onSettingsClick={() => setIsPreferencesOpen(true)}
            totalItems={filteredTemplates.length}
            selectedCount={selectedTemplates.length}
          />
        )}

        {/* Template Table */}
        <Table<InstanceTemplate>
          columns={visibleColumns}
          data={filteredTemplates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
          rowKey="id"
          emptyMessage="No templates found"
          selectable
          selectedKeys={selectedTemplates}
          onSelectionChange={setSelectedTemplates}
        />
      </VStack>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete template"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Template name"
        infoValue={templateToDelete?.name}
      />

      {/* View Preferences Drawer */}
      <ViewPreferencesDrawer
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columnConfig}
        defaultColumns={defaultColumnConfig}
        onColumnsChange={setColumnConfig}
      />
    </PageShell>
  );
}

export default InstanceTemplatesPage;
