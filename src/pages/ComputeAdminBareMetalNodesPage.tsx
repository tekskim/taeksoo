import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  StatusIndicator,
  Badge,
  PageShell,
  PageHeader,
  type TableColumn,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { IconDownload, IconCirclePlus } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

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
    name: 'bm-node-01',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 64,
    ram: '256GiB',
    disk: '4TiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345679',
    name: 'bm-node-02',
    status: 'active',
    tenant: { id: 'a10001', name: 'acme-corp' },
    powerState: 'Power On',
    maintained: true,
    cpu: 48,
    ram: '192GiB',
    disk: '2TiB',
    gpu: 'NVIDIA A100',
    npu: null,
  },
  {
    id: '12345680',
    name: 'bm-compute-03',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: false,
    cpu: 96,
    ram: '512GiB',
    disk: '8TiB',
    gpu: 'NVIDIA H100',
    npu: null,
  },
  {
    id: '12345681',
    name: 'bm-storage-04',
    status: 'maintenance',
    tenant: null,
    powerState: 'Power Off',
    maintained: true,
    cpu: 16,
    ram: '64GiB',
    disk: '12TiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345682',
    name: 'bm-edge-05',
    status: 'error',
    tenant: null,
    powerState: 'Power On',
    maintained: false,
    cpu: 8,
    ram: '32GiB',
    disk: '500GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345683',
    name: 'bm-gpu-06',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2TiB',
    gpu: 'NVIDIA A100',
    npu: null,
  },
  {
    id: '12345684',
    name: 'bm-hpc-07',
    status: 'active',
    tenant: { id: 'b20002', name: 'research-lab' },
    powerState: 'Power On',
    maintained: true,
    cpu: 128,
    ram: '1TiB',
    disk: '4TiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345685',
    name: 'bm-test-08',
    status: 'available',
    tenant: null,
    powerState: 'Power Off',
    maintained: true,
    cpu: 16,
    ram: '64GiB',
    disk: '1TiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345686',
    name: 'bm-legacy-09',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 24,
    ram: '96GiB',
    disk: '1.5TiB',
    gpu: null,
    npu: 'K-200',
  },
  {
    id: '12345687',
    name: 'bm-compute-10',
    status: 'deploying',
    tenant: { id: 'c30003', name: 'data-platform' },
    powerState: 'Power On',
    maintained: false,
    cpu: 56,
    ram: '256GiB',
    disk: '3TiB',
    gpu: null,
    npu: null,
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'status',
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
    id: 'powerState',
    label: 'Power State',
    type: 'select',
    options: [
      { value: 'Power On', label: 'Power On' },
      { value: 'Power Off', label: 'Power Off' },
    ],
  },
];

export function ComputeAdminBareMetalNodesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
        const value = String(node[filter.fieldId as keyof BareMetalNode] || '').toLowerCase();
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
          <StatusIndicator layout="icon-only" status={getStatusIndicator(row.status)} />
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
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
              <span className="truncate" title={row.id}>
                ID : {row.id.slice(0, 8)}
              </span>
              <InlineCopyId value={row.id} />
            </span>
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
                className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                {row.tenant.name}
              </Link>
              <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
                <span className="truncate" title={row.tenant.id}>
                  ID : {row.tenant.id.slice(0, 8)}
                </span>
                <InlineCopyId value={row.tenant.id} />
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
        width: '110px',
        align: 'center',
        sticky: 'right',
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Bare Metal Nodes' }]} />}
        />
      }
    >
      <VStack gap={3}>
        <PageHeader title="Bare Metal Nodes" />

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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => setIsPreferencesOpen(true)}
          totalItems={filteredItems.length}
        />

        {/* Table */}
        <Table<BareMetalNode>
          columns={visibleColumns}
          data={paginatedItems}
          rowKey="id"
          emptyMessage="No bare metal nodes found"
          loading={loading}
        />
      </VStack>

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

export default ComputeAdminBareMetalNodesPage;
