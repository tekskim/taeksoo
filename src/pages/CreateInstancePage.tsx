import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  NumberInput,
  ProgressBar,
  HStack,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Pagination,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SearchInput,
  Radio,
  Input,
  Select,
  Textarea,
  Disclosure,
  SectionCard,
  Checkbox,
  StatusIndicator,
  Chip,
  FormField,
  Toggle,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconBell,
  IconBrandUbuntu,
  IconBrandWindows,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconMountain,
  IconPlus,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface QuotaItem {
  label: string;
  used: number;
  max: number;
  newValue?: number;
}

interface TemplateRow {
  id: string;
  name: string;
  description: string;
  visibility: string;
  createdAt: string;
  isFavorite: boolean;
}

type SectionStep = 'templates' | 'basic-info' | 'image' | 'flavor' | 'network' | 'authentication' | 'advanced';
type SectionState = 'pre' | 'active' | 'done' | 'skipped';

interface SectionStatus {
  templates: SectionState;
  'basic-info': SectionState;
  image: SectionState;
  flavor: SectionState;
  network: SectionState;
  authentication: SectionState;
  advanced: SectionState;
}

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  templates: 'Templates',
  'basic-info': 'Basic Information',
  image: 'Image',
  flavor: 'Flavor',
  network: 'Network',
  authentication: 'Authentication',
  advanced: 'Advanced',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'templates',
  'basic-info',
  'image',
  'flavor',
  'network',
  'authentication',
  'advanced',
];

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockQuota: QuotaItem[] = [
  { label: 'Instance', used: 2, max: 10, newValue: 1 },
  { label: 'vCPU', used: 5, max: 20, newValue: 2 },
  { label: 'RAM (GiB)', used: 14, max: 50, newValue: 4 },
  { label: 'Disk', used: 2, max: 10, newValue: 1 },
  { label: 'Disk Capacity (GiB)', used: 20, max: 1000, newValue: 50 },
];

const mockTemplates: TemplateRow[] = [
  { id: '129jm39s', name: 'th.tiny', description: '-', visibility: 'Private', createdAt: '2025-11-19', isFavorite: true },
  { id: '230km40t', name: 'th.small', description: 'Small instance', visibility: 'Public', createdAt: '2025-11-18', isFavorite: false },
  { id: '331ln51u', name: 'th.medium', description: 'Medium instance', visibility: 'Private', createdAt: '2025-11-17', isFavorite: true },
  { id: '432mo62v', name: 'th.large', description: 'Large instance', visibility: 'Public', createdAt: '2025-11-16', isFavorite: false },
  { id: '533np73w', name: 'th.xlarge', description: 'Extra large instance', visibility: 'Private', createdAt: '2025-11-15', isFavorite: true },
  { id: '634oq84x', name: 'th.2xlarge', description: '2x large instance', visibility: 'Public', createdAt: '2025-11-14', isFavorite: false },
];

/* ----------------------------------------
   QuotaSidebar Component
   ---------------------------------------- */

interface QuotaSidebarProps {
  numberOfInstances: number;
  onNumberOfInstancesChange: (value: number) => void;
  quota: QuotaItem[];
  onCancel: () => void;
}

function QuotaSidebar({ numberOfInstances, onNumberOfInstancesChange, quota, onCancel }: QuotaSidebarProps) {
  return (
    <div className="w-[312px] shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
      <VStack gap={6}>
        {/* Title & Description */}
        <VStack gap={2}>
          <h5 className="text-[14px] font-semibold leading-5 text-[var(--color-text-default)]">
            Create Instance
          </h5>
          <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
            When disabled, no security groups will be applied, and anti-spoofing checks are turned off.
          </p>
        </VStack>

        {/* Number of Instances */}
        <VStack gap={2}>
          <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
            Number of Instances
          </label>
          <NumberInput
            value={numberOfInstances}
            onChange={onNumberOfInstancesChange}
            min={1}
            max={10}
            fullWidth
          />
        </VStack>

        {/* Quota Section */}
        <VStack gap={2}>
          <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
            Quota
          </label>
          <div className="border border-[var(--color-border-subtle)] rounded-lg p-4">
            <VStack gap={4}>
              {quota.map((item) => (
                <ProgressBar
                  key={item.label}
                  variant="quota"
                  label={item.label}
                  value={item.used}
                  max={item.max}
                  newValue={item.newValue}
                  showValue
                />
              ))}
            </VStack>
          </div>
        </VStack>

        {/* Action Buttons */}
        <HStack gap={2} justify="end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="min-w-[80px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled
            className="flex-1"
          >
            Create Instance
          </Button>
        </HStack>
      </VStack>
    </div>
  );
}

/* ----------------------------------------
   PreSection Component (작성 전 - 타이틀만 표시)
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-3">
      <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
        {title}
      </h5>
    </div>
  );
}

/* ----------------------------------------
   SkippedSection Component (Skip된 섹션 - Not configured 표시)
   ---------------------------------------- */

interface SkippedSectionProps {
  title: string;
  onEdit: () => void;
}

function SkippedSection({ title, onEdit }: SkippedSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-3">
      <div className="flex items-center justify-between">
        <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
          {title}
        </h5>
        <div className="flex items-center gap-3">
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-muted)]">Not configured</span>
          <Button variant="outline" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   DoneSectionRow Component (Summary 데이터 로우)
   ---------------------------------------- */

interface DoneSectionRowProps {
  label: string;
  value: string | React.ReactNode;
}

function DoneSectionRow({ label, value }: DoneSectionRowProps) {
  return (
    <VStack gap={2}>
      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
      <VStack gap={2} className="pt-3">
        <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
          {label}
        </span>
        <span className="text-[12px] text-[var(--color-text-default)]">
          {value || '-'}
        </span>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   DoneSection Component (작성 완료 - Summary 형태)
   ---------------------------------------- */

interface DoneSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function DoneSection({ title, onEdit, children }: DoneSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 pt-3 pb-4">
      <VStack gap={3}>
        {/* Header */}
        <HStack justify="between" align="center" className="w-full">
          <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
            {title}
          </h5>
          <Button variant="outline" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        </HStack>

        {/* Data Rows */}
        {children}
      </VStack>
    </div>
  );
}

/* ----------------------------------------
   BasicInformationSection Component
   ---------------------------------------- */

interface BasicInformationSectionProps {
  instanceName: string;
  onInstanceNameChange: (value: string) => void;
  availabilityZone: string;
  onAvailabilityZoneChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  labels: { key: string; value: string }[];
  onLabelsChange: (labels: { key: string; value: string }[]) => void;
  onNext: () => void;
}

const availabilityZoneOptions = [
  { value: 'nova', label: 'nova (Default)' },
  { value: 'az-1', label: 'az-1' },
  { value: 'az-2', label: 'az-2' },
];

function BasicInformationSection({
  instanceName,
  onInstanceNameChange,
  availabilityZone,
  onAvailabilityZoneChange,
  description,
  onDescriptionChange,
  onNext,
}: BasicInformationSectionProps) {

  return (
    <SectionCard>
      <SectionCard.Header title="Basic Information" />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Instance Name */}
          <VStack gap={2} className="py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)]">
              Instance Name <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <Input
              placeholder="Instance Name"
              value={instanceName}
              onChange={(e) => onInstanceNameChange(e.target.value)}
              fullWidth
            />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              The name should start with upper letter, lower letter or chinese, and be a string with 1~128 characters.
            </span>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* AZ (Availability Zone) */}
          <VStack gap={2} className="py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)]">
              AZ (Availability Zone) <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <Select
              options={availabilityZoneOptions}
              value={availabilityZone}
              onChange={onAvailabilityZoneChange}
              placeholder="Select AZ"
              fullWidth
            />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              Select the availability zone for the instance.
            </span>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Description */}
          <VStack gap={2} className="py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)]">
              Description
            </label>
            <Input
              placeholder="Enter description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              fullWidth
            />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              You can use letters, numbers, and special characters (+=.@-_,()[]), and maximum 255 characters.
            </span>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Next Button */}
          <HStack justify="end" className="pt-3">
            <Button variant="primary" onClick={onNext}>
              Next
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   ImageSection Component
   ---------------------------------------- */

interface ImageRow {
  id: string;
  status: 'active' | 'error' | 'building';
  name: string;
  version: string;
  size: string;
  minDisk: string;
  minRam: string;
  access: string;
  os: 'ubuntu' | 'windows' | 'rocky' | 'other';
}

interface SnapshotRow {
  id: string;
  status: 'active' | 'error' | 'building';
  name: string;
  size: string;
  sourceInstance: string;
  createdAt: string;
}

