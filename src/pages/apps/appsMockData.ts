/**
 * Apps Catalog / Installed Apps 목 데이터
 * thaki-ui catalogData.ts 기준 — 정책서 확정 차트 목록
 */
import type {
  CatalogChart,
  InstalledApp,
  InstalledOperator,
  ConfigurationField,
} from './appsTypes';

export const CATEGORIES = [
  'All',
  'Database',
  'Developer Tools',
  'Data Processing',
  'Networking',
  'Vector DB',
] as const;

/* ============================================================
   Configuration Field 정의 (thaki-ui catalogData.ts 기준)
   ============================================================ */

const CNPG_FIELDS: ConfigurationField[] = [
  {
    key: 'instanceName',
    label: 'Instance Name',
    type: 'text',
    required: true,
    defaultValue: 'postgres',
  },
  {
    key: 'postgresqlImage',
    label: 'PostgreSQL Image',
    type: 'text',
    required: true,
    defaultValue: 'ghcr.io/cloudnative-pg/postgresql:17.6-system-trixie',
  },
  {
    key: 'imagePullPolicy',
    label: 'Image Pull Policy',
    type: 'select',
    required: true,
    defaultValue: 'Always',
    options: ['Always', 'IfNotPresent', 'Never'],
  },
  {
    key: 'instanceCount',
    label: 'Instance Count',
    type: 'number',
    required: true,
    defaultValue: 3,
  },
  { key: 'cpuRequest', label: 'CPU Request', type: 'text', required: true, defaultValue: '500m' },
  { key: 'cpuLimit', label: 'CPU Limit', type: 'text', required: true, defaultValue: '1000m' },
  {
    key: 'memoryRequest',
    label: 'Memory Request',
    type: 'text',
    required: true,
    defaultValue: '1Gi',
  },
  { key: 'memoryLimit', label: 'Memory Limit', type: 'text', required: true, defaultValue: '2Gi' },
  {
    key: 'primaryUpdateStrategy',
    label: 'Primary Update Strategy',
    type: 'select',
    required: true,
    defaultValue: 'unsupervised',
    options: ['unsupervised', 'supervised'],
  },
  {
    key: 'primaryUpdateMethod',
    label: 'Primary Update Method',
    type: 'select',
    required: true,
    defaultValue: 'restart',
    options: ['restart', 'switchover'],
  },
  {
    key: 'dataStorageSize',
    label: 'Data Storage Size (Gi)',
    type: 'number',
    required: true,
    defaultValue: 20,
  },
  {
    key: 'storageClass',
    label: 'StorageClass',
    type: 'text',
    required: true,
    defaultValue: 'standard',
  },
  {
    key: 'appDatabaseName',
    label: 'App Database Name',
    type: 'text',
    required: true,
    defaultValue: 'app',
  },
  {
    key: 'appDatabaseUsername',
    label: 'App DB Username',
    type: 'text',
    required: true,
    defaultValue: 'app',
  },
  {
    key: 'appDatabasePassword',
    label: 'App DB Password',
    type: 'password',
    required: true,
    defaultValue: '',
  },
  {
    key: 'enableSuperuserAccess',
    label: 'Enable Superuser Access',
    type: 'boolean',
    required: true,
    defaultValue: true,
  },
  {
    key: 'superuserPassword',
    label: 'Superuser Password',
    type: 'password',
    required: true,
    defaultValue: '',
  },
  {
    key: 'enablePgBouncerPooler',
    label: 'Enable PgBouncer Pooler',
    type: 'boolean',
    required: true,
    defaultValue: true,
  },
  {
    key: 'poolerConnectionType',
    label: 'Pooler Connection Type',
    type: 'select',
    required: true,
    defaultValue: 'rw',
    options: ['rw', 'ro'],
  },
  {
    key: 'poolerInstanceCount',
    label: 'Pooler Instance Count',
    type: 'number',
    required: true,
    defaultValue: 2,
  },
  {
    key: 'poolMode',
    label: 'Pool Mode',
    type: 'select',
    required: true,
    defaultValue: 'transaction',
    options: ['transaction', 'session', 'statement'],
  },
  {
    key: 'enableClusterPodMonitor',
    label: 'Enable Cluster PodMonitor',
    type: 'boolean',
    required: true,
    defaultValue: false,
  },
  {
    key: 'enablePoolerPodMonitor',
    label: 'Enable Pooler PodMonitor',
    type: 'boolean',
    required: true,
    defaultValue: false,
  },
];

