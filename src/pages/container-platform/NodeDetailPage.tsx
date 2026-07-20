import {
  PageShell,
  PageHeader,
  TopBar,
  Breadcrumb,
  VStack,
  Badge,
  Table,
  DetailHeader,
  EmptyState,
  ProgressBar,
  STATUS_THRESHOLDS,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  ContainerPlatformSidebar,
  CONTAINER_PLATFORM_SIDEBAR_WIDTH,
} from './ContainerPlatformSidebar';
import { ContainerPlatformTabBar } from './ContainerPlatformTabBar';
import { nodes, getEvents, getPlatformStatusTheme } from './containerPlatformMockData';
import type { ClusterEvent, EventType } from './containerPlatformTypes';

/* ----------------------------------------
   Node detail (Phase C2)

   Read-only single-node drill-down: header (identity + capacity) plus the events
   that reference this node. All data comes from the mock estate selectors.
   ---------------------------------------- */

function UsageCell({ value }: { value: number }) {
  return (
    <ProgressBar
      variant="quota"
      value={value}
      max={100}
      showValue
      size="sm"
      thresholds={STATUS_THRESHOLDS.container}
    />
  );
}

export default function NodeDetailPage() {
  const navigate = useNavigate();
  const { nodeId = '' } = useParams<{ nodeId: string }>();
  const node = nodes.find((n) => n.id === nodeId);

  const backToList = () => navigate('/container-platform/nodes');

  const shell = (children: ReactNode, crumbLabel: string) => (
    <PageShell
      sidebar={<ContainerPlatformSidebar />}
      sidebarWidth={CONTAINER_PLATFORM_SIDEBAR_WIDTH}
      tabBar={<ContainerPlatformTabBar />}
      topBar={
        <TopBar
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb items={[{ label: 'Nodes', onClick: backToList }, { label: crumbLabel }]} />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      {children}
    </PageShell>
  );

  if (!node) {
    return shell(
      <VStack gap={4}>
        <PageHeader title="Node" />
        <EmptyState
          title="Node not found"
          description={`No node matches "${nodeId}". It may have been removed from the estate.`}
        />
      </VStack>,
      'Not found'
    );
  }

  const nodeEvents = getEvents().filter(
    (e) => e.objectKind === 'Node' && e.objectName === node.name
  );

  const eventColumns: TableColumn<ClusterEvent>[] = [
    {
      key: 'type',
      label: 'Type',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: EventType) => (
        <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      flex: 1,
      minWidth: columnMinWidths.reason,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      minWidth: columnMinWidths.message,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
  ];

  return shell(
    <VStack gap={4}>
      <PageHeader title={node.name} />

      {/* Header: identity + capacity */}
      <DetailHeader>
        <DetailHeader.Title>{node.name}</DetailHeader.Title>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard
            label="Status"
            value={
              <Badge theme={getPlatformStatusTheme(node.status)} type="subtle" size="sm">
                {node.status}
              </Badge>
            }
          />
          <DetailHeader.InfoCard label="Roles" value={node.roles.join(', ')} />
          <DetailHeader.InfoCard label="Cluster" value={node.clusterName} />
          <DetailHeader.InfoCard
            label="Source"
            value={
              <Badge theme={node.source === 'Aegis' ? 'blue' : 'gray'} type="subtle" size="sm">
                {node.source}
              </Badge>
            }
          />
          <DetailHeader.InfoCard label="CPU usage" value={<UsageCell value={node.cpuUsagePct} />} />
          <DetailHeader.InfoCard
            label="Memory usage"
            value={<UsageCell value={node.memUsagePct} />}
          />
          <DetailHeader.InfoCard label="CPU (cores)" value={node.cpuCores} />
          <DetailHeader.InfoCard label="Memory (GiB)" value={node.memoryGiB} />
          <DetailHeader.InfoCard label="GPUs" value={node.gpuCount} />
          <DetailHeader.InfoCard label="Kubelet Version" value={node.kubeletVersion} />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      {/* Events referencing this node */}
      <VStack gap={2}>
        <span className="text-label-lg text-[var(--color-text-default)]">
          Events ({nodeEvents.length})
        </span>
        <Table<ClusterEvent>
          columns={eventColumns}
          data={nodeEvents}
          rowKey="id"
          resizable={false}
          emptyMessage="No events reference this node."
        />
      </VStack>
    </VStack>,
    node.name
  );
}
