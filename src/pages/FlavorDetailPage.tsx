import { useState, useMemo, useEffect } from 'react';
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
  fixedColumns,
  columnMinWidths,
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
  IconExternalLink,
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
  // Basic information
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

// Flavor data map by ID - synced with FlavorsPage mock data
const mockFlavorsMap: Record<string, FlavorDetail> = {
  'flv-001': {
    id: 'flv-001',
    name: 'c5.large',
    category: 'Compute Optimized',
    vcpu: 2,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: '2025-09-15',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-002': {
    id: 'flv-002',
    name: 'c5.xlarge',
    category: 'Compute Optimized',
    vcpu: 4,
    ram: '32GiB',
    visibility: 'Public',
    createdAt: '2025-09-10',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '-',
  },
  'flv-003': {
    id: 'flv-003',
    name: 'm5.large',
    category: 'General Purpose',
    vcpu: 2,
    ram: '8GiB',
    visibility: 'Public',
    createdAt: '2025-09-05',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-004': {
    id: 'flv-004',
    name: 'm5.xlarge',
    category: 'General Purpose',
    vcpu: 4,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: '2025-09-01',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '-',
  },
  'flv-005': {
    id: 'flv-005',
    name: 'r5.large',
    category: 'Memory Optimized',
    vcpu: 2,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: '2025-08-30',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-006': {
    id: 'flv-006',
    name: 'r5.xlarge',
    category: 'Memory Optimized',
    vcpu: 4,
    ram: '32GiB',
    visibility: 'Public',
    createdAt: '2025-08-25',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '-',
  },
  'flv-007': {
    id: 'flv-007',
    name: 't3.micro',
    category: 'Burstable',
    vcpu: 2,
    ram: '1GiB',
    visibility: 'Public',
    createdAt: '2025-08-20',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-008': {
    id: 'flv-008',
    name: 't3.small',
    category: 'Burstable',
    vcpu: 2,
    ram: '2GiB',
    visibility: 'Public',
    createdAt: '2025-08-15',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-009': {
    id: 'flv-009',
    name: 'g4dn.xlarge',
    category: 'GPU Accelerated',
    vcpu: 4,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: '2025-08-10',
    architecture: 'X86 Architecture',
    ephemeralDisk: '125GiB',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Isolate',
    memoryPage: 'Large',
    internalNetworkBandwidth: '25Gbps',
    storageIOPS: '3000',
  },
  'flv-010': {
    id: 'flv-010',
    name: 'g4dn.2xlarge',
    category: 'GPU Accelerated',
    vcpu: 8,
    ram: '32GiB',
    visibility: 'Public',
    createdAt: '2025-08-05',
    architecture: 'X86 Architecture',
    ephemeralDisk: '225GiB',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Isolate',
    memoryPage: 'Large',
    internalNetworkBandwidth: '25Gbps',
    storageIOPS: '5000',
  },
  'flv-011': {
    id: 'flv-011',
    name: 'p3.2xlarge',
    category: 'GPU Compute',
    vcpu: 8,
    ram: '61GiB',
    visibility: 'Public',
    createdAt: '2025-08-01',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Isolate',
    memoryPage: 'Large',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '3000',
  },
  'flv-012': {
    id: 'flv-012',
    name: 'inf1.xlarge',
    category: 'ML Inference',
    vcpu: 4,
    ram: '8GiB',
    visibility: 'Public',
    createdAt: '2025-07-28',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '25Gbps',
    storageIOPS: '-',
  },
  'flv-013': {
    id: 'flv-013',
    name: 'inf1.2xlarge',
    category: 'ML Inference',
    vcpu: 8,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: '2025-07-25',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '25Gbps',
    storageIOPS: '-',
  },
  'flv-014': {
    id: 'flv-014',
    name: 'custom.small',
    category: 'Custom',
    vcpu: 2,
    ram: '4GiB',
    visibility: 'Private',
    createdAt: '2025-07-20',
    architecture: 'X86 Architecture',
    ephemeralDisk: '20GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-015': {
    id: 'flv-015',
    name: 'custom.medium',
    category: 'Custom',
    vcpu: 4,
    ram: '8GiB',
    visibility: 'Private',
    createdAt: '2025-07-15',
    architecture: 'X86 Architecture',
    ephemeralDisk: '50GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '-',
  },
};

const defaultFlavorDetail: FlavorDetail = {
  id: 'unknown',
  name: 'Unknown Flavor',
  category: '-',
  vcpu: 0,
  ram: '0GiB',
  visibility: 'Public',
  createdAt: '-',
  architecture: '-',
  ephemeralDisk: '0GiB',
  numaNodes: '0',
  cpuPolicy: '-',
  cpuThreadPolicy: '-',
  memoryPage: '-',
  internalNetworkBandwidth: '-',
  storageIOPS: '-',
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
  const flavor = id ? mockFlavorsMap[id] || defaultFlavorDetail : defaultFlavorDetail;
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

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label to flavor name
  useEffect(() => {
    if (flavor.name) {
      updateActiveTabLabel(flavor.name);
    }
  }, [flavor.name, updateActiveTabLabel]);

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
    { id: 'view-details', label: 'View details', onClick: () => {} },
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
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1">
            <Link
              to={`/compute/instances/${row.id}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <IconExternalLink
              size={12}
              className="flex-shrink-0 text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: fixedColumns.locked,
      align: 'center',
      render: (_, row) =>
        row.locked ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
        ) : (
          <IconLockOpen size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
        ),
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'fixedIP',
      label: 'Fixed IP',
      flex: 1,
      minWidth: columnMinWidths.fixedIp,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'az',
      label: 'AZ',
      flex: 1,
      minWidth: columnMinWidths.az,
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      width: fixedColumns.actions,
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
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          />
          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => navigate(-1)}
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
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Flavor Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{flavor.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Create instance
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Create volume
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard label="Category" value={flavor.category} />
                  <DetailHeader.InfoCard label="ID" value={flavor.id} copyable />
                  <DetailHeader.InfoCard label="vCPU" value={String(flavor.vcpu)} />
                  <DetailHeader.InfoCard label="RAM" value={flavor.ram} />
                  <DetailHeader.InfoCard label="Visibility" value={flavor.visibility} />
                  <DetailHeader.InfoCard label="Created at" value={flavor.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Flavor Tabs */}
              <div className="w-full">
                <Tabs
                  value={activeDetailTab}
                  onChange={setActiveDetailTab}
                  variant="underline"
                  size="sm"
                >
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="instances">Instances</Tab>
                    <Tab value="parameters">Parameters</Tab>
                  </TabList>

                  {/* Details Tab Panel */}
                  <TabPanel value="details" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Basic information */}
                      <SectionCard>
                        <SectionCard.Header title="Basic information" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Flavor name" value={flavor.name} />
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
                          <SectionCard.DataRow
                            label="Ephemeral disk"
                            value={flavor.ephemeralDisk}
                          />
                          <SectionCard.DataRow label="NUMA Nodes" value={flavor.numaNodes} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Advanced */}
                      <SectionCard>
                        <SectionCard.Header title="Advanced" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="CPU Policy" value={flavor.cpuPolicy} />
                          <SectionCard.DataRow
                            label="CPU Thread Policy"
                            value={flavor.cpuThreadPolicy}
                          />
                          <SectionCard.DataRow label="Memory page" value={flavor.memoryPage} />
                          <SectionCard.DataRow
                            label="Internal network Bandwidth"
                            value={flavor.internalNetworkBandwidth}
                          />
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
                  <TabPanel value="instances" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Section Header */}
                      <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                        Instances
                      </h2>

                      {/* Search */}
                      <div className="w-[var(--search-input-width)]">
                        <SearchInput
                          placeholder="Search instance by attributes"
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
                  <TabPanel value="parameters" className="pt-0">
                    <div className="pt-6">
                      <div className="bg-[var(--primitive-color-blue-gray900)] dark:bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md p-4 w-full min-h-[576px] overflow-auto">
                        <pre className="font-mono text-body-md leading-[18px] text-[var(--primitive-color-blue-gray200)] dark:text-[var(--primitive-color-blue-gray800)] whitespace-pre">
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
