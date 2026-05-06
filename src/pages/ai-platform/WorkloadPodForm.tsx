import { useMemo, useState, useEffect, Fragment } from 'react';
import {
  VStack,
  HStack,
  SectionCard,
  FormField,
  Input,
  Select,
  NumberInput,
  SearchInput,
  Pagination,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  Badge,
} from '@/design-system';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

export type GpuVendor = 'all' | 'nvidia' | 'amd' | 'intel';

export interface GpuTypeItem {
  id: string;
  name: string;
  description: string;
  badge: string;
  vendor: 'nvidia' | 'amd' | 'intel';
  profile: 'standard' | 'high-memory' | 'inference';
}

export interface EnvVarRow {
  id: string;
  key: string;
  value: string;
}

export interface WorkloadPodFormValues {
  instanceName: string;
  templateId: string;
  gpuCloudId: string;
  labelQty: number;
  gpuVendorFilter: GpuVendor;
  gpuSearch: string;
  gpuProfileTab: 'standard' | 'high-memory' | 'inference';
  selectedGpuId: string | null;
  containerImage: string;
  dockerCommand: string;
  containerDiskGi: number;
  volumeDiskGi: number;
  volumeMountPath: string;
  exposeHttpPorts: string;
  envVars: EnvVarRow[];
}

const TEMPLATE_OPTIONS = [
  { value: 'blank', label: 'Blank pod' },
  { value: 'jupyter', label: 'JupyterLab' },
  { value: 'pytorch', label: 'PyTorch training' },
];

const GPU_CLOUD_OPTIONS = [
  { value: 'cloud-a', label: 'GPU Cloud — East-1' },
  { value: 'cloud-b', label: 'GPU Cloud — West-2' },
  { value: 'cloud-c', label: 'GPU Cloud — EU-Central' },
];

const MOCK_GPUS: GpuTypeItem[] = [
  {
    id: 'gpu-h100',
    name: 'NVIDIA H100 80GB',
    description: 'High-memory training and large model inference.',
    badge: 'NVIDIA',
    vendor: 'nvidia',
    profile: 'high-memory',
  },
  {
    id: 'gpu-a100',
    name: 'NVIDIA A100 40GB',
    description: 'Balanced training and general GPU workloads.',
    badge: 'NVIDIA',
    vendor: 'nvidia',
    profile: 'standard',
  },
  {
    id: 'gpu-a10g',
    name: 'NVIDIA A10G',
    description: 'Cost-effective inference GPUs.',
    badge: 'NVIDIA',
    vendor: 'nvidia',
    profile: 'inference',
  },
  {
    id: 'gpu-mi300x',
    name: 'AMD MI300X',
    description: 'Large memory bandwidth for HPC and AI.',
    badge: 'AMD',
    vendor: 'amd',
    profile: 'high-memory',
  },
  {
    id: 'gpu-mi250',
    name: 'AMD MI250',
    description: 'Dense compute clusters.',
    badge: 'AMD',
    vendor: 'amd',
    profile: 'standard',
  },
  {
    id: 'gpu-max1550',
    name: 'Intel Data Center GPU Max 1550',
    description: 'Intel Xe-based accelerators.',
    badge: 'Intel',
    vendor: 'intel',
    profile: 'standard',
  },
];

const GPU_ITEMS_PER_PAGE = 4;

const DEFAULT_FORM: WorkloadPodFormValues = {
  instanceName: '',
  templateId: 'blank',
  gpuCloudId: 'cloud-a',
  labelQty: 1,
  gpuVendorFilter: 'all',
  gpuSearch: '',
  gpuProfileTab: 'standard',
  selectedGpuId: null,
  containerImage: '',
  dockerCommand: '',
  containerDiskGi: 50,
  volumeDiskGi: 100,
  volumeMountPath: '/workspace',
  exposeHttpPorts: '',
  envVars: [{ id: crypto.randomUUID(), key: '', value: '' }],
};