/* ============================================================
   Catalog Charts (정책서 v1 확정 목록)
   ============================================================ */

export const catalogCharts: CatalogChart[] = [
  /* ── Database ── */
  {
    id: 'valkey',
    name: 'valkey',
    displayName: 'Valkey',
    category: 'Database',
    packageType: 'application',
    packageLabel: 'Helm',
    availableVersions: ['v8.0.2'],
    version: 'v8.0.2',
    description:
      'Valkey is an open source, high-performance key/value datastore. Supports standalone and Master-Replica HA mode. Drop-in replacement for Redis OSS.',
    installScope: 'namespace',
    duplicateInstallable: true,
    iconText: 'V',
    configurationFields: [],
    defaultValuesYaml: `replicaCount: 1

service:
  type: ClusterIP
  port: 6379

resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
`,
  },
  {
    id: 'cnpg',
    name: 'cnpg',
    displayName: 'CNPG',
    category: 'Database',
    packageType: 'application',
    packageLabel: 'Operator-managed',
    availableVersions: ['1.29.0'],
    version: '1.29.0',
    description:
      'PostgreSQL cluster instance managed by CloudNativePG Operator. Requires CNPG Operator to be installed first. Supports HA, PgBouncer pooling, and automated backups.',
    installScope: 'namespace',
    duplicateInstallable: true,
    iconText: 'C',
    configurationFields: CNPG_FIELDS,
    requiredOperatorChartNames: ['cnpg-operator'],
    defaultValuesYaml: `instanceName: "postgres"
instanceCount: 3
storageClass: "standard"
dataStorageSize: 20
appDatabaseName: "app"
appDatabaseUsername: "app"
`,
  },

  /* ── Developer Tools ── */
  {
    id: 'gitea',
    name: 'gitea',
    displayName: 'Gitea',
    category: 'Developer Tools',
    packageType: 'application',
    packageLabel: 'Helm',
    availableVersions: ['10.6.0'],
    version: '10.6.0',
    description:
      'Gitea is a lightweight self-hosted Git service. Includes embedded PostgreSQL-HA and Valkey-Cluster. No external dependencies required.',
    installScope: 'namespace',
    duplicateInstallable: true,
    iconText: 'G',
    configurationFields: [],
    defaultValuesYaml: `gitea:
  admin:
    username: "gitea_admin"
    password: ""
    email: "admin@example.com"

service:
  http:
    type: ClusterIP
    port: 3000

persistence:
  enabled: true
  size: 10Gi
`,
  },

  /* ── Storage ── */
  {
    id: 'seaweedfs',
    name: 'seaweedfs',
    displayName: 'SeaweedFS',
    category: 'Storage',
    packageType: 'application',
    packageLabel: 'Helm',
    availableVersions: ['4.0.0'],
    version: '4.0.0',
    description:
      'SeaweedFS is a fast, S3-compatible distributed object storage system. Provides scalable blob, object, and file storage with automatic replication. Commonly used as the S3 backend for apps such as Milvus.',
    installScope: 'namespace',
    duplicateInstallable: true,
    iconText: 'S',
    configurationFields: [],
    defaultValuesYaml: `master:
  replicas: 1

volume:
  replicas: 1
  dataDirs:
    - name: data
      type: persistentVolumeClaim
      size: 10Gi
      storageClass: standard

filer:
  replicas: 1

s3:
  enabled: true
  port: 8333
`,
  },

  /* ── Data Processing ── */
  {
    id: 'kafka',
    name: 'kafka',
    displayName: 'Kafka Instance',
    category: 'Data Processing',
    packageType: 'application',
    packageLabel: 'Operator-managed',
    availableVersions: ['4.2.0'],
    version: '4.2.0',
    description:
      'Apache Kafka cluster instance managed by the Strimzi Operator. Runs in KRaft mode (no ZooKeeper) — controller + broker roles via KafkaNodePool. Requires the Strimzi Kafka Operator to be installed first.',
    installScope: 'namespace',
    duplicateInstallable: false,
    iconText: 'K',
    configurationFields: [],
    // 실제 chart(app-catalog-chart) 기준: Kafka Instance는 Strimzi Operator 1개에만 의존.
    // Strimzi는 KRaft 모드라 ZooKeeper를 쓰지 않는다 (별도 ZooKeeper Operator 의존 없음).
    requiredOperatorChartNames: ['strimzi-kafka-operator'],
    defaultValuesYaml: `replicas: 3
storage:
  type: jbod
  volumes:
    - id: 0
      type: persistent-claim
      size: 50Gi
`,
  },
  {
    id: 'hdfs',
    name: 'hdfs',
    displayName: 'HDFS Instance',
    category: 'Data Processing',
    packageType: 'application',
    packageLabel: 'Operator-managed',
    availableVersions: ['3.3.6'],
    version: '3.3.6',
    description:
      'Apache Hadoop HDFS cluster (NameNode HA) managed by the Kubedoop operator set. Creates ZookeeperCluster + ZookeeperZnode + HdfsCluster CRs. Requires the Kubedoop HDFS operator umbrella (5 operators) to be installed first.',
    installScope: 'namespace',
    duplicateInstallable: true,
    iconText: 'H',
    configurationFields: [],
    // 실제 chart 기준 "2개 이상 Operator" 케이스.
    // HDFS Operator는 umbrella 차트로 5개 operator를 번들한다
    // (commons / secret / listener / zookeeper / hdfs — apps/hdfs/operator/helm/Chart.yaml).
    // 추상 복수의존 모델로 5개를 행 단위 의존성으로 노출한다.
    requiredOperatorChartNames: [
      'commons-operator',
      'secret-operator',
      'listener-operator',
      'zookeeper-operator',
      'hdfs-operator',
    ],
    defaultValuesYaml: `zookeeper:
  enabled: true
nameNode:
  replicas: 2
journalNode:
  replicas: 1  # operator 0.3.0 제약: JN=1 고정
dataNode:
  replicas: 3
`,
  },

  /* ── Vector DB ── */
  {
    id: 'milvus',
    name: 'milvus',
    displayName: 'Milvus',
    category: 'Vector DB',
    packageType: 'application',
    packageLabel: 'Helm',
    availableVersions: ['4.2.7'],
    version: '4.2.7',
    description:
      'Milvus is an open-source vector database built to power embedding similarity search and AI applications. Supports trillion-scale vector similarity search.',
    installScope: 'namespace',
    duplicateInstallable: true,
    iconText: 'M',
    configurationFields: [],
    defaultValuesYaml: `cluster:
  enabled: false

standalone:
  resources:
    limits:
      cpu: "2"
      memory: "4Gi"

minio:
  enabled: true

etcd:
  enabled: true

pulsar:
  enabled: false
`,
  },

  /* ── Operators ── */
  {
    id: 'cnpg-operator',
    name: 'cnpg-operator',
    displayName: 'CNPG Operator',
    category: 'Database',
    packageType: 'operator',
    packageLabel: 'Operator',
    availableVersions: ['1.29.0'],
    version: '1.29.0',
    description:
      'CloudNativePG Operator for Kubernetes. Manages PostgreSQL clusters using the CNPG CRD. Install this first before creating CNPG instances.',
    installScope: 'cluster',
    duplicateInstallable: false,
    iconText: 'CO',
    configurationFields: [],
  },
  {
    id: 'strimzi-kafka-operator',
    name: 'strimzi-kafka-operator',
    displayName: 'Strimzi Kafka Operator',
    category: 'Data Processing',
    packageType: 'operator',
    packageLabel: 'Operator',
    availableVersions: ['0.51.0'],
    version: '0.51.0',
    description:
      'Strimzi Operator manages Apache Kafka clusters on Kubernetes via the Kafka CRD (KRaft mode). Required to provision Kafka instances.',
    installScope: 'cluster',
    duplicateInstallable: false,
    iconText: 'SO',
    configurationFields: [],
  },
  // ── Kubedoop HDFS operator set (umbrella v0.3.0) — apps/hdfs/operator/helm/Chart.yaml ──
  {
    id: 'commons-operator',
    name: 'commons-operator',
    displayName: 'Commons Operator',
    category: 'Data Processing',
    packageType: 'operator',
    packageLabel: 'Operator',
    availableVersions: ['0.3.0'],
    version: '0.3.0',
    description:
      'Kubedoop commons operator. Provides shared CRDs and controllers used by the Kubedoop operator set (HDFS, ZooKeeper, etc.).',
    installScope: 'cluster',
    duplicateInstallable: false,
    iconText: 'CO',
    configurationFields: [],
  },
  {
    id: 'secret-operator',
    name: 'secret-operator',
    displayName: 'Secret Operator',
    category: 'Data Processing',
    packageType: 'operator',
    packageLabel: 'Operator',
    availableVersions: ['0.3.0'],
    version: '0.3.0',
    description:
      'Kubedoop secret operator. Provides a CSI driver for TLS/credential provisioning to Kubedoop workloads.',
    installScope: 'cluster',
    duplicateInstallable: false,
    iconText: 'SE',
    configurationFields: [],
  },
  {
    id: 'listener-operator',
    name: 'listener-operator',
    displayName: 'Listener Operator',
    category: 'Data Processing',
    packageType: 'operator',
    packageLabel: 'Operator',
    availableVersions: ['0.3.0'],
    version: '0.3.0',
    description:
      'Kubedoop listener operator. Provides a CSI driver and ListenerClass presets for exposing services (ClusterIP / NodePort / LoadBalancer).',
    installScope: 'cluster',
    duplicateInstallable: false,
    iconText: 'LO',
    configurationFields: [],
  },
  {
    id: 'zookeeper-operator',
    name: 'zookeeper-operator',
    displayName: 'ZooKeeper Operator',
    category: 'Data Processing',
    packageType: 'operator',
    packageLabel: 'Operator',
    availableVersions: ['0.3.0'],
    version: '0.3.0',
    description:
      'Kubedoop ZooKeeper operator. Manages ZookeeperCluster / ZookeeperZnode CRs used for HDFS NameNode HA coordination.',
    installScope: 'cluster',
    duplicateInstallable: false,
    iconText: 'ZO',
    configurationFields: [],
  },
  {
    id: 'hdfs-operator',
    name: 'hdfs-operator',
    displayName: 'HDFS Operator',
    category: 'Data Processing',
    packageType: 'operator',
    packageLabel: 'Operator',
    availableVersions: ['0.3.0'],
    version: '0.3.0',
    description:
      'Kubedoop HDFS operator. Manages HdfsCluster CRs (NameNode HA / JournalNode / DataNode). Headline operator of the HDFS umbrella set.',
    installScope: 'cluster',
    duplicateInstallable: false,
    iconText: 'HO',
    configurationFields: [],
  },
];

