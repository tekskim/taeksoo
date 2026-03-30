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
  ConfirmModal,
  PageShell,
  PageHeader,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
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

export function ComputeAdminInstanceTemplatesPage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter templates by search
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

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
  }, [templates, appliedFilters]);

  const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage);

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

  // Get current page IDs for "select all" checkbox state
  const currentPageIds = filteredTemplates
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((t) => t.id);
  const allCurrentPageSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedTemplates.includes(id));
  const someCurrentPageSelected = currentPageIds.some((id) => selectedTemplates.includes(id));

  // Table columns
  const columns: TableColumn<InstanceTemplate>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/compute-admin/instance-templates/${row.id}`}
          className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
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
      sortable: true,
    },
    {
      key: 'flavor',
      label: 'Created at',
      flex: 1,
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
      sidebar={<ComputeAdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Instance templates' },
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
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader
          title="Instance templates"
          actions={
            <Button size="md" onClick={() => navigate('/compute-admin/instance-templates/create')}>
              Create template
            </Button>
          }
        />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search template by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => setIsPreferencesOpen(true)}
          totalItems={filteredTemplates.length}
          selectedCount={selectedTemplates.length}
        />

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

export default ComputeAdminInstanceTemplatesPage;
