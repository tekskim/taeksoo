import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  Drawer,
  FormField,
  Textarea,
  CopyButton,
  DetailHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  Pagination,
  type TableColumn,
  SectionCard,
  StatusIndicator,
  type StatusType,
} from '@/design-system';
import { AlertSidebar } from '@/components/AlertSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconCheck } from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type AlertState = 'Firing' | 'Acknowledged' | 'Resolved';
type AlertSeverity = 'Critical' | 'Warning';

type TimelineEventType = 'Firing' | 'Acknowledged' | 'Resolved';

type TimelineEvent = {
  time: string;
  type: TimelineEventType;
  actor: string;
  comment?: string;
};

type DeliveryKind = 'Initial' | 'Retry' | 'Repeat';

type DeliveryRecord = {
  sentAt: string;
  channel: 'Slack' | 'Email';
  target: string;
  ruleName: string;
  kind: DeliveryKind;
  /** Pending은 백엔드 값이 아닌 UI 전용 표시 상태 (정책 2-7) */
  status: 'Success' | 'Failed' | 'Pending';
};

type AlertDetail = {
  id: string;
  alertName: string;
  alertRule: string;
  severity: AlertSeverity;
  state: AlertState;
  target: string;
  startedAt: string;
  lastFiredAt: string;
  occurrenceCount: number;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  /** Manual / Auto. Resolved 전이면 null → '-' 표시 (정책 0-7, 2-5) */
  resolveType: 'Manual' | 'Auto' | null;
  timeline: TimelineEvent[];
  deliveryHistory: DeliveryRecord[];
};

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FIXTURE: AlertDetail = {
  id: 'ALERT-1003',
  alertName: 'LogRateSpike_api-gw',
  alertRule: 'LogRateSpike Rule',
  severity: 'Warning',
  state: 'Acknowledged',
  target: 'api-gateway',
  startedAt: '2026-06-05 08:55:12',
  lastFiredAt: '2026-06-05 09:01:00',
  occurrenceCount: 3,
  acknowledgedBy: 'Park',
  acknowledgedAt: '2026-06-05 09:00:05',
  resolvedBy: null,
  resolvedAt: null,
  resolveType: null,
  timeline: [
    {
      time: '2026-06-05 08:55:12',
      type: 'Firing',
      actor: 'system',
      comment: 'Alert triggered: log rate exceeded 500 req/s threshold for 3 consecutive minutes.',
    },
    { time: '2026-06-05 09:00:05', type: 'Acknowledged', actor: 'Park' },
  ],
  deliveryHistory: [
    {
      sentAt: '2026-06-05 08:55:14',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Initial',
      status: 'Success',
    },
    {
      sentAt: '2026-06-05 08:55:15',
      channel: 'Email',
      target: 'ops@thakicloud.net',
      ruleName: 'Ops Email',
      kind: 'Initial',
      status: 'Failed',
    },
    {
      sentAt: '2026-06-05 09:00:15',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Repeat',
      status: 'Success',
    },
    {
      sentAt: '2026-06-05 09:05:15',
      channel: 'Email',
      target: 'ops@thakicloud.net',
      ruleName: 'Ops Email',
      kind: 'Retry',
      status: 'Pending',
    },
  ],
};

const FIXTURE_RESOLVED: AlertDetail = {
  id: 'ALERT-1008',
  alertName: 'MemoryPressure_compute-worker',
  alertRule: 'MemoryPressure Rule',
  severity: 'Critical',
  state: 'Resolved',
  target: 'compute-worker',
  startedAt: '2026-06-04 18:45:00',
  lastFiredAt: '2026-06-04 18:47:00',
  occurrenceCount: 2,
  acknowledgedBy: 'Kim',
  acknowledgedAt: '2026-06-04 18:50:10',
  resolvedBy: 'Kim',
  resolvedAt: '2026-06-04 19:10:00',
  resolveType: 'Manual',
  timeline: [
    {
      time: '2026-06-04 18:45:00',
      type: 'Firing',
      actor: 'system',
      comment: 'Memory usage exceeded 85% threshold for 3 consecutive minutes on compute-worker.',
    },
    {
      time: '2026-06-04 18:47:00',
      type: 'Firing',
      actor: 'system',
      comment: 'Memory usage still above threshold (88%). Escalating repeat notification.',
    },
    { time: '2026-06-04 18:50:10', type: 'Acknowledged', actor: 'Kim' },
    {
      time: '2026-06-04 19:10:00',
      type: 'Resolved',
      actor: 'Kim',
      comment: 'Scaled out the worker pool and memory pressure normalized.',
    },
  ],
  deliveryHistory: [
    {
      sentAt: '2026-06-04 18:45:02',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Initial',
      status: 'Success',
    },
    {
      sentAt: '2026-06-04 18:47:02',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Repeat',
      status: 'Success',
    },
    {
      sentAt: '2026-06-04 19:10:05',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Repeat',
      status: 'Success',
    },
  ],
};

