import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { NumberInput } from '@shared/components/Input';
import { Disclosure } from '@shared/components/Disclosure';
import { Range } from '@shared/components/Range';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

const isV2 = true;

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

type SectionStep = 'basic-info' | 'data' | 'labels-annotations';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  data: 'Container Resource Limit',
  'labels-annotations': 'Labels & Annotations',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'labels-annotations'];

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

function snapToStep(value: number, min: number, max: number, step: number): number {
  const s = Math.round((value - min) / step) * step + min;
  return Math.min(max, Math.max(min, s));
}

interface BasicInfoSectionProps {
  limitRangeName: string;
  onLimitRangeNameChange: (value: string) => void;
  limitRangeNameError: string | null;
  onLimitRangeNameErrorChange: (error: string | null) => void;
  namespace: string;
  onNamespaceChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

function BasicInfoSection({
  limitRangeName,
  onLimitRangeNameChange,
  limitRangeNameError,
  onLimitRangeNameErrorChange,
  namespace,
  onNamespaceChange,
  description,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  const [descriptionOpen, setDescriptionOpen] = useState(isV2);
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

          <FormField label="Name" required error={limitRangeNameError ?? undefined}>
            <Input
              placeholder="Enter a unique name"
              value={limitRangeName}
              error={!!limitRangeNameError}
              onChange={(_e, v) => {
                onLimitRangeNameChange(v);
                if (limitRangeNameError) onLimitRangeNameErrorChange(null);
              }}
            />
          </FormField>

          <Disclosure
            label="Description"
            expanded={descriptionOpen}
            onExpandChange={setDescriptionOpen}
          >
            <div className="pt-2">
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

interface ContainerResourceLimit {
  cpuReservation: string;
  cpuLimit: string;
  memoryReservation: string;
  memoryLimit: string;
}

interface ContainerResourceLimitSectionProps {
  resourceLimit: ContainerResourceLimit;
  onResourceLimitChange: (limit: ContainerResourceLimit) => void;
}

function ContainerResourceLimitSection({
  resourceLimit,
  onResourceLimitChange,
}: ContainerResourceLimitSectionProps) {
  const updateField = (field: keyof ContainerResourceLimit, value: string) => {
    onResourceLimitChange({ ...resourceLimit, [field]: value });
  };

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Container resource limit" />
      <SectionCard.Content showDividers={false}>
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6">
          <FormField
            label="CPU Reservation"
            description="Specify the minimum CPU amount reserved for the container."
            hint="10-1000 mCPUs"
          >
            <div className="flex items-center gap-3">
              <Range
                className="min-w-0 flex-1"
                min={10}
                max={1000}
                value={snapToStep(parseInt(resourceLimit.cpuReservation, 10) || 0, 10, 1000, 10)}
                onChange={(val) =>
                  updateField('cpuReservation', String(snapToStep(val, 10, 1000, 10)))
                }
              />
              <NumberInput
                value={parseInt(resourceLimit.cpuReservation, 10) || 0}
                onChange={(val) => updateField('cpuReservation', String(val))}
                min={10}
                max={1000}
                step={1}
                suffix="mCPUs"
              />
            </div>
          </FormField>

          <FormField
            label="CPU Limit"
            description="Specify the maximum CPU amount the container is allowed to use."
            hint="10-1000 mCPUs"
          >
            <div className="flex items-center gap-3">
              <Range
                className="min-w-0 flex-1"
                min={10}
                max={1000}
                value={snapToStep(parseInt(resourceLimit.cpuLimit, 10) || 0, 10, 1000, 10)}
                onChange={(val) => updateField('cpuLimit', String(snapToStep(val, 10, 1000, 10)))}
              />
              <NumberInput
                value={parseInt(resourceLimit.cpuLimit, 10) || 0}
                onChange={(val) => updateField('cpuLimit', String(val))}
                min={10}
                max={1000}
                step={1}
                suffix="mCPUs"
              />
            </div>
          </FormField>

          <FormField
            label="Memory Reservation"
            description="Specify the minimum memory capacity reserved for the container."
            hint="4-128 GiB"
          >
            <div className="flex items-center gap-3">
              <Range
                className="min-w-0 flex-1"
                min={4}
                max={128}
                value={snapToStep(parseInt(resourceLimit.memoryReservation, 10) || 0, 4, 128, 4)}
                onChange={(val) =>
                  updateField('memoryReservation', String(snapToStep(val, 4, 128, 4)))
                }
              />
              <NumberInput
                value={parseInt(resourceLimit.memoryReservation, 10) || 0}
                onChange={(val) => updateField('memoryReservation', String(val))}
                min={4}
                max={128}
                step={1}
                suffix="GiB"
              />
            </div>
          </FormField>

          <FormField
            label="Memory Limit"
            description="Specify the maximum memory capacity the container is allowed to use."
            hint="4-128 GiB"
          >
            <div className="flex items-center gap-3">
              <Range
                className="min-w-0 flex-1"
                min={4}
                max={128}
                value={snapToStep(parseInt(resourceLimit.memoryLimit, 10) || 0, 4, 128, 4)}
                onChange={(val) => updateField('memoryLimit', String(snapToStep(val, 4, 128, 4)))}
              />
              <NumberInput
                value={parseInt(resourceLimit.memoryLimit, 10) || 0}
                onChange={(val) => updateField('memoryLimit', String(val))}
                min={4}
                max={128}
                step={1}
                suffix="GiB"
              />
            </div>
          </FormField>
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
                    variant="muted"
                    appearance="outline"
                    size="sm"
                    onClick={onAddLabel}
                    className="bg-[var(--color-surface-default)]"
                  >
                    <span className="inline-flex items-center gap-1">
                      <IconCirclePlus size={12} />
                      Add Label
                    </span>
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
                      className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="muted"
                    appearance="outline"
                    size="sm"
                    onClick={onAddAnnotation}
                    className="bg-[var(--color-surface-default)]"
                  >
                    <span className="inline-flex items-center gap-1">
                      <IconCirclePlus size={12} />
                      Add Annotation
                    </span>
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

export function ContainerCreateLimitRangePage() {
  const navigate = useNavigate();

  const [limitRangeName, setLimitRangeName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  const [resourceLimit, setResourceLimit] = useState<ContainerResourceLimit>({
    cpuReservation: '1000',
    cpuLimit: '1000',
    memoryReservation: '128',
    memoryLimit: '128',
  });

  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    data: isV2 ? 'active' : 'pre',
    'labels-annotations': isV2 ? 'active' : 'pre',
  });

  const [limitRangeNameError, setLimitRangeNameError] = useState<string | null>(null);

  useEffect(() => {
    const hasBasicInfo = limitRangeName.trim() && namespace;
    const hasResourceLimit =
      resourceLimit.cpuReservation ||
      resourceLimit.cpuLimit ||
      resourceLimit.memoryReservation ||
      resourceLimit.memoryLimit;
    const hasLabelsOrAnnotations = labels.length > 0 || annotations.length > 0;

    setSectionStatus({
      'basic-info': hasBasicInfo ? 'done' : 'active',
      data: hasResourceLimit ? 'done' : hasBasicInfo ? 'active' : 'pre',
      'labels-annotations': hasLabelsOrAnnotations ? 'done' : hasResourceLimit ? 'active' : 'pre',
    });
  }, [limitRangeName, namespace, resourceLimit, labels, annotations]);

  const handleCancel = useCallback(() => {
    navigate('/container/limit-ranges');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!limitRangeName.trim()) {
      setLimitRangeNameError('Limit range name is required.');
      setSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
      return;
    }

    console.log('Creating limit range:', {
      limitRangeName,
      namespace,
      description,
      resourceLimit,
      labels,
      annotations,
    });
    navigate('/container/limit-ranges');
  }, [limitRangeName, namespace, description, resourceLimit, labels, annotations, navigate]);

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

  const isCreateDisabled = !limitRangeName.trim();

  const states = sectionStatus;

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create limit range</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            LimitRanges define default resource requests and limits for Pods and containers within a
            Namespace, helping enforce fair resource usage and prevent workloads from consuming
            excessive CPU or memory.
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
        <div className="flex min-w-0 flex-col gap-4">
          <BasicInfoSection
            limitRangeName={limitRangeName}
            onLimitRangeNameChange={setLimitRangeName}
            limitRangeNameError={limitRangeNameError}
            onLimitRangeNameErrorChange={setLimitRangeNameError}
            namespace={namespace}
            onNamespaceChange={setNamespace}
            description={description}
            onDescriptionChange={setDescription}
          />
          <ContainerResourceLimitSection
            resourceLimit={resourceLimit}
            onResourceLimitChange={setResourceLimit}
          />
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

export default ContainerCreateLimitRangePage;
