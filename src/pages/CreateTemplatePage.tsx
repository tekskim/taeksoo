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
  IconUbuntu,
  IconGrid,
  IconRocky,
  InlineMessage,
  SelectionIndicator,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconAlertCircle,
  IconBell,
  IconCaretDownFilled,
  IconCaretRightFilled,
  IconCheck,
  IconDots,
  IconDownload,
  IconEdit,
  IconExclamationMark,
  IconExternalLink,
  IconPlus,
  IconProgress,
  IconStar,
  IconStarFilled,
  IconUpload,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'template-info' | 'basic-info' | 'image' | 'flavor' | 'network' | 'advanced';
type SectionState = 'pre' | 'active' | 'done' | 'skipped' | 'writing';

interface SectionStatus {
  'template-info': SectionState;
  'basic-info': SectionState;
  image: SectionState;
  flavor: SectionState;
  network: SectionState;
  advanced: SectionState;
}

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'template-info': 'Template Information',
  'basic-info': 'Basic information',
  image: 'Source',
  flavor: 'Flavor',
  network: 'Network',
  advanced: 'Advanced',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'template-info',
  'basic-info',
  'image',
  'flavor',
  'network',
  'advanced',
];

/* ----------------------------------------
   Mock Data
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

interface FlavorRow {
  id: string;
  name: string;
  vCPU: number;
  ram: string;
  disk: string;
  isPublic: boolean;
  hasWarning?: boolean;
}

interface NetworkRow {
  id: string;
  name: string;
  subnetCidr: string;
  isExternal: boolean;
  shared: 'Public' | 'Private';
  status: 'active' | 'error' | 'building';
  category: 'current' | 'shared' | 'external';
}

interface SecurityGroupRow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface PortRow {
  id: string;
  name: string;
  ownedNetwork: string;
  ownedNetworkId: string;
  fixedIP: string;
  macAddress: string;
  status: 'active' | 'error' | 'building';
}

interface VirtualLAN {
  id: string;
  network: string;
  subnet: string;
  autoAssign: string;
}

interface KeyPairRow {
  id: string;
  name: string;
  fingerprint: string;
  createdAt: string;
}

interface ServerGroupRow {
  id: string;
  name: string;
  policy: string;
  members: number;
}

const mockImages: ImageRow[] = [
  { id: 'e920j30d', status: 'active', name: 'ubuntu-24.04-tk-base', version: '24.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j31d', status: 'active', name: 'ubuntu-24.04-tk-base', version: '24.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j32d', status: 'active', name: 'ubuntu-24.04-tk-base', version: '24.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j35d', status: 'active', name: 'ubuntu-22.04-tk-base', version: '22.04', size: '650.12 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j37d', status: 'active', name: 'windows-server-2022', version: '2022', size: '4.5 GiB', minDisk: '40.00 GiB', minRam: '2 GiB', access: 'Public', os: 'windows' },
  { id: 'e920j39d', status: 'active', name: 'rocky-9.3-tk-base', version: '9.3', size: '890.23 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'rocky' },
];

const mockFlavors: FlavorRow[] = [
  { id: '45hgf456', name: 't2.micro', vCPU: 1, ram: '1GiB', disk: '8GiB', isPublic: true },
  { id: '17kfj123', name: 'm5.large', vCPU: 2, ram: '8GiB', disk: '50GiB', isPublic: true },
  { id: '23hgf234', name: 'r5.2xlarge', vCPU: 8, ram: '64GiB', disk: '200GiB', isPublic: true },
  { id: '12abc345', name: 'g4dn.xlarge', vCPU: 4, ram: '16GiB', disk: '125GiB', isPublic: true },
  { id: '34ghi567', name: 'x1e.xlarge', vCPU: 4, ram: '122GiB', disk: '120GiB', isPublic: true },
  { id: '56jkl890', name: 'c5.2xlarge', vCPU: 8, ram: '16GiB', disk: '50GiB', isPublic: true },
  { id: '78mno123', name: 'i3.xlarge', vCPU: 4, ram: '30.5GiB', disk: '950GiB', isPublic: true },
  { id: '90pqr456', name: 'r5.xlarge', vCPU: 4, ram: '32GiB', disk: '100GiB', isPublic: true },
  { id: '12stu789', name: 'm5.xlarge', vCPU: 4, ram: '16GiB', disk: '100GiB', isPublic: true },
  { id: '34vwx012', name: 't3.large', vCPU: 2, ram: '8GiB', disk: '30GiB', isPublic: true, hasWarning: true },
  { id: '56yza345', name: 'c5.xlarge', vCPU: 4, ram: '8GiB', disk: '50GiB', isPublic: true },
  { id: '78bcd678', name: 'p3.2xlarge', vCPU: 8, ram: '61GiB', disk: '500GiB', isPublic: false },
];

const mockNetworks: NetworkRow[] = [
  { id: 'd32059d1', name: 'network', subnetCidr: '192.168.10.0/24', isExternal: true, shared: 'Public', status: 'active', category: 'current' },
  { id: 'd32059d2', name: 'network', subnetCidr: '192.168.10.0/24', isExternal: true, shared: 'Public', status: 'active', category: 'current' },
  { id: 'd32059d3', name: 'network', subnetCidr: '192.168.10.0/24', isExternal: true, shared: 'Public', status: 'active', category: 'current' },
  { id: 'd32059d4', name: 'network', subnetCidr: '192.168.10.0/24', isExternal: true, shared: 'Public', status: 'active', category: 'current' },
  { id: 'd32059d5', name: 'network', subnetCidr: '192.168.10.0/24', isExternal: true, shared: 'Public', status: 'building', category: 'current' },
  { id: 'd32059d6', name: 'shared-net-1', subnetCidr: '10.0.1.0/24', isExternal: false, shared: 'Public', status: 'active', category: 'shared' },
  { id: 'd32059d7', name: 'shared-net-2', subnetCidr: '10.0.2.0/24', isExternal: false, shared: 'Public', status: 'active', category: 'shared' },
  { id: 'd32059d8', name: 'external-net-1', subnetCidr: '203.0.113.0/24', isExternal: true, shared: 'Public', status: 'active', category: 'external' },
  { id: 'd32059d9', name: 'external-net-2', subnetCidr: '198.51.100.0/24', isExternal: true, shared: 'Private', status: 'active', category: 'external' },
];

const mockSecurityGroups: SecurityGroupRow[] = [
  { id: 'sg1', name: 'suite-default', description: 'test only', createdAt: '2025-09-01' },
  { id: 'sg2', name: 'suite-default', description: 'test only', createdAt: '2025-09-01' },
  { id: 'sg3', name: 'suite-default', description: 'test only', createdAt: '2025-09-01' },
  { id: 'sg4', name: 'suite-default', description: 'test only', createdAt: '2025-09-01' },
  { id: 'sg5', name: 'suite-default', description: 'test only', createdAt: '2025-09-01' },
];

const mockPorts: PortRow[] = [
  { id: 'port1', name: 'port', ownedNetwork: 'network', ownedNetworkId: 'd32059d1', fixedIP: '10.76.0.135', macAddress: '10.76.0.135', status: 'active' },
  { id: 'port2', name: 'port', ownedNetwork: 'network', ownedNetworkId: 'd32059d2', fixedIP: '10.76.0.135', macAddress: '10.76.0.135', status: 'active' },
  { id: 'port3', name: 'port', ownedNetwork: 'network', ownedNetworkId: 'd32059d3', fixedIP: '10.76.0.135', macAddress: '10.76.0.135', status: 'active' },
  { id: 'port4', name: 'port', ownedNetwork: 'network', ownedNetworkId: 'd32059d4', fixedIP: '10.76.0.135', macAddress: '10.76.0.135', status: 'active' },
  { id: 'port5', name: 'port', ownedNetwork: 'network', ownedNetworkId: 'd32059d5', fixedIP: '10.76.0.135', macAddress: '10.76.0.155', status: 'error' },
];

const mockKeyPairs: KeyPairRow[] = [
  { id: 'kp1', name: 'dev-keypair', fingerprint: 'a1:b2:c3:d4:e5', createdAt: '2025-01-01' },
  { id: 'kp2', name: 'prod-keypair', fingerprint: 'f6:g7:h8:i9:j0', createdAt: '2025-01-15' },
  { id: 'kp3', name: 'staging-keypair', fingerprint: 'k1:l2:m3:n4:o5', createdAt: '2025-02-01' },
];

const mockServerGroups: ServerGroupRow[] = [
  { id: 'sgrp1', name: 'web-affinity', policy: 'affinity', members: 3 },
  { id: 'sgrp2', name: 'db-anti-affinity', policy: 'anti-affinity', members: 2 },
];

const storageTypeOptions = [
  { value: '_DEFAULT_', label: '_DEFAULT_' },
  { value: 'ssd', label: 'SSD' },
  { value: 'hdd', label: 'HDD' },
];

const availabilityZoneOptions = [
  { value: 'nova', label: 'nova (Default)' },
  { value: 'az-1', label: 'az-1' },
  { value: 'az-2', label: 'az-2' },
];

/* ----------------------------------------
   SectionStatusIcon Component
   ---------------------------------------- */

function SectionStatusIcon({ status }: { status: SectionState }) {
  if (status === 'done') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
        <IconCheck size={10} stroke={2.5} className="text-white" />
      </div>
    );
  }
  
  if (status === 'active') {
    return (
      <div className="w-4 h-4 shrink-0">
        <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-subtle)] animate-spin" />
      </div>
    );
  }
  
  if (status === 'writing') {
    return null;
  }
  
  if (status === 'pre') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />
    );
  }
  
  return (
    <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)] flex items-center justify-center">
      <div className="w-2 h-0.5 bg-[var(--color-text-subtle)]" />
    </div>
  );
}

/* ----------------------------------------
   TemplateSidebar Component
   ---------------------------------------- */

interface TemplateSidebarProps {
  onCancel: () => void;
  sectionStatus: SectionStatus;
}

function TemplateSidebar({ onCancel, sectionStatus }: TemplateSidebarProps) {
  const isAllCompleted = SECTION_ORDER.every(
    (section) => sectionStatus[section] === 'done' || sectionStatus[section] === 'skipped'
  );

  return (
    <div className="w-[312px] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Summary Card */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
              Summary
            </h5>
            <div className="flex flex-col">
              {SECTION_ORDER.map((sectionKey) => {
                const isWriting = sectionStatus[sectionKey] === 'writing';
                
                return (
                  <div
                    key={sectionKey}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-[12px] leading-5 text-[var(--color-text-default)]">
                      {SECTION_LABELS[sectionKey]}
                    </span>
                    {isWriting ? (
                      <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
                    ) : (
                      <SectionStatusIcon status={sectionStatus[sectionKey]} />
                    )}
                  </div>
                );
              })}
            </div>
          </VStack>
        </div>

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-[80px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!isAllCompleted}
            className="flex-1"
          >
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   PreSection Component
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
          {title}
        </h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component
   ---------------------------------------- */

interface WritingSectionProps {
  title: string;
}

function WritingSection({ title }: WritingSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center justify-between">
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
          {title}
        </h5>
        <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   SkippedSection Component
   ---------------------------------------- */

interface SkippedSectionProps {
  title: string;
  onEdit: () => void;
}

function SkippedSection({ title, onEdit }: SkippedSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="flex items-center justify-between h-8">
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
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
   DoneSection Component
   ---------------------------------------- */

interface DoneSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function DoneSection({ title, onEdit, children }: DoneSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header 
        title={title} 
        showDivider
        actions={
          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>
        {children}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   TemplateInformationSection Component
   ---------------------------------------- */

interface TemplateInformationSectionProps {
  templateName: string;
  onTemplateNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  isFavorite: boolean;
  onIsFavoriteChange: (value: boolean) => void;
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function TemplateInformationSection({
  templateName,
  onTemplateNameChange,
  description,
  onDescriptionChange,
  isFavorite,
  onIsFavoriteChange,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: TemplateInformationSectionProps) {
  const [templateNameError, setTemplateNameError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    onTemplateNameChange(value);
    if (value.trim()) setTemplateNameError(null);
  };

  const handleNextClick = () => {
    if (!templateName.trim()) {
      setTemplateNameError('Please enter a template name.');
      return;
    }
    setTemplateNameError(null);
    onNext();
  };

  const handleEditDone = () => {
    if (!templateName.trim()) {
      setTemplateNameError('Please enter a template name.');
      return;
    }
    setTemplateNameError(null);
    onEditDone?.();
  };

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header 
        title="Template Information" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content gap={6} className="pt-2">
        {/* Template name */}
        <VStack gap={2}>
          <span className="text-[length:var(--font-size-14)] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
            Template name <span className="text-[var(--color-state-danger)]">*</span>
          </span>
          <VStack gap={1}>
            <Input
              placeholder="Enter instance template name"
              value={templateName}
              onChange={(e) => handleNameChange(e.target.value)}
              fullWidth
              error={!!templateNameError}
            />
            {templateNameError && (
              <span className="text-[11px] leading-[var(--line-height-16)] text-[var(--color-state-danger)]">
                {templateNameError}
              </span>
            )}
          </VStack>
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters.
          </span>
        </VStack>

        {/* Description */}
        <VStack gap={2}>
          <span className="text-[length:var(--font-size-14)] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
            Description
          </span>
          <Input
            placeholder="Enter description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            fullWidth
          />
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters.
          </span>
        </VStack>

        {/* Favorite */}
        <VStack gap={2}>
          <span className="text-[length:var(--font-size-14)] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
            Favorite
          </span>
          <Checkbox
            label="Mark as Favorite"
            checked={isFavorite}
            onChange={() => onIsFavoriteChange(!isFavorite)}
          />
        </VStack>

        {!isEditing && (
          <HStack justify="end">
            <Button variant="primary" onClick={handleNextClick}>
              Next
            </Button>
          </HStack>
        )}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   BasicInformationSection Component
   ---------------------------------------- */

const azOptions = [
  { value: 'nova', label: 'nova (Default)' },
  { value: 'nova-az1', label: 'nova-az1' },
  { value: 'nova-az2', label: 'nova-az2' },
];

interface BasicInformationSectionProps {
  availabilityZone: string;
  onAvailabilityZoneChange: (value: string) => void;
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function BasicInformationSection({
  availabilityZone,
  onAvailabilityZoneChange,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: BasicInformationSectionProps) {
  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header 
        title="Basic information" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={onEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content gap={6} className="pt-2">
        {/* AZ (Availability zone) */}
        <VStack gap={2}>
          <span className="text-[length:var(--font-size-14)] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
            AZ (Availability zone)
          </span>
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
            Select the availability zone for the instance.
          </span>
          <Select
            options={azOptions}
            value={availabilityZone}
            onChange={onAvailabilityZoneChange}
            placeholder="Select AZ"
            fullWidth
          />
        </VStack>

        {!isEditing && (
          <HStack justify="end">
            <Button variant="primary" onClick={onNext}>
              Next
            </Button>
          </HStack>
        )}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   ImageSection Component
   ---------------------------------------- */

interface ImageSectionProps {
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  storageType: string;
  onStorageTypeChange: (value: string) => void;
  storageSize: number;
  onStorageSizeChange: (value: number) => void;
  deleteWithInstance: boolean;
  onDeleteWithInstanceChange: (value: boolean) => void;
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function ImageSection({
  selectedImageId,
  onSelectImage,
  storageType,
  onStorageTypeChange,
  storageSize,
  onStorageSizeChange,
  deleteWithInstance,
  onDeleteWithInstanceChange,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: ImageSectionProps) {
  const [sourceTab, setSourceTab] = useState('image');
  const [osFilter, setOsFilter] = useState<'ubuntu' | 'windows' | 'rocky' | 'other'>('other');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [createSystemDisk, setCreateSystemDisk] = useState(true);
  const [_dataDisks, setDataDisks] = useState<{ id: string; type: string; size: number }[]>([]);
  const itemsPerPage = 5;

  // Validation error
  const [imageError, setImageError] = useState<string | null>(null);

  const handleSelectImage = (id: string) => {
    onSelectImage(id);
    setImageError(null);
  };

  const handleNextClick = () => {
    if (!selectedImageId) {
      setImageError('Please select an image.');
      return;
    }
    setImageError(null);
    onNext();
  };

  const handleEditDone = () => {
    if (!selectedImageId) {
      setImageError('Please select an image.');
      return;
    }
    setImageError(null);
    onEditDone?.();
  };

  const filteredImages = mockImages.filter(img => {
    const matchesOs = osFilter === 'other' || img.os === osFilter;
    const matchesSearch = searchQuery === '' || 
      img.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOs && matchesSearch;
  });

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage) || 1;
  const paginatedImages = filteredImages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Get selected image info
  const selectedImage = mockImages.find(img => img.id === selectedImageId);

  // Add data disk handler
  const handleAddDataDisk = () => {
    setDataDisks(prev => [...prev, { id: `dd-${Date.now()}`, type: '_DEFAULT_', size: 10 }]);
  };

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
            onChange={() => handleSelectImage(row.id)}
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
            <a href="#" className="text-[var(--color-action-primary)] hover:underline text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium">
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

  // OS filter chip style - matches Figma design with container
  const osChipStyle = (active: boolean) => `
    inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] cursor-pointer text-[12px] font-medium transition-colors
    ${active 
      ? 'bg-[var(--color-surface-default)] text-[var(--color-text-default)] shadow-sm' 
      : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]'
    }
  `;

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header 
        title="Source" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content>
        <VStack gap={4} className="pt-2">
          {/* Start Source */}
          <VStack gap={3}>
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              Start source
            </span>
            <span className="text-[12px] text-[var(--color-text-subtle)]">
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

            {/* OS Filter Chips Container - Only for Image tab */}
            {sourceTab === 'image' && (
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-1 inline-flex w-fit">
                <button 
                  className={osChipStyle(osFilter === 'other')}
                  onClick={() => { setOsFilter('other'); setCurrentPage(1); }}
                >
                  <IconDots size={14} />
                  <span>Others</span>
                </button>
                <button 
                  className={osChipStyle(osFilter === 'ubuntu')}
                  onClick={() => { setOsFilter('ubuntu'); setCurrentPage(1); }}
                >
                  <IconUbuntu size={14} />
                  <span>Ubuntu</span>
                </button>
                <button 
                  className={osChipStyle(osFilter === 'windows')}
                  onClick={() => { setOsFilter('windows'); setCurrentPage(1); }}
                >
                  <IconGrid size={14} />
                  <span>Windows</span>
                </button>
                <button 
                  className={osChipStyle(osFilter === 'rocky')}
                  onClick={() => { setOsFilter('rocky'); setCurrentPage(1); }}
                >
                  <IconRocky size={14} />
                  <span>Rocky</span>
                </button>
              </div>
            )}

            {/* Search */}
            <SearchInput
              placeholder="Search image by attributes"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
              size="sm"
              className="w-[280px]"
            />

            {/* Pagination - Above Table */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredImages.length}
              itemsPerPage={itemsPerPage}
            />

            {/* Image Table */}
            <Table
              columns={imageColumns}
              data={paginatedImages}
              onRowClick={(row) => handleSelectImage(row.id)}
            />

            {/* Selection Indicator for Image */}
            <SelectionIndicator
              className="mt-2"
              selectedItems={selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []}
              onRemove={() => onSelectImage('')}
            />
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* System disk Section */}
          <VStack gap={3}>
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              System disk
            </span>
            <span className="text-[12px] text-[var(--color-text-subtle)]">
              Configure whether to create a system disk for booting.
            </span>
            
            {/* Toggle */}
            <Toggle
              checked={createSystemDisk}
              onChange={setCreateSystemDisk}
              label="Create a new system disk"
            />

            {/* Storage Type Row - Bordered Container */}
            {createSystemDisk && (
              <div className="w-full bg-white border border-[var(--color-border-default)] rounded-[6px] px-4 py-2">
                <HStack gap={6} align="center">
                  <HStack gap={1.5} align="center">
                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">Type</span>
                    <Select
                      options={storageTypeOptions}
                      value={storageType}
                      onChange={onStorageTypeChange}
                      className="w-[120px]"
                    />
                  </HStack>
                  <HStack gap={1.5} align="center">
                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">Size</span>
                    <NumberInput
                      value={storageSize}
                      onChange={onStorageSizeChange}
                      min={10}
                      max={1000}
                      className="w-[80px]"
                    />
                    <span className="text-[12px] text-[var(--color-text-default)]">GiB</span>
                  </HStack>
                  <Checkbox
                    label="Deleted with the instance"
                    checked={deleteWithInstance}
                    onChange={() => onDeleteWithInstanceChange(!deleteWithInstance)}
                  />
                </HStack>
              </div>
            )}
          </VStack>

          {/* Data disk Section */}
          <VStack gap={3} align="start">
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              Data disk
            </span>
            <span className="text-[12px] text-[var(--color-text-subtle)]">
              Attach additional volumes for data storage.
            </span>
            
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<IconPlus size={12} />}
              onClick={handleAddDataDisk}
            >
              Add Data disk
            </Button>
          </VStack>

          {/* Error Message */}
          {imageError && (
            <div className="mt-2">
              <InlineMessage variant="error">
                {imageError}
              </InlineMessage>
            </div>
          )}

          {/* Next Button */}
          {!isEditing && (
            <HStack justify="end" className="w-full">
              <Button variant="primary" onClick={handleNextClick}>
                Next
              </Button>
            </HStack>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   FlavorSection Component
   ---------------------------------------- */

interface FlavorSectionProps {
  selectedFlavorId: string | null;
  onSelectFlavor: (id: string) => void;
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function FlavorSection({
  selectedFlavorId,
  onSelectFlavor,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: FlavorSectionProps) {
  const [flavorTab, setFlavorTab] = useState('cpu');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Validation error
  const [flavorError, setFlavorError] = useState<string | null>(null);

  const handleSelectFlavor = (id: string) => {
    onSelectFlavor(id);
    setFlavorError(null);
  };

  const handleNextClick = () => {
    if (!selectedFlavorId) {
      setFlavorError('Please select a flavor.');
      return;
    }
    setFlavorError(null);
    onNext();
  };

  const handleEditDone = () => {
    if (!selectedFlavorId) {
      setFlavorError('Please select a flavor.');
      return;
    }
    setFlavorError(null);
    onEditDone?.();
  };

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

  // Get selected flavor for summary
  const selectedFlavor = mockFlavors.find(f => f.id === selectedFlavorId);

  // Table columns matching Figma design
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
            onChange={() => handleSelectFlavor(row.id)}
            disabled={row.hasWarning}
          />
        </div>
      ),
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value, row) => (
        <VStack gap={0} align="start">
          <HStack gap={1.5} align="center">
            <a href="#" className="text-[var(--color-action-primary)] hover:underline text-[12px] leading-[16px] font-medium" onClick={(e) => e.preventDefault()}>
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            {row.hasWarning && (
              <IconAlertCircle size={16} className="text-[var(--color-state-danger)]" />
            )}
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)] leading-[16px]">ID: {row.id}</span>
        </VStack>
      ),
    },
    { key: 'vCPU', label: 'vCPU', sortable: true },
    { key: 'ram', label: 'RAM', sortable: true },
    { key: 'disk', label: 'Root disk', sortable: true },
    { 
      key: 'isPublic', 
      label: 'Public',
      render: (value) => value ? 'On' : 'Off',
    },
  ];

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header 
        title="Flavor" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content>
        <VStack gap={6} className="pt-2">
          {/* Flavors Label & Description */}
          <VStack gap={2} align="start">
            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Flavors<span className="ml-[3px] text-[var(--color-state-danger)]">*</span>
            </span>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
              Select a flavor from the list to use for the instance.
            </span>
          </VStack>

          {/* Flavor Type Tabs */}
          <VStack gap={4} align="stretch">
            <Tabs value={flavorTab} onChange={setFlavorTab} variant="underline" size="sm">
              <TabList>
                <Tab value="cpu">CPU</Tab>
                <Tab value="gpu">GPU</Tab>
                <Tab value="npu">NPU</Tab>
              </TabList>
            </Tabs>

            {/* Search & Download */}
            <HStack gap={1} align="center">
              <SearchInput
                placeholder="Search flavors by attributes"
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
                size="sm"
                className="w-[280px]"
              />
              <button 
                className="flex items-center justify-center w-[28px] h-[28px] border border-[var(--color-border-strong)] rounded-[6px] bg-white hover:bg-[var(--color-surface-subtle)]"
                title="Download"
              >
                <IconDownload size={12} stroke={1.5} />
              </button>
            </HStack>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredFlavors.length}
              onPageChange={setCurrentPage}
            />

            {/* Flavor Table */}
            <Table
              columns={flavorColumns}
              data={paginatedFlavors}
              rowKey="id"
              onRowClick={(row) => !row.hasWarning && handleSelectFlavor(row.id)}
            />

            {/* Error Message or Selection Indicator for Flavor */}
            {flavorError && !selectedFlavor ? (
              <div className="mt-2">
                <InlineMessage variant="error">
                  {flavorError}
                </InlineMessage>
              </div>
            ) : (
              <SelectionIndicator
                className="mt-2"
                selectedItems={selectedFlavor ? [{
                  id: selectedFlavor.id,
                  label: `${selectedFlavor.name} (${selectedFlavor.vCPU} vCPU, ${selectedFlavor.ram}, ${selectedFlavor.disk})`
                }] : []}
                onRemove={() => onSelectFlavor('')}
              />
            )}
          </VStack>

          {/* Next Button - hidden in edit mode */}
          {!isEditing && (
            <HStack justify="end">
              <Button variant="primary" onClick={handleNextClick}>
                Next
              </Button>
            </HStack>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   NetworkSection Component
   ---------------------------------------- */

interface NetworkSectionProps {
  selectedNetworkIds: Set<string>;
  onNetworkToggle: (id: string) => void;
  selectedSecurityGroups: Set<string>;
  onSecurityGroupToggle: (id: string) => void;
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function NetworkSection({
  selectedNetworkIds,
  onNetworkToggle,
  selectedSecurityGroups,
  onSecurityGroupToggle,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: NetworkSectionProps) {
  // Validation errors
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [sgError, setSgError] = useState<string | null>(null);

  const handleNetworkToggle = (id: string) => {
    onNetworkToggle(id);
    setNetworkError(null);
  };

  const handleSecurityGroupToggle = (id: string) => {
    onSecurityGroupToggle(id);
    setSgError(null);
  };

  const handleNextClick = () => {
    let hasError = false;
    
    if (selectedNetworkIds.size === 0) {
      setNetworkError('Please select at least one network.');
      hasError = true;
    } else {
      setNetworkError(null);
    }
    
    if (selectedSecurityGroups.size === 0) {
      setSgError('Please select at least one security group.');
      hasError = true;
    } else {
      setSgError(null);
    }
    
    if (!hasError) {
      onNext();
    }
  };

  const handleEditDone = () => {
    let hasError = false;
    
    if (selectedNetworkIds.size === 0) {
      setNetworkError('Please select at least one network.');
      hasError = true;
    } else {
      setNetworkError(null);
    }
    
    if (selectedSecurityGroups.size === 0) {
      setSgError('Please select at least one security group.');
      hasError = true;
    } else {
      setSgError(null);
    }
    
    if (!hasError) {
      onEditDone?.();
    }
  };

  // Network state
  const [networkTab, setNetworkTab] = useState('current');
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);
  
  // Security group state
  const [sgSearch, setSgSearch] = useState('');
  const [sgPage, setSgPage] = useState(1);
  
  // Virtual LAN state
  const [virtualLANs, setVirtualLANs] = useState<VirtualLAN[]>([
    { id: 'vlan1', network: 'network', subnet: 'subnet', autoAssign: 'Auto-assign' }
  ]);
  
  // Port section state
  const [portExpanded, setPortExpanded] = useState(true);
  const [portSearch, setPortSearch] = useState('');
  const [portPage, setPortPage] = useState(1);
  const [selectedPortIds, setSelectedPortIds] = useState<Set<string>>(new Set());

  const itemsPerPage = 5;

  // Filter networks based on tab and search
  const filteredNetworks = mockNetworks.filter(n => {
    const matchesTab = n.category === networkTab;
    const matchesSearch = networkSearch === '' || 
      n.name.toLowerCase().includes(networkSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const networkTotalPages = Math.ceil(filteredNetworks.length / itemsPerPage) || 1;
  const paginatedNetworks = filteredNetworks.slice(
    (networkPage - 1) * itemsPerPage,
    networkPage * itemsPerPage
  );

  // Filter security groups
  const filteredSGs = mockSecurityGroups.filter(sg => {
    return sgSearch === '' || 
      sg.name.toLowerCase().includes(sgSearch.toLowerCase());
  });

  const sgTotalPages = Math.ceil(filteredSGs.length / itemsPerPage) || 1;
  const paginatedSGs = filteredSGs.slice(
    (sgPage - 1) * itemsPerPage,
    sgPage * itemsPerPage
  );

  // Filter ports
  const filteredPorts = mockPorts.filter(p => {
    return portSearch === '' || 
      p.name.toLowerCase().includes(portSearch.toLowerCase());
  });

  const portTotalPages = Math.ceil(filteredPorts.length / itemsPerPage) || 1;
  const paginatedPorts = filteredPorts.slice(
    (portPage - 1) * itemsPerPage,
    portPage * itemsPerPage
  );

  // Get selected items for chips
  const selectedNetworks = mockNetworks.filter(n => selectedNetworkIds.has(n.id));
  const selectedSGs = mockSecurityGroups.filter(sg => selectedSecurityGroups.has(sg.id));
  const selectedPorts = mockPorts.filter(p => selectedPortIds.has(p.id));

  // Virtual LAN handlers
  const addVirtualLAN = () => {
    setVirtualLANs([...virtualLANs, {
      id: `vlan${Date.now()}`,
      network: 'network',
      subnet: 'subnet',
      autoAssign: 'Auto-assign'
    }]);
  };

  const removeVirtualLAN = (id: string) => {
    setVirtualLANs(virtualLANs.filter(v => v.id !== id));
  };

  // Port toggle handler
  const handlePortToggle = (id: string) => {
    const newSet = new Set(selectedPortIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedPortIds(newSet);
  };

  // Network table columns
  const networkColumns: TableColumn<NetworkRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedNetworkIds.has(row.id)}
            onChange={() => handleNetworkToggle(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      render: (_, row) => <StatusIndicator status={row.status} />,
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value, row) => (
        <VStack gap={0} align="start">
          <HStack gap={1.5} align="center">
            <a href="#" className="text-[var(--color-action-primary)] hover:underline text-[12px] leading-[16px] font-medium" onClick={(e) => e.preventDefault()}>
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)] leading-[16px]">ID: {row.id}</span>
        </VStack>
      ),
    },
    { key: 'subnetCidr', label: 'Subnet CIDR', sortable: true },
    { 
      key: 'isExternal', 
      label: 'External',
      render: (value) => value ? 'Yes' : 'No',
    },
    { key: 'shared', label: 'Shared' },
  ];

  // Security group table columns
  const sgColumns: TableColumn<SecurityGroupRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedSecurityGroups.has(row.id)}
            onChange={() => handleSecurityGroupToggle(row.id)}
          />
        </div>
      ),
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value, row) => (
        <VStack gap={0} align="start">
          <HStack gap={1.5} align="center">
            <a href="#" className="text-[var(--color-action-primary)] hover:underline text-[12px] leading-[16px] font-medium" onClick={(e) => e.preventDefault()}>
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)] leading-[16px]">ID: {row.id}</span>
        </VStack>
      ),
    },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'createdAt', label: 'Created at', sortable: true },
  ];

  // Port table columns
  const portColumns: TableColumn<PortRow>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedPortIds.has(row.id)}
            onChange={() => handlePortToggle(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      render: (_, row) => <StatusIndicator status={row.status} />,
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value, row) => (
        <VStack gap={0} align="start">
          <HStack gap={1.5} align="center">
            <a href="#" className="text-[var(--color-action-primary)] hover:underline text-[12px] leading-[16px] font-medium" onClick={(e) => e.preventDefault()}>
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            {row.status === 'error' && <IconAlertCircle size={12} className="text-[var(--color-state-danger)]" />}
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)] leading-[16px]">ID: {row.id}</span>
        </VStack>
      ),
    },
    { 
      key: 'ownedNetwork', 
      label: 'Owned network', 
      sortable: true,
      render: (value, row) => (
        <VStack gap={0} align="start">
          <HStack gap={1.5} align="center">
            <a href="#" className="text-[var(--color-action-primary)] hover:underline text-[12px] leading-[16px] font-medium" onClick={(e) => e.preventDefault()}>
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)] leading-[16px]">ID: {row.ownedNetworkId}</span>
        </VStack>
      ),
    },
    { key: 'fixedIP', label: 'Fixed IP' },
    { key: 'macAddress', label: 'MAC Address' },
  ];

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header 
        title="Network" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content>
        <VStack gap={6} className="pt-2">
          {/* Networks Section */}
          <VStack gap={4} align="stretch">
            <VStack gap={2} align="start">
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                Network<span className="ml-[3px] text-[var(--color-state-danger)]">*</span>
              </span>
              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                If you select a port, selecting a network is optional. You may still add another network if required.
              </span>
            </VStack>

            {/* Network Tabs */}
            <Tabs value={networkTab} onChange={(v) => { setNetworkTab(v); setNetworkPage(1); }} variant="underline" size="sm">
              <TabList>
                <Tab value="current">Current tenant</Tab>
                <Tab value="shared">Shared</Tab>
                <Tab value="external">External</Tab>
              </TabList>
            </Tabs>

            {/* Network Search & Create Button */}
            <HStack justify="between" align="center">
              <SearchInput
                placeholder="Search networks by attributes"
                value={networkSearch}
                onChange={(e) => { setNetworkSearch(e.target.value); setNetworkPage(1); }}
                onClear={() => { setNetworkSearch(''); setNetworkPage(1); }}
                size="sm"
                className="w-[312px]"
              />
              <Button variant="secondary" size="sm" leftIcon={<IconExternalLink size={12} />}>
                Create a new network
              </Button>
            </HStack>

            {/* Network Pagination */}
            <Pagination
              currentPage={networkPage}
              totalPages={networkTotalPages}
              totalItems={filteredNetworks.length}
              onPageChange={setNetworkPage}
            />

            {/* Network Table */}
            <Table
              columns={networkColumns}
              data={paginatedNetworks}
              rowKey="id"
              onRowClick={(row) => handleNetworkToggle(row.id)}
            />

            {/* Error Message or Selection Indicator for Networks */}
            {networkError && selectedNetworks.length === 0 ? (
              <div className="mt-2">
                <InlineMessage variant="error">
                  {networkError}
                </InlineMessage>
              </div>
            ) : (
              <SelectionIndicator
                className="mt-2"
                selectedItems={selectedNetworks.map(n => ({ id: n.id, label: n.name }))}
                onRemove={(id) => handleNetworkToggle(id)}
              />
            )}
          </VStack>

          {/* Virtual LAN Section */}
          <VStack gap={4} align="stretch">
            <VStack gap={2} align="start">
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                Virtual LAN
              </span>
              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Each selected network requires at least one Virtual LAN configuration. Each VLAN represents a virtual network card (NIC) attached to the selected network.
              </span>
            </VStack>

            {/* Virtual LAN Rows */}
            {virtualLANs.map((vlan) => (
              <div key={vlan.id} className="flex items-center gap-4 px-4 py-2 bg-white border border-[var(--color-border-default)] rounded-[6px]">
                <HStack gap={4} align="center">
                  <HStack gap={1.5} align="center">
                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">Network</span>
                    <Select
                      options={[{ value: 'network', label: 'network' }]}
                      value={vlan.network}
                      onChange={() => {}}
                      className="w-[120px]"
                    />
                  </HStack>
                  <HStack gap={1.5} align="center">
                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">Subnet</span>
                    <Select
                      options={[{ value: 'subnet', label: 'subnet' }]}
                      value={vlan.subnet}
                      onChange={() => {}}
                      className="w-[120px]"
                    />
                  </HStack>
                  <Select
                    options={[{ value: 'Auto-assign', label: 'Auto-assign' }]}
                    value={vlan.autoAssign}
                    onChange={() => {}}
                    className="w-[120px]"
                  />
                </HStack>
                <button 
                  className="ml-auto p-1 hover:bg-[var(--color-surface-subtle)] rounded"
                  onClick={() => removeVirtualLAN(vlan.id)}
                >
                  <IconX size={16} className="text-[var(--color-text-subtle)]" />
                </button>
              </div>
            ))}

            {/* Add Virtual LAN Button */}
            <button
              className="flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md hover:bg-[var(--color-surface-subtle)] w-fit"
              onClick={addVirtualLAN}
            >
              <IconPlus size={12} />
              Add virtual LAN
            </button>
          </VStack>

          {/* Security groups Section */}
          <VStack gap={4} align="stretch">
            <VStack gap={2} align="start">
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                Security groups<span className="ml-[3px] text-[var(--color-state-danger)]">*</span>
              </span>
              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Security groups apply to all networks except ports with security disabled.
              </span>
            </VStack>

            {/* Security group Search & Create Button */}
            <HStack justify="between" align="center">
              <SearchInput
                placeholder="Search security groups by attributes"
                value={sgSearch}
                onChange={(e) => { setSgSearch(e.target.value); setSgPage(1); }}
                onClear={() => { setSgSearch(''); setSgPage(1); }}
                size="sm"
                className="w-[312px]"
              />
              <Button variant="secondary" size="sm" leftIcon={<IconExternalLink size={12} />}>
                Create a new security group
              </Button>
            </HStack>

            {/* Security group Pagination */}
            <Pagination
              currentPage={sgPage}
              totalPages={sgTotalPages}
              totalItems={filteredSGs.length}
              onPageChange={setSgPage}
            />

            {/* Security group Table */}
            <Table
              columns={sgColumns}
              data={paginatedSGs}
              rowKey="id"
              onRowClick={(row) => handleSecurityGroupToggle(row.id)}
            />

            {/* Error Message or Selection Indicator for Security Groups */}
            {sgError && selectedSGs.length === 0 ? (
              <div className="mt-2">
                <InlineMessage variant="error">
                  {sgError}
                </InlineMessage>
              </div>
            ) : (
              <SelectionIndicator
                className="mt-2"
                selectedItems={selectedSGs.map(sg => ({ id: sg.id, label: sg.name }))}
                onRemove={(id) => handleSecurityGroupToggle(id)}
              />
            )}
          </VStack>

          {/* Port Section (Collapsible) */}
          <VStack gap={3} align="stretch">
            <button
              className="flex items-center gap-1 text-[14px] font-medium text-[var(--color-text-default)]"
              onClick={() => setPortExpanded(!portExpanded)}
            >
              {portExpanded ? <IconCaretDownFilled size={12} /> : <IconCaretRightFilled size={12} />}
              Port
            </button>

            {portExpanded && (
              <VStack gap={3} align="stretch">
                {/* Port Search */}
                <SearchInput
                  placeholder="Search ports by attributes"
                  value={portSearch}
                  onChange={(e) => { setPortSearch(e.target.value); setPortPage(1); }}
                  onClear={() => { setPortSearch(''); setPortPage(1); }}
                  size="sm"
                  className="w-[280px]"
                />

                {/* Port Pagination */}
                <Pagination
                  currentPage={portPage}
                  totalPages={portTotalPages}
                  totalItems={filteredPorts.length}
                  onPageChange={setPortPage}
                />

                {/* Port Table */}
                <Table
                  columns={portColumns}
                  data={paginatedPorts}
                  rowKey="id"
                  onRowClick={(row) => handlePortToggle(row.id)}
                />

                {/* Selection Indicator for Ports */}
                <SelectionIndicator
                  className="mt-2"
                  selectedItems={selectedPorts.map(p => ({ id: p.id, label: p.id }))}
                  onRemove={(id) => handlePortToggle(id)}
                />
              </VStack>
            )}
          </VStack>

          {/* Next Button - hidden in edit mode */}
          {!isEditing && (
            <HStack justify="end">
              <Button variant="primary" onClick={handleNextClick}>
                Next
              </Button>
            </HStack>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   AuthenticationSection Component
   ---------------------------------------- */

interface AuthenticationSectionProps {
  loginType: 'keypair' | 'password';
  onLoginTypeChange: (type: 'keypair' | 'password') => void;
  selectedKeyPairId: string | null;
  onSelectKeyPair: (id: string) => void;
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function AuthenticationSection({
  loginType,
  onLoginTypeChange,
  selectedKeyPairId,
  onSelectKeyPair,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: AuthenticationSectionProps) {
  // Validation error
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSelectKeyPair = (id: string) => {
    onSelectKeyPair(id);
    setAuthError(null);
  };

  const handleNextClick = () => {
    if (loginType === 'keypair' && !selectedKeyPairId) {
      setAuthError('Please select a key pair.');
      return;
    }
    setAuthError(null);
    onNext();
  };

  const handleEditDone = () => {
    if (loginType === 'keypair' && !selectedKeyPairId) {
      setAuthError('Please select a key pair.');
      return;
    }
    setAuthError(null);
    onEditDone?.();
  };

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
            onChange={() => handleSelectKeyPair(row.id)}
          />
        </div>
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'fingerprint', label: 'Fingerprint' },
    { key: 'createdAt', label: 'Created at', sortable: true, width: '120px' },
  ];

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header 
        title="Authentication" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content>
        <VStack gap={0}>
          <VStack gap={2} className="pt-2">
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              Login type<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </span>
            <HStack gap={4} className="mt-2">
              <Radio
                value="keypair"
                checked={loginType === 'keypair'}
                onChange={() => onLoginTypeChange('keypair')}
                label="Key pair"
              />
              <Radio
                value="password"
                checked={loginType === 'password'}
                onChange={() => onLoginTypeChange('password')}
                label="Password"
              />
            </HStack>
          </VStack>

          {loginType === 'keypair' && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)] my-6" />
              <VStack gap={2}>
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                  Key pair<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>
                <span className="text-[12px] text-[var(--color-text-muted)] mb-4">
                  Select the key pair for SSH access.
                </span>
                <Table
                  columns={keyPairColumns}
                  data={mockKeyPairs}
                  onRowClick={(row) => handleSelectKeyPair(row.id)}
                />

                {/* Error Message or Selection Indicator for Key Pair */}
                {authError && !selectedKeyPairId ? (
                  <div className="mt-2">
                    <InlineMessage variant="error">
                      {authError}
                    </InlineMessage>
                  </div>
                ) : (
                  <SelectionIndicator
                    className="mt-2"
                    selectedItems={selectedKeyPairId ? [{
                      id: selectedKeyPairId,
                      label: mockKeyPairs.find(k => k.id === selectedKeyPairId)?.name || selectedKeyPairId
                    }] : []}
                    onRemove={() => onSelectKeyPair('')}
                  />
                )}
              </VStack>
            </>
          )}

          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)] my-6" />
              <HStack justify="end">
                <Button 
                  variant="primary" 
                  onClick={handleNextClick}
                >
                  Next
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   AdvancedSection Component
   ---------------------------------------- */

