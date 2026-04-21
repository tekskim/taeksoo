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
import { IconDownload, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type NodeStatus = 'active' | 'available' | 'deploying' | 'deploy_failed' | 'error' | 'maintenance';

interface BareMetalNode {
  id: string;
  serial: string;
  status: NodeStatus;
  cpu: number;
  ram: string;
  disk: string;
  gpu: string | null;
  assignedTenant: { id: string; name: string } | null;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockBareMetalNodes: BareMetalNode[] = [
  {
    id: '12345678',
    serial: 'node-bm-001',
    status: 'available',
    cpu: 32,
    ram: '128GiB',
    disk: '2TB',
    gpu: null,
    assignedTenant: null,
  },
  {
    id: '12345679',
    serial: 'node-bm-002',
    status: 'active',
    cpu: 64,
    ram: '256GiB',
    disk: '4TB',
    gpu: 'NVIDIA A100',
    assignedTenant: { id: 'a1b2c3d4', name: 'acme-corp' },
  },
  {
    id: '12345680',
    serial: 'node-bm-003',
    status: 'deploying',
    cpu: 32,
    ram: '128GiB',
    disk: '2TB',
    gpu: null,
    assignedTenant: null,
  },
  {
    id: '12345681',
    serial: 'node-bm-004',
    status: 'error',
    cpu: 48,
    ram: '192GiB',
    disk: '2TB',
    gpu: null,
    assignedTenant: null,
  },
  {
    id: '12345682',
    serial: 'node-bm-005',
    status: 'available',
    cpu: 32,
    ram: '128GiB',
    disk: '2TB',
    gpu: null,
    assignedTenant: null,
  },
  {
    id: '12345683',
    serial: 'node-bm-006',
    status: 'maintenance',
    cpu: 96,
    ram: '512GiB',
    disk: '8TB',
    gpu: 'NVIDIA H100',
    assignedTenant: null,
  },
  {
    id: '12345684',
    serial: 'node-bm-007',
    status: 'active',
    cpu: 32,
    ram: '128GiB',
    disk: '2TB',
    gpu: null,
    assignedTenant: { id: 'e5f6g7h8', name: 'research-lab' },
  },
  {
    id: '12345685',
    serial: 'node-bm-008',
    status: 'deploy_failed',
    cpu: 16,
    ram: '64GiB',
    disk: '1TB',
    gpu: null,
    assignedTenant: null,
  },
  {
    id: '12345686',
    serial: 'node-bm-009',
    status: 'available',
    cpu: 32,
    ram: '128GiB',
    disk: '2TB',
    gpu: null,
    assignedTenant: null,
  },
  {
    id: '12345687',
    serial: 'node-bm-010',
    status: 'active',
    cpu: 128,
    ram: '1TiB',
    disk: '4TB',
    gpu: 'NVIDIA A100',
    assignedTenant: { id: 'i9j0k1l2', name: 'data-platform' },
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

const filterFields: FilterField[] = [
  { id: 'serial', label: 'Serial', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'available', label: 'Available' },
      { value: 'deploying', label: 'Deploying' },
      { value: 'deploy_failed', label: 'Deploy Failed' },
      { value: 'error', label: 'Error' },
      { value: 'maintenance', label: 'Maintenance' },
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
    { id: 'serial', label: 'Serial', visible: true, locked: true },
    { id: 'cpu', label: 'CPU', visible: true },
    { id: 'ram', label: 'RAM', visible: true },
    { id: 'disk', label: 'Disk', visible: true },
    { id: 'gpu', label: 'GPU', visible: true },
    { id: 'assignedTenant', label: 'Assigned tenant', visible: true },
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

  const getStatusBadge = (
    status: NodeStatus
  ): { label: string; theme: 'green' | 'red' | 'white' } => {
    const map: Record<NodeStatus, { label: string; theme: 'green' | 'red' | 'white' }> = {
      active: { label: 'Active', theme: 'green' },
      available: { label: 'Available', theme: 'green' },
      deploying: { label: 'Deploying', theme: 'white' },
      deploy_failed: { label: 'Deploy Failed', theme: 'red' },
      error: { label: 'Error', theme: 'red' },
      maintenance: { label: 'Maintenance', theme: 'white' },
    };
    return map[status] || { label: status, theme: 'white' };
  };

  const columns: TableColumn<BareMetalNode>[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        flex: 1,
        render: (_, row) => {
          const { label, theme } = getStatusBadge(row.status);
          return (
            <Badge theme={theme} size="sm">
              {label}
            </Badge>
          );
        },
      },
      {
        key: 'serial',
        label: 'Serial',
        flex: 1,
        sortable: true,
        render: (_, row) => (
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-label-md text-[var(--color-text-default)]">{row.serial}</span>
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
        key: 'assignedTenant',
        label: 'Assigned tenant',
        flex: 1,
        sortable: true,
        render: (_, row) =>
          row.assignedTenant ? (
            <div className="flex flex-col gap-0.5 min-w-0">
              <Link
                to={`/compute-admin/tenants/${row.assignedTenant.id}`}
                className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                {row.assignedTenant.name}
              </Link>
              <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
                <span className="truncate" title={row.assignedTenant.id}>
                  ID : {row.assignedTenant.id.slice(0, 8)}
                </span>
                <InlineCopyId value={row.assignedTenant.id} />
              </span>
            </div>
          ) : (
            <span className="text-[var(--color-text-muted)]">-</span>
          ),
      },
      {
        key: 'actions',
        label: 'Action',
        width: fixedColumns.actions,
        align: 'center',
        sticky: 'right',
        render: (_, row) => (
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className="p-1 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors"
              aria-label={`Actions for ${row.serial}`}
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-muted)]"
              />
            </button>
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
          breadcrumb={<Breadcrumb items={[{ label: 'Bare metal nodes' }]} />}
        />
      }
    >
      <VStack gap={3}>
        <PageHeader title="Bare metal nodes" />

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
