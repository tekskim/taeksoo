import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconBell,
  IconDotsCircleHorizontal,
  IconLock,
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

// Flavor data map by ID - synced with ComputeAdminFlavorsPage mock data
const mockFlavorsMap: Record<string, FlavorDetail> = {
  'flv-001': {
    id: 'flv-001',
    name: 'c5.large',
    category: 'Compute Optimized',
    vcpu: 2,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: 'Sep 15, 2025 12:22:26',
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
    createdAt: 'Sep 10, 2025 01:17:01',
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
    createdAt: 'Sep 5, 2025 14:12:36',
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
    createdAt: 'Sep 1, 2025 10:20:28',
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
    createdAt: 'Aug 30, 2025 21:37:41',
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
    createdAt: 'Aug 25, 2025 10:32:16',
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
    createdAt: 'Aug 20, 2025 23:27:51',
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
    createdAt: 'Aug 15, 2025 12:22:26',
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
    createdAt: 'Aug 10, 2025 01:17:01',
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
    createdAt: 'Aug 5, 2025 14:12:36',
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
    createdAt: 'Aug 1, 2025 10:20:28',
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
    createdAt: 'Jul 28, 2025 07:11:07',
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
    createdAt: 'Jul 25, 2025 10:32:16',
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
    createdAt: 'Jul 20, 2025 23:27:51',
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
    createdAt: 'Jul 15, 2025 12:22:26',
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
  createdAt: `Sep ${String(30 - (i % 28)).padStart(2, '0')}, 2025`,
}));

/* ----------------------------------------
   Flavor Detail Page
   ---------------------------------------- */

export function ComputeAdminFlavorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const flavor = id ? mockFlavorsMap[id] || defaultFlavorDetail : defaultFlavorDetail;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

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
    { label: 'Compute Admin', href: '/compute-admin' },
    { label: 'Flavors', href: '/compute-admin/flavors' },
    { label: flavor.name, href: `/compute-admin/flavors/${flavor.id}` },
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
      render: (_, row) => <StatusIndicator layout="icon-only" status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/instances/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
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
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        ) : null,
    },
    {
      key: 'image',
      label: 'OS',
      flex: 1,
      sortable: true,
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
      label: 'Created at',
      flex: 1,
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
    <PageShell
      sidebar={
        <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
        />
      }
      topBar={
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
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Flavor Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{flavor.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
              Create instance template
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="ID" value={flavor.id} copyable />
            <DetailHeader.InfoCard label="Category" value={flavor.category} />
            <DetailHeader.InfoCard label="vCPU" value={String(flavor.vcpu)} />
            <DetailHeader.InfoCard label="RAM" value={flavor.ram} />
            <DetailHeader.InfoCard label="Root disk" value="0GiB" />
            <DetailHeader.InfoCard label="Public" value="On" />
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
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic information */}
                <SectionCard>
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Flavor name" value={flavor.name} />
                    <SectionCard.DataRow label="Category" value={flavor.category} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Specification */}
                <SectionCard>
                  <SectionCard.Header title="Specification" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="vCPU" value={String(flavor.vcpu)} />
                    <SectionCard.DataRow label="RAM" value={flavor.ram} />
                    <SectionCard.DataRow label="Root disk" value="0GiB" />
                    <SectionCard.DataRow label="Ephemeral disk" value={flavor.ephemeralDisk} />
                    <SectionCard.DataRow label="Swap disk" value={flavor.numaNodes} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Security */}
                <SectionCard>
                  <SectionCard.Header title="Security" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Visibility" value={flavor.visibility} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Metadata */}
                <SectionCard>
                  <SectionCard.Header title="Metadata" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="{metadata}" value="{value}" />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Instances Tab Panel */}
            <TabPanel value="instances" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">Instances</h2>

                {/* Search */}
                <div>
                  <SearchInput
                    placeholder="Search instance by attributes"
                    value={instanceSearchQuery}
                    onChange={(e) => setInstanceSearchQuery(e.target.value)}
                    onClear={() => setInstanceSearchQuery('')}
                    size="sm"
                    className="w-[280px]"
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
                <div className="bg-[#141414] dark:bg-[#FAFAFA] border border-[var(--color-border-default)] rounded-md p-4 w-full min-h-[576px] overflow-auto">
                  <pre className="font-mono text-body-md leading-[18px] text-[#e2e8f0] dark:text-[#1e293b] whitespace-pre">
                    {JSON.stringify(mockFlavorParameters, null, 5)}
                  </pre>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default ComputeAdminFlavorDetailPage;
