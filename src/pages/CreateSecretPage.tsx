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
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'data' | 'labels-annotations';
type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  data: 'Data',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'labels-annotations'];

// Secret type options
const SECRET_TYPE_OPTIONS = [
  { value: 'custom', label: 'Custom Type' },
  { value: 'opaque', label: 'Opaque' },
  { value: 'docker-registry', label: 'Docker Registry' },
  { value: 'tls', label: 'TLS' },
  { value: 'ssh-auth', label: 'SSH Auth' },
  { value: 'basic-auth', label: 'Basic Auth' },
];

// Namespace options
const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
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
            Create Secret
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
  secretType: string;
  onSecretTypeChange: (value: string) => void;
  customType: string;
  onCustomTypeChange: (value: string) => void;
  customTypeError: string | null;
  onCustomTypeErrorChange: (error: string | null) => void;
  secretName: string;
  onSecretNameChange: (value: string) => void;
  secretNameError: string | null;
  onSecretNameErrorChange: (error: string | null) => void;
  namespace: string;
  onNamespaceChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInfoSection({
  secretType,
  onSecretTypeChange,
  customType,
  onCustomTypeChange,
  customTypeError,
  onCustomTypeErrorChange,
  secretName,
  onSecretNameChange,
  secretNameError,
  onSecretNameErrorChange,
  namespace,
  onNamespaceChange,
  description,
  onDescriptionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInfoSectionProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(true);

  const validateForm = () => {
    let isValid = true;

    // Validate custom type if secret type is custom
    if (secretType === 'custom' && !customType.trim()) {
      onCustomTypeErrorChange('Custom type is required.');
      isValid = false;
    } else {
      onCustomTypeErrorChange(null);
    }

    // Validate secret name
    if (!secretName.trim()) {
      onSecretNameErrorChange('Secret name is required.');
      isValid = false;
    } else {
      onSecretNameErrorChange(null);
    }

    return isValid;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    onNext();
  };

  const handleDone = () => {
    if (!validateForm()) return;
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
        <VStack gap={6}>
          {/* Secret Type */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
              Secret Type<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Select
              options={SECRET_TYPE_OPTIONS}
              value={secretType}
              onChange={onSecretTypeChange}
              fullWidth
            />
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              Create a Secret with a custom type
            </span>
          </VStack>

          {/* Custom Type (shown when Secret Type is "custom") */}
          {secretType === 'custom' && (
            <VStack gap={2}>
              <label className="text-label-lg text-[var(--color-text-default)]">
                Custom Type<span className="text-[var(--color-state-danger)]"> *</span>
              </label>
              <Input
                placeholder="Custom Type"
                value={customType}
                onChange={(e) => {
                  onCustomTypeChange(e.target.value);
                  if (customTypeError) onCustomTypeErrorChange(null);
                }}
                error={!!customTypeError}
                fullWidth
              />
              {customTypeError && (
                <span className="text-body-sm text-[var(--color-state-danger)]">
                  {customTypeError}
                </span>
              )}
            </VStack>
          )}

          {/* Namespace */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
              Namespace<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Select
              options={NAMESPACE_OPTIONS}
              value={namespace}
              onChange={onNamespaceChange}
              fullWidth
            />
          </VStack>

          {/* Name */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
              Name<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Input
              placeholder="Enter a unique name"
              value={secretName}
              onChange={(e) => {
                onSecretNameChange(e.target.value);
                if (secretNameError) onSecretNameErrorChange(null);
              }}
              error={!!secretNameError}
              fullWidth
            />
            {secretNameError && (
              <span className="text-body-sm text-[var(--color-state-danger)]">
                {secretNameError}
              </span>
            )}
          </VStack>

          {/* Description - Collapsible */}
          <VStack gap={3}>
            <button
              type="button"
              className="flex items-center gap-1.5 text-label-lg text-[var(--color-text-default)]"
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            >
              {descriptionExpanded ? (
                <IconChevronDown size={12} stroke={1.5} />
              ) : (
                <IconChevronRight size={12} stroke={1.5} />
              )}
              Description
            </button>
            {descriptionExpanded && (
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                fullWidth
              />
            )}
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
   Types for Data Section
   ---------------------------------------- */

interface DataEntry {
  key: string;
  value: string;
}

/* ----------------------------------------
   DataSection Component
   ---------------------------------------- */

interface DataSectionProps {
  dataEntries: DataEntry[];
  onDataEntriesChange: (entries: DataEntry[]) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function DataSection({
  dataEntries,
  onDataEntriesChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: DataSectionProps) {
  const addDataEntry = () => {
    onDataEntriesChange([...dataEntries, { key: '', value: '' }]);
  };

  const removeDataEntry = (index: number) => {
    onDataEntriesChange(dataEntries.filter((_, i) => i !== index));
  };

  const updateDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...dataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onDataEntriesChange(newEntries);
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Data"
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
          {/* Data Entries */}
          {dataEntries.length > 0 && (
            <VStack gap={2} className="w-full">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_1fr_23px] gap-2">
                <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                  Key
                </span>
                <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                  Value
                </span>
                <div />
              </div>
              {dataEntries.map((entry, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_23px] gap-2 items-center">
                  <Input
                    placeholder="Enter key"
                    value={entry.key}
                    onChange={(e) => updateDataEntry(index, 'key', e.target.value)}
                    fullWidth
                  />
                  <Input
                    placeholder="Enter value"
                    value={entry.value}
                    onChange={(e) => updateDataEntry(index, 'value', e.target.value)}
                    fullWidth
                  />
                  <button
                    onClick={() => removeDataEntry(index)}
                    className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  >
                    <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </button>
                </div>
              ))}
            </VStack>
          )}

          <HStack gap={2}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={addDataEntry}
            >
              Add Data Entry
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconFile size={12} stroke={1.5} />}
              onClick={() => {
                // TODO: Implement file reading functionality
                console.log('Read from file clicked');
              }}
            >
              Read from File
            </Button>
          </HStack>

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
                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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

export function CreateSecretPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [secretType, setSecretType] = useState('custom');
  const [customType, setCustomType] = useState('');
  const [customTypeError, setCustomTypeError] = useState<string | null>(null);
  const [secretName, setSecretName] = useState('');
  const [secretNameError, setSecretNameError] = useState<string | null>(null);
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Data state
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, SectionState>>({
    'basic-info': 'active',
    data: 'pre',
    'labels-annotations': 'pre',
  });

  // Editing state
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Secret');
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
    navigate('/container/secrets');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!secretName.trim()) {
      setSecretNameError('Secret name is required.');
      setSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
      return;
    }

    console.log('Creating secret:', {
      secretType,
      customType: secretType === 'custom' ? customType : undefined,
      secretName,
      namespace,
      description,
      data: dataEntries.reduce(
        (acc, entry) => {
          if (entry.key) acc[entry.key] = entry.value;
          return acc;
        },
        {} as Record<string, string>
      ),
      labels,
      annotations,
    });
    navigate('/container/secrets');
  }, [
    secretType,
    customType,
    secretName,
    namespace,
    description,
    dataEntries,
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
  const isCreateDisabled = !secretName.trim();

  // Get display values for done sections
  const getDataDisplay = () => {
    if (dataEntries.length === 0) return 'No data entries';
    return `${dataEntries.filter((e) => e.key).length} data entry(ies)`;
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
                { label: 'Secrets', href: '/container/secrets' },
                { label: 'Create Secret' },
              ]}
            />
          }
          actions={
            <>
              <button className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors">
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
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create Secret</h1>
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
                      secretType={secretType}
                      onSecretTypeChange={setSecretType}
                      customType={customType}
                      onCustomTypeChange={setCustomType}
                      customTypeError={customTypeError}
                      onCustomTypeErrorChange={setCustomTypeError}
                      secretName={secretName}
                      onSecretNameChange={setSecretName}
                      secretNameError={secretNameError}
                      onSecretNameErrorChange={setSecretNameError}
                      namespace={namespace}
                      onNamespaceChange={setNamespace}
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
                        label="Secret Type"
                        value={
                          SECRET_TYPE_OPTIONS.find((o) => o.value === secretType)?.label ||
                          secretType
                        }
                        showDivider={false}
                      />
                      {secretType === 'custom' && (
                        <SectionCard.DataRow label="Custom Type" value={customType || '-'} />
                      )}
                      <SectionCard.DataRow label="Namespace" value={namespace || '-'} />
                      <SectionCard.DataRow label="Name" value={secretName} />
                      <SectionCard.DataRow label="Description" value={description || '-'} />
                    </DoneSection>
                  )}

                  {/* Data Section */}
                  {sectionStatus['data'] === 'pre' && <PreSection title={SECTION_LABELS['data']} />}
                  {sectionStatus['data'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['data']} />
                  )}
                  {sectionStatus['data'] === 'active' && (
                    <DataSection
                      dataEntries={dataEntries}
                      onDataEntriesChange={setDataEntries}
                      onNext={() => handleNext('data')}
                      isEditing={editingSection === 'data'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['data'] === 'done' && (
                    <DoneSection title={SECTION_LABELS['data']} onEdit={() => handleEdit('data')}>
                      <SectionCard.DataRow
                        label="Data Entries"
                        value={getDataDisplay()}
                        showDivider={false}
                      />
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

export default CreateSecretPage;
