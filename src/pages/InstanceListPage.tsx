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
  Tooltip,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type StatusType,
  type FilterField,
  type AppliedFilter,
  type FilterItem,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconDotsCircleHorizontal,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconPower,
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
import { AttachVolumeDrawer } from '@/components/AttachVolumeDrawer';
import {
  DetachVolumeDrawer,
  type InstanceInfo as DetachVolumeInstanceInfo,
} from '@/components/DetachVolumeDrawer';
import {
  AttachInterfaceDrawer,
  type InstanceInfo as AttachInterfaceInstanceInfo,
} from '@/components/AttachInterfaceDrawer';
import {
  DetachInterfaceDrawer,
  type InstanceInfo as DetachInterfaceInstanceInfo,
} from '@/components/DetachInterfaceDrawer';
import { AssociateFloatingIPDrawer } from '@/components/AssociateFloatingIPDrawer';
import {
  DisassociateFloatingIPDrawer,
  type InstanceInfo as DisassociateFloatingIPInstanceInfo,
} from '@/components/DisassociateFloatingIPDrawer';
import {
  ManageSecurityGroupsDrawer,
  type InstanceInfo as ManageSecurityGroupsInstanceInfo,
} from '@/components/ManageSecurityGroupsDrawer';
import {
  RebuildInstanceDrawer,
  type InstanceInfo as RebuildInstanceInfo,
} from '@/components/RebuildInstanceDrawer';
import {
  ResizeInstanceDrawer,
  type InstanceInfo as ResizeInstanceInfo,
} from '@/components/ResizeInstanceDrawer';
import {
  ManageTagsDrawer,
  type InstanceInfo as ManageTagsInstanceInfo,
} from '@/components/ManageTagsDrawer';
import {
  RescueInstanceDrawer,
  type InstanceInfo as RescueInstanceInfo,
} from '@/components/RescueInstanceDrawer';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import containerIcon from '@/assets/appIcon/container.png';

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
  os: string;
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
  locked: boolean;
  os: string;
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
    fixedIp: '10.20.30.40',
    floatingIp: '20.30.40.50',
    os: 'Ubuntu 24.04',
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
    fixedIp: '10.20.30.41',
    floatingIp: '20.30.40.51',
    os: 'CentOS 7',
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
    fixedIp: '10.20.30.10',
    floatingIp: '20.30.40.10',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.20',
    floatingIp: '-',
    os: 'CentOS 8',
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
    fixedIp: '10.20.30.50',
    floatingIp: '20.30.40.60',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.51',
    floatingIp: '20.30.40.61',
    os: 'Ubuntu 22.04',
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
    fixedIp: '-',
    floatingIp: '-',
    os: 'Rocky Linux 9',
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
    fixedIp: '-',
    floatingIp: '-',
    os: 'Rocky Linux 9',
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
    fixedIp: '10.20.30.80',
    floatingIp: '-',
    os: 'Debian 12',
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
    fixedIp: '10.20.30.90',
    floatingIp: '20.30.40.90',
    os: 'Debian 12',
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
    fixedIp: '10.20.30.100',
    floatingIp: '20.30.40.100',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.101',
    floatingIp: '20.30.40.101',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.110',
    floatingIp: '-',
    os: 'CentOS 8',
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
    fixedIp: '10.20.30.120',
    floatingIp: '-',
    os: 'Debian 12',
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
    fixedIp: '10.20.30.130',
    floatingIp: '20.30.40.130',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.131',
    floatingIp: '-',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.132',
    floatingIp: '-',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.140',
    floatingIp: '20.30.40.140',
    os: 'CentOS 8',
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
    fixedIp: '10.20.30.150',
    floatingIp: '-',
    os: 'Rocky Linux 9',
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
    fixedIp: '10.20.30.160',
    floatingIp: '-',
    os: 'Debian 12',
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
    fixedIp: '10.20.30.161',
    floatingIp: '-',
    os: 'Debian 12',
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
    fixedIp: '10.20.30.162',
    floatingIp: '-',
    os: 'Debian 12',
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
    fixedIp: '10.20.30.170',
    floatingIp: '-',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.171',
    floatingIp: '-',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.172',
    floatingIp: '-',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.180',
    floatingIp: '20.30.40.180',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.181',
    floatingIp: '20.30.40.181',
    os: 'Ubuntu 22.04',
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
    fixedIp: '10.20.30.190',
    floatingIp: '20.30.40.190',
    os: 'Rocky Linux 9',
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
    fixedIp: '10.20.30.200',
    floatingIp: '20.30.40.200',
    os: 'CentOS 8',
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
    fixedIp: '-',
    floatingIp: '-',
    os: 'Ubuntu 22.04',
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
    locked: false,
    os: 'Ubuntu 22.04',
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
    locked: false,
    os: 'Ubuntu 22.04',
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
    locked: true,
    os: 'Rocky Linux 9',
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
    locked: true,
    os: 'Rocky Linux 9',
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
    locked: false,
    os: 'Ubuntu 22.04',
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
    locked: false,
    os: 'Ubuntu 22.04',
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
    locked: false,
    os: 'CentOS 8',
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
    locked: false,
    os: 'CentOS 8',
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
    locked: true,
    os: 'Debian 12',
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
    locked: true,
    os: 'Debian 12',
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

