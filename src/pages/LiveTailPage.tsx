import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  Chip,
  FilterSearchInput,
  HStack,
  Input,
  PageHeader,
  PageShell,
  TabBar,
  TopBar,
  VStack,
  type AppliedFilter,
  type FilterField,
} from '@/design-system';
import { LogSidebar } from '@/components/LogSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconX, IconPlayerStop, IconPlayerPlay, IconTrash } from '@tabler/icons-react';
import SelectableLogCodeBlock, {
  type SelectableLogCodeBlockLine,
} from '@/components/logs/SelectableLogCodeBlock';

// ─── Types ────────────────────────────────────────────────────────────────────

type LiveTailRow = {
  id: string;
  timestampMs: number;
  time: string;
  appId: string;
  domain: string;
  partition: string;
  level: 'CRITICAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
};

type ConnectionStatus = 'connected' | 'paused' | 'reconnecting';

// ─── Mock data ────────────────────────────────────────────────────────────────

const LIVE_TAIL_ROWS: readonly LiveTailRow[] = [
  {
    id: 'TAIL-1001',
    timestampMs: 0,
    time: '09:40:28',
    appId: 'compute',
    domain: 'compdomain-001',
    partition: 'prod',
    level: 'INFO',
    message: 'stream connected',
  },
  {
    id: 'TAIL-1002',
    timestampMs: 0,
    time: '09:40:30',
    appId: 'compute-admin',
    domain: 'compdomain-001',
    partition: 'monitoring',
    level: 'WARN',
    message: 'retry queue length=14',
  },
  {
    id: 'TAIL-1003',
    timestampMs: 0,
    time: '09:40:32',
    appId: 'openstack',
    domain: 'compdomain-002',
    partition: 'prod',
    level: 'ERROR',
    message: 'alert webhook timeout',
  },
  {
    id: 'TAIL-1004',
    timestampMs: 0,
    time: '09:40:36',
    appId: 'ceph',
    domain: 'compdomain-002',
    partition: 'staging',
    level: 'INFO',
    message: 'recovered stream from cursor=91',
  },
  {
    id: 'TAIL-1005',
    timestampMs: 0,
    time: '09:40:39',
    appId: 'k8s',
    domain: 'system',
    partition: 'prod',
    level: 'DEBUG',
    message: 'job timing checkpoint reached',
  },
  {
    id: 'TAIL-1006',
    timestampMs: 0,
    time: '09:40:42',
    appId: 'api-gw',
    domain: 'system',
    partition: 'staging',
    level: 'CRITICAL',
    message: 'worker crashed due to unrecoverable error',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const BUFFER_SIZE = 1000;
const LOG_VIEWPORT_HEIGHT = 560;
const LOG_ROW_HEIGHT = 16;
const VIRTUAL_OVERSCAN = 8;
const RECONNECTING_DELAY_MS = 900;
const HIGHLIGHT_MAX_LENGTH = 64;
// Live Tail session: 1h max, warn 5 min before expiry (per Grafana Loki policy)
const LIVE_TAIL_SESSION_DURATION_MS = 60 * 60 * 1000;
const LIVE_TAIL_SESSION_WARNING_MS = 5 * 60 * 1000;

// ─── Filter fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
  { id: 'query', label: 'Query', type: 'text', placeholder: 'Search logs by attributes...' },
  {
    id: 'appId',
    label: 'App Identifier',
    type: 'select',
    options: Array.from(new Set(LIVE_TAIL_ROWS.map((r) => r.appId)))
      .sort()
      .map((v) => ({ value: v, label: v })),
  },
  {
    id: 'level',
    label: 'Level',
    type: 'select',
    options: ['CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'].map((v) => ({ value: v, label: v })),
  },
  { id: 'partition', label: 'Partition', type: 'text', placeholder: 'Filter by partition...' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatNowTime = (): string => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const toConnectionStatusLabel = (status: ConnectionStatus): string => {
  if (status === 'connected') return 'Connected';
  if (status === 'reconnecting') return 'Reconnecting';
  return 'Paused';
};

const toConnectionStatusBadgeTheme = (status: ConnectionStatus): 'gre' | 'ylw' | 'gry' => {
  if (status === 'connected') return 'gre';
  if (status === 'reconnecting') return 'ylw';
  return 'gry';
};

const getLevelTextClassName = (level: LiveTailRow['level']): string => {
  if (level === 'CRITICAL') return 'text-[var(--color-state-danger-text)] font-bold';
  if (level === 'ERROR') return 'text-[var(--color-state-danger-text)]';
  if (level === 'WARN') return 'text-[var(--color-state-warning-text)]';
  if (level === 'DEBUG') return 'text-[var(--color-text-subtle)]';
  return 'text-[var(--color-state-info)]';
};

const DETAIL_LINE_SEPARATOR = '__detail__';
const buildDetailLineId = (rowId: string, key: string): string =>
  `${rowId}${DETAIL_LINE_SEPARATOR}${key}`;
const getBaseRowIdFromLineId = (lineId: string): string => {
  const idx = lineId.indexOf(DETAIL_LINE_SEPARATOR);
  return idx < 0 ? lineId : lineId.slice(0, idx);
};
const isDetailLineId = (lineId: string): boolean => lineId.includes(DETAIL_LINE_SEPARATOR);

// ─── Main Component ───────────────────────────────────────────────────────────

const LiveTailPage = (): ReactElement => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [streamRows, setStreamRows] = useState<LiveTailRow[]>([]);
  const [highlightKeyword, setHighlightKeyword] = useState<string>('');
  const [pendingLogsWhilePaused, setPendingLogsWhilePaused] = useState<number>(0);
  const [sessionStartedAt, setSessionStartedAt] = useState<number>(() => Date.now());
  const [sessionRemainingMs, setSessionRemainingMs] = useState<number>(
    LIVE_TAIL_SESSION_DURATION_MS
  );
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [logScrollTop, setLogScrollTop] = useState<number>(0);
  const [selectedCodeLineId, setSelectedCodeLineId] = useState<string | null>(null);

  const streamCursorRef = useRef<number>(0);
  const logViewportRef = useRef<HTMLDivElement | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

  // Group applied filter values by field so multi-select (e.g. Level) is honored.
  const filtersByField = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    for (const f of appliedFilters) {
      (grouped[f.fieldId] ??= []).push(f.value);
    }
    return grouped;
  }, [appliedFilters]);

  const filterMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filtersByField).map(([fieldId, values]) => [fieldId, values[0]])
      ),
    [filtersByField]
  );

  // ─── Seed rows on mount ─────────────────────────────────────────────────────

  useEffect(() => {
    const seedRows = LIVE_TAIL_ROWS.slice(0, 2).map((row, index) => ({
      ...row,
      id: `TAIL-SEED-${index + 1}`,
      timestampMs: Date.now(),
      time: formatNowTime(),
    }));
    setStreamRows(seedRows);
    streamCursorRef.current = 2;
  }, []);

  useEffect(() => {
    return () => {
      if (reconnectTimerRef.current !== null) window.clearTimeout(reconnectTimerRef.current);
    };
  }, []);

  // ─── Streaming interval ─────────────────────────────────────────────────────

  useEffect(() => {
    const timer = window.setInterval(() => {
      const template = LIVE_TAIL_ROWS[streamCursorRef.current % LIVE_TAIL_ROWS.length];
      const nextRow: LiveTailRow = {
        ...template,
        id: `TAIL-STREAM-${Date.now()}`,
        timestampMs: Date.now(),
        time: formatNowTime(),
      };
      if (isStreaming) {
        setStreamRows((prevRows) => [...prevRows, nextRow].slice(-BUFFER_SIZE));
      } else {
        setPendingLogsWhilePaused((prev) => prev + 1);
      }
      streamCursorRef.current += 1;
    }, 1500);
    return () => window.clearInterval(timer);
  }, [isStreaming]);

  // ─── Session timer (1h limit) ───────────────────────────────────────────────

  useEffect(() => {
    if (isSessionExpired) return;
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - sessionStartedAt;
      const remaining = Math.max(0, LIVE_TAIL_SESSION_DURATION_MS - elapsed);
      setSessionRemainingMs(remaining);
      if (remaining <= 0) {
        setIsSessionExpired(true);
        setIsStreaming(false);
        setConnectionStatus('paused');
        setPendingLogsWhilePaused(0);
        window.clearInterval(timer);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isSessionExpired, sessionStartedAt]);

  // ─── Pause / Resume ─────────────────────────────────────────────────────────

  const handlePause = (): void => {
    if (!isStreaming) return;
    setIsStreaming(false);
    setConnectionStatus('paused');
    setPendingLogsWhilePaused(0);
  };

  const handleResume = (): void => {
    if (reconnectTimerRef.current !== null) return;
    if (isSessionExpired) {
      setSessionStartedAt(Date.now());
      setSessionRemainingMs(LIVE_TAIL_SESSION_DURATION_MS);
      setIsSessionExpired(false);
    }
    setConnectionStatus('reconnecting');
    reconnectTimerRef.current = window.setTimeout(() => {
      setIsStreaming(true);
      setConnectionStatus('connected');
      setPendingLogsWhilePaused(0);
      reconnectTimerRef.current = null;
    }, RECONNECTING_DELAY_MS);
  };

  const handleClearHighlight = useCallback((): void => {
    setHighlightKeyword('');
  }, []);

  const handleFiltersChange = useCallback((next: AppliedFilter[]) => {
    const seen = new Set<string>();
    setAppliedFilters(
      next.filter((f) => {
        const key = `${f.fieldId}:${f.value}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
    );
  }, []);

  // ─── Filters ────────────────────────────────────────────────────────────────

  const filteredRows = useMemo(() => {
    const queryFilter = (filtersByField.query?.[0] ?? '').toLowerCase();
    const appIdFilters = filtersByField.appId ?? [];
    const levelFilters = filtersByField.level ?? [];
    const partitionFilters = filtersByField.partition ?? [];

    return streamRows.filter((row) => {
      const byAppId = appIdFilters.length === 0 || appIdFilters.includes(row.appId);
      const byLevel = levelFilters.length === 0 || levelFilters.includes(row.level);
      const byPartition =
        partitionFilters.length === 0 ||
        partitionFilters.some((p) => row.partition.toLowerCase() === p.toLowerCase());
      const byQuery =
        !queryFilter ||
        row.message.toLowerCase().includes(queryFilter) ||
        row.appId.toLowerCase().includes(queryFilter) ||
        row.domain.toLowerCase().includes(queryFilter) ||
        row.partition.toLowerCase().includes(queryFilter);
      return byAppId && byLevel && byPartition && byQuery;
    });
  }, [streamRows, filtersByField]);

  const rowMap = useMemo(() => new Map(filteredRows.map((row) => [row.id, row])), [filteredRows]);

  // ─── Code block lines ────────────────────────────────────────────────────────

  const logLines = useMemo<SelectableLogCodeBlockLine[]>(
    () =>
      filteredRows.flatMap((row) => {
        const baseLine: SelectableLogCodeBlockLine = {
          id: row.id,
          text: `[${row.time}] [${row.level}] ${row.appId} | ${row.domain} | ${row.partition} > ${row.message}`,
        };
        if (selectedCodeLineId !== row.id) return [baseLine];
        return [
          baseLine,
          { id: buildDetailLineId(row.id, 'time'), text: `  ├ time      : ${row.time}` },
          { id: buildDetailLineId(row.id, 'level'), text: `  ├ level     : ${row.level}` },
          { id: buildDetailLineId(row.id, 'appId'), text: `  ├ App Identifier : ${row.appId}` },
          { id: buildDetailLineId(row.id, 'domain'), text: `  ├ domain    : ${row.domain}` },
          { id: buildDetailLineId(row.id, 'partition'), text: `  ├ partition : ${row.partition}` },
          { id: buildDetailLineId(row.id, 'message'), text: `  └ message   : ${row.message}` },
        ];
      }),
    [filteredRows, selectedCodeLineId]
  );

  const renderLogLineContent = useCallback(
    (line: SelectableLogCodeBlockLine, helpers: { highlightText: (text: string) => ReactNode }) => {
      if (isDetailLineId(line.id)) {
        return <span className="text-[#94a3b8]">{line.text}</span>;
      }
      const row = rowMap.get(line.id);
      if (!row) return helpers.highlightText(line.text);
      return (
        <>
          {helpers.highlightText(`[${row.time}] `)}
          <span className={getLevelTextClassName(row.level)}>{row.level}</span>
          {helpers.highlightText(
            ` ${row.appId} | ${row.domain} | ${row.partition} > ${row.message}`
          )}
        </>
      );
    },
    [rowMap]
  );

  // ─── Auto-scroll when streaming ──────────────────────────────────────────────

  useEffect(() => {
    const viewport = logViewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [filteredRows]);

  useEffect(() => {
    if (!selectedCodeLineId) return;
    if (!rowMap.has(selectedCodeLineId)) setSelectedCodeLineId(null);
  }, [rowMap, selectedCodeLineId]);

  // ─── Session state ────────────────────────────────────────────────────────────

  const sessionWarningActive =
    !isSessionExpired &&
    sessionRemainingMs > 0 &&
    sessionRemainingMs <= LIVE_TAIL_SESSION_WARNING_MS;
  const sessionRemainingMinutes = Math.max(1, Math.ceil(sessionRemainingMs / (60 * 1000)));
  const isHighlightAtMaxLength = highlightKeyword.length >= HIGHLIGHT_MAX_LENGTH;

  const handleClearFilters = (): void => {
    setAppliedFilters([]);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <PageShell
      sidebar={<LogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={[{ label: 'Logs' }, { label: 'Live Tail' }]} />}
        />
      }
    >
      <div className="flex w-full flex-col items-start gap-4 pb-6">
        {/* Header */}
        <div className="flex flex-col gap-4 w-full pt-6">
          <PageHeader title="Live Tail" />
        </div>

        {/* Action bar */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 py-3">
            <div className="flex w-full flex-wrap items-center gap-2">
              <div className="min-w-[220px] shrink-0 flex-1">
                <FilterSearchInput
                  filters={FILTER_FIELDS}
                  appliedFilters={appliedFilters}
                  onFiltersChange={handleFiltersChange}
                  placeholder="Search logs by attributes"
                  size="sm"
                  fullWidth
                  hideAppliedFilters
                />
              </div>
              <div className="w-[300px] min-w-[200px] shrink-0">
                <Input
                  value={highlightKeyword}
                  onChange={(event) =>
                    setHighlightKeyword(event.target.value.slice(0, HIGHLIGHT_MAX_LENGTH))
                  }
                  placeholder="Highlight keyword"
                  size="sm"
                  maxLength={HIGHLIGHT_MAX_LENGTH}
                  fullWidth
                  rightElement={
                    highlightKeyword.length > 0 ? (
                      <button
                        type="button"
                        onClick={handleClearHighlight}
                        className="pointer-events-auto flex h-4 w-4 items-center justify-center text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
                      >
                        <IconX size={14} stroke={1.5} />
                      </button>
                    ) : undefined
                  }
                />
                {isHighlightAtMaxLength && (
                  <p className="mt-1 text-body-sm text-[var(--color-text-subtle)]">
                    Highlight keyword can be up to {HIGHLIGHT_MAX_LENGTH} characters.
                  </p>
                )}
              </div>
            </div>

            {/* Applied filter chips — full width */}
            {appliedFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {appliedFilters.map((f) => (
                  <Chip
                    key={f.id}
                    label={f.fieldLabel}
                    value={f.valueLabel ?? f.value}
                    onRemove={() => setAppliedFilters((prev) => prev.filter((x) => x.id !== f.id))}
                  />
                ))}
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-auto text-label-sm text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="flex w-full items-center gap-2 flex-wrap">
              <Button variant="secondary" size="sm" onClick={handlePause} disabled={!isStreaming}>
                <IconPlayerStop size={14} stroke={1.5} />
                Pause
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResume}
                disabled={connectionStatus === 'reconnecting' || isStreaming}
              >
                <IconPlayerPlay size={14} stroke={1.5} />
                Resume
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setStreamRows([])}>
                <IconTrash size={14} stroke={1.5} />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Log viewport */}
        <div className="flex flex-col gap-4 w-full">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-3">
            <VStack gap={2} className="mb-3">
              <HStack justify="start" align="center" className="flex-wrap gap-3">
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  Buffer: {BUFFER_SIZE.toLocaleString()} lines
                </span>
                {!isStreaming && pendingLogsWhilePaused > 0 && (
                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                    {pendingLogsWhilePaused} new while paused
                  </span>
                )}
                <Badge theme={toConnectionStatusBadgeTheme(connectionStatus)} size="sm">
                  {toConnectionStatusLabel(connectionStatus)}
                </Badge>
              </HStack>

              {(connectionStatus !== 'connected' || sessionWarningActive || isSessionExpired) && (
                <HStack justify="end" align="center" className="flex-wrap gap-2">
                  {isSessionExpired ? (
                    <span className="text-body-sm text-[var(--color-state-warning)]">
                      Live Tail session ended (1h limit). Click Resume to start a new session.
                    </span>
                  ) : sessionWarningActive ? (
                    <span className="text-body-sm text-[var(--color-state-warning)]">
                      Live Tail will end in about {sessionRemainingMinutes} min. Resume to extend
                      after expiry.
                    </span>
                  ) : null}
                  {!isSessionExpired && connectionStatus === 'reconnecting' && (
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      Reconnecting to log stream...
                    </span>
                  )}
                  {!isSessionExpired && connectionStatus === 'paused' && (
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      Stream paused. Click Resume to receive new logs.
                    </span>
                  )}
                </HStack>
              )}
            </VStack>

            <div className="mt-2 overflow-hidden rounded-md border border-[#334155] bg-[#0b1220] shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
              <div
                ref={logViewportRef}
                className="h-[560px] w-full overflow-y-auto bg-[#020617]"
                onScroll={(event) => setLogScrollTop(event.currentTarget.scrollTop)}
              >
                <SelectableLogCodeBlock
                  lines={logLines}
                  selectedId={selectedCodeLineId}
                  highlightQuery={highlightKeyword}
                  renderLineContent={renderLogLineContent}
                  virtualization={{
                    enabled: true,
                    rowHeight: LOG_ROW_HEIGHT,
                    overscan: VIRTUAL_OVERSCAN,
                    viewportHeight: LOG_VIEWPORT_HEIGHT,
                    scrollTop: logScrollTop,
                  }}
                  onSelect={(line) => {
                    const baseRowId = getBaseRowIdFromLineId(line.id);
                    const row = rowMap.get(baseRowId);
                    if (!row || isDetailLineId(line.id)) return;
                    setSelectedCodeLineId((prev) => (prev === baseRowId ? null : baseRowId));
                  }}
                  lineClassName="text-[11px] leading-[16px]"
                  emptyTextClassName="text-[11px] leading-[16px]"
                  emptyText="-"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default LiveTailPage;
