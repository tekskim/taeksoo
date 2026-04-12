/**
 * Apps Catalog / Installed Apps mock data
 *
 * v1.0 apps (Policy Appendix 1 + Appendix 2 Edit Options):
 *   - Valkey            (Database)        standalone
 *   - CNPG Operator     (Database)        Operator-based step 1
 *   - CNPG Instance     (Database)        Operator-based step 2 (dependsOn: cnpg-operator)
 *   - Gitea             (Developer Tools) standalone (embedded PostgreSQL-HA + Valkey-Cluster)
 *   - nginx             (Networking)      chart pending — placeholder
 *   - Kafka             (Data Processing) chart pending — placeholder
 *   - Milvus            (Vector DB)       chart pending — placeholder
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
   Catalog Charts — Policy Appendix 2 Edit Options
   Ref: https://www.notion.so/thakicloud/Edit-Options-33c9eddc34e68197a861e8047c9f05ae
   ────────────────────────────────────────────────────────────── */
export const catalogCharts: CatalogChart[] = [
  /* ── Database: Valkey (§2) ── */
  {
    id: 'chart-valkey',
    name: 'valkey',
    installType: 'Standalone',
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
        label: 'Instance Name',
        type: 'string',
        required: true,
        defaultValue: 'valkey',
        description: 'Kubernetes resource name (must be unique within the namespace)',
      },
      {
        key: 'IMAGE_REGISTRY',
        label: 'Container Registry',
        type: 'string',
        required: false,
        defaultValue: 'docker.io',
        description: 'Override when using a private registry',
      },
      {
        key: '_tier',
        label: 'Resource Tier',
        type: 'resource-tier',
        required: true,
        defaultValue: 'Medium',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_REQUEST_CPU',
        label: 'CPU Request',
        type: 'string',
        required: true,
        defaultValue: '250m',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_LIMIT_CPU',
        label: 'CPU Limit',
        type: 'string',
        required: true,
        defaultValue: '500m',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_REQUEST_MEMORY',
        label: 'Memory Request',
        type: 'string',
        required: true,
        defaultValue: '256Mi',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_LIMIT_MEMORY',
        label: 'Memory Limit',
        type: 'string',
        required: true,
        defaultValue: '512Mi',
        group: 'Resources',
      },
      {
        key: 'AUTH_DEFAULT_PASSWORD',
        label: 'Auth Password',
        type: 'password',
        required: true,
        description: 'ACL password for the default user. Avoid special characters: @, #, $',
        group: 'Authentication',
      },
      {
        key: 'STORAGE_SIZE',
        label: 'Storage Size',
        type: 'string',
        required: true,
        defaultValue: '5Gi',
        description: 'PVC size for standalone mode (e.g. 5Gi)',
        group: 'Storage',
      },
      {
        key: 'STORAGE_CLASS',
        label: 'StorageClass',
        type: 'select',
        required: true,
        options: STORAGECLASS_FIELD_OPTIONS,
        description: 'Select from available StorageClasses (kubectl get sc)',
        group: 'Storage',
      },
      {
        key: 'REPLICA_ENABLED',
        label: 'Replication Mode (HA)',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Enable Master-Replica HA mode',
        group: 'HA Replication',
      },
      {
        key: 'REPLICA_COUNT',
        label: 'Replica Count',
        type: 'int',
        required: false,
        defaultValue: '2',
        description: 'Number of replicas (excluding master)',
        group: 'HA Replication',
        showWhen: { key: 'REPLICA_ENABLED', value: 'true' },
      },
      {
        key: 'REPLICA_STORAGE_SIZE',
        label: 'Replica Storage Size',
        type: 'string',
        required: false,
        description: 'PVC size for each replica. Recommended: same as Storage Size',
        group: 'HA Replication',
        showWhen: { key: 'REPLICA_ENABLED', value: 'true' },
      },
      {
        key: 'REPLICA_STORAGE_CLASS',
        label: 'Replica StorageClass',
        type: 'select',
        required: false,
        options: STORAGECLASS_FIELD_OPTIONS,
        description: 'StorageClass for replica PVCs. Recommended: same as StorageClass',
        group: 'HA Replication',
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
    installType: 'Operator (Step 1 of 2)',
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
        label: 'Instance Name',
        type: 'string',
        required: true,
        defaultValue: 'cnpg-operator',
        description: 'Kubernetes resource name for the operator',
      },
      {
        key: 'IMAGE_REPOSITORY',
        label: 'Operator Image Repository',
        type: 'string',
        required: true,
        defaultValue: 'ghcr.io/cloudnative-pg/cloudnative-pg',
        description: 'Override for private registry',
      },
      {
        key: 'IMAGE_TAG',
        label: 'Operator Image Tag',
        type: 'string',
        required: true,
        defaultValue: '1.29.0',
        description: 'Operator version — pin to a specific release',
      },
      {
        key: 'IMAGE_PULL_POLICY',
        label: 'Image Pull Policy',
        type: 'select',
        required: true,
        defaultValue: 'IfNotPresent',
        options: IMAGE_PULL_POLICY_OPTIONS,
      },
      {
        key: 'CRDS_CREATE',
        label: 'Create CRDs',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'Set to true on first install. Set to false if CRDs already exist',
      },
      {
        key: 'CLUSTER_WIDE',
        label: 'Cluster-wide Watch',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'false: watch only the install namespace',
      },
      {
        key: '_tier',
        label: 'Resource Tier',
        type: 'resource-tier',
        required: true,
        defaultValue: 'Medium',
        group: 'Resources',
      },
      {
        key: 'MAX_CONCURRENT_RECONCILES',
        label: 'Max Concurrent Reconciles',
        type: 'int',
        required: true,
        defaultValue: '10',
        description: 'Adjust based on cluster scale',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_REQUEST_CPU',
        label: 'CPU Request',
        type: 'string',
        required: true,
        defaultValue: '200m',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_LIMIT_CPU',
        label: 'CPU Limit',
        type: 'string',
        required: true,
        defaultValue: '500m',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_REQUEST_MEMORY',
        label: 'Memory Request',
        type: 'string',
        required: true,
        defaultValue: '256Mi',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_LIMIT_MEMORY',
        label: 'Memory Limit',
        type: 'string',
        required: true,
        defaultValue: '512Mi',
        group: 'Resources',
      },
      {
        key: 'PODMONITOR_ENABLED',
        label: 'Enable PodMonitor',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Requires Prometheus Operator CRDs',
        group: 'Monitoring',
      },
      {
        key: 'GRAFANA_DASHBOARD_CREATE',
        label: 'Create Grafana Dashboard',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Requires Grafana sidecar configuration',
        group: 'Monitoring',
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
    installType: 'Operator (Step 2 of 2)',
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
        label: 'Instance Name',
        type: 'string',
        required: true,
        defaultValue: 'postgres',
        description: 'Cluster resource name (must be unique within the namespace)',
      },
      {
        key: 'POSTGRES_IMAGE_NAME',
        label: 'PostgreSQL Image',
        type: 'string',
        required: true,
        defaultValue: 'ghcr.io/cloudnative-pg/postgresql:17.6-system-trixie',
        description: 'CNPG-compatible operand image',
      },
      {
        key: 'IMAGE_PULL_POLICY',
        label: 'Image Pull Policy',
        type: 'select',
        required: true,
        defaultValue: 'IfNotPresent',
        options: IMAGE_PULL_POLICY_OPTIONS,
      },
      {
        key: '_tier',
        label: 'Resource Tier',
        type: 'resource-tier',
        required: true,
        defaultValue: 'Medium',
        group: 'Resources',
      },
      {
        key: 'INSTANCE_COUNT',
        label: 'Instance Count',
        type: 'int',
        required: true,
        defaultValue: '3',
        description: 'Recommended ≥3 for HA. Development: 1 is acceptable',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_REQUEST_CPU',
        label: 'CPU Request',
        type: 'string',
        required: true,
        defaultValue: '500m',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_LIMIT_CPU',
        label: 'CPU Limit',
        type: 'string',
        required: true,
        defaultValue: '1000m',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_REQUEST_MEMORY',
        label: 'Memory Request',
        type: 'string',
        required: true,
        defaultValue: '1Gi',
        group: 'Resources',
      },
      {
        key: 'RESOURCE_LIMIT_MEMORY',
        label: 'Memory Limit',
        type: 'string',
        required: true,
        defaultValue: '2Gi',
        group: 'Resources',
      },
      {
        key: 'PRIMARY_UPDATE_STRATEGY',
        label: 'Primary Update Strategy',
        type: 'select',
        required: true,
        defaultValue: 'unsupervised',
        options: [
          { value: 'unsupervised', label: 'unsupervised (automatic)' },
          { value: 'supervised', label: 'supervised (manual approval)' },
        ],
        group: 'Update Policy',
      },
      {
        key: 'PRIMARY_UPDATE_METHOD',
        label: 'Primary Update Method',
        type: 'select',
        required: true,
        defaultValue: 'restart',
        options: [
          { value: 'restart', label: 'restart' },
          { value: 'switchover', label: 'switchover (failover then update)' },
        ],
        group: 'Update Policy',
      },
      {
        key: 'STORAGE_SIZE',
        label: 'Data Storage Size',
        type: 'string',
        required: true,
        defaultValue: '20Gi',
        description: 'PVC size per instance (e.g. 20Gi)',
        group: 'Storage',
      },
      {
        key: 'STORAGE_CLASS',
        label: 'StorageClass',
        type: 'select',
        required: true,
        options: STORAGECLASS_FIELD_OPTIONS,
        group: 'Storage',
      },
      {
        key: 'APP_DATABASE_NAME',
        label: 'App Database Name',
        type: 'string',
        required: true,
        defaultValue: 'app',
        description: 'Initial database name created during bootstrap',
        group: 'Database',
      },
      {
        key: 'APP_USER_NAME',
        label: 'App DB Username',
        type: 'string',
        required: true,
        defaultValue: 'app',
        group: 'Database',
      },
      {
        key: 'APP_USER_PASSWORD',
        label: 'App DB Password',
        type: 'password',
        required: true,
        group: 'Database',
      },
      {
        key: 'ENABLE_SUPERUSER_ACCESS',
        label: 'Enable Superuser Access',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'Creates a Kubernetes Secret for the postgres superuser account',
        group: 'Database',
      },
      {
        key: 'SUPERUSER_PASSWORD',
        label: 'Superuser Password',
        type: 'password',
        required: false,
        description: 'Required when Superuser Access is enabled',
        group: 'Database',
        showWhen: { key: 'ENABLE_SUPERUSER_ACCESS', value: 'true' },
      },
      {
        key: 'POOLER_ENABLED',
        label: 'Enable PgBouncer Pooler',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'Activates PgBouncer connection pooler',
        group: 'PgBouncer',
      },
      {
        key: 'POOLER_TYPE',
        label: 'Pooler Connection Type',
        type: 'select',
        required: false,
        defaultValue: 'rw',
        options: [
          { value: 'rw', label: 'rw (read-write)' },
          { value: 'ro', label: 'ro (read-only)' },
        ],
        group: 'PgBouncer',
        showWhen: { key: 'POOLER_ENABLED', value: 'true' },
      },
      {
        key: 'POOLER_INSTANCE_COUNT',
        label: 'Pooler Instance Count',
        type: 'int',
        required: false,
        defaultValue: '2',
        description: 'Number of PgBouncer replicas',
        group: 'PgBouncer',
        showWhen: { key: 'POOLER_ENABLED', value: 'true' },
      },
      {
        key: 'POOLER_MODE',
        label: 'Pool Mode',
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
        label: 'Enable Cluster PodMonitor',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Requires Prometheus Operator',
        group: 'Monitoring',
      },
      {
        key: 'POOLER_PODMONITOR_ENABLED',
        label: 'Enable Pooler PodMonitor',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        description: 'Requires Prometheus Operator',
        group: 'Monitoring',
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
    installType: 'Standalone (embedded PostgreSQL-HA + Valkey-Cluster)',
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
      /* General */
      {
        key: 'FULLNAME_OVERRIDE',
        label: 'Instance Name',
        type: 'string',
        required: true,
        defaultValue: 'gitea',
        description: 'Kubernetes resource name',
        group: 'General',
      },
      {
        key: 'IMAGE_REGISTRY',
        label: 'Container Registry',
        type: 'string',
        required: false,
        description: 'Override when using a private registry',
        group: 'General',
      },
      {
        key: 'STORAGE_CLASS',
        label: 'StorageClass',
        type: 'select',
        required: true,
        options: STORAGECLASS_FIELD_OPTIONS,
        description: 'Applied to Gitea, PostgreSQL, and Valkey PVCs',
        group: 'General',
      },
      /* Ingress */
      {
        key: 'INGRESS_ENABLED',
        label: 'Enable Ingress',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'Create an Ingress for external access',
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
        label: 'External Domain',
        type: 'string',
        required: false,
        description: 'e.g. git.example.com',
        showWhen: { key: 'INGRESS_ENABLED', value: 'true' },
        group: 'Ingress',
      },
      /* Resources */
      {
        key: '_tier',
        label: 'Resource Tier',
        type: 'resource-tier',
        required: true,
        defaultValue: 'Medium',
        group: 'Resources (Gitea)',
      },
      {
        key: 'RESOURCE_REQUEST_CPU',
        label: 'CPU Request',
        type: 'string',
        required: true,
        defaultValue: '500m',
        group: 'Resources (Gitea)',
      },
      {
        key: 'RESOURCE_LIMIT_CPU',
        label: 'CPU Limit',
        type: 'string',
        required: true,
        defaultValue: '1000m',
        group: 'Resources (Gitea)',
      },
      {
        key: 'RESOURCE_REQUEST_MEMORY',
        label: 'Memory Request',
        type: 'string',
        required: true,
        defaultValue: '1Gi',
        group: 'Resources (Gitea)',
      },
      {
        key: 'RESOURCE_LIMIT_MEMORY',
        label: 'Memory Limit',
        type: 'string',
        required: true,
        defaultValue: '2Gi',
        group: 'Resources (Gitea)',
      },
      {
        key: 'PERSISTENCE_SIZE',
        label: 'Gitea Storage',
        type: 'string',
        required: true,
        defaultValue: '20Gi',
        description: 'PVC size for Gitea repository data',
        group: 'Resources (Gitea)',
      },
      /* Admin Account */
      {
        key: 'GITEA_ADMIN_USERNAME',
        label: 'Admin Username',
        type: 'string',
        required: true,
        defaultValue: 'gitadmin',
        description: 'Initial admin account',
        group: 'Admin Account',
      },
      {
        key: 'GITEA_ADMIN_PASSWORD',
        label: 'Admin Password',
        type: 'password',
        required: true,
        group: 'Admin Account',
      },
      {
        key: 'GITEA_ADMIN_EMAIL',
        label: 'Admin Email',
        type: 'string',
        required: true,
        description: 'e.g. admin@example.com',
        group: 'Admin Account',
      },
      {
        key: 'METRICS_ENABLED',
        label: 'Enable Metrics',
        type: 'boolean',
        required: true,
        defaultValue: 'false',
        group: 'Admin Account',
      },
      /* Embedded PostgreSQL-HA */
      {
        key: 'POSTGRESQL_HA_ENABLED',
        label: 'Enable Embedded PostgreSQL-HA',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'Disable to connect an external database',
        group: 'Embedded PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_DB_NAME',
        label: 'Database Name',
        type: 'string',
        required: false,
        defaultValue: 'gitea',
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: 'Embedded PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_DB_USER',
        label: 'Database Username',
        type: 'string',
        required: false,
        defaultValue: 'gitea',
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: 'Embedded PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_DB_PASSWORD',
        label: 'Database Password',
        type: 'password',
        required: false,
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: 'Embedded PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_REPMGR_PASSWORD',
        label: 'Repmgr Password',
        type: 'password',
        required: false,
        description: 'Password for the PostgreSQL replication manager',
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: 'Embedded PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_SUPERUSER_PASSWORD',
        label: 'Superuser Password',
        type: 'password',
        required: false,
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: 'Embedded PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_PGPOOL_ADMIN_PASSWORD',
        label: 'Pgpool Admin Password',
        type: 'password',
        required: false,
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: 'Embedded PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_PGPOOL_SR_CHECK_PASSWORD',
        label: 'Pgpool SR Check Password',
        type: 'password',
        required: false,
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: 'Embedded PostgreSQL-HA',
      },
      {
        key: 'POSTGRESQL_PERSISTENCE_SIZE',
        label: 'PostgreSQL Storage',
        type: 'string',
        required: false,
        defaultValue: '20Gi',
        showWhen: { key: 'POSTGRESQL_HA_ENABLED', value: 'true' },
        group: 'Embedded PostgreSQL-HA',
      },
      /* Embedded Valkey-Cluster */
      {
        key: 'VALKEY_CLUSTER_ENABLED',
        label: 'Enable Embedded Valkey-Cluster',
        type: 'boolean',
        required: true,
        defaultValue: 'true',
        description: 'Disable to connect an external cache',
        group: 'Embedded Valkey-Cluster',
      },
      {
        key: 'VALKEY_PASSWORD',
        label: 'Valkey Password',
        type: 'password',
        required: false,
        description: 'Avoid special characters: @, #, $',
        showWhen: { key: 'VALKEY_CLUSTER_ENABLED', value: 'true' },
        group: 'Embedded Valkey-Cluster',
      },
      {
        key: 'VALKEY_PERSISTENCE_SIZE',
        label: 'Valkey Storage',
        type: 'string',
        required: false,
        defaultValue: '8Gi',
        showWhen: { key: 'VALKEY_CLUSTER_ENABLED', value: 'true' },
        group: 'Embedded Valkey-Cluster',
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

  /* ── Networking: nginx (chart pending — placeholder) ── */
  {
    id: 'chart-nginx',
    name: 'nginx',
    installType: 'Standalone (chart pending)',
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

  /* ── Data Processing: Kafka (chart pending — placeholder) ── */
  {
    id: 'chart-kafka',
    name: 'kafka',
    installType: 'Operator (chart pending)',
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

  /* ── Vector DB: Milvus (chart pending — placeholder) ── */
  {
    id: 'chart-milvus',
    name: 'milvus',
    installType: 'Standalone (chart pending)',
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
   Installed Apps mock data (Policy §4-1 ~ §4-3)
   ────────────────────────────────────────────────────────────── */
export const installedAppsMock: InstalledApp[] = [
  {
    id: 'release-cnpg-operator-system',
    releaseName: 'cnpg-operator',
    name: 'cnpg-operator',
    status: 'Deployed',
    namespace: 'cnpg-system',
    chart: 'thakicloud/cnpg-operator',
    version: '1.29.0',
    installedAt: '2026-03-11 14:20',
    lastDeployed: '2026-03-11 14:20',
    chartInfo: {
      name: 'cnpg-operator',
      version: '1.29.0',
      appVersion: '1.29.0',
      description:
        'CloudNativePG Operator — manages PostgreSQL clusters as Kubernetes-native resources.',
    },
    resources: [
      { kind: 'Deployment', name: 'cnpg-operator', namespace: 'cnpg-system' },
      { kind: 'ClusterRole', name: 'cnpg-operator' },
      { kind: 'CustomResourceDefinition', name: 'clusters.postgresql.cnpg.io' },
    ],
  },
  {
    id: 'release-cnpg-instance-default',
    releaseName: 'postgres',
    name: 'cnpg-instance',
    status: 'Deployed',
    namespace: 'default',
    chart: 'thakicloud/cnpg-instance',
    version: '1.29.0',
    installedAt: '2026-03-11 15:10',
    lastDeployed: '2026-03-11 15:10',
    chartInfo: {
      name: 'cnpg-instance',
      version: '1.29.0',
      appVersion: '17.6',
      description: 'PostgreSQL cluster instance (CNPG CRD). Requires CNPG Operator.',
    },
    connectionInfo: {
      internalServiceDomain: 'postgres-rw.default.svc.cluster.local',
      port: 5432,
    },
    resources: [
      { kind: 'Cluster', name: 'postgres', namespace: 'default' },
      { kind: 'Secret', name: 'postgres-app', namespace: 'default' },
      { kind: 'Pooler', name: 'postgres-pooler', namespace: 'default' },
    ],
  },
  {
    id: 'release-valkey-cache',
    releaseName: 'valkey',
    name: 'valkey',
    status: 'Deployed',
    namespace: 'cache',
    chart: 'thakicloud/valkey',
    version: '8.0.2',
    installedAt: '2026-03-09 17:55',
    lastDeployed: '2026-03-09 17:55',
    chartInfo: {
      name: 'valkey',
      version: '8.0.2',
      appVersion: '8.0.2',
      description:
        'Open-source, in-memory data structure store. Drop-in replacement for Redis OSS.',
    },
    connectionInfo: {
      internalServiceDomain: 'valkey.cache.svc.cluster.local',
      port: 6379,
    },
    valuesYaml: `fullnameOverride: "valkey"

auth:
  enabled: true
  password: "change-me"

primary:
  persistence:
    size: 5Gi
    storageClass: "longhorn"
`,
    resources: [
      { kind: 'StatefulSet', name: 'valkey-primary', namespace: 'cache' },
      { kind: 'Service', name: 'valkey', namespace: 'cache' },
      { kind: 'PersistentVolumeClaim', name: 'data-valkey-primary-0', namespace: 'cache' },
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
      description: 'Apache Kafka: distributed streaming platform for real-time data pipelines.',
    },
    connectionInfo: {
      internalServiceDomain: 'kafka.data.svc.cluster.local',
      port: 9092,
    },
    resources: [
      { kind: 'StatefulSet', name: 'kafka-broker', namespace: 'data' },
      { kind: 'Service', name: 'kafka', namespace: 'data' },
      { kind: 'PersistentVolumeClaim', name: 'data-kafka-broker-0', namespace: 'data' },
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
    resources: [
      { kind: 'Deployment', name: 'nginx-controller', namespace: 'ingress-nginx' },
      { kind: 'Service', name: 'nginx-controller', namespace: 'ingress-nginx' },
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
        'Open-source vector database for scalable similarity search and AI/ML applications.',
    },
    resources: [
      { kind: 'Deployment', name: 'milvus-standalone', namespace: 'ai' },
      { kind: 'Service', name: 'milvus', namespace: 'ai' },
    ],
  },
  {
    id: 'release-cnpg-instance-ai-failed',
    releaseName: 'postgres',
    name: 'cnpg-instance',
    status: 'Failed',
    namespace: 'ai',
    chart: 'thakicloud/cnpg-instance',
    version: '1.29.0',
    installedAt: '2026-03-12 10:30',
    lastDeployed: '2026-03-12 10:30',
    errorMessage:
      'PersistentVolumeClaim "data-postgres-0" failed to bind: no matching StorageClass found.',
    chartInfo: {
      name: 'cnpg-instance',
      version: '1.29.0',
      appVersion: '17.6',
      description: 'PostgreSQL cluster instance (CNPG CRD). Requires CNPG Operator.',
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
  { value: 'cnpg-system', label: 'cnpg-system' },
];
