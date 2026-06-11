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
  type TableColumn,
  SectionCard,
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
      time: '08:55:12',
      type: 'Firing',
      actor: 'system',
      comment: 'Alert triggered: log rate exceeded 500 req/s threshold for 3 consecutive minutes.',
    },
    { time: '09:00:05', type: 'Acknowledged', actor: 'Park' },
  ],
  deliveryHistory: [
    {
      sentAt: '08:55:14',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Initial',
      status: 'Success',
    },
    {
      sentAt: '08:55:15',
      channel: 'Email',
      target: 'ops@thakicloud.net',
      ruleName: 'Ops Email',
      kind: 'Initial',
      status: 'Failed',
    },
    {
      sentAt: '09:00:15',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Repeat',
      status: 'Success',
    },
    {
      sentAt: '09:05:15',
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
      time: '18:45:00',
      type: 'Firing',
      actor: 'system',
      comment: 'Memory usage exceeded 85% threshold for 3 consecutive minutes on compute-worker.',
    },
    {
      time: '18:47:00',
      type: 'Firing',
      actor: 'system',
      comment: 'Memory usage still above threshold (88%). Escalating repeat notification.',
    },
    { time: '18:50:10', type: 'Acknowledged', actor: 'Kim' },
    {
      time: '19:10:00',
      type: 'Resolved',
      actor: 'Kim',
      comment: 'Scaled out the worker pool and memory pressure normalized.',
    },
  ],
  deliveryHistory: [
    {
      sentAt: '18:45:02',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Initial',
      status: 'Success',
    },
    {
      sentAt: '18:47:02',
      channel: 'Slack',
      target: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      ruleName: 'Ops Slack',
      kind: 'Repeat',
      status: 'Success',
    },
    {
      sentAt: '19:10:05',
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

function StateBadge({ state, pulse = true }: { state: AlertState; pulse?: boolean }) {
  // pulse: 현재 상태 표시(헤더 등)에서만 Firing 깜빡임. 타임라인 같은 과거 이력엔 끈다.
  const styles: Record<AlertState, string> = {
    Firing: `text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]${pulse ? ' animate-pulse' : ''}`,
    Acknowledged: 'text-[var(--color-state-warning)] bg-[var(--color-state-warning-bg)]',
    Resolved: 'text-[var(--color-state-success)] bg-[var(--color-state-success-bg)]',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-body-sm font-medium ${styles[state]}`}
    >
      {state}
    </span>
  );
}

function DeliveryStatusBadge({ status }: { status: DeliveryRecord['status'] }) {
  const styles: Record<DeliveryRecord['status'], string> = {
    Success: 'text-[var(--color-state-success)] bg-[var(--color-state-success-bg)]',
    Failed: 'text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]',
    Pending: 'text-[var(--color-text-subtle)] bg-[var(--color-surface-subtle)]',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-body-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function DeliveryKindBadge({ kind }: { kind: DeliveryKind }) {
  const styles: Record<DeliveryKind, string> = {
    Initial:
      'text-[var(--color-text-subtle)] bg-[var(--color-surface-subtle)] border-[var(--color-border-default)]',
    Retry:
      'text-[var(--color-state-warning)] bg-[var(--color-state-warning-bg)] border-transparent',
    Repeat:
      'text-[var(--color-action-primary)] bg-[var(--color-action-primary-subtle)] border-transparent',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-body-sm font-medium border ${styles[kind]}`}
    >
      {kind}
    </span>
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

  const sidebarWidth = sidebarOpen ? 240 : 40;

  const now = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  const handleAcknowledge = () => {
    const ts = now();
    setAlertDetail((prev) => ({
      ...prev,
      state: 'Acknowledged',
      acknowledgedBy: 'Me',
      acknowledgedAt: ts,
      timeline: [...prev.timeline, { time: ts.slice(11), type: 'Acknowledged', actor: 'Me' }],
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
          time: ts.slice(11),
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
    { label: 'Acknowledged At', value: alertDetail.acknowledgedAt ?? '-' },
    ...(alertDetail.state !== 'Resolved'
      ? [
          { label: 'Resolved By', value: alertDetail.resolvedBy ?? '-' },
          { label: 'Resolved At', value: alertDetail.resolvedAt ?? '-' },
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
      width: '100px',
      resizable: false,
      render: (v: any) => (
        <span className="text-body-sm font-mono text-[var(--color-text-subtle)]">{v}</span>
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
  const deliveryColumns: TableColumn<DeliveryRecord>[] = [
    {
      key: 'sentAt',
      label: 'Sent At',
      width: '100px',
      resizable: false,
      render: (v: any) => (
        <span className="text-body-sm font-mono text-[var(--color-text-subtle)]">{v}</span>
      ),
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
      key: 'ruleName',
      label: 'Rule Name',
      render: (v: any) => <span className="text-body-sm text-[var(--color-text-subtle)]">{v}</span>,
    },
    {
      key: 'kind',
      label: 'Kind',
      width: '90px',
      resizable: false,
      render: (_: any, row: DeliveryRecord) => <DeliveryKindBadge kind={row.kind} />,
    },
    {
      key: 'status',
      label: 'Status',
      width: '90px',
      resizable: false,
      render: (_: any, row: DeliveryRecord) => <DeliveryStatusBadge status={row.status} />,
    },
    {
      key: '_detail',
      label: 'Detail',
      width: '100px',
      resizable: false,
      render: (_: any, row: DeliveryRecord) =>
        row.status === 'Failed' ? (
          <button className="text-body-sm text-[var(--color-action-primary)] hover:underline">
            View Error
          </button>
        ) : (
          <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>
        ),
    },
  ];

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
            <DetailHeader.InfoCard label="Started At" value={alertDetail.startedAt} />
            <DetailHeader.InfoCard label="Last Fired At" value={alertDetail.lastFiredAt} />
            <DetailHeader.InfoCard
              label="Occurrence Count"
              value={String(alertDetail.occurrenceCount)}
            />
            {alertDetail.state === 'Resolved' && (
              <>
                <DetailHeader.InfoCard label="Resolved By" value={alertDetail.resolvedBy ?? '-'} />
                <DetailHeader.InfoCard label="Resolved At" value={alertDetail.resolvedAt ?? '-'} />
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

          {/* Timeline tab — TDS Table 패턴 */}
          <TabPanel value="timeline">
            <Table<TimelineEvent>
              columns={timelineColumns}
              data={alertDetail.timeline}
              rowKey="time"
              resizable={false}
            />
          </TabPanel>

          {/* Delivery History tab — 정책 2-7, Kind 컬럼 (정책 0-8) */}
          <TabPanel value="delivery">
            <Table<DeliveryRecord>
              columns={deliveryColumns}
              data={alertDetail.deliveryHistory}
              rowKey="sentAt"
              resizable={false}
            />
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
