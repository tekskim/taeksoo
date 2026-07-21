import type { SecretListParams, SecretListResult, SecretSummary } from '../models/secret';

const DEFAULT_DELAY_MS = 80;

const MOCK_SECRETS: SecretSummary[] = [
  {
    name: 'GITHUB_TOKEN',
    slug: 'github-token',
    currentVersion: 4,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 's3_secret_access_key',
    slug: 's3-secret-access-key',
    currentVersion: 2,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'KC_CLIENT_SECRET',
    slug: 'kc-client-secret',
    currentVersion: 1,
    status: 'deactivated',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'OPENAI_API_KEY',
    slug: 'openai-api-key',
    currentVersion: 5,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'REDIS_PASSWORD',
    slug: 'redis-password',
    currentVersion: 2,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'postgresql.password',
    slug: 'postgresql-password',
    currentVersion: 3,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'valkey-auth',
    slug: 'valkey-auth',
    currentVersion: 5,
    status: 'active',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'postgresql-superuser-auth',
    slug: 'postgresql-superuser-auth',
    currentVersion: 1,
    status: 'expired',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'postgresql-app-auth',
    slug: 'postgresql-app-auth',
    currentVersion: 3,
    status: 'active',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'rabbitmq-consumer-user',
    slug: 'rabbitmq-consumer-user',
    currentVersion: 2,
    status: 'active',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'rabbitmq-publisher-user',
    slug: 'rabbitmq-publisher-user',
    currentVersion: 2,
    status: 'deactivated',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'rabbitmq-admin-user',
    slug: 'rabbitmq-admin-user',
    currentVersion: 4,
    status: 'active',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'seaweedfs-s3-config',
    slug: 'seaweedfs-s3-config',
    currentVersion: 2,
    status: 'active',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'openstack-admin-auth',
    slug: 'openstack-admin-auth',
    currentVersion: 3,
    status: 'active',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'postgres-main',
    slug: 'postgres-main',
    currentVersion: 7,
    status: 'active',
    updatedAt: '2026-04-24T06:12:00Z',
  },
  {
    name: 'payment-api-key',
    slug: 'payment-api-key',
    currentVersion: 3,
    status: 'expired',
    updatedAt: '2026-04-18T13:25:00Z',
  },
  {
    name: 'session-kv',
    slug: 'session-kv',
    currentVersion: 12,
    status: 'active',
    updatedAt: '2026-04-10T08:00:00Z',
  },
  {
    name: 'cache-redis',
    slug: 'cache-redis',
    currentVersion: 2,
    status: 'deleted',
    updatedAt: '2026-03-28T02:45:00Z',
  },
];

let currentSecrets = [...MOCK_SECRETS];
let responseDelayMs = DEFAULT_DELAY_MS;

const toTimestamp = (value: string | null): number => {
  if (!value) return Number.POSITIVE_INFINITY;
  return new Date(value).getTime();
};

const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const includesAny = (source: string, search?: string): boolean => {
  if (!search) return true;
  return source.toLowerCase().includes(search.toLowerCase());
};

export const listMockSecrets = async (params: SecretListParams): Promise<SecretListResult> => {
  await delay(responseDelayMs);

  const sortField = params.sortBy ?? 'updatedAt';

  const filtered = currentSecrets
    .filter((item) => {
      const matchesName = !params.name || includesAny(item.name, params.name);
      const matchesStatus = !params.status || item.status === params.status;
      return matchesName && matchesStatus;
    })
    .sort((left, right) => {
      const direction = params.sortOrder === 'asc' ? 1 : -1;
      const leftValue = toTimestamp(left[sortField]);
      const rightValue = toTimestamp(right[sortField]);

      return (leftValue - rightValue) * direction;
    });

  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;

  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
  };
};

export const resetMockSecrets = (): void => {
  currentSecrets = [...MOCK_SECRETS];
  responseDelayMs = DEFAULT_DELAY_MS;
};

export const setMockSecrets = (items: SecretSummary[]): void => {
  currentSecrets = [...items];
};

export const setMockSecretsDelay = (ms: number): void => {
  responseDelayMs = ms;
};
