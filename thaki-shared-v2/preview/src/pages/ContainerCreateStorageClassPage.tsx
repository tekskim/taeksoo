import { useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { RadioButton } from '@shared/components/RadioButton';
import { IconCheck, IconCirclePlus, IconX } from '@tabler/icons-react';

type SectionStep = 'basic-info' | 'storage-config' | 'customize';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  'storage-config': 'Parameters',
  customize: 'Customize',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'storage-config', 'customize'];

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

function SummaryStatusIcon({ status }: { status: 'done' | 'active' | 'pending' }) {
  if (status === 'done') {
    return (
      <div className="size-4 shrink-0 flex items-center justify-center rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)]">
        <IconCheck size={10} stroke={2} className="text-white" />
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div
        className="size-4 shrink-0 animate-spin rounded-full border border-[var(--color-text-muted)]"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }
  return (
    <div
      className="size-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
      style={{ borderStyle: 'dashed' }}
    />
  );
}

interface SummarySidebarProps {
  storageClassName: string;
  parameters: Parameter[];
  hasCustomizeData: boolean;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  storageClassName,
  parameters,
  hasCustomizeData,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  const getSectionStatus = (section: SectionStep): 'done' | 'active' | 'pending' => {
    if (section === 'basic-info') {
      return storageClassName.trim() ? 'done' : 'active';
    }
    if (section === 'storage-config') {
      return parameters.length > 0 && parameters.some((p) => p.key.trim() || p.value.trim())
        ? 'done'
        : 'pending';
    }
    if (section === 'customize') {
      return hasCustomizeData ? 'done' : 'pending';
    }
    return 'pending';
  };

  return (
    <div className="sticky top-4 w-[280px] shrink-0 self-start">
      <div className="flex flex-col gap-6 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
        <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4">
          <div className="flex flex-col gap-4">
            <span className="text-heading-h5">Summary</span>
            <div className="flex flex-col gap-0">
              {SECTION_ORDER.map((step) => (
                <div key={step} className="flex items-center justify-between py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {SECTION_LABELS[step]}
                  </span>
                  <SummaryStatusIcon status={getSectionStatus(step)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" appearance="solid" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            appearance="solid"
            onClick={onCreate}
            disabled={isCreateDisabled}
            className="flex-1"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] pb-4">
      <div className="px-4 pt-4">
        <h3 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h3>
      </div>
      <div className="mx-4 my-4 h-px bg-[var(--color-border-subtle)]" />
      <div className="flex flex-col gap-6 px-4">{children}</div>
    </div>
  );
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
    <SectionShell title="Basic information">
      <FormField label="Name" required error={storageClassNameError ?? undefined}>
        <Input
          placeholder="Enter a unique name"
          value={storageClassName}
          onChange={(e) => {
            onStorageClassNameChange(e.target.value);
            if (storageClassNameError) onStorageClassNameErrorChange(null);
          }}
          error={Boolean(storageClassNameError)}
          className="w-full"
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
            className="w-full"
          />
        </div>
      </details>
    </SectionShell>
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
    <SectionShell title="Parameters">
      <div className="flex flex-col gap-2">
        <span className="text-label-lg text-[var(--color-text-default)]">Parameter</span>

        <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            {parameters.length > 0 && (
              <div className="grid w-full grid-cols-[1fr_1fr_20px] gap-1">
                <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
                <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
                <div className="w-5" />
              </div>
            )}

            {parameters.map((param, index) => (
              <div key={index} className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1">
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
    </SectionShell>
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
    <SectionShell title="Customize">
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
        <span className="text-label-lg text-[var(--color-text-default)]">Volume Binding Mode</span>
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
                <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
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
    </SectionShell>
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

  return (
    <div className="flex flex-col gap-6 px-8 pb-20 pt-4">
      <div className="flex flex-col gap-2">
        <Title title="Create storage class" size="medium" />
        <p className="text-body-md text-[var(--color-text-subtle)]">
          Storage Class provides a way to describe different classes of storage, allowing
          administrators to define storage profiles with specific provisioner, parameters, and
          reclaim policies for dynamic volume provisioning.
        </p>
      </div>

      <div className="flex w-full items-start gap-6">
        <div className="flex flex-1 flex-col gap-4">
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

        <SummarySidebar
          storageClassName={storageClassName}
          parameters={parameters}
          hasCustomizeData={hasCustomizeData}
          onCancel={handleCancel}
          onCreate={handleCreate}
          isCreateDisabled={isCreateDisabled}
        />
      </div>
    </div>
  );
}

export default ContainerCreateStorageClassPage;
