/* ----------------------------------------
   커스텀 리소스 종류와 그 인스턴스 (CorePlan CAPSIS-D-55·D-56)

   두 화면이 같은 데이터를 본다 — 종류 목록(ResourceTypesPage)과 인스턴스
   목록(ResourceTypeInstancesPage). 전에는 두 화면이 각자 데이터를 들고 있어서
   종류 목록의 개수와 실제 인스턴스 개수가 서로 어긋났다. 그래서 인스턴스를
   한 곳에 두고, 종류 목록의 개수는 그 길이에서 뽑아 쓴다.

   예시는 **오퍼레이터로 설치한 앱이 만드는 자원**으로 둔다. App Catalog에
   CNPG Operator·kafka-operator가 실재하고, 그 앱들이 자기만의 자원 종류를
   만든다. 그 자원에는 폼도 목록 화면도 없어서 여기가 유일한 조회 경로다.

   표준 쿠버네티스 종류는 일부러 뺐다 — 이미 각자의 목록 화면이 있다
   ([CCONT-07]).

   ⚠ ArgoCD Application·AppProject과 Knative Service·Revision은 예시에서 뺐다.
   ArgoCD 쪽은 설치 상태라 Installed Apps가 답할 문제로 넘어갔고(CAPSIS-D-55),
   Knative는 우리 문서·코드 어디에도 근거가 없어 확인되지 않았다(CAPSIS-D-50).
   ---------------------------------------- */

import type { WorkloadManagedBy } from '@/pages/containerManagedBy';

/** 커스텀 리소스 종류. 개수는 인스턴스 목록에서 뽑으므로 여기 적지 않는다. */
export interface ResourceTypeDefinition {
  id: string;
  /** CRD 전체 이름, 예: clusters.postgresql.cnpg.io */
  name: string;
  /** 인스턴스가 쓰는 kind, 예: Cluster */
  kind: string;
  group: string;
  scope: 'Namespaced' | 'Cluster';
  managedBy?: WorkloadManagedBy;
}

/** 화면이 그리는 행. 종류 정보에 인스턴스 개수를 더한 것이다. */
export interface ResourceTypeRow extends ResourceTypeDefinition {
  instances: number;
}

export interface InstanceRow {
  id: string;
  name: string;
  /** Cluster 범위 자원은 네임스페이스가 없다. */
  namespace?: string;
  managedBy?: WorkloadManagedBy;
  createdAt: string;
}

const DEFINITIONS: ResourceTypeDefinition[] = [
  {
    id: 'clusters-cnpg',
    name: 'clusters.postgresql.cnpg.io',
    kind: 'Cluster',
    group: 'postgresql.cnpg.io',
    scope: 'Namespaced',
  },
  {
    id: 'backups-cnpg',
    name: 'backups.postgresql.cnpg.io',
    kind: 'Backup',
    group: 'postgresql.cnpg.io',
    scope: 'Namespaced',
  },
  {
    id: 'kafkas-strimzi',
    name: 'kafkas.kafka.strimzi.io',
    kind: 'Kafka',
    group: 'kafka.strimzi.io',
    scope: 'Namespaced',
  },
  {
    id: 'kafkatopics-strimzi',
    name: 'kafkatopics.kafka.strimzi.io',
    kind: 'KafkaTopic',
    group: 'kafka.strimzi.io',
    scope: 'Namespaced',
  },
  {
    id: 'milvus-zilliz',
    name: 'milvusclusters.milvus.io',
    kind: 'MilvusCluster',
    group: 'milvus.io',
    scope: 'Namespaced',
    managedBy: 'Metis',
  },
  {
    id: 'pytorchjobs-kubeflow',
    name: 'pytorchjobs.kubeflow.org',
    kind: 'PyTorchJob',
    group: 'kubeflow.org',
    scope: 'Namespaced',
    managedBy: 'Maxis',
  },
  {
    id: 'workqueues-kueue',
    name: 'workloads.kueue.x-k8s.io',
    kind: 'Workload',
    group: 'kueue.x-k8s.io',
    scope: 'Namespaced',
    managedBy: 'Maxis',
  },
  {
    id: 'clusterpolicies-nvidia',
    name: 'clusterpolicies.nvidia.com',
    kind: 'ClusterPolicy',
    group: 'nvidia.com',
    scope: 'Cluster',
  },
];

