import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Button,
  FilterSearchInput,
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
  ContextMenu,
  type TableColumn,
  type StatusType,
  type FilterField,
  type AppliedFilter,
  type FilterItem,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconDotsCircleHorizontal,
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
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  CreateInstanceSnapshotDrawer,
  type InstanceInfo,
} from '@/components/CreateInstanceSnapshotDrawer';
import {
  LockSettingDrawer,
  type InstanceInfo as LockInstanceInfo,
} from '@/components/LockSettingDrawer';
import {
  EditInstanceDrawer,
  type InstanceInfo as EditInstanceInfo,
} from '@/components/EditInstanceDrawer';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type InstanceStatus = 'running' | 'stopped' | 'pending' | 'error' | 'building';

interface Instance {
  id: string;
  name: string;
  status: InstanceStatus;
  locked: boolean;
  tenant: string;
  tenantId: string;
  host: string;
  fixedIp: string;
  floatingIp: string;
  image: string;
  flavor: string;
  vcpu: number;
  ram: string;
  disk: string;
  gpu: string;
  az: string;
  description?: string;
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
  {
    id: 'vm-001',
    name: 'worker-node-01',
    status: 'running',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-01',
    fixedIp: '10.20.30.40',
    floatingIp: '20.30.40.50',
    image: 'CentOS 7',
    flavor: 'Medium',
    vcpu: 4,
    ram: '8GB',
    disk: '100GB',
    gpu: '1',
    az: 'keystone',
  },
  {
    id: 'vm-002',
    name: 'worker-node-02',
    status: 'running',
    locked: false,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-01',
    fixedIp: '10.20.30.41',
    floatingIp: '20.30.40.51',
    image: 'CentOS 7',
    flavor: 'Medium',
    vcpu: 4,
    ram: '8GB',
    disk: '100GB',
    gpu: '1',
    az: 'keystone',
  },
  {
    id: 'vm-003',
    name: 'master-node-01',
    status: 'running',
    locked: true,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-02',
    fixedIp: '10.20.30.10',
    floatingIp: '20.30.40.10',
    image: 'Ubuntu 22.04',
    flavor: 'Large',
    vcpu: 8,
    ram: '16GB',
    disk: '200GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-004',
    name: 'db-server-01',
    status: 'stopped',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-03',
    fixedIp: '10.20.30.20',
    floatingIp: '-',
    image: 'CentOS 8',
    flavor: 'XLarge',
    vcpu: 16,
    ram: '64GB',
    disk: '500GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-005',
    name: 'gpu-node-01',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'gpu-compute-01',
    fixedIp: '10.20.30.50',
    floatingIp: '20.30.40.60',
    image: 'Ubuntu 22.04',
    flavor: 'GPU Large',
    vcpu: 32,
    ram: '128GB',
    disk: '1TB',
    gpu: '4',
    az: 'nova',
  },
  {
    id: 'vm-006',
    name: 'gpu-node-02',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'gpu-compute-01',
    fixedIp: '10.20.30.51',
    floatingIp: '20.30.40.61',
    image: 'Ubuntu 22.04',
    flavor: 'GPU Large',
    vcpu: 32,
    ram: '128GB',
    disk: '1TB',
    gpu: '4',
    az: 'nova',
  },
  {
    id: 'vm-007',
    name: 'web-server-01',
    status: 'pending',
    locked: false,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-02',
    fixedIp: '-',
    floatingIp: '-',
    image: 'Rocky Linux 9',
    flavor: 'Small',
    vcpu: 2,
    ram: '4GB',
    disk: '50GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-008',
    name: 'web-server-02',
    status: 'building',
    locked: false,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-04',
    fixedIp: '-',
    floatingIp: '-',
    image: 'Rocky Linux 9',
    flavor: 'Small',
    vcpu: 2,
    ram: '4GB',
    disk: '50GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-009',
    name: 'analytics-01',
    status: 'error',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-05',
    fixedIp: '10.20.30.80',
    floatingIp: '-',
    image: 'Debian 12',
    flavor: 'XLarge',
    vcpu: 16,
    ram: '32GB',
    disk: '500GB',
    gpu: '2',
    az: 'nova',
  },
  {
    id: 'vm-010',
    name: 'cache-server-01',
    status: 'running',
    locked: false,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-06',
    fixedIp: '10.20.30.90',
    floatingIp: '20.30.40.90',
    image: 'Debian 12',
    flavor: 'Medium',
    vcpu: 4,
    ram: '16GB',
    disk: '100GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-011',
    name: 'api-gateway-01',
    status: 'running',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-01',
    fixedIp: '10.20.30.100',
    floatingIp: '20.30.40.100',
    image: 'Ubuntu 22.04',
    flavor: 'Medium',
    vcpu: 4,
    ram: '8GB',
    disk: '100GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-012',
    name: 'api-gateway-02',
    status: 'running',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-02',
    fixedIp: '10.20.30.101',
    floatingIp: '20.30.40.101',
    image: 'Ubuntu 22.04',
    flavor: 'Medium',
    vcpu: 4,
    ram: '8GB',
    disk: '100GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-013',
    name: 'monitoring-01',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'compute-03',
    fixedIp: '10.20.30.110',
    floatingIp: '-',
    image: 'CentOS 8',
    flavor: 'Large',
    vcpu: 8,
    ram: '32GB',
    disk: '500GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-014',
    name: 'logging-server-01',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'compute-04',
    fixedIp: '10.20.30.120',
    floatingIp: '-',
    image: 'Debian 12',
    flavor: 'XLarge',
    vcpu: 16,
    ram: '64GB',
    disk: '2TB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-015',
    name: 'jenkins-master',
    status: 'running',
    locked: true,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-05',
    fixedIp: '10.20.30.130',
    floatingIp: '20.30.40.130',
    image: 'Ubuntu 22.04',
    flavor: 'Large',
    vcpu: 8,
    ram: '16GB',
    disk: '200GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-016',
    name: 'jenkins-agent-01',
    status: 'running',
    locked: false,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-06',
    fixedIp: '10.20.30.131',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    flavor: 'Medium',
    vcpu: 4,
    ram: '8GB',
    disk: '100GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-017',
    name: 'jenkins-agent-02',
    status: 'stopped',
    locked: false,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-06',
    fixedIp: '10.20.30.132',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    flavor: 'Medium',
    vcpu: 4,
    ram: '8GB',
    disk: '100GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-018',
    name: 'gitlab-server',
    status: 'running',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-07',
    fixedIp: '10.20.30.140',
    floatingIp: '20.30.40.140',
    image: 'CentOS 8',
    flavor: 'XLarge',
    vcpu: 16,
    ram: '32GB',
    disk: '1TB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-019',
    name: 'nexus-repo',
    status: 'running',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-08',
    fixedIp: '10.20.30.150',
    floatingIp: '-',
    image: 'Rocky Linux 9',
    flavor: 'Large',
    vcpu: 8,
    ram: '16GB',
    disk: '500GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-020',
    name: 'redis-cluster-01',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'compute-01',
    fixedIp: '10.20.30.160',
    floatingIp: '-',
    image: 'Debian 12',
    flavor: 'Medium',
    vcpu: 4,
    ram: '16GB',
    disk: '50GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-021',
    name: 'redis-cluster-02',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'compute-02',
    fixedIp: '10.20.30.161',
    floatingIp: '-',
    image: 'Debian 12',
    flavor: 'Medium',
    vcpu: 4,
    ram: '16GB',
    disk: '50GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-022',
    name: 'redis-cluster-03',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'compute-03',
    fixedIp: '10.20.30.162',
    floatingIp: '-',
    image: 'Debian 12',
    flavor: 'Medium',
    vcpu: 4,
    ram: '16GB',
    disk: '50GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-023',
    name: 'kafka-broker-01',
    status: 'running',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-04',
    fixedIp: '10.20.30.170',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    flavor: 'Large',
    vcpu: 8,
    ram: '32GB',
    disk: '500GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-024',
    name: 'kafka-broker-02',
    status: 'running',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-05',
    fixedIp: '10.20.30.171',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    flavor: 'Large',
    vcpu: 8,
    ram: '32GB',
    disk: '500GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-025',
    name: 'kafka-broker-03',
    status: 'error',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-06',
    fixedIp: '10.20.30.172',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    flavor: 'Large',
    vcpu: 8,
    ram: '32GB',
    disk: '500GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-026',
    name: 'ml-training-01',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'gpu-compute-02',
    fixedIp: '10.20.30.180',
    floatingIp: '20.30.40.180',
    image: 'Ubuntu 22.04',
    flavor: 'GPU XLarge',
    vcpu: 64,
    ram: '256GB',
    disk: '2TB',
    gpu: '8',
    az: 'nova',
  },
  {
    id: 'vm-027',
    name: 'ml-inference-01',
    status: 'running',
    locked: false,
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    host: 'gpu-compute-03',
    fixedIp: '10.20.30.181',
    floatingIp: '20.30.40.181',
    image: 'Ubuntu 22.04',
    flavor: 'GPU Large',
    vcpu: 32,
    ram: '128GB',
    disk: '1TB',
    gpu: '4',
    az: 'nova',
  },
  {
    id: 'vm-028',
    name: 'bastion-host',
    status: 'running',
    locked: true,
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    host: 'compute-07',
    fixedIp: '10.20.30.190',
    floatingIp: '20.30.40.190',
    image: 'Rocky Linux 9',
    flavor: 'Small',
    vcpu: 2,
    ram: '4GB',
    disk: '50GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-029',
    name: 'vpn-server',
    status: 'running',
    locked: true,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-08',
    fixedIp: '10.20.30.200',
    floatingIp: '20.30.40.200',
    image: 'CentOS 8',
    flavor: 'Small',
    vcpu: 2,
    ram: '4GB',
    disk: '50GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-030',
    name: 'test-instance-01',
    status: 'pending',
    locked: false,
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    host: 'compute-01',
    fixedIp: '-',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    flavor: 'Small',
    vcpu: 2,
    ram: '4GB',
    disk: '50GB',
    gpu: '-',
    az: 'nova',
  },
];

