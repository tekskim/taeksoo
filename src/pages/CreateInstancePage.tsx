import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIsV2 } from '@/hooks/useIsV2';
import {
  Button,
  Breadcrumb,
  NumberInput,
  ProgressBar,
  STATUS_THRESHOLDS,
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
  Toggle,
  SelectionIndicator,
  IconUbuntu,
  IconGrid,
  IconRocky,
  PageShell,
  fixedColumns,
  columnMinWidths,
  WizardSectionStatusIcon,
  FormField,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconBell,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconCirclePlus,
  IconX,
  IconStar,
  IconStarFilled,
  IconUpload,
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

interface TemplateConfig {
  // Basic information
  instanceNamePrefix?: string;
  availabilityZone?: string;
  description?: string;
  // Image
  imageId?: string;
  storageOption?: 'create' | 'no-create';
  storageType?: string;
  storageSize?: number;
  deleteWithInstance?: boolean;
  // Flavor
  flavorId?: string;
  // Network
  networkIds?: string[];
  securityGroupIds?: string[];
  floatingIpOption?: 'none' | 'auto' | 'existing';
  // Authentication
  loginType?: 'keypair' | 'password';
  keyPairId?: string;
  // Advanced
  serverGroupId?: string;
  userData?: string;
}

interface TemplateRow {
  id: string;
  name: string;
  description: string;
  visibility: string;
  createdAt: string;
  isFavorite: boolean;
  config?: TemplateConfig;
}

type SectionStep =
  | 'templates'
  | 'basic-info'
  | 'image'
  | 'flavor'
  | 'network'
  | 'authentication'
  | 'advanced';
type SectionState = 'pre' | 'active' | 'done' | 'skipped' | 'writing';

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
  templates: 'Launch type',
  'basic-info': 'Basic information',
  image: 'Source',
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
  { label: 'Disk capacity (GiB)', used: 20, max: 1000, newValue: 50 },
];

const mockTemplates: TemplateRow[] = [
  {
    id: '129jm39s',
    name: 'th.tiny',
    description: '-',
    visibility: 'Private',
    createdAt: 'Nov 19, 2025',
    isFavorite: true,
    config: {
      instanceNamePrefix: 'tiny-instance',
      availabilityZone: 'nova',
      description: 'Tiny instance for testing',
      imageId: 'e920j30d', // ubuntu-24.04
      storageOption: 'create',
      storageType: '_DEFAULT_',
      storageSize: 20,
      deleteWithInstance: true,
      flavorId: '45hgf456', // t2.micro
      networkIds: ['d32059d1'], // internal-01
      securityGroupIds: ['sg1'], // default
      floatingIpOption: 'none',
      loginType: 'keypair',
      keyPairId: 'kp1', // dev-keypair
    },
  },
  {
    id: '230km40t',
    name: 'th.small',
    description: 'Small instance',
    visibility: 'Public',
    createdAt: 'Nov 18, 2025',
    isFavorite: false,
    config: {
      instanceNamePrefix: 'small-instance',
      availabilityZone: 'nova',
      description: 'Small development instance',
      imageId: 'e920j35d', // ubuntu-22.04
      storageOption: 'create',
      storageType: '_DEFAULT_',
      storageSize: 30,
      deleteWithInstance: true,
      flavorId: '17kfj123', // m5.large
      networkIds: ['d32059d1', 'd32059d3'], // internal-01, internal-03
      securityGroupIds: ['sg2'], // suite-default
      floatingIpOption: 'none',
      loginType: 'keypair',
      keyPairId: 'kp2', // prod-keypair
    },
  },
  {
    id: '331ln51u',
    name: 'th.medium',
    description: 'Medium instance',
    visibility: 'Private',
    createdAt: 'Nov 17, 2025',
    isFavorite: true,
    config: {
      instanceNamePrefix: 'medium-instance',
      availabilityZone: 'nova',
      description: 'Medium production instance',
      imageId: 'e920j30d', // ubuntu-24.04
      storageOption: 'create',
      storageType: '_DEFAULT_',
      storageSize: 50,
      deleteWithInstance: false,
      flavorId: '23hgf234', // r5.2xlarge
      networkIds: ['d32059d1'], // internal-01
      securityGroupIds: ['sg2', 'sg3'], // suite-default, web-sg
      floatingIpOption: 'auto',
      loginType: 'keypair',
      keyPairId: 'kp2', // prod-keypair
    },
  },
  {
    id: '432mo62v',
    name: 'th.large',
    description: 'Large instance',
    visibility: 'Public',
    createdAt: 'Nov 16, 2025',
    isFavorite: false,
    config: {
      instanceNamePrefix: 'large-instance',
      availabilityZone: 'nova',
      description: 'Large workload instance',
      imageId: 'e920j37d', // windows-server-2022
      storageOption: 'create',
      storageType: '_DEFAULT_',
      storageSize: 100,
      deleteWithInstance: false,
      flavorId: '12abc345', // g4dn.xlarge
      networkIds: ['d32059d1', 'd32059d4'], // internal-01, external-net
      securityGroupIds: ['sg1', 'sg3'], // default, web-sg
      floatingIpOption: 'auto',
      loginType: 'password',
    },
  },
  {
    id: '533np73w',
    name: 'th.xlarge',
    description: 'Extra large instance',
    visibility: 'Private',
    createdAt: 'Nov 15, 2025',
    isFavorite: true,
    config: {
      instanceNamePrefix: 'xlarge-instance',
      availabilityZone: 'nova',
      description: 'Extra large high-performance instance',
      imageId: 'e920j39d', // rocky-9.3
      storageOption: 'create',
      storageType: '_DEFAULT_',
      storageSize: 200,
      deleteWithInstance: false,
      flavorId: '34ghi567', // x1e.xlarge
      networkIds: ['d32059d1', 'd32059d3', 'd32059d4'], // internal-01, internal-03, external-net
      securityGroupIds: ['sg1', 'sg2', 'sg4'], // default, suite-default, db-sg
      floatingIpOption: 'auto',
      loginType: 'keypair',
      keyPairId: 'kp3', // staging-keypair
    },
  },
  {
    id: '634oq84x',
    name: 'th.2xlarge',
    description: '2x large instance',
    visibility: 'Public',
    createdAt: 'Nov 14, 2025',
    isFavorite: false,
    config: {
      instanceNamePrefix: '2xlarge-instance',
      availabilityZone: 'nova',
      description: 'Maximum performance instance',
      imageId: 'e920j30d', // ubuntu-24.04
      storageOption: 'create',
      storageType: '_DEFAULT_',
      storageSize: 500,
      deleteWithInstance: false,
      flavorId: '34ghi567', // x1e.xlarge
      networkIds: ['d32059d4'], // external-net
      securityGroupIds: ['sg1', 'sg2', 'sg3', 'sg4'], // all
      floatingIpOption: 'auto',
      loginType: 'keypair',
      keyPairId: 'kp2', // prod-keypair
      userData: '#!/bin/bash\necho "Hello from template"',
    },
  },
];

/* ----------------------------------------
   QuotaSidebar Component
   ---------------------------------------- */

interface QuotaSidebarProps {
  numberOfInstances: number;
  onNumberOfInstancesChange: (value: number) => void;
  quota: QuotaItem[];
  onCancel: () => void;
  sectionStatus: SectionStatus;
  editingSection: SectionStep | null;
}

