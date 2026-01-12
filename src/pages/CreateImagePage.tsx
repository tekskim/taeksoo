import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Input,
  NumberInput,
  Select,
  SectionCard,
  FormField,
  Toggle,
  WizardSummary,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Disclosure,
  DisclosureTrigger,
  DisclosurePanel,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconEdit,
  IconUpload,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'source' | 'specification' | 'advanced';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  source: 'Source',
  specification: 'Specification',
  advanced: 'Advanced',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'source',
  'specification',
  'advanced',
];


/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({ sectionStatus, onCancel, onCreate, isCreateDisabled }: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  return (
    <div className="w-[312px] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        <WizardSummary items={summaryItems} />
        
        {/* Action Buttons */}
        <div className="flex flex-col w-full">
          <div className="flex gap-2 items-center justify-end w-full">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={onCreate}
              disabled={isCreateDisabled}
              className="flex-1"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateImagePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form state
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  
  // Source section state
  const [sourceType, setSourceType] = useState<'file' | 'url'>('file');
  const [sourceUrl, setSourceUrl] = useState('');

  // Specification section state
  const [diskFormat, setDiskFormat] = useState('');
  const [os, setOs] = useState('');
  const [osVersion, setOsVersion] = useState('');
  const [osAdmin, setOsAdmin] = useState('');
  const [minDisk, setMinDisk] = useState<number | undefined>(undefined);
  const [minRam, setMinRam] = useState<number | undefined>(undefined);
  const [specAdvancedOpen, setSpecAdvancedOpen] = useState(true);

  // Advanced section state
  const [qemuGuestAgent, setQemuGuestAgent] = useState(true);
  const [cpuPolicy, setCpuPolicy] = useState('none');
  const [cpuThreadPolicy, setCpuThreadPolicy] = useState('none');

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    source: 'pre',
    specification: 'pre',
    advanced: 'done',
  });

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel } = useTabs();

  // Update tab label
  useState(() => {
    updateActiveTabLabel('Create Image');
  });

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Images', href: '/compute/images' },
    { label: 'Create Image' },
  ];

  // Navigation handlers
  const handleCancel = () => {
    navigate('/compute/images');
  };

  const handleCreate = () => {
    console.log('Creating image:', {
      imageName,
      description,
      isProtected,
      sourceType,
      sourceUrl,
      diskFormat,
      os,
      osVersion,
      osAdmin,
      minDisk,
      minRam,
      qemuGuestAgent,
      cpuPolicy,
      cpuThreadPolicy,
    });
    navigate('/compute/images');
  };

  // Section navigation
  const goToNextSection = useCallback((currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];
    
    if (nextSection) {
      setSectionStatus((prev) => ({
        ...prev,
        [currentSection]: 'done',
        [nextSection]: 'active',
      }));
    }
  }, []);

  const editSection = useCallback((section: SectionStep) => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Set all sections to their appropriate state
      SECTION_ORDER.forEach((s) => {
        if (s === section) {
          newStatus[s] = 'active';
        } else if (newStatus[s] === 'active') {
          newStatus[s] = 'done';
        }
      });
      return newStatus;
    });
  }, []);

  // Check if create button should be enabled
  const isCreateDisabled = !imageName.trim() || sectionStatus['basic-info'] === 'active';

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content Area */}
        <main
          className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
          style={{ left: sidebarOpen ? '200px' : '72px' }}
        >
          {/* Tab Bar */}
          <div className="shrink-0">
            <TabBar
              tabs={tabBarTabs}
              activeTabId={activeTabId}
              onTabClick={selectTab}
              onTabClose={closeTab}
              showNewTabButton={false}
            />
          </div>

          {/* Top Bar */}
          <TopBar
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            actions={
              <TopBarAction
                icon={<IconBell size={16} />}
                onClick={() => console.log('Notifications clicked')}
                ariaLabel="Notifications"
                showBadge
              />
            }
          />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
            <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
              {/* Page Title */}
              <div className="max-w-[1320px] mx-auto mb-4">
                <h1 className="text-[length:var(--font-size-18)] font-semibold leading-[var(--line-height-28)] text-[var(--color-text-default)]">
                  Create Image
                </h1>
              </div>

              <div className="flex gap-6 max-w-[1320px] mx-auto items-start">
                {/* Left Column - Main Content */}
                <div className="flex-1 min-w-0">
                  <VStack gap={4} align="stretch">
                    {/* Basic Information Section */}
                    <SectionCard isActive={sectionStatus['basic-info'] === 'active'}>
                      <SectionCard.Header 
                        title={SECTION_LABELS['basic-info']}
                        showDivider={sectionStatus['basic-info'] === 'active'}
                        actions={
                          sectionStatus['basic-info'] === 'done' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconEdit size={12} />}
                              onClick={() => editSection('basic-info')}
                            >
                              Edit
                            </Button>
                          )
                        }
                      />
                      {sectionStatus['basic-info'] === 'active' && (
                        <SectionCard.Content gap={6}>
                          <FormField required>
                            <FormField.Label>Image name</FormField.Label>
                            <FormField.Control>
                              <Input 
                                value={imageName} 
                                onChange={(e) => setImageName(e.target.value)}
                                placeholder="Enter image name"
                                fullWidth 
                              />
                            </FormField.Control>
                            <FormField.HelperText>
                              You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters.
                            </FormField.HelperText>
                          </FormField>

                          <FormField>
                            <FormField.Label>Description</FormField.Label>
                            <FormField.Control>
                              <Input 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter description"
                                fullWidth 
                              />
                            </FormField.Control>
                            <FormField.HelperText>
                              You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters.
                            </FormField.HelperText>
                          </FormField>

                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                Protected
                              </span>
                              <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                Protected images cannot be deleted, preventing accidental removal.
                              </span>
                            </div>
                            <HStack gap={2} align="center">
                              <Toggle 
                                checked={isProtected} 
                                onChange={setIsProtected}
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">
                                {isProtected ? 'Yes' : 'No'}
                              </span>
                            </HStack>
                          </div>

                          <div className="flex items-center justify-end w-full">
                            <Button 
                              variant="primary" 
                              onClick={() => goToNextSection('basic-info')}
                              disabled={!imageName.trim()}
                            >
                              Next
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['basic-info'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Image Name" value={imageName || '-'} showDivider />
                          <SectionCard.DataRow label="Description" value={description || '-'} showDivider />
                          <SectionCard.DataRow label="Protected" value={isProtected ? 'Yes' : 'No'} showDivider />
                        </SectionCard.Content>
                      )}
                    </SectionCard>

                    {/* Source Section */}
                    <SectionCard isActive={sectionStatus['source'] === 'active'}>
                      <SectionCard.Header 
                        title={SECTION_LABELS['source']}
                        showDivider={sectionStatus['source'] === 'active'}
                        actions={
                          sectionStatus['source'] === 'done' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconEdit size={12} />}
                              onClick={() => editSection('source')}
                            >
                              Edit
                            </Button>
                          )
                        }
                      />
                      {sectionStatus['source'] === 'active' && (
                        <SectionCard.Content gap={6}>
                          {/* Upload Type Label */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                Upload Type
                              </span>
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </div>
                            <span className="text-[11px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                              Registers an image by uploading a file or entering a file URL.
                            </span>
                          </div>

                          {/* Upload Type Tabs */}
                          <div className="flex flex-col gap-3 w-full">
                            <Tabs 
                              value={sourceType} 
                              onChange={(value) => setSourceType(value as 'file' | 'url')} 
                              variant="underline" 
                              size="sm"
                            >
                              <TabList>
                                <Tab value="file">Upload File</Tab>
                                <Tab value="url">File URL</Tab>
                              </TabList>
                            </Tabs>

                            {/* File Upload */}
                            {sourceType === 'file' && (
                              <VStack gap={3} align="start">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={<IconUpload size={12} />}
                                >
                                  Choose File
                                </Button>
                                <span className="text-[11px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                  Only RAW, QCOW2, ISO, AKI, and ARI file formats are allowed.
                                </span>
                              </VStack>
                            )}

                            {/* File URL */}
                            {sourceType === 'url' && (
                              <VStack gap={3} align="stretch">
                                <Input 
                                  value={sourceUrl} 
                                  onChange={(e) => setSourceUrl(e.target.value)}
                                  placeholder="e.g. https://example.com/image.qcow2"
                                  fullWidth 
                                />
                                <span className="text-[11px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                  The URL must start with http:// or https://.
                                </span>
                              </VStack>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                          <div className="flex items-center justify-end w-full">
                            <Button 
                              variant="primary" 
                              onClick={() => goToNextSection('source')}
                              disabled={sourceType === 'url' && !sourceUrl.trim()}
                            >
                              Next
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['source'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow 
                            label="Upload Type" 
                            value={sourceType === 'file' ? 'Upload File' : 'File URL'} 
                            showDivider 
                          />
                          {sourceType === 'url' && (
                            <SectionCard.DataRow label="URL" value={sourceUrl || '-'} showDivider />
                          )}
                        </SectionCard.Content>
                      )}
                    </SectionCard>

                    {/* Specification Section */}
                    <SectionCard isActive={sectionStatus['specification'] === 'active'}>
                      <SectionCard.Header 
                        title={SECTION_LABELS['specification']}
                        showDivider={sectionStatus['specification'] === 'active'}
                        actions={
                          sectionStatus['specification'] === 'done' && (
                            <HStack gap={3} align="center">
                              <span className="text-[12px] text-[var(--color-text-subtle)]">Auto-filled</span>
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconEdit size={12} />}
                                onClick={() => editSection('specification')}
                              >
                                Edit
                              </Button>
                            </HStack>
                          )
                        }
                      />
                      {sectionStatus['specification'] === 'active' && (
                        <SectionCard.Content gap={6}>
                          {/* Disk Format */}
                          <FormField required>
                            <FormField.Label>Disk format</FormField.Label>
                            <FormField.HelperText>
                              Select the disk format for the image. It must match the actual type of the uploaded file.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Select
                                value={diskFormat}
                                onChange={(value) => setDiskFormat(value)}
                                placeholder="Select disk format"
                                options={[
                                  { value: 'raw', label: 'RAW' },
                                  { value: 'qcow2', label: 'QCOW2' },
                                  { value: 'vhd', label: 'VHD' },
                                  { value: 'vmdk', label: 'VMDK' },
                                  { value: 'iso', label: 'ISO' },
                                  { value: 'aki', label: 'AKI' },
                                  { value: 'ari', label: 'ARI' },
                                ]}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* OS */}
                          <FormField required>
                            <FormField.Label>OS</FormField.Label>
                            <FormField.HelperText>
                              Select the operating system type for the image.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Select
                                value={os}
                                onChange={(value) => setOs(value)}
                                placeholder="Select OS"
                                options={[
                                  { value: 'ubuntu', label: 'Ubuntu' },
                                  { value: 'centos', label: 'CentOS' },
                                  { value: 'debian', label: 'Debian' },
                                  { value: 'rhel', label: 'Red Hat Enterprise Linux' },
                                  { value: 'windows', label: 'Windows' },
                                  { value: 'other', label: 'Other' },
                                ]}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* OS Version */}
                          <FormField required>
                            <FormField.Label>OS version</FormField.Label>
                            <FormField.HelperText>
                              This metadata helps categorize image.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Input 
                                value={osVersion} 
                                onChange={(e) => setOsVersion(e.target.value)}
                                placeholder="e.g. 22.04, 8, 2019"
                                fullWidth 
                              />
                            </FormField.Control>
                          </FormField>

                          {/* OS Admin */}
                          <FormField required>
                            <FormField.Label>OS admin</FormField.Label>
                            <FormField.HelperText>
                              Enter the default administrator account used when launching instances from this image.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Input 
                                value={osAdmin} 
                                onChange={(e) => setOsAdmin(e.target.value)}
                                placeholder="e.g. ubuntu(ubuntu), administrator(windows)"
                                fullWidth 
                              />
                            </FormField.Control>
                          </FormField>

                          {/* Advanced Section */}
                          <Disclosure 
                            open={specAdvancedOpen} 
                            onChange={setSpecAdvancedOpen}
                          >
                            <DisclosureTrigger>Advanced</DisclosureTrigger>
                            <DisclosurePanel>
                              <VStack gap={4} align="stretch" className="pt-3">
                                {/* Min System Disk */}
                                <div className="flex flex-col gap-2">
                                  <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                    Min system disk
                                  </span>
                                  <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                    Defines the minimum disk size required to boot an instance from this image.
                                  </span>
                                  <HStack gap={2} align="center">
                                    <NumberInput 
                                      value={minDisk}
                                      onChange={setMinDisk}
                                      min={0}
                                      max={500}
                                      className="w-[80px]"
                                    />
                                    <span className="text-[12px] text-[var(--color-text-default)]">GiB</span>
                                  </HStack>
                                  <span className="text-[11px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                    0-500 GiB
                                  </span>
                                </div>

                                {/* Min RAM */}
                                <div className="flex flex-col gap-2">
                                  <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                    Min RAM
                                  </span>
                                  <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                    Defines the minimum amount of RAM required to boot an instance from this image.
                                  </span>
                                  <HStack gap={2} align="center">
                                    <NumberInput 
                                      value={minRam}
                                      onChange={setMinRam}
                                      min={0}
                                      max={500}
                                      className="w-[80px]"
                                    />
                                    <span className="text-[12px] text-[var(--color-text-default)]">GiB</span>
                                  </HStack>
                                  <span className="text-[11px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                    0-500 GiB
                                  </span>
                                </div>
                              </VStack>
                            </DisclosurePanel>
                          </Disclosure>

                          <div className="flex items-center justify-end w-full">
                            <Button 
                              variant="primary" 
                              onClick={() => goToNextSection('specification')}
                              disabled={!diskFormat || !os || !osVersion.trim() || !osAdmin.trim()}
                            >
                              Next
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['specification'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Disk Format" value={diskFormat.toUpperCase()} showDivider />
                          <SectionCard.DataRow label="OS" value={os || '-'} showDivider />
                          <SectionCard.DataRow label="OS Version" value={osVersion || '-'} showDivider />
                          <SectionCard.DataRow label="OS Admin" value={osAdmin || '-'} showDivider />
                          <SectionCard.DataRow 
                            label="Min System Disk" 
                            value={minDisk !== undefined ? `${minDisk} GiB` : '-'} 
                            showDivider 
                          />
                          <SectionCard.DataRow 
                            label="Min RAM" 
                            value={minRam !== undefined ? `${minRam} GiB` : '-'} 
                            showDivider 
                          />
                        </SectionCard.Content>
                      )}
                    </SectionCard>

                    {/* Advanced Section */}
                    <SectionCard isActive={sectionStatus['advanced'] === 'active'}>
                      <SectionCard.Header 
                        title={SECTION_LABELS['advanced']}
                        showDivider={sectionStatus['advanced'] === 'active'}
                        actions={
                          sectionStatus['advanced'] === 'done' && (
                            <HStack gap={3} align="center">
                              <span className="text-[12px] text-[var(--color-text-subtle)]">Auto-filled</span>
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconEdit size={12} />}
                                onClick={() => editSection('advanced')}
                              >
                                Edit
                              </Button>
                            </HStack>
                          )
                        }
                      />
                      {sectionStatus['advanced'] === 'active' && (
                        <SectionCard.Content gap={6}>
                          {/* QEMU Guest Agent */}
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-[14px] font-medium leading-[var(--line-height-20)] text-[var(--color-text-default)]">
                                QEMU guest agent
                              </span>
                              <span className="text-[12px] font-normal leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                                Enables communication and status retrieval between the hypervisor and the instance.
                              </span>
                            </div>
                            <HStack gap={2} align="center">
                              <Toggle 
                                checked={qemuGuestAgent} 
                                onChange={setQemuGuestAgent}
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">
                                {qemuGuestAgent ? 'On' : 'Off'}
                              </span>
                            </HStack>
                          </div>

                          {/* CPU Policy */}
                          <FormField>
                            <FormField.Label>CPU policy</FormField.Label>
                            <FormField.HelperText>
                              Policy that defines how vCPUs are allocated.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Select
                                value={cpuPolicy}
                                onChange={(value) => setCpuPolicy(value)}
                                options={[
                                  { value: 'none', label: 'None' },
                                  { value: 'dedicated', label: 'Dedicated' },
                                  { value: 'shared', label: 'Shared' },
                                ]}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* CPU Thread Policy */}
                          <FormField>
                            <FormField.Label>CPU thread policy</FormField.Label>
                            <FormField.HelperText>
                              Policy defining how hyperthreads are used for vCPU placement.
                            </FormField.HelperText>
                            <FormField.Control>
                              <Select
                                value={cpuThreadPolicy}
                                onChange={(value) => setCpuThreadPolicy(value)}
                                options={[
                                  { value: 'none', label: 'None' },
                                  { value: 'prefer', label: 'Prefer' },
                                  { value: 'isolate', label: 'Isolate' },
                                  { value: 'require', label: 'Require' },
                                ]}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-2 w-full">
                            <Button 
                              variant="secondary" 
                              onClick={() => {
                                // Reset to default values
                                setQemuGuestAgent(true);
                                setCpuPolicy('none');
                                setCpuThreadPolicy('none');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={() => {
                                setSectionStatus((prev) => ({
                                  ...prev,
                                  advanced: 'done',
                                }));
                              }}
                            >
                              Done
                            </Button>
                          </div>
                        </SectionCard.Content>
                      )}
                      {sectionStatus['advanced'] === 'done' && (
                        <SectionCard.Content>
                          <SectionCard.DataRow 
                            label="QEMU Guest Agent" 
                            value={qemuGuestAgent ? 'On' : 'Off'} 
                            showDivider 
                          />
                          <SectionCard.DataRow 
                            label="CPU Policy" 
                            value={cpuPolicy === 'none' ? 'None' : cpuPolicy.charAt(0).toUpperCase() + cpuPolicy.slice(1)} 
                            showDivider 
                          />
                          <SectionCard.DataRow 
                            label="CPU Thread Policy" 
                            value={cpuThreadPolicy === 'none' ? 'None' : cpuThreadPolicy.charAt(0).toUpperCase() + cpuThreadPolicy.slice(1)} 
                            showDivider 
                          />
                        </SectionCard.Content>
                      )}
                    </SectionCard>
                  </VStack>
                </div>

                {/* Right Column - Summary Sidebar */}
                <SummarySidebar 
                  sectionStatus={sectionStatus}
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  isCreateDisabled={isCreateDisabled}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateImagePage;
