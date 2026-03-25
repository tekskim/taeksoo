import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { NumberInput } from '@shared/components/Input';
import { Disclosure } from '@shared/components/Disclosure';
import { Table } from '@shared/components/Table';
import { IconCirclePlus, IconX } from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';

type WizardSectionState = 'pre' | 'active' | 'done' | 'writing' | 'skipped';

const mapStatus = (state: WizardSectionState): FloatingCardStatus => {
  switch (state) {
    case 'done':
      return 'success';
    case 'active':
      return 'processing';
    case 'writing':
      return 'writing';
    default:
      return 'default';
  }
};

const isV2 = true;

type SectionStep = 'basic-info' | 'data' | 'selector' | 'labels-annotations';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  data: 'Budget',
  selector: 'Selector',
  'labels-annotations': 'Labels & Annotations',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'selector', 'labels-annotations'];

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
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Basic information" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <FormField label="Namespace" required>
            <Dropdown.Select
              value={namespace}
              onChange={(v) => onNamespaceChange(String(v))}
              className="w-full"
              placeholder="Select namespace"
            >
              {NAMESPACE_OPTIONS.map((opt) => (
                <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField label="Name" required error={podDisruptionBudgetNameError ?? undefined}>
            <Input
              placeholder="Enter a unique name"
              value={podDisruptionBudgetName}
              error={!!podDisruptionBudgetNameError}
              onChange={(_e, v) => {
                onPodDisruptionBudgetNameChange(v);
                if (podDisruptionBudgetNameError) onPodDisruptionBudgetNameErrorChange(null);
              }}
            />
          </FormField>

          <Disclosure
            label="Description"
            expanded={descriptionOpen}
            onExpandChange={setDescriptionOpen}
          >
            <div className="flex flex-col gap-2 pt-3 pl-0">
              <Input
                placeholder="Enter a description (optional)"
                value={description}
                onChange={(_e, v) => onDescriptionChange(v)}
              />
            </div>
          </Disclosure>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

interface SelectorRule {
  id: string;
  key: string;
  operator: string;
  value: string;
}

interface MatchingPod extends Record<string, unknown> {
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

const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'deploymentName-77f6bb9c69-4ww7f', createdAt: 'Jul 25, 2025 10:32:16' },
  { id: '2', name: 'deploymentName-77f6bb9c69-8xyz1', createdAt: 'Jul 25, 2025 10:32:16' },
  { id: '3', name: 'deploymentName-77f6bb9c69-2abc3', createdAt: 'Jul 25, 2025 10:32:16' },
];

const BUDGET_UNIT_OPTIONS = [
  { value: 'pods', label: 'Pods' },
  { value: 'percent', label: '%' },
];

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
    <SectionCard className="pb-4">
      <SectionCard.Header title="Budget" />
      <SectionCard.Content showDividers={false}>
        <div className="flex gap-3">
          <FormField label="Min. available Pods" className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <NumberInput
                value={minAvailablePods}
                onChange={onMinAvailablePodsChange}
                min={0}
                max={minAvailableUnit === 'percent' ? 100 : undefined}
              />
              <Dropdown.Select
                value={minAvailableUnit}
                onChange={(v) => onMinAvailableUnitChange(String(v))}
                className="w-24 shrink-0"
              >
                {BUDGET_UNIT_OPTIONS.map((opt) => (
                  <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                ))}
              </Dropdown.Select>
            </div>
          </FormField>

          <FormField label="Max. unavailable Pods" className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <NumberInput
                value={maxUnavailablePods}
                onChange={onMaxUnavailablePodsChange}
                min={0}
                max={maxUnavailableUnit === 'percent' ? 100 : undefined}
              />
              <Dropdown.Select
                value={maxUnavailableUnit}
                onChange={(v) => onMaxUnavailableUnitChange(String(v))}
                className="w-24 shrink-0"
              >
                {BUDGET_UNIT_OPTIONS.map((opt) => (
                  <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                ))}
              </Dropdown.Select>
            </div>
          </FormField>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

const matchingPodsColumns: TableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'createdAt', header: 'Created at', sortable: true },
];

interface SelectorSectionProps {
  selectorRules: SelectorRule[];
  onSelectorRulesChange: (rules: SelectorRule[]) => void;
}

