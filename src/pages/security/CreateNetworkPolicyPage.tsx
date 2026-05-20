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
  Table,
  Disclosure,
  Pagination,
  WizardSummary,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import { SecuritySidebar } from '@/components/SecuritySidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconX, IconCirclePlus } from '@tabler/icons-react';
import { TrafficRulesSection } from '@/components/TrafficRulesSection';
import type { TrafficRule } from '@/components/TrafficRulesSection';

type SectionStep =
  | 'basic-info'
  | 'ingress-rules'
  | 'egress-rules'
  | 'selector'
  | 'labels-annotations';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'ingress-rules': 'Ingress Rules',
  'egress-rules': 'Egress Rules',
  selector: 'Selector',
  'labels-annotations': 'Labels & Annotations',
};

const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'ingress-rules',
  'egress-rules',
  'selector',
  'labels-annotations',
];

const CLUSTER_OPTIONS = [
  { value: 'cluster-01', label: 'prod-cluster-01' },
  { value: 'cluster-02', label: 'staging-cluster-02' },
  { value: 'cluster-03', label: 'dev-cluster-03' },
];

const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
  { value: 'production', label: 'production' },
  { value: 'monitoring', label: 'monitoring' },
];

const OPERATOR_OPTIONS = [
  { value: 'in', label: 'in list' },
  { value: 'not-in', label: 'not in list' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' },
];

interface SelectorRule {
  id: string;
  key: string;
  operator: string;
  value: string;
}

interface KeyValue {
  id: string;
  key: string;
  value: string;
}

interface MatchingPod {
  id: string;
  name: string;
  createdAt: string;
}

const MOCK_MATCHING_PODS: MatchingPod[] = [
  { id: '1', name: 'deploymentName-77f16bb9c69-4wa7f', createdAt: '2025-07-25 09:12:20' },
];

function SummarySidebar({
  sectionStates,
  onCreate,
  createDisabled,
}: {
  sectionStates: Record<SectionStep, WizardSectionState>;
  onCreate: () => void;
  createDisabled: boolean;
}) {
  const navigate = useNavigate();

  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStates[key],
  }));

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-6">
        <WizardSummary items={summaryItems} />

        <HStack gap={2}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/security/network-policies')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={onCreate}
            disabled={createDisabled}
          >
            Create Network Policy
          </Button>
        </HStack>
      </div>
    </div>
  );
}

