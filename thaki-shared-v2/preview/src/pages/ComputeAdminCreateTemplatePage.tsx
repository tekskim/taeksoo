import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input, NumberInput } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Disclosure } from '@shared/components/Disclosure';
import { Tag } from '@shared/components/Tag';
import { Toggle } from '@shared/components/Toggle';
import { Checkbox } from '@shared/components/Checkbox';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import {
  IconAlertCircle,
  IconBrandUbuntu,
  IconBrandWindows,
  IconCirclePlus,
  IconDots,
  IconExternalLink,
  IconHexagon,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';

const STEP_IDS = ['template-info', 'basic', 'source', 'flavor', 'network', 'advanced'] as const;

const STEP_LABELS: Record<string, string> = {
  'template-info': 'Template information',
  basic: 'Basic information',
  source: 'Source',
  flavor: 'Flavor',
  network: 'Network',
  advanced: 'Advanced',
};

const ITEMS_PER_PAGE = 5;
const MAX_TAGS = 50;
const MAX_USER_DATA = 16 * 1024;

type SourceTab = 'image' | 'snapshot' | 'volume';
type FlavorCategory = 'cpu' | 'gpu' | 'npu';
type NetworkCategoryTab = 'current' | 'shared' | 'external';

interface ImageRow {
  id: string;
  status: 'active' | 'error' | 'building' | 'muted';
  name: string;
  version: string;
  size: string;
  minDisk: string;
  minRam: string;
  access: string;
  os: 'ubuntu' | 'windows' | 'rocky' | 'other';
  [key: string]: unknown;
}

interface InstanceSnapshotRow {
  id: string;
  status: 'active' | 'error' | 'building';
  name: string;
  version: string;
  size: string;
  sourceInstance: string;
  createdAt: string;
  [key: string]: unknown;
}

interface BootableVolumeRow {
  id: string;
  status: 'available' | 'in-use' | 'error';
  name: string;
  size: string;
  type: string;
  createdAt: string;
  [key: string]: unknown;
}

interface FlavorRow {
  id: string;
  name: string;
  vCPU: number;
  ram: string;
  disk: string;
  isPublic: boolean;
  hasWarning?: boolean;
  category: FlavorCategory;
  [key: string]: unknown;
}

interface NetworkRow {
  id: string;
  name: string;
  subnetCidr: string;
  isExternal: boolean;
  shared: string;
  status: 'active' | 'error' | 'building';
  category: NetworkCategoryTab;
  [key: string]: unknown;
}

interface SecurityGroupRow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  [key: string]: unknown;
}

interface PortRow {
  id: string;
  name: string;
  ownedNetwork: string;
  ownedNetworkId: string;
  fixedIP: string;
  macAddress: string;
  status: 'active' | 'error' | 'building';
  [key: string]: unknown;
}

interface VirtualLAN {
  id: string;
  network: string;
  subnet: string;
  autoAssign: string;
}

interface DataDiskRow {
  id: string;
  type: string;
  size: number;
  deleteWithInstance: boolean;
}

const mockImages: ImageRow[] = [
  {
    id: 'e920j30d',
    status: 'active',
    name: 'ubuntu-24.04-tk-base',
    version: '24.04',
    size: '709.98 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'ubuntu',
  },
  {
    id: 'e920j31d',
    status: 'active',
    name: 'ubuntu-24.04-tk-base',
    version: '24.04',
    size: '709.98 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'ubuntu',
  },
  {
    id: 'e920j32d',
    status: 'active',
    name: 'ubuntu-24.04-tk-base',
    version: '24.04',
    size: '709.98 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'ubuntu',
  },
  {
    id: 'e920j35d',
    status: 'active',
    name: 'ubuntu-22.04-tk-base',
    version: '22.04',
    size: '650.12 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'ubuntu',
  },
  {
    id: 'e920j37d',
    status: 'active',
    name: 'windows-server-2022',
    version: '2022',
    size: '4.5 GiB',
    minDisk: '40.00 GiB',
    minRam: '2 GiB',
    access: 'Public',
    os: 'windows',
  },
  {
    id: 'e920j39d',
    status: 'active',
    name: 'rocky-9.3-tk-base',
    version: '9.3',
    size: '890.23 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'rocky',
  },
];

const mockInstanceSnapshots: InstanceSnapshotRow[] = [
  {
    id: 'snap-1',
    name: 'newsnapshot',
    version: '24.04',
    size: '709 MiB',
    sourceInstance: 'th-server',
    createdAt: 'Sep 1, 2025 08:14',
    status: 'active',
  },
  {
    id: 'snap-2',
    name: 'web-backup',
    version: '22.04',
    size: '1.2 GiB',
    sourceInstance: 'web-server-01',
    createdAt: 'Aug 28, 2025 12:25',
    status: 'active',
  },
  {
    id: 'snap-3',
    name: 'db-snapshot',
    version: '9.2',
    size: '2.5 GiB',
    sourceInstance: 'db-master',
    createdAt: 'Aug 25, 2025 15:33',
    status: 'building',
  },
];

const mockBootableVolumes: BootableVolumeRow[] = [
  {
    id: 'vol-1',
    status: 'available',
    name: 'boot-volume-01',
    size: '50 GiB',
    type: 'SSD',
    createdAt: 'Sep 1, 2025 10:55',
  },
  {
    id: 'vol-2',
    status: 'available',
    name: 'boot-volume-02',
    size: '100 GiB',
    type: 'SSD',
    createdAt: 'Aug 28, 2025 14:22',
  },
  {
    id: 'vol-3',
    status: 'in-use',
    name: 'system-disk',
    size: '80 GiB',
    type: 'HDD',
    createdAt: 'Aug 20, 2025 11:18',
  },
];

const mockFlavors: FlavorRow[] = [
  {
    id: '45hgf456',
    name: 't2.micro',
    vCPU: 1,
    ram: '1GiB',
    disk: '8GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '17kfj123',
    name: 'm5.large',
    vCPU: 2,
    ram: '8GiB',
    disk: '50GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '23hgf234',
    name: 'r5.2xlarge',
    vCPU: 8,
    ram: '64GiB',
    disk: '200GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '12abc345',
    name: 'g4dn.xlarge',
    vCPU: 4,
    ram: '16GiB',
    disk: '125GiB',
    isPublic: true,
    category: 'gpu',
  },
  {
    id: '34ghi567',
    name: 'x1e.xlarge',
    vCPU: 4,
    ram: '122GiB',
    disk: '120GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '56jkl890',
    name: 'c5.2xlarge',
    vCPU: 8,
    ram: '16GiB',
    disk: '50GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '78mno123',
    name: 'i3.xlarge',
    vCPU: 4,
    ram: '30.5GiB',
    disk: '950GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '90pqr456',
    name: 'r5.xlarge',
    vCPU: 4,
    ram: '32GiB',
    disk: '100GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '12stu789',
    name: 'm5.xlarge',
    vCPU: 4,
    ram: '16GiB',
    disk: '100GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '34vwx012',
    name: 't3.large',
    vCPU: 2,
    ram: '8GiB',
    disk: '30GiB',
    isPublic: true,
    hasWarning: true,
    category: 'cpu',
  },
  {
    id: '56yza345',
    name: 'c5.xlarge',
    vCPU: 4,
    ram: '8GiB',
    disk: '50GiB',
    isPublic: true,
    category: 'cpu',
  },
  {
    id: '78bcd678',
    name: 'p3.2xlarge',
    vCPU: 8,
    ram: '61GiB',
    disk: '500GiB',
    isPublic: false,
    category: 'gpu',
  },
  {
    id: '88npu001',
    name: 'npu-medium',
    vCPU: 4,
    ram: '16GiB',
    disk: '100GiB',
    isPublic: true,
    category: 'npu',
  },
];

