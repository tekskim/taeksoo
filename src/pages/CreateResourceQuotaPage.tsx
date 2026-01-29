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
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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
        <VStack gap={5}>
          {/* Header Labels */}
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <VStack gap={1}>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Resource Type
                </span>
                <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                  Select the resource type to apply the quota.
                </span>
              </VStack>
            </div>
            <div className="flex-1">
              <VStack gap={1}>
                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                  Limit
                </span>
                <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                  Specify the maximum usage allowed for the selected resource type.
                </span>
              </VStack>
            </div>
            <div className="w-[16px]" />
          </div>

          {/* Quota Items */}
          {quotaItems.length > 0 && (
            <VStack gap={2} className="w-full">
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
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--color-text-default)]">
                          {unit}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeQuotaItem(item.id)}
                      className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
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
          >
            Add Resource
          </Button>
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

  const handleCancel = useCallback(() => {
    navigate('/container/resource-quotas');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!resourceQuotaName.trim()) {
      setResourceQuotaNameError('Resource quota name is required.');
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

  // Resource Quota management
  const addQuotaItem = useCallback(() => {
    const newItem: ResourceQuotaItem = {
      id: `quota-${Date.now()}`,
      resourceType: '',
      limit: '',
    };
    setQuotaItems([...quotaItems, newItem]);
  }, [quotaItems]);

  const removeQuotaItem = useCallback(
    (id: string) => {
      setQuotaItems(quotaItems.filter((item) => item.id !== id));
    },
    [quotaItems]
  );

  const updateQuotaItem = useCallback(
    (id: string, field: 'resourceType' | 'limit', value: string) => {
      setQuotaItems(
        quotaItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    },
    [quotaItems]
  );

  // Check if create button should be disabled
  const isCreateDisabled = !resourceQuotaName.trim();

  // Compute section statuses for summary
  const basicInfoComplete = resourceQuotaName.trim().length > 0;
  const resourceQuotasComplete = true; // Optional section, always considered complete
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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create Resource Quota
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
                          <Select
                            options={NAMESPACE_OPTIONS}
                            value={namespace}
                            onChange={setNamespace}
                            fullWidth
                          />
                        </VStack>

                        {/* Name */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Resource Quota Name
                            <span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Input
                            placeholder="Enter a unique name"
                            value={resourceQuotaName}
                            onChange={(e) => {
                              setResourceQuotaName(e.target.value);
                              if (resourceQuotaNameError) setResourceQuotaNameError(null);
                            }}
                            error={!!resourceQuotaNameError}
                            fullWidth
                          />
                          {resourceQuotaNameError && (
                            <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                              {resourceQuotaNameError}
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

                  {/* Resource Quotas Section */}
                  <SectionCard>
                    <SectionCard.Header title="Resource Quotas" showDivider />
                    <SectionCard.Content>
                      <VStack gap={5}>
                        {/* Header Labels */}
                        <div className="flex gap-2 w-full">
                          <div className="flex-1">
                            <VStack gap={1}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                Resource Type
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                Select the resource type to apply the quota.
                              </span>
                            </VStack>
                          </div>
                          <div className="flex-1">
                            <VStack gap={1}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                Limit
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                Specify the maximum usage allowed for the selected resource type.
                              </span>
                            </VStack>
                          </div>
                          <div className="w-[16px]" />
                        </div>

                        {/* Quota Items */}
                        {quotaItems.length > 0 && (
                          <VStack gap={2} className="w-full">
                            {quotaItems.map((item) => {
                              const unit = getResourceUnit(item.resourceType);
                              const placeholder = getResourcePlaceholder(item.resourceType);
                              return (
                                <div key={item.id} className="flex gap-2 items-center w-full">
                                  <div className="flex-1">
                                    <Select
                                      options={RESOURCE_TYPE_OPTIONS}
                                      value={item.resourceType}
                                      onChange={(value) =>
                                        updateQuotaItem(item.id, 'resourceType', value)
                                      }
                                      placeholder="Select resource type"
                                      fullWidth
                                    />
                                  </div>
                                  <div className="flex-1 relative">
                                    <Input
                                      placeholder={placeholder}
                                      value={item.limit}
                                      onChange={(e) =>
                                        updateQuotaItem(item.id, 'limit', e.target.value)
                                      }
                                      fullWidth
                                    />
                                    {unit && (
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--color-text-default)]">
                                        {unit}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeQuotaItem(item.id)}
                                    className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  >
                                    <IconX
                                      size={16}
                                      className="text-[var(--color-text-muted)]"
                                      stroke={1.5}
                                    />
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
                        >
                          Add Resource
                        </Button>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

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
                              label="Resource Quotas"
                              status={resourceQuotasComplete ? 'complete' : 'in-progress'}
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
                          Create Resource Quota
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

export default CreateResourceQuotaPage;
