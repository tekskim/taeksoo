/**
 * Audit 앱 목업 데이터 — Audit 기능 정책서 v1.0.2 기준.
 * 모든 시각은 2026-06-16 기준(목업 고정). 통계는 로그에서 파생 + 대시보드용 보강.
 */
import type {
  AdminStats,
  AuditActionCategory,
  AuditActionVerb,
  AuditLog,
  AuditRole,
  AuditStatus,
  LogStats,
  Report,
  ReportFormat,
  ReportStatus,
  ReportType,
  StatsBucket,
  TraceEvent,
} from './types';

// ── 현재 사용자 역할 (§0-2) — 시연 목업은 Domain User 가정: 행위자 PII가 §0-5대로 마스킹된 화면을 보여준다.
//    (SysAdmin·Domain Admin은 마스킹 없이 원문 노출 — 와이어프레임 화면설명에 정책으로 기술)
export const CURRENT_ROLE: AuditRole = 'domain_user';
export const CURRENT_USER = 'taeksoo.kim';

// ── 표기 메타 ──────────────────────────────────────────────────────────────────

/** StatusIndicator status 매핑: success→active(green) / failure→error(red) / denied→degraded(orange) */
export const STATUS_META: Record<
  AuditStatus,
  { label: string; indicator: 'active' | 'error' | 'degraded' }
> = {
  success: { label: 'Success', indicator: 'active' },
  failure: { label: 'Fail', indicator: 'error' },
  denied: { label: 'Denied', indicator: 'degraded' },
};

export const CATEGORY_LABEL: Record<AuditActionCategory, string> = {
  auth: 'Auth',
  resource: 'Resource',
  admin: 'Admin',
  data_access: 'Data Access',
};

export const VERB_LABEL: Record<AuditActionVerb, string> = {
  create: 'Create',
  read: 'Read',
  update: 'Update',
  delete: 'Delete',
};

export const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  audit_summary: 'Audit Summary',
  activity_report: 'Activity Report',
  compliance_summary: 'Compliance Summary',
  access_history: 'Access History',
  sensitive_access: 'Sensitive Data Access',
  failed_events: 'Failed Events',
  admin_actions: 'Admin Actions',
};

export const REPORT_STATUS_META: Record<
  ReportStatus,
  { label: string; indicator: 'active' | 'error' | 'degraded' | 'pending' }
> = {
  pending: { label: 'Pending', indicator: 'pending' },
  processing: { label: 'Processing', indicator: 'degraded' },
  completed: { label: 'Completed', indicator: 'active' },
  failed: { label: 'Failed', indicator: 'error' },
};

export const FORMAT_LABEL: Record<ReportFormat, string> = {
  pdf: 'PDF',
  excel: 'Excel',
  csv: 'CSV',
  json: 'JSON',
};

// ── 포맷 헬퍼 ──────────────────────────────────────────────────────────────────

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
const p2 = (n: number) => String(n).padStart(2, '0');

/** 절대 시각 (테이블·상세): Mth DD, YYYY HH:mm:ss */
export const formatAbsoluteTime = (value: string): string => {
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return value;
  return `${MONTH_ABBR[d.getMonth()]} ${p2(d.getDate())}, ${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
};

/** 테이블 간소 표기: Mth DD, HH:mm:ss */
export const formatShortTime = (value: string): string => {
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return value;
  return `${MONTH_ABBR[d.getMonth()]} ${p2(d.getDate())}, ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
};

/** "동사 + 명사" 표기 (§0-4): create_instance → Create instance */
export const formatActionLabel = (action: string): string => {
  const [verb, ...rest] = action.split('_');
  if (!verb) return action;
  const cap = verb.charAt(0).toUpperCase() + verb.slice(1);
  return rest.length ? `${cap} ${rest.join(' ')}` : cap;
};

/** 행위자 ID 마스킹 (§0-5): 앞2+뒤2, 4자 이하 **** */
export const maskActorId = (id: string): string => {
  if (id.length <= 4) return '****';
  return `${id.slice(0, 2)}***${id.slice(-2)}`;
};

// ── 로그 데이터 ────────────────────────────────────────────────────────────────

