import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  Radio,
  RadioGroup,
  WizardSummary,
  SectionCard,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconPlus,
  IconX,
  IconEdit,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'storage-config' | 'customize';
type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'storage-config': 'Parameters',
  customize: 'Customize',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'storage-config', 'customize'];

// Reclaim Policy options
type ReclaimPolicy = 'delete' | 'retain';

// Allow Volume Expansion options
type VolumeExpansion = 'enabled' | 'disabled';

// Volume Binding Mode options
type VolumeBindingMode = 'immediate' | 'waitForFirstConsumer';

interface MountOption {
  value: string;
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
        <h5 className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
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
        <h5 className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
          {title}
        </h5>
        <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
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
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<SectionStep, SectionState>;
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
  // Map SectionState to WizardSectionState
  const mapState = (state: SectionState): WizardSectionState => {
    if (state === 'pre') return 'pending';
    if (state === 'active') return 'active';
    if (state === 'writing') return 'writing';
    return 'done';
  };

  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: mapState(sectionStatus[key]),
  }));

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        <WizardSummary items={summaryItems} />

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCreate}
            disabled={isCreateDisabled}
            className="flex-1"
          >
            Create Storage Class
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   BasicInfoSection Component
   ---------------------------------------- */

interface BasicInfoSectionProps {
  storageClassName: string;
  onStorageClassNameChange: (value: string) => void;
  storageClassNameError: string | null;
  onStorageClassNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInfoSection({
  storageClassName,
  onStorageClassNameChange,
  storageClassNameError,
  onStorageClassNameErrorChange,
  description,
  onDescriptionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInfoSectionProps) {
  const handleNext = () => {
    if (!storageClassName.trim()) {
      onStorageClassNameErrorChange('Storage Class name is required.');
      return;
    }
    onStorageClassNameErrorChange(null);
    onNext();
  };

  const handleDone = () => {
    if (!storageClassName.trim()) {
      onStorageClassNameErrorChange('Storage Class name is required.');
      return;
    }
    onStorageClassNameErrorChange(null);
    onEditDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Basic Information"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Name */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Name<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Input
              placeholder="Enter a unique name"
              value={storageClassName}
              onChange={(e) => {
                onStorageClassNameChange(e.target.value);
                if (storageClassNameError) onStorageClassNameErrorChange(null);
              }}
              error={!!storageClassNameError}
              fullWidth
            />
            {storageClassNameError && (
              <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                {storageClassNameError}
              </span>
            )}
          </VStack>

          {/* Description */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Description
            </label>
            <Input
              placeholder="Enter a description (optional)"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              fullWidth
            />
          </VStack>

          {/* Next Button */}
          {!isEditing && (
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={handleNext}>
                Next
              </Button>
            </div>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Types for Storage Config
   ---------------------------------------- */

interface Parameter {
  key: string;
  value: string;
}

/* ----------------------------------------
   ParametersSection Component
   ---------------------------------------- */

interface ParametersSectionProps {
  parameters: Parameter[];
  onParametersChange: (params: Parameter[]) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function ParametersSection({
  parameters,
  onParametersChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: ParametersSectionProps) {
  const addParameter = () => {
    onParametersChange([...parameters, { key: '', value: '' }]);
  };

  const removeParameter = (index: number) => {
    onParametersChange(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...parameters];
    newParams[index][field] = value;
    onParametersChange(newParams);
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Parameters"
        showDivider
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
      <SectionCard.Content>
        <VStack gap={1.5}>
          {/* Parameters */}
          {parameters.length > 0 && (
            <VStack gap={2} className="w-full">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_1fr_23px] gap-2">
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Key
                </span>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Value
                </span>
                <div />
              </div>
              {/* Parameter rows */}
              {parameters.map((param, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_23px] gap-2 items-center">
                  <Input
                    placeholder="e.g. foo"
                    value={param.key}
                    onChange={(e) => updateParameter(index, 'key', e.target.value)}
                    fullWidth
                  />
                  <Input
                    placeholder="e.g. bar"
                    value={param.value}
                    onChange={(e) => updateParameter(index, 'value', e.target.value)}
                    fullWidth
                  />
                  <button
                    onClick={() => removeParameter(index)}
                    className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  >
                    <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </button>
                </div>
              ))}
            </VStack>
          )}

          {/* Add Parameter button */}
          <div className="pt-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={addParameter}
            >
              Add Parameter
            </Button>
          </div>

          {/* Next Button */}
          {!isEditing && (
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={onNext}>
                Next
              </Button>
            </div>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   CustomizeSection Component
   ---------------------------------------- */

interface CustomizeSectionProps {
  reclaimPolicy: ReclaimPolicy;
  onReclaimPolicyChange: (value: ReclaimPolicy) => void;
  volumeExpansion: VolumeExpansion;
  onVolumeExpansionChange: (value: VolumeExpansion) => void;
  volumeBindingMode: VolumeBindingMode;
  onVolumeBindingModeChange: (value: VolumeBindingMode) => void;
  mountOptions: MountOption[];
  onMountOptionsChange: (options: MountOption[]) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function CustomizeSection({
  reclaimPolicy,
  onReclaimPolicyChange,
  volumeExpansion,
  onVolumeExpansionChange,
  volumeBindingMode,
  onVolumeBindingModeChange,
  mountOptions,
  onMountOptionsChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: CustomizeSectionProps) {
  const addMountOption = () => {
    onMountOptionsChange([...mountOptions, { value: '' }]);
  };

  const removeMountOption = (index: number) => {
    onMountOptionsChange(mountOptions.filter((_, i) => i !== index));
  };

  const updateMountOption = (index: number, value: string) => {
    const newOptions = [...mountOptions];
    newOptions[index] = { value };
    onMountOptionsChange(newOptions);
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Customize"
        showDivider
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
      <SectionCard.Content>
        <VStack gap={3}>
          {/* Reclaim Policy */}
          <VStack gap={1.5}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
              Reclaim Policy
            </label>
            <RadioGroup
              value={reclaimPolicy}
              onChange={(value) => onReclaimPolicyChange(value as ReclaimPolicy)}
            >
              <VStack gap={1}>
                <Radio
                  value="delete"
                  label="Delete volumes and underlying device when volume claim is deleted"
                />
                <Radio value="retain" label="Retain the volume for manual cleanup" />
              </VStack>
            </RadioGroup>
          </VStack>

          {/* Allow Volume Expansion */}
          <VStack gap={1.5}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
              Allow Volume Expansion
            </label>
            <RadioGroup
              value={volumeExpansion}
              onChange={(value) => onVolumeExpansionChange(value as VolumeExpansion)}
            >
              <VStack gap={1}>
                <Radio value="enabled" label="Enabled" />
                <Radio value="disabled" label="Disabled" />
              </VStack>
            </RadioGroup>
          </VStack>

          {/* Volume Binding Mode */}
          <VStack gap={1.5}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
              Volume Binding Mode
            </label>
            <RadioGroup
              value={volumeBindingMode}
              onChange={(value) => onVolumeBindingModeChange(value as VolumeBindingMode)}
            >
              <VStack gap={1}>
                <Radio
                  value="immediate"
                  label="Bind and provision a persistent volume once the PersistentVolumeClaim is created"
                />
                <Radio
                  value="waitForFirstConsumer"
                  label="Bind and provision a persistent volume once a Pod using the PersistentVolumeClaim is created"
                />
              </VStack>
            </RadioGroup>
          </VStack>

          {/* Mount Options */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
              Mount Options
            </label>
            {mountOptions.map((option, index) => (
              <HStack key={index} gap={2} className="w-full">
                <Input
                  placeholder="e.g. bar"
                  value={option.value}
                  onChange={(e) => updateMountOption(index, e.target.value)}
                  fullWidth
                />
                <button
                  onClick={() => removeMountOption(index)}
                  className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                >
                  <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </HStack>
            ))}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={addMountOption}
            >
              Add Option
            </Button>
          </VStack>

          {/* Done Button (last section) */}
          {!isEditing && (
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={onNext}>
                Done
              </Button>
            </div>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateStorageClassPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [storageClassName, setStorageClassName] = useState('');
  const [description, setDescription] = useState('');

  // Parameters state
  const [parameters, setParameters] = useState<Parameter[]>([]);

  // Customize state
  const [reclaimPolicy, setReclaimPolicy] = useState<ReclaimPolicy>('delete');
  const [volumeExpansion, setVolumeExpansion] = useState<VolumeExpansion>('enabled');
  const [volumeBindingMode, setVolumeBindingMode] = useState<VolumeBindingMode>('immediate');
  const [mountOptions, setMountOptions] = useState<MountOption[]>([]);

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, SectionState>>({
    'basic-info': 'active',
    'storage-config': 'pre',
    customize: 'pre',
  });

  // Editing state
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Validation errors
  const [storageClassNameError, setStorageClassNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Storage Class');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Handle section navigation
  const handleNext = useCallback((currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];

    setSectionStatus((prev) => ({
      ...prev,
      [currentSection]: 'done',
      ...(nextSection && { [nextSection]: 'active' }),
    }));
  }, []);

  // Handle edit - when editing a previous section, subsequent sections become 'writing'
  const handleEdit = useCallback((section: SectionStep) => {
    setEditingSection(section);
    const sectionIndex = SECTION_ORDER.indexOf(section);

    setSectionStatus((prev) => {
      const newStatus = { ...prev };

      // Set all sections to their appropriate state
      SECTION_ORDER.forEach((key, index) => {
        if (index < sectionIndex) {
          newStatus[key] = 'done';
        } else if (index === sectionIndex) {
          newStatus[key] = 'active';
        } else if (prev[key] === 'done' || prev[key] === 'active') {
          // Subsequent sections that were done/active become 'writing'
          newStatus[key] = 'writing';
        }
      });

      return newStatus;
    });
  }, []);

  // Handle edit cancel
  const handleEditCancel = useCallback(() => {
    if (!editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      // Find next writing section to activate
      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }

      // If no writing section, activate first pre section
      if (!nextWritingFound) {
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'pre') {
            newStatus[key] = 'active';
            break;
          }
        }
      }

      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  // Handle edit done
  const handleEditDone = useCallback(() => {
    if (!editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      // Find next writing section to activate
      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }

      // If no writing section, activate first pre section
      if (!nextWritingFound) {
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'pre') {
            newStatus[key] = 'active';
            break;
          }
        }
      }

      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  const handleCancel = useCallback(() => {
    navigate('/container/storage-classes');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!storageClassName.trim()) {
      setStorageClassNameError('Storage Class name is required.');
      setSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
      return;
    }

    console.log('Creating storage class:', {
      storageClassName,
      description,
      parameters,
      customize: {
        reclaimPolicy,
        volumeExpansion,
        volumeBindingMode,
        mountOptions,
      },
    });
    navigate('/container/storage-classes');
  }, [
    storageClassName,
    description,
    parameters,
    reclaimPolicy,
    volumeExpansion,
    volumeBindingMode,
    mountOptions,
    navigate,
  ]);

  // Check if create button should be disabled
  const isCreateDisabled = !storageClassName.trim();

  // Get display values for done sections
  const getReclaimPolicyDisplay = () => {
    return reclaimPolicy === 'delete' ? 'Delete' : 'Retain';
  };

  const getVolumeExpansionDisplay = () => {
    return volumeExpansion === 'enabled' ? 'Enabled' : 'Disabled';
  };

  const getVolumeBindingModeDisplay = () => {
    return volumeBindingMode === 'immediate' ? 'Immediate' : 'WaitForFirstConsumer';
  };

  const getMountOptionsDisplay = () => {
    if (mountOptions.length === 0) return 'None';
    return (
      mountOptions
        .map((o) => o.value)
        .filter((v) => v)
        .join(', ') || 'None'
    );
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Storage Classes', href: '/container/storage-classes' },
                { label: 'Create Storage Class' },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create Storage Class
                </h1>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  {sectionStatus['basic-info'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'active' && (
                    <BasicInfoSection
                      storageClassName={storageClassName}
                      onStorageClassNameChange={setStorageClassName}
                      storageClassNameError={storageClassNameError}
                      onStorageClassNameErrorChange={setStorageClassNameError}
                      description={description}
                      onDescriptionChange={setDescription}
                      onNext={() => handleNext('basic-info')}
                      isEditing={editingSection === 'basic-info'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['basic-info'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['basic-info']}
                      onEdit={() => handleEdit('basic-info')}
                    >
                      <SectionCard.DataRow
                        label="Name"
                        value={storageClassName}
                        showDivider={false}
                      />
                      <SectionCard.DataRow label="Description" value={description || '-'} />
                    </DoneSection>
                  )}

                  {/* Storage Configuration Section */}
                  {sectionStatus['storage-config'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['storage-config']} />
                  )}
                  {sectionStatus['storage-config'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['storage-config']} />
                  )}
                  {sectionStatus['storage-config'] === 'active' && (
                    <ParametersSection
                      parameters={parameters}
                      onParametersChange={setParameters}
                      onNext={() => handleNext('storage-config')}
                      isEditing={editingSection === 'storage-config'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['storage-config'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['storage-config']}
                      onEdit={() => handleEdit('storage-config')}
                    >
                      <SectionCard.DataRow
                        label="Parameters"
                        value={
                          parameters.length > 0
                            ? parameters
                                .map((p) => `${p.key}=${p.value}`)
                                .filter((p) => p !== '=')
                                .join(', ') || 'None'
                            : 'None'
                        }
                        showDivider={false}
                      />
                    </DoneSection>
                  )}

                  {/* Customize Section */}
                  {sectionStatus['customize'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['customize']} />
                  )}
                  {sectionStatus['customize'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['customize']} />
                  )}
                  {sectionStatus['customize'] === 'active' && (
                    <CustomizeSection
                      reclaimPolicy={reclaimPolicy}
                      onReclaimPolicyChange={setReclaimPolicy}
                      volumeExpansion={volumeExpansion}
                      onVolumeExpansionChange={setVolumeExpansion}
                      volumeBindingMode={volumeBindingMode}
                      onVolumeBindingModeChange={setVolumeBindingMode}
                      mountOptions={mountOptions}
                      onMountOptionsChange={setMountOptions}
                      onNext={() => handleNext('customize')}
                      isEditing={editingSection === 'customize'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['customize'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['customize']}
                      onEdit={() => handleEdit('customize')}
                    >
                      <SectionCard.DataRow
                        label="Reclaim Policy"
                        value={getReclaimPolicyDisplay()}
                        showDivider={false}
                      />
                      <SectionCard.DataRow
                        label="Volume Expansion"
                        value={getVolumeExpansionDisplay()}
                      />
                      <SectionCard.DataRow
                        label="Volume Binding Mode"
                        value={getVolumeBindingModeDisplay()}
                      />
                      <SectionCard.DataRow label="Mount Options" value={getMountOptionsDisplay()} />
                    </DoneSection>
                  )}
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar
                  sectionStatus={sectionStatus}
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  isCreateDisabled={isCreateDisabled}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateStorageClassPage;
