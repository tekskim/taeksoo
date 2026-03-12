/**
 * Apps Catalog / Installed Apps 목 데이터
 * 정책서(Apps 정책서) 3-4 서비스별 Required Options 반영 — 1차 제공 서비스 목록
 */
import type { CatalogChart, InstalledApp } from './appsTypes';

export const CATEGORIES = [
  'All',
  'Storage',
  'Data Processing',
  'AI Dev',
  'Database',
  'Monitoring',
  'Networking',
] as const;

const LOGO_URLS: Record<string, string> = {
  minio: 'https://cdn.simpleicons.org/minio',
  spark: 'https://cdn.simpleicons.org/apachespark',
  kafka: 'https://cdn.simpleicons.org/apachekafka',
  airflow: 'https://cdn.simpleicons.org/apacheairflow',
  jupyterhub: 'https://cdn.simpleicons.org/jupyter',
  mlflow: 'https://cdn.simpleicons.org/mlflow',
  postgresql: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg',
  redis: 'https://cdn.simpleicons.org/redis',
  prometheus: 'https://cdn.simpleicons.org/prometheus',
  grafana: 'https://cdn.simpleicons.org/grafana',
  loki: 'https://cdn.simpleicons.org/grafana',
  'nginx-ingress': 'https://cdn.simpleicons.org/nginx',
};

