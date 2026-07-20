import { PageHeader, VStack, HStack, Badge, DetailHeader, EmptyState } from '@/design-system';
import { ManageShell, useManageCluster } from './ManageShell';
import {
  getNodesByCluster,
  getWorkloadsByCluster,
  getVolumesByCluster,
  getEventsByCluster,
  getPlatformStatusTheme,
} from '../containerPlatformMockData';
import type { WorkloadStatus } from '../containerPlatformTypes';

/* ----------------------------------------
   Cluster manage — Overview

   Landing screen of the cluster scope: identity + capacity, then a compact
   rollup of what this cluster runs. Deep lists live in the sidebar sections.
   ---------------------------------------- */

const WORKLOAD_STATUSES: WorkloadStatus[] = ['Running', 'Pending', 'Failed', 'Succeeded'];

export default function ManageOverviewPage() {
  const { clusterId, cluster } = useManageCluster();

  if (!cluster) {
    return (
      <ManageShell clusterId={clusterId}>
        <VStack gap={4}>
          <PageHeader title="Cluster" />
          <EmptyState
            title="Cluster not found"
            description={`No cluster matches "${clusterId}".`}
          />
        </VStack>
      </ManageShell>
    );
  }

  const nodes = getNodesByCluster(cluster.id);
  const clusterWorkloads = getWorkloadsByCluster(cluster.id);
  const volumes = getVolumesByCluster(cluster.id);
  const events = getEventsByCluster(cluster.id);
  const gpuCapacity = nodes.reduce((sum, n) => sum + n.gpuCount, 0);
  const warningEvents = events.filter((e) => e.type === 'Warning').length;

  const workloadByStatus = WORKLOAD_STATUSES.map((s) => ({
    status: s,
    count: clusterWorkloads.filter((w) => w.status === s).length,
  }));

  return (
    <ManageShell clusterId={clusterId}>
      <VStack gap={4}>
        <PageHeader title={`Manage ${cluster.name}`} />

        <DetailHeader>
          <DetailHeader.Title>{cluster.name}</DetailHeader.Title>
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
            <DetailHeader.InfoCard label="Nodes" value={nodes.length} />
            <DetailHeader.InfoCard
              label="CPU (cores)"
              value={`${cluster.cpu.usedCores} / ${cluster.cpu.totalCores}`}
            />
            <DetailHeader.InfoCard
              label="Memory (GiB)"
              value={`${cluster.memory.usedGiB} / ${cluster.memory.totalGiB}`}
            />
            {gpuCapacity > 0 && <DetailHeader.InfoCard label="GPUs" value={gpuCapacity} />}
            <DetailHeader.InfoCard label="Volumes" value={volumes.length} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

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
            {warningEvents > 0 && (
              <Badge theme="yellow" type="subtle" size="sm">
                {warningEvents} warning events
              </Badge>
            )}
          </HStack>
        </VStack>
      </VStack>
    </ManageShell>
  );
}
