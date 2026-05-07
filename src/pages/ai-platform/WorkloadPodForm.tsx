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
  Disclosure,
  Toggle,
  Textarea,
  FloatingCard,
} from '@/design-system';
import type { FloatingCardSection, QuotaItem } from '@/design-system';
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

export interface ImageTemplateItem {
  id: string;
  name: string;
  description: string;
  badge: string;
  category: 'thaki' | 'common';
}

export interface EnvVarRow {
  id: string;
  key: string;
  value: string;
}

export type ContainerImageSource = 'custom' | 'template';

export type ImageTemplateTab = 'all' | 'thaki' | 'common';

export interface WorkloadPodFormValues {
  instanceName: string;
  namespace: string;
  templateId: string;
  gpuCloudId: string;
  labelQty: number;
  gpuConfigurationId: string;
  gpuVendorFilter: GpuVendor;
  gpuSearch: string;
  gpuProfileTab: 'standard' | 'high-memory' | 'inference';
  selectedGpuId: string | null;
  containerImageSource: ContainerImageSource;
  imageTemplateSearch: string;
  imageTemplatePage: number;
  imageTemplateTab: ImageTemplateTab;
  selectedImageTemplateId: string | null;
  containerImage: string;
  dockerCommand: string;
  containerDiskGi: number;
  volumeDiskGi: number;
  volumeMountPath: string;
  exposeHttpPorts: string;
  envVars: EnvVarRow[];
  cpuRequestValue: number;
  cpuRequestUnit: 'm' | 'cores';
  cpuLimitValue: number;
  cpuLimitUnit: 'm' | 'cores';
  memoryRequestValue: number;
  memoryRequestUnit: 'Mi' | 'Gi';
  memoryLimitValue: number;
  memoryLimitUnit: 'Mi' | 'Gi';
  maxRunningTimeEnabled: boolean;
  noLimitRunIndefinitely: boolean;
  idleTimeoutHours: number;
  idleTimeoutMinutes: number;
  notifyBeforeTermination: boolean;
  notifyBeforeTerminationMinutes: number;
}

const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'ai-workloads', label: 'ai-workloads' },
];

const GPU_CONFIGURATION_OPTIONS = [
  { value: '1-units', label: '1 units' },
  { value: '2-units', label: '2 units' },
  { value: '4-units', label: '4 units' },
  { value: '8-units', label: '8 units' },
];

const VOLUME_MOUNT_OPTIONS = [
  { value: '/workspace', label: '/workspace' },
  { value: '/data', label: '/data' },
  { value: '/mnt/volume', label: '/mnt/volume' },
  { value: '/app', label: '/app' },
];

const CPU_UNIT_OPTIONS: { value: 'm' | 'cores'; label: string }[] = [
  { value: 'm', label: 'm' },
  { value: 'cores', label: 'cores' },
];

const MEMORY_UNIT_OPTIONS: { value: 'Mi' | 'Gi'; label: string }[] = [
  { value: 'Mi', label: 'Mi' },
  { value: 'Gi', label: 'Gi' },
];

const STORAGE_UNIT_OPTIONS = [{ value: 'Gi', label: 'Gi' }];

const MOCK_IMAGE_TEMPLATES: ImageTemplateItem[] = [
  {
    id: 'img-pytorch-thaki',
    name: 'PyTorch 2.x (Thaki)',
    description: 'CUDA-enabled training image maintained by Thaki.',
    badge: 'Thaki image',
    category: 'thaki',
  },
  {
    id: 'img-jupyter-thaki',
    name: 'JupyterLab GPU',
    description: 'Interactive notebooks with GPU drivers pre-installed.',
    badge: 'Thaki image',
    category: 'thaki',
  },
  {
    id: 'img-tf-common',
    name: 'TensorFlow Serving',
    description: 'Common template for TensorFlow model servers.',
    badge: 'Common image',
    category: 'common',
  },
  {
    id: 'img-nginx-common',
    name: 'NGINX + CUDA base',
    description: 'Lightweight reverse proxy and static hosting.',
    badge: 'Common image',
    category: 'common',
  },
  {
    id: 'img-triton-thaki',
    name: 'NVIDIA Triton (Thaki)',
    description: 'Optimized inference server stack.',
    badge: 'Thaki image',
    category: 'thaki',
  },
  {
    id: 'img-vllm-common',
    name: 'vLLM',
    description: 'High-throughput LLM inference template.',
    badge: 'Common image',
    category: 'common',
  },
  {
    id: 'img-ray-thaki',
    name: 'Ray Cluster',
    description: 'Distributed training and hyperparameter jobs.',
    badge: 'Thaki image',
    category: 'thaki',
  },
  {
    id: 'img-ollama-common',
    name: 'Ollama Runtime',
    description: 'Local model runtime for development.',
    badge: 'Common image',
    category: 'common',
  },
];