export const catalogCharts: CatalogChart[] = [
  /* ── Storage ── */
  {
    id: 'chart-minio',
    name: 'minio',
    description: 'S3-compatible object storage. Core storage for models and datasets.',
    version: '14.7.0',
    availableVersions: ['14.7.0', '14.5.0', '14.0.0', '13.8.0'],
    category: 'Storage',
    logoUrl: LOGO_URLS.minio,
    requiredOptions: [
      { key: 'auth.rootUser', label: 'Root User', type: 'string' },
      { key: 'auth.rootPassword', label: 'Root Password', type: 'password' },
      { key: 'persistence.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'persistence.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `auth:
  rootUser: ""
  rootPassword: ""

persistence:
  enabled: true
  storageClass: ""
  size: 100Gi

resources:
  requests:
    cpu: "250m"
    memory: "512Mi"
  limits:
    cpu: "1"
    memory: "2Gi"

ingress:
  enabled: false
`,
  },

  /* ── Data Processing ── */
  {
    id: 'chart-spark',
    name: 'spark',
    description: 'Apache Spark cluster for large-scale data processing. Runs on top of S3-compatible storage.',
    version: '9.2.0',
    availableVersions: ['9.2.0', '9.0.0', '8.7.0', '8.5.0'],
    category: 'Data Processing',
    logoUrl: LOGO_URLS.spark,
    requiredOptions: [
      { key: 'worker.replicaCount', label: 'Worker Replicas', type: 'int' },
      { key: 'worker.memoryLimit', label: 'Worker Memory', type: 'string', unit: 'GiB' },
      { key: 'worker.coreLimit', label: 'Worker CPU', type: 'string' },
    ],
    defaultValuesYaml: `master:
  resources:
    requests:
      cpu: "250m"
      memory: "512Mi"
    limits:
      cpu: "1"
      memory: "1Gi"

worker:
  replicaCount: 2
  memoryLimit: "4Gi"
  coreLimit: "2"
  resources:
    requests:
      cpu: "250m"
      memory: "512Mi"
    limits:
      cpu: "2"
      memory: "4Gi"
`,
  },
  {
    id: 'chart-kafka',
    name: 'kafka',
    description: 'Apache Kafka streaming platform for data ingestion pipelines.',
    version: '28.3.0',
    availableVersions: ['28.3.0', '28.0.0', '27.1.0', '26.8.0'],
    category: 'Data Processing',
    logoUrl: LOGO_URLS.kafka,
    requiredOptions: [
      { key: 'broker.replicaCount', label: 'Broker Replicas', type: 'int' },
      { key: 'persistence.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'persistence.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `broker:
  replicaCount: 3

persistence:
  enabled: true
  storageClass: ""
  size: 8Gi

resources:
  requests:
    cpu: "250m"
    memory: "512Mi"
  limits:
    cpu: "1"
    memory: "2Gi"

zookeeper:
  enabled: true
  replicaCount: 3
`,
  },
  {
    id: 'chart-airflow',
    name: 'airflow',
    description: 'Apache Airflow workflow scheduler for AI and data pipelines.',
    version: '18.4.0',
    availableVersions: ['18.4.0', '18.0.0', '17.2.0', '16.5.0'],
    category: 'Data Processing',
    logoUrl: LOGO_URLS.airflow,
    requiredOptions: [
      { key: 'auth.username', label: 'Admin Username', type: 'string' },
      { key: 'auth.password', label: 'Admin Password', type: 'password' },
      { key: 'dags.persistence.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'dags.persistence.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `auth:
  username: ""
  password: ""

dags:
  persistence:
    enabled: true
    storageClass: ""
    size: 5Gi

executor: KubernetesExecutor

web:
  resources:
    requests:
      cpu: "200m"
      memory: "512Mi"

scheduler:
  resources:
    requests:
      cpu: "200m"
      memory: "512Mi"
`,
  },

  /* ── AI Dev ── */
  {
    id: 'chart-jupyterhub',
    name: 'jupyterhub',
    description: 'Shared notebook environment for AI developers. Multi-user JupyterHub deployment.',
    version: '3.3.0',
    availableVersions: ['3.3.0', '3.2.0', '3.1.0', '3.0.0'],
    category: 'AI Dev',
    logoUrl: LOGO_URLS.jupyterhub,
    requiredOptions: [
      { key: 'hub.config.Authenticator.admin_users', label: 'Admin User', type: 'string' },
      { key: 'singleuser.storage.dynamic.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'singleuser.storage.capacity', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `hub:
  config:
    Authenticator:
      admin_users: []
    JupyterHub:
      authenticator_class: dummy

singleuser:
  storage:
    dynamic:
      storageClass: ""
    capacity: "10Gi"
  resources:
    limits:
      cpu: "2"
      memory: "4Gi"
    requests:
      cpu: "0.1"
      memory: "512Mi"

proxy:
  service:
    type: ClusterIP
`,
  },
  {
    id: 'chart-mlflow',
    name: 'mlflow',
    description: 'MLflow experiment tracking and model registry for AI/ML workflows.',
    version: '1.4.0',
    availableVersions: ['1.4.0', '1.3.0', '1.2.0', '1.0.0'],
    category: 'AI Dev',
    logoUrl: LOGO_URLS.mlflow,
    requiredOptions: [
      { key: 'auth.username', label: 'Admin Username', type: 'string' },
      { key: 'auth.password', label: 'Admin Password', type: 'password' },
      { key: 'tracking.persistence.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'tracking.persistence.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `auth:
  username: ""
  password: ""

tracking:
  persistence:
    enabled: true
    storageClass: ""
    size: 10Gi

  resources:
    requests:
      cpu: "250m"
      memory: "512Mi"
    limits:
      cpu: "1"
      memory: "2Gi"

postgresql:
  enabled: true
`,
  },

  /* ── Database ── */
  {
    id: 'chart-postgresql',
    name: 'postgresql',
    description: 'PostgreSQL relational database. Used for MLflow metadata and general-purpose RDB.',
    version: '15.3.0',
    availableVersions: ['15.3.0', '15.2.0', '14.5.0', '13.7.0'],
    category: 'Database',
    logoUrl: LOGO_URLS.postgresql,
    requiredOptions: [
      { key: 'auth.postgresPassword', label: 'Admin Password', type: 'password' },
      { key: 'auth.database', label: 'Database Name', type: 'string' },
      { key: 'primary.persistence.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'primary.persistence.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `auth:
  postgresPassword: ""
  username: "appuser"
  password: ""
  database: ""

primary:
  persistence:
    enabled: true
    size: 8Gi
    storageClass: ""

  resources:
    requests:
      cpu: "250m"
      memory: "512Mi"
    limits:
      cpu: "1"
      memory: "2Gi"

metrics:
  enabled: true
  serviceMonitor:
    enabled: true
`,
  },
  {
    id: 'chart-redis',
    name: 'redis',
    description: 'Redis in-memory data store for cache, queue, and session management.',
    version: '18.4.0',
    availableVersions: ['18.4.0', '18.0.0', '17.3.0'],
    category: 'Database',
    logoUrl: LOGO_URLS.redis,
    requiredOptions: [
      { key: 'auth.password', label: 'Password', type: 'password' },
      { key: 'master.persistence.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'master.persistence.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `architecture: replication

auth:
  enabled: true
  password: ""

master:
  persistence:
    enabled: true
    size: 8Gi
    storageClass: ""
  resources:
    requests:
      cpu: "100m"
      memory: "256Mi"
    limits:
      cpu: "500m"
      memory: "1Gi"

replica:
  replicaCount: 2
  persistence:
    enabled: true
    size: 8Gi
`,
  },

  /* ── Monitoring ── */
  {
    id: 'chart-prometheus',
    name: 'prometheus',
    description: 'Prometheus monitoring and alerting, including GPU metrics.',
    version: '25.8.0',
    availableVersions: ['25.8.0', '25.0.0', '24.3.0'],
    category: 'Monitoring',
    logoUrl: LOGO_URLS.prometheus,
    requiredOptions: [
      { key: 'server.retention', label: 'Data Retention Period', type: 'string', unit: 'd' },
      { key: 'server.persistentVolume.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'server.persistentVolume.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `server:
  retention: ""
  persistentVolume:
    enabled: true
    storageClass: ""
    size: 8Gi
  resources:
    requests:
      cpu: "500m"
      memory: "1Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

alertmanager:
  enabled: true

grafana:
  enabled: false
`,
  },
  {
    id: 'chart-grafana',
    name: 'grafana',
    description: 'Grafana dashboards and visualization for cluster monitoring.',
    version: '7.3.0',
    availableVersions: ['7.3.0', '7.2.0', '7.0.0', '6.58.0'],
    category: 'Monitoring',
    logoUrl: LOGO_URLS.grafana,
    requiredOptions: [
      { key: 'admin.password', label: 'Admin Password', type: 'password' },
      { key: 'persistence.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'persistence.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `adminUser: admin
adminPassword: ""

service:
  type: ClusterIP
  port: 80

persistence:
  enabled: true
  size: 10Gi
  storageClass: ""

resources:
  requests:
    cpu: "200m"
    memory: "256Mi"
  limits:
    cpu: "1"
    memory: "1Gi"
`,
  },
  {
    id: 'chart-loki',
    name: 'loki',
    description: 'Lightweight log aggregation by Grafana. Operated alongside Prometheus.',
    version: '6.6.0',
    availableVersions: ['6.6.0', '6.4.0', '6.2.0', '5.47.0'],
    category: 'Monitoring',
    logoUrl: LOGO_URLS.loki,
    requiredOptions: [
      { key: 'loki.storage.storageClass', label: 'Storage Class', type: 'storageclass' },
      { key: 'loki.persistence.size', label: 'Storage Size', type: 'string', unit: 'GiB' },
    ],
    defaultValuesYaml: `loki:
  auth_enabled: false
  storage:
    storageClass: ""
    bucketNames:
      chunks: loki-chunks
      ruler: loki-ruler
      admin: loki-admin
  persistence:
    enabled: true
    size: 10Gi

promtail:
  enabled: true

grafana:
  enabled: false
`,
  },

  /* ── Networking ── */
  {
    id: 'chart-nginx-ingress',
    name: 'nginx-ingress',
    description: 'NGINX Ingress Controller for external service exposure.',
    version: '4.10.0',
    availableVersions: ['4.10.0', '4.9.0', '4.8.0'],
    category: 'Networking',
    logoUrl: LOGO_URLS['nginx-ingress'],
    requiredOptions: [],
    defaultValuesYaml: `controller:
  replicaCount: 2
  resources:
    requests:
      cpu: "100m"
      memory: "90Mi"
    limits:
      cpu: "500m"
      memory: "256Mi"

  service:
    type: LoadBalancer

  metrics:
    enabled: true
`,
  },
];

export const installedAppsMock: InstalledApp[] = [
  {
    id: 'release-1',
    name: 'postgresql',
    status: 'Deployed',
    namespace: 'data',
    chart: 'bitnami/postgresql',
    version: '15.3.0',
    installedAt: '2026-03-11 14:20',
    lastDeployed: '2026-03-11 14:20',
    valuesYaml: `auth:
  postgresPassword: "change-me"
  username: "appuser"
  password: "change-me"
  database: "appdb"

primary:
  persistence:
    enabled: true
    size: 20Gi
    storageClass: "longhorn"

  service:
    type: ClusterIP
    ports:
      postgresql: 5432

  resources:
    requests:
      cpu: "250m"
      memory: "512Mi"
    limits:
      cpu: "1"
      memory: "2Gi"

metrics:
  enabled: true
  serviceMonitor:
    enabled: true
`,
    resources: [
      { kind: 'StatefulSet', name: 'postgresql', namespace: 'data' },
      { kind: 'Service', name: 'postgresql', namespace: 'data' },
      { kind: 'Secret', name: 'postgresql', namespace: 'data' },
      { kind: 'PersistentVolumeClaim', name: 'data-postgresql-0', namespace: 'data' },
      { kind: 'ConfigMap', name: 'postgresql-configuration', namespace: 'data' },
    ],
  },
  {
    id: 'release-2',
    name: 'prometheus',
    status: 'Deployed',
    namespace: 'monitoring',
    chart: 'prometheus-community/prometheus',
    version: '25.8.0',
    installedAt: '2026-03-10 09:15',
    lastDeployed: '2026-03-10 09:15',
    valuesYaml: `server:
  retention: "15d"
  persistentVolume:
    enabled: true
    storageClass: "longhorn"
    size: 30Gi
  resources:
    requests:
      cpu: "500m"
      memory: "1Gi"
    limits:
      cpu: "2"
      memory: "4Gi"

alertmanager:
  enabled: true

grafana:
  enabled: false
`,
    resources: [
      { kind: 'Deployment', name: 'prometheus-server', namespace: 'monitoring' },
      { kind: 'Deployment', name: 'alertmanager', namespace: 'monitoring' },
      { kind: 'Service', name: 'prometheus-server', namespace: 'monitoring' },
      { kind: 'PersistentVolumeClaim', name: 'prometheus-server', namespace: 'monitoring' },
    ],
  },
  {
    id: 'release-3',
    name: 'grafana',
    status: 'Deployed',
    namespace: 'monitoring',
    chart: 'grafana/grafana',
    version: '7.3.0',
    installedAt: '2026-03-11 08:40',
    lastDeployed: '2026-03-11 08:40',
    valuesYaml: `adminUser: admin
adminPassword: "change-me"

service:
  type: ClusterIP
  port: 80

persistence:
  enabled: true
  size: 10Gi
  storageClass: "longhorn"

resources:
  requests:
    cpu: "200m"
    memory: "256Mi"
  limits:
    cpu: "1"
    memory: "1Gi"

datasources:
  datasources.yaml:
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        access: proxy
        url: http://prometheus-server.monitoring.svc.cluster.local
        isDefault: true
      - name: Loki
        type: loki
        access: proxy
        url: http://loki.monitoring.svc.cluster.local:3100
`,
    resources: [
      { kind: 'Deployment', name: 'grafana', namespace: 'monitoring' },
      { kind: 'Service', name: 'grafana', namespace: 'monitoring' },
      { kind: 'PersistentVolumeClaim', name: 'grafana', namespace: 'monitoring' },
    ],
  },
  {
    id: 'release-4',
    name: 'redis',
    status: 'Deployed',
    namespace: 'cache',
    chart: 'bitnami/redis',
    version: '18.4.0',
    installedAt: '2026-03-09 17:55',
    lastDeployed: '2026-03-09 17:55',
    valuesYaml: `architecture: replication

auth:
  enabled: true
  password: "change-me"

master:
  persistence:
    enabled: true
    size: 8Gi
    storageClass: "longhorn"
  resources:
    requests:
      cpu: "100m"
      memory: "256Mi"
    limits:
      cpu: "500m"
      memory: "1Gi"

replica:
  replicaCount: 2
  persistence:
    enabled: true
    size: 8Gi
    storageClass: "longhorn"
`,
    resources: [
      { kind: 'StatefulSet', name: 'redis-master', namespace: 'cache' },
      { kind: 'StatefulSet', name: 'redis-replicas', namespace: 'cache' },
      { kind: 'Service', name: 'redis-master', namespace: 'cache' },
      { kind: 'Service', name: 'redis-replicas', namespace: 'cache' },
    ],
  },
  {
    id: 'release-5',
    name: 'minio',
    status: 'Deployed',
    namespace: 'storage',
    chart: 'bitnami/minio',
    version: '14.7.0',
    installedAt: '2026-03-08 11:00',
    lastDeployed: '2026-03-08 11:00',
    valuesYaml: `auth:
  rootUser: "admin"
  rootPassword: "change-me"

persistence:
  enabled: true
  storageClass: "longhorn"
  size: 200Gi

resources:
  requests:
    cpu: "250m"
    memory: "512Mi"
  limits:
    cpu: "1"
    memory: "2Gi"

ingress:
  enabled: false
`,
    resources: [
      { kind: 'Deployment', name: 'minio', namespace: 'storage' },
      { kind: 'Service', name: 'minio', namespace: 'storage' },
      { kind: 'PersistentVolumeClaim', name: 'minio', namespace: 'storage' },
    ],
  },
  {
    id: 'release-6',
    name: 'loki',
    status: 'Pending',
    namespace: 'monitoring',
    chart: 'grafana/loki',
    version: '6.6.0',
    installedAt: '2026-03-12 09:00',
    lastDeployed: '2026-03-12 09:00',
    valuesYaml: `loki:
  auth_enabled: false
  storage:
    storageClass: "longhorn"
  persistence:
    enabled: true
    size: 10Gi

promtail:
  enabled: true

grafana:
  enabled: false
`,
    resources: [
      { kind: 'StatefulSet', name: 'loki', namespace: 'monitoring' },
      { kind: 'Deployment', name: 'promtail', namespace: 'monitoring' },
      { kind: 'Service', name: 'loki', namespace: 'monitoring' },
    ],
  },
];

export const clusterOptions = [
  { value: 'cluster-1', label: 'clusterName (current)' },
];

export const namespaceOptions = [
  { value: 'default', label: 'default' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'storage', label: 'storage' },
  { value: 'cache', label: 'cache' },
  { value: 'data', label: 'data' },
  { value: 'apps', label: 'apps' },
  { value: 'ai', label: 'ai' },
];
