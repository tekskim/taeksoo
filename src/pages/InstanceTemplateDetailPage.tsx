import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  VStack,
  HStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  SectionCard,
  WizardSummary,
  Input,
  Textarea,
  Select,
  Toggle,
  FormField,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconEdit, IconTrash } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type AccessType = 'Personal' | 'Project' | 'Public';

interface InstanceTemplateDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  imageId: string;
  flavor: string;
  flavorId: string;
  vcpu: number;
  ram: string;
  disk: string;
  systemDisk: string;
  dataDisk: string;
  network: string;
  networkId: string;
  subnet: string;
  subnetId: string;
  securityGroups: string[];
  floatingIp: string;
  port: string;
  keyPair: string;
  access: AccessType;
  favorite: boolean;
  createdAt: string;
  createdBy: string;
  // Advanced settings
  availabilityZone: string;
  serverGroup: string;
  userData: string;
  tags: { key: string; value: string }[];
}

/* ----------------------------------------
   Section Labels and Order
   ---------------------------------------- */

type SectionStep = 'template-info' | 'basic-info' | 'source' | 'flavor' | 'network' | 'advanced';

const SECTION_LABELS: Record<SectionStep, string> = {
  'template-info': 'Template Information',
  'basic-info': 'Basic information',
  source: 'Source',
  flavor: 'Flavor',
  network: 'Network',
  advanced: 'Advanced',
};

const SECTION_ORDER: SectionStep[] = [
  'template-info',
  'basic-info',
  'source',
  'flavor',
  'network',
  'advanced',
];

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTemplatesMap: Record<string, InstanceTemplateDetail> = {
  'tpl-001': {
    id: 'tpl-001',
    name: 'hj-small',
    description: '-',
    image: 'Ubuntu 22.04 LTS',
    imageId: 'img-ubuntu-2204',
    flavor: 'm1.medium',
    flavorId: 'flv-m1-medium',
    vcpu: 8,
    ram: '16GiB',
    disk: '10GiB',
    systemDisk: '30 GiB',
    dataDisk: '-',
    network: '-',
    networkId: '',
    subnet: '-',
    subnetId: '',
    securityGroups: [],
    floatingIp: '-',
    port: '-',
    keyPair: 'my-keypair',
    access: 'Personal',
    favorite: true,
    createdAt: '2025-07-25 09:12:20',
    createdBy: 'admin@thaki.cloud',
    availabilityZone: 'nova',
    serverGroup: '-',
    userData: '-',
    tags: [],
  },
  'tpl-002': {
    id: 'tpl-002',
    name: 'My-web-template',
    description: '-',
    image: 'ubuntu 22.04',
    imageId: 'img-ubuntu-2204',
    flavor: 'th.medium',
    flavorId: 'flv-th-medium',
    vcpu: 2,
    ram: '4GiB',
    disk: '40GiB',
    systemDisk: '30 GiB',
    dataDisk: '-',
    network: '-',
    networkId: '',
    subnet: '-',
    subnetId: '',
    securityGroups: [],
    floatingIp: '-',
    port: '-',
    keyPair: 'my-keypair',
    access: 'Project',
    favorite: false,
    createdAt: '2025-07-24 10:30:00',
    createdBy: 'admin@thaki.cloud',
    availabilityZone: 'nova',
    serverGroup: '-',
    userData: '-',
    tags: [],
  },
  'tpl-003': {
    id: 'tpl-003',
    name: 'db-template',
    description: 'Database server template',
    image: 'CentOS 8',
    imageId: 'img-centos-8',
    flavor: 'm1.xlarge',
    flavorId: 'flv-m1-xlarge',
    vcpu: 32,
    ram: '64GiB',
    disk: '200GiB',
    systemDisk: '200 GiB',
    dataDisk: '500 GiB',
    network: 'db-net',
    networkId: 'net-db-001',
    subnet: '10.0.1.0/24',
    subnetId: 'subnet-002',
    securityGroups: ['default', 'db-access'],
    floatingIp: '-',
    port: '-',
    keyPair: 'db-keypair',
    access: 'Personal',
    favorite: false,
    createdAt: '2025-07-23 14:00:00',
    createdBy: 'admin@thaki.cloud',
    availabilityZone: 'nova',
    serverGroup: 'db-group',
    userData: '',
    tags: [],
  },
};

