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
  StatusIndicator,
  Badge,
  type TableColumn,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { IconDownload, IconBell, IconCirclePlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type NodeStatus = 'active' | 'available' | 'deploying' | 'error' | 'maintenance';
type PowerState = 'Power On' | 'Power Off';

interface BareMetalNode {
  id: string;
  name: string;
  status: NodeStatus;
  tenant: { id: string; name: string } | null;
  powerState: PowerState;
  maintained: boolean;
  cpu: number;
  ram: string;
  disk: string;
  gpu: string | null;
  npu: string | null;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockBareMetalNodes: BareMetalNode[] = [
  {
    id: '12345678',
    name: 'node',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345679',
    name: 'node',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345680',
    name: 'node',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345681',
    name: 'node',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345682',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345683',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345684',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345685',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345686',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345687',
    name: 'node',
    status: 'deploying',
    tenant: { id: '12345678', name: 'tenant' },
    powerState: 'Power On',
    maintained: false,
    cpu: 32,
    ram: '128 GB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'available', label: 'Available' },
      { value: 'deploying', label: 'Deploying' },
      { value: 'error', label: 'Error' },
      { value: 'maintenance', label: 'Maintenance' },
    ],
  },
  {
    key: 'powerState',
    label: 'Power State',
    type: 'select',
    options: [
      { value: 'Power On', label: 'Power On' },
      { value: 'Power Off', label: 'Power Off' },
    ],
  },
];

export function ComputeAdminBareMetalNodesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nodes] = useState(mockBareMetalNodes);

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'tenant', label: 'Tenant', visible: true },
    { id: 'powerState', label: 'Power State', visible: true },
    { id: 'maintained', label: 'Maintained', visible: true },
    { id: 'cpu', label: 'CPU', visible: true },
    { id: 'ram', label: 'RAM', visible: true },
    { id: 'disk', label: 'Disk', visible: true },
    { id: 'gpu', label: 'GPU', visible: true },
    { id: 'npu', label: 'NPU', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const filteredItems = useMemo(() => {
    if (appliedFilters.length === 0) return nodes;
    return nodes.filter((node) => {
      return appliedFilters.every((filter) => {
        const value = String(node[filter.field as keyof BareMetalNode] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [nodes, appliedFilters]);

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredItems, currentPage, rowsPerPage]);

  const getStatusIndicator = (status: NodeStatus) => {
    const statusMap: Record<
      NodeStatus,
      'active' | 'building' | 'error' | 'pending' | 'maintenance'
    > = {
      active: 'active',
      available: 'pending',
      deploying: 'building',
      error: 'error',
      maintenance: 'maintenance',
    };
    return statusMap[status] || 'pending';
  };

  const columns: TableColumn<BareMetalNode>[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center',
        render: (_, row) => (
          <StatusIndicator status={getStatusIndicator(row.status)} layout="icon-only" />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        sortable: true,
        render: (_, row) => (
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute-admin/bare-metal-nodes/${row.id}`}
              className="font-medium text-[var(--color-text-default)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.id}</span>
          </div>
        ),
      },
      {
        key: 'tenant',
        label: 'Tenant',
        flex: 1,
        sortable: true,
        render: (_, row) =>
          row.tenant ? (
            <div className="flex flex-col gap-0.5 min-w-0">
              <Link
                to={`/compute-admin/tenants/${row.tenant.id}`}
                className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                {row.tenant.name}
              </Link>
              <span className="text-body-sm text-[var(--color-text-muted)]">
                ID: {row.tenant.id}
              </span>
            </div>
          ) : (
            <span className="text-[var(--color-text-muted)]">-</span>
          ),
      },
      {
        key: 'powerState',
        label: 'Power State',
        flex: 1,
        render: (value) => (
          <Badge variant={value === 'Power On' ? 'success' : 'default'} size="sm">
            {value}
          </Badge>
        ),
      },
      {
        key: 'maintained',
        label: 'Maintained',
        flex: 1,
        render: (value) => (
          <span className="text-[var(--color-text-default)]">{value ? 'Yes' : 'No'}</span>
        ),
      },
      {
        key: 'cpu',
        label: 'CPU',
        flex: 1,
        sortable: true,
        render: (value) => <span className="text-[var(--color-text-default)]">{value}</span>,
      },
      {
        key: 'ram',
        label: 'RAM',
        flex: 1,
        sortable: true,
        render: (value) => <span className="text-[var(--color-text-default)]">{value}</span>,
      },
      {
        key: 'disk',
        label: 'Disk',
        flex: 1,
        sortable: true,
        render: (value) => <span className="text-[var(--color-text-default)]">{value}</span>,
      },
      {
        key: 'gpu',
        label: 'GPU',
        flex: 1,
        sortable: true,
        render: (value) => <span className="text-[var(--color-text-default)]">{value || '-'}</span>,
      },
      {
        key: 'npu',
        label: 'NPU',
        flex: 1,
        sortable: true,
        render: (value) => <span className="text-[var(--color-text-default)]">{value || '-'}</span>,
      },
      {
        key: 'actions',
        label: 'Action',
        width: fixedColumns.actionWide,
        align: 'center',
        render: (_, row) => (
          <div onClick={(e) => e.stopPropagation()}>
            {row.tenant ? (
              <Button variant="secondary" size="sm">
                Release
              </Button>
            ) : (
              <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                Assign
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);
    const columnMap = new Map(columns.map((col) => [col.key, col]));
    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<BareMetalNode> => col !== undefined);
  }, [columnConfig, columns]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        <div className="shrink-0 bg-[var(--color-surface-default)]">
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
                  { label: 'Bare Metal Nodes' },
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

        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Bare Metal Nodes
                </h1>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-1">
                <FilterSearchInput
                  filters={filterFields}
                  appliedFilters={appliedFilters}
                  onFiltersChange={setAppliedFilters}
                  placeholder="Search bare metal nodes by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<IconDownload size={12} />}
                  aria-label="Download"
                />
              </div>

              {/* Pagination */}
              {filteredItems.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  onSettingsClick={() => setIsPreferencesOpen(true)}
                  totalItems={filteredItems.length}
                />
              )}

              {/* Table */}
              <Table<BareMetalNode>
                columns={visibleColumns}
                data={paginatedItems}
                rowKey="id"
                emptyMessage="No bare metal nodes found"
              />
            </VStack>
          </div>
        </div>
      </main>

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

export default ComputeAdminBareMetalNodesPage;
