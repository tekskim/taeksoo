/**
 * Apps Catalog / Installed Apps 목 데이터
 *
 * v1.0 제공 앱 목록 (정책서 부록 1 + 부록 2 Edit Options 반영):
 *   - Valkey            (Database)      단일 앱
 *   - CNPG Operator     (Database)      Operator 기반 1단계
 *   - CNPG Instance     (Database)      Operator 기반 2단계 (dependsOn: cnpg-operator)
 *   - Gitea             (Developer Tools) 단일 앱 (내장 PostgreSQL-HA + Valkey-Cluster)
 *   - nginx             (Networking)    chart 미작성 — 대표값 사용
 *   - Kafka             (Data Processing) chart 미작성 — 대표값 사용
 *   - Milvus            (Vector DB)     chart 미작성 — 대표값 사용
 *
 * Ref: https://www.notion.so/thakicloud/Edit-Options-33c9eddc34e68197a861e8047c9f05ae
 */
import type { CatalogChart, InstalledApp } from './appsTypes';

export const CATEGORIES = [
  'All',
  'Database',
  'Developer Tools',
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
  gitea: 'https://cdn.simpleicons.org/gitea',
};

const STORAGECLASS_FIELD_OPTIONS = [
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'longhorn', label: 'longhorn' },
];

const IMAGE_PULL_POLICY_OPTIONS = [
  { value: 'IfNotPresent', label: 'IfNotPresent' },
  { value: 'Always', label: 'Always' },
  { value: 'Never', label: 'Never' },
];

/* ──────────────────────────────────────────────────────────────
   Catalog Charts — 정책서 부록 2 Edit Options 완전 반영
   Ref: https://www.notion.so/thakicloud/Edit-Options-33c9eddc34e68197a861e8047c9f05ae
   ────────────────────────────────────────────────────────────── */