let _seq = 0;
const evid = () => `evt-${String(++_seq).padStart(4, '0')}-${Math.abs((_seq * 2654435761) % 9973)}`;

type MkInput = Partial<AuditLog> &
  Pick<AuditLog, 'timestamp' | 'action' | 'action_verb' | 'action_category' | 'status'> & {
    actor: string;
    actorType?: AuditLog['actor_type'];
    actorName?: string | null;
    ip?: string | null;
    target_type: string;
    target_id: string;
    target_name?: string | null;
    service: string;
  };

const mk = (i: MkInput): AuditLog => {
  const event_id = i.event_id ?? evid();
  return {
    event_id,
    timestamp: i.timestamp,
    actor_type: i.actorType ?? 'user',
    actor_id: i.actor,
    actor_name:
      i.actorName ?? (i.actorType === 'system' || i.actorType === 'service' ? null : i.actor),
    actor_ip: i.ip ?? (i.actorType === 'user' ? '10.0.1.20' : null),
    tpn: `${i.actorType ?? 'user'}:${i.actor}`,
    action: i.action,
    action_verb: i.action_verb,
    action_category: i.action_category,
    target_type: i.target_type,
    target_id: i.target_id,
    target_name: i.target_name ?? null,
    trn: `${i.target_type}:${i.target_id}`,
    status: i.status,
    source_service: i.service,
    sensitive: i.sensitive ?? false,
    compliance_labels: i.compliance_labels ?? [],
    reason: i.reason ?? null,
    domain: i.domain ?? 'thakicloud',
    project: i.project ?? 'prod-cluster-01',
    group: i.group ?? null,
    schema_id: i.schema_id ?? 'general@1.2.0',
    event_metadata: i.event_metadata ?? null,
    created_at: i.created_at ?? i.timestamp,
    changes: i.changes ?? null,
    request_id: i.request_id ?? `req-${event_id.slice(4, 12)}`,
    trace_id: i.trace_id ?? `trc-${event_id.slice(4, 12)}`,
    session_id: i.session_id ?? `sess-${i.actor.slice(0, 4)}-77a1`,
    user_agent:
      i.user_agent ??
      (i.actorType === 'user'
        ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0'
        : 'thaki-internal/1.0'),
    integrity_hash:
      i.integrity_hash ?? `sha256:${event_id.replace(/[^a-z0-9]/g, '').slice(0, 12)}…`,
  };
};

const D = '2026-06-16';
const Y = '2026-06-15';

/**
 * 대시보드 24h 윈도우 — 현재 시각(목업 고정) 기준 직전 24시간.
 * to=현재 시각, from=24시간 전. 증감 비교는 그 전 24시간(48~24h 전)과 대조한다.
 * BUCKETS_24H 범위(06-15 10:00 ~ 06-16 10:00)와 일치.
 */
export const DASHBOARD_WINDOW = { from: `${Y} 10:00:00`, to: `${D} 10:00:00` } as const;

