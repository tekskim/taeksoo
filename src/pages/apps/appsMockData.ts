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
    requiredOperatorChartName: 'cnpg-operator',
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

  /* ── Networking ── */
  {
    id: 'nginx',
    name: 'nginx',
    displayName: 'Nginx',
    category: 'Networking',
    packageType: 'application',
    packageLabel: 'Helm',
    availableVersions: ['4.10.0'],
    version: '4.10.0',
    description:
      'NGINX Ingress Controller for Kubernetes routes external HTTP/HTTPS traffic into cluster services using Ingress resources. Multiple instances are allowed per namespace.',
    installScope: 'namespace',
    duplicateInstallable: true,
    iconText: 'N',
    configurationFields: [],
    defaultValuesYaml: `controller:
  replicaCount: 2
  service:
    type: LoadBalancer
  resources:
    requests:
      cpu: "100m"
      memory: "90Mi"
    limits:
      cpu: "500m"
      memory: "256Mi"
`,
  },

  /* ── Data Processing ── */
  {
    id: 'kafka',
    name: 'kafka',
    displayName: 'Kafka',
    category: 'Data Processing',
    packageType: 'application',
    packageLabel: 'Operator-managed',
    availableVersions: ['28.3.0'],
    version: '28.3.0',
    description:
      'Apache Kafka is an open-source distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.',
    installScope: 'namespace',
    duplicateInstallable: false,
    iconText: 'K',
    configurationFields: [],
    defaultValuesYaml: `replicas: 3
storage:
  type: persistent-claim
  size: 10Gi
  class: standard
`,
  },
  {
    id: 'hadoop-ecosystem',
    name: 'hadoop-ecosystem',
    displayName: 'Hadoop ecosystem',
    category: 'Data Processing',
    packageType: 'application',
    packageLabel: 'Helm',
    availableVersions: ['[unknown]'],
    version: '[unknown]',
    description:
      'Hadoop ecosystem chart for large-scale data processing. Includes HDFS, YARN, and MapReduce components.',
    installScope: 'namespace',
    duplicateInstallable: true,
    iconText: 'H',
    configurationFields: [],
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
