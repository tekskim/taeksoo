import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  FilterSearchInput,
  type AppliedFilter,
  ListToolbar,
  Pagination,
  Table,
  type TableColumn,
  Select,
  Toggle,
  Tag,
  Tooltip,
  StatusIndicator,
} from '@/design-system';
import { AuditSidebar } from '@/components/AuditSidebar';
import LogTimelineChart, { type TimeRange } from '@/components/LogTimelineChart';
import { LabelWithTip } from '@/components/LabelWithTip';
import { useTabs } from '@/contexts/TabContext';
import { IconAlertTriangle } from '@tabler/icons-react';
import type { AuditLog } from './audit/types';
import {
  AUDIT_LOGS,
  CATEGORY_LABEL,
  CURRENT_ROLE,
  DEFAULT_TIME_RANGE,
  STATS,
  STATUS_META,
  TIME_PRESETS,
  formatActionLabel,
  formatShortTime,
  maskActorId,
} from './audit/mockData';
import type { StatsBucket } from './audit/types';

// 타임라인 히스토그램 버킷 스텝 — 1시간 (로그 분포를 시간 단위로 집계)
const TIMELINE_STEP_MS = 3_600_000;

// 행위자 표시 — 비관리자는 마스킹 (§0-5). 목업 역할은 sysadmin이라 원문 노출
const displayActor = (log: AuditLog): string => {
  const base = log.actor_name ?? log.actor_id;
  return CURRENT_ROLE === 'domain_user' ? maskActorId(base) : base;
};
const displayIp = (log: AuditLog): string => {
  if (!log.actor_ip) return '-';
  return CURRENT_ROLE === 'domain_user' ? '***' : log.actor_ip;
};

