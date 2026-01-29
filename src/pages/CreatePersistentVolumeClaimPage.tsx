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
  NumberInput,
  Select,
  Checkbox,
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

// Storage class options for Volume Claim
const STORAGE_CLASS_OPTIONS = [
  { value: 'default', label: 'Default Storage Class' },
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'slow', label: 'slow' },
];

// Storage unit options
const STORAGE_UNIT_OPTIONS = [
  { value: 'GiB', label: 'GiB' },
  { value: 'MiB', label: 'MiB' },
  { value: 'TiB', label: 'TiB' },
];

// Access Mode options
const ACCESS_MODE_OPTIONS = [
  { value: 'ReadWriteOnce', label: 'ReadWriteOnce' },
  { value: 'ReadOnlyMany', label: 'ReadOnlyMany' },
  { value: 'ReadWriteMany', label: 'ReadWriteMany' },
  { value: 'ReadWriteOncePod', label: 'ReadWriteOncePod' },
];

// Reclaim Policy options
const RECLAIM_POLICY_OPTIONS = [
  { value: 'Retain', label: 'Retain' },
  { value: 'Recycle', label: 'Recycle' },
  { value: 'Delete', label: 'Delete' },
];

// Volume Mode options
const VOLUME_MODE_OPTIONS = [
  { value: 'Filesystem', label: 'Filesystem' },
  { value: 'Block', label: 'Block' },
];

// Capacity Unit options
const CAPACITY_UNIT_OPTIONS = [
  { value: 'Gi', label: 'Gi' },
  { value: 'Mi', label: 'Mi' },
  { value: 'Ti', label: 'Ti' },
];

interface Label {
  key: string;
  value: string;
}

