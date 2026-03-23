import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  NumberInput,
  Select,
  SectionCard,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useIsV2 } from '@/hooks/useIsV2';
import {
  formCpuToYaml,
  formMemoryToYaml,
  parseCpuSafe,
  parseMemorySafe,
} from '@/utils/k8sResourceUnits';
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
  'basic-info': 'Basic information',
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
  isEditMode?: boolean;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateDisabled,
  isEditMode = false,
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
            {isEditMode ? 'Save' : 'Create'}
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
  isV2: boolean;
  isEditMode?: boolean;
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
  isV2,
  isEditMode = false,
}: BasicInfoSectionProps) {
  return (
    <SectionCard className="pb-4">
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
          <FormField required error={!!resourceQuotaNameError}>
            <FormField.Label>Resource Quota Name</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="Enter a unique name"
                value={resourceQuotaName}
                onChange={(e) => {
                  onResourceQuotaNameChange(e.target.value);
                  if (resourceQuotaNameError) onResourceQuotaNameErrorChange(null);
                }}
                fullWidth
                disabled={isEditMode}
              />
            </FormField.Control>
            <FormField.ErrorMessage>{resourceQuotaNameError}</FormField.ErrorMessage>
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
      return 'MiB';
    case 'storage-reservation':
      return 'MiB';
    default:
      return null;
  }
};

