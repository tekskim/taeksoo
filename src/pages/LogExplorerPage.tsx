import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import {
  Badge,
  Breadcrumb,
  Button,
  Chip,
  Drawer,
  EmptyState,
  FilterSearchInput,
  FormField,
  HStack,
  MonitoringToolbar,
  PageHeader,
  PageShell,
  Select,
  TabBar,
  TopBar,
  VStack,
  type AppliedFilter,
  type FilterField,
  type TimeRangeValue,
} from '@/design-system';
import { LogSidebar } from '@/components/LogSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useDarkMode } from '@/hooks/useDarkMode';
import { createSavedQuery, getSavedQueries, type SavedQuery } from '@/services/savedQueriesStore';
import ApplyQueryDrawer from '@/components/logs/ApplyQueryDrawer';
import SaveQueryDrawer from '@/components/logs/SaveQueryDrawer';
import SelectableLogCodeBlock, {
  type SelectableLogCodeBlockLine,
} from '@/components/logs/SelectableLogCodeBlock';

// ─── Types ───────────────────────────────────────────────────────────────────

type LogRow = {
  id: string;
  time: string;
  appId: string;
  domain: string;
  level: 'CRITICAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  partition: string;
  message: string | null;
};

type LogHistogramBucket = {
  isoTime: string;
  timeLabel: string;
  count: number;
};

