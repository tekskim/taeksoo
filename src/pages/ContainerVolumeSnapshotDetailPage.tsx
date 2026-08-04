import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  ContextMenu,
  DetailHeader,
  Badge,
  Tooltip,
  PageShell,
  ErrorState,
  InlineMessage,
  type ContextMenuItem,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { IconAlertTriangle, IconChevronDown } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { findSnapshotById, type ContainerVolumeSnapshotRow } from './containerVolumeSnapshotsData';

/* ----------------------------------------
   Kubernetes VolumeSnapshot 상세.

   스냅샷은 PVC에서 파생된 리소스라, 원본 볼륨이 먼저 있어야 한다.
   복원은 원본을 덮어쓰는 것이 아니라 **새 PVC를 만드는** 방식이다.
   ---------------------------------------- */

function snapshotYaml(s: ContainerVolumeSnapshotRow): string {
  return `apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: ${s.name}
  namespace: ${s.namespace}
spec:
  volumeSnapshotClassName: ${s.snapshotClass}
  source:
    persistentVolumeClaimName: ${s.sourcePvc}
status:
  readyToUse: ${s.readyToUse}
  restoreSize: ${s.restoreSize}
  boundVolumeSnapshotContentName: snapcontent-${s.id}`;
}

export function ContainerVolumeSnapshotDetailPage() {
  const { snapshotId } = useParams<{ snapshotId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    tabs,
    activeTabId,
    selectTab,
    closeTab,
    addNewTab,
    moveTab,
    addTab,
    updateActiveTabLabel,
  } = useTabs();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const shellPanel = useShellPanel();
  const snapshot = findSnapshotById(snapshotId);

  useEffect(() => {
    if (snapshot) updateActiveTabLabel(snapshot.name);
  }, [updateActiveTabLabel, snapshot]);

  const handleOpenInNewTab = (tab: ShellTab) => {
    const tabId = `console-${tab.instanceId}-${Date.now()}`;
    addTab({
      id: tabId,
      label: tab.title,
      path: `/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    navigate(`/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  const sidebarWidth = sidebarOpen ? 248 : 48;

  const shell = (children: React.ReactNode, crumbLabel: string) => (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
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
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Volume Snapshots', href: '/container/volume-snapshots' },
                { label: crumbLabel },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      bottomPanel={
        <ShellPanel
          isExpanded={shellPanel.isExpanded}
          onExpandedChange={shellPanel.setIsExpanded}
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          onActiveTabChange={shellPanel.setActiveTabId}
          onCloseTab={shellPanel.closeTab}
          onContentChange={shellPanel.updateContent}
          onClear={shellPanel.clearContent}
          onOpenInNewTab={handleOpenInNewTab}
          initialHeight={350}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20"
    >
      {children}
    </PageShell>
  );

  if (!snapshot) {
    return shell(
      <ErrorState
        icon={<IconAlertTriangle size={16} strokeWidth={1.5} />}
        title="Volume snapshot not found"
        description={`The volume snapshot "${snapshotId ?? ''}" does not exist or has been deleted.`}
        action={
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/container/volume-snapshots')}
          >
            Back to Volume Snapshots
          </Button>
        }
      />,
      snapshotId ?? 'Volume snapshot'
    );
  }

  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'restore',
      label: 'Restore as new PVC',
      disabled: !snapshot.readyToUse,
      onClick: () =>
        navigate(`/container/pvc/create?fromSnapshot=${encodeURIComponent(snapshot.name)}`),
    },
    {
      id: 'download-yaml',
      label: 'Download YAML',
      onClick: () => console.log('Download YAML'),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete'),
    },
  ];

  return shell(
    <VStack gap={6}>
      <DetailHeader>
        <DetailHeader.Title>Volume Snapshot: {snapshot.name}</DetailHeader.Title>
        <DetailHeader.Actions>
          <HStack gap={2}>
            <Button
              variant="primary"
              size="sm"
              disabled={!snapshot.readyToUse}
              onClick={() =>
                navigate(`/container/pvc/create?fromSnapshot=${encodeURIComponent(snapshot.name)}`)
              }
            >
              Restore as new PVC
            </Button>
            <ContextMenu items={moreActionsItems} trigger="click" align="right">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={12} stroke={1.5} />}
              >
                More actions
              </Button>
            </ContextMenu>
          </HStack>
        </DetailHeader.Actions>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard
            label="Status"
            value={
              <Tooltip content={snapshot.status}>
                <span className="max-w-[100px] truncate">
                  <Badge theme={getContainerStatusTheme(snapshot.status)} type="subtle" size="sm">
                    {snapshot.status}
                  </Badge>
                </span>
              </Tooltip>
            }
          />
          <DetailHeader.InfoCard label="Namespace" value={snapshot.namespace} />
          <DetailHeader.InfoCard label="Source PVC" value={snapshot.sourcePvc} />
          <DetailHeader.InfoCard label="Restore size" value={snapshot.restoreSize} />
          <DetailHeader.InfoCard label="Snapshot class" value={snapshot.snapshotClass} />
          <DetailHeader.InfoCard
            label="Ready to use"
            value={
              <Badge theme={snapshot.readyToUse ? 'green' : 'gray'} type="subtle" size="sm">
                {snapshot.readyToUse ? 'Yes' : 'No'}
              </Badge>
            }
          />
          <DetailHeader.InfoCard label="Created at" value={snapshot.createdAt} />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      <Tabs value={activeTab} onChange={setActiveTab} size="sm">
        <TabList>
          <Tab value="details">Details</Tab>
          <Tab value="yaml">YAML</Tab>
        </TabList>

        <TabPanel value="details">
          <VStack gap={4}>
            {/* 복원이 원본 덮어쓰기가 아니라는 점을 화면에서 드러낸다. */}
            <InlineMessage variant="info">
              Restoring creates a <strong>new</strong> PersistentVolumeClaim from this snapshot. The
              source volume <span className="font-mono">{snapshot.sourcePvc}</span> is never
              overwritten.
            </InlineMessage>

            {snapshot.status === 'Failed' && (
              <InlineMessage variant="warning">
                This snapshot failed and cannot be restored. Check whether the storage driver still
                has capacity, then delete and re-create it.
              </InlineMessage>
            )}

            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
              <VStack gap={3}>
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Source
                </h3>
                <DetailRow label="PersistentVolumeClaim" value={snapshot.sourcePvc} />
                <DetailRow label="Namespace" value={snapshot.namespace} />
                <DetailRow label="Restore size" value={snapshot.restoreSize} />
              </VStack>
            </div>

            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
              <VStack gap={3}>
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Snapshot
                </h3>
                <DetailRow label="Snapshot class" value={snapshot.snapshotClass} />
                <DetailRow label="Snapshot content" value={`snapcontent-${snapshot.id}`} />
                <DetailRow label="Created at" value={snapshot.createdAt} />
                <DetailRow label="Ready to use" value={snapshot.readyToUse ? 'Yes' : 'No'} />
              </VStack>
            </div>
          </VStack>
        </TabPanel>

        <TabPanel value="yaml">
          <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
            <pre className="text-body-sm font-mono whitespace-pre-wrap text-[var(--color-text-default)] overflow-x-auto">
              {snapshotYaml(snapshot)}
            </pre>
          </div>
        </TabPanel>
      </Tabs>
    </VStack>,
    snapshot.name
  );
}

/* ----------------------------------------
   Row
   ---------------------------------------- */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap={4} className="w-full">
      <span className="text-body-md text-[var(--color-text-subtle)] w-[220px] shrink-0">
        {label}
      </span>
      <span className="text-body-md text-[var(--color-text-default)] min-w-0 break-all">
        {value}
      </span>
    </HStack>
  );
}

export default ContainerVolumeSnapshotDetailPage;