const mockBareMetalInstances: BareMetalInstance[] = [
  {
    id: 'bm-001',
    name: 'web-server-1',
    status: 'running',
    ip: '10.62.0.30',
    image: 'BM image',
    flavor: 'BM flavor',
    cpu: 8,
    ram: '16GiB',
    disk: '10GiB',
    gpu: '-',
    az: 'zone-a',
  },
  {
    id: 'bm-002',
    name: 'web-server-2',
    status: 'running',
    ip: '10.62.0.31',
    image: 'BM image',
    flavor: 'BM flavor',
    cpu: 8,
    ram: '16GiB',
    disk: '10GiB',
    gpu: '-',
    az: 'zone-a',
  },
  {
    id: 'bm-003',
    name: 'db-server-1',
    status: 'running',
    ip: '10.62.0.40',
    image: 'BM image',
    flavor: 'BM large',
    cpu: 16,
    ram: '64GiB',
    disk: '500GiB',
    gpu: '-',
    az: 'zone-b',
  },
  {
    id: 'bm-004',
    name: 'db-server-2',
    status: 'stopped',
    ip: '10.62.0.41',
    image: 'BM image',
    flavor: 'BM large',
    cpu: 16,
    ram: '64GiB',
    disk: '500GiB',
    gpu: '-',
    az: 'zone-b',
  },
  {
    id: 'bm-005',
    name: 'gpu-node-1',
    status: 'running',
    ip: '10.62.0.50',
    image: 'BM GPU',
    flavor: 'BM GPU',
    cpu: 32,
    ram: '128GiB',
    disk: '1TiB',
    gpu: 'A100 x4',
    az: 'zone-c',
  },
  {
    id: 'bm-006',
    name: 'gpu-node-2',
    status: 'running',
    ip: '10.62.0.51',
    image: 'BM GPU',
    flavor: 'BM GPU',
    cpu: 32,
    ram: '128GiB',
    disk: '1TiB',
    gpu: 'A100 x4',
    az: 'zone-c',
  },
  {
    id: 'bm-007',
    name: 'compute-1',
    status: 'pending',
    ip: '—',
    image: 'BM image',
    flavor: 'BM xlarge',
    cpu: 64,
    ram: '256GiB',
    disk: '2TiB',
    gpu: '-',
    az: 'zone-a',
  },
  {
    id: 'bm-008',
    name: 'compute-2',
    status: 'building',
    ip: '—',
    image: 'BM image',
    flavor: 'BM xlarge',
    cpu: 64,
    ram: '256GiB',
    disk: '2TiB',
    gpu: '-',
    az: 'zone-a',
  },
  {
    id: 'bm-009',
    name: 'storage-node-1',
    status: 'running',
    ip: '10.62.0.60',
    image: 'BM storage',
    flavor: 'BM storage',
    cpu: 8,
    ram: '32GiB',
    disk: '10TiB',
    gpu: '-',
    az: 'zone-b',
  },
  {
    id: 'bm-010',
    name: 'storage-node-2',
    status: 'error',
    ip: '10.62.0.61',
    image: 'BM storage',
    flavor: 'BM storage',
    cpu: 8,
    ram: '32GiB',
    disk: '10TiB',
    gpu: '-',
    az: 'zone-b',
  },
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
   Instances list Page
   ---------------------------------------- */

// Filter fields definition for FilterSearchInput
const filterFields: FilterField[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter instance name...',
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'running', label: 'Running' },
      { value: 'stopped', label: 'Stopped' },
      { value: 'error', label: 'Error' },
      { value: 'building', label: 'Building' },
    ],
  },
  {
    id: 'tenant',
    label: 'Tenant',
    type: 'select',
    options: [
      { value: 'Tenant A', label: 'Tenant A' },
      { value: 'Tenant B', label: 'Tenant B' },
      { value: 'Tenant C', label: 'Tenant C' },
    ],
  },
  {
    id: 'host',
    label: 'Host',
    type: 'text',
    placeholder: 'Enter host...',
  },
  {
    id: 'os',
    label: 'OS',
    type: 'select',
    options: [
      { value: 'ubuntu', label: 'Ubuntu' },
      { value: 'centos', label: 'CentOS' },
      { value: 'windows', label: 'Windows' },
      { value: 'rocky', label: 'Rocky Linux' },
    ],
  },
  {
    id: 'flavor',
    label: 'Flavor',
    type: 'text',
    placeholder: 'Enter flavor...',
  },
];