/* ============================================================
   Installed Apps Mock
   ============================================================ */

export const installedAppsMock: InstalledApp[] = [
  {
    id: 'release-cnpg-postgres',
    name: 'cnpg',
    displayName: 'CNPG',
    version: '1.29.0',
    namespace: 'default',
    status: 'Deployed',
    installedAt: '2026-03-11 15:10',
    lastDeployed: '2026-03-11 15:10',
    configurationValues: {
      instanceName: 'postgres',
      postgresqlImage: 'ghcr.io/cloudnative-pg/postgresql:17.6-system-trixie',
      imagePullPolicy: 'Always',
      instanceCount: 3,
      cpuRequest: '500m',
      cpuLimit: '1000m',
      memoryRequest: '1Gi',
      memoryLimit: '2Gi',
      primaryUpdateStrategy: 'unsupervised',
      primaryUpdateMethod: 'restart',
      dataStorageSize: 20,
      storageClass: 'standard',
      appDatabaseName: 'app',
      appDatabaseUsername: 'app',
      appDatabasePassword: '••••••••',
      enableSuperuserAccess: true,
      superuserPassword: '••••••••',
      enablePgBouncerPooler: true,
      poolerConnectionType: 'rw',
      poolerInstanceCount: 2,
      poolMode: 'transaction',
      enableClusterPodMonitor: false,
      enablePoolerPodMonitor: false,
    },
    valuesYaml: `instanceName: "postgres"
postgresqlImage: "ghcr.io/cloudnative-pg/postgresql:17.6-system-trixie"
imagePullPolicy: "Always"
instanceCount: 3
cpuRequest: "500m"
cpuLimit: "1000m"
memoryRequest: "1Gi"
memoryLimit: "2Gi"
primaryUpdateStrategy: "unsupervised"
primaryUpdateMethod: "restart"
dataStorageSize: 20
storageClass: "standard"
appDatabaseName: "app"
appDatabaseUsername: "app"
appDatabasePassword: ""
enableSuperuserAccess: true
superuserPassword: ""
enablePgBouncerPooler: true
poolerConnectionType: "rw"
poolerInstanceCount: 2
poolMode: "transaction"
enableClusterPodMonitor: false
enablePoolerPodMonitor: false
`,
    resources: [
      { kind: 'Cluster', name: 'postgres', namespace: 'default' },
      { kind: 'Service', name: 'postgres-rw', namespace: 'default' },
      { kind: 'Service', name: 'postgres-ro', namespace: 'default' },
      { kind: 'Pooler', name: 'postgres-pooler-rw', namespace: 'default' },
    ],
  },
  {
    id: 'release-valkey-cache',
    name: 'valkey',
    displayName: 'Valkey',
    version: 'v8.0.2',
    namespace: 'cache',
    status: 'Deployed',
    installedAt: '2026-03-12 09:30',
    lastDeployed: '2026-03-12 09:30',
    configurationValues: {},
    valuesYaml: `replicaCount: 1

service:
  type: ClusterIP
  port: 6379

resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
`,
    resources: [
      { kind: 'Deployment', name: 'valkey', namespace: 'cache' },
      { kind: 'Service', name: 'valkey', namespace: 'cache' },
    ],
  },
  {
    id: 'release-gitea-devtools',
    name: 'gitea',
    displayName: 'Gitea',
    version: '10.6.0',
    namespace: 'devtools',
    status: 'Deployed',
    installedAt: '2026-03-13 11:00',
    lastDeployed: '2026-03-13 11:00',
    configurationValues: {},
    valuesYaml: `gitea:
  admin:
    username: "gitea_admin"
    password: ""
    email: "admin@example.com"

persistence:
  enabled: true
  size: 10Gi
`,
    resources: [
      { kind: 'StatefulSet', name: 'gitea', namespace: 'devtools' },
      { kind: 'Service', name: 'gitea-http', namespace: 'devtools' },
      { kind: 'Service', name: 'gitea-ssh', namespace: 'devtools' },
    ],
  },
  {
    id: 'release-kafka-data',
    name: 'kafka',
    displayName: 'Kafka',
    version: '28.3.0',
    namespace: 'data',
    status: 'Pending',
    installedAt: '2026-03-14 14:00',
    lastDeployed: '2026-03-14 14:00',
    configurationValues: {},
    valuesYaml: `replicas: 3
storage:
  type: persistent-claim
  size: 10Gi
  class: standard
`,
    resources: [{ kind: 'Kafka', name: 'kafka', namespace: 'data' }],
  },
];

