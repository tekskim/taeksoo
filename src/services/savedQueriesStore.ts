export type SavedQuery = {
  id: string;
  name: string;
  query: string;
  appId: string;
  levels: string[];
  partition: string;
  ownerUserId: string;
  ownerTenantId: string;
  domainId: string;
  createdAt: string;
};

type SavedQueryPayload = {
  name: string;
  query: string;
  appId: string;
  levels: string[];
  partition: string;
};

type SavedQueryContext = {
  userId: string;
  tenantId: string;
  domainId: string;
};

type CreateSavedQueryResult =
  | { ok: true; savedQuery: SavedQuery }
  | { ok: false; reason: 'duplicate-name'; conflictingQueryId: string };

const STORAGE_KEY = 'log-alert:saved-queries:v3';
const CONTEXT_USER_ID_KEY = 'log-alert:current-user-id';
const CONTEXT_TENANT_ID_KEY = 'log-alert:current-tenant-id';
const CONTEXT_DOMAIN_ID_KEY = 'log-alert:current-domain-id';
const DEFAULT_CONTEXT: SavedQueryContext = {
  userId: 'user-seoyeon',
  tenantId: 'tenant-alpha',
  domainId: 'domain-thaki',
};

const DEFAULT_SAVED_QUERIES: SavedQuery[] = [
  {
    id: 'sq-01',
    name: 'Critical errors (compute)',
    query: 'timeout',
    appId: 'compute',
    levels: ['ERROR', 'CRITICAL'],
    partition: 'prod',
    ownerUserId: DEFAULT_CONTEXT.userId,
    ownerTenantId: DEFAULT_CONTEXT.tenantId,
    domainId: DEFAULT_CONTEXT.domainId,
    createdAt: '2026-04-20T09:25:00.000Z',
  },
  {
    id: 'sq-02',
    name: 'Ceph warnings',
    query: 'retry',
    appId: 'ceph',
    levels: ['WARN'],
    partition: 'monitoring',
    ownerUserId: DEFAULT_CONTEXT.userId,
    ownerTenantId: DEFAULT_CONTEXT.tenantId,
    domainId: DEFAULT_CONTEXT.domainId,
    createdAt: '2026-04-20T09:31:00.000Z',
  },
];

const hasWindow = (): boolean => typeof window !== 'undefined';

const getSavedQueryContext = (): SavedQueryContext => {
  if (!hasWindow()) {
    return DEFAULT_CONTEXT;
  }
  return {
    userId: window.localStorage.getItem(CONTEXT_USER_ID_KEY) ?? DEFAULT_CONTEXT.userId,
    tenantId: window.localStorage.getItem(CONTEXT_TENANT_ID_KEY) ?? DEFAULT_CONTEXT.tenantId,
    domainId: window.localStorage.getItem(CONTEXT_DOMAIN_ID_KEY) ?? DEFAULT_CONTEXT.domainId,
  };
};

const normalizeSavedQuery = (value: unknown): SavedQuery | null => {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.id !== 'string' ||
    typeof raw.name !== 'string' ||
    typeof raw.query !== 'string' ||
    typeof raw.createdAt !== 'string'
  ) {
    return null;
  }
  const context = getSavedQueryContext();
  const levels = Array.isArray(raw.levels)
    ? (raw.levels as unknown[]).filter((l): l is string => typeof l === 'string')
    : typeof raw.levels === 'string'
      ? (raw.levels as string)
          .split(',')
          .map((l: string) => l.trim())
          .filter((l: string) => l.length > 0)
      : [];
  return {
    id: raw.id,
    name: raw.name,
    query: raw.query,
    appId: typeof raw.appId === 'string' ? raw.appId : '',
    levels,
    partition: typeof raw.partition === 'string' ? raw.partition : '',
    ownerUserId: typeof raw.ownerUserId === 'string' ? raw.ownerUserId : context.userId,
    ownerTenantId: typeof raw.ownerTenantId === 'string' ? raw.ownerTenantId : context.tenantId,
    domainId: typeof raw.domainId === 'string' ? raw.domainId : context.domainId,
    createdAt: raw.createdAt,
  };
};