interface BootableVolumeRow {
  id: string;
  status: 'available' | 'in-use' | 'error';
  name: string;
  size: string;
  type: string;
  createdAt: string;
}

const mockImages: ImageRow[] = [
  { id: 'e920j30d', status: 'active', name: 'ubuntu-24.04-tk-base', version: '24.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j31d', status: 'active', name: 'ubuntu-24.04-tk-base', version: '24.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j32d', status: 'active', name: 'ubuntu-24.04-tk-base', version: '24.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j33d', status: 'active', name: 'ubuntu-24.04-tk-base', version: '24.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j34d', status: 'error', name: 'ubuntu-24.04-tk-base', version: '24.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j35d', status: 'active', name: 'ubuntu-22.04-tk-base', version: '22.04', size: '650.12 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j36d', status: 'active', name: 'ubuntu-20.04-tk-base', version: '20.04', size: '580.45 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j37d', status: 'active', name: 'windows-server-2022', version: '2022', size: '4.5 GiB', minDisk: '40.00 GiB', minRam: '2 GiB', access: 'Public', os: 'windows' },
  { id: 'e920j38d', status: 'active', name: 'windows-server-2019', version: '2019', size: '4.2 GiB', minDisk: '40.00 GiB', minRam: '2 GiB', access: 'Public', os: 'windows' },
  { id: 'e920j39d', status: 'active', name: 'rocky-9.3-tk-base', version: '9.3', size: '890.23 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'rocky' },
  { id: 'e920j40d', status: 'active', name: 'rocky-8.9-tk-base', version: '8.9', size: '850.11 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'rocky' },
  { id: 'e920j41d', status: 'active', name: 'centos-stream-9', version: '9', size: '920.00 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'other' },
];

const mockSnapshots: SnapshotRow[] = [
  { id: 's1', status: 'active', name: 'newsnapshot', size: '709.98 MiB', sourceInstance: 'th-server', createdAt: '2025-09-01' },
  { id: 's2', status: 'active', name: 'web-backup', size: '1.2 GiB', sourceInstance: 'web-server-01', createdAt: '2025-08-28' },
  { id: 's3', status: 'active', name: 'db-snapshot', size: '2.5 GiB', sourceInstance: 'db-master', createdAt: '2025-08-25' },
  { id: 's4', status: 'building', name: 'app-snapshot', size: '890.00 MiB', sourceInstance: 'app-server', createdAt: '2025-08-20' },
  { id: 's5', status: 'active', name: 'test-snapshot', size: '512.00 MiB', sourceInstance: 'test-vm', createdAt: '2025-08-15' },
];

const mockBootableVolumes: BootableVolumeRow[] = [
  { id: 'v1', status: 'available', name: 'boot-volume-01', size: '50 GiB', type: 'SSD', createdAt: '2025-09-01' },
  { id: 'v2', status: 'available', name: 'boot-volume-02', size: '100 GiB', type: 'SSD', createdAt: '2025-08-28' },
  { id: 'v3', status: 'in-use', name: 'system-disk', size: '80 GiB', type: 'HDD', createdAt: '2025-08-20' },
];

const storageTypeOptions = [
  { value: '_DEFAULT_', label: '_DEFAULT_' },
  { value: 'ssd', label: 'SSD' },
  { value: 'hdd', label: 'HDD' },
];

interface ImageSectionProps {
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  onNext: () => void;
}

function ImageSection({ selectedImageId, onSelectImage, onNext }: ImageSectionProps) {
  const [sourceTab, setSourceTab] = useState('image');
  const [osFilter, setOsFilter] = useState<'ubuntu' | 'windows' | 'rocky' | 'other'>('other');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [createSystemDisk, setCreateSystemDisk] = useState(true);
  const [storageType, setStorageType] = useState('_DEFAULT_');
  const [storageSize, setStorageSize] = useState(30);
  const [deleteWithInstance, setDeleteWithInstance] = useState(true);
  const [_dataDisks, setDataDisks] = useState<{ id: string; type: string; size: number }[]>([]);
  const itemsPerPage = 5;

  // Filter images based on OS filter and search query
  const filteredImages = mockImages.filter(img => {
    const matchesOs = osFilter === 'other' || img.os === osFilter;
    const matchesSearch = searchQuery === '' || 
      img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.version.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOs && matchesSearch;
  });

  // Paginate images
  const totalImagePages = Math.ceil(filteredImages.length / itemsPerPage) || 1;
  const paginatedImages = filteredImages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Filter snapshots based on search query
  const filteredSnapshots = mockSnapshots.filter(snap => {
    return searchQuery === '' || 
      snap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snap.sourceInstance.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter bootable volumes based on search query
  const filteredVolumes = mockBootableVolumes.filter(vol => {
    return searchQuery === '' || 
      vol.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get selected image info
  const selectedImage = mockImages.find(img => img.id === selectedImageId);

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Add data disk
  const handleAddDataDisk = () => {
    setDataDisks(prev => [...prev, { id: `dd-${Date.now()}`, type: '_DEFAULT_', size: 10 }]);
  };

  // Image Table columns
  const imageColumns: TableColumn<ImageRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => onSelectImage(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      render: (_, row) => (
        <StatusIndicator status={row.status as 'active' | 'error' | 'building'} />
      ),
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <a href="#" className="text-[var(--color-action-primary)] hover:underline text-[12px]">
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </VStack>
      ),
    },
    { key: 'version', label: 'Version', sortable: true, width: '80px' },
    { key: 'size', label: 'Size', sortable: true, width: '100px' },
    { key: 'minDisk', label: 'Min disk', sortable: true, width: '90px' },
    { key: 'minRam', label: 'Min RAM', sortable: true, width: '100px' },
    { key: 'access', label: 'Visibility', sortable: true, width: '80px' },
  ];

  // Snapshot Table columns
  const snapshotColumns: TableColumn<SnapshotRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => onSelectImage(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => (
        <StatusIndicator status={value as 'active' | 'error' | 'building'} />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'size', label: 'Size', sortable: true, width: '100px' },
    { key: 'sourceInstance', label: 'Source Instance', sortable: true, width: '140px' },
    { key: 'createdAt', label: 'Created At', sortable: true, width: '110px' },
  ];

  // Bootable Volume Table columns
  const volumeColumns: TableColumn<BootableVolumeRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => onSelectImage(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => {
        // Map volume status to StatusIndicator status
        const statusMap: Record<string, 'active' | 'in-use' | 'error'> = {
          'available': 'active',
          'in-use': 'in-use',
          'error': 'error',
        };
        return <StatusIndicator status={statusMap[value] || 'error'} />;
      },
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'size', label: 'Size', sortable: true, width: '80px' },
    { key: 'type', label: 'Type', sortable: true, width: '80px' },
    { key: 'createdAt', label: 'Created At', sortable: true, width: '110px' },
  ];

  const osChipStyle = (active: boolean) => `
    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer text-[12px] font-medium border transition-colors
    ${active 
      ? 'bg-[var(--color-action-primary)] text-white border-[var(--color-action-primary)]' 
      : 'bg-[var(--color-surface-default)] text-[var(--color-text-default)] border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]'
    }
  `;

  return (
    <SectionCard>
      <SectionCard.Header title="Source" />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Start Source */}
          <VStack gap={2} className="pt-3">
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              Start source<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </span>
            <span className="text-[12px] text-[var(--color-text-muted)] mb-4">
              Select a template to launch the instance. You can start from an OS image, a snapshot, or an existing volume.
            </span>
            
            {/* Source Tabs */}
            <Tabs value={sourceTab} onChange={setSourceTab} variant="underline" size="sm">
              <TabList>
                <Tab value="image">Image</Tab>
                <Tab value="snapshot">Instance snapshot</Tab>
                <Tab value="volume">Bootable volume</Tab>
              </TabList>
            </Tabs>

            {/* OS Filter Chips - Only show for Image tab */}
            {sourceTab === 'image' && (
              <HStack gap={2} className="mt-2">
                <button 
                  className={osChipStyle(osFilter === 'other')}
                  onClick={() => { setOsFilter('other'); setCurrentPage(1); }}
                >
                  <IconDots size={14} />
                  <span>Other</span>
                </button>
                <button 
                  className={osChipStyle(osFilter === 'ubuntu')}
                  onClick={() => { setOsFilter('ubuntu'); setCurrentPage(1); }}
                >
                  <IconBrandUbuntu size={14} />
                  <span>Ubuntu</span>
                </button>
                <button 
                  className={osChipStyle(osFilter === 'windows')}
                  onClick={() => { setOsFilter('windows'); setCurrentPage(1); }}
                >
                  <IconBrandWindows size={14} />
                  <span>Windows</span>
                </button>
                <button 
                  className={osChipStyle(osFilter === 'rocky')}
                  onClick={() => { setOsFilter('rocky'); setCurrentPage(1); }}
                >
                  <IconMountain size={14} />
                  <span>Rocky</span>
                </button>
              </HStack>
            )}

            {/* Search */}
            <SearchInput
              placeholder="Search image by attributes"
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
              size="sm"
              className="w-[280px] mt-2"
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={sourceTab === 'image' ? totalImagePages : Math.ceil(filteredSnapshots.length / itemsPerPage) || 1}
              totalItems={sourceTab === 'image' ? filteredImages.length : filteredSnapshots.length}
              onPageChange={setCurrentPage}
            />

            {/* Table - Dynamic based on tab */}
            {sourceTab === 'image' && (
              <Table
                columns={imageColumns}
                data={paginatedImages}
                rowKey="id"
                onRowClick={(row) => onSelectImage(row.id)}
              />
            )}
            {sourceTab === 'snapshot' && (
              <Table
                columns={snapshotColumns}
                data={filteredSnapshots.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                rowKey="id"
                onRowClick={(row) => onSelectImage(row.id)}
              />
            )}
            {sourceTab === 'volume' && (
              <Table
                columns={volumeColumns}
                data={filteredVolumes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                rowKey="id"
                onRowClick={(row) => onSelectImage(row.id)}
              />
            )}

            {/* Selected */}
            <HStack justify="between" align="center" className="w-full mt-3 px-3 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--table-row-radius)]">
              <HStack gap={2} align="center" className="flex-wrap">
                <span className="text-[12px] text-[var(--color-text-muted)]">Selected</span>
                {selectedImage && (
                  <Chip
                    value={selectedImage.name}
                    variant="selected"
                    onRemove={() => onSelectImage('')}
                  />
                )}
              </HStack>
              {selectedImage && (
                <button
                  type="button"
                  className="text-[12px] text-[var(--color-action-primary)] hover:underline"
                  onClick={() => onSelectImage('')}
                >
                  Clear
                </button>
              )}
            </HStack>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)] mt-6" />

          {/* System disk Section */}
          <VStack gap={3} className="py-6">
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                System disk<span className="ml-1 text-[var(--color-state-danger)]">*</span>
              </span>
              <span className="text-[12px] text-[var(--color-text-muted)]">
                Configure whether to create a system disk for booting.
              </span>
            </VStack>
            
            {/* Toggle */}
            <Toggle
              checked={createSystemDisk}
              onChange={setCreateSystemDisk}
              label="Create a new system disk"
            />

            {/* Storage Type & Size Row */}
            {createSystemDisk && (
              <HStack gap={4} align="end" className="flex-wrap">
                <VStack gap={2}>
                  <label className="text-[12px] font-medium text-[var(--color-text-default)]">
                    Type
                  </label>
                  <Select
                    options={storageTypeOptions}
                    value={storageType}
                    onChange={setStorageType}
                  />
                </VStack>
                <HStack gap={2} align="end">
                  <VStack gap={2}>
                    <label className="text-[12px] font-medium text-[var(--color-text-default)]">
                      Size
                    </label>
                    <NumberInput
                      value={storageSize}
                      onChange={setStorageSize}
                      min={1}
                      max={1000}
                    />
                  </VStack>
                  <span className="text-[12px] text-[var(--color-text-default)] pb-2">GiB</span>
                </HStack>
                <div className="self-end pb-[6px]">
                  <Checkbox
                    label="Deleted with the instance"
                    checked={deleteWithInstance}
                    onChange={(e) => setDeleteWithInstance(e.target.checked)}
                  />
                </div>
              </HStack>
            )}
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Data Disk Section */}
          <VStack gap={3} align="start" className="py-6">
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                Data Disk
              </span>
              <span className="text-[12px] text-[var(--color-text-muted)]">
                Attach additional volumes for data storage.
              </span>
            </VStack>
            
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<IconPlus size={12} />}
              onClick={handleAddDataDisk}
            >
              Add Data Disk
            </Button>
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Next Button */}
          <HStack justify="end" className="pt-3">
            <Button variant="primary" onClick={onNext}>
              Next
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   FlavorSection Component
   ---------------------------------------- */

interface FlavorRow {
  id: string;
  name: string;
  vCPU: number;
  ram: string;
  disk: string;
  ephemeralDisk: string;
  networkBandwidth: string;
  hasWarning?: boolean;
}

const mockFlavors: FlavorRow[] = [
  { id: '17kfj123', name: 'm5.large', vCPU: 2, ram: '2GiB', disk: '50GiB', ephemeralDisk: '0GiB', networkBandwidth: '-' },
  { id: '45hgf456', name: 't2.micro', vCPU: 2, ram: '2GiB', disk: '50GiB', ephemeralDisk: '0GiB', networkBandwidth: '-' },
  { id: '23hgf234', name: 'r5.2xlarge', vCPU: 2, ram: '2GiB', disk: '50GiB', ephemeralDisk: '0GiB', networkBandwidth: '-' },
  { id: '90jkl567', name: 'p3.8xlarge', vCPU: 2, ram: '2GiB', disk: '50GiB', ephemeralDisk: '0GiB', networkBandwidth: '-' },
  { id: '78kls890', name: 'c5.xlarge', vCPU: 2, ram: '2GiB', disk: '5GiB', ephemeralDisk: '0GiB', networkBandwidth: '-', hasWarning: true },
  { id: '12abc345', name: 'g4dn.xlarge', vCPU: 4, ram: '16GiB', disk: '125GiB', ephemeralDisk: '0GiB', networkBandwidth: '10 Gbps' },
  { id: '67def890', name: 'i3.large', vCPU: 2, ram: '15.25GiB', disk: '475GiB', ephemeralDisk: '0GiB', networkBandwidth: '-' },
  { id: '34ghi567', name: 'x1e.xlarge', vCPU: 4, ram: '122GiB', disk: '120GiB', ephemeralDisk: '0GiB', networkBandwidth: '-' },
];

interface FlavorSectionProps {
  selectedFlavorId: string | null;
  onSelectFlavor: (id: string) => void;
  onNext: () => void;
}

function FlavorSection({ selectedFlavorId, onSelectFlavor, onNext }: FlavorSectionProps) {
  const [flavorTab, setFlavorTab] = useState('vcpu');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter flavors based on search query
  const filteredFlavors = mockFlavors.filter(flavor => {
    return searchQuery === '' || 
      flavor.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Paginate filtered flavors
  const totalPages = Math.ceil(filteredFlavors.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFlavors = filteredFlavors.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Table columns
  const flavorColumns: TableColumn<FlavorRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedFlavorId === row.id}
            onChange={() => onSelectFlavor(row.id)}
          />
        </div>
      ),
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <a href="#" className="text-[var(--color-action-primary)] hover:underline text-[12px]">
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            {row.hasWarning && (
              <span className="text-[var(--color-state-warning)]">⚠</span>
            )}
          </HStack>
          <span className="text-[11px] text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </VStack>
      ),
    },
    { key: 'vCPU', label: 'vCPU', sortable: true, width: '70px' },
    { key: 'ram', label: 'RAM', sortable: true, width: '80px' },
    { key: 'disk', label: 'Disk', sortable: true, width: '80px' },
    { key: 'ephemeralDisk', label: 'Ephemeral Disk', sortable: true, width: '100px' },
    { key: 'networkBandwidth', label: 'Internal Network Bandwidth', sortable: true, width: '120px' },
  ];

  return (
    <SectionCard>
      <SectionCard.Header title="Flavor" />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Flavors Label & Description */}
          <VStack gap={2} className="pb-4">
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              Flavors<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </span>
            <span className="text-[12px] text-[var(--color-text-muted)] mb-4">
              Select the flavor that defines the vCPU, RAM, and disk capacity allocated to the instance.
            </span>

            {/* Flavor Type Tabs */}
            <Tabs value={flavorTab} onChange={setFlavorTab} variant="underline" size="sm">
              <TabList>
                <Tab value="vcpu">vCPU</Tab>
                <Tab value="gpu">GPU</Tab>
                <Tab value="npu">NPU</Tab>
                <Tab value="custom">Custom</Tab>
              </TabList>
            </Tabs>
          </VStack>

          {/* Search */}
          <SearchInput
            placeholder="Search flavors by attributes"
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
            size="sm"
            className="w-[280px] mb-2"
          />

          {/* Pagination */}
          <div className="mb-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredFlavors.length}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Flavor Table */}
          <Table
            columns={flavorColumns}
            data={paginatedFlavors}
            rowKey="id"
            onRowClick={(row) => onSelectFlavor(row.id)}
          />

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)] mt-4" />

          {/* Next Button */}
          <HStack justify="end" className="pt-3">
            <Button variant="primary" onClick={onNext}>
              Next
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   NetworkSection Component
   ---------------------------------------- */

