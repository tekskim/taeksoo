import type { AuditLogEntry } from '../models/auditLog';

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2026-05-22T08:15:00Z',
    actor: { type: 'USER', id: 'admin@thaki.cloud', name: 'admin', ip: '10.0.1.42' },
    action: 'REVOKE_CERTIFICATE',
    target: { type: 'Certificate', id: 'cert-payment', name: 'payment-api.kms.svc' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'revoked' },
      },
    },
    rationale:
      'suspected_compromise: Suspected payment API certificate leak — handling security ticket #4421',
  },
  {
    id: 'audit-002',
    timestamp: '2026-05-21T14:30:00Z',
    actor: { type: 'SYSTEM_BATCH', id: 'system', ip: '10.0.0.1' },
    action: 'UPDATE_CERTIFICATE_STATUS',
    target: { type: 'Certificate', id: 'cert-scheduler', name: 'scheduler.kms.svc' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'expiring' },
      },
    },
  },
  {
    id: 'audit-003',
    timestamp: '2026-05-20T09:00:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.2.15' },
    action: 'ROTATE_SECRET',
    target: { type: 'Secret', id: 'github-token', name: 'GITHUB_TOKEN' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { version: 3 },
        after: { version: 4 },
      },
    },
    rationale: 'rotation: Scheduled rotation per quarterly policy',
  },
  {
    id: 'audit-004',
    timestamp: '2026-05-19T17:45:00Z',
    actor: { type: 'USER', id: 'admin@thaki.cloud', name: 'admin', ip: '10.0.1.42' },
    action: 'DEACTIVATE_SECRET',
    target: { type: 'Secret', id: 'kc-client-secret', name: 'KC_CLIENT_SECRET' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'deactivated' },
      },
    },
    rationale:
      'suspected_compromise: Suspected Keycloak client secret leak — monitoring alert #2201',
  },
  {
    id: 'audit-005',
    timestamp: '2026-05-18T11:20:00Z',
    actor: { type: 'SYSTEM_BATCH', id: 'system', ip: '10.0.0.1' },
    action: 'EXPIRE_SECRET',
    target: { type: 'Secret', id: 'postgresql-superuser-auth', name: 'postgresql-superuser-auth' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'expired' },
      },
    },
  },
  {
    id: 'audit-006',
    timestamp: '2026-05-17T08:00:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.2.15' },
    action: 'DEACTIVATE_KEY',
    target: { type: 'EncryptionKey', id: 'compute-signing-key', name: 'compute-signing-key' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'deactivated' },
      },
    },
    rationale:
      'confirmed_compromise: Compromise confirmed — preemptive deactivation before re-protection pipeline',
  },
  {
    id: 'audit-007',
    timestamp: '2026-05-16T16:30:00Z',
    actor: { type: 'USER', id: 'admin@thaki.cloud', name: 'admin', ip: '10.0.1.42' },
    action: 'ARCHIVE_KEY',
    target: { type: 'EncryptionKey', id: 'container-wrap-key', name: 'container-wrap-key' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'deactivated' },
        after: { status: 'archived' },
      },
    },
    rationale: 'routine_archive: Deactivated for over 90 days — routine operational cleanup',
  },
  {
    id: 'audit-008',
    timestamp: '2026-05-15T10:10:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.3.77' },
    action: 'EXPIRE_SECRET',
    target: { type: 'Secret', id: 'payment-api-key', name: 'payment-api-key' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'expired' },
      },
    },
  },
  {
    id: 'audit-009',
    timestamp: '2026-05-14T13:55:00Z',
    actor: { type: 'USER', id: 'admin@thaki.cloud', name: 'admin', ip: '10.0.0.1' },
    action: 'UPDATE_CERTIFICATE_STATUS',
    target: { type: 'Certificate', id: 'cert-etcd', name: 'etcd-peer.kms.svc' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'expiring' },
      },
    },
  },
  {
    id: 'audit-010',
    timestamp: '2026-05-13T07:40:00Z',
    actor: { type: 'AUTO_RESOLVER', id: 'system', ip: '10.0.0.1' },
    action: 'ROTATE_KEY',
    target: { type: 'EncryptionKey', id: 'iam-master-key', name: 'iam-master-key' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { version: 3 },
        after: { version: 4 },
      },
      reason: 'rotation',
    },
  },
  {
    id: 'audit-011',
    timestamp: '2026-05-12T15:20:00Z',
    actor: { type: 'USER', id: 'admin@thaki.cloud', name: 'admin', ip: '10.0.1.42' },
    action: 'DELETE_SECRET',
    target: { type: 'Secret', id: 'cache-redis', name: 'cache-redis' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'deactivated' },
        after: { status: 'deleted' },
      },
    },
    rationale: 'manual_delete: Redis cache service decommissioned — no longer in use',
  },
  {
    id: 'audit-012',
    timestamp: '2026-05-11T09:05:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.2.15' },
    action: 'DEACTIVATE_SECRET',
    target: { type: 'Secret', id: 'rabbitmq-publisher-user', name: 'rabbitmq-publisher-user' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'deactivated' },
      },
    },
    rationale: 'manual_delete: RabbitMQ Publisher service decommissioned',
  },
  {
    id: 'audit-013',
    timestamp: '2026-05-10T18:00:00Z',
    actor: { type: 'AUTO_RESOLVER', id: 'system', ip: '10.0.0.1' },
    action: 'ARCHIVE_KEY',
    target: { type: 'EncryptionKey', id: 'container-edge-key', name: 'container-edge-key' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'deactivated' },
        after: { status: 'archived' },
      },
      reason: 'routine_archive',
    },
  },
  {
    id: 'audit-014',
    timestamp: '2026-05-09T12:30:00Z',
    actor: { type: 'USER', id: 'admin@thaki.cloud', name: 'admin', ip: '10.0.1.42' },
    action: 'ISSUE_CERTIFICATE',
    target: { type: 'Certificate', id: 'cert-auth-svc', name: 'auth-service.kms.svc' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: null,
        after: { status: 'active' },
      },
    },
    rationale: 'Initial issuance for new authentication service deployment',
  },
  {
    id: 'audit-015',
    timestamp: '2026-05-08T08:15:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.3.77' },
    action: 'ROTATE_SECRET',
    target: { type: 'Secret', id: 'openai-api-key', name: 'OPENAI_API_KEY' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { version: 4 },
        after: { version: 5 },
      },
    },
    rationale: 'rotation: Scheduled rotation of OpenAI API key',
  },
  {
    id: 'audit-016',
    timestamp: '2026-05-07T14:45:00Z',
    actor: { type: 'USER', id: 'admin@thaki.cloud', name: 'admin', ip: '10.0.1.42' },
    action: 'CREATE_KEY',
    target: { type: 'EncryptionKey', id: 'hmac-key-b64', name: 'hmac-key-b64' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: null,
        after: { status: 'active', version: 1 },
      },
    },
    rationale: 'New key created for HMAC signing',
  },
  {
    id: 'audit-017',
    timestamp: '2026-05-06T11:00:00Z',
    actor: { type: 'SYSTEM_BATCH', id: 'system', ip: '10.0.0.1' },
    action: 'EXPIRE_CERTIFICATE',
    target: { type: 'Certificate', id: 'cert-frontend', name: 'frontend-gateway.kms.svc' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { status: 'active' },
        after: { status: 'expired' },
      },
    },
  },
  {
    id: 'audit-018',
    timestamp: '2026-05-05T16:20:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.2.15' },
    action: 'ROTATE_SECRET',
    target: { type: 'Secret', id: 'valkey-auth', name: 'valkey-auth' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { version: 4 },
        after: { version: 5 },
      },
    },
    rationale: 'rotation: Monthly scheduled rotation',
  },
  {
    id: 'audit-019',
    timestamp: '2026-05-04T10:30:00Z',
    actor: { type: 'USER', id: 'admin@thaki.cloud', name: 'admin', ip: '10.0.1.42' },
    action: 'CREATE_KEY',
    target: { type: 'EncryptionKey', id: 'aead-key-b64', name: 'aead-key-b64' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: null,
        after: { status: 'active', version: 1 },
      },
    },
    rationale: 'New AEAD encryption key created',
  },
  {
    id: 'audit-020',
    timestamp: '2026-05-03T08:00:00Z',
    actor: { type: 'SYSTEM_BATCH', id: 'system', ip: '10.0.0.1' },
    action: 'ISSUE_CERTIFICATE',
    target: { type: 'Certificate', id: 'cert-controller', name: 'controller-manager.kms.svc' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: null,
        after: { status: 'active' },
      },
      reason: 'rotation',
    },
  },

  // ── kube_config_key (KMS020201 Encryption Key Detail) audit trail ──────────
  {
    id: 'audit-021',
    timestamp: '2026-05-18T09:12:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.2.15' },
    action: 'VIEW_KEY',
    target: { type: 'EncryptionKey', id: 'kube-config-key', name: 'kube_config_key' },
    result: { status: 'SUCCESS', changes: { before: null, after: null } },
    rationale: 'audit_review: Quarterly access review for container service keys',
  },
  {
    id: 'audit-022',
    timestamp: '2026-05-12T14:30:00Z',
    actor: {
      type: 'USER',
      id: 'container-admin@thaki.cloud',
      name: 'container-admin',
      ip: '10.0.3.21',
    },
    action: 'UPDATE_ROTATION_SETTINGS',
    target: { type: 'EncryptionKey', id: 'kube-config-key', name: 'kube_config_key' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { rotationPeriodDays: 30 },
        after: { rotationPeriodDays: 90 },
      },
    },
    rationale: 'policy_change: Aligned rotation period to 90-day platform standard',
  },
  {
    id: 'audit-023',
    timestamp: '2026-05-02T11:48:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.2.15' },
    action: 'ROTATE_KEY',
    target: { type: 'EncryptionKey', id: 'kube-config-key', name: 'kube_config_key' },
    result: {
      status: 'DENIED',
      reason: 'insufficient_permission',
      changes: { before: null, after: null },
    },
    rationale: 'manual_rotation: Requested early rotation — denied, missing kms:RotateKey role',
  },
  {
    id: 'audit-024',
    timestamp: '2026-04-30T10:05:00Z',
    actor: {
      type: 'USER',
      id: 'container-admin@thaki.cloud',
      name: 'container-admin',
      ip: '10.0.3.21',
    },
    action: 'ENABLE_AUTO_ROTATION',
    target: { type: 'EncryptionKey', id: 'kube-config-key', name: 'kube_config_key' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { autoRotation: false },
        after: { autoRotation: true },
      },
    },
    rationale: 'policy_change: Enabled automatic rotation on key provisioning',
  },
  {
    id: 'audit-025',
    timestamp: '2026-04-30T10:00:00Z',
    actor: {
      type: 'USER',
      id: 'container-admin@thaki.cloud',
      name: 'container-admin',
      ip: '10.0.3.21',
    },
    action: 'CREATE_KEY',
    target: { type: 'EncryptionKey', id: 'kube-config-key', name: 'kube_config_key' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: null,
        after: { status: 'active', version: 1 },
      },
    },
    rationale: 'provisioning: Created symmetric key for Kubernetes config encryption',
  },

  // ── github-token (KMS030201 Secret Detail) audit trail ─────────────────────
  {
    id: 'audit-026',
    timestamp: '2026-04-22T16:40:00Z',
    actor: {
      type: 'USER',
      id: 'ai-platform-admin@thaki.cloud',
      name: 'ai-platform-admin',
      ip: '10.0.4.30',
    },
    action: 'UPDATE_SECRET_TAGS',
    target: { type: 'Secret', id: 'github-token', name: 'GITHUB_TOKEN' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { tags: ['env: prod', 'owner: ai-platform'] },
        after: { tags: ['env: prod', 'owner: ai-platform', 'scope: repo,packages'] },
      },
    },
    rationale: 'metadata_update: Added scope tag for repo/packages access tracking',
  },
  {
    id: 'audit-027',
    timestamp: '2026-03-15T10:20:00Z',
    actor: { type: 'USER', id: 'operator@thaki.cloud', name: 'operator', ip: '10.0.2.15' },
    action: 'ROTATE_SECRET',
    target: { type: 'Secret', id: 'github-token', name: 'GITHUB_TOKEN' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { version: 2 },
        after: { version: 3 },
      },
    },
    rationale: 'manual_rotation: Rotated after team member offboarding',
  },
  {
    id: 'audit-028',
    timestamp: '2025-11-02T08:00:00Z',
    actor: { type: 'SYSTEM_BATCH', id: 'system', ip: '10.0.0.1' },
    action: 'ROTATE_SECRET',
    target: { type: 'Secret', id: 'github-token', name: 'GITHUB_TOKEN' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: { version: 1 },
        after: { version: 2 },
      },
    },
    rationale: 'rotation: Scheduled rotation per quarterly policy',
  },
  {
    id: 'audit-029',
    timestamp: '2025-07-20T09:30:00Z',
    actor: {
      type: 'USER',
      id: 'ai-platform-admin@thaki.cloud',
      name: 'ai-platform-admin',
      ip: '10.0.4.30',
    },
    action: 'CREATE_SECRET',
    target: { type: 'Secret', id: 'github-token', name: 'GITHUB_TOKEN' },
    result: {
      status: 'SUCCESS',
      changes: {
        before: null,
        after: { status: 'active', version: 1 },
      },
    },
    rationale: 'provisioning: Stored GitHub PAT for AI platform CI integration',
  },
];

export const getAuditLogsByResourceId = (resourceId: string): AuditLogEntry[] =>
  MOCK_AUDIT_LOGS.filter((entry) => entry.target.id === resourceId);

export const getRecentAuditLogs = (limit = 5): AuditLogEntry[] =>
  [...MOCK_AUDIT_LOGS]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