function CapsuleTab({
  items,
  activeValue,
  onChange,
  disabled,
}: {
  items: { value: GpuVendor; label: string }[];
  activeValue: GpuVendor;
  onChange: (value: GpuVendor) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-1 w-fit ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
    >
      {items.map((item) => {
        const isActive = item.value === activeValue;
        return (
          <button
            key={item.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(item.value)}
            className={`px-2.5 py-1 rounded-[var(--radius-md)] text-label-md min-w-[60px] text-center transition-colors ${
              isActive
                ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function GpuInstanceCard({
  gpu,
  selected,
  onSelect,
  readOnly,
}: {
  gpu: GpuTypeItem;
  selected: boolean;
  onSelect: () => void;
  readOnly?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={onSelect}
      className={`text-left w-full bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border p-4 flex flex-col gap-3 transition-colors ${
        selected
          ? 'border-[var(--color-border-focus)] ring-2 ring-[var(--color-border-focus)] ring-offset-2 ring-offset-[var(--color-surface-subtle)]'
          : 'border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]'
      } ${readOnly ? 'cursor-default opacity-90' : ''}`}
    >
      <VStack gap={1}>
        <span className="text-heading-h5 text-[var(--color-text-default)]">{gpu.name}</span>
        <span className="text-body-md text-[var(--color-text-subtle)]">{gpu.description}</span>
      </VStack>
      <Badge variant="info" size="sm">
        {gpu.badge}
      </Badge>
    </button>
  );
}

export interface WorkloadPodFormProps {
  mode: 'deploy' | 'edit';
  initialValues?: Partial<WorkloadPodFormValues>;
  gpuSelectionReadOnly?: boolean;
  onCancel: () => void;
  onSubmit: (values: WorkloadPodFormValues) => void;
  submitLabel: string;
}

export function WorkloadPodForm({
  mode,
  initialValues,
  gpuSelectionReadOnly = false,
  onCancel,
  onSubmit,
  submitLabel,
}: WorkloadPodFormProps) {
  const [values, setValues] = useState<WorkloadPodFormValues>(() => ({
    ...DEFAULT_FORM,
    ...initialValues,
    envVars: initialValues?.envVars?.length ? initialValues.envVars : DEFAULT_FORM.envVars,
  }));

  useEffect(() => {
    if (initialValues && mode === 'edit') {
      setValues((prev) => ({
        ...DEFAULT_FORM,
        ...initialValues,
        envVars: initialValues.envVars?.length ? initialValues.envVars : prev.envVars,
      }));
    }
  }, [initialValues, mode]);

  const filteredGpus = useMemo(() => {
    return MOCK_GPUS.filter((g) => {
      if (values.gpuVendorFilter !== 'all' && g.vendor !== values.gpuVendorFilter) return false;
      if (values.gpuProfileTab && g.profile !== values.gpuProfileTab) return false;
      if (values.gpuSearch.trim()) {
        const q = values.gpuSearch.toLowerCase();
        if (!g.name.toLowerCase().includes(q) && !g.description.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [values.gpuVendorFilter, values.gpuProfileTab, values.gpuSearch]);

  const gpuTotalPages = Math.max(1, Math.ceil(filteredGpus.length / GPU_ITEMS_PER_PAGE));
  const [gpuPage, setGpuPage] = useState(1);

  useEffect(() => {
    setGpuPage(1);
  }, [values.gpuVendorFilter, values.gpuProfileTab, values.gpuSearch]);

  const paginatedGpus = useMemo(
    () => filteredGpus.slice((gpuPage - 1) * GPU_ITEMS_PER_PAGE, gpuPage * GPU_ITEMS_PER_PAGE),
    [filteredGpus, gpuPage]
  );

  const selectedGpu = useMemo(
    () => MOCK_GPUS.find((g) => g.id === values.selectedGpuId),
    [values.selectedGpuId]
  );

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<'instanceName' | 'containerImage' | 'selectedGpuId', string>> = {};
    if (!values.instanceName.trim()) e.instanceName = 'Instance name is required.';
    if (!values.containerImage.trim()) e.containerImage = 'Container image is required.';
    if (!values.selectedGpuId) e.selectedGpuId = 'Please select a GPU type.';
    return e;
  }, [values.instanceName, values.containerImage, values.selectedGpuId]);

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (Object.keys(errors).length > 0) return;
    onSubmit(values);
  };

  const patch = (p: Partial<WorkloadPodFormValues>) => setValues((prev) => ({ ...prev, ...p }));

  const addEnvRow = () =>
    patch({
      envVars: [...values.envVars, { id: crypto.randomUUID(), key: '', value: '' }],
    });

  const removeEnvRow = (id: string) =>
    patch({
      envVars: values.envVars.filter((r) => r.id !== id),
    });

  const updateEnvRow = (id: string, field: 'key' | 'value', val: string) =>
    patch({
      envVars: values.envVars.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    });

  return (
    <VStack gap={6} className="w-full">
      <HStack align="start" gap={6} className="w-full items-start">
        <div className="w-full max-w-[1320px] min-w-0 flex-1 flex flex-col gap-4">
          <SectionCard>
            <SectionCard.Header title="Pod name" />
            <SectionCard.Content>
              <VStack gap={6}>
                <FormField
                  label="Instance name"
                  required
                  error={hasAttemptedSubmit && !!errors.instanceName}
                >
                  <Input
                    value={values.instanceName}
                    onChange={(e) => patch({ instanceName: e.target.value })}
                    placeholder="Enter instance name"
                    fullWidth
                    error={hasAttemptedSubmit && !!errors.instanceName}
                  />
                  {hasAttemptedSubmit && errors.instanceName && (
                    <FormField.ErrorMessage>{errors.instanceName}</FormField.ErrorMessage>
                  )}
                </FormField>
                <FormField
                  label="Template"
                  description="Start from a managed template or an empty pod."
                >
                  <Select
                    options={TEMPLATE_OPTIONS}
                    value={values.templateId}
                    onChange={(v) => patch({ templateId: v })}
                    fullWidth
                  />
                </FormField>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          <SectionCard>
            <SectionCard.Header title="GPU Config" />
            <SectionCard.Content>
              <VStack gap={6}>
                <FormField
                  label="GPU Cloud"
                  description="Select the GPU region pool for this workload."
                >
                  <Select
                    options={GPU_CLOUD_OPTIONS}
                    value={values.gpuCloudId}
                    onChange={(v) => patch({ gpuCloudId: v })}
                    fullWidth
                  />
                </FormField>
                <FormField label="Label" description="Replica or label quantity for scheduling.">
                  <NumberInput
                    min={1}
                    max={32}
                    value={values.labelQty}
                    onChange={(v) => patch({ labelQty: v })}
                    width="xs"
                    suffix="Qty"
                  />
                </FormField>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          <SectionCard>
            <SectionCard.Header title="Computing resources" />
            <SectionCard.Content>
              <VStack gap={6}>
                <VStack gap={3}>
                  <FormField
                    label="GPU Type"
                    description="Filter by vendor, then pick an instance profile."
                    error={hasAttemptedSubmit && !!errors.selectedGpuId}
                  >
                    <VStack gap={3}>
                      <CapsuleTab
                        disabled={gpuSelectionReadOnly}
                        items={[
                          { value: 'all', label: 'All' },
                          { value: 'nvidia', label: 'NVIDIA' },
                          { value: 'amd', label: 'AMD' },
                          { value: 'intel', label: 'Intel' },
                        ]}
                        activeValue={values.gpuVendorFilter}
                        onChange={(v) => patch({ gpuVendorFilter: v })}
                      />
                      <SearchInput
                        placeholder="Search GPU types"
                        value={values.gpuSearch}
                        onChange={(e) => patch({ gpuSearch: e.target.value })}
                        size="sm"
                        className="w-[312px]"
                        disabled={gpuSelectionReadOnly}
                      />
                      <Pagination
                        currentPage={gpuPage}
                        totalPages={gpuTotalPages}
                        onPageChange={setGpuPage}
                      />
                      <Tabs
                        value={values.gpuProfileTab}
                        onChange={(v) =>
                          patch({
                            gpuProfileTab: v as WorkloadPodFormValues['gpuProfileTab'],
                          })
                        }
                        variant="underline"
                        size="md"
                      >
                        <TabList>
                          <Tab value="standard">Standard</Tab>
                          <Tab value="high-memory">High memory</Tab>
                          <Tab value="inference">Inference</Tab>
                        </TabList>
                        {(['standard', 'high-memory', 'inference'] as const).map((profile) => (
                          <TabPanel key={profile} value={profile} className="pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              {paginatedGpus.map((gpu) => (
                                <GpuInstanceCard
                                  key={gpu.id}
                                  gpu={gpu}
                                  selected={values.selectedGpuId === gpu.id}
                                  readOnly={gpuSelectionReadOnly}
                                  onSelect={() =>
                                    patch({
                                      selectedGpuId:
                                        values.selectedGpuId === gpu.id ? null : gpu.id,
                                    })
                                  }
                                />
                              ))}
                            </div>
                            {paginatedGpus.length === 0 && (
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                No GPUs match your filters.
                              </span>
                            )}
                          </TabPanel>
                        ))}
                      </Tabs>
                      {hasAttemptedSubmit && errors.selectedGpuId && (
                        <FormField.ErrorMessage>{errors.selectedGpuId}</FormField.ErrorMessage>
                      )}
                    </VStack>
                  </FormField>
                </VStack>

                <FormField
                  label="Container image"
                  required
                  error={hasAttemptedSubmit && !!errors.containerImage}
                >
                  <Input
                    value={values.containerImage}
                    onChange={(e) => patch({ containerImage: e.target.value })}
                    placeholder="e.g. ghcr.io/org/image:tag"
                    fullWidth
                    error={hasAttemptedSubmit && !!errors.containerImage}
                  />
                  {hasAttemptedSubmit && errors.containerImage && (
                    <FormField.ErrorMessage>{errors.containerImage}</FormField.ErrorMessage>
                  )}
                </FormField>
                <FormField label="Docker command" description="Optional entrypoint override.">
                  <Input
                    value={values.dockerCommand}
                    onChange={(e) => patch({ dockerCommand: e.target.value })}
                    placeholder="e.g. python train.py"
                    fullWidth
                  />
                </FormField>
                <FormField label="Container disk" required>
                  <NumberInput
                    min={1}
                    max={2000}
                    value={values.containerDiskGi}
                    onChange={(v) => patch({ containerDiskGi: v })}
                    width="xs"
                    suffix="Gi"
                  />
                </FormField>
                <FormField label="Volume disk" required>
                  <NumberInput
                    min={1}
                    max={10000}
                    value={values.volumeDiskGi}
                    onChange={(v) => patch({ volumeDiskGi: v })}
                    width="xs"
                    suffix="Gi"
                  />
                </FormField>
                <FormField label="Volume mount path" required>
                  <Input
                    value={values.volumeMountPath}
                    onChange={(e) => patch({ volumeMountPath: e.target.value })}
                    fullWidth
                  />
                </FormField>
                <FormField
                  label="Expose HTTP ports"
                  description="Comma-separated ports exposed to HTTP ingress."
                >
                  <Input
                    value={values.exposeHttpPorts}
                    onChange={(e) => patch({ exposeHttpPorts: e.target.value })}
                    placeholder="e.g. 8080, 8888"
                    fullWidth
                  />
                </FormField>
                <VStack gap={2}>
                  <span className="text-label-sm text-[var(--color-text-default)]">
                    Environment variables
                  </span>
                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-1 items-center">
                      <span className="text-label-sm text-[var(--color-text-subtle)]">Key</span>
                      <span className="text-label-sm text-[var(--color-text-subtle)]">Value</span>
                      <div />
                      {values.envVars.map((row) => (
                        <Fragment key={row.id}>
                          <Input
                            value={row.key}
                            onChange={(e) => updateEnvRow(row.id, 'key', e.target.value)}
                            placeholder="KEY"
                            fullWidth
                          />
                          <Input
                            value={row.value}
                            onChange={(e) => updateEnvRow(row.id, 'value', e.target.value)}
                            placeholder="value"
                            fullWidth
                          />
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] size-5 disabled:opacity-40"
                            onClick={() =>
                              values.envVars.length > 1 ? removeEnvRow(row.id) : undefined
                            }
                            disabled={values.envVars.length <= 1}
                            aria-label="Remove row"
                          >
                            <IconX size={14} />
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      leftIcon={<IconCirclePlus size={12} />}
                      onClick={addEnvRow}
                    >
                      Add variable
                    </Button>
                  </div>
                </VStack>
              </VStack>
            </SectionCard.Content>
          </SectionCard>
        </div>

        <aside className="w-[336px] shrink-0 sticky top-4 self-start rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
          <VStack gap={4}>
            <span className="text-heading-h6 text-[var(--color-text-default)]">Summary</span>
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
            <VStack gap={2}>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Instance</span>
              <span className="text-body-md text-[var(--color-text-default)]">
                {values.instanceName || '—'}
              </span>
            </VStack>
            <VStack gap={2}>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Template</span>
              <span className="text-body-md text-[var(--color-text-default)]">
                {TEMPLATE_OPTIONS.find((o) => o.value === values.templateId)?.label ?? '—'}
              </span>
            </VStack>
            <VStack gap={2}>
              <span className="text-label-sm text-[var(--color-text-subtle)]">GPU Cloud</span>
              <span className="text-body-md text-[var(--color-text-default)]">
                {GPU_CLOUD_OPTIONS.find((o) => o.value === values.gpuCloudId)?.label ?? '—'}
              </span>
            </VStack>
            <VStack gap={2}>
              <span className="text-label-sm text-[var(--color-text-subtle)]">GPU</span>
              <span className="text-body-md text-[var(--color-text-default)]">
                {selectedGpu?.name ?? '—'}
              </span>
            </VStack>
            <VStack gap={2}>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Image</span>
              <span className="text-body-md text-[var(--color-text-default)] break-all">
                {values.containerImage || '—'}
              </span>
            </VStack>
            <VStack gap={2}>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Disks</span>
              <span className="text-body-md text-[var(--color-text-default)]">
                Container {values.containerDiskGi} Gi · Volume {values.volumeDiskGi} Gi
              </span>
            </VStack>
          </VStack>
        </aside>
      </HStack>

      <HStack justify="end" gap={2} className="w-full pt-2">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </HStack>
    </VStack>
  );
}
