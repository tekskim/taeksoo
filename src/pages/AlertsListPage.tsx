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
  InfoBox,
  Table,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
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
    startedAt: '2026-06-05 09:12',
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
    startedAt: '2026-06-05 09:05',
    updatedAt: '2026-06-05 09:08',
    updatedBy: 'Kim',
  },
  {
    id: 'ALERT-1003',
    shortId: '1003',
    alertRuleName: 'LogRateSpike Rule',
    severity: 'Warning',
    state: 'Acknowledged',
    target: 'api-gateway',
    startedAt: '2026-06-05 08:55',
    updatedAt: '2026-06-05 09:02',
    updatedBy: 'Park',
  },
  {
    id: 'ALERT-1004',
    shortId: '1004',
    alertRuleName: 'MemoryPressure Rule',
    severity: 'Warning',
    state: 'Firing',
    target: 'worker-02',
    startedAt: '2026-06-05 08:44',
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
    startedAt: '2026-06-05 07:50',
    updatedAt: '2026-06-05 08:30',
    updatedBy: 'Lee',
  },
  {
    id: 'ALERT-1006',
    shortId: '1006',
    alertRuleName: 'PodCrashLoop Rule',
    severity: 'Critical',
    state: 'Firing',
    target: 'auth-service',
    startedAt: '2026-06-05 08:30',
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
    startedAt: '2026-06-04 22:10',
    updatedAt: '2026-06-04 22:15',
    updatedBy: 'Choi',
  },
  {
    id: 'ALERT-1008',
    shortId: '1008',
    alertRuleName: 'MemoryPressure Rule',
    severity: 'Critical',
    state: 'Resolved',
    target: 'compute-worker',
    startedAt: '2026-06-04 18:45',
    updatedAt: '2026-06-04 19:10',
    updatedBy: 'Kim',
  },
];

const PAGE_SIZE = 5;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** 최초 발생 시각으로부터 경과 시간 (정책 1-3: Started At = 시각 + 경과시간) */
function elapsedSince(started: string): string {
  const ts = Date.parse(started.replace(' ', 'T'));
  if (Number.isNaN(ts)) return '';
  const diffMs = Date.now() - ts;
  if (diffMs < 0) return 'just now';
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

// ── Badge helpers ─────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const cls =
    severity === 'Critical'
      ? 'text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]'
      : 'text-[var(--color-state-warning)] bg-[var(--color-state-warning-bg)]';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-body-sm font-medium ${cls}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${severity === 'Critical' ? 'bg-[var(--color-state-danger)]' : 'bg-[var(--color-state-warning)]'}`}
      />
      {severity}
    </span>
  );
}

function StateBadge({ state }: { state: AlertState }) {
  const styles: Record<AlertState, string> = {
    Firing: 'text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]',
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

// ── Main Page ─────────────────────────────────────────────────────────────────

type StateFilter = 'Active' | 'Resolved';

export default function AlertsListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stateFilter, setStateFilter] = useState<StateFilter>('Active');
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
    return alertRows
      .filter((a) => {
        const matchTab =
          stateFilter === 'Active'
            ? a.state === 'Firing' || a.state === 'Acknowledged'
            : a.state === 'Resolved';

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

        return matchTab;
      })
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }, [alertRows, stateFilter, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedAlerts = filteredAlerts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFiltersChange = (next: AppliedFilter[]) => {
    setAppliedFilters(next);
    setPage(1);
    setSelectedKeys([]);
  };

  const handleAcknowledge = () => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
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
    setResolveTarget({ type: 'bulk', ids: selectedKeys });
    setResolveNote('');
  };

  const handleAcknowledgeSingle = (row: AlertRow) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
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
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
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
          resolveTarget.ids.includes(a.id) && a.state !== 'Resolved'
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
      key: 'severity',
      label: 'Severity',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_: any, row: AlertRow) => <SeverityBadge severity={row.severity} />,
    },
    {
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
      key: 'startedAt',
      label: 'Started At',
      flex: 1,
      minWidth: columnMinWidths.timestamp,
      render: (_: any, row: AlertRow) => (
        <VStack gap={0.5}>
          <span className="text-body-sm text-[var(--color-text-default)]">{row.startedAt}</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            {elapsedSince(row.startedAt)}
          </span>
        </VStack>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated At',
      flex: 1,
      minWidth: columnMinWidths.updatedAt,
      render: (_: any, row: AlertRow) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{row.updatedAt ?? '-'}</span>
      ),
    },
    {
      key: 'updatedBy',
      label: 'Updated By',
      flex: 1,
      minWidth: columnMinWidths.owner,
      render: (_: any, row: AlertRow) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">{row.updatedBy ?? '-'}</span>
      ),
    },
    {
      key: '_action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_: any, row: AlertRow) => {
        const items: ContextMenuItem[] = [
          {
            id: 'acknowledge',
            label: 'Acknowledge',
            disabled: row.state !== 'Firing',
            onClick: () => handleAcknowledgeSingle(row),
          },
          {
            id: 'resolve',
            label: 'Resolve',
            disabled: row.state === 'Resolved',
            onClick: () => handleResolveSingle(row),
          },
        ];
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
                { label: 'Alert Status Board' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader title="Alert Status Board" />

        {/* State filter tabs: Active / Resolved */}
        <HStack gap={0} className="border-b border-[var(--color-border-default)] w-full">
          {(['Active', 'Resolved'] as StateFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStateFilter(s);
                setPage(1);
                setSelectedKeys([]);
              }}
              className={`px-4 py-2 text-body-md font-medium border-b-2 transition-colors ${
                stateFilter === s
                  ? 'border-[var(--color-action-primary)] text-[var(--color-action-primary)]'
                  : 'border-transparent text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]'
              }`}
            >
              {s}
            </button>
          ))}
        </HStack>

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
            <ListToolbar.Actions>
              <Button
                variant="secondary"
                size="sm"
                disabled={selectedKeys.length === 0}
                onClick={handleAcknowledge}
              >
                Acknowledge
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={selectedKeys.length === 0}
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
        title={
          resolveTarget?.type === 'bulk'
            ? `Resolve Alerts (${resolveTarget.ids.length})`
            : 'Resolve Alert'
        }
        description={
          resolveTarget?.type === 'single'
            ? `${resolveTarget.row.alertRuleName.replace(/ Rule$/, '')}_${resolveTarget.row.target}`
            : resolveTarget?.type === 'bulk'
              ? `${resolveTarget.ids.length} alert${resolveTarget.ids.length > 1 ? 's' : ''} will be marked as Resolved.`
              : ''
        }
        width={400}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={() => setResolveTarget(null)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmResolve} className="flex-1">
              Resolve
            </Button>
          </HStack>
        }
      >
        <VStack gap={4}>
          {/* 대상 알림 컨텍스트 — TDS InfoBox 패턴 (AdminInstanceMigrateDrawer 참조) */}
          {resolveTarget?.type === 'single' && (
            <InfoBox.Group>
              <InfoBox label="Alert ID" value={resolveTarget.row.id} />
              <InfoBox label="Target" value={resolveTarget.row.target} />
              <InfoBox label="Severity" value={resolveTarget.row.severity} />
            </InfoBox.Group>
          )}
          <FormField
            label="Resolution Note"
            hint="Optional — describe how this alert was resolved."
          >
            <Textarea
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              placeholder="e.g. Restarted the affected pod. CPU usage normalized."
              rows={4}
              resize="vertical"
              fullWidth
            />
          </FormField>
        </VStack>
      </Drawer>
    </PageShell>
  );
}
