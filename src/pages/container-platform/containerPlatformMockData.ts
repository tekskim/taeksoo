// Container Platform — cross-cluster mock estate (Phase 2 data foundation).
// Deterministic (no Math.random / Date.now) so every render is stable. Every
// Container Platform screen reads from the selectors exported here — there is no
// backend. Statuses map to TDS Badge themes via getPlatformStatusTheme().

import type { BadgeTheme } from '@/design-system';
import { getContainerStatusTheme } from '@/pages/containerStatusUtils';
import type {
  AISummary,
  Cluster,
  ClusterNode,
  ClusterSource,
  EstateSummary,
  GpuSummary,
  InferenceService,
  NodeRole,
  Notebook,
  TrainingJob,
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
      // GPUs live on Metis worker nodes (the AI clusters); control-plane + Aegis have none.
      const gpuCount = cl.source === 'Metis' && !isControl ? 8 : 0;
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
        gpuCount,
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

// --- AI workloads (Metis Run + ML Studio absorbed) ------------------------------
// Deterministic inline mock. These live on the Metis GPU clusters. Statuses reuse
// WorkloadStatus so they theme through getPlatformStatusTheme like everything else.

export const inferenceServices: InferenceService[] = [
  {
    id: 'inf-1',
    name: 'llama3-70b-chat',
    clusterId: 'cl-metis-serving',
    clusterName: 'metis-serving',
    source: 'Metis',
    status: 'Running',
    model: 'Llama-3-70B-Instruct',
    framework: 'vLLM',
    gpuCount: 4,
    ready: 2,
    desired: 2,
    rps: 42,
    latencyMs: 180,
  },
  {
    id: 'inf-2',
    name: 'sdxl-turbo',
    clusterId: 'cl-metis-serving',
    clusterName: 'metis-serving',
    source: 'Metis',
    status: 'Running',
    model: 'SDXL-Turbo',
    framework: 'Triton',
    gpuCount: 2,
    ready: 3,
    desired: 3,
    rps: 18,
    latencyMs: 320,
  },
  {
    id: 'inf-3',
    name: 'bge-m3-embed',
    clusterId: 'cl-metis-serving',
    clusterName: 'metis-serving',
    source: 'Metis',
    status: 'Running',
    model: 'BGE-M3',
    framework: 'TF-Serving',
    gpuCount: 1,
    ready: 2,
    desired: 2,
    rps: 210,
    latencyMs: 24,
  },
  {
    id: 'inf-4',
    name: 'whisper-large-v3',
    clusterId: 'cl-metis-serving',
    clusterName: 'metis-serving',
    source: 'Metis',
    status: 'Failed',
    model: 'Whisper-large-v3',
    framework: 'TorchServe',
    gpuCount: 1,
    ready: 0,
    desired: 1,
    rps: 0,
    latencyMs: 0,
  },
  {
    id: 'inf-5',
    name: 'qwen2-7b',
    clusterId: 'cl-metis-serving',
    clusterName: 'metis-serving',
    source: 'Metis',
    status: 'Pending',
    model: 'Qwen2-7B',
    framework: 'vLLM',
    gpuCount: 1,
    ready: 0,
    desired: 1,
    rps: 0,
    latencyMs: 0,
  },
  {
    id: 'inf-6',
    name: 'resnet-classifier',
    clusterId: 'cl-metis-train-a100',
    clusterName: 'metis-train-a100',
    source: 'Metis',
    status: 'Running',
    model: 'ResNet-50',
    framework: 'Triton',
    gpuCount: 1,
    ready: 1,
    desired: 1,
    rps: 60,
    latencyMs: 45,
  },
  {
    id: 'inf-7',
    name: 'clip-vit-embed',
    clusterId: 'cl-metis-mlstudio',
    clusterName: 'metis-mlstudio',
    source: 'Metis',
    status: 'Running',
    model: 'CLIP-ViT-L',
    framework: 'TF-Serving',
    gpuCount: 1,
    ready: 1,
    desired: 1,
    rps: 90,
    latencyMs: 30,
  },
];

export const trainingJobs: TrainingJob[] = [
  {
    id: 'trn-1',
    name: 'llama-lora-finetune',
    clusterId: 'cl-metis-train-a100',
    clusterName: 'metis-train-a100',
    source: 'Metis',
    status: 'Running',
    framework: 'PyTorch',
    gpuCount: 8,
    progressPct: 62,
    durationHrs: 14.5,
    owner: 'jiwoo',
  },
  {
    id: 'trn-2',
    name: 'sdxl-dreambooth',
    clusterId: 'cl-metis-train-a100',
    clusterName: 'metis-train-a100',
    source: 'Metis',
    status: 'Running',
    framework: 'PyTorch',
    gpuCount: 4,
    progressPct: 38,
    durationHrs: 6.2,
    owner: 'minho',
  },
  {
    id: 'trn-3',
    name: 'bert-pretrain',
    clusterId: 'cl-metis-train-a100',
    clusterName: 'metis-train-a100',
    source: 'Metis',
    status: 'Succeeded',
    framework: 'TensorFlow',
    gpuCount: 8,
    progressPct: 100,
    durationHrs: 72.0,
    owner: 'sora',
  },
  {
    id: 'trn-4',
    name: 'rlhf-reward-model',
    clusterId: 'cl-metis-mlstudio',
    clusterName: 'metis-mlstudio',
    source: 'Metis',
    status: 'Running',
    framework: 'JAX',
    gpuCount: 2,
    progressPct: 12,
    durationHrs: 2.1,
    owner: 'taeksoo',
  },
  {
    id: 'trn-5',
    name: 'yolo-finetune',
    clusterId: 'cl-metis-mlstudio',
    clusterName: 'metis-mlstudio',
    source: 'Metis',
    status: 'Failed',
    framework: 'PyTorch',
    gpuCount: 1,
    progressPct: 47,
    durationHrs: 3.3,
    owner: 'hana',
  },
];

export const notebooks: Notebook[] = [
  {
    id: 'nb-1',
    name: 'jiwoo-dev',
    clusterId: 'cl-metis-mlstudio',
    clusterName: 'metis-mlstudio',
    source: 'Metis',
    state: 'Running',
    gpuCount: 1,
    owner: 'jiwoo',
    image: 'pytorch-2.3-cuda12',
  },
  {
    id: 'nb-2',
    name: 'minho-eda',
    clusterId: 'cl-metis-mlstudio',
    clusterName: 'metis-mlstudio',
    source: 'Metis',
    state: 'Idle',
    gpuCount: 0,
    owner: 'minho',
    image: 'datascience-cpu',
  },
  {
    id: 'nb-3',
    name: 'sora-vision',
    clusterId: 'cl-metis-mlstudio',
    clusterName: 'metis-mlstudio',
    source: 'Metis',
    state: 'Running',
    gpuCount: 1,
    owner: 'sora',
    image: 'tf-2.16-gpu',
  },
  {
    id: 'nb-4',
    name: 'taeksoo-llm',
    clusterId: 'cl-metis-dev',
    clusterName: 'metis-dev',
    source: 'Metis',
    state: 'Running',
    gpuCount: 1,
    owner: 'taeksoo',
    image: 'vllm-notebook',
  },
  {
    id: 'nb-5',
    name: 'hana-sandbox',
    clusterId: 'cl-metis-dev',
    clusterName: 'metis-dev',
    source: 'Metis',
    state: 'Stopped',
    gpuCount: 0,
    owner: 'hana',
    image: 'minimal-cpu',
  },
  {
    id: 'nb-6',
    name: 'research-shared',
    clusterId: 'cl-metis-mlstudio',
    clusterName: 'metis-mlstudio',
    source: 'Metis',
    state: 'Idle',
    gpuCount: 2,
    owner: 'team-ml',
    image: 'pytorch-2.3-cuda12',
  },
];

export function getInferenceServicesByCluster(clusterId: string): InferenceService[] {
  return inferenceServices.filter((s) => s.clusterId === clusterId);
}
export function getTrainingJobsByCluster(clusterId: string): TrainingJob[] {
  return trainingJobs.filter((j) => j.clusterId === clusterId);
}
export function getNotebooksByCluster(clusterId: string): Notebook[] {
  return notebooks.filter((n) => n.clusterId === clusterId);
}

/** All AI workloads owned by a cluster (used by the cluster detail page). */
export function getAIWorkloadsByCluster(clusterId: string): {
  inference: InferenceService[];
  training: TrainingJob[];
  notebooks: Notebook[];
} {
  return {
    inference: getInferenceServicesByCluster(clusterId),
    training: getTrainingJobsByCluster(clusterId),
    notebooks: getNotebooksByCluster(clusterId),
  };
}

export function getGpuSummary(): GpuSummary {
  const totalGpus = nodes.reduce((sum, n) => sum + n.gpuCount, 0);
  const usedGpus =
    inferenceServices.reduce((sum, s) => sum + s.gpuCount, 0) +
    trainingJobs.reduce((sum, j) => sum + j.gpuCount, 0) +
    notebooks.reduce((sum, n) => sum + n.gpuCount, 0);
  return { usedGpus, totalGpus };
}

export function getAISummary(): AISummary {
  return {
    inferenceServiceCount: inferenceServices.length,
    trainingJobCount: trainingJobs.length,
    notebookCount: notebooks.length,
    gpus: getGpuSummary(),
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
  // notebook states (running -> green via fallback; stopped -> gray via fallback)
  idle: 'blue',
};

export function getPlatformStatusTheme(status: string): BadgeTheme {
  const normalized = status.toLowerCase().trim();
  return PLATFORM_STATUS_THEME[normalized] ?? getContainerStatusTheme(status);
}
