import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  FormField,
  HStack,
  VStack,
  TabBar,
  TopBar,
  PageShell,
  Input,
  Select,
  SectionCard,
  Checkbox,
  Table,
  Disclosure,
} from '@/design-system';
import type { WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useIsV2 } from '@/hooks/useIsV2';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconX,
  IconCheck,
  IconCirclePlus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type NetworkPolicySectionStep =
  | 'basic-info'
  | 'ingress-rules'
  | 'egress-rules'
  | 'selector'
  | 'labels-annotations';

// Section labels for display
const NETWORK_POLICY_SECTION_LABELS: Record<NetworkPolicySectionStep, string> = {
  'basic-info': 'Basic information',
  'ingress-rules': 'Ingress rules',
  'egress-rules': 'Egress rules',
  selector: 'Selector',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for summary
const NETWORK_POLICY_SECTION_ORDER: NetworkPolicySectionStep[] = [
  'basic-info',
  'ingress-rules',
  'egress-rules',
  'selector',
  'labels-annotations',
];

// Namespace options
const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
];

// Rule type options
const RULE_TYPE_OPTIONS = [
  { value: 'ip-block', label: 'IP Block' },
  { value: 'namespace-label-selector', label: 'Namespace Label Selector' },
  { value: 'pod-label-selector', label: 'Pod Label Selector' },
  { value: 'namespace-pod-label-selector', label: 'Namespace/Pod Label Selector' },
];

// Protocol options
const PROTOCOL_OPTIONS = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'SCTP', label: 'SCTP' },
];

// Operator options for selector
const OPERATOR_OPTIONS = [
  { value: 'in', label: 'in list' },
  { value: 'not-in', label: 'not in list' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' },
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

interface RuleTarget {
  id: string;
  ruleType: string;
  cidr: string;
  exceptions: string[];
}

interface AllowedPort {
  id: string;
  port: string;
  protocol: string;
}

interface TrafficRule {
  id: string;
  name: string;
  targets: RuleTarget[];
  allowedPorts: AllowedPort[];
}

interface SelectorRule {
  id: string;
  key: string;
  operator: string;
  value: string;
}

interface MatchingPod {
  id: string;
  name: string;
  createdAt: string;
}

const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'default', createdAt: '2025-07-25 09:12:20' },
];

const MATCHING_PODS_COLUMNS = [
  {
    key: 'name' as const,
    label: 'Name',
    sortable: true,
    render: (value: string) => (
      <span className="text-label-md text-[var(--color-action-primary)]">{value}</span>
    ),
  },
  { key: 'createdAt' as const, label: 'Created At', sortable: true },
];

/* ----------------------------------------
   Summary Status Icon Component
   ---------------------------------------- */
