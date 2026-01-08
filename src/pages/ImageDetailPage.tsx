import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import type { ECharts } from 'echarts';
import {
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  MonitoringToolbar,
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
  emerald500: '#10b981',
  amber500: '#f59e0b',
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate800: '#1e293b',
};


/* ----------------------------------------
   Performance Line Chart Component
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
  timeControls
}: PerformanceChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    Object.fromEntries(series.map(s => [s.name, true]))
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

  const allVisible = Object.values(visibleSeries).every(v => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map(s => [s.name, newState])));
  };

  const handleFullScreen = () => {
    setMenuOpen(false);
    if (onFullScreen) onFullScreen();
  };

  // Get theme-aware colors
  const splitLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.slate100;
  const splitLineOpacity = isDarkMode ? 1 : 0.5;
  const tooltipBg = isDarkMode ? '#1C1C1C' : 'white';
  const tooltipBorder = isDarkMode ? '#3a3a3a' : '#e2e8f0';
  const tooltipTextColor = isDarkMode ? '#e5e5e5' : chartColors.slate800;

  // Calculate max value for exactly 5 Y-axis labels
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
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        padding: [0, 0, 0, 15]
      },
      boundaryGap: false
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: niceMax || 1,
      interval: niceInterval || 0.25,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: splitLineColor, opacity: splitLineOpacity }
      },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: (v: number) => `${v}${yAxisUnit}`
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
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { color: s.color, width: 1 },
        itemStyle: { color: s.color },
        areaStyle: { color: s.color, opacity: 0.1 },
        data: s.data
      }))
  };

  return (
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
function ImageChartWithFullScreen({
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
          <div className="fullScreenOverlay" onClick={() => { setFullScreenChart(null); setContainerReady(false); }} />
          <div className="fullScreenFloating" ref={fullScreenContainerRef}>
            {containerReady && (
              <PerformanceChart
                title={fullScreenChart.title}
                series={fullScreenChart.series}
                timeLabels={fullScreenChart.timeLabels}
                yAxisUnit={fullScreenChart.yAxisUnit}
                isFullScreen={true}
                onExitFullScreen={() => { setFullScreenChart(null); setContainerReady(false); }}
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

interface ImageDetail {
  id: string;
  name: string;
  pool: string;
  size: string;
  objects: number;
  objectSize: string;
  totalProvisioned: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockImageDetail: ImageDetail = {
  id: 'img-1',
  name: 'volume-1d325cdb-2b44-4596-9c32-e280184ad2e6.deleted',
  pool: 'volumes',
  size: '18.4 GiB',
  objects: 256,
  objectSize: '18.4 GiB',
  totalProvisioned: '18.4 GiB',
};

// Mock chart data
const timeLabels = ['13:00', '13:10', '13:20', '13:30', '13:40', '13:50'];

const iopsData = {
  reads: [125, 128, 130, 127, 132, 135],
  writes: [122, 125, 128, 124, 129, 131],
};

const throughputData = {
  reads: [350, 380, 420, 390, 450, 480],
  writes: [150, 160, 180, 170, 200, 220],
};

const latencyData = {
  average: [125, 128, 130, 127, 132, 135],
};

/* ----------------------------------------
   Image Detail Page
   ---------------------------------------- */

export function ImageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel } = useTabs();

  // Use mock data (in real app, fetch based on id)
  const imageData = mockImageDetail;

  // Update tab label to match the image name (most recent breadcrumb)
  useEffect(() => {
    if (imageData?.name) {
      updateActiveTabLabel(imageData.name);
    }
  }, [imageData?.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Chart series
  const iopsSeries: ChartSeries[] = [
    { name: 'Reads', data: iopsData.reads, color: chartColors.emerald500 },
    { name: 'Writes', data: iopsData.writes, color: chartColors.amber500 },
  ];

  const throughputSeries: ChartSeries[] = [
    { name: 'Reads', data: throughputData.reads, color: chartColors.emerald500 },
    { name: 'Writes', data: throughputData.writes, color: chartColors.amber500 },
  ];

  const latencySeries: ChartSeries[] = [
    { name: 'Average latency', data: latencyData.average, color: chartColors.emerald500 },
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

          {/* Top Bar */}
          <TopBar
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Images', href: '/storage/images' },
                  { label: imageData.name },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                label="Notifications"
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6} className="min-w-[1176px] max-w-[1320px]">
              {/* Page Header with Info Cards */}
              <DetailHeader>
                <DetailHeader.Title>{imageData.name}</DetailHeader.Title>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Pool"
                    value={imageData.pool}
                    status="active"
                  />
                  <DetailHeader.InfoCard
                    label="Size"
                    value={imageData.size}
                  />
                  <DetailHeader.InfoCard
                    label="Objects"
                    value={String(imageData.objects)}
                  />
                  <DetailHeader.InfoCard
                    label="Object size"
                    value={imageData.objectSize}
                  />
                  <DetailHeader.InfoCard
                    label="Total provisioned"
                    value={imageData.totalProvisioned}
                  />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                  <TabList>
                    <Tab>Performance</Tab>
                  </TabList>

                  {/* Performance Tab Panel */}
                  <TabPanel value={0} className="pt-0">
                    <VStack gap={6} className="pt-4">
                      {/* Monitoring Time Controls */}
                      <div className="flex justify-end w-full">
                        <MonitoringToolbar />
                      </div>

                      {/* Charts - Two on top row, one below */}
                      <div className="flex gap-4 w-full">
                        <div className="flex-1">
                          <ImageChartWithFullScreen
                            title="IOPS"
                            series={iopsSeries}
                            timeLabels={timeLabels}
                          />
                        </div>
                        <div className="flex-1">
                          <ImageChartWithFullScreen
                            title="Throughput"
                            series={throughputSeries}
                            timeLabels={timeLabels}
                          />
                        </div>
                      </div>

                      {/* Average Latency Chart - Half width below */}
                      <div className="flex gap-4 w-full">
                        <div className="flex-1">
                          <ImageChartWithFullScreen
                            title="Average Latency"
                            series={latencySeries}
                            timeLabels={timeLabels}
                            yAxisUnit="ms"
                          />
                        </div>
                        <div className="flex-1" />
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

export default ImageDetailPage;