interface Annotation {
  key: string;
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
   BasicInfoSection Component
   ---------------------------------------- */

interface BasicInfoSectionProps {
  pvcName: string;
  onNamespaceNameChange: (value: string) => void;
  pvcNameError: string | null;
  onNamespaceNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

function BasicInfoSection({
  pvcName,
  onNamespaceNameChange,
  pvcNameError,
  onNamespaceNameErrorChange,
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
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Name<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Input
              placeholder="Enter a unique name"
              value={pvcName}
              onChange={(e) => {
                onNamespaceNameChange(e.target.value);
                if (pvcNameError) onNamespaceNameErrorChange(null);
              }}
              error={!!pvcNameError}
              fullWidth
            />
            {pvcNameError && (
              <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                {pvcNameError}
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
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   VolumeClaimSection Component
   ---------------------------------------- */

type VolumeSourceType = 'storage-class' | 'existing-pv';

interface VolumeClaimSectionProps {
  sourceType: VolumeSourceType;
  onSourceTypeChange: (value: VolumeSourceType) => void;
  storageClass: string;
  onStorageClassChange: (value: string) => void;
  requestStorage: string;
  onRequestStorageChange: (value: string) => void;
  storageUnit: string;
  onStorageUnitChange: (value: string) => void;
}

function VolumeClaimSection({
  sourceType,
  onSourceTypeChange,
  storageClass,
  onStorageClassChange,
  requestStorage,
  onRequestStorageChange,
  storageUnit,
  onStorageUnitChange,
}: VolumeClaimSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Volume Claim" showDivider />
      <SectionCard.Content>
        <VStack gap={3}>
          {/* Source */}
          <VStack gap={1.5}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
              Source
            </label>
            <RadioGroup
              value={sourceType}
              onChange={(value) => onSourceTypeChange(value as VolumeSourceType)}
            >
              <VStack gap={1}>
                <Radio
                  value="storage-class"
                  label="Use a Storage Class to provision a new Persistent Volume"
                />
                <Radio value="existing-pv" label="Use an existing Persistent Volume" />
              </VStack>
            </RadioGroup>
          </VStack>

          {/* Storage Class - only show when using storage class source */}
          {sourceType === 'storage-class' && (
            <VStack gap={2}>
              <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                Storage Class
              </label>
              <Select
                options={STORAGE_CLASS_OPTIONS}
                value={storageClass}
                onChange={(value) => onStorageClassChange(value)}
                fullWidth
              />
            </VStack>
          )}

          {/* Request Storage */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Request Storage<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <NumberInput
                  value={requestStorage}
                  onChange={(value) => onRequestStorageChange(value)}
                  min={1}
                  placeholder="10"
                  fullWidth
                />
              </div>
              <div className="w-[100px]">
                <Select
                  options={STORAGE_UNIT_OPTIONS}
                  value={storageUnit}
                  onChange={(value) => onStorageUnitChange(value)}
                  fullWidth
                />
              </div>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Types for Storage Config
   ---------------------------------------- */

interface MountOption {
  key: string;
}

interface NodeSelectorRule {
  key: string;
  operator: string;
  value: string;
}

interface NodeSelector {
  rules: NodeSelectorRule[];
}

// Operator options for node selectors
const OPERATOR_OPTIONS = [
  { value: 'In', label: 'in list' },
  { value: 'NotIn', label: 'not in list' },
  { value: 'Exists', label: 'exists' },
  { value: 'DoesNotExist', label: 'does not exist' },
  { value: 'Gt', label: 'greater than' },
  { value: 'Lt', label: 'less than' },
];

/* ----------------------------------------
   StorageConfigSection Component
   ---------------------------------------- */

interface StorageConfigSectionProps {
  accessModes: {
    singleNodeReadWrite: boolean;
    manyNodesReadOnly: boolean;
    manyNodesReadWrite: boolean;
  };
  onAccessModesChange: (modes: {
    singleNodeReadWrite: boolean;
    manyNodesReadOnly: boolean;
    manyNodesReadWrite: boolean;
  }) => void;
}

function StorageConfigSection({ accessModes, onAccessModesChange }: StorageConfigSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Customize" showDivider />
      <SectionCard.Content>
        <VStack gap={3}>
          {/* Access Modes */}
          <VStack gap={1.5}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
              Access Modes
            </label>
            <VStack gap={1.5}>
              <Checkbox
                checked={accessModes.singleNodeReadWrite}
                onChange={(e) =>
                  onAccessModesChange({ ...accessModes, singleNodeReadWrite: e.target.checked })
                }
                label="Single Node Read-Write"
              />
              <Checkbox
                checked={accessModes.manyNodesReadOnly}
                onChange={(e) =>
                  onAccessModesChange({ ...accessModes, manyNodesReadOnly: e.target.checked })
                }
                label="Many Nodes Read-Only"
              />
              <Checkbox
                checked={accessModes.manyNodesReadWrite}
                onChange={(e) =>
                  onAccessModesChange({ ...accessModes, manyNodesReadWrite: e.target.checked })
                }
                label="Many Nodes Read-Write"
              />
            </VStack>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   LabelsAnnotationsSection Component
   ---------------------------------------- */

interface LabelsAnnotationsSectionProps {
  labels: Label[];
  onAddLabel: () => void;
  onRemoveLabel: (index: number) => void;
  onUpdateLabel: (index: number, field: 'key' | 'value', value: string) => void;
  annotations: Annotation[];
  onAddAnnotation: () => void;
  onRemoveAnnotation: (index: number) => void;
  onUpdateAnnotation: (index: number, field: 'key' | 'value', value: string) => void;
}

function LabelsAnnotationsSection({
  labels,
  onAddLabel,
  onRemoveLabel,
  onUpdateLabel,
  annotations,
  onAddAnnotation,
  onRemoveAnnotation,
  onUpdateAnnotation,
}: LabelsAnnotationsSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Labels & Annotations" showDivider />
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Labels */}
          <VStack gap={4}>
            <VStack gap={1}>
              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                Labels
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>

            {labels.map((label, index) => (
              <HStack gap={2} key={index} className="w-full">
                <Input
                  placeholder="Key"
                  value={label.key}
                  onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={label.value}
                  onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                  className="flex-1"
                />
                <button
                  onClick={() => onRemoveLabel(index)}
                  className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                >
                  <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </HStack>
            ))}

            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={onAddLabel}
            >
              Add Label
            </Button>
          </VStack>

          {/* Annotations */}
          <VStack gap={4}>
            <VStack gap={1}>
              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                Annotations
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>

            {annotations.map((annotation, index) => (
              <HStack gap={2} key={index} className="w-full">
                <Input
                  placeholder="Key"
                  value={annotation.key}
                  onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={annotation.value}
                  onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                  className="flex-1"
                />
                <button
                  onClick={() => onRemoveAnnotation(index)}
                  className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                >
                  <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </HStack>
            ))}

            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={onAddAnnotation}
            >
              Add Annotation
            </Button>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreatePersistentVolumeClaimPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [pvcName, setNamespaceName] = useState('');
  const [description, setDescription] = useState('');

  // Volume Claim state
  const [sourceType, setSourceType] = useState<VolumeSourceType>('storage-class');
  const [storageClass, setStorageClass] = useState('default');
  const [requestStorage, setRequestStorage] = useState('10');
  const [storageUnit, setStorageUnit] = useState('GiB');

  // Storage Configuration state
  const [accessModes, setAccessModes] = useState({
    singleNodeReadWrite: true,
    manyNodesReadOnly: false,
    manyNodesReadWrite: false,
  });

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Validation errors
  const [pvcNameError, setNamespaceNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Persistent Volume Claim');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/pvc');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!pvcName.trim()) {
      setNamespaceNameError('Namespace name is required.');
      return;
    }

    console.log('Creating persistent volume claim:', {
      pvcName,
      description,
      volumeClaim: {
        sourceType,
        storageClass,
        requestStorage: `${requestStorage}${storageUnit}`,
      },
      storageConfig: {
        accessModes,
      },
      labels,
      annotations,
    });
    navigate('/container/pvc');
  }, [
    pvcName,
    description,
    sourceType,
    storageClass,
    requestStorage,
    storageUnit,
    accessModes,
    labels,
    annotations,
    navigate,
  ]);

  // Label management
  const addLabel = useCallback(() => {
    setLabels([...labels, { key: '', value: '' }]);
  }, [labels]);

  const removeLabel = useCallback(
    (index: number) => {
      setLabels(labels.filter((_, i) => i !== index));
    },
    [labels]
  );

  const updateLabel = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newLabels = [...labels];
      newLabels[index][field] = value;
      setLabels(newLabels);
    },
    [labels]
  );

  // Annotation management
  const addAnnotation = useCallback(() => {
    setAnnotations([...annotations, { key: '', value: '' }]);
  }, [annotations]);

  const removeAnnotation = useCallback(
    (index: number) => {
      setAnnotations(annotations.filter((_, i) => i !== index));
    },
    [annotations]
  );

  const updateAnnotation = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newAnnotations = [...annotations];
      newAnnotations[index][field] = value;
      setAnnotations(newAnnotations);
    },
    [annotations]
  );

