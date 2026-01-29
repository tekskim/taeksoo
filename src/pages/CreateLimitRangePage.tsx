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
   Types for Container Resource Limit Section
   ---------------------------------------- */

interface ContainerResourceLimit {
  cpuReservation: string;
  cpuLimit: string;
  memoryReservation: string;
  memoryLimit: string;
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateLimitRangePage() {
  const navigate = useNavigate();
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
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

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

  const handleCancel = useCallback(() => {
    navigate('/container/limit-ranges');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!limitRangeName.trim()) {
      setLimitRangeNameError('Limit range name is required.');
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

  // Compute section statuses for summary
  const basicInfoComplete = limitRangeName.trim().length > 0;
  const containerResourceLimitComplete = true; // Optional section, always considered complete
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

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create Limit Range
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
                            Limit Range Name
                            <span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Input
                            placeholder="Enter a unique name"
                            value={limitRangeName}
                            onChange={(e) => {
                              setLimitRangeName(e.target.value);
                              if (limitRangeNameError) setLimitRangeNameError(null);
                            }}
                            error={!!limitRangeNameError}
                            fullWidth
                          />
                          {limitRangeNameError && (
                            <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                              {limitRangeNameError}
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

                  {/* Container Resource Limit Section */}
                  <SectionCard>
                    <SectionCard.Header title="Container Resource Limit" showDivider />
                    <SectionCard.Content>
                      <VStack gap={3}>
                        {/* Resource Limit Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                          {/* CPU Reservation */}
                          <VStack gap={2}>
                            <VStack gap={1}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                CPU Reservation
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                Specify the minimum CPU amount reserved for the container.
                              </span>
                            </VStack>
                            <div className="relative w-full">
                              <Input
                                placeholder="1000"
                                value={resourceLimit.cpuReservation}
                                onChange={(e) =>
                                  setResourceLimit({
                                    ...resourceLimit,
                                    cpuReservation: e.target.value,
                                  })
                                }
                                fullWidth
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--color-text-default)]">
                                mCPUs
                              </span>
                            </div>
                          </VStack>

                          {/* CPU Limit */}
                          <VStack gap={2}>
                            <VStack gap={1}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                CPU Limit
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                Specify the maximum CPU amount the container is allowed to use.
                              </span>
                            </VStack>
                            <div className="relative w-full">
                              <Input
                                placeholder="1000"
                                value={resourceLimit.cpuLimit}
                                onChange={(e) =>
                                  setResourceLimit({ ...resourceLimit, cpuLimit: e.target.value })
                                }
                                fullWidth
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--color-text-default)]">
                                mCPUs
                              </span>
                            </div>
                          </VStack>

                          {/* Memory Reservation */}
                          <VStack gap={2}>
                            <VStack gap={1}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                Memory Reservation
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                Specify the minimum memory capacity reserved for the container.
                              </span>
                            </VStack>
                            <div className="relative w-full">
                              <Input
                                placeholder="128"
                                value={resourceLimit.memoryReservation}
                                onChange={(e) =>
                                  setResourceLimit({
                                    ...resourceLimit,
                                    memoryReservation: e.target.value,
                                  })
                                }
                                fullWidth
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--color-text-default)]">
                                GiB
                              </span>
                            </div>
                          </VStack>

                          {/* Memory Limit */}
                          <VStack gap={2}>
                            <VStack gap={1}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                Memory Limit
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                Specify the maximum memory capacity the container is allowed to use.
                              </span>
                            </VStack>
                            <div className="relative w-full">
                              <Input
                                placeholder="128"
                                value={resourceLimit.memoryLimit}
                                onChange={(e) =>
                                  setResourceLimit({
                                    ...resourceLimit,
                                    memoryLimit: e.target.value,
                                  })
                                }
                                fullWidth
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--color-text-default)]">
                                GiB
                              </span>
                            </div>
                          </VStack>
                        </div>
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
                              label="Container Resource Limit"
                              status={containerResourceLimitComplete ? 'complete' : 'in-progress'}
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
                          Create Limit Range
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

export default CreateLimitRangePage;
