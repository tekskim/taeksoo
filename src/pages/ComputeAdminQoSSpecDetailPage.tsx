import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  DetailHeader,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconTrash,
  IconEdit,
  IconBell,
  IconDownload,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface QoSSpecDetail {
  id: string;
  name: string;
  consumer: string;
}

interface ExtraSpec {
  id: string;
  parameter: string;
  value: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockQoSSpecDetails: Record<string, QoSSpecDetail> = {
  'qos-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'Spec',
    consumer: 'Frontend',
  },
  'qos-002': {
    id: 'qos-002',
    name: 'ultra-perf',
    consumer: 'back-end',
  },
  'qos-003': {
    id: 'qos-003',
    name: 'standard',
    consumer: 'front-end',
  },
};

const defaultQoSSpec: QoSSpecDetail = {
  id: 'unknown',
  name: 'Unknown Spec',
  consumer: '-',
};

// Generate mock extra specs
const generateExtraSpecs = (): ExtraSpec[] => {
  const specs = [
    { parameter: 'volume_backend_name', value: 'ceph-cinder-ssd' },
    { parameter: 'read_iops_sec', value: '10000' },
    { parameter: 'write_iops_sec', value: '5000' },
    { parameter: 'read_bytes_sec', value: '104857600' },
    { parameter: 'write_bytes_sec', value: '52428800' },
    { parameter: 'total_iops_sec', value: '15000' },
    { parameter: 'total_bytes_sec', value: '157286400' },
    { parameter: 'burst_iops', value: '20000' },
    { parameter: 'burst_bytes', value: '209715200' },
    { parameter: 'latency_target', value: '1ms' },
  ];

  return specs.map((spec, index) => ({
    id: `spec-${index + 1}`,
    ...spec,
  }));
};

const mockExtraSpecs = generateExtraSpecs();

/* ----------------------------------------
   QoS Spec Detail Page
   ---------------------------------------- */

export default function ComputeAdminQoSSpecDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('extra-specs');

  // Extra Specs state
  const [extraSpecs, setExtraSpecs] = useState<ExtraSpec[]>(mockExtraSpecs);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [specToDelete, setSpecToDelete] = useState<ExtraSpec | null>(null);

  // Get QoS spec data based on the ID
  const qosSpec = id && mockQoSSpecDetails[id] ? mockQoSSpecDetails[id] : defaultQoSSpec;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to QoS spec name
  useEffect(() => {
    if (qosSpec.name) {
      updateActiveTabLabel(qosSpec.name);
    }
  }, [qosSpec.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/compute-admin' },
    { label: 'Volume Types', href: '/compute-admin/volume-types' },
    { label: qosSpec.name },
  ];

  // Filter fields for search
  const filterFields: FilterField[] = [
    { key: 'parameter', label: 'Parameter', type: 'text' },
    { key: 'value', label: 'Value', type: 'text' },
  ];

  // Filter extra specs
  const filteredExtraSpecs = useMemo(() => {
    let result = extraSpecs;

    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter(
        (spec) =>
          spec.parameter.toLowerCase().includes(lowerSearch) ||
          spec.value.toLowerCase().includes(lowerSearch)
      );
    }

    appliedFilters.forEach((filter) => {
      result = result.filter((spec) => {
        const value = spec[filter.field as keyof ExtraSpec];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });

    return result;
  }, [extraSpecs, searchValue, appliedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredExtraSpecs.length / rowsPerPage);
  const paginatedSpecs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredExtraSpecs.slice(start, end);
  }, [filteredExtraSpecs, currentPage, rowsPerPage]);

  // Table columns for Extra Specs
  const extraSpecColumns: TableColumn<ExtraSpec>[] = [
    {
      key: 'parameter',
      label: 'Parameter',
      flex: 1,
      sortable: true,
    },
    {
      key: 'value',
      label: 'Value',
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
            id: 'edit',
            label: 'Edit',
            onClick: () => console.log('Edit', row.parameter),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => handleDeleteSpecClick(row),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click">
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

  // Handlers
  const handleDeleteSpecClick = (spec: ExtraSpec) => {
    setSpecToDelete(spec);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (specToDelete) {
      setExtraSpecs((prev) => prev.filter((s) => s.id !== specToDelete.id));
      setSelectedSpecs((prev) => prev.filter((id) => id !== specToDelete.id));
    }
    setDeleteModalOpen(false);
    setSpecToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedSpecs.length > 0) {
      setExtraSpecs((prev) => prev.filter((s) => !selectedSpecs.includes(s.id)));
      setSelectedSpecs([]);
    }
  };

  const hasSelection = selectedSpecs.length > 0;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
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
            onBack={() => navigate('/compute-admin/volume-types')}
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={8} className="min-w-[1176px]">
              {/* QoS Spec Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{qosSpec.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit Consumer
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard label="ID" value={qosSpec.id} copyable />
                  <DetailHeader.InfoCard label="Consumer" value={qosSpec.consumer} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* QoS Spec Tabs */}
              <div className="w-full">
                <Tabs
                  value={activeDetailTab}
                  onChange={setActiveDetailTab}
                  variant="underline"
                  size="sm"
                >
                  <TabList>
                    <Tab value="extra-specs">Extra Specs</Tab>
                  </TabList>
                </Tabs>

                {/* Extra Specs Tab Content */}
                {activeDetailTab === 'extra-specs' && (
                  <VStack gap={3} className="pt-6">
                    {/* Header with title and create button */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Extra Specs
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Create Extra Spec
                      </Button>
                    </div>

                    {/* Toolbar */}
                    <ListToolbar
                      primaryActions={
                        <ListToolbar.Actions>
                          <FilterSearchInput
                            placeholder="Search specs by attributes"
                            value={searchValue}
                            onChange={setSearchValue}
                            fields={filterFields}
                            appliedFilters={appliedFilters}
                            onApplyFilter={(filter) =>
                              setAppliedFilters((prev) => [...prev, filter])
                            }
                            onRemoveFilter={(field) =>
                              setAppliedFilters((prev) => prev.filter((f) => f.field !== field))
                            }
                            onClearFilters={() => setAppliedFilters([])}
                            className="w-[280px]"
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
                            disabled={!hasSelection}
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
                      totalItems={filteredExtraSpecs.length}
                      selectedCount={selectedSpecs.length}
                      onPageChange={setCurrentPage}
                    />

                    {/* Table */}
                    <Table
                      columns={extraSpecColumns}
                      data={paginatedSpecs}
                      rowKey="id"
                      selectable
                      selectedKeys={selectedSpecs}
                      onSelectionChange={setSelectedSpecs}
                      emptyMessage="No extra specs found"
                    />
                  </VStack>
                )}
              </div>
            </VStack>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Extra Spec"
        description={`Are you sure you want to delete the extra spec "${specToDelete?.parameter}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
