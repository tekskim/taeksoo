import { useState, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  Badge,
  type BadgeTheme,
  Tooltip,
  MetricCard,
} from '@/design-system';
import { AuditSidebar } from '@/components/AuditSidebar';
import EventTrendChart, {
  TREND_NORMAL_COLOR,
  TREND_SENSITIVE_COLOR,
} from '@/components/EventTrendChart';
import { useTabs } from '@/contexts/TabContext';
import { IconHelpCircle, IconAlertTriangle } from '@tabler/icons-react';
import type { AuditLog } from './audit/types';
import {
  ADMIN_STATS,
  CURRENT_ROLE,
  STATS,
  STATS_PREV,
  VERB_LABEL,
  formatAbsoluteTime,
  formatActionLabel,
  maskActorId,
  sensitiveLogs,
} from './audit/mockData';

// 증감 비교 기준 — 모든 대시보드 지표는 현재 24h, 증감은 직전 24h(24~48h 전) 대비
const COMPARE_HINT = 'Compared to the preceding 24 hours (24–48h ago).';

// ── 카드 델타 ───────────────────────────────────────────────────────────────────
type DeltaTone = 'positive' | 'negative' | 'muted';

const TONE_COLOR: Record<DeltaTone, string> = {
  positive: 'var(--color-state-success)',
  negative: 'var(--color-state-danger)',
  muted: 'var(--color-text-subtle)',
};

/** 큰 값 + 작은 색상 델타 캡션을 MetricCard value(ReactNode)로 합성 (§1-2) */
function CardValue({ display, delta, tone }: { display: string; delta: string; tone: DeltaTone }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-heading-h4 text-[var(--color-text-default)]">{display}</span>
      <Tooltip content={COMPARE_HINT}>
        <span className="text-body-sm" style={{ color: TONE_COLOR[tone] }}>
          {delta}
        </span>
      </Tooltip>
    </span>
  );
}

const signed = (n: number): string => `${n >= 0 ? '+' : ''}${n}`;
const arrow = (n: number): string => (n > 0 ? '↑' : n < 0 ? '↓' : '·');

