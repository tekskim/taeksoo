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
  SectionCard,
  Table,
  NumberInput,
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

type SectionStep = 'basic-info' | 'data' | 'selector' | 'labels-annotations';

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
  podDisruptionBudgetName: string;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  podDisruptionBudgetName,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  // Determine section status based on form data
  const getSectionStatus = (section: SectionStep): 'done' | 'active' | 'pending' => {
    switch (section) {
      case 'basic-info':
        return podDisruptionBudgetName.trim() ? 'done' : 'active';
      case 'data':
        return 'pending';
      case 'selector':
        return 'pending';
      case 'labels-annotations':
        return 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Inner subtle-bg container */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={4}>
            <span className="text-heading-h5">Summary</span>
            <VStack gap={0}>
              {SECTION_ORDER.map((step) => {
                const status = getSectionStatus(step);
                return (
                  <HStack key={step} justify="between" className="py-1">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {SECTION_LABELS[step]}
                    </span>
                    <SummaryStatusIcon status={status} />
                  </HStack>
                );
              })}
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
  podDisruptionBudgetName: string;
  onPodDisruptionBudgetNameChange: (value: string) => void;
  podDisruptionBudgetNameError: string | null;
  onPodDisruptionBudgetNameErrorChange: (error: string | null) => void;
  namespace: string;
  onNamespaceChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
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
}: BasicInfoSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Basic Information" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
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
          <Disclosure defaultOpen>
            <Disclosure.Trigger>Description</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="flex flex-col gap-2 pl-0 pt-3">
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
const BUDGET_UNIT_OPTIONS = [{ value: 'pods', label: 'Pods' }];

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
}: BudgetSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Budget" showDivider />
      <SectionCard.Content>
        <div className="flex gap-3">
          {/* Min. available Pods */}
          <VStack gap={2} className="flex-1">
            <span className="text-label-lg text-[var(--color-text-default)]">
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
            <span className="text-label-lg text-[var(--color-text-default)] leading-[20px]">
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
}

function SelectorSection({ selectorRules, onSelectorRulesChange }: SelectorSectionProps) {
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
    <SectionCard>
      <SectionCard.Header
        title="Selector"
        description="Selector keys and values are intended to match labels and values on existing pods."
        showDivider
      />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Selector Rules Container */}
          <div className="bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] p-3 border border-[var(--color-border-default)]">
            <VStack gap={3}>
              {/* Column Headers and Selector Rules - only show when there are rules */}
              {selectorRules.length > 0 && (
                <VStack gap={2} className="w-full">
                  {/* Column Headers */}
                  <div className="flex gap-2 w-full">
                    <div className="flex-1">
                      <span className="text-label-lg text-[var(--color-text-default)]">Key</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-label-lg text-[var(--color-text-default)]">
                        Operator
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-label-lg text-[var(--color-text-default)]">Value</span>
                    </div>
                    <div className="w-[23px]" />
                  </div>

                  {/* Selector Rules */}
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
                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-hover)] rounded transition-colors w-[23px]"
                      >
                        <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </div>
                  ))}
                </VStack>
              )}

              {/* Add Rule Button */}
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                onClick={addRule}
                className="bg-white w-fit"
              >
                Add Rule
              </Button>
            </VStack>
          </div>

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
                    <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                      Key
                    </label>
                    <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                      Value
                    </label>
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
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddLabel}
                    className="bg-white"
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
              <VStack gap={2}>
                {annotations.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                    <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                      Key
                    </label>
                    <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                      Value
                    </label>
                    <div />
                  </div>
                )}
                {annotations.map((annotation, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
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

  const handleCancel = useCallback(() => {
    navigate('/container/pdb');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!podDisruptionBudgetName.trim()) {
      setPodDisruptionBudgetNameError('Pod disruption budget name is required.');
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
            <VStack gap={6}>
              {/* Page Header */}
              <div className="flex flex-col gap-[9px]">
                <div className="flex items-center justify-between h-8">
                  <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                    Create Pod Disruption Budget
                  </h1>
                </div>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  Pod Disruption Budget defines the minimum number of pods that must remain
                  available during voluntary disruptions to ensure application stability.
                </p>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <BasicInfoSection
                    podDisruptionBudgetName={podDisruptionBudgetName}
                    onPodDisruptionBudgetNameChange={setPodDisruptionBudgetName}
                    podDisruptionBudgetNameError={podDisruptionBudgetNameError}
                    onPodDisruptionBudgetNameErrorChange={setPodDisruptionBudgetNameError}
                    namespace={namespace}
                    onNamespaceChange={setNamespace}
                    description={description}
                    onDescriptionChange={setDescription}
                  />

                  {/* Budget Section */}
                  <BudgetSection
                    minAvailablePods={minAvailablePods}
                    onMinAvailablePodsChange={setMinAvailablePods}
                    minAvailableUnit={minAvailableUnit}
                    onMinAvailableUnitChange={setMinAvailableUnit}
                    maxUnavailablePods={maxUnavailablePods}
                    onMaxUnavailablePodsChange={setMaxUnavailablePods}
                    maxUnavailableUnit={maxUnavailableUnit}
                    onMaxUnavailableUnitChange={setMaxUnavailableUnit}
                  />

                  {/* Selector Section */}
                  <SelectorSection
                    selectorRules={selectorRules}
                    onSelectorRulesChange={setSelectorRules}
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
                  podDisruptionBudgetName={podDisruptionBudgetName}
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
