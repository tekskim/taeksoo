import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Disclosure } from '@shared/components/Disclosure';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

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

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'data' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  data: 'Resource Quotas',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for display
const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'labels-annotations'];

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
  descOpen: boolean;
  onDescOpenChange: (open: boolean) => void;
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
  descOpen,
  onDescOpenChange,
}: BasicInfoSectionProps) {
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
            >
              {NAMESPACE_OPTIONS.map((opt) => (
                <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField
            label="Resource Quota Name"
            required
            error={resourceQuotaNameError ?? undefined}
          >
            <Input
              placeholder="Enter a unique name"
              value={resourceQuotaName}
              error={!!resourceQuotaNameError}
              onChange={(_e, v) => {
                onResourceQuotaNameChange(v);
                if (resourceQuotaNameError) onResourceQuotaNameErrorChange(null);
              }}
              className="w-full"
            />
          </FormField>

          <Disclosure label="Description" expanded={descOpen} onExpandChange={onDescOpenChange}>
            <div className="pt-2">
              <Input
                placeholder="Enter a description (optional)"
                value={description}
                onChange={(_e, v) => onDescriptionChange(v)}
                className="w-full"
              />
            </div>
          </Disclosure>
        </div>
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
      return 'e.g. 1000';
    case 'memory-limit':
    case 'memory-reservation':
      return 'e.g. 128';
    case 'storage-reservation':
      return 'e.g. 512';
    default:
      return 'e.g. 50';
  }
};

// Get range helper text for resource type
const getResourceRangeText = (resourceType: string): string | null => {
  switch (resourceType) {
    case 'cpu-reservation':
      return '10-1000 mCPUs';
    case 'cpu-limit':
      return '10-1000 mCPUs';
    case 'memory-reservation':
      return '4-128 GiB';
    case 'memory-limit':
      return '4-128 GiB';
    case 'storage-reservation':
      return '4-512000 GiB';
    default:
      return null;
  }
};

/* ----------------------------------------
   ResourceQuotasSection Component
   ---------------------------------------- */

interface ResourceQuotasSectionProps {
  quotaItems: ResourceQuotaItem[];
  onQuotaItemsChange: (items: ResourceQuotaItem[]) => void;
}

function ResourceQuotasSection({ quotaItems, onQuotaItemsChange }: ResourceQuotasSectionProps) {
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
      quotaItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Resource quotas" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-2">
          <span className="text-label-lg text-[var(--color-text-default)]">Resource</span>

          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
            <div className="flex w-full flex-col gap-1.5">
              {quotaItems.map((item) => {
                const unit = getResourceUnit(item.resourceType);
                const placeholder = getResourcePlaceholder(item.resourceType);
                const rangeText = getResourceRangeText(item.resourceType);
                return (
                  <div
                    key={item.id}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-start">
                        <div className="flex flex-col gap-0.5">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Resource Type
                          </span>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            Select the resource type to apply the quota.
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Limit
                          </span>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            Specify the maximum usage allowed for the selected resource type.
                          </span>
                        </div>
                        <button
                          onClick={() => removeQuotaItem(item.id)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                        >
                          <IconX size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-start">
                        <Dropdown.Select
                          value={item.resourceType}
                          onChange={(v) => updateQuotaItem(item.id, 'resourceType', String(v))}
                          placeholder="Select resource type"
                          className="w-full"
                        >
                          {RESOURCE_TYPE_OPTIONS.map((opt) => (
                            <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                          ))}
                        </Dropdown.Select>
                        <div className="flex flex-col gap-1">
                          <NumberInput
                            value={item.limit === '' ? undefined : Number(item.limit)}
                            onChange={(val) => updateQuotaItem(item.id, 'limit', String(val))}
                            placeholder={placeholder}
                            suffix={unit ?? undefined}
                            className="max-w-[140px]"
                          />
                          {rangeText && (
                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                              {rangeText}
                            </span>
                          )}
                        </div>
                        <div />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="w-fit">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                  onClick={addQuotaItem}
                >
                  Add Resource
                </Button>
              </div>
            </div>
          </div>
        </div>
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
    <SectionCard className="pb-4">
      <SectionCard.Header title="Labels & Annotations" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <FormField
            label="Labels"
            description="Specify the labels used to identify and categorize the resource."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
              <div className="flex flex-col gap-1.5">
                {labels.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
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
                    className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={label.key}
                      onChange={(_e, v) => onUpdateLabel(index, 'key', v)}
                      className="w-full"
                    />
                    <Input
                      placeholder="Value"
                      value={label.value}
                      onChange={(_e, v) => onUpdateLabel(index, 'value', v)}
                      className="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveLabel(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
              <div className="flex flex-col gap-1.5">
                {annotations.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
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
                    className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={annotation.key}
                      onChange={(_e, v) => onUpdateAnnotation(index, 'key', v)}
                      className="w-full"
                    />
                    <Input
                      placeholder="Value"
                      value={annotation.value}
                      onChange={(_e, v) => onUpdateAnnotation(index, 'value', v)}
                      className="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveAnnotation(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                    onClick={onAddAnnotation}
                    className="bg-[var(--color-surface-default)]"
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

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function ContainerCreateResourceQuotaPage() {
  const navigate = useNavigate();
  const [descOpen, setDescOpen] = useState(isV2);

  // Basic information state
  const [resourceQuotaName, setResourceQuotaName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Resource Quotas state
  const [quotaItems, setQuotaItems] = useState<ResourceQuotaItem[]>(
    RESOURCE_TYPE_OPTIONS.map((opt) => ({
      id: opt.value,
      resourceType: opt.value,
      limit: '',
    }))
  );

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Validation errors
  const [resourceQuotaNameError, setResourceQuotaNameError] = useState<string | null>(null);

  // Calculate section status based on data
  const getSectionStates = useCallback((): Record<SectionStep, WizardSectionState> => {
    const basicInfoDone = resourceQuotaName.trim().length > 0;
    const dataDone =
      quotaItems.length > 0 && quotaItems.some((item) => item.resourceType && item.limit);
    const labelsAnnotationsDone = labels.length > 0 || annotations.length > 0;

    return {
      'basic-info': basicInfoDone ? 'done' : resourceQuotaName.trim().length > 0 ? 'active' : 'pre',
      data: dataDone ? 'done' : quotaItems.length > 0 ? 'active' : 'pre',
      'labels-annotations': labelsAnnotationsDone
        ? 'done'
        : labels.length > 0 || annotations.length > 0
          ? 'active'
          : 'pre',
    };
  }, [resourceQuotaName, quotaItems, labels.length, annotations.length]);

  const states = getSectionStates();

  const handleCancel = useCallback(() => {
    navigate('/container/resource-quotas');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!resourceQuotaName.trim()) {
      setResourceQuotaNameError('Limit range name is required.');
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
  }, [resourceQuotaName, namespace, description, quotaItems, labels, annotations, navigate]);

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
  const isCreateDisabled = !resourceQuotaName.trim();

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create resource quota</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Resource Quotas cap the overall resource usage of a Namespace to maintain fair and
            controlled consumption across the cluster.
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
            resourceQuotaName={resourceQuotaName}
            onResourceQuotaNameChange={setResourceQuotaName}
            resourceQuotaNameError={resourceQuotaNameError}
            onResourceQuotaNameErrorChange={setResourceQuotaNameError}
            namespace={namespace}
            onNamespaceChange={setNamespace}
            description={description}
            onDescriptionChange={setDescription}
            descOpen={descOpen}
            onDescOpenChange={setDescOpen}
          />

          <ResourceQuotasSection quotaItems={quotaItems} onQuotaItemsChange={setQuotaItems} />

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

export default ContainerCreateResourceQuotaPage;