function QuotaSidebar({
  numberOfInstances,
  onNumberOfInstancesChange,
  quota,
  onCancel,
  sectionStatus,
  editingSection,
}: QuotaSidebarProps) {
  // Check if all sections are completed (done or skipped)
  const isAllCompleted = SECTION_ORDER.every(
    (section) => sectionStatus[section] === 'done' || sectionStatus[section] === 'skipped'
  );

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Summary Card */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            <h5 className="text-heading-h5 text-[var(--color-text-default)]">Summary</h5>
            <div className="flex flex-col">
              {SECTION_ORDER.map((sectionKey) => {
                // Show "Writing..." for sections in 'writing' state
                const isWriting = sectionStatus[sectionKey] === 'writing';

                return (
                  <div key={sectionKey} className="flex items-center justify-between py-1">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {SECTION_LABELS[sectionKey]}
                    </span>
                    {isWriting ? (
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Writing...
                      </span>
                    ) : (
                      <WizardSectionStatusIcon status={sectionStatus[sectionKey]} />
                    )}
                  </div>
                );
              })}
            </div>
          </VStack>
        </div>

        {/* Quota Card */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            <h5 className="text-heading-h5 text-[var(--color-text-default)]">Quota</h5>
            <VStack gap={3}>
              {quota.map((item) => (
                <ProgressBar
                  key={item.label}
                  variant="quota"
                  label={item.label}
                  value={item.used}
                  max={item.max}
                  newValue={item.newValue}
                  showValue
                  thresholds={STATUS_THRESHOLDS.compute}
                />
              ))}
            </VStack>
          </VStack>
        </div>

        {/* Number of Instances */}
        <FormField label="Number of Instances">
          <NumberInput
            value={numberOfInstances}
            onChange={onNumberOfInstancesChange}
            min={1}
            max={10}
            width="full"
          />
        </FormField>

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!isAllCompleted} className="flex-1">
            Create
          </Button>
        </HStack>
      </div>
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
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component (작업 중인 섹션 - Writing... 표시)
   ---------------------------------------- */

interface WritingSectionProps {
  title: string;
}

function WritingSection({ title }: WritingSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center justify-between">
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
        <span className="text-body-sm text-[var(--color-text-subtle)]">Writing...</span>
      </div>
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
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="flex items-center justify-between h-8">
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
        <div className="flex items-center gap-3">
          <span className="text-body-md text-[var(--color-text-muted)]">Not configured</span>
          <Button variant="outline" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>
    </div>
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
    <SectionCard>
      <SectionCard.Header
        title={title}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
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
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
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
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: BasicInformationSectionProps) {
  // Validation error
  const [instanceNameError, setInstanceNameError] = useState<string | null>(null);

  // Handle instance name change with error clearing
  const handleInstanceNameChange = (value: string) => {
    onInstanceNameChange(value);
    if (value.trim()) {
      setInstanceNameError(null);
    }
  };

  // Handle Next with validation
  const handleNextClick = () => {
    if (!instanceName.trim()) {
      setInstanceNameError('Please enter an instance name.');
      return;
    }
    setInstanceNameError(null);
    onNext();
  };

  // Handle Edit Done with validation
  const handleEditDone = () => {
    if (!instanceName.trim()) {
      setInstanceNameError('Please enter an instance name.');
      return;
    }
    setInstanceNameError(null);
    onEditDone?.();
  };

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header
        title="Basic information"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Instance name */}
          <div className="py-6">
            <FormField required error={!!instanceNameError}>
              <FormField.Label>Instance name</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Instance name"
                  value={instanceName}
                  onChange={(e) => handleInstanceNameChange(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
              <FormField.ErrorMessage>{instanceNameError}</FormField.ErrorMessage>
              <FormField.HelperText>
                The name should start with upper letter, lower letter or chinese, and be a string
                with 1~128 characters.
              </FormField.HelperText>
            </FormField>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* AZ (Availability zone) */}
          <div className="py-6">
            <FormField required>
              <FormField.Label>AZ (Availability zone)</FormField.Label>
              <FormField.Control>
                <Select
                  options={availabilityZoneOptions}
                  value={availabilityZone}
                  onChange={onAvailabilityZoneChange}
                  placeholder="Select AZ"
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                Select the availability zone for the instance.
              </FormField.HelperText>
            </FormField>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Description */}
          <div className="py-6">
            <FormField>
              <FormField.Label>Description</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                You can use letters, numbers, and special characters (+=.@-_,()[]), and maximum 255
                characters.
              </FormField.HelperText>
            </FormField>
          </div>

          {/* Divider + Next Button - hidden in edit mode or v2 */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={handleNextClick}>
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
    id: 'e920j33d',
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
    id: 'e920j34d',
    status: 'error',
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
    id: 'e920j36d',
    status: 'active',
    name: 'ubuntu-20.04-tk-base',
    version: '20.04',
    size: '580.45 MiB',
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
    id: 'e920j38d',
    status: 'active',
    name: 'windows-server-2019',
    version: '2019',
    size: '4.2 GiB',
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
  {
    id: 'e920j40d',
    status: 'active',
    name: 'rocky-8.9-tk-base',
    version: '8.9',
    size: '850.11 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'rocky',
  },
  {
    id: 'e920j41d',
    status: 'active',
    name: 'centos-stream-9',
    version: '9',
    size: '920.00 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'other',
  },
];

const mockSnapshots: SnapshotRow[] = [
  {
    id: 's1',
    status: 'active',
    name: 'newsnapshot',
    size: '709.98 MiB',
    sourceInstance: 'th-server',
    createdAt: 'Sep 1, 2025',
  },
  {
    id: 's2',
    status: 'active',
    name: 'web-backup',
    size: '1.2 GiB',
    sourceInstance: 'web-server-01',
    createdAt: 'Aug 28, 2025',
  },
  {
    id: 's3',
    status: 'active',
    name: 'db-snapshot',
    size: '2.5 GiB',
    sourceInstance: 'db-master',
    createdAt: 'Aug 25, 2025',
  },
  {
    id: 's4',
    status: 'building',
    name: 'app-snapshot',
    size: '890.00 MiB',
    sourceInstance: 'app-server',
    createdAt: 'Aug 20, 2025',
  },
  {
    id: 's5',
    status: 'active',
    name: 'test-snapshot',
    size: '512.00 MiB',
    sourceInstance: 'test-vm',
    createdAt: 'Aug 15, 2025',
  },
];

const mockBootableVolumes: BootableVolumeRow[] = [
  {
    id: 'v1',
    status: 'available',
    name: 'boot-volume-01',
    size: '50 GiB',
    type: 'SSD',
    createdAt: 'Sep 1, 2025',
  },
  {
    id: 'v2',
    status: 'available',
    name: 'boot-volume-02',
    size: '100 GiB',
    type: 'SSD',
    createdAt: 'Aug 28, 2025',
  },
  {
    id: 'v3',
    status: 'in-use',
    name: 'system-disk',
    size: '80 GiB',
    type: 'HDD',
    createdAt: 'Aug 20, 2025',
  },
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
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function ImageSection({
  selectedImageId,
  onSelectImage,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: ImageSectionProps) {
  const isV2 = useIsV2();
  const [sourceTab, setSourceTab] = useState('image');
  const [osFilter, setOsFilter] = useState<'ubuntu' | 'windows' | 'rocky' | 'other'>('other');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [createSystemDisk, setCreateSystemDisk] = useState(isV2 ? true : false);
  const [storageType, setStorageType] = useState('_DEFAULT_');
  const [storageSize, setStorageSize] = useState(30);
  const [deleteWithInstance, setDeleteWithInstance] = useState(true);
  const [dataDisks, setDataDisks] = useState<
    { id: string; type: string; size: number; deleteWithInstance: boolean }[]
  >([{ id: 'dd-default', type: '_DEFAULT_', size: 10, deleteWithInstance: true }]);
  const itemsPerPage = 5;

  // Validation error
  const [sourceError, setSourceError] = useState<string | null>(null);

  // Filter images based on OS filter and search query
  const filteredImages = mockImages.filter((img) => {
    const matchesOs = osFilter === 'other' || img.os === osFilter;
    const matchesSearch =
      searchQuery === '' ||
      img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.version.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOs && matchesSearch;
  });

  // Paginate images
  const totalImagePages = Math.ceil(filteredImages.length / itemsPerPage) || 1;
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter snapshots based on search query
  const filteredSnapshots = mockSnapshots.filter((snap) => {
    return (
      searchQuery === '' ||
      snap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snap.sourceInstance.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter bootable volumes based on search query
  const filteredVolumes = mockBootableVolumes.filter((vol) => {
    return searchQuery === '' || vol.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get selected image info
  const selectedImage = mockImages.find((img) => img.id === selectedImageId);

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Add data disk
  const handleAddDataDisk = () => {
    setDataDisks((prev) => [
      ...prev,
      { id: `dd-${Date.now()}`, type: '_DEFAULT_', size: 10, deleteWithInstance: true },
    ]);
  };

  const handleRemoveDataDisk = (id: string) => {
    setDataDisks((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpdateDataDisk = (
    id: string,
    field: 'type' | 'size' | 'deleteWithInstance',
    value: string | number | boolean
  ) => {
    setDataDisks((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  // Handle image selection with error clearing
  const handleImageSelect = (id: string) => {
    onSelectImage(id);
    setSourceError(null);
  };

  // Handle Next with validation
  const handleNextClick = () => {
    if (!selectedImageId) {
      setSourceError('Please select a start source.');
      return;
    }
    setSourceError(null);
    onNext();
  };

  // Handle Edit Done with validation
  const handleEditDone = () => {
    if (!selectedImageId) {
      setSourceError('Please select a start source.');
      return;
    }
    setSourceError(null);
    onEditDone?.();
  };

  // Image Table columns
  const imageColumns: TableColumn<ImageRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => handleImageSelect(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={row.status as 'active' | 'error' | 'building'} />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (value, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <a
              href="#"
              className="text-[var(--color-action-primary)] hover:underline text-label-md"
            >
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </VStack>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.version,
    },
    { key: 'size', label: 'Size', sortable: true, flex: 1, minWidth: columnMinWidths.size },
    {
      key: 'minDisk',
      label: 'Min disk',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.minDisk,
    },
    { key: 'minRam', label: 'Min RAM', sortable: true, flex: 1, minWidth: columnMinWidths.minRam },
    {
      key: 'access',
      label: 'Visibility',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.access,
    },
  ];

  // Snapshot Table columns
  const snapshotColumns: TableColumn<SnapshotRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => handleImageSelect(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value) => <StatusIndicator status={value as 'active' | 'error' | 'building'} />,
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'size', label: 'Size', sortable: true, flex: 1, minWidth: columnMinWidths.size },
    {
      key: 'sourceInstance',
      label: 'Source instance',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.sourceInstance,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.createdAt,
    },
  ];

  // Bootable Volume Table columns
  const volumeColumns: TableColumn<BootableVolumeRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => handleImageSelect(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value) => {
        // Map volume status to StatusIndicator status
        const statusMap: Record<string, 'active' | 'in-use' | 'error'> = {
          available: 'active',
          'in-use': 'in-use',
          error: 'error',
        };
        return <StatusIndicator status={statusMap[value] || 'error'} />;
      },
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'size', label: 'Size', sortable: true, flex: 1, minWidth: columnMinWidths.size },
    { key: 'type', label: 'Type', sortable: true, flex: 1, minWidth: columnMinWidths.type },
    {
      key: 'createdAt',
      label: 'Created at',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.createdAt,
    },
  ];

  // osChipStyle removed — using DS Tabs variant="boxed" instead

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header
        title="Source"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Start Source */}
          <VStack gap={3} className="py-6">
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                Start source<span className="ml-1 text-[var(--color-state-danger)]">*</span>
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Select a template to launch the instance. You can start from an OS image, a
                snapshot, or an existing volume.
              </span>
            </VStack>

            {isV2 ? (
              <VStack gap={6}>
                {/* Image block */}
                <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                  <VStack gap={2}>
                    <Tabs value="image" onChange={() => {}} variant="underline" size="sm">
                      <TabList>
                        <Tab value="image">Image</Tab>
                        <Tab value="snapshot">Instance snapshot</Tab>
                        <Tab value="volume">Bootable volume</Tab>
                      </TabList>
                    </Tabs>
                    <Tabs
                      variant="boxed"
                      size="sm"
                      value={osFilter}
                      onChange={(value) => {
                        setOsFilter(value as typeof osFilter);
                        setCurrentPage(1);
                      }}
                    >
                      <TabList className="mt-2">
                        <Tab value="other">
                          <HStack gap={1} align="center">
                            <IconDots size={14} />
                            <span>Others</span>
                          </HStack>
                        </Tab>
                        <Tab value="ubuntu">
                          <HStack gap={1} align="center">
                            <IconUbuntu size={14} />
                            <span>Ubuntu</span>
                          </HStack>
                        </Tab>
                        <Tab value="windows">
                          <HStack gap={1} align="center">
                            <IconGrid size={14} />
                            <span>Windows</span>
                          </HStack>
                        </Tab>
                        <Tab value="rocky">
                          <HStack gap={1} align="center">
                            <IconRocky size={14} />
                            <span>Rocky</span>
                          </HStack>
                        </Tab>
                      </TabList>
                    </Tabs>
                    <SearchInput
                      placeholder="Search image by attributes"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onClear={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      size="sm"
                      className="w-[var(--search-input-width)] mt-2"
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalImagePages}
                      totalItems={filteredImages.length}
                      onPageChange={setCurrentPage}
                      selectedCount={selectedImageId ? 1 : 0}
                    />
                    <Table
                      columns={imageColumns}
                      data={paginatedImages}
                      rowKey="id"
                      onRowClick={(row) => onSelectImage(row.id)}
                    />
                    <SelectionIndicator
                      selectedItems={
                        selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                      }
                      onRemove={() => onSelectImage('')}
                      error={!!sourceError}
                      errorMessage={sourceError}
                    />
                  </VStack>
                </div>

                {/* Instance snapshot block */}
                <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                  <VStack gap={2}>
                    <Tabs value="snapshot" onChange={() => {}} variant="underline" size="sm">
                      <TabList>
                        <Tab value="image">Image</Tab>
                        <Tab value="snapshot">Instance snapshot</Tab>
                        <Tab value="volume">Bootable volume</Tab>
                      </TabList>
                    </Tabs>
                    <Tabs
                      variant="boxed"
                      size="sm"
                      value={osFilter}
                      onChange={(value) => {
                        setOsFilter(value as typeof osFilter);
                        setCurrentPage(1);
                      }}
                    >
                      <TabList className="mt-2">
                        <Tab value="other">
                          <HStack gap={1} align="center">
                            <IconDots size={14} />
                            <span>Others</span>
                          </HStack>
                        </Tab>
                        <Tab value="ubuntu">
                          <HStack gap={1} align="center">
                            <IconUbuntu size={14} />
                            <span>Ubuntu</span>
                          </HStack>
                        </Tab>
                        <Tab value="windows">
                          <HStack gap={1} align="center">
                            <IconGrid size={14} />
                            <span>Windows</span>
                          </HStack>
                        </Tab>
                        <Tab value="rocky">
                          <HStack gap={1} align="center">
                            <IconRocky size={14} />
                            <span>Rocky</span>
                          </HStack>
                        </Tab>
                      </TabList>
                    </Tabs>
                    <SearchInput
                      placeholder="Search snapshot by attributes"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onClear={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      size="sm"
                      className="w-[var(--search-input-width)] mt-2"
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredSnapshots.length / itemsPerPage) || 1}
                      totalItems={filteredSnapshots.length}
                      onPageChange={setCurrentPage}
                      selectedCount={selectedImageId ? 1 : 0}
                    />
                    <Table
                      columns={snapshotColumns}
                      data={filteredSnapshots.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )}
                      rowKey="id"
                      onRowClick={(row) => onSelectImage(row.id)}
                    />
                    <SelectionIndicator
                      selectedItems={
                        selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                      }
                      onRemove={() => onSelectImage('')}
                      error={!!sourceError}
                      errorMessage={sourceError}
                    />
                  </VStack>
                </div>

                {/* Bootable volume block */}
                <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                  <VStack gap={2}>
                    <Tabs value="volume" onChange={() => {}} variant="underline" size="sm">
                      <TabList>
                        <Tab value="image">Image</Tab>
                        <Tab value="snapshot">Instance snapshot</Tab>
                        <Tab value="volume">Bootable volume</Tab>
                      </TabList>
                    </Tabs>
                    <Tabs
                      variant="boxed"
                      size="sm"
                      value={osFilter}
                      onChange={(value) => {
                        setOsFilter(value as typeof osFilter);
                        setCurrentPage(1);
                      }}
                    >
                      <TabList className="mt-2">
                        <Tab value="other">
                          <HStack gap={1} align="center">
                            <IconDots size={14} />
                            <span>Others</span>
                          </HStack>
                        </Tab>
                        <Tab value="ubuntu">
                          <HStack gap={1} align="center">
                            <IconUbuntu size={14} />
                            <span>Ubuntu</span>
                          </HStack>
                        </Tab>
                        <Tab value="windows">
                          <HStack gap={1} align="center">
                            <IconGrid size={14} />
                            <span>Windows</span>
                          </HStack>
                        </Tab>
                        <Tab value="rocky">
                          <HStack gap={1} align="center">
                            <IconRocky size={14} />
                            <span>Rocky</span>
                          </HStack>
                        </Tab>
                      </TabList>
                    </Tabs>
                    <SearchInput
                      placeholder="Search volume by attributes"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onClear={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      size="sm"
                      className="w-[var(--search-input-width)] mt-2"
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredVolumes.length / itemsPerPage) || 1}
                      totalItems={filteredVolumes.length}
                      onPageChange={setCurrentPage}
                      selectedCount={selectedImageId ? 1 : 0}
                    />
                    <Table
                      columns={volumeColumns}
                      data={filteredVolumes.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )}
                      rowKey="id"
                      onRowClick={(row) => onSelectImage(row.id)}
                    />
                    <SelectionIndicator
                      selectedItems={
                        selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                      }
                      onRemove={() => onSelectImage('')}
                      error={!!sourceError}
                      errorMessage={sourceError}
                    />
                  </VStack>
                </div>
              </VStack>
            ) : (
              <>
                {/* Source Tabs */}
                <div className="mt-1">
                  <Tabs value={sourceTab} onChange={setSourceTab} variant="underline" size="sm">
                    <TabList>
                      <Tab value="image">Image</Tab>
                      <Tab value="snapshot">Instance snapshot</Tab>
                      <Tab value="volume">Bootable volume</Tab>
                    </TabList>
                  </Tabs>
                </div>

                {/* OS Filter Chips - Only show for Image tab */}
                {sourceTab === 'image' && (
                  <Tabs
                    variant="boxed"
                    size="sm"
                    value={osFilter}
                    onChange={(value) => {
                      setOsFilter(value as typeof osFilter);
                      setCurrentPage(1);
                    }}
                  >
                    <TabList className="mt-2">
                      <Tab value="other">
                        <HStack gap={1} align="center">
                          <IconDots size={14} />
                          <span>Others</span>
                        </HStack>
                      </Tab>
                      <Tab value="ubuntu">
                        <HStack gap={1} align="center">
                          <IconUbuntu size={14} />
                          <span>Ubuntu</span>
                        </HStack>
                      </Tab>
                      <Tab value="windows">
                        <HStack gap={1} align="center">
                          <IconGrid size={14} />
                          <span>Windows</span>
                        </HStack>
                      </Tab>
                      <Tab value="rocky">
                        <HStack gap={1} align="center">
                          <IconRocky size={14} />
                          <span>Rocky</span>
                        </HStack>
                      </Tab>
                    </TabList>
                  </Tabs>
                )}

                {/* Search */}
                <SearchInput
                  placeholder="Search image by attributes"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClear={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  size="sm"
                  className="w-[var(--search-input-width)] mt-2"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={
                    sourceTab === 'image'
                      ? totalImagePages
                      : Math.ceil(filteredSnapshots.length / itemsPerPage) || 1
                  }
                  totalItems={
                    sourceTab === 'image' ? filteredImages.length : filteredSnapshots.length
                  }
                  onPageChange={setCurrentPage}
                  selectedCount={selectedImageId ? 1 : 0}
                />

                <VStack gap={2}>
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
                      data={filteredSnapshots.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )}
                      rowKey="id"
                      onRowClick={(row) => onSelectImage(row.id)}
                    />
                  )}
                  {sourceTab === 'volume' && (
                    <Table
                      columns={volumeColumns}
                      data={filteredVolumes.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )}
                      rowKey="id"
                      onRowClick={(row) => onSelectImage(row.id)}
                    />
                  )}

                  {/* Selected / Error Message */}
                  <SelectionIndicator
                    selectedItems={
                      selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                    }
                    onRemove={() => onSelectImage('')}
                    error={!!sourceError}
                    errorMessage={sourceError}
                  />
                </VStack>
              </>
            )}
          </VStack>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)] mt-6" />

          {/* System disk Section */}
          <div className="py-6">
            <FormField required>
              <FormField.Label>System disk</FormField.Label>
              <FormField.Description>
                Configure whether to create a system disk for booting.
              </FormField.Description>
              <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                <Toggle
                  checked={createSystemDisk}
                  onChange={setCreateSystemDisk}
                  label="Create a new system disk"
                />
              </FormField.Control>
            </FormField>

            {/* Storage Type & Size Row */}
            {(isV2 || createSystemDisk) && (
              <div className="mt-3 w-full bg-white border border-[var(--color-border-default)] rounded-[6px] px-4 py-2">
                <HStack gap={6} align="center">
                  <HStack gap={1.5} align="center">
                    <span className="text-label-lg text-[var(--color-text-default)]">Type</span>
                    <Select
                      options={storageTypeOptions}
                      value={storageType}
                      onChange={setStorageType}
                    />
                  </HStack>
                  <HStack gap={1.5} align="center">
                    <span className="text-label-lg text-[var(--color-text-default)]">Size</span>
                    <NumberInput
                      value={storageSize}
                      onChange={(v) => setStorageSize(v ?? 30)}
                      min={1}
                      max={1000}
                      step={1}
                      width="sm"
                      suffix="GiB"
                    />
                  </HStack>
                  <Checkbox
                    label="Deleted with the instance"
                    checked={deleteWithInstance}
                    onChange={(e) => setDeleteWithInstance(e.target.checked)}
                  />
                </HStack>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Data disk Section */}
          <VStack gap={3} align="start" className="py-6">
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Data disk</span>
              <span className="text-body-md text-[var(--color-text-muted)]">
                Attach additional volumes for data storage.
              </span>
            </VStack>

            <VStack gap={2} className="w-full">
              {dataDisks.map((disk) => (
                <div
                  key={disk.id}
                  className="w-full bg-white border border-[var(--color-border-default)] rounded-[6px] px-4 py-2"
                >
                  <HStack gap={6} align="center">
                    <HStack gap={1.5} align="center">
                      <span className="text-label-lg text-[var(--color-text-default)]">Type</span>
                      <Select
                        options={storageTypeOptions}
                        value={disk.type}
                        onChange={(v) => handleUpdateDataDisk(disk.id, 'type', v)}
                      />
                    </HStack>
                    <HStack gap={1.5} align="center">
                      <span className="text-label-lg text-[var(--color-text-default)]">Size</span>
                      <NumberInput
                        value={disk.size}
                        onChange={(v) => handleUpdateDataDisk(disk.id, 'size', v ?? 10)}
                        min={1}
                        max={1000}
                        step={1}
                        width="sm"
                        suffix="GiB"
                      />
                    </HStack>
                    <Checkbox
                      label="Deleted with the instance"
                      checked={disk.deleteWithInstance}
                      onChange={(e) =>
                        handleUpdateDataDisk(disk.id, 'deleteWithInstance', e.target.checked)
                      }
                    />
                    <div className="ml-auto">
                      <button
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        onClick={() => handleRemoveDataDisk(disk.id)}
                      >
                        <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </div>
                  </HStack>
                </div>
              ))}
              <div className="w-fit mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} />}
                  onClick={handleAddDataDisk}
                >
                  Add Data disk
                </Button>
              </div>
            </VStack>
          </VStack>

          {/* Divider + Next Button - hidden in edit mode */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={handleNextClick}>
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
  {
    id: '17kfj123',
    name: 'm5.large',
    vCPU: 2,
    ram: '2GiB',
    disk: '50GiB',
    ephemeralDisk: '0GiB',
    networkBandwidth: '-',
  },
  {
    id: '45hgf456',
    name: 't2.micro',
    vCPU: 2,
    ram: '2GiB',
    disk: '50GiB',
    ephemeralDisk: '0GiB',
    networkBandwidth: '-',
  },
  {
    id: '23hgf234',
    name: 'r5.2xlarge',
    vCPU: 2,
    ram: '2GiB',
    disk: '50GiB',
    ephemeralDisk: '0GiB',
    networkBandwidth: '-',
  },
  {
    id: '90jkl567',
    name: 'p3.8xlarge',
    vCPU: 2,
    ram: '2GiB',
    disk: '50GiB',
    ephemeralDisk: '0GiB',
    networkBandwidth: '-',
  },
  {
    id: '78kls890',
    name: 'c5.xlarge',
    vCPU: 2,
    ram: '2GiB',
    disk: '5GiB',
    ephemeralDisk: '0GiB',
    networkBandwidth: '-',
    hasWarning: true,
  },
  {
    id: '12abc345',
    name: 'g4dn.xlarge',
    vCPU: 4,
    ram: '16GiB',
    disk: '125GiB',
    ephemeralDisk: '0GiB',
    networkBandwidth: '10 Gbps',
  },
  {
    id: '67def890',
    name: 'i3.large',
    vCPU: 2,
    ram: '15.25GiB',
    disk: '475GiB',
    ephemeralDisk: '0GiB',
    networkBandwidth: '-',
  },
  {
    id: '34ghi567',
    name: 'x1e.xlarge',
    vCPU: 4,
    ram: '122GiB',
    disk: '120GiB',
    ephemeralDisk: '0GiB',
    networkBandwidth: '-',
  },
];

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
  const [flavorTab, setFlavorTab] = useState('vcpu');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Validation error
  const [flavorError, setFlavorError] = useState<string | null>(null);

  // Handle flavor selection with error clearing
  const handleSelectFlavor = (id: string) => {
    onSelectFlavor(id);
    setFlavorError(null);
  };

  // Handle Next with validation
  const handleNextClick = () => {
    if (!selectedFlavorId) {
      setFlavorError('Please select a flavor.');
      return;
    }
    setFlavorError(null);
    onNext();
  };

  // Handle Edit Done with validation
  const handleEditDone = () => {
    if (!selectedFlavorId) {
      setFlavorError('Please select a flavor.');
      return;
    }
    setFlavorError(null);
    onEditDone?.();
  };

  // Filter flavors based on search query
  const filteredFlavors = mockFlavors.filter((flavor) => {
    return searchQuery === '' || flavor.name.toLowerCase().includes(searchQuery.toLowerCase());
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
      width: fixedColumns.select,
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedFlavorId === row.id}
            onChange={() => handleSelectFlavor(row.id)}
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
            <a
              href="#"
              className="text-[var(--color-action-primary)] hover:underline text-label-md"
            >
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            {row.hasWarning && <span className="text-[var(--color-state-warning)]">⚠</span>}
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </VStack>
      ),
    },
    { key: 'vCPU', label: 'vCPU', sortable: true, flex: 1, minWidth: columnMinWidths.vCPU },
    { key: 'ram', label: 'RAM', sortable: true, flex: 1, minWidth: columnMinWidths.ram },
    { key: 'disk', label: 'Disk', sortable: true, flex: 1, minWidth: columnMinWidths.disk },
    {
      key: 'ephemeralDisk',
      label: 'Ephemeral disk',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.ephemeralDisk,
    },
    {
      key: 'networkBandwidth',
      label: 'Internal network Bandwidth',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.networkBandwidth,
    },
  ];

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header
        title="Flavor"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Flavors Label & Description */}
          <VStack gap={3} className="py-6">
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                Flavors<span className="ml-1 text-[var(--color-state-danger)]">*</span>
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Select the flavor that defines the vCPU, RAM, and disk capacity allocated to the
                instance.
              </span>
            </VStack>

            {/* Flavor Type Tabs */}
            <div>
              <Tabs value={flavorTab} onChange={setFlavorTab} variant="underline" size="sm">
                <TabList>
                  <Tab value="vcpu">vCPU</Tab>
                  <Tab value="gpu">GPU</Tab>
                  <Tab value="npu">NPU</Tab>
                  <Tab value="custom">Custom</Tab>
                </TabList>
              </Tabs>
            </div>
          </VStack>

          <VStack gap={3}>
            {/* Search */}
            <SearchInput
              placeholder="Search flavors by attributes"
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              size="sm"
              className="w-[var(--search-input-width)]"
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredFlavors.length}
              onPageChange={setCurrentPage}
              selectedCount={selectedFlavorId ? 1 : 0}
            />

            {/* Flavor Table */}
            <VStack gap={2}>
              <Table
                columns={flavorColumns}
                data={paginatedFlavors}
                rowKey="id"
                onRowClick={(row) => handleSelectFlavor(row.id)}
              />

              {/* Error Message or Selection Indicator */}
              <SelectionIndicator
                selectedItems={
                  selectedFlavorId
                    ? [
                        {
                          id: selectedFlavorId,
                          label:
                            mockFlavors.find((f) => f.id === selectedFlavorId)?.name ||
                            selectedFlavorId,
                        },
                      ]
                    : []
                }
                onRemove={() => onSelectFlavor('')}
                error={!!flavorError}
                errorMessage={flavorError}
              />
            </VStack>
          </VStack>

          {/* Divider + Next Button - hidden in edit mode or v2 */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)] mt-4" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={handleNextClick}>
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
  {
    id: 'd32059d1',
    name: 'internal-01',
    status: 'Active',
    external: false,
    access: 'Private',
    subnetCidr: '192.168.1.0/24',
  },
  {
    id: 'd32059d2',
    name: 'internal-02',
    status: 'In-active',
    external: true,
    access: 'Public',
    subnetCidr: '192.168.10.0/24',
  },
  {
    id: 'd32059d3',
    name: 'internal-03',
    status: 'Active',
    external: false,
    access: 'Private',
    subnetCidr: '10.0.0.0/16',
  },
  {
    id: 'd32059d4',
    name: 'external-net',
    status: 'Active',
    external: true,
    access: 'Public',
    subnetCidr: '10.7.60.0/24',
  },
  {
    id: 'd32059d5',
    name: 'provider-net',
    status: 'Active',
    external: true,
    access: 'Public',
    subnetCidr: '10.7.61.0/24',
  },
];

