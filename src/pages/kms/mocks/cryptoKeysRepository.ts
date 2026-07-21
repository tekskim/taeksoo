import type {
  CryptoKeyDetail,
  CryptoKeyListParams,
  CryptoKeyListResult,
  CryptoKeySummary,
  EncryptionKeyState,
} from '../models/cryptoKey';

const DEFAULT_DELAY_MS = 80;

const MOCK_CRYPTO_KEYS: CryptoKeySummary[] = [
  {
    name: 'kube_config_key',
    slug: 'kube-config-key',
    algorithm: 'AES-256',
    purpose: 'Encrypt / Decrypt',
    currentVersion: 1,
    status: 'active',
    createdAt: '2026-04-29T23:52:51Z',
    nextRotationAt: '2026-07-29T23:52:51Z',
  },
  {
    name: 'fernetKey',
    slug: 'fernetkey',
    algorithm: 'AES-256',
    purpose: 'Encrypt / Decrypt',
    currentVersion: 1,
    status: 'active',
    createdAt: '2026-04-29T23:52:51Z',
    nextRotationAt: '2026-07-29T23:52:51Z',
  },
  {
    name: 'HMAC_KEY_B64',
    slug: 'hmac-key-b64',
    algorithm: 'AES-256',
    purpose: 'Sign / Verify',
    currentVersion: 1,
    status: 'active',
    createdAt: '2026-04-29T23:52:51Z',
    nextRotationAt: '2026-07-29T23:52:51Z',
  },
  {
    name: 'ENCRYPTION_KEY',
    slug: 'encryption-key',
    algorithm: 'AES-256',
    purpose: 'Encrypt / Decrypt',
    currentVersion: 1,
    status: 'active',
    createdAt: '2026-04-29T23:52:51Z',
    nextRotationAt: '2026-07-29T23:52:51Z',
  },
  {
    name: 'JWT_EXTERNAL_TOKEN_PRIVATE_KEY_B64',
    slug: 'jwt-external-token-private-key-b64',
    algorithm: 'RSA-2048',
    purpose: 'Sign / Verify',
    currentVersion: 1,
    status: 'active',
    createdAt: '2026-04-29T23:52:51Z',
    nextRotationAt: '2026-07-29T23:52:51Z',
  },
  {
    name: 'AEAD_KEY_B64',
    slug: 'aead-key-b64',
    algorithm: 'AES-256',
    purpose: 'Encrypt / Decrypt',
    currentVersion: 1,
    status: 'active',
    createdAt: '2026-04-29T23:52:51Z',
    nextRotationAt: '2026-07-29T23:52:51Z',
  },
  {
    name: 'iam-master-key',
    slug: 'iam-master-key',
    algorithm: 'AES-256',
    purpose: 'Encrypt / Decrypt',
    currentVersion: 12,
    status: 'active',
    createdAt: '2026-01-15T09:00:00Z',
    nextRotationAt: '2026-05-05T00:00:00Z',
  },
  {
    name: 'compute-signing-key',
    slug: 'compute-signing-key',
    algorithm: 'RSA-4096',
    purpose: 'Sign / Verify',
    currentVersion: 3,
    status: 'deactivated',
    createdAt: '2025-12-03T10:30:00Z',
    nextRotationAt: '2026-07-15T00:00:00Z',
  },
  {
    name: 'container-wrap-key',
    slug: 'container-wrap-key',
    algorithm: 'RSA-2048',
    purpose: 'Encrypt / Decrypt',
    currentVersion: 8,
    status: 'archived',
    createdAt: '2025-07-22T03:20:00Z',
    nextRotationAt: null,
  },
  {
    name: 'container-edge-key',
    slug: 'container-edge-key',
    algorithm: 'AES-256',
    purpose: 'Encrypt / Decrypt',
    currentVersion: 1,
    status: 'archived',
    createdAt: '2025-02-11T13:00:00Z',
    nextRotationAt: null,
  },
];

