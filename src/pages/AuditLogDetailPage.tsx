import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  Button,
  DetailHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  StatusIndicator,
  Tag,
  Table,
  type TableColumn,
  CopyButton,
  Modal,
  FormField,
  Textarea,
  Input,
  EmptyState,
  InlineMessage,
} from '@/design-system';
import { AuditSidebar } from '@/components/AuditSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconShieldCheck,
  IconLockOpen,
  IconChevronRight,
  IconChevronDown,
} from '@tabler/icons-react';
import type { AuditLog, IntegrityState, TraceEvent } from './audit/types';
import {
  CURRENT_ROLE,
  STATUS_META,
  formatAbsoluteTime,
  formatActionLabel,
  getLogById,
  getTraceForLog,
  maskActorId,
} from './audit/mockData';

const MASK = '***';

// ── 무결성 상태 → 표기 메타 (§2-7) ─────────────────────────────────────────────
const INTEGRITY_META: Record<
  IntegrityState,
  { label: string; tagVariant: 'default' | 'success' | 'danger' | 'warning' }
> = {
  unverified: { label: 'Not verified', tagVariant: 'default' },
  valid: { label: 'Valid', tagVariant: 'success' },
  mismatch: { label: 'Mismatch', tagVariant: 'danger' },
  'no-hash': { label: 'No hash stored', tagVariant: 'warning' },
};

// ── Changes diff 계산 ─────────────────────────────────────────────────────────
type DiffKind = 'added' | 'removed' | 'modified';
interface DiffRow {
  field: string;
  before: unknown;
  after: unknown;
  kind: DiffKind;
}

const fmtVal = (v: unknown): string => {
  if (v === undefined) return '—';
  if (v === null) return 'null';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
};

function computeDiff(changes: {
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}): DiffRow[] {
  const { before, after } = changes;
  const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)])).sort();
  const rows: DiffRow[] = [];
  for (const field of keys) {
    const hasBefore = Object.prototype.hasOwnProperty.call(before, field);
    const hasAfter = Object.prototype.hasOwnProperty.call(after, field);
    const b = before[field];
    const a = after[field];
    if (hasBefore && !hasAfter) {
      rows.push({ field, before: b, after: undefined, kind: 'removed' });
    } else if (!hasBefore && hasAfter) {
      rows.push({ field, before: undefined, after: a, kind: 'added' });
    } else if (JSON.stringify(b) !== JSON.stringify(a)) {
      rows.push({ field, before: b, after: a, kind: 'modified' });
    }
  }
  return rows;
}

// ── Trace 행 인라인 Diff (§2-7) ───────────────────────────────────────────────
function TraceDiff({ changes, masked }: { changes: AuditLog['changes']; masked: boolean }) {
  if (!changes) {
    return (
      <span className="text-body-sm text-[var(--color-text-subtle)]">
        No changes (read-only event).
      </span>
    );
  }
  if (masked) {
    return (
      <span className="text-body-sm text-[var(--color-text-subtle)]">
        {CURRENT_ROLE === 'domain_user'
          ? 'Masked — your role cannot view sensitive values.'
          : 'Masked — activate Reveal original to view.'}
      </span>
    );
  }
  const diff = computeDiff(changes);
  if (diff.length === 0) {
    return (
      <span className="text-body-sm text-[var(--color-text-subtle)]">
        No field-level differences.
      </span>
    );
  }
  const modified = diff.filter((d) => d.kind === 'modified').length;
  const added = diff.filter((d) => d.kind === 'added').length;
  const removed = diff.filter((d) => d.kind === 'removed').length;
  return (
    <VStack gap={2} className="w-full">
      <span className="text-body-sm text-[var(--color-text-subtle)]">
        {modified} modified · {added} added · {removed} removed
      </span>
      <VStack gap={1.5} className="w-full">
        {diff.map((d) => (
          <div key={d.field} className="flex flex-col gap-0.5">
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              {d.field} · {d.kind}
            </span>
            <HStack gap={2} align="center" className="flex-wrap">
              <span className="font-mono text-body-sm text-[var(--color-text-subtle)] line-through">
                {fmtVal(d.before)}
              </span>
              <span className="text-[var(--color-text-subtle)]">→</span>
              <span className="font-mono text-body-sm font-medium text-[var(--color-action-primary)]">
                {fmtVal(d.after)}
              </span>
            </HStack>
          </div>
        ))}
      </VStack>
    </VStack>
  );
}

