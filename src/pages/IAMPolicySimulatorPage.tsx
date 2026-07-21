import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Badge,
  Input,
  VStack,
  HStack,
  TopBar,
  Breadcrumb,
  TabBar,
  PageShell,
  PageHeader,
  SectionCard,
  Table,
  Pagination,
  SearchInput,
  Radio,
  InlineMessage,
  ChainedSelect,
  SelectionIndicator,
  Disclosure,
  type ChainedSelectSegment,
  type TableColumn,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconCirclePlus, IconX, IconExternalLink } from '@tabler/icons-react';

/* ─── Types ───────────────────────────────────────────────────────── */

interface Policy {
  id: string;
  name: string;
  description: string;
  apps: string;
  type: 'Built-in' | 'Custom';
  editedAt: string;
}

interface SimulationCondition {
  id: string;
  application: string;
  partition: string;
  resource: string;
  resourceId: string;
}

interface EvalAction {
  name: string;
  decision: 'Allow' | 'Deny' | 'Implicit Deny';
  matchedRule: string;
}

interface EvalCondition {
  label: string;
  target: string;
  actions: EvalAction[];
}

/* ─── Mock Data ───────────────────────────────────────────────────── */

const MOCK_POLICIES: Policy[] = Array.from({ length: 25 }, (_, i) => ({
  id: `pol-${i + 1}`,
  name: `policy-${i + 1}`,
  description: '-',
  apps: 'compute (+3)',
  type: 'Built-in' as const,
  editedAt: 'Mar 13, 26',
}));

const MOCK_EVAL_RESULTS: EvalCondition[] = [
  {
    label: 'Condition 1',
    target: 'compute:kr1:instance/*',
    actions: [
      { name: 'compute.instance.read', decision: 'Allow', matchedRule: 'ReadOnlyEC2 #1 · Allow' },
      { name: 'compute.instance.list', decision: 'Allow', matchedRule: 'ReadOnlyEC2 #1 · Allow' },
      {
        name: 'compute.instance.console',
        decision: 'Allow',
        matchedRule: 'ReadOnlyEC2 #1 · Allow',
      },
      { name: 'compute.instance.delete', decision: 'Deny', matchedRule: 'DenyDelete #2 · Deny' },
      {
        name: 'compute.instance.update',
        decision: 'Implicit Deny',
        matchedRule: 'No matching rule',
      },
    ],
  },
  {
    label: 'Condition 2',
    target: 'storage:kr1:volume/*',
    actions: [
      { name: 'storage.volume.read', decision: 'Allow', matchedRule: 'StorageAccess #1 · Allow' },
      { name: 'storage.volume.list', decision: 'Allow', matchedRule: 'StorageAccess #1 · Allow' },
      { name: 'storage.volume.create', decision: 'Allow', matchedRule: 'StorageAccess #1 · Allow' },
      { name: 'storage.volume.delete', decision: 'Allow', matchedRule: 'StorageAccess #1 · Allow' },
      { name: 'storage.volume.update', decision: 'Allow', matchedRule: 'StorageAccess #1 · Allow' },
    ],
  },
];

const targetSegments: ChainedSelectSegment[] = [
  {
    key: 'application',
    label: 'App',
    options: [
      { value: '*all', label: '*all' },
      { value: 'compute', label: 'compute' },
      { value: 'container', label: 'container' },
      { value: 'storage', label: 'storage' },
      { value: 'network', label: 'network' },
    ],
  },
  {
    key: 'partition',
    label: 'Partition',
    options: [{ value: '*all', label: '*all' }],
  },
  {
    key: 'resource',
    label: 'Resource type',
    options: [{ value: '*all', label: '*all' }],
  },
  {
    key: 'resourceId',
    label: 'Resource ID',
    options: [{ value: '*all', label: '*all' }],
  },
];

/* ─── Component ───────────────────────────────────────────────────── */