export const catalogCharts: CatalogChart[] = [
  /* ── Database: Valkey (§2) ── */
  {
    id: 'chart-valkey',
    name: 'valkey',
    installType: '단일 앱',
    description:
      'Valkey is an open source, high-performance key/value datastore. Supports standalone and Master-Replica HA mode. Drop-in replacement for Redis OSS.',
    version: '8.0.2',
    availableVersions: ['8.0.2', '8.0.1', '7.2.6'],
    category: 'Database',
    logoUrl: LOGO_URLS.valkey,
    chartInfo: {
      name: 'valkey',
      version: '8.0.2',
      appVersion: '8.0.2',
      description:
        'Open-source, in-memory data structure store. Drop-in replacement for Redis OSS.',
    },
    tierPresets: {
      Small: {
        values: {
          RESOURCE_REQUEST_CPU: '100m',
          RESOURCE_LIMIT_CPU: '200m',
          RESOURCE_REQUEST_MEMORY: '128Mi',
          RESOURCE_LIMIT_MEMORY: '256Mi',
          STORAGE_SIZE: '1Gi',
        },
      },
      Medium: {
        values: {
          RESOURCE_REQUEST_CPU: '250m',
          RESOURCE_LIMIT_CPU: '500m',
          RESOURCE_REQUEST_MEMORY: '256Mi',
          RESOURCE_LIMIT_MEMORY: '512Mi',
          STORAGE_SIZE: '5Gi',
        },
      },
      Large: {
        values: {
          RESOURCE_REQUEST_CPU: '500m',
          RESOURCE_LIMIT_CPU: '1000m',
          RESOURCE_REQUEST_MEMORY: '512Mi',
          RESOURCE_LIMIT_MEMORY: '1Gi',
          STORAGE_SIZE: '10Gi',
        },
      },
    },
    requiredOptions: [
      {
        key: 'FULLNAME_OVERRIDE',
        label: '인스턴스 이름',
        type: 'string',
        required: true,
        defaultValue: 'valkey',
        description: 'K8s 리소스 전체 이름 (Namespace 내 고유)',
      },
      {
        key: 'IMAGE_REGISTRY',
        label: '컨테이너 레지스트리',
        type: 'string',
        required: false,
        defaultValue: 'docker.io',
        description: 'Private registry 사용 시 변경',
      },
      {
        key: '_tier',
        label: '리소스 티어',
        type: 'resource-tier',
        required: true,
        defaultValue: 'Medium',
        group: '리소스',
      },
      {
        key: 'RESOURCE_REQUEST_CPU',
        label: 'CPU Request',
        type: 'string',
        required: true,
        defaultValue: '250m',
        group: '리소스',
      },
      {
        key: 'RESOURCE_LIMIT_CPU',
        label: 'CPU Limit',
        type: 'string',
        required: true,
        defaultValue: '500m',
        group: '리소스',
      },
      {
        key: 'RESOURCE_REQUEST_MEMORY',
        label: 'Memory Request',
        type: 'string',
        required: true,
        defaultValue: '256Mi',
        group: '리소스',
      },
      {
        key: 'RESOURCE_LIMIT_MEMORY',
        label: 'Memory Limit',
        type: 'string',
        required: true,
        defaultValue: '512Mi',
        group: '리소스',
      },
      {
        key: 'AUTH_DEFAULT_PASSWORD',
        label: '인증 비밀번호',
        type: 'password',
        required: true,
        description: 'default 사용자 ACL 비밀번호. @, #, $ 등 특수문자 회피 권장',
        group: '인증',
      },
      {
        key: 'STORAGE_SIZE',
        label: '스토리지 크기',
        type: 'string',
        required: true,
        defaultValue: '5Gi',
        description: 'Standalone 모드 PVC 크기 (예: 5Gi)',
        group: '스토리지',
      },
      {
        key: 'STORAGE_CLASS',
        label: 'StorageClass',
        type: 'select',
        required: true,
        options: STORAGECLASS_FIELD_OPTIONS,
        description: 'kubectl get sc 결과 목록',
        group: '스토리지',
      },
      {
        key: 'REPLICA_ENABLED',
        label: '복제 모드 (HA)',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'true: Master-Replica HA 모드 활성화',
        group: 'HA 복제',
      },
      {
        key: 'REPLICA_COUNT',
        label: '복제본 수',
        type: 'int',
        required: false,
        defaultValue: '2',
        description: 'Master 제외 Replica 수',
        group: 'HA 복제',
        showWhen: { key: 'REPLICA_ENABLED', value: 'true' },
      },
      {
        key: 'REPLICA_STORAGE_SIZE',
        label: '복제본 스토리지 크기',
        type: 'string',
        required: false,
        description: '각 Replica PVC 크기. STORAGE_SIZE와 동일 권장',
        group: 'HA 복제',
        showWhen: { key: 'REPLICA_ENABLED', value: 'true' },
      },
      {
        key: 'REPLICA_STORAGE_CLASS',
        label: '복제본 StorageClass',
        type: 'select',
        required: false,
        options: STORAGECLASS_FIELD_OPTIONS,
        description: 'Replica PVC StorageClass. STORAGE_CLASS와 동일 권장',
        group: 'HA 복제',
        showWhen: { key: 'REPLICA_ENABLED', value: 'true' },
      },
    ],
    defaultValuesYaml: `fullnameOverride: "\${FULLNAME_OVERRIDE}"
image:
  registry: "\${IMAGE_REGISTRY}"

resources:
  requests:
    cpu: "\${RESOURCE_REQUEST_CPU}"
    memory: "\${RESOURCE_REQUEST_MEMORY}"
  limits:
    cpu: "\${RESOURCE_LIMIT_CPU}"
    memory: "\${RESOURCE_LIMIT_MEMORY}"

auth:
  enabled: true
  password: "\${AUTH_DEFAULT_PASSWORD}"

primary:
  persistence:
    size: "\${STORAGE_SIZE}"
    storageClass: "\${STORAGE_CLASS}"

replica:
  enabled: \${REPLICA_ENABLED}
  replicaCount: \${REPLICA_COUNT}
  persistence:
    size: "\${REPLICA_STORAGE_SIZE}"
    storageClass: "\${REPLICA_STORAGE_CLASS}"
`,
  },

  /* ── Database: CNPG Operator (§3-A) ── */
  {
    id: 'chart-cnpg-operator',
    name: 'cnpg-operator',
    installType: 'Operator 기반 (1단계)',
    description:
      'CloudNativePG Operator for Kubernetes. Manages PostgreSQL clusters using the CNPG CRD. Install this first before creating PostgreSQL instances.',
    version: '1.29.0',
    availableVersions: ['1.29.0', '1.28.0', '1.27.0'],
    category: 'Database',
    logoUrl: LOGO_URLS.postgresql,
    chartInfo: {
      name: 'cnpg-operator',
      version: '1.29.0',
      appVersion: '1.29.0',
      description:
        'CloudNativePG Operator — manages PostgreSQL clusters as Kubernetes-native resources.',
    },
    tierPresets: {
      Small: {
        values: {
          RESOURCE_REQUEST_CPU: '100m',
          RESOURCE_LIMIT_CPU: '250m',
          RESOURCE_REQUEST_MEMORY: '128Mi',
          RESOURCE_LIMIT_MEMORY: '256Mi',
          MAX_CONCURRENT_RECONCILES: '5',
        },
      },
      Medium: {
        values: {
          RESOURCE_REQUEST_CPU: '200m',
          RESOURCE_LIMIT_CPU: '500m',
          RESOURCE_REQUEST_MEMORY: '256Mi',
          RESOURCE_LIMIT_MEMORY: '512Mi',
          MAX_CONCURRENT_RECONCILES: '10',
        },
      },
      Large: {
        values: {
          RESOURCE_REQUEST_CPU: '500m',
          RESOURCE_LIMIT_CPU: '1000m',
          RESOURCE_REQUEST_MEMORY: '512Mi',
          RESOURCE_LIMIT_MEMORY: '1Gi',
          MAX_CONCURRENT_RECONCILES: '20',
        },
      },
    },
    requiredOptions: [
      {
        key: 'FULLNAME_OVERRIDE',
        label: '인스턴스 이름',
        type: 'string',
        required: true,
        defaultValue: 'cnpg-operator',
        description: 'Operator K8s 리소스 이름',
      },
      {
        key: 'IMAGE_REPOSITORY',
        label: 'Operator 이미지 저장소',
        type: 'string',
        required: true,
        defaultValue: 'ghcr.io/cloudnative-pg/cloudnative-pg',
        description: 'Private registry 시 변경',
      },
      {
        key: 'IMAGE_TAG',
        label: 'Operator 이미지 태그',
        type: 'string',
        required: true,
        defaultValue: '1.29.0',
        description: 'Operator 버전. 고정 권장',
      },
      {
        key: 'IMAGE_PULL_POLICY',
        label: '이미지 Pull Policy',
        type: 'select',
        required: true,
        defaultValue: 'IfNotPresent',
        options: IMAGE_PULL_POLICY_OPTIONS,
      },
      {
        key: 'CRDS_CREATE',
        label: 'CRD 생성 여부',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: '첫 설치 시 true. 기존 CRD 있으면 false',
      },
      {
        key: 'CLUSTER_WIDE',
        label: '클러스터 전체 감시',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'false: 설치 Namespace만 감시',
      },
      {
        key: '_tier',
        label: '리소스 티어',
        type: 'resource-tier',
        required: true,
        defaultValue: 'Medium',
        group: '리소스',
      },
      {
        key: 'MAX_CONCURRENT_RECONCILES',
        label: '동시 Reconcile 수',
        type: 'int',
        required: true,
        defaultValue: '10',
        description: '클러스터 규모에 따라 조정',
        group: '리소스',
      },
      {
        key: 'RESOURCE_REQUEST_CPU',
        label: 'CPU Request',
        type: 'string',
        required: true,
        defaultValue: '200m',
        group: '리소스',
      },
      {
        key: 'RESOURCE_LIMIT_CPU',
        label: 'CPU Limit',
        type: 'string',
        required: true,
        defaultValue: '500m',
        group: '리소스',
      },
      {
        key: 'RESOURCE_REQUEST_MEMORY',
        label: 'Memory Request',
        type: 'string',
        required: true,
        defaultValue: '256Mi',
        group: '리소스',
      },
      {
        key: 'RESOURCE_LIMIT_MEMORY',
        label: 'Memory Limit',
        type: 'string',
        required: true,
        defaultValue: '512Mi',
        group: '리소스',
      },
      {
        key: 'PODMONITOR_ENABLED',
        label: 'PodMonitor 생성',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Prometheus Operator CRD 사전 설치 필요',
        group: '모니터링',
      },
      {
        key: 'GRAFANA_DASHBOARD_CREATE',
        label: 'Grafana Dashboard 생성',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Grafana sidecar 별도 설정 필요',
        group: '모니터링',
      },
    ],
    defaultValuesYaml: `fullnameOverride: "\${FULLNAME_OVERRIDE}"
image:
  repository: "\${IMAGE_REPOSITORY}"
  tag: "\${IMAGE_TAG}"
  pullPolicy: "\${IMAGE_PULL_POLICY}"

crds:
  create: \${CRDS_CREATE}

config:
  clusterWide: \${CLUSTER_WIDE}
  maxConcurrentReconciles: \${MAX_CONCURRENT_RECONCILES}

resources:
  requests:
    cpu: "\${RESOURCE_REQUEST_CPU}"
    memory: "\${RESOURCE_REQUEST_MEMORY}"
  limits:
    cpu: "\${RESOURCE_LIMIT_CPU}"
    memory: "\${RESOURCE_LIMIT_MEMORY}"

monitoring:
  podMonitorEnabled: \${PODMONITOR_ENABLED}
  grafanaDashboard:
    create: \${GRAFANA_DASHBOARD_CREATE}
`,
  },

  /* ── Database: CNPG Instance (§3-B) ── */
  {
    id: 'chart-cnpg-instance',
    name: 'cnpg-instance',
    installType: 'Operator 기반 (2단계)',
    dependsOn: 'cnpg-operator',
    allowMultiple: false,
    description:
      'PostgreSQL cluster instance managed by CloudNativePG Operator. Requires CNPG Operator to be installed first. Supports HA, PgBouncer pooling, and automated backups.',
    version: '1.29.0',
    availableVersions: ['1.29.0', '1.28.0', '1.27.0'],
    category: 'Database',
    logoUrl: LOGO_URLS.postgresql,
    chartInfo: {
      name: 'cnpg-instance',
      version: '1.29.0',
      appVersion: '17.6',
      description: 'PostgreSQL cluster instance (CNPG CRD). Requires CNPG Operator.',
    },
    tierPresets: {
      Small: {
        values: {
          INSTANCE_COUNT: '1',
          RESOURCE_REQUEST_CPU: '250m',
          RESOURCE_LIMIT_CPU: '500m',
          RESOURCE_REQUEST_MEMORY: '512Mi',
          RESOURCE_LIMIT_MEMORY: '1Gi',
          STORAGE_SIZE: '10Gi',
        },
      },
      Medium: {
        values: {
          INSTANCE_COUNT: '3',
          RESOURCE_REQUEST_CPU: '500m',
          RESOURCE_LIMIT_CPU: '1000m',
          RESOURCE_REQUEST_MEMORY: '1Gi',
          RESOURCE_LIMIT_MEMORY: '2Gi',
          STORAGE_SIZE: '20Gi',
        },
      },
      Large: {
        values: {
          INSTANCE_COUNT: '3',
          RESOURCE_REQUEST_CPU: '1000m',
          RESOURCE_LIMIT_CPU: '2000m',
          RESOURCE_REQUEST_MEMORY: '2Gi',
          RESOURCE_LIMIT_MEMORY: '4Gi',
          STORAGE_SIZE: '100Gi',
        },
      },
    },
    requiredOptions: [
      {
        key: 'FULLNAME_OVERRIDE',
        label: '인스턴스 이름',
        type: 'string',
        required: true,
        defaultValue: 'postgres',
        description: 'Cluster 리소스 이름 (Namespace 내 고유)',
      },
      {
        key: 'POSTGRES_IMAGE_NAME',
        label: 'PostgreSQL 이미지',
        type: 'string',
        required: true,
        defaultValue: 'ghcr.io/cloudnative-pg/postgresql:17.6-system-trixie',
        description: 'CNPG 호환 operand 이미지',
      },
      {
        key: 'IMAGE_PULL_POLICY',
        label: '이미지 Pull Policy',
        type: 'select',
        required: true,
        defaultValue: 'IfNotPresent',
        options: IMAGE_PULL_POLICY_OPTIONS,
      },
      {
        key: '_tier',
        label: '리소스 티어',
        type: 'resource-tier',
        required: true,
        defaultValue: 'Medium',
        group: '리소스',
      },
      {
        key: 'INSTANCE_COUNT',
        label: '인스턴스 수',
        type: 'int',
        required: true,
        defaultValue: '3',
        description: 'HA: 3 이상 권장. 개발: 1 가능',
        group: '리소스',
      },
      {
        key: 'RESOURCE_REQUEST_CPU',
        label: 'CPU Request',
        type: 'string',
        required: true,
        defaultValue: '500m',
        group: '리소스',
      },
      {
        key: 'RESOURCE_LIMIT_CPU',
        label: 'CPU Limit',
        type: 'string',
        required: true,
        defaultValue: '1000m',
        group: '리소스',
      },
      {
        key: 'RESOURCE_REQUEST_MEMORY',
        label: 'Memory Request',
        type: 'string',
        required: true,
        defaultValue: '1Gi',
        group: '리소스',
      },
      {
        key: 'RESOURCE_LIMIT_MEMORY',
        label: 'Memory Limit',
        type: 'string',
        required: true,
        defaultValue: '2Gi',
        group: '리소스',
      },
      {
        key: 'PRIMARY_UPDATE_STRATEGY',
        label: 'Primary 업데이트 전략',
        type: 'select',
        required: true,
        defaultValue: 'unsupervised',
        options: [
          { value: 'unsupervised', label: 'unsupervised (자동)' },
          { value: 'supervised', label: 'supervised (수동 승인)' },
        ],
        group: '업데이트',
      },
      {
        key: 'PRIMARY_UPDATE_METHOD',
        label: 'Primary 업데이트 방식',
        type: 'select',
        required: true,
        defaultValue: 'restart',
        options: [
          { value: 'restart', label: 'restart (재시작)' },
          { value: 'switchover', label: 'switchover (페일오버)' },
        ],
        group: '업데이트',
      },
      {
        key: 'STORAGE_SIZE',
        label: '데이터 스토리지 크기',
        type: 'string',
        required: true,
        defaultValue: '20Gi',
        description: '각 인스턴스 PVC 크기 (예: 20Gi)',
        group: '스토리지',
      },
      {
        key: 'STORAGE_CLASS',
        label: 'StorageClass',
        type: 'select',
        required: true,
        options: STORAGECLASS_FIELD_OPTIONS,
        group: '스토리지',
      },
      {
        key: 'APP_DATABASE_NAME',
        label: 'App DB 이름',
        type: 'string',
        required: true,
        defaultValue: 'app',
        description: '초기 생성 데이터베이스 이름',
        group: '데이터베이스',
      },
      {
        key: 'APP_USER_NAME',
        label: 'App DB 사용자명',
        type: 'string',
        required: true,
        defaultValue: 'app',
        group: '데이터베이스',
      },
      {
        key: 'APP_USER_PASSWORD',
        label: 'App DB 비밀번호',
        type: 'password',
        required: true,
        group: '데이터베이스',
      },
      {
        key: 'ENABLE_SUPERUSER_ACCESS',
        label: 'Superuser 접근 허용',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'postgres 계정 Secret 생성 여부',
        group: '데이터베이스',
      },
      {
        key: 'SUPERUSER_PASSWORD',
        label: 'Superuser 비밀번호',
        type: 'password',
        required: false,
        description: 'ENABLE_SUPERUSER_ACCESS=true 시 필수',
        group: '데이터베이스',
        showWhen: { key: 'ENABLE_SUPERUSER_ACCESS', value: 'true' },
      },
      {
        key: 'POOLER_ENABLED',
        label: 'PgBouncer Pooler 사용',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'PgBouncer 연결 풀러 활성화',
        group: 'PgBouncer',
      },
      {
        key: 'POOLER_TYPE',
        label: 'Pooler 연결 타입',
        type: 'select',
        required: false,
        defaultValue: 'rw',
        options: [
          { value: 'rw', label: 'rw (읽기쓰기)' },
          { value: 'ro', label: 'ro (읽기전용)' },
        ],
        group: 'PgBouncer',
        showWhen: { key: 'POOLER_ENABLED', value: 'true' },
      },
      {
        key: 'POOLER_INSTANCE_COUNT',
        label: 'Pooler 인스턴스 수',
        type: 'int',
        required: false,
        defaultValue: '2',
        description: 'PgBouncer Replica 수',
        group: 'PgBouncer',
        showWhen: { key: 'POOLER_ENABLED', value: 'true' },
      },
      {
        key: 'POOLER_MODE',
        label: 'Pool 모드',
        type: 'select',
        required: false,
        defaultValue: 'transaction',
        options: [
          { value: 'transaction', label: 'transaction' },
          { value: 'session', label: 'session' },
        ],
        group: 'PgBouncer',
        showWhen: { key: 'POOLER_ENABLED', value: 'true' },
      },
      {
        key: 'CLUSTER_PODMONITOR_ENABLED',
        label: 'PodMonitor 생성',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Prometheus Operator 필요',
        group: '모니터링',
      },
      {
        key: 'POOLER_PODMONITOR_ENABLED',
        label: 'Pooler PodMonitor',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Prometheus Operator 필요',
        group: '모니터링',
        showWhen: { key: 'POOLER_ENABLED', value: 'true' },
      },
    ],
    defaultValuesYaml: `name: "\${FULLNAME_OVERRIDE}"

cluster:
  instances: \${INSTANCE_COUNT}
  imageName: "\${POSTGRES_IMAGE_NAME}"
  imagePullPolicy: "\${IMAGE_PULL_POLICY}"

  primaryUpdateStrategy: "\${PRIMARY_UPDATE_STRATEGY}"
  primaryUpdateMethod: "\${PRIMARY_UPDATE_METHOD}"

  enableSuperuserAccess: \${ENABLE_SUPERUSER_ACCESS}

  resources:
    requests:
      cpu: "\${RESOURCE_REQUEST_CPU}"
      memory: "\${RESOURCE_REQUEST_MEMORY}"
    limits:
      cpu: "\${RESOURCE_LIMIT_CPU}"
      memory: "\${RESOURCE_LIMIT_MEMORY}"

  storage:
    size: "\${STORAGE_SIZE}"
    storageClass: "\${STORAGE_CLASS}"

  bootstrap:
    initdb:
      database: "\${APP_DATABASE_NAME}"
      owner: "\${APP_USER_NAME}"

  superuserSecret:
    password: "\${SUPERUSER_PASSWORD}"

  monitoring:
    enablePodMonitor: \${CLUSTER_PODMONITOR_ENABLED}

pooler:
  enabled: \${POOLER_ENABLED}
  type: "\${POOLER_TYPE}"
  instances: \${POOLER_INSTANCE_COUNT}
  pgbouncer:
    poolMode: "\${POOLER_MODE}"
  monitoring:
    enablePodMonitor: \${POOLER_PODMONITOR_ENABLED}
`,
  },

  /* ── Developer Tools: Gitea (§4) ── */
  {
    id: 'chart-gitea',
    name: 'gitea',
    installType: '단일 앱 (내장 PostgreSQL-HA + Valkey-Cluster)',
    description:
      'Gitea is a lightweight self-hosted Git service. Includes embedded PostgreSQL-HA and Valkey-Cluster. No external dependencies required.',
    version: '10.6.0',
    availableVersions: ['10.6.0', '10.5.0', '10.4.0'],
    category: 'Developer Tools',
    logoUrl: LOGO_URLS.gitea,
    chartInfo: {
      name: 'gitea',
      version: '10.6.0',
      appVersion: '1.22.0',
      description: 'Self-hosted Git service with embedded PostgreSQL-HA and Valkey-Cluster.',
    },
    tierPresets: {
      Small: {
        values: {
          RESOURCE_REQUEST_CPU: '250m',
          RESOURCE_LIMIT_CPU: '500m',
          RESOURCE_REQUEST_MEMORY: '512Mi',
          RESOURCE_LIMIT_MEMORY: '1Gi',
          PERSISTENCE_SIZE: '10Gi',
          POSTGRESQL_PERSISTENCE_SIZE: '10Gi',
          VALKEY_PERSISTENCE_SIZE: '4Gi',
        },
      },
      Medium: {
        values: {
          RESOURCE_REQUEST_CPU: '500m',
          RESOURCE_LIMIT_CPU: '1000m',
          RESOURCE_REQUEST_MEMORY: '1Gi',
          RESOURCE_LIMIT_MEMORY: '2Gi',
          PERSISTENCE_SIZE: '20Gi',
          POSTGRESQL_PERSISTENCE_SIZE: '20Gi',
          VALKEY_PERSISTENCE_SIZE: '8Gi',
        },
      },
      Large: {
        values: {
          RESOURCE_REQUEST_CPU: '1000m',
          RESOURCE_LIMIT_CPU: '2000m',
          RESOURCE_REQUEST_MEMORY: '2Gi',
          RESOURCE_LIMIT_MEMORY: '4Gi',
          PERSISTENCE_SIZE: '50Gi',
          POSTGRESQL_PERSISTENCE_SIZE: '50Gi',
          VALKEY_PERSISTENCE_SIZE: '16Gi',
        },
      },
    },
    requiredOptions: [
      /* 기본 설정 */
      {
        key: 'FULLNAME_OVERRIDE',
        label: '인스턴스 이름',
        type: 'string',
        required: true,
        defaultValue: 'gitea',
        description: 'K8s 리소스 전체 이름',
        group: '기본 설정',
      },
      {
        key: 'IMAGE_REGISTRY',
        label: '컨테이너 레지스트리',
        type: 'string',
        required: false,
        description: 'Private registry 사용 시 입력',
        group: '기본 설정',
      },
      {
        key: 'STORAGE_CLASS',
        label: 'StorageClass',
        type: 'select',
        required: true,
        options: STORAGECLASS_FIELD_OPTIONS,
        description: 'Gitea/PostgreSQL/Valkey PVC 공통 적용',
        group: '기본 설정',
      },
      /* Ingress */
      {
        key: 'INGRESS_ENABLED',
        label: 'Ingress 활성화',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: '외부 접속 Ingress 생성 여부',
        group: 'Ingress',
      },
      {
        key: 'INGRESS_CLASS_NAME',
        label: 'Ingress Class',
        type: 'string',
        required: false,
        defaultValue: 'nginx',
        showWhen: { key: 'INGRESS_ENABLED', value: 'true' },
        group: 'Ingress',
      },
      {
        key: 'INGRESS_HOST',
        label: '외부 접속 도메인',
        type: 'string',
        required: false,
        description: '예: git.example.com',
        showWhen: { key: 'INGRESS_ENABLED', value: 'true' },
        group: 'Ingress',
      },
      /* 리소스 */
      {
        key: '_tier',
        label: '리소스 티어',
        type: 'resource-tier',
        required: true,
        defaultValue: 'Medium',
        group: '리소스 (Gitea)',
      },
      {
        key: 'RESOURCE_REQUEST_CPU',
        label: 'CPU Request',
        type: 'string',
        required: true,
        defaultValue: '500m',
        group: '리소스 (Gitea)',
      },
      {
        key: 'RESOURCE_LIMIT_CPU',
        label: 'CPU Limit',
        type: 'string',
        required: true,
        defaultValue: '1000m',
        group: '리소스 (Gitea)',
      },
      {
        key: 'RESOURCE_REQUEST_MEMORY',
        label: 'Memory Request',
        type: 'string',
        required: true,
        defaultValue: '1Gi',
        group: '리소스 (Gitea)',
      },
      {
        key: 'RESOURCE_LIMIT_MEMORY',
        label: 'Memory Limit',
        type: 'string',
        required: true,
        defaultValue: '2Gi',
        group: '리소스 (Gitea)',
      },
      {
        key: 'PERSISTENCE_SIZE',
        label: 'Gitea 스토리지 크기',
        type: 'string',
        required: true,
        defaultValue: '20Gi',
        description: 'Gitea 저장소 데이터 PVC',
        group: '리소스 (Gitea)',
      },
      /* 관리자 계정 */
      {
        key: 'GITEA_ADMIN_USERNAME',
        label: '관리자 사용자명',
        type: 'string',
        required: true,
        defaultValue: 'gitadmin',
        description: '초기 admin 계정',
        group: 'Gitea 관리자',
      },
      {
        key: 'GITEA_ADMIN_PASSWORD',
        label: '관리자 비밀번호',
        type: 'password',
        required: true,
        group: 'Gitea 관리자',
      },
      {
        key: 'GITEA_ADMIN_EMAIL',
        label: '관리자 이메일',
        type: 'string',
        required: true,
        description: '예: admin@example.com',
        group: 'Gitea 관리자',
      },
      {
        key: 'METRICS_ENABLED',
        label: 'Metrics 활성화',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        group: 'Gitea 관리자',
      },
      /* 내장 PostgreSQL-HA */
      {
        key: 'POSTGRESQL_HA_ENABLED',
        label: '내장 PostgreSQL-HA 사용',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'false: 외부 DB 연결',
        group: '내장 PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_DB_NAME',
        label: 'DB 이름',
        type: 'string',
        required: false,
        defaultValue: 'gitea',
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: '내장 PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_DB_USER',
        label: 'DB 사용자명',
        type: 'string',
        required: false,
        defaultValue: 'gitea',
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: '내장 PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_DB_PASSWORD',
        label: 'DB 비밀번호',
        type: 'password',
        required: false,
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: '내장 PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_REPMGR_PASSWORD',
        label: 'Repmgr 비밀번호',
        type: 'password',
        required: false,
        description: 'PostgreSQL 복제 관리자 비밀번호',
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: '내장 PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_SUPERUSER_PASSWORD',
        label: 'Superuser 비밀번호',
        type: 'password',
        required: false,
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: '내장 PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_PGPOOL_ADMIN_PASSWORD',
        label: 'Pgpool Admin 비밀번호',
        type: 'password',
        required: false,
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: '내장 PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_PGPOOL_SR_CHECK_PASSWORD',
        label: 'Pgpool SR Check 비밀번호',
        type: 'password',
        required: false,
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: '내장 PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_PERSISTENCE_SIZE',
        label: 'PostgreSQL 스토리지 크기',
        type: 'string',
        required: false,
        defaultValue: '20Gi',
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: '내장 PostgreSQL-HA',
      },
      /* 내장 Valkey-Cluster */
      {
        key: 'VALKEY_CLUSTER_ENABLED',
        label: '내장 Valkey-Cluster 사용',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'false: 외부 캐시 연결',
        group: '내장 Valkey-Cluster',
      },
      {
        key: 'VALKEY_PASSWORD',
        label: 'Valkey 비밀번호',
        type: 'password',
        required: false,
        description: '특수문자 회피 권장',
        showWhen: { key: 'VALKEY_CLUSTER_ENABLED', value: 'true' },
        group: '내장 Valkey-Cluster',
      },
      {
        key: 'VALKEY_PERSISTENCE_SIZE',
        label: 'Valkey 스토리지 크기',
        type: 'string',
        required: false,
        defaultValue: '8Gi',
        showWhen: { key: 'VALKEY_CLUSTER_ENABLED', value: 'true' },
        group: '내장 Valkey-Cluster',
      },
    ],
    defaultValuesYaml: `fullnameOverride: "\${FULLNAME_OVERRIDE}"
global:
  imageRegistry: "\${IMAGE_REGISTRY}"
  storageClass: "\${STORAGE_CLASS}"

ingress:
  enabled: \${INGRESS_ENABLED}
  className: "\${INGRESS_CLASS_NAME}"
  hosts:
    - host: "\${INGRESS_HOST}"
      paths:
        - path: /

resources:
  requests:
    cpu: "\${RESOURCE_REQUEST_CPU}"
    memory: "\${RESOURCE_REQUEST_MEMORY}"
  limits:
    cpu: "\${RESOURCE_LIMIT_CPU}"
    memory: "\${RESOURCE_LIMIT_MEMORY}"

persistence:
  size: "\${PERSISTENCE_SIZE}"

gitea:
  admin:
    username: "\${GITEA_ADMIN_USERNAME}"
    password: "\${GITEA_ADMIN_PASSWORD}"
    email: "\${GITEA_ADMIN_EMAIL}"
  metrics:
    enabled: \${METRICS_ENABLED}

postgresql-ha:
  enabled: \${POSTGRESQL_HA_ENABLED}
  postgresql:
    database: "\${POSTGRESQL_DB_NAME}"
    username: "\${POSTGRESQL_DB_USER}"
    password: "\${POSTGRESQL_DB_PASSWORD}"
    repmgrPassword: "\${POSTGRESQL_REPMGR_PASSWORD}"
  pgpool:
    adminPassword: "\${POSTGRESQL_PGPOOL_ADMIN_PASSWORD}"
    srCheckPassword: "\${POSTGRESQL_PGPOOL_SR_CHECK_PASSWORD}"
  global:
    postgresql:
      postgresPassword: "\${POSTGRESQL_SUPERUSER_PASSWORD}"
  persistence:
    size: "\${POSTGRESQL_PERSISTENCE_SIZE}"

valkey-cluster:
  enabled: \${VALKEY_CLUSTER_ENABLED}
  password: "\${VALKEY_PASSWORD}"
  persistence:
    size: "\${VALKEY_PERSISTENCE_SIZE}"
`,
  },

  /* ── Networking: nginx (chart 미작성 — 대표값) ── */
  {
    id: 'chart-nginx',
    name: 'nginx',
    installType: '단일 앱 (chart 준비중)',
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

  /* ── Data Processing: Kafka (chart 미작성 — 대표값) ── */
  {
    id: 'chart-kafka',
    name: 'kafka',
    installType: 'Operator 기반 (chart 준비중)',
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
      description: 'Apache Kafka: distributed streaming platform for real-time data pipelines.',
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

  /* ── Vector DB: Milvus (chart 미작성 — 대표값) ── */
  {
    id: 'chart-milvus',
    name: 'milvus',
    installType: '단일 앱 (chart 준비중)',
    description:
      'Milvus is an open-source vector database built to power embedding similarity search and AI applications. Supports trillion-scale vector similarity search.',
    version: '4.2.7',
    availableVersions: ['4.2.7', '4.2.0', '4.1.0', '4.0.0'],
    category: 'Vector DB',
    logoUrl: LOGO_URLS.milvus,
    chartInfo: {
      name: 'milvus',
      version: '4.2.7',
      appVersion: '2.4.7',
      description:
        'Open-source vector database for scalable similarity search and AI/ML applications.',
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