export function InstanceListPage() {
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBareMetalPage, setCurrentBareMetalPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'vm';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
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

  // Attach Volume Drawer state
  const [isAttachVolumeDrawerOpen, setIsAttachVolumeDrawerOpen] = useState(false);
  const [selectedInstanceForAttachVolume, setSelectedInstanceForAttachVolume] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Detach Volume Drawer state
  const [isDetachVolumeDrawerOpen, setIsDetachVolumeDrawerOpen] = useState(false);
  const [selectedInstanceForDetachVolume, setSelectedInstanceForDetachVolume] =
    useState<DetachVolumeInstanceInfo | null>(null);

  // Attach Interface Drawer state
  const [isAttachInterfaceDrawerOpen, setIsAttachInterfaceDrawerOpen] = useState(false);
  const [selectedInstanceForAttachInterface, setSelectedInstanceForAttachInterface] =
    useState<AttachInterfaceInstanceInfo | null>(null);

  // Detach Interface Drawer state
  const [isDetachInterfaceDrawerOpen, setIsDetachInterfaceDrawerOpen] = useState(false);
  const [selectedInstanceForDetachInterface, setSelectedInstanceForDetachInterface] =
    useState<DetachInterfaceInstanceInfo | null>(null);

  // Associate Floating IP Drawer state
  const [isAssociateFloatingIPDrawerOpen, setIsAssociateFloatingIPDrawerOpen] = useState(false);
  const [selectedInstanceForAssociateFloatingIP, setSelectedInstanceForAssociateFloatingIP] =
    useState<{ id: string; name: string } | null>(null);

  // Disassociate Floating IP Drawer state
  const [isDisassociateFloatingIPDrawerOpen, setIsDisassociateFloatingIPDrawerOpen] =
    useState(false);
  const [selectedInstanceForDisassociateFloatingIP, setSelectedInstanceForDisassociateFloatingIP] =
    useState<DisassociateFloatingIPInstanceInfo | null>(null);

  // Manage Security Groups Drawer state
  const [isManageSecurityGroupsDrawerOpen, setIsManageSecurityGroupsDrawerOpen] = useState(false);
  const [selectedInstanceForManageSecurityGroups, setSelectedInstanceForManageSecurityGroups] =
    useState<ManageSecurityGroupsInstanceInfo | null>(null);

  // Rebuild Instance Drawer state
  const [isRebuildDrawerOpen, setIsRebuildDrawerOpen] = useState(false);
  const [selectedInstanceForRebuild, setSelectedInstanceForRebuild] =
    useState<RebuildInstanceInfo | null>(null);

  // Resize Instance Drawer state
  const [isResizeDrawerOpen, setIsResizeDrawerOpen] = useState(false);
  const [selectedInstanceForResize, setSelectedInstanceForResize] =
    useState<ResizeInstanceInfo | null>(null);

  // Manage Tags Drawer state
  const [isManageTagsDrawerOpen, setIsManageTagsDrawerOpen] = useState(false);
  const [selectedInstanceForManageTags, setSelectedInstanceForManageTags] =
    useState<ManageTagsInstanceInfo | null>(null);

  // Rescue Instance Drawer state
  const [isRescueDrawerOpen, setIsRescueDrawerOpen] = useState(false);
  const [selectedInstanceForRescue, setSelectedInstanceForRescue] =
    useState<RescueInstanceInfo | null>(null);

  // Table selection state
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [selectedBareMetalInstances, setSelectedBareMetalInstances] = useState<string[]>([]);

  // Shell Panel state (using hook for multi-tab support)
  const shellPanel = useShellPanel();
  const navigate = useNavigate();
  const { addTab } = useTabs();

  // PageShell sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

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
      path: `/compute/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    // Navigate to the console page (new tab becomes active)
    navigate(`/compute/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  // Default column config for VM instances
  const defaultVMColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'locked', label: 'Locked', visible: true },
    { id: 'fixedIp', label: 'Fixed IP', visible: true },
    { id: 'floatingIp', label: 'Floating IP', visible: true },
    { id: 'os', label: 'OS', visible: true },
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
      const fieldId = filter?.fieldId;
      const filterValue = (filter?.value ?? '').toLowerCase();

      if (!fieldId || !filterValue) return true;

      switch (fieldId) {
        case 'name':
          return instance.name?.toLowerCase().includes(filterValue) ?? false;
        case 'status':
          return instance.status?.toLowerCase() === filterValue;
        case 'os':
          return instance.os?.toLowerCase().includes(filterValue) ?? false;
        case 'flavor':
          return instance.flavor?.toLowerCase().includes(filterValue) ?? false;
        default:
          return true;
      }
    });
  });

  const filteredBareMetalInstances = mockBareMetalInstances.filter((instance) => {
    if (appliedFilters.length === 0) return true;

    return appliedFilters.every((filter) => {
      const fieldId = filter?.fieldId;
      const filterValue = (filter?.value ?? '').toLowerCase();

      if (!fieldId || !filterValue) return true;

      switch (fieldId) {
        case 'name':
          return instance.name?.toLowerCase().includes(filterValue) ?? false;
        case 'status':
          return instance.status?.toLowerCase() === filterValue;
        case 'os':
          return instance.os?.toLowerCase().includes(filterValue) ?? false;
        case 'flavor':
          return instance.flavor?.toLowerCase().includes(filterValue) ?? false;
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
      image: instance.os,
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

  // Handle attach volume click
  const handleAttachVolume = (instance: Instance) => {
    setSelectedInstanceForAttachVolume({
      id: instance.id,
      name: instance.name,
    });
    setIsAttachVolumeDrawerOpen(true);
  };

  // Handle detach volume click
  const handleDetachVolume = (instance: Instance) => {
    setSelectedInstanceForDetachVolume({
      id: instance.id,
      name: instance.name,
    });
    setIsDetachVolumeDrawerOpen(true);
  };

  // Handle attach interface click
  const handleAttachInterface = (instance: Instance) => {
    setSelectedInstanceForAttachInterface({
      id: instance.id,
      name: instance.name,
    });
    setIsAttachInterfaceDrawerOpen(true);
  };

  // Handle detach interface click
  const handleDetachInterface = (instance: Instance) => {
    setSelectedInstanceForDetachInterface({
      id: instance.id,
      name: instance.name,
    });
    setIsDetachInterfaceDrawerOpen(true);
  };

  // Handle associate floating IP click
  const handleAssociateFloatingIP = (instance: Instance) => {
    setSelectedInstanceForAssociateFloatingIP({
      id: instance.id,
      name: instance.name,
    });
    setIsAssociateFloatingIPDrawerOpen(true);
  };

  // Handle disassociate floating IP click
  const handleDisassociateFloatingIP = (instance: Instance) => {
    setSelectedInstanceForDisassociateFloatingIP({
      id: instance.id,
      name: instance.name,
    });
    setIsDisassociateFloatingIPDrawerOpen(true);
  };

  // Handle manage security groups click
  const handleManageSecurityGroups = (instance: Instance) => {
    setSelectedInstanceForManageSecurityGroups({
      id: instance.id,
      name: instance.name,
    });
    setIsManageSecurityGroupsDrawerOpen(true);
  };

  // Handle rebuild instance click
  const handleRebuild = (instance: Instance) => {
    setSelectedInstanceForRebuild({
      id: instance.id,
      name: instance.name,
      currentImage: instance.os,
    });
    setIsRebuildDrawerOpen(true);
  };

  // Handle resize instance click
  const handleResize = (instance: Instance) => {
    setSelectedInstanceForResize({
      id: instance.id,
      name: instance.name,
      currentFlavor: {
        id: 'flavor-current',
        name: instance.flavor,
        vcpu: instance.vcpu,
        ram: instance.ram,
        disk: instance.disk,
      },
    });
    setIsResizeDrawerOpen(true);
  };

  // Handle manage tags click
  const handleManageTags = (instance: Instance) => {
    setSelectedInstanceForManageTags({
      id: instance.id,
      name: instance.name,
    });
    setIsManageTagsDrawerOpen(true);
  };

  // Handle rescue instance click
  const handleRescue = (instance: Instance) => {
    setSelectedInstanceForRescue({
      id: instance.id,
      name: instance.name,
      currentImage: instance.os,
      protocol: 'SSH',
    });
    setIsRescueDrawerOpen(true);
  };

  // Context menu items for instances
  const getInstanceContextMenuItems = (instance: Instance): ContextMenuItem[] => [
    {
      id: 'instance-status',
      label: 'Instance status',
      submenu: [
        { id: 'start-sub', label: 'Start' },
        { id: 'stop-sub', label: 'Stop', status: 'danger' },
        { id: 'reboot-sub', label: 'Reboot', status: 'danger' },
        { id: 'soft-reboot-sub', label: 'Soft reboot' },
        { id: 'pause-sub', label: 'Pause' },
        { id: 'suspend-sub', label: 'Suspend' },
        { id: 'shelve-sub', label: 'Shelve' },
        { id: 'unpause-sub', label: 'Unpause' },
        { id: 'resume-sub', label: 'Resume' },
        { id: 'unshelve-sub', label: 'Unshelve' },
        {
          id: 'rescue-sub',
          label: 'Rescue',
          onClick: () => handleRescue(instance),
        },
        { id: 'unrescue-sub', label: 'Unrescue' },
      ],
    },
    {
      id: 'storage-snapshot',
      label: 'Storage&Snapshot',
      submenu: [
        {
          id: 'attach-volume',
          label: 'Attach volume',
          onClick: () => handleAttachVolume(instance),
        },
        {
          id: 'detach-volume',
          label: 'Detach volume',
          status: 'danger',
          onClick: () => handleDetachVolume(instance),
        },
        {
          id: 'create-snapshot',
          label: 'Create instance snapshot',
          onClick: () => handleCreateSnapshot(instance),
        },
      ],
    },
    {
      id: 'network',
      label: 'Network',
      submenu: [
        {
          id: 'attach-interface',
          label: 'Attach interface',
          onClick: () => handleAttachInterface(instance),
        },
        {
          id: 'detach-interface',
          label: 'Detach interface',
          status: 'danger',
          onClick: () => handleDetachInterface(instance),
        },
        {
          id: 'associate-floating-ip',
          label: 'Associate floating IP',
          onClick: () => handleAssociateFloatingIP(instance),
        },
        {
          id: 'disassociate-floating-ip',
          label: 'Disassociate floating IP',
          status: 'danger',
          onClick: () => handleDisassociateFloatingIP(instance),
        },
        {
          id: 'manage-security-groups',
          label: 'Manage security groups',
          onClick: () => handleManageSecurityGroups(instance),
        },
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
          id: 'rebuild',
          label: 'Rebuild',
          status: 'danger',
          onClick: () => handleRebuild(instance),
        },
        {
          id: 'resize',
          label: 'Resize',
          onClick: () => handleResize(instance),
        },
        {
          id: 'manage-tags',
          label: 'Manage tags',
          onClick: () => handleManageTags(instance),
        },
        {
          id: 'edit',
          label: 'Edit',
          onClick: () => handleEditInstance(instance),
        },
      ],
    },
    { id: 'confirm-resize', label: 'Confirm resize' },
    { id: 'revert-resize', label: 'Revert resize' },
    { id: 'delete', label: 'Delete', status: 'danger' },
  ];

  const getBareMetalContextMenuItems = (_instance: BareMetalInstance): ContextMenuItem[] => [
    {
      id: 'instance-status',
      label: 'Instance status',
      submenu: [
        { id: 'start-sub', label: 'Start' },
        { id: 'stop-sub', label: 'Stop', status: 'danger' },
        { id: 'reboot-sub', label: 'Reboot', status: 'danger' },
      ],
    },
    {
      id: 'configuration',
      label: 'Configuration',
      submenu: [
        { id: 'lock-setting', label: 'Lock setting' },
        { id: 'manage-tags', label: 'Manage tags' },
        { id: 'edit', label: 'Edit' },
      ],
    },
    { id: 'delete', label: 'Delete', status: 'danger' },
  ];

  // Table columns definition (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Instance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute/instances/${row.id}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
              title={row.name}
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <span className="text-body-sm text-[var(--color-text-subtle)] truncate" title={row.id}>
              ID : {row.id}
            </span>
          </div>
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
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
      minWidth: columnMinWidths.fixedIp,
      sortable: true,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      minWidth: columnMinWidths.floatingIp,
      sortable: true,
    },
    {
      key: 'os',
      label: 'OS',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
    },
    {
      key: 'flavor',
      label: 'Flavor',
      flex: 1,
      minWidth: columnMinWidths.flavor,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/flavors/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
            title={row.flavor}
            onClick={(e) => e.stopPropagation()}
          >
            {row.flavor}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate" title={row.id}>
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
      width: fixedColumns.actionWide,
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
            <ContextMenu items={getInstanceContextMenuItems(row)} trigger="click" align="right">
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

  // Bare Metal Table columns definition (using fixedColumns / columnMinWidths preset)
  const bareMetalColumns: TableColumn<BareMetalInstance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <Tooltip content="This bare metal was created via the Container cluster." position="top">
            <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              <img src={containerIcon} alt="Container" className="w-4 h-4" />
            </div>
          </Tooltip>
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute/bare-metal/${row.id}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
              title={row.name}
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <span className="text-body-sm text-[var(--color-text-subtle)] truncate" title={row.id}>
              ID : {row.id}
            </span>
          </div>
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
      key: 'os',
      label: 'OS',
      flex: 1,
      minWidth: columnMinWidths.image,
      sortable: true,
    },
    {
      key: 'flavor',
      label: 'Flavor',
      flex: 1,
      minWidth: columnMinWidths.flavor,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/flavors/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
            title={row.flavor}
            onClick={(e) => e.stopPropagation()}
          >
            {row.flavor}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate" title={row.id}>
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
        <div
          className="flex items-center justify-center w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <ContextMenu items={getBareMetalContextMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

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
            <Breadcrumb
              items={[{ label: 'Proj-1', href: '/compute' }, { label: 'Instances list' }]}
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
      bottomPanel={
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
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader
          title="Instances list"
          actions={
            activeTab === 'vm' ? (
              <Link to="/compute/instances/create">
                <Button size="md">Create instance</Button>
              </Link>
            ) : undefined
          }
        />

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
                leftIcon={<IconPower size={12} />}
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
        {activeTab === 'vm' && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            onSettingsClick={() => setIsPreferencesOpen(true)}
            totalItems={filteredInstances.length}
            selectedCount={selectedInstances.length}
          />
        )}
        {activeTab === 'bare-metal' && (
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
        onSubmit={() => {
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
        onSubmit={() => {
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
        onSubmit={() => {
          // TODO: Implement actual edit API call
        }}
      />

      {/* Attach Volume Drawer */}
      <AttachVolumeDrawer
        isOpen={isAttachVolumeDrawerOpen}
        onClose={() => {
          setIsAttachVolumeDrawerOpen(false);
          setSelectedInstanceForAttachVolume(null);
        }}
        volume={{ id: 'vol-001', name: 'data-volume-01', size: '100GB', status: 'available' }}
        onAttach={() => {
          // TODO: Implement attach volume API call
        }}
      />

      {/* Detach Volume Drawer */}
      <DetachVolumeDrawer
        isOpen={isDetachVolumeDrawerOpen}
        onClose={() => {
          setIsDetachVolumeDrawerOpen(false);
          setSelectedInstanceForDetachVolume(null);
        }}
        instance={selectedInstanceForDetachVolume || { id: '', name: '' }}
        onDetach={() => {
          // TODO: Implement detach volume API call
        }}
      />

      {/* Attach Interface Drawer */}
      <AttachInterfaceDrawer
        isOpen={isAttachInterfaceDrawerOpen}
        onClose={() => {
          setIsAttachInterfaceDrawerOpen(false);
          setSelectedInstanceForAttachInterface(null);
        }}
        instance={selectedInstanceForAttachInterface || { id: '', name: '' }}
        onAttach={() => {
          // TODO: Implement attach interface API call
        }}
      />

      {/* Detach Interface Drawer */}
      <DetachInterfaceDrawer
        isOpen={isDetachInterfaceDrawerOpen}
        onClose={() => {
          setIsDetachInterfaceDrawerOpen(false);
          setSelectedInstanceForDetachInterface(null);
        }}
        instance={selectedInstanceForDetachInterface || { id: '', name: '' }}
        onDetach={() => {
          // TODO: Implement detach interface API call
        }}
      />

      {/* Associate Floating IP Drawer */}
      <AssociateFloatingIPDrawer
        isOpen={isAssociateFloatingIPDrawerOpen}
        onClose={() => {
          setIsAssociateFloatingIPDrawerOpen(false);
          setSelectedInstanceForAssociateFloatingIP(null);
        }}
        port={{ id: 'port-001', name: 'port-001' }}
        onSubmit={() => {
          // TODO: Implement associate floating IP API call
        }}
      />

      {/* Disassociate Floating IP Drawer */}
      <DisassociateFloatingIPDrawer
        isOpen={isDisassociateFloatingIPDrawerOpen}
        onClose={() => {
          setIsDisassociateFloatingIPDrawerOpen(false);
          setSelectedInstanceForDisassociateFloatingIP(null);
        }}
        instance={selectedInstanceForDisassociateFloatingIP || { id: '', name: '' }}
        onDisassociate={() => {
          // TODO: Implement disassociate floating IP API call
        }}
      />

      {/* Manage Security Groups Drawer */}
      <ManageSecurityGroupsDrawer
        isOpen={isManageSecurityGroupsDrawerOpen}
        onClose={() => {
          setIsManageSecurityGroupsDrawerOpen(false);
          setSelectedInstanceForManageSecurityGroups(null);
        }}
        instance={selectedInstanceForManageSecurityGroups || { id: '', name: '' }}
        onSave={() => {
          // TODO: Implement save security groups API call
        }}
      />

      {/* Rebuild Instance Drawer */}
      <RebuildInstanceDrawer
        isOpen={isRebuildDrawerOpen}
        onClose={() => {
          setIsRebuildDrawerOpen(false);
          setSelectedInstanceForRebuild(null);
        }}
        instance={selectedInstanceForRebuild || { id: '', name: '', currentImage: '' }}
        onRebuild={() => {
          // TODO: Implement rebuild instance API call
        }}
      />

      {/* Resize Instance Drawer */}
      <ResizeInstanceDrawer
        isOpen={isResizeDrawerOpen}
        onClose={() => {
          setIsResizeDrawerOpen(false);
          setSelectedInstanceForResize(null);
        }}
        instance={
          selectedInstanceForResize || {
            id: '',
            name: '',
            currentFlavor: { id: '', name: '', vcpu: 0, ram: '', disk: '' },
          }
        }
        onResize={() => {
          // TODO: Implement resize instance API call
        }}
      />

      {/* Manage Tags Drawer */}
      <ManageTagsDrawer
        isOpen={isManageTagsDrawerOpen}
        onClose={() => {
          setIsManageTagsDrawerOpen(false);
          setSelectedInstanceForManageTags(null);
        }}
        instance={selectedInstanceForManageTags || { id: '', name: '' }}
        onSave={() => {
          // TODO: Implement save tags API call
        }}
      />

      {/* Rescue Instance Drawer */}
      <RescueInstanceDrawer
        isOpen={isRescueDrawerOpen}
        onClose={() => {
          setIsRescueDrawerOpen(false);
          setSelectedInstanceForRescue(null);
        }}
        instance={selectedInstanceForRescue || { id: '', name: '', currentImage: '', protocol: '' }}
        onRescue={() => {
          // TODO: Implement rescue instance API call
        }}
      />
    </PageShell>
  );
}

export default InstanceListPage;
