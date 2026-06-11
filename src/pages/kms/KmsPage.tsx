import { useState, useMemo, useCallback } from 'react';
import {
  PageShell,
  TabBar,
  TopBar,
  Breadcrumb,
  VStack,
  MenuItem,
  Table,
  type TableColumn,
  Pagination,
  SearchInput,
  SectionCard,
} from '@/design-system';
import { AppSwitcher } from '@/components/AppSwitcher';
import { useTabs } from '@/contexts/TabContext';
import { IconHome, IconKey, IconLock, IconCertificate } from '@tabler/icons-react';

/* ─────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────── */

type KmsPage = 'overview' | 'keys' | 'secrets' | 'certificates';

type EncryptionKeyState = 'active' | 'deactivated' | 'archived' | 'destroyed';
type SecretState = 'active' | 'expired' | 'deactivated' | 'deleted' | 'destroyed';
type CertificateStatus = 'active' | 'expiring' | 'expired' | 'revoked';

interface CryptoKeySummary {
  name: string;
  slug: string;
  domain: string;
  algorithm: 'AES-256' | 'RSA-2048' | 'RSA-4096';
  purpose: 'Encrypt / Decrypt' | 'Sign / Verify';
  currentVersion: number;
  status: EncryptionKeyState;
  createdAt: string | null;
  nextRotationAt: string | null;
}

interface SecretSummary {
  name: string;
  slug: string;
  domain: string;
  currentVersion: number;
  status: SecretState;
  updatedAt: string | null;
}

interface CertificateSummary {
  id: string;
  commonName: string;
  domain: string;
  status: CertificateStatus;
  issuedAt: string;
  expiresAt: string;
  daysRemaining: number;
  issuerCa: string;
}

/* ─────────────────────────────────────────────────────────────────
   Mock Data
   ───────────────────────────────────────────────────────────────── */

const MOCK_KEYS: CryptoKeySummary[] = [
  {
    name: 'kube_config_key',
    slug: 'kube-config-key',
    domain: 'domain-001',
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
    domain: 'domain-001',
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
    domain: 'domain-001',
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
    domain: 'domain-001',
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
    domain: 'domain-001',
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
    domain: 'domain-001',
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
    domain: 'domain-001',
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
    domain: 'domain-001',
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
    domain: 'domain-001',
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
    domain: 'domain-001',
    algorithm: 'AES-256',
    purpose: 'Encrypt / Decrypt',
    currentVersion: 1,
    status: 'archived',
    createdAt: '2025-02-11T13:00:00Z',
    nextRotationAt: null,
  },
];

const MOCK_SECRETS: SecretSummary[] = [
  {
    name: 'GITHUB_TOKEN',
    slug: 'github-token',
    domain: 'domain-002',
    currentVersion: 4,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 's3_secret_access_key',
    slug: 's3-secret-access-key',
    domain: 'domain-004',
    currentVersion: 2,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'KC_CLIENT_SECRET',
    slug: 'kc-client-secret',
    domain: 'domain-003',
    currentVersion: 1,
    status: 'deactivated',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'OPENAI_API_KEY',
    slug: 'openai-api-key',
    domain: 'domain-002',
    currentVersion: 5,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'REDIS_PASSWORD',
    slug: 'redis-password',
    domain: 'domain-003',
    currentVersion: 2,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'postgresql.password',
    slug: 'postgresql-password',
    domain: 'domain-002',
    currentVersion: 3,
    status: 'active',
    updatedAt: '2026-04-29T23:52:51Z',
  },
  {
    name: 'valkey-auth',
    slug: 'valkey-auth',
    domain: 'domain-001',
    currentVersion: 5,
    status: 'active',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'postgresql-superuser-auth',
    slug: 'postgresql-superuser-auth',
    domain: 'domain-001',
    currentVersion: 1,
    status: 'expired',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'postgresql-app-auth',
    slug: 'postgresql-app-auth',
    domain: 'domain-001',
    currentVersion: 3,
    status: 'active',
    updatedAt: '2026-04-29T23:48:01Z',
  },
  {
    name: 'harbor-admin-password',
    slug: 'harbor-admin-password',
    domain: 'domain-001',
    currentVersion: 2,
    status: 'active',
    updatedAt: '2026-04-27T10:00:00Z',
  },
  {
    name: 'airflow-fernet-key',
    slug: 'airflow-fernet-key',
    domain: 'domain-002',
    currentVersion: 1,
    status: 'deactivated',
    updatedAt: '2026-03-15T09:00:00Z',
  },
  {
    name: 'smtp-auth-password',
    slug: 'smtp-auth-password',
    domain: 'domain-003',
    currentVersion: 2,
    status: 'active',
    updatedAt: '2026-04-20T14:00:00Z',
  },
];