interface NetworkRow {
  id: string;
  name: string;
  status: string;
  external: boolean;
  access: string;
  subnetCidr: string;
}

interface FloatingIPPoolRow {
  id: string;
  status: string;
  name: string;
  allocationPools: string;
}

interface ExistingFloatingIPRow {
  id: string;
  status: string;
  description: string;
  ipAddress: string;
  networkName: string;
}

interface SecurityGroupRow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface PortRow {
  id: string;
  status: string;
  name: string;
  ownedNetwork: string;
  fixedIp: string;
  macAddress: string;
}

const mockNetworks: NetworkRow[] = [
  { id: 'd32059d1', name: 'internal-01', status: 'Active', external: false, access: 'Private', subnetCidr: '192.168.1.0/24' },
  { id: 'd32059d2', name: 'internal-02', status: 'In-active', external: true, access: 'Public', subnetCidr: '192.168.10.0/24' },
  { id: 'd32059d3', name: 'internal-03', status: 'Active', external: false, access: 'Private', subnetCidr: '10.0.0.0/16' },
  { id: 'd32059d4', name: 'external-net', status: 'Active', external: true, access: 'Public', subnetCidr: '10.7.60.0/24' },
  { id: 'd32059d5', name: 'provider-net', status: 'Active', external: true, access: 'Public', subnetCidr: '10.7.61.0/24' },
];

