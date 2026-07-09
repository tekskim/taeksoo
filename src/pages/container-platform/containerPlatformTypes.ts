// Container Platform — shared domain types for the unified read-only observability MVP.
// The "estate" is the cross-cluster view aggregated from the previously fragmented
// surfaces (Aegis / Metis). Mock-first: no backend. See containerPlatformMockData.ts.

export type ClusterSource = 'Aegis' | 'Metis';

/** Rolled-up health used by clusters and the overview dashboard. */
export type HealthStatus = 'Healthy' | 'Warning' | 'Critical';

export type NodeStatus = 'Ready' | 'NotReady' | 'SchedulingDisabled';

export type NodeRole = 'control-plane' | 'worker';

export type WorkloadKind = 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'Job' | 'Pod';

export type WorkloadStatus = 'Running' | 'Pending' | 'Failed' | 'Succeeded';

export interface Cluster {
  id: string;
  name: string;
  source: ClusterSource;
  status: HealthStatus;
  k8sVersion: string;
  provider: string;
  region: string;
  nodeCount: number;
  workloadCount: number;
  cpu: { usedCores: number; totalCores: number };
  memory: { usedGiB: number; totalGiB: number };
}

export interface ClusterNode {
  id: string;
  name: string;
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  status: NodeStatus;
  roles: NodeRole[];
  cpuCores: number;
  memoryGiB: number;
  cpuUsagePct: number;
  memUsagePct: number;
  kubeletVersion: string;
}

export interface Workload {
  id: string;
  name: string;
  kind: WorkloadKind;
  namespace: string;
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  status: WorkloadStatus;
  ready: number;
  desired: number;
}

export interface EstateSummary {
  clusterCount: number;
  nodeCount: number;
  workloadCount: number;
  clustersByHealth: Record<HealthStatus, number>;
  unhealthyNodeCount: number;
  failingWorkloadCount: number;
  bySource: Record<ClusterSource, { clusters: number; nodes: number; workloads: number }>;
}