function SelectorSection({ selectorRules, onSelectorRulesChange }: SelectorSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const addRule = () => {
    const newRule: SelectorRule = {
      id: `selector-${Date.now()}`,
      key: '',
      operator: 'in',
      value: '',
    };
    onSelectorRulesChange([...selectorRules, newRule]);
  };

  const removeRule = (id: string) => {
    onSelectorRulesChange(selectorRules.filter((rule) => rule.id !== id));
  };

  const updateRule = (id: string, field: keyof SelectorRule, value: string) => {
    onSelectorRulesChange(
      selectorRules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
  };

  const totalItems = MOCK_MATCHING_PODS.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedPods = MOCK_MATCHING_PODS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header
        title="Selector"
        description="Selector keys and values are intended to match labels and values on existing pods."
      />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-label-lg text-[var(--color-text-default)]">Rule</span>
            <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                {selectorRules.length > 0 && (
                  <div className="grid w-full grid-cols-[1fr_1fr_1fr_20px] gap-1">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Key
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Operator
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value
                    </span>
                    <div />
                  </div>
                )}
                {selectorRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="grid w-full grid-cols-[1fr_1fr_1fr_20px] items-center gap-1"
                  >
                    <Input
                      placeholder="input key"
                      value={rule.key}
                      onChange={(_e, v) => updateRule(rule.id, 'key', v)}
                    />
                    <Dropdown.Select
                      value={rule.operator}
                      onChange={(v) => updateRule(rule.id, 'operator', String(v))}
                      className="w-full"
                    >
                      {OPERATOR_OPTIONS.map((opt) => (
                        <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                      ))}
                    </Dropdown.Select>
                    <Input
                      placeholder="input value"
                      value={rule.value}
                      onChange={(_e, v) => updateRule(rule.id, 'value', v)}
                    />
                    <button
                      type="button"
                      onClick={() => removeRule(rule.id)}
                      className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    appearance="solid"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={addRule}
                  >
                    Add Rule
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <span className="text-label-lg text-[var(--color-text-default)]">Matching Pods</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-6 w-6 items-center justify-center disabled:opacity-30"
              >
                <span className="text-[var(--color-text-default)]">‹</span>
              </button>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-action-primary)] text-label-sm text-white">
                {currentPage}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-6 w-6 items-center justify-center disabled:opacity-30"
              >
                <span className="text-[var(--color-text-default)]">›</span>
              </button>
              <div className="h-4 w-px bg-[var(--color-border-default)]" />
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                {totalItems} items
              </span>
            </div>

            <Table columns={matchingPodsColumns} rows={paginatedPods}>
              {paginatedPods.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={matchingPodsColumns[0]}>
                    <span className="text-label-md text-primary">{row.name}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={matchingPodsColumns[1]}>
                    {row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

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
    <SectionCard className="pb-4">
      <SectionCard.Header title="Labels & Annotations" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <FormField
            label="Labels"
            description="Specify the labels used to identify and categorize the resource."
          >
            <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                {labels.length > 0 && (
                  <div className="grid w-full grid-cols-[1fr_1fr_20px] gap-1">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Key
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value
                    </span>
                    <div className="w-5" />
                  </div>
                )}
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1"
                  >
                    <Input
                      placeholder="Key"
                      value={label.key}
                      onChange={(_e, v) => onUpdateLabel(index, 'key', v)}
                    />
                    <Input
                      placeholder="Value"
                      value={label.value}
                      onChange={(_e, v) => onUpdateLabel(index, 'value', v)}
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveLabel(index)}
                      className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddLabel}
                    className="bg-[var(--color-surface-default)]"
                  >
                    Add Label
                  </Button>
                </div>
              </div>
            </div>
          </FormField>

          <FormField
            label="Annotations"
            description="Specify the annotations used to provide additional metadata for the resource."
          >
            <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                {annotations.length > 0 && (
                  <div className="grid w-full grid-cols-[1fr_1fr_20px] gap-1">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Key
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value
                    </span>
                    <div className="w-5" />
                  </div>
                )}
                {annotations.map((annotation, index) => (
                  <div
                    key={index}
                    className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1"
                  >
                    <Input
                      placeholder="Key"
                      value={annotation.key}
                      onChange={(_e, v) => onUpdateAnnotation(index, 'key', v)}
                    />
                    <Input
                      placeholder="Value"
                      value={annotation.value}
                      onChange={(_e, v) => onUpdateAnnotation(index, 'value', v)}
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveAnnotation(index)}
                      className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    appearance="solid"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddAnnotation}
                  >
                    Add Annotation
                  </Button>
                </div>
              </div>
            </div>
          </FormField>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

export function ContainerCreatePDBPage() {
  const navigate = useNavigate();

  const [podDisruptionBudgetName, setPodDisruptionBudgetName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  const [minAvailablePods, setMinAvailablePods] = useState(0);
  const [minAvailableUnit, setMinAvailableUnit] = useState('pods');
  const [maxUnavailablePods, setMaxUnavailablePods] = useState(0);
  const [maxUnavailableUnit, setMaxUnavailableUnit] = useState('pods');

  const [selectorRules, setSelectorRules] = useState<SelectorRule[]>(
    isV2 ? [{ id: Date.now().toString(), key: '', operator: '', value: '' }] : []
  );

  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  const [podDisruptionBudgetNameError, setPodDisruptionBudgetNameError] = useState<string | null>(
    null
  );

  const handleCancel = useCallback(() => {
    navigate('/container/pdb');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!podDisruptionBudgetName.trim()) {
      setPodDisruptionBudgetNameError('Pod disruption budget name is required.');
      return;
    }

    console.log('Creating pod disruption budget:', {
      podDisruptionBudgetName,
      namespace,
      description,
      minAvailablePods,
      maxUnavailablePods,
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
    maxUnavailablePods,
    selectorRules,
    labels,
    annotations,
    navigate,
  ]);

  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((index: number) => {
    setLabels((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateLabel = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setLabels((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((index: number) => {
    setAnnotations((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateAnnotation = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const isCreateDisabled = !podDisruptionBudgetName.trim();

  const getSectionStates = useCallback((): Record<SectionStep, WizardSectionState> => {
    return {
      'basic-info': podDisruptionBudgetName.trim() ? 'done' : 'active',
      data: 'pre',
      selector: 'pre',
      'labels-annotations': 'pre',
    };
  }, [podDisruptionBudgetName]);

  const states = getSectionStates();

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create pod disruption budget</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Pod Disruption Budget defines the minimum number of pods that must remain available
            during voluntary disruptions to ensure application stability.
          </p>
        </div>
      }
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: SECTION_ORDER.map((key) => ({
                label: SECTION_LABELS[key],
                status: mapStatus(states[key]),
              })),
            },
          ]}
          cancelLabel="Cancel"
          actionLabel="Create"
          actionEnabled={!isCreateDisabled}
          onCancel={handleCancel}
          onAction={handleCreate}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
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
          <SelectorSection selectorRules={selectorRules} onSelectorRulesChange={setSelectorRules} />
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
        </div>
      </div>
    </CreateLayout>
  );
}

export default ContainerCreatePDBPage;
