import { useState } from 'react';
import { Button, VStack, Input, Select, SectionCard, Checkbox, Table } from '@/design-system';
import { IconX, IconCirclePlus } from '@tabler/icons-react';

export interface LabelSelector {
  id: string;
  key: string;
  operator: string;
  values: string;
}

export interface RuleTarget {
  id: string;
  ruleType: string;
  cidr: string;
  exceptions: string[];
  namespaceSelectors?: LabelSelector[];
  podSelectors?: LabelSelector[];
}

export interface AllowedPort {
  id: string;
  port: string;
  protocol: string;
}

export interface TrafficRule {
  id: string;
  name: string;
  targets: RuleTarget[];
  allowedPorts: AllowedPort[];
}

const RULE_TYPE_OPTIONS = [
  { value: 'ip-block', label: 'IP Block' },
  { value: 'namespace-label-selector', label: 'Namespace Label Selector' },
  { value: 'pod-label-selector', label: 'Pod Label Selector' },
  { value: 'namespace-pod-label-selector', label: 'Namespace/Pod Label Selector' },
];

const PROTOCOL_OPTIONS = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'SCTP', label: 'SCTP' },
];

const OPERATOR_OPTIONS = [
  { value: 'in', label: 'in list' },
  { value: 'not-in', label: 'not in list' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' },
];

interface MatchingPod {
  id: string;
  name: string;
  createdAt: string;
}

const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'default', createdAt: 'Jul 25, 2026 09:12:20' },
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

export interface TrafficRulesSectionProps {
  title: string;
  checkboxLabel: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  rules: TrafficRule[];
  onRulesChange: (rules: TrafficRule[]) => void;
}

export function TrafficRulesSection({
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
          <Checkbox
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            label={checkboxLabel}
          />

          {enabled && (
            <VStack gap={3}>
              <label className="text-label-lg text-[var(--color-text-default)]">Rules</label>

              <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] w-full overflow-hidden">
                <div className="flex w-full">
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

                  {activeRule && (
                    <div className="flex-1 p-3">
                      <VStack gap={6}>
                        {/* Targets */}
                        <VStack gap={3}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Targets
                          </label>

                          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                            <VStack gap={1.5} className="w-full">
                              {activeRule.targets.map((target) => (
                                <div
                                  key={target.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-3 w-full"
                                >
                                  <VStack gap={3}>
                                    <VStack gap={2}>
                                      <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
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
                                      <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
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

                                    {/* Label selectors for namespace/pod types */}
                                    {(target.ruleType === 'namespace-label-selector' ||
                                      target.ruleType === 'pod-label-selector') && (
                                      <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                                        <VStack gap={1.5}>
                                          {(
                                            (target.ruleType === 'namespace-label-selector'
                                              ? target.namespaceSelectors
                                              : target.podSelectors) || []
                                          ).length > 0 && (
                                            <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
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
                                          {(
                                            (target.ruleType === 'namespace-label-selector'
                                              ? target.namespaceSelectors
                                              : target.podSelectors) || []
                                          ).map((sel) => {
                                            const selectorField =
                                              target.ruleType === 'namespace-label-selector'
                                                ? 'namespaceSelectors'
                                                : 'podSelectors';
                                            return (
                                              <div
                                                key={sel.id}
                                                className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                                              >
                                                <Input
                                                  placeholder="input key"
                                                  value={sel.key}
                                                  onChange={(e) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      selectorField,
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
                                                      selectorField,
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
                                                      selectorField,
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
                                                      selectorField,
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
                                            );
                                          })}
                                          <div className="w-fit">
                                            <Button
                                              variant="secondary"
                                              size="sm"
                                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                              onClick={() =>
                                                addLabelSelector(
                                                  target.id,
                                                  target.ruleType === 'namespace-label-selector'
                                                    ? 'namespaceSelectors'
                                                    : 'podSelectors'
                                                )
                                              }
                                            >
                                              Add rule
                                            </Button>
                                          </div>
                                        </VStack>
                                      </div>
                                    )}

                                    {/* Combined namespace + pod selectors */}
                                    {target.ruleType === 'namespace-pod-label-selector' && (
                                      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 pt-3 pb-4 w-full">
                                        <VStack gap={2}>
                                          <VStack gap={2}>
                                            <span className="text-label-md text-[var(--color-text-default)]">
                                              Namespaces
                                            </span>
                                            {(target.namespaceSelectors || []).map((sel) => (
                                              <div
                                                key={sel.id}
                                                className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3 w-full"
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
                                          <VStack gap={2}>
                                            <span className="text-label-md text-[var(--color-text-default)]">
                                              Pod
                                            </span>
                                            {(target.podSelectors || []).map((sel) => (
                                              <div
                                                key={sel.id}
                                                className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3 w-full"
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
                                    )}

                                    {/* Matching Pods (for label selector types) */}
                                    {target.ruleType !== 'ip-block' && (
                                      <VStack gap={2} className="w-full">
                                        <span className="text-label-sm text-[var(--color-text-default)]">
                                          Matching Pods
                                        </span>
                                        <Table
                                          columns={MATCHING_PODS_COLUMNS}
                                          data={MOCK_MATCHING_PODS}
                                          rowKey="id"
                                          rowHeight="40px"
                                        />
                                      </VStack>
                                    )}

                                    {/* Exceptions (IP Block only) */}
                                    {target.ruleType === 'ip-block' && (
                                      <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                                        <VStack gap={1.5}>
                                          {target.exceptions.length > 0 && (
                                            <div className="grid grid-cols-[1fr_20px] gap-2 w-full">
                                              <span className="block text-label-sm text-[var(--color-text-default)]">
                                                Exception CIDR
                                              </span>
                                              <div />
                                            </div>
                                          )}
                                          {target.exceptions.map((ex, exIdx) => (
                                            <div
                                              key={exIdx}
                                              className="grid grid-cols-[1fr_20px] gap-2 w-full items-center"
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

                        {/* Allowed Ports */}
                        <VStack gap={3}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Allowed Ports
                          </label>

                          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                            <VStack gap={1.5} className="w-full">
                              {activeRule.allowedPorts.map((port) => (
                                <div
                                  key={port.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-3 w-full"
                                >
                                  <VStack gap={2}>
                                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
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
                                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
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