/** 종류 id → 그 종류의 인스턴스. */
export const INSTANCES: Record<string, InstanceRow[]> = {
  'clusters-cnpg': [
    { id: 'cnpg-c1', name: 'orders-db', namespace: 'apps', createdAt: 'Jul 24, 2026 09:12' },
    { id: 'cnpg-c2', name: 'billing-db', namespace: 'apps', createdAt: 'Jul 22, 2026 14:03' },
    { id: 'cnpg-c3', name: 'analytics-db', namespace: 'data', createdAt: 'Jul 19, 2026 11:47' },
  ],
  /* CNPG 오퍼레이터가 예약 백업을 하루 한 건씩 만든다. 12건이면 페이지가
     두 장이 되어 목록의 페이지 넘김도 함께 볼 수 있다. */
  'backups-cnpg': [
    {
      id: 'cnpg-b1',
      name: 'orders-db-20260730',
      namespace: 'apps',
      createdAt: 'Jul 30, 2026 02:00',
    },
    {
      id: 'cnpg-b2',
      name: 'billing-db-20260730',
      namespace: 'apps',
      createdAt: 'Jul 30, 2026 02:05',
    },
    {
      id: 'cnpg-b3',
      name: 'analytics-db-20260730',
      namespace: 'data',
      createdAt: 'Jul 30, 2026 02:10',
    },
    {
      id: 'cnpg-b4',
      name: 'orders-db-20260729',
      namespace: 'apps',
      createdAt: 'Jul 29, 2026 02:00',
    },
    {
      id: 'cnpg-b5',
      name: 'billing-db-20260729',
      namespace: 'apps',
      createdAt: 'Jul 29, 2026 02:05',
    },
    {
      id: 'cnpg-b6',
      name: 'analytics-db-20260729',
      namespace: 'data',
      createdAt: 'Jul 29, 2026 02:10',
    },
    {
      id: 'cnpg-b7',
      name: 'orders-db-20260728',
      namespace: 'apps',
      createdAt: 'Jul 28, 2026 02:00',
    },
    {
      id: 'cnpg-b8',
      name: 'billing-db-20260728',
      namespace: 'apps',
      createdAt: 'Jul 28, 2026 02:05',
    },
    {
      id: 'cnpg-b9',
      name: 'analytics-db-20260728',
      namespace: 'data',
      createdAt: 'Jul 28, 2026 02:10',
    },
    {
      id: 'cnpg-b10',
      name: 'orders-db-20260727',
      namespace: 'apps',
      createdAt: 'Jul 27, 2026 02:00',
    },
    {
      id: 'cnpg-b11',
      name: 'billing-db-20260727',
      namespace: 'apps',
      createdAt: 'Jul 27, 2026 02:05',
    },
    {
      id: 'cnpg-b12',
      name: 'analytics-db-20260727',
      namespace: 'data',
      createdAt: 'Jul 27, 2026 02:10',
    },
  ],
  'kafkas-strimzi': [
    { id: 'kafka-1', name: 'events-cluster', namespace: 'apps', createdAt: 'Jul 20, 2026 10:05' },
    {
      id: 'kafka-2',
      name: 'telemetry-cluster',
      namespace: 'data',
      createdAt: 'Jul 18, 2026 16:40',
    },
  ],
  'kafkatopics-strimzi': [
    { id: 'kt-1', name: 'events.orders', namespace: 'apps', createdAt: 'Jul 27, 2026 08:30' },
    { id: 'kt-2', name: 'events.audit', namespace: 'apps', createdAt: 'Jul 26, 2026 17:22' },
    { id: 'kt-3', name: 'events.billing', namespace: 'apps', createdAt: 'Jul 26, 2026 09:14' },
    { id: 'kt-4', name: 'events.shipping', namespace: 'apps', createdAt: 'Jul 25, 2026 13:58' },
    { id: 'kt-5', name: 'telemetry.metrics', namespace: 'data', createdAt: 'Jul 24, 2026 07:41' },
    { id: 'kt-6', name: 'telemetry.traces', namespace: 'data', createdAt: 'Jul 24, 2026 07:44' },
    { id: 'kt-7', name: 'dlq.orders', namespace: 'apps', createdAt: 'Jul 23, 2026 19:02' },
    { id: 'kt-8', name: 'dlq.billing', namespace: 'apps', createdAt: 'Jul 23, 2026 19:06' },
  ],
  'milvus-zilliz': [
    {
      id: 'milvus-1',
      name: 'metis-vector-store',
      namespace: 'metis-serving',
      managedBy: 'Metis',
      createdAt: 'Jul 27, 2026 08:30',
    },
  ],
  'pytorchjobs-kubeflow': [
    {
      id: 'pt-1',
      name: 'finetune-qwen-0729',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 29, 2026 02:10',
    },
    {
      id: 'pt-2',
      name: 'pretrain-run-14',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 28, 2026 21:55',
    },
    {
      id: 'pt-3',
      name: 'finetune-llama-0728',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 28, 2026 11:20',
    },
    {
      id: 'pt-4',
      name: 'pretrain-run-13',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 27, 2026 23:05',
    },
    {
      id: 'pt-5',
      name: 'eval-sweep-0726',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 26, 2026 15:33',
    },
    {
      id: 'pt-6',
      name: 'finetune-qwen-0725',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 25, 2026 08:47',
    },
  ],
  /* Kueue가 잡 하나마다 Workload 자원을 하나씩 만든다. 그래서 학습 잡보다
     개수가 많고, 큐에서 기다리는 것까지 함께 보인다. */
  'workqueues-kueue': [
    {
      id: 'kw-1',
      name: 'pytorchjob-finetune-qwen-0729-4f21a',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 29, 2026 02:10',
    },
    {
      id: 'kw-2',
      name: 'pytorchjob-pretrain-run-14-9c03b',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 28, 2026 21:55',
    },
    {
      id: 'kw-3',
      name: 'pytorchjob-finetune-llama-0728-77de4',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 28, 2026 11:20',
    },
    {
      id: 'kw-4',
      name: 'pytorchjob-pretrain-run-13-1ab55',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 27, 2026 23:05',
    },
    {
      id: 'kw-5',
      name: 'pytorchjob-eval-sweep-0726-30f9c',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 26, 2026 15:33',
    },
    {
      id: 'kw-6',
      name: 'pytorchjob-finetune-qwen-0725-6b28e',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 25, 2026 08:47',
    },
    {
      id: 'kw-7',
      name: 'job-dataset-shard-0724-c41f7',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 24, 2026 19:12',
    },
    {
      id: 'kw-8',
      name: 'job-dataset-shard-0723-88a02',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 23, 2026 19:12',
    },
    {
      id: 'kw-9',
      name: 'job-tokenize-corpus-0722-2ed61',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 22, 2026 06:28',
    },
    {
      id: 'kw-10',
      name: 'job-tokenize-corpus-0721-b5c93',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 21, 2026 06:28',
    },
  ],
  'clusterpolicies-nvidia': [
    { id: 'ncp-1', name: 'gpu-cluster-policy', createdAt: 'Jun 15, 2026 07:41' },
  ],
};

/** 이 종류의 인스턴스. 없으면 빈 목록. */
export const instancesOf = (typeId: string | undefined): InstanceRow[] =>
  (typeId && INSTANCES[typeId]) || [];

/** 종류 목록이 그리는 행. 개수는 인스턴스 목록의 길이에서 뽑는다. */
export const RESOURCE_TYPES: ResourceTypeRow[] = DEFINITIONS.map((definition) => ({
  ...definition,
  instances: instancesOf(definition.id).length,
}));
