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
  IconPlus,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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
              <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                {podDisruptionBudgetNameError}
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
        <VStack gap={3}>
          {/* Budget Fields */}
          <Disclosure title="Budget" defaultOpen>
            <div className="flex gap-3 pl-3">
              {/* Min. available Pods */}
              <VStack gap={2} className="flex-1">
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
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
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
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
      <SectionCard.Header title="Selector" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Description */}
          <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
            Selector keys and values are intended to match labels and values on existing pods.
          </span>

          {/* Column Headers */}
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                Key
              </span>
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                Operator
              </span>
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
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
            <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
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
              <span className="w-6 h-6 flex items-center justify-center bg-[var(--color-action-primary)] text-white rounded-md text-[11px] font-medium">
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
              <span className="text-[11px] text-[var(--color-text-subtle)]">
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

  // Compute section statuses for summary
  const basicInfoComplete = podDisruptionBudgetName.trim().length > 0;
  const budgetComplete = true; // Optional section, always considered complete
  const selectorComplete = true; // Optional section, always considered complete
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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create Pod Disruption Budget
                </h1>
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
                              label="Budget"
                              status={budgetComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Selector"
                              status={selectorComplete ? 'complete' : 'in-progress'}
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
                          Create Pod Disruption Budget
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

export default CreatePodDisruptionBudgetPage;
