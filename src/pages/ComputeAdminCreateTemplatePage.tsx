import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsV2 } from '@/hooks/useIsV2';
import {
  Button,
  Breadcrumb,
  NumberInput,
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
  SearchInput,
  Radio,
  RadioGroup,
  Input,
  Select,
  Textarea,
  SectionCard,
  Checkbox,
  StatusIndicator,
  Toggle,
  IconUbuntu,
  IconGrid,
  IconRocky,
  SelectionIndicator,
  PageShell,
  fixedColumns,
  columnMinWidths,
  WizardSectionStatusIcon,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconAlertCircle,
  IconBell,
  IconCaretDownFilled,
  IconCaretRightFilled,
  IconDots,
  IconDownload,
  IconEdit,
  IconExternalLink,
  IconCirclePlus,
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
  createdAt: string;
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
    createdAt: 'Jan 15, 2025',
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
    createdAt: 'Jan 14, 2025',
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
    createdAt: 'Jan 13, 2025',
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
    createdAt: 'Jan 10, 2025',
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
    createdAt: 'Jan 8, 2025',
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
    createdAt: 'Jan 5, 2025',
  },
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
  {
    id: '34vwx012',
    name: 't3.large',
    vCPU: 2,
    ram: '8GiB',
    disk: '30GiB',
    isPublic: true,
    hasWarning: true,
  },
  { id: '56yza345', name: 'c5.xlarge', vCPU: 4, ram: '8GiB', disk: '50GiB', isPublic: true },
  { id: '78bcd678', name: 'p3.2xlarge', vCPU: 8, ram: '61GiB', disk: '500GiB', isPublic: false },
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
  { id: 'sg1', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025' },
  { id: 'sg2', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025' },
  { id: 'sg3', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025' },
  { id: 'sg4', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025' },
  { id: 'sg5', name: 'suite-default', description: 'test only', createdAt: 'Sep 1, 2025' },
];

const mockPorts: PortRow[] = [
  {
    id: 'port1',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d1',
    fixedIP: '10.76.0.135',
    macAddress: '10.76.0.135',
    status: 'active',
  },
  {
    id: 'port2',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d2',
    fixedIP: '10.76.0.135',
    macAddress: '10.76.0.135',
    status: 'active',
  },
  {
    id: 'port3',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d3',
    fixedIP: '10.76.0.135',
    macAddress: '10.76.0.135',
    status: 'active',
  },
  {
    id: 'port4',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d4',
    fixedIP: '10.76.0.135',
    macAddress: '10.76.0.135',
    status: 'active',
  },
  {
    id: 'port5',
    name: 'port',
    ownedNetwork: 'network',
    ownedNetworkId: 'd32059d5',
    fixedIP: '10.76.0.135',
    macAddress: '10.76.0.155',
    status: 'error',
  },
];

const mockKeyPairs: KeyPairRow[] = [
  { id: 'kp1', name: 'dev-keypair', fingerprint: 'a1:b2:c3:d4:e5', createdAt: 'Jan 1, 2025' },
  { id: 'kp2', name: 'prod-keypair', fingerprint: 'f6:g7:h8:i9:j0', createdAt: 'Jan 15, 2025' },
  { id: 'kp3', name: 'staging-keypair', fingerprint: 'k1:l2:m3:n4:o5', createdAt: 'Feb 1, 2025' },
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
            <h5 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">Summary</h5>
            <div className="flex flex-col">
              {SECTION_ORDER.map((sectionKey) => {
                const isWriting = sectionStatus[sectionKey] === 'writing';

                return (
                  <div key={sectionKey} className="flex items-center justify-between py-1">
                    <span className="text-body-md leading-5 text-[var(--color-text-default)]">
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
   PreSection Component
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
   WritingSection Component
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
   TemplateInformationSection Component
   ---------------------------------------- */

// Mock tenant data for tenant selection
interface Tenant {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

const mockTenants: Tenant[] = [
  { id: 'tenant-001', name: 'tenant A', description: '-', status: 'active' },
  { id: 'tenant-002', name: 'tenant B', description: 'Development team', status: 'active' },
  { id: 'tenant-003', name: 'tenant C', description: 'Production', status: 'active' },
  { id: 'tenant-004', name: 'tenant D', description: 'Testing', status: 'active' },
  { id: 'tenant-005', name: 'tenant E', description: 'Staging', status: 'inactive' },
];

interface TemplateInformationSectionProps {
  templateName: string;
  onTemplateNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  isFavorite: boolean;
  onIsFavoriteChange: (value: boolean) => void;
  selectedTenant: string | null;
  onSelectedTenantChange: (tenantId: string | null) => void;
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
  selectedTenant,
  onSelectedTenantChange,
  onNext,
  isActive = false,
  isEditing = false,
  onEditCancel,
  onEditDone,
}: TemplateInformationSectionProps) {
  const [templateNameError, setTemplateNameError] = useState<string | null>(null);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [tenantSearchQuery, setTenantSearchQuery] = useState('');
  const [tenantCurrentPage, setTenantCurrentPage] = useState(1);
  const tenantsPerPage = 5;

  // Filter tenants by search query
  const filteredTenants = mockTenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      tenant.id.toLowerCase().includes(tenantSearchQuery.toLowerCase())
  );
  const totalTenantPages = Math.ceil(filteredTenants.length / tenantsPerPage);
  const paginatedTenants = filteredTenants.slice(
    (tenantCurrentPage - 1) * tenantsPerPage,
    tenantCurrentPage * tenantsPerPage
  );

  const handleNameChange = (value: string) => {
    onTemplateNameChange(value);
    if (value.trim()) setTemplateNameError(null);
  };

  const handleTenantSelect = (tenantId: string) => {
    onSelectedTenantChange(tenantId);
    if (tenantId) setTenantError(null);
  };

  const handleNextClick = () => {
    let hasError = false;

    if (!templateName.trim()) {
      setTemplateNameError('Please enter a template name.');
      hasError = true;
    } else {
      setTemplateNameError(null);
    }

    // Validate tenant selection when Private is selected
    if (!isFavorite && !selectedTenant) {
      setTenantError('Please select a tenant.');
      hasError = true;
    } else {
      setTenantError(null);
    }

    if (hasError) return;
    onNext();
  };

  const handleEditDone = () => {
    let hasError = false;

    if (!templateName.trim()) {
      setTemplateNameError('Please enter a template name.');
      hasError = true;
    } else {
      setTemplateNameError(null);
    }

    // Validate tenant selection when Private is selected
    if (!isFavorite && !selectedTenant) {
      setTenantError('Please select a tenant.');
      hasError = true;
    } else {
      setTenantError(null);
    }

    if (hasError) return;
    onEditDone?.();
  };

  return (
    <SectionCard isActive={isActive}>
      <SectionCard.Header
        title="Template information"
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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Template name */}
          <VStack gap={2} className="py-6">
            <span className="text-label-lg text-[var(--color-text-default)]">
              Template name <span className="text-[var(--color-state-danger)]">*</span>
            </span>
            <VStack gap={2}>
              <Input
                placeholder="Enter instance template name"
                value={templateName}
                onChange={(e) => handleNameChange(e.target.value)}
                fullWidth
                error={!!templateNameError}
              />
              {templateNameError && (
                <span className="text-body-sm leading-[var(--line-height-16)] text-[var(--color-state-danger)]">
                  {templateNameError}
                </span>
              )}
            </VStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              You can use letters, numbers, and special characters (+=,.@-_), and the length must be
              between 2-128 characters.
            </span>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Description */}
          <VStack gap={2} className="py-6">
            <span className="text-label-lg text-[var(--color-text-default)]">Description</span>
            <Input
              placeholder="Enter description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              fullWidth
            />
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
              characters.
            </span>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Visibility */}
          <VStack gap={3} className="py-6">
            <span className="text-label-lg text-[var(--color-text-default)]">
              Visibility<span className="text-[var(--color-state-danger)]">*</span>
            </span>
            <RadioGroup
              value={isFavorite ? 'public' : 'private'}
              onChange={(value) => onIsFavoriteChange(value === 'public')}
              orientation="horizontal"
            >
              <Radio value="public" label="Public" />
              <Radio value="private" label="Private" />
            </RadioGroup>
          </VStack>

          {/* Tenant Section - shown when Private is selected */}
          {!isFavorite && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <VStack gap={4} className="py-6">
                <VStack gap={2}>
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    Tenant<span className="text-[var(--color-state-danger)]">*</span>
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">
                    Select the tenant that can use the template.
                  </span>
                </VStack>

                {/* Search */}
                <SearchInput
                  placeholder="Search tenants by attributes"
                  value={tenantSearchQuery}
                  onChange={(e) => {
                    setTenantSearchQuery(e.target.value);
                    setTenantCurrentPage(1);
                  }}
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={tenantCurrentPage}
                  totalPages={totalTenantPages}
                  totalItems={filteredTenants.length}
                  onPageChange={setTenantCurrentPage}
                  selectedCount={selectedTenant ? 1 : 0}
                />

                {/* Tenant Table + Selection indicator */}
                <VStack gap={2}>
                  <Table<Tenant>
                    columns={[
                      {
                        key: 'id',
                        label: '',
                        width: fixedColumns.select,
                        align: 'center',
                        render: (_, row) => (
                          <Radio
                            value={row.id}
                            checked={selectedTenant === row.id}
                            onChange={() => handleTenantSelect(row.id)}
                          />
                        ),
                      },
                      {
                        key: 'status',
                        label: 'Status',
                        width: fixedColumns.status,
                        align: 'center',
                        render: (_, row) => (
                          <StatusIndicator
                            status={row.status === 'active' ? 'active' : 'deactivated'}
                            layout="icon-only"
                          />
                        ),
                      },
                      {
                        key: 'name',
                        label: 'Name',
                        sortable: true,
                        render: (value: string, row: Tenant) => (
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-label-md text-[var(--color-action-primary)]">
                              {value}
                            </span>
                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                              ID: {row.id}
                            </span>
                          </div>
                        ),
                      },
                      {
                        key: 'description',
                        label: 'Description',
                        sortable: true,
                      },
                    ]}
                    data={paginatedTenants}
                    rowKey="id"
                    onRowClick={(row) => handleTenantSelect(row.id)}
                  />
                  <SelectionIndicator
                    selectedItems={
                      selectedTenant
                        ? [
                            {
                              id: selectedTenant,
                              label:
                                mockTenants.find((t) => t.id === selectedTenant)?.name ||
                                selectedTenant,
                            },
                          ]
                        : []
                    }
                    onRemove={() => onSelectedTenantChange(null)}
                    emptyText="No item selected"
                    error={!!tenantError}
                    errorMessage={tenantError || undefined}
                  />
                </VStack>
              </VStack>
            </>
          )}

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* AZ (Availability zone) */}
          <VStack gap={2} className="py-6">
            <span className="text-label-lg text-[var(--color-text-default)]">
              AZ (Availability zone)
            </span>
            <span className="text-body-md text-[var(--color-text-subtle)]">
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
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={onNext}>
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
  isV2?: boolean;
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
  isV2 = false,
}: ImageSectionProps) {
  const [sourceTab, setSourceTab] = useState('image');
  const [osFilter, setOsFilter] = useState<'ubuntu' | 'windows' | 'rocky' | 'other'>('other');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [createSystemDisk, setCreateSystemDisk] = useState(isV2 ? true : false);
  const [_dataDisks, setDataDisks] = useState<{ id: string; type: string; size: number }[]>([]);
  const itemsPerPage = 5;

  const handleSelectImage = (id: string) => {
    onSelectImage(id);
    setImageError(null);
  };

  const handleNextClick = () => {
    onNext();
  };

  const handleEditDone = () => {
    onEditDone?.();
  };

  const filteredImages = mockImages.filter((img) => {
    const matchesOs = osFilter === 'other' || img.os === osFilter;
    const matchesSearch =
      searchQuery === '' || img.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOs && matchesSearch;
  });

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage) || 1;
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get selected image info
  const selectedImage = mockImages.find((img) => img.id === selectedImageId);

  // Add data disk handler
  const handleAddDataDisk = () => {
    setDataDisks((prev) => [...prev, { id: `dd-${Date.now()}`, type: '_DEFAULT_', size: 10 }]);
  };

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
            onChange={() => handleSelectImage(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
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
    { key: 'version', label: 'Version', sortable: true, flex: 1 },
    { key: 'size', label: 'Size', sortable: true, flex: 1 },
    { key: 'minDisk', label: 'Min disk', sortable: true, flex: 1 },
    { key: 'minRam', label: 'Min RAM', sortable: true, flex: 1 },
    { key: 'access', label: 'Visibility', sortable: true, flex: 1 },
  ];

  // Snapshot columns (without Min disk and Min RAM)
  const snapshotColumns: TableColumn<ImageRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
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
      width: fixedColumns.status,
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
    { key: 'version', label: 'Version', sortable: true, flex: 1 },
    { key: 'size', label: 'Size', sortable: true, flex: 1 },
    {
      key: 'access',
      label: 'Source instance',
      sortable: true,
      flex: 1,
      render: (value, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <a
              href="#"
              className="text-[var(--color-action-primary)] hover:underline text-label-md"
            >
              {value || 'instance-01'}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </VStack>
      ),
    },
    { key: 'createdAt', label: 'Created at', sortable: true, flex: 1 },
  ];

  // Volume columns (without Min disk and Min RAM)
  const volumeColumns: TableColumn<ImageRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
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
      width: fixedColumns.status,
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
    { key: 'version', label: 'Version', sortable: true, flex: 1 },
    { key: 'size', label: 'Size', sortable: true, flex: 1 },
    {
      key: 'access',
      label: 'Bootable',
      sortable: true,
      flex: 1,
      render: (value) => (value === 'Public' ? 'On' : 'Off'),
    },
    { key: 'createdAt', label: 'Created at', sortable: true, flex: 1 },
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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <div className="py-6">
            {/* Start Source */}
            <VStack gap={3}>
              <span className="text-label-lg text-[var(--color-text-default)]">Start source</span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Select a template to launch the instance. You can start from an OS image, a
                snapshot, or an existing volume.
              </span>

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
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        onClear={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        size="sm"
                        className="w-[var(--search-input-width)] mt-2"
                      />
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredImages.length}
                        itemsPerPage={itemsPerPage}
                        selectedCount={selectedImageId ? 1 : 0}
                      />
                      <Table
                        columns={imageColumns}
                        data={paginatedImages}
                        onRowClick={(row) => handleSelectImage(row.id)}
                      />
                      <SelectionIndicator
                        selectedItems={
                          selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                        }
                        onRemove={() => onSelectImage('')}
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
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        onClear={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        size="sm"
                        className="w-[var(--search-input-width)] mt-2"
                      />
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredImages.length}
                        itemsPerPage={itemsPerPage}
                        selectedCount={selectedImageId ? 1 : 0}
                      />
                      <Table
                        columns={snapshotColumns}
                        data={paginatedImages}
                        onRowClick={(row) => handleSelectImage(row.id)}
                      />
                      <SelectionIndicator
                        selectedItems={
                          selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                        }
                        onRemove={() => onSelectImage('')}
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
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        onClear={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        size="sm"
                        className="w-[var(--search-input-width)] mt-2"
                      />
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredImages.length}
                        itemsPerPage={itemsPerPage}
                        selectedCount={selectedImageId ? 1 : 0}
                      />
                      <Table
                        columns={volumeColumns}
                        data={paginatedImages}
                        onRowClick={(row) => handleSelectImage(row.id)}
                      />
                      <SelectionIndicator
                        selectedItems={
                          selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                        }
                        onRemove={() => onSelectImage('')}
                      />
                    </VStack>
                  </div>
                </VStack>
              ) : (
                <>
                  <Tabs value={sourceTab} onChange={setSourceTab} variant="underline" size="sm">
                    <TabList>
                      <Tab value="image">Image</Tab>
                      <Tab value="snapshot">Instance snapshot</Tab>
                      <Tab value="volume">Bootable volume</Tab>
                    </TabList>
                  </Tabs>

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
                      <TabList>
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

                  <SearchInput
                    placeholder="Search image by attributes"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    onClear={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredImages.length}
                    itemsPerPage={itemsPerPage}
                    selectedCount={selectedImageId ? 1 : 0}
                  />

                  <VStack gap={2}>
                    <Table
                      columns={
                        sourceTab === 'snapshot'
                          ? snapshotColumns
                          : sourceTab === 'volume'
                            ? volumeColumns
                            : imageColumns
                      }
                      data={paginatedImages}
                      onRowClick={(row) => handleSelectImage(row.id)}
                    />
                    <SelectionIndicator
                      selectedItems={
                        selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                      }
                      onRemove={() => onSelectImage('')}
                    />
                  </VStack>
                </>
              )}
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <div className="py-6">
            {/* System disk Section */}
            <VStack gap={3}>
              <span className="text-label-lg text-[var(--color-text-default)]">System disk</span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Configure whether to create a system disk for booting.
              </span>

              {/* Toggle */}
              <Toggle
                checked={createSystemDisk}
                onChange={setCreateSystemDisk}
                label="Create a new system disk"
              />

              {/* Storage Type Row - Bordered Container */}
              {(isV2 || createSystemDisk) && (
                <div className="w-full bg-white border border-[var(--color-border-default)] rounded-[6px] px-4 py-2">
                  <HStack gap={6} align="center">
                    <HStack gap={1.5} align="center">
                      <span className="text-label-lg text-[var(--color-text-default)]">Type</span>
                      <Select
                        options={storageTypeOptions}
                        value={storageType}
                        onChange={onStorageTypeChange}
                      />
                    </HStack>
                    <HStack gap={1.5} align="center">
                      <span className="text-label-lg text-[var(--color-text-default)]">Size</span>
                      <NumberInput
                        value={storageSize}
                        onChange={onStorageSizeChange}
                        min={10}
                        max={1000}
                        width="sm"
                        suffix="GiB"
                      />
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
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <div className="py-6">
            {/* Data disk Section */}
            <VStack gap={3} align="start">
              <span className="text-label-lg text-[var(--color-text-default)]">Data disk</span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Attach additional volumes for data storage.
              </span>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconCirclePlus size={12} />}
                onClick={handleAddDataDisk}
              >
                Add Data disk
              </Button>
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

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

  // Get selected flavor for summary
  const selectedFlavor = mockFlavors.find((f) => f.id === selectedFlavorId);

  // Table columns matching Figma design
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
            <a
              href="#"
              className="text-[var(--color-action-primary)] hover:underline text-label-md leading-[16px]"
              onClick={(e) => e.preventDefault()}
            >
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            {row.hasWarning && (
              <IconAlertCircle size={12} className="text-[var(--color-state-danger)]" />
            )}
          </HStack>
          <span className="text-body-sm text-[var(--color-text-muted)] leading-[16px]">
            ID: {row.id}
          </span>
        </VStack>
      ),
    },
    { key: 'vCPU', label: 'vCPU', sortable: true },
    { key: 'ram', label: 'RAM', sortable: true },
    { key: 'disk', label: 'Root disk', sortable: true },
    {
      key: 'isPublic',
      label: 'Public',
      render: (value) => (value ? 'On' : 'Off'),
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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <VStack gap={3} className="py-6">
            {/* Flavors Label & Description */}
            <VStack gap={2} align="start">
              <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                Flavors<span className="ml-[3px] text-[var(--color-state-danger)]">*</span>
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                Select a flavor from the list to use for the instance.
              </span>
            </VStack>

            {/* Flavor Type Tabs */}
            <VStack gap={3} align="stretch">
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
                  onClear={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  size="sm"
                  className="w-[var(--search-input-width)]"
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
                selectedCount={selectedFlavorId ? 1 : 0}
              />

              {/* Flavor Table */}
              <VStack gap={2}>
                <Table
                  columns={flavorColumns}
                  data={paginatedFlavors}
                  rowKey="id"
                  onRowClick={(row) => !row.hasWarning && handleSelectFlavor(row.id)}
                />

                {/* Selection Indicator for Flavor */}
                <SelectionIndicator
                  selectedItems={
                    selectedFlavor
                      ? [
                          {
                            id: selectedFlavor.id,
                            label: `${selectedFlavor.name} (${selectedFlavor.vCPU} vCPU, ${selectedFlavor.ram}, ${selectedFlavor.disk})`,
                          },
                        ]
                      : []
                  }
                  onRemove={() => onSelectFlavor('')}
                  error={!!flavorError}
                  errorMessage={flavorError || undefined}
                />
              </VStack>
            </VStack>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

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
  isV2?: boolean;
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
  isV2 = false,
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
    { id: 'vlan1', network: 'network', subnet: 'subnet', autoAssign: 'Auto-assign' },
  ]);

  // Port section state
  const [portExpanded, setPortExpanded] = useState(isV2 ? true : false);
  const [portSearch, setPortSearch] = useState('');
  const [portPage, setPortPage] = useState(1);
  const [selectedPortIds, setSelectedPortIds] = useState<Set<string>>(new Set());

  const itemsPerPage = 5;

  // Filter networks based on tab and search
  const filteredNetworks = mockNetworks.filter((n) => {
    const matchesTab = n.category === networkTab;
    const matchesSearch =
      networkSearch === '' || n.name.toLowerCase().includes(networkSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const networkTotalPages = Math.ceil(filteredNetworks.length / itemsPerPage) || 1;
  const paginatedNetworks = filteredNetworks.slice(
    (networkPage - 1) * itemsPerPage,
    networkPage * itemsPerPage
  );

  // Filter security groups
  const filteredSGs = mockSecurityGroups.filter((sg) => {
    return sgSearch === '' || sg.name.toLowerCase().includes(sgSearch.toLowerCase());
  });

  const sgTotalPages = Math.ceil(filteredSGs.length / itemsPerPage) || 1;
  const paginatedSGs = filteredSGs.slice((sgPage - 1) * itemsPerPage, sgPage * itemsPerPage);

  // Filter ports
  const filteredPorts = mockPorts.filter((p) => {
    return portSearch === '' || p.name.toLowerCase().includes(portSearch.toLowerCase());
  });

  const portTotalPages = Math.ceil(filteredPorts.length / itemsPerPage) || 1;
  const paginatedPorts = filteredPorts.slice(
    (portPage - 1) * itemsPerPage,
    portPage * itemsPerPage
  );

  // Get selected items for chips
  const selectedNetworks = mockNetworks.filter((n) => selectedNetworkIds.has(n.id));
  const selectedSGs = mockSecurityGroups.filter((sg) => selectedSecurityGroups.has(sg.id));
  const selectedPorts = mockPorts.filter((p) => selectedPortIds.has(p.id));

  // Virtual LAN handlers
  const addVirtualLAN = () => {
    setVirtualLANs([
      ...virtualLANs,
      {
        id: `vlan${Date.now()}`,
        network: 'network',
        subnet: 'subnet',
        autoAssign: 'Auto-assign',
      },
    ]);
  };

  const removeVirtualLAN = (id: string) => {
    setVirtualLANs(virtualLANs.filter((v) => v.id !== id));
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
      width: fixedColumns.select,
      headerRender: () => {
        const visibleIds = paginatedNetworks.map((row) => row.id);
        const allSelected =
          visibleIds.length > 0 && visibleIds.every((id) => selectedNetworkIds.has(id));
        const someSelected = visibleIds.some((id) => selectedNetworkIds.has(id));
        return (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={() => {
              if (allSelected) {
                // Deselect all visible items
                visibleIds.forEach((id) => {
                  if (selectedNetworkIds.has(id)) {
                    handleNetworkToggle(id);
                  }
                });
              } else {
                // Select all visible items
                visibleIds.forEach((id) => {
                  if (!selectedNetworkIds.has(id)) {
                    handleNetworkToggle(id);
                  }
                });
              }
            }}
            aria-label="Select all"
          />
        );
      },
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
      width: fixedColumns.status,
      render: (_, row) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <VStack gap={0} align="start">
          <HStack gap={1.5} align="center">
            <a
              href="#"
              className="text-[var(--color-action-primary)] hover:underline text-label-md leading-[16px]"
              onClick={(e) => e.preventDefault()}
            >
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-muted)] leading-[16px]">
            ID: {row.id}
          </span>
        </VStack>
      ),
    },
    { key: 'subnetCidr', label: 'Subnet CIDR', sortable: true },
    {
      key: 'isExternal',
      label: 'External',
      render: (value) => (value ? 'Yes' : 'No'),
    },
    { key: 'shared', label: 'Shared' },
  ];

  // Security group table columns
  const sgColumns: TableColumn<SecurityGroupRow>[] = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      headerRender: () => {
        const visibleIds = paginatedSGs.map((row) => row.id);
        const allSelected =
          visibleIds.length > 0 && visibleIds.every((id) => selectedSecurityGroups.has(id));
        const someSelected = visibleIds.some((id) => selectedSecurityGroups.has(id));
        return (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={() => {
              if (allSelected) {
                // Deselect all visible items
                visibleIds.forEach((id) => {
                  if (selectedSecurityGroups.has(id)) {
                    handleSecurityGroupToggle(id);
                  }
                });
              } else {
                // Select all visible items
                visibleIds.forEach((id) => {
                  if (!selectedSecurityGroups.has(id)) {
                    handleSecurityGroupToggle(id);
                  }
                });
              }
            }}
            aria-label="Select all"
          />
        );
      },
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
            <a
              href="#"
              className="text-[var(--color-action-primary)] hover:underline text-label-md leading-[16px]"
              onClick={(e) => e.preventDefault()}
            >
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-muted)] leading-[16px]">
            ID: {row.id}
          </span>
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
      width: fixedColumns.select,
      headerRender: () => {
        const visibleIds = paginatedPorts.map((row) => row.id);
        const allSelected =
          visibleIds.length > 0 && visibleIds.every((id) => selectedPortIds.has(id));
        const someSelected = visibleIds.some((id) => selectedPortIds.has(id));
        return (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={() => {
              const newSet = new Set(selectedPortIds);
              if (allSelected) {
                visibleIds.forEach((id) => newSet.delete(id));
              } else {
                visibleIds.forEach((id) => newSet.add(id));
              }
              setSelectedPortIds(newSet);
            }}
            aria-label="Select all"
          />
        );
      },
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
      width: fixedColumns.status,
      render: (_, row) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <VStack gap={0} align="start">
          <HStack gap={1.5} align="center">
            <a
              href="#"
              className="text-[var(--color-action-primary)] hover:underline text-label-md leading-[16px]"
              onClick={(e) => e.preventDefault()}
            >
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            {row.status === 'error' && (
              <IconAlertCircle size={12} className="text-[var(--color-state-danger)]" />
            )}
          </HStack>
          <span className="text-body-sm text-[var(--color-text-muted)] leading-[16px]">
            ID: {row.id}
          </span>
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
            <a
              href="#"
              className="text-[var(--color-action-primary)] hover:underline text-label-md leading-[16px]"
              onClick={(e) => e.preventDefault()}
            >
              {value}
            </a>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-muted)] leading-[16px]">
            ID: {row.ownedNetworkId}
          </span>
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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Networks Section */}
          <div className="py-6">
            <VStack gap={3} align="stretch">
              <VStack gap={2} align="start">
                <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                  Network<span className="ml-[3px] text-[var(--color-state-danger)]">*</span>
                </span>
                <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                  If you select a port, selecting a network is optional. You may still add another
                  network if required.
                </span>
              </VStack>

              {/* Network Tabs */}
              <Tabs
                value={networkTab}
                onChange={(v) => {
                  setNetworkTab(v);
                  setNetworkPage(1);
                }}
                variant="underline"
                size="sm"
              >
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
                  onChange={(e) => {
                    setNetworkSearch(e.target.value);
                    setNetworkPage(1);
                  }}
                  onClear={() => {
                    setNetworkSearch('');
                    setNetworkPage(1);
                  }}
                  size="sm"
                  className="w-[var(--search-input-width)]"
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
                selectedCount={selectedNetworkIds.size}
              />

              {/* Network Table + Selection Indicator */}
              <VStack gap={2}>
                <Table
                  columns={networkColumns}
                  data={paginatedNetworks}
                  rowKey="id"
                  onRowClick={(row) => handleNetworkToggle(row.id)}
                />

                {/* Selection Indicator for Networks */}
                <SelectionIndicator
                  selectedItems={selectedNetworks.map((n) => ({ id: n.id, label: n.name }))}
                  onRemove={(id) => handleNetworkToggle(id)}
                  error={!!networkError}
                  errorMessage={networkError || undefined}
                />
              </VStack>
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Virtual LAN Section */}
          <div className="py-6">
            <VStack gap={3} align="stretch">
              <VStack gap={2} align="start">
                <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                  Virtual LAN
                </span>
                <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                  Each selected network requires at least one Virtual LAN configuration. Each VLAN
                  represents a virtual network card (NIC) attached to the selected network.
                </span>
              </VStack>

              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  {virtualLANs.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Network
                      </span>
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Subnet
                      </span>
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        IP assignment
                      </span>
                      <div />
                    </div>
                  )}
                  {virtualLANs.map((vlan) => (
                    <div
                      key={vlan.id}
                      className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                    >
                      <Select
                        options={[{ value: 'network', label: 'network' }]}
                        value={vlan.network}
                        onChange={() => {}}
                        fullWidth
                      />
                      <Select
                        options={[{ value: 'subnet', label: 'subnet' }]}
                        value={vlan.subnet}
                        onChange={() => {}}
                        fullWidth
                      />
                      <Select
                        options={[{ value: 'Auto-assign', label: 'Auto-assign' }]}
                        value={vlan.autoAssign}
                        onChange={() => {}}
                        fullWidth
                      />
                      <button
                        className="p-1 hover:bg-[var(--color-surface-hover)] rounded flex items-center justify-center"
                        onClick={() => removeVirtualLAN(vlan.id)}
                      >
                        <IconX size={12} className="text-[var(--color-text-subtle)]" />
                      </button>
                    </div>
                  ))}

                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} />}
                    onClick={addVirtualLAN}
                    className="self-start"
                  >
                    Add virtual LAN
                  </Button>
                </VStack>
              </div>
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Security groups Section */}
          <div className="py-6">
            <VStack gap={3} align="stretch">
              <VStack gap={2} align="start">
                <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
                  Security groups
                  <span className="ml-[3px] text-[var(--color-state-danger)]">*</span>
                </span>
                <span className="text-body-md text-[var(--color-text-subtle)] leading-[16px]">
                  Security groups apply to all networks except ports with security disabled.
                </span>
              </VStack>

              {/* Security group Search & Create Button */}
              <HStack justify="between" align="center">
                <SearchInput
                  placeholder="Search security groups by attributes"
                  value={sgSearch}
                  onChange={(e) => {
                    setSgSearch(e.target.value);
                    setSgPage(1);
                  }}
                  onClear={() => {
                    setSgSearch('');
                    setSgPage(1);
                  }}
                  size="sm"
                  className="w-[var(--search-input-width)]"
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
                selectedCount={selectedSecurityGroups.size}
              />

              {/* Security group Table + Selection Indicator */}
              <VStack gap={2}>
                <Table
                  columns={sgColumns}
                  data={paginatedSGs}
                  rowKey="id"
                  onRowClick={(row) => handleSecurityGroupToggle(row.id)}
                />

                {/* Selection Indicator for Security Groups */}
                <SelectionIndicator
                  selectedItems={selectedSGs.map((sg) => ({ id: sg.id, label: sg.name }))}
                  onRemove={(id) => handleSecurityGroupToggle(id)}
                  error={!!sgError}
                  errorMessage={sgError || undefined}
                />
              </VStack>
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Port Section (Collapsible) */}
          <div className="py-6">
            <VStack gap={3} align="stretch">
              <button
                className="flex items-center gap-1 text-label-lg text-[var(--color-text-default)]"
                onClick={() => setPortExpanded(!portExpanded)}
              >
                {portExpanded ? (
                  <IconCaretDownFilled size={12} />
                ) : (
                  <IconCaretRightFilled size={12} />
                )}
                Port
              </button>

              {(isV2 || portExpanded) && (
                <VStack gap={3} align="stretch">
                  {/* Port Search */}
                  <SearchInput
                    placeholder="Search ports by attributes"
                    value={portSearch}
                    onChange={(e) => {
                      setPortSearch(e.target.value);
                      setPortPage(1);
                    }}
                    onClear={() => {
                      setPortSearch('');
                      setPortPage(1);
                    }}
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />

                  {/* Port Pagination */}
                  <Pagination
                    currentPage={portPage}
                    totalPages={portTotalPages}
                    totalItems={filteredPorts.length}
                    onPageChange={setPortPage}
                    selectedCount={selectedPortIds.size}
                  />

                  {/* Port Table + Selection Indicator */}
                  <VStack gap={2}>
                    <Table
                      columns={portColumns}
                      data={paginatedPorts}
                      rowKey="id"
                      onRowClick={(row) => handlePortToggle(row.id)}
                    />

                    {/* Selection Indicator for Ports */}
                    <SelectionIndicator
                      selectedItems={selectedPorts.map((p) => ({ id: p.id, label: p.id }))}
                      onRemove={(id) => handlePortToggle(id)}
                    />
                  </VStack>
                </VStack>
              )}
            </VStack>
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
  isV2?: boolean;
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
  isV2 = false,
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
    { key: 'fingerprint', label: 'Fingerprint' },
    {
      key: 'createdAt',
      label: 'Created at',
      sortable: true,
      flex: 1,
      minWidth: columnMinWidths.createdAt,
    },
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
      />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          <VStack gap={2} className="py-6">
            <span className="text-label-lg text-[var(--color-text-default)]">
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

          {(isV2 || loginType === 'keypair') && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <div className="py-6">
                <VStack gap={2}>
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    Key pair<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                  </span>
                  <span className="text-body-md text-[var(--color-text-muted)] mb-4">
                    Select the key pair for SSH access.
                  </span>
                  <Table
                    columns={keyPairColumns}
                    data={mockKeyPairs}
                    onRowClick={(row) => handleSelectKeyPair(row.id)}
                  />

                  {/* Selection Indicator for Key Pair */}
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
                    onRemove={() => onSelectKeyPair('')}
                    error={!!authError}
                    errorMessage={authError || undefined}
                  />
                </VStack>
              </div>
            </>
          )}

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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
          {/* Tags Section */}
          <div className="py-6">
            <VStack gap={3} align="stretch">
              <VStack gap={3} align="stretch">
                <span className="text-label-lg text-[var(--color-text-default)]">Tags</span>
                <span className="text-body-md text-[var(--color-text-subtle)]">
                  A tag consists of a Key that defines the resource category and a Value that
                  describes it. Each resource can have up to 50 tags.
                </span>
              </VStack>

              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  {tags.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Key
                      </span>
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Value
                      </span>
                      <div />
                    </div>
                  )}
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                    >
                      <Input
                        placeholder="tag key"
                        value={tag.key}
                        onChange={(e) => handleTagChange(index, 'key', e.target.value)}
                        fullWidth
                      />
                      <Input
                        placeholder="tag value"
                        value={tag.value}
                        onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                        fullWidth
                      />
                      <button
                        onClick={() => handleRemoveTag(index)}
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                      >
                        <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </div>
                  ))}

                  <HStack gap={3} align="center">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                      onClick={handleAddTag}
                      disabled={tags.length >= MAX_TAGS}
                    >
                      Add tag
                    </Button>
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      {tags.length} / {MAX_TAGS} tags
                    </span>
                  </HStack>
                </VStack>
              </div>
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* User data Section */}
          <div className="py-6">
            <VStack gap={3} align="stretch">
              <VStack gap={2} align="stretch">
                <span className="text-label-lg text-[var(--color-text-default)]">User data</span>
                <span className="text-body-md text-[var(--color-text-subtle)]">
                  Enter a script or cloud-init configuration to run when the instance first boots.
                </span>
              </VStack>

              <VStack gap={3} align="stretch">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<IconUpload size={12} />}
                  onClick={handleFileUpload}
                  className="w-fit"
                >
                  Upload a file
                </Button>

                <VStack gap={2} align="stretch">
                  <Textarea
                    placeholder="e.g. #!/bin/bash ...  or  #cloud-config ..."
                    value={userData}
                    onChange={(e) => onUserDataChange(e.target.value)}
                    fullWidth
                    rows={4}
                  />
                  <span className="text-body-sm text-[var(--color-text-subtle)] self-end">
                    {userDataSizeDisplay} / {MAX_USER_DATA_KB} KB
                  </span>
                </VStack>
              </VStack>
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {!isEditing && (
            <HStack justify="end" gap={2} className="pt-3">
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

export function ComputeAdminCreateTemplatePage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();

  // Section status tracking
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'template-info': 'active',
    'basic-info': isV2 ? 'active' : 'pre',
    image: isV2 ? 'active' : 'pre',
    flavor: isV2 ? 'active' : 'pre',
    network: isV2 ? 'active' : 'pre',
    advanced: isV2 ? 'active' : 'pre',
  });

  // Track which section is being edited
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);
  const [editingWritingSections, setEditingWritingSections] = useState<SectionStep[]>([]);

  // Template Information state
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

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
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState<Set<string>>(new Set());

  // Authentication state
  const [loginType, setLoginType] = useState<'keypair' | 'password'>('keypair');
  const [selectedKeyPairId, setSelectedKeyPairId] = useState<string | null>(null);

  // Advanced state
  const [tags, setTags] = useState<TagItem[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [userData, setUserData] = useState('');

  // Convert tabs for TabBar
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle cancel
  const handleCancel = () => {
    navigate('/compute-admin/instance-templates');
  };

  const handleCreate = () => {
    navigate('/compute-admin/instance-templates');
  };

  // Handle Next
  const handleNext = (section: SectionStep) => {
    if (isV2) return;
    const currentIndex = SECTION_ORDER.indexOf(section);
    if (currentIndex === -1) return;

    const nextSection = SECTION_ORDER[currentIndex + 1];

    if (nextSection) {
      setSectionStatus((prev) => ({
        ...prev,
        [section]: 'done',
        [nextSection]: 'active',
      }));
    } else {
      setSectionStatus((prev) => ({
        ...prev,
        [section]: 'done',
      }));
    }
  };

  // Handle Edit
  const handleEdit = (section: SectionStep) => {
    if (isV2) return;
    if (editingSection) {
      setEditingWritingSections((prev) => [...prev, editingSection]);

      setSectionStatus((prev) => {
        const newStatus = { ...prev };
        newStatus[editingSection] = 'writing';
        newStatus[section] = 'active';
        return newStatus;
      });
      setEditingSection(section);
    } else {
      setEditingSection(section);

      setSectionStatus((prev) => {
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
    if (isV2) return;
    if (editingSection) {
      const topmostWriting = SECTION_ORDER.find((key) => sectionStatus[key] === 'writing');
      const wasEditing = topmostWriting && editingWritingSections.includes(topmostWriting);

      setSectionStatus((prev) => {
        const newStatus = { ...prev };
        newStatus[editingSection] = 'done';

        if (topmostWriting) {
          newStatus[topmostWriting] = 'active';
        }

        return newStatus;
      });

      if (wasEditing && topmostWriting) {
        setEditingSection(topmostWriting);
        setEditingWritingSections((prev) => prev.filter((s) => s !== topmostWriting));
      } else {
        setEditingSection(null);
      }
    }
  };

  // Handle Edit Done
  const handleEditDone = () => {
    if (isV2) return;
    if (editingSection) {
      const topmostWriting = SECTION_ORDER.find((key) => sectionStatus[key] === 'writing');
      const wasEditing = topmostWriting && editingWritingSections.includes(topmostWriting);

      setSectionStatus((prev) => {
        const newStatus = { ...prev };
        newStatus[editingSection] = 'done';

        if (topmostWriting) {
          newStatus[topmostWriting] = 'active';
        }

        return newStatus;
      });

      if (wasEditing && topmostWriting) {
        setEditingSection(topmostWriting);
        setEditingWritingSections((prev) => prev.filter((s) => s !== topmostWriting));
      } else {
        setEditingSection(null);
      }
    }
  };

  // Network toggle handlers
  const handleNetworkToggle = (id: string) => {
    setSelectedNetworkIds((prev) => {
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
    setSelectedSecurityGroups((prev) => {
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
    const image = mockImages.find((i) => i.id === selectedImageId);
    return image ? image.name : null;
  };

  const getFlavorSummary = () => {
    if (!selectedFlavorId) return null;
    const flavor = mockFlavors.find((f) => f.id === selectedFlavorId);
    return flavor ? `${flavor.vCPU}vCPU/${flavor.ram}/${flavor.disk}` : null;
  };

  const getStorageSummary = () => {
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

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={<ComputeAdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Instance templates', href: '/compute-admin/instance-templates' },
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
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create template</h1>
        </div>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Template Information Section */}
            {!isV2 && sectionStatus['template-info'] === 'pre' && (
              <PreSection title={SECTION_LABELS['template-info']} />
            )}
            {!isV2 && sectionStatus['template-info'] === 'writing' && (
              <WritingSection title={SECTION_LABELS['template-info']} />
            )}
            {(isV2 || sectionStatus['template-info'] === 'active') && (
              <TemplateInformationSection
                templateName={templateName}
                onTemplateNameChange={setTemplateName}
                description={templateDescription}
                onDescriptionChange={setTemplateDescription}
                isFavorite={isFavorite}
                onIsFavoriteChange={setIsFavorite}
                selectedTenant={selectedTenant}
                onSelectedTenantChange={setSelectedTenant}
                onNext={() => handleNext('template-info')}
                isActive={!isV2}
                isEditing={editingSection === 'template-info'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {(isV2 || sectionStatus['template-info'] === 'done') && (
              <DoneSection
                title={SECTION_LABELS['template-info']}
                onEdit={() => handleEdit('template-info')}
              >
                <SectionCard.DataRow
                  label="Template name"
                  value={templateName || '-'}
                  showDivider={false}
                />
                <SectionCard.DataRow label="Description" value={templateDescription || '-'} />
                <SectionCard.DataRow label="Visibility" value={isFavorite ? 'Public' : 'Private'} />
                {!isFavorite && (
                  <SectionCard.DataRow
                    label="Tenant"
                    value={
                      selectedTenant
                        ? mockTenants.find((t) => t.id === selectedTenant)?.name || selectedTenant
                        : '-'
                    }
                  />
                )}
              </DoneSection>
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
                availabilityZone={availabilityZone}
                onAvailabilityZoneChange={setAvailabilityZone}
                onNext={() => handleNext('basic-info')}
                isActive={!isV2}
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
                  label="AZ (Availability zone)"
                  value={
                    azOptions.find((az) => az.value === availabilityZone)?.label || availabilityZone
                  }
                  showDivider={false}
                />
              </DoneSection>
            )}

            {/* Image Section */}
            {!isV2 && sectionStatus.image === 'pre' && <PreSection title={SECTION_LABELS.image} />}
            {!isV2 && sectionStatus.image === 'writing' && (
              <WritingSection title={SECTION_LABELS.image} />
            )}
            {(isV2 || sectionStatus.image === 'active') && (
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
                isActive={!isV2}
                isEditing={editingSection === 'image'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
                isV2={isV2}
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
            {!isV2 && sectionStatus.flavor === 'pre' && (
              <PreSection title={SECTION_LABELS.flavor} />
            )}
            {!isV2 && sectionStatus.flavor === 'writing' && (
              <WritingSection title={SECTION_LABELS.flavor} />
            )}
            {(isV2 || sectionStatus.flavor === 'active') && (
              <FlavorSection
                selectedFlavorId={selectedFlavorId}
                onSelectFlavor={setSelectedFlavorId}
                onNext={() => handleNext('flavor')}
                isActive={!isV2}
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
            {!isV2 && sectionStatus.network === 'pre' && (
              <PreSection title={SECTION_LABELS.network} />
            )}
            {!isV2 && sectionStatus.network === 'writing' && (
              <WritingSection title={SECTION_LABELS.network} />
            )}
            {(isV2 || sectionStatus.network === 'active') && (
              <NetworkSection
                selectedNetworkIds={selectedNetworkIds}
                onNetworkToggle={handleNetworkToggle}
                selectedSecurityGroups={selectedSecurityGroups}
                onSecurityGroupToggle={handleSecurityGroupToggle}
                onNext={() => handleNext('network')}
                isActive={!isV2}
                isEditing={editingSection === 'network'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
                isV2={isV2}
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

            {/* Advanced Section */}
            {!isV2 && sectionStatus.advanced === 'pre' && (
              <PreSection title={SECTION_LABELS.advanced} />
            )}
            {!isV2 && sectionStatus.advanced === 'writing' && (
              <WritingSection title={SECTION_LABELS.advanced} />
            )}
            {(isV2 || sectionStatus.advanced === 'active') && (
              <AdvancedSection
                tags={tags}
                onTagsChange={setTags}
                userData={userData}
                onUserDataChange={setUserData}
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
                  label="Tags"
                  value={tags.length > 0 ? `${tags.length} tag${tags.length > 1 ? 's' : ''}` : '-'}
                  showDivider={false}
                />
                <SectionCard.DataRow label="User data" value={userData ? 'Configured' : '-'} />
              </DoneSection>
            )}
          </VStack>

          {/* Right Column - Sidebar */}
          <TemplateSidebar onCancel={handleCancel} sectionStatus={sectionStatus} />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default ComputeAdminCreateTemplatePage;
