import { useState, useMemo } from 'react';
import {
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
  Button,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  IconDotsCircleHorizontal,
  IconDownload,
  IconBell,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
  type: FlavorType;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFlavors: Flavor[] = [
  { id: 'flv-001', name: 'c5.large', category: 'Compute Optimized', vcpu: 2, ram: '16GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '-', access: 'Public', type: 'CPU' },
  { id: 'flv-002', name: 'c5.xlarge', category: 'Compute Optimized', vcpu: 4, ram: '32GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '10Gbps', access: 'Public', type: 'CPU' },
  { id: 'flv-003', name: 'm5.large', category: 'General Purpose', vcpu: 2, ram: '8GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '-', access: 'Public', type: 'CPU' },
  { id: 'flv-004', name: 'm5.xlarge', category: 'General Purpose', vcpu: 4, ram: '16GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '10Gbps', access: 'Public', type: 'CPU' },
  { id: 'flv-005', name: 'r5.large', category: 'Memory Optimized', vcpu: 2, ram: '16GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '-', access: 'Public', type: 'CPU' },
  { id: 'flv-006', name: 'r5.xlarge', category: 'Memory Optimized', vcpu: 4, ram: '32GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '10Gbps', access: 'Public', type: 'CPU' },
  { id: 'flv-007', name: 't3.micro', category: 'Burstable', vcpu: 2, ram: '1GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '-', access: 'Public', type: 'CPU' },
  { id: 'flv-008', name: 't3.small', category: 'Burstable', vcpu: 2, ram: '2GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '-', access: 'Public', type: 'CPU' },
  { id: 'flv-009', name: 'g4dn.xlarge', category: 'GPU Accelerated', vcpu: 4, ram: '16GiB', ephemeralDisk: '125GiB', internalNetworkBandwidth: '25Gbps', access: 'Public', type: 'GPU' },
  { id: 'flv-010', name: 'g4dn.2xlarge', category: 'GPU Accelerated', vcpu: 8, ram: '32GiB', ephemeralDisk: '225GiB', internalNetworkBandwidth: '25Gbps', access: 'Public', type: 'GPU' },
  { id: 'flv-011', name: 'p3.2xlarge', category: 'GPU Compute', vcpu: 8, ram: '61GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '10Gbps', access: 'Public', type: 'GPU' },
  { id: 'flv-012', name: 'inf1.xlarge', category: 'ML Inference', vcpu: 4, ram: '8GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '25Gbps', access: 'Public', type: 'MPU' },
  { id: 'flv-013', name: 'inf1.2xlarge', category: 'ML Inference', vcpu: 8, ram: '16GiB', ephemeralDisk: '0GiB', internalNetworkBandwidth: '25Gbps', access: 'Public', type: 'MPU' },
  { id: 'flv-014', name: 'custom.small', category: 'Custom', vcpu: 2, ram: '4GiB', ephemeralDisk: '20GiB', internalNetworkBandwidth: '-', access: 'Private', type: 'Custom' },
  { id: 'flv-015', name: 'custom.medium', category: 'Custom', vcpu: 4, ram: '8GiB', ephemeralDisk: '50GiB', internalNetworkBandwidth: '10Gbps', access: 'Private', type: 'Custom' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function FlavorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('cpu');

  // Selection state
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'category', label: 'Category', visible: true },
    { id: 'vcpu', label: 'vCPU', visible: true },
    { id: 'ram', label: 'RAM', visible: true },
    { id: 'ephemeralDisk', label: 'Ephemeral Disk', visible: true },
    { id: 'internalNetworkBandwidth', label: 'Internal Network Bandwidth', visible: true },
    { id: 'access', label: 'Access', visible: true },
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

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredFlavors.length / rowsPerPage);

  // Table columns
  const columns: TableColumn<Flavor>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/flavors/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      flex: 1,
      sortable: true,
    },
    {
      key: 'vcpu',
      label: 'vCPU',
      flex: 1,
      sortable: true,
    },
    {
      key: 'ram',
      label: 'RAM',
      flex: 1,
      sortable: true,
    },
    {
      key: 'ephemeralDisk',
      label: 'Ephemeral Disk',
      flex: 1,
      sortable: true,
    },
    {
      key: 'internalNetworkBandwidth',
      label: 'Internal Network Bandwidth',
      flex: 1,
      sortable: true,
    },
    {
      key: 'access',
      label: 'Public',
      width: '100px',
      render: (_, row) => (
        <span>{row.access === 'Public' ? 'On' : 'Off'}</span>
      ),
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
            onClick: () => console.log('Create instance with flavor:', row.id),
          },
          {
            id: 'create-instance-template',
            label: 'Create Instance template',
            onClick: () => console.log('Create instance template with flavor:', row.id),
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
      .filter((col): col is TableColumn<Flavor> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

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
                { label: 'Flavors' },
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
                Flavors
              </h1>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
              <TabList>
                <Tab value="cpu">CPU</Tab>
                <Tab value="gpu">GPU</Tab>
                <Tab value="mpu">MPU</Tab>
                <Tab value="custom">Custom</Tab>
              </TabList>
            </Tabs>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find Flavor with filters"
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
        </div>
        </div>
      </main>

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

export default FlavorsPage;

