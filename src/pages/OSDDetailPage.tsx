import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import type { ECharts } from 'echarts';
import {
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Chip,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  DetailHeaderTitle,
  DetailHeaderInfoCard,
  SectionCard,
  SectionCardHeader,
  SectionCardContent,
  SectionCardDataRow,
  SearchInput,
  Pagination,
  Table,
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
   Chart Colors
   ---------------------------------------- */

const chartColors = {
  cyan400: '#22d3ee',
  emerald400: '#34d399',
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

interface OSDMonitoringTimeControlsProps {
  onTimeRangeChange?: (value: string) => void;
  onRefresh?: () => void;
}

function OSDMonitoringTimeControls({ onTimeRangeChange, onRefresh }: OSDMonitoringTimeControlsProps) {
  const [timeRange, setTimeRange] = useState<TimePeriod>('30m');
  const [customPeriod, setCustomPeriod] = useState<{ start: Date; end: Date } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);
  const [viewMonth, setViewMonth] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

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
      setCustomPeriod({ start: tempStartDate, end: tempEndDate });
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

  const formatDateForDisplay = (date: Date | null) => {
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
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false, isToday: false });
    }
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true, isToday: d.toDateString() === today.toDateString() });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false, isToday: false });
    }
    return days;
  };

  const handleDayClick = (date: Date) => {
    if (selectingStart) {
      setTempStartDate(date);
      if (tempEndDate && date > tempEndDate) setTempEndDate(null);
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

  const isDateInRange = (date: Date) => tempStartDate && tempEndDate && date >= tempStartDate && date <= tempEndDate;
  const isStartDate = (date: Date) => tempStartDate?.toDateString() === date.toDateString();
  const isEndDate = (date: Date) => tempEndDate?.toDateString() === date.toDateString();
  const prevMonthNav = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonthNav = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fullScreenTimeControls">
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
      <div className="periodSelector" ref={datePickerRef}>
        {customPeriod ? (
          <div className="periodBadge" onClick={() => { setTempStartDate(customPeriod.start); setTempEndDate(customPeriod.end); setViewMonth(customPeriod.start); setSelectingStart(true); setShowDatePicker(true); }}>
            <CalendarIcon />
            <span>{formatDateForDisplay(customPeriod.start)} - {formatDateForDisplay(customPeriod.end)}</span>
            <button className="periodClear" onClick={handleClearCustomPeriod}><CloseIcon /></button>
          </div>
        ) : (
          <button className="periodButton" onClick={handleCustomPeriodClick}>
            <CalendarIcon />
            <span>Period</span>
          </button>
        )}
        {showDatePicker && (
          <div className="calendarDropdown">
            <div className="calendarHeader">
              <button className="calendarNavButton" onClick={prevMonthNav}><IconChevronLeft size={14} /></button>
              <span className="calendarMonthYear">{viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <button className="calendarNavButton" onClick={nextMonthNav}><IconChevronRight size={14} /></button>
            </div>
            <div className="calendarWeekDays">{weekDays.map(day => <div key={day} className="calendarWeekDay">{day}</div>)}</div>
            <div className="calendarDays">
              {getDaysInMonth(viewMonth).map((day, idx) => (
                <div key={idx} className={`calendarDayWrapper ${isDateInRange(day.date) ? 'inRange' : ''} ${isStartDate(day.date) ? 'isStart' : ''} ${isEndDate(day.date) ? 'isEnd' : ''}`}>
                  <button className={`calendarDay ${day.isCurrentMonth ? '' : 'otherMonth'} ${isStartDate(day.date) || isEndDate(day.date) ? 'selected' : ''}`} onClick={() => handleDayClick(day.date)}>
                    {day.date.getDate()}
                    {day.isToday && <span className="calendarTodayDot" />}
                  </button>
                </div>
              ))}
            </div>
            <div className="calendarActions">
              <button className="calendarCancel" onClick={() => setShowDatePicker(false)}>Cancel</button>
              <button className="calendarApply" onClick={handleApplyCustomPeriod}>Apply</button>
            </div>
          </div>
        )}
      </div>
      <button className="refreshButton" onClick={onRefresh}><IconRefresh size={14} stroke={1.5} /></button>
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

interface OSDPerformanceChartProps {
  title: string;
  series: ChartSeries[];
  timeLabels: string[];
  yAxisUnit?: string;
  isFullScreen?: boolean;
  onFullScreen?: () => void;
  onExitFullScreen?: () => void;
  timeControls?: React.ReactNode;
}

function OSDPerformanceChart({
  title,
  series,
  timeLabels,
  yAxisUnit = '',
  isFullScreen = false,
  onFullScreen,
  onExitFullScreen,
  timeControls,
}: OSDPerformanceChartProps) {
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
      try { chartInstance.resize(); } catch { /* Instance might be disposed */ }
    }, 100);
  };

  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const allVisible = Object.values(visibleSeries).every(v => v);
  const toggleAll = () => setVisibleSeries(Object.fromEntries(series.map(s => [s.name, !allVisible])));
  const handleFullScreen = () => { setMenuOpen(false); if (onFullScreen) onFullScreen(); };

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
    grid: { left: '40px', right: '16px', top: '20px', bottom: '16px', containLabel: false },
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
      axisLabel: { color: chartColors.slate400, fontSize: 10, formatter: (v: number) => `${v}${yAxisUnit}` }
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: tooltipTextColor, fontSize: 11, fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif' }
    },
    series: series.filter(s => visibleSeries[s.name]).map(s => ({
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
        <div className="chartHeader">
          <span className="chartTitle">{title}</span>
          {isFullScreen && timeControls && <div className="chartHeaderCenter">{timeControls}</div>}
          <div className="chartControls">
            {series.length > 1 && (
              <>
                <button className="toggleBtn" onClick={toggleAll}>
                  <span className={`toggleSwitch ${allVisible ? 'toggleSwitchActive' : ''}`} />
                  <span>{allVisible ? 'Hide All' : 'View All'}</span>
                </button>
                <span className="toggleDivider">|</span>
              </>
            )}
            <div className="menuContainer">
              <button className="menuTrigger" onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}>
                <IconDotsCircleHorizontal size={16} stroke={1.5} />
              </button>
              {menuOpen && (
                <div className="contextMenu">
                  <button className="contextMenuItem" onClick={() => setMenuOpen(false)}>Download Image</button>
                  <button className="contextMenuItem" onClick={() => setMenuOpen(false)}>Download CSV</button>
                  <button className="contextMenuItemLast" onClick={() => { setMenuOpen(false); setShowDataView(true); }}>Data View</button>
                </div>
              )}
            </div>
            <button className="expandTrigger" title={isFullScreen ? "Minimize" : "Expand"} onClick={isFullScreen ? onExitFullScreen : handleFullScreen}>
              {isFullScreen ? <IconArrowsMinimize size={16} stroke={1.5} /> : <IconArrowsMaximize size={16} stroke={1.5} />}
            </button>
          </div>
        </div>
        <div className="chartBody">
          <div className="chartWrapper" ref={wrapperRef}>
            <ReactECharts 
              key={isFullScreen ? 'fullscreen' : 'normal'}
              ref={chartRef}
              option={option}
              style={{ height: isFullScreen ? 'calc(100vh - 200px)' : '214px', width: isFullScreen ? 'calc(100vw - 300px)' : '100%' }}
              notMerge={true}
              onChartReady={handleChartReady}
            />
          </div>
          <div className="chartLegend">
            {series.map((s, i) => (
              <div key={i} className={`legendItem ${!visibleSeries[s.name] ? 'legendItemHidden' : ''}`} onClick={() => setVisibleSeries(prev => ({ ...prev, [s.name]: !prev[s.name] }))}>
                <div className="legendDot" style={{ backgroundColor: s.color }} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DataViewDrawer isOpen={showDataView} onClose={() => setShowDataView(false)} title={`${title} (RAW)`} series={series} timeLabels={timeLabels} />
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

function OSDChartWithFullScreen({ title, series, timeLabels, yAxisUnit = '' }: { title: string; series: ChartSeries[]; timeLabels: string[]; yAxisUnit?: string; }) {
  const [fullScreenChart, setFullScreenChart] = useState<FullScreenChartData | null>(null);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const [containerReady, setContainerReady] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullScreenChart) { setFullScreenChart(null); setContainerReady(false); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullScreenChart]);

  useEffect(() => {
    if (fullScreenChart && fullScreenContainerRef.current) {
      requestAnimationFrame(() => { requestAnimationFrame(() => { setContainerReady(true); }); });
    } else { setContainerReady(false); }
  }, [fullScreenChart]);

  return (
    <>
      <OSDPerformanceChart title={title} series={series} timeLabels={timeLabels} yAxisUnit={yAxisUnit} onFullScreen={() => setFullScreenChart({ title, series, timeLabels, yAxisUnit })} />
      {fullScreenChart && (
        <>
          <div className="fullScreenOverlay" onClick={() => { setFullScreenChart(null); setContainerReady(false); }} />
          <div className="fullScreenFloating" ref={fullScreenContainerRef}>
            {containerReady && (
              <OSDPerformanceChart
                title={fullScreenChart.title}
                series={fullScreenChart.series}
                timeLabels={fullScreenChart.timeLabels}
                yAxisUnit={fullScreenChart.yAxisUnit}
                isFullScreen={true}
                onExitFullScreen={() => { setFullScreenChart(null); setContainerReady(false); }}
                timeControls={<OSDMonitoringTimeControls />}
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

interface OSDData {
  id: number;
  host: string;
  status: ('in' | 'up' | 'out' | 'down')[];
  deviceClass: 'hdd' | 'ssd' | 'nvme';
  pgs: number;
  size: string;
  flags: string;
  usage: number;
}

interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  daemons: string[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockOSDs: Record<number, OSDData> = {
  1: {
    id: 1,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
  },
  2: {
    id: 2,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
  },
  3: {
    id: 3,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
  },
  4: {
    id: 4,
    host: 'bzv2krt2-ceph',
    status: ['in', 'up'],
    deviceClass: 'ssd',
    pgs: 200,
    size: '4.5 GiB',
    flags: '-',
    usage: 72.5,
  },
  5: {
    id: 5,
    host: 'bzv2krt2-ceph',
    status: ['out', 'down'],
    deviceClass: 'ssd',
    pgs: 0,
    size: '4.5 GiB',
    flags: 'noout',
    usage: 0,
  },
  6: {
    id: 6,
    host: 'bzv2krt3-ceph',
    status: ['in', 'up'],
    deviceClass: 'nvme',
    pgs: 312,
    size: '8.2 GiB',
    flags: '-',
    usage: 45.8,
  },
};

const mockDevices: Device[] = [
  {
    id: '1',
    deviceId: '9350-16i_LOGICAL_VOLUME_L9HF55E012A',
    deviceName: 'sda',
    daemons: ['osd.5', 'osd.4', 'osd.6'],
  },
  {
    id: '2',
    deviceId: '9350-16i_LOGICAL_VOLUME_L9HF55E012A',
    deviceName: 'sdc',
    daemons: ['osd.5', 'osd.4', 'osd.6'],
  },
  {
    id: '3',
    deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ',
    deviceName: 'sda',
    daemons: ['osd.5', 'osd.4', 'osd.6'],
  },
  {
    id: '4',
    deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ',
    deviceName: 'sdc',
    daemons: ['osd.5', 'osd.6'],
  },
  {
    id: '5',
    deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ',
    deviceName: 'sdd',
    daemons: ['osd.5'],
  },
];

/* ----------------------------------------
   Device Health Data
   ---------------------------------------- */

interface DeviceHealth {
  id: string;
  name: string;
  serialNumber: string;
  modelNumber: string;
  firmwareVersion: string;
  totalCapacity: string;
  smartctlOutput: string;
}

const mockDeviceHealthList: DeviceHealth[] = [
  {
    id: '1',
    name: '/dev/sdf',
    serialNumber: 'L9HF55E012A',
    modelNumber: 'KIOXIA KCD8DPUG3T20',
    firmwareVersion: '1XET7105',
    totalCapacity: '3,200,631,791,616 [3.20 TB]',
    smartctlOutput: `"smartctl_output": [
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
            "Firmware Updates (0x16):            3 Slots, no Reset required"`,
  },
  {
    id: '2',
    name: '/dev/sda',
    serialNumber: '2540A00MF2AJ',
    modelNumber: 'LENOVO MG09SCA14TE',
    firmwareVersion: '2.1.0',
    totalCapacity: '14,000,519,643,136 [14.0 TB]',
    smartctlOutput: `"smartctl_output": [
            "smartctl 7.2 2020-12-30 r5155 [x86_64-linux-6.8.0-79-generic] (local build)",
            "Copyright (C) 2002-20, Bruce Allen, Christian Franke, www.smartmontools.org",
            "",
            "=== START OF INFORMATION SECTION ===",
            "Model Number:                       LENOVO MG09SCA14TE",
            "Serial Number:                      2540A00MF2AJ"`,
  },
  {
    id: '3',
    name: '/dev/sdb',
    serialNumber: '2540A00MF2AK',
    modelNumber: 'LENOVO MG09SCA14TE',
    firmwareVersion: '2.1.0',
    totalCapacity: '14,000,519,643,136 [14.0 TB]',
    smartctlOutput: `"smartctl_output": []`,
  },
];

/* ----------------------------------------
   Daemons Cell Component
   ---------------------------------------- */

interface DaemonsCellProps {
  daemons: string[];
}

function DaemonsCell({ daemons }: DaemonsCellProps) {
  return (
    <div className="flex gap-0.5 flex-wrap">
      {daemons.map((daemon, index) => (
        <Chip key={index} value={daemon} />
      ))}
    </div>
  );
}

/* ----------------------------------------
   OSD Detail Page
   ---------------------------------------- */

export function OSDDetailPage() {
  const { id } = useParams<{ id: string }>();
  const osdId = parseInt(id || '1', 10);
  const osd = mockOSDs[osdId] || mockOSDs[1];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
  const [deviceCurrentPage, setDeviceCurrentPage] = useState(1);
  const deviceRowsPerPage = 10;
  
  // Device health tab state
  const [selectedHealthDevice, setSelectedHealthDevice] = useState(mockDeviceHealthList[0]);
  const [healthSubTab, setHealthSubTab] = useState<'device-info' | 'smart'>('device-info');

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter devices based on search
  const filteredDevices = useMemo(() =>
    mockDevices.filter((device) =>
      device.deviceId.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
      device.deviceName.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
      device.daemons.some(d => d.toLowerCase().includes(deviceSearchQuery.toLowerCase()))
    ), [deviceSearchQuery]
  );

  const deviceTotalPages = Math.ceil(filteredDevices.length / deviceRowsPerPage);

  // Get paginated devices
  const paginatedDevices = useMemo(() => {
    const start = (deviceCurrentPage - 1) * deviceRowsPerPage;
    return filteredDevices.slice(start, start + deviceRowsPerPage);
  }, [filteredDevices, deviceCurrentPage, deviceRowsPerPage]);

  // Device table columns
  const deviceColumns: TableColumn<Device>[] = [
    {
      key: 'deviceId',
      label: 'Device ID',
      flex: 1,
      sortable: true,
    },
    {
      key: 'deviceName',
      label: 'Device Name',
      flex: 1,
      sortable: true,
    },
    {
      key: 'daemons',
      label: 'Daemons',
      flex: 1,
      sortable: false,
      render: (_, row) => <DaemonsCell daemons={row.daemons} />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar with Breadcrumb Navigation */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/storage' },
                  { label: 'OSDs', href: '/storage/osds' },
                  { label: `OSD.${osd.id}` },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <div className="flex flex-col items-stretch justify-start gap-6 min-w-[1176px] max-w-[1320px]">
              {/* OSD Header Card */}
              <DetailHeader>
                <DetailHeaderTitle>{osd.host}</DetailHeaderTitle>
                <div className="flex gap-2 w-full">
                  <DetailHeaderInfoCard 
                    label="Status" 
                    value={
                      <div className="flex gap-0.5">
                        {osd.status.map((s, index) => (
                          <Chip
                            key={index}
                            value={s}
                          />
                        ))}
                      </div>
                    }
                    status={osd.status.includes('up') ? 'active' : 'error'}
                  />
                  <DetailHeaderInfoCard 
                    label="ID" 
                    value={String(osd.id)}
                  />
                </div>
              </DetailHeader>

              {/* Tabs Section */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab}>
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="devices">Devices</Tab>
                    <Tab value="device-health">Device health</Tab>
                    <Tab value="performance">Performance</Tab>
                  </TabList>

                  {/* Details Tab */}
                  <TabPanel value="details" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Basic Information */}
                      <SectionCard>
                        <SectionCardHeader
                          title="Basic Information"
                        />
                        <SectionCardContent>
                          <SectionCardDataRow label="Device class" showDivider={false}>
                            <Chip value={osd.deviceClass} />
                          </SectionCardDataRow>
                          <SectionCardDataRow label="PGs" value={String(osd.pgs)} />
                          <SectionCardDataRow label="Size" value={osd.size} />
                          <SectionCardDataRow label="Flags" value={osd.flags} />
                          <SectionCardDataRow label="Usage" value={`${osd.usage}%`} />
                        </SectionCardContent>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Devices Tab */}
                  <TabPanel value="devices" className="pt-0">
                    <VStack gap={3} className="pt-4">
                      {/* Section Header */}
                      <div className="flex items-center h-7">
                        <h2 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                          Devices
                        </h2>
                      </div>

                      {/* Search */}
                      <div className="w-[280px]">
                        <SearchInput
                          placeholder="Find instance with filters"
                          value={deviceSearchQuery}
                          onChange={(e) => setDeviceSearchQuery(e.target.value)}
                          onClear={() => setDeviceSearchQuery('')}
                          size="sm"
                          fullWidth
                        />
                      </div>

                      {/* Pagination */}
                      {filteredDevices.length > 0 && (
                        <Pagination
                          currentPage={deviceCurrentPage}
                          totalPages={deviceTotalPages}
                          onPageChange={setDeviceCurrentPage}
                          totalItems={filteredDevices.length}
                          itemsPerPage={deviceRowsPerPage}
                          showItemCount
                        />
                      )}

                      {/* Devices Table */}
                      <Table<Device>
                        columns={deviceColumns}
                        data={paginatedDevices}
                        rowKey="id"
                        emptyMessage="No devices found"
                      />
                    </VStack>
                  </TabPanel>

                  {/* Device Health Tab */}
                  <TabPanel value="device-health" className="pt-0">
                    <div className="flex gap-4 pt-4">
                      {/* Device List Sidebar */}
                      <div className="w-[224px] shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-3">
                        <h3 className="text-[14px] font-medium text-[var(--color-text-default)] mb-3">
                          Device health
                        </h3>
                        <div className="flex flex-col">
                          {mockDeviceHealthList.map((device) => (
                            <button
                              key={device.id}
                              onClick={() => setSelectedHealthDevice(device)}
                              className={`
                                text-left px-2.5 py-[7px] rounded text-[12px] font-medium truncate
                                transition-colors duration-[var(--duration-fast)]
                                ${selectedHealthDevice.id === device.id
                                  ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)]'
                                  : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]'
                                }
                              `}
                            >
                              {device.name} ({device.serialNumber})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Device Details */}
                      <div className="flex-1 flex flex-col gap-3 min-w-0">
                        {/* Selected Device Header */}
                        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          {selectedHealthDevice.name} ({selectedHealthDevice.serialNumber})
                        </h2>

                        {/* Sub-tab Switcher */}
                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md p-1 flex gap-2">
                          <button
                            onClick={() => setHealthSubTab('device-info')}
                            className={`
                              flex-1 py-2.5 px-4 rounded-md text-[14px] font-medium text-center
                              transition-colors duration-[var(--duration-fast)]
                              ${healthSubTab === 'device-info'
                                ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                                : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)]'
                              }
                            `}
                          >
                            Device information
                          </button>
                          <button
                            onClick={() => setHealthSubTab('smart')}
                            className={`
                              flex-1 py-2.5 px-4 rounded-md text-[14px] font-medium text-center
                              transition-colors duration-[var(--duration-fast)]
                              ${healthSubTab === 'smart'
                                ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                                : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)]'
                              }
                            `}
                          >
                            SMART
                          </button>
                        </div>

                        {/* Content based on sub-tab */}
                        <SectionCard>
                          <SectionCardHeader title="Device Information" />
                          <SectionCardContent>
                            <SectionCardDataRow label="Model Number" value={selectedHealthDevice.modelNumber} showDivider={false} />
                            <SectionCardDataRow label="Serial Number" value={selectedHealthDevice.serialNumber} />
                            <SectionCardDataRow label="Firmware Version" value={selectedHealthDevice.firmwareVersion} />
                            <SectionCardDataRow label="Total Capacity" value={selectedHealthDevice.totalCapacity} />
                            
                            {/* smartctl output */}
                            <div className="pt-3 mt-3 border-t border-[var(--color-border-default)]">
                              <p className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-1.5">
                                smartctl output
                              </p>
                              <div className="bg-[var(--color-surface-contrast)] rounded-md p-4 overflow-x-auto max-h-[280px] overflow-y-auto">
                                <pre className="font-[family-name:var(--font-mono)] text-[12px] leading-[18px] text-white whitespace-pre-wrap">
                                  {selectedHealthDevice.smartctlOutput}
                                </pre>
                              </div>
                            </div>
                          </SectionCardContent>
                        </SectionCard>
                      </div>
                    </div>
                  </TabPanel>

                  {/* Performance Tab */}
                  <TabPanel value="performance" className="pt-0">
                    <VStack gap={6} className="pt-4">
                      {/* Monitoring Time Controls */}
                      <div className="flex justify-end w-full">
                        <OSDMonitoringTimeControls 
                          onTimeRangeChange={(value) => console.log('Time range changed:', value)}
                          onRefresh={() => console.log('Refresh clicked')}
                        />
                      </div>
                      
                      {/* OSD Performance Section */}
                      <SectionCard>
                        <SectionCardHeader title="OSD PERFORMANCE" />
                        <SectionCardContent>
                          <div className="flex flex-col gap-4">
                            {/* Top row - 2 charts */}
                            <div className="grid grid-cols-2 gap-4">
                              <OSDChartWithFullScreen
                                title={`osd.${osdId} Latency`}
                                series={[
                                  { name: 'Reads', data: [65, 68, 70, 72, 75, 85], color: chartColors.cyan400 },
                                  { name: 'Writes', data: [20, 22, 25, 28, 30, 35], color: chartColors.emerald400 },
                                ]}
                                timeLabels={['15:50', '15:05', '15:20', '15:35', '16:50']}
                                yAxisUnit=" µs"
                              />
                              <OSDChartWithFullScreen
                                title={`osd.${osdId} R/W IOPS`}
                                series={[
                                  { name: 'Reads', data: [0.6, 0.7, 0.8, 1.0, 1.2, 1.5], color: chartColors.cyan400 },
                                  { name: 'Writes', data: [0.4, 0.45, 0.5, 0.55, 0.6, 0.7], color: chartColors.emerald400 },
                                ]}
                                timeLabels={['15:50', '15:05', '15:20', '15:35', '16:50']}
                                yAxisUnit=""
                              />
                            </div>
                            {/* Bottom row - 1 chart (half width) */}
                            <div className="grid grid-cols-2 gap-4">
                              <OSDChartWithFullScreen
                                title={`osd.${osdId} R/W Bytes`}
                                series={[
                                  { name: 'Reads', data: [15, 18, 22, 28, 32, 40], color: chartColors.cyan400 },
                                  { name: 'Writes', data: [8, 10, 12, 15, 18, 22], color: chartColors.emerald400 },
                                ]}
                                timeLabels={['15:50', '15:05', '15:20', '15:35', '16:50']}
                                yAxisUnit=" B"
                              />
                            </div>
                          </div>
                        </SectionCardContent>
                      </SectionCard>
                      
                      {/* Physical Device Data Section */}
                      <SectionCard>
                        <SectionCardHeader title={`PHYSICAL DEVICE DATA FOR OSD.${osdId}`} />
                        <SectionCardContent>
                          <div className="flex flex-col gap-4">
                            {/* Top row - 2 charts */}
                            <div className="grid grid-cols-2 gap-4">
                              <OSDChartWithFullScreen
                                title={`Physical Device Latency for osd.${osdId}`}
                                series={[
                                  { name: 'dm-0 Reads', data: [180, 350, 420, 550, 680, 750], color: chartColors.cyan400 },
                                  { name: 'dm-0 Writes', data: [50, 80, 100, 120, 150, 180], color: chartColors.emerald400 },
                                ]}
                                timeLabels={['15:50', '15:05', '15:20', '15:35', '16:50']}
                                yAxisUnit=" µs"
                              />
                              <OSDChartWithFullScreen
                                title={`Physical Device R/W IOPS for osd.${osdId}`}
                                series={[
                                  { name: 'dm-0 Reads', data: [50, 80, 100, 140, 170, 200], color: chartColors.cyan400 },
                                  { name: 'dm-0 Writes', data: [30, 50, 70, 90, 110, 130], color: chartColors.emerald400 },
                                ]}
                                timeLabels={['15:50', '15:05', '15:20', '15:35', '16:50']}
                                yAxisUnit=""
                              />
                            </div>
                            {/* Bottom row - 2 charts */}
                            <div className="grid grid-cols-2 gap-4">
                              <OSDChartWithFullScreen
                                title={`Physical Device R/W Bytes for osd.${osdId}`}
                                series={[
                                  { name: 'dm-0 Reads', data: [350, 450, 550, 700, 900, 1100], color: chartColors.cyan400 },
                                  { name: 'dm-0 Writes', data: [200, 280, 350, 450, 550, 650], color: chartColors.emerald400 },
                                ]}
                                timeLabels={['15:50', '15:05', '15:20', '15:35', '16:50']}
                                yAxisUnit=" kiB/s"
                              />
                              <OSDChartWithFullScreen
                                title={`Physical Device Util% for osd.${osdId}`}
                                series={[
                                  { name: 'dm-0 Util%', data: [2.5, 4.0, 5.5, 6.5, 8.0, 9.5], color: chartColors.cyan400 },
                                ]}
                                timeLabels={['15:50', '15:05', '15:20', '15:35', '16:50']}
                                yAxisUnit="%"
                              />
                            </div>
                          </div>
                        </SectionCardContent>
                      </SectionCard>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OSDDetailPage;