interface TagItem {
  key: string;
  value: string;
}

interface AdvancedSectionProps {
  tags: TagItem[];
  onTagsChange: (tags: TagItem[]) => void;
  userData: string;
  onUserDataChange: (value: string) => void;
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function AdvancedSection({
  tags,
  onTagsChange,
  userData,
  onUserDataChange,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: AdvancedSectionProps) {
  const MAX_TAGS = 50;
  const MAX_USER_DATA_KB = 16;
  
  // Calculate user data size in KB
  const userDataSizeKB = new Blob([userData]).size / 1024;
  const userDataSizeDisplay = userDataSizeKB < 0.01 ? '0' : userDataSizeKB.toFixed(2);

  const handleAddTag = () => {
    if (tags.length < MAX_TAGS) {
      onTagsChange([...tags, { key: '', value: '' }]);
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onTagsChange(newTags);
  };

  const handleTagChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const newTags = [...tags];
    newTags[index] = { ...newTags[index], [field]: newValue };
    onTagsChange(newTags);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.sh,.yaml,.yml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onUserDataChange(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header 
        title="Advanced" 
        showDivider
        actions={isEditing ? (
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={onEditDone}>Done</Button>
          </HStack>
        ) : undefined}
      />
      <SectionCard.Content>
        <VStack gap={6} className="pt-2">
          {/* Tags Section */}
          <VStack gap={3} align="stretch">
            <VStack gap={2} align="stretch">
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                Tags
              </span>
              <span className="text-[12px] text-[var(--color-text-subtle)]">
                A tag consists of a Key that defines the resource category and a Value that describes it. Each resource can have up to 50 tags.
              </span>
            </VStack>
            
            {/* Tag entries */}
            {tags.length > 0 && (
              <VStack gap={2} align="stretch">
                {tags.map((tag, index) => (
                  <HStack key={index} gap={3} align="center">
                    <Input 
                      placeholder="Key" 
                      value={tag.key}
                      onChange={(e) => handleTagChange(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input 
                      placeholder="Value" 
                      value={tag.value}
                      onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <button 
                      onClick={() => handleRemoveTag(index)}
                      className="p-1 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                    >
                      <IconX size={16} />
                    </button>
                  </HStack>
                ))}
              </VStack>
            )}
            
            <HStack gap={3} align="center">
              <button
                onClick={handleAddTag}
                disabled={tags.length >= MAX_TAGS}
                className="flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md hover:bg-[var(--color-surface-subtle)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconPlus size={12} />
                Add tag
              </button>
              <span className="text-[12px] text-[var(--color-text-subtle)]">
                {tags.length} / {MAX_TAGS} tags
              </span>
            </HStack>
          </VStack>

          {/* User data Section */}
          <VStack gap={3} align="stretch">
            <VStack gap={2} align="stretch">
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                User data
              </span>
              <span className="text-[12px] text-[var(--color-text-subtle)]">
                Enter a script or cloud-init configuration to run when the instance first boots.
              </span>
            </VStack>
            
            <VStack gap={3} align="stretch">
              <button
                onClick={handleFileUpload}
                className="flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md hover:bg-[var(--color-surface-subtle)] w-fit"
              >
                <IconUpload size={12} />
                Upload a file
              </button>
              
              <VStack gap={2} align="stretch">
                <Textarea
                  placeholder="e.g. #!/bin/bash ...  or  #cloud-config ..."
                  value={userData}
                  onChange={(e) => onUserDataChange(e.target.value)}
                  fullWidth
                  rows={4}
                />
                <span className="text-[12px] text-[var(--color-text-subtle)]">
                  {userDataSizeDisplay} / {MAX_USER_DATA_KB} KB
                </span>
              </VStack>
            </VStack>
          </VStack>

          {!isEditing && (
            <HStack justify="end" gap={2}>
              <Button variant="secondary" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onNext}>
                Done
              </Button>
            </HStack>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   CreateTemplatePage Component
   ---------------------------------------- */

export function CreateTemplatePage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab } = useTabs();

  // Section status tracking
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'template-info': 'active',
    'basic-info': 'pre',
    image: 'pre',
    flavor: 'pre',
    network: 'pre',
    advanced: 'pre',
  });

  // Track which section is being edited
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);
  const [editingWritingSections, setEditingWritingSections] = useState<SectionStep[]>([]);

  // Template Information state
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Basic information state
  const [availabilityZone, setAvailabilityZone] = useState('nova');

  // Image state
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [storageType, setStorageType] = useState('_DEFAULT_');
  const [storageSize, setStorageSize] = useState(30);
  const [deleteWithInstance, setDeleteWithInstance] = useState(true);

  // Flavor state
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(null);

  // Network state
  const [selectedNetworkIds, setSelectedNetworkIds] = useState<Set<string>>(new Set());
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<Set<string>>(new Set(['sg2']));

  // Authentication state
  const [loginType, setLoginType] = useState<'keypair' | 'password'>('keypair');
  const [selectedKeyPairId, setSelectedKeyPairId] = useState<string | null>(null);

  // Advanced state
  const [tags, setTags] = useState<TagItem[]>([]);
  const [userData, setUserData] = useState('');

  // Convert tabs for TabBar
  const tabBarTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle cancel
  const handleCancel = () => {
    navigate('/compute/instance-templates');
  };

  // Handle Next
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
      setSectionStatus(prev => ({
        ...prev,
        [section]: 'done',
      }));
    }
  };

  // Handle Edit
  const handleEdit = (section: SectionStep) => {
    if (editingSection) {
      setEditingWritingSections(prev => [...prev, editingSection]);
      
      setSectionStatus(prev => {
        const newStatus = { ...prev };
        newStatus[editingSection] = 'writing';
        newStatus[section] = 'active';
        return newStatus;
      });
      setEditingSection(section);
    } else {
      setEditingSection(section);
      
      setSectionStatus(prev => {
        const newStatus = { ...prev };
        
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'active' && key !== section) {
            newStatus[key] = 'writing';
          }
        }
        
        newStatus[section] = 'active';
        
        return newStatus;
      });
    }
  };

  // Handle Edit Cancel
  const handleEditCancel = () => {
    if (editingSection) {
      const topmostWriting = SECTION_ORDER.find(key => sectionStatus[key] === 'writing');
      const wasEditing = topmostWriting && editingWritingSections.includes(topmostWriting);
      
      setSectionStatus(prev => {
        const newStatus = { ...prev };
        newStatus[editingSection] = 'done';
        
        if (topmostWriting) {
          newStatus[topmostWriting] = 'active';
        }
        
        return newStatus;
      });
      
      if (wasEditing && topmostWriting) {
        setEditingSection(topmostWriting);
        setEditingWritingSections(prev => prev.filter(s => s !== topmostWriting));
      } else {
        setEditingSection(null);
      }
    }
  };

  // Handle Edit Done
  const handleEditDone = () => {
    if (editingSection) {
      const topmostWriting = SECTION_ORDER.find(key => sectionStatus[key] === 'writing');
      const wasEditing = topmostWriting && editingWritingSections.includes(topmostWriting);
      
      setSectionStatus(prev => {
        const newStatus = { ...prev };
        newStatus[editingSection] = 'done';
        
        if (topmostWriting) {
          newStatus[topmostWriting] = 'active';
        }
        
        return newStatus;
      });
      
      if (wasEditing && topmostWriting) {
        setEditingSection(topmostWriting);
        setEditingWritingSections(prev => prev.filter(s => s !== topmostWriting));
      } else {
        setEditingSection(null);
      }
    }
  };

  // Network toggle handlers
  const handleNetworkToggle = (id: string) => {
    setSelectedNetworkIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSecurityGroupToggle = (id: string) => {
    setSelectedSecurityGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get summary data
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
      return kp ? `Key pair: ${kp.name}` : 'Key pair: -';
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
                  { label: 'Instance templates', href: '/compute/instance-templates' },
                  { label: 'Create template' },
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
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3} className="min-w-[1176px]">
              {/* Page Title */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create template
                </h1>
              </div>

              {/* Content Area */}
              <HStack gap={6} align="start" className="w-full">
                {/* Left Column - Form Sections */}
                <VStack gap={4} className="flex-1">
                  {/* Template Information Section */}
                  {sectionStatus['template-info'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['template-info']} />
                  )}
                  {sectionStatus['template-info'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['template-info']} />
                  )}
                  {sectionStatus['template-info'] === 'active' && (
                    <TemplateInformationSection
                      templateName={templateName}
                      onTemplateNameChange={setTemplateName}
                      description={templateDescription}
                      onDescriptionChange={setTemplateDescription}
                      isFavorite={isFavorite}
                      onIsFavoriteChange={setIsFavorite}
                      onNext={() => handleNext('template-info')}
                      isActive
                      isEditing={editingSection === 'template-info'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['template-info'] === 'done' && (
                    <DoneSection title={SECTION_LABELS['template-info']} onEdit={() => handleEdit('template-info')}>
                      <SectionCard.DataRow label="Template name" value={templateName || '-'} showDivider={false} />
                      <SectionCard.DataRow label="Description" value={templateDescription || '-'} />
                      <SectionCard.DataRow label="Favorite" value={isFavorite ? 'Yes' : 'No'} />
                    </DoneSection>
                  )}

                  {/* Basic information Section */}
                  {sectionStatus['basic-info'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'active' && (
                    <BasicInformationSection
                      availabilityZone={availabilityZone}
                      onAvailabilityZoneChange={setAvailabilityZone}
                      onNext={() => handleNext('basic-info')}
                      isActive
                      isEditing={editingSection === 'basic-info'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['basic-info'] === 'done' && (
                    <DoneSection title={SECTION_LABELS['basic-info']} onEdit={() => handleEdit('basic-info')}>
                      <SectionCard.DataRow label="AZ (Availability zone)" value={azOptions.find(az => az.value === availabilityZone)?.label || availabilityZone} showDivider={false} />
                    </DoneSection>
                  )}

                  {/* Image Section */}
                  {sectionStatus.image === 'pre' && (
                    <PreSection title={SECTION_LABELS.image} />
                  )}
                  {sectionStatus.image === 'writing' && (
                    <WritingSection title={SECTION_LABELS.image} />
                  )}
                  {sectionStatus.image === 'active' && (
                    <ImageSection
                      selectedImageId={selectedImageId}
                      onSelectImage={setSelectedImageId}
                      storageType={storageType}
                      onStorageTypeChange={setStorageType}
                      storageSize={storageSize}
                      onStorageSizeChange={setStorageSize}
                      deleteWithInstance={deleteWithInstance}
                      onDeleteWithInstanceChange={setDeleteWithInstance}
                      onNext={() => handleNext('image')}
                      isActive
                      isEditing={editingSection === 'image'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus.image === 'done' && (
                    <DoneSection title={SECTION_LABELS.image} onEdit={() => handleEdit('image')}>
                      <SectionCard.DataRow label="Image" value={getImageSummary() || '-'} showDivider={false} />
                      <SectionCard.DataRow label="System disk" value={getStorageSummary()} />
                    </DoneSection>
                  )}

                  {/* Flavor Section */}
                  {sectionStatus.flavor === 'pre' && (
                    <PreSection title={SECTION_LABELS.flavor} />
                  )}
                  {sectionStatus.flavor === 'writing' && (
                    <WritingSection title={SECTION_LABELS.flavor} />
                  )}
                  {sectionStatus.flavor === 'active' && (
                    <FlavorSection
                      selectedFlavorId={selectedFlavorId}
                      onSelectFlavor={setSelectedFlavorId}
                      onNext={() => handleNext('flavor')}
                      isActive
                      isEditing={editingSection === 'flavor'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus.flavor === 'done' && (
                    <DoneSection title={SECTION_LABELS.flavor} onEdit={() => handleEdit('flavor')}>
                      <SectionCard.DataRow label="Flavor" value={getFlavorSummary() || '-'} showDivider={false} />
                    </DoneSection>
                  )}

                  {/* Network Section */}
                  {sectionStatus.network === 'pre' && (
                    <PreSection title={SECTION_LABELS.network} />
                  )}
                  {sectionStatus.network === 'writing' && (
                    <WritingSection title={SECTION_LABELS.network} />
                  )}
                  {sectionStatus.network === 'active' && (
                    <NetworkSection
                      selectedNetworkIds={selectedNetworkIds}
                      onNetworkToggle={handleNetworkToggle}
                      selectedSecurityGroups={selectedSecurityGroups}
                      onSecurityGroupToggle={handleSecurityGroupToggle}
                      onNext={() => handleNext('network')}
                      isActive
                      isEditing={editingSection === 'network'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus.network === 'done' && (
                    <DoneSection title={SECTION_LABELS.network} onEdit={() => handleEdit('network')}>
                      <SectionCard.DataRow label="Network" value={getNetworkSummary()} showDivider={false} />
                      <SectionCard.DataRow label="Security groups" value={getSecurityGroupSummary()} />
                    </DoneSection>
                  )}

                  {/* Advanced Section */}
                  {sectionStatus.advanced === 'pre' && (
                    <PreSection title={SECTION_LABELS.advanced} />
                  )}
                  {sectionStatus.advanced === 'writing' && (
                    <WritingSection title={SECTION_LABELS.advanced} />
                  )}
                  {sectionStatus.advanced === 'active' && (
                    <AdvancedSection
                      tags={tags}
                      onTagsChange={setTags}
                      userData={userData}
                      onUserDataChange={setUserData}
                      onNext={() => handleNext('advanced')}
                      isActive
                      isEditing={editingSection === 'advanced'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus.advanced === 'done' && (
                    <DoneSection title={SECTION_LABELS.advanced} onEdit={() => handleEdit('advanced')}>
                      <SectionCard.DataRow 
                        label="Tags" 
                        value={tags.length > 0 ? `${tags.length} tag${tags.length > 1 ? 's' : ''}` : '-'} 
                        showDivider={false}
                      />
                      <SectionCard.DataRow 
                        label="User data" 
                        value={userData ? 'Configured' : '-'} 
                      />
                    </DoneSection>
                  )}
                </VStack>

                {/* Right Column - Sidebar */}
                <TemplateSidebar
                  onCancel={handleCancel}
                  sectionStatus={sectionStatus}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateTemplatePage;
