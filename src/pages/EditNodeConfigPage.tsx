import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

// Effect options for taints
const TAINT_EFFECT_OPTIONS = [
  { value: 'NoSchedule', label: 'NoSchedule' },
  { value: 'PreferNoSchedule', label: 'PreferNoSchedule' },
  { value: 'NoExecute', label: 'NoExecute' },
];

interface Taint {
  key: string;
  value: string;
  effect: string;
}

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

type SummaryStatus = 'done' | 'active' | 'pending';

function SummaryStatusIcon({ status }: { status: SummaryStatus }) {
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
  // pending → empty dashed circle
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
  nodeName: string;
  description: string;
  taints: Taint[];
  labels: Label[];
  annotations: Annotation[];
  onCancel: () => void;
  onSave: () => void;
}

function SummarySidebar({
  nodeName,
  description,
  taints,
  labels,
  annotations,
  onCancel,
  onSave,
}: SummarySidebarProps) {
  // Determine section statuses
  const basicInfoStatus: SummaryStatus = nodeName ? 'done' : 'active';
  const taintsStatus: SummaryStatus = taints.some((t) => t.key.trim()) ? 'done' : 'active';
  const labelsAnnotationsStatus: SummaryStatus =
    labels.some((l) => l.key.trim()) || annotations.some((a) => a.key.trim()) ? 'done' : 'active';

  const sections = [
    { label: 'Basic Information', status: basicInfoStatus },
    { label: 'Taints', status: taintsStatus },
    { label: 'Labels & Annotations', status: labelsAnnotationsStatus },
  ];

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Inner subtle-bg container */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={4}>
            <span className="text-heading-h5">Summary</span>
            <VStack gap={0}>
              {sections.map((section) => (
                <HStack key={section.label} justify="between" className="py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {section.label}
                  </span>
                  <SummaryStatusIcon status={section.status} />
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
          <Button variant="primary" onClick={onSave} className="flex-1">
            Save
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function EditNodeConfigPage() {
  const navigate = useNavigate();
  const { nodeName: nodeNameParam } = useParams<{ nodeName: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Node name from URL
  const nodeName = nodeNameParam || 'node-control-plane-01';

  // Basic information state
  const [description, setDescription] = useState('');

  // Taints state
  const [taints, setTaints] = useState<Taint[]>([{ key: '', value: '', effect: 'NoSchedule' }]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<Annotation[]>([{ key: '', value: '' }]);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Edit: ${nodeName}`);
  }, [updateActiveTabLabel, nodeName]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/nodes');
  }, [navigate]);

  const handleSave = useCallback(() => {
    console.log('Saving node config:', {
      nodeName,
      description,
      taints: taints.filter((t) => t.key.trim() !== ''),
      labels: labels.filter((l) => l.key.trim() !== ''),
      annotations: annotations.filter((a) => a.key.trim() !== ''),
    });
    navigate('/container/nodes');
  }, [nodeName, description, taints, labels, annotations, navigate]);

  // Taint management
  const addTaint = useCallback(() => {
    setTaints([...taints, { key: '', value: '', effect: 'NoSchedule' }]);
  }, [taints]);

  const removeTaint = useCallback(
    (index: number) => {
      if (taints.length > 1) {
        setTaints(taints.filter((_, i) => i !== index));
      }
    },
    [taints]
  );

  const updateTaint = useCallback(
    (index: number, field: 'key' | 'value' | 'effect', value: string) => {
      const newTaints = [...taints];
      newTaints[index][field] = value;
      setTaints(newTaints);
    },
    [taints]
  );

  // Label management
  const addLabel = useCallback(() => {
    setLabels([...labels, { key: '', value: '' }]);
  }, [labels]);

  const removeLabel = useCallback(
    (index: number) => {
      if (labels.length > 1) {
        setLabels(labels.filter((_, i) => i !== index));
      }
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
      if (annotations.length > 1) {
        setAnnotations(annotations.filter((_, i) => i !== index));
      }
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
                { label: 'Nodes', href: '/container/nodes' },
                { label: `Edit: ${nodeName}` },
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
            <VStack gap={6}>
              {/* Page Header */}
              <div className="flex items-center justify-between min-h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Node: {nodeName}
                </h1>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full items-start">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" />
                    <SectionCard.Content>
                      <VStack gap={4}>
                        {/* Node Name (Read-only) */}
                        <VStack gap={2}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Node Name<span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Input
                            value={nodeName}
                            disabled
                            fullWidth
                            className="bg-[var(--color-surface-muted)]"
                          />
                        </VStack>

                        {/* Description with Disclosure */}
                        <Disclosure defaultOpen={false}>
                          <Disclosure.Trigger>Description</Disclosure.Trigger>
                          <Disclosure.Panel>
                            <div className="pt-2">
                              <Input
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                              />
                            </div>
                          </Disclosure.Panel>
                        </Disclosure>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Taints Section */}
                  <SectionCard>
                    <SectionCard.Header title="Taints" />
                    <SectionCard.Content>
                      <VStack gap={3}>
                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {taints.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Key
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Effect
                                </span>
                                <div />
                              </div>
                            )}
                            {taints.map((taint, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="input key"
                                  value={taint.key}
                                  onChange={(e) => updateTaint(index, 'key', e.target.value)}
                                  fullWidth
                                />
                                <Input
                                  placeholder="input value"
                                  value={taint.value}
                                  onChange={(e) => updateTaint(index, 'value', e.target.value)}
                                  fullWidth
                                />
                                <Select
                                  options={TAINT_EFFECT_OPTIONS}
                                  value={taint.effect}
                                  onChange={(value) => updateTaint(index, 'effect', value)}
                                  placeholder="Select effect"
                                  fullWidth
                                />
                                <button
                                  onClick={() => removeTaint(index)}
                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                >
                                  <IconX
                                    size={16}
                                    className="text-[var(--color-text-muted)]"
                                    stroke={1.5}
                                  />
                                </button>
                              </div>
                            ))}
                            <div className="w-fit">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                onClick={addTaint}
                              >
                                Add Taint
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Labels & Annotations Section */}
                  <SectionCard>
                    <SectionCard.Header title="Labels & Annotations" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Labels */}
                        <VStack gap={3}>
                          <VStack gap={1.5}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Labels
                            </span>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the labels used to identify and categorize the node.
                            </p>
                          </VStack>

                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={3}>
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
                                    placeholder="label key"
                                    value={label.key}
                                    onChange={(e) => updateLabel(index, 'key', e.target.value)}
                                    fullWidth
                                  />
                                  <Input
                                    placeholder="label value"
                                    value={label.value}
                                    onChange={(e) => updateLabel(index, 'value', e.target.value)}
                                    fullWidth
                                  />
                                  <button
                                    onClick={() => removeLabel(index)}
                                    className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  >
                                    <IconX
                                      size={16}
                                      className="text-[var(--color-text-muted)]"
                                      stroke={1.5}
                                    />
                                  </button>
                                </div>
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
                          </div>
                        </VStack>

                        {/* Annotations */}
                        <VStack gap={3}>
                          <VStack gap={1.5}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Annotations
                            </span>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Add annotations to store non-identifying metadata.
                            </p>
                          </VStack>

                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={3}>
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
                                    placeholder="annotation key"
                                    value={annotation.key}
                                    onChange={(e) => updateAnnotation(index, 'key', e.target.value)}
                                    fullWidth
                                  />
                                  <Input
                                    placeholder="annotation value"
                                    value={annotation.value}
                                    onChange={(e) =>
                                      updateAnnotation(index, 'value', e.target.value)
                                    }
                                    fullWidth
                                  />
                                  <button
                                    onClick={() => removeAnnotation(index)}
                                    className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  >
                                    <IconX
                                      size={16}
                                      className="text-[var(--color-text-muted)]"
                                      stroke={1.5}
                                    />
                                  </button>
                                </div>
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
                          </div>
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar
                  nodeName={nodeName}
                  description={description}
                  taints={taints}
                  labels={labels}
                  annotations={annotations}
                  onCancel={handleCancel}
                  onSave={handleSave}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditNodeConfigPage;
