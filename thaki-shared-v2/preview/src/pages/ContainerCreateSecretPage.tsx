import { useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import {
  IconCheck,
  IconCirclePlus,
  IconFile,
  IconX,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

type SectionStep = 'basic-info' | 'data' | 'labels-annotations';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  data: 'Data',
  'labels-annotations': 'Labels & annotations',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'labels-annotations'];

const SECRET_TYPE_OPTIONS = [
  { value: 'custom', label: 'Custom Type' },
  { value: 'basic-auth', label: 'HTTP Basic Auth' },
  { value: 'opaque', label: 'Opaque' },
  { value: 'docker-registry', label: 'Registry' },
  { value: 'ssh-auth', label: 'SSH Key' },
  { value: 'tls', label: 'TLS Certificate' },
];

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

interface DataEntry {
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
  secretName: string;
  secretType: string;
  customType: string;
  dataEntries: DataEntry[];
  hasLabelsOrAnnotations: boolean;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  secretName,
  secretType,
  customType,
  dataEntries,
  hasLabelsOrAnnotations,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  const getSectionStatus = (section: SectionStep): 'done' | 'active' | 'pending' => {
    if (section === 'basic-info') {
      const hasValidBasicInfo = secretName.trim() && (secretType !== 'custom' || customType.trim());
      return hasValidBasicInfo ? 'done' : 'active';
    }
    if (section === 'data') {
      return dataEntries.length > 0 && dataEntries.some((e) => e.key.trim() || e.value.trim())
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
  isV2: boolean;
  secretType: string;
  onSecretTypeChange: (value: string) => void;
  customType: string;
  onCustomTypeChange: (value: string) => void;
  customTypeError: string | null;
  onCustomTypeErrorChange: (error: string | null) => void;
  secretName: string;
  onSecretNameChange: (value: string) => void;
  secretNameError: string | null;
  onSecretNameErrorChange: (error: string | null) => void;
  namespace: string;
  onNamespaceChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

function BasicInfoSection({
  isV2,
  secretType,
  onSecretTypeChange,
  customType,
  onCustomTypeChange,
  customTypeError,
  onCustomTypeErrorChange,
  secretName,
  onSecretNameChange,
  secretNameError,
  onSecretNameErrorChange,
  namespace,
  onNamespaceChange,
  description,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(true);

  return (
    <SectionShell title="Basic information">
      <FormField label="Secret Type" required hint="Create a Secret with a custom type">
        <Dropdown.Select value={secretType} onChange={(v) => onSecretTypeChange(String(v))}>
          {SECRET_TYPE_OPTIONS.map((o) => (
            <Dropdown.Option key={o.value} value={o.value} label={o.label} />
          ))}
        </Dropdown.Select>
      </FormField>

      {(isV2 || secretType === 'custom') && (
        <FormField label="Custom Type" required error={customTypeError ?? undefined}>
          <Input
            placeholder="Custom Type"
            value={customType}
            onChange={(e) => {
              onCustomTypeChange(e.target.value);
              if (customTypeError) onCustomTypeErrorChange(null);
            }}
            error={Boolean(customTypeError)}
            className="w-full"
          />
        </FormField>
      )}

      <FormField label="Namespace" required>
        <Dropdown.Select value={namespace} onChange={(v) => onNamespaceChange(String(v))}>
          {NAMESPACE_OPTIONS.map((o) => (
            <Dropdown.Option key={o.value} value={o.value} label={o.label} />
          ))}
        </Dropdown.Select>
      </FormField>

      <FormField label="Name" required error={secretNameError ?? undefined}>
        <Input
          placeholder="Enter a unique name"
          value={secretName}
          onChange={(e) => {
            onSecretNameChange(e.target.value);
            if (secretNameError) onSecretNameErrorChange(null);
          }}
          error={Boolean(secretNameError)}
          className="w-full"
        />
      </FormField>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex items-center gap-1.5 text-label-lg text-[var(--color-text-default)]"
          onClick={() => setDescriptionExpanded(!descriptionExpanded)}
        >
          {descriptionExpanded ? (
            <IconChevronDown size={16} stroke={1.5} />
          ) : (
            <IconChevronRight size={16} stroke={1.5} />
          )}
          Description
        </button>
        {descriptionExpanded && (
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full"
          />
        )}
      </div>
    </SectionShell>
  );
}

interface DataSectionProps {
  dataEntries: DataEntry[];
  onDataEntriesChange: (entries: DataEntry[]) => void;
  stringDataEntries: DataEntry[];
  onStringDataEntriesChange: (entries: DataEntry[]) => void;
  tlsDataEntries: DataEntry[];
  onTlsDataEntriesChange: (entries: DataEntry[]) => void;
  httpBasicAuthDataEntries: DataEntry[];
  onHttpBasicAuthDataEntriesChange: (entries: DataEntry[]) => void;
  registryDataEntries: DataEntry[];
  onRegistryDataEntriesChange: (entries: DataEntry[]) => void;
}

function DataSection({
  dataEntries,
  onDataEntriesChange,
  stringDataEntries,
  onStringDataEntriesChange,
  tlsDataEntries,
  onTlsDataEntriesChange,
  httpBasicAuthDataEntries,
  onHttpBasicAuthDataEntriesChange,
  registryDataEntries,
  onRegistryDataEntriesChange,
}: DataSectionProps) {
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

  const updateStringDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...stringDataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onStringDataEntriesChange(newEntries);
  };

  const updateTlsDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...tlsDataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onTlsDataEntriesChange(newEntries);
  };

  const updateHttpBasicAuthDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...httpBasicAuthDataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onHttpBasicAuthDataEntriesChange(newEntries);
  };

  const updateRegistryDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...registryDataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onRegistryDataEntriesChange(newEntries);
  };

  return (
    <SectionShell title="Data">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-md italic text-[var(--color-text-subtle)]">
            Custom type, Opaque
          </span>
          <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
        </div>

        <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            {dataEntries.length > 0 && (
              <div className="grid w-full grid-cols-[1fr_1fr_20px] gap-1">
                <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
                <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
                <div className="w-5" />
              </div>
            )}
            {dataEntries.map((entry, index) => (
              <div key={index} className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-1">
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
                  className="flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
                >
                  <IconX size={14} className="text-[var(--color-text-muted)]" />
                </button>
              </div>
            ))}

            <div className="flex gap-1">
              <Button variant="secondary" size="sm" onClick={addDataEntry}>
                <span className="inline-flex items-center gap-1">
                  <IconCirclePlus size={12} />
                  Add Data Entry
                </span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  console.log('Read from file clicked');
                }}
              >
                <span className="inline-flex items-center gap-1">
                  <IconFile size={12} />
                  Read from File
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-md italic text-[var(--color-text-subtle)]">SSH Key</span>
          <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
        </div>

        <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            {stringDataEntries.length > 0 && (
              <div className="grid w-full grid-cols-[1fr_1fr] gap-1">
                <span className="block text-label-sm text-[var(--color-text-default)]">
                  Public key<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>
                <span className="block text-label-sm text-[var(--color-text-default)]">
                  Private key<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>
              </div>
            )}
            {stringDataEntries.map((entry, index) => (
              <div key={index} className="grid w-full grid-cols-[1fr_1fr] items-center gap-1">
                <Input
                  placeholder="Enter key"
                  value={entry.key}
                  onChange={(e) => updateStringDataEntry(index, 'key', e.target.value)}
                  className="w-full"
                />
                <Input
                  placeholder="Enter value"
                  value={entry.value}
                  onChange={(e) => updateStringDataEntry(index, 'value', e.target.value)}
                  className="w-full"
                />
              </div>
            ))}

            <div className="grid w-full grid-cols-[1fr_1fr] gap-1">
              <div className="w-fit">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    console.log('Read from file clicked');
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <IconFile size={12} />
                    Read from File
                  </span>
                </Button>
              </div>
              <div className="w-fit">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    console.log('Read from file clicked');
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <IconFile size={12} />
                    Read from File
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-md italic text-[var(--color-text-subtle)]">
            TLS Certificate
          </span>
          <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
        </div>

        <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            {tlsDataEntries.length > 0 && (
              <div className="grid w-full grid-cols-[1fr_1fr] gap-1">
                <span className="block text-label-sm text-[var(--color-text-default)]">
                  Private key<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>
                <span className="block text-label-sm text-[var(--color-text-default)]">
                  Certificate<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>
              </div>
            )}
            {tlsDataEntries.map((entry, index) => (
              <div key={index} className="grid w-full grid-cols-[1fr_1fr] items-center gap-1">
                <Input
                  placeholder="Enter key"
                  value={entry.key}
                  onChange={(e) => updateTlsDataEntry(index, 'key', e.target.value)}
                  className="w-full"
                />
                <Input
                  placeholder="Enter value"
                  value={entry.value}
                  onChange={(e) => updateTlsDataEntry(index, 'value', e.target.value)}
                  className="w-full"
                />
              </div>
            ))}

            <div className="grid w-full grid-cols-[1fr_1fr] gap-1">
              <div className="w-fit">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    console.log('Read from file clicked');
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <IconFile size={12} />
                    Read from File
                  </span>
                </Button>
              </div>
              <div className="w-fit">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    console.log('Read from file clicked');
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <IconFile size={12} />
                    Read from File
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-md italic text-[var(--color-text-subtle)]">
            HTTP Basic Auth
          </span>
          <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
        </div>

        <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            {httpBasicAuthDataEntries.length > 0 && (
              <div className="grid w-full grid-cols-[1fr_1fr] gap-1">
                <span className="block text-label-sm text-[var(--color-text-default)]">
                  Username<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>
                <span className="block text-label-sm text-[var(--color-text-default)]">
                  Password<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>
              </div>
            )}
            {httpBasicAuthDataEntries.map((entry, index) => (
              <div key={index} className="grid w-full grid-cols-[1fr_1fr] items-center gap-1">
                <Input
                  placeholder="Enter key"
                  value={entry.key}
                  onChange={(e) => updateHttpBasicAuthDataEntry(index, 'key', e.target.value)}
                  className="w-full"
                />
                <Input
                  placeholder="Enter value"
                  value={entry.value}
                  onChange={(e) => updateHttpBasicAuthDataEntry(index, 'value', e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-md italic text-[var(--color-text-subtle)]">Registry</span>
          <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
        </div>

        <div className="w-full rounded-[6px] bg-[var(--color-surface-subtle)] px-4 py-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="block text-label-sm text-[var(--color-text-default)]">
                Registry domain name
                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
              </span>
              <Input placeholder="Enter registry domain name" className="w-full" />
            </div>

            <div className="flex flex-col gap-2">
              {registryDataEntries.length > 0 && (
                <div className="grid w-full grid-cols-[1fr_1fr] gap-1">
                  <span className="block text-label-sm text-[var(--color-text-default)]">
                    Username<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                  </span>
                  <span className="block text-label-sm text-[var(--color-text-default)]">
                    Password<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                  </span>
                </div>
              )}
              {registryDataEntries.map((entry, index) => (
                <div key={index} className="grid w-full grid-cols-[1fr_1fr] items-center gap-1">
                  <Input
                    placeholder="Enter key"
                    value={entry.key}
                    onChange={(e) => updateRegistryDataEntry(index, 'key', e.target.value)}
                    className="w-full"
                  />
                  <Input
                    placeholder="Enter value"
                    value={entry.value}
                    onChange={(e) => updateRegistryDataEntry(index, 'value', e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
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
                  className="flex size-5 items-center justify-center rounded transition-colors hover:bg-[var(--color-surface-muted)]"
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
                onClick={onAddLabel}
                className="bg-[var(--color-surface-default)]"
              >
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
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                onClick={onAddAnnotation}
                className="bg-[var(--color-surface-default)]"
              >
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

export function ContainerCreateSecretPage() {
  const navigate = useNavigate();
  const isV2 = true;

  const [secretType, setSecretType] = useState(isV2 ? 'custom' : 'opaque');
  const [customType, setCustomType] = useState('');
  const [customTypeError, setCustomTypeError] = useState<string | null>(null);
  const [secretName, setSecretName] = useState('');
  const [secretNameError, setSecretNameError] = useState<string | null>(null);
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  const [dataEntries, setDataEntries] = useState<DataEntry[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [stringDataEntries, setStringDataEntries] = useState<DataEntry[]>([{ key: '', value: '' }]);
  const [tlsDataEntries, setTlsDataEntries] = useState<DataEntry[]>([{ key: '', value: '' }]);
  const [httpBasicAuthDataEntries, setHttpBasicAuthDataEntries] = useState<DataEntry[]>([
    { key: '', value: '' },
  ]);
  const [registryDataEntries, setRegistryDataEntries] = useState<DataEntry[]>([
    { key: '', value: '' },
  ]);

  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  const handleCancel = useCallback(() => {
    navigate('/container/secrets');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    let hasError = false;

    if (!secretName.trim()) {
      setSecretNameError('Secret name is required.');
      hasError = true;
    }

    if (secretType === 'custom' && !customType.trim()) {
      setCustomTypeError('Custom type is required.');
      hasError = true;
    }

    if (hasError) return;

    console.log('Creating secret:', {
      secretType,
      customType: secretType === 'custom' ? customType : undefined,
      secretName,
      namespace,
      description,
      data: dataEntries.reduce(
        (acc, entry) => {
          if (entry.key) acc[entry.key] = entry.value;
          return acc;
        },
        {} as Record<string, string>
      ),
      labels,
      annotations,
    });
    navigate('/container/secrets');
  }, [
    secretType,
    customType,
    secretName,
    namespace,
    description,
    dataEntries,
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

  const isCreateDisabled = !secretName.trim() || (secretType === 'custom' && !customType.trim());

  const hasLabelsOrAnnotations =
    labels.some((l) => l.key.trim() || l.value.trim()) ||
    annotations.some((a) => a.key.trim() || a.value.trim());

  return (
    <div className="flex flex-col gap-6 px-8 pb-6 pt-4">
      <div className="flex flex-col gap-2">
        <Title title="Create secret" size="medium" />
        <p className="text-body-md text-[var(--color-text-subtle)]">
          Secret is a Kubernetes resource used to securely store sensitive information such as
          passwords, tokens, and certificates for use by Pods.
        </p>
      </div>

      <div className="flex w-full items-start gap-6">
        <div className="flex flex-1 flex-col gap-4">
          <BasicInfoSection
            isV2={isV2}
            secretType={secretType}
            onSecretTypeChange={setSecretType}
            customType={customType}
            onCustomTypeChange={setCustomType}
            customTypeError={customTypeError}
            onCustomTypeErrorChange={setCustomTypeError}
            secretName={secretName}
            onSecretNameChange={setSecretName}
            secretNameError={secretNameError}
            onSecretNameErrorChange={setSecretNameError}
            namespace={namespace}
            onNamespaceChange={setNamespace}
            description={description}
            onDescriptionChange={setDescription}
          />

          <DataSection
            dataEntries={dataEntries}
            onDataEntriesChange={setDataEntries}
            stringDataEntries={stringDataEntries}
            onStringDataEntriesChange={setStringDataEntries}
            tlsDataEntries={tlsDataEntries}
            onTlsDataEntriesChange={setTlsDataEntries}
            httpBasicAuthDataEntries={httpBasicAuthDataEntries}
            onHttpBasicAuthDataEntriesChange={setHttpBasicAuthDataEntries}
            registryDataEntries={registryDataEntries}
            onRegistryDataEntriesChange={setRegistryDataEntries}
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
          secretName={secretName}
          secretType={secretType}
          customType={customType}
          dataEntries={dataEntries}
          hasLabelsOrAnnotations={hasLabelsOrAnnotations}
          onCancel={handleCancel}
          onCreate={handleCreate}
          isCreateDisabled={isCreateDisabled}
        />
      </div>
    </div>
  );
}

export default ContainerCreateSecretPage;
