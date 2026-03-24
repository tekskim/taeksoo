import { useCallback, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard/DetailCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  IconTerminal2,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconChevronDown,
  IconSquarePlus,
  IconLinkPlus,
  IconPower,
  IconSettings,
  IconCirclePlus,
  IconLock,
  IconLockOpen,
} from '@tabler/icons-react';
import { EditInstanceDrawer } from '../drawers/compute/instance/EditInstanceDrawer';
import { CreateInstanceSnapshotDrawer } from '../drawers/compute/instance/CreateInstanceSnapshotDrawer';
import { LockSettingDrawer } from '../drawers/compute/instance/LockSettingDrawer';
import { AttachVolumeDrawer } from '../drawers/compute/instance/AttachVolumeDrawer';
import { DetachVolumeDrawer } from '../drawers/compute/instance/DetachVolumeDrawer';
import { AttachInterfaceDrawer } from '../drawers/compute/instance/AttachInterfaceDrawer';
import { DetachInterfaceDrawer } from '../drawers/compute/instance/DetachInterfaceDrawer';
import { AssociateFloatingIPDrawer } from '../drawers/compute/instance/AssociateFloatingIPDrawer';
import { DisassociateFloatingIPDrawer } from '../drawers/compute/instance/DisassociateFloatingIPDrawer';
import { ManageSecurityGroupsDrawer } from '../drawers/compute/instance/ManageSecurityGroupsDrawer';
import { ManageTagsDrawer } from '../drawers/compute/instance/ManageTagsDrawer';
import { ResizeInstanceDrawer } from '../drawers/compute/instance/ResizeInstanceDrawer';
import { RebuildInstanceDrawer } from '../drawers/compute/instance/RebuildInstanceDrawer';
import { RescueInstanceDrawer } from '../drawers/compute/instance/RescueInstanceDrawer';
import { LiveMigrateInstanceDrawer } from '../drawers/compute/instance/LiveMigrateInstanceDrawer';

type InstanceStatus = 'active' | 'shutoff' | 'building' | 'error' | 'paused';

interface InstanceDetail {
  id: string;
  name: string;
  status: InstanceStatus;
  host: string;
  createdAt: string;
  availabilityZone: string;
  description: string;
  flavor: { name: string; vcpu: number; ram: string; disk: string; gpu: number };
  image: string;
  os: string;
  locked: boolean;
  keyPair: string;
  serverGroup: string;
  userData: string;
}

interface AttachedVolume {
  id: string;
  name: string;
  status: 'active' | 'inUse' | 'available' | 'error';
  size: string;
  type: string;
  diskTag: string;
  bootable: boolean;
  access: string;
  [key: string]: unknown;
}

interface AttachedInterface {
  id: string;
  name: string;
  network: string;
  portStatus: 'Active' | 'Inactive' | 'Down' | 'Build';
  fixedIp: string;
  macAddress: string;
  createdAt: string;
  [key: string]: unknown;
}

interface FloatingIPRow {
  id: string;
  floatingIp: string;
  fixedIp: string;
  status: 'active' | 'shutoff' | 'error';
  createdAt: string;
  [key: string]: unknown;
}

interface SecurityGroupRow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  [key: string]: unknown;
}

interface NetworkIfaceTab {
  id: string;
  name: string;
  ip: string;
}

interface InstanceSnapshotRow {
  id: string;
  name: string;
  status: 'active' | 'queued' | 'saving' | 'error';
  size: string;
  diskFormat: string;
  createdAt: string;
  [key: string]: unknown;
}

