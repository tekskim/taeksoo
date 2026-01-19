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
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'data' | 'labels-annotations';
type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'data': 'Resource Quotas',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'data',
  'labels-annotations',
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

function SummarySidebar({ sectionStatus, onCancel, onCreate, isCreateDisabled }: SummarySidebarProps) {
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
    <div className="w-[312px] shrink-0 sticky top-4 self-start">
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
            Create Resource Quota
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
  resourceQuotaName: string;
  onResourceQuotaNameChange: (value: string) => void;
  resourceQuotaNameError: string | null;
  onResourceQuotaNameErrorChange: (error: string | null) => void;
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
  resourceQuotaName,
  onResourceQuotaNameChange,
  resourceQuotaNameError,
  onResourceQuotaNameErrorChange,
  namespace,
  onNamespaceChange,
  description,
  onDescriptionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInfoSectionProps) {
  const handleNext = () => {
    if (!resourceQuotaName.trim()) {
      onResourceQuotaNameErrorChange('Limit range name is required.');
      return;
    }
    onResourceQuotaNameErrorChange(null);
    onNext();
  };

  const handleDone = () => {
    if (!resourceQuotaName.trim()) {
      onResourceQuotaNameErrorChange('Limit range name is required.');
      return;
    }
    onResourceQuotaNameErrorChange(null);
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
          {/* Namespace */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
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
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Resource Quota Name<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Input
              placeholder="Enter a unique name"
              value={resourceQuotaName}
              onChange={(e) => {
                onResourceQuotaNameChange(e.target.value);
                if (resourceQuotaNameError) onResourceQuotaNameErrorChange(null);
              }}
              error={!!resourceQuotaNameError}
              fullWidth
            />
            {resourceQuotaNameError && (
              <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                {resourceQuotaNameError}
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
   Types for Resource Quotas Section
   ---------------------------------------- */

interface ResourceQuotaItem {
  id: string;
  resourceType: string;
  limit: string;
}

const RESOURCE_TYPE_OPTIONS = [
  { value: 'configmaps', label: 'Config Maps' },
  { value: 'cpu-limit', label: 'CPU Limit' },
  { value: 'memory-limit', label: 'Memory Limit' },
  { value: 'persistentvolumeclaims', label: 'Persistent Volume Claims' },
  { value: 'pods', label: 'Pods' },
  { value: 'replicationcontrollers', label: 'Replication Controllers' },
  { value: 'cpu-reservation', label: 'CPU Reservation' },
  { value: 'memory-reservation', label: 'Memory Reservation' },
  { value: 'storage-reservation', label: 'Storage Reservation' },
  { value: 'secrets', label: 'Secrets' },
  { value: 'services', label: 'Services' },
  { value: 'services-loadbalancers', label: 'Services Load Balancers' },
  { value: 'services-nodeports', label: 'Service Node Ports' },
];

// Get unit suffix for resource type
const getResourceUnit = (resourceType: string): string | null => {
  switch (resourceType) {
    case 'cpu-limit':
    case 'cpu-reservation':
      return 'mCPUs';
    case 'memory-limit':
    case 'memory-reservation':
    case 'storage-reservation':
      return 'GiB';
    default:
      return null;
  }
};

// Get placeholder for resource type
const getResourcePlaceholder = (resourceType: string): string => {
  switch (resourceType) {
    case 'cpu-limit':
    case 'cpu-reservation':
      return 'e.g. 2000';
    case 'memory-limit':
    case 'memory-reservation':
    case 'storage-reservation':
      return 'e.g. 2048';
    default:
      return 'e.g. 50';
  }
};

/* ----------------------------------------
   ResourceQuotasSection Component
   ---------------------------------------- */

interface ResourceQuotasSectionProps {
  quotaItems: ResourceQuotaItem[];
  onQuotaItemsChange: (items: ResourceQuotaItem[]) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function ResourceQuotasSection({
  quotaItems,
  onQuotaItemsChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: ResourceQuotasSectionProps) {
  const addQuotaItem = () => {
    const newItem: ResourceQuotaItem = {
      id: `quota-${Date.now()}`,
      resourceType: '',
      limit: '',
    };
    onQuotaItemsChange([...quotaItems, newItem]);
  };

  const removeQuotaItem = (id: string) => {
    onQuotaItemsChange(quotaItems.filter((item) => item.id !== id));
  };

  const updateQuotaItem = (id: string, field: 'resourceType' | 'limit', value: string) => {
    onQuotaItemsChange(
      quotaItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Resource Quotas"
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
        <VStack gap={5}>
          {/* Header Labels */}
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <VStack gap={1}>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Resource Type
                </span>
                <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                  Select the resource type to apply the quota.
                </span>
              </VStack>
            </div>
            <div className="flex-1">
              <VStack gap={1}>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Limit
                </span>
                <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                  Specify the maximum usage allowed for the selected resource type.
                </span>
              </VStack>
            </div>
            <div className="w-[16px]" />
          </div>

          {/* Quota Items */}
          {quotaItems.length > 0 && (
            <VStack gap={2} className="w-full">
              {quotaItems.map((item) => {
                const unit = getResourceUnit(item.resourceType);
                const placeholder = getResourcePlaceholder(item.resourceType);
                return (
                  <div key={item.id} className="flex gap-2 items-center w-full">
                    <div className="flex-1">
                      <Select
                        options={RESOURCE_TYPE_OPTIONS}
                        value={item.resourceType}
                        onChange={(value) => updateQuotaItem(item.id, 'resourceType', value)}
                        placeholder="Select resource type"
                        fullWidth
                      />
                    </div>
                    <div className="flex-1 relative">
                      <Input
                        placeholder={placeholder}
                        value={item.limit}
                        onChange={(e) => updateQuotaItem(item.id, 'limit', e.target.value)}
                        fullWidth
                      />
                      {unit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--color-text-default)]">
                          {unit}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeQuotaItem(item.id)}
                      className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                );
              })}
            </VStack>
          )}

          {/* Add Resource Button */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<IconPlus size={12} stroke={1.5} />}
            onClick={addQuotaItem}
          >
            Add Resource
          </Button>

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

export function CreateResourceQuotaPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [resourceQuotaName, setResourceQuotaName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Resource Quotas state
  const [quotaItems, setQuotaItems] = useState<ResourceQuotaItem[]>([]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, SectionState>>({
    'basic-info': 'active',
    'data': 'pre',
    'labels-annotations': 'pre',
  });

  // Editing state
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Validation errors
  const [resourceQuotaNameError, setResourceQuotaNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } = useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Resource Quota');
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
    navigate('/container/resource-quotas');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!resourceQuotaName.trim()) {
      setResourceQuotaNameError('Limit range name is required.');
      setSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
      return;
    }

    console.log('Creating resource quota:', {
      resourceQuotaName,
      namespace,
      description,
      quotaItems,
      labels,
      annotations,
    });
    navigate('/container/resource-quotas');
  }, [
    resourceQuotaName,
    namespace,
    description,
    quotaItems,
    labels,
    annotations,
    navigate,
  ]);

  // Label management
  const addLabel = useCallback(() => {
    setLabels([...labels, { key: '', value: '' }]);
  }, [labels]);

  const removeLabel = useCallback((index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
  }, [labels]);

  const updateLabel = useCallback((index: number, field: 'key' | 'value', value: string) => {
    const newLabels = [...labels];
    newLabels[index][field] = value;
    setLabels(newLabels);
  }, [labels]);

  // Annotation management
  const addAnnotation = useCallback(() => {
    setAnnotations([...annotations, { key: '', value: '' }]);
  }, [annotations]);

  const removeAnnotation = useCallback((index: number) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
  }, [annotations]);

  const updateAnnotation = useCallback((index: number, field: 'key' | 'value', value: string) => {
    const newAnnotations = [...annotations];
    newAnnotations[index][field] = value;
    setAnnotations(newAnnotations);
  }, [annotations]);

  // Check if create button should be disabled
  const isCreateDisabled = !resourceQuotaName.trim();

  // Get display values for done sections
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
                { label: 'Resource Quotas', href: '/container/resource-quotas' },
                { label: 'Create Resource Quota' },
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
                  Create Resource Quota
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
                      resourceQuotaName={resourceQuotaName}
                      onResourceQuotaNameChange={setResourceQuotaName}
                      resourceQuotaNameError={resourceQuotaNameError}
                      onResourceQuotaNameErrorChange={setResourceQuotaNameError}
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
                      <SectionCard.DataRow label="Namespace" value={namespace || '-'} showDivider={false} />
                      <SectionCard.DataRow label="Resource Quota Name" value={resourceQuotaName} />
                      <SectionCard.DataRow label="Description" value={description || '-'} />
                    </DoneSection>
                  )}

                  {/* Data Section */}
                  {sectionStatus['data'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['data']} />
                  )}
                  {sectionStatus['data'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['data']} />
                  )}
                  {sectionStatus['data'] === 'active' && (
                    <ResourceQuotasSection
                      quotaItems={quotaItems}
                      onQuotaItemsChange={setQuotaItems}
                      onNext={() => handleNext('data')}
                      isEditing={editingSection === 'data'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['data'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['data']}
                      onEdit={() => handleEdit('data')}
                    >
                      <SectionCard.DataRow 
                        label="Resource Quotas" 
                        value={quotaItems.length > 0 ? `${quotaItems.length} quota(s) configured` : 'No quotas configured'} 
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
                      <SectionCard.DataRow label="Labels" value={getLabelsDisplay()} showDivider={false} />
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

export default CreateResourceQuotaPage;
