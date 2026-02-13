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
import { CommonPatternsSection } from './design-system-sections/CommonPatterns';

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
  MenuDivider,
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
import { IconExpandOff, IconExpandOn } from '@/design-system/components/Icons/CustomIcons';
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
  { id: 'layout', label: 'Layout', icon: IconLayoutSidebar },
];

// Graphs - 차트 컴포넌트
const graphItems = [
  { id: 'status-colors', label: 'Status colors', icon: IconPalette },
  { id: 'bar-chart', label: 'Bar chart', icon: IconChartBar },
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
      render: (_: unknown, row: DemoImageRow) => <StatusIndicator status={row.status} />,
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
    { key: 'size', label: 'Size', sortable: true },
    { key: 'minDisk', label: 'Min disk', sortable: true },
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
                  <div className="inline-flex gap-1 p-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[8px] w-fit">
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
                            ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)] shadow-sm'
                            : 'bg-transparent border border-transparent text-[var(--color-text-default)]'
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
      {/* Design Tokens */}
      <VStack gap={3}>
        <Label>Section States (WizardSectionState)</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>'pre' | 'active' | 'done' | 'skipped' | 'writing'</code>
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
        {/* Design Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>width: 360px</code> · <code>padding: 16px</code> · <code>border-radius: 8px</code>{' '}
            · <code>shadow: lg</code>
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
        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 12px</code> · <code>gap: 12px</code> · <code>radius: 8px</code> ·{' '}
            <code>cell: 32×32px</code>
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
    <div className="inline-flex gap-2 p-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[8px] w-fit">
      <button
        onClick={() => setSelected('left')}
        className={`
          min-w-[80px] px-[10px] py-[6px] rounded-[6px] text-[length:var(--font-size-12)] font-medium leading-[var(--line-height-18)] text-center transition-all
          ${
            selected === 'left'
              ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)] shadow-sm'
              : 'bg-transparent border border-transparent text-[var(--color-text-default)]'
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
              ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)] shadow-sm'
              : 'bg-transparent border border-transparent text-[var(--color-text-default)]'
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
      <Label>With Value Display</Label>
      <div className="flex items-center gap-4 w-[var(--wizard-summary-width)]">
        <div className="flex-1">
          <Slider value={value} onChange={setValue} min={0} max={100} step={1} />
        </div>
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={1}
          className="w-[80px]"
        />
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
      <Label>Custom Range (0-1000 GB)</Label>
      <div className="flex items-center gap-4 w-[var(--wizard-summary-width)]">
        <div className="flex-1">
          <Slider value={value} onChange={setValue} min={0} max={1000} step={50} />
        </div>
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          max={1000}
          step={50}
          className="w-[80px]"
        />
      </div>
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
      <Label>Range Slider with Number Inputs</Label>
      <VStack gap={2}>
        <div className="flex items-center gap-4 w-1/2">
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
            className="w-[80px]"
          />
          <div className="flex-1">
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
          </div>
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
            className="w-[80px]"
          />
        </div>
        <p className="text-[11px] leading-4 text-[var(--color-text-subtle)]">
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
          <code>height: 36px</code> · <code>max-width: 160px</code> · <code>padding-x: 12px</code> ·{' '}
          <code>font: 12px</code>
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

      {/* With Icons */}
      <VStack gap={3}>
        <Label>With icons</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={[
              {
                id: 'home',
                label: 'Home',
                icon: <IconHome size={14} stroke={1.5} />,
                closable: false,
              },
              { id: 'docs', label: 'Documents', icon: <IconFile size={14} stroke={1.5} /> },
              { id: 'settings', label: 'Settings', icon: <IconSettings size={14} stroke={1.5} /> },
            ]}
            activeTab="docs"
            onTabChange={() => {}}
            onTabClose={() => {}}
            showAddButton={false}
          />
        </div>
      </VStack>

      {/* No Add Button */}
      <VStack gap={3}>
        <Label>Without Add Button</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={[
              { id: 'tab-a', label: 'Tab A' },
              { id: 'tab-b', label: 'Tab B' },
            ]}
            activeTab="tab-a"
            onTabChange={() => {}}
            onTabClose={() => {}}
            showAddButton={false}
          />
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
    createdAt: 'Sep 10, 2025',
  },
  {
    id: 'kp-002',
    name: 'dev-keypair',
    fingerprint: 'a3:b2:c1:d4:e5:f6:07:18:29:3a:4b:5c:6d:7e:8f:90',
    createdAt: 'Sep 8, 2025',
  },
  {
    id: 'kp-003',
    name: 'prod-keypair',
    fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00',
    createdAt: 'Sep 5, 2025',
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
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
          layout="icon-only"
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
      width: fixedColumns.actions,
      align: 'center' as const,
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] cursor-pointer">
            <IconTerminal2 size={16} stroke={1.5} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] cursor-pointer">
            <IconDotsVertical size={16} stroke={1.5} />
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
      width: columnMinWidths.name,
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
    { key: 'fixedIp', label: 'Fixed IP', width: columnMinWidths.fixedIp },
    {
      key: 'attachedTo',
      label: 'Attached to',
      flex: 1,
      render: (_: string | null, row: InstanceData) =>
        row.attachedTo && row.attachedToId ? (
          <div className="flex items-center gap-2">
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
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
          layout="icon-only"
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
    { key: 'fixedIp', label: 'Fixed IP', width: columnMinWidths.fixedIp },
    { key: 'image', label: 'Image', width: columnMinWidths.image },
    { key: 'flavor', label: 'Flavor', width: columnMinWidths.flavor },
  ];

  // Empty state columns
  const emptyColumns = [
    { key: 'status', label: 'Status', width: fixedColumns.status },
    { key: 'name', label: 'Name', flex: 1 },
    { key: 'fixedIp', label: 'Fixed IP', width: columnMinWidths.fixedIp },
    { key: 'image', label: 'Image', width: columnMinWidths.image },
  ];

  return (
    <VStack gap={8}>
      {/* Tokens */}
      <VStack gap={3}>
        <Label>Design Tokens & Features</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>cell-padding: 12×10px</code> · <code>header-padding: 12×8px</code> ·{' '}
          <code>radius: 8px</code> · <code>font: 12px</code>
          <br />
          <span className="text-[var(--color-text-muted)]">Features:</span>{' '}
          <code>overflow-x: auto</code> · <code>text-overflow: ellipsis</code> ·{' '}
          <code>title tooltip on hover</code>
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
          <div className="min-w-[var(--layout-content-min-width)]">
            <div className="max-w-[1000px] mx-auto">
              <VStack gap={12} align="stretch">
                {/* Header */}
                <div className="flex items-center justify-between w-full">
                  <VStack gap={2} align="start">
                    <h1 className="text-[length:var(--font-size-40)] font-semibold text-[var(--color-text-default)]">
                      TDS Design system
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
                      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 overflow-x-auto">
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
                      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 overflow-x-auto">
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
                      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 overflow-x-auto">
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

                {/* Icons */}
                <Section
                  id="icons"
                  title="Icons"
                  description="Tabler Icons & Custom Icons - Stroke width 1.5, Size 16-20px"
                >
                  <VStack gap={8}>
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
                              { name: 'padding-x', sm: '10px', md: '12px', lg: '12px' },
                              { name: 'padding-y', sm: '6px', md: '8px', lg: '10px' },
                              { name: 'gap', sm: '6px', md: '6px', lg: '8px' },
                              { name: 'font-size', sm: '12px', md: '12px', lg: '14px' },
                              { name: 'icon-size', sm: '12px', md: '12px', lg: '14px' },
                            ].map(({ name, sm, md, lg }) => (
                              <tr
                                key={name}
                                className="border-b border-[var(--color-border-subtle)]"
                              >
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
                        <code>radius: 6px (md)</code> · <code>border: slate-300 (secondary)</code> ·{' '}
                        <code>disabled-bg: slate-200 (primary)</code>
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
                          <strong>수직 정렬:</strong> 같은 행에 있는 요소는 같은 사이즈 사용 (Input
                          md + Button md ✓)
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
                            variant="secondary"
                            leftIcon={<IconPlayerPlay size={12} />}
                            disabled
                          >
                            Start
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            leftIcon={<IconPlus size={12} />}
                            disabled
                          >
                            Create
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            leftIcon={<IconEdit size={12} />}
                            disabled
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
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
                          <Button
                            size="sm"
                            variant="secondary"
                            leftIcon={<IconPlayerPlay size={12} />}
                          >
                            Start
                          </Button>
                          <Button size="sm" variant="secondary" leftIcon={<IconPlus size={12} />}>
                            Create
                          </Button>
                          <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>
                            Edit
                          </Button>
                          <Button size="sm" variant="secondary" leftIcon={<IconTrash size={12} />}>
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
                    {/* Design Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>height: 28/32px</code> · <code>padding: 10×8px</code> ·{' '}
                        <code>radius: 6px</code> · <code>font: 11-12px</code> ·{' '}
                        <code>border: 1px → 2px focus</code>
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
                        <Input
                          placeholder="Email"
                          rightElement={<IconMail size={14} />}
                          width="md"
                        />
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
                            <span className="text-body-md text-[var(--color-text-default)]">
                              GB
                            </span>
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
                            aria-describedby="suffix-gb"
                            rightElement={
                              <span
                                id="suffix-gb"
                                className="text-body-sm text-[var(--color-text-muted)]"
                              >
                                GB
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
                        <code>aria-describedby</code>로 suffix를 연결하면 스크린 리더가 "100 GB"로
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
                    {/* Design Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <strong>Spacing:</strong>
                        <br />
                        • Input/Select/NumberInput: Label ↔ Input: 8px, Input ↔ HelperText: 8px
                        <br />
                        • FormField: Label ↔ Input: 8px, Label ↔ Description: 4px, Description ↔
                        Input: 8px, Input ↔ HelperText: 8px
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
                          <span className="text-label-sm text-[var(--color-text-subtle)]">
                            Input
                          </span>
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
                          <span className="text-label-sm text-[var(--color-text-subtle)]">
                            Input
                          </span>
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
                        Description explains the field purpose, Helper provides input format
                        guidance
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
                  </VStack>
                </Section>

                {/* Filter search Input Component */}
                <Section
                  id="filter-search-input"
                  title="Filter search Input"
                  description="Combined search and filter input with tag display for applied filters"
                >
                  <VStack gap={8}>
                    {/* Design Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>height: 32px (sm) / 36px (md)</code> · <code>padding: 8×12px</code> ·{' '}
                        <code>radius: 6px</code> · <code>font: 12px</code> ·{' '}
                        <code>chip-gap: 4px</code>
                      </div>
                    </VStack>

                    {/* Features */}
                    <VStack gap={3}>
                      <Label>Features</Label>
                      <ul className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] list-disc list-inside space-y-1">
                        <li>Click input to show available filter options</li>
                        <li>
                          Select filter field, then enter value (text) or select option (select
                          type)
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>padding: 10×8px</code> · <code>radius: 6px</code> ·{' '}
                        <code>font: 12px</code> · <code>item: 10×6px, 11px</code> ·{' '}
                        <code>border: 1px → 2px focus</code>
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>track: 6px height</code> · <code>thumb: 16px, 3px border</code> ·{' '}
                        <code>fill: primary</code>
                      </div>
                    </VStack>

                    {/* Basic */}
                    <VStack gap={3}>
                      <Label>Basic</Label>
                      <div className="w-[var(--wizard-summary-width)]">
                        <Slider defaultValue={40} />
                      </div>
                    </VStack>

                    {/* With Value Display */}
                    <SliderWithNumberInputDemo />

                    {/* Custom Range */}
                    <SliderWithCustomRangeDemo />

                    {/* States */}
                    <VStack gap={3}>
                      <Label>States</Label>
                      <div className="flex flex-col gap-4">
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Default
                          </span>
                          <div className="w-[var(--wizard-summary-width)]">
                            <Slider defaultValue={30} />
                          </div>
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Disabled
                          </span>
                          <div className="w-[var(--wizard-summary-width)]">
                            <Slider defaultValue={60} disabled />
                          </div>
                        </VStack>
                      </div>
                    </VStack>

                    {/* Range Slider with Number Inputs */}
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>padding: 8×4px</code> · <code>gap: 6px</code> ·{' '}
                        <code>radius: 6px</code> · <code>font: 11px</code>
                      </div>
                    </VStack>

                    {/* Basic */}
                    <VStack gap={3}>
                      <Label>Basic</Label>
                      <div className="flex gap-2 flex-wrap">
                        <Chip value="Active" />
                        <Chip value="Running" />
                        <Chip value="Completed" />
                      </div>
                    </VStack>

                    {/* With Label (Key-Value) */}
                    <VStack gap={3}>
                      <Label>With Label (Key-Value)</Label>
                      <div className="flex gap-2 flex-wrap">
                        <Chip label="Status" value="Active" />
                        <Chip label="Region" value="Korea" />
                        <Chip label="Type" value="Standard" />
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>min-height: 42px</code> · <code>padding: 8×12px</code> ·{' '}
                        <code>radius: table-row-radius</code> · <code>gap: 16px</code>
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

                    {/* Non-removable */}
                    <VStack gap={3}>
                      <Label>Non-removable (Read-only)</Label>
                      <SelectionIndicator
                        selectedItems={[{ id: '1', label: 'production-network' }]}
                        removable={false}
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>item-size: 24px</code> · <code>gap: 4px</code> ·{' '}
                        <code>radius: 4px</code> · <code>font: 11px</code>
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
                        When rows are selected in a table, the pagination shows "X selected / Y
                        items" format.
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>spinner: 16/22/32px</code> · <code>progress: h-1</code> ·{' '}
                        <code>button: min-w-80px</code>
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>track: 48×24px</code> · <code>thumb: 16×16px</code> ·{' '}
                        <code>padding: 4px</code> · <code>radius: pill</code> ·{' '}
                        <code>gap: 8px</code>
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
                        <code>size: 24×12px</code> · <code>thumb: 8×8px</code> ·{' '}
                        <code>border: 1px</code> · <code>radius: 6px</code>
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>size: 16×16px</code> · <code>radius: 4px</code> ·{' '}
                        <code>gap: 6px</code> · <code>icon: 12px</code>
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>size: 16×16px</code> · <code>dot: 6px</code> ·{' '}
                        <code>border: 2px</code> · <code>gap: 6px</code>
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
                        <RadioGroup
                          label="Horizontal layout"
                          defaultValue="a"
                          direction="horizontal"
                        >
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>height: 40px</code> · <code>padding-x: 12px</code> ·{' '}
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
                  <TabBarDemo />
                </Section>

                {/* Tabs Component */}
                <Section
                  id="tabs"
                  title="Tabs"
                  description="Tabs for navigation between views with underline and boxed variants"
                >
                  <VStack gap={8}>
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>gap: 24px</code> · <code>min-width: 80px</code> ·{' '}
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
                              <p>Size: 100 GB</p>
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>padding: 12px</code> · <code>gap: 8px</code> ·{' '}
                        <code>radius: 6px</code> · <code>icon: 16px</code> · <code>font: 12px</code>
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
                        multi-line content. The text will wrap naturally and the icon stays aligned
                        to the top.
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
                  <TableDemo />
                </Section>

                {/* Badge Component */}
                <Section
                  id="badge"
                  title="Badge"
                  description="Status indicators and labels with various styles"
                >
                  <VStack gap={8}>
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
                              <td className="py-2 font-mono text-[var(--color-text-muted)]">
                                16px
                              </td>
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
                              <td className="py-2 font-mono text-[var(--color-text-muted)]">
                                16px
                              </td>
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
                              <td className="py-2 font-mono text-[var(--color-text-muted)]">
                                20px
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
                        <code>radius: 6px</code> · <code>gap: 4px</code> ·{' '}
                        <code>dot-size: 6px</code>
                      </div>
                    </VStack>

                    {/* Sizes */}
                    <VStack gap={3}>
                      <Label>Sizes</Label>
                      <div className="flex gap-3 items-center">
                        <Badge size="sm">Small</Badge>
                        <Badge size="md">Medium</Badge>
                        <Badge size="lg">Large</Badge>
                      </div>
                    </VStack>

                    {/* Types */}
                    <VStack gap={3}>
                      <Label>Types</Label>
                      <div className="flex gap-6">
                        <VStack gap={2}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Solid
                          </span>
                          <div className="flex gap-2">
                            <Badge size="sm" type="solid" theme="blue">
                              Blue
                            </Badge>
                            <Badge size="sm" type="solid" theme="green">
                              Green
                            </Badge>
                            <Badge size="sm" type="solid" theme="red">
                              Red
                            </Badge>
                            <Badge size="sm" type="solid" theme="yellow">
                              Yellow
                            </Badge>
                            <Badge size="sm" type="solid" theme="gray">
                              Gray
                            </Badge>
                          </div>
                        </VStack>
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

                    {/* Status Examples */}
                    <VStack gap={3}>
                      <Label>Status examples</Label>
                      <div className="flex gap-3 items-center">
                        <Badge size="sm" type="solid" theme="green">
                          Running
                        </Badge>
                        <Badge size="sm" type="solid" theme="red">
                          Stopped
                        </Badge>
                        <Badge size="sm" type="solid" theme="yellow">
                          Warning
                        </Badge>
                        <Badge size="sm" type="solid" theme="gray">
                          Unknown
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
                          <StatusIndicator status="active" />
                        </Tooltip>
                      </div>
                    </VStack>

                    <VStack gap={3}>
                      <Label>Error</Label>
                      <div className="flex flex-wrap gap-3 items-center">
                        <Tooltip content="error">
                          <StatusIndicator status="error" />
                        </Tooltip>
                      </div>
                    </VStack>

                    <VStack gap={3}>
                      <Label>Action (Blue)</Label>
                      <div className="flex flex-wrap gap-3 items-center">
                        <Tooltip content="building">
                          <StatusIndicator status="building" />
                        </Tooltip>
                        <Tooltip content="deleting">
                          <StatusIndicator status="deleting" />
                        </Tooltip>
                        <Tooltip content="pending">
                          <StatusIndicator status="pending" />
                        </Tooltip>
                      </div>
                    </VStack>

                    <VStack gap={3}>
                      <Label>Warning (Orange)</Label>
                      <div className="flex flex-wrap gap-3 items-center">
                        <Tooltip content="verify-resized">
                          <StatusIndicator status="verify-resized" />
                        </Tooltip>
                        <Tooltip content="degraded">
                          <StatusIndicator status="degraded" />
                        </Tooltip>
                        <Tooltip content="no-monitor">
                          <StatusIndicator status="no-monitor" />
                        </Tooltip>
                        <Tooltip content="down">
                          <StatusIndicator status="down" />
                        </Tooltip>
                        <Tooltip content="maintenance">
                          <StatusIndicator status="maintenance" />
                        </Tooltip>
                      </div>
                    </VStack>

                    <VStack gap={3}>
                      <Label>Muted (Gray)</Label>
                      <div className="flex flex-wrap gap-3 items-center">
                        <Tooltip content="suspended">
                          <StatusIndicator status="suspended" />
                        </Tooltip>
                        <Tooltip content="shelved-offloaded">
                          <StatusIndicator status="shelved-offloaded" />
                        </Tooltip>
                        <Tooltip content="mounted">
                          <StatusIndicator status="mounted" />
                        </Tooltip>
                        <Tooltip content="shutoff">
                          <StatusIndicator status="shutoff" />
                        </Tooltip>
                        <Tooltip content="paused">
                          <StatusIndicator status="paused" />
                        </Tooltip>
                        <Tooltip content="draft">
                          <StatusIndicator status="draft" />
                        </Tooltip>
                        <Tooltip content="deactivated">
                          <StatusIndicator status="deactivated" />
                        </Tooltip>
                        <Tooltip content="in-use">
                          <StatusIndicator status="in-use" />
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
                              <StatusIndicator status="active" layout="icon-only" />
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
                              <StatusIndicator status="error" layout="icon-only" />
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
                              <StatusIndicator status="building" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                building
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="deleting" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                deleting
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="pending" layout="icon-only" />
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
                              <StatusIndicator status="verify-resized" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                verify-resized
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="degraded" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                degraded
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="no-monitor" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                no-monitor
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="down" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                down
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="maintenance" layout="icon-only" />
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
                              <StatusIndicator status="suspended" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                suspended
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="shelved-offloaded" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                shelved
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="mounted" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                mounted
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="shutoff" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                shutoff
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="paused" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                paused
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="draft" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                draft
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="deactivated" layout="icon-only" />
                              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                                deactivated
                              </span>
                            </VStack>
                            <VStack gap={1} align="center">
                              <StatusIndicator status="in-use" layout="icon-only" />
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
                        <StatusIndicator status="active" label="Running" />
                        <StatusIndicator status="error" label="Failed" />
                        <StatusIndicator status="building" label="Deploying..." />
                      </div>
                    </VStack>

                    {/* Color Reference - Semantic Status Tokens */}
                    <VStack gap={3}>
                      <Label>Semantic Color Tokens</Label>
                      <div className="grid grid-cols-5 gap-2 text-[length:var(--font-size-10)]">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-[var(--status-success-bg)]" />
                          <span className="text-[var(--color-text-subtle)]">
                            --status-success-bg
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-[var(--status-danger-bg)]" />
                          <span className="text-[var(--color-text-subtle)]">
                            --status-danger-bg
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-[var(--status-info-bg)]" />
                          <span className="text-[var(--color-text-subtle)]">--status-info-bg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-[var(--status-warning-bg)]" />
                          <span className="text-[var(--color-text-subtle)]">
                            --status-warning-bg
                          </span>
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>padding: 8×4px</code> · <code>radius: 4px</code> ·{' '}
                        <code>font-size: 11px</code> · <code>min-width: 60px</code> ·{' '}
                        <code>max-width: 230px</code> · <code>arrow: 4px</code>
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
                            icon={<IconTrash size={16} />}
                            aria-label="Delete"
                          />
                        </Tooltip>
                        <Tooltip content="Add to favorites">
                          <Button
                            variant="ghost"
                            icon={<IconStar size={16} />}
                            aria-label="Favorite"
                          />
                        </Tooltip>
                        <Tooltip content="Copy to clipboard">
                          <Button
                            variant="secondary"
                            icon={<IconCopy size={12} />}
                            aria-label="Copy"
                          />
                        </Tooltip>
                        <Tooltip content="This action requires admin permissions" position="bottom">
                          <Badge variant="warning">Restricted</Badge>
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
                                Hover content with interactive elements
                              </p>
                              <Button variant="secondary" size="sm" className="mt-2">
                                Action
                              </Button>
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
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Minimize + Close
                          </span>
                          <WindowControls showMaximize={false} />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                            Close Only
                          </span>
                          <WindowControls showMinimize={false} showMaximize={false} />
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

                {/* Common Patterns */}
                <Section
                  id="common-patterns"
                  title="Common patterns"
                  description="애플리케이션 전체에서 공통으로 사용되는 UI 패턴 모음입니다. List Page, Detail Page, Drawer, Modal 등의 패턴을 확인할 수 있습니다."
                >
                  <CommonPatternsSection />
                </Section>

                {/* DetailHeader Component */}
                <Section
                  id="detail-header"
                  title="Detail header"
                  description="Page header component for resource detail views with title, actions, and info cards"
                >
                  <VStack gap={8}>
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>container.padding: 16×12px</code> · <code>container.radius: 8px</code>{' '}
                        · <code>container.gap: 12px</code> · <code>title: 16px semibold</code> ·{' '}
                        <code>actions.gap: 4px</code> · <code>info-grid.gap: 8px</code> ·{' '}
                        <code>info-card.padding: 16×12px</code> · <code>info-card.radius: 8px</code>{' '}
                        · <code>info-card.gap: 6px</code>
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
                          <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025" />
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
                        <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025" />
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
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconEdit size={12} />}
                              >
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
                          <MenuItem
                            icon={<IconHome size={16} stroke={1.5} />}
                            label="Home"
                            active
                          />
                          <MenuDivider />
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
                            <MenuItem
                              icon={<IconRouter size={16} stroke={1.5} />}
                              label="Routers"
                            />
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
                          <span className="text-body-xs text-[var(--color-text-subtle)]">
                            Basic
                          </span>
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
                              Delete forever
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
                          { id: 'copy', label: 'Copy', onClick: () => {}, divider: true },
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
                          { id: 'share', label: 'Share', onClick: () => {}, divider: true },
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
                            label: 'Delete forever',
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
                    {/* Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>padding: 16px</code> · <code>gap: 24px</code> ·{' '}
                        <code>radius: 16px</code> · <code>backdrop: black/60</code>
                      </div>
                    </VStack>

                    {/* Size Guide */}
                    <VStack gap={3}>
                      <Label>Size</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>width: 344px</code> (모든 사이즈 동일)
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
                          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
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
                          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
                            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
                              Security groups (6)
                            </span>
                            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
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
                              This action will permanently delete the resource. This cannot be
                              undone.
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
                    {/* Design Tokens */}
                    <VStack gap={3}>
                      <Label>Design tokens</Label>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <code>width: 376px (default)</code> · <code>padding-x: 24px</code> ·{' '}
                        <code>padding-y: 16px</code> · <code>animation: 300ms ease-out</code>
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
                              <td className="py-2 text-[var(--color-text-default)]">
                                Drawer title
                              </td>
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
                              <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                ReactNode
                              </td>
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
                              <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                new Date()
                              </td>
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

                {/* Floating card Section */}
                <Section
                  id="floating-card"
                  title="Floating card"
                  description="Floating summary card for create/edit flows with sections, quota, and actions"
                >
                  <VStack gap={8}>
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
                              <NumberInput
                                value={1}
                                onChange={() => {}}
                                min={1}
                                max={10}
                                fullWidth
                              />
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
                          <div
                            className="size-4 rounded-full border border-[var(--color-text-muted)] animate-spin"
                            style={{ borderStyle: 'dashed', animationDuration: '2s' }}
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
                              <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                                'top-left'
                              </td>
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

                {/* Layout Section */}
                <Section
                  id="layout"
                  title="Layout"
                  description="Application layout structure with responsive sidebar"
                >
                  <VStack gap={8}>
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
                              <td className="py-3 pr-4 text-[var(--color-text-muted)]">
                                1720px max
                              </td>
                              <td className="py-3 text-[var(--color-text-muted)]">
                                Sidebar toggle
                              </td>
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
                              <td className="py-3 pr-4 text-[var(--color-text-muted)]">
                                1240px max
                              </td>
                              <td className="py-3 text-[var(--color-text-muted)]">
                                Sidebar toggle
                              </td>
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
                              <IconChevronLeft
                                size={12}
                                className="text-[var(--color-text-muted)]"
                              />
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
--layout-sidebar-width: 200px;   /* Fixed sidebar width */
--layout-sidebar-collapsed: 0px; /* Collapsed state */

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
                      <span className="text-[var(--color-text-subtle)]">
                        Area / Pie / Doughnut:
                      </span>{' '}
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

                {/* Status colors */}
                <Section
                  id="status-colors"
                  title="Status colors"
                  description="Shared color thresholds for usage-based charts including bar charts, half-doughnut, and doughnut charts"
                >
                  <VStack gap={8}>
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
                          <code>
                            {'<ProgressBar thresholds={STATUS_THRESHOLDS.compute} ... />'}
                          </code>
                        </div>
                        <div className="mt-2 text-[var(--color-text-muted)]">
                          Available presets: <code>compute</code> · <code>computeAdmin</code> ·{' '}
                          <code>storage</code> · <code>container</code> · <code>default</code>
                        </div>
                      </div>
                    </VStack>
                  </VStack>
                </Section>

                {/* Bar chart */}
                <Section
                  id="bar-chart"
                  title="Bar chart"
                  description="Visual indicator for quota usage and progress with status-based colors"
                >
                  <VStack gap={8}>
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
                        <ProgressBar
                          label="100 MB (100%)"
                          value={100}
                          max={100}
                          showValue={false}
                        />
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
                      <DoughnutChartDemo
                        title="OSD onode Hits Ratio"
                        value={98.3}
                        color="#ef4444"
                      />
                    </div>
                  </VStack>
                </Section>
              </VStack>
            </div>
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
