// Container Platform — shared domain types for the unified read-only observability MVP.
// The "estate" is the cross-cluster view aggregated from the previously fragmented
// surfaces (Aegis / Metis). Mock-first: no backend. See containerPlatformMockData.ts.

export type ClusterSource = 'Aegis' | 'Metis';

/**
 * Which product manages a workload. Container Platform is the substrate; the
 * products (Maxis = AI training, Metis = serving, Aegis = general apps) run ON
 * it. "Metis Run" is legacy (its workloads/volumes were folded into the
 * substrate); "Devspace" workloads are hosted by Container Platform itself.
 */
export type ManagedBy = 'Aegis' | 'Maxis' | 'Metis' | 'Metis Run' | 'Devspace';

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
  gpuCount: number; // GPUs on this node (0 for non-GPU nodes)
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
  managedBy: ManagedBy; // which product owns this workload (CP just hosts it)
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

// --- AI workloads (Metis Run + ML Studio absorbed into Container Platform) --------
// Container Platform folds the previously separate AI surfaces in as first-class
// workload categories: model serving (Metis Run) -> InferenceService, and ML Studio
// -> TrainingJob + Notebook. GPU is a first-class node/estate resource.

export type AIWorkloadKind = 'InferenceService' | 'TrainingJob' | 'Notebook';

/** Model serving endpoint — absorbed from Metis Run. */
export interface InferenceService {
  id: string;
  name: string;
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  status: WorkloadStatus;
  model: string;
  framework: string; // vLLM / Triton / TF-Serving / TorchServe
  gpuCount: number;
  ready: number;
  desired: number;
  rps: number; // mock requests/sec
  latencyMs: number; // mock p95 latency
}

/** Training run — absorbed from ML Studio. */
export interface TrainingJob {
  id: string;
  name: string;
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  status: WorkloadStatus;
  framework: string; // PyTorch / TensorFlow / JAX
  gpuCount: number;
  progressPct: number;
  durationHrs: number;
  owner: string;
}

export type NotebookState = 'Running' | 'Idle' | 'Stopped';

/** Interactive notebook server — absorbed from ML Studio. */
export interface Notebook {
  id: string;
  name: string;
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  state: NotebookState;
  gpuCount: number;
  owner: string;
  image: string;
}

export interface GpuSummary {
  usedGpus: number;
  totalGpus: number;
}

// --- Namespaces & Events (Rancher-style estate breadth) --------------------------

export interface Namespace {
  id: string;
  name: string;
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  workloadCount: number;
}

export type EventType = 'Normal' | 'Warning';

export interface ClusterEvent {
  id: string;
  type: EventType;
  reason: string;
  objectKind: string;
  objectName: string;
  namespace: string;
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  message: string;
  ageMinutes: number;
}

// --- Volumes (absorbed from Metis Run into the substrate) ------------------------
// Container Platform owns the volume plane, but every volume carries an owner and
// an isolation scope so Metis/Maxis still get isolated volumes (split-memo issue).

export type VolumeKind = 'PV' | 'PVC';
export type VolumeStatus = 'Bound' | 'Available' | 'Released' | 'Pending';

export interface Volume {
  id: string;
  name: string;
  kind: VolumeKind;
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  owner: ManagedBy; // which product's data this volume holds
  capacityGiB: number;
  status: VolumeStatus;
  storageClass: string;
  accessMode: string; // RWO / RWX / ROX
  isolation: string; // owning namespace, or 'shared'
}

// --- Devspace (dev environments; hosted by Container Platform, under review) ------
// Reuses the substrate's /path/to pod-access routing (one impl shared with Metis
// Run pods) instead of each product building its own.

export type DevspaceState = 'Running' | 'Idle' | 'Stopped';

export interface Devspace {
  id: string;
  name: string;
  owner: string; // user
  clusterId: string;
  clusterName: string;
  source: ClusterSource;
  state: DevspaceState;
  gpuCount: number;
  image: string;
  accessUrl: string; // /path/to-style substrate route
}

export interface AISummary {
  inferenceServiceCount: number;
  trainingJobCount: number;
  notebookCount: number;
  gpus: GpuSummary;
}
