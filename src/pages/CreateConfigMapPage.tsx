import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
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
  IconPlus,
  IconCirclePlus,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Label {
  key: string;
  value: string;
}

interface Annotation {
  key: string;
  value: string;
}

/* ----------------------------------------
   Summary Item Component
   ---------------------------------------- */

interface SummaryItemProps {
  label: string;
  status: 'complete' | 'in-progress';
}

function SummaryItem({ label, status }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1 w-full">
      <span className="text-[12px] leading-5 text-[var(--color-text-default)]">{label}</span>
      <div className="w-4 h-4 flex items-center justify-center">
        {status === 'complete' ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="var(--color-state-success)" />
            <path
              d="M5 8L7 10L11 6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="var(--color-border-default)"
              strokeDasharray="3 3"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Types for Data Section
   ---------------------------------------- */

interface DataEntry {
  key: string;
  value: string;
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
        <VStack gap={3}>
          {/* Data Entries */}
          {dataEntries.length > 0 && (
            <VStack gap={2} className="w-full">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_1fr_23px] gap-2">
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Key
                </span>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
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
                    className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  >
                    <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </button>
                </div>
              ))}
            </VStack>
          )}

          <HStack gap={2}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={addDataEntry}
            >
              Add Data Entry
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconFile size={12} stroke={1.5} />}
              onClick={() => {
                // TODO: Implement file reading functionality
                console.log('Read from file clicked');
              }}
            >
              Read from File
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Types for Binary Data Section
   ---------------------------------------- */

interface BinaryDataEntry {
  key: string;
  value: string;
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
        <VStack gap={3}>
          {/* Binary Data Entries */}
          {binaryDataEntries.length > 0 && (
            <VStack gap={2} className="w-full">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_1fr_23px] gap-2">
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Key
                </span>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
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
                    className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  >
                    <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                  </button>
                </div>
              ))}
            </VStack>
          )}

          <HStack gap={2}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={addBinaryDataEntry}
            >
              Add Data Entry
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconFile size={12} stroke={1.5} />}
              onClick={() => {
                // TODO: Implement file reading functionality
                console.log('Read from file clicked');
              }}
            >
              Read from File
            </Button>
          </HStack>
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

  // Compute section statuses for summary
  const basicInfoComplete = configMapName.trim().length > 0;
  const dataComplete = true; // Optional section, always considered complete
  const binaryDataComplete = true; // Optional section, always considered complete
  const labelsAnnotationsComplete = true; // Optional section, always considered complete

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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create ConfigMap
                </h1>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" showDivider />
                    <SectionCard.Content>
                      <VStack gap={4}>
                        {/* Namespace */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Namespace<span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Input
                            placeholder="Enter namespace"
                            value={namespace}
                            onChange={(e) => setNamespace(e.target.value)}
                            fullWidth
                          />
                        </VStack>

                        {/* Name */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Name<span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Input
                            placeholder="Enter a unique name"
                            value={configMapName}
                            onChange={(e) => {
                              setConfigMapName(e.target.value);
                              if (configMapNameError) setConfigMapNameError(null);
                            }}
                            error={!!configMapNameError}
                            fullWidth
                          />
                          {configMapNameError && (
                            <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                              {configMapNameError}
                            </span>
                          )}
                        </VStack>

                        {/* Description */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Description
                          </label>
                          <Input
                            placeholder="Enter a description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                          />
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Data Section */}
                  <DataSection dataEntries={dataEntries} onDataEntriesChange={setDataEntries} />

                  {/* Binary Data Section */}
                  <BinaryDataSection
                    binaryDataEntries={binaryDataEntries}
                    onBinaryDataEntriesChange={setBinaryDataEntries}
                  />

                  {/* Labels & Annotations Section */}
                  <SectionCard>
                    <SectionCard.Header title="Labels & Annotations" showDivider />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Labels */}
                        <VStack gap={3}>
                          <VStack gap={1}>
                            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Labels
                            </span>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the labels used to identify and categorize the resource.
                            </p>
                          </VStack>

                          {labels.map((label, index) => (
                            <HStack gap={2} key={index} className="w-full">
                              <Input
                                placeholder="Key"
                                value={label.key}
                                onChange={(e) => updateLabel(index, 'key', e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Value"
                                value={label.value}
                                onChange={(e) => updateLabel(index, 'value', e.target.value)}
                                className="flex-1"
                              />
                              <button
                                onClick={() => removeLabel(index)}
                                className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconX
                                  size={14}
                                  className="text-[var(--color-text-muted)]"
                                  stroke={1.5}
                                />
                              </button>
                            </HStack>
                          ))}

                          <div className="w-fit">
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                              onClick={addLabel}
                            >
                              Add Label
                            </Button>
                          </div>
                        </VStack>

                        {/* Annotations */}
                        <VStack gap={3}>
                          <VStack gap={1}>
                            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Annotations
                            </span>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the annotations used to provide additional metadata for the
                              resource.
                            </p>
                          </VStack>

                          {annotations.map((annotation, index) => (
                            <HStack gap={2} key={index} className="w-full">
                              <Input
                                placeholder="Key"
                                value={annotation.key}
                                onChange={(e) => updateAnnotation(index, 'key', e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Value"
                                value={annotation.value}
                                onChange={(e) => updateAnnotation(index, 'value', e.target.value)}
                                className="flex-1"
                              />
                              <button
                                onClick={() => removeAnnotation(index)}
                                className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconX
                                  size={14}
                                  className="text-[var(--color-text-muted)]"
                                  stroke={1.5}
                                />
                              </button>
                            </HStack>
                          ))}

                          <div className="w-fit">
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                              onClick={addAnnotation}
                            >
                              Add Annotation
                            </Button>
                          </div>
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* Summary Sidebar */}
                <div className="w-[280px] shrink-0">
                  <div className="sticky top-4">
                    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[8px] shadow-[var(--shadow-md)] overflow-hidden flex flex-col gap-6 pt-3 pb-4 px-3">
                      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[8px] px-4 py-4">
                        <VStack gap={4}>
                          <h5 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                            Summary
                          </h5>
                          <VStack gap={0}>
                            <SummaryItem
                              label="Basic Information"
                              status={basicInfoComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Data"
                              status={dataComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Binary Data"
                              status={binaryDataComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Labels & Annotations"
                              status={labelsAnnotationsComplete ? 'complete' : 'in-progress'}
                            />
                          </VStack>
                        </VStack>
                      </div>
                      <HStack gap={2} className="w-full justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancel}
                          className="w-[80px]"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleCreate}
                          className="flex-1 min-w-[80px]"
                          disabled={isCreateDisabled}
                        >
                          Create
                        </Button>
                      </HStack>
                    </div>
                  </div>
                </div>
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateConfigMapPage;
