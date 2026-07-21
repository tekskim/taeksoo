/**
 * Audit 앱 타입 — Audit 기능 정책서 v1.0.2 데이터 모델(§0-3) 기준.
 * thaki-ui develop packages/audit/src/api/types/audit.ts 를 목업용으로 정제.
 * GAP(A-N) 표시 필드는 백엔드 미구현 요청안으로, 목업에서만 채운다.
 */

export type AuditStatus = 'success' | 'failure' | 'denied';
export type AuditActorType = 'user' | 'service' | 'system';
export type AuditActionVerb = 'create' | 'read' | 'update' | 'delete';
/** §2-3 액션 카테고리 (GAP A-3) */
export type AuditActionCategory = 'auth' | 'resource' | 'admin' | 'data_access';

/** 감사 이벤트 한 건 (정책서 §0-3) */
export interface AuditLog {
  event_id: string;
  timestamp: string;
  actor_type: AuditActorType;
  actor_id: string;
  actor_name: string | null;
  actor_ip: string | null;
  /** 행위자 경로 actor_type:actor_id */
  tpn: string;
  action: string;
  action_verb: AuditActionVerb;
  action_category: AuditActionCategory;
  target_type: string;
  target_id: string;
  target_name: string | null;
  /** 대상 경로 target_type:target_id */
  trn: string;
  status: AuditStatus;
  source_service: string;
  sensitive: boolean;
  compliance_labels: string[];
  /** 행위·실패·거부 사유 (민감 시 마스킹) */
  reason: string | null;
  domain: string;
  project: string;
  group: string | null;
  schema_id: string | null;
  event_metadata: Record<string, unknown> | null;
  created_at: string;
  /** 변경 전/후 (CUD). read 등 변경없는 이벤트는 null */
  changes: { before: Record<string, unknown>; after: Record<string, unknown> } | null;
  /** 맥락(추적) — GAP(A-4) */
  request_id: string;
  trace_id: string;
  session_id: string;
  user_agent: string;
  /** 무결성 해시 (축약 표시) */
  integrity_hash: string;
}

/** 요청 추적(Trace) 노드 — 같은 request_id 묶음 (§2-7) */
export interface TraceEvent {
  event_id: string;
  timestamp: string;
  action: string;
  actor_id: string;
  target_type: string;
  target_id: string;
  status: AuditStatus;
  source_service: string;
}

/** 무결성 검증 결과 (§2-7) — valid: true=유효 / false=불일치 / null=해시없음(미검증) */
export type IntegrityState = 'unverified' | 'valid' | 'mismatch' | 'no-hash';

/** 원본 보기 세션 (Break-glass, §0-5) */
export interface BreakGlassSession {
  active: boolean;
  reason: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
}

/** 대시보드 24h 추이 버킷 (§1-3) */
export interface StatsBucket {
  start: string;
  total: number;
  /** failure + denied */
  failed: number;
  sensitive: number;
}

/** 집계 응답 — 대시보드 카드·위젯·로그 요약 카드의 단일 소스 (§1-2, §2-5) */
export interface LogStats {
  total: number;
  by_status: Record<AuditStatus, number>;
  by_service: Record<string, number>;
  by_action: Record<string, number>;
  by_category: Record<AuditActionCategory, number>;
  by_verb: Record<AuditActionVerb, number>;
  sensitive_count: number;
  top_actors: Array<{
    tpn: string;
    actor_name: string | null;
    count: number;
    denied_count: number;
    sensitive_count: number;
  }>;
  top_services: Array<{ source_service: string; count: number }>;
  buckets: StatsBucket[];
}

/** 시스템 현황 — SysAdmin 전용 (§1-3-1) */
export interface AdminStats {
  total_logs: number;
  dlq_pending: number;
  /** 최근 24h 적재 건수 (시간당 평균은 /24) */
  last_24h: number;
  retention_days: number;
  newest_log: string | null;
}

// ── 리포트 (§3) ──────────────────────────────────────────────────────────────

export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json';
/** 리포트 유형 7종 (§3-3) */
export type ReportType =
  | 'audit_summary'
  | 'activity_report'
  | 'compliance_summary'
  | 'access_history'
  | 'sensitive_access'
  | 'failed_events'
  | 'admin_actions';

export interface ReportParameters {
  from?: string;
  to?: string;
  actions?: string[];
  tpn?: string;
  trn?: string;
}

export interface Report {
  report_id: string;
  /** 필수·중복 불가 (§3-1-1) */
  name: string;
  report_type: ReportType;
  status: ReportStatus;
  format: ReportFormat;
  parameters: ReportParameters;
  /** 완료 시 집계 행 수 */
  row_count: number | null;
  /** 실패 사유 */
  error_message: string | null;
  requested_by: string;
  requested_at: string;
  completed_at: string | null;
}

/** 사용자 역할 (§0-2) */
export type AuditRole = 'sysadmin' | 'domain_admin' | 'domain_user';