export const AUDIT_LOGS: AuditLog[] = [
  mk({
    timestamp: `${D} 09:58:12`,
    actor: 'taeksoo.kim',
    action: 'login_success',
    action_verb: 'read',
    action_category: 'auth',
    target_type: 'session',
    target_id: 'sess-9f2a',
    status: 'success',
    service: 'iam',
    ip: '10.0.1.42',
    reason: 'Password + MFA(TOTP) verified.',
    compliance_labels: ['SOC2'],
  }),
  mk({
    timestamp: `${D} 09:54:03`,
    actor: 'admin',
    action: 'update_role',
    action_verb: 'update',
    action_category: 'admin',
    target_type: 'user',
    target_id: 'u-9123',
    target_name: 'jieun.park',
    status: 'success',
    service: 'iam',
    ip: '10.0.1.10',
    sensitive: true,
    reason: 'Promoted to cluster-admin for incident response.',
    compliance_labels: ['SOC2', 'ISMS-P'],
    changes: { before: { role: 'Viewer' }, after: { role: 'Admin' } },
    request_id: 'req-vmflow01',
  }),
  mk({
    timestamp: `${D} 09:51:40`,
    actor: 'jieun.park',
    action: 'read_user',
    action_verb: 'read',
    action_category: 'data_access',
    target_type: 'user',
    target_id: 'u-3920',
    target_name: 'minho.lee',
    status: 'success',
    service: 'iam',
    sensitive: true,
    reason: 'Viewed PII for support ticket SUP-2231.',
    compliance_labels: ['ISMS-P'],
  }),
  mk({
    timestamp: `${D} 09:47:22`,
    actor: 'taeksoo.kim',
    action: 'create_instance',
    action_verb: 'create',
    action_category: 'resource',
    target_type: 'instance',
    target_id: 'vm-7781',
    target_name: 'web-prod-07',
    status: 'success',
    service: 'compute',
    ip: '10.0.1.42',
    changes: { before: {}, after: { flavor: 'c2.large', image: 'ubuntu-22.04', az: 'az-a' } },
    request_id: 'req-vmcreate',
    event_metadata: { region: 'kr-central-1', billing_tag: 'team-platform' },
  }),
  mk({
    timestamp: `${D} 09:47:21`,
    actor: 'iam-svc',
    actorType: 'service',
    action: 'read_permission',
    action_verb: 'read',
    action_category: 'auth',
    target_type: 'policy',
    target_id: 'pol-compute-write',
    status: 'success',
    service: 'iam',
    request_id: 'req-vmcreate',
    trace_id: 'trc-vmcreate',
    reason: 'Permission check for instance creation.',
  }),
  mk({
    timestamp: `${D} 09:47:25`,
    actor: 'network-svc',
    actorType: 'service',
    action: 'update_securitygroup',
    action_verb: 'update',
    action_category: 'resource',
    target_type: 'security_group',
    target_id: 'sg-7781',
    status: 'denied',
    service: 'network',
    request_id: 'req-vmcreate',
    trace_id: 'trc-vmcreate',
    reason: 'Egress rule rejected by org network policy (deny 0.0.0.0/0).',
  }),
  mk({
    timestamp: `${D} 09:42:08`,
    actor: 'unknown',
    action: 'login_failure',
    action_verb: 'read',
    action_category: 'auth',
    target_type: 'session',
    target_id: '-',
    status: 'failure',
    service: 'iam',
    ip: '203.0.113.45',
    reason: 'Invalid credentials. 5th consecutive failure from this IP.',
    compliance_labels: ['SOC2'],
  }),
  mk({
    timestamp: `${D} 09:38:55`,
    actor: 'system',
    actorType: 'system',
    action: 'rotate_key',
    action_verb: 'update',
    action_category: 'admin',
    target_type: 'key',
    target_id: 'kms-3921',
    target_name: 'data-encryption-key',
    status: 'success',
    service: 'kms',
    sensitive: true,
    reason: 'Automatic rotation (90-day policy).',
    compliance_labels: ['SOC2', 'ISMS-P'],
    changes: { before: { version: 7 }, after: { version: 8 } },
  }),
  mk({
    timestamp: `${D} 09:31:12`,
    actor: 'jieun.park',
    action: 'access_denied',
    action_verb: 'read',
    action_category: 'auth',
    target_type: 'namespace',
    target_id: 'kube-system',
    status: 'denied',
    service: 'container',
    ip: '10.0.1.55',
    reason: 'User lacks cluster-level read permission.',
  }),
  mk({
    timestamp: `${D} 09:25:47`,
    actor: 'minho.lee',
    action: 'delete_volume',
    action_verb: 'delete',
    action_category: 'resource',
    target_type: 'volume',
    target_id: 'vol-2231',
    target_name: 'pvc-data-worker-02',
    status: 'success',
    service: 'storage',
    ip: '10.0.2.30',
    reason: 'Deleted stale volume after migration.',
  }),
  mk({
    timestamp: `${D} 09:18:30`,
    actor: 'compute-sa',
    actorType: 'service',
    action: 'read_secret',
    action_verb: 'read',
    action_category: 'data_access',
    target_type: 'secret',
    target_id: 'db-password',
    status: 'success',
    service: 'kms',
    sensitive: true,
    reason: 'Pipeline accessed DB credential.',
    compliance_labels: ['ISMS-P'],
  }),
  mk({
    timestamp: `${D} 09:05:09`,
    actor: 'taeksoo.kim',
    action: 'create_networkpolicy',
    action_verb: 'create',
    action_category: 'resource',
    target_type: 'network_policy',
    target_id: 'np-deny-egress',
    target_name: 'deny-egress-default',
    status: 'success',
    service: 'network',
    ip: '10.0.1.42',
    changes: { before: {}, after: { egress: 'deny-all', namespace: 'production' } },
  }),
  mk({
    timestamp: `${D} 08:52:41`,
    actor: 'system',
    actorType: 'system',
    action: 'scale_deployment',
    action_verb: 'update',
    action_category: 'resource',
    target_type: 'deployment',
    target_id: 'deploy-compute',
    target_name: 'compute',
    status: 'success',
    service: 'container',
    reason: 'HPA scaled replicas 3 → 5 (CPU pressure).',
    changes: { before: { replicas: 3 }, after: { replicas: 5 } },
  }),
  mk({
    timestamp: `${D} 08:40:17`,
    actor: 'admin',
    action: 'reset_password',
    action_verb: 'update',
    action_category: 'admin',
    target_type: 'user',
    target_id: 'u-3920',
    target_name: 'minho.lee',
    status: 'success',
    service: 'iam',
    ip: '10.0.1.10',
    sensitive: true,
    reason: 'Admin-triggered reset. Email sent.',
    compliance_labels: ['ISMS-P'],
  }),
  mk({
    timestamp: `${D} 08:33:50`,
    actor: 'minho.lee',
    action: 'delete_firewallrule',
    action_verb: 'delete',
    action_category: 'resource',
    target_type: 'firewall_rule',
    target_id: 'fw-edge-7',
    status: 'denied',
    service: 'network',
    ip: '10.0.2.30',
    reason: 'Rule referenced by an active listener.',
  }),
  mk({
    timestamp: `${D} 08:20:05`,
    actor: 'system',
    actorType: 'system',
    action: 'issue_certificate',
    action_verb: 'create',
    action_category: 'admin',
    target_type: 'certificate',
    target_id: 'cert-api',
    target_name: 'api.thakicloud.net',
    status: 'success',
    service: 'kms',
    reason: "Issued via Let's Encrypt. TTL=90d.",
    compliance_labels: ['SOC2'],
  }),
  mk({
    timestamp: `${D} 08:11:33`,
    actor: 'jieun.park',
    action: 'update_bucketpolicy',
    action_verb: 'update',
    action_category: 'resource',
    target_type: 'bucket',
    target_id: 'bkt-archive',
    target_name: 'audit-archive',
    status: 'success',
    service: 'storage',
    ip: '10.0.1.55',
    changes: { before: { acl: 'private' }, after: { acl: 'authenticated-read' } },
  }),
  mk({
    timestamp: `${D} 07:55:14`,
    actor: 'taeksoo.kim',
    action: 'export_report',
    action_verb: 'read',
    action_category: 'admin',
    target_type: 'report',
    target_id: 'rpt-2026-q2',
    status: 'success',
    service: 'audit',
    ip: '10.0.1.42',
    reason: 'Generated compliance report (self-reference).',
    compliance_labels: ['SOC2'],
  }),
  mk({
    timestamp: `${D} 07:40:02`,
    actor: 'backup-sa',
    actorType: 'service',
    action: 'create_snapshot',
    action_verb: 'create',
    action_category: 'resource',
    target_type: 'snapshot',
    target_id: 'snap-9921',
    status: 'success',
    service: 'storage',
    changes: { before: {}, after: { source: 'vol-1180', size_gb: 50 } },
  }),
  mk({
    timestamp: `${D} 07:22:48`,
    actor: 'minho.lee',
    action: 'update_quota',
    action_verb: 'update',
    action_category: 'admin',
    target_type: 'project',
    target_id: 'prj-research',
    target_name: 'research',
    status: 'failure',
    service: 'iam',
    ip: '10.0.2.30',
    reason: 'Quota exceeds domain ceiling.',
  }),
  mk({
    timestamp: `${Y} 23:14:20`,
    actor: 'system',
    actorType: 'system',
    action: 'rollback_deployment',
    action_verb: 'update',
    action_category: 'resource',
    target_type: 'deployment',
    target_id: 'deploy-api',
    target_name: 'api-gateway',
    status: 'success',
    service: 'container',
    reason: 'Auto-rollback after failed health check.',
    changes: { before: { version: 'v2.4.1' }, after: { version: 'v2.4.0' } },
  }),
  mk({
    timestamp: `${Y} 22:48:11`,
    actor: 'jieun.park',
    action: 'read_bulk_users',
    action_verb: 'read',
    action_category: 'data_access',
    target_type: 'user',
    target_id: 'batch-310',
    status: 'success',
    service: 'iam',
    ip: '10.0.1.55',
    sensitive: true,
    reason: 'Bulk export of 310 user records for audit.',
    compliance_labels: ['ISMS-P'],
  }),
  mk({
    timestamp: `${Y} 21:30:55`,
    actor: 'unknown',
    action: 'login_failure',
    action_verb: 'read',
    action_category: 'auth',
    target_type: 'session',
    target_id: '-',
    status: 'failure',
    service: 'iam',
    ip: '203.0.113.45',
    reason: 'Invalid credentials.',
  }),
  mk({
    timestamp: `${Y} 20:05:39`,
    actor: 'taeksoo.kim',
    action: 'create_user',
    action_verb: 'create',
    action_category: 'admin',
    target_type: 'user',
    target_id: 'u-9920',
    target_name: 'sora.han',
    status: 'success',
    service: 'iam',
    ip: '10.0.1.42',
    changes: { before: {}, after: { email: 'sora.han@thakicloud.net', role: 'Viewer' } },
  }),
  mk({
    timestamp: `${Y} 18:42:02`,
    actor: 'system',
    actorType: 'system',
    action: 'detect_intrusion',
    action_verb: 'read',
    action_category: 'auth',
    target_type: 'endpoint',
    target_id: 'api-edge',
    status: 'denied',
    service: 'security',
    sensitive: true,
    reason: 'Blocked anomalous access pattern (rate spike).',
    compliance_labels: ['SOC2', 'ISMS-P'],
  }),
  mk({
    timestamp: `${Y} 17:11:48`,
    actor: 'minho.lee',
    action: 'update_instance',
    action_verb: 'update',
    action_category: 'resource',
    target_type: 'instance',
    target_id: 'vm-5510',
    target_name: 'batch-worker-1',
    status: 'success',
    service: 'compute',
    ip: '10.0.2.30',
    changes: { before: { flavor: 'c2.medium' }, after: { flavor: 'c2.xlarge' } },
  }),
  mk({
    timestamp: `${Y} 15:30:21`,
    actor: 'jieun.park',
    action: 'read_logs',
    action_verb: 'read',
    action_category: 'data_access',
    target_type: 'log_stream',
    target_id: 'ls-prod',
    status: 'success',
    service: 'logs',
    ip: '10.0.1.55',
  }),
  mk({
    timestamp: `${Y} 13:05:44`,
    actor: 'admin',
    action: 'delete_user',
    action_verb: 'delete',
    action_category: 'admin',
    target_type: 'user',
    target_id: 'u-1100',
    target_name: 'temp.contractor',
    status: 'success',
    service: 'iam',
    ip: '10.0.1.10',
    sensitive: true,
    reason: 'Offboarded contractor.',
    compliance_labels: ['ISMS-P'],
    changes: { before: { status: 'active' }, after: { status: 'deleted' } },
  }),
];