const defaultTemplateDetail: InstanceTemplateDetail = {
  id: 'tpl-default',
  name: 'Unknown Template',
  description: '-',
  image: '-',
  imageId: '',
  flavor: '-',
  flavorId: '',
  vcpu: 0,
  ram: '-',
  disk: '-',
  systemDisk: '-',
  dataDisk: '-',
  network: '-',
  networkId: '',
  subnet: '-',
  subnetId: '',
  securityGroups: [],
  floatingIp: '-',
  port: '-',
  keyPair: '-',
  access: 'Personal',
  favorite: false,
  createdAt: '-',
  createdBy: '-',
  availabilityZone: '-',
  serverGroup: '-',
  userData: '',
  tags: [],
};

/* ----------------------------------------
   Mock Options for Selects
   ---------------------------------------- */

const availabilityZoneOptions = [
  { value: 'nova', label: 'nova' },
  { value: 'az-1', label: 'az-1' },
  { value: 'az-2', label: 'az-2' },
];

const imageOptions = [
  { value: 'Ubuntu 22.04 LTS', label: 'Ubuntu 22.04 LTS' },
  { value: 'Ubuntu 20.04 LTS', label: 'Ubuntu 20.04 LTS' },
  { value: 'CentOS 8', label: 'CentOS 8' },
  { value: 'Rocky Linux 9', label: 'Rocky Linux 9' },
];

const flavorOptions = [
  { value: 'm1.small', label: 'm1.small (1 vCPU / 2GiB / 20GiB)' },
  { value: 'm1.medium', label: 'm1.medium (2 vCPU / 4GiB / 40GiB)' },
  { value: 'm1.large', label: 'm1.large (4 vCPU / 8GiB / 80GiB)' },
  { value: 'm1.xlarge', label: 'm1.xlarge (8 vCPU / 16GiB / 160GiB)' },
];

/* ----------------------------------------
   DoneSection Component (Wizard pattern)
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
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   ActiveSection Component (Editable state)
   ---------------------------------------- */

interface ActiveSectionProps {
  title: string;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

function ActiveSection({ title, onSave, onCancel, children }: ActiveSectionProps) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title={title}
        showDivider
        actions={
          <HStack gap={2}>
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onSave}>
              Done
            </Button>
          </HStack>
        }
      />
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

function SummarySidebar({ sectionStatus, onCancel, onSave, onDelete }: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  const isAllDone = SECTION_ORDER.every((key) => sectionStatus[key] === 'done');

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Summary Card using WizardSummary */}
        <WizardSummary title="Summary" items={summaryItems} />

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave} className="flex-1" disabled={!isAllDone}>
            Save
          </Button>
        </HStack>
      </div>

      {/* Delete Action */}
      <div className="flex justify-center mt-4">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconTrash size={12} />}
          onClick={onDelete}
          className="w-[80px] h-8"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Instance Template Detail Page
   ---------------------------------------- */

