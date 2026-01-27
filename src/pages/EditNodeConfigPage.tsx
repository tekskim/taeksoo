import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Disclosure,
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

type SectionStep = 'basic-info' | 'taints' | 'labels-annotations';
type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  taints: 'Taints',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'taints', 'labels-annotations'];

// Effect options for taints
const TAINT_EFFECT_OPTIONS = [
  { value: 'NoSchedule', label: 'NoSchedule' },
  { value: 'PreferNoSchedule', label: 'PreferNoSchedule' },
  { value: 'NoExecute', label: 'NoExecute' },
];

interface Taint {
  key: string;
  value: string;
  effect: string;
}

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
  onSave: () => void;
}

function SummarySidebar({ sectionStatus, onCancel, onSave }: SummarySidebarProps) {
  // Map SectionState to WizardSectionState
  const mapState = (state: SectionState): WizardSectionState => {
    if (state === 'pre') return 'pre';
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
          <Button variant="primary" onClick={onSave} className="flex-1">
            Save
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
  nodeName: string;
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInfoSection({
  nodeName,
  description,
  onDescriptionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInfoSectionProps) {
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
              <Button variant="primary" size="sm" onClick={onEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Node Name (Read-only) */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Node Name<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Input
              value={nodeName}
              disabled
              fullWidth
              className="bg-[var(--color-surface-muted)]"
            />
          </VStack>

          {/* Description with Disclosure */}
          <Disclosure title="Description" defaultOpen>
            <VStack gap={2} className="w-full">
              <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                Description
              </label>
              <Input
                placeholder="Enter description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                fullWidth
              />
            </VStack>
          </Disclosure>

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
   TaintsSection Component
   ---------------------------------------- */

interface TaintsSectionProps {
  taints: Taint[];
  onAddTaint: () => void;
  onRemoveTaint: (index: number) => void;
  onUpdateTaint: (index: number, field: 'key' | 'value' | 'effect', value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function TaintsSection({
  taints,
  onAddTaint,
  onRemoveTaint,
  onUpdateTaint,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: TaintsSectionProps) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Taints"
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
          {/* Column Headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 w-full">
            <VStack gap={1}>
              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                Key
              </span>
              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Key is used as the identifier for the taint applied to the node.
              </span>
            </VStack>
            <VStack gap={1}>
              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                Value
              </span>
              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Value provides additional information for the taint.
              </span>
            </VStack>
            <VStack gap={1}>
              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                Effect
              </span>
              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Define how the taint influences pod scheduling.
              </span>
            </VStack>
            <div className="w-6" /> {/* Spacer for delete button column */}
          </div>

          {/* Taint Rows */}
          {taints.map((taint, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 w-full items-end">
              <Input
                placeholder="input key"
                value={taint.key}
                onChange={(e) => onUpdateTaint(index, 'key', e.target.value)}
                fullWidth
              />
              <Input
                placeholder="input value"
                value={taint.value}
                onChange={(e) => onUpdateTaint(index, 'value', e.target.value)}
                fullWidth
              />
              <Select
                options={TAINT_EFFECT_OPTIONS}
                value={taint.effect}
                onChange={(value) => onUpdateTaint(index, 'effect', value)}
                placeholder="Select effect"
                fullWidth
              />
              <button
                onClick={() => onRemoveTaint(index)}
                className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              >
                <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </div>
          ))}

          {/* Add Taint Button */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<IconPlus size={12} stroke={1.5} />}
            onClick={onAddTaint}
          >
            Add Taint
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
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                Labels
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>

            {/* Label Headers */}
            {labels.length > 0 && (
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full">
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                  Key
                </span>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                  Value
                </span>
                <div className="w-6" />
              </div>
            )}

            {labels.map((label, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full items-center">
                <Input
                  placeholder="input key"
                  value={label.key}
                  onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                  fullWidth
                />
                <Input
                  placeholder="input value"
                  value={label.value}
                  onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                  fullWidth
                />
                <button
                  onClick={() => onRemoveLabel(index)}
                  className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                >
                  <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </div>
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
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                Annotations
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>

            {/* Annotation Headers */}
            {annotations.length > 0 && (
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full">
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                  Key
                </span>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                  Value
                </span>
                <div className="w-6" />
              </div>
            )}

            {annotations.map((annotation, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full items-center">
                <Input
                  placeholder="input key"
                  value={annotation.key}
                  onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                  fullWidth
                />
                <Input
                  placeholder="input value"
                  value={annotation.value}
                  onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                  fullWidth
                />
                <button
                  onClick={() => onRemoveAnnotation(index)}
                  className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                >
                  <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </div>
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

export function EditNodeConfigPage() {
  const navigate = useNavigate();
  const { nodeName: nodeNameParam } = useParams<{ nodeName: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Node name from URL
  const nodeName = nodeNameParam || 'node-control-plane-01';

  // Basic information state
  const [description, setDescription] = useState('');

  // Taints state
  const [taints, setTaints] = useState<Taint[]>([{ key: '', value: '', effect: 'NoSchedule' }]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<Annotation[]>([{ key: '', value: '' }]);

  // Section states - start with all sections active for edit flow
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, SectionState>>({
    'basic-info': 'active',
    taints: 'pre',
    'labels-annotations': 'pre',
  });

  // Editing state
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Edit: ${nodeName}`);
  }, [updateActiveTabLabel, nodeName]);

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
    navigate('/container/nodes');
  }, [navigate]);

  const handleSave = useCallback(() => {
    console.log('Saving node config:', {
      nodeName,
      description,
      taints: taints.filter((t) => t.key.trim() !== ''),
      labels: labels.filter((l) => l.key.trim() !== ''),
      annotations: annotations.filter((a) => a.key.trim() !== ''),
    });
    navigate('/container/nodes');
  }, [nodeName, description, taints, labels, annotations, navigate]);

  // Taint management
  const addTaint = useCallback(() => {
    setTaints([...taints, { key: '', value: '', effect: 'NoSchedule' }]);
  }, [taints]);

  const removeTaint = useCallback(
    (index: number) => {
      setTaints(taints.filter((_, i) => i !== index));
    },
    [taints]
  );

  const updateTaint = useCallback(
    (index: number, field: 'key' | 'value' | 'effect', value: string) => {
      const newTaints = [...taints];
      newTaints[index][field] = value;
      setTaints(newTaints);
    },
    [taints]
  );

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

  // Get display values for done sections
  const getTaintsDisplay = () => {
    const validTaints = taints.filter((t) => t.key.trim() !== '');
    if (validTaints.length === 0) return 'None';
    return validTaints.map((t) => `${t.key}=${t.value}:${t.effect}`).join(', ');
  };

  const getLabelsDisplay = () => {
    const validLabels = labels.filter((l) => l.key.trim() !== '');
    if (validLabels.length === 0) return 'None';
    return validLabels.map((l) => `${l.key}: ${l.value}`).join(', ');
  };

  const getAnnotationsDisplay = () => {
    const validAnnotations = annotations.filter((a) => a.key.trim() !== '');
    if (validAnnotations.length === 0) return 'None';
    return validAnnotations.map((a) => `${a.key}: ${a.value}`).join(', ');
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
                { label: 'Nodes', href: '/container/nodes' },
                { label: `Edit: ${nodeName}` },
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
            <VStack gap={6}>
              {/* Page Header */}
              <div className="flex items-center justify-between min-h-8">
                <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                  Node: {nodeName}
                </h1>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={3} className="flex-1">
                  {/* Basic Information Section */}
                  {sectionStatus['basic-info'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'active' && (
                    <BasicInfoSection
                      nodeName={nodeName}
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
                      <SectionCard.DataRow label="Node Name" value={nodeName} showDivider={false} />
                      <SectionCard.DataRow label="Description" value={description || '-'} />
                    </DoneSection>
                  )}

                  {/* Taints Section */}
                  {sectionStatus['taints'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['taints']} />
                  )}
                  {sectionStatus['taints'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['taints']} />
                  )}
                  {sectionStatus['taints'] === 'active' && (
                    <TaintsSection
                      taints={taints}
                      onAddTaint={addTaint}
                      onRemoveTaint={removeTaint}
                      onUpdateTaint={updateTaint}
                      onNext={() => handleNext('taints')}
                      isEditing={editingSection === 'taints'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['taints'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['taints']}
                      onEdit={() => handleEdit('taints')}
                    >
                      <SectionCard.DataRow
                        label="Taints"
                        value={getTaintsDisplay()}
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
                  onSave={handleSave}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditNodeConfigPage;
