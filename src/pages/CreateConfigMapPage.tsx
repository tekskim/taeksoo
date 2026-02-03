import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  Disclosure,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  SectionCard,
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
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'data' | 'binary-data' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  data: 'Data',
  'binary-data': 'Binary Data',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
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
  // Determine section status based on form data
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
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
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
  configMapName: string;
  onConfigMapNameChange: (value: string) => void;
  configMapNameError: string | null;
  onConfigMapNameErrorChange: (error: string | null) => void;
  namespace: string;
  onNamespaceChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
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
}: BasicInfoSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Basic Information" showDivider />
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Namespace */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
              Namespace<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Input
              placeholder="Enter namespace"
              value={namespace}
              onChange={(e) => onNamespaceChange(e.target.value)}
              fullWidth
            />
          </VStack>

          {/* Name */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
              Name<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Input
              placeholder="Enter a unique name"
              value={configMapName}
              onChange={(e) => {
                onConfigMapNameChange(e.target.value);
                if (configMapNameError) onConfigMapNameErrorChange(null);
              }}
              error={!!configMapNameError}
              fullWidth
            />
            {configMapNameError && (
              <span className="text-body-sm text-[var(--color-state-danger)]">
                {configMapNameError}
              </span>
            )}
          </VStack>

          {/* Description */}
          <Disclosure>
            <Disclosure.Trigger>Description</Disclosure.Trigger>
            <Disclosure.Panel className="pt-2">
              <Input
                placeholder="Enter a description (optional)"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                fullWidth
              />
            </Disclosure.Panel>
          </Disclosure>
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
    <SectionCard>
      <SectionCard.Header title="Data" showDivider />
      <SectionCard.Content>
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
          <VStack gap={3}>
            {/* Data Entries */}
            {dataEntries.length > 0 && (
              <VStack gap={2} className="w-full">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_1fr_23px] gap-2">
                  <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                    Key
                  </span>
                  <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                    Value
                  </span>
                  <div />
                </div>
                {dataEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_23px] gap-2 items-center">
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
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
              </VStack>
            )}

            <HStack gap={2}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                onClick={addDataEntry}
                className="bg-white"
              >
                Add Data Entry
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconFile size={12} stroke={1.5} />}
                onClick={() => {
                  // TODO: Implement file reading functionality
                  console.log('Read from file clicked');
                }}
                className="bg-white"
              >
                Read from File
              </Button>
            </HStack>
          </VStack>
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   BinaryDataSection Component
   ---------------------------------------- */

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
    <SectionCard>
      <SectionCard.Header title="Binary Data" showDivider />
      <SectionCard.Content>
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
          <VStack gap={3}>
            {/* Binary Data Entries */}
            {binaryDataEntries.length > 0 && (
              <VStack gap={2} className="w-full">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_1fr_23px] gap-2">
                  <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                    Key
                  </span>
                  <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                    Value
                  </span>
                  <div />
                </div>
                {binaryDataEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_23px] gap-2 items-center">
                    <Input
                      placeholder="Enter key"
                      value={entry.key}
                      onChange={(e) => updateBinaryDataEntry(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Enter value"
                      value={entry.value}
                      onChange={(e) => updateBinaryDataEntry(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => removeBinaryDataEntry(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
              </VStack>
            )}

            <HStack gap={2}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                onClick={addBinaryDataEntry}
                className="bg-white"
              >
                Add Data Entry
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconFile size={12} stroke={1.5} />}
                onClick={() => {
                  // TODO: Implement file reading functionality
                  console.log('Read from file clicked');
                }}
                className="bg-white"
              >
                Read from File
              </Button>
            </HStack>
          </VStack>
        </div>
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
    <SectionCard>
      <SectionCard.Header title="Labels & Annotations" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Labels */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={3}>
                {labels.length > 0 && (
                  <VStack gap={2} className="w-full">
                    {labels.map((label, index) => (
                      <HStack gap={2} key={index} className="w-full items-center">
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
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                        >
                          <IconX
                            size={12}
                            className="text-[var(--color-text-muted)]"
                            stroke={1.5}
                          />
                        </button>
                      </HStack>
                    ))}
                  </VStack>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                  onClick={onAddLabel}
                  className="self-start bg-white"
                >
                  Add Label
                </Button>
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

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={3}>
                {annotations.length > 0 && (
                  <VStack gap={2} className="w-full">
                    {annotations.map((annotation, index) => (
                      <HStack gap={2} key={index} className="w-full items-center">
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
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                        >
                          <IconX
                            size={12}
                            className="text-[var(--color-text-muted)]"
                            stroke={1.5}
                          />
                        </button>
                      </HStack>
                    ))}
                  </VStack>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                  onClick={onAddAnnotation}
                  className="self-start bg-white"
                >
                  Add Annotation
                </Button>
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

export function CreateConfigMapPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [configMapName, setConfigMapName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Data state
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);

  // Binary Data state
  const [binaryDataEntries, setBinaryDataEntries] = useState<BinaryDataEntry[]>([]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Validation errors
  const [configMapNameError, setConfigMapNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create ConfigMap');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/configmaps');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
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
  const isCreateDisabled = !configMapName.trim();

  // Check if labels or annotations have data
  const hasLabelsOrAnnotations =
    labels.some((l) => l.key.trim() || l.value.trim()) ||
    annotations.some((a) => a.key.trim() || a.value.trim());

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />

        {/* Top Bar */}
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
                { label: 'ConfigMaps', href: '/container/configmaps' },
                { label: 'Create ConfigMap' },
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

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Page Header */}
              <VStack gap={2}>
                <div className="flex items-center justify-between h-8">
                  <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                    Create ConfigMap
                  </h1>
                </div>
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  ConfigMap provide configuration data as key–value pairs so applications can load
                  settings without changing container images.
                </p>
              </VStack>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <BasicInfoSection
                    configMapName={configMapName}
                    onConfigMapNameChange={setConfigMapName}
                    configMapNameError={configMapNameError}
                    onConfigMapNameErrorChange={setConfigMapNameError}
                    namespace={namespace}
                    onNamespaceChange={setNamespace}
                    description={description}
                    onDescriptionChange={setDescription}
                  />

                  {/* Data Section */}
                  <DataSection dataEntries={dataEntries} onDataEntriesChange={setDataEntries} />

                  {/* Binary Data Section */}
                  <BinaryDataSection
                    binaryDataEntries={binaryDataEntries}
                    onBinaryDataEntriesChange={setBinaryDataEntries}
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
                  configMapName={configMapName}
                  dataEntries={dataEntries}
                  binaryDataEntries={binaryDataEntries}
                  hasLabelsOrAnnotations={hasLabelsOrAnnotations}
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  isCreateDisabled={isCreateDisabled}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateConfigMapPage;