/* ============================================================
   Installed Operators Mock
   ============================================================ */

export const installedOperatorsMock: InstalledOperator[] = [
  {
    id: 'op-cnpg-operator-system',
    name: 'cnpg-operator',
    displayName: 'CNPG Operator',
    version: '1.29.0',
    status: 'Deployed',
    namespace: 'cnpg-system',
    installedAt: '2026-03-11 14:20',
    dependentApplicationCount: 1,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg',
    resources: [
      { kind: 'Deployment', name: 'cnpg-operator', namespace: 'cnpg-system' },
      { kind: 'ClusterRole', name: 'cnpg-operator' },
      { kind: 'CustomResourceDefinition', name: 'clusters.postgresql.cnpg.io' },
    ],
  },
  // ── Kubedoop HDFS operator set: 5종 중 4종 설치됨 / hdfs-operator 미설치 (부분 충족 4/5 데모) ──
  {
    id: 'op-commons-operator-system',
    name: 'commons-operator',
    displayName: 'Commons Operator',
    version: '0.3.0',
    status: 'Deployed',
    namespace: 'kubedoop-operators',
    installedAt: '2026-05-20 10:00',
    dependentApplicationCount: 0,
    resources: [{ kind: 'Deployment', name: 'commons-operator', namespace: 'kubedoop-operators' }],
  },
  {
    id: 'op-secret-operator-system',
    name: 'secret-operator',
    displayName: 'Secret Operator',
    version: '0.3.0',
    status: 'Deployed',
    namespace: 'kubedoop-operators',
    installedAt: '2026-05-20 10:01',
    dependentApplicationCount: 0,
    resources: [
      { kind: 'Deployment', name: 'secret-operator', namespace: 'kubedoop-operators' },
      { kind: 'DaemonSet', name: 'secret-operator-csi', namespace: 'kubedoop-operators' },
    ],
  },
  {
    id: 'op-listener-operator-system',
    name: 'listener-operator',
    displayName: 'Listener Operator',
    version: '0.3.0',
    status: 'Deployed',
    namespace: 'kubedoop-operators',
    installedAt: '2026-05-20 10:02',
    dependentApplicationCount: 0,
    resources: [
      { kind: 'Deployment', name: 'listener-operator', namespace: 'kubedoop-operators' },
      { kind: 'DaemonSet', name: 'listener-operator-csi', namespace: 'kubedoop-operators' },
    ],
  },
  {
    id: 'op-zookeeper-operator-system',
    name: 'zookeeper-operator',
    displayName: 'ZooKeeper Operator',
    version: '0.3.0',
    status: 'Deployed',
    namespace: 'kubedoop-operators',
    installedAt: '2026-05-20 10:03',
    dependentApplicationCount: 0,
    resources: [
      { kind: 'Deployment', name: 'zookeeper-operator', namespace: 'kubedoop-operators' },
      { kind: 'CustomResourceDefinition', name: 'zookeeperclusters.zookeeper.kubedoop.dev' },
    ],
  },
  // hdfs-operator 는 의도적으로 미설치 → HDFS Instance 설치 시 4/5 충족, 1개 누락
];

