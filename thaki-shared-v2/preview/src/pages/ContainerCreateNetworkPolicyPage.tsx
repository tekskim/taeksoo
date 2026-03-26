import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Checkbox } from '@shared/components/Checkbox';
import { Table } from '@shared/components/Table';
import { Disclosure } from '@shared/components/Disclosure';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { IconX, IconCirclePlus } from '@tabler/icons-react';

const isV2 = true;

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

interface LabelSelector {
  id: string;
  key: string;
  operator: string;
  values: string;
}

interface RuleTarget {
  id: string;
  ruleType: string;
  cidr: string;
  exceptions: string[];
  namespaceSelectors?: LabelSelector[];
  podSelectors?: LabelSelector[];
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

interface MatchingPod extends Record<string, unknown> {
  id: string;
  name: string;
  createdAt: string;
}

const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'default', createdAt: 'Jul 25, 2025 09:12:20' },
];

const NP_MATCH_TABLE_COLS: TableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'createdAt', header: 'Created At', sortable: true },
];

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
      <SectionCard.Content showDividers={false}>
        <div className="flex flex-col gap-6">
          {/* Enable checkbox */}
          <Checkbox checked={enabled} onChange={onEnabledChange} label={checkboxLabel} />

          {/* Rules content - only show when enabled */}
          {enabled && (
            <div className="flex flex-col gap-3">
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
                            ? 'bg-[var(--color-surface-default)] text-primary'
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
                      <div className="flex flex-col gap-6">
                        {/* Targets Section */}
                        <div className="flex flex-col gap-3">
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Targets
                          </label>

                          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                            <div className="flex w-full flex-col gap-1.5">
                              {activeRule.targets.map((target) => (
                                <div
                                  key={target.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                                >
                                  <div className="flex flex-col gap-3">
                                    {/* Rule type + CIDR row */}
                                    <div className="flex flex-col gap-2">
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
                                        <Dropdown.Select
                                          value={target.ruleType}
                                          onChange={(v) =>
                                            updateTarget(target.id, 'ruleType', String(v))
                                          }
                                          className="w-full"
                                        >
                                          {RULE_TYPE_OPTIONS.map((opt) => (
                                            <Dropdown.Option
                                              key={opt.value}
                                              value={opt.value}
                                              label={opt.label}
                                            />
                                          ))}
                                        </Dropdown.Select>
                                        {target.ruleType === 'ip-block' ? (
                                          <Input
                                            placeholder="e.g. 1.1.1.0/24"
                                            value={target.cidr}
                                            onChange={(_e, v) => updateTarget(target.id, 'cidr', v)}
                                            className="w-full"
                                          />
                                        ) : (
                                          <div />
                                        )}
                                        <div />
                                      </div>
                                    </div>

                                    {/* Namespace Label Selectors (namespace-label-selector only) */}
                                    {target.ruleType === 'namespace-label-selector' && (
                                      <>
                                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                          <div className="flex flex-col gap-1.5">
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
                                                  onChange={(_e, v) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'namespaceSelectors',
                                                      sel.id,
                                                      'key',
                                                      v
                                                    )
                                                  }
                                                  className="w-full"
                                                />
                                                <Dropdown.Select
                                                  value={sel.operator}
                                                  onChange={(v) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'namespaceSelectors',
                                                      sel.id,
                                                      'operator',
                                                      String(v)
                                                    )
                                                  }
                                                  className="w-full"
                                                >
                                                  {OPERATOR_OPTIONS.map((opt) => (
                                                    <Dropdown.Option
                                                      key={opt.value}
                                                      value={opt.value}
                                                      label={opt.label}
                                                    />
                                                  ))}
                                                </Dropdown.Select>
                                                <Input
                                                  placeholder="input values"
                                                  value={sel.values}
                                                  onChange={(_e, v) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'namespaceSelectors',
                                                      sel.id,
                                                      'values',
                                                      v
                                                    )
                                                  }
                                                  className="w-full"
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
                                                variant="muted"
                                                appearance="outline"
                                                size="sm"
                                                onClick={() =>
                                                  addLabelSelector(target.id, 'namespaceSelectors')
                                                }
                                              >
                                                <span className="inline-flex items-center gap-1">
                                                  <IconCirclePlus size={12} />
                                                  Add rule
                                                </span>
                                              </Button>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Matching Pods */}
                                        <div className="flex w-full flex-col gap-2">
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
                                            columns={NP_MATCH_TABLE_COLS}
                                            rows={MOCK_MATCHING_PODS}
                                          >
                                            {MOCK_MATCHING_PODS.map((row) => (
                                              <Table.Tr key={row.id} rowData={row}>
                                                <Table.Td
                                                  rowData={row}
                                                  column={NP_MATCH_TABLE_COLS[0]}
                                                >
                                                  <span className="text-label-md text-primary">
                                                    {row.name}
                                                  </span>
                                                </Table.Td>
                                                <Table.Td
                                                  rowData={row}
                                                  column={NP_MATCH_TABLE_COLS[1]}
                                                >
                                                  {row.createdAt}
                                                </Table.Td>
                                              </Table.Tr>
                                            ))}
                                          </Table>
                                        </div>
                                      </>
                                    )}

                                    {/* Combined Namespace + Pod Selectors (namespace-pod-label-selector) */}
                                    {target.ruleType === 'namespace-pod-label-selector' && (
                                      <>
                                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 pt-3 pb-4 w-full">
                                          <div className="flex flex-col gap-2">
                                            {/* Namespaces section */}
                                            <div className="flex flex-col gap-2">
                                              <span className="text-label-md text-[var(--color-text-default)]">
                                                Namespaces
                                              </span>
                                              {(target.namespaceSelectors || []).map((sel) => (
                                                <div
                                                  key={sel.id}
                                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                                >
                                                  <div className="flex gap-1 w-full">
                                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Key
                                                      </span>
                                                      <Input
                                                        placeholder="Input Key"
                                                        value={sel.key}
                                                        onChange={(_e, v) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'namespaceSelectors',
                                                            sel.id,
                                                            'key',
                                                            v
                                                          )
                                                        }
                                                        className="w-full"
                                                      />
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Operator
                                                      </span>
                                                      <Dropdown.Select
                                                        value={sel.operator}
                                                        onChange={(v) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'namespaceSelectors',
                                                            sel.id,
                                                            'operator',
                                                            String(v)
                                                          )
                                                        }
                                                        className="w-full"
                                                      >
                                                        {OPERATOR_OPTIONS.map((opt) => (
                                                          <Dropdown.Option
                                                            key={opt.value}
                                                            value={opt.value}
                                                            label={opt.label}
                                                          />
                                                        ))}
                                                      </Dropdown.Select>
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Value
                                                      </span>
                                                      <Input
                                                        placeholder="input value"
                                                        value={sel.values}
                                                        onChange={(_e, v) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'namespaceSelectors',
                                                            sel.id,
                                                            'values',
                                                            v
                                                          )
                                                        }
                                                        className="w-full"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>

                                            {/* Pod section */}
                                            <div className="flex flex-col gap-2">
                                              <span className="text-label-md text-[var(--color-text-default)]">
                                                Pod
                                              </span>
                                              {(target.podSelectors || []).map((sel) => (
                                                <div
                                                  key={sel.id}
                                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                                >
                                                  <div className="flex gap-1 w-full">
                                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Key
                                                      </span>
                                                      <Input
                                                        placeholder="Input Key"
                                                        value={sel.key}
                                                        onChange={(_e, v) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'podSelectors',
                                                            sel.id,
                                                            'key',
                                                            v
                                                          )
                                                        }
                                                        className="w-full"
                                                      />
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Operator
                                                      </span>
                                                      <Dropdown.Select
                                                        value={sel.operator}
                                                        onChange={(v) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'podSelectors',
                                                            sel.id,
                                                            'operator',
                                                            String(v)
                                                          )
                                                        }
                                                        className="w-full"
                                                      >
                                                        {OPERATOR_OPTIONS.map((opt) => (
                                                          <Dropdown.Option
                                                            key={opt.value}
                                                            value={opt.value}
                                                            label={opt.label}
                                                          />
                                                        ))}
                                                      </Dropdown.Select>
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                                        Value
                                                      </span>
                                                      <Input
                                                        placeholder="input value"
                                                        value={sel.values}
                                                        onChange={(_e, v) =>
                                                          updateLabelSelector(
                                                            target.id,
                                                            'podSelectors',
                                                            sel.id,
                                                            'values',
                                                            v
                                                          )
                                                        }
                                                        className="w-full"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Matching Pods */}
                                        <div className="flex w-full flex-col gap-2">
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
                                            columns={NP_MATCH_TABLE_COLS}
                                            rows={MOCK_MATCHING_PODS}
                                          >
                                            {MOCK_MATCHING_PODS.map((row) => (
                                              <Table.Tr key={row.id} rowData={row}>
                                                <Table.Td
                                                  rowData={row}
                                                  column={NP_MATCH_TABLE_COLS[0]}
                                                >
                                                  <span className="text-label-md text-primary">
                                                    {row.name}
                                                  </span>
                                                </Table.Td>
                                                <Table.Td
                                                  rowData={row}
                                                  column={NP_MATCH_TABLE_COLS[1]}
                                                >
                                                  {row.createdAt}
                                                </Table.Td>
                                              </Table.Tr>
                                            ))}
                                          </Table>
                                        </div>
                                      </>
                                    )}

                                    {/* Pod Label Selectors (shown for pod type only) */}
                                    {target.ruleType === 'pod-label-selector' && (
                                      <>
                                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                          <div className="flex flex-col gap-1.5">
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
                                                  onChange={(_e, v) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'podSelectors',
                                                      sel.id,
                                                      'key',
                                                      v
                                                    )
                                                  }
                                                  className="w-full"
                                                />
                                                <Dropdown.Select
                                                  value={sel.operator}
                                                  onChange={(v) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'podSelectors',
                                                      sel.id,
                                                      'operator',
                                                      String(v)
                                                    )
                                                  }
                                                  className="w-full"
                                                >
                                                  {OPERATOR_OPTIONS.map((opt) => (
                                                    <Dropdown.Option
                                                      key={opt.value}
                                                      value={opt.value}
                                                      label={opt.label}
                                                    />
                                                  ))}
                                                </Dropdown.Select>
                                                <Input
                                                  placeholder="input values"
                                                  value={sel.values}
                                                  onChange={(_e, v) =>
                                                    updateLabelSelector(
                                                      target.id,
                                                      'podSelectors',
                                                      sel.id,
                                                      'values',
                                                      v
                                                    )
                                                  }
                                                  className="w-full"
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
                                                variant="muted"
                                                appearance="outline"
                                                size="sm"
                                                onClick={() =>
                                                  addLabelSelector(target.id, 'podSelectors')
                                                }
                                              >
                                                <span className="inline-flex items-center gap-1">
                                                  <IconCirclePlus size={12} />
                                                  Add pod selector
                                                </span>
                                              </Button>
                                            </div>
                                          </div>
                                        </div>

                                        {target.ruleType === 'pod-label-selector' && (
                                          <div className="flex w-full flex-col gap-2">
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
                                              columns={NP_MATCH_TABLE_COLS}
                                              rows={MOCK_MATCHING_PODS}
                                            >
                                              {MOCK_MATCHING_PODS.map((row) => (
                                                <Table.Tr key={row.id} rowData={row}>
                                                  <Table.Td
                                                    rowData={row}
                                                    column={NP_MATCH_TABLE_COLS[0]}
                                                  >
                                                    <span className="text-label-md text-primary">
                                                      {row.name}
                                                    </span>
                                                  </Table.Td>
                                                  <Table.Td
                                                    rowData={row}
                                                    column={NP_MATCH_TABLE_COLS[1]}
                                                  >
                                                    {row.createdAt}
                                                  </Table.Td>
                                                </Table.Tr>
                                              ))}
                                            </Table>
                                          </div>
                                        )}
                                      </>
                                    )}

                                    {/* Exceptions list (shown for IP block) */}
                                    {target.ruleType === 'ip-block' && (
                                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                        <div className="flex flex-col gap-1.5">
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
                                                onChange={(_e, v) =>
                                                  updateException(target.id, exIdx, v)
                                                }
                                                className="w-full"
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
                                              variant="muted"
                                              appearance="outline"
                                              size="sm"
                                              onClick={() => addException(target.id)}
                                            >
                                              <span className="inline-flex items-center gap-1">
                                                <IconCirclePlus size={12} />
                                                Add exception
                                              </span>
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <div className="w-fit">
                                <Button
                                  variant="muted"
                                  appearance="outline"
                                  size="sm"
                                  onClick={addTarget}
                                >
                                  <span className="inline-flex items-center gap-1">
                                    <IconCirclePlus size={12} />
                                    Add allowed traffic source
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Allowed Ports Section */}
                        <div className="flex flex-col gap-3">
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Allowed Ports
                          </label>

                          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                            <div className="flex w-full flex-col gap-1.5">
                              {activeRule.allowedPorts.map((port) => (
                                <div
                                  key={port.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                                >
                                  <div className="flex flex-col gap-2">
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
                                        onChange={(_e, v) => updateAllowedPort(port.id, 'port', v)}
                                        className="w-full"
                                      />
                                      <Dropdown.Select
                                        value={port.protocol}
                                        onChange={(v) =>
                                          updateAllowedPort(port.id, 'protocol', String(v))
                                        }
                                        className="w-full"
                                      >
                                        {PROTOCOL_OPTIONS.map((opt) => (
                                          <Dropdown.Option
                                            key={opt.value}
                                            value={opt.value}
                                            label={opt.label}
                                          />
                                        ))}
                                      </Dropdown.Select>
                                      <div />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div className="w-fit">
                                <Button
                                  variant="muted"
                                  appearance="outline"
                                  size="sm"
                                  onClick={addAllowedPort}
                                >
                                  <span className="inline-flex items-center gap-1">
                                    <IconCirclePlus size={12} />
                                    Add allowed port
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */
export function ContainerCreateNetworkPolicyPage() {
  const navigate = useNavigate();
  const [descOpen, setDescOpen] = useState(isV2);

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
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ id: '0', key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ id: '0', key: '', value: '' }] : []
  );

  // Section states for summary
  const getSectionStates = (): Record<NetworkPolicySectionStep, WizardSectionState> => {
    return {
      'basic-info': policyName ? 'done' : 'active',
      'ingress-rules': ingressEnabled && ingressRules.length > 0 ? 'done' : 'pre',
      'egress-rules': egressEnabled && egressRules.length > 0 ? 'done' : 'pre',
      selector: selectorRules.length > 0 ? 'done' : 'pre',
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pre',
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

  const sectionStates = getSectionStates();

  return (
    <CreateLayout
      header={
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-h4 text-text">Create network policy</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Network policies are used to control the traffic flow between pods within the cluster
            based on defined rules for ingress and egress.
          </p>
        </div>
      }
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: NETWORK_POLICY_SECTION_ORDER.map((key) => ({
                label: NETWORK_POLICY_SECTION_LABELS[key],
                status: mapStatus(sectionStates[key]),
              })),
            },
          ]}
          cancelLabel="Cancel"
          actionLabel="Create"
          actionEnabled
          onCancel={() => navigate('/container/network-policies')}
          onAction={() => {}}
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
                  <Dropdown.Select
                    value={namespace}
                    onChange={(v) => setNamespace(String(v))}
                    className="w-full"
                  >
                    {NAMESPACE_OPTIONS.map((opt) => (
                      <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>

                {/* Name */}
                <FormField label="Name" required>
                  <Input
                    placeholder="Enter a unique name"
                    value={policyName}
                    onChange={(_e, v) => setPolicyName(v)}
                    className="w-full"
                  />
                </FormField>

                {/* Description (collapsible) */}
                <Disclosure label="Description" expanded={descOpen} onExpandChange={setDescOpen}>
                  <div className="pt-2">
                    <Input
                      placeholder="Description"
                      value={description}
                      onChange={(_e, v) => setDescription(v)}
                      className="w-full"
                    />
                  </div>
                </Disclosure>
              </div>
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
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-6">
                {/* Selector Rules */}
                <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                  <div className="flex flex-col gap-1.5">
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
                          onChange={(_e, v) => updateSelectorRule(rule.id, 'key', v)}
                          className="w-full"
                        />
                        <Dropdown.Select
                          value={rule.operator}
                          onChange={(v) => updateSelectorRule(rule.id, 'operator', String(v))}
                          className="w-full"
                        >
                          {OPERATOR_OPTIONS.map((opt) => (
                            <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                          ))}
                        </Dropdown.Select>
                        <Input
                          placeholder="input value"
                          value={rule.value}
                          onChange={(_e, v) => updateSelectorRule(rule.id, 'value', v)}
                          className="w-full"
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
                        variant="muted"
                        appearance="outline"
                        size="sm"
                        onClick={addSelectorRule}
                      >
                        <span className="inline-flex items-center gap-1">
                          <IconCirclePlus size={12} />
                          Add Rule
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Matching Pods */}
                <div className="flex flex-col gap-3">
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Matching Pods
                  </label>
                  <Table columns={NP_MATCH_TABLE_COLS} rows={MOCK_MATCHING_PODS}>
                    {MOCK_MATCHING_PODS.map((row) => (
                      <Table.Tr key={row.id} rowData={row}>
                        <Table.Td rowData={row} column={NP_MATCH_TABLE_COLS[0]}>
                          <span className="text-label-md text-primary">{row.name}</span>
                        </Table.Td>
                        <Table.Td rowData={row} column={NP_MATCH_TABLE_COLS[1]}>
                          {String(row.createdAt).replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Labels & Annotations Section */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Labels & Annotations" />
            <SectionCard.Content showDividers={false}>
              <div className="flex flex-col gap-6">
                {/* Labels */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-label-lg text-[var(--color-text-default)]">Labels</label>
                    <span className="text-body-md text-[var(--color-text-subtle)]">
                      Specify the labels used to identify and categorize the resource.
                    </span>
                  </div>

                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <div className="flex flex-col gap-1.5">
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
                            onChange={(_e, v) => updateLabel(label.id, 'key', v)}
                            className="w-full"
                          />
                          <Input
                            placeholder="label value"
                            value={label.value}
                            onChange={(_e, v) => updateLabel(label.id, 'value', v)}
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
                      <div className="w-fit">
                        <Button variant="muted" appearance="outline" size="sm" onClick={addLabel}>
                          <span className="inline-flex items-center gap-1">
                            <IconCirclePlus size={12} />
                            Add Label
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annotations */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Annotations
                    </label>
                    <span className="text-body-md text-[var(--color-text-subtle)]">
                      Specify the annotations used to provide additional metadata for the resource.
                    </span>
                  </div>

                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <div className="flex flex-col gap-1.5">
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
                            onChange={(_e, v) => updateAnnotation(annotation.id, 'key', v)}
                            className="w-full"
                          />
                          <Input
                            placeholder="annotation value"
                            value={annotation.value}
                            onChange={(_e, v) => updateAnnotation(annotation.id, 'value', v)}
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
                      <div className="w-fit">
                        <Button
                          variant="muted"
                          appearance="outline"
                          size="sm"
                          onClick={addAnnotation}
                        >
                          <span className="inline-flex items-center gap-1">
                            <IconCirclePlus size={12} />
                            Add Annotation
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>
        </div>
      </div>
    </CreateLayout>
  );
}

export default ContainerCreateNetworkPolicyPage;