// ── 메인 ────────────────────────────────────────────────────────────────────────
export default function AuditLogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  // Trace 탭 — 펼친 행 집합 (여러 행 동시 펼침, 현재 이벤트 기본 펼침)
  const [expandedTrace, setExpandedTrace] = useState<Set<string>>(() => new Set(id ? [id] : []));
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // 무결성 검증 결과 — 식별 영역에 노출 (§2-7)
  const [integrity, setIntegrity] = useState<IntegrityState>('unverified');

  // Break-glass (원본 보기) 세션 (§0-5)
  const [breakGlassOpen, setBreakGlassOpen] = useState(false);
  const [breakGlassActive, setBreakGlassActive] = useState(false);
  const [breakGlassExpiry, setBreakGlassExpiry] = useState<string | null>(null);
  const [bgReason, setBgReason] = useState('');
  const [bgDuration, setBgDuration] = useState('4');

  const log = id ? getLogById(id) : undefined;

  const trace = useMemo<TraceEvent[]>(() => (log ? getTraceForLog(log) : []), [log]);

  // ── 미존재 처리 ──────────────────────────────────────────────────────────────
  if (!log) {
    return (
      <PageShell
        sidebar={
          <AuditSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        }
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
            showNavigation
            onBack={() => navigate('/audit/logs')}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'prod-cluster-01', href: '/audit/logs' },
                  { label: 'Audit Logs', href: '/audit/logs' },
                  { label: id ?? 'Unknown' },
                ]}
              />
            }
          />
        }
        contentClassName="pt-4 px-8 pb-20"
      >
        <div className="flex min-h-[400px] w-full items-center justify-center">
          <EmptyState
            title="Audit event not found."
            description="The requested audit event does not exist or is no longer available."
            action={
              <Button variant="secondary" size="sm" onClick={() => navigate('/audit/logs')}>
                Back to Audit Logs
              </Button>
            }
          />
        </div>
      </PageShell>
    );
  }

  // 민감 필드 마스킹 여부 — 비관리자이거나, 민감 이벤트인데 원본 보기 미활성 (§0-5)
  const masked = CURRENT_ROLE === 'domain_user' || (log.sensitive && !breakGlassActive);

  const maskedText = (value: string | null | undefined): string => {
    if (value == null || value === '') return '-';
    return masked ? MASK : value;
  };

  // ── 무결성 검증 (§2-7) ──────────────────────────────────────────────────────
  const handleVerifyIntegrity = () => {
    // event_metadata에 강제 mismatch 플래그를 둔 이벤트는 불일치로 표시 (데모용)
    if (log.event_metadata?.['__integrity_mismatch']) {
      setIntegrity('mismatch');
    } else if (log.integrity_hash) {
      setIntegrity('valid');
    } else {
      setIntegrity('no-hash');
    }
  };

  // ── Break-glass 활성화 (§0-5) ──────────────────────────────────────────────
  const handleActivateBreakGlass = () => {
    if (bgReason.trim().length < 10) return;
    const hours = Math.min(24, Math.max(1, Number(bgDuration) || 4));
    const expiry = new Date(Date.now() + hours * 3600_000);
    setBreakGlassActive(true);
    setBreakGlassExpiry(formatAbsoluteTime(expiry.toISOString()));
    setBreakGlassOpen(false);
  };

  const integrityMeta = INTEGRITY_META[integrity];

  // 관련 이벤트가 없어도 현재 이벤트 1행으로 통일 (develop 정합)
  const traceItems: TraceEvent[] =
    trace.length > 0
      ? trace
      : [
          {
            event_id: log.event_id,
            timestamp: log.timestamp,
            action: log.action,
            actor_id: log.actor_id,
            target_type: log.target_type,
            target_id: log.target_id,
            status: log.status,
            source_service: log.source_service,
          },
        ];

  const toggleTraceRow = (eventId: string) =>
    setExpandedTrace((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });

  // Trace 테이블 컬럼 — 펼침▸ / 시간 / 서비스 / 액션 / 결과 (TDS Table)
  const traceColumns: TableColumn<TraceEvent>[] = [
    {
      key: '_expand',
      label: '',
      width: 40,
      align: 'center',
      resizable: false,
      render: (_: unknown, row: TraceEvent) => (
        <span className="flex items-center justify-center text-[var(--color-text-muted)]">
          {expandedTrace.has(row.event_id) ? (
            <IconChevronDown size={14} />
          ) : (
            <IconChevronRight size={14} />
          )}
        </span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Time',
      width: 190,
      resizable: false,
      render: (_: unknown, row: TraceEvent) => (
        <span className="font-mono text-body-sm text-[var(--color-text-subtle)]">
          {formatAbsoluteTime(row.timestamp)}
        </span>
      ),
    },
    {
      key: 'source_service',
      label: 'Service',
      width: 120,
      resizable: false,
      render: (_: unknown, row: TraceEvent) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{row.source_service}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      flex: 1,
      minWidth: 200,
      render: (_: unknown, row: TraceEvent) => {
        const isCurrent = row.event_id === log.event_id;
        return (
          <span className="flex min-w-0 items-center gap-1.5">
            {isCurrent ? (
              <span className="truncate text-body-md font-semibold text-[var(--color-text-default)]">
                {formatActionLabel(row.action)}
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/audit/logs/${row.event_id}`);
                }}
                className="truncate text-left text-body-md font-medium text-[var(--color-action-primary)] hover:underline"
              >
                {formatActionLabel(row.action)}
              </button>
            )}
            {isCurrent && (
              <Tag size="sm" variant="default">
                current
              </Tag>
            )}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Result',
      width: 120,
      align: 'center',
      resizable: false,
      render: (_: unknown, row: TraceEvent) => (
        <StatusIndicator
          status={STATUS_META[row.status].indicator}
          label={STATUS_META[row.status].label}
          layout="badge"
          hideIcon
        />
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<AuditSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
          showNavigation
          onBack={() => navigate('/audit/logs')}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'prod-cluster-01', href: '/audit/logs' },
                { label: 'Audit Logs', href: '/audit/logs' },
                { label: log.event_id },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        {/* 원본 보기(Break-glass) 활성 배너 (§0-5) */}
        {breakGlassActive && (
          <InlineMessage
            variant="warning"
            title="Original view active"
            message={`Masking lifted until ${breakGlassExpiry}. This access is itself recorded as an audit event.`}
          />
        )}
        {/* 무결성 불일치 사고 배너 (§2-7) — develop 정합 */}
        {integrity === 'mismatch' && (
          <InlineMessage
            variant="error"
            title="Integrity mismatch detected"
            message="This event's hash does not match the stored value. Report it to the security team immediately."
          />
        )}

        {/* 식별 영역 + 액션 (§2-7) */}
        <DetailHeader>
          <DetailHeader.Title>{formatActionLabel(log.action)}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconShieldCheck size={12} />}
              onClick={handleVerifyIntegrity}
            >
              Verify integrity
            </Button>
            {/* 원본 보기(Break-glass)는 관리자 전용 (§0-5) — Domain User에게는 노출하지 않음 */}
            {CURRENT_ROLE !== 'domain_user' && log.sensitive && !breakGlassActive && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconLockOpen size={12} />}
                onClick={() => setBreakGlassOpen(true)}
              >
                Reveal original
              </Button>
            )}
            <CopyButton
              value={JSON.stringify(log, null, 2)}
              variant="secondary"
              size="sm"
              label="Copy JSON"
            />
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Event ID" value={log.event_id} copyable />
            <DetailHeader.InfoCard label="Time" value={formatAbsoluteTime(log.timestamp)} />
            <DetailHeader.InfoCard
              label="Action"
              value={`${formatActionLabel(log.action)} · ${log.action_category}`}
            />
            <DetailHeader.InfoCard
              label="Result"
              value={STATUS_META[log.status].label}
              status={STATUS_META[log.status].indicator}
            />
            <DetailHeader.InfoCard label="Sensitive" value={log.sensitive ? 'Yes' : 'No'} />
            <DetailHeader.InfoCard
              label="Integrity"
              value={
                <Tag size="sm" variant={integrityMeta.tagVariant}>
                  {integrityMeta.label}
                </Tag>
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* 상세 탭 (§2-7) */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="details">Details</Tab>
            <Tab value="trace">Trace</Tab>
            <Tab value="raw">Raw JSON</Tab>
          </TabList>

          {/* ── Details (5W1H) ──────────────────────────────────────────── */}
          <TabPanel value="details">
            <VStack gap={4}>
              {/* Actor (Who) */}
              <SectionCard>
                <SectionCard.Header title="Actor (Who)" />
                <SectionCard.Content showDividers>
                  <SectionCard.DataRow label="Actor type" value={log.actor_type} />
                  <SectionCard.DataRow label="TPN">
                    <span className="font-mono text-body-md">
                      {masked ? `${log.actor_type}:${maskActorId(log.actor_id)}` : log.tpn}
                    </span>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Name" value={maskedText(log.actor_name)} />
                  <SectionCard.DataRow label="IP">
                    <span className="font-mono text-body-md">{maskedText(log.actor_ip)}</span>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              {/* Target (What) */}
              <SectionCard>
                <SectionCard.Header title="Target (What)" />
                <SectionCard.Content showDividers>
                  <SectionCard.DataRow label="Target type" value={log.target_type} />
                  <SectionCard.DataRow label="Target ID">
                    <span className="font-mono text-body-md">{log.target_id}</span>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Target name" value={log.target_name ?? '-'} />
                  <SectionCard.DataRow label="TRN">
                    <span className="font-mono text-body-md">{log.trn}</span>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              {/* Request / Source (Where) */}
              <SectionCard>
                <SectionCard.Header title="Request / Source (Where)" />
                <SectionCard.Content showDividers>
                  <SectionCard.DataRow label="Source service" value={log.source_service} />
                  <SectionCard.DataRow label="Request ID">
                    <span className="font-mono text-body-md">{log.request_id}</span>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Trace ID">
                    <span className="font-mono text-body-md">{log.trace_id}</span>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Session ID">
                    <span className="font-mono text-body-md">{log.session_id}</span>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="User agent">
                    <span className="font-mono text-body-sm text-[var(--color-text-subtle)]">
                      {log.user_agent}
                    </span>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              {/* Resource scope (Context · Why) */}
              <SectionCard>
                <SectionCard.Header title="Resource scope (Context · Why)" />
                <SectionCard.Content showDividers>
                  <SectionCard.DataRow label="Domain" value={log.domain} />
                  <SectionCard.DataRow label="Project" value={log.project} />
                  <SectionCard.DataRow label="Group" value={log.group ?? '-'} />
                  <SectionCard.DataRow label="Schema ID" value={log.schema_id ?? '-'} />
                  <SectionCard.DataRow label="Reason" value={maskedText(log.reason)} />
                  <SectionCard.DataRow label="Compliance labels">
                    {log.compliance_labels.length ? (
                      <HStack gap={1} className="flex-wrap">
                        {log.compliance_labels.map((l) => (
                          <Tag key={l} size="sm" variant="info">
                            {l}
                          </Tag>
                        ))}
                      </HStack>
                    ) : (
                      <span className="text-body-md text-[var(--color-text-subtle)]">-</span>
                    )}
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Integrity hash">
                    <span className="font-mono text-body-sm text-[var(--color-text-subtle)]">
                      {log.integrity_hash}
                    </span>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          {/* ── Trace (요청 추적 + 행 펼침 시 인라인 Diff) — TDS Table(expandedContent) ── */}
          <TabPanel value="trace">
            <Table<TraceEvent>
              columns={traceColumns}
              data={traceItems}
              rowKey="event_id"
              resizable={false}
              onRowClick={(row) => toggleTraceRow(row.event_id)}
              expandedContent={(row) => {
                if (!expandedTrace.has(row.event_id)) return null;
                const isCurrent = row.event_id === log.event_id;
                const evLog = isCurrent ? log : getLogById(row.event_id);
                const evMasked =
                  CURRENT_ROLE === 'domain_user' || Boolean(evLog?.sensitive && !breakGlassActive);
                return (
                  <div className="px-3 py-3">
                    <TraceDiff changes={evLog?.changes ?? null} masked={evMasked} />
                  </div>
                );
              }}
            />
          </TabPanel>

          {/* ── Raw JSON ──────────────────────────────────────────────── */}
          <TabPanel value="raw">
            <SectionCard>
              <SectionCard.Header
                title="Raw Event"
                actions={
                  <CopyButton value={JSON.stringify(log, null, 2)} variant="ghost" size="sm" />
                }
              />
              <SectionCard.Content showDividers={false}>
                <pre className="w-full overflow-x-auto whitespace-pre-wrap break-words rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] p-3 font-mono text-body-sm text-[var(--color-text-default)]">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </SectionCard.Content>
            </SectionCard>
          </TabPanel>
        </Tabs>
      </VStack>

      {/* Break-glass 모달 (§0-5) */}
      <Modal
        isOpen={breakGlassOpen}
        onClose={() => setBreakGlassOpen(false)}
        title="Reveal original (Break-glass)"
        description="Viewing masked sensitive data is a privileged action and is itself recorded as an audit event. Provide a reason and duration."
      >
        <VStack gap={5}>
          <FormField label="Reason" required>
            <Textarea
              placeholder="Why do you need to view the original data? (10–500 characters)"
              value={bgReason}
              onChange={(e) => setBgReason(e.target.value.slice(0, 500))}
              fullWidth
              rows={4}
            />
            <span className="mt-1 block text-right text-body-sm text-[var(--color-text-subtle)]">
              {bgReason.length} / 500
            </span>
          </FormField>

          <FormField label="Duration (hours)">
            <Input
              type="number"
              min={1}
              max={24}
              value={bgDuration}
              onChange={(e) => setBgDuration(e.target.value)}
              fullWidth
            />
          </FormField>

          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={() => setBreakGlassOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleActivateBreakGlass}
              disabled={bgReason.trim().length < 10}
              className="flex-1"
            >
              Activate
            </Button>
          </HStack>
        </VStack>
      </Modal>
    </PageShell>
  );
}
