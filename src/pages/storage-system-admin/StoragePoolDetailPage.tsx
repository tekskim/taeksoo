import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import type { ECharts } from 'echarts';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  DetailHeader,
  MonitoringToolbar,
  PageShell,
  Badge,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { DataViewDrawer } from '@/components/DataViewDrawer';
import {
  IconDotsCircleHorizontal,
  IconArrowsMaximize,
  IconArrowsMinimize,
} from '@tabler/icons-react';
import { chartColors } from '@/pages/design-system-sections/ChartComponents';

function resolvedChartColor(cssVar: string, chartFallback: string): string {
  if (typeof window === 'undefined') return chartFallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return v || chartFallback;
}

/* ----------------------------------------
   Monitoring Time Controls Component
   ---------------------------------------- */

type TimePeriod = '30m' | '1h' | '6h' | '12h' | '24h';

const timeOptions: { label: string; value: TimePeriod }[] = [
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
];

// Icons for time controls
const CalendarIcon = () => (
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

const CloseIcon = () => (
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

const formatDateForDisplay = (date: Date | null) => {
  if (!date) return '';
  const month = MONTH_ABBR[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

interface MonitoringTimeControlsProps {
  onTimeRangeChange?: (value: string) => void;
  onRefresh?: () => void;
}

function MonitoringTimeControls({ onTimeRangeChange, onRefresh }: MonitoringTimeControlsProps) {
  const [timeRange, setTimeRange] = useState<TimePeriod>('30m');
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

  const handleTimeRangeClick = (value: TimePeriod) => {
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
      setTimeRange('30m'); // Reset time range
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

  const prevMonthNav = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  };

  const nextMonthNav = () => {
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
        <IconRefresh size={12} stroke={1.5} />
      </button>
    </div>
  );
}

/* ----------------------------------------
   Capacity Used Gauge Component (Half-Doughnut chart)
   Following design system pattern from DesignSystemPage
   ---------------------------------------- */

interface CapacityGaugeProps {
  percentage: number;
  used?: number;
  total?: number;
  unit?: string;
}

function CapacityGauge({ percentage, used, total, unit = 'TiB' }: CapacityGaugeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const gaugeRef = useRef<HTMLDivElement>(null);

  const chartWidth = 180;
  const chartHeight = 160;
  const centerX = chartWidth * 0.5;
  const centerY = chartHeight * 0.65;
  const radius = Math.min(chartWidth, chartHeight) * 0.45;
  const arcWidth = 14;
  const innerRadius = radius - arcWidth;
  const outerRadius = radius;

  const getColor = (cssVar: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      return value || fallback;
    }
    return fallback;
  };

  const statusColor = () => {
    if (percentage >= 90) return getColor('--color-state-danger', '#ef4444');
    if (percentage >= 70) return getColor('--color-state-warning', '#f97316');
    return getColor('--color-state-success', '#22c55e');
  };

  const usedColor = statusColor();
  const available = total !== undefined && used !== undefined ? total - used : 0;
  const availablePercent =
    total !== undefined && used !== undefined ? Math.round((available / total) * 100) : 0;

  const isOverGaugeArc = (mx: number, my: number) => {
    const dx = mx - centerX;
    const dy = my - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < innerRadius - 4 || distance > outerRadius + 4) return false;
    let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle <= 210 || angle >= 330;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gaugeRef.current) {
      const rect = gaugeRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      setMousePos({ x: relX, y: relY });
      setShowTooltip(isOverGaugeArc(relX, relY));
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
            width: 16,
            color: [
              [percentage / 100, usedColor],
              [1, getColor('--color-border-subtle', '#f1f5f9')],
            ],
          },
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: { show: false },
      },
    ],
  });

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 -mt-9">
      {/* Gauge */}
      <div
        ref={gaugeRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <ReactECharts option={getOption()} style={{ height: '200px', width: '220px' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
          <span className="text-heading-h3 leading-[28px] text-[var(--color-text-default)]">
            {percentage.toFixed(2)}%
          </span>
          {used !== undefined && total !== undefined && (
            <span className="text-body-md text-[var(--color-text-subtle)]">
              {used}
              {unit}/{total}
              {unit}
            </span>
          )}
        </div>

        {showTooltip && used !== undefined && total !== undefined && (
          <div
            className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-sm px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
            style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-[5px] h-[5px] rounded-[1px]"
                style={{ backgroundColor: usedColor }}
              />
              <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap">
                Used: {used} {unit} ({Math.round(percentage)}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[5px] h-[5px] rounded-[1px] bg-[var(--chart-color-neutral)]" />
              <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap">
                Available: {available.toFixed(1)} {unit} ({availablePercent}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center -mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: usedColor }} />
          <span className="text-body-sm text-[var(--color-text-muted)]">
            Used: {used !== undefined ? `${used}${unit}` : '-'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm shrink-0 bg-[var(--color-state-warning)]" />
          <span className="text-body-sm text-[var(--color-text-muted)]">Warning: 70%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm shrink-0 bg-[var(--color-state-danger)]" />
          <span className="text-body-sm text-[var(--color-text-muted)]">Danger: 90%</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Time Till Full Component
   ---------------------------------------- */

interface TimeTillFullProps {
  value: number;
  unit: string;
}

function TimeTillFull({ value, unit }: TimeTillFullProps) {
  return (
    <div className="h-[200px] flex items-center justify-center">
      <div className="flex items-baseline gap-2">
        <span className="text-heading-h1" style={{ color: chartColors.emerald400 }}>
          {value}
        </span>
        <span className="text-heading-h4" style={{ color: chartColors.emerald400 }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Performance Line Chart Component (Design system)
   Uses CSS classes from index.css: chartCard, chartHeader, chartTitle, etc.
   ---------------------------------------- */

interface ChartSeries {
  name: string;
  data: number[];
  color: string;
}

interface PerformanceChartProps {
  title: string;
  series: ChartSeries[];
  timeLabels: string[];
  yAxisUnit?: string;
  isFullScreen?: boolean;
  onFullScreen?: () => void;
  onExitFullScreen?: () => void;
  timeControls?: React.ReactNode;
}

function PerformanceChart({
  title,
  series,
  timeLabels,
  yAxisUnit = '',
  isFullScreen = false,
  onFullScreen,
  onExitFullScreen,
  timeControls,
}: PerformanceChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(series.map((s) => [s.name, true]))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const chartRef = useRef<ReactECharts>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle chart ready - resize to fill container
  const handleChartReady = (chartInstance: ECharts) => {
    setTimeout(() => {
      try {
        chartInstance.resize();
      } catch {
        // Instance might be disposed
      }
    }, 100);
  };

  // Detect dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const allVisible = Object.values(visibleSeries).every((v) => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map((s) => [s.name, newState])));
  };

  const handleFullScreen = () => {
    setMenuOpen(false);
    if (onFullScreen) onFullScreen();
  };

  // Get theme-aware colors
  const splitLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.slate100;
  const splitLineOpacity = isDarkMode ? 1 : 0.5;
  const tooltipBg = resolvedChartColor('--color-surface-default', '#ffffff');
  const tooltipBorder = resolvedChartColor('--color-border-default', chartColors.slate100);
  const tooltipTextColor = resolvedChartColor('--color-text-default', chartColors.slate800);

  // Calculate max value for exactly 5 Y-axis labels (4 intervals) with nice numbers
  const allData = series.filter((s) => visibleSeries[s.name]).flatMap((s) => s.data);
  const dataMax = Math.max(...allData, 0);

  // Calculate nice interval based on data magnitude
  const rawInterval = dataMax / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval || 1)));
  const normalizedInterval = rawInterval / magnitude;

  // Round UP to nice number to ensure interval covers data: 1, 2, 2.5, 5, 10
  let niceNormalizedInterval;
  if (normalizedInterval <= 1) niceNormalizedInterval = 1;
  else if (normalizedInterval <= 2) niceNormalizedInterval = 2;
  else if (normalizedInterval <= 2.5) niceNormalizedInterval = 2.5;
  else if (normalizedInterval <= 5) niceNormalizedInterval = 5;
  else niceNormalizedInterval = 10;

  const niceInterval = niceNormalizedInterval * magnitude;
  const niceMax = niceInterval * 4; // Always exactly 4 intervals = 5 labels

  const option = {
    animation: false,
    grid: {
      left: '40px',
      right: '16px',
      top: '20px',
      bottom: '16px',
      containLabel: false,
    },
    xAxis: {
      type: 'category' as const,
      data: timeLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
      },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax || 1,
      interval: niceInterval || 0.25,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: splitLineColor, opacity: splitLineOpacity },
      },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: (v: number) => `${v}${yAxisUnit}`,
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: {
        color: tooltipTextColor,
        fontSize: 11,
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      },
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
        return `<div style="font-size: 11px; font-family: Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
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
        <div className="chartWrapper" ref={wrapperRef}>
          <ReactECharts
            key={isFullScreen ? 'fullscreen' : 'normal'}
            ref={chartRef}
            option={option}
            style={{
              height: isFullScreen ? 'calc(100vh - 200px)' : '100%',
              width: isFullScreen ? 'calc(100vw - 300px)' : '100%',
            }}
            notMerge={true}
            onChartReady={handleChartReady}
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
  series: ChartSeries[];
  timeLabels: string[];
  yAxisUnit?: string;
}

// ChartWithFullScreen Wrapper Component
function ChartWithFullScreen({
  title,
  series,
  timeLabels,
  yAxisUnit = '',
}: {
  title: string;
  series: ChartSeries[];
  timeLabels: string[];
  yAxisUnit?: string;
}) {
  const [fullScreenChart, setFullScreenChart] = useState<FullScreenChartData | null>(null);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const [containerReady, setContainerReady] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullScreenChart) {
        setFullScreenChart(null);
        setContainerReady(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullScreenChart]);

  // Wait for container to be ready before rendering chart
  useEffect(() => {
    if (fullScreenChart && fullScreenContainerRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContainerReady(true);
        });
      });
    } else {
      setContainerReady(false);
    }
  }, [fullScreenChart]);

  return (
    <>
      <PerformanceChart
        title={title}
        series={series}
        timeLabels={timeLabels}
        yAxisUnit={yAxisUnit}
        onFullScreen={() => setFullScreenChart({ title, series, timeLabels, yAxisUnit })}
      />

      {fullScreenChart && (
        <>
          <div
            className="fullScreenOverlay"
            onClick={() => {
              setFullScreenChart(null);
              setContainerReady(false);
            }}
          />
          <div className="fullScreenFloating" ref={fullScreenContainerRef}>
            {containerReady && (
              <PerformanceChart
                title={fullScreenChart.title}
                series={fullScreenChart.series}
                timeLabels={fullScreenChart.timeLabels}
                yAxisUnit={fullScreenChart.yAxisUnit}
                isFullScreen={true}
                onExitFullScreen={() => {
                  setFullScreenChart(null);
                  setContainerReady(false);
                }}
                timeControls={<MonitoringToolbar />}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface StoragePoolDetail {
  id: string;
  name: string;
  domain: string;
  dataProtection: string;
  applications: string;
  pgStatus: string;
  crushRuleset: string;
  // Basic information
  applicationMetadata: string;
  auid: string;
  createTime: string;
  crushRule: string;
  erasureCodeProfile: string;
  expectedNumObjects: number;
  minSize: number;
  pgAutoscaleMode: string;
  pgNum: number;
  pgPlacementNum: number;
  pool: number;
  poolName: string;
  quotaMaxBytes: string;
  quotaMaxObjects: number;
  size: number;
  type: string;
  usage: string;
  description: string;
  // Pool flags & limits
  fastRead: boolean;
  flags: string;
  flagsNames: string;
  // Cache & Tiering
  cacheMinEvictAge: string;
  cacheMinFlushAge: string;
  cacheMode: string;
  cacheTargetDirtyHighRatioMicro: string;
  cacheTargetDirtyRatioMicro: string;
  cacheTargetFullRatioMicro: string;
  hitSetCount: string;
  hitSetGradeDecayRate: string;
  hitSetParamsType: string;
  hitSetPeriod: string;
  hitSetSearchLastN: string;
  isStretchPool: boolean;
  minReadRecencyForPromote: string;
  minWriteRecencyForPromote: string;
  readTier: string;
  targetMaxBytes: string;
  targetMaxObjects: string;
  tierOf: string;
  tiers: string;
  useGmtHitset: string;
  writeTier: string;
  // Load balancing
  readBalanceAvgPrimaryAffinity: number;
  readBalanceAvgPrimaryAffinityWeighted: string;
  readBalanceOptimalScore: number;
  readBalancePrimaryAffinityWeighted: string;
  readBalanceRawScoreActing: string;
  readBalanceRawScoreStable: string;
  readBalanceScoreActing: string;
  readBalanceScoreStable: string;
  readBalanceScoreType: string;
  // Snapshots & history
  poolSnaps: number;
  removedSnaps: string;
  snapEpoch: string;
  snapMode: string;
  snapSeq: string;
  // PG & data placement
  objectHash: string;
  optionsPgNumMax: number;
  optionsPgNumMin: number;
  peeringCrushBucketBarrier: string;
  peeringCrushBucketCount: number;
  peeringCrushBucketMandatoryMember: string;
  peeringCrushBucketTarget: string;
  pgNumPending: number;
  pgNumTarget: number;
  pgPlacementNumTarget: number;
  stripeWidth: number;
  // Advanced
  gradeTable: string;
  lastChange: string;
  lastForceOpResend: string;
  lastForceOpResendPreluminous: string;
  lastForceOpResendPrenautilus: string;
  lastPgMergeMetaLastEpochClean: string;
  lastPgMergeMetaLastEpochStarted: string;
  lastPgMergeMetaReadyEpoch: string;
  lastPgMergeMetaSourcePgid: string;
  lastPgMergeMetaSourceVersion: string;
  lastPgMergeMetaTargetVersion: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockStoragePoolDetail: StoragePoolDetail = {
  id: 'pool-001',
  name: 'tk-test',
  domain: 'domain-a',
  dataProtection: 'replica: ×3',
  applications: 'rbd',
  pgStatus: '128 active+clean',
  crushRuleset: 'rule_nvme',
  // Basic information
  applicationMetadata: 'rbd',
  auid: '-',
  createTime: 'Jan 15, 2025 10:30:00',
  crushRule: 'rule_nvme',
  erasureCodeProfile: '-',
  expectedNumObjects: 1024,
  minSize: 2,
  pgAutoscaleMode: 'on',
  pgNum: 128,
  pgPlacementNum: 128,
  pool: 12,
  poolName: 'tk-test',
  quotaMaxBytes: 'unlimited',
  quotaMaxObjects: 0,
  size: 3,
  type: 'replicated',
  usage: '46.2%',
  description: '-',
  // Pool flags & limits
  fastRead: true,
  flags: 'hashpspool,nodelete',
  flagsNames: '-',
  // Cache & Tiering
  cacheMinEvictAge: '-',
  cacheMinFlushAge: '-',
  cacheMode: 'none',
  cacheTargetDirtyHighRatioMicro: '-',
  cacheTargetDirtyRatioMicro: '-',
  cacheTargetFullRatioMicro: '-',
  hitSetCount: '-',
  hitSetGradeDecayRate: '-',
  hitSetParamsType: '-',
  hitSetPeriod: '-',
  hitSetSearchLastN: '-',
  isStretchPool: false,
  minReadRecencyForPromote: '-',
  minWriteRecencyForPromote: '-',
  readTier: '-',
  targetMaxBytes: '-',
  targetMaxObjects: '-',
  tierOf: '-',
  tiers: '-',
  useGmtHitset: '-',
  writeTier: '-',
  // Load balancing
  readBalanceAvgPrimaryAffinity: 0.82,
  readBalanceAvgPrimaryAffinityWeighted: '-',
  readBalanceOptimalScore: 0.88,
  readBalancePrimaryAffinityWeighted: '-',
  readBalanceRawScoreActing: '-',
  readBalanceRawScoreStable: '-',
  readBalanceScoreActing: '-',
  readBalanceScoreStable: '-',
  readBalanceScoreType: 'by_pg',
  // Snapshots & history
  poolSnaps: 0,
  removedSnaps: '-',
  snapEpoch: '-',
  snapMode: 'self-managed',
  snapSeq: '-',
  // PG & data placement
  objectHash: 'jenkins',
  optionsPgNumMax: 512,
  optionsPgNumMin: 32,
  peeringCrushBucketBarrier: '-',
  peeringCrushBucketCount: 3,
  peeringCrushBucketMandatoryMember: '-',
  peeringCrushBucketTarget: '-',
  pgNumPending: 0,
  pgNumTarget: 128,
  pgPlacementNumTarget: 128,
  stripeWidth: 4096,
  // Advanced
  gradeTable: '-',
  lastChange: '2025-03-01 08:00:00',
  lastForceOpResend: '-',
  lastForceOpResendPreluminous: '-',
  lastForceOpResendPrenautilus: '-',
  lastPgMergeMetaLastEpochClean: '-',
  lastPgMergeMetaLastEpochStarted: '-',
  lastPgMergeMetaReadyEpoch: '-',
  lastPgMergeMetaSourcePgid: '-',
  lastPgMergeMetaSourceVersion: '-',
  lastPgMergeMetaTargetVersion: '-',
};

/* ----------------------------------------
   StoragePoolDetailPage Component
   ---------------------------------------- */

export function StoragePoolDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Time labels for charts
  const timeLabels = ['16:00', '16:10', '16:20', '16:30', '16:40', '16:50'];

  // In a real app, fetch based on id
  const pool = mockStoragePoolDetail;

  // Update tab label to match the pool name (most recent breadcrumb)
  useEffect(() => {
    if (pool?.name) {
      updateActiveTabLabel(pool.name);
    }
  }, [pool?.name, updateActiveTabLabel]);

  const breadcrumbItems = [{ label: 'Pools', href: '/storage/pools' }, { label: pool.name }];

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={
        <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Pool Header Card */}
        <DetailHeader>
          <DetailHeader.Title>
            {pool.domain} - {pool.name}
          </DetailHeader.Title>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Domain" value={pool.domain} copyable />
            <DetailHeader.InfoCard label="Data Protection" value={pool.dataProtection} />
            <DetailHeader.InfoCard label="Applications" value={pool.applications} copyable />
            <DetailHeader.InfoCard
              label="PG Status"
              value={
                <Badge theme="white" size="sm">
                  {pool.pgStatus}
                </Badge>
              }
            />
            <DetailHeader.InfoCard label="Crush Ruleset" value={pool.crushRuleset} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="performance">Performance</Tab>
            </TabList>

            {/* Details Tab */}
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic information */}
                <SectionCard>
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Application metadata"
                      value={pool.applicationMetadata}
                    />
                    <SectionCard.DataRow label="Auid" value={pool.auid} />
                    <SectionCard.DataRow label="Create time" value={pool.createTime} />
                    <SectionCard.DataRow label="Crush rule" value={pool.crushRule} />
                    <SectionCard.DataRow label="Data protection" value={pool.dataProtection} />
                    <SectionCard.DataRow
                      label="Erasure code profile"
                      value={pool.erasureCodeProfile}
                    />
                    <SectionCard.DataRow
                      label="Expected num objects"
                      value={String(pool.expectedNumObjects)}
                    />
                    <SectionCard.DataRow label="Min size" value={String(pool.minSize)} />
                    <SectionCard.DataRow label="PG autoscale mode" value={pool.pgAutoscaleMode} />
                    <SectionCard.DataRow label="PG num" value={String(pool.pgNum)} />
                    <SectionCard.DataRow
                      label="PG placement num"
                      value={String(pool.pgPlacementNum)}
                    />
                    <SectionCard.DataRow label="PG status" value={pool.pgStatus} />
                    <SectionCard.DataRow label="Pool" value={String(pool.pool)} />
                    <SectionCard.DataRow label="Pool name" value={pool.poolName} />
                    <SectionCard.DataRow label="Quota max bytes" value={pool.quotaMaxBytes} />
                    <SectionCard.DataRow
                      label="Quota max objects"
                      value={String(pool.quotaMaxObjects)}
                    />
                    <SectionCard.DataRow label="Size" value={String(pool.size)} />
                    <SectionCard.DataRow label="Type" value={pool.type} />
                    <SectionCard.DataRow label="Usage" value={pool.usage} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Cache & tiering */}
                <SectionCard>
                  <SectionCard.Header title="Cache & tiering" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Cache min evict age"
                      value={pool.cacheMinEvictAge}
                    />
                    <SectionCard.DataRow
                      label="Cache min flush age"
                      value={pool.cacheMinFlushAge}
                    />
                    <SectionCard.DataRow label="Cache mode" value={pool.cacheMode} />
                    <SectionCard.DataRow
                      label="Cache target dirty high ratio micro"
                      value={pool.cacheTargetDirtyHighRatioMicro}
                    />
                    <SectionCard.DataRow
                      label="Cache target dirty ratio micro"
                      value={pool.cacheTargetDirtyRatioMicro}
                    />
                    <SectionCard.DataRow
                      label="Cache target full ratio micro"
                      value={pool.cacheTargetFullRatioMicro}
                    />
                    <SectionCard.DataRow label="Hit set count" value={pool.hitSetCount} />
                    <SectionCard.DataRow
                      label="Hit set grade decay rate"
                      value={pool.hitSetGradeDecayRate}
                    />
                    <SectionCard.DataRow
                      label="Hit set params type"
                      value={pool.hitSetParamsType}
                    />
                    <SectionCard.DataRow label="Hit set period" value={pool.hitSetPeriod} />
                    <SectionCard.DataRow
                      label="Hit set search last n"
                      value={pool.hitSetSearchLastN}
                    />
                    <SectionCard.DataRow
                      label="Is stretch pool"
                      value={String(pool.isStretchPool)}
                    />
                    <SectionCard.DataRow
                      label="Min read recency for promote"
                      value={pool.minReadRecencyForPromote}
                    />
                    <SectionCard.DataRow
                      label="Min write recency for promote"
                      value={pool.minWriteRecencyForPromote}
                    />
                    <SectionCard.DataRow label="Read tier" value={pool.readTier} />
                    <SectionCard.DataRow label="Target max bytes" value={pool.targetMaxBytes} />
                    <SectionCard.DataRow label="Target max objects" value={pool.targetMaxObjects} />
                    <SectionCard.DataRow label="Tier of" value={pool.tierOf} />
                    <SectionCard.DataRow label="Tiers" value={pool.tiers} />
                    <SectionCard.DataRow label="Use gmt hitset" value={pool.useGmtHitset} />
                    <SectionCard.DataRow label="Write tier" value={pool.writeTier} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Pool flags & limits */}
                <SectionCard>
                  <SectionCard.Header title="Pool flags & limits" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Fast read" value={String(pool.fastRead)} />
                    <SectionCard.DataRow label="Flags" value={pool.flags} />
                    <SectionCard.DataRow label="Flags names" value={pool.flagsNames} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Load balancing */}
                <SectionCard>
                  <SectionCard.Header title="Load balancing" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Read balance average primary affinity"
                      value={String(pool.readBalanceAvgPrimaryAffinity)}
                    />
                    <SectionCard.DataRow
                      label="Read balance average primary affinity weighted"
                      value={pool.readBalanceAvgPrimaryAffinityWeighted}
                    />
                    <SectionCard.DataRow
                      label="Read balance optimal score"
                      value={String(pool.readBalanceOptimalScore)}
                    />
                    <SectionCard.DataRow
                      label="Read balance primary affinity weighted"
                      value={pool.readBalancePrimaryAffinityWeighted}
                    />
                    <SectionCard.DataRow
                      label="Read balance raw score acting"
                      value={pool.readBalanceRawScoreActing}
                    />
                    <SectionCard.DataRow
                      label="Read balance raw score stable"
                      value={pool.readBalanceRawScoreStable}
                    />
                    <SectionCard.DataRow
                      label="Read balance score acting"
                      value={pool.readBalanceScoreActing}
                    />
                    <SectionCard.DataRow
                      label="Read balance score stable"
                      value={pool.readBalanceScoreStable}
                    />
                    <SectionCard.DataRow
                      label="Read balance score type"
                      value={pool.readBalanceScoreType}
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Snapshots & history */}
                <SectionCard>
                  <SectionCard.Header title="Snapshots & history" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Pool snaps" value={String(pool.poolSnaps)} />
                    <SectionCard.DataRow label="Removed snaps" value={pool.removedSnaps} />
                    <SectionCard.DataRow label="Snap epoch" value={pool.snapEpoch} />
                    <SectionCard.DataRow label="Snap mode" value={pool.snapMode} />
                    <SectionCard.DataRow label="Snap seq" value={pool.snapSeq} />
                  </SectionCard.Content>
                </SectionCard>

                {/* PG & data placement */}
                <SectionCard>
                  <SectionCard.Header title="PG & data placement" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Object hash" value={pool.objectHash} />
                    <SectionCard.DataRow
                      label="Options PG num max"
                      value={String(pool.optionsPgNumMax)}
                    />
                    <SectionCard.DataRow
                      label="Options PG num min"
                      value={String(pool.optionsPgNumMin)}
                    />
                    <SectionCard.DataRow
                      label="Peering crush bucket barrier"
                      value={pool.peeringCrushBucketBarrier}
                    />
                    <SectionCard.DataRow
                      label="Peering crush bucket count"
                      value={String(pool.peeringCrushBucketCount)}
                    />
                    <SectionCard.DataRow
                      label="Peering crush bucket mandatory member"
                      value={pool.peeringCrushBucketMandatoryMember}
                    />
                    <SectionCard.DataRow
                      label="Peering crush bucket target"
                      value={pool.peeringCrushBucketTarget}
                    />
                    <SectionCard.DataRow label="PG num pending" value={String(pool.pgNumPending)} />
                    <SectionCard.DataRow label="PG num target" value={String(pool.pgNumTarget)} />
                    <SectionCard.DataRow
                      label="PG placement num target"
                      value={String(pool.pgPlacementNumTarget)}
                    />
                    <SectionCard.DataRow label="Stripe width" value={String(pool.stripeWidth)} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Advanced */}
                <SectionCard>
                  <SectionCard.Header title="Advanced" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Grade table" value={pool.gradeTable} />
                    <SectionCard.DataRow label="Last change" value={pool.lastChange} />
                    <SectionCard.DataRow
                      label="Last force op resend"
                      value={pool.lastForceOpResend}
                    />
                    <SectionCard.DataRow
                      label="Last force op resend preluminous"
                      value={pool.lastForceOpResendPreluminous}
                    />
                    <SectionCard.DataRow
                      label="Last force op resend prenautilus"
                      value={pool.lastForceOpResendPrenautilus}
                    />
                    <SectionCard.DataRow
                      label="Last PG merge meta last epoch clean"
                      value={pool.lastPgMergeMetaLastEpochClean}
                    />
                    <SectionCard.DataRow
                      label="Last PG merge meta last epoch started"
                      value={pool.lastPgMergeMetaLastEpochStarted}
                    />
                    <SectionCard.DataRow
                      label="Last PG merge meta ready epoch"
                      value={pool.lastPgMergeMetaReadyEpoch}
                    />
                    <SectionCard.DataRow
                      label="Last PG merge meta source pgid"
                      value={pool.lastPgMergeMetaSourcePgid}
                    />
                    <SectionCard.DataRow
                      label="Last PG merge meta source version"
                      value={pool.lastPgMergeMetaSourceVersion}
                    />
                    <SectionCard.DataRow
                      label="Last PG merge meta target version"
                      value={pool.lastPgMergeMetaTargetVersion}
                    />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Performance Tab */}
            <TabPanel value="performance" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Monitoring Time Controls */}
                <div className="flex justify-start w-full">
                  <MonitoringToolbar
                    onTimeRangeChange={(value) => console.log('Time range changed:', value)}
                    onRefresh={() => console.log('Refresh clicked')}
                  />
                </div>

                {/* Top Row - Capacity & Time Till Full */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Capacity Used */}
                  <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                    <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-4">
                      Capacity used
                    </h4>
                    <CapacityGauge percentage={88.2} used={167.6} total={190.0} unit="TiB" />
                  </div>
                  {/* Time Till Full */}
                  <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                    <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-4">
                      Time till full
                    </h4>
                    <TimeTillFull value={12.3} unit="weeks" />
                  </div>
                </div>

                {/* Performance Charts Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Object Ingress/Egress */}
                  <ChartWithFullScreen
                    title="Object ingress/egress"
                    series={[
                      {
                        name: 'Objects per second',
                        data: [0.15, 0.25, 0.35, 0.3, 0.2, 0.4],
                        color: chartColors.emerald400,
                      },
                    ]}
                    timeLabels={timeLabels}
                    yAxisUnit=""
                  />
                  {/* Client IOPS */}
                  <ChartWithFullScreen
                    title="Client IOPS"
                    series={[
                      {
                        name: 'reads',
                        data: [200, 350, 500, 450, 300, 600],
                        color: chartColors.blue400,
                      },
                      {
                        name: 'writes',
                        data: [100, 200, 300, 250, 150, 350],
                        color: chartColors.emerald400,
                      },
                    ]}
                    timeLabels={timeLabels}
                    yAxisUnit=""
                  />
                  {/* Client Throughput */}
                  <ChartWithFullScreen
                    title="Client throughput"
                    series={[
                      {
                        name: 'reads',
                        data: [80, 100, 120, 110, 90, 130],
                        color: chartColors.blue400,
                      },
                      {
                        name: 'writes',
                        data: [60, 80, 100, 90, 70, 110],
                        color: chartColors.emerald400,
                      },
                    ]}
                    timeLabels={timeLabels}
                    yAxisUnit=""
                  />
                  {/* Objects */}
                  <ChartWithFullScreen
                    title="Objects"
                    series={[
                      {
                        name: 'Number of Objects',
                        data: [2.9, 2.905, 2.91, 2.915, 2.92, 2.96],
                        color: chartColors.emerald400,
                      },
                    ]}
                    timeLabels={timeLabels}
                    yAxisUnit=""
                  />
                </div>
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default StoragePoolDetailPage;