  // Check if create button should be disabled
  const isCreateDisabled = !pvcName.trim();

  // Compute section statuses for summary
  const basicInfoComplete = pvcName.trim().length > 0;
  const volumeClaimComplete = requestStorage.trim().length > 0;
  const storageConfigComplete = true; // Optional section, always considered complete
  const labelsAnnotationsComplete = true; // Optional section, always considered complete

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
                { label: 'Persistent Volume Claims', href: '/container/pvc' },
                { label: 'Create Persistent Volume Claim' },
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
                  Create Persistent Volume Claim
                </h1>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <BasicInfoSection
                    pvcName={pvcName}
                    onNamespaceNameChange={setNamespaceName}
                    pvcNameError={pvcNameError}
                    onNamespaceNameErrorChange={setNamespaceNameError}
                    description={description}
                    onDescriptionChange={setDescription}
                  />

                  {/* Volume Claim Section */}
                  <VolumeClaimSection
                    sourceType={sourceType}
                    onSourceTypeChange={setSourceType}
                    storageClass={storageClass}
                    onStorageClassChange={setStorageClass}
                    requestStorage={requestStorage}
                    onRequestStorageChange={setRequestStorage}
                    storageUnit={storageUnit}
                    onStorageUnitChange={setStorageUnit}
                  />

                  {/* Storage Configuration Section */}
                  <StorageConfigSection
                    accessModes={accessModes}
                    onAccessModesChange={setAccessModes}
                  />

                  {/* Labels & Annotations Section */}
                  <LabelsAnnotationsSection
                    labels={labels}
                    onAddLabel={addLabel}
                    onRemoveLabel={removeLabel}
                    onUpdateLabel={updateLabel}
                    annotations={annotations}
                    onAddAnnotation={addAnnotation}
                    onRemoveAnnotation={removeAnnotation}
                    onUpdateAnnotation={updateAnnotation}
                  />
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
                              label="Volume Claim"
                              status={volumeClaimComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Customize"
                              status={storageConfigComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Labels & Annotations"
                              status={labelsAnnotationsComplete ? 'complete' : 'in-progress'}
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
                          Create Persistent Volume Claim
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

export default CreatePersistentVolumeClaimPage;
