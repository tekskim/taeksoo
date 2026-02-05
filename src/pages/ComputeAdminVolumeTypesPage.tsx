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
  Tabs,
  TabList,
  Tab,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface VolumeType {
  id: string;
  name: string;
  description: string;
  qosSpec: string | null;
  qosSpecId: string | null;
  encryption: string;
  isPublic: boolean;
}

interface QoSSpec {
  id: string;
  name: string;
  consumer: string;
  specs: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumeTypes: VolumeType[] = [
  {
    id: '12345678',
    name: 'type',
    description: '-',
    qosSpec: 'spec',
    qosSpecId: '12345678',
    encryption: 'luks',
    isPublic: true,
  },
  {
    id: 'vt-002',
    name: 'ssd-performance',
    description: 'High performance SSD storage',
    qosSpec: 'high-iops',
    qosSpecId: 'qos-001',
    encryption: 'luks',
    isPublic: true,
  },
  {
    id: 'vt-003',
    name: 'hdd-standard',
    description: 'Standard HDD storage',
    qosSpec: null,
    qosSpecId: null,
    encryption: 'plain',
    isPublic: true,
  },
  {
    id: 'vt-004',
    name: 'nvme-ultra',
    description: 'Ultra-fast NVMe storage',
    qosSpec: 'ultra-perf',
    qosSpecId: 'qos-002',
    encryption: 'luks',
    isPublic: false,
  },
  {
    id: 'vt-005',
    name: 'encrypted-secure',
    description: 'Encrypted secure storage',
    qosSpec: 'standard',
    qosSpecId: 'qos-003',
    encryption: 'luks2',
    isPublic: true,
  },
];

const mockQoSSpecs: QoSSpec[] = [
  {
    id: 'qos-001',
    name: 'high-iops',
    consumer: 'front-end',
    specs: 'read_iops_sec: 10000, write_iops_sec: 5000',
  },
  {
    id: 'qos-002',
    name: 'ultra-perf',
    consumer: 'back-end',
    specs: 'read_iops_sec: 50000, write_iops_sec: 25000',
  },
  {
    id: 'qos-003',
    name: 'standard',
    consumer: 'front-end',
    specs: 'read_iops_sec: 1000, write_iops_sec: 500',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration for Volume Types
const volumeTypeFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'description', label: 'Description', type: 'text' },
  { id: 'encryption', label: 'Encryption', type: 'text' },
  {
    id: 'isPublic',
    label: 'Public',
    type: 'select',
    options: [
      { value: 'true', label: 'On' },
      { value: 'false', label: 'Off' },
    ],
  },
];

// Filter fields configuration for QoS Specs
const qosSpecFilterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'consumer', label: 'Consumer', type: 'text' },
];