const readSavedQueries = (): SavedQuery[] => {
  if (!hasWindow()) return [...DEFAULT_SAVED_QUERIES];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...DEFAULT_SAVED_QUERIES];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...DEFAULT_SAVED_QUERIES];
    const validItems = parsed
      .map(normalizeSavedQuery)
      .filter((item): item is SavedQuery => item !== null);
    return validItems.length > 0 ? validItems : [...DEFAULT_SAVED_QUERIES];
  } catch {
    return [...DEFAULT_SAVED_QUERIES];
  }
};

const writeSavedQueries = (savedQueries: SavedQuery[]): void => {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedQueries));
};

const sortDescByCreatedAt = (savedQueries: SavedQuery[]): SavedQuery[] =>
  [...savedQueries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const isVisibleToContext = (savedQuery: SavedQuery, context: SavedQueryContext): boolean => {
  if (savedQuery.domainId !== context.domainId) return false;
  return savedQuery.ownerUserId === context.userId;
};

export const getSavedQueries = (): SavedQuery[] => {
  const context = getSavedQueryContext();
  return sortDescByCreatedAt(
    readSavedQueries().filter((item) => isVisibleToContext(item, context))
  );
};

export const createSavedQuery = (payload: SavedQueryPayload): CreateSavedQueryResult => {
  const context = getSavedQueryContext();
  const visibleQueries = getSavedQueries();
  const normalizedName = payload.name.trim().toLowerCase();
  const duplicate = visibleQueries.find(
    (item) => item.name.trim().toLowerCase() === normalizedName
  );
  if (duplicate) {
    return { ok: false, reason: 'duplicate-name', conflictingQueryId: duplicate.id };
  }

  const now = new Date().toISOString();
  const nextSavedQuery: SavedQuery = {
    id: `sq-${Date.now()}`,
    name: payload.name.trim(),
    query: payload.query.trim(),
    appId: payload.appId.trim(),
    levels: payload.levels,
    partition: payload.partition.trim(),
    ownerUserId: context.userId,
    ownerTenantId: context.tenantId,
    domainId: context.domainId,
    createdAt: now,
  };
  const nextSavedQueries = [nextSavedQuery, ...readSavedQueries()];
  writeSavedQueries(nextSavedQueries);
  return { ok: true, savedQuery: nextSavedQuery };
};

export const updateSavedQuery = (
  id: string,
  payload: Pick<SavedQueryPayload, 'name' | 'query' | 'appId' | 'levels' | 'partition'>
): SavedQuery | null => {
  const context = getSavedQueryContext();
  const sourceSavedQueries = readSavedQueries();
  const nextSavedQueries = sourceSavedQueries.map((item) => {
    if (item.id !== id) return item;
    if (!canManageSavedQuery(item, context)) {
      return item;
    }
    return {
      ...item,
      name: payload.name.trim(),
      query: payload.query.trim(),
      appId: payload.appId.trim(),
      levels: payload.levels,
      partition: payload.partition.trim(),
    };
  });
  const updated = nextSavedQueries.find((item) => item.id === id) ?? null;
  if (!updated || !canManageSavedQuery(updated, context)) {
    return null;
  }
  writeSavedQueries(sortDescByCreatedAt(nextSavedQueries));
  return updated;
};

export const deleteSavedQuery = (id: string): SavedQuery[] => {
  const context = getSavedQueryContext();
  const sourceSavedQueries = readSavedQueries();
  const target = sourceSavedQueries.find((item) => item.id === id);
  if (target && !canManageSavedQuery(target, context)) {
    return getSavedQueries();
  }
  const nextSavedQueries = sourceSavedQueries.filter((item) => item.id !== id);
  writeSavedQueries(nextSavedQueries);
  return getSavedQueries();
};

export const canManageSavedQuery = (
  savedQuery: SavedQuery,
  context: SavedQueryContext = getSavedQueryContext()
): boolean => {
  if (savedQuery.domainId !== context.domainId) return false;
  return savedQuery.ownerUserId === context.userId;
};
