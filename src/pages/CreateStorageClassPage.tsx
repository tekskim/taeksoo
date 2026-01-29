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
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

// Reclaim Policy options
type ReclaimPolicy = 'delete' | 'retain';

// Allow Volume Expansion options
type VolumeExpansion = 'enabled' | 'disabled';

// Volume Binding Mode options
type VolumeBindingMode = 'immediate' | 'waitForFirstConsumer';

interface Parameter {
  key: string;
  value: string;
}

interface MountOption {
  value: string;
}

/* ----------------------------------------
   Summary Item Component
   ---------------------------------------- */

interface SummaryItemProps {
  label: string;
  status: 'complete' | 'in-progress';
}

function SummaryItem({ label, status }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1 w-full">
      <span className="text-[12px] leading-5 text-[var(--color-text-default)]">{label}</span>
      <div className="w-4 h-4 flex items-center justify-center">
        {status === 'complete' ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="var(--color-state-success)" />
            <path
              d="M5 8L7 10L11 6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="var(--color-border-default)"
              strokeDasharray="3 3"
            />
          </svg>
        )}
      </div>
    </div>
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

  // Parameter management
  const addParameter = useCallback(() => {
    setParameters([...parameters, { key: '', value: '' }]);
  }, [parameters]);

  const removeParameter = useCallback(
    (index: number) => {
      setParameters(parameters.filter((_, i) => i !== index));
    },
    [parameters]
  );

  const updateParameter = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newParams = [...parameters];
      newParams[index][field] = value;
      setParameters(newParams);
    },
    [parameters]
  );

  // Mount option management
  const addMountOption = useCallback(() => {
    setMountOptions([...mountOptions, { value: '' }]);
  }, [mountOptions]);

  const removeMountOption = useCallback(
    (index: number) => {
      setMountOptions(mountOptions.filter((_, i) => i !== index));
    },
    [mountOptions]
  );

  const updateMountOption = useCallback(
    (index: number, value: string) => {
      const newOptions = [...mountOptions];
      newOptions[index] = { value };
      setMountOptions(newOptions);
    },
    [mountOptions]
  );

  // Check if create button should be disabled
  const isCreateDisabled = !storageClassName.trim();

  // Compute section statuses for summary
  const basicInfoComplete = storageClassName.trim().length > 0;
  const parametersComplete = true; // Optional section, always considered complete
  const customizeComplete = true; // Optional section, always considered complete

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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
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
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" showDivider />
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
                              setStorageClassName(e.target.value);
                              if (storageClassNameError) setStorageClassNameError(null);
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
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                          />
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Parameters Section */}
                  <SectionCard>
                    <SectionCard.Header title="Parameters" showDivider />
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
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_23px] gap-2 items-center"
                              >
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
                                  <IconX
                                    size={16}
                                    className="text-[var(--color-text-muted)]"
                                    stroke={1.5}
                                  />
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
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Customize Section */}
                  <SectionCard>
                    <SectionCard.Header title="Customize" showDivider />
                    <SectionCard.Content>
                      <VStack gap={3}>
                        {/* Reclaim Policy */}
                        <VStack gap={1.5}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
                            Reclaim Policy
                          </label>
                          <RadioGroup
                            value={reclaimPolicy}
                            onChange={(value) => setReclaimPolicy(value as ReclaimPolicy)}
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
                            onChange={(value) => setVolumeExpansion(value as VolumeExpansion)}
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
                            onChange={(value) => setVolumeBindingMode(value as VolumeBindingMode)}
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
                                <IconX
                                  size={16}
                                  className="text-[var(--color-text-muted)]"
                                  stroke={1.5}
                                />
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
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* Summary Sidebar */}
                <div className="w-[280px] shrink-0">
                  <div className="sticky top-4">
                    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[8px] shadow-[var(--shadow-md)] overflow-hidden flex flex-col gap-6 pt-3 pb-4 px-3">
                      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[8px] px-4 py-4">
                        <VStack gap={4}>
                          <h5 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                            Summary
                          </h5>
                          <VStack gap={0}>
                            <SummaryItem
                              label="Basic Information"
                              status={basicInfoComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Parameters"
                              status={parametersComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Customize"
                              status={customizeComplete ? 'complete' : 'in-progress'}
                            />
                          </VStack>
                        </VStack>
                      </div>
                      <HStack gap={2} className="w-full justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancel}
                          className="w-[80px]"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleCreate}
                          className="flex-1 min-w-[80px]"
                          disabled={isCreateDisabled}
                        >
                          Create Storage Class
                        </Button>
                      </HStack>
                    </div>
                  </div>
                </div>
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateStorageClassPage;
