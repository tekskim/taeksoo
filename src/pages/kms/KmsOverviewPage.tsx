import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  Table,
  Skeleton,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { KmsSidebar } from '@/components/KmsSidebar';
import { useTabs } from '@/contexts/TabContext';
import { formatAbsoluteDatetime, AuditLogSection, KmsStateBadge } from './shared';
import { listMockCryptoKeys } from './mocks/cryptoKeysRepository';
import { listMockSecrets } from './mocks/secretsRepository';
import type { CryptoKeySummary } from './models/cryptoKey';
import type { SecretSummary } from './models/secret';
import { DUMMY_CERTIFICATES, type CertificateDetail } from './models/certificate';

/* ─────────────────────────────────────────────────────────────────
   Constants & helpers (ported from kms HomePage.tsx)
   ───────────────────────────────────────────────────────────────── */

const DASHBOARD_MAX_ITEMS = 5;

/** state-color text classes per certificate status (CERT_STATUS_COLOR_MAP) */
const CERT_STATUS_COLOR_MAP: Record<string, string> = {
  active: 'text-[var(--color-state-success)]',
  expiring: 'text-[var(--color-state-warning)]',
  expired: 'text-[var(--color-state-danger)]',
  revoked: 'text-[var(--color-text-subtle)]',
};

/** state-color text classes per secret status (SECRET_STATUS_COLOR_MAP) */
const SECRET_STATUS_COLOR_MAP: Record<string, string> = {
  active: 'text-[var(--color-state-success)]',
  expired: 'text-[var(--color-state-danger)]',
  deactivated: 'text-[var(--color-state-warning)]',
  deleted: 'text-[var(--color-text-subtle)]',
  destroyed: 'text-[var(--color-text-subtle)]',
};

function SectionSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <>
      <Skeleton width={140} height={20} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={80} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────────── */