const IMAGE_TEMPLATES_PER_PAGE = 8;
const GPU_COUNT_MAX = 8;

const DEFAULT_FORM: WorkloadPodFormValues = {
  instanceName: '',
  namespace: 'default',
  templateId: 'blank',
  gpuCloudId: 'cloud-a',
  labelQty: 1,
  gpuConfigurationId: '1-units',
  gpuVendorFilter: 'all',
  gpuSearch: '',
  gpuProfileTab: 'standard',
  selectedGpuId: null,
  containerImageSource: 'custom',
  imageTemplateSearch: '',
  imageTemplatePage: 1,
  imageTemplateTab: 'all',
  selectedImageTemplateId: null,
  containerImage: '',
  dockerCommand: '',
  containerDiskGi: 50,
  volumeDiskGi: 100,
  volumeMountPath: '/workspace',
  exposeHttpPorts: '',
  envVars: [{ id: crypto.randomUUID(), key: '', value: '' }],
  cpuRequestValue: 250,
  cpuRequestUnit: 'm',
  cpuLimitValue: 2,
  cpuLimitUnit: 'cores',
  memoryRequestValue: 4,
  memoryRequestUnit: 'Gi',
  memoryLimitValue: 8,
  memoryLimitUnit: 'Gi',
  maxRunningTimeEnabled: false,
  noLimitRunIndefinitely: false,
  idleTimeoutHours: 1,
  idleTimeoutMinutes: 0,
  notifyBeforeTermination: false,
  notifyBeforeTerminationMinutes: 5,
};

