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
  IconCirclePlus,
  IconX,
  IconCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'volume-claim' | 'storage-config' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'volume-claim': 'Volume Claim',
  'storage-config': 'Customize',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for sidebar
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'volume-claim',
  'storage-config',
  'labels-annotations',
];

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
  sectionStatuses: Record<SectionStep, 'done' | 'active' | 'pending'>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  sectionStatuses,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
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
                  <SummaryStatusIcon status={sectionStatuses[step]} />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </div>

        {/* Button row */}
        <HStack gap={2}>
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
        </HStack>
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
        <VStack gap={6}>
          {/* Name */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
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
              <span className="text-body-sm text-[var(--color-state-danger)]">{pvcNameError}</span>
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
        <VStack gap={6}>
          {/* Source */}
          <VStack gap={1.5}>
            <label className="text-label-lg text-[var(--color-text-default)]">Source</label>
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
              <label className="text-label-lg text-[var(--color-text-default)]">
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
            <label className="text-label-lg text-[var(--color-text-default)]">
              Request Storage<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <NumberInput
                  value={requestStorage}
                  onChange={(value) => onRequestStorageChange(value)}
                  min={1}
                  placeholder="10"
                  width="sm"
                />
              </div>
              <div>
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
        <VStack gap={6}>
          {/* Access Modes */}
          <VStack gap={1.5}>
            <label className="text-label-lg text-[var(--color-text-default)]">Access Modes</label>
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
        <VStack gap={6}>
          {/* Labels */}
          <VStack gap={6}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={2}>
                {labels.length > 0 && (
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
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={label.key}
                      onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Value"
                      value={label.value}
                      onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => onRemoveLabel(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                    >
                      <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddLabel}
                  >
                    Add Label
                  </Button>
                </div>
              </VStack>
            </div>
          </VStack>

          {/* Annotations */}
          <VStack gap={6}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={6}>
                {annotations.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full items-center">
                    <label className="text-label-lg text-[var(--color-text-default)]">Key</label>
                    <label className="text-label-lg text-[var(--color-text-default)]">Value</label>
                    <div></div>
                  </div>
                )}
                {annotations.map((annotation, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={annotation.key}
                      onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Value"
                      value={annotation.value}
                      onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => onRemoveAnnotation(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                    >
                      <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddAnnotation}
                  >
                    Add Annotation
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

  // Calculate section statuses for summary sidebar
  const getSectionStatuses = useCallback((): Record<SectionStep, 'done' | 'active' | 'pending'> => {
    return {
      'basic-info': pvcName.trim() ? 'done' : 'active',
      'volume-claim': requestStorage.trim() ? 'done' : 'pending',
      'storage-config': 'done', // Access modes have defaults
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pending',
    };
  }, [pvcName, requestStorage, labels.length, annotations.length]);

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
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <VStack gap={2}>
                <div className="flex items-center justify-between h-8">
                  <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                    Create Persistent Volume Claim
                  </h1>
                </div>
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  Persistent Volume Claim is a user request for persistent storage that defines the
                  required capacity and access properties, allowing Kubernetes to bind or
                  dynamically provision a suitable PersistentVolume.
                </p>
              </VStack>

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
                <SummarySidebar
                  sectionStatuses={getSectionStatuses()}
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

export default CreatePersistentVolumeClaimPage;
