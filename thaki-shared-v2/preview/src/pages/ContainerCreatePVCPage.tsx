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
import { RadioButton } from '@shared/components/RadioButton';
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

type SectionStep = 'basic-info' | 'volume-claim' | 'storage-config' | 'labels-annotations';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  'volume-claim': 'Volume claim',
  'storage-config': 'Customize',
  'labels-annotations': 'Labels & annotations',
};

const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'volume-claim',
  'storage-config',
  'labels-annotations',
];

const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'production', label: 'production' },
];

const STORAGE_CLASS_OPTIONS = [
  { value: 'default', label: 'Default storage class' },
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'slow', label: 'slow' },
];

const STORAGE_UNIT_OPTIONS = [
  { value: 'GiB', label: 'GiB' },
  { value: 'MiB', label: 'MiB' },
  { value: 'TiB', label: 'TiB' },
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
  namespace: string;
  onNamespaceChange: (value: string) => void;
  pvcName: string;
  onNamespaceNameChange: (value: string) => void;
  pvcNameError: string | null;
  onNamespaceNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

function BasicInfoSection({
  namespace,
  onNamespaceChange,
  pvcName,
  onNamespaceNameChange,
  pvcNameError,
  onNamespaceNameErrorChange,
  description,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Basic information" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <FormField label="Namespace" required>
            <Dropdown.Select value={namespace} onChange={(v) => onNamespaceChange(String(v))}>
              {NAMESPACE_OPTIONS.map((o) => (
                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField label="Name" required error={pvcNameError ?? undefined}>
            <Input
              placeholder="Enter a unique name"
              value={pvcName}
              onChange={(e) => {
                onNamespaceNameChange(e.target.value);
                if (pvcNameError) onNamespaceNameErrorChange(null);
              }}
              error={Boolean(pvcNameError)}
              className="w-full"
            />
          </FormField>

          <details open className="group">
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

type VolumeSourceType = 'storage-class' | 'existing-pv';

interface VolumeClaimSectionProps {
  sourceType: VolumeSourceType;
  onSourceTypeChange: (value: VolumeSourceType) => void;
  storageClass: string;
  onStorageClassChange: (value: string) => void;
  requestStorage: string;
  onRequestStorageChange: (value: string) => void;
  storageUnit: string;
  onStorageUnitChange: (value: string) => void;
}

function VolumeClaimSection({
  sourceType,
  onSourceTypeChange,
  storageClass,
  onStorageClassChange,
  requestStorage,
  onRequestStorageChange,
  storageUnit,
  onStorageUnitChange,
}: VolumeClaimSectionProps) {
  const requestNum = Number(requestStorage) || 1;

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Volume claim" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <FormField label="Source">
            <div className="flex flex-col gap-2">
              <RadioButton
                name="pvc-volume-source"
                value="storage-class"
                checked={sourceType === 'storage-class'}
                onChange={() => onSourceTypeChange('storage-class')}
                label="Use a Storage Class to provision a new Persistent Volume"
              />
              <RadioButton
                name="pvc-volume-source"
                value="existing-pv"
                checked={sourceType === 'existing-pv'}
                onChange={() => onSourceTypeChange('existing-pv')}
                label="Use an existing Persistent Volume"
              />
            </div>
          </FormField>

          {sourceType === 'storage-class' && (
            <FormField label="Storage Class">
              <Dropdown.Select
                value={storageClass}
                onChange={(v) => onStorageClassChange(String(v))}
              >
                {STORAGE_CLASS_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>
          )}

          <FormField label="Request Storage" required>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="range"
                min={1}
                max={1000}
                step={10}
                value={requestNum}
                onChange={(e) => onRequestStorageChange(String(Number(e.target.value)))}
                className="h-1.5 w-full max-w-[220px] cursor-pointer rounded-full bg-[var(--color-surface-muted)] accent-[var(--color-action-primary)]"
                aria-label="Request storage"
              />
              <div className="flex items-center gap-1">
                <NumberInput
                  value={requestNum}
                  onChange={(v) => onRequestStorageChange(String(v))}
                  min={1}
                  max={1000}
                  step={1}
                />
                <Dropdown.Select
                  value={storageUnit}
                  onChange={(v) => onStorageUnitChange(String(v))}
                  className="w-[88px]"
                >
                  {STORAGE_UNIT_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </div>
            </div>
          </FormField>
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
}

function StorageConfigSection({ accessModes, onAccessModesChange }: StorageConfigSectionProps) {
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
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </div>

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
                      className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={14} className="text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} />}
                    onClick={onAddLabel}
                  >
                    Add Label
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </div>

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
                      className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={14} className="text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} />}
                    onClick={onAddAnnotation}
                  >
                    Add Annotation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

export function ContainerCreatePVCPage() {
  const navigate = useNavigate();
  const isV2 = true;

  const [namespace, setNamespace] = useState('default');
  const [pvcName, setNamespaceName] = useState('');
  const [description, setDescription] = useState('');

  const [sourceType, setSourceType] = useState<VolumeSourceType>('storage-class');
  const [storageClass, setStorageClass] = useState('default');
  const [requestStorage, setRequestStorage] = useState('10');
  const [storageUnit, setStorageUnit] = useState('GiB');

  const [accessModes, setAccessModes] = useState({
    singleNodeReadWrite: true,
    manyNodesReadOnly: false,
    manyNodesReadWrite: false,
  });

  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  const [pvcNameError, setNamespaceNameError] = useState<string | null>(null);

  const getSectionStates = useCallback((): Record<SectionStep, WizardSectionState> => {
    return {
      'basic-info': pvcName.trim() ? 'done' : 'active',
      'volume-claim': requestStorage.trim() ? 'done' : 'pre',
      'storage-config': 'done',
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pre',
    };
  }, [pvcName, requestStorage, labels.length, annotations.length]);

  const handleCancel = useCallback(() => {
    navigate('/container/pvc');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!pvcName.trim()) {
      setNamespaceNameError('Namespace name is required.');
      return;
    }

    console.log('Creating persistent volume claim:', {
      pvcName,
      description,
      volumeClaim: {
        sourceType,
        storageClass,
        requestStorage: `${requestStorage}${storageUnit}`,
      },
      storageConfig: {
        accessModes,
      },
      labels,
      annotations,
    });
    navigate('/container/pvc');
  }, [
    pvcName,
    description,
    sourceType,
    storageClass,
    requestStorage,
    storageUnit,
    accessModes,
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

  const isCreateDisabled = !pvcName.trim();
  const states = getSectionStates();

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create persistent volume claim</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Persistent Volume Claim is a user request for persistent storage that defines the
            required capacity and access properties, allowing Kubernetes to bind or dynamically
            provision a suitable PersistentVolume.
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
            namespace={namespace}
            onNamespaceChange={setNamespace}
            pvcName={pvcName}
            onNamespaceNameChange={setNamespaceName}
            pvcNameError={pvcNameError}
            onNamespaceNameErrorChange={setNamespaceNameError}
            description={description}
            onDescriptionChange={setDescription}
          />
          <VolumeClaimSection
            sourceType={sourceType}
            onSourceTypeChange={setSourceType}
            storageClass={storageClass}
            onStorageClassChange={setStorageClass}
            requestStorage={requestStorage}
            onRequestStorageChange={setRequestStorage}
            storageUnit={storageUnit}
            onStorageUnitChange={setStorageUnit}
          />
          <StorageConfigSection accessModes={accessModes} onAccessModesChange={setAccessModes} />
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

export default ContainerCreatePVCPage;