/** Aligns with `ComputeInstancesPage` mock IDs (vm-001 … vm-010). */
const mockInstancesMap: Record<string, InstanceDetail> = {
  'vm-001': {
    id: 'vm-001',
    name: 'worker-node-01',
    status: 'active',
    host: 'compute-03',
    createdAt: 'Jul 25, 2025 10:32:16',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Medium', vcpu: 4, ram: '8 GiB', disk: '100 GiB', gpu: 1 },
    image: 'Ubuntu 24.04',
    os: 'Ubuntu 24.04',
    locked: true,
    keyPair: 'default-key',
    serverGroup: 'worker-group',
    userData: '-',
  },
  'vm-002': {
    id: 'vm-002',
    name: 'worker-node-02',
    status: 'active',
    host: 'compute-03',
    createdAt: 'Jul 24, 2025 03:19:59',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Medium', vcpu: 4, ram: '8 GiB', disk: '100 GiB', gpu: 1 },
    image: 'CentOS 7',
    os: 'CentOS 7',
    locked: false,
    keyPair: 'default-key',
    serverGroup: 'worker-group',
    userData: '-',
  },
  'vm-003': {
    id: 'vm-003',
    name: 'master-node-01',
    status: 'active',
    host: 'compute-01',
    createdAt: 'Jul 20, 2025 23:27:51',
    availabilityZone: 'nova',
    description: 'Kubernetes master node',
    flavor: { name: 'Large', vcpu: 8, ram: '16 GiB', disk: '200 GiB', gpu: 0 },
    image: 'Ubuntu 22.04',
    os: 'Ubuntu 22.04',
    locked: true,
    keyPair: 'master-key',
    serverGroup: 'master-group',
    userData: '-',
  },
  'vm-004': {
    id: 'vm-004',
    name: 'db-server-01',
    status: 'shutoff',
    host: 'compute-02',
    createdAt: 'Jul 15, 2025 12:22:26',
    availabilityZone: 'keystone',
    description: 'Database server',
    flavor: { name: 'XLarge', vcpu: 16, ram: '64 GiB', disk: '500 GiB', gpu: 0 },
    image: 'CentOS 8',
    os: 'CentOS 8',
    locked: true,
    keyPair: 'db-key',
    serverGroup: 'db-group',
    userData: '-',
  },
  'vm-005': {
    id: 'vm-005',
    name: 'gpu-node-01',
    status: 'active',
    host: 'compute-gpu-01',
    createdAt: 'Jul 10, 2025 01:17:01',
    availabilityZone: 'nova',
    description: 'GPU compute node',
    flavor: { name: 'GPU Large', vcpu: 32, ram: '128 GiB', disk: '1000 GiB', gpu: 4 },
    image: 'Ubuntu 22.04',
    os: 'Ubuntu 22.04',
    locked: false,
    keyPair: 'gpu-key',
    serverGroup: 'gpu-group',
    userData: '-',
  },
  'vm-006': {
    id: 'vm-006',
    name: 'gpu-node-02',
    status: 'active',
    host: 'compute-gpu-02',
    createdAt: 'Jul 9, 2025 18:40:12',
    availabilityZone: 'nova',
    description: '-',
    flavor: { name: 'GPU Large', vcpu: 32, ram: '128 GiB', disk: '1000 GiB', gpu: 4 },
    image: 'Ubuntu 22.04',
    os: 'Ubuntu 22.04',
    locked: false,
    keyPair: 'gpu-key',
    serverGroup: 'gpu-group',
    userData: '-',
  },
  'vm-007': {
    id: 'vm-007',
    name: 'web-server-01',
    status: 'paused',
    host: 'compute-04',
    createdAt: 'Jul 8, 2025 09:05:00',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Small', vcpu: 2, ram: '4 GiB', disk: '50 GiB', gpu: 0 },
    image: 'Rocky Linux 9',
    os: 'Rocky Linux 9',
    locked: false,
    keyPair: 'default-key',
    serverGroup: '-',
    userData: '-',
  },
  'vm-008': {
    id: 'vm-008',
    name: 'web-server-02',
    status: 'building',
    host: 'compute-04',
    createdAt: 'Jul 7, 2025 14:22:33',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Small', vcpu: 2, ram: '4 GiB', disk: '50 GiB', gpu: 0 },
    image: 'Rocky Linux 9',
    os: 'Rocky Linux 9',
    locked: false,
    keyPair: 'default-key',
    serverGroup: '-',
    userData: '-',
  },
  'vm-009': {
    id: 'vm-009',
    name: 'analytics-01',
    status: 'error',
    host: 'compute-02',
    createdAt: 'Jul 5, 2025 11:18:45',
    availabilityZone: 'nova',
    description: '-',
    flavor: { name: 'XLarge', vcpu: 16, ram: '32 GiB', disk: '500 GiB', gpu: 2 },
    image: 'Debian 12',
    os: 'Debian 12',
    locked: true,
    keyPair: 'default-key',
    serverGroup: '-',
    userData: '-',
  },
  'vm-010': {
    id: 'vm-010',
    name: 'cache-server-01',
    status: 'active',
    host: 'compute-03',
    createdAt: 'Jul 4, 2025 08:12:01',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Medium', vcpu: 4, ram: '16 GiB', disk: '100 GiB', gpu: 0 },
    image: 'Debian 12',
    os: 'Debian 12',
    locked: false,
    keyPair: 'default-key',
    serverGroup: '-',
    userData: '-',
  },
};