// ── 파생 통계 ──────────────────────────────────────────────────────────────────

const emptyStatus = (): Record<AuditStatus, number> => ({ success: 0, failure: 0, denied: 0 });
const emptyVerb = (): Record<AuditActionVerb, number> => ({
  create: 0,
  read: 0,
  update: 0,
  delete: 0,
});
const emptyCat = (): Record<AuditActionCategory, number> => ({
  auth: 0,
  resource: 0,
  admin: 0,
  data_access: 0,
});

export const computeStats = (logs: AuditLog[]): LogStats => {
  const by_status = emptyStatus();
  const by_verb = emptyVerb();
  const by_category = emptyCat();
  const by_service: Record<string, number> = {};
  const by_action: Record<string, number> = {};
  let sensitive_count = 0;
  const actorMap = new Map<
    string,
    {
      tpn: string;
      actor_name: string | null;
      count: number;
      denied_count: number;
      sensitive_count: number;
    }
  >();

  for (const l of logs) {
    by_status[l.status]++;
    by_verb[l.action_verb]++;
    by_category[l.action_category]++;
    by_service[l.source_service] = (by_service[l.source_service] ?? 0) + 1;
    by_action[l.action] = (by_action[l.action] ?? 0) + 1;
    if (l.sensitive) sensitive_count++;
    const a = actorMap.get(l.tpn) ?? {
      tpn: l.tpn,
      actor_name: l.actor_name,
      count: 0,
      denied_count: 0,
      sensitive_count: 0,
    };
    a.count++;
    if (l.status === 'denied') a.denied_count++;
    if (l.sensitive) a.sensitive_count++;
    actorMap.set(l.tpn, a);
  }
  // login은 by_action 키로 집계되어 있으나 대시보드 Action Types는 login 별도 노출
  const by_action_login = (by_action['login_success'] ?? 0) + (by_action['login_failure'] ?? 0);
  by_action.login = by_action_login;

  const top_actors = [...actorMap.values()].sort((a, b) => b.count - a.count).slice(0, 6);
  const top_services = Object.entries(by_service)
    .map(([source_service, count]) => ({ source_service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    total: logs.length,
    by_status,
    by_service,
    by_action,
    by_category,
    by_verb,
    sensitive_count,
    top_actors,
    top_services,
    buckets: BUCKETS_24H,
  };
};

/** 24h 추이 버킷 (시간 단위) — 대시보드/로그 타임라인 공통 데이터 (§1-3, §2-5) */
export const BUCKETS_24H: StatsBucket[] = (() => {
  const base = new Date('2026-06-15T10:00:00');
  const shape = [
    [12, 1, 1],
    [8, 0, 0],
    [5, 0, 1],
    [3, 0, 0],
    [2, 0, 0],
    [4, 1, 1],
    [9, 0, 2],
    [18, 2, 3],
    [26, 1, 4],
    [31, 3, 5],
    [22, 1, 2],
    [19, 0, 1],
    [24, 2, 3],
    [17, 1, 1],
    [14, 0, 1],
    [12, 1, 2],
    [9, 0, 0],
    [21, 4, 2],
    [16, 1, 3],
    [11, 0, 1],
    [7, 0, 0],
    [10, 1, 2],
    [15, 1, 1],
    [13, 0, 2],
  ];
  return shape.map(([total, failed, sensitive], i) => ({
    start: new Date(base.getTime() + i * 3600_000).toISOString(),
    total,
    failed,
    sensitive,
  }));
})();

export const STATS: LogStats = computeStats(AUDIT_LOGS);

/** 전일 비교용 — 증감 표시 (§1-2). 임의 보정치 */
export const STATS_PREV: LogStats = {
  ...STATS,
  total: STATS.total - 4,
  by_status: {
    success: STATS.by_status.success - 1,
    failure: STATS.by_status.failure - 2,
    denied: STATS.by_status.denied - 1,
  },
  sensitive_count: STATS.sensitive_count - 2,
  top_actors: STATS.top_actors.map((a) => ({ ...a, count: Math.max(0, a.count - 1) })),
};

export const ADMIN_STATS: AdminStats = {
  total_logs: 1_284_932,
  dlq_pending: 3,
  last_24h: 4128,
  retention_days: 365,
  newest_log: `${D} 09:58:12`,
};

// ── 조회 헬퍼 ──────────────────────────────────────────────────────────────────

export const getLogById = (id: string): AuditLog | undefined =>
  AUDIT_LOGS.find((l) => l.event_id === id);

/** 같은 request_id로 묶인 요청 추적 이벤트 (§2-7) */
export const getTraceForLog = (log: AuditLog): TraceEvent[] =>
  AUDIT_LOGS.filter((l) => l.request_id === log.request_id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .map((l) => ({
      event_id: l.event_id,
      timestamp: l.timestamp,
      action: l.action,
      actor_id: l.actor_id,
      target_type: l.target_type,
      target_id: l.target_id,
      status: l.status,
      source_service: l.source_service,
    }));

export const sensitiveLogs = (limit = 5): AuditLog[] =>
  AUDIT_LOGS.filter((l) => l.sensitive).slice(0, limit);

// ── 리포트 데이터 (§3) ────────────────────────────────────────────────────────

export const REPORTS: Report[] = [
  {
    report_id: 'rpt-0091',
    name: 'June Compliance Summary',
    report_type: 'compliance_summary',
    status: 'completed',
    format: 'pdf',
    parameters: { from: `2026-06-01`, to: `${D}` },
    row_count: 4821,
    error_message: null,
    requested_by: 'taeksoo.kim',
    requested_at: `${D} 07:55:00`,
    completed_at: `${D} 07:56:10`,
  },
  {
    report_id: 'rpt-0090',
    name: 'Weekly Failed Events',
    report_type: 'failed_events',
    status: 'processing',
    format: 'excel',
    parameters: { from: `2026-06-09`, to: `${D}` },
    row_count: null,
    error_message: null,
    requested_by: 'jieun.park',
    requested_at: `${D} 09:40:00`,
    completed_at: null,
  },
  {
    report_id: 'rpt-0089',
    name: 'Admin Actions — Q2',
    report_type: 'admin_actions',
    status: 'completed',
    format: 'csv',
    parameters: { from: `2026-04-01`, to: `${D}` },
    row_count: 932,
    error_message: null,
    requested_by: 'admin',
    requested_at: `${Y} 18:10:00`,
    completed_at: `${Y} 18:12:44`,
  },
  {
    report_id: 'rpt-0088',
    name: 'Sensitive Access — May',
    report_type: 'sensitive_access',
    status: 'completed',
    format: 'pdf',
    parameters: { from: `2026-05-01`, to: `2026-05-31` },
    row_count: 217,
    error_message: null,
    requested_by: 'taeksoo.kim',
    requested_at: `2026-06-01 10:02:00`,
    completed_at: `2026-06-01 10:03:30`,
  },
  {
    report_id: 'rpt-0087',
    name: 'Activity Report — research',
    report_type: 'activity_report',
    status: 'failed',
    format: 'json',
    parameters: { from: `2026-06-01`, to: `${D}`, tpn: 'user:minho.lee' },
    row_count: null,
    error_message: 'Query timeout after 120s. Narrow the date range and retry.',
    requested_by: 'minho.lee',
    requested_at: `${D} 06:30:00`,
    completed_at: `${D} 06:32:01`,
  },
  {
    report_id: 'rpt-0086',
    name: 'Access History — storage',
    report_type: 'access_history',
    status: 'pending',
    format: 'csv',
    parameters: { from: `2026-06-10`, to: `${D}`, trn: 'bucket:audit-archive' },
    row_count: null,
    error_message: null,
    requested_by: 'jieun.park',
    requested_at: `${D} 09:59:00`,
    completed_at: null,
  },
  {
    report_id: 'rpt-0085',
    name: 'Audit Summary — daily',
    report_type: 'audit_summary',
    status: 'completed',
    format: 'pdf',
    parameters: { from: `${Y}`, to: `${D}` },
    row_count: 28,
    error_message: null,
    requested_by: 'taeksoo.kim',
    requested_at: `${Y} 23:55:00`,
    completed_at: `${Y} 23:55:40`,
  },
];

export const getReportById = (id: string): Report | undefined =>
  REPORTS.find((r) => r.report_id === id);

// ── 필터/프리셋 상수 (§2-3, §2-4, §2-6) ───────────────────────────────────────
export const TIME_PRESETS = ['30m', '1h', '6h', '24h', '7d', '30d'] as const;
export const DEFAULT_TIME_RANGE = '24h';
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;
