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
  Tabs,
  TabList,
  Tab,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  Checkbox,
  type TableColumn,
  type ContextMenuItem,
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
import { Link } from 'react-router-dom';

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
  { id: 'tpl-001', name: 'hj-small', image: '-', flavor: '2025-01-03', vcpu: 8, ram: '16GiB', disk: '10GiB', network: 'in-net', floatingIp: 'None', access: 'Personal', favorite: true },
  { id: 'tpl-002', name: 'web-server-template', image: '-', flavor: '2025-01-02', vcpu: 16, ram: '32GiB', disk: '50GiB', network: 'public-net', floatingIp: 'Auto', access: 'Project', favorite: true },
  { id: 'tpl-003', name: 'db-template', image: '-', flavor: '2024-12-28', vcpu: 32, ram: '64GiB', disk: '200GiB', network: 'db-net', floatingIp: 'None', access: 'Personal', favorite: false },
  { id: 'tpl-004', name: 'gpu-ml-template', image: '-', flavor: '2024-12-25', vcpu: 16, ram: '128GiB', disk: '500GiB', network: 'ml-net', floatingIp: 'Auto', access: 'Public', favorite: true },
  { id: 'tpl-005', name: 'minimal-template', image: '-', flavor: '2024-12-20', vcpu: 2, ram: '4GiB', disk: '10GiB', network: 'in-net', floatingIp: 'None', access: 'Personal', favorite: false },
  { id: 'tpl-006', name: 'k8s-worker', image: '-', flavor: '2024-12-18', vcpu: 8, ram: '16GiB', disk: '100GiB', network: 'k8s-net', floatingIp: 'None', access: 'Project', favorite: true },
  { id: 'tpl-007', name: 'k8s-master', image: '-', flavor: '2024-12-18', vcpu: 4, ram: '8GiB', disk: '50GiB', network: 'k8s-net', floatingIp: 'Auto', access: 'Project', favorite: true },
  { id: 'tpl-008', name: 'dev-environment', image: '-', flavor: '2024-12-15', vcpu: 4, ram: '8GiB', disk: '30GiB', network: 'dev-net', floatingIp: 'Auto', access: 'Personal', favorite: false },
  { id: 'tpl-009', name: 'monitoring-stack', image: '-', flavor: '2024-12-10', vcpu: 8, ram: '16GiB', disk: '100GiB', network: 'monitor-net', floatingIp: 'Auto', access: 'Public', favorite: true },
  { id: 'tpl-010', name: 'cache-server', image: '-', flavor: '2024-12-05', vcpu: 4, ram: '32GiB', disk: '20GiB', network: 'cache-net', floatingIp: 'None', access: 'Project', favorite: false },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function InstanceTemplatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
    { id: 'flavor', label: 'Created At', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

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

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.image.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [templates, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t))
    );
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
  const tabCounts = useMemo(() => ({
    favorites: templates.filter((t) => t.favorite).length,
    personal: templates.filter((t) => t.access === 'Personal').length,
    project: templates.filter((t) => t.access === 'Project').length,
    public: templates.filter((t) => t.access === 'Public').length,
    all: templates.length,
  }), [templates]);

  // Get current page IDs for "select all" checkbox state
  const currentPageIds = filteredTemplates
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((t) => t.id);
  const allCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedTemplates.includes(id));
  const someCurrentPageSelected = currentPageIds.some((id) => selectedTemplates.includes(id));

  // Table columns
  const columns: TableColumn<InstanceTemplate>[] = [
    {
      key: 'favorite',
      label: '',
      width: '48px',
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
            <IconStarFilled size={16} className="text-yellow-400" />
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
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 whitespace-nowrap">
          <Link
            to={`/compute/instance-templates/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'image',
      label: 'Description',
      flex: 1,
      sortable: true,
    },
    {
      key: 'flavor',
      label: 'Created At',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'create-instance',
            label: 'Create Instance',
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
            <ContextMenu items={menuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig
      .filter((col) => col.visible)
      .map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<InstanceTemplate> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
        }`}
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
          showAddButton={true}
          showWindowControls={true}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Instance Templates' },
              ]}
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
        {/* Page Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Instance Templates
              </h1>
              <Button>
                Create Template
              </Button>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
              <TabList>
                <Tab value="favorites">Current Tenant</Tab>
                <Tab value="personal">Public</Tab>
              </TabList>
            </Tabs>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find Template with filters"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
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
        </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Template"
        description="Are you sure you want to delete this template? This action cannot be undone."
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
    </div>
  );
}

export default InstanceTemplatesPage;