export function ComputeAdminInstanceListPage() {
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBareMetalPage, setCurrentBareMetalPage] = useState(1);
  const [activeTab, setActiveTab] = useState('vm');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const handleFiltersChange = (filters: AppliedFilter[]) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setCurrentBareMetalPage(1);
  };

  const removeFilter = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
  };

  // Convert AppliedFilter[] to FilterItem[] for ListToolbar
  const toolbarFilters: FilterItem[] = appliedFilters.map((f) => ({
    id: f.id,
    field: f.fieldLabel,
    value: f.valueLabel || f.value,
  }));

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Create instance snapshot Drawer state
  const [isSnapshotDrawerOpen, setIsSnapshotDrawerOpen] = useState(false);
  const [selectedInstanceForSnapshot, setSelectedInstanceForSnapshot] =
    useState<InstanceInfo | null>(null);

  // Lock setting Drawer state
  const [isLockDrawerOpen, setIsLockDrawerOpen] = useState(false);
  const [selectedInstanceForLock, setSelectedInstanceForLock] = useState<LockInstanceInfo | null>(
    null
  );

  // Edit instance Drawer state
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedInstanceForEdit, setSelectedInstanceForEdit] = useState<EditInstanceInfo | null>(
    null
  );

  // Table selection state
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [selectedBareMetalInstances, setSelectedBareMetalInstances] = useState<string[]>([]);

  // Shell Panel state (using hook for multi-tab support)
  const shellPanel = useShellPanel();
  const navigate = useNavigate();
  const { addTab } = useTabs();

  // Scroll container ref for maintaining scroll position
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  // Preserve scroll position when shell panel opens
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (shellPanel.isExpanded) {
      // When panel opens, restore scroll position
      container.scrollTop = scrollPositionRef.current;
    } else {
      // When panel closes, save current scroll position
      scrollPositionRef.current = container.scrollTop;
    }
  }, [shellPanel.isExpanded]);

  // Handle opening shell tab in new browser tab
  const handleOpenInNewTab = (tab: ShellTab) => {
    // Add tab to the tab bar (keeps shell panel tab intact)
    const tabId = `console-${tab.instanceId}-${Date.now()}`;
    addTab({
      id: tabId,
      label: tab.title,
      path: `/compute-admin/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    // Navigate to the console page (new tab becomes active)
    navigate(`/compute-admin/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  // Default column config for VM instances
  const defaultVMColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'locked', label: 'Locked', visible: true },
    { id: 'tenant', label: 'Tenant', visible: true },
    { id: 'host', label: 'Host', visible: true },
    { id: 'fixedIp', label: 'Fixed IP', visible: true },
    { id: 'floatingIp', label: 'Floating IP', visible: true },
    { id: 'image', label: 'OS', visible: true },
    { id: 'flavor', label: 'Flavor', visible: true },
    { id: 'vcpu', label: 'vCPU', visible: true },
    { id: 'ram', label: 'RAM', visible: true },
    { id: 'disk', label: 'Disk', visible: true },
    { id: 'gpu', label: 'GPU', visible: true },
    { id: 'az', label: 'AZ', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];

  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultVMColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

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

  // Filter instances based on appliedFilters
  const filteredInstances = mockInstances.filter((instance) => {
    if (appliedFilters.length === 0) return true;

    return appliedFilters.every((filter) => {
      const fieldId = filter.fieldId;
      const filterValue = filter.value.toLowerCase();

      switch (fieldId) {
        case 'name':
          return instance.name.toLowerCase().includes(filterValue);
        case 'status':
          return instance.status.toLowerCase() === filterValue;
        case 'os':
          return instance.os.toLowerCase().includes(filterValue);
        case 'flavor':
          return instance.flavor.toLowerCase().includes(filterValue);
        default:
          return true;
      }
    });
  });

  const filteredBareMetalInstances = mockBareMetalInstances.filter((instance) => {
    if (appliedFilters.length === 0) return true;

    return appliedFilters.every((filter) => {
      const fieldId = filter.fieldId;
      const filterValue = filter.value.toLowerCase();

      switch (fieldId) {
        case 'name':
          return instance.name.toLowerCase().includes(filterValue);
        case 'status':
          return instance.status.toLowerCase() === filterValue;
        case 'os':
          return instance.os.toLowerCase().includes(filterValue);
        case 'flavor':
          return instance.flavor.toLowerCase().includes(filterValue);
        default:
          return true;
      }
    });
  });

  const totalPages = Math.ceil(filteredInstances.length / rowsPerPage);
  const totalBareMetalPages = Math.ceil(filteredBareMetalInstances.length / rowsPerPage);

  // Get paginated data
  const paginatedInstances = (() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredInstances.slice(start, start + rowsPerPage);
  })();

  const paginatedBareMetalInstances = (() => {
    const start = (currentBareMetalPage - 1) * rowsPerPage;
    return filteredBareMetalInstances.slice(start, start + rowsPerPage);
  })();

  // Handle create snapshot click
  const handleCreateSnapshot = (instance: Instance) => {
    setSelectedInstanceForSnapshot({
      id: instance.id,
      name: instance.name,
      image: instance.image,
      flavor: instance.flavor,
    });
    setIsSnapshotDrawerOpen(true);
  };

  // Handle lock setting click
  const handleLockSetting = (instance: Instance) => {
    setSelectedInstanceForLock({
      id: instance.id,
      name: instance.name,
      isLocked: instance.locked,
    });
    setIsLockDrawerOpen(true);
  };

  // Handle edit instance click
  const handleEditInstance = (instance: Instance) => {
    setSelectedInstanceForEdit({
      id: instance.id,
      name: instance.name,
      description: instance.description,
    });
    setIsEditDrawerOpen(true);
  };

  // Context menu items for instances
  const getInstanceContextMenuItems = (instance: Instance): ContextMenuItem[] => [
    {
      id: 'instance-status',
      label: 'Instance status',
      submenu: [
        { id: 'start', label: 'Start' },
        { id: 'stop', label: 'Stop', status: 'danger' },
        { id: 'reboot', label: 'Reboot', status: 'danger' },
        { id: 'soft-reboot', label: 'Soft reboot' },
        { id: 'pause', label: 'Pause' },
        { id: 'suspend', label: 'Suspend' },
        { id: 'shelve', label: 'Shelve' },
        { id: 'unpause', label: 'Unpause' },
        { id: 'resume', label: 'Resume' },
        { id: 'unshelve', label: 'Unshelve' },
        { id: 'rescue', label: 'Rescue' },
        { id: 'unrescue', label: 'Unrescue' },
      ],
    },
    {
      id: 'configuration',
      label: 'Configuration',
      submenu: [
        {
          id: 'lock-setting',
          label: 'Lock setting',
          onClick: () => handleLockSetting(instance),
        },
        {
          id: 'edit',
          label: 'Edit',
          onClick: () => handleEditInstance(instance),
        },
      ],
    },
    { id: 'migrate', label: 'Migrate' },
    { id: 'live-migrate', label: 'Live migrate' },
    { id: 'confirm-resize', label: 'Confirm resize' },
    { id: 'revert-resize', label: 'Revert resize' },
    { id: 'delete', label: 'Delete', status: 'danger' },
  ];

  // Table columns definition
  const columns: TableColumn<Instance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusIndicator status={statusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute-admin/instances/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
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
      sortable: false,
      render: (_, row) =>
        row.locked ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        ) : null,
    },
    {
      key: 'tenant',
      label: 'Tenant',
      flex: 1,
      minWidth: columnMinWidths.user,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/tenants/${row.tenantId}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.tenant}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.tenantId}</span>
        </div>
      ),
    },
    {
      key: 'host',
      label: 'Host',
      flex: 1,
      minWidth: columnMinWidths.hostname,
      sortable: true,
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
      minWidth: columnMinWidths.fixedIp,
      sortable: false,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      minWidth: columnMinWidths.floatingIp,
      sortable: false,
    },
    {
      key: 'image',
      label: 'OS',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
      render: (_, row) => <span className="font-medium">{row.image}</span>,
    },
    {
      key: 'flavor',
      label: 'Flavor',
      flex: 1,
      minWidth: columnMinWidths.flavor,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/flavors/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.flavor}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            ID : {row.id.substring(0, 8)}
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
      key: 'disk',
      label: 'Disk',
      flex: 1,
      minWidth: columnMinWidths.disk,
      sortable: true,
    },
    {
      key: 'gpu',
      label: 'GPU',
      flex: 1,
      minWidth: columnMinWidths.gpu,
      sortable: true,
    },
    {
      key: 'az',
      label: 'AZ',
      flex: 1,
      minWidth: columnMinWidths.az,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <HStack gap={1} className="justify-center">
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            onClick={(e) => {
              e.stopPropagation();
              shellPanel.openConsole(row.id, row.name);
            }}
            title="Open console"
          >
            <IconTerminal2 size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={getInstanceContextMenuItems(row)} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        </HStack>
      ),
    },
  ];

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<Instance> => col !== undefined);
  }, [columns, columnConfig]);

  // Bare Metal Table columns definition
  const bareMetalColumns: TableColumn<BareMetalInstance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusIndicator status={statusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/bare-metal/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'ip',
      label: 'Fixed IP',
      flex: 1,
      minWidth: columnMinWidths.fixedIp,
      sortable: false,
    },
    {
      key: 'image',
      label: 'Image',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/images/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.image}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            ID : {row.id.substring(0, 8)}
          </span>
        </div>
      ),
    },
    {
      key: 'flavor',
      label: 'Flavor',
      flex: 1,
      minWidth: columnMinWidths.flavor,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/flavors/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.flavor}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            ID : {row.id.substring(0, 8)}
          </span>
        </div>
      ),
    },
    {
      key: 'cpu',
      label: 'CPU',
      flex: 1,
      minWidth: columnMinWidths.cpu,
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
      key: 'disk',
      label: 'Disk',
      flex: 1,
      minWidth: columnMinWidths.disk,
      sortable: true,
    },
    {
      key: 'gpu',
      label: 'GPU',
      flex: 1,
      minWidth: columnMinWidths.gpu,
      sortable: true,
    },
    {
      key: 'az',
      label: 'AZ',
      flex: 1,
      minWidth: columnMinWidths.az,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <HStack gap={1} className="justify-center">
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            onClick={(e) => {
              e.stopPropagation();
              shellPanel.openConsole(row.id, row.name);
            }}
            title="Open console"
          >
            <IconTerminal2 size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--action-icon-color)]"
            />
          </button>
        </HStack>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}
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
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar with Breadcrumb Navigation */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={openSidebar}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Compute Admin', href: '/compute-admin' },
                  { label: 'Instances list' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={12} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto overscroll-contain sidebar-scroll"
          style={{ paddingBottom: shellPanel.isExpanded ? '350px' : '0' }}
        >
          {/* Page Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">Instances list</h1>
              </div>

              {/* Type Tabs */}
              <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                <TabList>
                  <Tab value="vm">VM</Tab>
                  <Tab value="bare-metal">Bare metal</Tab>
                </TabList>
              </Tabs>

              {/* List Toolbar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={filterFields}
                      appliedFilters={appliedFilters}
                      onFiltersChange={handleFiltersChange}
                      placeholder="Search instance by attributes"
                      size="sm"
                      className="w-[var(--search-input-width)]"
                      hideAppliedFilters
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconDownload size={12} />}
                      aria-label="Download"
                    />
                  </ListToolbar.Actions>
                }
                bulkActions={
                  <ListToolbar.Actions>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconPlayerPlay size={12} />}
                      disabled={
                        activeTab === 'vm'
                          ? selectedInstances.length === 0
                          : selectedBareMetalInstances.length === 0
                      }
                    >
                      Start
                    </Button>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconPlayerStop size={12} />}
                      disabled={
                        activeTab === 'vm'
                          ? selectedInstances.length === 0
                          : selectedBareMetalInstances.length === 0
                      }
                    >
                      Stop
                    </Button>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconRefresh size={12} />}
                      disabled={
                        activeTab === 'vm'
                          ? selectedInstances.length === 0
                          : selectedBareMetalInstances.length === 0
                      }
                    >
                      Reboot
                    </Button>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconTrash size={12} />}
                      disabled={
                        activeTab === 'vm'
                          ? selectedInstances.length === 0
                          : selectedBareMetalInstances.length === 0
                      }
                    >
                      Delete
                    </Button>
                  </ListToolbar.Actions>
                }
                filters={toolbarFilters}
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
                  totalItems={filteredInstances.length}
                />
              )}
              {activeTab === 'bare-metal' && filteredBareMetalInstances.length > 0 && (
                <Pagination
                  currentPage={currentBareMetalPage}
                  totalPages={totalBareMetalPages}
                  onPageChange={setCurrentBareMetalPage}
                  showSettings
                  onSettingsClick={() => setIsPreferencesOpen(true)}
                  totalItems={filteredBareMetalInstances.length}
                  selectedCount={selectedBareMetalInstances.length}
                />
              )}

              {/* VM Table */}
              {activeTab === 'vm' && (
                <Table<Instance>
                  columns={visibleColumns}
                  data={paginatedInstances}
                  rowKey="id"
                  emptyMessage="No instances found"
                  selectable
                  selectedKeys={selectedInstances}
                  onSelectionChange={setSelectedInstances}
                />
              )}

              {/* Bare Metal Table */}
              {activeTab === 'bare-metal' && (
                <Table<BareMetalInstance>
                  columns={bareMetalColumns}
                  data={paginatedBareMetalInstances}
                  rowKey="id"
                  emptyMessage="No bare metal instances found"
                  selectable
                  selectedKeys={selectedBareMetalInstances}
                  onSelectionChange={setSelectedBareMetalInstances}
                />
              )}
            </VStack>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-10 h-10 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <IconArrowUp size={20} stroke={1.5} />
        </button>
      )}

      {/* View Preferences Drawer */}
      <ViewPreferencesDrawer
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columnConfig}
        defaultColumns={defaultVMColumnConfig}
        onColumnsChange={setColumnConfig}
      />

      {/* Create instance snapshot Drawer */}
      <CreateInstanceSnapshotDrawer
        isOpen={isSnapshotDrawerOpen}
        onClose={() => {
          setIsSnapshotDrawerOpen(false);
          setSelectedInstanceForSnapshot(null);
        }}
        instance={selectedInstanceForSnapshot}
        onSubmit={(snapshotName, description) => {
          console.log(
            'Creating snapshot:',
            snapshotName,
            'description:',
            description,
            'for instance:',
            selectedInstanceForSnapshot?.id
          );
          // TODO: Implement actual snapshot creation API call
        }}
      />

      {/* Lock setting Drawer */}
      <LockSettingDrawer
        isOpen={isLockDrawerOpen}
        onClose={() => {
          setIsLockDrawerOpen(false);
          setSelectedInstanceForLock(null);
        }}
        instance={selectedInstanceForLock}
        onSubmit={(isLocked) => {
          console.log(
            'Setting lock status:',
            isLocked,
            'for instance:',
            selectedInstanceForLock?.id
          );
          // TODO: Implement actual lock setting API call
        }}
      />

      {/* Edit instance Drawer */}
      <EditInstanceDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setSelectedInstanceForEdit(null);
        }}
        instance={selectedInstanceForEdit}
        onSubmit={(name, description) => {
          console.log(
            'Editing instance:',
            name,
            'description:',
            description,
            'for instance:',
            selectedInstanceForEdit?.id
          );
          // TODO: Implement actual edit API call
        }}
      />

      {/* Shell Panel (Multi-tab Console) */}
      <ShellPanel
        isExpanded={shellPanel.isExpanded}
        onExpandedChange={shellPanel.setIsExpanded}
        tabs={shellPanel.tabs}
        activeTabId={shellPanel.activeTabId}
        onActiveTabChange={shellPanel.setActiveTabId}
        onCloseTab={shellPanel.closeTab}
        onContentChange={shellPanel.updateContent}
        onClear={shellPanel.clearContent}
        onOpenInNewTab={handleOpenInNewTab}
        initialHeight={350}
        minHeight={300}
        sidebarOpen={sidebarOpen}
      />
    </div>
  );
}

export default ComputeAdminInstanceListPage;
