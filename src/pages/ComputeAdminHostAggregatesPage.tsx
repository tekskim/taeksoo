import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  FilterSearchInput,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  ContextMenu,
  ConfirmModal,
  Table,
  PageShell,
  PageHeader,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
  Popover,
  Badge,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  IconDotsCircleHorizontal,
  IconDownload,
  IconBell,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface HostAggregate {
  id: string;
  name: string;
  availabilityZone: string;
  hosts: string[];
  metadata: { key: string; value: string }[];
  createdAt: string;
}

interface AvailabilityZone {
  id: string;
  name: string;
  hosts: string[];
  available: boolean;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockHostAggregates: HostAggregate[] = [
  {
    id: 'ha-001',
    name: 'compute-general',
    availabilityZone: 'zone-a',
    hosts: ['host-a', 'host-b', 'host-c', 'host-d'],
    metadata: [
      { key: 'ssd', value: 'true' },
      { key: 'cpu_allocation_ratio', value: '16.0' },
      { key: 'ram_allocation_ratio', value: '1.5' },
    ],
    createdAt: 'Dec 25, 2025 09:15:33',
  },
  {
    id: 'ha-002',
    name: 'compute-gpu',
    availabilityZone: 'zone-a',
    hosts: ['gpu-host-1', 'gpu-host-2'],
    metadata: [
      { key: 'gpu', value: 'nvidia-a100' },
      { key: 'gpu_count', value: '8' },
    ],
    createdAt: 'Dec 25, 2025 10:42:18',
  },
  {
    id: 'ha-003',
    name: 'compute-memory',
    availabilityZone: 'zone-b',
    hosts: ['mem-host-1', 'mem-host-2', 'mem-host-3'],
    metadata: [
      { key: 'memory', value: 'high' },
      { key: 'ram_allocation_ratio', value: '1.0' },
    ],
    createdAt: 'Dec 25, 2025 14:08:52',
  },
  {
    id: 'ha-004',
    name: 'compute-storage',
    availabilityZone: 'zone-b',
    hosts: ['storage-1', 'storage-2'],
    metadata: [
      { key: 'storage', value: 'nvme' },
      { key: 'disk_allocation_ratio', value: '1.0' },
    ],
    createdAt: 'Dec 25, 2025 16:25:41',
  },
  {
    id: 'ha-005',
    name: 'compute-bare-metal',
    availabilityZone: 'zone-c',
    hosts: ['bm-host-1'],
    metadata: [{ key: 'bare-metal', value: 'true' }],
    createdAt: 'Dec 25, 2025 17:53:27',
  },
];

const mockAvailabilityZones: AvailabilityZone[] = [
  {
    id: 'az-001',
    name: 'zone-a',
    hosts: ['host-a', 'host-b', 'host-c', 'host-d'],
    available: true,
  },
  { id: 'az-002', name: 'zone-b', hosts: ['host-e', 'host-f', 'host-g'], available: true },
  { id: 'az-003', name: 'zone-c', hosts: ['host-h', 'host-i'], available: true },
  { id: 'az-004', name: 'zone-d', hosts: ['host-j'], available: false },
  {
    id: 'az-005',
    name: 'zone-e',
    hosts: ['host-k', 'host-l', 'host-m', 'host-n'],
    available: true,
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'availabilityZone', label: 'Availability Zone', type: 'text' },
];

const azFilterFields: FilterField[] = [{ key: 'name', label: 'Name', type: 'text' }];

export function ComputeAdminHostAggregatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hostAggregates, setHostAggregates] = useState(mockHostAggregates);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'host-aggregates';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HostAggregate | null>(null);

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Availability Zones state
  const [azAppliedFilters, setAzAppliedFilters] = useState<AppliedFilter[]>([]);
  const [azCurrentPage, setAzCurrentPage] = useState(1);
  const [availabilityZones] = useState(mockAvailabilityZones);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'availabilityZone', label: 'Availability Zone', visible: true },
    { id: 'hosts', label: 'Hosts', visible: true },
    { id: 'createdAt', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleDeleteClick = (item: HostAggregate) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setHostAggregates((prev) => prev.filter((ha) => ha.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredItems = useMemo(() => {
    if (appliedFilters.length === 0) return hostAggregates;
    return hostAggregates.filter((ha) => {
      return appliedFilters.every((filter) => {
        const value = String(ha[filter.field as keyof HostAggregate] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [hostAggregates, appliedFilters]);

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredItems, currentPage, rowsPerPage]);

  // Availability Zones filtering and pagination
  const filteredAZs = useMemo(() => {
    if (azAppliedFilters.length === 0) return availabilityZones;
    return availabilityZones.filter((az) => {
      return azAppliedFilters.every((filter) => {
        const value = String(az[filter.field as keyof AvailabilityZone] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [availabilityZones, azAppliedFilters]);

  const azTotalPages = Math.ceil(filteredAZs.length / rowsPerPage);

  const paginatedAZs = useMemo(() => {
    return filteredAZs.slice((azCurrentPage - 1) * rowsPerPage, azCurrentPage * rowsPerPage);
  }, [filteredAZs, azCurrentPage, rowsPerPage]);

  const getContextMenuItems = (row: HostAggregate): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit:', row.id) },
    { id: 'manage-host', label: 'Manage host', onClick: () => console.log('Manage host:', row.id) },
    {
      id: 'manage-metadata',
      label: 'Manage metadata',
      onClick: () => console.log('Manage metadata:', row.id),
    },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => handleDeleteClick(row) },
  ];

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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Host Aggregates' },
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
    >
      <VStack gap={3}>
        <PageHeader
          title={activeTab === 'host-aggregates' ? 'Host Aggregates' : 'Availability Zones'}
          actions={
            activeTab === 'host-aggregates' ? (
              <Button variant="primary" size="md">
                Create Host Aggregate
              </Button>
            ) : undefined
          }
        />

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="host-aggregates">Host aggregates</Tab>
            <Tab value="availability-zones">Availability zones</Tab>
          </TabList>
        </Tabs>

        {/* Content based on active tab */}
        {activeTab === 'host-aggregates' && (
          <>
            {/* Action Bar */}
            <div className="flex items-center gap-1">
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search host aggregates by attributes"
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
              totalItems={filteredItems.length}
              showSettings
            />

            {/* Table */}
            <Table<HostAggregate>
              columns={[
                {
                  key: 'name',
                  label: 'Name',
                  flex: 1,
                  sortable: true,
                  render: (_: string, row: HostAggregate) => {
                    const isExpanded = expandedRows.includes(row.id);
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(row.id);
                        }}
                        className="flex items-center gap-2 w-full"
                      >
                        <IconChevronDown
                          size={16}
                          stroke={1.5}
                          className={`shrink-0 text-[var(--color-text-default)] transition-transform ${isExpanded ? '' : '-rotate-90'}`}
                        />
                        <span>{row.name}</span>
                      </button>
                    );
                  },
                },
                { key: 'availabilityZone', label: 'Availability Zone', flex: 1, sortable: true },
                {
                  key: 'hosts',
                  label: 'Hosts',
                  flex: 1,
                  render: (_: string[], row: HostAggregate) => {
                    const first = row.hosts[0];
                    const rest = row.hosts.length - 1;
                    return (
                      <span className="flex items-center justify-between w-full">
                        <span className="truncate">{first}</span>
                        {rest > 0 && (
                          <Popover
                            trigger="hover"
                            position="bottom"
                            delay={100}
                            hideDelay={100}
                            content={
                              <div className="p-3 min-w-[120px] max-w-[320px]">
                                <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                                  All Hosts ({row.hosts.length})
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {row.hosts.map((h, i) => (
                                    <Badge key={i} theme="white" size="sm">
                                      {h}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            }
                          >
                            <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                              +{rest}
                            </span>
                          </Popover>
                        )}
                      </span>
                    );
                  },
                },
                {
                  key: 'createdAt',
                  label: 'Created at',
                  flex: 1,
                  sortable: true,
                  render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
                },
                {
                  key: 'actions' as keyof HostAggregate,
                  label: 'Action',
                  width: '64px',
                  align: 'center' as const,
                  render: (_: unknown, row: HostAggregate) => (
                    <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
                      <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
                        <IconDotsCircleHorizontal
                          size={16}
                          stroke={1.5}
                          className="text-[var(--action-icon-color)]"
                        />
                      </button>
                    </ContextMenu>
                  ),
                },
              ]}
              data={paginatedItems}
              rowKey="id"
              emptyMessage="No host aggregates found"
              expandedContent={(row) => {
                if (!expandedRows.includes(row.id) || row.metadata.length === 0) return null;
                return (
                  <div className="p-3">
                    <Table
                      columns={[
                        { key: 'key', label: 'Metadata', flex: 1 },
                        { key: 'value', label: 'Value', flex: 1 },
                      ]}
                      data={row.metadata}
                      rowKey="key"
                    />
                  </div>
                );
              }}
            />
          </>
        )}

        {activeTab === 'availability-zones' && (
          <>
            {/* Action Bar */}
            <div className="flex items-center gap-1">
              <FilterSearchInput
                filters={azFilterFields}
                appliedFilters={azAppliedFilters}
                onFiltersChange={setAzAppliedFilters}
                placeholder="Search availability zones by attributes"
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
              currentPage={azCurrentPage}
              totalPages={azTotalPages}
              onPageChange={setAzCurrentPage}
              totalItems={filteredAZs.length}
              showSettings
            />

            {/* Availability Zones Table */}
            <Table<AvailabilityZone>
              columns={[
                { key: 'name', label: 'Name', flex: 1, sortable: true },
                {
                  key: 'hosts',
                  label: 'Hosts',
                  flex: 1,
                  render: (_: string[], row: AvailabilityZone) => {
                    const first = row.hosts[0];
                    const rest = row.hosts.length - 1;
                    return (
                      <span className="flex items-center justify-between w-full">
                        <span className="truncate">{first}</span>
                        {rest > 0 && (
                          <Popover
                            trigger="hover"
                            position="bottom"
                            delay={100}
                            hideDelay={100}
                            content={
                              <div className="p-3 min-w-[120px] max-w-[320px]">
                                <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                                  All Hosts ({row.hosts.length})
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {row.hosts.map((h, i) => (
                                    <Badge key={i} theme="white" size="sm">
                                      {h}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            }
                          >
                            <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                              +{rest}
                            </span>
                          </Popover>
                        )}
                      </span>
                    );
                  },
                },
                {
                  key: 'available',
                  label: 'Available',
                  flex: 1,
                  render: (value: boolean) => <span>{value ? 'Yes' : 'No'}</span>,
                },
              ]}
              data={paginatedAZs}
              rowKey="id"
              emptyMessage="No availability zones found"
            />
          </>
        )}
      </VStack>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete host aggregate"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Host aggregate name"
        infoValue={itemToDelete?.name}
      />

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

export default ComputeAdminHostAggregatesPage;