// ── 메인 ────────────────────────────────────────────────────────────────────────
export default function AuditLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [timeRange, setTimeRange] = useState<string>(DEFAULT_TIME_RANGE);
  const [sensitiveOnly, setSensitiveOnly] = useState(false);
  // 타임라인 드래그 선택 구간 — 지정 시 테이블을 해당 시간 범위로 필터링
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);
  const [page, setPage] = useState(1);
  // 페이지당 최대 10개 고정 — TDS 테이블엔 page-size 선택 패턴이 없어 임의 셀렉터를 두지 않는다
  const pageSize = 10;

  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // 액션·서비스 옵션은 통계에서 동적 구성 (§2-3)
  const actionOptions = useMemo(
    () =>
      Object.keys(STATS.by_action)
        .filter((a) => a !== 'login')
        .sort()
        .map((value) => ({ value, label: formatActionLabel(value) })),
    []
  );
  const serviceOptions = useMemo(
    () =>
      Object.keys(STATS.by_service)
        .sort()
        .map((value) => ({ value, label: value })),
    []
  );

  const filtered = useMemo(() => {
    const get = (fieldId: string) => appliedFilters.find((f) => f.fieldId === fieldId)?.value;
    const tpn = get('tpn')?.toLowerCase();
    const trn = get('trn')?.toLowerCase();
    const ip = get('actor_ip')?.toLowerCase();
    const category = get('action_category');
    const action = get('action');
    const status = get('status');
    const service = get('source_service');

    return AUDIT_LOGS.filter((l) => {
      if (sensitiveOnly && !l.sensitive) return false;
      // 타임라인 드래그 선택 구간 [start, end) 필터 (§2-4-1)
      if (selectedRange) {
        const ts = new Date(l.timestamp).getTime();
        if (ts < selectedRange.start.getTime() || ts >= selectedRange.end.getTime()) return false;
      }
      if (tpn && !l.tpn.toLowerCase().includes(tpn)) return false;
      if (trn && !l.trn.toLowerCase().includes(trn)) return false;
      if (ip && !(l.actor_ip ?? '').toLowerCase().includes(ip)) return false;
      if (category && l.action_category !== category) return false;
      if (action && l.action !== action) return false;
      if (status && l.status !== status) return false;
      if (service && l.source_service !== service) return false;
      return true;
    }).sort((a, b) => b.timestamp.localeCompare(a.timestamp)); // 시간 최신순 고정 (§2-6)
  }, [appliedFilters, sensitiveOnly, selectedRange]);

  // 타임라인 히스토그램 — 실제 로그 분포에서 파생 (LogExplorer 패턴: 차트 ⟷ 테이블 동일 데이터).
  // 전체 로그를 1시간 버킷으로 집계해 막대가 곧 로그 분포이며, 드래그 구간 ↔ 행이 정확히 대응한다.
  const timelineBuckets = useMemo<StatsBucket[]>(() => {
    if (AUDIT_LOGS.length === 0) return [];
    const times = AUDIT_LOGS.map((l) => new Date(l.timestamp).getTime());
    const min = Math.min(...times);
    const max = Math.max(...times);
    const windowStart = Math.floor(min / TIMELINE_STEP_MS) * TIMELINE_STEP_MS;
    const lastStart = Math.floor(max / TIMELINE_STEP_MS) * TIMELINE_STEP_MS;
    const n = Math.round((lastStart - windowStart) / TIMELINE_STEP_MS) + 1;
    const buckets: StatsBucket[] = Array.from({ length: n }, (_, i) => ({
      start: new Date(windowStart + i * TIMELINE_STEP_MS).toISOString(),
      total: 0,
      failed: 0,
      sensitive: 0,
    }));
    for (const l of AUDIT_LOGS) {
      const idx = Math.floor((new Date(l.timestamp).getTime() - windowStart) / TIMELINE_STEP_MS);
      if (idx < 0 || idx >= n) continue;
      buckets[idx].total += 1;
      if (l.sensitive) buckets[idx].sensitive += 1;
      if (l.status !== 'success') buckets[idx].failed += 1;
    }
    return buckets;
  }, []);

  // 헤더 요약 — 전체 로그 기준(히스토그램 합계와 일치, LogExplorer처럼 필터와 무관하게 고정)
  const headerStats = useMemo(() => {
    const total = AUDIT_LOGS.length;
    const success = AUDIT_LOGS.filter((l) => l.status === 'success').length;
    const failed = total - success;
    return {
      successRate: total ? (success / total) * 100 : null,
      failureRate: total ? (failed / total) * 100 : null,
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleFiltersChange = (next: AppliedFilter[]) => {
    setAppliedFilters(next);
    setPage(1); // 필터 변경 시 1페이지로 리셋 (§2-6)
  };

  const columns: TableColumn<AuditLog>[] = [
    {
      key: 'status',
      label: 'Status',
      headerRender: () => (
        <LabelWithTip
          label="Status"
          tip="Event outcome — Success, Fail, or Denied (by authentication / authorization / policy)."
        />
      ),
      width: 110,
      align: 'center',
      resizable: false,
      render: (_: unknown, row: AuditLog) => (
        <StatusIndicator
          status={STATUS_META[row.status].indicator}
          label={STATUS_META[row.status].label}
          layout="badge"
          hideIcon
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      headerRender: () => (
        <LabelWithTip label="Action" tip="What was done, as verb + noun (e.g., Update role)." />
      ),
      flex: 1,
      minWidth: 200,
      render: (_: unknown, row: AuditLog) => (
        <HStack gap={1.5} align="center" className="min-w-0">
          <span className="truncate text-body-md font-medium text-[var(--color-action-primary)]">
            {formatActionLabel(row.action)}
          </span>
          {row.sensitive && (
            <Tooltip content="Sensitive event">
              <IconAlertTriangle size={14} className="shrink-0 text-[var(--color-state-warning)]" />
            </Tooltip>
          )}
        </HStack>
      ),
    },
    {
      key: 'source_service',
      label: 'Service',
      headerRender: () => (
        <LabelWithTip label="Service" tip="The platform service that emitted the event." />
      ),
      width: 110,
      resizable: false,
      render: (_: unknown, row: AuditLog) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{row.source_service}</span>
      ),
    },
    {
      key: 'trn',
      label: 'Target',
      headerRender: () => (
        <LabelWithTip
          label="Target"
          tip="The resource acted on — TRN (target type:id path) or its name."
        />
      ),
      flex: 1,
      minWidth: 180,
      render: (_: unknown, row: AuditLog) => (
        <span className="block truncate text-body-sm font-mono text-[var(--color-text-subtle)]">
          {row.target_name ? `${row.target_name}` : row.trn}
        </span>
      ),
    },
    {
      key: 'tpn',
      label: 'Actor',
      headerRender: () => (
        <LabelWithTip
          label="Actor"
          tip="Who performed the action — TPN (actor type:id path). PII is masked by role."
        />
      ),
      flex: 1,
      minWidth: 150,
      render: (_: unknown, row: AuditLog) => (
        <span className="block truncate text-body-sm text-[var(--color-text-default)]">
          {displayActor(row)}
        </span>
      ),
    },
    {
      key: 'actor_ip',
      label: 'IP',
      headerRender: () => (
        <LabelWithTip label="IP" tip="Source IP address of the actor (masked by role)." />
      ),
      width: 130,
      resizable: false,
      render: (_: unknown, row: AuditLog) => (
        <span className="text-body-sm font-mono text-[var(--color-text-subtle)]">
          {displayIp(row)}
        </span>
      ),
    },
    {
      key: 'compliance_labels',
      label: 'Labels',
      headerRender: () => (
        <LabelWithTip
          label="Labels"
          tip="Compliance labels auto-applied to the event (e.g., SOC2, ISMS-P)."
        />
      ),
      width: 150,
      resizable: false,
      render: (_: unknown, row: AuditLog) =>
        row.compliance_labels.length ? (
          <HStack gap={1} className="flex-wrap">
            {row.compliance_labels.map((l) => (
              <Tag key={l} size="sm" variant="info">
                {l}
              </Tag>
            ))}
          </HStack>
        ) : (
          <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'timestamp',
      label: 'Time',
      headerRender: () => (
        <LabelWithTip label="Time" tip="When the event occurred (cluster time)." />
      ),
      width: 170,
      resizable: false,
      render: (_: unknown, row: AuditLog) => (
        <span className="text-body-sm font-mono text-[var(--color-text-default)]">
          {formatShortTime(row.timestamp)}
        </span>
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'prod-cluster-01', href: '/audit/logs' }, { label: 'Audit Logs' }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader
          title="Audit Logs"
          description="Search and inspect every user and system action across the cluster."
        />

        {/* 이벤트 타임라인 (§2-4-1) — 실제 로그 분포 히스토그램. 막대 클릭·드래그로 시간 구간 선택 시 테이블 필터링 */}
        <LogTimelineChart
          buckets={timelineBuckets}
          stepMs={TIMELINE_STEP_MS}
          successRate={headerStats.successRate}
          failureRate={headerStats.failureRate}
          onRangeSelect={(range) => {
            setSelectedRange(range);
            setPage(1);
          }}
        />

        {/* 시간 범위 + 필터 (§2-3, §2-4) */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <Select
                value={timeRange}
                onChange={setTimeRange}
                width="sm"
                options={TIME_PRESETS.map((p) => ({ value: p, label: p }))}
              />
              <FilterSearchInput
                size="sm"
                filters={[
                  {
                    id: 'tpn',
                    label: 'Actor (TPN)',
                    type: 'text',
                    placeholder: 'e.g. user:taeksoo.kim',
                  },
                  {
                    id: 'trn',
                    label: 'Target (TRN)',
                    type: 'text',
                    placeholder: 'e.g. instance:vm-7781',
                  },
                  {
                    id: 'actor_ip',
                    label: 'Actor IP',
                    type: 'text',
                    placeholder: 'e.g. 10.0.1.42',
                  },
                  {
                    id: 'action_category',
                    label: 'Category',
                    type: 'select',
                    options: (Object.keys(CATEGORY_LABEL) as (keyof typeof CATEGORY_LABEL)[]).map(
                      (k) => ({ value: k, label: CATEGORY_LABEL[k] })
                    ),
                  },
                  { id: 'action', label: 'Action', type: 'select', options: actionOptions },
                  {
                    id: 'status',
                    label: 'Result',
                    type: 'select',
                    options: [
                      { value: 'success', label: 'Success' },
                      { value: 'failure', label: 'Fail' },
                      { value: 'denied', label: 'Denied' },
                    ],
                  },
                  {
                    id: 'source_service',
                    label: 'Service',
                    type: 'select',
                    options: serviceOptions,
                  },
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                placeholder="Search by attributes"
                className="w-[var(--search-input-width)]"
              />
              <ListToolbar.Divider />
              <label className="flex cursor-pointer items-center gap-2 text-body-sm text-[var(--color-text-default)]">
                <Toggle
                  checked={sensitiveOnly}
                  onChange={(e) => {
                    setSensitiveOnly(e.target.checked);
                    setPage(1);
                  }}
                />
                Sensitive only
              </label>
            </ListToolbar.Actions>
          }
        />

        {/* 페이지네이션 — 테이블 상단 좌측 (페이지당 10개 고정) */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filtered.length}
        />

        {/* 결과 테이블 (§2-6) */}
        <Table<AuditLog>
          columns={columns}
          data={paged}
          rowKey="event_id"
          onRowClick={(row) => navigate(`/audit/logs/${row.event_id}`)}
          resizable={false}
          emptyMessage={
            appliedFilters.length || sensitiveOnly || selectedRange
              ? 'No audit events in the selected time range or filters.'
              : 'No audit events to display.'
          }
        />
      </VStack>
    </PageShell>
  );
}