export function ComputeAdminVolumeTypesPage() {
  const [selectedVolumeTypes, setSelectedVolumeTypes] = useState<string[]>([]);
  const [selectedQoSSpecs, setSelectedQoSSpecs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [volumeTypes, setVolumeTypes] = useState(mockVolumeTypes);
  const [qosSpecs, setQoSSpecs] = useState(mockQoSSpecs);
  const [activeTab, setActiveTab] = useState<string>('volume-types');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [volumeTypeToDelete, setVolumeTypeToDelete] = useState<VolumeType | null>(null);
  const [qosSpecToDelete, setQoSSpecToDelete] = useState<QoSSpec | null>(null);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config for Volume Types
  const defaultVolumeTypeColumnConfig: ColumnConfig[] = [
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'description', label: 'Description', visible: true },
    { id: 'qosSpec', label: 'Associated QoS Spec', visible: true },
    { id: 'encryption', label: 'Encryption', visible: true },
    { id: 'isPublic', label: 'Public', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultVolumeTypeColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle delete volume type
  const handleDeleteVolumeTypeClick = (volumeType: VolumeType) => {
    setVolumeTypeToDelete(volumeType);
    setDeleteModalOpen(true);
  };

  const handleDeleteQoSSpecClick = (qosSpec: QoSSpec) => {
    setQoSSpecToDelete(qosSpec);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (volumeTypeToDelete) {
      setVolumeTypes((prev) => prev.filter((vt) => vt.id !== volumeTypeToDelete.id));
      setVolumeTypeToDelete(null);
    }
    if (qosSpecToDelete) {
      setQoSSpecs((prev) => prev.filter((qs) => qs.id !== qosSpecToDelete.id));
      setQoSSpecToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setVolumeTypeToDelete(null);
    setQoSSpecToDelete(null);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setAppliedFilters([]);
  };

  // Filter volume types
  const filteredVolumeTypes = useMemo(() => {
    if (appliedFilters.length === 0) return volumeTypes;

    return volumeTypes.filter((vt) => {
      return appliedFilters.every((filter) => {
        const value = vt[filter.fieldId as keyof VolumeType];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        if (typeof value === 'boolean') {
          return String(value) === filter.value;
        }
        return true;
      });
    });
  }, [volumeTypes, appliedFilters]);

  // Filter QoS specs
  const filteredQoSSpecs = useMemo(() => {
    if (appliedFilters.length === 0) return qosSpecs;

    return qosSpecs.filter((qs) => {
      return appliedFilters.every((filter) => {
        const value = qs[filter.fieldId as keyof QoSSpec];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });
  }, [qosSpecs, appliedFilters]);

  // Pagination for Volume Types
  const totalVolumeTypePages = Math.ceil(filteredVolumeTypes.length / rowsPerPage);
  const paginatedVolumeTypes = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredVolumeTypes.slice(start, end);
  }, [filteredVolumeTypes, currentPage, rowsPerPage]);

  // Pagination for QoS Specs
  const totalQoSSpecPages = Math.ceil(filteredQoSSpecs.length / rowsPerPage);
  const paginatedQoSSpecs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredQoSSpecs.slice(start, end);
  }, [filteredQoSSpecs, currentPage, rowsPerPage]);

  // Table columns for Volume Types
  const volumeTypeColumns: TableColumn<VolumeType>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/volume-types/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.id}</span>
        </div>
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
      key: 'qosSpec',
      label: 'Associated QoS Spec',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: false,
      render: (_, row) =>
        row.qosSpec ? (
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/compute-admin/qos-specs/${row.qosSpecId}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.qosSpec}
            </Link>
            <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.qosSpecId}</span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
    {
      key: 'encryption',
      label: 'Encryption',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
    },
    {
      key: 'isPublic',
      label: 'Public',
      flex: 1,
      minWidth: columnMinWidths.access,
      sortable: false,
      render: (value: boolean) => <span>{value ? 'On' : 'Off'}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => console.log('Edit', row.name),
          },
          {
            id: 'manage-qos-spec',
            label: 'Manage QoS spec',
            onClick: () => console.log('Manage QoS spec', row.name),
          },
          {
            id: 'manage-access',
            label: 'Manage access',
            onClick: () => console.log('Manage access', row.name),
          },
          {
            id: 'create-encryption',
            label: 'Create encryption',
            onClick: () => console.log('Create encryption', row.name),
          },
          {
            id: 'delete-encryption',
            label: 'Delete encryption',
            onClick: () => console.log('Delete encryption', row.name),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => handleDeleteVolumeTypeClick(row),
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

  // Table columns for QoS Specs
  const qosSpecColumns: TableColumn<QoSSpec>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/qos-specs/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'consumer',
      label: 'Consumer',
      flex: 1,
      sortable: true,
    },
    {
      key: 'specs',
      label: 'Specs',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: false,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit',
            label: 'Edit Consumer',
            onClick: () => console.log('Edit Consumer', row.name),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => handleDeleteQoSSpecClick(row),
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

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (activeTab === 'volume-types' && selectedVolumeTypes.length > 0) {
      setVolumeTypes((prev) => prev.filter((vt) => !selectedVolumeTypes.includes(vt.id)));
      setSelectedVolumeTypes([]);
    } else if (activeTab === 'qos-specs' && selectedQoSSpecs.length > 0) {
      setQoSSpecs((prev) => prev.filter((qs) => !selectedQoSSpecs.includes(qs.id)));
      setSelectedQoSSpecs([]);
    }
  };

  const hasSelection =
    activeTab === 'volume-types' ? selectedVolumeTypes.length > 0 : selectedQoSSpecs.length > 0;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
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
            onTabReorder={moveTab}
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
                  { label: 'Compute Admin', href: '/compute-admin' },
                  { label: 'Volume Types' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={12} stroke={1} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">Volume Types</h1>
                <Button size="md">
                  {activeTab === 'volume-types' ? 'Create Volume Type' : 'Create QoS Spec'}
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onChange={handleTabChange} variant="underline" size="sm">
                <TabList>
                  <Tab value="volume-types">Volume Types</Tab>
                  <Tab value="qos-specs">QoS Specs</Tab>
                </TabList>
              </Tabs>

              {/* Content based on active tab */}
              {activeTab === 'volume-types' && (
                <VStack gap={3} align="stretch">
                  {/* Toolbar */}
                  <ListToolbar
                    primaryActions={
                      <ListToolbar.Actions>
                        <FilterSearchInput
                          filters={volumeTypeFilterFields}
                          appliedFilters={appliedFilters}
                          onFiltersChange={setAppliedFilters}
                          placeholder="Search volume types by attributes"
                          size="sm"
                          className="w-[var(--search-input-width)]"
                          hideAppliedFilters
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          iconOnly
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
                          disabled={selectedVolumeTypes.length === 0}
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
                    totalPages={totalVolumeTypePages}
                    totalItems={filteredVolumeTypes.length}
                    selectedCount={selectedVolumeTypes.length}
                    onPageChange={setCurrentPage}
                    showSettings
                    onSettingsClick={() => setIsPreferencesOpen(true)}
                  />

                  {/* Table */}
                  <Table
                    columns={volumeTypeColumns}
                    data={paginatedVolumeTypes}
                    rowKey="id"
                    selectable
                    selectedKeys={selectedVolumeTypes}
                    onSelectionChange={setSelectedVolumeTypes}
                  />
                </VStack>
              )}

              {activeTab === 'qos-specs' && (
                <VStack gap={3} align="stretch">
                  {/* Toolbar */}
                  <ListToolbar
                    primaryActions={
                      <ListToolbar.Actions>
                        <FilterSearchInput
                          filters={qosSpecFilterFields}
                          appliedFilters={appliedFilters}
                          onFiltersChange={setAppliedFilters}
                          placeholder="Search QoS specs by attributes"
                          size="sm"
                          className="w-[var(--search-input-width)]"
                          hideAppliedFilters
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          iconOnly
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
                          disabled={selectedQoSSpecs.length === 0}
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
                    totalPages={totalQoSSpecPages}
                    totalItems={filteredQoSSpecs.length}
                    selectedCount={selectedQoSSpecs.length}
                    onPageChange={setCurrentPage}
                    showSettings
                    onSettingsClick={() => setIsPreferencesOpen(true)}
                  />

                  {/* Table */}
                  <Table
                    columns={qosSpecColumns}
                    data={paginatedQoSSpecs}
                    rowKey="id"
                    selectable
                    selectedKeys={selectedQoSSpecs}
                    onSelectionChange={setSelectedQoSSpecs}
                  />
                </VStack>
              )}
            </VStack>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={volumeTypeToDelete ? 'Delete Volume Type' : 'Delete QoS Spec'}
        message="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* View Preferences Drawer */}
      <ViewPreferencesDrawer
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        columns={columnConfig}
        defaultColumns={defaultVolumeTypeColumnConfig}
        onColumnsChange={setColumnConfig}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

export default ComputeAdminVolumeTypesPage;
