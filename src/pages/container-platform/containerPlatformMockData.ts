// Container Platform — cross-cluster mock estate (Phase 2 data foundation).
// Deterministic (no Math.random / Date.now) so every render is stable. Every
// Container Platform screen reads from the selectors exported here — there is no
// backend. Statuses map to TDS Badge themes via getPlatformStatusTheme().

import type { BadgeTheme } from '@/design-system';
import { getContainerStatusTheme } from '@/pages/containerStatusUtils';
import type {
  Cluster,
  ClusterNode,
  ClusterSource,
  EstateSummary,
  NodeRole,
  Workload,
  WorkloadKind,
  WorkloadStatus,
} from './containerPlatformTypes';

// --- Clusters (authoritative list across the fragmented surfaces) ---------------

export const clusters: Cluster[] = [
  {
    id: 'cl-aegis-prod-seoul',
    name: 'aegis-prod-seoul',
    source: 'Aegis',
    status: 'Healthy',
    k8sVersion: 'v1.29.4',
    provider: 'On-prem (Capsis)',
    region: 'Seoul-DC1',
    nodeCount: 6,
    workloadCount: 42,
    cpu: { usedCores: 118, totalCores: 192 },
    memory: { usedGiB: 612, totalGiB: 1024 },
  },
  {
    id: 'cl-aegis-prod-tokyo',
    name: 'aegis-prod-tokyo',
    source: 'Aegis',
    status: 'Warning',
    k8sVersion: 'v1.29.4',
    provider: 'On-prem (Capsis)',
    region: 'Tokyo-DC1',
    nodeCount: 5,
    workloadCount: 31,
    cpu: { usedCores: 138, totalCores: 160 },
    memory: { usedGiB: 742, totalGiB: 896 },
  },
  {
    id: 'cl-aegis-staging',
    name: 'aegis-staging',
    source: 'Aegis',
    status: 'Healthy',
    k8sVersion: 'v1.30.1',
    provider: 'On-prem (Capsis)',
    region: 'Seoul-DC2',
    nodeCount: 3,
    workloadCount: 18,
    cpu: { usedCores: 34, totalCores: 96 },
    memory: { usedGiB: 180, totalGiB: 512 },
  },
  {
    id: 'cl-metis-train-a100',
    name: 'metis-train-a100',
    source: 'Metis',
    status: 'Healthy',
    k8sVersion: 'v1.28.9',
    provider: 'On-prem (Capsis)',
    region: 'Seoul-GPU1',
    nodeCount: 8,
    workloadCount: 24,
    cpu: { usedCores: 210, totalCores: 256 },
    memory: { usedGiB: 1480, totalGiB: 2048 },
  },
  {
    id: 'cl-metis-serving',
    name: 'metis-serving',
    source: 'Metis',
    status: 'Critical',
    k8sVersion: 'v1.28.9',
    provider: 'On-prem (Capsis)',
    region: 'Seoul-GPU2',
    nodeCount: 4,
    workloadCount: 15,
    cpu: { usedCores: 121, totalCores: 128 },
    memory: { usedGiB: 968, totalGiB: 1024 },
  },
  {
    id: 'cl-metis-dev',
    name: 'metis-dev',
    source: 'Metis',
    status: 'Warning',
    k8sVersion: 'v1.30.1',
    provider: 'On-prem (Capsis)',
    region: 'Seoul-DC2',
    nodeCount: 2,
    workloadCount: 9,
    cpu: { usedCores: 22, totalCores: 48 },
    memory: { usedGiB: 96, totalGiB: 256 },
  },
  {
    id: 'cl-aegis-edge-busan',
    name: 'aegis-edge-busan',
    source: 'Aegis',
    status: 'Healthy',
    k8sVersion: 'v1.29.4',
    provider: 'On-prem (Capsis)',
    region: 'Busan-Edge',
    nodeCount: 3,
    workloadCount: 12,
    cpu: { usedCores: 28, totalCores: 72 },
    memory: { usedGiB: 120, totalGiB: 384 },
  },
  {
    id: 'cl-metis-mlstudio',
    name: 'metis-mlstudio',
    source: 'Metis',
    status: 'Healthy',
    k8sVersion: 'v1.28.9',
    provider: 'On-prem (Capsis)',
    region: 'Seoul-GPU1',
    nodeCount: 3,
    workloadCount: 11,
    cpu: { usedCores: 44, totalCores: 96 },
    memory: { usedGiB: 260, totalGiB: 768 },
  },
];

// --- Deterministic node generation ---------------------------------------------

const KUBELET_BY_VERSION: Record<string, string> = {
  'v1.29.4': 'v1.29.4',
  'v1.30.1': 'v1.30.1',
  'v1.28.9': 'v1.28.9',
};

