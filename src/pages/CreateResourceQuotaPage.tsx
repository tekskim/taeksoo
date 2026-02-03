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
  Select,
  SectionCard,
  Disclosure,
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

type SectionStep = 'basic-info' | 'data' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  data: 'Resource Quotas',
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
  resourceQuotaName: string;
  onResourceQuotaNameChange: (value: string) => void;
  resourceQuotaNameError: string | null;
  onResourceQuotaNameErrorChange: (error: string | null) => void;
  namespace: string;
  onNamespaceChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

function BasicInfoSection({
  resourceQuotaName,
  onResourceQuotaNameChange,
  resourceQuotaNameError,
  onResourceQuotaNameErrorChange,
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
            <Select
              options={NAMESPACE_OPTIONS}
              value={namespace}
              onChange={onNamespaceChange}
              fullWidth
            />
          </VStack>

          {/* Name */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
              Resource Quota Name<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Input
              placeholder="Enter a unique name"
              value={resourceQuotaName}
              onChange={(e) => {
                onResourceQuotaNameChange(e.target.value);
                if (resourceQuotaNameError) onResourceQuotaNameErrorChange(null);
              }}
              error={!!resourceQuotaNameError}
              fullWidth
            />
            {resourceQuotaNameError && (
              <span className="text-body-sm text-[var(--color-state-danger)]">
                {resourceQuotaNameError}
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
   Types for Resource Quotas Section
   ---------------------------------------- */

interface ResourceQuotaItem {
  id: string;
  resourceType: string;
  limit: string;
}

const RESOURCE_TYPE_OPTIONS = [
  { value: 'configmaps', label: 'Config Maps' },
  { value: 'cpu-limit', label: 'CPU Limit' },
  { value: 'memory-limit', label: 'Memory Limit' },
  { value: 'persistentvolumeclaims', label: 'Persistent Volume Claims' },
  { value: 'pods', label: 'Pods' },
  { value: 'replicationcontrollers', label: 'Replication Controllers' },
  { value: 'cpu-reservation', label: 'CPU Reservation' },
  { value: 'memory-reservation', label: 'Memory Reservation' },
  { value: 'storage-reservation', label: 'Storage Reservation' },
  { value: 'secrets', label: 'Secrets' },
  { value: 'services', label: 'Services' },
  { value: 'services-loadbalancers', label: 'Services Load Balancers' },
  { value: 'services-nodeports', label: 'Service Node Ports' },
];

// Get unit suffix for resource type
const getResourceUnit = (resourceType: string): string | null => {
  switch (resourceType) {
    case 'cpu-limit':
    case 'cpu-reservation':
      return 'mCPUs';
    case 'memory-limit':
    case 'memory-reservation':
    case 'storage-reservation':
      return 'GiB';
    default:
      return null;
  }
};

// Get placeholder for resource type
const getResourcePlaceholder = (resourceType: string): string => {
  switch (resourceType) {
    case 'cpu-limit':
    case 'cpu-reservation':
      return 'e.g. 2000';
    case 'memory-limit':
    case 'memory-reservation':
    case 'storage-reservation':
      return 'e.g. 2048';
    default:
      return 'e.g. 50';
  }
};

/* ----------------------------------------
   ResourceQuotasSection Component
   ---------------------------------------- */

interface ResourceQuotasSectionProps {
  quotaItems: ResourceQuotaItem[];
  onQuotaItemsChange: (items: ResourceQuotaItem[]) => void;
}

function ResourceQuotasSection({ quotaItems, onQuotaItemsChange }: ResourceQuotasSectionProps) {
  const addQuotaItem = () => {
    const newItem: ResourceQuotaItem = {
      id: `quota-${Date.now()}`,
      resourceType: '',
      limit: '',
    };
    onQuotaItemsChange([...quotaItems, newItem]);
  };

  const removeQuotaItem = (id: string) => {
    onQuotaItemsChange(quotaItems.filter((item) => item.id !== id));
  };

  const updateQuotaItem = (id: string, field: 'resourceType' | 'limit', value: string) => {
    onQuotaItemsChange(
      quotaItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <SectionCard>
      <SectionCard.Header title="Resource Quotas" showDivider />
      <SectionCard.Content>
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
          <VStack gap={3}>
            {/* Quota Items */}
            {quotaItems.length > 0 && (
              <VStack gap={2} className="w-full">
                {/* Header Labels */}
                <div className="flex gap-2 w-full">
                  <div className="flex-1">
                    <VStack gap={1}>
                      <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                        Resource Type
                      </span>
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        Select the resource type to apply the quota.
                      </span>
                    </VStack>
                  </div>
                  <div className="flex-1">
                    <VStack gap={1}>
                      <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                        Limit
                      </span>
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        Specify the maximum usage allowed for the selected resource type.
                      </span>
                    </VStack>
                  </div>
                  <div className="w-[16px]" />
                </div>

                {quotaItems.map((item) => {
                  const unit = getResourceUnit(item.resourceType);
                  const placeholder = getResourcePlaceholder(item.resourceType);
                  return (
                    <div key={item.id} className="flex gap-2 items-center w-full">
                      <div className="flex-1">
                        <Select
                          options={RESOURCE_TYPE_OPTIONS}
                          value={item.resourceType}
                          onChange={(value) => updateQuotaItem(item.id, 'resourceType', value)}
                          placeholder="Select resource type"
                          fullWidth
                        />
                      </div>
                      <div className="flex-1 relative">
                        <Input
                          placeholder={placeholder}
                          value={item.limit}
                          onChange={(e) => updateQuotaItem(item.id, 'limit', e.target.value)}
                          fullWidth
                        />
                        {unit && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-body-md text-[var(--color-text-default)]">
                            {unit}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeQuotaItem(item.id)}
                        className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                      >
                        <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </div>
                  );
                })}
              </VStack>
            )}

            {/* Add Resource Button */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
              onClick={addQuotaItem}
              className="self-start bg-white"
            >
              Add Resource
            </Button>
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
              <VStack gap={2}>
                {labels.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                    <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                      Key
                    </label>
                    <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                      Value
                    </label>
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
                      <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddLabel}
                    className="bg-white"
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

            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={2}>
                {annotations.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                    <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                      Key
                    </label>
                    <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                      Value
                    </label>
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
                      <IconX size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddAnnotation}
                    className="bg-white"
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

export function CreateResourceQuotaPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [resourceQuotaName, setResourceQuotaName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Resource Quotas state
  const [quotaItems, setQuotaItems] = useState<ResourceQuotaItem[]>([]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Validation errors
  const [resourceQuotaNameError, setResourceQuotaNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Resource Quota');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Calculate section status based on data
  const getSectionStatus = (): Record<SectionStep, 'done' | 'active' | 'pending'> => {
    const basicInfoDone = resourceQuotaName.trim().length > 0;
    const dataDone =
      quotaItems.length > 0 && quotaItems.some((item) => item.resourceType && item.limit);
    const labelsAnnotationsDone = labels.length > 0 || annotations.length > 0;

    return {
      'basic-info': basicInfoDone
        ? 'done'
        : resourceQuotaName.trim().length > 0
          ? 'active'
          : 'pending',
      data: dataDone ? 'done' : quotaItems.length > 0 ? 'active' : 'pending',
      'labels-annotations': labelsAnnotationsDone
        ? 'done'
        : labels.length > 0 || annotations.length > 0
          ? 'active'
          : 'pending',
    };
  };

  const sectionStatus = getSectionStatus();

  const handleCancel = useCallback(() => {
    navigate('/container/resource-quotas');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!resourceQuotaName.trim()) {
      setResourceQuotaNameError('Limit range name is required.');
      return;
    }

    console.log('Creating resource quota:', {
      resourceQuotaName,
      namespace,
      description,
      quotaItems,
      labels,
      annotations,
    });
    navigate('/container/resource-quotas');
  }, [resourceQuotaName, namespace, description, quotaItems, labels, annotations, navigate]);

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
  const isCreateDisabled = !resourceQuotaName.trim();

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
                { label: 'Resource Quotas', href: '/container/resource-quotas' },
                { label: 'Create Resource Quota' },
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
                    Create Resource Quota
                  </h1>
                </div>
                <p className="text-body-md text-[var(--color-text-subtle)]">
                  Resource Quotas cap the overall resource usage of a Namespace to maintain fair and
                  controlled consumption across the cluster.
                </p>
              </VStack>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <BasicInfoSection
                    resourceQuotaName={resourceQuotaName}
                    onResourceQuotaNameChange={setResourceQuotaName}
                    resourceQuotaNameError={resourceQuotaNameError}
                    onResourceQuotaNameErrorChange={setResourceQuotaNameError}
                    namespace={namespace}
                    onNamespaceChange={setNamespace}
                    description={description}
                    onDescriptionChange={setDescription}
                  />

                  {/* Resource Quotas Section */}
                  <ResourceQuotasSection
                    quotaItems={quotaItems}
                    onQuotaItemsChange={setQuotaItems}
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateResourceQuotaPage;
