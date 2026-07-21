export type AuditActorType = 'USER' | 'SYSTEM_BATCH' | 'AUTO_RESOLVER';

export type AuditResultStatus = 'SUCCESS' | 'FAIL' | 'DENIED';

export type AuditTargetType = 'EncryptionKey' | 'Secret' | 'Certificate';

export interface AuditActor {
  type: AuditActorType;
  id: string;
  ip: string;
  name?: string;
}

export interface AuditTarget {
  type: AuditTargetType;
  id: string;
  name?: string;
}

export interface AuditResult {
  status: AuditResultStatus;
  changes?: {
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
  };
  reason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: AuditActor;
  action: string;
  target: AuditTarget;
  result: AuditResult;
  /** 행위자의 의도/사유 (enum code + 자유 텍스트). Audit 표준 스키마 rationale 필드에 대응. */
  rationale?: string;
}