function buildNodes(): ClusterNode[] {
  const out: ClusterNode[] = [];
  clusters.forEach((cl) => {
    for (let i = 0; i < cl.nodeCount; i += 1) {
      const isControl = i === 0 || (cl.nodeCount >= 5 && i === 1);
      const roles: NodeRole[] = isControl ? ['control-plane'] : ['worker'];
      // Deterministic-but-varied usage derived from indices.
      const cpuUsagePct = 28 + ((i * 13 + cl.name.length * 7) % 60);
      const memUsagePct = 34 + ((i * 17 + cl.region.length * 5) % 55);
      // A couple of nodes in non-healthy clusters are not Ready.
      let status: ClusterNode['status'] = 'Ready';
      if (cl.status === 'Critical' && i === cl.nodeCount - 1) status = 'NotReady';
      else if (cl.status === 'Warning' && i === cl.nodeCount - 1) status = 'SchedulingDisabled';
      const cpuCores = cl.source === 'Metis' ? 32 : 24;
      const memoryGiB = cl.source === 'Metis' ? 256 : 128;
      out.push({
        id: `${cl.id}-node-${i + 1}`,
        name: `${cl.name}-${isControl ? 'cp' : 'worker'}-${i + 1}`,
        clusterId: cl.id,
        clusterName: cl.name,
        source: cl.source,
        status,
        roles,
        cpuCores,
        memoryGiB,
        cpuUsagePct,
        memUsagePct,
        kubeletVersion: KUBELET_BY_VERSION[cl.k8sVersion] ?? cl.k8sVersion,
      });
    }
  });
  return out;
}

export const nodes: ClusterNode[] = buildNodes();

// --- Deterministic workload generation -----------------------------------------

const KINDS: WorkloadKind[] = ['Deployment', 'StatefulSet', 'DaemonSet', 'Job', 'Pod'];
const NAMESPACES = ['default', 'kube-system', 'platform', 'monitoring', 'ml-serving', 'ingest'];
const APP_NAMES = [
  'api',
  'gateway',
  'worker',
  'scheduler',
  'cache',
  'db',
  'inference',
  'trainer',
  'exporter',
  'proxy',
  'notebook',
  'queue',
];

function workloadStatusFor(cl: Cluster, index: number, kind: WorkloadKind): WorkloadStatus {
  if (kind === 'Job') return index % 4 === 0 ? 'Succeeded' : 'Running';
  if (cl.status === 'Critical') {
    if (index % 5 === 0) return 'Failed';
    if (index % 5 === 1) return 'Pending';
  } else if (cl.status === 'Warning') {
    if (index % 7 === 0) return 'Pending';
  }
  return 'Running';
}

function buildWorkloads(): Workload[] {
  const out: Workload[] = [];
  clusters.forEach((cl) => {
    for (let i = 0; i < cl.workloadCount; i += 1) {
      const kind = KINDS[i % KINDS.length];
      const app = APP_NAMES[i % APP_NAMES.length];
      const ns = NAMESPACES[i % NAMESPACES.length];
      const status = workloadStatusFor(cl, i, kind);
      const desired = kind === 'DaemonSet' ? cl.nodeCount : (i % 3) + 1;
      const ready =
        status === 'Running' || status === 'Succeeded' ? desired : Math.max(0, desired - 1);
      out.push({
        id: `${cl.id}-wl-${i + 1}`,
        name: `${app}-${kind.toLowerCase()}-${i + 1}`,
        kind,
        namespace: ns,
        clusterId: cl.id,
        clusterName: cl.name,
        source: cl.source,
        status,
        ready,
        desired,
      });
    }
  });
  return out;
}

export const workloads: Workload[] = buildWorkloads();

// --- Selectors ------------------------------------------------------------------

export function getClusterById(id: string): Cluster | undefined {
  return clusters.find((c) => c.id === id);
}

export function getNodesByCluster(clusterId: string): ClusterNode[] {
  return nodes.filter((n) => n.clusterId === clusterId);
}

export function getWorkloadsByCluster(clusterId: string): Workload[] {
  return workloads.filter((w) => w.clusterId === clusterId);
}

export function getEstateSummary(): EstateSummary {
  const clustersByHealth = { Healthy: 0, Warning: 0, Critical: 0 } as Record<
    Cluster['status'],
    number
  >;
  clusters.forEach((c) => {
    clustersByHealth[c.status] += 1;
  });
  const bySource = {
    Aegis: { clusters: 0, nodes: 0, workloads: 0 },
    Metis: { clusters: 0, nodes: 0, workloads: 0 },
  } as Record<ClusterSource, { clusters: number; nodes: number; workloads: number }>;
  clusters.forEach((c) => (bySource[c.source].clusters += 1));
  nodes.forEach((n) => (bySource[n.source].nodes += 1));
  workloads.forEach((w) => (bySource[w.source].workloads += 1));
  return {
    clusterCount: clusters.length,
    nodeCount: nodes.length,
    workloadCount: workloads.length,
    clustersByHealth,
    unhealthyNodeCount: nodes.filter((n) => n.status === 'NotReady').length,
    failingWorkloadCount: workloads.filter((w) => w.status === 'Failed').length,
    bySource,
  };
}

// --- Status theming --------------------------------------------------------------
// Single source of truth for every Container Platform status Badge (health, node,
// AND workload statuses). Reuses getContainerStatusTheme as the fallback and adds
// the platform-specific mappings (Warning=yellow, Pending=yellow, Succeeded=gray)
// so the same status is themed identically on every screen.

const PLATFORM_STATUS_THEME: Record<string, BadgeTheme> = {
  healthy: 'green',
  ready: 'green',
  warning: 'yellow',
  schedulingdisabled: 'yellow',
  critical: 'red',
  notready: 'red',
  // workload statuses
  pending: 'yellow',
  succeeded: 'gray',
};

export function getPlatformStatusTheme(status: string): BadgeTheme {
  const normalized = status.toLowerCase().trim();
  return PLATFORM_STATUS_THEME[normalized] ?? getContainerStatusTheme(status);
}
