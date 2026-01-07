import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import type { ECharts } from 'echarts';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  DetailHeader,
  Chip,
  Table,
  StatusIndicator,
  SearchInput,
  Pagination,
  DatePicker,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { DataViewDrawer } from '@/components/DataViewDrawer';
import {
  IconBell,
  IconRefresh,
  IconChevronLeft,
  IconChevronRight,
  IconDotsCircleHorizontal,
  IconArrowsMaximize,
  IconArrowsMinimize,
} from '@tabler/icons-react';

/* ----------------------------------------
   Custom Identify Icon
   ---------------------------------------- */

interface IdentifyIconProps {
  size?: number;
  className?: string;
}

function IdentifyIcon({ size = 16, className }: IdentifyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.66699 12.0003V8.00033C4.66699 7.11627 5.01818 6.26842 5.6433 5.6433C6.26842 5.01818 7.11627 4.66699 8.00033 4.66699C8.88438 4.66699 9.73223 5.01818 10.3573 5.6433C10.9825 6.26842 11.3337 7.11627 11.3337 8.00033V12.0003"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33301 14C3.33301 14.1768 3.40325 14.3464 3.52827 14.4714C3.65329 14.5964 3.82286 14.6667 3.99967 14.6667H11.9997C12.1765 14.6667 12.3461 14.5964 12.4711 14.4714C12.5961 14.3464 12.6663 14.1768 12.6663 14V13.3333C12.6663 12.9797 12.5259 12.6406 12.2758 12.3905C12.0258 12.1405 11.6866 12 11.333 12H4.66634C4.31272 12 3.97358 12.1405 3.72353 12.3905C3.47348 12.6406 3.33301 12.9797 3.33301 13.3333V14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.333 8H13.9997" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.3333 3L12 3.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.33301 8H1.99967" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 1.33301V1.99967" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.28613 3.28613L3.75747 3.75747" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ----------------------------------------
   Chart Colors
   ---------------------------------------- */

const chartColors = {
  blue500: '#3b82f6',
  cyan400: '#22d3ee',
  emerald400: '#34d399',
  emerald500: '#10b981',
  amber400: '#fbbf24',
  violet400: '#a78bfa',
  red500: '#dc2626',
  green500: '#00a63e',
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate800: '#1e293b',
};

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

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const formatDateForDisplay = (date: Date | null) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
};

interface HostMonitoringTimeControlsProps {
  onTimeRangeChange?: (value: string) => void;
  onRefresh?: () => void;
}

function HostMonitoringTimeControls({ onTimeRangeChange, onRefresh }: HostMonitoringTimeControlsProps) {
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
      setTimeRange('30m');
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
        isToday: false
      });
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: d.toDateString() === today.toDateString()
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
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
        {timeOptions.map(option => (
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

            {/* DatePicker from Design System */}
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
              <button className="calendarCancel" onClick={() => setShowDatePicker(false)}>Cancel</button>
              <button className="calendarApply" onClick={handleApplyCustomPeriod}>Apply</button>
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

/* ----------------------------------------
   Performance Chart Component
   ---------------------------------------- */

interface ChartSeries {
  name: string;
  data: number[];
  color: string;
}

interface HostPerformanceChartProps {
  title: string;
  series: ChartSeries[];
  timeLabels: string[];
  yAxisUnit?: string;
  isFullScreen?: boolean;
  onFullScreen?: () => void;
  onExitFullScreen?: () => void;
  timeControls?: React.ReactNode;
}

function HostPerformanceChart({
  title,
  series,
  timeLabels,
  yAxisUnit = '',
  isFullScreen = false,
  onFullScreen,
  onExitFullScreen,
  timeControls,
}: HostPerformanceChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(series.map(s => [s.name, true]))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const chartRef = useRef<ReactECharts>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleChartReady = (chartInstance: ECharts) => {
    setTimeout(() => {
      try {
        chartInstance.resize();
      } catch {
        // Instance might be disposed
      }
    }, 100);
  };

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const allVisible = Object.values(visibleSeries).every(v => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map(s => [s.name, newState])));
  };

  const handleFullScreen = () => {
    setMenuOpen(false);
    if (onFullScreen) onFullScreen();
  };

  const splitLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.slate100;
  const splitLineOpacity = isDarkMode ? 1 : 0.5;
  const tooltipBg = isDarkMode ? '#1C1C1C' : 'white';
  const tooltipBorder = isDarkMode ? '#3a3a3a' : '#e2e8f0';
  const tooltipTextColor = isDarkMode ? '#e5e5e5' : chartColors.slate800;

  const allData = series.filter(s => visibleSeries[s.name]).flatMap(s => s.data);
  const dataMax = Math.max(...allData, 0);
  const rawInterval = dataMax / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval || 1)));
  const normalizedInterval = rawInterval / magnitude;
  
  let niceNormalizedInterval;
  if (normalizedInterval <= 1) niceNormalizedInterval = 1;
  else if (normalizedInterval <= 2) niceNormalizedInterval = 2;
  else if (normalizedInterval <= 2.5) niceNormalizedInterval = 2.5;
  else if (normalizedInterval <= 5) niceNormalizedInterval = 5;
  else niceNormalizedInterval = 10;
  
  const niceInterval = niceNormalizedInterval * magnitude;
  const niceMax = niceInterval * 4;

  const option = {
    animation: false,
    grid: {
      left: '40px',
      right: '16px',
      top: '20px',
      bottom: '16px',
      containLabel: false
    },
    xAxis: {
      type: 'category' as const,
      data: timeLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: chartColors.slate400, fontSize: 10, padding: [0, 0, 0, 15] },
      boundaryGap: false
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax || undefined,
      interval: niceInterval || undefined,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: splitLineColor, opacity: splitLineOpacity } },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: (value: number) => `${value}${yAxisUnit}`
      }
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { 
        color: tooltipTextColor, 
        fontSize: 11, 
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif' 
      }
    },
    series: series
      .filter(s => visibleSeries[s.name])
      .map(s => ({
        name: s.name,
        type: 'line' as const,
        data: s.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { color: s.color, width: 1 },
        itemStyle: { color: s.color },
        areaStyle: { color: s.color, opacity: 0.1 }
      }))
  };

  return (
    <>
      <div className={`chartCard ${isFullScreen ? 'chartCardFullScreen' : ''}`}>
        {/* Header */}
        <div className="chartHeader">
          <span className="chartTitle">{title}</span>
          {isFullScreen && timeControls && (
            <div className="chartHeaderCenter">{timeControls}</div>
          )}
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
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
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
                  <button className="contextMenuItemLast" onClick={() => { setMenuOpen(false); setShowDataView(true); }}>
                    Data View
                  </button>
                </div>
              )}
            </div>
            
            {/* Expand/Minimize Button */}
            <button 
              className="expandTrigger" 
              title={isFullScreen ? "Minimize" : "Expand"}
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
                width: isFullScreen ? 'calc(100vw - 300px)' : '100%'
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
                onClick={() => setVisibleSeries(prev => ({ ...prev, [s.name]: !prev[s.name] }))}
              >
                <div className="legendDot" style={{ backgroundColor: s.color }} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
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
    </>
  );
}