function SummaryStatusIcon({ status }: { status: WizardSectionState }) {
  if (status === 'done') {
    return (
      <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center">
        <IconCheck size={10} stroke={2} className="text-white" />
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div
        className="size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }
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
function SummarySidebar({
  sectionStates,
}: {
  sectionStates: Record<NetworkPolicySectionStep, WizardSectionState>;
}) {
  const navigate = useNavigate();

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={4}>
            <span className="text-heading-h5">Summary</span>
            <VStack gap={0}>
              {NETWORK_POLICY_SECTION_ORDER.map((step) => (
                <HStack key={step} justify="between" className="py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {NETWORK_POLICY_SECTION_LABELS[step]}
                  </span>
                  <SummaryStatusIcon status={sectionStates[step]} />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </div>

        <HStack gap={2}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/container/network-policies')}
          >
            Cancel
          </Button>
          <Button variant="primary" size="md" className="flex-1">
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Traffic Rules Section Component (for Ingress/Egress)
   ---------------------------------------- */
interface TrafficRulesSectionProps {
  title: string;
  checkboxLabel: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  rules: TrafficRule[];
  onRulesChange: (rules: TrafficRule[]) => void;
}

function TrafficRulesSection({
  title,
  checkboxLabel,
  enabled,
  onEnabledChange,
  rules,
  onRulesChange,
}: TrafficRulesSectionProps) {
  const [activeRuleIndex, setActiveRuleIndex] = useState(0);

  const addRule = () => {
    const newRule: TrafficRule = {
      id: `rule-${Date.now()}`,
      name: `Rule ${rules.length + 1}`,
      targets: [],
      allowedPorts: [],
    };
    onRulesChange([...rules, newRule]);
    setActiveRuleIndex(rules.length);
  };

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    onRulesChange(newRules);
    if (activeRuleIndex >= newRules.length) {
      setActiveRuleIndex(Math.max(0, newRules.length - 1));
    }
  };

  const addTarget = () => {
    const newTarget: RuleTarget = {
      id: `target-${Date.now()}`,
      ruleType: 'ip-block',
      cidr: '',
      exceptions: [],
    };
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: [...newRules[activeRuleIndex].targets, newTarget],
    };
    onRulesChange(newRules);
  };

  const removeTarget = (targetId: string) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: newRules[activeRuleIndex].targets.filter((t) => t.id !== targetId),
    };
    onRulesChange(newRules);
  };

  const updateTarget = (targetId: string, field: keyof RuleTarget, value: string | string[]) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: newRules[activeRuleIndex].targets.map((t) => {
        if (t.id !== targetId) return t;
        const updated = { ...t, [field]: value };
        if (field === 'ruleType') {
          const defaultSelector: LabelSelector = {
            id: `ls-${Date.now()}`,
            key: '',
            operator: 'in',
            values: '',
          };
          if (
            (value === 'namespace-label-selector' || value === 'namespace-pod-label-selector') &&
            !(t.namespaceSelectors || []).length
          ) {
            updated.namespaceSelectors = [{ ...defaultSelector, id: `ls-ns-${Date.now()}` }];
          }
          if (
            (value === 'pod-label-selector' || value === 'namespace-pod-label-selector') &&
            !(t.podSelectors || []).length
          ) {
            updated.podSelectors = [{ ...defaultSelector, id: `ls-pod-${Date.now()}` }];
          }
        }
        return updated;
      }),
    };
    onRulesChange(newRules);
  };

  const addException = (targetId: string) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: newRules[activeRuleIndex].targets.map((t) =>
        t.id === targetId ? { ...t, exceptions: [...t.exceptions, ''] } : t
      ),
    };
    onRulesChange(newRules);
  };

  const removeException = (targetId: string, exIndex: number) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: newRules[activeRuleIndex].targets.map((t) =>
        t.id === targetId ? { ...t, exceptions: t.exceptions.filter((_, i) => i !== exIndex) } : t
      ),
    };
    onRulesChange(newRules);
  };

  const updateException = (targetId: string, exIndex: number, value: string) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: newRules[activeRuleIndex].targets.map((t) =>
        t.id === targetId
          ? { ...t, exceptions: t.exceptions.map((ex, i) => (i === exIndex ? value : ex)) }
          : t
      ),
    };
    onRulesChange(newRules);
  };

  const addLabelSelector = (targetId: string, field: 'namespaceSelectors' | 'podSelectors') => {
    const newSelector: LabelSelector = {
      id: `ls-${Date.now()}`,
      key: '',
      operator: 'in',
      values: '',
    };
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: newRules[activeRuleIndex].targets.map((t) =>
        t.id === targetId ? { ...t, [field]: [...(t[field] || []), newSelector] } : t
      ),
    };
    onRulesChange(newRules);
  };

  const removeLabelSelector = (
    targetId: string,
    field: 'namespaceSelectors' | 'podSelectors',
    selectorId: string
  ) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: newRules[activeRuleIndex].targets.map((t) =>
        t.id === targetId
          ? { ...t, [field]: (t[field] || []).filter((s: LabelSelector) => s.id !== selectorId) }
          : t
      ),
    };
    onRulesChange(newRules);
  };

  const updateLabelSelector = (
    targetId: string,
    field: 'namespaceSelectors' | 'podSelectors',
    selectorId: string,
    prop: keyof LabelSelector,
    value: string
  ) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: newRules[activeRuleIndex].targets.map((t) =>
        t.id === targetId
          ? {
              ...t,
              [field]: (t[field] || []).map((s: LabelSelector) =>
                s.id === selectorId ? { ...s, [prop]: value } : s
              ),
            }
          : t
      ),
    };
    onRulesChange(newRules);
  };

  const addAllowedPort = () => {
    const newPort: AllowedPort = {
      id: `port-${Date.now()}`,
      port: '',
      protocol: 'TCP',
    };
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      allowedPorts: [...newRules[activeRuleIndex].allowedPorts, newPort],
    };
    onRulesChange(newRules);
  };

  const removeAllowedPort = (portId: string) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      allowedPorts: newRules[activeRuleIndex].allowedPorts.filter((p) => p.id !== portId),
    };
    onRulesChange(newRules);
  };

  const updateAllowedPort = (portId: string, field: keyof AllowedPort, value: string) => {
    const newRules = [...rules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      allowedPorts: newRules[activeRuleIndex].allowedPorts.map((p) =>
        p.id === portId ? { ...p, [field]: value } : p
      ),
    };
    onRulesChange(newRules);
  };

  const activeRule = rules[activeRuleIndex];

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title={title} />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Enable checkbox */}
          <Checkbox
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            label={checkboxLabel}
          />

          {/* Rules content - only show when enabled */}
          {enabled && (
            <VStack gap={3}>
              <label className="text-label-lg text-[var(--color-text-default)]">Rules</label>

              <div className="border border-[var(--color-border-default)] rounded-[6px] w-full overflow-hidden">
                <div className="flex w-full">
                  {/* Left tabs */}
                  <div className="flex flex-col border-r border-[var(--color-border-default)] shrink-0 min-w-[100px]">
                    {rules.map((rule, index) => (
                      <button
                        key={rule.id}
                        onClick={() => setActiveRuleIndex(index)}
                        className={`flex items-center justify-between px-3 py-2 text-left border-b border-[var(--color-border-default)] last:border-b-0 ${
                          activeRuleIndex === index
                            ? 'bg-[var(--color-surface-default)] text-[var(--color-action-primary)]'
                            : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)]'
                        }`}
                      >
                        <span className="text-label-md">{rule.name}</span>
                        {rules.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRule(index);
                            }}
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        )}
                      </button>
                    ))}
                    <button
                      onClick={addRule}
                      className="flex items-center gap-1 px-3 py-2 text-body-sm text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] bg-[var(--color-surface-subtle)]"
                    >
                      <IconCirclePlus size={16} stroke={1.5} />
                      Add Rule
                    </button>
                  </div>

                  {/* Right content panel */}
                  {activeRule && (
                    <div className="flex-1 p-3">
                      <VStack gap={6}>
                        {/* Targets Section */}
                        <VStack gap={3}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Targets
                          </label>

                          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                            <VStack gap={1.5} className="w-full">
                              {activeRule.targets.map((target) => (
                                <div
                                  key={target.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                                >
                                  <VStack gap={3}>
                                    {/* Rule type + CIDR row */}
                                    <VStack gap={2}>
                                      <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
                                        <span className="block text-label-sm text-[var(--color-text-default)]">
                                          Rule type
                                        </span>
                                        {target.ruleType === 'ip-block' ? (
                                          <span className="block text-label-sm text-[var(--color-text-default)]">
                                            CIDR
                                          </span>
                                        ) : (
                                          <div />
                                        )}
                                        <button
                                          onClick={() => removeTarget(target.id)}
                                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                        >
                                          <IconX
                                            size={16}
                                            className="text-[var(--color-text-muted)]"
                                            stroke={1.5}
                                          />
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
                                        <Select
                                          options={RULE_TYPE_OPTIONS}
                                          value={target.ruleType}
                                          onChange={(value) =>
                                            updateTarget(target.id, 'ruleType', value)
                                          }
                                          fullWidth
                                        />
                                        {target.ruleType === 'ip-block' ? (
                                          <Input
                                            placeholder="e.g. 1.1.1.0/24"
                                            value={target.cidr}
                                            onChange={(e) =>
                                              updateTarget(target.id, 'cidr', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        ) : (
                                          <div />
                                        )}
                                        <div />
                                      </div>
                                    </VStack>

                                    {/* Namespace Label Selectors (namespace-label-selector only) */}
                                    {target.ruleType === 'namespace-label-selector' && (
                                      <>
                                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                          <VStack gap={1.5}>
                                            {(target.namespaceSelectors || []).length > 0 && (
                                              <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                                  Key
                                                </span>
                                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                                  Operator
                                                </span>
                                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                                  Values
                                                </span>
                                                <div />
                                              </div>
                                            )}
                                            {(target.namespaceSelectors || []).map((sel) => (
                                              <div
                                                key={sel.id}
                                                className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                                              >
                                                <Input
                                                  placeholder="input key"
                                                  value={sel.key}
                                                  onChange={(e) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'namespaceSelectors',
                                                      sel.id,
                                                      'key',
                                                      e.target.value
                                                    )
                                                  }
                                                  fullWidth
                                                />
                                                <Select
                                                  options={OPERATOR_OPTIONS}
                                                  value={sel.operator}
                                                  onChange={(value) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'namespaceSelectors',
                                                      sel.id,
                                                      'operator',
                                                      value
                                                    )
                                                  }
                                                  fullWidth
                                                />
                                                <Input
                                                  placeholder="input values"
                                                  value={sel.values}
                                                  onChange={(e) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'namespaceSelectors',
                                                      sel.id,
                                                      'values',
                                                      e.target.value
                                                    )
                                                  }
                                                  fullWidth
                                                />
                                                <button
                                                  onClick={() =>
                                                    removeLabelSelector(
                                                      target.id,
                                                      'namespaceSelectors',
                                                      sel.id
                                                    )
                                                  }
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
                                                onClick={() =>
                                                  addLabelSelector(target.id, 'namespaceSelectors')
                                                }
                                              >
                                                Add rule
                                              </Button>
                                            </div>
                                          </VStack>
                                        </div>

                                        {/* Matching Pods */}
                                        <VStack gap={2} className="w-full">
                                          <span className="text-label-sm text-[var(--color-text-default)]">
                                            Matching Pods
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <button
                                              className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
                                              disabled
                                            >
                                              <span className="text-[var(--color-text-default)]">
                                                ‹
                                              </span>
                                            </button>
                                            <span className="w-6 h-6 flex items-center justify-center bg-[var(--color-action-primary)] text-white rounded-md text-label-sm">
                                              1
                                            </span>
                                            <button
                                              className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
                                              disabled
                                            >
                                              <span className="text-[var(--color-text-default)]">
                                                ›
                                              </span>
                                            </button>
                                            <div className="w-px h-4 bg-[var(--color-border-default)]" />
                                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                                              {MOCK_MATCHING_PODS.length} items
                                            </span>
                                          </div>
                                          <Table
                                            columns={MATCHING_PODS_COLUMNS}
                                            data={MOCK_MATCHING_PODS}
                                            rowKey="id"
                                            rowHeight="40px"
                                          />
                                        </VStack>
                                      </>
                                    )}

                                    {/* Combined Namespace + Pod Selectors (namespace-pod-label-selector) */}
                                    {target.ruleType === 'namespace-pod-label-selector' && (
                                      <>
                                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 pt-3 pb-4 w-full">
                                          <VStack gap={2}>
                                            {/* Namespaces section */}
                                            <VStack gap={2}>
                                              <span className="text-label-md text-[var(--color-text-default)]">
                                                Namespaces
                                              </span>
                                              {(target.namespaceSelectors || []).map((sel) => (
                                                <div
                                                  key={sel.id}
                                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                                >
                                                  <div className="flex gap-1 w-full">
                                                    <VStack gap={2} className="flex-1 min-w-0">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Key
                                                      </span>
                                                      <Input
                                                        placeholder="Input Key"
                                                        value={sel.key}
                                                        onChange={(e) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'namespaceSelectors',
                                                            sel.id,
                                                            'key',
                                                            e.target.value
                                                          )
                                                        }
                                                        fullWidth
                                                      />
                                                    </VStack>
                                                    <VStack gap={2} className="flex-1 min-w-0">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Operator
                                                      </span>
                                                      <Select
                                                        options={OPERATOR_OPTIONS}
                                                        value={sel.operator}
                                                        onChange={(value) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'namespaceSelectors',
                                                            sel.id,
                                                            'operator',
                                                            value
                                                          )
                                                        }
                                                        fullWidth
                                                      />
                                                    </VStack>
                                                    <VStack gap={2} className="flex-1 min-w-0">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Value
                                                      </span>
                                                      <Input
                                                        placeholder="input value"
                                                        value={sel.values}
                                                        onChange={(e) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'namespaceSelectors',
                                                            sel.id,
                                                            'values',
                                                            e.target.value
                                                          )
                                                        }
                                                        fullWidth
                                                      />
                                                    </VStack>
                                                  </div>
                                                </div>
                                              ))}
                                            </VStack>

                                            {/* Pod section */}
                                            <VStack gap={2}>
                                              <span className="text-label-md text-[var(--color-text-default)]">
                                                Pod
                                              </span>
                                              {(target.podSelectors || []).map((sel) => (
                                                <div
                                                  key={sel.id}
                                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                                >
                                                  <div className="flex gap-1 w-full">
                                                    <VStack gap={2} className="flex-1 min-w-0">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Key
                                                      </span>
                                                      <Input
                                                        placeholder="Input Key"
                                                        value={sel.key}
                                                        onChange={(e) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'podSelectors',
                                                            sel.id,
                                                            'key',
                                                            e.target.value
                                                          )
                                                        }
                                                        fullWidth
                                                      />
                                                    </VStack>
                                                    <VStack gap={2} className="flex-1 min-w-0">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Operator
                                                      </span>
                                                      <Select
                                                        options={OPERATOR_OPTIONS}
                                                        value={sel.operator}
                                                        onChange={(value) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'podSelectors',
                                                            sel.id,
                                                            'operator',
                                                            value
                                                          )
                                                        }
                                                        fullWidth
                                                      />
                                                    </VStack>
                                                    <VStack gap={2} className="flex-1 min-w-0">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Value
                                                      </span>
                                                      <Input
                                                        placeholder="input value"
                                                        value={sel.values}
                                                        onChange={(e) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'podSelectors',
                                                            sel.id,
                                                            'values',
                                                            e.target.value
                                                          )
                                                        }
                                                        fullWidth
                                                      />
                                                    </VStack>
                                                  </div>
                                                </div>
                                              ))}
                                            </VStack>
                                          </VStack>
                                        </div>

                                        {/* Matching Pods */}
                                        <VStack gap={2} className="w-full">
                                          <span className="text-label-sm text-[var(--color-text-default)]">
                                            Matching Pods
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <button
                                              className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
                                              disabled
                                            >
                                              <span className="text-[var(--color-text-default)]">
                                                ‹
                                              </span>
                                            </button>
                                            <span className="w-6 h-6 flex items-center justify-center bg-[var(--color-action-primary)] text-white rounded-md text-label-sm">
                                              1
                                            </span>
                                            <button
                                              className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
                                              disabled
                                            >
                                              <span className="text-[var(--color-text-default)]">
                                                ›
                                              </span>
                                            </button>
                                            <div className="w-px h-4 bg-[var(--color-border-default)]" />
                                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                                              {MOCK_MATCHING_PODS.length} items
                                            </span>
                                          </div>
                                          <Table
                                            columns={MATCHING_PODS_COLUMNS}
                                            data={MOCK_MATCHING_PODS}
                                            rowKey="id"
                                            rowHeight="40px"
                                          />
                                        </VStack>
                                      </>
                                    )}

                                    {/* Pod Label Selectors (shown for pod type only) */}
                                    {target.ruleType === 'pod-label-selector' && (
                                      <>
                                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                          <VStack gap={1.5}>
                                            {(target.podSelectors || []).length > 0 && (
                                              <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                                  Key
                                                </span>
                                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                                  Operator
                                                </span>
                                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                                  Values
                                                </span>
                                                <div />
                                              </div>
                                            )}
                                            {(target.podSelectors || []).map((sel) => (
                                              <div
                                                key={sel.id}
                                                className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                                              >
                                                <Input
                                                  placeholder="input key"
                                                  value={sel.key}
                                                  onChange={(e) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'podSelectors',
                                                      sel.id,
                                                      'key',
                                                      e.target.value
                                                    )
                                                  }
                                                  fullWidth
                                                />
                                                <Select
                                                  options={OPERATOR_OPTIONS}
                                                  value={sel.operator}
                                                  onChange={(value) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'podSelectors',
                                                      sel.id,
                                                      'operator',
                                                      value
                                                    )
                                                  }
                                                  fullWidth
                                                />
                                                <Input
                                                  placeholder="input values"
                                                  value={sel.values}
                                                  onChange={(e) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'podSelectors',
                                                      sel.id,
                                                      'values',
                                                      e.target.value
                                                    )
                                                  }
                                                  fullWidth
                                                />
                                                <button
                                                  onClick={() =>
                                                    removeLabelSelector(
                                                      target.id,
                                                      'podSelectors',
                                                      sel.id
                                                    )
                                                  }
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
                                                onClick={() =>
                                                  addLabelSelector(target.id, 'podSelectors')
                                                }
                                              >
                                                Add pod selector
                                              </Button>
                                            </div>
                                          </VStack>
                                        </div>

                                        {target.ruleType === 'pod-label-selector' && (
                                          <VStack gap={2} className="w-full">
                                            <span className="text-label-sm text-[var(--color-text-default)]">
                                              Matching Pods
                                            </span>
                                            <div className="flex items-center gap-2">
                                              <button
                                                className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
                                                disabled
                                              >
                                                <span className="text-[var(--color-text-default)]">
                                                  ‹
                                                </span>
                                              </button>
                                              <span className="w-6 h-6 flex items-center justify-center bg-[var(--color-action-primary)] text-white rounded-md text-label-sm">
                                                1
                                              </span>
                                              <button
                                                className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
                                                disabled
                                              >
                                                <span className="text-[var(--color-text-default)]">
                                                  ›
                                                </span>
                                              </button>
                                              <div className="w-px h-4 bg-[var(--color-border-default)]" />
                                              <span className="text-body-sm text-[var(--color-text-subtle)]">
                                                {MOCK_MATCHING_PODS.length} items
                                              </span>
                                            </div>
                                            <Table
                                              columns={MATCHING_PODS_COLUMNS}
                                              data={MOCK_MATCHING_PODS}
                                              rowKey="id"
                                              rowHeight="40px"
                                            />
                                          </VStack>
                                        )}
                                      </>
                                    )}

                                    {/* Exceptions list (shown for IP block) */}
                                    {target.ruleType === 'ip-block' && (
                                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                        <VStack gap={1.5}>
                                          {target.exceptions.length > 0 && (
                                            <div className="grid grid-cols-[1fr_20px] gap-1 w-full">
                                              <span className="block text-label-sm text-[var(--color-text-default)]">
                                                Exception CIDR
                                              </span>
                                              <div />
                                            </div>
                                          )}
                                          {target.exceptions.map((ex, exIdx) => (
                                            <div
                                              key={exIdx}
                                              className="grid grid-cols-[1fr_20px] gap-1 w-full items-center"
                                            >
                                              <Input
                                                placeholder="e.g. 1.1.1.1/32"
                                                value={ex}
                                                onChange={(e) =>
                                                  updateException(target.id, exIdx, e.target.value)
                                                }
                                                fullWidth
                                              />
                                              <button
                                                onClick={() => removeException(target.id, exIdx)}
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
                                              onClick={() => addException(target.id)}
                                            >
                                              Add exception
                                            </Button>
                                          </div>
                                        </VStack>
                                      </div>
                                    )}
                                  </VStack>
                                </div>
                              ))}
                              <div className="w-fit">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                  onClick={addTarget}
                                >
                                  Add allowed traffic source
                                </Button>
                              </div>
                            </VStack>
                          </div>
                        </VStack>

                        {/* Allowed Ports Section */}
                        <VStack gap={3}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Allowed Ports
                          </label>

                          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                            <VStack gap={1.5} className="w-full">
                              {activeRule.allowedPorts.map((port) => (
                                <div
                                  key={port.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                                >
                                  <VStack gap={2}>
                                    <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        Port
                                      </span>
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        Protocol
                                      </span>
                                      <button
                                        onClick={() => removeAllowedPort(port.id)}
                                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                      >
                                        <IconX
                                          size={16}
                                          className="text-[var(--color-text-muted)]"
                                          stroke={1.5}
                                        />
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
                                      <Input
                                        placeholder="e.g. 8080"
                                        value={port.port}
                                        onChange={(e) =>
                                          updateAllowedPort(port.id, 'port', e.target.value)
                                        }
                                        fullWidth
                                      />
                                      <Select
                                        options={PROTOCOL_OPTIONS}
                                        value={port.protocol}
                                        onChange={(value) =>
                                          updateAllowedPort(port.id, 'protocol', value)
                                        }
                                        fullWidth
                                      />
                                      <div />
                                    </div>
                                  </VStack>
                                </div>
                              ))}
                              <div className="w-fit">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                  onClick={addAllowedPort}
                                >
                                  Add allowed port
                                </Button>
                              </div>
                            </VStack>
                          </div>
                        </VStack>
                      </VStack>
                    </div>
                  )}
                </div>
              </div>
            </VStack>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */
export function CreateNetworkPolicyPage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Create network policy');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Basic Information state
  const [namespace, setNamespace] = useState('default');
  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');

  // Ingress Rules state
  const [ingressEnabled, setIngressEnabled] = useState(true);
  const [ingressRules, setIngressRules] = useState<TrafficRule[]>([
    {
      id: 'ingress-rule-1',
      name: 'Rule 1',
      targets: [
        {
          id: 'target-i1',
          ruleType: 'ip-block',
          cidr: '',
          exceptions: [''],
          namespaceSelectors: [],
          podSelectors: [],
        },
        {
          id: 'target-i2',
          ruleType: 'namespace-label-selector',
          cidr: '',
          exceptions: [],
          namespaceSelectors: [{ id: 'ls-i2-ns', key: '', operator: 'in', values: '' }],
          podSelectors: [],
        },
        {
          id: 'target-i3',
          ruleType: 'pod-label-selector',
          cidr: '',
          exceptions: [],
          namespaceSelectors: [],
          podSelectors: [{ id: 'ls-i3-pod', key: '', operator: 'in', values: '' }],
        },
        {
          id: 'target-i4',
          ruleType: 'namespace-pod-label-selector',
          cidr: '',
          exceptions: [],
          namespaceSelectors: [{ id: 'ls-i4-ns', key: '', operator: 'in', values: '' }],
          podSelectors: [{ id: 'ls-i4-pod', key: '', operator: 'in', values: '' }],
        },
      ],
      allowedPorts: [{ id: 'port-i1', port: '', protocol: 'TCP' }],
    },
  ]);

  // Egress Rules state
  const [egressEnabled, setEgressEnabled] = useState(true);
  const [egressRules, setEgressRules] = useState<TrafficRule[]>([
    {
      id: 'egress-rule-1',
      name: 'Rule 1',
      targets: [
        {
          id: 'target-e1',
          ruleType: 'ip-block',
          cidr: '',
          exceptions: [''],
          namespaceSelectors: [],
          podSelectors: [],
        },
        {
          id: 'target-e2',
          ruleType: 'namespace-label-selector',
          cidr: '',
          exceptions: [],
          namespaceSelectors: [{ id: 'ls-e2-ns', key: '', operator: 'in', values: '' }],
          podSelectors: [],
        },
        {
          id: 'target-e3',
          ruleType: 'pod-label-selector',
          cidr: '',
          exceptions: [],
          namespaceSelectors: [],
          podSelectors: [{ id: 'ls-e3-pod', key: '', operator: 'in', values: '' }],
        },
        {
          id: 'target-e4',
          ruleType: 'namespace-pod-label-selector',
          cidr: '',
          exceptions: [],
          namespaceSelectors: [{ id: 'ls-e4-ns', key: '', operator: 'in', values: '' }],
          podSelectors: [{ id: 'ls-e4-pod', key: '', operator: 'in', values: '' }],
        },
      ],
      allowedPorts: [{ id: 'port-e1', port: '', protocol: 'TCP' }],
    },
  ]);

  // Selector state
  const [selectorRules, setSelectorRules] = useState<SelectorRule[]>(
    isV2 ? [{ id: Date.now().toString(), key: '', operator: '', value: '' }] : []
  );

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Section states for summary
  const getSectionStates = (): Record<NetworkPolicySectionStep, WizardSectionState> => {
    return {
      'basic-info': policyName ? 'done' : 'active',
      'ingress-rules': ingressEnabled && ingressRules.length > 0 ? 'done' : 'pending',
      'egress-rules': egressEnabled && egressRules.length > 0 ? 'done' : 'pending',
      selector: selectorRules.length > 0 ? 'done' : 'pending',
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pending',
    };
  };

  // Selector handlers
  const addSelectorRule = useCallback(() => {
    setSelectorRules((prev) => [
      ...prev,
      { id: Date.now().toString(), key: '', operator: 'in', value: '' },
    ]);
  }, []);

  const removeSelectorRule = useCallback((id: string) => {
    setSelectorRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateSelectorRule = useCallback((id: string, field: keyof SelectorRule, value: string) => {
    setSelectorRules((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  // Label handlers
  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  // Annotation handlers
  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnotation = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }, []);

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
                { label: 'Network Policies', href: '/container/network-policies' },
                { label: 'Create network policy' },
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
          <h1 className="text-heading-h4">Create network policy</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Network policies are used to control the traffic flow between pods within the cluster
            based on defined rules for ingress and egress.
          </p>
        </VStack>

        {/* Main Content with Summary Sidebar */}
        <HStack gap={6} className="w-full items-start">
          {/* Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information Section */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Basic information" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Namespace */}
                  <FormField label="Namespace" required>
                    <Select
                      options={NAMESPACE_OPTIONS}
                      value={namespace}
                      onChange={setNamespace}
                      fullWidth
                    />
                  </FormField>

                  {/* Name */}
                  <FormField label="Name" required>
                    <Input
                      placeholder="Enter a unique name"
                      value={policyName}
                      onChange={(e) => setPolicyName(e.target.value)}
                      fullWidth
                    />
                  </FormField>

                  {/* Description (collapsible) */}
                  <Disclosure defaultOpen={isV2}>
                    <Disclosure.Trigger>Description</Disclosure.Trigger>
                    <Disclosure.Panel>
                      <div className="pt-2">
                        <Input
                          placeholder="Description"
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

            {/* Ingress Rules Section */}
            <TrafficRulesSection
              title="Ingress rules"
              checkboxLabel="Configure ingress rules to restrict incoming traffic"
              enabled={ingressEnabled}
              onEnabledChange={setIngressEnabled}
              rules={ingressRules}
              onRulesChange={setIngressRules}
            />

            {/* Egress Rules Section */}
            <TrafficRulesSection
              title="Egress rules"
              checkboxLabel="Configure egress rules to restrict outgoing traffic"
              enabled={egressEnabled}
              onEnabledChange={setEgressEnabled}
              rules={egressRules}
              onRulesChange={setEgressRules}
            />

            {/* Selector Section */}
            <SectionCard className="pb-4">
              <SectionCard.Header
                title="Selector"
                description="Selector keys and values are intended to match labels and values on existing pods."
              />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Selector Rules */}
                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <VStack gap={1.5}>
                      {selectorRules.length > 0 && (
                        <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Key
                          </span>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Operator
                          </span>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Value
                          </span>
                          <div className="w-5" />
                        </div>
                      )}

                      {selectorRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
                        >
                          <Input
                            placeholder="input key"
                            value={rule.key}
                            onChange={(e) => updateSelectorRule(rule.id, 'key', e.target.value)}
                            fullWidth
                          />
                          <Select
                            options={OPERATOR_OPTIONS}
                            value={rule.operator}
                            onChange={(value) => updateSelectorRule(rule.id, 'operator', value)}
                            fullWidth
                          />
                          <Input
                            placeholder="input value"
                            value={rule.value}
                            onChange={(e) => updateSelectorRule(rule.id, 'value', e.target.value)}
                            fullWidth
                          />
                          <button
                            onClick={() => removeSelectorRule(rule.id)}
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
                          onClick={addSelectorRule}
                        >
                          Add Rule
                        </Button>
                      </div>
                    </VStack>
                  </div>

                  {/* Matching Pods */}
                  <VStack gap={3}>
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Matching Pods
                    </label>
                    <Table
                      columns={[
                        {
                          key: 'name',
                          label: 'Name',
                          render: (value) => (
                            <span className="text-label-md text-[var(--color-action-primary)]">
                              {value}
                            </span>
                          ),
                        },
                        {
                          key: 'createdAt',
                          label: 'Created at',
                        },
                      ]}
                      data={MOCK_MATCHING_PODS}
                      rowKey="id"
                    />
                  </VStack>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Labels & Annotations Section */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Labels & Annotations" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Labels */}
                  <VStack gap={3}>
                    <VStack gap={1}>
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Labels
                      </label>
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        Specify the labels used to identify and categorize the resource.
                      </span>
                    </VStack>

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
                        {labels.map((label) => (
                          <div
                            key={label.id}
                            className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                          >
                            <Input
                              placeholder="label key"
                              value={label.key}
                              onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                              fullWidth
                            />
                            <Input
                              placeholder="label value"
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
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Annotations
                      </label>
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        Specify the annotations used to provide additional metadata for the
                        resource.
                      </span>
                    </VStack>

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
                        {annotations.map((annotation) => (
                          <div
                            key={annotation.id}
                            className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                          >
                            <Input
                              placeholder="annotation key"
                              value={annotation.key}
                              onChange={(e) =>
                                updateAnnotation(annotation.id, 'key', e.target.value)
                              }
                              fullWidth
                            />
                            <Input
                              placeholder="annotation value"
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
          <SummarySidebar sectionStates={getSectionStates()} />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateNetworkPolicyPage;