const mockFloatingIPPools: FloatingIPPoolRow[] = [
  {
    id: 'pool1',
    status: 'Active',
    name: 'provider2041',
    allocationPools: '10.7.61.11 - 10.7.61.230',
  },
  {
    id: 'pool2',
    status: 'Active',
    name: 'provider2042',
    allocationPools: '10.7.62.11 - 10.7.62.230',
  },
  {
    id: 'pool3',
    status: 'Active',
    name: 'provider2043',
    allocationPools: '10.7.63.11 - 10.7.63.230',
  },
];

const mockExistingFloatingIPs: ExistingFloatingIPRow[] = [
  {
    id: 'fip1',
    status: 'Active',
    description: 'internal-02',
    ipAddress: '10.7.60.134',
    networkName: 'external-64',
  },
  {
    id: 'fip2',
    status: 'Active',
    description: 'internal-03',
    ipAddress: '10.7.60.135',
    networkName: 'external-65',
  },
  {
    id: 'fip3',
    status: 'Active',
    description: 'web-server',
    ipAddress: '10.7.60.136',
    networkName: 'external-64',
  },
];

const mockSecurityGroups: SecurityGroupRow[] = [
  { id: 'sg1', name: 'default', description: 'Default security group', createdAt: 'Aug 15, 2025' },
  { id: 'sg2', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025' },
  {
    id: 'sg3',
    name: 'web-sg',
    description: 'Web server security group',
    createdAt: 'Sep 10, 2025',
  },
  { id: 'sg4', name: 'db-sg', description: 'Database security group', createdAt: 'Sep 15, 2025' },
];

const mockPorts: PortRow[] = [
  {
    id: 'port1',
    status: 'Active',
    name: 'internal-02',
    ownedNetwork: 'external-65',
    fixedIp: '10.7.60.135',
    macAddress: 'fa:16:3e:aa:bb:cc',
  },
  {
    id: 'port2',
    status: 'Active',
    name: 'internal-03',
    ownedNetwork: 'external-64',
    fixedIp: '10.7.60.136',
    macAddress: 'fa:16:3e:dd:ee:ff',
  },
  {
    id: 'port3',
    status: 'Active',
    name: 'web-port',
    ownedNetwork: 'internal-01',
    fixedIp: '192.168.1.10',
    macAddress: 'fa:16:3e:11:22:33',
  },
];

interface NetworkSectionProps {
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function NetworkSection({
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: NetworkSectionProps) {
  const isV2 = useIsV2();
  // Network selection
  const [selectedNetworkIds, setSelectedNetworkIds] = useState<Set<string>>(new Set());
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkPage, setNetworkPage] = useState(1);

  // Validation error
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Virtual LAN (Disclosure)
  const [vlanOpen, setVlanOpen] = useState(isV2);

  // Floating IP
  const [floatingIpOption, setFloatingIpOption] = useState<'none' | 'auto' | 'existing'>('none');
  const [selectedFloatingPool, setSelectedFloatingPool] = useState<string | null>(null);
  const [selectedExistingFip, setSelectedExistingFip] = useState<Set<string>>(new Set());
  const [fipSearch, setFipSearch] = useState('');
  const [fipPage, setFipPage] = useState(1);

  // Security groups
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<Set<string>>(new Set());
  const [sgSearch, setSgSearch] = useState('');
  const [sgPage, setSgPage] = useState(1);
  const [securityGroupError, setSecurityGroupError] = useState<string | null>(null);

  // Port (Disclosure)
  const [portOpen, setPortOpen] = useState(isV2);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [portSearch, setPortSearch] = useState('');
  const [portPage, setPortPage] = useState(1);

  // Filtered data
  const filteredNetworks = mockNetworks.filter(
    (n) => networkSearch === '' || n.name.toLowerCase().includes(networkSearch.toLowerCase())
  );

  const filteredFloatingPools = mockFloatingIPPools.filter(
    (p) => fipSearch === '' || p.name.toLowerCase().includes(fipSearch.toLowerCase())
  );

  const filteredExistingFips = mockExistingFloatingIPs.filter(
    (f) => fipSearch === '' || f.description.toLowerCase().includes(fipSearch.toLowerCase())
  );

  const filteredSecurityGroups = mockSecurityGroups.filter(
    (sg) => sgSearch === '' || sg.name.toLowerCase().includes(sgSearch.toLowerCase())
  );

  const filteredPorts = mockPorts.filter(
    (p) => portSearch === '' || p.name.toLowerCase().includes(portSearch.toLowerCase())
  );

  // Network columns
  const networkColumns: TableColumn<NetworkRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      headerRender: () => {
        const visibleIds = filteredNetworks.map((row) => row.id);
        const allSelected =
          visibleIds.length > 0 && visibleIds.every((id) => selectedNetworkIds.has(id));
        const someSelected = visibleIds.some((id) => selectedNetworkIds.has(id));
        return (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={() => {
              const newSet = new Set(selectedNetworkIds);
              if (allSelected) {
                visibleIds.forEach((id) => newSet.delete(id));
              } else {
                visibleIds.forEach((id) => newSet.add(id));
              }
              setSelectedNetworkIds(newSet);
            }}
            aria-label="Select all"
          />
        );
      },
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
          <span className="text-body-sm text-[var(--color-text-subtle)]">{row.id}</span>
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
      width: fixedColumns.select,
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
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={row.status === 'Active' ? 'active' : 'shutoff'} />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'allocationPools', label: 'Allocation pools' },
  ];

  // Existing Floating IP columns
  const existingFipColumns: TableColumn<ExistingFloatingIPRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      headerRender: () => {
        const visibleIds = filteredExistingFips.map((row) => row.id);
        const allSelected =
          visibleIds.length > 0 && visibleIds.every((id) => selectedExistingFip.has(id));
        const someSelected = visibleIds.some((id) => selectedExistingFip.has(id));
        return (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={() => {
              const newSet = new Set(selectedExistingFip);
              if (allSelected) {
                visibleIds.forEach((id) => newSet.delete(id));
              } else {
                visibleIds.forEach((id) => newSet.add(id));
              }
              setSelectedExistingFip(newSet);
            }}
            aria-label="Select all"
          />
        );
      },
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
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={row.status === 'Active' ? 'active' : 'shutoff'} />
      ),
    },
    {
      key: 'idDesc',
      label: 'ID/Description',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0} align="start">
          <span className="text-body-sm text-[var(--color-text-subtle)]">{row.id}</span>
          <span>{row.description}</span>
        </VStack>
      ),
    },
    { key: 'ipAddress', label: 'IP Address', sortable: true },
    { key: 'networkName', label: 'Network name', sortable: true },
  ];

  // Security group columns
  const securityGroupColumns: TableColumn<SecurityGroupRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      headerRender: () => {
        const visibleIds = filteredSecurityGroups.map((row) => row.id);
        const allSelected =
          visibleIds.length > 0 && visibleIds.every((id) => selectedSecurityGroups.has(id));
        const someSelected = visibleIds.some((id) => selectedSecurityGroups.has(id));
        return (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={() => {
              const newSet = new Set(selectedSecurityGroups);
              if (allSelected) {
                visibleIds.forEach((id) => newSet.delete(id));
              } else {
                visibleIds.forEach((id) => newSet.add(id));
              }
              setSelectedSecurityGroups(newSet);
            }}
            aria-label="Select all"
          />
        );
      },
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
          className="inline-flex items-center gap-1 text-label-md text-[var(--color-action-primary)] hover:underline"
        >
          <span>{row.name}</span>
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      ),
    },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'createdAt', label: 'Created at', sortable: true },
  ];

  // Port columns
  const portColumns: TableColumn<PortRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
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
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={row.status === 'Active' ? 'active' : 'shutoff'} />
      ),
    },
    {
      key: 'idName',
      label: 'ID/Name',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0} align="start">
          <span className="text-body-sm text-[var(--color-text-subtle)]">{row.id}</span>
          <span>{row.name}</span>
        </VStack>
      ),
    },
    { key: 'ownedNetwork', label: 'Owned network', sortable: true },
    { key: 'fixedIp', label: 'Fixed IP' },
    { key: 'macAddress', label: 'MAC Address' },
  ];

  // Selected items display
  const selectedNetworkNames = mockNetworks
    .filter((n) => selectedNetworkIds.has(n.id))
    .map((n) => `${n.id}(${n.name})`);

  const selectedSgNames = mockSecurityGroups
    .filter((sg) => selectedSecurityGroups.has(sg.id))
    .map((sg) => sg.name);

  // Handle Next with validation
  const handleNextClick = () => {
    let hasError = false;
    if (selectedNetworkIds.size === 0) {
      setNetworkError('Please select a network.');
      hasError = true;
    } else {
      setNetworkError(null);
    }
    if (selectedSecurityGroups.size === 0) {
      setSecurityGroupError('Please select a security group.');
      hasError = true;
    } else {
      setSecurityGroupError(null);
    }
    if (hasError) return;
    onNext();
  };

  // Handle Edit Done with validation
  const handleEditDone = () => {
    let hasError = false;
    if (selectedNetworkIds.size === 0) {
      setNetworkError('Please select a network.');
      hasError = true;
    } else {
      setNetworkError(null);
    }
    if (selectedSecurityGroups.size === 0) {
      setSecurityGroupError('Please select a security group.');
      hasError = true;
    } else {
      setSecurityGroupError(null);
    }
    if (hasError) return;
    onEditDone?.();
  };

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header
        title="Network"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Network Sub-section */}
          <VStack gap={3} className="py-6">
            <span className="text-label-lg text-[var(--color-text-default)]">
              Network
              <span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </span>

            {/* Search */}
            <SearchInput
              placeholder="Search network by attributes"
              value={networkSearch}
              onChange={(e) => setNetworkSearch(e.target.value)}
              onClear={() => setNetworkSearch('')}
              size="sm"
              className="w-[var(--search-input-width)]"
            />

            {/* Pagination */}
            <Pagination
              currentPage={networkPage}
              totalPages={Math.ceil(filteredNetworks.length / 5) || 1}
              totalItems={filteredNetworks.length}
              onPageChange={setNetworkPage}
              selectedCount={selectedNetworkIds.size}
            />

            <VStack gap={2}>
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
                  // Clear error when network is selected
                  if (newSet.size > 0) {
                    setNetworkError(null);
                  }
                }}
              />

              {/* Error Message or Selection Indicator for Networks */}
              <SelectionIndicator
                selectedItems={mockNetworks
                  .filter((n) => selectedNetworkIds.has(n.id))
                  .map((n) => ({ id: n.id, label: `${n.id}(${n.name})` }))}
                onRemove={(id) => {
                  const newSet = new Set(selectedNetworkIds);
                  newSet.delete(id);
                  setSelectedNetworkIds(newSet);
                }}
                error={!!networkError}
                errorMessage={networkError}
              />
            </VStack>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Virtual LAN Disclosure */}
          <div className="py-6">
            <Disclosure open={vlanOpen} onChange={setVlanOpen}>
              <Disclosure.Trigger>
                <HStack gap={2} align="center">
                  <span className="text-label-lg">Virtual LAN</span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(Optional)</span>
                </HStack>
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="pt-3 text-[var(--color-text-subtle)]">
                  Virtual LAN configuration options will be displayed here.
                </div>
              </Disclosure.Panel>
            </Disclosure>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Floating IP Section */}
          <VStack gap={3} className="py-6">
            <span className="text-label-lg">Floating IP</span>

            {/* Radio Options */}
            <VStack gap={2}>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio
                  value="none"
                  checked={floatingIpOption === 'none'}
                  onChange={() => setFloatingIpOption('none')}
                />
                <span className="text-body-md">None (internal only)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio
                  value="auto"
                  checked={floatingIpOption === 'auto'}
                  onChange={() => setFloatingIpOption('auto')}
                />
                <span className="text-body-md">Auto-assign IP</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio
                  value="existing"
                  checked={floatingIpOption === 'existing'}
                  onChange={() => setFloatingIpOption('existing')}
                />
                <span className="text-body-md">Use existing IP</span>
              </label>
            </VStack>

            {/* Conditional Table for Auto-assign IP */}
            {(isV2 || floatingIpOption === 'auto') && (
              <VStack gap={3} className="mt-2">
                <SearchInput
                  placeholder="Search network by attributes"
                  value={fipSearch}
                  onChange={(e) => setFipSearch(e.target.value)}
                  onClear={() => setFipSearch('')}
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />
                <Pagination
                  currentPage={fipPage}
                  totalPages={Math.ceil(filteredFloatingPools.length / 5) || 1}
                  totalItems={filteredFloatingPools.length}
                  onPageChange={setFipPage}
                  selectedCount={selectedFloatingPool ? 1 : 0}
                />
                <VStack gap={2}>
                  <Table
                    columns={floatingPoolColumns}
                    data={filteredFloatingPools}
                    rowKey="id"
                    onRowClick={(row) => setSelectedFloatingPool(row.id)}
                  />
                  <SelectionIndicator
                    selectedItems={
                      selectedFloatingPool
                        ? [
                            {
                              id: selectedFloatingPool,
                              label:
                                mockFloatingIPPools.find((p) => p.id === selectedFloatingPool)
                                  ?.name || selectedFloatingPool,
                            },
                          ]
                        : []
                    }
                    onRemove={() => setSelectedFloatingPool(null)}
                  />
                </VStack>
              </VStack>
            )}

            {/* Conditional Table for Use existing IP */}
            {(isV2 || floatingIpOption === 'existing') && (
              <VStack gap={3} className="mt-2">
                <HStack justify="between" align="center" className="w-full">
                  <SearchInput
                    placeholder="Search floating IP by attributes"
                    value={fipSearch}
                    onChange={(e) => setFipSearch(e.target.value)}
                    onClear={() => setFipSearch('')}
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />
                  <Button variant="secondary" size="sm">
                    <HStack gap={1} align="center">
                      <span>Create a new network</span>
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
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
                  selectedCount={selectedExistingFip.size}
                />
                <VStack gap={2}>
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
                  <SelectionIndicator
                    selectedItems={mockExistingFloatingIPs
                      .filter((f) => selectedExistingFip.has(f.id))
                      .map((f) => ({ id: f.id, label: `${f.ipAddress} (${f.description})` }))}
                    onRemove={(id) => {
                      const newSet = new Set(selectedExistingFip);
                      newSet.delete(id);
                      setSelectedExistingFip(newSet);
                    }}
                  />
                </VStack>
              </VStack>
            )}
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Security groups Section */}
          <VStack gap={3} className="py-6">
            <span className="text-label-lg text-[var(--color-text-default)]">
              Security groups
              <span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </span>

            <HStack justify="between" align="center" className="w-full">
              <SearchInput
                placeholder="Search security group by attributes"
                value={sgSearch}
                onChange={(e) => setSgSearch(e.target.value)}
                onClear={() => setSgSearch('')}
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button variant="secondary" size="sm">
                <HStack gap={1} align="center">
                  <span>Create a new security group</span>
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
              selectedCount={selectedSecurityGroups.size}
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
                if (newSet.size > 0) {
                  setSecurityGroupError(null);
                }
              }}
            />

            <SelectionIndicator
              selectedItems={mockSecurityGroups
                .filter((sg) => selectedSecurityGroups.has(sg.id))
                .map((sg) => ({ id: sg.id, label: sg.name }))}
              onRemove={(id) => {
                const newSet = new Set(selectedSecurityGroups);
                newSet.delete(id);
                setSelectedSecurityGroups(newSet);
              }}
              error={!!securityGroupError}
              errorMessage={securityGroupError}
            />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Port Disclosure */}
          <div className="py-6">
            <Disclosure open={portOpen} onChange={setPortOpen}>
              <Disclosure.Trigger>
                <HStack gap={2} align="center">
                  <span className="text-label-lg">Port</span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(Optional)</span>
                </HStack>
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={2} className="pt-3">
                  <SearchInput
                    placeholder="Search floating IP by attributes"
                    value={portSearch}
                    onChange={(e) => setPortSearch(e.target.value)}
                    onClear={() => setPortSearch('')}
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />
                  <Pagination
                    currentPage={portPage}
                    totalPages={Math.ceil(filteredPorts.length / 5) || 1}
                    totalItems={filteredPorts.length}
                    onPageChange={setPortPage}
                    selectedCount={selectedPortId ? 1 : 0}
                  />
                  <VStack gap={2}>
                    <Table
                      columns={portColumns}
                      data={filteredPorts}
                      rowKey="id"
                      onRowClick={(row) => setSelectedPortId(row.id)}
                    />

                    {/* Selection Indicator for Port */}
                    <SelectionIndicator
                      selectedItems={
                        selectedPortId
                          ? [
                              {
                                id: selectedPortId,
                                label:
                                  mockPorts.find((p) => p.id === selectedPortId)?.name ||
                                  selectedPortId,
                              },
                            ]
                          : []
                      }
                      onRemove={() => setSelectedPortId(null)}
                    />
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Next Button - hidden in edit mode */}
          {!isEditing && (
            <HStack justify="end" className="pt-3">
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

interface KeyPairRow {
  id: string;
  name: string;
  fingerprint: string;
}

const mockKeyPairs: KeyPairRow[] = [
  {
    id: 'kp1',
    name: 'dev-keypair',
    fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf',
  },
  {
    id: 'kp2',
    name: 'prod-keypair',
    fingerprint: 'a1:b2:c3:d4:e5:f6:g7:h8:i9:j0:k1:l2:m3:n4:o5:p6',
  },
  {
    id: 'kp3',
    name: 'staging-keypair',
    fingerprint: 'f1:e2:d3:c4:b5:a6:97:88:79:6a:5b:4c:3d:2e:1f:0g',
  },
  {
    id: 'kp4',
    name: 'test-keypair',
    fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00',
  },
  {
    id: 'kp5',
    name: 'backup-keypair',
    fingerprint: 'aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99',
  },
];

interface AuthenticationSectionProps {
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function AuthenticationSection({
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: AuthenticationSectionProps) {
  const isV2 = useIsV2();
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

  // Validation error
  const [authError, setAuthError] = useState<string | null>(null);

  // Handle key pair selection with error clearing
  const handleSelectKeyPair = (id: string) => {
    setSelectedKeyPairId(id);
    setAuthError(null);
  };

  // Handle Next - no validation required for authentication section
  const handleNextClick = () => {
    // Password validation only if password mode is selected and fields are filled
    if (loginType === 'password' && password && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthError(null);
    onNext();
  };

  // Handle Edit Done - no validation required for authentication section
  const handleEditDone = () => {
    // Password validation only if password mode is selected and fields are filled
    if (loginType === 'password' && password && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthError(null);
    onEditDone?.();
  };

  // Filtered key pairs
  const filteredKeyPairs = mockKeyPairs.filter(
    (kp) => keyPairSearch === '' || kp.name.toLowerCase().includes(keyPairSearch.toLowerCase())
  );

  // Key pair columns
  const keyPairColumns: TableColumn<KeyPairRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
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
    { key: 'fingerprint', label: 'Fingerprint', sortable: true },
  ];

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header
        title="Authentication"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      >
        <Button variant="secondary" size="sm">
          <HStack gap={1} align="center">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Create a new key pair</span>
          </HStack>
        </Button>
      </SectionCard.Header>
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Login type */}
          <VStack gap={4} className="py-6">
            <span className="text-label-lg">Login type</span>

            {isV2 ? (
              <VStack gap={6}>
                {/* Key pair block */}
                <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                  <VStack gap={4}>
                    <Tabs value="keypair" onChange={() => {}} variant="underline" size="sm">
                      <TabList>
                        <Tab value="keypair">Key pair</Tab>
                        <Tab value="password">Password</Tab>
                      </TabList>
                    </Tabs>
                    <SearchInput
                      placeholder="Search key pair by attributes"
                      value={keyPairSearch}
                      onChange={(e) => setKeyPairSearch(e.target.value)}
                      onClear={() => setKeyPairSearch('')}
                      size="sm"
                      className="w-[var(--search-input-width)]"
                    />
                    <Pagination
                      currentPage={keyPairPage}
                      totalPages={Math.ceil(filteredKeyPairs.length / 5) || 1}
                      totalItems={filteredKeyPairs.length}
                      onPageChange={setKeyPairPage}
                      selectedCount={selectedKeyPairId ? 1 : 0}
                    />
                    <VStack gap={2}>
                      <Table
                        columns={keyPairColumns}
                        data={filteredKeyPairs}
                        rowKey="id"
                        onRowClick={(row) => handleSelectKeyPair(row.id)}
                      />
                      <SelectionIndicator
                        selectedItems={
                          selectedKeyPairId
                            ? [
                                {
                                  id: selectedKeyPairId,
                                  label:
                                    mockKeyPairs.find((k) => k.id === selectedKeyPairId)?.name ||
                                    selectedKeyPairId,
                                },
                              ]
                            : []
                        }
                        onRemove={() => setSelectedKeyPairId(null)}
                      />
                    </VStack>
                  </VStack>
                </div>

                {/* Password block */}
                <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                  <VStack gap={4}>
                    <Tabs value="password" onChange={() => {}} variant="underline" size="sm">
                      <TabList>
                        <Tab value="keypair">Key pair</Tab>
                        <Tab value="password">Password</Tab>
                      </TabList>
                    </Tabs>
                    <FormField label="Login Name">
                      <Input
                        value={loginName}
                        onChange={(e) => {
                          setLoginName(e.target.value);
                          setAuthError(null);
                        }}
                        placeholder="Input login name"
                        fullWidth
                      />
                    </FormField>
                    <FormField label="Password">
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setAuthError(null);
                          }}
                          placeholder="Input password"
                          fullWidth
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                        >
                          {showPassword ? (
                            <svg
                              className="w-[14px] h-[14px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg
                              className="w-[14px] h-[14px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </FormField>
                    <FormField
                      label="Confirm Password"
                      error={!!authError}
                      errorMessage={authError || undefined}
                    >
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setAuthError(null);
                          }}
                          placeholder="Input password"
                          fullWidth
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="w-[14px] h-[14px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg
                              className="w-[14px] h-[14px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </FormField>
                  </VStack>
                </div>
              </VStack>
            ) : (
              <Tabs value={loginType} onChange={(v) => setLoginType(v as 'keypair' | 'password')}>
                <TabList>
                  <Tab value="keypair">Key pair</Tab>
                  <Tab value="password">Password</Tab>
                </TabList>

                {/* Key pair Tab Content */}
                <TabPanel value="keypair" className="pt-4">
                  <VStack gap={3}>
                    <SearchInput
                      placeholder="Search key pair by attributes"
                      value={keyPairSearch}
                      onChange={(e) => setKeyPairSearch(e.target.value)}
                      onClear={() => setKeyPairSearch('')}
                      size="sm"
                      className="w-[var(--search-input-width)]"
                    />
                    <Pagination
                      currentPage={keyPairPage}
                      totalPages={Math.ceil(filteredKeyPairs.length / 5) || 1}
                      totalItems={filteredKeyPairs.length}
                      onPageChange={setKeyPairPage}
                      selectedCount={selectedKeyPairId ? 1 : 0}
                    />
                    <VStack gap={2}>
                      <Table
                        columns={keyPairColumns}
                        data={filteredKeyPairs}
                        rowKey="id"
                        onRowClick={(row) => handleSelectKeyPair(row.id)}
                      />
                      <SelectionIndicator
                        selectedItems={
                          selectedKeyPairId
                            ? [
                                {
                                  id: selectedKeyPairId,
                                  label:
                                    mockKeyPairs.find((k) => k.id === selectedKeyPairId)?.name ||
                                    selectedKeyPairId,
                                },
                              ]
                            : []
                        }
                        onRemove={() => setSelectedKeyPairId(null)}
                      />
                    </VStack>
                  </VStack>
                </TabPanel>

                {/* Password Tab Content */}
                <TabPanel value="password" className="pt-4">
                  <VStack gap={4}>
                    <FormField label="Login Name">
                      <Input
                        value={loginName}
                        onChange={(e) => {
                          setLoginName(e.target.value);
                          setAuthError(null);
                        }}
                        placeholder="Input login name"
                        fullWidth
                      />
                    </FormField>
                    <FormField label="Password">
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setAuthError(null);
                          }}
                          placeholder="Input password"
                          fullWidth
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                        >
                          {showPassword ? (
                            <svg
                              className="w-[14px] h-[14px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg
                              className="w-[14px] h-[14px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </FormField>
                    <FormField
                      label="Confirm Password"
                      error={!!authError && loginType === 'password'}
                      errorMessage={authError && loginType === 'password' ? authError : undefined}
                    >
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setAuthError(null);
                          }}
                          placeholder="Input password"
                          fullWidth
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="w-[14px] h-[14px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg
                              className="w-[14px] h-[14px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </FormField>
                  </VStack>
                </TabPanel>
              </Tabs>
            )}
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Next Button - hidden in edit mode */}
          {!isEditing && (
            <HStack justify="end" className="pt-3">
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
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function AdvancedSection({
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: AdvancedSectionProps) {
  const isV2 = useIsV2();
  // Server group
  const [serverGroupOpen, setServerGroupOpen] = useState(isV2);
  const [selectedServerGroupId, setSelectedServerGroupId] = useState<string | null>(null);
  const [serverGroupSearch, setServerGroupSearch] = useState('');
  const [serverGroupPage, setServerGroupPage] = useState(1);

  // User data
  const [userDataOpen, setUserDataOpen] = useState(isV2);
  const [userData, setUserData] = useState('');
  const [userDataError, setUserDataError] = useState<string | null>(null);
  const MAX_USER_DATA_SIZE = 16 * 1024; // 16KB

  // Filtered server groups
  const filteredServerGroups = mockServerGroups.filter(
    (sg) =>
      serverGroupSearch === '' || sg.name.toLowerCase().includes(serverGroupSearch.toLowerCase())
  );

  // Server group columns
  const serverGroupColumns: TableColumn<ServerGroupRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
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
    {
      key: 'memberCount',
      label: 'Member count',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.memberCount,
    },
    { key: 'policy', label: 'Policy', sortable: true },
  ];

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > MAX_USER_DATA_SIZE) {
        setUserDataError('The user data exceeds the maximum size limit. (16KB)');
        e.target.value = ''; // Reset file input
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setUserData(content);
        setUserDataError(null);
      };
      reader.onerror = () => {
        setUserDataError('File upload failed. Check the file status.');
        e.target.value = ''; // Reset file input
      };
      reader.readAsText(file);
    }
  };

  // Handle user data text change with size validation
  const handleUserDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (new Blob([content]).size > MAX_USER_DATA_SIZE) {
      setUserDataError('The user data exceeds the maximum size limit. (16KB)');
    } else {
      setUserDataError(null);
    }
    setUserData(content);
  };

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header
        title="Advanced"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={onEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Server group Disclosure */}
          <div className="py-6">
            <Disclosure open={serverGroupOpen} onChange={setServerGroupOpen}>
              <Disclosure.Trigger>
                <HStack gap={2} align="center">
                  <span className="text-label-lg">Server group</span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(Optional)</span>
                </HStack>
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={2} className="pt-3">
                  {/* Search */}
                  <SearchInput
                    placeholder="Search server group by attributes"
                    value={serverGroupSearch}
                    onChange={(e) => setServerGroupSearch(e.target.value)}
                    onClear={() => setServerGroupSearch('')}
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />

                  {/* Pagination */}
                  <Pagination
                    currentPage={serverGroupPage}
                    totalPages={Math.ceil(filteredServerGroups.length / 5) || 1}
                    totalItems={filteredServerGroups.length}
                    onPageChange={setServerGroupPage}
                    selectedCount={selectedServerGroupId ? 1 : 0}
                  />

                  {/* Server group Table */}
                  <VStack gap={2}>
                    <Table
                      columns={serverGroupColumns}
                      data={filteredServerGroups}
                      rowKey="id"
                      onRowClick={(row) => setSelectedServerGroupId(row.id)}
                    />

                    {/* Selection Indicator for Server Group */}
                    <SelectionIndicator
                      selectedItems={
                        selectedServerGroupId
                          ? [
                              {
                                id: selectedServerGroupId,
                                label:
                                  mockServerGroups.find((sg) => sg.id === selectedServerGroupId)
                                    ?.name || selectedServerGroupId,
                              },
                            ]
                          : []
                      }
                      onRemove={() => setSelectedServerGroupId(null)}
                    />
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* User data Disclosure */}
          <div className="py-6">
            <Disclosure open={userDataOpen} onChange={setUserDataOpen}>
              <Disclosure.Trigger>
                <HStack gap={2} align="center">
                  <span className="text-label-lg">User data</span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(Optional)</span>
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
                          <IconUpload size={12} stroke={1.5} />
                          <span>Upload a file</span>
                        </HStack>
                      </Button>
                    </label>
                  </div>

                  {/* User data Textarea */}
                  <div className="w-full">
                    <Textarea
                      value={userData}
                      onChange={handleUserDataChange}
                      placeholder="input user data"
                      rows={6}
                      fullWidth
                      className="font-mono text-body-md"
                      error={!!userDataError}
                    />
                    <div className="flex justify-between items-start mt-2">
                      <span className="text-body-sm text-[var(--color-state-danger)]">
                        {userDataError || ''}
                      </span>
                      <span
                        className={`text-body-sm ${userDataError ? 'text-[var(--color-state-danger)]' : 'text-[var(--color-text-subtle)]'}`}
                      >
                        {(new Blob([userData]).size / 1024).toFixed(1)} / 16 KB
                      </span>
                    </div>
                  </div>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Next Button - hidden in edit mode or v2 */}
          {!isEditing && (
            <HStack justify="end" className="pt-3">
              <Button variant="primary" onClick={onNext}>
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
   TemplatesSection Component (Active Section)
   ---------------------------------------- */

interface TemplatesSectionProps {
  templates: TemplateRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSkip: () => void;
  onNext: () => void;
  isActive?: boolean;
  isEditing?: boolean;
  onEditCancel?: () => void;
  onEditDone?: () => void;
}

function TemplatesSection({
  templates,
  selectedId,
  onSelect,
  onSkip,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: TemplatesSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'favorites';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resourceType, setResourceType] = useState<'vm' | 'baremetal'>('vm');

  // Filter templates based on active tab
  const getFilteredTemplates = () => {
    let filtered = templates;

    // Filter by tab
    if (activeTab === 'favorites') {
      filtered = templates.filter((t) => t.isFavorite);
    } else if (activeTab === 'current-tenant') {
      filtered = templates.filter((t) => t.visibility === 'Private');
    } else if (activeTab === 'public') {
      filtered = templates.filter((t) => t.visibility === 'Public');
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
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
      width: fixedColumns.select,
      render: (_, row) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio value={row.id} checked={selectedId === row.id} onChange={() => onSelect(row.id)} />
        </div>
      ),
    },
    {
      key: 'favorite',
      label: '',
      width: fixedColumns.favorite,
      render: (_, row) => (
        <div className="flex items-center justify-center">
          {row.isFavorite ? (
            <IconStarFilled size={14} className="text-[var(--primitive-color-yellow400)]" />
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
            <span className="text-label-md text-[var(--color-action-primary)]">{row.name}</span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
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
      flex: 1,
      minWidth: columnMinWidths.visibility,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
  ];

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header
        title="Launch type"
        showDivider={false}
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Skip
              </Button>
              <Button variant="primary" size="sm" onClick={onEditDone}>
                Apply
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Resource type */}
          <div className="py-6">
            <FormField required>
              <FormField.Label>Resource type</FormField.Label>
              <FormField.Description>
                Choose the resource category to apply to the flavor.
              </FormField.Description>
              <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                <VStack className="gap-[var(--radio-group-item-gap)]" align="start">
                  <Radio
                    value="vm"
                    checked={resourceType === 'vm'}
                    onChange={() => setResourceType('vm')}
                    label="Virtual machine"
                  />
                  <Radio
                    value="baremetal"
                    checked={resourceType === 'baremetal'}
                    onChange={() => setResourceType('baremetal')}
                    label="Bare metal"
                  />
                </VStack>
              </FormField.Control>
            </FormField>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Templates Sub-section */}
          <VStack gap={3} align="start" className="w-full py-6">
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Templates</span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Select the template to use for creating the instance. A template includes predefined
                settings such as the image, flavor, and network configuration required for the
                instance.
              </span>
            </VStack>

            {/* Tabs */}
            <div className="w-full">
              <Tabs
                value={activeTab}
                onChange={setActiveTab}
                size="sm"
                variant="underline"
                className="w-full"
              >
                <TabList>
                  <Tab value="favorites">Favorites</Tab>
                  <Tab value="current-tenant">Current tenant</Tab>
                  <Tab value="public">Public</Tab>
                </TabList>

                <TabPanel value="favorites" className="pt-3">
                  <VStack gap={2} className="w-full">
                    {/* Action Bar - Search + Create Button */}
                    <HStack justify="between" align="center" className="w-full">
                      <SearchInput
                        placeholder="Search templates by attributes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        size="sm"
                        className="w-[var(--search-input-width)]"
                      />
                      <Button variant="outline" size="sm">
                        <span>Create a new template</span>
                        <IconExternalLink size={12} stroke={1.5} />
                      </Button>
                    </HStack>

                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.max(1, Math.ceil(filteredTemplates.length / 10))}
                      totalItems={filteredTemplates.length}
                      onPageChange={setCurrentPage}
                      selectedCount={selectedId ? 1 : 0}
                    />

                    {/* Table with Selection */}
                    <VStack gap={2}>
                      {filteredTemplates.length > 0 ? (
                        <Table
                          columns={columns}
                          data={filteredTemplates}
                          rowKey="id"
                          onRowClick={(row) => onSelect(row.id)}
                        />
                      ) : (
                        <div className="text-body-md text-[var(--color-text-subtle)] py-8 text-center border border-[var(--color-border-default)] rounded-md">
                          No favorite templates
                        </div>
                      )}
                    </VStack>
                  </VStack>
                </TabPanel>

                <TabPanel value="current-tenant" className="pt-3">
                  <VStack gap={2} className="w-full">
                    {/* Action Bar - Search + Create Button */}
                    <HStack justify="between" align="center" className="w-full">
                      <SearchInput
                        placeholder="Search templates by attributes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        size="sm"
                        className="w-[var(--search-input-width)]"
                      />
                      <Button variant="outline" size="sm">
                        <span>Create a new template</span>
                        <IconExternalLink size={12} stroke={1.5} />
                      </Button>
                    </HStack>

                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.max(1, Math.ceil(filteredTemplates.length / 10))}
                      totalItems={filteredTemplates.length}
                      onPageChange={setCurrentPage}
                      selectedCount={selectedId ? 1 : 0}
                    />

                    {/* Table with Selection */}
                    {filteredTemplates.length > 0 ? (
                      <Table
                        columns={columns}
                        data={filteredTemplates}
                        rowKey="id"
                        onRowClick={(row) => onSelect(row.id)}
                      />
                    ) : (
                      <div className="text-body-md text-[var(--color-text-subtle)] py-8 text-center border border-[var(--color-border-default)] rounded-md">
                        No templates in current tenant
                      </div>
                    )}
                  </VStack>
                </TabPanel>

                <TabPanel value="public" className="pt-3">
                  <VStack gap={2} className="w-full">
                    {/* Action Bar - Search + Create Button */}
                    <HStack justify="between" align="center" className="w-full">
                      <SearchInput
                        placeholder="Search templates by attributes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        size="sm"
                        className="w-[var(--search-input-width)]"
                      />
                      <Button variant="outline" size="sm">
                        <span>Create a new template</span>
                        <IconExternalLink size={12} stroke={1.5} />
                      </Button>
                    </HStack>

                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.max(1, Math.ceil(filteredTemplates.length / 10))}
                      totalItems={filteredTemplates.length}
                      onPageChange={setCurrentPage}
                      selectedCount={selectedId ? 1 : 0}
                    />

                    {/* Table with Selection */}
                    {filteredTemplates.length > 0 ? (
                      <Table
                        columns={columns}
                        data={filteredTemplates}
                        rowKey="id"
                        onRowClick={(row) => onSelect(row.id)}
                      />
                    ) : (
                      <div className="text-body-md text-[var(--color-text-subtle)] py-8 text-center border border-[var(--color-border-default)] rounded-md">
                        No public templates available
                      </div>
                    )}
                  </VStack>
                </TabPanel>
              </Tabs>
            </div>

            {/* Selection Indicator for Templates */}
            <SelectionIndicator
              selectedItems={
                selectedId
                  ? [
                      {
                        id: selectedId,
                        label: templates.find((t) => t.id === selectedId)?.name || selectedId,
                      },
                    ]
                  : []
              }
              onRemove={() => onSelect('')}
            />
          </VStack>

          {/* Action Buttons - only show when not editing or v2 */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack gap={2} justify="end" className="pt-3">
                <Button variant="outline" onClick={onSkip} className="min-w-[80px]">
                  Skip
                </Button>
                <Button variant="primary" onClick={onNext} className="min-w-[80px]">
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
   CreateInstancePage
   ---------------------------------------- */

export function CreateInstancePage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status management
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    templates: 'active',
    'basic-info': isV2 ? 'active' : 'pre',
    image: isV2 ? 'active' : 'pre',
    flavor: isV2 ? 'active' : 'pre',
    network: isV2 ? 'active' : 'pre',
    authentication: isV2 ? 'active' : 'pre',
    advanced: isV2 ? 'active' : 'pre',
  });

  // Editing mode - tracks which section is being edited (null = not editing, creating new)
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Tracks sections that were in editing mode before becoming 'writing' state
  const [editingWritingSections, setEditingWritingSections] = useState<SectionStep[]>([]);

  // Form state
  const [numberOfInstances, setNumberOfInstances] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Basic information state
  const [instanceName, setInstanceName] = useState('');
  const [availabilityZone, setAvailabilityZone] = useState('nova');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState<{ key: string; value: string }[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

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
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<Set<string>>(new Set());
  const [floatingIpOption, setFloatingIpOption] = useState<'none' | 'auto' | 'existing'>('none');

  // Authentication state
  const [loginType, setLoginType] = useState<'keypair' | 'password'>('keypair');
  const [selectedKeyPairId, setSelectedKeyPairId] = useState<string | null>(null);

  // Advanced state
  const [selectedServerGroupId, setSelectedServerGroupId] = useState<string | null>(null);
  const [userData, setUserData] = useState('');

  // Convert tabs for TabBar
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle cancel
  const handleCancel = () => {
    navigate('/compute/instances');
  };

  // Handle create
  const handleCreate = () => {
    navigate('/compute/instances');
  };

  // Get current active section
  const getActiveSection = (): SectionStep | null => {
    return SECTION_ORDER.find((section) => sectionStatus[section] === 'active') || null;
  };

  // Handle Skip (for Templates section only)
  const handleSkip = (section: SectionStep) => {
    if (isV2) return;
    const currentIndex = SECTION_ORDER.indexOf(section);
    if (currentIndex === -1 || currentIndex >= SECTION_ORDER.length - 1) return;

    const nextSection = SECTION_ORDER[currentIndex + 1];

    // Clear selection when skipping
    if (section === 'templates') {
      setSelectedTemplateId(null);
    }

    setSectionStatus((prev) => ({
      ...prev,
      [section]: 'skipped',
      [nextSection]: 'active',
    }));
  };

  // Handle Next (complete current section, activate next)
  // Apply template configuration to all sections
  const applyTemplate = (templateId: string) => {
    const template = mockTemplates.find((t) => t.id === templateId);
    if (!template?.config) return;

    const config = template.config;

    // Basic information
    if (config.instanceNamePrefix) setInstanceName(config.instanceNamePrefix);
    if (config.availabilityZone) setAvailabilityZone(config.availabilityZone);
    if (config.description) setDescription(config.description);

    // Image
    if (config.imageId) setSelectedImageId(config.imageId);
    if (config.storageOption) setStorageOption(config.storageOption);
    if (config.storageType) setStorageType(config.storageType);
    if (config.storageSize !== undefined) setStorageSize(config.storageSize);
    if (config.deleteWithInstance !== undefined) setDeleteWithInstance(config.deleteWithInstance);

    // Flavor
    if (config.flavorId) setSelectedFlavorId(config.flavorId);

    // Network
    if (config.networkIds) setSelectedNetworkIds(new Set(config.networkIds));
    if (config.securityGroupIds) setSelectedSecurityGroups(new Set(config.securityGroupIds));
    if (config.floatingIpOption) setFloatingIpOption(config.floatingIpOption);

    // Authentication
    if (config.loginType) setLoginType(config.loginType);
    if (config.keyPairId) setSelectedKeyPairId(config.keyPairId);

    // Advanced
    if (config.serverGroupId) setSelectedServerGroupId(config.serverGroupId);
    if (config.userData) setUserData(config.userData);

    // Mark all sections as done except the next one (basic-info will be active)
    setSectionStatus({
      templates: 'done',
      'basic-info': 'active', // User needs to set Instance name
      image: 'done',
      flavor: 'done',
      network: 'done',
      authentication: 'done',
      advanced: 'done',
    });
  };

  const handleNext = (section: SectionStep) => {
    if (isV2) return;
    const currentIndex = SECTION_ORDER.indexOf(section);
    if (currentIndex === -1) return;

    // If templates section and a template is selected, apply the template
    if (section === 'templates' && selectedTemplateId) {
      applyTemplate(selectedTemplateId);
      return;
    }

    // If Basic information after template applied, just mark as done (don't go to next section)
    // All other sections are already done from template
    if (section === 'basic-info' && selectedTemplateId) {
      setSectionStatus((prev) => ({
        ...prev,
        [section]: 'done',
      }));
      return;
    }

    const nextSection = SECTION_ORDER[currentIndex + 1];

    if (nextSection) {
      setSectionStatus((prev) => ({
        ...prev,
        [section]: 'done',
        [nextSection]: 'active',
      }));
    } else {
      // Last section - mark as done
      setSectionStatus((prev) => ({
        ...prev,
        [section]: 'done',
      }));
    }
  };

  // Handle Edit (reactivate a completed section - only one active section at a time)
  const handleEdit = (section: SectionStep) => {
    if (isV2) return;
    // If already in edit mode, set current editing section to 'writing'
    if (editingSection) {
      // Track that this section was in editing mode before becoming 'writing'
      setEditingWritingSections((prev) => [...prev, editingSection]);

      setSectionStatus((prev) => {
        const newStatus = { ...prev };
        // Current editing section becomes 'writing' (preserving work)
        newStatus[editingSection] = 'writing';
        // New section becomes active (edit mode)
        newStatus[section] = 'active';
        return newStatus;
      });
      setEditingSection(section);
    } else {
      // Not in edit mode - set current active section to 'writing'
      setEditingSection(section);

      setSectionStatus((prev) => {
        const newStatus = { ...prev };

        // Find and set currently active section to 'writing'
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'active' && key !== section) {
            newStatus[key] = 'writing';
          }
        }

        // Activate the edited section
        newStatus[section] = 'active';

        return newStatus;
      });
    }
  };

  // Handle Edit Cancel (restore section to done state and reactivate previous section)
  const handleEditCancel = () => {
    if (isV2) return;
    if (editingSection) {
      // Find the topmost 'writing' section
      const topmostWriting = SECTION_ORDER.find((key) => sectionStatus[key] === 'writing');

      // Check if topmostWriting was in editing mode
      const wasEditing = topmostWriting && editingWritingSections.includes(topmostWriting);

      setSectionStatus((prev) => {
        const newStatus = { ...prev };
        // Mark current editing section as done
        newStatus[editingSection] = 'done';

        // Make topmost writing section active
        if (topmostWriting) {
          newStatus[topmostWriting] = 'active';
        }

        return newStatus;
      });

      if (wasEditing && topmostWriting) {
        // Restore editing mode for this section
        setEditingSection(topmostWriting);
        setEditingWritingSections((prev) => prev.filter((s) => s !== topmostWriting));
      } else {
        // Not in editing mode, just activate
        setEditingSection(null);
      }
    }
  };

  // Handle Edit Done (complete editing, mark section as done and activate topmost writing section)
  const handleEditDone = () => {
    if (isV2) return;
    if (editingSection) {
      // Find the topmost 'writing' section
      const topmostWriting = SECTION_ORDER.find((key) => sectionStatus[key] === 'writing');

      // Check if topmostWriting was in editing mode
      const wasEditing = topmostWriting && editingWritingSections.includes(topmostWriting);

      setSectionStatus((prev) => {
        const newStatus = { ...prev };
        // Mark current editing section as done
        newStatus[editingSection] = 'done';

        // Make topmost writing section active
        if (topmostWriting) {
          newStatus[topmostWriting] = 'active';
        }

        return newStatus;
      });

      if (wasEditing && topmostWriting) {
        // Restore editing mode for this section
        setEditingSection(topmostWriting);
        setEditingWritingSections((prev) => prev.filter((s) => s !== topmostWriting));
      } else {
        // Not in editing mode, just activate
        setEditingSection(null);
      }
    }
  };

  // Get summary data for done sections
  const getTemplateSummary = () => {
    if (!selectedTemplateId) return null;
    const template = mockTemplates.find((t) => t.id === selectedTemplateId);
    return template ? template.name : null;
  };

  const getImageSummary = () => {
    if (!selectedImageId) return null;
    const image = mockImages.find((i) => i.id === selectedImageId);
    return image ? image.name : null;
  };

  const getFlavorSummary = () => {
    if (!selectedFlavorId) return null;
    const flavor = mockFlavors.find((f) => f.id === selectedFlavorId);
    return flavor ? `${flavor.vCPU}vCPU/${flavor.ram}/${flavor.disk}` : null;
  };

  const getStorageSummary = () => {
    if (storageOption === 'no-create') return 'No system disk';
    return `${storageType} ${storageSize}GiB${deleteWithInstance ? ' (Deleted with instance)' : ''}`;
  };

  const getNetworkSummary = () => {
    const networks = mockNetworks.filter((n) => selectedNetworkIds.has(n.id));
    return networks.map((n) => n.name).join(', ') || '-';
  };

  const getSecurityGroupSummary = () => {
    const sgs = mockSecurityGroups.filter((sg) => selectedSecurityGroups.has(sg.id));
    return sgs.map((sg) => sg.name).join(', ') || '-';
  };

  const getAuthSummary = () => {
    if (loginType === 'keypair') {
      const kp = mockKeyPairs.find((k) => k.id === selectedKeyPairId);
      return kp ? `Key pair: ${kp.name}` : 'Key pair: -';
    }
    return 'Password';
  };

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
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Instances list', href: '/compute/instances' },
                { label: 'Create instance' },
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
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create instance</h1>
        </div>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Templates Section */}
            {sectionStatus.templates === 'pre' && <PreSection title={SECTION_LABELS.templates} />}
            {sectionStatus.templates === 'writing' && (
              <WritingSection title={SECTION_LABELS.templates} />
            )}
            {sectionStatus.templates === 'active' && (
              <TemplatesSection
                templates={mockTemplates}
                selectedId={selectedTemplateId}
                onSelect={setSelectedTemplateId}
                onSkip={() => handleSkip('templates')}
                onNext={() => handleNext('templates')}
                isActive
                isEditing={editingSection === 'templates'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {(isV2 || sectionStatus.templates === 'done') && (
              <DoneSection title={SECTION_LABELS.templates} onEdit={() => handleEdit('templates')}>
                <SectionCard.DataRow
                  label="Resource type"
                  value="Virtual machine"
                  showDivider={false}
                />
                <SectionCard.DataRow
                  label="Template"
                  value={getTemplateSummary() || 'None selected'}
                />
              </DoneSection>
            )}
            {sectionStatus.templates === 'skipped' && (
              <SkippedSection
                title={SECTION_LABELS.templates}
                onEdit={() => handleEdit('templates')}
              />
            )}

            {/* Basic information Section */}
            {!isV2 && sectionStatus['basic-info'] === 'pre' && (
              <PreSection title={SECTION_LABELS['basic-info']} />
            )}
            {!isV2 && sectionStatus['basic-info'] === 'writing' && (
              <WritingSection title={SECTION_LABELS['basic-info']} />
            )}
            {(isV2 || sectionStatus['basic-info'] === 'active') && (
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
                isActive
                isEditing={editingSection === 'basic-info'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {(isV2 || sectionStatus['basic-info'] === 'done') && (
              <DoneSection
                title={SECTION_LABELS['basic-info']}
                onEdit={() => handleEdit('basic-info')}
              >
                <SectionCard.DataRow
                  label="Instance name"
                  value={instanceName || '-'}
                  showDivider={false}
                />
                <SectionCard.DataRow label="AZ (Availability zone)" value={availabilityZone} />
                <SectionCard.DataRow label="Description" value={description || '-'} />
              </DoneSection>
            )}

            {/* Image Section */}
            {sectionStatus.image === 'pre' && <PreSection title={SECTION_LABELS.image} />}
            {sectionStatus.image === 'writing' && <WritingSection title={SECTION_LABELS.image} />}
            {sectionStatus.image === 'active' && (
              <ImageSection
                selectedImageId={selectedImageId}
                onSelectImage={setSelectedImageId}
                onNext={() => handleNext('image')}
                isActive
                isEditing={editingSection === 'image'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {(isV2 || sectionStatus.image === 'done') && (
              <DoneSection title={SECTION_LABELS.image} onEdit={() => handleEdit('image')}>
                <SectionCard.DataRow
                  label="Image"
                  value={getImageSummary() || '-'}
                  showDivider={false}
                />
                <SectionCard.DataRow label="System disk" value={getStorageSummary()} />
              </DoneSection>
            )}

            {/* Flavor Section */}
            {sectionStatus.flavor === 'pre' && <PreSection title={SECTION_LABELS.flavor} />}
            {sectionStatus.flavor === 'writing' && <WritingSection title={SECTION_LABELS.flavor} />}
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
            {(isV2 || sectionStatus.flavor === 'done') && (
              <DoneSection title={SECTION_LABELS.flavor} onEdit={() => handleEdit('flavor')}>
                <SectionCard.DataRow
                  label="Flavor"
                  value={getFlavorSummary() || '-'}
                  showDivider={false}
                />
              </DoneSection>
            )}

            {/* Network Section */}
            {sectionStatus.network === 'pre' && <PreSection title={SECTION_LABELS.network} />}
            {sectionStatus.network === 'writing' && (
              <WritingSection title={SECTION_LABELS.network} />
            )}
            {sectionStatus.network === 'active' && (
              <NetworkSection
                onNext={() => handleNext('network')}
                isActive
                isEditing={editingSection === 'network'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {(isV2 || sectionStatus.network === 'done') && (
              <DoneSection title={SECTION_LABELS.network} onEdit={() => handleEdit('network')}>
                <SectionCard.DataRow
                  label="Network"
                  value={getNetworkSummary()}
                  showDivider={false}
                />
                <SectionCard.DataRow label="Security groups" value={getSecurityGroupSummary()} />
              </DoneSection>
            )}

            {/* Authentication Section */}
            {sectionStatus.authentication === 'pre' && (
              <PreSection title={SECTION_LABELS.authentication} />
            )}
            {sectionStatus.authentication === 'writing' && (
              <WritingSection title={SECTION_LABELS.authentication} />
            )}
            {sectionStatus.authentication === 'active' && (
              <AuthenticationSection
                onNext={() => handleNext('authentication')}
                isActive
                isEditing={editingSection === 'authentication'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {(isV2 || sectionStatus.authentication === 'done') && (
              <DoneSection
                title={SECTION_LABELS.authentication}
                onEdit={() => handleEdit('authentication')}
              >
                <SectionCard.DataRow
                  label="Login type"
                  value={getAuthSummary()}
                  showDivider={false}
                />
              </DoneSection>
            )}

            {/* Advanced Section */}
            {sectionStatus.advanced === 'pre' && <PreSection title={SECTION_LABELS.advanced} />}
            {sectionStatus.advanced === 'writing' && (
              <WritingSection title={SECTION_LABELS.advanced} />
            )}
            {sectionStatus.advanced === 'active' && (
              <AdvancedSection
                onNext={() => handleNext('advanced')}
                isActive={!isV2}
                isEditing={editingSection === 'advanced'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {(isV2 || sectionStatus.advanced === 'done') && (
              <DoneSection title={SECTION_LABELS.advanced} onEdit={() => handleEdit('advanced')}>
                <SectionCard.DataRow
                  label="Server group"
                  value={
                    selectedServerGroupId
                      ? mockServerGroups.find((sg) => sg.id === selectedServerGroupId)?.name
                      : '-'
                  }
                  showDivider={false}
                />
                <SectionCard.DataRow label="User data" value={userData ? 'Configured' : '-'} />
              </DoneSection>
            )}
          </VStack>

          {/* Right Column - Quota Sidebar */}
          <QuotaSidebar
            numberOfInstances={numberOfInstances}
            onNumberOfInstancesChange={setNumberOfInstances}
            quota={mockQuota}
            onCancel={handleCancel}
            sectionStatus={sectionStatus}
            editingSection={editingSection}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateInstancePage;
