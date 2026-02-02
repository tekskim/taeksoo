import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  NumberInput,
  Select,
  Disclosure,
  SectionCard,
  Checkbox,
  InlineMessage,
} from '@/design-system';
import type { WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconSearch,
  IconX,
  IconCheck,
  IconCirclePlus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type HPASectionStep = 'basic-info' | 'target' | 'behavior' | 'metrics' | 'labels-annotations';

// Section labels for display
const HPA_SECTION_LABELS: Record<HPASectionStep, string> = {
  'basic-info': 'Basic Information',
  target: 'Target',
  behavior: 'Behavior',
  metrics: 'Metrics',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const HPA_SECTION_ORDER: HPASectionStep[] = [
  'basic-info',
  'target',
  'behavior',
  'metrics',
  'labels-annotations',
];

// Namespace options
const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'production', label: 'production' },
];

// Target Reference options
const TARGET_REFERENCE_OPTIONS = [
  { value: '', label: '' },
  { value: 'deployment/nginx', label: 'Deployment/nginx' },
  { value: 'deployment/frontend', label: 'Deployment/frontend' },
  { value: 'deployment/backend', label: 'Deployment/backend' },
  { value: 'statefulset/mysql', label: 'StatefulSet/mysql' },
  { value: 'replicaset/worker', label: 'ReplicaSet/worker' },
];

// Metric Source options
const METRIC_SOURCE_OPTIONS = [
  { value: 'Resource', label: 'Resource' },
  { value: 'External', label: 'External' },
  { value: 'Pods', label: 'Pods' },
  { value: 'Object', label: 'Object' },
  { value: 'ContainerResource', label: 'Container Resource' },
];

// Resource Name options
const RESOURCE_NAME_OPTIONS = [
  { value: 'CPU', label: 'CPU' },
  { value: 'Memory', label: 'Memory' },
];

// Type options
const TYPE_OPTIONS = [
  { value: 'AverageUtilization', label: 'Average Utilization' },
  { value: 'AverageValue', label: 'Average Value' },
  { value: 'Value', label: 'Value' },
];

// Operator options
const OPERATOR_OPTIONS = [
  { value: 'In', label: 'in list' },
  { value: 'NotIn', label: 'not in list' },
  { value: 'Exists', label: 'exists' },
  { value: 'DoesNotExist', label: 'does not exist' },
];

interface Label {
  id: string;
  key: string;
  value: string;
}

interface Annotation {
  id: string;
  key: string;
  value: string;
}

interface MetricSelector {
  id: string;
  key: string;
  operator: string;
  value: string;
}

interface Metric {
  id: string;
  source: string;
  resourceName: string;
  type: string;
  quantity: number;
  metricName: string;
  referentApiVersion: string;
  referentKind: string;
  referentName: string;
  selectors: MetricSelector[];
}

/* ----------------------------------------
   Summary Status Icon Component
   ---------------------------------------- */
function SummaryStatusIcon({ status }: { status: WizardSectionState }) {
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
  sections: HPASectionStep[];
  sectionLabels: Record<HPASectionStep, string>;
  sectionStates: Record<HPASectionStep, WizardSectionState>;
  onCancel: () => void;
  onSubmit: () => void;
}