export default function KmsOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  /* ── Async mock data (TanStack Query 대응: useEffect + useState) ── */
  const [keys, setKeys] = useState<CryptoKeySummary[] | null>(null);
  const [secrets, setSecrets] = useState<SecretSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listMockCryptoKeys({ page: 1, pageSize: 1000 }).then((result) => {
      if (!cancelled) setKeys(result.items);
    });
    listMockSecrets({ page: 1, pageSize: 1000 }).then((result) => {
      if (!cancelled) setSecrets(result.items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isKeysLoading = keys === null;
  const isSecretsLoading = secrets === null;
  const isLoading = isKeysLoading || isSecretsLoading;

  const totalKeys = keys?.length ?? 0;
  const totalSecrets = secrets?.length ?? 0;
  const totalCerts = DUMMY_CERTIFICATES.length;

  /* ── Encryption Keys stats ── */
  const scheduledKeys = useMemo(
    () => keys?.filter((k) => k.nextRotationAt !== null).length ?? 0,
    [keys]
  );
  const notScheduledKeys = totalKeys - scheduledKeys;

  const overdueKeys = useMemo(() => {
    const now = Date.now();
    return (
      keys?.filter((k) => k.nextRotationAt && new Date(k.nextRotationAt).getTime() < now) ?? []
    );
  }, [keys]);

  /* ── Certificate stats ── */
  const certStatusCounts = useMemo(() => {
    const counts = { active: 0, expiring: 0, expired: 0, revoked: 0 };
    DUMMY_CERTIFICATES.forEach((cert) => {
      if (cert.status in counts) {
        counts[cert.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, []);

  const attentionCerts = useMemo(
    () =>
      DUMMY_CERTIFICATES.filter(
        (cert) => cert.status === 'expiring' || cert.status === 'expired'
      ).sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()),
    []
  );

  /* ── Secret stats ── */
  const secretStatusCounts = useMemo(() => {
    const counts = { active: 0, expired: 0, deactivated: 0, deleted: 0 };
    secrets?.forEach((secret) => {
      if (secret.status in counts) {
        counts[secret.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [secrets]);

  /* ── Rotation Overdue table columns ── */
  const overdueColumns: TableColumn<CryptoKeySummary>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_: any, row: CryptoKeySummary) => (
        <button
          type="button"
          className="inline-flex items-center border-0 bg-transparent p-0 text-body-sm text-[var(--color-action-primary)] hover:underline text-left truncate max-w-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/kms/keys/${encodeURIComponent(row.slug)}`);
          }}
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'algorithm',
      label: 'Algorithm',
      flex: 1,
      minWidth: columnMinWidths.node,
      render: (_: any, row: CryptoKeySummary) => (
        <span className="text-body-sm font-mono text-[var(--color-text-subtle)]">
          {row.algorithm}
        </span>
      ),
    },
    {
      key: 'nextRotationAt',
      label: 'Overdue since',
      flex: 1,
      minWidth: columnMinWidths.timestamp,
      render: (_: any, row: CryptoKeySummary) => (
        <span className="text-body-sm font-mono text-[var(--color-state-danger)]">
          {formatAbsoluteDatetime(row.nextRotationAt)}
        </span>
      ),
    },
  ];

  /* ── Certificates requiring attention table columns ── */
  const attentionCertColumns: TableColumn<CertificateDetail>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_: any, row: CertificateDetail) => <KmsStateBadge status={row.status} />,
    },
    {
      key: 'commonName',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.nameLg,
      render: (_: any, row: CertificateDetail) => (
        <button
          type="button"
          className="inline-flex items-center border-0 bg-transparent p-0 text-body-sm text-[var(--color-action-primary)] hover:underline text-left truncate max-w-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/kms/certificates/${encodeURIComponent(row.id)}`);
          }}
        >
          {row.commonName}
        </button>
      ),
    },
    {
      key: 'daysRemaining',
      label: 'Days Remaining',
      flex: 1,
      minWidth: columnMinWidths.expiresAt,
      render: (_: any, row: CertificateDetail) => (
        <span
          className={
            row.daysRemaining < 0
              ? 'text-body-sm text-[var(--color-state-danger)] font-medium'
              : 'text-body-sm text-[var(--color-state-warning)] font-medium'
          }
        >
          {row.daysRemaining} days
        </span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'Expires At',
      flex: 1,
      minWidth: columnMinWidths.timestamp,
      render: (_: any, row: CertificateDetail) => (
        <span className="text-body-sm text-[var(--color-text-default)]">
          {formatAbsoluteDatetime(row.expiresAt)}
        </span>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<KmsSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'KMS', href: '/kms/overview' }, { label: 'Overview' }]} />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader title="Overview" />

        <div className="flex flex-col gap-6 w-full">
          {/* ── Encryption Keys ── */}
          <div className="bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
            {isKeysLoading ? (
              <SectionSkeleton rows={2} />
            ) : (
              <>
                <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                  Encryption keys ({totalKeys})
                </h6>

                {/* Rotation Schedule — status tiles (Certificates/Secrets와 동일 패턴) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Scheduled',
                      value: totalKeys > 0 ? scheduledKeys : '-',
                      count: scheduledKeys,
                      color: 'text-[var(--color-state-success)]',
                    },
                    {
                      label: 'Not Scheduled',
                      value: totalKeys > 0 ? notScheduledKeys : '-',
                      count: notScheduledKeys,
                      color: 'text-[var(--color-text-subtle)]',
                    },
                  ].map((item) => {
                    const textColor =
                      item.count === 0 ? 'text-[var(--color-text-subtle)]' : item.color;
                    return (
                      <div
                        key={item.label}
                        className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3"
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-label-sm ${textColor}`}>{item.label}</span>
                          <span className={`text-heading-h3 ${textColor}`}>{item.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rotation Overdue — 라벨 + 테이블 (Certificates requiring attention과 동일 패턴) */}
                <div className="flex flex-col gap-2 min-w-0">
                  <p className="text-label-md text-[var(--color-text-subtle)]">Rotation Overdue</p>
                  <div className="overflow-x-auto min-w-0">
                    <Table<CryptoKeySummary>
                      columns={overdueColumns}
                      data={overdueKeys.slice(0, DASHBOARD_MAX_ITEMS)}
                      rowKey="slug"
                      resizable={false}
                      emptyMessage="No overdue keys"
                    />
                  </div>
                  {overdueKeys.length > DASHBOARD_MAX_ITEMS && (
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0 text-body-sm text-[var(--color-action-primary)] hover:underline self-start cursor-pointer"
                      onClick={() => navigate('/kms/keys')}
                    >
                      View all ({overdueKeys.length} keys) →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Certificates ── */}
          <div className="bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
            {isLoading ? (
              <SectionSkeleton rows={3} />
            ) : (
              <>
                <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                  Certificates ({totalCerts})
                </h6>

                {/* Certificate Status counts */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Active', value: certStatusCounts.active, variant: 'active' },
                    {
                      label: 'Expiring soon',
                      value: certStatusCounts.expiring,
                      variant: 'expiring',
                    },
                    { label: 'Expired', value: certStatusCounts.expired, variant: 'expired' },
                    { label: 'Revoked', value: certStatusCounts.revoked, variant: 'revoked' },
                  ].map((item) => {
                    const textColor =
                      item.value === 0
                        ? 'text-[var(--color-text-subtle)]'
                        : CERT_STATUS_COLOR_MAP[item.variant];
                    return (
                      <div
                        key={item.label}
                        className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3"
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-label-sm ${textColor}`}>{item.label}</span>
                          <span className={`text-heading-h3 ${textColor}`}>{item.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Requiring Attention */}
                <div className="flex flex-col gap-2 min-w-0">
                  <p className="text-label-md text-[var(--color-text-subtle)]">
                    Certificates requiring attention
                  </p>
                  <div className="overflow-x-auto min-w-0">
                    <Table<CertificateDetail>
                      columns={attentionCertColumns}
                      data={attentionCerts.slice(0, DASHBOARD_MAX_ITEMS)}
                      rowKey="id"
                      resizable={false}
                      emptyMessage="No certificates require immediate attention."
                    />
                  </div>
                  {attentionCerts.length > DASHBOARD_MAX_ITEMS && (
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0 text-body-sm text-[var(--color-action-primary)] hover:underline self-start cursor-pointer"
                      onClick={() => navigate('/kms/certificates')}
                    >
                      View all ({attentionCerts.length} certificates) →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Secrets ── */}
          <div className="bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4">
            {isSecretsLoading ? (
              <SectionSkeleton rows={1} />
            ) : (
              <>
                <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                  Secrets ({totalSecrets})
                </h6>

                {/* Secret Status counts */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Active', value: secretStatusCounts.active, variant: 'active' },
                    { label: 'Expired', value: secretStatusCounts.expired, variant: 'expired' },
                    {
                      label: 'Deactivated',
                      value: secretStatusCounts.deactivated,
                      variant: 'deactivated',
                    },
                    { label: 'Deleted', value: secretStatusCounts.deleted, variant: 'deleted' },
                  ].map((item) => {
                    const textColor =
                      item.value === 0
                        ? 'text-[var(--color-text-subtle)]'
                        : SECRET_STATUS_COLOR_MAP[item.variant];
                    return (
                      <div
                        key={item.label}
                        className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3"
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-label-sm ${textColor}`}>{item.label}</span>
                          <span className={`text-heading-h3 ${textColor}`}>{item.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* ── Recent Audit Logs (bottom) ── */}
          <AuditLogSection title="Recent audit logs" limit={5} />
        </div>
      </VStack>
    </PageShell>
  );
}
