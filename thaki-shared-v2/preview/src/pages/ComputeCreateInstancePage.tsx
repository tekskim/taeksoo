import { useState, useMemo, useCallback, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input, NumberInput } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { RadioButton } from '@shared/components/RadioButton';
import { Toggle } from '@shared/components/Toggle';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import {
  IconBrandUbuntu,
  IconBrandWindows,
  IconCirclePlus,
  IconDots,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconHexagon,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';

const STEP_IDS = ['launch', 'basic', 'source', 'flavor', 'network', 'auth', 'advanced'] as const;

type ResourceType = 'vm' | 'baremetal';
type SourceTab = 'image' | 'snapshot' | 'volume';
type FlavorCategory = 'cpu' | 'gpu' | 'npu';
type AuthTab = 'keypair' | 'password';

interface TemplateRow {
  id: string;
  name: string;
  visibility: string;
  createdAt: string;
  [key: string]: unknown;
}

interface ImageRow {
  id: string;
  name: string;
  version: string;
  size: string;
  minDisk: string;
  minRAM: string;
  visibility: string;
  os: string;
  status: 'active' | 'error' | 'building';
  [key: string]: unknown;
}

interface InstanceSnapshotRow {
  id: string;
  name: string;
  version: string;
  size: string;
  sourceInstance: string;
  createdAt: string;
  status: 'active' | 'error' | 'building';
  [key: string]: unknown;
}

interface BootableVolumeRow {
  id: string;
  name: string;
  size: string;
  type: string;
  createdAt: string;
  status: 'available' | 'in-use' | 'error';
  [key: string]: unknown;
}

interface FlavorRow {
  id: string;
  name: string;
  vCPU: number;
  ram: string;
  disk: string;
  access: string;
  category: FlavorCategory;
  [key: string]: unknown;
}

interface NetworkRow {
  id: string;
  name: string;
  status: string;
  subnetCidr: string;
  external: boolean;
  access: string;
  [key: string]: unknown;
}

interface SecurityGroupRow {
  id: string;
  name: string;
  description: string;
  [key: string]: unknown;
}

interface KeyPairRow {
  id: string;
  name: string;
  fingerprint: string;
  [key: string]: unknown;
}

interface ServerGroupRow {
  id: string;
  name: string;
  memberCount: number;
  policy: string;
  [key: string]: unknown;
}

interface DataDiskRow {
  id: string;
  type: string;
  size: number;
  deleteWithInstance: boolean;
}

interface VlanRow {
  id: string;
  network: string;
  subnet: string;
  ipAssignment: string;
}

const mockTemplates: TemplateRow[] = [
  { id: 'tpl-1', name: 'th.tiny', visibility: 'Private', createdAt: 'Nov 19, 2025 10:22' },
  { id: 'tpl-2', name: 'th.small', visibility: 'Public', createdAt: 'Nov 18, 2025 14:38' },
  { id: 'tpl-3', name: 'th.medium', visibility: 'Private', createdAt: 'Nov 17, 2025 09:15' },
  { id: 'tpl-4', name: 'th.large', visibility: 'Public', createdAt: 'Nov 16, 2025 16:52' },
  { id: 'tpl-5', name: 'th.xlarge', visibility: 'Private', createdAt: 'Nov 15, 2025 11:03' },
  { id: 'tpl-6', name: 'th.2xlarge', visibility: 'Public', createdAt: 'Nov 14, 2025 13:47' },
];

const mockImages: ImageRow[] = [
  {
    id: 'img-1',
    name: 'ubuntu-24.04-tk-base',
    version: '24.04',
    size: '709 MiB',
    minDisk: '10 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-2',
    name: 'ubuntu-22.04-tk-base',
    version: '22.04',
    size: '650 MiB',
    minDisk: '10 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'active',
  },
  {
    id: 'img-3',
    name: 'windows-server-2022',
    version: '2022',
    size: '4.5 GiB',
    minDisk: '40 GiB',
    minRAM: '2 GiB',
    visibility: 'Public',
    os: 'windows',
    status: 'active',
  },
  {
    id: 'img-4',
    name: 'rocky-9.3-tk-base',
    version: '9.3',
    size: '890 MiB',
    minDisk: '10 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'rocky',
    status: 'active',
  },
  {
    id: 'img-5',
    name: 'debian-12-base',
    version: '12',
    size: '520 MiB',
    minDisk: '10 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'other',
    status: 'active',
  },
  {
    id: 'img-6',
    name: 'ubuntu-20.04-tk-base',
    version: '20.04',
    size: '580 MiB',
    minDisk: '10 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'ubuntu',
    status: 'error',
  },
  {
    id: 'img-7',
    name: 'centos-stream-9',
    version: '9',
    size: '920 MiB',
    minDisk: '10 MiB',
    minRAM: '0 MiB',
    visibility: 'Public',
    os: 'other',
    status: 'building',
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
    status: 'active',
  },
  {
    id: 'snap-4',
    name: 'app-snapshot',
    version: '24.04',
    size: '890 MiB',
    sourceInstance: 'app-server',
    createdAt: 'Aug 20, 2025 09:42',
    status: 'building',
  },
  {
    id: 'snap-5',
    name: 'test-snapshot',
    version: '22.04',
    size: '512 MiB',
    sourceInstance: 'test-vm',
    createdAt: 'Aug 15, 2025 17:08',
    status: 'active',
  },
  {
    id: 'snap-6',
    name: 'staging-snap',
    version: '24.04',
    size: '600 MiB',
    sourceInstance: 'staging-01',
    createdAt: 'Aug 10, 2025 11:00',
    status: 'active',
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
  {
    id: 'vol-4',
    status: 'available',
    name: 'data-boot',
    size: '200 GiB',
    type: 'SSD',
    createdAt: 'Aug 15, 2025 09:30',
  },
  {
    id: 'vol-5',
    status: 'error',
    name: 'legacy-vol',
    size: '30 GiB',
    type: 'HDD',
    createdAt: 'Jul 1, 2025 14:00',
  },
];

const mockFlavors: FlavorRow[] = [
  {
    id: 'flv-1',
    name: 't2.micro',
    vCPU: 2,
    ram: '2 GiB',
    disk: '50 GiB',
    access: 'Public',
    category: 'cpu',
  },
  {
    id: 'flv-2',
    name: 'm5.large',
    vCPU: 2,
    ram: '8 GiB',
    disk: '50 GiB',
    access: 'Public',
    category: 'cpu',
  },
  {
    id: 'flv-3',
    name: 'r5.2xlarge',
    vCPU: 8,
    ram: '64 GiB',
    disk: '200 GiB',
    access: 'Private',
    category: 'cpu',
  },
  {
    id: 'flv-4',
    name: 'g4dn.xlarge',
    vCPU: 4,
    ram: '16 GiB',
    disk: '125 GiB',
    access: 'Public',
    category: 'gpu',
  },
  {
    id: 'flv-5',
    name: 'p3.8xlarge',
    vCPU: 32,
    ram: '244 GiB',
    disk: '500 GiB',
    access: 'Public',
    category: 'gpu',
  },
  {
    id: 'flv-6',
    name: 'npu-small',
    vCPU: 4,
    ram: '16 GiB',
    disk: '100 GiB',
    access: 'Private',
    category: 'npu',
  },
  {
    id: 'flv-7',
    name: 'npu-large',
    vCPU: 8,
    ram: '32 GiB',
    disk: '200 GiB',
    access: 'Public',
    category: 'npu',
  },
];

const mockNetworks: NetworkRow[] = [
  {
    id: 'net-1',
    name: 'internal-01',
    status: 'Active',
    subnetCidr: '192.168.1.0/24',
    external: false,
    access: 'Private',
  },
  {
    id: 'net-2',
    name: 'internal-02',
    status: 'In-active',
    subnetCidr: '192.168.10.0/24',
    external: true,
    access: 'Public',
  },
  {
    id: 'net-3',
    name: 'internal-03',
    status: 'Active',
    subnetCidr: '10.0.0.0/16',
    external: false,
    access: 'Private',
  },
  {
    id: 'net-4',
    name: 'external-net',
    status: 'Active',
    subnetCidr: '10.7.60.0/24',
    external: true,
    access: 'Public',
  },
  {
    id: 'net-5',
    name: 'provider-net',
    status: 'Active',
    subnetCidr: '10.7.61.0/24',
    external: true,
    access: 'Public',
  },
  {
    id: 'net-6',
    name: 'dev-net',
    status: 'Active',
    subnetCidr: '172.16.0.0/20',
    external: false,
    access: 'Private',
  },
];

const mockSecurityGroups: SecurityGroupRow[] = [
  { id: 'sg-1', name: 'default', description: 'Default security group' },
  { id: 'sg-2', name: 'suite-default', description: 'Suite default' },
  { id: 'sg-3', name: 'web-sg', description: 'Web tier' },
  { id: 'sg-4', name: 'db-sg', description: 'Database' },
  { id: 'sg-5', name: 'ssh-only', description: 'SSH ingress only' },
];

const mockKeyPairs: KeyPairRow[] = [
  {
    id: 'kp-1',
    name: 'dev-keypair',
    fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf',
  },
  {
    id: 'kp-2',
    name: 'prod-keypair',
    fingerprint: 'a1:b2:c3:d4:e5:f6:a7:b8:c9:d0:e1:f2:a3:b4:c5:d6',
  },
  {
    id: 'kp-3',
    name: 'staging-keypair',
    fingerprint: 'f1:e2:d3:c4:b5:a6:97:88:79:6a:5b:4c:3d:2e:1f:a0',
  },
  {
    id: 'kp-4',
    name: 'test-keypair',
    fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00',
  },
  {
    id: 'kp-5',
    name: 'backup-keypair',
    fingerprint: 'aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99',
  },
  {
    id: 'kp-6',
    name: 'ci-keypair',
    fingerprint: '01:02:03:04:05:06:07:08:09:0a:0b:0c:0d:0e:0f:10',
  },
];

const mockServerGroups: ServerGroupRow[] = [
  { id: 'srvgrp-1', name: 'web-cluster-01', memberCount: 3, policy: 'Affinity' },
  { id: 'srvgrp-2', name: 'web-cluster-02', memberCount: 2, policy: 'Affinity' },
  { id: 'srvgrp-3', name: 'db-cluster', memberCount: 5, policy: 'Anti-Affinity' },
  { id: 'srvgrp-4', name: 'cache-cluster', memberCount: 4, policy: 'Soft Anti-Affinity' },
  { id: 'srvgrp-5', name: 'app-cluster', memberCount: 6, policy: 'Soft Affinity' },
];

const azOptions = [
  { value: 'nova', label: 'nova' },
  { value: 'nova-2', label: 'nova-2' },
  { value: 'nova-3', label: 'nova-3' },
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

const subnetOptionsByNetwork: Record<string, { value: string; label: string }[]> = {
  '': [{ value: '', label: 'Select network first' }],
  'net-1': [
    { value: 'sn-1a', label: '192.168.1.0/24' },
    { value: 'sn-1b', label: '192.168.2.0/24' },
  ],
  'net-2': [{ value: 'sn-2a', label: '192.168.10.0/24' }],
  'net-3': [
    { value: 'sn-3a', label: '10.0.0.0/16' },
    { value: 'sn-3b', label: '10.1.0.0/16' },
  ],
  'net-4': [{ value: 'sn-4a', label: '10.7.60.0/24' }],
  'net-5': [{ value: 'sn-5a', label: '10.7.61.0/24' }],
  'net-6': [{ value: 'sn-6a', label: '172.16.0.0/20' }],
};

const networkOptionsForVlan = mockNetworks.map((n) => ({ value: n.id, label: n.name }));

const templateFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Template name…' },
];

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

const keyPairFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Key pair name…' },
];

const serverGroupFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Server group…' },
];

