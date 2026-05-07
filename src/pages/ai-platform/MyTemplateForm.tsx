import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  VStack,
  HStack,
  SectionCard,
  FormField,
  Input,
  NumberInput,
  Textarea,
  Button,
  Checkbox,
  Chip,
  FloatingCard,
  RadioGroup,
  Radio,
} from '@/design-system';
import type { FloatingCardSection } from '@/design-system';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

const TEMPLATE_NAME_PATTERN = /^[a-zA-Z0-9._\-!?]{3,128}$/;

const RECOMMENDED_IMAGES = [
  'nginx:1.25',
  'alpine:3.18',
  'ubuntu:22.04',
  'python:3.11-slim',
] as const;

export interface MyTemplateFormValues {
  templateName: string;
  description: string;
  visibility: 'private' | 'public';
  category: string;
  customCategory: string;
  baseImage: string;
  runCommands: string;
  requiresGpu: boolean;
  minGpuMemory: number;
  minCpuCores: number;
  minMemory: number;
  containerDisk: number;
  volumeDisk: number;
  volumeMountPath: string;
  httpPorts: string[];
  envVars: { id: string; key: string; value: string }[];
}

export interface MyTemplateFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<MyTemplateFormValues>;
  onCancel: () => void;
  onSubmit: (values: MyTemplateFormValues) => void;
  submitLabel: string;
}

const DEFAULT_FORM: MyTemplateFormValues = {
  templateName: '',
  description: '',
  visibility: 'private',
  category: 'custom',
  customCategory: '',
  baseImage: '',
  runCommands: '',
  requiresGpu: false,
  minGpuMemory: 8,
  minCpuCores: 2,
  minMemory: 8,
  containerDisk: 50,
  volumeDisk: 100,
  volumeMountPath: '/workspace',
  httpPorts: [''],
  envVars: [{ id: crypto.randomUUID(), key: '', value: '' }],
};

function mergeInitialValues(initial?: Partial<MyTemplateFormValues>): MyTemplateFormValues {
  return {
    ...DEFAULT_FORM,
    ...initial,
    httpPorts:
      initial?.httpPorts && initial.httpPorts.length > 0
        ? initial.httpPorts
        : DEFAULT_FORM.httpPorts,
    envVars:
      initial?.envVars?.length && initial.envVars.length > 0
        ? initial.envVars
        : DEFAULT_FORM.envVars,
  };
}

type FieldErrors = Partial<
  Record<
    | 'templateName'
    | 'category'
    | 'customCategory'
    | 'baseImage'
    | 'minGpuMemory'
    | 'minCpuCores'
    | 'minMemory'
    | 'containerDisk'
    | 'httpPorts',
    string
  >
>;

function validateValues(values: MyTemplateFormValues): FieldErrors {
  const e: FieldErrors = {};
  const name = values.templateName.trim();
  if (!name) {
    e.templateName = 'Template name is required.';
  } else if (name.length < 3 || name.length > 128) {
    e.templateName = 'Must be between 3 and 128 characters.';
  } else if (!TEMPLATE_NAME_PATTERN.test(name)) {
    e.templateName = 'Allowed: letters, numbers, "-", "_", ".", "!", "?".';
  }

  if (!values.category.trim()) {
    e.category = 'Category is required.';
  } else if (values.category === 'custom' && !values.customCategory.trim()) {
    e.customCategory = 'Enter a custom category.';
  }

  if (!values.baseImage.trim()) {
    e.baseImage = 'Base image is required.';
  }

  if (values.requiresGpu && values.minGpuMemory <= 0) {
    e.minGpuMemory = 'Minimum GPU memory must be greater than 0 when GPU is required.';
  }

  if (values.minCpuCores <= 0) {
    e.minCpuCores = 'Minimum CPU cores must be greater than 0.';
  }

  if (values.minMemory <= 0) {
    e.minMemory = 'Minimum memory must be greater than 0.';
  }

  if (values.containerDisk <= 0) {
    e.containerDisk = 'Container disk must be greater than 0.';
  }

  const parsedPorts = values.httpPorts.map((p) => p.trim()).filter(Boolean);
  if (parsedPorts.length > 10) {
    e.httpPorts = 'You can add at most 10 HTTP ports.';
  } else {
    for (const p of parsedPorts) {
      const n = Number(p);
      if (!Number.isInteger(n) || n < 1 || n > 65535) {
        e.httpPorts = 'Each port must be an integer from 1 to 65535.';
        break;
      }
    }
  }

  return e;
}