/** Operator 의존 App 목록 (operatorId → InstalledApp[]) */
export const dependentApplicationsByOperatorMock: Record<string, InstalledApp[]> = {
  'op-cnpg-operator-system': [installedAppsMock[0]], // cnpg (postgres instance)
};

export const clusterOptions = [{ value: 'cluster-1', label: 'clusterName (current)' }];

export const namespaceOptions = [
  { value: 'default', label: 'default' },
  { value: 'cache', label: 'cache' },
  { value: 'devtools', label: 'devtools' },
  { value: 'data', label: 'data' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'ai', label: 'ai' },
  { value: 'cnpg-system', label: 'cnpg-system' },
];

/* ============================================================
   Operator 의존성 해석 (App Catalog Install 게이팅)
   ============================================================ */

/** 해당 Operator chartName이 현재 클러스터에 설치되어 있는지 */
export function isOperatorInstalled(operatorChartName: string): boolean {
  return installedOperatorsMock.some((op) => op.name === operatorChartName);
}

/** App이 의존하는 Operator 1건의 충족 상태 */
export interface OperatorRequirement {
  /** Operator chartName (install 페이지 라우트 키) */
  chartName: string;
  /** 표시용 이름 */
  displayName: string;
  /** 카탈로그에 Operator 차트가 존재하는지 (redirect 가능 여부) */
  available: boolean;
  /** 설치 완료 여부 */
  installed: boolean;
}

/**
 * App의 선행 Operator 의존성을 각각의 설치 상태와 함께 반환한다.
 * 복수 의존성을 행 단위로 노출/리다이렉트하기 위한 기준 데이터.
 */
export function getOperatorRequirements(app: CatalogChart): OperatorRequirement[] {
  const names = app.requiredOperatorChartNames ?? [];
  return names.map((chartName) => {
    const operatorChart = catalogCharts.find((c) => c.name === chartName);
    return {
      chartName,
      displayName: operatorChart?.displayName ?? chartName,
      available: Boolean(operatorChart),
      installed: isOperatorInstalled(chartName),
    };
  });
}

/** App 설치 전 선행 Operator가 모두 충족되었는지 (미설치 의존성 0개) */
export function hasUnmetOperatorDependency(app: CatalogChart): boolean {
  return getOperatorRequirements(app).some((req) => !req.installed);
}
