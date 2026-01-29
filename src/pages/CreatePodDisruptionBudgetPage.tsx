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
  Table,
  NumberInput,
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

type SectionStep = 'basic-info' | 'data' | 'selector' | 'labels-annotations';
type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  data: 'Budget',
  selector: 'Selector',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'selector', 'labels-annotations'];

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
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">
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
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">
          {title}
        </h5>
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
            Create Pod Disruption Budget
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
  podDisruptionBudgetName: string;
  onPodDisruptionBudgetNameChange: (value: string) => void;
  podDisruptionBudgetNameError: string | null;
  onPodDisruptionBudgetNameErrorChange: (error: string | null) => void;
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
  podDisruptionBudgetName,
  onPodDisruptionBudgetNameChange,
  podDisruptionBudgetNameError,
  onPodDisruptionBudgetNameErrorChange,
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
    if (!podDisruptionBudgetName.trim()) {
      onPodDisruptionBudgetNameErrorChange('Limit range name is required.');
      return;
    }
    onPodDisruptionBudgetNameErrorChange(null);
    onNext();
  };

  const handleDone = () => {
    if (!podDisruptionBudgetName.trim()) {
      onPodDisruptionBudgetNameErrorChange('Limit range name is required.');
      return;
    }
    onPodDisruptionBudgetNameErrorChange(null);
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
              value={podDisruptionBudgetName}
              onChange={(e) => {
                onPodDisruptionBudgetNameChange(e.target.value);
                if (podDisruptionBudgetNameError) onPodDisruptionBudgetNameErrorChange(null);
              }}
              error={!!podDisruptionBudgetNameError}
              fullWidth
            />
            {podDisruptionBudgetNameError && (
              <span className="text-body-sm text-[var(--color-state-danger)]">
                {podDisruptionBudgetNameError}
              </span>
            )}
          </VStack>

          {/* Description */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
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
   Types for Selector Section
   ---------------------------------------- */

interface SelectorRule {
  id: string;
  key: string;
  operator: string;
  value: string;
}

interface MatchingPod {
  id: string;
  name: string;
  createdAt: string;
}

const OPERATOR_OPTIONS = [
  { value: 'in', label: 'in list' },
  { value: 'not-in', label: 'not in list' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' },
];

// Mock matching pods data
const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'deploymentName-77f6bb9c69-4ww7f', createdAt: '2025-07-25 09:12:20' },
  { id: '2', name: 'deploymentName-77f6bb9c69-8xyz1', createdAt: '2025-07-25 09:12:18' },
  { id: '3', name: 'deploymentName-77f6bb9c69-2abc3', createdAt: '2025-07-25 09:12:15' },
];

// Budget unit options
const BUDGET_UNIT_OPTIONS = [
  { value: 'pods', label: 'Pods' },
  { value: 'percent', label: '%' },
];

/* ----------------------------------------
   BudgetSection Component
   ---------------------------------------- */

interface BudgetSectionProps {
  minAvailablePods: number;
  onMinAvailablePodsChange: (value: number) => void;
  minAvailableUnit: string;
  onMinAvailableUnitChange: (value: string) => void;
  maxUnavailablePods: number;
  onMaxUnavailablePodsChange: (value: number) => void;
  maxUnavailableUnit: string;
  onMaxUnavailableUnitChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BudgetSection({
  minAvailablePods,
  onMinAvailablePodsChange,
  minAvailableUnit,
  onMinAvailableUnitChange,
  maxUnavailablePods,
  onMaxUnavailablePodsChange,
  maxUnavailableUnit,
  onMaxUnavailableUnitChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BudgetSectionProps) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Budget"
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
          {/* Budget Fields */}
          <Disclosure title="Budget" defaultOpen>
            <div className="flex gap-3 pl-3">
              {/* Min. available Pods */}
              <VStack gap={2} className="flex-1">
                <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                  Min. available Pods
                </span>
                <HStack gap={2}>
                  <div className="flex-1">
                    <NumberInput
                      value={minAvailablePods}
                      onChange={onMinAvailablePodsChange}
                      min={0}
                      fullWidth
                    />
                  </div>
                  <div className="w-[103px]">
                    <Select
                      options={BUDGET_UNIT_OPTIONS}
                      value={minAvailableUnit}
                      onChange={onMinAvailableUnitChange}
                      fullWidth
                    />
                  </div>
                </HStack>
              </VStack>

              {/* Max. unavailable Pods */}
              <VStack gap={2} className="flex-1">
                <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                  Max. unavailable Pods
                </span>
                <HStack gap={2}>
                  <div className="flex-1">
                    <NumberInput
                      value={maxUnavailablePods}
                      onChange={onMaxUnavailablePodsChange}
                      min={0}
                      fullWidth
                    />
                  </div>
                  <div className="w-[103px]">
                    <Select
                      options={BUDGET_UNIT_OPTIONS}
                      value={maxUnavailableUnit}
                      onChange={onMaxUnavailableUnitChange}
                      fullWidth
                    />
                  </div>
                </HStack>
              </VStack>
            </div>
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
   SelectorSection Component
   ---------------------------------------- */

interface SelectorSectionProps {
  selectorRules: SelectorRule[];
  onSelectorRulesChange: (rules: SelectorRule[]) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function SelectorSection({
  selectorRules,
  onSelectorRulesChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: SelectorSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add a new selector rule
  const addRule = () => {
    const newRule: SelectorRule = {
      id: `selector-${Date.now()}`,
      key: '',
      operator: 'in',
      value: '',
    };
    onSelectorRulesChange([...selectorRules, newRule]);
  };

  // Remove a selector rule
  const removeRule = (id: string) => {
    onSelectorRulesChange(selectorRules.filter((rule) => rule.id !== id));
  };

  // Update a selector rule
  const updateRule = (id: string, field: keyof SelectorRule, value: string) => {
    onSelectorRulesChange(
      selectorRules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
  };

  // Paginated matching pods
  const totalItems = MOCK_MATCHING_PODS.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPods = MOCK_MATCHING_PODS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Selector"
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
          {/* Description */}
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Selector keys and values are intended to match labels and values on existing pods.
          </span>

          {/* Column Headers */}
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                Key
              </span>
            </div>
            <div className="flex-1">
              <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                Operator
              </span>
            </div>
            <div className="flex-1">
              <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                Value
              </span>
            </div>
            <div className="w-[23px]" />
          </div>

          {/* Selector Rules */}
          {selectorRules.length > 0 && (
            <VStack gap={2} className="w-full">
              {selectorRules.map((rule) => (
                <div key={rule.id} className="flex gap-2 items-center w-full">
                  <div className="flex-1">
                    <Input
                      placeholder="input key"
                      value={rule.key}
                      onChange={(e) => updateRule(rule.id, 'key', e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      options={OPERATOR_OPTIONS}
                      value={rule.operator}
                      onChange={(value) => updateRule(rule.id, 'operator', value)}
                      fullWidth
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="input value"
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                      fullWidth
                    />
                  </div>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors w-[23px] flex justify-center"
                  >
                    <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </button>
                </div>
              ))}
            </VStack>
          )}

          {/* Add Rule Button */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<IconPlus size={12} stroke={1.5} />}
            onClick={addRule}
          >
            Add Rule
          </Button>

          {/* Matching Pods Section */}
          <VStack gap={2} className="w-full">
            <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
              Matching Pods
            </span>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
              >
                <span className="text-[var(--color-text-default)]">‹</span>
              </button>
              <span className="w-6 h-6 flex items-center justify-center bg-[var(--color-action-primary)] text-white rounded-md text-label-sm">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
              >
                <span className="text-[var(--color-text-default)]">›</span>
              </button>
              <div className="w-px h-4 bg-[var(--color-border-default)]" />
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                {totalItems} items
              </span>
            </div>

            {/* Table */}
            <Table
              columns={[
                {
                  key: 'name',
                  label: 'Name',
                  render: (value) => (
                    <span className="text-[var(--color-action-primary)]">{value}</span>
                  ),
                },
                {
                  key: 'createdAt',
                  label: 'Created At',
                },
              ]}
              data={paginatedPods}
              rowKey="id"
            />
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
              <span className="text-label-sm text-[var(--color-text-default)]">
                Labels
              </span>
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
              <span className="text-label-sm text-[var(--color-text-default)]">
                Annotations
              </span>
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

export function CreatePodDisruptionBudgetPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [podDisruptionBudgetName, setPodDisruptionBudgetName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Budget state
  const [minAvailablePods, setMinAvailablePods] = useState(0);
  const [minAvailableUnit, setMinAvailableUnit] = useState('pods');
  const [maxUnavailablePods, setMaxUnavailablePods] = useState(0);
  const [maxUnavailableUnit, setMaxUnavailableUnit] = useState('pods');

  // Selector state
  const [selectorRules, setSelectorRules] = useState<SelectorRule[]>([]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, SectionState>>({
    'basic-info': 'active',
    data: 'pre',
    selector: 'pre',
    'labels-annotations': 'pre',
  });

  // Editing state
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Validation errors
  const [podDisruptionBudgetNameError, setPodDisruptionBudgetNameError] = useState<string | null>(
    null
  );

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Pod Disruption Budget');
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
    navigate('/container/pdb');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!podDisruptionBudgetName.trim()) {
      setPodDisruptionBudgetNameError('Pod disruption budget name is required.');
      setSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
      return;
    }

    console.log('Creating pod disruption budget:', {
      podDisruptionBudgetName,
      namespace,
      description,
      minAvailablePods,
      minAvailableUnit,
      maxUnavailablePods,
      maxUnavailableUnit,
      selectorRules,
      labels,
      annotations,
    });
    navigate('/container/pdb');
  }, [
    podDisruptionBudgetName,
    namespace,
    description,
    minAvailablePods,
    minAvailableUnit,
    maxUnavailablePods,
    maxUnavailableUnit,
    selectorRules,
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
  const isCreateDisabled = !podDisruptionBudgetName.trim();

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
                { label: 'Pod Disruption Budgets', href: '/container/pdb' },
                { label: 'Create Pod Disruption Budget' },
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
                  Create Pod Disruption Budget
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
                      podDisruptionBudgetName={podDisruptionBudgetName}
                      onPodDisruptionBudgetNameChange={setPodDisruptionBudgetName}
                      podDisruptionBudgetNameError={podDisruptionBudgetNameError}
                      onPodDisruptionBudgetNameErrorChange={setPodDisruptionBudgetNameError}
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
                        label="Namespace"
                        value={namespace || '-'}
                        showDivider={false}
                      />
                      <SectionCard.DataRow label="Name" value={podDisruptionBudgetName} />
                      <SectionCard.DataRow label="Description" value={description || '-'} />
                    </DoneSection>
                  )}

                  {/* Data Section */}
                  {sectionStatus['data'] === 'pre' && <PreSection title={SECTION_LABELS['data']} />}
                  {sectionStatus['data'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['data']} />
                  )}
                  {sectionStatus['data'] === 'active' && (
                    <BudgetSection
                      minAvailablePods={minAvailablePods}
                      onMinAvailablePodsChange={setMinAvailablePods}
                      minAvailableUnit={minAvailableUnit}
                      onMinAvailableUnitChange={setMinAvailableUnit}
                      maxUnavailablePods={maxUnavailablePods}
                      onMaxUnavailablePodsChange={setMaxUnavailablePods}
                      maxUnavailableUnit={maxUnavailableUnit}
                      onMaxUnavailableUnitChange={setMaxUnavailableUnit}
                      onNext={() => handleNext('data')}
                      isEditing={editingSection === 'data'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['data'] === 'done' && (
                    <DoneSection title={SECTION_LABELS['data']} onEdit={() => handleEdit('data')}>
                      <SectionCard.DataRow
                        label="Min. available Pods"
                        value={`${minAvailablePods} ${minAvailableUnit === 'percent' ? '%' : 'Pods'}`}
                      />
                      <SectionCard.DataRow
                        label="Max. unavailable Pods"
                        value={`${maxUnavailablePods} ${maxUnavailableUnit === 'percent' ? '%' : 'Pods'}`}
                        showDivider={false}
                      />
                    </DoneSection>
                  )}

                  {/* Selector Section */}
                  {sectionStatus['selector'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['selector']} />
                  )}
                  {sectionStatus['selector'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['selector']} />
                  )}
                  {sectionStatus['selector'] === 'active' && (
                    <SelectorSection
                      selectorRules={selectorRules}
                      onSelectorRulesChange={setSelectorRules}
                      onNext={() => handleNext('selector')}
                      isEditing={editingSection === 'selector'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['selector'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['selector']}
                      onEdit={() => handleEdit('selector')}
                    >
                      <SectionCard.DataRow
                        label="Selector Rules"
                        value={
                          selectorRules.length > 0
                            ? `${selectorRules.length} rule(s) configured`
                            : 'No rules configured'
                        }
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

export default CreatePodDisruptionBudgetPage;
