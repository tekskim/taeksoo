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
  FormField,
  PageShell,
} from '@/design-system';
import type { WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useIsV2 } from '@/hooks/useIsV2';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconSearch,
  IconX,
  IconCheck,
  IconCirclePlus,
  IconPencilCog,
  IconKey,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type HPASectionStep = 'basic-info' | 'target' | 'behavior' | 'metrics' | 'labels-annotations';

// Section labels for display
const HPA_SECTION_LABELS: Record<HPASectionStep, string> = {
  'basic-info': 'Basic information',
  target: 'Target',
  behavior: 'Behavior',
  metrics: 'Metrics',
  'labels-annotations': 'Labels & annotations',
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

// Target reference options
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

// Scaling Policy Type options
const SCALING_POLICY_TYPE_OPTIONS = [
  { value: 'Pods', label: 'Pods' },
  { value: 'Percent', label: 'Percent' },
];

// Select Policy options
const SELECT_POLICY_OPTIONS = [
  { value: 'Max', label: 'Max' },
  { value: 'Min', label: 'Min' },
  { value: 'Disabled', label: 'Disabled' },
];

// Operator options
const OPERATOR_OPTIONS = [
  { value: 'In', label: 'in list' },
  { value: 'NotIn', label: 'not in list' },
  { value: 'Exists', label: 'exists' },
  { value: 'DoesNotExist', label: 'does not exist' },
];

interface ScalingPolicy {
  id: string;
  type: string;
  value: number;
  periodSeconds: number;
}

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
          <Button variant="secondary" onClick={onCancel}>
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
  const isV2 = useIsV2();
  const { tabs, activeTabId, selectTab, closeTab } = useTabs();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Form state
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(isV2);

  // Target state
  const [targetReference, setTargetReference] = useState('');
  const [minReplicas, setMinReplicas] = useState(1);
  const [maxReplicas, setMaxReplicas] = useState(10);

  // Behavior state
  const [scaleDownBehavior, setScaleDownBehavior] = useState(true);
  const [scaleDownPolicies, setScaleDownPolicies] = useState<ScalingPolicy[]>([
    { id: 'initial-sd-policy', type: '', value: 0, periodSeconds: 0 },
  ]);
  const [scaleDownSelectPolicy, setScaleDownSelectPolicy] = useState('Max');
  const [scaleDownStabilization, setScaleDownStabilization] = useState(300);
  const [scaleUpBehavior, setScaleUpBehavior] = useState(true);
  const [scaleUpPolicies, setScaleUpPolicies] = useState<ScalingPolicy[]>([
    { id: 'initial-su-policy', type: '', value: 0, periodSeconds: 0 },
  ]);
  const [scaleUpSelectPolicy, setScaleUpSelectPolicy] = useState('Max');
  const [scaleUpStabilization, setScaleUpStabilization] = useState(300);

  // Metrics state
  const [metrics, setMetrics] = useState<Metric[]>(
    isV2
      ? [
          {
            id: 'metric-resource',
            source: 'Resource',
            resourceName: 'CPU',
            type: 'AverageUtilization',
            quantity: 80,
            metricName: '',
            referentApiVersion: '',
            referentKind: '',
            referentName: '',
            selectors: [{ id: 'sel-resource', key: '', operator: 'In', value: '' }],
          },
          {
            id: 'metric-external',
            source: 'External',
            resourceName: '',
            type: 'AverageUtilization',
            quantity: 80,
            metricName: '',
            referentApiVersion: '',
            referentKind: '',
            referentName: '',
            selectors: [{ id: 'sel-external', key: '', operator: 'In', value: '' }],
          },
          {
            id: 'metric-pods',
            source: 'Pods',
            resourceName: '',
            type: 'AverageUtilization',
            quantity: 80,
            metricName: '',
            referentApiVersion: '',
            referentKind: '',
            referentName: '',
            selectors: [{ id: 'sel-pods', key: '', operator: 'In', value: '' }],
          },
          {
            id: 'metric-object',
            source: 'Object',
            resourceName: '',
            type: 'AverageUtilization',
            quantity: 80,
            metricName: '',
            referentApiVersion: '',
            referentKind: '',
            referentName: '',
            selectors: [{ id: 'sel-object', key: '', operator: 'In', value: '' }],
          },
        ]
      : []
  );

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(
    isV2 ? [{ id: Date.now().toString(), key: '', value: '' }] : []
  );
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ id: (Date.now() + 1).toString(), key: '', value: '' }] : []
  );

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

  // Scaling policy handlers
  const addScaleDownPolicy = useCallback(() => {
    setScaleDownPolicies((prev) => [
      ...prev,
      { id: Date.now().toString(), type: '', value: 0, periodSeconds: 0 },
    ]);
  }, []);

  const removeScaleDownPolicy = useCallback((id: string) => {
    setScaleDownPolicies((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateScaleDownPolicy = useCallback(
    (id: string, field: keyof ScalingPolicy, value: string | number) => {
      setScaleDownPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    },
    []
  );

  const addScaleUpPolicy = useCallback(() => {
    setScaleUpPolicies((prev) => [
      ...prev,
      { id: Date.now().toString(), type: '', value: 0, periodSeconds: 0 },
    ]);
  }, []);

  const removeScaleUpPolicy = useCallback((id: string) => {
    setScaleUpPolicies((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateScaleUpPolicy = useCallback(
    (id: string, field: keyof ScalingPolicy, value: string | number) => {
      setScaleUpPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    },
    []
  );

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
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
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
                { label: 'Service Discovery', href: '/container' },
                { label: 'Horizontal Pod Autoscalers', href: '/container/hpa' },
                { label: 'Create horizontal pod autoscaler', href: '/container/hpa/create' },
              ]}
            />
          }
          actions={
            <HStack gap={1}>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
                aria-label="Customize cluster appearance"
              >
                <IconPencilCog size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button
                className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                onClick={() => window.dispatchEvent(new CustomEvent('open-access-token'))}
                aria-label="Access Token"
              >
                <IconKey size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" />
              </button>
            </HStack>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={2}>
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">
            Create horizontal pod autoscaler
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Horizontal Pod Autoscaler automatically adjusts the number of running Pods based on
            real-time resource usage to maintain stable application performance.
          </p>
        </VStack>

        {/* Form Content with Summary */}
        <HStack gap={6} className="w-full items-start">
          {/* Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information Section */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Basic information" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Namespace */}
                  <FormField required>
                    <FormField.Label>Namespace</FormField.Label>
                    <FormField.Control>
                      <Select
                        options={NAMESPACE_OPTIONS}
                        value={namespace}
                        onChange={setNamespace}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>

                  {/* Name */}
                  <FormField required>
                    <FormField.Label>Name</FormField.Label>
                    <FormField.Control>
                      <Input
                        placeholder="Enter a unique name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>

                  {/* Description with Disclosure */}
                  <VStack gap={2}>
                    <Disclosure defaultOpen={showDescription}>
                      <Disclosure.Trigger className="flex items-center gap-1.5">
                        <span className="text-label-lg text-[var(--color-text-default)]">
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
            <SectionCard className="pb-4">
              <SectionCard.Header title="Target" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Target reference */}
                  <FormField required>
                    <FormField.Label>Target reference</FormField.Label>
                    <FormField.Control>
                      <Select
                        options={TARGET_REFERENCE_OPTIONS}
                        value={targetReference}
                        onChange={setTargetReference}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>

                  {/* Min/Max Replicas */}
                  <VStack gap={6}>
                    <FormField label="Minimum replicas" required>
                      <NumberInput
                        value={minReplicas}
                        onChange={setMinReplicas}
                        min={1}
                        width="sm"
                      />
                    </FormField>
                    <FormField label="Maximum Replicas" required>
                      <NumberInput
                        value={maxReplicas}
                        onChange={setMaxReplicas}
                        min={1}
                        width="sm"
                      />
                    </FormField>
                  </VStack>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Behavior Section */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Behavior" />
              <SectionCard.Content>
                <HStack gap={6} className="w-full items-start">
                  {/* Scale down behavior */}
                  <VStack gap={3} className="flex-1">
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Scale down behavior
                    </label>
                    <Checkbox
                      checked={scaleDownBehavior}
                      onChange={setScaleDownBehavior}
                      label="Configure scale down behavior"
                    />

                    {scaleDownBehavior && (
                      <VStack gap={6} className="mt-1">
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <VStack gap={1.5}>
                            {scaleDownPolicies.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Type <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Value <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Period seconds{' '}
                                  <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <div className="w-5" />
                              </div>
                            )}
                            {scaleDownPolicies.map((policy) => (
                              <div
                                key={policy.id}
                                className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                              >
                                <Select
                                  options={SCALING_POLICY_TYPE_OPTIONS}
                                  value={policy.type}
                                  onChange={(val) => updateScaleDownPolicy(policy.id, 'type', val)}
                                  placeholder="Select type"
                                  fullWidth
                                />
                                <NumberInput
                                  value={policy.value}
                                  onChange={(val) => updateScaleDownPolicy(policy.id, 'value', val)}
                                  min={0}
                                  width="full"
                                />
                                <NumberInput
                                  value={policy.periodSeconds}
                                  onChange={(val) =>
                                    updateScaleDownPolicy(policy.id, 'periodSeconds', val)
                                  }
                                  min={0}
                                  width="full"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeScaleDownPolicy(policy.id)}
                                  className="flex items-center justify-center w-5 h-5 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors"
                                >
                                  <IconX size={14} />
                                </button>
                              </div>
                            ))}
                            <div className="w-fit">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconCirclePlus size={12} />}
                                onClick={addScaleDownPolicy}
                              >
                                Add policy
                              </Button>
                            </div>
                          </VStack>
                        </div>

                        <FormField label="Select policy">
                          <Select
                            options={SELECT_POLICY_OPTIONS}
                            value={scaleDownSelectPolicy}
                            onChange={setScaleDownSelectPolicy}
                            fullWidth
                          />
                        </FormField>
                        <FormField label="Stabilization window seconds">
                          <NumberInput
                            value={scaleDownStabilization}
                            onChange={setScaleDownStabilization}
                            min={0}
                            width="sm"
                          />
                        </FormField>
                      </VStack>
                    )}
                  </VStack>

                  {/* Scale up behavior */}
                  <VStack gap={3} className="flex-1">
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Scale up behavior
                    </label>
                    <Checkbox
                      checked={scaleUpBehavior}
                      onChange={setScaleUpBehavior}
                      label="Configure scale up behavior"
                    />

                    {scaleUpBehavior && (
                      <VStack gap={6} className="mt-1">
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <VStack gap={1.5}>
                            {scaleUpPolicies.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Type <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Value <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Period seconds{' '}
                                  <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <div className="w-5" />
                              </div>
                            )}
                            {scaleUpPolicies.map((policy) => (
                              <div
                                key={policy.id}
                                className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                              >
                                <Select
                                  options={SCALING_POLICY_TYPE_OPTIONS}
                                  value={policy.type}
                                  onChange={(val) => updateScaleUpPolicy(policy.id, 'type', val)}
                                  placeholder="Select type"
                                  fullWidth
                                />
                                <NumberInput
                                  value={policy.value}
                                  onChange={(val) => updateScaleUpPolicy(policy.id, 'value', val)}
                                  min={0}
                                  width="full"
                                />
                                <NumberInput
                                  value={policy.periodSeconds}
                                  onChange={(val) =>
                                    updateScaleUpPolicy(policy.id, 'periodSeconds', val)
                                  }
                                  min={0}
                                  width="full"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeScaleUpPolicy(policy.id)}
                                  className="flex items-center justify-center w-5 h-5 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors"
                                >
                                  <IconX size={14} />
                                </button>
                              </div>
                            ))}
                            <div className="w-fit">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconCirclePlus size={12} />}
                                onClick={addScaleUpPolicy}
                              >
                                Add policy
                              </Button>
                            </div>
                          </VStack>
                        </div>

                        <FormField label="Select policy">
                          <Select
                            options={SELECT_POLICY_OPTIONS}
                            value={scaleUpSelectPolicy}
                            onChange={setScaleUpSelectPolicy}
                            fullWidth
                          />
                        </FormField>
                        <FormField label="Stabilization window seconds">
                          <NumberInput
                            value={scaleUpStabilization}
                            onChange={setScaleUpStabilization}
                            min={0}
                            width="sm"
                          />
                        </FormField>
                      </VStack>
                    )}
                  </VStack>
                </HStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Metrics Section */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Metrics" />
              <SectionCard.Content>
                <VStack gap={2}>
                  {/* Metric rows */}
                  {metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                    >
                      <VStack gap={6}>
                        <HStack justify="between" align="start" className="w-full">
                          <VStack gap={2} className="items-start">
                            {(metric.source === 'External' ||
                              metric.source === 'Pods' ||
                              metric.source === 'Object') && (
                              <div className="w-fit mt-1">
                                <InlineMessage variant="warning">
                                  In order to use external metrics with HPA, you need to deploy the
                                  external metrics server such as prometheus adapter.
                                </InlineMessage>
                              </div>
                            )}
                            <div className="w-fit mt-1">
                              <InlineMessage variant="warning">
                                The selected target reference does not have the correct resource
                                requests on the spec. Without this the HPA metric will have no
                                effect.
                              </InlineMessage>
                            </div>
                          </VStack>
                          <button
                            onClick={() => removeMetric(metric.id)}
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        </HStack>

                        {/* Source */}
                        <FormField>
                          <FormField.Label>Source</FormField.Label>
                          <FormField.Control>
                            <Select
                              options={METRIC_SOURCE_OPTIONS}
                              value={metric.source}
                              onChange={(value) => updateMetric(metric.id, 'source', value)}
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>

                        {/* Resource Name (for Resource source) */}
                        {metric.source === 'Resource' && (
                          <FormField label="Resource name">
                            <Select
                              options={RESOURCE_NAME_OPTIONS}
                              value={metric.resourceName}
                              onChange={(value) => updateMetric(metric.id, 'resourceName', value)}
                              fullWidth
                            />
                          </FormField>
                        )}

                        {/* Type */}
                        <VStack gap={2}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Type
                          </label>
                          <Select
                            options={TYPE_OPTIONS}
                            value={metric.type}
                            onChange={(value) => updateMetric(metric.id, 'type', value)}
                            fullWidth
                          />
                        </VStack>

                        {/* Quantity */}
                        <VStack gap={2}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Quantity <span className="text-[var(--color-state-danger)]">*</span>
                          </label>
                          <NumberInput
                            value={metric.quantity}
                            onChange={(val) => updateMetric(metric.id, 'quantity', val)}
                            min={0}
                            step={1}
                            width="sm"
                            suffix={metric.type === 'AverageUtilization' ? '%' : undefined}
                          />
                        </VStack>

                        {/* Object referent fields */}
                        {metric.source === 'Object' && (
                          <>
                            <VStack gap={2}>
                              <label className="text-label-lg text-[var(--color-text-default)]">
                                Referent API version{' '}
                                <span className="text-[var(--color-state-danger)]">*</span>
                              </label>
                              <Input
                                placeholder="e.g. apps/v1"
                                value={metric.referentApiVersion}
                                onChange={(e) =>
                                  updateMetric(metric.id, 'referentApiVersion', e.target.value)
                                }
                                fullWidth
                              />
                            </VStack>

                            <VStack gap={2}>
                              <label className="text-label-lg text-[var(--color-text-default)]">
                                Referent kind{' '}
                                <span className="text-[var(--color-state-danger)]">*</span>
                              </label>
                              <Input
                                placeholder="e.g. Deployment"
                                value={metric.referentKind}
                                onChange={(e) =>
                                  updateMetric(metric.id, 'referentKind', e.target.value)
                                }
                                fullWidth
                              />
                            </VStack>

                            <VStack gap={2}>
                              <label className="text-label-lg text-[var(--color-text-default)]">
                                Referent name{' '}
                                <span className="text-[var(--color-state-danger)]">*</span>
                              </label>
                              <Input
                                placeholder="e.g. my-deployment"
                                value={metric.referentName}
                                onChange={(e) =>
                                  updateMetric(metric.id, 'referentName', e.target.value)
                                }
                                fullWidth
                              />
                            </VStack>
                          </>
                        )}

                        {/* Non-Resource metrics fields */}
                        {metric.source !== 'Resource' && (
                          <>
                            <VStack gap={2}>
                              <label className="text-label-lg text-[var(--color-text-default)]">
                                Metric name{' '}
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
                              <label className="text-label-lg text-[var(--color-text-default)]">
                                Metric Selector
                              </label>
                              <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                <VStack gap={1.5}>
                                  {metric.selectors.length > 0 && (
                                    <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                                      <label className="text-label-sm text-[var(--color-text-default)]">
                                        Key
                                      </label>
                                      <label className="text-label-sm text-[var(--color-text-default)]">
                                        Operator
                                      </label>
                                      <label className="text-label-sm text-[var(--color-text-default)]">
                                        Value
                                      </label>
                                      <div className="w-5" />
                                    </div>
                                  )}
                                  {metric.selectors.map((selector) => (
                                    <div
                                      key={selector.id}
                                      className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                                    >
                                      <Input
                                        placeholder="Input key"
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
                                      <button
                                        onClick={() => removeMetricSelector(metric.id, selector.id)}
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
                                      onClick={() => addMetricSelector(metric.id)}
                                    >
                                      Add rule
                                    </Button>
                                  </div>
                                </VStack>
                              </div>
                            </VStack>
                          </>
                        )}
                      </VStack>
                    </div>
                  ))}

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
              </SectionCard.Content>
            </SectionCard>

            {/* Labels & Annotations Section */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Labels & annotations" />
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
                        <VStack gap={3}>
                          {labels.length > 0 && (
                            <VStack gap={2} className="w-full">
                              {/* Header row */}
                              <div className="grid grid-cols-[1fr_1fr_23px] gap-1">
                                <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                                  Key
                                </span>
                                <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                                  Value
                                </span>
                                <div className="w-5" />
                              </div>
                              {labels.map((label) => (
                                <div
                                  key={label.id}
                                  className="grid grid-cols-[1fr_1fr_23px] gap-1 items-center"
                                >
                                  <Input
                                    placeholder="e.g. key"
                                    value={label.key}
                                    onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                                    fullWidth
                                  />
                                  <Input
                                    placeholder="e.g. value"
                                    value={label.value}
                                    onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                                    fullWidth
                                  />
                                  <button
                                    onClick={() => removeLabel(label.id)}
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
                            </VStack>
                          )}
                          <div className="w-fit">
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                              onClick={addLabel}
                            >
                              Add label
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
                        <VStack gap={3}>
                          {annotations.length > 0 && (
                            <VStack gap={2} className="w-full">
                              {/* Header row */}
                              <div className="grid grid-cols-[1fr_1fr_23px] gap-1">
                                <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                                  Key
                                </span>
                                <span className="text-label-sm text-[var(--color-text-default)] leading-[16.5px]">
                                  Value
                                </span>
                                <div className="w-5" />
                              </div>
                              {annotations.map((annotation) => (
                                <div
                                  key={annotation.id}
                                  className="grid grid-cols-[1fr_1fr_23px] gap-1 items-center"
                                >
                                  <Input
                                    placeholder="e.g. key"
                                    value={annotation.key}
                                    onChange={(e) =>
                                      updateAnnotation(annotation.id, 'key', e.target.value)
                                    }
                                    fullWidth
                                  />
                                  <Input
                                    placeholder="e.g. value"
                                    value={annotation.value}
                                    onChange={(e) =>
                                      updateAnnotation(annotation.id, 'value', e.target.value)
                                    }
                                    fullWidth
                                  />
                                  <button
                                    onClick={() => removeAnnotation(annotation.id)}
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
                            </VStack>
                          )}
                          <div className="w-fit">
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                              onClick={addAnnotation}
                            >
                              Add annotation
                            </Button>
                          </div>
                        </VStack>
                      </div>
                    </FormField.Control>
                  </FormField>
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
    </PageShell>
  );
}