const mockFloatingIPPools: FloatingIPPoolRow[] = [
  { id: 'pool1', status: 'Active', name: 'provider2041', allocationPools: '10.7.61.11 - 10.7.61.230' },
  { id: 'pool2', status: 'Active', name: 'provider2042', allocationPools: '10.7.62.11 - 10.7.62.230' },
  { id: 'pool3', status: 'Active', name: 'provider2043', allocationPools: '10.7.63.11 - 10.7.63.230' },
];

const mockExistingFloatingIPs: ExistingFloatingIPRow[] = [
  { id: 'fip1', status: 'Active', description: 'internal-02', ipAddress: '10.7.60.134', networkName: 'external-64' },
  { id: 'fip2', status: 'Active', description: 'internal-03', ipAddress: '10.7.60.135', networkName: 'external-65' },
  { id: 'fip3', status: 'Active', description: 'web-server', ipAddress: '10.7.60.136', networkName: 'external-64' },
];

const mockSecurityGroups: SecurityGroupRow[] = [
  { id: 'sg1', name: 'default', description: 'Default security group', createdAt: '2025-08-15' },
  { id: 'sg2', name: 'suite-default', description: 'test only', createdAt: '2025-09-01' },
  { id: 'sg3', name: 'web-sg', description: 'Web server security group', createdAt: '2025-09-10' },
  { id: 'sg4', name: 'db-sg', description: 'Database security group', createdAt: '2025-09-15' },
];

const mockPorts: PortRow[] = [
  { id: 'port1', status: 'Active', name: 'internal-02', ownedNetwork: 'external-65', fixedIp: '10.7.60.135', macAddress: 'fa:16:3e:aa:bb:cc' },
  { id: 'port2', status: 'Active', name: 'internal-03', ownedNetwork: 'external-64', fixedIp: '10.7.60.136', macAddress: 'fa:16:3e:dd:ee:ff' },
  { id: 'port3', status: 'Active', name: 'web-port', ownedNetwork: 'internal-01', fixedIp: '192.168.1.10', macAddress: 'fa:16:3e:11:22:33' },
];

interface NetworkSectionProps {
  onNext: () => void;
}