const defaultInstanceDetail: InstanceDetail = {
  id: 'unknown',
  name: 'Unknown instance',
  status: 'active',
  host: '-',
  createdAt: '-',
  availabilityZone: '-',
  description: '-',
  flavor: { name: '-', vcpu: 0, ram: '-', disk: '-', gpu: 0 },
  image: '-',
  os: '-',
  locked: false,
  keyPair: '-',
  serverGroup: '-',
  userData: '-',
};

const mockVolumes: AttachedVolume[] = [
  {
    id: 'vol-001',
    name: 'vol34',
    status: 'active',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'OS Disk',
    bootable: true,
    access: 'Nov 11, 2025',
  },
  {
    id: 'vol-002',
    name: 'data-volume-01',
    status: 'inUse',
    size: '500GiB',
    type: 'SSD',
    diskTag: 'Data disk',
    bootable: false,
    access: 'Nov 10, 2025',
  },
];

const mockInterfaces: AttachedInterface[] = [
  {
    id: 'if-001',
    name: 'port-01',
    network: 'net-01',
    portStatus: 'Active',
    fixedIp: '10.0.0.6',
    macAddress: 'fa:16:3e:12:34:56',
    createdAt: 'Nov 11, 2025 08:30:18',
  },
  {
    id: 'if-002',
    name: 'port-02',
    network: 'net-02',
    portStatus: 'Inactive',
    fixedIp: '10.0.0.5',
    macAddress: 'fa:16:3e:ab:cd:ef',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
];

const mockFloatingIps: FloatingIPRow[] = [
  {
    id: 'fip-001',
    floatingIp: '203.0.113.10',
    fixedIp: '10.0.1.10',
    status: 'active',
    createdAt: 'Sep 10, 2025 01:17:01',
  },
  {
    id: 'fip-002',
    floatingIp: '203.0.113.20',
    fixedIp: '10.0.1.20',
    status: 'shutoff',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
];

const mockNetworkTabs: NetworkIfaceTab[] = [
  { id: 'net-001', name: 'private-net', ip: '10.0.0.5' },
  { id: 'net-002', name: 'public-net', ip: '72.116.0.10' },
];

const mockSecurityGroups: SecurityGroupRow[] = [
  { id: 'sg-001', name: 'sg-02', description: 'Web tier', createdAt: 'Nov 11, 2025 08:30:18' },
  {
    id: 'sg-002',
    name: 'default',
    description: 'Default security group',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
];

const mockSnapshots: InstanceSnapshotRow[] = [
  {
    id: 'snap-001',
    name: 'snap-01',
    status: 'active',
    size: '30GiB',
    diskFormat: 'RAW',
    createdAt: 'Sep 1, 2025 10:20:28',
  },
  {
    id: 'snap-002',
    name: 'pre-upgrade',
    status: 'queued',
    size: '45GiB',
    diskFormat: 'QCOW2',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
];

const statusLabel: Record<InstanceStatus, string> = {
  active: 'Active',
  shutoff: 'Shut off',
  building: 'Building',
  error: 'Error',
  paused: 'Paused',
};

function instanceStatusVariant(s: InstanceStatus): StatusVariant {
  if (s === 'active') return 'active';
  if (s === 'building') return 'building';
  if (s === 'error') return 'error';
  if (s === 'paused') return 'paused';
  return 'shutoff';
}

function portStatusVariant(portStatus: AttachedInterface['portStatus']): StatusVariant {
  const m: Record<AttachedInterface['portStatus'], StatusVariant> = {
    Active: 'active',
    Inactive: 'shutoff',
    Down: 'down',
    Build: 'building',
  };
  return m[portStatus] ?? 'down';
}

function snapshotStatusVariant(s: InstanceSnapshotRow['status']): StatusVariant {
  if (s === 'active') return 'active';
  if (s === 'queued' || s === 'saving') return 'building';
  return 'error';
}

function volumeStatusVariant(s: AttachedVolume['status']): StatusVariant {
  if (s === 'error') return 'error';
  if (s === 'inUse') return 'inUse';
  if (s === 'available') return 'mounted';
  return 'active';
}

const volumeFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Volume name…' },
];
const ifaceFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Interface name…' },
];
const fipFilterKeys: FilterKey[] = [
  { key: 'floatingIp', label: 'Floating IP', type: 'input', placeholder: 'IP…' },
];
const sgFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Security group…' },
];
const snapFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Snapshot name…' },
];

const ActionTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={toggle}
    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
    aria-label="Row actions"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

function applyFilters<T extends Record<string, unknown>>(
  rows: T[],
  filters: FilterKeyWithValue[]
): T[] {
  if (filters.length === 0) return rows;
  return rows.filter((row) =>
    filters.every((f) =>
      String(row[f.key] ?? '')
        .toLowerCase()
        .includes(String(f.value ?? '').toLowerCase())
    )
  );
}

const tagPill = (text: string) => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-surface-muted text-11 font-medium text-text border border-border">
    {text}
  </span>
);

function getDetailCardFields(instance: InstanceDetail): {
  basic: DetailCardField[];
  flavor: DetailCardField[];
  source: DetailCardField[];
  authentication: DetailCardField[];
  advanced: DetailCardField[];
} {
  return {
    basic: [
      { label: 'Instance name', value: instance.name },
      { label: 'Availability zone', value: instance.availabilityZone },
      { label: 'Description', value: instance.description },
    ],
    flavor: [
      {
        label: 'Flavor name',
        type: 'component',
        value: null,
        component: (
          <Link to="/compute/flavors" className="text-primary font-medium hover:underline">
            {instance.flavor.name}
          </Link>
        ),
      },
      {
        label: 'Spec',
        value: `vCPU : ${instance.flavor.vcpu} / RAM : ${instance.flavor.ram} / Disk : ${instance.flavor.disk} / GPU : ${instance.flavor.gpu}`,
      },
    ],
    source: [
      {
        label: 'Image',
        type: 'component',
        value: null,
        component: (
          <Link to="/compute/images" className="text-primary font-medium hover:underline">
            {instance.image}
          </Link>
        ),
      },
      { label: 'OS', value: instance.os },
    ],
    authentication: [
      {
        label: 'Key pair',
        type: 'component',
        value: null,
        component: (
          <Link to="/compute/key-pairs" className="text-primary font-medium hover:underline">
            {instance.keyPair}
          </Link>
        ),
      },
    ],
    advanced: [
      {
        label: 'Tags',
        type: 'component',
        value: null,
        component: (
          <div className="flex flex-wrap gap-1">
            {tagPill('Team=dev')}
            {tagPill('Key=Value')}
          </div>
        ),
      },
      {
        label: 'Server group',
        type: 'component',
        value: null,
        component: (
          <Link to="/compute/server-groups" className="text-primary font-medium hover:underline">
            {instance.serverGroup}
          </Link>
        ),
      },
      { label: 'User data', value: instance.userData },
    ],
  };
}