/* ----------------------------------------
   Chart with Full Screen Wrapper
   ---------------------------------------- */

interface FullScreenChartData {
  title: string;
  series: ChartSeries[];
  timeLabels: string[];
  yAxisUnit?: string;
}

function HostChartWithFullScreen({
  title,
  series,
  timeLabels,
  yAxisUnit = ''
}: {
  title: string;
  series: ChartSeries[];
  timeLabels: string[];
  yAxisUnit?: string;
}) {
  const [fullScreenChart, setFullScreenChart] = useState<FullScreenChartData | null>(null);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const [containerReady, setContainerReady] = useState(false);

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
      <HostPerformanceChart
        title={title}
        series={series}
        timeLabels={timeLabels}
        yAxisUnit={yAxisUnit}
        onFullScreen={() => setFullScreenChart({ title, series, timeLabels, yAxisUnit })}
      />
      
      {fullScreenChart && (
        <>
          <div className="fullScreenOverlay" onClick={() => { setFullScreenChart(null); setContainerReady(false); }} />
          <div className="fullScreenFloating" ref={fullScreenContainerRef}>
            {containerReady && (
              <HostPerformanceChart
                title={fullScreenChart.title}
                series={fullScreenChart.series}
                timeLabels={fullScreenChart.timeLabels}
                yAxisUnit={fullScreenChart.yAxisUnit}
                isFullScreen={true}
                onExitFullScreen={() => { setFullScreenChart(null); setContainerReady(false); }}
                timeControls={<HostMonitoringTimeControls />}
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

interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  daemons: string[];
}

interface PhysicalDisk {
  id: string;
  devicePath: string;
  type: 'HDD' | 'SSD' | 'NVMe';
  available: boolean;
  vendor: string;
  model: string;
  size: string;
  osd: string;
  identifyTimer?: number | null;
}

interface Daemon {
  id: string;
  status: 'running' | 'stopped' | 'error';
  daemonName: string;
  version: string;
  lastRefreshed: string;
  cpuUsage: number;
  cpuStatus?: string;
  memoryUsage: string;
  daemonEvents: string;
}

interface DeviceHealth {
  id: string;
  device: string;
  serialId: string;
  smartctlOutput: string;
  smartStatus: 'passed' | 'failed' | 'loading' | 'unavailable';
}

interface HostDetail {
  id: string;
  hostname: string;
  status: 'active' | 'maintenance' | 'down';
  labels: string[];
  model: string;
  modelDetail: string;
  serviceInstances: string[];
  cpus: number;
  cores: number;
  totalMemory: string;
  rawCapacity: string;
  osds: number;
  hdds: number;
  flash: number;
  nics: number;
  devices: Device[];
  physicalDisks: PhysicalDisk[];
  daemons: Daemon[];
  deviceHealth: DeviceHealth[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockHostData: Record<string, HostDetail> = {
  'host-001': {
    id: 'host-001',
    hostname: 'bzfv0rv1-cephadm-cl01',
    status: 'active',
    labels: [],
    model: 'ThinkSystem',
    modelDetail: 'ThinkSystem SR665 V3',
    serviceInstances: ['node-exporter.1', 'osd.6', 'nfs.1'],
    cpus: 1,
    cores: 16,
    totalMemory: '93.9 GiB',
    rawCapacity: '11.6 TiB',
    osds: 24,
    hdds: 4,
    flash: 1,
    nics: 4,
    devices: [
      { id: 'dev-1', deviceId: '9350-16i_LOGICAL_VOLUME_L9HF55E012A', deviceName: 'sda', daemons: ['osd.5', 'osd.4', 'osd.6'] },
      { id: 'dev-2', deviceId: '9350-16i_LOGICAL_VOLUME_L9HF55E012A', deviceName: 'sdc', daemons: ['osd.5', 'osd.4', 'osd.6'] },
      { id: 'dev-3', deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ', deviceName: 'sda', daemons: ['osd.5', 'osd.4', 'osd.6'] },
      { id: 'dev-4', deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ', deviceName: 'sdc', daemons: ['osd.5', 'osd.6'] },
      { id: 'dev-5', deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ', deviceName: 'sdd', daemons: ['osd.5'] },
    ],
    physicalDisks: [
      { id: 'disk-1', devicePath: '/dev/sda', type: 'SSD', available: false, vendor: '', model: 'KIOXIA KCD8DPUG3T20', size: '2.9 TiB', osd: 'osd.2', identifyTimer: null },
      { id: 'disk-2', devicePath: '/dev/sdb', type: 'SSD', available: false, vendor: '', model: 'KIOXIA KCD8DPUG3T20', size: '2.9 TiB', osd: 'osd.3', identifyTimer: null },
      { id: 'disk-3', devicePath: '/dev/sdc', type: 'SSD', available: false, vendor: '', model: 'KIOXIA KCD8DPUG3T20', size: '2.9 TiB', osd: 'osd.4', identifyTimer: null },
      { id: 'disk-4', devicePath: '/dev/sdd', type: 'SSD', available: false, vendor: '', model: 'KIOXIA KCD8DPUG3T20', size: '2.9 TiB', osd: 'osd.5', identifyTimer: null },
    ],
    daemons: [
      { id: 'daemon-1', status: 'running', daemonName: 'mon.bdv2kr1-cephobj02', version: '19.2.3', lastRefreshed: '5 minutes ago', cpuUsage: 88.17, cpuStatus: 'chunking', memoryUsage: '18.4 GiB', daemonEvents: 'A month ago - daemon:mds.cephfs-test.bdv2kr1-cephobj02.lrphgq' },
      { id: 'daemon-2', status: 'running', daemonName: 'mon.bdv2kr1-cephobj02', version: '19.2.3', lastRefreshed: '5 minutes ago', cpuUsage: 0, cpuStatus: 'chunking', memoryUsage: '3.5 GiB', daemonEvents: 'No data available' },
      { id: 'daemon-3', status: 'running', daemonName: 'mon.bdv2kr1-cephobj02', version: '19.2.3', lastRefreshed: '5 minutes ago', cpuUsage: 0, cpuStatus: 'chunking', memoryUsage: '3.5 GiB', daemonEvents: 'No data available' },
    ],
    deviceHealth: [
      { id: 'dh-1', device: '/dev/sdf', serialId: 'L9HF55E012A', smartStatus: 'passed', smartctlOutput: `"smartctl_output": [
            "smartctl 7.2 2020-12-30 r5155 [x86_64-linux-6.8.0-79-generic] (local build)",
            "Copyright (C) 2002-20, Bruce Allen, Christian Franke, www.smartmontools.org",
            "",
            "=== START OF INFORMATION SECTION ===",
            "Model Number:                       KIOXIA KCD8DPUG3T20",
            "Serial Number:                      9ET0A01K0AN6",
            "Firmware Version:                   1XET7105",
            "PCI Vendor/Subsystem ID:            0x1e0f",
            "IEEE OUI Identifier:                0x8ce38e",
            "Total NVM Capacity:                 3,200,631,791,616 [3.20 TB]",
            "Unallocated NVM Capacity:           0",
            "Controller ID:                      1",
            "NVMe Version:                       2.0",
            "Number of Namespaces:               64",
            "Namespace 1 Size/Capacity:          3,200,631,791,616 [3.20 TB]",
            "Namespace 1 Utilization:            3,200,626,515,968 [3.20 TB]",
            "Namespace 1 Formatted LBA Size:     512",
            "Namespace 1 IEEE EUI-64:            8ce38e e3049580e8",
            "Local Time is:                      Tue Dec 16 01:00:01 2025 UTC",
            "Firmware Updates (0x16):            3 Slots, no Reset required",
            "Optional Admin Commands (0x06df):   Security Format F"
        ]` },
      { id: 'dh-2', device: '/dev/sda', serialId: '2540A00MF2AJ', smartStatus: 'unavailable', smartctlOutput: `"smartctl_output": [
            "smartctl 7.2 2020-12-30 r5155 [x86_64-linux-6.8.0-79-generic] (local build)",
            "Copyright (C) 2002-20, Bruce Allen, Christian Franke, www.smartmontools.org",
            "",
            "=== START OF INFORMATION SECTION ===",
            "Model Number:                       Samsung PM983",
            "Serial Number:                      2540A00MF2AJ",
            "Firmware Version:                   EDA5102Q"
        ]` },
      { id: 'dh-3', device: '/dev/sdb', serialId: '2540A00MF3AK', smartStatus: 'passed', smartctlOutput: `"smartctl_output": []` },
      { id: 'dh-4', device: '/dev/sdc', serialId: '2540A00MF4AL', smartStatus: 'loading', smartctlOutput: `"smartctl_output": []` },
      { id: 'dh-5', device: '/dev/sdd', serialId: '2540A00MF5AM', smartStatus: 'unavailable', smartctlOutput: `"smartctl_output": []` },
    ],
  },
  'host-002': {
    id: 'host-002',
    hostname: 'bzfv0rv1-cephadm-cl02',
    status: 'active',
    labels: ['admin', '_admin'],
    model: 'ThinkSystem',
    modelDetail: 'ThinkSystem SR665 V3',
    serviceInstances: ['node-exporter.2', 'osd.7', 'mon.a'],
    cpus: 2,
    cores: 32,
    totalMemory: '128.0 GiB',
    rawCapacity: '128.0 GiB',
    hdds: 8,
    flash: 2,
    nics: 4,
    devices: [],
    physicalDisks: [],
    daemons: [],
    deviceHealth: [],
  },
  'host-003': {
    id: 'host-003',
    hostname: 'bzfv0rv1-cephadm-cl03',
    status: 'maintenance',
    labels: ['_no_schedule'],
    model: 'Dell PowerEdge',
    modelDetail: 'Dell PowerEdge R750',
    serviceInstances: ['node-exporter.3', 'osd.8', 'mgr.x'],
    cpus: 2,
    cores: 24,
    totalMemory: '64.0 GiB',
    rawCapacity: '64.0 GiB',
    hdds: 6,
    flash: 1,
    nics: 2,
    devices: [],
    physicalDisks: [],
    daemons: [],
    deviceHealth: [],
  },
};

/* ----------------------------------------
   Host Detail Page Component
   ---------------------------------------- */

export default function HostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Get host data
  const host = id ? mockHostData[id] : null;

  // Table column definitions
  const deviceColumns: TableColumn<Device>[] = [
    { key: 'deviceId', label: 'Device ID', flex: 1, sortable: true },
    { key: 'deviceName', label: 'Device Name', flex: 1, sortable: true },
    { 
      key: 'daemons', 
      label: 'Daemons', 
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-wrap gap-0.5">
          {row.daemons.map((daemon, index) => (
            <Chip key={index} value={daemon} />
          ))}
        </div>
      ),
    },
  ];

  const physicalDiskColumns: TableColumn<PhysicalDisk>[] = [
    { key: 'devicePath', label: 'Device path', flex: 1, sortable: true },
    { key: 'type', label: 'Type', flex: 1, sortable: true },
    { 
      key: 'available', 
      label: 'Available', 
      flex: 1, 
      sortable: true,
      render: (_, row) => row.available ? 'Yes' : '',
    },
    { key: 'vendor', label: 'Vendor', flex: 1, sortable: true },
    { key: 'model', label: 'Model', flex: 1, sortable: true },
    { key: 'size', label: 'Size', flex: 1, sortable: true },
    { 
      key: 'osd', 
      label: 'OSDs', 
      flex: 1, 
      sortable: true,
      render: (_, row) => row.osd ? <Chip value={row.osd} /> : null,
    },
    {
      key: 'identify',
      label: 'Identify',
      width: 80,
      align: 'center',
      sortable: false,
      render: (_, row) => {
        const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };
        
        if (row.identifyTimer && row.identifyTimer > 0) {
          return (
            <div className="flex items-center gap-1">
              <IdentifyIcon size={16} className="text-[#ff851a]" />
              <span className="text-[11px] font-medium text-[#ff851a]">{formatTime(row.identifyTimer)}</span>
            </div>
          );
        }
        return (
          <button
            onClick={() => console.log('Identify disk:', row.id)}
            className="p-1 hover:bg-[var(--color-surface-subtle)] rounded transition-colors"
            aria-label="Identify disk"
          >
            <IdentifyIcon size={16} className="text-[var(--color-text-subtle)]" />
          </button>
        );
      },
    },
  ];

  const daemonColumns: TableColumn<Daemon>[] = [
    {
      key: 'status',
      label: 'Status',
      width: 56,
      align: 'center',
      render: (_, row) => {
        const statusMap: Record<string, 'active' | 'maintenance' | 'down'> = {
          running: 'active',
          stopped: 'maintenance',
          error: 'down',
        };
        return <StatusIndicator status={statusMap[row.status]} layout="icon-only" size="sm" />;
      },
    },
    { key: 'daemonName', label: 'Daemon name', flex: 1.5, sortable: true },
    { key: 'version', label: 'Version', flex: 1, sortable: true },
    { key: 'lastRefreshed', label: 'Last Refreshed', flex: 1 },
    {
      key: 'cpuUsage',
      label: 'CPU Usage',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-[var(--spacing-1)] w-full">
          <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
            {row.cpuUsage}%
          </span>
          <div className="h-1 w-full bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(row.cpuUsage, 100)}%`,
                backgroundColor: row.cpuUsage >= 95 ? 'var(--color-state-danger)' : row.cpuUsage >= 85 ? 'var(--color-state-warning)' : 'var(--color-blue-400)',
              }}
            />
          </div>
        </div>
      ),
    },
    { key: 'memoryUsage', label: 'Memory Usage', flex: 1, sortable: true },
    {
      key: 'daemonEvents',
      label: 'Daemon Events',
      flex: 1.5,
      render: (_, row) => (
        <div
          className="line-clamp-2 text-[length:var(--table-font-size)] leading-[var(--table-line-height)]"
          title={row.daemonEvents}
        >
          {row.daemonEvents}
        </div>
      ),
    },
  ];

  // State for Device Health tab
  const [selectedDeviceHealth, setSelectedDeviceHealth] = useState<string | null>(null);
  const [deviceHealthTab, setDeviceHealthTab] = useState<'device-info' | 'smart'>('device-info');
  
  // Get selected device health data
  const selectedDeviceData = host?.deviceHealth.find(d => d.id === selectedDeviceHealth) || host?.deviceHealth[0];

  if (!host) {
    return (
      <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
        <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
        <main
          className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
          style={{ left: sidebarOpen ? '200px' : '0' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--color-text-muted)]">Host not found</p>
          </div>
        </main>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Available';
      case 'maintenance':
        return 'Maintenance';
      case 'down':
        return 'Down';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: sidebarOpen ? '200px' : '0' }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={selectTab}
          onTabClose={closeTab}
          onNewTab={addNewTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Hosts', href: '/storage/hosts' },
                { label: host.hostname },
              ]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6} className="min-w-[1176px] max-w-[1320px]">
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>{host.hostname}</DetailHeader.Title>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard 
                    label="Status" 
                    value={getStatusLabel(host.status)} 
                    status={host.status} 
                  />
                  <DetailHeader.InfoCard 
                    label="Labels" 
                    value={host.labels.length > 0 ? host.labels.join(', ') : '-'} 
                  />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="devices">Devices</Tab>
                    <Tab value="physical-disks">Physical Disks</Tab>
                    <Tab value="daemon">Daemon</Tab>
                    <Tab value="device-health">Device health</Tab>
                    <Tab value="performance">Performance</Tab>
                  </TabList>

                  {/* Details Tab */}
                  <TabPanel value="details" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      <SectionCard>
                        <SectionCard.Header title="Basic Information" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Model">
                            {host.model} ({host.modelDetail})
                          </SectionCard.DataRow>
                          <SectionCard.DataRow label="Service Instances">
                            <div className="flex flex-wrap gap-1">
                              {host.serviceInstances.map((instance, index) => (
                                <Chip key={index} value={instance} />
                              ))}
                            </div>
                          </SectionCard.DataRow>
                          <SectionCard.DataRow label="CPUs">
                            {host.cpus}
                          </SectionCard.DataRow>
                          <SectionCard.DataRow label="Cores">
                            {host.cores}
                          </SectionCard.DataRow>
                          <SectionCard.DataRow label="Total Memory">
                            {host.totalMemory}
                          </SectionCard.DataRow>
                          <SectionCard.DataRow label="Raw Capacity">
                            {host.rawCapacity}
                          </SectionCard.DataRow>
                          <SectionCard.DataRow label="HDDs">
                            {host.hdds}
                          </SectionCard.DataRow>
                          <SectionCard.DataRow label="Flash">
                            {host.flash}
                          </SectionCard.DataRow>
                          <SectionCard.DataRow label="NICs">
                            {host.nics}
                          </SectionCard.DataRow>
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Devices Tab */}
                  <TabPanel value="devices" className="pt-0">
                    <VStack gap={3} className="pt-4">
                      {/* Header */}
                      <div className="flex items-center h-7">
                        <h3 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                          Devices
                        </h3>
                      </div>
                      
                      {/* Search */}
                      <div className="flex items-center gap-4">
                        <div className="w-[280px]">
                          <SearchInput 
                            placeholder="Find instance with filters"
                            size="sm"
                            fullWidth
                          />
                        </div>
                      </div>
                      
                      {/* Pagination */}
                      <Pagination
                        currentPage={1}
                        totalPages={Math.ceil(host.devices.length / 10) || 1}
                        onPageChange={() => {}}
                        totalItems={host.devices.length}
                        itemsPerPage={10}
                        showItemCount
                      />
                      
                      {/* Table */}
                      <Table
                        columns={deviceColumns}
                        data={host.devices}
                        rowKey="id"
                        emptyMessage="No devices found"
                      />
                    </VStack>
                  </TabPanel>

                  {/* Physical Disks Tab */}
                  <TabPanel value="physical-disks" className="pt-0">
                    <VStack gap={3} className="pt-4">
                      {/* Header */}
                      <div className="flex items-center justify-between w-full">
                        <h3 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                          Physical Disks
                        </h3>
                      </div>
                      
                      {/* Search */}
                      <div className="w-[280px]">
                        <SearchInput 
                          placeholder="Find instance with filters"
                          size="sm"
                          fullWidth
                        />
                      </div>
                      
                      {/* Pagination */}
                      <Pagination
                        currentPage={1}
                        totalPages={Math.ceil(host.physicalDisks.length / 10) || 1}
                        onPageChange={() => {}}
                        totalItems={host.physicalDisks.length}
                        itemsPerPage={10}
                        showItemCount
                      />
                      
                      {/* Table */}
                      <Table
                        columns={physicalDiskColumns}
                        data={host.physicalDisks}
                        rowKey="id"
                        emptyMessage="No physical disks found"
                      />
                    </VStack>
                  </TabPanel>

                  {/* Daemon Tab */}
                  <TabPanel value="daemon" className="pt-0">
                    <VStack gap={3} className="pt-4">
                      {/* Header */}
                      <div className="flex items-center justify-between w-full">
                        <h3 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                          Daemon
                        </h3>
                      </div>
                      
                      {/* Search */}
                      <div className="w-[280px]">
                        <SearchInput 
                          placeholder="Find instance with filters"
                          size="sm"
                          fullWidth
                        />
                      </div>
                      
                      {/* Pagination */}
                      <Pagination
                        currentPage={1}
                        totalPages={Math.ceil(host.daemons.length / 10) || 1}
                        onPageChange={() => {}}
                        totalItems={host.daemons.length}
                        itemsPerPage={10}
                        showItemCount
                      />
                      
                      {/* Table */}
                      <Table
                        columns={daemonColumns}
                        data={host.daemons}
                        rowKey="id"
                        emptyMessage="No daemons found"
                      />
                    </VStack>
                  </TabPanel>

                  {/* Device Health Tab */}
                  <TabPanel value="device-health" className="pt-0">
                    <div className="flex gap-4 pt-4">
                      {/* Left Panel - Device List */}
                      <div className="w-[224px] shrink-0 bg-white border border-[var(--color-border-default)] rounded-lg p-3 flex flex-col gap-3">
                        <h4 className="text-[14px] font-medium leading-5 text-[#314158]">
                          Device health
                        </h4>
                        <div className="flex flex-col">
                          {host.deviceHealth.map((device) => {
                            const isSelected = (selectedDeviceHealth || host.deviceHealth[0]?.id) === device.id;
                            return (
                              <button
                                key={device.id}
                                onClick={() => setSelectedDeviceHealth(device.id)}
                                className={`px-2.5 py-[7px] rounded text-left text-[12px] font-medium leading-4 transition-colors ${
                                  isSelected
                                    ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)]'
                                    : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]'
                                }`}
                              >
                                {device.device} ({device.serialId})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Right Panel - Device Details */}
                      <div className="flex-1 flex flex-col gap-3">
                        {selectedDeviceData && (
                          <>
                            {/* Title */}
                            <h3 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                              {selectedDeviceData.device} ({selectedDeviceData.serialId})
                            </h3>
                            
                            {/* Tab Switcher */}
                            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md p-1">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setDeviceHealthTab('device-info')}
                                  className={`flex-1 py-2.5 px-4 text-[14px] font-medium leading-4 rounded-md transition-colors ${
                                    deviceHealthTab === 'device-info'
                                      ? 'bg-white border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                                      : 'text-[var(--color-text-default)]'
                                  }`}
                                >
                                  Device information
                                </button>
                                <button
                                  onClick={() => setDeviceHealthTab('smart')}
                                  className={`flex-1 py-2.5 px-4 text-[14px] font-medium leading-4 rounded-md transition-colors ${
                                    deviceHealthTab === 'smart'
                                      ? 'bg-white border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                                      : 'text-[var(--color-text-default)]'
                                  }`}
                                >
                                  SMART
                                </button>
                              </div>
                            </div>
                            
                            {/* Content */}
                            {deviceHealthTab === 'device-info' && (
                              <div className="bg-white border border-[var(--color-border-default)] rounded-md p-4 flex flex-col gap-3">
                                <h4 className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                                  Device Information
                                </h4>
                                
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                                    smartctl output
                                  </span>
                                  <div className="bg-[var(--color-surface-contrast)] rounded-md p-4 max-h-[280px] overflow-x-auto overflow-y-auto">
                                    <pre className="font-[family-name:var(--font-mono)] text-[12px] leading-[18px] text-white whitespace-pre-wrap">
                                      {selectedDeviceData.smartctlOutput}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )}

                            {deviceHealthTab === 'smart' && (
                              <>
                                {/* Info/Status Message based on SMART status */}
                                {selectedDeviceData?.smartStatus === 'passed' && (
                                  <div className="bg-[#f0fdf4] rounded-md p-3 flex items-start gap-2">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5">
                                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#16a34a" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M5.5 8L7.16667 9.66667L10.5 6.33333" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-[12px] leading-4 text-[#0f172a]">
                                      SMART overall-health self-assessment test result: <strong>passed</strong>
                                    </span>
                                  </div>
                                )}
                                {selectedDeviceData?.smartStatus === 'unavailable' && (
                                  <div className="bg-[#eff6ff] rounded-md p-3 flex items-start gap-2">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5">
                                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8 10.6667V8" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8 5.33333H8.00667" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-[12px] leading-4 text-[#0f172a]">
                                      No SMART data available for this device.
                                    </span>
                                  </div>
                                )}
                                {selectedDeviceData?.smartStatus === 'loading' && (
                                  <div className="bg-[#eff6ff] rounded-md p-3 flex items-start gap-2">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5">
                                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8 10.6667V8" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8 5.33333H8.00667" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-[12px] leading-4 text-[#0f172a]">
                                      SMART data is loading.
                                    </span>
                                  </div>
                                )}
                                {selectedDeviceData?.smartStatus === 'failed' && (
                                  <div className="bg-[#fef2f2] rounded-md p-3 flex items-start gap-2">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5">
                                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#dc2626" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M10 6L6 10" stroke="#dc2626" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M6 6L10 10" stroke="#dc2626" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-[12px] leading-4 text-[#0f172a]">
                                      SMART overall-health self-assessment test result: <strong>failed</strong>
                                    </span>
                                  </div>
                                )}

                                {/* SMART Card */}
                                <div className="bg-white border border-[var(--color-border-default)] rounded-md p-4 flex flex-col gap-3">
                                  <h4 className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                                    SMART
                                  </h4>
                                  
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                                      Health Status
                                    </span>
                                    <span className="text-[12px] leading-4 text-[var(--color-text-default)]">
                                      {selectedDeviceData?.smartStatus === 'passed' ? 'Passed' : 
                                       selectedDeviceData?.smartStatus === 'failed' ? 'Failed' : 
                                       selectedDeviceData?.smartStatus === 'unavailable' ? 'Unavailable' : '-'}
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}
                        
                        {!selectedDeviceData && host.deviceHealth.length === 0 && (
                          <div className="flex items-center justify-center h-[200px] text-[var(--color-text-subtle)]">
                            No device health data available
                          </div>
                        )}
                      </div>
                    </div>
                  </TabPanel>

                  {/* Performance Tab */}
                  <TabPanel value="performance" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Monitoring Time Controls */}
                      <div className="flex justify-end w-full">
                        <HostMonitoringTimeControls
                          onTimeRangeChange={(value) => console.log('Time range changed:', value)}
                          onRefresh={() => console.log('Refresh clicked')}
                        />
                      </div>

                      {/* System Overview Section */}
                      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-6">
                        <h3 className="text-[14px] font-semibold text-[var(--color-text-default)] mb-4 tracking-wider">
                          SYSTEM OVERVIEW
                        </h3>
                        
                        {/* Stat Cards Row */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {/* OSDs Card */}
                          <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4">
                            <span className="text-[12px] text-[var(--color-text-muted)]">OSDs</span>
                            <div className="text-[24px] leading-[28px] font-semibold text-[var(--color-text-default)] mt-1">
                              {host.osds || 24}
                            </div>
                          </div>
                          
                          {/* Raw Capacity Card */}
                          <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4">
                            <span className="text-[12px] text-[var(--color-text-muted)]">Raw Capacity</span>
                            <div className="text-[24px] leading-[28px] font-semibold text-[var(--color-text-default)] mt-1">
                              {host.rawCapacity || '11.6 TiB'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Charts Container with 24px vertical gap */}
                        <div className="flex flex-col gap-6">
                          {/* Charts Row */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Network drop rate */}
                            <HostChartWithFullScreen
                              title="Network drop rate"
                              series={[
                                { name: 'Send', data: [2, 4, 8, 10, 9, 12, 14], color: chartColors.cyan400 },
                                { name: 'Receive', data: [1, 3, 6, 8, 7, 10, 12], color: chartColors.emerald400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00']}
                              yAxisUnit=" p/s"
                            />
                            
                            {/* Network error rate */}
                            <HostChartWithFullScreen
                              title="Network error rate"
                              series={[
                                { name: 'Send', data: [1, 2, 4, 5, 4, 6, 8], color: chartColors.cyan400 },
                                { name: 'Receive', data: [0.5, 1.5, 3, 4, 3, 5, 7], color: chartColors.emerald400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00']}
                              yAxisUnit=" p/s"
                            />
                          </div>

                          {/* Additional Charts Row */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* RAM Usage */}
                            <HostChartWithFullScreen
                              title="RAM Usage"
                              series={[
                                { name: 'Used', data: [28, 32, 35, 38, 36, 40], color: chartColors.cyan400 },
                                { name: 'Cached', data: [18, 22, 25, 28, 26, 30], color: chartColors.emerald400 },
                                { name: 'Buffers', data: [8, 10, 12, 14, 12, 15], color: chartColors.amber400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30']}
                              yAxisUnit=" GB"
                            />
                            
                            {/* CPU Utilization */}
                            <HostChartWithFullScreen
                              title="CPU Utilization"
                              series={[
                                { name: 'osd.0', data: [1.2, 1.4, 1.6, 1.5, 1.8], color: chartColors.cyan400 },
                                { name: 'osd.1', data: [0.8, 1.0, 1.2, 1.1, 1.4], color: chartColors.emerald400 },
                                { name: 'osd.2', data: [0.5, 0.7, 0.9, 0.85, 1.0], color: chartColors.amber400 },
                                { name: 'osd.3', data: [0.6, 0.8, 1.0, 0.95, 1.2], color: chartColors.violet400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30']}
                              yAxisUnit="%"
                            />
                          </div>

                          {/* Network Load Chart */}
                          <div className="grid grid-cols-2 gap-4">
                            <HostChartWithFullScreen
                              title="Network Load"
                              series={[
                                { name: 'eth0 Rx', data: [2.2, 2.5, 2.8, 3.0, 3.2, 3.5], color: chartColors.cyan400 },
                                { name: 'eth0 Tx', data: [1.5, 1.8, 2.0, 2.2, 2.5, 2.8], color: chartColors.emerald400 },
                                { name: 'eth1 Rx', data: [1.0, 1.2, 1.5, 1.8, 2.0, 2.2], color: chartColors.amber400 },
                                { name: 'eth1 Tx', data: [0.8, 1.0, 1.2, 1.4, 1.6, 1.8], color: chartColors.violet400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30']}
                              yAxisUnit=" Gb/s"
                            />
                          </div>
                        </div>
                      </div>

                      {/* DISK PERFORMANCE Section */}
                      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-6">
                        <h3 className="text-[14px] font-semibold text-[var(--color-text-default)] mb-4 tracking-wider">
                          DISK PERFORMANCE
                        </h3>
                        
                        {/* Disk Charts Container with 24px vertical gap */}
                        <div className="flex flex-col gap-6">
                          {/* Row 1: Disk IOPS + Throughput by Disk */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Disk IOPS */}
                            <HostChartWithFullScreen
                              title="Disk IOPS"
                              series={[
                                { name: 'sda Read', data: [100, 120, 140, 160, 180, 150], color: chartColors.cyan400 },
                                { name: 'sda Write', data: [80, 95, 110, 130, 145, 120], color: chartColors.emerald400 },
                                { name: 'sdb Read', data: [60, 70, 85, 100, 110, 90], color: chartColors.amber400 },
                                { name: 'sdb Write', data: [40, 55, 70, 85, 95, 75], color: chartColors.violet400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30']}
                              yAxisUnit=""
                            />
                            
                            {/* Throughput by Disk */}
                            <HostChartWithFullScreen
                              title="Throughput by Disk"
                              series={[
                                { name: 'sda Read', data: [4, 5, 6, 7, 8, 9], color: chartColors.cyan400 },
                                { name: 'sda Write', data: [3, 4, 5, 5.5, 6, 7], color: chartColors.emerald400 },
                                { name: 'sdb Read', data: [2, 2.5, 3, 4, 5, 6], color: chartColors.amber400 },
                                { name: 'sdb Write', data: [1, 1.5, 2, 2.5, 3, 4], color: chartColors.violet400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30']}
                              yAxisUnit=" MB/s"
                            />
                          </div>

                          {/* Row 2: Disk Latency + Disk Utilization */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Disk Latency */}
                            <HostChartWithFullScreen
                              title="Disk Latency"
                              series={[
                                { name: 'sda Read', data: [5, 8, 12, 15, 18, 20], color: chartColors.cyan400 },
                                { name: 'sda Write', data: [4, 6, 9, 12, 14, 16], color: chartColors.emerald400 },
                                { name: 'sdb Read', data: [3, 5, 7, 10, 12, 14], color: chartColors.amber400 },
                                { name: 'sdb Write', data: [2, 4, 6, 8, 10, 12], color: chartColors.violet400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30']}
                              yAxisUnit=" ms"
                            />
                            
                            {/* Disk Utilization */}
                            <HostChartWithFullScreen
                              title="Disk Utilization"
                              series={[
                                { name: 'sda', data: [20, 25, 30, 35, 45, 50], color: chartColors.cyan400 },
                                { name: 'sdb', data: [15, 20, 25, 30, 40, 45], color: chartColors.emerald400 },
                                { name: 'sdc', data: [10, 15, 20, 28, 35, 42], color: chartColors.amber400 },
                                { name: 'sdd', data: [8, 12, 18, 22, 30, 38], color: chartColors.violet400 },
                              ]}
                              timeLabels={['14:30', '14:45', '15:00', '15:15', '15:30']}
                              yAxisUnit="%"
                            />
                          </div>
                        </div>
                      </div>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

