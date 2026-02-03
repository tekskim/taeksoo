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
  SectionCard,
  Disclosure,
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

type SectionStep = 'basic-info' | 'storage-config' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'storage-config': 'Customize',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for display
const SECTION_ORDER: SectionStep[] = ['basic-info', 'storage-config', 'labels-annotations'];

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
  sectionStatus: Record<SectionStep, 'done' | 'active' | 'pending'>;
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
                  <SummaryStatusIcon status={sectionStatus[step]} />
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
  pvName: string;
  onNamespaceNameChange: (value: string) => void;
  pvNameError: string | null;
  onNamespaceNameErrorChange: (error: string | null) => void;
  capacity: number;
  onCapacityChange: (value: number) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

function BasicInfoSection({
  pvName,
  onNamespaceNameChange,
  pvNameError,
  onNamespaceNameErrorChange,
  capacity,
  onCapacityChange,
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
              value={pvName}
              onChange={(e) => {
                onNamespaceNameChange(e.target.value);
                if (pvNameError) onNamespaceNameErrorChange(null);
              }}
              error={!!pvNameError}
              fullWidth
            />
            {pvNameError && (
              <span className="text-body-sm text-[var(--color-state-danger)]">{pvNameError}</span>
            )}
          </VStack>

          {/* Capacity */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
              Capacity<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <HStack gap={2} align="center">
              <NumberInput value={capacity} onChange={onCapacityChange} min={1} step={1} />
              <span className="text-body-md text-[var(--color-text-default)]">GiB</span>
            </HStack>
          </VStack>

          {/* Description */}
          <Disclosure>
            <Disclosure.Trigger>Description</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-2">
                <Input
                  placeholder="Enter a description (optional)"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  fullWidth
                />
              </div>
            </Disclosure.Panel>
          </Disclosure>
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

          {/* Assign to Storage Class */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
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
            <label className="text-label-lg text-[var(--color-text-default)]">Mount Options</label>
            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={3}>
                {mountOptions.length > 0 && (
                  <div className="grid grid-cols-[1fr_23px] gap-2 w-full">
                    <label className="text-label-sm text-[var(--color-text-default)] leading-4">
                      Option
                    </label>
                    <div />
                  </div>
                )}
                {mountOptions.map((option, index) => (
                  <div key={index} className="grid grid-cols-[1fr_23px] gap-2 w-full items-center">
                    <Input
                      placeholder="input key"
                      value={option.key}
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
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={addMountOption}
                  >
                    Add Option
                  </Button>
                </div>
              </VStack>
            </div>
          </VStack>

          {/* Node Selectors */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">Node Selectors</label>
            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={3}>
                {nodeSelectors.map((selector, selectorIndex) => (
                  <div
                    key={selectorIndex}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                  >
                    <HStack gap={2} align="start" className="w-full">
                      <div className="flex-1">
                        <VStack gap={2}>
                          {/* Header row */}
                          <div className="grid grid-cols-[1fr_1fr_1fr_23px] gap-2">
                            <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                              Key
                            </span>
                            <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                              Operator
                            </span>
                            <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
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
                                  updateNodeSelectorRule(
                                    selectorIndex,
                                    ruleIndex,
                                    'key',
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                              <Select
                                options={OPERATOR_OPTIONS}
                                value={rule.operator}
                                onChange={(value) =>
                                  updateNodeSelectorRule(
                                    selectorIndex,
                                    ruleIndex,
                                    'operator',
                                    value
                                  )
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
                                className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconX
                                  size={12}
                                  className="text-[var(--color-text-muted)]"
                                  stroke={1.5}
                                />
                              </button>
                            </div>
                          ))}
                          {/* Add Rule button */}
                          <div className="w-fit">
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                              onClick={() => addNodeSelectorRule(selectorIndex)}
                            >
                              Add Rule
                            </Button>
                          </div>
                        </VStack>
                      </div>
                      <button
                        onClick={() => removeNodeSelector(selectorIndex)}
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0 self-start"
                      >
                        <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </HStack>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={addNodeSelector}
                  >
                    Add Node Selector
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
              <VStack gap={3}>
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                  >
                    <HStack gap={2} className="w-full items-center">
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
                    </HStack>
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
              <VStack gap={3}>
                {annotations.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_23px] gap-2 w-full">
                    <label className="text-label-sm text-[var(--color-text-default)] leading-4">
                      Key
                    </label>
                    <label className="text-label-sm text-[var(--color-text-default)] leading-4">
                      Value
                    </label>
                    <div />
                  </div>
                )}
                {annotations.map((annotation, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_23px] gap-2 w-full items-center"
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

export function CreatePersistentVolumePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [pvName, setNamespaceName] = useState('');
  const [capacity, setCapacity] = useState<number>(1);
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

  // Calculate section status for sidebar display
  const getSectionStatus = useCallback(
    (section: SectionStep): 'done' | 'active' | 'pending' => {
      if (section === 'basic-info') {
        return pvName.trim() ? 'done' : 'active';
      }
      if (section === 'storage-config') {
        // Consider active if any storage config is set
        return storageClassName || mountOptions.length > 0 || nodeSelectors.length > 0
          ? 'done'
          : 'pending';
      }
      if (section === 'labels-annotations') {
        return labels.length > 0 || annotations.length > 0 ? 'done' : 'pending';
      }
      return 'pending';
    },
    [
      pvName,
      storageClassName,
      mountOptions.length,
      nodeSelectors.length,
      labels.length,
      annotations.length,
    ]
  );

  const sectionStatus: Record<SectionStep, 'done' | 'active' | 'pending'> = {
    'basic-info': getSectionStatus('basic-info'),
    'storage-config': getSectionStatus('storage-config'),
    'labels-annotations': getSectionStatus('labels-annotations'),
  };

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
      capacity,
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
    capacity,
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
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <VStack gap={6}>
                <div className="flex items-center justify-between h-8">
                  <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                    Create Persistent Volume
                  </h1>
                </div>
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  Persistent Volume is a pre-provisioned and cluster-wide storage resource that
                  provides reliable and reusable data space for applications or Persistent Volume
                  Claims.
                </p>
              </VStack>

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
                    capacity={capacity}
                    onCapacityChange={setCapacity}
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

export default CreatePersistentVolumePage;