function NetworkSection({ onNext }: NetworkSectionProps) {
  // Network selection
  const [selectedNetworkIds, setSelectedNetworkIds] = useState<Set<string>>(new Set());
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);

  // Virtual LAN (Disclosure)
  const [vlanOpen, setVlanOpen] = useState(false);

  // Floating IP
  const [floatingIpOption, setFloatingIpOption] = useState<'none' | 'auto' | 'existing'>('none');
  const [selectedFloatingPool, setSelectedFloatingPool] = useState<string | null>(null);
  const [selectedExistingFip, setSelectedExistingFip] = useState<Set<string>>(new Set());
  const [fipSearch, setFipSearch] = useState('');
  const [fipPage, setFipPage] = useState(1);

  // Security Groups
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<Set<string>>(new Set(['sg2']));
  const [sgSearch, setSgSearch] = useState('');
  const [sgPage, setSgPage] = useState(1);

  // Port (Disclosure)
  const [portOpen, setPortOpen] = useState(false);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [portSearch, setPortSearch] = useState('');
  const [portPage, setPortPage] = useState(1);

  // Filtered data
  const filteredNetworks = mockNetworks.filter(n =>
    networkSearch === '' || n.name.toLowerCase().includes(networkSearch.toLowerCase())
  );

  const filteredFloatingPools = mockFloatingIPPools.filter(p =>
    fipSearch === '' || p.name.toLowerCase().includes(fipSearch.toLowerCase())
  );

  const filteredExistingFips = mockExistingFloatingIPs.filter(f =>
    fipSearch === '' || f.description.toLowerCase().includes(fipSearch.toLowerCase())
  );

  const filteredSecurityGroups = mockSecurityGroups.filter(sg =>
    sgSearch === '' || sg.name.toLowerCase().includes(sgSearch.toLowerCase())
  );

  const filteredPorts = mockPorts.filter(p =>
    portSearch === '' || p.name.toLowerCase().includes(portSearch.toLowerCase())
  );

  // Network columns
  const networkColumns: TableColumn<NetworkRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedNetworkIds.has(row.id)}
            onChange={() => {
              const newSet = new Set(selectedNetworkIds);
              if (newSet.has(row.id)) {
                newSet.delete(row.id);
              } else {
                newSet.add(row.id);
              }
              setSelectedNetworkIds(newSet);
            }}
          />
        </div>
      ),
    },
    {
      key: 'idName',
      label: 'ID/Name',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0} align="start">
          <span className="text-[11px] text-[var(--color-text-subtle)]">{row.id}</span>
          <span>{row.name}</span>
        </VStack>
      ),
    },
    { key: 'status', label: 'Status' },
    {
      key: 'external',
      label: 'External',
      render: (_, row) => <span>{row.external ? 'Yes' : 'No'}</span>,
    },
    { key: 'access', label: 'Access' },
    { key: 'subnetCidr', label: 'Subnet CIDR' },
  ];

  // Floating IP Pool columns
  const floatingPoolColumns: TableColumn<FloatingIPPoolRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedFloatingPool === row.id}
            onChange={() => setSelectedFloatingPool(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '80px',
      render: (_, row) => <StatusIndicator status={row.status === 'Active' ? 'active' : 'shutoff'} />,
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'allocationPools', label: 'Allocation Pools' },
  ];

  // Existing Floating IP columns
  const existingFipColumns: TableColumn<ExistingFloatingIPRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedExistingFip.has(row.id)}
            onChange={() => {
              const newSet = new Set(selectedExistingFip);
              if (newSet.has(row.id)) {
                newSet.delete(row.id);
              } else {
                newSet.add(row.id);
              }
              setSelectedExistingFip(newSet);
            }}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '80px',
      render: (_, row) => <StatusIndicator status={row.status === 'Active' ? 'active' : 'shutoff'} />,
    },
    {
      key: 'idDesc',
      label: 'ID/Description',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0} align="start">
          <span className="text-[11px] text-[var(--color-text-subtle)]">{row.id}</span>
          <span>{row.description}</span>
        </VStack>
      ),
    },
    { key: 'ipAddress', label: 'IP Address', sortable: true },
    { key: 'networkName', label: 'Network Name', sortable: true },
  ];

  // Security Group columns
  const securityGroupColumns: TableColumn<SecurityGroupRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedSecurityGroups.has(row.id)}
            onChange={() => {
              const newSet = new Set(selectedSecurityGroups);
              if (newSet.has(row.id)) {
                newSet.delete(row.id);
              } else {
                newSet.add(row.id);
              }
              setSelectedSecurityGroups(newSet);
            }}
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, row) => (
        <a
          href={`/security-groups/${row.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[var(--color-action-primary)] hover:underline font-medium"
        >
          <span>{row.name}</span>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      ),
    },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'createdAt', label: 'Created At', sortable: true },
  ];

  // Port columns
  const portColumns: TableColumn<PortRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedPortId === row.id}
            onChange={() => setSelectedPortId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '80px',
      render: (_, row) => <StatusIndicator status={row.status === 'Active' ? 'active' : 'shutoff'} />,
    },
    {
      key: 'idName',
      label: 'ID/Name',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0} align="start">
          <span className="text-[11px] text-[var(--color-text-subtle)]">{row.id}</span>
          <span>{row.name}</span>
        </VStack>
      ),
    },
    { key: 'ownedNetwork', label: 'Owned Network', sortable: true },
    { key: 'fixedIp', label: 'Fixed IP' },
    { key: 'macAddress', label: 'MAC Address' },
  ];

  // Selected items display
  const selectedNetworkNames = mockNetworks
    .filter(n => selectedNetworkIds.has(n.id))
    .map(n => `${n.id}(${n.name})`);

  const selectedSgNames = mockSecurityGroups
    .filter(sg => selectedSecurityGroups.has(sg.id))
    .map(sg => sg.name);

  return (
    <SectionCard>
      <SectionCard.Header title="Network" />
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Network Sub-section */}
          <VStack gap={3}>
            <span className="text-[14px] font-medium">Network</span>
            
            {/* Search */}
            <SearchInput
              placeholder="Find Network with filters"
              value={networkSearch}
              onChange={(e) => setNetworkSearch(e.target.value)}
              onClear={() => setNetworkSearch('')}
              size="sm"
              className="w-[280px]"
            />

            {/* Pagination */}
            <Pagination
              currentPage={networkPage}
              totalPages={Math.ceil(filteredNetworks.length / 5) || 1}
              totalItems={filteredNetworks.length}
              onPageChange={setNetworkPage}
            />

            {/* Network Table */}
            <Table
              columns={networkColumns}
              data={filteredNetworks}
              rowKey="id"
              onRowClick={(row) => {
                const newSet = new Set(selectedNetworkIds);
                if (newSet.has(row.id)) {
                  newSet.delete(row.id);
                } else {
                  newSet.add(row.id);
                }
                setSelectedNetworkIds(newSet);
              }}
            />

            {/* Selected Networks Tags */}
            {selectedNetworkNames.length > 0 && (
              <HStack gap={2} className="flex-wrap">
                {selectedNetworkNames.map((name, idx) => (
                  <Chip
                    key={idx}
                    value={name}
                    variant="selected"
                    onRemove={() => {
                      const id = name.split('(')[0];
                      const newSet = new Set(selectedNetworkIds);
                      newSet.delete(id);
                      setSelectedNetworkIds(newSet);
                    }}
                  />
                ))}
              </HStack>
            )}
          </VStack>

          {/* Virtual LAN Disclosure */}
          <Disclosure open={vlanOpen} onChange={setVlanOpen}>
            <Disclosure.Trigger>
              <HStack gap={2} align="center">
                <span className="text-[14px] font-medium">Virtual LAN</span>
                <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
              </HStack>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-3 text-[var(--color-text-subtle)]">
                Virtual LAN configuration options will be displayed here.
              </div>
            </Disclosure.Panel>
          </Disclosure>

          {/* Divider */}
          <div className="h-px bg-[var(--color-border-subtle)]" />

          {/* Floating IP Section */}
          <VStack gap={3}>
            <span className="text-[14px] font-medium">Floating IP</span>
            
            {/* Radio Options */}
            <VStack gap={2}>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio
                  value="none"
                  checked={floatingIpOption === 'none'}
                  onChange={() => setFloatingIpOption('none')}
                />
                <span className="text-[12px]">None (internal only)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio
                  value="auto"
                  checked={floatingIpOption === 'auto'}
                  onChange={() => setFloatingIpOption('auto')}
                />
                <span className="text-[12px]">Auto-assign IP</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio
                  value="existing"
                  checked={floatingIpOption === 'existing'}
                  onChange={() => setFloatingIpOption('existing')}
                />
                <span className="text-[12px]">Use existing IP</span>
              </label>
            </VStack>

            {/* Conditional Table for Auto-assign IP */}
            {floatingIpOption === 'auto' && (
              <VStack gap={3} className="mt-2">
                <SearchInput
                  placeholder="Find Network with filters"
                  value={fipSearch}
                  onChange={(e) => setFipSearch(e.target.value)}
                  onClear={() => setFipSearch('')}
                  size="sm"
                  className="w-[280px]"
                />
                <Pagination
                  currentPage={fipPage}
                  totalPages={Math.ceil(filteredFloatingPools.length / 5) || 1}
                  totalItems={filteredFloatingPools.length}
                  onPageChange={setFipPage}
                />
                <Table
                  columns={floatingPoolColumns}
                  data={filteredFloatingPools}
                  rowKey="id"
                  onRowClick={(row) => setSelectedFloatingPool(row.id)}
                />
              </VStack>
            )}

            {/* Conditional Table for Use existing IP */}
            {floatingIpOption === 'existing' && (
              <VStack gap={3} className="mt-2">
                <HStack justify="between" align="center" className="w-full">
                  <SearchInput
                    placeholder="Find Floating IP with filters"
                    value={fipSearch}
                    onChange={(e) => setFipSearch(e.target.value)}
                    onClear={() => setFipSearch('')}
                    size="sm"
                    className="w-[280px]"
                  />
                  <Button variant="secondary" size="sm">
                    <HStack gap={1} align="center">
                      <span>Create a new network</span>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </HStack>
                  </Button>
                </HStack>
                <Pagination
                  currentPage={fipPage}
                  totalPages={Math.ceil(filteredExistingFips.length / 5) || 1}
                  totalItems={filteredExistingFips.length}
                  onPageChange={setFipPage}
                />
                <Table
                  columns={existingFipColumns}
                  data={filteredExistingFips}
                  rowKey="id"
                  onRowClick={(row) => {
                    const newSet = new Set(selectedExistingFip);
                    if (newSet.has(row.id)) {
                      newSet.delete(row.id);
                    } else {
                      newSet.add(row.id);
                    }
                    setSelectedExistingFip(newSet);
                  }}
                />
              </VStack>
            )}
          </VStack>

          {/* Divider */}
          <div className="h-px bg-[var(--color-border-subtle)]" />

          {/* Security Groups Section */}
          <VStack gap={3}>
            <span className="text-[14px] font-medium">Security Groups</span>
            
            <HStack justify="between" align="center" className="w-full">
              <SearchInput
                placeholder="Find Security Group with filters"
                value={sgSearch}
                onChange={(e) => setSgSearch(e.target.value)}
                onClear={() => setSgSearch('')}
                size="sm"
                className="w-[280px]"
              />
              <Button variant="secondary" size="sm">
                <HStack gap={1} align="center">
                  <span>Create a new security group</span>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </HStack>
              </Button>
            </HStack>

            <Pagination
              currentPage={sgPage}
              totalPages={Math.ceil(filteredSecurityGroups.length / 5) || 1}
              totalItems={filteredSecurityGroups.length}
              onPageChange={setSgPage}
            />

            <Table
              columns={securityGroupColumns}
              data={filteredSecurityGroups}
              rowKey="id"
              onRowClick={(row) => {
                const newSet = new Set(selectedSecurityGroups);
                if (newSet.has(row.id)) {
                  newSet.delete(row.id);
                } else {
                  newSet.add(row.id);
                }
                setSelectedSecurityGroups(newSet);
              }}
            />

            {/* Selected Security Groups Tags */}
            {selectedSgNames.length > 0 && (
              <HStack gap={2} className="flex-wrap">
                {selectedSgNames.map((name, idx) => (
                  <Chip
                    key={idx}
                    value={name}
                    variant="selected"
                    onRemove={() => {
                      const sg = mockSecurityGroups.find(s => s.name === name);
                      if (sg) {
                        const newSet = new Set(selectedSecurityGroups);
                        newSet.delete(sg.id);
                        setSelectedSecurityGroups(newSet);
                      }
                    }}
                  />
                ))}
              </HStack>
            )}
          </VStack>

          {/* Divider */}
          <div className="h-px bg-[var(--color-border-subtle)]" />

          {/* Port Disclosure */}
          <Disclosure open={portOpen} onChange={setPortOpen}>
            <Disclosure.Trigger>
              <HStack gap={2} align="center">
                <span className="text-[14px] font-medium">Port</span>
                <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
              </HStack>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={3} className="pt-3">
                <SearchInput
                  placeholder="Find Floating IP with filters"
                  value={portSearch}
                  onChange={(e) => setPortSearch(e.target.value)}
                  onClear={() => setPortSearch('')}
                  size="sm"
                  className="w-[280px]"
                />
                <Pagination
                  currentPage={portPage}
                  totalPages={Math.ceil(filteredPorts.length / 5) || 1}
                  totalItems={filteredPorts.length}
                  onPageChange={setPortPage}
                />
                <Table
                  columns={portColumns}
                  data={filteredPorts}
                  rowKey="id"
                  onRowClick={(row) => setSelectedPortId(row.id)}
                />

                {/* Selected Port Tag */}
                {selectedPortId && (
                  <HStack gap={2}>
                    <Chip
                      value={selectedPortId}
                      variant="selected"
                      onRemove={() => setSelectedPortId(null)}
                    />
                  </HStack>
                )}
              </VStack>
            </Disclosure.Panel>
          </Disclosure>

          {/* Next Button */}
          <HStack justify="end" className="w-full pt-2">
            <Button variant="primary" onClick={onNext}>
              Next
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   AuthenticationSection Component
   ---------------------------------------- */

interface KeyPairRow {
  id: string;
  name: string;
  fingerprint: string;
}

const mockKeyPairs: KeyPairRow[] = [
  { id: 'kp1', name: 'dev-keypair', fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf' },
  { id: 'kp2', name: 'prod-keypair', fingerprint: 'a1:b2:c3:d4:e5:f6:g7:h8:i9:j0:k1:l2:m3:n4:o5:p6' },
  { id: 'kp3', name: 'staging-keypair', fingerprint: 'f1:e2:d3:c4:b5:a6:97:88:79:6a:5b:4c:3d:2e:1f:0g' },
  { id: 'kp4', name: 'test-keypair', fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00' },
  { id: 'kp5', name: 'backup-keypair', fingerprint: 'aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99' },
];

interface AuthenticationSectionProps {
  onNext: () => void;
}

function AuthenticationSection({ onNext }: AuthenticationSectionProps) {
  const [loginType, setLoginType] = useState<'keypair' | 'password'>('keypair');
  const [selectedKeyPairId, setSelectedKeyPairId] = useState<string | null>(null);
  const [keyPairSearch, setKeyPairSearch] = useState('');
  const [keyPairPage, setKeyPairPage] = useState(1);
  
  // Password fields
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Filtered key pairs
  const filteredKeyPairs = mockKeyPairs.filter(kp =>
    keyPairSearch === '' || kp.name.toLowerCase().includes(keyPairSearch.toLowerCase())
  );

  // Key Pair columns
  const keyPairColumns: TableColumn<KeyPairRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedKeyPairId === row.id}
            onChange={() => setSelectedKeyPairId(row.id)}
          />
        </div>
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'fingerprint', label: 'Fingerprint', sortable: true },
  ];

  return (
    <SectionCard>
      <SectionCard.Header title="Authentication">
        <Button variant="secondary" size="sm">
          <HStack gap={1} align="center">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Create a new key pair</span>
          </HStack>
        </Button>
      </SectionCard.Header>
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Login Type Header */}
          <span className="text-[14px] font-medium">Login type</span>

          {/* Login Type Tabs */}
          <Tabs value={loginType} onChange={(v) => setLoginType(v as 'keypair' | 'password')}>
            <TabList>
              <Tab value="keypair">Key Pair</Tab>
              <Tab value="password">Password</Tab>
            </TabList>

            {/* Key Pair Tab Content */}
            <TabPanel value="keypair" className="pt-4">
              <VStack gap={3}>
                {/* Search */}
                <SearchInput
                  placeholder="Find Key Pair with filters"
                  value={keyPairSearch}
                  onChange={(e) => setKeyPairSearch(e.target.value)}
                  onClear={() => setKeyPairSearch('')}
                  size="sm"
                  className="w-[280px]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={keyPairPage}
                  totalPages={Math.ceil(filteredKeyPairs.length / 5) || 1}
                  totalItems={filteredKeyPairs.length}
                  onPageChange={setKeyPairPage}
                />

                {/* Key Pair Table */}
                <Table
                  columns={keyPairColumns}
                  data={filteredKeyPairs}
                  rowKey="id"
                  onRowClick={(row) => setSelectedKeyPairId(row.id)}
                />
              </VStack>
            </TabPanel>

            {/* Password Tab Content */}
            <TabPanel value="password" className="pt-4">
              <VStack gap={4}>
                <div>
                  <label className="block text-[14px] font-medium mb-2">Login Name</label>
                  <Input
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="Input Login Name"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium mb-2">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Input Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Input Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </VStack>
            </TabPanel>
          </Tabs>

          {/* Next Button */}
          <HStack justify="end" className="w-full pt-2">
            <Button variant="primary" onClick={onNext}>
              Next
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   AdvancedSection Component
   ---------------------------------------- */

interface ServerGroupRow {
  id: string;
  name: string;
  memberCount: number;
  policy: string;
}

const mockServerGroups: ServerGroupRow[] = [
  { id: 'sg1', name: 'web-cluster-01', memberCount: 3, policy: 'Affinity' },
  { id: 'sg2', name: 'web-cluster-02', memberCount: 2, policy: 'Affinity' },
  { id: 'sg3', name: 'db-cluster', memberCount: 5, policy: 'Anti-Affinity' },
  { id: 'sg4', name: 'cache-cluster', memberCount: 4, policy: 'Soft Anti-Affinity' },
  { id: 'sg5', name: 'app-cluster', memberCount: 6, policy: 'Soft Affinity' },
];

interface AdvancedSectionProps {
  onNext: () => void;
}

function AdvancedSection({ onNext }: AdvancedSectionProps) {
  // Server Group
  const [serverGroupOpen, setServerGroupOpen] = useState(false);
  const [selectedServerGroupId, setSelectedServerGroupId] = useState<string | null>(null);
  const [serverGroupSearch, setServerGroupSearch] = useState('');
  const [serverGroupPage, setServerGroupPage] = useState(1);

  // User Data
  const [userDataOpen, setUserDataOpen] = useState(false);
  const [userData, setUserData] = useState('');

  // Filtered server groups
  const filteredServerGroups = mockServerGroups.filter(sg =>
    serverGroupSearch === '' || sg.name.toLowerCase().includes(serverGroupSearch.toLowerCase())
  );

  // Server Group columns
  const serverGroupColumns: TableColumn<ServerGroupRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedServerGroupId === row.id}
            onChange={() => setSelectedServerGroupId(row.id)}
          />
        </div>
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'memberCount', label: 'Member Count', sortable: true, width: '120px' },
    { key: 'policy', label: 'Policy', sortable: true },
  ];

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setUserData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <SectionCard>
      <SectionCard.Header title="Advanced" />
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Server Group Disclosure */}
          <Disclosure open={serverGroupOpen} onChange={setServerGroupOpen}>
            <Disclosure.Trigger>
              <HStack gap={2} align="center">
                <span className="text-[14px] font-medium">Server Group</span>
                <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
              </HStack>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={3} className="pt-3">
                {/* Search */}
                <SearchInput
                  placeholder="Find Server Group with filters"
                  value={serverGroupSearch}
                  onChange={(e) => setServerGroupSearch(e.target.value)}
                  onClear={() => setServerGroupSearch('')}
                  size="sm"
                  className="w-[280px]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={serverGroupPage}
                  totalPages={Math.ceil(filteredServerGroups.length / 5) || 1}
                  totalItems={filteredServerGroups.length}
                  onPageChange={setServerGroupPage}
                />

                {/* Server Group Table */}
                <Table
                  columns={serverGroupColumns}
                  data={filteredServerGroups}
                  rowKey="id"
                  onRowClick={(row) => setSelectedServerGroupId(row.id)}
                />
              </VStack>
            </Disclosure.Panel>
          </Disclosure>

          {/* Divider */}
          <div className="h-px bg-[var(--color-border-subtle)]" />

          {/* User Data Disclosure */}
          <Disclosure open={userDataOpen} onChange={setUserDataOpen}>
            <Disclosure.Trigger>
              <HStack gap={2} align="center">
                <span className="text-[14px] font-medium">User Data</span>
                <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
              </HStack>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={3} className="pt-3">
                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="user-data-file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".txt,.sh,.yaml,.yml,.json"
                  />
                  <label htmlFor="user-data-file">
                    <Button variant="secondary" size="sm" as="span" className="cursor-pointer">
                      <HStack gap={1} align="center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Upload a file</span>
                      </HStack>
                    </Button>
                  </label>
                </div>

                {/* User Data Textarea */}
                <Textarea
                  value={userData}
                  onChange={(e) => setUserData(e.target.value)}
                  placeholder="input user data"
                  rows={6}
                  fullWidth
                  className="font-mono text-[12px]"
                />
              </VStack>
            </Disclosure.Panel>
          </Disclosure>

          {/* Next Button */}
          <HStack justify="end" className="w-full pt-2">
            <Button variant="primary" onClick={onNext}>
              Next
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   TemplatesSection Component (Active Section)
   ---------------------------------------- */

interface TemplatesSectionProps {
  templates: TemplateRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSkip: () => void;
  onNext: () => void;
}

function TemplatesSection({ templates, selectedId, onSelect, onSkip, onNext }: TemplatesSectionProps) {
  const [activeTab, setActiveTab] = useState('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter templates based on active tab
  const getFilteredTemplates = () => {
    let filtered = templates;
    
    // Filter by tab
    if (activeTab === 'favorites') {
      filtered = templates.filter(t => t.isFavorite);
    } else if (activeTab === 'current-tenant') {
      filtered = templates.filter(t => t.visibility === 'Private');
    } else if (activeTab === 'public') {
      filtered = templates.filter(t => t.visibility === 'Public');
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();

  // Table columns
  const columns: TableColumn<TemplateRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedId === row.id}
            onChange={() => onSelect(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'favorite',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center">
          {row.isFavorite ? (
            <IconStarFilled size={14} className="text-yellow-400" />
          ) : (
            <IconStar size={14} stroke={1.5} className="text-[var(--color-text-subtle)]" />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0} align="start">
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">
              {row.name}
            </span>
            <IconExternalLink size={12} stroke={1.5} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-subtle)]">
            ID: {row.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
    },
    {
      key: 'visibility',
      label: 'Visibility',
      width: '100px',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      width: '120px',
      sortable: true,
    },
  ];

  return (
    <div className="bg-[var(--color-surface-default)] border-2 border-[var(--color-action-primary)] rounded-lg p-4">
      <VStack gap={3}>
        {/* Section Header */}
        <HStack justify="between" align="start" className="w-full">
          <h5 className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
            Templates
          </h5>
          <Button variant="outline" size="sm">
            <span>Create a new template</span>
            <IconExternalLink size={12} stroke={1.5} />
          </Button>
        </HStack>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} size="sm" variant="underline">
          <TabList>
            <Tab value="favorites">Favorites</Tab>
            <Tab value="current-tenant">Current tenant</Tab>
            <Tab value="public">Public</Tab>
          </TabList>

          <TabPanel value="favorites" className="pt-3">
            <VStack gap={3}>
              {/* Search */}
              <SearchInput
                placeholder="Find template with filters"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                size="sm"
                className="w-[280px]"
              />

              {/* Pagination */}
              <HStack justify="between" align="center" className="w-full">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.max(1, Math.ceil(filteredTemplates.length / 10))}
                  totalItems={filteredTemplates.length}
                  onPageChange={setCurrentPage}
                />
              </HStack>

              {/* Table with Selection */}
              {filteredTemplates.length > 0 ? (
                <Table
                  columns={columns}
                  data={filteredTemplates}
                  rowKey="id"
                  onRowClick={(row) => onSelect(row.id)}
                />
              ) : (
                <div className="text-[12px] text-[var(--color-text-subtle)] py-8 text-center border border-[var(--color-border-default)] rounded-md">
                  No favorite templates
                </div>
              )}
            </VStack>
          </TabPanel>

          <TabPanel value="current-tenant" className="pt-3">
            <VStack gap={3}>
              {/* Search */}
              <SearchInput
                placeholder="Find template with filters"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                size="sm"
                className="w-[280px]"
              />

              {/* Pagination */}
              <HStack justify="between" align="center" className="w-full">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.max(1, Math.ceil(filteredTemplates.length / 10))}
                  totalItems={filteredTemplates.length}
                  onPageChange={setCurrentPage}
                />
              </HStack>

              {/* Table with Selection */}
              {filteredTemplates.length > 0 ? (
                <Table
                  columns={columns}
                  data={filteredTemplates}
                  rowKey="id"
                  onRowClick={(row) => onSelect(row.id)}
                />
              ) : (
                <div className="text-[12px] text-[var(--color-text-subtle)] py-8 text-center border border-[var(--color-border-default)] rounded-md">
                  No templates in current tenant
                </div>
              )}
            </VStack>
          </TabPanel>

          <TabPanel value="public" className="pt-3">
            <VStack gap={3}>
              {/* Search */}
              <SearchInput
                placeholder="Find template with filters"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                size="sm"
                className="w-[280px]"
              />

              {/* Pagination */}
              <HStack justify="between" align="center" className="w-full">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.max(1, Math.ceil(filteredTemplates.length / 10))}
                  totalItems={filteredTemplates.length}
                  onPageChange={setCurrentPage}
                />
              </HStack>

              {/* Table with Selection */}
              {filteredTemplates.length > 0 ? (
                <Table
                  columns={columns}
                  data={filteredTemplates}
                  rowKey="id"
                  onRowClick={(row) => onSelect(row.id)}
                />
              ) : (
                <div className="text-[12px] text-[var(--color-text-subtle)] py-8 text-center border border-[var(--color-border-default)] rounded-md">
                  No public templates available
                </div>
              )}
            </VStack>
          </TabPanel>
        </Tabs>

        {/* Action Buttons */}
        <HStack gap={2} justify="end" className="pt-2 w-full">
          <Button
            variant="outline"
            onClick={onSkip}
            className="min-w-[80px]"
          >
            Skip
          </Button>
          <Button
            variant="primary"
            onClick={onNext}
            className="min-w-[80px]"
          >
            Next
          </Button>
        </HStack>
      </VStack>
    </div>
  );
}

/* ----------------------------------------
   CreateInstancePage
   ---------------------------------------- */

export function CreateInstancePage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab } = useTabs();
  
  // Section status management
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    templates: 'active',
    'basic-info': 'pre',
    image: 'pre',
    flavor: 'pre',
    network: 'pre',
    authentication: 'pre',
    advanced: 'pre',
  });
  
  // Form state
  const [numberOfInstances, setNumberOfInstances] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // Basic Information state
  const [instanceName, setInstanceName] = useState('');
  const [availabilityZone, setAvailabilityZone] = useState('nova');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState<{ key: string; value: string }[]>([]);
  
  // Image state
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [storageOption, setStorageOption] = useState('create');
  const [storageType, setStorageType] = useState('_DEFAULT_');
  const [storageSize, setStorageSize] = useState(30);
  const [deleteWithInstance, setDeleteWithInstance] = useState(true);
  
  // Flavor state
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(null);
  
  // Network state
  const [selectedNetworkIds, setSelectedNetworkIds] = useState<Set<string>>(new Set());
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<Set<string>>(new Set(['sg2']));
  const [floatingIpOption, setFloatingIpOption] = useState<'none' | 'auto' | 'existing'>('none');
  
  // Authentication state
  const [loginType, setLoginType] = useState<'keypair' | 'password'>('keypair');
  const [selectedKeyPairId, setSelectedKeyPairId] = useState<string | null>(null);
  
  // Advanced state
  const [selectedServerGroupId, setSelectedServerGroupId] = useState<string | null>(null);
  const [userData, setUserData] = useState('');

  // Convert tabs for TabBar
  const tabBarTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle cancel
  const handleCancel = () => {
    navigate('/compute/instances');
  };

  // Get current active section
  const getActiveSection = (): SectionStep | null => {
    return SECTION_ORDER.find(section => sectionStatus[section] === 'active') || null;
  };

  // Handle Skip (for Templates section only)
  const handleSkip = (section: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(section);
    if (currentIndex === -1 || currentIndex >= SECTION_ORDER.length - 1) return;
    
    const nextSection = SECTION_ORDER[currentIndex + 1];
    
    // Clear selection when skipping
    if (section === 'templates') {
      setSelectedTemplateId(null);
    }
    
    setSectionStatus(prev => ({
      ...prev,
      [section]: 'skipped',
      [nextSection]: 'active',
    }));
  };

  // Handle Next (complete current section, activate next)
  const handleNext = (section: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(section);
    if (currentIndex === -1) return;
    
    const nextSection = SECTION_ORDER[currentIndex + 1];
    
    if (nextSection) {
      setSectionStatus(prev => ({
        ...prev,
        [section]: 'done',
        [nextSection]: 'active',
      }));
    } else {
      // Last section - mark as done
      setSectionStatus(prev => ({
        ...prev,
        [section]: 'done',
      }));
    }
  };

  // Handle Edit (reactivate a completed section)
  const handleEdit = (section: SectionStep) => {
    // Mark all sections after this one as 'pre'
    const sectionIndex = SECTION_ORDER.indexOf(section);
    
    setSectionStatus(prev => {
      const newStatus = { ...prev };
      // Set clicked section as active
      newStatus[section] = 'active';
      
      // Set all sections after as 'pre'
      for (let i = sectionIndex + 1; i < SECTION_ORDER.length; i++) {
        newStatus[SECTION_ORDER[i]] = 'pre';
      }
      
      return newStatus;
    });
  };

  // Get summary data for done sections
  const getTemplateSummary = () => {
    if (!selectedTemplateId) return null;
    const template = mockTemplates.find(t => t.id === selectedTemplateId);
    return template ? template.name : null;
  };

  const getImageSummary = () => {
    if (!selectedImageId) return null;
    const image = mockImages.find(i => i.id === selectedImageId);
    return image ? image.name : null;
  };

  const getFlavorSummary = () => {
    if (!selectedFlavorId) return null;
    const flavor = mockFlavors.find(f => f.id === selectedFlavorId);
    return flavor ? `${flavor.vCPU}vCPU/${flavor.ram}/${flavor.disk}` : null;
  };

  const getStorageSummary = () => {
    if (storageOption === 'no-create') return 'No system disk';
    return `${storageType} ${storageSize}GiB${deleteWithInstance ? ' (Deleted with instance)' : ''}`;
  };

  const getNetworkSummary = () => {
    const networks = mockNetworks.filter(n => selectedNetworkIds.has(n.id));
    return networks.map(n => n.name).join(', ') || '-';
  };

  const getSecurityGroupSummary = () => {
    const sgs = mockSecurityGroups.filter(sg => selectedSecurityGroups.has(sg.id));
    return sgs.map(sg => sg.name).join(', ') || '-';
  };

  const getAuthSummary = () => {
    if (loginType === 'keypair') {
      const kp = mockKeyPairs.find(k => k.id === selectedKeyPairId);
      return kp ? `Key Pair: ${kp.name}` : 'Key Pair: -';
    }
    return 'Password';
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: sidebarOpen ? '200px' : '0px' }}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
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
            onSidebarToggle={openSidebar}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Proj-1', href: '/project' },
                  { label: 'Instances List', href: '/compute/instances' },
                  { label: 'Create Instance' },
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
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Page Title */}
              <h1 className="text-[18px] font-semibold leading-7 text-[var(--color-text-default)]">
                Create Instance
              </h1>

              {/* Content Area */}
              <HStack gap={6} align="start" className="w-full">
                {/* Left Column - Form Sections */}
                <VStack gap={4} className="flex-1">
                  {/* Templates Section */}
                  {sectionStatus.templates === 'pre' && (
                    <PreSection title={SECTION_LABELS.templates} />
                  )}
                  {sectionStatus.templates === 'active' && (
                    <TemplatesSection
                      templates={mockTemplates}
                      selectedId={selectedTemplateId}
                      onSelect={setSelectedTemplateId}
                      onSkip={() => handleSkip('templates')}
                      onNext={() => handleNext('templates')}
                    />
                  )}
                  {sectionStatus.templates === 'done' && (
                    <DoneSection title={SECTION_LABELS.templates} onEdit={() => handleEdit('templates')}>
                      <DoneSectionRow label="Template" value={getTemplateSummary() || 'None selected'} />
                    </DoneSection>
                  )}
                  {sectionStatus.templates === 'skipped' && (
                    <SkippedSection title={SECTION_LABELS.templates} onEdit={() => handleEdit('templates')} />
                  )}

                  {/* Basic Information Section */}
                  {sectionStatus['basic-info'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'active' && (
                    <BasicInformationSection
                      instanceName={instanceName}
                      onInstanceNameChange={setInstanceName}
                      availabilityZone={availabilityZone}
                      onAvailabilityZoneChange={setAvailabilityZone}
                      description={description}
                      onDescriptionChange={setDescription}
                      labels={labels}
                      onLabelsChange={setLabels}
                      onNext={() => handleNext('basic-info')}
                    />
                  )}
                  {sectionStatus['basic-info'] === 'done' && (
                    <DoneSection title={SECTION_LABELS['basic-info']} onEdit={() => handleEdit('basic-info')}>
                      <DoneSectionRow label="Instance Name" value={instanceName || '-'} />
                      <DoneSectionRow label="AZ (Availability Zone)" value={availabilityZone} />
                      <DoneSectionRow label="Description" value={description || '-'} />
                    </DoneSection>
                  )}

                  {/* Image Section */}
                  {sectionStatus.image === 'pre' && (
                    <PreSection title={SECTION_LABELS.image} />
                  )}
                  {sectionStatus.image === 'active' && (
                    <ImageSection
                      selectedImageId={selectedImageId}
                      onSelectImage={setSelectedImageId}
                      onNext={() => handleNext('image')}
                    />
                  )}
                  {sectionStatus.image === 'done' && (
                    <DoneSection title={SECTION_LABELS.image} onEdit={() => handleEdit('image')}>
                      <DoneSectionRow label="Image" value={getImageSummary() || '-'} />
                      <DoneSectionRow label="System Disk" value={getStorageSummary()} />
                    </DoneSection>
                  )}

                  {/* Flavor Section */}
                  {sectionStatus.flavor === 'pre' && (
                    <PreSection title={SECTION_LABELS.flavor} />
                  )}
                  {sectionStatus.flavor === 'active' && (
                    <FlavorSection
                      selectedFlavorId={selectedFlavorId}
                      onSelectFlavor={setSelectedFlavorId}
                      onNext={() => handleNext('flavor')}
                    />
                  )}
                  {sectionStatus.flavor === 'done' && (
                    <DoneSection title={SECTION_LABELS.flavor} onEdit={() => handleEdit('flavor')}>
                      <DoneSectionRow label="Flavor" value={getFlavorSummary() || '-'} />
                    </DoneSection>
                  )}

                  {/* Network Section */}
                  {sectionStatus.network === 'pre' && (
                    <PreSection title={SECTION_LABELS.network} />
                  )}
                  {sectionStatus.network === 'active' && (
                    <NetworkSection onNext={() => handleNext('network')} />
                  )}
                  {sectionStatus.network === 'done' && (
                    <DoneSection title={SECTION_LABELS.network} onEdit={() => handleEdit('network')}>
                      <DoneSectionRow label="Network" value={getNetworkSummary()} />
                      <DoneSectionRow label="Security Groups" value={getSecurityGroupSummary()} />
                    </DoneSection>
                  )}

                  {/* Authentication Section */}
                  {sectionStatus.authentication === 'pre' && (
                    <PreSection title={SECTION_LABELS.authentication} />
                  )}
                  {sectionStatus.authentication === 'active' && (
                    <AuthenticationSection onNext={() => handleNext('authentication')} />
                  )}
                  {sectionStatus.authentication === 'done' && (
                    <DoneSection title={SECTION_LABELS.authentication} onEdit={() => handleEdit('authentication')}>
                      <DoneSectionRow label="Login Type" value={getAuthSummary()} />
                    </DoneSection>
                  )}

                  {/* Advanced Section */}
                  {sectionStatus.advanced === 'pre' && (
                    <PreSection title={SECTION_LABELS.advanced} />
                  )}
                  {sectionStatus.advanced === 'active' && (
                    <AdvancedSection onNext={() => handleNext('advanced')} />
                  )}
                  {sectionStatus.advanced === 'done' && (
                    <DoneSection title={SECTION_LABELS.advanced} onEdit={() => handleEdit('advanced')}>
                      <DoneSectionRow 
                        label="Server Group" 
                        value={selectedServerGroupId ? mockServerGroups.find(sg => sg.id === selectedServerGroupId)?.name : '-'} 
                      />
                      <DoneSectionRow 
                        label="User Data" 
                        value={userData ? 'Configured' : '-'} 
                      />
                    </DoneSection>
                  )}
                </VStack>

                {/* Right Column - Quota Sidebar */}
                <QuotaSidebar
                  numberOfInstances={numberOfInstances}
                  onNumberOfInstancesChange={setNumberOfInstances}
                  quota={mockQuota}
                  onCancel={handleCancel}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateInstancePage;