const MOCK_CERTIFICATES: CertificateSummary[] = [
  {
    id: 'cert-auth-svc',
    commonName: 'auth-service.kms.svc',
    domain: 'mgmt_cluster',
    status: 'active',
    issuedAt: '2026-01-10T09:00:00+09:00',
    expiresAt: '2027-01-10T08:59:59+09:00',
    daysRemaining: 257,
    issuerCa: 'Thaki Workload CA',
  },
  {
    id: 'cert-frontend',
    commonName: 'frontend-gateway.kms.svc',
    domain: 'mgmt_cluster',
    status: 'expired',
    issuedAt: '2024-02-01T09:00:00+09:00',
    expiresAt: '2026-02-01T08:59:59+09:00',
    daysRemaining: -86,
    issuerCa: 'Thaki Workload CA',
  },
  {
    id: 'cert-payment',
    commonName: 'payment-api.kms.svc',
    domain: 'mgmt_cluster',
    status: 'revoked',
    issuedAt: '2025-09-01T09:00:00+09:00',
    expiresAt: '2026-09-01T08:59:59+09:00',
    daysRemaining: 126,
    issuerCa: 'Thaki Workload CA',
  },
  {
    id: 'cert-metrics',
    commonName: 'metrics-svc.internal',
    domain: 'workload_cluster',
    status: 'expiring',
    issuedAt: '2025-12-01T09:00:00+09:00',
    expiresAt: '2026-06-15T08:59:59+09:00',
    daysRemaining: 10,
    issuerCa: 'Thaki Workload CA',
  },
  {
    id: 'cert-iam-token',
    commonName: 'iam-token-svc.internal',
    domain: 'mgmt_cluster',
    status: 'active',
    issuedAt: '2026-02-15T09:00:00+09:00',
    expiresAt: '2027-02-15T08:59:59+09:00',
    daysRemaining: 285,
    issuerCa: 'Thaki Root CA',
  },
  {
    id: 'cert-kube-api',
    commonName: 'kube-api.thakicloud.net',
    domain: 'mgmt_cluster',
    status: 'active',
    issuedAt: '2026-03-01T09:00:00+09:00',
    expiresAt: '2027-03-01T08:59:59+09:00',
    daysRemaining: 299,
    issuerCa: 'Thaki Root CA',
  },
  {
    id: 'cert-compute-node',
    commonName: 'compute-node-01.internal',
    domain: 'workload_cluster',
    status: 'expiring',
    issuedAt: '2025-11-15T09:00:00+09:00',
    expiresAt: '2026-06-20T08:59:59+09:00',
    daysRemaining: 15,
    issuerCa: 'Thaki Workload CA',
  },
  {
    id: 'cert-storage-gw',
    commonName: 'storage-gw.internal',
    domain: 'workload_cluster',
    status: 'active',
    issuedAt: '2026-04-01T09:00:00+09:00',
    expiresAt: '2027-04-01T08:59:59+09:00',
    daysRemaining: 300,
    issuerCa: 'Thaki Workload CA',
  },
];

/* ─────────────────────────────────────────────────────────────────
   Helper: Status Badge
   ───────────────────────────────────────────────────────────────── */

const KEY_STATUS_CONFIG: Record<
  EncryptionKeyState,
  { label: string; variant: 'success' | 'warning' | 'muted' | 'danger' }
> = {
  active: { label: 'Active', variant: 'success' },
  deactivated: { label: 'Deactivated', variant: 'warning' },
  archived: { label: 'Archived', variant: 'muted' },
  destroyed: { label: 'Destroyed', variant: 'danger' },
};

const SECRET_STATUS_CONFIG: Record<
  SecretState,
  { label: string; variant: 'success' | 'warning' | 'muted' | 'danger' }
> = {
  active: { label: 'Active', variant: 'success' },
  expired: { label: 'Expired', variant: 'danger' },
  deactivated: { label: 'Deactivated', variant: 'warning' },
  deleted: { label: 'Deleted', variant: 'muted' },
  destroyed: { label: 'Destroyed', variant: 'danger' },
};

