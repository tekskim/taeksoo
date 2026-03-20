import { useState, useMemo } from 'react';
import {
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
  Button,
  ContextMenu,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  Popover,
  Badge,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconDownload, IconBell } from '@tabler/icons-react';
import { Link, useSearchParams } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type FlavorType = 'CPU' | 'GPU' | 'MPU' | 'Custom';
type AccessType = 'Public' | 'Private';

interface Flavor {
  id: string;
  name: string;
  category: string;
  vcpu: number;
  ram: string;
  ephemeralDisk: string;
  internalNetworkBandwidth: string;
  access: AccessType;
  metadata: string;
  type: FlavorType;
  // GPU-specific fields
  gpuType?: string;
  numaNodes?: string;
  cpuPolicy?: string;
  cpuThreadPolicy?: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFlavors: Flavor[] = [
  {
    id: 'flv-001',
    name: 'c5.large',
    category: 'Compute Optimized',
    vcpu: 2,
    ram: '16GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'CPU',
  },
  {
    id: 'flv-002',
    name: 'c5.xlarge',
    category: 'Compute Optimized',
    vcpu: 4,
    ram: '32GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'CPU',
  },
  {
    id: 'flv-003',
    name: 'm5.large',
    category: 'General Purpose',
    vcpu: 2,
    ram: '8GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'CPU',
  },
  {
    id: 'flv-004',
    name: 'm5.xlarge',
    category: 'General Purpose',
    vcpu: 4,
    ram: '16GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'CPU',
  },
  {
    id: 'flv-005',
    name: 'r5.large',
    category: 'Memory Optimized',
    vcpu: 2,
    ram: '16GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'CPU',
  },
  {
    id: 'flv-006',
    name: 'r5.xlarge',
    category: 'Memory Optimized',
    vcpu: 4,
    ram: '32GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'CPU',
  },
  {
    id: 'flv-007',
    name: 't3.micro',
    category: 'Burstable',
    vcpu: 2,
    ram: '1GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'CPU',
  },
  {
    id: 'flv-008',
    name: 't3.small',
    category: 'Burstable',
    vcpu: 2,
    ram: '2GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'CPU',
  },
  {
    id: 'flv-009',
    name: 'g4dn.xlarge',
    category: 'GPU Accelerated',
    vcpu: 4,
    ram: '16GiB',
    ephemeralDisk: '125GiB',
    internalNetworkBandwidth: '25Gbps',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'GPU',
    gpuType: 'NVIDIA T4',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
  },
  {
    id: 'flv-010',
    name: 'g4dn.2xlarge',
    category: 'GPU Accelerated',
    vcpu: 8,
    ram: '32GiB',
    ephemeralDisk: '225GiB',
    internalNetworkBandwidth: '25Gbps',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'GPU',
    gpuType: 'NVIDIA T4',
    numaNodes: '2',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Isolate',
  },
  {
    id: 'flv-011',
    name: 'p3.2xlarge',
    category: 'GPU Compute',
    vcpu: 8,
    ram: '61GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'GPU',
    gpuType: 'NVIDIA V100',
    numaNodes: '2',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Require',
  },
  {
    id: 'flv-012',
    name: 'inf1.xlarge',
    category: 'ML Inference',
    vcpu: 4,
    ram: '8GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '25Gbps',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'MPU',
    gpuType: 'AWS Inferentia',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
  },
  {
    id: 'flv-013',
    name: 'inf1.2xlarge',
    category: 'ML Inference',
    vcpu: 8,
    ram: '16GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '25Gbps',
    access: 'Public',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'MPU',
    gpuType: 'AWS Inferentia',
    numaNodes: '2',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Isolate',
  },
  {
    id: 'flv-014',
    name: 'custom.small',
    category: 'Custom',
    vcpu: 2,
    ram: '4GiB',
    ephemeralDisk: '20GiB',
    internalNetworkBandwidth: '-',
    access: 'Private',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'Custom',
  },
  {
    id: 'flv-015',
    name: 'custom.medium',
    category: 'Custom',
    vcpu: 4,
    ram: '8GiB',
    ephemeralDisk: '50GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Private',
    metadata: 'hw:cpu_cores=4,hw:mem_page_size=large,hw:numa_nodes=1,os:type=linux',
    type: 'Custom',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  {
    key: 'access',
    label: 'Access',
    type: 'select',
    options: [
      { value: 'Public', label: 'Public' },
      { value: 'Private', label: 'Private' },
    ],
  },
];

export function FlavorsPage() {
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'cpu';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Selection state
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'vcpu', label: 'vCPU', visible: true },
    { id: 'ram', label: 'RAM', visible: true },
    { id: 'ephemeralDisk', label: 'Root disk', visible: true },
    { id: 'access', label: 'Access', visible: true },
    { id: 'metadata', label: 'Metadata', visible: true },
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

  // Filter flavors by tab and search
  const filteredFlavors = useMemo(() => {
    let filtered = mockFlavors;

    // Filter by tab
    switch (activeTab) {
      case 'cpu':
        filtered = filtered.filter((f) => f.type === 'CPU');
        break;
      case 'gpu':
        filtered = filtered.filter((f) => f.type === 'GPU');
        break;
      case 'mpu':
        filtered = filtered.filter((f) => f.type === 'MPU');
        break;
      case 'custom':
        filtered = filtered.filter((f) => f.type === 'Custom');
        break;
    }

    // Filter by applied filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((f) => {
        return appliedFilters.every((filter) => {
          const value = String(f[filter.field as keyof Flavor] || '').toLowerCase();
          return value.includes(filter.value.toLowerCase());
        });
      });
    }

