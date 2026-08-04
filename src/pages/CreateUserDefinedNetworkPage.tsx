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
  Radio,
  RadioGroup,
  SectionCard,
  InlineMessage,
  WizardSummary,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import type { UdnScope, UdnRole, UdnTopology } from './containerUserDefinedNetworksData';

/* ----------------------------------------
   UserDefinedNetwork 생성 폼.

   화면에서 반드시 드러내야 하는 제약이 둘 있다.
   ① Primary는 그 네임스페이스의 기본 네트워크를 대체하므로, 파드가 하나라도
      생기기 전에 만들어야 한다. 나중에 붙일 수 없다.
   ② Layer2에서는 노드끼리 잇는 join subnet이 따로 필요하다.

   ⚠ CNI 종속 — OVN-Kubernetes에서만 동작한다.
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'topology' | 'addressing';

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  topology: 'Topology',
  addressing: 'Addressing',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'topology', 'addressing'];

/* 목업 — 실제로는 파드가 없는 네임스페이스만 Primary 후보로 남아야 한다. */
const NAMESPACE_OPTIONS = [
  { value: 'tenant-a', label: 'tenant-a' },
  { value: 'tenant-b', label: 'tenant-b' },
  { value: 'tenant-c', label: 'tenant-c (no pods yet)' },
  { value: 'metis-vm', label: 'metis-vm' },
];

/** 이미 워크로드가 돌고 있어 Primary를 새로 붙일 수 없는 네임스페이스 (목업) */
const NAMESPACES_WITH_PODS = ['tenant-a', 'tenant-b', 'metis-vm'];

/* ----------------------------------------
   Summary Sidebar
   ---------------------------------------- */

function SummarySidebar({
  name,
  subnets,
  onCancel,
  onCreate,
  isCreateDisabled,
}: {
  name: string;
  subnets: string;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}) {
  const getSectionStatus = (section: SectionStep): 'done' | 'active' | 'pending' => {
    if (section === 'basic-info') return name.trim() ? 'done' : 'active';
    if (section === 'topology') return name.trim() ? 'done' : 'pending';
    if (section === 'addressing') return subnets.trim() ? 'done' : 'pending';
    return 'pending';
  };

  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => {
    const s = getSectionStatus(key);
    return {
      key,
      label: SECTION_LABELS[key],
      status: (s === 'pending' ? 'pre' : s) as WizardSectionState,
    };
  });

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-6">
        <WizardSummary items={summaryItems} />
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCreate}
            disabled={isCreateDisabled}
            className="flex-1"
          >
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page
   ---------------------------------------- */

export function CreateUserDefinedNetworkPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [scope, setScope] = useState<UdnScope>('Namespace');
  const [namespace, setNamespace] = useState('tenant-c');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [role, setRole] = useState<UdnRole>('Primary');
  const [topology, setTopology] = useState<UdnTopology>('Layer3');
  const [mtu, setMtu] = useState('1400');
  const [subnets, setSubnets] = useState('');
  const [joinSubnets, setJoinSubnets] = useState('');

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Create network');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 248 : 48;

  const handleCancel = useCallback(() => {
    navigate('/container/user-defined-networks');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    console.log('Creating UserDefinedNetwork', {
      scope,
      namespace,
      name,
      role,
      topology,
      mtu,
      subnets,
      joinSubnets,
    });
    navigate('/container/user-defined-networks');
  }, [scope, namespace, name, role, topology, mtu, subnets, joinSubnets, navigate]);

  // Primary는 파드가 이미 도는 네임스페이스에 붙일 수 없다.
  const primaryBlocked =
    scope === 'Namespace' && role === 'Primary' && NAMESPACES_WITH_PODS.includes(namespace);

  const isCreateDisabled = !name.trim() || !subnets.trim() || primaryBlocked;

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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'User Defined Networks', href: '/container/user-defined-networks' },
                { label: 'Create Network' },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        <VStack gap={1}>
          <div className="flex items-center justify-between h-8">
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create network</h1>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            A user defined network gives a namespace its own address range, separated from the
            default pod network by design rather than by policy rules.
          </p>
        </VStack>

        <HStack gap={6} align="start" className="w-full">
          <VStack gap={4} className="flex-1">
            <SectionCard className="pb-4">
              <SectionCard.Header title="Basic information" showDivider />
              <SectionCard.Content>
                <VStack gap={6}>
                  <RadioGroup
                    label="Scope"
                    value={scope}
                    onChange={(value) => setScope(value as UdnScope)}
                  >
                    <VStack gap={2}>
                      <Radio value="Namespace" label="Namespace — belongs to a single namespace" />
                      <Radio
                        value="Cluster"
                        label="Cluster — shared across namespaces (ClusterUserDefinedNetwork)"
                      />
                    </VStack>
                  </RadioGroup>

                  {scope === 'Namespace' && (
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
                  )}

                  <FormField required error={!!nameError}>
                    <FormField.Label>Name</FormField.Label>
                    <FormField.Control>
                      <Input
                        placeholder="Enter a unique name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (nameError) setNameError(null);
                        }}
                        fullWidth
                      />
                    </FormField.Control>
                    <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            <SectionCard className="pb-4">
              <SectionCard.Header
                title="Topology"
                description="How the network is laid out across nodes."
                showDivider
              />
              <SectionCard.Content>
                <VStack gap={6}>
                  <RadioGroup
                    label="Role"
                    value={role}
                    onChange={(value) => setRole(value as UdnRole)}
                  >
                    <VStack gap={2}>
                      <Radio
                        value="Primary"
                        label="Primary — replaces the default pod network of the namespace"
                      />
                      <Radio
                        value="Secondary"
                        label="Secondary — added as an extra interface alongside the default network"
                      />
                    </VStack>
                  </RadioGroup>

                  {/* 나중에 붙일 수 없다는 제약을 고르는 순간 알려준다. */}
                  {primaryBlocked && (
                    <InlineMessage variant="warning">
                      <span className="font-mono">{namespace}</span> already runs workloads, so a
                      primary network cannot be added to it. A primary network must exist before the
                      first pod is created. Pick an empty namespace, or choose Secondary instead.
                    </InlineMessage>
                  )}

                  <RadioGroup
                    label="Type"
                    value={topology}
                    onChange={(value) => setTopology(value as UdnTopology)}
                  >
                    <VStack gap={2}>
                      <Radio
                        value="Layer3"
                        label="Layer3 — each node gets its own slice of the subnet, traffic is routed"
                      />
                      <Radio
                        value="Layer2"
                        label="Layer2 — one flat network; a VM keeps its IP when it moves to another node"
                      />
                    </VStack>
                  </RadioGroup>

                  <FormField>
                    <FormField.Label>MTU</FormField.Label>
                    <FormField.Control>
                      <Input
                        placeholder="1400"
                        value={mtu}
                        onChange={(e) => setMtu(e.target.value)}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            <SectionCard className="pb-4">
              <SectionCard.Header
                title="Addressing"
                description="The address range this network hands out."
                showDivider
              />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField required>
                    <FormField.Label>Subnets</FormField.Label>
                    <FormField.Control>
                      <Input
                        placeholder="e.g. 10.20.0.0/16"
                        value={subnets}
                        onChange={(e) => setSubnets(e.target.value)}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>

                  {/* Layer2에서만 필요한 값이라 그때만 보여준다. */}
                  {topology === 'Layer2' && (
                    <FormField>
                      <FormField.Label>Join subnets</FormField.Label>
                      <FormField.Control>
                        <Input
                          placeholder="e.g. 100.65.0.0/16"
                          value={joinSubnets}
                          onChange={(e) => setJoinSubnets(e.target.value)}
                          fullWidth
                        />
                      </FormField.Control>
                    </FormField>
                  )}

                  <InlineMessage variant="info">
                    The subnet must not overlap with the cluster's default pod network or with
                    another user defined network. Overlapping ranges make the network fail to come
                    up.
                  </InlineMessage>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </VStack>

          <SummarySidebar
            name={name}
            subnets={subnets}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateUserDefinedNetworkPage;
