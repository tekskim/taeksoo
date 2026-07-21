import {
  PageHeader,
  VStack,
  Badge,
  DetailHeader,
  EmptyState,
  Tooltip,
  Button,
} from '@/design-system';
import { useParams } from 'react-router-dom';
import { ManageShell, useManageCluster } from './ManageShell';
import {
  getWorkloadsByCluster,
  getPlatformStatusTheme,
  getManagedByTheme,
} from '../containerPlatformMockData';

/* ----------------------------------------
   Cluster manage — Workload detail

   Minimal drill-in proving the list → detail flow inside the cluster scope.
   Edit/YAML actions are placeholders for the screens to be moved over from the
   existing per-cluster management app in a later iteration.
   ---------------------------------------- */

export default function ManageWorkloadDetailPage() {
  const { clusterId } = useManageCluster();
  const { workloadId = '' } = useParams<{ workloadId: string }>();

  const workload = getWorkloadsByCluster(clusterId).find((w) => w.id === workloadId);

  if (!workload) {
    return (
      <ManageShell clusterId={clusterId} crumb="Workloads">
        <VStack gap={4}>
          <PageHeader title="Workload" />
          <EmptyState
            title="Workload not found"
            description={`No workload matches "${workloadId}" in this cluster.`}
          />
        </VStack>
      </ManageShell>
    );
  }

  return (
    <ManageShell clusterId={clusterId} crumb={workload.name}>
      <VStack gap={4}>
        <PageHeader title={workload.name} />

        <DetailHeader>
          <DetailHeader.Title>{workload.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Tooltip content="Coming in a later iteration" position="bottom">
              <Button variant="secondary" size="sm" onClick={(e) => e.preventDefault()}>
                Edit YAML
              </Button>
            </Tooltip>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Kind" value={workload.kind} />
            <DetailHeader.InfoCard label="Namespace" value={workload.namespace} />
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Badge theme={getPlatformStatusTheme(workload.status)} type="subtle" size="sm">
                  {workload.status}
                </Badge>
              }
            />
            <DetailHeader.InfoCard
              label="Replicas"
              value={`${workload.ready} / ${workload.desired}`}
            />
            <DetailHeader.InfoCard
              label="Managed by"
              value={
                <Badge theme={getManagedByTheme(workload.managedBy)} type="solid" size="sm">
                  {workload.managedBy}
                </Badge>
              }
            />
            <DetailHeader.InfoCard label="Cluster" value={workload.clusterName} />
          </DetailHeader.InfoGrid>
        </DetailHeader>
      </VStack>
    </ManageShell>
  );
}