const FIXTURES: Record<string, AlertDetail> = {
  'ALERT-1003': FIXTURE,
  'ALERT-1008': FIXTURE_RESOLVED,
};

// ── Badge helpers ─────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const cls =
    severity === 'Critical'
      ? 'text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]'
      : 'text-[var(--color-state-warning)] bg-[var(--color-state-warning-bg)]';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-body-sm font-medium ${cls}`}
    >
      {severity}
    </span>
  );
}

// 정책(Status 정의): TDS StatusIndicator label-only badge + 시맨틱 색상.
// status는 색상 계열만 결정(label-only), 라벨은 도메인 값으로 override.
const ALERT_STATE_STATUS: Record<AlertState, StatusType> = {
  Firing: 'error', // Danger(Red)
  Acknowledged: 'degraded', // Warning(Orange)
  Resolved: 'active', // Success(Green)
};
function StateBadge({ state, pulse = true }: { state: AlertState; pulse?: boolean }) {
  // pulse: 현재 상태 표시(헤더 등)에서만 Firing 깜빡임. 타임라인 같은 과거 이력엔 끈다.
  return (
    <StatusIndicator
      status={ALERT_STATE_STATUS[state]}
      label={state}
      layout="badge"
      hideIcon
      className={pulse && state === 'Firing' ? 'animate-pulse' : ''}
    />
  );
}

// Delivery History 발송 상태: Success→Success(Green) / Failed→Danger(Red) / Pending→Muted(Gray).
// ⚠️ Pending은 정책상 Gray(Muted) — TDS 기본 'pending'(Blue) 대신 muted 계열 status를 쓴다.
const DELIVERY_STATUS_STATUS: Record<DeliveryRecord['status'], StatusType> = {
  Success: 'active',
  Failed: 'error',
  Pending: 'suspended',
};
function DeliveryStatusBadge({ status }: { status: DeliveryRecord['status'] }) {
  return (
    <StatusIndicator
      status={DELIVERY_STATUS_STATUS[status]}
      label={status}
      layout="badge"
      hideIcon
    />
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AlertDetailPage() {
  const { alertId } = useParams<{ alertId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [alertDetail, setAlertDetail] = useState<AlertDetail>(
    () => (alertId ? FIXTURES[alertId] : null) ?? FIXTURE
  );
  const [resolveDrawerOpen, setResolveDrawerOpen] = useState(false);
  const [resolveComment, setResolveComment] = useState('');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  // Timeline / Delivery History 테이블 페이지네이션 (정책: 테이블 상단 고정, AlertsListPage와 동일 패턴)
  const PAGE_SIZE = 10;
  const [timelinePage, setTimelinePage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);

  const sidebarWidth = sidebarOpen ? 240 : 40;

  const now = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  // UX-writing 3-2 시간 표기
  // 상세 화면(정확한 시각) → 표준형 + UTC: YYYY-MM-DD HH:mm:ss (UTC+9)
  // TDS UX writing(영문) 일자 표준형 — 상세/로그 정확 시각: Mth DD, YYYY HH:mm:ss (UTC+9)
  const fmtFull = (v: string | null) => {
    if (!v) return '-';
    const d = new Date(v.replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return `${v} (UTC+9)`;
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
    const p = (n: number) => String(n).padStart(2, '0');
    return `${MONTH_ABBR[d.getMonth()]} ${p(d.getDate())}, ${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} (UTC+9)`;
  };
  // 당일 즉각 화면(타임라인·발송 이력) → 시각: HH:mm

  const handleAcknowledge = () => {
    const ts = now();
    setAlertDetail((prev) => ({
      ...prev,
      state: 'Acknowledged',
      acknowledgedBy: 'Me',
      acknowledgedAt: ts,
      timeline: [...prev.timeline, { time: ts, type: 'Acknowledged', actor: 'Me' }],
    }));
  };

  const handleResolve = () => {
    if (!resolveComment.trim()) return;
    const ts = now();
    setAlertDetail((prev) => ({
      ...prev,
      state: 'Resolved',
      resolvedBy: 'Me',
      resolvedAt: ts,
      resolveType: 'Manual',
      timeline: [
        ...prev.timeline,
        {
          time: ts,
          type: 'Resolved',
          actor: 'Me',
          comment: resolveComment.trim(),
        },
      ],
    }));
    setResolveDrawerOpen(false);
    setResolveComment('');
  };

  const MAX_COMMENT = 1000;

  // DetailHeader InfoGrid에 이미 표시되는 필드(State/Severity/Target/Alert Rule/
  // Started At/Last Fired At/Occurrence Count)는 중복이므로 Overview에서 제외한다.
  // Resolved By/At은 Resolved 상태일 때 헤더로 올라가므로 그때만 제외.
  const overviewFields: { label: string; value: React.ReactNode }[] = [
    {
      label: 'Alert ID',
      value: (
        <HStack gap={1} align="center">
          <span>{alertDetail.id}</span>
          <CopyButton value={alertDetail.id} size="sm" variant="ghost" />
        </HStack>
      ),
    },
    { label: 'Acknowledged By', value: alertDetail.acknowledgedBy ?? '-' },
    { label: 'Acknowledged At', value: fmtFull(alertDetail.acknowledgedAt) },
    ...(alertDetail.state !== 'Resolved'
      ? [
          { label: 'Resolved By', value: alertDetail.resolvedBy ?? '-' },
          { label: 'Resolved At', value: fmtFull(alertDetail.resolvedAt) },
        ]
      : []),
    // 정책 2-5 #15: Manual / Auto. Resolved 전이면 '-'
    { label: 'Resolve Type', value: alertDetail.resolveType ?? '-' },
  ];

  // ── Timeline table columns — TDS Table 패턴 (Delivery History와 동일) ──────
  const timelineColumns: TableColumn<TimelineEvent>[] = [
    {
      key: 'time',
      label: 'Time',
      width: '230px',
      resizable: false,
      render: (v: any) => (
        <span className="text-body-sm font-mono text-[var(--color-text-subtle)]">{fmtFull(v)}</span>
      ),
    },
    {
      key: 'type',
      label: 'Event',
      width: '140px',
      resizable: false,
      render: (_: any, row: TimelineEvent) => <StateBadge state={row.type} pulse={false} />,
    },
    {
      key: 'actor',
      label: 'Actor',
      width: '120px',
      resizable: false,
      render: (v: any) => <span className="text-body-sm text-[var(--color-text-subtle)]">{v}</span>,
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (v: any) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{v ?? '-'}</span>
      ),
    },
  ];

  // ── Delivery History table columns ────────────────────────────────────────
  // 컬럼 순서는 와이어프레임(ALERT-002-DELIVERY) 기준: Status → Rule Name → Channel → Target → Sent At
  const deliveryColumns: TableColumn<DeliveryRecord>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      resizable: false,
      render: (_: any, row: DeliveryRecord) => <DeliveryStatusBadge status={row.status} />,
    },
    {
      key: 'ruleName',
      label: 'Rule Name',
      render: (v: any) => <span className="text-body-sm text-[var(--color-text-subtle)]">{v}</span>,
    },
    {
      key: 'channel',
      label: 'Channel',
      width: '90px',
      resizable: false,
      render: (v: any) => <span className="text-body-sm text-[var(--color-text-subtle)]">{v}</span>,
    },
    {
      key: 'target',
      label: 'Target',
      render: (v: any) => (
        <span className="text-body-sm font-mono text-[var(--color-text-subtle)]">{v}</span>
      ),
    },
    {
      // 시각 표기: TDS 표준형 Mth DD, YYYY HH:mm:ss (UTC+9) — Timeline·헤더 카드와 동일
      key: 'sentAt',
      label: 'Sent At',
      width: '230px',
      resizable: false,
      render: (v: any) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{fmtFull(v)}</span>
      ),
    },
    // Kind / Detail(View Error) 컬럼 제외 (정책 결정)
  ];

  // 페이지네이션 파생값 — 표시 데이터 슬라이스
  const timelineTotalPages = Math.max(1, Math.ceil(alertDetail.timeline.length / PAGE_SIZE));
  const timelineSafePage = Math.min(timelinePage, timelineTotalPages);
  const pagedTimeline = alertDetail.timeline.slice(
    (timelineSafePage - 1) * PAGE_SIZE,
    timelineSafePage * PAGE_SIZE
  );
  const deliveryTotalPages = Math.max(1, Math.ceil(alertDetail.deliveryHistory.length / PAGE_SIZE));
  const deliverySafePage = Math.min(deliveryPage, deliveryTotalPages);
  const pagedDelivery = alertDetail.deliveryHistory.slice(
    (deliverySafePage - 1) * PAGE_SIZE,
    deliverySafePage * PAGE_SIZE
  );

  return (
    <PageShell
      sidebar={<AlertSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
                { label: 'prod-cluster-01', href: '/alerts/board' },
                { label: 'Alert Board', href: '/alerts/board' },
                { label: alertDetail.alertName },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        {/* DetailHeader — TDS pattern (정책 2-3: 상태별 Action 버튼) */}
        <DetailHeader>
          <DetailHeader.Title>{alertDetail.alertName}</DetailHeader.Title>
          {(alertDetail.state === 'Firing' || alertDetail.state === 'Acknowledged') && (
            <DetailHeader.Actions>
              {alertDetail.state === 'Firing' && (
                <Button variant="secondary" size="sm" onClick={handleAcknowledge}>
                  Acknowledge
                </Button>
              )}
              {alertDetail.state === 'Acknowledged' && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCheck size={12} />}
                  onClick={() => setResolveDrawerOpen(true)}
                >
                  Resolve
                </Button>
              )}
            </DetailHeader.Actions>
          )}
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="State" value={<StateBadge state={alertDetail.state} />} />
            <DetailHeader.InfoCard
              label="Severity"
              value={<SeverityBadge severity={alertDetail.severity} />}
            />
            <DetailHeader.InfoCard label="Target" value={alertDetail.target} />
            <DetailHeader.InfoCard label="Alert Rule" value={alertDetail.alertRule} />
            <DetailHeader.InfoCard label="Started At" value={fmtFull(alertDetail.startedAt)} />
            <DetailHeader.InfoCard label="Last Fired At" value={fmtFull(alertDetail.lastFiredAt)} />
            <DetailHeader.InfoCard
              label="Occurrence Count"
              value={String(alertDetail.occurrenceCount)}
            />
            {alertDetail.state === 'Resolved' && (
              <>
                <DetailHeader.InfoCard label="Resolved By" value={alertDetail.resolvedBy ?? '-'} />
                <DetailHeader.InfoCard
                  label="Resolved At"
                  value={fmtFull(alertDetail.resolvedAt)}
                />
              </>
            )}
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs — TDS pattern */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="timeline">Timeline</Tab>
            <Tab value="delivery">Delivery History</Tab>
          </TabList>

          {/* Overview tab — TDS SectionCard (key-value canonical 패턴) */}
          <TabPanel value="overview">
            <SectionCard>
              <SectionCard.Header title="Alert Details" />
              <SectionCard.Content>
                {overviewFields.map(({ label, value }) => (
                  <SectionCard.DataRow key={label} label={label}>
                    {value}
                  </SectionCard.DataRow>
                ))}
              </SectionCard.Content>
            </SectionCard>
          </TabPanel>

          {/* Timeline tab — TDS Table 패턴 + 상단 Pagination */}
          <TabPanel value="timeline">
            <VStack gap={3}>
              <Pagination
                currentPage={timelineSafePage}
                totalPages={timelineTotalPages}
                onPageChange={setTimelinePage}
                totalItems={alertDetail.timeline.length}
              />
              <Table<TimelineEvent>
                columns={timelineColumns}
                data={pagedTimeline}
                rowKey="time"
                resizable={false}
              />
            </VStack>
          </TabPanel>

          {/* Delivery History tab — 정책 2-7, 상단 Pagination */}
          <TabPanel value="delivery">
            <VStack gap={3}>
              <Pagination
                currentPage={deliverySafePage}
                totalPages={deliveryTotalPages}
                onPageChange={setDeliveryPage}
                totalItems={alertDetail.deliveryHistory.length}
              />
              <Table<DeliveryRecord>
                columns={deliveryColumns}
                data={pagedDelivery}
                rowKey="sentAt"
                resizable={false}
              />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      {/* Resolve Drawer */}
      <Drawer
        isOpen={resolveDrawerOpen}
        onClose={() => setResolveDrawerOpen(false)}
        title="Resolve Alert"
        description="Enter a comment to resolve the alert. The action will be recorded in the timeline."
        width={400}
        footer={
          <HStack gap={2} className="w-full">
            <Button
              variant="secondary"
              onClick={() => setResolveDrawerOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleResolve}
              disabled={!resolveComment.trim()}
              className="flex-1"
            >
              Resolve
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>
          {/* 정책 2-4: Comment만 입력. 필수, 최대 1,000자. */}
          <FormField label="Comment" required>
            <Textarea
              placeholder="Enter resolution notes or action taken"
              value={resolveComment}
              onChange={(e) => setResolveComment(e.target.value.slice(0, MAX_COMMENT))}
              fullWidth
              rows={5}
            />
            <span className="mt-1 block text-right text-body-sm text-[var(--color-text-subtle)]">
              {resolveComment.length} / {MAX_COMMENT}
            </span>
          </FormField>
        </VStack>
      </Drawer>
    </PageShell>
  );
}