export default function IAMPolicySimulatorPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Policy simulator' }];

  // Section 1: Principal and Policies
  const [simulatorMode, setSimulatorMode] = useState<'verification' | 'principal'>('verification');
  const [principalSearch, setPrincipalSearch] = useState('');
  const [policySearch, setPolicySearch] = useState('');
  const [policyPage, setPolicyPage] = useState(1);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const policiesPerPage = 5;

  const filteredPolicies = MOCK_POLICIES.filter((p) =>
    p.name.toLowerCase().includes(policySearch.toLowerCase())
  );
  const totalPolicyPages = Math.ceil(filteredPolicies.length / policiesPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (policyPage - 1) * policiesPerPage,
    policyPage * policiesPerPage
  );

  // Section 2: Simulation conditions
  const createEmptyCondition = (): SimulationCondition => ({
    id: crypto.randomUUID(),
    application: '',
    partition: '',
    resource: '',
    resourceId: '',
  });

  const [conditions, setConditions] = useState<SimulationCondition[]>([createEmptyCondition()]);

  // Section 3: Results (state declared early so updateCondition can reference hasRun)
  const [hasRun, setHasRun] = useState(true);
  const [inputsChanged, setInputsChanged] = useState(false);
  const updateCondition = useCallback(
    (id: string, updates: Partial<SimulationCondition>) => {
      setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      if (hasRun) setInputsChanged(true);
    },
    [hasRun]
  );

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addCondition = useCallback(() => {
    setConditions((prev) => [...prev, createEmptyCondition()]);
  }, []);

  const hasAllTargetFields = (c: SimulationCondition) =>
    c.application !== '' && c.partition !== '' && c.resource !== '' && c.resourceId !== '';

  const evalResults = hasRun ? MOCK_EVAL_RESULTS : [];
  const totalActions = evalResults.reduce((sum, c) => sum + c.actions.length, 0);
  const allowedCount = evalResults.reduce(
    (sum, c) => sum + c.actions.filter((a) => a.decision === 'Allow').length,
    0
  );
  const deniedCount = evalResults.reduce(
    (sum, c) =>
      sum + c.actions.filter((a) => a.decision === 'Deny' || a.decision === 'Implicit Deny').length,
    0
  );

  const handleRunSimulation = () => {
    setHasRun(true);
    setInputsChanged(false);
  };

  const handleClearResults = () => {
    setHasRun(false);
    setInputsChanged(false);
  };

  const handleResetPrincipal = () => {
    setSimulatorMode('verification');
    setPrincipalSearch('');
    setPolicySearch('');
    setPolicyPage(1);
    setSelectedPolicies([]);
  };

  const handleResetConditions = () => {
    setConditions([createEmptyCondition()]);
  };

  // Table columns
  const policyColumns: TableColumn<Policy>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_value, row) => (
        <HStack gap={1.5} align="center">
          <span className="text-label-md text-[var(--color-action-primary)]">{row.name}</span>
          <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
        </HStack>
      ),
    },
    { key: 'description', label: 'Description' },
    { key: 'apps', label: 'Apps' },
    { key: 'type', label: 'Type' },
    { key: 'editedAt', label: 'Edited at', sortable: true },
  ];

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={4}>
        <PageHeader title="Policy simulator" />

        {/* Section 1: Principal and Policies */}
        <SectionCard>
          <SectionCard.Header
            title="Principal and Policies"
            actions={
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconRefresh size={12} />}
                onClick={handleResetPrincipal}
              >
                Reset inputs
              </Button>
            }
          />
          <SectionCard.Content>
            <VStack gap={6}>
              {/* Simulator mode */}
              <div className="flex flex-col gap-2 w-full">
                <span className="text-label-lg text-[var(--color-text-default)]">
                  Simulator mode
                  <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>
                <Radio
                  value="verification"
                  label="Policy verification"
                  checked={simulatorMode === 'verification'}
                  onChange={() => setSimulatorMode('verification')}
                />
                <Radio
                  value="principal"
                  label="Principal permission check"
                  checked={simulatorMode === 'principal'}
                  onChange={() => setSimulatorMode('principal')}
                />
              </div>

              {/* Principal (only for Principal permission check mode) */}
              {simulatorMode === 'principal' && (
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    Principal
                    <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                  </span>
                  <Input
                    value={principalSearch}
                    onChange={(e) => setPrincipalSearch(e.target.value)}
                    placeholder="Search principal"
                    fullWidth
                  />
                </div>
              )}

              {/* Policies table */}
              <div className="flex flex-col gap-4 w-full">
                <span className="text-label-lg text-[var(--color-text-default)]">
                  Policies
                  <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                </span>

                <VStack gap={3} className="w-full">
                  <SearchInput
                    value={policySearch}
                    onChange={setPolicySearch}
                    placeholder="Search policies by attributes"
                    size="sm"
                    className="w-[280px]"
                  />

                  <Pagination
                    currentPage={policyPage}
                    totalPages={totalPolicyPages}
                    onPageChange={setPolicyPage}
                    totalItems={filteredPolicies.length}
                    selectedCount={selectedPolicies.length}
                  />

                  <Table<Policy>
                    columns={policyColumns}
                    data={paginatedPolicies}
                    rowKey="id"
                    selectable
                    selectedKeys={selectedPolicies}
                    onSelectionChange={setSelectedPolicies}
                    emptyMessage="No policies found"
                  />

                  <SelectionIndicator
                    selectedItems={selectedPolicies.map((id) => {
                      const policy = MOCK_POLICIES.find((p) => p.id === id);
                      return { id, label: policy?.name ?? id };
                    })}
                    onRemove={(id) => setSelectedPolicies((prev) => prev.filter((k) => k !== id))}
                    emptyText="No items selected"
                  />
                </VStack>
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {/* Section 2: Simulation conditions */}
        <SectionCard>
          <SectionCard.Header
            title="Simulation conditions"
            description="Each condition defines a target resource and actions to simulate. Specify the target TRN, then select the actions to test. At least one condition is required."
            actions={
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconRefresh size={12} />}
                onClick={handleResetConditions}
              >
                Reset inputs
              </Button>
            }
          />
          <SectionCard.Content>
            <VStack gap={4} className="w-full">
              <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                <VStack gap={2} className="w-full">
                  {conditions.map((condition, index) => (
                    <div
                      key={condition.id}
                      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                    >
                      <VStack gap={6}>
                        <HStack align="center" className="w-full">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Condition {index + 1}
                          </span>
                          {index > 0 && (
                            <button
                              onClick={() => removeCondition(condition.id)}
                              className="ml-auto flex items-center justify-center text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                            >
                              <IconX size={14} />
                            </button>
                          )}
                        </HStack>

                        {/* Target */}
                        <div className="flex flex-col gap-2 w-full">
                          <span className="text-label-sm text-[var(--color-text-default)]">
                            Target
                            <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                          </span>
                          <ChainedSelect
                            segments={targetSegments}
                            values={{
                              application: condition.application,
                              partition: condition.partition,
                              resource: condition.resource,
                              resourceId: condition.resourceId,
                            }}
                            onChange={(updatedValues) =>
                              updateCondition(condition.id, {
                                application: updatedValues.application ?? '',
                                partition: updatedValues.partition ?? '',
                                resource: updatedValues.resource ?? '',
                                resourceId: updatedValues.resourceId ?? '',
                              })
                            }
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 w-full">
                          <span className="text-label-sm text-[var(--color-text-default)]">
                            Actions
                            <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                          </span>
                          {!hasAllTargetFields(condition) ? (
                            <InlineMessage variant="info">
                              Complete the target fields above to browse available actions.
                            </InlineMessage>
                          ) : (
                            <InlineMessage variant="info">
                              Actions available for selected target.
                            </InlineMessage>
                          )}
                        </div>
                      </VStack>
                    </div>
                  ))}

                  <div className="w-fit">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconCirclePlus size={12} />}
                      onClick={addCondition}
                    >
                      Add condition
                    </Button>
                  </div>
                </VStack>
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {/* Section 3: Results */}
        <SectionCard>
          <SectionCard.Header
            title="Results"
            actions={
              <HStack gap={2}>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleClearResults}
                  disabled={!hasRun}
                >
                  Clear results
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRunSimulation}
                  disabled={selectedPolicies.length === 0}
                >
                  Run simulation
                </Button>
              </HStack>
            }
          />
          {hasRun && (
            <SectionCard.Content>
              <VStack gap={6} className="w-full">
                {inputsChanged && (
                  <InlineMessage variant="warning">
                    Inputs changed. The results below reflect the last run and may not match the
                    current form. Run evaluation again when you are ready.
                  </InlineMessage>
                )}

                {/* Summary */}
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-label-lg text-[var(--color-text-default)]">Summary</span>
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 flex flex-col p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)]">
                      <span className="text-[20px] font-medium text-[var(--color-text-default)] leading-normal pb-1">
                        {totalActions}
                      </span>
                      <span className="text-body-sm text-[var(--color-text-muted)]">
                        Selected actions
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col p-4 rounded-[var(--radius-lg)] bg-[var(--color-state-success-bg)]">
                      <span className="text-[20px] font-medium text-[var(--color-text-default)] leading-normal pb-1">
                        {allowedCount}
                      </span>
                      <span className="text-body-sm text-[var(--color-state-success)]">
                        Allowed actions
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col p-4 rounded-[var(--radius-lg)] bg-[var(--color-state-danger-bg)]">
                      <span className="text-[20px] font-medium text-[var(--color-text-default)] leading-normal pb-1">
                        {deniedCount}
                      </span>
                      <span className="text-body-sm text-[var(--color-state-danger)]">
                        Denied actions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evaluation details */}
                <span className="text-label-lg text-[var(--color-text-default)]">
                  Evaluation details
                </span>

                <VStack gap={2} className="w-full">
                  {evalResults.map((cond, condIdx) => {
                    const condAllowed = cond.actions.filter((a) => a.decision === 'Allow').length;
                    const condDenied = cond.actions.filter((a) => a.decision === 'Deny').length;
                    const summaryParts: string[] = [];
                    if (condAllowed > 0) summaryParts.push(`${condAllowed} allowed`);
                    if (condDenied > 0) summaryParts.push(`${condDenied} denied`);
                    const summaryText =
                      summaryParts.join(' · ') || `${cond.actions.length} actions`;

                    const actionColumns: TableColumn<EvalAction>[] = [
                      {
                        key: 'name',
                        label: 'Simulated action',
                      },
                      {
                        key: 'decision',
                        label: 'Decision',
                        width: '280px',
                        render: (_value, row) => {
                          const variant =
                            row.decision === 'Allow'
                              ? ('success' as const)
                              : row.decision === 'Deny'
                                ? ('error' as const)
                                : ('warning' as const);
                          return (
                            <VStack gap={0.5} align="start">
                              <Badge variant={variant} size="sm">
                                {row.decision}
                              </Badge>
                              <span className="text-body-sm text-[var(--color-text-subtle)]">
                                {row.matchedRule}
                              </span>
                            </VStack>
                          );
                        },
                      },
                    ];

                    return (
                      <Disclosure
                        key={condIdx}
                        defaultOpen={condIdx === 0}
                        className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden w-full"
                      >
                        <Disclosure.Trigger className="flex items-center gap-2 w-full px-4 py-3 bg-[var(--color-surface-subtle)]">
                          <span className="text-label-md text-[var(--color-text-default)]">
                            {cond.label}
                          </span>
                          <span className="text-body-md text-[var(--color-text-disabled)]">—</span>
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            {cond.target}
                          </span>
                          <Badge theme="white" size="sm">
                            {summaryText}
                          </Badge>
                        </Disclosure.Trigger>
                        <Disclosure.Panel className="p-4">
                          <Table<EvalAction>
                            columns={actionColumns}
                            data={cond.actions}
                            rowKey="name"
                            resizable={false}
                          />
                        </Disclosure.Panel>
                      </Disclosure>
                    );
                  })}
                </VStack>
              </VStack>
            </SectionCard.Content>
          )}
        </SectionCard>
      </VStack>
    </PageShell>
  );
}
