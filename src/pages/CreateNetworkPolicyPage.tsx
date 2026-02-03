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
  Checkbox,
  Table,
  Disclosure,
} from '@/design-system';
import type { WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
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
  'basic-info': 'Basic Information',
  'ingress-rules': 'Ingress Rules',
  'egress-rules': 'Egress Rules',
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
  { value: 'namespace-selector', label: 'Namespace Selector' },
  { value: 'pod-selector', label: 'Pod Selector' },
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

// Mock matching pods data
const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'deploymentName-77f6bb9c69-4ww7f', createdAt: '2025-07-25 09:12:20' },
  { id: '2', name: 'deploymentName-77f6bb9c69-8xyz1', createdAt: '2025-07-25 09:12:18' },
  { id: '3', name: 'deploymentName-77f6bb9c69-2abc3', createdAt: '2025-07-25 09:12:15' },
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
            size="sm"
            className="w-[80px]"
            onClick={() => navigate('/container/network-policies')}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" className="flex-1">
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
  description: string;
  checkboxLabel: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  rules: TrafficRule[];
  onRulesChange: (rules: TrafficRule[]) => void;
}

function TrafficRulesSection({
  title,
  description,
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
      targets: newRules[activeRuleIndex].targets.map((t) =>
        t.id === targetId ? { ...t, [field]: value } : t
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
    <SectionCard>
      <SectionCard.Header title={title} />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Enable checkbox */}
          <VStack gap={2}>
            <Checkbox
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
              label={checkboxLabel}
            />
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">{description}</p>
          </VStack>

          {/* Rules content - only show when enabled */}
          {enabled && (
            <VStack gap={3}>
              <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Rules
              </label>

              <div className="border border-[var(--color-border-default)] rounded-[6px] w-full">
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
                        <span className="text-[12px] font-medium">{rule.name}</span>
                        {rules.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRule(index);
                            }}
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconX
                              size={12}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        )}
                      </button>
                    ))}
                    <button
                      onClick={addRule}
                      className="flex items-center gap-1 px-3 py-2 text-[12px] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] bg-[var(--color-surface-subtle)]"
                    >
                      <IconCirclePlus size={12} stroke={1.5} />
                      Add Rule
                    </button>
                  </div>

                  {/* Right content panel */}
                  {activeRule && (
                    <div className="flex-1 p-3">
                      <VStack gap={6}>
                        {/* Targets Section */}
                        <VStack gap={3}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            Targets
                          </label>

                          {activeRule.targets.length > 0 && (
                            <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                              <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                Rule type
                              </label>
                              <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                CIDR
                              </label>
                              <div />
                            </div>
                          )}

                          {activeRule.targets.map((target) => (
                            <div
                              key={target.id}
                              className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                            >
                              <Select
                                options={RULE_TYPE_OPTIONS}
                                value={target.ruleType}
                                onChange={(value) => updateTarget(target.id, 'ruleType', value)}
                                fullWidth
                              />
                              <Input
                                placeholder="e.g. 1.1.1.0/24"
                                value={target.cidr}
                                onChange={(e) => updateTarget(target.id, 'cidr', e.target.value)}
                                fullWidth
                              />
                              <button
                                onClick={() => removeTarget(target.id)}
                                className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconX
                                  size={12}
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
                              onClick={addTarget}
                            >
                              Add allowed traffic target
                            </Button>
                          </div>
                        </VStack>

                        {/* Allowed Ports Section */}
                        <VStack gap={3}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            allowedPorts
                          </label>

                          {activeRule.allowedPorts.length > 0 && (
                            <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                              <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                Port
                              </label>
                              <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                Protocol
                              </label>
                              <div />
                            </div>
                          )}

                          {activeRule.allowedPorts.map((port) => (
                            <div
                              key={port.id}
                              className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                            >
                              <Input
                                placeholder="e.g. 8080"
                                value={port.port}
                                onChange={(e) => updateAllowedPort(port.id, 'port', e.target.value)}
                                fullWidth
                              />
                              <Select
                                options={PROTOCOL_OPTIONS}
                                value={port.protocol}
                                onChange={(value) => updateAllowedPort(port.id, 'protocol', value)}
                                fullWidth
                              />
                              <button
                                onClick={() => removeAllowedPort(port.id)}
                                className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconX
                                  size={12}
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
                              onClick={addAllowedPort}
                            >
                              Add allowed port
                            </Button>
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
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Create Network Policy');
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
  const [ingressEnabled, setIngressEnabled] = useState(false);
  const [ingressRules, setIngressRules] = useState<TrafficRule[]>([
    { id: 'ingress-rule-1', name: 'Rule 1', targets: [], allowedPorts: [] },
  ]);

  // Egress Rules state
  const [egressEnabled, setEgressEnabled] = useState(false);
  const [egressRules, setEgressRules] = useState<TrafficRule[]>([
    { id: 'egress-rule-1', name: 'Rule 1', targets: [], allowedPorts: [] },
  ]);

  // Selector state
  const [selectorRules, setSelectorRules] = useState<SelectorRule[]>([]);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

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
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />

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
                { label: 'Create Network Policy' },
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

        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Page Header */}
              <VStack gap={2}>
                <h1 className="text-heading-h4">Create Network Policy</h1>
                <p className="text-body-sm text-[var(--color-text-subtle)]">
                  Network policies are used to control the traffic flow between pods within the
                  cluster based on defined rules for ingress and egress.
                </p>
              </VStack>

              {/* Main Content with Summary Sidebar */}
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
                            value={policyName}
                            onChange={(e) => setPolicyName(e.target.value)}
                            fullWidth
                          />
                        </VStack>

                        {/* Description (collapsible) */}
                        <Disclosure>
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
                    title="Ingress Rules"
                    description="If this box is not checked, all ingress traffic will be allowed to all pods."
                    checkboxLabel="Configure ingress rules to restrict incoming traffic"
                    enabled={ingressEnabled}
                    onEnabledChange={setIngressEnabled}
                    rules={ingressRules}
                    onRulesChange={setIngressRules}
                  />

                  {/* Egress Rules Section */}
                  <TrafficRulesSection
                    title="Egress Rules"
                    description="If this box is not checked, all egress traffic will be allowed from all pods."
                    checkboxLabel="Configure egress rules to restrict outgoing traffic"
                    enabled={egressEnabled}
                    onEnabledChange={setEgressEnabled}
                    rules={egressRules}
                    onRulesChange={setEgressRules}
                  />

                  {/* Selector Section */}
                  <SectionCard>
                    <SectionCard.Header title="Selector" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                          Selector keys and values are intended to match labels and values on
                          existing pods.
                        </p>

                        {/* Selector Rules */}
                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {selectorRules.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
                                <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                  Key
                                </label>
                                <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                  Operator
                                </label>
                                <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                  Value
                                </label>
                                <div />
                              </div>
                            )}

                            {selectorRules.map((rule) => (
                              <div
                                key={rule.id}
                                className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="input key"
                                  value={rule.key}
                                  onChange={(e) =>
                                    updateSelectorRule(rule.id, 'key', e.target.value)
                                  }
                                  fullWidth
                                />
                                <Select
                                  options={OPERATOR_OPTIONS}
                                  value={rule.operator}
                                  onChange={(value) =>
                                    updateSelectorRule(rule.id, 'operator', value)
                                  }
                                  fullWidth
                                />
                                <Input
                                  placeholder="input value"
                                  value={rule.value}
                                  onChange={(e) =>
                                    updateSelectorRule(rule.id, 'value', e.target.value)
                                  }
                                  fullWidth
                                />
                                <button
                                  onClick={() => removeSelectorRule(rule.id)}
                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                >
                                  <IconX
                                    size={12}
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
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            Matching Pods
                          </label>
                          <Table
                            columns={[
                              {
                                key: 'name',
                                label: 'Name',
                                render: (value) => (
                                  <span className="text-[var(--color-action-primary)]">
                                    {value}
                                  </span>
                                ),
                              },
                              {
                                key: 'createdAt',
                                label: 'Created At',
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
                            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the labels used to identify and categorize the resource.
                            </span>
                          </VStack>

                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={2}>
                              {labels.length > 0 && (
                                <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                                  <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                    Key
                                  </label>
                                  <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                    Value
                                  </label>
                                  <div />
                                </div>
                              )}
                              {labels.map((label) => (
                                <div
                                  key={label.id}
                                  className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
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
                                      size={12}
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
                            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Annotations
                            </label>
                            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the annotations used to provide additional metadata for the
                              resource.
                            </span>
                          </VStack>

                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={2}>
                              {annotations.length > 0 && (
                                <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                                  <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                    Key
                                  </label>
                                  <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                    Value
                                  </label>
                                  <div />
                                </div>
                              )}
                              {annotations.map((annotation) => (
                                <div
                                  key={annotation.id}
                                  className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
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
                                      size={12}
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateNetworkPolicyPage;
