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

type SectionStep = 'basic-info' | 'storage-config' | 'labels-annotations';
type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'storage-config': 'Customize',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
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
   PreSection Component
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
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
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
        <span className="text-body-sm text-[var(--color-text-subtle)]">Writing...</span>
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
            Create Persistent Volume
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
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInfoSection({
  pvName,
  onNamespaceNameChange,
  pvNameError,
  onNamespaceNameErrorChange,
  description,
  onDescriptionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInfoSectionProps) {
  const handleNext = () => {
    if (!pvName.trim()) {
      onNamespaceNameErrorChange('Namespace name is required.');
      return;
    }
    onNamespaceNameErrorChange(null);
    onNext();
  };

  const handleDone = () => {
    if (!pvName.trim()) {
      onNamespaceNameErrorChange('Namespace name is required.');
      return;
    }
    onNamespaceNameErrorChange(null);
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
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
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
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
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
            <label className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
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
            {mountOptions.length > 0 && (
              <VStack gap={2} className="w-full">
                <label className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
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
            <label className="text-label-lg text-[var(--color-text-default)]">Node Selectors</label>
            {nodeSelectors.map((selector, selectorIndex) => (
              <HStack key={selectorIndex} gap={2} align="start" className="w-full">
                <div className="flex-1 border border-[var(--color-border-default)] rounded-[6px] p-3">
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
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
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
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: LabelsAnnotationsSectionProps) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Labels & Annotations"
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
        <VStack gap={4}>
          {/* Labels */}
          <VStack gap={4}>
            <VStack gap={1}>
              <span className="text-label-sm text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
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
              <span className="text-label-sm text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
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

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, SectionState>>({
    'basic-info': 'active',
    'storage-config': 'pre',
    'labels-annotations': 'pre',
  });

  // Editing state
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

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
    navigate('/container/persistent-volumes');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!pvName.trim()) {
      setNamespaceNameError('Namespace name is required.');
      setSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
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

  // Get display values for done sections
  const getAccessModesDisplay = () => {
    const modes = [];
    if (accessModes.singleNodeReadWrite) modes.push('RWO');
    if (accessModes.manyNodesReadOnly) modes.push('ROX');
    if (accessModes.manyNodesReadWrite) modes.push('RWX');
    return modes.length > 0 ? modes.join(', ') : 'None';
  };

  const getLabelsDisplay = () => {
    if (labels.length === 0) return 'None';
    return labels.map((l) => `${l.key}: ${l.value}`).join(', ');
  };

  const getAnnotationsDisplay = () => {
    if (annotations.length === 0) return 'None';
    return annotations.map((a) => `${a.key}: ${a.value}`).join(', ');
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
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Create Persistent Volume
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
                      pvName={pvName}
                      onNamespaceNameChange={setNamespaceName}
                      pvNameError={pvNameError}
                      onNamespaceNameErrorChange={setNamespaceNameError}
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
                      <SectionCard.DataRow label="Name" value={pvName} showDivider={false} />
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
                    <StorageConfigSection
                      accessModes={accessModes}
                      onAccessModesChange={setAccessModes}
                      storageClassName={storageClassName}
                      onStorageClassNameChange={setStorageClassName}
                      mountOptions={mountOptions}
                      onMountOptionsChange={setMountOptions}
                      nodeSelectors={nodeSelectors}
                      onNodeSelectorsChange={setNodeSelectors}
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
                        label="Access Modes"
                        value={getAccessModesDisplay()}
                        showDivider={false}
                      />
                      {storageClassName && (
                        <SectionCard.DataRow label="Storage Class" value={storageClassName} />
                      )}
                      {mountOptions.length > 0 && (
                        <SectionCard.DataRow
                          label="Mount Options"
                          value={
                            mountOptions
                              .map((o) => o.key)
                              .filter((k) => k)
                              .join(', ') || 'None'
                          }
                        />
                      )}
                      {nodeSelectors.length > 0 && (
                        <SectionCard.DataRow
                          label="Node Selectors"
                          value={`${nodeSelectors.length} selector(s)`}
                        />
                      )}
                    </DoneSection>
                  )}

                  {/* Labels & Annotations Section */}
                  {sectionStatus['labels-annotations'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['labels-annotations']} />
                  )}
                  {sectionStatus['labels-annotations'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['labels-annotations']} />
                  )}
                  {sectionStatus['labels-annotations'] === 'active' && (
                    <LabelsAnnotationsSection
                      labels={labels}
                      onAddLabel={addLabel}
                      onRemoveLabel={removeLabel}
                      onUpdateLabel={updateLabel}
                      annotations={annotations}
                      onAddAnnotation={addAnnotation}
                      onRemoveAnnotation={removeAnnotation}
                      onUpdateAnnotation={updateAnnotation}
                      onNext={() => handleNext('labels-annotations')}
                      isEditing={editingSection === 'labels-annotations'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['labels-annotations'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['labels-annotations']}
                      onEdit={() => handleEdit('labels-annotations')}
                    >
                      <SectionCard.DataRow
                        label="Labels"
                        value={getLabelsDisplay()}
                        showDivider={false}
                      />
                      <SectionCard.DataRow label="Annotations" value={getAnnotationsDisplay()} />
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

export default CreatePersistentVolumePage;
