import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsV2 } from '@/hooks/useIsV2';
import {
  Button,
  Breadcrumb,
  FormField,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  Select,
  SectionCard,
  PageShell,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconCirclePlus,
  IconX,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'data' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  data: 'Data',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'labels-annotations'];

// Secret type options
const SECRET_TYPE_OPTIONS = [
  { value: 'custom', label: 'Custom Type' },
  { value: 'basic-auth', label: 'HTTP Basic Auth' },
  { value: 'opaque', label: 'Opaque' },
  { value: 'docker-registry', label: 'Registry' },
  { value: 'ssh-auth', label: 'SSH Key' },
  { value: 'tls', label: 'TLS Certificate' },
];

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

interface DataEntry {
  key: string;
  value: string;
}

/* ----------------------------------------
   Summary Status Icon Component
   ---------------------------------------- */

function SummaryStatusIcon({ status }: { status: 'done' | 'active' | 'pending' }) {
  // done → success (green check)
  if (status === 'done') {
    return (
      <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center">
        <IconCheck size={10} stroke={2} className="text-white" />
      </div>
    );
  }
  // active → dashed circle with spinning animation
  if (status === 'active') {
    return (
      <div
        className="size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }
  // pre/default → empty dashed circle
  return (
    <div
      className="size-4 rounded-full border border-[var(--color-border-default)] shrink-0"
      style={{ borderStyle: 'dashed' }}
    />
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

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
  // Determine section status based on form data
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
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Inner subtle-bg container */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={4}>
            <span className="text-heading-h5">Summary</span>
            <VStack gap={0}>
              {SECTION_ORDER.map((step) => (
                <HStack key={step} justify="between" className="py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {SECTION_LABELS[step]}
                  </span>
                  <SummaryStatusIcon status={getSectionStatus(step)} />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </div>

        {/* Button row */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCreate}
            disabled={isCreateDisabled}
            className="flex-1"
          >
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   BasicInfoSection Component
   ---------------------------------------- */

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
    <SectionCard className="pb-6">
      <SectionCard.Header title="Basic information" showDivider />
      <SectionCard.Content className="pt-3">
        <VStack gap={8}>
          {/* Secret Type */}
          <FormField required>
            <FormField.Label>Secret Type</FormField.Label>
            <FormField.Control>
              <Select
                options={SECRET_TYPE_OPTIONS}
                value={secretType}
                onChange={onSecretTypeChange}
                fullWidth
              />
            </FormField.Control>
            <FormField.HelperText>Create a Secret with a custom type</FormField.HelperText>
          </FormField>

          {/* Custom Type (shown when Secret Type is "custom") */}
          {(isV2 || secretType === 'custom') && (
            <FormField required error={!!customTypeError}>
              <FormField.Label>Custom Type</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Custom Type"
                  value={customType}
                  onChange={(e) => {
                    onCustomTypeChange(e.target.value);
                    if (customTypeError) onCustomTypeErrorChange(null);
                  }}
                  fullWidth
                />
              </FormField.Control>
              <FormField.ErrorMessage>{customTypeError}</FormField.ErrorMessage>
            </FormField>
          )}

          {/* Namespace */}
          <FormField required>
            <FormField.Label>Namespace</FormField.Label>
            <FormField.Control>
              <Select
                options={NAMESPACE_OPTIONS}
                value={namespace}
                onChange={onNamespaceChange}
                fullWidth
              />
            </FormField.Control>
          </FormField>

          {/* Name */}
          <FormField required error={!!secretNameError}>
            <FormField.Label>Name</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="Enter a unique name"
                value={secretName}
                onChange={(e) => {
                  onSecretNameChange(e.target.value);
                  if (secretNameError) onSecretNameErrorChange(null);
                }}
                fullWidth
              />
            </FormField.Control>
            <FormField.ErrorMessage>{secretNameError}</FormField.ErrorMessage>
          </FormField>

          {/* Description - Collapsible */}
          <VStack gap={3}>
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
                fullWidth
              />
            )}
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   DataSection Component
   ---------------------------------------- */

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

  const addStringDataEntry = () => {
    onStringDataEntriesChange([...stringDataEntries, { key: '', value: '' }]);
  };

  const removeStringDataEntry = (index: number) => {
    onStringDataEntriesChange(stringDataEntries.filter((_, i) => i !== index));
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

  const removeTlsDataEntry = (index: number) => {
    onTlsDataEntriesChange(tlsDataEntries.filter((_, i) => i !== index));
  };

  const updateHttpBasicAuthDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...httpBasicAuthDataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onHttpBasicAuthDataEntriesChange(newEntries);
  };

  const removeHttpBasicAuthDataEntry = (index: number) => {
    onHttpBasicAuthDataEntriesChange(httpBasicAuthDataEntries.filter((_, i) => i !== index));
  };

  const updateRegistryDataEntry = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...registryDataEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onRegistryDataEntriesChange(newEntries);
  };

  const removeRegistryDataEntry = (index: number) => {
    onRegistryDataEntriesChange(registryDataEntries.filter((_, i) => i !== index));
  };

  return (
    <SectionCard className="pb-6">
      <SectionCard.Header title="Data" showDivider />
      <SectionCard.Content className="pt-3">
        <VStack gap={8}>
          {/* Data */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-body-md text-[var(--color-text-subtle)] italic">
                Custom type, Opaque
              </span>
              <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={1}>
                {dataEntries.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Key
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value
                    </span>
                    <div className="w-5" />
                  </div>
                )}
                {dataEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                  >
                    <Input
                      placeholder="Enter key"
                      value={entry.key}
                      onChange={(e) => updateDataEntry(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Enter value"
                      value={entry.value}
                      onChange={(e) => updateDataEntry(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => removeDataEntry(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                    >
                      <IconX size={14} className="text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                ))}

                <HStack gap={2}>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} />}
                    onClick={addDataEntry}
                  >
                    Add Data Entry
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconFile size={12} />}
                    onClick={() => {
                      console.log('Read from file clicked');
                    }}
                  >
                    Read from File
                  </Button>
                </HStack>
              </VStack>
            </div>
          </VStack>

          {/* String Data */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-body-md text-[var(--color-text-subtle)] italic">SSH Key</span>
              <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={1}>
                {stringDataEntries.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Public key<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Private key<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                    </span>
                  </div>
                )}
                {stringDataEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
                    <Input
                      placeholder="Enter key"
                      value={entry.key}
                      onChange={(e) => updateStringDataEntry(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Enter value"
                      value={entry.value}
                      onChange={(e) => updateStringDataEntry(index, 'value', e.target.value)}
                      fullWidth
                    />
                  </div>
                ))}

                <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                  <div className="w-fit">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconFile size={12} />}
                      onClick={() => {
                        console.log('Read from file clicked');
                      }}
                    >
                      Read from File
                    </Button>
                  </div>
                  <div className="w-fit">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconFile size={12} />}
                      onClick={() => {
                        console.log('Read from file clicked');
                      }}
                    >
                      Read from File
                    </Button>
                  </div>
                </div>
              </VStack>
            </div>
          </VStack>

          {/* TLS Certificate Data */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-body-md text-[var(--color-text-subtle)] italic">
                TLS Certificate
              </span>
              <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={1}>
                {tlsDataEntries.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Private key<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Certificate<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                    </span>
                  </div>
                )}
                {tlsDataEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
                    <Input
                      placeholder="Enter key"
                      value={entry.key}
                      onChange={(e) => updateTlsDataEntry(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Enter value"
                      value={entry.value}
                      onChange={(e) => updateTlsDataEntry(index, 'value', e.target.value)}
                      fullWidth
                    />
                  </div>
                ))}

                <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                  <div className="w-fit">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconFile size={12} />}
                      onClick={() => {
                        console.log('Read from file clicked');
                      }}
                    >
                      Read from File
                    </Button>
                  </div>
                  <div className="w-fit">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconFile size={12} />}
                      onClick={() => {
                        console.log('Read from file clicked');
                      }}
                    >
                      Read from File
                    </Button>
                  </div>
                </div>
              </VStack>
            </div>
          </VStack>

          {/* HTTP Basic Auth Data */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-body-md text-[var(--color-text-subtle)] italic">
                HTTP Basic Auth
              </span>
              <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={1}>
                {httpBasicAuthDataEntries.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Username<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Password<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                    </span>
                  </div>
                )}
                {httpBasicAuthDataEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
                    <Input
                      placeholder="Enter key"
                      value={entry.key}
                      onChange={(e) => updateHttpBasicAuthDataEntry(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Enter value"
                      value={entry.value}
                      onChange={(e) => updateHttpBasicAuthDataEntry(index, 'value', e.target.value)}
                      fullWidth
                    />
                  </div>
                ))}
              </VStack>
            </div>
          </VStack>

          {/* Registry Data */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-body-md text-[var(--color-text-subtle)] italic">Registry</span>
              <span className="text-label-lg text-[var(--color-text-default)]">Data</span>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={3}>
                <VStack gap={1}>
                  <span className="block text-label-sm text-[var(--color-text-default)]">
                    Registry domain name
                    <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                  </span>
                  <Input placeholder="Enter registry domain name" fullWidth />
                </VStack>

                <VStack gap={2}>
                  {registryDataEntries.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr] gap-2 w-full">
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Username<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                      </span>
                      <span className="block text-label-sm text-[var(--color-text-default)]">
                        Password<span className="ml-1 text-[var(--color-state-danger)]">*</span>
                      </span>
                    </div>
                  )}
                  {registryDataEntries.map((entry, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
                      <Input
                        placeholder="Enter key"
                        value={entry.key}
                        onChange={(e) => updateRegistryDataEntry(index, 'key', e.target.value)}
                        fullWidth
                      />
                      <Input
                        placeholder="Enter value"
                        value={entry.value}
                        onChange={(e) => updateRegistryDataEntry(index, 'value', e.target.value)}
                        fullWidth
                      />
                    </div>
                  ))}
                </VStack>
              </VStack>
            </div>
          </VStack>
        </VStack>
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
    <SectionCard className="pb-6">
      <SectionCard.Header title="Labels & Annotations" showDivider />
      <SectionCard.Content className="pt-3">
        <VStack gap={8}>
          {/* Labels */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={1}>
                {labels.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
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
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={label.key}
                      onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Value"
                      value={label.value}
                      onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => onRemoveLabel(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddLabel}
                    className="bg-[var(--color-surface-default)]"
                  >
                    Add Label
                  </Button>
                </div>
              </VStack>
            </div>
          </VStack>

          {/* Annotations */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={1}>
                {annotations.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
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
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={annotation.key}
                      onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Value"
                      value={annotation.value}
                      onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => onRemoveAnnotation(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddAnnotation}
                    className="bg-[var(--color-surface-default)]"
                  >
                    Add Annotation
                  </Button>
                </div>
              </VStack>
            </div>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateSecretPage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [secretType, setSecretType] = useState(isV2 ? 'custom' : 'opaque');
  const [customType, setCustomType] = useState('');
  const [customTypeError, setCustomTypeError] = useState<string | null>(null);
  const [secretName, setSecretName] = useState('');
  const [secretNameError, setSecretNameError] = useState<string | null>(null);
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Data state
  const [dataEntries, setDataEntries] = useState<DataEntry[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [stringDataEntries, setStringDataEntries] = useState<DataEntry[]>([{ key: '', value: '' }]);
  const [tlsDataEntries, setTlsDataEntries] = useState<DataEntry[]>([{ key: '', value: '' }]);
  const [httpBasicAuthDataEntries, setHttpBasicAuthDataEntries] = useState<DataEntry[]>([
    { key: '', value: '' },
  ]);
  const [registryDataEntries, setRegistryDataEntries] = useState<DataEntry[]>([
    { key: '', value: '' },
  ]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Secret');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/secrets');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    let hasError = false;

    // Validate secret name
    if (!secretName.trim()) {
      setSecretNameError('Secret name is required.');
      hasError = true;
    }

    // Validate custom type if secret type is custom
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
  const isCreateDisabled = !secretName.trim() || (secretType === 'custom' && !customType.trim());

  // Check if labels or annotations have data
  const hasLabelsOrAnnotations =
    labels.some((l) => l.key.trim() || l.value.trim()) ||
    annotations.some((a) => a.key.trim() || a.value.trim());

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Secrets', href: '/container/secrets' },
                { label: 'Create secret' },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={2}>
          <div className="flex items-center justify-between h-8">
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create Secret</h1>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Secret is a Kubernetes resource used to securely store sensitive information such as
            passwords, tokens, and certificates for use by Pods.
          </p>
        </VStack>

        {/* Main Content with Sidebar */}
        <HStack gap={6} align="start" className="w-full">
          {/* Form Content */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information Section */}
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

            {/* Data Section */}
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

            {/* Labels & Annotations Section */}
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
          </VStack>

          {/* Summary Sidebar */}
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
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateSecretPage;
