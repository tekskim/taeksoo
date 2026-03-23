/**
 * Apps Catalog / Installed Apps 목 데이터
 *
 * v1.0 제공 앱 목록 (기능명세서 v1.0 범위, 정책서 부록 1):
 *   - PostgreSQL   (Database)
 *   - nginx        (Networking)
 *   - Kafka        (Data Processing)
 *   - Valkey       (Database)
 *   - Milvus       (Vector DB)
 *
 * Hadoop ecosystem은 제공 방식 미정으로 v1.0 제외
 * Edit Options 항목 구성은 미정 — 현재 목은 대표값 사용
 */
import type { CatalogChart, InstalledApp } from './appsTypes';

export const CATEGORIES = [
  'All',
  'Database',
  'Data Processing',
  'Networking',
  'Vector DB',
] as const;

const LOGO_URLS: Record<string, string> = {
  postgresql: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg',
  nginx: 'https://cdn.simpleicons.org/nginx',
  kafka: 'https://cdn.simpleicons.org/apachekafka',
  valkey: 'https://static.cdnlogo.com/logos/v/49/valkey.svg',
  milvus: 'https://api.iconify.design/logos:milvus-icon.svg',
};

/* ──────────────────────────────────────────────────────────────
   Catalog Charts — v1.0 제공 앱 5종
   각 앱의 Edit Options 항목 구성은 미정이므로 대표값 사용
   ────────────────────────────────────────────────────────────── */
