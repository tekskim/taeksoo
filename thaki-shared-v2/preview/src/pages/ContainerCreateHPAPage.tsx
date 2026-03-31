import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input, NumberInput } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Disclosure } from '@shared/components/Disclosure';
import { Checkbox } from '@shared/components/Checkbox';
import { InlineMessage } from '@shared/components/InlineMessage';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Select } from '../components/TdsSelectCompat';
import { IconX, IconCirclePlus } from '@tabler/icons-react';

type WizardSectionState = 'pre' | 'active' | 'done' | 'writing' | 'skipped';

const mapStatus = (state: WizardSectionState): FloatingCardStatus => {
  switch (state) {
    case 'done':
      return 'success';
    case 'active':
      return 'processing';
    case 'writing':
      return 'writing';
    default:
      return 'default';
  }
};

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
   Main Component
   ---------------------------------------- */
export function ContainerCreateHPAPage() {
  const navigate = useNavigate();
  const isV2 = true;

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

  const states = getSectionStates();

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create horizontal pod autoscaler</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Horizontal Pod Autoscaler automatically adjusts the number of running Pods based on
            real-time resource usage to maintain stable application performance.
          </p>
        </div>
      }
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: HPA_SECTION_ORDER.map((key) => ({
                label: HPA_SECTION_LABELS[key],
                status: mapStatus(states[key]),
              })),
            },
          ]}
          cancelLabel="Cancel"
          actionLabel="Create"
          actionEnabled
          onCancel={handleCancel}
          onAction={handleSubmit}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {/* Basic Information Section */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-6">
                {/* Namespace */}
                <FormField label="Namespace" required>
                  <Select
                    options={NAMESPACE_OPTIONS}
                    value={namespace}
                    onChange={setNamespace}
                    className="w-full"
                  />
                </FormField>

                {/* Name */}
                <FormField label="Name" required>
                  <Input
                    placeholder="Enter a unique name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </FormField>

                {/* Description with Disclosure */}
                <div className="flex flex-col gap-2">
                  <Disclosure
                    label="Description"
                    expanded={showDescription}
                    onExpandChange={setShowDescription}
                  >
                    <div className="pt-2">
                      <Input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </Disclosure>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Target Section */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Target" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-6">
                {/* Target reference */}
                <FormField label="Target reference" required>
                  <Select
                    options={TARGET_REFERENCE_OPTIONS}
                    value={targetReference}
                    onChange={setTargetReference}
                    className="w-full"
                  />
                </FormField>

                {/* Min/Max Replicas */}
                <div className="flex flex-col gap-6">
                  <FormField label="Minimum replicas" required>
                    <NumberInput value={minReplicas} onChange={setMinReplicas} min={1} width="sm" />
                  </FormField>
                  <FormField label="Maximum Replicas" required>
                    <NumberInput value={maxReplicas} onChange={setMaxReplicas} min={1} width="sm" />
                  </FormField>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Behavior Section */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Behavior" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-row gap-6 w-full items-start">
                {/* Scale down behavior */}
                <div className="flex flex-col gap-3 flex-1">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Scale down behavior
                  </label>
                  <Checkbox
                    checked={scaleDownBehavior}
                    onChange={setScaleDownBehavior}
                    label="Configure scale down behavior"
                  />

                  {scaleDownBehavior && (
                    <div className="flex flex-col gap-6 mt-1">
                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                        <div className="flex flex-col gap-1.5">
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
                                className="w-full"
                              />
                              <NumberInput
                                value={policy.value}
                                onChange={(val) => updateScaleDownPolicy(policy.id, 'value', val)}
                                min={0}
                                className="w-full"
                              />
                              <NumberInput
                                value={policy.periodSeconds}
                                onChange={(val) =>
                                  updateScaleDownPolicy(policy.id, 'periodSeconds', val)
                                }
                                min={0}
                                className="w-full"
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
                              variant="muted"
                              appearance="outline"
                              size="sm"
                              onClick={addScaleDownPolicy}
                            >
                              <span className="inline-flex items-center gap-1">
                                <IconCirclePlus size={12} />
                                Add policy
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <FormField label="Select policy">
                        <Select
                          options={SELECT_POLICY_OPTIONS}
                          value={scaleDownSelectPolicy}
                          onChange={setScaleDownSelectPolicy}
                          className="w-full"
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
                    </div>
                  )}
                </div>

                {/* Scale up behavior */}
                <div className="flex flex-col gap-3 flex-1">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Scale up behavior
                  </label>
                  <Checkbox
                    checked={scaleUpBehavior}
                    onChange={setScaleUpBehavior}
                    label="Configure scale up behavior"
                  />

                  {scaleUpBehavior && (
                    <div className="flex flex-col gap-6 mt-1">
                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                        <div className="flex flex-col gap-1.5">
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
                                className="w-full"
                              />
                              <NumberInput
                                value={policy.value}
                                onChange={(val) => updateScaleUpPolicy(policy.id, 'value', val)}
                                min={0}
                                className="w-full"
                              />
                              <NumberInput
                                value={policy.periodSeconds}
                                onChange={(val) =>
                                  updateScaleUpPolicy(policy.id, 'periodSeconds', val)
                                }
                                min={0}
                                className="w-full"
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
                              variant="muted"
                              appearance="outline"
                              size="sm"
                              onClick={addScaleUpPolicy}
                            >
                              <span className="inline-flex items-center gap-1">
                                <IconCirclePlus size={12} />
                                Add policy
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <FormField label="Select policy">
                        <Select
                          options={SELECT_POLICY_OPTIONS}
                          value={scaleUpSelectPolicy}
                          onChange={setScaleUpSelectPolicy}
                          className="w-full"
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
                    </div>
                  )}
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Metrics Section */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Metrics" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-2">
                {/* Metric rows */}
                {metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-row justify-between items-start w-full">
                        <div className="flex flex-col gap-2 items-start">
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
                              requests on the spec. Without this the HPA metric will have no effect.
                            </InlineMessage>
                          </div>
                        </div>
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
                      </div>

                      {/* Source */}
                      <FormField label="Source">
                        <Select
                          options={METRIC_SOURCE_OPTIONS}
                          value={metric.source}
                          onChange={(value) => updateMetric(metric.id, 'source', value)}
                          className="w-full"
                        />
                      </FormField>

                      {/* Resource Name (for Resource source) */}
                      {metric.source === 'Resource' && (
                        <FormField label="Resource name">
                          <Select
                            options={RESOURCE_NAME_OPTIONS}
                            value={metric.resourceName}
                            onChange={(value) => updateMetric(metric.id, 'resourceName', value)}
                            className="w-full"
                          />
                        </FormField>
                      )}

                      {/* Type */}
                      <div className="flex flex-col gap-2">
                        <label className="text-label-lg text-[var(--color-text-default)]">
                          Type
                        </label>
                        <Select
                          options={TYPE_OPTIONS}
                          value={metric.type}
                          onChange={(value) => updateMetric(metric.id, 'type', value)}
                          className="w-full"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="flex flex-col gap-2">
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
                      </div>

                      {/* Object referent fields */}
                      {metric.source === 'Object' && (
                        <>
                          <div className="flex flex-col gap-2">
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
                              className="w-full"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
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
                              className="w-full"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
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
                              className="w-full"
                            />
                          </div>
                        </>
                      )}

                      {/* Non-Resource metrics fields */}
                      {metric.source !== 'Resource' && (
                        <>
                          <div className="flex flex-col gap-2">
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
                              className="w-full"
                            />
                          </div>

                          {/* Metric Selector */}
                          <div className="flex flex-col gap-2">
                            <label className="text-label-lg text-[var(--color-text-default)]">
                              Metric Selector
                            </label>
                            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                              <div className="flex flex-col gap-1.5">
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
                                      className="w-full"
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
                                      className="w-full"
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
                                      className="w-full"
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
                                    variant="muted"
                                    appearance="outline"
                                    size="sm"
                                    onClick={() => addMetricSelector(metric.id)}
                                  >
                                    <span className="inline-flex items-center gap-1">
                                      <IconCirclePlus size={12} />
                                      Add rule
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add a new row button */}
                <div className="w-fit">
                  <Button variant="muted" appearance="outline" size="sm" onClick={addMetric}>
                    <span className="inline-flex items-center gap-1">
                      <IconCirclePlus size={12} />
                      Add a new row
                    </span>
                  </Button>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Labels & Annotations Section */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Labels & annotations" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-6">
                {/* Labels */}
                <FormField
                  label="Labels"
                  description="Specify the labels used to identify and categorize the resource."
                >
                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <div className="flex flex-col gap-3">
                      {labels.length > 0 && (
                        <div className="flex flex-col gap-2 w-full">
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
                                className="w-full"
                              />
                              <Input
                                placeholder="e.g. value"
                                value={label.value}
                                onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                                className="w-full"
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
                        </div>
                      )}
                      <div className="w-fit">
                        <Button variant="muted" appearance="outline" size="sm" onClick={addLabel}>
                          <span className="inline-flex items-center gap-1">
                            <IconCirclePlus size={12} />
                            Add label
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </FormField>

                {/* Annotations */}
                <FormField
                  label="Annotations"
                  description="Specify the annotations used to provide additional metadata for the resource."
                >
                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <div className="flex flex-col gap-3">
                      {annotations.length > 0 && (
                        <div className="flex flex-col gap-2 w-full">
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
                                className="w-full"
                              />
                              <Input
                                placeholder="e.g. value"
                                value={annotation.value}
                                onChange={(e) =>
                                  updateAnnotation(annotation.id, 'value', e.target.value)
                                }
                                className="w-full"
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
                        </div>
                      )}
                      <div className="w-fit">
                        <Button
                          variant="muted"
                          appearance="outline"
                          size="sm"
                          onClick={addAnnotation}
                        >
                          <span className="inline-flex items-center gap-1">
                            <IconCirclePlus size={12} />
                            Add annotation
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </FormField>
              </div>
            </SectionCard.Content>
          </SectionCard>
        </div>
      </div>
    </CreateLayout>
  );
}