function SummarySidebar({
  sections,
  sectionLabels,
  sectionStates,
  onCancel,
  onSubmit,
}: SummarySidebarProps) {
  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Summary Content */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Title */}
            <span className="text-heading-h5 text-[var(--color-text-default)]">Summary</span>

            <VStack gap={0}>
              {sections.map((section) => {
                const status = sectionStates[section];
                return (
                  <HStack key={section} justify="between" align="center" className="py-1">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {sectionLabels[section]}
                    </span>
                    {status === 'writing' ? (
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Writing...
                      </span>
                    ) : (
                      <SummaryStatusIcon status={status} />
                    )}
                  </HStack>
                );
              })}
            </VStack>
          </VStack>
        </div>

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} className="flex-1">
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */
export default function CreateHPAPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab } = useTabs();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Form state
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(true);

  // Target state
  const [targetReference, setTargetReference] = useState('');
  const [minReplicas, setMinReplicas] = useState(1);
  const [maxReplicas, setMaxReplicas] = useState(10);

  // Behavior state
  const [scaleDownBehavior, setScaleDownBehavior] = useState(false);
  const [scaleUpBehavior, setScaleUpBehavior] = useState(false);

  // Metrics state
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: '1',
      source: 'Resource',
      resourceName: 'CPU',
      type: 'AverageUtilization',
      quantity: 1,
      metricName: '',
      referentApiVersion: '',
      referentKind: '',
      referentName: '',
      selectors: [],
    },
  ]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Section states for summary
  const getSectionStates = (): Record<HPASectionStep, WizardSectionState> => {
    return {
      'basic-info': namespace && name ? 'done' : 'active',
      target: targetReference ? 'done' : 'pre',
      behavior: 'pre',
      metrics: metrics.length > 0 ? 'done' : 'pre',
      'labels-annotations': 'pre',
    };
  };

  // Metrics handlers
  const addMetric = useCallback(() => {
    setMetrics((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        source: 'Resource',
        resourceName: 'CPU',
        type: 'AverageUtilization',
        quantity: 1,
        metricName: '',
        referentApiVersion: '',
        referentKind: '',
        referentName: '',
        selectors: [],
      },
    ]);
  }, []);

  const removeMetric = useCallback((id: string) => {
    setMetrics((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateMetric = useCallback(
    (id: string, field: keyof Metric, value: string | number | MetricSelector[]) => {
      setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
    },
    []
  );

  const addMetricSelector = useCallback((metricId: string) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m.id === metricId
          ? {
              ...m,
              selectors: [
                ...m.selectors,
                { id: Date.now().toString(), key: '', operator: 'In', value: '' },
              ],
            }
          : m
      )
    );
  }, []);

  const removeMetricSelector = useCallback((metricId: string, selectorId: string) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m.id === metricId ? { ...m, selectors: m.selectors.filter((s) => s.id !== selectorId) } : m
      )
    );
  }, []);

  const updateMetricSelector = useCallback(
    (metricId: string, selectorId: string, field: keyof MetricSelector, value: string) => {
      setMetrics((prev) =>
        prev.map((m) =>
          m.id === metricId
            ? {
                ...m,
                selectors: m.selectors.map((s) =>
                  s.id === selectorId ? { ...s, [field]: value } : s
                ),
              }
            : m
        )
      );
    },
    []
  );

  // Labels handlers
  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  // Annotations handlers
  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnotation = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }, []);

  const handleCancel = () => {
    navigate('/container/hpa');
  };

  const handleSubmit = () => {
    console.log('Creating HPA:', {
      namespace,
      name,
      description,
      targetReference,
      minReplicas,
      maxReplicas,
      scaleDownBehavior,
      scaleUpBehavior,
      metrics,
      labels,
      annotations,
    });
    navigate('/container/hpa');
  };

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
          tabs={tabs.map((tab) => ({
            id: tab.id,
            label: tab.label,
            closable: tab.closable,
          }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
        />

        {/* Top Bar */}
        <TopBar
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Service Discovery', href: '/container' },
                { label: 'Horizontal Pod Autoscalers', href: '/container/hpa' },
                { label: 'Create', href: '/container/hpa/create' },
              ]}
            />
          }
          rightContent={
            <HStack gap={1}>
              <button className="p-2 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" />
              </button>
              <button className="p-2 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" />
              </button>
              <button className="p-2 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" />
              </button>
            </HStack>
          }
        />

        {/* Page Content */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Page Header */}
              <VStack gap={2}>
                <h1 className="text-heading-h4 text-[var(--color-text-default)]">
                  Create Horizontal Pod Autoscaler
                </h1>
                <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
                  Horizontal Pod Autoscaler automatically adjusts the number of running Pods based
                  on real-time resource usage to maintain stable application performance.
                </p>
              </VStack>

              {/* Form Content with Summary */}
              <HStack gap={6} className="w-full items-start">
                {/* Form Sections */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Namespace */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            Namespace <span className="text-[var(--color-state-danger)]">*</span>
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
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            Name <span className="text-[var(--color-state-danger)]">*</span>
                          </label>
                          <Input
                            placeholder="Enter a unique name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                          />
                        </VStack>

                        {/* Description with Disclosure */}
                        <VStack gap={2}>
                          <Disclosure defaultOpen={showDescription}>
                            <Disclosure.Trigger className="flex items-center gap-1.5">
                              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                Description
                              </span>
                            </Disclosure.Trigger>
                            <Disclosure.Panel className="pt-2">
                              <Input
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                              />
                            </Disclosure.Panel>
                          </Disclosure>
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Target Section */}
                  <SectionCard>
                    <SectionCard.Header title="Target" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Target Reference */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            Target Reference{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </label>
                          <Select
                            options={TARGET_REFERENCE_OPTIONS}
                            value={targetReference}
                            onChange={setTargetReference}
                            fullWidth
                          />
                        </VStack>

                        {/* Min/Max Replicas */}
                        <HStack gap={3} className="w-full">
                          <VStack gap={2} className="flex-1">
                            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Minimum Replicas{' '}
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </label>
                            <NumberInput
                              value={minReplicas}
                              onChange={setMinReplicas}
                              min={1}
                              fullWidth
                            />
                          </VStack>
                          <VStack gap={2} className="flex-1">
                            <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-4">
                              Maximum Replicas{' '}
                              <span className="text-[var(--color-state-danger)]">*</span>
                            </label>
                            <NumberInput
                              value={maxReplicas}
                              onChange={setMaxReplicas}
                              min={1}
                              fullWidth
                            />
                          </VStack>
                        </HStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Behavior Section */}
                  <SectionCard>
                    <SectionCard.Header title="Behavior" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Scale down behavior */}
                        <VStack gap={3}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            Scale down behavior
                          </label>
                          <Checkbox
                            checked={scaleDownBehavior}
                            onChange={setScaleDownBehavior}
                            label="Configure scale down behavior"
                          />
                        </VStack>

                        {/* Scale up behavior */}
                        <VStack gap={3}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            Scale up behavior
                          </label>
                          <Checkbox
                            checked={scaleUpBehavior}
                            onChange={setScaleUpBehavior}
                            label="Configure scale up behavior"
                          />
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Metrics Sections */}
                  {metrics.map((metric, index) => (
                    <SectionCard key={metric.id}>
                      <SectionCard.Header title="Metrics" />
                      <SectionCard.Content>
                        <VStack gap={6}>
                          <VStack gap={2}>
                            {/* Warning Messages */}
                            <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                              <VStack gap={6}>
                                {metric.source === 'External' && (
                                  <InlineMessage variant="warning">
                                    In order to use external metrics with HPA, you need to deploy
                                    the external metrics server such as prometheus adapter.
                                  </InlineMessage>
                                )}
                                <InlineMessage variant="warning">
                                  The selected target reference does not have the correct resource
                                  requests on the spec. Without this the HPA metric will have no
                                  effect.
                                </InlineMessage>

                                {/* Source */}
                                <VStack gap={2}>
                                  <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                    Source
                                  </label>
                                  <Select
                                    options={METRIC_SOURCE_OPTIONS}
                                    value={metric.source}
                                    onChange={(value) => updateMetric(metric.id, 'source', value)}
                                    fullWidth
                                  />
                                </VStack>

                                {/* Resource Name (for Resource source) */}
                                {metric.source === 'Resource' && (
                                  <VStack gap={2}>
                                    <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                      Resource Name
                                    </label>
                                    <Select
                                      options={RESOURCE_NAME_OPTIONS}
                                      value={metric.resourceName}
                                      onChange={(value) =>
                                        updateMetric(metric.id, 'resourceName', value)
                                      }
                                      fullWidth
                                    />
                                  </VStack>
                                )}

                                {/* Type and Quantity */}
                                <HStack gap={3} className="w-full">
                                  <VStack gap={2} className="flex-1">
                                    <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                      Type
                                    </label>
                                    <Select
                                      options={TYPE_OPTIONS}
                                      value={metric.type}
                                      onChange={(value) => updateMetric(metric.id, 'type', value)}
                                      fullWidth
                                    />
                                  </VStack>
                                  <VStack gap={2} className="flex-1">
                                    <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                      Quantity{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </label>
                                    <HStack gap={2} align="center" className="w-full">
                                      <Input
                                        value={metric.quantity.toString()}
                                        onChange={(e) =>
                                          updateMetric(
                                            metric.id,
                                            'quantity',
                                            parseInt(e.target.value) || 0
                                          )
                                        }
                                        fullWidth
                                      />
                                      {metric.type === 'AverageUtilization' && (
                                        <span className="text-[12px] text-[var(--color-text-default)]">
                                          %
                                        </span>
                                      )}
                                    </HStack>
                                  </VStack>
                                </HStack>

                                {/* External metrics specific fields */}
                                {metric.source === 'External' && (
                                  <>
                                    <VStack gap={2}>
                                      <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                        Metric Name{' '}
                                        <span className="text-[var(--color-state-danger)]">*</span>
                                      </label>
                                      <Input
                                        placeholder="e.g. packet-per-second"
                                        value={metric.metricName}
                                        onChange={(e) =>
                                          updateMetric(metric.id, 'metricName', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>

                                    {/* Metric Selector */}
                                    <VStack gap={2}>
                                      <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                        Metric Selector
                                      </label>
                                      <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                        <VStack gap={2}>
                                          {metric.selectors.map((selector) => (
                                            <div
                                              key={selector.id}
                                              className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                            >
                                              <div className="grid grid-cols-[1fr_1fr_1fr_16px] gap-2 w-full items-start">
                                                <VStack gap={2}>
                                                  <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                                    Key
                                                  </label>
                                                  <Input
                                                    placeholder="Input Key"
                                                    value={selector.key}
                                                    onChange={(e) =>
                                                      updateMetricSelector(
                                                        metric.id,
                                                        selector.id,
                                                        'key',
                                                        e.target.value
                                                      )
                                                    }
                                                    fullWidth
                                                  />
                                                </VStack>
                                                <VStack gap={2}>
                                                  <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                                    Operator
                                                  </label>
                                                  <Select
                                                    options={OPERATOR_OPTIONS}
                                                    value={selector.operator}
                                                    onChange={(value) =>
                                                      updateMetricSelector(
                                                        metric.id,
                                                        selector.id,
                                                        'operator',
                                                        value
                                                      )
                                                    }
                                                    fullWidth
                                                  />
                                                </VStack>
                                                <VStack gap={2}>
                                                  <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                                    Value
                                                  </label>
                                                  <Input
                                                    placeholder="input value"
                                                    value={selector.value}
                                                    onChange={(e) =>
                                                      updateMetricSelector(
                                                        metric.id,
                                                        selector.id,
                                                        'value',
                                                        e.target.value
                                                      )
                                                    }
                                                    fullWidth
                                                  />
                                                </VStack>
                                                <button
                                                  onClick={() =>
                                                    removeMetricSelector(metric.id, selector.id)
                                                  }
                                                  className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                                >
                                                  <IconX
                                                    size={12}
                                                    className="text-[var(--color-text-muted)]"
                                                    stroke={1.5}
                                                  />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                          <div className="w-fit">
                                            <Button
                                              variant="secondary"
                                              size="sm"
                                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                              onClick={() => addMetricSelector(metric.id)}
                                            >
                                              Add Rule
                                            </Button>
                                          </div>
                                        </VStack>
                                      </div>
                                    </VStack>
                                  </>
                                )}
                              </VStack>
                            </div>

                            {/* Add a new row button */}
                            <div className="w-fit">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                onClick={addMetric}
                              >
                                Add a new row
                              </Button>
                            </div>
                          </VStack>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>
                  ))}

                  {/* Labels & Annotations Section */}
                  <SectionCard>
                    <SectionCard.Header title="Labels & Annotations" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Labels */}
                        <VStack gap={3}>
                          <VStack gap={1}>
                            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Labels
                            </label>
                            <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
                              Specify the labels used to identify and categorize the resource.
                            </p>
                          </VStack>
                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={3}>
                              {labels.map((label) => (
                                <div
                                  key={label.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                >
                                  <div className="grid grid-cols-[1fr_1fr_16px] gap-2 w-full items-start">
                                    <VStack gap={2}>
                                      <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                        Key
                                      </label>
                                      <Input
                                        placeholder="e.g. key"
                                        value={label.key}
                                        onChange={(e) =>
                                          updateLabel(label.id, 'key', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <VStack gap={2}>
                                      <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                        Value
                                      </label>
                                      <Input
                                        placeholder="e.g. value"
                                        value={label.value}
                                        onChange={(e) =>
                                          updateLabel(label.id, 'value', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <button
                                      onClick={() => removeLabel(label.id)}
                                      className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                    >
                                      <IconX
                                        size={12}
                                        className="text-[var(--color-text-muted)]"
                                        stroke={1.5}
                                      />
                                    </button>
                                  </div>
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
                          <VStack gap={1}>
                            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Annotations
                            </label>
                            <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
                              Specify the annotations used to provide additional metadata for the
                              resource.
                            </p>
                          </VStack>
                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={3}>
                              {annotations.map((annotation) => (
                                <div
                                  key={annotation.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                >
                                  <div className="grid grid-cols-[1fr_1fr_16px] gap-2 w-full items-start">
                                    <VStack gap={2}>
                                      <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                        Key
                                      </label>
                                      <Input
                                        placeholder="e.g. key"
                                        value={annotation.key}
                                        onChange={(e) =>
                                          updateAnnotation(annotation.id, 'key', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <VStack gap={2}>
                                      <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                        Value
                                      </label>
                                      <Input
                                        placeholder="e.g. value"
                                        value={annotation.value}
                                        onChange={(e) =>
                                          updateAnnotation(annotation.id, 'value', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <button
                                      onClick={() => removeAnnotation(annotation.id)}
                                      className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                    >
                                      <IconX
                                        size={12}
                                        className="text-[var(--color-text-muted)]"
                                        stroke={1.5}
                                      />
                                    </button>
                                  </div>
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
                  sections={HPA_SECTION_ORDER}
                  sectionLabels={HPA_SECTION_LABELS}
                  sectionStates={getSectionStates()}
                  onCancel={handleCancel}
                  onSubmit={handleSubmit}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