export function MyTemplateForm({
  mode,
  initialValues,
  onCancel,
  onSubmit,
  submitLabel,
}: MyTemplateFormProps) {
  const [values, setValues] = useState<MyTemplateFormValues>(() =>
    mergeInitialValues(initialValues)
  );

  useEffect(() => {
    if (initialValues && mode === 'edit') {
      setValues((prev) =>
        mergeInitialValues({
          ...initialValues,
          envVars: initialValues.envVars?.length ? initialValues.envVars : prev.envVars,
          httpPorts:
            initialValues.httpPorts?.length && initialValues.httpPorts.length > 0
              ? initialValues.httpPorts
              : prev.httpPorts,
        })
      );
    }
  }, [initialValues, mode]);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const fieldErrors = useMemo(() => validateValues(values), [values]);

  const patch = useCallback((p: Partial<MyTemplateFormValues>) => {
    setValues((prev) => ({ ...prev, ...p }));
  }, []);

  const basicSectionDone = useMemo(() => {
    const name = values.templateName.trim();
    const nameOk = TEMPLATE_NAME_PATTERN.test(name);
    const categoryOk =
      values.category !== 'custom' ? !!values.category : values.customCategory.trim().length > 0;
    return nameOk && !!values.visibility && categoryOk;
  }, [values.templateName, values.visibility, values.category, values.customCategory]);

  const dockerSectionDone = useMemo(() => values.baseImage.trim().length > 0, [values.baseImage]);

  const hardwareSectionDone = useMemo(() => {
    const gpuOk = !values.requiresGpu || values.minGpuMemory > 0;
    return gpuOk && values.minCpuCores > 0 && values.minMemory > 0 && values.containerDisk > 0;
  }, [
    values.requiresGpu,
    values.minGpuMemory,
    values.minCpuCores,
    values.minMemory,
    values.containerDisk,
  ]);

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
          {
            id: 'docker',
            title: 'Docker configuration',
            status: dockerSectionDone ? 'success' : 'processing',
          },
          {
            id: 'hardware',
            title: 'Hardware requirements',
            status: hardwareSectionDone ? 'success' : 'processing',
          },
        ],
      },
    ],
    [basicSectionDone, dockerSectionDone, hardwareSectionDone]
  );

  const allSectionsDone = basicSectionDone && dockerSectionDone && hardwareSectionDone;

  const addEnvRow = useCallback(() => {
    patch({
      envVars: [...values.envVars, { id: crypto.randomUUID(), key: '', value: '' }],
    });
  }, [patch, values.envVars]);

  const removeEnvRow = useCallback(
    (id: string) => {
      patch({
        envVars: values.envVars.filter((r) => r.id !== id),
      });
    },
    [patch, values.envVars]
  );

  const updateEnvRow = useCallback(
    (id: string, field: 'key' | 'value', val: string) => {
      patch({
        envVars: values.envVars.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
      });
    },
    [patch, values.envVars]
  );

  const addHttpPortRow = useCallback(() => {
    if (values.httpPorts.length >= 10) return;
    patch({ httpPorts: [...values.httpPorts, ''] });
  }, [patch, values.httpPorts]);

  const removeHttpPortRow = useCallback(
    (index: number) => {
      const next = values.httpPorts.filter((_, i) => i !== index);
      patch({ httpPorts: next.length > 0 ? next : [''] });
    },
    [patch, values.httpPorts]
  );

  const updateHttpPort = useCallback(
    (index: number, val: string) => {
      const next = values.httpPorts.map((p, i) => (i === index ? val : p));
      patch({ httpPorts: next });
    },
    [patch, values.httpPorts]
  );

  const handleSubmit = useCallback(() => {
    setHasAttemptedSubmit(true);
    const errs = validateValues(values);
    if (Object.keys(errs).length > 0) return;
    onSubmit(values);
  }, [values, onSubmit]);

  const submitBlocked = Object.keys(fieldErrors).length > 0;

  return (
    <HStack align="start" gap={6} className="w-full items-start">
      <div className="w-full max-w-[1320px] min-w-0 flex flex-col gap-4">
        <SectionCard>
          <SectionCard.Header title="Basic information" />
          <SectionCard.Content>
            <VStack gap={6}>
              <FormField
                label="Template name"
                helperText='Allowed: 3-128 characters, letters, numbers, "-", "_", ".", "!", "?"'
                required
                error={hasAttemptedSubmit && !!fieldErrors.templateName}
              >
                <Input
                  value={values.templateName}
                  onChange={(e) => patch({ templateName: e.target.value })}
                  placeholder="Enter a name for this template"
                  fullWidth
                  error={hasAttemptedSubmit && !!fieldErrors.templateName}
                />
                {hasAttemptedSubmit && fieldErrors.templateName && (
                  <FormField.ErrorMessage>{fieldErrors.templateName}</FormField.ErrorMessage>
                )}
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={values.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  placeholder="Add an description"
                  fullWidth
                />
              </FormField>

              <FormField
                label="Visibility"
                description="Control who can view and use this template"
                required
                spacing="loose"
              >
                <RadioGroup
                  value={values.visibility}
                  onChange={(v) => patch({ visibility: v as 'private' | 'public' })}
                >
                  <Radio value="private" label="Private" />
                  <Radio value="public" label="Public" />
                </RadioGroup>
              </FormField>

              <FormField
                label="Category"
                description="A category used to organize and group templates."
                required
                spacing="loose"
                error={
                  hasAttemptedSubmit && (!!fieldErrors.category || !!fieldErrors.customCategory)
                }
              >
                <RadioGroup
                  value={values.category}
                  onChange={(v) => patch({ category: v })}
                  error={hasAttemptedSubmit && !!fieldErrors.category}
                  errorMessage={fieldErrors.category}
                >
                  <Radio
                    value="aiml"
                    label="AI/ML"
                    description="Machine learning and AI workloads"
                  />
                  <Radio
                    value="development"
                    label="Development"
                    description="Development environments and tools"
                  />
                  <Radio
                    value="rendering"
                    label="Rendering"
                    description="Video and 3D rendering workloads"
                  />
                  <Radio
                    value="scientific"
                    label="Scientific"
                    description="Scientific computing and research"
                  />
                  <Radio
                    value="web-service"
                    label="Web service"
                    description="Web applications and services"
                  />
                  <Radio value="custom" label="Custom" />
                </RadioGroup>
                {values.category === 'custom' && (
                  <div className="mt-3">
                    <Input
                      value={values.customCategory}
                      onChange={(e) => patch({ customCategory: e.target.value })}
                      placeholder="Enter custom category"
                      fullWidth
                      error={hasAttemptedSubmit && !!fieldErrors.customCategory}
                    />
                    {hasAttemptedSubmit && fieldErrors.customCategory && (
                      <FormField.ErrorMessage>{fieldErrors.customCategory}</FormField.ErrorMessage>
                    )}
                  </div>
                )}
              </FormField>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Docker configuration" />
          <SectionCard.Content>
            <VStack gap={6}>
              <FormField
                label="Base image"
                description="The Docker image used as the base for this template. Containers will be created from this image."
                required
                error={hasAttemptedSubmit && !!fieldErrors.baseImage}
              >
                <Input
                  value={values.baseImage}
                  onChange={(e) => patch({ baseImage: e.target.value })}
                  placeholder="e.g., nginx:1.25, python:3.11-slim"
                  fullWidth
                  error={hasAttemptedSubmit && !!fieldErrors.baseImage}
                />
                {hasAttemptedSubmit && fieldErrors.baseImage && (
                  <FormField.ErrorMessage>{fieldErrors.baseImage}</FormField.ErrorMessage>
                )}
                <VStack gap={2} className="mt-3">
                  <span className="text-label-sm text-[var(--color-text-subtle)]">
                    Recommend Image
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 w-full">
                    {RECOMMENDED_IMAGES.map((img) => (
                      <Chip
                        key={img}
                        value={img}
                        className="shrink-0 cursor-pointer"
                        onClick={() => patch({ baseImage: img })}
                        onKeyDown={(ev) => {
                          if (ev.key === 'Enter' || ev.key === ' ') {
                            ev.preventDefault();
                            patch({ baseImage: img });
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      />
                    ))}
                  </div>
                </VStack>
              </FormField>

              <FormField
                label="Run commands"
                description="Enter commands to run when the container starts. (You can enter multiple commands separated by spaces)"
              >
                <Textarea
                  value={values.runCommands}
                  onChange={(e) => patch({ runCommands: e.target.value })}
                  placeholder="e.g., python app.py --port 8000 or npm install; npm start (shell operators require sh -c wrapping)"
                  fullWidth
                />
              </FormField>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Hardware requirements" />
          <SectionCard.Content>
            <VStack gap={6}>
              <FormField spacing="loose">
                <Checkbox
                  label="Requires GPU"
                  checked={values.requiresGpu}
                  onChange={(e) => patch({ requiresGpu: e.target.checked })}
                />
              </FormField>

              <FormField
                label="Minimum GPU memory"
                description="Minimum GPU memory required for GPU tasks"
                required
                error={hasAttemptedSubmit && !!fieldErrors.minGpuMemory}
              >
                <NumberInput
                  value={values.minGpuMemory}
                  onChange={(n) => patch({ minGpuMemory: n })}
                  min={0}
                  step={1}
                  width="xs"
                  suffix="GB"
                  disabled={!values.requiresGpu}
                  error={hasAttemptedSubmit && !!fieldErrors.minGpuMemory}
                />
                {hasAttemptedSubmit && fieldErrors.minGpuMemory && (
                  <FormField.ErrorMessage>{fieldErrors.minGpuMemory}</FormField.ErrorMessage>
                )}
              </FormField>

              <FormField
                label="Minimum CPU cores"
                description="Minimum CPU cores required for container execution"
                required
                error={hasAttemptedSubmit && !!fieldErrors.minCpuCores}
              >
                <NumberInput
                  value={values.minCpuCores}
                  onChange={(n) => patch({ minCpuCores: n })}
                  min={1}
                  step={1}
                  width="xs"
                  suffix="cores"
                  error={hasAttemptedSubmit && !!fieldErrors.minCpuCores}
                />
                {hasAttemptedSubmit && fieldErrors.minCpuCores && (
                  <FormField.ErrorMessage>{fieldErrors.minCpuCores}</FormField.ErrorMessage>
                )}
              </FormField>

              <FormField
                label="Minimum memory"
                description="Minimum system memory required for container execution"
                required
                error={hasAttemptedSubmit && !!fieldErrors.minMemory}
              >
                <NumberInput
                  value={values.minMemory}
                  onChange={(n) => patch({ minMemory: n })}
                  min={1}
                  step={1}
                  width="xs"
                  suffix="GB"
                  error={hasAttemptedSubmit && !!fieldErrors.minMemory}
                />
                {hasAttemptedSubmit && fieldErrors.minMemory && (
                  <FormField.ErrorMessage>{fieldErrors.minMemory}</FormField.ErrorMessage>
                )}
              </FormField>

              <FormField
                label="Container disk"
                description="Persistent disk space mounted to the container"
                required
                error={hasAttemptedSubmit && !!fieldErrors.containerDisk}
              >
                <NumberInput
                  value={values.containerDisk}
                  onChange={(n) => patch({ containerDisk: n })}
                  min={1}
                  step={1}
                  width="xs"
                  suffix="GB"
                  error={hasAttemptedSubmit && !!fieldErrors.containerDisk}
                />
                {hasAttemptedSubmit && fieldErrors.containerDisk && (
                  <FormField.ErrorMessage>{fieldErrors.containerDisk}</FormField.ErrorMessage>
                )}
              </FormField>

              <FormField
                label="Volume disk"
                description="The storage volume that will be attached to the pod."
              >
                <NumberInput
                  value={values.volumeDisk}
                  onChange={(n) => patch({ volumeDisk: n })}
                  min={0}
                  step={1}
                  width="xs"
                  suffix="GB"
                />
              </FormField>

              <FormField
                label="Volume mount path"
                description="The directory path inside the container where the volume will be mounted."
              >
                <Input
                  value={values.volumeMountPath}
                  onChange={(e) => patch({ volumeMountPath: e.target.value })}
                  fullWidth
                />
              </FormField>

              <FormField
                label="HTTP ports"
                description="The network ports exposed by the container to receive HTTP traffic. (Range 1-65535, max 10 ports)"
                error={hasAttemptedSubmit && !!fieldErrors.httpPorts}
              >
                <VStack gap={2} className="w-full">
                  {values.httpPorts.map((port, index) => (
                    <HStack key={`http-port-${index}`} gap={2} align="center">
                      <Input
                        value={port}
                        onChange={(e) => updateHttpPort(index, e.target.value)}
                        placeholder="Port number"
                        width={120}
                        error={hasAttemptedSubmit && !!fieldErrors.httpPorts}
                      />
                      {values.httpPorts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHttpPortRow(index)}
                          className="flex items-center justify-center size-5 shrink-0 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-default)]"
                          aria-label="Remove port"
                        >
                          <IconX size={14} />
                        </button>
                      )}
                    </HStack>
                  ))}
                </VStack>
                {hasAttemptedSubmit && fieldErrors.httpPorts && (
                  <FormField.ErrorMessage>{fieldErrors.httpPorts}</FormField.ErrorMessage>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} />}
                  className="mt-2 w-fit"
                  disabled={values.httpPorts.length >= 10}
                  onClick={addHttpPortRow}
                >
                  Add port
                </Button>
              </FormField>

              <FormField
                label="Environment variables"
                description="Configure key-value environment variables required for application runtime, such as API keys and service endpoints."
              >
                <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-1 items-center">
                    <span className="text-label-sm text-[var(--color-text-subtle)]">Key</span>
                    <span className="text-label-sm text-[var(--color-text-subtle)]">Value</span>
                    <div />
                    {values.envVars.map((row) => (
                      <EnvVarGridRow
                        key={row.id}
                        row={row}
                        onKeyChange={(v) => updateEnvRow(row.id, 'key', v)}
                        onValueChange={(v) => updateEnvRow(row.id, 'value', v)}
                        onRemove={() => removeEnvRow(row.id)}
                        canRemove={values.envVars.length > 1}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} />}
                  className="mt-2 w-fit"
                  onClick={addEnvRow}
                >
                  Add variable
                </Button>
              </FormField>
            </VStack>
          </SectionCard.Content>
        </SectionCard>
      </div>

      <FloatingCard
        title="Summary"
        sections={summarySections}
        cancelLabel="Cancel"
        actionLabel={submitLabel}
        actionEnabled={allSectionsDone && !submitBlocked}
        onCancel={onCancel}
        onAction={handleSubmit}
        portal={false}
        width="312px"
      />
    </HStack>
  );
}

function EnvVarGridRow({
  row,
  onKeyChange,
  onValueChange,
  onRemove,
  canRemove,
}: {
  row: { id: string; key: string; value: string };
  onKeyChange: (v: string) => void;
  onValueChange: (v: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <>
      <Input value={row.key} onChange={(e) => onKeyChange(e.target.value)} fullWidth />
      <Input value={row.value} onChange={(e) => onValueChange(e.target.value)} fullWidth />
      {canRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-default)]"
          aria-label="Remove variable"
        >
          <IconX size={14} />
        </button>
      ) : (
        <div />
      )}
    </>
  );
}

export default MyTemplateForm;
