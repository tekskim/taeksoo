import { useState, useEffect, useRef } from 'react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import {
  Section,
  Label,
  ColorSwatch,
  SemanticColorTable,
  SpacingSwatch,
  TokenCard,
  IconDisplayGrid,
} from './design-system-sections/HelperComponents';
import {
  QuotaBarDemo,
  AreaChartDemo,
  PieChartDemo,
  DoughnutChartDemo,
  HalfDoughnutChartDemo,
} from './design-system-sections/ChartComponents';
import {
  ModalDemo,
  ModalUseCaseDemo,
  DrawerDemo,
  AIAgentModalDemo,
} from './design-system-sections/OverlayDemos';

// App icons
import AppIconAdminCenter from '@/assets/appIcon/admincenter.png';
import AppIconAgentOps from '@/assets/appIcon/agentops.png';
import AppIconAIPlatform from '@/assets/appIcon/aiplatform.png';
import AppIconCloudBuilder from '@/assets/appIcon/cloudbuilder.png';
import AppIconCompute from '@/assets/appIcon/compute.png';
import AppIconComputeAdmin from '@/assets/appIcon/computeadmin.png';
import AppIconContainer from '@/assets/appIcon/container.png';
import AppIconIAM from '@/assets/appIcon/iam.png';
import AppIconSettings from '@/assets/appIcon/settings.png';
import AppIconStorage from '@/assets/appIcon/storage.png';
import AppIconStorageAdmin from '@/assets/appIcon/storageadmin.png';
import {
  Button,
  Input,
  Textarea,
  NumberInput,
  SearchInput,
  FilterSearchInput,
  type FilterField,
  type AppliedFilter,
  Select,
  Slider,
  RangeSlider,
  Chip,
  SelectionIndicator,
  DatePicker,
  WindowControl,
  WindowControls,
  ContextMenu,
  ProgressBar,
  Pagination,
  TopBar,
  TopBarAction,
  TabBar,
  useTabBar,
  Table,
  Toggle,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  FormField,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  InlineMessage,
  Disclosure,
  Badge,
  Breadcrumb,
  StatusIndicator,
  VStack,
  HStack,
  MenuItem,
  MenuSection,
  Tooltip,
  Popover,
  DetailHeader,
  SectionCard,
  MonitoringToolbar,
  NotificationCenter,
  Loading,
  WizardSummary,
  WizardSectionStatusIcon,
  PreSection,
  WritingSection,
  SkippedSection,
  DoneSection,
  DoneSectionRow,
  IconUbuntu,
  IconRocky,
  IconGrid,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import type { NotificationItem } from '@/design-system/components/NotificationCenter';
import {
  // Navigation icons (for sidebar)
  IconPalette,
  IconTypography,
  IconBoxMultiple,
  IconClick,
  IconForms,
  IconTag,
  IconMenu2,
  IconLayoutGrid,
  IconSquareCheck,
  IconToggleRight,
  IconCircle,
  IconLayoutNavbar,
  IconSelector,
  // Basic - Actions
  IconPlayerPlay,
  IconPlayerStop,
  IconPlayerPause,
  IconRefresh,
  IconRotate,
  IconTrash,
  IconEdit,
  IconCopy,
  IconShare,
  IconDownload,
  IconUpload,
  IconPlus,
  IconCirclePlus,
  IconLink,
  IconUnlink,
  IconExternalLink,
  IconHistory,
  IconSend,
  // Basic - Navigation
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconArrowRight,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconDotsCircleHorizontal,
  IconDots,
  IconDotsVertical,
  // Basic - Status & Feedback
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconCircleCheck,
  IconBan,
  IconLoader,
  IconLoader2,
  IconProgress,
  // Basic - UI
  IconSearch,
  IconFilter,
  IconSettings,
  IconHome,
  IconBell,
  IconBellRinging,
  IconStar,
  IconStarFilled,
  IconHeart,
  IconEye,
  IconEyeOff,
  IconLock,
  IconX,
  IconCheck,
  IconUser,
  IconMail,
  IconMessage,
  IconHelp,
  IconList,
  // System - Infrastructure
  IconServer,
  IconServer2,
  IconDatabase,
  IconDatabaseExport,
  IconNetwork,
  IconRouter,
  IconCube,
  IconScale,
  IconWorldWww,
  IconShield,
  IconKey,
  IconCpu,
  IconPlug,
  // System - Storage & Files
  IconDeviceFloppy,
  IconCamera,
  IconFile,
  IconFileText,
  IconArchive,
  IconTemplate,
  IconCode,
  // System - Monitoring & Analytics
  IconTerminal,
  IconTerminal2,
  IconPower,
  IconActivity,
  IconChartBar,
  IconChartDonut,
  IconGauge,
  IconDeviceDesktop,
  IconDeviceDesktopAnalytics,
  // System - Organization
  IconTopologyRing,
  IconTopologyStar3,
  IconCertificate,
  IconBuilding,
  IconCategory,
  IconStack2,
  IconUserCircle,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconListNumbers,
  IconAdjustments,
  IconBolt,
  IconCloud,
  IconGitBranch,
  IconBrain,
  IconRobot,
  IconMessageChatbot,
  IconBooks,
  IconTestPipe,
  IconClock,
  IconHourglass,
  IconCurrencyDollar,
  IconLanguage,
  IconMessage2,
  IconCalendar,
  IconAppWindow,
  IconBorderAll,
  IconBrandDebian,
  IconBrandWindows,
  IconBrandRedhat,
  IconApps,
  // Additional Tabler Icons
  IconArrowLeft,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
  IconMoon,
  IconSun,
  IconFolder,
  IconFolderOpen,
  IconInfinity,
  IconTarget,
  IconShieldLock,
  IconShieldCheck,
  IconPlugConnected,
  IconCircleOff,
  IconTool,
  IconTransfer,
  IconPencil,
  IconTrashX,
  IconRefreshDot,
  IconRotateClockwise,
  IconCaretDownFilled,
  IconCaretRightFilled,
  IconAlertOctagon,
  IconHelpCircle,
  IconPoint,
  IconSquarePlus,
  IconDatabaseSearch,
  IconDeviceSdCard,
  IconServerCog,
  IconRobotFace,
  IconBook,
  IconArticle,
  IconMessagePlus,
  IconLinkOff,
  IconGridDots,
  IconArrowsSort,
  IconQuestionMark,
  IconCircleDot,
  IconLayoutSidebarLeftCollapse,
  IconDisc,
  IconStopwatch,
} from '@tabler/icons-react';

// Custom Icons from design-system
import {
  IconExpandOff,
  IconExpandOn,
  IconAction,
} from '@/design-system/components/Icons/CustomIcons';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Navigation Items
   ---------------------------------------- */

// Foundation items (기초 토큰/스타일)
const foundationItems = [
  { id: 'token-architecture', label: 'Token architecture', icon: IconLayoutGrid },
  { id: 'primitive-colors', label: 'Primitive colors', icon: IconPalette },
  { id: 'semantic-colors', label: 'Semantic colors', icon: IconPalette },
  { id: 'typography', label: 'Typography', icon: IconTypography },
  { id: 'spacing-radius', label: 'Spacing & Radius', icon: IconBoxMultiple },
  { id: 'borders', label: 'Borders', icon: IconBorderAll },
  { id: 'shadows', label: 'Shadows', icon: IconBoxMultiple },
  { id: 'transitions', label: 'Transitions', icon: IconActivity },
  { id: 'icons', label: 'Icons', icon: IconStar },
  { id: 'app-icons', label: 'App icons', icon: IconApps },
];

// Component items (UI 컴포넌트)

// Form Controls - 사용자 입력을 받는 컴포넌트
const formControlItems = [
  { id: 'button', label: 'Button', icon: IconClick },
  { id: 'input', label: 'Input', icon: IconForms },
  { id: 'form-field-spacing', label: 'Form Field Spacing', icon: IconLayoutGrid },
  { id: 'filter-search-input', label: 'Filter search Input', icon: IconSearch },
  { id: 'select', label: 'Select', icon: IconSelector },
  { id: 'datepicker', label: 'DatePicker', icon: IconCalendar },
  { id: 'slider', label: 'Slider', icon: IconAdjustments },
  { id: 'toggle', label: 'Toggle', icon: IconToggleRight },
  { id: 'checkbox', label: 'Checkbox', icon: IconSquareCheck },
  { id: 'radio', label: 'Radio', icon: IconCircle },
];

// Data Display - 데이터를 표시하는 컴포넌트
const dataDisplayItems = [
  { id: 'table', label: 'Table', icon: IconList },
  { id: 'badge', label: 'Badge', icon: IconTag },
  { id: 'chip', label: 'Chip', icon: IconTag },
  { id: 'status-indicator', label: 'Status indicator', icon: IconActivity },
  { id: 'pagination', label: 'Pagination', icon: IconProgress },
  { id: 'selection-indicator', label: 'SelectionIndicator', icon: IconSquareCheck },
];

// Feedback - 사용자에게 피드백을 제공하는 컴포넌트
const feedbackItems = [
  { id: 'inline-message', label: 'Inline message', icon: IconInfoCircle },
  { id: 'loading', label: 'Loading', icon: IconLoader2 },
];

// Navigation - 네비게이션 관련 컴포넌트
const navigationItems = [
  { id: 'topbar', label: 'TopBar', icon: IconLayoutNavbar },
  { id: 'tabbar', label: 'TabBar', icon: IconLayoutNavbar },
  { id: 'tabs', label: 'Tabs', icon: IconLayoutNavbar },
  { id: 'breadcrumb', label: 'Breadcrumb', icon: IconChevronRight },
];

// Overlay - 오버레이 컴포넌트
const overlayItems = [
  { id: 'tooltip', label: 'Tooltip', icon: IconMessage2 },
  { id: 'popover', label: 'Popover', icon: IconMessage2 },
  { id: 'menu', label: 'Menu', icon: IconMenu2 },
  { id: 'context-menu', label: 'Context menu', icon: IconMenu2 },
  { id: 'modal', label: 'Modal', icon: IconLayoutGrid },
  { id: 'drawer', label: 'Drawer', icon: IconLayoutGrid },
  { id: 'notification-center', label: 'Notification center', icon: IconBell },
  { id: 'toast', label: 'Toast', icon: IconBell },
  { id: 'global-notification-panel', label: 'Global notification panel', icon: IconBell },
  { id: 'floating-card', label: 'Floating card', icon: IconLayoutGrid },
];

// Layout & Structure - 레이아웃 및 구조 컴포넌트
const layoutItems = [
  { id: 'disclosure', label: 'Disclosure', icon: IconSelector },
  { id: 'window-control', label: 'Window control', icon: IconAppWindow },
  { id: 'scrollbar', label: 'Scrollbar', icon: IconLayoutSidebar },
  { id: 'common-patterns', label: 'Common patterns', icon: IconTemplate },
  { id: 'detail-header', label: 'Detail header', icon: IconLayoutNavbar },
  { id: 'section-card', label: 'Section card', icon: IconLayoutGrid },
  { id: 'wizard', label: 'Wizard (Create Flow)', icon: IconListNumbers },
  { id: 'monitoring-toolbar', label: 'Monitoring toolbar', icon: IconRefresh },
  { id: 'csv-download', label: 'CSV file download', icon: IconDownload },
  { id: 'shell', label: 'Shell', icon: IconTerminal2 },
  { id: 'layout', label: 'Layout', icon: IconLayoutSidebar },
];

// Graphs - 차트 컴포넌트
const graphItems = [
  { id: 'chart-overview', label: 'Chart overview', icon: IconChartBar },
  { id: 'status-colors', label: 'Status colors', icon: IconPalette },
  { id: 'gauge-bar-chart', label: 'Gauge bar chart', icon: IconChartBar },
  { id: 'area-chart', label: 'Area chart', icon: IconChartBar },
  { id: 'pie-chart', label: 'Pie chart', icon: IconActivity },
  { id: 'half-doughnut-chart', label: 'Half-Doughnut chart', icon: IconGauge },
  { id: 'doughnut-chart', label: 'Doughnut chart', icon: IconChartDonut },
];

// All component items
const componentItems = [
  ...formControlItems,
  ...dataDisplayItems,
  ...feedbackItems,
  ...navigationItems,
  ...overlayItems,
  ...layoutItems,
  ...graphItems,
];

// All items for intersection observer
const navItems = [...foundationItems, ...componentItems];

/* ----------------------------------------
   Filter search Input Demo
   ---------------------------------------- */

function FilterSearchInputDemo() {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  // Define available filter fields
  const filterFields: FilterField[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name...',
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'shutoff', label: 'Shutoff' },
        { value: 'building', label: 'Building' },
        { value: 'error', label: 'Error' },
      ],
    },
    {
      id: 'image',
      label: 'Image',
      type: 'text',
      placeholder: 'Enter image name...',
    },
    {
      id: 'flavor',
      label: 'Flavor',
      type: 'select',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <FilterSearchInput
        filters={filterFields}
        appliedFilters={appliedFilters}
        onFiltersChange={setAppliedFilters}
        placeholder="Search instance by attributes"
        className="w-[var(--search-input-width)]"
      />
      <div className="text-[11px] text-[var(--color-text-subtle)] bg-[var(--color-surface-muted)] p-3 rounded-md">
        <strong>Usage:</strong> Click the input to see available filters. Select a filter type, then
        enter a value (text) or choose from options (select). Applied filters appear as removable
        tags below the input.
      </div>
    </div>
  );
}

/* ----------------------------------------
   OpenSection Demo Component (Basic Form)
   ---------------------------------------- */

function OpenSectionDemo() {
  const [instanceName, setInstanceName] = useState('');
  const [instanceNameError, setInstanceNameError] = useState<string | null>(null);

  const handleNextClick = () => {
    if (!instanceName.trim()) {
      setInstanceNameError('Instance name is required.');
      return;
    }
    setInstanceNameError(null);
    console.log('Next clicked - instance name:', instanceName);
  };

  const handleInstanceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstanceName(e.target.value);
    if (instanceNameError && e.target.value.trim()) {
      setInstanceNameError(null);
    }
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header title="Basic information" showDivider={false} />
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Instance name */}
          <VStack gap={2} className="py-6">
            <label className="text-label-lg text-[var(--color-text-default)]">
              Instance name <span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </label>
            <VStack gap={2}>
              <Input
                placeholder="Enter instance name"
                fullWidth
                value={instanceName}
                onChange={handleInstanceNameChange}
                error={!!instanceNameError}
              />
              {instanceNameError && (
                <span className="text-body-sm text-[var(--color-state-danger)]">
                  {instanceNameError}
                </span>
              )}
            </VStack>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              You can use letters, numbers, and special characters (+=.@-_).
            </span>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* AZ (Availability zone) */}
          <VStack gap={2} className="py-6">
            <label className="text-label-lg text-[var(--color-text-default)]">
              AZ (Availability zone){' '}
              <span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </label>
            <Select
              options={[
                { value: 'nova', label: 'nova (Default)' },
                { value: 'az-1', label: 'az-1' },
                { value: 'az-2', label: 'az-2' },
              ]}
              value="nova"
              onChange={() => {}}
              placeholder="Select AZ"
              fullWidth
            />
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              Select the availability zone for the instance.
            </span>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Next Button */}
          <HStack justify="end" className="pt-3">
            <Button variant="primary" onClick={handleNextClick}>
              Next
            </Button>
          </HStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   OpenSection Table Demo Component
   ---------------------------------------- */

interface DemoImageRow {
  id: string;
  status: 'active' | 'building' | 'error';
  name: string;
  version: string;
  size: string;
  minDisk: string;
  minRam: string;
  access: string;
  os: 'ubuntu' | 'windows' | 'rocky' | 'other';
}

const demoImages: DemoImageRow[] = [
  {
    id: 'e920j10d',
    status: 'active',
    name: 'ubuntu-22.04-tk-base',
    version: '22.04',
    size: '709.98 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'ubuntu',
  },
  {
    id: 'e920j20d',
    status: 'active',
    name: 'ubuntu-20.04-tk-base',
    version: '20.04',
    size: '650.00 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'ubuntu',
  },
  {
    id: 'e920j30d',
    status: 'active',
    name: 'windows-server-2022',
    version: '2022',
    size: '4.5 GiB',
    minDisk: '40.00 GiB',
    minRam: '4 GiB',
    access: 'Public',
    os: 'windows',
  },
  {
    id: 'e920j40d',
    status: 'active',
    name: 'rocky-8.9-tk-base',
    version: '8.9',
    size: '850.11 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'rocky',
  },
  {
    id: 'e920j50d',
    status: 'building',
    name: 'centos-stream-9',
    version: '9',
    size: '920.00 MiB',
    minDisk: '10.00 MiB',
    minRam: '0 MiB',
    access: 'Public',
    os: 'other',
  },
];

function OpenSectionTableDemo() {
  const [sourceTab, setSourceTab] = useState<'image' | 'snapshot' | 'volume'>('image');
  const [osFilter, setOsFilter] = useState<'ubuntu' | 'windows' | 'rocky' | 'other'>('other');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceError, setSourceError] = useState<string | null>(null);

  // Filter images
  const filteredImages = demoImages.filter((img) => {
    const matchesOs = osFilter === 'other' || img.os === osFilter;
    const matchesSearch =
      searchQuery === '' || img.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOs && matchesSearch;
  });

  const selectedImage = demoImages.find((img) => img.id === selectedImageId);

  // Handle image selection - clears error when selecting
  const handleImageSelect = (id: string) => {
    setSelectedImageId(id);
    setSourceError(null);
  };

  // Handle Next button click - validates selection
  const handleNextClick = () => {
    if (!selectedImageId) {
      setSourceError('Please select a start source.');
      return;
    }
    setSourceError(null);
    console.log('Next clicked - selected:', selectedImageId);
  };

  const imageColumns = [
    {
      key: 'select',
      label: '',
      width: fixedColumns.select,
      render: (_: unknown, row: DemoImageRow) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Radio
            value={row.id}
            checked={selectedImageId === row.id}
            onChange={() => handleImageSelect(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_: unknown, row: DemoImageRow) => (
        <StatusIndicator layout="icon-only" status={row.status} />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: columnMinWidths.name,
      render: (value: string, row: DemoImageRow) => (
        <VStack gap={0}>
          <span className="text-[var(--color-action-primary)] text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium">
            {value}
          </span>
          <span className="text-[11px] text-[var(--color-text-subtle)]">ID: {row.id}</span>
        </VStack>
      ),
    },
    { key: 'version', label: 'Version', sortable: true },
    { key: 'size', label: 'Size', sortable: true, align: 'right' as const },
    { key: 'minDisk', label: 'Min disk', sortable: true, align: 'right' as const },
    { key: 'access', label: 'Visibility', sortable: true },
  ];

  return (
    <div className="w-[840px]">
      <SectionCard isActive>
        <SectionCard.Header title="Source" showDivider={false} />
        <SectionCard.Content showDividers={false}>
          <VStack gap={0}>
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />

            {/* Start Source */}
            <VStack gap={2} className="py-6">
              <label className="text-label-lg text-[var(--color-text-default)]">
                Start source<span className="ml-1 text-[var(--color-state-danger)]">*</span>
              </label>
              <span className="text-body-md text-[var(--color-text-subtle)] mb-2">
                Select a template to launch the instance. You can start from an OS image, a
                snapshot, or an existing volume.
              </span>

              {/* Source Tabs */}
              <Tabs
                value={sourceTab}
                onChange={(v) => setSourceTab(v as 'image' | 'snapshot' | 'volume')}
                variant="underline"
                size="sm"
              >
                <TabList>
                  <Tab value="image">Image</Tab>
                  <Tab value="snapshot">Instance snapshot</Tab>
                  <Tab value="volume">Bootable volume</Tab>
                </TabList>
              </Tabs>

              {/* OS Filter Tabs (Capsule) - Only show for Image tab */}
              {sourceTab === 'image' && (
                <div className="mt-2">
                  <div className="inline-flex gap-1 p-1 bg-[var(--color-surface-subtle)] shadow-[inset_0_0_0_1px_var(--color-border-default)] rounded-[8px] w-fit">
                    {(['other', 'ubuntu', 'windows', 'rocky'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setOsFilter(filter);
                          setCurrentPage(1);
                        }}
                        className={`
                        flex items-center gap-1 px-[10px] py-[6px] rounded-[6px] text-[12px] font-medium leading-5 text-center transition-all
                        ${
                          osFilter === filter
                            ? 'bg-[var(--color-surface-default)] shadow-[inset_0_0_0_1px_var(--color-border-default),0_1px_2px_0_rgba(0,0,0,0.05)] text-[var(--color-action-primary)]'
                            : 'bg-transparent text-[var(--color-text-default)]'
                        }
                      `}
                      >
                        {filter === 'other' && <IconDots size={14} />}
                        {filter === 'ubuntu' && <IconUbuntu size={14} />}
                        {filter === 'windows' && <IconGrid size={14} />}
                        {filter === 'rocky' && <IconRocky size={14} />}
                        {filter === 'other'
                          ? 'Others'
                          : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search */}
              <SearchInput
                placeholder="Search image by attributes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                size="sm"
                className="w-[var(--search-input-width)] mt-2"
              />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredImages.length / 5) || 1}
                totalItems={filteredImages.length}
                onPageChange={setCurrentPage}
              />

              <VStack gap={2}>
                {/* Table */}
                <div className="w-[806px]">
                  <Table
                    columns={imageColumns}
                    data={filteredImages}
                    rowKey="id"
                    onRowClick={(row) => handleImageSelect(row.id)}
                  />
                </div>

                {/* Selection Indicator (with built-in error state) */}
                <SelectionIndicator
                  selectedItems={
                    selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []
                  }
                  onRemove={() => setSelectedImageId(null)}
                  error={!!sourceError}
                  errorMessage={sourceError || undefined}
                />
              </VStack>
            </VStack>

            {/* Divider + Next Button */}
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
            <HStack justify="end" className="pt-3">
              <Button variant="primary" onClick={handleNextClick}>
                Next
              </Button>
            </HStack>
          </VStack>
        </SectionCard.Content>
      </SectionCard>
    </div>
  );
}

/* ----------------------------------------
   Wizard Pattern Section
   ---------------------------------------- */

function WizardPatternSection() {
  const [sectionStatus, setSectionStatus] = useState<Record<string, WizardSectionState>>({
    'launch-type': 'done',
    'basic-info': 'active',
    source: 'writing',
    flavor: 'pre',
    network: 'pre',
    advanced: 'skipped',
  });

  const summaryItems: WizardSummaryItem[] = [
    { key: 'launch-type', label: 'Launch type', status: sectionStatus['launch-type'] },
    { key: 'basic-info', label: 'Basic information', status: sectionStatus['basic-info'] },
    { key: 'source', label: 'Source', status: sectionStatus['source'] },
    { key: 'flavor', label: 'Flavor', status: sectionStatus['flavor'] },
    { key: 'network', label: 'Network', status: sectionStatus['network'] },
    { key: 'advanced', label: 'Advanced', status: sectionStatus['advanced'] },
  ];

  const handleStatusChange = (key: string, status: WizardSectionState) => {
    setSectionStatus((prev) => ({ ...prev, [key]: status }));
  };

  return (
    <VStack gap={8}>
      {/* 1. 개요 */}
      <VStack gap={3}>
        <Label>1. 개요</Label>
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                하나의 리소스를 생성하기 위한 필수 입력값이 많을 경우, 단계를 나눠 사용자가 입력값을
                놓치지 않고 리소스를 생성할 수 있도록 하는 UX 패턴입니다.
              </p>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">레이아웃</h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Create Resource(자원 생성) 페이지는 <strong>Two columns layout</strong>으로
                구성됩니다. 왼쪽에는 &apos;Input card&apos;가 배치되고 오른쪽에는 &apos;Floating
                card&apos;가 배치됩니다.
              </p>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">적용 기준</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>사용자가 길고 복잡한 리소스 구성을 하는 리소스 생성에 사용을 권장합니다.</li>
                <li>
                  <strong>필수 입력이 5개의 항목을 초과하는 경우</strong> 적용합니다.
                </li>
              </ul>
            </VStack>
          </VStack>
        </div>
      </VStack>

      {/* 2. 구성요소 */}
      <VStack gap={3}>
        <Label>2. 구성요소</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
              입력 카드 (Input Card)
            </h4>
            <p className="text-body-sm text-[var(--color-text-muted)]">
              각 단계별 입력 필드를 포함하는 카드. 6가지 상태(미작성, 입력 중, 시작, 수정, 완료,
              자동 입력)를 가집니다.
            </p>
          </div>
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">Floating Card</h4>
            <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
              Create/Edit 페이지에서 고정된 위치로 표시 (기본 position: <code>top-left</code>,
              스크롤 시에도 sticky 유지)
            </p>
            <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
              <li>
                <strong>Summary</strong> — 단계명 및 단계별 상태
              </li>
              <li>
                <strong>쿼터 정보</strong>(선택) — 생성 가능한 리소스의 잔여량, 진행률 바 표기
              </li>
              <li>
                <strong>Cancel</strong> — 클릭 시 이전 화면으로 이동
              </li>
              <li>
                <strong>Create</strong> — 모든 입력 카드가 요약 상태가 되면 활성화
              </li>
            </ul>
          </div>
        </div>
      </VStack>

      {/* 3. Input card 상태 정책 */}
      <VStack gap={3}>
        <Label>3. Input card 상태 정책</Label>
        <p className="text-body-md text-[var(--color-text-muted)]">
          각 단계 카드는 다음 6가지 상태 중 하나를 가집니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                  상태
                </th>
                <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                  표시
                </th>
                <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                  설명
                </th>
                <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                  Footer 버튼
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  1) 미작성 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">접힘</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  사용자가 아직 해당 단계에 한 번도 진입하지 않은 상태. 카드 헤더만 보이며, 이전
                  단계가 완료되기 전까지 열리지 않음.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">—</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  2) 입력 중 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">접힘</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  작성 중이던 카드가, 다른 카드를 편집하기 위해 이동하면서 닫힌 상태. '작성 중'
                  표시. 입력값은 자동 저장.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">—</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  3) 시작 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">열림</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  처음 해당 단계에 진입해 값을 입력하는 상태. 필드 전체 활성화.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">Next / Skip(선택)</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  4) 수정 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">열림</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  이미 완료된 단계를 다시 열어 수정하는 상태. 필드 전체 활성화, 기존 입력값 유지.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">Cancel / Done</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  5) 완료 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">요약</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  필수 입력이 완료된 단계. Summary가 표시되며 Edit 버튼 제공. 스킵 시 Summary 생략.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">Edit</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                  6) 자동 입력 카드
                </td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">요약</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                  자동 입력값이 설정되었거나, 필수 입력이 없는 고급(advanced) 단계.
                  &apos;Auto-filled&apos; 표시. Edit 버튼 제공.
                </td>
                <td className="py-2 text-[var(--color-text-muted)]">Edit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </VStack>

      {/* 4. 단계 진행 플로우 정책 */}
      <VStack gap={3}>
        <Label>4. 단계 진행 플로우 정책</Label>
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">기본 정책</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  생성 플로우는 <strong>순차적 진행</strong>을 기본으로 한다.
                </li>
                <li>사용자는 1단계부터 순서대로 진행하며, 한 번에 하나의 단계만 열린다.</li>
                <li>단계 간 이동 시 입력값은 항상 보존된다.</li>
                <li>입력 중에 다른 카드를 수정하더라도, 입력 중인 값은 보존된다.</li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                이전 단계 수정(Edit) 시 이동 규칙
              </h4>
              <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>현재 단계는 닫힘 상태(입력 중 카드)로 전환</li>
                <li>수정 단계만 열림 상태(수정 카드)로 전환</li>
                <li>수정 단계 완료 후 요약 상태(완료 카드)로 전환</li>
                <li>수정 이전의 단계로 복귀 — 열림 상태(시작 카드)로 전환, 입력값 유지</li>
              </ol>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                <span className="text-[var(--color-state-danger)]">(예외)</span> 수정이 다른 단계에
                영향을 주는 경우
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                종속성이 있는 단계의 입력값이 리셋되고, 해당 단계는 열림 상태(시작 카드)로
                전환됩니다.
              </p>
              <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                  시나리오 예시: 5단계 작성 중 2단계를 수정, 3단계에 종속성 영향
                </p>
                <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre-wrap font-mono leading-relaxed">{`Step 5 작성 중 → Step 2 Edit 클릭
  Step 5 → 닫힘 (입력 중 카드)
  Step 2 → 열림 (수정 카드)
Step 2 Done 클릭
  Step 2 → 요약 (완료 카드)
  Step 3 → 종속성 영향으로 일부 값 Reset
  Step 3 → 열림 (시작 카드, 리셋된 항목 제외 기존값 유지)
Step 3 Next 클릭
  Step 3 → 요약 (완료 카드)
  Step 5 → 열림 (시작 카드, 기존 입력값 유지)`}</pre>
              </div>
            </VStack>
          </VStack>
        </div>
      </VStack>

      {/* 5. 인터랙션 정책 */}
      <VStack gap={3}>
        <Label>5. 인터랙션 정책</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">기본 원칙</h4>
            <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>순차적 진행</strong> — 1단계부터 순서대로, 한 번에 하나의 단계만 활성화
              </li>
              <li>
                <strong>상태 시각화</strong> — 각 카드의 현재 상태를 명확하게 표시
              </li>
              <li>
                <strong>입력값 보존</strong> — 단계 간 이동 시 입력값을 항상 보존하여 데이터 손실
                방지
              </li>
              <li>
                <strong>명확한 액션</strong> — 다음 단계 진행, 수정, 취소 등 명확한 피드백 제공
              </li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
              주요 인터랙션 요소
            </h4>
            <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>Next</strong> — 현재 단계를 완료하고 다음 단계로 진행
              </li>
              <li>
                <strong>Skip</strong> — 현재 단계를 건너뛰고 다음 단계로 진행
              </li>
              <li>
                <strong>Edit</strong> — 완료된 단계를 다시 수정
              </li>
              <li>
                <strong>Done</strong> — 수정을 완료하고 요약 상태로 전환
              </li>
              <li>
                <strong>Cancel</strong> — 수정을 취소하고 이전 상태로 복귀
              </li>
            </ul>
          </div>
        </div>
      </VStack>

      {/* Design Tokens */}
      <VStack gap={3}>
        <Label>Section States (WizardSectionState)</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          'pre' | 'active' | 'done' | 'skipped' | 'writing'
        </div>
      </VStack>

      {/* Status Icons */}
      <VStack gap={3}>
        <Label>Wizard section status icon</Label>
        <HStack gap={6}>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="pre" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              pre (대기)
            </span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="active" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              active (진행 중)
            </span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="done" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              done (완료)
            </span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="skipped" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              skipped (건너뜀)
            </span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="writing" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              writing (작성 중)
            </span>
          </HStack>
        </HStack>
      </VStack>

      {/* WizardSummary */}
      <VStack gap={3}>
        <Label>Wizard summary</Label>
        <div className="w-[var(--wizard-summary-width)]">
          <WizardSummary
            title="Summary"
            items={summaryItems}
            onItemClick={(key) => console.log('Clicked:', key)}
          />
        </div>
      </VStack>

      {/* Section Components */}
      <VStack gap={3}>
        <Label>Section components</Label>
        <VStack gap={4} className="max-w-[600px]">
          {/* PreSection */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              PreSection (대기 중)
            </span>
            <PreSection title="Source" />
          </VStack>

          {/* WritingSection */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              WritingSection (작성 중)
            </span>
            <WritingSection title="Source" />
          </VStack>

          {/* SkippedSection */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              SkippedSection (건너뜀)
            </span>
            <SkippedSection title="Advanced" onEdit={() => console.log('Edit clicked')} />
          </VStack>

          {/* DoneSection */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              DoneSection (완료)
            </span>
            <DoneSection title="Basic information" onEdit={() => console.log('Edit clicked')}>
              <DoneSectionRow label="Instance name" value="my-instance-01" />
              <DoneSectionRow label="AZ" value="nova (Default)" />
              <DoneSectionRow label="Description" value="Test instance for development" />
            </DoneSection>
          </VStack>

          {/* OpenSection (Active) */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              OpenSection (열림/활성)
            </span>
            <OpenSectionDemo />
          </VStack>
        </VStack>

        {/* OpenSection-Table (Active with Table Selection) - Outside max-w container for full table width */}
        <VStack gap={1}>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            OpenSection-Table (테이블 선택)
          </span>
          <OpenSectionTableDemo />
        </VStack>
      </VStack>

      {/* Interactive Demo */}
      <VStack gap={3}>
        <Label>Interactive demo</Label>
        <HStack gap={4} align="start">
          {/* Status Controls */}
          <VStack gap={2} className="w-[200px]">
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              Change Status:
            </span>
            {Object.keys(sectionStatus).map((key) => (
              <HStack key={key} gap={2} align="center" className="w-full">
                <span className="text-[length:var(--font-size-11)] w-[100px] truncate">{key}</span>
                <Select
                  size="sm"
                  value={sectionStatus[key]}
                  onChange={(value) => handleStatusChange(key, value as WizardSectionState)}
                  options={[
                    { value: 'pre', label: 'pre' },
                    { value: 'active', label: 'active' },
                    { value: 'done', label: 'done' },
                    { value: 'skipped', label: 'skipped' },
                    { value: 'writing', label: 'writing' },
                  ]}
                  fullWidth
                />
              </HStack>
            ))}
          </VStack>

          {/* Summary Preview */}
          <div className="w-[var(--wizard-summary-width)]">
            <WizardSummary title="Summary" items={summaryItems} />
          </div>
        </HStack>
      </VStack>

      {/* Usage Code */}
      <VStack gap={3}>
        <Label>Usage</Label>
        <div className="text-[length:var(--font-size-11)] font-mono p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`import { 
  WizardSummary, 
  DoneSection, DoneSectionRow,
  PreSection, WritingSection, SkippedSection,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';

// 섹션 상태 관리
const [sectionStatus, setSectionStatus] = useState<Record<string, WizardSectionState>>({
  'basic-info': 'active',
  'image': 'pre',
  'flavor': 'pre',
});

// Summary 아이템
const summaryItems: WizardSummaryItem[] = [
  { key: 'basic-info', label: 'Basic information', status: sectionStatus['basic-info'] },
  { key: 'image', label: 'Image', status: sectionStatus['image'] },
  { key: 'flavor', label: 'Flavor', status: sectionStatus['flavor'] },
];

// 렌더링
<WizardSummary title="Summary" items={summaryItems} />

<DoneSection title="Basic information" onEdit={() => handleEdit('basic-info')}>
  <DoneSectionRow label="Instance name" value={instanceName} />
  <DoneSectionRow label="AZ" value={az} />
</DoneSection>`}</pre>
        </div>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   Notification center Section
   ---------------------------------------- */

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    message: 'Instance "web-server-01" created successfully.',
    time: '10:23',
    project: 'Proj1',
    isRead: false,
    detail: {
      code: 200,
      message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
    },
  },
  {
    id: '2',
    type: 'success',
    message: 'Volume "data-vol-01" attached to instance.',
    time: '10:15',
    project: 'Proj1',
    isRead: false,
  },
  {
    id: '3',
    type: 'error',
    message: 'Failed to create volume "data-vol-02".',
    time: '09:30',
    project: 'Proj2',
    isRead: false,
    detail: {
      code: 400,
      message:
        "Flavor's disk is smaller than the minimum size specified in image metadata. Flavor disk is 1073741824 bytes, minimum size is 10737418240 bytes.",
    },
  },
  {
    id: '4',
    type: 'warning',
    message: 'Instance "db-server" is running low on disk space.',
    time: '09:15',
    project: 'Proj1',
    isRead: true,
    detail: {
      code: 'WARN_DISK_LOW',
      message: 'Disk usage is at 92%. Consider expanding the volume or cleaning up unused files.',
    },
  },
  {
    id: '5',
    type: 'info',
    message: 'System maintenance scheduled for tomorrow.',
    time: 'Yesterday',
    isRead: true,
  },
];

function NotificationCenterSection() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleReset = () => {
    setNotifications(initialNotifications);
    setSelectedId(undefined);
  };

  return (
    <Section
      id="notification-center"
      title="Notification center"
      description="Centralized notification panel with filtering, read/unread states, and real-time updates"
    >
      <VStack gap={8}>
        {/* 1. 개요 (Overview) */}
        <VStack gap={3}>
          <Label>1. 개요</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    앱 내부 알림센터는 해당 앱에서 발생한 모든 알림의{' '}
                    <strong>원본 기록 공간</strong>이다.
                  </li>
                  <li>
                    토스트 및 전역 알림 패널이 즉각적 인지를 담당한다면, 앱 내부 알림센터는 알림의{' '}
                    <strong>보관</strong>을 담당한다.
                  </li>
                  <li>
                    알림은 <strong>3일간 보관</strong>되며, 이후 자동 삭제된다. (사용자 삭제 불가,
                    읽음 처리 가능)
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  토스트, 전역 패널과의 관계
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-md border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          레이어
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          역할
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          기록 여부
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          동작
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          토스트
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">즉시 인지</td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">X</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          노출 1~3초(최소 1초 보장), 호버 시 일시정지. 실패에는 View details(인라인
                          확장) 제공(읽음 아님).
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          전역 알림 패널
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          모든 앱의 '안읽은' 알림 목록(미러)
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">X</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          필터 없음 · 최신순. 개별 읽음/전체 읽음 제공. 카드 클릭 = 리소스 이동 +
                          읽음 처리. 패널 열려 있으면 토스트 억제.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          앱 알림센터
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          원본 기록/상세 확인
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">O</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          개별/전체 읽음 제공, 실패 상세(View details) 제공(읽음 아님), 3일 자동
                          삭제.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">적용 기준</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    해당 앱의 토스트 메시지(즉시 인지)를 놓쳤거나 히스토리 확인이 필요한 경우
                    사용된다.
                  </li>
                  <li>
                    알림 클릭 시 기본 동작 → 대상 리소스의 상세 화면(없으면 리스트 화면)으로 이동 +
                    해당 알림은 읽음 처리
                  </li>
                  <li>
                    View details(알림 상세) 클릭 시 → 알림센터 내에서 해당 알림 확장 (읽음 아님).
                  </li>
                  <li>
                    알림센터가 열려 있는 동안 새 알림이 발생하면 토스트는 뜨지 않고 알림센터 목록에
                    안읽음으로 직접 추가된다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 2. 구성요소 (Components) */}
        <VStack gap={3}>
          <Label>2. 구성요소</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                알림센터 아이콘
              </h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>클릭 시 알림센터가 열림</li>
                <li>안읽은 알림이 있을 시 붉은 색으로 뱃지가 표시</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">탭</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>전체(All)</strong> → 모든 알림
                </li>
                <li>
                  <strong>안 읽음(Unread)</strong> → 안 읽은 알림만
                </li>
                <li>
                  <strong>실패(Error)</strong> → 실패 알림만
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                전체 읽음 처리 버튼
              </h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>호버 시 툴팁: &quot;Mark all as read&quot;</li>
                <li>클릭 시 현재 알림센터의 모든 알림이 읽음 처리</li>
                <li>알림센터 아이콘에 뱃지 제거</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">개별 알림</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>토스트와 유사한 형태 (유형 아이콘, 메시지 내용, 발생 시각)</li>
                <li>개별 읽음 처리 버튼, 파티션 정보(선택), 상세 보기 버튼(선택)</li>
                <li>읽지 않은 알림과 읽은 알림 구별 표시</li>
                <li>상세 보기 버튼: 실패 알림에서만 존재 (v0.7)</li>
              </ul>
            </div>
          </div>
        </VStack>

        {/* 3. 가이드라인 (Guidelines) */}
        <VStack gap={3}>
          <Label>3. 가이드라인</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">알림 기록 원칙</h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  모든 알림은 앱 내부 알림센터에 기록됨 — 토스트에서 닫았든, 전역 패널에서 확인했든,
                  앱이 비활성 상태였든 어떤 상황에서도 알림센터가 최종 기록 저장소가 됨.
                </p>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">자동 보관 삭제</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    보관 기간: <strong>3일</strong>
                  </li>
                  <li>3일 경과 시 자동 삭제</li>
                  <li>사용자가 직접 삭제 불가(읽음 처리만 가능) → 액션 히스토리 왜곡 방지 목적</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  토스트와의 관계
                </h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    실패 + View details 인라인 확장 시 사용자가 닫을 때까지 유지(자동 종료 없음).
                  </li>
                  <li>
                    토스트 닫기(X)/자동 만료/View details 확장은 읽음 처리 아님 → 알림센터/전역
                    패널에 안읽음으로 남음.
                  </li>
                  <li>
                    토스트를 직접 클릭 → 해당 리소스의 상세화면(없으면 리스트 화면) 열림 + 해당 알림
                    읽음 처리
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">읽음 처리 기준</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          행동
                        </th>
                        <th className="text-center py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          읽음 처리
                        </th>
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          전역 패널 반영
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          이동
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          토스트 본문 클릭
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-success)]">
                          &#x2714;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">
                          해당 항목 제거
                        </td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">
                          리소스 상세/리스트
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          토스트 닫기(X)
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-danger)]">
                          &#x2716;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">유지(안읽음)</td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">없음</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          토스트 자동 만료
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-danger)]">
                          &#x2716;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">유지(안읽음)</td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">없음</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          토스트 View details(오류)
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-danger)]">
                          &#x2716;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">유지(안읽음)</td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">없음(인라인 확장)</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          알림센터: 알림 본문 클릭
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-success)]">
                          &#x2714;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">
                          해당 항목 제거
                        </td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">
                          리소스 상세/리스트
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          알림센터: 개별 읽음 버튼
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-success)]">
                          &#x2714;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">
                          해당 항목 제거
                        </td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">없음</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          알림센터: 전체 읽음
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-success)]">
                          &#x2714;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">일괄 제거</td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">없음</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          전역 패널: 알림 카드 클릭
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-success)]">
                          &#x2714;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">
                          해당 항목 제거
                        </td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">
                          리소스 상세/리스트
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          전역 패널: 개별 읽음 버튼
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-success)]">
                          &#x2714;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">
                          해당 항목 제거
                        </td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">없음</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3 text-[var(--color-text-default)]">
                          전역 패널: 전체 읽음
                        </td>
                        <td className="py-1.5 pr-3 text-center text-[var(--color-state-success)]">
                          &#x2714;
                        </td>
                        <td className="py-1.5 pr-3 text-[var(--color-text-muted)]">일괄 제거</td>
                        <td className="py-1.5 text-[var(--color-text-muted)]">없음</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 4. 예시 시나리오 (Scenarios) */}
        <VStack gap={3}>
          <Label>4. 예시 시나리오</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-1">시나리오 1</h4>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-2">
                토스트를 놓쳤지만, 알림센터에서 바로 확인 &amp; 읽음
              </p>
              <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>알림센터를 연다(앱 내부).</li>
                <li>Unread 탭에서 방금 성공 알림을 확인한다.</li>
                <li>알림 본문을 클릭해 리소스 상세(없으면 리스트)로 이동한다.</li>
              </ol>
              <p className="mt-2 text-body-sm text-[var(--color-text-subtle)]">
                → 알림센터: 읽음 처리 · 전역 패널: 항목 제거
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-1">시나리오 2</h4>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-2">
                실패 원인 먼저 보고(읽음 아님), 나중에 개별 읽음으로 정리
              </p>
              <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>알림센터 All 탭에서 실패 알림을 찾는다.</li>
                <li>View details를 눌러 오류 코드/메시지를 확장해 본다.</li>
                <li>바로 처리할 수 없어서 일단 닫는다.</li>
                <li>작업을 마친 뒤 같은 알림의 '읽음' 버튼을 눌러 정리한다.</li>
              </ol>
              <p className="mt-2 text-body-sm text-[var(--color-text-subtle)]">
                → View details 확장/닫기는 읽음 처리 아님 · 읽음 버튼으로 정리
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-1">시나리오 3</h4>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-2">
                여러 알림이 쌓였을 때 한 번에 정리(전체 읽음)
              </p>
              <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>알림센터를 열어 Unread 탭에서 목록을 훑어본다.</li>
                <li>
                  급한 실패 1~2건만 알림 본문 클릭으로 바로 리소스 화면에 가서 처리한다(읽음).
                </li>
                <li>나머지는 상단의 전체 읽음 버튼으로 한 번에 정리한다.</li>
              </ol>
              <p className="mt-2 text-body-sm text-[var(--color-text-subtle)]">
                → 개별 + 일괄 읽음 처리 · 배지 카운트 초기화
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-1">시나리오 4</h4>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-2">
                토스트가 폭주할 때 알림센터를 열어 실시간 확인 · 정리
              </p>
              <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>알림센터를 열면, 이후 도착하는 알림에 대해 토스트 억제.</li>
                <li>Unread 탭에서 새로 들어오는 항목들을 훑는다.</li>
                <li>긴급한 건은 알림 본문 클릭으로 리소스 이동(읽음 처리).</li>
                <li>실패 건은 View details로 오류 확인 후 남겨둔다.</li>
                <li>처리가 끝난 뒤 '전체 읽음'으로 한 번에 정리.</li>
              </ol>
              <p className="mt-2 text-body-sm text-[var(--color-text-subtle)]">
                → 토스트 억제 · 실시간 추가 · 개별/일괄 정리
              </p>
            </div>
          </div>
        </VStack>

        {/* Design Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            width: 360px · padding: 16px · border-radius: 8px · shadow: lg
          </div>
        </VStack>

        {/* Live Demo */}
        <VStack gap={3}>
          <div className="flex items-center justify-between">
            <Label>Live demo</Label>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleReset}
              leftIcon={<IconRefresh size={12} />}
            >
              Reset
            </Button>
          </div>
          <div className="flex justify-center p-6 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNotificationClick={(n) => setSelectedId(n.id)}
              selectedId={selectedId}
            />
          </div>
        </VStack>

        {/* Notification Types */}
        <VStack gap={3}>
          <Label>Notification types</Label>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                  <IconCheck size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                  Success
                </span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Operation completed
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-danger)] flex items-center justify-center">
                  <IconX size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                  Error
                </span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Operation failed
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-warning)] flex items-center justify-center">
                  <IconAlertTriangle size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                  Warning
                </span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Attention needed
              </p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-info)] flex items-center justify-center">
                  <IconInfoCircle size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                  Info
                </span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                General information
              </p>
            </div>
          </div>
        </VStack>

        {/* Features */}
        <VStack gap={3}>
          <Label>Features</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                Tab Filtering
              </h4>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Filter notifications by All, Unread, or Error status with counts displayed on each
                tab.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                Mark as Read
              </h4>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Mark individual notifications or all notifications as read with a single click.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                Project Tags
              </h4>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Optional project tags help identify which project a notification belongs to.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                Selection State
              </h4>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Click on a notification to select it and view more details or take actions.
              </p>
            </div>
          </div>
        </VStack>

        {/* Props */}
        <VStack gap={3}>
          <Label>Props</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-12)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Prop
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Type
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Default
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    notifications
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">NotificationItem[]</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">required</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    List of notification items
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    onMarkAsRead
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    (id: string) =&gt; void
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Callback when notification is marked as read
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    onMarkAllAsRead
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">() =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Callback when all marked as read
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    onNotificationClick
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    (n: NotificationItem) =&gt; void
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Callback when notification is clicked
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    selectedId
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Currently selected notification id
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    onClose
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">() =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Callback when panel is closed
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>

        {/* NotificationItem Interface */}
        <VStack gap={3}>
          <Label>NotificationItem Interface</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-12)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Property
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Type
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Required
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">id</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">Yes</td>
                  <td className="py-2 text-[var(--color-text-default)]">Unique identifier</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">type</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                    'success' | 'error' | 'warning' | 'info'
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">Yes</td>
                  <td className="py-2 text-[var(--color-text-default)]">Notification type</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    message
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">Yes</td>
                  <td className="py-2 text-[var(--color-text-default)]">Main message text</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">time</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">Yes</td>
                  <td className="py-2 text-[var(--color-text-default)]">Timestamp string</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                    project
                  </td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">No</td>
                  <td className="py-2 text-[var(--color-text-default)]">Project name tag</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">isRead</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">No</td>
                  <td className="py-2 text-[var(--color-text-default)]">
                    Whether notification has been read
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>
      </VStack>
    </Section>
  );
}

/* ----------------------------------------
   DatePicker Section (with state)
   ---------------------------------------- */

function DatePickerSection() {
  const [singleDate, setSingleDate] = useState<Date | null>(new Date(2025, 2, 8));
  const [rangeValue, setRangeValue] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(2025, 2, 8),
    end: new Date(2025, 2, 23),
  });
  const [minMaxDate, setMinMaxDate] = useState<Date | null>(null);
  const [mondayDate, setMondayDate] = useState<Date | null>(new Date(2025, 2, 8));

  return (
    <Section
      id="datepicker"
      title="DatePicker"
      description="Calendar-based date selection with single and range modes"
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">모드 선택 기준</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          모드
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          사용 조건
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          예시
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Single
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          특정 날짜 하나를 선택
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">만료일, 생성일</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Range
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          시작일~종료일 기간을 선택
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          모니터링 기간, 예약 기간
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">날짜 형식 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    축약형: <code>Mth DD, YYYY</code> (예: Feb 09, 2026)
                  </li>
                  <li>
                    표준형: <code>Mth DD, YYYY HH:mm:ss</code> (예: Feb 09, 2026 14:30:00)
                  </li>
                  <li>
                    범위 표시: <code>Mth DD–Mth DD, YYYY</code> (같은 연도)
                  </li>
                  <li>미선택 상태: placeholder로 형식 안내 (예: &quot;Select date&quot;)</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">제한 정책</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>minDate / maxDate</strong>: 선택 가능 범위를 제한. 범위 밖 날짜는
                    비활성화.
                  </li>
                  <li>
                    <strong>주 시작일</strong>: 기본 일요일. 필요 시 월요일 시작으로 설정 가능.
                  </li>
                  <li>
                    <strong>과거 날짜 비허용</strong>: 예약/만료 등 미래 날짜만 필요한 경우
                    minDate를 오늘로 설정.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            padding: 12px · gap: 12px · radius: 8px · cell: 32×32px
          </div>
        </VStack>

        {/* Single Selection */}
        <VStack gap={3}>
          <Label>
            Single Selection{' '}
            {singleDate && (
              <span className="font-normal text-[var(--color-text-muted)]">
                — {singleDate.toLocaleDateString()}
              </span>
            )}
          </Label>
          <DatePicker
            value={singleDate}
            onChange={setSingleDate}
            eventDates={[new Date(2025, 2, 7)]}
          />
        </VStack>

        {/* Range Selection */}
        <VStack gap={3}>
          <Label>
            Range Selection
            {rangeValue.start && rangeValue.end && (
              <span className="font-normal text-[var(--color-text-muted)]">
                — {rangeValue.start.toLocaleDateString()} ~ {rangeValue.end.toLocaleDateString()}
              </span>
            )}
          </Label>
          <DatePicker
            mode="range"
            rangeValue={rangeValue}
            onRangeChange={setRangeValue}
            eventDates={[new Date(2025, 2, 7)]}
          />
        </VStack>

        {/* With Min/Max Date */}
        <VStack gap={3}>
          <Label>
            With Min/Max Date (5th ~ 25th){' '}
            {minMaxDate && (
              <span className="font-normal text-[var(--color-text-muted)]">
                — {minMaxDate.toLocaleDateString()}
              </span>
            )}
          </Label>
          <DatePicker
            value={minMaxDate}
            onChange={setMinMaxDate}
            minDate={new Date(2025, 2, 5)}
            maxDate={new Date(2025, 2, 25)}
          />
        </VStack>

        {/* Monday Start */}
        <VStack gap={3}>
          <Label>
            Monday Start{' '}
            {mondayDate && (
              <span className="font-normal text-[var(--color-text-muted)]">
                — {mondayDate.toLocaleDateString()}
              </span>
            )}
          </Label>
          <DatePicker firstDayOfWeek={1} value={mondayDate} onChange={setMondayDate} />
        </VStack>

        {/* States */}
        <VStack gap={3}>
          <Label>States</Label>
          <div className="flex gap-4 items-start">
            <VStack gap={1}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Default
              </span>
              <DatePicker value={singleDate} onChange={setSingleDate} />
            </VStack>
            <VStack gap={1}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Disabled
              </span>
              <DatePicker value={new Date(2025, 2, 8)} disabled />
            </VStack>
          </div>
        </VStack>
      </VStack>
    </Section>
  );
}

/* ----------------------------------------
   Capsule Tab Demo
   ---------------------------------------- */

function CapsuleTabDemo() {
  const [selected, setSelected] = useState<'left' | 'right'>('left');

  return (
    <div className="inline-flex gap-2 p-1 bg-[var(--color-surface-subtle)] shadow-[inset_0_0_0_1px_var(--color-border-default)] rounded-[8px] w-fit">
      <button
        onClick={() => setSelected('left')}
        className={`
          min-w-[80px] px-[10px] py-[6px] rounded-[6px] text-[length:var(--font-size-12)] font-medium leading-[var(--line-height-18)] text-center transition-all
          ${
            selected === 'left'
              ? 'bg-[var(--color-surface-default)] shadow-[inset_0_0_0_1px_var(--color-border-default),0_1px_2px_0_rgba(0,0,0,0.05)] text-[var(--color-action-primary)]'
              : 'bg-transparent text-[var(--color-text-default)]'
          }
        `}
      >
        left
      </button>
      <button
        onClick={() => setSelected('right')}
        className={`
          min-w-[80px] px-[10px] py-[6px] rounded-[6px] text-[length:var(--font-size-12)] font-medium leading-[var(--line-height-18)] text-center transition-all
          ${
            selected === 'right'
              ? 'bg-[var(--color-surface-default)] shadow-[inset_0_0_0_1px_var(--color-border-default),0_1px_2px_0_rgba(0,0,0,0.05)] text-[var(--color-action-primary)]'
              : 'bg-transparent text-[var(--color-text-default)]'
          }
        `}
      >
        right
      </button>
    </div>
  );
}

/* ----------------------------------------
   Slider with Number Input Demo
   ---------------------------------------- */

function SliderWithNumberInputDemo() {
  const [value, setValue] = useState(50);

  return (
    <VStack gap={3}>
      <Label>Pattern B: Slider + NumberInput</Label>
      <div className="flex items-center gap-3">
        <Slider value={value} onChange={setValue} min={0} max={100} step={1} />
        <NumberInput value={value} onChange={setValue} min={0} max={100} step={1} width="xs" />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   Slider with Custom Range Demo
   ---------------------------------------- */

function SliderWithCustomRangeDemo() {
  const [value, setValue] = useState(250);

  return (
    <VStack gap={3}>
      <Label>Pattern B: Storage Capacity (0-1000 GiB)</Label>
      <VStack gap={1}>
        <div className="flex items-center gap-3">
          <Slider value={value} onChange={setValue} min={0} max={1000} step={10} />
          <NumberInput
            value={value}
            onChange={setValue}
            min={0}
            max={1000}
            step={1}
            width="xs"
            suffix="GiB"
          />
        </div>
        <span className="text-body-sm text-[var(--color-text-subtle)]">0-1000 GiB</span>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   Range Slider Demo (with state)
   ---------------------------------------- */

function RangeSliderDemo() {
  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(64);

  return (
    <VStack gap={3}>
      <Label>Pattern D: RangeSlider + NumberInput 2개</Label>
      <VStack gap={2}>
        <div className="flex items-center gap-3">
          <NumberInput
            value={minLength}
            onChange={(val) => {
              if (val < maxLength) {
                setMinLength(val);
              }
            }}
            min={6}
            max={maxLength - 1}
            step={1}
            width="xs"
          />
          <RangeSlider
            value={[minLength, maxLength]}
            onChange={([min, max]) => {
              setMinLength(min);
              setMaxLength(max);
            }}
            min={6}
            max={128}
            step={1}
          />
          <NumberInput
            value={maxLength}
            onChange={(val) => {
              if (val > minLength) {
                setMaxLength(val);
              }
            }}
            min={minLength + 1}
            max={128}
            step={1}
            width="xs"
          />
        </div>
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          6 - 128 / Maximum length must be greater than or equal to the minimum length.
        </p>
      </VStack>
    </VStack>
  );
}
/* ----------------------------------------
   TabBar Demo (with state)
   ---------------------------------------- */

function TabBarDemo() {
  const tabCounterRef = useRef(4);

  const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
    initialTabs: [
      { id: 'tab-1', label: 'Entry page', closable: true },
      { id: 'tab-2', label: 'Settings', closable: true },
      { id: 'tab-3', label: 'Profile', closable: true },
    ],
    initialActiveTab: 'tab-1',
  });

  // Many tabs demo
  const manyTabsDemo = useTabBar({
    initialTabs: [
      { id: 'many-1', label: 'Dashboard', closable: true },
      { id: 'many-2', label: 'Instance templates', closable: true },
      { id: 'many-3', label: 'Virtual machines', closable: true },
      { id: 'many-4', label: 'Storage volumes', closable: true },
      { id: 'many-5', label: 'Network settings', closable: true },
      { id: 'many-6', label: 'Security groups', closable: true },
      { id: 'many-7', label: 'Load balancers', closable: true },
      { id: 'many-8', label: 'Monitoring', closable: true },
    ],
    initialActiveTab: 'many-1',
  });

  const handleAddTab = () => {
    const counter = tabCounterRef.current;
    addTab({
      id: `tab-${counter}-${Date.now()}`,
      label: `New tab ${counter}`,
      closable: true,
    });
    tabCounterRef.current++;
  };

  const handleAddManyTab = () => {
    const counter = manyTabsDemo.tabs.length + 1;
    manyTabsDemo.addTab({
      id: `many-${counter}-${Date.now()}`,
      label: `New tab ${counter}`,
      closable: true,
    });
  };

  return (
    <VStack gap={8}>
      {/* Tokens */}
      <VStack gap={3}>
        <Label>Design tokens</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          height: 36px · max-width: 160px · padding-x: 12px · font: 12px
        </div>
      </VStack>

      {/* Features */}
      <VStack gap={3}>
        <Label>Features</Label>
        <ul className="list-disc list-outside pl-4 space-y-1 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
          <li>탭 최대 너비 160px, 긴 타이틀은 truncate 처리</li>
          <li>탭이 많아지면 비율적으로 너비가 줄어듦 (스크롤 없음)</li>
          <li>탭 추가/닫기 기능</li>
          <li>윈도우 컨트롤 (최소화/최대화/닫기)</li>
        </ul>
      </VStack>

      {/* Interactive Demo */}
      <VStack gap={3}>
        <Label>Interactive Demo (3 tabs)</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={handleAddTab}
          />
          <div className="h-[120px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-[length:var(--font-size-12)]">
            Content for: {tabs.find((t) => t.id === activeTab)?.label || 'No tab selected'}
          </div>
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click tabs to switch, click × to close, click + to add new tabs
        </p>
      </VStack>

      {/* Many Tabs Demo */}
      <VStack gap={3}>
        <Label>Many Tabs Demo (8 tabs - 비율 축소)</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={manyTabsDemo.tabs}
            activeTab={manyTabsDemo.activeTab}
            onTabChange={manyTabsDemo.selectTab}
            onTabClose={manyTabsDemo.closeTab}
            onTabAdd={handleAddManyTab}
            showAddButton={true}
          />
          <div className="h-[80px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-[length:var(--font-size-12)]">
            탭이 많아지면 모든 탭이 화면에 보이도록 너비가 비율적으로 줄어듭니다.
          </div>
        </div>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   Table Demo (with state)
   ---------------------------------------- */

interface InstanceData {
  id: string;
  name: string;
  status: 'Running' | 'Stopped' | 'Building';
  locked: boolean;
  fixedIp: string;
  floatingIp: string;
  image: string;
  imageId: string;
  flavor: string;
  flavorId: string;
  attachedTo: string | null;
  attachedToId: string | null;
  attachedType: 'instance' | 'router' | null;
  fingerprint: string;
  vCPU: number;
  ram: string;
  disk: string;
}

const sampleTableData: InstanceData[] = [
  {
    id: 'vm-001',
    name: 'worker-node-01',
    status: 'Running',
    locked: true,
    fixedIp: '10.20.30.40',
    floatingIp: '20.30.40.50',
    image: 'CentOS 7',
    imageId: 'img-001',
    flavor: 'Medium',
    flavorId: 'flv-001',
    attachedTo: 'web-server-1',
    attachedToId: 'inst-001',
    attachedType: 'instance',
    fingerprint: '02:c1:ff:54:df:d9:69:0e',
    vCPU: 4,
    ram: '8GB',
    disk: '100GB',
  },
  {
    id: 'vm-002',
    name: 'web-server-01',
    status: 'Running',
    locked: false,
    fixedIp: '10.20.30.41',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    imageId: 'img-002',
    flavor: 'Large',
    flavorId: 'flv-002',
    attachedTo: 'main-router',
    attachedToId: 'router-001',
    attachedType: 'router',
    fingerprint: 'a3:b2:c1:d4:e5:f6:07:18',
    vCPU: 8,
    ram: '16GB',
    disk: '200GB',
  },
  {
    id: 'vm-003',
    name: 'db-master',
    status: 'Running',
    locked: true,
    fixedIp: '10.20.30.42',
    floatingIp: '20.30.40.52',
    image: 'Rocky Linux 9',
    imageId: 'img-003',
    flavor: 'XLarge',
    flavorId: 'flv-003',
    attachedTo: null,
    attachedToId: null,
    attachedType: null,
    fingerprint: '11:22:33:44:55:66:77:88',
    vCPU: 16,
    ram: '32GB',
    disk: '500GB',
  },
  {
    id: 'vm-004',
    name: 'api-gateway',
    status: 'Stopped',
    locked: false,
    fixedIp: '10.20.30.43',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    imageId: 'img-002',
    flavor: 'Small',
    flavorId: 'flv-004',
    attachedTo: 'log-server',
    attachedToId: 'inst-003',
    attachedType: 'instance',
    fingerprint: 'ff:ee:dd:cc:bb:aa:99:88',
    vCPU: 2,
    ram: '4GB',
    disk: '50GB',
  },
  {
    id: 'vm-005',
    name: 'redis-cache',
    status: 'Running',
    locked: false,
    fixedIp: '10.20.30.44',
    floatingIp: '20.30.40.54',
    image: 'Debian 12',
    imageId: 'img-004',
    flavor: 'Medium',
    flavorId: 'flv-001',
    attachedTo: null,
    attachedToId: null,
    attachedType: null,
    fingerprint: '12:34:56:78:9a:bc:de:f0',
    vCPU: 4,
    ram: '8GB',
    disk: '100GB',
  },
  {
    id: 'vm-006',
    name: 'ml-worker',
    status: 'Building',
    locked: false,
    fixedIp: '-',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    imageId: 'img-002',
    flavor: 'GPU Large',
    flavorId: 'flv-005',
    attachedTo: 'gpu-server-1',
    attachedToId: 'inst-005',
    attachedType: 'instance',
    fingerprint: 'ab:cd:ef:01:23:45:67:89',
    vCPU: 8,
    ram: '64GB',
    disk: '1TB',
  },
];

// Sample Key pair data for copy demo
interface KeyPairData {
  id: string;
  name: string;
  fingerprint: string;
  createdAt: string;
}

const sampleKeyPairData: KeyPairData[] = [
  {
    id: 'kp-001',
    name: 'tk-keypair',
    fingerprint: '02:c1:ff:54:df:d9:69:0e:bb:46:a9:c8:0c:dc:2f:bb',
    createdAt: 'Sep 10, 2025 01:17:01',
  },
  {
    id: 'kp-002',
    name: 'dev-keypair',
    fingerprint: 'a3:b2:c1:d4:e5:f6:07:18:29:3a:4b:5c:6d:7e:8f:90',
    createdAt: 'Sep 8, 2025 11:51:27',
  },
  {
    id: 'kp-003',
    name: 'prod-keypair',
    fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00',
    createdAt: 'Sep 5, 2025 14:12:36',
  },
];

function TableDemo() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy handler with visual feedback
  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Basic columns for main table demos
  const basicColumns = [
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: fixedColumns.status,
      align: 'center' as const,
      render: (value: string) => (
        <StatusIndicator
          layout="icon-only"
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      flex: 1,
      minWidth: '140px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
            {value}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: fixedColumns.locked,
      align: 'center' as const,
      render: (value: boolean) =>
        value ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        ) : null,
    },
    { key: 'fixedIp', label: 'Fixed IP', sortable: true, flex: 1, minWidth: '100px' },
    {
      key: 'image',
      label: 'Image',
      sortable: true,
      flex: 1,
      minWidth: '120px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
            {value}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.imageId}
          </span>
        </div>
      ),
    },
    {
      key: 'flavor',
      label: 'Flavor',
      sortable: true,
      flex: 1,
      minWidth: '100px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
            {value}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.flavorId}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center' as const,
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] cursor-pointer">
            <IconTerminal2 size={16} stroke={1.5} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] cursor-pointer">
            <IconAction size={16} stroke={1} />
          </button>
        </div>
      ),
    },
  ];

  // Columns with Attached to (external link + resource icon)
  const attachedToColumns = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
            {value}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1 },
    {
      key: 'attachedTo',
      label: 'Attached to',
      flex: 1,
      render: (_: string | null, row: InstanceData) =>
        row.attachedTo && row.attachedToId ? (
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex flex-col gap-0.5 min-w-0">
              <button
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              >
                <span className="truncate">{row.attachedTo}</span>
                <IconExternalLink
                  size={12}
                  className="flex-shrink-0 text-[var(--color-action-primary)]"
                />
              </button>
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate">
                ID : {row.attachedToId}
              </span>
            </div>
            <Tooltip
              content={row.attachedType === 'router' ? 'Router' : 'Instance'}
              position="top"
              delay={0}
            >
              <div className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-1">
                {row.attachedType === 'router' ? (
                  <IconRouter size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                ) : (
                  <IconCube size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                )}
              </div>
            </Tooltip>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
  ];

  // Columns with copy functionality (Key pairs style)
  const copyColumns = [
    {
      key: 'name',
      label: 'Name',
      width: columnMinWidths.name,
      render: (value: string) => (
        <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
          {value}
        </span>
      ),
    },
    {
      key: 'fingerprint',
      label: 'Fingerprint',
      flex: 1,
      render: (_: string, row: KeyPairData) => (
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
            {row.fingerprint}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(row.id, row.fingerprint);
            }}
            className="p-1.5 -m-1 rounded-md hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-subtle)] transition-colors flex-shrink-0 cursor-pointer"
            title={copiedId === row.id ? 'Copied!' : 'Copy fingerprint'}
          >
            {copiedId === row.id ? (
              <IconCheck size={12} className="text-[var(--color-state-success)]" />
            ) : (
              <IconCopy size={12} className="text-[var(--color-action-primary)]" />
            )}
          </button>
        </div>
      ),
    },
    { key: 'createdAt', label: 'Created at', width: columnMinWidths.createdAt },
  ];

  // Columns without copy button (40px row height demo)
  const noCopyColumns = [
    {
      key: 'name',
      label: 'Name',
      width: columnMinWidths.name,
      render: (value: string) => (
        <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
          {value}
        </span>
      ),
    },
    {
      key: 'fingerprint',
      label: 'Fingerprint',
      flex: 1,
      render: (_: string, row: KeyPairData) => (
        <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
          {row.fingerprint}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Created at', width: columnMinWidths.createdAt },
  ];

  // Compact columns for horizontal scroll demo
  const compactColumns = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center' as const,
      render: (value: string) => (
        <StatusIndicator
          layout="icon-only"
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      width: columnMinWidths.name,
      render: (value: string) => (
        <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
          {value}
        </span>
      ),
    },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1 },
    { key: 'image', label: 'Image', flex: 1 },
    { key: 'flavor', label: 'Flavor', flex: 1 },
  ];

  // Empty state columns
  const emptyColumns = [
    { key: 'status', label: 'Status', width: fixedColumns.status, align: 'center' as const },
    { key: 'name', label: 'Name', flex: 1 },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1 },
    { key: 'image', label: 'Image', flex: 1 },
  ];

  return (
    <VStack gap={8}>
      {/* Tokens */}
      <VStack gap={3}>
        <Label>Design Tokens & Features</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          cell-padding: 12×10px · header-padding: 12×8px · radius: 8px · font: 12px
          <br />
          Features: overflow-x: auto · text-overflow: ellipsis · title tooltip on hover
        </div>
      </VStack>

      {/* Basic Table */}
      <VStack gap={3}>
        <Label>Basic Table with Sorting</Label>
        <Table columns={basicColumns} data={sampleTableData} rowKey="id" />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click column headers to sort. Status shows icon-only, Name/Image/Flavor show ID below
          name.
        </p>
      </VStack>

      {/* Selectable Table */}
      <VStack gap={3}>
        <Label>Selectable table</Label>
        <Table
          columns={basicColumns}
          data={sampleTableData}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </VStack>

      {/* External Link with Resource Icon */}
      <VStack gap={3}>
        <Label>External Link with Resource Icon</Label>
        <Table columns={attachedToColumns} data={sampleTableData} rowKey="id" />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Attached to column shows resource type icon (Instance/Router), clickable link opens in new
          window
        </p>
      </VStack>

      {/* Copy Cell */}
      <VStack gap={3}>
        <Label>Cell with Copy Button</Label>
        <Table columns={copyColumns} data={sampleKeyPairData} rowKey="id" />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click copy icon to copy fingerprint. Icon changes to checkmark for 2 seconds after
          copying.
        </p>
      </VStack>

      {/* 40px Row Height */}
      <VStack gap={3}>
        <Label>40PX</Label>
        <Table columns={noCopyColumns} data={sampleKeyPairData} rowKey="id" rowHeight="40px" />
      </VStack>

      {/* Sticky Header */}
      <VStack gap={3}>
        <Label>Sticky Header (scroll to see effect)</Label>
        <div className="overflow-hidden rounded-[var(--radius-md)]">
          <Table
            columns={compactColumns}
            data={sampleTableData.slice(0, 5)}
            rowKey="id"
            maxHeight="180px"
            stickyHeader
          />
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Scroll vertically to see sticky header effect
        </p>
      </VStack>

      {/* Horizontal Scroll & Text Truncation */}
      <VStack gap={3}>
        <Label>Horizontal Scroll & Text Truncation (max-width: 500px)</Label>
        <div className="max-w-[500px] border border-dashed border-[var(--color-border-default)] rounded-[var(--radius-md)] p-2 overflow-hidden">
          <Table columns={compactColumns} data={sampleTableData.slice(0, 3)} rowKey="id" />
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          • Horizontal scroll: Shift + Mouse wheel or trackpad swipe
          <br />
          • Long text is truncated with ellipsis (...)
          <br />• Hover over truncated text to see full content via tooltip
        </p>
      </VStack>

      {/* Horizontal Scroll Layout Requirements */}
      <VStack gap={3}>
        <Label>⚠️ Horizontal Scroll Layout Requirements</Label>
        <div className="p-4 bg-[var(--color-state-warning-bg)] border border-[var(--color-state-warning)] rounded-[var(--radius-md)]">
          <VStack gap={3}>
            <p className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
              테이블 가로 스크롤이 작동하려면 부모 레이아웃 설정이 중요합니다:
            </p>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-state-danger)]">✗</span>
                <div>
                  <code className="text-[var(--color-state-danger)]">overflow: auto</code> (부모)
                  <br />
                  <span className="text-[var(--color-text-subtle)]">
                    부모가 가로+세로 스크롤을 모두 처리하려 해서 테이블 가로 스크롤이 작동 안 함
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-state-success)]">✓</span>
                <div>
                  <code className="text-[var(--color-state-success)]">
                    overflow-y: auto; overflow-x: hidden
                  </code>{' '}
                  (부모)
                  <br />
                  <span className="text-[var(--color-text-subtle)]">
                    부모는 세로만 스크롤, 테이블은 가로 스크롤 독립적으로 작동
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-sm)] font-mono text-[length:var(--font-size-11)]">
              <span className="text-[var(--color-text-subtle)]">
                // AppLayout.tsx (Scrollable Content Area)
              </span>
              <br />
              <span className="text-[var(--color-action-primary)]">className</span>=
              <span className="text-[var(--color-state-success)]">
                "flex-1 overflow-y-auto overflow-x-hidden ..."
              </span>
            </div>
          </VStack>
        </div>
      </VStack>

      {/* Empty State */}
      <VStack gap={3}>
        <Label>Empty state</Label>
        <Table columns={emptyColumns} data={[]} rowKey="id" emptyMessage="No instances found" />
      </VStack>

      {/* Column Width Presets */}
      <VStack gap={3}>
        <Label>Column Width Presets</Label>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          일관된 테이블 레이아웃을 위한 표준 컬럼 너비 프리셋입니다.{' '}
          <code className="text-[var(--color-action-primary)]">@/design-system</code>에서 import하여
          사용합니다.
        </p>

        {/* Fixed Width */}
        <div className="overflow-x-auto">
          <table className="w-full text-[length:var(--font-size-11)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  Category
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  Key
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  Width
                </th>
                <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Selection/Action */}
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]" rowSpan={2}>
                  Selection / Action
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">select</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">40px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">체크박스 선택 컬럼</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">actions</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">64px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">액션 버튼 컬럼</td>
              </tr>
              {/* Status */}
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]" rowSpan={3}>
                  Status
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">status</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">64px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">상태 아이콘/텍스트</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">health</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">80px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">헬스 상태</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  condition
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">90px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">조건 상태</td>
              </tr>
              {/* Network */}
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]" rowSpan={3}>
                  Network
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  ip, fixedIp, floatingIp
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">130px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">IP 주소</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  macAddress
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">150px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">MAC 주소</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  protocol, port
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">70px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">프로토콜/포트</td>
              </tr>
              {/* Resource */}
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]" rowSpan={2}>
                  Resource
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  cpu, vcpu, ram, disk
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">80px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">리소스 수치</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  memory, size
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">100px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">메모리/사이즈</td>
              </tr>
              {/* Time */}
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]" rowSpan={2}>
                  Time
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  createdAt, updatedAt
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">140px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">생성/수정 시간</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  timestamp
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">160px</td>
                <td className="py-2 text-[var(--color-text-subtle)]">타임스탬프 (날짜+시간)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Flex Width */}
        <Label>Flexible Width Presets</Label>
        <div className="overflow-x-auto">
          <table className="w-full text-[length:var(--font-size-11)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  Key
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  minWidth
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  maxWidth
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  flex
                </th>
                <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">name</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">180px</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">-</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">1</td>
                <td className="py-2 text-[var(--color-text-subtle)]">리소스 이름</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  description
                </td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">200px</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">-</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">2</td>
                <td className="py-2 text-[var(--color-text-subtle)]">설명 텍스트</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">message</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">200px</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">-</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">2</td>
                <td className="py-2 text-[var(--color-text-subtle)]">이벤트 메시지</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">image</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">120px</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">250px</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">1</td>
                <td className="py-2 text-[var(--color-text-subtle)]">컨테이너 이미지</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Usage */}
        <Label>Usage</Label>
        <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono text-[length:var(--font-size-11)]">
          <span className="text-[var(--color-text-subtle)]">// Import</span>
          <br />
          <span className="text-[var(--color-state-info)]">import</span> {'{'} fixedColumns,
          columnMinWidths {'}'} <span className="text-[var(--color-state-info)]">from</span>{' '}
          <span className="text-[var(--color-state-success)]">'@/design-system'</span>;<br />
          <br />
          <span className="text-[var(--color-text-subtle)]">
            // 고정 너비 + 가변 너비 혼합 사용
          </span>
          <br />
          <span className="text-[var(--color-state-info)]">const</span> columns = [<br />
          &nbsp;&nbsp;{'{'} key: <span className="text-[var(--color-state-success)]">'select'</span>
          , width: columnMinWidths.
          <span className="text-[var(--color-action-primary)]">select</span> {'}'},{' '}
          <span className="text-[var(--color-text-subtle)]">// 고정 40px</span>
          <br />
          &nbsp;&nbsp;{'{'} key: <span className="text-[var(--color-state-success)]">'status'</span>
          , width: columnMinWidths.
          <span className="text-[var(--color-action-primary)]">status</span> {'}'},{' '}
          <span className="text-[var(--color-text-subtle)]">// 고정 64px</span>
          <br />
          &nbsp;&nbsp;{'{'} key: <span className="text-[var(--color-state-success)]">'name'</span>,
          flex: <span className="text-[var(--color-action-primary)]">1</span> {'}'},{' '}
          <span className="text-[var(--color-text-subtle)]">// 남은 공간 채움</span>
          <br />
          &nbsp;&nbsp;{'{'} key:{' '}
          <span className="text-[var(--color-state-success)]">'actions'</span>, width:
          columnMinWidths.
          <span className="text-[var(--color-action-primary)]">actions</span> {'}'},{' '}
          <span className="text-[var(--color-text-subtle)]">// 고정 64px</span>
          <br />
          ];
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          전체 프리셋 목록:{' '}
          <code className="text-[var(--color-action-primary)]">
            src/design-system/presets/columnMinWidths.ts
          </code>
        </p>
      </VStack>

      {/* Column Width Strategy Guide */}
      <VStack gap={3}>
        <Label>Column Width Strategy Guide</Label>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          컬럼 너비 설정 시 다음 전략을 따르면 일관되고 반응형 테이블을 구현할 수 있습니다.
        </p>

        {/* Strategy 1: Fixed vs Flex */}
        <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <VStack gap={4}>
            <div>
              <span className="text-[length:var(--font-size-12)] font-semibold text-[var(--color-text-default)]">
                1. 고정 너비 vs 가변 너비 분류
              </span>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-[length:var(--font-size-11)] border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        분류
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        설정
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        대상 컬럼
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-state-success)]">
                        고정 (Fixed)
                      </td>
                      <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                        width: 'XXpx'
                      </td>
                      <td className="py-2 text-[var(--color-text-subtle)]">
                        status, actions, createdAt, IP, MAC, 숫자 (cpu, ram, size)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-label-md text-[var(--color-action-primary)]">
                        가변 (Flex)
                      </td>
                      <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                        flex: 1, minWidth
                      </td>
                      <td className="py-2 text-[var(--color-text-subtle)]">
                        name, description, attachedTo, sourceVolume 등 이름/텍스트
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <span className="text-[length:var(--font-size-12)] font-semibold text-[var(--color-text-default)]">
                2. Flex 컬럼 분배 원칙
              </span>
              <div className="mt-2 text-[length:var(--font-size-11)] text-[var(--color-text-muted)] space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--color-state-danger)]">✗</span>
                  <div>
                    <span className="font-medium text-[var(--color-text-default)]">
                      Flex 컬럼이 1개만 있는 경우
                    </span>
                    <br />
                    <span className="text-[var(--color-text-subtle)]">
                      넓은 화면에서 해당 컬럼만 과도하게 넓어짐
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--color-state-success)]">✓</span>
                  <div>
                    <span className="font-medium text-[var(--color-text-default)]">
                      Flex 컬럼을 2개 이상으로 분배
                    </span>
                    <br />
                    <span className="text-[var(--color-text-subtle)]">
                      name + sourceVolume, name + attachedTo 등 "이름" 컬럼들을 함께 flex 처리
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[length:var(--font-size-12)] font-semibold text-[var(--color-text-default)]">
                3. minWidth 필수 사용
              </span>
              <div className="mt-2 text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                <span className="text-[var(--color-text-subtle)]">
                  flex 컬럼에는 반드시 minWidth를 지정하여 화면이 좁아질 때 텍스트 잘림을 방지
                </span>
              </div>
            </div>
          </VStack>
        </div>

        {/* Example: Good vs Bad */}
        <Label>Example: Before & After</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bad Example */}
          <div className="p-3 bg-[var(--color-state-danger-bg)] border border-[var(--color-state-danger)] rounded-[var(--radius-md)]">
            <div className="text-[length:var(--font-size-11)] font-medium text-[var(--color-state-danger)] mb-2">
              ✗ 문제 패턴
            </div>
            <div className="font-mono text-[length:var(--font-size-10)] text-[var(--color-text-muted)] space-y-1">
              <div>
                {'{'} key: 'status', width: '64px' {'}'}
              </div>
              <div className="text-[var(--color-state-danger)]">
                {'{'} key: 'name', <span className="font-bold">flex: 1</span> {'}'}{' '}
                <span className="text-[var(--color-text-subtle)]">← minWidth 누락!</span>
              </div>
              <div className="text-[var(--color-state-danger)]">
                {'{'} key: 'type', <span className="font-bold">flex: 2</span> {'}'}{' '}
                <span className="text-[var(--color-text-subtle)]">← 비표준 flex 값</span>
              </div>
              <div>
                {'{'} key: 'size', width: '100px' {'}'}
              </div>
              <div>
                {'{'} key: 'created', width: '140px' {'}'}
              </div>
            </div>
            <div className="mt-2 text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
              → minWidth 없으면 라벨 잘림, flex: 1 외 값은 비표준
            </div>
          </div>

          {/* Good Example */}
          <div className="p-3 bg-[var(--color-state-success-bg)] border border-[var(--color-state-success)] rounded-[var(--radius-md)]">
            <div className="text-[length:var(--font-size-11)] font-medium text-[var(--color-state-success)] mb-2">
              ✓ 권장 패턴
            </div>
            <div className="font-mono text-[length:var(--font-size-10)] text-[var(--color-text-muted)] space-y-1">
              <div>
                {'{'} key: 'status', width: fixedColumns.status {'}'}
              </div>
              <div className="text-[var(--color-state-success)]">
                {'{'} key: 'name',{' '}
                <span className="font-bold">flex: 1, minWidth: columnMinWidths.name</span> {'}'}
              </div>
              <div>
                {'{'} key: 'size', width: columnMinWidths.size {'}'}
              </div>
              <div className="text-[var(--color-state-success)]">
                {'{'} key: 'source',{' '}
                <span className="font-bold">flex: 1, minWidth: columnMinWidths.name</span> {'}'}
              </div>
              <div>
                {'{'} key: 'created', width: columnMinWidths.createdAt {'}'}
              </div>
            </div>
            <div className="mt-2 text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
              → 모든 flex 컬럼에 minWidth 필수, flex: 1 사용
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <Label>Quick Reference: 컬럼별 권장 설정</Label>
        <div className="overflow-x-auto">
          <table className="w-full text-[length:var(--font-size-11)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  컬럼 타입
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                  권장 설정
                </th>
                <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">status, actions</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  width: 64px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">아이콘/버튼 크기 고정</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">createdAt</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  width: 140px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">날짜 포맷 예측 가능</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">IP (fixed, floating)</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  width: 130px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">최대 15자 고정</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">macAddress</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  width: 150px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">17자 고정 포맷</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">cpu, ram, disk</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  width: 80px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">짧은 숫자값</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">name, hostname</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  flex: 1, minWidth: 180px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">주요 식별자</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">labels, attachedTo</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  flex: 1, minWidth: 180px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">참조/태그 컬럼</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">model</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  flex: 1, minWidth: 250px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">모델명 (긴 텍스트)</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4 text-[var(--color-text-default)]">description</td>
                <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                  flex: 1, minWidth: 200px
                </td>
                <td className="py-2 text-[var(--color-text-subtle)]">설명 텍스트</td>
              </tr>
            </tbody>
          </table>
        </div>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   Transition Demo Components
   ---------------------------------------- */

function TransitionDemo({ duration, label }: { duration: string; label: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setActive(!active)}
        className="px-2 py-1 text-body-xs font-medium bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
      >
        {active ? 'Reset' : 'Play'}
      </button>
      <div className="flex-1 h-8 bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-md)] overflow-hidden relative">
        <div
          className="absolute top-0 left-0 h-full rounded-[var(--primitive-radius-md)]"
          style={{
            width: active ? '100%' : '0%',
            backgroundColor: 'var(--color-action-primary)',
            opacity: 0.7,
            transition: `width ${duration} ease-out`,
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-body-xs font-mono text-[var(--color-text-muted)]">
          {duration}
        </span>
      </div>
    </div>
  );
}

function EasingDemo({ easing }: { easing: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setActive(!active)}
        className="px-2 py-1 text-body-xs font-medium bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer shrink-0"
      >
        {active ? 'Reset' : 'Play'}
      </button>
      <div className="flex-1 h-8 bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-md)] relative overflow-hidden px-1">
        <div
          className="absolute top-1 w-6 h-6 rounded-full bg-[var(--color-action-primary)]"
          style={{
            left: active ? 'calc(100% - 28px)' : '4px',
            transition: `left 600ms ${easing}`,
          }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Design system Page
   ---------------------------------------- */

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState('token-architecture');
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [mainSearchQuery, setMainSearchQuery] = useState('');
  const [isSidebarSearchFocused, setIsSidebarSearchFocused] = useState(false);
  const [isMainSearchFocused, setIsMainSearchFocused] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Pagination demo states
  const [demoPage1, setDemoPage1] = useState(1);
  const [demoPage2, setDemoPage2] = useState(5);
  const [demoPage3, setDemoPage3] = useState(15);
  const [demoPage4, setDemoPage4] = useState(2);

  // Icon search state
  const [iconSearchQuery, setIconSearchQuery] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, []);

  // Scroll to top handler
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      setShowScrollTop(mainElement.scrollTop > 300);
    };
    mainElement.addEventListener('scroll', handleScroll);
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Intersection Observer to track active section
  useEffect(() => {
    if (!mainRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: mainRef.current,
        rootMargin: '-20% 0px -60% 0px',
      }
    );

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    const container = mainRef.current;

    if (!element || !container) {
      return;
    }

    // Small delay to ensure state updates are processed
    setTimeout(() => {
      if (!container || !element) return;

      // Calculate target position relative to the scroll container
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const targetScrollTop = scrollTop + elementRect.top - containerRect.top - 20; // 20px offset from top

      // Fast smooth scroll
      const startScrollTop = scrollTop;
      const distance = targetScrollTop - startScrollTop;
      const duration = 400;
      let startTime: number | null = null;

      // Smooth easing function (easeOutCubic - starts fast, ends slow)
      const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
      };

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        if (container) {
          const currentScrollTop = startScrollTop + distance * easedProgress;
          container.scrollTop = currentScrollTop;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        }
      };

      requestAnimationFrame(animateScroll);
    }, 50);
  };

  // Filter nav items based on search query (for sidebar)
  const filteredSidebarNavItems = sidebarSearchQuery.trim()
    ? navItems.filter(
        (item) =>
          item.label.toLowerCase().includes(sidebarSearchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
      )
    : [];

  // Filter nav items based on search query (for main content)
  const filteredMainNavItems = mainSearchQuery.trim()
    ? navItems.filter(
        (item) =>
          item.label.toLowerCase().includes(mainSearchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(mainSearchQuery.toLowerCase())
      )
    : [];

  const handleSidebarSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredSidebarNavItems.length > 0) {
      scrollToSection(filteredSidebarNavItems[0].id);
      setSidebarSearchQuery('');
    }
    if (e.key === 'Escape') {
      setSidebarSearchQuery('');
    }
  };

  const handleMainSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredMainNavItems.length > 0) {
      scrollToSection(filteredMainNavItems[0].id);
      setMainSearchQuery('');
    }
    if (e.key === 'Escape') {
      setMainSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Left Sidebar Navigation */}
      <nav className="fixed left-0 top-0 w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] overflow-y-auto overflow-x-hidden z-50 sidebar-scroll">
        <div className="p-4 overflow-hidden">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">TDS</span>
            </div>
            <span className="text-[length:var(--font-size-14)] font-semibold text-[var(--color-text-default)]">
              Design system
            </span>
          </Link>

          {/* EntryPage Link */}
          <Link
            to="/"
            className="flex items-center gap-2 w-[166px] box-border px-3 py-2 mb-2 rounded-[var(--radius-button)] bg-[var(--color-action-secondary)] hover:bg-[var(--color-action-secondary-hover)] text-[var(--color-text-default)] text-[length:var(--font-size-11)] font-medium transition-colors border border-[var(--color-border-default)]"
          >
            <IconHome size={16} stroke={1.5} className="shrink-0" />
            <span className="truncate flex-1 min-w-0">Entry page</span>
            <IconChevronRight size={14} stroke={1.5} className="shrink-0" />
          </Link>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="relative">
              <IconSearch
                size={16}
                stroke={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="text"
                value={sidebarSearchQuery}
                onChange={(e) => setSidebarSearchQuery(e.target.value)}
                onKeyDown={handleSidebarSearchKeyDown}
                onFocus={() => setIsSidebarSearchFocused(true)}
                onBlur={() => setIsSidebarSearchFocused(false)}
                placeholder="Search"
                className="w-[166px] pl-9 pr-8 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-11)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
              />
              {sidebarSearchQuery && (
                <button
                  onClick={() => setSidebarSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                >
                  <IconX size={14} stroke={1.5} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {sidebarSearchQuery.trim() && isSidebarSearchFocused && (
              <div className="absolute top-full left-0 w-[166px] max-w-[166px] mt-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 max-h-[300px] overflow-y-auto overflow-x-hidden sidebar-scroll">
                {filteredSidebarNavItems.length > 0 ? (
                  <div className="p-2 min-w-0">
                    {filteredSidebarNavItems.map(({ id, label, icon: Icon }, index) => (
                      <button
                        key={id}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          scrollToSection(id);
                          setSidebarSearchQuery('');
                          setIsSidebarSearchFocused(false);
                        }}
                        data-cursor-element-id={`sidebar-search-result-${id}-${index}`}
                        className="w-full min-w-0 px-3 py-2 rounded-[var(--radius-md)] flex items-center gap-2 text-left hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
                      >
                        <Icon
                          size={14}
                          stroke={1.5}
                          className="text-[var(--color-text-muted)] shrink-0"
                        />
                        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] truncate min-w-0">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    className="p-3 text-left text-[length:var(--font-size-11)] text-[var(--color-text-muted)] w-full max-w-full min-w-0 break-words"
                    style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                  >
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <VStack gap={4}>
            {/* Foundation Section */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Foundation
              </span>
              {foundationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${
                      activeSection === id
                        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Form Controls */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Form Controls
              </span>
              {formControlItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${
                      activeSection === id
                        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Data Display */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Data Display
              </span>
              {dataDisplayItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${
                      activeSection === id
                        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Feedback */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Feedback
              </span>
              {feedbackItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${
                      activeSection === id
                        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Navigation */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Navigation
              </span>
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${
                      activeSection === id
                        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Overlay */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Overlay
              </span>
              {overlayItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${
                      activeSection === id
                        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Layout & Structure */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Layout
              </span>
              {layoutItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${
                      activeSection === id
                        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Graphs */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Graphs
              </span>
              {graphItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${
                      activeSection === id
                        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>
          </VStack>
        </div>
      </nav>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="absolute top-0 bottom-0 right-0 left-[var(--layout-sidebar-width)] overflow-y-auto"
      >
        <div className="py-12 px-8 overflow-x-auto">
          <div className="max-w-[1000px] mx-auto">
            <VStack gap={12} align="stretch">
              {/* Header */}
              <div className="flex items-center justify-between w-full">
                <VStack gap={2} align="start">
                  <h1 className="text-[length:var(--font-size-40)] font-semibold text-[var(--color-text-default)]">
                    Thaki Design System
                  </h1>
                  <p className="text-[length:var(--font-size-16)] text-[var(--color-text-muted)]">
                    Design tokens and components built with a 3-tier token architecture
                  </p>
                </VStack>
                <div className="flex items-center gap-3">
                  <DarkModeToggle size="sm" scrollContainerRef={mainRef} />
                  <Link to="/">
                    <Button variant="outline">Entry page →</Button>
                  </Link>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="relative">
                  <IconSearch
                    size={18}
                    stroke={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                  <input
                    type="text"
                    value={mainSearchQuery}
                    onChange={(e) => setMainSearchQuery(e.target.value)}
                    onKeyDown={handleMainSearchKeyDown}
                    onFocus={() => setIsMainSearchFocused(true)}
                    onBlur={() => setIsMainSearchFocused(false)}
                    placeholder="Search components, tokens... (Enter to go, Esc to clear)"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-14)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
                  />
                  {mainSearchQuery && (
                    <button
                      onClick={() => setMainSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                    >
                      <IconX size={16} stroke={1.5} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {mainSearchQuery.trim() && isMainSearchFocused && (
                  <div className="absolute top-full left-0 w-[166px] max-w-[166px] mt-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 max-h-[300px] overflow-y-auto overflow-x-hidden sidebar-scroll">
                    {filteredMainNavItems.length > 0 ? (
                      <div className="p-2 min-w-0">
                        {filteredMainNavItems.map(({ id, label, icon: Icon }, index) => (
                          <button
                            key={id}
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent input blur
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              scrollToSection(id);
                              setMainSearchQuery('');
                              setIsMainSearchFocused(false);
                            }}
                            data-cursor-element-id={`main-search-result-${id}-${index}`}
                            className="w-full min-w-0 px-3 py-2 rounded-[var(--radius-md)] flex items-center gap-2 text-left hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
                          >
                            <Icon
                              size={16}
                              stroke={1.5}
                              className="text-[var(--color-text-muted)] shrink-0"
                            />
                            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] truncate min-w-0">
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="p-4 text-left text-[length:var(--font-size-12)] text-[var(--color-text-muted)] w-full max-w-full min-w-0 break-words"
                        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                      >
                        No results found for "{mainSearchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Token architecture Overview */}
              <Section
                id="token-architecture"
                title="Token architecture"
                description="3-tier design token structure: Primitive → Semantic → Component"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TokenCard
                    title="Primitive"
                    description="Raw design values"
                    items={[
                      'Colors (slate, blue, red...)',
                      'Spacing (0-32)',
                      'Font Size (10-40px)',
                      'Radius, Duration, Shadow',
                    ]}
                    color="var(--color-state-info-bg)"
                    textColor="var(--color-state-info-text)"
                  />
                  <TokenCard
                    title="Semantic"
                    description="Purpose-driven tokens"
                    items={[
                      'Typography (heading, body, label)',
                      'Color (action, text, surface, border)',
                      'Spacing (component, layout)',
                      'Radius (field, button, card)',
                    ]}
                    color="var(--color-state-success-bg)"
                    textColor="var(--color-state-success-text)"
                  />
                  <TokenCard
                    title="Component"
                    description="Component-specific tokens"
                    items={[
                      'Button (height, padding, gap)',
                      'Input (height, padding, radius)',
                      'Badge (padding, radius, dotSize)',
                      'Menu (item, section, divider)',
                    ]}
                    color="var(--color-state-warning-bg)"
                    textColor="var(--color-state-warning-text)"
                  />
                </div>
              </Section>

              {/* Primitive colors */}
              <Section
                id="primitive-colors"
                title="Primitive colors"
                description="Core color palette used as building blocks"
              >
                <VStack gap={6}>
                  {/* Base Colors */}
                  <VStack gap={2}>
                    <Label>Base</Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      <ColorSwatch name="white" color="var(--color-white)" textLight={false} />
                      <ColorSwatch name="black" color="var(--color-black)" textLight={true} />
                    </div>
                  </VStack>

                  {/* Slate (Cool Neutral) */}
                  <VStack gap={2}>
                    <Label>
                      Slate{' '}
                      <span className="text-[var(--color-text-subtle)] font-normal">
                        (Cool Neutral - Blue tint)
                      </span>
                    </Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-slate-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>

                  {/* Gray (Pure Neutral) */}
                  <VStack gap={2}>
                    <Label>
                      Gray{' '}
                      <span className="text-[var(--color-text-subtle)] font-normal">
                        (Pure Neutral)
                      </span>
                    </Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-gray-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>

                  {/* Zinc (Warm Neutral) */}
                  <VStack gap={2}>
                    <Label>
                      Zinc{' '}
                      <span className="text-[var(--color-text-subtle)] font-normal">
                        (Warm Neutral)
                      </span>
                    </Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-zinc-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>

                  {/* Neutral (True Neutral) */}
                  <VStack gap={2}>
                    <Label>
                      Neutral{' '}
                      <span className="text-[var(--color-text-subtle)] font-normal">
                        (True Neutral)
                      </span>
                    </Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-neutral-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>

                  {/* Blue (Primary) */}
                  <VStack gap={2}>
                    <Label>Blue (Primary)</Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-blue-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>

                  {/* Red (Danger) */}
                  <VStack gap={2}>
                    <Label>Red (Danger)</Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-red-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>

                  {/* Green (Success) */}
                  <VStack gap={2}>
                    <Label>Green (Success)</Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-green-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>

                  {/* Orange (Warning) */}
                  <VStack gap={2}>
                    <Label>Orange (Warning)</Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-orange-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>

                  {/* Yellow */}
                  <VStack gap={2}>
                    <Label>Yellow</Label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                        <ColorSwatch
                          key={shade}
                          name={`${shade}`}
                          color={`var(--color-yellow-${shade})`}
                          textLight={shade >= 500}
                        />
                      ))}
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Semantic colors */}
              <Section
                id="semantic-colors"
                title="Semantic colors"
                description="Purpose-driven color tokens with light/dark theme support. Click token or hex to copy."
              >
                <VStack gap={8}>
                  {/* Action & Text */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SemanticColorTable
                      title="Action"
                      colors={[
                        {
                          token: 'action.primary',
                          cssVar: '--color-action-primary',
                          primitive: 'blue600',
                        },
                        {
                          token: 'action.primary-hover',
                          cssVar: '--color-action-primary-hover',
                          primitive: 'blue700',
                        },
                        {
                          token: 'action.primary-active',
                          cssVar: '--color-action-primary-active',
                          primitive: 'blue800',
                        },
                      ]}
                    />
                    <SemanticColorTable
                      title="Text"
                      colors={[
                        {
                          token: 'text.default',
                          cssVar: '--color-text-default',
                          primitive: 'slate900',
                        },
                        {
                          token: 'text.muted',
                          cssVar: '--color-text-muted',
                          primitive: 'slate600',
                        },
                        {
                          token: 'text.subtle',
                          cssVar: '--color-text-subtle',
                          primitive: 'slate500',
                        },
                        {
                          token: 'text.disabled',
                          cssVar: '--color-text-disabled',
                          primitive: 'slate400',
                        },
                        {
                          token: 'text.inverse',
                          cssVar: '--color-text-inverse',
                          primitive: 'white',
                          border: true,
                        },
                      ]}
                    />
                  </div>

                  {/* Surface & Border */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SemanticColorTable
                      title="Surface"
                      colors={[
                        {
                          token: 'surface.default',
                          cssVar: '--color-surface-default',
                          primitive: 'white',
                          border: true,
                        },
                        {
                          token: 'surface.subtle',
                          cssVar: '--color-surface-subtle',
                          primitive: 'slate50',
                          border: true,
                        },
                        {
                          token: 'surface.muted',
                          cssVar: '--color-surface-muted',
                          primitive: 'slate100',
                        },
                        {
                          token: 'surface.inverse',
                          cssVar: '--color-surface-inverse',
                          primitive: 'slate900',
                        },
                      ]}
                    />
                    <SemanticColorTable
                      title="Border"
                      colors={[
                        {
                          token: 'border.default',
                          cssVar: '--color-border-default',
                          primitive: 'slate200',
                        },
                        {
                          token: 'border.subtle',
                          cssVar: '--color-border-subtle',
                          primitive: 'slate100',
                        },
                        {
                          token: 'border.strong',
                          cssVar: '--color-border-strong',
                          primitive: 'slate300',
                        },
                        {
                          token: 'border.focus',
                          cssVar: '--color-border-focus',
                          primitive: 'blue500',
                        },
                      ]}
                    />
                  </div>

                  {/* State Colors */}
                  <VStack gap={4}>
                    <Label>State</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <SemanticColorTable
                        title="Info"
                        colors={[
                          {
                            token: 'state.info',
                            cssVar: '--color-state-info',
                            primitive: 'blue600',
                          },
                          {
                            token: 'state.info-bg',
                            cssVar: '--color-state-info-bg',
                            primitive: 'blue50',
                            border: true,
                          },
                          {
                            token: 'state.info-text',
                            cssVar: '--color-state-info-text',
                            primitive: 'blue800',
                          },
                        ]}
                      />
                      <SemanticColorTable
                        title="Success"
                        colors={[
                          {
                            token: 'state.success',
                            cssVar: '--color-state-success',
                            primitive: 'green600',
                          },
                          {
                            token: 'state.success-bg',
                            cssVar: '--color-state-success-bg',
                            primitive: 'green50',
                            border: true,
                          },
                          {
                            token: 'state.success-text',
                            cssVar: '--color-state-success-text',
                            primitive: 'green800',
                          },
                        ]}
                      />
                      <SemanticColorTable
                        title="Warning"
                        colors={[
                          {
                            token: 'state.warning',
                            cssVar: '--color-state-warning',
                            primitive: 'orange600',
                          },
                          {
                            token: 'state.warning-bg',
                            cssVar: '--color-state-warning-bg',
                            primitive: 'yellow50',
                            border: true,
                          },
                          {
                            token: 'state.warning-text',
                            cssVar: '--color-state-warning-text',
                            primitive: 'orange800',
                          },
                        ]}
                      />
                      <SemanticColorTable
                        title="Danger"
                        colors={[
                          {
                            token: 'state.danger',
                            cssVar: '--color-state-danger',
                            primitive: 'red600',
                          },
                          {
                            token: 'state.danger-bg',
                            cssVar: '--color-state-danger-bg',
                            primitive: 'red50',
                            border: true,
                          },
                          {
                            token: 'state.danger-text',
                            cssVar: '--color-state-danger-text',
                            primitive: 'red800',
                          },
                        ]}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Typography */}
              <Section
                id="typography"
                title="Typography"
                description="Mona Sans based typography system (base: 12px)"
              >
                <VStack gap={8}>
                  {/* Headings */}
                  <VStack gap={4}>
                    <Label>Headings</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                              Token
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Size
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                              Line Height
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Weight
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              Preview
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              token: 'h1',
                              size: '40px',
                              lh: '48px',
                              weight: '600',
                              desc: 'Hero / Page title',
                            },
                            {
                              token: 'h2',
                              size: '32px',
                              lh: '40px',
                              weight: '600',
                              desc: 'Section title',
                            },
                            {
                              token: 'h3',
                              size: '24px',
                              lh: '32px',
                              weight: '600',
                              desc: 'Card title',
                            },
                            {
                              token: 'h4',
                              size: '18px',
                              lh: '28px',
                              weight: '600',
                              desc: 'Subsection',
                            },
                            {
                              token: 'h5',
                              size: '16px',
                              lh: '24px',
                              weight: '600',
                              desc: 'Small heading',
                            },
                            {
                              token: 'h6',
                              size: '14px',
                              lh: '20px',
                              weight: '600',
                              desc: 'Label heading',
                            },
                            {
                              token: 'h7',
                              size: '12px',
                              lh: '18px',
                              weight: '600',
                              desc: 'Card section title',
                            },
                          ].map(({ token, size, lh, weight, desc, extra }) => (
                            <tr
                              key={token}
                              className="border-b border-[var(--color-border-subtle)]"
                            >
                              <td className="py-2 pr-4 w-[120px]">
                                <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                                  heading.{token}
                                </code>
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {size}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                                {lh}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {weight}
                              </td>
                              <td className="py-2">
                                <span
                                  style={{
                                    fontSize: size,
                                    lineHeight: lh,
                                    fontWeight: Number(weight),
                                    ...(extra?.includes('uppercase') && {
                                      textTransform: 'uppercase' as const,
                                    }),
                                    ...(extra?.includes('muted') && {
                                      color: 'var(--color-text-muted)',
                                    }),
                                  }}
                                >
                                  {desc}
                                </span>
                                {extra && (
                                  <span className="ml-2 text-[10px] text-[var(--color-text-subtle)]">
                                    ({extra})
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </VStack>

                  {/* Body */}
                  <VStack gap={4}>
                    <Label>Body</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                              Token
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Size
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                              Line Height
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Weight
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              Preview
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              token: 'lg',
                              size: '14px',
                              lh: '20px',
                              weight: '400',
                              desc: 'Large body text',
                            },
                            {
                              token: 'md',
                              size: '12px',
                              lh: '18px',
                              weight: '400',
                              desc: 'Default body text',
                            },
                            {
                              token: 'sm',
                              size: '11px',
                              lh: '16px',
                              weight: '400',
                              desc: 'Small body text',
                            },
                            {
                              token: 'xs',
                              size: '10px',
                              lh: '14px',
                              weight: '400',
                              desc: 'Caption text',
                            },
                          ].map(({ token, size, lh, weight, desc }) => (
                            <tr
                              key={token}
                              className="border-b border-[var(--color-border-subtle)]"
                            >
                              <td className="py-2 pr-4 w-[120px]">
                                <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                                  body.{token}
                                </code>
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {size}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                                {lh}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {weight}
                              </td>
                              <td className="py-2">
                                <span
                                  style={{
                                    fontSize: size,
                                    lineHeight: lh,
                                    fontWeight: Number(weight),
                                  }}
                                >
                                  {desc}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </VStack>

                  {/* Label */}
                  <VStack gap={4}>
                    <Label>Label</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                              Token
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Size
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                              Line Height
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Weight
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              Preview
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              token: 'lg',
                              size: '13px',
                              lh: '18px',
                              weight: '500',
                              desc: 'Input label',
                            },
                            {
                              token: 'md',
                              size: '12px',
                              lh: '16px',
                              weight: '500',
                              desc: 'Default label',
                            },
                            {
                              token: 'sm',
                              size: '11px',
                              lh: '16px',
                              weight: '500',
                              desc: 'Small label',
                            },
                          ].map(({ token, size, lh, weight, desc }) => (
                            <tr
                              key={token}
                              className="border-b border-[var(--color-border-subtle)]"
                            >
                              <td className="py-2 pr-4 w-[120px]">
                                <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                                  label.{token}
                                </code>
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {size}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                                {lh}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {weight}
                              </td>
                              <td className="py-2">
                                <span
                                  style={{
                                    fontSize: size,
                                    lineHeight: lh,
                                    fontWeight: Number(weight),
                                  }}
                                >
                                  {desc}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </VStack>

                  {/* Button */}
                  <VStack gap={4}>
                    <Label>Button</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                              Token
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Size
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                              Line Height
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Weight
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              Preview
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              token: 'lg',
                              size: '14px',
                              lh: '20px',
                              weight: '500',
                              desc: 'Large button',
                            },
                            {
                              token: 'md',
                              size: '12px',
                              lh: '16px',
                              weight: '500',
                              desc: 'Default button',
                            },
                            {
                              token: 'sm',
                              size: '11px',
                              lh: '16px',
                              weight: '500',
                              desc: 'Small button',
                            },
                          ].map(({ token, size, lh, weight, desc }) => (
                            <tr
                              key={token}
                              className="border-b border-[var(--color-border-subtle)]"
                            >
                              <td className="py-2 pr-4 w-[120px]">
                                <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                                  button.{token}
                                </code>
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {size}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                                {lh}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {weight}
                              </td>
                              <td className="py-2">
                                <span
                                  style={{
                                    fontSize: size,
                                    lineHeight: lh,
                                    fontWeight: Number(weight),
                                  }}
                                >
                                  {desc}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </VStack>

                  {/* Code */}
                  <VStack gap={4}>
                    <Label>Code</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                              Token
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Size
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                              Line Height
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                              Font
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              Preview
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              token: 'md',
                              size: '12px',
                              lh: '18px',
                              desc: 'const value = 42;',
                            },
                            {
                              token: 'sm',
                              size: '11px',
                              lh: '16px',
                              desc: 'const value = 42;',
                            },
                          ].map(({ token, size, lh, desc }) => (
                            <tr
                              key={token}
                              className="border-b border-[var(--color-border-subtle)]"
                            >
                              <td className="py-2 pr-4 w-[120px]">
                                <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                                  code.{token}
                                </code>
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                {size}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                                {lh}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                                mono
                              </td>
                              <td className="py-2">
                                <code
                                  style={{
                                    fontSize: size,
                                    lineHeight: lh,
                                    fontFamily: "Menlo, 'Fira Code', Consolas, monospace",
                                  }}
                                >
                                  {desc}
                                </code>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Spacing & Radius */}
              <Section
                id="spacing-radius"
                title="Spacing & Radius"
                description="Consistent spacing scale (4px grid) and border radius"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <VStack gap={4}>
                    <Label>Spacing</Label>
                    <div className="flex flex-wrap gap-2 items-end">
                      {[
                        { name: '0', value: '0px' },
                        { name: '0.5', value: '2px' },
                        { name: '1', value: '4px' },
                        { name: '1.5', value: '6px' },
                        { name: '2', value: '8px' },
                        { name: '2.5', value: '10px' },
                        { name: '3', value: '12px' },
                        { name: '4', value: '16px' },
                        { name: '5', value: '20px' },
                        { name: '6', value: '24px' },
                        { name: '7', value: '28px' },
                        { name: '8', value: '32px' },
                        { name: '9', value: '36px' },
                        { name: '10', value: '40px' },
                        { name: '12', value: '48px' },
                        { name: '14', value: '56px' },
                        { name: '16', value: '64px' },
                        { name: '20', value: '80px' },
                        { name: '24', value: '96px' },
                        { name: '32', value: '128px' },
                      ].map(({ name, value }) => (
                        <SpacingSwatch key={name} name={name} value={value} />
                      ))}
                    </div>
                  </VStack>
                  <VStack gap={4}>
                    <Label>Border radius</Label>
                    <div className="flex gap-4 flex-wrap">
                      {[
                        { name: 'none', value: '0px' },
                        { name: 'sm', value: '4px' },
                        { name: 'md', value: '6px' },
                        { name: 'lg', value: '8px' },
                        { name: 'xl', value: '16px' },
                        { name: 'full', value: '999px' },
                      ].map(({ name, value }) => (
                        <VStack key={name} gap={2} align="center">
                          <div
                            className="w-12 h-12 bg-[var(--color-action-primary)]"
                            style={{ borderRadius: value }}
                          />
                          <code className="text-[9px] font-mono text-[var(--color-text-subtle)]">
                            {name}
                          </code>
                        </VStack>
                      ))}
                    </div>
                  </VStack>
                </div>
              </Section>

              {/* Borders */}
              <Section
                id="borders"
                title="Borders"
                description="Border tokens for colors, widths, and styles"
              >
                <VStack gap={8}>
                  {/* Border Colors */}
                  <VStack gap={4}>
                    <Label>Border colors</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'default', token: '--color-border-default', desc: '기본 보더' },
                        { name: 'subtle', token: '--color-border-subtle', desc: '미세한 구분선' },
                        { name: 'strong', token: '--color-border-strong', desc: '강조 보더' },
                        { name: 'focus', token: '--color-border-focus', desc: '포커스 링' },
                      ].map(({ name, desc }) => (
                        <div key={name} className="flex flex-col gap-2">
                          <div
                            className="h-16 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                            style={{ border: `2px solid var(--color-border-${name})` }}
                          />
                          <div>
                            <code className="text-[length:var(--font-size-11)] font-mono text-[var(--color-text-default)]">
                              border-{name}
                            </code>
                            <p className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">
                              {desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </VStack>

                  {/* Border Widths */}
                  <VStack gap={4}>
                    <Label>Border widths</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { name: '0', value: '0px' },
                        { name: '1', value: '1px' },
                        { name: '2', value: '2px' },
                        { name: '4', value: '4px' },
                      ].map(({ name, value }) => (
                        <div key={name} className="flex flex-col gap-2 items-center">
                          <div
                            className="w-full h-12 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                            style={{ border: `${value} solid var(--color-border-strong)` }}
                          />
                          <code className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-subtle)]">
                            {value}
                          </code>
                        </div>
                      ))}
                    </div>
                  </VStack>

                  {/* Border Styles */}
                  <VStack gap={4}>
                    <Label>Border styles</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['solid', 'dashed', 'dotted', 'none'].map((style) => (
                        <div key={style} className="flex flex-col gap-2 items-center">
                          <div
                            className="w-full h-12 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                            style={{ border: `2px ${style} var(--color-border-strong)` }}
                          />
                          <code className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-subtle)]">
                            {style}
                          </code>
                        </div>
                      ))}
                    </div>
                  </VStack>

                  {/* Border Usage Examples */}
                  <VStack gap={4}>
                    <Label>Usage examples</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">
                          Card with default border
                        </p>
                        <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">
                          border border-[var(--color-border-default)]
                        </code>
                      </div>
                      <div className="p-4 rounded-[var(--radius-lg)] border-2 border-[var(--color-border-strong)] bg-[var(--color-surface-default)]">
                        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">
                          Card with strong border
                        </p>
                        <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">
                          border-2 border-[var(--color-border-strong)]
                        </code>
                      </div>
                      <div className="p-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">
                          Dashed border (dropzone)
                        </p>
                        <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">
                          border border-dashed
                        </code>
                      </div>
                    </div>
                  </VStack>

                  {/* CSS Variables Reference */}
                  <VStack gap={3}>
                    <Label>CSS Variables</Label>
                    <pre className="text-[length:var(--font-size-11)] p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto text-[var(--color-text-muted)]">
                      {`/* Border Colors */
--color-border-default   /* 기본 보더 (slate-200 / #333) */
--color-border-subtle    /* 미세한 구분선 (slate-100 / #252525) */
--color-border-strong    /* 강조 보더 (slate-300 / #444) */
--color-border-focus     /* 포커스 링 (blue-500 / blue-400) */

/* Usage */
border: 1px solid var(--color-border-default);
border-color: var(--color-border-strong);
outline: 2px solid var(--color-border-focus);`}
                    </pre>
                  </VStack>
                </VStack>
              </Section>

              {/* Shadows */}
              <Section
                id="shadows"
                title="Shadows"
                description="Box shadow tokens for elevation and depth"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'xs', value: '0 1px 2px 0 rgba(0,0,0,0.05)' },
                    {
                      name: 'sm',
                      value: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
                    },
                    {
                      name: 'md',
                      value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                    },
                    {
                      name: 'lg',
                      value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                    },
                    {
                      name: 'xl',
                      value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                    },
                  ].map(({ name, value }) => (
                    <div
                      key={name}
                      className="flex gap-4 items-center p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]"
                    >
                      <div
                        className="w-24 h-16 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
                        style={{ boxShadow: `var(--shadow-${name})` }}
                      >
                        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                          {name}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] font-medium font-mono">
                          --shadow-{name}
                        </div>
                        <div className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)] font-mono break-all">
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Transitions */}
              <Section
                id="transitions"
                title="Transitions"
                description="Duration tokens, easing functions, and animation patterns for consistent motion across the system"
              >
                {/* Duration Tokens */}
                <div className="space-y-6">
                  <Label>Duration Tokens</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        name: 'fast',
                        value: '150ms',
                        token: '--duration-fast',
                        primitive: '--primitive-duration-fast',
                        usage: 'Hover, focus, color changes',
                      },
                      {
                        name: 'normal',
                        value: '200ms',
                        token: '--duration-normal',
                        primitive: '--primitive-duration-normal',
                        usage: 'Default transitions, dropdowns, tooltips',
                      },
                      {
                        name: 'slow',
                        value: '300ms',
                        token: '--duration-slow',
                        primitive: '--primitive-duration-slow',
                        usage: 'Modals, drawers, page transitions',
                      },
                    ].map(({ name, value, token, primitive, usage }) => (
                      <div
                        key={name}
                        className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-heading-h6 text-[var(--color-text-default)] capitalize">
                            {name}
                          </span>
                          <span className="text-body-md font-mono text-[var(--color-text-muted)]">
                            {value}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <code className="text-body-sm font-mono text-[var(--color-state-info)]">
                            {token}
                          </code>
                          <code className="text-body-xs font-mono text-[var(--color-text-subtle)]">
                            {primitive}
                          </code>
                        </div>
                        <p className="text-body-sm text-[var(--color-text-subtle)]">{usage}</p>
                        <TransitionDemo duration={value} label={name} />
                      </div>
                    ))}
                  </div>

                  {/* Easing Functions */}
                  <Label>Easing Functions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'ease',
                        css: 'ease',
                        desc: 'Default browser easing — gentle acceleration and deceleration',
                        usage: 'General-purpose, theme transitions',
                      },
                      {
                        name: 'ease-out',
                        css: 'ease-out',
                        desc: 'Fast start, slow end — feels responsive and natural',
                        usage: 'Modals, panels, popups entering',
                      },
                      {
                        name: 'ease-in-out',
                        css: 'ease-in-out',
                        desc: 'Smooth acceleration and deceleration — balanced motion',
                        usage: 'Loading shimmer, continuous animations',
                      },
                      {
                        name: 'linear',
                        css: 'linear',
                        desc: 'Constant speed — no acceleration',
                        usage: 'Progress bars, timers',
                      },
                    ].map(({ name, css, desc, usage }) => (
                      <div
                        key={name}
                        className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-heading-h6 text-[var(--color-text-default)]">
                            {name}
                          </span>
                          <code className="text-body-sm font-mono text-[var(--color-text-muted)]">
                            {css}
                          </code>
                        </div>
                        <p className="text-body-sm text-[var(--color-text-subtle)]">{desc}</p>
                        <p className="text-body-xs text-[var(--color-text-muted)]">
                          <strong>Usage:</strong> {usage}
                        </p>
                        <EasingDemo easing={css} />
                      </div>
                    ))}
                  </div>

                  {/* CSS Transition Patterns */}
                  <Label>CSS Transition Patterns</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                            Pattern
                          </th>
                          <th className="py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                            Properties
                          </th>
                          <th className="py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                            Duration
                          </th>
                          <th className="py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                            Easing
                          </th>
                          <th className="py-2 text-label-sm text-[var(--color-text-muted)]">
                            Components
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-body-md">
                        {[
                          {
                            pattern: 'Color change',
                            properties: 'background-color, border-color, color',
                            duration: '150ms',
                            easing: 'ease',
                            components: 'Button, Input, Toggle, Menu item',
                          },
                          {
                            pattern: 'Opacity',
                            properties: 'opacity',
                            duration: '200ms',
                            easing: 'ease-out',
                            components: 'Tooltip, Backdrop, Fade transitions',
                          },
                          {
                            pattern: 'Transform',
                            properties: 'transform (scale, translate)',
                            duration: '200ms',
                            easing: 'ease-out',
                            components: 'Modal, Popover, Desktop icons',
                          },
                          {
                            pattern: 'Layout shift',
                            properties: 'width, height, padding',
                            duration: '200ms',
                            easing: 'ease',
                            components: 'Sidebar, Disclosure, Drawer',
                          },
                          {
                            pattern: 'All properties',
                            properties: 'all',
                            duration: '150ms',
                            easing: 'ease',
                            components: 'Generic hover states',
                          },
                          {
                            pattern: 'Theme switch',
                            properties: 'background-color, border-color, color, fill, stroke',
                            duration: '300ms / 150ms',
                            easing: 'ease',
                            components: 'Global (root-level)',
                          },
                        ].map(({ pattern, properties, duration, easing, components }) => (
                          <tr
                            key={pattern}
                            className="border-b border-[var(--color-border-subtle)]"
                          >
                            <td className="py-2.5 pr-4 text-[var(--color-text-default)] font-medium whitespace-nowrap">
                              {pattern}
                            </td>
                            <td className="py-2.5 pr-4 font-mono text-body-sm text-[var(--color-text-muted)]">
                              {properties}
                            </td>
                            <td className="py-2.5 pr-4 font-mono text-body-sm text-[var(--color-state-info)]">
                              {duration}
                            </td>
                            <td className="py-2.5 pr-4 font-mono text-body-sm text-[var(--color-text-muted)]">
                              {easing}
                            </td>
                            <td className="py-2.5 text-body-sm text-[var(--color-text-subtle)]">
                              {components}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Framer Motion Patterns */}
                  <Label>Framer Motion Patterns (Desktop)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Enter / Exit (Tween)',
                        code: `initial={{ scale: 0.95, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.95, opacity: 0 }}
transition={{ duration: 0.2, ease: 'easeOut' }}`,
                        usage: 'Windows, modals, panels',
                      },
                      {
                        name: 'Backdrop Fade',
                        code: `initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2, ease: 'easeOut' }}`,
                        usage: 'Modal/panel overlays',
                      },
                      {
                        name: 'Drag Reorder (Spring)',
                        code: `transition={{
  type: 'spring',
  stiffness: 400,
  damping: 25,
}}
whileDrag={{ scale: 1.15, zIndex: 50 }}`,
                        usage: 'Dock icon drag & drop',
                      },
                      {
                        name: 'Layout Animation',
                        code: `<motion.div layoutId={id}>
  {/* shared layout */}
</motion.div>

<AnimatePresence>
  {isOpen && <motion.div ... />}
</AnimatePresence>`,
                        usage: 'Shared layout transitions, conditional rendering',
                      },
                    ].map(({ name, code, usage }) => (
                      <div
                        key={name}
                        className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex flex-col gap-3"
                      >
                        <span className="text-heading-h6 text-[var(--color-text-default)]">
                          {name}
                        </span>
                        <pre className="text-body-sm font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-default)] p-3 rounded-[var(--primitive-radius-md)] overflow-x-auto whitespace-pre">
                          {code}
                        </pre>
                        <p className="text-body-sm text-[var(--color-text-subtle)]">
                          <strong>Usage:</strong> {usage}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Guidelines */}
                  <Label>Guidelines</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--color-state-success-bg)] border border-[var(--color-state-success)]/20 rounded-[var(--primitive-radius-lg)]">
                      <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-2">DO</h4>
                      <ul className="text-body-md text-[var(--color-text-default)] space-y-1.5">
                        <li>• Use duration tokens instead of hardcoded values</li>
                        <li>
                          • Prefer <code className="font-mono text-body-sm">ease-out</code> for
                          elements entering the viewport
                        </li>
                        <li>• Keep durations under 300ms for UI interactions</li>
                        <li>
                          • Use <code className="font-mono text-body-sm">AnimatePresence</code> for
                          enter/exit animations
                        </li>
                        <li>• Match transition speed to the size of the change</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-[var(--color-state-danger-bg)] border border-[var(--color-state-danger)]/20 rounded-[var(--primitive-radius-lg)]">
                      <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-2">
                        DON'T
                      </h4>
                      <ul className="text-body-md text-[var(--color-text-default)] space-y-1.5">
                        <li>• Don't animate layout properties (width/height) unless necessary</li>
                        <li>• Don't use durations longer than 500ms for interactive UI</li>
                        <li>
                          • Don't use <code className="font-mono text-body-sm">ease-in</code> alone
                          — it feels sluggish on entry
                        </li>
                        <li>• Don't animate multiple unrelated properties simultaneously</li>
                        <li>
                          • Don't forget{' '}
                          <code className="font-mono text-body-sm">prefers-reduced-motion</code>{' '}
                          accessibility
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Icons */}
              <Section
                id="icons"
                title="Icons"
                description="Tabler Icons & Custom Icons - Stroke width 1.5, Size 16-20px"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          아이콘 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>라이브러리</strong>: Tabler Icons (
                            <code>@tabler/icons-react</code>)를 사용합니다.
                          </li>
                          <li>
                            <strong>Stroke</strong>: 기본{' '}
                            <code>
                              stroke={'{'}1.5{'}'}
                            </code>
                            .
                          </li>
                          <li>
                            <strong>크기</strong>: 버튼 내 아이콘 12px (sm/md), 14px (lg). 독립
                            아이콘 16~20px.
                          </li>
                          <li>
                            <strong>색상</strong>: CSS 변수(
                            <code>text-[var(--color-text-*)]</code>)를 사용. 하드코딩 금지.
                          </li>
                          <li>
                            <strong>즐겨찾기</strong>: <code>IconStar</code>(비활성) /{' '}
                            <code>IconStarFilled</code>(활성, yellow400).
                          </li>
                          <li>
                            아이콘만 사용하는 버튼에는 반드시 <code>aria-label</code>을 지정합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Icon Search */}
                  <SearchInput
                    placeholder="Search icons..."
                    value={iconSearchQuery}
                    onChange={(e) => setIconSearchQuery(e.target.value)}
                  />

                  {/* Actions - Media Controls */}
                  <IconDisplayGrid
                    title="Actions - Media Controls"
                    icons={[
                      { Icon: IconPlayerPlay, name: 'Play' },
                      { Icon: IconPlayerStop, name: 'Stop' },
                      { Icon: IconPlayerPause, name: 'Pause' },
                      { Icon: IconRefresh, name: 'Refresh' },
                      { Icon: IconRefreshDot, name: 'Reboot' },
                      { Icon: IconRotate, name: 'Rotate' },
                      { Icon: IconRotateClockwise, name: 'Retry' },
                      { Icon: IconPower, name: 'Power' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Actions - CRUD */}
                  <IconDisplayGrid
                    title="Actions - CRUD"
                    icons={[
                      { Icon: IconPlus, name: 'Add' },
                      { Icon: IconCirclePlus, name: 'Add Circle' },
                      { Icon: IconSquarePlus, name: 'Add Square' },
                      { Icon: IconMinus, name: 'Remove' },
                      { Icon: IconPencil, name: 'Edit' },
                      { Icon: IconTrash, name: 'Delete' },
                      { Icon: IconTrashX, name: 'Deleting' },
                      { Icon: IconCopy, name: 'Copy' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Actions - Transfer */}
                  <IconDisplayGrid
                    title="Actions - Transfer"
                    icons={[
                      { Icon: IconDownload, name: 'Download' },
                      { Icon: IconUpload, name: 'Upload' },
                      { Icon: IconShare, name: 'Share' },
                      { Icon: IconSend, name: 'Send' },
                      { Icon: IconTransfer, name: 'Transfer' },
                      { Icon: IconLink, name: 'Link' },
                      { Icon: IconUnlink, name: 'Unlink' },
                      { Icon: IconLinkOff, name: 'Link Off' },
                      { Icon: IconExternalLink, name: 'External' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Navigation - Chevrons & Arrows */}
                  <IconDisplayGrid
                    title="Navigation - Chevrons & Arrows"
                    icons={[
                      { Icon: IconChevronLeft, name: 'Chevron L' },
                      { Icon: IconChevronRight, name: 'Chevron R' },
                      { Icon: IconChevronDown, name: 'Chevron D' },
                      { Icon: IconChevronUp, name: 'Chevron U' },
                      { Icon: IconArrowLeft, name: 'Arrow L' },
                      { Icon: IconArrowRight, name: 'Arrow R' },
                      { Icon: IconArrowUp, name: 'Arrow U' },
                      { Icon: IconArrowDown, name: 'Arrow D' },
                      { Icon: IconCaretRightFilled, name: 'Caret R' },
                      { Icon: IconCaretDownFilled, name: 'Caret D' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Navigation - Expand & Menu */}
                  <IconDisplayGrid
                    title="Navigation - Expand & Menu"
                    icons={[
                      { Icon: IconArrowsMaximize, name: 'Maximize' },
                      { Icon: IconArrowsMinimize, name: 'Minimize' },
                      { Icon: IconExpandOff, name: 'Expand Off' },
                      { Icon: IconExpandOn, name: 'Expand On' },
                      { Icon: IconLayoutSidebarLeftCollapse, name: 'Collapse' },
                      { Icon: IconDotsCircleHorizontal, name: 'Action' },
                      { Icon: IconDots, name: 'Meatball' },
                      { Icon: IconDotsVertical, name: 'Kebab' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Status - Success & Error */}
                  <IconDisplayGrid
                    title="Status - Success & Error"
                    icons={[
                      { Icon: IconCircleCheck, name: 'Success' },
                      { Icon: IconCheck, name: 'Check' },
                      { Icon: IconShieldCheck, name: 'Verified' },
                      { Icon: IconAlertCircle, name: 'Error' },
                      { Icon: IconAlertTriangle, name: 'Warning' },
                      { Icon: IconAlertOctagon, name: 'Critical' },
                      { Icon: IconInfoCircle, name: 'Info' },
                      { Icon: IconHelpCircle, name: 'Help' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Status - State */}
                  <IconDisplayGrid
                    title="Status - State"
                    icons={[
                      { Icon: IconCircle, name: 'Active' },
                      { Icon: IconCircleOff, name: 'Inactive' },
                      { Icon: IconBan, name: 'Suspended' },
                      { Icon: IconTool, name: 'Maintain' },
                      { Icon: IconLoader, name: 'Loading' },
                      { Icon: IconLoader2, name: 'Spinner' },
                      { Icon: IconProgress, name: 'Progress' },
                      { Icon: IconInfinity, name: 'Infinity' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* UI - Common */}
                  <IconDisplayGrid
                    title="UI - Common"
                    icons={[
                      { Icon: IconSearch, name: 'Search' },
                      { Icon: IconFilter, name: 'Filter' },
                      { Icon: IconSettings, name: 'Settings' },
                      { Icon: IconHome, name: 'Home' },
                      { Icon: IconX, name: 'Close' },
                      { Icon: IconList, name: 'List' },
                      { Icon: IconLayoutGrid, name: 'Grid' },
                      { Icon: IconGridDots, name: 'Grid Dots' },
                      { Icon: IconArrowsSort, name: 'Sort' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* UI - Notifications & Favorites */}
                  <IconDisplayGrid
                    title="UI - Notifications & Favorites"
                    icons={[
                      { Icon: IconBell, name: 'Bell' },
                      { Icon: IconBellRinging, name: 'Bell Ring' },
                      { Icon: IconStar, name: 'Star' },
                      { Icon: IconStarFilled, name: 'Star Fill' },
                      { Icon: IconHeart, name: 'Heart' },
                      { Icon: IconTarget, name: 'Target' },
                      { Icon: IconPoint, name: 'Dot' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* UI - Visibility & Security */}
                  <IconDisplayGrid
                    title="UI - Visibility & Security"
                    icons={[
                      { Icon: IconEye, name: 'Show' },
                      { Icon: IconEyeOff, name: 'Hide' },
                      { Icon: IconLock, name: 'Lock' },
                      { Icon: IconShield, name: 'Shield' },
                      { Icon: IconShieldLock, name: 'Shield Lock' },
                      { Icon: IconShieldCheck, name: 'Shield OK' },
                      { Icon: IconKey, name: 'Key' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* UI - User & Communication */}
                  <IconDisplayGrid
                    title="UI - User & Communication"
                    icons={[
                      { Icon: IconUser, name: 'User' },
                      { Icon: IconUserCircle, name: 'User Circle' },
                      { Icon: IconMail, name: 'Mail' },
                      { Icon: IconMessage, name: 'Message' },
                      { Icon: IconMessagePlus, name: 'New Chat' },
                      { Icon: IconHelp, name: 'Help' },
                      { Icon: IconQuestionMark, name: 'Question' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* UI - Theme */}
                  <IconDisplayGrid
                    title="UI - Theme"
                    icons={[
                      { Icon: IconSun, name: 'Light' },
                      { Icon: IconMoon, name: 'Dark' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Infrastructure - Compute */}
                  <IconDisplayGrid
                    title="Infrastructure - Compute"
                    icons={[
                      { Icon: IconServer, name: 'Server' },
                      { Icon: IconServer2, name: 'Instance' },
                      { Icon: IconCube, name: 'Cube' },
                      { Icon: IconCpu, name: 'CPU' },
                      { Icon: IconServerCog, name: 'Host Agg' },
                      { Icon: IconCloud, name: 'Cloud' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Infrastructure - Network */}
                  <IconDisplayGrid
                    title="Infrastructure - Network"
                    icons={[
                      { Icon: IconNetwork, name: 'Network' },
                      { Icon: IconRouter, name: 'Router' },
                      { Icon: IconPlug, name: 'Port' },
                      { Icon: IconPlugConnected, name: 'Connected' },
                      { Icon: IconScale, name: 'Load Bal' },
                      { Icon: IconWorldWww, name: 'Float IP' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Infrastructure - Storage */}
                  <IconDisplayGrid
                    title="Infrastructure - Storage"
                    icons={[
                      { Icon: IconDatabase, name: 'Database' },
                      { Icon: IconDatabaseSearch, name: 'Vol Search' },
                      { Icon: IconDeviceFloppy, name: 'Disk' },
                      { Icon: IconDeviceSdCard, name: 'Backup' },
                      { Icon: IconBoxMultiple, name: 'Vol Type' },
                      { Icon: IconSquarePlus, name: 'Add Vol' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Infrastructure - Security */}
                  <IconDisplayGrid
                    title="Infrastructure - Security"
                    icons={[
                      { Icon: IconShield, name: 'Security' },
                      { Icon: IconShieldLock, name: 'Sec Group' },
                      { Icon: IconKey, name: 'Key Pair' },
                      { Icon: IconCertificate, name: 'Certificate' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Storage & Files */}
                  <IconDisplayGrid
                    title="Storage & Files"
                    icons={[
                      { Icon: IconCamera, name: 'Snapshot' },
                      { Icon: IconDisc, name: 'Image' },
                      { Icon: IconFile, name: 'File' },
                      { Icon: IconFileText, name: 'Doc' },
                      { Icon: IconFolder, name: 'Folder' },
                      { Icon: IconFolderOpen, name: 'Folder Open' },
                      { Icon: IconArchive, name: 'Archive' },
                      { Icon: IconTemplate, name: 'Template' },
                      { Icon: IconStack2, name: 'Layers' },
                      { Icon: IconCode, name: 'Code' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Monitoring & Analytics */}
                  <IconDisplayGrid
                    title="Monitoring & Analytics"
                    icons={[
                      { Icon: IconTerminal, name: 'Console' },
                      { Icon: IconTerminal2, name: 'Terminal' },
                      { Icon: IconActivity, name: 'Activity' },
                      { Icon: IconChartBar, name: 'Bar Chart' },
                      { Icon: IconChartDonut, name: 'Donut' },
                      { Icon: IconGauge, name: 'Gauge' },
                      { Icon: IconDeviceDesktop, name: 'Desktop' },
                      { Icon: IconDeviceDesktopAnalytics, name: 'Analytics' },
                      { Icon: IconLayoutDashboard, name: 'Dashboard' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Organization & Structure */}
                  <IconDisplayGrid
                    title="Organization & Structure"
                    icons={[
                      { Icon: IconTopologyRing, name: 'Topo Ring' },
                      { Icon: IconTopologyStar3, name: 'Topo Star' },
                      { Icon: IconBuilding, name: 'Building' },
                      { Icon: IconCategory, name: 'Category' },
                      { Icon: IconLayoutSidebar, name: 'Sidebar' },
                      { Icon: IconAdjustments, name: 'Adjust' },
                      { Icon: IconBolt, name: 'Bolt' },
                      { Icon: IconGitBranch, name: 'Branch' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Time & Schedule */}
                  <IconDisplayGrid
                    title="Time & Schedule"
                    icons={[
                      { Icon: IconClock, name: 'Clock' },
                      { Icon: IconHourglass, name: 'Hourglass' },
                      { Icon: IconStopwatch, name: 'Timeout' },
                      { Icon: IconHistory, name: 'History' },
                      { Icon: IconArticle, name: 'Article' },
                      { Icon: IconCalendar, name: 'Calendar' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* Business & Finance */}
                  <IconDisplayGrid
                    title="Business & Finance"
                    icons={[
                      { Icon: IconCurrencyDollar, name: 'Dollar' },
                      { Icon: IconLanguage, name: 'Language' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* AI & ML */}
                  <IconDisplayGrid
                    title="AI & ML"
                    icons={[
                      { Icon: IconBrain, name: 'Brain' },
                      { Icon: IconRobot, name: 'Robot' },
                      { Icon: IconRobotFace, name: 'Robot Face' },
                      { Icon: IconMessageChatbot, name: 'Chatbot' },
                      { Icon: IconBooks, name: 'Books' },
                      { Icon: IconBook, name: 'Book' },
                      { Icon: IconTestPipe, name: 'Test' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />

                  {/* OS / Brand Icons */}
                  <IconDisplayGrid
                    title="OS / Brand"
                    icons={[
                      { Icon: IconUbuntu, name: 'Ubuntu' },
                      { Icon: IconBrandDebian, name: 'Debian' },
                      { Icon: IconBrandWindows, name: 'Windows' },
                      { Icon: IconBrandRedhat, name: 'RedHat' },
                      { Icon: IconRocky, name: 'Rocky' },
                      { Icon: IconGrid, name: 'Grid' },
                      { Icon: IconCircleDot, name: 'Other' },
                    ]}
                    searchQuery={iconSearchQuery}
                  />
                </VStack>
              </Section>

              {/* App icons */}
              <Section
                id="app-icons"
                title="App icons"
                description="Application icons for THAKI Cloud services - Size 64x64"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            THAKI Cloud의 각 서비스(Compute, Compute Admin, Container, Storage,
                            Storage Admin, Cloud Builder, AI Platform, Agent ops, IAM, Settings,
                            Admin center)를 대표하는 아이콘입니다.
                          </li>
                          <li>
                            <strong>크기</strong>: 기본 64×64px. 사이드바 등 작은 영역에서는 축소
                            사용 가능.
                          </li>
                          <li>
                            서비스 간 시각적 일관성을 유지하기 위해 공통 스타일 가이드를 따릅니다.
                          </li>
                          <li>
                            새로운 서비스 추가 시 기존 아이콘 세트와 동일한 스타일로 제작합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  <VStack gap={3}>
                    <Label>Service icons</Label>
                    <div className="flex flex-wrap gap-6">
                      {[
                        { src: AppIconCompute, name: 'Compute' },
                        { src: AppIconComputeAdmin, name: 'Compute Admin' },
                        { src: AppIconStorage, name: 'Storage' },
                        { src: AppIconStorageAdmin, name: 'Storage Admin' },
                        { src: AppIconContainer, name: 'Container' },
                        { src: AppIconCloudBuilder, name: 'Cloud Builder' },
                        { src: AppIconAIPlatform, name: 'AI Platform' },
                        { src: AppIconAgentOps, name: 'Agent ops' },
                        { src: AppIconIAM, name: 'IAM' },
                        { src: AppIconSettings, name: 'Settings' },
                        { src: AppIconAdminCenter, name: 'Admin center' },
                      ].map(({ src, name }) => (
                        <div key={name} className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex items-center justify-center overflow-hidden">
                            <img src={src} alt={name} className="w-16 h-16 object-contain" />
                          </div>
                          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                            {name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* ============================================
                COMPONENTS
                ============================================ */}

              {/* Button Component */}
              <Section
                id="button"
                title="Button"
                description="Interactive button component with multiple variants, sizes, and states"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Variant 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                                    Variant
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    용도
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    예시
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Primary
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    페이지 내 가장 중요한 단일 액션. 화면당 1개 권장.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Create, Save, Deploy
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Secondary
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    보조 액션. Primary 버튼과 함께 사용하거나 독립 액션으로 사용.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Cancel, Edit, Console
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Muted
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    Toolbar 내 Bulk 액션 등 배경에 녹아드는 버튼.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Start, Stop, Delete (toolbar)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Ghost
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    배경 없이 텍스트만 보이는 최소한의 버튼.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    More, Settings (compact areas)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Outline
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    Secondary와 유사하지만 테두리 강조가 필요한 경우.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Filter, View options
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Danger
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    파괴적/되돌릴 수 없는 액션. 반드시 확인 모달과 함께 사용.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Delete, Terminate
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Link
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    텍스트 링크처럼 보이지만 버튼 동작을 수행.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    View all, Learn more
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            위치별 Size 규칙
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    위치
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    Size
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    아이콘 크기
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    PageHeader 생성 버튼
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    md
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    Toolbar Primary / Bulk 액션
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    sm
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    DetailHeader 액션
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    sm
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    Modal / Drawer Footer
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    md
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 가이드라인 */}
                  <VStack gap={3}>
                    <Label>가이드라인</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">
                          Do
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>
                            페이지당 Primary 버튼은 1개만 사용합니다. Modal, Drawer, Side Panel은
                            독립 컨텍스트로 각각 Primary 1개 허용.
                          </li>
                          <li>버튼 라벨은 동사로 시작합니다 (Create, Delete, Save).</li>
                          <li>파괴적 액션(Delete)은 반드시 ConfirmModal과 함께 사용합니다.</li>
                          <li>
                            아이콘 전용 버튼에는 반드시 <code>aria-label</code>을 지정합니다.
                          </li>
                          <li>로딩 중에는 버튼을 disabled 처리하고 로딩 상태를 표시합니다.</li>
                          <li>버튼 그룹은 Primary를 오른쪽, Secondary를 왼쪽에 배치합니다.</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                          Don&apos;t
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>한 화면에 Primary 버튼을 2개 이상 배치하지 않습니다.</li>
                          <li>
                            버튼 라벨에 &quot;Click here&quot; 같은 모호한 표현을 사용하지 않습니다.
                          </li>
                          <li>Danger 버튼을 확인 과정 없이 직접 실행하지 않습니다.</li>
                          <li>
                            disabled 상태의 이유를 사용자에게 알리지 않고 비활성화하지 않습니다.
                          </li>
                          <li>
                            텍스트가 긴 라벨로 인해 버튼 너비가 과도하게 넓어지지 않도록 합니다.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* Token Table */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Token
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              SM
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              MD
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              LG
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'height', sm: '28px', md: '32px', lg: '36px' },
                            { name: 'min-width', sm: '60px', md: '80px', lg: '80px' },
                            { name: 'padding-x', sm: '10px', md: '12px', lg: '16px' },
                            { name: 'padding-y', sm: '6px', md: '8px', lg: '10px' },
                            { name: 'gap', sm: '6px', md: '6px', lg: '8px' },
                            { name: 'font-size', sm: '11px', md: '11px', lg: '12px' },
                            { name: 'icon-size', sm: '12px', md: '12px', lg: '12px' },
                          ].map(({ name, sm, md, lg }) => (
                            <tr key={name} className="border-b border-[var(--color-border-subtle)]">
                              <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                                --button-{name}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                                {sm}
                              </td>
                              <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                                {md}
                              </td>
                              <td className="py-2 font-mono text-[var(--color-text-muted)]">
                                {lg}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
                      radius: 6px (md) · border: slate-300 (secondary) · disabled-bg: slate-200
                      (primary)
                    </div>
                  </VStack>

                  {/* Sizes */}
                  <VStack gap={3}>
                    <Label>Sizes</Label>
                    <div className="flex gap-3 items-center">
                      <Button size="sm">Small</Button>
                      <Button size="md">Medium</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </VStack>

                  {/* Size Guidelines */}
                  <VStack gap={3}>
                    <Label>Size guidelines</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Size
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Height
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              권장 사용처
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-medium">SM</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              28px
                            </td>
                            <td className="py-2 text-[var(--color-text-muted)]">
                              테이블 툴바, 밀집된 UI, 반복 가능한 보조 액션
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-medium">MD</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              32px
                            </td>
                            <td className="py-2 text-[var(--color-text-muted)]">
                              일반 폼, 모달/드로어 액션, 독립적인 CTA
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-medium">LG</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              36px
                            </td>
                            <td className="py-2 text-[var(--color-text-muted)]">
                              페이지 주요 CTA, 랜딩 페이지, 히어로 섹션
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1 space-y-1">
                      <div>
                        <strong>판단 기준:</strong> 밀집된 UI? → SM | 독립적인 CTA? → MD/LG | 반복
                        가능한 액션? → SM | 폼의 최종 제출? → MD/LG
                      </div>
                      <div>
                        <strong>수직 정렬:</strong> 같은 행에 있는 요소는 같은 사이즈 사용 (Input md
                        + Button md ✓)
                      </div>
                      <div>
                        <strong>min-width:</strong> 버튼은 최소 너비가 설정되어 있어 짧은 텍스트도
                        균일한 크기 유지 (SM: 60px, MD/LG: 80px)
                      </div>
                    </div>
                  </VStack>

                  {/* Variants */}
                  <VStack gap={3}>
                    <Label>Variants</Label>
                    <div className="grid grid-cols-7 gap-3">
                      {/* Default State */}
                      <VStack gap={1.5} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Primary
                        </span>
                        <Button size="sm" variant="primary">
                          Default
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          className="bg-[var(--color-action-primary-hover)]"
                        >
                          Hover
                        </Button>
                      </VStack>
                      <VStack gap={1.5} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Secondary
                        </span>
                        <Button size="sm" variant="secondary">
                          Default
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-[var(--button-secondary-hover-bg)]"
                        >
                          Hover
                        </Button>
                      </VStack>
                      <VStack gap={1.5} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Outline
                        </span>
                        <Button size="sm" variant="outline">
                          Default
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-[var(--button-secondary-hover-bg)]"
                        >
                          Hover
                        </Button>
                      </VStack>
                      <VStack gap={1.5} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Ghost
                        </span>
                        <Button size="sm" variant="ghost">
                          Default
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-[var(--button-ghost-hover-bg)]"
                        >
                          Hover
                        </Button>
                      </VStack>
                      <VStack gap={1.5} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Muted
                        </span>
                        <Button size="sm" variant="muted">
                          Default
                        </Button>
                        <Button
                          size="sm"
                          variant="muted"
                          className="bg-[var(--color-surface-subtle)] text-[var(--color-text-default)] border-[var(--color-border-strong)]"
                        >
                          Hover
                        </Button>
                      </VStack>
                      <VStack gap={1.5} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Danger
                        </span>
                        <Button size="sm" variant="danger">
                          Default
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          className="bg-[var(--color-state-danger-hover)]"
                        >
                          Hover
                        </Button>
                      </VStack>
                      <VStack gap={1.5} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Warning
                        </span>
                        <Button size="sm" variant="warning">
                          Default
                        </Button>
                        <Button
                          size="sm"
                          variant="warning"
                          className="bg-[var(--color-orange-700)]"
                        >
                          Hover
                        </Button>
                      </VStack>
                      <VStack gap={1.5} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Link
                        </span>
                        <Button size="sm" variant="link">
                          Default
                        </Button>
                        <Button size="sm" variant="link" className="underline underline-offset-4">
                          Hover
                        </Button>
                      </VStack>
                    </div>
                  </VStack>

                  {/* With Icons */}
                  <VStack gap={3}>
                    <Label>With icons</Label>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" leftIcon={<IconPlus size={12} />}>
                        Left icon
                      </Button>
                      <Button size="sm" rightIcon={<IconArrowRight size={12} />}>
                        Right icon
                      </Button>
                      <Button size="sm" icon={<IconHeart size={12} />} aria-label="Like" />
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<IconStar size={12} />}
                        aria-label="Star"
                      />
                    </div>
                    <div className="mt-4">
                      <Label>Icon + Text (Action Buttons)</Label>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[var(--color-text-subtle)] w-[120px]">
                          No selection
                        </span>
                        <Button
                          size="sm"
                          variant="muted"
                          leftIcon={<IconPlayerPlay size={12} />}
                          disabled
                        >
                          Start
                        </Button>
                        <Button
                          size="sm"
                          variant="muted"
                          leftIcon={<IconPlus size={12} />}
                          disabled
                        >
                          Create
                        </Button>
                        <Button
                          size="sm"
                          variant="muted"
                          leftIcon={<IconEdit size={12} />}
                          disabled
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="muted"
                          leftIcon={<IconTrash size={12} />}
                          disabled
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[var(--color-text-subtle)] w-[120px]">
                          With selection
                        </span>
                        <Button size="sm" variant="muted" leftIcon={<IconPlayerPlay size={12} />}>
                          Start
                        </Button>
                        <Button size="sm" variant="muted" leftIcon={<IconPlus size={12} />}>
                          Create
                        </Button>
                        <Button size="sm" variant="muted" leftIcon={<IconEdit size={12} />}>
                          Edit
                        </Button>
                        <Button size="sm" variant="muted" leftIcon={<IconTrash size={12} />}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </VStack>

                  {/* Icon Size Guidelines */}
                  <VStack gap={3}>
                    <Label>Icon size guidelines</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Button Size
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Icon Size
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              사용 예시
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-medium">SM (28px)</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              12px
                            </td>
                            <td className="py-2 text-[var(--color-text-muted)]">
                              테이블 툴바 액션 버튼
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-medium">MD (32px)</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              12px
                            </td>
                            <td className="py-2 text-[var(--color-text-muted)]">
                              모달/드로어 액션, 폼 제출
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-4 items-end mt-2">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          SM + 12px
                        </span>
                        <Button size="sm" leftIcon={<IconPlus size={12} />}>
                          Create
                        </Button>
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          MD + 12px
                        </span>
                        <Button size="md" leftIcon={<IconPlus size={12} />}>
                          Create
                        </Button>
                      </VStack>
                    </div>
                    <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
                      <strong>참고:</strong> SM/MD 버튼 모두 12px 아이콘을 사용하여 일관성을
                      유지합니다.
                    </div>
                  </VStack>

                  {/* States */}
                  <VStack gap={3}>
                    <Label>States</Label>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm">Default</Button>
                      <Button size="sm" disabled>
                        Disabled
                      </Button>
                      <Button size="sm" isLoading>
                        Loading
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" variant="secondary">
                        Default
                      </Button>
                      <Button size="sm" variant="secondary" disabled>
                        Disabled
                      </Button>
                    </div>
                  </VStack>

                  {/* Polymorphic */}
                  <VStack gap={3}>
                    <Label>Polymorphic (as prop)</Label>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" as="a" href="#" target="_blank">
                        As anchor
                      </Button>
                      <Button size="sm" as={Link} to="/">
                        As router link
                      </Button>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Input Component */}
              <Section
                id="input"
                title="Input"
                description="Text fields, textarea, number input, and search"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Input 유형 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[140px]">
                                    유형
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    사용 조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    예시
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Input
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    한 줄 텍스트 입력 (이름, IP, URL 등)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Instance Name, IP Address
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Textarea
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    여러 줄 텍스트 입력 (설명, 메모 등)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Description, Notes
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    NumberInput
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    숫자만 입력 (증감 버튼 포함)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    vCPU, Replica count, Port
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    SearchInput
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    검색 전용 입력 (아이콘 포함, 300ms debounce 필터링)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    리스트 필터, 리소스 검색
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Validation 정책
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-subtle)]">
                            상세 검증 정책(타이밍, 에러 표시·해제 규칙, 메시지 작성 규칙)은{' '}
                            <strong>Form field spacing</strong> 섹션의 Validation States를
                            참조하세요.
                          </p>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>필수 필드</strong>: 라벨 옆에{' '}
                              <span className="text-[var(--color-state-danger)]">*</span> 표시.
                            </li>
                            <li>
                              <strong>에러 표시</strong>: Input 테두리를 danger 색상으로 변경하고
                              하단에 ErrorMessage 표시. HelperText는 항상 유지.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Placeholder 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              입력 형식 예시를 표시합니다: <code>e.g. 192.168.0.1</code>,{' '}
                              <code>e.g. my-instance</code>
                            </li>
                            <li>
                              라벨을 반복하지 않습니다: 라벨이 &quot;Name&quot;이면 placeholder는
                              &quot;Name&quot;이 아닌 <code>Enter instance name</code>
                            </li>
                            <li>
                              필수/선택 여부를 placeholder에 표시하지 않습니다 (라벨의 * 표시로
                              충분).
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Size 선택 기준
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>sm (28px)</strong>: Toolbar, 테이블 인라인 편집, Drawer 내부
                              등 밀집된 영역.
                            </li>
                            <li>
                              <strong>md (32px)</strong>: 일반 폼 필드. Create/Edit 페이지의 기본
                              크기.
                            </li>
                            <li>
                              <strong>lg (40px)</strong>: 로그인, 단독 입력 화면 등 강조가 필요한
                              경우.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            readOnly vs disabled 구분
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>readOnly</strong>: 값을 표시하되 복사가 가능해야 하는 경우
                              (e.g. 자동 생성된 ID, API endpoint). 포커스 가능, 텍스트 선택/복사
                              가능.
                            </li>
                            <li>
                              <strong>disabled</strong>: 현재 맥락에서 입력이 불가능한 경우 (e.g.
                              다른 필드에 의존, 권한 부족). 포커스 불가, Tooltip으로 비활성 이유를
                              안내.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 가이드라인 */}
                  <VStack gap={3}>
                    <Label>가이드라인</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">
                          Do
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>
                            모든 Input은 FormField로 감싸서 라벨, 도움말, 에러를 일관되게
                            제공합니다.
                          </li>
                          <li>입력 형식이 특정한 경우 helperText로 형식을 안내합니다.</li>
                          <li>관련 있는 필드는 그룹으로 묶어 시각적 연관성을 제공합니다.</li>
                          <li>비밀번호 등 민감 정보는 type=&quot;password&quot;를 사용합니다.</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                          Don&apos;t
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>placeholder를 라벨 대용으로 사용하지 않습니다 (입력 시 사라짐).</li>
                          <li>타이핑 중에 실시간 에러를 표시하지 않습니다 (blur 시 검증).</li>
                          <li>disabled 상태의 이유를 설명 없이 비활성화하지 않습니다.</li>
                          <li>
                            숫자만 입력받는 필드에 일반 Input을 사용하지 않습니다 (NumberInput
                            사용).
                          </li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      height: 28/32px · padding: 10×8px · radius: 6px · font: 11-12px · border: 1px
                      → 2px focus
                    </div>
                  </VStack>

                  {/* Text Input - Status */}
                  <VStack gap={3}>
                    <Label>Text Input - Status</Label>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-start">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Placeholder
                        </span>
                        <Input placeholder="Input placeholder" className="w-full" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Value
                        </span>
                        <Input defaultValue="Input value" className="w-full" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Focus
                        </span>
                        <Input
                          defaultValue="Input focus"
                          className="w-full border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]"
                        />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Read-only
                        </span>
                        <Input defaultValue="Input read-only" readOnly className="w-full" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled
                        </span>
                        <Input defaultValue="Input disabled" disabled className="w-full" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Error
                        </span>
                        <Input
                          defaultValue="Input error"
                          error="Error message"
                          className="w-full"
                        />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Text Input - Sizes (Height) */}
                  <VStack gap={3}>
                    <Label>Text Input - Sizes (Height)</Label>
                    <div className="flex gap-4 items-start">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          SM (28px)
                        </span>
                        <Input size="sm" placeholder="Input placeholder" width="md" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          MD (32px)
                        </span>
                        <Input size="md" placeholder="Input placeholder" width="md" />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Text Input - Width */}
                  <VStack gap={3}>
                    <Label>Text Input - Width</Label>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-4 items-end">
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            XS (80px)
                          </span>
                          <Input placeholder="XS" width="xs" />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            SM (160px)
                          </span>
                          <Input placeholder="Small" width="sm" />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            MD (240px)
                          </span>
                          <Input placeholder="Medium" width="md" />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            LG (320px)
                          </span>
                          <Input placeholder="Large" width="lg" />
                        </VStack>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Half (50%)
                          </span>
                          <Input placeholder="Half width" width="half" />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Full (100%)
                          </span>
                          <Input placeholder="Full width" width="full" />
                        </VStack>
                      </div>
                    </div>
                  </VStack>

                  {/* With Labels & Helpers */}
                  <VStack gap={3}>
                    <Label>Labels & Validation</Label>
                    <div className="flex flex-wrap gap-4 items-start">
                      <Input label="Label" placeholder="Enter text..." width="md" />
                      <Input
                        label="With helper"
                        placeholder="Email"
                        helperText="We'll never share your email"
                        width="md"
                      />
                      <Input
                        label="With error"
                        placeholder="Username"
                        error="Username is required"
                        width="md"
                      />
                    </div>
                  </VStack>

                  {/* With Icons */}
                  <VStack gap={3}>
                    <Label>With icons</Label>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Search..."
                        leftElement={<IconSearch size={14} />}
                        width="md"
                      />
                      <Input placeholder="Email" rightElement={<IconMail size={14} />} width="md" />
                    </div>
                  </VStack>

                  {/* With Suffix (Outside) */}
                  <VStack gap={3}>
                    <Label>With suffix (outside)</Label>
                    <div className="flex gap-4 items-end">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Text suffix
                        </span>
                        <HStack gap={2} align="center">
                          <Input placeholder="0" width="sm" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            Seconds
                          </span>
                        </HStack>
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Unit suffix
                        </span>
                        <HStack gap={2} align="center">
                          <Input placeholder="100" width="sm" />
                          <span className="text-body-md text-[var(--color-text-default)]">GiB</span>
                        </HStack>
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Percentage
                        </span>
                        <HStack gap={2} align="center">
                          <Input placeholder="50" width="sm" />
                          <span className="text-body-md text-[var(--color-text-default)]">%</span>
                        </HStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* With Suffix (Inside) */}
                  <VStack gap={3}>
                    <Label>With suffix (inside)</Label>
                    <div className="flex gap-4 items-end">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Text suffix
                        </span>
                        <Input
                          placeholder="0"
                          aria-describedby="suffix-seconds"
                          rightElement={
                            <span
                              id="suffix-seconds"
                              className="text-body-sm text-[var(--color-text-muted)]"
                            >
                              Seconds
                            </span>
                          }
                          className="w-[160px]"
                        />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Unit suffix
                        </span>
                        <Input
                          placeholder="100"
                          aria-describedby="suffix-gib"
                          rightElement={
                            <span
                              id="suffix-gib"
                              className="text-body-sm text-[var(--color-text-muted)]"
                            >
                              GiB
                            </span>
                          }
                          className="w-[120px]"
                        />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Percentage
                        </span>
                        <Input
                          placeholder="50"
                          aria-describedby="suffix-percent"
                          rightElement={
                            <span
                              id="suffix-percent"
                              className="text-body-sm text-[var(--color-text-muted)]"
                            >
                              %
                            </span>
                          }
                          className="w-[120px]"
                        />
                      </VStack>
                    </div>
                    <div className="text-body-xs text-[var(--color-text-subtle)] mt-1 p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
                      <code>aria-describedby</code>로 suffix를 연결하면 스크린 리더가 "100 GiB"로
                      읽습니다.
                    </div>
                  </VStack>

                  {/* Textarea */}
                  <VStack gap={3}>
                    <Label>Textarea</Label>
                    <div className="flex gap-4">
                      <Textarea
                        placeholder="Input placeholder"
                        className="w-[var(--search-input-width)]"
                      />
                      <Textarea
                        defaultValue="Input value with multiple lines of text content"
                        className="w-[var(--search-input-width)]"
                      />
                    </div>
                  </VStack>

                  {/* Textarea - Code */}
                  <VStack gap={3}>
                    <Label>Textarea - Code Variant</Label>
                    <Textarea
                      variant="code"
                      placeholder="input user data"
                      defaultValue={`input user data\n\n`}
                      className="w-[var(--search-input-width)]"
                    />
                  </VStack>

                  {/* NumberInput (Stepper) - States */}
                  <VStack gap={3}>
                    <Label>Number Input - States</Label>
                    <div className="flex gap-4 items-start">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Default
                        </span>
                        <NumberInput defaultValue={1} width="md" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          With Min/Max
                        </span>
                        <NumberInput defaultValue={5} min={0} max={10} width="md" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled
                        </span>
                        <NumberInput defaultValue={1} disabled width="md" />
                      </VStack>
                    </div>
                  </VStack>

                  {/* NumberInput - Width */}
                  <VStack gap={3}>
                    <Label>Number Input - Width</Label>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-4 items-end">
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            XS (80px)
                          </span>
                          <NumberInput defaultValue={1} width="xs" />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            SM (160px)
                          </span>
                          <NumberInput defaultValue={1} width="sm" />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            MD (240px)
                          </span>
                          <NumberInput defaultValue={1} width="md" />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            LG (320px)
                          </span>
                          <NumberInput defaultValue={1} width="lg" />
                        </VStack>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Half (50%)
                          </span>
                          <NumberInput defaultValue={1} width="half" />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Full (100%)
                          </span>
                          <NumberInput defaultValue={1} width="full" />
                        </VStack>
                      </div>
                    </div>
                  </VStack>

                  {/* NumberInput with Label & Suffix */}
                  <VStack gap={3}>
                    <Label>With Label, Helper & Suffix</Label>
                    <VStack gap={2} className="max-w-[400px]">
                      <VStack gap={1}>
                        <span className="text-label-lg font-medium text-[var(--color-text-default)]">
                          Minimum Ready
                        </span>
                        <span className="text-body-sm text-[var(--color-text-muted)]">
                          The minimum time a pod must remain in a ready state before it is
                          considered available.
                        </span>
                      </VStack>
                      <HStack gap={2} align="center">
                        <NumberInput defaultValue={0} min={0} className="w-full" />
                        <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                          Seconds
                        </span>
                      </HStack>
                    </VStack>
                  </VStack>

                  {/* SearchInput */}
                  <VStack gap={3}>
                    <Label>Search input</Label>
                    <div className="flex gap-4 items-start">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          SM (28px)
                        </span>
                        <SearchInput
                          size="sm"
                          placeholder="Search placeholder"
                          className="w-[var(--search-input-width)]"
                        />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          MD (32px)
                        </span>
                        <SearchInput
                          size="md"
                          placeholder="Search placeholder"
                          className="w-[var(--search-input-width)]"
                        />
                      </VStack>
                    </div>
                  </VStack>

                  {/* SearchInput - Status */}
                  <VStack gap={3}>
                    <Label>Search Input - Status</Label>
                    <div className="flex gap-4 items-start">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Placeholder
                        </span>
                        <SearchInput
                          placeholder="Search placeholder"
                          className="w-[var(--search-input-width)]"
                        />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Value
                        </span>
                        <SearchInput
                          defaultValue="Search value"
                          className="w-[var(--search-input-width)]"
                        />
                      </VStack>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Form Field Spacing */}
              <Section
                id="form-field-spacing"
                title="Form field spacing"
                description="Standardized spacing for label + description + input combinations"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            FormField 구성 규칙
                          </h4>
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            모든 폼 입력 요소는 <strong>FormField</strong> 컴포넌트로 감싸서 일관된
                            라벨, 설명, 에러 메시지 표시를 보장합니다.
                          </p>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>Label</strong>: 필드의 용도를 명확히 설명. 필수 필드는{' '}
                              <span className="text-[var(--color-state-danger)]">*</span> 표시.
                            </li>
                            <li>
                              <strong>Description</strong> (선택): 라벨만으로 불충분한 경우 추가
                              설명 제공. 라벨 바로 아래 4px 간격.
                            </li>
                            <li>
                              <strong>HelperText</strong> (선택): 입력 형식/제약 조건 안내. Input
                              아래 8px 간격.
                            </li>
                            <li>
                              <strong>ErrorMessage</strong>: 검증 실패 시 HelperText 상단에 추가
                              표시. danger 색상. HelperText는 항상 유지.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Description vs HelperText 구분
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                                    구분
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    Description
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    HelperText
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    용도
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    필드의 목적·맥락을 설명 (&quot;왜 이 값을 입력하는가&quot;)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    입력 형식·제약 조건을 안내 (&quot;어떻게 입력해야 하는가&quot;)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    위치
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    Label 아래, Input 위 (4px gap)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Input 아래 (8px gap)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    타이포
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    text-body-md (12px/18px)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    text-body-sm (11px/16px)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    예시
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    &quot;이 인스턴스의 루트 비밀번호를 설정합니다&quot;
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    &quot;8자 이상, 대문자·숫자 포함&quot;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            폼 레이아웃 정책
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>단일 컬럼</strong>: Create/Edit 폼의 기본 레이아웃. 필드를
                              세로로 배치.
                            </li>
                            <li>
                              <strong>그룹핑</strong>: 관련 필드를 SectionCard 또는 Disclosure로
                              묶어 구조화.
                            </li>
                            <li>
                              <strong>spacing=&quot;loose&quot;</strong>: 복잡한 필드(탭, 테이블
                              포함)에는 spacing=&quot;loose&quot;로 12px 간격을 적용.
                            </li>
                            <li>
                              <strong>필드 순서</strong>: 필수 필드를 먼저, 선택 필드를 나중에
                              배치합니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <strong>Spacing:</strong>
                      <br />
                      • Input/Select/NumberInput: Label ↔ Input: 8px, Input ↔ HelperText: 8px
                      <br />
                      • FormField: Label ↔ Input: 8px, Label ↔ Description: 4px, Description ↔
                      Input: 8px, Input ↔ ErrorMessage: 8px, ErrorMessage ↔ HelperText: 8px, Input ↔
                      HelperText: 8px
                      <br />
                      • Radio/CheckboxGroup: Label ↔ Options: 12px, Label ↔ Description: 4px,
                      Description ↔ Options: 12px
                      <br />
                      <br />
                      <strong>Typography:</strong>
                      <br />
                      • Description (라벨 하단): text-body-md (12px/18px)
                      <br />• HelperText (Input 하단): text-body-sm (11px/16px)
                    </div>
                  </VStack>

                  {/* Standard Pattern */}
                  <VStack gap={3}>
                    <Label>Standard Pattern (Label → Input → Helper)</Label>
                    <div className="flex flex-wrap gap-6 items-start">
                      <VStack gap={1.5} className="max-w-[240px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">Input</span>
                        <Input
                          label="Field label"
                          placeholder="Enter value"
                          helperText="Helper text below input"
                          width="md"
                        />
                      </VStack>
                      <VStack gap={1.5} className="max-w-[240px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Select
                        </span>
                        <Select
                          label="Field label"
                          options={[
                            { value: '1', label: 'Option 1' },
                            { value: '2', label: 'Option 2' },
                          ]}
                          placeholder="Select option"
                          helperText="Helper text below select"
                          width="md"
                        />
                      </VStack>
                      <VStack gap={1.5} className="max-w-[240px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          NumberInput
                        </span>
                        <NumberInput
                          label="Field label"
                          defaultValue={0}
                          helperText="Helper text below stepper"
                          width="md"
                        />
                      </VStack>
                    </div>
                  </VStack>

                  {/* With Description Pattern */}
                  <VStack gap={3}>
                    <Label>With Description (Label → Description → Input)</Label>
                    <p className="text-body-sm text-[var(--color-text-subtle)]">
                      Use FormField compound component for label → description → input order
                    </p>
                    <div className="flex flex-wrap gap-6 items-start">
                      <VStack gap={1.5} className="max-w-[240px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">Input</span>
                        <FormField>
                          <FormField.Label>Field Label</FormField.Label>
                          <FormField.Description>
                            Description appears before input
                          </FormField.Description>
                          <FormField.Control>
                            <Input placeholder="Enter value" width="md" />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                      <VStack gap={1.5} className="max-w-[240px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Select
                        </span>
                        <FormField>
                          <FormField.Label>Field Label</FormField.Label>
                          <FormField.Description>
                            Description appears before select
                          </FormField.Description>
                          <FormField.Control>
                            <Select
                              options={[
                                { value: '1', label: 'Option 1' },
                                { value: '2', label: 'Option 2' },
                              ]}
                              placeholder="Select option"
                              width="md"
                            />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                      <VStack gap={1.5} className="max-w-[240px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          NumberInput
                        </span>
                        <FormField>
                          <FormField.Label>Field Label</FormField.Label>
                          <FormField.Description>
                            Description appears before stepper
                          </FormField.Description>
                          <FormField.Control>
                            <NumberInput defaultValue={0} width="md" />
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </div>
                  </VStack>

                  {/* With Both Description and Helper */}
                  <VStack gap={3}>
                    <Label>With Both (Label → Description → Input → Helper)</Label>
                    <p className="text-body-sm text-[var(--color-text-subtle)]">
                      Description explains the field purpose, Helper provides input format guidance
                    </p>
                    <div className="flex flex-wrap gap-6 items-start">
                      <VStack gap={1.5} className="max-w-[280px]">
                        <FormField>
                          <FormField.Label>Instance Name</FormField.Label>
                          <FormField.Description>
                            Choose a unique name for your instance
                          </FormField.Description>
                          <FormField.Control>
                            <Input placeholder="e.g., web-server-01" fullWidth />
                          </FormField.Control>
                          <FormField.HelperText>
                            2-64 characters, letters, numbers, -_.
                          </FormField.HelperText>
                        </FormField>
                      </VStack>
                    </div>
                  </VStack>

                  {/* RadioGroup Spacing */}
                  <VStack gap={3}>
                    <Label>RadioGroup (Label ↔ Options: 12px, Label ↔ Description: 4px)</Label>
                    <div className="flex flex-wrap gap-6 items-start">
                      <VStack gap={1.5} className="max-w-[280px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Without Description
                        </span>
                        <RadioGroup
                          label="Select option"
                          options={[
                            { value: '1', label: 'Option 1' },
                            { value: '2', label: 'Option 2' },
                          ]}
                        />
                      </VStack>
                      <VStack gap={1.5} className="max-w-[280px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          With Description
                        </span>
                        <RadioGroup
                          label="Select option"
                          description="Choose one of the available options"
                          options={[
                            { value: '1', label: 'Option 1' },
                            { value: '2', label: 'Option 2' },
                          ]}
                        />
                      </VStack>
                    </div>
                  </VStack>

                  {/* CheckboxGroup Spacing */}
                  <VStack gap={3}>
                    <Label>CheckboxGroup (Label ↔ Options: 12px, Label ↔ Description: 4px)</Label>
                    <div className="flex flex-wrap gap-6 items-start">
                      <VStack gap={1.5} className="max-w-[280px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Without Description
                        </span>
                        <CheckboxGroup label="Select options">
                          <Checkbox label="Option 1" />
                          <Checkbox label="Option 2" />
                        </CheckboxGroup>
                      </VStack>
                      <VStack gap={1.5} className="max-w-[280px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          With Description
                        </span>
                        <CheckboxGroup
                          label="Select options"
                          description="You can select multiple options"
                        >
                          <Checkbox label="Option 1" />
                          <Checkbox label="Option 2" />
                        </CheckboxGroup>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Validation States */}
                  <VStack gap={3}>
                    <Label>Validation States (Error + HelperText 동시 표시)</Label>
                    <p className="text-body-sm text-[var(--color-text-subtle)]">
                      검증 실패 시 ErrorMessage가 Input 하단, HelperText 상단에 추가로 표시됩니다.
                      HelperText는 숨겨지지 않고 항상 유지됩니다.
                    </p>
                    <div className="flex flex-wrap gap-6 items-start">
                      {/* Error: Simple Input */}
                      <VStack gap={1.5} className="max-w-[280px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Error only
                        </span>
                        <FormField error>
                          <FormField.Label>
                            Instance Name{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </FormField.Label>
                          <FormField.Control>
                            <Input placeholder="e.g., web-server-01" fullWidth error />
                          </FormField.Control>
                          <FormField.ErrorMessage>This field is required.</FormField.ErrorMessage>
                        </FormField>
                      </VStack>

                      {/* Error + HelperText */}
                      <VStack gap={1.5} className="max-w-[280px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Error + HelperText
                        </span>
                        <FormField
                          label="Instance Name"
                          helperText="2-64 characters, letters, numbers, -_."
                          errorMessage="This field is required."
                          error
                          required
                        >
                          <Input placeholder="e.g., web-server-01" fullWidth />
                        </FormField>
                      </VStack>

                      {/* Error: With Description + HelperText */}
                      <VStack gap={1.5} className="max-w-[280px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Description + Error + HelperText
                        </span>
                        <FormField
                          label="Password"
                          description="Set the root password for this instance"
                          helperText="Min 8 characters with uppercase, number."
                          errorMessage="Password must be at least 8 characters."
                          error
                          required
                        >
                          <Input type="password" placeholder="Enter password" fullWidth />
                        </FormField>
                      </VStack>

                      {/* Error: Select */}
                      <VStack gap={1.5} className="max-w-[280px]">
                        <span className="text-label-sm text-[var(--color-text-subtle)]">
                          Select with Error
                        </span>
                        <Select
                          label="Region"
                          error="Please select a region."
                          options={[
                            { value: '1', label: 'Seoul' },
                            { value: '2', label: 'Tokyo' },
                          ]}
                          placeholder="Select region"
                          fullWidth
                          required
                        />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Validation 정책 */}
                  <VStack gap={3}>
                    <Label>Validation 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            검증 타이밍
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[160px]">
                                    시점
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    동작
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    예시
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Blur (포커스 해제)
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    값을 수정한 적 있는(touched) 필드만 형식/필수 검증 실행. 미접촉
                                    필드는 무시.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    이름 필드에 타이핑 후 포커스 떠날 때
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Submit (제출)
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    전체 폼에 대한 Global Validation 실행
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Create/Save 버튼 클릭 시
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Tab 전환 (Soft)
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    현재 탭의 필수 필드 검증 실행. 에러를 표시하되 탭 전환은
                                    차단하지 않음.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Multi Tab Create에서 다른 탭으로 이동할 때
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    타이핑 중
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    검증하지 않음 (사용자 입력 방해 금지)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">—</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            에러 표시 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>표시 위치</strong>: ErrorMessage는 Input 하단, HelperText{' '}
                              <strong>상단</strong>에 표시됩니다. HelperText는 숨기지 않고 항상
                              유지합니다.
                            </li>
                            <li>
                              <strong>렌더링 순서</strong>: Input → ErrorMessage (danger) →
                              HelperText (subtle). 각 요소 간 8px 간격.
                            </li>
                            <li>
                              <strong>ErrorMessage 스타일</strong>: <code>text-body-sm</code>,{' '}
                              <code>text-[var(--color-state-danger)]</code> 색상,{' '}
                              <code>role=&quot;alert&quot;</code>.
                            </li>
                            <li>
                              <strong>HelperText 스타일</strong>: 에러 시에도{' '}
                              <code>text-body-sm</code>,{' '}
                              <code>text-[var(--color-text-subtle)]</code> 유지.
                            </li>
                            <li>
                              <strong>Input 테두리</strong>: <code>error</code> prop으로 테두리를
                              danger 색상으로 변경합니다.
                            </li>
                            <li>
                              <strong>에러 해제</strong>: 사용자가 타이핑을 시작하면(onChange) 즉시
                              에러 상태를 해제합니다. 재검증은 blur 시점에 수행.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Global Validation (Submit 시)
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>모든 필수 필드와 형식 검증을 한 번에 수행합니다.</li>
                            <li>
                              첫 번째 오류 필드로 <strong>자동 스크롤</strong>하고 해당 필드에{' '}
                              <strong>포커스</strong>를 설정합니다.
                            </li>
                            <li>Multi Tab Create의 경우, 오류가 있는 탭으로 자동 이동합니다.</li>
                            <li>
                              Floating card의 Configuration 섹션에 오류가 있는 섹션을 시각적으로
                              표시합니다.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            에러 메시지 작성 규칙
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-subtle)]">
                            현재 예시는 영어이며, 향후 다국어(i18n) 지원 예정입니다. 에러 메시지
                            키는 번역 가능한 형태로 관리합니다.
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    유형
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    메시지 예시
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    필수 필드 미입력
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    &quot;This field is required.&quot;
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    형식 오류
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    &quot;Please enter a valid IP address.&quot; / &quot;Must be
                                    2-64 characters.&quot;
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    범위 초과
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    &quot;Value must be between 1 and 100.&quot;
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    중복
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    &quot;This name is already in use.&quot;
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    선택 미완료
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    &quot;Please select a region.&quot; / &quot;At least one item
                                    must be selected.&quot;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Filter search Input Component */}
              <Section
                id="filter-search-input"
                title="Filter search Input"
                description="Combined search and filter input with tag display for applied filters"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">개요</h4>
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            리스트 페이지에서 리소스를 검색하고 필터링하기 위한 통합 입력
                            컴포넌트입니다. 검색어 입력과 구조화된 필터를 하나의 인터페이스에서
                            제공합니다.
                          </p>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            동작 정책
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>검색</strong>: 입력 후 300ms debounce 적용하여 필터링. Enter
                              키로 즉시 검색 확정.
                            </li>
                            <li>
                              <strong>필터 추가</strong>: 필터 필드 선택 → 값 입력/선택 → 태그로
                              적용.
                            </li>
                            <li>
                              <strong>필터 제거</strong>: 개별 태그의 X 클릭 또는 &quot;Clear
                              all&quot;로 전체 제거.
                            </li>
                            <li>
                              <strong>복합 필터</strong>: 여러 필터를 AND 조건으로 조합 가능.
                            </li>
                            <li>
                              <strong>빈 결과</strong>: 필터 적용 후 결과가 없으면 EmptyState와 함께
                              필터 초기화 옵션 제공.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            배치 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>ListToolbar 내 primaryActions 영역의 첫 번째 요소로 배치합니다.</li>
                            <li>
                              너비는 <code>w-[var(--search-input-width)]</code> CSS 변수를
                              사용합니다.
                            </li>
                            <li>
                              적용된 필터 태그는 Toolbar 하단에 표시되거나{' '}
                              <code>hideAppliedFilters</code>로 숨길 수 있습니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      height: 32px (sm) / 36px (md) · padding: 8×12px · radius: 6px · font: 12px ·
                      chip-gap: 4px
                    </div>
                  </VStack>

                  {/* Features */}
                  <VStack gap={3}>
                    <Label>Features</Label>
                    <ul className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] list-disc list-inside space-y-1">
                      <li>Click input to show available filter options</li>
                      <li>
                        Select filter field, then enter value (text) or select option (select type)
                      </li>
                      <li>Applied filters displayed as removable chips/tags</li>
                      <li>Supports text and select filter types</li>
                      <li>Clear all filters button when filters are applied</li>
                    </ul>
                  </VStack>

                  {/* Static States */}
                  <VStack gap={3}>
                    <Label>States (static preview)</Label>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                      {/* Row 1: Default, Filter Applied, Multiple Filters */}
                      {/* 1. Default State */}
                      <VStack gap={1.5} className="w-[var(--search-input-width)]">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          1. Default
                        </span>
                        <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                          <span className="flex-1 text-body-sm text-[var(--color-text-subtle)]">
                            Search by attributes
                          </span>
                          <IconSearch
                            size={12}
                            strokeWidth={2}
                            className="text-[var(--color-text-subtle)]"
                          />
                        </div>
                      </VStack>

                      {/* 2. Filter Applied */}
                      <VStack gap={1.5} className="w-[var(--search-input-width)]">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          2. Filter applied
                        </span>
                        <VStack gap={2}>
                          <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                            <span className="flex-1 text-body-sm text-[var(--color-text-subtle)]">
                              Search by attributes
                            </span>
                            <IconSearch
                              size={12}
                              strokeWidth={2}
                              className="text-[var(--color-text-subtle)]"
                            />
                          </div>
                          <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                            <Chip label="Name" value="instance-01" onRemove={() => {}} />
                            <button className="text-label-sm text-label-md text-[var(--color-action-primary)]">
                              Clear Filters
                            </button>
                          </div>
                        </VStack>
                      </VStack>

                      {/* 3. Multiple Filters */}
                      <VStack gap={1.5} className="w-[var(--search-input-width)]">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          3. Multiple filters
                        </span>
                        <VStack gap={2}>
                          <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                            <span className="flex-1 text-body-sm text-[var(--color-text-subtle)]">
                              Search by attributes
                            </span>
                            <IconSearch
                              size={12}
                              strokeWidth={2}
                              className="text-[var(--color-text-subtle)]"
                            />
                          </div>
                          <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                            <div className="flex items-center gap-1 flex-wrap">
                              <Chip label="Name" value="instance-01" onRemove={() => {}} />
                              <Chip label="Status" value="Running" onRemove={() => {}} />
                            </div>
                            <button className="text-label-sm text-label-md text-[var(--color-action-primary)] whitespace-nowrap">
                              Clear Filters
                            </button>
                          </div>
                        </VStack>
                      </VStack>

                      {/* Row 2: Dropdown states with extra bottom margin */}
                      {/* 4. Filter Dropdown Open */}
                      <VStack gap={1.5} className="w-[var(--search-input-width)] pb-28">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          4. Filter dropdown
                        </span>
                        <div className="relative">
                          <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)] rounded-[var(--radius-md)]">
                            <span className="flex-1 text-body-sm text-[var(--color-text-subtle)]">
                              Search by attributes
                            </span>
                            <IconSearch
                              size={12}
                              strokeWidth={2}
                              className="text-[var(--color-text-subtle)]"
                            />
                          </div>
                          <div className="absolute left-0 top-full mt-1 w-[160px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] overflow-hidden">
                            <div className="px-3 py-2 text-body-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]">
                              Filter by
                            </div>
                            <div>
                              <div className="px-3 py-2 text-body-sm text-[var(--color-text-default)] bg-[var(--color-surface-subtle)]">
                                Name
                              </div>
                              <div className="px-3 py-2 text-body-sm text-[var(--color-text-default)]">
                                Status
                              </div>
                              <div className="px-3 py-2 text-body-sm text-[var(--color-text-default)]">
                                Type
                              </div>
                            </div>
                          </div>
                        </div>
                      </VStack>

                      {/* 5. Text Input Mode */}
                      <VStack gap={1.5} className="w-[var(--search-input-width)] pb-28">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          5. Text filter input
                        </span>
                        <div className="relative">
                          <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)] rounded-[var(--radius-md)]">
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-surface-subtle)] rounded text-body-sm">
                              <span className="text-label-sm text-[var(--color-text-default)]">
                                Name
                              </span>
                              <span className="text-[var(--color-border-strong)]">|</span>
                            </span>
                            <span className="flex-1 text-body-sm text-[var(--color-text-default)]">
                              instance-01
                            </span>
                            <IconSearch
                              size={12}
                              strokeWidth={2}
                              className="text-[var(--color-text-subtle)]"
                            />
                          </div>
                        </div>
                      </VStack>

                      {/* 6. Select Options */}
                      <VStack gap={1.5} className="w-[var(--search-input-width)] pb-28">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          6. Select options
                        </span>
                        <div className="relative">
                          <div className="flex items-center gap-1 h-7 px-3 bg-[var(--color-surface-default)] border border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)] rounded-[var(--radius-md)]">
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-surface-subtle)] rounded text-body-sm">
                              <span className="text-label-sm text-[var(--color-text-default)]">
                                Status
                              </span>
                              <span className="text-[var(--color-border-strong)]">|</span>
                            </span>
                            <span className="flex-1"></span>
                            <IconSearch
                              size={12}
                              strokeWidth={2}
                              className="text-[var(--color-text-subtle)]"
                            />
                          </div>
                          <div className="absolute left-0 top-full mt-1 w-[160px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] overflow-hidden">
                            <div className="px-3 py-2 text-body-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]">
                              Status
                            </div>
                            <div>
                              <div className="px-3 py-2 text-body-sm text-[var(--color-text-default)] bg-[var(--color-surface-subtle)]">
                                Running
                              </div>
                              <div className="px-3 py-2 text-body-sm text-[var(--color-text-default)]">
                                Stopped
                              </div>
                            </div>
                            <div className="border-t border-[var(--color-border-subtle)]">
                              <div className="px-3 py-2 text-body-sm text-[var(--color-text-muted)]">
                                ← Back to filters
                              </div>
                            </div>
                          </div>
                        </div>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Interactive Demo */}
                  <VStack gap={3}>
                    <Label>Interactive demo</Label>
                    <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                      Click the input below to see available filters. Select a filter, enter a
                      value, and see it appear as a tag.
                    </p>
                    <FilterSearchInputDemo />
                  </VStack>

                  {/* Usage Example */}
                  <VStack gap={3}>
                    <Label>Usage example</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono whitespace-pre-wrap">
                      {`const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
  { id: 'status', label: 'Status', type: 'select', options: [
    { value: 'running', label: 'Running' },
    { value: 'stopped', label: 'Stopped' },
  ]},
];

// Default: filters displayed inside component
<FilterSearchInput
  filters={filterFields}
  appliedFilters={appliedFilters}
  onFiltersChange={setAppliedFilters}
  placeholder="Search with filters..."
  size="sm"
/>

// With hideAppliedFilters: use with ListToolbar for external filter display
<FilterSearchInput
  filters={filterFields}
  appliedFilters={appliedFilters}
  onFiltersChange={setAppliedFilters}
  placeholder="Search with filters..."
  size="sm"
  hideAppliedFilters  // Filters shown in ListToolbar instead
/>`}
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Select Component */}
              <Section
                id="select"
                title="Select"
                description="Dropdown select for choosing from a list of options"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Select vs Radio vs Checkbox 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    권장 컴포넌트
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    옵션 4개 이상, 단일 선택
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Select
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    옵션 2~3개, 단일 선택, 모든 옵션을 한눈에 볼 필요
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    RadioGroup
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    다중 선택 가능
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    CheckboxGroup 또는 Multi-Select
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    On/Off 토글 (2가지 상태)
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Toggle
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            사용 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              placeholder로 &quot;Select [항목]&quot; 형태의 안내를 제공합니다 (예:
                              Select region).
                            </li>
                            <li>기본 선택값이 있는 경우 미리 설정하여 사용자 입력을 줄입니다.</li>
                            <li>
                              옵션 목록이 길 경우(20개 이상) 스크롤 영역 내에서 탐색합니다. (검색
                              가능 Select는 현재 미지원)
                            </li>
                            <li>FormField와 함께 사용하여 라벨과 helperText를 제공합니다.</li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 가이드라인 */}
                  <VStack gap={3}>
                    <Label>가이드라인</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">
                          Do
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>옵션 목록은 논리적 순서로 정렬합니다 (알파벳, 빈도, 중요도).</li>
                          <li>
                            사용자가 선택을 해제할 수 있도록 &quot;None&quot; 옵션을 제공합니다
                            (선택 사항인 경우).
                          </li>
                          <li>
                            긴 옵션 텍스트는 말줄임 처리하고 tooltip으로 전체 텍스트를 제공합니다.
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                          Don&apos;t
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>
                            옵션이 3개 이하인 경우 Select를 사용하지 않습니다 (RadioGroup 사용).
                          </li>
                          <li>Select 내부에 복잡한 레이아웃(아이콘+설명)을 넣지 않습니다.</li>
                          <li>
                            옵션 목록이 동적으로 변경되면서 현재 선택이 사라지게 하지 않습니다.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      padding: 10×8px · radius: 6px · font: 12px · item: 10×6px, 11px · border: 1px
                      → 2px focus
                    </div>
                  </VStack>

                  {/* Dropdown Menu Preview */}
                  <VStack gap={3}>
                    <Label>Dropdown Menu (Expanded)</Label>
                    <div className="flex gap-6 items-start flex-wrap">
                      {/* Default dropdown */}
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Default
                        </span>
                        <VStack gap={1} className="w-[200px]">
                          <button className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] rounded-[var(--select-radius)] cursor-pointer">
                            <span className="text-body-md text-[var(--color-text-muted)]">
                              Select status
                            </span>
                            <IconChevronDown
                              size={16}
                              stroke={1.5}
                              className="text-[var(--color-text-default)] rotate-180"
                            />
                          </button>
                          <div className="w-full bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] overflow-hidden">
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                              Active
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                              Shutoff
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer">
                              Building
                            </div>
                          </div>
                        </VStack>
                      </VStack>
                      {/* With selected item */}
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          With Selection
                        </span>
                        <VStack gap={1} className="w-[200px]">
                          <button className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] rounded-[var(--select-radius)] cursor-pointer">
                            <span className="text-body-md text-[var(--color-text-default)]">
                              Active
                            </span>
                            <IconChevronDown
                              size={16}
                              stroke={1.5}
                              className="text-[var(--color-text-default)] rotate-180"
                            />
                          </button>
                          <div className="w-full bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] overflow-hidden">
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                              Active <IconCheck size={14} className="shrink-0" />
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                              Shutoff
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer">
                              Building
                            </div>
                          </div>
                        </VStack>
                      </VStack>
                      {/* With hover state */}
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Hover State
                        </span>
                        <VStack gap={1} className="w-[200px]">
                          <button className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] rounded-[var(--select-radius)] cursor-pointer">
                            <span className="text-body-md text-[var(--color-text-muted)]">
                              Select status
                            </span>
                            <IconChevronDown
                              size={16}
                              stroke={1.5}
                              className="text-[var(--color-text-default)] rotate-180"
                            />
                          </button>
                          <div className="w-full bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] overflow-hidden">
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                              Active
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] bg-[var(--select-item-hover-bg)] text-[var(--color-text-default)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                              Shutoff
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] cursor-pointer">
                              Building
                            </div>
                          </div>
                        </VStack>
                      </VStack>
                      {/* With disabled options */}
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled Items
                        </span>
                        <VStack gap={1} className="w-[200px]">
                          <button className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] rounded-[var(--select-radius)] cursor-pointer">
                            <span className="text-body-md text-[var(--color-text-default)]">
                              Medium
                            </span>
                            <IconChevronDown
                              size={16}
                              stroke={1.5}
                              className="text-[var(--color-text-default)] rotate-180"
                            />
                          </button>
                          <div className="w-full bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] overflow-hidden">
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                              Small (2 vCPU)
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                              Medium (4 vCPU) <IconCheck size={14} className="shrink-0" />
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-subtle)] cursor-not-allowed border-b border-[var(--color-border-subtle)]">
                              Large (8 vCPU)
                            </div>
                            <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-subtle)] cursor-not-allowed">
                              X-Large (16 vCPU)
                            </div>
                          </div>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Status */}
                  <VStack gap={3}>
                    <Label>Status</Label>
                    <div className="flex gap-4 items-start flex-wrap">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Placeholder
                        </span>
                        <Select
                          placeholder="Placeholder"
                          width="md"
                          options={[
                            { value: 'active', label: 'Active' },
                            { value: 'shutoff', label: 'Shutoff' },
                            { value: 'building', label: 'Building' },
                          ]}
                        />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Value
                        </span>
                        <Select
                          placeholder="Placeholder"
                          defaultValue="active"
                          width="md"
                          options={[
                            { value: 'active', label: 'Active' },
                            { value: 'shutoff', label: 'Shutoff' },
                            { value: 'building', label: 'Building' },
                          ]}
                        />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled
                        </span>
                        <Select
                          placeholder="Placeholder"
                          disabled
                          width="md"
                          options={[
                            { value: 'active', label: 'Active' },
                            { value: 'shutoff', label: 'Shutoff' },
                            { value: 'building', label: 'Building' },
                          ]}
                        />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Error
                        </span>
                        <Select
                          placeholder="Placeholder"
                          error="Please select an option"
                          width="md"
                          options={[
                            { value: 'active', label: 'Active' },
                            { value: 'shutoff', label: 'Shutoff' },
                            { value: 'building', label: 'Building' },
                          ]}
                        />
                      </VStack>
                    </div>
                  </VStack>

                  {/* With Label */}
                  <VStack gap={3}>
                    <Label>With Label & Helper</Label>
                    <div className="flex gap-4 items-start">
                      <Select
                        label="Status"
                        placeholder="Select status"
                        width="md"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                      />
                      <Select
                        label="Region"
                        placeholder="Select region"
                        helperText="Choose your preferred region"
                        width="md"
                        options={[
                          { value: 'kr', label: 'Korea' },
                          { value: 'us', label: 'United States' },
                          { value: 'jp', label: 'Japan' },
                        ]}
                      />
                    </div>
                  </VStack>

                  {/* Width Variants */}
                  <VStack gap={3}>
                    <Label>Width variants</Label>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-4 items-end">
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            XS (80px)
                          </span>
                          <Select
                            placeholder="Select"
                            width="xs"
                            options={[
                              { value: 'active', label: 'Active' },
                              { value: 'shutoff', label: 'Shutoff' },
                            ]}
                          />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            SM (160px)
                          </span>
                          <Select
                            placeholder="Select"
                            width="sm"
                            options={[
                              { value: 'active', label: 'Active' },
                              { value: 'shutoff', label: 'Shutoff' },
                            ]}
                          />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            MD (240px)
                          </span>
                          <Select
                            placeholder="Select"
                            width="md"
                            options={[
                              { value: 'active', label: 'Active' },
                              { value: 'shutoff', label: 'Shutoff' },
                            ]}
                          />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            LG (320px)
                          </span>
                          <Select
                            placeholder="Select"
                            width="lg"
                            options={[
                              { value: 'active', label: 'Active' },
                              { value: 'shutoff', label: 'Shutoff' },
                            ]}
                          />
                        </VStack>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Half (50%)
                          </span>
                          <Select
                            placeholder="Select"
                            width="half"
                            options={[
                              { value: 'active', label: 'Active' },
                              { value: 'shutoff', label: 'Shutoff' },
                            ]}
                          />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Full (100%)
                          </span>
                          <Select
                            placeholder="Select"
                            width="full"
                            options={[
                              { value: 'active', label: 'Active' },
                              { value: 'shutoff', label: 'Shutoff' },
                            ]}
                          />
                        </VStack>
                      </div>
                    </div>
                  </VStack>

                  {/* Disabled Options */}
                  <VStack gap={3}>
                    <Label>With Disabled Options</Label>
                    <Select
                      label="Instance type"
                      placeholder="Select type"
                      defaultValue="medium"
                      options={[
                        { value: 'small', label: 'Small (2 vCPU)' },
                        { value: 'medium', label: 'Medium (4 vCPU)' },
                        { value: 'large', label: 'Large (8 vCPU)', disabled: true },
                        { value: 'xlarge', label: 'X-Large (16 vCPU)', disabled: true },
                      ]}
                      className="w-[240px]"
                    />
                  </VStack>
                </VStack>
              </Section>

              {/* DatePicker Component */}
              <DatePickerSection />

              {/* Slider Component */}
              <Section
                id="slider"
                title="Slider"
                description="Draggable slider for selecting values within a range"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={6}>
                        {/* 판단 기준 */}
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            패턴 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    질문
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    예
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    아니오
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    사용자가 값을 미리 알고 있는가?
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    NumberInput 단독
                                  </td>
                                  <td className="py-2 text-[var(--color-text-subtle)]">
                                    다음 질문 →
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    명확한 min~max 범위가 있는가?
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-subtle)]">
                                    다음 질문 →
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    NumberInput 단독
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    정확한 값 입력이 필요한가?
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Slider + NumberInput
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Slider 단독
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    min~max 범위 자체를 정의하는가?
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    RangeSlider + NumberInput ×2
                                  </td>
                                  <td className="py-2 text-[var(--color-text-subtle)]">—</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>

                        {/* 4가지 패턴 */}
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            4가지 패턴
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    패턴
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    사용 조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    적용 대상
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    A. NumberInput 단독
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    값을 미리 알고 있거나 범위가 좁음 (~20개)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    포트 번호, 레플리카 수, Parallelism
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    B. Slider + NumberInput
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    넓은 범위 + 정밀 입력 + 위치 인지 필요
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    스토리지(GiB), vCPU, 메모리, 디스크
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    C. Slider 단독
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    대략적 값, 감각적 조절이 자연스러운 값
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    AI Temperature, Top-p
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    D. RangeSlider + NumberInput ×2
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    min~max 범위 자체를 사용자가 정의
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    비밀번호 길이 정책, 포트 범위
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>

                        {/* Slider step 가이드 */}
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Slider step 가이드
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    범위 크기
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    Slider step
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    NumberInput step
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    예시
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">~50</td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    1
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">1</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    vCPU (1~64)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    50~200
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    5
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">1</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    메모리 (1~256 GiB)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    200~1000
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    10
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">1</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    스토리지 (10~1000 GiB)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    1000+
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    50~100
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">1</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    대용량 스토리지
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="text-body-sm text-[var(--color-text-subtle)]">
                            Slider step은 빠른 조절용으로 크게, NumberInput step은 정밀 입력용으로 1
                            고정.
                          </p>
                        </VStack>

                        {/* Slider 행 너비 규칙 */}
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Slider 행 너비 규칙
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    컨텍스트
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    Slider 행 너비
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    적용 방법
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    모든 컨텍스트
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    고정 240px
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Slider 컴포넌트 내부에서 적용
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="text-body-xs text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
                            --slider-track-width: 240px
                          </div>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      track: 6px height · thumb: 16px, 3px border · fill: primary
                    </div>
                  </VStack>

                  {/* Pattern C: Slider alone */}
                  <VStack gap={3}>
                    <Label>Pattern C: Slider 단독 (showValue)</Label>
                    <Slider defaultValue={40} showValue />
                  </VStack>

                  {/* Pattern B: Slider + NumberInput */}
                  <SliderWithNumberInputDemo />

                  {/* Pattern B: Custom Range */}
                  <SliderWithCustomRangeDemo />

                  {/* States */}
                  <VStack gap={3}>
                    <Label>States</Label>
                    <div className="flex flex-col gap-4">
                      <VStack gap={1}>
                        <span className="text-body-xs text-[var(--color-text-subtle)]">
                          Default
                        </span>
                        <Slider defaultValue={30} showValue />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-body-xs text-[var(--color-text-subtle)]">
                          Disabled
                        </span>
                        <Slider defaultValue={60} disabled showValue />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Pattern D: RangeSlider */}
                  <RangeSliderDemo />
                </VStack>
              </Section>

              {/* Chip Component */}
              <Section
                id="chip"
                title="Chip"
                description="Interactive tags for displaying selected values with optional remove action"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            사용자가 선택/입력한 값을 태그 형태로 표시하고, 제거 버튼(X)으로 삭제할
                            수 있습니다.
                          </li>
                          <li>
                            <strong>Labels</strong>: Kubernetes label(key=value) 표시 시 Chip을
                            사용합니다.
                          </li>
                          <li>
                            <strong>필터</strong>: 적용된 필터 조건을 Chip으로 표시하고 개별 제거가
                            가능하게 합니다.
                          </li>
                          <li>
                            <strong>길이 제한</strong>: 텍스트가 길 경우 말줄임 처리하고 tooltip으로
                            전체 텍스트 제공.
                          </li>
                          <li>
                            <strong>최대 개수</strong>: 화면에 너무 많은 Chip이 쌓이면 &quot;+N
                            more&quot;로 접어서 표시합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      padding: 8×4px · gap: 6px · radius: 6px · font: 11px
                    </div>
                  </VStack>

                  {/* With Remove Button */}
                  <VStack gap={3}>
                    <Label>With Remove Button</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Chip value="Active" onRemove={() => {}} />
                      <Chip label="Name" value="a" onRemove={() => {}} />
                      <Chip label="Status" value="Running" onRemove={() => {}} />
                    </div>
                  </VStack>

                  {/* Selected Variant */}
                  <VStack gap={3}>
                    <Label>Selected Variant (for Radio/Checkbox selections)</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Chip value="default-sg" variant="selected" onRemove={() => {}} />
                      <Chip value="custom-group" variant="selected" onRemove={() => {}} />
                      <Chip value="production" variant="selected" onRemove={() => {}} />
                    </div>
                  </VStack>

                  {/* States */}
                  <VStack gap={3}>
                    <Label>States</Label>
                    <div className="flex gap-2 items-start">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Default
                        </span>
                        <Chip label="Name" value="a" onRemove={() => {}} />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled
                        </span>
                        <Chip label="Name" value="a" disabled />
                      </VStack>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* SelectionIndicator Component */}
              <Section
                id="selection-indicator"
                title="SelectionIndicator"
                description="Display component for showing table selection state. Supports error state for required selection validation."
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>테이블에서 선택된 항목의 수를 표시하는 전용 컴포넌트입니다.</li>
                          <li>
                            선택 필수(required) 필드에서 미선택 시 <strong>에러 상태</strong>를
                            표시합니다.
                          </li>
                          <li>선택된 항목의 개별 제거(X 클릭)와 전체 해제를 지원합니다.</li>
                          <li>
                            Drawer 내 리소스 선택 시 테이블 아래에 배치하여 선택 상태를 알립니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      min-height: 42px · padding: 8×12px · radius: table-row-radius · gap: 16px
                    </div>
                  </VStack>

                  {/* Empty State */}
                  <VStack gap={3}>
                    <Label>Empty State</Label>
                    <SelectionIndicator />
                  </VStack>

                  {/* With Selection */}
                  <VStack gap={3}>
                    <Label>With Selection</Label>
                    <SelectionIndicator
                      selectedItems={[{ id: '1', label: 'ubuntu-24.04-tk-base' }]}
                      onRemove={() => {}}
                    />
                  </VStack>

                  {/* Multiple Selections */}
                  <VStack gap={3}>
                    <Label>Multiple Selections</Label>
                    <SelectionIndicator
                      selectedItems={[
                        { id: '1', label: 'default-sg' },
                        { id: '2', label: 'web-server-sg' },
                        { id: '3', label: 'database-sg' },
                      ]}
                      onRemove={() => {}}
                    />
                  </VStack>

                  {/* Multiple Selections (Wrapping) */}
                  <VStack gap={3}>
                    <Label>Multiple Selections (Wrapping)</Label>
                    <SelectionIndicator
                      selectedItems={[
                        { id: '1', label: 'default-sg' },
                        { id: '2', label: 'web-server-sg' },
                        { id: '3', label: 'database-sg' },
                        { id: '4', label: 'monitoring-sg' },
                        { id: '5', label: 'load-balancer-sg' },
                        { id: '6', label: 'api-gateway-sg' },
                        { id: '7', label: 'cache-cluster-sg' },
                        { id: '8', label: 'message-queue-sg' },
                      ]}
                      onRemove={() => {}}
                    />
                  </VStack>

                  {/* Error State */}
                  <VStack gap={3}>
                    <Label>Error State</Label>
                    <SelectionIndicator error errorMessage="Please select a start source." />
                  </VStack>

                  {/* Error State with Custom Empty Text */}
                  <VStack gap={3}>
                    <Label>Error State (uses emptyText as fallback)</Label>
                    <SelectionIndicator error emptyText="Selection is required" />
                  </VStack>
                </VStack>
              </Section>

              {/* Pagination Component */}
              <Section
                id="pagination"
                title="Pagination"
                description="Navigation for paginated content"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            Table 바로 위에 배치합니다. 총 항목 수, 현재 페이지, 선택된 항목 수를
                            표시합니다.
                          </li>
                          <li>
                            <strong>페이지 크기 옵션</strong>: 기본 10. Settings 버튼으로 사용자가
                            변경 가능 (10, 20, 50, 100).
                          </li>
                          <li>
                            <strong>페이지 변경 시</strong>: 선택 상태를 초기화하고, 테이블 상단으로
                            스크롤합니다.
                          </li>
                          <li>
                            <strong>키보드 접근</strong>: 좌우 화살표 키로 페이지 이동이 가능합니다.
                          </li>
                          <li>
                            <strong>총 1페이지</strong>: 항목이 페이지 크기 이하일 때도 Pagination을
                            표시하되, 페이지 이동 버튼은 disabled 처리합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      item-size: 24px · gap: 8px · radius: 4px · font: 12px
                    </div>
                  </VStack>

                  {/* Basic */}
                  <VStack gap={3}>
                    <Label>Basic</Label>
                    <Pagination
                      currentPage={demoPage1}
                      totalPages={10}
                      onPageChange={setDemoPage1}
                    />
                  </VStack>

                  {/* Middle Page */}
                  <VStack gap={3}>
                    <Label>Middle Page (with dots)</Label>
                    <Pagination
                      currentPage={demoPage2}
                      totalPages={10}
                      onPageChange={setDemoPage2}
                    />
                  </VStack>

                  {/* Many Pages */}
                  <VStack gap={3}>
                    <Label>Many pages</Label>
                    <Pagination
                      currentPage={demoPage3}
                      totalPages={50}
                      onPageChange={setDemoPage3}
                    />
                  </VStack>

                  {/* Few Pages */}
                  <VStack gap={3}>
                    <Label>Few Pages (no dots)</Label>
                    <Pagination
                      currentPage={demoPage4}
                      totalPages={5}
                      onPageChange={setDemoPage4}
                    />
                  </VStack>

                  {/* Disabled */}
                  <VStack gap={3}>
                    <Label>Disabled</Label>
                    <Pagination
                      currentPage={3}
                      totalPages={10}
                      onPageChange={(page) => console.log('Page:', page)}
                      disabled
                    />
                  </VStack>

                  {/* With Total Items Only */}
                  <VStack gap={3}>
                    <Label>With Total Items</Label>
                    <Pagination
                      currentPage={demoPage1}
                      totalPages={10}
                      onPageChange={setDemoPage1}
                      totalItems={115}
                    />
                  </VStack>

                  {/* With Settings & Total Items */}
                  <VStack gap={3}>
                    <Label>With Settings & Total Items</Label>
                    <Pagination
                      currentPage={demoPage1}
                      totalPages={10}
                      onPageChange={setDemoPage1}
                      showSettings
                      onSettingsClick={() => console.log('Settings clicked')}
                      totalItems={115}
                    />
                  </VStack>

                  {/* With Selected Count */}
                  <VStack gap={3}>
                    <Label>With Selected Count (3 selected)</Label>
                    <Pagination
                      currentPage={demoPage1}
                      totalPages={10}
                      onPageChange={setDemoPage1}
                      showSettings
                      onSettingsClick={() => console.log('Settings clicked')}
                      totalItems={115}
                      selectedCount={3}
                    />
                    <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                      When rows are selected in a table, the pagination shows "X selected / Y items"
                      format.
                    </p>
                  </VStack>
                </VStack>
              </Section>

              {/* Loading Component */}
              <Section
                id="loading"
                title="Loading"
                description="Loading indicators for various states"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Spinner vs Skeleton 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    유형
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    사용 조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    예시
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Spinner
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    레이아웃을 예측할 수 없거나, 단일 영역 로딩 시
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    버튼 로딩, 데이터 제출 중
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Skeleton
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    최종 레이아웃을 미리 알 수 있는 경우
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    테이블 행, 카드 목록, 상세 페이지
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    ProgressBar
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    진행률을 수치로 알 수 있는 경우 (determinate)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    파일 업로드, 이미지 빌드, 마이그레이션
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            로딩 표시 정책
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>지연 표시</strong>: API 응답이 300ms 이내에 완료되면 로딩
                              표시를 건너뜁니다 (깜빡임 방지).
                            </li>
                            <li>
                              <strong>전체 페이지</strong>: 페이지 전체 데이터 로딩 시 Skeleton을
                              사용합니다.
                            </li>
                            <li>
                              <strong>부분 영역</strong>: 특정 섹션만 로딩 시 해당 영역에만
                              Spinner를 표시합니다.
                            </li>
                            <li>
                              <strong>버튼 로딩</strong>: 제출 중인 버튼은 Spinner + disabled 상태로
                              표시합니다.
                            </li>
                            <li>
                              <strong>장시간 로딩</strong>: 10초 이상 소요 시 &quot;This may take a
                              moment...&quot; 등 안내 메시지를 표시하고, 가능하면 ProgressBar로
                              전환합니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      spinner: 16/22/32px · progress: h-1 · button: min-w-80px
                    </div>
                  </VStack>

                  {/* Spinner Variant */}
                  <VStack gap={3}>
                    <Label>Spinner variant</Label>
                    <div className="flex gap-8 items-end p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Small
                        </span>
                        <Loading variant="spinner" size="sm" text="Loading" />
                      </VStack>
                      <VStack gap={2} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Medium
                        </span>
                        <Loading variant="spinner" size="md" text="Loading" />
                      </VStack>
                      <VStack gap={2} align="center">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Large
                        </span>
                        <Loading variant="spinner" size="lg" text="Loading" />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Progress Variant */}
                  <VStack gap={3}>
                    <Label>Progress variant</Label>
                    <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      <Loading
                        variant="progress"
                        text="Loading.."
                        description="Create an instance to start using compute resources."
                        progress={68}
                        statusText="Status: parsing"
                      />
                    </div>
                  </VStack>

                  {/* Button Variant */}
                  <VStack gap={3}>
                    <Label>Button Variant (Disabled Loading State)</Label>
                    <div className="flex gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      <Loading variant="button" buttonLabel="Loading" />
                      <Loading variant="button" buttonLabel="Saving" />
                      <Loading variant="button" buttonLabel="Processing" />
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Toggle Component */}
              <Section
                id="toggle"
                title="Toggle"
                description="On/Off switch control for binary settings"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Toggle vs Checkbox 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    권장 컴포넌트
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    클릭 즉시 UI 상태 변경 (optimistic update). API 실패 시 롤백.
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Toggle
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    폼 제출 시 반영되는 동의/선택
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Checkbox
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    여러 항목 중 복수 선택
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    CheckboxGroup
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            사용 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              Toggle 옆에 설정 항목의 라벨을 표시합니다 (e.g. &quot;Auto
                              scaling&quot;, &quot;Enable monitoring&quot;).
                            </li>
                            <li>
                              Toggle은 On/Off 이진 선택에 사용합니다. Checkbox는 다중 항목
                              선택(체크리스트)에 사용합니다.
                            </li>
                            <li>
                              Toggle로 추가 옵션 영역을 열고 닫는 패턴 (conditional display)이
                              가능합니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      track: 36×20px · thumb: 16×16px · padding: 4px · radius: pill · gap: 8px
                    </div>
                  </VStack>

                  {/* Layout */}
                  <VStack gap={3}>
                    <Label>Layout</Label>
                    <div className="flex gap-8 items-start">
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Without Label
                        </span>
                        <Toggle defaultChecked />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          With Label
                        </span>
                        <Toggle label="Bootable" defaultChecked />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Status */}
                  <VStack gap={3}>
                    <Label>Status</Label>
                    <div className="flex gap-8 items-start">
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Off
                        </span>
                        <Toggle label="Setting" checked={false} onChange={() => {}} />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          On
                        </span>
                        <Toggle label="Setting" checked onChange={() => {}} />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled Off
                        </span>
                        <Toggle label="Setting" disabled />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled On
                        </span>
                        <Toggle label="Setting" defaultChecked disabled />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Interactive */}
                  <VStack gap={3}>
                    <Label>Interactive examples</Label>
                    <div className="flex flex-col gap-3">
                      <Toggle label="Enable dark mode" defaultChecked />
                      <Toggle label="Receive notifications" />
                      <Toggle label="Auto-backup enabled" defaultChecked />
                    </div>
                  </VStack>

                  {/* With Description */}
                  <VStack gap={3}>
                    <Label>With description</Label>
                    <Toggle
                      label="Auto-scaling"
                      description="Automatically scale instances based on demand"
                      defaultChecked
                    />
                  </VStack>

                  {/* Mini Toggle (Chart Controls) */}
                  <VStack gap={3}>
                    <Label>Mini Toggle (Chart Controls)</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] mb-2">
                      size: 24×12px · thumb: 8×8px · border: 1px · radius: 6px
                    </div>
                    <div className="flex gap-8 items-center">
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Off
                        </span>
                        <span className="toggleSwitch" />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          On
                        </span>
                        <span className="toggleSwitch toggleSwitchActive" />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Usage Example
                        </span>
                        <div className="flex items-center gap-2 text-body-sm text-[var(--color-text-default)]">
                          <span>CPU</span>
                          <span className="toggleSwitch toggleSwitchActive" />
                          <span className="text-[var(--color-border-default)]">|</span>
                          <span>Memory</span>
                          <span className="toggleSwitch" />
                        </div>
                      </VStack>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Checkbox Component */}
              <Section
                id="checkbox"
                title="Checkbox"
                description="Selection control for single or multiple options"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>단일 체크박스</strong>: 약관 동의, 옵션 활성화 등 이진(yes/no)
                            선택에 사용합니다.
                          </li>
                          <li>
                            <strong>CheckboxGroup</strong>: 여러 옵션 중 복수 선택이 가능한 경우
                            사용합니다.
                          </li>
                          <li>
                            <strong>테이블 선택</strong>: Table 컴포넌트의 행 선택에 내장되어
                            사용됩니다.
                          </li>
                          <li>
                            <strong>Indeterminate</strong>: &quot;전체 선택&quot; 체크박스에서 일부
                            항목만 선택된 경우 indeterminate(—) 상태로 표시합니다.
                          </li>
                          <li>
                            라벨은 반드시 제공하며, 라벨 클릭으로도 체크 상태를 변경할 수 있어야
                            합니다.
                          </li>
                          <li>
                            Toggle은 On/Off 이진 선택, Checkbox는 다중 항목 선택(체크리스트)에
                            사용합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>size: 16×16px</code> · <code>radius: 4px</code> · <code>gap: 6px</code>{' '}
                      · <code>icon: 12px</code>
                    </div>
                  </VStack>

                  {/* Layout */}
                  <VStack gap={3}>
                    <Label>Layout</Label>
                    <div className="flex gap-8 items-start">
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Icon Only
                        </span>
                        <Checkbox defaultChecked />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          With Label
                        </span>
                        <Checkbox label="Label" defaultChecked />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Status */}
                  <VStack gap={3}>
                    <Label>Status</Label>
                    <div className="flex gap-8 items-start">
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Unselected
                        </span>
                        <Checkbox label="Label" checked={false} onChange={() => {}} />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Selected
                        </span>
                        <Checkbox label="Label" checked onChange={() => {}} />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Indeterminate
                        </span>
                        <Checkbox label="Label" checked indeterminate onChange={() => {}} />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled
                        </span>
                        <Checkbox label="Label" disabled />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled + Checked
                        </span>
                        <Checkbox label="Label" checked disabled />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Error State */}
                  <VStack gap={3}>
                    <Label>Error state</Label>
                    <div className="flex gap-8 items-start">
                      <Checkbox
                        label="Unchecked with error"
                        error
                        errorMessage="This field is required"
                      />
                      <Checkbox label="Checked with error" defaultChecked error />
                    </div>
                  </VStack>

                  {/* With Description */}
                  <VStack gap={3}>
                    <Label>With description</Label>
                    <Checkbox
                      label="Email notifications"
                      description="Receive email notifications for important updates"
                      defaultChecked
                    />
                  </VStack>

                  {/* Checkbox Group */}
                  <VStack gap={3}>
                    <Label>Checkbox group</Label>
                    <div className="flex gap-8 items-start">
                      <CheckboxGroup label="Select options" direction="vertical">
                        <Checkbox label="Option 1" defaultChecked />
                        <Checkbox label="Option 2" />
                        <Checkbox label="Option 3" />
                      </CheckboxGroup>
                      <CheckboxGroup label="Horizontal layout" direction="horizontal">
                        <Checkbox label="A" defaultChecked />
                        <Checkbox label="B" />
                        <Checkbox label="C" />
                      </CheckboxGroup>
                    </div>
                  </VStack>

                  {/* Group with Error */}
                  <VStack gap={3}>
                    <Label>Group with Error</Label>
                    <CheckboxGroup
                      label="Required selection"
                      description="Please select at least one option"
                      error
                      errorMessage="At least one option must be selected"
                    >
                      <Checkbox label="Option A" />
                      <Checkbox label="Option B" />
                    </CheckboxGroup>
                  </VStack>
                </VStack>
              </Section>

              {/* Radio Component */}
              <Section
                id="radio"
                title="Radio"
                description="Single selection control for mutually exclusive options"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            옵션이 <strong>2~3개</strong>이고, 모든 옵션을 한눈에 볼 필요가 있을 때
                            사용합니다.
                          </li>
                          <li>옵션이 4개 이상이면 Select를 사용합니다.</li>
                          <li>반드시 하나의 옵션이 선택된 상태여야 합니다 (기본값 설정 권장).</li>
                          <li>
                            라벨은 간결하게 작성하고, 부가 설명이 필요하면 description을 활용합니다.
                          </li>
                          <li>수직 배치를 기본으로 사용합니다.</li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>size: 16×16px</code> · <code>dot: 6px</code> · <code>border: 2px</code>{' '}
                      · <code>gap: 6px</code>
                    </div>
                  </VStack>

                  {/* Layout */}
                  <VStack gap={3}>
                    <Label>Layout</Label>
                    <div className="flex gap-8 items-start">
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Icon Only
                        </span>
                        <Radio value="icon" checked onChange={() => {}} />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          With Label
                        </span>
                        <Radio label="Label" value="label" checked onChange={() => {}} />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Status */}
                  <VStack gap={3}>
                    <Label>Status</Label>
                    <div className="flex gap-8 items-start">
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Unselected
                        </span>
                        <Radio
                          label="Label"
                          value="unselected"
                          checked={false}
                          onChange={() => {}}
                        />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Selected
                        </span>
                        <Radio label="Label" value="selected" checked onChange={() => {}} />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled
                        </span>
                        <Radio label="Label" value="disabled" disabled />
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Disabled + Selected
                        </span>
                        <Radio
                          label="Label"
                          value="disabled-selected"
                          checked
                          disabled
                          onChange={() => {}}
                        />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Radio Group */}
                  <VStack gap={3}>
                    <Label>Radio group</Label>
                    <div className="flex gap-8 items-start">
                      <RadioGroup
                        label="Select one option"
                        defaultValue="option1"
                        direction="vertical"
                      >
                        <Radio label="Option 1" value="option1" />
                        <Radio label="Option 2" value="option2" />
                        <Radio label="Option 3" value="option3" />
                      </RadioGroup>
                      <RadioGroup label="Horizontal layout" defaultValue="a" direction="horizontal">
                        <Radio label="A" value="a" />
                        <Radio label="B" value="b" />
                        <Radio label="C" value="c" />
                      </RadioGroup>
                    </div>
                  </VStack>

                  {/* Group with Error */}
                  <VStack gap={3}>
                    <Label>Group with Error</Label>
                    <RadioGroup
                      label="Required selection"
                      description="Please select one option"
                      error
                      errorMessage="You must select an option"
                    >
                      <Radio label="Option A" value="a" />
                      <Radio label="Option B" value="b" />
                    </RadioGroup>
                  </VStack>
                </VStack>
              </Section>

              {/* TopBar Component */}
              <Section
                id="topbar"
                title="TopBar"
                description="Application header with sidebar toggle, navigation, breadcrumb, and actions"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          구성 요소 배치 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>좌측</strong>: 사이드바 토글 버튼(사이드바 닫힘 시), 뒤로/앞으로
                            네비게이션, Breadcrumb.
                          </li>
                          <li>
                            <strong>우측</strong>: 액션 버튼 (설정, 알림, 유틸리티 등).
                          </li>
                          <li>
                            Breadcrumb은 현재 위치를 계층적으로 표시하며, 각 항목은 클릭하여 이동
                            가능합니다.
                          </li>
                          <li>
                            사이드바가 열려 있으면 토글 버튼을 숨기고, 닫혀 있으면 표시합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>height: 36px</code> · <code>padding-x: 12px</code> ·{' '}
                      <code>button-size: 28px</code> · <code>radius: 4px</code>
                    </div>
                  </VStack>

                  {/* Basic */}
                  <VStack gap={3}>
                    <Label>Basic</Label>
                    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
                      <TopBar
                        onSidebarToggle={() => console.log('Toggle sidebar')}
                        onBack={() => console.log('Go back')}
                        onForward={() => console.log('Go forward')}
                        breadcrumb={
                          <Breadcrumb
                            items={[
                              { label: 'Home', onClick: () => {} },
                              { label: 'Entry page', onClick: () => {} },
                              { label: 'Settings' },
                            ]}
                          />
                        }
                        actions={<></>}
                      />
                    </div>
                  </VStack>

                  {/* With Badge */}
                  <VStack gap={3}>
                    <Label>With Notification Badge</Label>
                    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
                      <TopBar
                        onSidebarToggle={() => console.log('Toggle sidebar')}
                        canGoBack={true}
                        canGoForward={false}
                        breadcrumb={
                          <Breadcrumb
                            items={[
                              { label: 'Projects', onClick: () => {} },
                              { label: 'My project' },
                            ]}
                          />
                        }
                        actions={
                          <TopBarAction
                            icon={<IconBell size={16} stroke={1.5} />}
                            aria-label="Notifications"
                            badge
                          />
                        }
                      />
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* TabBar Component */}
              <Section
                id="tabbar"
                title="TabBar"
                description="Browser-style tabs with responsive width (max 160px, auto-shrink when overflow)"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            브라우저 스타일의 탭으로 여러 페이지/리소스를 동시에 열어 작업할 수
                            있습니다.
                          </li>
                          <li>
                            <strong>탭 너비</strong>: 최대 160px, 탭 수 증가 시 자동으로 축소됩니다.
                          </li>
                          <li>
                            <strong>탭 추가</strong>: + 버튼으로 새 탭 추가. 기본 탭(Home 등)은 닫을
                            수 없습니다 (<code>closable: false</code>).
                          </li>
                          <li>
                            <strong>탭 정렬</strong>: 드래그 앤 드롭으로 탭 순서를 변경할 수
                            있습니다.
                          </li>
                          <li>
                            <strong>탭 이름</strong>: 페이지 타이틀 또는 리소스 이름을 표시합니다.
                            긴 이름은 말줄임 처리.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Demo */}
                  <TabBarDemo />
                </VStack>
              </Section>

              {/* Tabs Component */}
              <Section
                id="tabs"
                title="Tabs"
                description="Tabs for navigation between views with underline and boxed variants"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Variant 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    Variant
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    사용 조건
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    underline
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    상세 페이지 내 콘텐츠 전환 (기본값). Detail Page의 섹션 구분에
                                    사용.
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    boxed
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    폼 내부 또는 카드 내 옵션 전환 시 사용. 시각적으로 더 독립적인
                                    영역 구분.
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            사용 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              탭 수는 <strong>2~7개</strong>를 권장합니다. 7개 초과 시 스크롤 또는
                              구조 재설계를 검토합니다.
                            </li>
                            <li>
                              탭 전환 시 입력값은 유지됩니다 (Create/Edit 폼에서 탭 간 이동 시).
                            </li>
                            <li>
                              탭 라벨은 간결한 명사형으로 작성합니다 (Details, Volumes, Networking).
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>gap: 8px</code> · <code>min-width: 80px</code> ·{' '}
                      <code>padding-x: 12px</code> · <code>indicator: 2px</code> ·{' '}
                      <code>boxed-padding: 24×8px</code>
                    </div>
                  </VStack>

                  {/* Variants */}
                  <VStack gap={3}>
                    <Label>Variants</Label>
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Underline (default)
                        </span>
                        <Tabs defaultValue="tab1" size="sm">
                          <TabList>
                            <Tab value="tab1">menu 1</Tab>
                            <Tab value="tab2">menu 2</Tab>
                            <Tab value="tab3">menu 3</Tab>
                          </TabList>
                        </Tabs>
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Capsule tab
                        </span>
                        <CapsuleTabDemo />
                      </VStack>
                    </VStack>
                  </VStack>

                  {/* Sizes */}
                  <VStack gap={3}>
                    <Label>Sizes</Label>
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Small (12px)
                        </span>
                        <Tabs defaultValue="tab1" size="sm">
                          <TabList>
                            <Tab value="tab1">menu 1</Tab>
                            <Tab value="tab2">menu 2</Tab>
                            <Tab value="tab3">menu 3</Tab>
                          </TabList>
                        </Tabs>
                      </VStack>
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Medium (14px)
                        </span>
                        <Tabs defaultValue="tab1" size="md">
                          <TabList>
                            <Tab value="tab1">menu 1</Tab>
                            <Tab value="tab2">menu 2</Tab>
                            <Tab value="tab3">menu 3</Tab>
                          </TabList>
                        </Tabs>
                      </VStack>
                    </VStack>
                  </VStack>

                  {/* Interactive Example */}
                  <VStack gap={3}>
                    <Label>Interactive example</Label>
                    <Tabs defaultValue="overview" size="sm">
                      <TabList>
                        <Tab value="overview">Overview</Tab>
                        <Tab value="settings">Settings</Tab>
                        <Tab value="logs">Logs</Tab>
                        <Tab value="disabled" disabled>
                          Disabled
                        </Tab>
                      </TabList>
                      <TabPanel value="overview">
                        <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                            Overview panel content goes here.
                          </p>
                        </div>
                      </TabPanel>
                      <TabPanel value="settings">
                        <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                            Settings panel content goes here.
                          </p>
                        </div>
                      </TabPanel>
                      <TabPanel value="logs">
                        <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                            Logs panel content goes here.
                          </p>
                        </div>
                      </TabPanel>
                    </Tabs>
                  </VStack>
                </VStack>
              </Section>

              {/* Disclosure Component */}
              <Section
                id="disclosure"
                title="Disclosure"
                description="Expandable/collapsible content sections"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>Create/Edit 페이지에서 설정 카드의 접힘/펼침에 사용합니다.</li>
                          <li>
                            <strong>기본 상태</strong>: 필수 입력이 있는 섹션은 기본 펼침, 선택
                            사항만 있는 섹션은 기본 접힘. 필수+선택 혼합 시 기본 펼침.
                          </li>
                          <li>
                            접힌 상태에서도 섹션의 입력 상태(완료/미완료/오류)를 시각적으로
                            표시합니다.
                          </li>
                          <li>
                            <strong>중첩</strong>: Disclosure 내부에 또 다른 Disclosure를 중첩하지
                            않습니다 (1단계만).
                          </li>
                          <li>접힘/펼침 전환 시 부드러운 애니메이션(200~300ms)을 적용합니다.</li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>gap: 6px</code> · <code>icon: 12px</code> ·{' '}
                      <code>font: 14px / 20px / medium</code>
                    </div>
                  </VStack>

                  {/* States */}
                  <VStack gap={3}>
                    <Label>States</Label>
                    <div className="flex items-center gap-12">
                      <Disclosure>
                        <Disclosure.Trigger>Collapsed</Disclosure.Trigger>
                      </Disclosure>
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Expanded</Disclosure.Trigger>
                      </Disclosure>
                    </div>
                  </VStack>

                  {/* With Content */}
                  <VStack gap={3}>
                    <Label>With content</Label>
                    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Volume details</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                            <p>Name: vol-12345</p>
                            <p>Size: 100 GiB</p>
                            <p>Status: Available</p>
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                    </div>
                  </VStack>

                  {/* Multiple */}
                  <VStack gap={3}>
                    <Label>Multiple disclosures</Label>
                    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] divide-y divide-[var(--color-border-default)]">
                      <div className="p-4">
                        <Disclosure>
                          <Disclosure.Trigger>Section 1</Disclosure.Trigger>
                          <Disclosure.Panel>
                            <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                              Content for section 1
                            </div>
                          </Disclosure.Panel>
                        </Disclosure>
                      </div>
                      <div className="p-4">
                        <Disclosure>
                          <Disclosure.Trigger>Section 2</Disclosure.Trigger>
                          <Disclosure.Panel>
                            <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                              Content for section 2
                            </div>
                          </Disclosure.Panel>
                        </Disclosure>
                      </div>
                      <div className="p-4">
                        <Disclosure defaultOpen>
                          <Disclosure.Trigger>Section 3 (Default Open)</Disclosure.Trigger>
                          <Disclosure.Panel>
                            <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                              Content for section 3
                            </div>
                          </Disclosure.Panel>
                        </Disclosure>
                      </div>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* InlineMessage Component */}
              <Section
                id="inline-message"
                title="Inline message"
                description="Contextual feedback messages for different states"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            InlineMessage vs Toast 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    권장 컴포넌트
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    특정 영역에 지속적으로 표시해야 하는 안내/경고
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    InlineMessage
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    사용자 액션에 대한 일시적 피드백
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Toast
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Variant 사용 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>info</strong>: 일반 안내 사항, 추가 정보 제공 (파란색)
                            </li>
                            <li>
                              <strong>success</strong>: 성공 확인 메시지, 완료 알림 (초록색)
                            </li>
                            <li>
                              <strong>warning</strong>: 주의 사항, 잠재적 문제 경고 (주황색)
                            </li>
                            <li>
                              <strong>error</strong>: 오류 발생, 실패 알림, 필수 조건 미충족
                              (빨간색)
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            배치 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>관련 콘텐츠 바로 위 또는 아래에 배치합니다.</li>
                            <li>폼 상단에 전체 폼에 대한 안내/에러를 표시합니다.</li>
                            <li>SectionCard 내에서 해당 섹션에 대한 경고를 표시합니다.</li>
                            <li>
                              <strong>다중 메시지</strong>: 같은 위치에 여러 InlineMessage가 필요한
                              경우 VStack으로 8px 간격으로 스태킹합니다. 동일 variant가 중복되면
                              하나로 합칩니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>padding: 12px</code> · <code>gap: 8px</code> · <code>radius: 6px</code>{' '}
                      · <code>icon: 16px</code> · <code>font: 12px</code>
                    </div>
                  </VStack>

                  {/* Variants */}
                  <VStack gap={3}>
                    <Label>Variants</Label>
                    <VStack gap={3}>
                      <InlineMessage variant="success">
                        Used for completed or normal operations.
                      </InlineMessage>
                      <InlineMessage variant="warning">
                        Used when attention is needed but not critical.
                      </InlineMessage>
                      <InlineMessage variant="error">
                        Used for failed actions or system issues.
                      </InlineMessage>
                      <InlineMessage variant="info">
                        Used for general or non-critical updates.
                      </InlineMessage>
                    </VStack>
                  </VStack>

                  {/* Without Icon */}
                  <VStack gap={3}>
                    <Label>Without icon</Label>
                    <InlineMessage variant="info" hideIcon>
                      This message has no icon.
                    </InlineMessage>
                  </VStack>

                  {/* Long Content */}
                  <VStack gap={3}>
                    <Label>Long content</Label>
                    <InlineMessage variant="warning">
                      This is a longer message that demonstrates how the component handles
                      multi-line content. The text will wrap naturally and the icon stays aligned to
                      the top.
                    </InlineMessage>
                  </VStack>
                </VStack>
              </Section>

              {/* Table Component */}
              <Section
                id="table"
                title="Table"
                description="Data table with sorting, selection, sticky header, text truncation with tooltip, and horizontal scroll"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            컬럼 정렬 규칙
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    컬럼 유형
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    정렬
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    예시
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    텍스트/이름
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    왼쪽 (기본)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Name, Description
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    숫자/크기
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    오른쪽
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Size, Count, vCPU
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    날짜/시간
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    오른쪽
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Created at, Updated at
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    상태(Status)
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    중앙
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    StatusIndicator
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    액션/체크박스
                                  </td>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    중앙
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Actions, Select
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            기능 정책
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>정렬(Sorting)</strong>: 클릭 시 오름차순 → 내림차순 → 정렬
                              해제 순서로 토글. 헤더에 정렬 아이콘 표시.
                            </li>
                            <li>
                              <strong>선택(Selection)</strong>: 체크박스로 행 선택. 헤더 체크박스로
                              전체 선택/해제. 선택 시 SelectionIndicator 및 Bulk 액션 활성화.
                            </li>
                            <li>
                              <strong>Sticky Header</strong>: 스크롤 시 헤더 고정. 데이터가 많을 때
                              컬럼 의미를 유지.
                            </li>
                            <li>
                              <strong>텍스트 말줄임</strong>: 긴 텍스트는 말줄임(truncate) 처리하고,
                              hover 시 Tooltip으로 전체 텍스트 표시.
                            </li>
                            <li>
                              <strong>빈 상태</strong>: 데이터가 없을 때 EmptyState 컴포넌트를
                              테이블 영역에 표시.
                            </li>
                            <li>
                              <strong>로딩</strong>: 데이터 로딩 중에는 Skeleton 행을 표시.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Pagination 연동
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>Table 바로 위에 Pagination 컴포넌트를 배치합니다.</li>
                            <li>페이지 변경 시 선택 상태는 초기화됩니다.</li>
                            <li>총 항목 수와 선택 항목 수를 Pagination에 표시합니다.</li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 가이드라인 */}
                  <VStack gap={3}>
                    <Label>가이드라인</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">
                          Do
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>
                            Name 컬럼은 항상 첫 번째에 배치하고 링크로 상세 페이지 이동을
                            제공합니다.
                          </li>
                          <li>기본 정렬 기준을 설정합니다 (보통 생성일 내림차순).</li>
                          <li>Actions 컬럼은 항상 마지막에 배치합니다.</li>
                          <li>
                            연관 리소스는 클릭하여 해당 리소스로 이동할 수 있도록 링크를 제공합니다.
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                          Don&apos;t
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>Status 컬럼에 텍스트만 표시하지 않습니다 (StatusIndicator 사용).</li>
                          <li>연관 리소스 컬럼을 중앙 정렬하지 않습니다 (왼쪽 정렬 유지).</li>
                          <li>빈 상태에서 빈 테이블 구조만 보여주지 않습니다 (EmptyState 표시).</li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* Demo */}
                  <TableDemo />
                </VStack>
              </Section>

              {/* Badge Component */}
              <Section
                id="badge"
                title="Badge"
                description="Status indicators and labels with various styles"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Badge vs Chip vs StatusIndicator 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    컴포넌트
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    사용 조건
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Badge
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    상태 라벨, 카운트 표시, 카테고리 분류 (비인터랙티브)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    Chip
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    사용자가 추가/제거 가능한 태그, 필터 값 (인터랙티브)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    StatusIndicator
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    리소스의 실시간 상태 (active, error, building 등)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Variant 매핑 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>info</strong> (파란색): 정보성, 중립적 레이블 (e.g.
                              &quot;New&quot;, &quot;v2.1&quot;, 개수 표시)
                            </li>
                            <li>
                              <strong>success</strong> (초록색): 긍정적 레이블 (e.g.
                              &quot;Completed&quot;, &quot;Approved&quot;)
                            </li>
                            <li>
                              <strong>warning</strong> (주황색): 주의 레이블 (e.g. &quot;Expiring
                              soon&quot;, &quot;Beta&quot;)
                            </li>
                            <li>
                              <strong>danger</strong> (빨간색): 오류/위험 레이블 (e.g.
                              &quot;Failed&quot;, &quot;Expired&quot;, &quot;Deprecated&quot;)
                            </li>
                          </ul>
                          <p className="text-body-sm text-[var(--color-text-subtle)] mt-2">
                            <strong>Badge vs StatusIndicator 구분</strong>: Badge는 정적
                            레이블·카운트 표시용(e.g. 버전, 개수, 카테고리)이고, StatusIndicator는
                            실시간 운영 상태 표시용(e.g. Running, Error, Building)입니다.
                            &quot;Active&quot;, &quot;Healthy&quot; 등 실시간 상태는
                            StatusIndicator를 사용하세요.
                          </p>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-11)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Size
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Padding
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Font Size
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              Line Height
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              sm
                            </td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              6×2px
                            </td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              11px
                            </td>
                            <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              md
                            </td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              8×4px
                            </td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              12px
                            </td>
                            <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              lg
                            </td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              12×4px
                            </td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                              14px
                            </td>
                            <td className="py-2 font-mono text-[var(--color-text-muted)]">20px</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
                      <code>radius: 4px</code> · <code>gap: 4px</code> · <code>dot-size: 6px</code>
                    </div>
                  </VStack>

                  {/* Sizes */}
                  <VStack gap={3}>
                    <Label>Sizes</Label>
                    <div className="flex gap-3 items-center">
                      <Badge size="sm">Small</Badge>
                      <Badge size="md">Medium</Badge>
                    </div>
                  </VStack>

                  {/* Types */}
                  <VStack gap={3}>
                    <Label>Types</Label>
                    <div className="flex gap-6">
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Subtle
                        </span>
                        <div className="flex gap-2">
                          <Badge size="sm" type="subtle" theme="blue">
                            Blue
                          </Badge>
                          <Badge size="sm" type="subtle" theme="green">
                            Green
                          </Badge>
                          <Badge size="sm" type="subtle" theme="red">
                            Red
                          </Badge>
                          <Badge size="sm" type="subtle" theme="yellow">
                            Yellow
                          </Badge>
                          <Badge size="sm" type="subtle" theme="gray">
                            Gray
                          </Badge>
                          <Badge size="sm" type="subtle" theme="white">
                            White
                          </Badge>
                        </div>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Layout (with icons) */}
                  <VStack gap={3}>
                    <Label>Layout (with Icons)</Label>
                    <div className="flex gap-3 items-center">
                      <Badge size="sm" theme="blue">
                        Text only
                      </Badge>
                      <Badge size="sm" theme="blue" leftIcon={<IconCheck size={10} />}>
                        Left icon
                      </Badge>
                      <Badge size="sm" theme="blue" rightIcon={<IconArrowRight size={10} />}>
                        Right icon
                      </Badge>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Breadcrumb Component */}
              <Section
                id="breadcrumb"
                title="Breadcrumb"
                description="Navigation path indicator with clickable links"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>TopBar 내에 배치하여 현재 페이지의 계층 경로를 표시합니다.</li>
                          <li>
                            마지막 항목(현재 페이지)은 <strong>비활성 텍스트</strong>로 표시하고,
                            이전 항목은 클릭 가능한 링크로 제공합니다.
                          </li>
                          <li>
                            첫 번째 항목은 앱/클러스터 이름으로, 클릭 시 해당 앱의 홈 페이지로
                            이동합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>gap: 4px</code> · <code>font-size: 11px</code> ·{' '}
                      <code>line-height: 16px</code> · <code>font-weight: medium</code>
                    </div>
                  </VStack>

                  {/* Basic Usage */}
                  <VStack gap={3}>
                    <Label>Basic usage</Label>
                    <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                      <Breadcrumb
                        items={[
                          { label: 'Home', onClick: () => {} },
                          { label: 'Compute', onClick: () => {} },
                          { label: 'Instances', onClick: () => {} },
                          { label: 'web-large' },
                        ]}
                      />
                    </div>
                  </VStack>

                  {/* Long Path */}
                  <VStack gap={3}>
                    <Label>Long path</Label>
                    <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                      <Breadcrumb
                        items={[
                          { label: 'Home', onClick: () => {} },
                          { label: 'Instance snapshots', onClick: () => {} },
                          { label: 'Instance snapshots', onClick: () => {} },
                          { label: 'Instance snapshots', onClick: () => {} },
                          { label: 'web-large' },
                        ]}
                      />
                    </div>
                  </VStack>

                  {/* States */}
                  <VStack gap={3}>
                    <Label>States</Label>
                    <div className="grid grid-cols-3 gap-4 text-[length:var(--font-size-10)]">
                      <div className="flex flex-col gap-2 items-center">
                        <span className="text-[var(--color-text-subtle)]">Default</span>
                        <span className="text-[var(--breadcrumb-text-color)] font-medium">
                          Home
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <span className="text-[var(--color-text-subtle)]">Hover</span>
                        <span className="text-[var(--breadcrumb-text-hover)] font-medium">
                          Home
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <span className="text-[var(--color-text-subtle)]">Current</span>
                        <span className="text-[var(--breadcrumb-text-current)] font-medium">
                          web-large
                        </span>
                      </div>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Status indicator Component */}
              <Section
                id="status-indicator"
                title="Status indicator"
                description="Server/instance status indicators with predefined states"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            상태 매핑 규칙
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    Status
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    색상
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    사용 조건
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    active
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-state-success)]">
                                    초록
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    정상 동작 중 (Running, Active, Healthy, Connected)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    error
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-state-danger)]">
                                    빨강
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    오류/실패 (Error, Failed, Crashed, Disconnected)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    building
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-state-info)]">파랑</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    진행 중 (Building, Creating, Deploying, Migrating)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    muted
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-subtle)]">
                                    회색
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    비활성/대기 (Stopped, Paused, Shutoff, Unknown)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="text-body-sm text-[var(--color-text-subtle)]">
                            위 4개는 <strong>기본 카테고리</strong>입니다. 실제 구현에서는 19개의
                            세분화된 status 값 (<code>deleting</code>, <code>suspended</code>,{' '}
                            <code>shelved</code>, <code>pending</code>, <code>maintenance</code>,{' '}
                            <code>degraded</code> 등)을 지원하며, 각 값은 위 4개 카테고리의 색상 중
                            하나로 매핑됩니다.
                          </p>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            사용 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              테이블의 Status 컬럼에서 사용하며, 컬럼은 <strong>중앙 정렬</strong>
                              합니다.
                            </li>
                            <li>DetailHeader의 InfoCard에서 리소스 상태를 표시합니다.</li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>padding: 6×4px</code> · <code>gap: 4px</code> ·{' '}
                      <code>radius: pill (16px)</code> · <code>font-size: 11px</code> ·{' '}
                      <code>icon: 14px</code>
                    </div>
                  </VStack>

                  {/* All status Types by Category */}
                  <VStack gap={3}>
                    <Label>Active</Label>
                    <div className="flex flex-wrap gap-3 items-center">
                      <Tooltip content="active">
                        <StatusIndicator layout="icon-only" status="active" />
                      </Tooltip>
                    </div>
                  </VStack>

                  <VStack gap={3}>
                    <Label>Error</Label>
                    <div className="flex flex-wrap gap-3 items-center">
                      <Tooltip content="error">
                        <StatusIndicator layout="icon-only" status="error" />
                      </Tooltip>
                    </div>
                  </VStack>

                  <VStack gap={3}>
                    <Label>Action (Blue)</Label>
                    <div className="flex flex-wrap gap-3 items-center">
                      <Tooltip content="building">
                        <StatusIndicator layout="icon-only" status="building" />
                      </Tooltip>
                      <Tooltip content="deleting">
                        <StatusIndicator layout="icon-only" status="deleting" />
                      </Tooltip>
                      <Tooltip content="pending">
                        <StatusIndicator layout="icon-only" status="pending" />
                      </Tooltip>
                    </div>
                  </VStack>

                  <VStack gap={3}>
                    <Label>Warning (Orange)</Label>
                    <div className="flex flex-wrap gap-3 items-center">
                      <Tooltip content="verify-resized">
                        <StatusIndicator layout="icon-only" status="verify-resized" />
                      </Tooltip>
                      <Tooltip content="degraded">
                        <StatusIndicator layout="icon-only" status="degraded" />
                      </Tooltip>
                      <Tooltip content="no-monitor">
                        <StatusIndicator layout="icon-only" status="no-monitor" />
                      </Tooltip>
                      <Tooltip content="down">
                        <StatusIndicator layout="icon-only" status="down" />
                      </Tooltip>
                      <Tooltip content="maintenance">
                        <StatusIndicator layout="icon-only" status="maintenance" />
                      </Tooltip>
                    </div>
                  </VStack>

                  <VStack gap={3}>
                    <Label>Muted (Gray)</Label>
                    <div className="flex flex-wrap gap-3 items-center">
                      <Tooltip content="suspended">
                        <StatusIndicator layout="icon-only" status="suspended" />
                      </Tooltip>
                      <Tooltip content="shelved-offloaded">
                        <StatusIndicator layout="icon-only" status="shelved-offloaded" />
                      </Tooltip>
                      <Tooltip content="mounted">
                        <StatusIndicator layout="icon-only" status="mounted" />
                      </Tooltip>
                      <Tooltip content="shutoff">
                        <StatusIndicator layout="icon-only" status="shutoff" />
                      </Tooltip>
                      <Tooltip content="paused">
                        <StatusIndicator layout="icon-only" status="paused" />
                      </Tooltip>
                      <Tooltip content="draft">
                        <StatusIndicator layout="icon-only" status="draft" />
                      </Tooltip>
                      <Tooltip content="deactivated">
                        <StatusIndicator layout="icon-only" status="deactivated" />
                      </Tooltip>
                      <Tooltip content="in-use">
                        <StatusIndicator layout="icon-only" status="in-use" />
                      </Tooltip>
                    </div>
                  </VStack>

                  {/* Layout Variants - Icon Only (All Cases) */}
                  <VStack gap={3}>
                    <Label>Icon Only - All status Types</Label>
                    <VStack gap={4}>
                      {/* Active */}
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Active
                        </span>
                        <div className="flex flex-wrap gap-4 items-start">
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="active" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              active
                            </span>
                          </VStack>
                        </div>
                      </VStack>
                      {/* Error */}
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Error
                        </span>
                        <div className="flex flex-wrap gap-4 items-start">
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="error" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              error
                            </span>
                          </VStack>
                        </div>
                      </VStack>
                      {/* Action */}
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Action
                        </span>
                        <div className="flex flex-wrap gap-4 items-start">
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="building" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              building
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="deleting" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              deleting
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="pending" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              pending
                            </span>
                          </VStack>
                        </div>
                      </VStack>
                      {/* Warning */}
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Warning
                        </span>
                        <div className="flex flex-wrap gap-4 items-start">
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="verify-resized" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              verify-resized
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="degraded" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              degraded
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="no-monitor" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              no-monitor
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="down" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              down
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="maintenance" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              maintenance
                            </span>
                          </VStack>
                        </div>
                      </VStack>
                      {/* Muted */}
                      <VStack gap={2}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Muted
                        </span>
                        <div className="flex flex-wrap gap-4 items-start">
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="suspended" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              suspended
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="shelved-offloaded" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              shelved
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="mounted" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              mounted
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="shutoff" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              shutoff
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="paused" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              paused
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="draft" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              draft
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="deactivated" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              deactivated
                            </span>
                          </VStack>
                          <VStack gap={1} align="center">
                            <StatusIndicator layout="icon-only" status="in-use" />
                            <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                              in-use
                            </span>
                          </VStack>
                        </div>
                      </VStack>
                    </VStack>
                  </VStack>

                  {/* Custom Labels */}
                  <VStack gap={3}>
                    <Label>Custom labels</Label>
                    <div className="flex gap-3 items-center">
                      <StatusIndicator layout="icon-only" status="active" label="Running" />
                      <StatusIndicator layout="icon-only" status="error" label="Failed" />
                      <StatusIndicator layout="icon-only" status="building" label="Deploying..." />
                    </div>
                  </VStack>

                  {/* Color Reference - Semantic Status Tokens */}
                  <VStack gap={3}>
                    <Label>Semantic Color Tokens</Label>
                    <div className="grid grid-cols-5 gap-2 text-[length:var(--font-size-10)]">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-[var(--status-success-bg)]" />
                        <span className="text-[var(--color-text-subtle)]">--status-success-bg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-[var(--status-danger-bg)]" />
                        <span className="text-[var(--color-text-subtle)]">--status-danger-bg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-[var(--status-info-bg)]" />
                        <span className="text-[var(--color-text-subtle)]">--status-info-bg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-[var(--status-warning-bg)]" />
                        <span className="text-[var(--color-text-subtle)]">--status-warning-bg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-[var(--status-muted-bg)]" />
                        <span className="text-[var(--color-text-subtle)]">--status-muted-bg</span>
                      </div>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Tooltip Component */}
              <Section id="tooltip" title="Tooltip" description="Contextual information on hover">
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Tooltip vs Popover 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    기준
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    Tooltip
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    Popover
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    콘텐츠
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    텍스트만 (1~2줄)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    인터랙티브 (폼, 버튼, 메뉴)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    트리거
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    Hover 전용
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    Click 또는 Hover
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    인터랙션
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    비인터랙티브 (읽기 전용)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    인터랙티브 (클릭, 입력 가능)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-default)]">
                                    접근성
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    <code>role=&quot;tooltip&quot;</code>
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    <code>aria-haspopup=&quot;dialog&quot;</code>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            사용 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>아이콘 전용 버튼에는 반드시 Tooltip으로 기능 설명을 제공합니다.</li>
                            <li>
                              텍스트가 말줄임(truncate)된 경우 hover 시 전체 텍스트를 Tooltip으로
                              표시합니다.
                            </li>
                            <li>Tooltip 텍스트는 최대 2줄로 제한하며, maxWidth는 240px입니다.</li>
                            <li>이미 충분히 설명적인 요소에는 Tooltip을 추가하지 않습니다.</li>
                            <li>
                              delay를 적절히 설정하여 불필요한 Tooltip 표시를 방지합니다 (기본
                              200ms).
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>padding: 6×4px</code> · <code>radius: 4px</code> ·{' '}
                      <code>font-size: 11px</code> · <code>min-width: 60px</code> ·{' '}
                      <code>max-width: 240px</code> · <code>arrow: 4px</code>
                    </div>
                  </VStack>

                  {/* Positions */}
                  <VStack gap={3}>
                    <Label>Positions</Label>
                    <div className="flex gap-6 items-center justify-center py-8">
                      <Tooltip content="Top tooltip" position="top">
                        <Button variant="secondary" size="sm">
                          Top
                        </Button>
                      </Tooltip>
                      <Tooltip content="Bottom tooltip" position="bottom">
                        <Button variant="secondary" size="sm">
                          Bottom
                        </Button>
                      </Tooltip>
                      <Tooltip content="Left tooltip" position="left">
                        <Button variant="secondary" size="sm">
                          Left
                        </Button>
                      </Tooltip>
                      <Tooltip content="Right tooltip" position="right">
                        <Button variant="secondary" size="sm">
                          Right
                        </Button>
                      </Tooltip>
                    </div>
                  </VStack>

                  {/* Examples */}
                  <VStack gap={3}>
                    <Label>Use cases</Label>
                    <div className="flex gap-4 items-center">
                      <Tooltip content="Delete this item permanently">
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<IconTrash size={12} />}
                          aria-label="Delete"
                        />
                      </Tooltip>
                      <Tooltip content="Add to favorites">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<IconStar size={12} />}
                          aria-label="Favorite"
                        />
                      </Tooltip>
                      <Tooltip content="Copy to clipboard">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<IconCopy size={12} />}
                          aria-label="Copy"
                        />
                      </Tooltip>
                      <Tooltip content="This action requires admin permissions" position="bottom">
                        <Badge variant="warning" size="sm">
                          Restricted
                        </Badge>
                      </Tooltip>
                    </div>
                  </VStack>

                  {/* With Delay */}
                  <VStack gap={3}>
                    <Label>Custom delay</Label>
                    <div className="flex gap-4 items-center">
                      <Tooltip content="Instant (0ms)" delay={0}>
                        <Button variant="outline" size="sm">
                          0ms
                        </Button>
                      </Tooltip>
                      <Tooltip content="Default (200ms)" delay={200}>
                        <Button variant="outline" size="sm">
                          200ms
                        </Button>
                      </Tooltip>
                      <Tooltip content="Slow (500ms)" delay={500}>
                        <Button variant="outline" size="sm">
                          500ms
                        </Button>
                      </Tooltip>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Popover Component */}
              <Section
                id="popover"
                title="Popover"
                description="Interactive overlay that can contain complex content"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Popover vs Tooltip vs Drawer 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    권장 컴포넌트
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    텍스트 설명만 필요, 비인터랙티브
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Tooltip
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    간단한 인터랙티브 콘텐츠 (폼 1~2개, 버튼)
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Popover
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    복잡한 폼 또는 상세 콘텐츠
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Drawer
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    확인/결정이 필요한 액션
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Modal
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            사용 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>트리거</strong>: Click(기본) 또는 Hover. 인터랙티브 콘텐츠는
                              반드시 Click 트리거를 사용합니다.
                            </li>
                            <li>
                              <strong>닫기</strong>: 외부 클릭 또는 ESC 키로 닫힘.{' '}
                              <code>closeOnOutsideClick</code>, <code>closeOnEscape</code> 기본
                              true.
                            </li>
                            <li>
                              <strong>위치</strong>: 트리거 요소 기준으로 자동 배치. 뷰포트 밖으로
                              나가면 반대 방향으로 flip.
                            </li>
                            <li>
                              <strong>너비</strong>: 권장 너비 280px. 최대 viewport 너비의 50%
                              이내로 제한합니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 가이드라인 */}
                  <VStack gap={3}>
                    <Label>가이드라인</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">
                          Do
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>Popover 내 콘텐츠는 간결하게 유지합니다 (필드 3개 이하).</li>
                          <li>
                            인터랙티브 콘텐츠에는 <code>aria-haspopup=&quot;dialog&quot;</code>를
                            설정합니다.
                          </li>
                          <li>
                            Hover 트리거 시 적절한 delay(200ms)를 설정하여 오작동을 방지합니다.
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                          Don&apos;t
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>Popover 안에 또 다른 Popover를 중첩하지 않습니다.</li>
                          <li>복잡한 폼(필드 4개 이상)을 Popover에 넣지 않습니다 (Drawer 사용).</li>
                          <li>
                            Hover 트리거로 인터랙티브 콘텐츠를 제공하지 않습니다 (Click 사용).
                          </li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>padding: 12px</code> · <code>radius: 8px</code> ·{' '}
                      <code>border: 1px</code> · <code>arrow: 6px</code>
                    </div>
                  </VStack>

                  {/* Basic Usage */}
                  <VStack gap={3}>
                    <Label>Click trigger (default)</Label>
                    <div className="flex gap-4 items-center flex-wrap">
                      <Popover
                        content={
                          <div className="p-3">
                            <p className="text-body-md">Click outside or press Escape to close</p>
                          </div>
                        }
                        trigger="click"
                      >
                        <Button variant="outline" size="sm">
                          Click me
                        </Button>
                      </Popover>
                    </div>
                  </VStack>

                  {/* Hover Trigger */}
                  <VStack gap={3}>
                    <Label>Hover trigger</Label>
                    <div className="flex gap-4 items-center flex-wrap">
                      <Popover
                        content={
                          <div className="p-3">
                            <p className="text-body-md">
                              Hover로 표시되는 비인터랙티브 정보 콘텐츠입니다.
                            </p>
                          </div>
                        }
                        trigger="hover"
                      >
                        <Button variant="outline" size="sm">
                          Hover me
                        </Button>
                      </Popover>
                    </div>
                  </VStack>

                  {/* Positions */}
                  <VStack gap={3}>
                    <Label>Positions</Label>
                    <div className="flex gap-4 items-center flex-wrap">
                      <Popover
                        content={<div className="p-3 text-body-md">Top popover</div>}
                        position="top"
                        trigger="click"
                      >
                        <Button variant="outline" size="sm">
                          Top
                        </Button>
                      </Popover>
                      <Popover
                        content={<div className="p-3 text-body-md">Bottom popover</div>}
                        position="bottom"
                        trigger="click"
                      >
                        <Button variant="outline" size="sm">
                          Bottom
                        </Button>
                      </Popover>
                      <Popover
                        content={<div className="p-3 text-body-md">Left popover</div>}
                        position="left"
                        trigger="click"
                      >
                        <Button variant="outline" size="sm">
                          Left
                        </Button>
                      </Popover>
                      <Popover
                        content={<div className="p-3 text-body-md">Right popover</div>}
                        position="right"
                        trigger="click"
                      >
                        <Button variant="outline" size="sm">
                          Right
                        </Button>
                      </Popover>
                    </div>
                  </VStack>

                  {/* Interactive Content */}
                  <VStack gap={3}>
                    <Label>Interactive content</Label>
                    <div className="flex gap-4 items-center flex-wrap">
                      <Popover
                        content={
                          <div className="p-3 w-[200px]">
                            <VStack gap={3}>
                              <p className="text-label-md">Quick actions</p>
                              <Button variant="secondary" size="sm" fullWidth>
                                Edit
                              </Button>
                              <Button variant="secondary" size="sm" fullWidth>
                                Duplicate
                              </Button>
                              <Button variant="danger" size="sm" fullWidth>
                                Delete
                              </Button>
                            </VStack>
                          </div>
                        }
                        trigger="click"
                      >
                        <Button variant="outline" size="sm">
                          Menu popover
                        </Button>
                      </Popover>
                    </div>
                  </VStack>

                  {/* Without Arrow */}
                  <VStack gap={3}>
                    <Label>Without arrow</Label>
                    <div className="flex gap-4 items-center flex-wrap">
                      <Popover
                        content={<div className="p-3 text-body-md">No arrow variant</div>}
                        trigger="click"
                        showArrow={false}
                      >
                        <Button variant="outline" size="sm">
                          No arrow
                        </Button>
                      </Popover>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* WindowControl Component */}
              <Section
                id="window-control"
                title="Window control"
                description="Window control buttons for minimize, maximize, and close actions"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>데스크톱 앱(Electron 등) 환경에서 윈도우 제어 버튼을 제공합니다.</li>
                          <li>최소화/최대화/닫기 아이콘 버튼을 우측에 배치합니다.</li>
                          <li>모든 OS에서 동일한 스타일이 적용됩니다.</li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>size: 24×24px</code> · <code>icon: 12px</code> ·{' '}
                      <code>radius: 4px</code> · <code>gap: 4px</code>
                    </div>
                  </VStack>

                  {/* Individual Controls */}
                  <VStack gap={3}>
                    <Label>Individual controls</Label>
                    <div className="flex gap-6 items-center">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Minimize
                        </span>
                        <WindowControl type="minimize" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Maximize
                        </span>
                        <WindowControl type="maximize" />
                      </VStack>
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Close
                        </span>
                        <WindowControl type="close" />
                      </VStack>
                    </div>
                  </VStack>

                  {/* Controls Group */}
                  <VStack gap={3}>
                    <Label>Controls group</Label>
                    <div className="flex gap-6 items-center">
                      <VStack gap={1}>
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          All Controls
                        </span>
                        <WindowControls />
                      </VStack>
                    </div>
                  </VStack>

                  {/* In Context */}
                  <VStack gap={3}>
                    <Label>In Context (Header Bar)</Label>
                    <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                      <span className="text-[length:var(--font-size-12)] font-medium">
                        Application Title
                      </span>
                      <WindowControls />
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Scrollbar */}
              <Section
                id="scrollbar"
                title="Scrollbar"
                description="Custom scrollbar styles for various containers"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>커스텀 스크롤바는 CSS 유틸리티 클래스로 적용합니다.</li>
                          <li>
                            <strong>기본 동작</strong>: hover 시 스크롤바가 나타나고, 비활성 시
                            숨겨집니다.
                          </li>
                          <li>
                            <strong>너비</strong>: 기본 6px (<code>drawer-scroll</code>). 모달에서는
                            4px (<code>modal-scroll</code>).
                          </li>
                          <li>
                            가로 스크롤이 필요한 테이블에서도 동일한 스크롤바 스타일을 적용합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>width: 6px</code> · <code>radius: full</code> ·{' '}
                      <code>track: transparent</code> · <code>thumb: border-default</code>
                    </div>
                  </VStack>

                  {/* Available Classes */}
                  <VStack gap={3}>
                    <Label>Available classes</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                          sidebar-scroll
                        </div>
                        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                          Main sidebar navigation. Width: 6px, stable gutter.
                        </div>
                      </div>
                      <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                          drawer-scroll
                        </div>
                        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                          Drawer/Panel content. Width: 6px.
                        </div>
                      </div>
                      <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                          settings-scroll
                        </div>
                        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                          Settings page content. Width: 6px.
                        </div>
                      </div>
                      <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                          legend-scroll
                        </div>
                        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                          Chart legend area. Width: 6px.
                        </div>
                      </div>
                      <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                          shell-scroll
                        </div>
                        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                          Terminal/Shell output. Width: 6px, dark thumb (#475569).
                        </div>
                      </div>
                      <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                          table-scroll-container
                        </div>
                        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                          Table horizontal scroll. Height: 6px, auto overflow-x.
                        </div>
                      </div>
                    </div>
                  </VStack>

                  {/* Live Examples */}
                  <VStack gap={3}>
                    <Label>Live examples</Label>
                    <div className="flex gap-6 items-start">
                      <div className="flex flex-col gap-2 w-[200px]">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          sidebar-scroll (6px)
                        </span>
                        <div className="w-full h-[150px] overflow-y-auto overflow-x-hidden sidebar-scroll bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                          <div className="space-y-2 w-full">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div
                                key={i}
                                className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] py-1"
                              >
                                Menu Item {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-[200px]">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          shell-scroll (dark)
                        </span>
                        <div className="w-full h-[150px] overflow-y-auto overflow-x-hidden shell-scroll bg-[#1e293b] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                          <div className="space-y-1 font-mono w-full">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div
                                key={i}
                                className="text-[length:var(--font-size-11)] text-[#94a3b8]"
                              >
                                $ command --option {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </VStack>

                  {/* Horizontal Scroll Examples */}
                  <VStack gap={3}>
                    <Label>Horizontal scroll (table-scroll-container)</Label>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                          Table horizontal scrollbar (height: 6px)
                        </span>
                        <div
                          className="w-full max-w-[500px] table-scroll-container bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]"
                          style={{ overflowX: 'auto' }}
                        >
                          <div className="flex gap-4 p-3" style={{ width: '800px' }}>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex-shrink-0 w-[120px] h-[60px] bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] flex items-center justify-center text-[length:var(--font-size-11)] text-[var(--color-text-default)]"
                              >
                                Column {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono whitespace-pre-wrap">
                        {`// Horizontal scrollbar for tables
<div className="table-scroll-container" style={{ overflowX: 'auto' }}>
  <div style={{ minWidth: '800px' }}>
    {/* table content wider than container */}
  </div>
</div>

// CSS
.table-scroll-container::-webkit-scrollbar { height: 6px; }
.table-scroll-container { scrollbar-width: thin; }`}
                      </div>
                    </div>
                  </VStack>

                  {/* Usage */}
                  <VStack gap={3}>
                    <Label>Usage</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono whitespace-pre-wrap">
                      {`// Add class to scrollable container
<div className="overflow-y-auto sidebar-scroll">
  {/* scrollable content */}
</div>

// CSS supports both Webkit and Firefox
.sidebar-scroll::-webkit-scrollbar { width: 6px; }
.sidebar-scroll { scrollbar-width: thin; }`}
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* DetailHeader Component */}
              <Section
                id="detail-header"
                title="Detail header"
                description="Page header component for resource detail views with title, actions, and info cards"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            구성 요소
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>Title</strong>: 리소스 이름. 텍스트가 길 경우 말줄임 처리.
                            </li>
                            <li>
                              <strong>Actions</strong>: 리소스에 대한 주요 액션 버튼. Secondary sm
                              크기. ContextMenu로 추가 액션 제공.
                            </li>
                            <li>
                              <strong>InfoGrid</strong>: 4~6개의 주요 정보를 InfoCard로 표시.
                              Status, ID(copyable), 생성일 등.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            InfoCard 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>Status</strong>: StatusIndicator로 실시간 상태를 표시. 항상 첫
                              번째 카드에 배치.
                            </li>
                            <li>
                              <strong>ID</strong>: <code>copyable</code> 속성으로 클립보드 복사
                              기능을 제공합니다.
                            </li>
                            <li>
                              <strong>날짜</strong>: Created at, Updated at 등 시간 정보를
                              표시합니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>container.padding: 16×12px</code> · <code>container.radius: 8px</code> ·{' '}
                      <code>container.gap: 12px</code> · <code>title: 16px semibold</code> ·{' '}
                      <code>actions.gap: 4px</code> · <code>info-grid.gap: 8px</code> ·{' '}
                      <code>info-card.padding: 16×12px</code> · <code>info-card.radius: 8px</code> ·{' '}
                      <code>info-card.gap: 6px</code>
                    </div>
                  </VStack>

                  {/* Full Example - Figma Reference */}
                  <VStack gap={3}>
                    <Label>Instance Detail header (Figma Reference)</Label>
                    <DetailHeader>
                      <DetailHeader.Title>tk-test</DetailHeader.Title>
                      <DetailHeader.Actions>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<IconTerminal2 size={12} stroke={1.5} />}
                        >
                          Console
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
                        >
                          Start
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<IconPlayerStop size={12} stroke={1.5} />}
                        >
                          Stop
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<IconRefresh size={12} stroke={1.5} />}
                        >
                          Reboot
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<IconTrash size={12} stroke={1.5} />}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          rightIcon={<IconChevronDown size={12} stroke={1.5} />}
                        >
                          More actions
                        </Button>
                      </DetailHeader.Actions>
                      <DetailHeader.InfoGrid>
                        <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                        <DetailHeader.InfoCard
                          label="ID"
                          value="7284d9174e81431e93060a9bbcf2cdfd"
                          copyable
                        />
                        <DetailHeader.InfoCard label="Host" value="compute-03" />
                        <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025 14:30:22" />
                      </DetailHeader.InfoGrid>
                    </DetailHeader>
                  </VStack>

                  {/* Info Card Status States */}
                  <VStack gap={3}>
                    <Label>Info Card - Status indicator States</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                      <DetailHeader.InfoCard label="Status" value="Shutoff" status="shutoff" />
                      <DetailHeader.InfoCard label="Status" value="Degraded" status="degraded" />
                      <DetailHeader.InfoCard label="Status" value="Error" status="error" />
                    </div>
                  </VStack>

                  {/* Info Card with Copy */}
                  <VStack gap={3}>
                    <Label>Info Card - Copyable Values</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <DetailHeader.InfoCard
                        label="Instance ID"
                        value="7284d9174e81431e93060a9bbcf2cdfd"
                        copyable
                      />
                      <DetailHeader.InfoCard label="IP Address" value="192.168.1.100" copyable />
                    </div>
                  </VStack>

                  {/* Info Card Basic */}
                  <VStack gap={3}>
                    <Label>Info Card - Basic Text</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <DetailHeader.InfoCard label="Host" value="compute-03" />
                      <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025 14:30:22" />
                      <DetailHeader.InfoCard label="Availability zone" value="nova" />
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* SectionCard Component */}
              <Section
                id="section-card"
                title="Section card"
                description="Container component for grouping related content in detail views"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>Detail Page에서 관련 정보를 그룹화하는 카드 컨테이너입니다.</li>
                          <li>
                            <strong>Header</strong>: 섹션 타이틀과 선택적 액션 버튼(Edit 등)을
                            포함합니다.
                          </li>
                          <li>
                            <strong>DataRow</strong>: label-value 형태로 정보를 표시합니다.{' '}
                            <code>isLink</code>로 클릭 가능한 링크를 제공합니다.
                          </li>
                          <li>
                            <strong>복잡한 값</strong>: value prop 대신 <code>children</code>으로
                            StatusIndicator, Chip 등 커스텀 콘텐츠를 표시합니다.
                          </li>
                          <li>
                            하나의 SectionCard에는 <strong>최대 10개의 DataRow</strong>를
                            권장합니다. 초과 시 SectionCard를 분리하세요.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>padding: 16×12px</code> · <code>radius: 6px (md)</code> ·{' '}
                      <code>header.height: 32px</code> · <code>title: 14px medium</code> ·{' '}
                      <code>label: 11px medium</code> · <code>value: 12px</code>
                    </div>
                  </VStack>

                  {/* Basic Example */}
                  <VStack gap={3}>
                    <Label>Basic usage</Label>
                    <SectionCard>
                      <SectionCard.Header title="Basic information" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Instance name" value="web-server-01" />
                        <SectionCard.DataRow label="Availability zone" value="nova" />
                        <SectionCard.DataRow label="Description" value="Production web server" />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>

                  {/* With Actions */}
                  <VStack gap={3}>
                    <Label>With Action Buttons</Label>
                    <SectionCard>
                      <SectionCard.Header
                        title="Basic information"
                        actions={
                          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                            Edit
                          </Button>
                        }
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Instance name" value="web-server-01" />
                        <SectionCard.DataRow label="Availability zone" value="nova" />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>

                  {/* With Links */}
                  <VStack gap={3}>
                    <Label>With Link Values</Label>
                    <SectionCard>
                      <SectionCard.Header title="Flavor" />
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Flavor name"
                          value="m1.large"
                          isLink
                          linkHref="/flavors"
                        />
                        <SectionCard.DataRow
                          label="Spec"
                          value="vCPU: 4 / RAM: 8 GiB / Disk: 80 GiB"
                        />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>

                  {/* Multiple Sections Example */}
                  <VStack gap={3}>
                    <Label>Multiple Sections (Detail Page Layout)</Label>
                    <VStack gap={4}>
                      <SectionCard>
                        <SectionCard.Header
                          title="Basic information"
                          actions={
                            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                              Edit
                            </Button>
                          }
                        />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Instance name" value="tk-test" />
                          <SectionCard.DataRow label="Availability zone" value="nova" />
                          <SectionCard.DataRow label="Description" value="-" />
                        </SectionCard.Content>
                      </SectionCard>

                      <SectionCard>
                        <SectionCard.Header title="Flavor" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Flavor name"
                            value="web-server-10"
                            isLink
                            linkHref="/flavors"
                          />
                          <SectionCard.DataRow
                            label="Spec"
                            value="vCPU: 1 / RAM: 4 GiB / Disk: 40 GiB / GPU: 1"
                          />
                        </SectionCard.Content>
                      </SectionCard>

                      <SectionCard>
                        <SectionCard.Header title="Image" />
                        <SectionCard.Content>
                          <SectionCard.DataRow
                            label="Image"
                            value="web-server-10"
                            isLink
                            linkHref="/images"
                          />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </VStack>
                </VStack>
              </Section>

              {/* Wizard (Create Flow) Component */}
              <Section
                id="wizard"
                title="Wizard (Create Flow)"
                description="Multi-step wizard pattern for resource creation with section status management"
              >
                <WizardPatternSection />
              </Section>

              {/* Menu Component */}
              <Section
                id="menu"
                title="Menu"
                description="Navigation menu with sections, items, and dividers"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>사이드바 네비게이션에서 앱 내 페이지 이동에 사용합니다.</li>
                          <li>
                            <strong>섹션 그룹</strong>: 관련 메뉴를 섹션 타이틀로 그룹화합니다.
                          </li>
                          <li>
                            <strong>Collapsible 섹션</strong>: 하위 메뉴가 있는 섹션은 접힘/펼침이
                            가능합니다.
                          </li>
                          <li>
                            <strong>활성 상태</strong>: 현재 페이지에 해당하는 메뉴 아이템을
                            시각적으로 강조합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>item.padding: 8×6px</code> · <code>item.gap: 6px</code> ·{' '}
                      <code>item.radius: 6px (md)</code> · <code>section.padding: 8×4px</code> ·{' '}
                      <code>section.gap: 16px</code> · <code>section.title-gap: 6px</code> ·{' '}
                      <code>divider.margin: 8px</code>
                    </div>
                  </VStack>

                  {/* Example - Compute Admin Sidebar Style */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VStack gap={3}>
                      <Label>Menu items (기본)</Label>
                      <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                        <MenuItem icon={<IconHome size={16} stroke={1.5} />} label="Home" active />
                        <MenuItem icon={<IconCube size={16} stroke={1.5} />} label="Instances" />
                        <MenuItem
                          icon={<IconTemplate size={16} stroke={1.5} />}
                          label="Instance templates"
                        />
                        <MenuItem
                          icon={<IconCamera size={16} stroke={1.5} />}
                          label="Instance snapshots"
                        />
                      </div>
                    </VStack>

                    <VStack gap={3}>
                      <Label>Collapsible sections</Label>
                      <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                        <VStack gap={4}>
                          <MenuSection title="Compute" defaultOpen={true}>
                            <MenuItem
                              icon={<IconCube size={16} stroke={1.5} />}
                              label="Instances"
                              active
                            />
                            <MenuItem
                              icon={<IconTemplate size={16} stroke={1.5} />}
                              label="Instance templates"
                            />
                            <MenuItem icon={<IconDisc size={16} stroke={1.5} />} label="Images" />
                            <MenuItem icon={<IconCpu size={16} stroke={1.5} />} label="Flavors" />
                          </MenuSection>
                          <MenuSection title="Storage" defaultOpen={true}>
                            <MenuItem
                              icon={<IconDatabase size={16} stroke={1.5} />}
                              label="Volumes"
                            />
                            <MenuItem
                              icon={<IconCamera size={16} stroke={1.5} />}
                              label="Volume snapshots"
                            />
                          </MenuSection>
                        </VStack>
                      </div>
                    </VStack>
                  </div>

                  {/* Full Sidebar Example */}
                  <VStack gap={3}>
                    <Label>Compute Admin 사이드바 예시</Label>
                    <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                      <VStack gap={4}>
                        <MenuItem icon={<IconHome size={16} stroke={1.5} />} label="Home" />
                        <MenuSection title="Compute" defaultOpen={true}>
                          <MenuItem
                            icon={<IconCube size={16} stroke={1.5} />}
                            label="Instances"
                            active
                          />
                          <MenuItem
                            icon={<IconTemplate size={16} stroke={1.5} />}
                            label="Instance templates"
                          />
                          <MenuItem
                            icon={<IconCamera size={16} stroke={1.5} />}
                            label="Instance snapshots"
                          />
                          <MenuItem icon={<IconDisc size={16} stroke={1.5} />} label="Images" />
                          <MenuItem icon={<IconCpu size={16} stroke={1.5} />} label="Flavors" />
                        </MenuSection>
                        <MenuSection title="Storage" defaultOpen={true}>
                          <MenuItem
                            icon={<IconDatabase size={16} stroke={1.5} />}
                            label="Volumes"
                          />
                          <MenuItem
                            icon={<IconCamera size={16} stroke={1.5} />}
                            label="Volume snapshots"
                          />
                          <MenuItem
                            icon={<IconDatabaseExport size={16} stroke={1.5} />}
                            label="Volume backups"
                          />
                        </MenuSection>
                        <MenuSection title="Network" defaultOpen={true}>
                          <MenuItem
                            icon={<IconNetwork size={16} stroke={1.5} />}
                            label="Networks"
                          />
                          <MenuItem icon={<IconRouter size={16} stroke={1.5} />} label="Routers" />
                          <MenuItem
                            icon={<IconWorldWww size={16} stroke={1.5} />}
                            label="Floating IPs"
                          />
                          <MenuItem
                            icon={<IconShieldLock size={16} stroke={1.5} />}
                            label="Security groups"
                          />
                        </MenuSection>
                        <MenuSection title="Monitoring" defaultOpen={false}>
                          <MenuItem
                            icon={<IconActivity size={16} stroke={1.5} />}
                            label="Monitor overview"
                          />
                          <MenuItem
                            icon={<IconServer2 size={16} stroke={1.5} />}
                            label="Physical nodes"
                          />
                        </MenuSection>
                      </VStack>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* ContextMenu Component */}
              <Section
                id="context-menu"
                title="Context menu"
                description="Popup menu triggered by right-click or click with submenu support"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            트리거 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    트리거
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    사용 조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    예시
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    click
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    명시적인 버튼 클릭으로 메뉴 오픈. 주요 액션 제공 시 사용.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    More actions, Create 드롭다운
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    contextmenu
                                  </td>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    우클릭으로 메뉴 오픈. 보조 액션 제공 시 사용.
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    테이블 행 우클릭, 파일 탐색기
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            메뉴 항목 구성 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              모든 항목에 고유한 <code>id</code> 필드가 필수입니다.
                            </li>
                            <li>
                              <strong>위험 액션</strong> (Delete, Terminate)은{' '}
                              <code>status: &apos;danger&apos;</code>로 설정하고 메뉴 하단에
                              배치합니다.
                            </li>
                            <li>
                              <strong>구분선</strong>: 별도 divider 항목이 아닌, 항목의{' '}
                              <code>divider: true</code> 속성으로 아래에 구분선을 표시합니다.
                            </li>
                            <li>
                              <strong>순서</strong>: 자주 사용하는 액션을 위에, 위험 액션을 아래에
                              배치합니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 가이드라인 */}
                  <VStack gap={3}>
                    <Label>가이드라인</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">
                          Do
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>Delete 등 파괴적 액션은 danger 스타일로 시각적 경고를 제공합니다.</li>
                          <li>관련 있는 액션끼리 divider로 그룹을 나눕니다.</li>
                          <li>키보드로 메뉴 탐색이 가능하도록 합니다 (Arrow 키, Enter, Escape).</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                          Don&apos;t
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>
                            <code>
                              {'{'}type: &apos;divider&apos;{'}'}
                            </code>{' '}
                            형태로 별도 구분선 아이템을 추가하지 않습니다.
                          </li>
                          <li>서브메뉴를 2단계 이상 중첩하지 않습니다.</li>
                          <li>
                            contextmenu 트리거만 단독으로 사용하지 않습니다 (발견성이 낮음, click
                            트리거와 병행).
                          </li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>min-width: 80px</code> · <code>padding: 12×6px</code> ·{' '}
                      <code>radius: 6px</code> · <code>shadow: md</code>
                    </div>
                  </VStack>

                  {/* Static Preview */}
                  <VStack gap={3}>
                    <Label>Static preview</Label>
                    <div className="flex gap-6 items-start">
                      {/* Basic Menu */}
                      <VStack gap={2}>
                        <span className="text-body-xs text-[var(--color-text-subtle)]">Basic</span>
                        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden">
                          <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                            Edit
                          </div>
                          <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                            Duplicate
                          </div>
                          <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] border-b border-[var(--color-border-subtle)]">
                            Copy
                          </div>
                          <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-state-danger)]">
                            Delete
                          </div>
                        </div>
                      </VStack>

                      {/* With Submenu */}
                      <VStack gap={2}>
                        <span className="text-body-xs text-[var(--color-text-subtle)]">
                          With Submenu
                        </span>
                        <div className="flex gap-1 items-start">
                          <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden">
                            <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] flex items-center justify-between bg-[var(--context-menu-hover-bg)]">
                              <span>New</span>
                              <IconChevronRight
                                size={12}
                                stroke={1}
                                className="ml-6 text-[var(--color-text-default)]"
                              />
                            </div>
                            <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                              Open
                            </div>
                            <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] border-b border-[var(--color-border-subtle)]">
                              Save
                            </div>
                            <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] flex items-center justify-between">
                              <span>Export</span>
                              <IconChevronRight
                                size={12}
                                stroke={1}
                                className="ml-6 text-[var(--color-text-default)]"
                              />
                            </div>
                          </div>
                          <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden self-start">
                            <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                              File
                            </div>
                            <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                              Folder
                            </div>
                          </div>
                        </div>
                      </VStack>

                      {/* Status Variants */}
                      <VStack gap={2}>
                        <span className="text-body-xs text-[var(--color-text-subtle)]">
                          Danger Status
                        </span>
                        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden">
                          <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                            Default item
                          </div>
                          <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] border-b border-[var(--color-border-subtle)]">
                            Another item
                          </div>
                          <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-state-danger)]">
                            Warning action
                          </div>
                          <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]">
                            Delete
                          </div>
                        </div>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Right Click Trigger */}
                  <VStack gap={3}>
                    <Label>Right Click Trigger</Label>
                    <ContextMenu
                      trigger="contextmenu"
                      items={[
                        { id: 'edit', label: 'Edit', onClick: () => {} },
                        { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
                        { id: 'copy', label: 'Copy', onClick: () => {} },
                        { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
                      ]}
                    >
                      <div className="w-[200px] h-[100px] flex items-center justify-center bg-[var(--color-surface-subtle)] border border-dashed border-[var(--color-border-default)] rounded-[var(--radius-md)] text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                        Right-click here
                      </div>
                    </ContextMenu>
                  </VStack>

                  {/* Click Trigger */}
                  <VStack gap={3}>
                    <Label>Click trigger</Label>
                    <ContextMenu
                      trigger="click"
                      items={[
                        { id: 'view', label: 'View details', onClick: () => {} },
                        { id: 'edit', label: 'Edit', onClick: () => {} },
                        { id: 'share', label: 'Share', onClick: () => {} },
                        { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
                      ]}
                    >
                      <Button variant="outline" size="sm">
                        Click for Menu
                      </Button>
                    </ContextMenu>
                  </VStack>

                  {/* With Submenu */}
                  <VStack gap={3}>
                    <Label>With submenu</Label>
                    <ContextMenu
                      trigger="click"
                      items={[
                        {
                          id: 'new',
                          label: 'New',
                          submenu: [
                            { id: 'new-file', label: 'File', onClick: () => {} },
                            { id: 'new-folder', label: 'Folder', onClick: () => {} },
                          ],
                        },
                        { id: 'open', label: 'Open', onClick: () => {} },
                        { id: 'save', label: 'Save', onClick: () => {}, divider: true },
                        {
                          id: 'export',
                          label: 'Export',
                          submenu: [
                            { id: 'export-pdf', label: 'PDF', onClick: () => {} },
                            { id: 'export-csv', label: 'CSV', onClick: () => {} },
                            { id: 'export-json', label: 'JSON', onClick: () => {} },
                          ],
                        },
                      ]}
                    >
                      <Button variant="outline" size="sm">
                        Menu with Submenu
                      </Button>
                    </ContextMenu>
                  </VStack>

                  {/* Status Variants */}
                  <VStack gap={3}>
                    <Label>Status variants</Label>
                    <ContextMenu
                      trigger="click"
                      items={[
                        { id: 'item1', label: 'Default item', onClick: () => {} },
                        { id: 'item2', label: 'Another item', onClick: () => {}, divider: true },
                        {
                          id: 'danger1',
                          label: 'Warning action',
                          status: 'danger',
                          onClick: () => {},
                        },
                        {
                          id: 'danger2',
                          label: 'Delete',
                          status: 'danger',
                          onClick: () => {},
                        },
                      ]}
                    >
                      <Button variant="outline" size="sm">
                        Show status variants
                      </Button>
                    </ContextMenu>
                  </VStack>
                </VStack>
              </Section>

              {/* Modal Component */}
              <Section
                id="modal"
                title="Modal"
                description="Dialog overlay for confirmations, alerts, and user interactions"
              >
                <VStack gap={8}>
                  {/* 1. 개요 */}
                  <VStack gap={3}>
                    <Label>1. 개요</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            모달은 사용자가 리소스에 대해 액션을 실행하기 전에 확인을 받기 위한
                            UI로, 사용자의 실수를 방지하고, 액션으로 인해 발생할 수 있는 결과를
                            명확하게 인지시켜야 합니다.
                          </p>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            적용 기준
                          </h4>
                          <p className="text-body-md text-[var(--color-text-muted)] mb-1">
                            다음과 같은 액션을 실행할 때 모달을 노출시켜 사용자의 실수를 방지합니다.
                          </p>
                          <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>파괴적 액션</strong> — 삭제, 중단 등 리소스 자체를 불가능한
                              상태로 만드는 액션
                            </li>
                            <li>
                              <strong>치명적 영향 액션</strong> — 연결 끊기, 연결 변경 등 리소스의
                              특정 기능에 문제를 만드는 액션
                            </li>
                            <li>
                              <strong>복구 불가 액션</strong> — 데이터 손실 등 되돌릴 수 없을 수
                              있는 액션
                            </li>
                            <li>
                              <strong>일괄 액션</strong> — 여러 리소스를 대상으로 일어나는 액션
                            </li>
                          </ol>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 2. 구성 요소 */}
                  <VStack gap={3}>
                    <Label>2. 구성 요소</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          1. 타이틀
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                          액션을 명확히 제시 · 좌측 최상단
                        </p>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>
                            <code>KO</code> 리소스 + 액션 구조로 작성 권장
                          </li>
                          <li>
                            <code>EN</code> 액션 + 리소스 구조로 작성 권장
                          </li>
                          <li>문장의 첫 글자만 대문자 사용 권장</li>
                          <li>단일 대상 → 단수형, 다중 대상 → 복수형</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          2. 디스크립션
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                          상세한 액션에 대한 확인 · 타이틀 하단
                        </p>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>
                            <code>KO</code> &#123;리소스&#125;를 정말 &#123;액션&#125;하시겠습니까?
                          </li>
                          <li>
                            <code>EN</code> Are you sure you want to &#123;action&#125; this
                            &#123;resource&#125;?
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          3. 주체{' '}
                          <span className="text-body-sm text-[var(--color-text-subtle)] font-normal">
                            (선택)
                          </span>
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                          액션이 이뤄지는 대상 확인 · 디스크립션 하단
                        </p>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>&#123;리소스명&#125; + &#123;이름&#125; 조합</li>
                          <li>액션이 이뤄지는 주된 대상이 하나일 때 노출</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          4. 액션 가능한 주체{' '}
                          <span className="text-body-sm text-[var(--color-text-subtle)] font-normal">
                            (선택)
                          </span>
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                          액션이 이뤄지는 대상 확인 · 디스크립션 하단
                        </p>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>
                            <code>KO</code> &#123;액션&#125; 가능한 &#123;리소스&#125;
                          </li>
                          <li>
                            <code>EN</code> &#123;resources&#125; that can be &#123;action&#125;
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          5. 액션 불가능한 주체{' '}
                          <span className="text-body-sm text-[var(--color-text-subtle)] font-normal">
                            (선택)
                          </span>
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                          액션이 불가능한 대상 확인 · 액션 가능한 주체 하단
                        </p>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>
                            <code>KO</code> &#123;액션&#125; 불가능한 &#123;리소스&#125;
                          </li>
                          <li>
                            <code>EN</code> &#123;resources&#125; that cannot be &#123;action&#125;
                          </li>
                          <li>백엔드 확인 없이 액션이 불가능하다고 판단 가능한 경우 표기</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          6. 경고 문구{' '}
                          <span className="text-body-sm text-[var(--color-text-subtle)] font-normal">
                            (선택)
                          </span>
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                          액션으로 인해 발생할 수 있는 위험 전달 · 버튼 상단
                        </p>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>다른 리소스에 영향을 미칠 수 있는 경우</li>
                          <li>
                            대상 리소스에 치명적인 오류 또는 서비스 중단을 초래할 수 있을 때 표기
                          </li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>padding: 24px</code> · <code>gap: 16px</code> ·{' '}
                      <code>radius: 16px</code> · <code>backdrop: black/60</code>
                    </div>
                  </VStack>

                  {/* Size Guide */}
                  <VStack gap={3}>
                    <Label>Size</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>sm: 400px</code> · <code>md: 480px</code> · <code>lg: 640px</code>
                    </div>
                  </VStack>

                  {/* Inner Components Pattern */}
                  <VStack gap={3}>
                    <Label>Inner components</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Info Box */}
                      <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                        <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">
                          Info Box (single value)
                        </span>
                        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1">
                          <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
                            Volume name
                          </span>
                          <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                            vol-01 (Available)
                          </span>
                        </div>
                      </div>

                      {/* Scrollable List */}
                      <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                        <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">
                          Scrollable List (max-h: 96px)
                        </span>
                        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1 max-h-[96px] overflow-y-auto sidebar-scroll">
                          <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
                            Security groups (6)
                          </span>
                          <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-1">
                            <li>sg-01</li>
                            <li>sg-02</li>
                            <li>sg-03</li>
                            <li>sg-04</li>
                            <li>sg-05</li>
                            <li>sg-06</li>
                          </ul>
                        </div>
                      </div>

                      {/* Warning Alert */}
                      <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                        <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">
                          Warning Alert
                        </span>
                        <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-center">
                          <IconAlertCircle
                            size={16}
                            className="text-[var(--color-state-danger)] shrink-0"
                            stroke={1.5}
                          />
                          <p className="text-[11px] text-[var(--color-text-default)] leading-4">
                            This action will permanently delete the resource. This cannot be undone.
                          </p>
                        </div>
                      </div>

                      {/* Button Group */}
                      <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                        <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">
                          Button Group
                        </span>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="md" className="flex-1">
                            Cancel
                          </Button>
                          <Button variant="primary" size="md" className="flex-1">
                            Confirm
                          </Button>
                        </div>
                      </div>
                    </div>
                  </VStack>

                  {/* Use Cases */}
                  <VStack gap={3}>
                    <Label>Use cases</Label>
                    <HStack gap={2} className="flex-wrap">
                      <ModalUseCaseDemo useCase="delete-single" />
                      <ModalUseCaseDemo useCase="delete-multiple" />
                      <ModalUseCaseDemo useCase="disassociate" />
                      <ModalUseCaseDemo useCase="restore-warning" />
                    </HStack>
                  </VStack>

                  {/* ConfirmModal Component */}
                  <VStack gap={3}>
                    <Label>ConfirmModal component</Label>
                    <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                      삭제 확인 등 반복적인 패턴을 위한 전용 컴포넌트. <code>infoLabel</code>,{' '}
                      <code>infoValue</code>, <code>confirmVariant</code> props 지원.
                    </p>
                    <ModalDemo variant="delete" />
                  </VStack>

                  {/* AI Agent Modals */}
                  <VStack gap={3}>
                    <Label>AI Agent modals</Label>
                    <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                      AI Agent 관리를 위한 모달 컴포넌트. Agent source 삭제 등의 확인 모달을 포함.
                    </p>
                    <AIAgentModalDemo />
                  </VStack>
                </VStack>
              </Section>

              {/* Drawer Component */}
              <Section
                id="drawer"
                title="Drawer"
                description="Slide-out panel for forms, details, and secondary content"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Drawer vs Modal 선택 기준
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    조건
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    권장 컴포넌트
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    간단한 확인/결정 (예/아니오)
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Modal (sm)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    간단한 폼 (필드 1~5개)
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Drawer (4col / 360px)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    선택/검색 필요 (리스트에서 선택)
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    Drawer (8col / 696px)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                    복잡한 리소스 생성 (많은 필드)
                                  </td>
                                  <td className="py-2 font-medium text-[var(--color-text-default)]">
                                    별도 Create 페이지
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            너비 정책 (Grid 기반)
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-subtle)]">
                            Column 60px, Gutter 24px, Margin 24px 그리드 기준
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    컬럼
                                  </th>
                                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                    너비
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    용도
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    4 columns
                                  </td>
                                  <td className="py-2 pr-4 font-mono text-[var(--color-text-default)]">
                                    360px
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    폼 Drawer (Edit, Create with few fields)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    8 columns
                                  </td>
                                  <td className="py-2 pr-4 font-mono text-[var(--color-text-default)]">
                                    696px
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    선택 Drawer (리스트에서 리소스 선택, 상세 정보 표시)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                    12 columns
                                  </td>
                                  <td className="py-2 pr-4 font-mono text-[var(--color-text-default)]">
                                    1032px
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    대형 Drawer (복잡한 레이아웃, 멀티 패널)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            구조 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>헤더</strong>: Custom header 사용 시{' '}
                              <code>title=&quot;&quot;</code>,{' '}
                              <code>
                                showCloseButton={'{'}false{'}'}
                              </code>
                              로 설정하고 내부에 h2(text-heading-h5)로 타이틀 작성.
                            </li>
                            <li>
                              <strong>Footer</strong>: 액션 버튼은 footer prop에 배치.
                              Cancel(secondary) 왼쪽, Submit(primary) 오른쪽. <code>flex-1</code>로
                              균등 너비.
                            </li>
                            <li>
                              <strong>컨텍스트 정보</strong>: 수정 대상 리소스의 ID/이름은 상단
                              InfoBox로 표시.
                            </li>
                            <li>
                              <strong>스크롤</strong>: 콘텐츠가 길면 body 영역만 스크롤. Footer는
                              하단 고정.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 가이드라인 */}
                  <VStack gap={3}>
                    <Label>가이드라인</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">
                          Do
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>Drawer가 열려 있을 때 배경 콘텐츠와의 맥락을 유지합니다.</li>
                          <li>닫기 전 미저장 변경사항이 있으면 확인 모달을 표시합니다.</li>
                          <li>ESC 키와 외부 클릭으로 닫을 수 있도록 합니다.</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                        <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                          Don&apos;t
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                          <li>Drawer 안에서 또 다른 Drawer를 열지 않습니다.</li>
                          <li>필드 6개 이상을 Drawer에 넣지 않습니다 (별도 Create 페이지 사용).</li>
                          <li>Drawer를 전체 화면 너비로 사용하지 않습니다.</li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>width: 320px (default)</code> · <code>Form: 360px (4col)</code> ·{' '}
                      <code>Selection: 696px (8col)</code> · <code>Large: 1032px (12col)</code> ·{' '}
                      <code>padding-x: 24px</code> · <code>padding-y: 16px</code> ·{' '}
                      <code>animation: 300ms ease-out</code>
                    </div>
                  </VStack>

                  {/* Interactive Demo */}
                  <VStack gap={3}>
                    <Label>Interactive demo</Label>
                    <DrawerDemo />
                  </VStack>

                  {/* Specifications */}
                  <VStack gap={3}>
                    <Label>Specifications</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-12)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Property
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Type
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Default
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              isOpen
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Whether the drawer is open
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              onClose
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              () =&gt; void
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Callback when drawer should close
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              title
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">Drawer title</td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              width
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              string | number
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">320</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Width of the drawer
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              side
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              'left' | 'right'
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">'right'</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Side from which drawer appears
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              footer
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">ReactNode</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Footer content (typically action buttons)
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              showCloseButton
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Whether to show close button
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              closeOnBackdropClick
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Whether clicking backdrop closes drawer
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Monitoring toolbar */}
              <Section
                id="monitoring-toolbar"
                title="Monitoring toolbar"
                description="Time range selection and refresh controls for monitoring dashboards"
              >
                <VStack gap={8}>
                  {/* 1. 개요 */}
                  <VStack gap={3}>
                    <Label>1. 개요</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={3}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            그래프의 데이터 조회 범위를 제어하는 버튼 그룹입니다. 최소한의 클릭으로
                            원하는 시간대의 데이터를 빠르게 탐색하는 것이 목표입니다.
                          </p>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">위치</h4>
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            그래프 조합으로 이뤄진 화면의 <strong>상단 영역</strong>에 배치됩니다.
                            (모니터링 화면 상단 등)
                          </p>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 2. 구성 요소 */}
                  <VStack gap={3}>
                    <Label>2. 구성 요소</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          상대 시간 버튼
                        </h4>
                        <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            기본값은 <strong>30m</strong>로 선택 (
                            <code>defaultTimeRange: &apos;30m&apos;</code>)
                          </li>
                          <li>라디오 버튼처럼 동작 — 한 번에 하나만 활성화</li>
                          <li>클릭 즉시 데이터가 해당 기간으로 필터링</li>
                        </ol>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          커스텀 기간 버튼
                        </h4>
                        <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>클릭 시 데이트 피커 노출</li>
                          <li>기간 선택 완료 시 상대 시간 버튼 선택 해지</li>
                          <li>
                            기간 선택 후 기간과 <strong>Clear</strong> 버튼 노출
                          </li>
                          <li>Clear 클릭 시 커스텀 기간 해지 → 1h(상대 시간) 재선택</li>
                          <li>Clear 외 영역 클릭 시 데이트 피커 재노출 (기간 재설정 가능)</li>
                        </ol>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          새로 고침 버튼
                        </h4>
                        <ol className="list-decimal pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>클릭 시 데이터가 새로고침됩니다.</li>
                        </ol>
                      </div>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>segment-padding: 4px 12px</code> · <code>border-radius: 8px</code> ·{' '}
                      <code>font-size: 11px</code> · <code>gap: 4px</code>
                    </div>
                  </VStack>

                  {/* Interactive Demo */}
                  <VStack gap={3}>
                    <Label>Default</Label>
                    <div className="flex items-center justify-end p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <MonitoringToolbar
                        onTimeRangeChange={(value) => console.log('Time range:', value)}
                        onCustomPeriodChange={(period) => console.log('Custom period:', period)}
                        onRefresh={() => console.log('Refresh clicked')}
                      />
                    </div>
                  </VStack>

                  {/* Specifications */}
                  <VStack gap={3}>
                    <Label>Specifications</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-12)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Property
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Type
                            </th>
                            <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Default
                            </th>
                            <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              timeRangeOptions
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              TimeRangeOption[]
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              30m, 1h, 6h, 12h, 24h
                            </td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Time range options to display
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              timeRange
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              TimeRangeValue
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Controlled time range value
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              defaultTimeRange
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              TimeRangeValue
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">'30m'</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Default time range (uncontrolled)
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              onTimeRangeChange
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              (value) =&gt; void
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Callback when time range changes
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              customPeriod
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              CustomPeriod | null
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Custom date range (start, end)
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              onCustomPeriodChange
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              (period) =&gt; void
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Callback when custom period changes
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              onRefresh
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              () =&gt; void
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Callback when refresh is clicked
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              showRefresh
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Show refresh button
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              maxDate
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">Date</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">new Date()</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Maximum selectable date
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Notification center */}
              <NotificationCenterSection />

              {/* Toast Section */}
              <Section
                id="toast"
                title="Toast"
                description="Instant feedback notification for user actions, displayed briefly at the top-right corner"
              >
                <VStack gap={8}>
                  {/* 1. 개요 */}
                  <VStack gap={3}>
                    <Label>1. 개요</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              사용자가 수행한 액션에 대한 <strong>즉각적인 피드백</strong>을
                              제공하는 알림 컴포넌트입니다.
                            </li>
                            <li>화면 우측 상단 고정 영역에 잠깐 노출됩니다.</li>
                            <li>
                              상세 확인/기록은 앱 내부 알림센터가 담당하며, 전역 알림 패널은 안읽은
                              알림 목록을 모아 보여주는 보조 뷰입니다.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            레이아웃
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    상태
                                  </th>
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    토스트 표시 위치
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    예외
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    앱 활성 상태
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    해당 앱 UI의 우측 상단 토스트 영역 (최상단 레이어)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    앱 내부 알림센터가 열려 있을 경우 → 토스트 미표시, 알림센터 +
                                    전역 패널에 기록
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    앱 비활성 / 닫힘
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    데스크탑 UI 공통 토스트 영역 (우측 상단)
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    전역 패널이 열려 있는 경우 → 토스트 미표시, 알림센터 + 전역
                                    패널에 기록
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            표시 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              항상 동시에 <strong>1개만</strong> 노출됩니다.
                            </li>
                            <li>
                              새 토스트 도착 시, 현재 토스트의 최소 1초가 지났다면 교체 (아직 1초
                              미만이면 1초 채운 뒤 교체).
                            </li>
                            <li>
                              호버 중 / 상세 정보(View details)가 열려있는 중에는 교체 금지
                              (대기열에 쌓았다가 순차 노출).
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            적용 기준
                          </h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              0.7버전에서는 <strong>사용자 액션에 대한 피드백만</strong> 토스트
                              메시지에 해당합니다.
                            </li>
                            <li>
                              토스트 메시지는 얼럿(Alert)이 아닌 <strong>노티(Notification)</strong>
                              입니다.
                            </li>
                            <li>
                              노티 유형: <strong>요청</strong>(비동기 착수 알림),{' '}
                              <strong>성공</strong>, <strong>실패</strong>
                            </li>
                            <li>시스템 장애/보안 이벤트 등은 이후 버전에서 진행합니다.</li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 2. 구성 요소 */}
                  <VStack gap={3}>
                    <Label>2. 구성 요소</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          유형 아이콘
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)]">
                          토스트 유형(요청/성공/실패)에 맞는 아이콘을 표시합니다.
                        </p>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          메시지 내용
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)]">
                          어떤 리소스에 대해 어떤 액션이 어떻게 되었는지 단일 문장으로 구성합니다.
                        </p>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          파티션 정보 (선택)
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)]">
                          앱에 파티션(compute의 tenant, container의 cluster/namespace 등)이 존재할
                          경우 어떤 파티션에서 일어난 액션인지 표시합니다.
                        </p>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          닫기(x) 버튼
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)]">
                          클릭 시 토스트가 즉시 닫힙니다. 단순 UI 닫음이며{' '}
                          <strong>읽음 처리가 아닙니다</strong> (알림센터/전역 패널에는 안읽음으로
                          유지).
                        </p>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          메시지 발생 시각
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>
                            당일: <code className="text-body-sm">hh:mm:ss</code>
                          </li>
                          <li>
                            과거: <code className="text-body-sm">EN</code> Month(축약형) DD (예: Dec
                            7) / <code className="text-body-sm">KO</code> MM월 DD일 (예: 12월 7일)
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          앱 아이콘 (선택)
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>알림이 발생한 앱 아이콘 노출</li>
                          <li>데스크탑 UI에서 노출 시 표시</li>
                          <li>앱 내에서 노출 시 표시하지 않음</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          상세 보기 버튼 (선택)
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>실패 토스트일 때만 제공</li>
                          <li>클릭 시 상세 정보 영역 확장/축소</li>
                          <li>확장 시 해당 토스트 고정</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          버튼 외 클릭 영역
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>닫기 버튼, 상세보기 버튼을 제외한 모든 토스트 영역</li>
                          <li>클릭 시 대상 리소스 상세 화면으로 이동</li>
                          <li>상세 화면이 없을 경우 리스트 화면으로 이동</li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* 3. 가이드라인 */}
                  <VStack gap={3}>
                    <Label>3. 가이드라인</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            토스트 메시지 발생 유형
                          </h4>
                          <p className="text-body-md text-[var(--color-text-muted)] mb-1">
                            사용자 액션 결과형: 화면 UI 또는 Shell에서 사용자가 특정 액션을 직접
                            수행했을 때, 그 결과를 즉각적으로 알려주는 용도.
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-state-info)]" />
                                <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                                  요청
                                </span>
                              </div>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                비동기 액션에서만 선택적으로 발생. 실시간으로 즉시 완료되지 않을 때
                                요청되었음을 알림.
                              </p>
                            </div>
                            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-state-success)]" />
                                <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                                  성공
                                </span>
                              </div>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                사용자의 요청이 정상적으로 처리되었음을 알림. (예: 인스턴스 생성
                                성공)
                              </p>
                            </div>
                            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-state-danger)]" />
                                <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                                  실패
                                </span>
                              </div>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                사용자의 요청이 처리되지 못했거나 오류가 발생했음을 알림. (예: 볼륨
                                연결 실패)
                              </p>
                            </div>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            동시 표시 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              한 번에 <strong>1개만</strong> 노출.
                            </li>
                            <li>호버/핀 고정 중에는 새 토스트를 대기열에 쌓음.</li>
                            <li>고정 해제 후 도착 순서대로(발생 시간 순) 노출.</li>
                            <li>
                              각 토스트는 <strong>최소 1초</strong> 보장 후 다음으로 넘어감.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            토스트 표시 시간
                          </h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              최소 노출 <strong>1초</strong>, 최대 <strong>3초</strong>.
                            </li>
                            <li>새 토스트가 와도 현재 토스트의 최소 1초는 보장.</li>
                            <li>호버 시 일시정지(고정), 호버 해제 시 남은 시간 재개.</li>
                            <li>
                              상세 정보 확장(View details) 시: 자동 닫힘 없음, 사용자 닫기 시 종료.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            전역 패널/알림센터와의 연계
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    사용자 행동
                                  </th>
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    이동/표시
                                  </th>
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    토스트 종료
                                  </th>
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    읽음 처리
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    전역 패널/알림센터 반영
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    본문 클릭
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    리소스 상세(또는 리스트)
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    즉시 닫힘
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-state-success)]">O</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    읽음으로 전환 (패널 목록에서 제거)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    닫기(X)
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">없음</td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    즉시 닫힘
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-state-danger)]">X</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    안읽음 유지
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    시간 만료 (1~3초)
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">없음</td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    자동 닫힘
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-state-danger)]">X</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    안읽음 유지
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    View details (실패)
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    인라인 상세 확장 + 핀 고정
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    사용자 닫을 때까지 유지
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-state-danger)]">X</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    안읽음 유지
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 4. 시나리오 예시 */}
                  <VStack gap={3}>
                    <Label>4. 시나리오 예시</Label>
                    <VStack gap={4}>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            시나리오 1 — &quot;성공 알림을 즉시 따라가서 확인&quot;
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                            상황: 사용자가 인스턴스 1개를 삭제한다.
                          </p>
                          <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              삭제 실행 직후, 우측 상단에 성공 토스트가 뜬다 (최소 1초, 최대 3초).
                            </li>
                            <li>사용자는 토스트 본문을 클릭한다.</li>
                            <li>앱이 해당 인스턴스 리스트 화면으로 이동해 결과를 확인한다.</li>
                            <li>
                              이후 전역 알림 패널을 열어보면 방금 건이 없다 (읽은 알림이기 때문).
                            </li>
                          </ol>
                          <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm text-[var(--color-text-subtle)]">
                              토스트: 즉시 닫힘 / 전역 패널: 목록에서 제거(읽음) / 알림센터: 읽음
                              처리 기록(3일 보관)
                            </p>
                          </div>
                        </VStack>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            시나리오 2 — &quot;실패 원인을 토스트에서 펼쳐보고, 나중에 처리&quot;
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                            상황: IAM 권한 변경이 실패했다.
                          </p>
                          <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>실패 토스트가 뜬다 (최소 1초 보장).</li>
                            <li>
                              사용자는 토스트의 View details를 눌러 오류 코드/메시지를 인라인 확장해
                              원인을 확인한다.
                            </li>
                            <li>다른 UI를 조작해야 해서 토스트를 그대로 둔다 (핀 고정).</li>
                            <li>View details를 닫거나 X로 닫아 토스트를 치운다.</li>
                            <li>
                              나중에 전역 알림 패널에서 같은 실패 알림을 읽음 처리하거나, 알림
                              클릭으로 리소스 화면으로 이동해 재시도.
                            </li>
                          </ol>
                          <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm text-[var(--color-text-subtle)]">
                              토스트: View details 확장 중 고정, 닫기 전 자동 종료 없음 / 전역 패널:
                              안읽음 유지 / 알림센터: 안읽음으로 추적 가능
                            </p>
                          </div>
                        </VStack>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            시나리오 3 — &quot;여러 알림이 쌓일 때, 패널에서 모아서 보고 정리&quot;
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                            상황: 사용자가 여러 앱에서 작업 중이고 알림이 연쇄적으로 발생한다.
                          </p>
                          <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>전역 알림 패널을 연 상태로 작업한다.</li>
                            <li>
                              작업 도중 성공/실패 알림이 계속 도착하지만, 패널이 열려 있어 토스트는
                              뜨지 않는다.
                            </li>
                            <li>
                              급한 실패 1건은 알림 자체 클릭으로 바로 리소스 화면 이동 (읽음).
                            </li>
                            <li>나머지 실패 알림은 &apos;전체 읽음&apos;으로 일괄 정리한다.</li>
                          </ol>
                          <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm text-[var(--color-text-subtle)]">
                              패널: 새 안읽음 알림 실시간 상단 추가, 클릭/읽음 처리 시 즉시 제거 /
                              토스트: 패널 오픈 시 억제 / 알림센터: 읽음/전체 읽음 동기 반영(3일
                              보관)
                            </p>
                          </div>
                        </VStack>
                      </div>
                    </VStack>
                  </VStack>
                </VStack>
              </Section>

              {/* Global notification panel Section */}
              <Section
                id="global-notification-panel"
                title="Global notification panel"
                description="Desktop-level panel that aggregates unread notifications from all apps"
              >
                <VStack gap={8}>
                  {/* 1. 개요 */}
                  <VStack gap={3}>
                    <Label>1. 개요</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              전역 알림 패널은 모든 앱의 <strong>&apos;안읽은(unread)&apos;</strong>{' '}
                              알림을 한곳에서 모아 보여주는 데스크탑 레벨 보조 뷰입니다.
                            </li>
                            <li>
                              기록 저장소는 각 앱의 알림센터이며, 전역 패널은 안 읽음 상태의 알림을
                              미러링합니다.
                            </li>
                            <li>
                              빠른 인지, 정리(읽음 처리), 상세 내용 확인, 리소스 이동을 위한{' '}
                              <strong>진입점</strong>입니다.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            토스트/알림센터와의 관계
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    레이어
                                  </th>
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    역할
                                  </th>
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    기록
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    동작
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    토스트
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    즉시 인지
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">X</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    노출 1~3초(최소 1초 보장), 호버 시 일시정지. 실패에는 View
                                    details 제공(읽음 아님).
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    전역 알림 패널
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    모든 앱의 &apos;안읽은&apos; 알림 목록(미러)
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">X</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    필터 없음, 최신순 정렬. 개별/전체 읽음 제공. 카드 클릭=리소스
                                    이동+읽음. 패널 열려 있으면 토스트 억제.
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    앱 알림센터
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    원본 기록/상세 확인
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">O</td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    개별/전체 읽음 제공, 실패 상세(View details) 제공(읽음 아님),
                                    3일 자동 삭제.
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            적용 기준
                          </h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              전역 패널은 <strong>&quot;최근 안읽음 알림&quot;</strong>이 존재할
                              때만 표시합니다.
                            </li>
                            <li>안읽음 알림이 없는 앱은 표시되지 않습니다.</li>
                            <li>
                              앱 내부 알림센터에서 읽음 처리되거나 보관 기간(3일) 만료 시 전역
                              패널에서도 보이지 않습니다.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            읽음 처리 기준 (패널 관점)
                          </h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>알림 카드 본문 클릭</strong> → 리소스 이동 + 읽음
                            </li>
                            <li>
                              <strong>개별 &apos;읽음&apos; 버튼 클릭</strong> → 읽음
                            </li>
                            <li>
                              <strong>상단 &apos;전체 읽음&apos;</strong> → 현재 보이는 목록 범위
                              일괄 읽음
                            </li>
                            <li>
                              토스트의 View details, 닫기(X), 자동 만료는 읽음 아님 → 패널에 남음
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 2. 구성 요소 */}
                  <VStack gap={3}>
                    <Label>2. 구성 요소</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          전역 알림 패널 아이콘
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)]">
                          클릭 시 알림 패널 열림/닫힘.
                        </p>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          알림 패널
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>외부 영역 클릭 시 패널 닫힘</li>
                          <li>최대 높이 = 데스크탑 UI 높이, 초과 시 내부 스크롤</li>
                          <li>알림은 앱별로 그룹화되어 노출</li>
                          <li>가장 최근에 알림이 온 순서로 정렬 (위→아래)</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          앱별 헤더
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>앱 아이콘 + 타이틀</li>
                          <li>안 읽은 알림 개수 뱃지 형태로 표시</li>
                          <li>
                            <strong>Show more</strong> — 알림 1개 이상일 때 노출, 클릭 시 전체 알림
                            열림
                          </li>
                          <li>
                            <strong>Show less</strong> — 전체 알림이 열렸을 때 노출, 클릭 시 최신
                            알림 1개만 노출
                          </li>
                          <li>
                            <strong>전체 읽음 처리 버튼</strong> — 호버 시 툴팁 &quot;Mark all as
                            read&quot;, 클릭 시 모든 알림 읽음 + 제거
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          개별 알림
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                          <li>알림센터의 알림과 동일한 구성</li>
                          <li>읽음 처리 버튼 클릭 시 즉시 전역 패널에서 제거</li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* 3. 가이드라인 */}
                  <VStack gap={3}>
                    <Label>3. 가이드라인</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            표시/동기화
                          </h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>전역 패널은 알림센터의 안읽음 목록을 미러링합니다.</li>
                            <li>
                              패널 오픈 중 새 알림은 <strong>실시간 상단 추가</strong>됩니다.
                            </li>
                            <li>알림센터에서 읽음/만료 → 패널에서 동기 제거됩니다.</li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            상호작용
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-body-sm border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--color-border-default)]">
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    사용자 행동
                                  </th>
                                  <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                                    결과
                                  </th>
                                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                                    패널 반영
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    카드 본문 클릭
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    리소스 이동 + 읽음
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    해당 알림 제거 + 패널 닫힘
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    View details 클릭
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    알림 상세 영역 확장
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    안 읽음 상태 유지 (패널에 남음)
                                  </td>
                                </tr>
                                <tr className="border-b border-[var(--color-border-subtle)]">
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    개별 읽음 버튼
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    읽음 처리
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    목록에서 즉시 제거
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                                    전체 읽음
                                  </td>
                                  <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                                    현재 보이는 목록 일괄 읽음
                                  </td>
                                  <td className="py-2 text-[var(--color-text-muted)]">
                                    모든 알림 제거
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 4. 시나리오 예시 */}
                  <VStack gap={3}>
                    <Label>4. 시나리오 예시</Label>
                    <VStack gap={4}>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            시나리오 A — &quot;토스트를 놓쳤지만, 패널에서 확인하고 바로
                            이동/정리&quot;
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                            상황: 인스턴스 삭제 성공 토스트가 자동 만료 (읽음 아님).
                          </p>
                          <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>전역 알림 패널을 연다 (필터 없음, 최신순).</li>
                            <li>방금 알림을 카드 본문 클릭 → 리소스 상세로 이동 (읽음).</li>
                            <li>패널을 다시 열면 해당 항목은 사라져 있음.</li>
                          </ol>
                          <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm text-[var(--color-text-subtle)]">
                              정책 포인트: 본문 클릭 = 읽음, 패널은 모든 안읽음 미러라 읽음 항목은
                              제거.
                            </p>
                          </div>
                        </VStack>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            시나리오 B — &quot;폭주 상황: 패널 오픈 → 토스트 억제, 일괄/개별
                            읽음으로 빠르게 정리&quot;
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                            상황: 대량 작업으로 알림 다수 발생.
                          </p>
                          <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>전역 알림 패널을 연 상태로 작업을 계속한다.</li>
                            <li>새 알림은 토스트 없이 패널 상단에 실시간 추가된다.</li>
                            <li>
                              긴급한 1~2건은 개별 알림 클릭으로 바로 리소스 화면 열림 + 패널 닫힘 +
                              읽음.
                            </li>
                            <li>나머지는 &apos;전체 읽음 처리&apos;로 한 번에 정리한다.</li>
                          </ol>
                          <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm text-[var(--color-text-subtle)]">
                              정책 포인트: 패널 오픈 중 토스트 억제, 전체 읽음 = 현재 보이는 목록
                              범위.
                            </p>
                          </div>
                        </VStack>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            시나리오 C — &quot;실패는 코드 확인은 나중에: 패널에서 식별 → 읽음
                            버튼으로 정리&quot;
                          </h4>
                          <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                            상황: 실패 알림 다수가 섞여 있음.
                          </p>
                          <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>패널에서 Error 아이콘을 통해 실패 알림을 빠르게 스캔한다.</li>
                            <li>
                              지금 당장 조치하지 않을 실패는 &apos;개별 읽음 처리&apos;로 정리
                              (리디렉션 없음).
                            </li>
                            <li>
                              코드 확인이 필요할 때는 앱 내부 알림센터에서 Error 탭으로 이동해
                              원하는 알림을 찾는다.
                            </li>
                            <li>View details로 오류 코드를 확인한다.</li>
                          </ol>
                          <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm text-[var(--color-text-subtle)]">
                              정책 포인트: 패널에서 개별 읽음 버튼으로 비이동 정리가 가능.
                            </p>
                          </div>
                        </VStack>
                      </div>
                    </VStack>
                  </VStack>
                </VStack>
              </Section>

              {/* CSV file download Section */}
              <Section
                id="csv-download"
                title="CSV file download"
                description="Download list data as CSV files from resource list pages"
              >
                <VStack gap={8}>
                  {/* 1. 개요 */}
                  <VStack gap={3}>
                    <Label>1. 개요</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <p className="text-body-md text-[var(--color-text-muted)]">
                        리스트 화면에서 제공하는 다운로드(Download) 기능은 사용자가 화면에 표시된
                        데이터를 <strong>CSV 형태</strong>로 저장 및 공유할 수 있도록 지원합니다.
                      </p>
                    </div>
                  </VStack>

                  {/* 2. CSV 파일 구조 */}
                  <VStack gap={3}>
                    <Label>2. CSV 파일 구조</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-body-sm border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)] w-[160px]">
                              항목
                            </th>
                            <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                              규칙
                            </th>
                            <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                              비고
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              포맷
                            </td>
                            <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">CSV</td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">—</td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              파일명 규칙
                            </td>
                            <td className="py-2.5 pr-4">
                              <code className="text-body-sm text-[var(--color-action-primary)] bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                                {'{{resource_name}}_{{YYYYMMDD}}_{{HH:MM}}.csv'}
                              </code>
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">—</td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              포함 컬럼
                            </td>
                            <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">
                              해당 리소스의 <strong>전체 컬럼</strong>
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">
                              테이블 속성에서 보이는/숨겨진 컬럼에 상관없이 전체 컬럼 데이터가
                              추출됩니다.
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              포함 데이터
                            </td>
                            <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">
                              검색/필터 조건이 적용된 <strong>전체 데이터 세트</strong>
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">
                              조건이 없으면 모든 데이터, 조건이 있으면 해당 데이터만 추출
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              빈 상태
                            </td>
                            <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">
                              컬럼 헤더만 포함된 빈 CSV 파일 생성
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">
                              생성된 리소스가 없거나 조건에 부합한 리소스가 없을 때
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              대용량 파일
                            </td>
                            <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">
                              <strong>zip 파일</strong>로 압축하여 제공
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">
                              로우 수(아이템 개수)가 <strong>10,000건 초과</strong> 시 대용량 파일로
                              분류
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </VStack>

                  {/* 필터 적용 시 동작 */}
                  <VStack gap={3}>
                    <Label>필터/검색 적용 시 동작</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          필터/검색 조건 없음
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            현재 존재하는 <strong>모든 데이터</strong>가 추출됩니다.
                          </li>
                          <li>별도 확인 모달 없이 즉시 다운로드됩니다.</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          필터/검색 조건 있음
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>해당 조건에 해당하는 데이터만 추출됩니다.</li>
                          <li>
                            조건에 해당하는 데이터만 다운로드된다는 <strong>확인 모달</strong>이
                            노출됩니다.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </VStack>

                  {/* 실패 처리 */}
                  <VStack gap={3}>
                    <Label>실패 처리</Label>
                    <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                      <p className="text-body-sm text-[var(--color-text-muted)]">
                        다운로드 실패 시 토스트 메시지:
                      </p>
                      <code className="text-body-sm text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)] px-2 py-1 rounded-[var(--radius-sm)] mt-1 inline-block">
                        {'Failed to download the {resource_name} list'}
                      </code>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Floating card Section */}
              <Section
                id="floating-card"
                title="Floating card"
                description="Floating summary card for create/edit flows with sections, quota, and actions"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">개요</h4>
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            Create/Edit 페이지의 우측에 고정되어 입력 진행 상태와 요약 정보를
                            제공하는 카드입니다. 사용자가 전체 구성을 한눈에 파악하고, 리소스
                            할당량(Quota)을 실시간으로 확인할 수 있습니다.
                          </p>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            구성 요소
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>Configuration</strong>: 각 섹션/탭의 입력 완료 상태를 아이콘과
                              라벨로 표시합니다.
                            </li>
                            <li>
                              <strong>Quota</strong>: 현재 사용량 대비 할당량을 프로그레스 바로
                              시각화합니다. 초과 시 danger 색상.
                            </li>
                            <li>
                              <strong>Summary</strong>: 사용자가 입력한 주요 설정값을 요약
                              표시합니다.
                            </li>
                            <li>
                              <strong>버튼 영역</strong>: Cancel(secondary)과 Create(primary) 버튼을
                              하단에 고정 배치합니다.
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            동작 규칙
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              스크롤 시에도 Floating card는 우측에 고정(sticky) 상태를 유지합니다.
                            </li>
                            <li>입력값 변경 시 실시간으로 Summary와 Quota가 업데이트됩니다.</li>
                            <li>
                              Create 클릭 시 전체 탭/섹션에 대한 Global Validation을 수행합니다.
                            </li>
                            <li>
                              Validation 오류 시 해당 섹션으로 자동 스크롤하고 오류를 표시합니다.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Basic Example - QuotaSidebar Style */}
                  <VStack gap={4}>
                    <Label>Basic Example (QuotaSidebar from Create Instance)</Label>
                    <div className="relative bg-[var(--color-surface-subtle)] p-6 rounded-lg">
                      {/* QuotaSidebar Container */}
                      <div className="w-[var(--wizard-summary-width)] shrink-0">
                        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
                          {/* Summary Card */}
                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
                            <VStack gap={3}>
                              <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                                Summary
                              </h5>
                              <div className="flex flex-col">
                                {/* Launch type - done */}
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Launch type
                                  </span>
                                  <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                                    <IconCheck size={10} stroke={2.5} className="text-white" />
                                  </div>
                                </div>
                                {/* Basic information - done */}
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Basic information
                                  </span>
                                  <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                                    <IconCheck size={10} stroke={2.5} className="text-white" />
                                  </div>
                                </div>
                                {/* Source - done */}
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Source
                                  </span>
                                  <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                                    <IconCheck size={10} stroke={2.5} className="text-white" />
                                  </div>
                                </div>
                                {/* Flavor - active */}
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Flavor
                                  </span>
                                  <div
                                    className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-text-muted)] animate-spin"
                                    style={{ borderStyle: 'dashed', animationDuration: '2s' }}
                                  />
                                </div>
                                {/* Network - pre */}
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Network
                                  </span>
                                  <div
                                    className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
                                    style={{ borderStyle: 'dashed' }}
                                  />
                                </div>
                                {/* Authentication - pre */}
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Authentication
                                  </span>
                                  <div
                                    className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
                                    style={{ borderStyle: 'dashed' }}
                                  />
                                </div>
                                {/* Advanced - pre */}
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Advanced
                                  </span>
                                  <div
                                    className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
                                    style={{ borderStyle: 'dashed' }}
                                  />
                                </div>
                              </div>
                            </VStack>
                          </div>

                          {/* Quota Card */}
                          <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
                            <VStack gap={3}>
                              <h5 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                                Quota
                              </h5>
                              <VStack gap={3}>
                                <ProgressBar
                                  variant="quota"
                                  label="Instance"
                                  value={3}
                                  max={10}
                                  newValue={1}
                                  showValue
                                />
                                <ProgressBar
                                  variant="quota"
                                  label="vCPU"
                                  value={7}
                                  max={20}
                                  newValue={2}
                                  showValue
                                />
                                <ProgressBar
                                  variant="quota"
                                  label="RAM (GiB)"
                                  value={18}
                                  max={50}
                                  newValue={4}
                                  showValue
                                />
                                <ProgressBar
                                  variant="quota"
                                  label="Disk"
                                  value={3}
                                  max={10}
                                  newValue={1}
                                  showValue
                                />
                                <ProgressBar
                                  variant="quota"
                                  label="Disk capacity (GiB)"
                                  value={70}
                                  max={1000}
                                  newValue={50}
                                  showValue
                                />
                              </VStack>
                            </VStack>
                          </div>

                          {/* Number of Instances */}
                          <VStack gap={2}>
                            <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                              Number of Instances
                            </label>
                            <NumberInput value={1} onChange={() => {}} min={1} max={10} fullWidth />
                          </VStack>

                          {/* Action Buttons */}
                          <HStack gap={2}>
                            <Button
                              variant="secondary"
                              onClick={() => console.log('Cancel')}
                              className="w-[80px]"
                            >
                              Cancel
                            </Button>
                            <Button variant="primary" disabled className="flex-1">
                              Create
                            </Button>
                          </HStack>
                        </div>
                      </div>
                    </div>
                  </VStack>

                  {/* Status Icons */}
                  <VStack gap={4}>
                    <Label>Status icons</Label>
                    <div className="flex gap-4 items-center p-4 bg-[var(--color-surface-subtle)] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-4 rounded-full border border-[var(--color-border-default)]"
                          style={{ borderStyle: 'dashed' }}
                        />
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                          Default
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconProgress
                          size={16}
                          stroke={1.5}
                          className="text-[var(--color-text-muted)]"
                        />
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                          Processing
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] flex items-center justify-center">
                          <IconAlertTriangle size={10} stroke={2} className="text-white" />
                        </div>
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                          Warning
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] flex items-center justify-center">
                          <IconCheck size={10} stroke={2} className="text-white" />
                        </div>
                        <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                          Success
                        </span>
                      </div>
                    </div>
                  </VStack>

                  {/* Props Reference */}
                  <VStack gap={4}>
                    <Label>Props reference</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-12)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Prop
                            </th>
                            <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Type
                            </th>
                            <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Default
                            </th>
                            <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              title
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">required</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Card title in summary section
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              sections
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              FloatingCardSection[]
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">[]</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Collapsible sections with items
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              quota
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              QuotaItem[]
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">[]</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Quota progress bars
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              position
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                              FloatingCardPosition
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">'top-left'</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Position when portal is true
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              portal
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Render in portal (fixed position)
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              actionEnabled
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">false</td>
                            <td className="py-2 text-[var(--color-text-default)]">
                              Enable primary action button
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">
                              width
                            </td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                            <td className="py-2 pr-4 text-[var(--color-text-muted)]">'320px'</td>
                            <td className="py-2 text-[var(--color-text-default)]">Card width</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Shell Section */}
              <Section
                id="shell"
                title="Shell"
                description="Web-based virtual terminal environment for controlling app resources"
              >
                <VStack gap={8}>
                  {/* 1. 개요 */}
                  <VStack gap={3}>
                    <Label>1. 개요</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            핵심 컨셉
                          </h4>
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            앱 내 리소스를 제어하기 위한{' '}
                            <strong>웹 기반의 가상 터미널(Shell) 환경</strong>으로, 로컬 터미널과
                            최대한 유사한 사용 경험을 제공하되, 웹 환경 최적화 조건을 포함합니다.
                          </p>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            서비스별 역할 (Container)
                          </h4>
                          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                            <li>컨테이너 내부 접근 (kubectl 실행)</li>
                            <li>클러스터/네임스페이스/파드 단위의 운영 명령 실행</li>
                            <li>
                              View Log — kubectl get pod 명령의 출력 결과 표시 (명령줄 입력은 불가)
                            </li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            디자인 목표
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1">
                                친숙함
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                Bash/Zsh 기반 CLI 사용 경험을 최대한 유지
                              </p>
                            </div>
                            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1">
                                안전성
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                웹 환경에서의 오작동, 권한 남용 방지
                              </p>
                            </div>
                            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1">
                                맥락성
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                현재 선택된 리소스(Context)가 쉽게 인지되도록 설계
                              </p>
                            </div>
                          </div>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 2. 진입 및 실행 정책 */}
                  <VStack gap={3}>
                    <Label>2. 진입 및 실행 정책</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-body-sm border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)] w-[180px]">
                              항목
                            </th>
                            <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                              정책
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              Shell 실행 방법
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">
                              <strong>Action</strong>: 앱 내 특정 리소스 선택 후 Shell 열기 액션 /
                              <strong> Cluster Utility</strong>: Top Navigation Bar의 Kubectl Shell
                              열기
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              세션 범위
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">
                              선택된 리소스 컨텍스트에 종속. 같은 윈도우에서 하나의 리소스에 대해
                              하나의 Shell만 실행 가능. 각 세션은 독립적인 입력/출력 스트림 유지.
                            </td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              명령 이력 관리
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">
                              세션 단위 히스토리 유지. 세션 종료 시 히스토리 폐기.
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                              세션 유지 정책
                            </td>
                            <td className="py-2.5 text-[var(--color-text-muted)]">
                              네트워크 단절 시 자동 재연결 시도. 단절 후 일정 시간(default: 300초)
                              초과 시 세션 만료 처리.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </VStack>

                  {/* 3. 화면 구성 요소 */}
                  <VStack gap={3}>
                    <Label>3. 화면 구성 요소</Label>
                    <VStack gap={4}>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-2">
                          헤더 영역
                        </h4>
                        <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>현재 연결 정보 표시</strong> — resourceName을 탭에 표시. 헤더의
                            세션 타이틀은 &apos;세션을 연 원래 리소스&apos;로 고정 (터널링/포트
                            포워딩으로 다른 리소스에 접속해도 첫 번째 리소스 이름 유지).
                          </li>
                          <li>
                            <strong>새 탭으로 보기 기능</strong> — 분할 패널에서 개별 탭으로 전환.
                          </li>
                          <li>
                            <strong>세션 종료 버튼</strong> — 현재 Shell 세션 종료.
                          </li>
                        </ol>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-2">
                          메인 터미널 영역
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>텍스트 입력 및 출력 환경</li>
                          <li>Monospace 폰트 사용</li>
                          <li>표준 터미널 컬러 스킴 지원</li>
                          <li>스크롤 가능 (명령 이력 유지)</li>
                        </ul>
                        <div className="mt-2 p-2 bg-[var(--color-state-warning-bg)] rounded-[var(--radius-sm)]">
                          <p className="text-body-sm text-[var(--color-state-warning)]">
                            Log Viewer (View Log) 기능의 경우 GUI 스타일만 동일하며, 메인 터미널
                            영역의 입력은 불가. 데이터 출력 결과만 표시.
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-2">
                          하단 영역 (Option)
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                              Select box
                            </p>
                            <p className="text-body-sm text-[var(--color-text-muted)]">
                              접속 대상 리소스 선택 (Container 서비스의 경우 접속 대상 Container
                              선택)
                            </p>
                          </div>
                          <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                              Clear
                            </p>
                            <p className="text-body-sm text-[var(--color-text-muted)]">
                              Shell 초기화 (세션은 유지)
                            </p>
                          </div>
                          <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                              Download
                            </p>
                            <p className="text-body-sm text-[var(--color-text-muted)]">
                              리소스 생성 후 전체 기간의 로그 다운로드 (View Log 기능 한정)
                            </p>
                          </div>
                          <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                              연결 상태 표시
                            </p>
                            <p className="text-body-sm text-[var(--color-text-muted)]">
                              <span className="text-[var(--color-state-success)]">Connected</span> /
                              <span className="text-[var(--color-state-warning)]"> Connecting</span>{' '}
                              /
                              <span className="text-[var(--color-state-danger)]">
                                {' '}
                                Disconnected
                              </span>
                            </p>
                          </div>
                          <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                              Duration
                            </p>
                            <p className="text-body-sm text-[var(--color-text-muted)]">
                              로그 View 범위 선택 기능 (View Log 기능 한정)
                            </p>
                          </div>
                        </div>
                      </div>
                    </VStack>
                  </VStack>

                  {/* 4. UI 작동 방식 */}
                  <VStack gap={3}>
                    <Label>4. UI 작동 방식</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          분할 패널 View (기본)
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>Shell 실행 시 기본 보기 방식</li>
                          <li>높이: 최소 300px ~ (콘텐츠 영역 높이 - 100px), default 300px</li>
                          <li>헤더 영역의 Resize Handle로 높이 조절 가능</li>
                          <li>너비: 사이드 내비게이션 바 이후부터 최대 너비로 고정</li>
                          <li>
                            다른 메뉴 클릭 시 Shell 및 분할 패널은{' '}
                            <strong>하단에 그대로 유지</strong>
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                          탭 View (새 탭으로 보기)
                        </h4>
                        <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>분할 패널에서 새 탭으로 보기 클릭 시 앱 내 개별 탭으로 실행</li>
                          <li>크기: 사이드 메뉴, 탭바 영역을 초과하지 않는 범위에서 Full size</li>
                          <li>
                            다른 메뉴 클릭 시 해당 페이지로 이동하며 <strong>Shell 종료</strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
                      <p className="text-body-sm text-[var(--color-text-muted)]">
                        <strong>입력 정책:</strong> 키보드 중심 인터랙션. 마우스 선택 및 복사 허용.
                      </p>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Layout Section */}
              <Section
                id="layout"
                title="Layout"
                description="Application layout structure with responsive sidebar"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={4}>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            레이아웃 구조
                          </h4>
                          <p className="text-body-md text-[var(--color-text-muted)]">
                            PageShell이 전체 페이지를 래핑하며, Sidebar + TabBar + TopBar + Content
                            영역으로 구성됩니다. 하단에는 Shell Panel(터미널)이 선택적으로
                            표시됩니다.
                          </p>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            사이드바 정책
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>펼침 상태</strong>: 너비 200px (
                              <code>--layout-sidebar-width</code>). 메뉴 아이콘 + 라벨 표시.
                            </li>
                            <li>
                              <strong>접힘 상태</strong>: 사이드바가 완전히 숨겨집니다.
                            </li>
                            <li>사이드바 토글은 사이드바 하단 또는 TopBar에서 제공합니다.</li>
                          </ul>
                        </VStack>
                        <VStack gap={2}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            콘텐츠 영역 정책
                          </h4>
                          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                            <li>
                              <strong>최소 너비</strong>: 콘텐츠 영역의 최소 너비를 보장하여
                              레이아웃이 깨지지 않도록 합니다.
                            </li>
                            <li>
                              <strong>패딩</strong>: 상단 16px (pt-4), 좌우 32px (px-8), 하단 80px
                              (pb-20).
                            </li>
                            <li>
                              <strong>리스트 페이지</strong>: 최소 너비 1176px 적용.
                            </li>
                          </ul>
                        </VStack>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Layout Specs */}
                  <VStack gap={4}>
                    <Label>Layout specifications</Label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[length:var(--font-size-12)]">
                        <thead>
                          <tr className="border-b border-[var(--color-border-default)]">
                            <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Breakpoint
                            </th>
                            <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Width
                            </th>
                            <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Sidebar
                            </th>
                            <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                              Content Area
                            </th>
                            <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">
                              Features
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">
                              Desktop (Default)
                            </td>
                            <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">
                              1920px
                            </td>
                            <td className="py-3 pr-4 text-[var(--color-text-default)]">
                              200px (collapsible)
                            </td>
                            <td className="py-3 pr-4 text-[var(--color-text-muted)]">1720px max</td>
                            <td className="py-3 text-[var(--color-text-muted)]">Sidebar toggle</td>
                          </tr>
                          <tr className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">
                              Laptop (Min)
                            </td>
                            <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">
                              1440px
                            </td>
                            <td className="py-3 pr-4 text-[var(--color-text-default)]">
                              200px (collapsible)
                            </td>
                            <td className="py-3 pr-4 text-[var(--color-text-muted)]">1240px max</td>
                            <td className="py-3 text-[var(--color-text-muted)]">Sidebar toggle</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </VStack>

                  {/* Visual Diagram - Desktop */}
                  <VStack gap={4}>
                    <Label>Desktop Layout (1920px)</Label>
                    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-muted)]">
                      <div className="flex h-[200px]">
                        {/* Sidebar */}
                        <div className="w-[52px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
                          <div className="p-2 border-b border-[var(--color-border-subtle)]">
                            <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
                              <span className="text-[6px] font-bold text-white">TDS</span>
                            </div>
                          </div>
                          <div className="flex-1 p-2 space-y-1">
                            <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                            <div className="h-2 bg-[var(--color-action-primary)] rounded opacity-50" />
                            <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                            <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                          </div>
                          <div className="p-2 border-t border-[var(--color-border-subtle)] flex justify-center">
                            <IconChevronLeft size={12} className="text-[var(--color-text-muted)]" />
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-4 flex flex-col gap-3">
                          <div className="h-4 w-32 bg-[var(--color-surface-default)] rounded" />
                          <div className="flex-1 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-3">
                            <div className="space-y-2">
                              <div className="h-2 bg-[var(--color-border-subtle)] rounded w-3/4" />
                              <div className="h-2 bg-[var(--color-border-subtle)] rounded w-1/2" />
                              <div className="h-2 bg-[var(--color-border-subtle)] rounded w-2/3" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Dimensions */}
                      <div className="flex border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                        <div className="w-[52px] py-2 text-center border-r border-[var(--color-border-default)]">
                          <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-action-primary)]">
                            200px
                          </span>
                        </div>
                        <div className="flex-1 py-2 text-center">
                          <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-muted)]">
                            Content Area (1720px max)
                          </span>
                        </div>
                      </div>
                    </div>
                  </VStack>

                  {/* Visual Diagram - Laptop */}
                  <VStack gap={4}>
                    <Label>Laptop Layout (1440px)</Label>
                    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-muted)] max-w-[600px]">
                      <div className="flex h-[160px]">
                        {/* Sidebar */}
                        <div className="w-[42px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
                          <div className="p-1.5 border-b border-[var(--color-border-subtle)]">
                            <div className="w-5 h-5 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
                              <span className="text-[5px] font-bold text-white">TDS</span>
                            </div>
                          </div>
                          <div className="flex-1 p-1.5 space-y-1">
                            <div className="h-1.5 bg-[var(--color-surface-muted)] rounded" />
                            <div className="h-1.5 bg-[var(--color-action-primary)] rounded opacity-50" />
                            <div className="h-1.5 bg-[var(--color-surface-muted)] rounded" />
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-3 flex flex-col gap-2">
                          <div className="h-3 w-24 bg-[var(--color-surface-default)] rounded" />
                          <div className="flex-1 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-2">
                            <div className="space-y-1.5">
                              <div className="h-1.5 bg-[var(--color-border-subtle)] rounded w-3/4" />
                              <div className="h-1.5 bg-[var(--color-border-subtle)] rounded w-1/2" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Dimensions */}
                      <div className="flex border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                        <div className="w-[42px] py-1.5 text-center border-r border-[var(--color-border-default)]">
                          <span className="text-[length:var(--font-size-9)] font-mono text-[var(--color-action-primary)]">
                            200px
                          </span>
                        </div>
                        <div className="flex-1 py-1.5 text-center">
                          <span className="text-[length:var(--font-size-9)] font-mono text-[var(--color-text-muted)]">
                            Content (1240px max)
                          </span>
                        </div>
                      </div>
                    </div>
                  </VStack>

                  {/* Sidebar Toggle States */}
                  <VStack gap={4}>
                    <Label>Sidebar states</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Expanded */}
                      <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
                        <div className="flex h-[120px] bg-[var(--color-surface-muted)]">
                          <div className="w-[60px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] p-2">
                            <div className="space-y-2">
                              <div className="h-2 bg-[var(--color-action-primary)] rounded opacity-50" />
                              <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                              <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                            </div>
                          </div>
                          <div className="flex-1 p-3">
                            <div className="h-full bg-[var(--color-surface-default)] rounded" />
                          </div>
                        </div>
                        <div className="p-2 bg-[var(--color-surface-default)] border-t border-[var(--color-border-default)] text-center">
                          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)]">
                            Sidebar Expanded
                          </span>
                        </div>
                      </div>
                      {/* Collapsed */}
                      <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
                        <div className="flex h-[120px] bg-[var(--color-surface-muted)]">
                          <div className="w-0 bg-[var(--color-surface-default)] overflow-hidden transition-all" />
                          <div className="flex-1 p-3">
                            <div className="h-full bg-[var(--color-surface-default)] rounded flex items-start p-2">
                              <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center cursor-pointer">
                                <IconMenu2 size={12} className="text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 bg-[var(--color-surface-default)] border-t border-[var(--color-border-default)] text-center">
                          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)]">
                            Sidebar Collapsed
                          </span>
                        </div>
                      </div>
                    </div>
                  </VStack>

                  {/* CSS Variables */}
                  <VStack gap={3}>
                    <Label>Layout tokens</Label>
                    <pre className="text-[length:var(--font-size-11)] p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto text-[var(--color-text-muted)]">
                      {`/* Layout Variables */
--layout-max-width: 1920px;      /* Maximum viewport */
--layout-min-width: 1440px;      /* Minimum supported */
--layout-sidebar-width: 200px;            /* Fixed sidebar width */
--layout-sidebar-width-collapsed: 40px;  /* Collapsed state (icons only) */

/* Content Area */
--layout-content-padding: var(--spacing-8);  /* 32px */
--layout-content-max-width: calc(100% - var(--layout-sidebar-width));

/* Responsive behavior */
@media (max-width: 1440px) {
  /* Maintain same structure, content scales */
}`}
                    </pre>
                  </VStack>

                  {/* Notes */}
                  <div className="p-4 bg-[var(--color-state-info-bg)] rounded-[var(--radius-md)]">
                    <div className="text-[length:var(--font-size-12)] text-[var(--color-state-info)]">
                      <strong>📐 Layout Guidelines:</strong>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>Sidebar는 200px 고정, 숨김/표시 토글 가능</li>
                        <li>1920px에서 1440px까지 반응형 지원</li>
                        <li>1440px 미만은 모바일 레이아웃 (추후 확장)</li>
                        <li>Content area는 sidebar 상태에 따라 자동 조절</li>
                      </ul>
                    </div>
                  </div>
                </VStack>
              </Section>

              {/* ============================================
                GRAPHS SECTION
                ============================================ */}

              {/* Library Info */}
              <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-label-sm font-semibold text-[var(--color-text-default)]">
                    Chart Libraries
                  </span>
                </div>
                <div className="text-body-sm text-[var(--color-text-muted)] flex flex-col gap-2">
                  <div>
                    <span className="text-[var(--color-text-subtle)]">Bar chart:</span>{' '}
                    <code className="px-1.5 py-0.5 bg-[var(--color-surface-default)] rounded text-[var(--color-action-primary)]">
                      ProgressBar
                    </code>{' '}
                    - TDS 자체 컴포넌트 (CSS 기반)
                  </div>
                  <div>
                    <span className="text-[var(--color-text-subtle)]">Area / Pie / Doughnut:</span>{' '}
                    <code className="px-1.5 py-0.5 bg-[var(--color-surface-default)] rounded text-[var(--color-action-primary)]">
                      echarts-for-react
                    </code>{' '}
                    - Apache ECharts wrapper for React{' '}
                    <a
                      href="https://echarts.apache.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-action-primary)] hover:underline"
                    >
                      Docs →
                    </a>
                  </div>
                </div>
              </div>

              {/* Chart overview */}
              <Section
                id="chart-overview"
                title="Chart overview"
                description="Chart component guidelines for visualizing system resources and usage status"
              >
                <VStack gap={8}>
                  {/* 1. 개요 */}
                  <VStack gap={3}>
                    <Label>1. 개요</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={3}>
                        <p className="text-body-md text-[var(--color-text-muted)]">
                          Chart는 시스템 리소스 및 사용 현황을 <strong>직관적으로 파악</strong>할 수
                          있도록 시각화하는 컴포넌트입니다. 데스크탑 UI 환경에서{' '}
                          <strong>빠른 상태 인지 + 상세 정보 탐색</strong>을 동시에 지원하는 것을
                          목표로 합니다.
                        </p>
                        <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                          <li>
                            Chart는 <strong>읽기 전용 시각화 컴포넌트</strong>입니다.
                          </li>
                          <li>
                            모든 Chart는{' '}
                            <strong>동일한 색상 규칙, 툴팁 정책, 단위 표기 규칙</strong>을 따릅니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* 2. 공통 규칙 */}
                  <VStack gap={3}>
                    <Label>2. 공통 규칙</Label>
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          색상 상태 규칙
                        </h4>
                        <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                          Bar, Half doughnut chart에 공통으로 적용되는 색상 규칙
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-body-sm border-collapse">
                            <thead>
                              <tr className="border-b border-[var(--color-border-default)]">
                                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                                  상태
                                </th>
                                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                                  기준
                                </th>
                                <th className="text-left py-2 font-medium text-[var(--color-text-subtle)] w-[120px]">
                                  색상
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-[var(--color-border-subtle)]">
                                <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                  Safe
                                </td>
                                <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                  0~69% (낮은 사용량)
                                </td>
                                <td className="py-2">
                                  <span className="inline-flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-[var(--color-state-success)]" />
                                    <span className="text-[var(--color-state-success)]">
                                      초록색
                                    </span>
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-[var(--color-border-subtle)]">
                                <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                  Warning
                                </td>
                                <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                  70~89% (임계 접근)
                                </td>
                                <td className="py-2">
                                  <span className="inline-flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-[var(--color-state-warning)]" />
                                    <span className="text-[var(--color-state-warning)]">
                                      주황색
                                    </span>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                                  Danger
                                </td>
                                <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                  90% 이상 (임계 초과)
                                </td>
                                <td className="py-2">
                                  <span className="inline-flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-[var(--color-state-danger)]" />
                                    <span className="text-[var(--color-state-danger)]">붉은색</span>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-body-sm text-[var(--color-text-subtle)]">
                          서비스별 세부 임계값은 아래 <strong>Status Colors</strong> 섹션의
                          애플리케이션별 정의를 참조하세요.
                        </p>
                      </VStack>
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          텍스트 표시 규칙
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                              퍼센트
                            </h4>
                            <p className="text-body-sm text-[var(--color-text-muted)]">
                              소수점 없이 <strong>정수로 표시</strong> (반올림)
                            </p>
                          </div>
                          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                            <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                              실제 사용량 / 전체 사용량
                            </h4>
                            <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                              <li>
                                표시 방법:{' '}
                                <code className="text-body-sm bg-[var(--color-surface-subtle)] px-1 py-0.5 rounded-[var(--radius-sm)]">
                                  실제 사용량 / 전체 사용량 단위
                                </code>
                              </li>
                              <li>
                                소수점 <strong>둘째자리</strong>까지 표시 (반올림)
                              </li>
                            </ul>
                          </div>
                        </div>
                      </VStack>
                    </VStack>
                  </VStack>

                  {/* 3. 차트 유형별 정책 */}
                  <VStack gap={3}>
                    <Label>3. 차트 유형별 정책</Label>
                    <VStack gap={4}>
                      {/* (Half) Doughnut chart */}
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={3}>
                          <div>
                            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                              (Half) Doughnut chart
                            </h4>
                            <p className="text-body-sm text-[var(--color-text-subtle)]">
                              정책은 동일하고 모양만 디자인적 조화에 따라 선택합니다.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                                목적
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                전체 용량 대비 현재 사용량을 한눈에 인지. 표시해야 할 리소스가{' '}
                                <strong>1개</strong>일 때 사용.
                              </p>
                            </div>
                            <div>
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                                호버 정책
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                호버 시 툴팁 노출 → 데이터 종류, value, percent
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                              구성 요소
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                그래프 타이틀
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                반원형 도넛 그래프
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                중앙 퍼센트 수치
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                사용량 / 전체 용량 텍스트
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                툴팁 (hover)
                              </span>
                            </div>
                          </div>
                        </VStack>
                      </div>

                      {/* Bar chart */}
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={3}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Bar chart
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                                목적
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                전체 용량 대비 현재 사용량을 표시해야 할 리소스가{' '}
                                <strong>많을 때</strong> 사용.
                              </p>
                            </div>
                            <div>
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                                호버 정책
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                호버 시 툴팁 노출 → 데이터 라벨, 데이터 종류, value, percent
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                              구성 요소
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                그래프 타이틀
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                데이터 라벨
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                진행 바
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                사용량/전체 용량 텍스트
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                퍼센트 뱃지
                              </span>
                            </div>
                          </div>
                        </VStack>
                      </div>

                      {/* Line chart */}
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={3}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Line chart
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                                목적
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                시간 흐름에 따라 <strong>변화 추이 파악</strong>이 필요할 때 사용.
                              </p>
                            </div>
                            <div>
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                                호버 정책
                              </p>
                              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                                <li>해당 시간 보조선 표시</li>
                                <li>해당 시점 데이터 포인트 강조</li>
                                <li>툴팁 노출 → 모든 데이터 라벨, value</li>
                                <li>x, y축 위에서는 툴팁 노출하지 않음</li>
                              </ul>
                            </div>
                          </div>
                          <div>
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                              구성 요소
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                그래프 타이틀
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                y축 라벨 (5개 고정, 단위 포함)
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                x축 라벨 (시간)
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                라인 그래프
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                포인트
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                보조선
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                데이터 라벨
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                뷰 토글 버튼
                              </span>
                            </div>
                          </div>
                        </VStack>
                      </div>

                      {/* Pie chart */}
                      <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                        <VStack gap={3}>
                          <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                            Pie chart
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                                목적
                              </p>
                              <p className="text-body-sm text-[var(--color-text-muted)]">
                                1개의 카테고리 내에서 <strong>2개 이상의 데이터 구성 비율</strong>을
                                확인할 때 사용.
                              </p>
                            </div>
                            <div>
                              <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                                호버 정책
                              </p>
                              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                                <li>해당 영역 하이라이트 처리</li>
                                <li>툴팁 노출 → 해당 데이터 라벨, value, percent</li>
                              </ul>
                            </div>
                          </div>
                          <div>
                            <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                              구성 요소
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                그래프 타이틀
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                원형 그래프
                              </span>
                              <span className="px-2 py-1 text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)]">
                                데이터 라벨
                              </span>
                            </div>
                          </div>
                        </VStack>
                      </div>
                    </VStack>
                  </VStack>
                </VStack>
              </Section>

              {/* Status colors */}
              <Section
                id="status-colors"
                title="Status colors"
                description="Shared color thresholds for usage-based charts including bar charts, half-doughnut, and doughnut charts"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          색상 임계값 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>사용률 기반 차트에 공통으로 적용되는 색상 시스템입니다.</li>
                          <li>
                            <strong>Safe</strong> (초록): 사용률 0~69%. 정상 범위.
                          </li>
                          <li>
                            <strong>Warning</strong> (주황): 사용률 70~89%. 주의 필요.
                          </li>
                          <li>
                            <strong>Danger</strong> (빨강): 사용률 90~100%. 위험/임계치 초과.
                          </li>
                          <li>
                            모든 사용률 차트(Bar, Doughnut, Half-Doughnut)에 동일한 임계값을
                            적용합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Applies to */}
                  <VStack gap={3}>
                    <Label>Applies to</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info" size="sm">
                        Bar chart
                      </Badge>
                      <Badge variant="info" size="sm">
                        Half-Doughnut chart
                      </Badge>
                      <Badge variant="info" size="sm">
                        Doughnut chart
                      </Badge>
                    </div>
                  </VStack>

                  {/* Compute thresholds */}
                  <VStack gap={3}>
                    <Label>Compute</Label>
                    <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            0% ~ 69%: Normal
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            70% ~ 89%: Warning
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            90%+: Danger
                          </span>
                        </div>
                      </div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
                        <code>{'thresholds={STATUS_THRESHOLDS.compute}'}</code>
                        <span className="ml-2 text-[var(--color-text-muted)]">
                          {'{ warning: 70, danger: 90 }'}
                        </span>
                      </div>
                    </div>
                  </VStack>

                  {/* Compute Admin thresholds */}
                  <VStack gap={3}>
                    <Label>Compute Admin</Label>
                    <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            0% ~ 69%: Normal
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            70% ~ 99%: Warning
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            100%+: Danger
                          </span>
                        </div>
                      </div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
                        <code>{'thresholds={STATUS_THRESHOLDS.computeAdmin}'}</code>
                        <span className="ml-2 text-[var(--color-text-muted)]">
                          {'{ warning: 70, danger: 100 }'}
                        </span>
                      </div>
                    </div>
                  </VStack>

                  {/* Storage thresholds */}
                  <VStack gap={3}>
                    <Label>Storage</Label>
                    <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            0% ~ 84%: Normal
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            85% ~ 94%: Warning
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            95%+: Danger
                          </span>
                        </div>
                      </div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
                        <code>{'thresholds={STATUS_THRESHOLDS.storage}'}</code>
                        <span className="ml-2 text-[var(--color-text-muted)]">
                          {'{ warning: 85, danger: 95 }'}
                        </span>
                      </div>
                    </div>
                  </VStack>

                  {/* Container thresholds */}
                  <VStack gap={3}>
                    <Label>Container</Label>
                    <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            0% ~ 69%: Normal
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            70% ~ 94%: Warning
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            95%+: Danger
                          </span>
                        </div>
                      </div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
                        <code>{'thresholds={STATUS_THRESHOLDS.container}'}</code>
                        <span className="ml-2 text-[var(--color-text-muted)]">
                          {'{ warning: 70, danger: 95 }'}
                        </span>
                      </div>
                    </div>
                  </VStack>

                  {/* Default thresholds */}
                  <VStack gap={3}>
                    <Label>Default</Label>
                    <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            0% ~ 69%: Normal
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            70% ~ 94%: Warning
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            95%+: Danger
                          </span>
                        </div>
                      </div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
                        <code>{'thresholds={STATUS_THRESHOLDS.default}'}</code>
                        <span className="ml-2 text-[var(--color-text-muted)]">
                          {'{ warning: 70, danger: 95 }'}
                        </span>
                      </div>
                    </div>
                  </VStack>

                  {/* Usage */}
                  <VStack gap={3}>
                    <Label>Usage</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] flex flex-col gap-1">
                      <div>
                        <code>{"import { STATUS_THRESHOLDS } from '@/design-system';"}</code>
                      </div>
                      <div className="mt-1">
                        <code>{'<ProgressBar thresholds={STATUS_THRESHOLDS.compute} ... />'}</code>
                      </div>
                      <div className="mt-2 text-[var(--color-text-muted)]">
                        Available presets: <code>compute</code> · <code>computeAdmin</code> ·{' '}
                        <code>storage</code> · <code>container</code> · <code>default</code>
                      </div>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Gauge bar chart */}
              <Section
                id="gauge-bar-chart"
                title="Gauge bar chart"
                description="Visual indicator for quota usage and progress with status-based colors"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>Quota 표시</strong>: 리소스 할당량 대비 사용량을 시각화합니다
                            (e.g. vCPU 5/10).
                          </li>
                          <li>
                            <strong>Status 색상</strong>: 사용률에 따라 Safe/Warning/Danger 색상이
                            자동 적용됩니다.
                          </li>
                          <li>hover 시 정확한 수치를 tooltip으로 표시합니다.</li>
                          <li>Floating card의 Quota 섹션에서 주로 사용합니다.</li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>height: 4px</code> · <code>radius: pill</code>
                    </div>
                  </VStack>

                  {/* Quota Variant - Status Examples */}
                  <VStack gap={3}>
                    <Label>Quota Variant - Status Based Colors</Label>
                    <div className="w-[var(--search-input-width)] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                      {/* 1. Normal (under 70%) - Green */}
                      <ProgressBar
                        variant="quota"
                        label="Instance"
                        value={2}
                        newValue={0}
                        max={10}
                      />

                      {/* 2. Warning (70-100%) - Orange */}
                      <ProgressBar
                        variant="quota"
                        label="Instance"
                        value={8}
                        newValue={2}
                        max={10}
                      />

                      {/* 3. Used < 70% but total >= 70% - Green + Orange */}
                      <ProgressBar
                        variant="quota"
                        label="Instance"
                        value={5}
                        newValue={2}
                        max={10}
                      />

                      {/* 4. Total exceeds 100% - Red */}
                      <ProgressBar
                        variant="quota"
                        label="Instance"
                        value={8}
                        newValue={5}
                        max={10}
                      />

                      {/* 5. Already over quota - Red */}
                      <ProgressBar
                        variant="quota"
                        label="Instance"
                        value={10}
                        newValue={0}
                        max={10}
                      />

                      {/* 6. Unlimited - Gray */}
                      <ProgressBar variant="quota" label="Instance" value={10} newValue={0} />
                    </div>
                  </VStack>

                  {/* Default Variant - Status Examples */}
                  <VStack gap={3}>
                    <Label>Default Variant - Status Based Colors</Label>
                    <div className="w-[var(--search-input-width)] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                      {/* Normal (under 70%) - Green */}
                      <ProgressBar label="30 MB (30%)" value={30} max={100} showValue={false} />
                      {/* Warning (70-99%) - Orange */}
                      <ProgressBar label="60 MB (75%)" value={75} max={100} showValue={false} />
                      {/* Danger (>=100%) - Red */}
                      <ProgressBar label="100 MB (100%)" value={100} max={100} showValue={false} />
                    </div>
                  </VStack>

                  {/* Dashboard Only */}
                  <VStack gap={3}>
                    <Label>Dashboard only</Label>
                    <div className="w-[288px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl">
                      <div className="text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wide mb-4">
                        COMPUTE QUOTA
                      </div>
                      <div className="space-y-[22px]">
                        <QuotaBarDemo label="vCPU" used={4} total={8} unit="vCPU" />
                        <QuotaBarDemo label="RAM" used={22} total={32} unit="GiB" />
                        <QuotaBarDemo label="Disk" used={4} total={6} unit="GiB" />
                        <QuotaBarDemo label="GPU" used={6} total={8} unit="GPU" />
                        <QuotaBarDemo label="NPU" used={6} total={8} unit="NPU" />
                      </div>
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Area chart */}
              <Section
                id="area-chart"
                title="Area chart"
                description="Filled area visualization for volume and cumulative data"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>시계열 데이터</strong>: CPU/Memory/Network 사용량 등 시간에 따른
                            변화를 시각화합니다.
                          </li>
                          <li>
                            <strong>Stacked</strong>: 여러 항목의 누적 합을 표시할 때 Stacked 모드를
                            사용합니다.
                          </li>
                          <li>
                            <strong>빈 데이터</strong>: 데이터가 없는 구간은 &quot;No data&quot;
                            메시지를 표시합니다.
                          </li>
                          <li>hover 시 해당 시점의 정확한 값을 tooltip으로 표시합니다.</li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>fill-opacity: 0.1</code> · <code>line-width: 1px</code> ·{' '}
                      <code>smooth: true</code> · <code>symbol-size: 6px</code>
                    </div>
                  </VStack>

                  {/* Basic Area chart */}
                  <VStack gap={3}>
                    <Label>Basic Area chart</Label>
                    <AreaChartDemo variant="basic" />
                  </VStack>

                  {/* Stacked Area chart */}
                  <VStack gap={3}>
                    <Label>Stacked Area chart</Label>
                    <AreaChartDemo variant="stacked" />
                  </VStack>

                  {/* No Data Area chart */}
                  <VStack gap={3}>
                    <Label>No data</Label>
                    <AreaChartDemo variant="nodata" />
                  </VStack>
                </VStack>
              </Section>

              {/* Pie chart */}
              <Section
                id="pie-chart"
                title="Pie chart"
                description="Part-to-whole relationships with percentage labels on slices"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>구성 비율</strong>: 전체 대비 각 항목의 비율을 시각화합니다
                            (e.g. 스토리지 유형별 분포).
                          </li>
                          <li>
                            <strong>항목 수</strong>: 최대 7개를 권장합니다. 초과 시 나머지 항목을
                            &quot;기타(Others)&quot;로 그룹핑합니다.
                          </li>
                          <li>각 슬라이스에 퍼센트 라벨을 표시합니다.</li>
                          <li>
                            hover 시 해당 항목의 상세 값(이름, 수치, 비율)을 tooltip으로 표시합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>radius: 90px</code> · <code>label-threshold: 15%</code> ·{' '}
                      <code>legend: external</code> · <code>legend-scroll: 60px</code>
                    </div>
                  </VStack>

                  {/* Pie charts Examples */}
                  <VStack gap={3}>
                    <Label>Examples (from storage-dashboard)</Label>
                    <div className="flex gap-6 flex-wrap">
                      <PieChartDemo
                        title="OSD Types Summary"
                        data={[
                          { name: 'hdd', value: 15 },
                          { name: 'nvme', value: 25 },
                          { name: 'ssd', value: 30 },
                          { name: 'hybrid', value: 10 },
                          { name: 'sata', value: 5 },
                          { name: 'sas', value: 5 },
                          { name: 'pcie', value: 4 },
                          { name: 'u.2', value: 3 },
                          { name: 'm.2', value: 3 },
                          { name: 'scsi', value: 2 },
                          { name: 'fc', value: 2 },
                          { name: 'iscsi', value: 1 },
                        ]}
                      />
                      <PieChartDemo
                        title="OSD Objectstore Types"
                        data={[
                          { name: 'bluestore', value: 70 },
                          { name: 'filestore', value: 20 },
                          { name: 'seastore', value: 10 },
                        ]}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Half-Doughnut chart */}
              <Section
                id="half-doughnut-chart"
                title="Half-Doughnut chart"
                description="Progress and metric visualization with half-circular arc design"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>단일 지표</strong>: 하나의 리소스 사용률을 게이지 형태로
                            시각화합니다 (e.g. CPU 45%).
                          </li>
                          <li>
                            <strong>Status 색상</strong>: 사용률에 따라 Safe/Warning/Danger 색상이
                            자동 적용됩니다.
                          </li>
                          <li>중앙에 현재 값(퍼센트 또는 수치)을 크게 표시합니다.</li>
                          <li>
                            대시보드 Overview에서 주요 리소스 현황을 한눈에 보여줄 때 사용합니다.
                          </li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>arc-width: 14px</code> · <code>start-angle: 200°</code> ·{' '}
                      <code>end-angle: -20°</code>
                    </div>
                  </VStack>

                  {/* Status Variants */}
                  <VStack gap={3}>
                    <Label>Status variants</Label>
                    <div className="flex items-center gap-8 flex-wrap">
                      <HalfDoughnutChartDemo
                        value={35}
                        label="Safe"
                        status="success"
                        used={66.5}
                        total={189.9}
                        unit="TiB"
                      />
                      <HalfDoughnutChartDemo
                        value={75}
                        label="Warning"
                        status="warning"
                        used={142.4}
                        total={189.9}
                        unit="TiB"
                      />
                      <HalfDoughnutChartDemo
                        value={95}
                        label="Danger"
                        status="error"
                        used={180.4}
                        total={189.9}
                        unit="TiB"
                      />
                    </div>
                  </VStack>
                </VStack>
              </Section>

              {/* Doughnut chart */}
              <Section
                id="doughnut-chart"
                title="Doughnut chart"
                description="Ring chart for part-to-whole relationships with optional center metrics"
              >
                <VStack gap={8}>
                  {/* 사용 정책 */}
                  <VStack gap={3}>
                    <Label>사용 정책</Label>
                    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                      <VStack gap={2}>
                        <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                          사용 규칙
                        </h4>
                        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                          <li>
                            <strong>구성 비율 + 합계</strong>: Pie chart와 유사하지만, 중앙에
                            합계/핵심 수치를 표시할 수 있습니다.
                          </li>
                          <li>
                            <strong>Status 모드</strong>: 사용률 기반 시 Safe/Warning/Danger 색상이
                            적용됩니다.
                          </li>
                          <li>
                            <strong>항목 수</strong>: 최대 7개를 권장합니다. 초과 시
                            &quot;기타(Others)&quot;로 그룹핑합니다.
                          </li>
                          <li>hover 시 해당 항목의 상세 정보를 tooltip으로 표시합니다.</li>
                        </ul>
                      </VStack>
                    </div>
                  </VStack>

                  {/* Design Tokens */}
                  <VStack gap={3}>
                    <Label>Design tokens</Label>
                    <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <code>inner-radius: 68%</code> · <code>outer-radius: 80%</code> ·{' '}
                      <code>thickness: 12%</code> · <code>border-radius: 6px</code>
                    </div>
                  </VStack>

                  {/* Doughnut chart Example */}
                  <div className="flex gap-6 flex-wrap">
                    <DoughnutChartDemo title="OSD onode Hits Ratio" value={98.3} color="#ef4444" />
                  </div>
                </VStack>
              </Section>
            </VStack>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-10 h-10 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <IconChevronUp size={20} stroke={2} />
        </button>
      )}
    </div>
  );
}

/* Helper Components moved to ./design-system-sections/HelperComponents.tsx */