function CapsuleTab<T extends string>({
  items,
  activeValue,
  onChange,
  disabled,
}: {
  items: { value: T; label: string }[];
  activeValue: T;
  onChange: (value: T) => void;
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

function ImageTemplateCard({
  template,
  selected,
  onSelect,
  readOnly,
}: {
  template: ImageTemplateItem;
  selected: boolean;
  onSelect: () => void;
  readOnly?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={onSelect}
      className={`text-left w-full bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border p-4 flex flex-col gap-3 transition-colors min-h-[120px] ${
        selected
          ? 'border-[var(--color-border-focus)] ring-2 ring-[var(--color-border-focus)] ring-offset-2 ring-offset-[var(--color-surface-subtle)]'
          : 'border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]'
      } ${readOnly ? 'cursor-default opacity-90' : ''}`}
    >
      <VStack gap={1}>
        <span className="text-heading-h6 text-[var(--color-text-default)]">{template.name}</span>
        <span className="text-body-md text-[var(--color-text-subtle)] line-clamp-2">
          {template.description}
        </span>
      </VStack>
      <Badge variant="info" size="sm">
        {template.badge}
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

function mergeInitialValues(initial?: Partial<WorkloadPodFormValues>): WorkloadPodFormValues {
  return {
    ...DEFAULT_FORM,
    ...initial,
    envVars:
      initial?.envVars?.length && initial.envVars.length > 0
        ? initial.envVars
        : DEFAULT_FORM.envVars,
  };
}

export function WorkloadPodForm({
  mode,
  initialValues,
  gpuSelectionReadOnly = false,
  onCancel,
  onSubmit,
  submitLabel,
}: WorkloadPodFormProps) {
  const [values, setValues] = useState<WorkloadPodFormValues>(() =>
    mergeInitialValues(initialValues)
  );

  useEffect(() => {
    if (initialValues && mode === 'edit') {
      setValues((prev) =>
        mergeInitialValues({
          ...initialValues,
          envVars: initialValues.envVars?.length ? initialValues.envVars : prev.envVars,
        })
      );
    }
  }, [initialValues, mode]);

  const [advancedDisclosureOpen, setAdvancedDisclosureOpen] = useState(false);

  const filteredImageTemplates = useMemo(() => {
    return MOCK_IMAGE_TEMPLATES.filter((t) => {
      if (values.imageTemplateTab !== 'all' && t.category !== values.imageTemplateTab) {
        return false;
      }
      if (values.imageTemplateSearch.trim()) {
        const q = values.imageTemplateSearch.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q) &&
          !t.badge.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [values.imageTemplateTab, values.imageTemplateSearch]);

  const imageTemplateTotalPages = Math.max(
    1,
    Math.ceil(filteredImageTemplates.length / IMAGE_TEMPLATES_PER_PAGE)
  );

  useEffect(() => {
    setValues((prev) => ({ ...prev, imageTemplatePage: 1 }));
  }, [values.imageTemplateTab, values.imageTemplateSearch]);

  const paginatedImageTemplates = useMemo(
    () =>
      filteredImageTemplates.slice(
        (values.imageTemplatePage - 1) * IMAGE_TEMPLATES_PER_PAGE,
        values.imageTemplatePage * IMAGE_TEMPLATES_PER_PAGE
      ),
    [filteredImageTemplates, values.imageTemplatePage]
  );

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<'podName' | 'containerImage', string>> = {};
    if (!values.instanceName.trim()) {
      e.podName = 'Pod name is required.';
    }
    const imageOk =
      values.containerImageSource === 'custom'
        ? values.containerImage.trim().length > 0
        : values.selectedImageTemplateId != null;
    if (!imageOk) {
      e.containerImage = 'Container image is required.';
    }
    return e;
  }, [
    values.instanceName,
    values.containerImage,
    values.containerImageSource,
    values.selectedImageTemplateId,
  ]);

  const basicSectionDone = useMemo(
    () => !!values.instanceName.trim() && !!values.namespace,
    [values.instanceName, values.namespace]
  );

  const gpuSectionDone = useMemo(
    () => !!values.gpuConfigurationId && values.labelQty >= 1,
    [values.gpuConfigurationId, values.labelQty]
  );

  const containerSectionDone = useMemo(() => {
    const imageOk =
      values.containerImageSource === 'custom'
        ? values.containerImage.trim().length > 0
        : values.selectedImageTemplateId != null;
    return imageOk && !!values.exposeHttpPorts.trim();
  }, [
    values.containerImage,
    values.containerImageSource,
    values.selectedImageTemplateId,
    values.exposeHttpPorts,
  ]);

  const advancedSectionDone = advancedDisclosureOpen;

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

  const summarySections = useMemo<FloatingCardSection[]>(
    () => [
      {
        tabTitle: '',
        collapsible: false,
        items: [
          {
            id: 'basic',
            title: 'Basic information',
            status: basicSectionDone ? 'success' : 'processing',
          },
          { id: 'gpu', title: 'GPU settings', status: gpuSectionDone ? 'success' : 'processing' },
          {
            id: 'container',
            title: 'Container settings',
            status: containerSectionDone ? 'success' : 'processing',
          },
          {
            id: 'advanced',
            title: 'Advanced options',
            status: advancedSectionDone ? 'success' : 'processing',
          },
        ],
      },
    ],
    [basicSectionDone, gpuSectionDone, containerSectionDone, advancedSectionDone]
  );

  const quotaItems = useMemo<QuotaItem[]>(
    () => [
      { label: 'nodes', current: 15, total: 32 },
      { label: 'CPU', current: 64, total: 100 },
    ],
    []
  );

  const allSectionsDone = basicSectionDone && gpuSectionDone && containerSectionDone;

  return (
    <HStack align="start" gap={6} className="w-full items-start">
      <div className="w-full max-w-[1320px] min-w-0 flex flex-col gap-4">
        <SectionCard>
          <SectionCard.Header title="Basic information" />
          <SectionCard.Content>
            <VStack gap={6}>
              <FormField label="Pod name" required error={hasAttemptedSubmit && !!errors.podName}>
                <Input
                  value={values.instanceName}
                  onChange={(e) => patch({ instanceName: e.target.value })}
                  placeholder="Enter a name for this pod"
                  fullWidth
                  error={hasAttemptedSubmit && !!errors.podName}
                />
                {hasAttemptedSubmit && errors.podName && (
                  <FormField.ErrorMessage>{errors.podName}</FormField.ErrorMessage>
                )}
              </FormField>
              <FormField
                label="Namespace"
                description="Kubernetes namespace where this pod will be scheduled."
                required
              >
                <Select
                  options={NAMESPACE_OPTIONS}
                  value={values.namespace}
                  onChange={(v) => patch({ namespace: v })}
                  width={328}
                />
              </FormField>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="GPU settings" />
          <SectionCard.Content>
            <VStack gap={6}>
              <FormField
                label="GPU Configuration"
                description="The type and number of GPU resources allocated to the pod."
                required
              >
                <Select
                  options={GPU_CONFIGURATION_OPTIONS}
                  value={values.gpuConfigurationId}
                  onChange={(v) => patch({ gpuConfigurationId: v })}
                  width={328}
                  disabled={gpuSelectionReadOnly}
                />
              </FormField>
              <FormField label="GPU Count" description="Select the number of GPUs">
                <HStack gap={2} align="center">
                  <NumberInput
                    min={1}
                    max={GPU_COUNT_MAX}
                    value={values.labelQty}
                    onChange={(v) => patch({ labelQty: v })}
                    width="xs"
                    disabled={gpuSelectionReadOnly}
                  />
                  <span className="text-body-md text-[var(--color-text-subtle)]">
                    /{GPU_COUNT_MAX}
                  </span>
                </HStack>
              </FormField>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Container settings" />
          <SectionCard.Content>
            <VStack gap={6}>
              <FormField
                required
                error={hasAttemptedSubmit && !!errors.containerImage}
                label="Container image"
                description="The container image used to create and run the pod."
              >
                <VStack gap={3}>
                  <CapsuleTab
                    items={[
                      { value: 'custom' as const, label: 'Custom image' },
                      { value: 'template' as const, label: 'Select template' },
                    ]}
                    activeValue={values.containerImageSource}
                    onChange={(v) => {
                      patch({ containerImageSource: v });
                      if (hasAttemptedSubmit) setHasAttemptedSubmit(true);
                    }}
                  />

                  {values.containerImageSource === 'custom' ? (
                    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 w-full">
                      <VStack gap={3}>
                        <span className="text-heading-h6 text-[var(--color-text-default)]">
                          Custom image
                        </span>
                        <span className="text-body-md text-[var(--color-text-subtle)]">
                          Manually enter and configure the Docker image settings with full
                          flexibility
                        </span>
                        <Input
                          value={values.containerImage}
                          onChange={(e) => patch({ containerImage: e.target.value })}
                          placeholder="e.g. ghcr.io/org/image:tag"
                          fullWidth
                          error={hasAttemptedSubmit && !!errors.containerImage}
                        />
                      </VStack>
                    </div>
                  ) : (
                    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 w-full">
                      <VStack gap={4}>
                        <VStack gap={1}>
                          <span className="text-heading-h6 text-[var(--color-text-default)]">
                            Select template
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            Choose a predefined template to quickly apply standard configuration
                            settings for the Docker image deployment.
                          </span>
                        </VStack>
                        <HStack gap={3} align="center" className="flex-wrap">
                          <SearchInput
                            placeholder="Search templates"
                            value={values.imageTemplateSearch}
                            onChange={(e) => patch({ imageTemplateSearch: e.target.value })}
                            size="sm"
                            className="w-[240px]"
                            disabled={gpuSelectionReadOnly}
                          />
                          <Pagination
                            currentPage={values.imageTemplatePage}
                            totalPages={imageTemplateTotalPages}
                            onPageChange={(p) => patch({ imageTemplatePage: p })}
                          />
                        </HStack>
                        <Tabs
                          value={values.imageTemplateTab}
                          onChange={(v) => patch({ imageTemplateTab: v as ImageTemplateTab })}
                          variant="underline"
                          size="sm"
                        >
                          <TabList>
                            <Tab value="all">All</Tab>
                            <Tab value="thaki">Thaki image</Tab>
                            <Tab value="common">Common image</Tab>
                          </TabList>
                          {(['all', 'thaki', 'common'] as const).map((tab) => (
                            <TabPanel key={tab} value={tab} className="pt-4">
                              <div className="grid grid-cols-4 gap-4">
                                {paginatedImageTemplates.map((tpl) => (
                                  <ImageTemplateCard
                                    key={tpl.id}
                                    template={tpl}
                                    selected={values.selectedImageTemplateId === tpl.id}
                                    readOnly={gpuSelectionReadOnly}
                                    onSelect={() =>
                                      patch({
                                        selectedImageTemplateId:
                                          values.selectedImageTemplateId === tpl.id ? null : tpl.id,
                                        containerImage: `template:${tpl.id}`,
                                      })
                                    }
                                  />
                                ))}
                              </div>
                              {paginatedImageTemplates.length === 0 && (
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  No templates match your filters.
                                </span>
                              )}
                            </TabPanel>
                          ))}
                        </Tabs>
                      </VStack>
                    </div>
                  )}
                  {hasAttemptedSubmit && errors.containerImage && (
                    <FormField.ErrorMessage>{errors.containerImage}</FormField.ErrorMessage>
                  )}
                </VStack>
              </FormField>

              <FormField label="Ports" required>
                <FormField.Description>Auto-detected ports: 80, 443</FormField.Description>
                <FormField.Control>
                  <Input
                    value={values.exposeHttpPorts}
                    onChange={(e) => patch({ exposeHttpPorts: e.target.value })}
                    placeholder="e.g. 8080, 3000"
                    fullWidth
                  />
                </FormField.Control>
                <FormField.HelperText>
                  Comma-separated port numbers (e.g., 8080, 3000)
                </FormField.HelperText>
              </FormField>

              <Disclosure>
                <Disclosure.Trigger className="w-full justify-start">
                  Environment variables
                </Disclosure.Trigger>
                <Disclosure.Panel className="mt-3">
                  <VStack gap={3}>
                    <span className="text-body-md text-[var(--color-text-subtle)]">
                      Configure key-value environment variables required for application runtime,
                      such as API keys and service endpoints.
                    </span>
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 items-center w-full">
                      {values.envVars.map((row) => (
                        <Fragment key={row.id}>
                          <HStack gap={2} align="center" className="min-w-0">
                            <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0 w-8">
                              Key
                            </span>
                            <Input
                              value={row.key}
                              onChange={(e) => updateEnvRow(row.id, 'key', e.target.value)}
                              placeholder="KEY"
                              fullWidth
                            />
                          </HStack>
                          <HStack gap={2} align="center" className="min-w-0">
                            <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0 w-10">
                              Value
                            </span>
                            <Input
                              value={row.value}
                              onChange={(e) => updateEnvRow(row.id, 'value', e.target.value)}
                              placeholder="value"
                              fullWidth
                            />
                          </HStack>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] size-5 disabled:opacity-40 self-center"
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
                      leftIcon={<IconCirclePlus size={12} />}
                      onClick={addEnvRow}
                    >
                      Add variable
                    </Button>
                  </VStack>
                </Disclosure.Panel>
              </Disclosure>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <Disclosure open={advancedDisclosureOpen} onChange={setAdvancedDisclosureOpen}>
            <VStack gap={4} className="w-full">
              <div
                className="w-full pb-3"
                style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
              >
                <Disclosure.Trigger className="text-heading-h5 text-[var(--color-text-default)] w-full justify-start">
                  Advanced options
                </Disclosure.Trigger>
              </div>
              <Disclosure.Panel className="w-full">
                <VStack gap={6}>
                  <FormField
                    label="CPU request"
                    description="Minimum CPU guaranteed for the pod scheduler."
                  >
                    <HStack gap={2} align="center">
                      <NumberInput
                        min={0}
                        value={values.cpuRequestValue}
                        onChange={(v) => patch({ cpuRequestValue: v })}
                        width="xs"
                      />
                      <Select
                        options={CPU_UNIT_OPTIONS}
                        value={values.cpuRequestUnit}
                        onChange={(v) => patch({ cpuRequestUnit: v as 'm' | 'cores' })}
                        width="xs"
                      />
                    </HStack>
                  </FormField>
                  <FormField label="CPU limit" description="Maximum CPU the pod may consume.">
                    <HStack gap={2} align="center">
                      <NumberInput
                        min={0}
                        value={values.cpuLimitValue}
                        onChange={(v) => patch({ cpuLimitValue: v })}
                        width="xs"
                      />
                      <Select
                        options={CPU_UNIT_OPTIONS}
                        value={values.cpuLimitUnit}
                        onChange={(v) => patch({ cpuLimitUnit: v as 'm' | 'cores' })}
                        width="xs"
                      />
                    </HStack>
                  </FormField>
                  <FormField
                    label="Memory request"
                    description="Minimum memory reserved for this workload."
                  >
                    <HStack gap={2} align="center">
                      <NumberInput
                        min={0}
                        value={values.memoryRequestValue}
                        onChange={(v) => patch({ memoryRequestValue: v })}
                        width="xs"
                      />
                      <Select
                        options={MEMORY_UNIT_OPTIONS}
                        value={values.memoryRequestUnit}
                        onChange={(v) => patch({ memoryRequestUnit: v as 'Mi' | 'Gi' })}
                        width="xs"
                      />
                    </HStack>
                  </FormField>
                  <FormField
                    label="Memory limit"
                    description="Upper bound on memory usage before eviction."
                  >
                    <HStack gap={2} align="center">
                      <NumberInput
                        min={0}
                        value={values.memoryLimitValue}
                        onChange={(v) => patch({ memoryLimitValue: v })}
                        width="xs"
                      />
                      <Select
                        options={MEMORY_UNIT_OPTIONS}
                        value={values.memoryLimitUnit}
                        onChange={(v) => patch({ memoryLimitUnit: v as 'Mi' | 'Gi' })}
                        width="xs"
                      />
                    </HStack>
                  </FormField>
                  <FormField
                    label="Storage"
                    description="Ephemeral storage requested for the container."
                  >
                    <HStack gap={2} align="center">
                      <NumberInput
                        min={1}
                        value={values.containerDiskGi}
                        onChange={(v) => patch({ containerDiskGi: v })}
                        width="xs"
                      />
                      <Select
                        options={STORAGE_UNIT_OPTIONS}
                        value="Gi"
                        onChange={() => undefined}
                        width="xs"
                        disabled
                      />
                    </HStack>
                  </FormField>
                  <FormField
                    label="Volume mount path"
                    description="Mount point inside the container for attached storage."
                  >
                    <Select
                      options={VOLUME_MOUNT_OPTIONS}
                      value={values.volumeMountPath}
                      onChange={(v) => patch({ volumeMountPath: v })}
                      width={328}
                    />
                  </FormField>
                  <FormField
                    spacing="loose"
                    label="Max running time"
                    description="Cap total runtime for this job."
                  >
                    <Toggle
                      checked={values.maxRunningTimeEnabled}
                      onChange={(e) => patch({ maxRunningTimeEnabled: e.target.checked })}
                      label="Enable max running time"
                    />
                  </FormField>
                  <FormField
                    spacing="loose"
                    label="No limit run indefinitely"
                    description="Enable to run until manually stopped. Otherwise, the job will be terminated once the idle timeout expires."
                  >
                    <Toggle
                      checked={values.noLimitRunIndefinitely}
                      onChange={(e) => patch({ noLimitRunIndefinitely: e.target.checked })}
                      label="Run indefinitely"
                    />
                  </FormField>
                  {!values.noLimitRunIndefinitely && (
                    <HStack gap={2} align="center">
                      <NumberInput
                        min={0}
                        max={168}
                        value={values.idleTimeoutHours}
                        onChange={(v) => patch({ idleTimeoutHours: v })}
                        width="xs"
                        suffix="hr"
                      />
                      <NumberInput
                        min={0}
                        max={59}
                        value={values.idleTimeoutMinutes}
                        onChange={(v) => patch({ idleTimeoutMinutes: v })}
                        width="xs"
                        suffix="min"
                      />
                    </HStack>
                  )}
                  <FormField
                    spacing="loose"
                    label="Notify before termination"
                    description="Send an alert window."
                  >
                    <Toggle
                      checked={values.notifyBeforeTermination}
                      onChange={(e) => patch({ notifyBeforeTermination: e.target.checked })}
                      label="Notify before termination"
                    />
                  </FormField>
                  {values.notifyBeforeTermination && (
                    <FormField label="Lead time" description="Minutes before termination.">
                      <NumberInput
                        min={1}
                        value={values.notifyBeforeTerminationMinutes}
                        onChange={(v) => patch({ notifyBeforeTerminationMinutes: v })}
                        width="xs"
                        suffix="min"
                      />
                    </FormField>
                  )}
                  <Disclosure defaultOpen={false}>
                    <Disclosure.Trigger>Start command</Disclosure.Trigger>
                    <Disclosure.Panel className="mt-3">
                      <Textarea
                        value={values.dockerCommand}
                        onChange={(e) => patch({ dockerCommand: e.target.value })}
                        placeholder="e.g. python train.py"
                        fullWidth
                        rows={4}
                      />
                    </Disclosure.Panel>
                  </Disclosure>
                </VStack>
              </Disclosure.Panel>
            </VStack>
          </Disclosure>
        </SectionCard>
      </div>

      <div className="w-[312px] shrink-0 sticky top-4 self-start">
        <FloatingCard
          title="Summary"
          sections={summarySections}
          quota={quotaItems}
          cancelLabel="Cancel"
          actionLabel={submitLabel}
          actionEnabled={allSectionsDone && Object.keys(errors).length === 0}
          onCancel={onCancel}
          onAction={handleSubmit}
          portal={false}
          width="312px"
        />
      </div>
    </HStack>
  );
}

export default WorkloadPodForm;