const CERT_STATUS_CONFIG: Record<
  CertificateStatus,
  { label: string; variant: 'success' | 'warning' | 'muted' | 'danger' }
> = {
  active: { label: 'Active', variant: 'success' },
  expiring: { label: 'Expiring', variant: 'warning' },
  expired: { label: 'Expired', variant: 'danger' },
  revoked: { label: 'Revoked', variant: 'muted' },
};

function StatusBadge({
  status,
  config,
}: {
  status: string;
  config: Record<string, { label: string; variant: 'success' | 'warning' | 'muted' | 'danger' }>;
}) {
  const cfg = config[status];
  if (!cfg) return <span className="text-[var(--color-text-secondary)] text-xs">-</span>;

  const colorMap = {
    success: 'text-[var(--color-status-success)] bg-[var(--color-status-success-subtle)]',
    warning: 'text-[var(--color-status-warning)] bg-[var(--color-status-warning-subtle)]',
    danger: 'text-[var(--color-status-error)] bg-[var(--color-status-error-subtle)]',
    muted: 'text-[var(--color-text-secondary)] bg-[var(--color-surface-subtle)]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[cfg.variant]}`}
    >
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/* ─────────────────────────────────────────────────────────────────
   Sidebar
   ───────────────────────────────────────────────────────────────── */

interface KmsSidebarProps {
  activePage: KmsPage;
  onNavigate: (page: KmsPage) => void;
  onToggle?: () => void;
}

function KmsSidebar({ activePage, onNavigate, onToggle }: KmsSidebarProps) {
  const navItems: { id: KmsPage; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <IconHome size={16} stroke={1.5} /> },
    { id: 'keys', label: 'Encryption Keys', icon: <IconKey size={16} stroke={1.5} /> },
    { id: 'secrets', label: 'Secrets', icon: <IconLock size={16} stroke={1.5} /> },
    { id: 'certificates', label: 'Certificates', icon: <IconCertificate size={16} stroke={1.5} /> },
  ];

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="kms" onToggleSidebar={onToggle} />
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6 sidebar-scroll">
        <VStack gap={2} className="w-full min-w-0">
          {navItems.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={`/kms/${item.id}`}
              active={activePage === item.id}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
              }}
            />
          ))}
        </VStack>
      </nav>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Dashboard Page
   ───────────────────────────────────────────────────────────────── */

