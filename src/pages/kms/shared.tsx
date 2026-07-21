import { useMemo } from 'react';
import { Badge, Table, type TableColumn } from '@/design-system';
import type { AuditLogEntry, AuditResultStatus } from './models/auditLog';
import { getAuditLogsByResourceId, getRecentAuditLogs } from './mocks/auditLogs';

/* ─────────────────────────────────────────────────────────────────
   Date formatting — TDS UX writing(영문) 규칙
   · 일자 축약형 (테이블/요약): Mth DD, YYYY
   · 일자+시각 (이벤트/로그, 테이블이므로 UTC·초 생략): Mth DD, YYYY HH:mm
   · 24시간제, 로컬 기준, 날짜·시각 사이 한 칸
   ───────────────────────────────────────────────────────────────── */

const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${MONTH_ABBR[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
}

export function formatAbsoluteDatetime(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${formatDate(iso)} ${hh}:${mi}`;
}

/* ─────────────────────────────────────────────────────────────────
   KmsStateBadge — key/secret/certificate 상태 뱃지
   ───────────────────────────────────────────────────────────────── */

/* status 뱃지는 TDS 컨벤션상 항상 subtle (tds_ssot 전 페이지 subtle 통일) */
const STATE_CONFIG: Record<string, { label: string; theme: 'gre' | 'ylw' | 'red' | 'gry' }> = {
  active: { label: 'Active', theme: 'gre' },
  expiring: { label: 'Expiring', theme: 'ylw' },
  expired: { label: 'Expired', theme: 'red' },
  revoked: { label: 'Revoked', theme: 'red' },
  deactivated: { label: 'Deactivated', theme: 'ylw' },
  deleted: { label: 'Deleted', theme: 'red' },
  destroyed: { label: 'Destroyed', theme: 'red' },
  archived: { label: 'Archived', theme: 'gry' },
};

const FALLBACK_CONFIG: (typeof STATE_CONFIG)[string] = {
  label: '-',
  theme: 'gry',
};

export function KmsStateBadge({ status }: { status: string }) {
  const config = STATE_CONFIG[status] ?? FALLBACK_CONFIG;
  return (
    <Badge theme={config.theme} type="subtle" size="sm">
      {config.label}
    </Badge>
  );
}

/* ─────────────────────────────────────────────────────────────────
   AuditLogSection — 상세 페이지 공용 감사 로그 섹션
   ───────────────────────────────────────────────────────────────── */

const RESULT_BADGE: Record<AuditResultStatus, { theme: 'gre' | 'red' | 'ylw'; label: string }> = {
  SUCCESS: { theme: 'gre', label: 'Success' },
  FAIL: { theme: 'red', label: 'Fail' },
  DENIED: { theme: 'ylw', label: 'Denied' },
};

const AUDIT_COLUMNS: TableColumn<AuditLogEntry>[] = [
  {
    key: 'timestamp',
    label: 'Timestamp',
    width: '170px',
    render: (_, row) => (
      <span className="text-caption text-[var(--color-text-subtle)]">
        {formatAbsoluteDatetime(row.timestamp)}
      </span>
    ),
  },
  {
    key: 'actor',
    label: 'Actor',
    width: '160px',
    render: (_, row) => (
      <span className="text-body-sm truncate block">{row.actor.name ?? row.actor.id}</span>
    ),
  },
  {
    key: 'ip',
    label: 'Source IP',
    width: '120px',
    render: (_, row) => (
      <span className="font-mono text-caption text-[var(--color-text-subtle)]">{row.actor.ip}</span>
    ),
  },
  {
    key: 'action',
    label: 'Action',
    width: '200px',
    render: (_, row) => (
      <span className="font-mono text-caption text-[var(--color-text-subtle)]">{row.action}</span>
    ),
  },
  {
    key: 'target',
    label: 'Target',
    flex: 1,
    minWidth: '160px',
    render: (_, row) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-body-sm truncate">{row.target.name ?? row.target.id}</span>
        <span className="text-caption text-[var(--color-text-subtle)]">{row.target.type}</span>
      </div>
    ),
  },
  {
    key: 'result',
    label: 'Result',
    width: '90px',
    render: (_, row) => (
      <Badge theme={RESULT_BADGE[row.result.status].theme} type="subtle" size="sm">
        {RESULT_BADGE[row.result.status].label}
      </Badge>
    ),
  },
  {
    key: 'rationale',
    label: 'Rationale',
    flex: 1,
    minWidth: '160px',
    render: (_, row) => (
      <span className="text-caption text-[var(--color-text-subtle)]">
        {row.rationale ?? row.result.reason ?? '-'}
      </span>
    ),
  },
];

interface AuditLogSectionProps {
  resourceId?: string;
  limit?: number;
  title?: string;
}

export function AuditLogSection({
  resourceId,
  limit = 5,
  title = 'Audit logs',
}: AuditLogSectionProps) {
  const entries = useMemo(
    () =>
      resourceId ? getAuditLogsByResourceId(resourceId).slice(0, limit) : getRecentAuditLogs(limit),
    [resourceId, limit]
  );

  return (
    <div className="bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4 flex flex-col gap-3">
      <h6 className="text-heading-h6 text-[var(--color-text-default)]">{title}</h6>
      <Table
        columns={AUDIT_COLUMNS}
        data={entries}
        rowKey="id"
        emptyMessage="No audit logs found."
      />
    </div>
  );
}