const OS_TABS: { id: string; label: string; icon: ComponentType<{ size?: number }> }[] = [
  { id: 'all', label: 'Others', icon: IconDots },
  { id: 'ubuntu', label: 'Ubuntu', icon: IconBrandUbuntu },
  { id: 'windows', label: 'Windows', icon: IconBrandWindows },
  { id: 'rocky', label: 'Rocky', icon: IconHexagon },
];

function imageStatusVariant(s: ImageRow['status'] | InstanceSnapshotRow['status']): StatusVariant {
  if (s === 'building') return 'building';
  if (s === 'error') return 'error';
  return 'active';
}

function volumeStatusVariant(s: BootableVolumeRow['status']): StatusVariant {
  if (s === 'available') return 'active';
  if (s === 'in-use') return 'inUse';
  return 'error';
}

function networkStatusVariant(status: string): StatusVariant {
  return status === 'Active' ? 'active' : 'error';
}

const MAX_USER_DATA = 16 * 1024;
const ITEMS_PER_PAGE = 5;

export function ComputeCreateInstancePage() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const [resourceType, setResourceType] = useState<ResourceType>('vm');
  const [selectedTemplate, setSelectedTemplate] = useState<(string | number)[]>([]);
  const [templateFilters, setTemplateFilters] = useState<FilterKeyWithValue[]>([]);
  const [templatePage, setTemplatePage] = useState(1);

  const [instanceName, setInstanceName] = useState('');
  const [basicDescription, setBasicDescription] = useState('');
  const [availabilityZone, setAvailabilityZone] = useState('');
  const [basicSubmitted, setBasicSubmitted] = useState(false);

  const [sourceTab, setSourceTab] = useState<SourceTab>('image');
  const [selectedSource, setSelectedSource] = useState<(string | number)[]>([]);
  const [imageOsFilter, setImageOsFilter] = useState('all');
  const [imageFilters, setImageFilters] = useState<FilterKeyWithValue[]>([]);
  const [snapshotFilters, setSnapshotFilters] = useState<FilterKeyWithValue[]>([]);
  const [volumeFilters, setVolumeFilters] = useState<FilterKeyWithValue[]>([]);
  const [imagePage, setImagePage] = useState(1);
  const [snapshotPage, setSnapshotPage] = useState(1);
  const [volumePage, setVolumePage] = useState(1);
  const [createSystemDisk, setCreateSystemDisk] = useState(true);
  const [systemDiskType, setSystemDiskType] = useState('_DEFAULT_');
  const [systemDiskSize, setSystemDiskSize] = useState(30);
  const [dataDisks, setDataDisks] = useState<DataDiskRow[]>([
    { id: crypto.randomUUID(), type: '_DEFAULT_', size: 10, deleteWithInstance: true },
  ]);
  const [sourceSubmitted, setSourceSubmitted] = useState(false);
  const [sourceError, setSourceError] = useState<string | null>(null);

  const [flavorTab, setFlavorTab] = useState<FlavorCategory>('cpu');
  const [selectedFlavor, setSelectedFlavor] = useState<(string | number)[]>([]);
  const [flavorFilters, setFlavorFilters] = useState<FilterKeyWithValue[]>([]);
  const [flavorPage, setFlavorPage] = useState(1);
  const [flavorSubmitted, setFlavorSubmitted] = useState(false);
  const [flavorError, setFlavorError] = useState<string | null>(null);

  const [selectedNetworks, setSelectedNetworks] = useState<(string | number)[]>([]);
  const [networkFilters, setNetworkFilters] = useState<FilterKeyWithValue[]>([]);
  const [networkPage, setNetworkPage] = useState(1);
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<(string | number)[]>([]);
  const [sgFilters, setSgFilters] = useState<FilterKeyWithValue[]>([]);
  const [sgPage, setSgPage] = useState(1);
  const [vlans, setVlans] = useState<VlanRow[]>([
    { id: crypto.randomUUID(), network: '', subnet: '', ipAssignment: 'auto' },
  ]);
  const [networkSubmitted, setNetworkSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [sgError, setSgError] = useState<string | null>(null);

  const [authTab, setAuthTab] = useState<AuthTab>('keypair');
  const [selectedKeyPair, setSelectedKeyPair] = useState<(string | number)[]>([]);
  const [keyPairFilters, setKeyPairFilters] = useState<FilterKeyWithValue[]>([]);
  const [keyPairPage, setKeyPairPage] = useState(1);
  const [loginName, setLoginName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [authSubmitted, setAuthSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [tags, setTags] = useState<{ id: string; key: string; value: string }[]>([
    { id: crypto.randomUUID(), key: '', value: '' },
  ]);
  const [selectedServerGroup, setSelectedServerGroup] = useState<(string | number)[]>([]);
  const [sgroupFilters, setSgroupFilters] = useState<FilterKeyWithValue[]>([]);
  const [serverGroupPage, setServerGroupPage] = useState(1);
  const [userData, setUserData] = useState('');
  const [userDataError, setUserDataError] = useState<string | null>(null);
  const [advancedSubmitted, setAdvancedSubmitted] = useState(false);

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    launch: 'processing',
    basic: 'default',
    source: 'default',
    flavor: 'default',
    network: 'default',
    auth: 'default',
    advanced: 'default',
  });

  const nameError = basicSubmitted && !instanceName.trim() ? 'Instance name is required.' : null;
  const azError =
    basicSubmitted && !availabilityZone ? 'Please select an availability zone.' : null;

  const filteredTemplates = useMemo(() => {
    if (templateFilters.length === 0) return mockTemplates;
    return mockTemplates.filter((t) =>
      templateFilters.every((f) =>
        String(t[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [templateFilters]);

  const filteredImages = useMemo(() => {
    return mockImages.filter((img) => {
      const osOk = imageOsFilter === 'all' || img.os === imageOsFilter;
      const filtOk =
        imageFilters.length === 0 ||
        imageFilters.every((f) =>
          String(img[f.key] ?? '')
            .toLowerCase()
            .includes(String(f.value ?? '').toLowerCase())
        );
      return osOk && filtOk;
    });
  }, [imageOsFilter, imageFilters]);

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

  const filteredBootableVolumes = useMemo(() => {
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

  const filteredNetworks = useMemo(() => {
    if (networkFilters.length === 0) return mockNetworks;
    return mockNetworks.filter((n) =>
      networkFilters.every((f) =>
        String(n[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [networkFilters]);

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

  const filteredKeyPairs = useMemo(() => {
    if (keyPairFilters.length === 0) return mockKeyPairs;
    return mockKeyPairs.filter((kp) =>
      keyPairFilters.every((f) =>
        String(kp[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [keyPairFilters]);

  const filteredServerGroups = useMemo(() => {
    if (sgroupFilters.length === 0) return mockServerGroups;
    return mockServerGroups.filter((g) =>
      sgroupFilters.every((f) =>
        String(g[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  }, [sgroupFilters]);

  const paginatedTemplates = filteredTemplates.slice(
    (templatePage - 1) * ITEMS_PER_PAGE,
    templatePage * ITEMS_PER_PAGE
  );
  const paginatedImages = filteredImages.slice(
    (imagePage - 1) * ITEMS_PER_PAGE,
    imagePage * ITEMS_PER_PAGE
  );
  const paginatedSnapshots = filteredSnapshots.slice(
    (snapshotPage - 1) * ITEMS_PER_PAGE,
    snapshotPage * ITEMS_PER_PAGE
  );
  const paginatedVolumes = filteredBootableVolumes.slice(
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
  const paginatedKeyPairs = filteredKeyPairs.slice(
    (keyPairPage - 1) * ITEMS_PER_PAGE,
    keyPairPage * ITEMS_PER_PAGE
  );
  const paginatedServerGroups = filteredServerGroups.slice(
    (serverGroupPage - 1) * ITEMS_PER_PAGE,
    serverGroupPage * ITEMS_PER_PAGE
  );

  const templateColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'visibility', header: 'Visibility', width: 100 },
    { key: 'createdAt', header: 'Created at', width: 160 },
  ];

  const imageColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 56 },
    { key: 'name', header: 'Name' },
    { key: 'version', header: 'Version', width: 90 },
    { key: 'size', header: 'Size', width: 100 },
    { key: 'minDisk', header: 'Min disk', width: 100 },
    { key: 'minRAM', header: 'Min RAM', width: 90 },
    { key: 'visibility', header: 'Visibility', width: 100 },
  ];

  const snapshotColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 56 },
    { key: 'name', header: 'Name' },
    { key: 'version', header: 'Version', width: 90 },
    { key: 'size', header: 'Size', width: 100 },
    { key: 'sourceInstance', header: 'Source instance' },
    { key: 'createdAt', header: 'Created at', width: 140 },
  ];

  const bootVolumeColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 56 },
    { key: 'name', header: 'Name' },
    { key: 'size', header: 'Size', width: 100 },
    { key: 'type', header: 'Type', width: 80 },
    { key: 'createdAt', header: 'Created at', width: 140 },
  ];

  const flavorColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'vCPU', header: 'vCPU', width: 72 },
    { key: 'ram', header: 'RAM', width: 90 },
    { key: 'disk', header: 'Root disk', width: 100 },
    { key: 'access', header: 'Public', width: 88 },
  ];

  const networkColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 56 },
    { key: 'name', header: 'Name' },
    { key: 'subnetCidr', header: 'Subnet CIDR', width: 140 },
    { key: 'external', header: 'External', width: 88 },
    { key: 'access', header: 'Shared', width: 88 },
  ];

  const securityGroupColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
  ];

  const keyPairColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'fingerprint', header: 'Fingerprint' },
  ];

  const serverGroupColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'memberCount', header: 'Members', width: 100 },
    { key: 'policy', header: 'Policy', width: 160 },
  ];

  const validateLaunch = useCallback(() => true, []);

  const validateBasic = useCallback((): boolean => {
    setBasicSubmitted(true);
    return !!instanceName.trim() && !!availabilityZone;
  }, [instanceName, availabilityZone]);

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

  const validateAuth = useCallback((): boolean => {
    setAuthSubmitted(true);
    if (authTab === 'keypair') {
      if (selectedKeyPair.length === 0) {
        setAuthError('Please select a key pair.');
        return false;
      }
      setAuthError(null);
      return true;
    }
    if (!loginName.trim()) {
      setAuthError('Login name is required.');
      return false;
    }
    if (!authPassword.trim()) {
      setAuthError('Password is required.');
      return false;
    }
    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      return false;
    }
    setAuthError(null);
    return true;
  }, [authTab, selectedKeyPair.length, loginName, authPassword, authConfirmPassword]);

  const validateAdvanced = useCallback((): boolean => {
    setAdvancedSubmitted(true);
    const bytes = new Blob([userData]).size;
    if (bytes > MAX_USER_DATA) {
      setUserDataError('User data exceeds 16 KB.');
      return false;
    }
    setUserDataError(null);
    return true;
  }, [userData]);

  const handleStepChange = useCallback(
    ({ current }: { prev: string | number; current: string | number }) => {
      setStepStatuses((prev) => {
        const next = { ...prev };
        for (const id of STEP_IDS) {
          if (id === current) next[id] = 'processing';
          else if (prev[id] === 'processing') next[id] = 'writing';
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

  const selectedTemplateRow = mockTemplates.find((t) => t.id === String(selectedTemplate[0]));
  const selectedImageRow = mockImages.find((i) => i.id === String(selectedSource[0]));
  const selectedSnapRow = mockInstanceSnapshots.find((s) => s.id === String(selectedSource[0]));
  const selectedVolRow = mockBootableVolumes.find((v) => v.id === String(selectedSource[0]));
  const selectedFlavorRow = mockFlavors.find((f) => f.id === String(selectedFlavor[0]));
  const selectedKpRow = mockKeyPairs.find((k) => k.id === String(selectedKeyPair[0]));
  const selectedSrvGrpRow = mockServerGroups.find((g) => g.id === String(selectedServerGroup[0]));

  const sourceSummaryLabel =
    sourceTab === 'image'
      ? 'Image'
      : sourceTab === 'snapshot'
        ? 'Instance snapshot'
        : 'Bootable volume';
  const sourceSummaryName =
    selectedImageRow?.name ?? selectedSnapRow?.name ?? selectedVolRow?.name ?? '-';

  const selectionBorder = (err: boolean) =>
    err ? 'border-danger bg-danger-light' : 'border-border bg-surface-muted';

  return (
    <CreateLayout
      title="Create instance"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Launch type', status: stepStatuses.launch },
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Source', status: stepStatuses.source },
                { label: 'Flavor', status: stepStatuses.flavor },
                { label: 'Network', status: stepStatuses.network },
                { label: 'Authentication', status: stepStatuses.auth },
                { label: 'Advanced', status: stepStatuses.advanced },
              ],
            },
          ]}
          onCancel={() => navigate('/compute/instances')}
          onAction={() => setConfirmOpen(true)}
          actionEnabled={allComplete}
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      <Stepper
        stepIds={STEP_IDS}
        defaultOpenedId="launch"
        onAllStepsCompleted={handleAllComplete}
        onStepChange={handleStepChange}
      >
        {[
          {
            id: 'launch' as const,
            label: 'Launch type',
            onComplete: validateLaunch,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Resource type <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Choose whether this instance runs as a virtual machine or on bare metal.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <RadioButton
                        name="resourceType"
                        value="vm"
                        label="Virtual machine"
                        checked={resourceType === 'vm'}
                        onChange={() => setResourceType('vm')}
                      />
                      <RadioButton
                        name="resourceType"
                        value="baremetal"
                        label="Bare metal"
                        checked={resourceType === 'baremetal'}
                        onChange={() => setResourceType('baremetal')}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Template</span>
                      <span className="text-12 text-text-muted">
                        Optionally pick a launch template to pre-fill later steps. You can skip this
                        section.
                      </span>
                    </div>
                    <FilterSearchInput
                      filterKeys={templateFilterKeys}
                      onFilterAdd={(f) => {
                        setTemplateFilters((p) => [...p, f]);
                        setTemplatePage(1);
                      }}
                      selectedFilters={templateFilters}
                      placeholder="Search templates"
                      defaultFilterKey="name"
                    />
                    <Pagination
                      totalCount={filteredTemplates.length}
                      size={ITEMS_PER_PAGE}
                      currentAt={templatePage}
                      onPageChange={setTemplatePage}
                      totalCountLabel="templates"
                      selectedCount={selectedTemplate.length}
                    />
                    <SelectableTable<TemplateRow>
                      columns={templateColumns}
                      rows={paginatedTemplates}
                      selectionType="radio"
                      selectedRows={selectedTemplate}
                      onRowSelectionChange={setSelectedTemplate}
                      getRowId={(row) => row.id}
                      radioGroupName="instance-template"
                    >
                      {paginatedTemplates.map((row) => (
                        <Table.Tr key={row.id} rowData={row}>
                          <Table.Td rowData={row} column={templateColumns[0]}>
                            <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                              {row.name}
                              <IconExternalLink size={12} />
                            </span>
                          </Table.Td>
                          <Table.Td rowData={row} column={templateColumns[1]}>
                            {row.visibility}
                          </Table.Td>
                          <Table.Td rowData={row} column={templateColumns[2]}>
                            {row.createdAt}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>
                    <div className="flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border border-border bg-surface-muted p-2">
                      {selectedTemplate.length === 0 ? (
                        <span className="text-11 text-text-muted">No template selected</span>
                      ) : (
                        selectedTemplate.map((id) => (
                          <Tag
                            key={String(id)}
                            label={selectedTemplateRow?.name ?? String(id)}
                            variant="multiSelect"
                            onClose={() => setSelectedTemplate([])}
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
                  <span className="text-11 font-medium text-text-muted">Resource type</span>
                  <span className="text-12 text-text">
                    {resourceType === 'vm' ? 'Virtual machine' : 'Bare metal'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Template</span>
                  <span className="text-12 text-text">
                    {selectedTemplateRow?.name ?? 'None (skipped)'}
                  </span>
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
                      <span className="text-13 font-medium text-text">
                        Instance name <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        A unique name to identify this instance in the console and API.
                      </span>
                    </div>
                    <Input
                      placeholder="Enter instance name"
                      value={instanceName}
                      onChange={(e) => {
                        setInstanceName(e.target.value);
                        setBasicSubmitted(false);
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
                    <Input
                      placeholder="Enter description"
                      value={basicDescription}
                      onChange={(e) => setBasicDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        AZ (Availability zone) <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Placement zone for the instance.
                      </span>
                    </div>
                    <Dropdown.Select
                      value={availabilityZone}
                      onChange={(v) => {
                        setAvailabilityZone(String(v));
                        setBasicSubmitted(false);
                      }}
                      placeholder="Select AZ"
                    >
                      {azOptions.map((o) => (
                        <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                      ))}
                    </Dropdown.Select>
                    {azError && <span className="text-11 text-error">{azError}</span>}
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Instance name</span>
                  <span className="text-12 text-text">{instanceName || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Description</span>
                  <span className="text-12 text-text">{basicDescription || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">AZ</span>
                  <span className="text-12 text-text">{availabilityZone || '-'}</span>
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
                        Select an image, instance snapshot, or bootable volume.
                      </span>
                    </div>
                    <div className="mt-1 inline-flex w-fit rounded-md border border-border bg-surface-subtle p-1">
                      {(
                        [
                          { id: 'image' as const, label: 'Image' },
                          { id: 'snapshot' as const, label: 'Instance snapshot' },
                          { id: 'volume' as const, label: 'Bootable volume' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setSourceTab(tab.id);
                            setSelectedSource([]);
                            setSourceError(null);
                            setSourceSubmitted(false);
                          }}
                          className={`inline-flex cursor-pointer items-center rounded px-3 py-2 text-12 font-medium transition-colors ${
                            sourceTab === tab.id
                              ? 'bg-surface-default text-primary shadow-sm'
                              : 'bg-transparent text-text hover:bg-surface-default'
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
                        <div className="inline-flex w-fit rounded-md border border-border bg-surface-subtle p-1">
                          {OS_TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  setImageOsFilter(tab.id);
                                  setImagePage(1);
                                }}
                                className={`inline-flex cursor-pointer items-center gap-1.5 rounded px-3 py-2 text-12 font-medium transition-colors ${
                                  imageOsFilter === tab.id
                                    ? 'bg-surface-default text-primary shadow-sm'
                                    : 'bg-transparent text-text hover:bg-surface-default'
                                }`}
                              >
                                <Icon size={14} />
                                <span>{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        <FilterSearchInput
                          filterKeys={imageFilterKeys}
                          onFilterAdd={(f) => {
                            setImageFilters((p) => [...p, f]);
                            setImagePage(1);
                          }}
                          selectedFilters={imageFilters}
                          placeholder="Search images"
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
                          radioGroupName="instance-source-image"
                        >
                          {paginatedImages.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={imageColumns[0]}>
                                <StatusIndicator
                                  variant={imageStatusVariant(row.status)}
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
                                {row.minRAM}
                              </Table.Td>
                              <Table.Td rowData={row} column={imageColumns[6]}>
                                {row.visibility}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>
                        <div
                          className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                            !!(sourceSubmitted && sourceError && selectedSource.length === 0)
                          )}`}
                        >
                          {selectedSource.length === 0 ? (
                            <span className="text-11 text-text-muted">
                              {sourceError ?? 'No image selected'}
                            </span>
                          ) : (
                            selectedSource.map((id) => (
                              <Tag
                                key={String(id)}
                                label={selectedImageRow?.name ?? String(id)}
                                variant="multiSelect"
                                onClose={() => {
                                  setSelectedSource([]);
                                  setSourceError(null);
                                }}
                              />
                            ))
                          )}
                        </div>
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
                          placeholder="Search snapshots"
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
                          radioGroupName="instance-source-snap"
                        >
                          {paginatedSnapshots.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={snapshotColumns[0]}>
                                <StatusIndicator
                                  variant={imageStatusVariant(row.status)}
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
                                <span className="inline-flex items-center gap-1 text-primary font-medium">
                                  {row.sourceInstance}
                                  <IconExternalLink size={12} />
                                </span>
                              </Table.Td>
                              <Table.Td rowData={row} column={snapshotColumns[5]}>
                                {row.createdAt}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>
                        <div
                          className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                            !!(sourceSubmitted && sourceError && selectedSource.length === 0)
                          )}`}
                        >
                          {selectedSource.length === 0 ? (
                            <span className="text-11 text-text-muted">
                              {sourceError ?? 'No snapshot selected'}
                            </span>
                          ) : (
                            selectedSource.map((id) => (
                              <Tag
                                key={String(id)}
                                label={selectedSnapRow?.name ?? String(id)}
                                variant="multiSelect"
                                onClose={() => {
                                  setSelectedSource([]);
                                  setSourceError(null);
                                }}
                              />
                            ))
                          )}
                        </div>
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
                          placeholder="Search volumes"
                          defaultFilterKey="name"
                        />
                        <Pagination
                          totalCount={filteredBootableVolumes.length}
                          size={ITEMS_PER_PAGE}
                          currentAt={volumePage}
                          onPageChange={setVolumePage}
                          totalCountLabel="volumes"
                          selectedCount={selectedSource.length}
                        />
                        <SelectableTable<BootableVolumeRow>
                          columns={bootVolumeColumns}
                          rows={paginatedVolumes}
                          selectionType="radio"
                          selectedRows={selectedSource}
                          onRowSelectionChange={(ids) => {
                            setSelectedSource(ids);
                            setSourceError(null);
                          }}
                          getRowId={(row) => row.id}
                          radioGroupName="instance-source-vol"
                        >
                          {paginatedVolumes.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={bootVolumeColumns[0]}>
                                <StatusIndicator
                                  variant={volumeStatusVariant(row.status)}
                                  layout="iconOnly"
                                />
                              </Table.Td>
                              <Table.Td rowData={row} column={bootVolumeColumns[1]}>
                                <div className="flex min-w-0 flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                    {row.name}
                                    <IconExternalLink size={12} />
                                  </span>
                                  <span className="text-11 text-text-subtle">ID: {row.id}</span>
                                </div>
                              </Table.Td>
                              <Table.Td rowData={row} column={bootVolumeColumns[2]}>
                                {row.size}
                              </Table.Td>
                              <Table.Td rowData={row} column={bootVolumeColumns[3]}>
                                {row.type}
                              </Table.Td>
                              <Table.Td rowData={row} column={bootVolumeColumns[4]}>
                                {row.createdAt}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>
                        <div
                          className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                            !!(sourceSubmitted && sourceError && selectedSource.length === 0)
                          )}`}
                        >
                          {selectedSource.length === 0 ? (
                            <span className="text-11 text-text-muted">
                              {sourceError ?? 'No volume selected'}
                            </span>
                          ) : (
                            selectedSource.map((id) => (
                              <Tag
                                key={String(id)}
                                label={selectedVolRow?.name ?? String(id)}
                                variant="multiSelect"
                                onClose={() => {
                                  setSelectedSource([]);
                                  setSourceError(null);
                                }}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">System disk</span>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={createSystemDisk}
                        onChange={() => {
                          setCreateSystemDisk(!createSystemDisk);
                          setSourceError(null);
                        }}
                      />
                      <span className="text-12 text-text">
                        {createSystemDisk ? 'Create system disk' : 'Do not create system disk'}
                      </span>
                    </div>
                    {createSystemDisk && (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <span className="text-11 font-medium text-text">Volume type</span>
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
                          <span className="text-11 font-medium text-text">Size (GiB)</span>
                          <NumberInput
                            min={1}
                            max={2000}
                            step={1}
                            value={systemDiskSize}
                            onChange={setSystemDiskSize}
                            size="md"
                          />
                        </div>
                      </div>
                    )}
                    <span className="text-11 text-text-subtle">
                      Data disks can be attached below and are optional.
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">Data disks</span>
                    <div className="bg-surface-subtle rounded-md px-4 py-3">
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-[1fr_100px_1fr_auto] items-center gap-1">
                          <span className="text-label-sm text-text-subtle">Type</span>
                          <span className="text-label-sm text-text-subtle">Size (GiB)</span>
                          <span className="text-label-sm text-text-subtle">
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
                                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
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
                                onChange={() =>
                                  setDataDisks((prev) =>
                                    prev.map((d) =>
                                      d.id === disk.id
                                        ? { ...d, deleteWithInstance: !d.deleteWithInstance }
                                        : d
                                    )
                                  )
                                }
                              />
                              <button
                                type="button"
                                aria-label="Remove data disk"
                                className="flex size-5 items-center justify-center rounded border-0 bg-transparent text-text-muted hover:bg-surface-muted hover:text-text"
                                onClick={() =>
                                  setDataDisks((prev) => prev.filter((d) => d.id !== disk.id))
                                }
                              >
                                <IconX size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
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
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <IconCirclePlus size={12} />
                            Add data disk
                          </span>
                        </Button>
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
                  <span className="text-11 font-medium text-text-muted">Source type</span>
                  <span className="text-12 text-text">{sourceSummaryLabel}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Selected</span>
                  <span className="text-12 text-text">{sourceSummaryName}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">System disk</span>
                  <span className="text-12 text-text">
                    {createSystemDisk ? `${systemDiskType} / ${systemDiskSize} GiB` : 'Not created'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Data disks</span>
                  <span className="text-12 text-text">
                    {dataDisks.length} disk(s) —{' '}
                    {dataDisks.map((d) => `${d.type} ${d.size}GiB`).join(', ') || '-'}
                  </span>
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
                        Flavor <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Choose CPU, GPU, or NPU families, then pick a flavor.
                      </span>
                    </div>
                    <div className="mt-1 inline-flex w-fit rounded-md border border-border bg-surface-subtle p-1">
                      {(
                        [
                          { id: 'cpu' as const, label: 'CPU' },
                          { id: 'gpu' as const, label: 'GPU' },
                          { id: 'npu' as const, label: 'NPU' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setFlavorTab(tab.id);
                            setSelectedFlavor([]);
                            setFlavorPage(1);
                            setFlavorError(null);
                          }}
                          className={`inline-flex cursor-pointer items-center rounded px-3 py-2 text-12 font-medium transition-colors ${
                            flavorTab === tab.id
                              ? 'bg-surface-default text-primary shadow-sm'
                              : 'bg-transparent text-text hover:bg-surface-default'
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
                      placeholder="Search flavors"
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
                      radioGroupName="instance-flavor"
                    >
                      {paginatedFlavors.map((row) => (
                        <Table.Tr key={row.id} rowData={row}>
                          <Table.Td rowData={row} column={flavorColumns[0]}>
                            <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                              {row.name}
                              <IconExternalLink size={12} />
                            </span>
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
                            {row.access}
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
                  <span className="text-11 font-medium text-text-muted">Family</span>
                  <span className="text-12 text-text">{flavorTab.toUpperCase()}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Flavor</span>
                  <span className="text-12 text-text">{selectedFlavorRow?.name ?? '-'}</span>
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
                        Networks <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Select one or more networks to attach.
                      </span>
                    </div>
                    <FilterSearchInput
                      filterKeys={networkFilterKeys}
                      onFilterAdd={(f) => {
                        setNetworkFilters((p) => [...p, f]);
                        setNetworkPage(1);
                      }}
                      selectedFilters={networkFilters}
                      placeholder="Search networks"
                      defaultFilterKey="name"
                    />
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
                              variant={networkStatusVariant(row.status)}
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
                            {row.external ? 'Yes' : 'No'}
                          </Table.Td>
                          <Table.Td rowData={row} column={networkColumns[4]}>
                            {row.access}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>
                    <div
                      className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                        !!(networkSubmitted && networkError)
                      )}`}
                    >
                      {selectedNetworks.length === 0 ? (
                        <span className="text-11 text-text-muted">
                          {networkError ?? 'No networks selected'}
                        </span>
                      ) : (
                        selectedNetworks.map((nid) => {
                          const n = mockNetworks.find((x) => x.id === String(nid));
                          return (
                            <Tag
                              key={String(nid)}
                              label={n?.name ?? String(nid)}
                              variant="multiSelect"
                              onClose={() =>
                                setSelectedNetworks(selectedNetworks.filter((x) => x !== nid))
                              }
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">Virtual LAN</span>
                    <span className="text-12 text-text-muted">
                      Map additional subnets per network (optional).
                    </span>
                    <div className="flex flex-col gap-2">
                      {vlans.map((vlan) => (
                        <div
                          key={vlan.id}
                          className="grid grid-cols-1 gap-2 rounded-md border border-border-subtle bg-surface-subtle p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-11 font-medium text-text">Network</span>
                            <Dropdown.Select
                              value={vlan.network}
                              onChange={(v) =>
                                setVlans((prev) =>
                                  prev.map((x) =>
                                    x.id === vlan.id ? { ...x, network: String(v), subnet: '' } : x
                                  )
                                )
                              }
                              placeholder="Select network"
                            >
                              {networkOptionsForVlan.map((o) => (
                                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                              ))}
                            </Dropdown.Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-11 font-medium text-text">Subnet</span>
                            <Dropdown.Select
                              value={vlan.subnet}
                              onChange={(v) =>
                                setVlans((prev) =>
                                  prev.map((x) =>
                                    x.id === vlan.id ? { ...x, subnet: String(v) } : x
                                  )
                                )
                              }
                              placeholder="Select subnet"
                            >
                              {(
                                subnetOptionsByNetwork[vlan.network] ?? [{ value: '', label: '—' }]
                              ).map((o) => (
                                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                              ))}
                            </Dropdown.Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-11 font-medium text-text">IP assignment</span>
                            <Dropdown.Select
                              value={vlan.ipAssignment}
                              onChange={(v) =>
                                setVlans((prev) =>
                                  prev.map((x) =>
                                    x.id === vlan.id ? { ...x, ipAssignment: String(v) } : x
                                  )
                                )
                              }
                            >
                              {ipAssignmentOptions.map((o) => (
                                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                              ))}
                            </Dropdown.Select>
                          </div>
                          <button
                            type="button"
                            aria-label="Remove VLAN row"
                            className="flex size-8 items-center justify-center self-end rounded border-0 bg-transparent text-text-muted hover:bg-surface-muted"
                            onClick={() => setVlans((prev) => prev.filter((x) => x.id !== vlan.id))}
                          >
                            <IconX size={14} />
                          </button>
                        </div>
                      ))}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setVlans((prev) => [
                            ...prev,
                            {
                              id: crypto.randomUUID(),
                              network: '',
                              subnet: '',
                              ipAssignment: 'auto',
                            },
                          ])
                        }
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <IconCirclePlus size={12} />
                          Add Virtual LAN
                        </span>
                      </Button>
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
                        At least one security group is required.
                      </span>
                    </div>
                    <FilterSearchInput
                      filterKeys={sgFilterKeys}
                      onFilterAdd={(f) => {
                        setSgFilters((p) => [...p, f]);
                        setSgPage(1);
                      }}
                      selectedFilters={sgFilters}
                      placeholder="Search security groups"
                      defaultFilterKey="name"
                    />
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
                            <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                              {row.name}
                              <IconExternalLink size={12} />
                            </span>
                          </Table.Td>
                          <Table.Td rowData={row} column={securityGroupColumns[1]}>
                            {row.description}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>
                    <div
                      className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                        !!(networkSubmitted && sgError)
                      )}`}
                    >
                      {selectedSecurityGroups.length === 0 ? (
                        <span className="text-11 text-text-muted">
                          {sgError ?? 'No security groups selected'}
                        </span>
                      ) : (
                        selectedSecurityGroups.map((sgid) => {
                          const sg = mockSecurityGroups.find((x) => x.id === String(sgid));
                          return (
                            <Tag
                              key={String(sgid)}
                              label={sg?.name ?? String(sgid)}
                              variant="multiSelect"
                              onClose={() =>
                                setSelectedSecurityGroups(
                                  selectedSecurityGroups.filter((x) => x !== sgid)
                                )
                              }
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Networks</span>
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
                  <span className="text-11 font-medium text-text-muted">Virtual LAN rows</span>
                  <span className="text-12 text-text">{vlans.length} configured</span>
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
            id: 'auth' as const,
            label: 'Authentication',
            onComplete: validateAuth,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Login type</span>
                      <span className="text-12 text-text-muted">
                        Key pair or password for instance access.
                      </span>
                    </div>
                    <div className="inline-flex w-fit rounded-md border border-border bg-surface-subtle p-1">
                      {(
                        [
                          { id: 'keypair' as const, label: 'Key pair' },
                          { id: 'password' as const, label: 'Password' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setAuthTab(tab.id);
                            setAuthError(null);
                            setAuthSubmitted(false);
                          }}
                          className={`inline-flex cursor-pointer items-center rounded px-3 py-2 text-12 font-medium transition-colors ${
                            authTab === tab.id
                              ? 'bg-surface-default text-primary shadow-sm'
                              : 'bg-transparent text-text hover:bg-surface-default'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {authTab === 'keypair' && (
                  <>
                    <div className="w-full h-px bg-border-muted" />
                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <FilterSearchInput
                          filterKeys={keyPairFilterKeys}
                          onFilterAdd={(f) => {
                            setKeyPairFilters((p) => [...p, f]);
                            setKeyPairPage(1);
                          }}
                          selectedFilters={keyPairFilters}
                          placeholder="Search key pairs"
                          defaultFilterKey="name"
                        />
                        <Pagination
                          totalCount={filteredKeyPairs.length}
                          size={ITEMS_PER_PAGE}
                          currentAt={keyPairPage}
                          onPageChange={setKeyPairPage}
                          totalCountLabel="key pairs"
                          selectedCount={selectedKeyPair.length}
                        />
                        <SelectableTable<KeyPairRow>
                          columns={keyPairColumns}
                          rows={paginatedKeyPairs}
                          selectionType="radio"
                          selectedRows={selectedKeyPair}
                          onRowSelectionChange={(ids) => {
                            setSelectedKeyPair(ids);
                            setAuthError(null);
                          }}
                          getRowId={(row) => row.id}
                          radioGroupName="instance-keypair"
                        >
                          {paginatedKeyPairs.map((row) => (
                            <Table.Tr key={row.id} rowData={row}>
                              <Table.Td rowData={row} column={keyPairColumns[0]}>
                                <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                                  {row.name}
                                  <IconExternalLink size={12} />
                                </span>
                              </Table.Td>
                              <Table.Td rowData={row} column={keyPairColumns[1]}>
                                <span className="text-11 text-text-muted">{row.fingerprint}</span>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </SelectableTable>
                        <div
                          className={`flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border p-2 ${selectionBorder(
                            !!(authSubmitted && authError && authTab === 'keypair')
                          )}`}
                        >
                          {selectedKeyPair.length === 0 ? (
                            <span className="text-11 text-text-muted">
                              {authError ?? 'No key pair selected'}
                            </span>
                          ) : (
                            selectedKeyPair.map((id) => (
                              <Tag
                                key={String(id)}
                                label={selectedKpRow?.name ?? String(id)}
                                variant="multiSelect"
                                onClose={() => {
                                  setSelectedKeyPair([]);
                                  setAuthError(null);
                                }}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {authTab === 'password' && (
                  <>
                    <div className="w-full h-px bg-border-muted" />
                    <div className="py-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <span className="text-13 font-medium text-text">
                            Login name <span className="text-error">*</span>
                          </span>
                          <Input
                            placeholder="Enter login name"
                            value={loginName}
                            onChange={(e) => {
                              setLoginName(e.target.value);
                              setAuthError(null);
                            }}
                            error={authSubmitted && !loginName.trim()}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-13 font-medium text-text">
                            Password <span className="text-error">*</span>
                          </span>
                          <div className="relative">
                            <Input
                              type={showPw ? 'text' : 'password'}
                              placeholder="Enter password"
                              value={authPassword}
                              onChange={(e) => {
                                setAuthPassword(e.target.value);
                                setAuthError(null);
                              }}
                              error={authSubmitted && !authPassword.trim()}
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 border-0 bg-transparent p-1 text-text-muted hover:text-text"
                              onClick={() => setShowPw(!showPw)}
                              aria-label={showPw ? 'Hide password' : 'Show password'}
                            >
                              {showPw ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-13 font-medium text-text">
                            Confirm password <span className="text-error">*</span>
                          </span>
                          <div className="relative">
                            <Input
                              type={showPw2 ? 'text' : 'password'}
                              placeholder="Confirm password"
                              value={authConfirmPassword}
                              onChange={(e) => {
                                setAuthConfirmPassword(e.target.value);
                                setAuthError(null);
                              }}
                              error={
                                authSubmitted &&
                                !!authConfirmPassword.trim() &&
                                authPassword !== authConfirmPassword
                              }
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 border-0 bg-transparent p-1 text-text-muted hover:text-text"
                              onClick={() => setShowPw2(!showPw2)}
                              aria-label={showPw2 ? 'Hide password' : 'Show password'}
                            >
                              {showPw2 ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                            </button>
                          </div>
                        </div>
                        {authSubmitted && authError && (
                          <span className="text-11 text-error">{authError}</span>
                        )}
                        <span className="text-11 text-text-subtle">
                          Use 8–32 characters with mixed character types.
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Login type</span>
                  <span className="text-12 text-text">
                    {authTab === 'keypair' ? 'Key pair' : 'Password'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Details</span>
                  <span className="text-12 text-text">
                    {authTab === 'keypair'
                      ? (selectedKpRow?.name ?? '-')
                      : `${loginName || '-'} / password set`}
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
                      <span className="text-12 text-text-muted">Optional key-value metadata.</span>
                    </div>
                    <div className="bg-surface-subtle rounded-md px-4 py-3">
                      <div className="grid grid-cols-[1fr_1fr_20px] items-center gap-1">
                        <span className="text-label-sm text-text-subtle">Key</span>
                        <span className="text-label-sm text-text-subtle">Value</span>
                        <div />
                        {tags.map((tag, i) => (
                          <div key={tag.id} className="contents">
                            <Input
                              placeholder="Key"
                              value={tag.key}
                              onChange={(e) => {
                                const next = [...tags];
                                next[i] = { ...next[i], key: e.target.value };
                                setTags(next);
                              }}
                            />
                            <Input
                              placeholder="Value"
                              value={tag.value}
                              onChange={(e) => {
                                const next = [...tags];
                                next[i] = { ...next[i], value: e.target.value };
                                setTags(next);
                              }}
                            />
                            <button
                              type="button"
                              className="flex size-5 items-center justify-center border-0 bg-transparent text-text-muted hover:text-text"
                              aria-label="Remove tag"
                              onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                            >
                              <IconX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-3"
                        onClick={() =>
                          setTags((t) => [...t, { id: crypto.randomUUID(), key: '', value: '' }])
                        }
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <IconCirclePlus size={12} />
                          Add tag
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">Server group</span>
                    <span className="text-12 text-text-muted">
                      Optional placement policy group.
                    </span>
                    <FilterSearchInput
                      filterKeys={serverGroupFilterKeys}
                      onFilterAdd={(f) => {
                        setSgroupFilters((p) => [...p, f]);
                        setServerGroupPage(1);
                      }}
                      selectedFilters={sgroupFilters}
                      placeholder="Search server groups"
                      defaultFilterKey="name"
                    />
                    <Pagination
                      totalCount={filteredServerGroups.length}
                      size={ITEMS_PER_PAGE}
                      currentAt={serverGroupPage}
                      onPageChange={setServerGroupPage}
                      totalCountLabel="server groups"
                      selectedCount={selectedServerGroup.length}
                    />
                    <SelectableTable<ServerGroupRow>
                      columns={serverGroupColumns}
                      rows={paginatedServerGroups}
                      selectionType="radio"
                      selectedRows={selectedServerGroup}
                      onRowSelectionChange={setSelectedServerGroup}
                      getRowId={(row) => row.id}
                      radioGroupName="instance-srvgrp"
                    >
                      {paginatedServerGroups.map((row) => (
                        <Table.Tr key={row.id} rowData={row}>
                          <Table.Td rowData={row} column={serverGroupColumns[0]}>
                            <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                              {row.name}
                              <IconExternalLink size={12} />
                            </span>
                          </Table.Td>
                          <Table.Td rowData={row} column={serverGroupColumns[1]}>
                            {row.memberCount}
                          </Table.Td>
                          <Table.Td rowData={row} column={serverGroupColumns[2]}>
                            {row.policy}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </SelectableTable>
                    <div className="flex min-h-[32px] flex-wrap items-center gap-1 rounded-md border border-border bg-surface-muted p-2">
                      {selectedServerGroup.length === 0 ? (
                        <span className="text-11 text-text-muted">No server group selected</span>
                      ) : (
                        selectedServerGroup.map((id) => (
                          <Tag
                            key={String(id)}
                            label={selectedSrvGrpRow?.name ?? String(id)}
                            variant="multiSelect"
                            onClose={() => setSelectedServerGroup([])}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">User data</span>
                    <Textarea
                      rows={6}
                      placeholder="#cloud-config or shell script"
                      value={userData}
                      onChange={(e) => {
                        setUserData(e.target.value);
                        setUserDataError(null);
                        setAdvancedSubmitted(false);
                      }}
                      error={!!userDataError}
                    />
                    <div className="flex justify-between">
                      <span className="text-11 text-error">{userDataError ?? ''}</span>
                      <span className="text-11 text-text-subtle">
                        {(new Blob([userData]).size / 1024).toFixed(1)} / 16 KB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Tags</span>
                  <span className="text-12 text-text">
                    {tags.filter((t) => t.key || t.value).length > 0
                      ? tags
                          .filter((t) => t.key || t.value)
                          .map((t) => `${t.key}=${t.value}`)
                          .join(', ')
                      : '-'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Server group</span>
                  <span className="text-12 text-text">{selectedSrvGrpRow?.name ?? '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">User data</span>
                  <span className="text-12 text-text">
                    {userData.trim() ? `${(new Blob([userData]).size / 1024).toFixed(1)} KB` : '-'}
                  </span>
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
            navigate('/compute/instances');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create instance',
            subtitle: 'This is UI-only. No instance will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}
