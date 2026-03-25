import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { RadioButton } from '@shared/components/RadioButton';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

type SectionStep = 'basic-info' | 'storage-config' | 'customize';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  'storage-config': 'Parameters',
  customize: 'Customize',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'storage-config', 'customize'];

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

type ReclaimPolicy = 'delete' | 'retain';
type VolumeExpansion = 'enabled' | 'disabled';
type VolumeBindingMode = 'immediate' | 'waitForFirstConsumer';

interface MountOption {
  value: string;
}

interface Parameter {
  key: string;
  value: string;
}

interface BasicInfoSectionProps {
  storageClassName: string;
  onStorageClassNameChange: (value: string) => void;
  storageClassNameError: string | null;
  onStorageClassNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  isV2: boolean;
}

function BasicInfoSection({
  storageClassName,
  onStorageClassNameChange,
  storageClassNameError,
  onStorageClassNameErrorChange,
  description,
  onDescriptionChange,
  isV2,
}: BasicInfoSectionProps) {
  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Basic information" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <FormField label="Name" required error={storageClassNameError ?? undefined}>
            <Input
              placeholder="Enter a unique name"
              value={storageClassName}
              onChange={(e) => {
                onStorageClassNameChange(e.target.value);
                if (storageClassNameError) onStorageClassNameErrorChange(null);
              }}
              error={Boolean(storageClassNameError)}
              fullWidth
            />
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
                fullWidth
              />
            </div>
          </details>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

interface ParametersSectionProps {
  parameters: Parameter[];
  onParametersChange: (params: Parameter[]) => void;
}

function ParametersSection({ parameters, onParametersChange }: ParametersSectionProps) {
  const addParameter = () => {
    onParametersChange([...parameters, { key: '', value: '' }]);
  };

  const removeParameter = (index: number) => {
    onParametersChange(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...parameters];
    newParams[index][field] = value;
    onParametersChange(newParams);
  };

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Parameters" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-2">
          <span className="text-label-lg text-[var(--color-text-default)]">Parameter</span>

          <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
            <div className="flex flex-col gap-1.5">
              {parameters.length > 0 && (
                <div className="grid w-full grid-cols-[1fr_1fr_20px] gap-1">
                  <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
                  <span className="block text-label-sm text-[var(--color-text-default)]">
                    Value
                  </span>
                  <div className="w-5" />
                </div>
              )}

              {parameters.map((param, index) => (
                <div
                  key={index}
                  className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1"
                >
                  <Input
                    placeholder="e.g. foo"
                    value={param.key}
                    onChange={(e) => updateParameter(index, 'key', e.target.value)}
                    className="w-full"
                  />
                  <Input
                    placeholder="e.g. bar"
                    value={param.value}
                    onChange={(e) => updateParameter(index, 'value', e.target.value)}
                    className="w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                    className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                  >
                    <IconX size={14} className="text-[var(--color-text-muted)]" />
                  </button>
                </div>
              ))}

              <div className="w-fit">
                <Button variant="secondary" size="sm" onClick={addParameter}>
                  <span className="inline-flex items-center gap-1">
                    <IconCirclePlus size={12} />
                    Add Parameter
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

interface CustomizeSectionProps {
  reclaimPolicy: ReclaimPolicy;
  onReclaimPolicyChange: (value: ReclaimPolicy) => void;
  volumeExpansion: VolumeExpansion;
  onVolumeExpansionChange: (value: VolumeExpansion) => void;
  volumeBindingMode: VolumeBindingMode;
  onVolumeBindingModeChange: (value: VolumeBindingMode) => void;
  mountOptions: MountOption[];
  onMountOptionsChange: (options: MountOption[]) => void;
}

function CustomizeSection({
  reclaimPolicy,
  onReclaimPolicyChange,
  volumeExpansion,
  onVolumeExpansionChange,
  volumeBindingMode,
  onVolumeBindingModeChange,
  mountOptions,
  onMountOptionsChange,
}: CustomizeSectionProps) {
  const addMountOption = () => {
    onMountOptionsChange([...mountOptions, { value: '' }]);
  };

  const removeMountOption = (index: number) => {
    onMountOptionsChange(mountOptions.filter((_, i) => i !== index));
  };

  const updateMountOption = (index: number, value: string) => {
    const newOptions = [...mountOptions];
    newOptions[index] = { value };
    onMountOptionsChange(newOptions);
  };

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Customize" />
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-label-lg text-[var(--color-text-default)]">Reclaim Policy</span>
            <div className="flex flex-col gap-2">
              <RadioButton
                name="sc-reclaim-policy"
                value="delete"
                checked={reclaimPolicy === 'delete'}
                onChange={() => onReclaimPolicyChange('delete')}
                label="Delete volumes and underlying device when volume claim is deleted"
              />
              <RadioButton
                name="sc-reclaim-policy"
                value="retain"
                checked={reclaimPolicy === 'retain'}
                onChange={() => onReclaimPolicyChange('retain')}
                label="Retain the volume for manual cleanup"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-label-lg text-[var(--color-text-default)]">
              Allow Volume Expansion
            </span>
            <div className="flex flex-col gap-2">
              <RadioButton
                name="sc-volume-expansion"
                value="enabled"
                checked={volumeExpansion === 'enabled'}
                onChange={() => onVolumeExpansionChange('enabled')}
                label="Enabled"
              />
              <RadioButton
                name="sc-volume-expansion"
                value="disabled"
                checked={volumeExpansion === 'disabled'}
                onChange={() => onVolumeExpansionChange('disabled')}
                label="Disabled"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-label-lg text-[var(--color-text-default)]">
              Volume Binding Mode
            </span>
            <div className="flex flex-col gap-2">
              <RadioButton
                name="sc-volume-binding"
                value="immediate"
                checked={volumeBindingMode === 'immediate'}
                onChange={() => onVolumeBindingModeChange('immediate')}
                label="Bind and provision a persistent volume once the PersistentVolumeClaim is created"
              />
              <RadioButton
                name="sc-volume-binding"
                value="waitForFirstConsumer"
                checked={volumeBindingMode === 'waitForFirstConsumer'}
                onChange={() => onVolumeBindingModeChange('waitForFirstConsumer')}
                label="Bind and provision a persistent volume once a Pod using the PersistentVolumeClaim is created"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-label-lg text-[var(--color-text-default)]">Mount Options</span>

            <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
              <div className="flex flex-col gap-1.5">
                {mountOptions.length > 0 && (
                  <div className="grid w-full grid-cols-[1fr_20px] gap-1">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value
                    </span>
                    <div className="w-5" />
                  </div>
                )}

                {mountOptions.map((option, index) => (
                  <div key={index} className="grid w-full grid-cols-[1fr_20px] items-center gap-1">
                    <Input
                      placeholder="e.g. bar"
                      value={option.value}
                      onChange={(e) => updateMountOption(index, e.target.value)}
                      className="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeMountOption(index)}
                      className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={14} className="text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button variant="secondary" size="sm" onClick={addMountOption}>
                    <span className="inline-flex items-center gap-1">
                      <IconCirclePlus size={12} />
                      Add Option
                    </span>
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

export function ContainerCreateStorageClassPage() {
  const navigate = useNavigate();
  const isV2 = true;

  const [storageClassName, setStorageClassName] = useState('');
  const [description, setDescription] = useState('');

  const [parameters, setParameters] = useState<Parameter[]>(isV2 ? [{ key: '', value: '' }] : []);

  const [reclaimPolicy, setReclaimPolicy] = useState<ReclaimPolicy>('delete');
  const [volumeExpansion, setVolumeExpansion] = useState<VolumeExpansion>('enabled');
  const [volumeBindingMode, setVolumeBindingMode] = useState<VolumeBindingMode>('immediate');
  const [mountOptions, setMountOptions] = useState<MountOption[]>(isV2 ? [{ value: '' }] : []);

  const [storageClassNameError, setStorageClassNameError] = useState<string | null>(null);

  const handleCancel = useCallback(() => {
    navigate('/container/storage-classes');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!storageClassName.trim()) {
      setStorageClassNameError('Storage Class name is required.');
      return;
    }

    console.log('Creating storage class:', {
      storageClassName,
      description,
      parameters,
      customize: {
        reclaimPolicy,
        volumeExpansion,
        volumeBindingMode,
        mountOptions,
      },
    });
    navigate('/container/storage-classes');
  }, [
    storageClassName,
    description,
    parameters,
    reclaimPolicy,
    volumeExpansion,
    volumeBindingMode,
    mountOptions,
    navigate,
  ]);

  const isCreateDisabled = !storageClassName.trim();

  const hasCustomizeData =
    reclaimPolicy !== 'delete' ||
    volumeExpansion !== 'enabled' ||
    volumeBindingMode !== 'immediate' ||
    mountOptions.length > 0;

  const getSectionStates = (): Record<SectionStep, WizardSectionState> => ({
    'basic-info': storageClassName.trim() ? 'done' : 'active',
    'storage-config':
      parameters.length > 0 && parameters.some((p) => p.key.trim() || p.value.trim())
        ? 'done'
        : 'pre',
    customize: hasCustomizeData ? 'done' : 'pre',
  });

  const states = getSectionStates();

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create storage class</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Storage Class provides a way to describe different classes of storage, allowing
            administrators to define storage profiles with specific provisioner, parameters, and
            reclaim policies for dynamic volume provisioning.
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
            storageClassName={storageClassName}
            onStorageClassNameChange={setStorageClassName}
            storageClassNameError={storageClassNameError}
            onStorageClassNameErrorChange={setStorageClassNameError}
            description={description}
            onDescriptionChange={setDescription}
            isV2={isV2}
          />

          <ParametersSection parameters={parameters} onParametersChange={setParameters} />

          <CustomizeSection
            reclaimPolicy={reclaimPolicy}
            onReclaimPolicyChange={setReclaimPolicy}
            volumeExpansion={volumeExpansion}
            onVolumeExpansionChange={setVolumeExpansion}
            volumeBindingMode={volumeBindingMode}
            onVolumeBindingModeChange={setVolumeBindingMode}
            mountOptions={mountOptions}
            onMountOptionsChange={setMountOptions}
          />
        </div>
      </div>
    </CreateLayout>
  );
}

export default ContainerCreateStorageClassPage;