const mockNetworks: NetworkRow[] = [
  {
    id: 'd32059d1',
    name: 'network',
    subnetCidr: '192.168.10.0/24',
    isExternal: true,
    shared: 'Public',
    status: 'active',
    category: 'current',
  },
  {
    id: 'd32059d2',
    name: 'network',
    subnetCidr: '192.168.10.0/24',
    isExternal: true,
    shared: 'Public',
    status: 'active',
    category: 'current',
  },
  {
    id: 'd32059d3',
    name: 'network',
    subnetCidr: '192.168.10.0/24',
    isExternal: true,
    shared: 'Public',
    status: 'active',
    category: 'current',
  },
  {
    id: 'd32059d4',
    name: 'network',
    subnetCidr: '192.168.10.0/24',
    isExternal: true,
    shared: 'Public',
    status: 'active',
    category: 'current',
  },
  {
    id: 'd32059d5',
    name: 'network',
    subnetCidr: '192.168.10.0/24',
    isExternal: true,
    shared: 'Public',
    status: 'building',
    category: 'current',
  },
  {
    id: 'd32059d6',
    name: 'shared-net-1',
    subnetCidr: '10.0.1.0/24',
    isExternal: false,
    shared: 'Public',
    status: 'active',
    category: 'shared',
  },
  {
    id: 'd32059d7',
    name: 'shared-net-2',
    subnetCidr: '10.0.2.0/24',
    isExternal: false,
    shared: 'Public',
    status: 'active',
    category: 'shared',
  },
  {
    id: 'd32059d8',
    name: 'external-net-1',
    subnetCidr: '203.0.113.0/24',
    isExternal: true,
    shared: 'Public',
    status: 'active',
    category: 'external',
  },
  {
    id: 'd32059d9',
    name: 'external-net-2',
    subnetCidr: '198.51.100.0/24',
    isExternal: true,
    shared: 'Private',
    status: 'active',
    category: 'external',
  },
];

const mockSecurityGroups: SecurityGroupRow[] = [
  { id: 'sg1', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025 10:20:28' },
  { id: 'sg2', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025 10:20:28' },
  { id: 'sg3', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025 10:20:28' },
  { id: 'sg4', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025 10:20:28' },
  { id: 'sg5', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025 10:20:28' },
];

const mockPorts: PortRow[] = [
  {
    id: 'port1',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d1',
    fixedIP: '10.76.0.135',
    macAddress: '10:76:00:00:01:35',
    status: 'active',
  },
  {
    id: 'port2',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d2',
    fixedIP: '10.76.0.136',
    macAddress: '10:76:00:00:01:36',
    status: 'active',
  },
  {
    id: 'port3',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d3',
    fixedIP: '10.76.0.137',
    macAddress: '10:76:00:00:01:37',
    status: 'active',
  },
  {
    id: 'port4',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d4',
    fixedIP: '10.76.0.138',
    macAddress: '10:76:00:00:01:38',
    status: 'active',
  },
  {
    id: 'port5',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d5',
    fixedIP: '10.76.0.155',
    macAddress: '10:76:00:00:01:55',
    status: 'error',
  },
];

const azOptions = [
  { value: 'nova', label: 'nova (Default)' },
  { value: 'nova-az1', label: 'nova-az1' },
  { value: 'nova-az2', label: 'nova-az2' },
];

const diskTypeOptions = [
  { value: '_DEFAULT_', label: '_DEFAULT_' },
  { value: 'ssd', label: 'SSD' },
  { value: 'hdd', label: 'HDD' },
];

const ipAssignmentOptions = [
  { value: 'auto', label: 'Auto-assign' },
  { value: 'manual', label: 'Manual' },
];

const subnetOptionsByNetwork: Record<string, { value: string; label: string }[]> =
  Object.fromEntries(
    mockNetworks.map((n) => [n.id, [{ value: `${n.id}-sn`, label: n.subnetCidr }]] as const)
  );

const networkOptionsForVlan = mockNetworks.map((n) => ({ value: n.id, label: n.name }));

const imageFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Image name…' },
];
const snapshotFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Snapshot name…' },
];
const volumeFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Volume name…' },
];
const flavorFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Flavor name…' },
];
const networkFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Network name…' },
];
const sgFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Security group…' },
];
const portFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Port name…' },
];

function imageRowStatusVariant(s: ImageRow['status']): StatusVariant {
  if (s === 'building') return 'building';
  if (s === 'error') return 'error';
  if (s === 'muted') return 'down';
  return 'active';
}

function snapStatusVariant(s: InstanceSnapshotRow['status']): StatusVariant {
  if (s === 'building') return 'building';
  if (s === 'error') return 'error';
  return 'active';
}

function volumeStatusVariant(s: BootableVolumeRow['status']): StatusVariant {
  if (s === 'available') return 'active';
  if (s === 'in-use') return 'inUse';
  return 'error';
}

function netStatusVariant(s: NetworkRow['status']): StatusVariant {
  if (s === 'building') return 'building';
  if (s === 'error') return 'error';
  return 'active';
}

function portStatusVariant(s: PortRow['status']): StatusVariant {
  if (s === 'error') return 'error';
  return 'active';
}

