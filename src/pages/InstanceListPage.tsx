import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  SearchInput,
  Table,
  StatusIndicator,
  Pagination,
  HStack,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  ListToolbar,
  type TableColumn,
  type StatusType,
  type FilterItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPlus,
  IconDotsVertical,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconRefresh,
  IconArrowUp,
  IconBell,
  IconDownload,
  IconLock,
  IconTerminal2,
} from '@tabler/icons-react';
import { ViewPreferencesDrawer, defaultColumns, type ColumnConfig } from '@/components/ViewPreferencesDrawer';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type InstanceStatus = 'running' | 'stopped' | 'pending' | 'error' | 'building';

interface Instance {
  id: string;
  name: string;
  status: InstanceStatus;
  locked: boolean;
  fixedIp: string;
  floatingIp: string;
  image: string;
  flavor: string;
  vcpu: number;
  ram: string;
  disk: string;
  gpu: string;
  az: string;
}

interface BareMetalInstance {
  id: string;
  name: string;
  status: InstanceStatus;
  ip: string;
  image: string;
  flavor: string;
  cpu: number;
  ram: string;
  disk: string;
  gpu: string;
  az: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInstances: Instance[] = [
  { id: 'vm-001', name: 'worker-node-01', status: 'running', locked: true, fixedIp: '10.20.30.40', floatingIp: '20.30.40.50', image: 'CentOS 7', flavor: 'Medium', vcpu: 4, ram: '8GB', disk: '100GB', gpu: '1', az: 'keystone' },
  { id: 'vm-002', name: 'worker-node-02', status: 'running', locked: false, fixedIp: '10.20.30.41', floatingIp: '20.30.40.51', image: 'CentOS 7', flavor: 'Medium', vcpu: 4, ram: '8GB', disk: '100GB', gpu: '1', az: 'keystone' },
  { id: 'vm-003', name: 'master-node-01', status: 'running', locked: true, fixedIp: '10.20.30.10', floatingIp: '20.30.40.10', image: 'Ubuntu 22.04', flavor: 'Large', vcpu: 8, ram: '16GB', disk: '200GB', gpu: '-', az: 'nova' },
  { id: 'vm-004', name: 'db-server-01', status: 'stopped', locked: true, fixedIp: '10.20.30.20', floatingIp: '-', image: 'CentOS 8', flavor: 'XLarge', vcpu: 16, ram: '64GB', disk: '500GB', gpu: '-', az: 'keystone' },
  { id: 'vm-005', name: 'gpu-node-01', status: 'running', locked: false, fixedIp: '10.20.30.50', floatingIp: '20.30.40.60', image: 'Ubuntu 22.04', flavor: 'GPU Large', vcpu: 32, ram: '128GB', disk: '1TB', gpu: '4', az: 'nova' },
  { id: 'vm-006', name: 'gpu-node-02', status: 'running', locked: false, fixedIp: '10.20.30.51', floatingIp: '20.30.40.61', image: 'Ubuntu 22.04', flavor: 'GPU Large', vcpu: 32, ram: '128GB', disk: '1TB', gpu: '4', az: 'nova' },
  { id: 'vm-007', name: 'web-server-01', status: 'pending', locked: false, fixedIp: '-', floatingIp: '-', image: 'Rocky Linux 9', flavor: 'Small', vcpu: 2, ram: '4GB', disk: '50GB', gpu: '-', az: 'keystone' },
  { id: 'vm-008', name: 'web-server-02', status: 'building', locked: false, fixedIp: '-', floatingIp: '-', image: 'Rocky Linux 9', flavor: 'Small', vcpu: 2, ram: '4GB', disk: '50GB', gpu: '-', az: 'keystone' },
  { id: 'vm-009', name: 'analytics-01', status: 'error', locked: true, fixedIp: '10.20.30.80', floatingIp: '-', image: 'Debian 12', flavor: 'XLarge', vcpu: 16, ram: '32GB', disk: '500GB', gpu: '2', az: 'nova' },
  { id: 'vm-010', name: 'cache-server-01', status: 'running', locked: false, fixedIp: '10.20.30.90', floatingIp: '20.30.40.90', image: 'Debian 12', flavor: 'Medium', vcpu: 4, ram: '16GB', disk: '100GB', gpu: '-', az: 'keystone' },
];

const mockBareMetalInstances: BareMetalInstance[] = [
  { id: 'bm-001', name: 'web-server-1', status: 'running', ip: '10.62.0.30', image: 'BM image', flavor: 'BM flavor', cpu: 8, ram: '16GiB', disk: '10GiB', gpu: '-', az: 'zone-a' },
  { id: 'bm-002', name: 'web-server-2', status: 'running', ip: '10.62.0.31', image: 'BM image', flavor: 'BM flavor', cpu: 8, ram: '16GiB', disk: '10GiB', gpu: '-', az: 'zone-a' },
  { id: 'bm-003', name: 'db-server-1', status: 'running', ip: '10.62.0.40', image: 'BM image', flavor: 'BM large', cpu: 16, ram: '64GiB', disk: '500GiB', gpu: '-', az: 'zone-b' },
  { id: 'bm-004', name: 'db-server-2', status: 'stopped', ip: '10.62.0.41', image: 'BM image', flavor: 'BM large', cpu: 16, ram: '64GiB', disk: '500GiB', gpu: '-', az: 'zone-b' },
  { id: 'bm-005', name: 'gpu-node-1', status: 'running', ip: '10.62.0.50', image: 'BM GPU', flavor: 'BM GPU', cpu: 32, ram: '128GiB', disk: '1TiB', gpu: 'A100 x4', az: 'zone-c' },
  { id: 'bm-006', name: 'gpu-node-2', status: 'running', ip: '10.62.0.51', image: 'BM GPU', flavor: 'BM GPU', cpu: 32, ram: '128GiB', disk: '1TiB', gpu: 'A100 x4', az: 'zone-c' },
  { id: 'bm-007', name: 'compute-1', status: 'pending', ip: '—', image: 'BM image', flavor: 'BM xlarge', cpu: 64, ram: '256GiB', disk: '2TiB', gpu: '-', az: 'zone-a' },
  { id: 'bm-008', name: 'compute-2', status: 'building', ip: '—', image: 'BM image', flavor: 'BM xlarge', cpu: 64, ram: '256GiB', disk: '2TiB', gpu: '-', az: 'zone-a' },
  { id: 'bm-009', name: 'storage-node-1', status: 'running', ip: '10.62.0.60', image: 'BM storage', flavor: 'BM storage', cpu: 8, ram: '32GiB', disk: '10TiB', gpu: '-', az: 'zone-b' },
  { id: 'bm-010', name: 'storage-node-2', status: 'error', ip: '10.62.0.61', image: 'BM storage', flavor: 'BM storage', cpu: 8, ram: '32GiB', disk: '10TiB', gpu: '-', az: 'zone-b' },
];

/* ----------------------------------------
   Status Config - Map to StatusIndicator types
   ---------------------------------------- */

const statusMap: Record<InstanceStatus, StatusType> = {
  running: 'active',
  stopped: 'shutoff',
  pending: 'paused',
  error: 'error',
  building: 'building',
};

/* ----------------------------------------
   Instances List Page
   ---------------------------------------- */

// Filter type is imported from design-system as FilterItem

export function InstanceListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [selectedBareMetalInstances, setSelectedBareMetalInstances] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBareMetalPage, setCurrentBareMetalPage] = useState(1);
  const [activeTab, setActiveTab] = useState('vm');
  const [activeFilters, setActiveFilters] = useState<FilterItem[]>([
    { id: '1', field: 'Name', value: 'a' },
    { id: '2', field: 'Name', value: 'a' },
    { id: '3', field: 'Name', value: 'a' },
    { id: '4', field: 'Name', value: 'aasdf' },
  ]);

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnPreferences, setColumnPreferences] = useState<ColumnConfig[]>(defaultColumns);
  const pageSize = rowsPerPage;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Scroll to top handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredInstances = useMemo(() => 
    mockInstances.filter((instance) =>
    instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instance.id.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  const filteredBareMetalInstances = useMemo(() => 
    mockBareMetalInstances.filter((instance) =>
    instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instance.id.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  const totalPages = Math.ceil(filteredInstances.length / pageSize);
  const totalBareMetalPages = Math.ceil(filteredBareMetalInstances.length / pageSize);


  // Table columns definition
  const columns: TableColumn<Instance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator status={statusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <a 
          href={`/instances/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </a>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: '62px',
      align: 'center',
      sortable: false,
      render: (_, row) => row.locked ? (
        <IconLock size={16} stroke={1} className="text-[var(--color-text-default)]" />
      ) : null,
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
      sortable: false,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      sortable: false,
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      sortable: true,
    },
    {
      key: 'flavor',
      label: 'Flavor',
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
      key: 'disk',
      label: 'Disk',
      flex: 1,
      sortable: true,
    },
    {
      key: 'gpu',
      label: 'GPU',
      flex: 1,
      sortable: true,
    },
    {
      key: 'az',
      label: 'AZ',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: () => (
        <HStack gap={1} className="justify-center">
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
            <IconTerminal2 size={16} stroke={1} className="text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)]" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
            <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)]" />
          </button>
        </HStack>
      ),
    },
  ];

  // Bare Metal Table columns definition
  const bareMetalColumns: TableColumn<BareMetalInstance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '80px',
      align: 'center',
      sortable: true,
      render: (_, row) => (
        <StatusIndicator status={statusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <a 
          href={`/bare-metal/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </a>
      ),
    },
    {
      key: 'ip',
      label: 'Fixed IP',
      flex: 1,
      sortable: false,
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      sortable: true,
    },
    {
      key: 'flavor',
      label: 'Flavor',
      flex: 1,
      sortable: true,
    },
    {
      key: 'cpu',
      label: 'CPU',
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
      key: 'disk',
      label: 'Disk',
      flex: 1,
      sortable: true,
    },
    {
      key: 'gpu',
      label: 'GPU',
      flex: 1,
      sortable: true,
    },
    {
      key: 'az',
      label: 'AZ',
      flex: 1,
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 ${sidebarOpen ? 'ml-[200px]' : 'ml-0'}`}>
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          showWindowControls={true}
        />

        {/* Top Bar with Breadcrumb Navigation */}
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
                { label: 'Instances List' },
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

        {/* Page Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Instances List
              </h1>
              <Button leftIcon={<IconPlus size={16} />}>
                Create Instance
              </Button>
            </div>

            {/* Type Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
              <TabList>
                <Tab value="vm">VM</Tab>
                <Tab value="bare-metal">Bare Metal</Tab>
              </TabList>
            </Tabs>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find Instance with filters"
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
                  <Button variant="muted" size="sm" leftIcon={<IconPlayerPlay size={12} />} disabled={selectedInstances.length === 0}>
                    Start
                  </Button>
                  <Button variant="muted" size="sm" leftIcon={<IconPlayerStop size={12} />} disabled={selectedInstances.length === 0}>
                    Stop
                  </Button>
                  <Button variant="muted" size="sm" leftIcon={<IconRefresh size={12} />} disabled={selectedInstances.length === 0}>
                    Reboot
                  </Button>
                  <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled={selectedInstances.length === 0}>
                    Delete
                  </Button>
                </ListToolbar.Actions>
              }
              filters={activeFilters}
              onFilterRemove={removeFilter}
              onFiltersClear={clearAllFilters}
            />

            {/* Pagination */}
            {activeTab === 'vm' && filteredInstances.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
                totalItems={mockInstances.length}
                selectedCount={selectedInstances.length}
              />
            )}
            {activeTab === 'bare-metal' && filteredBareMetalInstances.length > 0 && (
              <Pagination
                currentPage={currentBareMetalPage}
                totalPages={totalBareMetalPages}
                onPageChange={setCurrentBareMetalPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
                totalItems={mockBareMetalInstances.length}
                selectedCount={selectedBareMetalInstances.length}
              />
            )}

            {/* VM Table */}
            {activeTab === 'vm' && (
              <Table<Instance>
                columns={columns}
                data={filteredInstances}
                rowKey="id"
                selectable
                selectedKeys={selectedInstances}
                onSelectionChange={setSelectedInstances}
                emptyMessage="No instances found"
              />
            )}

            {/* Bare Metal Table */}
            {activeTab === 'bare-metal' && (
              <Table<BareMetalInstance>
                columns={bareMetalColumns}
                data={filteredBareMetalInstances}
                rowKey="id"
                selectable
                selectedKeys={selectedBareMetalInstances}
                onSelectionChange={setSelectedBareMetalInstances}
                emptyMessage="No bare metal instances found"
              />
            )}

          </VStack>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-10 h-10 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <IconArrowUp size={20} stroke={2} />
        </button>
      )}

      {/* View Preferences Drawer */}
      <ViewPreferencesDrawer
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columnPreferences}
        onColumnsChange={setColumnPreferences}
      />
    </div>
  );
}

export default InstanceListPage;





