import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  FilterSearchInput,
  type AppliedFilter,
  ListToolbar,
  Pagination,
  Drawer,
  FormField,
  Textarea,
  Table,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  StatusIndicator,
  type StatusType,
} from '@/design-system';
import { AlertSidebar } from '@/components/AlertSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';

// ── Types & Mock Data ─────────────────────────────────────────────────────────

type AlertState = 'Firing' | 'Acknowledged' | 'Resolved';
type AlertSeverity = 'Critical' | 'Warning';

type AlertRow = {
  id: string;
  shortId: string;
  alertRuleName: string;
  severity: AlertSeverity;
  state: AlertState;
  target: string;
  startedAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
};

const MOCK_ALERTS: AlertRow[] = [
  {
    id: 'ALERT-1001',
    shortId: '1001',
    alertRuleName: 'HighCpuUsage Rule',
    severity: 'Critical',
    state: 'Firing',
    target: 'node-03',
    startedAt: '2026-06-05 09:12:00',
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 'ALERT-1002',
    shortId: '1002',
    alertRuleName: 'DiskSpaceLow Rule',
    severity: 'Critical',
    state: 'Acknowledged',
    target: 'ceph-osd-7',
    startedAt: '2026-06-05 09:05:00',
    updatedAt: '2026-06-05 09:08:00',
    updatedBy: 'Kim',
  },
  {
    id: 'ALERT-1003',
    shortId: '1003',
    alertRuleName: 'LogRateSpike Rule',
    severity: 'Warning',
    state: 'Acknowledged',
    target: 'api-gateway',
    startedAt: '2026-06-05 08:55:00',
    updatedAt: '2026-06-05 09:02:00',
    updatedBy: 'Park',
  },
  {
    id: 'ALERT-1004',
    shortId: '1004',
    alertRuleName: 'MemoryPressure Rule',
    severity: 'Warning',
    state: 'Firing',
    target: 'worker-02',
    startedAt: '2026-06-05 08:44:00',
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 'ALERT-1005',
    shortId: '1005',
    alertRuleName: 'CertExpiry Rule',
    severity: 'Warning',
    state: 'Resolved',
    target: 'ingress',
    startedAt: '2026-06-05 07:50:00',
    updatedAt: '2026-06-05 08:30:00',
    updatedBy: 'Lee',
  },
  {
    id: 'ALERT-1006',
    shortId: '1006',
    alertRuleName: 'PodCrashLoop Rule',
    severity: 'Critical',
    state: 'Firing',
    target: 'auth-service',
    startedAt: '2026-06-05 08:30:00',
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 'ALERT-1007',
    shortId: '1007',
    alertRuleName: 'NetworkLatency Rule',
    severity: 'Warning',
    state: 'Acknowledged',
    target: 'storage-ctrl',
    startedAt: '2026-06-04 22:10:00',
    updatedAt: '2026-06-04 22:15:00',
    updatedBy: 'Choi',
  },
  {
    id: 'ALERT-1008',
    shortId: '1008',
    alertRuleName: 'MemoryPressure Rule',
    severity: 'Critical',
    state: 'Resolved',
    target: 'compute-worker',
    startedAt: '2026-06-04 18:45:00',
    updatedAt: '2026-06-04 19:10:00',
    updatedBy: 'Kim',
  },
];

const PAGE_SIZE = 10;
// 정책 2-4: Resolve Comment 필수, 최대 1,000자
const MAX_RESOLVE_COMMENT = 1000;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** TDS UX writing(영문) 날짜+시각 표기 — 테이블이므로 UTC·초 생략: Mth DD, YYYY HH:mm */
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

