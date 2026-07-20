import {
  PageShell,
  PageHeader,
  TopBar,
  Breadcrumb,
  VStack,
  HStack,
  Badge,
  Button,
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
import {
  getClusterById,
  getNodesByCluster,
  getWorkloadsByCluster,
  getAIWorkloadsByCluster,
  getPlatformStatusTheme,
} from './containerPlatformMockData';
import type {
  ClusterNode,
  NodeStatus,
  WorkloadKind,
  WorkloadStatus,
} from './containerPlatformTypes';

/* ----------------------------------------
   Cluster detail (Phase 5)

   Read-only single-cluster view: header (identity + capacity), the cluster's
   nodes, and a workloads rollup. All data comes from the mock estate selectors.
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

const WORKLOAD_STATUSES: WorkloadStatus[] = ['Running', 'Pending', 'Failed', 'Succeeded'];
const WORKLOAD_KINDS: WorkloadKind[] = ['Deployment', 'StatefulSet', 'DaemonSet', 'Job', 'Pod'];

export default function ClusterDetailPage() {
  const navigate = useNavigate();
  const { clusterId = '' } = useParams<{ clusterId: string }>();
  const cluster = getClusterById(clusterId);

  const backToList = () => navigate('/container-platform/clusters');

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
            <Breadcrumb
              items={[{ label: 'Clusters', onClick: backToList }, { label: crumbLabel }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      {children}
    </PageShell>
  );

  if (!cluster) {
    return shell(
      <VStack gap={4}>
        <PageHeader title="Cluster" />
        <EmptyState
          title="Cluster not found"
          description={`No cluster matches "${clusterId}". It may have been removed from the estate.`}
        />
      </VStack>,
      'Not found'
    );
  }

  const nodes = getNodesByCluster(cluster.id);
  const clusterWorkloads = getWorkloadsByCluster(cluster.id);

  // AI workloads + GPU capacity (only Metis GPU clusters have these).
  const ai = getAIWorkloadsByCluster(cluster.id);
  const gpuCapacity = nodes.reduce((sum, n) => sum + n.gpuCount, 0);
  const aiCount = ai.inference.length + ai.training.length + ai.notebooks.length;
  const hasAI = aiCount > 0 || gpuCapacity > 0;

  const workloadByStatus = WORKLOAD_STATUSES.map((s) => ({
    status: s,
    count: clusterWorkloads.filter((w) => w.status === s).length,
  }));
  const workloadByKind = WORKLOAD_KINDS.map((k) => ({
    kind: k,
    count: clusterWorkloads.filter((w) => w.kind === k).length,
  }));

  const nodeColumns: TableColumn<ClusterNode>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: NodeStatus) => (
        <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'roles',
      label: 'Roles',
      flex: 1,
      minWidth: columnMinWidths.roles,
      render: (_: unknown, row: ClusterNode) => row.roles.join(', '),
    },
    {
      key: 'cpuUsagePct',
      label: 'CPU',
      flex: 1,
      minWidth: columnMinWidths.cpuUsage,
      render: (value: number) => <UsageCell value={value} />,
    },
    {
      key: 'memUsagePct',
      label: 'Memory',
      flex: 1,
      minWidth: columnMinWidths.ramUsage,
      render: (value: number) => <UsageCell value={value} />,
    },
  ];

  return shell(
    <VStack gap={4}>
      <PageHeader title={cluster.name} />

      {/* Header: identity + capacity */}
      <DetailHeader>
        <DetailHeader.Title>{cluster.name}</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/container-platform/clusters/${cluster.id}/manage`)}
          >
            Manage cluster
          </Button>
        </DetailHeader.Actions>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard
            label="Source"
            value={
              <Badge theme={cluster.source === 'Aegis' ? 'blue' : 'gray'} type="subtle" size="sm">
                {cluster.source}
              </Badge>
            }
          />
          <DetailHeader.InfoCard
            label="Status"
            value={
              <Badge theme={getPlatformStatusTheme(cluster.status)} type="subtle" size="sm">
                {cluster.status}
              </Badge>
            }
          />
          <DetailHeader.InfoCard label="K8s Version" value={cluster.k8sVersion} />
          <DetailHeader.InfoCard label="Provider" value={cluster.provider} />
          <DetailHeader.InfoCard label="Region" value={cluster.region} />
          <DetailHeader.InfoCard
            label="CPU (cores)"
            value={`${cluster.cpu.usedCores} / ${cluster.cpu.totalCores}`}
          />
          <DetailHeader.InfoCard
            label="Memory (GiB)"
            value={`${cluster.memory.usedGiB} / ${cluster.memory.totalGiB}`}
          />
          {gpuCapacity > 0 && <DetailHeader.InfoCard label="GPUs" value={gpuCapacity} />}
        </DetailHeader.InfoGrid>
      </DetailHeader>

      {/* Workloads rollup */}
      <VStack gap={2}>
        <span className="text-label-lg text-[var(--color-text-default)]">
          Workloads ({clusterWorkloads.length})
        </span>
        <HStack gap={2} align="center" className="flex-wrap">
          {workloadByStatus.map(({ status, count }) => (
            <Badge
              key={status}
              theme={count === 0 ? 'gray' : getPlatformStatusTheme(status)}
              type="subtle"
              size="sm"
            >
              {count} {status}
            </Badge>
          ))}
        </HStack>
        <HStack gap={2} align="center" className="flex-wrap">
          {workloadByKind.map(({ kind, count }) => (
            <Badge key={kind} theme="gray" type="subtle" size="sm">
              {count} {kind}
            </Badge>
          ))}
        </HStack>
      </VStack>

      {/* AI workloads — only for GPU/AI clusters */}
      {hasAI && (
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">
            AI workloads ({aiCount})
          </span>
          <HStack gap={2} align="center" className="flex-wrap">
            <Badge theme="blue" type="subtle" size="sm">
              {ai.inference.length} Inference
            </Badge>
            <Badge theme="gray" type="subtle" size="sm">
              {ai.training.length} Training
            </Badge>
            <Badge theme="gray" type="subtle" size="sm">
              {ai.notebooks.length} Notebooks
            </Badge>
            <Badge theme="gray" type="subtle" size="sm">
              {gpuCapacity} GPUs
            </Badge>
          </HStack>
        </VStack>
      )}

      {/* Nodes */}
      <VStack gap={2}>
        <span className="text-label-lg text-[var(--color-text-default)]">
          Nodes ({nodes.length})
        </span>
        <Table<ClusterNode>
          columns={nodeColumns}
          data={nodes}
          rowKey="id"
          resizable={false}
          emptyMessage="No nodes in this cluster."
        />
      </VStack>
    </VStack>,
    cluster.name
  );
}