function KmsDashboard() {
  const keyStats = useMemo(() => {
    const total = MOCK_KEYS.length;
    const active = MOCK_KEYS.filter((k) => k.status === 'active').length;
    const withRotation = MOCK_KEYS.filter((k) => k.nextRotationAt !== null).length;
    const overdueNow = Date.now();
    const overdue = MOCK_KEYS.filter(
      (k) => k.nextRotationAt && new Date(k.nextRotationAt).getTime() < overdueNow
    );
    return { total, active, withRotation, overdue };
  }, []);

  const certStats = useMemo(() => {
    const counts = { active: 0, expiring: 0, expired: 0, revoked: 0 };
    MOCK_CERTIFICATES.forEach((c) => {
      counts[c.status as keyof typeof counts]++;
    });
    return counts;
  }, []);

  const secretStats = useMemo(() => {
    const counts = { active: 0, expired: 0, deactivated: 0, deleted: 0 };
    MOCK_SECRETS.forEach((s) => {
      if (s.status in counts) counts[s.status as keyof typeof counts]++;
    });
    return counts;
  }, []);

  const attentionCerts = MOCK_CERTIFICATES.filter(
    (c) => c.status === 'expiring' || c.status === 'expired'
  ).sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="flex flex-col gap-6">
      {/* Encryption Keys */}
      <SectionCard>
        <SectionCard.Header title={`Encryption Keys (${keyStats.total})`} />
        <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4 flex flex-col gap-4 w-full">
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-2">
              Rotation Schedule
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-status-success)]" />
                <span className="text-xs text-[var(--color-text-secondary)]">
                  Scheduled: {keyStats.withRotation} (
                  {keyStats.total > 0
                    ? Math.round((keyStats.withRotation / keyStats.total) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-border-default)]" />
                <span className="text-xs text-[var(--color-text-secondary)]">
                  Not scheduled: {keyStats.total - keyStats.withRotation} (
                  {keyStats.total > 0
                    ? Math.round(((keyStats.total - keyStats.withRotation) / keyStats.total) * 100)
                    : 0}
                  %)
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-border-subtle)]" />

          <div>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-2">
              Rotation Overdue ({keyStats.overdue.length})
            </p>
            {keyStats.overdue.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)] italic">No overdue keys</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <th className="text-left py-1.5 pr-4 text-[var(--color-text-secondary)] font-medium">
                        Name
                      </th>
                      <th className="text-left py-1.5 pr-4 text-[var(--color-text-secondary)] font-medium">
                        Algorithm
                      </th>
                      <th className="text-left py-1.5 text-[var(--color-text-secondary)] font-medium">
                        Overdue since
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyStats.overdue.slice(0, 5).map((key) => (
                      <tr
                        key={key.slug}
                        className="border-b border-[var(--color-border-subtle)] last:border-0"
                      >
                        <td className="py-1.5 pr-4 text-[var(--color-primary-default)] hover:underline cursor-pointer truncate max-w-[160px]">
                          {key.name}
                        </td>
                        <td className="py-1.5 pr-4 font-mono text-[var(--color-text-secondary)]">
                          {key.algorithm}
                        </td>
                        <td className="py-1.5 text-[var(--color-status-error)] font-mono">
                          {formatDate(key.nextRotationAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Certificates */}
      <SectionCard>
        <SectionCard.Header title={`Certificates (${MOCK_CERTIFICATES.length})`} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4 w-full">
          {(
            [
              {
                label: 'Active',
                value: certStats.active,
                color: 'text-[var(--color-status-success)]',
                bg: 'bg-[var(--color-status-success-subtle)]',
              },
              {
                label: 'Expiring soon',
                value: certStats.expiring,
                color: 'text-[var(--color-status-warning)]',
                bg: 'bg-[var(--color-status-warning-subtle)]',
              },
              {
                label: 'Expired',
                value: certStats.expired,
                color: 'text-[var(--color-status-error)]',
                bg: 'bg-[var(--color-status-error-subtle)]',
              },
              {
                label: 'Revoked',
                value: certStats.revoked,
                color: 'text-[var(--color-text-secondary)]',
                bg: 'bg-[var(--color-surface-subtle)]',
              },
            ] as const
          ).map((item) => (
            <div key={item.label} className={`rounded-lg p-3 ${item.bg}`}>
              <p className={`text-xs font-medium ${item.color}`}>{item.label}</p>
              <p className={`text-2xl font-bold ${item.color} mt-1`}>{item.value}</p>
            </div>
          ))}
        </div>

        {attentionCerts.length > 0 && (
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-2">
              Requiring attention
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <th className="text-left py-1.5 pr-4 text-[var(--color-text-secondary)] font-medium">
                      Name
                    </th>
                    <th className="text-left py-1.5 pr-4 text-[var(--color-text-secondary)] font-medium">
                      Status
                    </th>
                    <th className="text-left py-1.5 pr-4 text-[var(--color-text-secondary)] font-medium">
                      Days remaining
                    </th>
                    <th className="text-left py-1.5 text-[var(--color-text-secondary)] font-medium">
                      Expires at
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attentionCerts.slice(0, 5).map((cert) => (
                    <tr
                      key={cert.id}
                      className="border-b border-[var(--color-border-subtle)] last:border-0"
                    >
                      <td className="py-1.5 pr-4 text-[var(--color-primary-default)] hover:underline cursor-pointer">
                        {cert.commonName}
                      </td>
                      <td className="py-1.5 pr-4">
                        <StatusBadge status={cert.status} config={CERT_STATUS_CONFIG} />
                      </td>
                      <td
                        className={`py-1.5 pr-4 font-medium ${cert.daysRemaining < 0 ? 'text-[var(--color-status-error)]' : 'text-[var(--color-status-warning)]'}`}
                      >
                        {cert.daysRemaining} days
                      </td>
                      <td className="py-1.5 text-[var(--color-text-secondary)]">
                        {formatDate(cert.expiresAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Secrets */}
      <SectionCard>
        <SectionCard.Header title={`Secrets (${MOCK_SECRETS.length})`} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 w-full">
          {(
            [
              {
                label: 'Active',
                value: secretStats.active,
                color: 'text-[var(--color-status-success)]',
                bg: 'bg-[var(--color-status-success-subtle)]',
              },
              {
                label: 'Expired',
                value: secretStats.expired,
                color: 'text-[var(--color-status-error)]',
                bg: 'bg-[var(--color-status-error-subtle)]',
              },
              {
                label: 'Deactivated',
                value: secretStats.deactivated,
                color: 'text-[var(--color-status-warning)]',
                bg: 'bg-[var(--color-status-warning-subtle)]',
              },
              {
                label: 'Deleted',
                value: secretStats.deleted,
                color: 'text-[var(--color-text-secondary)]',
                bg: 'bg-[var(--color-surface-subtle)]',
              },
            ] as const
          ).map((item) => (
            <div key={item.label} className={`rounded-lg p-3 ${item.bg}`}>
              <p className={`text-xs font-medium ${item.color}`}>{item.label}</p>
              <p className={`text-2xl font-bold ${item.color} mt-1`}>{item.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Encryption Keys List
   ───────────────────────────────────────────────────────────────── */

const PAGE_SIZE = 10;

function CryptoKeyListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_KEYS;
    const q = search.toLowerCase();
    return MOCK_KEYS.filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.algorithm.toLowerCase().includes(q) ||
        k.domain.toLowerCase().includes(q)
    );
  }, [search]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: TableColumn<CryptoKeySummary>[] = [
    {
      key: 'name',
      label: 'Key name',
      width: '200px',
      render: (_, row) => (
        <span className="text-[var(--color-primary-default)] hover:underline cursor-pointer truncate block max-w-[180px]">
          {row.name}
        </span>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
      width: '120px',
      render: (_, row) => <span className="truncate block">{row.domain}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (_, row) => <StatusBadge status={row.status} config={KEY_STATUS_CONFIG} />,
    },
    {
      key: 'algorithm',
      label: 'Algorithm',
      width: '110px',
      render: (_, row) => <span className="font-mono text-xs">{row.algorithm}</span>,
    },
    {
      key: 'purpose',
      label: 'Key purpose',
      width: '150px',
      render: (_, row) => <span className="truncate block">{row.purpose}</span>,
    },
    {
      key: 'currentVersion',
      label: 'Version',
      width: '80px',
      align: 'center',
      render: (_, row) => <span className="font-mono text-xs">v{row.currentVersion}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      width: '130px',
      sortable: true,
      render: (_, row) => (
        <span className="text-xs text-[var(--color-text-secondary)]">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'nextRotationAt',
      label: 'Next rotation',
      width: '130px',
      sortable: true,
      render: (_, row) => {
        if (!row.nextRotationAt)
          return <span className="text-xs text-[var(--color-text-muted)]">-</span>;
        const isOverdue = new Date(row.nextRotationAt).getTime() < Date.now();
        return (
          <span
            className={`text-xs ${isOverdue ? 'text-[var(--color-status-error)] font-medium' : 'text-[var(--color-text-secondary)]'}`}
          >
            {formatDate(row.nextRotationAt)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-[var(--color-text-primary)]">
          Encryption Keys
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, algorithm, domain…"
          className="w-[320px]"
        />
      </div>

      <Pagination
        totalCount={filtered.length}
        totalItems={filtered.length}
        size={PAGE_SIZE}
        currentAt={page}
        onPageChange={setPage}
      />

      <Table
        columns={columns}
        data={pageItems}
        rowKey="slug"
        stickyHeader
        emptyMessage={search ? 'No keys match your search.' : 'No encryption keys found.'}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Secrets List
   ───────────────────────────────────────────────────────────────── */

function SecretListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_SECRETS;
    const q = search.toLowerCase();
    return MOCK_SECRETS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q)
    );
  }, [search]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: TableColumn<SecretSummary>[] = [
    {
      key: 'name',
      label: 'Secret name',
      width: '220px',
      render: (_, row) => (
        <span className="text-[var(--color-primary-default)] hover:underline cursor-pointer truncate block max-w-[200px]">
          {row.name}
        </span>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
      width: '120px',
      render: (_, row) => <span className="truncate block">{row.domain}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (_, row) => <StatusBadge status={row.status} config={SECRET_STATUS_CONFIG} />,
    },
    {
      key: 'currentVersion',
      label: 'Version',
      width: '80px',
      align: 'center',
      render: (_, row) => <span className="font-mono text-xs">v{row.currentVersion}</span>,
    },
    {
      key: 'updatedAt',
      label: 'Last updated',
      width: '140px',
      sortable: true,
      render: (_, row) => (
        <span className="text-xs text-[var(--color-text-secondary)]">
          {formatDate(row.updatedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-[var(--color-text-primary)]">Secrets</h1>
      </div>

      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or domain…"
          className="w-[320px]"
        />
      </div>

      <Pagination
        totalCount={filtered.length}
        totalItems={filtered.length}
        size={PAGE_SIZE}
        currentAt={page}
        onPageChange={setPage}
      />

      <Table
        columns={columns}
        data={pageItems}
        rowKey="slug"
        stickyHeader
        emptyMessage={search ? 'No secrets match your search.' : 'No secrets found.'}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Certificates List
   ───────────────────────────────────────────────────────────────── */

function CertificateListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_CERTIFICATES;
    const q = search.toLowerCase();
    return MOCK_CERTIFICATES.filter(
      (c) => c.commonName.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q)
    );
  }, [search]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: TableColumn<CertificateSummary>[] = [
    {
      key: 'commonName',
      label: 'Common name',
      width: '240px',
      render: (_, row) => (
        <span className="text-[var(--color-primary-default)] hover:underline cursor-pointer truncate block max-w-[220px]">
          {row.commonName}
        </span>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
      width: '140px',
      render: (_, row) => <span className="truncate block">{row.domain}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (_, row) => <StatusBadge status={row.status} config={CERT_STATUS_CONFIG} />,
    },
    {
      key: 'daysRemaining',
      label: 'Days remaining',
      width: '120px',
      align: 'right',
      sortable: true,
      render: (_, row) => {
        const isNegative = row.daysRemaining < 0;
        const isWarning = !isNegative && row.daysRemaining <= 30;
        return (
          <span
            className={`text-xs font-medium ${isNegative ? 'text-[var(--color-status-error)]' : isWarning ? 'text-[var(--color-status-warning)]' : 'text-[var(--color-text-secondary)]'}`}
          >
            {row.daysRemaining} d
          </span>
        );
      },
    },
    {
      key: 'issuedAt',
      label: 'Issued at',
      width: '130px',
      render: (_, row) => (
        <span className="text-xs text-[var(--color-text-secondary)]">
          {formatDate(row.issuedAt)}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'Expires at',
      width: '130px',
      sortable: true,
      render: (_, row) => (
        <span className="text-xs text-[var(--color-text-secondary)]">
          {formatDate(row.expiresAt)}
        </span>
      ),
    },
    {
      key: 'issuerCa',
      label: 'Issuer CA',
      width: '160px',
      render: (_, row) => <span className="truncate block text-xs">{row.issuerCa}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-[var(--color-text-primary)]">Certificates</h1>
      </div>

      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by common name or domain…"
          className="w-[320px]"
        />
      </div>

      <Pagination
        totalCount={filtered.length}
        totalItems={filtered.length}
        size={PAGE_SIZE}
        currentAt={page}
        onPageChange={setPage}
      />

      <Table
        columns={columns}
        data={pageItems}
        rowKey="id"
        stickyHeader
        emptyMessage={search ? 'No certificates match your search.' : 'No certificates found.'}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Page Title Mapping
   ───────────────────────────────────────────────────────────────── */

const PAGE_LABELS: Record<KmsPage, string> = {
  overview: 'Overview',
  keys: 'Encryption Keys',
  secrets: 'Secrets',
  certificates: 'Certificates',
};

/* ─────────────────────────────────────────────────────────────────
   Main KmsPage
   ───────────────────────────────────────────────────────────────── */

export default function KmsPage() {
  const [activePage, setActivePage] = useState<KmsPage>('overview');
  const { tabs, activeTabId, addTab, closeTab, activateTab } = useTabs();

  const handleNavigate = useCallback((page: KmsPage) => {
    setActivePage(page);
  }, []);

  const breadcrumbItems = [
    { label: 'KMS', onClick: () => setActivePage('overview') },
    { label: PAGE_LABELS[activePage] },
  ];

  return (
    <PageShell sidebar={<KmsSidebar activePage={activePage} onNavigate={handleNavigate} />}>
      <TopBar>
        <div className="flex flex-col gap-1">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={activateTab}
          onTabClose={closeTab}
          onNewTab={() =>
            addTab({
              id: crypto.randomUUID(),
              label: PAGE_LABELS[activePage],
              path: `/kms/${activePage}`,
            })
          }
        />
      </TopBar>

      <div className="p-6">
        {activePage === 'overview' && <KmsDashboard />}
        {activePage === 'keys' && <CryptoKeyListPage />}
        {activePage === 'secrets' && <SecretListPage />}
        {activePage === 'certificates' && <CertificateListPage />}
      </div>
    </PageShell>
  );
}