const MOCK_CRYPTO_KEY_DETAILS: CryptoKeyDetail[] = [
  {
    ...MOCK_CRYPTO_KEYS[0],
    description: 'Symmetric key used for encrypting Kubernetes configuration.',
    tags: [
      { key: 'owner', value: 'container-service' },
      { key: 'environment', value: 'production' },
    ],
    keyring: 'container-infra-ring',
    createdBy: 'container-admin',
    updatedAt: '2026-04-20T11:30:00Z',
    lastUsedAt: '2026-04-28T14:22:00Z',
    autoRotationEnabled: true,
    rotationPeriodDays: 90,
    rotationHistory: [
      { version: 13, rotatedAt: '2026-04-29T23:52:51Z', status: 'active' },
      { version: 12, rotatedAt: '2026-01-30T23:52:51Z', status: 'deactivated' },
      { version: 11, rotatedAt: '2025-11-01T23:52:51Z', status: 'deactivated' },
      { version: 10, rotatedAt: '2025-08-03T23:52:51Z', status: 'deactivated' },
      { version: 9, rotatedAt: '2025-05-05T23:52:51Z', status: 'deactivated' },
      { version: 8, rotatedAt: '2025-02-04T23:52:51Z', status: 'archived' },
      { version: 7, rotatedAt: '2024-11-06T23:52:51Z', status: 'archived' },
      { version: 6, rotatedAt: '2024-08-08T23:52:51Z', status: 'archived' },
      { version: 5, rotatedAt: '2024-05-10T23:52:51Z', status: 'archived' },
      { version: 4, rotatedAt: '2024-02-10T23:52:51Z', status: 'destroyed' },
      { version: 3, rotatedAt: '2023-11-12T23:52:51Z', status: 'destroyed' },
      { version: 2, rotatedAt: '2023-08-14T23:52:51Z', status: 'destroyed' },
      { version: 1, rotatedAt: '2023-05-16T23:52:51Z', status: 'destroyed' },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[1],
    description: 'Fernet key used for encrypting Airflow DAG and connection information.',
    tags: [
      { key: 'owner', value: 'tkai-agents' },
      { key: 'environment', value: 'production' },
      { key: 'component', value: 'airflow' },
    ],
    keyring: 'ai-platform-ring',
    createdBy: 'platform-admin',
    updatedAt: '2026-03-15T08:00:00Z',
    lastUsedAt: '2026-04-29T06:45:00Z',
    autoRotationEnabled: false,
    rotationPeriodDays: 180,
    rotationHistory: [
      {
        version: 1,
        rotatedAt: '2026-04-29T23:52:51Z',
        status: 'active',
      },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[2],
    description: 'HMAC signing key used for verifying IAM internal token integrity.',
    tags: [
      { key: 'owner', value: 'iam' },
      { key: 'environment', value: 'production' },
      { key: 'criticality', value: 'high' },
    ],
    keyring: 'iam-signing-ring',
    createdBy: 'iam-service',
    updatedAt: '2026-04-10T02:00:00Z',
    lastUsedAt: '2026-04-30T00:01:00Z',
    autoRotationEnabled: true,
    rotationPeriodDays: 90,
    rotationHistory: [
      {
        version: 1,
        rotatedAt: '2026-04-29T23:52:51Z',
        status: 'active',
      },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[3],
    description: 'Fernet symmetric key for encrypting sensitive data in the AI platform.',
    tags: [
      { key: 'owner', value: 'ai-platform' },
      { key: 'environment', value: 'production' },
      { key: 'criticality', value: 'critical' },
    ],
    keyring: 'ai-platform-ring',
    createdBy: 'system',
    updatedAt: '2026-02-20T15:30:00Z',
    lastUsedAt: '2026-04-28T22:10:00Z',
    autoRotationEnabled: true,
    rotationPeriodDays: 60,
    rotationHistory: [
      {
        version: 1,
        rotatedAt: '2026-04-29T23:52:51Z',
        status: 'active',
      },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[4],
    description: 'Asymmetric key for RS256 signing of external integration JWT tokens.',
    tags: [
      { key: 'owner', value: 'iam' },
      { key: 'environment', value: 'production' },
      { key: 'criticality', value: 'critical' },
      { key: 'compliance', value: 'required' },
    ],
    keyring: 'iam-signing-ring',
    createdBy: 'iam-service',
    updatedAt: '2026-04-01T09:00:00Z',
    lastUsedAt: '2026-04-30T00:00:30Z',
    autoRotationEnabled: false,
    rotationPeriodDays: 365,
    rotationHistory: [
      {
        version: 1,
        rotatedAt: '2026-04-29T23:52:51Z',
        status: 'active',
      },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[5],
    description: 'AEAD key encrypting IAM STS tokens and session data with AES-256-GCM.',
    tags: [
      { key: 'owner', value: 'iam' },
      { key: 'environment', value: 'production' },
      { key: 'criticality', value: 'critical' },
    ],
    keyring: 'iam-encryption-ring',
    createdBy: 'iam-service',
    updatedAt: '2026-04-15T04:30:00Z',
    lastUsedAt: '2026-04-30T00:02:00Z',
    autoRotationEnabled: true,
    rotationPeriodDays: 90,
    rotationHistory: [
      {
        version: 1,
        rotatedAt: '2026-04-29T23:52:51Z',
        status: 'active',
      },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[6],
    description: 'Platform master key for encrypting IAM auth tokens and session data.',
    tags: [
      { key: 'owner', value: 'iam-platform' },
      { key: 'environment', value: 'production' },
      { key: 'criticality', value: 'high' },
    ],
    keyring: 'platform-core-ring',
    createdBy: 'system',
    updatedAt: '2026-04-19T08:10:00Z',
    lastUsedAt: '2026-04-27T02:15:00Z',
    autoRotationEnabled: true,
    rotationPeriodDays: 90,
    rotationHistory: [
      {
        version: 12,
        rotatedAt: '2026-02-04T00:00:00Z',
        status: 'active',
      },
      {
        version: 11,
        rotatedAt: '2025-11-06T00:00:00Z',
        status: 'deactivated',
      },
      {
        version: 10,
        rotatedAt: '2025-08-08T00:00:00Z',
        status: 'deactivated',
      },
      {
        version: 9,
        rotatedAt: '2025-05-10T00:00:00Z',
        status: 'archived',
      },
      {
        version: 8,
        rotatedAt: '2025-02-09T00:00:00Z',
        status: 'archived',
      },
      {
        version: 7,
        rotatedAt: '2024-11-11T00:00:00Z',
        status: 'destroyed',
      },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[7],
    description: 'Asymmetric key used for verifying Compute image signatures.',
    tags: [
      { key: 'owner', value: 'compute' },
      { key: 'environment', value: 'production' },
    ],
    keyring: 'compute-security-ring',
    createdBy: 'compute-service',
    updatedAt: '2026-03-18T14:40:00Z',
    lastUsedAt: '2026-04-21T11:02:00Z',
    autoRotationEnabled: false,
    rotationPeriodDays: 180,
    rotationHistory: [
      {
        version: 3,
        rotatedAt: '2026-01-15T00:00:00Z',
        status: 'active',
      },
      {
        version: 2,
        rotatedAt: '2025-08-10T00:00:00Z',
        status: 'deactivated',
      },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[8],
    description: 'Archived key retained for container secret wrapping purposes.',
    tags: [
      { key: 'owner', value: 'container' },
      { key: 'retention', value: 'archive' },
    ],
    keyring: 'container-archive-ring',
    createdBy: 'container-service',
    updatedAt: '2026-01-03T01:20:00Z',
    lastUsedAt: '2025-12-28T09:35:00Z',
    autoRotationEnabled: false,
    rotationPeriodDays: 365,
    rotationHistory: [
      {
        version: 8,
        rotatedAt: '2025-07-22T03:20:00Z',
        status: 'active',
      },
    ],
  },
  {
    ...MOCK_CRYPTO_KEYS[9],
    description: 'Encryption key for edge cluster — fully destroyed.',
    tags: [{ key: 'owner', value: 'container' }],
    keyring: 'container-edge-ring',
    createdBy: 'container-service',
    updatedAt: '2025-03-12T06:00:00Z',
    lastUsedAt: null,
    autoRotationEnabled: false,
    rotationPeriodDays: 90,
    rotationHistory: [],
  },
];

let currentKeys = [...MOCK_CRYPTO_KEYS];
let currentKeyDetails = [...MOCK_CRYPTO_KEY_DETAILS];
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

const matchesArrayFilter = <T extends string>(value: T, selected?: T[]): boolean => {
  if (!selected || selected.length === 0) return true;
  return selected.includes(value);
};

export const listMockCryptoKeys = async (
  params: CryptoKeyListParams
): Promise<CryptoKeyListResult> => {
  await delay(responseDelayMs);

  const filtered = currentKeys
    .filter((item) => {
      const matchesSearch =
        !params.search ||
        [item.name, item.algorithm, item.purpose].some((value) =>
          includesAny(value, params.search)
        );

      return (
        matchesSearch &&
        matchesArrayFilter(item.algorithm, params.algorithms) &&
        matchesArrayFilter(item.purpose, params.purposes) &&
        matchesArrayFilter(item.status, params.statuses)
      );
    })
    .sort((left, right) => {
      const direction = params.sortOrder === 'asc' ? 1 : -1;
      const leftValue = toTimestamp(left[params.sortBy ?? 'createdAt']);
      const rightValue = toTimestamp(right[params.sortBy ?? 'createdAt']);

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

export const getMockCryptoKeyBySlug = async (slug: string): Promise<CryptoKeyDetail | null> => {
  await delay(responseDelayMs);
  return currentKeyDetails.find((item) => item.slug === slug) ?? null;
};

export const resetMockCryptoKeys = (): void => {
  currentKeys = [...MOCK_CRYPTO_KEYS];
  currentKeyDetails = [...MOCK_CRYPTO_KEY_DETAILS];
  responseDelayMs = DEFAULT_DELAY_MS;
};

export const setMockCryptoKeys = (items: CryptoKeySummary[]): void => {
  currentKeys = [...items];
  currentKeyDetails = items.map((item) => ({
    ...item,
    status: item.status ?? 'active',
    description: '',
    tags: [],
    keyring: '-',
    createdBy: '-',
    updatedAt: null,
    lastUsedAt: null,
    autoRotationEnabled: false,
    rotationPeriodDays: 90,
    rotationHistory: [],
  }));
};

export const updateMockCryptoKeyStatus = async (
  slug: string,
  status: EncryptionKeyState
): Promise<void> => {
  await delay(responseDelayMs);
  currentKeys = currentKeys.map((k) => (k.slug === slug ? { ...k, status } : k));
  currentKeyDetails = currentKeyDetails.map((d) => (d.slug === slug ? { ...d, status } : d));
};

export const rotateMockCryptoKey = async (slug: string): Promise<void> => {
  await delay(responseDelayMs);
  const now = new Date().toISOString();
  currentKeyDetails = currentKeyDetails.map((d) => {
    if (d.slug !== slug) return d;
    const nextVersion = (d.rotationHistory[0]?.version ?? 0) + 1;
    const updatedHistory = d.rotationHistory.map((h) =>
      h.status === 'active' ? { ...h, status: 'deactivated' as const } : h
    );
    return {
      ...d,
      updatedAt: now,
      rotationHistory: [
        { version: nextVersion, rotatedAt: now, status: 'active' as const },
        ...updatedHistory,
      ],
    };
  });
  currentKeys = currentKeys.map((k) =>
    k.slug === slug
      ? {
          ...k,
          currentVersion: (k.currentVersion ?? 0) + 1,
          updatedAt: now,
        }
      : k
  );
};

export const setMockCryptoKeysDelay = (ms: number): void => {
  responseDelayMs = ms;
};
