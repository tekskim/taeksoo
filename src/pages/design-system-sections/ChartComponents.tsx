import { useState, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Tooltip } from '@/design-system';
import {
  IconRefresh,
  IconDotsCircleHorizontal,
  IconArrowsMinimize,
  IconArrowsMaximize,
} from '@tabler/icons-react';
import { DataViewDrawer } from '@/components/DataViewDrawer';

/* ----------------------------------------
   Chart Color Palette (from storage-dashboard)
   ---------------------------------------- */

export const chartColors = {
  // Primary 5-color palette (Tailwind 400 shades)
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  violet400: '#a78bfa',
  fuchsia400: '#e879f9',
  // Additional colors
  rose400: '#fb7185',
  blue400: '#60a5fa',
  green400: '#4ade80',
  yellow400: '#facc15',
  red400: '#f87171',
  // Neutral
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate800: '#1e293b',
};

export const primaryChartColors = [
  chartColors.cyan400,
  chartColors.emerald400,
  chartColors.amber400,
  chartColors.violet400,
  chartColors.fuchsia400,
];

/* ----------------------------------------
   Base Chart Options (from storage-dashboard)
   ---------------------------------------- */

export const baseChartOptions = {
  animation: false,
  grid: {
    left: '0',
    right: '16px',
    top: '30px',
    bottom: '16px',
    containLabel: true,
  },
  xAxis: {
    type: 'category' as const,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: chartColors.slate400,
      fontSize: 10,
      padding: [0, 0, 0, 15],
    },
    boundaryGap: false,
  },
  yAxis: {
    type: 'value' as const,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      lineStyle: { color: chartColors.slate100, opacity: 0.5 },
    },
    axisLabel: {
      color: chartColors.slate400,
      fontSize: 10,
    },
  },
  tooltip: {
    trigger: 'axis' as const,
    backgroundColor: 'white',
    borderColor: '#e2e8f0',
    textStyle: { color: chartColors.slate800, fontSize: 11 },
    formatter: (
      params: Array<{ marker: string; seriesName: string; value: number; axisValueLabel: string }>
    ) => {
      if (!Array.isArray(params) || params.length === 0) return '';
      const time = params[0].axisValueLabel;
      const items = params
        .map(
          (p) =>
            `<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${p.color};"></span><span>${p.seriesName}</span><span style="font-weight: 500; margin-left: auto;">${p.value}</span></div>`
        )
        .join('');
      return `<div style="font-size: 11px;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
    },
    axisPointer: {
      type: 'line',
      snap: true,
      lineStyle: {
        color: chartColors.slate400,
        type: 'dashed',
      },
    },
  },
};

/* ----------------------------------------
   Bar chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

export function BarChartDemo({ variant }: { variant: 'vertical' | 'horizontal' | 'grouped' }) {
  const labels = ['Instances', 'Volumes', 'Networks', 'Snapshots', 'Backups'];
  const currentData = [45, 72, 28, 56, 33];
  const previousData = [35, 55, 42, 38, 28];

  const getOption = () => {
    if (variant === 'horizontal') {
      return {
        ...baseChartOptions,
        grid: { ...baseChartOptions.grid, left: '80px' },
        xAxis: {
          type: 'value' as const,
          min: 0,
          max: 100,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: chartColors.slate100, opacity: 0.5 } },
          axisLabel: { color: chartColors.slate400, fontSize: 10 },
        },
        yAxis: {
          type: 'category' as const,
          data: labels,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: chartColors.slate400, fontSize: 10 },
        },
        series: [
          {
            type: 'bar',
            data: currentData,
            itemStyle: { color: primaryChartColors[0], borderRadius: [0, 4, 4, 0] },
            barWidth: '50%',
          },
        ],
      };
    }

    if (variant === 'grouped') {
      return {
        ...baseChartOptions,
        xAxis: {
          type: 'category' as const,
          data: labels,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: chartColors.slate400, fontSize: 10 },
        },
        yAxis: {
          ...baseChartOptions.yAxis,
          min: 0,
          max: 100,
        },
        series: [
          {
            name: 'Current',
            type: 'bar',
            data: currentData,
            itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
            barGap: '10%',
          },
          {
            name: 'Previous',
            type: 'bar',
            data: previousData,
            itemStyle: { color: primaryChartColors[1], borderRadius: [4, 4, 0, 0] },
          },
        ],
      };
    }

    // Vertical (default)
    return {
      ...baseChartOptions,
      xAxis: {
        type: 'category' as const,
        data: labels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: chartColors.slate400, fontSize: 10 },
      },
      yAxis: {
        ...baseChartOptions.yAxis,
        min: 0,
        max: 100,
      },
      series: [
        {
          type: 'bar',
          data: currentData,
          itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
          barWidth: '50%',
        },
      ],
    };
  };

  return (
    <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
      <ReactECharts
        option={getOption()}
        style={{ height: variant === 'horizontal' ? '250px' : '200px' }}
        notMerge={true}
        opts={{ devicePixelRatio: window.devicePixelRatio }}
      />
      {variant === 'grouped' && (
        <div className="flex gap-4 mt-2 justify-start">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: primaryChartColors[0] }}
            />
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
              Current
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: primaryChartColors[1] }}
            />
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
              Previous
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Area chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

// Generate time labels for charts
export const generateTimeLabels = () => {
  const labels = [];
  for (let i = 0; i <= 50; i += 10) {
    const min = i.toString().padStart(2, '0');
    labels.push(`13:${min}`);
  }
  return labels;
};

// LineChart Component (from storage-dashboard)
interface LineChartSeries {
  name: string;
  data: number[];
  color: string;
}

// Time options for full screen mode
export const timeOptions = [
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
];

// Icons for time controls
export const CalendarIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const CloseIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Helper function for date formatting
export const formatDateForDisplay = (date: Date | null) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// TimeControls Component
export function TimeControls({
  onTimeRangeChange,
  onRefresh,
}: {
  onTimeRangeChange?: (value: string) => void;
  onRefresh?: () => void;
}) {
  const [timeRange, setTimeRange] = useState('30m');
  const [customPeriod, setCustomPeriod] = useState<{ start: Date; end: Date } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);
  const [viewMonth, setViewMonth] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  const handleTimeRangeClick = (value: string) => {
    setTimeRange(value);
    setCustomPeriod(null);
    onTimeRangeChange?.(value);
  };

  const handleCustomPeriodClick = () => {
    if (customPeriod) {
      setTempStartDate(customPeriod.start);
      setTempEndDate(customPeriod.end);
      setViewMonth(customPeriod.start);
    } else {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setTempStartDate(oneWeekAgo);
      setTempEndDate(now);
      setViewMonth(now);
    }
    setSelectingStart(true);
    setShowDatePicker(true);
  };

  const handleApplyCustomPeriod = () => {
    if (tempStartDate && tempEndDate) {
      const newPeriod = { start: tempStartDate, end: tempEndDate };
      setCustomPeriod(newPeriod);
      setTimeRange('');
      setShowDatePicker(false);
    }
  };

  const handleClearCustomPeriod = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomPeriod(null);
    setTimeRange('30m');
    onTimeRangeChange?.('30m');
  };

  const handlePeriodTextClick = () => {
    if (customPeriod) {
      setTempStartDate(customPeriod.start);
      setTempEndDate(customPeriod.end);
      setViewMonth(customPeriod.start);
    }
    setSelectingStart(true);
    setShowDatePicker(true);
  };

  // Calendar helpers
  const formatCalendarDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: d.toDateString() === today.toDateString(),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const handleDayClick = (date: Date) => {
    if (selectingStart) {
      setTempStartDate(date);
      if (tempEndDate && date > tempEndDate) {
        setTempEndDate(null);
      }
      setSelectingStart(false);
    } else {
      if (tempStartDate && date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
      setSelectingStart(true);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false;
    return date >= tempStartDate && date <= tempEndDate;
  };

  const isStartDate = (date: Date) => {
    return tempStartDate?.toDateString() === date.toDateString();
  };

  const isEndDate = (date: Date) => {
    return tempEndDate?.toDateString() === date.toDateString();
  };

  const prevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fullScreenTimeControls">
      {/* Time Range Buttons */}
      <div className="timeSegments">
        {timeOptions.map((option) => (
          <button
            key={option.value}
            className={`timeSegment ${timeRange === option.value && !customPeriod ? 'timeSegmentActive' : ''}`}
            onClick={() => handleTimeRangeClick(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Period Selector */}
      <div className="datePickerContainer" ref={datePickerRef}>
        {customPeriod ? (
          <div className="periodTag">
            <span className="periodTagText" onClick={handlePeriodTextClick}>
              {formatDateForDisplay(customPeriod.start)}
              <span className="periodTagDivider">—</span>
              {formatDateForDisplay(customPeriod.end)}
            </span>
            <button className="periodTagClose" onClick={handleClearCustomPeriod}>
              <CloseIcon />
            </button>
          </div>
        ) : (
          <button
            className={`customPeriodBtn ${showDatePicker ? 'customPeriodBtnActive' : ''}`}
            onClick={handleCustomPeriodClick}
          >
            <CalendarIcon />
            Period
          </button>
        )}

        {/* Calendar Date Picker Dropdown */}
        {showDatePicker && (
          <div className="calendarDropdown">
            {/* Date Range Header */}
            <div className="calendarHeader">
              <div
                className={`calendarDateBox ${selectingStart ? 'calendarDateBoxActive' : ''}`}
                onClick={() => setSelectingStart(true)}
              >
                <span className="calendarDateLabel">START</span>
                <span className="calendarDateValue">{formatCalendarDate(tempStartDate)}</span>
              </div>
              <div className="calendarDateSeparator">~</div>
              <div
                className={`calendarDateBox ${!selectingStart ? 'calendarDateBoxActive' : ''}`}
                onClick={() => setSelectingStart(false)}
              >
                <span className="calendarDateLabel">END</span>
                <span className="calendarDateValue">{formatCalendarDate(tempEndDate)}</span>
              </div>
            </div>

            {/* DatePicker from Design system */}
            <DatePicker
              mode="range"
              rangeValue={{ start: tempStartDate, end: tempEndDate }}
              onRangeChange={(range) => {
                setTempStartDate(range.start);
                setTempEndDate(range.end);
                setSelectingStart(!range.start || !!range.end);
              }}
              maxDate={new Date()}
            />

            {/* Actions */}
            <div className="calendarActions">
              <button className="calendarCancel" onClick={() => setShowDatePicker(false)}>
                Cancel
              </button>
              <button className="calendarApply" onClick={handleApplyCustomPeriod}>
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button className="refreshButton" onClick={onRefresh}>
        <IconRefresh size={14} stroke={1.5} />
      </button>
    </div>
  );
}

export function LineChart({
  title,
  series,
  yAxisFormatter = (v: number) => `${v}`,
  height = '100%',
  onFullScreen,
  isFullScreen = false,
  onExitFullScreen,
  timeControls,
}: {
  title: string;
  series: LineChartSeries[];
  yAxisFormatter?: (value: number) => string;
  height?: string;
  onFullScreen?: () => void;
  isFullScreen?: boolean;
  onExitFullScreen?: () => void;
  timeControls?: React.ReactNode;
}) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(series.map((s) => [s.name, true]))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDataView, setShowDataView] = useState(false);

  const timeLabels = generateTimeLabels();

  const allVisible = Object.values(visibleSeries).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map((s) => [s.name, newState])));
  };

  const handleFullScreen = () => {
    setMenuOpen(false);
    if (onFullScreen) onFullScreen();
  };

  // Calculate y-axis bounds for exactly 5 labels
  const visibleData = series.filter((s) => visibleSeries[s.name]).flatMap((s) => s.data);
  const dataMax = visibleData.length > 0 ? Math.max(...visibleData) : 100;
  const niceMax = Math.ceil(dataMax / 4) * 4; // Round up to nearest multiple of 4
  const yInterval = niceMax / 4; // 4 intervals = 5 labels

  const option = {
    animation: false,
    grid: {
      left: '0',
      right: '16px',
      top: '20px',
      bottom: '16px',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: timeLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        padding: [0, 0, 0, 15],
      },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax,
      interval: yInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: chartColors.slate100, opacity: 0.5 },
      },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: yAxisFormatter,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: {
        color: chartColors.slate800,
        fontSize: 11,
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      formatter: (
        params: Array<{
          marker: string;
          seriesName: string;
          value: number;
          axisValueLabel: string;
          color: string;
        }>
      ) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const time = params[0].axisValueLabel;
        const items = params
          .map(
            (p) =>
              `<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${p.color};"></span><span>${p.seriesName}</span><span style="font-weight: 500; margin-left: auto;">${yAxisFormatter(p.value)}</span></div>`
          )
          .join('');
        return `<div style="font-size: 11px;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
      },
    },
    series: series
      .filter((s) => visibleSeries[s.name])
      .map((s) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { color: s.color, width: 1 },
        itemStyle: { color: s.color },
        areaStyle: { color: s.color, opacity: 0.1 },
        data: s.data,
      })),
  };

  return (
    <div className={`chartCard ${isFullScreen ? 'chartCardFullScreen' : ''}`}>
      {/* Header */}
      <div className="chartHeader">
        <span className="chartTitle">{title}</span>
        {isFullScreen && timeControls && <div className="chartHeaderCenter">{timeControls}</div>}
        <div className="chartControls">
          {/* Toggle Button - only show for multiple series */}
          {series.length > 1 && (
            <>
              <button className="toggleBtn" onClick={toggleAll}>
                <span className={`toggleSwitch ${allVisible ? 'toggleSwitchActive' : ''}`} />
                <span>{allVisible ? 'Hide All' : 'View All'}</span>
              </button>
              <span className="toggleDivider">|</span>
            </>
          )}

          {/* Menu Button */}
          <div className="menuContainer">
            <button
              className="menuTrigger"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <IconDotsCircleHorizontal size={16} stroke={1.5} />
            </button>
            {menuOpen && (
              <div className="contextMenu">
                <button className="contextMenuItem" onClick={() => setMenuOpen(false)}>
                  Download Image
                </button>
                <button className="contextMenuItem" onClick={() => setMenuOpen(false)}>
                  Download CSV
                </button>
                <button
                  className="contextMenuItemLast"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowDataView(true);
                  }}
                >
                  Data View
                </button>
              </div>
            )}
          </div>

          {/* Expand/Minimize Button */}
          <button
            className="expandTrigger"
            title={isFullScreen ? 'Minimize' : 'Expand'}
            onClick={isFullScreen ? onExitFullScreen : handleFullScreen}
          >
            {isFullScreen ? (
              <IconArrowsMinimize size={16} stroke={1.5} />
            ) : (
              <IconArrowsMaximize size={16} stroke={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="chartBody">
        <div className="chartWrapper">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            opts={{ devicePixelRatio: window.devicePixelRatio }}
          />
        </div>
        <div className="chartLegend">
          {series.map((s, i) => (
            <div
              key={i}
              className={`legendItem ${!visibleSeries[s.name] ? 'legendItemHidden' : ''}`}
              onClick={() => setVisibleSeries((prev) => ({ ...prev, [s.name]: !prev[s.name] }))}
            >
              <div className="legendDot" style={{ backgroundColor: s.color }} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data View Drawer */}
      <DataViewDrawer
        isOpen={showDataView}
        onClose={() => setShowDataView(false)}
        title={`${title} (RAW)`}
        series={series}
        timeLabels={timeLabels}
      />
    </div>
  );
}

// Full Screen Chart Data Interface
interface FullScreenChartData {
  title: string;
  series: LineChartSeries[];
  yAxisFormatter: (value: number) => string;
}

// ChartWithFullScreen Wrapper Component
export function ChartWithFullScreen({
  title,
  series,
  yAxisFormatter = (v: number) => `${v}`,
  height = '100%',
}: {
  title: string;
  series: LineChartSeries[];
  yAxisFormatter?: (value: number) => string;
  height?: string;
}) {
  const [fullScreenChart, setFullScreenChart] = useState<FullScreenChartData | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullScreenChart) {
        setFullScreenChart(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullScreenChart]);

  const handleEnterFullScreen = () => {
    setFullScreenChart({ title, series, yAxisFormatter });
  };

  const handleExitFullScreen = () => {
    setFullScreenChart(null);
  };

  return (
    <>
      {/* Regular Chart */}
      <LineChart
        title={title}
        series={series}
        yAxisFormatter={yAxisFormatter}
        height={height}
        onFullScreen={handleEnterFullScreen}
      />

      {/* Full Screen Overlay & Chart */}
      {fullScreenChart && (
        <>
          <div className="fullScreenOverlay" onClick={handleExitFullScreen} />
          <div className="fullScreenFloating">
            <LineChart
              title={fullScreenChart.title}
              series={fullScreenChart.series}
              yAxisFormatter={fullScreenChart.yAxisFormatter}
              isFullScreen={true}
              onExitFullScreen={handleExitFullScreen}
              timeControls={<TimeControls />}
            />
          </div>
        </>
      )}
    </>
  );
}

// QuotaBarDemo Component
export function QuotaBarDemo({
  label,
  used,
  total,
  unit,
}: {
  label: string;
  used: number;
  total: number;
  unit: string;
}) {
  const percentage = Math.round((used / total) * 100);

  const getColors = () => {
    if (percentage >= 100)
      return {
        bg: 'bg-[var(--color-status-error)]/15',
        text: 'text-[var(--color-status-error)]',
      };
    if (percentage >= 70)
      return {
        bg: 'bg-[var(--color-status-warning)]/15',
        text: 'text-[var(--color-status-warning)]',
      };
    return {
      bg: 'bg-[var(--color-status-success)]/15',
      text: 'text-[var(--color-status-success)]',
    };
  };

  const colors = getColors();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)]">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-muted)]">
            {used}/{total} {unit}
          </span>
          <div className={`flex items-center px-1.5 py-0.5 rounded-md ${colors.bg}`}>
            <span
              className={`text-[length:var(--font-size-11)] leading-[var(--line-height-16)] font-medium ${colors.text}`}
            >
              {percentage}%
            </span>
          </div>
        </div>
      </div>
      <Tooltip
        content={
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)]" />
              <span>Used: {used}</span>
            </div>
          </div>
        }
        position="top"
      >
        <div className="w-full">
          <div className="h-[3px] rounded-sm bg-[var(--color-surface-muted)] overflow-hidden cursor-pointer">
            <div
              className="h-full rounded-sm bg-[var(--color-text-muted)] transition-all"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

export function AreaChartDemo({ variant }: { variant: 'basic' | 'stacked' | 'nodata' }) {
  // Basic variant - Network Traffic (single series)
  const networkTrafficSeries: LineChartSeries[] = [
    { name: 'Traffic', data: [120, 180, 150, 220, 280, 240], color: chartColors.cyan400 },
  ];

  if (variant === 'basic') {
    return (
      <ChartWithFullScreen
        title="Network Traffic"
        series={networkTrafficSeries}
        yAxisFormatter={(v) => `${v} MB/s`}
        height="200px"
      />
    );
  }

  // No data variant
  if (variant === 'nodata') {
    const emptySeriesData: LineChartSeries[] = [
      { name: 'Traffic', data: [], color: chartColors.cyan400 },
    ];
    return (
      <ChartWithFullScreen
        title="Network Traffic"
        series={emptySeriesData}
        yAxisFormatter={(v) => `${v} MB/s`}
        height="200px"
      />
    );
  }

  // Stacked variant - CPU Utilization
  const cpuUtilizationSeries: LineChartSeries[] = [
    { name: 'osd.0', data: [0.3, 0.45, 0.55, 0.6, 0.8, 1.1], color: chartColors.cyan400 },
    { name: 'osd.1', data: [0.8, 0.95, 1.15, 1.2, 1.0, 1.5], color: chartColors.emerald400 },
    { name: 'osd.2', data: [0.5, 0.7, 0.9, 0.85, 0.75, 1.1], color: chartColors.amber400 },
    { name: 'osd.3', data: [0.3, 0.5, 0.6, 0.55, 0.65, 0.8], color: chartColors.violet400 },
  ];

  return (
    <ChartWithFullScreen
      title="CPU Utilization"
      series={cpuUtilizationSeries}
      yAxisFormatter={(v) => `${v.toFixed(2)}%`}
      height="200px"
    />
  );
}

/* ----------------------------------------
   Pie chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

// Extended color palette for pie charts with many segments
const extendedChartColors = [
  chartColors.cyan400, // cyan
  chartColors.emerald400, // emerald/green
  chartColors.amber400, // amber/yellow
  chartColors.violet400, // violet/purple
  chartColors.fuchsia400, // fuchsia/pink
  chartColors.red400, // red/coral
  chartColors.slate400, // slate/gray
  '#60a5fa', // blue-400
  '#f472b6', // pink-400
  '#4ade80', // green-400
];

interface PieChartData {
  name: string;
  value: number;
}

export function PieChartDemo({
  title,
  data,
  showPercentOnSlice = true,
}: {
  title: string;
  data: PieChartData[];
  showPercentOnSlice?: boolean;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map((item, index) => ({
    ...item,
    itemStyle: { color: extendedChartColors[index % extendedChartColors.length] },
  }));

  const legendData = data.map((item, index) => ({
    label: item.name,
    value: Math.round((item.value / total) * 100),
    color: extendedChartColors[index % extendedChartColors.length],
  }));

  const getOption = () => ({
    tooltip: {
      show: true,
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      borderRadius: 6,
      padding: [8, 12],
      textStyle: {
        color: '#1e293b',
        fontSize: 11,
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      formatter: (params: {
        marker: string;
        name: string;
        value: number;
        percent: number;
        color: string;
      }) => {
        return `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${params.color}; margin-right: 6px;"></span>${params.name}<br/><span style="font-weight: 500; margin-left: 14px;">${params.value} (${params.percent.toFixed(0)}%)</span>`;
      },
    },
    animation: false,
    series: [
      {
        type: 'pie',
        radius: '80%',
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: showPercentOnSlice
          ? {
              show: true,
              position: 'inside',
              formatter: (params: { percent: number }) => {
                return params.percent >= 15 ? `${params.percent.toFixed(0)}%` : '';
              },
              fontSize: 12,
              fontWeight: 600,
              color: '#ffffff',
              fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
            }
          : {
              show: false,
            },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData,
      },
    ],
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 w-[var(--search-input-width)]">
      <span className="text-[length:var(--font-size-13)] font-medium text-[var(--color-text-default)]">
        {title}
      </span>
      <div className="flex justify-center">
        <ReactECharts
          option={getOption()}
          style={{ height: '180px', width: '180px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center max-h-[60px] overflow-y-auto legend-scroll">
        {legendData.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Doughnut chart Demo (ECharts - matches SingleValueDoughnutCard from storage)
   ---------------------------------------- */

export function DoughnutChartDemo({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: string;
}) {
  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return val || fallback;
    }
    return fallback;
  };

  const mainColor = color || getColor('--color-status-error', '#ef4444');
  const bgColor = getColor('--color-border-subtle', '#e2e8f0');

  const getOption = () => ({
    tooltip: {
      show: false,
    },
    animation: false,
    series: [
      {
        type: 'pie',
        radius: ['68%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        silent: true,
        itemStyle: {
          borderRadius: 0,
          borderWidth: 0,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
        },
        data: [
          { value: value, itemStyle: { color: mainColor } },
          { value: 100 - value, itemStyle: { color: bgColor } },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: `${value}%`,
          textAlign: 'center',
          textVerticalAlign: 'middle',
          fill: getColor('--color-text-default', '#0f172a'),
          fontSize: 18,
          fontWeight: 500,
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      },
    ],
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 w-[var(--search-input-width)]">
      <span className="text-[length:var(--font-size-13)] font-medium text-[var(--color-text-default)]">
        {title}
      </span>
      <div className="flex justify-center">
        <ReactECharts
          option={getOption()}
          style={{ height: '180px', width: '180px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Half-Doughnut chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

export function HalfDoughnutChartDemo({
  value,
  label,
  status = 'default',
  used,
  total,
  unit,
}: {
  value: number;
  label: string;
  status?: 'default' | 'success' | 'warning' | 'error';
  used?: number;
  total?: number;
  unit?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Chart dimensions
  const chartWidth = 180;
  const chartHeight = 160;
  const centerX = chartWidth * 0.5; // 50%
  const centerY = chartHeight * 0.65; // 65%
  const radius = Math.min(chartWidth, chartHeight) * 0.45; // 90% of half
  const arcWidth = 14;
  const innerRadius = radius - arcWidth;
  const outerRadius = radius;

  // Get color from design system CSS variables
  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return value || fallback;
    }
    return fallback;
  };

  const colorMap = {
    default: primaryChartColors[0],
    success: getColor('--color-status-success', '#22c55e'),
    warning: getColor('--color-status-warning', '#f97316'),
    error: getColor('--color-status-error', '#ef4444'),
  };

  const color = colorMap[status];
  const available = total !== undefined && used !== undefined ? total - used : 0;
  const availablePercent =
    total !== undefined && used !== undefined ? Math.round((available / total) * 100) : 0;

  // Check if mouse is over the gauge arc
  const isOverGaugeArc = (mx: number, my: number) => {
    const dx = mx - centerX;
    const dy = my - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if within the arc ring
    if (distance < innerRadius - 4 || distance > outerRadius + 4) return false;

    // Check if within the arc angle range (210° to -30°, which is 210° to 330° in standard coords)
    // Convert to angle: atan2 gives -PI to PI, we need to convert
    let angle = Math.atan2(-dy, dx) * (180 / Math.PI); // Negate dy because canvas Y is inverted
    if (angle < 0) angle += 360;

    // The gauge goes from 210° (start) to 330° (-30° = 330°) clockwise
    // In standard math coords: 210° is bottom-left, 330° is bottom-right
    return angle >= 150 && angle <= 330; // Approximate visible arc range
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // Adjust for padding (p-4 = 16px)
      const chartX = relX - 16;
      const chartY = relY - 16;

      setMousePos({ x: relX, y: relY });
      setShowTooltip(isOverGaugeArc(chartX, chartY));
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getOption = () => ({
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '65%'],
        radius: '90%',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [value / 100, color],
              [1, getColor('--color-border-subtle', '#f1f5f9')],
            ],
          },
        },
        pointer: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          show: false,
        },
      },
    ],
  });

  return (
    <div
      ref={containerRef}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <ReactECharts
          option={getOption()}
          style={{ height: '160px', width: '180px' }}
          opts={{ devicePixelRatio: window.devicePixelRatio }}
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
        <span className="text-[24px] leading-[28px] font-semibold text-[var(--color-text-default)]">
          {value}%
        </span>
        {used !== undefined && total !== undefined ? (
          <span className="text-[12px] text-[var(--color-text-subtle)]">
            {used}
            {unit}/{total}
            {unit}
          </span>
        ) : (
          <span className="text-[12px] text-[var(--color-text-subtle)]">{label}</span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && used !== undefined && total !== undefined && (
        <div
          className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
          style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-[1px]" style={{ backgroundColor: color }} />
            <span className="text-[11px] leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Used: {used}
              {unit} ({value}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-[1px] bg-[var(--color-border-subtle)]" />
            <span className="text-[11px] leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Available: {available.toFixed(1)}
              {unit} ({availablePercent}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Single Value Doughnut chart Demo (ECharts)
   ---------------------------------------- */

export function SingleValueDoughnutDemo({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: string;
}) {
  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return val || fallback;
    }
    return fallback;
  };

  const mainColor = color || getColor('--color-status-error', '#ef4444');
  const bgColor = getColor('--color-border-subtle', '#e2e8f0');

  const getOption = () => ({
    tooltip: {
      show: false,
    },
    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
    series: [
      {
        type: 'pie',
        radius: ['68%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        silent: true,
        itemStyle: {
          borderRadius: 0,
          borderWidth: 0,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
        },
        data: [
          { value: value, itemStyle: { color: mainColor } },
          { value: 100 - value, itemStyle: { color: bgColor } },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: `${value}%`,
          textAlign: 'center',
          textVerticalAlign: 'middle',
          fill: getColor('--color-text-default', '#0f172a'),
          fontSize: 18,
          fontWeight: 500,
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      },
    ],
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
      <h4 className="text-[13px] font-medium text-[var(--color-text-default)] mb-2">{title}</h4>
      <ReactECharts
        option={getOption()}
        style={{ height: '180px', width: '200px' }}
        opts={{ devicePixelRatio: window.devicePixelRatio }}
      />
    </div>
  );
}
