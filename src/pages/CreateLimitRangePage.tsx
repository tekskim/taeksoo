import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  Disclosure,
  FormField,
  HStack,
  VStack,
  TabBar,
  TopBar,
  PageShell,
  Input,
  Select,
  SectionCard,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useIsV2 } from '@/hooks/useIsV2';
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

type SectionStep = 'basic-info' | 'data' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  data: 'Container Resource Limit',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for display
const SECTION_ORDER: SectionStep[] = ['basic-info', 'data', 'labels-annotations'];

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
  sectionStatus: Record<SectionStep, 'done' | 'active' | 'pending'>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
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
                  <SummaryStatusIcon status={sectionStatus[step]} />
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
  limitRangeName: string;
  onLimitRangeNameChange: (value: string) => void;
  limitRangeNameError: string | null;
  onLimitRangeNameErrorChange: (error: string | null) => void;
  namespace: string;
  onNamespaceChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  isV2: boolean;
}

function BasicInfoSection({
  limitRangeName,
  onLimitRangeNameChange,
  limitRangeNameError,
  onLimitRangeNameErrorChange,
  namespace,
  onNamespaceChange,
  description,
  onDescriptionChange,
  isV2,
}: BasicInfoSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Basic information" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
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
          <FormField required error={!!limitRangeNameError}>
            <FormField.Label>Name</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="Enter a unique name"
                value={limitRangeName}
                onChange={(e) => {
                  onLimitRangeNameChange(e.target.value);
                  if (limitRangeNameError) onLimitRangeNameErrorChange(null);
                }}
                fullWidth
              />
            </FormField.Control>
            <FormField.ErrorMessage>{limitRangeNameError}</FormField.ErrorMessage>
          </FormField>

          {/* Description */}
          <Disclosure defaultOpen={isV2}>
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
   Types for Container Resource Limit Section
   ---------------------------------------- */

interface ContainerResourceLimit {
  cpuReservation: string;
  cpuLimit: string;
  memoryReservation: string;
  memoryLimit: string;
}

/* ----------------------------------------
   ContainerResourceLimitSection Component
   ---------------------------------------- */

interface ContainerResourceLimitSectionProps {
  resourceLimit: ContainerResourceLimit;
  onResourceLimitChange: (limit: ContainerResourceLimit) => void;
}

function ContainerResourceLimitSection({
  resourceLimit,
  onResourceLimitChange,
}: ContainerResourceLimitSectionProps) {
  const updateField = (field: keyof ContainerResourceLimit, value: string) => {
    onResourceLimitChange({ ...resourceLimit, [field]: value });
  };

  return (
    <SectionCard>
      <SectionCard.Header title="Container resource limit" showDivider />
      <SectionCard.Content>
        <VStack gap={3}>
          {/* Resource Limit Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 w-full">
            {/* CPU Reservation */}
            <FormField>
              <FormField.Label>CPU Reservation</FormField.Label>
              <FormField.Description>
                Specify the minimum CPU amount reserved for the container.
              </FormField.Description>
              <FormField.Control>
                <HStack gap={2} align="center">
                  <Input
                    placeholder="1000"
                    value={resourceLimit.cpuReservation}
                    onChange={(e) => updateField('cpuReservation', e.target.value)}
                  />
                  <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                    mCPUs
                  </span>
                </HStack>
              </FormField.Control>
            </FormField>

            {/* CPU Limit */}
            <FormField>
              <FormField.Label>CPU Limit</FormField.Label>
              <FormField.Description>
                Specify the maximum CPU amount the container is allowed to use.
              </FormField.Description>
              <FormField.Control>
                <HStack gap={2} align="center">
                  <Input
                    placeholder="1000"
                    value={resourceLimit.cpuLimit}
                    onChange={(e) => updateField('cpuLimit', e.target.value)}
                  />
                  <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                    mCPUs
                  </span>
                </HStack>
              </FormField.Control>
            </FormField>

            {/* Memory Reservation */}
            <FormField>
              <FormField.Label>Memory Reservation</FormField.Label>
              <FormField.Description>
                Specify the minimum memory capacity reserved for the container.
              </FormField.Description>
              <FormField.Control>
                <HStack gap={2} align="center">
                  <Input
                    placeholder="128"
                    value={resourceLimit.memoryReservation}
                    onChange={(e) => updateField('memoryReservation', e.target.value)}
                  />
                  <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                    GiB
                  </span>
                </HStack>
              </FormField.Control>
            </FormField>

            {/* Memory Limit */}
            <FormField>
              <FormField.Label>Memory Limit</FormField.Label>
              <FormField.Description>
                Specify the maximum memory capacity the container is allowed to use.
              </FormField.Description>
              <FormField.Control>
                <HStack gap={2} align="center">
                  <Input
                    placeholder="128"
                    value={resourceLimit.memoryLimit}
                    onChange={(e) => updateField('memoryLimit', e.target.value)}
                  />
                  <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                    GiB
                  </span>
                </HStack>
              </FormField.Control>
            </FormField>
          </div>
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
    <SectionCard>
      <SectionCard.Header title="Labels & Annotations" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Labels */}
          <FormField>
            <FormField.Label>Labels</FormField.Label>
            <FormField.Description>
              Specify the labels used to identify and categorize the resource.
            </FormField.Description>
            <FormField.Control>
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  {labels.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Key
                      </span>
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Value
                      </span>
                      <div />
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
            </FormField.Control>
          </FormField>

          {/* Annotations */}
          <FormField>
            <FormField.Label>Annotations</FormField.Label>
            <FormField.Description>
              Specify the annotations used to provide additional metadata for the resource.
            </FormField.Description>
            <FormField.Control>
              <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                <VStack gap={2}>
                  {annotations.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Key
                      </span>
                      <span className="block text-label-lg text-[var(--color-text-default)]">
                        Value
                      </span>
                      <div />
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
            </FormField.Control>
          </FormField>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateLimitRangePage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [limitRangeName, setLimitRangeName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Container Resource Limit state
  const [resourceLimit, setResourceLimit] = useState<ContainerResourceLimit>({
    cpuReservation: '',
    cpuLimit: '',
    memoryReservation: '',
    memoryLimit: '',
  });

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Section status for summary sidebar (simplified: done/active/pending)
  const [sectionStatus, setSectionStatus] = useState<
    Record<SectionStep, 'done' | 'active' | 'pending'>
  >({
    'basic-info': 'active',
    data: isV2 ? 'active' : 'pending',
    'labels-annotations': isV2 ? 'active' : 'pending',
  });

  // Validation errors
  const [limitRangeNameError, setLimitRangeNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Limit Range');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Update section status based on form completion
  useEffect(() => {
    const hasBasicInfo = limitRangeName.trim() && namespace;
    const hasResourceLimit =
      resourceLimit.cpuReservation ||
      resourceLimit.cpuLimit ||
      resourceLimit.memoryReservation ||
      resourceLimit.memoryLimit;
    const hasLabelsOrAnnotations = labels.length > 0 || annotations.length > 0;

    setSectionStatus({
      'basic-info': hasBasicInfo ? 'done' : 'active',
      data: hasResourceLimit ? 'done' : hasBasicInfo ? 'active' : 'pending',
      'labels-annotations': hasLabelsOrAnnotations
        ? 'done'
        : hasResourceLimit
          ? 'active'
          : 'pending',
    });
  }, [limitRangeName, namespace, resourceLimit, labels, annotations]);

  const handleCancel = useCallback(() => {
    navigate('/container/limit-ranges');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!limitRangeName.trim()) {
      setLimitRangeNameError('Limit range name is required.');
      setSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
      return;
    }

    console.log('Creating limit range:', {
      limitRangeName,
      namespace,
      description,
      resourceLimit,
      labels,
      annotations,
    });
    navigate('/container/limit-ranges');
  }, [limitRangeName, namespace, description, resourceLimit, labels, annotations, navigate]);

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
  const isCreateDisabled = !limitRangeName.trim();

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
                { label: 'Limit Ranges', href: '/container/limit-ranges' },
                { label: 'Create Limit Range' },
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
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={2}>
          <div className="flex items-center justify-between h-8">
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create Limit Range</h1>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            LimitRanges define default resource requests and limits for Pods and containers within a
            Namespace, helping enforce fair resource usage and prevent workloads from consuming
            excessive CPU or memory.
          </p>
        </VStack>

        {/* Main Content with Sidebar */}
        <HStack gap={6} align="start" className="w-full">
          {/* Form Content */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information Section */}
            <BasicInfoSection
              limitRangeName={limitRangeName}
              onLimitRangeNameChange={setLimitRangeName}
              limitRangeNameError={limitRangeNameError}
              onLimitRangeNameErrorChange={setLimitRangeNameError}
              namespace={namespace}
              onNamespaceChange={setNamespace}
              description={description}
              onDescriptionChange={setDescription}
              isV2={isV2}
            />

            {/* Container Resource Limit Section */}
            <ContainerResourceLimitSection
              resourceLimit={resourceLimit}
              onResourceLimitChange={setResourceLimit}
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
            sectionStatus={sectionStatus}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateLimitRangePage;