    return filtered;
  }, [activeTab, appliedFilters]);

  const totalPages = Math.ceil(filteredFlavors.length / rowsPerPage);

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Flavor>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: columnMinWidths.name,
        sortable: true,
        render: (_, row) => (
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute/flavors/${row.id}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <span className="text-body-sm text-[var(--color-text-muted)] truncate">
              ID:{row.id}
            </span>
          </div>
        ),
      },
      {
        key: 'vcpu',
        label: 'vCPU',
        flex: 1,
        minWidth: columnMinWidths.vcpu,
        sortable: true,
      },
      {
        key: 'ram',
        label: 'RAM',
        flex: 1,
        minWidth: columnMinWidths.ram,
        sortable: true,
      },
      {
        key: 'ephemeralDisk',
        label: 'Root disk',
        flex: 1,
        minWidth: columnMinWidths.ephemeralDisk,
        sortable: true,
      },
      {
        key: 'access',
        label: 'Public',
        flex: 1,
        minWidth: columnMinWidths.access,
        render: (_, row) => <span>{row.access === 'Public' ? 'On' : 'Off'}</span>,
      },
      {
        key: 'metadata',
        label: 'Metadata',
        flex: 1,
        minWidth: 180,
        render: (value: string) => {
          if (!value || value === '-') return <span>-</span>;
          const pairs = value.split(',');
          const first = pairs[0];
          const extra = pairs.length - 1;
          return (
            <span className="inline-flex items-center gap-1 min-w-0">
              <span className="truncate min-w-0">{first}</span>
              {extra > 0 && (
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[320px]">
                      <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                        All Metadata ({pairs.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pairs.map((pair, i) => (
                          <Badge key={i} theme="white" size="sm">
                            {pair.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                    +{extra}
                  </span>
                </Popover>
              )}
            </span>
          );
        },
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
              onClick: () => console.log('Create instance with flavor:', row.id),
            },
            {
              id: 'create-instance-template',
              label: 'Create instance template',
              onClick: () => console.log('Create instance template with flavor:', row.id),
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
    ],
    [activeTab]
  );

  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);
    const columnMap = new Map(columns.map((col) => [col.key, col]));
    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<Flavor> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
            <Breadcrumb items={[{ label: 'Proj-1', href: '/project' }, { label: 'Flavors' }]} />
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
        <PageHeader title="Flavors" />

        {/* Category Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="cpu">CPU</Tab>
            <Tab value="gpu">GPU</Tab>
            <Tab value="mpu">MPU</Tab>
            <Tab value="custom">Bare metal</Tab>
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
                placeholder="Search flavor by attributes"
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
        />

        {/* Pagination */}
        {filteredFlavors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            onSettingsClick={() => setIsPreferencesOpen(true)}
            totalItems={filteredFlavors.length}
            selectedCount={selectedFlavors.length}
          />
        )}

        {/* Flavor Table */}
        <Table<Flavor>
          columns={visibleColumns}
          data={filteredFlavors.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
          rowKey="id"
          emptyMessage="No flavors found"
        />
      </VStack>

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

export default FlavorsPage;
