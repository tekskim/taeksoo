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
  Select,
  Checkbox,
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
  IconCirclePlus,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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
  pvName: string;
  onNamespaceNameChange: (value: string) => void;
  pvNameError: string | null;
  onNamespaceNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

function BasicInfoSection({
  pvName,
  onNamespaceNameChange,
  pvNameError,
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
              value={pvName}
              onChange={(e) => {
                onNamespaceNameChange(e.target.value);
                if (pvNameError) onNamespaceNameErrorChange(null);
              }}
              error={!!pvNameError}
              fullWidth
            />
            {pvNameError && (
              <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                {pvNameError}
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

// Storage class options
const STORAGE_CLASS_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'slow', label: 'slow' },
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
  storageClassName: string;
  onStorageClassNameChange: (value: string) => void;
  mountOptions: MountOption[];
  onMountOptionsChange: (options: MountOption[]) => void;
  nodeSelectors: NodeSelector[];
  onNodeSelectorsChange: (selectors: NodeSelector[]) => void;
}

function StorageConfigSection({
  accessModes,
  onAccessModesChange,
  storageClassName,
  onStorageClassNameChange,
  mountOptions,
  onMountOptionsChange,
  nodeSelectors,
  onNodeSelectorsChange,
}: StorageConfigSectionProps) {
  // Mount option handlers
  const addMountOption = () => {
    onMountOptionsChange([...mountOptions, { key: '' }]);
  };

  const removeMountOption = (index: number) => {
    onMountOptionsChange(mountOptions.filter((_, i) => i !== index));
  };

  const updateMountOption = (index: number, key: string) => {
    const newOptions = [...mountOptions];
    newOptions[index] = { key };
    onMountOptionsChange(newOptions);
  };

  // Node selector handlers
  const addNodeSelector = () => {
    onNodeSelectorsChange([...nodeSelectors, { rules: [{ key: '', operator: 'In', value: '' }] }]);
  };

  const removeNodeSelector = (selectorIndex: number) => {
    onNodeSelectorsChange(nodeSelectors.filter((_, i) => i !== selectorIndex));
  };

  const addNodeSelectorRule = (selectorIndex: number) => {
    const newSelectors = [...nodeSelectors];
    newSelectors[selectorIndex].rules.push({ key: '', operator: 'In', value: '' });
    onNodeSelectorsChange(newSelectors);
  };

  const removeNodeSelectorRule = (selectorIndex: number, ruleIndex: number) => {
    const newSelectors = [...nodeSelectors];
    newSelectors[selectorIndex].rules = newSelectors[selectorIndex].rules.filter(
      (_, i) => i !== ruleIndex
    );
    if (newSelectors[selectorIndex].rules.length === 0) {
      onNodeSelectorsChange(nodeSelectors.filter((_, i) => i !== selectorIndex));
    } else {
      onNodeSelectorsChange(newSelectors);
    }
  };

  const updateNodeSelectorRule = (
    selectorIndex: number,
    ruleIndex: number,
    field: 'key' | 'operator' | 'value',
    value: string
  ) => {
    const newSelectors = [...nodeSelectors];
    newSelectors[selectorIndex].rules[ruleIndex][field] = value;
    onNodeSelectorsChange(newSelectors);
  };

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

          {/* Assign to Storage Class */}
          <VStack gap={2}>
            <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
              Assign to Storage Class
            </label>
            <Select
              options={STORAGE_CLASS_OPTIONS}
              value={storageClassName}
              onChange={(value) => onStorageClassNameChange(value)}
              fullWidth
            />
          </VStack>

          {/* Mount Options */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
              Mount Options
            </label>
            {mountOptions.length > 0 && (
              <VStack gap={2} className="w-full">
                <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Key
                </label>
                {mountOptions.map((option, index) => (
                  <HStack key={index} gap={2} className="w-full">
                    <Input
                      placeholder="input key"
                      value={option.key}
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
              </VStack>
            )}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={addMountOption}
            >
              Add Option
            </Button>
          </VStack>

          {/* Node Selectors */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[21px]">
              Node Selectors
            </label>
            {nodeSelectors.map((selector, selectorIndex) => (
              <HStack key={selectorIndex} gap={2} align="start" className="w-full">
                <div className="flex-1 border border-[var(--color-border-default)] rounded-[6px] p-3">
                  <VStack gap={2}>
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr_1fr_1fr_23px] gap-2">
                      <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                        Key
                      </span>
                      <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                        Operator
                      </span>
                      <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                        Value
                      </span>
                      <div />
                    </div>
                    {/* Rule rows */}
                    {selector.rules.map((rule, ruleIndex) => (
                      <div
                        key={ruleIndex}
                        className="grid grid-cols-[1fr_1fr_1fr_23px] gap-2 items-center"
                      >
                        <Input
                          placeholder="input key"
                          value={rule.key}
                          onChange={(e) =>
                            updateNodeSelectorRule(selectorIndex, ruleIndex, 'key', e.target.value)
                          }
                          fullWidth
                        />
                        <Select
                          options={OPERATOR_OPTIONS}
                          value={rule.operator}
                          onChange={(value) =>
                            updateNodeSelectorRule(selectorIndex, ruleIndex, 'operator', value)
                          }
                          fullWidth
                        />
                        <Input
                          placeholder="input value"
                          value={rule.value}
                          onChange={(e) =>
                            updateNodeSelectorRule(
                              selectorIndex,
                              ruleIndex,
                              'value',
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                        <button
                          onClick={() => removeNodeSelectorRule(selectorIndex, ruleIndex)}
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
                    {/* Add Rule button */}
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<IconPlus size={12} stroke={1.5} />}
                      onClick={() => addNodeSelectorRule(selectorIndex)}
                    >
                      Add Rule
                    </Button>
                  </VStack>
                </div>
                <button
                  onClick={() => removeNodeSelector(selectorIndex)}
                  className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0 mt-8"
                >
                  <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </HStack>
            ))}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={addNodeSelector}
            >
              Add Node Selector
            </Button>
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
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Labels
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
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

          {/* Annotations */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Annotations
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
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
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreatePersistentVolumePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [pvName, setNamespaceName] = useState('');
  const [description, setDescription] = useState('');

  // Storage Configuration state
  const [accessModes, setAccessModes] = useState({
    singleNodeReadWrite: true,
    manyNodesReadOnly: false,
    manyNodesReadWrite: false,
  });
  const [storageClassName, setStorageClassName] = useState('');
  const [mountOptions, setMountOptions] = useState<MountOption[]>([]);
  const [nodeSelectors, setNodeSelectors] = useState<NodeSelector[]>([]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Validation errors
  const [pvNameError, setNamespaceNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Persistent Volume');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/persistent-volumes');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!pvName.trim()) {
      setNamespaceNameError('Namespace name is required.');
      return;
    }

    console.log('Creating persistent volume:', {
      pvName,
      description,
      storageConfig: {
        accessModes,
        storageClassName,
        mountOptions,
        nodeSelectors,
      },
      labels,
      annotations,
    });
    navigate('/container/persistent-volumes');
  }, [
    pvName,
    description,
    accessModes,
    storageClassName,
    mountOptions,
    nodeSelectors,
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
  const isCreateDisabled = !pvName.trim();

  // Compute section statuses for summary
  const basicInfoComplete = pvName.trim().length > 0;
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
                { label: 'Persistent Volumes', href: '/container/persistent-volumes' },
                { label: 'Create Persistent Volume' },
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
                  Create Persistent Volume
                </h1>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <BasicInfoSection
                    pvName={pvName}
                    onNamespaceNameChange={setNamespaceName}
                    pvNameError={pvNameError}
                    onNamespaceNameErrorChange={setNamespaceNameError}
                    description={description}
                    onDescriptionChange={setDescription}
                  />

                  {/* Storage Configuration Section */}
                  <StorageConfigSection
                    accessModes={accessModes}
                    onAccessModesChange={setAccessModes}
                    storageClassName={storageClassName}
                    onStorageClassNameChange={setStorageClassName}
                    mountOptions={mountOptions}
                    onMountOptionsChange={setMountOptions}
                    nodeSelectors={nodeSelectors}
                    onNodeSelectorsChange={setNodeSelectors}
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
                          Create
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

export default CreatePersistentVolumePage;
