import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Checkbox } from '@shared/components/Checkbox';
import { IconCheck, IconCirclePlus, IconX } from '@tabler/icons-react';

type SectionStep = 'basic-info' | 'storage-config' | 'labels-annotations';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  'storage-config': 'Customize',
  'labels-annotations': 'Labels & Annotations',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'storage-config', 'labels-annotations'];

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

const STORAGE_CLASS_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'slow', label: 'slow' },
];

const OPERATOR_OPTIONS = [
  { value: 'In', label: 'in list' },
  { value: 'NotIn', label: 'not in list' },
  { value: 'Exists', label: 'exists' },
  { value: 'DoesNotExist', label: 'does not exist' },
  { value: 'Gt', label: 'greater than' },
  { value: 'Lt', label: 'less than' },
];

interface Label {
  key: string;
  value: string;
}

interface Annotation {
  key: string;
  value: string;
}

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

interface BasicInfoSectionProps {
  pvName: string;
  onNamespaceNameChange: (value: string) => void;
  pvNameError: string | null;
  onNamespaceNameErrorChange: (error: string | null) => void;
  capacity: number;
  onCapacityChange: (value: number) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  isV2: boolean;
}

function BasicInfoSection({
  pvName,
  onNamespaceNameChange,
  pvNameError,
  onNamespaceNameErrorChange,
  capacity,
  onCapacityChange,
  description,
  onDescriptionChange,
  isV2,
}: BasicInfoSectionProps) {
  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Basic information" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <FormField label="Name" required error={pvNameError ?? undefined}>
            <Input
              placeholder="Enter a unique name"
              value={pvName}
              onChange={(e) => {
                onNamespaceNameChange(e.target.value);
                if (pvNameError) onNamespaceNameErrorChange(null);
              }}
              error={Boolean(pvNameError)}
              className="w-full"
            />
          </FormField>

          <FormField label="Capacity" required>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <input
                type="range"
                min={1}
                max={1000}
                step={10}
                value={capacity}
                onChange={(e) => onCapacityChange(Number(e.target.value))}
                className="h-1.5 w-full max-w-[220px] flex-1 cursor-pointer rounded-full bg-[var(--color-surface-muted)] accent-[var(--color-action-primary)]"
                aria-label="Capacity"
              />
              <NumberInput
                value={capacity}
                onChange={onCapacityChange}
                min={1}
                max={1000}
                step={1}
                suffix="GiB"
              />
            </div>
          </FormField>

          <details open={isV2} className="group">
            <summary className="cursor-pointer list-none text-label-lg text-[var(--color-text-default)] [&::-webkit-details-marker]:hidden">
              Description
            </summary>
            <div className="pt-2">
              <Input
                placeholder="Enter a description (optional)"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full"
              />
            </div>
          </details>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

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
}: StorageConfigSectionProps) {
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
    <SectionCard className="pb-4">
      <SectionCard.Header title="Customize" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <FormField label="Access Modes">
            <div className="flex flex-col gap-2">
              <Checkbox
                checked={accessModes.singleNodeReadWrite}
                onChange={(checked) =>
                  onAccessModesChange({ ...accessModes, singleNodeReadWrite: checked })
                }
                label="Single node read-write"
              />
              <Checkbox
                checked={accessModes.manyNodesReadOnly}
                onChange={(checked) =>
                  onAccessModesChange({ ...accessModes, manyNodesReadOnly: checked })
                }
                label="Many nodes read-only"
              />
              <Checkbox
                checked={accessModes.manyNodesReadWrite}
                onChange={(checked) =>
                  onAccessModesChange({ ...accessModes, manyNodesReadWrite: checked })
                }
                label="Many nodes read-write"
              />
            </div>
          </FormField>

          <FormField label="Assign to Storage Class">
            <Dropdown.Select
              value={storageClassName}
              onChange={(v) => onStorageClassNameChange(String(v))}
              placeholder="Select storage class"
            >
              {STORAGE_CLASS_OPTIONS.map((o) => (
                <Dropdown.Option
                  key={o.value === '' ? '__none' : o.value}
                  value={o.value}
                  label={o.label}
                />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField label="Mount Options">
            <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                {mountOptions.length > 0 && (
                  <div className="grid w-full grid-cols-[1fr_20px] gap-1">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Option
                    </span>
                    <div className="w-5" />
                  </div>
                )}
                {mountOptions.map((option, index) => (
                  <div key={index} className="grid w-full grid-cols-[1fr_20px] items-center gap-1">
                    <Input
                      placeholder="input key"
                      value={option.key}
                      onChange={(e) => updateMountOption(index, e.target.value)}
                      className="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeMountOption(index)}
                      className="flex h-5 w-5 items-center justify-center text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text-default)]"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="muted"
                    appearance="outline"
                    size="sm"
                    onClick={addMountOption}
                    leftIcon={<IconCirclePlus size={12} />}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            </div>
          </FormField>

          <FormField label="Node Selectors">
            <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
              <div className="flex w-full flex-col gap-1.5">
                {nodeSelectors.map((selector, selectorIndex) => (
                  <div
                    key={selectorIndex}
                    className="w-full rounded-[6px] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 py-3"
                  >
                    <div className="flex flex-col gap-1.5">
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
                        <div className="w-5" />
                      </div>
                      {selector.rules.map((rule, ruleIndex) => (
                        <div
                          key={ruleIndex}
                          className="grid w-full grid-cols-[1fr_1fr_1fr_20px] items-center gap-1"
                        >
                          <Input
                            placeholder="input key"
                            value={rule.key}
                            onChange={(e) =>
                              updateNodeSelectorRule(
                                selectorIndex,
                                ruleIndex,
                                'key',
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                          <Dropdown.Select
                            value={rule.operator}
                            onChange={(v) =>
                              updateNodeSelectorRule(
                                selectorIndex,
                                ruleIndex,
                                'operator',
                                String(v)
                              )
                            }
                          >
                            {OPERATOR_OPTIONS.map((o) => (
                              <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                            ))}
                          </Dropdown.Select>
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
                            className="w-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeNodeSelectorRule(selectorIndex, ruleIndex)}
                            className="flex h-5 w-5 items-center justify-center text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text-default)]"
                          >
                            <IconX size={14} />
                          </button>
                        </div>
                      ))}
                      <div className="w-fit">
                        <Button
                          variant="muted"
                          appearance="outline"
                          size="sm"
                          onClick={() => addNodeSelectorRule(selectorIndex)}
                          leftIcon={<IconCirclePlus size={12} />}
                        >
                          Add Rule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="muted"
                    appearance="outline"
                    size="sm"
                    onClick={addNodeSelector}
                    leftIcon={<IconCirclePlus size={12} />}
                  >
                    Add Node Selector
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
                      onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="Value"
                      value={label.value}
                      onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                      className="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveLabel(index)}
                      className="flex h-5 w-5 items-center justify-center text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text-default)]"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="muted"
                    appearance="outline"
                    size="sm"
                    onClick={onAddLabel}
                    leftIcon={<IconCirclePlus size={12} />}
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
                      onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="Value"
                      value={annotation.value}
                      onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                      className="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveAnnotation(index)}
                      className="flex h-5 w-5 items-center justify-center text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text-default)]"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="muted"
                    appearance="outline"
                    size="sm"
                    onClick={onAddAnnotation}
                    leftIcon={<IconCirclePlus size={12} />}
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

export function ContainerCreatePVPage() {
  const navigate = useNavigate();
  const isV2 = true;

  const [pvName, setNamespaceName] = useState('');
  const [capacity, setCapacity] = useState<number>(1);
  const [description, setDescription] = useState('');

  const [accessModes, setAccessModes] = useState({
    singleNodeReadWrite: true,
    manyNodesReadOnly: false,
    manyNodesReadWrite: false,
  });
  const [storageClassName, setStorageClassName] = useState('');
  const [mountOptions, setMountOptions] = useState<MountOption[]>(isV2 ? [{ key: '' }] : []);
  const [nodeSelectors, setNodeSelectors] = useState<NodeSelector[]>(
    isV2 ? [{ rules: [{ key: '', operator: 'In', value: '' }] }] : []
  );

  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  const [pvNameError, setNamespaceNameError] = useState<string | null>(null);

  const getSectionStatus = useCallback(
    (section: SectionStep): WizardSectionState => {
      if (section === 'basic-info') {
        return pvName.trim() ? 'done' : 'active';
      }
      if (section === 'storage-config') {
        return storageClassName || mountOptions.length > 0 || nodeSelectors.length > 0
          ? 'done'
          : 'pre';
      }
      if (section === 'labels-annotations') {
        return labels.length > 0 || annotations.length > 0 ? 'done' : 'pre';
      }
      return 'pre';
    },
    [
      pvName,
      storageClassName,
      mountOptions.length,
      nodeSelectors.length,
      labels.length,
      annotations.length,
    ]
  );

  const states: Record<SectionStep, WizardSectionState> = {
    'basic-info': getSectionStatus('basic-info'),
    'storage-config': getSectionStatus('storage-config'),
    'labels-annotations': getSectionStatus('labels-annotations'),
  };

  const handleCancel = useCallback(() => {
    navigate('/container/persistent-volumes');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!pvName.trim()) {
      setNamespaceNameError('Namespace name is required.');
      return;
    }

    console.log('Creating persistent volume:', {
      pvName,
      capacity,
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
    capacity,
    description,
    accessModes,
    storageClassName,
    mountOptions,
    nodeSelectors,
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

  const isCreateDisabled = !pvName.trim();

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create persistent volume</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Persistent Volume is a pre-provisioned and cluster-wide storage resource that provides
            reliable and reusable data space for applications or Persistent Volume Claims.
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
            pvName={pvName}
            onNamespaceNameChange={setNamespaceName}
            pvNameError={pvNameError}
            onNamespaceNameErrorChange={setNamespaceNameError}
            capacity={capacity}
            onCapacityChange={setCapacity}
            description={description}
            onDescriptionChange={setDescription}
            isV2={isV2}
          />
          <StorageConfigSection
            accessModes={accessModes}
            onAccessModesChange={setAccessModes}
            storageClassName={storageClassName}
            onStorageClassNameChange={setStorageClassName}
            mountOptions={mountOptions}
            onMountOptionsChange={setMountOptions}
            nodeSelectors={nodeSelectors}
            onNodeSelectorsChange={setNodeSelectors}
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

export default ContainerCreatePVPage;
