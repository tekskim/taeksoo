import { useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { IconCheck, IconCirclePlus, IconFile, IconX } from '@tabler/icons-react';

type SectionStep = 'basic-info' | 'data' | 'binary-data' | 'labels-annotations';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  data: 'Data',
  'binary-data': 'Binary Data',
  'labels-annotations': 'Labels & Annotations',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'binary-data', 'labels-annotations'];

interface Label {
  key: string;
  value: string;
}

interface Annotation {
  key: string;
  value: string;
}

interface DataEntry {
  key: string;
  value: string;
}

interface BinaryDataEntry {
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
  configMapName: string;
  dataEntries: DataEntry[];
  binaryDataEntries: BinaryDataEntry[];
  hasLabelsOrAnnotations: boolean;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  configMapName,
  dataEntries,
  binaryDataEntries,
  hasLabelsOrAnnotations,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  const getSectionStatus = (section: SectionStep): 'done' | 'active' | 'pending' => {
    if (section === 'basic-info') {
      return configMapName.trim() ? 'done' : 'active';
    }
    if (section === 'data') {
      return dataEntries.length > 0 && dataEntries.some((e) => e.key.trim() || e.value.trim())
        ? 'done'
        : 'pending';
    }
    if (section === 'binary-data') {
      return binaryDataEntries.length > 0 &&
        binaryDataEntries.some((e) => e.key.trim() || e.value.trim())
        ? 'done'
        : 'pending';
    }
    if (section === 'labels-annotations') {
      return hasLabelsOrAnnotations ? 'done' : 'pending';
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
  configMapName: string;
  onConfigMapNameChange: (value: string) => void;
  configMapNameError: string | null;
  onConfigMapNameErrorChange: (error: string | null) => void;
  namespace: string;
  onNamespaceChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  isV2: boolean;
}

function BasicInfoSection({
  configMapName,
  onConfigMapNameChange,
  configMapNameError,
  onConfigMapNameErrorChange,
  namespace,
  onNamespaceChange,
  description,
  onDescriptionChange,
  isV2,
}: BasicInfoSectionProps) {
  return (
    <SectionShell title="Basic information">
      <FormField label="Namespace" required>
        <Input
          placeholder="Enter namespace"
          value={namespace}
          onChange={(e) => onNamespaceChange(e.target.value)}
          className="w-full"
        />
      </FormField>

      <FormField label="Name" required error={configMapNameError ?? undefined}>
        <Input
          placeholder="Enter a unique name"
          value={configMapName}
          onChange={(e) => {
            onConfigMapNameChange(e.target.value);
            if (configMapNameError) onConfigMapNameErrorChange(null);
          }}
          error={Boolean(configMapNameError)}
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

interface DataSectionProps {
  dataEntries: DataEntry[];
  onDataEntriesChange: (entries: DataEntry[]) => void;
}

function DataSection({ dataEntries, onDataEntriesChange }: DataSectionProps) {
  const addDataEntry = () => {
    onDataEntriesChange([...dataEntries, { key: '', value: '' }]);
  };

  const removeDataEntry = (index: number) => {
    onDataEntriesChange(dataEntries.filter((_, i) => i !== index));
  };

  const updateDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...dataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onDataEntriesChange(newEntries);
  };

  return (
    <SectionShell title="Data">
      <div className="flex flex-col gap-2">
        <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
        <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            {dataEntries.length > 0 && (
              <div className="flex w-full flex-col gap-2">
                <div className="grid grid-cols-[1fr_1fr_23px] gap-1">
                  <span className="text-label-sm leading-[16.5px] text-[var(--color-text-default)]">
                    Key
                  </span>
                  <span className="text-label-sm leading-[16.5px] text-[var(--color-text-default)]">
                    Value
                  </span>
                  <div className="w-5" />
                </div>
                {dataEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_23px] items-center gap-1">
                    <Input
                      placeholder="Enter key"
                      value={entry.key}
                      onChange={(e) => updateDataEntry(index, 'key', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="Enter value"
                      value={entry.value}
                      onChange={(e) => updateDataEntry(index, 'value', e.target.value)}
                      className="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeDataEntry(index)}
                      className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-1">
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                onClick={addDataEntry}
                className="bg-[var(--color-surface-default)]"
              >
                <span className="inline-flex items-center gap-1">
                  <IconCirclePlus size={12} stroke={1.5} />
                  Add Data Entry
                </span>
              </Button>
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                onClick={() => {
                  console.log('Read from file clicked');
                }}
                className="bg-[var(--color-surface-default)]"
              >
                <span className="inline-flex items-center gap-1">
                  <IconFile size={12} stroke={1.5} />
                  Read from File
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

interface BinaryDataSectionProps {
  binaryDataEntries: BinaryDataEntry[];
  onBinaryDataEntriesChange: (entries: BinaryDataEntry[]) => void;
}

function BinaryDataSection({
  binaryDataEntries,
  onBinaryDataEntriesChange,
}: BinaryDataSectionProps) {
  const addBinaryDataEntry = () => {
    onBinaryDataEntriesChange([...binaryDataEntries, { key: '', value: '' }]);
  };

  const removeBinaryDataEntry = (index: number) => {
    onBinaryDataEntriesChange(binaryDataEntries.filter((_, i) => i !== index));
  };

  const updateBinaryDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...binaryDataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onBinaryDataEntriesChange(newEntries);
  };

  return (
    <SectionShell title="Binary data">
      <div className="flex flex-col gap-2">
        <span className="text-label-lg text-[var(--color-text-default)]">Binary data</span>
        <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            {binaryDataEntries.length > 0 && (
              <div className="flex w-full flex-col gap-2">
                <div className="grid grid-cols-[1fr_1fr_23px] gap-1">
                  <span className="text-label-sm leading-[16.5px] text-[var(--color-text-default)]">
                    Key
                  </span>
                  <span className="text-label-sm leading-[16.5px] text-[var(--color-text-default)]">
                    Value
                  </span>
                  <div className="w-5" />
                </div>
                {binaryDataEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_23px] items-center gap-1">
                    <Input
                      placeholder="Enter key"
                      value={entry.key}
                      onChange={(e) => updateBinaryDataEntry(index, 'key', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="Enter value"
                      value={entry.value}
                      onChange={(e) => updateBinaryDataEntry(index, 'value', e.target.value)}
                      className="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeBinaryDataEntry(index)}
                      className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-1">
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                onClick={addBinaryDataEntry}
                className="bg-[var(--color-surface-default)]"
              >
                <span className="inline-flex items-center gap-1">
                  <IconCirclePlus size={12} stroke={1.5} />
                  Add Data Entry
                </span>
              </Button>
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                onClick={() => {
                  console.log('Read from file clicked');
                }}
                className="bg-[var(--color-surface-default)]"
              >
                <span className="inline-flex items-center gap-1">
                  <IconFile size={12} stroke={1.5} />
                  Read from File
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
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
    <SectionShell title="Labels & Annotations">
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
                <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
                <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
                <div className="w-5" />
              </div>
            )}
            {labels.map((label, index) => (
              <div key={index} className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1">
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
                  <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </div>
            ))}

            <div className="w-fit">
              <Button variant="secondary" size="sm" onClick={onAddLabel}>
                <span className="inline-flex items-center gap-1">
                  <IconCirclePlus size={12} stroke={1.5} />
                  Add Label
                </span>
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
                <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
                <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
                <div className="w-5" />
              </div>
            )}
            {annotations.map((annotation, index) => (
              <div key={index} className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1">
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
                  className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                >
                  <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </div>
            ))}
            <div className="w-fit">
              <Button variant="secondary" size="sm" onClick={onAddAnnotation}>
                <span className="inline-flex items-center gap-1">
                  <IconCirclePlus size={12} stroke={1.5} />
                  Add Annotation
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function ContainerCreateConfigMapPage() {
  const navigate = useNavigate();
  const isV2 = true;

  const [configMapName, setConfigMapName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  const [dataEntries, setDataEntries] = useState<DataEntry[]>(isV2 ? [{ key: '', value: '' }] : []);

  const [binaryDataEntries, setBinaryDataEntries] = useState<BinaryDataEntry[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  const [configMapNameError, setConfigMapNameError] = useState<string | null>(null);

  const handleCancel = useCallback(() => {
    navigate('/container/configmaps');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!configMapName.trim()) {
      setConfigMapNameError('ConfigMap name is required.');
      return;
    }

    console.log('Creating configmap:', {
      configMapName,
      namespace,
      description,
      data: dataEntries.reduce(
        (acc, entry) => {
          if (entry.key) acc[entry.key] = entry.value;
          return acc;
        },
        {} as Record<string, string>
      ),
      binaryData: binaryDataEntries.reduce(
        (acc, entry) => {
          if (entry.key) acc[entry.key] = entry.value;
          return acc;
        },
        {} as Record<string, string>
      ),
      labels,
      annotations,
    });
    navigate('/container/configmaps');
  }, [
    configMapName,
    namespace,
    description,
    dataEntries,
    binaryDataEntries,
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

  const isCreateDisabled = !configMapName.trim();

  const hasLabelsOrAnnotations =
    labels.some((l) => l.key.trim() || l.value.trim()) ||
    annotations.some((a) => a.key.trim() || a.value.trim());

  return (
    <div className="flex flex-col gap-6 px-8 pb-20 pt-4">
      <div className="flex flex-col gap-2">
        <Title title="Create ConfigMap" size="medium" />
        <p className="text-body-md text-[var(--color-text-subtle)]">
          ConfigMap provide configuration data as key–value pairs so applications can load settings
          without changing container images.
        </p>
      </div>

      <div className="flex w-full items-start gap-6">
        <div className="flex flex-1 flex-col gap-4">
          <BasicInfoSection
            configMapName={configMapName}
            onConfigMapNameChange={setConfigMapName}
            configMapNameError={configMapNameError}
            onConfigMapNameErrorChange={setConfigMapNameError}
            namespace={namespace}
            onNamespaceChange={setNamespace}
            description={description}
            onDescriptionChange={setDescription}
            isV2={isV2}
          />

          <DataSection dataEntries={dataEntries} onDataEntriesChange={setDataEntries} />

          <BinaryDataSection
            binaryDataEntries={binaryDataEntries}
            onBinaryDataEntriesChange={setBinaryDataEntries}
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

        <SummarySidebar
          configMapName={configMapName}
          dataEntries={dataEntries}
          binaryDataEntries={binaryDataEntries}
          hasLabelsOrAnnotations={hasLabelsOrAnnotations}
          onCancel={handleCancel}
          onCreate={handleCreate}
          isCreateDisabled={isCreateDisabled}
        />
      </div>
    </div>
  );
}

export default ContainerCreateConfigMapPage;