function fmtDateTime(value: string | null): string {
  if (!value) return '-';
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return value;
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${MONTH_ABBR[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()} ${hh}:${mi}`;
}

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
// status는 색상 계열만 결정(label-only라 아이콘은 노출 안 됨), 라벨은 도메인 값으로 override.
// Firing→Danger(Red) / Acknowledged→Warning(Orange) / Resolved→Success(Green)
const ALERT_STATE_STATUS: Record<AlertState, StatusType> = {
  Firing: 'error',
  Acknowledged: 'degraded',
  Resolved: 'active',
};
function StateBadge({ state }: { state: AlertState }) {
  return (
    <StatusIndicator status={ALERT_STATE_STATUS[state]} label={state} layout="badge" hideIcon />
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AlertsListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [alertRows, setAlertRows] = useState<AlertRow[]>(MOCK_ALERTS);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  type ResolveTarget = { type: 'single'; row: AlertRow } | { type: 'bulk'; ids: string[] };
  const [resolveTarget, setResolveTarget] = useState<ResolveTarget | null>(null);
  const [resolveNote, setResolveNote] = useState('');

  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filteredAlerts = useMemo(() => {
    // 정책 1-2: 탭 구분 없이 한 페이지에서 관리하되 Resolved는 기본 미표시.
    // Filter Search에 조건이 하나라도 추가되면 그때 Resolved도 노출 대상이 된다(필터 결과에 한함).
    const hasFilters = appliedFilters.length > 0;
    return alertRows
      .filter((a) => {
        if (!hasFilters && a.state === 'Resolved') return false;
        for (const f of appliedFilters) {
          if (f.fieldId === 'state' && a.state !== f.value) return false;
          if (f.fieldId === 'severity' && a.severity !== f.value) return false;
          if (
            f.fieldId === 'alertRule' &&
            !a.alertRuleName.toLowerCase().includes(f.value.toLowerCase())
          )
            return false;
          if (f.fieldId === 'target' && !a.target.toLowerCase().includes(f.value.toLowerCase()))
            return false;
        }
        return true;
      })
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }, [alertRows, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedAlerts = filteredAlerts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Resolve 대상 행 목록 (단일/복수 통일). 단일=1행, 복수=Acknowledged 매칭 행.
  const resolveRows: AlertRow[] = !resolveTarget
    ? []
    : resolveTarget.type === 'single'
      ? [resolveTarget.row]
      : alertRows.filter((a) => resolveTarget.ids.includes(a.id));
  const resolveCount = resolveRows.length;

  // ── 선택된 행의 상태 기반 Bulk Action 활성 조건 (정책 1-6) ──────────────────
  // 혼합 선택 시 해당 상태가 아닌 항목은 제외하고 처리한다.
  // 처리 대상이 1건 이상 포함되어 있으면 해당 버튼 활성화.
  const selectedRows = alertRows.filter((a) => selectedKeys.includes(a.id));
  const canBulkAcknowledge = selectedRows.some((a) => a.state === 'Firing');
  const canBulkResolve = selectedRows.some((a) => a.state === 'Acknowledged');

  const handleFiltersChange = (next: AppliedFilter[]) => {
    setAppliedFilters(next);
    setPage(1);
    setSelectedKeys([]);
  };

  const handleAcknowledge = () => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setAlertRows((prev) =>
      prev.map((a) =>
        selectedKeys.includes(a.id) && a.state === 'Firing'
          ? { ...a, state: 'Acknowledged' as AlertState, updatedAt: now, updatedBy: 'You' }
          : a
      )
    );
    setSelectedKeys([]);
  };

  const handleBulkResolve = () => {
    // 정책 1-6: Acknowledged만 처리 대상. Firing/Resolved는 제외
    const resolvableIds = selectedRows.filter((a) => a.state === 'Acknowledged').map((a) => a.id);
    setResolveTarget({ type: 'bulk', ids: resolvableIds });
    setResolveNote('');
  };

  const handleAcknowledgeSingle = (row: AlertRow) => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setAlertRows((prev) =>
      prev.map((a) =>
        a.id === row.id
          ? { ...a, state: 'Acknowledged' as AlertState, updatedAt: now, updatedBy: 'You' }
          : a
      )
    );
  };

  const handleResolveSingle = (row: AlertRow) => {
    setResolveTarget({ type: 'single', row });
    setResolveNote('');
  };

  const confirmResolve = () => {
    if (!resolveTarget) return;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (resolveTarget.type === 'single') {
      setAlertRows((prev) =>
        prev.map((a) =>
          a.id === resolveTarget.row.id
            ? { ...a, state: 'Resolved' as AlertState, updatedAt: now, updatedBy: 'You' }
            : a
        )
      );
    } else {
      setAlertRows((prev) =>
        prev.map((a) =>
          resolveTarget.ids.includes(a.id) && a.state === 'Acknowledged'
            ? { ...a, state: 'Resolved' as AlertState, updatedAt: now, updatedBy: 'You' }
            : a
        )
      );
      setSelectedKeys([]);
    }
    setResolveTarget(null);
    setResolveNote('');
  };

  // ── TDS Table columns ──────────────────────────────────────────────────────
  const columns: TableColumn<AlertRow>[] = [
    {
      key: 'state',
      label: 'State',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_: any, row: AlertRow) => <StateBadge state={row.state} />,
    },
    {
      // TDS 컬럼 순서: Status 다음에 Name(Alert Rule)
      key: 'alertRuleName',
      label: 'Alert Rule',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_: any, row: AlertRow) => (
        <VStack gap={0.5} className="min-w-0">
          <span className="text-body-md font-medium font-mono text-[var(--color-action-primary)] hover:underline truncate">
            {row.alertRuleName.replace(/ Rule$/, '')}_{row.target}
          </span>
          <span className="text-body-sm font-mono text-[var(--color-text-subtle)]">
            ID: {row.shortId}
          </span>
        </VStack>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_: any, row: AlertRow) => <SeverityBadge severity={row.severity} />,
    },
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      minWidth: columnMinWidths.node,
      render: (_: any, row: AlertRow) => (
        <span className="text-body-sm font-mono text-[var(--color-text-subtle)] truncate">
          {row.target}
        </span>
      ),
    },
    {
      // TDS 컬럼 순서: 기타 속성(Updated By)은 Date 컬럼들 앞에 배치
      key: 'updatedBy',
      label: 'Updated By',
      flex: 1,
      minWidth: columnMinWidths.owner,
      render: (_: any, row: AlertRow) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{row.updatedBy ?? '-'}</span>
      ),
    },
    {
      key: 'startedAt',
      label: 'Started At',
      flex: 1,
      minWidth: columnMinWidths.timestamp,
      render: (_: any, row: AlertRow) => (
        <span className="text-body-sm text-[var(--color-text-default)]">
          {fmtDateTime(row.startedAt)}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated At',
      flex: 1,
      minWidth: columnMinWidths.updatedAt,
      render: (_: any, row: AlertRow) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {fmtDateTime(row.updatedAt)}
        </span>
      ),
    },
    {
      key: '_action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_: any, row: AlertRow) => {
        // 상태별로 수행 가능한 액션만 노출. Firing → Acknowledge, Acknowledged → Resolve.
        // Resolved는 수행 가능한 액션이 없어 메뉴 대신 '-' 표기.
        const items: ContextMenuItem[] = [
          ...(row.state === 'Firing'
            ? [
                {
                  id: 'acknowledge',
                  label: 'Acknowledge',
                  onClick: () => handleAcknowledgeSingle(row),
                },
              ]
            : []),
          ...(row.state === 'Acknowledged'
            ? [{ id: 'resolve', label: 'Resolve', onClick: () => handleResolveSingle(row) }]
            : []),
        ];
        if (items.length === 0) {
          return <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>;
        }
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={items} trigger="click" align="right">
              <button
                aria-label="Row actions"
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--color-text-subtle)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
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
                { label: 'Alert Board' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader title="Alert Board" />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                filters={[
                  {
                    id: 'state',
                    label: 'State',
                    type: 'select',
                    options: [
                      { value: 'Firing', label: 'Firing' },
                      { value: 'Acknowledged', label: 'Acknowledged' },
                      { value: 'Resolved', label: 'Resolved' },
                    ],
                  },
                  {
                    id: 'severity',
                    label: 'Severity',
                    type: 'select',
                    options: [
                      { value: 'Critical', label: 'Critical' },
                      { value: 'Warning', label: 'Warning' },
                    ],
                  },
                  {
                    id: 'alertRule',
                    label: 'Alert Rule',
                    type: 'text',
                    placeholder: 'e.g. HighCpuUsage',
                  },
                  {
                    id: 'target',
                    label: 'Target',
                    type: 'text',
                    placeholder: 'e.g. node-03',
                  },
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                placeholder="Search alerts by attributes"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            // 단일 페이지에서 전 상태 관리 — 선택된 행의 상태에 따라 버튼 활성화.
            // (Firing→Acknowledge, Acknowledged→Resolve / Resolved는 선택돼도 액션 없음)
            <ListToolbar.Actions>
              <Button
                variant="secondary"
                size="sm"
                disabled={!canBulkAcknowledge}
                onClick={handleAcknowledge}
              >
                Acknowledge
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!canBulkResolve}
                onClick={handleBulkResolve}
              >
                Resolve
              </Button>
            </ListToolbar.Actions>
          }
        />

        {/* Pagination — table 상단 좌측, totalItems로 n items 표시 (정책 1-2) */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredAlerts.length}
        />

        {/* Table — TDS Table component (정책 1-3 컬럼) */}
        <Table<AlertRow>
          columns={columns}
          data={pagedAlerts}
          rowKey="id"
          onRowClick={(row) => navigate(`/alerts/${row.id}`)}
          selectable
          // 정책 1-4: Resolved는 체크박스 선택 불가 (Bulk/Action도 자연히 불가)
          isRowSelectable={(row) => row.state !== 'Resolved'}
          selectionType="checkbox"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          emptyMessage={
            appliedFilters.length > 0
              ? 'No alerts match the current filter.'
              : 'No alerts to display.'
          }
          resizable={false}
        />
      </VStack>

      {/* Resolve drawer */}
      <Drawer
        isOpen={!!resolveTarget}
        onClose={() => setResolveTarget(null)}
        title={resolveCount > 1 ? 'Resolve Alerts' : 'Resolve Alert'}
        description={
          resolveCount > 1
            ? 'Enter a comment to resolve the alerts. The action will be recorded in the timeline.'
            : 'Enter a comment to resolve the alert. The action will be recorded in the timeline.'
        }
        width={400}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={() => setResolveTarget(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmResolve}
              disabled={!resolveNote.trim()}
              className="flex-1"
            >
              Resolve
            </Button>
          </HStack>
        }
      >
        <VStack gap={4}>
          {/* 대상 Alert 목록 — Rule 이름 + ID만. 단일/복수 통일, 1개일 땐 (n) 미표시 */}
          {resolveCount > 0 && (
            <div>
              <div className="mb-2 text-label-sm text-[var(--color-text-default)]">
                Alerts to resolve{resolveCount > 1 ? ` (${resolveCount})` : ''}
              </div>
              <VStack
                gap={0}
                className="max-h-[168px] overflow-auto rounded-[var(--radius-md)] border border-[var(--color-border-default)]"
              >
                {resolveRows.map((a) => (
                  <div
                    key={a.id}
                    className="truncate border-b border-[var(--color-border-subtle)] px-3 py-2.5 text-body-sm last:border-0"
                  >
                    <span className="font-medium text-[var(--color-text-default)]">
                      {a.alertRuleName}
                    </span>
                    <span className="font-mono text-[var(--color-text-subtle)]">
                      {' '}
                      (ID: {a.shortId})
                    </span>
                  </div>
                ))}
              </VStack>
            </div>
          )}
          {/* 정책 2-4: Comment만 입력. 필수, 최대 1,000자. (AlertDetailPage 드로어와 동일) */}
          <FormField label="Comment" required>
            <Textarea
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value.slice(0, MAX_RESOLVE_COMMENT))}
              placeholder="Enter resolution notes or action taken"
              fullWidth
              rows={5}
            />
            <span className="mt-1 block text-right text-body-sm text-[var(--color-text-subtle)]">
              {resolveNote.length} / {MAX_RESOLVE_COMMENT}
            </span>
          </FormField>
        </VStack>
      </Drawer>
    </PageShell>
  );
}