export function ComputeInstanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const instance = id ? (mockInstancesMap[id] ?? defaultInstanceDetail) : defaultInstanceDetail;
  const [drawerOpen, setDrawerOpen] = useState<string | null>(null);
  const openDrawer = (name: string) => setDrawerOpen(name);
  const closeDrawer = () => setDrawerOpen(null);
  const detailFields = useMemo(() => getDetailCardFields(instance), [instance]);

  const itemsPerPage = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const [volFilters, setVolFilters] = useState<FilterKeyWithValue[]>([]);
  const [volPage, setVolPage] = useState(1);
  const [volSelected, setVolSelected] = useState<(string | number)[]>([]);

  const [ifFilters, setIfFilters] = useState<FilterKeyWithValue[]>([]);
  const [ifPage, setIfPage] = useState(1);
  const [ifSelected, setIfSelected] = useState<(string | number)[]>([]);

  const [fipFilters, setFipFilters] = useState<FilterKeyWithValue[]>([]);
  const [fipPage, setFipPage] = useState(1);
  const [fipSelected, setFipSelected] = useState<(string | number)[]>([]);

  const [sgIfaceTab, setSgIfaceTab] = useState(mockNetworkTabs[0]?.id ?? '');
  const [sgFilters, setSgFilters] = useState<FilterKeyWithValue[]>([]);
  const [sgPage, setSgPage] = useState(1);
  const [sgSelected, setSgSelected] = useState<(string | number)[]>([]);

  const [snapFilters, setSnapFilters] = useState<FilterKeyWithValue[]>([]);
  const [snapPage, setSnapPage] = useState(1);
  const [snapSelected, setSnapSelected] = useState<(string | number)[]>([]);

  const filteredVolumes = useMemo(() => applyFilters(mockVolumes, volFilters), [volFilters]);
  const paginatedVolumes = useMemo(
    () => filteredVolumes.slice((volPage - 1) * itemsPerPage, volPage * itemsPerPage),
    [filteredVolumes, volPage]
  );

  const filteredIfaces = useMemo(() => applyFilters(mockInterfaces, ifFilters), [ifFilters]);
  const paginatedIfaces = useMemo(
    () => filteredIfaces.slice((ifPage - 1) * itemsPerPage, ifPage * itemsPerPage),
    [filteredIfaces, ifPage]
  );

  const filteredFips = useMemo(() => applyFilters(mockFloatingIps, fipFilters), [fipFilters]);
  const paginatedFips = useMemo(
    () => filteredFips.slice((fipPage - 1) * itemsPerPage, fipPage * itemsPerPage),
    [filteredFips, fipPage]
  );

  const filteredSg = useMemo(() => applyFilters(mockSecurityGroups, sgFilters), [sgFilters]);
  const paginatedSg = useMemo(
    () => filteredSg.slice((sgPage - 1) * itemsPerPage, sgPage * itemsPerPage),
    [filteredSg, sgPage]
  );

  const filteredSnaps = useMemo(() => applyFilters(mockSnapshots, snapFilters), [snapFilters]);
  const paginatedSnaps = useMemo(
    () => filteredSnaps.slice((snapPage - 1) * itemsPerPage, snapPage * itemsPerPage),
    [filteredSnaps, snapPage]
  );

  const infoFields = [
    {
      label: 'Status',
      value: statusLabel[instance.status],
      accessory: (
        <StatusIndicator variant={instanceStatusVariant(instance.status)} layout="iconOnly" />
      ),
    },
    { label: 'ID', value: instance.id, showCopyButton: true as const, copyText: instance.id },
    { label: 'Host', value: instance.host },
    { label: 'Origin', value: instance.image },
    {
      label: 'Locked state',
      value: (
        <span className="inline-flex items-center gap-1 min-w-0">
          {instance.locked ? (
            <IconLock size={14} className="text-text-muted shrink-0" />
          ) : (
            <IconLockOpen size={14} className="text-text-muted shrink-0" />
          )}
          <span>{instance.locked ? 'Locked' : 'Unlocked'}</span>
        </span>
      ),
    },
    { label: 'Created at', value: instance.createdAt },
  ];

  const actions = (
    <div className="flex items-center gap-1 flex-wrap">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTerminal2 size={12} stroke={1.5} /> Console
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconPlayerPlay size={12} stroke={1.5} /> Start
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconPlayerStop size={12} stroke={1.5} /> Stop
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconPower size={12} stroke={1.5} /> Reboot
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTrash size={12} stroke={1.5} /> Delete
      </Button>
      <ContextMenu.Root
        direction="bottom-end"
        gap={4}
        subContextMenuDirection="right-top"
        trigger={({ toggle }) => (
          <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
            More actions <IconChevronDown size={12} stroke={1.5} />
          </Button>
        )}
      >
        <ContextMenu.SubItems label="Instance status" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => {}}>Soft reboot</ContextMenu.Item>
          <ContextMenu.Item action={() => {}}>Pause</ContextMenu.Item>
          <ContextMenu.Item action={() => {}} danger>
            Suspend
          </ContextMenu.Item>
          <ContextMenu.Item action={() => openDrawer('rescue')}>Rescue</ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.SubItems label="Storage & snapshot" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => openDrawer('attachVol')}>Attach volume</ContextMenu.Item>
          <ContextMenu.Item action={() => openDrawer('detachVol')} danger>
            Detach volume
          </ContextMenu.Item>
          <ContextMenu.Item action={() => openDrawer('snapshot')}>
            Create instance snapshot
          </ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.SubItems label="Network" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => openDrawer('attachIf')}>
            Attach interface
          </ContextMenu.Item>
          <ContextMenu.Item action={() => openDrawer('detachIf')} danger>
            Detach interface
          </ContextMenu.Item>
          <ContextMenu.Item action={() => openDrawer('assocFip')}>
            Associate floating IP
          </ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.SubItems label="Configuration" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => openDrawer('lock')}>Lock setting</ContextMenu.Item>
          <ContextMenu.Item action={() => openDrawer('edit')}>Edit</ContextMenu.Item>
          <ContextMenu.Item action={() => openDrawer('rebuild')} danger>
            Rebuild
          </ContextMenu.Item>
        </ContextMenu.SubItems>
      </ContextMenu.Root>
    </div>
  );

  const volumeColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 72, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'diskTag', header: 'Disk tag' },
    { key: 'bootable', header: 'Bootable' },
    { key: 'access', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const ifaceColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 72, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'network', header: 'Network', sortable: true },
    { key: 'fixedIp', header: 'Fixed IP' },
    { key: 'macAddress', header: 'MAC address' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const fipColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 72, align: 'center' },
    { key: 'floatingIp', header: 'Floating IP', sortable: true },
    { key: 'fixedIp', header: 'Fixed IP' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const sgColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'description', header: 'Description' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const snapColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 72, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'diskFormat', header: 'Disk format' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={instance.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <DetailCard title="Basic information" fields={detailFields.basic} />
              <DetailCard title="Flavor" fields={detailFields.flavor} />
              <DetailCard title="Source" fields={detailFields.source} />
              <DetailCard title="Authentication" fields={detailFields.authentication} />
              <DetailCard title="Advanced" fields={detailFields.advanced} />
            </div>
          </Tab>

          <Tab id="volumes" label="Volumes">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-14 font-semibold leading-5 text-text m-0">Volumes</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => openDrawer('attachVol')}
                >
                  <IconSquarePlus size={12} stroke={1.5} /> Attach volume
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={volumeFilterKeys}
                onFilterAdd={(f) => {
                  setVolFilters((p) => [...p, f]);
                  setVolPage(1);
                }}
                selectedFilters={volFilters}
                placeholder="Search volumes by attributes"
                defaultFilterKey="name"
              />
              <Pagination
                totalCount={filteredVolumes.length}
                size={itemsPerPage}
                currentAt={volPage}
                onPageChange={setVolPage}
                onSettingClick={() => {}}
                totalCountLabel="items"
                selectedCount={volSelected.length}
              />
              <SelectableTable<AttachedVolume>
                columns={volumeColumns}
                rows={paginatedVolumes}
                selectionType="checkbox"
                selectedRows={volSelected}
                onRowSelectionChange={setVolSelected}
                getRowId={(row) => row.id}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedVolumes.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={volumeColumns[0]}>
                      <StatusIndicator
                        variant={volumeStatusVariant(row.status)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/volumes/${row.id}`}
                          className="text-primary font-medium hover:underline truncate"
                        >
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[2]}>
                      {row.size}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[3]}>
                      {row.type}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[4]}>
                      {row.diskTag}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[5]}>
                      {row.bootable ? 'Yes' : 'No'}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[6]}>
                      {row.access}
                    </Table.Td>
                    <Table.Td rowData={row} column={volumeColumns[7]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.SubItems label="Data protection">
                          <ContextMenu.Item action={() => {}}>
                            Create volume snapshot
                          </ContextMenu.Item>
                          <ContextMenu.Item action={() => {}}>
                            Create volume backup
                          </ContextMenu.Item>
                        </ContextMenu.SubItems>
                        <ContextMenu.Item action={() => {}} danger>
                          Detach
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            </div>
          </Tab>

          <Tab id="interfaces" label="Interfaces">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-14 font-semibold leading-5 text-text m-0">Interfaces</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => openDrawer('attachIf')}
                >
                  <IconSquarePlus size={12} stroke={1.5} /> Attach interface
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={ifaceFilterKeys}
                onFilterAdd={(f) => {
                  setIfFilters((p) => [...p, f]);
                  setIfPage(1);
                }}
                selectedFilters={ifFilters}
                placeholder="Search interfaces by attributes"
                defaultFilterKey="name"
              />
              <Pagination
                totalCount={filteredIfaces.length}
                size={itemsPerPage}
                currentAt={ifPage}
                onPageChange={setIfPage}
                onSettingClick={() => {}}
                totalCountLabel="items"
                selectedCount={ifSelected.length}
              />
              <SelectableTable<AttachedInterface>
                columns={ifaceColumns}
                rows={paginatedIfaces}
                selectionType="checkbox"
                selectedRows={ifSelected}
                onRowSelectionChange={setIfSelected}
                getRowId={(row) => row.id}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedIfaces.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={ifaceColumns[0]}>
                      <StatusIndicator
                        variant={portStatusVariant(row.portStatus)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={ifaceColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/ports/${row.id}`}
                          className="text-primary font-medium hover:underline truncate"
                        >
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={ifaceColumns[2]}>
                      <Link
                        to={`/compute/networks/${row.id}`}
                        className="text-primary font-medium hover:underline truncate"
                      >
                        {row.network}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={ifaceColumns[3]}>
                      {row.fixedIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={ifaceColumns[4]}>
                      {row.macAddress}
                    </Table.Td>
                    <Table.Td rowData={row} column={ifaceColumns[5]}>
                      {row.createdAt}
                    </Table.Td>
                    <Table.Td rowData={row} column={ifaceColumns[6]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => {}} danger>
                          Detach
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            </div>
          </Tab>

          <Tab id="floating-ips" label="Floating IPs">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-14 font-semibold leading-5 text-text m-0">Floating IPs</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => openDrawer('assocFip')}
                >
                  <IconLinkPlus size={12} stroke={1.5} /> Associate floating IP
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={fipFilterKeys}
                onFilterAdd={(f) => {
                  setFipFilters((p) => [...p, f]);
                  setFipPage(1);
                }}
                selectedFilters={fipFilters}
                placeholder="Search floating IPs by attributes"
                defaultFilterKey="floatingIp"
              />
              <Pagination
                totalCount={filteredFips.length}
                size={itemsPerPage}
                currentAt={fipPage}
                onPageChange={setFipPage}
                onSettingClick={() => {}}
                totalCountLabel="items"
                selectedCount={fipSelected.length}
              />
              <SelectableTable<FloatingIPRow>
                columns={fipColumns}
                rows={paginatedFips}
                selectionType="checkbox"
                selectedRows={fipSelected}
                onRowSelectionChange={setFipSelected}
                getRowId={(row) => row.id}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedFips.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={fipColumns[0]}>
                      <StatusIndicator
                        variant={
                          row.status === 'error'
                            ? 'error'
                            : row.status === 'active'
                              ? 'active'
                              : 'shutoff'
                        }
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={fipColumns[1]}>
                      <Link
                        to={`/compute/floating-ips/${row.id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {row.floatingIp}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={fipColumns[2]}>
                      {row.fixedIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={fipColumns[3]}>
                      {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                    <Table.Td rowData={row} column={fipColumns[4]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => {}} danger>
                          Disassociate
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            </div>
          </Tab>

          <Tab id="security" label="Security">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-14 font-semibold leading-5 text-text m-0">Security groups</h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => openDrawer('manageSg')}
                >
                  <IconSettings size={12} stroke={1.5} /> Manage security group
                </Button>
              </div>
              <Tabs activeTabId={sgIfaceTab} onChange={setSgIfaceTab} variant="button" size="sm">
                {mockNetworkTabs.map((n) => (
                  <Tab key={n.id} id={n.id} label={`${n.name} (${n.ip})`}>
                    <div className="flex flex-col gap-4 pt-2">
                      <FilterSearchInput
                        filterKeys={sgFilterKeys}
                        onFilterAdd={(f) => {
                          setSgFilters((p) => [...p, f]);
                          setSgPage(1);
                        }}
                        selectedFilters={sgFilters}
                        placeholder="Search security groups by attributes"
                        defaultFilterKey="name"
                      />
                      <Pagination
                        totalCount={filteredSg.length}
                        size={itemsPerPage}
                        currentAt={sgPage}
                        onPageChange={setSgPage}
                        onSettingClick={() => {}}
                        totalCountLabel="items"
                        selectedCount={sgSelected.length}
                      />
                      <SelectableTable<SecurityGroupRow>
                        columns={sgColumns}
                        rows={paginatedSg}
                        selectionType="checkbox"
                        selectedRows={sgSelected}
                        onRowSelectionChange={setSgSelected}
                        getRowId={(row) => row.id}
                        sort={sort}
                        order={order}
                        onSortChange={handleSortChange}
                        stickyLastColumn
                      >
                        {paginatedSg.map((row) => (
                          <Table.Tr key={row.id} rowData={row}>
                            <Table.Td rowData={row} column={sgColumns[0]}>
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <Link
                                  to={`/compute/security-groups/${row.id}`}
                                  className="text-primary font-medium hover:underline truncate"
                                >
                                  {row.name}
                                </Link>
                                <span className="text-11 text-text-muted truncate">
                                  ID : {row.id}
                                </span>
                              </div>
                            </Table.Td>
                            <Table.Td rowData={row} column={sgColumns[1]}>
                              {row.description}
                            </Table.Td>
                            <Table.Td rowData={row} column={sgColumns[2]}>
                              {row.createdAt}
                            </Table.Td>
                            <Table.Td rowData={row} column={sgColumns[3]} preventClickPropagation>
                              <ContextMenu.Root
                                direction="bottom-end"
                                gap={4}
                                trigger={ActionTrigger}
                              >
                                <ContextMenu.Item action={() => {}} danger>
                                  Detach
                                </ContextMenu.Item>
                              </ContextMenu.Root>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </SelectableTable>
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </div>
          </Tab>

          <Tab id="snapshots" label="Instance snapshots">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-14 font-semibold leading-5 text-text m-0">
                  Instance snapshots
                </h2>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => openDrawer('snapshot')}
                >
                  <IconCirclePlus size={12} stroke={1.5} /> Create snapshot
                </Button>
              </div>
              <FilterSearchInput
                filterKeys={snapFilterKeys}
                onFilterAdd={(f) => {
                  setSnapFilters((p) => [...p, f]);
                  setSnapPage(1);
                }}
                selectedFilters={snapFilters}
                placeholder="Search snapshots by attributes"
                defaultFilterKey="name"
              />
              <Pagination
                totalCount={filteredSnaps.length}
                size={itemsPerPage}
                currentAt={snapPage}
                onPageChange={setSnapPage}
                onSettingClick={() => {}}
                totalCountLabel="items"
                selectedCount={snapSelected.length}
              />
              <SelectableTable<InstanceSnapshotRow>
                columns={snapColumns}
                rows={paginatedSnaps}
                selectionType="checkbox"
                selectedRows={snapSelected}
                onRowSelectionChange={setSnapSelected}
                getRowId={(row) => row.id}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedSnaps.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={snapColumns[0]}>
                      <StatusIndicator
                        variant={snapshotStatusVariant(row.status)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={snapColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/instance-snapshots/${row.id}`}
                          className="text-primary font-medium hover:underline truncate"
                        >
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={snapColumns[2]}>
                      {row.size}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapColumns[3]}>
                      {row.diskFormat}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapColumns[4]}>
                      {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapColumns[5]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => {}}>Edit</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Create instance</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}} danger>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            </div>
          </Tab>
        </Tabs>
      </div>
      <EditInstanceDrawer
        isOpen={drawerOpen === 'edit'}
        onClose={closeDrawer}
        instanceId={instance.id}
        initialData={{ name: instance.name, description: '' }}
      />
      <CreateInstanceSnapshotDrawer
        isOpen={drawerOpen === 'snapshot'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <LockSettingDrawer
        isOpen={drawerOpen === 'lock'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <AttachVolumeDrawer
        isOpen={drawerOpen === 'attachVol'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <DetachVolumeDrawer
        isOpen={drawerOpen === 'detachVol'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <AttachInterfaceDrawer
        isOpen={drawerOpen === 'attachIf'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <DetachInterfaceDrawer
        isOpen={drawerOpen === 'detachIf'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <AssociateFloatingIPDrawer
        isOpen={drawerOpen === 'assocFip'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <DisassociateFloatingIPDrawer
        isOpen={drawerOpen === 'disassocFip'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <ManageSecurityGroupsDrawer
        isOpen={drawerOpen === 'manageSg'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <ManageTagsDrawer
        isOpen={drawerOpen === 'manageTags'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <ResizeInstanceDrawer
        isOpen={drawerOpen === 'resize'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <RebuildInstanceDrawer
        isOpen={drawerOpen === 'rebuild'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <RescueInstanceDrawer
        isOpen={drawerOpen === 'rescue'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
      <LiveMigrateInstanceDrawer
        isOpen={drawerOpen === 'migrate'}
        onClose={closeDrawer}
        instanceName={instance.name}
      />
    </div>
  );
}

export default ComputeInstanceDetailPage;