// Get placeholder for resource type
const getResourcePlaceholder = (resourceType: string): string => {
  switch (resourceType) {
    case 'cpu-limit':
    case 'cpu-reservation':
      return 'e.g. 500';
    case 'memory-limit':
    case 'memory-reservation':
      return 'e.g. 512';
    case 'storage-reservation':
      return 'e.g. 10240';
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
    <SectionCard className="pb-4">
      <SectionCard.Header title="Resource quotas" showDivider />
      <SectionCard.Content>
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">Resource</span>

          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
            <VStack gap={1.5} className="w-full">
              {quotaItems.map((item) => {
                const unit = getResourceUnit(item.resourceType);
                const placeholder = getResourcePlaceholder(item.resourceType);
                return (
                  <div
                    key={item.id}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                  >
                    <VStack gap={1}>
                      <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-start">
                        <VStack gap={0.5}>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Resource Type
                          </span>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            Select the resource type to apply the quota.
                          </span>
                        </VStack>
                        <VStack gap={0.5}>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Limit
                          </span>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            Specify the maximum usage allowed for the selected resource type.
                          </span>
                        </VStack>
                        <button
                          onClick={() => removeQuotaItem(item.id)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                        >
                          <IconX size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-start">
                        <Select
                          options={RESOURCE_TYPE_OPTIONS}
                          value={item.resourceType}
                          onChange={(value) => updateQuotaItem(item.id, 'resourceType', value)}
                          placeholder="Select resource type"
                          fullWidth
                        />
                        <HStack gap={2} align="center">
                          <NumberInput
                            value={item.limit === '' ? undefined : Number(item.limit)}
                            onChange={(val) => updateQuotaItem(item.id, 'limit', String(val))}
                            width="sm"
                            placeholder={placeholder}
                          />
                          {unit && (
                            <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                              {unit}
                            </span>
                          )}
                        </HStack>
                        <div />
                      </div>
                    </VStack>
                  </div>
                );
              })}

              <div className="w-fit">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} />}
                  onClick={addQuotaItem}
                >
                  Add Resource
                </Button>
              </div>
            </VStack>
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
    <SectionCard className="pb-4">
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
              <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                <VStack gap={1.5}>
                  {labels.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
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
                      className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
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
              <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                <VStack gap={1.5}>
                  {annotations.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
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
                      className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
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

export function CreateResourceQuotaPage() {
  const navigate = useNavigate();
  const { resourceQuotaName: resourceQuotaNameParam } = useParams();
  const isEditMode = !!resourceQuotaNameParam;
  const [searchParams] = useSearchParams();
  const nameFromQuery = searchParams.get('name');
  const isV2 = useIsV2();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [resourceQuotaName, setResourceQuotaName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Resource Quotas state
  const [quotaItems, setQuotaItems] = useState<ResourceQuotaItem[]>(
    RESOURCE_TYPE_OPTIONS.map((opt) => ({
      id: opt.value,
      resourceType: opt.value,
      limit: '',
    }))
  );

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Validation errors
  const [resourceQuotaNameError, setResourceQuotaNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(
      isEditMode
        ? `Resource quota: ${nameFromQuery || resourceQuotaNameParam}`
        : 'Create resource quota'
    );
  }, [updateActiveTabLabel, isEditMode, resourceQuotaNameParam]);

  useEffect(() => {
    if (isEditMode && resourceQuotaNameParam) {
      setResourceQuotaName(nameFromQuery || resourceQuotaNameParam);

      // Mock YAML quota items — in a real app these would be fetched from the cluster.
      // Demonstrates YAML → Form parsing: "500m" → 500, "1Gi" → 1024.
      const mockYamlQuotas: Array<{ resourceType: string; limit: string }> = [
        { resourceType: 'cpu-limit', limit: '2000m' },
        { resourceType: 'memory-limit', limit: '4Gi' },
        { resourceType: 'cpu-reservation', limit: '1' },
        { resourceType: 'memory-reservation', limit: '512Mi' },
        { resourceType: 'pods', limit: '100' },
      ];

      setQuotaItems(
        mockYamlQuotas.map((q, i) => {
          let formLimit = q.limit;
          if (q.resourceType === 'cpu-limit' || q.resourceType === 'cpu-reservation') {
            formLimit = String(parseCpuSafe(q.limit, 0));
          } else if (q.resourceType === 'memory-limit' || q.resourceType === 'memory-reservation') {
            formLimit = String(parseMemorySafe(q.limit, 0));
          }
          return { id: `quota-edit-${i}`, resourceType: q.resourceType, limit: formLimit };
        })
      );
    }
  }, [isEditMode, resourceQuotaNameParam]);

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
      // namespace has default → 'active' until name is typed
      'basic-info': resourceQuotaName.trim() ? 'done' : 'active',
      // quota items are optional → always done
      data: 'done',
      // labels & annotations have no required fields → always done
      'labels-annotations': 'done',
    };
  };

  const sectionStatus = getSectionStatus();

  const handleCancel = useCallback(() => {
    navigate('/container/resource-quotas');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!resourceQuotaName.trim()) {
      setResourceQuotaNameError('Resource quota name is required.');
      return;
    }

    // Form → YAML conversion for CPU/Memory quota items
    const yamlQuotaItems = quotaItems.map((item) => {
      if (!item.limit) return item;
      const resourceType = item.resourceType;
      let yamlLimit = item.limit;
      if (resourceType === 'cpu-limit' || resourceType === 'cpu-reservation') {
        yamlLimit = formCpuToYaml(item.limit);
      } else if (resourceType === 'memory-limit' || resourceType === 'memory-reservation') {
        yamlLimit = formMemoryToYaml(item.limit);
      }
      return { ...item, limit: yamlLimit };
    });

    console.log('Creating resource quota (YAML values):', {
      resourceQuotaName,
      namespace,
      description,
      quotaItems: yamlQuotaItems,
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
                { label: 'Resource Quotas', href: '/container/resource-quotas' },
                ...(isEditMode
                  ? [
                      {
                        label: nameFromQuery || resourceQuotaNameParam!,
                        href: `/container/resource-quotas/{resourceQuotaNameParam}`,
                      },
                      { label: 'Edit config' },
                    ]
                  : [{ label: 'Create resource quota' }]),
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
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={2}>
          <div className="flex items-center justify-between h-8">
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">
              {isEditMode
                ? `Resource quota: ${nameFromQuery || resourceQuotaNameParam}`
                : 'Create resource quota'}
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
              isV2={isV2}
              isEditMode={isEditMode}
            />

            {/* Resource Quotas Section */}
            <ResourceQuotasSection quotaItems={quotaItems} onQuotaItemsChange={setQuotaItems} />

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
            isEditMode={isEditMode}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateResourceQuotaPage;
