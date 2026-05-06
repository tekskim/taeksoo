import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Select,
  Input,
  Badge,
  VStack,
  HStack,
  TopBar,
  Breadcrumb,
  TabBar,
  PageShell,
  PageHeader,
  SectionCard,
  FormField,
  Table,
  type TableColumn,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconPlayerPlay, IconPlus, IconX } from '@tabler/icons-react';

interface SimulationResult {
  id: string;
  action: string;
  resource: string;
  decision: 'Allow' | 'Deny' | 'Implicit deny';
  matchedPolicy: string;
}

const serviceOptions = [
  { value: 'iam', label: 'IAM' },
  { value: 'compute', label: 'Compute' },
  { value: 'storage', label: 'Storage' },
  { value: 'container', label: 'Container' },
  { value: 'network', label: 'Network' },
];

const principalOptions = [
  { value: 'user:john.doe', label: 'User: john.doe' },
  { value: 'user:jane.smith', label: 'User: jane.smith' },
  { value: 'user:admin', label: 'User: admin' },
  { value: 'group:developers', label: 'Group: developers' },
  { value: 'group:admins', label: 'Group: admins' },
  { value: 'role:admin-role', label: 'Role: admin-role' },
  { value: 'role:viewer-role', label: 'Role: viewer-role' },
  { value: 'sa:ci-bot', label: 'Service account: ci-bot' },
];

const mockResults: SimulationResult[] = [
  {
    id: 'r-001',
    action: 'iam:CreateUser',
    resource: '*',
    decision: 'Allow',
    matchedPolicy: 'AdminFullAccess',
  },
  {
    id: 'r-002',
    action: 'compute:DeleteInstance',
    resource: 'instance-*',
    decision: 'Deny',
    matchedPolicy: 'DenyDeleteResources',
  },
  {
    id: 'r-003',
    action: 'storage:CreateVolume',
    resource: '*',
    decision: 'Allow',
    matchedPolicy: 'StorageFullAccess',
  },
  {
    id: 'r-004',
    action: 'iam:DeleteRole',
    resource: '*',
    decision: 'Implicit deny',
    matchedPolicy: '-',
  },
  {
    id: 'r-005',
    action: 'compute:StartInstance',
    resource: 'instance-prod-*',
    decision: 'Allow',
    matchedPolicy: 'ComputeOperator',
  },
];

const decisionVariant = (decision: string) => {
  switch (decision) {
    case 'Allow':
      return 'success' as const;
    case 'Deny':
      return 'danger' as const;
    default:
      return 'warning' as const;
  }
};

export default function IAMPolicySimulatorPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [principal, setPrincipal] = useState('');
  const [actions, setActions] = useState([{ id: crypto.randomUUID(), service: '', action: '' }]);
  const [resource, setResource] = useState('*');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Policy simulator' }];

  const addAction = () => {
    setActions((prev) => [...prev, { id: crypto.randomUUID(), service: '', action: '' }]);
  };

  const removeAction = (id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAction = (id: string, field: 'service' | 'action', value: string) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const handleSimulate = () => {
    setResults(mockResults);
    setHasRun(true);
  };

  const resultColumns: TableColumn<SimulationResult>[] = [
    {
      key: 'action',
      title: 'Action',
      sortable: true,
      minWidth: '200px',
      render: (row) => (
        <span className="text-body-md font-medium text-[var(--color-text-default)]">
          {row.action}
        </span>
      ),
    },
    {
      key: 'resource',
      title: 'Resource',
      minWidth: '160px',
    },
    {
      key: 'decision',
      title: 'Decision',
      sortable: true,
      minWidth: '120px',
      render: (row) => <Badge variant={decisionVariant(row.decision)}>{row.decision}</Badge>,
    },
    {
      key: 'matchedPolicy',
      title: 'Matched policy',
      minWidth: '180px',
    },
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
        <PageHeader
          title="Policy simulator"
          actions={
            <Button
              variant="primary"
              size="md"
              leftIcon={<IconPlayerPlay size={12} />}
              onClick={handleSimulate}
              disabled={!principal}
            >
              Run simulation
            </Button>
          }
        />

        <SectionCard>
          <SectionCard.Header title="Simulation parameters" />
          <SectionCard.Content>
            <VStack gap={6}>
              <FormField
                label="Principal"
                required
                helperText="Select the user, group, role, or service account to simulate."
              >
                <Select
                  options={principalOptions}
                  value={principal}
                  onChange={(val) => setPrincipal(val)}
                  placeholder="Select principal"
                  fullWidth
                />
              </FormField>

              <FormField
                label="Actions"
                required
                helperText="Specify one or more actions to simulate."
              >
                <VStack gap={2} className="w-full">
                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <div className="grid grid-cols-[1fr_1fr_20px] gap-2 items-center">
                      <span className="text-label-sm text-[var(--color-text-subtle)]">Service</span>
                      <span className="text-label-sm text-[var(--color-text-subtle)]">Action</span>
                      <div />
                      {actions.map((a) => (
                        <>
                          <Select
                            key={`${a.id}-svc`}
                            options={serviceOptions}
                            value={a.service}
                            onChange={(val) => updateAction(a.id, 'service', val)}
                            placeholder="Service"
                            fullWidth
                          />
                          <Input
                            key={`${a.id}-act`}
                            value={a.action}
                            onChange={(e) => updateAction(a.id, 'action', e.target.value)}
                            placeholder="e.g. CreateUser"
                            fullWidth
                          />
                          <button
                            onClick={() => removeAction(a.id)}
                            className="flex items-center justify-center text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                            disabled={actions.length <= 1}
                          >
                            <IconX size={14} />
                          </button>
                        </>
                      ))}
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconPlus size={12} />}
                        onClick={addAction}
                      >
                        Add action
                      </Button>
                    </div>
                  </div>
                </VStack>
              </FormField>

              <FormField
                label="Resource"
                helperText="Specify the resource ARN or use * for all resources."
              >
                <Input
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  placeholder="* (all resources)"
                  fullWidth
                />
              </FormField>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {hasRun && (
          <SectionCard>
            <SectionCard.Header
              title="Simulation results"
              actions={
                <HStack gap={2} align="center">
                  <Badge variant="success" size="sm">
                    {results.filter((r) => r.decision === 'Allow').length} Allowed
                  </Badge>
                  <Badge variant="danger" size="sm">
                    {results.filter((r) => r.decision === 'Deny').length} Denied
                  </Badge>
                  <Badge variant="warning" size="sm">
                    {results.filter((r) => r.decision === 'Implicit deny').length} Implicit deny
                  </Badge>
                </HStack>
              }
            />
            <SectionCard.Content>
              <Table<SimulationResult>
                columns={resultColumns}
                data={results}
                rowKey="id"
                emptyMessage="No results yet. Run a simulation to see results."
              />
            </SectionCard.Content>
          </SectionCard>
        )}
      </VStack>
    </PageShell>
  );
}
