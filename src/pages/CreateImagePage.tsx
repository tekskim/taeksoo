import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsV2 } from '@/hooks/useIsV2';
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
  Disclosure,
  DisclosureTrigger,
  DisclosurePanel,
  PageShell,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconEdit, IconUpload } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'source' | 'specification' | 'advanced';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  source: 'Source',
  specification: 'Specification',
  advanced: 'Advanced',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'source', 'specification', 'advanced'];

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
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
  const sidebarWidth = sidebarOpen ? 200 : 0;

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

  // Validation error states
  const [imageNameError, setImageNameError] = useState<string | null>(null);
  const [sourceUrlError, setSourceUrlError] = useState<string | null>(null);
  const [diskFormatError, setDiskFormatError] = useState<string | null>(null);
  const [osError, setOsError] = useState<string | null>(null);
  const [osVersionError, setOsVersionError] = useState<string | null>(null);
  const [osAdminError, setOsAdminError] = useState<string | null>(null);

  const isV2 = useIsV2();

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    source: isV2 ? 'active' : 'pre',
    specification: isV2 ? 'active' : 'pre',
    advanced: 'done',
  });

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel } = useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create image');
  }, []);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [{ label: 'Images', href: '/compute/images' }, { label: 'Create image' }];

  // Navigation handlers
  const handleCancel = () => {
    navigate('/compute/images');
  };

  const handleCreate = () => {
    // TODO: API call to create image with form data
    navigate('/compute/images');
  };

  // Validation functions
  const validateBasicInfo = useCallback(() => {
    let hasError = false;
    if (!imageName.trim()) {
      setImageNameError('Please enter an image name.');
      hasError = true;
    } else {
      setImageNameError(null);
    }
    return !hasError;
  }, [imageName]);

  const validateSource = useCallback(() => {
    let hasError = false;
    if (sourceType === 'url' && !sourceUrl.trim()) {
      setSourceUrlError('Please enter a file URL.');
      hasError = true;
    } else {
      setSourceUrlError(null);
    }
    return !hasError;
  }, [sourceType, sourceUrl]);

  const validateSpecification = useCallback(() => {
    let hasError = false;
    if (!diskFormat) {
      setDiskFormatError('Please select a disk format.');
      hasError = true;
    } else {
      setDiskFormatError(null);
    }
    if (!os) {
      setOsError('Please select an OS.');
      hasError = true;
    } else {
      setOsError(null);
    }
    if (!osVersion.trim()) {
      setOsVersionError('Please enter an OS version.');
      hasError = true;
    } else {
      setOsVersionError(null);
    }
    if (!osAdmin.trim()) {
      setOsAdminError('Please enter an OS admin.');
      hasError = true;
    } else {
      setOsAdminError(null);
    }
    return !hasError;
  }, [diskFormat, os, osVersion, osAdmin]);

  // Section navigation with validation
  const goToNextSection = useCallback(
    (currentSection: SectionStep) => {
      if (isV2) return;
      // Validate current section before proceeding
      let isValid = true;
      if (currentSection === 'basic-info') {
        isValid = validateBasicInfo();
      } else if (currentSection === 'source') {
        isValid = validateSource();
      } else if (currentSection === 'specification') {
        isValid = validateSpecification();
      }

      if (!isValid) return;

      const currentIndex = SECTION_ORDER.indexOf(currentSection);
      const nextSection = SECTION_ORDER[currentIndex + 1];

      if (nextSection) {
        setSectionStatus((prev) => ({
          ...prev,
          [currentSection]: 'done',
          [nextSection]: 'active',
        }));
      }
    },
    [validateBasicInfo, validateSource, validateSpecification]
  );

  const editSection = useCallback((section: SectionStep) => {
    if (isV2) return;
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
  const isCreateDisabled = !imageName.trim() || (!isV2 && sectionStatus['basic-info'] === 'active');

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              onClick={() => {}}
              aria-label="Notifications"
              badge
            />
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create image</h1>
        </div>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Main Content */}
          <VStack gap={4} className="flex-1">
            {/* Basic information Section */}
            <SectionCard isActive={!isV2 && sectionStatus['basic-info'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['basic-info']}
                showDivider={sectionStatus['basic-info'] === 'done'}
                actions={
                  !isV2 &&
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
              {(isV2 || sectionStatus['basic-info'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Image name */}
                    <div className="py-6">
                      <FormField required error={!!imageNameError}>
                        <FormField.Label>Image name</FormField.Label>
                        <FormField.Control>
                          <Input
                            value={imageName}
                            onChange={(e) => {
                              setImageName(e.target.value);
                              setImageNameError(null);
                            }}
                            placeholder="Enter image name"
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.ErrorMessage>{imageNameError}</FormField.ErrorMessage>
                        <FormField.HelperText>
                          You can use letters, numbers, and special characters (+=,.@-_), and the
                          length must be between 2-128 characters.
                        </FormField.HelperText>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Description */}
                    <div className="py-6">
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
                          You can use letters, numbers, and special characters (+=,.@-_()[]), and
                          maximum 255 characters.
                        </FormField.HelperText>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Protected */}
                    <VStack gap={3} className="py-6">
                      <VStack gap={2}>
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Protected
                        </span>
                        <span className="text-body-md text-[var(--color-text-subtle)]">
                          Protected images cannot be deleted, preventing accidental removal.
                        </span>
                      </VStack>
                      <HStack gap={2} align="center">
                        <Toggle checked={isProtected} onChange={setIsProtected} />
                        <span className="text-body-md text-[var(--color-text-default)]">
                          {isProtected ? 'Yes' : 'No'}
                        </span>
                      </HStack>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('basic-info')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['basic-info'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Image name" value={imageName || '-'} />
                  <SectionCard.DataRow label="Description" value={description || '-'} />
                  <SectionCard.DataRow label="Protected" value={isProtected ? 'Yes' : 'No'} />
                </SectionCard.Content>
              )}
            </SectionCard>

            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['basic-info']} />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Image name" value={imageName || '-'} />
                  <SectionCard.DataRow label="Description" value={description || '-'} />
                  <SectionCard.DataRow label="Protected" value={isProtected ? 'Yes' : 'No'} />
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Source Section */}
            <SectionCard isActive={!isV2 && sectionStatus['source'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['source']}
                showDivider={sectionStatus['source'] === 'done'}
                actions={
                  !isV2 &&
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
              {(isV2 || sectionStatus['source'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Upload type */}
                    <VStack gap={3} className="py-6">
                      <VStack gap={2}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Upload type
                          </span>
                          <span className="text-[var(--color-state-danger)]">*</span>
                        </div>
                        <span className="text-body-md text-[var(--color-text-subtle)]">
                          Registers an image by uploading a file or entering a file URL.
                        </span>
                      </VStack>

                      <Tabs
                        value={sourceType}
                        onChange={(value) => setSourceType(value as 'file' | 'url')}
                        variant="underline"
                        size="sm"
                      >
                        <TabList>
                          <Tab value="file">Upload file</Tab>
                          <Tab value="url">File URL</Tab>
                        </TabList>
                      </Tabs>

                      {sourceType === 'file' && (
                        <VStack gap={3} align="start">
                          <Button variant="secondary" size="sm" leftIcon={<IconUpload size={12} />}>
                            Choose File
                          </Button>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            Only RAW, QCOW2, ISO, AKI, and ARI file formats are allowed.
                          </span>
                        </VStack>
                      )}

                      {sourceType === 'url' && (
                        <VStack gap={3} align="stretch">
                          <Input
                            value={sourceUrl}
                            onChange={(e) => {
                              setSourceUrl(e.target.value);
                              setSourceUrlError(null);
                            }}
                            placeholder="e.g. https://example.com/image.qcow2"
                            fullWidth
                            error={!!sourceUrlError}
                          />
                          {sourceUrlError && (
                            <span className="text-body-sm text-[var(--color-state-danger)]">
                              {sourceUrlError}
                            </span>
                          )}
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            The URL must start with http:// or https://.
                          </span>
                        </VStack>
                      )}
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('source')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['source'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Upload type"
                    value={sourceType === 'file' ? 'Upload File' : 'File URL'}
                  />
                  {sourceType === 'url' && (
                    <SectionCard.DataRow label="URL" value={sourceUrl || '-'} />
                  )}
                </SectionCard.Content>
              )}
            </SectionCard>

            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['source']} />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Upload type"
                    value={sourceType === 'file' ? 'Upload File' : 'File URL'}
                  />
                  {sourceType === 'url' && (
                    <SectionCard.DataRow label="URL" value={sourceUrl || '-'} />
                  )}
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Specification Section */}
            <SectionCard isActive={!isV2 && sectionStatus['specification'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['specification']}
                showDivider={sectionStatus['specification'] === 'done'}
                actions={
                  !isV2 &&
                  sectionStatus['specification'] === 'done' && (
                    <HStack gap={3} align="center">
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        Auto-filled
                      </span>
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
              {(isV2 || sectionStatus['specification'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Disk format */}
                    <div className="py-6">
                      <FormField required error={!!diskFormatError}>
                        <FormField.Label>Disk format</FormField.Label>
                        <FormField.Description>
                          Select the disk format for the image. It must match the actual type of the
                          uploaded file.
                        </FormField.Description>
                        <FormField.Control>
                          <Select
                            value={diskFormat}
                            onChange={(value) => {
                              setDiskFormat(value);
                              setDiskFormatError(null);
                            }}
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
                        <FormField.ErrorMessage>{diskFormatError}</FormField.ErrorMessage>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* OS */}
                    <div className="py-6">
                      <FormField required error={!!osError}>
                        <FormField.Label>OS</FormField.Label>
                        <FormField.Description>
                          Select the operating system type for the image.
                        </FormField.Description>
                        <FormField.Control>
                          <Select
                            value={os}
                            onChange={(value) => {
                              setOs(value);
                              setOsError(null);
                            }}
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
                        <FormField.ErrorMessage>{osError}</FormField.ErrorMessage>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* OS Version */}
                    <div className="py-6">
                      <FormField required error={!!osVersionError}>
                        <FormField.Label>OS version</FormField.Label>
                        <FormField.Description>
                          This metadata helps categorize image.
                        </FormField.Description>
                        <FormField.Control>
                          <Input
                            value={osVersion}
                            onChange={(e) => {
                              setOsVersion(e.target.value);
                              setOsVersionError(null);
                            }}
                            placeholder="e.g. 22.04, 8, 2019"
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.ErrorMessage>{osVersionError}</FormField.ErrorMessage>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* OS Admin */}
                    <div className="py-6">
                      <FormField required error={!!osAdminError}>
                        <FormField.Label>OS admin</FormField.Label>
                        <FormField.Description>
                          Enter the default administrator account used when launching instances from
                          this image.
                        </FormField.Description>
                        <FormField.Control>
                          <Input
                            value={osAdmin}
                            onChange={(e) => {
                              setOsAdmin(e.target.value);
                              setOsAdminError(null);
                            }}
                            placeholder="e.g. ubuntu(ubuntu), administrator(windows)"
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.ErrorMessage>{osAdminError}</FormField.ErrorMessage>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* Advanced Section */}
                    <div className="py-6">
                      <Disclosure open={specAdvancedOpen} onChange={setSpecAdvancedOpen}>
                        <DisclosureTrigger>Advanced</DisclosureTrigger>
                        <DisclosurePanel>
                          <VStack gap={4} align="stretch" className="pt-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Min system disk
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Defines the minimum disk size required to boot an instance from this
                                image.
                              </span>
                              <HStack gap={2} align="center">
                                <NumberInput
                                  value={minDisk}
                                  onChange={setMinDisk}
                                  min={0}
                                  max={500}
                                  width="sm"
                                />
                                <span className="text-body-md text-[var(--color-text-default)]">
                                  GiB
                                </span>
                              </HStack>
                              <span className="text-body-sm text-[var(--color-text-subtle)]">
                                0-500 GiB
                              </span>
                            </div>

                            <div className="flex flex-col gap-2">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Min RAM
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Defines the minimum amount of RAM required to boot an instance from
                                this image.
                              </span>
                              <HStack gap={2} align="center">
                                <NumberInput
                                  value={minRam}
                                  onChange={setMinRam}
                                  min={0}
                                  max={500}
                                  width="sm"
                                />
                                <span className="text-body-md text-[var(--color-text-default)]">
                                  GiB
                                </span>
                              </HStack>
                              <span className="text-body-sm text-[var(--color-text-subtle)]">
                                0-500 GiB
                              </span>
                            </div>
                          </VStack>
                        </DisclosurePanel>
                      </Disclosure>
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('specification')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['specification'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Disk format" value={diskFormat.toUpperCase()} />
                  <SectionCard.DataRow label="OS" value={os || '-'} />
                  <SectionCard.DataRow label="OS Version" value={osVersion || '-'} />
                  <SectionCard.DataRow label="OS Admin" value={osAdmin || '-'} />
                  <SectionCard.DataRow
                    label="Min system Disk"
                    value={minDisk !== undefined ? `${minDisk} GiB` : '-'}
                  />
                  <SectionCard.DataRow
                    label="Min RAM"
                    value={minRam !== undefined ? `${minRam} GiB` : '-'}
                  />
                </SectionCard.Content>
              )}
            </SectionCard>

            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['specification']} />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Disk format" value={diskFormat.toUpperCase()} />
                  <SectionCard.DataRow label="OS" value={os || '-'} />
                  <SectionCard.DataRow label="OS Version" value={osVersion || '-'} />
                  <SectionCard.DataRow label="OS Admin" value={osAdmin || '-'} />
                  <SectionCard.DataRow
                    label="Min system Disk"
                    value={minDisk !== undefined ? `${minDisk} GiB` : '-'}
                  />
                  <SectionCard.DataRow
                    label="Min RAM"
                    value={minRam !== undefined ? `${minRam} GiB` : '-'}
                  />
                </SectionCard.Content>
              </SectionCard>
            )}

            {/* Advanced Section */}
            <SectionCard isActive={!isV2 && sectionStatus['advanced'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['advanced']}
                showDivider={sectionStatus['advanced'] === 'done'}
                actions={
                  !isV2 &&
                  sectionStatus['advanced'] === 'done' && (
                    <HStack gap={3} align="center">
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        Auto-filled
                      </span>
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
              {(isV2 || sectionStatus['advanced'] === 'active') && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* QEMU Guest Agent */}
                    <VStack gap={3} className="py-6">
                      <VStack gap={2}>
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          QEMU guest agent
                        </span>
                        <span className="text-body-md text-[var(--color-text-subtle)]">
                          Enables communication and status retrieval between the hypervisor and the
                          instance.
                        </span>
                      </VStack>
                      <HStack gap={2} align="center">
                        <Toggle checked={qemuGuestAgent} onChange={setQemuGuestAgent} />
                        <span className="text-body-md text-[var(--color-text-default)]">
                          {qemuGuestAgent ? 'On' : 'Off'}
                        </span>
                      </HStack>
                    </VStack>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* CPU Policy */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>CPU policy</FormField.Label>
                        <FormField.Description>
                          Policy that defines how vCPUs are allocated.
                        </FormField.Description>
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
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    {/* CPU Thread Policy */}
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>CPU thread policy</FormField.Label>
                        <FormField.Description>
                          Policy defining how hyperthreads are used for vCPU placement.
                        </FormField.Description>
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
                    </div>

                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                    <HStack justify="end" gap={2} className="pt-3">
                      <Button
                        variant="secondary"
                        onClick={() => {
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
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {!isV2 && sectionStatus['advanced'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="QEMU Guest Agent"
                    value={qemuGuestAgent ? 'On' : 'Off'}
                  />
                  <SectionCard.DataRow
                    label="CPU Policy"
                    value={
                      cpuPolicy === 'none'
                        ? 'None'
                        : cpuPolicy.charAt(0).toUpperCase() + cpuPolicy.slice(1)
                    }
                  />
                  <SectionCard.DataRow
                    label="CPU Thread Policy"
                    value={
                      cpuThreadPolicy === 'none'
                        ? 'None'
                        : cpuThreadPolicy.charAt(0).toUpperCase() + cpuThreadPolicy.slice(1)
                    }
                  />
                </SectionCard.Content>
              )}
            </SectionCard>

            {isV2 && (
              <SectionCard>
                <SectionCard.Header title={SECTION_LABELS['advanced']} />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="QEMU Guest Agent"
                    value={qemuGuestAgent ? 'On' : 'Off'}
                  />
                  <SectionCard.DataRow
                    label="CPU Policy"
                    value={
                      cpuPolicy === 'none'
                        ? 'None'
                        : cpuPolicy.charAt(0).toUpperCase() + cpuPolicy.slice(1)
                    }
                  />
                  <SectionCard.DataRow
                    label="CPU Thread Policy"
                    value={
                      cpuThreadPolicy === 'none'
                        ? 'None'
                        : cpuThreadPolicy.charAt(0).toUpperCase() + cpuThreadPolicy.slice(1)
                    }
                  />
                </SectionCard.Content>
              </SectionCard>
            )}
          </VStack>

          {/* Right Column - Summary Sidebar */}
          <SummarySidebar
            sectionStatus={sectionStatus}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateImagePage;
