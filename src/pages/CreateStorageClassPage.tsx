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
  SectionCard,
} from '@/design-system';
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
  IconCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'storage-config' | 'customize';

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
   Summary Status Icon Component
   ---------------------------------------- */

function SummaryStatusIcon({ status }: { status: 'done' | 'active' | 'pending' }) {
  // done → success (green check)
  if (status === 'done') {
    return (
      <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center">
        <IconCheck size={10} stroke={2} className="text-white" />
      </div>
    );
  }
  // active → dashed circle with spinning animation
  if (status === 'active') {
    return (
      <div
        className="size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }
  // pre/default → empty dashed circle
  return (
    <div
      className="size-4 rounded-full border border-[var(--color-border-default)] shrink-0"
      style={{ borderStyle: 'dashed' }}
    />
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  storageClassName: string;
  parameters: Parameter[];
  hasCustomizeData: boolean;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

interface Parameter {
  key: string;
  value: string;
}

function SummarySidebar({
  storageClassName,
  parameters,
  hasCustomizeData,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  // Determine section status based on form data
  const getSectionStatus = (section: SectionStep): 'done' | 'active' | 'pending' => {
    if (section === 'basic-info') {
      return storageClassName.trim() ? 'done' : 'active';
    }
    if (section === 'storage-config') {
      return parameters.length > 0 && parameters.some((p) => p.key.trim() || p.value.trim())
        ? 'done'
        : 'pending';
    }
    if (section === 'customize') {
      return hasCustomizeData ? 'done' : 'pending';
    }
    return 'pending';
  };

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Inner subtle-bg container */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={4}>
            <span className="text-heading-h5">Summary</span>
            <VStack gap={0}>
              {SECTION_ORDER.map((step) => (
                <HStack key={step} justify="between" className="py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {SECTION_LABELS[step]}
                  </span>
                  <SummaryStatusIcon status={getSectionStatus(step)} />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </div>

        {/* Button row */}
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
            Create
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
}

function BasicInfoSection({
  storageClassName,
  onStorageClassNameChange,
  storageClassNameError,
  onStorageClassNameErrorChange,
  description,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Basic Information" showDivider />
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Name */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
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
              <span className="text-body-sm text-[var(--color-state-danger)]">
                {storageClassNameError}
              </span>
            )}
          </VStack>

          {/* Description */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">Description</label>
            <Input
              placeholder="Enter a description (optional)"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              fullWidth
            />
          </VStack>
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
}

function ParametersSection({ parameters, onParametersChange }: ParametersSectionProps) {
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
    <SectionCard>
      <SectionCard.Header title="Parameters" showDivider />
      <SectionCard.Content>
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
          <VStack gap={3}>
            {/* Parameter rows */}
            {parameters.map((param, index) => (
              <div
                key={index}
                className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
              >
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                  <VStack gap={2}>
                    <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                      Key
                    </span>
                    <Input
                      placeholder="e.g. foo"
                      value={param.key}
                      onChange={(e) => updateParameter(index, 'key', e.target.value)}
                      fullWidth
                    />
                  </VStack>
                  <VStack gap={2}>
                    <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                      Value
                    </span>
                    <Input
                      placeholder="e.g. bar"
                      value={param.value}
                      onChange={(e) => updateParameter(index, 'value', e.target.value)}
                      fullWidth
                    />
                  </VStack>
                  <div className="pt-6">
                    <button
                      onClick={() => removeParameter(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Parameter button */}
            <div className="w-fit">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconPlus size={12} stroke={1.5} />}
                onClick={addParameter}
              >
                Add Parameter
              </Button>
            </div>
          </VStack>
        </div>
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
    <SectionCard>
      <SectionCard.Header title="Customize" showDivider />
      <SectionCard.Content>
        <VStack gap={3}>
          {/* Reclaim Policy */}
          <VStack gap={1.5}>
            <label className="text-label-lg text-[var(--color-text-default)]">Reclaim Policy</label>
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
            <label className="text-label-lg text-[var(--color-text-default)]">
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
            <label className="text-label-lg text-[var(--color-text-default)]">
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
          <VStack gap={3}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)]">
              Mount Options
            </label>
            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={3}>
                {mountOptions.map((option, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                  >
                    <div className="flex gap-2 items-start">
                      <Input
                        placeholder="e.g. bar"
                        value={option.value}
                        onChange={(e) => updateMountOption(index, e.target.value)}
                        fullWidth
                      />
                      <button
                        onClick={() => removeMountOption(index)}
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                      >
                        <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconPlus size={12} stroke={1.5} />}
                    onClick={addMountOption}
                  >
                    Add Option
                  </Button>
                </div>
              </VStack>
            </div>
          </VStack>
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

  const handleCancel = useCallback(() => {
    navigate('/container/storage-classes');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!storageClassName.trim()) {
      setStorageClassNameError('Storage Class name is required.');
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

  // Check if customize section has any non-default data
  const hasCustomizeData =
    reclaimPolicy !== 'delete' ||
    volumeExpansion !== 'enabled' ||
    volumeBindingMode !== 'immediate' ||
    mountOptions.length > 0;

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
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Create Storage Class
                </h1>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <BasicInfoSection
                    storageClassName={storageClassName}
                    onStorageClassNameChange={setStorageClassName}
                    storageClassNameError={storageClassNameError}
                    onStorageClassNameErrorChange={setStorageClassNameError}
                    description={description}
                    onDescriptionChange={setDescription}
                  />

                  {/* Parameters Section */}
                  <ParametersSection parameters={parameters} onParametersChange={setParameters} />

                  {/* Customize Section */}
                  <CustomizeSection
                    reclaimPolicy={reclaimPolicy}
                    onReclaimPolicyChange={setReclaimPolicy}
                    volumeExpansion={volumeExpansion}
                    onVolumeExpansionChange={setVolumeExpansion}
                    volumeBindingMode={volumeBindingMode}
                    onVolumeBindingModeChange={setVolumeBindingMode}
                    mountOptions={mountOptions}
                    onMountOptionsChange={setMountOptions}
                  />
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar
                  storageClassName={storageClassName}
                  parameters={parameters}
                  hasCustomizeData={hasCustomizeData}
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