type RangeSelection = {
  startIndex: number;
  endIndex: number;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_APP_IDS = ['compute', 'compute-admin', 'openstack', 'ceph', 'k8s', 'api-gw'] as const;
const MOCK_DOMAINS = ['compdomain-001', 'compdomain-002', 'system'] as const;
const MOCK_LEVELS: LogRow['level'][] = ['INFO', 'WARN', 'ERROR', 'DEBUG', 'INFO', 'CRITICAL'];
const MOCK_PARTITIONS = ['prod', 'staging', 'monitoring', 'default'] as const;
const MOCK_MESSAGES = [
  'stream connected',
  'retry queue length=14',
  'alert webhook timeout',
  'recovered stream from cursor=91',
  'queue depth recalculated',
  'request forwarded to worker',
  'batch retry flush completed',
  'fallback route=board-only selected',
  'target channel #pager-alerts acknowledged',
  'alert dedupe window expanded to 2m',
  'retry target #oncall-critical latency increased',
  null,
  'health check passed for node-04',
  'rate limiter reset for tenant-abc',
  'connection pool resized to 32',
];

const formatMockTimestamp = (date: Date): string => {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

const generateMockLogRows = (): readonly LogRow[] => {
  const now = Date.now();
  const oneHourMs = 60 * 60 * 1000;
  const rows: LogRow[] = [];
  const count = 48;
  for (let i = 0; i < count; i += 1) {
    const offset = Math.round((i / (count - 1)) * oneHourMs);
    const ts = new Date(now - oneHourMs + offset);
    rows.push({
      id: `LOG-${1001 + i}`,
      time: formatMockTimestamp(ts),
      appId: MOCK_APP_IDS[i % MOCK_APP_IDS.length],
      domain: MOCK_DOMAINS[i % MOCK_DOMAINS.length],
      level: MOCK_LEVELS[i % MOCK_LEVELS.length],
      partition: MOCK_PARTITIONS[i % MOCK_PARTITIONS.length],
      message: MOCK_MESSAGES[i % MOCK_MESSAGES.length],
    });
  }
  return rows.sort((a, b) => b.time.localeCompare(a.time));
};

const MOCK_LOG_ROWS: readonly LogRow[] = generateMockLogRows();

const generateMockHistogramBins = (): LogHistogramBucket[] => {
  const now = Date.now();
  const oneHourMs = 60 * 60 * 1000;
  const binCount = 24;
  const binMs = oneHourMs / binCount;
  const bins: LogHistogramBucket[] = [];
  for (let i = 0; i < binCount; i++) {
    const ts = new Date(now - oneHourMs + i * binMs);
    const hh = String(ts.getHours()).padStart(2, '0');
    const min = String(ts.getMinutes()).padStart(2, '0');
    bins.push({
      isoTime: ts.toISOString(),
      timeLabel: `${hh}:${min}`,
      count: Math.floor(Math.random() * 30) + 1,
    });
  }
  return bins;
};

const MOCK_HISTOGRAM_BINS: LogHistogramBucket[] = generateMockHistogramBins();

// Custom Period(드래그/커스텀 기간) 재버킷팅 — 선택 기간 "길이"에 따라 구간 크기(step)를
// 매핑한다. 정책서 "Period(커스텀 기간) 선택 시 구간 크기 결정 규칙"과 동일.
const CUSTOM_PERIOD_STEP_RULES: ReadonlyArray<readonly [number, number]> = [
  [15 * 60_000, 30_000], // ≤ 15분 → 30초
  [60 * 60_000, 2 * 60_000], // ≤ 1시간 → 2분
  [6 * 60 * 60_000, 10 * 60_000], // ≤ 6시간 → 10분
  [24 * 60 * 60_000, 60 * 60_000], // ≤ 24시간 → 60분
];
const FALLBACK_STEP_MS = 6 * 60 * 60_000; // > 24시간 → 6시간
const MAX_HISTOGRAM_BARS = 60;

const resolveStepMsForWindow = (durationMs: number): number => {
  const matched = CUSTOM_PERIOD_STEP_RULES.find(([maxDuration]) => durationMs <= maxDuration);
  return matched ? matched[1] : FALLBACK_STEP_MS;
};

const formatBucketLabel = (date: Date, stepMs: number): string => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  if (stepMs < 60_000) {
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  if (stepMs >= 24 * 60 * 60_000) {
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${mo}/${dd}`;
  }
  return `${hh}:${mm}`;
};

// 선택한 기간 [start, end)을 step 단위로 재버킷팅한다(경계 정렬, 최대 60개).
const generateHistogramBinsForWindow = (
  startMs: number,
  endMs: number,
  stepMs: number
): LogHistogramBucket[] => {
  const bins: LogHistogramBucket[] = [];
  const alignedStart = Math.floor(startMs / stepMs) * stepMs;
  for (let t = alignedStart; t < endMs && bins.length < MAX_HISTOGRAM_BARS; t += stepMs) {
    const date = new Date(t);
    bins.push({
      isoTime: date.toISOString(),
      timeLabel: formatBucketLabel(date, stepMs),
      count: Math.floor(Math.random() * 30) + 1,
    });
  }
  return bins;
};

const parseRowTimeMs = (time: string): number => new Date(time.replace(' ', 'T')).getTime();

// ─── Constants ────────────────────────────────────────────────────────────────

// 무한 스크롤 1회 로드 단위. 뷰포트(520px / 16px ≈ 32행)를 넘겨야 스크롤이 생겨
// 하단 근접 로드가 동작하므로 페이지 크기를 뷰포트보다 크게 둔다.
const LOG_PAGE_SIZE = 40;
const LOG_VIEWPORT_HEIGHT = 520;
const LOG_ROW_HEIGHT = 16;
const VIRTUAL_OVERSCAN = 8;
const HISTOGRAM_BAR_WIDTH_RATIO = 0.92;

const RETENTION_PRESET_OPTIONS = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '30 Days', value: 30 },
  { label: '60 Days', value: 60 },
  { label: '90 Days', value: 90 },
  { label: '365 Days', value: 365 },
] as const;
const DEFAULT_RETENTION_DAYS = 30;
const RETENTION_DAYS_STORAGE_KEY = 'thaki.logs.retention-days';

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
  { id: 'query', label: 'Query', type: 'text', placeholder: 'Search by message, app, domain...' },
  {
    id: 'appId',
    label: 'App',
    type: 'text',
    placeholder: 'Search by app identifier...',
  },
  {
    id: 'level',
    label: 'Level',
    type: 'select',
    options: Array.from(new Set(MOCK_LOG_ROWS.map((r) => r.level)))
      .sort()
      .map((v) => ({ value: v, label: v })),
  },
  { id: 'partition', label: 'Partition', type: 'text', placeholder: 'Filter by partition...' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const clampRange = (
  candidate: RangeSelection,
  histogramBins: readonly LogHistogramBucket[]
): RangeSelection => {
  if (histogramBins.length === 0) return { startIndex: 0, endIndex: 0 };
  const maxIndex = histogramBins.length - 1;
  const startIndex = Math.min(maxIndex, Math.max(0, candidate.startIndex));
  const endIndex = Math.min(maxIndex, Math.max(0, candidate.endIndex));
  return startIndex <= endIndex
    ? { startIndex, endIndex }
    : { startIndex: endIndex, endIndex: startIndex };
};

const computeOverlappedIndices = (
  minCoord: number,
  maxCoord: number,
  histogramBins: readonly LogHistogramBucket[]
): number[] => {
  const halfBand = HISTOGRAM_BAR_WIDTH_RATIO / 2;
  return histogramBins
    .map((_, index) => index)
    .filter((index) => index + halfBand >= minCoord && index - halfBand <= maxCoord);
};

const parseChartClickIndex = (event: unknown): number | null => {
  if (!event || typeof event !== 'object') return null;
  const e = event as { dataIndex?: unknown };
  return typeof e.dataIndex === 'number' ? e.dataIndex : null;
};

const toDisplay = (value: string | null | undefined): string =>
  value && value.trim().length > 0 ? value : '-';

const getLevelTextClassName = (level: LogRow['level']): string => {
  if (level === 'CRITICAL') return 'text-[var(--color-state-danger-text)] font-bold';
  if (level === 'ERROR') return 'text-[var(--color-state-danger-text)]';
  if (level === 'WARN') return 'text-[var(--color-state-warning-text)]';
  if (level === 'DEBUG') return 'text-[var(--color-text-subtle)]';
  return 'text-[var(--color-state-info)]';
};

const formatIsoToDateTime = (isoTime: string): string => {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return isoTime;
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
};

const readRetentionDays = (): number => {
  if (typeof window === 'undefined') return DEFAULT_RETENTION_DAYS;
  const raw = window.localStorage.getItem(RETENTION_DAYS_STORAGE_KEY);
  if (!raw) return DEFAULT_RETENTION_DAYS;
  const parsed = Number(raw);
  const valid = RETENTION_PRESET_OPTIONS.find((o) => o.value === parsed);
  return valid ? parsed : DEFAULT_RETENTION_DAYS;
};

const DETAIL_LINE_SEPARATOR = '__detail__';
const buildDetailLineId = (rowId: string, key: string): string =>
  `${rowId}${DETAIL_LINE_SEPARATOR}${key}`;
const getBaseRowIdFromLineId = (lineId: string): string => {
  const idx = lineId.indexOf(DETAIL_LINE_SEPARATOR);
  return idx < 0 ? lineId : lineId.slice(0, idx);
};
const isDetailLineId = (lineId: string): boolean => lineId.includes(DETAIL_LINE_SEPARATOR);

const chartTooltipHtml = (
  title: string,
  items: { label: string; value: string; color: string }[]
): string => {
  const rows = items
    .map(
      (item) =>
        `<div style="display:flex;gap:8px;align-items:center;">
          <span style="width:8px;height:8px;border-radius:50%;background:${item.color};flex-shrink:0;"></span>
          <span style="color:#94a3b8">${item.label}:</span>
          <span style="color:#e2e8f0;font-weight:600;">${item.value}</span>
        </div>`
    )
    .join('');
  return `<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:12px;line-height:1.6;">
    <div style="color:#94a3b8;margin-bottom:6px;font-size:11px;">${title}</div>
    ${rows}
  </div>`;
};

// ─── Retention Setting Drawer ─────────────────────────────────────────────────

type RetentionSettingDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  value: number;
  onSave: (days: number) => void;
};

const RetentionSettingDrawer = ({
  isOpen,
  onClose,
  value,
  onSave,
}: RetentionSettingDrawerProps): ReactElement => {
  const [selectedDays, setSelectedDays] = useState<number>(value);

  useEffect(() => {
    if (isOpen) setSelectedDays(value);
  }, [isOpen, value]);

  const handleSave = (): void => {
    onSave(selectedDays);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Retention Setting"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Update
          </Button>
        </HStack>
      }
    >
      <VStack gap={4}>
        <FormField label="Duration" required>
          <Select
            value={String(selectedDays)}
            onChange={(v) => setSelectedDays(Number(v))}
            options={RETENTION_PRESET_OPTIONS.map((opt) => ({
              value: String(opt.value),
              label: opt.label,
            }))}
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const LogExplorerPage = (): ReactElement => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('30m');
  const [retentionDays, setRetentionDays] = useState<number>(() => readRetentionDays());
  const [customPeriod, setCustomPeriod] = useState<{ start: Date; end: Date } | null>(null);
  const [resultCursor, setResultCursor] = useState<string | null>(null);
  const [selectedCodeLineId, setSelectedCodeLineId] = useState<string | null>(null);
  const [logScrollTop, setLogScrollTop] = useState<number>(0);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [dragBox, setDragBox] = useState<{ left: number; width: number } | null>(null);

  // Drawer states
  const [isSaveQueryOpen, setIsSaveQueryOpen] = useState(false);
  const [isApplyQueryOpen, setIsApplyQueryOpen] = useState(false);
  const [isRetentionOpen, setIsRetentionOpen] = useState(false);
  const [saveQueryError, setSaveQueryError] = useState<string | null>(null);

  const histogramChartRef = useRef<HTMLDivElement | null>(null);
  const histogramContainerRef = useRef<HTMLDivElement | null>(null);
  const histogramInstanceRef = useRef<echarts.EChartsType | null>(null);
  const suppressNextHistogramClickRef = useRef<boolean>(false);

  // Derived filter values. A field can have multiple applied values (e.g. Level
  // multi-select), so group them by fieldId. `filterMap` keeps the first value
  // for single-value consumers (free-text query, Save Query prefill).
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

  // Custom Period가 적용되면(드래그/커스텀 기간) 선택 기간 길이에 맞춰 재버킷팅한다.
  const histogramBins = useMemo<LogHistogramBucket[]>(() => {
    if (!customPeriod) return MOCK_HISTOGRAM_BINS;
    const startMs = customPeriod.start.getTime();
    const endMs = customPeriod.end.getTime();
    if (!(endMs > startMs)) return MOCK_HISTOGRAM_BINS;
    return generateHistogramBinsForWindow(startMs, endMs, resolveStepMsForWindow(endMs - startMs));
  }, [customPeriod]);

  const filteredRows = useMemo(() => {
    const queryFilter = (filtersByField.query?.[0] ?? '').toLowerCase();
    const appIdFilters = filtersByField.appId ?? [];
    const levelFilters = filtersByField.level ?? [];
    const partitionFilters = filtersByField.partition ?? [];

    return MOCK_LOG_ROWS.filter((row) => {
      const byAppId = appIdFilters.length === 0 || appIdFilters.includes(row.appId);
      const byLevel = levelFilters.length === 0 || levelFilters.includes(row.level);
      const byPartition =
        partitionFilters.length === 0 ||
        partitionFilters.some((p) => row.partition.toLowerCase() === p.toLowerCase());
      const byQuery =
        !queryFilter ||
        row.message?.toLowerCase().includes(queryFilter) ||
        row.appId.toLowerCase().includes(queryFilter) ||
        row.domain.toLowerCase().includes(queryFilter) ||
        row.partition.toLowerCase().includes(queryFilter);
      return byAppId && byLevel && byPartition && byQuery;
    });
  }, [filtersByField]);

  const visibleHistogramBins = useMemo(
    () => (filteredRows.length === 0 ? [] : histogramBins),
    [filteredRows.length, histogramBins]
  );

  const histogramTotalCount = useMemo(
    () => visibleHistogramBins.reduce((sum, b) => sum + b.count, 0),
    [visibleHistogramBins]
  );
  const histogramStepMs = useMemo(() => {
    if (visibleHistogramBins.length < 2) return 60 * 1000;
    const first = new Date(visibleHistogramBins[0].isoTime).getTime();
    const second = new Date(visibleHistogramBins[1].isoTime).getTime();
    const diff = second - first;
    return Number.isFinite(diff) && diff > 0 ? diff : 60 * 1000;
  }, [visibleHistogramBins]);

  const peakBucket = useMemo(() => {
    if (visibleHistogramBins.length === 0) return null;
    return visibleHistogramBins.reduce((peak, current) =>
      current.count > peak.count ? current : peak
    );
  }, [visibleHistogramBins]);

  // Custom Period가 적용되면 선택 기간 [start, end)으로 행을 필터링한다.
  const rangeFilteredRows = useMemo(() => {
    if (!customPeriod) return filteredRows;
    const startMs = customPeriod.start.getTime();
    const endMs = customPeriod.end.getTime();
    return filteredRows.filter((row) => {
      const t = parseRowTimeMs(row.time);
      return t >= startMs && t < endMs;
    });
  }, [filteredRows, customPeriod]);

  const paginatedResult = useMemo(() => {
    const total = rangeFilteredRows.length;
    if (total === 0) {
      return { visibleRows: [] as LogRow[], hasMore: false, nextCursor: null as string | null };
    }
    const firstPageEndIndex = Math.min(LOG_PAGE_SIZE, total) - 1;
    const matchedCursorIndex =
      resultCursor === null
        ? firstPageEndIndex
        : rangeFilteredRows.findIndex((row) => row.id === resultCursor);
    const safeCurrentEndIndex =
      matchedCursorIndex >= 0 ? Math.min(total - 1, matchedCursorIndex) : firstPageEndIndex;
    const nextEndIndex = Math.min(total - 1, safeCurrentEndIndex + LOG_PAGE_SIZE);
    return {
      visibleRows: rangeFilteredRows.slice(0, safeCurrentEndIndex + 1),
      hasMore: safeCurrentEndIndex < total - 1,
      nextCursor:
        safeCurrentEndIndex < total - 1 ? (rangeFilteredRows[nextEndIndex]?.id ?? null) : null,
    };
  }, [rangeFilteredRows, resultCursor]);

  const visibleResultRows = paginatedResult.visibleRows;
  const hasMoreResults = paginatedResult.hasMore;
  const displayedResultCount = visibleResultRows.length;

  const filteredRowMap = useMemo(
    () => new Map(visibleResultRows.map((row) => [row.id, row])),
    [visibleResultRows]
  );

  const codeBlockLines = useMemo<SelectableLogCodeBlockLine[]>(
    () =>
      visibleResultRows.flatMap((row) => {
        const baseLine: SelectableLogCodeBlockLine = {
          id: row.id,
          text: `[${row.time}] | [${row.level}] | ${row.appId} | ${row.domain} | ${row.partition} | ${toDisplay(row.message)}`,
        };
        if (selectedCodeLineId !== row.id) return [baseLine];
        return [
          baseLine,
          { id: buildDetailLineId(row.id, 'time'), text: `  ├ time       : ${row.time}` },
          { id: buildDetailLineId(row.id, 'level'), text: `  ├ level      : ${row.level}` },
          {
            id: buildDetailLineId(row.id, 'appId'),
            text: `  ├ App ID      : ${toDisplay(row.appId)}`,
          },
          {
            id: buildDetailLineId(row.id, 'domain'),
            text: `  ├ domain     : ${toDisplay(row.domain)}`,
          },
          {
            id: buildDetailLineId(row.id, 'partition'),
            text: `  ├ partition  : ${toDisplay(row.partition)}`,
          },
          {
            id: buildDetailLineId(row.id, 'message'),
            text: `  └ message    : ${toDisplay(row.message)}`,
          },
        ];
      }),
    [selectedCodeLineId, visibleResultRows]
  );

  const queryHighlight = filterMap.query ?? '';
  const renderLogLineContent = useCallback(
    (line: SelectableLogCodeBlockLine, helpers: { highlightText: (text: string) => ReactNode }) => {
      if (isDetailLineId(line.id)) {
        return <span className="text-[#94a3b8]">{line.text}</span>;
      }
      const row = filteredRowMap.get(line.id);
      if (!row) return helpers.highlightText(line.text);
      return (
        <>
          {helpers.highlightText(`[${row.time}] `)}
          <span className={getLevelTextClassName(row.level)}>{row.level}</span>
          {helpers.highlightText(
            ` ${row.appId} | ${row.domain} | ${row.partition} > ${toDisplay(row.message)}`
          )}
        </>
      );
    },
    [filteredRowMap]
  );

  const { isDark } = useDarkMode();

  // state.info: light=#2563eb / dark=#60a5fa
  // state.warning: light=#f97316 / dark=#fb923c
  const histogramBarColor = isDark ? '#60a5fa' : '#2563eb'; // state.info
  const histogramBarHover = isDark ? '#bfdbfe' : '#93c5fd'; // state.info +3 lightness steps
  const histogramPeakColor = isDark ? '#fb923c' : '#f97316'; // state.warning
  const histogramPeakHover = isDark ? '#fed7aa' : '#fdba74'; // state.warning +2 lightness steps

  const histogramChartOptions = useMemo<EChartsOption>(() => {
    const peakIndex = peakBucket
      ? visibleHistogramBins.findIndex((b) => b.isoTime === peakBucket.isoTime)
      : -1;

    const axisInterval = Math.max(0, Math.ceil(visibleHistogramBins.length / 12) - 1);

    return {
      grid: { left: 0, right: 16, top: 20, bottom: 16, containLabel: true },
      xAxis: {
        type: 'category',
        data: visibleHistogramBins.map((b) => b.timeLabel),
        boundaryGap: true,
        axisLabel: { fontSize: 10, color: '#94A3B8', interval: axisInterval, margin: 8 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.4)' } },
        axisTick: { alignWithLabel: true, lineStyle: { color: 'rgba(148, 163, 184, 0.4)' } },
        axisPointer: {
          show: true,
          type: 'shadow',
          shadowStyle: { color: isDark ? 'rgba(96, 165, 250, 0.06)' : 'rgba(37, 99, 235, 0.05)' },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10,
          color: '#94A3B8',
          formatter: (value: number): string => {
            if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
            return String(value);
          },
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)', type: 'dashed' } },
        splitNumber: 5,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        extraCssText: 'border:none; box-shadow:none; background:transparent;',
        formatter: (params: unknown): string => {
          const paramsArray = Array.isArray(params) ? params : params ? [params] : [];
          if (paramsArray.length === 0) return '';
          const p = paramsArray[0] as { value?: unknown; dataIndex?: unknown; color?: unknown };
          const index = typeof p.dataIndex === 'number' ? p.dataIndex : -1;
          if (index < 0) return '';
          const bucket = visibleHistogramBins[index];
          if (!bucket) return '';
          const bucketStart = formatIsoToDateTime(bucket.isoTime);
          const nextBucket = visibleHistogramBins[index + 1];
          const bucketEnd = formatIsoToDateTime(
            nextBucket
              ? nextBucket.isoTime
              : new Date(new Date(bucket.isoTime).getTime() + histogramStepMs).toISOString()
          );
          const rawValue = p.value;
          const value = typeof rawValue === 'number' ? String(rawValue) : String(bucket.count);
          const numericValue = typeof rawValue === 'number' ? rawValue : bucket.count;
          const ratio =
            histogramTotalCount > 0 && Number.isFinite(numericValue)
              ? ` (${((numericValue / histogramTotalCount) * 100).toFixed(1)}%)`
              : '';
          const itemColor = typeof p.color === 'string' ? p.color : histogramBarColor;
          return chartTooltipHtml(`${bucketStart} ~ ${bucketEnd}`, [
            { label: 'Log Volume', value: `${value}${ratio}`, color: itemColor },
          ]);
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Log Volume',
          data: visibleHistogramBins.map((bin, i) => ({
            value: bin.count,
            itemStyle: {
              color: i === peakIndex ? histogramPeakColor : histogramBarColor,
            },
            emphasis: {
              itemStyle: {
                color: i === peakIndex ? histogramPeakHover : histogramBarHover,
                opacity: 1,
              },
            },
          })),
          barWidth: `${HISTOGRAM_BAR_WIDTH_RATIO * 100}%`,
          barCategoryGap: '2%',
          barMinHeight: 1,
          animation: false,
          emphasis: {
            focus: 'none',
          },
          itemStyle: {
            borderRadius: 0,
          },
          selectedMode: false,
        },
      ],
    };
  }, [
    histogramBarColor,
    histogramBarHover,
    histogramPeakColor,
    histogramPeakHover,
    isDark,
    histogramStepMs,
    histogramTotalCount,
    peakBucket,
    visibleHistogramBins,
  ]);

  // ─── Histogram selection logic ──────────────────────────────────────────────

  const toRangeFromIndices = useCallback(
    (indices: number[]): RangeSelection | null => {
      if (indices.length === 0) return null;
      const sorted = [...indices].sort((a, b) => a - b);
      const startIndex = sorted[0];
      const endIndex = sorted[sorted.length - 1];
      if (startIndex === undefined || endIndex === undefined) return null;
      return clampRange({ startIndex, endIndex }, visibleHistogramBins);
    },
    [visibleHistogramBins]
  );

  // 선택한 버킷 구간(클릭·드래그)을 Custom Period({start, end})로 환산해 적용한다.
  // 적용되면 histogramBins가 선택 기간 길이에 맞춰 재버킷팅된다(별도 오버레이 없음).
  const applyCustomPeriodFromIndices = useCallback(
    (indices: number[]): void => {
      const range = toRangeFromIndices(indices);
      if (!range) return;
      const startBucket = visibleHistogramBins[range.startIndex];
      const endBucket = visibleHistogramBins[range.endIndex];
      if (!startBucket || !endBucket) return;
      const start = new Date(startBucket.isoTime);
      // 마지막 버킷의 끝까지 포함하도록 step만큼 더한다
      const end = new Date(new Date(endBucket.isoTime).getTime() + histogramStepMs);
      setCustomPeriod({ start, end });
    },
    [toRangeFromIndices, visibleHistogramBins, histogramStepMs]
  );

  const handleTimeRangeChange = useCallback((nextTimeRange: TimeRangeValue): void => {
    // 시간 범위 프리셋 선택 시 Custom Period(드래그 선택)를 해제한다.
    setTimeRange(nextTimeRange);
    setCustomPeriod(null);
  }, []);

  const handleCustomPeriodChange = useCallback(
    (nextPeriod: { start: Date; end: Date } | null): void => {
      setCustomPeriod(nextPeriod);
    },
    []
  );

  const handleResetFilters = (): void => {
    setTimeRange('30m');
    setCustomPeriod(null);
    setResultCursor(null);
    setAppliedFilters([]);
  };

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    setResultCursor(null);
    setSelectedCodeLineId(null);
    setLogScrollTop(0);
  }, [rangeFilteredRows]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(RETENTION_DAYS_STORAGE_KEY, String(retentionDays));
    }
  }, [retentionDays]);

  const handleHistogramClick = useCallback(
    (event: unknown): void => {
      if (suppressNextHistogramClickRef.current) {
        suppressNextHistogramClickRef.current = false;
        return;
      }
      const index = parseChartClickIndex(event);
      if (index === null) return;
      // 단일 막대 클릭 → 해당 구간을 Custom Period로 적용(재버킷팅).
      applyCustomPeriodFromIndices([index]);
    },
    [applyCustomPeriodFromIndices]
  );

  const clickHandlerRef = useRef(handleHistogramClick);
  useEffect(() => {
    clickHandlerRef.current = handleHistogramClick;
  }, [handleHistogramClick]);

  // ECharts init
  useEffect(() => {
    if (!histogramChartRef.current) return;
    const container = histogramChartRef.current;
    const instance = echarts.init(container);
    histogramInstanceRef.current = instance;

    const onClick = (event: unknown): void => {
      clickHandlerRef.current(event);
    };
    instance.on('click', onClick);

    const handleResize = (): void => {
      instance.resize();
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            instance.resize();
          })
        : null;
    resizeObserver?.observe(container);
    requestAnimationFrame(() => {
      instance.resize();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      instance.off('click', onClick);
      instance.dispose();
      histogramInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = histogramInstanceRef.current;
    if (!instance) return;
    instance.setOption(histogramChartOptions, { notMerge: false, lazyUpdate: true });
  }, [histogramChartOptions]);

  // Histogram drag-to-select
  useEffect(() => {
    const container = histogramContainerRef.current;
    if (!container) return;

    const DRAG_THRESHOLD = 4;
    let startX = 0,
      currentX = 0,
      dragging = false,
      pressed = false;
    let dragFrame: number | null = null;
    let pendingDragBox: { left: number; width: number } | null = null;

    const clampX = (rawX: number): number => {
      const rect = container.getBoundingClientRect();
      return Math.min(rect.width, Math.max(0, rawX - rect.left));
    };

    const flushDragBox = (): void => {
      dragFrame = null;
      setDragBox((previous) => {
        if (previous?.left === pendingDragBox?.left && previous?.width === pendingDragBox?.width)
          return previous;
        return pendingDragBox;
      });
    };

    const handleMouseDown = (event: MouseEvent): void => {
      if (event.button !== 0) return;
      pressed = true;
      dragging = false;
      startX = clampX(event.clientX);
      currentX = startX;
    };

    const handleMouseMove = (event: MouseEvent): void => {
      if (!pressed) return;
      currentX = clampX(event.clientX);
      if (!dragging && Math.abs(currentX - startX) > DRAG_THRESHOLD) {
        dragging = true;
        suppressNextHistogramClickRef.current = true;
      }
      if (dragging) {
        const left = Math.min(startX, currentX);
        const width = Math.abs(currentX - startX);
        pendingDragBox = { left, width };
        if (dragFrame === null) dragFrame = window.requestAnimationFrame(flushDragBox);
      }
    };

    const handleMouseUp = (): void => {
      if (!pressed) return;
      const wasDragging = dragging;
      pressed = false;
      dragging = false;
      pendingDragBox = null;
      if (dragFrame !== null) {
        window.cancelAnimationFrame(dragFrame);
        dragFrame = null;
      }
      setDragBox(null);

      if (!wasDragging) return;

      const instance = histogramInstanceRef.current;
      if (!instance) return;

      const leftPx = Math.min(startX, currentX);
      const rightPx = Math.max(startX, currentX);
      const fromPx = instance.convertFromPixel({ gridIndex: 0 }, [leftPx, 0]) as number[] | null;
      const toPx = instance.convertFromPixel({ gridIndex: 0 }, [rightPx, 0]) as number[] | null;
      if (!fromPx || !toPx) return;
      const minCoord = Number(fromPx[0]),
        maxCoord = Number(toPx[0]);
      if (!Number.isFinite(minCoord) || !Number.isFinite(maxCoord)) return;
      const overlapped = computeOverlappedIndices(
        Math.min(minCoord, maxCoord),
        Math.max(minCoord, maxCoord),
        visibleHistogramBins
      );
      applyCustomPeriodFromIndices(overlapped);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (dragFrame !== null) window.cancelAnimationFrame(dragFrame);
    };
  }, [applyCustomPeriodFromIndices, visibleHistogramBins]);

  // ─── SaveQuery handler ────────────────────────────────────────────────────

  const handleSaveQuery = (values: {
    name: string;
    query: string;
    appId: string;
    levels: string[];
    partition: string;
  }): boolean => {
    const result = createSavedQuery(values);
    if (!result.ok && result.reason === 'duplicate-name') {
      setSaveQueryError('A saved query with this name already exists.');
      return false;
    }
    setSaveQueryError(null);
    return true;
  };

  const applySavedQuery = (savedQuery: SavedQuery): void => {
    const nextFilters: AppliedFilter[] = [];
    let counter = Date.now();
    if (savedQuery.query.trim()) {
      nextFilters.push({
        id: `q-${counter++}`,
        fieldId: 'query',
        fieldLabel: 'Query',
        value: savedQuery.query,
      });
    }
    if (savedQuery.appId.trim()) {
      nextFilters.push({
        id: `a-${counter++}`,
        fieldId: 'appId',
        fieldLabel: 'App',
        value: savedQuery.appId,
      });
    }
    savedQuery.levels.forEach((lvl, idx) => {
      if (lvl.trim()) {
        nextFilters.push({
          id: `l-${counter + idx}`,
          fieldId: 'level',
          fieldLabel: 'Level',
          value: lvl,
        });
      }
    });
    if (savedQuery.partition.trim()) {
      nextFilters.push({
        id: `p-${counter}`,
        fieldId: 'partition',
        fieldLabel: 'Partition',
        value: savedQuery.partition,
      });
    }
    setResultCursor(null);
    setCustomPeriod(null);
    setAppliedFilters(nextFilters);
  };

  const hasSearchFilters = appliedFilters.length > 0;

  // Deduplicate by fieldId+value before applying so the same option can't be
  // added twice even though FilterSearchInput doesn't prevent it natively.
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

  // ─── Render ───────────────────────────────────────────────────────────────

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
          breadcrumb={<Breadcrumb items={[{ label: 'Logs' }, { label: 'Log Explorer' }]} />}
        />
      }
    >
      <div className="flex w-full flex-col items-start gap-6 pb-6">
        {/* Header + Filter Bar */}
        <div className="flex flex-col gap-4 w-full pt-6">
          <PageHeader title="Log Explorer" />

          <div className="flex flex-col gap-2">
            {/* Toolbar row — Audit Logs 상단 패턴: 박스 테두리/배경/패딩 없이 인라인 배치 */}
            <div className="flex w-full flex-wrap items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 overflow-visible">
                <FilterSearchInput
                  filters={FILTER_FIELDS}
                  appliedFilters={appliedFilters}
                  onFiltersChange={handleFiltersChange}
                  placeholder="Search logs by attributes"
                  size="sm"
                  className="min-w-[220px]"
                  hideAppliedFilters
                />
                <MonitoringToolbar
                  timeRange={timeRange}
                  onTimeRangeChange={handleTimeRangeChange}
                  customPeriod={customPeriod}
                  onCustomPeriodChange={handleCustomPeriodChange}
                  onRefresh={handleResetFilters}
                  showRefresh
                />
              </div>
              <HStack gap={2} className="ml-auto shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSaveQueryError(null);
                    setIsSaveQueryOpen(true);
                  }}
                >
                  Save Query
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setIsApplyQueryOpen(true)}>
                  Apply Query
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setIsRetentionOpen(true)}>
                  Retention Setting
                </Button>
              </HStack>
            </div>

            {/* Applied filter chips — full width below toolbar */}
            {appliedFilters.length > 0 && (
              <div className="flex items-start gap-2 pt-1">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                  {appliedFilters.map((f) => (
                    <Chip
                      key={f.id}
                      label={f.fieldLabel}
                      value={f.valueLabel ?? f.value}
                      onRemove={() =>
                        setAppliedFilters((prev) => prev.filter((x) => x.id !== f.id))
                      }
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedFilters([])}
                  className="shrink-0 text-label-sm text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {saveQueryError && (
              <p className="text-body-sm text-[var(--color-state-danger)]">{saveQueryError}</p>
            )}
          </div>
        </div>

        {/* Histogram */}
        <div className="flex flex-col gap-4 w-full">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--color-border-default)]">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Badge theme="blu" size="sm" type="subtle">
                  Total Logs: {histogramTotalCount.toLocaleString()}
                </Badge>
                <Badge theme="ylw" size="sm" type="subtle">
                  Peak:{' '}
                  {peakBucket
                    ? `${peakBucket.count.toLocaleString()} (at ${peakBucket.timeLabel})`
                    : '-'}
                </Badge>
              </div>
            </div>

            <div>
              <div className="px-4 pb-3 pt-2">
                <div
                  ref={histogramContainerRef}
                  className="relative h-[110px] w-full select-none"
                  style={{ cursor: visibleHistogramBins.length > 0 ? 'crosshair' : 'default' }}
                >
                  <div ref={histogramChartRef} className="h-full w-full" />
                  {visibleHistogramBins.length === 0 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-[var(--color-text-subtle)]">
                      No histogram data
                    </div>
                  )}
                  {dragBox && dragBox.width > 0 && (
                    <div
                      className="pointer-events-none absolute top-0 bottom-0"
                      style={{
                        left: `${dragBox.left}px`,
                        width: `${dragBox.width}px`,
                        background: 'rgba(91, 141, 255, 0.12)',
                        borderLeft: '1px solid rgba(91, 141, 255, 0.6)',
                        borderRight: '1px solid rgba(91, 141, 255, 0.6)',
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Log results */}
        <div className="flex flex-col gap-4 w-full">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-3">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge theme="blu" size="sm" type="subtle">
                Showing {displayedResultCount} / {rangeFilteredRows.length}
              </Badge>
              <Badge theme="gry" size="sm" type="subtle">
                {rangeFilteredRows.length} logs
              </Badge>
            </div>

            {rangeFilteredRows.length === 0 ? (
              <EmptyState
                variant="inline"
                title={hasSearchFilters ? 'No results found' : 'No logs'}
                description={hasSearchFilters ? 'Try adjusting your search or time range.' : ''}
              />
            ) : (
              <div>
                <div className="overflow-hidden rounded-md border border-[#334155] bg-[#0b1220] shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
                  <div
                    className="w-full overflow-y-auto bg-[#020617]"
                    style={{ height: `${LOG_VIEWPORT_HEIGHT}px` }}
                    onScroll={(event) => {
                      const el = event.currentTarget;
                      setLogScrollTop(el.scrollTop);
                      // 무한 스크롤: 하단 근접 시 다음 페이지 자동 로드
                      const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
                      if (
                        hasMoreResults &&
                        paginatedResult.nextCursor &&
                        distanceToBottom <= LOG_ROW_HEIGHT * VIRTUAL_OVERSCAN
                      ) {
                        setResultCursor(paginatedResult.nextCursor);
                      }
                    }}
                  >
                    <SelectableLogCodeBlock
                      lines={codeBlockLines}
                      selectedId={selectedCodeLineId}
                      highlightQuery={queryHighlight}
                      renderLineContent={renderLogLineContent}
                      lineClassName="text-[11px] leading-[16px]"
                      emptyTextClassName="text-[11px] leading-[16px]"
                      virtualization={{
                        enabled: true,
                        rowHeight: LOG_ROW_HEIGHT,
                        overscan: VIRTUAL_OVERSCAN,
                        viewportHeight: LOG_VIEWPORT_HEIGHT,
                        scrollTop: logScrollTop,
                      }}
                      onSelect={(line) => {
                        const baseRowId = getBaseRowIdFromLineId(line.id);
                        const row = filteredRowMap.get(baseRowId);
                        if (!row || isDetailLineId(line.id)) return;
                        setSelectedCodeLineId((prev) => (prev === baseRowId ? null : baseRowId));
                      }}
                      emptyText="-"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawers */}
        <SaveQueryDrawer
          isOpen={isSaveQueryOpen}
          onClose={() => setIsSaveQueryOpen(false)}
          defaultName={`Saved Query ${new Date().toLocaleTimeString()}`}
          query={filterMap.query ?? ''}
          appId={filterMap.appId ?? ''}
          levels={filtersByField.level ?? []}
          partition={filterMap.partition ?? ''}
          onSave={handleSaveQuery}
        />

        <ApplyQueryDrawer
          isOpen={isApplyQueryOpen}
          onClose={() => setIsApplyQueryOpen(false)}
          savedQueries={getSavedQueries()}
          onApply={applySavedQuery}
        />

        <RetentionSettingDrawer
          isOpen={isRetentionOpen}
          onClose={() => setIsRetentionOpen(false)}
          value={retentionDays}
          onSave={(days) => {
            setRetentionDays(days);
          }}
        />
      </div>
    </PageShell>
  );
};

export default LogExplorerPage;