// ── 위젯 카드 셸 ──────────────────────────────────────────────────────────────────
function WidgetCard({
  title,
  caption,
  action,
  tooltip,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  caption?: string;
  /** 헤더 우측 액션 (예: 차트 범례) — 지정 시 caption 대신 렌더 */
  action?: ReactNode;
  /** 섹션 안내 툴팁 — 제목 옆 ⓘ에 마우스오버 시 표시 */
  tooltip?: string;
  children: ReactNode;
  /** 카드 루트 클래스 (그리드 span·h-full 등) */
  className?: string;
  /** 본문 영역 클래스 */
  bodyClassName?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 pt-3 pb-3 ${className ?? ''}`}
    >
      <HStack justify="between" align="center" className="mb-3">
        <span className="flex items-center gap-1.5">
          <span className="text-label-md text-[var(--color-text-default)]">{title}</span>
          {tooltip && (
            <Tooltip content={tooltip}>
              <span className="inline-flex text-[var(--color-text-subtle)]">
                <IconHelpCircle size={16} stroke={1.5} />
              </span>
            </Tooltip>
          )}
        </span>
        {action ??
          (caption && (
            <span className="text-body-sm text-[var(--color-text-subtle)]">{caption}</span>
          ))}
      </HStack>
      <div className={`flex min-h-0 flex-1 flex-col ${bodyClassName ?? ''}`}>{children}</div>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────────────────────
export default function AuditDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // ── §1-2 요약 카드 4종 (전일 대비 증감) ───────────────────────────────────────
  const cards = useMemo(() => {
    // 1. Total Events
    const totalDelta = STATS.total - STATS_PREV.total;

    // 2. Success Rate
    const rate = STATS.total ? (STATS.by_status.success / STATS.total) * 100 : 0;
    const prevRate = STATS_PREV.total ? (STATS_PREV.by_status.success / STATS_PREV.total) * 100 : 0;
    const rateDelta = rate - prevRate;

    // 3. Failed / Denied
    const failed = STATS.by_status.failure + STATS.by_status.denied;
    const prevFailed = STATS_PREV.by_status.failure + STATS_PREV.by_status.denied;
    const failedDelta = failed - prevFailed;

    // 4. Sensitive
    const sensDelta = STATS.sensitive_count - STATS_PREV.sensitive_count;

    return {
      total: { value: STATS.total, delta: totalDelta },
      rate: { value: rate, delta: rateDelta },
      failed: { value: failed, delta: failedDelta },
      sensitive: { value: STATS.sensitive_count, delta: sensDelta },
    };
  }, []);

  // ── §1-3 (a) Action Types 세그먼트 ────────────────────────────────────────────
  const actionSegments = useMemo(() => {
    const login = STATS.by_action.login ?? 0;
    // CRUD·Login 컬러 코딩 — TDS primitive color palette에서 선정 (의미 기반·시각 구분)
    // Create=green / Read=blue / Update=amber / Delete=red / Login=slate
    const entries: Array<{ key: string; label: string; count: number; color: string }> = [
      {
        key: 'create',
        label: VERB_LABEL.create,
        count: STATS.by_verb.create,
        color: 'var(--color-green-500)',
      },
      {
        key: 'read',
        label: VERB_LABEL.read,
        count: STATS.by_verb.read,
        color: 'var(--color-blue-500)',
      },
      {
        key: 'update',
        label: VERB_LABEL.update,
        count: STATS.by_verb.update,
        color: 'var(--color-amber-500)',
      },
      {
        key: 'delete',
        label: VERB_LABEL.delete,
        count: STATS.by_verb.delete,
        color: 'var(--color-red-500)',
      },
      { key: 'login', label: 'Login', count: login, color: 'var(--color-slate-500)' },
    ];
    const total = STATS.total || 1;
    return { entries, total };
  }, []);

  // ── §1-3 (c) Actor Watch — 전일 대비 급증순 ───────────────────────────────────
  const actorWatch = useMemo(() => {
    const prevByTpn = new Map(STATS_PREV.top_actors.map((a) => [a.tpn, a.count]));
    return STATS.top_actors
      .map((a) => {
        const prevCount = prevByTpn.get(a.tpn) ?? 0;
        return { ...a, prevCount, delta: a.count - prevCount };
      })
      .sort((x, y) => y.delta - x.delta);
  }, []);

  // ── §1-3 (d) Sensitive Access ─────────────────────────────────────────────────
  const sensitive: AuditLog[] = useMemo(() => sensitiveLogs(5), []);

  // 행위자 표시 — 도메인 사용자만 마스킹 (§0-5)
  const displayActor = (name: string): string =>
    CURRENT_ROLE === 'domain_user' ? maskActorId(name) : name;

  const isSysAdmin = CURRENT_ROLE === 'sysadmin';

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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'prod-cluster-01', href: '/audit/dashboard' },
                { label: 'Dashboard' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader title="Dashboard" />

        {/* §1-2 요약 카드 (최근 24h, 증감은 직전 24h 대비) */}
        <MetricCard.Group>
          <MetricCard
            title="Total Events"
            tooltip="All audit events recorded in the last 24 hours, within your current project and role scope."
            value={
              <CardValue
                display={cards.total.value.toLocaleString()}
                delta={`${arrow(cards.total.delta)} ${signed(cards.total.delta)}`}
                tone={cards.total.delta > 0 ? 'positive' : 'muted'}
              />
            }
          />
          <MetricCard
            title="Success Rate"
            tooltip="Share of events that completed successfully (success ÷ total) in the last 24 hours."
            value={
              <CardValue
                display={`${cards.rate.value.toFixed(1)}%`}
                delta={`${arrow(cards.rate.delta)} ${signed(Number(cards.rate.delta.toFixed(1)))}%p`}
                tone={cards.rate.delta >= 0 ? 'positive' : 'negative'}
              />
            }
          />
          <MetricCard
            title="Failed / Denied"
            tooltip="Events that failed or were denied by authentication, authorization, or policy in the last 24 hours."
            value={
              <CardValue
                display={cards.failed.value.toLocaleString()}
                delta={`${arrow(cards.failed.delta)} ${signed(cards.failed.delta)}`}
                tone={cards.failed.delta > 0 ? 'negative' : 'muted'}
              />
            }
          />
          <MetricCard
            title="Sensitive Events"
            tooltip="Events flagged as touching sensitive resources or data in the last 24 hours."
            value={
              <CardValue
                display={cards.sensitive.value.toLocaleString()}
                delta={`${arrow(cards.sensitive.delta)} ${signed(cards.sensitive.delta)}`}
                tone={cards.sensitive.delta > 0 ? 'negative' : 'muted'}
              />
            }
          />
        </MetricCard.Group>

        {/* §1-3-1 시스템 현황 스트립 — SysAdmin 전용. Total Logs·DLQ·Newest Event는 전체 기간, Ingest Rate는 최근 24h 집계 */}
        {isSysAdmin && (
          <MetricCard.Group>
            <MetricCard
              title="Total Logs"
              tooltip="Total audit events ingested across the system — all time."
              value={ADMIN_STATS.total_logs.toLocaleString()}
            />
            <MetricCard
              title="DLQ Pending"
              tooltip="Events currently in the dead-letter queue — failed ingestion awaiting reprocessing."
              value={
                <span className="flex items-center gap-2">
                  {ADMIN_STATS.dlq_pending}
                  {ADMIN_STATS.dlq_pending > 0 && (
                    <IconAlertTriangle
                      size={16}
                      stroke={1.5}
                      className="text-[var(--color-state-danger-text)]"
                    />
                  )}
                </span>
              }
            />
            <MetricCard
              title="Ingest Rate"
              tooltip="Average events ingested per hour — last 24 hours."
              value={`${(ADMIN_STATS.last_24h / 24).toFixed(1)}/h`}
            />
            <MetricCard
              title="Retention"
              tooltip="How long audit logs are kept and remain searchable before expiring."
              value={`${ADMIN_STATS.retention_days} days`}
            />
            <MetricCard
              title="Newest Event"
              tooltip="When the most recent audit event was ingested."
              value={ADMIN_STATS.newest_log ? formatAbsoluteTime(ADMIN_STATS.newest_log) : '-'}
            />
          </MetricCard.Group>
        )}

        {/* §1-3 위젯 — 2/3 + 1/3 레이아웃 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 좌측 컬럼 */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* (a) Action Types */}
            <WidgetCard
              title="Action Types"
              tooltip="Breakdown of events by action type (Create / Read / Update / Delete / Login) over the last 24 hours."
            >
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
                {actionSegments.entries
                  .filter((s) => s.count > 0)
                  .map((s) => (
                    <div
                      key={s.key}
                      style={{
                        width: `${(s.count / actionSegments.total) * 100}%`,
                        backgroundColor: s.color,
                      }}
                      aria-hidden
                    />
                  ))}
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {actionSegments.entries.map((s) => {
                  const pct = (s.count / actionSegments.total) * 100;
                  return (
                    <div key={s.key} className="flex flex-col gap-[2px]">
                      <span className="flex items-center gap-1">
                        <span
                          className="size-2 shrink-0 rounded-sm"
                          style={{ backgroundColor: s.color }}
                          aria-hidden
                        />
                        <span className="truncate text-body-sm text-[var(--color-text-subtle)]">
                          {s.label}
                        </span>
                        <span className="text-body-sm font-semibold text-[var(--color-text-default)]">
                          {s.count}
                        </span>
                      </span>
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </WidgetCard>

            {/* (b) Event Trend — peak 값 별도 표기 안 함 (정책) */}
            <WidgetCard
              title="Event Trend"
              tooltip="Hourly event volume over the last 24 hours, including sensitive events."
              action={<TrendLegend />}
            >
              <EventTrendChart buckets={STATS.buckets} />
            </WidgetCard>
          </div>

          {/* 우측 컬럼 */}
          <div className="flex flex-col gap-4">
            {/* (c) Actor watch */}
            <WidgetCard
              title="Actor watch"
              tooltip="Actors with the most activity over the last 24 hours, ranked by the largest increase over the previous 24 hours."
            >
              <VStack gap={1}>
                {actorWatch.map((a, idx) => {
                  const name = a.actor_name ?? a.tpn;
                  const reason = actorReason(a.denied_count, a.sensitive_count, a.delta);
                  // 거부 급증(Denied spike, 거부 ≥ 5) 행은 위험 강조 — subtle danger 배경 (develop 정합)
                  const isDeniedSpike = a.denied_count >= 5;
                  return (
                    <div
                      key={a.tpn}
                      className={`flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 ${
                        isDeniedSpike ? 'bg-[var(--color-state-danger-bg)]' : ''
                      }`}
                    >
                      {/* 한 줄: 순위 + 이름 + 활동 건수 + 대표 이유 뱃지 (컴팩트) */}
                      <span className="w-4 shrink-0 text-center text-body-sm font-semibold tabular-nums text-[var(--color-text-subtle)]">
                        {idx + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-body-md font-medium text-[var(--color-text-default)]">
                        {displayActor(name)}
                      </span>
                      <span className="shrink-0 text-body-sm tabular-nums text-[var(--color-text-subtle)]">
                        {a.count} new {a.count === 1 ? 'event' : 'events'}
                      </span>
                      {reason && (
                        <Tooltip content={reason.condition}>
                          <Badge theme={reason.theme} type="subtle" size="sm">
                            {reason.label}
                          </Badge>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </VStack>
            </WidgetCard>

            {/* (d) Sensitive Access */}
            <WidgetCard
              title="Sensitive Access"
              tooltip="The 5 most recent events that accessed sensitive resources."
            >
              <VStack gap={0.5}>
                {sensitive.map((row) => {
                  const target = row.target_name ?? row.trn;
                  return (
                    <button
                      key={row.event_id}
                      type="button"
                      onClick={() => navigate(`/audit/logs/${row.event_id}`)}
                      className="flex w-full items-center gap-2 border-b border-[var(--color-border-subtle)] px-1 py-2 text-left transition-colors last:border-b-0 hover:bg-[var(--color-surface-subtle)]"
                    >
                      {/* 한 줄: 액션 + 서비스·대상 + 시각 (컴팩트) */}
                      <span className="min-w-0 flex-1 truncate">
                        <span className="text-body-md font-medium text-[var(--color-text-default)]">
                          {formatActionLabel(row.action)}
                        </span>
                        <span className="text-body-sm text-[var(--color-text-subtle)]">
                          {' · '}
                          {row.source_service} · {target}
                        </span>
                      </span>
                      <span className="shrink-0 text-body-sm text-[var(--color-text-subtle)]">
                        {formatAbsoluteTime(row.timestamp)}
                      </span>
                    </button>
                  );
                })}
                {sensitive.length === 0 && (
                  <span className="px-2 py-3 text-body-sm text-[var(--color-text-subtle)]">
                    No sensitive events recorded.
                  </span>
                )}
              </VStack>
            </WidgetCard>
          </div>
        </div>
      </VStack>
    </PageShell>
  );
}

// ── Event Trend 헤더 범례 (§1-3) ─────────────────────────────────────────────────
function TrendLegend() {
  const items: Array<{ label: string; color: string }> = [
    { label: 'Normal', color: TREND_NORMAL_COLOR },
    { label: 'Sensitive', color: TREND_SENSITIVE_COLOR },
  ];
  return (
    <span className="flex shrink-0 items-center gap-3">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          <span className="size-2 rounded-sm" style={{ backgroundColor: item.color }} aria-hidden />
          <span className="text-body-sm text-[var(--color-text-subtle)]">{item.label}</span>
        </span>
      ))}
    </span>
  );
}

// ── Actor Watch 대표 사유 뱃지 (§1-3) ───────────────────────────────────────────
function actorReason(
  deniedCount: number,
  sensitiveCount: number,
  delta: number
): { label: string; theme: BadgeTheme; condition: string } | null {
  // 라벨·테마는 develop(ACTOR_REASON_BADGE + locale actorWatch.reason.*) 정합
  // condition = 대표 사유가 표기된 조건(정책 §1-3 우선순위) + 실제 트리거 값
  if (deniedCount >= 5)
    return {
      label: 'Denied spike',
      theme: 'red',
      condition: `Top denied actor with 5 or more denied actions (${deniedCount} denied).`,
    };
  if (deniedCount > 0)
    return {
      label: 'Denied',
      theme: 'red',
      condition: `Has one or more denied actions (${deniedCount} denied).`,
    };
  if (sensitiveCount > 0)
    return {
      label: 'Sensitive access',
      theme: 'blue',
      condition: `Has one or more sensitive accesses (${sensitiveCount} sensitive).`,
    };
  if (delta > 0)
    return {
      label: 'Activity spike',
      theme: 'yellow',
      condition: `Activity increased over the previous period (${signed(delta)}).`,
    };
  return null;
}