export function InstanceTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get template based on URL id
  const originalTemplate = id
    ? mockTemplatesMap[id] || defaultTemplateDetail
    : defaultTemplateDetail;

  // Editable form state
  const [formData, setFormData] = useState<InstanceTemplateDetail>(originalTemplate);

  // Track which section is being edited (null = all done)
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Section status for summary sidebar
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>(
    () => {
      const initial: Record<SectionStep, WizardSectionState> = {} as Record<
        SectionStep,
        WizardSectionState
      >;
      SECTION_ORDER.forEach((key) => {
        initial[key] = 'done';
      });
      return initial;
    }
  );

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel } = useTabs();

  // Update tab label to "Edit template"
  useEffect(() => {
    updateActiveTabLabel('Edit template');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Proj-1', href: '#' },
    { label: 'Instance templates', href: '/compute/instance-templates' },
    { label: 'Edit template' },
  ];

  const handleCancel = () => {
    navigate('/compute/instance-templates');
  };

  const handleSave = () => {
    // Save logic here
    console.log('Saving template:', formData);
    navigate('/compute/instance-templates');
  };

  const handleDelete = () => {
    if (window.confirm('Removing the selected instances is permanent and cannot be undone.')) {
      navigate('/compute/instance-templates');
    }
  };

  const handleEdit = (section: SectionStep) => {
    setEditingSection(section);
    setSectionStatus((prev) => ({
      ...prev,
      [section]: 'active',
    }));
  };

  const handleSectionSave = (section: SectionStep) => {
    setEditingSection(null);
    setSectionStatus((prev) => ({
      ...prev,
      [section]: 'done',
    }));
  };

  const handleSectionCancel = (section: SectionStep) => {
    // Reset form data for this section
    setFormData((prev) => {
      const updated = { ...prev };
      // Reset section-specific fields
      if (section === 'template-info') {
        updated.name = originalTemplate.name;
        updated.description = originalTemplate.description;
        updated.favorite = originalTemplate.favorite;
      } else if (section === 'basic-info') {
        updated.availabilityZone = originalTemplate.availabilityZone;
      } else if (section === 'source') {
        updated.image = originalTemplate.image;
        updated.systemDisk = originalTemplate.systemDisk;
        updated.dataDisk = originalTemplate.dataDisk;
      } else if (section === 'flavor') {
        updated.flavor = originalTemplate.flavor;
      } else if (section === 'network') {
        updated.network = originalTemplate.network;
        updated.floatingIp = originalTemplate.floatingIp;
        updated.securityGroups = originalTemplate.securityGroups;
        updated.port = originalTemplate.port;
      } else if (section === 'advanced') {
        updated.tags = originalTemplate.tags;
        updated.userData = originalTemplate.userData;
      }
      return updated;
    });
    setEditingSection(null);
    setSectionStatus((prev) => ({
      ...prev,
      [section]: 'done',
    }));
  };

  const updateFormData = <K extends keyof InstanceTemplateDetail>(
    key: K,
    value: InstanceTemplateDetail[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
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

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => navigate('/compute/instance-templates')}
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3} className="min-w-[1176px]">
              {/* Page Title with ID */}
              <div className="flex items-center h-8">
                <HStack gap={1} align="center">
                  <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                    Edit template
                  </h1>
                  <span className="text-label-lg text-[var(--color-text-subtle)]">
                    (ID: {formData.id})
                  </span>
                </HStack>
              </div>

              <HStack gap={6} align="start" className="w-full">
                {/* Left Column - Main Content */}
                <VStack gap={4} className="flex-1">
                  {/* Template Information */}
                  {editingSection === 'template-info' ? (
                    <ActiveSection
                      title={SECTION_LABELS['template-info']}
                      onSave={() => handleSectionSave('template-info')}
                      onCancel={() => handleSectionCancel('template-info')}
                    >
                      <VStack gap={4} align="stretch">
                        <FormField>
                          <FormField.Label>Template name</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={formData.name}
                              onChange={(e) => updateFormData('name', e.target.value)}
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                        <FormField>
                          <FormField.Label>Favorite</FormField.Label>
                          <FormField.Control>
                            <Toggle
                              checked={formData.favorite}
                              onChange={(checked) => updateFormData('favorite', checked)}
                            />
                          </FormField.Control>
                        </FormField>
                        <FormField>
                          <FormField.Label>Description</FormField.Label>
                          <FormField.Control>
                            <Textarea
                              value={formData.description === '-' ? '' : formData.description}
                              onChange={(e) => updateFormData('description', e.target.value || '-')}
                              rows={3}
                            />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </ActiveSection>
                  ) : (
                    <DoneSection
                      title={SECTION_LABELS['template-info']}
                      onEdit={() => handleEdit('template-info')}
                    >
                      <SectionCard.DataRow
                        label="Template name"
                        value={formData.name}
                        showDivider={false}
                      />
                      <SectionCard.DataRow
                        label="Favorite"
                        value={formData.favorite ? 'Yes' : '-'}
                      />
                      <SectionCard.DataRow label="Description" value={formData.description} />
                    </DoneSection>
                  )}

                  {/* Basic information */}
                  {editingSection === 'basic-info' ? (
                    <ActiveSection
                      title={SECTION_LABELS['basic-info']}
                      onSave={() => handleSectionSave('basic-info')}
                      onCancel={() => handleSectionCancel('basic-info')}
                    >
                      <VStack gap={4} align="stretch">
                        <FormField>
                          <FormField.Label>Availability zone</FormField.Label>
                          <FormField.Control>
                            <Select
                              options={availabilityZoneOptions}
                              value={formData.availabilityZone}
                              onChange={(value) => updateFormData('availabilityZone', value)}
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </ActiveSection>
                  ) : (
                    <DoneSection
                      title={SECTION_LABELS['basic-info']}
                      onEdit={() => handleEdit('basic-info')}
                    >
                      <SectionCard.DataRow
                        label="Availability zone"
                        value={formData.availabilityZone}
                        showDivider={false}
                      />
                    </DoneSection>
                  )}

                  {/* Source */}
                  {editingSection === 'source' ? (
                    <ActiveSection
                      title={SECTION_LABELS.source}
                      onSave={() => handleSectionSave('source')}
                      onCancel={() => handleSectionCancel('source')}
                    >
                      <VStack gap={4} align="stretch">
                        <FormField>
                          <FormField.Label>Image</FormField.Label>
                          <FormField.Control>
                            <Select
                              options={imageOptions}
                              value={formData.image}
                              onChange={(value) => updateFormData('image', value)}
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                        <FormField>
                          <FormField.Label>System disk</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={formData.systemDisk}
                              onChange={(e) => updateFormData('systemDisk', e.target.value)}
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                        <FormField>
                          <FormField.Label>Data disk</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={formData.dataDisk === '-' ? '' : formData.dataDisk}
                              onChange={(e) => updateFormData('dataDisk', e.target.value || '-')}
                              placeholder="Optional"
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </ActiveSection>
                  ) : (
                    <DoneSection title={SECTION_LABELS.source} onEdit={() => handleEdit('source')}>
                      <SectionCard.DataRow
                        label="Image"
                        value={formData.image}
                        showDivider={false}
                      />
                      <SectionCard.DataRow label="System disk" value={formData.systemDisk} />
                      <SectionCard.DataRow label="Data disk" value={formData.dataDisk} />
                    </DoneSection>
                  )}

                  {/* Flavor */}
                  {editingSection === 'flavor' ? (
                    <ActiveSection
                      title={SECTION_LABELS.flavor}
                      onSave={() => handleSectionSave('flavor')}
                      onCancel={() => handleSectionCancel('flavor')}
                    >
                      <VStack gap={4} align="stretch">
                        <FormField>
                          <FormField.Label>Flavor</FormField.Label>
                          <FormField.Control>
                            <Select
                              options={flavorOptions}
                              value={formData.flavor}
                              onChange={(value) => updateFormData('flavor', value)}
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </ActiveSection>
                  ) : (
                    <DoneSection title={SECTION_LABELS.flavor} onEdit={() => handleEdit('flavor')}>
                      <SectionCard.DataRow
                        label="Flavor"
                        value={`${formData.flavor} (${formData.vcpu} vCPU / ${formData.ram} / ${formData.disk})`}
                        showDivider={false}
                      />
                    </DoneSection>
                  )}

                  {/* Network */}
                  {editingSection === 'network' ? (
                    <ActiveSection
                      title={SECTION_LABELS.network}
                      onSave={() => handleSectionSave('network')}
                      onCancel={() => handleSectionCancel('network')}
                    >
                      <VStack gap={4} align="stretch">
                        <FormField>
                          <FormField.Label>Network</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={formData.network === '-' ? '' : formData.network}
                              onChange={(e) => updateFormData('network', e.target.value || '-')}
                              placeholder="Select network"
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                        <FormField>
                          <FormField.Label>Floating IP</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={formData.floatingIp === '-' ? '' : formData.floatingIp}
                              onChange={(e) => updateFormData('floatingIp', e.target.value || '-')}
                              placeholder="Optional"
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                        <FormField>
                          <FormField.Label>Security groups</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={formData.securityGroups.join(', ')}
                              onChange={(e) =>
                                updateFormData(
                                  'securityGroups',
                                  e.target.value
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                )
                              }
                              placeholder="Comma-separated"
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                        <FormField>
                          <FormField.Label>Port</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={formData.port === '-' ? '' : formData.port}
                              onChange={(e) => updateFormData('port', e.target.value || '-')}
                              placeholder="Optional"
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </ActiveSection>
                  ) : (
                    <DoneSection
                      title={SECTION_LABELS.network}
                      onEdit={() => handleEdit('network')}
                    >
                      <SectionCard.DataRow
                        label="Network"
                        value={formData.network}
                        showDivider={false}
                      />
                      <SectionCard.DataRow label="Floating IP" value={formData.floatingIp} />
                      <SectionCard.DataRow
                        label="Security group"
                        value={
                          formData.securityGroups.length > 0
                            ? formData.securityGroups.join(', ')
                            : '-'
                        }
                      />
                      <SectionCard.DataRow label="Port" value={formData.port} />
                    </DoneSection>
                  )}

                  {/* Advanced */}
                  {editingSection === 'advanced' ? (
                    <ActiveSection
                      title={SECTION_LABELS.advanced}
                      onSave={() => handleSectionSave('advanced')}
                      onCancel={() => handleSectionCancel('advanced')}
                    >
                      <VStack gap={4} align="stretch">
                        <FormField>
                          <FormField.Label>Tags</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={formData.tags.map((t) => `${t.key}:${t.value}`).join(', ')}
                              onChange={(e) => {
                                const tags = e.target.value
                                  .split(',')
                                  .map((s) => {
                                    const [key, value] = s.trim().split(':');
                                    return { key: key || '', value: value || '' };
                                  })
                                  .filter((t) => t.key);
                                updateFormData('tags', tags);
                              }}
                              placeholder="key:value, key:value"
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.HelperText>
                            Enter tags as key:value pairs, separated by commas
                          </FormField.HelperText>
                        </FormField>
                        <FormField>
                          <FormField.Label>User data</FormField.Label>
                          <FormField.Control>
                            <Textarea
                              value={formData.userData === '-' ? '' : formData.userData}
                              onChange={(e) => updateFormData('userData', e.target.value || '-')}
                              rows={5}
                              placeholder="Enter cloud-init script or user data"
                            />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </ActiveSection>
                  ) : (
                    <DoneSection
                      title={SECTION_LABELS.advanced}
                      onEdit={() => handleEdit('advanced')}
                    >
                      <SectionCard.DataRow
                        label="Tag"
                        value={
                          formData.tags.length > 0
                            ? formData.tags.map((t) => `${t.key}: ${t.value}`).join(', ')
                            : '-'
                        }
                        showDivider={false}
                      />
                      <SectionCard.DataRow label="User data" value={formData.userData || '-'} />
                    </DoneSection>
                  )}
                </VStack>

                {/* Right Column - Summary Sidebar */}
                <SummarySidebar
                  sectionStatus={sectionStatus}
                  onCancel={handleCancel}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstanceTemplateDetailPage;