export const catalogCharts: CatalogChart[] = [
  /* ── Database ── */
  {
    id: 'chart-postgresql',
    name: 'postgresql',
    allowMultiple: true,
    description:
      'PostgreSQL is a powerful, open source object-relational database system with a strong reputation for reliability, feature robustness, and performance.',
    version: '15.3.0',
    availableVersions: ['15.3.0', '15.2.0', '14.5.0', '13.7.0'],
    category: 'Database',
    logoUrl: LOGO_URLS.postgresql,
    chartInfo: {
      name: 'postgresql',
      version: '15.3.0',
      appVersion: '15.3.0',
      description:
        'Chart for PostgreSQL, an object-relational database management system (ORDBMS) with an emphasis on extensibility and on standards-compliance.',
    },
    requiredOptions: [
      { key: 'auth.postgresPassword', label: 'Admin Password', type: 'password', required: true },
      { key: 'auth.database', label: 'Database Name', type: 'string', required: true },
      {
        key: 'primary.persistence.storageClass',
        label: 'Storage Class',
        type: 'storageclass',
        required: false,
      },
      {
        key: 'primary.persistence.size',
        label: 'Storage Size',
        type: 'string',
        unit: 'GiB',
        required: false,
      },
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
`,
  },
  {
    id: 'chart-valkey',
    name: 'valkey',
    description:
      'Valkey is an open source, high-performance key/value datastore that supports a variety of workloads such as caching, message queues, and can act as a primary database.',
    version: '8.0.2',
    availableVersions: ['8.0.2', '8.0.1', '7.2.6'],
    category: 'Database',
    logoUrl: LOGO_URLS.valkey,
    chartInfo: {
      name: 'valkey',
      version: '8.0.2',
      appVersion: '8.0.2',
      description:
        'Valkey is an open-source, in-memory data structure store. It is a drop-in replacement for Redis OSS.',
    },
    requiredOptions: [
      { key: 'auth.password', label: 'Password', type: 'password', required: true },
      {
        key: 'primary.persistence.storageClass',
        label: 'Storage Class',
        type: 'storageclass',
        required: false,
      },
      {
        key: 'primary.persistence.size',
        label: 'Storage Size',
        type: 'string',
        unit: 'GiB',
        required: false,
      },
    ],
    defaultValuesYaml: `architecture: standalone

auth:
  enabled: true
  password: ""

primary:
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
`,
  },

  /* ── Data Processing ── */
  {
    id: 'chart-kafka',
    name: 'kafka',
    description:
      'Apache Kafka is an open-source distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.',
    version: '28.3.0',
    availableVersions: ['28.3.0', '28.0.0', '27.1.0', '26.8.0'],
    category: 'Data Processing',
    logoUrl: LOGO_URLS.kafka,
    chartInfo: {
      name: 'kafka',
      version: '28.3.0',
      appVersion: '3.7.0',
      description:
        'Apache Kafka is a distributed streaming platform designed to build real-time pipelines and can be used as a message broker or as a replacement for a log aggregation solution.',
    },
    requiredOptions: [
      { key: 'broker.replicaCount', label: 'Broker Replicas', type: 'int', required: true },
      {
        key: 'persistence.storageClass',
        label: 'Storage Class',
        type: 'storageclass',
        required: false,
      },
      {
        key: 'persistence.size',
        label: 'Storage Size',
        type: 'string',
        unit: 'GiB',
        required: false,
      },
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

  /* ── Networking ── */
  {
    id: 'chart-nginx',
    name: 'nginx',
    description:
      'NGINX Ingress Controller for Kubernetes — routes external HTTP/HTTPS traffic into cluster services using Ingress resources. Multiple instances are allowed per namespace.',
    allowMultiple: true,
    version: '4.10.0',
    availableVersions: ['4.10.0', '4.9.0', '4.8.0'],
    category: 'Networking',
    logoUrl: LOGO_URLS.nginx,
    chartInfo: {
      name: 'ingress-nginx',
      version: '4.10.0',
      appVersion: '1.10.0',
      description:
        'Ingress controller for Kubernetes using NGINX as a reverse proxy and load balancer.',
    },
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

  /* ── Vector DB ── */
  {
    id: 'chart-milvus',
    name: 'milvus',
    description:
      'Milvus is an open-source vector database built to power embedding similarity search and AI applications. It supports trillion-scale vector similarity search and is used for AI/ML workflows.',
    version: '4.2.7',
    availableVersions: ['4.2.7', '4.2.0', '4.1.0', '4.0.0'],
    category: 'Vector DB',
    logoUrl: LOGO_URLS.milvus,
    chartInfo: {
      name: 'milvus',
      version: '4.2.7',
      appVersion: '2.4.7',
      description:
        'Milvus is an open-source vector database designed for scalable similarity search, supporting high-dimensional vectors for AI/ML applications.',
    },
    requiredOptions: [
      { key: 'minio.auth.rootUser', label: 'MinIO Root User', type: 'string', required: true },
      {
        key: 'minio.auth.rootPassword',
        label: 'MinIO Root Password',
        type: 'password',
        required: true,
      },
      {
        key: 'minio.persistence.storageClass',
        label: 'Storage Class',
        type: 'storageclass',
        required: false,
      },
      {
        key: 'minio.persistence.size',
        label: 'Storage Size',
        type: 'string',
        unit: 'GiB',
        required: false,
      },
    ],
    defaultValuesYaml: `cluster:
  enabled: false

minio:
  enabled: true
  auth:
    rootUser: ""
    rootPassword: ""
  persistence:
    enabled: true
    size: 10Gi
    storageClass: ""

etcd:
  enabled: true
  replicaCount: 1

pulsar:
  enabled: false

resources:
  requests:
    cpu: "500m"
    memory: "1Gi"
  limits:
    cpu: "2"
    memory: "4Gi"
`,
  },
];

/* ──────────────────────────────────────────────────────────────
   Installed Apps 목 데이터 (정책서 4-1 ~ 4-3)
   - 앱 이름, 버전, 네임스페이스, 현재 상태
   - connectionInfo: 외부 엔드포인트, 내부 서비스 도메인, 포트
   ────────────────────────────────────────────────────────────── */
export const installedAppsMock: InstalledApp[] = [
  {
    id: 'release-postgresql-default',
    releaseName: 'postgresql-1',
    name: 'postgresql',
    status: 'Deployed',
    namespace: 'default',
    chart: 'bitnami/postgresql',
    version: '15.3.0',
    installedAt: '2026-03-11 14:20',
    lastDeployed: '2026-03-11 14:20',
    chartInfo: {
      name: 'postgresql',
      version: '15.3.0',
      appVersion: '15.3.0',
      description:
        'Chart for PostgreSQL, an object-relational database management system (ORDBMS) with an emphasis on extensibility and on standards-compliance.',
    },
    connectionInfo: {
      internalServiceDomain: 'postgresql.default.svc.cluster.local',
      port: 5432,
    },
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

  resources:
    requests:
      cpu: "250m"
      memory: "512Mi"
    limits:
      cpu: "1"
      memory: "2Gi"
`,
    configValues: {
      'auth.postgresPassword': 'change-me',
      'auth.database': 'appdb',
      'primary.persistence.storageClass': 'longhorn',
      'primary.persistence.size': '20',
    },
    resources: [
      { kind: 'StatefulSet', name: 'postgresql', namespace: 'default' },
      { kind: 'Service', name: 'postgresql', namespace: 'default' },
      { kind: 'Secret', name: 'postgresql', namespace: 'default' },
      { kind: 'PersistentVolumeClaim', name: 'data-postgresql-0', namespace: 'default' },
      { kind: 'ConfigMap', name: 'postgresql-configuration', namespace: 'default' },
    ],
  },
  {
    id: 'release-kafka-data',
    releaseName: 'kafka',
    name: 'kafka',
    status: 'Deployed',
    namespace: 'data',
    chart: 'bitnami/kafka',
    version: '28.3.0',
    installedAt: '2026-03-10 09:15',
    lastDeployed: '2026-03-10 09:15',
    chartInfo: {
      name: 'kafka',
      version: '28.3.0',
      appVersion: '3.7.0',
      description:
        'Apache Kafka is a distributed streaming platform designed to build real-time pipelines and can be used as a message broker or as a replacement for a log aggregation solution.',
    },
    connectionInfo: {
      internalServiceDomain: 'kafka.data.svc.cluster.local',
      port: 9092,
    },
    valuesYaml: `broker:
  replicaCount: 3

persistence:
  enabled: true
  storageClass: "longhorn"
  size: 8Gi

zookeeper:
  enabled: true
  replicaCount: 3
`,
    configValues: {
      'broker.replicaCount': '3',
      'persistence.storageClass': 'longhorn',
      'persistence.size': '8',
    },
    resources: [
      { kind: 'StatefulSet', name: 'kafka-broker', namespace: 'data' },
      { kind: 'Service', name: 'kafka', namespace: 'data' },
      { kind: 'PersistentVolumeClaim', name: 'data-kafka-broker-0', namespace: 'data' },
      { kind: 'StatefulSet', name: 'kafka-zookeeper', namespace: 'data' },
    ],
  },
  {
    id: 'release-valkey-cache',
    releaseName: 'valkey',
    name: 'valkey',
    status: 'Deployed',
    namespace: 'cache',
    chart: 'bitnami/valkey',
    version: '8.0.2',
    installedAt: '2026-03-09 17:55',
    lastDeployed: '2026-03-09 17:55',
    chartInfo: {
      name: 'valkey',
      version: '8.0.2',
      appVersion: '8.0.2',
      description:
        'Valkey is an open-source, in-memory data structure store. It is a drop-in replacement for Redis OSS.',
    },
    connectionInfo: {
      internalServiceDomain: 'valkey.cache.svc.cluster.local',
      port: 6379,
    },
    valuesYaml: `architecture: standalone

auth:
  enabled: true
  password: "change-me"

primary:
  persistence:
    enabled: true
    size: 8Gi
    storageClass: "longhorn"
`,
    configValues: {
      'auth.password': 'change-me',
      'primary.persistence.storageClass': 'longhorn',
      'primary.persistence.size': '8',
    },
    resources: [
      { kind: 'StatefulSet', name: 'valkey-primary', namespace: 'cache' },
      { kind: 'Service', name: 'valkey', namespace: 'cache' },
      { kind: 'PersistentVolumeClaim', name: 'data-valkey-primary-0', namespace: 'cache' },
    ],
  },
  {
    id: 'release-nginx-ingress',
    releaseName: 'nginx-1',
    name: 'nginx',
    status: 'Deployed',
    namespace: 'ingress-nginx',
    chart: 'ingress-nginx/ingress-nginx',
    version: '4.10.0',
    installedAt: '2026-03-08 11:00',
    lastDeployed: '2026-03-08 11:00',
    chartInfo: {
      name: 'ingress-nginx',
      version: '4.10.0',
      appVersion: '1.10.0',
      description:
        'Ingress controller for Kubernetes using NGINX as a reverse proxy and load balancer.',
    },
    connectionInfo: {
      externalEndpoint: 'https://ingress.example.com',
      port: 443,
    },
    valuesYaml: `controller:
  replicaCount: 2
  service:
    type: LoadBalancer
  metrics:
    enabled: true
`,
    resources: [
      { kind: 'Deployment', name: 'nginx-controller', namespace: 'ingress-nginx' },
      { kind: 'Service', name: 'nginx-controller', namespace: 'ingress-nginx' },
      { kind: 'ConfigMap', name: 'nginx-configuration', namespace: 'ingress-nginx' },
    ],
  },
  {
    id: 'release-milvus-ai',
    releaseName: 'milvus',
    name: 'milvus',
    status: 'Pending',
    namespace: 'ai',
    chart: 'milvus/milvus',
    version: '4.2.7',
    installedAt: '2026-03-12 09:00',
    lastDeployed: '2026-03-12 09:00',
    chartInfo: {
      name: 'milvus',
      version: '4.2.7',
      appVersion: '2.4.7',
      description:
        'Milvus is an open-source vector database designed for scalable similarity search, supporting high-dimensional vectors for AI/ML applications.',
    },
    valuesYaml: `cluster:
  enabled: false

minio:
  auth:
    rootUser: "admin"
    rootPassword: "change-me"
  persistence:
    enabled: true
    size: 10Gi
    storageClass: "longhorn"
`,
    configValues: {
      'minio.auth.rootUser': 'admin',
      'minio.auth.rootPassword': 'change-me',
      'minio.persistence.storageClass': 'longhorn',
      'minio.persistence.size': '10',
    },
    resources: [
      { kind: 'Deployment', name: 'milvus-standalone', namespace: 'ai' },
      { kind: 'Service', name: 'milvus', namespace: 'ai' },
    ],
  },
  {
    id: 'release-postgresql-ai',
    releaseName: 'postgresql-1',
    name: 'postgresql',
    status: 'Failed',
    namespace: 'ai',
    chart: 'bitnami/postgresql',
    version: '15.3.0',
    installedAt: '2026-03-12 10:30',
    lastDeployed: '2026-03-12 10:30',
    errorMessage:
      'PersistentVolumeClaim "data-postgresql-0" failed to bind: no matching StorageClass found.',
    chartInfo: {
      name: 'postgresql',
      version: '15.3.0',
      appVersion: '15.3.0',
      description:
        'Chart for PostgreSQL, an object-relational database management system (ORDBMS) with an emphasis on extensibility and on standards-compliance.',
    },
    valuesYaml: `auth:
  postgresPassword: "change-me"
  database: "aidb"

primary:
  persistence:
    enabled: true
    size: 50Gi
    storageClass: "fast-ssd"
`,
    configValues: {
      'auth.postgresPassword': 'change-me',
      'auth.database': 'aidb',
      'primary.persistence.storageClass': 'fast-ssd',
      'primary.persistence.size': '50',
    },
    resources: [],
  },
];

export const clusterOptions = [{ value: 'cluster-1', label: 'clusterName (current)' }];

export const namespaceOptions = [
  { value: 'default', label: 'default' },
  { value: 'data', label: 'data' },
  { value: 'cache', label: 'cache' },
  { value: 'ingress-nginx', label: 'ingress-nginx' },
  { value: 'ai', label: 'ai' },
  { value: 'apps', label: 'apps' },
];
