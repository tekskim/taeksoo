import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  SectionCard,
  SearchInput,
  Table,
  Pagination,
  StatusIndicator,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconBell,
  IconDotsCircleHorizontal,
  IconLock,
  IconLockOpen,
  IconTerminal2,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type VisibilityType = 'Public' | 'Private' | 'Project';
type InstanceStatus = 'active' | 'building' | 'error' | 'shutoff' | 'paused';

interface FlavorDetail {
  id: string;
  name: string;
  category: string;
  vcpu: number;
  ram: string;
  visibility: VisibilityType;
  createdAt: string;
  // Basic Information
  architecture: string;
  // Specification
  ephemeralDisk: string;
  numaNodes: string;
  // Advanced
  cpuPolicy: string;
  cpuThreadPolicy: string;
  memoryPage: string;
  internalNetworkBandwidth: string;
  storageIOPS: string;
}

interface FlavorInstance {
  id: string;
  name: string;
  status: InstanceStatus;
  locked: boolean;
  image: string;
  fixedIP: string;
  az: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Flavor data map by ID
const mockFlavorsMap: Record<string, FlavorDetail> = {
  'flv-001': { id: 'flv-001', name: 'Small', category: 'General Purpose', vcpu: 2, ram: '4GiB', visibility: 'Public', createdAt: '2025-09-15', architecture: 'X86 Architecture', ephemeralDisk: '0GiB', numaNodes: '0', cpuPolicy: 'Shared', cpuThreadPolicy: 'Prefer', memoryPage: 'Any', internalNetworkBandwidth: '-', storageIOPS: '-' },
  'flv-002': { id: 'flv-002', name: 'Medium', category: 'General Purpose', vcpu: 4, ram: '8GiB', visibility: 'Public', createdAt: '2025-09-10', architecture: 'X86 Architecture', ephemeralDisk: '0GiB', numaNodes: '0', cpuPolicy: 'Shared', cpuThreadPolicy: 'Prefer', memoryPage: 'Any', internalNetworkBandwidth: '-', storageIOPS: '-' },
  'flv-003': { id: 'flv-003', name: 'Large', category: 'General Purpose', vcpu: 8, ram: '16GiB', visibility: 'Public', createdAt: '2025-09-05', architecture: 'X86 Architecture', ephemeralDisk: '0GiB', numaNodes: '0', cpuPolicy: 'Dedicated', cpuThreadPolicy: 'Prefer', memoryPage: 'Any', internalNetworkBandwidth: '-', storageIOPS: '-' },
  'flv-004': { id: 'flv-004', name: 'XLarge', category: 'Memory Optimized', vcpu: 16, ram: '64GiB', visibility: 'Public', createdAt: '2025-09-01', architecture: 'X86 Architecture', ephemeralDisk: '0GiB', numaNodes: '1', cpuPolicy: 'Dedicated', cpuThreadPolicy: 'Isolate', memoryPage: 'Large', internalNetworkBandwidth: '10Gbps', storageIOPS: '3000' },
  'flv-005': { id: 'flv-005', name: 'GPU Large', category: 'GPU', vcpu: 32, ram: '128GiB', visibility: 'Private', createdAt: '2025-08-30', architecture: 'X86 Architecture', ephemeralDisk: '100GiB', numaNodes: '2', cpuPolicy: 'Dedicated', cpuThreadPolicy: 'Isolate', memoryPage: 'Large', internalNetworkBandwidth: '25Gbps', storageIOPS: '10000' },
};

const defaultFlavorDetail: FlavorDetail = {
  id: 'unknown', name: 'Unknown Flavor', category: '-', vcpu: 0, ram: '0GiB', visibility: 'Public', createdAt: '-', architecture: '-', ephemeralDisk: '0GiB', numaNodes: '0', cpuPolicy: '-', cpuThreadPolicy: '-', memoryPage: '-', internalNetworkBandwidth: '-', storageIOPS: '-',
};

// Mock flavor parameters (raw API response)
const mockFlavorParameters = {
  id: 'b95aaf8a-80c5-4be0-ae67-5c983f5c9536',
  name: 'c5.large',
  ram: 4096,
  disk: 0,
  swap: 0,
  'OS-FLV-EXT-DATA:ephemeral': 0,
  'OS-FLV-DISABLED:disabled': false,
  vcpus: 2,
  'os-flavor-access:is_public': true,
  rxtx_factor: 1,
  links: [
    {
      rel: 'self',
      href: 'http://10.7.12.10/v2.1/flavors/b95aaf8a-80c5-4be0-ae67-5c983f5c9536',
    },
    {
      rel: 'bookmark',
      href: 'http://10.7.12.10/flavors/b95aaf8a-80c5-4be0-ae67-5c983f5c9536',
    },
  ],
  description: null,
  extra_specs: {
    ':architecture': 'x86_architecture',
    ':category': 'compute_optimized',
    'hw:mem_page_size': 'any',
    'hw:numa_nodes': '1',
  },
};

// Mock instances data using this flavor
const mockFlavorInstances: FlavorInstance[] = Array.from({ length: 115 }, (_, i) => ({
  id: `inst-${String(i + 1).padStart(3, '0')}`,
  name: `web-server-${String(i + 1).padStart(2, '0')}`,
  status: (['active', 'building', 'error', 'shutoff', 'paused'] as InstanceStatus[])[i % 5],
  locked: i % 3 === 0,
  image: ['Ubuntu24.04', 'CentOS8', 'Debian12', 'Rocky9'][i % 4],
  fixedIP: `10.62.0.${30 + i}`,
  az: ['zone-a', 'zone-b', 'zone-o'][i % 3],
  createdAt: `2025-09-${String(30 - (i % 28)).padStart(2, '0')}`,
}));


/* ----------------------------------------
   Flavor Detail Page
   ---------------------------------------- */

export function FlavorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const flavor = id ? (mockFlavorsMap[id] || defaultFlavorDetail) : defaultFlavorDetail;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  
  // Instances tab state
  const [instanceSearchQuery, setInstanceSearchQuery] = useState('');
  const [instanceCurrentPage, setInstanceCurrentPage] = useState(1);
  const instancesPerPage = 10;
  
  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  // Flavor data is already fetched based on ID above
  const instances = mockFlavorInstances;

  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Proj-1', href: '#' },
    { label: 'Flavors', href: '/compute/flavors' },
    { label: flavor.name, href: `/flavors/${flavor.id}` },
  ];

  // Filter instances by search query
  const filteredInstances = useMemo(() => {
    if (!instanceSearchQuery) return instances;
    const query = instanceSearchQuery.toLowerCase();
    return instances.filter(
      (inst) =>
        inst.name.toLowerCase().includes(query) ||
        inst.id.toLowerCase().includes(query) ||
        inst.image.toLowerCase().includes(query) ||
        inst.fixedIP.toLowerCase().includes(query)
    );
  }, [instances, instanceSearchQuery]);

  const instanceTotalPages = Math.ceil(filteredInstances.length / instancesPerPage);
  const paginatedInstances = filteredInstances.slice(
    (instanceCurrentPage - 1) * instancesPerPage,
    instanceCurrentPage * instancesPerPage
  );

  // Context menu items for instance actions
  const getInstanceContextMenuItems = (_instance: FlavorInstance): ContextMenuItem[] => [
    { id: 'view-details', label: 'View Details', onClick: () => {} },
    { id: 'start', label: 'Start', onClick: () => {} },
    { id: 'stop', label: 'Stop', onClick: () => {} },
    { id: 'restart', label: 'Restart', onClick: () => {} },
    { id: 'divider1', type: 'divider' },
    { id: 'delete', label: 'Delete', onClick: () => {}, status: 'danger' },
  ];

  // Instance table columns
  const instanceColumns: TableColumn<FlavorInstance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={row.status} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/instances/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: '62px',
      align: 'center',
      render: (_, row) => (
        row.locked ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
        ) : (
          <IconLockOpen size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
        )
      ),
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'fixedIP',
      label: 'Fixed IP',
      flex: 1,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'az',
      label: 'AZ',
      flex: 1,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            onClick={(e) => e.stopPropagation()}
            title="Console"
          >
            <IconTerminal2 size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
          </button>
          <ContextMenu
            items={getInstanceContextMenuItems(row)}
            trigger={
              <button
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
                onClick={(e) => e.stopPropagation()}
              >
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-[var(--sidebar-collapsed-width)]'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate('/flavors')}
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
        <TabBar tabs={tabBarTabs} activeTabId={activeTabId} onTabClick={selectTab} onTabClose={closeTab} />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
        <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
          <VStack gap={6} className="min-w-[1176px]">
            {/* Flavor Header Card */}
            <DetailHeader>
              <DetailHeader.Title>{flavor.name}</DetailHeader.Title>
              <DetailHeader.Actions>
                <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                  Create Instance
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                  Create Volume
                </Button>
              </DetailHeader.Actions>
              <DetailHeader.InfoGrid>
                <DetailHeader.InfoCard label="Category" value={flavor.category} />
                <DetailHeader.InfoCard label="ID" value={flavor.id} copyable />
                <DetailHeader.InfoCard label="vCPU" value={String(flavor.vcpu)} />
                <DetailHeader.InfoCard label="RAM" value={flavor.ram} />
                <DetailHeader.InfoCard label="Visibility" value={flavor.visibility} />
                <DetailHeader.InfoCard label="Created At" value={flavor.createdAt} />
              </DetailHeader.InfoGrid>
            </DetailHeader>

            {/* Flavor Tabs */}
            <div className="w-full">
              <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                <TabList>
                  <Tab value="details">Details</Tab>
                  <Tab value="instances">Instances</Tab>
                  <Tab value="parameters">Parameters</Tab>
                </TabList>

                {/* Details Tab Panel */}
                <TabPanel value="details">
                  <VStack gap={4} className="pt-6">
                    {/* Basic Information */}
                    <SectionCard>
                      <SectionCard.Header title="Basic Information" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Flavor Name" value={flavor.name} />
                        <SectionCard.DataRow label="Architecture" value={flavor.architecture} />
                        <SectionCard.DataRow label="Category" value={flavor.category} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Specification */}
                    <SectionCard>
                      <SectionCard.Header title="Specification" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="vCPU" value={String(flavor.vcpu)} />
                        <SectionCard.DataRow label="RAM" value={flavor.ram} />
                        <SectionCard.DataRow label="Ephemeral Disk" value={flavor.ephemeralDisk} />
                        <SectionCard.DataRow label="NUMA Nodes" value={flavor.numaNodes} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Advanced */}
                    <SectionCard>
                      <SectionCard.Header title="Advanced" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="CPU Policy" value={flavor.cpuPolicy} />
                        <SectionCard.DataRow label="CPU Thread Policy" value={flavor.cpuThreadPolicy} />
                        <SectionCard.DataRow label="Memory Page" value={flavor.memoryPage} />
                        <SectionCard.DataRow label="Internal Network Bandwidth" value={flavor.internalNetworkBandwidth} />
                        <SectionCard.DataRow label="Storage IOPS" value={flavor.storageIOPS} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Security */}
                    <SectionCard>
                      <SectionCard.Header title="Security" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Visibility" value={flavor.visibility} />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>
                </TabPanel>

                {/* Instances Tab Panel */}
                <TabPanel value="instances">
                  <VStack gap={3} className="pt-6">
                    {/* Section Header */}
                    <h2 className="text-[length:var(--font-size-14)] font-semibold text-[var(--color-text-default)]">
                      Instances
                    </h2>

                    {/* Search */}
                    <div className="w-[280px]">
                      <SearchInput
                        placeholder="Find instance with filters"
                        value={instanceSearchQuery}
                        onChange={(e) => setInstanceSearchQuery(e.target.value)}
                        onClear={() => setInstanceSearchQuery('')}
                        size="sm"
                        fullWidth
                      />
                    </div>

                    {/* Pagination */}
                      <Pagination
                        currentPage={instanceCurrentPage}
                        totalPages={instanceTotalPages}
                        onPageChange={setInstanceCurrentPage}
                      totalItems={filteredInstances.length}
                      showSettings
                      onSettingsClick={() => setIsPreferencesOpen(true)}
                      />

                    {/* Instances Table */}
                    <Table<FlavorInstance>
                      columns={instanceColumns}
                      data={paginatedInstances}
                      rowKey="id"
                      emptyMessage="No instances found"
                    />
                  </VStack>
                </TabPanel>

                {/* Parameters Tab Panel */}
                <TabPanel value="parameters">
                  <div className="pt-6">
                    <div className="bg-[#141414] dark:bg-[#FAFAFA] border border-[var(--color-border-default)] rounded-md p-4 w-full min-h-[576px] overflow-auto">
                      <pre className="font-mono text-[12px] leading-[18px] text-[#e2e8f0] dark:text-[#1e293b] whitespace-pre">
{JSON.stringify(mockFlavorParameters, null, 5)}
                      </pre>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}


