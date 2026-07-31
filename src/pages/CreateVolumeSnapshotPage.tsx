import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  InlineMessage,
  WizardSummary,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   VolumeSnapshot 생성 폼.

   스냅샷은 PVC에서 파생된 리소스라 **원본 PVC를 먼저 고르는 것**이 핵심이다.
   그래서 이름보다 Source가 먼저 나온다.

   snapshotClass는 스토리지 드라이버(CSI)가 제공하는 것만 고를 수 있다.
   온프렘 스토리지 계열은 Ceph로 확인됐다(규약 [ACONT-67]).
   ---------------------------------------- */

type SectionStep = 'source' | 'basic-info' | 'snapshot-class';

const SECTION_LABELS: Record<SectionStep, string> = {
  source: 'Source',
  'basic-info': 'Basic information',
  'snapshot-class': 'Snapshot class',
};

const SECTION_ORDER: SectionStep[] = ['source', 'basic-info', 'snapshot-class'];

/* 목업 — 실제로는 선택한 네임스페이스의 PVC 목록을 읽어온다. */
const NAMESPACE_OPTIONS = [
  { value: 'database', label: 'database' },
  { value: 'devtools', label: 'devtools' },
  { value: 'metis-training', label: 'metis-training' },
  { value: 'maxis', label: 'maxis' },
];

const PVC_BY_NAMESPACE: Record<string, { name: string; size: string }[]> = {
  database: [
    { name: 'postgres-data', size: '100Gi' },
    { name: 'postgres-wal', size: '20Gi' },
  ],
  devtools: [
    { name: 'gitea-repos', size: '50Gi' },
    { name: 'valkey-data', size: '10Gi' },
  ],
  'metis-training': [{ name: 'training-checkpoints', size: '2Ti' }],
  maxis: [{ name: 'model-registry', size: '500Gi' }],
};

const SNAPSHOT_CLASS_OPTIONS = [
  { value: 'ceph-rbd-snapclass', label: 'ceph-rbd-snapclass (block)' },
  { value: 'cephfs-snapclass', label: 'cephfs-snapclass (file)' },
];

/* ----------------------------------------
   Summary Sidebar
   ---------------------------------------- */

function SummarySidebar({
  name,
  sourcePvc,
  snapshotClass,
  onCancel,
  onCreate,
  isCreateDisabled,
}: {
  name: string;
  sourcePvc: string;
  snapshotClass: string;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}) {
  const getSectionStatus = (section: SectionStep): 'done' | 'active' | 'pending' => {
    if (section === 'source') return sourcePvc ? 'done' : 'active';
    if (section === 'basic-info') return name.trim() ? 'done' : sourcePvc ? 'active' : 'pending';
    if (section === 'snapshot-class') return snapshotClass ? 'done' : 'pending';
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

export function CreateVolumeSnapshotPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [namespace, setNamespace] = useState(searchParams.get('namespace') || 'database');
  const [sourcePvc, setSourcePvc] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [snapshotClass, setSnapshotClass] = useState('ceph-rbd-snapclass');

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Create volume snapshot');
  }, [updateActiveTabLabel]);

  const pvcOptions = useMemo(
    () =>
      (PVC_BY_NAMESPACE[namespace] ?? []).map((pvc) => ({
        value: pvc.name,
        label: `${pvc.name} (${pvc.size})`,
      })),
    [namespace]
  );

  // 네임스페이스를 바꾸면 이전 PVC 선택은 더 이상 유효하지 않다.
  const handleNamespaceChange = useCallback((value: string) => {
    setNamespace(value);
    setSourcePvc('');
  }, []);

  const selectedPvc = (PVC_BY_NAMESPACE[namespace] ?? []).find((p) => p.name === sourcePvc);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 248 : 48;

  const handleCancel = useCallback(() => {
    navigate('/container/volume-snapshots');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    console.log('Creating VolumeSnapshot', { namespace, name, sourcePvc, snapshotClass });
    navigate('/container/volume-snapshots');
  }, [namespace, name, sourcePvc, snapshotClass, navigate]);

  const isCreateDisabled = !name.trim() || !sourcePvc || !snapshotClass;

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
                { label: 'Volume Snapshots', href: '/container/volume-snapshots' },
                { label: 'Create Volume Snapshot' },
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
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">
              Create volume snapshot
            </h1>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            A snapshot stores the contents of a volume at a point in time. It is taken from an
            existing PersistentVolumeClaim and can later be restored into a new one.
          </p>
        </VStack>

        <HStack gap={6} align="start" className="w-full">
          <VStack gap={4} className="flex-1">
            {/* 원본을 먼저 고른다 — 스냅샷은 PVC에서 파생되는 리소스다. */}
            <SectionCard className="pb-4">
              <SectionCard.Header
                title="Source"
                description="Choose the volume you want to capture."
                showDivider
              />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField required>
                    <FormField.Label>Namespace</FormField.Label>
                    <FormField.Control>
                      <Select
                        options={NAMESPACE_OPTIONS}
                        value={namespace}
                        onChange={handleNamespaceChange}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>

                  <FormField required>
                    <FormField.Label>Source PersistentVolumeClaim</FormField.Label>
                    <FormField.Control>
                      <Select
                        options={pvcOptions}
                        value={sourcePvc}
                        onChange={setSourcePvc}
                        placeholder="Select a volume claim"
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>

                  {selectedPvc && (
                    <InlineMessage variant="info">
                      The snapshot will be about <strong>{selectedPvc.size}</strong>. Taking it does
                      not interrupt workloads using{' '}
                      <span className="font-mono">{selectedPvc.name}</span>.
                    </InlineMessage>
                  )}
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            <SectionCard className="pb-4">
              <SectionCard.Header title="Basic information" showDivider />
              <SectionCard.Content>
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
              </SectionCard.Content>
            </SectionCard>

            <SectionCard className="pb-4">
              <SectionCard.Header
                title="Snapshot class"
                description="Defines how the snapshot is taken by the storage driver."
                showDivider
              />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField required>
                    <FormField.Label>VolumeSnapshotClass</FormField.Label>
                    <FormField.Control>
                      <Select
                        options={SNAPSHOT_CLASS_OPTIONS}
                        value={snapshotClass}
                        onChange={setSnapshotClass}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>

                  {/* 스냅샷은 원본과 같은 스토리지 안에 남는 사본이다.
                      외부로 빼두는 백업과 혼동하기 쉬워 화면에서 구분해준다. */}
                  <InlineMessage variant="warning">
                    A snapshot lives in the same storage system as the source volume. It protects
                    against accidental changes, not against the storage system itself failing.
                  </InlineMessage>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </VStack>

          <SummarySidebar
            name={name}
            sourcePvc={sourcePvc}
            snapshotClass={snapshotClass}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateVolumeSnapshotPage;