export function SecurityCreateNetworkPolicyPage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  useEffect(() => {
    updateActiveTabLabel('Create Network Policy');
  }, [updateActiveTabLabel]);

  // Basic Information
  const [cluster, setCluster] = useState('');
  const [namespace, setNamespace] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');

  // Ingress / Egress
  const [ingressEnabled, setIngressEnabled] = useState(false);
  const [egressEnabled, setEgressEnabled] = useState(false);
  const [ingressRules, setIngressRules] = useState<TrafficRule[]>([
    { id: 'ingress-rule-1', name: 'Rule 1', targets: [], allowedPorts: [] },
  ]);
  const [egressRules, setEgressRules] = useState<TrafficRule[]>([
    { id: 'egress-rule-1', name: 'Rule 1', targets: [], allowedPorts: [] },
  ]);

  // Selector
  const [selectorRules, setSelectorRules] = useState<SelectorRule[]>([
    { id: crypto.randomUUID(), key: '', operator: 'in', value: '' },
  ]);
  const [selectorPage, setSelectorPage] = useState(1);

  // Labels & Annotations
  const [labels, setLabels] = useState<KeyValue[]>([]);
  const [annotations, setAnnotations] = useState<KeyValue[]>([]);

  const getSectionStates = (): Record<SectionStep, WizardSectionState> => ({
    'basic-info': cluster && namespace && policyName ? 'done' : 'active',
    'ingress-rules': ingressEnabled ? 'done' : 'done',
    'egress-rules': egressEnabled ? 'done' : 'done',
    selector: selectorRules.some((r) => r.key) ? 'done' : 'done',
    'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'done',
  });

  // Selector handlers
  const addSelectorRule = useCallback(() => {
    setSelectorRules((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: '', operator: 'in', value: '' },
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
    setLabels((prev) => [...prev, { id: crypto.randomUUID(), key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  // Annotation handlers
  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { id: crypto.randomUUID(), key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnotation = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }, []);

  const handleCreate = useCallback(() => {
    if (!policyName.trim()) return;
    navigate('/security/network-policies');
  }, [policyName, navigate]);

  return (
    <PageShell
      sidebar={<SecuritySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Security', href: '/security' },
                { label: 'Network Policies', href: '/security/network-policies' },
                { label: 'Create Network Policy' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={1}>
          <h1 className="text-heading-h4">Create Network Policy</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Network Policy defines how groups of pods are allowed to communicate with each other and
            with external endpoints, providing fine-grained control over network traffic within the
            cluster.
          </p>
        </VStack>

        {/* Main Content with Summary Sidebar */}
        <HStack gap={6} className="w-full items-start">
          {/* Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Basic Information" />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField label="Cluster" required>
                    <Select
                      options={CLUSTER_OPTIONS}
                      value={cluster}
                      onChange={setCluster}
                      placeholder="Select a cluster"
                      fullWidth
                    />
                  </FormField>

                  <FormField label="Namespace" required>
                    <Select
                      options={NAMESPACE_OPTIONS}
                      value={namespace}
                      onChange={setNamespace}
                      placeholder="Select a namespace"
                      fullWidth
                    />
                  </FormField>

                  <FormField label="Name" required>
                    <Input
                      placeholder="Enter a unique name"
                      value={policyName}
                      onChange={(e) => setPolicyName(e.target.value)}
                      fullWidth
                    />
                  </FormField>

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

            {/* Ingress Rules */}
            <TrafficRulesSection
              title="Ingress Rules"
              checkboxLabel="Configure ingress rules to restrict incoming traffic"
              enabled={ingressEnabled}
              onEnabledChange={setIngressEnabled}
              rules={ingressRules}
              onRulesChange={setIngressRules}
            />

            {/* Egress Rules */}
            <TrafficRulesSection
              title="Egress Rules"
              checkboxLabel="Configure egress rules to restrict outgoing traffic"
              enabled={egressEnabled}
              onEnabledChange={setEgressEnabled}
              rules={egressRules}
              onRulesChange={setEgressRules}
            />

            {/* Selector */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Selector" />
              <SectionCard.Content>
                <VStack gap={6}>
                  <span className="text-body-md text-[var(--color-text-subtle)]">
                    Selector keys and values are intended to match labels and values on existing
                    pods.
                  </span>

                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <VStack gap={1.5}>
                      {selectorRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-[17px] py-[13px] w-full"
                        >
                          <VStack gap={1.5}>
                            <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
                              <span className="text-label-sm text-[var(--color-text-default)]">
                                Key
                              </span>
                              <span className="text-label-sm text-[var(--color-text-default)]">
                                Operator
                              </span>
                              <span className="text-label-sm text-[var(--color-text-default)]">
                                Value
                              </span>
                              <button
                                onClick={() => removeSelectorRule(rule.id)}
                                className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconX size={16} className="text-[var(--color-text-muted)]" />
                              </button>
                            </div>
                            <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center">
                              <Input
                                placeholder="Input key"
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
                                placeholder="Input value"
                                value={rule.value}
                                onChange={(e) =>
                                  updateSelectorRule(rule.id, 'value', e.target.value)
                                }
                                fullWidth
                              />
                              <div className="w-5" />
                            </div>
                          </VStack>
                        </div>
                      ))}

                      <div className="w-fit">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} />}
                          onClick={addSelectorRule}
                        >
                          Add rule
                        </Button>
                      </div>
                    </VStack>
                  </div>

                  {/* Matching Pods */}
                  <VStack gap={3}>
                    <Pagination
                      currentPage={selectorPage}
                      totalPages={Math.ceil(115 / 10)}
                      totalItems={115}
                      onPageChange={setSelectorPage}
                    />
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Matching Pods
                    </label>
                    <Table
                      columns={[
                        {
                          key: 'name' as const,
                          label: 'Name',
                          sortable: true,
                          render: (value: string) => (
                            <span className="text-label-md text-[var(--color-action-primary)]">
                              {value}
                            </span>
                          ),
                        },
                        { key: 'createdAt' as const, label: 'Created At', sortable: true },
                      ]}
                      data={MOCK_MATCHING_PODS}
                      rowKey="id"
                    />
                  </VStack>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Labels & Annotations */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Labels & Annotations" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Labels */}
                  <VStack gap={3}>
                    <label className="text-label-lg text-[var(--color-text-default)]">Labels</label>

                    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                      <VStack gap={1.5}>
                        {labels.length > 0 && (
                          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
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
                              <IconX size={14} className="text-[var(--color-text-muted)]" />
                            </button>
                          </div>
                        ))}
                        <div className="w-fit">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconCirclePlus size={12} />}
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
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Annotations
                    </label>

                    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 w-full">
                      <VStack gap={1.5}>
                        {annotations.length > 0 && (
                          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
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
                              <IconX size={14} className="text-[var(--color-text-muted)]" />
                            </button>
                          </div>
                        ))}
                        <div className="w-fit">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconCirclePlus size={12} />}
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
            sectionStates={getSectionStates()}
            onCreate={handleCreate}
            createDisabled={!policyName.trim()}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default SecurityCreateNetworkPolicyPage;
