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
  IconPlus,
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

interface IngressTarget {
  id: string;
  ruleType: string;
  cidr: string;
}

interface AllowedPort {
  id: string;
  port: string;
  protocol: string;
}

interface IngressRule {
  id: string;
  name: string;
  targets: IngressTarget[];
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

const RULE_TYPE_OPTIONS = [
  { value: 'ip-block', label: 'IP Block' },
  { value: 'namespace-selector', label: 'Namespace Selector' },
  { value: 'pod-selector', label: 'Pod Selector' },
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

// Mock matching pods data
const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'deploymentName-77f6bb9c69-4ww7f', createdAt: '2025-07-25 09:12:20' },
  { id: '2', name: 'deploymentName-77f6bb9c69-8xyz1', createdAt: '2025-07-25 09:12:18' },
  { id: '3', name: 'deploymentName-77f6bb9c69-2abc3', createdAt: '2025-07-25 09:12:15' },
];

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
   Main Page Component
   ---------------------------------------- */

export function CreateNetworkPolicyPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [networkPolicyName, setNetworkPolicyName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');

  // Ingress Rules state
  const [ingressEnabled, setIngressEnabled] = useState(true);
  const [ingressRules, setIngressRules] = useState<IngressRule[]>([
    {
      id: 'rule-1',
      name: 'Rule 1',
      targets: [],
      allowedPorts: [],
    },
  ]);
  const [activeRuleIndex, setActiveRuleIndex] = useState(0);

  // Selector state
  const [selectorRules, setSelectorRules] = useState<SelectorRule[]>([]);
  const [selectorCurrentPage, setSelectorCurrentPage] = useState(1);
  const selectorItemsPerPage = 10;

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Validation errors
  const [networkPolicyNameError, setNetworkPolicyNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Network Policy');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/network-policies');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!networkPolicyName.trim()) {
      setNetworkPolicyNameError('Network policy name is required.');
      return;
    }

    console.log('Creating network policy:', {
      networkPolicyName,
      namespace,
      description,
      ingressEnabled,
      ingressRules,
      selectorRules,
      labels,
      annotations,
    });
    navigate('/container/network-policies');
  }, [
    networkPolicyName,
    namespace,
    description,
    ingressEnabled,
    ingressRules,
    selectorRules,
    labels,
    annotations,
    navigate,
  ]);

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

  // Ingress Rules management
  const addIngressRule = useCallback(() => {
    const newRule: IngressRule = {
      id: `rule-${Date.now()}`,
      name: `Rule ${ingressRules.length + 1}`,
      targets: [],
      allowedPorts: [],
    };
    setIngressRules([...ingressRules, newRule]);
    setActiveRuleIndex(ingressRules.length);
  }, [ingressRules]);

  const removeIngressRule = useCallback(
    (index: number) => {
      const newRules = ingressRules.filter((_, i) => i !== index);
      setIngressRules(newRules);
      if (activeRuleIndex >= newRules.length) {
        setActiveRuleIndex(Math.max(0, newRules.length - 1));
      }
    },
    [ingressRules, activeRuleIndex]
  );

  const addIngressTarget = useCallback(() => {
    const newTarget: IngressTarget = {
      id: `target-${Date.now()}`,
      ruleType: 'ip-block',
      cidr: '',
    };
    const newRules = [...ingressRules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      targets: [...newRules[activeRuleIndex].targets, newTarget],
    };
    setIngressRules(newRules);
  }, [ingressRules, activeRuleIndex]);

  const removeIngressTarget = useCallback(
    (targetId: string) => {
      const newRules = [...ingressRules];
      newRules[activeRuleIndex] = {
        ...newRules[activeRuleIndex],
        targets: newRules[activeRuleIndex].targets.filter((t) => t.id !== targetId),
      };
      setIngressRules(newRules);
    },
    [ingressRules, activeRuleIndex]
  );

  const updateIngressTarget = useCallback(
    (targetId: string, field: keyof IngressTarget, value: string) => {
      const newRules = [...ingressRules];
      newRules[activeRuleIndex] = {
        ...newRules[activeRuleIndex],
        targets: newRules[activeRuleIndex].targets.map((t) =>
          t.id === targetId ? { ...t, [field]: value } : t
        ),
      };
      setIngressRules(newRules);
    },
    [ingressRules, activeRuleIndex]
  );

  const addAllowedPort = useCallback(() => {
    const newPort: AllowedPort = {
      id: `port-${Date.now()}`,
      port: '',
      protocol: 'TCP',
    };
    const newRules = [...ingressRules];
    newRules[activeRuleIndex] = {
      ...newRules[activeRuleIndex],
      allowedPorts: [...newRules[activeRuleIndex].allowedPorts, newPort],
    };
    setIngressRules(newRules);
  }, [ingressRules, activeRuleIndex]);

  const removeAllowedPort = useCallback(
    (portId: string) => {
      const newRules = [...ingressRules];
      newRules[activeRuleIndex] = {
        ...newRules[activeRuleIndex],
        allowedPorts: newRules[activeRuleIndex].allowedPorts.filter((p) => p.id !== portId),
      };
      setIngressRules(newRules);
    },
    [ingressRules, activeRuleIndex]
  );

  const updateAllowedPort = useCallback(
    (portId: string, field: keyof AllowedPort, value: string) => {
      const newRules = [...ingressRules];
      newRules[activeRuleIndex] = {
        ...newRules[activeRuleIndex],
        allowedPorts: newRules[activeRuleIndex].allowedPorts.map((p) =>
          p.id === portId ? { ...p, [field]: value } : p
        ),
      };
      setIngressRules(newRules);
    },
    [ingressRules, activeRuleIndex]
  );

  // Selector management
  const addSelectorRule = useCallback(() => {
    const newRule: SelectorRule = {
      id: `selector-${Date.now()}`,
      key: '',
      operator: 'in',
      value: '',
    };
    setSelectorRules([...selectorRules, newRule]);
  }, [selectorRules]);

  const removeSelectorRule = useCallback(
    (id: string) => {
      setSelectorRules(selectorRules.filter((rule) => rule.id !== id));
    },
    [selectorRules]
  );

  const updateSelectorRule = useCallback(
    (id: string, field: keyof SelectorRule, value: string) => {
      setSelectorRules(
        selectorRules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
      );
    },
    [selectorRules]
  );

  // Check if create button should be disabled
  const isCreateDisabled = !networkPolicyName.trim();

  // Compute section statuses for summary
  const basicInfoComplete = networkPolicyName.trim().length > 0;
  const ingressRulesComplete = true; // Optional section, always considered complete
  const selectorComplete = true; // Optional section, always considered complete
  const labelsAnnotationsComplete = true; // Optional section, always considered complete

  // Selector pagination
  const selectorTotalItems = MOCK_MATCHING_PODS.length;
  const selectorTotalPages = Math.ceil(selectorTotalItems / selectorItemsPerPage);
  const selectorPaginatedPods = MOCK_MATCHING_PODS.slice(
    (selectorCurrentPage - 1) * selectorItemsPerPage,
    selectorCurrentPage * selectorItemsPerPage
  );

  const activeRule = ingressRules[activeRuleIndex];

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

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create Network Policy
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
                            Name<span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Input
                            placeholder="Enter a unique name"
                            value={networkPolicyName}
                            onChange={(e) => {
                              setNetworkPolicyName(e.target.value);
                              if (networkPolicyNameError) setNetworkPolicyNameError(null);
                            }}
                            error={!!networkPolicyNameError}
                            fullWidth
                          />
                          {networkPolicyNameError && (
                            <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                              {networkPolicyNameError}
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

                  {/* Ingress Rules Section */}
                  <SectionCard>
                    <SectionCard.Header title="Ingress Rules" showDivider />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Checkbox to enable ingress rules */}
                        <Checkbox
                          checked={ingressEnabled}
                          onChange={(e) => setIngressEnabled(e.target.checked)}
                          label="Configure ingress rules to restrict incoming traffic"
                        />

                        {/* Rules content - only show when enabled */}
                        {ingressEnabled && (
                          <div className="flex w-full">
                            {/* Left tabs */}
                            <div className="flex flex-col gap-2 shrink-0">
                              <div className="flex flex-col">
                                {ingressRules.map((rule, index) => (
                                  <button
                                    key={rule.id}
                                    onClick={() => setActiveRuleIndex(index)}
                                    className={`flex items-center justify-between min-w-[80px] px-2 py-2 text-left border-l border-t border-b border-[var(--color-border-default)] ${
                                      index === 0 ? 'rounded-tl' : ''
                                    } ${index === ingressRules.length - 1 ? 'rounded-bl' : ''} ${
                                      activeRuleIndex === index
                                        ? 'bg-white text-[var(--color-action-primary)]'
                                        : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)]'
                                    }`}
                                  >
                                    <span className="text-[12px] font-medium px-1">
                                      {rule.name}
                                    </span>
                                    {ingressRules.length > 1 && activeRuleIndex !== index && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeIngressRule(index);
                                        }}
                                        className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded"
                                      >
                                        <IconX
                                          size={14}
                                          className="text-[var(--color-text-muted)]"
                                          stroke={1.5}
                                        />
                                      </button>
                                    )}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={addIngressRule}
                                className="flex items-center gap-1 px-2 py-1 text-[12px] font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                              >
                                <IconPlus size={10} stroke={1.5} />
                                Add Rule
                              </button>
                            </div>

                            {/* Right content panel */}
                            {activeRule && (
                              <div className="flex-1 border border-[var(--color-border-default)] rounded-tr rounded-br rounded-bl p-3">
                                <VStack gap={3}>
                                  {/* Targets Section */}
                                  <VStack gap={3}>
                                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                      Targets
                                    </span>

                                    {activeRule.targets.map((target) => (
                                      <div key={target.id} className="flex gap-3 items-start">
                                        <div className="flex-1 border border-[var(--color-border-strong)] rounded-md p-3">
                                          <VStack gap={3}>
                                            <div className="flex gap-3">
                                              <VStack gap={2} className="flex-1">
                                                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                                  Rule type
                                                </span>
                                                <Select
                                                  options={RULE_TYPE_OPTIONS}
                                                  value={target.ruleType}
                                                  onChange={(value) =>
                                                    updateIngressTarget(
                                                      target.id,
                                                      'ruleType',
                                                      value
                                                    )
                                                  }
                                                  fullWidth
                                                />
                                              </VStack>
                                              <VStack gap={2} className="flex-1">
                                                <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                                  CIDR
                                                </span>
                                                <Input
                                                  placeholder="e.g. 1.1.1.0/24"
                                                  value={target.cidr}
                                                  onChange={(e) =>
                                                    updateIngressTarget(
                                                      target.id,
                                                      'cidr',
                                                      e.target.value
                                                    )
                                                  }
                                                  fullWidth
                                                />
                                              </VStack>
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              leftIcon={<IconPlus size={12} stroke={1.5} />}
                                            >
                                              Add exception
                                            </Button>
                                          </VStack>
                                        </div>
                                        <button
                                          onClick={() => removeIngressTarget(target.id)}
                                          className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors mt-2"
                                        >
                                          <IconX
                                            size={16}
                                            className="text-[var(--color-text-muted)]"
                                            stroke={1.5}
                                          />
                                        </button>
                                      </div>
                                    ))}

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      leftIcon={<IconPlus size={12} stroke={1.5} />}
                                      onClick={addIngressTarget}
                                    >
                                      Add allowed traffic target
                                    </Button>
                                  </VStack>

                                  {/* Allowed Ports Section */}
                                  <VStack gap={3}>
                                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                      Allowed Ports
                                    </span>

                                    {activeRule.allowedPorts.map((port) => (
                                      <div key={port.id} className="flex gap-3 items-start">
                                        <div className="flex-1 border border-[var(--color-border-strong)] rounded-md p-3">
                                          <div className="flex gap-2">
                                            <VStack gap={2} className="flex-1">
                                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                                Port
                                              </span>
                                              <Input
                                                placeholder="e.g. 8080"
                                                value={port.port}
                                                onChange={(e) =>
                                                  updateAllowedPort(port.id, 'port', e.target.value)
                                                }
                                                fullWidth
                                              />
                                            </VStack>
                                            <VStack gap={2} className="flex-1">
                                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                                                Protocol
                                              </span>
                                              <Select
                                                options={PROTOCOL_OPTIONS}
                                                value={port.protocol}
                                                onChange={(value) =>
                                                  updateAllowedPort(port.id, 'protocol', value)
                                                }
                                                fullWidth
                                              />
                                            </VStack>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => removeAllowedPort(port.id)}
                                          className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors mt-2"
                                        >
                                          <IconX
                                            size={16}
                                            className="text-[var(--color-text-muted)]"
                                            stroke={1.5}
                                          />
                                        </button>
                                      </div>
                                    ))}

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      leftIcon={<IconPlus size={12} stroke={1.5} />}
                                      onClick={addAllowedPort}
                                    >
                                      Add allowed port
                                    </Button>
                                  </VStack>
                                </VStack>
                              </div>
                            )}
                          </div>
                        )}
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Selector Section */}
                  <SectionCard>
                    <SectionCard.Header title="Selector" showDivider />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Description */}
                        <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                          Selector keys and values are intended to match labels and values on
                          existing pods.
                        </span>

                        {/* Column Headers */}
                        <div className="flex gap-2 w-full">
                          <div className="flex-1">
                            <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                              Key
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                              Operator
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                              Value
                            </span>
                          </div>
                          <div className="w-[23px]" />
                        </div>

                        {/* Selector Rules */}
                        {selectorRules.length > 0 && (
                          <VStack gap={2} className="w-full">
                            {selectorRules.map((rule) => (
                              <div key={rule.id} className="flex gap-2 items-center w-full">
                                <div className="flex-1">
                                  <Input
                                    placeholder="input key"
                                    value={rule.key}
                                    onChange={(e) =>
                                      updateSelectorRule(rule.id, 'key', e.target.value)
                                    }
                                    fullWidth
                                  />
                                </div>
                                <div className="flex-1">
                                  <Select
                                    options={OPERATOR_OPTIONS}
                                    value={rule.operator}
                                    onChange={(value) =>
                                      updateSelectorRule(rule.id, 'operator', value)
                                    }
                                    fullWidth
                                  />
                                </div>
                                <div className="flex-1">
                                  <Input
                                    placeholder="input value"
                                    value={rule.value}
                                    onChange={(e) =>
                                      updateSelectorRule(rule.id, 'value', e.target.value)
                                    }
                                    fullWidth
                                  />
                                </div>
                                <button
                                  onClick={() => removeSelectorRule(rule.id)}
                                  className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors w-[23px] flex justify-center"
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

                        {/* Add Rule Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<IconPlus size={12} stroke={1.5} />}
                          onClick={addSelectorRule}
                        >
                          Add Rule
                        </Button>

                        {/* Matching Pods Section */}
                        <VStack gap={2} className="w-full">
                          <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16.5px]">
                            Matching Pods
                          </span>

                          {/* Pagination */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectorCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={selectorCurrentPage === 1}
                              className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
                            >
                              <span className="text-[var(--color-text-default)]">‹</span>
                            </button>
                            <span className="w-6 h-6 flex items-center justify-center bg-[var(--color-action-primary)] text-white rounded-md text-[11px] font-medium">
                              {selectorCurrentPage}
                            </span>
                            <button
                              onClick={() =>
                                setSelectorCurrentPage((p) => Math.min(selectorTotalPages, p + 1))
                              }
                              disabled={selectorCurrentPage === selectorTotalPages}
                              className="w-6 h-6 flex items-center justify-center disabled:opacity-30"
                            >
                              <span className="text-[var(--color-text-default)]">›</span>
                            </button>
                            <div className="w-px h-4 bg-[var(--color-border-default)]" />
                            <span className="text-[11px] text-[var(--color-text-subtle)]">
                              {selectorTotalItems} items
                            </span>
                          </div>

                          {/* Table */}
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
                            data={selectorPaginatedPods}
                            rowKey="id"
                          />
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Labels & Annotations Section */}
                  <SectionCard>
                    <SectionCard.Header title="Labels & Annotations" showDivider />
                    <SectionCard.Content>
                      <VStack gap={4}>
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
                              label="Ingress Rules"
                              status={ingressRulesComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Selector"
                              status={selectorComplete ? 'complete' : 'in-progress'}
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
                          Create Network Policy
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

export default CreateNetworkPolicyPage;