export function ComputeAdminCreateTemplatePage() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [templateInfoSubmitted, setTemplateInfoSubmitted] = useState(false);

  const [availabilityZone, setAvailabilityZone] = useState('');

  const [sourceTab, setSourceTab] = useState<SourceTab>('image');
  const [osFilter, setOsFilter] = useState<'other' | 'ubuntu' | 'windows' | 'rocky'>('ubuntu');
  const [selectedSource, setSelectedSource] = useState<(string | number)[]>([]);
  const [imageFilters, setImageFilters] = useState<FilterKeyWithValue[]>([]);
  const [snapshotFilters, setSnapshotFilters] = useState<FilterKeyWithValue[]>([]);
  const [volumeFilters, setVolumeFilters] = useState<FilterKeyWithValue[]>([]);
  const [imagePage, setImagePage] = useState(1);
  const [snapshotPage, setSnapshotPage] = useState(1);
  const [volumePage, setVolumePage] = useState(1);
  const [createSystemDisk, setCreateSystemDisk] = useState(true);
  const [systemDiskType, setSystemDiskType] = useState('_DEFAULT_');
  const [systemDiskSize, setSystemDiskSize] = useState(30);
  const [systemDiskDeleteWithInstance, setSystemDiskDeleteWithInstance] = useState(false);
  const [dataDisks, setDataDisks] = useState<DataDiskRow[]>([]);
  const [sourceSubmitted, setSourceSubmitted] = useState(false);
  const [sourceError, setSourceError] = useState<string | null>(null);

  const [flavorTab, setFlavorTab] = useState<FlavorCategory>('cpu');
  const [selectedFlavor, setSelectedFlavor] = useState<(string | number)[]>([]);
  const [flavorFilters, setFlavorFilters] = useState<FilterKeyWithValue[]>([]);
  const [flavorPage, setFlavorPage] = useState(1);
  const [flavorSubmitted, setFlavorSubmitted] = useState(false);
  const [flavorError, setFlavorError] = useState<string | null>(null);

  const [networkCategoryTab, setNetworkCategoryTab] = useState<NetworkCategoryTab>('current');
  const [selectedNetworks, setSelectedNetworks] = useState<(string | number)[]>([]);
  const [networkFilters, setNetworkFilters] = useState<FilterKeyWithValue[]>([]);
  const [networkPage, setNetworkPage] = useState(1);
  const [virtualLANs, setVirtualLANs] = useState<VirtualLAN[]>([]);
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<(string | number)[]>([]);
  const [sgFilters, setSgFilters] = useState<FilterKeyWithValue[]>([]);
  const [sgPage, setSgPage] = useState(1);
  const [portExpanded, setPortExpanded] = useState(false);
  const [selectedPorts, setSelectedPorts] = useState<(string | number)[]>([]);
  const [portFilters, setPortFilters] = useState<FilterKeyWithValue[]>([]);
  const [portPage, setPortPage] = useState(1);
  const [networkSubmitted, setNetworkSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [sgError, setSgError] = useState<string | null>(null);

  const [tags, setTags] = useState<{ key: string; value: string }[]>([]);
  const [userData, setUserData] = useState('');

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    'template-info': 'processing',
    basic: 'default',
    source: 'default',
    flavor: 'default',
    network: 'default',
    advanced: 'default',
  });

  const nameError =
    templateInfoSubmitted && !templateName.trim() ? 'Please enter a template name.' : null;

  const filteredImages = useMemo(() => {
    return mockImages.filter((img) => {
      const osOk = osFilter === 'other' ? img.os === 'other' : img.os === osFilter;
      const filtOk =
        imageFilters.length === 0 ||
        imageFilters.every((f) =>
          String(img[f.key] ?? '')
            .toLowerCase()
            .includes(String(f.value ?? '').toLowerCase())
        );
      return osOk && filtOk;
    });
  }, [osFilter, imageFilters]);

  const filteredSnapshots = useMemo(() => {
    if (snapshotFilters.length === 0) return mockInstanceSnapshots;
    return mockInstanceSnapshots.filter((s) =>
      snapshotFilters.every((f) =>
        String(s[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [snapshotFilters]);

  const filteredVolumes = useMemo(() => {
    if (volumeFilters.length === 0) return mockBootableVolumes;
    return mockBootableVolumes.filter((v) =>
      volumeFilters.every((f) =>
        String(v[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [volumeFilters]);

  const filteredFlavors = useMemo(() => {
    return mockFlavors
      .filter((f) => f.category === flavorTab)
      .filter((f) => {
        if (flavorFilters.length === 0) return true;
        return flavorFilters.every((fl) =>
          String(f[fl.key] ?? '')
            .toLowerCase()
            .includes(String(fl.value ?? '').toLowerCase())
        );
      });
  }, [flavorTab, flavorFilters]);

  const filteredNetworksByTab = useMemo(() => {
    return mockNetworks.filter((n) => n.category === networkCategoryTab);
  }, [networkCategoryTab]);

  const filteredNetworks = useMemo(() => {
    if (networkFilters.length === 0) return filteredNetworksByTab;
    return filteredNetworksByTab.filter((n) =>
      networkFilters.every((f) =>
        String(n[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [filteredNetworksByTab, networkFilters]);

  const filteredSgs = useMemo(() => {
    if (sgFilters.length === 0) return mockSecurityGroups;
    return mockSecurityGroups.filter((sg) =>
      sgFilters.every((f) =>
        String(sg[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [sgFilters]);

  const filteredPorts = useMemo(() => {
    if (portFilters.length === 0) return mockPorts;
    return mockPorts.filter((p) =>
      portFilters.every((f) =>
        String(p[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [portFilters]);

  const paginatedImages = filteredImages.slice(
    (imagePage - 1) * ITEMS_PER_PAGE,
    imagePage * ITEMS_PER_PAGE
  );
  const paginatedSnapshots = filteredSnapshots.slice(
    (snapshotPage - 1) * ITEMS_PER_PAGE,
    snapshotPage * ITEMS_PER_PAGE
  );
  const paginatedVolumes = filteredVolumes.slice(
    (volumePage - 1) * ITEMS_PER_PAGE,
    volumePage * ITEMS_PER_PAGE
  );
  const paginatedFlavors = filteredFlavors.slice(
    (flavorPage - 1) * ITEMS_PER_PAGE,
    flavorPage * ITEMS_PER_PAGE
  );
  const paginatedNetworks = filteredNetworks.slice(
    (networkPage - 1) * ITEMS_PER_PAGE,
    networkPage * ITEMS_PER_PAGE
  );
  const paginatedSgs = filteredSgs.slice((sgPage - 1) * ITEMS_PER_PAGE, sgPage * ITEMS_PER_PAGE);
  const paginatedPorts = filteredPorts.slice(
    (portPage - 1) * ITEMS_PER_PAGE,
    portPage * ITEMS_PER_PAGE
  );

  const imageColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: 60 },
      { key: 'name', header: 'Name', minWidth: 180 },
      { key: 'version', header: 'Version', minWidth: 80 },
      { key: 'size', header: 'Size', minWidth: 100 },
      { key: 'minDisk', header: 'Min disk', minWidth: 100 },
      { key: 'minRam', header: 'Min RAM', minWidth: 90 },
      { key: 'access', header: 'Visibility', minWidth: 90 },
    ],
    []
  );

  const snapshotColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: 60 },
      { key: 'name', header: 'Name', minWidth: 180 },
      { key: 'version', header: 'Version', minWidth: 80 },
      { key: 'size', header: 'Size', minWidth: 100 },
      { key: 'sourceInstance', header: 'Source instance', minWidth: 140 },
      { key: 'createdAt', header: 'Created at', minWidth: 140 },
    ],
    []
  );

  const volumeColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: 60 },
      { key: 'name', header: 'Name', minWidth: 180 },
      { key: 'size', header: 'Size', minWidth: 100 },
      { key: 'type', header: 'Type', minWidth: 80 },
      { key: 'createdAt', header: 'Created at', minWidth: 140 },
    ],
    []
  );

  const flavorColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', minWidth: 200 },
      { key: 'vCPU', header: 'vCPU', width: 72 },
      { key: 'ram', header: 'RAM', minWidth: 90 },
      { key: 'disk', header: 'Root disk', minWidth: 100 },
      { key: 'isPublic', header: 'Public', width: 88 },
    ],
    []
  );

  const networkColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: 60 },
      { key: 'name', header: 'Name', minWidth: 180 },
      { key: 'subnetCidr', header: 'Subnet CIDR', minWidth: 140 },
      { key: 'isExternal', header: 'External', width: 88 },
      { key: 'shared', header: 'Shared', width: 88 },
    ],
    []
  );

  const securityGroupColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', minWidth: 160 },
      { key: 'description', header: 'Description', minWidth: 160 },
      { key: 'createdAt', header: 'Created at', minWidth: 160 },
    ],
    []
  );

  const portColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: 60 },
      { key: 'name', header: 'Name', minWidth: 160 },
      { key: 'ownedNetwork', header: 'Owned network', minWidth: 180 },
      { key: 'fixedIP', header: 'Fixed IP', minWidth: 120 },
      { key: 'macAddress', header: 'MAC Address', minWidth: 140 },
    ],
    []
  );

  const selectedImageRow = mockImages.find((i) => i.id === String(selectedSource[0]));
  const selectedSnapRow = mockInstanceSnapshots.find((s) => s.id === String(selectedSource[0]));
  const selectedVolRow = mockBootableVolumes.find((v) => v.id === String(selectedSource[0]));
  const selectedFlavorRow = mockFlavors.find((f) => f.id === String(selectedFlavor[0]));

  const sourceDisplayName =
    sourceTab === 'image'
      ? selectedImageRow?.name
      : sourceTab === 'snapshot'
        ? selectedSnapRow?.name
        : selectedVolRow?.name;

  const selectionBorder = (err: boolean) =>
    err ? 'border-danger bg-danger-light' : 'border-border bg-surface-muted';

  const validateTemplateInfo = useCallback((): boolean => {
    setTemplateInfoSubmitted(true);
    return !!templateName.trim();
  }, [templateName]);

  const validateBasic = useCallback(() => true, []);

  const validateSource = useCallback((): boolean => {
    setSourceSubmitted(true);
    if (selectedSource.length === 0) {
      setSourceError('Please select a start source.');
      return false;
    }
    if (createSystemDisk) {
      if (!systemDiskType || systemDiskSize < 1) {
        setSourceError('Configure system disk type and size.');
        return false;
      }
    }
    setSourceError(null);
    return true;
  }, [selectedSource.length, createSystemDisk, systemDiskType, systemDiskSize]);

  const validateFlavor = useCallback((): boolean => {
    setFlavorSubmitted(true);
    if (selectedFlavor.length === 0) {
      setFlavorError('Please select a flavor.');
      return false;
    }
    setFlavorError(null);
    return true;
  }, [selectedFlavor.length]);

  const validateNetwork = useCallback((): boolean => {
    setNetworkSubmitted(true);
    let ok = true;
    if (selectedNetworks.length === 0) {
      setNetworkError('Select at least one network.');
      ok = false;
    } else {
      setNetworkError(null);
    }
    if (selectedSecurityGroups.length === 0) {
      setSgError('Select at least one security group.');
      ok = false;
    } else {
      setSgError(null);
    }
    return ok;
  }, [selectedNetworks.length, selectedSecurityGroups.length]);

  const validateAdvanced = useCallback(() => true, []);

  const handleStepChange = useCallback(
    ({ current }: { prev: string | number; current: string | number }) => {
      setStepStatuses((prev) => {
        const next = { ...prev };
        for (const id of STEP_IDS) {
          if (id === current) {
            next[id] = 'processing';
          } else if (prev[id] === 'processing') {
            next[id] = 'writing';
          }
        }
        return next;
      });
    },
    []
  );

  const handleAllComplete = useCallback(() => {
    setAllComplete(true);
    setStepStatuses((prev) => {
      const next = { ...prev };
      for (const id of STEP_IDS) next[id] = 'success';
      return next;
    });
  }, []);

  const addTag = useCallback(() => {
    if (tags.length >= MAX_TAGS) return;
    setTags((t) => [...t, { key: '', value: '' }]);
  }, [tags.length]);

  const removeTag = useCallback((index: number) => {
    setTags((t) => t.filter((_, i) => i !== index));
  }, []);

  const addVirtualLAN = useCallback(() => {
    setVirtualLANs((v) => [
      ...v,
      { id: crypto.randomUUID(), network: '', subnet: '', autoAssign: 'auto' },
    ]);
  }, []);

  const removeVirtualLAN = useCallback((id: string) => {
    setVirtualLANs((v) => v.filter((x) => x.id !== id));
  }, []);

  const nonEmptyTagCount = tags.filter((t) => t.key.trim() || t.value.trim()).length;

  const systemDiskSummary = !createSystemDisk
    ? '-'
    : `${systemDiskType} ${systemDiskSize} GiB${systemDiskDeleteWithInstance ? ' (Deleted with instance)' : ''}`;

  const flavorSummary = selectedFlavorRow
    ? `${selectedFlavorRow.name} (${selectedFlavorRow.vCPU} vCPU, ${selectedFlavorRow.ram}, ${selectedFlavorRow.disk})`
    : '-';

  return (
    <CreateLayout
      title="Create template"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: STEP_IDS.map((id) => ({
                label: STEP_LABELS[id],
                status: stepStatuses[id],
              })),
            },
          ]}
          onCancel={() => navigate('/compute-admin/instance-templates')}
          onAction={() => setConfirmOpen(true)}
          actionEnabled={allComplete}
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      <Stepper
        stepIds={STEP_IDS}
        defaultOpenedId="template-info"
        onAllStepsCompleted={handleAllComplete}
        onStepChange={handleStepChange}
      >
        {[
          {
            id: 'template-info' as const,
            label: 'Template information',
            onComplete: validateTemplateInfo,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Template name <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        A unique name for this instance template.
                      </span>
                    </div>
                    <Input
                      placeholder="Enter template name"
                      value={templateName}
                      onChange={(e) => {
                        setTemplateName(e.target.value);
                        setTemplateInfoSubmitted(false);
                      }}
                      error={!!nameError}
                    />
                    {nameError && <span className="text-11 text-error">{nameError}</span>}
                    <span className="text-11 text-text-subtle">2–64 characters recommended.</span>
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Description</span>
                    <span className="text-12 text-text-muted">Optional details for operators.</span>
                    <Textarea
                      rows={4}
                      placeholder="Enter description"
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                    />
                    <span className="text-11 text-text-subtle">
                      Shown in the template list and details.
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <Checkbox checked={isFavorite} onChange={setIsFavorite}>
                    Mark as Favorite
                  </Checkbox>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Template name</span>
                  <span className="text-12 text-text">{templateName || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Description</span>
                  <span className="text-12 text-text">{templateDescription.trim() || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Favorite</span>
                  <span className="text-12 text-text">{isFavorite ? 'Yes' : 'No'}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'basic' as const,
            label: 'Basic information',
            onComplete: validateBasic,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">AZ (Availability zone)</span>
                      <span className="text-12 text-text-muted">
                        Select the availability zone for the instance.
                      </span>
                    </div>
                    <Dropdown.Select
                      value={availabilityZone}
                      onChange={(v) => setAvailabilityZone(String(v))}
                      placeholder="Select AZ"
                    >
                      {azOptions.map((o) => (
                        <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                      ))}
                    </Dropdown.Select>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">
                    AZ (Availability zone)
                  </span>
                  <span className="text-12 text-text">
                    {availabilityZone
                      ? (azOptions.find((o) => o.value === availabilityZone)?.label ??
                        availabilityZone)
                      : '-'}
                  </span>
                </div>
              </div>
            ),
          },
          {
            id: 'source' as const,
            label: 'Source',
            onComplete: validateSource,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Start source <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Select a template to launch the instance. You can start from an OS image, a
                        snapshot, or an existing volume.
                      </span>
                    </div>
                    <div className="flex border-b border-border-muted">
                      {(
                        [
                          { value: 'image' as const, label: 'Image' },
                          { value: 'snapshot' as const, label: 'Instance snapshot' },
                          { value: 'volume' as const, label: 'Bootable volume' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => {
                            setSourceTab(tab.value);
                            setSelectedSource([]);
                            setSourceError(null);
                            setSourceSubmitted(false);
                          }}
                          className={`px-3 py-2 text-12 font-medium border-b-2 transition-colors ${
                            sourceTab === tab.value
                              ? 'border-primary text-primary'
                              : 'border-transparent text-text-muted hover:text-text'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {sourceTab === 'image' && (
                  <>
                    <div className="w-full h-px bg-border-muted" />
                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-1">
                          {(['other', 'ubuntu', 'windows', 'rocky'] as const).map((os) => (
                            <button
                              key={os}
                              type="button"
                              onClick={() => {
                                setOsFilter(os);
                                setImagePage(1);
                              }}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-12 font-medium border transition-colors ${
                                osFilter === os
                                  ? 'bg-surface border-border text-text'
                                  : 'bg-transparent border-transparent text-text-muted hover:bg-surface-subtle'
                              }`}
                            >
                              {os === 'other' && <IconDots size={14} />}
                              {os === 'ubuntu' && <IconBrandUbuntu size={14} />}
                              {os === 'windows' && <IconBrandWindows size={14} />}
                              {os === 'rocky' && <IconHexagon size={14} />}
                              {os === 'other' ? 'Others' : os.charAt(0).toUpperCase() + os.slice(1)}
                            </button>
                          ))}
                        </div>
                        <FilterSearchInput
                          filterKeys={imageFilterKeys}
                          onFilterAdd={(f) => {
                            setImageFilters((p) => [...p, f]);
                            setImagePage(1);
                          }}
                          selectedFilters={imageFilters}
                          placeholder="Search image by attributes"
                          defaultFilterKey="name"
                        />
                        <Pagination
                          totalCount={filteredImages.length}
                          size={ITEMS_PER_PAGE}
                          currentAt={imagePage}
                          onPageChange={setImagePage}
                          totalCountLabel="images"
                          selectedCount={selectedSource.length}
                        />
                        <SelectableTable<ImageRow>
                          columns={imageColumns}
                          rows={paginatedImages}
                          selectionType="radio"
                          selectedRows={selectedSource}
                          onRowSelectionChange={(ids) => {
                            setSelectedSource(ids);
                            setSourceError(null);
                          }}
                          getRowId={(row) => row.id}
                          radioGroupName="template-source-image"
                        >
                          {paginatedImages.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={imageColumns[0]}>
                                <StatusIndicator
                                  variant={imageRowStatusVariant(row.status)}
                                  layout="iconOnly"
                                />
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[1]}>
                                <div className="flex min-w-0 flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                    {row.name}
                                    <IconExternalLink size={12} />
                                  </span>
                                  <span className="text-11 text-text-subtle">ID: {row.id}</span>
                                </div>
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[2]}>
                                {row.version}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[3]}>
                                {row.size}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[4]}>
                                {row.minDisk}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[5]}>
                                {row.minRam}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[6]}>
                                {row.access}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>
                        <div className="flex flex-wrap items-center gap-1 pt-2">
                          {selectedSource.length > 0 &&
                            sourceTab === 'image' &&
                            selectedImageRow && (
                              <Tag
                                label={selectedImageRow.name}
                                variant="multiSelect"
                                onClose={() => {
                                  setSelectedSource([]);
                                  setSourceError(null);
                                }}
                              />
                            )}
                        </div>
                        {sourceSubmitted && sourceError && selectedSource.length === 0 && (
                          <span className="text-11 text-error pt-1">{sourceError}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {sourceTab === 'snapshot' && (
                  <>
                    <div className="w-full h-px bg-border-muted" />
                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <FilterSearchInput
                          filterKeys={snapshotFilterKeys}
                          onFilterAdd={(f) => {
                            setSnapshotFilters((p) => [...p, f]);
                            setSnapshotPage(1);
                          }}
                          selectedFilters={snapshotFilters}
                          placeholder="Search snapshot by attributes"
                          defaultFilterKey="name"
                        />
                        <Pagination
                          totalCount={filteredSnapshots.length}
                          size={ITEMS_PER_PAGE}
                          currentAt={snapshotPage}
                          onPageChange={setSnapshotPage}
                          totalCountLabel="snapshots"
                          selectedCount={selectedSource.length}
                        />
                        <SelectableTable<InstanceSnapshotRow>
                          columns={snapshotColumns}
                          rows={paginatedSnapshots}
                          selectionType="radio"
                          selectedRows={selectedSource}
                          onRowSelectionChange={(ids) => {
                            setSelectedSource(ids);
                            setSourceError(null);
                          }}
                          getRowId={(row) => row.id}
                          radioGroupName="template-source-snap"
                        >
                          {paginatedSnapshots.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={snapshotColumns[0]}>
                                <StatusIndicator
                                  variant={snapStatusVariant(row.status)}
                                  layout="iconOnly"
                                />
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[1]}>
                                <div className="flex min-w-0 flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                    {row.name}
                                    <IconExternalLink size={12} />
                                  </span>
                                  <span className="text-11 text-text-subtle">ID: {row.id}</span>
                                </div>
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[2]}>
                                {row.version}
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[3]}>
                                {row.size}
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[4]}>
                                {row.sourceInstance}
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[5]}>
                                {row.createdAt}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>
                        <div className="flex flex-wrap items-center gap-1 pt-2">
                          {selectedSource.length > 0 &&
                            sourceTab === 'snapshot' &&
                            selectedSnapRow && (
                              <Tag
                                label={selectedSnapRow.name}
                                variant="multiSelect"
                                onClose={() => {
                                  setSelectedSource([]);
                                  setSourceError(null);
                                }}
                              />
                            )}
                        </div>
                        {sourceSubmitted && sourceError && selectedSource.length === 0 && (
                          <span className="text-11 text-error pt-1">{sourceError}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {sourceTab === 'volume' && (
                  <>
                    <div className="w-full h-px bg-border-muted" />
                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <FilterSearchInput
                          filterKeys={volumeFilterKeys}
                          onFilterAdd={(f) => {
                            setVolumeFilters((p) => [...p, f]);
                            setVolumePage(1);
                          }}
                          selectedFilters={volumeFilters}
                          placeholder="Search volume by attributes"
                          defaultFilterKey="name"
                        />
                        <Pagination
                          totalCount={filteredVolumes.length}
                          size={ITEMS_PER_PAGE}
                          currentAt={volumePage}
                          onPageChange={setVolumePage}
                          totalCountLabel="volumes"
                          selectedCount={selectedSource.length}
                        />
                        <SelectableTable<BootableVolumeRow>
                          columns={volumeColumns}
                          rows={paginatedVolumes}
                          selectionType="radio"
                          selectedRows={selectedSource}
                          onRowSelectionChange={(ids) => {
                            setSelectedSource(ids);
                            setSourceError(null);
                          }}
                          getRowId={(row) => row.id}
                          radioGroupName="template-source-vol"
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
                                <div className="flex min-w-0 flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                    {row.name}
                                    <IconExternalLink size={12} />
                                  </span>
                                  <span className="text-11 text-text-subtle">ID: {row.id}</span>
                                </div>
                              </Table.Td>
                              <Table.Td rowData={row} column={volumeColumns[2]}>
                                {row.size}
                              </Table.Td>
                              <Table.Td rowData={row} column={volumeColumns[3]}>
                                {row.type}
                              </Table.Td>
                              <Table.Td rowData={row} column={volumeColumns[4]}>
                                {row.createdAt}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>
                        <div className="flex flex-wrap items-center gap-1 pt-2">
                          {selectedSource.length > 0 &&
                            sourceTab === 'volume' &&
                            selectedVolRow && (
                              <Tag
                                label={selectedVolRow.name}
                                variant="multiSelect"
                                onClose={() => {
                                  setSelectedSource([]);
                                  setSourceError(null);
                                }}
                              />
                            )}
                        </div>
                        {sourceSubmitted && sourceError && selectedSource.length === 0 && (
                          <span className="text-11 text-error pt-1">{sourceError}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">System disk</span>
                      <span className="text-12 text-text-muted">
                        Configure whether to create a system disk for booting.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={createSystemDisk}
                        onChange={(e) => {
                          setCreateSystemDisk(e.target.checked);
                          setSourceError(null);
                        }}
                      />
                      <span className="text-12 text-text">Create a new system disk</span>
                    </div>
                    {createSystemDisk && (
                      <div className="rounded-md border border-border bg-surface-default px-4 py-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <span className="text-11 font-medium text-text">Type</span>
                            <Dropdown.Select
                              value={systemDiskType}
                              onChange={(v) => setSystemDiskType(String(v))}
                              placeholder="Type"
                            >
                              {diskTypeOptions.map((o) => (
                                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                              ))}
                            </Dropdown.Select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="text-11 font-medium text-text">Size</span>
                            <div className="flex items-center gap-2">
                              <NumberInput
                                min={1}
                                max={2000}
                                step={1}
                                value={systemDiskSize}
                                onChange={setSystemDiskSize}
                                size="md"
                              />
                              <span className="text-12 text-text-muted">GiB</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Checkbox
                            checked={systemDiskDeleteWithInstance}
                            onChange={setSystemDiskDeleteWithInstance}
                          >
                            Deleted with the instance
                          </Checkbox>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Data disk</span>
                      <span className="text-12 text-text-muted">
                        Attach additional volumes for data storage.
                      </span>
                    </div>
                    <div className="bg-surface-subtle rounded-md px-4 py-3 w-full">
                      <div className="flex flex-col gap-3">
                        {dataDisks.length > 0 && (
                          <div className="grid grid-cols-[1fr_100px_1fr_auto] items-center gap-1">
                            <span className="text-11 font-medium text-text-muted">Type</span>
                            <span className="text-11 font-medium text-text-muted">Size (GiB)</span>
                            <span className="text-11 font-medium text-text-muted">
                              Delete with instance
                            </span>
                            <div />
                            {dataDisks.map((disk) => (
                              <div key={disk.id} className="contents">
                                <Dropdown.Select
                                  value={disk.type}
                                  onChange={(v) =>
                                    setDataDisks((prev) =>
                                      prev.map((d) =>
                                        d.id === disk.id ? { ...d, type: String(v) } : d
                                      )
                                    )
                                  }
                                >
                                  {diskTypeOptions.map((o) => (
                                    <Dropdown.Option
                                      key={o.value}
                                      value={o.value}
                                      label={o.label}
                                    />
                                  ))}
                                </Dropdown.Select>
                                <NumberInput
                                  min={1}
                                  max={2000}
                                  step={1}
                                  value={disk.size}
                                  onChange={(n) =>
                                    setDataDisks((prev) =>
                                      prev.map((d) => (d.id === disk.id ? { ...d, size: n } : d))
                                    )
                                  }
                                  size="md"
                                />
                                <Toggle
                                  checked={disk.deleteWithInstance}
                                  onChange={(e) =>
                                    setDataDisks((prev) =>
                                      prev.map((d) =>
                                        d.id === disk.id
                                          ? { ...d, deleteWithInstance: e.target.checked }
                                          : d
                                      )
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  aria-label="Remove data disk"
                                  className="flex size-5 items-center justify-center rounded hover:bg-surface-muted transition-colors"
                                  onClick={() =>
                                    setDataDisks((prev) => prev.filter((d) => d.id !== disk.id))
                                  }
                                >
                                  <IconX size={14} className="text-text-muted" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setDataDisks((prev) => [
                              ...prev,
                              {
                                id: crypto.randomUUID(),
                                type: '_DEFAULT_',
                                size: 10,
                                deleteWithInstance: true,
                              },
                            ])
                          }
                          className="inline-flex items-center gap-1 text-12 font-medium text-primary hover:underline w-fit"
                        >
                          <IconCirclePlus size={12} />
                          Add Data disk
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {sourceSubmitted && sourceError && selectedSource.length > 0 && (
                  <span className="px-6 pb-2 text-11 text-error">{sourceError}</span>
                )}
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">
                    {sourceTab === 'image'
                      ? 'Image'
                      : sourceTab === 'snapshot'
                        ? 'Instance snapshot'
                        : 'Bootable volume'}
                  </span>
                  <span className="text-12 text-text">{sourceDisplayName ?? '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">System disk</span>
                  <span className="text-12 text-text">{systemDiskSummary}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'flavor' as const,
            label: 'Flavor',
            onComplete: validateFlavor,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Flavors <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Select a flavor from the list to use for the instance.
                      </span>
                    </div>
                    <div className="flex border-b border-border-muted">
                      {(
                        [
                          { value: 'cpu' as const, label: 'CPU' },
                          { value: 'gpu' as const, label: 'GPU' },
                          { value: 'npu' as const, label: 'NPU' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => {
                            setFlavorTab(tab.value);
                            setSelectedFlavor([]);
                            setFlavorPage(1);
                            setFlavorError(null);
                          }}
                          className={`px-3 py-2 text-12 font-medium border-b-2 transition-colors ${
                            flavorTab === tab.value
                              ? 'border-primary text-primary'
                              : 'border-transparent text-text-muted hover:text-text'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <FilterSearchInput
                      filterKeys={flavorFilterKeys}
                      onFilterAdd={(f) => {
                        setFlavorFilters((p) => [...p, f]);
                        setFlavorPage(1);
                      }}
                      selectedFilters={flavorFilters}
                      placeholder="Search flavor by attributes"
                      defaultFilterKey="name"
                    />
                    <Pagination
                      totalCount={filteredFlavors.length}
                      size={ITEMS_PER_PAGE}
                      currentAt={flavorPage}
                      onPageChange={setFlavorPage}
                      totalCountLabel="flavors"
                      selectedCount={selectedFlavor.length}
                    />
                    <SelectableTable<FlavorRow>
                      columns={flavorColumns}
                      rows={paginatedFlavors}
                      selectionType="radio"
                      selectedRows={selectedFlavor}
                      onRowSelectionChange={(ids) => {
                        setSelectedFlavor(ids);
                        setFlavorError(null);
                      }}
                      getRowId={(row) => row.id}
                      radioGroupName="template-flavor"
                    >
                      {paginatedFlavors.map((row) => (
                        <Table.Tr key={row.id} rowData={row}>
                          <Table.Td rowData={row} column={flavorColumns[0]}>
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                {row.hasWarning && (
                                  <IconAlertCircle
                                    size={14}
                                    className="shrink-0 text-[var(--semantic-color-warning-fg)]"
                                  />
                                )}
                                {row.name}
                                <IconExternalLink size={12} />
                              </span>
                              <span className="text-11 text-text-subtle">ID: {row.id}</span>
                            </div>
                          </Table.Td>
                          <Table.Td rowData={row} column={flavorColumns[1]}>
                            {row.vCPU}
                          </Table.Td>
                          <Table.Td rowData={row} column={flavorColumns[2]}>
                            {row.ram}
                          </Table.Td>
                          <Table.Td rowData={row} column={flavorColumns[3]}>
                            {row.disk}
                          </Table.Td>
                          <Table.Td rowData={row} column={flavorColumns[4]}>
                            {row.isPublic ? 'On' : 'Off'}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>
                    <div
                      className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                        !!(flavorSubmitted && flavorError)
                      )}`}
                    >
                      {selectedFlavor.length === 0 ? (
                        <span className="text-11 text-text-muted">
                          {flavorError ?? 'No flavor selected'}
                        </span>
                      ) : (
                        selectedFlavor.map((id) => (
                          <Tag
                            key={String(id)}
                            label={selectedFlavorRow?.name ?? String(id)}
                            variant="multiSelect"
                            onClose={() => {
                              setSelectedFlavor([]);
                              setFlavorError(null);
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Flavor</span>
                  <span className="text-12 text-text">{flavorSummary}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'network' as const,
            label: 'Network',
            onComplete: validateNetwork,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Network <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        If you select a port, selecting a network is optional. You may still add
                        another network if required.
                      </span>
                    </div>
                    <div className="flex border-b border-border-muted">
                      {(
                        [
                          { value: 'current' as const, label: 'Current tenant' },
                          { value: 'shared' as const, label: 'Shared' },
                          { value: 'external' as const, label: 'External' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => {
                            setNetworkCategoryTab(tab.value);
                            setNetworkPage(1);
                          }}
                          className={`px-3 py-2 text-12 font-medium border-b-2 transition-colors ${
                            networkCategoryTab === tab.value
                              ? 'border-primary text-primary'
                              : 'border-transparent text-text-muted hover:text-text'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <FilterSearchInput
                        filterKeys={networkFilterKeys}
                        onFilterAdd={(f) => {
                          setNetworkFilters((p) => [...p, f]);
                          setNetworkPage(1);
                        }}
                        selectedFilters={networkFilters}
                        placeholder="Search network by attributes"
                        defaultFilterKey="name"
                        className="min-w-[200px] flex-1"
                      />
                      <Button variant="secondary" size="sm" type="button">
                        Create a new network
                      </Button>
                    </div>
                    <Pagination
                      totalCount={filteredNetworks.length}
                      size={ITEMS_PER_PAGE}
                      currentAt={networkPage}
                      onPageChange={setNetworkPage}
                      totalCountLabel="networks"
                      selectedCount={selectedNetworks.length}
                    />
                    <SelectableTable<NetworkRow>
                      columns={networkColumns}
                      rows={paginatedNetworks}
                      selectionType="checkbox"
                      selectedRows={selectedNetworks}
                      onRowSelectionChange={(ids) => {
                        setSelectedNetworks(ids);
                        setNetworkError(null);
                      }}
                      getRowId={(row) => row.id}
                    >
                      {paginatedNetworks.map((row) => (
                        <Table.Tr key={row.id} rowData={row}>
                          <Table.Td rowData={row} column={networkColumns[0]}>
                            <StatusIndicator
                              variant={netStatusVariant(row.status)}
                              layout="iconOnly"
                            />
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[1]}>
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                {row.name}
                                <IconExternalLink size={12} />
                              </span>
                              <span className="text-11 text-text-subtle">ID: {row.id}</span>
                            </div>
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[2]}>
                            {row.subnetCidr}
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[3]}>
                            {row.isExternal ? 'Yes' : 'No'}
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[4]}>
                            {row.shared}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>
                    <div className="flex flex-wrap items-center gap-1 pt-2">
                      {selectedNetworks.map((id) => {
                        const net = mockNetworks.find((n) => n.id === String(id));
                        return net ? (
                          <Tag
                            key={String(id)}
                            label={net.name}
                            variant="multiSelect"
                            onClose={() => {
                              setSelectedNetworks((prev) => prev.filter((x) => x !== id));
                              setNetworkError(null);
                            }}
                          />
                        ) : null;
                      })}
                    </div>
                    {networkSubmitted && networkError && (
                      <span className="text-11 text-error pt-1">{networkError}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Virtual LAN</span>
                      <span className="text-12 text-text-muted">
                        Add interfaces with specific subnet and IP assignment (optional).
                      </span>
                    </div>
                    <div className="bg-surface-subtle rounded-md px-4 py-3 w-full">
                      <div className="flex flex-col gap-1.5">
                        {virtualLANs.length > 0 && (
                          <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                            <span className="text-11 font-medium text-text-muted">Network</span>
                            <span className="text-11 font-medium text-text-muted">Subnet</span>
                            <span className="text-11 font-medium text-text-muted">
                              IP Assignment
                            </span>
                            <div className="w-5" />
                          </div>
                        )}
                        {virtualLANs.map((vlan) => (
                          <div
                            key={vlan.id}
                            className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                          >
                            <Dropdown.Select
                              value={vlan.network}
                              onChange={(v) =>
                                setVirtualLANs((prev) =>
                                  prev.map((x) =>
                                    x.id === vlan.id ? { ...x, network: String(v), subnet: '' } : x
                                  )
                                )
                              }
                              placeholder="Network"
                            >
                              {networkOptionsForVlan.map((o) => (
                                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                              ))}
                            </Dropdown.Select>
                            <Dropdown.Select
                              value={vlan.subnet}
                              onChange={(v) =>
                                setVirtualLANs((prev) =>
                                  prev.map((x) =>
                                    x.id === vlan.id ? { ...x, subnet: String(v) } : x
                                  )
                                )
                              }
                              placeholder="Subnet"
                            >
                              {(
                                subnetOptionsByNetwork[vlan.network] ?? [{ value: '', label: '—' }]
                              ).map((o) => (
                                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                              ))}
                            </Dropdown.Select>
                            <Dropdown.Select
                              value={vlan.autoAssign}
                              onChange={(v) =>
                                setVirtualLANs((prev) =>
                                  prev.map((x) =>
                                    x.id === vlan.id ? { ...x, autoAssign: String(v) } : x
                                  )
                                )
                              }
                            >
                              {ipAssignmentOptions.map((o) => (
                                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                              ))}
                            </Dropdown.Select>
                            <button
                              type="button"
                              onClick={() => removeVirtualLAN(vlan.id)}
                              className="size-5 flex items-center justify-center hover:bg-surface-muted rounded transition-colors"
                              aria-label="Remove virtual LAN"
                            >
                              <IconX size={14} className="text-text-muted" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addVirtualLAN}
                          className="inline-flex items-center gap-1 text-12 font-medium text-primary hover:underline w-fit"
                        >
                          <IconCirclePlus size={12} />
                          Add virtual LAN
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Security groups <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Security groups apply to all networks except ports with security disabled.
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <FilterSearchInput
                        filterKeys={sgFilterKeys}
                        onFilterAdd={(f) => {
                          setSgFilters((p) => [...p, f]);
                          setSgPage(1);
                        }}
                        selectedFilters={sgFilters}
                        placeholder="Search security group by attributes"
                        defaultFilterKey="name"
                        className="min-w-[200px] flex-1"
                      />
                      <Button variant="secondary" size="sm" type="button">
                        Create a new security group
                      </Button>
                    </div>
                    <Pagination
                      totalCount={filteredSgs.length}
                      size={ITEMS_PER_PAGE}
                      currentAt={sgPage}
                      onPageChange={setSgPage}
                      totalCountLabel="security groups"
                      selectedCount={selectedSecurityGroups.length}
                    />
                    <SelectableTable<SecurityGroupRow>
                      columns={securityGroupColumns}
                      rows={paginatedSgs}
                      selectionType="checkbox"
                      selectedRows={selectedSecurityGroups}
                      onRowSelectionChange={(ids) => {
                        setSelectedSecurityGroups(ids);
                        setSgError(null);
                      }}
                      getRowId={(row) => row.id}
                    >
                      {paginatedSgs.map((row) => (
                        <Table.Tr key={row.id} rowData={row}>
                          <Table.Td rowData={row} column={securityGroupColumns[0]}>
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                {row.name}
                                <IconExternalLink size={12} />
                              </span>
                              <span className="text-11 text-text-subtle">ID: {row.id}</span>
                            </div>
                          </Table.Td>
                          <Table.Td rowData={row} column={securityGroupColumns[1]}>
                            {row.description}
                          </Table.Td>
                          <Table.Td rowData={row} column={securityGroupColumns[2]}>
                            {row.createdAt}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>
                    <div className="flex flex-wrap items-center gap-1 pt-2">
                      {selectedSecurityGroups.map((id) => {
                        const sg = mockSecurityGroups.find((s) => s.id === String(id));
                        return sg ? (
                          <Tag
                            key={String(id)}
                            label={sg.name}
                            variant="multiSelect"
                            onClose={() => {
                              setSelectedSecurityGroups((prev) => prev.filter((x) => x !== id));
                              setSgError(null);
                            }}
                          />
                        ) : null;
                      })}
                    </div>
                    {networkSubmitted && sgError && (
                      <span className="text-11 text-error pt-1">{sgError}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <Disclosure label="Port" expanded={portExpanded} onExpandChange={setPortExpanded}>
                    <div className="flex flex-col gap-3 pt-3">
                      <FilterSearchInput
                        filterKeys={portFilterKeys}
                        onFilterAdd={(f) => {
                          setPortFilters((p) => [...p, f]);
                          setPortPage(1);
                        }}
                        selectedFilters={portFilters}
                        placeholder="Search port by attributes"
                        defaultFilterKey="name"
                      />
                      <Pagination
                        totalCount={filteredPorts.length}
                        size={ITEMS_PER_PAGE}
                        currentAt={portPage}
                        onPageChange={setPortPage}
                        totalCountLabel="ports"
                        selectedCount={selectedPorts.length}
                      />
                      <SelectableTable<PortRow>
                        columns={portColumns}
                        rows={paginatedPorts}
                        selectionType="checkbox"
                        selectedRows={selectedPorts}
                        onRowSelectionChange={setSelectedPorts}
                        getRowId={(row) => row.id}
                      >
                        {paginatedPorts.map((row) => (
                          <Table.Tr key={row.id} rowData={row}>
                            <Table.Td rowData={row} column={portColumns[0]}>
                              <StatusIndicator
                                variant={portStatusVariant(row.status)}
                                layout="iconOnly"
                              />
                            </Table.Td>
                            <Table.Td rowData={row} column={portColumns[1]}>
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                  {row.name}
                                  <IconExternalLink size={12} />
                                </span>
                                <span className="text-11 text-text-subtle">ID: {row.id}</span>
                              </div>
                            </Table.Td>
                            <Table.Td rowData={row} column={portColumns[2]}>
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                  {row.ownedNetwork}
                                  <IconExternalLink size={12} />
                                </span>
                                <span className="text-11 text-text-subtle">
                                  ID: {row.ownedNetworkId}
                                </span>
                              </div>
                            </Table.Td>
                            <Table.Td rowData={row} column={portColumns[3]}>
                              {row.fixedIP}
                            </Table.Td>
                            <Table.Td rowData={row} column={portColumns[4]}>
                              {row.macAddress}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </SelectableTable>
                      <div className="flex flex-wrap items-center gap-1 pt-2">
                        {selectedPorts.map((id) => {
                          const p = mockPorts.find((x) => x.id === String(id));
                          return p ? (
                            <Tag
                              key={String(id)}
                              label={p.name}
                              variant="multiSelect"
                              onClose={() =>
                                setSelectedPorts((prev) => prev.filter((x) => x !== id))
                              }
                            />
                          ) : null;
                        })}
                      </div>
                    </div>
                  </Disclosure>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Network</span>
                  <span className="text-12 text-text">
                    {selectedNetworks.length
                      ? selectedNetworks
                          .map((id) => mockNetworks.find((n) => n.id === String(id))?.name)
                          .filter(Boolean)
                          .join(', ')
                      : '-'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Security groups</span>
                  <span className="text-12 text-text">
                    {selectedSecurityGroups.length
                      ? selectedSecurityGroups
                          .map((id) => mockSecurityGroups.find((s) => s.id === String(id))?.name)
                          .filter(Boolean)
                          .join(', ')
                      : '-'}
                  </span>
                </div>
              </div>
            ),
          },
          {
            id: 'advanced' as const,
            label: 'Advanced',
            onComplete: validateAdvanced,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Tags</span>
                      <span className="text-12 text-text-muted">
                        Optional metadata as key-value pairs. You can add up to {MAX_TAGS} tags.
                      </span>
                    </div>
                    <div className="bg-surface-subtle rounded-md px-4 py-3 w-full">
                      <div className="flex flex-col gap-1.5">
                        {tags.length > 0 && (
                          <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
                            <span className="text-11 font-medium text-text-muted">Key</span>
                            <span className="text-11 font-medium text-text-muted">Value</span>
                            <div className="w-5" />
                          </div>
                        )}
                        {tags.map((tag, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                          >
                            <Input
                              placeholder="tag key"
                              value={tag.key}
                              onChange={(e) => {
                                const next = [...tags];
                                next[i] = { ...next[i], key: e.target.value };
                                setTags(next);
                              }}
                            />
                            <Input
                              placeholder="tag value"
                              value={tag.value}
                              onChange={(e) => {
                                const next = [...tags];
                                next[i] = { ...next[i], value: e.target.value };
                                setTags(next);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeTag(i)}
                              className="size-5 flex items-center justify-center hover:bg-surface-muted rounded transition-colors"
                              aria-label="Remove tag"
                            >
                              <IconX size={14} className="text-text-muted" />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={addTag}
                            className="inline-flex items-center gap-1 text-12 font-medium text-primary hover:underline"
                          >
                            <IconCirclePlus size={12} />
                            Add tag
                          </button>
                          <span className="text-11 text-text-subtle">
                            {tags.length} / {MAX_TAGS} tags
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">User data</span>
                      <span className="text-12 text-text-muted">
                        Enter a script or cloud-init configuration to run when the instance first
                        boots.
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.onchange = () => {
                            const file = input.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              setUserData(String(reader.result ?? ''));
                            };
                            reader.readAsText(file);
                          };
                          input.click();
                        }}
                      >
                        <IconUpload size={12} />
                        Choose file
                      </Button>
                    </div>
                    <Textarea
                      rows={6}
                      placeholder="#cloud-config or shell script"
                      value={userData}
                      onChange={(e) => setUserData(e.target.value)}
                    />
                    <span className="text-11 text-text-subtle">
                      {(new Blob([userData]).size / 1024).toFixed(1)} / 16 KB
                    </span>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Tags</span>
                  <span className="text-12 text-text">
                    {nonEmptyTagCount > 0 ? `${nonEmptyTagCount} tags` : '-'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">User data</span>
                  <span className="text-12 text-text">{userData.trim() ? 'Configured' : '-'}</span>
                </div>
              </div>
            ),
          },
        ]}
      </Stepper>
      {confirmOpen && (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate('/compute-admin/instance-templates');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create template',
            subtitle: 'This is UI-only. No template will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}
